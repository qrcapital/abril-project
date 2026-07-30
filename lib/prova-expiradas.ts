// Fechamento das tentativas abandonadas: a prova cujo prazo estourou com a aba fechada.
//
// Sem `server-only` e sem `cache` do React de propósito. Este módulo precisa rodar em mais
// de um runtime — no Next, no script de linha de comando e em quem vier a agendá-lo — e o
// `lib/prova.ts` não serve para isso, porque importa os dois e eles estouram fora de um
// bundle React Server. O cliente do Supabase entra por parâmetro pela mesma razão: quem
// chama decide de onde vêm as credenciais.
//
// A regra de nota NÃO é reimplementada aqui: `corrigir()` é a mesma função que o envio pelo
// botão usa. O PRD §15 previa esta rotina em `pg_cron`, e escrever a correção em SQL daria
// duas verdades que divergiriam em silêncio no dia em que a nota de corte mudasse.

import type { SupabaseClient } from "@supabase/supabase-js";

import { corrigir, type QuestaoSnapshot, type Respostas } from "./prova-correcao.ts";

/** O que interessa de uma tentativa em aberto para poder fechá-la. */
export type LinhaExpirada = {
  id: string;
  deadline: string;
  questions_snapshot: QuestaoSnapshot[] | null;
  answers: Respostas | null;
};

export type Fechamento = {
  id: string;
  score: number;
  aprovado: boolean;
  submitted_at: string;
};

const COLUNAS = "id, deadline, questions_snapshot, answers";

/** As tentativas `in_progress` cujo deadline já passou. */
export async function listarExpiradas(
  db: SupabaseClient,
  agora: Date = new Date(),
): Promise<LinhaExpirada[]> {
  const { data, error } = await db
    .from("exams")
    .select(COLUNAS)
    .eq("status", "in_progress")
    .not("deadline", "is", null)
    .lt("deadline", agora.toISOString());
  if (error) throw error;
  return (data ?? []) as LinhaExpirada[];
}

/**
 * Decide o fechamento de cada tentativa vencida. Puro, para o check exercitar a decisão
 * sem banco nenhum.
 *
 * `submitted_at` recebe o **deadline**, não o instante em que a rotina rodou: a prova
 * terminou quando o tempo acabou. Amarrar a data à execução faria o registro depender da
 * cadência do agendador, e uma rotina que rodasse atrasada empurraria a entrega do aluno
 * para frente — inclusive para depois do fim do acesso dele.
 *
 * Questão em branco conta como erro e o denominador segue sendo o total da prova, que é o
 * que o PRD pede para o deadline estourado: corrige o respondido, sem anular a tentativa
 * nem extrapolar nota. Isso já é o comportamento do `corrigir()`.
 */
export function planejarFechamentos(linhas: LinhaExpirada[]): Fechamento[] {
  return linhas.map((l) => {
    const c = corrigir(l.questions_snapshot ?? [], l.answers ?? {});
    return { id: l.id, score: c.score, aprovado: c.aprovado, submitted_at: l.deadline };
  });
}

/**
 * Fecha as tentativas vencidas e devolve as que realmente mudaram de estado.
 *
 * O `.eq("status", "in_progress")` no update é o mesmo guard do envio normal
 * (`lib/prova.ts`): se o aluno reabriu a aba e enviou entre a leitura e a escrita, o update
 * não encontra linha e a correção dele é a que fica. Por isso o retorno lista o aplicado, e
 * não o planejado — a diferença entre os dois é exatamente a corrida, e é o que vale logar.
 *
 * Laço sequencial: são as provas vencidas de uma turma, não um lote grande.
 * ponytail: um update por tentativa; se algum dia isso virar volume, virar um único
 * update com `in(ids)` e comparar as linhas devolvidas.
 */
export async function fecharExpiradas(
  db: SupabaseClient,
  agora: Date = new Date(),
): Promise<Fechamento[]> {
  const planejados = planejarFechamentos(await listarExpiradas(db, agora));

  const aplicados: Fechamento[] = [];
  for (const f of planejados) {
    const { data, error } = await db
      .from("exams")
      .update({ status: "submitted", score: f.score, submitted_at: f.submitted_at })
      .eq("id", f.id)
      .eq("status", "in_progress")
      .select("id");
    if (error) throw error;
    if ((data ?? []).length > 0) aplicados.push(f);
  }
  return aplicados;
}

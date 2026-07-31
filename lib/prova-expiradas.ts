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

import { emitirCertificado } from "./certificados.ts";
import { enviarEmail } from "./email.ts";
// `with { type: "json" }` e não import solto: este módulo roda também em node puro (o
// `npm run check:prova` e o `npm run prova:expiradas`), onde JSON sem atributo não carrega.
import contato from "./contato.json" with { type: "json" };
import { corrigir, type QuestaoSnapshot, type Respostas } from "./prova-correcao.ts";

/** O que interessa de uma tentativa em aberto para poder fechá-la. */
export type LinhaExpirada = {
  id: string;
  /** De quem é a tentativa. Existe aqui só para o e-mail de resultado achar o destinatário. */
  user_id: string;
  deadline: string;
  questions_snapshot: QuestaoSnapshot[] | null;
  answers: Respostas | null;
};

export type Fechamento = {
  id: string;
  user_id: string;
  score: number;
  aprovado: boolean;
  submitted_at: string;
};

const COLUNAS = "id, user_id, deadline, questions_snapshot, answers";

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
    return {
      id: l.id,
      user_id: l.user_id,
      score: c.score,
      aprovado: c.aprovado,
      submitted_at: l.deadline,
    };
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
    if ((data ?? []).length > 0) {
      aplicados.push(f);
      // Prova abandonada TAMBÉM aprova: dá para acertar 14 das 20 e fechar a aba. Sem esta linha, o
      // aluno aprovado por aqui receberia o e-mail do certificado e encontraria a tela sem código.
      const cert = f.aprovado ? await emitirCertificado(db, f.user_id) : null;
      await avisarResultado(db, f, cert?.codigo ?? "");
    }
  }
  return aplicados;
}

/**
 * O e-mail de resultado de quem NÃO estava com a tela aberta (PRD §14, templates 9 e 10).
 *
 * ESTE É O CASO EM QUE O E-MAIL MAIS IMPORTA, e ficou de fora quando a camada de envio nasceu: o
 * `enviar()` de `lib/prova.ts` cobre quem clicou em "Enviar", e quem fechou o navegador e teve a
 * prova encerrada por esta rotina não recebia nada. Justamente quem não tem como saber o resultado
 * pela tela.
 *
 * Só depois do update bem-sucedido, e só para as tentativas que mudaram de estado, pelo mesmo motivo
 * de lá: a corrida em que o aluno reabriu a aba e enviou antes da rotina não pode render dois
 * e-mails.
 *
 * `enviarEmail` não lança e registra a tentativa no `email_log`, então uma falha de entrega aqui não
 * desfaz o fechamento nem interrompe o laço das outras provas.
 */
async function avisarResultado(db: SupabaseClient, f: Fechamento, codigo: string): Promise<void> {
  const { data, error } = await db.auth.admin.getUserById(f.user_id);
  const conta = data?.user;
  if (error || !conta?.email) {
    console.error(`[prova-expiradas] sem e-mail para ${f.user_id}, resultado nao avisado`);
    return;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  await enviarEmail(db, {
    chave: f.aprovado ? "resultado-aprovado" : "resultado-reprovado",
    para: conta.email,
    userId: f.user_id,
    dados: {
      nome: ((conta.user_metadata?.nome as string | undefined) ?? "").trim().split(/\s+/)[0] ?? "",
      nota: f.score,
      codigo,
      link: f.aprovado ? `${site}/app/certificado` : contato.whatsapp,
    },
  });
}

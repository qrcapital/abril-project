import "server-only";
import { cache } from "react";

import { getUsuario } from "@/lib/usuario";
import { createAdminClient } from "@/lib/supabase/admin";
import { emitirCertificado } from "@/lib/certificados";
import { enviarEmail } from "@/lib/email";
import contato from "@/lib/contato.json";
import {
  corrigir,
  MINUTOS,
  TOTAL_QUESTOES,
  type Correcao,
  type Letra,
  type QuestaoCliente,
  type QuestaoSnapshot,
  type Respostas,
} from "@/lib/prova-correcao";

/**
 * Motor da prova: o lado que fala com o banco. A regra de nota vive no
 * `lib/prova-correcao.ts`, sem IO.
 *
 * Tudo aqui usa a **service role**, por decisão de schema (`AGENTS.md`): a tabela
 * `exams` só tem policy de SELECT do próprio dono, e escrita (abrir tentativa,
 * corrigir) é operação confiável de servidor. O `sortear_prova()` também não é
 * exposto a `anon`/`authenticated`, então só a service role consegue chamá-lo.
 *
 * O `userId` SEMPRE vem da sessão resolvida no servidor, nunca de parâmetro do
 * cliente: com a service role, confiar num id vindo do navegador daria a qualquer
 * aluno a prova de qualquer outro.
 */

export type Tentativa = {
  id: string;
  attempt: number;
  status: "available" | "in_progress" | "submitted";
  score: number | null;
  deadline: string | null;
  submitted_at: string | null;
  questoes: QuestaoSnapshot[];
  respostas: Respostas;
};

const COLUNAS = "id, attempt, status, score, deadline, submitted_at, questions_snapshot, answers";

type LinhaExame = {
  id: string;
  attempt: number;
  status: Tentativa["status"];
  score: number | null;
  deadline: string | null;
  submitted_at: string | null;
  questions_snapshot: QuestaoSnapshot[] | null;
  answers: Respostas | null;
};

function daLinha(row: LinhaExame): Tentativa {
  return {
    id: row.id,
    attempt: row.attempt,
    status: row.status,
    score: row.score,
    deadline: row.deadline,
    submitted_at: row.submitted_at,
    questoes: row.questions_snapshot ?? [],
    respostas: row.answers ?? {},
  };
}

/**
 * A tentativa vigente do aluno: a de maior `attempt`. A 2ª chamada, quando o admin
 * liberar, nasce como attempt 2 e passa a ser esta.
 */
export async function tentativaAtual(userId: string): Promise<Tentativa | null> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("exams")
    .select(COLUNAS)
    .eq("user_id", userId)
    .order("attempt", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? daLinha(data as LinhaExame) : null;
}

/**
 * Abre a tentativa, ou devolve a que já existe (reentrada não reinicia, PRD §7).
 * O `deadline` nasce aqui, no banco, e é a única fonte do cronômetro.
 */
export async function abrirTentativa(userId: string): Promise<Tentativa> {
  const existente = await tentativaAtual(userId);
  if (existente) return existente;

  const db = createAdminClient();

  const { data: sorteadas, error: erroSorteio } = await db.rpc("sortear_prova");
  if (erroSorteio) throw erroSorteio;

  const linhas = (sorteadas ?? []) as {
    id: string;
    module_ord: number;
    enunciado: string;
    alternativas: string[];
  }[];

  // Falha alta em vez de abrir uma prova curta em silêncio: com menos de 5 questões
  // ativas em algum módulo, o sorteio balanceado devolve menos que o total.
  if (linhas.length !== TOTAL_QUESTOES) {
    throw new Error(
      `sortear_prova devolveu ${linhas.length} questoes, esperado ${TOTAL_QUESTOES}. ` +
        `Confira se cada modulo I..IV tem ao menos 5 questoes ativas.`,
    );
  }

  // O gabarito não vem do sorteio (a função não o seleciona, de propósito), então é
  // buscado aqui e congelado no snapshot: a correção compara contra o que o aluno viu,
  // mesmo que a questão seja editada no admin depois (PRD §7).
  const { data: gabarito, error: erroGabarito } = await db
    .from("questions")
    .select("id, correta")
    .in("id", linhas.map((l) => l.id));
  if (erroGabarito) throw erroGabarito;

  const corretaPor = new Map(
    (gabarito as { id: string; correta: number }[]).map((g) => [g.id, g.correta]),
  );

  const questoes: QuestaoSnapshot[] = linhas.map((l) => {
    const correta = corretaPor.get(l.id);
    if (correta === undefined) throw new Error(`questao ${l.id} sem gabarito`);
    return {
      id: l.id,
      modulo: l.module_ord,
      enunciado: l.enunciado,
      alternativas: l.alternativas,
      correta,
    };
  });

  const agora = new Date();
  const deadline = new Date(agora.getTime() + MINUTOS * 60_000);

  const { data, error } = await db
    .from("exams")
    .insert({
      user_id: userId,
      attempt: 1,
      status: "in_progress",
      started_at: agora.toISOString(),
      deadline: deadline.toISOString(),
      questions_snapshot: questoes,
      answers: {},
    })
    .select(COLUNAS)
    .single();

  // Corrida de duplo clique em "Iniciar prova": a unique (user_id, attempt) barra a
  // segunda inserção, e aí a tentativa que valeu é a que já está no banco.
  if (error) {
    const jaExiste = await tentativaAtual(userId);
    if (jaExiste) return jaExiste;
    throw error;
  }
  return daLinha(data as LinhaExame);
}

/**
 * O que pode chegar ao navegador. Monta a lista permitida em vez de descartar `correta`
 * por espalhamento: assim um campo sensível novo no snapshot fica de fora por padrão, em
 * vez de vazar até alguém lembrar de excluí-lo.
 */
export function semGabarito(questoes: QuestaoSnapshot[]): QuestaoCliente[] {
  return questoes.map((q) => ({
    id: q.id,
    modulo: q.modulo,
    enunciado: q.enunciado,
    alternativas: q.alternativas,
  }));
}

export type ResultadoSalvar = { ok: true } | { ok: false; motivo: "expirada" | "encerrada" };

/** Grava uma resposta. Depois do deadline não aceita mais nada. */
export async function salvarResposta(
  userId: string,
  posicao: number,
  letra: Letra,
): Promise<ResultadoSalvar> {
  const t = await tentativaAtual(userId);
  if (!t || t.status === "submitted") return { ok: false, motivo: "encerrada" };
  if (t.deadline && new Date(t.deadline).getTime() <= Date.now())
    return { ok: false, motivo: "expirada" };
  if (posicao < 1 || posicao > t.questoes.length) return { ok: false, motivo: "encerrada" };

  const respostas: Respostas = { ...t.respostas, [String(posicao)]: letra };
  const db = createAdminClient();
  const { error } = await db.from("exams").update({ answers: respostas }).eq("id", t.id);
  if (error) throw error;
  return { ok: true };
}

/**
 * Corrige e encerra. Idempotente: chamada duas vezes (duplo clique em "Enviar", ou
 * o cronômetro estourando junto com o clique) não recorrige nem muda a nota.
 */
export async function enviar(userId: string): Promise<Correcao> {
  const t = await tentativaAtual(userId);
  if (!t) throw new Error("sem tentativa para enviar");
  if (t.status === "submitted") return corrigir(t.questoes, t.respostas);

  const c = corrigir(t.questoes, t.respostas);
  const db = createAdminClient();
  const { error } = await db
    .from("exams")
    .update({
      status: "submitted",
      score: c.score,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", t.id)
    .eq("status", "in_progress"); // não sobrescreve uma correção que já aconteceu
  if (error) throw error;

  // O resultado por e-mail (PRD §14, templates 9 e 10). Depois do update e dentro do caminho que
  // só roda na TRANSIÇÃO: a saída antecipada de `status === "submitted"` lá em cima é o que garante
  // que duplo clique não manda dois e-mails.
  //
  // Aprovado recebe o e-mail do certificado e reprovado o do resultado, um por aluno. O PRD lista
  // os dois como e-mails separados, e disparar os dois na aprovação seria duas mensagens no mesmo
  // segundo dizendo a mesma coisa. Registrado no PRD §14.
  //
  // `enviarEmail` não lança: uma falha de e-mail não pode desfazer uma prova já corrigida, e a
  // tentativa fica registrada no `email_log` de qualquer jeito.
  const user = await getUsuario();

  // O CERTIFICADO É EMITIDO NA APROVAÇÃO, e não na primeira visita à tela dele. Duas razões: o código
  // passa a existir no instante em que o aluno tem direito a ele (o e-mail de aprovação já poderia
  // carregá-lo), e a emissão fica num lugar só em vez de num efeito colateral de renderizar página.
  // `emitirCertificado` é idempotente e não lança; falhar aqui não desfaz a prova.
  const cert = user && c.aprovado ? await emitirCertificado(db, user.id) : null;

  if (user?.email) {
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    await enviarEmail(db, {
      chave: c.aprovado ? "resultado-aprovado" : "resultado-reprovado",
      para: user.email,
      userId: user.id,
      dados: {
        nome: ((user.user_metadata?.nome as string | undefined) ?? "").trim().split(/\s+/)[0] ?? "",
        nota: c.score,
        // O código só existe no e-mail de aprovado, e é o que um RH pede quando o aluno diz que
        // concluiu. Sem certificado emitido a variável fica vazia, e o texto continua de pé.
        codigo: cert?.codigo ?? "",
        link: c.aprovado ? `${site}/app/certificado` : contato.whatsapp,
      },
    });
  }

  return c;
}

/**
 * O aluno logado passou na prova?
 *
 * Existe porque o certificado precisava de um porteiro e não tinha nenhum: até 29/jul,
 * qualquer conta logada abria `/app/certificado` e baixava um PDF com o próprio nome sem ter
 * feito a prova, apesar de o `ROUTES.md` já prometer o contrário.
 *
 * `cache()` porque o layout do grupo do certificado consulta para decidir a entrada, e é a
 * mesma resposta que a tela usaria depois.
 */
export const foiAprovado = cache(async (): Promise<boolean> => {
  const user = await getUsuario();
  if (!user) return false;
  const t = await tentativaAtual(user.id);
  if (!t || t.status !== "submitted") return false;
  return corrigir(t.questoes, t.respostas).aprovado;
});

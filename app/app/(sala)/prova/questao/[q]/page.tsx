import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { tela } from "@/lib/telas";
import { createClient } from "@/lib/supabase/server";
import { semGabarito, tentativaAtual } from "@/lib/prova";
import { restanteMs } from "@/lib/prova-correcao";
import { fillQuestao } from "@/lib/prova-template";
import QuizClient from "./QuizClient";

export const metadata: Metadata = { title: "Prova" };

const html = tela("prova-questao");

/**
 * Uma questão da tentativa em andamento. Tudo vem do servidor: o enunciado e as
 * alternativas do `questions_snapshot`, a resposta já dada e o tempo restante do
 * `deadline`. O gabarito é removido em `semGabarito` antes de qualquer coisa chegar ao
 * navegador.
 */
export default async function QuestaoPage({
  params,
}: {
  params: Promise<{ q: string }>;
}) {
  const { q } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  const t = await tentativaAtual(userId);
  if (!t) redirect("/app/prova");
  if (t.status === "submitted") redirect("/app/prova/resultado");

  const total = t.questoes.length;
  const posicao = Number(q);
  if (!Number.isInteger(posicao) || posicao < 1 || posicao > total)
    redirect("/app/prova/questao/1");

  const questao = semGabarito(t.questoes)[posicao - 1];
  const restante = t.deadline ? restanteMs(t.deadline) : 0;

  const pageHtml = fillQuestao(html, {
    questao,
    posicao,
    total,
    respondidas: Object.keys(t.respostas).length,
    escolhida: t.respostas[String(posicao)],
    restanteMs: restante,
  });

  // `key` remonta o client a cada questão. Sem isso o React reaproveita o mesmo nó e o
  // efeito precisaria desfazer à mão a pintura da questão anterior.
  return (
    <QuizClient
      key={posicao}
      html={pageHtml}
      posicao={posicao}
      total={total}
      restanteMs={restante}
    />
  );
}

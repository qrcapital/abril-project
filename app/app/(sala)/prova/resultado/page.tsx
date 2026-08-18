import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { tela } from "@/lib/telas";
import { getUsuario } from "@/lib/usuario";
import { preencherUsuario } from "@/lib/usuario-template";
import { tentativaAtual } from "@/lib/prova";
import { corrigir, resumoProva } from "@/lib/prova-correcao";
import { fillResultado, marcarPrazoEncerrado } from "@/lib/prova-template";
import ResultadoClient from "./ResultadoClient";

export const metadata: Metadata = { title: "Resultado da prova" };

const aprovado = tela("resultado");
const reprovado = tela("resultado-reprovado");

// A ordem em que as linhas de desempenho aparecem no design.
const MODULOS_NO_DESIGN = [1, 2, 3, 4];

/**
 * Resultado da tentativa enviada. A variante (aprovado/reprovado) e os números saem da
 * correção do snapshot, não de query string: o antigo `?r=reprovado` era atalho de
 * homolog e saiu junto com a correção real.
 */
export default async function ResultadoPage() {
  const user = await getUsuario();
  const userId = user?.id ?? "";

  const t = await tentativaAtual(userId);
  if (!t) redirect("/app/prova");
  // Com 2ª chamada liberada e não iniciada, a tentativa vigente não tem nota nem questões: o lugar
  // dele é a tela de instruções, não a questão 1 de uma prova que ainda não foi sorteada.
  if (t.status === "available") redirect("/app/prova");
  if (t.status !== "submitted") redirect("/app/prova/questao/1");

  const c = corrigir(t.questoes, t.respostas);

  // PRAZO ENCERRADO: `submitted_at` NO deadline ou depois dele é prova fechada pelo tempo, e
  // não pelo clique do aluno. A rotina de expiradas grava o deadline exato (igualdade), mas o
  // envio automático do cronômetro grava o instante REAL do zero, milissegundos depois — o
  // `===` original nunca casava nesse caminho e a tela era inalcançável. Quem entrega
  // clicando tem `submitted_at` antes do prazo.
  const porPrazo =
    !c.aprovado &&
    !!t.submitted_at &&
    !!t.deadline &&
    new Date(t.submitted_at).getTime() >= new Date(t.deadline).getTime();

  let base = c.aprovado ? aprovado : reprovado;
  if (porPrazo) {
    const r = resumoProva(t.questoes.length, Object.keys(t.respostas).map(Number));
    base = marcarPrazoEncerrado(base, r.respondidas, r.emBranco);
  }

  // "Você concluiu a formação, <nome>" era a segunda pior ocorrência do nome trocado.
  const html = preencherUsuario(fillResultado(base, c, MODULOS_NO_DESIGN), user);

  return <ResultadoClient html={html} />;
}

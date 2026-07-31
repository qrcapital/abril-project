import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { tela } from "@/lib/telas";
import { getUsuario } from "@/lib/usuario";
import { preencherUsuario } from "@/lib/usuario-template";
import { tentativaAtual } from "@/lib/prova";
import { corrigir } from "@/lib/prova-correcao";
import { fillResultado } from "@/lib/prova-template";
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
  // "Você concluiu a formação, <nome>" era a segunda pior ocorrência do nome trocado.
  const html = preencherUsuario(
    fillResultado(c.aprovado ? aprovado : reprovado, c, MODULOS_NO_DESIGN),
    user,
  );

  return <ResultadoClient html={html} />;
}

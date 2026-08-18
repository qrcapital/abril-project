import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { tela } from "@/lib/telas";
import { getUsuario } from "@/lib/usuario";
import { getConcluidas } from "@/lib/progresso";
import { getCurriculo } from "@/lib/curriculo";
import { getMatricula } from "@/lib/matricula";
import { liberacao } from "@/lib/liberacao";
import { getRegras } from "@/lib/politicas";
import { tentativaAtual } from "@/lib/prova";
import ProvaClient from "./ProvaClient";

export const metadata: Metadata = { title: "Prova Final" };

const html = tela("prova");

/**
 * Instruções da prova. Quem já começou não volta para cá: tentativa em andamento manda
 * para a questão, tentativa enviada manda para o resultado (PRD §7, reentrada não
 * reinicia). Sem o gate de 16/16, volta para a home.
 *
 * Quem TEM tentativa `available` volta para cá e é o caso da 2ª chamada: direito de fazer, prova
 * ainda não sorteada. As instruções são o lugar certo, porque o prazo de 120 minutos começa a contar
 * no "Iniciar prova" e não na liberação.
 */
export default async function ProvaPage() {
  const user = await getUsuario();
  const userId = user?.id ?? "";

  const t = await tentativaAtual(userId);
  if (t?.status === "submitted") redirect("/app/prova/resultado");
  // `available` NÃO cai aqui de propósito: é a 2ª chamada que o admin liberou e o aluno não começou,
  // e ela precisa passar pelas instruções (o cronômetro só nasce no "Iniciar prova"). Antes de
  // 31/jul/2026 este `if` era `if (t)`, e mandaria o aluno para uma questão sem prova sorteada.
  //
  // O redirect de `in_progress` vem ANTES da trava de calendário abaixo de propósito: o gate
  // vale para COMEÇAR, não para continuar. Trocar a política ativa no meio de uma tentativa
  // não pode trancar quem já está dentro (plano de correções de 17/ago, item 5).
  if (t?.status === "in_progress") redirect("/app/prova/questao/1");

  // Trava de CALENDÁRIO da política de liberação, vinda da matrícula, no servidor. O gate de
  // aulas abaixo também é servidor desde 29/jul (tabela `progress`); os dois são conferidos de
  // novo no `iniciarProva`, porque a action recebe POST direto sem passar por esta página.
  const { inicioEm, liberacaoTotal, politicaId } = await getMatricula();
  const regras = await getRegras(politicaId);
  if (!inicioEm || !liberacao(inicioEm, liberacaoTotal, regras).completo) redirect("/app");
  const curriculo = await getCurriculo();

  const concluidas = await getConcluidas();
  if (!curriculo.provaLiberada(concluidas)) redirect("/app");

  return <ProvaClient html={html} />;
}

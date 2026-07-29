import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { tela } from "@/lib/telas";
import { getUsuario } from "@/lib/usuario";
import { nomeCookie, parseConcluidas } from "@/lib/progresso";
import { provaLiberada } from "@/lib/curso";
import { tentativaAtual } from "@/lib/prova";
import ProvaClient from "./ProvaClient";

export const metadata: Metadata = { title: "Prova Final" };

const html = tela("prova");

/**
 * Instruções da prova. Quem já começou não volta para cá: tentativa em andamento manda
 * para a questão, tentativa enviada manda para o resultado (PRD §7, reentrada não
 * reinicia). Sem o gate de 16/16, volta para a home.
 */
export default async function ProvaPage() {
  const user = await getUsuario();
  const userId = user?.id ?? "";

  const t = await tentativaAtual(userId);
  if (t?.status === "submitted") redirect("/app/prova/resultado");
  if (t) redirect("/app/prova/questao/1");

  const concluidas = parseConcluidas((await cookies()).get(nomeCookie(userId))?.value);
  if (!provaLiberada(concluidas)) redirect("/app");

  return <ProvaClient html={html} />;
}

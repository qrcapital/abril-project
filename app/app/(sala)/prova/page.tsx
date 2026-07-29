import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { tela } from "@/lib/telas";
import { getUsuario } from "@/lib/usuario";
import { getConcluidas } from "@/lib/progresso";
import { getCurriculo } from "@/lib/curriculo";
import { getMatricula } from "@/lib/matricula";
import { liberacao } from "@/lib/liberacao";
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

  // Trava de CALENDÁRIO, e ela é a que tem dente. O gate de 16/16 abaixo é conferido contra um
  // cookie que o próprio aluno edita, então sozinho ele não impede nada: bastaria forjar o
  // cookie no dia 1, passar na prova e emitir o certificado dentro da janela de arrependimento,
  // que é exatamente o abuso que a esteira existe para evitar. Esta trava vem da matrícula, no
  // servidor, e não tem como ser forjada pelo navegador.
  const curriculo = await getCurriculo();
  const { inicioEm, liberacaoTotal } = await getMatricula();
  if (!inicioEm || !liberacao(inicioEm, liberacaoTotal, curriculo.modulos.length).completo)
    redirect("/app");

  const concluidas = await getConcluidas();
  if (!curriculo.provaLiberada(concluidas)) redirect("/app");

  return <ProvaClient html={html} />;
}

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AulaClient from "./AulaClient";
import { getCurriculo } from "@/lib/curriculo";
import { fillAula } from "@/lib/aula-template";
import { getConcluidas } from "@/lib/progresso";
import { getMateriais } from "@/lib/materiais";
import { getMatricula } from "@/lib/matricula";
import { liberacao } from "@/lib/liberacao";
import { getRegras } from "@/lib/politicas";
import { tela } from "@/lib/telas";

export const metadata: Metadata = { title: "Aula" };

const template = tela("aula");

export default async function AulaPage({
  params,
}: {
  params: Promise<{ m: string; n: string }>;
}) {
  const { n } = await params;
  const curriculo = await getCurriculo();
  const found = curriculo.acharAula(Number(n));
  if (!found) notFound();

  // Aula de módulo ainda fechado não abre. Sem esta guarda o gotejamento seria decorativo: as
  // aulas são alcançáveis pela URL, e bastaria digitar o endereço para pular a esteira.
  const { inicioEm, liberacaoTotal, politicaId } = await getMatricula();
  const regras = await getRegras(politicaId);
  const aberto =
    inicioEm && liberacao(inicioEm, liberacaoTotal, regras).abertos.has(found.aula.modulo);
  // Leva na URL QUAL módulo ele tentou, não a afirmação de que está travado: a home reconfere
  // no banco antes de dizer qualquer coisa. Sem esse parâmetro o aluno cairia na home sem
  // motivo nenhum e acharia que errou o clique.
  if (!aberto) redirect(`/app?travado=${found.aula.modulo}`);

  const [concluidas, materiais] = await Promise.all([
    getConcluidas(),
    getMateriais(found.aula.n),
  ]);
  return (
    <AulaClient
      html={fillAula(template, curriculo, found.aula, found.pos, concluidas, materiais)}
      concluidas={[...concluidas]}
    />
  );
}

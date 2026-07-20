import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ResultadoClient from "./ResultadoClient";

export const metadata: Metadata = { title: "Resultado da prova" };

const dir = join(process.cwd(), "app", "app", "_ui", "screens");
const aprovado = readFileSync(join(dir, "resultado.html"), "utf8");
const reprovado = readFileSync(join(dir, "resultado-reprovado.html"), "utf8");

export default async function ResultadoPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  // ?r=reprovado mostra a variante de reprovação (cenário de teste de homolog)
  return <ResultadoClient html={r === "reprovado" ? reprovado : aprovado} />;
}

import type { Metadata } from "next";
import { tela } from "@/lib/telas";
import ResultadoClient from "./ResultadoClient";

export const metadata: Metadata = { title: "Resultado da prova" };

const aprovado = tela("resultado");
const reprovado = tela("resultado-reprovado");

export default async function ResultadoPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  // ?r=reprovado mostra a variante de reprovação (cenário de teste de homolog)
  return <ResultadoClient html={r === "reprovado" ? reprovado : aprovado} />;
}

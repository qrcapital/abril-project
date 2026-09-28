import type { Metadata } from "next";
import DocumentoLegal from "@/app/_legal/documento";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a ABRIL e a BlockTrends coletam, usam e compartilham os dados pessoais de quem contrata a formação Estratégia Internacional.",
  alternates: { canonical: "/privacidade" },
  // Documento jurídico não é isca de busca: ele existe para quem já está na página e quer ler.
  // Sem o noindex, ele compete com a LP nos resultados para o nome do curso.
  robots: { index: false, follow: true },
};

export default function Privacidade() {
  return <DocumentoLegal tipo="politica" />;
}

import type { Metadata } from "next";
import DocumentoLegal from "@/app/_legal/documento";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de contratação e uso dos serviços educacionais da formação Estratégia Internacional, oferecida pela ABRIL e pela BlockTrends.",
  alternates: { canonical: "/termos-de-uso" },
  robots: { index: false, follow: true },
};

export default function TermosDeUso() {
  return <DocumentoLegal tipo="termos" />;
}

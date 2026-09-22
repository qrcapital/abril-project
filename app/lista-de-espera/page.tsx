import type { Metadata } from "next";
import Tela from "./Tela";
import Formulario from "./Formulario";

const SITE_URL = process.env.URL ?? "https://abril-project.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Lista de espera",
  description:
    "Entre na pré-lista da formação Estratégia Internacional e receba o convite da live de lançamento e o aviso da abertura das inscrições.",
  alternates: { canonical: "/lista-de-espera" },
  openGraph: {
    type: "website",
    title: "Estratégia Internacional | Lista de espera",
    description: "O caminho para tornar sua carteira global começa aqui.",
    images: [{ url: "/og-pre-lista.jpg", width: 1200, height: 630, alt: "VEJA Negócios apresenta Estratégia Internacional" }],
  },
};

export default function ListaDeEspera() {
  return (
    <Tela>
      <Formulario />
    </Tela>
  );
}

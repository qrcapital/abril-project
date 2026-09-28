import type { Metadata } from "next";
import Tela from "./Tela";
import Formulario from "./Formulario";
import { copyDaLive } from "./live";

const SITE_URL = process.env.URL ?? "https://abril-project.netlify.app";

/**
 * A página fala de uma live com data marcada, e `live.ts` troca cinco textos quando ela passa.
 *
 * ARMADILHA QUE ESTE NÚMERO RESOLVE: rota estática é avaliada UMA VEZ, no build. Sem
 * `revalidate`, uma página construída hoje de manhã continuaria dizendo "ao vivo · garanta seu
 * lugar" para sempre, e toda a lógica de `live.ts` seria enfeite. Com ele, a virada acontece na
 * primeira revalidação depois do horário.
 *
 * Meia hora, e não um dia: o atraso máximo entre a live acabar e a página admitir isso é este
 * número. Meia hora de descompasso é invisível; um dia é a página inteira mentindo.
 *
 * Literal, e não uma constante importada: o Next exige um valor estaticamente analisável aqui, e
 * `export const revalidate = MEIA_HORA` quebra o build.
 */
export const revalidate = 1800;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Lista de espera",
  // A descrição promete o convite antes da live e a gravação depois, pelo mesmo motivo do resto
  // da página: ela é o que aparece no preview do WhatsApp e no card do LinkedIn, onde uma
  // promessa vencida sobrevive por semanas sem ninguém ver.
  description: copyDaLive().descricao,
  alternates: { canonical: "/lista-de-espera" },
  openGraph: {
    type: "website",
    title: "Estratégia Internacional | Lista de espera",
    description: "O caminho para tornar sua carteira global começa aqui.",
    images: [{ url: "/og-pre-lista.jpg", width: 1200, height: 630, alt: "VEJA Negócios apresenta Estratégia Internacional" }],
  },
  // Sem isto o X/Twitter cai no card pequeno, com a imagem em miniatura ao lado do texto. A LP de
  // vendas já declarava; a pré-lista tinha ficado para trás.
  twitter: {
    card: "summary_large_image",
    title: "Estratégia Internacional | Lista de espera",
    description: "O caminho para tornar sua carteira global começa aqui.",
    images: ["/og-pre-lista.jpg"],
  },
};

export default function ListaDeEspera() {
  return (
    <Tela>
      <Formulario />
    </Tela>
  );
}

import type { Metadata } from "next";

/**
 * Os metadados da pré-lista, num módulo só para as duas rotas que a servem não divergirem.
 * O `canonical` vem de `fase.ts`: enquanto as vendas não abrem ele é a raiz, depois volta a ser
 * `/lista-de-espera`. Sem isso o buscador indexaria as duas como páginas distintas com o mesmo
 * conteúdo.
 */
import { URL_PRE_LISTA } from "@/app/_lp/fase";
import { copyDaLive } from "./live";

const SITE_URL = process.env.URL ?? "https://abril-project.netlify.app";


export const metadataPreLista: Metadata = {
  metadataBase: new URL(SITE_URL),
  /**
   * `absolute` pelo mesmo motivo da página do curso, e com o efeito inverso: aqui o template do
   * layout NÃO era aplicado na raiz, então a aba dizia só "Lista de espera", sem a marca, enquanto
   * em `/lista-de-espera` dizia o nome completo. Com o absoluto as duas rotas dizem a mesma coisa.
   */
  title: { absolute: "Lista de espera | Estratégia Internacional" },
  // A descrição promete o convite antes da live e a gravação depois, pelo mesmo motivo do resto
  // da página: ela é o que aparece no preview do WhatsApp e no card do LinkedIn, onde uma
  // promessa vencida sobrevive por semanas sem ninguém ver.
  description: copyDaLive().descricao,
  alternates: { canonical: URL_PRE_LISTA },
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

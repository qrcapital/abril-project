import type { Metadata } from "next";

/**
 * Os metadados da página do curso, num módulo só para as duas rotas que a servem não divergirem.
 * O `canonical` vem de `fase.ts` e acompanha a virada: enquanto as vendas não abrem ele aponta
 * para `/curso`, depois para a raiz. Sem isso o buscador indexaria as duas como páginas distintas
 * com o mesmo conteúdo.
 */
import { URL_CURSO } from "./fase";

const SITE_URL = process.env.URL ?? "https://abril-project.netlify.app";
const OG = {
  title: "Estratégia Internacional",
  description: "Seu patrimônio não devia depender de um só país.",
  images: [{ url: "/og-lp.png", width: 1200, height: 630, alt: "Estratégia Internacional" }],
};

export const metadataCurso: Metadata = {
  metadataBase: new URL(SITE_URL),
  /**
   * `absolute` para o template do layout raiz não entrar. O título já nomeia a marca, e na rota
   * `/curso` o template acrescentava um segundo "| Estratégia Internacional" no fim. Na raiz o
   * problema não aparecia, porque o template do layout não se aplica ao próprio segmento dele:
   * foi assim que o defeito atravessou meses invisível, e só apareceu quando a página ganhou uma
   * segunda rota.
   */
  title: { absolute: "Estratégia Internacional | Curso online de dolarização de patrimônio" },
  description:
    "Curso online de 30 horas sobre dolarização de patrimônio e investimento no exterior, com quatro professores que atuaram no Banco Central, na XP, na Caixa e no Bradesco. Chancela institucional da VEJA Negócios, conteúdo BlockTrends.",
  // A pré-lista já declarava o seu; a LP de vendas tinha ficado sem. Sem canonical, o
  // buscador escolhe sozinho entre a raiz, o domínio da Netlify e o domínio da Abril, que
  // vão servir o mesmo conteúdo durante a transição do CNAME.
  alternates: { canonical: URL_CURSO },
  openGraph: { ...OG, type: "website" },
  twitter: { card: "summary_large_image", ...OG },
};

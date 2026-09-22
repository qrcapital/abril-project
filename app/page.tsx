import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import HeroPointer from "./_lp/HeroPointer";
import GloboCanvas from "./_lp/GloboCanvas";
import CarrosselDots from "./_lp/CarrosselDots";
import VslMount from "./_lp/VslMount";
import GraficoEntrada from "./_lp/GraficoEntrada";

const SITE_URL = process.env.URL ?? "https://abril-project.netlify.app";
const OG = {
  title: "Estratégia Internacional",
  description: "Seu patrimônio não devia depender de um só país.",
  images: [{ url: "/og-lp.png", width: 1200, height: 630, alt: "Estratégia Internacional" }],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Estratégia Internacional | Curso online de dolarização de patrimônio",
  description:
    "Curso online de 30 horas sobre dolarização de patrimônio e investimento no exterior, com quatro professores que atuaram no Banco Central, na XP, na Caixa e no Bradesco. Chancela institucional da VEJA Negócios, conteúdo BlockTrends.",
  openGraph: { ...OG, type: "website" },
  twitter: { card: "summary_large_image", ...OG },
};

// Design real da LP: markup e CSS em app/_lp, assets em /public/lp. Renderizado
// como página estática. Nasceu de um bundle do Claude Design portado por
// scripts/port-lp.mjs; o script foi aposentado em 22/set/2026 e body.html e
// styles.css passaram a ser a fonte. Editar os dois direto (ver AGENTS.md).
// A leitura fica DENTRO do componente (roda no build p/ o SSG; em dev, a cada
// request) para que edições no body.html/styles.css apareçam sem reiniciar o
// dev server — o readFileSync em escopo de módulo era cacheado pelo Next.
export default function Home() {
  const dir = join(process.cwd(), "app", "_lp");
  // Sistema primeiro, estilo da LP depois: ele declara tokens e primitivas, e o
  // styles.css especializa por cima. Ver app/_design/sistema.css.
  const sistema = readFileSync(join(process.cwd(), "app", "_design", "sistema.css"), "utf8");
  const lpCss = readFileSync(join(dir, "styles.css"), "utf8");
  const lpBody = readFileSync(join(dir, "body.html"), "utf8");
  return (
    <>
      {/* Marca .tem-js no <html> ANTES da primeira pintura. Todo estado
          inicial fechado de animacao (ver `.tem-js .graf` no styles.css)
          pende desta classe, entao sem JS o conteudo aparece inteiro em vez
          de ficar invisivel esperando um observer que talvez nunca rode.
          Precisa ser inline e sincrono: um efeito de React roda depois da
          pintura e causaria flash. E precisa vir de page.tsx, porque script
          dentro de dangerouslySetInnerHTML nao executa. */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('tem-js')" }} />
      <style dangerouslySetInnerHTML={{ __html: sistema + "\n" + lpCss }} />
      {/* lining-nums: o Playfair vinha com algarismos oldstyle (3,4,5,7,9 descem
          abaixo da baseline; só 0/1/2 alinham). Força figuras lining para os
          números ficarem todos na mesma linha. Herda p/ toda a LP (não há
          shorthand `font:` que resete a propriedade). */}
      <div style={{ fontVariantNumeric: "lining-nums" }} dangerouslySetInnerHTML={{ __html: lpBody }} />
      <HeroPointer />
      <GloboCanvas />
      <CarrosselDots />
      <VslMount />
      <GraficoEntrada />
    </>
  );
}

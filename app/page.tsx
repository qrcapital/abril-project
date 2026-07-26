import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import HeroPointer from "./_lp/HeroPointer";
import GloboCanvas from "./_lp/GloboCanvas";
import CarrosselDots from "./_lp/CarrosselDots";

const SITE_URL = process.env.URL ?? "https://abril-project.netlify.app";
const OG = {
  title: "Estratégia Internacional",
  description: "Seu patrimônio não devia depender de um só país.",
  images: [{ url: "/og-lp.png", width: 1200, height: 630, alt: "Estratégia Internacional" }],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Estratégia Internacional | Dolarização de patrimônio com método",
  description:
    "Formação em dolarização de patrimônio e investimento internacional, com quatro especialistas que operaram esse mercado por dentro. Chancela institucional da VEJA Negócios, conteúdo BlockTrends.",
  openGraph: { ...OG, type: "website" },
  twitter: { card: "summary_large_image", ...OG },
};

// Design real da LP (bundle do Claude Design), portado por scripts/port-lp:
// markup e CSS reais + assets em /public/lp. Renderizado como página estática.
// A leitura fica DENTRO do componente (roda no build p/ o SSG; em dev, a cada
// request) para que edições no body.html/styles.css apareçam sem reiniciar o
// dev server — o readFileSync em escopo de módulo era cacheado pelo Next.
export default function Home() {
  const dir = join(process.cwd(), "app", "_lp");
  const lpCss = readFileSync(join(dir, "styles.css"), "utf8");
  const lpBody = readFileSync(join(dir, "body.html"), "utf8");
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: lpCss }} />
      {/* lining-nums: o Playfair vinha com algarismos oldstyle (3,4,5,7,9 descem
          abaixo da baseline; só 0/1/2 alinham). Força figuras lining para os
          números ficarem todos na mesma linha. Herda p/ toda a LP (não há
          shorthand `font:` que resete a propriedade). */}
      <div style={{ fontVariantNumeric: "lining-nums" }} dangerouslySetInnerHTML={{ __html: lpBody }} />
      <HeroPointer />
      <GloboCanvas />
      <CarrosselDots />
    </>
  );
}

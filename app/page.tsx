import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import HoverRuntime from "./_lp/HoverRuntime";

const SITE_URL = process.env.URL ?? "https://abril-project.netlify.app";
const OG = {
  title: "Estratégia Internacional",
  description: "Sua liberdade financeira começa pela geografia.",
  images: [{ url: "/og-lp.png", width: 1200, height: 630, alt: "Estratégia Internacional" }],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Estratégia Internacional | Dolarização de patrimônio com método",
  description:
    "Formação em dolarização de patrimônio e investimento internacional, com quatro especialistas que operaram esse mercado por dentro. Chancela editorial da VEJA Negócios, conteúdo BlockTrends.",
  openGraph: { ...OG, type: "website" },
  twitter: { card: "summary_large_image", ...OG },
};

// Design real da LP (bundle do Claude Design), portado por scripts/port-lp:
// markup e CSS reais + assets em /public/lp. Renderizado como página estática.
const dir = join(process.cwd(), "app", "_lp");
const lpCss = readFileSync(join(dir, "styles.css"), "utf8");
const lpBody = readFileSync(join(dir, "body.html"), "utf8");

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: lpCss }} />
      <div dangerouslySetInnerHTML={{ __html: lpBody }} />
      <HoverRuntime />
    </>
  );
}

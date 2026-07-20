import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import HoverRuntime from "./_lp/HoverRuntime";

export const metadata: Metadata = {
  title: "Estratégia Internacional | Dolarização de patrimônio com método",
  description:
    "Formação em dolarização de patrimônio e investimento internacional, com quatro especialistas que operaram esse mercado por dentro. Chancela editorial da VEJA Negócios, conteúdo BlockTrends.",
  openGraph: {
    title: "Estratégia Internacional",
    description: "Sua liberdade financeira começa pela geografia.",
    type: "website",
  },
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

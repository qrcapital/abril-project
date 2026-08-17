import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Área do aluno (/app/*). Design portado do bundle Area-do-Aluno.html via
// scripts/port-area.mjs: CSS real em app/app/_ui/styles.css (injetado aqui) e o
// markup de cada tela em app/app/_ui/screens/*.html. Tema dark/editorial próprio.

export const metadata: Metadata = {
  title: {
    // Só "Área do aluno": o template do layout raiz completa com o nome do produto. Escrever
    // o nome aqui triplicava a aba nas páginas SEM metadata própria (o `not-found`, o
    // `error`, o `loading` e o catch-all), porque o template da raiz se aplica também ao
    // `default` de um layout filho. As telas com título já saíam certas, e por isso passou.
    default: "Área do aluno",
    template: "%s | Estratégia Internacional",
  },
  robots: { index: false, follow: false },
};

const areaCss = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "styles.css"),
  "utf8"
);

export default function AreaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* lining-nums: mesma correção da LP (app/page.tsx) — o Playfair vem com algarismos
          oldstyle. Vai aqui, e não no styles.css, porque o styles.css é reescrito pelo
          port-area.mjs. No <html> porque cada rota monta o próprio documento, então não
          vaza para a LP nem para o admin.

          A segunda regra existe por causa do cronômetro da prova: o markup portado traz
          `font-variant-numeric:tabular-nums` inline, que SUBSTITUI o valor herdado, e o
          tabular do Playfair sem lining sai oldstyle do mesmo jeito (medido no browser).
          !important porque inline ganha de stylesheet; o seletor mira exatamente esse
          padrão do porte. */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            areaCss +
            "\nhtml{font-variant-numeric:lining-nums}" +
            '\n[style*="tabular-nums"]{font-variant-numeric:lining-nums tabular-nums !important}',
        }}
      />
      {children}
    </>
  );
}

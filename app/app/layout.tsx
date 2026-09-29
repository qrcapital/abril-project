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

// As telas de acesso (login, senha, termos, acesso bloqueado) saíram da identidade verde em
// 29/set/2026 e têm folha própria, escopada em `.au`. Vem DEPOIS do CSS portado para ganhar dele
// nos poucos pontos em que os dois se tocam (a cor de fundo do body, por exemplo), e não é escrita
// pelo `port-area.mjs`, então sobrevive a uma nova execução dele.
const authCss = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "auth.css"),
  "utf8"
);

// As telas da sala escritas em JSX (comece, módulo, notebook, aula) têm folha própria, escopada em
// `.sl`. Vem por último pela mesma razão do `auth.css`: ganha do CSS portado onde os dois se tocam.
const salaCss = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "sala.css"),
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
            "\n" +
            authCss +
            "\n" +
            salaCss +
            "\nhtml{font-variant-numeric:lining-nums}" +
            '\n[style*="tabular-nums"]{font-variant-numeric:lining-nums tabular-nums !important}',
        }}
      />
      {children}
    </>
  );
}

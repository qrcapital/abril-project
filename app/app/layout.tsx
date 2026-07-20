import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import AreaInteractions from "./_ui/AreaInteractions";

// Área do aluno (/app/*). Design portado do bundle Area-do-Aluno.html via
// scripts/port-area.mjs: CSS real em app/app/_ui/styles.css (injetado aqui) e o
// markup de cada tela em app/app/_ui/screens/*.html. Tema dark/editorial próprio.

export const metadata: Metadata = {
  title: {
    default: "Área do aluno | Estratégia Internacional",
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
      <style dangerouslySetInnerHTML={{ __html: areaCss }} />
      {children}
      <AreaInteractions />
    </>
  );
}

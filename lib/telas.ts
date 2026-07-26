import { readFileSync } from "node:fs";
import { join } from "node:path";

// Markup das telas da área do aluno, gerado por scripts/port-area.mjs.
// Lido no módulo (uma vez por processo, no build) e injetado pelo client de cada rota.
export function tela(nome: string): string {
  return readFileSync(
    join(process.cwd(), "app", "app", "_ui", "screens", `${nome}.html`),
    "utf8",
  );
}

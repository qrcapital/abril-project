import { readFileSync } from "node:fs";
import { join } from "node:path";

// Markup das telas da área do aluno. Nasceu do scripts/port-area.mjs, aposentado em 29/set/2026:
// os arquivos de app/app/_ui/screens/ são a fonte agora e se editam direto (ver AGENTS.md).
// Lido no módulo (uma vez por processo, no build) e injetado pelo client de cada rota.
export function tela(nome: string): string {
  return readFileSync(
    join(process.cwd(), "app", "app", "_ui", "screens", `${nome}.html`),
    "utf8",
  );
}

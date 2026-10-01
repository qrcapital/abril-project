// Ganchos de resolução para o `scripts/notebook-check.mts` rodar em node puro sobre os arquivos de
// `content/notebooks/`, que foram escritos para o Next: importam `@/lib/notebook` (alias do
// tsconfig) e `./modulo-0` (sem extensão). Aqui o `@/` vira a raiz do projeto e o import sem
// extensão ganha `.ts`. Nada além disso; não é carregador geral.

import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const RAIZ = new URL("../", import.meta.url);

export async function resolve(especificador, contexto, proximo) {
  let spec = especificador;
  if (spec.startsWith("@/")) spec = new URL(spec.slice(2), RAIZ).href;
  if ((spec.startsWith(".") || spec.startsWith("file:")) && !/\.[cm]?[jt]sx?$/.test(spec)) {
    const base = new URL(spec, contexto.parentURL).href;
    for (const ext of [".ts", ".tsx", "/index.ts"]) {
      const url = new URL(base + ext);
      if (existsSync(fileURLToPath(url))) return proximo(url.href, contexto);
    }
  }
  return proximo(spec, contexto);
}

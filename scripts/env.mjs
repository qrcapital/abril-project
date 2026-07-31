// Lê o `.env.local` para os scripts de operação, que rodam em node puro e não têm o loader
// de variáveis do Next.
//
// Este bloco estava copiado em seis scripts (aprovar-conta, progresso-conta,
// matricular-existentes, rls-check, curriculo-check, prova-expiradas). Em vez de fazer a
// sétima cópia, virou função. Os seis anteriores continuam como estão de propósito: mexer
// neles agora seria refatoração não pedida, e o ganho é zero até alguém precisar tocar em
// um deles.

import { readFileSync } from "node:fs";

export function carregarEnv(arquivo = ".env.local") {
  return Object.fromEntries(
    readFileSync(arquivo, "utf8")
      .split("\n")
      .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
  );
}

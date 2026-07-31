// Roda o `scripts/mestre-check.sql` (regras do admin mestre) e traduz o resultado em exit code.
//
//   npm run check:mestre
//
// Existe como wrapper em node por dois motivos práticos: o `psql` neste Mac veio do `libpq` do
// brew e **não está no PATH** (brew instala sem linkar), e a string de conexão vive no
// `.env.local`, que o npm não carrega. Sem o wrapper o comando é uma linha longa que ninguém
// lembra, e um check que ninguém roda não protege nada.
//
// Fica FORA do `npm run check`, que é offline e pré-requisito de commit. Este precisa de rede e
// de `.env.local`, igual ao `check:rls`, porque a única prova que vale para regra de privilégio é
// contra o banco.

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

import { carregarEnv } from "./env.mjs";

const CANDIDATOS = [
  "psql", // se alguém linkou
  "/usr/local/opt/libpq/bin/psql", // brew em Mac Intel
  "/opt/homebrew/opt/libpq/bin/psql", // brew em Apple Silicon
  "/usr/bin/psql",
];

// Sonda cada candidato de verdade, com `--version`. A primeira versão disto aceitava a string
// "psql" sem checar nada, e escolhia um binário inexistente: `existsSync` não resolve PATH, e
// testar `p === "psql"` só testava a string.
const funciona = (p) => {
  const r = spawnSync(p, ["--version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
};

const psql = CANDIDATOS.find((p) => (p === "psql" ? funciona(p) : existsSync(p) && funciona(p)));
if (!psql) {
  console.error("psql nao encontrado. instale com: brew install libpq");
  console.error(`procurei em: ${CANDIDATOS.join(", ")}`);
  process.exit(1);
}

const env = carregarEnv();
if (!env.SUPABASE_DB_URL) {
  console.error("falta SUPABASE_DB_URL no .env.local");
  process.exit(1);
}

const r = spawnSync(psql, [env.SUPABASE_DB_URL, "-f", "scripts/mestre-check.sql"], {
  encoding: "utf8",
});
if (r.error) {
  console.error(`nao deu para rodar o psql: ${r.error.message}`);
  process.exit(1);
}

const saida = `${r.stdout ?? ""}${r.stderr ?? ""}`;
for (const linha of saida.split("\n")) {
  const m = linha.match(/(ok|FALHOU|mestre-check):.*/);
  if (m) console.log(m[0]);
}

// Duas condições de falha, e as duas importam: o psql sair mal, OU o script ter contado falha.
// Sem a segunda, um `FALHOU` no meio passaria batido enquanto o psql devolvesse 0.
if (r.status !== 0 || /FALHOU/.test(saida)) {
  const erro = saida.match(/ERROR:.*/g);
  if (erro) erro.forEach((e) => console.error(e));
  console.error("mestre-check: FALHOU");
  process.exit(1);
}

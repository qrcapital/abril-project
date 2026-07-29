// Self-check do currículo no banco.
//   npm run check:curriculo
//
// Desde 29/jul/2026 o banco é a fonte única do currículo: o `lib/curso.ts` deixou de guardar as
// aulas e passou a guardar só a lógica, porque o admin vai editar título, descrição, vídeo e
// materiais pelo painel. Este check nasceu como comparação entre código e banco, e virou outra
// coisa quando a duplicação acabou: agora ele guarda as invariantes de que o app depende.
//
// O que quebra sem ele: o `n` da aula é a POSIÇÃO na ordenação por módulo e por ordem dentro do
// módulo, e é ele que vai na URL e no progresso. Um `ord` repetido dentro do mesmo módulo torna
// essa ordenação ambígua, e a mesma URL passaria a apontar para aulas diferentes entre um deploy
// e outro, silenciosamente.
//
// Fala com o banco, então precisa do `.env.local`; sem credencial, avisa e passa.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { createClient } from "@supabase/supabase-js";

let env: Record<string, string> = {};
try {
  env = Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split("\n")
      .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
  );
} catch {
  /* sem .env.local */
}

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log("curriculo-check: pulado (sem .env.local com credenciais do Supabase)");
  process.exit(0);
}

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data: mods, error: erroMods } = await db.from("modules").select("id,ord,titulo");
if (erroMods) throw erroMods;
const { data: aulas, error: erroAulas } = await db
  .from("lessons")
  .select("id,module_id,ord,titulo,conta_no_gate");
if (erroAulas) throw erroAulas;

// --- existe currículo ---
assert.ok(mods.length > 0, "nenhum modulo no banco: a area do aluno abriria vazia");
assert.ok(aulas.length > 0, "nenhuma aula no banco");

// --- ordens sem buraco nem repetição, senão o `n` da URL fica ambíguo ---
const ords = mods.map((m) => m.ord).sort((a, b) => a - b);
assert.deepEqual(
  ords,
  ords.map((_, i) => i),
  `os ord dos modulos precisam ser 0..${mods.length - 1} sem buraco: ${ords.join(",")}`,
);

for (const m of mods) {
  const doModulo: number[] = aulas.filter((a) => a.module_id === m.id).map((a) => a.ord);
  assert.equal(
    new Set(doModulo).size,
    doModulo.length,
    `modulo ${m.ord} ("${m.titulo}") tem ord repetido entre as aulas: a ordem do curso fica ` +
      `ambigua e a mesma URL passa a apontar para aulas diferentes`,
  );
}

// --- toda aula pertence a um módulo existente ---
const idsDeModulo = new Set(mods.map((m) => m.id));
for (const a of aulas)
  assert.ok(idsDeModulo.has(a.module_id), `aula "${a.titulo}" aponta para modulo inexistente`);

// --- o gate da prova ---
const noGate = aulas.filter((a) => a.conta_no_gate).length;
assert.ok(noGate > 0, "nenhuma aula conta para o gate: a prova nunca abriria");
assert.ok(
  noGate < aulas.length,
  "todas as aulas contam para o gate: as boas-vindas deveriam ficar de fora",
);

// --- títulos preenchidos: título vazio vira card em branco na vitrine ---
for (const m of mods) assert.ok(m.titulo?.trim(), `modulo ${m.ord} sem titulo`);
for (const a of aulas) assert.ok(a.titulo?.trim(), `aula ${a.id} sem titulo`);

console.log(
  `curriculo-check: ok (${mods.length} modulos, ${aulas.length} aulas, ${noGate} valem para o gate)`,
);

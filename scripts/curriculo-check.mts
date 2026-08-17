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

import { ORDS_AVALIADOS, POR_MODULO } from "../lib/questoes.ts";

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
// O piso é a única invariante que restou aqui. A composição do gate deixou de ser regra de
// código em 17/ago/2026: o Pedro marcou a boas-vindas pelo painel de propósito, e o
// `conta_no_gate` passou a ser lido pelo app (antes o checkbox gravava e ninguém lia). Quantas
// e quais aulas contam agora é escolha da tela de Conteúdo, não deste check.

// --- o banco de questões sustenta um sorteio completo ---
// Acrescentado em 31/jul/2026, junto com a tela de Questões. O `sortear_prova` tira POR_MODULO de
// cada módulo I..IV; com menos ativas em qualquer um deles, ele devolve menos que o total, o
// `abrirTentativa` estoura de propósito e A PROVA PARA DE ABRIR PARA TODOS. Isso passa por build e
// por lint, e apareceria como "a prova não abre" no suporte. Apagar ou desativar questão pela tela
// nova é o caminho mais curto para cair aqui.
const { data: questoes, error: erroQuestoes } = await db
  .from("questions")
  .select("module_id, ativo");
if (erroQuestoes) throw erroQuestoes;

for (const ord of ORDS_AVALIADOS) {
  const modulo = mods.find((m) => m.ord === ord);
  assert.ok(modulo, `modulo de ord ${ord} nao existe: o sorteio da prova conta com I..IV`);
  const ativas = questoes.filter((q) => q.module_id === modulo.id && q.ativo).length;
  assert.ok(
    ativas >= POR_MODULO,
    `modulo ${ord} ("${modulo.titulo}") tem ${ativas} questoes ativas e o sorteio precisa de ` +
      `${POR_MODULO}: a prova nao abriria para nenhum aluno`,
  );
}

// --- títulos preenchidos: título vazio vira card em branco na vitrine ---
for (const m of mods) assert.ok(m.titulo?.trim(), `modulo ${m.ord} sem titulo`);
for (const a of aulas) assert.ok(a.titulo?.trim(), `aula ${a.id} sem titulo`);

console.log(
  `curriculo-check: ok (${mods.length} modulos, ${aulas.length} aulas, ${noGate} valem para o gate, ` +
    `${questoes.filter((q) => q.ativo).length} questoes ativas)`,
);

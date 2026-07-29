// Marca aulas como concluídas para uma conta, pelo servidor.
//
//   node scripts/progresso-conta.mjs <email>            # mostra o estado
//   node scripts/progresso-conta.mjs <email> --tudo     # conclui as 17
//   node scripts/progresso-conta.mjs <email> --limpar   # zera
//
// Por que existe: até 29/jul o progresso era um cookie, e quem precisava testar o gate da prova
// simplesmente escrevia o cookie no console. Agora o dado é do servidor, e é bom que seja: essa
// facilidade era o furo. Este script é a via legítima, e só roda com a service role.
//
// Cheguei a escrever no lugar dele uma migração automática que semeava o banco a partir do
// cookie do aluno, para ninguém perder progresso. Removi ao testar: com o cookie forjado e o
// banco vazio, a prova abria. Semear a partir de um dado que o aluno escreve é reabrir o buraco
// com outro nome.
//
// SÓ PARA HOMOLOG: está na lista de atalhos de teste a remover antes do go-live.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2];
const tudo = process.argv.includes("--tudo");
const limpar = process.argv.includes("--limpar");
if (!email || email.startsWith("--")) {
  console.error("uso: node scripts/progresso-conta.mjs <email> [--tudo|--limpar]");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const {
  data: { users },
} = await db.auth.admin.listUsers();
const user = users.find((u) => u.email === email);
if (!user) {
  console.error(`conta nao encontrada: ${email}`);
  process.exit(1);
}

const { count } = await db
  .from("progress")
  .select("*", { count: "exact", head: true })
  .eq("user_id", user.id);
console.log(`${email}: ${count} aulas concluidas`);

if (limpar) {
  const { error } = await db.from("progress").delete().eq("user_id", user.id);
  if (error) throw error;
  console.log("progresso zerado.");
  process.exit(0);
}
if (!tudo) {
  console.log("\nnada mudou. use --tudo para concluir todas, ou --limpar para zerar.");
  process.exit(0);
}

const { data: aulas, error: erroAulas } = await db.from("lessons").select("id");
if (erroAulas) throw erroAulas;
const agora = new Date().toISOString();
const { error } = await db.from("progress").upsert(
  aulas.map((a) => ({
    user_id: user.id,
    lesson_id: a.id,
    status: "completed",
    watched_pct: 100,
    completed_at: agora,
    updated_at: agora,
  })),
  { onConflict: "user_id,lesson_id" },
);
if (error) throw error;
console.log(`${aulas.length} aulas marcadas como concluidas.`);

// Cria matrícula para contas que já existem sem nenhuma.
//
//   node scripts/matricular-existentes.mjs           # só mostra o que faria
//   node scripts/matricular-existentes.mjs --aplicar # grava
//
// Por que existe: as contas de homolog nasceram do atalho `?s=primeiro`, que até 29/jul não
// criava matrícula, e a guarda de acesso do grupo `(sala)` passou a exigir uma. Sem este
// backfill, todo mundo que já tinha conta cai na tela de bloqueio no primeiro deploy.
//
// Idempotente: pula quem já tem matrícula. Não serve para produção, onde a matrícula nasce do
// webhook do Guru com o `guru_order_id` da compra.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const ANOS_ACESSO = 1;
const aplicar = process.argv.includes("--aplicar");

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const {
  data: { users },
  error: erroUsers,
} = await admin.auth.admin.listUsers();
if (erroUsers) throw erroUsers;

const { data: matriculas, error: erroMat } = await admin.from("enrollments").select("user_id");
if (erroMat) throw erroMat;
const jaTem = new Set(matriculas.map((m) => m.user_id));

const faltando = users.filter((u) => !jaTem.has(u.id));
console.log(`contas: ${users.length} | com matricula: ${jaTem.size} | sem: ${faltando.length}`);
for (const u of faltando) console.log(`  ${u.email}`);

if (!faltando.length) {
  console.log("nada a fazer.");
  process.exit(0);
}
if (!aplicar) {
  console.log("\nsimulacao. rode com --aplicar para gravar.");
  process.exit(0);
}

// O prazo conta da criação da conta, que é o proxy mais honesto da data de compra que existe
// em homolog. Em produção quem manda é a data da compra que o Guru envia.
const linhas = faltando.map((u) => {
  const expira = new Date(u.created_at);
  expira.setFullYear(expira.getFullYear() + ANOS_ACESSO);
  return { user_id: u.id, status: "active", expires_at: expira.toISOString() };
});

const { error } = await admin.from("enrollments").insert(linhas);
if (error) throw error;
console.log(`\n${linhas.length} matriculas criadas.`);

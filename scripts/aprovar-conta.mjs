// Marca uma conta como aprovada na prova, para revisar o certificado sem responder 20 questões.
//
//   node scripts/aprovar-conta.mjs <email>            # só mostra o que faria
//   node scripts/aprovar-conta.mjs <email> --aplicar  # grava
//
// Por que existe: desde 29/jul o certificado tem porteiro, e só entra quem passou na prova.
// Isso é o certo em produção e um estorvo em homolog, onde alguém precisa revisar o DESIGN do
// certificado sem fazer o curso inteiro. Sem este atalho, revisar a peça final custa 16 aulas
// marcadas mais 20 questões.
//
// SÓ PARA HOMOLOG. Ele escreve um resultado de prova que não aconteceu, o que em produção
// significaria emitir certificado para quem não fez a prova. Está na lista de atalhos de teste
// a remover antes do go-live (docs/PENDENCIAS-LP.md).

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2];
const aplicar = process.argv.includes("--aplicar");
if (!email || email.startsWith("--")) {
  console.error("uso: node scripts/aprovar-conta.mjs <email> [--aplicar]");
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

// Sorteia como a prova de verdade sortearia, e congela o gabarito no snapshot, igual ao
// `abrirTentativa`. Assim a correção roda sobre dados com a mesma forma da produção.
const { data: sorteadas, error: erroSorteio } = await db.rpc("sortear_prova");
if (erroSorteio) throw erroSorteio;
if (!sorteadas?.length) {
  console.error("sortear_prova nao devolveu questoes: o banco de questoes esta vazio?");
  process.exit(1);
}

const { data: gabarito } = await db
  .from("questions")
  .select("id, correta")
  .in("id", sorteadas.map((q) => q.id));
const correta = new Map(gabarito.map((g) => [g.id, g.correta]));

// O formato tem que ser IDÊNTICO ao que o `abrirTentativa` grava, senão a correção lê lixo e
// reprova em silêncio: o campo é `modulo` (não `module_ord`), `correta` é o ÍNDICE 0..3, e as
// respostas são chaveadas pela POSIÇÃO na prova com a LETRA como valor. Escrevi errado na
// primeira versão e o certificado continuou bloqueado sem dizer por quê.
const LETRAS = ["A", "B", "C", "D"];
const snapshot = sorteadas.map((q) => {
  const idx = correta.get(q.id);
  if (idx === undefined) throw new Error(`questao ${q.id} sem gabarito`);
  return {
    id: q.id,
    modulo: q.module_ord,
    enunciado: q.enunciado,
    alternativas: q.alternativas,
    correta: idx,
  };
});
const respostas = Object.fromEntries(
  snapshot.map((q, i) => [String(i + 1), LETRAS[q.correta]]),
);

console.log(`conta: ${email}`);
console.log(`questoes sorteadas: ${snapshot.length}, todas respondidas corretamente`);

if (!aplicar) {
  console.log("\nsimulacao. rode com --aplicar para gravar.");
  process.exit(0);
}

// Apaga tentativas anteriores para nao brigar com a unique de (user_id, attempt).
await db.from("exams").delete().eq("user_id", user.id);
const agora = new Date();
const { error } = await db.from("exams").insert({
  user_id: user.id,
  attempt: 1,
  status: "submitted",
  score: 100,
  started_at: agora.toISOString(),
  deadline: new Date(agora.getTime() + 120 * 60_000).toISOString(),
  questions_snapshot: snapshot,
  answers: respostas,
});
if (error) throw error;
console.log("\ntentativa aprovada gravada. o certificado abre.");

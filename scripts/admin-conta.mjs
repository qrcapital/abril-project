// Concede e revoga o papel de admin. É a resposta ao "bootstrap do papel" do PLANO-ADMIN §8.
//
//   node scripts/admin-conta.mjs                                   # lista os admins de hoje
//   node scripts/admin-conta.mjs <email>                           # só mostra o que faria
//   node scripts/admin-conta.mjs <email> --aplicar                  # promove a admin
//   node scripts/admin-conta.mjs <email> --mestre --aplicar          # promove a admin MESTRE
//   node scripts/admin-conta.mjs <email> --revogar --aplicar         # despromove
//
// O nível de MESTRE (migration `0005`) só se concede por aqui, e não pela tela de Equipe. É a
// mesma razão do bootstrap: é o nível que decide quem mexe em quem, então sai do caminho de quem
// só tem o navegador. `--revogar` limpa os dois campos de uma vez, porque o CHECK do banco não
// admite mestre que não seja admin.
//
// ISTO NÃO É ATALHO DE TESTE, e não entra na lista de coisas a remover antes do go-live
// (ao contrário do `aprovar-conta.mjs`, que fabrica uma prova que não aconteceu).
//
// Ele existe porque a migration `0003` fechou a escalada de privilégio: `profiles.is_admin`
// só muda pela service role ou por um admin que já era admin. Isso resolve a segurança e
// cria um problema de partida — no dia em que o `ei-prod` subir, não vai existir admin
// nenhum, e uma tela dentro do próprio admin não pode criar o primeiro sem que alguém já
// esteja dentro. Alguém tem que quebrar o ovo de fora, com a service role, e é aqui.
//
// A service role passa pelo trigger `guarda_is_admin` de propósito: nela `auth.uid()` é
// null, que é o caminho que o trigger libera.

import { createClient } from "@supabase/supabase-js";
import { carregarEnv } from "./env.mjs";

const args = process.argv.slice(2);
const email = args.find((a) => !a.startsWith("--"));
const aplicar = args.includes("--aplicar");
const revogar = args.includes("--revogar");
const mestre = args.includes("--mestre");

const env = carregarEnv();
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no .env.local");
  process.exit(1);
}
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// `profiles` não guarda e-mail (só `auth.users` guarda), então o mapa id -> e-mail vem do
// Admin API. Sem isso a listagem mostraria uuid, que não diz a ninguém quem é admin.
const {
  data: { users },
  error: erroUsers,
} = await db.auth.admin.listUsers({ perPage: 1000 });
if (erroUsers) throw erroUsers;
const porId = new Map(users.map((u) => [u.id, u.email]));

const listarAdmins = async () => {
  const { data, error } = await db
    .from("profiles")
    .select("id, nome, is_master")
    .eq("is_admin", true);
  if (error) throw error;
  return data.map((p) => ({ ...p, email: porId.get(p.id) ?? "(sem conta em auth.users)" }));
};

const admins = await listarAdmins();
console.log(`admins hoje: ${admins.length}`);
for (const a of admins) {
  const nivel = a.is_master ? " [MESTRE]" : "";
  console.log(`  - ${a.email}${a.nome ? ` (${a.nome})` : ""}${nivel}`);
}

if (!email) {
  console.log("\ninforme um e-mail para promover ou revogar.");
  process.exit(0);
}

const user = users.find((u) => u.email === email);
if (!user) {
  console.error(`\nconta nao encontrada: ${email}`);
  process.exit(1);
}

const { data: perfil, error: erroPerfil } = await db
  .from("profiles")
  .select("is_admin, is_master, nome")
  .eq("id", user.id)
  .maybeSingle();
if (erroPerfil) throw erroPerfil;
if (!perfil) {
  // Acontece se o upsert do signup não rodou. Promover criaria um perfil pela metade, sem
  // nome, e o admin apareceria na lista sem identificação.
  console.error(`\n${email} nao tem linha em profiles. Rode o login uma vez ou crie o perfil.`);
  process.exit(1);
}

// Revogar zera os dois. Promover com --mestre liga os dois, porque o CHECK do banco não admite
// mestre que não seja admin; sem --mestre, o nível de mestre não é tocado.
const alvo = !revogar;
const alvoMestre = revogar ? false : mestre ? true : perfil.is_master;

console.log(`\nconta:     ${email}${perfil.nome ? ` (${perfil.nome})` : ""}`);
console.log(`is_admin:  ${perfil.is_admin} -> ${alvo}`);
console.log(`is_master: ${perfil.is_master} -> ${alvoMestre}`);

if (perfil.is_admin === alvo && perfil.is_master === alvoMestre) {
  console.log("\nnada a fazer, ja esta nesse estado.");
  process.exit(0);
}

// Trava boba que já salvaria um susto: revogar o último admin deixa o painel sem ninguém
// para entrar, e o conserto só volta por aqui.
if (revogar && admins.length === 1 && admins[0].id === user.id) {
  console.error("\nesse e o UNICO admin. revogar deixaria o painel sem acesso.");
  console.error("promova outra conta antes, ou rode com --forcar se e isso mesmo.");
  if (!args.includes("--forcar")) process.exit(1);
}

if (!aplicar) {
  console.log("\nsimulacao. rode com --aplicar para gravar.");
  process.exit(0);
}

const { error } = await db
  .from("profiles")
  .update({ is_admin: alvo, is_master: alvoMestre })
  .eq("id", user.id);
if (error) throw error;

// Confere lendo de volta: o update pode "passar" sem afetar linha se algum filtro mudar,
// e um bootstrap que mente é pior que um que falha.
const { data: depois } = await db
  .from("profiles")
  .select("is_admin, is_master")
  .eq("id", user.id)
  .single();
if (depois.is_admin !== alvo || depois.is_master !== alvoMestre) {
  console.error(
    `\nfalhou: is_admin=${depois.is_admin}, is_master=${depois.is_master}`,
  );
  process.exit(1);
}
console.log(
  `\nok. ${email} agora tem is_admin = ${alvo}, is_master = ${alvoMestre}.`,
);

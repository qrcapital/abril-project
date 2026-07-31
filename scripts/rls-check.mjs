// Check de RLS: o aluno consegue se promover a admin? E o que ele NÃO deveria escrever?
//
//   npm run check:rls
//
// Fica FORA do `npm run check` de propósito: aquele roda em node puro, offline, e é pré-requisito
// de commit. Este precisa de `.env.local` e de rede, porque a única prova que vale é contra o
// banco de verdade — teoria de RLS engana, e este projeto já leu errado uma restrição sua duas
// vezes (ver HANDOFF §6). Rodar depois de aplicar migration que mexa em policy ou grant.
//
// Cria um aluno descartável, tenta o ataque com a chave ANON (mesmo caminho do navegador) e
// apaga a conta no fim. Não depende de conta de teste nenhuma e não deixa resíduo, então pode
// rodar em qualquer ambiente, inclusive produção.
//
// Três asserções. A terceira é a que impede o conserto de virar regressão: fechar a escrita do
// aluno não pode fechar a da service role, senão o upsert de `profiles` no signup para de
// funcionar e a conta nasce sem perfil — furo que já aconteceu neste projeto em 28/jul.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const marca = Date.now();
const email = `rls-check+${marca}@estrategiainternacional.com`;
// Senha descartável, viva por segundos. Atende a política do produto (8 com classes).
const senha = `Rls${marca.toString(36)}Aa1`;

const leDoBanco = async (id, coluna) => {
  const { data } = await admin.from("profiles").select(coluna).eq("id", id).single();
  return data?.[coluna];
};

let userId = null;
const falhas = [];

try {
  const { data: criado, error: erroCriar } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  });
  if (erroCriar) throw new Error(`nao consegui criar a conta de teste: ${erroCriar.message}`);
  userId = criado.user.id;

  // O trigger handle_new_user cria o profile. Se o schema estiver sem ele, semeia, senão o teste
  // mediria a ausência da linha em vez de medir a permissão.
  const { data: perfil } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!perfil) await admin.from("profiles").insert({ id: userId, nome: "RLS Check" });

  const aluno = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  const { error: erroLogin } = await aluno.auth.signInWithPassword({ email, password: senha });
  if (erroLogin) throw new Error(`nao consegui logar a conta de teste: ${erroLogin.message}`);

  // --- 1. o ataque: o aluno tenta se promover ---
  await aluno.from("profiles").update({ is_admin: true }).eq("id", userId);
  if ((await leDoBanco(userId, "is_admin")) === true) {
    falhas.push(
      "ESCALADA POSSIVEL: o aluno gravou is_admin=true na propria linha. " +
        "Confira o revoke de UPDATE e o trigger da migration 0003.",
    );
    // Não deixa a conta promovida nem por segundos, mesmo que o delete abaixo falhe.
    await admin.from("profiles").update({ is_admin: false }).eq("id", userId);
  } else {
    console.log("ok: aluno NAO consegue virar admin");
  }

  // --- 2. nada em profiles é escrita do aluno (PRD §9: tela enxuta, nome nao e editavel) ---
  const nomeAntes = await leDoBanco(userId, "nome");
  await aluno.from("profiles").update({ nome: `invadido ${marca}` }).eq("id", userId);
  if ((await leDoBanco(userId, "nome")) !== nomeAntes) {
    falhas.push(
      "O aluno alterou profiles.nome. O PRD §9 nao preve isso, e UPDATE aberto para o aluno " +
        "e o caminho por onde is_admin volta a vazar. Confira o revoke da 0003.",
    );
    await admin.from("profiles").update({ nome: nomeAntes }).eq("id", userId);
  } else {
    console.log("ok: aluno NAO escreve em profiles");
  }

  // --- 3. a regressão que importa: a service role ainda escreve? ---
  const nomeServico = `RLS Check ${marca}`;
  const { error: erroServico } = await admin
    .from("profiles")
    .update({ nome: nomeServico })
    .eq("id", userId);
  if (erroServico || (await leDoBanco(userId, "nome")) !== nomeServico) {
    falhas.push(
      `REGRESSAO GRAVE: a service role nao escreve mais em profiles (${erroServico?.message ?? "valor nao mudou"}). ` +
        "O upsert do signup depende disso; sem ele a conta nasce sem perfil e o verify_certificate quebra.",
    );
  } else {
    console.log("ok: service role AINDA escreve em profiles");
  }
} finally {
  if (userId) {
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) console.error(`ATENCAO: nao consegui apagar a conta ${email}: ${error.message}`);
  }
}

if (falhas.length) {
  console.error(`\nrls-check: ${falhas.length} FALHA(S)`);
  for (const f of falhas) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("rls-check: ok");

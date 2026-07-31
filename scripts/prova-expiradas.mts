// Fecha as tentativas de prova cujo prazo estourou com a aba fechada.
//
//   npm run prova:expiradas             # lista o que fecharia, sem escrever
//   npm run prova:expiradas -- --fechar # fecha de verdade
//
// Por que existe: o cronômetro da prova só envia com a aba aberta, então quem fecha o
// navegador deixa a tentativa `in_progress` para sempre — sem resultado registrado, e com o
// certificado barrado pelo porteiro de aprovação, que exige `submitted`. O PRD §15 prevê a
// rotina "prova com deadline estourado", e este script é a mão dela: a mesma função que um
// agendador vai chamar, executável agora sem depender de deploy.
//
// Roda com a service role, como toda escrita confiável do projeto. Lista por padrão porque
// o planejamento é puro: dá para ver a nota que cada tentativa receberia antes de gravar.

import { createClient } from "@supabase/supabase-js";

import { fecharExpiradas, listarExpiradas, planejarFechamentos } from "../lib/prova-expiradas.ts";
import { carregarEnv } from "./env.mjs";

const fechar = process.argv.includes("--fechar");

// Usa o `carregarEnv` compartilhado em vez da cópia que morava aqui, porque ele também exporta as
// variáveis para o `process.env`: o e-mail de resultado que esta rotina dispara é montado pelo
// `lib/email.ts`, que lê a chave do provedor de lá e não do objeto devolvido.
const env = carregarEnv();
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const agora = new Date();

if (!fechar) {
  const planejados = planejarFechamentos(await listarExpiradas(db, agora));
  if (planejados.length === 0) {
    console.log("nenhuma tentativa vencida em aberto.");
    process.exit(0);
  }
  console.log(`${planejados.length} tentativa(s) vencida(s) em aberto:\n`);
  for (const f of planejados) {
    console.log(
      `  ${f.id}  nota ${String(f.score).padStart(3)}  ${f.aprovado ? "aprovado" : "reprovado"}  (prazo ${f.submitted_at})`,
    );
  }
  console.log("\nnada mudou. use --fechar para corrigir e registrar o resultado.");
  process.exit(0);
}

const aplicados = await fecharExpiradas(db, agora);
console.log(`${aplicados.length} tentativa(s) fechada(s).`);
for (const f of aplicados) {
  console.log(`  ${f.id}  nota ${f.score}  ${f.aprovado ? "aprovado" : "reprovado"}`);
}

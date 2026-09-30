// Copia o CONTEÚDO do banco antigo para o projeto Supabase novo (troca de conta, 30/set/2026).
//
//   node scripts/migrar-banco.mjs            # só lê os dois bancos e mostra o que copiaria
//   node scripts/migrar-banco.mjs --aplicar  # copia
//
// Lê dois arquivos na raiz do repo, os dois cobertos pelo `.env*` do .gitignore:
//   .env.antigo  NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY do projeto de hoje
//   .env.novo    os mesmos dois do projeto novo, JÁ com o `supabase/setup-novo-projeto.sql` rodado
// Nenhuma chave é impressa: a saída tem só nomes de tabela e contagens.
//
// O QUE VEM: o curso (módulos, aulas, materiais, questões), as políticas de liberação, os modelos de
// e-mail de resultado e o log de consentimento (prova jurídica, não pode ficar para trás).
//
// O QUE NÃO VEM, de propósito: contas, matrículas, progresso, provas, certificados, e-mails
// enviados, auditoria. Tudo isso pende de `auth.users`, e hoje só existem contas de teste. Os
// consentimentos vêm com `user_id` vazio pelo mesmo motivo; o e-mail do titular fica na linha,
// que é o que identifica o aceite.

import { createClient } from "@supabase/supabase-js";
import { carregarEnv } from "./env.mjs";

const aplicar = process.argv.includes("--aplicar");

function cliente(arquivo) {
  const env = carregarEnv(arquivo);
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) {
    console.error(`${arquivo}: faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY`);
    process.exit(1);
  }
  return { db: createClient(url, chave, { auth: { persistSession: false } }), host: new URL(url).host };
}

const antigo = cliente(".env.antigo");
const novo = cliente(".env.novo");
if (antigo.host === novo.host) {
  console.error("os dois arquivos apontam para o MESMO projeto. Nada feito.");
  process.exit(1);
}
console.log(`de  ${antigo.host}\npara ${novo.host}\n${aplicar ? "MODO: aplicar" : "MODO: simulação (use --aplicar)"}\n`);

async function lerTudo(db, tabela) {
  const linhas = [];
  for (let de = 0; ; de += 1000) {
    const { data, error } = await db.from(tabela).select("*").range(de, de + 999);
    if (error) throw new Error(`${tabela}: ${error.message}`);
    linhas.push(...data);
    if (data.length < 1000) return linhas;
  }
}

async function gravar(tabela, linhas, conflito) {
  console.log(`${tabela.padEnd(18)} ${String(linhas.length).padStart(5)} linha(s)`);
  if (!aplicar || linhas.length === 0) return;
  for (let i = 0; i < linhas.length; i += 500) {
    const lote = linhas.slice(i, i + 500);
    const q = conflito
      ? novo.db.from(tabela).upsert(lote, { onConflict: conflito })
      : novo.db.from(tabela).insert(lote);
    const { error } = await q;
    if (error) throw new Error(`${tabela}: ${error.message}`);
  }
}

async function esvaziar(tabela, coluna) {
  if (!aplicar) return;
  const { error } = await novo.db.from(tabela).delete().not(coluna, "is", null);
  if (error) throw new Error(`limpar ${tabela}: ${error.message}`);
}

// Ordem das chaves estrangeiras: módulo antes de aula, aula antes de material.
await gravar("modules", await lerTudo(antigo.db, "modules"), "id");
await gravar("lessons", await lerTudo(antigo.db, "lessons"), "id");
await gravar("materials", await lerTudo(antigo.db, "materials"), "id");
await gravar("questions", await lerTudo(antigo.db, "questions"), "id");

// Modelos de e-mail: só os de resultado. Boas-vindas e redefinição de senha foram reescritos na
// 0025 com o texto novo, e o antigo passaria por cima.
const modelos = (await lerTudo(antigo.db, "email_templates")).filter(
  (m) => !["boas-vindas", "redefinicao-senha"].includes(m.chave),
);
await gravar("email_templates", modelos, "chave");

// Políticas: a 0016 criou uma "esteira" no banco novo com id próprio, e o índice de "uma ativa só"
// recusaria a antiga ao lado dela. Sai a do banco novo, entram as antigas com os mesmos ids.
await esvaziar("release_policies", "id");
await gravar("release_policies", await lerTudo(antigo.db, "release_policies"));
await gravar("release_rules", await lerTudo(antigo.db, "release_rules"));

// A esteira semanal da 0024 (módulo 0 no ato, depois um por semana) rodou no banco novo quando ele
// ainda não tinha módulos, então não pegou nada. Reaplicada aqui sobre a política ativa.
if (aplicar) {
  const { data: ativa } = await novo.db.from("release_policies").select("id").eq("ativa", true).maybeSingle();
  const { data: mods } = await novo.db.from("modules").select("id,ord");
  if (ativa && mods?.length) {
    const regras = mods.map((m) => ({
      policy_id: ativa.id, module_id: m.id, tipo: "dias", dias: m.ord * 7, abre_em: null, depende_de_ord: null,
    }));
    const { error } = await novo.db.from("release_rules").upsert(regras, { onConflict: "policy_id,module_id" });
    if (error) throw new Error(`esteira semanal: ${error.message}`);
    console.log(`esteira semanal   aplicada em ${regras.length} módulo(s)`);
  }
}

// Consentimento: os documentos com os ids antigos, porque cada aceite aponta para o documento.
// O banco novo ainda não tem aceite nenhum, então trocar os documentos dele não órfã nada.
const documentos = await lerTudo(antigo.db, "consent_documents");
if (documentos.length) {
  await esvaziar("consent_documents", "id");
  await gravar("consent_documents", documentos);
}
const aceites = (await lerTudo(antigo.db, "consents")).map((c) => ({ ...c, user_id: null }));
await gravar("consents", aceites, "id");

// Banners dos e-mails, se alguém subiu algum pelo admin (bucket da 0011).
const { data: arquivos } = await antigo.db.storage.from("email").list("", { limit: 1000 });
const banners = (arquivos ?? []).filter((a) => a.id);
console.log(`${"storage/email".padEnd(18)} ${String(banners.length).padStart(5)} arquivo(s)`);
if (aplicar) {
  for (const a of banners) {
    const { data: blob, error } = await antigo.db.storage.from("email").download(a.name);
    if (error) throw new Error(`baixar ${a.name}: ${error.message}`);
    const { error: e2 } = await novo.db.storage
      .from("email")
      .upload(a.name, blob, { upsert: true, contentType: a.metadata?.mimetype });
    if (e2) throw new Error(`subir ${a.name}: ${e2.message}`);
  }
}

console.log(aplicar ? "\nok, copiado." : "\nsimulação terminada. Rode com --aplicar para copiar.");

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * ROTA TEMPORÁRIA, 30/set/2026. Apagar assim que a cópia rodar.
 *
 * Copia o conteúdo do banco antigo (o que o site usa hoje) para o projeto Supabase novo, na conta
 * do Marcelo. Existe porque a chave do banco antigo está no Netlify como segredo, que ninguém
 * consegue ler, e o projeto antigo está na conta de quem saiu da empresa. Só o servidor do site
 * enxerga a chave, então a cópia roda aqui dentro.
 *
 * Por que não tem senha: a rota não devolve dado nenhum, só contagens, e a cópia é idempotente
 * (rodar duas vezes dá o mesmo resultado). O pior que um curioso consegue é copiar de novo o que
 * já foi copiado. Sem as variáveis NOVO_* ela não faz nada.
 *
 * Contas, matrículas, progresso e provas não vêm: só existem contas de teste, e tudo isso pende
 * de auth.users. Os aceites vêm com user_id vazio pelo mesmo motivo.
 */
export const dynamic = "force-dynamic";

const opcoes = { auth: { autoRefreshToken: false, persistSession: false } };

async function lerTudo(db: SupabaseClient, tabela: string) {
  const linhas: Record<string, unknown>[] = [];
  for (let de = 0; ; de += 1000) {
    const { data, error } = await db.from(tabela).select("*").range(de, de + 999);
    if (error) return { linhas: null, erro: error.message };
    linhas.push(...(data as Record<string, unknown>[]));
    if (data.length < 1000) return { linhas, erro: null };
  }
}

export async function POST() {
  const urlNovo = process.env.NOVO_SUPABASE_URL;
  const chaveNovo = process.env.NOVO_SUPABASE_SERVICE_ROLE_KEY;
  if (!urlNovo || !chaveNovo) {
    return NextResponse.json({ ok: false, erro: "faltam NOVO_SUPABASE_URL e NOVO_SUPABASE_SERVICE_ROLE_KEY" }, { status: 503 });
  }
  const antigo = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, opcoes);
  const novo = createClient(urlNovo, chaveNovo, opcoes);
  if (new URL(urlNovo).host === new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host) {
    return NextResponse.json({ ok: false, erro: "o banco novo é o mesmo do site" }, { status: 400 });
  }

  const resumo: Record<string, number | string> = {};
  const falhar = (etapa: string, msg: string) =>
    NextResponse.json({ ok: false, etapa, erro: msg, resumo }, { status: 500 });

  // Conteúdo do curso, na ordem das chaves estrangeiras.
  for (const [tabela, chave] of [
    ["modules", "id"],
    ["lessons", "id"],
    ["materials", "id"],
    ["questions", "id"],
  ] as const) {
    const { linhas, erro } = await lerTudo(antigo, tabela);
    if (erro || !linhas) return falhar(`ler ${tabela}`, erro ?? "vazio");
    if (linhas.length) {
      const { error } = await novo.from(tabela).upsert(linhas, { onConflict: chave });
      if (error) return falhar(`gravar ${tabela}`, error.message);
    }
    resumo[tabela] = linhas.length;
  }

  // Modelos de e-mail: só os de resultado. Boas-vindas e redefinição vieram reescritos na 0025.
  {
    const { linhas, erro } = await lerTudo(antigo, "email_templates");
    if (erro || !linhas) return falhar("ler email_templates", erro ?? "vazio");
    const resultado = linhas.filter((m) => !["boas-vindas", "redefinicao-senha"].includes(String(m.chave)));
    if (resultado.length) {
      const { error } = await novo.from("email_templates").upsert(resultado, { onConflict: "chave" });
      if (error) return falhar("gravar email_templates", error.message);
    }
    resumo.email_templates = resultado.length;
  }

  // Políticas de liberação: as do banco novo saem, entram as antigas com os mesmos ids.
  {
    const pol = await lerTudo(antigo, "release_policies");
    const reg = await lerTudo(antigo, "release_rules");
    if (pol.erro || reg.erro || !pol.linhas || !reg.linhas) return falhar("ler políticas", pol.erro ?? reg.erro ?? "vazio");
    if (pol.linhas.length) {
      const { error: e1 } = await novo.from("release_policies").delete().not("id", "is", null);
      if (e1) return falhar("limpar políticas", e1.message);
      const { error: e2 } = await novo.from("release_policies").insert(pol.linhas);
      if (e2) return falhar("gravar políticas", e2.message);
      if (reg.linhas.length) {
        const { error: e3 } = await novo.from("release_rules").insert(reg.linhas);
        if (e3) return falhar("gravar regras", e3.message);
      }
    }
    resumo.release_policies = pol.linhas.length;
    resumo.release_rules = reg.linhas.length;

    // A esteira semanal da 0024 (módulo 0 no ato, depois um por semana) sobre a política ativa.
    const { data: ativa } = await novo.from("release_policies").select("id").eq("ativa", true).maybeSingle();
    const { data: mods } = await novo.from("modules").select("id,ord");
    if (ativa && mods?.length) {
      const regras = mods.map((m) => ({
        policy_id: ativa.id, module_id: m.id, tipo: "dias", dias: (m.ord as number) * 7, abre_em: null, depende_de_ord: null,
      }));
      const { error } = await novo.from("release_rules").upsert(regras, { onConflict: "policy_id,module_id" });
      if (error) return falhar("esteira semanal", error.message);
      resumo.esteira_semanal = regras.length;
    }
  }

  // Consentimento. Se o banco antigo não tiver a 0023, não há o que copiar.
  {
    const docs = await lerTudo(antigo, "consent_documents");
    const aceites = await lerTudo(antigo, "consents");
    if (docs.linhas && aceites.linhas) {
      const { count } = await novo.from("consents").select("id", { count: "exact", head: true });
      if (!count && docs.linhas.length) {
        const { error: e1 } = await novo.from("consent_documents").delete().not("id", "is", null);
        if (e1) return falhar("limpar documentos", e1.message);
        const { error: e2 } = await novo.from("consent_documents").insert(docs.linhas);
        if (e2) return falhar("gravar documentos", e2.message);
      }
      if (aceites.linhas.length) {
        // `ignoreDuplicates` vira "on conflict do nothing": o log é append-only e o trigger
        // recusaria qualquer UPDATE, inclusive o de um upsert numa segunda rodada.
        const { error } = await novo
          .from("consents")
          .upsert(aceites.linhas.map((c) => ({ ...c, user_id: null })), { onConflict: "id", ignoreDuplicates: true });
        if (error) return falhar("gravar consentimentos", error.message);
      }
      resumo.consent_documents = docs.linhas.length;
      resumo.consents = aceites.linhas.length;
    } else {
      resumo.consents = "banco antigo sem a 0023";
    }
  }

  // Banners de e-mail subidos pelo admin, se houver.
  {
    const { data: arquivos } = await antigo.storage.from("email").list("", { limit: 1000 });
    let copiados = 0;
    for (const a of (arquivos ?? []).filter((x) => x.id)) {
      const { data: blob } = await antigo.storage.from("email").download(a.name);
      if (!blob) continue;
      const { error } = await novo.storage.from("email").upload(a.name, blob, { upsert: true, contentType: blob.type });
      if (!error) copiados++;
    }
    resumo.banners = copiados;
  }

  return NextResponse.json({ ok: true, resumo });
}

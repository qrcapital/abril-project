import { redirecionar303 } from "@/lib/redirecionar";
import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { origemValida } from "@/lib/admin-guarda";
import { auditar } from "@/lib/auditoria";
import { rotuloModulo } from "@/lib/curso";
import { TIPOS_DE_REGRA } from "@/lib/liberacao";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Escreve as políticas de liberação (migrations 0016 e 0024): criar, salvar, ativar e apagar.
 *
 * ┌─ LEIA ISTO ANTES DE MEXER ─────────────────────────────────────────────────────────────┐
 * │ A CHECAGEM DE PAPEL AQUI DENTRO É O ÚNICO GUARDA DESTA ROTA.                            │
 * │ Route handler NÃO passa por layout (HANDOFF §6): a guarda de `app/admin/layout.tsx`     │
 * │ não vale aqui, e a escrita sai pela service role, onde nenhuma policy segura por baixo. │
 * └──────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Toda ação é auditada: trocar a política ativa muda o curso de TODOS os alunos de uma vez, o
 * que faz dela a escrita de maior raio do painel.
 */

const DESTINO = "/admin/liberacao";
const UUID = /^[0-9a-f-]{36}$/i;

function voltar(req: NextRequest, params: Record<string, string>) {
  const url = new URL(DESTINO, req.url);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  // 303: o POST virou GET na volta, senão o recarregar da tela repete a mutação.
  return redirecionar303(url);
}

type LinhaNova = {
  policy_id: string;
  module_id: string;
  tipo: string;
  dias: number | null;
  abre_em: string | null;
  depende_de_ord: number | null;
};

export async function POST(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });
  // Cookie o navegador manda sozinho; o `Origin` ele não deixa outra página forjar. POST vindo de
  // outro site com a sessão do admin é recusado antes de tocar em qualquer dado.
  if (!origemValida(req)) return new NextResponse(null, { status: 403 });

  const form = await req.formData();
  const texto = (campo: string) => String(form.get(campo) ?? "").trim();

  const acao = texto("acao");
  const id = texto("id");
  const erro = (msg: string) => voltar(req, { erro: msg });

  const db = createAdminClient();

  // ---- ativar / apagar: só precisam do id ----------------------------------------------------

  if (acao === "ativar" || acao === "apagar") {
    if (!UUID.test(id)) return erro("Política não encontrada.");
    const { data: politica } = await db
      .from("release_policies")
      .select("id,nome,ativa")
      .eq("id", id)
      .maybeSingle();
    if (!politica) return erro("Política não encontrada.");

    if (acao === "apagar") {
      // A ativa não se apaga: o curso ficaria sem regra nenhuma e tudo cairia no "em breve"
      // padrão, fechando o curso inteiro sem ninguém ter pedido isso.
      if (politica.ativa) return erro("A política ativa não pode ser apagada. Ative outra antes.");
      const { error } = await db.from("release_policies").delete().eq("id", id);
      if (error) return erro("Não deu para apagar. Tente de novo.");
      // Sem `alvo` de propósito (rodada 4): a tela de Auditoria o resolve como PESSOA, e um
      // id de política ali vira "conta apagada". Quem identifica é o nome, no detalhe.
      await auditar(db, { autor, acao: "liberacao.apagar", detalhe: { nome: politica.nome } });
      return voltar(req, { ok: "apagada" });
    }

    if (!politica.ativa) {
      // Duas escritas, e a ordem importa por causa do índice único parcial: primeiro ninguém
      // é ativa, depois esta vira. Se a segunda falhar, o curso fica sem ativa (tudo em
      // breve), que é fechado demais mas nunca aberto demais — o erro seguro.
      const { error: e1 } = await db
        .from("release_policies")
        .update({ ativa: false })
        .eq("ativa", true);
      if (e1) return erro("Não deu para ativar. Tente de novo.");
      const { error: e2 } = await db.from("release_policies").update({ ativa: true }).eq("id", id);
      if (e2) return erro("A ativa anterior foi desligada, mas a nova não ligou. Ative de novo.");
      await auditar(db, { autor, acao: "liberacao.ativar", detalhe: { nome: politica.nome } });
    }
    return voltar(req, { ok: "ativada" });
  }

  // ---- criar / salvar: nome + uma regra por módulo -------------------------------------------

  if (acao !== "criar" && acao !== "salvar") return erro("Ação desconhecida.");

  const nome = texto("nome");
  if (!nome || nome.length > 80) return erro("Dê um nome à política (até 80 caracteres).");

  const { data: mods, error: erroMods } = await db.from("modules").select("id,ord").order("ord");
  if (erroMods || !mods?.length) return erro("Não deu para ler os módulos. Tente de novo.");

  // Valida as regras ANTES de qualquer escrita: ou a política inteira entra, ou nada muda.
  const regras: Omit<LinhaNova, "policy_id">[] = [];
  const ords = new Set(mods.map((m) => m.ord as number));
  const tipoDoOrd = new Map<number, string>();
  for (const m of mods) {
    const ord = m.ord as number;
    const tipo = texto(`tipo_${m.id}`);
    if (!(TIPOS_DE_REGRA as readonly string[]).includes(tipo))
      return erro(`O ${rotuloModulo(ord)} está sem tipo de liberação.`);

    let dias: number | null = null;
    let abre_em: string | null = null;
    let depende_de_ord: number | null = null;
    if (tipo === "dias") {
      const bruto = texto(`dias_${m.id}`);
      // `Number("") === 0`: campo apagado viraria "no ato" em silêncio.
      dias = bruto === "" ? Number.NaN : Number(bruto);
      if (!Number.isInteger(dias) || dias < 0 || dias > 3650)
        return erro(`Dias do ${rotuloModulo(ord)}: use um inteiro entre 0 e 3650.`);
    }
    if (tipo === "data") {
      const bruto = texto(`data_${m.id}`);
      // O admin escolhe um dia pensando no Brasil; meia-noite de Brasília é o instante gravado.
      const data = /^\d{4}-\d{2}-\d{2}$/.test(bruto) ? new Date(`${bruto}T00:00:00-03:00`) : null;
      if (!data || Number.isNaN(data.getTime()))
        return erro(`Data do ${rotuloModulo(ord)}: escolha um dia no calendário.`);
      abre_em = data.toISOString();
    }
    if (tipo === "apos_modulo") {
      // Aqui, ao contrário do tipo `dias`, campo vazio é 0 de propósito: "após concluir" sem
      // dias extras é o caso comum, e o "+ N dias" é o opcional.
      const brutoDias = texto(`dias_${m.id}`);
      dias = brutoDias === "" ? 0 : Number(brutoDias);
      if (!Number.isInteger(dias) || dias < 0 || dias > 3650)
        return erro(`Dias do ${rotuloModulo(ord)}: use um inteiro entre 0 e 3650.`);
      const brutoDep = texto(`depende_${m.id}`);
      depende_de_ord = brutoDep === "" ? Number.NaN : Number(brutoDep);
      // Só módulo ANTERIOR e existente. Depender de si ou de um posterior pode fechar ciclo
      // (II espera o III, III espera o II), e ciclo tranca os dois para sempre sem erro na tela
      // do aluno. O banco recusa também (trigger da 0024); aqui é para a mensagem ser boa.
      if (!Number.isInteger(depende_de_ord) || !ords.has(depende_de_ord))
        return erro(`${rotuloModulo(ord)}: escolha o módulo que precisa ser concluído antes.`);
      if (depende_de_ord >= ord)
        return erro(
          `${rotuloModulo(ord)} não pode depender de si mesmo nem de um módulo posterior.`,
        );
      // Em breve não tem aula para concluir: o módulo dependente nunca abriria. A ordem do laço
      // é a dos ords, então o tipo do anterior já foi lido.
      if (tipoDoOrd.get(depende_de_ord) === "em_breve")
        return erro(
          `${rotuloModulo(ord)} depende do ${rotuloModulo(depende_de_ord)}, que está em breve: ` +
            "ele nunca abriria. Mude um dos dois.",
        );
    }
    tipoDoOrd.set(ord, tipo);
    regras.push({ module_id: m.id as string, tipo, dias, abre_em, depende_de_ord });
  }

  let policyId = id;
  if (acao === "criar") {
    const { data, error } = await db
      .from("release_policies")
      .insert({ nome })
      .select("id")
      .single();
    if (error || !data) return erro("Não deu para criar a política. Tente de novo.");
    policyId = data.id as string;
  } else {
    if (!UUID.test(id)) return erro("Política não encontrada.");
    const { error } = await db.from("release_policies").update({ nome }).eq("id", id);
    if (error) return erro("Não deu para salvar. Tente de novo.");
  }

  const { error: erroRegras } = await db
    .from("release_rules")
    .upsert(
      regras.map((r) => ({ ...r, policy_id: policyId })),
      { onConflict: "policy_id,module_id" },
    );
  if (erroRegras) return erro("O nome foi salvo, mas as regras não. Salve de novo.");

  await auditar(db, {
    autor,
    acao: acao === "criar" ? "liberacao.criar" : "liberacao.salvar",
    // O detalhe carrega a política inteira: é pequena (5 regras) e é a resposta da auditoria
    // para "o que exatamente valia quando o aluno reclamou".
    // `apos_modulo` leva o ord do pré-requisito antes dos dias: "apos_modulo:1:3" = após o I, +3.
    detalhe: {
      nome,
      regras: regras.map(
        (r) =>
          `${r.tipo}${r.depende_de_ord !== null ? `:${r.depende_de_ord}` : ""}${r.dias !== null ? `:${r.dias}` : ""}${r.abre_em ? `:${r.abre_em.slice(0, 10)}` : ""}`,
      ),
    },
  });

  return voltar(req, { ok: acao === "criar" ? "criada" : "salva" });
}

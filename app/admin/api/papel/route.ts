import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { auditar } from "@/lib/auditoria";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Concede e revoga `is_admin` (PLANO-ADMIN §8). Recebe POST de formulário da tela de Equipe.
 *
 * ┌─ LEIA ISTO ANTES DE MEXER ─────────────────────────────────────────────────────────────┐
 * │ A CHECAGEM DE PAPEL AQUI DENTRO É O ÚNICO GUARDA DESTA ROTA.                            │
 * │                                                                                         │
 * │ Route handler NÃO passa por layout, então a guarda de `app/admin/layout.tsx` não vale    │
 * │ aqui: qualquer pessoa logada pode dar POST neste endereço direto, sem nunca abrir uma    │
 * │ tela do admin. E o trigger `guarda_is_admin` do banco também não segura, porque a        │
 * │ escrita sai pela service role, onde `auth.uid()` é null — que é justamente o caminho     │
 * │ que o trigger libera.                                                                   │
 * │                                                                                         │
 * │ Ou seja: sem o `papel !== "admin"` abaixo, esta rota é a escalada de privilégio da       │
 * │ migration 0003 de volta, servida em HTTP. Não remover, não mover para o layout, não      │
 * │ trocar por confiança no `<form>` da tela.                                                │
 * └─────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Responde 404 e não 403 para não-admin, pelo mesmo motivo da guarda do layout: não confirmar
 * que a rota existe.
 */

const DESTINO = "/admin/equipe";

/** Volta para a tela com a busca preservada e uma mensagem. */
function voltar(req: NextRequest, params: Record<string, string>) {
  const url = new URL(DESTINO, req.url);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  // 303: o POST virou GET na volta, senão o recarregar da tela repete a mutação.
  return NextResponse.redirect(url, 303);
}

export async function POST(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });

  const form = await req.formData();
  const alvo = String(form.get("userId") ?? "");
  const acao = String(form.get("acao") ?? "");
  const q = String(form.get("q") ?? "");

  if (!/^[0-9a-f-]{36}$/i.test(alvo) || (acao !== "promover" && acao !== "revogar")) {
    return voltar(req, { q, erro: "Pedido inválido." });
  }

  const promover = acao === "promover";
  const db = createAdminClient();

  // A lista de admins responde duas perguntas de uma vez: se o alvo já é admin (para não
  // gravar em vão) e quantos existem (para a trava do último).
  const { data: admins, error: erroAdmins } = await db.rpc("listar_admins");
  if (erroAdmins) return voltar(req, { q, erro: "Não deu para ler a lista de admins." });

  const linha = (admins ?? []).find((a: { id: string }) => a.id === alvo);
  const jaEhAdmin = Boolean(linha);
  if (jaEhAdmin === promover) {
    return voltar(req, { q, erro: "Nada a fazer: a conta já está nesse estado." });
  }

  // A REGRA DO ADMIN MESTRE (pedido do Pedro em 30/jul/2026): admin comum faz tudo, menos mexer
  // no acesso de um mestre. Esta checagem é o controle do caminho do app; a mesma regra está no
  // trigger `guarda_is_admin` da migration `0005`, que cobre qualquer caminho direto ao banco.
  // As duas existem porque o app escreve com a service role, onde o trigger passa direto.
  if (!promover && linha?.is_master && !autor.mestre) {
    return voltar(req, {
      q,
      erro: "Só um admin mestre pode mexer no acesso de outro admin mestre.",
    });
  }

  // Duas travas que existem para o painel não se trancar por fora. A do último admin é a mesma
  // do `scripts/admin-conta.mjs`; a de si mesmo é só desta tela, porque no script quem digita o
  // comando tem a service role na mão e pode se desfazer, e aqui não.
  if (!promover && alvo === autor.id) {
    return voltar(req, { q, erro: "Você não pode remover o seu próprio acesso de admin." });
  }
  if (!promover && (admins ?? []).length <= 1) {
    return voltar(req, { q, erro: "Este é o único admin. Promova outra conta antes de revogar." });
  }
  // Terceira trava, da mesma família: sem mestre nenhum, ninguém mais consegue mexer num mestre,
  // e a única saída seria o script com a service role.
  if (!promover && linha?.is_master) {
    const mestres = (admins ?? []).filter((a: { is_master: boolean }) => a.is_master);
    if (mestres.length <= 1) {
      return voltar(req, {
        q,
        erro: "Este é o único admin mestre. Promova outro mestre antes de revogar.",
      });
    }
  }

  // Sem linha em `profiles` o update não afeta nada e a tela mentiria um sucesso. Acontece se o
  // upsert do signup não rodou para aquela conta.
  const { data: perfil } = await db
    .from("profiles")
    .select("id")
    .eq("id", alvo)
    .maybeSingle();
  if (!perfil) {
    return voltar(req, { q, erro: "Essa conta não tem perfil. Ela precisa entrar uma vez antes." });
  }

  // Revogar limpa os DOIS campos. Não é zelo: o CHECK `profiles_master_implica_admin` da `0005`
  // rejeita (is_master=true, is_admin=false), então revogar um mestre sem limpar `is_master`
  // falharia na gravação. Promover não mexe em `is_master`, que já é false por causa do mesmo
  // CHECK.
  const { error } = await db
    .from("profiles")
    .update(promover ? { is_admin: true } : { is_admin: false, is_master: false })
    .eq("id", alvo);
  if (error) return voltar(req, { q, erro: "A gravação falhou." });

  // Confere lendo de volta, como o script faz: um update pode "passar" sem afetar linha, e
  // numa tela de privilégio um sucesso falso é pior que um erro.
  const { data: depois } = await db
    .from("profiles")
    .select("is_admin")
    .eq("id", alvo)
    .single();
  if (depois?.is_admin !== promover) {
    return voltar(req, { q, erro: "A gravação não teve efeito. Nada foi alterado." });
  }

  // AUDITORIA. O teto que estava anotado aqui (log de servidor, retenção curta, ninguém consulta)
  // caiu em 31/jul/2026, quando a liberação de 2ª chamada virou a quarta escrita sensível e a tabela
  // `admin_audit` foi criada (migration `0014`). O `auditar` continua logando no servidor além de
  // gravar, então o pior caso é o de antes.
  await auditar(db, {
    autor,
    acao: promover ? "papel.promover" : "papel.revogar",
    alvo,
    detalhe: { email: linha?.email ?? null, era_mestre: linha?.is_master ?? false },
  });

  return voltar(req, { q, ok: promover ? "promovido" : "revogado" });
}

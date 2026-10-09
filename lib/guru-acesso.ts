import "server-only";

import { TEXTO_ACEITE_CHECKOUT, registrarConsentimento } from "@/lib/consentimento";
import { enviarAcesso } from "@/lib/email";
import type { EventoGuru } from "@/lib/guru";
import type { createAdminClient } from "@/lib/supabase/admin";

/**
 * O que uma venda aprovada faz do nosso lado: conta, matrícula, e-mail de boas-vindas e o aceite
 * do checkout. Saiu de dentro do webhook (09/out/2026) porque agora tem DOIS chamadores:
 * - o webhook do Guru (`app/api/webhooks/guru/route.ts`), como sempre;
 * - a página de compra aprovada (`app/api/acesso/compra/route.ts`), que busca a venda na API do
 *   Guru assim que o comprador chega, sem esperar o webhook, que leva de 25 s a 2 min.
 * Tudo aqui é idempotente por `guru_order_id`: quem chegar segundo não duplica nada.
 */

const ACCESS_YEARS = 1;

type Db = ReturnType<typeof createAdminClient>;

/** Cria/ativa o acesso. Idempotente por guru_order_id. Devolve o dono da matrícula. */
export async function provisionAccess(db: Db, event: EventoGuru): Promise<string> {
  // Dedupe: já existe matrícula para esta ordem?
  const { data: existing, error: dedupeErr } = await db
    .from("enrollments")
    .select("user_id")
    .eq("guru_order_id", event.transacaoId!)
    .maybeSingle();
  // Erro na consulta NÃO pode ser lido como "não existe": seguiria para criar de novo.
  if (dedupeErr) throw dedupeErr;
  if (existing) return existing.user_id as string; // reentrega: nada a fazer

  if (!event.email) throw new Error("evento aprovado sem e-mail");

  const userId = await findOrCreateUser(db, event);

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + ACCESS_YEARS);

  const { error: enrollErr } = await db.from("enrollments").insert({
    user_id: userId,
    status: "active",
    guru_order_id: event.transacaoId,
    expires_at: expiresAt.toISOString(),
  });
  // Corrida de reentrega simultânea (ou webhook e página de obrigado ao mesmo tempo): a unique
  // constraint protege, e quem inseriu primeiro manda o e-mail.
  if (enrollErr) {
    if (enrollErr.code === "23505" || enrollErr.message.includes("duplicate")) return userId;
    throw enrollErr;
  }

  // Nunca lança (ver `lib/email.ts`): e-mail que falha fica no log e o admin reenvia.
  await enviarAcesso(db, { email: event.email, userId, nome: event.nome });
  return userId;
}

/** Revoga acesso por ordem (reembolso/chargeback). */
export async function revokeAccess(db: Db, orderId: string) {
  const { error } = await db
    .from("enrollments")
    .update({ status: "revoked" })
    .eq("guru_order_id", orderId);
  // Antes o erro era descartado e a rota respondia 200: um reembolso que não revogou nada, sem
  // reentrega e sem rastro. Lançar aqui vira 500, e o Guru tenta de novo.
  if (error) throw error;
}

/** Acha o usuário pelo e-mail ou cria um novo. */
async function findOrCreateUser(db: Db, event: EventoGuru): Promise<string> {
  const { data: created, error } = await db.auth.admin.createUser({
    email: event.email!,
    email_confirm: true,
    user_metadata: {
      nome: event.nome,
      telefone: event.telefone,
      guru_customer_id: event.contatoId,
    },
  });
  if (created?.user) return created.user.id;

  // Já existe (recompra, ou conta criada antes): localiza pelo e-mail, por igualdade, no banco.
  // O `listUsers()` que estava aqui trazia só a primeira página, e a partir do 51º aluno a
  // recompra falhava para sempre (migration 0025).
  const { data: id, error: buscaErr } = await db.rpc("usuario_por_email", { p_email: event.email });
  if (buscaErr) throw buscaErr;
  if (typeof id === "string" && id) return id;
  throw error ?? new Error("não foi possível criar nem localizar o usuário");
}

/**
 * O aceite dos documentos que acontece no checkout do Guru, amarrado ao pedido.
 *
 * MELHOR ESFORÇO: nada aqui derruba quem chamou (regra do topo de `lib/consentimento.ts`). Uma
 * linha por pedido: a reentrega do mesmo evento, ou o `completed` que chega depois do `approved`,
 * não duplica o registro.
 */
export async function registrarAceiteDoCheckout(db: Db, event: EventoGuru, userId: string) {
  // Consentimento sem o e-mail do titular não identifica ninguém; melhor não gravar.
  if (!event.email) return;
  try {
    const { data: ja, error } = await db
      .from("consents")
      .select("id")
      .eq("guru_order_id", event.transacaoId!)
      .eq("origem", "checkout-guru")
      .limit(1);
    if (error) throw error;
    if (ja && ja.length > 0) return;

    await registrarConsentimento(db, {
      email: event.email,
      nome: event.nome,
      origem: "checkout-guru",
      userId,
      guruOrderId: event.transacaoId,
      texto: TEXTO_ACEITE_CHECKOUT,
      // O IP desta requisição não é o do comprador no momento do aceite.
      daRequisicao: false,
    });
  } catch (e) {
    console.error("[guru] aceite do checkout nao registrado:", e instanceof Error ? e.message : e);
  }
}

import { NextRequest, NextResponse } from "next/server";

import { TEXTO_ACEITE_CHECKOUT, registrarConsentimento } from "@/lib/consentimento";
import { enviarAcesso } from "@/lib/email";
import {
  listaDeProdutos,
  normalizarGuru,
  produtoPermitido,
  semToken,
  tokenConfere,
  type EventoGuru,
} from "@/lib/guru";
import { emProducao } from "@/lib/seguranca";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Webhook do Digital Manager Guru (Pagar.me é o gateway configurado dentro do Guru).
 * Compra aprovada -> cria usuário + matrícula + **envia** o e-mail de boas-vindas.
 * Reembolso/chargeback -> revoga o acesso.
 *
 * ┌─ A AUTENTICAÇÃO É O `api_token` NO CORPO, NÃO HMAC ───────────────────────────────────────────┐
 * │ O Guru não assina a entrega. Ele manda o token da conta dentro do JSON, e a conferência é     │
 * │ esse campo contra `GURU_API_TOKEN`. A versão anterior esperava um cabeçalho HMAC que o Guru   │
 * │ nunca mandou: com o secret configurado, TODA venda real voltaria 401; sem ele, a rota         │
 * │ aceitava qualquer POST da internet como compra aprovada.                                      │
 * │                                                                                               │
 * │ Em produção, token ausente no ambiente é 503, não "passa": fail-closed. O Guru reentrega por   │
 * │ um tempo, então configurar a variável depois recupera as vendas do intervalo.                  │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * CÓDIGOS DE RESPOSTA, e o que o Guru faz com cada um: 200 encerra (inclusive evento ignorado,
 * senão ele reentregaria para sempre um status que a gente não trata); 401/400 também encerram,
 * porque repetir não conserta; 500 e 503 fazem o Guru reentregar, e o processamento é
 * idempotente por `guru_order_id`, então reentrega é segura.
 */

const ACCESS_YEARS = 1;

type Db = ReturnType<typeof createAdminClient>;

export async function POST(req: NextRequest) {
  const raw = await req.text();

  // 1) Parse. Vem antes do token porque o token mora no corpo.
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // 2) Token ---------------------------------------------------------------------------------
  // `GURU_WEBHOOK_SECRET` é o nome antigo, aceito como apelido para não quebrar um ambiente que
  // já tenha a variável preenchida com o token.
  const esperado = process.env.GURU_API_TOKEN?.trim() || process.env.GURU_WEBHOOK_SECRET?.trim() || "";
  if (!esperado) {
    if (emProducao()) {
      console.error("[guru] GURU_API_TOKEN ausente em producao: entrega recusada (503).");
      return NextResponse.json({ error: "not configured" }, { status: 503 });
    }
    console.warn("[guru] GURU_API_TOKEN ausente: token nao conferido (ambiente de teste).");
  } else if (!tokenConfere((payload as Record<string, unknown> | null)?.api_token, esperado)) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const event = normalizarGuru(payload);

  let db: Db;
  try {
    db = createAdminClient();
  } catch (err) {
    console.error("[guru] sem cliente do Supabase:", err);
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  // 3) Registro cru, ANTES de processar --------------------------------------------------------
  // Falhar aqui não bloqueia a venda: o registro serve ao suporte, a matrícula serve a quem pagou.
  const eventoId = await registrarEvento(db, req, event, payload);
  const concluir = async (resultado: string, erro: string | null = null) => {
    if (!eventoId) return;
    const { error } = await db
      .from("guru_events")
      .update({ processed_at: new Date().toISOString(), resultado, erro })
      .eq("id", eventoId);
    if (error) console.error("[guru] nao deu para concluir o evento:", error.message);
  };

  // 4) Filtros --------------------------------------------------------------------------------
  if (event.acao === "ignorar") {
    await concluir(`ignorado: ${event.motivo}`);
    return NextResponse.json({ ok: true, ignored: event.motivo });
  }
  if (!event.transacaoId) {
    // Sem identificador não dá para ser idempotente; aceitamos e ignoramos.
    await concluir("ignorado: sem id de transacao");
    return NextResponse.json({ ok: true, ignored: "sem id" });
  }

  const produtos = listaDeProdutos(process.env.GURU_PRODUCT_IDS);
  if (produtos.length === 0 && emProducao()) {
    // Não recusa: o filtro pode estar no painel do Guru (webhook por produto). Mas avisa, porque
    // sem nenhum dos dois, a venda de QUALQUER produto da conta viraria matrícula neste curso.
    console.warn("[guru] GURU_PRODUCT_IDS vazio em producao: sem filtro de produto do nosso lado.");
  }
  if (!produtoPermitido(event.produtos, produtos)) {
    await concluir("ignorado: produto fora de GURU_PRODUCT_IDS");
    return NextResponse.json({ ok: true, ignored: "produto" });
  }

  // 5) Processamento ------------------------------------------------------------------------------
  try {
    if (event.acao === "aprovado") {
      const userId = await provisionAccess(db, event);
      await registrarAceiteDoCheckout(db, event, userId);
    } else {
      await revokeAccess(db, event.transacaoId);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[guru] erro ao processar webhook:", msg);
    await concluir("erro", msg.slice(0, 500));
    // 500 faz o Guru reentregar; o processamento é idempotente, então é seguro.
    return NextResponse.json({ error: "processing error" }, { status: 500 });
  }

  await concluir("processado");
  return NextResponse.json({ ok: true });
}

/** Grava a entrega em `guru_events`, sem o token. Devolve o id, ou null se não deu. */
async function registrarEvento(
  db: Db,
  req: NextRequest,
  event: EventoGuru,
  payload: unknown,
): Promise<string | null> {
  const { data, error } = await db
    .from("guru_events")
    .insert({
      request_id: req.headers.get("x-request-id")?.slice(0, 200) ?? null,
      transaction_id: event.transacaoId,
      status: event.status,
      webhook_type: event.webhookType,
      email: event.email,
      payload: semToken(payload) ?? {},
    })
    .select("id")
    .single();
  if (error) {
    console.error("[guru] nao deu para registrar o evento:", error.message);
    return null;
  }
  return data.id as string;
}

/** Cria/ativa o acesso. Idempotente por guru_order_id. Devolve o dono da matrícula. */
async function provisionAccess(db: Db, event: EventoGuru): Promise<string> {
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
  // Corrida de reentrega simultânea: a unique constraint protege, e a outra entrega manda o e-mail.
  if (enrollErr) {
    if (enrollErr.code === "23505" || enrollErr.message.includes("duplicate")) return userId;
    throw enrollErr;
  }

  // Nunca lança (ver `lib/email.ts`): e-mail que falha fica no log e o admin reenvia.
  await enviarAcesso(db, { email: event.email, userId, nome: event.nome });
  return userId;
}

/** Revoga acesso por ordem (reembolso/chargeback). */
async function revokeAccess(db: Db, orderId: string) {
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
 * MELHOR ESFORÇO: nada aqui derruba o webhook (regra do topo de `lib/consentimento.ts`). Uma linha
 * por pedido: a reentrega do mesmo evento, ou o `completed` que chega depois do `approved`, não
 * duplica o registro.
 */
async function registrarAceiteDoCheckout(db: Db, event: EventoGuru, userId: string) {
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
      // O IP desta requisição é o do servidor do Guru, não o do comprador.
      daRequisicao: false,
    });
  } catch (e) {
    console.error("[guru] aceite do checkout nao registrado:", e instanceof Error ? e.message : e);
  }
}

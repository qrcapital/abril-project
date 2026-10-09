import { NextRequest, NextResponse } from "next/server";

import {
  listaDeProdutos,
  normalizarGuru,
  produtoPermitido,
  semToken,
  tokenConfere,
  type EventoGuru,
} from "@/lib/guru";
import { provisionAccess, registrarAceiteDoCheckout, revokeAccess } from "@/lib/guru-acesso";
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
    // Deixa rastro da recusa (09/out/2026): na ligação das vendas não estava claro qual token do
    // Guru vem no corpo (o da conta ou um "Token API" do perfil). Sem este registro, uma entrega
    // com o token errado sumia sem deixar sinal do nosso lado. Grava só tipo, status e id da
    // transação: nada de payload, e-mail ou token, porque a origem não foi autenticada.
    await registrarRecusa(payload);
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

/** Rastro mínimo de uma entrega recusada por token. Melhor esforço: nunca lança. */
async function registrarRecusa(payload: unknown) {
  try {
    const e = normalizarGuru(payload);
    await createAdminClient()
      .from("guru_events")
      .insert({
        transaction_id: e.transacaoId?.slice(0, 200) ?? null,
        status: e.status?.slice(0, 50) ?? null,
        webhook_type: e.webhookType?.slice(0, 50) ?? null,
        email: null,
        payload: {},
        processed_at: new Date().toISOString(),
        resultado: "recusado: token nao confere com GURU_API_TOKEN",
      });
  } catch (err) {
    console.error("[guru] recusa nao registrada:", err instanceof Error ? err.message : err);
  }
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

// `provisionAccess`, `revokeAccess` e `registrarAceiteDoCheckout` moram em `lib/guru-acesso.ts` desde
// 09/out/2026: a página de compra aprovada também os chama (ver lá).

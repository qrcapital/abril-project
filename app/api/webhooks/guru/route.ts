import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Webhook do Digital Manager Guru.
 * Compra aprovada -> cria usuário + matrícula + registra e-mail de boas-vindas.
 * Reembolso/chargeback -> revoga o acesso.
 *
 * Requisitos (PRD §3): idempotente (dedupe por guru_order_id) e assinatura validada.
 *
 * PENDÊNCIA EXTERNA: o formato exato do payload e o esquema de assinatura do Guru
 * dependem da doc + secret que o PH vai providenciar. Os pontos a ajustar quando
 * chegarem estão marcados com TODO(guru).
 */

type NormalizedEvent = {
  type: "approved" | "refunded" | "chargeback" | "pending" | "unknown";
  orderId: string | null;
  email: string | null;
  nome: string | null;
  telefone: string | null;
  customerId: string | null;
};

const ACCESS_YEARS = 1;

export async function POST(req: NextRequest) {
  const raw = await req.text();

  // 1) Assinatura -------------------------------------------------------------
  const secret = process.env.GURU_WEBHOOK_SECRET;
  if (secret) {
    // TODO(guru): confirmar o nome do header e o algoritmo na doc do Guru.
    const signature = req.headers.get("x-guru-signature") ?? "";
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    const ok =
      signature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!ok) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  } else {
    console.warn("[guru] GURU_WEBHOOK_SECRET ausente: validação de assinatura pulada (sandbox).");
  }

  // 2) Parse + normalização ---------------------------------------------------
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const event = normalize(payload);

  if (!event.orderId) {
    // Sem identificador não dá para ser idempotente; aceitamos e ignoramos.
    return NextResponse.json({ ok: true, ignored: "sem order id" });
  }

  const db = createAdminClient();

  try {
    switch (event.type) {
      case "approved":
        await provisionAccess(db, event);
        break;
      case "refunded":
      case "chargeback":
        await revokeAccess(db, event.orderId);
        break;
      default:
        // pending/unknown: nada a fazer no lado da plataforma (e-mails são da seq. de checkout)
        break;
    }
  } catch (err) {
    console.error("[guru] erro ao processar webhook:", err);
    // 500 faz o Guru reentregar; o processamento é idempotente, então é seguro.
    return NextResponse.json({ error: "processing error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/** Cria/ativa o acesso. Idempotente por guru_order_id. */
async function provisionAccess(
  db: ReturnType<typeof createAdminClient>,
  event: NormalizedEvent,
) {
  // Dedupe: já existe matrícula para esta ordem?
  const { data: existing } = await db
    .from("enrollments")
    .select("id")
    .eq("guru_order_id", event.orderId!)
    .maybeSingle();
  if (existing) return; // reentrega: nada a fazer

  if (!event.email) throw new Error("evento aprovado sem e-mail");

  const userId = await findOrCreateUser(db, event);

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + ACCESS_YEARS);

  const { error: enrollErr } = await db.from("enrollments").insert({
    user_id: userId,
    status: "active",
    guru_order_id: event.orderId,
    expires_at: expiresAt.toISOString(),
  });
  // Corrida de reentrega simultânea: a unique constraint protege.
  if (enrollErr && !enrollErr.message.includes("duplicate")) throw enrollErr;

  // E-mail de boas-vindas com link de definição de senha.
  // TODO(ses): disparar via Amazon SES (template 3). Por ora, geramos o link e logamos.
  const { data: link } = await db.auth.admin.generateLink({
    type: "invite",
    email: event.email,
  });
  await db.from("email_log").insert({
    user_id: userId,
    template: "boas-vindas",
    status: link ? "queued" : "link_error",
  });
}

/** Revoga acesso por ordem (reembolso/chargeback). */
async function revokeAccess(
  db: ReturnType<typeof createAdminClient>,
  orderId: string,
) {
  await db.from("enrollments").update({ status: "revoked" }).eq("guru_order_id", orderId);
}

/** Acha o usuário pelo e-mail ou cria um novo. */
async function findOrCreateUser(
  db: ReturnType<typeof createAdminClient>,
  event: NormalizedEvent,
): Promise<string> {
  const { data: created, error } = await db.auth.admin.createUser({
    email: event.email!,
    email_confirm: true,
    user_metadata: {
      nome: event.nome,
      telefone: event.telefone,
      guru_customer_id: event.customerId,
    },
  });
  if (created?.user) return created.user.id;

  // Já existe: localiza pelo e-mail.
  if (error) {
    const { data: list } = await db.auth.admin.listUsers();
    const found = list?.users.find(
      (u) => u.email?.toLowerCase() === event.email!.toLowerCase(),
    );
    if (found) return found.id;
  }
  throw error ?? new Error("não foi possível criar nem localizar o usuário");
}

/**
 * Normaliza o payload do Guru num evento interno.
 * TODO(guru): mapear os campos reais quando a doc do payload chegar.
 * O mapeamento abaixo cobre nomes comuns e é tolerante a variações.
 */
function normalize(payload: unknown): NormalizedEvent {
  const p = (payload ?? {}) as Record<string, unknown>;
  const data = (p.data ?? p) as Record<string, unknown>;
  const contact = (data.contact ?? data.customer ?? {}) as Record<string, unknown>;

  const rawStatus = String(
    data.status ?? data.order_status ?? p.event ?? p.type ?? "",
  ).toLowerCase();

  const type: NormalizedEvent["type"] =
    /approv|paid|aprovad/.test(rawStatus) ? "approved" :
    /refund|reembols/.test(rawStatus) ? "refunded" :
    /chargeback|estorno/.test(rawStatus) ? "chargeback" :
    /pending|pendente|waiting/.test(rawStatus) ? "pending" :
    "unknown";

  const str = (v: unknown) => (v == null ? null : String(v));

  return {
    type,
    orderId: str(data.order_id ?? data.id ?? data.transaction ?? p.order_id),
    email: str(contact.email ?? data.email),
    nome: str(contact.name ?? contact.nome ?? data.name),
    telefone: str(contact.phone ?? contact.telefone ?? data.phone),
    customerId: str(contact.id ?? data.customer_id),
  };
}

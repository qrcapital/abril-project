import { NextResponse, type NextRequest } from "next/server";

import { origemValida } from "@/lib/admin-guarda";
import { consumirLimite } from "@/lib/limite";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Acesso direto depois da compra, sem depender do e-mail (10/out/2026).
 *
 * O e-mail de acesso é o caminho mais frágil do produto: caiu no spam do Gmail e sumiu no Outlook
 * logo nas primeiras vendas. O Guru redireciona o comprador aprovado para `/obrigado?v=<id da venda
 * no marketplace>` (o `payment.marketplace_id` do webhook, "Marketplace -> ID da Venda" no painel).
 * Esta rota troca esse id por uma sessão da conta que o webhook criou e manda a pessoa direto para
 * a tela de criar senha. O e-mail continua saindo, agora como reforço.
 *
 * ┌─ AS TRAVAS ──────────────────────────────────────────────────────────────────────────────────┐
 * │ O id da venda é o único segredo aqui, então ele só vale:                                      │
 * │ - para venda aprovada/completa que o webhook PROCESSOU, recebida nas últimas 24 horas;         │
 * │ - para matrícula ativa;                                                                        │
 * │ - para conta que NUNCA entrou. Depois do primeiro acesso, o id não abre mais nada (a não ser   │
 * │   para o próprio navegador que já está com a sessão dessa conta, caso de quem recarrega a     │
 * │   página antes de criar a senha).                                                             │
 * │ Mais o teto por IP e o `Origin`, como as outras portas sem login.                             │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Estados devolvidos: `ok` (com `destino`), `aguardando` (o webhook ainda não chegou: o cliente
 * tenta de novo), `ja-entrou` (conta já usada: vai para o login), `limite`, `invalido`, `erro`.
 */

const FORMATO = /^[A-Za-z0-9_-]{8,64}$/;
const JANELA_MS = 24 * 3600 * 1000;
const DESTINO = "/app/redefinir-senha";

const resposta = (estado: string, status = 200, extra: Record<string, string> = {}) =>
  NextResponse.json({ estado, ...extra }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: NextRequest) {
  if (!origemValida(req)) return resposta("invalido", 403);

  const corpo = (await req.json().catch(() => null)) as { v?: unknown } | null;
  const v = typeof corpo?.v === "string" ? corpo.v.trim() : "";
  if (!FORMATO.test(v)) return resposta("invalido", 400);

  const db = createAdminClient();
  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "sem-ip";
  // O cliente consulta a cada 3 segundos por até um minuto enquanto o webhook não chega: 40 por
  // 10 minutos cobre isso com folga e corta quem tenta adivinhar ids.
  if (!(await consumirLimite(db, `compra:ip:${ip}`, 40, 600))) return resposta("limite", 429);

  const desde = new Date(Date.now() - JANELA_MS).toISOString();
  const { data: evento, error: erroEvento } = await db
    .from("guru_events")
    .select("transaction_id")
    .in("status", ["approved", "completed"])
    .eq("resultado", "processado")
    .eq("payload->payment->>marketplace_id", v)
    .gte("received_at", desde)
    .order("received_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (erroEvento) {
    console.error("[acesso/compra] guru_events:", erroEvento.message);
    return resposta("erro", 500);
  }
  if (!evento?.transaction_id) return resposta("aguardando");

  const { data: matricula } = await db
    .from("enrollments")
    .select("user_id,status")
    .eq("guru_order_id", evento.transaction_id)
    .maybeSingle();
  if (!matricula?.user_id || matricula.status !== "active") return resposta("aguardando");

  const { data: conta } = await db.auth.admin.getUserById(matricula.user_id);
  const usuario = conta?.user;
  if (!usuario?.email) return resposta("aguardando");

  const supabase = await createClient();

  if (usuario.last_sign_in_at) {
    // Já entrou alguma vez. Só segue se ESTE navegador já está na própria conta (recarregou a
    // página antes de criar a senha); qualquer outro caso vai para o login.
    const {
      data: { user: atual },
    } = await supabase.auth.getUser();
    return atual?.id === usuario.id ? resposta("ok", 200, { destino: DESTINO }) : resposta("ja-entrou");
  }

  const { data: link, error: erroLink } = await db.auth.admin.generateLink({
    type: "recovery",
    email: usuario.email,
  });
  const hash = link?.properties?.hashed_token;
  if (erroLink || !hash) {
    console.error("[acesso/compra] generateLink:", erroLink?.message ?? "sem hash");
    return resposta("erro", 500);
  }

  // Mesma regra do /auth/confirm: a sessão que estiver no navegador sai antes da nova entrar.
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    /* sem sessão anterior: nada a fazer */
  }
  const { error: erroOtp } = await supabase.auth.verifyOtp({ type: "recovery", token_hash: hash });
  if (erroOtp) {
    console.error("[acesso/compra] verifyOtp:", erroOtp.message);
    return resposta("erro", 500);
  }
  return resposta("ok", 200, { destino: DESTINO });
}

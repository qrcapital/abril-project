import { randomUUID } from "node:crypto";

import { redirecionar303 } from "@/lib/redirecionar";
import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { origemValida } from "@/lib/admin-guarda";
import { auditar } from "@/lib/auditoria";
import type { EventoGuru } from "@/lib/guru";
import { provisionAccess } from "@/lib/guru-acesso";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Adicionar aluno pelo admin (09/out/2026): o mesmo caminho de uma compra aprovada.
 *
 * Passa pelo MESMO `provisionAccess` do webhook do Guru: cria a conta (ou acha a que já existe),
 * abre a matrícula de 1 ano e manda o e-mail "Compra confirmada" com o link de criar senha. O link
 * leva ao "Confirme para criar sua senha" e dali à tela de senha, com o aceite dos documentos (como
 * não houve checkout, o aceite é colhido ali). Nada de caminho paralelo: se o fluxo da compra
 * mudar, este muda junto.
 *
 * A matrícula leva `guru_order_id` = `manual-<uuid>`: a coluna é a chave de idempotência e precisa
 * ser única, e o prefixo deixa claro no banco e no suporte que não houve venda no Guru.
 */

const DESTINO = "/admin/alunos";
const MOLDE_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function voltar(req: NextRequest, params: Record<string, string>) {
  const url = new URL(DESTINO, req.url);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  return redirecionar303(url);
}

export async function POST(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });
  if (!origemValida(req)) return new NextResponse(null, { status: 403 });

  const form = await req.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const nome = String(form.get("nome") ?? "").trim().slice(0, 120) || null;
  if (!MOLDE_EMAIL.test(email) || email.length > 254) {
    return voltar(req, { novo: "erro", erro: "Informe um e-mail válido." });
  }

  const db = createAdminClient();

  // Já tem matrícula ativa? Então não há o que criar: o caminho é o "Gerar link de acesso" na
  // página do aluno, que não abre uma segunda matrícula.
  const { data: existente } = await db.rpc("usuario_por_email", { p_email: email });
  if (typeof existente === "string" && existente) {
    const { data: ativa } = await db
      .from("enrollments")
      .select("id")
      .eq("user_id", existente)
      .eq("status", "active")
      .limit(1);
    if (ativa && ativa.length > 0) {
      return voltar(req, {
        q: email,
        novo: "erro",
        erro: "Esse e-mail já tem acesso ativo. Para reenviar o acesso, abra o aluno e use Gerar link de acesso.",
      });
    }
  }

  const evento: EventoGuru = {
    acao: "aprovado",
    motivo: null,
    webhookType: null,
    status: "manual",
    transacaoId: `manual-${randomUUID()}`,
    email,
    nome,
    telefone: null,
    contatoId: null,
    produtos: [],
  };

  let userId: string;
  try {
    userId = await provisionAccess(db, evento);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[aluno-novo] falhou:", msg);
    return voltar(req, { novo: "erro", erro: "Não deu para criar o aluno. Tente de novo." });
  }

  await auditar(db, {
    autor,
    acao: "aluno.criar",
    alvo: userId,
    detalhe: { email, nome, matricula: evento.transacaoId },
  });

  return voltar(req, { q: email, novo: "ok" });
}

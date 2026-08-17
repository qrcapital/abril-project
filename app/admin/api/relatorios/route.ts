import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { auditar } from "@/lib/auditoria";
import { descrever, rotularAcao } from "@/lib/auditoria-texto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Relatórios em CSV (pedido do Pedro em 17/ago/2026). Três, todos em cima de RPCs que já
 * existiam para as telas: `listar_alunos` (0006), `listar_emails` (0008) e `listar_auditoria`
 * (0015). Nenhuma consulta nova no banco: relatório é a tela sem paginação.
 *
 * ┌─ LEIA ISTO ANTES DE MEXER ─────────────────────────────────────────────────────────────┐
 * │ A CHECAGEM DE PAPEL AQUI DENTRO É O ÚNICO GUARDA DESTA ROTA (route handler não passa    │
 * │ por layout), e ela devolve DADO DE ALUNO EM MASSA: e-mail, telefone, progresso, nota.   │
 * │ Por isso toda exportação entra na auditoria, com o tipo e o tamanho.                    │
 * └──────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Formato: separador `;` e BOM UTF-8, que é o que o Excel em português abre certo com dois
 * cliques; vírgula sem BOM vira uma coluna só com acento quebrado.
 *
 * ponytail: teto de 1000 linhas, que é o limite das três RPCs. Quando a base passar disso,
 * os relatórios precisam de paginação nas RPCs, não aqui.
 */

const escapar = (v: unknown): string => {
  const s = String(v ?? "");
  return /[";\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};

const csv = (cabecalho: string[], linhas: unknown[][]): string =>
  "\ufeff" + [cabecalho, ...linhas].map((l) => l.map(escapar).join(";")).join("\r\n");

const dataBR = (iso: unknown): string =>
  iso ? new Date(String(iso)).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "";

export async function GET(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });

  const tipo = req.nextUrl.searchParams.get("tipo") ?? "";
  const db = createAdminClient();

  let conteudo: string | null = null;
  let linhas = 0;

  if (tipo === "alunos") {
    const { data, error } = await db.rpc("listar_alunos", { termo: "", limite: 1000 });
    if (error) return new NextResponse("O relatório falhou. Tente de novo.", { status: 500 });
    const rows = data ?? [];
    linhas = rows.length;
    conteudo = csv(
      [
        "nome",
        "email",
        "estado",
        "acesso expira",
        "inicio do calendario",
        "liberacao total",
        "aulas concluidas",
        "prova",
        "nota",
        "tentativas",
        "conta criada",
      ],
      rows.map((a: Record<string, unknown>) => [
        a.nome,
        a.email,
        a.status,
        dataBR(a.expires_at),
        dataBR(a.inicio_em),
        a.liberacao_total ? "sim" : "não",
        a.concluidas,
        a.prova_status ?? "não iniciada",
        a.prova_score ?? "",
        a.prova_tentativas ?? 0,
        dataBR(a.criado_em),
      ]),
    );
  }

  if (tipo === "emails") {
    const { data, error } = await db.rpc("listar_emails", { termo: "", limite: 1000 });
    if (error) return new NextResponse("O relatório falhou. Tente de novo.", { status: 500 });
    const rows = data ?? [];
    linhas = rows.length;
    conteudo = csv(
      ["quando", "para", "nome", "template", "status"],
      rows.map((e: Record<string, unknown>) => [
        dataBR(e.sent_at),
        e.email,
        e.nome,
        e.template,
        e.status,
      ]),
    );
  }

  if (tipo === "auditoria") {
    const { data, error } = await db.rpc("listar_auditoria", { termo: "", limite: 1000 });
    if (error) return new NextResponse("O relatório falhou. Tente de novo.", { status: 500 });
    const rows = data ?? [];
    linhas = rows.length;
    conteudo = csv(
      ["quando", "quem", "acao", "sobre quem", "detalhe"],
      rows.map((a: Record<string, unknown>) => [
        dataBR(a.created_at),
        a.autor_email,
        rotularAcao(String(a.acao)),
        a.alvo_nome ?? a.alvo_email ?? "",
        descrever(String(a.acao), (a.detalhe as Record<string, unknown>) ?? null).join(" · "),
      ]),
    );
  }

  if (conteudo === null) return new NextResponse(null, { status: 404 });

  await auditar(db, {
    autor,
    acao: "relatorio.exportar",
    detalhe: { tipo, linhas },
  });

  const hoje = new Date().toISOString().slice(0, 10);
  return new NextResponse(conteudo, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${tipo}-${hoje}.csv"`,
    },
  });
}

import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { normalizarGuru } from "@/lib/guru";
import { buscarVendaNoGuru } from "@/lib/guru-api";

/**
 * Diagnóstico da consulta à API do Guru (09/out/2026), só para admin, só leitura. Não cria conta
 * nem matrícula: diz se a API achou a venda pelo id e o que ela respondeu. Serve para conferir o
 * `GURU_USER_TOKEN` sem precisar de uma compra nova.
 *
 *   GET /admin/api/guru-venda?v=<id da venda no marketplace ou id do Guru>
 */
export async function GET(req: NextRequest) {
  const eu = await papelAtual();
  if (eu.papel !== "admin") return NextResponse.json({ erro: "não encontrado" }, { status: 404 });

  const v = req.nextUrl.searchParams.get("v")?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(v)) return NextResponse.json({ erro: "v inválido" }, { status: 400 });

  const { transacao, tentativas } = await buscarVendaNoGuru(v);
  const e = transacao ? normalizarGuru(transacao) : null;
  return NextResponse.json(
    {
      achou: Boolean(transacao),
      tentativas,
      acao: e?.acao ?? null,
      status: e?.status ?? null,
      transacao: e?.transacaoId ?? null,
      produtos: e?.produtos ?? [],
      email: e?.email ? e.email.replace(/^(.).*(@.*)$/, "$1***$2") : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

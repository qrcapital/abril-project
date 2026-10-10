import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";

/**
 * Relatório de vendas da conta inteira do Guru por período (10/out/2026), só para admin, só leitura.
 *
 * Serve ao resumo operacional mensal da BlockTrends: soma vendas de TODOS os produtos da conta
 * (CCA, Carteiras, BT App, Estratégia Internacional), não só as deste curso. Pagina a API do Guru
 * com o `GURU_USER_TOKEN` e devolve só agregados: contagem e valores por produto e por status.
 *
 *   GET /admin/api/guru-relatorio?ini=2026-09-01&fim=2026-09-30
 */

const BASE = "https://digitalmanager.guru/api/v2";
const DATA = /^\d{4}-\d{2}-\d{2}$/;

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const num = (v: unknown): number => {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export async function GET(req: NextRequest) {
  const eu = await papelAtual();
  if (eu.papel !== "admin") return NextResponse.json({ erro: "não encontrado" }, { status: 404 });

  const ini = req.nextUrl.searchParams.get("ini") ?? "";
  const fim = req.nextUrl.searchParams.get("fim") ?? "";
  if (!DATA.test(ini) || !DATA.test(fim)) return NextResponse.json({ erro: "use ini e fim no formato AAAA-MM-DD" }, { status: 400 });

  const token = process.env.GURU_USER_TOKEN?.trim();
  if (!token) return NextResponse.json({ erro: "sem GURU_USER_TOKEN" }, { status: 503 });

  const grupos: Record<string, { produto: string; status: string; n: number; total: number; liquido: number }> = {};
  let cursor = "";
  let paginas = 0;
  let itens = 0;
  let amostra: Obj | null = null;

  while (paginas < 60) {
    const url = `${BASE}/transactions?ordered_at_ini=${ini}&ordered_at_end=${fim}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, cache: "no-store" });
    if (!r.ok) return NextResponse.json({ erro: `Guru respondeu ${r.status}`, paginas }, { status: 502 });
    const corpo = obj(await r.json().catch(() => null));
    const lista = Array.isArray(corpo.data) ? corpo.data.map(obj) : [];
    paginas += 1;
    for (const t of lista) {
      itens += 1;
      if (!amostra) amostra = { chaves: Object.keys(t), payment: Object.keys(obj(t.payment)), dates: obj(t.dates) };
      const produto = String(obj(t.product).name ?? "?");
      const status = String(t.status ?? "?");
      const p = obj(t.payment);
      const k = `${produto}|${status}`;
      grupos[k] ??= { produto, status, n: 0, total: 0, liquido: 0 };
      grupos[k].n += 1;
      grupos[k].total += num(p.total);
      grupos[k].liquido += num(p.net);
    }
    const proximo = String(corpo.next_cursor ?? "");
    if (!corpo.has_more_pages || !proximo) break;
    cursor = proximo;
  }

  const linhas = Object.values(grupos)
    .map((g) => ({ ...g, total: Math.round(g.total * 100) / 100, liquido: Math.round(g.liquido * 100) / 100 }))
    .sort((a, b) => b.total - a.total);
  return NextResponse.json({ ini, fim, paginas, itens, linhas, amostra }, { headers: { "Cache-Control": "no-store" } });
}

import { redirect } from "next/navigation";

/**
 * Endereço curto do PRD (`/obrigado`), para o redirect do checkout. A página mora em `/app/obrigado`.
 * Leva só o `v` (id da venda no marketplace, posto pelo Guru), que é o que a página usa para abrir
 * o acesso direto. Nenhum outro parâmetro passa adiante.
 */
export default async function Obrigado({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const v = typeof sp.v === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(sp.v) ? sp.v : "";
  redirect(v ? `/app/obrigado?v=${encodeURIComponent(v)}` : "/app/obrigado");
}

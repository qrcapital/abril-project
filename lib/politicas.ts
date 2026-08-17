import "server-only";
import { cache } from "react";

import { REGRA_PADRAO, type Regra } from "./liberacao";
import { createAdminClient } from "./supabase/admin";

// Carrega a política de liberação ativa (migration 0016). Mesmo desenho do `lib/curriculo.ts`,
// pelo mesmo motivo: lê com a service role porque a liberação também é calculada para quem está
// bloqueado, e nada aqui é segredo. `cache()` = uma consulta por requisição, mesmo com layout e
// tela pedindo os dois.

/** Linha crua de `release_rules`, exportada para a tela de políticas montar o formulário. */
export type LinhaRegra = {
  module_id: string;
  tipo: string;
  dias: number | null;
  abre_em: string | null;
};

export function paraRegra(l: Pick<LinhaRegra, "tipo" | "dias" | "abre_em">): Regra {
  if (l.tipo === "livre") return { tipo: "livre" };
  if (l.tipo === "dias" && l.dias !== null) return { tipo: "dias", dias: l.dias };
  if (l.tipo === "data" && l.abre_em) return { tipo: "data", data: new Date(l.abre_em) };
  // `em_breve` e qualquer linha malformada caem no mesmo lugar seguro: fechado.
  return REGRA_PADRAO;
}

/**
 * As regras da política ativa, na ordem dos módulos (`regras[i]` = módulo de `ord` i).
 * Sem política ativa ou módulo sem regra: `REGRA_PADRAO` (em breve) — o erro seguro é não
 * vazar conteúdo, nunca abrir por acidente.
 */
export const getRegrasAtivas = cache(async (): Promise<Regra[]> => {
  const db = createAdminClient();
  const [{ data: mods, error: erroMods }, { data: linhas, error: erroRegras }] =
    await Promise.all([
      db.from("modules").select("id,ord").order("ord"),
      db
        .from("release_rules")
        .select("module_id,tipo,dias,abre_em,release_policies!inner(ativa)")
        .eq("release_policies.ativa", true),
    ]);
  if (erroMods) throw erroMods;
  if (erroRegras) throw erroRegras;

  const porModulo = new Map((linhas ?? []).map((l) => [l.module_id as string, paraRegra(l)]));
  return (mods ?? []).map((m) => porModulo.get(m.id as string) ?? REGRA_PADRAO);
});

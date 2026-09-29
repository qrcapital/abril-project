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
  /** Dias após a matrícula (`dias`) ou após concluir o pré-requisito (`apos_modulo`). */
  dias: number | null;
  abre_em: string | null;
  /** Ord do módulo pré-requisito, só em `apos_modulo` (migration 0024). */
  depende_de_ord: number | null;
};

/** As colunas que `paraRegra` lê. Exportado para as telas pedirem sempre as mesmas. */
export const COLUNAS_REGRA = "module_id,tipo,dias,abre_em,depende_de_ord";

export function paraRegra(
  l: Pick<LinhaRegra, "tipo" | "dias" | "abre_em"> & { depende_de_ord?: number | null },
): Regra {
  if (l.tipo === "livre") return { tipo: "livre" };
  if (l.tipo === "dias" && l.dias !== null) return { tipo: "dias", dias: l.dias };
  if (l.tipo === "data" && l.abre_em) return { tipo: "data", data: new Date(l.abre_em) };
  if (l.tipo === "apos_modulo" && l.depende_de_ord !== null && l.depende_de_ord !== undefined)
    return { tipo: "apos_modulo", modulo: l.depende_de_ord, dias: l.dias ?? 0 };
  // `em_breve` e qualquer linha malformada caem no mesmo lugar seguro: fechado.
  return REGRA_PADRAO;
}

/**
 * As regras de uma política, na ordem dos módulos (`regras[i]` = módulo de `ord` i; o
 * `check:curriculo` garante ords sem buraco, então posição e ord coincidem).
 *
 * `politicaId` nulo lê a política ATIVA, que é o padrão de todos os alunos; um id lê a política
 * daquele aluno (0017), esteja ela ativa ou não. Sem política ou módulo sem regra:
 * `REGRA_PADRAO` (em breve), porque o erro seguro é não vazar conteúdo, nunca abrir por
 * acidente. Id apontando para política apagada não acontece: a FK é `on delete set null`.
 */
/**
 * As colunas de antes da 0024. Só existem para o intervalo entre o deploy e a aplicação da
 * migration: sem este recuo, o código novo publicado antes do SQL derrubaria a área do aluno
 * inteira com "column depende_de_ord does not exist". Aplicada a 0024, o recuo nunca mais roda.
 */
const COLUNAS_REGRA_ANTIGAS = "module_id,tipo,dias,abre_em";

export const getRegras = cache(async (politicaId: string | null = null): Promise<Regra[]> => {
  const db = createAdminClient();
  const consultar = (colunas: string) =>
    politicaId
      ? db.from("release_rules").select(colunas).eq("policy_id", politicaId)
      : db
          .from("release_rules")
          .select(`${colunas},release_policies!inner(ativa)`)
          .eq("release_policies.ativa", true);
  const [{ data: mods, error: erroMods }, primeira] = await Promise.all([
    db.from("modules").select("id,ord").order("ord"),
    consultar(COLUNAS_REGRA),
  ]);
  if (erroMods) throw erroMods;
  let { data: linhas, error: erroRegras } = primeira;
  // 42703 = coluna inexistente: a 0024 ainda não foi aplicada neste banco.
  if (erroRegras?.code === "42703") {
    console.warn("[politicas] migration 0024 pendente, lendo regras sem depende_de_ord");
    ({ data: linhas, error: erroRegras } = await consultar(COLUNAS_REGRA_ANTIGAS));
  }
  if (erroRegras) throw erroRegras;

  const porModulo = new Map(
    ((linhas ?? []) as unknown as LinhaRegra[]).map((l) => [l.module_id, paraRegra(l)]),
  );
  return (mods ?? []).map((m) => porModulo.get(m.id as string) ?? REGRA_PADRAO);
});

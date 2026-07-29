import { cache } from "react";

import { createClient } from "./supabase/server";
import { getUsuario } from "./usuario";

/**
 * Estado de acesso do aluno, derivado da matrícula.
 *
 * `ausente` é diferente de `expirada` de propósito: pelo `PRD.md` §4 a conta nasce da compra,
 * então quem está logado sem matrícula nenhuma é um caso anômalo (conta criada à mão, ou
 * webhook que falhou no meio), e não alguém cujo prazo acabou. Tratar os dois como a mesma
 * coisa esconderia um defeito de provisionamento atrás de uma tela de renovação.
 */
export type EstadoAcesso = "ativa" | "expirada" | "revogada" | "ausente";

export type Matricula = {
  estado: EstadoAcesso;
  expiraEm: string | null;
  /** Âncora do calendário de liberação. Nasce igual à compra; vira a data da turma um dia. */
  inicioEm: Date | null;
  /** Chave do admin: abre o curso inteiro para este aluno. */
  liberacaoTotal: boolean;
};

/** Sem matrícula não há calendário: tudo fechado, e o estado explica o porquê. */
const VAZIA: Matricula = {
  estado: "ausente",
  expiraEm: null,
  inicioEm: null,
  liberacaoTotal: false,
};

/**
 * A matrícula do aluno logado, uma vez por requisição.
 *
 * Mesma disciplina do `getUsuario`: `cache()` do React, porque o layout consulta para decidir
 * o bloqueio e a tela de acesso consulta de novo para escrever a data. Sem ele seriam duas
 * idas ao banco por requisição.
 *
 * A leitura usa o cliente com a sessão do aluno, e não a service role: a policy
 * `enrollments_self_select` já restringe à própria linha, então a RLS é a garantia, não um
 * `where` que alguém pode esquecer.
 */
export const getMatricula = cache(async (): Promise<Matricula> => {
  const user = await getUsuario();
  if (!user) return VAZIA;

  const supabase = await createClient();
  // A mais recente manda: renovação futura cria linha nova em vez de editar a antiga.
  const { data, error } = await supabase
    .from("enrollments")
    .select("status,expires_at,inicio_em,liberacao_total")
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Falha de leitura não é falta de acesso. Bloquear aqui trancaria o aluno para fora por
    // causa de um soluço do banco, então o erro sobe e vira a tela de erro da área.
    console.error("[matricula] falha ao ler enrollments:", error.message);
    throw error;
  }
  if (!data) return VAZIA;

  const expirou = new Date(data.expires_at).getTime() <= Date.now();
  const estado: EstadoAcesso =
    data.status === "revoked"
      ? "revogada"
      : data.status === "expired" || expirou
        ? "expirada"
        : "ativa";

  return {
    estado,
    expiraEm: data.expires_at,
    inicioEm: data.inicio_em ? new Date(data.inicio_em) : null,
    liberacaoTotal: Boolean(data.liberacao_total),
  };
});

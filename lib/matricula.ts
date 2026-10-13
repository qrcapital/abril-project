import { cache } from "react";

import { papelAtual } from "./admin";
import { createClient } from "./supabase/server";
import { getUsuario } from "./usuario";

// O estado e a sua derivação moram em `matricula-estado.ts`, que é puro e por isso roda no
// self-check. Importados (para uso aqui) e reexportados (para os consumidores existentes não
// precisarem saber da divisão): `export ... from` sozinho não traz o nome para este escopo.
import { estadoDaMatricula, type EstadoAcesso } from "./matricula-estado";

export { estadoDaMatricula, type EstadoAcesso };

export type Matricula = {
  estado: EstadoAcesso;
  expiraEm: string | null;
  /** Âncora do calendário de liberação. Nasce igual à compra; vira a data da turma um dia. */
  inicioEm: Date | null;
  /** Chave do admin: abre o curso inteiro para este aluno. */
  liberacaoTotal: boolean;
  /** Política de liberação específica deste aluno (0017). `null` = a ativa, padrão de todos. */
  politicaId: string | null;
  /**
   * O acesso vem do PAPEL de observador (0029), e não de uma compra. Quem precisa distinguir os
   * dois casos lê daqui: os Termos do aluno (o observador não é parte do contrato de compra) e o
   * certificado (não é aluno, então não conclui formação).
   */
  observador: boolean;
};

/** Sem matrícula não há calendário: tudo fechado, e o estado explica o porquê. */
const VAZIA: Matricula = {
  estado: "ausente",
  expiraEm: null,
  inicioEm: null,
  liberacaoTotal: false,
  politicaId: null,
  observador: false,
};

/**
 * O acesso do observador à sala, montado no código em vez de gravado no banco.
 *
 * POR QUE NÃO UMA LINHA EM `enrollments`: o `painel_indicadores()` conta matrícula como aluno
 * ("matriculados", "acesso ativo", e o progresso só entra quando o dono está matriculado). Uma
 * matrícula de cortesia para cada observador inflaria exatamente os números que ele veio
 * conferir, e o e-mail de liberação de módulo (que parte de `enrollments`) iria para um endereço
 * sintético que volta.
 *
 * `liberacaoTotal` porque o observador revisa o produto, não segue a esteira semanal: tudo abre,
 * menos o módulo "em breve", que é conteúdo que ainda não existe (a mesma exceção da chave do
 * admin, ver `calendarioDoAluno`). A âncora é a criação da conta só para o calendário ter uma
 * data; com a liberação total ela não segura nada. Sem `expiraEm`: o acesso dura o papel.
 */
function acessoDeObservador(criadoEm: string | undefined): Matricula {
  return {
    estado: "ativa",
    expiraEm: null,
    inicioEm: criadoEm ? new Date(criadoEm) : new Date(),
    liberacaoTotal: true,
    politicaId: null,
    observador: true,
  };
}

/**
 * A matrícula do aluno logado, uma vez por requisição.
 *
 * Mesma disciplina do `getUsuario`: `cache()` do React, porque o layout consulta para decidir
 * o bloqueio e a tela de acesso consulta de novo para escrever a data. Sem ele seriam duas
 * idas ao banco por requisição.
 *
 * A leitura usa o cliente com a sessão do aluno, e não a service role.
 *
 * ┌─ O `.eq("user_id")` ABAIXO NÃO É REDUNDANTE ────────────────────────────────────────────┐
 * │ Este comentário dizia, até 31/jul/2026, que a policy `enrollments_self_select` já        │
 * │ restringia à própria linha e que a RLS era a garantia. **Ela não restringe.** A policy   │
 * │ é `(user_id = auth.uid()) OR is_admin()`, e todo admin também é aluno: para ele o        │
 * │ SELECT devolvia as matrículas de TODO MUNDO, e o `order by expires_at desc limit 1`      │
 * │ escolhia a de outra pessoa.                                                             │
 * │                                                                                         │
 * │ O efeito, medido na conta do Pedro: a área do aluno mostrava o calendário, o prazo e a   │
 * │ `liberacao_total` de `prova.motor@example.com`, que era quem tinha o `expires_at` mais   │
 * │ distante. E como o `estado` desta função é o que a guarda do `(sala)` usa, um admin      │
 * │ poderia ser barrado por causa da matrícula revogada de outro, ou entrar com a dele       │
 * │ vencida.                                                                                │
 * │                                                                                         │
 * │ É o padrão que o `HANDOFF.md` §6 já registra em outra roupa: **a policy é mais larga do  │
 * │ que o `where` que você não escreveu.** Filtro explícito no query, RLS como segunda       │
 * │ camada, nunca como a única.                                                             │
 * └─────────────────────────────────────────────────────────────────────────────────────────┘
 */
export const getMatricula = cache(async (): Promise<Matricula> => {
  const user = await getUsuario();
  if (!user) return VAZIA;

  const supabase = await createClient();
  // O papel vai junto, em paralelo, para não somar uma ida ao banco na frente de toda tela da sala.
  // `papelAtual` tem `cache()`, e o chrome da sala pergunta o mesmo para montar o link do painel.
  const [{ papel }, { data, error }] = await Promise.all([
    papelAtual(),
    // A mais recente manda: renovação futura cria linha nova em vez de editar a antiga.
    supabase
      .from("enrollments")
      .select("status,expires_at,inicio_em,liberacao_total,release_policy_id")
      .eq("user_id", user.id)
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  // ESTE É O PONTO ÚNICO em que o observador ganha a sala: o layout do `(sala)`, o calendário de
  // liberação e a action que marca aula leem o acesso daqui. O papel manda sobre qualquer linha de
  // matrícula, para o observador nunca depender de dado de compra (que ele não tem).
  if (papel === "observador") return acessoDeObservador(user.created_at);

  if (error) {
    // Falha de leitura não é falta de acesso. Bloquear aqui trancaria o aluno para fora por
    // causa de um soluço do banco, então o erro sobe e vira a tela de erro da área.
    console.error("[matricula] falha ao ler enrollments:", error.message);
    throw error;
  }
  if (!data) return VAZIA;

  return {
    estado: estadoDaMatricula(data.status, data.expires_at),
    expiraEm: data.expires_at,
    inicioEm: data.inicio_em ? new Date(data.inicio_em) : null,
    liberacaoTotal: Boolean(data.liberacao_total),
    politicaId: (data.release_policy_id as string | null) ?? null,
    observador: false,
  };
});

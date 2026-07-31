/**
 * Estado de acesso derivado da matrícula. Lógica PURA, sem IO.
 *
 * Separado de `lib/matricula.ts` pela mesma razão que separou `prova-correcao` de `prova` e
 * `usuario-template` de `usuario`: aquele módulo importa o cliente Supabase, que puxa
 * `next/headers` e **não roda fora do Next**, então o self-check não consegue exercitá-lo em node
 * puro. Aqui roda.
 *
 * A regra ganhou um SEGUNDO leitor em 30/jul/2026: além da guarda do aluno, o painel do admin
 * mostra o mesmo estado para outra pessoa. Se cada lado derivasse por conta própria, a tela diria
 * "ativa" para quem o app tranca na porta, e isso não aparece em build nem em lint. Uma regra,
 * dois leitores.
 */

/**
 * `ausente` é diferente de `expirada` de propósito: pelo `PRD.md` §4 a conta nasce da compra,
 * então quem está logado sem matrícula nenhuma é caso anômalo (conta criada à mão, ou webhook que
 * falhou no meio), e não alguém cujo prazo acabou. Tratar os dois igual esconderia um defeito de
 * provisionamento atrás de uma tela de renovação.
 */
export type EstadoAcesso = "ativa" | "expirada" | "revogada" | "ausente";

/**
 * `agora` entra por parâmetro para o check poder fixar o instante, em vez de depender do relógio
 * da máquina que roda o teste.
 */
export function estadoDaMatricula(
  status: string | null | undefined,
  expiresAt: string | null | undefined,
  agora: Date = new Date(),
): EstadoAcesso {
  if (!status || !expiresAt) return "ausente";
  if (status === "revoked") return "revogada";
  // A data manda mesmo quando a coluna ainda diz `active`: nada reescreve `status` na virada do
  // prazo, então quem confiasse só na coluna daria acesso a matrícula vencida.
  const expirou = new Date(expiresAt).getTime() <= agora.getTime();
  return status === "expired" || expirou ? "expirada" : "ativa";
}

/** Rótulo para a tela do admin. O aluno não vê estado cru, vê a tela de acesso. */
export const ROTULO_ESTADO: Record<EstadoAcesso, string> = {
  ativa: "ativo",
  expirada: "expirado",
  revogada: "revogado",
  ausente: "sem matrícula",
};

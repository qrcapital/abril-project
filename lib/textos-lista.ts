/**
 * As duas frases das caixas de aceite da pré-lista, e o endereço da Política.
 *
 * Mora fora de `lib/consentimento.ts` porque aquele arquivo é `server-only` e o formulário é
 * componente de cliente. Uma fonte só para a tela e para o log: o que se grava em `consents.texto`
 * tem de ser exatamente o que estava ao lado da caixa.
 *
 * ┌─ POR QUE SÃO DUAS CAIXAS (13/out/2026) ───────────────────────────────────────────────────────┐
 * │ Pedido do jurídico da Abril. Havia uma caixa só, juntando ciência da Política e autorização   │
 * │ de contato. A Política promete, no item 3.2, consentimento específico por finalidade, então   │
 * │ as duas finalidades viraram dois gestos:                                                       │
 * │                                                                                                │
 * │ 1. OBRIGATÓRIA: ciência de que os dados servem à inscrição na live e no curso.                 │
 * │ 2. OPCIONAL: aceite de comunicações futuras (novos cursos, conteúdos, oportunidades). A        │
 * │    ressalva dos 18 anos conversa com o item 2.8 da Política, que declara não coletar dados    │
 * │    de crianças e adolescentes.                                                                 │
 * │                                                                                                │
 * │ Os textos são os do jurídico, palavra por palavra. Não "melhorar" sem passar por eles.        │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 */

/**
 * Até 13/out a caixa saía SEM link quando a variável de ambiente não estava configurada, e ela
 * não estava: o jurídico clicou em "Política de Privacidade" e não foi a lugar nenhum. A página
 * existe no próprio site desde 12/out, então o padrão agora é ela.
 */
export const URL_POLITICA_LISTA = process.env.NEXT_PUBLIC_POLITICA_PRIVACIDADE_URL || "/privacidade";

/** Caixa 1, obrigatória. Na tela, o trecho final ("Política de Privacidade disponível neste link") é o link. */
export const TEXTO_LISTA_DADOS =
  "Li e estou ciente de que a Abril e a BlockTrends utilizarão meus dados para viabilizar minha inscrição nesta live e no curso Estratégia Internacional, de acordo com a Política de Privacidade disponível neste link.";

/** O pedaço da frase 1 que vira link. Tem de ser o final exato de `TEXTO_LISTA_DADOS`, sem o ponto. */
export const TRECHO_LINK_POLITICA = "Política de Privacidade disponível neste link";

/** Caixa 2, opcional. */
export const TEXTO_LISTA_COMUNICACOES =
  "Se eu tiver 18 anos ou mais, aceito receber comunicações futuras da Abril e da BlockTrends sobre novos cursos, conteúdos e oportunidades relacionados a investimentos e finanças.";

/**
 * O que vai congelado em `consents.texto` para um envio da pré-lista.
 *
 * Uma linha só, com as duas caixas e o estado da opcional, em vez de um tipo de documento novo:
 * o aceite de comunicações não é um documento com versão, e a coluna `documento_tipo` só conhece
 * 'politica' e 'termos'. Gravar também o "não marcado" é de propósito: no dia em que um titular
 * disser que nunca autorizou e-mail de outros cursos, a linha responde.
 */
export function textoLogLista(comunicacoes: boolean): string {
  return (
    `[Obrigatória, marcada] ${TEXTO_LISTA_DADOS}\n` +
    `[Opcional, ${comunicacoes ? "marcada" : "não marcada"}] ${TEXTO_LISTA_COMUNICACOES}`
  );
}

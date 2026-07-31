// Os números do banco de questões. **Sem IO**, para o check e as duas telas lerem daqui.
//
// Eles já existiam espalhados em três lugares que não conversavam: o `CHECK` de
// `jsonb_array_length(alternativas) = 4` na migration, o `q.rn <= 5` do `sortear_prova`, e a meta de
// ~100 escrita em prosa no PRD §7. Ter os três como constante é o que deixa a tela de questões dizer
// "faltam 19 no Módulo II" em vez de mostrar uma contagem sem régua.

import { LETRAS, TOTAL_QUESTOES } from "./prova-correcao.ts";

export { LETRAS };

/** Quantas alternativas cada questão tem. É o `CHECK` da tabela `questions`. */
export const ALTERNATIVAS = LETRAS.length;

/** Os `ord` dos módulos que entram na prova. É o `m.ord between 1 and 4` do `sortear_prova`: o
 *  Módulo 0 é boas-vindas e não tem questão. */
export const ORDS_AVALIADOS = [1, 2, 3, 4];

/**
 * Quantas questões o sorteio tira de CADA módulo, que é o `q.rn <= 5` do `sortear_prova`.
 *
 * Derivado em vez de escrito: a prova é balanceada, então mexer no total sem mexer aqui daria uma
 * prova desbalanceada em silêncio.
 */
export const POR_MODULO = TOTAL_QUESTOES / ORDS_AVALIADOS.length;

/**
 * A meta por módulo (PRD §7: banco de ~100, 25 por módulo).
 *
 * O piso e a meta existem por motivos diferentes, e a tela mostra os dois: com menos de
 * `POR_MODULO` ativas o sorteio não completa a prova e ela **para de abrir**; com menos que a meta
 * ela abre, mas dois alunos veem quase as mesmas questões. Com 6 por módulo, que é o do seed, dois
 * sorteios repetem 19 das 20.
 */
export const META_POR_MODULO = 25;

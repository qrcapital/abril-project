// Self-check do calendário de liberação. Sem framework: assert do node.
//   npm run check:liberacao
//
// A regra aqui tem uma função comercial, não só de produto: a esteira existe para o aluno não
// conseguir concluir o curso e emitir o certificado dentro da janela de arrependimento. Um
// furo aqui não aparece como bug de tela, aparece como pedido de reembolso com o certificado
// já emitido.

import assert from "node:assert/strict";

import {
  aberturaDoModulo,
  DIAS_POR_MODULO,
  diasAte,
  fimDoCalendario,
  liberacao,
  semanaDoModulo,
} from "../lib/liberacao.ts";

// O currículo vive no banco desde 29/jul, e este check é puro (roda sem rede). A contagem de
// módulos entra como constante; quem guarda que o banco tem esses cinco é o `check:curriculo`.
const TOTAL_MODULOS = 5;

const INICIO = new Date("2026-03-02T12:00:00Z"); // uma segunda-feira
const maisDias = (d: number) => new Date(INICIO.getTime() + d * 86_400_000);

// --- cadência ---
assert.equal(DIAS_POR_MODULO, 7);
assert.equal(TOTAL_MODULOS, 5, "0 mais quatro modulos");
// Módulo 0 e I no ato da compra; depois um por semana.
assert.deepEqual([0, 1, 2, 3, 4].map(semanaDoModulo), [0, 0, 1, 2, 3]);

// --- o que abre em cada dia ---
const abertosEm = (d: number) => [...liberacao(INICIO, false, TOTAL_MODULOS, maisDias(d)).abertos].sort();
assert.deepEqual(abertosEm(0), [0, 1], "no dia da compra, boas-vindas e Modulo I");
assert.deepEqual(abertosEm(6), [0, 1], "vespera da semana 1 nao adianta nada");
assert.deepEqual(abertosEm(7), [0, 1, 2], "Modulo II na semana 1");
assert.deepEqual(abertosEm(14), [0, 1, 2, 3]);
assert.deepEqual(abertosEm(21), [0, 1, 2, 3, 4], "curso inteiro em 21 dias");
assert.deepEqual(abertosEm(90), [0, 1, 2, 3, 4], "depois do fim, segue tudo aberto");

// --- completo é o que a prova exige ---
assert.equal(liberacao(INICIO, false, TOTAL_MODULOS, maisDias(20)).completo, false);
assert.equal(liberacao(INICIO, false, TOTAL_MODULOS, maisDias(21)).completo, true);

// --- a chave do admin abre tudo, em qualquer dia ---
assert.deepEqual([...liberacao(INICIO, true, TOTAL_MODULOS, maisDias(0)).abertos].sort(), [0, 1, 2, 3, 4]);
assert.equal(liberacao(INICIO, true, TOTAL_MODULOS, maisDias(0)).completo, true);

// --- A PROTEÇÃO: o curso não fica concluível dentro da janela de arrependimento ---
// O CDC dá 7 dias de arrependimento em compra pela internet. Se o último módulo abrisse antes
// disso, a esteira não cumpriria o que foi pedida para fazer.
const JANELA_ARREPENDIMENTO = 7;
const diasAteOFim = Math.round(
  (fimDoCalendario(INICIO, TOTAL_MODULOS).getTime() - INICIO.getTime()) / 86_400_000,
);
assert.ok(
  diasAteOFim > JANELA_ARREPENDIMENTO,
  `o curso fica concluivel em ${diasAteOFim} dias, dentro da janela de ${JANELA_ARREPENDIMENTO}: ` +
    `a esteira perde a razao de existir`,
);

// --- contagem regressiva ---
assert.equal(diasAte(INICIO, 2, maisDias(0)), 7);
assert.equal(diasAte(INICIO, 2, maisDias(6)), 1);
assert.equal(diasAte(INICIO, 2, maisDias(7)), 0, "aberto nao tem contagem");
assert.equal(diasAte(INICIO, 0, maisDias(0)), 0);
// Meio dia depois ainda conta como o dia seguinte, e não como aberto: arredonda para cima.
assert.equal(diasAte(INICIO, 2, new Date(INICIO.getTime() + 6.5 * 86_400_000)), 1);

// --- a abertura do módulo 0 é o próprio início ---
assert.equal(aberturaDoModulo(INICIO, 0).getTime(), INICIO.getTime());

console.log("liberacao-check: ok");

// Self-check das políticas de liberação. Sem framework: assert do node.
//   npm run check:liberacao
//
// A regra aqui tem uma função comercial, não só de produto: a esteira clássica existe para o
// aluno não conseguir concluir o curso e emitir o certificado dentro da janela de
// arrependimento. Desde 17/ago/2026 a cadência é política configurável (migration 0016), então
// a proteção mudou de forma: o que este check garante é que (1) a política padrão "Esteira
// semanal" continua respeitando a janela e (2) o `violaGarantia` DETECTA as políticas que não
// respeitam, porque agora é ele quem avisa o admin.

import assert from "node:assert/strict";

import {
  aberturaDoModulo,
  concluivelEm,
  DIAS_GARANTIA,
  DIAS_POR_MODULO,
  diasAte,
  liberacao,
  REGRA_PADRAO,
  regraEsteira,
  violaGarantia,
  type Regra,
} from "../lib/liberacao.ts";

// O currículo vive no banco e este check é puro (roda sem rede). A contagem de módulos entra
// como constante; quem guarda que o banco tem esses cinco é o `check:curriculo`.
const TOTAL_MODULOS = 5;

const INICIO = new Date("2026-03-02T12:00:00Z"); // uma segunda-feira
const maisDias = (d: number) => new Date(INICIO.getTime() + d * 86_400_000);
const ESTEIRA: Regra[] = Array.from({ length: TOTAL_MODULOS }, (_, i) => regraEsteira(i));

// --- a esteira clássica continua a mesma (é o que a migration 0016 semeia como ativa) ---
assert.equal(DIAS_POR_MODULO, 7);
assert.deepEqual(
  ESTEIRA.map((r) => (r.tipo === "dias" ? r.dias : -1)),
  [0, 0, 7, 14, 21],
  "boas-vindas e Modulo I no ato; depois um por semana",
);

const abertosEm = (d: number, regras: Regra[] = ESTEIRA) =>
  [...liberacao(INICIO, false, regras, maisDias(d)).abertos].sort();
assert.deepEqual(abertosEm(0), [0, 1], "no dia da compra, boas-vindas e Modulo I");
assert.deepEqual(abertosEm(6), [0, 1], "vespera da semana 1 nao adianta nada");
assert.deepEqual(abertosEm(7), [0, 1, 2], "Modulo II na semana 1");
assert.deepEqual(abertosEm(14), [0, 1, 2, 3]);
assert.deepEqual(abertosEm(21), [0, 1, 2, 3, 4], "curso inteiro em 21 dias");
assert.deepEqual(abertosEm(90), [0, 1, 2, 3, 4], "depois do fim, segue tudo aberto");

// --- completo é o que a prova exige ---
assert.equal(liberacao(INICIO, false, ESTEIRA, maisDias(20)).completo, false);
assert.equal(liberacao(INICIO, false, ESTEIRA, maisDias(21)).completo, true);

// --- os quatro tipos de regra ---
const MISTA: Regra[] = [
  { tipo: "livre" },
  { tipo: "dias", dias: 3 },
  { tipo: "data", data: maisDias(10) },
  { tipo: "em_breve" },
];
assert.deepEqual(abertosEm(0, MISTA), [0], "livre abre no ato");
assert.deepEqual(abertosEm(3, MISTA), [0, 1], "dias conta do inicio da matricula");
assert.deepEqual(abertosEm(10, MISTA), [0, 1, 2], "data abre na data, para todos");
assert.deepEqual(abertosEm(9999, MISTA), [0, 1, 2], "em breve nunca abre sozinho");

// --- em breve NÃO trava a prova (Pedro, 17/ago: uso é material complementar) ---
assert.equal(liberacao(INICIO, false, MISTA, maisDias(10)).completo, true);
assert.equal(liberacao(INICIO, false, MISTA, maisDias(9)).completo, false);
// ...mas política toda em breve não é "completa": não há curso para concluir.
assert.equal(liberacao(INICIO, false, [{ tipo: "em_breve" }], maisDias(0)).completo, false);

// --- a chave do admin abre tudo, MENOS em breve (conteúdo que não existe não aparece) ---
assert.deepEqual(abertosEm(0, ESTEIRA.map(() => ({ tipo: "dias", dias: 999 }))), []);
assert.deepEqual(
  [...liberacao(INICIO, true, MISTA, maisDias(0)).abertos].sort(),
  [0, 1, 2],
  "liberacao_total ignora prazos, respeita em breve",
);

// --- módulo sem regra fica em breve, nunca aberto ---
assert.equal(REGRA_PADRAO.tipo, "em_breve");
assert.deepEqual(abertosEm(9999, [undefined as unknown as Regra, { tipo: "livre" }]), [1]);

// --- A PROTEÇÃO: a esteira padrão não deixa o curso concluível na janela de arrependimento,
// --- e o aviso da tela de políticas detecta quem deixa.
assert.equal(DIAS_GARANTIA, 7);
const fim = concluivelEm(INICIO, ESTEIRA);
assert.ok(fim && (fim.getTime() - INICIO.getTime()) / 86_400_000 > DIAS_GARANTIA);
assert.equal(violaGarantia(ESTEIRA, INICIO), false, "esteira respeita a garantia");
assert.equal(violaGarantia([{ tipo: "livre" }], INICIO), true, "tudo livre viola");
assert.equal(
  violaGarantia([{ tipo: "data", data: maisDias(-30) }], INICIO),
  true,
  "data ja passada equivale a livre para quem compra hoje",
);
assert.equal(
  violaGarantia([{ tipo: "livre" }, { tipo: "dias", dias: 14 }], INICIO),
  false,
  "quem manda e a ULTIMA abertura exigida",
);
assert.equal(violaGarantia([{ tipo: "em_breve" }], INICIO), false, "nada exigido, nada concluivel");

// --- contagem regressiva ---
assert.equal(diasAte(INICIO, regraEsteira(2), maisDias(0)), 7);
assert.equal(diasAte(INICIO, regraEsteira(2), maisDias(6)), 1);
assert.equal(diasAte(INICIO, regraEsteira(2), maisDias(7)), 0, "aberto nao tem contagem");
assert.equal(diasAte(INICIO, { tipo: "em_breve" }, maisDias(0)), null, "em breve nao tem data");
assert.equal(diasAte(INICIO, { tipo: "data", data: maisDias(10) }, maisDias(4)), 6);
// Meio dia depois ainda conta como o dia seguinte, e não como aberto: arredonda para cima.
assert.equal(
  diasAte(INICIO, regraEsteira(2), new Date(INICIO.getTime() + 6.5 * 86_400_000)),
  1,
);

// --- a abertura do módulo livre é o próprio início ---
assert.equal(aberturaDoModulo(INICIO, { tipo: "livre" })!.getTime(), INICIO.getTime());
assert.equal(aberturaDoModulo(INICIO, { tipo: "em_breve" }), null);

console.log("liberacao-check: ok");

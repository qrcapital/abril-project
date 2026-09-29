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
  calendarioDoAluno,
  conclusaoDosModulos,
  concluivelEm,
  dataCurta,
  dataLonga,
  descreverRegra,
  DIAS_GARANTIA,
  DIAS_POR_MODULO,
  diasAte,
  liberacao,
  REGRA_PADRAO,
  regraEsteira,
  TIPOS_DE_REGRA,
  violaGarantia,
  type Regra,
} from "../lib/liberacao.ts";

// O currículo vive no banco e este check é puro (roda sem rede). A contagem de módulos entra
// como constante; quem guarda que o banco tem esses cinco é o `check:curriculo`.
const TOTAL_MODULOS = 5;

const INICIO = new Date("2026-03-02T12:00:00Z"); // uma segunda-feira
const maisDias = (d: number) => new Date(INICIO.getTime() + d * 86_400_000);
const ESTEIRA: Regra[] = Array.from({ length: TOTAL_MODULOS }, (_, i) => regraEsteira(i));

// --- a esteira semanal (29/set): Módulo 0 no ato, depois um por semana DESDE a matrícula ---
// Até 29/set o I abria junto com o 0 ([0, 0, 7, 14, 21]). O Pedro pediu o I na semana 1, e a
// migration 0024 reescreveu a política ativa com esta mesma conta.
assert.equal(DIAS_POR_MODULO, 7);
assert.deepEqual(
  ESTEIRA.map((r) => (r.tipo === "dias" ? r.dias : -1)),
  [0, 7, 14, 21, 28],
  "Modulo 0 no ato; I em 7 dias, II em 14, III em 21, IV em 28",
);

const abertosEm = (d: number, regras: Regra[] = ESTEIRA) =>
  [...liberacao(INICIO, false, regras, maisDias(d)).abertos].sort();
assert.deepEqual(abertosEm(0), [0], "no dia da compra, so o Modulo 0");
assert.deepEqual(abertosEm(6), [0], "vespera da semana 1 nao adianta nada");
assert.deepEqual(abertosEm(7), [0, 1], "Modulo I na semana 1");
assert.deepEqual(abertosEm(14), [0, 1, 2]);
assert.deepEqual(abertosEm(21), [0, 1, 2, 3]);
assert.deepEqual(abertosEm(28), [0, 1, 2, 3, 4], "curso inteiro em 28 dias");
assert.deepEqual(abertosEm(90), [0, 1, 2, 3, 4], "depois do fim, segue tudo aberto");

// --- completo é o que a prova exige ---
assert.equal(liberacao(INICIO, false, ESTEIRA, maisDias(27)).completo, false);
assert.equal(liberacao(INICIO, false, ESTEIRA, maisDias(28)).completo, true);

// --- os tipos de regra que só dependem do relógio ---
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
assert.deepEqual(abertosEm(0, ESTEIRA.map(() => ({ tipo: "dias", dias: 999 }) as Regra)), []);
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
assert.equal(diasAte(INICIO, regraEsteira(1), maisDias(0)), 7);
assert.equal(diasAte(INICIO, regraEsteira(1), maisDias(6)), 1);
assert.equal(diasAte(INICIO, regraEsteira(1), maisDias(7)), 0, "aberto nao tem contagem");
assert.equal(diasAte(INICIO, { tipo: "em_breve" }, maisDias(0)), null, "em breve nao tem data");
assert.equal(diasAte(INICIO, { tipo: "data", data: maisDias(10) }, maisDias(4)), 6);
// Meio dia depois ainda conta como o dia seguinte, e não como aberto: arredonda para cima.
assert.equal(
  diasAte(INICIO, regraEsteira(1), new Date(INICIO.getTime() + 6.5 * 86_400_000)),
  1,
);

// --- a abertura do módulo livre é o próprio início ---
assert.equal(aberturaDoModulo(INICIO, { tipo: "livre" })!.getTime(), INICIO.getTime());
assert.equal(aberturaDoModulo(INICIO, { tipo: "em_breve" }), null);

// --- apos_modulo (29/set): abre quando o aluno CONCLUI o pré-requisito, mais dias opcionais ---
assert.ok((TIPOS_DE_REGRA as readonly string[]).includes("apos_modulo"));

// Currículo de brinquedo: Módulo 0 com 1 aula, I e II com 2 cada.
const AULAS = [
  { id: "a0", modulo: 0 },
  { id: "a1", modulo: 1 },
  { id: "a2", modulo: 1 },
  { id: "b1", modulo: 2 },
  { id: "b2", modulo: 2 },
];
const conclusoesCom = (feitas: Record<string, number>) =>
  conclusaoDosModulos(
    AULAS,
    new Map(Object.entries(feitas).map(([id, d]) => [id, maisDias(d)])),
  );

// Módulo concluído = TODAS as aulas, e a data é a da última.
assert.deepEqual([...conclusoesCom({ a1: 3 }).keys()], [], "metade do modulo nao conclui");
assert.equal(conclusoesCom({ a1: 3, a2: 5 }).get(1)!.getTime(), maisDias(5).getTime());
// Módulo sem aula não conclui nunca: senão "apos o modulo vazio" abriria no ato.
assert.equal(conclusaoDosModulos([], new Map()).size, 0);

const CADEIA: Regra[] = [
  { tipo: "livre" },
  { tipo: "apos_modulo", modulo: 0 },
  { tipo: "apos_modulo", modulo: 1, dias: 2 },
];
const abertosCom = (d: number, feitas: Record<string, number>, total = false) =>
  [...liberacao(INICIO, total, CADEIA, maisDias(d), conclusoesCom(feitas)).abertos].sort();

assert.deepEqual(abertosCom(0, {}), [0], "sem progresso, so o livre");
assert.deepEqual(abertosCom(1, { a0: 1 }), [0, 1], "concluiu o 0, abre o I na hora");
assert.deepEqual(abertosCom(4, { a0: 1, a1: 3 }), [0, 1], "I pela metade segura o II");
assert.deepEqual(abertosCom(4, { a0: 1, a1: 3, a2: 4 }), [0, 1], "II espera os 2 dias extras");
assert.deepEqual(abertosCom(6, { a0: 1, a1: 3, a2: 4 }), [0, 1, 2], "4 + 2 dias = dia 6");
assert.deepEqual(abertosCom(0, {}, true), [0, 1, 2], "liberacao total pula a cadeia");
// Sem conclusões passadas, quem depende de progresso fica fechado: é o erro seguro.
assert.deepEqual([...liberacao(INICIO, false, CADEIA, maisDias(999)).abertos], [0]);
// A prova espera a cadeia inteira.
assert.equal(
  liberacao(INICIO, false, CADEIA, maisDias(6), conclusoesCom({ a0: 1, a1: 3, a2: 4 })).completo,
  true,
);

// O calendário explica cada módulo: data quando há, motivo sempre.
{
  const cal = calendarioDoAluno({
    inicioEm: INICIO,
    regras: CADEIA,
    conclusoes: conclusoesCom({ a0: 1, a1: 3, a2: 4 }),
    agora: maisDias(5),
  });
  assert.deepEqual(
    cal.map((c) => [c.ord, c.aberto, c.motivo]),
    [
      [0, true, "livre"],
      [1, true, "apos_modulo"],
      [2, false, "apos_modulo"],
    ],
  );
  assert.equal(cal[2].abreEm!.getTime(), maisDias(6).getTime(), "abre 2 dias apos concluir o I");
  const semNada = calendarioDoAluno({ inicioEm: INICIO, regras: CADEIA, agora: maisDias(5) });
  assert.equal(semNada[1].abreEm, null, "sem conclusao nao ha data");
  const total = calendarioDoAluno({
    inicioEm: INICIO,
    liberacaoTotal: true,
    regras: [...CADEIA, { tipo: "em_breve" }],
    agora: maisDias(0),
  });
  assert.deepEqual(
    total.map((c) => c.motivo),
    ["livre", "total", "total", "em_breve"],
    "a chave do admin aparece como motivo; em breve continua em breve",
  );
  assert.equal(total[3].aberto, false);
}

// A garantia mede o aluno mais rápido: ele conclui cada módulo no instante em que abre.
assert.equal(violaGarantia(CADEIA, INICIO), true, "cadeia sem dias = tudo no ato para o rapido");
assert.equal(
  violaGarantia(
    [{ tipo: "livre" }, { tipo: "dias", dias: 7 }, { tipo: "apos_modulo", modulo: 1, dias: 3 }],
    INICIO,
  ),
  false,
  "7 dias + 3 apos concluir = 10, fora da janela",
);
assert.equal(
  concluivelEm(INICIO, [{ tipo: "livre" }, { tipo: "apos_modulo", modulo: 1 }]),
  null,
  "dependencia para frente nunca abre, e o curso nunca fica concluivel",
);
assert.equal(
  concluivelEm(INICIO, [{ tipo: "em_breve" }, { tipo: "apos_modulo", modulo: 0 }]),
  null,
  "depender de modulo em breve tambem nunca abre",
);

// --- fuso: a data na tela é a de Brasília, nunca a do servidor (Netlify roda em UTC) ---
// 02:30 UTC do dia 13 ainda é 23:30 do dia 12 em São Paulo (UTC-3, sem horário de verão).
const NOITE = new Date("2026-10-13T02:30:00Z");
assert.equal(dataCurta(NOITE), "12/10", "dataCurta usa America/Sao_Paulo");
assert.equal(dataLonga(NOITE), "12/10/2026");
assert.equal(dataCurta(new Date("2026-10-13T03:00:00Z")), "13/10", "meia-noite de Brasilia");

// --- a prévia da tela de políticas ---
const rot = (ord: number) => `Módulo ${["0", "I", "II", "III", "IV"][ord]}`;
assert.equal(descreverRegra(regraEsteira(1), rot), "abre 7 dias após a matrícula");
assert.equal(descreverRegra(regraEsteira(0), rot), "abre no ato da matrícula");
assert.equal(
  descreverRegra({ tipo: "data", data: new Date("2026-10-20T03:00:00Z") }, rot),
  "abre em 20/10/2026",
);
assert.equal(
  descreverRegra({ tipo: "apos_modulo", modulo: 1 }, rot),
  "abre após concluir o Módulo I",
);
assert.equal(
  descreverRegra({ tipo: "apos_modulo", modulo: 1, dias: 3 }, rot),
  "abre após concluir o Módulo I, mais 3 dias",
);

console.log("liberacao-check: ok");

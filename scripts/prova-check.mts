// Self-check da prova. Sem framework: assert do node.
//   npm run check:prova
//
// Duas frentes, as duas que doem se quebrarem:
//  1. a regra de nota — corte exato, questão em branco, resposta inválida, desempenho
//     por módulo e o arredondamento não promover reprovado;
//  2. as âncoras no HTML portado — se um porte futuro mudar o markup das telas, o
//     preenchimento tem que estourar aqui, e não servir placeholder como se fosse
//     conteúdo real do aluno.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fillQuestao, fillResultado } from "../lib/prova-template.ts";
import {
  NOTA_MINIMA,
  TOTAL_QUESTOES,
  corrigir,
  formatarTempo,
  fraseEmBranco,
  restanteMs,
  resumoProva,
  trechoEmBranco,
  type Letra,
  type QuestaoSnapshot,
  type Respostas,
} from "../lib/prova-correcao.ts";
import { planejarFechamentos, type LinhaExpirada } from "../lib/prova-expiradas.ts";

/** 20 questões, 5 por módulo, gabarito sempre na letra A (índice 0). */
function prova(total = TOTAL_QUESTOES): QuestaoSnapshot[] {
  return Array.from({ length: total }, (_, i) => ({
    id: `q${i + 1}`,
    modulo: Math.floor(i / (total / 4)) + 1,
    enunciado: `Questao ${i + 1}`,
    alternativas: ["A", "B", "C", "D"],
    correta: 0,
  }));
}

/** Responde as `n` primeiras certas (A) e o resto errado (B). */
function respostas(n: number, total = TOTAL_QUESTOES): Respostas {
  const r: Respostas = {};
  for (let i = 1; i <= total; i++) r[String(i)] = (i <= n ? "A" : "B") as Letra;
  return r;
}

// --- tudo certo ---
{
  const c = corrigir(prova(), respostas(20));
  assert.equal(c.acertos, 20);
  assert.equal(c.score, 100);
  assert.equal(c.aprovado, true);
  assert.equal(c.porModulo.length, 4);
  assert.deepEqual(
    c.porModulo.map((m) => m.pct),
    [100, 100, 100, 100],
  );
}

// --- a nota de corte, nos dois lados ---
{
  const passa = corrigir(prova(), respostas(14)); // 70% exato aprova (PRD §7)
  assert.equal(passa.score, 70);
  assert.equal(passa.aprovado, true);

  const cai = corrigir(prova(), respostas(13));
  assert.equal(cai.score, 65);
  assert.equal(cai.aprovado, false);
}

// --- questão em branco conta como erro, e o denominador segue sendo o total ---
{
  const c = corrigir(prova(), { "1": "A" as Letra }); // 1 certa, 19 sem resposta
  assert.equal(c.acertos, 1);
  assert.equal(c.total, 20);
  assert.equal(c.score, 5);
  assert.equal(c.aprovado, false);
}

// --- resposta inválida não pode virar acerto ---
{
  const lixo = { "1": "Z" as Letra, "2": "" as Letra };
  const c = corrigir(prova(), lixo);
  assert.equal(c.acertos, 0);
}

// --- desempenho por módulo isola o módulo fraco ---
{
  // Acerta os 15 primeiros (módulos I, II, III) e erra os 5 do módulo IV.
  const c = corrigir(prova(), respostas(15));
  assert.deepEqual(
    c.porModulo.map((m) => [m.modulo, m.pct]),
    [
      [1, 100],
      [2, 100],
      [3, 100],
      [4, 0],
    ],
  );
  assert.equal(c.score, 75);
  assert.equal(c.aprovado, true);
}

// --- arredondamento não promove reprovado ---
{
  // 2 de 3 = 66,67%, que arredonda para 67. Se a aprovação olhasse o score arredondado
  // com um corte de 67 isso passaria; a comparação é em inteiros justamente por isso.
  const c = corrigir(prova(4).slice(0, 3), { "1": "A" as Letra, "2": "A" as Letra });
  assert.equal(c.acertos, 2);
  assert.equal(c.total, 3);
  assert.equal(c.score, 67);
  assert.equal(c.aprovado, false, "2/3 esta abaixo de 70% e nao pode aprovar");
  assert.ok(c.acertos * 100 < NOTA_MINIMA * c.total);
}

// --- prova vazia não divide por zero ---
{
  const c = corrigir([], {});
  assert.equal(c.score, 0);
  assert.equal(c.total, 0);
  assert.deepEqual(c.porModulo, []);
  // Sem o guard de `total > 0` isto seria TRUE (`0 >= 70 * 0`), e este booleano é o
  // porteiro do certificado.
  assert.equal(c.aprovado, false, "prova sem questao nao aprova");
}

// --- cronômetro ---
{
  const base = Date.UTC(2026, 6, 28, 12, 0, 0);
  assert.equal(restanteMs(new Date(base + 90_000).toISOString(), base), 90_000);
  assert.equal(restanteMs(new Date(base - 5_000).toISOString(), base), 0, "nunca negativo");
  assert.equal(formatarTempo(120 * 60_000), "120:00");
  assert.equal(formatarTempo(90_000), "1:30");
  assert.equal(formatarTempo(9_000), "0:09");
  assert.equal(formatarTempo(0), "0:00");
}

// ============================================================
// Âncoras no HTML portado
// ============================================================

const tela = (nome: string) =>
  readFileSync(join(import.meta.dirname, "..", "app", "app", "_ui", "screens", `${nome}.html`), "utf8");

const QUESTAO = tela("prova-questao");

// --- questão do meio, sem resposta ainda ---
{
  const out = fillQuestao(QUESTAO, {
    questao: {
      id: "q7",
      modulo: 2,
      enunciado: "Qual o prazo de liquidacao de um T-Bill?",
      alternativas: ["Um dia util", "Dois dias uteis", "Uma semana", "Um mes"],
    },
    posicao: 7,
    total: 20,
    respondidas: 6,
    restanteMs: 90 * 60_000,
  });

  assert.ok(out.includes("Qual o prazo de liquidacao de um T-Bill?"), "enunciado real");
  assert.ok(!out.includes("Lorem ipsum"), "placeholder do design tem que sair");
  assert.ok(!out.includes("Primeira alternativa de resposta"), "alternativa placeholder tem que sair");
  assert.ok(out.includes("Dois dias uteis"), "alternativa real");
  assert.ok(out.includes(">Questão 7 de 20<"), "cabecalho X de Y");
  assert.ok(out.includes(">6 respondidas<"), "contador");
  assert.ok(out.includes(">Questão 7</span>"), "kicker");
  assert.ok(out.includes(">90:00<"), "cronometro");
  assert.ok(out.includes("width:35%"), "barra em 7/20");
  assert.ok(out.includes("Próxima →"), "no meio da prova o botao avanca");
  assert.equal((out.match(/data-alt=/g) ?? []).length, 4, "as 4 alternativas");
  assert.ok(!out.includes("background:#FBF6EC"), "nada selecionado ainda");
}

// --- última questão, com resposta já dada ---
{
  const out = fillQuestao(QUESTAO, {
    questao: {
      id: "q20",
      modulo: 4,
      enunciado: "Como se declara ganho de capital em cripto?",
      alternativas: ["A", "B", "C", "D"],
    },
    posicao: 20,
    total: 20,
    respondidas: 20,
    escolhida: "C",
    restanteMs: 0,
  });

  assert.ok(out.includes("Enviar prova"), "ultima questao envia");
  assert.ok(!out.includes("Próxima →"), "e nao avanca");
  assert.ok(out.includes(">0:00<"), "cronometro zerado");
  assert.ok(out.includes("width:100%"), "barra cheia");
  // A alternativa escolhida vem pintada do servidor, sem piscar placeholder.
  const bloco = out.slice(out.indexOf('data-alt="C"'), out.indexOf('data-alt="D"'));
  assert.ok(bloco.includes("background:#FBF6EC"), "C selecionada");
  const blocoA = out.slice(out.indexOf('data-alt="A"'), out.indexOf('data-alt="B"'));
  assert.ok(!blocoA.includes("background:#FBF6EC"), "A nao selecionada");
}

// --- conteúdo do banco não pode injetar HTML ---
{
  const out = fillQuestao(QUESTAO, {
    questao: {
      id: "x",
      modulo: 1,
      enunciado: '<img src=x onerror="alert(1)">',
      alternativas: ["<b>bold</b>", "b", "c", "d"],
    },
    posicao: 1,
    total: 20,
    respondidas: 0,
    restanteMs: 1000,
  });
  assert.ok(!out.includes("<img src=x"), "enunciado escapado");
  assert.ok(out.includes("&lt;img src=x"), "escapado, nao removido");
  assert.ok(!out.includes("<b>bold</b>"), "alternativa escapada");
}

// --- markup mudou: tem que estourar, nao servir placeholder ---
{
  assert.throws(
    () => fillQuestao(QUESTAO.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, "<p>sem h2</p>"), {
      questao: { id: "q", modulo: 1, enunciado: "x", alternativas: ["a", "b", "c", "d"] },
      posicao: 1,
      total: 20,
      respondidas: 0,
      restanteMs: 1000,
    }),
    /ancora nao encontrada/,
    "h2 ausente tem que estourar",
  );
}

// --- resultado, nas duas variantes ---
{
  const aprovado = corrigir(prova(), respostas(17)); // 85%
  const out = fillResultado(tela("resultado"), aprovado, [1, 2, 3, 4]);
  assert.equal(aprovado.score, 85);
  assert.ok(out.includes(">85<span"), "nota grande");
  // 17 acertos = módulos I, II, III inteiros (15) + 2 do IV.
  assert.deepEqual(aprovado.porModulo.map((m) => m.pct), [100, 100, 100, 40]);
  assert.ok(out.includes(">100%</span>"), "linha de modulo cheia");
  assert.ok(out.includes(">40%</span>"), "linha do modulo fraco");
  assert.ok(out.includes("width:40%"), "barra do modulo fraco");
  assert.ok(!out.includes(">88%</span>"), "numero do design tem que sair");

  // Cor calculada por valor: o 40% num aprovado tem que ganhar a pill âmbar, e o 100% não.
  const linha40 = out.slice(out.indexOf(">40%</span>") - 200, out.indexOf(">40%</span>") + 12);
  assert.ok(linha40.includes("#F7E3BE"), "40% num aprovado precisa da pill ambar");
  assert.ok(linha40.includes("#7A4E06"), "texto escuro dentro da pill");
  const linha100 = out.slice(out.indexOf(">100%</span>") - 200, out.indexOf(">100%</span>") + 13);
  assert.ok(linha100.includes("#1B7A50"), "100% em verde que passa AA");
  assert.ok(!linha100.includes("#F7E3BE"), "sucesso nao leva pill");

  // As cores que falhavam AA não podem sobrar em lugar nenhum.
  assert.ok(!out.includes("#1F8A5B;font-weight"), "verde 4,33:1 saiu do texto");
  assert.ok(!out.includes("background:#A98E4E"), "barra dourada 2,54:1 saiu");
  assert.ok(out.includes(`background:${"#AA7010"}`), "barra ambar no modulo fraco");
  assert.ok(out.includes(`background:${"#1F8A5B"}`), "barra verde no modulo bom");

  const reprovado = corrigir(prova(), respostas(9)); // 45%
  const out2 = fillResultado(tela("resultado-reprovado"), reprovado, [1, 2, 3, 4]);
  assert.equal(reprovado.score, 45);
  assert.ok(out2.includes(">45<span"), "nota grande da reprovacao");
  assert.ok(!out2.includes(">78%</span>"), "numero do design tem que sair");
  // 9 acertos = I inteiro (5) + 4 do II  ->  100, 80, 0, 0
  assert.deepEqual(reprovado.porModulo.map((m) => m.pct), [100, 80, 0, 0]);
  // O bug que existia: o design fixava vermelho nas linhas 3 e 4. Com 100% e 80% reais nas
  // linhas 1 e 2, nenhuma delas pode herdar vermelho, e o gradiente do design tem que sair.
  assert.ok(!out2.includes("#c0392b"), "vermelho fixo do design saiu das linhas");
  assert.ok(!out2.includes("linear-gradient(90deg,#b0413e"), "gradiente vermelho da barra saiu");
  const l80 = out2.slice(out2.indexOf(">80%</span>") - 200, out2.indexOf(">80%</span>") + 12);
  assert.ok(l80.includes("#1B7A50"), "80% num reprovado ainda e sucesso de modulo");
  const l0 = out2.slice(out2.indexOf(">0%</span>") - 200, out2.indexOf(">0%</span>") + 11);
  assert.ok(l0.includes("#F7E3BE"), "0% leva pill ambar");
}

// ============================================================
// Grade de questões e contagem de em branco (diálogo de envio)
// ============================================================

// --- a contagem, que é a informação que dá sentido à confirmação ---
{
  const r = resumoProva(20, [1, 2, 3]);
  assert.equal(r.respondidas, 3);
  assert.equal(r.emBranco, 17);
  assert.equal(r.itens.length, 20);
  assert.deepEqual(
    r.itens.filter((i) => i.respondida).map((i) => i.posicao),
    [1, 2, 3],
  );
}

// --- prova inteira respondida e prova intocada ---
{
  const cheia = resumoProva(20, Array.from({ length: 20 }, (_, i) => i + 1));
  assert.equal(cheia.emBranco, 0);
  const vazia = resumoProva(20, []);
  assert.equal(vazia.emBranco, 20);
  assert.equal(vazia.itens.every((i) => !i.respondida), true);
}

// --- sujeira na entrada não conta em dobro nem estoura o total ---
{
  // `answers` é dado gravado ao longo de duas horas: repetida, fora de faixa e não inteira
  // são todas plausíveis se o snapshot mudou de tamanho entre versões.
  const r = resumoProva(20, [5, 5, 0, 21, -3, 7.5, 12]);
  assert.equal(r.respondidas, 2, "5 e 12 valem; repetida, zero, 21, negativa e fracionária nao");
  assert.equal(r.emBranco, 18);
  assert.equal(r.respondidas + r.emBranco, 20, "a soma tem que fechar no total");
}

// --- o plural da frase, que só aparece para o aluno ---
{
  assert.equal(fraseEmBranco(0), "Você respondeu todas as questões.");
  assert.equal(fraseEmBranco(1), "Você deixou 1 questão em branco.", "singular sem 's'");
  assert.equal(fraseEmBranco(2), "Você deixou 2 questões em branco.");
  assert.equal(fraseEmBranco(20), "Você deixou 20 questões em branco.");
}

// --- o trecho em negrito tem que ser substring exata da frase ---
{
  // O diálogo aplica o negrito procurando o trecho DENTRO do corpo. Se os dois divergirem, o
  // destaque desaparece em silêncio: a frase continua certa e ninguém percebe.
  for (const n of [1, 2, 7, 20]) {
    const trecho = trechoEmBranco(n);
    assert.ok(
      fraseEmBranco(n).includes(trecho),
      `"${trecho}" tem que aparecer dentro de "${fraseEmBranco(n)}"`,
    );
  }
  assert.equal(trechoEmBranco(1), "1 questão em branco", "singular");
  assert.equal(trechoEmBranco(3), "3 questões em branco");
}

// ============================================================
// Fechamento das tentativas abandonadas (lib/prova-expiradas.ts)
// ============================================================

const PRAZO = "2026-07-28T12:00:00.000Z";

const vencida = (id: string, resp: Respostas, total = TOTAL_QUESTOES): LinhaExpirada => ({
  id,
  deadline: PRAZO,
  questions_snapshot: prova(total),
  answers: resp,
});

// --- a data de entrega é o prazo, não a hora em que a rotina rodou ---
{
  const [f] = planejarFechamentos([vencida("e1", respostas(20))]);
  assert.equal(
    f.submitted_at,
    PRAZO,
    "submitted_at tem que ser o deadline: amarrar ao now() da rotina faria a entrega depender da cadência do agendador",
  );
  assert.equal(f.score, 100);
  assert.equal(f.aprovado, true);
}

// --- corrige o respondido: em branco conta como erro e o denominador segue sendo 20 ---
{
  const [f] = planejarFechamentos([
    vencida("e2", { "1": "A" as Letra, "2": "A" as Letra }),
  ]);
  assert.equal(f.score, 10, "2 certas de 20 questoes, nao de 2 respondidas");
  assert.equal(f.aprovado, false, "abandonar a prova nao pode aprovar");
}

// --- a nota de corte vale igual para quem abandonou ---
{
  const [passa] = planejarFechamentos([vencida("e3", respostas(14))]);
  assert.equal(passa.aprovado, true, "14/20 aprova mesmo com o prazo estourado");
  const [cai] = planejarFechamentos([vencida("e4", respostas(13))]);
  assert.equal(cai.aprovado, false);
}

// --- tentativa aberta e nunca tocada não estoura ---
{
  const [f] = planejarFechamentos([
    { id: "e5", deadline: PRAZO, questions_snapshot: null, answers: null },
  ]);
  assert.equal(f.score, 0);
  assert.equal(f.aprovado, false);
  assert.equal(f.submitted_at, PRAZO);
}

// --- nada vencido, nada a fazer ---
assert.deepEqual(planejarFechamentos([]), []);

console.log("prova-check: ok");

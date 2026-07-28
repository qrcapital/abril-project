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
  restanteMs,
  type Letra,
  type QuestaoSnapshot,
  type Respostas,
} from "../lib/prova-correcao.ts";

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

  const reprovado = corrigir(prova(), respostas(9)); // 45%
  const out2 = fillResultado(tela("resultado-reprovado"), reprovado, [1, 2, 3, 4]);
  assert.equal(reprovado.score, 45);
  assert.ok(out2.includes(">45<span"), "nota grande da reprovacao");
  assert.ok(!out2.includes(">78%</span>"), "numero do design tem que sair");
}

console.log("prova-check: ok");

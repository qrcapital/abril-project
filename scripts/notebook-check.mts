// Self-check do notebook: `npm run check:notebook`.
//
// Duas coisas que não aparecem em build nem em lint:
// 1. as contas dos simuladores (`lib/notebook.ts`), que o aluno vê como número e gráfico;
// 2. o conteúdo de todos os notebooks registrados, mais a vitrine do guia
//    (`content/notebooks/exemplos.ts`), passando por `validarNotebook`: série do tamanho do eixo,
//    KPI de 2 a 4, `tempo` legível, marco dentro do eixo, fonte ou ilustrativo.
//
// Os arquivos de conteúdo importam `@/lib/notebook` e `./modulo-0` sem extensão, como o Next
// aceita; `notebook-alias.mjs` resolve os dois para o node puro.

import assert from "node:assert/strict";
import { register } from "node:module";

import {
  cambioPatrimonio,
  fatiaDeMenorVolatilidade,
  formatar,
  jurosDuasMoedas,
  primarioQueEstabiliza,
  segundos,
  segundosDaUrl,
  trajetoriaDivida,
  validarNotebook,
  volatilidadeCarteira,
  type Notebook,
} from "../lib/notebook.ts";

register("./notebook-alias.mjs", import.meta.url);

const perto = (a: number, b: number, msg: string, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} != ${b}`);

// --- formatação ---
assert.equal(formatar(-1.2, "brl"), "−R$ 1,20", "negativo com menos tipográfico antes do prefixo");
assert.equal(formatar(3.456, "pct"), "3,5%");
assert.equal(formatar(1.5, { base: "pp", sinal: true }), "+1,5 p.p.");
assert.equal(formatar(-0.04, "pct"), "0,0%", "zero arredondado não leva sinal");
assert.equal(formatar(1_250_000, { base: "brl", casas: 0, compacto: true }), "R$ 1,3 mi");
assert.equal(formatar(5.5, "multiplo"), "5,5×");

// --- tempo da aula ---
assert.equal(segundos("12:34"), 754);
assert.equal(segundos("1:02:03"), 3723);
assert.equal(segundos("12:60"), null);
assert.equal(segundos("abc"), null);
assert.equal(segundosDaUrl("754"), 754);
for (const ruim of ["", "0", "-3", "12.5", "99999", "1e3", "javascript:alert(1)"]) assert.equal(segundosDaUrl(ruim), null, ruim);

// --- dívida / PIB ---
{
  const d = trajetoriaDivida(80, 5, 5, 0, 10);
  assert.equal(d.length, 11);
  for (const v of d) perto(v, 80, "r = g e primário zero: dívida parada", 1e-9);
  const s = primarioQueEstabiliza(76, 6, 2);
  perto(s, (76 * 4) / 102, "s* = d(r - g)/(1 + g)");
  const est = trajetoriaDivida(76, 6, 2, s, 20);
  perto(est[20], 76, "com s* a dívida não sai do lugar", 1e-6);
  assert.ok(trajetoriaDivida(76, 6, 2, 0, 10)[10] > 76, "r > g sem primário: dívida sobe");
}

// --- diversificação ---
perto(volatilidadeCarteira(0, 22, 16, 0.3), 22, "tudo no Brasil");
perto(volatilidadeCarteira(1, 22, 16, 0.3), 16, "tudo fora");
perto(volatilidadeCarteira(0.5, 20, 10, 1), 15, "correlação 1 é média ponderada");
assert.ok(volatilidadeCarteira(0.3, 22, 16, 0.3) < 22 * 0.7 + 16 * 0.3, "correlação < 1 diversifica");
{
  const m = fatiaDeMenorVolatilidade(22, 16, 0.3);
  assert.ok(m > 0 && m < 100);
  // mínimo analítico: w* = (σ1² − ρσ1σ2)/(σ1² + σ2² − 2ρσ1σ2), com σ1 = Brasil
  const w = (22 * 22 - 0.3 * 22 * 16) / (22 * 22 + 16 * 16 - 2 * 0.3 * 22 * 16);
  assert.ok(Math.abs(m - w * 100) <= 1, `mínimo numérico ${m} perto do analítico ${w * 100}`);
}

// --- câmbio e patrimônio ---
{
  const r = cambioPatrimonio(1_000_000, 5, 0, 10, 0.3);
  for (const v of r.usdComFatia) perto(v, 200_000, "sem depreciação o valor em dólar não muda", 1e-6);
  const d = cambioPatrimonio(1_000_000, 5, 10, 5, 0);
  perto(d.usdTudoReais[5], 1_000_000 / (5 * 1.1 ** 5), "tudo em reais perde o câmbio inteiro", 1e-6);
  const f = cambioPatrimonio(1_000_000, 5, 10, 5, 1);
  perto(f.usdComFatia[5], 200_000, "tudo convertido fica parado em dólar", 1e-6);
}

// --- juros em duas moedas ---
{
  const p = { inicial: 100_000, aporte: 1_000, fatia: 0, taxaBrl: 10, taxaUsd: 5, cambio: 5, depreciacao: 4, anos: 10 };
  const r = jurosDuasMoedas(p);
  for (let t = 0; t <= 10; t++) {
    perto(r.parteDolar[t], 0, "fatia zero: nada em dólar");
    perto(r.parteReais[t], r.tudoReais[t], "fatia zero: igual à carteira só em reais", 1e-6);
  }
  perto(r.tudoReais[1], 100_000 * 1.1 + 12_000, "aporte do ano entra no fim do ano", 1e-6);
  const u = jurosDuasMoedas({ ...p, aporte: 0, fatia: 1, taxaUsd: 0 });
  perto(u.parteDolar[10], 100_000 * 1.04 ** 10, "sem rendimento, a parte em dólar acompanha o câmbio", 1e-6);
}

// --- validação: o validador pega o que deve pegar ---
{
  const ruim: Notebook = {
    modulo: 9,
    titulo: "t",
    subtitulo: "s",
    demo: true,
    aulas: [
      {
        aula: 1,
        blocos: [
          { tipo: "grafico", titulo: "g", forma: "linha", eixoX: ["a", "b"], series: [{ nome: "x", valores: [1] }], ilustrativo: true, tempo: "9:99" },
          { tipo: "kpis", itens: [{ rotulo: "a", valor: 1 }], fonte: "" },
          { tipo: "fluxo", nos: [{ titulo: "a" }, { titulo: "b" }], fonte: "f" },
          { tipo: "simulador", id: "s", titulo: "s", modelo: "dividaPib", parametros: { anos: { valor: 99 } } },
        ],
      },
    ],
  };
  const erros = validarNotebook(ruim).join("\n");
  for (const trecho of ["tem 1 valores", "tempo", "2 a 4", "fonte vazia", "3 a 6", "fora de [min, max]"])
    assert.ok(erros.includes(trecho), `o validador deveria acusar "${trecho}":\n${erros}`);
}

// --- o conteúdo de verdade, e a vitrine do guia ---
const { notebookDoModulo } = await import("../content/notebooks/index.ts");
const { default: exemplos } = await import("../content/notebooks/exemplos.ts");
const todos: Notebook[] = [exemplos];
for (let m = 0; m <= 20; m++) {
  const nb = notebookDoModulo(m);
  if (nb) todos.push(nb);
}
assert.ok(todos.length >= 2, "nenhum notebook registrado");
const problemas = todos.flatMap((nb) => validarNotebook(nb));
assert.deepEqual(problemas, [], `notebook com problema:\n${problemas.join("\n")}`);

console.log(`notebook-check: ok (${todos.length} notebooks, incluindo a vitrine do guia)`);

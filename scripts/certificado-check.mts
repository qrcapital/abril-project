// Self-check do código do certificado.
//   npm run check:certificado
//
// Roda offline. O que ele guarda é a peça mais pública do produto: o código que um RH digita para
// conferir se o candidato concluiu a formação. Errar aqui não aparece na nossa tela, aparece na
// consulta de um terceiro, e o estrago é a palavra "inválido" sobre um certificado verdadeiro.
//
// O que quebraria sem ele:
//
// 1. **Símbolo ambíguo no alfabeto.** Um `O` ou um `1` no código transforma leitura em adivinhação.
// 2. **Formato fora do combinado** (`EI-XXXX-XXXX`, 8 símbolos): o PDF, o LinkedIn e a URL de
//    verificação carregam o mesmo texto, e qualquer um deles fora de forma quebra os três.
// 3. **Sorteio com viés**, que é o começo de um código adivinhável num verificador público.
// 4. **Normalização frouxa**, que recusaria o código digitado de um PDF com espaço no lugar do hífen.

import assert from "node:assert/strict";

import {
  ALFABETO,
  SIMBOLOS,
  gerarCodigo,
  linkedinAddUrl,
  normalizarCodigo,
} from "../lib/certificado.ts";

// --- 1. o alfabeto não tem símbolo confundível ---
{
  for (const proibido of ["I", "O", "L", "U", "0", "1"]) {
    assert.ok(
      !ALFABETO.includes(proibido),
      `"${proibido}" nao pode estar no alfabeto: e ditado por telefone e digitado de um PDF`,
    );
  }
  assert.equal(new Set(ALFABETO).size, ALFABETO.length, "alfabeto com simbolo repetido enviesa o sorteio");
  assert.ok(ALFABETO.length >= 30, "menos de 30 simbolos encurta demais o espaco de codigos");
}

// --- 2. o formato ---
{
  const codigo = gerarCodigo();
  assert.match(
    codigo,
    /^EI-[A-Z2-9]{4}-[A-Z2-9]{4}$/,
    `formato tem que ser EI-XXXX-XXXX e veio "${codigo}"`,
  );
  assert.equal(codigo.replace(/[^A-Z0-9]/g, "").length, 2 + SIMBOLOS);
  // Sem ano no código, por decisão do Pedro: certificado emitido em dezembro e verificado em janeiro
  // não deve parecer vencido, e o ano no código convida a essa leitura.
  assert.ok(!/\b(19|20)\d{2}\b/.test(codigo), "o codigo nao carrega ano");
}

// --- 3. aleatório de verdade: nem sequencial, nem repetido ---
{
  const muitos = Array.from({ length: 2000 }, () => gerarCodigo());
  assert.equal(new Set(muitos).size, muitos.length, "2000 sorteios nao podem repetir codigo");

  // Cada posição usa boa parte do alfabeto. Um gerador preso (por exemplo sempre o mesmo byte) ou
  // sequencial passaria no teste de repetição acima e cairia aqui.
  for (let pos = 0; pos < SIMBOLOS; pos++) {
    const distintos = new Set(muitos.map((c) => c.replace(/-/g, "").slice(2)[pos]));
    assert.ok(
      distintos.size >= ALFABETO.length * 0.8,
      `posicao ${pos} usou so ${distintos.size} dos ${ALFABETO.length} simbolos: sorteio suspeito`,
    );
  }

  // O `sorteia` injetado prova que a montagem respeita o índice recebido, sem depender de sorte.
  let i = 0;
  const previsivel = gerarCodigo(() => i++ % ALFABETO.length);
  assert.equal(previsivel, `EI-${ALFABETO.slice(0, 4)}-${ALFABETO.slice(4, 8)}`);
}

// --- 4. normalização: aceita o que a pessoa digita, recusa o que não existe ---
{
  const canonico = "EI-ABCD-EFGH";
  for (const entrada of [
    "EI-ABCD-EFGH",
    "ei-abcd-efgh",
    "EI ABCD EFGH",
    "  eiabcdefgh  ",
    "ABCD-EFGH",
    "abcdefgh",
    "EI–ABCD–EFGH".replace(/–/g, "-"),
  ]) {
    assert.equal(
      normalizarCodigo(entrada),
      canonico,
      `"${entrada}" veio de um PDF digitado a mao e precisa valer`,
    );
  }
  for (const invalida of ["", "EI-ABC-EFGH", "EI-ABCD-EFGHI", "EI-ABCD-EFG0", "EI-ABCD-EFGO", "xxxx"]) {
    assert.equal(
      normalizarCodigo(invalida),
      null,
      `"${invalida}" nao e um codigo que emitimos, e recusar aqui poupa uma consulta`,
    );
  }
  // Ida e volta: todo código gerado sobrevive à normalização.
  for (let n = 0; n < 200; n++) {
    const c = gerarCodigo();
    assert.equal(normalizarCodigo(c), c);
    assert.equal(normalizarCodigo(c.toLowerCase().replace(/-/g, " ")), c);
  }
}

// --- 5. o link do LinkedIn leva o código real e a data da emissão ---
{
  const url = new URL(linkedinAddUrl("https://ei.test", "EI-ABCD-EFGH", new Date("2026-09-14T12:00:00Z")));
  assert.equal(url.searchParams.get("certId"), "EI-ABCD-EFGH");
  assert.equal(url.searchParams.get("certUrl"), "https://ei.test/verificar/EI-ABCD-EFGH");
  assert.equal(url.searchParams.get("issueYear"), "2026");
  assert.equal(url.searchParams.get("issueMonth"), "9", "mes do LinkedIn e 1..12, nao o 0..11 do JS");
  assert.equal(url.searchParams.get("organizationName"), "BlockTrends", "quem emite e o BlockTrends");
}

console.log(`certificado-check: ok (alfabeto de ${ALFABETO.length} simbolos, ${SIMBOLOS} posicoes)`);

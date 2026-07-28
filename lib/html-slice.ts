// Utilidades de recorte sobre o HTML gerado pelos portes (`scripts/port-*.mjs`).
//
// Existem porque as telas são markup portado, não JSX: para injetar dado real a gente
// substitui trechos em cima do HTML do design. Três consumidores hoje:
// `home-template.ts`, `prova-template.ts` e `senha-template.ts`.

/**
 * Conteúdo interno (com divs balanceadas) de um `<div>`, a partir do índice do seu `<div`.
 * Devolve os offsets de início e fim para fatiar.
 *
 * Contava só `<div`/`</div>`, o que basta porque o markup portado não usa outra tag que
 * aninhe div e não há `<div` dentro de string de atributo.
 */
export function innerOfDiv(html: string, openIdx: number): { start: number; end: number } {
  const start = html.indexOf(">", openIdx) + 1;
  let depth = 1;
  let i = start;
  while (depth > 0 && i < html.length) {
    const o = html.indexOf("<div", i);
    const c = html.indexOf("</div>", i);
    if (c < 0) break;
    if (o >= 0 && o < c) {
      depth++;
      i = o + 4;
    } else {
      depth--;
      i = c + 6;
    }
  }
  return { start, end: i - 6 };
}

/**
 * Substitui e confere. Se a âncora não existir mais no HTML portado, estoura em vez de
 * devolver a tela com o placeholder do design, que passaria por conteúdo real.
 *
 * Confere a PRESENÇA da âncora, não se a saída ficou diferente da entrada: quando o valor
 * novo é igual ao placeholder (a questão 1 da prova com zero respondidas, uma nota real de
 * 85 na tela que já mostrava 85), a substituição está certa e comparar strings acusaria
 * falha. Esse bug existiu e quebrava a primeira tela da prova.
 *
 * Âncora de regex não leva a flag `g`: `test` em regex global avança o `lastIndex` e o
 * `replace` seguinte pularia a primeira ocorrência.
 */
export function exigir(html: string, de: string | RegExp, para: string, oque: string): string {
  const achou = typeof de === "string" ? html.includes(de) : de.test(html);
  if (!achou) throw new Error(`[template] ancora nao encontrada: ${oque}`);
  return html.replace(de, para);
}

/** Escapa texto de fonte externa antes de entrar em HTML injetado. */
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

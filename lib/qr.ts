// QR code em SVG, para o certificado. **Puro e client-safe**, pelo mesmo motivo do
// `lib/certificado.ts`: a folha do certificado é desenhada no servidor e rasterizada no navegador
// na hora do PDF, então nada de `node:*` aqui.
//
// A codificação é do `qrcode-generator` (Kazuhiko Arase, MIT, sem dependências). Escrever um
// codificador à mão para economizar uma dependência de 50 KB seria trocar um problema resolvido por
// um que só aparece quando alguém aponta a câmera e nada acontece.

import qrcode from "qrcode-generator";

/** A matriz do QR: `true` é módulo escuro. Nível M de correção, que aguenta ~15% de dano. */
export function qrMatriz(texto: string): boolean[][] {
  const qr = qrcode(0, "M");
  qr.addData(texto, "Byte");
  qr.make();
  const n = qr.getModuleCount();
  return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => qr.isDark(r, c)));
}

/**
 * O QR como um `<svg>` completo, com um único `<path>` (um quadrado por módulo escuro) e a zona
 * de silêncio embutida, pintada com `fundo`.
 *
 * Leva `width`/`height` explícitos, e não só `viewBox`, porque a folha vira PDF passando por um
 * `<canvas>`: SVG sem tamanho intrínseco é desenhado com 0 px no Firefox, e o QR sumiria
 * justamente do arquivo que o aluno manda para o RH.
 */
export function qrSvg(
  texto: string,
  { tinta = "#1a1815", fundo = "#fdfbf6", margem = 2 }: { tinta?: string; fundo?: string; margem?: number } = {},
): string {
  const m = qrMatriz(texto);
  const lado = m.length + margem * 2;
  let d = "";
  m.forEach((linha, r) =>
    linha.forEach((escuro, c) => {
      if (escuro) d += `M${c + margem} ${r + margem}h1v1h-1z`;
    }),
  );
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" width="${lado * 8}" height="${lado * 8}" shape-rendering="crispEdges">` +
    `<rect width="${lado}" height="${lado}" fill="${fundo}"/>` +
    `<path d="${d}" fill="${tinta}"/>` +
    `</svg>`
  );
}

/** O mesmo SVG como data URI, para usar em `<img src>`. */
export function qrDataUri(texto: string, opcoes?: Parameters<typeof qrSvg>[1]): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg(texto, opcoes))}`;
}

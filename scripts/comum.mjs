// Peças compartilhadas pelos dois portes (port-lp.mjs e port-area.mjs).

import contato from '../lib/contato.json' with { type: 'json' };

/** Canal de suporte e DPO. Fonte única: lib/contato.json (o app lê o mesmo arquivo). */
export const WHATSAPP = contato.whatsapp;
export const DPO_EMAIL = contato.dpoEmail;

/**
 * Traduz os atributos `style-hover` / `style-focus` do bundle em CSS real.
 *
 * O bundle do Claude Design aplicava esses estados por JS, trocando o `style` inline
 * no mouseenter. O porte remove o script do bundle, e até aqui dois runtimes no
 * cliente (HoverRuntime na LP, AreaInteractions na área) refaziam esse trabalho à
 * mão, um deles com um MutationObserver vigiando o `<body>` inteiro. `:hover` e
 * `:focus` fazem a mesma coisa sem JS: uma regra por valor DISTINTO do atributo,
 * casada pelo próprio atributo. São poucos valores repetidos em dezenas de elementos.
 *
 * Dois detalhes que não são decoração:
 * - `!important` é obrigatório, porque a regra concorre com `style` inline, que ganha
 *   de qualquer seletor.
 * - o bloco de hover vai dentro de `@media (hover:hover)` para preservar a semântica
 *   do `mouseenter`: sem isso, no toque o estado gruda no elemento depois do tap.
 */
export function regrasDeEstado(html) {
  const distintos = (attr) => [
    ...new Set([...html.matchAll(new RegExp(`${attr}="([^"]*)"`, 'g'))].map((m) => m[1])),
  ];
  const bang = (decls) =>
    decls
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => `${d}!important`)
      .join(';');
  const regras = (attr, estado) =>
    distintos(attr).map((v) => `[${attr}="${v}"]:${estado}{${bang(v)}}`);

  const hover = regras('style-hover', 'hover');
  const focus = regras('style-focus', 'focus');
  console.log(`estados: ${hover.length} regras de hover, ${focus.length} de focus`);
  return [
    '',
    '/* Hover e foco do bundle (atributos style-hover/style-focus) como CSS nativo.',
    '   Ver scripts/comum.mjs: uma regra por valor distinto, !important por causa do',
    '   style inline, hover restrito a ponteiro fino. */',
    hover.length ? `@media (hover:hover){\n${hover.join('\n')}\n}` : '',
    focus.join('\n'),
    '',
  ].join('\n');
}

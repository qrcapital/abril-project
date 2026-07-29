// Telas de senha (recuperar e redefinir) montadas sobre o `login.html` portado.
//
// Não há tela dessas no bundle do design, e o `DESIGN.md` §11 prevê o caso ("montar com
// patterns do Meridiano"). Em vez de escrever JSX novo, que divergiria do login com o
// tempo, a gente reaproveita a tela de login inteira e troca só o conteúdo da coluna do
// formulário. Coluna de marca, textura de pontos, gradientes e o lockup do wordmark vêm
// prontos e continuam iguais aos do login mesmo se o porte mudar.

import { esc, innerOfDiv } from "./html-slice.ts";

export type Campo = {
  nome: string;
  rotulo: string;
  tipo: "email" | "password";
  autoComplete?: string;
  placeholder?: string;
};

const LABEL =
  "display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8FA398;font-weight:700;margin-bottom:7px";
const INPUT =
  "width:100%;box-sizing:border-box;background:rgba(10,32,22,.6);border:1px solid rgba(217,190,133,.28);border-radius:8px;padding:12px 14px;color:#F7F5F2;font-family:'Montserrat',sans-serif;font-size:13.5px;margin-bottom:16px;outline:none";
const BOTAO =
  "width:100%;border:none;border-radius:8px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;letter-spacing:.08em;padding:14px;cursor:pointer;background:linear-gradient(160deg,#D9BE85,#A98E4E);color:#0A2B1E;box-shadow:0 8px 22px rgba(169,142,78,.3);transition:transform .12s ease";
const H1 =
  "font-family:'Playfair Display',serif;font-size:34px;font-weight:700;color:#F7F5F2;margin:0 0 8px;line-height:1.08";
const LEAD = "font-size:14.5px;color:#B9C4BC;margin:0 0 28px;line-height:1.55";
const RODAPE = "font-size:11.5px;color:#8FA398;margin:18px 0 0";
const LINK = "color:#D9BE85;font-weight:600";

/**
 * Troca o miolo da coluna do formulário do login pelo conteúdo pedido.
 *
 * A âncora é o container de largura fixa do formulário (`max-width:400px`), que o porte
 * emite e é único na tela. Se ele desaparecer, estoura, em vez de devolver a tela de login
 * intacta com os campos errados.
 */
export function telaSenha(
  loginHtml: string,
  dados: {
    titulo: string;
    lead: string;
    campos: Campo[];
    botao: string;
    rodapeHtml?: string;
  },
): string {
  const marca = 'width:100%;max-width:400px;margin:0 auto';
  const idx = loginHtml.indexOf(marca);
  if (idx < 0) throw new Error("[senha-template] container do formulario nao encontrado no login.html");
  const abre = loginHtml.lastIndexOf("<div", idx);
  const { start, end } = innerOfDiv(loginHtml, abre);

  const campos = dados.campos
    .map(
      (c) =>
        `<label for="${c.nome}" style="${LABEL}">${esc(c.rotulo)}</label>` +
        `<input id="${c.nome}" name="${c.nome}" type="${c.tipo}" required` +
        (c.autoComplete ? ` autocomplete="${c.autoComplete}"` : "") +
        (c.placeholder ? ` placeholder="${esc(c.placeholder)}"` : "") +
        ` style="${INPUT}">`,
    )
    .join("");

  const miolo =
    `<h1 style="${H1}">${esc(dados.titulo)}</h1>` +
    `<p style="${LEAD}">${esc(dados.lead)}</p>` +
    `<div data-campos>${campos}</div>` +
    // Slot da caixa de feedback, no mesmo lugar em que o login põe a dele: entre os campos
    // e o botão. Sem ele a caixa era irmã do layout inteiro e caía no rodapé da página,
    // 350px abaixo do formulário (visto no browser em 29/jul, não pegava em build).
    `<div data-feedback hidden></div>` +
    `<button type="submit" style="${BOTAO}">${esc(dados.botao)}</button>` +
    (dados.rodapeHtml ? `<p style="${RODAPE}">${dados.rodapeHtml}</p>` : "");

  return loginHtml.slice(0, start) + miolo + loginHtml.slice(end);
}

/** Link no tom do design, para os rodapés das telas. */
export function linkSenha(href: string, texto: string): string {
  return `<a href="${href}" style="${LINK}">${esc(texto)}</a>`;
}

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

// Caixa de aceite dos documentos (migration 0023). Fica entre o feedback e o botão porque o que
// ela promete precisa ser lido ANTES do ato, não depois dele.
//
// `align-items:flex-start` e não `center`: o texto tem três linhas nesta largura, e centralizar
// deixaria a caixa boiando no meio do parágrafo, longe da primeira palavra que ela governa.
const ACEITE_LINHA =
  "display:flex;align-items:flex-start;gap:10px;margin:2px 0 18px;cursor:pointer";
// 16px fixos, com `flex:none`: sem isso o flex espreme a caixa quando o texto cresce, e um
// checkbox de 9px de largura não é alvo de toque em celular.
const ACEITE_CAIXA =
  "flex:none;width:16px;height:16px;margin:1px 0 0;accent-color:#D9BE85;cursor:pointer";
const ACEITE_TEXTO =
  "font-size:12px;line-height:1.5;color:#B9C4BC;font-family:'Montserrat',sans-serif";

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
    /** HTML da caixa de aceite, quando a tela precisa colher consentimento. Ver `caixaAceite`. */
    aceiteHtml?: string;
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
    (dados.aceiteHtml ?? "") +
    `<button type="submit" style="${BOTAO}">${esc(dados.botao)}</button>` +
    (dados.rodapeHtml ? `<p style="${RODAPE}">${dados.rodapeHtml}</p>` : "");

  return loginHtml.slice(0, start) + miolo + loginHtml.slice(end);
}

/** Link no tom do design, para os rodapés das telas. */
export function linkSenha(href: string, texto: string): string {
  return `<a href="${href}" style="${LINK}">${esc(texto)}</a>`;
}

/**
 * A caixa de aceite dos documentos, no tom das telas de senha.
 *
 * O `data-aceite` no input é o que o cliente procura para validar, e o `id` é o que faz o clique no
 * texto marcar a caixa: sem o `for`/`id` o alvo vira só o quadradinho de 16px.
 *
 * Os nomes dos documentos saem SEM LINK quando a URL não está configurada. É a mesma escolha do
 * formulário da pré-lista: link morto numa tela que colhe consentimento é pior que texto simples,
 * porque promete um documento que não abre e o aceite passa a valer sobre algo que a pessoa não
 * tinha como ler.
 *
 * `target="_blank"`: abrir o documento na mesma aba abandonaria a sessão do link do e-mail, e a
 * pessoa voltaria para uma tela de senha que já não vale.
 */
export function caixaAceite(dados: {
  texto: string;
  urlTermos?: string;
  urlPolitica?: string;
}): string {
  const doc = (url: string | undefined, nome: string) =>
    url
      ? `<a href="${url}" target="_blank" rel="noopener noreferrer" style="${LINK}">${esc(nome)}</a>`
      : `<strong style="color:#D9BE85;font-weight:600">${esc(nome)}</strong>`;

  // O texto vem inteiro de `lib/consentimento.ts`, que é o mesmo valor gravado no log, e aqui só
  // os dois nomes de documento viram link. Trocar a frase por uma redação "melhor" nesta função
  // faria a tela mostrar uma coisa e o registro guardar outra.
  const comLinks = esc(dados.texto)
    .replace("Termos de Uso", doc(dados.urlTermos, "Termos de Uso"))
    .replace("Política de Privacidade", doc(dados.urlPolitica, "Política de Privacidade"));

  return (
    `<label for="aceite" style="${ACEITE_LINHA}">` +
    `<input type="checkbox" id="aceite" name="aceite" data-aceite required style="${ACEITE_CAIXA}">` +
    `<span style="${ACEITE_TEXTO}">${comLinks}</span>` +
    `</label>`
  );
}

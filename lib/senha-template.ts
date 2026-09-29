// Telas de senha e de conta (recuperar, redefinir, aceite dos termos, acesso bloqueado).
//
// Todas usam a MESMA casca do login (`lib/auth-casca.ts`) e só trocam o miolo da coluna do
// formulário. Até 29/set/2026 isto fazia cirurgia de string no `login.html` portado, achando a
// coluna por um trecho de estilo inline; com a casca virando código nosso, a cirurgia virou uma
// chamada de função, e o estilo inline verde virou as classes `.au-*` de `app/app/_ui/auth.css`.
//
// A assinatura continua parecida de propósito: `telaSenha(dados)` recebe o mesmo objeto de antes,
// só sem o HTML do login como primeiro argumento.

import { botao, casca, esc, input, lead, rodape, rotulo, titulo } from "./auth-casca.ts";

export type Campo = {
  nome: string;
  rotulo: string;
  tipo: "email" | "password";
  autoComplete?: string;
  placeholder?: string;
};

export function telaSenha(dados: {
  titulo: string;
  lead: string;
  campos: Campo[];
  botao: string;
  rodapeHtml?: string;
  /** HTML da caixa de aceite, quando a tela precisa colher consentimento. Ver `caixaAceite`. */
  aceiteHtml?: string;
}): string {
  const campos = dados.campos
    .map(
      (c) =>
        rotulo(c.rotulo, c.nome) +
        input({
          nome: c.nome,
          tipo: c.tipo,
          autoComplete: c.autoComplete,
          placeholder: c.placeholder,
          required: true,
        }),
    )
    .join("");

  return casca(
    titulo(dados.titulo) +
      lead(dados.lead) +
      `<div data-campos>${campos}</div>` +
      // Slot da caixa de feedback, entre os campos e o botão. Sem ele a caixa era irmã do layout
      // inteiro e caía no rodapé da página, 350px abaixo do formulário (visto em 29/jul).
      `<div data-feedback hidden></div>` +
      (dados.aceiteHtml ?? "") +
      botao(dados.botao) +
      (dados.rodapeHtml ? rodape(dados.rodapeHtml) : ""),
  );
}

/** Link no tom da casca, para os rodapés das telas. */
export function linkSenha(href: string, texto: string): string {
  return `<a href="${href}" class="au-link">${esc(texto)}</a>`;
}

/**
 * A caixa de aceite dos documentos (migration 0023).
 *
 * O `data-aceite` no input é o que o cliente procura para validar, e o `id` é o que faz o clique no
 * texto marcar a caixa: sem o `for`/`id` o alvo vira só o quadradinho de 16px.
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
      ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="au-link">${esc(nome)}</a>`
      : `<strong>${esc(nome)}</strong>`;

  // O texto vem inteiro de `lib/consentimento.ts`, que é o mesmo valor gravado no log, e aqui só
  // os dois nomes de documento viram link. Trocar a frase por uma redação "melhor" nesta função
  // faria a tela mostrar uma coisa e o registro guardar outra.
  const comLinks = esc(dados.texto)
    .replace("Termos de Uso", doc(dados.urlTermos, "Termos de Uso"))
    .replace("Política de Privacidade", doc(dados.urlPolitica, "Política de Privacidade"));

  return (
    `<label for="aceite" class="au-aceite">` +
    `<input type="checkbox" id="aceite" name="aceite" data-aceite required>` +
    `<span>${comLinks}</span>` +
    `</label>`
  );
}

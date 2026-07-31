// Montagem do e-mail: variáveis, layout e versão texto. **Puro, sem IO.**
//
// Mora separado do `lib/email.ts` pela regra que já custou tempo neste projeto (AGENTS.md): módulo
// que importa Supabase puxa `next/headers` por baixo e não roda no node do `npm run check`. A regra
// de escapar variável de aluno em HTML é exatamente o tipo de coisa que precisa de check, então ela
// fica aqui e o IO importa daqui. Guarda em `npm run check:email`.

import { esc } from "./html-slice.ts";

export type Dados = Record<string, string | number | null | undefined>;

export type Template = {
  chave: string;
  assunto: string;
  corpo: string;
  cta: string | null;
  ativo?: boolean;
  /** Endereço do banner do topo. `https://` completo ou caminho iniciando em `/`. */
  banner?: string | null;
  /** O que aparece quando o cliente de e-mail bloqueia a imagem. */
  banner_alt?: string | null;
};

/**
 * A ESPECIFICAÇÃO DO BANNER, num lugar só: a tela mostra estes números ao lado do campo e a
 * montagem usa a largura no atributo `width`.
 *
 * `LARGURA` é a do cartão do e-mail. A arte vai no **dobro** porque tela retina exibe o dobro de
 * pixels por ponto, e imagem na medida exata sai borrada em metade dos aparelhos. A altura é
 * recomendação e não regra: a montagem manda `height:auto`, então proporção diferente funciona, só
 * empurra o texto para baixo.
 */
export const BANNER = {
  larguraExibida: 560,
  larguraArquivo: 1120,
  alturaArquivo: 360,
  /** Recomendação: acima disto a abertura do e-mail começa a pesar em rede ruim. */
  pesoIdealKb: 200,
  /** Limite duro, o mesmo do bucket na migration `0011`. A rota recusa acima daqui. */
  pesoMaximoKb: 500,
} as const;

/**
 * O CONTRATO ENTRE O GATILHO E O TEXTO: qual `{{campo}}` cada template pode usar.
 *
 * Mora em código e não no banco porque quem preenche cada campo é o gatilho, que é código. Com a
 * lista no banco, o editor poderia escrever `{{cidade}}` e o aluno receberia um branco no meio da
 * frase, sem nada reclamando. Aqui, a tela recusa na hora de salvar.
 *
 * `link` não entra em nenhuma lista de propósito: o destino do botão vem do gatilho, nunca do
 * texto. Ver o comentário da migration `0009`.
 */
export const VARIAVEIS: Record<string, string[]> = {
  "boas-vindas": ["nome"],
  "resultado-aprovado": ["nome", "nota", "codigo"],
  "resultado-reprovado": ["nome", "nota"],
};

/**
 * O que cada variável significa e um exemplo do valor. **É a legenda que a tela mostra ao redator.**
 *
 * Existe porque listar `{{nota}}` sem dizer o que ele é obriga quem escreve a adivinhar se vem "82",
 * "82%" ou "oitenta e dois", e a única forma de descobrir era mandar um teste. O exemplo aqui é o
 * mesmo que a pré-visualização usa, então o que a legenda promete é o que a prévia mostra.
 *
 * A descrição é por NOME e não por template, porque `nome` significa a mesma coisa nos três. O
 * `certificado-check`... na verdade o `email-check` é quem garante que nenhuma variável do contrato
 * fique sem descrição: variável documentada pela metade é pior que variável ausente, porque parece
 * pronta.
 */
export const DESCRICOES: Record<string, { texto: string; exemplo: string }> = {
  nome: { texto: "Primeiro nome do aluno. Fica vazio em conta sem nome no cadastro.", exemplo: "Ana" },
  nota: { texto: "Nota da prova em porcentagem, só o número.", exemplo: "82" },
  codigo: {
    texto: "Código de verificação do certificado, único por aluno.",
    exemplo: "EI-K6MC-4RMC",
  },
};

/** Rótulo humano de cada template, para a tela do admin. */
export const ROTULOS: Record<string, string> = {
  "boas-vindas": "Boas-vindas e criação de senha",
  "resultado-aprovado": "Prova aprovada e certificado disponível",
  "resultado-reprovado": "Prova reprovada e caminho da segunda chamada",
};

/** Quando cada um dispara, em uma linha, para ninguém editar às cegas. */
export const GATILHOS: Record<string, string> = {
  "boas-vindas": "Compra aprovada no webhook do Guru, com o link de criação de senha.",
  "resultado-aprovado": "Envio da prova com nota igual ou acima do mínimo.",
  "resultado-reprovado": "Envio da prova com nota abaixo do mínimo.",
};

const MARCADOR = /\{\{\s*([a-z_]+)\s*\}\}/g;

/**
 * As variáveis que o texto usa e a lista não permite. É o que a tela chama antes de salvar: erro no
 * momento da edição, e não um branco na caixa de entrada de alguém.
 */
export function variaveisInvalidas(texto: string, chave: string): string[] {
  const permitidas = VARIAVEIS[chave] ?? [];
  const usadas = [...texto.matchAll(MARCADOR)].map((m) => m[1]);
  return [...new Set(usadas.filter((v) => !permitidas.includes(v)))];
}

/**
 * Troca `{{campo}}` pelo valor. `escapar` liga o escape de HTML, que é obrigatório no corpo e
 * errado no assunto (cabeçalho de e-mail é texto puro, e `&amp;` apareceria literal ali).
 *
 * Campo sem valor vira **string vazia**, nunca `{{campo}}`. Um envio não pode falhar por dado
 * faltando, e mostrar a chave crua ao aluno é pior que mostrar a frase mais curta.
 */
function interpolar(texto: string, dados: Dados, escapar: boolean): string {
  return texto.replace(MARCADOR, (_, campo: string) => {
    const valor = dados[campo];
    if (valor === undefined || valor === null) return "";
    const s = String(valor);
    return escapar ? esc(s) : s;
  });
}

/**
 * Costura o que a variável vazia deixa para trás.
 *
 * O caso real: `{{nome}}, sua matrícula está confirmada.` com a conta sem nome cadastrado sairia
 * como `, sua matrícula está confirmada.` — e isso não é hipótese, o backfill de 28/jul achou 3 das
 * 8 contas do homolog sem nome. Some a vírgula órfã, some o espaço antes de pontuação, e a frase
 * volta a começar com maiúscula.
 */
function limpar(linha: string): string {
  const s = linha
    .replace(/^[\s,;:]+/, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/ {2,}/g, " ")
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Cada linha do editor é um parágrafo. É a regra mais previsível para quem digita numa textarea. */
const paragrafos = (corpo: string) =>
  corpo
    .split(/\n+/)
    .map(limpar)
    .filter(Boolean);

const VERDE = "#0B2D20";
const OURO = "#A98E4E";
const CLARO = "#F7F5F2";
const TEXTO = "#333333";
const BORDA = "#EDE6DD";

/**
 * URL absoluta, ou `null` quando não dá para montar uma.
 *
 * **E-mail não resolve caminho relativo**: a mensagem é aberta fora do nosso domínio, então
 * `/lp/banner.png` chegaria como endereço sem base e não carregaria em lugar nenhum. Caminho
 * começando com `/` é resolvido contra `NEXT_PUBLIC_SITE_URL`; o resto passa direto.
 *
 * Sem a variável de ambiente, devolve `null` e o banner **não sai**. É melhor um e-mail sem banner
 * que um e-mail com imagem quebrada no topo, e a alternativa (emitir o caminho relativo) é
 * exatamente isso, com a agravante de parecer certo no código.
 */
function absoluta(endereco: string): string | null {
  if (!endereco.startsWith("/")) return endereco;
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  return site ? `${site}${endereco}` : null;
}

/**
 * O destino do botão dá para clicar de dentro de uma caixa de entrada?
 *
 * A resposta é não para caminho relativo, pelo mesmo motivo do banner: e-mail é aberto fora do nosso
 * domínio. E isso acontece de um jeito nada teórico — os gatilhos montam o link com
 * `${NEXT_PUBLIC_SITE_URL}/app/certificado`, então **a variável faltando no ambiente transforma o
 * botão num link morto**, sem nada reclamando. É `lib/email.ts` quem usa esta função para recusar o
 * envio; a regra mora aqui porque é aqui que existe check.
 */
export function linkUtilizavel(link: string | number | null | undefined): boolean {
  return typeof link === "string" && /^(https?:\/\/|mailto:)/i.test(link.trim());
}

/**
 * O banner do topo, quando existe.
 *
 * `width` em atributo E em `style`, porque o Outlook lê o atributo e ignora parte do CSS. O `alt`
 * carrega o peso real desta função: com imagem bloqueada, é ele que aparece, e é por isso que a tela
 * o exige. `display:block` mata o vão de 3px que o cliente coloca embaixo de imagem inline.
 */
function bannerHtml(endereco: string, alt: string): string {
  const src = absoluta(endereco);
  if (!src) return "";
  return `<tr><td style="padding:0">
<img src="${esc(src)}" alt="${esc(alt)}" width="${BANNER.larguraExibida}" style="display:block;width:100%;max-width:${BANNER.larguraExibida}px;height:auto;border:0;border-radius:12px 12px 0 0">
</td></tr>`;
}

/**
 * A moldura. Tabelas e estilo inline porque cliente de e-mail não tem cascata confiável, e o
 * Outlook ignora metade do CSS moderno.
 *
 * **A MARCA NÃO DEPENDE DE IMAGEM**, e o banner é opcional por cima disso. Cliente de e-mail bloqueia
 * imagem por padrão, então um cabeçalho que só existe como imagem chega em branco para quem não
 * clica em "exibir": o wordmark em serifada continua sendo o cabeçalho de verdade, e o banner é
 * decoração que some sem levar informação embora. Playfair não existe em caixa de entrada, então a
 * pilha cai para Georgia, que é serifada também.
 *
 * O botão é verde com texto claro, e não dourado com texto branco: `#A98E4E` com branco dá 2,9:1 e
 * não passa AA. O dourado fica onde ele é acento, na régua e no realce.
 */
function moldura(corpoHtml: string, preheader: string, banner: string): string {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Estratégia Internacional</title></head>
<body style="margin:0;padding:0;background:${CLARO}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CLARO};padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid ${BORDA};border-radius:12px">
${banner}<tr><td style="padding:28px 32px 0">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:19px;color:${VERDE}">Estratégia Internacional</div>
<div style="height:2px;width:38px;background:${OURO};margin:12px 0 0"></div>
</td></tr>
<tr><td style="padding:22px 32px 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.65;color:${TEXTO}">
${corpoHtml}
</td></tr>
<tr><td style="padding:18px 32px 28px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;line-height:1.6;color:#8F887E;border-top:1px solid ${BORDA}">
Formação da BlockTrends, com chancela institucional de VEJA Negócios.<br>
Abril Comunicações S.A. · CNPJ 44.597.052/0001-62<br>
Esta mensagem é sobre a sua matrícula, então ela não tem descadastro.
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

/** O botão, em tabela: `<a>` com padding some no Outlook. */
function botao(rotulo: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 6px">
<tr><td align="center" bgcolor="${VERDE}" style="border-radius:8px">
<a href="${esc(url)}" style="display:inline-block;padding:13px 26px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:600;color:${CLARO};text-decoration:none">${esc(rotulo)}</a>
</td></tr></table>
<p style="margin:10px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:1.6;color:#8F887E">Se o botão não abrir, copie este endereço no navegador:<br><span style="color:#7E6836;word-break:break-all">${esc(url)}</span></p>`;
}

export type Renderizado = { assunto: string; html: string; texto: string };

/**
 * O e-mail pronto. `dados.link` é o destino do CTA; sem ele, o botão simplesmente não sai, e o
 * texto continua fazendo sentido — foi por isso que nenhum template depende do botão para explicar
 * o que aconteceu.
 */
export function renderizar(template: Template, dados: Dados): Renderizado {
  const linhas = paragrafos(interpolar(template.corpo, dados, true));
  const link = dados.link ? String(dados.link) : "";
  const cta = template.cta?.trim();

  const html = moldura(
    linhas.map((l) => `<p style="margin:0 0 14px">${l}</p>`).join("\n") +
      (cta && link ? botao(cta, link) : ""),
    // Preheader é a prévia que a caixa de entrada mostra ao lado do assunto. Sem ele, o cliente
    // pesca o primeiro texto do HTML, que aqui seria o wordmark repetido.
    paragrafos(interpolar(template.corpo, dados, false))[0] ?? "",
    // Banner sem alt não sai. Não é preciosismo de acessibilidade: imagem bloqueada com alt vazio
    // deixa uma caixa muda no topo do e-mail, e a tela exige o alt justamente para isto não chegar
    // aqui. Se chegou, o e-mail sai sem banner e continua legível.
    template.banner?.trim() && template.banner_alt?.trim()
      ? bannerHtml(template.banner.trim(), template.banner_alt.trim())
      : "",
  );

  const texto =
    paragrafos(interpolar(template.corpo, dados, false)).join("\n\n") +
    (cta && link ? `\n\n${cta}: ${link}` : "") +
    "\n\nFormação da BlockTrends, com chancela institucional de VEJA Negócios.";

  return {
    // Assunto é cabeçalho: sem escape e sem quebra de linha, senão o cliente trunca ou parte.
    assunto: interpolar(template.assunto, dados, false).replace(/\s+/g, " ").trim(),
    html,
    texto,
  };
}

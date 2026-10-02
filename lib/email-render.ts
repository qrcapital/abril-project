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
  "certificado": ["nome", "codigo"],
  "redefinicao-senha": ["nome"],
  // Desde 02/out/2026. Quem preenche é `lib/avisos-modulo.ts`, a rotina de hora em hora.
  "modulo-liberado": ["nome", "modulo", "titulo", "proximo"],
};

/**
 * O que cada variável significa e um exemplo do valor. **É a legenda que a tela mostra ao redator.**
 *
 * Existe porque listar `{{codigo}}` sem dizer o que ele é obriga quem escreve a adivinhar o formato,
 * e a única forma de descobrir era mandar um teste. O exemplo aqui é o
 * mesmo que a pré-visualização usa, então o que a legenda promete é o que a prévia mostra.
 *
 * A descrição é por NOME e não por template, porque `nome` significa a mesma coisa nos três. O
 * `certificado-check`... na verdade o `email-check` é quem garante que nenhuma variável do contrato
 * fique sem descrição: variável documentada pela metade é pior que variável ausente, porque parece
 * pronta.
 */
export const DESCRICOES: Record<string, { texto: string; exemplo: string }> = {
  nome: { texto: "Primeiro nome do aluno. Fica vazio em conta sem nome no cadastro.", exemplo: "Ana" },
  codigo: {
    texto: "Código de verificação do certificado, único por aluno.",
    exemplo: "EI-K6MC-4RMC",
  },
  modulo: { texto: "Número do módulo que abriu, em algarismo romano.", exemplo: "I" },
  titulo: { texto: "Título do módulo que abriu, como está no admin.", exemplo: "Macro e Estratégia Global" },
  proximo: {
    texto:
      "Frase pronta sobre o que vem depois: a data do próximo módulo, ou o aviso de que este é o último. Calculada pelo calendário do aluno.",
    exemplo: "O Módulo II abre na quarta-feira, 28/10.",
  },
};

/** Rótulo humano de cada template, para a tela do admin. */
export const ROTULOS: Record<string, string> = {
  "boas-vindas": "Boas-vindas e criação de senha",
  "certificado": "Certificado de conclusão disponível",
  "redefinicao-senha": "Redefinição de senha",
  "modulo-liberado": "Módulo liberado",
};

/** Quando cada um dispara, em uma linha, para ninguém editar às cegas. */
export const GATILHOS: Record<string, string> = {
  "boas-vindas": "Compra aprovada no webhook do Guru, com o link de criação de senha.",
  "certificado": "Conclusão da última aula que conta para o certificado, na primeira emissão. Uma vez por aluno.",
  "redefinicao-senha": "Pedido em \"Esqueci minha senha\", com o link de uso único para criar uma senha nova.",
  "modulo-liberado":
    "Rotina de hora em hora: quando um módulo abre no calendário do aluno (o Módulo I em 7 dias, o II em 14, sempre no dia da semana da compra). Uma vez por aluno e módulo; o Módulo 0 não avisa, porque abre junto com as boas-vindas.",
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

/**
 * A PALETA DO E-MAIL, a mesma das telas de acesso (`app/app/_ui/auth.css`): creme, tinta e o
 * vermelho da campanha VEJA Negócios. O verde e o dourado da identidade anterior saíram em
 * 29/set/2026, junto com o resto do produto.
 *
 * Os valores são hex fixos e não variáveis de CSS porque cliente de e-mail não tem cascata
 * confiável. O botão é `#C1121F` com texto creme, e não o contrário: vermelho sobre creme em
 * texto pequeno cansa, e o creme sobre o vermelho dá 5,6:1, acima do AA.
 */
const PAPEL = "#f7f4ee";
const CARTAO = "#fdfbf6";
const BORDA = "#e2dacd";
const TINTA = "#1a1815";
const TINTA_2 = "#6b655c";
const ACENTO = "#C1121F";
const FAIXA = "#8E1522";
const CREME = "#f7f4ee";

const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif";
/**
 * O título sai na Jost, a fonte do wordmark do curso, e não mais em serifa (02/out/2026, a pedido
 * do Marcelo: a serifa de alto contraste "lia como IA"). Cliente que não baixa fonte cai na Futura
 * (Apple) e na Century Gothic (Windows), que têm o mesmo desenho geométrico.
 */
const TITULO = "'Jost','Futura','Century Gothic','Trebuchet MS',Arial,sans-serif";

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
<img src="${esc(src)}" alt="${esc(alt)}" width="${BANNER.larguraExibida}" style="display:block;width:100%;max-width:${BANNER.larguraExibida}px;height:auto;border:0">
</td></tr>`;
}

/**
 * A moldura. Tabelas e estilo inline porque cliente de e-mail não tem cascata confiável, e o
 * Outlook ignora metade do CSS moderno. 600px de teto, que é a largura que todo cliente respeita.
 *
 * **A MARCA NÃO DEPENDE DE IMAGEM.** O cabeçalho é uma faixa vermelha com o lockup em TEXTO, e não
 * o SVG da VEJA Negócios: SVG não abre no Gmail nem no Outlook, e imagem é bloqueada por padrão
 * em boa parte das caixas. Um cabeçalho que só existisse como imagem chegaria em branco. O banner
 * do editor, quando existe, entra logo abaixo da faixa, como decoração que some sem levar
 * informação embora.
 *
 * **MODO ESCURO.** `color-scheme: light only` pede ao cliente que não inverta as cores, e as cores
 * vão também em `bgcolor`, que é o que o Outlook respeita. O Gmail do celular inverte assim mesmo;
 * contra isso, a paleta não usa branco puro nem preto puro, e o texto do botão e da faixa tem o
 * contraste garantido nos dois sentidos.
 *
 * O título é o próprio assunto, na Jost: é a frase que a pessoa acabou de ler na caixa de
 * entrada, e repeti-la no topo confirma que ela abriu o e-mail certo.
 */
function moldura(
  corpoHtml: string,
  preheader: string,
  banner: string,
  titulo: string,
): string {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const linkRodape = (caminho: string, rotulo: string) =>
    site
      ? `<a href="${esc(site + caminho)}" style="color:${TINTA_2};text-decoration:underline">${rotulo}</a>`
      : rotulo;
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(titulo || "Estratégia Internacional")}</title>
<style>@import url(https://fonts.googleapis.com/css2?family=Jost:wght@500&display=swap);</style></head>
<body style="margin:0;padding:0;background:${PAPEL};color-scheme:light only">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${PAPEL}" style="background:${PAPEL};padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" bgcolor="${CARTAO}" style="width:100%;max-width:600px;background:${CARTAO};border:1px solid ${BORDA};border-radius:16px;border-collapse:separate;overflow:hidden">
<tr><td bgcolor="${FAIXA}" style="background:${FAIXA};padding:18px 32px;border-radius:16px 16px 0 0;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:.16em;color:${CREME}">
VEJA NEGÓCIOS&nbsp;&nbsp;|&nbsp;&nbsp;ESTRATÉGIA INTERNACIONAL
</td></tr>
${banner}<tr><td style="padding:30px 32px 0">
<h1 style="margin:0;font-family:${TITULO};font-size:24px;line-height:1.3;font-weight:500;color:${TINTA}">${esc(titulo)}</h1>
</td></tr>
<tr><td style="padding:18px 32px 8px;font-family:${SANS};font-size:15px;line-height:1.65;color:${TINTA}">
${corpoHtml}
</td></tr>
<tr><td style="padding:18px 32px 28px;font-family:${SANS};font-size:12px;line-height:1.7;color:${TINTA_2};border-top:1px solid ${BORDA}">
Powered by BlockTrends · <a href="mailto:contato@blocktrends.com.br" style="color:${TINTA_2};text-decoration:underline">contato@blocktrends.com.br</a><br>
${linkRodape("/privacidade", "Política de Privacidade")} · ${linkRodape("/termos-de-uso", "Termos de Uso")}<br>
Abril Comunicações S.A. · CNPJ 44.597.052/0001-62<br>
Esta mensagem é sobre a sua conta no curso, então ela não tem descadastro.
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

/** O botão, em tabela: `<a>` com padding some no Outlook. */
function botao(rotulo: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 6px">
<tr><td align="center" bgcolor="${ACENTO}" style="background:${ACENTO};border-radius:14px">
<a data-botao href="${esc(url)}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:15px;font-weight:700;color:${CREME};text-decoration:none;border-radius:14px">${esc(rotulo)}</a>
</td></tr></table>
<p style="margin:12px 0 0;font-family:${SANS};font-size:12px;line-height:1.6;color:${TINTA_2}">Se o botão não abrir, copie este endereço no navegador:<br><span style="color:${ACENTO};word-break:break-all">${esc(url)}</span></p>`;
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

  const assunto = interpolar(template.assunto, dados, false).replace(/\s+/g, " ").trim();

  // A assinatura vai DEPOIS do botão. Cada template termina com "Equipe Estratégia Internacional"
  // numa linha própria, e o botão entrava depois dela, como se a assinatura fosse parte do corpo e
  // o botão um apêndice. Só a última linha, e só se ela for a assinatura.
  const assina = linhas.length > 1 && /^Equipe\b/.test(linhas[linhas.length - 1]) ? linhas.pop()! : null;
  const html = moldura(
    linhas.map((l) => `<p style="margin:0 0 14px">${l}</p>`).join("\n") +
      (cta && link ? botao(cta, link) : "") +
      (assina ? `<p style="margin:22px 0 0">${assina}</p>` : ""),
    // Preheader é a prévia que a caixa de entrada mostra ao lado do assunto. Sem ele, o cliente
    // pesca o primeiro texto do HTML, que aqui seria o wordmark repetido.
    paragrafos(interpolar(template.corpo, dados, false))[0] ?? "",
    // Banner sem alt não sai. Não é preciosismo de acessibilidade: imagem bloqueada com alt vazio
    // deixa uma caixa muda no topo do e-mail, e a tela exige o alt justamente para isto não chegar
    // aqui. Se chegou, o e-mail sai sem banner e continua legível.
    template.banner?.trim() && template.banner_alt?.trim()
      ? bannerHtml(template.banner.trim(), template.banner_alt.trim())
      : "",
    assunto,
  );

  const texto =
    paragrafos(interpolar(template.corpo, dados, false)).join("\n\n") +
    (cta && link ? `\n\n${cta}: ${link}` : "") +
    "\n\nVEJA Negócios | Estratégia Internacional\nPowered by BlockTrends · contato@blocktrends.com.br";

  // Assunto é cabeçalho: sem escape e sem quebra de linha, senão o cliente trunca ou parte.
  return { assunto, html, texto };
}

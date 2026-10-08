// Glossário do curso e linha do tempo da home (07/out/2026).
//
// Inspirados na Educação do site da QR Asset (qrasset-site: lib/eduData.js e components/Educacao.jsx),
// sem nada de fundos ou produtos da QR: aqui o assunto é o do curso. O conteúdo mora em
// `content/glossario/*.ts` (verbetes, um arquivo por bloco de categorias) e
// `content/linha-do-tempo.ts` (marcos). Este arquivo só define os tipos, as categorias e os
// utilitários; quem junta e valida é `content/glossario/index.ts`.
//
// Tom: o mesmo do notebook (`docs/TOM-DO-NOTEBOOK.md`): conversa inteligente, exemplo antes do
// conceito, sem fórmula quando der, sem academicismo, sem travessão.

/** Categorias do glossário, na ordem em que aparecem nos filtros. */
export const CATEGORIAS_GLOSSARIO = [
  "Câmbio e moeda",
  "Juros e inflação",
  "Renda fixa",
  "Ações",
  "Fundos e ETFs",
  "Carteira e risco",
  "Comportamento",
  "Macro e contas públicas",
  "História do Brasil",
  "Acesso, contas e impostos",
  "Cripto e tecnologia",
] as const;
export type CategoriaGlossario = (typeof CATEGORIAS_GLOSSARIO)[number];

export type Verbete = {
  /** Identificador estável e URL: /app/glossario/<slug>. Minúsculas, sem acento, com hífen. */
  slug: string;
  /** Como o termo aparece no título do verbete ("Paridade do poder de compra"). */
  termo: string;
  /** Sigla ou nome curto, se houver ("PPC"). Aparece ao lado do termo. */
  sigla?: string;
  categoria: CategoriaGlossario;
  /**
   * Formas pelas quais o termo aparece no texto do notebook, para o link automático. O `termo` e a
   * `sigla` já entram; aqui vão plurais, variações e sinônimos ("paridade de poder de compra",
   * "PPC"). Sem acento não precisa: a busca já ignora acento e caixa.
   */
  apelidos?: string[];
  /** Uma ou duas frases: é o que aparece no balão ao passar o mouse sobre o link no notebook. */
  resumo: string;
  /** O verbete completo, em parágrafos curtos, no tom do curso. */
  texto: string[];
  /**
   * O verbete como artigo (07/out/2026, pedido do Marcelo: "as explicações estão curtas"): seções
   * com intertítulo depois da abertura em `texto`, no estilo dos artigos da linha do tempo da QR
   * Asset ("De onde vem", "Como funciona", "Por que importa para quem investe", "Erros comuns").
   */
  secoes?: { titulo: string; paragrafos: string[] }[];
  /** Um exemplo concreto, com números redondos quando couber. */
  exemplo?: string;
  /** O que isso muda para quem pensa em dolarizar parte do patrimônio. */
  naPratica?: string;
  /** Slugs de outros verbetes. Slug que não existir é ignorado (e acusado no check). */
  relacionados?: string[];
  /** Onde o assunto aparece no curso: módulo (ord, 0 = Módulo I) e aula (posição no módulo). */
  noCurso?: { modulo: number; aula: number; tempo?: string }[];
};

export const CATEGORIAS_LINHA = [
  "Dinheiro e dólar",
  "Brasil",
  "Crises",
  "Investimentos",
  "Tecnologia e internet",
  "Inteligência artificial",
  "Cripto",
] as const;
export type CategoriaLinha = (typeof CATEGORIAS_LINHA)[number];

export type Marco = {
  /** Identificador estável ("1971-fim-do-padrao-ouro"). */
  slug: string;
  /**
   * Ano para o eixo ("1971"); `data` dá o detalhe quando houver ("15 de agosto de 1971"). Antes de
   * Cristo, ano negativo (-600 aparece como "600 a.C.", ver `rotuloDoAno`).
   */
  ano: number;
  /**
   * O ano como aparece na lista quando o número sozinho promete uma precisão que não existe
   * ("séc. III", "Antes da moeda"). O `ano` continua valendo para ordenar e para a régua.
   * Desde 08/out/2026, com a pré-história do dinheiro.
   */
  anoRotulo?: string;
  data?: string;
  categoria: CategoriaLinha;
  titulo: string;
  /** Uma ou duas frases, o que aparece no cartão fechado. */
  resumo: string;
  /** Até três parágrafos curtos, o que aparece ao abrir o marco: o que foi e por que importa aqui. */
  texto?: string[];
  /** Verbetes do glossário ligados ao marco (slugs). */
  verbetes?: string[];
  /**
   * Marcos anteriores que levam a este (slugs). É a "linhagem" que a linha do tempo desenha ao
   * passar o mouse, como no site da QR Asset: o fio que liga, por exemplo, Bretton Woods ao fim do
   * padrão-ouro e ao Plano Real.
   */
  antecedentes?: string[];
  /** Aula do curso em que o assunto aparece. */
  noCurso?: { modulo: number; aula: number; tempo?: string };
  /** Fonte curta do fato (instituição, documento). */
  fonte?: string;
};

/** Normaliza para comparação: sem acento, minúsculas, espaços simples. */
export const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

/** Slug a partir de um texto qualquer. */
export const slugificar = (s: string) =>
  normalizar(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const urlDoVerbete = (slug: string) => `/app/glossario/${slug}`;

// ---- utilitários das telas (07/out/2026) ------------------------------------------------------
// Moram aqui, e não nos componentes, porque o `scripts/glossario-check.mts` e o cliente (a busca
// do glossário e a linha do tempo da home) usam os mesmos, e este arquivo não importa nada.

/** A letra do índice A a Z: a inicial do termo sem acento, ou "#" para número e símbolo. */
export const letraDe = (termo: string) => {
  const c = normalizar(termo).charAt(0).toUpperCase();
  return c >= "A" && c <= "Z" ? c : "#";
};

/**
 * "12:34" ou "1:02:03" em segundos, para o `&t=` do link da aula. Cópia mínima de `segundos()` de
 * `lib/notebook.ts`, que este arquivo não importa para continuar sem dependência.
 */
const segundosDe = (tempo?: string): number | null => {
  const m = /^(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d)$/.exec((tempo ?? "").trim());
  return m ? Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]) : null;
};

/**
 * O endereço de uma aula do curso a partir do `noCurso` de um verbete ou marco. Com tempo, o
 * mesmo formato do "Na aula, 12:34" do notebook (`NaAula.tsx`): o player nasce no ponto. Sem
 * tempo, o da playlist (`href()` de `lib/curso.ts`), que desce até a seção da aula no notebook.
 */
export const hrefNoCurso = (n: { modulo: number; aula: number; tempo?: string }) => {
  const s = segundosDe(n.tempo);
  return s !== null
    ? `/app/modulo/${n.modulo}?aula=${n.aula}&t=${s}#player`
    : `/app/modulo/${n.modulo}?aula=${n.aula}#aula-${n.aula}`;
};

/** "Módulo II · Aula 03", sem depender de `lib/curso.ts` (que o cliente não importa). */
export const rotuloNoCurso = (n: { modulo: number; aula: number; tempo?: string }) =>
  `Módulo ${["I", "II", "III", "IV"][n.modulo] ?? n.modulo + 1} · Aula ${String(n.aula).padStart(2, "0")}` +
  (segundosDe(n.tempo) !== null ? ` · ${n.tempo}` : "");

/**
 * As cores das categorias da linha do tempo. Revistas em 08/out/2026: a primeira paleta tinha um
 * azul e um roxo vivos demais ao lado do papel. Agora são sete tons de tinta envelhecida, todos na
 * mesma altura de valor: ouro velho (a casa), musgo, vinho (as crises, o único que puxa para o
 * vermelho), ardósia, grafite, ameixa e cobre. A cor aparece no fio da borda dos chips, no anel do
 * marco, no rótulo da categoria e, desde a tarde de 08/out/2026, de novo nos pontos da régua do topo
 * (o único lugar com bolinha cheia). Todos passam de 5,5:1 sobre o
 * papel (#f7f4ee) e sobre o creme (#fdfbf6), porque pintam texto pequeno e servem de fundo para o
 * texto creme do chip ativo.
 */
export const COR_DA_LINHA: Record<CategoriaLinha, string> = {
  "Dinheiro e dólar": "#745d2d",
  Brasil: "#4c5d3b",
  Crises: "#962029",
  Investimentos: "#3d5263",
  "Tecnologia e internet": "#57534c",
  "Inteligência artificial": "#66465e",
  Cripto: "#8e4f28",
};

/**
 * As eras da linha do tempo da home: dão ritmo à lista e marcam a régua de anos. O ano de corte é o
 * último ano da era. Era sem marco não aparece.
 *
 * A pré-história do dinheiro (08/out/2026, pedido do Marcelo: "desde a moeda commodity até o
 * dólar, sem se aprofundar muito") vai de antes de 3000 a.C. a 1791. São milênios com poucos
 * marcos: numa escala de anos, eles virariam um borrão num canto da régua. Por isso `porOrdem`: na
 * régua, os marcos dessa era ficam a intervalos iguais, na ordem do tempo, e a faixa dela é
 * proporcional ao número de marcos, como a das outras.
 */
export const ERAS: { ate: number; faixa: string; nome: string; porOrdem?: boolean }[] = [
  { ate: 1791, faixa: "Antes de 1792", nome: "A pré-história do dinheiro", porOrdem: true },
  { ate: 1943, faixa: "1792 a 1943", nome: "O dólar antes de Bretton Woods" },
  { ate: 1970, faixa: "1944 a 1970", nome: "O mundo de Bretton Woods" },
  { ate: 1993, faixa: "1971 a 1993", nome: "Moeda solta, inflação e dívida" },
  { ate: 2007, faixa: "1994 a 2007", nome: "Real, internet e globalização" },
  { ate: 2019, faixa: "2008 a 2019", nome: "Crise, juro zero e cripto" },
  { ate: Infinity, faixa: "2020 em diante", nome: "Pandemia, juros altos e IA" },
];

export const eraDe = (ano: number) => ERAS.findIndex((e) => ano <= e.ate);

/**
 * O ano de um marco como o aluno lê (08/out/2026): o `anoRotulo` quando houver, "600 a.C." para ano
 * negativo e o número puro para o resto.
 */
export const rotuloDoAno = (m: { ano: number; anoRotulo?: string }) =>
  m.anoRotulo ?? (m.ano < 0 ? `${-m.ano} a.C.` : String(m.ano));

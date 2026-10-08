// O notebook de um módulo: conteúdo visual derivado das aulas (gráficos, texto longo,
// simuladores), e não um caderno de anotações do aluno. Nasceu em 29/set/2026 a pedido do dono,
// que quer alimentá-lo depois com referências de livros de macro, micro e finanças.
//
// POR QUE ARQUIVO E NÃO BANCO. O currículo mora no banco porque o admin edita título e vídeo
// pelo painel. O notebook tem forma (blocos tipados, séries de gráfico, parâmetros de simulador)
// que um formulário de admin não edita bem, e o conteúdo ainda está sendo desenhado. Arquivo
// tipado dá erro de build quando um bloco sai torto, e o dia em que houver tela de edição a
// migração é trocar o `carregar` de `content/notebooks/index.ts` por uma consulta.
//
// Puro, sem import: os arquivos de `content/notebooks/`, os componentes da sala e o
// `scripts/notebook-check.mts` (node puro) importam os tipos e as contas daqui.
//
// O GUIA DE AUTORIA É `docs/NOTEBOOK.md`: um exemplo mínimo de cada bloco e as regras visuais.
// Bloco novo entra aqui (tipo), em `validarNotebook` (o que o tipo não pega), no renderizador
// (`app/app/_ui/sala/NotebookModulo.tsx`) e no guia, nessa ordem.

// ---- formatação de números ----------------------------------------------------------------

/**
 * Formatos prontos, para o autor não montar prefixo e casas à mão em cada gráfico:
 * `pct` 12,5% · `pp` 1,5 p.p. · `brl` R$ 5,15 · `usd` US$ 1,08 · `indice` 100 · `multiplo` 5,5× ·
 * `numero` 1.234.
 */
export type FormatoNome = "pct" | "pp" | "brl" | "usd" | "indice" | "multiplo" | "numero";

/** Formatação de um número. `base` parte de um formato pronto e o resto ajusta por cima. */
export type Formato = {
  base?: FormatoNome;
  prefixo?: string;
  sufixo?: string;
  casas?: number;
  /** 1.200.000 vira "1,2 mi"; 3.400.000.000 vira "3,4 bi". Para eixo de valores grandes. */
  compacto?: boolean;
  /** Escreve o "+" nos positivos. Para variação. */
  sinal?: boolean;
};

/** Onde o conteúdo aceita formato: o nome de um pronto ou o objeto. */
export type FormatoDe = Formato | FormatoNome;

const PRONTOS: Record<FormatoNome, Formato> = {
  pct: { sufixo: "%", casas: 1 },
  pp: { sufixo: " p.p.", casas: 1 },
  brl: { prefixo: "R$ ", casas: 2 },
  usd: { prefixo: "US$ ", casas: 2 },
  indice: { casas: 0 },
  multiplo: { sufixo: "×", casas: 1 },
  numero: { casas: 0 },
};

/** O formato final, com o pronto aplicado por baixo do que o autor ajustou. */
export function resolverFormato(f?: FormatoDe): Formato {
  if (!f) return {};
  if (typeof f === "string") return { ...PRONTOS[f] };
  const base = f.base ? PRONTOS[f.base] : {};
  return { ...base, ...f };
}

/**
 * Formata um número pt-BR com prefixo, sufixo e casas. O negativo sai com o sinal de menos
 * tipográfico (−) antes do prefixo: "−R$ 1,20", e não "R$ -1,20".
 */
export function formatar(v: number, formato?: FormatoDe): string {
  const f = resolverFormato(formato);
  if (!Number.isFinite(v)) return "n/d";
  let abs = Math.abs(v);
  let escala = "";
  let casas = f.casas ?? 0;
  if (f.compacto) {
    if (abs >= 1e9) [abs, escala] = [abs / 1e9, " bi"];
    else if (abs >= 1e6) [abs, escala] = [abs / 1e6, " mi"];
    else if (abs >= 1e4) [abs, escala] = [abs / 1e3, " mil"];
    if (escala) casas = abs >= 100 ? 0 : 1;
  }
  const num = abs.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  // Zero arredondado não leva sinal: "−0,0%" é ruído.
  const zero = Number(abs.toFixed(casas)) === 0;
  const sinal = v < 0 && !zero ? "−" : f.sinal && v > 0 && !zero ? "+" : "";
  // Espaço inseparável entre o número e a moeda ou a unidade (08/out/2026): a quebra de linha
  // separava "R$" de "5,15" e "2,0" de "p.p." nas notas estreitas do simulador e da tabela.
  const colar = (t?: string) => (t ?? "").replace(/ /g, "\u00a0");
  return `${sinal}${colar(f.prefixo)}${num}${colar(escala)}${colar(f.sufixo)}`;
}

/**
 * O mesmo espaço inseparável no texto escrito à mão (08/out/2026): "R$ 5,15", "US$ 1,57 tri",
 * "2,0 p.p." e "13,75% a.a." não quebram no meio. Vale no texto corrido, nas notas e nas legendas.
 */
export function colarNumeros(texto: string): string {
  return texto
    .replace(/(R\$|US\$|€|£)\s(?=[\d−-])/g, "$1\u00a0")
    .replace(/(\d%?)\s(p\.p\.|a\.a\.|tri|bi|mi)(?=[\s.,;:)]|$)/g, "$1\u00a0$2");
}

// ---- origem: fonte ou ilustrativo --------------------------------------------------------------

/**
 * TODO gráfico e infográfico diz de onde vêm os números (decisão do dono, 01/out/2026). A tela
 * escreve, em cinza e sob a figura, "Fonte: ..." ou "Ilustrativo: ...". O tipo obriga: sem
 * `fonte`, só compila com `ilustrativo: true`.
 *
 * - `fonte`: quem publicou o dado e qual série ("Banco Central do Brasil, série 3698").
 * - `ilustrativo`: número de exemplo, conta sobre hipótese. A `fonte` passa a ser opcional e,
 *   se vier, diz a base da hipótese ("hipóteses do autor", "conta sobre a regra de Taylor").
 * - `nota`: premissas, unidade, recorte. Vai na mesma linha, depois da fonte.
 */
export type Origem =
  | { fonte: string; ilustrativo?: false; nota?: string }
  | { ilustrativo: true; fonte?: string; nota?: string };

// ---- séries e gráficos ---------------------------------------------------------------------------

/**
 * Cor de uma série pelo PAPEL, não pelo hex: `acento` é o vermelho da casa e vai na série que o
 * texto discute; as outras saem em cinzas quentes. Sem `cor`, a série com `destaque` (ou a
 * primeira, se nenhuma tiver) é a vermelha e as demais seguem a escala de cinza.
 * `positivo`/`negativo` só onde o sinal do dado é a informação.
 */
export type CorSerie = "acento" | "tinta" | "cinza" | "cinzaClaro" | "cinzaPalido" | "ouro" | "positivo" | "negativo";

export type Serie = {
  nome: string;
  /** Um valor por ponto do eixo X. `null` é lacuna (a linha interrompe). */
  valores: (number | null)[];
  destaque?: boolean;
  cor?: CorSerie;
};

export type FormaGrafico = "linha" | "area" | "barra" | "barraEmpilhada" | "inclinacao";

/** Um ponto do eixo X: o rótulo exato (como está em `eixoX`) ou o índice, a partir de 0. */
export type PontoX = string | number;

/** Linha vertical com rótulo num ponto do eixo X ("Plano Real", "Crise de 2008"). */
export type Marco = { em: PontoX; rotulo: string };

/** Período sombreado entre dois pontos do eixo X (recessão, mandato, choque). */
export type Faixa = { de: PontoX; ate: PontoX; rotulo?: string };

// ---- blocos ---------------------------------------------------------------------------------------

// A FORMA MUDOU EM 30/SET/2026. Era um notebook por módulo com uma lista corrida de blocos, cada
// bloco apontando para a aula de origem por um `aula?` opcional, e morava numa página à parte
// (`/app/modulo/[m]/notebook`). Agora ele é UM documento longo dentro da página do módulo, dividido
// em uma seção por aula (`aulas[]`), e a seção é a âncora que a playlist usa (`#aula-<n>`).
//
// A PALETA CRESCEU EM 01/OUT/2026 (kpis, comparativo, linhaDoTempo, fluxo, matriz, simulador,
// conceito), antes de os módulos receberem conteúdo definitivo. Os tipos antigos continuam.

export type BlocoGrafico = {
  tipo: "grafico";
  titulo: string;
  /** Uma linha sob o título: o que é medido e em que unidade ("R$ por US$, média mensal"). */
  subtitulo?: string;
  /**
   * `linha`, `area`, `barra` (agrupada se houver mais de uma série), `barraEmpilhada` e
   * `inclinacao` (slope chart: dois pontos no eixo X, um "antes e depois" por série).
   */
  forma: FormaGrafico;
  /** Rótulos do eixo X, um por ponto de cada série. */
  eixoX: string[];
  series: Serie[];
  formato?: FormatoDe;
  /** `log` para séries que multiplicam (câmbio desde 1994, preços em décadas). Só valores > 0. */
  escala?: "linear" | "log";
  marcos?: Marco[];
  faixas?: Faixa[];
  /** Linha horizontal de referência (meta de inflação, paridade, 100 = base do índice). */
  referencia?: { valor: number; rotulo: string };
} & Origem;

export type Kpi = {
  /** O que o número é, em uma linha curta ("Dólar em 12 meses"). */
  rotulo: string;
  valor: number;
  formato?: FormatoDe;
  /**
   * Variação ao lado do número. `bom` diz qual sentido é favorável e decide a cor (verde ou
   * vermelho); sem ele a variação sai neutra, só com o sinal.
   */
  variacao?: { valor: number; formato?: FormatoDe; rotulo?: string; bom?: "sobe" | "desce" };
  /** O número em vermelho. Um por bloco, no máximo. */
  destaque?: boolean;
  /** Data ou recorte do número ("set/2026", "média 2015 a 2024"). */
  nota?: string;
};

export type OpcaoComparativo = { nome: string; resumo?: string; destaque?: boolean };
export type MetricaComparativo = {
  rotulo: string;
  /** Um valor por opção, na mesma ordem de `opcoes`. */
  valores: number[];
  formato?: FormatoDe;
  /** Qual extremo é o melhor nesta métrica. Marca o vencedor da linha. */
  melhor?: "maior" | "menor";
};

export type EventoTempo = {
  /** O rótulo de data que aparece no cartão ("jul/1994", "2008"). */
  data: string;
  titulo: string;
  /** Uma linha. */
  texto?: string;
  /**
   * O ponto da série que o evento marca: rótulo exato de `serie.eixoX` ou índice. Sem isto,
   * a tela procura `data` no eixo da série.
   */
  em?: PontoX;
};

export type NoFluxo = {
  titulo: string;
  /** Uma linha. */
  texto?: string;
  /** Seta de sentido ao lado do título: o que acontece com esta variável na cadeia. */
  sentido?: "sobe" | "desce";
};

export type CelulaMatriz = {
  /** Payoff: (jogador das linhas, jogador das colunas). */
  valores?: [number, number];
  /** Quadrante: o texto da célula. Pode vir junto com `valores`. */
  texto?: string;
  /** Aparece no painel abaixo da matriz quando o aluno passa o mouse ou foca a célula. */
  explicacao?: string;
  /** Destaca a célula com este rótulo ("Equilíbrio de Nash", "Onde a maioria está"). */
  marca?: string;
};

/** Um controle do simulador. Tudo opcional: o que faltar vem do padrão do modelo. */
export type Parametro = {
  valor?: number;
  min?: number;
  max?: number;
  passo?: number;
  rotulo?: string;
  ajuda?: string;
  /** Não vira controle: entra como premissa declarada, em texto. */
  fixo?: boolean;
};

/** Os modelos do simulador e as chaves de parâmetro de cada um. */
export const CHAVES_MODELO = {
  dividaPib: ["divida", "juros", "crescimento", "primario", "anos"],
  diversificacao: ["fatia", "volBrasil", "volExterior", "correlacao"],
  cambioPatrimonio: ["patrimonio", "cambio", "depreciacao", "anos", "fatia"],
  jurosCompostos: ["inicial", "aporte", "fatia", "taxaBrl", "taxaUsd", "cambio", "depreciacao", "anos"],
  poderDeCompra: ["depreciacao", "anos", "fatia"],
} as const;

export type ModeloSimulador = keyof typeof CHAVES_MODELO;
export type ChaveDe<M extends ModeloSimulador> = (typeof CHAVES_MODELO)[M][number];
type ParametrosDe<M extends ModeloSimulador> = Partial<Record<ChaveDe<M>, Parametro>>;

export type BlocoSimulador = {
  tipo: "simulador";
  /** Âncora do simulador. */
  id: string;
  titulo: string;
  descricao?: string;
  /** Substitui o aviso padrão do modelo (o que a conta ignora). */
  aviso?: string;
} & (
  | { modelo: "dividaPib"; parametros?: ParametrosDe<"dividaPib"> }
  | { modelo: "diversificacao"; parametros?: ParametrosDe<"diversificacao"> }
  | { modelo: "cambioPatrimonio"; parametros?: ParametrosDe<"cambioPatrimonio"> }
  | { modelo: "jurosCompostos"; parametros?: ParametrosDe<"jurosCompostos"> }
  | { modelo: "poderDeCompra"; parametros?: ParametrosDe<"poderDeCompra"> }
);

type BlocoSemTempo =
  | {
      /**
       * Subtítulo DENTRO da seção de uma aula, para aula longa que pede divisão. A seção da aula já
       * tem título próprio, então este não aparece no índice lateral.
       */
      tipo: "capitulo";
      /** Âncora. Só letras minúsculas, números e hífen, e sem começar por `aula-` (reservado). */
      id: string;
      titulo: string;
      resumo?: string;
    }
  | {
      tipo: "texto";
      paragrafos: string[];
      /** O primeiro parágrafo sai como abertura, um corpo acima. (Era capitular até 01/out.) */
      capitular?: boolean;
    }
  | { tipo: "destaque"; texto: string; fonte?: string }
  | { tipo: "numero"; valor: string; legenda: string; nota?: string }
  | BlocoGrafico
  | ({ tipo: "kpis"; titulo?: string; itens: Kpi[] } & Origem)
  | ({
      tipo: "comparativo";
      titulo: string;
      subtitulo?: string;
      /** Duas ou três colunas. */
      opcoes: OpcaoComparativo[];
      metricas: MetricaComparativo[];
    } & Origem)
  | ({
      tipo: "linhaDoTempo";
      titulo: string;
      subtitulo?: string;
      eventos: EventoTempo[];
      /** Série desenhada atrás dos eventos (câmbio, juros). O evento acende o ponto dele. */
      serie?: { nome: string; eixoX: string[]; valores: (number | null)[]; formato?: FormatoDe; escala?: "linear" | "log" };
    } & Origem)
  | ({
      tipo: "fluxo";
      titulo?: string;
      subtitulo?: string;
      /** De 3 a 6 etapas, na ordem da cadeia. */
      nos: NoFluxo[];
      /** Rótulo de cada seta, entre um nó e o seguinte (tamanho = nós − 1). */
      ligacoes?: string[];
    } & Origem)
  | ({
      tipo: "matriz";
      titulo: string;
      subtitulo?: string;
      /** `payoff` (teoria dos jogos, pares de números) ou `quadrante` (risco e retorno, texto). */
      modo: "payoff" | "quadrante";
      /** Quem escolhe nas linhas e nas colunas ("Banco Central", "Mercado"), ou o eixo. */
      eixoLinhas: string;
      eixoColunas: string;
      linhas: [string, string];
      colunas: [string, string];
      celulas: [[CelulaMatriz, CelulaMatriz], [CelulaMatriz, CelulaMatriz]];
      formato?: FormatoDe;
    } & Origem)
  | BlocoSimulador
  | ({
      /** Simulador antigo, mantido para os notebooks de demonstração. Para conteúdo novo, `simulador`. */
      tipo: "comparador";
      id: string;
      titulo: string;
      descricao?: string;
    } & (
      | {
          modelo: "diversificacao";
          hipoteses: { volBrasil: number; volExterior: number; correlacao: number; fatia: number };
        }
      | {
          modelo: "cambio";
          hipoteses: { depreciacao: number; anos: number; fatia: number };
        }
    ))
  | {
      /** A ponte entre a teoria e a decisão: termo, definição rigorosa, prática e de onde vem. */
      tipo: "conceito";
      termo: string;
      definicao: string;
      naPratica: string;
      /** Fórmula em uma linha, opcional ("d' = d(1 + r)/(1 + g) − s"). */
      formula?: string;
      referencia?: { autor: string; obra: string; capitulo?: string; ano?: number };
    }
  | { tipo: "tabela"; titulo?: string; colunas: string[]; linhas: string[][]; nota?: string; fonte?: string }
  | {
      tipo: "referencias";
      itens: { autor: string; titulo: string; ano: number; nota?: string }[];
    };

/**
 * Um bloco do notebook. Todo bloco aceita `tempo` ("12:34" ou "1:02:03"): o momento da aula em
 * que o assunto aparece. A tela escreve "Na aula, 12:34" e o clique leva o player até lá.
 */
export type Bloco = BlocoSemTempo & { tempo?: string };

export type TipoBloco = Bloco["tipo"];

/** O conteúdo de UMA aula dentro do notebook do módulo. */
export type SecaoDaAula = {
  /**
   * A posição da aula DENTRO do módulo, a partir de 1: a mesma do `?aula=` da URL e do "Aula 3" da
   * playlist (`Aula.pos` em `lib/curso.ts`). Não é o número global da aula.
   */
  aula: number;
  blocos: Bloco[];
};

export type Notebook = {
  /** `ord` do módulo. */
  modulo: number;
  titulo: string;
  subtitulo: string;
  /**
   * Conteúdo de demonstração: a tela mostra o selo até o dono trocar pelo definitivo. Tirar o
   * selo é mudar para `false`, nada mais.
   */
  demo: boolean;
  /**
   * Uma seção por aula, em qualquer ordem (a tela ordena pela posição). Aula sem seção aqui aparece
   * no notebook com o aviso de conteúdo em produção, e seção de uma aula que não existe no banco
   * não aparece: o título da seção vem do banco, e não haveria o que escrever nele.
   */
  aulas: SecaoDaAula[];
  /**
   * Quem dá cada aula, pela posição dela no módulo (`{ 3: "Rodolfo Bastos" }`). Opcional. Nasceu em
   * 07/out/2026 porque o Módulo I tem dois docentes num campo só do banco (`modules.docente`), e a
   * cabeça da aula 3 mostrava os dois, embora só o Rodolfo apareça nela. Aula fora deste mapa, ou
   * notebook sem ele, cai nos docentes do módulo, como antes. O nome passa por `lib/docentes.ts`,
   * que acha foto e credencial.
   */
  docentePorAula?: Record<number, string>;
};

/** A âncora da seção de uma aula no notebook. Um lugar só, porque a playlist e o índice usam. */
export const ancoraDaAula = (pos: number) => `aula-${pos}`;

/** A seção de uma aula, ou `null` quando o notebook ainda não tem conteúdo para ela. */
export function secaoDaAula(nb: Notebook | null, pos: number): SecaoDaAula | null {
  return nb?.aulas.find((s) => s.aula === pos && s.blocos.length > 0) ?? null;
}

// ---- tempo da aula ----------------------------------------------------------------------------

const TEMPO = /^(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d)$/;

/** "12:34" → 754; "1:02:03" → 3723. `null` se o texto não for um tempo. */
export function segundos(tempo: string): number | null {
  const m = TEMPO.exec(tempo.trim());
  if (!m) return null;
  return Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/** O `?t=` da URL, saneado: inteiro de 0 a 6 horas, ou `null`. Vai parar no src do player. */
export function segundosDaUrl(v: string | string[] | undefined): number | null {
  const s = Array.isArray(v) ? v[0] : v;
  if (!s || !/^\d{1,5}$/.test(s)) return null;
  const n = Number(s);
  return n > 0 && n <= 6 * 3600 ? n : null;
}

/** O índice de um ponto do eixo X, pelo rótulo ou pelo número. `-1` se não existir. */
export function indiceX(eixoX: string[], em: PontoX): number {
  if (typeof em === "number") return Number.isInteger(em) && em >= 0 && em < eixoX.length ? em : -1;
  return eixoX.indexOf(em);
}

// ---- contas dos simuladores e dos gráficos ------------------------------------------------------
// Moram aqui, e não no componente, porque os arquivos de conteúdo usam as mesmas contas para
// montar séries: um gráfico e um simulador da mesma página não podem discordar da aritmética.
// E porque aqui o `npm run check` alcança (`scripts/notebook-check.mts`).

/**
 * Volatilidade anual (em %) de uma carteira com duas partes, pela fórmula de Markowitz:
 * σ = √(w²σ₁² + (1 − w)²σ₂² + 2w(1 − w)ρσ₁σ₂). `fatia` é a parte no exterior, de 0 a 1; as
 * volatilidades entram em %.
 */
export function volatilidadeCarteira(fatia: number, volBrasil: number, volExterior: number, correlacao: number): number {
  const a = (1 - fatia) * volBrasil;
  const b = fatia * volExterior;
  return Math.sqrt(Math.max(0, a * a + b * b + 2 * a * b * correlacao));
}

/** A fatia no exterior (0 a 100, de 1 em 1) que minimiza a volatilidade da carteira. */
export function fatiaDeMenorVolatilidade(volBrasil: number, volExterior: number, correlacao: number): number {
  let melhor = 0;
  let menor = Infinity;
  for (let p = 0; p <= 100; p++) {
    const v = volatilidadeCarteira(p / 100, volBrasil, volExterior, correlacao);
    if (v < menor - 1e-9) [menor, melhor] = [v, p];
  }
  return melhor;
}

/**
 * Quanto sobra do poder de compra em dólar (início = 100) depois de `anos`, com o real perdendo
 * `depreciacao`% ao ano e `fatia` (0 a 1) da carteira já em dólar. Sem rendimento, imposto ou
 * custo: é a conta do câmbio isolada, e a tela diz isso.
 */
export function poderDeCompra(fatia: number, depreciacao: number, anos: number): number {
  return 100 * ((1 - fatia) * Math.pow(1 - depreciacao / 100, anos) + fatia);
}

/** Capital `base` a `taxa`% ao ano, em cada um dos `anos`. */
export function composto(base: number, taxa: number, anos: number[]): number[] {
  return anos.map((t) => Math.round(base * Math.pow(1 + taxa / 100, t)));
}

/**
 * Trajetória da dívida pública em % do PIB: d(t+1) = d(t) × (1 + r)/(1 + g) − s, com `juros` (r) e
 * `crescimento` (g) em % ao ano, na mesma base (os dois reais ou os dois nominais), e o resultado
 * `primario` (s) em % do PIB, positivo quando é superávit. Devolve `anos + 1` pontos, do hoje ao fim.
 */
export function trajetoriaDivida(divida: number, juros: number, crescimento: number, primario: number, anos: number): number[] {
  const fator = (1 + juros / 100) / (1 + crescimento / 100);
  const d = [divida];
  for (let t = 1; t <= anos; t++) d.push(d[t - 1] * fator - primario);
  return d;
}

/** O primário (% do PIB) que mantém a dívida parada: s* = d × (r − g)/(1 + g). */
export function primarioQueEstabiliza(divida: number, juros: number, crescimento: number): number {
  return (divida * (juros - crescimento)) / (100 + crescimento);
}

/**
 * Um patrimônio em reais medido em dólar, com o real perdendo `depreciacao`% ao ano contra o
 * dólar a partir de `cambio` (R$ por US$) e `fatia` (0 a 1) convertida hoje. Sem rendimento: só o
 * câmbio. Uma posição por ano, de 0 a `anos`.
 */
export function cambioPatrimonio(patrimonio: number, cambio: number, depreciacao: number, anos: number, fatia: number) {
  const taxa: number[] = [];
  const usdTudoReais: number[] = [];
  const usdComFatia: number[] = [];
  const brlComFatia: number[] = [];
  for (let t = 0; t <= anos; t++) {
    const c = cambio * Math.pow(1 + depreciacao / 100, t);
    taxa.push(c);
    usdTudoReais.push(patrimonio / c);
    usdComFatia.push((patrimonio * fatia) / cambio + (patrimonio * (1 - fatia)) / c);
    brlComFatia.push(patrimonio * fatia * (c / cambio) + patrimonio * (1 - fatia));
  }
  return { taxa, usdTudoReais, usdComFatia, brlComFatia };
}

/**
 * Juros compostos em duas moedas, com aporte. O `inicial` e o `aporte` mensal entram em reais e
 * `fatia` (0 a 1) de cada um vira dólar ao câmbio do ano. A parte em reais rende `taxaBrl`% ao ano
 * e a em dólar, `taxaUsd`% ao ano EM DÓLAR; o real perde `depreciacao`% ao ano a partir de
 * `cambio`. Aporte do ano entra no fim do ano. Tudo medido em reais, para comparar com a carteira
 * que ficou inteira aqui (`tudoReais`).
 */
export function jurosDuasMoedas(p: {
  inicial: number;
  aporte: number;
  fatia: number;
  taxaBrl: number;
  taxaUsd: number;
  cambio: number;
  depreciacao: number;
  anos: number;
}) {
  const anual = p.aporte * 12;
  let brl = p.inicial * (1 - p.fatia);
  let usd = (p.inicial * p.fatia) / p.cambio;
  let tudo = p.inicial;
  const parteReais = [brl];
  const parteDolar = [usd * p.cambio];
  const tudoReais = [tudo];
  for (let t = 1; t <= p.anos; t++) {
    const c = p.cambio * Math.pow(1 + p.depreciacao / 100, t);
    brl = brl * (1 + p.taxaBrl / 100) + anual * (1 - p.fatia);
    usd = usd * (1 + p.taxaUsd / 100) + (anual * p.fatia) / c;
    tudo = tudo * (1 + p.taxaBrl / 100) + anual;
    parteReais.push(brl);
    parteDolar.push(usd * c);
    tudoReais.push(tudo);
  }
  return { parteReais, parteDolar, tudoReais };
}

/**
 * O bloco antigo (`comparador`) no formato novo (`simulador`), para os notebooks de demonstração.
 * Mora aqui, e não no componente do simulador, porque quem chama é o renderizador do notebook, que
 * é componente de servidor: função de módulo "use client" não roda no servidor.
 */
export function deComparador(b: Extract<Bloco, { tipo: "comparador" }>): BlocoSimulador {
  const base = { tipo: "simulador" as const, id: b.id, titulo: b.titulo, descricao: b.descricao };
  if (b.modelo === "diversificacao") {
    const h = b.hipoteses;
    return {
      ...base,
      modelo: "diversificacao",
      parametros: {
        fatia: { valor: Math.round(h.fatia * 20) * 5 },
        volBrasil: { valor: h.volBrasil },
        volExterior: { valor: h.volExterior, fixo: true },
        correlacao: { valor: h.correlacao },
      },
    };
  }
  const h = b.hipoteses;
  return {
    ...base,
    modelo: "poderDeCompra",
    parametros: { depreciacao: { valor: h.depreciacao }, anos: { valor: h.anos }, fatia: { valor: Math.round(h.fatia * 20) * 5 } },
  };
}

/** Padrão de cada controle de cada modelo. O conteúdo ajusta por cima, chave a chave. */
export const PARAMETROS_PADRAO: { [M in ModeloSimulador]: Record<ChaveDe<M>, Required<Omit<Parametro, "ajuda" | "fixo">> & { formato: FormatoDe; ajuda?: string }> } = {
  dividaPib: {
    divida: { valor: 76, min: 20, max: 150, passo: 1, rotulo: "Dívida hoje", formato: { sufixo: "% do PIB" } },
    juros: { valor: 6, min: -2, max: 12, passo: 0.5, rotulo: "Juro real (r)", formato: { sufixo: "% a.a.", casas: 1 } },
    crescimento: { valor: 2, min: -2, max: 6, passo: 0.5, rotulo: "Crescimento real (g)", formato: { sufixo: "% a.a.", casas: 1 } },
    primario: { valor: 0, min: -4, max: 5, passo: 0.25, rotulo: "Resultado primário (s)", formato: { sufixo: "% do PIB", casas: 2 }, ajuda: "Positivo é superávit; negativo, déficit." },
    anos: { valor: 10, min: 5, max: 30, passo: 1, rotulo: "Horizonte", formato: { sufixo: " anos" } },
  },
  diversificacao: {
    fatia: { valor: 30, min: 0, max: 100, passo: 5, rotulo: "Fatia no exterior", formato: { sufixo: "%" } },
    volBrasil: { valor: 22, min: 5, max: 40, passo: 1, rotulo: "Volatilidade da parte no Brasil", formato: { sufixo: "%" } },
    volExterior: { valor: 16, min: 5, max: 40, passo: 1, rotulo: "Volatilidade da parte no exterior", formato: { sufixo: "%" } },
    correlacao: { valor: 0.3, min: -0.5, max: 1, passo: 0.1, rotulo: "Correlação entre as duas partes (ρ)", formato: { casas: 1 }, ajuda: "1: andam sempre juntas. 0: sem relação. Negativa: tendem a andar em sentidos opostos." },
  },
  cambioPatrimonio: {
    patrimonio: { valor: 1_000_000, min: 50_000, max: 10_000_000, passo: 50_000, rotulo: "Patrimônio", formato: { base: "brl", casas: 0, compacto: true } },
    cambio: { valor: 5.2, min: 1, max: 10, passo: 0.05, rotulo: "Dólar hoje", formato: "brl" },
    depreciacao: { valor: 4, min: 0, max: 15, passo: 0.5, rotulo: "Real perde, por ano, contra o dólar", formato: { sufixo: "%", casas: 1 } },
    anos: { valor: 10, min: 1, max: 30, passo: 1, rotulo: "Horizonte", formato: { sufixo: " anos" } },
    fatia: { valor: 30, min: 0, max: 100, passo: 5, rotulo: "Fatia convertida para dólar hoje", formato: { sufixo: "%" } },
  },
  jurosCompostos: {
    inicial: { valor: 200_000, min: 0, max: 5_000_000, passo: 10_000, rotulo: "Valor inicial", formato: { base: "brl", casas: 0, compacto: true } },
    aporte: { valor: 3_000, min: 0, max: 50_000, passo: 500, rotulo: "Aporte mensal", formato: { base: "brl", casas: 0 } },
    fatia: { valor: 30, min: 0, max: 100, passo: 5, rotulo: "Fatia de cada aporte em dólar", formato: { sufixo: "%" } },
    taxaBrl: { valor: 10, min: 0, max: 18, passo: 0.5, rotulo: "Rendimento em reais", formato: { sufixo: "% a.a.", casas: 1 } },
    taxaUsd: { valor: 6, min: 0, max: 12, passo: 0.5, rotulo: "Rendimento em dólar", formato: { sufixo: "% a.a.", casas: 1 } },
    cambio: { valor: 5.2, min: 1, max: 10, passo: 0.05, rotulo: "Dólar hoje", formato: "brl" },
    depreciacao: { valor: 4, min: 0, max: 12, passo: 0.5, rotulo: "Real perde, por ano, contra o dólar", formato: { sufixo: "%", casas: 1 } },
    anos: { valor: 15, min: 1, max: 40, passo: 1, rotulo: "Horizonte", formato: { sufixo: " anos" } },
  },
  poderDeCompra: {
    depreciacao: { valor: 4, min: 0, max: 15, passo: 0.5, rotulo: "Real perde, por ano, contra o dólar", formato: { sufixo: "%", casas: 1 } },
    anos: { valor: 10, min: 1, max: 30, passo: 1, rotulo: "Horizonte", formato: { sufixo: " anos" } },
    fatia: { valor: 30, min: 0, max: 100, passo: 5, rotulo: "Fatia já em dólar", formato: { sufixo: "%" } },
  },
};

// ---- validação do que o tipo não pega ----------------------------------------------------------

const COM_ORIGEM = ["grafico", "kpis", "comparativo", "linhaDoTempo", "fluxo", "matriz"] as const;
type BlocoComOrigem = Extract<Bloco, { tipo: (typeof COM_ORIGEM)[number] }>;

/** Os blocos que carregam fonte ou o selo de ilustrativo, e a tela escreve a linha de origem. */
export function temOrigem(b: Bloco): b is BlocoComOrigem {
  return (COM_ORIGEM as readonly string[]).includes(b.tipo);
}

/**
 * Os problemas de um notebook que o TypeScript não enxerga: série com tamanho diferente do eixo,
 * KPI demais, `tempo` mal escrito, marco que aponta para um ponto inexistente. Lista vazia é
 * notebook são. Roda no `npm run check` (`scripts/notebook-check.mts`) sobre todos os notebooks.
 */
export function validarNotebook(nb: Notebook): string[] {
  const erros: string[] = [];
  const ids = new Set<string>();
  const anotar = (onde: string, msg: string) => erros.push(`módulo ${nb.modulo}, ${onde}: ${msg}`);

  for (const secao of nb.aulas) {
    secao.blocos.forEach((b, i) => {
      const onde = `aula ${secao.aula}, bloco ${i + 1} (${b.tipo})`;
      const erro = (msg: string) => anotar(onde, msg);

      if (b.tempo !== undefined && segundos(b.tempo) === null) erro(`tempo "${b.tempo}" não é mm:ss nem h:mm:ss`);
      if (temOrigem(b) && !b.ilustrativo && !b.fonte?.trim()) erro("fonte vazia: escreva a fonte ou marque ilustrativo");

      if ("id" in b) {
        if (!/^[a-z0-9-]+$/.test(b.id) || b.id.startsWith("aula-")) erro(`id "${b.id}" fora do padrão`);
        if (ids.has(b.id)) erro(`id "${b.id}" repetido`);
        ids.add(b.id);
      }

      switch (b.tipo) {
        case "grafico": {
          if (!b.series.length) erro("sem séries");
          for (const s of b.series)
            if (s.valores.length !== b.eixoX.length) erro(`série "${s.nome}" tem ${s.valores.length} valores e o eixo, ${b.eixoX.length}`);
          if (b.forma === "inclinacao" && b.eixoX.length !== 2) erro("inclinação pede exatamente 2 pontos no eixo X");
          if (b.escala === "log" && b.series.some((s) => s.valores.some((v) => v !== null && v <= 0)))
            erro("escala log com valor zero ou negativo");
          if (b.escala === "log" && (b.forma === "barra" || b.forma === "barraEmpilhada" || b.forma === "area"))
            erro("escala log só em linha ou inclinação");
          for (const m of b.marcos ?? []) if (indiceX(b.eixoX, m.em) < 0) erro(`marco "${m.rotulo}" aponta para ${JSON.stringify(m.em)}, fora do eixo`);
          for (const f of b.faixas ?? [])
            if (indiceX(b.eixoX, f.de) < 0 || indiceX(b.eixoX, f.ate) < 0) erro(`faixa "${f.rotulo ?? ""}" fora do eixo`);
          if (b.series.filter((s) => s.destaque).length > 1) erro("mais de uma série em destaque");
          break;
        }
        case "kpis":
          if (b.itens.length < 2 || b.itens.length > 4) erro(`kpis pede de 2 a 4 itens, veio ${b.itens.length}`);
          if (b.itens.filter((k) => k.destaque).length > 1) erro("mais de um KPI em destaque");
          break;
        case "comparativo":
          if (b.opcoes.length < 2 || b.opcoes.length > 3) erro(`comparativo pede 2 ou 3 opções, veio ${b.opcoes.length}`);
          for (const m of b.metricas)
            if (m.valores.length !== b.opcoes.length) erro(`métrica "${m.rotulo}" tem ${m.valores.length} valores para ${b.opcoes.length} opções`);
          break;
        case "linhaDoTempo":
          if (b.eventos.length < 2) erro("linha do tempo pede ao menos 2 eventos");
          if (b.serie) {
            const s = b.serie;
            if (s.valores.length !== s.eixoX.length) erro("série com tamanho diferente do eixo");
            for (const ev of b.eventos)
              if (indiceX(s.eixoX, ev.em ?? ev.data) < 0) erro(`evento "${ev.titulo}" não acha o ponto ${JSON.stringify(ev.em ?? ev.data)} na série`);
          }
          break;
        case "fluxo":
          if (b.nos.length < 3 || b.nos.length > 6) erro(`fluxo pede de 3 a 6 nós, veio ${b.nos.length}`);
          if (b.ligacoes && b.ligacoes.length !== b.nos.length - 1) erro("ligacoes precisa ter um rótulo a menos que os nós");
          break;
        case "matriz":
          if (b.modo === "payoff" && b.celulas.flat().some((c) => !c.valores)) erro("payoff pede `valores` em todas as células");
          break;
        case "simulador": {
          const padrao = PARAMETROS_PADRAO[b.modelo] as Record<string, Parametro>;
          for (const [k, p] of Object.entries((b.parametros ?? {}) as Record<string, Parametro>)) {
            const base = padrao[k];
            if (!base) {
              erro(`parâmetro "${k}" não existe no modelo ${b.modelo}`);
              continue;
            }
            const min = p.min ?? base.min!;
            const max = p.max ?? base.max!;
            const valor = p.valor ?? base.valor!;
            if (min >= max) erro(`parâmetro "${k}" com min >= max`);
            if (valor < min || valor > max) erro(`parâmetro "${k}" com valor fora de [min, max]`);
          }
          break;
        }
        case "tabela":
          for (const l of b.linhas) if (l.length !== b.colunas.length) erro(`linha "${l[0]}" com ${l.length} células para ${b.colunas.length} colunas`);
          break;
      }
    });
  }
  return erros;
}

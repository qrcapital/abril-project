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
// Puro, sem import: os arquivos de `content/notebooks/` importam só os tipos daqui.

/** Formatação dos números de um gráfico ou de um resultado. */
export type Formato = { prefixo?: string; sufixo?: string; casas?: number };

export type Serie = { nome: string; valores: number[] };

type Base = {
  /**
   * A aula de onde o bloco vem, pelo `ord` dela DENTRO do módulo (1 = primeira aula do módulo).
   * A tela transforma em link para a aula. Opcional: nem todo bloco nasce de uma aula só.
   */
  aula?: number;
};

export type Bloco = Base &
  (
    | {
        tipo: "capitulo";
        /** Âncora do índice lateral. Só letras minúsculas, números e hífen. */
        id: string;
        titulo: string;
        resumo?: string;
      }
    | {
        tipo: "texto";
        /** Parágrafos de prosa. O primeiro do notebook ganha capitular, se `capitular`. */
        paragrafos: string[];
        capitular?: boolean;
      }
    | { tipo: "destaque"; texto: string; fonte?: string }
    | { tipo: "numero"; valor: string; legenda: string; nota?: string }
    | {
        tipo: "grafico";
        titulo: string;
        forma: "linha" | "barra" | "area";
        /** Rótulos do eixo X, um por ponto de cada série. */
        eixoX: string[];
        series: Serie[];
        formato?: Formato;
        /** Rodapé do gráfico: premissas, fonte. Obrigatório dizer se é ilustrativo. */
        nota?: string;
        /** Dado de exemplo, não estatística real. A tela põe o selo "Ilustrativo". */
        ilustrativo?: boolean;
      }
    | {
        tipo: "comparador";
        /** Âncora do índice lateral. */
        id: string;
        titulo: string;
        descricao?: string;
      } & (
        | {
            /** Volatilidade de uma carteira Brasil + exterior conforme a fatia no exterior. */
            modelo: "diversificacao";
            hipoteses: { volBrasil: number; volExterior: number; correlacao: number; fatia: number };
          }
        | {
            /** Poder de compra em dólar com o real perdendo valor a uma taxa fixa hipotética. */
            modelo: "cambio";
            hipoteses: { depreciacao: number; anos: number; fatia: number };
          }
      )
    | { tipo: "tabela"; titulo?: string; colunas: string[]; linhas: string[][]; nota?: string }
    | {
        tipo: "referencias";
        itens: { autor: string; titulo: string; ano: number; nota?: string }[];
      }
  );

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
  blocos: Bloco[];
};

/** Uma entrada do índice lateral. */
export type EntradaIndice = { id: string; rotulo: string; numero: number | null };

/**
 * O índice lateral: os capítulos numerados em ordem, o simulador e as referências. O número do
 * capítulo sai daqui, e não do arquivo, para dois capítulos nunca dizerem "02" por descuido.
 */
export function indiceDo(nb: Notebook): EntradaIndice[] {
  let n = 0;
  const out: EntradaIndice[] = [];
  for (const b of nb.blocos) {
    if (b.tipo === "capitulo") out.push({ id: b.id, rotulo: b.titulo, numero: ++n });
    else if (b.tipo === "comparador") out.push({ id: b.id, rotulo: b.titulo, numero: null });
    else if (b.tipo === "referencias") out.push({ id: "referencias", rotulo: "Referências", numero: null });
  }
  return out;
}

// ---- contas dos simuladores e dos gráficos de demonstração ----------------------------------
// Moram aqui, e não no componente, porque os arquivos de conteúdo usam as mesmas contas para
// montar séries: um gráfico e um simulador da mesma página não podem discordar da aritmética.

/**
 * Volatilidade anual (em %) de uma carteira com duas partes, pela fórmula de Markowitz.
 * `fatia` é a parte no exterior, de 0 a 1; as volatilidades entram em %.
 */
export function volatilidadeCarteira(fatia: number, volBrasil: number, volExterior: number, correlacao: number): number {
  const a = (1 - fatia) * volBrasil;
  const b = fatia * volExterior;
  return Math.sqrt(a * a + b * b + 2 * a * b * correlacao);
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

/** Formata um número pt-BR com prefixo, sufixo e casas. */
export function formatar(v: number, f: Formato = {}): string {
  const casas = f.casas ?? 0;
  const num = v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  return `${f.prefixo ?? ""}${num}${f.sufixo ?? ""}`;
}

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
// Puro, sem import: os arquivos de `content/notebooks/` importam os tipos e as contas daqui.

/** Formatação dos números de um gráfico ou de um resultado. */
export type Formato = { prefixo?: string; sufixo?: string; casas?: number };

export type Serie = { nome: string; valores: number[] };

// A FORMA MUDOU EM 30/SET/2026. Era um notebook por módulo com uma lista corrida de blocos, cada
// bloco apontando para a aula de origem por um `aula?` opcional, e morava numa página à parte
// (`/app/modulo/[m]/notebook`). Agora ele é UM documento longo dentro da página do módulo, dividido
// em uma seção por aula (`aulas[]`), e a seção é a âncora que a playlist usa (`#aula-<n>`). O `aula`
// de cada bloco saiu porque a seção já diz de onde o bloco vem.

export type Bloco =
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
      /** Parágrafos de prosa. O primeiro da seção ganha capitular, se `capitular`. */
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
  | ({
      tipo: "comparador";
      /** Âncora do simulador. */
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
    ))
  | { tipo: "tabela"; titulo?: string; colunas: string[]; linhas: string[][]; nota?: string }
  | {
      tipo: "referencias";
      itens: { autor: string; titulo: string; ano: number; nota?: string }[];
    };

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
};

/** A âncora da seção de uma aula no notebook. Um lugar só, porque a playlist e o índice usam. */
export const ancoraDaAula = (pos: number) => `aula-${pos}`;

/** A seção de uma aula, ou `null` quando o notebook ainda não tem conteúdo para ela. */
export function secaoDaAula(nb: Notebook | null, pos: number): SecaoDaAula | null {
  return nb?.aulas.find((s) => s.aula === pos && s.blocos.length > 0) ?? null;
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

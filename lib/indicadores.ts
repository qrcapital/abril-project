// A parte pura do painel de indicadores: leitura do jsonb de `painel_indicadores()` (migration 0029)
// e as contas de percentual. **Sem IO, sem Next, sem Supabase**, pela regra do AGENTS.md: é o que
// deixa `npm run check:indicadores` exercitar a leitura em node puro. A tela mora em
// `app/admin/indicadores/page.tsx`.
//
// A leitura é defensiva de propósito. O jsonb vem do banco, e uma chave que falte (função de uma
// versão anterior, campo renomeado) tem de virar zero ou "indisponível" na tela, nunca `NaN` nem
// uma exceção que derruba a página inteira para quem só queria ver as vendas.

export type Indicadores = {
  geradoEm: string | null;
  vendas: {
    /** Matrículas com pedido do Guru, incluindo as estornadas depois. */
    total: number;
    estornos: number;
    /** `total - estornos`: as vendas que contam nas somas. */
    validas: number;
    /** Quantas das válidas trouxeram valor bruto no payload. */
    comValor: number;
    /** Quantas das válidas trouxeram valor líquido no payload. */
    comLiquido: number;
    /** Soma dos valores brutos, em reais. Nulo quando nenhuma venda trouxe valor. */
    bruto: number | null;
    /** Soma dos valores líquidos, em reais. Nulo quando o Guru não mandou o líquido. */
    liquido: number | null;
    /** Matrículas sem pedido do Guru (cortesia, cadastro de homologação). Não são venda. */
    cortesias: number;
    porDia: { dia: string; n: number }[];
  };
  alunos: {
    matriculados: number;
    acessoAtivo: number;
    comecaram: number;
    ativos7d: number;
    concluintes: number;
    certificados: number;
  };
  aulas: { total: number; concluidas: number };
  modulos: { ord: number; titulo: string; aulas: number; concluidas: number }[];
  guru: {
    eventos: number;
    eventos7d: number;
    processados: number;
    erros: number;
    pendentes: number;
    ultimo: string | null;
  };
};

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const lista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** Número finito, ou nulo. O Postgres manda `numeric` em jsonb como número, mas aceita texto. */
const numOuNulo = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};
/** Contagem: inteiro não negativo, zero quando ausente. */
const cont = (v: unknown): number => {
  const n = numOuNulo(v);
  return n === null || n < 0 ? 0 : Math.round(n);
};
const texto = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v : null);

export function lerIndicadores(bruto: unknown): Indicadores {
  const r = obj(bruto);
  const v = obj(r.vendas);
  const a = obj(r.alunos);
  const au = obj(r.aulas);
  const g = obj(r.guru);

  const total = cont(v.total);
  const estornos = Math.min(cont(v.estornos), total);
  const comValor = cont(v.com_valor);
  const comLiquido = cont(v.com_liquido);

  return {
    geradoEm: texto(r.gerado_em),
    vendas: {
      total,
      estornos,
      validas: v.validas === undefined ? total - estornos : cont(v.validas),
      comValor,
      comLiquido,
      // Soma sem nenhuma parcela é "não sabemos", não "zero reais".
      bruto: comValor > 0 ? numOuNulo(v.bruto) : null,
      liquido: comLiquido > 0 ? numOuNulo(v.liquido) : null,
      cortesias: cont(v.cortesias),
      porDia: lista(v.por_dia)
        .map((d) => ({ dia: texto(obj(d).dia) ?? "", n: cont(obj(d).n) }))
        .filter((d) => d.dia),
    },
    alunos: {
      matriculados: cont(a.matriculados),
      acessoAtivo: cont(a.acesso_ativo),
      comecaram: cont(a.comecaram),
      ativos7d: cont(a.ativos_7d),
      concluintes: cont(a.concluintes),
      certificados: cont(a.certificados),
    },
    aulas: { total: cont(au.total), concluidas: cont(au.concluidas) },
    modulos: lista(r.modulos).map((m) => {
      const o = obj(m);
      return {
        ord: cont(o.ord),
        titulo: texto(o.titulo) ?? "",
        aulas: cont(o.aulas),
        concluidas: cont(o.concluidas),
      };
    }),
    guru: {
      eventos: cont(g.eventos),
      eventos7d: cont(g.eventos_7d),
      processados: cont(g.processados),
      erros: cont(g.erros),
      pendentes: cont(g.pendentes),
      ultimo: texto(g.ultimo),
    },
  };
}

/** Fração de 0 a 1, ou nulo quando o denominador é zero (a tela mostra "sem base"). */
export function fracao(parte: number, total: number): number | null {
  if (!(total > 0)) return null;
  return Math.min(Math.max(parte / total, 0), 1);
}

/** "42%", "4,2%" abaixo de 10%, ou "sem base". */
export function pct(parte: number, total: number): string {
  const f = fracao(parte, total);
  if (f === null) return "sem base";
  const p = f * 100;
  const casas = p > 0 && p < 10 ? 1 : 0;
  return `${p.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`;
}

/**
 * Completude global das aulas: aulas concluídas sobre (matriculados x aulas que contam). É a conta
 * pedida pelo dono, com a mesma coorte em cima e embaixo (o banco só soma aula de quem é matriculado).
 */
export const completude = (i: Indicadores) =>
  ({ parte: i.aulas.concluidas, total: i.alunos.matriculados * i.aulas.total });

/** Progresso médio de um módulo: aulas concluídas dele sobre (matriculados x aulas dele). */
export const progressoModulo = (i: Indicadores, m: Indicadores["modulos"][number]) =>
  ({ parte: m.concluidas, total: i.alunos.matriculados * m.aulas });

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
/** "R$ 1.997,00", ou "indisponível" quando o valor não veio. */
export const reais = (v: number | null): string => (v === null ? "indisponível" : BRL.format(v));

/** Ticket médio das vendas que trouxeram valor. */
export const ticketMedio = (i: Indicadores): number | null =>
  i.vendas.bruto !== null && i.vendas.comValor > 0 ? i.vendas.bruto / i.vendas.comValor : null;

/** "06/10" a partir de "2026-10-06", sem passar por `Date` (que puxaria fuso). */
export const diaCurto = (iso: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}/${m[2]}` : iso;
};

// Liberação de conteúdo por POLÍTICA. Função pura, sem IO: quem lê a matrícula é o
// `lib/matricula.ts`, quem carrega a política ativa é o `lib/politicas.ts`, e quem exercita
// esta regra é o `scripts/liberacao-check.mts`.
//
// **História.** Até 17/ago/2026 a cadência era uma constante (um módulo por semana), por
// decisão de 29/jul. Em 17/ago o Pedro pediu políticas configuráveis pelo admin, com quatro
// tipos de regra por módulo. A PROTEÇÃO COMERCIAL da esteira original (o curso não ficar
// concluível dentro da janela de arrependimento, senão o aluno emite o certificado e pede
// reembolso) continua existindo, mas mudou de forma: era trava de build, virou AVISO na tela
// de políticas (`violaGarantia`), porque uma política deliberada de acesso livre agora é
// escolha legítima do admin. Decisão do Pedro em 17/ago, com o risco explicitado.

/** Uma regra de liberação de um módulo. É o que a tela de políticas edita. */
export type Regra =
  /** Aberto desde o início da matrícula. */
  | { tipo: "livre" }
  /** Indisponível, sem data: uso previsto é material complementar ainda não produzido. */
  | { tipo: "em_breve" }
  /** Abre N dias depois do `inicio_em` da matrícula (a esteira clássica). */
  | { tipo: "dias"; dias: number }
  /** Abre numa data fixa, igual para todos, independente de quando compraram. */
  | { tipo: "data"; data: Date };

export const TIPOS_DE_REGRA = ["livre", "em_breve", "dias", "data"] as const;

/**
 * Módulo sem regra na política ativa (criado depois dela) fica **em breve**, nunca aberto:
 * módulo recém-criado é rascunho até o admin dizer o contrário, e o erro seguro é não vazar.
 */
export const REGRA_PADRAO: Regra = { tipo: "em_breve" };

/** A cadência da esteira clássica, usada pelo preset da tela e pelo seed da migration 0016. */
export const DIAS_POR_MODULO = 7;

/** Esteira clássica: boas-vindas e Módulo I no ato, depois um por semana. */
export function regraEsteira(indice: number): Regra {
  return { tipo: "dias", dias: Math.max(0, indice - 1) * DIAS_POR_MODULO };
}

/** Janela de arrependimento do CDC para compra pela internet. */
export const DIAS_GARANTIA = 7;

/**
 * Quando o módulo abre para uma matrícula que começou em `inicioEm`.
 * `null` é "não tem data": em breve.
 */
export function aberturaDoModulo(inicioEm: Date, regra: Regra): Date | null {
  switch (regra.tipo) {
    case "livre":
      return inicioEm;
    case "em_breve":
      return null;
    case "dias":
      return new Date(inicioEm.getTime() + regra.dias * 86_400_000);
    case "data":
      return regra.data;
  }
}

export type Liberacao = {
  /** Índices de módulo já abertos. */
  abertos: Set<number>;
  /** Todos os módulos que NÃO estão em breve, abertos? É o que a prova exige, além das aulas. */
  completo: boolean;
};

/**
 * O que este aluno pode ver agora. `regras[i]` é a regra do módulo de índice `i`; buraco no
 * array cai na `REGRA_PADRAO`.
 *
 * - `liberacaoTotal` (exceção por aluno, nas mãos do admin) abre tudo, MENOS módulo em breve:
 *   em breve não é ritmo, é conteúdo que ainda não existe, e nenhuma chave faz aparecer o que
 *   não está pronto.
 * - `completo` ignora os módulos em breve (decisão do Pedro, 17/ago): eles são material
 *   complementar e não seguram a prova. Se um módulo AVALIADO for posto em breve, quem segura
 *   a prova é o gate de aulas (16/16), e a tela de políticas avisa.
 * - `agora` é parâmetro para o self-check andar no tempo sem depender do relógio.
 */
export function liberacao(
  inicioEm: Date,
  liberacaoTotal: boolean,
  regras: readonly (Regra | undefined)[],
  agora: Date = new Date(),
): Liberacao {
  const abertos = new Set<number>();
  let exigidos = 0;
  let exigidosAbertos = 0;
  regras.forEach((r, i) => {
    const regra = r ?? REGRA_PADRAO;
    const abertura = aberturaDoModulo(inicioEm, regra);
    const aberto =
      abertura !== null && (liberacaoTotal || abertura.getTime() <= agora.getTime());
    if (aberto) abertos.add(i);
    if (regra.tipo !== "em_breve") {
      exigidos++;
      if (aberto) exigidosAbertos++;
    }
  });
  return { abertos, completo: exigidos > 0 && exigidosAbertos === exigidos };
}

/**
 * Quantos dias faltam para o módulo abrir. Zero quando já está aberto; `null` quando não há
 * data (em breve).
 */
export function diasAte(
  inicioEm: Date,
  regra: Regra,
  agora: Date = new Date(),
): number | null {
  const abertura = aberturaDoModulo(inicioEm, regra);
  if (abertura === null) return null;
  const ms = abertura.getTime() - agora.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / 86_400_000);
}

/**
 * Quando o curso fica concluível (a última abertura entre os módulos que a prova exige), para
 * quem começa em `inicioEm`. `null` quando não há módulo exigido — política toda em breve.
 * Módulo em breve não entra: ele não segura a prova.
 */
export function concluivelEm(inicioEm: Date, regras: readonly (Regra | undefined)[]): Date | null {
  let fim: Date | null = null;
  for (const r of regras) {
    const regra = r ?? REGRA_PADRAO;
    if (regra.tipo === "em_breve") continue;
    const abertura = aberturaDoModulo(inicioEm, regra)!;
    if (!fim || abertura.getTime() > fim.getTime()) fim = abertura;
  }
  return fim;
}

/**
 * A política deixa o curso concluível dentro da janela de arrependimento? É o AVISO da tela
 * de políticas (não trava: decisão do Pedro, 17/ago). Medida para uma compra feita `agora`,
 * que é o pior caso: regra de data fixa já passada equivale a acesso livre para quem compra
 * hoje.
 */
export function violaGarantia(
  regras: readonly (Regra | undefined)[],
  agora: Date = new Date(),
): boolean {
  const fim = concluivelEm(agora, regras);
  if (fim === null) return false; // nada exigido, nada concluível
  return fim.getTime() - agora.getTime() < DIAS_GARANTIA * 86_400_000;
}

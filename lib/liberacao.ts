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
//
// Em 29/set entrou o quinto tipo, `apos_modulo` (abre quando o aluno conclui outro módulo),
// no molde do Cademi, e a esteira passou a abrir o Módulo I só na primeira semana. Com ele, a
// liberação deixou de depender só do relógio: depende também do progresso, e por isso as
// funções abaixo recebem as `Conclusoes` do aluno. O banco repete esta regra em SQL
// (`modulo_aberto()`, migration 0024) para a RLS de `lessons` e `materials`.

/** Uma regra de liberação de um módulo. É o que a tela de políticas edita. */
export type Regra =
  /** Aberto desde o início da matrícula. */
  | { tipo: "livre" }
  /** Indisponível, sem data: uso previsto é material complementar ainda não produzido. */
  | { tipo: "em_breve" }
  /** Abre N dias depois do `inicio_em` da matrícula (a esteira clássica). */
  | { tipo: "dias"; dias: number }
  /** Abre numa data fixa, igual para todos, independente de quando compraram. */
  | { tipo: "data"; data: Date }
  /**
   * Abre quando o aluno CONCLUI o módulo de ord `modulo` (todas as aulas dele), mais `dias`
   * opcionais contados da última aula concluída. `modulo` é sempre um ord anterior ao do
   * próprio módulo: o banco recusa dependência para frente ou para si (migration 0024), porque
   * uma cadeia circular trancaria os dois módulos para sempre sem erro nenhum na tela.
   */
  | { tipo: "apos_modulo"; modulo: number; dias?: number };

export const TIPOS_DE_REGRA = ["livre", "em_breve", "dias", "data", "apos_modulo"] as const;

/**
 * Módulo sem regra na política ativa (criado depois dela) fica **em breve**, nunca aberto:
 * módulo recém-criado é rascunho até o admin dizer o contrário, e o erro seguro é não vazar.
 */
export const REGRA_PADRAO: Regra = { tipo: "em_breve" };

/** A cadência da esteira clássica, usada pelo preset da tela e pelo seed. */
export const DIAS_POR_MODULO = 7;

/**
 * Esteira clássica: Módulo 0 ("Comece por aqui") no ato, e um módulo por semana contado da
 * matrícula (I em 7 dias, II em 14, III em 21, IV em 28).
 *
 * Até 29/set/2026 era `max(0, i - 1) * 7`, que abria o Módulo 0 e o I juntos no dia da compra.
 * O Pedro pediu o I só na semana seguinte: o Módulo 0 é a porta de entrada, e com os dois
 * abertos no primeiro dia o aluno pulava a boas-vindas direto para a primeira aula avaliada.
 * A migration 0024 reescreve a política ativa com esta mesma conta.
 */
export function regraEsteira(indice: number): Regra {
  return { tipo: "dias", dias: indice * DIAS_POR_MODULO };
}

/** Janela de arrependimento do CDC para compra pela internet. */
export const DIAS_GARANTIA = 7;

const DIA = 86_400_000;

/**
 * Quando cada módulo foi CONCLUÍDO pelo aluno, por ord. Módulo fora do mapa não foi concluído.
 * É o que a regra `apos_modulo` consulta; quem monta é `conclusaoDosModulos`.
 */
export type Conclusoes = ReadonlyMap<number, Date>;

const NENHUMA: Conclusoes = new Map();

/**
 * O instante em que cada módulo ficou concluído: todas as aulas dele concluídas, e a data é a
 * da ÚLTIMA delas. Conta TODAS as aulas do módulo, e não só as que valem para o gate da prova,
 * porque o Módulo 0 não tem aula avaliada nenhuma e "concluir o Módulo 0" viraria verdade vazia,
 * abrindo o módulo seguinte no ato. Pela mesma razão, módulo sem aula não conta como concluído.
 *
 * O `modulo_aberto()` da migration 0024 faz a mesma conta em SQL para a RLS. Mudou aqui, muda lá.
 */
export function conclusaoDosModulos(
  aulas: readonly { id: string; modulo: number }[],
  concluidasEm: ReadonlyMap<string, Date>,
): Map<number, Date> {
  const porModulo = new Map<number, { total: number; feitas: number; ultima: number }>();
  for (const a of aulas) {
    const m = porModulo.get(a.modulo) ?? { total: 0, feitas: 0, ultima: 0 };
    m.total++;
    const quando = concluidasEm.get(a.id);
    if (quando) {
      m.feitas++;
      m.ultima = Math.max(m.ultima, quando.getTime());
    }
    porModulo.set(a.modulo, m);
  }
  const out = new Map<number, Date>();
  for (const [ord, m] of porModulo)
    if (m.total > 0 && m.feitas === m.total) out.set(ord, new Date(m.ultima));
  return out;
}

/**
 * Quando o módulo abre para uma matrícula que começou em `inicioEm`.
 * `null` é "não tem data": em breve, ou `apos_modulo` com o pré-requisito ainda não concluído.
 */
export function aberturaDoModulo(
  inicioEm: Date,
  regra: Regra,
  conclusoes: Conclusoes = NENHUMA,
): Date | null {
  switch (regra.tipo) {
    case "livre":
      return inicioEm;
    case "em_breve":
      return null;
    case "dias":
      return new Date(inicioEm.getTime() + regra.dias * DIA);
    case "data":
      return regra.data;
    case "apos_modulo": {
      const concluido = conclusoes.get(regra.modulo);
      return concluido ? new Date(concluido.getTime() + (regra.dias ?? 0) * DIA) : null;
    }
  }
}

/**
 * Por que o módulo está no estado em que está. É o tipo da regra, exceto `total`: aberto só
 * pela chave de liberação total do admin, antes do que a regra daria.
 */
export type MotivoLiberacao = "livre" | "dias" | "data" | "apos_modulo" | "em_breve" | "total";

export type EntradaCalendario = {
  ord: number;
  /**
   * Quando abre (ou abriu). `null` = sem data: em breve, ou esperando a conclusão de outro
   * módulo. Aberto pela liberação total antes da hora: o próprio início da matrícula.
   */
  abreEm: Date | null;
  aberto: boolean;
  motivo: MotivoLiberacao;
};

/**
 * O calendário de um aluno, módulo a módulo. `regras[i]` é a regra do módulo de ord `i`; buraco
 * no array cai na `REGRA_PADRAO`. É a fonte de `liberacao()` e do `getCalendario()`.
 *
 * - `liberacaoTotal` (exceção por aluno, nas mãos do admin) abre tudo, MENOS módulo em breve:
 *   em breve não é ritmo, é conteúdo que ainda não existe, e nenhuma chave faz aparecer o que
 *   não está pronto. Abre também o `apos_modulo` sem pré-requisito concluído: a chave existe
 *   justamente para pular a esteira.
 * - `agora` é parâmetro para o self-check andar no tempo sem depender do relógio.
 */
export function calendarioDoAluno({
  inicioEm,
  liberacaoTotal = false,
  regras,
  conclusoes = NENHUMA,
  agora = new Date(),
}: {
  inicioEm: Date;
  liberacaoTotal?: boolean;
  regras: readonly (Regra | undefined)[];
  conclusoes?: Conclusoes;
  agora?: Date;
}): EntradaCalendario[] {
  // `Array.from` e não `regras.map`: map pula buraco de array esparso, e buraco é módulo.
  return Array.from({ length: regras.length }, (_, ord) => {
    const regra = regras[ord] ?? REGRA_PADRAO;
    if (regra.tipo === "em_breve") return { ord, abreEm: null, aberto: false, motivo: "em_breve" };
    const abertura = aberturaDoModulo(inicioEm, regra, conclusoes);
    const peloRelogio = abertura !== null && abertura.getTime() <= agora.getTime();
    if (peloRelogio) return { ord, abreEm: abertura, aberto: true, motivo: regra.tipo };
    if (liberacaoTotal) return { ord, abreEm: inicioEm, aberto: true, motivo: "total" };
    return { ord, abreEm: abertura, aberto: false, motivo: regra.tipo };
  });
}

export type Liberacao = {
  /** Índices de módulo já abertos. */
  abertos: Set<number>;
  /** Todos os módulos que NÃO estão em breve, abertos? É o que a prova exige, além das aulas. */
  completo: boolean;
};

/**
 * O que este aluno pode ver agora: o `calendarioDoAluno` resumido no que as guardas usam.
 *
 * - `completo` ignora os módulos em breve (decisão do Pedro, 17/ago): eles são material
 *   complementar e não seguram a prova. Se um módulo AVALIADO for posto em breve, quem segura
 *   a prova é o gate de aulas (16/16), e a tela de políticas avisa.
 * - `conclusoes` só importa para regra `apos_modulo`; sem ela, esses módulos ficam fechados
 *   (o erro seguro), então quem guarda porta precisa passar as conclusões do aluno.
 */
export function liberacao(
  inicioEm: Date,
  liberacaoTotal: boolean,
  regras: readonly (Regra | undefined)[],
  agora: Date = new Date(),
  conclusoes: Conclusoes = NENHUMA,
): Liberacao {
  const cal = calendarioDoAluno({ inicioEm, liberacaoTotal, regras, conclusoes, agora });
  const exigidos = cal.filter((c) => c.motivo !== "em_breve");
  return {
    abertos: new Set(cal.filter((c) => c.aberto).map((c) => c.ord)),
    completo: exigidos.length > 0 && exigidos.every((c) => c.aberto),
  };
}

/** Dias inteiros até `abertura`, arredondando para cima. Zero quando já passou. */
export function diasAteData(abertura: Date, agora: Date = new Date()): number {
  const ms = abertura.getTime() - agora.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / DIA);
}

/**
 * Quantos dias faltam para o módulo abrir. Zero quando já está aberto; `null` quando não há
 * data (em breve, ou pré-requisito ainda não concluído).
 */
export function diasAte(
  inicioEm: Date,
  regra: Regra,
  agora: Date = new Date(),
  conclusoes: Conclusoes = NENHUMA,
): number | null {
  const abertura = aberturaDoModulo(inicioEm, regra, conclusoes);
  return abertura === null ? null : diasAteData(abertura, agora);
}

/**
 * A abertura MAIS CEDO possível de cada módulo, supondo o aluno mais rápido: aquele que conclui
 * um módulo no instante em que ele abre. É a conta certa para o aviso da garantia, que mede o
 * pior caso. `apos_modulo` apontando para módulo que nunca abre (em breve, ou ord inexistente ou
 * não anterior) fica `null`: aquele módulo também nunca abre.
 */
function aberturasMaisCedo(
  inicioEm: Date,
  regras: readonly (Regra | undefined)[],
): (Date | null)[] {
  const cedo: (Date | null)[] = [];
  for (let ord = 0; ord < regras.length; ord++) {
    const regra = regras[ord] ?? REGRA_PADRAO;
    if (regra.tipo === "apos_modulo") {
      const base = regra.modulo < ord ? (cedo[regra.modulo] ?? null) : null;
      cedo.push(base ? new Date(base.getTime() + (regra.dias ?? 0) * DIA) : null);
    } else {
      cedo.push(aberturaDoModulo(inicioEm, regra));
    }
  }
  return cedo;
}

/**
 * Quando o curso fica concluível (a última abertura entre os módulos que a prova exige), para
 * quem começa em `inicioEm` e anda na velocidade máxima. `null` quando não há data: nenhum
 * módulo exigido (política toda em breve), ou um exigido depende de outro que nunca abre.
 * Módulo em breve não entra: ele não segura a prova.
 */
export function concluivelEm(inicioEm: Date, regras: readonly (Regra | undefined)[]): Date | null {
  const cedo = aberturasMaisCedo(inicioEm, regras);
  let fim: Date | null = null;
  for (let ord = 0; ord < regras.length; ord++) {
    const regra = regras[ord] ?? REGRA_PADRAO;
    if (regra.tipo === "em_breve") continue;
    const abertura = cedo[ord];
    if (abertura === null) return null;
    if (!fim || abertura.getTime() > fim.getTime()) fim = abertura;
  }
  return fim;
}

/**
 * A política deixa o curso concluível dentro da janela de arrependimento? É o AVISO da tela
 * de políticas (não trava: decisão do Pedro, 17/ago). Medida para uma compra feita `agora`,
 * que é o pior caso: regra de data fixa já passada equivale a acesso livre para quem compra
 * hoje, e `apos_modulo` sem dias extras equivale a abrir junto com o pré-requisito.
 */
export function violaGarantia(
  regras: readonly (Regra | undefined)[],
  agora: Date = new Date(),
): boolean {
  const fim = concluivelEm(agora, regras);
  if (fim === null) return false; // nada exigido, ou nunca concluível
  return fim.getTime() - agora.getTime() < DIAS_GARANTIA * DIA;
}

// ---- datas na tela --------------------------------------------------------------------------
//
// O fuso é FIXO, e não o do servidor: a Netlify roda as funções em UTC, e um
// `toLocaleDateString("pt-BR")` sem `timeZone` escrevia o dia seguinte para qualquer abertura
// entre 21h e meia-noite de Brasília. O aluno lia "abre dia 14" e o módulo abria na noite do 13.

export const FUSO_DO_CURSO = "America/Sao_Paulo";

const DD_MM = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO_DO_CURSO,
  day: "2-digit",
  month: "2-digit",
});
const DD_MM_AAAA = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO_DO_CURSO,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** "13/10", no fuso do curso. */
export const dataCurta = (d: Date) => DD_MM.format(d);
/** "13/10/2026", no fuso do curso. */
export const dataLonga = (d: Date) => DD_MM_AAAA.format(d);

/**
 * A regra em uma frase, para a prévia da tela de políticas ("abre 7 dias após a matrícula").
 * `rotulo` traduz o ord do pré-requisito ("Módulo I"); vem por parâmetro para este arquivo
 * continuar sem import nenhum e rodar no self-check em node puro.
 */
export function descreverRegra(regra: Regra, rotulo: (ord: number) => string): string {
  switch (regra.tipo) {
    case "livre":
      return "abre no ato da matrícula";
    case "em_breve":
      return "fechado, sem data (em breve)";
    case "dias":
      return regra.dias === 0
        ? "abre no ato da matrícula"
        : regra.dias === 1
          ? "abre 1 dia após a matrícula"
          : `abre ${regra.dias} dias após a matrícula`;
    case "data":
      return `abre em ${dataLonga(regra.data)}`;
    case "apos_modulo": {
      const dias = regra.dias ?? 0;
      const extra = dias === 0 ? "" : dias === 1 ? ", mais 1 dia" : `, mais ${dias} dias`;
      return `abre após concluir o ${rotulo(regra.modulo)}${extra}`;
    }
  }
}

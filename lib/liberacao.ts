// Calendário de liberação do curso. Função pura, sem IO: quem lê a matrícula é o
// `lib/matricula.ts`, e quem exercita esta regra é o `scripts/liberacao-check.mts`.
//
// **Por que a esteira existe.** Não é ritmo pedagógico, é proteção comercial (decisão do
// Pedro, 29/jul/2026): sem ela, um aluno termina o curso em poucos dias, emite o certificado e
// pede reembolso dentro da janela de arrependimento, ficando com a peça sem ter pago. Por isso
// a última abertura precisa cair DEPOIS dessa janela, e por isso a trava é conferida no
// servidor a partir da matrícula, e não pelo progresso, que hoje mora num cookie que o próprio
// aluno edita.

/**
 * Dias entre a abertura de um módulo e a do seguinte. É a trava do produto, e por isso é
 * constante e não configuração: o Pedro definiu em 29/jul que o que se ajusta caso a caso é a
 * chave de liberação total, nas mãos do admin, nunca a cadência.
 */
export const DIAS_POR_MODULO = 7;

/**
 * Semana em que cada módulo abre, pelo índice dele. O Módulo 0 (boas-vindas) e o I abrem no
 * ato da compra: deixar só as boas-vindas no dia zero entrega uma tela quase vazia a quem
 * acabou de pagar. Daí em diante, um por semana.
 */
export function semanaDoModulo(indice: number): number {
  return Math.max(0, indice - 1);
}

/** Quando o módulo abre para uma matrícula que começou em `inicioEm`. */
export function aberturaDoModulo(inicioEm: Date, indice: number): Date {
  const d = new Date(inicioEm);
  d.setDate(d.getDate() + semanaDoModulo(indice) * DIAS_POR_MODULO);
  return d;
}

/** O último módulo abre neste dia. É quando o curso passa a ser concluível. */
export function fimDoCalendario(inicioEm: Date, totalModulos: number): Date {
  return aberturaDoModulo(inicioEm, totalModulos - 1);
}

export type Liberacao = {
  /** Índices de módulo já abertos. */
  abertos: Set<number>;
  /** Todos abertos? É o que a prova exige, além das aulas concluídas. */
  completo: boolean;
};

/**
 * O que este aluno pode ver agora.
 *
 * `liberacaoTotal` abre tudo de uma vez, e é a exceção que o admin concede caso a caso.
 * `agora` é parâmetro para o self-check conseguir andar no tempo sem depender do relógio.
 */
export function liberacao(
  inicioEm: Date,
  liberacaoTotal: boolean,
  totalModulos: number,
  agora: Date = new Date(),
): Liberacao {
  const abertos = new Set<number>();
  for (let i = 0; i < totalModulos; i++) {
    if (liberacaoTotal || aberturaDoModulo(inicioEm, i).getTime() <= agora.getTime())
      abertos.add(i);
  }
  return { abertos, completo: abertos.size === totalModulos };
}

/** Quantos dias faltam para o módulo abrir. Zero quando já está aberto. */
export function diasAte(inicioEm: Date, indice: number, agora: Date = new Date()): number {
  const ms = aberturaDoModulo(inicioEm, indice).getTime() - agora.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / 86_400_000);
}

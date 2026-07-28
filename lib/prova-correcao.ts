// Núcleo da prova: regras e correção. SEM IO — nada de Supabase, cookie ou fs aqui,
// para que a regra de nota seja testável isolada (`scripts/prova-check.ts`).
// O lado que fala com o banco é o `lib/prova.ts`.

export const TOTAL_QUESTOES = 20;
export const MINUTOS = 120;
export const NOTA_MINIMA = 70; // por cento (PRD §7)

// As alternativas aparecem rotuladas A..D na tela; no banco, `correta` é o índice 0..3.
export const LETRAS = ["A", "B", "C", "D"] as const;
export type Letra = (typeof LETRAS)[number];

export type QuestaoSnapshot = {
  id: string;
  modulo: number; // 1..4
  enunciado: string;
  alternativas: string[];
  correta: number; // 0..3 — NUNCA sai do servidor
};

/** O que o navegador pode ver: o snapshot sem o gabarito. */
export type QuestaoCliente = Omit<QuestaoSnapshot, "correta">;

/** Respostas chaveadas pela POSIÇÃO na prova (1..20), não pelo id da questão. */
export type Respostas = Record<string, Letra>;

export type Desempenho = { modulo: number; acertos: number; total: number; pct: number };

export type Correcao = {
  acertos: number;
  total: number;
  score: number; // 0..100, arredondado, para exibir
  aprovado: boolean;
  porModulo: Desempenho[];
};

const pct = (acertos: number, total: number) =>
  total === 0 ? 0 : Math.round((acertos / total) * 100);

/**
 * Corrige a tentativa contra o snapshot, que é o que o aluno realmente viu (PRD §7).
 *
 * Questão sem resposta conta como erro: o denominador é sempre o total da prova, não
 * o número de respondidas. É o que o PRD pede para o deadline estourado ("corrige
 * apenas o que foi respondido", ou seja, não anula a prova nem extrapola nota).
 */
export function corrigir(
  questoes: QuestaoSnapshot[],
  respostas: Respostas,
): Correcao {
  const total = questoes.length;
  let acertos = 0;
  const porMod = new Map<number, { acertos: number; total: number }>();

  questoes.forEach((q, i) => {
    const dada = respostas[String(i + 1)];
    // indexOf devolve -1 para resposta ausente ou inválida, que nunca casa com 0..3.
    const ok = LETRAS.indexOf(dada as Letra) === q.correta;
    if (ok) acertos++;

    const m = porMod.get(q.modulo) ?? { acertos: 0, total: 0 };
    m.total++;
    if (ok) m.acertos++;
    porMod.set(q.modulo, m);
  });

  return {
    acertos,
    total,
    score: pct(acertos, total),
    // Comparação em inteiros, não sobre o score arredondado: com um total diferente de
    // 20 (banco incompleto, 2ª chamada encurtada), arredondar primeiro poderia
    // promover 69,5% a 70 e aprovar quem não passou.
    aprovado: acertos * 100 >= NOTA_MINIMA * total,
    porModulo: [...porMod.entries()]
      .sort(([a], [b]) => a - b)
      .map(([modulo, m]) => ({ modulo, ...m, pct: pct(m.acertos, m.total) })),
  };
}

/** Milissegundos restantes até o deadline; nunca negativo. */
export function restanteMs(deadlineISO: string, agora = Date.now()): number {
  return Math.max(0, new Date(deadlineISO).getTime() - agora);
}

/** "M:SS" do cronômetro, no formato que o design já usa. */
export function formatarTempo(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

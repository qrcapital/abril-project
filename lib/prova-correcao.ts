// Núcleo da prova: regras e correção. SEM IO — nada de Supabase, cookie ou fs aqui,
// para que a regra de nota seja testável isolada (`scripts/prova-check.ts`).
// O lado que fala com o banco é o `lib/prova.ts`.

export const TOTAL_QUESTOES = 20;
export const MINUTOS = 120;
export const NOTA_MINIMA = 70; // por cento (PRD §7)

// As alternativas aparecem rotuladas A..D na tela; no banco, `correta` é o índice 0..3.
export const LETRAS = ["A", "B", "C", "D"] as const;

/**
 * Este aluno pode receber 2ª chamada?
 *
 * Só quem **entregou e reprovou**. As três recusas existem por motivos diferentes:
 *
 * - **sem tentativa**: não há o que refazer, e a primeira prova já está disponível para ele;
 * - **tentativa em andamento ou liberada e não iniciada**: ele já tem uma prova aberta nas mãos, e
 *   somar outra criaria duas tentativas válidas ao mesmo tempo;
 * Nota **nula** numa tentativa entregue é anomalia (a correção grava a nota no mesmo update do
 * envio), e aqui ela conta como não aprovado: dar outra chance a quem não tem nota registrada é o
 * lado gentil do erro, e a tela de Alunos já sinaliza esse caso como "entregue, sem nota".
 *
 * - **aprovado**: e esta é a que morde de verdade. O porteiro do certificado (`foiAprovado`) olha a
 *   tentativa MAIS RECENTE. Liberar 2ª chamada para quem passou trocaria a tentativa vigente por uma
 *   sem nota, e o aluno **perderia o acesso ao certificado que já tinha** até refazer a prova. Uma
 *   gentileza mal colocada viraria retirada de direito.
 */
export function podeSegundaChamada(
  atual: { status: "available" | "in_progress" | "submitted"; nota: number | null } | null,
): { ok: true } | { ok: false; motivo: string } {
  if (!atual) return { ok: false, motivo: "Este aluno ainda não fez a prova." };
  if (atual.status !== "submitted")
    return { ok: false, motivo: "Este aluno já tem uma tentativa em aberto." };
  // A FUNÇÃO recebe a nota crua e decide: quem chama não calcula "aprovado". A primeira versão pedia
  // um booleano, e os dois chamadores o calcularam de formas diferentes (a tela pela coluna `score`, a
  // rota recorrigindo o snapshot). O teste pegou a divergência na hora: a tela oferecia o botão e a
  // rota liberava para um aluno aprovado. Uma regra, um lugar.
  if (atual.nota !== null && atual.nota >= NOTA_MINIMA)
    return {
      ok: false,
      motivo:
        "Este aluno foi aprovado. Liberar outra tentativa tiraria o acesso ao certificado dele até refazer a prova.",
    };
  return { ok: true };
}
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
    //
    // O `total > 0` não é defensivo por gosto: sem ele uma prova sem questão APROVA, porque
    // `0 >= NOTA_MINIMA * 0` é verdadeiro. E este booleano é o porteiro do certificado
    // (`foiAprovado`, em `lib/prova.ts`). Enquanto nada fechava tentativa com
    // `questions_snapshot` vazio o caso era inalcançável; a rotina de prova abandonada
    // (`lib/prova-expiradas.ts`) fecha, e sem este guard ela emitiria a linha `submitted`
    // que libera o PDF a quem não respondeu nada.
    aprovado: total > 0 && acertos * 100 >= NOTA_MINIMA * total,
    porModulo: [...porMod.entries()]
      .sort(([a], [b]) => a - b)
      .map(([modulo, m]) => ({ modulo, ...m, pct: pct(m.acertos, m.total) })),
  };
}

export type ItemGrade = { posicao: number; respondida: boolean };
export type ResumoProva = { respondidas: number; emBranco: number; itens: ItemGrade[] };

/**
 * O modelo da grade de questões e a contagem de em branco, a partir das posições já
 * respondidas. Puro para o check pinar a aritmética: é o número que dá sentido à
 * confirmação de envio, e errar por um significa dizer ao aluno que ele respondeu tudo
 * quando deixou uma para trás.
 *
 * Aceita posição repetida e posição fora de 1..total sem contar em dobro nem estourar: a
 * entrada vem de `Object.keys(answers)`, que é dado gravado ao longo de duas horas e pode
 * carregar sujeira de uma versão anterior do snapshot.
 */
export function resumoProva(total: number, posicoesRespondidas: number[]): ResumoProva {
  const validas = new Set(
    posicoesRespondidas.filter((p) => Number.isInteger(p) && p >= 1 && p <= total),
  );
  const itens = Array.from({ length: Math.max(0, total) }, (_, i) => ({
    posicao: i + 1,
    respondida: validas.has(i + 1),
  }));
  return { respondidas: validas.size, emBranco: itens.length - validas.size, itens };
}

/**
 * O trecho que leva negrito no diálogo de envio: a quantidade em branco. Existe separado da
 * frase para o destaque ser encontrado por busca de substring, sem `innerHTML`, e para o
 * plural viver num lugar só.
 */
export function trechoEmBranco(emBranco: number): string {
  return emBranco === 1 ? "1 questão em branco" : `${emBranco} questões em branco`;
}

/**
 * A frase da contagem, com plural. Fica aqui e não no cliente porque é conteúdo que o check
 * verifica junto com o número — "1 questões em branco" é o tipo de erro que passa por build,
 * lint e revisão, e aparece só para o aluno.
 */
export function fraseEmBranco(emBranco: number): string {
  if (emBranco === 0) return "Você respondeu todas as questões.";
  return `Você deixou ${trechoEmBranco(emBranco)}.`;
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

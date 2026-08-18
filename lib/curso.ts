// Forma do currículo. **Sem dado.**
//
// Até 29/jul/2026 este arquivo continha as 17 aulas escritas à mão, duplicando o que o
// `supabase/seed.sql` já punha no banco. Saíram daqui por decisão do Pedro: o admin vai editar
// título, descrição, link de vídeo e materiais pelo painel, e painel não edita código. O banco
// virou fonte única, e o que ficou aqui é a lógica pura que opera sobre ele.
//
// `n` é o número da aula na URL (0 = boas-vindas; 1..16 = módulos I a IV). `modulo` é o índice
// (0..4), que é o `ord` do módulo no banco.

export type Modulo = {
  idx: number;
  label: string; // "Módulo 0", "Módulo I", ...
  titulo: string;
  docente?: string;
};

/** O numeral de cada módulo pelo `ord`. Mora aqui porque a área do aluno e o admin rotulam o
 *  mesmo módulo, e com uma cópia em cada lado o "Módulo III" de uma tela viraria "Módulo 3" na
 *  outra sem ninguém notar. */
export const ROMANO = ["0", "I", "II", "III", "IV"];
export const rotuloModulo = (ord: number) => `Módulo ${ROMANO[ord] ?? ord}`;

export type Aula = {
  /** `lessons.id`. É por ele que o progresso é gravado. */
  id: string;
  n: number; // número na URL (0..16)
  modulo: number; // índice do módulo (0..4)
  numero: string; // rótulo exibido ("" para boas-vindas, "01".."16")
  titulo: string;
  descricao: string;
  /** `lessons.panda_video_id`. Nulo enquanto o vídeo real não existe. */
  video: string | null;
  /** `lessons.conta_no_gate`: entra na conta que libera a prova. É o checkbox do admin. */
  avaliada: boolean;
};

/** O currículo carregado, com a lógica já amarrada a ele. */
export type Curriculo = {
  modulos: Modulo[];
  aulas: Aula[];
  /** Aulas que contam para o gate da prova (`conta_no_gate` do banco). */
  totalAvaliadas: number;
  primeiraAulaDoModulo(idx: number): Aula;
  aulaAtual(concluidas: Set<number>): Aula;
  provaLiberada(concluidas: Set<number>): boolean;
  aulasRestantes(concluidas: Set<number>): number;
  acharAula(n: number): { aula: Aula; pos: number } | null;
  progressoPct(concluidas: Set<number>): number;
};

/** URL da aula. Não depende do currículo, só do que a própria aula carrega. */
export function href(a: Aula): string {
  return `/app/modulo/${a.modulo}/aula/${a.n}`;
}

/**
 * Amarra a lógica do curso a um conjunto de módulos e aulas.
 *
 * As funções vêm prontas em vez de receberem o currículo em cada chamada porque quase todo
 * consumidor usa três ou quatro delas seguidas: passar a lista toda vez espalharia o mesmo
 * argumento por dezenas de linhas sem ganhar nada.
 */
export function montarCurriculo(modulos: Modulo[], aulas: Aula[]): Curriculo {
  // Até 17/ago/2026 isto era `a.n >= 1` ("tudo menos a boas-vindas"), e o `conta_no_gate` que o
  // admin edita era letra morta: o checkbox gravava no banco e ninguém lia. O Pedro marcou a
  // boas-vindas pelo painel esperando efeito, e o efeito não veio — desde então o gate lê a
  // coluna, que é o que a tela promete.
  const avaliadas = aulas.filter((a) => a.avaliada);

  return {
    modulos,
    aulas,
    totalAvaliadas: avaliadas.length,

    // Primeira aula de um módulo (destino do card da Home). O fallback para `aulas[0]` só
    // acontece com módulo sem aula nenhuma, e nesse caso o card nem navega (o template o
    // marca travado): fica como rede de segurança, não como destino real.
    primeiraAulaDoModulo: (idx) => aulas.find((a) => a.modulo === idx) ?? aulas[0],

    // Aula atual = primeira ainda não concluída (destino do "Continuar").
    aulaAtual: (concluidas) =>
      aulas.find((a) => !concluidas.has(a.n)) ?? aulas[aulas.length - 1],

    // Prova Final libera só com as aulas avaliadas todas concluídas. Zero avaliadas NÃO
    // libera: `[].every()` é true, e um admin que desmarcasse todo `conta_no_gate` abriria
    // a prova para a base inteira sem tocar em prova nenhuma.
    provaLiberada: (concluidas) =>
      avaliadas.length > 0 && avaliadas.every((a) => concluidas.has(a.n)),
    aulasRestantes: (concluidas) => avaliadas.filter((a) => !concluidas.has(a.n)).length,

    acharAula: (n) => {
      const pos = aulas.findIndex((a) => a.n === n);
      return pos < 0 ? null : { aula: aulas[pos], pos };
    },

    // % sobre a mesma base da contagem exibida (no design: "7 de 16"). Numerador e
    // denominador contam SÓ as avaliadas: `concluidas.size` inclui a boas-vindas, e com ela
    // no numerador o contador dizia "17 de 16" e a barra passava de 100%.
    progressoPct: (concluidas) => {
      if (avaliadas.length === 0) return 0;
      const feitas = avaliadas.filter((a) => concluidas.has(a.n)).length;
      return Math.round((feitas / avaliadas.length) * 100);
    },
  };
}

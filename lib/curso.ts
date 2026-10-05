// Forma do currículo. **Sem dado.**
//
// Até 29/jul/2026 este arquivo continha as 17 aulas escritas à mão, duplicando o que o
// `supabase/seed.sql` já punha no banco. Saíram daqui por decisão do Pedro: o admin vai editar
// título, descrição, link de vídeo e materiais pelo painel, e painel não edita código. O banco
// virou fonte única, e o que ficou aqui é a lógica pura que opera sobre ele.
//
// `n` é a posição global da aula no curso, a partir de 0. `modulo` é o índice (0..3), que é o
// `ord` do módulo no banco. Desde 05/out/2026 o curso tem 4 módulos e não tem mais o Módulo 0 de
// boas-vindas: o ord 0 é o Módulo I, o 1 é o II, e assim por diante (`rotuloModulo`).

export type Modulo = {
  /** `modules.id`. Entrou em 29/set para o calendário do aluno (`lib/calendario.ts`). */
  id: string;
  idx: number;
  label: string; // "Módulo I", "Módulo II", ...
  titulo: string;
  docente?: string;
};

/** O numeral de cada módulo pelo `ord`. Mora aqui porque a área do aluno e o admin rotulam o
 *  mesmo módulo, e com uma cópia em cada lado o "Módulo III" de uma tela viraria "Módulo 3" na
 *  outra sem ninguém notar.
 *
 *  Desde 05/out/2026 o ord 0 é o Módulo I. O `ord` continua começando em 0 porque a política de
 *  liberação e o calendário indexam as regras pela posição (`regras[ord]`); só o rótulo mudou. */
export const ROMANO = ["I", "II", "III", "IV"];
export const rotuloModulo = (ord: number) => `Módulo ${ROMANO[ord] ?? ord}`;

export type Aula = {
  /** `lessons.id`. É por ele que o progresso é gravado. */
  id: string;
  n: number; // posição global no curso, a partir de 0
  modulo: number; // índice do módulo (0..3), o `ord` do banco
  numero: string; // rótulo exibido, "01" em diante na ordem do curso
  /**
   * Posição da aula DENTRO do módulo, a partir de 1. Entrou em 30/set/2026 com a página do módulo:
   * é o "Aula 3" da playlist, o `?aula=3` da URL e o `#aula-3` da seção do notebook. O `n` global
   * continua sendo a chave do progresso; a posição é só endereço e rótulo.
   */
  pos: number;
  /** `lessons.duracao`, em segundos. Nulo enquanto ninguém cadastrou. */
  duracao: number | null;
  titulo: string;
  descricao: string;
  /** `lessons.panda_video_id`. Nulo enquanto o vídeo real não existe. */
  video: string | null;
  /**
   * `lessons.conta_no_gate`: entra na conta que emite o certificado. É o checkbox do admin. O nome
   * da coluna é de quando o curso tinha prova e o gate liberava a prova; o sentido hoje é "conta
   * para a conclusão".
   */
  avaliada: boolean;
};

/** O currículo carregado, com a lógica já amarrada a ele. */
export type Curriculo = {
  modulos: Modulo[];
  aulas: Aula[];
  /** Aulas que contam para a conclusão e o certificado (`conta_no_gate` do banco). */
  totalAvaliadas: number;
  primeiraAulaDoModulo(idx: number): Aula;
  aulaAtual(concluidas: Set<number>): Aula;
  formacaoConcluida(concluidas: Set<number>): boolean;
  aulasRestantes(concluidas: Set<number>): number;
  acharAula(n: number): { aula: Aula; pos: number } | null;
  progressoPct(concluidas: Set<number>): number;
};

/**
 * URL da aula. Não depende do currículo, só do que a própria aula carrega.
 *
 * Desde 30/set/2026 a aula não tem página própria: ela toca no teatro da página do módulo, e o
 * `?aula=` escolhe qual. A seleção fica na URL, e não em estado de cliente, para o link funcionar
 * sem JS, ser compartilhável e sair certo num e-mail. O `#aula-<pos>` é a seção da aula no notebook
 * do módulo. A rota antiga (`/app/modulo/[m]/aula/[n]`) virou redirect para cá.
 */
export function href(a: Aula): string {
  return `/app/modulo/${a.modulo}?aula=${a.pos}#aula-${a.pos}`;
}

/**
 * Amarra a lógica do curso a um conjunto de módulos e aulas.
 *
 * As funções vêm prontas em vez de receberem o currículo em cada chamada porque quase todo
 * consumidor usa três ou quatro delas seguidas: passar a lista toda vez espalharia o mesmo
 * argumento por dezenas de linhas sem ganhar nada.
 */
export function montarCurriculo(modulos: Modulo[], aulas: Aula[]): Curriculo {
  // Até 17/ago/2026 isto era `a.n >= 1` ("tudo menos a aula de boas-vindas"), e o `conta_no_gate`
  // que o admin edita era letra morta: o checkbox gravava no banco e ninguém lia. Desde então o
  // gate lê a coluna, que é o que a tela promete.
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

    // A formação está concluída quando todas as aulas que contam estão concluídas, e é isso que
    // emite o certificado desde 30/set/2026 (o curso deixou de ter prova). Zero avaliadas NÃO
    // conclui: `[].every()` é true, e um admin que desmarcasse todo `conta_no_gate` daria o
    // certificado à base inteira sem ninguém ter assistido a nada.
    formacaoConcluida: (concluidas) =>
      avaliadas.length > 0 && avaliadas.every((a) => concluidas.has(a.n)),
    aulasRestantes: (concluidas) => avaliadas.filter((a) => !concluidas.has(a.n)).length,

    acharAula: (n) => {
      const pos = aulas.findIndex((a) => a.n === n);
      return pos < 0 ? null : { aula: aulas[pos], pos };
    },

    // % sobre a mesma base da contagem exibida (no design: "7 de 16"). Numerador e
    // denominador contam SÓ as avaliadas: `concluidas.size` pode incluir aula que não conta, e
    // com ela no numerador o contador passaria do total e a barra de 100%.
    progressoPct: (concluidas) => {
      if (avaliadas.length === 0) return 0;
      const feitas = avaliadas.filter((a) => concluidas.has(a.n)).length;
      return Math.round((feitas / avaliadas.length) * 100);
    },
  };
}

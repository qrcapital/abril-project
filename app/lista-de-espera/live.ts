/**
 * A live de lançamento, num lugar só.
 *
 * ┌─ O QUE ISTO CONSERTA ─────────────────────────────────────────────────────────────────────────┐
 * │ Até 28/set/2026 a data estava escrita à mão dentro do JSX, uma vez, sem ano e sem lógica       │
 * │ nenhuma de vencimento. No dia seguinte à live a página continuaria vendendo "28 de setembro,   │
 * │ 21h · AO VIVO · Garanta seu lugar" para um evento encerrado, os verbos do teaser continuariam  │
 * │ no futuro, o primeiro benefício da pré-lista continuaria sendo um convite que ninguém mais     │
 * │ receberia, e o card de confirmação diria isso na cara de quem acabou de entregar nome, e-mail  │
 * │ e telefone. Cinco mentiras a partir de uma string.                                            │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * A data de virada não é o começo da live, é o fim dela mais folga. Trocar o texto às 21h01, com a
 * transmissão no ar, seria o erro oposto e mais caro: a página passaria a dizer que já aconteceu
 * exatamente enquanto as pessoas tentam entrar.
 */

/** Início da transmissão. Fuso explícito: sem ele, o mesmo literal vira 18h no servidor em UTC. */
export const LIVE_EM = new Date("2026-09-28T21:00:00-03:00");

/** Folga até o texto virar. Cobre a transmissão e o que costuma passar dela. */
const HORAS_DE_FOLGA = 3;

const FIM = LIVE_EM.getTime() + HORAS_DE_FOLGA * 3_600_000;

/**
 * Já passou?
 *
 * ARMADILHA: a rota é estática, então isto é avaliado NO BUILD, não a cada visita. É por isso que
 * a `page.tsx` declara `revalidate`: sem ele, uma página construída hoje de manhã continuaria
 * dizendo "ao vivo" para sempre, e este arquivo inteiro seria teatro. Com ele, a virada acontece
 * na primeira revalidação depois do horário, e o atraso máximo é o intervalo declarado lá.
 */
export const livePassou = (agora: number = Date.now()): boolean => agora > FIM;

/**
 * "28 de setembro, 21h", formatado a partir da própria data.
 *
 * Formatado e não escrito à mão porque o valor e o rótulo precisam ser a mesma coisa: com os dois
 * separados, adiar a live vira uma edição em dois lugares e um deles fica para trás.
 *
 * `timeZone` fixo em São Paulo: a formatação roda no servidor, cujo relógio está em UTC, e sem isso
 * as 21h viram 0h do dia 29.
 */
const dia = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  timeZone: "America/Sao_Paulo",
}).format(LIVE_EM);

const hora = new Intl.DateTimeFormat("pt-BR", {
  hour: "numeric",
  timeZone: "America/Sao_Paulo",
}).format(LIVE_EM);

export const LIVE_QUANDO = `${dia}, ${hora}h`;

/**
 * Os textos que mudam com a virada.
 *
 * Ficam juntos aqui, e não espalhados em ternários no meio do JSX, para a versão pós-live poder ser
 * lida inteira de uma vez. Quem for adiar a live muda `LIVE_EM` e confere esta lista; quem for
 * escrever o texto do "depois" não precisa caçar cinco arquivos.
 *
 * A promessa muda de CONVITE para GRAVAÇÃO. É a única troca honesta: quem entra na lista depois da
 * transmissão não tem como receber um convite, mas tem como receber o que foi transmitido.
 */
export const COPY_LIVE = {
  antes: {
    beneficio: "Convite para a live de lançamento",
    rotuloTeaser: "Confira na live de lançamento:",
    verbo: "mostram",
    chamada: "Garanta seu lugar →",
    selo: "Ao vivo",
    confirmacao: "O convite da live e o aviso da abertura chegam no e-mail que você cadastrou.",
    descricao:
      "Entre na pré-lista da formação Estratégia Internacional e receba o convite da live de lançamento e o aviso da abertura das inscrições.",
  },
  depois: {
    beneficio: "Gravação da live de lançamento",
    rotuloTeaser: "O que a live de lançamento mostrou:",
    verbo: "mostraram",
    chamada: "Receba a gravação →",
    selo: "Gravação",
    confirmacao: "A gravação da live e o aviso da abertura chegam no e-mail que você cadastrou.",
    descricao:
      "Entre na pré-lista da formação Estratégia Internacional e receba a gravação da live de lançamento e o aviso da abertura das inscrições.",
  },
} as const;

/** O conjunto certo para agora. Uma chamada, para ninguém misturar as duas versões na mesma tela. */
export const copyDaLive = (agora?: number) =>
  livePassou(agora) ? COPY_LIVE.depois : COPY_LIVE.antes;

import "server-only";
import { cache } from "react";

import { getCurriculo } from "./curriculo";
import {
  calendarioDoAluno,
  conclusaoDosModulos,
  dataCurta,
  liberacao,
  type MotivoLiberacao,
} from "./liberacao";
import { getMatricula } from "./matricula";
import { getRegras } from "./politicas";
import { getConclusoesDasAulas } from "./progresso";

// O calendário do aluno logado, pronto para tela: matrícula + política + módulos + progresso,
// numa chamada só. Nasceu em 29/set/2026 com a regra `apos_modulo`, quando a liberação passou
// a depender do progresso e cada guarda teria de juntar as quatro fontes por conta própria. As
// guardas (aula, marcar aula, prova) e a home leem daqui, e a tela de boas-vindas e a trilha do
// curso vão ler também: um cálculo só, para a trilha nunca dizer "aberto" de um módulo que a
// guarda da aula recusa.
//
// A regra é do `lib/liberacao.ts` (puro, com self-check); este arquivo só faz IO e formata.

/**
 * Um módulo no calendário do aluno logado. Ordenado por `ord`.
 *
 * Os campos de data seguem uma convenção só: `abreEm` é o instante, `abreEmTexto` é o mesmo
 * instante escrito "13/10" no fuso de Brasília (nunca o do servidor, que na Netlify é UTC).
 */
export type ModuloCalendario = {
  /** Ord do módulo (0 = "Comece por aqui"). É o índice usado na URL e nas regras. */
  ord: number;
  /** `modules.id`. */
  id: string;
  titulo: string;
  /**
   * Texto de apoio do módulo. Sempre `null` por ora: `modules` não tem coluna de descrição
   * (só `titulo`, `docente` e `arte`). O campo existe para a tela não mudar de forma quando ela
   * entrar; até lá, `docente` é o que há para a linha de apoio.
   */
  descricao: string | null;
  /** Nome do docente, quando o módulo tem. */
  docente: string | null;
  /** Total de aulas do módulo (todas, avaliadas ou não). */
  aulas: number;
  /** Quantas dessas o aluno concluiu. */
  concluidas: number;
  /**
   * Quando abre, ou quando abriu. `null` = sem data: em breve, ou esperando a conclusão do
   * módulo pré-requisito (`motivo === "apos_modulo"`). Aberto pela liberação total antes da hora:
   * o início da matrícula.
   */
  abreEm: Date | null;
  /** `abreEm` como "13/10", no fuso America/Sao_Paulo. `null` junto com `abreEm`. */
  abreEmTexto: string | null;
  /** O aluno pode entrar nas aulas agora. É o mesmo veredito das guardas da aula e da prova. */
  aberto: boolean;
  /** Todas as aulas concluídas (módulo sem aula nunca está concluído). */
  concluido: boolean;
  /** O primeiro módulo aberto e não concluído, na ordem: "onde o aluno está". No máximo um. */
  atual: boolean;
  /** Por que está como está: o tipo da regra, ou `total` (aberto pela chave do admin). */
  motivo: MotivoLiberacao;
  /** Em `apos_modulo`: o ord do módulo que precisa ser concluído antes. Senão `null`. */
  dependeDe: number | null;
};

export type Calendario = {
  /** Âncora do calendário: `enrollments.inicio_em` da matrícula vigente. */
  inicioEm: Date;
  modulos: ModuloCalendario[];
  /** Ords abertos, para as guardas (`abertos.has(aula.modulo)`). */
  abertos: Set<number>;
  /** Todo módulo exigido (não em breve) aberto: é a trava de calendário da prova. */
  completo: boolean;
};

/**
 * O calendário do aluno logado, uma vez por requisição. `null` quando não há matrícula (sem
 * âncora não há calendário: tudo fechado, e quem explica o porquê é o estado da matrícula).
 *
 * Não confere se a matrícula está ATIVA: isso é da guarda do layout de `(sala)`, que roda antes.
 */
export const getCalendario = cache(async (): Promise<Calendario | null> => {
  const [matricula, curriculo, concluidasEm] = await Promise.all([
    getMatricula(),
    getCurriculo(),
    getConclusoesDasAulas(),
  ]);
  if (!matricula.inicioEm) return null;
  const regras = await getRegras(matricula.politicaId);

  const conclusoes = conclusaoDosModulos(curriculo.aulas, concluidasEm);
  // Um `agora` só para as duas contas abaixo: com dois relógios, um módulo que abre no meio da
  // requisição poderia sair aberto numa e fechado na outra.
  const agora = new Date();
  const { inicioEm, liberacaoTotal } = matricula;
  const entradas = calendarioDoAluno({ inicioEm, liberacaoTotal, regras, conclusoes, agora });
  const { abertos, completo } = liberacao(inicioEm, liberacaoTotal, regras, agora, conclusoes);
  const porOrd = new Map(entradas.map((e) => [e.ord, e]));

  let achouAtual = false;
  const modulos = curriculo.modulos.map((m): ModuloCalendario => {
    const doModulo = curriculo.aulas.filter((a) => a.modulo === m.idx);
    const feitas = doModulo.filter((a) => concluidasEm.has(a.id)).length;
    const e = porOrd.get(m.idx);
    const aberto = e?.aberto ?? false;
    const concluido = doModulo.length > 0 && feitas === doModulo.length;
    const atual = !achouAtual && aberto && !concluido;
    if (atual) achouAtual = true;
    const regra = regras[m.idx];
    return {
      ord: m.idx,
      id: m.id,
      titulo: m.titulo,
      descricao: null,
      docente: m.docente ?? null,
      aulas: doModulo.length,
      concluidas: feitas,
      abreEm: e?.abreEm ?? null,
      abreEmTexto: e?.abreEm ? dataCurta(e.abreEm) : null,
      aberto,
      concluido,
      atual,
      motivo: e?.motivo ?? "em_breve",
      dependeDe: regra?.tipo === "apos_modulo" ? regra.modulo : null,
    };
  });

  return { inicioEm, modulos, abertos, completo };
});

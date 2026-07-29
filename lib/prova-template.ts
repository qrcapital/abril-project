// Preenche as telas portadas da prova com os dados reais da tentativa: enunciado,
// alternativas, cronômetro, contadores e o desempenho por módulo do resultado.
// Mesma abordagem do `home-template.ts`: substituição sobre o HTML gerado pelo porte,
// mantendo os estilos exatos do design.
//
// ponytail: o acoplamento é com o texto placeholder e os atributos que o
// `scripts/port-area.mjs` emite. Se um porte futuro mudar o markup, as funções abaixo
// avisam alto em vez de servir placeholder (ver `exigir`). A alternativa robusta seria o
// porte emitir tokens `{{ }}`, e é o caminho se isso passar a incomodar.

// Extensão explícita de propósito: além do Next, este módulo é importado pelo
// `scripts/prova-check.mts` rodando em node puro, e o ESM do node não resolve
// especificador sem extensão.
import {
  LETRAS,
  NOTA_MINIMA,
  formatarTempo,
  type Correcao,
  type QuestaoCliente,
} from "./prova-correcao.ts";
import { esc, exigir } from "./html-slice.ts";

const ALT_BASE =
  "display:flex;align-items:center;gap:14px;padding:15px 18px;border-radius:10px;cursor:pointer;margin-bottom:10px;transition:all .14s ease";
const ALT_OFF = `${ALT_BASE};border:1.5px solid #E4DACC;background:#fff`;
const ALT_ON = `${ALT_BASE};border:1.5px solid #A98E4E;background:#FBF6EC`;

const BOLA_BASE =
  "width:26px;height:26px;flex:0 0 auto;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700";
const BOLA_OFF = `${BOLA_BASE};border:1.5px solid #C9BCA8;color:#7E6836`;
const BOLA_ON = `${BOLA_BASE};border:1.5px solid #A98E4E;background:#A98E4E;color:#fff`;

const TEXTO_ALT = "font-size:13.5px;color:#333333;line-height:1.4";

export function fillQuestao(
  html: string,
  dados: {
    questao: QuestaoCliente;
    posicao: number;
    total: number;
    respondidas: number;
    escolhida?: string;
    restanteMs: number;
  },
): string {
  const { questao, posicao, total, respondidas, escolhida, restanteMs } = dados;

  // Os blocos data-alt contêm apenas <span>, nunca outro <div>, então o primeiro
  // </div> depois do bloco "D" fecha exatamente o último deles.
  const alternativas = questao.alternativas
    .map((texto, i) => {
      const letra = LETRAS[i] ?? String(i + 1);
      const sel = escolhida === letra;
      return (
        `<div data-alt="${letra}" style="${sel ? ALT_ON : ALT_OFF}">` +
        `<span style="${sel ? BOLA_ON : BOLA_OFF}">${letra}</span>` +
        `<span style="${TEXTO_ALT}">${esc(texto)}</span>` +
        `</div>`
      );
    })
    .join("");

  let out = exigir(
    html,
    /<div data-alt="A"[\s\S]*?data-alt="D"[\s\S]*?<\/div>/,
    alternativas,
    "bloco de alternativas",
  );

  // Enunciado: é o único <h2> da tela.
  out = exigir(
    out,
    /(<h2[^>]*>)[\s\S]*?(<\/h2>)/,
    `$1${esc(questao.enunciado)}$2`,
    "enunciado (h2)",
  );

  // Ordem importa: "Questão 1 de 20" contém "Questão 1", então o mais específico
  // primeiro. As duas âncoras usam a tag de fechamento para não se sobreporem.
  out = exigir(out, ">Questão 1 de 20<", `>Questão ${posicao} de ${total}<`, "cabeçalho X de Y");
  out = exigir(out, ">0 respondidas<", `>${respondidas} respondidas<`, "contador de respondidas");
  out = exigir(out, ">Questão 1</span>", `>Questão ${posicao}</span>`, "kicker da questão");
  out = exigir(out, ">120:00<", `>${formatarTempo(restanteMs)}<`, "cronômetro");

  // Barra de progresso = posição na prova. Assada no servidor para não piscar no valor
  // padrão antes do JS assumir.
  const pct = Math.min(100, Math.max(5, Math.round((posicao / total) * 100)));
  out = out.replace("width:5%", `width:${pct}%`);

  if (posicao >= total) out = out.replace(">Próxima →<", ">Enviar prova<");

  return out;
}

/**
 * Corte que separa módulo bem resolvido de módulo deficitário no desempenho por módulo.
 * É a mesma nota de aprovação da prova, de propósito: o que reprovaria isolado é o que o
 * aluno precisa rever, mesmo tendo passado no conjunto.
 */
const CORTE_MODULO = NOTA_MINIMA;

// Cores do desempenho por módulo. Todas medidas em 28/jul; ver `docs/FEEDBACK-UX.md`.
// Texto precisa de 4,5:1 (AA, 12px) e barra de 3,0:1 (WCAG 1.4.11, objeto gráfico).
const OK_TEXTO = "#1B7A50"; // 5,32:1 sobre branco. O #1F8A5B do design dava 4,33 e falhava
const OK_BARRA = "#1F8A5B"; // 3,50:1 sobre o trilho #EDE6DD
const FRACO_TEXTO = "#7A4E06"; // 5,71:1 sobre a pill
const FRACO_PILL = "#F7E3BE"; // o amarelo vive no FUNDO, onde não há exigência de 4,5
const FRACO_BARRA = "#AA7010"; // 3,37:1 sobre o trilho. Âmbar vivo (#e0a54e) dava 1,76

/**
 * Preenche o resultado. `modulos` é a ordem em que as linhas de desempenho aparecem no
 * design (I, II, III, IV); um módulo sem questão sorteada entra como 0%.
 *
 * Os rótulos dos módulos ficam como o porte emitiu, porque são copy aprovado. Número e cor
 * passam a ser reais.
 *
 * **A cor é calculada, não herdada do design** (decisão do Pedro, 28/jul). O design pintava
 * os quatro percentuais de verde na tela de aprovado, partindo de números uniformemente bons;
 * com nota real, um aprovado com 40% num módulo veria 40% em verde, ou seja, a tela pintaria
 * a deficiência como sucesso. E na tela de reprovado o design fixava vermelho nas linhas 3 e
 * 4, então uma linha com 90% real herdava o vermelho do 42% de exemplo.
 *
 * A mesma regra vale nas duas variantes: o vermelho da reprovação continua onde ele significa
 * algo, no veredito grande, e não nas linhas de diagnóstico.
 */
export function fillResultado(html: string, c: Correcao, modulos: number[]): string {
  // Nota grande: 85 na variante aprovada, 55 na reprovada. Mesmo cuidado do `exigir`:
  // conferir presença, porque uma nota real de 85 produziria saída idêntica à do design.
  const NOTA = />(?:85|55)(<span style="font-size:(?:30|27)px)/;
  let out = exigir(html, NOTA, `>${c.score}$1`, "nota grande");

  const pcts = modulos.map((m) => c.porModulo.find((d) => d.modulo === m)?.pct ?? 0);

  // Percentual: o bom fica texto simples; o deficitário vira pill âmbar, que dá o destaque
  // de bate-pronto sem depender de cor de texto que não passaria AA.
  let iLabel = 0;
  out = out.replace(/<span style="color:[^"]*"[^>]*>\d+%<\/span>/g, () => {
    const p = pcts[iLabel++] ?? 0;
    return p >= CORTE_MODULO
      ? `<span style="color:${OK_TEXTO};font-weight:700">${p}%</span>`
      : `<span style="color:${FRACO_TEXTO};font-weight:700;background:${FRACO_PILL};` +
          `border-radius:4px;padding:2px 7px">${p}%</span>`;
  });

  // Barra: `width` e `background` juntos, porque o design fixava dourado na tela de aprovado
  // e um gradiente vermelho nas linhas fracas da de reprovado.
  let iBar = 0;
  out = out.replace(
    /<i style="display:block;height:100%;width:\d+%;background:[^"]*;border-radius:3px">/g,
    () => {
      const p = pcts[iBar++] ?? 0;
      const cor = p >= CORTE_MODULO ? OK_BARRA : FRACO_BARRA;
      return `<i style="display:block;height:100%;width:${p}%;background:${cor};border-radius:3px">`;
    },
  );

  if (iLabel !== modulos.length || iBar !== modulos.length)
    throw new Error(
      `[prova-template] esperava ${modulos.length} linhas de desempenho, achei ${iLabel} rotulos e ${iBar} barras`,
    );

  return out;
}

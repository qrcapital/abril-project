// Preenche a Home (vitrine) com dados de lib/curso: banner "Continue de onde
// parou" e os cards de módulo (contador, %, estado). Fonte única de verdade —
// muda o progresso, muda a Home. Mantém os estilos exatos do design.
//
// 07/out/2026: título do card em Jost 500 (era Playfair) e rótulos em Jost 600 com tracking de
// .07em (eram .14em e .16em), o mesmo rótulo único da sala (`.sl-eyebrow` em sala.css).

import type { Curriculo } from "./curso";
import { esc, innerOfDiv } from "./html-slice.ts";

const BADGE_BASE =
  "position:absolute;top:10px;left:10px;z-index:3;font-size:10px;font-weight:600;letter-spacing:.07em;font-family:'Jost',sans-serif;border-radius:4px;padding:3px 7px";
// Capa do módulo, desenhada em HTML e CSS (07/out/2026). Substitui as imagens geradas no gpt-image
// em 06/out, que o Marcelo achou fracas e despadronizadas: cada numeral romano tinha um tamanho
// (I estreito, III largo) e cada título outro corpo. Aqui as quatro capas são o mesmo molde:
// numeral arábico de dois dígitos (01 a 04, todos com a mesma largura em Jost tabular), título no
// mesmo corpo e na mesma altura, docente no pé. Tudo em `cqw` (unidade do contêiner), então a capa
// escala com o card sem quebrar a proporção, nítida em qualquer tela, sem imagem para baixar.
// Fundo grafite com um halo do vermelho da casa no canto, filete vermelho curto sobre a régua.
// Título e docente vêm do banco (o admin edita): passam por `esc()`.
function capaModulo(idx: number, titulo: string, docente: string | null): string {
  const n = String(idx + 1).padStart(2, "0");
  const fundo =
    "radial-gradient(110% 70% at 105% -5%,rgba(193,18,31,.50) 0%,rgba(193,18,31,0) 65%)," +
    "radial-gradient(80% 45% at -10% 105%,rgba(142,21,34,.30) 0%,rgba(142,21,34,0) 70%)," +
    "linear-gradient(170deg,#24201c 0%,#131210 60%,#0f0e0d 100%)";
  return (
    `<div aria-hidden="true" style="position:absolute;inset:0;container-type:inline-size;overflow:hidden;font-family:'Jost',system-ui,sans-serif;color:#f5f1ea;background:${fundo}">` +
    `<div style="position:absolute;inset:0;box-shadow:inset 0 1px 0 rgba(255,255,255,.07)"></div>` +
    `<div style="position:absolute;left:9cqw;top:22cqw;font-size:4.2cqw;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(245,241,234,.5)">Módulo</div>` +
    `<div style="position:absolute;left:7cqw;top:26cqw;font-size:56cqw;font-weight:400;line-height:1;letter-spacing:-.055em;font-variant-numeric:lining-nums tabular-nums;background:linear-gradient(180deg,#fffdf8 10%,#bdb3a4 95%);-webkit-background-clip:text;background-clip:text;color:transparent">${n}</div>` +
    `<div style="position:absolute;left:9cqw;right:9cqw;top:94cqw;height:1px;background:linear-gradient(90deg,#d0222f 0 14cqw,rgba(245,241,234,.16) 14cqw)"></div>` +
    `<div style="position:absolute;left:9cqw;right:9cqw;top:100cqw;font-size:8.8cqw;font-weight:500;line-height:1.12;letter-spacing:-.012em;color:#fbf8f2;text-wrap:balance">${esc(titulo)}</div>` +
    (docente
      ? `<div style="position:absolute;left:9cqw;right:9cqw;bottom:8.5cqw;font-size:3.9cqw;line-height:1.35;color:rgba(245,241,234,.55)">${esc(docente)}</div>`
      : "") +
    `</div>`
  );
}

const BADGE_ATIVO = `${BADGE_BASE};background:#C1121F;color:#fdfbf6`;
const BADGE_NEUTRO = `${BADGE_BASE};background:#EDE6DD;border:1px solid #E0D3BE;color:#7E6836`;
// Módulo ainda fechado pela esteira. Pill âmbar (DESIGN.md §2): cor como informação, não como
// decoração.
const BADGE_TRAVADO = `${BADGE_BASE};background:#F7E3BE;border:1px solid #E8CE97;color:#7A4E06`;

/**
 * Por que um módulo está fechado, na língua do card. Monta quem conhece o calendário (a página
 * da home); o template só escreve.
 *
 * - `data`: abre numa data conhecida, já formatada ("13/10", fuso de Brasília).
 * - `apos`: espera o aluno concluir outro módulo, sem data ainda (`rotulo` = "Módulo I").
 * - `breve`: fechado sem data (política em breve, 0016).
 */
export type Travamento =
  | { tipo: "data"; texto: string }
  | { tipo: "apos"; rotulo: string }
  | { tipo: "breve" };

function card(
  c: Curriculo,
  idx: number,
  concluidas: Set<number>,
  espera: Travamento | null,
): string {
  // `espera` nula quer dizer aberto.
  const m = c.modulos[idx];
  const aulas = c.aulas.filter((a) => a.modulo === idx);
  const total = aulas.length;
  // Módulo sem aula nenhuma (recém-criado no admin) se comporta como travado: não há para
  // onde ir, e o fallback do destino mandaria o clique para a primeira aula do curso. O `data-travado`
  // é o que o HomeClient já usa para não navegar.
  const travado = espera !== null || total === 0;
  const done = aulas.filter((a) => concluidas.has(a.n)).length;
  const emAndamento =
    (done > 0 && done < total) || aulas.some((a) => a.n === c.aulaAtual(concluidas).n);

  // A data, e não mais a contagem ("ABRE EM 6 DIAS"), desde 29/set: com a esteira semanal o
  // aluno planeja a semana pelo dia em que o módulo sai, e uma contagem que muda todo dia
  // obriga a fazer a conta de cabeça. Pedido do Pedro, no molde do Cademi.
  const badgeText = travado
    ? total === 0 || espera === null || espera.tipo === "breve"
      ? "EM BREVE"
      : espera.tipo === "data"
        ? `LIBERA EM ${espera.texto}`
        : esc(`APÓS O ${espera.rotulo.toUpperCase()}`)
    : emAndamento
      ? "EM ANDAMENTO"
      : "DISPONÍVEL";
  const badge = travado ? BADGE_TRAVADO : emAndamento ? BADGE_ATIVO : BADGE_NEUTRO;
  // Título e docente vêm do banco e o admin edita os dois: sem `esc()` é XSS armazenado.
  // Só o módulo no rótulo do pé (08/out/2026): o docente já está na capa, logo acima, e o rótulo com
  // os dois nomes ("MÓDULO I · FELIPPE HERMES E RODOLFO BASTOS") só cabia em 8,5px. O selo do módulo
  // aberto e ainda não começado dizia "AULAS", que não é estado; agora diz "DISPONÍVEL".
  const label = esc(m.label.toUpperCase());
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const count = done === total ? `${done}/${total} ✓` : `${done}/${total}`;
  const countColor = done > 0 ? "#7E6836" : "#6f6860";
  const aulasTxt = total === 1 ? "1 aula" : `${total} aulas`;

  const trava = travado ? "opacity:.72;cursor:default" : "cursor:pointer";
  return `<div class="mcard"${travado ? ' data-travado="1"' : ""} style="background:#fff;border:1px solid #E4DACC;border-radius:13px;overflow:hidden;${trava};position:relative;display:flex;flex-direction:column;box-shadow:0 6px 18px rgba(72,60,42,.05)"><span style="${badge}">${badgeText}</span><div style="position:relative;aspect-ratio:2/3;flex:0 0 auto;background:#F7F3EC">${capaModulo(m.idx, m.titulo, m.docente ?? null)}</div><div style="padding:13px 15px 15px;display:flex;flex-direction:column;flex:1"><span style="font-size:11px;letter-spacing:.07em;color:#7E6836;font-weight:600;font-family:'Jost',sans-serif">${label}</span><h3 style="font-family:'Jost',sans-serif;font-size:16px;font-weight:500;margin:3px 0 9px;line-height:1.2;color:#1a1815">${esc(m.titulo)}</h3><div style="height:4px;border-radius:2px;background:#EDE6DD;overflow:hidden"><i style="display:block;height:100%;width:${pct}%;background:#C1121F;border-radius:2px"></i></div><div style="display:flex;justify-content:space-between;font-size:12px;color:#6f6860;margin-top:8px"><span>${aulasTxt}</span><span style="color:${countColor};font-weight:600">${count}</span></div></div></div>`;
}

/**
 * O CARD DO CERTIFICADO, por estado do aluno. Até 30/set/2026 era o card da Prova Final, com seis
 * estados (bloqueada, liberada, em andamento, reprovado, aprovado, 2ª chamada). O curso deixou de ter
 * prova e o certificado passou a sair ao concluir as aulas, então sobraram dois: ainda não emitido,
 * com quantas aulas faltam, e emitido, que leva à tela do certificado.
 */
export type EstadoCardCertificado = "pendente" | "emitido";

const CADEADO =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7E6836" stroke-width="2">' +
  '<rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>';
const CHECK =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1B7A50" stroke-width="2">' +
  '<circle cx="12" cy="12" r="9"></circle><path d="M8.3 12.3l2.4 2.4 5-5.4"></path></svg>';

/** A linha de baixo do card. Cabe em uma linha do card da prateleira; ao mexer, conte os caracteres. */
function linhaCertificado(c: Curriculo, concluidas: Set<number>, estado: EstadoCardCertificado): string {
  if (estado === "emitido") return `${CHECK} Emitido · baixe seu certificado`;
  const faltam = c.aulasRestantes(concluidas);
  // Tudo concluído e sem linha no banco: a emissão falhou ou a conclusão é anterior a ela. O clique
  // leva à tela do certificado, que emite no resgate.
  if (faltam === 0 && c.totalAvaliadas > 0) return `${CHECK} Aulas concluídas · abra seu certificado`;
  // O total sai do currículo, não da frase: ele acompanha o `conta_no_gate` que o admin edita.
  return `${CADEADO} Sai ao concluir as ${c.totalAvaliadas} aulas · ${faltam === 1 ? "falta 1" : `faltam ${faltam}`}`;
}

export function fillHome(
  html: string,
  c: Curriculo,
  concluidas: Set<number>,
  /** Módulos fechados e o porquê; módulo fora do mapa está aberto. */
  travados: Map<number, Travamento> = new Map(),
  /** O certificado já existe no banco para este aluno? Decide a linha e o clique do card. */
  certificado: EstadoCardCertificado = "pendente",
): string {
  const atual = c.aulaAtual(concluidas);
  const mod = c.modulos[atual.modulo];
  // `esc` no título (o admin edita) e replacement por função (um `$&` no título viraria
  // referência de grupo numa string de replacement). O número da aula é a posição dentro do
  // módulo desde 30/set/2026, o mesmo "Aula 3" da playlist da página do módulo. Sem nada
  // concluído o botão diz "Começar formação"; até 05/out/2026 isso dependia de a aula atual ser a
  // de boas-vindas (a única sem numeral), que deixou de existir com o Módulo 0.
  const linha = `${mod.label} · Aula ${atual.pos} · ${esc(atual.titulo)}`;
  const comecando = !c.aulas.some((a) => concluidas.has(a.n));

  let out = html
    .replace("Módulo II · Aula 7 · Comprando ações nos EUA", () => linha)
    .replace("Continuar Aula 7", comecando ? "Começar formação" : `Continuar Aula ${atual.pos}`);

  // A linha de baixo do card do certificado e o `data-certificado` que diz ao cliente para onde o
  // clique vai. O atributo existe para o clique NÃO depender de ler o texto do card.
  out = out.replace(
    /<div style="display:flex;align-items:center;gap:7px;font-size:11px;color:#7E6836">.*?emitido ao concluir as 16 aulas<\/div>/,
    () =>
      `<div style="display:flex;align-items:center;gap:7px;font-size:11px;color:#7E6836">${linhaCertificado(c, concluidas, certificado)}</div>`,
  );
  {
    const idx = out.indexOf(">CERTIFICADO<");
    const abre = idx >= 0 ? out.lastIndexOf('<div class="mcard"', idx) : -1;
    if (abre >= 0)
      out = `${out.slice(0, abre)}<div class="mcard" data-certificado="${certificado}"${out.slice(abre + '<div class="mcard"'.length)}`;
  }

  // O card do certificado sai da home (08/out/2026, decisão do Marcelo): o certificado vem depois, no
  // fim da formação, e a home não é lugar de cobrar as 16 aulas. O bloco inteiro de marcos
  // (`.milestones`, que só tinha esse card) é removido; a tela /app/certificado continua existindo.
  {
    const ms = out.indexOf('<div class="milestones"');
    if (ms >= 0) {
      const { end } = innerOfDiv(out, ms);
      out = out.slice(0, ms) + out.slice(end + "</div>".length);
    }
  }

  // regenera os cards da prateleira "A Formação"
  const railIdx = out.indexOf('class="rail"');
  if (railIdx >= 0) {
    const openIdx = out.lastIndexOf("<div", railIdx);
    const { start, end } = innerOfDiv(out, openIdx);
    out = out.slice(0, start) +
      c.modulos
        .map((_, i) => card(c, i, concluidas, travados.get(i) ?? null))
        .join("") +
      out.slice(end);
  }
  return out;
}

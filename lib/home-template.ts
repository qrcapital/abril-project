// Preenche a Home (vitrine) com dados de lib/curso: banner "Continue de onde
// parou" e os cards de módulo (contador, %, estado). Fonte única de verdade —
// muda o progresso, muda a Home. Mantém os estilos exatos do design.

import { AULAS, MODULOS, aulaAtual } from "./curso";

const BADGE_BASE =
  "position:absolute;top:10px;left:10px;z-index:3;font-size:8px;font-weight:800;letter-spacing:.14em;border-radius:4px;padding:3px 7px";
const BADGE_ATIVO = `${BADGE_BASE};background:linear-gradient(160deg,#D9BE85,#A98E4E);color:#0A2B1E`;
const BADGE_NEUTRO = `${BADGE_BASE};background:#EDE6DD;border:1px solid #E0D3BE;color:#7E6836`;

function card(idx: number, concluidas: Set<number>): string {
  const m = MODULOS[idx];
  const aulas = AULAS.filter((a) => a.modulo === idx);
  const total = aulas.length;
  const done = aulas.filter((a) => concluidas.has(a.n)).length;
  const emAndamento =
    (done > 0 && done < total) || aulas.some((a) => a.n === aulaAtual(concluidas).n);

  const badgeText = idx === 0 ? "BOAS-VINDAS" : emAndamento ? "EM ANDAMENTO" : "AULAS";
  const badge = emAndamento ? BADGE_ATIVO : BADGE_NEUTRO;
  const label = (m.docente ? `${m.label} · ${m.docente}` : m.label).toUpperCase();
  const pct = Math.round((done / total) * 100);
  const count = done === total ? `${done}/${total} ✓` : `${done}/${total}`;
  const countColor = done > 0 ? "#7E6836" : "#8F887E";
  const aulasTxt = total === 1 ? "1 aula" : `${total} aulas`;

  return `<div class="mcard" style="background:#fff;border:1px solid #E4DACC;border-radius:13px;overflow:hidden;cursor:pointer;position:relative;display:flex;flex-direction:column;box-shadow:0 6px 18px rgba(11,45,32,.05)"><span style="${badge}">${badgeText}</span><div style="position:relative;aspect-ratio:3/3.5;flex:0 0 auto;background:linear-gradient(160deg,#F0EADF,#E7DECF)"><div class="art-slot">Arte do módulo</div></div><div style="padding:13px 15px 15px;display:flex;flex-direction:column;flex:1"><span style="font-size:8.5px;letter-spacing:.16em;color:#7E6836;font-weight:700">${label}</span><h3 style="font-family:'Playfair Display',serif;font-size:15px;font-weight:600;margin:3px 0 9px;line-height:1.2;color:#0B2D20">${m.titulo}</h3><div style="height:4px;border-radius:2px;background:#EDE6DD;overflow:hidden"><i style="display:block;height:100%;width:${pct}%;background:#A98E4E;border-radius:2px"></i></div><div style="display:flex;justify-content:space-between;font-size:9.5px;color:#8F887E;margin-top:7px"><span>${aulasTxt}</span><span style="color:${countColor};font-weight:600">${count}</span></div></div></div>`;
}

// conteúdo interno (balanceado) de um <div> a partir do índice do seu "<div"
function innerOfDiv(html: string, openIdx: number): { start: number; end: number } {
  const start = html.indexOf(">", openIdx) + 1;
  let depth = 1;
  let i = start;
  while (depth > 0 && i < html.length) {
    const o = html.indexOf("<div", i);
    const c = html.indexOf("</div>", i);
    if (c < 0) break;
    if (o >= 0 && o < c) {
      depth++;
      i = o + 4;
    } else {
      depth--;
      i = c + 6;
    }
  }
  return { start, end: i - 6 };
}

export function fillHome(html: string, concluidas: Set<number>): string {
  const atual = aulaAtual(concluidas);
  const mod = MODULOS[atual.modulo];
  const linha = atual.numero
    ? `${mod.label} · Aula ${atual.n} · ${atual.titulo}`
    : `${mod.label} · ${atual.titulo}`;

  let out = html
    .replace("Módulo II · Aula 7 · Comprando ações nos EUA", linha)
    .replace("Continuar Aula 7", atual.numero ? `Continuar Aula ${atual.n}` : "Começar formação");

  // regenera os cards da prateleira "A Formação"
  const railIdx = out.indexOf('class="rail"');
  if (railIdx >= 0) {
    const openIdx = out.lastIndexOf("<div", railIdx);
    const { start, end } = innerOfDiv(out, openIdx);
    out = out.slice(0, start) + MODULOS.map((_, i) => card(i, concluidas)).join("") + out.slice(end);
  }
  return out;
}

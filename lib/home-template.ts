// Preenche a Home (vitrine) com dados de lib/curso: banner "Continue de onde
// parou" e os cards de módulo (contador, %, estado). Fonte única de verdade —
// muda o progresso, muda a Home. Mantém os estilos exatos do design.

import type { Curriculo } from "./curso";
import { innerOfDiv } from "./html-slice.ts";

const BADGE_BASE =
  "position:absolute;top:10px;left:10px;z-index:3;font-size:8px;font-weight:800;letter-spacing:.14em;border-radius:4px;padding:3px 7px";
const BADGE_ATIVO = `${BADGE_BASE};background:linear-gradient(160deg,#D9BE85,#A98E4E);color:#0A2B1E`;
const BADGE_NEUTRO = `${BADGE_BASE};background:#EDE6DD;border:1px solid #E0D3BE;color:#7E6836`;
// Módulo ainda fechado pela esteira. Pill âmbar, o mesmo par do módulo deficitário no
// resultado da prova (DESIGN.md §2): cor como informação, não como decoração.
const BADGE_TRAVADO = `${BADGE_BASE};background:#F7E3BE;border:1px solid #E8CE97;color:#7A4E06`;

function card(
  c: Curriculo,
  idx: number,
  concluidas: Set<number>,
  travadoEm: number | null,
): string {
  // `travadoEm` é o número de dias que faltam; `null` quer dizer aberto.
  const travado = travadoEm !== null;
  const m = c.modulos[idx];
  const aulas = c.aulas.filter((a) => a.modulo === idx);
  const total = aulas.length;
  const done = aulas.filter((a) => concluidas.has(a.n)).length;
  const emAndamento =
    (done > 0 && done < total) || aulas.some((a) => a.n === c.aulaAtual(concluidas).n);

  const badgeText = travado
    ? travadoEm === 1
      ? "ABRE AMANHÃ"
      : `ABRE EM ${travadoEm} DIAS`
    : idx === 0
      ? "BOAS-VINDAS"
      : emAndamento
        ? "EM ANDAMENTO"
        : "AULAS";
  const badge = travado ? BADGE_TRAVADO : emAndamento ? BADGE_ATIVO : BADGE_NEUTRO;
  const label = (m.docente ? `${m.label} · ${m.docente}` : m.label).toUpperCase();
  const pct = Math.round((done / total) * 100);
  const count = done === total ? `${done}/${total} ✓` : `${done}/${total}`;
  const countColor = done > 0 ? "#7E6836" : "#8F887E";
  const aulasTxt = total === 1 ? "1 aula" : `${total} aulas`;

  const trava = travado ? "opacity:.72;cursor:default" : "cursor:pointer";
  return `<div class="mcard"${travado ? ' data-travado="1"' : ""} style="background:#fff;border:1px solid #E4DACC;border-radius:13px;overflow:hidden;${trava};position:relative;display:flex;flex-direction:column;box-shadow:0 6px 18px rgba(11,45,32,.05)"><span style="${badge}">${badgeText}</span><div style="position:relative;aspect-ratio:3/3.5;flex:0 0 auto;background:linear-gradient(160deg,#F0EADF,#E7DECF)"><div class="art-slot">Arte do módulo</div></div><div style="padding:13px 15px 15px;display:flex;flex-direction:column;flex:1"><span style="font-size:8.5px;letter-spacing:.16em;color:#7E6836;font-weight:700">${label}</span><h3 style="font-family:'Playfair Display',serif;font-size:15px;font-weight:600;margin:3px 0 9px;line-height:1.2;color:#0B2D20">${m.titulo}</h3><div style="height:4px;border-radius:2px;background:#EDE6DD;overflow:hidden"><i style="display:block;height:100%;width:${pct}%;background:#A98E4E;border-radius:2px"></i></div><div style="display:flex;justify-content:space-between;font-size:9.5px;color:#8F887E;margin-top:7px"><span>${aulasTxt}</span><span style="color:${countColor};font-weight:600">${count}</span></div></div></div>`;
}

/**
 * O card de 2ª chamada, escondido até um admin liberar (PRD §5, "oculto até liberado pelo admin").
 *
 * ELE EXISTE PORQUE A LIBERAÇÃO ERA INVISÍVEL. Até 31/jul/2026 o admin criava a tentativa e o aluno
 * não tinha como saber: o card da prova continuava dizendo "desbloqueia com 16/16 aulas", e quem
 * acabou de reprovar não tem motivo para clicar nele de novo. A 2ª chamada só chegava pelo WhatsApp do
 * suporte dizendo "entra lá e clica".
 *
 * Reaproveita a moldura do card da Prova Final em vez de inventar uma: é a mesma família visual (a
 * borda dourada da certificação) e o aluno já sabe o que aquele bloco significa. O que muda é o
 * kicker, o título e a linha de baixo.
 *
 * A frase do prazo não é decoração: o cronômetro de 120 minutos começa no "Iniciar prova", e não na
 * liberação, e essa é a única coisa que o aluno precisa saber antes de clicar.
 */
function cardSegundaChamada(): string {
  return (
    '<div class="mcard" data-segunda="1" style="background:linear-gradient(150deg,#FFFDF7,#F6EFE0);' +
    "border:1.5px solid #D9BE85;border-radius:14px;padding:22px 24px;cursor:pointer;display:flex;" +
    'align-items:center;gap:18px;box-shadow:0 8px 22px rgba(169,142,78,.14);margin-bottom:14px">' +
    '<div style="position:relative;width:52px;height:52px;flex:0 0 auto;display:flex;' +
    'align-items:center;justify-content:center;border-radius:50%;background:#F0E9D8">' +
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7E6836" stroke-width="1.8">' +
    '<path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path></svg></div>' +
    '<div style="flex:1">' +
    '<span style="font-size:8.5px;letter-spacing:.16em;color:#7E6836;font-weight:700">SEGUNDA CHAMADA</span>' +
    '<h3 style="font-family:\'Playfair Display\',serif;font-size:17px;font-weight:600;' +
    'margin:3px 0 5px;color:#0B2D20">Sua nova tentativa está liberada</h3>' +
    '<div style="font-size:11px;color:#7E6836;line-height:1.5">Você tem uma tentativa nova da prova ' +
    "final, com questões sorteadas de novo. Os 120 minutos começam quando você iniciar.</div>" +
    "</div></div>"
  );
}

export function fillHome(
  html: string,
  c: Curriculo,
  concluidas: Set<number>,
  travados: Map<number, number> = new Map(),
  /** Tentativa de 2ª chamada liberada e não iniciada. Vem do banco, nunca da URL. */
  segundaChamada = false,
): string {
  const atual = c.aulaAtual(concluidas);
  const mod = c.modulos[atual.modulo];
  const linha = atual.numero
    ? `${mod.label} · Aula ${atual.n} · ${atual.titulo}`
    : `${mod.label} · ${atual.titulo}`;

  let out = html
    .replace("Módulo II · Aula 7 · Comprando ações nos EUA", linha)
    .replace("Continuar Aula 7", atual.numero ? `Continuar Aula ${atual.n}` : "Começar formação");

  // O card de 2ª chamada entra ANTES do card da Prova Final, porque é a novidade e é a ação: quem
  // reprovou já viu o card da prova e aprendeu a ignorá-lo. Injetado aqui, no template, e não por
  // edição do HTML gerado, que o próximo porte apagaria.
  if (segundaChamada) {
    const provaIdx = out.indexOf('class="mcard"', out.indexOf("PROVA FINAL") - 2000);
    const abre = provaIdx >= 0 ? out.lastIndexOf("<div", provaIdx) : -1;
    if (abre >= 0) out = out.slice(0, abre) + cardSegundaChamada() + out.slice(abre);
  }

  // regenera os cards da prateleira "A Formação"
  const railIdx = out.indexOf('class="rail"');
  if (railIdx >= 0) {
    const openIdx = out.lastIndexOf("<div", railIdx);
    const { start, end } = innerOfDiv(out, openIdx);
    out = out.slice(0, start) +
      c.modulos.map((_, i) => card(c, i, concluidas, travados.get(i) ?? null)).join("") +
      out.slice(end);
  }
  return out;
}

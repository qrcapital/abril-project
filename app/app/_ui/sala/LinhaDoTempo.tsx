"use client";

import { useState } from "react";

import { formatar, indiceX, type EventoTempo, type FormatoDe, type Origem as TipoOrigem } from "@/lib/notebook";

import { useEntrada } from "./Entrada";
import { useLargura } from "./Grafico";
import Origem from "./Origem";

/**
 * Linha do tempo horizontal: um cartão por evento (data, título, uma linha), em fila que rola de
 * lado quando não cabe. Com `serie`, a série (câmbio, juros) corre por cima dos cartões, e um fio
 * liga cada cartão ao ponto dele na série. Passar o mouse ou focar um cartão acende o ponto e
 * escreve o valor daquele dia.
 *
 * O fio sai do ponto, desce até a base do gráfico e só então vai ao cartão: os cartões têm largura
 * igual e a série tem o tempo de verdade, então o cartão quase nunca fica embaixo do ponto. O fio
 * é o que deixa as duas escalas conviverem sem mentir sobre a data.
 */
export default function LinhaDoTempo({
  titulo,
  subtitulo,
  eventos,
  serie,
  origem,
}: {
  titulo: string;
  subtitulo?: string;
  eventos: EventoTempo[];
  serie?: { nome: string; eixoX: string[]; valores: (number | null)[]; formato?: FormatoDe; escala?: "linear" | "log" };
  origem: TipoOrigem;
}) {
  const ref = useEntrada<HTMLElement>();
  // O padrão é a largura mínima do trilho no celular (188px por evento): ali o HTML do servidor já sai
  // alinhado. No desktop o mínimo é 86px desde 07/out/2026 (sala.css), e a medida acerta na montagem.
  const [trilhoRef, w] = useLargura(eventos.length * 188);
  const [ativo, setAtivo] = useState<number | null>(null);

  const n = eventos.length;
  const HG = serie ? 150 : 0; // altura do gráfico
  const FIO = 30; // faixa dos fios
  const H = HG + FIO;
  // O fio chega ao cartão na altura da data, alinhado à esquerda como o texto (08/out/2026). Antes
  // descia no meio da coluna, e o ponto ficava solto sobre um texto que começa na borda.
  const xCartao = (i: number) => (i * w) / n + 4;

  // Série: eixo próprio, sem zero obrigatório (é contexto, não comparação de tamanho).
  const m = serie?.eixoX.length ?? 0;
  const vals = (serie?.valores ?? []).filter((v): v is number => v !== null);
  const log = serie?.escala === "log" && vals.every((v) => v > 0);
  const tr = (v: number) => (log ? Math.log10(v) : v);
  const lo = vals.length ? Math.min(...vals.map(tr)) : 0;
  const hi = vals.length ? Math.max(...vals.map(tr)) : 1;
  const PAD = 16;
  const TOPO = 26;
  const xs = (i: number) => PAD + (m > 1 ? (i * (w - 2 * PAD)) / (m - 1) : (w - 2 * PAD) / 2);
  const ys = (v: number) => TOPO + (HG - TOPO - 10) * (1 - (tr(v) - lo) / (hi - lo || 1));
  const fmt = (v: number) => formatar(v, serie?.formato);

  let d = "";
  if (serie) {
    let caneta = false;
    serie.valores.forEach((v, i) => {
      if (v === null) {
        caneta = false;
        return;
      }
      d +=`${caneta ? "L" : "M"}${xs(i).toFixed(1)},${ys(v).toFixed(1)}`;
      caneta = true;
    });
  }

  const pontos = eventos.map((ev) => {
    if (!serie) return null;
    const i = indiceX(serie.eixoX, ev.em ?? ev.data);
    const v = i >= 0 ? serie.valores[i] : null;
    return i >= 0 && v !== null ? { i, v, x: xs(i), y: ys(v) } : null;
  });
  const ultimo = (() => {
    if (!serie) return null;
    for (let i = serie.valores.length - 1; i >= 0; i--) if (serie.valores[i] !== null) return { i, v: serie.valores[i] as number };
    return null;
  })();
  const pAtivo = ativo !== null ? pontos[ativo] : null;

  return (
    <figure className="sl-tempo" ref={ref} data-denso={n >= 7 ? "" : undefined}>
      <figcaption className="sl-fig-cabeca">
        <h4 className="sl-fig-titulo">{titulo}</h4>
        {subtitulo && <p className="sl-fig-sub">{subtitulo}</p>}
      </figcaption>

      <div className="sl-tempo-rolagem" tabIndex={0} role="region" aria-label={`${titulo}: linha do tempo, role de lado`}>
        <div className="sl-tempo-trilho" ref={trilhoRef} style={{ ["--n" as string]: n }} onMouseLeave={() => setAtivo(null)}>
          <svg className="sl-tempo-svg" width={w} height={H} viewBox={`0 0 ${w} ${H}`} aria-hidden="true">
            {serie && (
              <>
                <text className="sl-tempo-serie" x={PAD} y={12}>
                  {serie.nome}
                  {pAtivo ? `: ${fmt(pAtivo.v)} em ${serie.eixoX[pAtivo.i]}` : ultimo ? `: ${fmt(ultimo.v)} em ${serie.eixoX[ultimo.i]}` : ""}
                </text>
                <path className="sl-tempo-area" d={`${d}L${xs(m - 1).toFixed(1)},${HG}L${xs(0).toFixed(1)},${HG}Z`} />
                <path className="sl-g-traco sl-tempo-linha" d={d} pathLength={1} fill="none" />
                <line className="sl-tempo-base" x1={0} x2={w} y1={HG} y2={HG} />
              </>
            )}
            {!serie && <line className="sl-tempo-base" x1={0} x2={w} y1={FIO / 2} y2={FIO / 2} />}
            {eventos.map((ev, i) => {
              const p = pontos[i];
              const xc = xCartao(i);
              const aceso = ativo === i;
              const fio = p ? `M${p.x.toFixed(1)},${p.y.toFixed(1)}L${p.x.toFixed(1)},${HG}L${xc.toFixed(1)},${H}` : `M${xc.toFixed(1)},${FIO / 2}L${xc.toFixed(1)},${H}`;
              return (
                <g key={ev.titulo} className={`sl-tempo-evento${aceso ? " is-aceso" : ""}`}>
                  <path className="sl-tempo-fio" d={fio} fill="none" />
                  {p ? <circle cx={p.x} cy={p.y} r={aceso ? 5 : 3.2} /> : <circle cx={xc} cy={FIO / 2} r={aceso ? 5 : 3.2} />}
                </g>
              );
            })}
          </svg>

          <ol className="sl-tempo-eventos">
            {eventos.map((ev, i) => {
              const p = pontos[i];
              return (
                <li
                  key={ev.titulo}
                  className={ativo === i ? "is-aceso" : undefined}
                  tabIndex={0}
                  onMouseEnter={() => setAtivo(i)}
                  onFocus={() => setAtivo(i)}
                  onBlur={() => setAtivo(null)}
                  onClick={() => setAtivo(i)}
                >
                  <time className="sl-tempo-data">{ev.data}</time>
                  <p className="sl-tempo-titulo">{ev.titulo}</p>
                  {ev.texto && <p className="sl-tempo-texto">{ev.texto}</p>}
                  {serie && p && (
                    <p className="sl-tempo-valor">
                      {serie.nome}: {fmt(p.v)}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <Origem origem={origem} />
    </figure>
  );
}

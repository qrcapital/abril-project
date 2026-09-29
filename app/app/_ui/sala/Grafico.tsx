"use client";

import { useId, useState } from "react";

import { formatar, type Formato, type Serie } from "@/lib/notebook";

// Gráfico do notebook em SVG puro, sem biblioteca. Uma dependência de gráficos custaria dezenas de
// kB no bundle da sala para desenhar três formas, e o desenho aqui precisa obedecer à identidade
// (tinta, um vermelho, papel) em vez de brigar com o tema padrão de alguém.
//
// Acessibilidade em três camadas: o SVG tem nome, o teclado percorre os pontos (setas, Home, End),
// e a tabela com os mesmos números fica num <details> logo abaixo, que é o que um leitor de tela
// usa de fato.

const CORES = ["#C1121F", "#1a1815", "#7e6836"];
// Traço diferente por série, para o gráfico não depender só da cor.
const TRACOS = [undefined, "7 5", "2 5"];

const W = 760;
const H = 320;
const M = { esq: 72, dir: 18, topo: 18, base: 42 };
const PW = W - M.esq - M.dir;
const PH = H - M.topo - M.base;

/** Passo "redondo" para o eixo Y: 1, 2, 2,5 ou 5 vezes uma potência de 10. */
function passoRedondo(bruto: number): number {
  if (bruto <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(bruto)));
  const r = bruto / mag;
  return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * mag;
}

export type PropsGrafico = {
  titulo: string;
  forma: "linha" | "barra" | "area";
  eixoX: string[];
  series: Serie[];
  formato?: Formato;
  nota?: string;
  ilustrativo?: boolean;
  /** Ponto marcado mesmo sem hover (o simulador marca a escolha do aluno). */
  destaque?: number;
  /** Nível do título: 3 no notebook, 4 dentro do simulador. */
  nivel?: 3 | 4;
};

export default function Grafico({
  titulo,
  forma,
  eixoX,
  series,
  formato = {},
  nota,
  ilustrativo,
  destaque,
  nivel = 3,
}: PropsGrafico) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const idNota = useId();
  const n = eixoX.length;

  const todos = series.flatMap((s) => s.valores);
  const max = Math.max(...todos);
  const minDado = Math.min(...todos);
  // Barra e área partem do zero, senão a altura mente. Linha pode começar acima, desde que o
  // zero esteja longe: aí começar no zero achataria tudo no topo.
  const baseZero = forma !== "linha" || minDado <= 0 || minDado < max * 0.5;
  const passo = passoRedondo(((max - (baseZero ? Math.min(0, minDado) : minDado)) || 1) / 4);
  const yMin = baseZero ? Math.min(0, Math.floor(minDado / passo) * passo) : Math.floor(minDado / passo) * passo;
  const yMax = Math.ceil(max / passo) * passo || passo;
  const ticks: number[] = [];
  for (let v = yMin; v <= yMax + passo / 1000; v += passo) ticks.push(Math.round(v * 1e6) / 1e6);

  const y = (v: number) => M.topo + PH - ((v - yMin) / (yMax - yMin)) * PH;
  const banda = PW / n;
  const x = (i: number) =>
    forma === "barra" ? M.esq + banda * i + banda / 2 : M.esq + (n > 1 ? (PW * i) / (n - 1) : PW / 2);

  // Casas do eixo pelo passo, não pelo formato dos dados: um passo de 2,5 escrito sem casa viraria
  // "3" no rótulo.
  const casasEixo = passo % 1 === 0 ? 0 : (passo * 10) % 1 === 0 ? 1 : 2;
  const fmtEixo = (v: number) => formatar(v, { ...formato, casas: casasEixo });
  const fmt = (v: number) => formatar(v, formato);
  const pularX = n > 8 ? Math.ceil(n / 7) : 1;

  const marcado = ativo ?? destaque ?? null;

  function indiceDoPonteiro(e: React.PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = forma === "barra" ? Math.floor((px - M.esq) / banda) : Math.round(((px - M.esq) / PW) * (n - 1));
    return Math.max(0, Math.min(n - 1, i));
  }

  function teclado(e: React.KeyboardEvent<SVGSVGElement>) {
    const atual = ativo ?? -1;
    let prox: number | null = atual;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") prox = Math.min(n - 1, atual + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") prox = Math.max(0, atual < 0 ? 0 : atual - 1);
    else if (e.key === "Home") prox = 0;
    else if (e.key === "End") prox = n - 1;
    else if (e.key === "Escape") prox = null;
    else return;
    e.preventDefault();
    setAtivo(prox);
  }

  const Titulo = nivel === 3 ? "h3" : "h4";
  const topoDica = ativo !== null ? Math.min(...series.map((s) => y(s.valores[ativo] ?? 0))) : 0;
  const larguraBarra = Math.min(46, (banda * 0.68) / series.length);

  return (
    <figure className="sl-fig">
      <div className="sl-fig-topo">
        <Titulo>{titulo}</Titulo>
        {ilustrativo && <span className="sl-chip sl-chip-demo">Ilustrativo</span>}
      </div>

      {series.length > 1 && (
        <ul className="sl-legenda" aria-hidden="true">
          {series.map((s, k) => (
            <li key={s.nome}>
              <i
                style={{
                  background: TRACOS[k]
                    ? `repeating-linear-gradient(90deg, ${CORES[k]} 0 5px, transparent 5px 8px)`
                    : CORES[k],
                }}
              />
              {s.nome}
            </li>
          ))}
        </ul>
      )}

      <div className="sl-grafico">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`${titulo}. Use as setas para percorrer os pontos; a tabela com os dados está logo abaixo.`}
          aria-describedby={nota ? idNota : undefined}
          tabIndex={0}
          onPointerMove={(e) => setAtivo(indiceDoPonteiro(e))}
          onPointerLeave={() => setAtivo(null)}
          onKeyDown={teclado}
          onBlur={() => setAtivo(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={M.esq}
                x2={W - M.dir}
                y1={y(t)}
                y2={y(t)}
                stroke={t === 0 ? "rgba(26,24,21,.45)" : "rgba(26,24,21,.1)"}
                strokeWidth={1}
              />
              <text x={M.esq - 10} y={y(t) + 4} textAnchor="end">
                {fmtEixo(t)}
              </text>
            </g>
          ))}

          {eixoX.map((rotulo, i) =>
            i % pularX === 0 || i === n - 1 ? (
              <text key={rotulo + i} x={x(i)} y={H - 14} textAnchor="middle">
                {rotulo}
              </text>
            ) : null,
          )}

          {marcado !== null && forma !== "barra" && (
            <line
              x1={x(marcado)}
              x2={x(marcado)}
              y1={M.topo}
              y2={M.topo + PH}
              stroke="rgba(26,24,21,.35)"
              strokeDasharray="3 4"
            />
          )}

          {forma === "barra"
            ? series.map((s, k) =>
                s.valores.map((v, i) => {
                  const larg = larguraBarra;
                  const x0 = x(i) - (larg * series.length) / 2 + larg * k;
                  const topo = Math.min(y(v), y(0));
                  const acesa = marcado === null || marcado === i;
                  return (
                    <rect
                      key={`${k}-${i}`}
                      x={x0 + 1}
                      y={topo}
                      width={larg - 2}
                      height={Math.max(1, Math.abs(y(v) - y(0)))}
                      rx={3}
                      fill={CORES[k]}
                      opacity={acesa ? 1 : 0.35}
                    />
                  );
                }),
              )
            : series.map((s, k) => {
                const pts = s.valores.map((v, i) => `${x(i)},${y(v)}`).join(" ");
                return (
                  <g key={s.nome}>
                    {forma === "area" && (
                      <polygon
                        points={`${x(0)},${y(yMin)} ${pts} ${x(n - 1)},${y(yMin)}`}
                        fill={CORES[k]}
                        opacity={k === 0 ? 0.12 : 0.07}
                      />
                    )}
                    <polyline
                      points={pts}
                      fill="none"
                      stroke={CORES[k]}
                      strokeWidth={2.5}
                      strokeDasharray={TRACOS[k]}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {marcado !== null && (
                      <circle cx={x(marcado)} cy={y(s.valores[marcado])} r={5} fill="#fdfbf6" stroke={CORES[k]} strokeWidth={2.5} />
                    )}
                  </g>
                );
              })}
        </svg>

        {ativo !== null && (
          <div
            className="sl-dica"
            aria-hidden="true"
            style={{ left: `${(x(ativo) / W) * 100}%`, top: `${(topoDica / H) * 100}%` }}
          >
            <b>{eixoX[ativo]}</b>
            {series.map((s, k) => (
              <span key={s.nome}>
                <i style={{ background: CORES[k] }} />
                {series.length > 1 ? `${s.nome}: ` : ""}
                {fmt(s.valores[ativo])}
              </span>
            ))}
          </div>
        )}
        {/* O mesmo conteúdo da dica, para leitor de tela: a dica em si é visual. */}
        <p className="sl-so-leitor" aria-live="polite">
          {ativo !== null
            ? `${eixoX[ativo]}: ${series.map((s) => `${s.nome} ${fmt(s.valores[ativo])}`).join("; ")}`
            : ""}
        </p>
      </div>

      {nota && (
        <p className="sl-fig-nota" id={idNota}>
          {nota}
        </p>
      )}

      <details className="sl-dados">
        <summary>Ver os dados em tabela</summary>
        <div className="sl-tabela-caixa">
          <table className="sl-tabela">
            <caption className="sl-so-leitor">{titulo}</caption>
            <thead>
              <tr>
                <th scope="col">Ponto</th>
                {series.map((s) => (
                  <th scope="col" key={s.nome}>
                    {s.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {eixoX.map((rotulo, i) => (
                <tr key={rotulo + i}>
                  <th scope="row">{rotulo}</th>
                  {series.map((s) => (
                    <td key={s.nome}>{fmt(s.valores[i])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

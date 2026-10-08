"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import {
  formatar,
  indiceX,
  resolverFormato,
  type CorSerie,
  type Faixa,
  type FormaGrafico,
  type FormatoDe,
  type Marco,
  type Origem as TipoOrigem,
  type Serie,
} from "@/lib/notebook";

import { useEntrada } from "./Entrada";
import Origem from "./Origem";

// Gráfico do notebook em SVG puro, sem biblioteca. Uma dependência de gráficos custaria dezenas de
// kB no bundle da sala, e o desenho aqui precisa obedecer à identidade (tinta, papel, um vermelho)
// em vez de brigar com o tema padrão de alguém.
//
// O desenho segue os gráficos do diagnóstico da LP: a série entra correndo da esquerda para a
// direita quando chega na tela (`useEntrada`), e o mouse mostra o valor exato. Aqui, além disso:
// várias séries, legenda que liga e desliga série, cruz de leitura com todas as séries no ponto,
// marcos e faixas anotados, linha de referência, escala log e cinco formas.
//
// Acessibilidade em três camadas: o SVG tem nome, o teclado percorre os pontos (setas, Home, End,
// Esc), e a tabela com os mesmos números fica num <details> logo abaixo, que é o que um leitor de
// tela usa de fato.
//
// O SVG é desenhado no tamanho real da caixa (ResizeObserver), e não esticado de um viewBox fixo:
// esticar encolhia o texto dos eixos para 5px no celular.

export const COR: Record<CorSerie, string> = {
  acento: "#C1121F",
  tinta: "#1a1815",
  cinza: "#6b655c",
  cinzaClaro: "#a59d92",
  cinzaPalido: "#cfc7bb",
  ouro: "#a98e4e",
  positivo: "#2f6b4f",
  negativo: "#C1121F",
};
/** Cor do TEXTO de uma série: o cinza pálido some no papel como letra, então escurece um passo. */
const COR_TEXTO: Partial<Record<CorSerie, string>> = { cinzaPalido: "#8f877c", cinzaClaro: "#857d72", ouro: "#7e6836" };
const SEQUENCIA: CorSerie[] = ["cinza", "cinzaClaro", "cinzaPalido", "ouro", "tinta"];

/** A cor de cada série: a do autor, ou vermelho para a em destaque e cinzas para as outras. */
export function coresDasSeries(series: Serie[]): CorSerie[] {
  const iDestaque = Math.max(0, series.findIndex((s) => s.destaque));
  let k = 0;
  return series.map((s, i) => s.cor ?? (i === iDestaque ? "acento" : SEQUENCIA[k++ % SEQUENCIA.length]));
}

/** Passo "redondo" para o eixo Y: 1, 2, 2,5 ou 5 vezes uma potência de 10. */
function passoRedondo(bruto: number): number {
  if (bruto <= 0 || !Number.isFinite(bruto)) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(bruto)));
  const r = bruto / mag;
  return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * mag;
}

/** Afasta rótulos verticais que se encostam, preservando a ordem. */
function afastar(ys: number[], minimo: number, topo: number, base: number): number[] {
  const ordem = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ordem.length; k++) ordem[k].y = Math.max(ordem[k].y, ordem[k - 1].y + minimo);
  const excesso = ordem.length ? ordem[ordem.length - 1].y - base : 0;
  if (excesso > 0) for (const o of ordem) o.y -= excesso;
  for (let k = 0; k < ordem.length; k++) ordem[k].y = Math.max(ordem[k].y, topo + k * minimo);
  const out = [...ys];
  for (const o of ordem) out[o.i] = o.y;
  return out;
}

/** Largura média de um caractere do Jost a 12px, em px: a conta de quanto rótulo cabe. */
const CAR = 6.6;

/**
 * Quebra os rótulos do eixo X em até três linhas que caibam na largura dada. Devolve `null` se
 * algum não couber (uma palavra mais larga que a banda, ou mais de três linhas).
 */
function quebrarRotulos(rotulos: string[], largura: number, car = CAR): string[][] | null {
  const cabe = Math.floor(largura / car);
  if (cabe < 3) return null;
  const out: string[][] = [];
  for (const r of rotulos) {
    const linhas: string[] = [];
    for (const palavra of r.split(/\s+/).filter(Boolean)) {
      if (palavra.length > cabe) return null;
      const ult = linhas[linhas.length - 1];
      if (ult !== undefined && ult.length + 1 + palavra.length <= cabe) linhas[linhas.length - 1] = `${ult} ${palavra}`;
      else linhas.push(palavra);
    }
    if (linhas.length > 3) return null;
    out.push(linhas.length ? linhas : [r]);
  }
  return out;
}

/** Largura da caixa, medida. Começa no padrão para o HTML do servidor. */
export function useLargura(padrao: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(padrao);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      if (w > 0) setLargura((atual) => (Math.abs(atual - w) > 1 ? w : atual));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, largura] as const;
}

export type PropsGrafico = {
  titulo: string;
  subtitulo?: string;
  forma: FormaGrafico;
  eixoX: string[];
  series: Serie[];
  formato?: FormatoDe;
  escala?: "linear" | "log";
  marcos?: Marco[];
  faixas?: Faixa[];
  referencia?: { valor: number; rotulo: string };
  /** Linha de fonte. O simulador não passa: ele tem o próprio aviso. */
  origem?: TipoOrigem;
  /** Ponto marcado mesmo sem hover (o simulador marca a escolha do aluno). */
  destaque?: number;
  /** Nível do título: 4 no notebook, 5 dentro do simulador. */
  nivel?: 3 | 4 | 5;
  /** Mais baixo, para caber ao lado dos controles do simulador. */
  baixo?: boolean;
};

export default function Grafico(props: PropsGrafico) {
  const { titulo, subtitulo, forma, eixoX, series, formato, escala = "linear", marcos = [], faixas = [], referencia, origem, destaque, nivel = 4, baixo } = props;

  const [ativo, setAtivo] = useState<number | null>(null);
  const [ocultas, setOcultas] = useState<ReadonlySet<string>>(new Set());
  const idOrigem = useId();
  const figRef = useEntrada<HTMLElement>();
  const [caixaRef, W] = useLargura(760);

  const cores = useMemo(() => coresDasSeries(series), [series]);
  const visiveis = series.map((s, k) => ({ s, k })).filter(({ s }) => !ocultas.has(s.nome));
  const n = eixoX.length;
  const f = resolverFormato(formato);
  const fmt = (v: number | null | undefined) => (v === null || v === undefined ? "n/d" : formatar(v, f));
  const empilhada = forma === "barraEmpilhada";
  const barras = forma === "barra" || empilhada;
  const inclinacao = forma === "inclinacao";
  const log = escala === "log" && !barras && forma !== "area";

  // ---- domínio do eixo Y ------------------------------------------------------------------
  const valoresVisiveis: number[] = [];
  if (empilhada) {
    for (let i = 0; i < n; i++) {
      let pos = 0;
      let neg = 0;
      for (const { s } of visiveis) {
        const v = s.valores[i] ?? 0;
        if (v >= 0) pos += v;
        else neg += v;
      }
      valoresVisiveis.push(pos, neg);
    }
  } else for (const { s } of visiveis) for (const v of s.valores) if (v !== null && Number.isFinite(v)) valoresVisiveis.push(v);
  if (referencia) valoresVisiveis.push(referencia.valor);
  if (!valoresVisiveis.length) valoresVisiveis.push(0, 1);

  const maxDado = Math.max(...valoresVisiveis);
  const minDado = Math.min(...valoresVisiveis);

  const H = baixo ? 250 : Math.round(Math.min(380, Math.max(260, W * 0.46)));
  const alvoTicks = Math.max(3, Math.min(6, Math.round(H / 64)));

  let ticks: number[] = [];
  let yMin: number;
  let yMax: number;
  if (log) {
    const lo = Math.max(minDado, 1e-9) / 1.08;
    const hi = maxDado * 1.08;
    const cand: number[] = [];
    for (let e = Math.floor(Math.log10(lo)) - 1; e <= Math.ceil(Math.log10(hi)) + 1; e++)
      for (const m of [1, 2, 5]) cand.push(m * Math.pow(10, e));
    yMin = Math.min(lo, ...cand.filter((c) => c <= lo).slice(-1));
    yMax = Math.max(hi, ...cand.filter((c) => c >= hi).slice(0, 1));
    ticks = cand.filter((c) => c >= yMin * (1 - 1e-9) && c <= yMax * (1 + 1e-9));
    // Muitas décadas: só as potências de 10 ficam na grade.
    if (ticks.length > alvoTicks + 2) {
      const decadas = ticks.filter((c) => Math.abs(Math.log10(c) - Math.round(Math.log10(c))) < 1e-9);
      if (decadas.length >= 2) ticks = decadas;
    }
  } else {
    // Barra e área partem do zero, senão a altura mente. Linha pode começar acima, desde que o
    // zero esteja longe: aí começar no zero achataria tudo no topo.
    const baseZero = barras || forma === "area" || minDado <= 0 || minDado < maxDado * 0.5;
    const lo = baseZero ? Math.min(0, minDado) : minDado;
    const hi = baseZero ? Math.max(0, maxDado) : maxDado;
    const passo = passoRedondo((hi - lo || Math.abs(hi) || 1) / alvoTicks);
    yMin = Math.floor(lo / passo) * passo;
    yMax = Math.ceil(hi / passo) * passo;
    if (yMax === yMin) yMax = yMin + passo;
    for (let v = yMin; v <= yMax + passo / 1000; v += passo) ticks.push(Math.round(v * 1e9) / 1e9);
  }
  const passoTick = ticks.length > 1 ? Math.abs(ticks[1] - ticks[0]) : 1;
  const casasEixo = log ? (yMin < 1 ? 2 : 0) : Number.isInteger(passoTick) ? 0 : Number.isInteger(passoTick * 10) ? 1 : 2;
  // Casas do eixo pelo passo, não pelo formato dos dados: um passo de 2,5 escrito sem casa viraria
  // "3" no rótulo, e "R$ 5,00" em todo tick é ruído.
  const fmtEixo = (v: number) => formatar(v, { ...f, sinal: false, casas: casasEixo });

  // ---- margens e escalas -----------------------------------------------------------------
  const largEixo = Math.max(...ticks.map((t) => fmtEixo(t).length)) * 6.6 + 12;
  const comRotuloFinal = (forma === "linha" || forma === "area") && visiveis.length <= 5;
  const ultimos = visiveis.map(({ s }) => {
    for (let i = s.valores.length - 1; i >= 0; i--) if (s.valores[i] !== null) return { i, v: s.valores[i] as number };
    return null;
  });
  const largFinal = comRotuloFinal ? Math.min(96, Math.max(0, ...ultimos.map((u) => (u ? fmt(u.v).length * 6.8 : 0))) + 12) : 0;

  // Marcos: rótulo acima do gráfico, em linhas alternadas quando se encostam.
  const linhasMarcos: number[] = [];
  const marcosOk = marcos.map((m) => ({ ...m, i: indiceX(eixoX, m.em) })).filter((m) => m.i >= 0).sort((a, b) => a.i - b.i);

  const M = {
    esq: inclinacao ? 12 : Math.round(largEixo),
    dir: inclinacao ? 12 : Math.round(Math.max(14, largFinal)),
    topo: 0,
    base: inclinacao ? 14 : 30,
  };
  let PW = Math.max(40, W - M.esq - M.dir);
  let banda = PW / Math.max(1, n);

  // ---- rótulos do eixo X (08/out/2026) -------------------------------------------------------
  // Barra de categoria (país, setor, faixa de nota: rótulo sem algarismo) mostra TODO rótulo: pular
  // deixava barra sem nome, com "Tecnologia da informação" e "Materiais" separados por barras mudas.
  // Primeiro tenta quebrar em até três linhas na largura da banda (a conta de largura aqui é a média
  // das minúsculas do Jost, um pouco mais estreita que a dos algarismos); se nem assim cabe (o
  // celular, com sete setores), o rótulo inclina, e a margem esquerda cresce o que for preciso para
  // o primeiro rótulo inclinado não sair da caixa. Série no tempo continua pulando rótulo, ver `pularX`.
  const categorias = barras && eixoX.some((r) => !/\d/.test(r));
  const linhasX = categorias ? quebrarRotulos(eixoX, banda - 2, 6.1) : null;
  const inclinarX = categorias && !linhasX;
  const maxRotuloX = Math.max(1, ...eixoX.map((r) => r.length));
  const COS_INCL = Math.cos((35 * Math.PI) / 180);
  if (linhasX) M.base = 30 + (Math.max(1, ...linhasX.map((l) => l.length)) - 1) * 13;
  else if (inclinarX) {
    M.base = Math.round(Math.min(130, 24 + maxRotuloX * 6.1 * 0.57));
    const falta = Math.ceil((eixoX[0]?.length ?? 0) * 6.1 * COS_INCL - (M.esq + banda / 2) + 4);
    if (falta > 0) {
      M.esq += falta;
      PW = Math.max(40, W - M.esq - M.dir);
      banda = PW / Math.max(1, n);
    }
  }

  const xPonto = (i: number) =>
    barras ? M.esq + banda * i + banda / 2 : M.esq + (n > 1 ? (PW * i) / (n - 1) : PW / 2);
  const xSlope = (i: number) => M.esq + PW * (i === 0 ? 0.3 : 0.7);
  const x = inclinacao ? xSlope : xPonto;

  // Cada rótulo vai na primeira linha (de três) onde não encosta no anterior.
  const fimPorLinha = [-Infinity, -Infinity, -Infinity];
  for (const m of marcosOk) {
    const xm = x(m.i);
    const livre = fimPorLinha.findIndex((fim) => xm > fim + 8);
    const linha = livre < 0 ? 0 : livre;
    linhasMarcos.push(linha);
    fimPorLinha[linha] = xm + m.rotulo.length * 6.4;
  }
  const nLinhasMarcos = marcosOk.length ? Math.max(...linhasMarcos) + 1 : 0;
  M.topo = (inclinacao ? 34 : 14) + nLinhasMarcos * 15;
  const PH = H - M.topo - M.base;

  const y = (v: number) => {
    if (log) {
      const a = Math.log10(yMin);
      const b = Math.log10(yMax);
      return M.topo + PH - ((Math.log10(Math.max(v, 1e-12)) - a) / (b - a)) * PH;
    }
    return M.topo + PH - ((v - yMin) / (yMax - yMin)) * PH;
  };
  const y0 = log ? M.topo + PH : y(Math.max(yMin, Math.min(0, yMax)));

  // ---- interação ---------------------------------------------------------------------------
  const total = inclinacao ? visiveis.length : n;
  function indiceDoPonteiro(e: React.PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const py = ((e.clientY - r.top) / r.height) * H;
    if (inclinacao) {
      // A série mais perto do ponteiro, medida na reta dela.
      const t = Math.max(0, Math.min(1, (px - xSlope(0)) / (xSlope(1) - xSlope(0))));
      let melhor = 0;
      let dist = Infinity;
      visiveis.forEach(({ s }, j) => {
        const a = s.valores[0];
        const b = s.valores[1];
        if (a === null || b === null) return;
        const d = Math.abs(y(a) + (y(b) - y(a)) * t - py);
        if (d < dist) [dist, melhor] = [d, j];
      });
      return melhor;
    }
    const i = barras ? Math.floor((px - M.esq) / banda) : Math.round(((px - M.esq) / PW) * (n - 1));
    return Math.max(0, Math.min(n - 1, i));
  }
  function teclado(e: React.KeyboardEvent<SVGSVGElement>) {
    const atual = ativo ?? -1;
    let prox: number | null = atual;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") prox = Math.min(total - 1, atual + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") prox = Math.max(0, atual < 0 ? 0 : atual - 1);
    else if (e.key === "PageUp") prox = Math.min(total - 1, Math.max(0, atual) + Math.ceil(total / 10));
    else if (e.key === "PageDown") prox = Math.max(0, atual - Math.ceil(total / 10));
    else if (e.key === "Home") prox = 0;
    else if (e.key === "End") prox = total - 1;
    else if (e.key === "Escape") prox = null;
    else return;
    e.preventDefault();
    setAtivo(prox);
  }
  function alternar(nome: string) {
    setAtivo(null);
    setOcultas((atual) => {
      const prox = new Set(atual);
      if (prox.has(nome)) prox.delete(nome);
      else if (series.length - prox.size > 1) prox.add(nome); // nunca some a última
      return prox;
    });
  }

  const marcado = inclinacao ? null : (ativo ?? destaque ?? null);
  const Titulo = (`h${nivel}` as "h3" | "h4" | "h5");

  // ---- desenho ------------------------------------------------------------------------------
  const pularX = categorias ? 1 : Math.max(1, Math.ceil(n / Math.max(2, Math.floor(PW / (maxRotuloX * 7 + 18)))));
  // O último ponto sempre tem rótulo (é o dado mais recente), e o rótulo da grade que ficaria a
  // menos de um passo dele sai, em vez de encostar nele: antes saía "2024 2026" colado, ou "Ano 12
  // Ano 15" um por cima do outro.
  const mostrarX = (i: number) => i === n - 1 || (i % pularX === 0 && n - 1 - i >= pularX);
  const caminho = (valores: (number | null)[]) => {
    let d = "";
    let caneta = false;
    valores.forEach((v, i) => {
      if (v === null || !Number.isFinite(v)) {
        caneta = false;
        return;
      }
      d += `${caneta ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      caneta = true;
    });
    return d;
  };

  const rotulosFinais = comRotuloFinal
    ? afastar(
        ultimos.map((u) => (u ? y(u.v) : 0)),
        14,
        M.topo,
        M.topo + PH,
      )
    : [];

  const grupo = banda * (visiveis.length > 1 ? 0.74 : 0.56);
  const largBarra = empilhada ? Math.min(56, banda * 0.56) : Math.min(44, grupo / Math.max(1, visiveis.length));
  // Valor no topo da barra só quando cabe na vaga dela (08/out/2026): com duas séries, "0,84 p.p." e
  // "0,80 p.p." se atropelavam. Se o valor completo não cabe, sai sem a unidade, que o eixo já diz;
  // se nem o número cabe, a barra fica sem rótulo e o valor segue na dica e na tabela.
  const vagaValor = visiveis.length > 1 ? largBarra + 6 : banda - 6;
  const valoresBarra = visiveis.flatMap(({ s }) => s.valores.filter((v): v is number => v !== null && Number.isFinite(v)));
  const cabeValor = (fn: (v: number) => string) => valoresBarra.every((v) => fn(v).length * (CAR + 0.4) <= vagaValor);
  const fmtCurto = (v: number) => formatar(v, { ...f, prefixo: undefined, sufixo: undefined });
  const fmtBarra = cabeValor(fmt) ? fmt : cabeValor(fmtCurto) ? fmtCurto : null;
  const poucasBarras = forma === "barra" && n * visiveis.length <= 10 && fmtBarra !== null;

  // Dica: lado oposto ao do ponto, para não cobrir a série.
  const dicaX = marcado !== null && ativo !== null ? x(ativo) : 0;
  const dicaEsq = dicaX > W * 0.58;

  return (
    <figure className="sl-fig" ref={figRef} data-forma={forma}>
      <figcaption className="sl-fig-cabeca">
        <Titulo className="sl-fig-titulo">{titulo}</Titulo>
        {subtitulo && <p className="sl-fig-sub">{subtitulo}</p>}
      </figcaption>

      {series.length > 1 && (
        <ul className="sl-legenda" aria-label="Séries do gráfico">
          {series.map((s, k) => {
            const ligada = !ocultas.has(s.nome);
            return (
              <li key={s.nome}>
                <button
                  type="button"
                  aria-pressed={ligada}
                  onClick={() => alternar(s.nome)}
                  title={ligada ? "Ocultar série" : "Mostrar série"}
                >
                  <i style={{ background: COR[cores[k]] }} aria-hidden="true" data-forma={barras ? "barra" : "linha"} />
                  {s.nome}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="sl-grafico" ref={caixaRef}>
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`${titulo}. Use as setas para percorrer ${inclinacao ? "as séries" : "os pontos"}; a tabela com os dados está logo abaixo.`}
          aria-describedby={origem ? idOrigem : undefined}
          tabIndex={0}
          onPointerMove={(e) => setAtivo(indiceDoPonteiro(e))}
          onPointerDown={(e) => setAtivo(indiceDoPonteiro(e))}
          onPointerLeave={() => setAtivo(null)}
          onKeyDown={teclado}
          onBlur={() => setAtivo(null)}
        >
          {/* faixas sombreadas */}
          {faixas.map((fx, j) => {
            const a = indiceX(eixoX, fx.de);
            const b = indiceX(eixoX, fx.ate);
            if (a < 0 || b < 0) return null;
            const x0 = barras ? M.esq + banda * Math.min(a, b) : x(Math.min(a, b));
            const x1 = barras ? M.esq + banda * (Math.max(a, b) + 1) : x(Math.max(a, b));
            return (
              <g key={`fx${j}`} className="sl-g-faixa">
                <rect x={x0} y={M.topo} width={Math.max(1, x1 - x0)} height={PH} />
                {fx.rotulo && (
                  <text x={x0 + 6} y={M.topo + 14}>
                    {fx.rotulo}
                  </text>
                )}
              </g>
            );
          })}

          {/* grade e eixo Y */}
          {!inclinacao &&
            ticks.map((t) => (
              <g key={t} className="sl-g-grade">
                <line x1={M.esq} x2={M.esq + PW} y1={y(t)} y2={y(t)} data-zero={!log && t === 0 ? "" : undefined} />
                <text x={M.esq - 8} y={y(t) + 4} textAnchor="end">
                  {fmtEixo(t)}
                </text>
              </g>
            ))}

          {/* eixo X */}
          {inclinacao
            ? [0, 1].map((i) => (
                <g key={i} className="sl-g-coluna">
                  <line x1={x(i)} x2={x(i)} y1={M.topo - 6} y2={M.topo + PH} />
                  <text x={x(i)} y={M.topo - 14} textAnchor="middle">
                    {eixoX[i]}
                  </text>
                </g>
              ))
            : eixoX.map((rotulo, i) => {
                if (!mostrarX(i)) return null;
                const yx = H - M.base + 20;
                if (linhasX)
                  return (
                    <text key={rotulo + i} className="sl-g-x" x={x(i)} y={yx} textAnchor="middle">
                      {linhasX[i].map((l, k) => (
                        <tspan key={k} x={x(i)} dy={k ? 13 : 0}>
                          {l}
                        </tspan>
                      ))}
                    </text>
                  );
                if (inclinarX)
                  return (
                    <text key={rotulo + i} className="sl-g-x" x={x(i) + 4} y={yx - 6} textAnchor="end" transform={`rotate(-35 ${x(i) + 4} ${yx - 6})`}>
                      {rotulo}
                    </text>
                  );
                return (
                  <text key={rotulo + i} className="sl-g-x" x={x(i)} y={H - 10} textAnchor={!barras && i === 0 ? "start" : !barras && i === n - 1 ? "end" : "middle"}>
                    {rotulo}
                  </text>
                );
              })}

          {/* banda do ponto ativo, em barras */}
          {barras && marcado !== null && (
            <rect className="sl-g-banda" x={M.esq + banda * marcado} y={M.topo} width={banda} height={PH} />
          )}

          {/* séries */}
          <g className="sl-g-dados">
            {barras
              ? eixoX.map((_, i) => {
                  let pos = 0;
                  let neg = 0;
                  return visiveis.map(({ s, k }, j) => {
                    const v = s.valores[i];
                    if (v === null || !Number.isFinite(v)) return null;
                    let topo: number;
                    let alt: number;
                    let xb: number;
                    if (empilhada) {
                      const de = v >= 0 ? pos : neg;
                      const ate = de + v;
                      if (v >= 0) pos = ate;
                      else neg = ate;
                      topo = Math.min(y(de), y(ate));
                      alt = Math.abs(y(de) - y(ate));
                      xb = xPonto(i) - largBarra / 2;
                    } else {
                      topo = Math.min(y(v), y0);
                      alt = Math.abs(y(v) - y0);
                      xb = xPonto(i) - (largBarra * visiveis.length) / 2 + largBarra * j;
                    }
                    const negativo = v < 0;
                    return (
                      <rect
                        key={`${s.nome}-${i}`}
                        className="sl-g-barra"
                        x={xb + (empilhada ? 0 : 1)}
                        y={topo}
                        width={Math.max(1, largBarra - (empilhada ? 0 : 2))}
                        height={Math.max(1, alt)}
                        fill={COR[cores[k]]}
                        stroke={empilhada ? "#fdfbf6" : undefined}
                        strokeWidth={empilhada ? 1 : undefined}
                        style={{ transformOrigin: negativo ? "center top" : "center bottom", animationDelay: `${Math.min(i * 40, 500)}ms` }}
                      />
                    );
                  });
                })
              : visiveis.map(({ s, k }) => {
                  const d = caminho(s.valores);
                  const cor = COR[cores[k]];
                  const principal = cores[k] === "acento";
                  return (
                    <g key={s.nome}>
                      {forma === "area" && (
                        <path
                          className="sl-g-area"
                          d={`${d}L${x(n - 1).toFixed(1)},${y0.toFixed(1)}L${x(0).toFixed(1)},${y0.toFixed(1)}Z`}
                          fill={cor}
                          opacity={principal ? 0.13 : 0.08}
                        />
                      )}
                      <path
                        className="sl-g-traco"
                        d={d}
                        pathLength={1}
                        fill="none"
                        stroke={cor}
                        strokeWidth={inclinacao ? 2.25 : principal ? 2.25 : 1.75}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        opacity={inclinacao && ativo !== null && visiveis[ativo]?.s.nome !== s.nome ? 0.3 : 1}
                      />
                      {inclinacao &&
                        [0, 1].map((i) =>
                          s.valores[i] === null ? null : (
                            <circle key={i} className="sl-g-rotulo" cx={x(i)} cy={y(s.valores[i] as number)} r={3.5} fill={cor} />
                          ),
                        )}
                    </g>
                  );
                })}
          </g>

          {/* rótulos de valor: fim das linhas, topo das barras, lados da inclinação */}
          {comRotuloFinal &&
            visiveis.map(({ s, k }, j) =>
              ultimos[j] ? (
                <text
                  key={`rf-${s.nome}`}
                  className="sl-g-rotulo sl-g-valor"
                  x={M.esq + PW + 6}
                  y={rotulosFinais[j] + 4}
                  fill={COR_TEXTO[cores[k]] ?? COR[cores[k]]}
                >
                  {fmt(ultimos[j]!.v)}
                </text>
              ) : null,
            )}
          {poucasBarras &&
            visiveis.map(({ s, k }, j) =>
              s.valores.map((v, i) =>
                v === null ? null : (
                  <text
                    key={`rb-${s.nome}-${i}`}
                    className="sl-g-rotulo sl-g-valor"
                    x={xPonto(i) - (largBarra * visiveis.length) / 2 + largBarra * j + largBarra / 2}
                    y={v >= 0 ? y(v) - 6 : y(v) + 14}
                    textAnchor="middle"
                    fill={COR_TEXTO[cores[k]] ?? (cores[k] === "cinzaPalido" ? "#8f877c" : COR[cores[k]])}
                  >
                    {fmtBarra!(v)}
                  </text>
                ),
              ),
            )}
          {inclinacao &&
            (() => {
              const esq = afastar(visiveis.map(({ s }) => y(s.valores[0] ?? 0)), 15, M.topo, M.topo + PH);
              const dir = afastar(visiveis.map(({ s }) => y(s.valores[1] ?? 0)), 15, M.topo, M.topo + PH);
              return visiveis.map(({ s, k }, j) => {
                const cor = COR_TEXTO[cores[k]] ?? COR[cores[k]];
                const apagada = ativo !== null && ativo !== j;
                return (
                  <g key={`sl-${s.nome}`} className="sl-g-rotulo" opacity={apagada ? 0.35 : 1}>
                    <text x={x(0) - 10} y={esq[j] + 4} textAnchor="end" fill={cor}>
                      <tspan className="sl-g-nome">{s.nome}</tspan> <tspan className="sl-g-valor">{fmt(s.valores[0])}</tspan>
                    </text>
                    <text x={x(1) + 10} y={dir[j] + 4} fill={cor} className="sl-g-valor">
                      {fmt(s.valores[1])}
                    </text>
                  </g>
                );
              });
            })()}

          {/* linha de referência */}
          {referencia && !inclinacao && (
            <g className="sl-g-ref">
              <line x1={M.esq} x2={M.esq + PW} y1={y(referencia.valor)} y2={y(referencia.valor)} />
              <text x={M.esq + PW} y={y(referencia.valor) - 6} textAnchor="end">
                {referencia.rotulo}
              </text>
            </g>
          )}

          {/* marcos */}
          {marcosOk.map((m, j) => {
            const xm = x(m.i);
            const yRot = 12 + linhasMarcos[j] * 15;
            const pertoDoFim = xm + m.rotulo.length * 6.4 > W - 4;
            return (
              <g key={`mc${j}`} className="sl-g-marco">
                <line x1={xm} x2={xm} y1={yRot + 4} y2={M.topo + PH} />
                <text x={pertoDoFim ? xm - 4 : xm + 4} y={yRot} textAnchor={pertoDoFim ? "end" : "start"}>
                  {m.rotulo}
                </text>
              </g>
            );
          })}

          {/* cruz de leitura */}
          {!barras && marcado !== null && (
            <g className="sl-g-cruz">
              <line x1={x(marcado)} x2={x(marcado)} y1={M.topo} y2={M.topo + PH} />
              {visiveis.map(({ s, k }) => {
                const v = s.valores[marcado];
                if (v === null || v === undefined) return null;
                return <circle key={s.nome} cx={x(marcado)} cy={y(v)} r={4.5} fill="#fdfbf6" stroke={COR[cores[k]]} strokeWidth={2} />;
              })}
            </g>
          )}
        </svg>

        {ativo !== null && (
          <div
            className="sl-dica"
            aria-hidden="true"
            data-lado={inclinacao ? "centro" : dicaEsq ? "esq" : "dir"}
            style={
              inclinacao
                ? { left: "50%", top: `${((M.topo + 4) / H) * 100}%` }
                : { left: `${(dicaX / W) * 100}%`, top: `${((M.topo + 4) / H) * 100}%` }
            }
          >
            {inclinacao ? (
              (() => {
                const { s, k } = visiveis[ativo] ?? visiveis[0];
                const a = s.valores[0];
                const b = s.valores[1];
                return (
                  <>
                    <b>{s.nome}</b>
                    <span>
                      <i style={{ background: COR[cores[k]] }} />
                      {eixoX[0]}
                      <em>{fmt(a)}</em>
                    </span>
                    <span>
                      <i style={{ background: COR[cores[k]] }} />
                      {eixoX[1]}
                      <em>{fmt(b)}</em>
                    </span>
                    {a !== null && b !== null && (
                      <span className="sl-dica-total">
                        Variação
                        <em>{formatar(b - a, { ...f, sinal: true })}</em>
                      </span>
                    )}
                  </>
                );
              })()
            ) : (
              <>
                <b>{eixoX[ativo]}</b>
                {visiveis.map(({ s, k }) => (
                  <span key={s.nome}>
                    <i style={{ background: COR[cores[k]] }} />
                    {visiveis.length > 1 || series.length > 1 ? s.nome : titulo.length < 34 ? titulo : "Valor"}
                    <em>{fmt(s.valores[ativo])}</em>
                  </span>
                ))}
                {empilhada && visiveis.length > 1 && (
                  <span className="sl-dica-total">
                    Total
                    <em>{fmt(visiveis.reduce((acc, { s }) => acc + (s.valores[ativo] ?? 0), 0))}</em>
                  </span>
                )}
              </>
            )}
          </div>
        )}
        {/* O mesmo conteúdo da dica, para leitor de tela: a dica em si é visual. */}
        <p className="sl-so-leitor" aria-live="polite">
          {ativo === null
            ? ""
            : inclinacao
              ? (() => {
                  const s = visiveis[ativo]?.s;
                  return s ? `${s.nome}: ${eixoX[0]} ${fmt(s.valores[0])}, ${eixoX[1]} ${fmt(s.valores[1])}` : "";
                })()
              : `${eixoX[ativo]}: ${visiveis.map(({ s }) => `${s.nome} ${fmt(s.valores[ativo])}`).join("; ")}`}
        </p>
      </div>

      {origem && <Origem origem={origem} id={idOrigem} />}

      <details className="sl-dados">
        <summary>Ver os dados em tabela</summary>
        <div className="sl-tabela-caixa">
          <table className="sl-tabela sl-tabela-num">
            <caption className="sl-so-leitor">{titulo}</caption>
            <thead>
              <tr>
                <th scope="col">Ponto</th>
                {series.map((s) => (
                  <th scope="col" key={s.nome}>
                    {s.nome}
                  </th>
                ))}
                {empilhada && series.length > 1 && <th scope="col">Total</th>}
              </tr>
            </thead>
            <tbody>
              {eixoX.map((rotulo, i) => (
                <tr key={rotulo + i}>
                  <th scope="row">{rotulo}</th>
                  {series.map((s) => (
                    <td key={s.nome}>{fmt(s.valores[i])}</td>
                  ))}
                  {empilhada && series.length > 1 && <td>{fmt(series.reduce((acc, s) => acc + (s.valores[i] ?? 0), 0))}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

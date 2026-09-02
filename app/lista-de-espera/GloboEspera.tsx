"use client";

import { useEffect, useRef } from "react";
import { RG, PERSP, TILT, FASE, ARO, COSTA, TERRA, CIDADES, ROTAS } from "../_lp/globo-dados";

/**
 * Globo de fundo da pré-lista. Mesma matemática e mesmas cores do
 * `app/_lp/GloboCanvas.tsx` — projeção em perspectiva, corte no limbo, slerp das
 * rotas — com duas diferenças, as duas necessárias aqui:
 *
 * 1. **Parado, e partido em dois canvas.** O da LP gira (`GIRO_MS`) e reprojeta
 *    tudo a cada quadro; com ~3.300 pontos de litoral isso trava numa tela que,
 *    ao contrário do hero, fica parada na frente do visitante o tempo todo do
 *    preenchimento do formulário. Aqui a fase é fixa, o canvas de baixo pinta uma
 *    vez o que é estático (aro, terra, litoral, praças, linha-base das rotas) e o
 *    de cima repinta por quadro só a corcova de luz e o sonar. O tilt por mouse
 *    saiu junto com o giro: não há `#hero` nem `HeroPointer` nesta rota.
 *
 * 2. **Ponto de quebra alinhado ao layout.** Abaixo de 990px — o mesmo ponto em
 *    que o `auto-fit` do `.le-grade` colapsa para uma coluna — o globo encolhe e
 *    sobe para o alto à direita, fora da coluna de texto. O raio e as praças são
 *    recalculados ao cruzar o limite; sem isso, girar o celular reposiciona mas
 *    não reescala.
 *
 * Este componente não toca em nada da LP: importa os dados de `_lp/globo-dados`
 * (só leitura) e desenha nos próprios canvas.
 */

const RAD = Math.PI / 180;

/** Arco central entre dois pontos geográficos, em graus. */
function arco(lo1: number, la1: number, lo2: number, la2: number) {
  const p1 = la1 * RAD, p2 = la2 * RAD;
  const h =
    Math.sin((p2 - p1) / 2) ** 2 +
    Math.cos(p1) * Math.cos(p2) * Math.sin(((lo2 - lo1) * RAD) / 2) ** 2;
  return (2 * Math.asin(Math.min(1, Math.sqrt(h)))) / RAD;
}

/** Interpolação sobre o grande círculo (interpolar lat/lon direto entorta perto dos polos). */
function slerp(lo1: number, la1: number, lo2: number, la2: number, f: number): [number, number] {
  const p1 = la1 * RAD, t1 = lo1 * RAD, p2 = la2 * RAD, t2 = lo2 * RAD;
  const d = arco(lo1, la1, lo2, la2) * RAD;
  if (d < 1e-9) return [lo1, la1];
  const A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
  const x = A * Math.cos(p1) * Math.cos(t1) + B * Math.cos(p2) * Math.cos(t2);
  const y = A * Math.cos(p1) * Math.sin(t1) + B * Math.cos(p2) * Math.sin(t2);
  const z = A * Math.sin(p1) + B * Math.sin(p2);
  return [Math.atan2(y, x) / RAD, Math.atan2(z, Math.hypot(x, y)) / RAD];
}

/** Praça já projetada: com a fase fixa, isso só muda quando o raio muda. */
type Praca = {
  x: number; y: number; k: number; zn: number;
  sigla: string; pais: string;
  periodo: number; atraso: number;
};

type Props = {
  /** Centro do globo em fração da largura/altura, acima do ponto de quebra. */
  centroX?: number;
  centroY?: number;
  escala?: number;
};

/** O mesmo 990px do `auto-fit` em `.le-grade`. Os dois andam juntos. */
const CORTE = 990;

export default function GloboEspera({ centroX = 0.63, centroY = 0.46, escala = 0.92 }: Props) {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvB = baseRef.current, cvA = animRef.current;
    const ctxB = cvB?.getContext("2d");
    const ctxA = cvA?.getContext("2d");
    if (!cvB || !cvA || !ctxB || !ctxA) return;

    // ---- dados -------------------------------------------------------------
    // Litoral do Natural Earth já decimado no porte. Vãos acima de 1,2° são
    // trechos de costa reta e longa e valem preencher; saltos > 3,5° são emendas
    // entre anéis (fim de uma ilha, começo de outra) e não podem ser
    // interpolados, senão surge uma linha falsa cruzando o oceano.
    const cru: number[][] = COSTA.split(",").map((p) => p.split(" ").map(Number));
    const costa: number[] = [];
    for (let i = 0; i < cru.length; i++) {
      const [lo, la] = cru[i];
      costa.push(lo, la);
      if (i + 1 >= cru.length) continue;
      const [lo2, la2] = cru[i + 1];
      const d = arco(lo, la, lo2, la2);
      if (d <= 1.2 || d > 3.5) continue;
      const n = Math.floor(d / 0.7);
      for (let k = 1; k <= n; k++) {
        const [x, y] = slerp(lo, la, lo2, la2, k / (n + 1));
        costa.push(x, y);
      }
    }

    const terra: number[] = TERRA.split(",").flatMap((p) => p.split(" ").map(Number));

    const rotas = ROTAS.map(([a, b]) => {
      const [lo1, la1] = CIDADES[a], [lo2, la2] = CIDADES[b];
      const n = Math.max(12, Math.round(arco(lo1, la1, lo2, la2) / 2));
      return Array.from({ length: n + 1 }, (_, k) => slerp(lo1, la1, lo2, la2, k / n));
    });

    // Períodos primos entre si e defasagem própria, para o conjunto nunca pulsar
    // em coro.
    const ritmo = CIDADES.map((_, i) => ({
      periodo: 3400 + ((i * 977) % 2600),
      atraso: (i * 613) % 3400,
    }));

    // ---- projeção ----------------------------------------------------------
    // Sem giro e sem mouse, o tilt é constante: CT/ST saem do laço de quadro.
    const CT = Math.cos(TILT * RAD), ST = Math.sin(TILT * RAD);
    let raio = RG * escala, aro = ARO * escala;
    // LIMBO: com perspectiva finita a silhueta aparente não é o equador
    // geométrico e sim onde a linha de visão tangencia a esfera.
    let limbo = (raio * raio) / PERSP;
    let px = 0, py = 0, pz = 0, pk = 0;

    /** Projeta (lon, lat) na fase fixa. `rg` acima do raio eleva o ponto da
     *  superfície — é o que dá relevo à corcova de luz das rotas. */
    function proj(lo: number, la: number, rg = raio) {
      const a = la * RAD, b = (lo + FASE) * RAD, ca = Math.cos(a);
      const x = Math.sin(b) * ca * rg, y0 = -Math.sin(a) * rg, z0 = Math.cos(b) * ca * rg;
      const y = y0 * CT - z0 * ST;
      pz = y0 * ST + z0 * CT;
      pk = PERSP / (PERSP - pz);
      px = x * pk;
      py = y * pk;
    }

    // ---- escala por ponto de quebra ---------------------------------------
    let compacto: boolean | null = null;
    let pracas: Praca[] = [];

    function configurar(estreito: boolean) {
      compacto = estreito;
      const fator = escala * (estreito ? 0.62 : 1);
      raio = RG * fator;
      aro = ARO * fator;
      limbo = (raio * raio) / PERSP;
      pracas = [];
      for (let i = 0; i < CIDADES.length; i++) {
        const [lo, la, sigla, pais] = CIDADES[i];
        proj(lo, la);
        if (pz <= limbo) continue;
        pracas.push({
          x: px, y: py, k: pk,
          zn: (pz - limbo) / (raio - limbo),
          sigla, pais,
          ...ritmo[i],
        });
      }
    }

    // ---- canvas ------------------------------------------------------------
    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0;

    /** Camada de baixo: tudo o que não muda. Uma pintura por medida. */
    function pintarBase() {
      ctxB!.clearRect(0, 0, w, h);
      ctxB!.save();
      ctxB!.translate(cx, cy);

      ctxB!.beginPath();
      ctxB!.arc(0, 0, aro, 0, Math.PI * 2);
      ctxB!.strokeStyle = "rgba(169,142,78,.20)";
      ctxB!.lineWidth = 1;
      ctxB!.stroke();

      // linha-base das rotas
      ctxB!.strokeStyle = "rgba(247,245,242,.12)";
      ctxB!.lineWidth = 1;
      ctxB!.beginPath();
      for (const rota of rotas) {
        let caneta = false;
        for (const [lo, la] of rota) {
          proj(lo, la);
          if (pz <= limbo) { caneta = false; continue; }   // trecho atrás do horizonte
          if (caneta) ctxB!.lineTo(px, py);
          else { ctxB!.moveTo(px, py); caneta = true; }
        }
      }
      ctxB!.stroke();

      // interior das massas de terra: textura de fundo, cada ponto testando o
      // limbo por si (sem recorte de polígono).
      //
      // O original usava DUAS faixas de alfa, .09 e .16, para trocar o fillStyle
      // duas vezes em vez de uma por ponto — o custo importava num laço de 60fps.
      // Aqui a camada pinta uma vez, então o custo sumiu e as duas faixas viraram
      // só um defeito: a fronteira entre elas é um circulo na esfera, e um salto
      // de 75% na opacidade atravessando o globo. Girando ela passa despercebida;
      // parado, fica cravada na tela como uma linha onde o verde clareia. Com o
      // alfa em rampa a fronteira deixa de existir, e continuam sendo poucas
      // trocas de fillStyle: uma por degrau, não uma por ponto.
      const FAIXAS_TERRA = 12;
      const terraFaixas: number[][] = Array.from({ length: FAIXAS_TERRA }, () => []);
      for (let i = 0; i < terra.length; i += 2) {
        proj(terra[i], terra[i + 1]);
        if (pz <= limbo) continue;
        const zn = (pz - limbo) / (raio - limbo);
        const f = Math.min(FAIXAS_TERRA - 1, (zn * FAIXAS_TERRA) | 0);
        terraFaixas[f].push(px, py, pk);
      }
      for (let f = 0; f < FAIXAS_TERRA; f++) {
        const arr = terraFaixas[f];
        if (!arr.length) continue;
        // mesmos extremos do original (.09 no fundo, .16 na frente), interpolados
        const a = 0.09 + (0.16 - 0.09) * (f / (FAIXAS_TERRA - 1));
        ctxB!.fillStyle = `rgba(169,142,78,${a.toFixed(4)})`;
        ctxB!.beginPath();
        for (let i = 0; i < arr.length; i += 3) {
          const r = 0.9 * arr[i + 2];
          ctxB!.rect(arr[i] - r, arr[i + 1] - r, r * 2, r * 2);
        }
        ctxB!.fill();
      }

      // litoral: opacidade por profundidade, pelo mesmo motivo e com a mesma
      // rampa da terra. O original tinha quatro faixas (.26/.42/.56/.68); os
      // extremos ficam, o meio deixa de ter degrau.
      const FAIXAS_COSTA = 16;
      const faixas: number[][] = Array.from({ length: FAIXAS_COSTA }, () => []);
      for (let i = 0; i < costa.length; i += 2) {
        proj(costa[i], costa[i + 1]);
        if (pz <= limbo) continue;
        const zn = (pz - limbo) / (raio - limbo);   // 0 no horizonte, 1 de frente
        const f = Math.min(FAIXAS_COSTA - 1, (zn * FAIXAS_COSTA) | 0);
        faixas[f].push(px, py, pk, Math.min(1, zn / 0.14));
      }
      for (let f = 0; f < FAIXAS_COSTA; f++) {
        const arr = faixas[f];
        if (!arr.length) continue;
        const a = 0.26 + (0.68 - 0.26) * (f / (FAIXAS_COSTA - 1));
        ctxB!.fillStyle = `rgba(169,142,78,${a.toFixed(4)})`;
        ctxB!.beginPath();
        for (let i = 0; i < arr.length; i += 4) {
          // Junto do horizonte o raio cresce de 0 até cheio, para os pontos
          // nascerem como um respiro em vez de surgir com tamanho cheio. O fator
          // já vale 1 para zn ≥ 0.14, então aplicar sempre é igual ao `f === 0`
          // do original e sem o degrau que ele criava na borda da primeira faixa.
          const r = 1.25 * arr[i + 2] * arr[i + 3];
          ctxB!.rect(arr[i] - r, arr[i + 1] - r, r * 2, r * 2);
        }
        ctxB!.fill();
      }

      // praças: núcleo e rótulo são fixos; só o sonar anima, e ele vive na
      // camada de cima.
      ctxB!.textBaseline = "middle";
      for (const p of pracas) {
        ctxB!.globalAlpha = Math.min(1, 0.5 + 0.5 * p.zn);
        ctxB!.fillStyle = "#F0E3C4";
        ctxB!.beginPath();
        ctxB!.arc(p.x, p.y, 1.7 * p.k, 0, Math.PI * 2);
        ctxB!.fill();

        // O rótulo some antes do limbo: colado na silhueta ele vira sujeira.
        if (p.zn > 0.34) {
          const fade = Math.min(1, (p.zn - 0.34) / 0.22);
          const dx = p.x + 7 * p.k, dy = p.y - 0.5;
          ctxB!.globalAlpha = fade * 0.3;
          ctxB!.font = `600 ${(9.5 * p.k).toFixed(1)}px Montserrat, system-ui, sans-serif`;
          ctxB!.fillStyle = "#F1E6CE";
          ctxB!.fillText(p.sigla, dx, dy);
          const larg = ctxB!.measureText(p.sigla).width;
          ctxB!.globalAlpha = fade * 0.17;
          ctxB!.font = `500 ${(8 * p.k).toFixed(1)}px Montserrat, system-ui, sans-serif`;
          ctxB!.fillText(p.pais, dx + larg + 4 * p.k, dy);
        }
        ctxB!.globalAlpha = 1;
      }

      ctxB!.restore();
      cvB!.classList.add("le-pronto");
    }

    const LARG = 0.16;    // largura da janela da corcova (fração da rota)
    const ELEV = 0.022;   // altura máx do relevo (fração do raio)

    /** Camada de cima: só o que muda por quadro. */
    function pintarAnim(t: number) {
      ctxA!.clearRect(0, 0, w, h);
      ctxA!.save();
      ctxA!.translate(cx, cy);

      // Uma corcova de luz por rota: janela gaussiana que anda de uma praça à
      // outra. Os pontos dentro dela sobem um tico da superfície e brilham — não
      // é um ponto viajando, é um trecho da própria linha que se ergue e passa.
      ctxA!.lineCap = "round";
      for (let r = 0; r < rotas.length; r++) {
        const rota = rotas[r], n = rota.length - 1;
        const fr = ((t / (5200 + r * 430)) + r * 0.37) % 1;   // velocidade e defasagem próprias
        let ppx = 0, ppy = 0, tem = false;
        for (let k = 0; k <= n; k++) {
          const s = k / n;
          const dist = Math.abs(s - fr);
          const peso = dist < LARG ? Math.cos((dist / LARG) * (Math.PI / 2)) ** 2 : 0;
          if (peso < 0.02) { tem = false; continue; }
          proj(rota[k][0], rota[k][1], raio * (1 + ELEV * peso));
          if (pz <= limbo) { tem = false; continue; }
          if (tem) {
            ctxA!.strokeStyle = `rgba(241,230,206,${(peso * 0.5).toFixed(3)})`;
            ctxA!.lineWidth = 0.8 + peso * 1.1;
            ctxA!.beginPath();
            ctxA!.moveTo(ppx, ppy);
            ctxA!.lineTo(px, py);
            ctxA!.stroke();
          }
          ppx = px; ppy = py; tem = true;
        }
      }
      ctxA!.lineCap = "butt";

      // Sonar das praças: dois anéis defasados que nascem no ponto e expandem
      // sumindo. Lê como "hub ativo" por movimento pontual, não por brilho
      // difuso — continua sendo fundo quando o olho vai para o formulário.
      ctxA!.strokeStyle = "#D9BE85";
      ctxA!.lineWidth = 1;
      for (const p of pracas) {
        const vis = 0.4 + 0.6 * p.zn;
        for (let a = 0; a < 2; a++) {
          const ph = (((t + p.atraso) / (p.periodo * 1.5)) + a * 0.5) % 1;
          ctxA!.globalAlpha = (1 - ph) * 0.5 * vis;
          ctxA!.beginPath();
          ctxA!.arc(p.x, p.y, (2 + ph * 13) * p.k, 0, Math.PI * 2);
          ctxA!.stroke();
        }
      }
      ctxA!.globalAlpha = 1;
      ctxA!.restore();
    }

    function medir() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cvB!.clientWidth;
      h = cvB!.clientHeight;
      const estreito = w < CORTE;
      // Recalcular raio e praças ao cruzar o limite. Sem isto, girar o celular
      // reposiciona o globo mas não o reescala.
      if (estreito !== compacto) configurar(estreito);
      // Empilhado, o globo vai para o alto à direita, fora da coluna de texto.
      cx = w * (estreito ? 0.84 : centroX);
      cy = h * (estreito ? 0.12 : centroY);
      for (const cv of [cvB!, cvA!]) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
      ctxB!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxA!.setTransform(dpr, 0, 0, dpr, 0, 0);
      pintarBase();
    }

    // ---- loop --------------------------------------------------------------
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, visivel = true, inicio = 0;
    const quadro = (agora: number) => {
      if (!inicio) inicio = agora;
      pintarAnim(agora - inicio);
      raf = requestAnimationFrame(quadro);
    };
    const tocar = () => {
      cancelAnimationFrame(raf);
      if (reduzido.matches) { pintarAnim(0); return; }   // um quadro, parado
      if (visivel) raf = requestAnimationFrame(quadro);
    };

    medir();
    tocar();

    const io = new IntersectionObserver(
      ([e]) => { visivel = e.isIntersecting; tocar(); },
      { threshold: 0 },
    );
    io.observe(cvB);

    // Debounce: `medir` repinta o litoral inteiro, e o teclado do celular
    // abrindo sobre o formulário dispara uma rajada de resize.
    let pend: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(pend);
      pend = setTimeout(() => { medir(); if (reduzido.matches) pintarAnim(0); }, 120);
    });
    ro.observe(cvB);
    reduzido.addEventListener("change", tocar);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(pend);
      io.disconnect();
      ro.disconnect();
      reduzido.removeEventListener("change", tocar);
    };
  }, [centroX, centroY, escala]);

  return (
    <div className="le-globo" aria-hidden="true">
      <canvas ref={baseRef} className="le-globo-base" />
      <canvas ref={animRef} />
    </div>
  );
}

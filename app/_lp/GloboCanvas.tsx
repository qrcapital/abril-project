"use client";

import { useEffect } from "react";
import { RG, PERSP, TILT, FASE, GIRO_MS, ARO, COSTA, TERRA, CIDADES, ROTAS } from "./globo-dados";

/**
 * Globo do hero, desenhado em canvas 2D.
 *
 * A primeira versão punha um elemento por ponto dentro de um `preserve-3d`. Isso funciona
 * até uns 1.500 elementos; passando disso o navegador gasta o quadro inteiro reordenando
 * a árvore por profundidade e a página trava. Aqui o custo é proporcional ao que se pinta,
 * então cabem os ~3.300 pontos de litoral, as 26 praças com halo e as rotas, com folga.
 *
 * Segue o padrão do HeroPointer: o `<canvas>` já vem no HTML injetado (etapa 7l do porte),
 * o componente só acha o elemento e liga o desenho por cima (progressive enhancement — sem
 * JS o hero fica com o gradiente e a trama de pontos, que continuam em CSS).
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

export default function GloboCanvas() {
  useEffect(() => {
    const cv = document.querySelector<HTMLCanvasElement>(".cn-canvas");
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    // ---- dados -------------------------------------------------------------
    // Litoral do Natural Earth (ne_50m_land) já decimado a ~0,6° no porte, com ilhas de
    // perímetro > 1,5°. Os pontos são reais, então aqui só preenchemos vãos que sobraram
    // acima de 1,2° (trechos de costa reta e longa); saltos > 3,5° são emendas entre
    // anéis (fim de uma ilha, começo de outra) e não podem ser interpolados, senão surge
    // uma linha falsa cruzando o oceano.
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

    // Interior das massas de terra (stipple pré-computado no porte): array plano lon/lat.
    const terra: number[] = TERRA.split(",").flatMap((p) => p.split(" ").map(Number));

    // Cada rota vira uma polilinha amostrada no grande círculo (um ponto a cada ~2°).
    const rotas = ROTAS.map(([a, b]) => {
      const [lo1, la1] = CIDADES[a], [lo2, la2] = CIDADES[b];
      const n = Math.max(12, Math.round(arco(lo1, la1, lo2, la2) / 2));
      return Array.from({ length: n + 1 }, (_, k) => slerp(lo1, la1, lo2, la2, k / n));
    });

    // Ritmo de brilho por cidade: períodos primos entre si e defasagem própria, para o
    // conjunto nunca pulsar em coro (o mesmo truque das estrelas antigas).
    const ritmo = CIDADES.map((_, i) => ({
      periodo: 3400 + ((i * 977) % 2600),
      atraso: (i * 613) % 3400,
    }));

    // ---- projeção ----------------------------------------------------------
    // CT/ST derivam do tilt e são recalculados por quadro: o mouse inclina o globo (my)
    // além da inclinação-base do curso, então o tilt não é mais constante.
    let CT = Math.cos(TILT * RAD), ST = Math.sin(TILT * RAD);
    // LIMBO: profundidade do horizonte VISÍVEL. Com perspectiva finita o observador fica a
    // PERSP do centro, então a silhueta aparente da esfera não é o equador geométrico
    // (pz = 0) e sim o círculo onde a linha de visão tangencia a esfera. Um ponto é visível
    // quando está do lado do observador do plano tangente ali: (Obs - P)·P > 0, que resolve
    // para pz > RG²/PERSP. Testar contra 0 deixava passar a casca traseira perto da borda,
    // e ela aparecia ALÉM da curvatura e piscava em vez de girar para fora suavemente.
    const LIMBO = (RG * RG) / PERSP;
    let px = 0, py = 0, pz = 0, pk = 0;
    /** Projeta (lon, lat) já girado de `fase` e guarda em px/py (tela), pz (profundidade).
     *  `rg` permite projetar acima da superfície (raio > RG) — usado pela corcova de luz
     *  que percorre as rotas: elevar o trecho aproxima do observador (pz e pk crescem). */
    function proj(lo: number, la: number, fase: number, rg = RG) {
      const a = la * RAD, b = (lo + fase) * RAD, ca = Math.cos(a);
      const x = Math.sin(b) * ca * rg, y0 = -Math.sin(a) * rg, z0 = Math.cos(b) * ca * rg;
      const y = y0 * CT - z0 * ST;
      pz = y0 * ST + z0 * CT;
      pk = PERSP / (PERSP - pz);
      px = x * pk;
      py = y * pk;
    }

    // ---- interação: o mouse move o próprio globo -------------------------
    // Antes o hover deslizava as camadas (parallax de translação), efeito que dependia das
    // estrelas — removidas. Agora o cursor gira e inclina a esfera: mais coerente, é a
    // esfera 3D respondendo. Lê --mx/--my que o HeroPointer já escreve no #hero (−0.5..0.5)
    // e persegue o alvo com lerp, para o movimento nascer suave e voltar sozinho ao centro.
    const AMP_GIRO = 26;   // graus de rotação extra no eixo Y, no fim de curso do mouse
    const AMP_TILT = 12;   // graus de inclinação extra no eixo X
    let alvoX = 0, alvoY = 0, curX = 0, curY = 0;
    function lerAlvo() {
      const hero = document.getElementById("hero");
      if (!hero) { alvoX = alvoY = 0; return; }
      alvoX = parseFloat(hero.style.getPropertyValue("--mx")) || 0;
      alvoY = parseFloat(hero.style.getPropertyValue("--my")) || 0;
    }

    // ---- canvas ------------------------------------------------------------
    let w = 0, h = 0, dpr = 1;
    function medir() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv!.clientWidth;
      h = cv!.clientHeight;
      cv!.width = Math.round(w * dpr);
      cv!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function desenhar(t: number) {
      lerAlvo();
      curX += (alvoX - curX) * 0.06;                 // easing exponencial em direção ao alvo
      curY += (alvoY - curY) * 0.06;
      CT = Math.cos((TILT + curY * AMP_TILT) * RAD);
      ST = Math.sin((TILT + curY * AMP_TILT) * RAD);
      const fase = FASE - 360 * ((t % GIRO_MS) / GIRO_MS) + curX * AMP_GIRO;
      const cx = w / 2, cy = h * 0.42;
      ctx!.clearRect(0, 0, w, h);
      ctx!.save();
      ctx!.translate(cx, cy);

      // aro da silhueta
      ctx!.beginPath();
      ctx!.arc(0, 0, ARO, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(169,142,78,.20)";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // rotas: linha-base fraca (fundo do fundo) + uma corcova de luz que percorre cada
      // rota. A corcova é uma janela estreita que anda de uma praça à outra: os pontos
      // dentro dela sobem um tico da superfície (raio > RG, um relevo sutil) e brilham,
      // com o pico no centro da janela caindo para zero nas bordas. Não é um ponto viajando
      // e sim um trecho da própria linha que se ergue e passa — "rebarba passeando".
      ctx!.strokeStyle = "rgba(247,245,242,.12)";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      for (const rota of rotas) {
        let caneta = false;
        for (const [lo, la] of rota) {
          proj(lo, la, fase);
          if (pz <= LIMBO) { caneta = false; continue; }   // trecho atrás do horizonte
          if (caneta) ctx!.lineTo(px, py);
          else { ctx!.moveTo(px, py); caneta = true; }
        }
      }
      ctx!.stroke();

      // corcova por rota: janela gaussiana centrada em `fr`, que avança com o tempo.
      const LARG = 0.16;                          // largura da janela (fração da rota)
      const ELEV = 0.022;                         // altura máx do relevo (fração de RG)
      ctx!.lineCap = "round";
      for (let r = 0; r < rotas.length; r++) {
        const rota = rotas[r], n = rota.length - 1;
        // fase própria: cada rota tem sua velocidade e defasagem, para não pulsarem juntas.
        const fr = ((t / (5200 + r * 430)) + r * 0.37) % 1;
        let ppx = 0, ppy = 0, tem = false;
        for (let k = 0; k <= n; k++) {
          const s = k / n;
          const dist = Math.abs(s - fr);
          const peso = dist < LARG ? Math.cos((dist / LARG) * (Math.PI / 2)) ** 2 : 0;
          if (peso < 0.02) { tem = false; continue; }
          proj(rota[k][0], rota[k][1], fase, RG * (1 + ELEV * peso));
          if (pz <= LIMBO) { tem = false; continue; }
          if (tem) {
            ctx!.strokeStyle = `rgba(241,230,206,${(peso * 0.5).toFixed(3)})`;
            ctx!.lineWidth = 0.8 + peso * 1.1;
            ctx!.beginPath();
            ctx!.moveTo(ppx, ppy);
            ctx!.lineTo(px, py);
            ctx!.stroke();
          }
          ppx = px; ppy = py; tem = true;
        }
      }
      ctx!.lineCap = "butt";

      // litoral: quatro faixas de opacidade por profundidade, para dar volume sem
      // trocar de fillStyle a cada ponto (uma troca por faixa, quatro no total).
      // massa de terra: pontos de interior bem apagados, por baixo do litoral, para o
      // continente "acender" sobre o oceano escuro. Duas faixas de profundidade bastam
      // (é textura de fundo, não contorno), e cada ponto testa o limbo por si — sem o
      // recorte de polígono que um preenchimento sólido exigiria.
      const terraFrente: number[] = [], terraFundo: number[] = [];
      for (let i = 0; i < terra.length; i += 2) {
        proj(terra[i], terra[i + 1], fase);
        if (pz <= LIMBO) continue;
        const zn = (pz - LIMBO) / (RG - LIMBO);
        (zn > 0.5 ? terraFrente : terraFundo).push(px, py, pk);
      }
      for (const [arr, a] of [[terraFundo, 0.09], [terraFrente, 0.16]] as const) {
        if (!arr.length) continue;
        ctx!.fillStyle = `rgba(169,142,78,${a})`;
        ctx!.beginPath();
        for (let i = 0; i < arr.length; i += 3) {
          const r = 0.9 * arr[i + 2];
          ctx!.rect(arr[i] - r, arr[i + 1] - r, r * 2, r * 2);
        }
        ctx!.fill();
      }

      // zn agora normaliza o intervalo VISÍVEL (limbo→frente) em 0→1, não pz/RG: como o
      // limbo saiu de 0 para ~118px, dividir por RG deixaria a faixa mais apagada sem uso.
      const faixas: number[][] = [[], [], [], []];
      for (let i = 0; i < costa.length; i += 2) {
        proj(costa[i], costa[i + 1], fase);
        if (pz <= LIMBO) continue;
        const zn = (pz - LIMBO) / (RG - LIMBO);   // 0 no horizonte, 1 de frente
        faixas[Math.min(3, (zn * 4) | 0)].push(px, py, pk, Math.min(1, zn / 0.14));
      }
      const alfa = [0.26, 0.42, 0.56, 0.68];
      for (let f = 0; f < 4; f++) {
        const arr = faixas[f];
        if (!arr.length) continue;
        ctx!.fillStyle = `rgba(169,142,78,${alfa[f]})`;
        ctx!.beginPath();
        for (let i = 0; i < arr.length; i += 4) {
          // borda do horizonte: os pontos entram com raio crescente (0→cheio) na faixa
          // mais rasa, então nascem como um respiro em vez de surgir com tamanho cheio.
          const r = 1.25 * arr[i + 2] * (f === 0 ? arr[i + 3] : 1);
          ctx!.rect(arr[i] - r, arr[i + 1] - r, r * 2, r * 2);
        }
        ctx!.fill();
      }

      // praças: anel sonar. Núcleo nítido e fixo + dois anéis que nascem no ponto e
      // expandem sumindo, num pulso lento. Lê como "hub ativo" por movimento pontual, não
      // por brilho difuso — então continua sendo fundo quando o olho vai para o texto.
      ctx!.textBaseline = "middle";
      for (let i = 0; i < CIDADES.length; i++) {
        const [lo, la, sigla, pais] = CIDADES[i];
        proj(lo, la, fase);
        if (pz <= LIMBO) continue;
        const zn = (pz - LIMBO) / (RG - LIMBO);
        const vis = 0.4 + 0.6 * zn;                 // some junto com o litoral no limbo

        // dois anéis defasados, cada praça com seu ciclo (periodo/atraso próprios)
        const { periodo, atraso } = ritmo[i];
        for (let a = 0; a < 2; a++) {
          const ph = (((t + atraso) / (periodo * 1.5)) + a * 0.5) % 1;
          ctx!.globalAlpha = (1 - ph) * 0.5 * vis;
          ctx!.strokeStyle = "#D9BE85";
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.arc(px, py, (2 + ph * 13) * pk, 0, Math.PI * 2);
          ctx!.stroke();
        }
        // núcleo cheio, quase branco-dourado
        ctx!.globalAlpha = Math.min(1, 0.5 + 0.5 * zn);
        ctx!.fillStyle = "#F0E3C4";
        ctx!.beginPath();
        ctx!.arc(px, py, 1.7 * pk, 0, Math.PI * 2);
        ctx!.fill();

        // Rótulo: some antes do limbo (zn < .34), senão a sigla fica espremida contra a
        // silhueta e vira sujeira. O país entra menor e mais apagado, para o olho ler a
        // cidade primeiro. Continua sendo fundo: a sigla não passa de ~30% de opacidade.
        if (zn > 0.34) {
          const fade = Math.min(1, (zn - 0.34) / 0.22);
          const dx = px + 7 * pk, dy = py - 0.5;
          ctx!.globalAlpha = fade * 0.3;
          ctx!.font = `600 ${(9.5 * pk).toFixed(1)}px Montserrat, system-ui, sans-serif`;
          ctx!.fillStyle = "#F1E6CE";
          ctx!.fillText(sigla, dx, dy);
          const larg = ctx!.measureText(sigla).width;
          ctx!.globalAlpha = fade * 0.17;
          ctx!.font = `500 ${(8 * pk).toFixed(1)}px Montserrat, system-ui, sans-serif`;
          ctx!.fillText(pais, dx + larg + 4 * pk, dy);
        }
        ctx!.globalAlpha = 1;
      }

      ctx!.restore();
    }

    // ---- loop --------------------------------------------------------------
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, visivel = true, inicio = 0;
    const quadro = (agora: number) => {
      if (!inicio) inicio = agora;
      desenhar(agora - inicio);
      raf = requestAnimationFrame(quadro);
    };
    const tocar = () => {
      cancelAnimationFrame(raf);
      if (reduzido.matches) { medir(); desenhar(0); return; }   // um quadro, parado
      if (visivel) raf = requestAnimationFrame(quadro);
    };

    medir();
    tocar();
    cv.classList.add("pronto");

    // Fora da tela o globo não desenha: o hero sai da viewport logo no primeiro scroll e
    // não há motivo para queimar quadro (e bateria) o resto da página inteira.
    const io = new IntersectionObserver(
      ([e]) => { visivel = e.isIntersecting; tocar(); },
      { threshold: 0 },
    );
    io.observe(cv);
    const ro = new ResizeObserver(() => { medir(); if (reduzido.matches) desenhar(0); });
    ro.observe(cv);
    reduzido.addEventListener("change", tocar);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      reduzido.removeEventListener("change", tocar);
    };
  }, []);

  return null;
}

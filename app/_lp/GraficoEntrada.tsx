"use client";

import { useEffect } from "react";

/**
 * Dispara a entrada dos graficos do diagnostico quando eles chegam na tela.
 *
 * A revelacao e um clip da esquerda para a direita (ver `.tem-js .graf` no
 * styles.css) porque a serie comeca em 1994 na esquerda e termina hoje na
 * direita: o sentido da animacao repete o sentido do eixo. Um fade perderia
 * isso.
 *
 * POR QUE ISTO NAO CONFIA NO IntersectionObserver SOZINHO
 * O observer so entrega callback quando a aba tem ciclo de renderizacao. Em
 * aba de segundo plano, em janela minimizada, ou sob economia de energia,
 * ele simplesmente nao dispara, e o grafico ficava fechado para sempre. Foi
 * bug real, relatado duas vezes ("o grafico do dolar sumiu"). Entao:
 *
 *   1. O estado fechado so existe sob `.tem-js`, marcado por script inline
 *      antes da primeira pintura. Sem JS, o grafico aparece.
 *   2. Um listener de `scroll` passivo confere na mao. Rolagem e exatamente
 *      o momento em que o usuario chega no grafico, e o evento chega mesmo
 *      quando o observer nao entrega nada.
 *   3. `visibilitychange`, para quando a aba volta do segundo plano.
 *   4. Um timeout de 2s, para o caso de a pagina abrir ja com o grafico
 *      enquadrado e ninguem rolar.
 *
 * Os quatro caminhos chamam a mesma funcao idempotente. O observer virou o
 * caminho bonito, nao o caminho critico. E ele e criado POR ULTIMO, dentro
 * de try/catch, para que uma falha dele nao derrube os outros tres.
 */
export default function GraficoEntrada() {
  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>(".graf"));
    if (!alvos.length) return;

    const abrir = (el: Element) => el.classList.add("dentro");
    const pendentes = () => alvos.filter((el) => !el.classList.contains("dentro"));

    const semMovimento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (semMovimento) {
      alvos.forEach(abrir);
      return;
    }

    let agendado = false;
    const conferir = () => {
      agendado = false;
      const restantes = pendentes();
      if (!restantes.length) return desligar();
      restantes.forEach((el) => {
        const r = el.getBoundingClientRect();
        // 12% da altura ja dentro da tela: comeca a correr um pouco antes de
        // estar toda enquadrada, senao parece atrasada em relacao a rolagem.
        if (r.top < window.innerHeight - r.height * 0.12 && r.bottom > 0) abrir(el);
      });
      if (!pendentes().length) desligar();
    };
    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      setTimeout(conferir, 80); // setTimeout, nao rAF: rAF nao roda em aba oculta
    };
    const aoVoltar = () => { if (document.visibilityState === "visible") conferir(); };

    let obs: IntersectionObserver | null = null;
    const desligar = () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      document.removeEventListener("visibilitychange", aoVoltar);
      obs?.disconnect();
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar, { passive: true });
    document.addEventListener("visibilitychange", aoVoltar);
    const rede = window.setTimeout(conferir, 2000);

    try {
      obs = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => { if (e.isIntersecting) abrir(e.target); });
        if (!pendentes().length) desligar();
      }, { threshold: 0.12 });
      alvos.forEach((el) => obs!.observe(el));
    } catch {
      /* sem observer os outros tres caminhos dao conta */
    }

    conferir();
    return () => { window.clearTimeout(rede); desligar(); };
  }, []);

  return null;
}

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
 * TRES GARANTIAS, todas nascidas de um bug real (22/set/2026), em que a
 * secao carregava com dois buracos no lugar dos graficos:
 *
 * 1. O estado fechado so existe sob `.tem-js`, marcado por um script inline
 *    antes da primeira pintura. Sem JS o grafico aparece; a animacao e
 *    opt-in, nunca requisito para o conteudo existir.
 *
 * 2. Aba em segundo plano nao tem ciclo de renderizacao, entao o
 *    IntersectionObserver nao entrega callback e o grafico ficaria fechado
 *    ate alguem rolar. Por isso tambem ouvimos `visibilitychange` e
 *    conferimos na mao ao voltar.
 *
 * 3. Rede de seguranca de 2s: o que estiver enquadrado e ainda fechado
 *    abre, aconteca o que acontecer com o observer.
 */
export default function GraficoEntrada() {
  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>(".graf"));
    if (!alvos.length) return;

    const abrir = (el: Element) => el.classList.add("dentro");
    const pendentes = () => alvos.filter((el) => !el.classList.contains("dentro"));

    const semMovimento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (semMovimento || typeof IntersectionObserver === "undefined") {
      alvos.forEach(abrir);
      return;
    }

    // Medicao na mao, para os casos em que o observer nao roda.
    const conferir = () => {
      pendentes().forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) abrir(el);
      });
    };

    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          abrir(e.target);
          obs.unobserve(e.target);
        });
      },
      // 12% e 4% de folga: comeca a correr um pouco ANTES de estar toda na
      // tela, senao a animacao parece atrasada em relacao a rolagem.
      { threshold: 0.12, rootMargin: "0px 0px 4% 0px" }
    );
    alvos.forEach((el) => obs.observe(el));

    const aoVoltar = () => { if (document.visibilityState === "visible") conferir(); };
    document.addEventListener("visibilitychange", aoVoltar);
    const rede = window.setTimeout(conferir, 2000);

    return () => {
      obs.disconnect();
      document.removeEventListener("visibilitychange", aoVoltar);
      window.clearTimeout(rede);
    };
  }, []);

  return null;
}

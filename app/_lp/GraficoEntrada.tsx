"use client";

import { useEffect } from "react";

/**
 * Dispara a entrada dos graficos do diagnostico quando eles chegam na tela.
 *
 * A revelacao e um clip da esquerda para a direita (ver `.graf` no
 * styles.css) porque a serie comeca em 1994 e termina hoje: o sentido da
 * animacao repete o sentido do eixo. Um fade perderia isso.
 *
 * `once`: a classe nao e removida ao sair da tela. Grafico que reanima a
 * cada rolagem vira enfeite, e o efeito so tem valor na primeira leitura.
 */
export default function GraficoEntrada() {
  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>(".graf"));
    if (!alvos.length) return;

    // Sem IntersectionObserver (ou com movimento reduzido), mostra tudo.
    const semMovimento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (semMovimento || typeof IntersectionObserver === "undefined") {
      alvos.forEach((el) => el.classList.add("dentro"));
      return;
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("dentro");
          obs.unobserve(e.target);
        });
      },
      // 22% ja garante que a cedula esta enquadrada antes de comecar a correr.
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
    );
    alvos.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return null;
}

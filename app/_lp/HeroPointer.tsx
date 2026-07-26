"use client";

import { useEffect } from "react";

/**
 * Resposta do hero ao mouse: escreve `--mx/--my` (−0.5..0.5) no `#hero`, e o
 * GloboCanvas lê essas variáveis para girar e inclinar a esfera (a trama de fundo
 * desliza por CSS). O body é injetado via innerHTML e não roda script, por isso o
 * listener vive aqui.
 *
 * O listener fica no window (não no `#hero`) e re-busca o hero a cada evento: em dev
 * o React pode reconstruir o DOM injetado, e um listener preso ao `#hero` ficaria
 * órfão no elemento antigo. Escreve no máximo 1x por frame (requestAnimationFrame) e
 * o "sair" é implícito: quando o cursor deixa a área, zera. Respeita
 * `prefers-reduced-motion`.
 *
 * Hover e foco NÃO passam por aqui: os atributos `style-hover` do bundle viram CSS
 * no porte (ver scripts/comum.mjs). O que também não precisa de JS: menu mobile
 * (checkbox `:checked`) e os acordeões de módulo/FAQ (`<details>`).
 */
export default function HeroPointer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let mx = 0;
    let my = 0;
    let active = false;
    const apply = () => {
      raf = 0;
      const hero = document.getElementById("hero");
      if (!hero) return;
      hero.style.setProperty("--mx", mx.toFixed(3));
      hero.style.setProperty("--my", my.toFixed(3));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      const hero = document.getElementById("hero");
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (inside) {
        mx = (e.clientX - r.left) / r.width - 0.5;
        my = (e.clientY - r.top) / r.height - 0.5;
        active = true;
        schedule();
      } else if (active) {
        mx = 0;
        my = 0;
        active = false;
        schedule();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

/**
 * Runtime de hover da LP (progressive enhancement).
 *
 * O bundle do Claude Design aplicava os hovers de botões/links via atributo
 * `style-hover`, trocando o `style` inline em JS; o porte estático removeu esse
 * runtime. Aqui reproduzimos o mesmo comportamento — fiel e leve, sem framework
 * de animação. As transições já vivem no `style` base de cada elemento, então a
 * suavidade dos botões volta idêntica ao design original.
 *
 * O que NÃO precisa de JS (nativo, já funciona no porte): menu mobile
 * (checkbox `:checked`) e os acordeões de módulo/FAQ (`<details>`).
 */
export default function HoverRuntime() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[style-hover]");
    const cleanups: Array<() => void> = [];

    els.forEach((el) => {
      const hover = el.getAttribute("style-hover");
      if (!hover) return;
      const base = el.getAttribute("style") || "";
      const on = base + (base && !/;\s*$/.test(base) ? ";" : "") + hover;
      const enter = () => el.setAttribute("style", on);
      const leave = () => el.setAttribute("style", base);
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
        el.setAttribute("style", base);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Parallax de camadas do hero: ao mover o mouse, seta --mx/--my (−0.5..0.5) na seção,
  // e o CSS desloca estrelas/trama/globo em intensidades diferentes (profundidade). O
  // body é injetado via innerHTML e não roda script; por isso o listener vive aqui.
  //
  // O listener fica no window (não no #hero) e re-busca o hero a cada evento: em dev o
  // React pode reconstruir o DOM injetado, e um listener preso ao #hero ficaria órfão no
  // elemento antigo. Escreve no máximo 1x por frame (requestAnimationFrame) e o "sair"
  // é implícito — quando o cursor deixa a área, zera. Respeita prefers-reduced-motion.
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

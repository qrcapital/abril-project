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

  return null;
}

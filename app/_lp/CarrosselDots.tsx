"use client";

import { useEffect } from "react";

/**
 * Bolinhas dos carrosseis mobile (docentes e Quem Assina). O markup vem estático do
 * porte (etapa 7s): cada `.carr-dots` nasce logo após o seu slider, então o pareamento
 * é `previousElementSibling`. Aqui só entra o comportamento: marcar a bolinha do card
 * mais centrado durante o scroll (rAF, 1 leitura por quadro) e rolar até o card no
 * toque da bolinha. Sem JS as bolinhas ficam paradas na primeira, e o slider continua
 * funcionando: é reforço de affordance, não mecanismo.
 */
export default function CarrosselDots() {
  useEffect(() => {
    const desligar: Array<() => void> = [];
    const suave = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? ("auto" as const)
      : ("smooth" as const);

    document.querySelectorAll<HTMLElement>(".carr-dots").forEach((dots) => {
      const carr = dots.previousElementSibling as HTMLElement | null;
      if (!carr) return;
      const botoes = [...dots.querySelectorAll("button")];
      const cards = [...carr.children] as HTMLElement[];

      const marcar = (i: number) =>
        botoes.forEach((b, j) =>
          j === i ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current"),
        );

      let raf = 0;
      const aoRolar = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const centro = carr.scrollLeft + carr.clientWidth / 2;
          let ativo = 0;
          let menor = Infinity;
          cards.forEach((c, i) => {
            const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centro);
            if (d < menor) {
              menor = d;
              ativo = i;
            }
          });
          marcar(ativo);
        });
      };

      carr.addEventListener("scroll", aoRolar, { passive: true });
      botoes.forEach((b, i) =>
        b.addEventListener("click", () =>
          cards[i]?.scrollIntoView({ behavior: suave, block: "nearest", inline: "center" }),
        ),
      );
      desligar.push(() => {
        carr.removeEventListener("scroll", aoRolar);
        if (raf) cancelAnimationFrame(raf);
      });
    });

    return () => desligar.forEach((fn) => fn());
  }, []);

  return null;
}

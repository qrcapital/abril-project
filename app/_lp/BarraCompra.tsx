"use client";

import { useEffect } from "react";

/**
 * Liga a barra de compra do celular (`.barra-compra`, no `body.html`) entre o hero e a oferta.
 *
 * A barra só faz sentido onde o botão de inscrição não está à vista: some no hero, que tem o
 * próprio botão, some quando o card de preço entra na tela e some no rodapé. Quem decide se ela
 * existe é o CSS (só abaixo de 760px); aqui só entra a classe `barra-on` no <html>. Sem JS a barra
 * fica escondida, o que é melhor que uma barra presa por cima do conteúdo.
 */
export default function BarraCompra() {
  useEffect(() => {
    const alvos = ["#hero", "#oferta", "footer"]
      .map((s) => document.querySelector(s))
      .filter((e): e is Element => e !== null);
    if (alvos.length === 0 || !("IntersectionObserver" in window)) return;

    const visiveis = new Set<Element>();
    const html = document.documentElement;
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => (e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target)));
        html.classList.toggle("barra-on", visiveis.size === 0);
      },
      { threshold: 0 },
    );
    alvos.forEach((a) => io.observe(a));
    return () => {
      io.disconnect();
      html.classList.remove("barra-on");
    };
  }, []);
  return null;
}

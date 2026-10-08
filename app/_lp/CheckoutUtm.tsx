"use client";

import { useEffect } from "react";

/**
 * Leva a origem da visita para o checkout do Guru (08/out/2026).
 *
 * Quem chega pela matéria da VEJA, pelo e-mail do RD ou pelo anúncio traz `utm_*` na URL. Sem isto,
 * o clique em "Garantir minha vaga" abria o checkout limpo, e o relatório de vendas do Guru não
 * sabia de onde cada venda veio. Aqui os parâmetros de campanha da página entram no link de cada
 * botão `[data-checkout]`, sem sobrescrever o que o próprio link já trouxer.
 *
 * Só uma lista fechada de chaves passa: nada de repassar a query inteira para um terceiro.
 * Botão que ainda aponta para `#oferta` (checkout não configurado) fica como está.
 */
const CHAVES = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck", "gclid", "fbclid"];

export default function CheckoutUtm() {
  useEffect(() => {
    const daPagina = new URLSearchParams(window.location.search);
    const levar = CHAVES.filter((k) => daPagina.get(k));
    if (levar.length === 0) return;
    document.querySelectorAll<HTMLAnchorElement>("a[data-checkout]").forEach((a) => {
      const href = a.getAttribute("href") ?? "";
      if (!/^https:\/\//i.test(href)) return;
      try {
        const url = new URL(href);
        for (const k of levar) if (!url.searchParams.has(k)) url.searchParams.set(k, daPagina.get(k)!.slice(0, 200));
        a.setAttribute("href", url.toString());
      } catch {
        /* link malformado: deixa como veio */
      }
    });
  }, []);
  return null;
}

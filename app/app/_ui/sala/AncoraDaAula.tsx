"use client";

import { useEffect } from "react";

import { ancoraDaAula } from "@/lib/notebook";

/**
 * Posiciona a página do módulo quando a aula do teatro muda. Não desenha nada.
 *
 * O link da playlist é `?aula=<n>#aula-<n>`, e o pedido do dono (30/set/2026) é que ele faça duas
 * coisas: trocar o vídeo e levar o notebook à seção daquela aula. A âncora sozinha só consegue uma
 * delas, porque o navegador rola a JANELA até a seção e o vídeo sai da tela. Por isso três passos:
 *
 * 1. rola a CAIXA do notebook (`data-nb-rolagem`, que rola sozinha no desktop) até a seção;
 * 2. se a URL chegou com a âncora desta aula, devolve a janela ao topo, onde está o teatro;
 * 3. traz o cartão da aula para dentro da fila da playlist, que rola de lado.
 *
 * Sem JS nada disso roda, e o link continua certo: o navegador segue a âncora até a seção.
 *
 * Roda só quando a aula muda. O `router.refresh()` do botão de concluir não troca a aula, então
 * marcar uma aula não rola a página de ninguém.
 */
export default function AncoraDaAula({ pos }: { pos: number }) {
  useEffect(() => {
    const alvo = document.getElementById(ancoraDaAula(pos));
    const caixa = document.querySelector<HTMLElement>("[data-nb-rolagem]");
    // Só mexe na caixa quando ela rola de fato. No celular ela é página corrida, e aí mover a
    // janela até a seção seria justamente esconder o vídeo.
    if (alvo && caixa && caixa.scrollHeight > caixa.clientHeight + 1) {
      caixa.scrollTop += alvo.getBoundingClientRect().top - caixa.getBoundingClientRect().top;
    }

    if (window.location.hash === `#${ancoraDaAula(pos)}`) window.scrollTo({ top: 0 });

    const fila = document.querySelector<HTMLElement>(".sl-pl-fila");
    const cartao = fila?.querySelector<HTMLElement>('[aria-current="true"]');
    if (fila && cartao) {
      const f = fila.getBoundingClientRect();
      const c = cartao.getBoundingClientRect();
      if (c.left < f.left || c.right > f.right) fila.scrollLeft += c.left - f.left - 24;
    }
  }, [pos]);

  return null;
}

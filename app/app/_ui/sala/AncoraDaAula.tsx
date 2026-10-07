"use client";

import { useEffect } from "react";

import { ancoraDaAula } from "@/lib/notebook";

/**
 * Posiciona a página do módulo quando a aula do teatro muda. Não desenha nada.
 *
 * O link da playlist é `?aula=<n>#aula-<n>`. Sem JS, o navegador segue a âncora e cai na seção da
 * aula no notebook, que é o comportamento honesto do link. Com JS, a troca de aula mantém o aluno no
 * teatro, onde o vídeo novo acabou de entrar:
 *
 * 1. se a URL chegou com a âncora desta aula, devolve a janela ao topo, onde está o teatro;
 * 2. traz o cartão da aula para dentro da fila da playlist, que rola de lado.
 *
 * ATÉ 07/out/2026 HAVIA UM PASSO ANTES: no desktop o notebook rolava dentro de uma caixa própria
 * (`data-nb-rolagem`), e este componente levava a caixa até a seção da aula sem mexer na janela. O
 * dono pediu uma barra de rolagem só, a da página, e a caixa saiu. Rolar a janela até a seção
 * esconderia o vídeo, então a seção não é mais posicionada: o índice "Neste notebook", fixo ao lado
 * do texto no desktop, marca a aula do teatro (`aria-current`, vindo do servidor) e leva até ela.
 *
 * Roda só quando a aula muda. O `router.refresh()` do botão de concluir não troca a aula, então
 * marcar uma aula não rola a página de ninguém.
 */
export default function AncoraDaAula({ pos }: { pos: number }) {
  useEffect(() => {
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

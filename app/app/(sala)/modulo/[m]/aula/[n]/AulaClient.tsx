"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { alternarConcluida } from "@/lib/progresso";
import { estadoConcluir } from "@/lib/aula-template";

/**
 * Página de aula (design portado, conteúdo de lib/curso). Delegação de evento no
 * container (sobrevive a router.refresh):
 * - Anterior/Próxima (data-nav) e aulas da sidebar (data-href) navegam;
 * - "Concluir aula" (data-concluir) marca/desmarca no cookie e atualiza a tela
 *   (sidebar, %, gate da prova) via router.refresh().
 */
export default function AulaClient({ html, userId }: { html: string; userId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const onClick = (e: Event) => {
      const target = e.target as Element;

      const concluir = target.closest<HTMLElement>("[data-concluir]");
      if (concluir) {
        const marcada = alternarConcluida(userId, Number(concluir.getAttribute("data-concluir")));
        // Marcação otimista: o cookie muda na hora, mas a tela (sidebar, %, gate da prova)
        // só acompanha depois do `router.refresh`, que é uma ida ao servidor. Sem repintar
        // aqui, o botão fica idêntico por um instante e o clique parece não ter pego. O
        // refresh chega depois com o mesmo estado, então não há troca visível.
        const e = estadoConcluir(marcada);
        concluir.setAttribute("style", e.style);
        concluir.textContent = e.rotulo;
        router.refresh();
        return;
      }

      const nav = target.closest<HTMLElement>("[data-nav],[data-href]");
      if (nav) {
        const to = nav.getAttribute("data-nav") ?? nav.getAttribute("data-href");
        if (to) router.push(to);
      }
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [router, userId]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

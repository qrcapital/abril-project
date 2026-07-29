"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { estadoConcluir } from "@/lib/aula-template";
import { marcarAula } from "./actions";

/**
 * Página de aula (design portado, conteúdo de lib/curso). Delegação de evento no
 * container (sobrevive a router.refresh):
 * - Anterior/Próxima (data-nav) e aulas da sidebar (data-href) navegam;
 * - "Concluir aula" (data-concluir) grava no banco e atualiza a tela (sidebar, %, gate da
 *   prova) via router.refresh().
 *
 * O progresso saiu do cookie em 29/jul: quem marca a aula agora é uma server action, com a
 * escrita amarrada ao próprio aluno pela RLS. O clique continua repintando na hora, porque a
 * ida ao servidor leva tempo e botão que não reage parece botão quebrado.
 */
export default function AulaClient({
  html,
  concluidas,
}: {
  html: string;
  /** Aulas concluídas, vindas do servidor. */
  concluidas: number[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const feitas = new Set(concluidas);

    const onClick = (e: Event) => {
      const target = e.target as Element;

      const concluir = target.closest<HTMLButtonElement>("[data-concluir]");
      if (concluir) {
        if (concluir.disabled) return;
        const n = Number(concluir.getAttribute("data-concluir"));
        const marcada = !feitas.has(n);

        // Marcação otimista: repinta antes da ida ao servidor. O refresh chega depois com o
        // mesmo estado, então não há troca visível; se a gravação falhar, desfaz.
        const antes = estadoConcluir(!marcada);
        const depois = estadoConcluir(marcada);
        concluir.setAttribute("style", depois.style);
        concluir.textContent = depois.rotulo;
        concluir.disabled = true;

        marcarAula(n, marcada)
          .then((r) => {
            if (r.ok) {
              if (marcada) feitas.add(n);
              else feitas.delete(n);
              router.refresh();
              return;
            }
            // Desfaz: deixar a tela dizendo "concluída" quando o banco não gravou seria pior
            // que não ter repintado, porque o aluno confiaria num progresso que não existe.
            concluir.setAttribute("style", antes.style);
            concluir.textContent = antes.rotulo;
            console.error("[aula] falha ao marcar:", r.erro);
          })
          .finally(() => {
            concluir.disabled = false;
          });
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
  }, [router, concluidas]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

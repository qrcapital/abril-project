"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { emTrabalho } from "@/app/app/_ui/feedback";

import contato from "@/lib/contato.json";
import Html from "@/app/app/_ui/Html";

const WHATSAPP = contato.whatsapp;

/**
 * Qual item do topo é a página atual (07/out/2026, com a entrada do Glossário). O Início vale para a
 * home e para as páginas de módulo, que são o caminho do curso; a conta e o certificado não acendem
 * nenhum.
 */
function itemAtual(caminho: string): string | null {
  if (caminho.startsWith("/app/glossario")) return "glossario";
  if (caminho === "/app" || caminho.startsWith("/app/modulo")) return "inicio";
  return null;
}

/**
 * Chrome das telas autenticadas da área (topbar + footer, design portado).
 * Delegação de evento no container (que persiste) — sobrevive a router.refresh
 * (ex.: ao marcar aula concluída), que re-injeta o HTML e apagaria listeners presos
 * nos elementos. "Início"/wordmark (data-home) → /app; FAQ → LP; Suporte → WhatsApp;
 * menu de conta abre/fecha; "Voltar ao topo" rola a página. Links com href real
 * (rodapé) navegam nativamente.
 */
export default function AreaChrome({
  top,
  foot,
  children,
}: {
  top: string;
  foot: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const caminho = usePathname();

  // O item ativo vai no próprio HTML do topo, antes de injetar: sai certo já na primeira pintura (o
  // `usePathname` também responde no servidor) e não depende de mexer no DOM depois.
  const topo = useMemo(() => {
    const atual = itemAtual(caminho ?? "");
    if (!atual) return top;
    return top.replace(
      new RegExp(`(<nav class="topbar-nav"[\\s\\S]*?)data-nav="${atual}"`),
      `$1data-nav="${atual}" aria-current="page"`,
    );
  }, [top, caminho]);

  // O nome, o e-mail e o prazo de acesso do aluno NÃO são preenchidos aqui: saem prontos do
  // servidor, pelo `preencherUsuario` do layout e de cada tela (tarefa 5, 29/jul/2026).
  // Enquanto viviam neste componente, o HTML entregue trazia "Pedro" e todo aluno lia o nome
  // de outra pessoa na primeira pintura. De quebra, sumiu uma chamada de sessão por
  // navegação. Este componente cuida só do que depende de interação.

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const menu = () => root.querySelector<HTMLElement>("#account-menu");

    const onClick = (e: Event) => {
      const t = e.target as Element;

      if (t.closest("[data-account-toggle]")) {
        e.stopPropagation();
        const m = menu();
        if (m) m.hidden = !m.hidden;
        return;
      }
      if (t.closest("[data-home]")) {
        e.preventDefault();
        return router.push("/app");
      }
      if (t.closest("[data-scrolltop]")) {
        e.preventDefault();
        return (document.scrollingElement || document.documentElement).scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      const a = t.closest("a");
      if (!a) return;
      const txt = (a.textContent || "").trim();

      if (a.closest("#account-menu")) {
        e.preventDefault();
        // Item com endereço real (o Glossário, que só aparece aqui no celular).
        const ir = a.getAttribute("href");
        if (ir?.startsWith("/app/")) {
          const m = menu();
          if (m) m.hidden = true;
          return router.push(ir);
        }
        if (/Sair/i.test(txt)) {
          // `signOut` é ida à rede: sem sinal, o menu fica aberto e parado, e o aluno clica
          // de novo. O rótulo vira "Saindo..." e o link para de aceitar clique; nada é
          // restaurado, porque a navegação já vai tirar a tela do caminho.
          if (a.getAttribute("aria-busy") === "true") return;
          emTrabalho(a, "Saindo...");
          createClient()
            .auth.signOut()
            .finally(() => {
              router.push("/app/login");
              router.refresh();
            });
        } else {
          router.push("/app/conta");
        }
        return;
      }
      if (a.closest("nav")) {
        if (/^In[ií]cio$/i.test(txt)) {
          e.preventDefault();
          return router.push("/app");
        }
        if (/FAQ/i.test(txt)) {
          e.preventDefault();
          // /curso e não a raiz: desde 13/out a raiz do domínio é a pré-lista, que não tem FAQ.
          return router.push("/curso#faq");
        }
        if (/Suporte|WhatsApp/i.test(txt)) {
          e.preventDefault();
          window.open(WHATSAPP, "_blank", "noopener");
          return;
        }
        // Link interno com endereço real (`href` começando por /app/): navegação do cliente,
        // sem recarregar a página. Clique com modificador (nova aba) segue nativo.
        const destino = a.getAttribute("href");
        const me = e as MouseEvent;
        if (destino?.startsWith("/app/") && !me.metaKey && !me.ctrlKey && !me.shiftKey && !me.altKey) {
          e.preventDefault();
          return router.push(destino);
        }
      }
      // demais links (rodapé com href real) navegam nativamente
    };

    const closeOutside = (e: Event) => {
      const m = menu();
      if (m && !m.hidden && !(e.target as Element).closest("[data-account-toggle],#account-menu"))
        m.hidden = true;
    };

    root.addEventListener("click", onClick);
    document.addEventListener("click", closeOutside);
    return () => {
      root.removeEventListener("click", onClick);
      document.removeEventListener("click", closeOutside);
    };
  }, [router]);

  return (
    <div ref={ref}>
      {/* `display: contents` (08/out/2026): sem ele, o `position: sticky` do topo (chrome-top.html)
          ficava preso a este invólucro, da altura da própria barra, e a barra rolava junto com a
          página. Sem caixa própria, o topo gruda no alto da janela como o DESIGN.md pede, e o
          vídeo fixo da sala e o índice do notebook se alinham logo abaixo dele (`--sl-topo`). */}
      <Html style={{ display: "contents" }} html={topo} />
      {children}
      <Html html={foot} />
    </div>
  );
}

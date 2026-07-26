"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import contato from "@/lib/contato.json";

const WHATSAPP = contato.whatsapp;

/**
 * Preenche os marcadores de nome (`[data-u]`) das telas com o nome do aluno logado
 * (`user_metadata.nome`, mesma chave que o webhook do Guru grava). Sem nome, mantém
 * o texto do design. `full` = nome completo; `first` = primeiro nome; `initial` = inicial.
 */
function aplicarNome(root: HTMLElement, nome?: string | null) {
  const full = (nome || "").trim();
  if (!full) return;
  const first = full.split(/\s+/)[0];
  const initial = (first[0] || "").toUpperCase();
  root.querySelectorAll<HTMLElement>("[data-u]").forEach((el) => {
    const k = el.getAttribute("data-u");
    el.textContent = k === "full" ? full : k === "initial" ? initial : first;
  });
}

// Anos de acesso a partir da compra — espelha ACCESS_YEARS do webhook do Guru.
const ANOS_ACESSO = 1;

/**
 * Preenche a data de fim de acesso em "Minha conta" (`[data-acesso]`). Em produção
 * a fonte de verdade é `enrollments.expires_at` (compra + 1 ano); em homolog não há
 * matrícula, então usamos a data de criação da conta como proxy da data de compra.
 */
function aplicarAcesso(root: HTMLElement, criadoEm?: string) {
  const el = root.querySelector<HTMLElement>("[data-acesso]");
  if (!el || !criadoEm) return;
  const d = new Date(criadoEm);
  if (isNaN(d.getTime())) return;
  d.setFullYear(d.getFullYear() + ANOS_ACESSO);
  el.textContent = d.toLocaleDateString("pt-BR");
}

/** Preenche o e-mail da conta em "Minha conta" (`[data-email]`). */
function aplicarEmail(root: HTMLElement, email?: string) {
  if (!email) return;
  const el = root.querySelector<HTMLElement>("[data-email]");
  if (el) el.textContent = email;
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
  const pathname = usePathname();

  // Injeta o nome do aluno nas telas (topbar + tela + rodapé). Re-roda a cada
  // navegação client, pois o AreaChrome não remonta ao trocar de tela.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cancel = false;
    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (cancel) return;
        const user = data.session?.user;
        aplicarNome(root, user?.user_metadata?.nome as string | undefined);
        aplicarAcesso(root, user?.created_at);
        aplicarEmail(root, user?.email);
      });
    return () => {
      cancel = true;
    };
  }, [pathname]);

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
        if (/Sair/i.test(txt)) {
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
          return router.push("/#faq");
        }
        if (/Suporte|WhatsApp/i.test(txt)) {
          e.preventDefault();
          window.open(WHATSAPP, "_blank", "noopener");
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
      <div dangerouslySetInnerHTML={{ __html: top }} />
      {children}
      <div dangerouslySetInnerHTML={{ __html: foot }} />
    </div>
  );
}

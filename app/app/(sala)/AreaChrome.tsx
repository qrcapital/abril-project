"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const WHATSAPP = "https://wa.me/message/W2USYZZK75FMC1";

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

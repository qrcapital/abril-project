"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import contato from "@/lib/contato.json";
import { emTrabalho } from "@/app/app/_ui/feedback";

const WHATSAPP = contato.whatsapp;

/**
 * Tela de acesso bloqueado. O botão principal abre o suporte, que é a única ação que resolve
 * qualquer um dos três estados; o rodapé oferece trocar de conta, que é o caso de quem entrou
 * com o e-mail errado.
 *
 * "Trocar de conta" faz `signOut` antes de ir para o login: sem isso a sessão antiga continua
 * viva, a guarda do `(sala)` empurra de volta para cá, e a pessoa fica presa num laço achando
 * que o link está quebrado.
 */
export default function AcessoClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ac = new AbortController();
    const opts = { signal: ac.signal };

    const btn = root.querySelector("button");
    btn?.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        window.open(WHATSAPP, "_blank", "noopener");
      },
      opts,
    );

    root.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
      if (!/Trocar de conta/i.test(a.textContent || "")) return;
      a.addEventListener(
        "click",
        (ev) => {
          ev.preventDefault();
          if (a.getAttribute("aria-busy") === "true") return;
          emTrabalho(a, "Saindo...");
          createClient()
            .auth.signOut()
            .finally(() => {
              router.push("/app/login");
              router.refresh();
            });
        },
        opts,
      );
    });

    return () => ac.abort();
  }, [router]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

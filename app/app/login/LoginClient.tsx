"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const WHATSAPP = "https://wa.me/message/W2USYZZK75FMC1";

/**
 * Tela de login (design portado). Interatividade mínima para o homolog:
 * - "Entrar" (e submit) navega para a home da área (/app). Auth real do Supabase
 *   entra depois — hoje é só a demonstração do fluxo.
 * - "Fale no WhatsApp" aponta para o canal de suporte.
 * - "Esqueci minha senha" fica como placeholder até /app/recuperar-senha existir.
 */
export default function LoginClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const go = (e: Event) => {
      e.preventDefault();
      router.push("/app");
    };

    const btn = root.querySelector("button");
    btn?.addEventListener("click", go);

    const form = root.querySelector("form");
    form?.addEventListener("submit", go);

    root.querySelectorAll<HTMLAnchorElement>('a[href="#"]').forEach((a) => {
      if (/WhatsApp/i.test(a.textContent || "")) {
        a.href = WHATSAPP;
        a.target = "_blank";
        a.rel = "noopener";
      }
    });

    return () => {
      btn?.removeEventListener("click", go);
      form?.removeEventListener("submit", go);
    };
  }, [router]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

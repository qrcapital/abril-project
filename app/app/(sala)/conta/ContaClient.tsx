"use client";

import { useEffect, useRef } from "react";

const WHATSAPP = "https://wa.me/message/W2USYZZK75FMC1";

/**
 * Minha conta (design portado). "Falar no WhatsApp" → canal de suporte.
 * "Trocar senha" fica pendente até o fluxo real (Supabase).
 */
export default function ContaClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
      if (/WhatsApp/i.test(a.textContent || "")) {
        a.href = WHATSAPP;
        a.target = "_blank";
        a.rel = "noopener";
      }
    });
  }, []);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

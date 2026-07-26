"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import contato from "@/lib/contato.json";

const WHATSAPP = contato.whatsapp;

/**
 * Resultado da prova (design portado). Serve as duas variantes:
 * - APROVADO: "Emitir certificado" → /app/certificado;
 * - REPROVADO: "Solicitar 2ª chamada no WhatsApp" → canal de suporte.
 * "Voltar para a home" → /app em ambas.
 */
export default function ResultadoClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.querySelectorAll("button").forEach((b) => {
      if (/certificado/i.test(b.textContent || ""))
        b.addEventListener("click", () => router.push("/app/certificado"));
    });
    root.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
      const t = a.textContent || "";
      if (/Voltar para a home/i.test(t))
        a.addEventListener("click", (e) => {
          e.preventDefault();
          router.push("/app");
        });
      else if (/chamada|whatsapp/i.test(t)) {
        a.href = WHATSAPP;
        a.target = "_blank";
        a.rel = "noopener";
      }
    });
  }, [router]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

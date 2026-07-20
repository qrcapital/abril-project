"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Certificado (design portado). NPS 0–10 selecionável; "Voltar para a home" → /app.
 * "Baixar PDF", "Compartilhar no LinkedIn" e o link de validação ficam pendentes
 * (PDF real, rota pública /verificar e share entram depois).
 */
export default function CertificadoClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const nps = [...root.querySelectorAll<HTMLElement>("[data-nps]")];
    const SEL = ";background:#A98E4E;color:#fff;border-color:#A98E4E";
    const base = nps.map((b) => b.getAttribute("style") || "");
    nps.forEach((b, i) =>
      b.addEventListener("click", () => {
        nps.forEach((x, j) => x.setAttribute("style", base[j]));
        b.setAttribute("style", base[i] + SEL);
      })
    );

    root.querySelectorAll("a").forEach((a) => {
      if (/Voltar para a home/i.test(a.textContent || ""))
        a.addEventListener("click", (e) => {
          e.preventDefault();
          router.push("/app");
        });
    });
  }, [router]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

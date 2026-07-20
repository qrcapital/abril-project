"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Página de aula (design portado). O conteúdo é o mockup do design (Módulo II ·
 * Aula 7) — os dados reais por aula entram com o Supabase. Interatividade de
 * homolog: os botões "← Aula N" / "Próxima aula →" navegam entre as aulas.
 * Os acordeões da sidebar são <details> nativos. Materiais ficam pendentes até
 * os arquivos reais existirem.
 */
export default function AulaClient({
  html,
  m,
  n,
}: {
  html: string;
  m: number;
  n: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.querySelectorAll("button").forEach((b) => {
      const t = (b.textContent || "").trim();
      if (t.startsWith("←")) {
        b.addEventListener("click", () =>
          router.push(`/app/modulo/${m}/aula/${Math.max(1, n - 1)}`)
        );
      } else if (/Próxima|→/.test(t)) {
        b.addEventListener("click", () =>
          router.push(`/app/modulo/${m}/aula/${n + 1}`)
        );
      }
    });
  }, [router, m, n]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

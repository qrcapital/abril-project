"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Home da área (vitrine). Design portado. Interatividade de homolog: o CTA
 * "Continuar", "Ver a formação" e os cards de módulo levam à página de aula.
 * A rota de aula (P3) ainda não existe — próxima tela a construir.
 */
export default function HomeClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const goAula = (e: Event) => {
      e.preventDefault();
      router.push("/app/modulo/2/aula/7");
    };

    root.querySelectorAll("button").forEach((b) => b.addEventListener("click", goAula));
    root.querySelectorAll<HTMLElement>(".mcard").forEach((c) => {
      c.style.cursor = "pointer";
      c.addEventListener("click", goAula);
    });
  }, [router]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

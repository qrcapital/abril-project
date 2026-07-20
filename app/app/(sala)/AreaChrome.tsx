"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const WHATSAPP = "https://wa.me/message/W2USYZZK75FMC1";

/**
 * Chrome das telas autenticadas da área (topbar + footer, design portado).
 * Envolve as telas do route group (sala). O login fica fora, sem chrome.
 * Interatividade de homolog: "Início"/wordmark → /app, FAQ → LP, Suporte → WhatsApp.
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

    const goHome = (e: Event) => {
      e.preventDefault();
      router.push("/app");
    };

    // wordmark → Início
    const wordmark = root.querySelector("b")?.closest("div") as HTMLElement | null;
    if (wordmark) {
      wordmark.style.cursor = "pointer";
      wordmark.addEventListener("click", goHome);
    }

    root.querySelectorAll<HTMLAnchorElement>("nav a").forEach((a) => {
      const t = (a.textContent || "").trim();
      if (t === "Início") {
        a.href = "/app";
        a.addEventListener("click", goHome);
      } else if (/FAQ/i.test(t)) {
        a.href = "/#faq";
      } else if (/Suporte|WhatsApp/i.test(t)) {
        a.href = WHATSAPP;
        a.target = "_blank";
        a.rel = "noopener";
      }
    });
  }, [router]);

  return (
    <div ref={ref}>
      <div dangerouslySetInnerHTML={{ __html: top }} />
      {children}
      <div dangerouslySetInnerHTML={{ __html: foot }} />
    </div>
  );
}

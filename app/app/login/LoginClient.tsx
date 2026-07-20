"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const WHATSAPP = "https://wa.me/message/W2USYZZK75FMC1";

const TEST_STATES: { label: string; s?: string }[] = [
  { label: "Normal" },
  { label: "Senha errada", s: "erro" },
  { label: "Pagamento processando", s: "pendente" },
  { label: "1º acesso", s: "primeiro" },
];

/**
 * Tela de login (design portado) com seus estados: normal, senha errada,
 * pagamento em processamento e primeiro acesso. Interatividade de homolog:
 * - o botão principal (Entrar / Definir senha) navega para /app;
 * - "Fale no WhatsApp" aponta para o suporte;
 * - a barra fixa de baixo (só homolog) pula direto para cada estado.
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
    root.querySelector("form")?.addEventListener("submit", go);

    root.querySelectorAll<HTMLAnchorElement>('a[href="#"]').forEach((a) => {
      if (/WhatsApp/i.test(a.textContent || "")) {
        a.href = WHATSAPP;
        a.target = "_blank";
        a.rel = "noopener";
      }
    });
  }, [router]);

  return (
    <>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      {/* Barra de atalhos só de homolog: pular para cada estado do login. */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: 16,
          transform: "translateX(-50%)",
          zIndex: 200,
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
          background: "rgba(8,31,22,.92)",
          border: "1px solid rgba(217,190,133,.3)",
          borderRadius: 10,
          padding: "8px 12px",
          backdropFilter: "blur(6px)",
        }}
      >
        <span
          style={{
            fontSize: 9,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#8FA398",
            fontWeight: 700,
          }}
        >
          Teste (homolog)
        </span>
        {TEST_STATES.map((t) => (
          <button
            key={t.label}
            onClick={() =>
              router.push(t.s ? `/app/login?s=${t.s}` : "/app/login")
            }
            style={{
              border: "1px solid rgba(217,190,133,.4)",
              color: "#EDE6DD",
              background: "transparent",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </>
  );
}

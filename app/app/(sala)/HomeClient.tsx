"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { primeiraAulaDoModulo, aulaAtual, href, provaLiberada, aulasRestantes } from "@/lib/curso";
import { lerConcluidas } from "@/lib/progresso";

/**
 * Home da área (vitrine). Navegação de lib/curso; progresso do cookie (lib/progresso):
 * - cards de módulo → primeira aula do módulo;
 * - card da Prova Final → /app/prova SE liberada (16/16); senão abre um aviso;
 * - "Continuar" → aula atual.
 * Delegação de evento (sobrevive à re-render ao abrir/fechar o modal).
 */
export default function HomeClient({ html, userId }: { html: string; userId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [restantes, setRestantes] = useState<number | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const onClick = (e: Event) => {
      const target = e.target as Element;
      const card = target.closest<HTMLElement>(".mcard");
      if (card) {
        const i = [...root.querySelectorAll<HTMLElement>(".mcard")].indexOf(card);
        if (i >= 0 && i < 5) return router.push(href(primeiraAulaDoModulo(i)));
        if (/Prova|Certifica/i.test(card.textContent || "")) {
          const c = lerConcluidas(userId);
          if (provaLiberada(c)) router.push("/app/prova");
          else setRestantes(aulasRestantes(c));
        }
        return;
      }
      const btn = target.closest("button");
      if (btn) {
        const t = btn.textContent || "";
        if (/Continuar/i.test(t)) return router.push(href(aulaAtual(lerConcluidas(userId))));
      }
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [router, userId]);

  useEffect(() => {
    if (restantes === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setRestantes(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [restantes]);

  return (
    <>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />

      {restantes !== null && (
        <div
          onClick={() => setRestantes(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(8,31,22,.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              borderTop: "3px solid #A98E4E",
              maxWidth: 420,
              width: "100%",
              padding: "34px 32px 28px",
              textAlign: "center",
              boxShadow: "0 30px 70px rgba(0,0,0,.35)",
              fontFamily: "'Montserrat',system-ui,sans-serif",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                margin: "0 auto 18px",
                borderRadius: "50%",
                background: "rgba(169,142,78,.12)",
                border: "1px solid rgba(169,142,78,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A98E4E" strokeWidth="1.6">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 21,
                fontWeight: 600,
                color: "#0B2D20",
                margin: "0 0 8px",
              }}
            >
              Prova Final ainda bloqueada
            </h3>
            <p style={{ fontSize: 13.5, color: "#565049", lineHeight: 1.6, margin: "0 0 22px" }}>
              Conclua as 16 aulas da formação para liberar a Prova Final.{" "}
              {restantes > 0 && (
                <>
                  Falta{restantes > 1 ? "m" : ""}{" "}
                  <b style={{ color: "#7E6836" }}>
                    {restantes} aula{restantes > 1 ? "s" : ""}
                  </b>
                  .
                </>
              )}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => router.push(href(aulaAtual(lerConcluidas(userId))))}
                style={{
                  border: "none",
                  borderRadius: 8,
                  padding: "13px",
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: ".04em",
                  cursor: "pointer",
                  background: "linear-gradient(160deg,#D9BE85,#A98E4E)",
                  color: "#0A2B1E",
                  boxShadow: "0 6px 16px rgba(169,142,78,.26)",
                }}
              >
                Continuar de onde parei
              </button>
              <button
                onClick={() => setRestantes(null)}
                style={{
                  border: "1px solid #E4DACC",
                  borderRadius: 8,
                  padding: "12px",
                  fontFamily: "'Montserrat',sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  background: "#fff",
                  color: "#565049",
                }}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

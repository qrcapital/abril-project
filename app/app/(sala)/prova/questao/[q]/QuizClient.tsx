"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { enviarProva, responder } from "../../actions";
import { formatarTempo } from "@/lib/prova-correcao";

// Estilos de alternativa selecionada/não. Os mesmos do `lib/prova-template.ts`, que
// pinta o estado inicial no servidor; aqui só repintamos no clique.
const ALT_BASE =
  "display:flex;align-items:center;gap:14px;padding:15px 18px;border-radius:10px;cursor:pointer;margin-bottom:10px;transition:all .14s ease";
const ALT_OFF = `${ALT_BASE};border:1.5px solid #E4DACC;background:#fff`;
const ALT_ON = `${ALT_BASE};border:1.5px solid #A98E4E;background:#FBF6EC`;
const BOLA_BASE =
  "width:26px;height:26px;flex:0 0 auto;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700";
const BOLA_OFF = `${BOLA_BASE};border:1.5px solid #C9BCA8;color:#7E6836`;
const BOLA_ON = `${BOLA_BASE};border:1.5px solid #A98E4E;background:#A98E4E;color:#fff`;

/**
 * Prova — uma questão. O servidor já entrega a tela pintada (enunciado, alternativas,
 * resposta anterior, contadores, cronômetro), então aqui fica só o comportamento:
 *
 * - clique numa alternativa: repinta na hora e grava pela server action. Se a gravação
 *   falhar, desfaz a pintura, porque uma resposta que parece salva e não está é pior
 *   que uma que visivelmente não entrou;
 * - cronômetro regressivo a partir do `deadline` do banco, não de storage local: fechar
 *   a aba, trocar de navegador ou dar refresh não devolve tempo;
 * - zerado o tempo, envia sozinho, e o servidor corrige o que houver respondido;
 * - "Enviar prova" na última questão, com confirmação, porque a tentativa é única.
 */
export default function QuizClient({
  html,
  posicao,
  total,
  restanteMs,
}: {
  html: string;
  posicao: number;
  total: number;
  restanteMs: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const enviandoRef = useRef(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ac = new AbortController();
    const on = (el: Element, ev: string, fn: (e: Event) => void) =>
      el.addEventListener(ev, fn, { signal: ac.signal });

    const spans = [...root.querySelectorAll<HTMLElement>("span")];
    const timerEl = spans.find((s) => /^\d+:\d{2}$/.test((s.textContent || "").trim()));
    const respEl = spans.find((s) => /respondidas$/.test((s.textContent || "").trim()));
    const alts = [...root.querySelectorAll<HTMLElement>("[data-alt]")];

    const pintar = (escolhida: string | null) => {
      alts.forEach((a) => {
        const sel = a.dataset.alt === escolhida;
        const bola = a.firstElementChild as HTMLElement | null;
        a.setAttribute("style", sel ? ALT_ON : ALT_OFF);
        bola?.setAttribute("style", sel ? BOLA_ON : BOLA_OFF);
      });
    };

    const atual = () => alts.find((a) => a.getAttribute("style") === ALT_ON)?.dataset.alt ?? null;

    alts.forEach((a) =>
      on(a, "click", async () => {
        const letra = a.dataset.alt;
        if (!letra) return;
        const anterior = atual();
        if (letra === anterior) return;

        const eraPrimeira = anterior === null;
        pintar(letra);
        if (eraPrimeira && respEl) {
          const n = Number((respEl.textContent || "").match(/\d+/)?.[0] ?? 0);
          respEl.textContent = `${n + 1} respondidas`;
        }

        const r = await responder(posicao, letra);
        if (!r.ok) {
          pintar(anterior);
          if (eraPrimeira && respEl) {
            const n = Number((respEl.textContent || "").match(/\d+/)?.[0] ?? 1);
            respEl.textContent = `${Math.max(0, n - 1)} respondidas`;
          }
          setErro(r.erro);
        } else {
          setErro(null);
        }
      }),
    );

    const enviar = async (automatico: boolean) => {
      if (enviandoRef.current) return;
      if (!automatico && !window.confirm(
        "Enviar a prova agora? A tentativa é única e não dá para voltar depois do envio.",
      ))
        return;
      enviandoRef.current = true;
      const r = await enviarProva();
      if (r.ok) router.push("/app/prova/resultado");
      else {
        enviandoRef.current = false;
        setErro(r.erro);
      }
    };

    const buttons = [...root.querySelectorAll("button")];
    const prev = buttons.find((b) => (b.textContent || "").trim().startsWith("←"));
    const next = buttons.find((b) => /Próxima|→|Enviar prova/.test(b.textContent || ""));

    if (prev) {
      if (posicao <= 1) {
        prev.disabled = true;
        prev.style.opacity = "0.4";
        prev.style.cursor = "not-allowed";
      }
      on(prev, "click", () => {
        if (posicao > 1) router.push(`/app/prova/questao/${posicao - 1}`);
      });
    }
    if (next) {
      on(next, "click", () => {
        if (posicao < total) router.push(`/app/prova/questao/${posicao + 1}`);
        else void enviar(false);
      });
    }

    // Cronômetro: conta a partir do instante em que a página foi servida, sempre
    // ancorado no deadline do banco.
    const fim = Date.now() + restanteMs;
    const tick = () => {
      const rem = Math.max(0, fim - Date.now());
      if (timerEl) timerEl.textContent = formatarTempo(rem);
      if (rem <= 0) {
        clearInterval(iv);
        void enviar(true);
      }
    };
    tick();
    const iv = setInterval(tick, 1000);

    return () => {
      clearInterval(iv);
      ac.abort();
    };
  }, [router, posicao, total, restanteMs]);

  return (
    <>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      {erro && (
        <p
          role="alert"
          style={{
            maxWidth: 820,
            margin: "0 auto 40px",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid rgba(176,65,62,.35)",
            background: "rgba(176,65,62,.06)",
            color: "#b0413e",
            fontFamily: "'Montserrat',system-ui,sans-serif",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          {erro}
        </p>
      )}
    </>
  );
}

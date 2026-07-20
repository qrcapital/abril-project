"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const TOTAL = 20;
const DURATION_MS = 120 * 60 * 1000; // 120 min
const KEY_DEADLINE = "ei_exam_deadline";
const KEY_ANSWERS = "ei_exam_answers";

// Estilo base (não-selecionado) de cada elemento, capturado UMA vez. Precisa
// sobreviver às re-execuções do efeito: como o DOM é reaproveitado entre questões,
// reler o estilo direto do DOM pegaria a versão já pintada (selecionada) e a
// seleção anterior "grudaria". WeakMap de módulo persiste enquanto o DOM viver.
const baseStyle = new WeakMap<Element, string>();
const getBase = (el: Element | null) => {
  if (!el) return "";
  if (!baseStyle.has(el)) baseStyle.set(el, el.getAttribute("style") || "");
  return baseStyle.get(el)!;
};

/**
 * Prova — questão (design portado). Demo de homolog do fluxo completo:
 * - alternativas selecionáveis (radio), respostas persistidas por questão;
 * - cronômetro regressivo com deadline em sessionStorage (sobrevive à navegação
 *   entre questões e a refresh — PRD: reentrada não reinicia);
 * - contador "X respondidas" + barra de progresso;
 * - Anterior / Próxima; na última questão vira "Enviar prova" → resultado.
 * O enunciado e as alternativas são placeholders; as questões reais vêm do Supabase.
 */
export default function QuizClient({ html, q }: { html: string; q: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Todas as telas de questão compartilham o mesmo HTML: ao navegar entre elas o
    // DOM é reaproveitado. Sem limpar os listeners, eles acumulam e causam seleção
    // dupla. O AbortController remove os antigos a cada troca de questão.
    const ac = new AbortController();
    const on = <K extends keyof HTMLElementEventMap>(
      el: Element,
      ev: K,
      fn: (e: HTMLElementEventMap[K]) => void
    ) => el.addEventListener(ev as string, fn as EventListener, { signal: ac.signal });

    let deadline = Number(sessionStorage.getItem(KEY_DEADLINE));
    if (!deadline) {
      deadline = Date.now() + DURATION_MS;
      sessionStorage.setItem(KEY_DEADLINE, String(deadline));
    }
    let answers: Record<string, string> = {};
    try {
      answers = JSON.parse(sessionStorage.getItem(KEY_ANSWERS) || "{}");
    } catch {}
    const saveAnswers = () =>
      sessionStorage.setItem(KEY_ANSWERS, JSON.stringify(answers));

    const spans = [...root.querySelectorAll<HTMLElement>("span")];
    const timerEl = spans.find((s) => /^\d+:\d+$/.test((s.textContent || "").trim()));
    const headerQ = spans.find((s) => /^Questão \d+ de \d+$/.test((s.textContent || "").trim()));
    const respEl = spans.find((s) => /respondidas$/.test((s.textContent || "").trim()));
    const labelQ = spans.find((s) => /^Questão \d+$/.test((s.textContent || "").trim()));
    const progress = root.querySelector<HTMLElement>('i[style*="linear-gradient"]');
    const alts = [...root.querySelectorAll<HTMLElement>("[data-alt]")];

    const SELBOX = ";border:1.5px solid #A98E4E;background:#FBF6EC";
    const SELDOT = ";background:#A98E4E;border-color:#A98E4E;color:#fff";
    // captura o base limpo antes de qualquer pintura desta execução
    alts.forEach((a) => {
      getBase(a);
      getBase(a.firstElementChild);
    });

    const answered = () => Object.keys(answers).length;

    const paint = () => {
      alts.forEach((a) => {
        const dot = a.firstElementChild;
        const sel = answers[q] === a.dataset.alt;
        a.setAttribute("style", getBase(a) + (sel ? SELBOX : ""));
        dot?.setAttribute("style", getBase(dot) + (sel ? SELDOT : ""));
      });
      if (headerQ) headerQ.textContent = `Questão ${q} de ${TOTAL}`;
      if (labelQ) labelQ.textContent = `Questão ${q}`;
      if (respEl) respEl.textContent = `${answered()} respondidas`;
    };
    paint();

    // barra de progresso = posição da questão (q/TOTAL). Como o DOM persiste entre
    // questões, a mudança de largura anima (transition) crescendo/diminuindo.
    if (progress) progress.style.width = `${Math.round((q / TOTAL) * 100)}%`;

    alts.forEach((a) =>
      on(a, "click", () => {
        answers[q] = a.dataset.alt!;
        saveAnswers();
        paint();
      })
    );

    const finish = () => {
      sessionStorage.removeItem(KEY_DEADLINE);
      sessionStorage.removeItem(KEY_ANSWERS);
      router.push("/app/prova/resultado");
    };

    const buttons = [...root.querySelectorAll("button")];
    const prev = buttons.find((b) => (b.textContent || "").trim().startsWith("←"));
    const next = buttons.find((b) => /Próxima|→/.test(b.textContent || ""));
    if (prev) {
      if (q <= 1) {
        prev.disabled = true;
        prev.style.opacity = "0.4";
        prev.style.cursor = "not-allowed";
      }
      on(prev, "click", () => {
        if (q > 1) router.push(`/app/prova/questao/${q - 1}`);
      });
    }
    if (next) {
      if (q >= TOTAL) next.textContent = "Enviar prova";
      on(next, "click", () => {
        if (q < TOTAL) router.push(`/app/prova/questao/${q + 1}`);
        else finish();
      });
    }

    const fmt = (ms: number) => {
      const t = Math.max(0, Math.floor(ms / 1000));
      return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
    };
    const tick = () => {
      const rem = deadline - Date.now();
      if (timerEl) timerEl.textContent = fmt(rem);
      if (rem <= 0) {
        clearInterval(iv);
        finish();
      }
    };
    tick();
    const iv = setInterval(tick, 1000);

    return () => {
      clearInterval(iv);
      ac.abort();
    };
  }, [router, q]);

  return (
    <>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      {/* Atalhos só de homolog: pular para o resultado aprovado/reprovado. */}
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "0 28px 48px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#B4A98F",
            fontWeight: 700,
          }}
        >
          Atalhos de teste (homolog)
        </span>
        <button
          onClick={() => router.push("/app/prova/resultado")}
          style={{
            border: "1px dashed #1F8A5B",
            color: "#1F8A5B",
            background: "transparent",
            borderRadius: 7,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Simular aprovação →
        </button>
        <button
          onClick={() => router.push("/app/prova/resultado?r=reprovado")}
          style={{
            border: "1px dashed #B0413E",
            color: "#B0413E",
            background: "transparent",
            borderRadius: 7,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Simular reprovação →
        </button>
      </div>
    </>
  );
}

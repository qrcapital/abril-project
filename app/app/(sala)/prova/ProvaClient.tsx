"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const GOLD =
  "background:linear-gradient(160deg,#D9BE85,#A98E4E);color:#0A2B1E;cursor:pointer;box-shadow:0 6px 16px rgba(169,142,78,.26)";

/**
 * Prova — instruções (design portado). O botão "INICIAR PROVA" vem desabilitado;
 * só habilita quando o aluno marca o checkbox "Estou ciente…". Iniciar → questão 1.
 */
export default function ProvaClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const cbRow = [...root.querySelectorAll<HTMLElement>("div")].find(
      (d) =>
        /cursor:pointer/.test(d.getAttribute("style") || "") &&
        /Estou ciente/.test(d.textContent || "")
    );
    const box = cbRow?.firstElementChild as HTMLElement | null;
    const btn = root.querySelector("button");
    if (!cbRow || !box || !btn) return;

    // transições para a animação leve (checkbox preenchendo, botão ganhando a cor)
    const boxBase =
      (box.getAttribute("style") || "") + ";transition:background .22s ease,border-color .22s ease,color .22s ease";
    const btnBase =
      (btn.getAttribute("style") || "") +
      ";transition:transform .14s ease,background .28s ease,color .28s ease,box-shadow .28s ease";
    box.setAttribute("style", boxBase);
    btn.setAttribute("style", btnBase);
    const btnEnabled =
      btnBase.replace("cursor:not-allowed", "cursor:pointer").replace(/background:#EDE6DD/, "").replace(/color:#B4A98F/, "") +
      ";" + GOLD;
    let checked = false;

    const render = () => {
      if (checked) {
        box.setAttribute(
          "style",
          boxBase + ";background:#A98E4E;border-color:#A98E4E;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700"
        );
        box.textContent = "✓";
        btn.setAttribute("style", btnEnabled);
      } else {
        box.setAttribute("style", boxBase);
        box.textContent = "";
        btn.setAttribute("style", btnBase);
      }
    };

    cbRow.addEventListener("click", () => {
      checked = !checked;
      render();
    });
    btn.addEventListener("click", () => {
      if (checked) router.push("/app/prova/questao/1");
    });
    // hover estilo LP (lift), só quando habilitado
    btn.addEventListener("mouseenter", () => {
      if (checked) btn.setAttribute("style", btnEnabled + ";transform:translateY(-1px);box-shadow:0 10px 24px rgba(169,142,78,.4)");
    });
    btn.addEventListener("mouseleave", () => {
      if (checked) btn.setAttribute("style", btnEnabled);
    });

    const back = [...root.querySelectorAll("a")].find((a) =>
      /Voltar para a home/i.test(a.textContent || "")
    );
    back?.addEventListener("click", (e) => {
      e.preventDefault();
      router.push("/app");
    });
  }, [router]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

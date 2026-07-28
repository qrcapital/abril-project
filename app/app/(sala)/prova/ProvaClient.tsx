"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { iniciarProva } from "./actions";

const GOLD =
  "background:linear-gradient(160deg,#D9BE85,#A98E4E);color:#0A2B1E;cursor:pointer;box-shadow:0 6px 16px rgba(169,142,78,.26)";

/**
 * Prova — instruções (design portado). O botão "INICIAR PROVA" vem desabilitado;
 * só habilita quando o aluno marca o checkbox "Estou ciente…".
 *
 * Iniciar chama a server action, que é quem abre a tentativa no banco e grava o
 * `deadline`. Só navega depois do ok: se a abertura falhar, o aluno não pode cair numa
 * tela de questão sem tentativa por trás.
 */
export default function ProvaClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);

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
    let abrindo = false;
    btn.addEventListener("click", async () => {
      if (!checked || abrindo) return;
      abrindo = true;
      btn.textContent = "ABRINDO PROVA...";
      const r = await iniciarProva();
      if (r.ok) {
        router.push("/app/prova/questao/1");
      } else {
        abrindo = false;
        btn.textContent = "INICIAR PROVA";
        setErro(r.erro);
      }
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

  return (
    <>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      {erro && (
        <p
          role="alert"
          style={{
            maxWidth: 660,
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

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CERT, linkedinAddUrl } from "@/lib/certificado";

/**
 * Certificado (design portado).
 * - NPS 0–10 selecionável;
 * - "Baixar PDF" → captura o preview (html2canvas) e monta um PDF do tamanho exato
 *   do certificado (jsPDF), sem corte — libs carregadas sob demanda no clique;
 * - "Compartilhar no LinkedIn" → fluxo oficial de adicionar certificação ao perfil;
 * - "Validar em…" → página pública /verificar/:codigo;
 * - "Voltar para a home" → /app.
 */
export default function CertificadoClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // NPS
    const nps = [...root.querySelectorAll<HTMLElement>("[data-nps]")];
    const SEL = ";background:#A98E4E;color:#fff;border-color:#A98E4E";
    const base = nps.map((b) => b.getAttribute("style") || "");
    nps.forEach((b, i) =>
      b.addEventListener("click", () => {
        nps.forEach((x, j) => x.setAttribute("style", base[j]));
        b.setAttribute("style", base[i] + SEL);
      })
    );

    // Baixar PDF
    root.querySelectorAll("button").forEach((b) => {
      if (/baixar pdf/i.test(b.textContent || "")) b.addEventListener("click", () => baixarPdf(b));
    });

    // Links
    root.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
      const t = a.textContent || "";
      if (/Voltar para a home/i.test(t)) {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          router.push("/app");
        });
      } else if (/LinkedIn/i.test(t)) {
        a.href = linkedinAddUrl(window.location.origin);
        a.target = "_blank";
        a.rel = "noopener";
      } else if (/Validar em/i.test(t)) {
        a.href = `/verificar/${CERT.codigo}`;
        a.target = "_blank";
        a.rel = "noopener";
      }
    });
  }, [router]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

async function toDataUri(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob();
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

async function baixarPdf(btn: HTMLButtonElement) {
  const el = document.getElementById("cert-preview");
  if (!el) return;

  btn.style.opacity = "0.6";
  btn.style.pointerEvents = "none";
  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    // html2canvas não renderiza <img src=".svg"> nem o filtro brightness(0). Pré-
    // carrega o PNG rasterizado de cada logo como data URI (disponível já no clone).
    const svgImgs = [...el.querySelectorAll<HTMLImageElement>("img")].filter((i) =>
      (i.getAttribute("src") || "").endsWith(".svg")
    );
    const png = new Map<string, string>();
    for (const img of svgImgs) {
      const src = img.getAttribute("src")!;
      png.set(src, await toDataUri(src.replace(/\.svg$/, ".png")));
    }

    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#F7F5F2",
      useCORS: true,
      logging: false,
      onclone: (doc) => {
        doc.querySelectorAll<HTMLImageElement>("#cert-preview img").forEach((img) => {
          const uri = png.get(img.getAttribute("src") || "");
          if (uri) {
            img.setAttribute("src", uri);
            img.style.filter = "none";
          }
        });
      },
    });
    const w = canvas.width;
    const h = canvas.height;
    const pdf = new jsPDF({
      orientation: w >= h ? "landscape" : "portrait",
      unit: "px",
      format: [w, h],
    });
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.96), "JPEG", 0, 0, w, h);
    pdf.save("certificado-estrategia-internacional.pdf");
  } finally {
    btn.style.opacity = "";
    btn.style.pointerEvents = "";
  }
}

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CERT, linkedinAddUrl } from "@/lib/certificado";
import { emTrabalho, pintarCaixa } from "@/app/app/_ui/feedback";

import contato from "@/lib/contato.json";

const WHATSAPP = contato.whatsapp;

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

    // Baixar PDF. A caixa de erro nasce escondida logo abaixo do botão: é onde o aluno está
    // olhando quando o download não vem.
    root.querySelectorAll("button").forEach((b) => {
      if (!/baixar pdf/i.test(b.textContent || "")) return;
      const caixa = document.createElement("div");
      caixa.hidden = true;
      caixa.style.marginTop = "12px";
      b.after(caixa);
      b.addEventListener("click", () => baixarPdf(b, caixa));
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

/**
 * Gera e baixa o PDF do certificado.
 *
 * Tinha `finally` e não tinha `catch`: qualquer falha devolvia o botão ao normal, o arquivo
 * não vinha e nada era dito, o que para o aluno é indistinguível de "o clique não pegou".
 * São quatro pontos que podem falhar, nenhum sob nosso controle no momento do clique: baixar
 * as duas bibliotecas por `import()` dinâmico, buscar os logos em PNG, rasterizar, e salvar.
 * É a entrega final do curso, então falha silenciosa aqui vira ticket de suporte na hora.
 */
async function baixarPdf(btn: HTMLButtonElement, caixa: HTMLElement) {
  const avisar = (msg: string) =>
    pintarCaixa(caixa, "erro", msg, "claro", { rotulo: "WhatsApp", href: WHATSAPP });

  const el = document.getElementById("cert-preview");
  if (!el) {
    // Era o caminho mais silencioso de todos: `return` na primeira linha, sem nem a
    // opacidade piscar. O único caso em que o clique de fato não fazia nada.
    console.error("[certificado] #cert-preview não encontrado");
    return avisar(
      "Não foi possível preparar o certificado. Recarregue a página; se insistir, fale com o suporte no WhatsApp.",
    );
  }

  pintarCaixa(caixa, "erro", null);
  // Rótulo de trabalho em vez de só esmaecer: a operação leva segundos (duas bibliotecas pela
  // rede mais a rasterização), e opacidade sozinha é indistinguível de clique perdido.
  const restaurar = emTrabalho(btn, "Gerando PDF...");
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
  } catch (e) {
    console.error("[certificado] falha ao gerar o PDF:", e);
    avisar(
      "Não foi possível gerar o PDF. Tente de novo; se insistir, fale com o suporte no WhatsApp.",
    );
  } finally {
    restaurar();
  }
}

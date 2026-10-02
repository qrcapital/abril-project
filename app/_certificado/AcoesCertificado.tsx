"use client";

import { useRef, useState } from "react";

import { CURSO, DOMINIO_VERIFICACAO, linkedinAddUrl, urlVerificacao } from "@/lib/certificado";
import { pintarCaixa } from "@/app/app/_ui/feedback";
import contato from "@/lib/contato.json";

/** Largura em px de um A4 deitado a 96 dpi. A folha é medida em mm, então é só escolher a régua. */
const LARGURA_PDF = 1123;
/** Densidade da rasterização: 3 dá ~290 dpi no A4, nítido no papel e abaixo do teto de canvas do iOS. */
const ESCALA = 3;

/**
 * As ações em volta da folha: o código, baixar o PDF, imprimir e levar ao LinkedIn.
 *
 * O PDF segue o caminho que já existia (html2canvas + jsPDF, carregados só no clique), com duas
 * mudanças: o arquivo agora é um A4 deitado de verdade (297 x 210 mm, e não "o tamanho do
 * preview"), e a área do QR vira link clicável no PDF. Imprimir usa o `@media print` da folha.
 *
 * `exemplo` é a prévia do admin: sem LinkedIn e sem link de verificação, que levariam a um
 * "não encontrado" de propósito.
 */
export default function AcoesCertificado({
  codigo,
  emitidoEm,
  exemplo = false,
}: {
  codigo: string;
  emitidoEm: string;
  exemplo?: boolean;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const [gerando, setGerando] = useState(false);
  const leitura = urlVerificacao(codigo, { protocolo: false });

  async function baixar() {
    pintarCaixa(caixa.current, "erro", null);
    setGerando(true);
    try {
      await baixarPdf(codigo);
    } catch (e) {
      console.error("[certificado] falha ao gerar o PDF:", e);
      pintarCaixa(
        caixa.current,
        "erro",
        "Não foi possível gerar o PDF. Tente de novo ou use Imprimir e escolha Salvar como PDF; se insistir, fale com o suporte no WhatsApp.",
        "claro",
        { rotulo: "WhatsApp", href: contato.whatsapp },
      );
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="cf-acoes">
      <div className="cf-cartao">
        <span className="cf-cartao-rotulo">Código de verificação</span>
        <span className="cf-cartao-codigo">{codigo}</span>
        {exemplo ? (
          <span className="cf-cartao-nota">
            Código de amostra: ele nunca é emitido, e a verificação pública responde que não o encontrou.
          </span>
        ) : (
          <>
            <a className="cf-cartao-link" href={`/verificar/${codigo}`} target="_blank" rel="noopener">
              {leitura}
            </a>
            <p className="cf-cartao-nota">
              Quem recebe o certificado confere nome, curso e data nesse endereço ou pelo QR code da folha.
            </p>
          </>
        )}
      </div>

      <div className="cf-cartao cf-botoes">
        <div ref={caixa} hidden />
        <button
          type="button"
          className="cf-botao cf-botao-pri"
          onClick={baixar}
          disabled={gerando}
          aria-busy={gerando || undefined}
        >
          {!gerando && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
            </svg>
          )}
          {gerando ? "Gerando PDF..." : "Baixar PDF"}
        </button>
        <div className={exemplo ? undefined : "cf-botoes-par"}>
          <button type="button" className="cf-botao cf-botao-sec" onClick={() => window.print()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z" />
            </svg>
            Imprimir
          </button>
          {!exemplo && (
            <a
              className="cf-botao cf-botao-sec"
              href={linkedinAddUrl(`https://${DOMINIO_VERIFICACAO}`, codigo, new Date(emitidoEm))}
              target="_blank"
              rel="noopener"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Um SVG da folha como PNG do tamanho em que ele vai aparecer no PDF.
 *
 * O html2canvas não desenha bem `<img src=".svg">`: sem `width`/`height` no SVG (o logo do
 * BlockTrends só tem `viewBox`) o Firefox desenha 0 px, e o resultado varia por navegador. Aqui o
 * SVG ganha tamanho explícito, passa por um canvas do próprio navegador e volta como PNG, que o
 * html2canvas desenha igual em todo lugar. Vale para os logos, o globo e o QR (data URI).
 */
async function svgParaPng(src: string, w: number, h: number): Promise<string> {
  const bruto = await (await fetch(src)).text();
  const svg = bruto.replace(/<svg\b[^>]*>/, (tag) =>
    tag.replace(/\s(?:width|height)="[^"]*"/g, "").replace(/^<svg/, `<svg width="${w}" height="${h}"`),
  );
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d indisponível");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Gera e baixa o PDF: A4 deitado, uma página, a folha inteira sem margem.
 *
 * Lança em qualquer falha (bibliotecas pela rede, logos, rasterização), e quem chama mostra a caixa
 * de erro com a saída pela impressão. Falha silenciosa aqui é indistinguível de "o clique não pegou",
 * e é a entrega final do curso.
 */
async function baixarPdf(codigo: string) {
  const folha = document.getElementById("cert-folha");
  if (!folha) throw new Error("#cert-folha não encontrado");

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);

  // A régua: quantos px do PDF vale cada px da folha na tela.
  const caixa = folha.getBoundingClientRect();
  const k = (LARGURA_PDF * ESCALA) / caixa.width;
  const imgs = [...folha.querySelectorAll<HTMLImageElement>("img")];
  const pngs = await Promise.all(
    imgs.map((img) => {
      const r = img.getBoundingClientRect();
      return svgParaPng(img.currentSrc || img.src, Math.max(1, Math.round(r.width * k)), Math.max(1, Math.round(r.height * k)));
    }),
  );

  const canvas = await html2canvas(folha, {
    scale: ESCALA,
    backgroundColor: "#f7f4ee",
    useCORS: true,
    logging: false,
    windowWidth: Math.max(window.innerWidth, LARGURA_PDF + 40),
    onclone: (doc) => {
      const clone = doc.getElementById("cert-folha");
      if (!clone) return;
      // A folha é medida em mm via container query: fixar a largura da moldura em 1123 px redesenha
      // a peça inteira em escala de A4, independente do tamanho da janela de quem baixa.
      clone.style.width = `${LARGURA_PDF}px`;
      // O canvas desenha algarismos proporcionais, e a tela os mede tabulares: com os dois juntos,
      // cada trecho sai mais estreito que a vaga e o PDF ganha buracos ("1º  de", "052 /0001").
      // No clone a folha usa os proporcionais, para a medida e o desenho baterem.
      clone.style.fontVariantNumeric = "normal";
      clone.querySelectorAll<HTMLElement>(".cf-folha").forEach((f) => (f.style.fontVariantNumeric = "normal"));
      clone.querySelectorAll<HTMLImageElement>("img").forEach((img, i) => {
        if (pngs[i]) img.src = pngs[i];
      });
    },
  });

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
  pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 297, 210, undefined, "FAST");
  pdf.setProperties({
    title: `Certificado de conclusão, ${CURSO} (${codigo})`,
    subject: `Verificação: ${urlVerificacao(codigo, { protocolo: false })}`,
    author: "VEJA Negócios e BlockTrends",
    keywords: codigo,
    creator: DOMINIO_VERIFICACAO,
  });

  // O bloco do QR e do código vira link no PDF: quem recebe o arquivo verifica com um clique.
  const bloco = folha.querySelector("[data-verifica]")?.getBoundingClientRect();
  if (bloco) {
    const mm = 297 / caixa.width;
    pdf.link(
      (bloco.left - caixa.left) * mm,
      (bloco.top - caixa.top) * mm,
      bloco.width * mm,
      bloco.height * mm,
      { url: urlVerificacao(codigo) },
    );
  }

  pdf.save(`certificado-estrategia-internacional-${codigo}.pdf`);
}

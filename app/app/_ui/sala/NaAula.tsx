"use client";

import Link from "next/link";

import { segundos } from "@/lib/notebook";

import { semMovimento } from "./Entrada";

/**
 * "Na aula, 12:34": o atalho de um bloco do notebook para o momento da aula em que o assunto
 * aparece.
 *
 * COMO O CLIQUE CHEGA AO VÍDEO (decidido em 01/out/2026, o caminho mais simples que funciona):
 *
 * 1. Se a aula do bloco é a que está no teatro, o player já está na página. O clique sobe a tela
 *    até ele e manda o vídeo para o segundo certo SEM recarregar nada:
 *    - Panda (iframe): `postMessage({ type: "currentTime", parameter: s })` seguido de `play`, a
 *      API documentada de envio de eventos do player do Panda (docs.pandavideo.com, "Send
 *      events"), endereçada à origem do iframe e não a `*`;
 *    - vídeo de exemplo (<video>): `currentTime` direto.
 * 2. Se é outra aula, é um link (`next/link`): `/app/modulo/<m>?aula=<n>&t=<s>#player`. A página lê o
 *    `t`, saneado por `segundosDaUrl`, e o player nasce no ponto (`startTime` no embed do Panda,
 *    parâmetro documentado; `currentTime` no <video>). Também é o que acontece sem JS e com o
 *    botão do meio do mouse.
 *
 * O player marca a aula que toca em `data-player-aula` (ver `Player.tsx`); é por ele que este
 * componente sabe em qual dos dois casos está.
 */
export default function NaAula({ modulo, aula, tempo }: { modulo: number; aula: number; tempo: string }) {
  const s = segundos(tempo);
  if (s === null) return null;
  const href = `/app/modulo/${modulo}?aula=${aula}&t=${s}#player`;

  function clicar(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const caixa = document.querySelector<HTMLElement>(`[data-player-aula="${aula}"]`);
    if (!caixa || s === null) return; // outra aula no teatro: segue o link
    const iframe = caixa.querySelector("iframe");
    const video = caixa.querySelector("video");
    let foi = false;
    if (iframe?.contentWindow && iframe.src) {
      try {
        const origem = new URL(iframe.src).origin;
        iframe.contentWindow.postMessage({ type: "currentTime", parameter: s }, origem);
        iframe.contentWindow.postMessage({ type: "play" }, origem);
        foi = true;
      } catch {
        foi = false;
      }
    } else if (video) {
      video.currentTime = s;
      void video.play().catch(() => {});
      foi = true;
    }
    if (!foi) return;
    e.preventDefault();
    caixa.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "center" });
  }

  return (
    <Link className="sl-naaula" href={href} onClick={clicar}>
      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M3 1.8v8.4L10 6z" fill="currentColor" />
      </svg>
      Na aula, <span className="sl-num">{tempo}</span>
    </Link>
  );
}

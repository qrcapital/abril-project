"use client";

import { useEffect, useRef } from "react";

import type { FonteDoVideo } from "@/lib/video";

/**
 * O player de uma aula: iframe do Panda quando a aula tem vídeo, o vídeo de exemplo quando não.
 *
 * O `src` do iframe só entra depois de dois quadros, pelo mesmo motivo do `VslMount` da LP
 * (22/set/2026): o player do Panda mede a caixa uma vez, no boot, e não observa resize. Com o
 * `src` no HTML ele bootava antes de a largura final existir e desenhava o poster pela metade.
 * Aqui a caixa é 16:9 por CSS e o src chega quando ela já tem o tamanho definitivo.
 */
export default function Player({ fonte, titulo }: { fonte: FonteDoVideo; titulo: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const src = fonte.tipo === "panda" ? fonte.src : null;

  useEffect(() => {
    if (!src) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const f = ref.current;
        if (f && f.getAttribute("src") !== src) f.setAttribute("src", src);
      }),
    );
    return () => cancelAnimationFrame(id);
  }, [src]);

  return (
    <div className="sl-player">
      {fonte.tipo === "panda" ? (
        <iframe
          ref={ref}
          title={`Vídeo da aula: ${titulo}`}
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen"
          allowFullScreen
        />
      ) : (
        // `nodownload` e o menu de contexto bloqueado: a aula não é para baixar (os materiais
        // são). A proteção de verdade vem do Panda, com o vídeo real.
        <video
          controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          playsInline
          preload="metadata"
          onContextMenu={(e) => e.preventDefault()}
          src={fonte.src}
          aria-label={`Vídeo da aula: ${titulo}`}
        />
      )}
    </div>
  );
}

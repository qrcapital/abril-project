"use client";

import { useEffect } from "react";

/**
 * Monta o player da Panda só DEPOIS que o layout assentou.
 *
 * POR QUE ISTO EXISTE (22/set/2026)
 * Com o `src` direto no HTML, o player da Panda renderizava o poster em
 * exatamente metade da largura do iframe, ancorado no canto superior esquerdo,
 * com preto em volta. O iframe estava correto (1018x573, `inset:0`, razão 16/9
 * no wrapper) e o thumbnail no CDN está em 1280x720, então não era nem caixa
 * nem imagem.
 *
 * A prova veio de um experimento na própria página no ar: quatro cópias do
 * mesmo embed, criadas por JS depois do load, em 560, 720, 880 e 1018px, todas
 * preencheram. O original, na mesma largura, continuou pela metade. Ou seja: o
 * player mede o iframe uma vez, no boot, e não observa resize. Quando ele boota
 * junto com a página, mede antes de a largura final existir e trava ali.
 *
 * A correção é tirar o player do caminho crítico: o HTML traz `data-src`, e este
 * componente promove para `src` no primeiro efeito, quando a caixa já tem o
 * tamanho definitivo. De quebra, um terceiro pesado deixa de concorrer com o
 * carregamento do hero. A capa que o usuário vê enquanto isso é a nossa, em
 * /lp/vsl-capa.jpg, posta como background do wrapper.
 */
export default function VslMount() {
  useEffect(() => {
    const promover = () => {
      document.querySelectorAll<HTMLIFrameElement>("iframe[data-src]").forEach((f) => {
        const src = f.dataset.src;
        if (!src || f.src === src) return;
        f.src = src;
        delete f.dataset.src;
      });
    };
    // Dois quadros: o primeiro fecha o layout, o segundo garante que a medida
    // que o player vai ler já é a final.
    const id = requestAnimationFrame(() => requestAnimationFrame(promover));
    return () => cancelAnimationFrame(id);
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

/**
 * Runtime de interações da área do aluno (progressive enhancement).
 *
 * O bundle do Claude Design aplica hovers e focus via atributos `style-hover` /
 * `style-focus` (troca do `style` inline em JS). O porte estático remove esse JS;
 * aqui reproduzimos o mesmo comportamento. Usa MutationObserver para pegar também
 * o conteúdo de telas montadas em navegação client-side.
 *
 * Espelha o `HoverRuntime` da LP, somando o suporte a `style-focus` (inputs).
 */
export default function AreaInteractions() {
  useEffect(() => {
    const bound = new WeakSet<HTMLElement>();

    function bind(el: HTMLElement) {
      if (bound.has(el)) return;
      const hover = el.getAttribute("style-hover");
      const focus = el.getAttribute("style-focus");
      if (!hover && !focus) return;
      bound.add(el);
      const base = el.getAttribute("style") || "";
      const on = (extra: string) =>
        base + (base && !/;\s*$/.test(base) ? ";" : "") + extra;

      if (hover) {
        el.addEventListener("mouseenter", () => el.setAttribute("style", on(hover)));
        el.addEventListener("mouseleave", () => el.setAttribute("style", base));
      }
      if (focus) {
        el.addEventListener("focus", () => el.setAttribute("style", on(focus)));
        el.addEventListener("blur", () => el.setAttribute("style", base));
      }
    }

    const scan = (root: ParentNode) =>
      root.querySelectorAll<HTMLElement>("[style-hover],[style-focus]").forEach(bind);

    scan(document);
    const mo = new MutationObserver((muts) =>
      muts.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) scan(n);
        })
      )
    );
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  return null;
}

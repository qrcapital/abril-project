"use client";

import { useEffect, useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * A entrada dos gráficos e infográficos do notebook: o desenho corre quando a figura chega na
 * tela, como os gráficos do diagnóstico da LP (`app/_lp/GraficoEntrada.tsx`). As duas lições de
 * lá valem aqui, e é por elas que isto não é um IntersectionObserver solto:
 *
 * 1. O PADRÃO É VISÍVEL. O HTML do servidor sai com a figura inteira; só o JS, já montado, põe
 *    `data-entrada="fora"` nas figuras que estão FORA da tela. Sem JS, ou com JS quebrado, nada
 *    some. A figura que já está na tela quando a página hidrata fica como está: animar o que o
 *    aluno já está vendo seria fazê-la piscar.
 * 2. O OBSERVER NÃO É O CAMINHO CRÍTICO. Em aba de segundo plano ele não entrega nada, e na LP isso
 *    deixou gráfico fechado para sempre. Aqui a rolagem (de qualquer caixa, por captura: no desktop
 *    o notebook rola dentro da própria caixa) e a volta da aba conferem na mão, com a mesma função.
 *
 * O CSS faz o resto, sob `[data-entrada="entra"]` (`sala.css`, "entrada"). Com movimento reduzido
 * nada disto roda e a figura nasce pronta.
 */

type Pendente = { el: HTMLElement; abrir: () => void };

const pendentes = new Set<Pendente>();
let observer: IntersectionObserver | null = null;
let ouvindo = false;
let agendado = false;

/** A parte visível da tela para um elemento: a janela, cortada pela caixa que rola o notebook. */
function naTela(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  if (!r.width && !r.height) return false;
  let topo = 0;
  let base = window.innerHeight;
  const caixa = el.closest<HTMLElement>("[data-nb-rolagem]");
  if (caixa && caixa.scrollHeight > caixa.clientHeight + 1) {
    const c = caixa.getBoundingClientRect();
    topo = Math.max(topo, c.top);
    base = Math.min(base, c.bottom);
  }
  // Um pouco dentro, não só tocando a borda: o desenho começa quando já dá para vê-lo.
  const folga = Math.min(r.height * 0.15, 80);
  return r.top < base - folga && r.bottom > topo + folga;
}

function conferir() {
  agendado = false;
  for (const p of [...pendentes]) if (naTela(p.el)) abrir(p);
}

function agendar() {
  if (agendado) return;
  agendado = true;
  // setTimeout, não rAF: rAF não roda em aba oculta (a mesma razão da LP).
  window.setTimeout(conferir, 60);
}

function aoVoltar() {
  if (document.visibilityState === "visible") conferir();
}

function abrir(p: Pendente) {
  pendentes.delete(p);
  observer?.unobserve(p.el);
  p.abrir();
  if (!pendentes.size) desligar();
}

function ligar() {
  if (ouvindo) return;
  ouvindo = true;
  // Captura no document: `scroll` não borbulha, e a caixa do notebook rola sem mexer na janela.
  document.addEventListener("scroll", agendar, { capture: true, passive: true });
  window.addEventListener("resize", agendar, { passive: true });
  document.addEventListener("visibilitychange", aoVoltar);
  try {
    observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const p = [...pendentes].find((x) => x.el === e.target);
          if (p) abrir(p);
        }
      },
      { threshold: 0.15 },
    );
    for (const p of pendentes) observer.observe(p.el);
  } catch {
    observer = null; // a rolagem e a volta da aba dão conta
  }
}

function desligar() {
  if (!ouvindo) return;
  ouvindo = false;
  document.removeEventListener("scroll", agendar, { capture: true });
  window.removeEventListener("resize", agendar);
  document.removeEventListener("visibilitychange", aoVoltar);
  observer?.disconnect();
  observer = null;
}

/** Movimento reduzido: o sistema pediu, a figura nasce pronta e o número não conta. */
export function semMovimento(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Liga a entrada num elemento. `aoEntrar` roda uma vez, quando a figura entra (a contagem dos
 * KPIs usa); não roda se a figura já estava na tela ou se o movimento é reduzido.
 */
export function useEntrada<T extends HTMLElement>(aoEntrar?: () => void) {
  const ref = useRef<T>(null);
  const cb = useRef(aoEntrar);
  useEffect(() => {
    cb.current = aoEntrar;
  });

  // Layout effect: decide o estado antes da primeira pintura do cliente, sem piscar.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || semMovimento() || naTela(el)) return;
    el.dataset.entrada = "fora";
    const p: Pendente = {
      el,
      abrir: () => {
        el.dataset.entrada = "entra";
        cb.current?.();
      },
    };
    pendentes.add(p);
    ligar();
    observer?.observe(el);
    return () => {
      pendentes.delete(p);
      observer?.unobserve(el);
      if (!pendentes.size) desligar();
    };
  }, []);

  return ref;
}

/** Envoltório para componente de servidor que só precisa da entrada (fluxo, comparativo). */
export function Entrada({
  como: Tag = "div",
  className,
  children,
  ...resto
}: {
  como?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
}) {
  const ref = useEntrada<HTMLElement>();
  return (
    <Tag ref={ref} className={className} {...resto}>
      {children}
    </Tag>
  );
}

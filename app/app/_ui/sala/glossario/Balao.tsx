"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Alvo = { el: HTMLAnchorElement; termo: string; cat: string; resumo: string; href: string };

const ABRE_MS = 140;
const FECHA_MS = 180;

/**
 * O balão dos termos do glossário (07/out/2026): um só para o trecho inteiro, por delegação, em vez
 * de um componente por link. Os links (`a.sl-termo`) saem prontos do servidor (`texto.tsx`) com o
 * termo, a categoria e o resumo em `data-gl-*`.
 *
 * - Mouse: o balão abre ao parar sobre o termo e fica aberto enquanto o ponteiro estiver no termo ou
 *   no balão, para dar tempo de chegar ao "Ver no glossário". O clique no termo vai direto ao verbete.
 * - Teclado: o foco no termo abre o balão (e o liga ao link por `aria-describedby`); Enter segue o
 *   link; Esc fecha.
 * - Toque: o primeiro toque abre o balão, sem sair da aula; o segundo toque no mesmo termo, ou o
 *   "Ver no glossário", leva ao verbete. Toque fora fecha.
 *
 * O clique comum navega pelo roteador do Next (sem recarregar a página); com modificador ou botão do
 * meio, segue nativo e abre em outra aba.
 */
export default function Balao({ children, className }: { children: React.ReactNode; className?: string }) {
  const raiz = useRef<HTMLDivElement>(null);
  const caixa = useRef<HTMLDivElement>(null);
  const [alvo, setAlvo] = useState<Alvo | null>(null);
  const alvoRef = useRef<Alvo | null>(null);
  const router = useRouter();
  const id = useId();

  useEffect(() => {
    alvoRef.current = alvo;
  }, [alvo]);

  useEffect(() => {
    const r = raiz.current;
    if (!r) return;
    let abre: number | undefined;
    let fecha: number | undefined;
    let ponteiro = "mouse";

    const ler = (el: HTMLAnchorElement): Alvo => ({
      el,
      termo: el.dataset.glTermo ?? el.textContent ?? "",
      cat: el.dataset.glCat ?? "",
      resumo: el.dataset.glResumo ?? "",
      href: el.getAttribute("href") ?? "#",
    });
    const termoDe = (t: EventTarget | null) =>
      t instanceof Element ? t.closest<HTMLAnchorElement>("a.sl-termo") : null;
    const noBalao = (t: EventTarget | null) => t instanceof Element && Boolean(t.closest(".sl-balao"));
    const limpar = () => {
      window.clearTimeout(abre);
      window.clearTimeout(fecha);
    };
    const abrir = (el: HTMLAnchorElement, ja = false) => {
      limpar();
      if (alvoRef.current?.el === el) return;
      if (ja) setAlvo(ler(el));
      else abre = window.setTimeout(() => setAlvo(ler(el)), ABRE_MS);
    };
    const fechar = (ja = false) => {
      limpar();
      if (ja) setAlvo(null);
      else fecha = window.setTimeout(() => setAlvo(null), FECHA_MS);
    };

    const sobre = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const a = termoDe(e.target);
      if (a) abrir(a);
      else if (noBalao(e.target)) limpar();
    };
    const sai = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!termoDe(e.target) && !noBalao(e.target)) return;
      // Indo do termo para o balão, ou do balão de volta ao termo dele, não fecha.
      if (noBalao(e.relatedTarget)) return limpar();
      const para = termoDe(e.relatedTarget);
      if (para && (para === termoDe(e.target) || para === alvoRef.current?.el)) return;
      fechar();
    };
    const desce = (e: PointerEvent) => {
      ponteiro = e.pointerType;
    };
    const foca = (e: FocusEvent) => {
      const a = termoDe(e.target);
      if (a && a.matches(":focus-visible")) abrir(a, true);
    };
    const desfoca = (e: FocusEvent) => {
      if (termoDe(e.target) && !noBalao(e.relatedTarget)) fechar(true);
    };
    const clica = (e: MouseEvent) => {
      const a = termoDe(e.target);
      if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      // Toque: o primeiro abre o balão, o segundo no mesmo termo segue.
      if (ponteiro !== "mouse" && alvoRef.current?.el !== a) {
        e.preventDefault();
        abrir(a, true);
        return;
      }
      e.preventDefault();
      fechar(true);
      router.push(a.getAttribute("href") ?? "/app/glossario");
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape" && alvoRef.current) fechar(true);
    };
    const foraDaqui = (e: PointerEvent) => {
      if (!alvoRef.current || e.pointerType === "mouse") return;
      if (!termoDe(e.target) && !noBalao(e.target)) fechar(true);
    };
    const rola = () => alvoRef.current && fechar(true);

    r.addEventListener("pointerover", sobre);
    r.addEventListener("pointerout", sai);
    r.addEventListener("pointerdown", desce);
    r.addEventListener("focusin", foca);
    r.addEventListener("focusout", desfoca);
    r.addEventListener("click", clica);
    document.addEventListener("keydown", tecla);
    document.addEventListener("pointerdown", foraDaqui);
    window.addEventListener("scroll", rola, { passive: true });
    window.addEventListener("resize", rola);
    return () => {
      limpar();
      r.removeEventListener("pointerover", sobre);
      r.removeEventListener("pointerout", sai);
      r.removeEventListener("pointerdown", desce);
      r.removeEventListener("focusin", foca);
      r.removeEventListener("focusout", desfoca);
      r.removeEventListener("click", clica);
      document.removeEventListener("keydown", tecla);
      document.removeEventListener("pointerdown", foraDaqui);
      window.removeEventListener("scroll", rola);
      window.removeEventListener("resize", rola);
    };
  }, [router]);

  // Posição: embaixo do termo, centrado e preso à janela; em cima quando não cabe embaixo. A
  // descrição acessível acompanha o balão aberto.
  useLayoutEffect(() => {
    const b = caixa.current;
    if (!alvo || !b) return;
    const r = alvo.el.getBoundingClientRect();
    const w = b.offsetWidth;
    const h = b.offsetHeight;
    const margem = 12;
    const x = Math.min(Math.max(margem, r.left + r.width / 2 - w / 2), window.innerWidth - w - margem);
    const cabeEmbaixo = r.bottom + 10 + h <= window.innerHeight - margem;
    const y = cabeEmbaixo ? r.bottom + 10 : Math.max(margem, r.top - 10 - h);
    b.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    b.dataset.lado = cabeEmbaixo ? "baixo" : "cima";
    b.style.setProperty("--seta", `${Math.round(r.left + r.width / 2 - x)}px`);
    alvo.el.setAttribute("aria-describedby", id);
    const el = alvo.el;
    return () => el.removeAttribute("aria-describedby");
  }, [alvo, id]);

  return (
    <div ref={raiz} className={className}>
      {children}
      {alvo && (
        <div ref={caixa} className="sl-balao" id={id} role="tooltip">
          {alvo.cat && <span className="sl-eyebrow">{alvo.cat}</span>}
          <strong className="sl-balao-termo">{alvo.termo}</strong>
          {alvo.resumo && <span className="sl-balao-resumo">{alvo.resumo}</span>}
          <Link className="sl-balao-ir" href={alvo.href} tabIndex={-1} onClick={() => setAlvo(null)}>
            Ver no glossário
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 6h7.5M6.5 2.8 9.7 6 6.5 9.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

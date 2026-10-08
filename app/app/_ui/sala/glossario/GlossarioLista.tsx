"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { letraDe, slugificar, urlDoVerbete } from "@/lib/glossario";
import { dobrar } from "@/lib/glossario-links";
import { colarNumeros } from "@/lib/notebook";

export type ItemGlossario = {
  slug: string;
  termo: string;
  sigla?: string;
  categoria: string;
  resumo: string;
  apelidos?: string[];
};

const LETRAS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "#"];

/** Texto de busca: sem acento, sem caixa, espaços simples. `dobrar` mantém o comprimento (realce). */
const chave = (s: string) => dobrar(s).replace(/\s+/g, " ").trim();

/**
 * A lista do glossário com busca, categorias e índice A a Z (07/out/2026). Porte do comportamento
 * do glossário do site da QR Asset (`qrasset-site/components/Educacao.jsx`), no desenho da sala.
 *
 * A busca ignora acento e caixa e olha termo, sigla, apelidos e resumo. Os itens já chegam em ordem
 * alfabética (`content/glossario/index.ts`); a busca só filtra, e o realce mostra onde casou. A
 * busca e a categoria vão para a URL (`?q=` e `?cat=`), sem recarregar: o endereço compartilhado
 * abre a mesma lista, e o "voltar" de um verbete devolve o aluno ao filtro em que estava.
 *
 * Os links da lista não fazem prefetch: são até 250, e a rota do verbete é dinâmica (a guarda de
 * matrícula do layout lê a sessão), então cada prefetch seria uma ida ao servidor.
 */
export default function GlossarioLista({
  itens,
  categorias,
  inicial,
}: {
  itens: ItemGlossario[];
  categorias: string[];
  inicial: { q: string; cat: string | null };
}) {
  const [q, setQ] = useState(inicial.q);
  const [cat, setCat] = useState<string | null>(
    inicial.cat ? (categorias.find((c) => slugificar(c) === inicial.cat) ?? null) : null,
  );
  const busca = useRef<HTMLInputElement>(null);

  const indexados = useMemo(
    () =>
      itens.map((v) => ({
        v,
        termo: chave(v.termo),
        outros: chave([v.sigla ?? "", ...(v.apelidos ?? [])].join(" | ")),
        resumo: chave(v.resumo),
      })),
    [itens],
  );

  const contagem = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of itens) m.set(v.categoria, (m.get(v.categoria) ?? 0) + 1);
    return m;
  }, [itens]);

  const k = chave(q);
  const visiveis = useMemo(
    () =>
      indexados.filter(
        (x) =>
          (!cat || x.v.categoria === cat) &&
          (!k || x.termo.includes(k) || x.outros.includes(k) || x.resumo.includes(k)),
      ),
    [indexados, cat, k],
  );

  const grupos = useMemo(() => {
    const g = new Map<string, typeof visiveis>();
    for (const x of visiveis) {
      const l = letraDe(x.v.termo);
      if (!g.has(l)) g.set(l, []);
      g.get(l)!.push(x);
    }
    return LETRAS.filter((l) => g.has(l)).map((l) => ({ letra: l, itens: g.get(l)! }));
  }, [visiveis]);

  // O filtro na URL, sem navegação: `replaceState` não empilha histórico a cada letra digitada.
  useEffect(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (cat) p.set("cat", slugificar(cat));
    const s = p.toString();
    const url = `${window.location.pathname}${s ? `?${s}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", url);
  }, [q, cat]);

  // "/" leva à busca, como nos sites de documentação. Não rouba a tecla de quem já está digitando.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      busca.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (itens.length === 0) {
    return (
      <div className="sl-gl-vazio">
        <p className="sl-eyebrow">Em produção</p>
        <p>
          Os verbetes entram aqui conforme forem revisados. Enquanto isso, as aulas e o notebook de cada
          módulo seguem completos.
        </p>
        <Link className="sl-btn sl-btn-linha" href="/app">
          Voltar ao início
        </Link>
      </div>
    );
  }

  const presentes = new Set(grupos.map((g) => g.letra));
  const limpar = () => {
    setQ("");
    setCat(null);
    busca.current?.focus();
  };

  return (
    <div className="sl-gl">
      <div className="sl-gl-ferramentas">
        <div className="sl-gl-busca">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            ref={busca}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar termo, sigla ou assunto"
            aria-label="Buscar no glossário"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
          />
          {q ? (
            <button type="button" className="sl-gl-limpar" onClick={() => setQ("")} aria-label="Limpar a busca">
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="m2.5 2.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <kbd className="sl-gl-atalho" aria-hidden="true">
              /
            </kbd>
          )}
        </div>

        <div className="sl-gl-chips" role="group" aria-label="Filtrar por categoria">
          <button type="button" className="sl-gl-chip" aria-pressed={cat === null} onClick={() => setCat(null)}>
            Todas <span>{itens.length}</span>
          </button>
          {categorias.map((c) => (
            <button
              type="button"
              key={c}
              className="sl-gl-chip"
              aria-pressed={cat === c}
              onClick={() => setCat(cat === c ? null : c)}
            >
              {c} <span>{contagem.get(c) ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Só o A a Z fica preso sob o topo ao rolar: a busca e as categorias, presas também, comeriam
          um terço da tela. */}
      <nav className="sl-gl-az" aria-label="Índice de A a Z">
        {LETRAS.map((l) =>
          presentes.has(l) ? (
            <a key={l} href={`#letra-${l === "#" ? "num" : l.toLowerCase()}`}>
              {l}
            </a>
          ) : (
            <span key={l} aria-hidden="true">
              {l}
            </span>
          ),
        )}
      </nav>

      <p className="sl-gl-conta" aria-live="polite">
        {visiveis.length === itens.length
          ? `${itens.length} verbetes`
          : `${visiveis.length} de ${itens.length} verbetes${cat ? ` em ${cat}` : ""}${k ? ` para "${q.trim()}"` : ""}`}
      </p>

      {grupos.length === 0 ? (
        <div className="sl-gl-vazio">
          <p>
            Nada encontrado{k ? <> para <b>&ldquo;{q.trim()}&rdquo;</b></> : null}
            {cat ? <> em {cat}</> : null}. Tente outra grafia, a sigla ou um assunto mais amplo.
          </p>
          <button type="button" className="sl-btn sl-btn-linha" onClick={limpar}>
            Limpar a busca
          </button>
        </div>
      ) : (
        grupos.map((g) => {
          const id = `letra-${g.letra === "#" ? "num" : g.letra.toLowerCase()}`;
          return (
            <section key={g.letra} className="sl-gl-grupo" id={id} aria-labelledby={`${id}-t`}>
              <h2 className="sl-gl-letra" id={`${id}-t`}>
                {g.letra}
              </h2>
              <ul className="sl-gl-lista">
                {g.itens.map(({ v }) => (
                  <li key={v.slug}>
                    <Link className="sl-gl-item" href={urlDoVerbete(v.slug)} prefetch={false}>
                      <span className="sl-gl-item-cabeca">
                        <span className="sl-gl-item-termo">
                          <Realce texto={v.termo} k={k} />
                        </span>
                        {v.sigla && (
                          <span className="sl-gl-sigla">
                            <Realce texto={v.sigla} k={k} />
                          </span>
                        )}
                      </span>
                      <span className="sl-gl-item-corpo">
                        <span className="sl-eyebrow">{v.categoria}</span>
                        <span className="sl-gl-item-resumo">{colarNumeros(v.resumo)}</span>
                      </span>
                      <svg className="sl-gl-seta" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}

/** Marca o trecho que casou com a busca, ignorando acento e caixa (a dobra preserva as posições). */
function Realce({ texto, k }: { texto: string; k: string }) {
  if (!k) return <>{texto}</>;
  const i = dobrar(texto).indexOf(k);
  if (i < 0) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <mark>{texto.slice(i, i + k.length)}</mark>
      {texto.slice(i + k.length)}
    </>
  );
}

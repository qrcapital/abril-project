"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { COR_DA_LINHA, ERAS, eraDe, urlDoVerbete, type CategoriaLinha } from "@/lib/glossario";

import { semMovimento } from "../Entrada";

export type ItemLinha = {
  slug: string;
  ano: number;
  data?: string;
  categoria: CategoriaLinha;
  titulo: string;
  resumo: string;
  texto: string[];
  verbetes: { slug: string; termo: string }[];
  /** Posições, na lista, dos marcos que levaram a este. Sempre menores que a dele. */
  antecedentes: number[];
  aula: { href: string; rotulo: string } | null;
  fonte?: string;
};

/** Quantos marcos a home mostra antes do "Ver a linha do tempo inteira". */
const LIMITE = 12;

type Luz = { i: number; linhagem: Set<number>; arcos: { d: string; cor: string }[] };

/**
 * O cliente da linha do tempo da home (07/out/2026). Ver `LinhaDoTempoHome.tsx` para o porquê.
 *
 * A LINHAGEM. Ao parar o mouse num marco (ou focá-lo pelo teclado), a linha calcula o fecho dos
 * antecedentes dele (os que levaram a ele, os que levaram a esses, e assim por diante), pinta os
 * pontos dessa cadeia, desenha um arco entre cada par ligado e esmaece o resto. O mesmo acende na
 * régua de anos, no alto. A medida dos pontos é feita no próprio evento, e não num efeito: o
 * desenho só depende de onde os pontos estão naquele instante.
 *
 * A HOME NÃO PODE VIRAR UMA PAREDE. São perto de 90 marcos: a lista abre com os primeiros
 * `LIMITE` e um botão para o resto; a régua mostra a linha inteira de uma vez, e um clique num ponto
 * dela abre a lista naquele marco. Os antecedentes vêm sempre antes, então a linhagem de um marco
 * visível nunca depende de um marco escondido. Com uma categoria escolhida, a lista mostra só os
 * marcos dela, todos; os antecedentes de outras categorias continuam nos chips de "Origens".
 *
 * NO CELULAR a lista vira o fio à esquerda, sem arcos e sem régua (não há mouse para acender); o
 * toque abre o marco.
 */
export default function LinhaViva({ itens, categorias }: { itens: ItemLinha[]; categorias: CategoriaLinha[] }) {
  const [filtro, setFiltro] = useState<CategoriaLinha | null>(null);
  const [inteira, setInteira] = useState(false);
  const [abertos, setAbertos] = useState<Set<number>>(() => new Set());
  const [luz, setLuz] = useState<Luz | null>(null);
  const corpo = useRef<HTMLDivElement>(null);
  const pontos = useRef<(HTMLSpanElement | null)[]>([]);
  const botoes = useRef<(HTMLButtonElement | null)[]>([]);

  const visivel = useCallback(
    (i: number) => (filtro ? itens[i].categoria === filtro : inteira || i < LIMITE),
    [filtro, inteira, itens],
  );

  const linhagem = useCallback(
    (i: number) => {
      const vistos = new Set<number>();
      const pilha = [i];
      while (pilha.length) {
        const x = pilha.pop()!;
        if (vistos.has(x)) continue;
        vistos.add(x);
        for (const p of itens[x].antecedentes) pilha.push(p);
      }
      return vistos;
    },
    [itens],
  );

  const acender = useCallback(
    (i: number | null) => {
      if (i === null) return setLuz(null);
      const lin = linhagem(i);
      const arcos: Luz["arcos"] = [];
      const c = corpo.current;
      if (c) {
        const base = c.getBoundingClientRect();
        const centro = (k: number) => {
          const el = pontos.current[k];
          if (!el || el.offsetParent === null) return null;
          const r = el.getBoundingClientRect();
          return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
        };
        for (const x of lin)
          for (const p of itens[x].antecedentes) {
            if (!lin.has(p)) continue;
            const a = centro(x);
            const b = centro(p);
            if (!a || !b) continue;
            const dy = Math.abs(a.y - b.y);
            const bojo = Math.min(76, 18 + dy * 0.05);
            arcos.push({
              d: `M ${a.x} ${a.y} Q ${a.x - bojo} ${(a.y + b.y) / 2} ${b.x} ${b.y}`,
              cor: COR_DA_LINHA[itens[x].categoria],
            });
          }
      }
      setLuz({ i, linhagem: lin, arcos });
    },
    [itens, linhagem],
  );

  const alternar = (i: number) => {
    setAbertos((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
    // Abrir um marco empurra os de baixo: com a linhagem acesa, os arcos são medidos de novo depois
    // da pintura.
    if (luz) {
      const aceso = luz.i;
      requestAnimationFrame(() => acender(aceso));
    }
  };

  /** Leva a lista até um marco: abre a lista se ele estiver escondido, abre o marco e foca. */
  const irPara = useCallback(
    (i: number) => {
      if (filtro && itens[i].categoria !== filtro) setFiltro(null);
      if (i >= LIMITE) setInteira(true);
      setAbertos((s) => new Set(s).add(i));
      setLuz(null);
      requestAnimationFrame(() => {
        const b = botoes.current[i];
        if (!b) return;
        b.closest("li")?.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "center" });
        b.focus({ preventScroll: true });
      });
    },
    [filtro, itens],
  );

  // `/app#marco-<slug>` (o link de um verbete para o marco): abre a lista naquele marco. Vale na
  // chegada e numa troca de âncora com a home já aberta. O `irPara` vai por ref para o efeito rodar
  // uma vez só: com ele na lista de dependências, cada troca de filtro pularia de novo para o marco
  // da âncora.
  const irParaRef = useRef(irPara);
  useEffect(() => {
    irParaRef.current = irPara;
  }, [irPara]);
  useEffect(() => {
    const peloHash = () => {
      const m = /^#marco-(.+)$/.exec(window.location.hash);
      if (!m) return;
      const i = itens.findIndex((x) => x.slug === decodeURIComponent(m[1]));
      if (i >= 0) irParaRef.current(i);
    };
    const t = window.setTimeout(peloHash, 60);
    window.addEventListener("hashchange", peloHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", peloHash);
    };
  }, [itens]);

  const contagem = useMemo(() => {
    const m = new Map<string, number>();
    for (const x of itens) m.set(x.categoria, (m.get(x.categoria) ?? 0) + 1);
    return m;
  }, [itens]);

  const porEra = useMemo(() => {
    const g = ERAS.map((era) => ({ era, idx: [] as number[] }));
    itens.forEach((x, i) => g[Math.max(0, eraDe(x.ano))].idx.push(i));
    return g.filter((x) => x.idx.length > 0);
  }, [itens]);

  const escondidos = filtro ? 0 : inteira ? 0 : Math.max(0, itens.length - LIMITE);
  const primeiro = itens[0]?.ano;
  const ultimo = itens[itens.length - 1]?.ano;

  return (
    <section className="sl-lt" aria-labelledby="lt-titulo">
      <header className="sl-lt-cabeca">
        <div>
          <p className="sl-eyebrow">Linha do tempo</p>
          <h2 className="sl-lt-titulo" id="lt-titulo">
            Como o dinheiro chegou até aqui
          </h2>
          <p className="sl-sub">
            {primeiro === ultimo ? `${primeiro}` : `De ${primeiro} a ${ultimo}`}: a história do dólar, as crises, a
            moeda do Brasil, os investimentos, a internet, a inteligência artificial e o cripto, num fio só. Cada marco
            leva ao verbete e à aula em que o assunto aparece.
          </p>
        </div>
        <p className="sl-lt-dica">
          Passe o mouse num marco para acender o caminho que levou até ele. Clique para abrir.
        </p>
      </header>

      <Regua itens={itens} luz={luz} acender={acender} irPara={irPara} filtro={filtro} />

      <div className="sl-lt-chips" role="group" aria-label="Filtrar a linha do tempo por assunto">
        <button type="button" className="sl-gl-chip" aria-pressed={filtro === null} onClick={() => setFiltro(null)}>
          Tudo <span>{itens.length}</span>
        </button>
        {categorias.map((c) => (
          <button
            type="button"
            key={c}
            className="sl-gl-chip sl-lt-chip"
            style={{ "--c": COR_DA_LINHA[c] } as React.CSSProperties}
            aria-pressed={filtro === c}
            onClick={() => {
              setLuz(null);
              setFiltro(filtro === c ? null : c);
            }}
          >
            <i aria-hidden="true" />
            {c} <span>{contagem.get(c) ?? 0}</span>
          </button>
        ))}
      </div>

      <div className={`sl-lt-corpo${luz ? " is-aceso" : ""}`} ref={corpo}>
        <svg className="sl-lt-arcos" aria-hidden="true">
          {luz?.arcos.map((a, k) => (
            <path key={`${luz.i}-${k}`} d={a.d} stroke={a.cor} pathLength={1} />
          ))}
        </svg>
        <span className="sl-lt-fio" aria-hidden="true" />

        {porEra.map(({ era, idx }) => {
          const daEra = idx.filter(visivel);
          if (daEra.length === 0) return null;
          return (
            <section className="sl-lt-era" key={era.faixa} aria-label={`${era.faixa}: ${era.nome}`}>
              <header className="sl-lt-era-cabeca" aria-hidden="true">
                <span className="sl-lt-era-faixa">{era.faixa}</span>
                <span className="sl-lt-era-nome">{era.nome}</span>
              </header>
              <ol className="sl-lt-lista">
                {daEra.map((i) => {
                  const x = itens[i];
                  const aberto = abertos.has(i);
                  const naLuz = luz?.linhagem.has(i) ?? false;
                  const cls = [
                    "sl-lt-marco",
                    aberto && "is-aberto",
                    luz && (naLuz ? "is-linhagem" : "is-apagado"),
                    luz?.i === i && "is-foco",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const painel = `marco-${x.slug}-painel`;
                  return (
                    <li
                      key={x.slug}
                      id={`marco-${x.slug}`}
                      className={cls}
                      style={{ "--c": COR_DA_LINHA[x.categoria] } as React.CSSProperties}
                      onPointerEnter={(e) => e.pointerType === "mouse" && acender(i)}
                      onPointerLeave={(e) => e.pointerType === "mouse" && acender(null)}
                      onFocus={(e) => {
                        if ((e.target as HTMLElement).matches(":focus-visible") && luz?.i !== i) acender(i);
                      }}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) acender(null);
                      }}
                      onClick={(e) => {
                        // O marco inteiro abre e fecha com o mouse; links e botões de dentro seguem o deles.
                        if ((e.target as Element).closest("a, button")) return;
                        if (window.getSelection()?.toString()) return;
                        alternar(i);
                      }}
                    >
                      <span className="sl-lt-ano">{x.ano}</span>
                      <span className="sl-lt-no" aria-hidden="true">
                        <span
                          className="sl-lt-ponto"
                          ref={(el) => {
                            pontos.current[i] = el;
                          }}
                        />
                      </span>
                      <div className="sl-lt-miolo">
                        <span className="sl-lt-cat">{x.categoria}</span>
                        <h3 className="sl-lt-marco-titulo">
                          <button
                            type="button"
                            ref={(el) => {
                              botoes.current[i] = el;
                            }}
                            aria-expanded={aberto}
                            aria-controls={painel}
                            onClick={() => alternar(i)}
                          >
                            <span className="sl-so-leitor">{x.ano}: </span>
                            {x.titulo}
                            <svg className="sl-lt-chev" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                              <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </h3>
                        <p className="sl-lt-resumo">{x.resumo}</p>

                        <div className="sl-lt-painel" id={painel} hidden={!aberto}>
                          {x.data && <p className="sl-lt-data">{x.data}</p>}
                          {x.texto.map((p, k) => (
                            <p key={k}>{p}</p>
                          ))}
                          {(x.verbetes.length > 0 || x.aula) && (
                            <div className="sl-lt-ir">
                              {x.verbetes.map((v) => (
                                <Link key={v.slug} className="sl-lt-verbete" href={urlDoVerbete(v.slug)} prefetch={false}>
                                  {v.termo}
                                </Link>
                              ))}
                              {x.aula && (
                                <Link className="sl-naaula" href={x.aula.href} prefetch={false}>
                                  <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                                    <path d="M3 1.8v8.4L10 6z" fill="currentColor" />
                                  </svg>
                                  Na aula: {x.aula.rotulo}
                                </Link>
                              )}
                            </div>
                          )}
                          {x.fonte && (
                            <p className="sl-origem">
                              <span>Fonte:</span> {x.fonte}
                            </p>
                          )}
                        </div>

                        {x.antecedentes.length > 0 && (
                          <div className="sl-lt-origens">
                            <span>Origens</span>
                            {x.antecedentes.map((p) => (
                              <button
                                type="button"
                                key={p}
                                className="sl-lt-origem"
                                style={{ "--c": COR_DA_LINHA[itens[p].categoria] } as React.CSSProperties}
                                onClick={() => irPara(p)}
                              >
                                <i aria-hidden="true" />
                                {itens[p].ano} · {itens[p].titulo}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>

      {escondidos > 0 && (
        <div className="sl-lt-mais">
          <button type="button" className="sl-btn sl-btn-linha" onClick={() => setInteira(true)}>
            Ver a linha do tempo inteira
            <span className="sl-lt-mais-n">mais {escondidos} marcos</span>
          </button>
        </div>
      )}
    </section>
  );
}

/**
 * A régua de anos (desktop): a linha inteira numa faixa só, um ponto por marco, na cor da categoria.
 * O eixo é por era, e não linear: cada era ganha largura pelo número de marcos (com um mínimo), e
 * dentro dela os anos correm em escala linear. Linear de ponta a ponta, os séculos antes de 1944
 * comeriam a régua e as décadas de 2008 em diante, as mais cheias, virariam um borrão.
 *
 * Os pontos não entram no Tab (seriam 90 paradas): quem usa teclado percorre a lista, que tem tudo.
 */
function Regua({
  itens,
  luz,
  acender,
  irPara,
  filtro,
}: {
  itens: ItemLinha[];
  luz: Luz | null;
  acender: (i: number | null) => void;
  irPara: (i: number) => void;
  filtro: CategoriaLinha | null;
}) {
  const desenho = useMemo(() => {
    const eras = ERAS.map((era, e) => ({ era, idx: itens.map((_, i) => i).filter((i) => eraDe(itens[i].ano) === e) })).filter(
      (x) => x.idx.length > 0,
    );
    const pesos = eras.map((x) => Math.max(4, x.idx.length));
    const total = pesos.reduce((a, b) => a + b, 0);
    const xs: number[] = [];
    const faixas: { ini: number; fim: number; rotulo: string }[] = [];
    let ini = 0;
    eras.forEach((x, k) => {
      const largura = (pesos[k] / total) * 100;
      const anos = x.idx.map((i) => itens[i].ano);
      const min = Math.min(...anos);
      const max = Math.max(...anos);
      const pad = largura * 0.1;
      for (const i of x.idx)
        xs[i] = ini + pad + (max === min ? (largura - 2 * pad) / 2 : ((itens[i].ano - min) / (max - min)) * (largura - 2 * pad));
      faixas.push({ ini, fim: ini + largura, rotulo: x.era.faixa });
      ini += largura;
    });
    // Pontos que cairiam um sobre o outro sobem uma camada (até quatro).
    const camadas: number[] = [];
    const ultimoNaCamada: number[] = [];
    itens.forEach((_, i) => {
      let c = 0;
      while (c < 3 && ultimoNaCamada[c] !== undefined && xs[i] - ultimoNaCamada[c] < 0.95) c++;
      camadas[i] = c;
      ultimoNaCamada[c] = xs[i];
    });
    return { xs, camadas, faixas };
  }, [itens]);

  const { xs, camadas, faixas } = desenho;
  const Y = 64; // linha de base, no viewBox de 1000 x 80
  const y = (i: number) => Y - camadas[i] * 9;

  return (
    <div className="sl-lt-regua" aria-hidden="true" onPointerLeave={() => acender(null)}>
      <svg className="sl-lt-regua-arcos" viewBox="0 0 1000 80" preserveAspectRatio="none">
        {luz &&
          [...luz.linhagem].flatMap((x) =>
            itens[x].antecedentes
              .filter((p) => luz.linhagem.has(p))
              .map((p) => {
                const a = xs[x] * 10;
                const b = xs[p] * 10;
                const h = Math.min(58, 10 + Math.abs(a - b) * 0.16);
                return (
                  <path
                    key={`${x}-${p}`}
                    d={`M ${a} ${y(x)} Q ${(a + b) / 2} ${Math.min(y(x), y(p)) - h} ${b} ${y(p)}`}
                    stroke={COR_DA_LINHA[itens[x].categoria]}
                    pathLength={1}
                  />
                );
              }),
          )}
      </svg>
      <span className="sl-lt-regua-base" />
      {faixas.map((f, k) => (
        <span key={f.rotulo} className="sl-lt-regua-faixa" style={{ left: `${f.ini}%`, width: `${f.fim - f.ini}%` }}>
          {k > 0 && <i />}
          <span>{f.rotulo}</span>
        </span>
      ))}
      {itens.map((x, i) => {
        const apagado = (luz && !luz.linhagem.has(i)) || (filtro && x.categoria !== filtro);
        return (
          <button
            type="button"
            tabIndex={-1}
            key={x.slug}
            className={`sl-lt-regua-ponto${apagado ? " is-apagado" : ""}${luz?.linhagem.has(i) ? " is-linhagem" : ""}`}
            style={
              {
                left: `${xs[i]}%`,
                top: `${(y(i) / 80) * 100}%`,
                "--c": COR_DA_LINHA[x.categoria],
              } as React.CSSProperties
            }
            onPointerEnter={(e) => e.pointerType === "mouse" && acender(i)}
            onClick={() => irPara(i)}
          >
            <span className="sl-lt-regua-dica">
              <b>{x.ano}</b> {x.titulo}
            </span>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { COR_DA_LINHA, ERAS, eraDe, urlDoVerbete, type CategoriaLinha } from "@/lib/glossario";

import { semMovimento } from "../Entrada";

export type ItemLinha = {
  slug: string;
  ano: number;
  /** O ano como o aluno lê ("1971", "600 a.C.", "séc. III"): `rotuloDoAno` de `lib/glossario.ts`. */
  rotulo: string;
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

/**
 * Quantos marcos a home mostra antes do "Ver a linha do tempo inteira". Eram 12; com a pré-história
 * do dinheiro no topo (08/out/2026, 12 marcos), viraram 16, para a lista recolhida ainda chegar ao
 * nascimento do dólar e aos primeiros marcos depois dele.
 */
const LIMITE = 16;

/** A folga, em ms, entre sair de um marco e apagar a linhagem. */
const ESPERA = 90;

/**
 * A pilha da régua: até `CAMADAS` pontos, um a cada `PASSO` px. Sete porque 2022 tem sete marcos; a
 * pilha mais alta ainda cabe acima da linha de base (64 px). `JUNTO` é a distância, em % da régua,
 * abaixo da qual dois pontos se encostariam e o segundo sobe uma camada.
 */
const CAMADAS = 7;
const PASSO = 9;
const JUNTO = 0.95;

/**
 * A era `porOrdem` (a pré-história do dinheiro) ganha um pouco mais de largura por marco: cada um
 * tem um lugar próprio na régua, sem empilhar, e o ponto precisa de folga dos vizinhos.
 */
const FOLGA_POR_ORDEM = 1.4;

/** Quantos antecedentes diretos a linhagem desenha, no máximo. */
const ARCOS = 3;

/**
 * O marco aceso. `origem` diz onde o mouse (ou o foco) está: só a lista desenha arcos e esmaece;
 * a régua só marca os pontos. Os arcos guardam as duas pontas para o degradê de cada um.
 */
type Luz = {
  i: number;
  origem: "lista" | "regua";
  linhagem: Set<number>;
  arcos: { d: string; a: { x: number; y: number }; b: { x: number; y: number } }[];
};

/**
 * O cliente da linha do tempo da home (07/out/2026). Ver `LinhaDoTempoHome.tsx` para o porquê.
 *
 * A LINHAGEM. Ao parar o mouse num marco (ou focá-lo pelo teclado), a linha desenha um arco até
 * cada antecedente DIRETO dele (um nível só, no máximo `ARCOS`) e esmaece de leve o resto. Até
 * 07/out/2026 ela seguia o fecho inteiro, recursivo, com arcos na cor de cada categoria e também
 * na régua; num marco de 2022 isso dava uma dúzia de linhas cruzando a tela, e o Marcelo pediu
 * para limpar (08/out/2026). Agora os arcos são de tinta, finos, baixos, só na lista, e mais
 * fortes perto do marco em foco do que perto da origem. A régua só marca os pontos da mesma
 * linhagem. A linhagem completa continua a um clique: os chips de "Origens" de cada marco levam ao
 * antecedente, que mostra os dele. A medida dos pontos é feita no próprio evento, e não num efeito:
 * o desenho só depende de onde os pontos estão naquele instante.
 *
 * SEM TREMOR. Sair de um marco não apaga na hora: o apagar espera `ESPERA` ms e é cancelado se o
 * mouse entra em outro marco nesse meio tempo. Assim, ao descer a lista (ou cruzar o cabeçalho de
 * uma era), a luz passa de um marco ao outro sem piscar o papel inteiro.
 *
 * A HOME NÃO PODE VIRAR UMA PAREDE. São mais de 100 marcos: a lista abre com os primeiros
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

  // O id do degradê vai dentro de um `url(#...)`: só letras, números, hífen e sublinhado.
  const gradiente = `lt-arco${useId().replace(/[^\w-]/g, "")}`;
  const timer = useRef<number | undefined>(undefined);

  /** O marco e os antecedentes diretos dele (na ordem do arquivo, no máximo `ARCOS`). */
  const diretos = useCallback((i: number) => itens[i].antecedentes.slice(0, ARCOS), [itens]);

  const acender = useCallback(
    (i: number | null, origem: Luz["origem"] = "lista") => {
      window.clearTimeout(timer.current);
      if (i === null) return setLuz(null);
      const ant = diretos(i);
      const arcos: Luz["arcos"] = [];
      const c = corpo.current;
      if (origem === "lista" && c) {
        const base = c.getBoundingClientRect();
        const centro = (k: number) => {
          const el = pontos.current[k];
          if (!el || el.offsetParent === null) return null;
          const r = el.getBoundingClientRect();
          return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
        };
        const a = centro(i);
        if (a)
          for (const p of ant) {
            const b = centro(p);
            if (!b) continue;
            // Um colchete suave para a esquerda do fio: as duas alças saem na horizontal, e o bojo
            // cresce devagar com a distância (no máximo uns 40 px), para o arco não invadir a calha.
            const k = Math.min(54, 16 + Math.abs(a.y - b.y) * 0.035);
            arcos.push({ d: `M ${a.x} ${a.y} C ${a.x - k} ${a.y} ${b.x - k} ${b.y} ${b.x} ${b.y}`, a, b });
          }
      }
      setLuz({ i, origem, linhagem: new Set([i, ...ant]), arcos });
    },
    [diretos],
  );

  /** Apaga com uma folga, cancelada se o mouse entra em outro marco antes (ver SEM TREMOR). */
  const apagar = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLuz(null), ESPERA);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const alternar = (i: number) => {
    setAbertos((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
    // Abrir um marco empurra os de baixo: com a linhagem acesa, os arcos são medidos de novo depois
    // da pintura.
    if (luz?.origem === "lista") {
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
  // Com a pré-história, a linha começa antes de qualquer ano que caiba num "De ... a ...".
  const periodo =
    primeiro === undefined
      ? ""
      : primeiro < 0
        ? `Das conchas e do sal a ${ultimo}`
        : primeiro === ultimo
          ? `${primeiro}`
          : `De ${primeiro} a ${ultimo}`;

  return (
    <section className="sl-lt" aria-labelledby="lt-titulo">
      <header className="sl-lt-cabeca">
        <div>
          <p className="sl-eyebrow">Linha do tempo</p>
          <h2 className="sl-lt-titulo" id="lt-titulo">
            Como o dinheiro chegou até aqui
          </h2>
          <p className="sl-sub">
            {periodo}: a história do dinheiro e do dólar, as crises, a moeda do Brasil, os investimentos, a internet, a inteligência artificial e o cripto, num fio só. Cada marco
            leva ao verbete e à aula em que o assunto aparece.
          </p>
        </div>
        <p className="sl-lt-dica">
          Passe o mouse num marco para ver o que levou a ele. Clique para abrir.
        </p>
      </header>

      <Regua itens={itens} luz={luz} acender={acender} apagar={apagar} irPara={irPara} filtro={filtro} />

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
            {c} <span>{contagem.get(c) ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="sl-lt-corpo" ref={corpo}>
        <svg className="sl-lt-arcos" aria-hidden="true">
          {/* Cada arco é um degradê de tinta: mais firme no marco em foco, quase some na origem. */}
          <defs>
            {luz?.arcos.map((a, k) => (
              <linearGradient
                key={`${luz.i}-${k}`}
                id={`${gradiente}-${k}`}
                gradientUnits="userSpaceOnUse"
                x1={a.a.x}
                y1={a.a.y}
                x2={a.b.x}
                y2={a.b.y}
              >
                <stop offset="0" stopOpacity=".5" />
                <stop offset="1" stopOpacity=".2" />
              </linearGradient>
            ))}
          </defs>
          {luz?.arcos.map((a, k) => (
            <path key={`${luz.i}-${k}`} d={a.d} stroke={`url(#${gradiente}-${k})`} pathLength={1} />
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
                  // A régua acesa não mexe na lista: só o marco da própria lista esmaece o resto.
                  const daLista = luz?.origem === "lista" ? luz : null;
                  const cls = [
                    "sl-lt-marco",
                    aberto && "is-aberto",
                    daLista && (daLista.linhagem.has(i) ? "is-linhagem" : "is-apagado"),
                    daLista?.i === i && "is-foco",
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
                      onPointerLeave={(e) => e.pointerType === "mouse" && apagar()}
                      onFocus={(e) => {
                        if ((e.target as HTMLElement).matches(":focus-visible") && luz?.i !== i) acender(i);
                      }}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) apagar();
                      }}
                      onClick={(e) => {
                        // O marco inteiro abre e fecha com o mouse; links e botões de dentro seguem o deles.
                        if ((e.target as Element).closest("a, button")) return;
                        if (window.getSelection()?.toString()) return;
                        alternar(i);
                      }}
                    >
                      <AnoDoMarco rotulo={x.rotulo} />
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
                            <span className="sl-so-leitor">{x.rotulo}: </span>
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
                                {itens[p].rotulo} · {itens[p].titulo}
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
 * O ano na coluna da lista. "600 a.C." vira o número no corpo do ano e o "a.C." miúdo embaixo, para
 * caber na coluna de 76 px sem diminuir o número; rótulo de texto ("séc. III", "Antes da moeda")
 * desce um corpo e quebra em duas linhas se precisar (08/out/2026).
 */
function AnoDoMarco({ rotulo }: { rotulo: string }) {
  const ac = /^(\d+) a\.C\.$/.exec(rotulo);
  if (ac)
    return (
      <span className="sl-lt-ano">
        {ac[1]}
        <small> a.C.</small>
      </span>
    );
  return <span className={/^\d+$/.test(rotulo) ? "sl-lt-ano" : "sl-lt-ano is-texto"}>{rotulo}</span>;
}

/**
 * A régua de anos (desktop): a linha inteira numa faixa só, um ponto por marco, na cor da categoria.
 * O eixo é por era, e não linear: cada era ganha largura pelo número de marcos (com um mínimo), e
 * dentro dela os anos correm em escala linear. Linear de ponta a ponta, os séculos antes de 1944
 * comeriam a régua e as décadas de 2008 em diante, as mais cheias, virariam um borrão. Marcos que
 * cairiam no mesmo lugar empilham pontos, e a pilha lê como densidade.
 *
 * A PRÉ-HISTÓRIA (08/out/2026). A era que vai de antes de 3000 a.C. a 1791 é `porOrdem`: lá dentro,
 * os marcos ficam a intervalos iguais, na ordem do tempo, e não pela distância em anos. Em escala de
 * anos, 4.800 anos com uma dúzia de marcos deixariam a Antiguidade solta à esquerda e espremeriam
 * Potosí, a quebra da Espanha e o peso de 1571 num ponto só. A faixa da era ganha `FOLGA_POR_ORDEM`
 * por marco, e o rótulo "Antes de 1792" avisa que ali o eixo é outro.
 *
 * OS PONTOS VOLTARAM (08/out/2026). Na mesma manhã a régua tinha trocado os pontos por traços de
 * tinta neutra; o Marcelo pediu os pontos de volta, só aqui ("na linha do tempo horizontal lá em
 * cima, com as datas, estava legal"). Os chips continuam sem bolinha, a lista com os anéis vazados e
 * a linhagem de um nível, desenhada só na lista. Na régua, a linhagem acesa ganha um anel e o resto
 * esmaece; com uma categoria escolhida, esmaecem os pontos das outras.
 *
 * Os pontos não entram no Tab (seriam mais de 100 paradas): quem usa teclado percorre a lista, que
 * tem tudo.
 */
function Regua({
  itens,
  luz,
  acender,
  apagar,
  irPara,
  filtro,
}: {
  itens: ItemLinha[];
  luz: Luz | null;
  acender: (i: number | null, origem?: Luz["origem"]) => void;
  apagar: () => void;
  irPara: (i: number) => void;
  filtro: CategoriaLinha | null;
}) {
  const desenho = useMemo(() => {
    const eras = ERAS.map((era, e) => ({ era, idx: itens.map((_, i) => i).filter((i) => eraDe(itens[i].ano) === e) })).filter(
      (x) => x.idx.length > 0,
    );
    const pesos = eras.map((x) => (x.era.porOrdem ? x.idx.length * FOLGA_POR_ORDEM : Math.max(4, x.idx.length)));
    const total = pesos.reduce((a, b) => a + b, 0);
    const xs: number[] = [];
    const faixas: { ini: number; fim: number; rotulo: string }[] = [];
    let ini = 0;
    eras.forEach((x, k) => {
      const largura = (pesos[k] / total) * 100;
      const pad = largura * 0.1;
      const util = largura - 2 * pad;
      if (x.era.porOrdem) {
        // Um lugar por ano distinto, na ordem: dois marcos do mesmo ano dividem o lugar e empilham.
        const anos = [...new Set(x.idx.map((i) => itens[i].ano))].sort((a, b) => a - b);
        for (const i of x.idx) {
          const r = anos.indexOf(itens[i].ano);
          xs[i] = ini + pad + (anos.length === 1 ? util / 2 : (r / (anos.length - 1)) * util);
        }
      } else {
        const anos = x.idx.map((i) => itens[i].ano);
        const min = Math.min(...anos);
        const max = Math.max(...anos);
        for (const i of x.idx) xs[i] = ini + pad + (max === min ? util / 2 : ((itens[i].ano - min) / (max - min)) * util);
      }
      faixas.push({ ini, fim: ini + largura, rotulo: x.era.faixa });
      ini += largura;
    });
    // Pontos que se encostariam sobem uma camada (até `CAMADAS`).
    const camadas: number[] = [];
    const ultimoNaCamada: number[] = [];
    itens.forEach((_, i) => {
      let c = 0;
      while (c < CAMADAS - 1 && ultimoNaCamada[c] !== undefined && xs[i] - ultimoNaCamada[c] < JUNTO) c++;
      camadas[i] = c;
      ultimoNaCamada[c] = xs[i];
    });
    return { xs, camadas, faixas };
  }, [itens]);

  const { xs, camadas, faixas } = desenho;

  return (
    <div className="sl-lt-regua" aria-hidden="true" onPointerLeave={apagar}>
      <span className="sl-lt-regua-base" />
      {faixas.map((f, k) => (
        <span key={f.rotulo} className="sl-lt-regua-faixa" style={{ left: `${f.ini}%`, width: `${f.fim - f.ini}%` }}>
          {k > 0 && <i />}
          <span>{f.rotulo}</span>
        </span>
      ))}
      <div className="sl-lt-regua-pontos">
        {itens.map((x, i) => {
          const naLuz = luz?.linhagem.has(i) ?? false;
          const apagado = luz ? !naLuz : filtro !== null && filtro !== x.categoria;
          const cls = [
            "sl-lt-regua-ponto",
            naLuz && luz?.i !== i && "is-linhagem",
            luz?.i === i && "is-foco",
            apagado && "is-apagado",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              type="button"
              tabIndex={-1}
              key={x.slug}
              className={cls}
              style={
                {
                  left: `${xs[i]}%`,
                  bottom: `${camadas[i] * PASSO}px`,
                  "--c": COR_DA_LINHA[x.categoria],
                } as React.CSSProperties
              }
              onPointerEnter={(e) => e.pointerType === "mouse" && acender(i, "regua")}
              onPointerLeave={(e) => e.pointerType === "mouse" && apagar()}
              onClick={() => irPara(i)}
            >
              <span className="sl-lt-regua-dica">
                <b>{x.rotulo}</b> {x.titulo}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

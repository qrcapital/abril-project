import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GLOSSARIO, verbete } from "@/content/glossario";
import { LINHA_DO_TEMPO } from "@/content/linha-do-tempo";
import { getCurriculo } from "@/lib/curriculo";
import { hrefNoCurso, rotuloDoAno, rotuloNoCurso, slugificar, urlDoVerbete } from "@/lib/glossario";
import { colarNumeros } from "@/lib/notebook";
import Balao from "@/app/app/_ui/sala/glossario/Balao";
import { criarLigador } from "@/app/app/_ui/sala/glossario/texto";

type Params = { params: Promise<{ slug: string }> };

// Os slugs saem do conteúdo, que é estático. A guarda do layout `(sala)` lê a sessão, então a
// renderização é por requisição de qualquer jeito; a lista serve para o build conferir cada verbete
// e para o Next conhecer as rotas.
export function generateStaticParams() {
  return GLOSSARIO.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const v = verbete(slug);
  return { title: v ? `${v.termo} · Glossário` : "Glossário" };
}

/**
 * A página de um verbete (07/out/2026): o termo, o texto com os outros termos citados virando link
 * (como o `linkifyDef` do site da QR Asset, aqui para o glossário inteiro), o exemplo, a prática,
 * onde o assunto aparece no curso, os marcos da linha do tempo que citam o verbete, os relacionados
 * e os vizinhos em ordem alfabética.
 *
 * O título da aula em "Onde aparece no curso" vem do banco (o admin edita), pelo mesmo
 * `getCurriculo()` das outras telas. Se o banco falhar, a página sai com o rótulo "Módulo II · Aula
 * 03", sem o título: o glossário não depende da consulta para existir.
 */
export default async function VerbetePage({ params }: Params) {
  const { slug } = await params;
  const v = verbete(slug);
  if (!v) notFound();

  const i = GLOSSARIO.findIndex((x) => x.slug === v.slug);
  const anterior = i > 0 ? GLOSSARIO[i - 1] : null;
  const seguinte = i < GLOSSARIO.length - 1 ? GLOSSARIO[i + 1] : null;

  const relacionados = (v.relacionados ?? [])
    .map((s) => verbete(s))
    .filter((x): x is NonNullable<typeof x> => x !== null && x.slug !== v.slug);
  const marcos = LINHA_DO_TEMPO.filter((m) => m.verbetes?.includes(v.slug)).sort((a, b) => a.ano - b.ano);

  const curriculo = v.noCurso?.length ? await getCurriculo().catch(() => null) : null;
  const tituloDaAula = (m: number, pos: number) =>
    curriculo?.aulas.find((a) => a.modulo === m && a.pos === pos)?.titulo ?? null;

  // Um ligador para a página inteira: cada termo vira link uma vez, e o próprio verbete nunca.
  const ligar = criarLigador(v.slug);

  return (
    <div className="sl">
      <div className="sl-wrap">
        <nav className="sl-migalha-claro sl-vb-migalha" aria-label="Você está em">
          <Link href="/app/glossario">Glossário</Link>
          <span aria-hidden="true"> / </span>
          <Link href={`/app/glossario?cat=${slugificar(v.categoria)}`}>{v.categoria}</Link>
        </nav>

        <header className="sl-vb-cabeca">
          <p className="sl-eyebrow">{v.categoria}</p>
          <h1 className="sl-vb-termo">
            {v.termo}
            {v.sigla && v.sigla !== v.termo && (
              <span className="sl-vb-sigla">
                <span className="sl-so-leitor">, sigla </span>
                {v.sigla}
              </span>
            )}
          </h1>
          <p className="sl-vb-resumo">{colarNumeros(v.resumo)}</p>
        </header>

        <Balao className="sl-vb-grade">
          <article className="sl-vb-texto">
            <div className="sl-prosa">
              {v.texto.map((p, k) => (
                <p key={k}>{ligar(p)}</p>
              ))}
            </div>
            {v.secoes?.map((sec, i) => (
              <section key={i} className="sl-vb-secao">
                <h2>{sec.titulo}</h2>
                <div className="sl-prosa">
                  {sec.paragrafos.map((p, k) => (
                    <p key={k}>{ligar(p)}</p>
                  ))}
                </div>
              </section>
            ))}
            {v.exemplo && (
              <aside className="sl-vb-exemplo" aria-label="Exemplo">
                <p className="sl-eyebrow">Exemplo</p>
                <p>{ligar(v.exemplo)}</p>
              </aside>
            )}
            {v.naPratica && (
              <aside className="sl-vb-pratica" aria-label="Na prática">
                <p className="sl-eyebrow">Na prática</p>
                <p>{ligar(v.naPratica)}</p>
              </aside>
            )}
          </article>

          {(v.noCurso?.length || marcos.length > 0) && (
            <aside className="sl-vb-lado">
              {v.noCurso?.length ? (
                <section className="sl-vb-bloco" aria-labelledby="vb-curso">
                  <h2 className="sl-eyebrow" id="vb-curso">
                    Onde aparece no curso
                  </h2>
                  <ul className="sl-vb-links">
                    {v.noCurso.map((n) => {
                      const titulo = tituloDaAula(n.modulo, n.aula);
                      return (
                        <li key={`${n.modulo}-${n.aula}-${n.tempo ?? ""}`}>
                          <Link href={hrefNoCurso(n)} prefetch={false}>
                            <span className="sl-vb-links-rotulo">{rotuloNoCurso(n)}</span>
                            {titulo && <span className="sl-vb-links-titulo">{titulo}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ) : null}
              {marcos.length > 0 && (
                <section className="sl-vb-bloco" aria-labelledby="vb-marcos">
                  <h2 className="sl-eyebrow" id="vb-marcos">
                    Na linha do tempo
                  </h2>
                  <ul className="sl-vb-links">
                    {marcos.map((m) => (
                      <li key={m.slug}>
                        <Link href={`/app#marco-${m.slug}`} prefetch={false}>
                          <span className="sl-vb-links-rotulo">{rotuloDoAno(m)}</span>
                          <span className="sl-vb-links-titulo">{m.titulo}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>
          )}
        </Balao>

        {relacionados.length > 0 && (
          <section className="sl-vb-rel" aria-labelledby="vb-rel">
            <h2 className="sl-eyebrow" id="vb-rel">
              Relacionados
            </h2>
            <ul className="sl-vb-rel-grade">
              {relacionados.map((r) => (
                <li key={r.slug}>
                  <Link className="sl-vb-card" href={urlDoVerbete(r.slug)} prefetch={false}>
                    <span className="sl-eyebrow">{r.categoria}</span>
                    <span className="sl-vb-card-termo">
                      {r.termo}
                      {r.sigla && r.sigla !== r.termo && <span className="sl-gl-sigla">{r.sigla}</span>}
                    </span>
                    <span className="sl-vb-card-resumo">{colarNumeros(r.resumo)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="sl-vb-nav" aria-label="Verbetes vizinhos">
          {anterior ? (
            <Link className="sl-vb-nav-ir is-antes" href={urlDoVerbete(anterior.slug)} prefetch={false}>
              <span className="sl-eyebrow">Anterior</span>
              <span>{anterior.termo}</span>
            </Link>
          ) : (
            <span />
          )}
          <Link className="sl-btn sl-btn-linha" href="/app/glossario">
            Todos os verbetes
          </Link>
          {seguinte ? (
            <Link className="sl-vb-nav-ir is-depois" href={urlDoVerbete(seguinte.slug)} prefetch={false}>
              <span className="sl-eyebrow">Seguinte</span>
              <span>{seguinte.termo}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}

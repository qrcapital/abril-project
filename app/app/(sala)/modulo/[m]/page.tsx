import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCalendario } from "@/lib/calendario";
import { getCurriculo } from "@/lib/curriculo";
import { ROMANO, href, rotuloModulo } from "@/lib/curso";
import { getConcluidas } from "@/lib/progresso";
import { notebookDoModulo } from "@/content/notebooks";
import AvisoTravado from "@/app/app/_ui/sala/Aviso";
import CartaoDocente from "@/app/app/_ui/sala/CartaoDocente";
import Trilha from "@/app/app/_ui/sala/Trilha";
import { estadoDoModulo } from "@/app/app/_ui/sala/estado";

export async function generateMetadata({ params }: { params: Promise<{ m: string }> }): Promise<Metadata> {
  const { m } = await params;
  const ord = Number(m);
  return { title: Number.isInteger(ord) && ord >= 0 ? rotuloModulo(ord) : "Módulo" };
}

/**
 * A página de um módulo: cabeça com número, título, docente e progresso; a lista de aulas; o
 * notebook; e a trilha. Até 29/set a home levava direto à primeira aula e não havia onde ver o
 * módulo inteiro, nem o que faltava nele.
 *
 * MÓDULO FECHADO MOSTRA A PÁGINA, sem link nas aulas, com a data de abertura. A guarda da aula
 * continua sendo a da rota da aula; aqui não há o que proteger (os títulos são os da LP), e ver o
 * que vem é o que faz o aluno esperar em vez de desistir.
 */
export default async function ModuloPage({ params }: { params: Promise<{ m: string }> }) {
  const { m } = await params;
  const ord = Number(m);
  const [curriculo, calendario, concluidas] = await Promise.all([getCurriculo(), getCalendario(), getConcluidas()]);
  const mod = curriculo.modulos.find((x) => x.idx === ord);
  if (!Number.isInteger(ord) || !mod) notFound();
  // O Módulo 0 é o "Comece por aqui": uma página só para ele, não duas.
  if (ord === 0) redirect("/app/comece");

  const cal = calendario?.modulos.find((x) => x.ord === ord);
  const aberto = cal?.aberto ?? false;
  const aulas = curriculo.aulas.filter((a) => a.modulo === ord);
  const feitas = aulas.filter((a) => concluidas.has(a.n)).length;
  const pct = aulas.length ? Math.round((feitas / aulas.length) * 100) : 0;
  const proxima = aulas.find((a) => !concluidas.has(a.n));
  const nb = notebookDoModulo(ord);

  return (
    <div className="sl">
      <header className="sl-cabeca sl-escuro">
        <div className="sl-hero-globo" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- arte decorativa em SVG */}
          <img src="/marca/globo-dourado.svg" alt="" />
        </div>
        <div className="sl-wrap">
          <nav className="sl-migalha" aria-label="Você está em" style={{ paddingTop: 22, position: "relative", zIndex: 2 }}>
            <Link href="/app">Início</Link> <span aria-hidden="true">›</span> {mod.label}
          </nav>
          <div className="sl-cabeca-miolo">
            <span className="sl-numeral" aria-hidden="true">
              {ROMANO[ord] ?? ord}
            </span>
            <div>
              <span className="sl-eyebrow">{mod.label}</span>
              <h1>{mod.titulo}</h1>
              <div style={{ marginTop: 20 }}>
                <CartaoDocente nome={mod.docente} />
              </div>
            </div>
            <div className="sl-cabeca-lateral">
              {aberto ? (
                <div className="sl-progresso">
                  <div className="sl-progresso-linha">
                    <span>Seu progresso no módulo</span>
                    <b>{pct}%</b>
                  </div>
                  <div className="sl-barra" aria-hidden="true">
                    <i style={{ width: `${pct}%` }} />
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(253,250,245,.78)" }}>
                    {feitas} de {aulas.length} {aulas.length === 1 ? "aula concluída" : "aulas concluídas"}
                  </span>
                </div>
              ) : (
                <span className="sl-chip sl-chip-trava" style={{ alignSelf: "flex-start" }}>
                  {cal ? estadoDoModulo(cal).texto : "Em breve"}
                </span>
              )}
              {aberto && proxima && (
                <Link className="sl-btn sl-btn-claro" href={href(proxima)}>
                  {feitas === 0 ? "Começar o módulo" : "Continuar de onde parei"}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="sl-wrap">
        {!aberto && (
          <div style={{ marginTop: 40 }}>
            <AvisoTravado cal={cal} />
          </div>
        )}

        <div className="sl-modulo-grade">
          <section aria-labelledby="aulas-titulo">
            <h2 className="sl-h2" id="aulas-titulo" style={{ marginBottom: 20 }}>
              Aulas do módulo
            </h2>
            <ol className="sl-lista">
              {aulas.map((a, i) => {
                const feita = concluidas.has(a.n);
                const corpo = (
                  <>
                    <span className="sl-lista-num" aria-hidden="true">
                      {a.numero || String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>{a.titulo}</h3>
                      {a.descricao && <p>{a.descricao}</p>}
                    </div>
                    {feita ? (
                      <span className="sl-chip sl-chip-ok">Concluída</span>
                    ) : !aberto ? (
                      <span className="sl-chip sl-chip-trava">Fechada</span>
                    ) : a === proxima ? (
                      <span className="sl-chip">Próxima</span>
                    ) : (
                      <span />
                    )}
                  </>
                );
                return (
                  <li key={a.id}>
                    {aberto ? (
                      <Link className="sl-lista-item" href={href(a)}>
                        {corpo}
                      </Link>
                    ) : (
                      <div className="sl-lista-item is-travado">{corpo}</div>
                    )}
                  </li>
                );
              })}
            </ol>
            {!aulas.length && <p className="sl-vazio">As aulas deste módulo ainda não foram publicadas.</p>}
          </section>

          <aside aria-label="Notebook do módulo">
            <div className="sl-cartao sl-cartao-nb sl-escuro">
              <span className="sl-cartao-rotulo">Notebook do módulo</span>
              <h2>{nb ? nb.titulo : "Em preparação"}</h2>
              <p>
                {nb
                  ? nb.subtitulo
                  : "Os gráficos e textos deste módulo entram aqui quando o conteúdo for publicado."}
              </p>
              {nb && aberto && (
                <Link className="sl-btn sl-btn-claro" href={`/app/modulo/${ord}/notebook`}>
                  Abrir o notebook
                </Link>
              )}
              {nb && !aberto && <p>O notebook abre junto com o módulo.</p>}
            </div>
          </aside>
        </div>

        {calendario && (
          <section className="sl-secao" aria-labelledby="trilha-titulo">
            <div className="sl-secao-cabeca">
              <h2 className="sl-h2" id="trilha-titulo">
                A trilha completa
              </h2>
            </div>
            <Trilha modulos={calendario.modulos} />
          </section>
        )}
      </div>
    </div>
  );
}

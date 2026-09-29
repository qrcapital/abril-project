import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import AulaClient from "./AulaClient";
import { getCurriculo } from "@/lib/curriculo";
import { href, rotuloModulo } from "@/lib/curso";
import { getConcluidas } from "@/lib/progresso";
import { getMateriais } from "@/lib/materiais";
import { getCalendario } from "@/lib/calendario";
import { fonteDoVideo } from "@/lib/video";
import { notebookDoModulo } from "@/content/notebooks";
import CartaoDocente from "@/app/app/_ui/sala/CartaoDocente";
import Player from "@/app/app/_ui/sala/Player";
import { hrefDoModulo, motivoDaTrava } from "@/app/app/_ui/sala/estado";

export const metadata: Metadata = { title: "Aula" };

/**
 * A aula, em modo teatro (29/set/2026): palco escuro com o player grande, título e navegação logo
 * abaixo dele, e o resto (docente, materiais, notebook, as aulas do módulo) no papel, depois.
 *
 * Era HTML portado (`screens/aula.html`) preenchido por substituição de texto em
 * `lib/aula-template.ts`. Virou JSX porque o redesenho trocaria quase toda âncora da substituição,
 * e cada âncora trocada era um lugar para o placeholder do design voltar à tela sem erro nenhum.
 */
export default async function AulaPage({ params }: { params: Promise<{ m: string; n: string }> }) {
  const { n } = await params;
  const curriculo = await getCurriculo();
  const found = curriculo.acharAula(Number(n));
  if (!found) notFound();
  const { aula, pos } = found;

  // Aula de módulo ainda fechado não abre. Sem esta guarda o gotejamento seria decorativo: as
  // aulas são alcançáveis pela URL, e bastaria digitar o endereço para pular a esteira. O
  // calendário já inclui o progresso, que a regra `apos_modulo` (0024) precisa.
  const calendario = await getCalendario();
  const aberto = calendario?.abertos.has(aula.modulo) ?? false;
  // Leva na URL QUAL módulo ele tentou, não a afirmação de que está travado: a home reconfere
  // no banco antes de dizer qualquer coisa. Sem esse parâmetro o aluno cairia na home sem
  // motivo nenhum e acharia que errou o clique.
  if (!aberto) redirect(`/app?travado=${aula.modulo}`);

  const [concluidas, materiais] = await Promise.all([getConcluidas(), getMateriais(aula.n)]);

  const mod = curriculo.modulos.find((x) => x.idx === aula.modulo);
  const doModulo = curriculo.aulas.filter((a) => a.modulo === aula.modulo);
  const posNoModulo = doModulo.findIndex((a) => a.n === aula.n);
  const anterior = curriculo.aulas[pos - 1];
  const proxima = curriculo.aulas[pos + 1];
  // A próxima aula pode ser de um módulo que ainda não abriu. Em vez de um botão que devolve para
  // a home, a tela já diz quando ele abre.
  const calProxima = proxima ? calendario?.modulos.find((x) => x.ord === proxima.modulo) : undefined;
  const proximaFechada = proxima !== undefined && !(calendario?.abertos.has(proxima.modulo) ?? false);

  const pct = curriculo.progressoPct(concluidas);
  const feitasGate = curriculo.totalAvaliadas - curriculo.aulasRestantes(concluidas);
  const nb = notebookDoModulo(aula.modulo);
  const concluida = concluidas.has(aula.n);
  const rotulo = mod?.label ?? rotuloModulo(aula.modulo);
  const eyebrow = aula.numero
    ? `${rotulo} · Aula ${aula.numero}`
    : `${rotulo} · Abertura ${posNoModulo + 1} de ${doModulo.length}`;
  const rotuloAula = (a: typeof aula) => (a.numero ? `Aula ${a.numero}` : "Abertura");

  return (
    <div className="sl">
      <section className="sl-palco sl-escuro" aria-labelledby="aula-titulo">
        <div className="sl-palco-player">
          <Player fonte={fonteDoVideo(aula.video)} titulo={aula.titulo} />
        </div>
        <div className="sl-palco-meta">
          <div>
            <nav className="sl-palco-migalha" aria-label="Você está em">
              <Link href="/app">Início</Link> <span aria-hidden="true">›</span>{" "}
              <Link href={hrefDoModulo(aula.modulo)}>
                {aula.modulo === 0 ? "Comece por aqui" : `${rotulo} · ${mod?.titulo ?? ""}`}
              </Link>
            </nav>
            <div style={{ marginTop: 16 }}>
              <span className="sl-eyebrow">{eyebrow}</span>
            </div>
            <h1 id="aula-titulo">{aula.titulo}</h1>
            {aula.descricao && <p className="sl-palco-desc">{aula.descricao}</p>}
          </div>
          <div className="sl-palco-acoes">
            {anterior ? (
              <Link className="sl-btn sl-btn-vidro" href={href(anterior)} aria-label={`Anterior: ${anterior.titulo}`}>
                ← {rotuloAula(anterior)}
              </Link>
            ) : null}
            <AulaClient key={`${aula.n}-${concluida}`} n={aula.n} concluida={concluida} />
            {!proxima ? (
              <Link className="sl-btn" href="/app">
                Concluir formação
              </Link>
            ) : proximaFechada ? (
              <span className="sl-palco-trava">
                Próxima: {rotuloModulo(proxima.modulo)}. {calProxima ? motivoDaTrava(calProxima) : "Em breve"}.
              </span>
            ) : (
              <Link className="sl-btn" href={href(proxima)} aria-label={`Próxima: ${proxima.titulo}`}>
                Próxima aula →
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="sl-wrap">
        <div className="sl-aula-grade">
          <div className="sl-aula-principal">
            {mod?.docente && (
              <section className="sl-cartao" aria-label="Quem conduz esta aula">
                <CartaoDocente nome={mod.docente} rotulo="Quem conduz" />
              </section>
            )}

            <section className="sl-cartao" aria-labelledby="materiais-titulo">
              <span className="sl-cartao-rotulo" id="materiais-titulo">
                Materiais desta aula
              </span>
              {materiais.length ? (
                <ul className="sl-materiais">
                  {materiais.map((m) => (
                    <li key={m.arquivo + m.titulo}>
                      <a href={m.arquivo} download>
                        <span className="sl-materiais-icone" aria-hidden="true">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7e6836" strokeWidth="1.6">
                            <rect x="5" y="3" width="14" height="18" rx="2" />
                            <path d="M9 8h6M9 12h6" />
                          </svg>
                        </span>
                        {m.titulo}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                // PRD §6: sem material, a seção diz "em breve", sem link quebrado.
                <p className="sl-vazio">Os materiais desta aula chegam em breve.</p>
              )}
            </section>

            {nb && (
              <section className="sl-cartao sl-cartao-nb sl-escuro" aria-labelledby="nb-titulo">
                <span className="sl-cartao-rotulo">Notebook do módulo</span>
                <h2 id="nb-titulo">{nb.titulo}</h2>
                <p>Gráficos, textos e simuladores tirados das aulas deste módulo.</p>
                <Link className="sl-btn sl-btn-claro" href={`/app/modulo/${aula.modulo}/notebook`}>
                  Ver no notebook
                </Link>
              </section>
            )}
          </div>

          <aside aria-label="Aulas do módulo e progresso">
            <section className="sl-cartao" aria-labelledby="neste-modulo">
              <span className="sl-cartao-rotulo">{rotulo}</span>
              <h2 id="neste-modulo">{aula.modulo === 0 ? "Comece por aqui" : mod?.titulo}</h2>
              <ol className="sl-modaulas" style={{ marginTop: 14 }}>
                {doModulo.map((a) => {
                  const atual = a.n === aula.n;
                  const feita = concluidas.has(a.n);
                  return (
                    <li key={a.id}>
                      <Link href={href(a)} aria-current={atual ? "page" : undefined}>
                        <span className={`sl-ponto${feita ? " is-feita" : atual ? " is-atual" : ""}`} aria-hidden="true" />
                        <span>
                          {a.numero ? `${a.numero} · ` : ""}
                          {a.titulo}
                          {feita && <span className="sl-so-leitor"> (concluída)</span>}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
            <section className="sl-cartao" aria-labelledby="progresso-titulo">
              <div className="sl-progresso">
                <div className="sl-progresso-linha">
                  <span className="sl-cartao-rotulo" id="progresso-titulo" style={{ margin: 0 }}>
                    Meu progresso
                  </span>
                  <b>{pct}%</b>
                </div>
                <div className="sl-barra" aria-hidden="true">
                  <i style={{ width: `${pct}%` }} />
                </div>
                <span style={{ fontSize: 12.5, color: "var(--sl-tinta-2)" }}>
                  {feitasGate} de {curriculo.totalAvaliadas} aulas concluídas
                </span>
              </div>
              <Link href="/app/comece#trilha" style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 600 }}>
                Ver a trilha completa
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

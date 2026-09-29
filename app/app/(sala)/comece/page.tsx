import type { Metadata } from "next";
import Link from "next/link";

import { getCalendario } from "@/lib/calendario";
import { getCurriculo } from "@/lib/curriculo";
import { href, rotuloModulo } from "@/lib/curso";
import { getConcluidas } from "@/lib/progresso";
import { MINUTOS, NOTA_MINIMA, TOTAL_QUESTOES } from "@/lib/prova-correcao";
import { getUsuario } from "@/lib/usuario";
import { fonteDoVideo } from "@/lib/video";
import { notebookDoModulo } from "@/content/notebooks";
import Grafico from "@/app/app/_ui/sala/Grafico";
import Player from "@/app/app/_ui/sala/Player";
import Trilha from "@/app/app/_ui/sala/Trilha";
import { motivoDaTrava } from "@/app/app/_ui/sala/estado";

export const metadata: Metadata = { title: "Comece por aqui" };

/**
 * "Comece por aqui": a porta do Módulo 0 e o destino de quem acaba de criar ou trocar a senha
 * (`RedefinirClient`). Pedido do dono em 29/set/2026: a primeira tela depois do acesso tem de
 * dizer, sem rodeio, onde o aluno está e o que vem depois.
 *
 * Ordem da página: o hero no painel vermelho, as aulas de abertura montadas sobre a borda dele,
 * como a formação funciona, a trilha com a data de cada módulo e a amostra do notebook.
 *
 * Mora dentro de `(sala)`, então a matrícula e o aceite dos termos já foram conferidos pelo layout.
 */
export default async function ComecePage() {
  const [user, curriculo, calendario, concluidas] = await Promise.all([
    getUsuario(),
    getCurriculo(),
    getCalendario(),
    getConcluidas(),
  ]);

  const primeiro = ((user?.user_metadata?.nome as string | undefined) ?? "").trim().split(/\s+/)[0] ?? "";
  const modulos = calendario?.modulos ?? [];
  const m0 = modulos.find((m) => m.ord === 0);
  // Sem calendário não há como afirmar que o Módulo 0 abriu, e o vídeo não entra: o id do Panda
  // sai do currículo lido com a service role, e a guarda de verdade é esta.
  const aberto = m0?.aberto ?? false;
  const abertura = curriculo.aulas.filter((a) => a.modulo === 0);
  // Sempre dois lugares: o dono editou duas aulas de abertura, e enquanto a segunda não estiver no
  // banco o lugar dela aparece como "em breve", em vez de o layout mudar de forma quando ela chegar.
  const vagas = Math.max(2, abertura.length);
  const numModulos = curriculo.modulos.filter((m) => m.idx > 0).length;

  const proximo = modulos.find((m) => !m.aberto);
  const atual = modulos.find((m) => m.atual);
  const fraseTrilha = proximo
    ? `${atual ? `Você está no ${rotuloModulo(atual.ord)}. ` : ""}Próxima abertura: ${rotuloModulo(proximo.ord)}, ${
        proximo.abreEmTexto
          ? `em ${proximo.abreEmTexto}`
          : proximo.motivo === "apos_modulo" && proximo.dependeDe !== null
            ? `quando você concluir o ${rotuloModulo(proximo.dependeDe)}`
            : "em breve, sem data marcada"
      }.`
    : "Todos os módulos já estão abertos para você.";

  const nb = notebookDoModulo(0);
  const graficoNb = nb?.blocos.find((b) => b.tipo === "grafico");

  return (
    <div className="sl">
      {/* ---- hero ---- */}
      <section className="sl-hero sl-escuro" aria-labelledby="comece-titulo">
        <div className="sl-hero-globo" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- arte decorativa em SVG */}
          <img src="/marca/globo-dourado.svg" alt="" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- o olho da campanha, com multiply */}
        <img className="sl-hero-olho" src="/lp/f2070b29-906c-48d8-92c7-0948fe19573b.webp" alt="" aria-hidden="true" />
        <div className="sl-wrap sl-hero-miolo">
          <div className="sl-hero-texto">
            <span className="sl-eyebrow">Módulo 0 · Comece por aqui</span>
            <h1 className="sl-display" id="comece-titulo">
              Seu patrimônio não precisa morar <em>num país só.</em>
            </h1>
            <p className="sl-hero-lead">
              {primeiro ? `${primeiro}, comece` : "Comece"} pelas aulas de abertura. Elas apresentam a
              formação e o jeito de estudar; depois delas, cada módulo abre na data marcada na trilha.
            </p>
            <div className="sl-hero-acoes">
              <a className="sl-btn sl-btn-claro" href="#aulas">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15l12.5-7.5z" />
                </svg>
                Assistir às aulas de abertura
              </a>
              <a className="sl-btn sl-btn-vidro" href="#trilha">
                Ver a trilha
              </a>
            </div>
            <dl className="sl-hero-fatos">
              <div>
                <dt className="sl-so-leitor">Módulos</dt>
                <dd>
                  <b>{numModulos}</b> <span>módulos</span>
                </dd>
              </div>
              <div>
                <dt className="sl-so-leitor">Aulas</dt>
                <dd>
                  <b>{curriculo.totalAvaliadas}</b> <span>aulas</span>
                </dd>
              </div>
              <div>
                <dt className="sl-so-leitor">Certificação</dt>
                <dd>
                  <b>1</b> <span>prova e certificado</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ---- aulas de abertura ---- */}
      <section className="sl-wrap sl-intro" id="aulas" aria-labelledby="aulas-titulo">
        <h2 className="sl-so-leitor" id="aulas-titulo">
          Aulas de abertura
        </h2>
        <ol className="sl-intro-grade">
          {Array.from({ length: vagas }, (_, i) => {
            const aula = abertura[i];
            const rotulo = `Aula ${i + 1} de ${vagas}`;
            if (!aula)
              return (
                <li key={`vaga-${i}`} className="sl-aulacard sl-aulacard-vazia">
                  <div className="sl-player">
                    <div className="sl-capa">
                      <span>Em breve</span>
                    </div>
                  </div>
                  <div className="sl-aulacard-corpo">
                    <span className="sl-aulacard-rotulo">{rotulo}</span>
                    <h3>A próxima aula de abertura</h3>
                    <p>Entra aqui assim que for publicada. Nada a fazer por enquanto.</p>
                  </div>
                </li>
              );
            const fonte = fonteDoVideo(aula.video);
            const feita = concluidas.has(aula.n);
            return (
              <li key={aula.id} className="sl-aulacard">
                {aberto && fonte.tipo === "panda" ? (
                  <Player fonte={fonte} titulo={aula.titulo} />
                ) : (
                  <div className="sl-player">
                    {aberto ? (
                      <Link className="sl-capa" href={href(aula)} aria-label={`Assistir: ${aula.titulo}`}>
                        <span className="sl-capa-play" aria-hidden="true">
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fdfaf5">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                        <span>Assistir à aula</span>
                      </Link>
                    ) : (
                      <div className="sl-capa">
                        <span>{m0 ? motivoDaTrava(m0) : "Em breve"}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="sl-aulacard-corpo">
                  <div className="sl-aulacard-topo">
                    <span className="sl-aulacard-rotulo">{rotulo}</span>
                    {feita && <span className="sl-chip sl-chip-ok">Concluída</span>}
                  </div>
                  <h3>{aula.titulo}</h3>
                  {aula.descricao && <p>{aula.descricao}</p>}
                  {aberto && (
                    <div className="sl-aulacard-acoes">
                      <Link className="sl-btn sl-btn-linha" href={href(aula)}>
                        {feita ? "Rever a aula" : "Abrir a aula e marcar como concluída"}
                      </Link>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ---- como funciona ---- */}
      <section className="sl-wrap sl-secao" aria-labelledby="como-titulo">
        <div className="sl-secao-cabeca">
          <div>
            <span className="sl-eyebrow">O percurso</span>
            <h2 className="sl-h2" id="como-titulo" style={{ marginTop: 12 }}>
              Como a formação funciona
            </h2>
          </div>
        </div>
        <ol className="sl-como">
          <li>
            <span className="sl-como-num">01</span>
            <h3>Um módulo por vez</h3>
            <p>Os módulos abrem em sequência. A trilha abaixo mostra quando cada um libera, e o que já abriu continua aberto.</p>
          </li>
          <li>
            <span className="sl-como-num">02</span>
            <h3>{curriculo.totalAvaliadas} aulas em vídeo</h3>
            <p>Cada módulo tem um docente próprio e materiais para baixar ao lado do vídeo.</p>
          </li>
          <li>
            <span className="sl-como-num">03</span>
            <h3>Um notebook por módulo</h3>
            <p>Gráficos, texto longo e simuladores tirados das aulas, para consultar sem voltar ao vídeo.</p>
          </li>
          <li>
            <span className="sl-como-num">04</span>
            <h3>Prova final e certificado</h3>
            <p>
              {TOTAL_QUESTOES} questões em {MINUTOS} minutos, liberada quando você concluir as{" "}
              {curriculo.totalAvaliadas} aulas. Com {NOTA_MINIMA}% de acerto, o certificado é emitido na hora.
            </p>
          </li>
        </ol>
      </section>

      {/* ---- trilha ---- */}
      {modulos.length > 0 && (
        <section className="sl-wrap sl-secao" id="trilha" aria-labelledby="trilha-titulo">
          <div className="sl-secao-cabeca">
            <div>
              <span className="sl-eyebrow">Sua trilha</span>
              <h2 className="sl-h2" id="trilha-titulo" style={{ marginTop: 12 }}>
                Do Módulo 0 ao certificado
              </h2>
              <p className="sl-sub">{fraseTrilha}</p>
            </div>
          </div>
          <Trilha modulos={modulos} />
        </section>
      )}

      {/* ---- amostra do notebook ---- */}
      {nb && (
        <section className="sl-wrap sl-secao" aria-labelledby="teaser-titulo">
          <div className="sl-teaser">
            <div className="sl-teaser-texto">
              <span className="sl-eyebrow">Notebook do Módulo 0</span>
              <h2 id="teaser-titulo">
                {nb.titulo}
              </h2>
              <p>{nb.subtitulo}</p>
              {nb.demo && <span className="sl-chip sl-chip-demo">Conteúdo de demonstração</span>}
              <Link className="sl-btn" href="/app/modulo/0/notebook">
                Abrir o notebook
              </Link>
            </div>
            <div className="sl-teaser-visual">
              {graficoNb?.tipo === "grafico" ? (
                <Grafico
                  titulo={graficoNb.titulo}
                  forma={graficoNb.forma}
                  eixoX={graficoNb.eixoX}
                  series={graficoNb.series}
                  formato={graficoNb.formato}
                  nota={graficoNb.nota}
                  ilustrativo={graficoNb.ilustrativo}
                />
              ) : (
                <p className="sl-teaser-legenda">Gráficos e simuladores de cada aula, num lugar só.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

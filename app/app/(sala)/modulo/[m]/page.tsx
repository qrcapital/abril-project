import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AulaClient from "./AulaClient";
import { getCalendario, type Calendario } from "@/lib/calendario";
import { getCurriculo } from "@/lib/curriculo";
import { ROMANO, href, rotuloModulo, type Aula, type Curriculo } from "@/lib/curso";
import { getConcluidas } from "@/lib/progresso";
import { getMateriais } from "@/lib/materiais";
import { fonteDoVideo } from "@/lib/video";
import { notebookDoModulo } from "@/content/notebooks";
import { segundosDaUrl } from "@/lib/notebook";
import AncoraDaAula from "@/app/app/_ui/sala/AncoraDaAula";
import AvisoTravado from "@/app/app/_ui/sala/Aviso";
import CartaoDocente from "@/app/app/_ui/sala/CartaoDocente";
import NotebookModulo from "@/app/app/_ui/sala/NotebookModulo";
import Player from "@/app/app/_ui/sala/Player";
import Playlist from "@/app/app/_ui/sala/Playlist";
import Trilha from "@/app/app/_ui/sala/Trilha";
import { estadoDoModulo, hrefDoModulo, motivoDaTrava } from "@/app/app/_ui/sala/estado";

export async function generateMetadata({ params }: { params: Promise<{ m: string }> }): Promise<Metadata> {
  const { m } = await params;
  const ord = Number(m);
  return { title: Number.isInteger(ord) && ord >= 0 ? rotuloModulo(ord) : "Módulo" };
}

/** O nome do módulo na migalha e nos cartões. Até 05/out/2026 o ord 0 era o "Comece por aqui"; hoje
 *  é o Módulo I e segue o mesmo formato dos outros. */
const nomeDoModulo = (ord: number, titulo: string) => `${rotuloModulo(ord)} · ${titulo}`;

/**
 * A página do módulo, que desde 30/set/2026 é também a sala de aula. De cima para baixo:
 *
 * 1. **o teatro**: a aula escolhida tocando no palco escuro, com título, o botão de concluir e a bio
 *    curta do docente. É o layout da antiga página da aula, que virou redirect para cá;
 * 2. **a playlist**: as aulas do módulo em fila horizontal, a do teatro em destaque;
 * 3. **o notebook**: um documento só para o módulo, com uma seção por aula (`#aula-<n>`).
 *
 * A AULA DO TEATRO VEM DA URL (`?aula=<posição no módulo>`), renderizada no servidor: o link da
 * playlist funciona sem JS e o endereço leva à mesma aula em qualquer lugar. Sem `?aula=`, ou com um
 * valor que não existe, toca a primeira aula ainda não concluída, e com o módulo todo concluído, a
 * primeira. Posição inválida não vira 404 porque o destino certo é óbvio.
 *
 * MÓDULO FECHADO MOSTRA A PÁGINA SEM TEATRO: cabeça com a data de abertura, o aviso, os títulos das
 * aulas sem link e a trilha. Nenhum vídeo, nenhum material, nenhum notebook. A guarda é a mesma das
 * outras portas (`getCalendario`, que aplica `lib/liberacao.ts`), e é ela, e não a ausência de link,
 * que impede o vídeo: o id do Panda só entra no HTML depois dela.
 *
 * Desde 05/out/2026 o curso não tem Módulo 0: o ord 0 é o Módulo I, que abre na compra. O antigo
 * "Comece por aqui" (`/app/comece`) virou redirect para `/app/modulo/0`.
 */
export default async function ModuloPage({
  params,
  searchParams,
}: {
  params: Promise<{ m: string }>;
  searchParams: Promise<{ aula?: string | string[]; t?: string | string[] }>;
}) {
  const [{ m }, sp] = await Promise.all([params, searchParams]);
  const ord = Number(m);
  const [curriculo, calendario, concluidas] = await Promise.all([getCurriculo(), getCalendario(), getConcluidas()]);
  const mod = curriculo.modulos.find((x) => x.idx === ord);
  if (!Number.isInteger(ord) || !mod) notFound();

  const cal = calendario?.modulos.find((x) => x.ord === ord);
  // Sem calendário (sem matrícula) nada abre: é o erro seguro, o mesmo das outras guardas.
  const aberto = calendario?.abertos.has(ord) ?? false;
  const aulas = curriculo.aulas.filter((a) => a.modulo === ord);
  const feitas = aulas.filter((a) => concluidas.has(a.n)).length;
  const pct = aulas.length ? Math.round((feitas / aulas.length) * 100) : 0;

  if (!aberto || !aulas.length) {
    return (
      <div className="sl">
        <CabecaFechada ord={ord} titulo={mod.titulo} docente={mod.docente} texto={cal ? estadoDoModulo(cal).texto : "Em breve"} />
        <div className="sl-wrap">
          <div style={{ marginTop: 40 }}>
            {aberto ? (
              <div className="sl-aviso" role="status">
                <div>
                  <h2>As aulas deste módulo ainda não foram publicadas</h2>
                  <p>Elas entram aqui assim que estiverem prontas. Nada a fazer por enquanto.</p>
                </div>
              </div>
            ) : (
              <AvisoTravado cal={cal} />
            )}
          </div>
          {aulas.length > 0 && (
            <section className="sl-secao" aria-labelledby="aulas-titulo" style={{ marginTop: 48 }}>
              <h2 className="sl-h2" id="aulas-titulo" style={{ marginBottom: 20 }}>
                Aulas do módulo
              </h2>
              <Playlist aulas={aulas} atual={null} concluidas={concluidas} aberto={false} />
            </section>
          )}
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

  // A aula do teatro. `Number("")` é 0 e `Number("2abc")` é NaN: os dois caem no padrão.
  const pedida = Number(Array.isArray(sp.aula) ? sp.aula[0] : sp.aula);
  const aula: Aula =
    aulas.find((a) => a.pos === pedida) ?? aulas.find((a) => !concluidas.has(a.n)) ?? aulas[0];
  const concluida = concluidas.has(aula.n);
  const anterior = aulas.find((a) => a.pos === aula.pos - 1);
  const proxima = aulas.find((a) => a.pos === aula.pos + 1);
  const materiais = await getMateriais(aula.n);
  const nb = notebookDoModulo(ord);

  return (
    <div className="sl">
      <AncoraDaAula pos={aula.pos} />

      <section className="sl-palco sl-escuro" aria-labelledby="aula-titulo">
        <div className="sl-palco-topo">
          <nav className="sl-palco-migalha" aria-label="Você está em">
            <Link href="/app">Início</Link> <span aria-hidden="true">›</span> {nomeDoModulo(ord, mod.titulo)}
          </nav>
          <span className="sl-palco-progresso">
            {feitas} de {aulas.length} {aulas.length === 1 ? "aula concluída" : "aulas concluídas"} · {pct}%
          </span>
        </div>

        {/* `id="player"` e `data-player-aula`: o atalho "Na aula, 12:34" do notebook usa os dois
            (NaAula.tsx), o primeiro como destino do link e o segundo para saber se a aula do bloco
            é a que está tocando. */}
        <div className="sl-palco-player" id="player" data-player-aula={aula.pos}>
          {/* `key` pela aula: trocar de aula monta um player novo, em vez de reaproveitar um
              iframe do Panda que já bootou medindo o vídeo anterior. */}
          <Player key={aula.id} fonte={fonteDoVideo(aula.video)} titulo={aula.titulo} inicio={segundosDaUrl(sp.t)} />
        </div>

        <div className="sl-palco-meta">
          <div>
            <span className="sl-eyebrow">
              {rotuloModulo(ord)} · Aula {aula.pos} de {aulas.length}
            </span>
            <h1 id="aula-titulo">{aula.titulo}</h1>
            {aula.descricao && <p className="sl-palco-desc">{aula.descricao}</p>}
            {mod.docente && (
              <div className="sl-palco-docente">
                <CartaoDocente nome={mod.docente} />
              </div>
            )}
          </div>
          <div className="sl-palco-acoes">
            {anterior && (
              <Link
                className="sl-btn sl-btn-vidro"
                href={href(anterior)}
                scroll={false}
                aria-label={`Aula anterior: ${anterior.titulo}`}
              >
                ← Aula {anterior.pos}
              </Link>
            )}
            {/* O contrato do botão não mudou com a mudança de página: `data-concluir` com o número
                GLOBAL da aula, a server action `marcarAula` como única porta de escrita, e o `key`
                no estado do servidor para o refresh recriar o botão. */}
            <AulaClient key={`${aula.n}-${concluida}`} n={aula.n} pos={aula.pos} concluida={concluida} />
            {proxima && (
              <Link className="sl-btn" href={href(proxima)} scroll={false} aria-label={`Próxima aula: ${proxima.titulo}`}>
                Próxima aula →
              </Link>
            )}
          </div>
        </div>

        {!proxima && concluida && (
          <FimDoModulo ord={ord} aulas={aulas} concluidas={concluidas} curriculo={curriculo} calendario={calendario} />
        )}

        <section className="sl-palco-materiais" aria-labelledby="materiais-titulo">
          <span className="sl-cartao-rotulo" id="materiais-titulo">
            Materiais desta aula
          </span>
          {materiais.length ? (
            <ul>
              {materiais.map((mt) => (
                <li key={mt.arquivo + mt.titulo}>
                  <a href={mt.arquivo} download>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
                    </svg>
                    {mt.titulo}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            // PRD §6: sem material, a seção diz "em breve", sem link quebrado.
            <p>Os materiais desta aula chegam em breve.</p>
          )}
        </section>
      </section>

      <div className="sl-wrap-largo">
        <section className="sl-pl-secao" aria-labelledby="pl-titulo">
          <h2 className="sl-so-leitor" id="pl-titulo">
            Aulas do módulo
          </h2>
          <Playlist aulas={aulas} atual={aula.pos} concluidas={concluidas} aberto />
        </section>

        <NotebookModulo notebook={nb} aulas={aulas} atual={aula.pos} />
      </div>
    </div>
  );
}

/**
 * O cartão de fim de módulo, no palco, quando a última aula dele está concluída. Aponta para o
 * próximo módulo, ou diz quando ele abre. Depois do último módulo, aponta para o certificado, que
 * sai sozinho ao concluir todas as aulas que contam (ver `marcarAula`).
 */
function FimDoModulo({
  ord,
  aulas,
  concluidas,
  curriculo,
  calendario,
}: {
  ord: number;
  aulas: Aula[];
  concluidas: Set<number>;
  curriculo: Curriculo;
  calendario: Calendario | null;
}) {
  const pendentes = aulas.filter((a) => !concluidas.has(a.n)).length;
  const seguinte = curriculo.modulos.find((x) => x.idx > ord);
  const calSeguinte = seguinte ? calendario?.modulos.find((x) => x.ord === seguinte.idx) : undefined;
  const seguinteAberto = seguinte ? (calendario?.abertos.has(seguinte.idx) ?? false) : false;
  const restantes = curriculo.aulasRestantes(concluidas);
  const concluiuTudo = curriculo.formacaoConcluida(concluidas);

  return (
    <div className="sl-palco-fim" role="status">
      <div>
        <span className="sl-cartao-rotulo">Fim do módulo</span>
        <p className="sl-palco-fim-titulo">
          {pendentes > 0
            ? `Você chegou à última aula. ${pendentes === 1 ? "Falta 1 aula" : `Faltam ${pendentes} aulas`} deste módulo na playlist.`
            : `${rotuloModulo(ord)} concluído.`}
        </p>
        {seguinte ? (
          <p>
            Próximo: {nomeDoModulo(seguinte.idx, seguinte.titulo)}.
            {!seguinteAberto && ` ${calSeguinte ? motivoDaTrava(calSeguinte) : "Em breve"}.`}
          </p>
        ) : concluiuTudo ? (
          <p>Você concluiu todas as aulas da formação. O seu certificado já está disponível.</p>
        ) : (
          <p>
            {restantes === 1 ? "Falta 1 aula" : `Faltam ${restantes} aulas`} em outros módulos para o
            certificado, que é emitido quando você conclui todas.
          </p>
        )}
      </div>
      {seguinte && seguinteAberto ? (
        <Link className="sl-btn sl-btn-claro" href={hrefDoModulo(seguinte.idx)}>
          Ir para o {rotuloModulo(seguinte.idx)}
        </Link>
      ) : !seguinte && concluiuTudo ? (
        <Link className="sl-btn sl-btn-claro" href="/app/certificado">
          Ver meu certificado
        </Link>
      ) : !seguinte ? (
        <Link className="sl-btn sl-btn-claro" href={href(curriculo.aulaAtual(concluidas))}>
          Ir para a próxima aula pendente
        </Link>
      ) : null}
    </div>
  );
}

/** A cabeça do módulo fechado (ou sem aulas): o numeral, o título, o docente e a data. */
function CabecaFechada({
  ord,
  titulo,
  docente,
  texto,
}: {
  ord: number;
  titulo: string;
  docente?: string;
  texto: string;
}) {
  return (
    <header className="sl-cabeca sl-escuro">
      <div className="sl-hero-globo" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- arte decorativa em SVG */}
        <img src="/marca/globo-dourado.svg" alt="" />
      </div>
      <div className="sl-wrap">
        <nav className="sl-migalha" aria-label="Você está em" style={{ paddingTop: 22, position: "relative", zIndex: 2 }}>
          <Link href="/app">Início</Link> <span aria-hidden="true">›</span> {rotuloModulo(ord)}
        </nav>
        <div className="sl-cabeca-miolo">
          <span className="sl-numeral" aria-hidden="true">
            {ROMANO[ord] ?? ord}
          </span>
          <div>
            <span className="sl-eyebrow">{rotuloModulo(ord)}</span>
            <h1>{titulo}</h1>
            <div style={{ marginTop: 20 }}>
              <CartaoDocente nome={docente} />
            </div>
          </div>
          <div className="sl-cabeca-lateral">
            <span className="sl-chip sl-chip-trava" style={{ alignSelf: "flex-start" }}>
              {texto}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

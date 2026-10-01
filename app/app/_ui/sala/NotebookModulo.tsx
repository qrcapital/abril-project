import Link from "next/link";

import { href, type Aula } from "@/lib/curso";
import { ancoraDaAula, deComparador, secaoDaAula, type Bloco, type Notebook } from "@/lib/notebook";

import Comparativo from "./Comparativo";
import Fluxo from "./Fluxo";
import Grafico from "./Grafico";
import Kpis from "./Kpis";
import LinhaDoTempo from "./LinhaDoTempo";
import Matriz from "./Matriz";
import NaAula from "./NaAula";
import Origem from "./Origem";
import { minutos } from "./Playlist";
import Simulador from "./Simulador";

/**
 * O notebook do módulo: UM documento longo, com uma seção por aula (`#aula-<n>`), dentro da página
 * do módulo e logo abaixo da playlist. Até 30/set/2026 era uma página à parte, com a lista de blocos
 * corrida; virou seções porque a playlist precisa de um lugar para onde apontar em cada aula.
 *
 * AS SEÇÕES SAEM DAS AULAS DO BANCO, E NÃO DO ARQUIVO. O título de cada seção é o da aula, que o
 * admin edita; o arquivo de `content/notebooks/` só entra com o miolo. Aula sem miolo ainda tem a
 * seção e a âncora, com o aviso de conteúdo em produção: a playlist aponta para todas, e uma âncora
 * que não existe faria o clique não levar a lugar nenhum.
 *
 * NO DESKTOP O MIOLO ROLA DENTRO DA PRÓPRIA CAIXA (`data-nb-rolagem`), com o índice parado ao lado.
 * É isso que deixa a troca de aula pela playlist posicionar o notebook na seção dela sem tirar o
 * teatro da tela (`AncoraDaAula`). No celular a caixa volta a ser página corrida, porque rolagem
 * dentro de rolagem com o polegar é armadilha.
 *
 * A LINGUAGEM VISUAL (01/out/2026, `docs/NOTEBOOK.md`): papel, tinta e um vermelho; sans da casa
 * em tudo, com algarismos tabulares; a serifa só no título de cada aula e na citação em destaque.
 *
 * Componente de servidor; gráficos, KPIs, linha do tempo, matriz, simulador e o atalho de tempo
 * descem para o cliente.
 */
export default function NotebookModulo({
  notebook,
  aulas,
  atual,
}: {
  notebook: Notebook | null;
  /** As aulas do módulo, em ordem. */
  aulas: Aula[];
  /** A posição da aula que está no teatro, para o índice marcar onde o aluno está. */
  atual: number;
}) {
  const demo = notebook?.demo ?? false;
  return (
    <section className="sl-nbm" id="notebook" aria-labelledby="nb-titulo">
      <header className="sl-nbm-cabeca">
        <p className="sl-nbm-rotulo">Notebook do módulo</p>
        <h2 className="sl-h2" id="nb-titulo">
          {notebook ? notebook.titulo : "Em preparação"}
        </h2>
        <p className="sl-sub">
          {notebook
            ? notebook.subtitulo
            : "Os gráficos, textos e simuladores de cada aula entram aqui quando o conteúdo for publicado."}
        </p>
        {demo && (
          <div className="sl-nb-meta">
            <span className="sl-chip sl-chip-demo">Conteúdo de demonstração</span>
          </div>
        )}
      </header>

      <div className="sl-nb">
        <nav className="sl-nb-indice" aria-labelledby="indice-titulo">
          <h3 id="indice-titulo">Neste notebook</h3>
          <ol>
            {aulas.map((a) => (
              <li key={a.id}>
                <a href={`#${ancoraDaAula(a.pos)}`} aria-current={a.pos === atual ? "location" : undefined}>
                  <span aria-hidden="true">{String(a.pos).padStart(2, "0")}</span>
                  {a.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Região rolável precisa de foco para o teclado rolar, e de nome para o leitor de tela
            dizer o que é. */}
        <div className="sl-nb-rolagem" data-nb-rolagem="" tabIndex={0} role="region" aria-label="Conteúdo do notebook">
          <div className="sl-nb-canvas">
            {aulas.map((a) => {
              const secao = secaoDaAula(notebook, a.pos);
              const ancora = ancoraDaAula(a.pos);
              const tocando = a.pos === atual;
              return (
                <section key={a.id} className="sl-nb-secao" id={ancora} aria-labelledby={`${ancora}-titulo`}>
                  <header className="sl-nb-secao-cabeca">
                    <p className="sl-nb-secao-meta">
                      <span className="sl-nb-secao-num">Aula {String(a.pos).padStart(2, "0")}</span>
                      {a.duracao ? <span>{minutos(a.duracao)}</span> : null}
                      {tocando ? (
                        <span className="sl-nb-secao-agora">No player agora</span>
                      ) : (
                        <Link href={href(a)} scroll={false}>
                          Assistir esta aula
                        </Link>
                      )}
                    </p>
                    <h3 id={`${ancora}-titulo`}>{a.titulo}</h3>
                  </header>
                  {secao ? (
                    secao.blocos.map((b, i) => (
                      <div className="sl-bloco" data-tipo={b.tipo} key={i}>
                        <UmBloco bloco={b} />
                        {b.tempo && notebook && <NaAula modulo={notebook.modulo} aula={a.pos} tempo={b.tempo} />}
                      </div>
                    ))
                  ) : (
                    <p className="sl-vazio">Conteúdo desta aula em produção.</p>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Célula de tabela que é número (valor, percentual, moeda): alinha à direita, em tabular. */
const NUMERICO = /^[\s(+\-−]*(R\$|US\$|€)?\s*[\d.,]+\s*(%|p\.p\.|×|x|bi|mi|mil)?\)?\s*$/;

function UmBloco({ bloco: b }: { bloco: Bloco }) {
  switch (b.tipo) {
    case "capitulo":
      // Subtítulo dentro da seção da aula. O número de capítulo saiu com as seções: quem numera
      // agora é a aula.
      return (
        <header className="sl-cap" id={b.id}>
          <h4>{b.titulo}</h4>
          {b.resumo && <p>{b.resumo}</p>}
        </header>
      );
    case "texto":
      return (
        <div className={`sl-prosa${b.capitular ? " is-abertura" : ""}`}>
          {b.paragrafos.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      );
    case "destaque":
      return (
        <blockquote className="sl-destaque">
          <p>{b.texto}</p>
          {b.fonte && <footer>{b.fonte}</footer>}
        </blockquote>
      );
    case "numero":
      return (
        <div className="sl-numero">
          <span className="sl-numero-valor">{b.valor}</span>
          <div>
            <p className="sl-numero-legenda">{b.legenda}</p>
            {b.nota && <p className="sl-numero-nota">{b.nota}</p>}
          </div>
        </div>
      );
    case "grafico":
      return (
        <Grafico
          titulo={b.titulo}
          subtitulo={b.subtitulo}
          forma={b.forma}
          eixoX={b.eixoX}
          series={b.series}
          formato={b.formato}
          escala={b.escala}
          marcos={b.marcos}
          faixas={b.faixas}
          referencia={b.referencia}
          origem={b}
        />
      );
    case "kpis":
      return <Kpis titulo={b.titulo} itens={b.itens} origem={b} />;
    case "comparativo":
      return <Comparativo titulo={b.titulo} subtitulo={b.subtitulo} opcoes={b.opcoes} metricas={b.metricas} origem={b} />;
    case "linhaDoTempo":
      return <LinhaDoTempo titulo={b.titulo} subtitulo={b.subtitulo} eventos={b.eventos} serie={b.serie} origem={b} />;
    case "fluxo":
      return <Fluxo titulo={b.titulo} subtitulo={b.subtitulo} nos={b.nos} ligacoes={b.ligacoes} origem={b} />;
    case "matriz":
      return (
        <Matriz
          titulo={b.titulo}
          subtitulo={b.subtitulo}
          modo={b.modo}
          eixoLinhas={b.eixoLinhas}
          eixoColunas={b.eixoColunas}
          linhas={b.linhas}
          colunas={b.colunas}
          celulas={b.celulas}
          formato={b.formato}
          origem={b}
        />
      );
    case "simulador":
      return <Simulador bloco={b} />;
    case "comparador":
      return <Simulador bloco={deComparador(b)} />;
    case "conceito":
      return (
        <aside className="sl-conceito" aria-label={`Conceito: ${b.termo}`}>
          <p className="sl-conceito-rotulo">Teoria</p>
          <h4 className="sl-conceito-termo">{b.termo}</h4>
          <div className="sl-conceito-grade">
            <div>
              <p>{b.definicao}</p>
              {b.formula && <p className="sl-conceito-formula">{b.formula}</p>}
            </div>
            <div className="sl-conceito-pratica">
              <p className="sl-conceito-sub">Na prática</p>
              <p>{b.naPratica}</p>
            </div>
          </div>
          {b.referencia && (
            <p className="sl-conceito-ref">
              {b.referencia.autor}, <cite>{b.referencia.obra}</cite>
              {b.referencia.ano ? ` (${b.referencia.ano})` : ""}
              {b.referencia.capitulo ? `, ${b.referencia.capitulo}` : ""}.
            </p>
          )}
        </aside>
      );
    case "tabela": {
      // Coluna em que toda célula é número alinha à direita, cabeçalho junto.
      const colunaNum = b.colunas.map((_, j) => j > 0 && b.linhas.length > 0 && b.linhas.every((l) => NUMERICO.test(l[j] ?? "")));
      return (
        <div className="sl-tabela-bloco">
          <div className="sl-tabela-caixa">
            <table className="sl-tabela">
              {b.titulo && <caption>{b.titulo}</caption>}
              <thead>
                <tr>
                  {b.colunas.map((c, j) => (
                    <th scope="col" key={c} className={colunaNum[j] ? "is-num" : undefined}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.linhas.map((linha, i) => (
                  <tr key={i}>
                    {linha.map((celula, j) =>
                      j === 0 ? (
                        <th scope="row" key={j}>
                          {celula}
                        </th>
                      ) : (
                        <td key={j} className={colunaNum[j] ? "is-num" : undefined}>
                          {celula}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.fonte ? <Origem origem={{ fonte: b.fonte, nota: b.nota }} /> : b.nota && <p className="sl-origem">{b.nota}</p>}
        </div>
      );
    }
    case "referencias":
      return (
        <section className="sl-refs" aria-label="Referências">
          <h4>Referências</h4>
          <ol>
            {b.itens.map((r) => (
              <li key={r.titulo}>
                <span>
                  <cite>{r.titulo}</cite>
                  <span className="sl-refs-autor">
                    {r.autor}, {r.ano}
                  </span>
                  {r.nota && <span className="sl-refs-nota">{r.nota}</span>}
                </span>
              </li>
            ))}
          </ol>
        </section>
      );
  }
}

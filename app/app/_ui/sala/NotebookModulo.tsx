import Link from "next/link";

import { href, rotuloModulo, type Aula } from "@/lib/curso";
import { ancoraDaAula, deComparador, secaoDaAula, type Bloco, type Notebook } from "@/lib/notebook";

import { GLOSSARIO } from "@/content/glossario";

import Comparativo from "./Comparativo";
import Fluxo from "./Fluxo";
import Grafico from "./Grafico";
import Kpis from "./Kpis";
import LinhaDoTempo from "./LinhaDoTempo";
import Matriz from "./Matriz";
import NaAula from "./NaAula";
import Origem from "./Origem";
import PerguntarIa, { type AulaParaIa } from "./PerguntarIa";
import { minutos } from "./Playlist";
import Simulador from "./Simulador";
import Balao from "./glossario/Balao";
import { criarLigador, type Ligador } from "./glossario/texto";

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
 * O NOTEBOOK CORRE NA ROLAGEM DA PÁGINA (07/out/2026). Até aqui, no desktop, o miolo rolava dentro de
 * uma caixa da altura da janela, com o índice parado ao lado; o dono pediu uma barra de rolagem só,
 * sem caixa rolando dentro da página, e a caixa saiu. O índice continua fixo ao lado no desktop
 * (`position: sticky`), marcando a aula do teatro.
 *
 * A LINGUAGEM VISUAL (01/out/2026, `docs/NOTEBOOK.md`): papel, tinta e um vermelho, com algarismos
 * tabulares. Desde 07/out/2026 é Jost em tudo, título de aula e citação inclusive, e os rótulos
 * ("Notebook", "Neste notebook", "Aula 03") seguem o rótulo único da sala (`.sl-eyebrow`).
 *
 * OS TERMOS DO GLOSSÁRIO VIRAM LINK (07/out/2026). No texto corrido (os parágrafos de `texto` e a
 * definição e a prática de `conceito`; a citação de `destaque` não), a primeira ocorrência de cada
 * termo em cada seção de aula aponta para o verbete, com o resumo num balão. O conteúdo dos arquivos
 * de `content/notebooks/` não muda: o casamento é feito aqui, na renderização (`glossario/texto.tsx`,
 * regras em `lib/glossario-links.ts`). O ligador é um por seção, e os textos são ligados ANTES do
 * JSX, na ordem do documento, para "a primeira ocorrência" ser a primeira que o aluno lê.
 *
 * "PERGUNTAR À SUA IA" (09/out/2026, `PerguntarIa.tsx`): um botão fixo no canto de baixo à direita,
 * visível só com o notebook na tela, e um mini botão sobre o trecho que o aluno selecionar no miolo.
 * Os dois abrem o mesmo menu (ChatGPT, Claude, Gemini) com a pergunta já escrita. A seção de cada
 * aula leva `data-aula` com a posição, para o componente saber de qual aula é o trecho; o resumo que
 * vai na pergunta é a descrição da aula no banco ou, sem ela, os capítulos da seção.
 *
 * Componente de servidor; gráficos, KPIs, linha do tempo, matriz, simulador, o atalho de tempo e o
 * balão do glossário descem para o cliente.
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
  const paraIa: AulaParaIa[] = aulas.map((a) => {
    const capitulos = secaoDaAula(notebook, a.pos)
      ?.blocos.flatMap((b) => (b.tipo === "capitulo" ? [b.titulo] : []))
      .join("; ");
    return { pos: a.pos, titulo: a.titulo, resumo: a.descricao?.trim() || (capitulos ? `Tópicos: ${capitulos}.` : undefined) };
  });
  return (
    <section className="sl-nbm" id="notebook" aria-labelledby="nb-titulo">
      <header className="sl-nbm-cabeca">
        {/* Só "Notebook" (07/out/2026): o módulo já está no título logo abaixo. */}
        <p className="sl-eyebrow">Notebook</p>
        <h2 className="sl-h2" id="nb-titulo">
          {notebook ? notebook.titulo : "Em preparação"}
        </h2>
        <p className="sl-sub">
          {notebook
            ? notebook.subtitulo
            : "Os gráficos, textos e simuladores de cada aula entram aqui quando o conteúdo for publicado."}
        </p>
        {(demo || GLOSSARIO.length > 0) && (
          <div className="sl-nb-meta">
            {demo && <span className="sl-chip sl-chip-demo">Conteúdo de demonstração</span>}
            {GLOSSARIO.length > 0 && (
              <p className="sl-nb-glossario">
                Termos com <span className="sl-termo-amostra">sublinhado pontilhado</span> abrem o{" "}
                <Link href="/app/glossario">glossário do curso</Link>.
              </p>
            )}
          </div>
        )}
      </header>

      <div className="sl-nb">
        <nav className="sl-nb-indice" aria-labelledby="indice-titulo">
          <h3 className="sl-eyebrow" id="indice-titulo">
            Neste notebook
          </h3>
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

        {/* Sem foco nem papel de região desde 07/out/2026: a caixa deixou de rolar sozinha, e uma
            parada de Tab que não rola nada só atrapalharia o teclado. */}
        <Balao className="sl-nb-corpo">
          <div className="sl-nb-canvas">
            {aulas.map((a) => {
              const secao = secaoDaAula(notebook, a.pos);
              // Um ligador por seção: cada termo vira link na primeira vez que aparece nesta aula.
              const ligar = criarLigador();
              const ligados = secao?.blocos.map((b) => ligarBloco(b, ligar)) ?? [];
              const ancora = ancoraDaAula(a.pos);
              const tocando = a.pos === atual;
              return (
                <section key={a.id} className="sl-nb-secao" id={ancora} data-aula={a.pos} aria-labelledby={`${ancora}-titulo`}>
                  <header className="sl-nb-secao-cabeca">
                    <p className="sl-nb-secao-meta">
                      <span className="sl-eyebrow">Aula {String(a.pos).padStart(2, "0")}</span>
                      {/* Sem duração no banco, a linha fica só com o rótulo e o link: nada a reservar. */}
                      {a.duracao ? <span className="sl-nb-secao-dur">{minutos(a.duracao)}</span> : null}
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
                        <UmBloco bloco={b} ligado={ligados[i]} />
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
        </Balao>
      </div>

      {aulas.length > 0 && <PerguntarIa modulo={rotuloModulo(aulas[0].modulo)} aulas={paraIa} atual={atual} />}
    </section>
  );
}

/** Os textos de um bloco já com os termos do glossário ligados. Só os blocos de texto corrido. */
type Ligado = { paragrafos?: React.ReactNode[]; definicao?: React.ReactNode; naPratica?: React.ReactNode };

function ligarBloco(b: Bloco, ligar: Ligador): Ligado {
  if (b.tipo === "texto") return { paragrafos: b.paragrafos.map(ligar) };
  if (b.tipo === "conceito") return { definicao: ligar(b.definicao), naPratica: ligar(b.naPratica) };
  return {};
}

/** Célula de tabela que é número (valor, percentual, moeda): alinha à direita, em tabular. */
const NUMERICO = /^[\s(+\-−]*(R\$|US\$|€)?\s*[\d.,]+\s*(%|p\.p\.|×|x|bi|mi|mil)?\)?\s*$/;

function UmBloco({ bloco: b, ligado }: { bloco: Bloco; ligado?: Ligado }) {
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
            <p key={i}>{ligado?.paragrafos?.[i] ?? p}</p>
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
      // Número comprido ("2,75 quatrilhões") empilha: lado a lado, ele tomava a linha e espremia a
      // legenda numa coluna de três palavras (08/out/2026).
      return (
        <div className={`sl-numero${b.valor.length > 9 ? " is-longo" : ""}`}>
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
        // As duas colunas começam no alto do bloco, com os dois rótulos na mesma linha (08/out/2026).
        // Antes o rótulo "Teoria" e o termo ficavam por cima da grade, e o "Na prática" começava na
        // altura da definição: solto no meio do bloco, como se estivesse centralizado.
        <aside className="sl-conceito" aria-label={`Conceito: ${b.termo}`}>
          <div className="sl-conceito-grade">
            <div className="sl-conceito-teoria">
              <p className="sl-eyebrow">Teoria</p>
              <h4 className="sl-conceito-termo">{b.termo}</h4>
              <p className="sl-conceito-texto">{ligado?.definicao ?? b.definicao}</p>
              {b.formula && <p className="sl-conceito-formula">{b.formula}</p>}
            </div>
            <div className="sl-conceito-pratica">
              <p className="sl-eyebrow">Na prática</p>
              <p className="sl-conceito-texto">{ligado?.naPratica ?? b.naPratica}</p>
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

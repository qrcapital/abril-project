import Link from "next/link";

import { href, type Aula } from "@/lib/curso";
import type { Bloco, Notebook } from "@/lib/notebook";

import Comparador from "./Comparador";
import Grafico from "./Grafico";

/**
 * O miolo do notebook: um componente por tipo de bloco. Componente de servidor; só o gráfico (a
 * dica no hover) e o simulador (os controles) descem para o cliente.
 *
 * `aulas` são as do módulo, em ordem: é por elas que o `aula` de um bloco (o ord dentro do módulo)
 * vira link de volta para a aula de origem.
 */
export default function Blocos({ notebook, aulas }: { notebook: Notebook; aulas: Aula[] }) {
  let capitulo = 0;
  return (
    <div className="sl-nb-canvas">
      {notebook.blocos.map((b, i) => {
        if (b.tipo === "capitulo") capitulo++;
        return (
          <div key={i}>
            <UmBloco bloco={b} numero={capitulo} demo={notebook.demo} />
            {b.aula !== undefined && b.tipo !== "capitulo" && <Origem aula={aulas[b.aula - 1]} />}
          </div>
        );
      })}
    </div>
  );
}

function Origem({ aula }: { aula: Aula | undefined }) {
  // Bloco que aponta para uma aula que não existe mais (aula apagada no admin) só perde o link.
  if (!aula) return null;
  return (
    <Link className="sl-origem" href={href(aula)}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
      Da aula {aula.numero ? `${aula.numero} · ` : ""}
      {aula.titulo}
    </Link>
  );
}

function UmBloco({ bloco: b, numero, demo }: { bloco: Bloco; numero: number; demo: boolean }) {
  switch (b.tipo) {
    case "capitulo":
      return (
        <header className="sl-cap" id={b.id}>
          <span className="sl-cap-num">Capítulo {String(numero).padStart(2, "0")}</span>
          <h2>{b.titulo}</h2>
          {b.resumo && <p>{b.resumo}</p>}
        </header>
      );
    case "texto":
      return (
        <div className={`sl-prosa${b.capitular ? " is-capitular" : ""}`}>
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
          forma={b.forma}
          eixoX={b.eixoX}
          series={b.series}
          formato={b.formato}
          nota={b.nota}
          ilustrativo={b.ilustrativo}
        />
      );
    case "comparador":
      return <Comparador bloco={b} demo={demo} />;
    case "tabela":
      return (
        <div className="sl-tabela-caixa">
          <table className="sl-tabela">
            {b.titulo && <caption>{b.titulo}</caption>}
            <thead>
              <tr>
                {b.colunas.map((c) => (
                  <th scope="col" key={c}>
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
                      <td key={j}>{celula}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {b.nota && <p className="sl-fig-nota">{b.nota}</p>}
        </div>
      );
    case "referencias":
      return (
        <section className="sl-refs" id="referencias" aria-labelledby="referencias-titulo">
          <h2 id="referencias-titulo">Referências</h2>
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

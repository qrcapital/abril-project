"use client";

import { useId, useState } from "react";

import { formatar, type CelulaMatriz, type FormatoDe, type Origem as TipoOrigem } from "@/lib/notebook";

import { useEntrada } from "./Entrada";
import Origem from "./Origem";

/**
 * Matriz 2×2, em dois modos:
 *
 * - `payoff`: teoria dos jogos. Cada célula traz o par (linhas, colunas), o primeiro número em
 *   tinta e o segundo em cinza, e a célula com `marca` (o equilíbrio) ganha o filete vermelho.
 * - `quadrante`: risco e retorno, ou qualquer leitura em dois eixos. Texto na célula.
 *
 * Passar o mouse, focar (Tab) ou tocar numa célula escreve a `explicacao` dela no painel embaixo,
 * que é uma região viva para o leitor de tela. Sem interação, o painel mostra a da célula marcada.
 */
export default function Matriz({
  titulo,
  subtitulo,
  modo,
  eixoLinhas,
  eixoColunas,
  linhas,
  colunas,
  celulas,
  formato,
  origem,
}: {
  titulo: string;
  subtitulo?: string;
  modo: "payoff" | "quadrante";
  eixoLinhas: string;
  eixoColunas: string;
  linhas: [string, string];
  colunas: [string, string];
  celulas: [[CelulaMatriz, CelulaMatriz], [CelulaMatriz, CelulaMatriz]];
  formato?: FormatoDe;
  origem: TipoOrigem;
}) {
  const ref = useEntrada<HTMLElement>();
  const idPainel = useId();
  const marcada = celulas.flatMap((l, i) => l.map((c, j) => ({ c, i, j }))).find((x) => x.c.marca);
  const [ativa, setAtiva] = useState<[number, number] | null>(null);
  const atual = ativa ? { c: celulas[ativa[0]][ativa[1]], i: ativa[0], j: ativa[1] } : marcada;
  const fmt = (v: number) => formatar(v, formato);

  return (
    <figure className="sl-matriz" ref={ref} data-modo={modo}>
      <figcaption className="sl-fig-cabeca">
        <h4 className="sl-fig-titulo">{titulo}</h4>
        {subtitulo && <p className="sl-fig-sub">{subtitulo}</p>}
      </figcaption>

      <div className="sl-matriz-corpo">
        <p className="sl-matriz-eixo-col" aria-hidden="true">
          {eixoColunas}
          {modo === "quadrante" && <span> →</span>}
        </p>
        <p className="sl-matriz-eixo-lin" aria-hidden="true">
          {modo === "quadrante" && <span>← </span>}
          {eixoLinhas}
        </p>
        <table className="sl-matriz-tabela" onMouseLeave={() => setAtiva(null)}>
          <caption className="sl-so-leitor">
            {titulo}. Linhas: {eixoLinhas}. Colunas: {eixoColunas}.
            {modo === "payoff" && " Em cada célula, o primeiro número é de quem escolhe nas linhas e o segundo, de quem escolhe nas colunas."}
          </caption>
          <thead>
            <tr>
              <td />
              {colunas.map((c) => (
                <th scope="col" key={c}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {celulas.map((linha, i) => (
              <tr key={linhas[i]}>
                <th scope="row">{linhas[i]}</th>
                {linha.map((c, j) => {
                  const ehAtual = atual?.i === i && atual?.j === j;
                  return (
                    <td
                      key={j}
                      tabIndex={c.explicacao ? 0 : undefined}
                      aria-describedby={c.explicacao ? idPainel : undefined}
                      className={[c.marca ? "is-marca" : "", ehAtual ? "is-ativa" : ""].join(" ").trim() || undefined}
                      onMouseEnter={() => setAtiva([i, j])}
                      onFocus={() => setAtiva([i, j])}
                      onClick={() => setAtiva([i, j])}
                      style={{ ["--q" as string]: i * 2 + j }}
                    >
                      {c.marca && <span className="sl-matriz-marca">{c.marca}</span>}
                      {c.valores && (
                        <span className="sl-matriz-par">
                          <b>{fmt(c.valores[0])}</b>
                          <span aria-hidden="true">,</span>
                          <span className="sl-so-leitor"> e </span>
                          <i>{fmt(c.valores[1])}</i>
                        </span>
                      )}
                      {c.texto && <span className="sl-matriz-texto">{c.texto}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="sl-matriz-painel" id={idPainel} aria-live="polite">
        {atual?.c.explicacao ? (
          <>
            <b>
              {linhas[atual.i]} × {colunas[atual.j]}.
            </b>{" "}
            {atual.c.explicacao}
          </>
        ) : (
          <span className="sl-matriz-dica">Passe o mouse ou use o Tab nas células para ler cada caso.</span>
        )}
      </p>
      {modo === "payoff" && (
        <p className="sl-matriz-legenda">
          Primeiro número: {eixoLinhas}. Segundo: {eixoColunas}.
        </p>
      )}
      <Origem origem={origem} />
    </figure>
  );
}

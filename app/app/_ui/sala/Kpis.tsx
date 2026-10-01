"use client";

import { useRef, useState } from "react";

import { formatar, resolverFormato, type Kpi, type Origem as TipoOrigem } from "@/lib/notebook";

import { useEntrada } from "./Entrada";
import Origem from "./Origem";

/**
 * Uma fileira de 2 a 4 números-chave: o número grande em algarismos tabulares, o rótulo, a
 * variação com sinal e cor, e a linha de origem embaixo. Os números contam do zero até o valor
 * quando a fileira entra na tela (e não contam com movimento reduzido, nem se já estavam à vista).
 *
 * O número que o leitor de tela lê é sempre o final: a contagem é só visual (`aria-hidden`).
 */
export default function Kpis({ titulo, itens, origem }: { titulo?: string; itens: Kpi[]; origem: TipoOrigem }) {
  // Fração da contagem, de 0 a 1. Começa em 1: o HTML do servidor já sai com o número certo.
  const [t, setT] = useState(1);
  const quadro = useRef(0);
  const ref = useEntrada<HTMLElement>(() => {
    const inicio = performance.now();
    const dur = 900;
    cancelAnimationFrame(quadro.current);
    const passo = (agora: number) => {
      const p = Math.min(1, (agora - inicio) / dur);
      setT(1 - Math.pow(1 - p, 3));
      if (p < 1) quadro.current = requestAnimationFrame(passo);
    };
    quadro.current = requestAnimationFrame(passo);
  });

  return (
    <figure className="sl-kpis" ref={ref} data-n={itens.length}>
      {titulo && (
        <figcaption>
          <h4 className="sl-fig-titulo">{titulo}</h4>
        </figcaption>
      )}
      <dl className="sl-kpis-grade">
        {itens.map((k) => {
          const f = resolverFormato(k.formato);
          const final = formatar(k.valor, f);
          const var_ = k.variacao;
          const fv = var_ ? { ...resolverFormato(var_.formato ?? k.formato), sinal: true } : null;
          const sentido = var_ ? (var_.valor > 0 ? "sobe" : var_.valor < 0 ? "desce" : null) : null;
          const tom = !var_?.bom || !sentido ? "neutro" : sentido === var_.bom ? "bom" : "ruim";
          return (
            <div key={k.rotulo} className={`sl-kpi${k.destaque ? " is-destaque" : ""}`}>
              <dt>{k.rotulo}</dt>
              <dd className="sl-kpi-valor">
                <span aria-hidden="true">{t >= 1 ? final : formatar(k.valor * t, f)}</span>
                <span className="sl-so-leitor">{final}</span>
              </dd>
              {var_ && fv && (
                <dd className="sl-kpi-var" data-tom={tom}>
                  <span aria-hidden="true">{sentido === "sobe" ? "▲" : sentido === "desce" ? "▼" : "•"}</span>{" "}
                  {formatar(var_.valor, fv)}
                  {var_.rotulo && <span className="sl-kpi-var-rot"> {var_.rotulo}</span>}
                </dd>
              )}
              {k.nota && <dd className="sl-kpi-nota">{k.nota}</dd>}
            </div>
          );
        })}
      </dl>
      <Origem origem={origem} />
    </figure>
  );
}

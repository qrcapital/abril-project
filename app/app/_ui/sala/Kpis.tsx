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
/**
 * Separa o valor formatado em moeda, número e unidade ("US$ 1,57 tri" vira "US$", "1,57" e "tri").
 * O número fica no corpo grande; a moeda e a unidade, menores, ao lado (08/out/2026). Com tudo no
 * mesmo corpo de 40px e sem quebra, "19,5% do PIB" e "13,75% a.a." passavam da coluna e se
 * sobrepunham ao KPI vizinho. O "%", o "×" e o sinal ficam no número: são parte dele.
 */
function partes(texto: string): { moeda: string; numero: string; unidade: string } {
  const m = texto.match(/^([−+]?)([^\d]*?)([\d.,]+[%×x]?)(.*)$/);
  if (!m) return { moeda: "", numero: texto, unidade: "" };
  const moeda = m[2].trim();
  // O sinal vai antes da moeda, como o `formatar` escreve: "−R$ 1,20".
  return { moeda: moeda ? m[1] + moeda : "", numero: (moeda ? "" : m[1]) + m[3], unidade: m[4].trim() };
}

function Valor({ texto }: { texto: string }) {
  const { moeda, numero, unidade } = partes(texto);
  return (
    <>
      {moeda && <span className="sl-kpi-unid">{moeda}</span>}
      {moeda && " "}
      <span className="sl-kpi-num">{numero}</span>
      {unidade && " "}
      {unidade && <span className="sl-kpi-unid">{unidade}</span>}
    </>
  );
}

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
                <span aria-hidden="true">
                  <Valor texto={t >= 1 ? final : formatar(k.valor * t, f)} />
                </span>
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

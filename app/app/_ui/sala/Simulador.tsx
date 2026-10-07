"use client";

import { useState, type ReactNode } from "react";

import {
  CHAVES_MODELO,
  PARAMETROS_PADRAO,
  cambioPatrimonio,
  fatiaDeMenorVolatilidade,
  formatar,
  jurosDuasMoedas,
  poderDeCompra,
  primarioQueEstabiliza,
  trajetoriaDivida,
  volatilidadeCarteira,
  type BlocoSimulador,
  type FormatoDe,
  type ModeloSimulador,
  type Parametro,
} from "@/lib/notebook";

import Grafico, { type PropsGrafico } from "./Grafico";
import Origem from "./Origem";

/**
 * O simulador do notebook: controles à esquerda, resultado e gráfico à direita, recalculados a
 * cada movimento, tudo no navegador. Declarativo: o conteúdo escolhe o `modelo` e ajusta os
 * parâmetros que quiser (valor, faixa, passo, rótulo, ou `fixo` para virar premissa declarada);
 * o que faltar vem de `PARAMETROS_PADRAO`, em `lib/notebook.ts`, onde também moram as contas.
 *
 * Todo simulador termina na linha "Ilustrativo" com o que a conta ignora: o que o aluno leva
 * daqui é o raciocínio, não o número.
 *
 * Substituiu o `Comparador` em 01/out/2026. O bloco `comparador` dos notebooks de demonstração
 * continua valendo e cai aqui por `deComparador` (`lib/notebook.ts`).
 */

type Controle = Required<Omit<Parametro, "ajuda" | "fixo">> & { ajuda?: string; fixo?: boolean; formato: FormatoDe };
type Valores = Record<string, number>;

function controlesDe(b: BlocoSimulador): [string, Controle][] {
  const padrao = PARAMETROS_PADRAO[b.modelo] as Record<string, Controle>;
  const ajuste = (b.parametros ?? {}) as Record<string, Parametro | undefined>;
  return (CHAVES_MODELO[b.modelo] as readonly string[]).map((k) => [k, { ...padrao[k], ...ajuste[k] } as Controle]);
}

type Saida = {
  principal: string;
  frase: ReactNode;
  extras?: { rotulo: string; valor: string }[];
  grafico: PropsGrafico;
  aviso: string;
};

const anosX = (n: number) => Array.from({ length: n + 1 }, (_, t) => (t === 0 ? "Hoje" : `Ano ${t}`));
const r1 = (v: number) => Math.round(v * 10) / 10;

function calcular(modelo: ModeloSimulador, v: Valores, fmt: (k: string, x: number) => string): Saida {
  switch (modelo) {
    case "dividaPib": {
      const anos = Math.round(v.anos);
      const d = trajetoriaDivida(v.divida, v.juros, v.crescimento, v.primario, anos).map(r1);
      const fim = d[anos];
      const estab = primarioQueEstabiliza(v.divida, v.juros, v.crescimento);
      const delta = fim - v.divida;
      return {
        principal: formatar(fim, { sufixo: "% do PIB", casas: 1 }),
        frase: (
          <>
            de dívida em {anos} anos, partindo de {fmt("divida", v.divida)}. Com juro real de {fmt("juros", v.juros)} e
            crescimento de {fmt("crescimento", v.crescimento)}, a dívida{" "}
            {Math.abs(delta) < 0.5 ? "fica praticamente parada" : delta > 0 ? `sobe ${formatar(delta, "pp")}` : `cai ${formatar(-delta, "pp")}`}.
          </>
        ),
        extras: [
          { rotulo: "Primário que estabiliza a dívida hoje", valor: formatar(estab, { sufixo: "% do PIB", casas: 2, sinal: true }) },
          { rotulo: "Diferença entre juro e crescimento (r − g)", valor: formatar(v.juros - v.crescimento, "pp") },
        ],
        grafico: {
          titulo: "Dívida pública, em % do PIB",
          forma: "linha",
          eixoX: anosX(anos),
          series: [{ nome: "Dívida / PIB", valores: d }],
          formato: { sufixo: "%", casas: 1 },
          referencia: { valor: v.divida, rotulo: "Nível de hoje" },
        },
        aviso:
          "Aritmética da dívida com juro, crescimento e primário constantes: d' = d(1 + r)/(1 + g) − s. Ignora a reação dos juros à própria dívida, a inflação e ajustes patrimoniais. Não é projeção oficial.",
      };
    }
    case "diversificacao": {
      const pontos = Array.from({ length: 21 }, (_, i) => i * 5);
      const vols = pontos.map((p) => r1(volatilidadeCarteira(p / 100, v.volBrasil, v.volExterior, v.correlacao)));
      const atual = volatilidadeCarteira(v.fatia / 100, v.volBrasil, v.volExterior, v.correlacao);
      const melhor = fatiaDeMenorVolatilidade(v.volBrasil, v.volExterior, v.correlacao);
      return {
        principal: formatar(atual, { sufixo: "%", casas: 1 }),
        frase: (
          <>
            de volatilidade anual estimada com {fmt("fatia", v.fatia)} fora do Brasil, contra {formatar(vols[0], "pct")} com tudo aqui.
          </>
        ),
        extras: [
          { rotulo: "Fatia de menor oscilação", valor: formatar(melhor, { sufixo: "% fora" }) },
          { rotulo: "Volatilidade nesse ponto", valor: formatar(volatilidadeCarteira(melhor / 100, v.volBrasil, v.volExterior, v.correlacao), "pct") },
        ],
        grafico: {
          titulo: "Volatilidade estimada por fatia no exterior",
          forma: "linha",
          eixoX: pontos.map((p) => `${p}%`),
          series: [{ nome: "Volatilidade anual", valores: vols }],
          formato: { sufixo: "%", casas: 1 },
          destaque: Math.round(v.fatia / 5),
        },
        aviso:
          "Conta de carteira de dois ativos (Markowitz): σ = √(w²σ₁² + (1 − w)²σ₂² + 2w(1 − w)ρσ₁σ₂), sobre hipóteses escolhidas por você. Não usa dado de mercado, não prevê retorno e não é recomendação de alocação.",
      };
    }
    case "cambioPatrimonio": {
      const anos = Math.round(v.anos);
      const r = cambioPatrimonio(v.patrimonio, v.cambio, v.depreciacao, anos, v.fatia / 100);
      const usd = { base: "usd", casas: 0, compacto: true } as const;
      return {
        principal: formatar(r.usdComFatia[anos], usd),
        frase: (
          <>
            é quanto o patrimônio vale em dólar em {anos} {anos === 1 ? "ano" : "anos"}, com {fmt("fatia", v.fatia)} convertidos hoje.
            Com tudo em reais, seriam {formatar(r.usdTudoReais[anos], usd)}.
          </>
        ),
        extras: [
          { rotulo: "Dólar no fim do período", valor: formatar(r.taxa[anos], "brl") },
          { rotulo: "A mesma carteira, medida em reais", valor: formatar(r.brlComFatia[anos], { base: "brl", casas: 0, compacto: true }) },
        ],
        grafico: {
          titulo: "Patrimônio medido em dólar",
          forma: "linha",
          eixoX: anosX(anos),
          series: [
            { nome: `Com ${fmt("fatia", v.fatia)} em dólar`, valores: r.usdComFatia.map(Math.round), destaque: true },
            { nome: "Tudo em reais", valores: r.usdTudoReais.map(Math.round) },
          ],
          formato: usd,
        },
        aviso:
          "Isola o câmbio: o real perde uma taxa fixa por ano e nada rende. Ignora juros, inflação, impostos e o custo da conversão. Não é previsão do câmbio nem recomendação.",
      };
    }
    case "jurosCompostos": {
      const anos = Math.round(v.anos);
      const r = jurosDuasMoedas({
        inicial: v.inicial,
        aporte: v.aporte,
        fatia: v.fatia / 100,
        taxaBrl: v.taxaBrl,
        taxaUsd: v.taxaUsd,
        cambio: v.cambio,
        depreciacao: v.depreciacao,
        anos,
      });
      const brl = { base: "brl", casas: 0, compacto: true } as const;
      const fim = r.parteReais[anos] + r.parteDolar[anos];
      const dif = fim - r.tudoReais[anos];
      return {
        principal: formatar(fim, brl),
        frase: (
          <>
            em {anos} {anos === 1 ? "ano" : "anos"}, medidos em reais, com {fmt("fatia", v.fatia)} de cada aporte em dólar. Com tudo em
            reais, seriam {formatar(r.tudoReais[anos], brl)}.
          </>
        ),
        extras: [
          { rotulo: "Diferença para a carteira só em reais", valor: formatar(dif, { ...brl, sinal: true }) },
          { rotulo: "Parte em dólar, em reais, no fim", valor: formatar(r.parteDolar[anos], brl) },
        ],
        grafico: {
          titulo: "Patrimônio por moeda, medido em reais",
          forma: "barraEmpilhada",
          eixoX: anosX(anos),
          series: [
            { nome: "Parte em reais", valores: r.parteReais.map(Math.round), cor: "cinzaClaro" },
            { nome: "Parte em dólar (em R$)", valores: r.parteDolar.map(Math.round), cor: "acento" },
          ],
          formato: brl,
        },
        aviso:
          "Taxas e depreciação constantes, aporte somado no fim de cada ano, sem imposto, IOF ou custo de remessa. A parte em dólar é convertida ao câmbio de cada ano. Ilustra o mecanismo, não promete retorno.",
      };
    }
    case "poderDeCompra": {
      const anos = Math.round(v.anos);
      const eixo = Array.from({ length: anos + 1 }, (_, t) => t);
      const sua = eixo.map((t) => r1(poderDeCompra(v.fatia / 100, v.depreciacao, t)));
      const tudo = eixo.map((t) => r1(poderDeCompra(0, v.depreciacao, t)));
      return {
        principal: formatar(sua[anos], { casas: 1 }),
        frase: (
          <>
            é o poder de compra em dólar da carteira depois de {anos} {anos === 1 ? "ano" : "anos"}, partindo de 100. Com tudo em
            reais seriam {formatar(tudo[anos], { casas: 1 })}.
          </>
        ),
        grafico: {
          titulo: "Poder de compra em dólar, início = 100",
          forma: "linha",
          eixoX: anosX(anos),
          series: [
            { nome: `Com ${fmt("fatia", v.fatia)} em dólar`, valores: sua, destaque: true },
            { nome: "Tudo em reais", valores: tudo },
          ],
          formato: { casas: 1 },
          referencia: { valor: 100, rotulo: "Início" },
        },
        aviso:
          "Isola só o efeito do câmbio, com uma perda anual fixa e hipotética. Ignora rendimento, inflação, impostos e custos. Não é previsão do câmbio nem recomendação de alocação.",
      };
    }
  }
}

export default function Simulador({ bloco }: { bloco: BlocoSimulador }) {
  const controles = controlesDe(bloco);
  const [valores, setValores] = useState<Valores>(() => Object.fromEntries(controles.map(([k, c]) => [k, c.valor])));
  const porChave = Object.fromEntries(controles);
  const fmt = (k: string, x: number) => formatar(x, porChave[k]?.formato);
  const saida = calcular(bloco.modelo, valores, fmt);
  const fixos = controles.filter(([, c]) => c.fixo);

  return (
    <section className="sl-sim" id={bloco.id} aria-labelledby={`${bloco.id}-titulo`}>
      <header className="sl-sim-cabeca">
        <p className="sl-eyebrow sl-sim-rotulo">Simulador</p>
        <h4 id={`${bloco.id}-titulo`} className="sl-fig-titulo">
          {bloco.titulo}
        </h4>
        {bloco.descricao && <p className="sl-fig-sub">{bloco.descricao}</p>}
      </header>

      <div className="sl-sim-grade">
        <div className="sl-sim-controles">
          {controles
            .filter(([, c]) => !c.fixo)
            .map(([k, c]) => {
              const id = `${bloco.id}-${k}`;
              const texto = fmt(k, valores[k]);
              return (
                <div className="sl-controle" key={k}>
                  <label htmlFor={id}>
                    <span>{c.rotulo}</span>
                    <output htmlFor={id}>{texto}</output>
                  </label>
                  <input
                    id={id}
                    type="range"
                    min={c.min}
                    max={c.max}
                    step={c.passo}
                    value={valores[k]}
                    aria-valuetext={texto}
                    onChange={(e) => {
                      // Arredonda ao passo: o range devolve 0,30000000000000004.
                      const casas = (String(c.passo).split(".")[1] ?? "").length;
                      const x = Number(Number(e.target.value).toFixed(casas));
                      setValores((atual) => ({ ...atual, [k]: x }));
                    }}
                  />
                  {c.ajuda && <small>{c.ajuda}</small>}
                </div>
              );
            })}
          {fixos.length > 0 && (
            <p className="sl-sim-fixos">
              Premissa fixa: {fixos.map(([k, c]) => `${c.rotulo.toLowerCase()} ${fmt(k, valores[k])}`).join("; ")}.
            </p>
          )}
        </div>

        <div className="sl-sim-saida">
          <div className="sl-sim-resultado" aria-live="polite">
            <b>{saida.principal}</b>
            <p>{saida.frase}</p>
          </div>
          {saida.extras && (
            <dl className="sl-sim-extras">
              {saida.extras.map((x) => (
                <div key={x.rotulo}>
                  <dt>{x.rotulo}</dt>
                  <dd>{x.valor}</dd>
                </div>
              ))}
            </dl>
          )}
          <Grafico {...saida.grafico} nivel={5} baixo />
        </div>
      </div>
      <Origem origem={{ ilustrativo: true, nota: bloco.aviso ?? saida.aviso }} />
    </section>
  );
}

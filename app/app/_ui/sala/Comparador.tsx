"use client";

import { useState } from "react";

import { formatar, poderDeCompra, volatilidadeCarteira, type Bloco } from "@/lib/notebook";

import Grafico from "./Grafico";

type BlocoComparador = Extract<Bloco, { tipo: "comparador" }>;

/**
 * Simulador do notebook. Dois modelos, os dois de conta fechada e hipóteses à vista, porque o
 * que o aluno leva daqui é o raciocínio, não o número: a tela diz em toda versão que o resultado
 * é ilustrativo e o que a conta ignora.
 *
 * Tudo roda no navegador, sem ida ao servidor: mexer no controle e ver o gráfico andar é o ponto.
 */
export default function Comparador({ bloco, demo }: { bloco: BlocoComparador; demo: boolean }) {
  return (
    <section className="sl-comp sl-escuro" id={bloco.id} aria-labelledby={`${bloco.id}-titulo`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <h2 id={`${bloco.id}-titulo`}>{bloco.titulo}</h2>
        {demo && <span className="sl-chip sl-chip-demo">Simulação ilustrativa</span>}
      </div>
      {bloco.descricao && <p className="sl-comp-desc">{bloco.descricao}</p>}
      {bloco.modelo === "diversificacao" ? (
        <Diversificacao h={bloco.hipoteses} />
      ) : (
        <Cambio h={bloco.hipoteses} />
      )}
    </section>
  );
}

function Controle({
  id,
  rotulo,
  valor,
  texto,
  min,
  max,
  passo,
  ajuda,
  mudar,
}: {
  id: string;
  rotulo: string;
  valor: number;
  texto: string;
  min: number;
  max: number;
  passo: number;
  ajuda?: string;
  mudar: (v: number) => void;
}) {
  return (
    <div className="sl-controle">
      <label htmlFor={id}>
        {rotulo}
        <output htmlFor={id}>{texto}</output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor}
        aria-valuetext={texto}
        onChange={(e) => mudar(Number(e.target.value))}
      />
      {ajuda && <small>{ajuda}</small>}
    </div>
  );
}

const pct = (v: number, casas = 0) => formatar(v, { sufixo: "%", casas });

function Diversificacao({ h }: { h: { volBrasil: number; volExterior: number; correlacao: number; fatia: number } }) {
  // Fatia em pontos percentuais inteiros, de 5 em 5: é o mesmo passo dos pontos do gráfico, e a
  // marca do gráfico cai sempre num ponto que existe.
  const [fatia, setFatia] = useState(Math.round(h.fatia * 20) * 5);
  const [volBrasil, setVolBrasil] = useState(h.volBrasil);
  const [correlacao, setCorrelacao] = useState(h.correlacao);

  const pontos = Array.from({ length: 21 }, (_, i) => i * 5);
  const vols = pontos.map((p) => Math.round(volatilidadeCarteira(p / 100, volBrasil, h.volExterior, correlacao) * 10) / 10);
  const atual = vols[fatia / 5];
  // O ponto de menor oscilação, de 1 em 1, para a frase não depender da grade do gráfico.
  let melhor = 0;
  let melhorVol = Infinity;
  for (let p = 0; p <= 100; p++) {
    const v = volatilidadeCarteira(p / 100, volBrasil, h.volExterior, correlacao);
    if (v < melhorVol - 1e-9) {
      melhorVol = v;
      melhor = p;
    }
  }

  return (
    <>
      <div className="sl-comp-grade">
        <div className="sl-comp-controles">
          <Controle
            id="div-fatia"
            rotulo="Fatia no exterior"
            valor={fatia}
            texto={pct(fatia)}
            min={0}
            max={100}
            passo={5}
            mudar={setFatia}
          />
          <Controle
            id="div-vol"
            rotulo="Volatilidade da parte no Brasil"
            valor={volBrasil}
            texto={pct(volBrasil)}
            min={5}
            max={40}
            passo={1}
            ajuda={`A parte no exterior fica fixa em ${pct(h.volExterior)} ao ano.`}
            mudar={setVolBrasil}
          />
          <Controle
            id="div-corr"
            rotulo="Correlação entre as duas partes"
            valor={correlacao}
            texto={formatar(correlacao, { casas: 1 })}
            min={-0.5}
            max={1}
            passo={0.1}
            ajuda="1 = andam sempre juntas. 0 = não têm relação. Negativa = tendem a andar em sentidos opostos."
            mudar={(v) => setCorrelacao(Math.round(v * 10) / 10)}
          />
          <div className="sl-comp-resultado" aria-live="polite">
            <b>{pct(atual, 1)}</b>
            <span>
              de volatilidade anual estimada com {pct(fatia)} fora do Brasil, contra {pct(vols[0], 1)} com
              tudo aqui. Com estas hipóteses, a menor oscilação fica perto de {pct(melhor)} no exterior.
            </span>
          </div>
        </div>
        <Grafico
          nivel={4}
          titulo="Volatilidade estimada por fatia no exterior"
          forma="linha"
          eixoX={pontos.map((p) => pct(p))}
          series={[{ nome: "Volatilidade anual", valores: vols }]}
          formato={{ sufixo: "%", casas: 1 }}
          destaque={fatia / 5}
        />
      </div>
      <p className="sl-comp-aviso">
        Conta de carteira de dois ativos (Markowitz) sobre hipóteses escolhidas por você. Não usa
        dado de mercado, não prevê retorno e não é recomendação de alocação.
      </p>
    </>
  );
}

function Cambio({ h }: { h: { depreciacao: number; anos: number; fatia: number } }) {
  const [depreciacao, setDepreciacao] = useState(h.depreciacao);
  const [anos, setAnos] = useState(h.anos);
  const [fatia, setFatia] = useState(Math.round(h.fatia * 20) * 5);

  const eixo = Array.from({ length: anos + 1 }, (_, t) => t);
  const r = (v: number) => Math.round(v * 10) / 10;
  const suaCarteira = eixo.map((t) => r(poderDeCompra(fatia / 100, depreciacao, t)));
  const tudoReais = eixo.map((t) => r(poderDeCompra(0, depreciacao, t)));
  const final = suaCarteira[anos];

  return (
    <>
      <div className="sl-comp-grade">
        <div className="sl-comp-controles">
          <Controle
            id="cam-dep"
            rotulo="Real perde, por ano, contra o dólar"
            valor={depreciacao}
            texto={pct(depreciacao, 1)}
            min={0}
            max={15}
            passo={0.5}
            mudar={setDepreciacao}
          />
          <Controle
            id="cam-anos"
            rotulo="Horizonte"
            valor={anos}
            texto={`${anos} ${anos === 1 ? "ano" : "anos"}`}
            min={1}
            max={30}
            passo={1}
            mudar={setAnos}
          />
          <Controle
            id="cam-fatia"
            rotulo="Fatia já em dólar"
            valor={fatia}
            texto={pct(fatia)}
            min={0}
            max={100}
            passo={5}
            mudar={setFatia}
          />
          <div className="sl-comp-resultado" aria-live="polite">
            <b>{formatar(final, { casas: 1 })}</b>
            <span>
              é o poder de compra em dólar da carteira depois de {anos} {anos === 1 ? "ano" : "anos"}, partindo
              de 100. Com tudo em reais seriam {formatar(tudoReais[anos], { casas: 1 })}.
            </span>
          </div>
        </div>
        <Grafico
          nivel={4}
          titulo="Poder de compra em dólar, início = 100"
          forma="linha"
          eixoX={eixo.map((t) => (t === 0 ? "Hoje" : `Ano ${t}`))}
          series={[
            { nome: `Com ${pct(fatia)} em dólar`, valores: suaCarteira },
            { nome: "Tudo em reais", valores: tudoReais },
          ]}
          formato={{ casas: 1 }}
        />
      </div>
      <p className="sl-comp-aviso">
        Isola só o efeito do câmbio, com uma perda anual fixa e hipotética. Ignora rendimento,
        inflação, impostos e custos. Não é previsão do câmbio nem recomendação de alocação.
      </p>
    </>
  );
}

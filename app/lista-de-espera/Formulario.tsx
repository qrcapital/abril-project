"use client";

import { useState } from "react";
import CartaoConfirmado from "./CartaoConfirmado";

/**
 * Formulário da pré-lista. Uma conversão só: nome, e-mail, WhatsApp e uma
 * pergunta de qualificação opcional.
 *
 * **Quem grava o lead é o RD Station, pela captura automática de Leads.** Não há
 * envio nosso: o código de monitoramento (em `Tela.tsx`) escuta o submit deste
 * `<form>` e sobe os campos. Daí três coisas que parecem decoração e não são —
 * o `id`, que é como o RD batiza o formulário no painel; o hidden de
 * `investe_fora`, porque os chips são `<button>` e a captura só enxerga campo de
 * formulário; e o hidden de `lgpd`, que registra a base legal depois que a caixa
 * de aceite saiu.
 *
 * O container `#rd-form-lista-de-espera` é a costura marcada no design, para o
 * caminho alternativo (embed oficial do RD dentro do container, sobrescrevendo o
 * CSS do widget) não precisar remexer no layout.
 */

const OPCOES = ["Ainda não", "Só um pouco", "Sim, já invisto"] as const;

/** Pendência do cliente (item 23 do PENDENCIAS-LP). Vazio: o texto do aceite sai
 *  sem link, que é melhor que um link morto numa tela que coleta dado pessoal. */
const POLITICA = process.env.NEXT_PUBLIC_POLITICA_PRIVACIDADE_URL ?? "";

/** Dígitos apenas, no máximo 11: (99) → (99) 9999 → (99) 9999-9999 → (99) 99999-9999. */
function mascararTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function Formulario() {
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [investidor, setInvestidor] = useState("");
  const [telefone, setTelefone] = useState("");

  if (enviado) return <CartaoConfirmado />;

  /**
   * `preventDefault` cancela a navegação, e só ela: os outros ouvintes do submit
   * continuam disparando, porque não chamamos `stopPropagation`. É por isso que o
   * RD captura mesmo sendo este handler o que "trata" o envio.
   *
   * A espera de 400ms antes de trocar o card não é enfeite. Trocar o estado
   * desmonta o `<form>`, e o RD lê os campos DEPOIS do evento; desmontar no mesmo
   * quadro corre o risco de arrancar o formulário debaixo dele. O teste que
   * validou a captura rodava com um POST nosso no meio, que dava exatamente essa
   * janela — ela ficou de propósito quando o POST saiu. **Encurtar ou remover
   * isto pode fazer o lead deixar de chegar no RD, sem erro nenhum na tela.**
   * O rótulo em gerúndio faz a espera se ler como resposta, não como travada.
   */
  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setTimeout(() => setEnviado(true), 400);
  }

  return (
    // O id é como a captura automática do RD batiza o formulário no painel: sem
    // ele o lead cai num nome genérico e fica difícil de achar.
    <form
      id="form-lista-de-espera"
      className="le-card le-card-glow"
      onSubmit={enviar}
      noValidate={false}
    >
      <div className="le-card-head">
        <h2 className="le-h2">Entre na pré-lista</h2>
        <p className="le-sub">Sem custo e sem compromisso.</p>
      </div>

      <div id="rd-form-lista-de-espera" className="le-campos">
        <label className="le-campo">
          <span className="le-rotulo le-rotulo-campo">Nome completo</span>
          <input
            className="le-input"
            name="nome"
            type="text"
            required
            autoComplete="name"
            placeholder="Como devemos te chamar"
          />
        </label>

        <label className="le-campo">
          <span className="le-rotulo le-rotulo-campo">E-mail</span>
          <input
            className="le-input"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="seu@email.com"
          />
        </label>

        <label className="le-campo">
          <span className="le-rotulo le-rotulo-campo">WhatsApp</span>
          <input
            className="le-input"
            name="telefone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            value={telefone}
            onChange={(ev) => setTelefone(mascararTelefone(ev.target.value))}
          />
        </label>

        <div className="le-chips-bloco">
          <span className="le-rotulo le-rotulo-campo" id="le-investe">
            Você já investe fora do Brasil?
          </span>
          {/* Grupo de escolha única em botões, não <select>: clicar no ativo
              desmarca, porque a pergunta é opcional. */}
          <div className="le-chips" role="group" aria-labelledby="le-investe">
            {OPCOES.map((opcao) => {
              const ativo = investidor === opcao;
              return (
                <button
                  key={opcao}
                  type="button"
                  className="le-chip"
                  aria-pressed={ativo}
                  onClick={() => setInvestidor(ativo ? "" : opcao)}
                >
                  {opcao}
                </button>
              );
            })}
          </div>
          {/* Os chips são <button>, e a captura automática do RD só enxerga
              campo de formulário. Sem este hidden a resposta da qualificação
              não sai da página. */}
          <input type="hidden" name="investe_fora" value={investidor} />
        </div>
      </div>

      {/* Sem caixa de aceite: o consentimento é o próprio envio, e o aviso fica
          acima do botão para ser lido antes do ato, não depois.

          O hidden existe para o registro não sumir: a captura automática do RD
          só enxerga campo de formulário, e sem ele a base legal da conversão
          chegaria em branco no painel. */}
      <p className="le-lgpd">
        Ao enviar, você autoriza o contato da VEJA Negócios e do BlockTrends sobre esta
        formação e concorda com a{" "}
        {POLITICA
          ? <a href={POLITICA} target="_blank" rel="noopener noreferrer">Política de Privacidade · LGPD</a>
          : "Política de Privacidade · LGPD"}
        .
      </p>
      <input type="hidden" name="lgpd" value="aceito-no-envio" />

      {/* Botão em trabalho (DESIGN.md §3): o rótulo vira gerúndio, o botão
          desabilita e anuncia aria-busy. Sem spinner, e sem travar largura —
          este é width:100%, então a tela não pula na troca de rótulo. */}
      <button className="le-cta" type="submit" disabled={enviando} aria-busy={enviando}>
        {enviando ? "Enviando..." : "Quero receber o convite →"}
      </button>

      <p className="le-micro">
        Leva menos de um minuto. Você recebe o convite da live de lançamento e o aviso da
        abertura.
      </p>
    </form>
  );
}

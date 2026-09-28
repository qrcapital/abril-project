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

/**
 * Dígitos apenas, no máximo 11: (99) → (99) 9999 → (99) 9999-9999 → (99) 99999-9999.
 *
 * O descarte do 55 não é firula: colar `+55 11 99999-9999`, que é exatamente o formato que o
 * WhatsApp copia, dava os dígitos `5511999999999`, e o corte cego nos 11 primeiros exibia
 * `(55) 11999-9999`. Um DDD 55 que não existe, sem aviso nenhum, num campo cujo rótulo é
 * "WhatsApp" e portanto convida à colagem. A condição pede 12 ou 13 dígitos para não confundir
 * com um número local que comece por 55, como o DDD de Caxias do Sul.
 */
function mascararTelefone(v: string) {
  let bruto = v.replace(/\D/g, "");
  if (bruto.length > 11 && bruto.startsWith("55")) bruto = bruto.slice(2);
  const d = bruto.slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/**
 * O RD Station está vivo nesta página?
 *
 * Os quatro nomes são os globais que o loader publica: dois da captura de formulário, um do
 * rastreador e a fila que o snippet cria antes de tudo. Basta um para sabermos que o script
 * executou, e portanto que a captura do submit tem quem a escute.
 *
 * ARMADILHA: isto é API interna de terceiro e pode mudar de nome sem aviso. Por isso ela nunca é a
 * única condição para confirmar o envio, só a mais generosa das duas. Ver o comentário de `enviar`.
 */
function rdEstaDePe(): boolean {
  const w = window as unknown as Record<string, unknown>;
  return ["RDStationForms", "RdIntegration", "rdtracker", "_rdsQueue"].some(
    (nome) => w[nome] != null,
  );
}

export default function Formulario() {
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(false);
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
   * quadro corre o risco de arrancar o formulário debaixo dele. **Encurtar ou
   * remover isto pode fazer o lead deixar de chegar no RD, sem erro nenhum na
   * tela.** O rótulo em gerúndio faz a espera se ler como resposta, não como
   * travada. A espera do POST abaixo já cobre esses 400ms na maioria dos casos, e
   * o `Promise.all` garante o piso mesmo quando a rota responde na hora.
   *
   * ┌─ O QUE MUDOU EM 28/set/2026, E POR QUÊ ───────────────────────────────────┐
   * │ Até aqui o card "Você está na lista" aparecia SEMPRE, incondicionalmente.  │
   * │ Como quem grava o lead é a captura automática do RD, carregada de um       │
   * │ CloudFront de terceiro, bastava um bloqueador de anúncio, uma extensão de  │
   * │ privacidade ou um DNS corporativo para o envio não fazer absolutamente     │
   * │ nada — e a pessoa lia que estava na lista. Sem erro no console, sem retry, │
   * │ sem log. Falha silenciosa e total, na única conversão da campanha.         │
   * └───────────────────────────────────────────────────────────────────────────┘
   *
   * A confirmação passou a exigir UM dos dois canais de pé:
   *
   * - o RD, detectado pelos globais que o loader publica;
   * - a nossa rota de consentimento, que responde ok.
   *
   * Com a nossa rota ok já temos nome e e-mail em base própria, então o contato é
   * recuperável mesmo que o RD tenha ficado pelo caminho, e confirmar é honesto. A
   * detecção do RD é o caminho de misericórdia: se ele está vivo, nem a nossa rota
   * precisa ter respondido.
   *
   * POR QUE NÃO DEPENDER SÓ DA DETECÇÃO DO RD: os nomes desses globais são API
   * interna de terceiro e podem mudar sem aviso. Se mudarem, a página não passa a
   * recusar envio de todo mundo — ela cai no outro canal, que é nosso.
   */
  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;

    const form = e.currentTarget;
    const campo = (n: string) =>
      form.querySelector<HTMLInputElement>(`[name="${n}"]`)?.value.trim() ?? "";
    const email = campo("email");

    setEnviando(true);
    setErro(false);

    // Registro do consentimento no NOSSO log (migration 0023). Antes disto o único registro de
    // quem concordou com o quê vivia no RD Station, e a pergunta "qual versão da Política esta
    // pessoa leu?" não tinha resposta nossa. Agora ele acumula um segundo papel: é a prova de
    // que o envio chegou em algum lugar.
    //
    // O timeout é curto de propósito. Esta requisição virou bloqueante, então o pior caso dela
    // agora é tempo de tela: 2,5s é mais que o suficiente para uma rota que só insere duas
    // linhas, e é pouco o bastante para ninguém achar que o botão travou.
    const nosso = (async () => {
      if (!email) return false;
      const corta = AbortSignal.timeout(2_500);
      try {
        const r = await fetch("/api/consentimento", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, nome: campo("nome") }),
          signal: corta,
        });
        return r.ok;
      } catch {
        return false;
      }
    })();

    const [nossoOk] = await Promise.all([
      nosso,
      new Promise((pronto) => setTimeout(pronto, 400)),
    ]);

    if (nossoOk || rdEstaDePe()) setEnviado(true);
    else {
      setEnviando(false);
      setErro(true);
    }
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
            // Sem o pattern, `required` aceitava "(1" como WhatsApp válido: o navegador só
            // conferia que o campo não estava vazio. O `title` é o que ele mostra quando
            // recusa, então precisa dizer o formato, não repetir o rótulo.
            pattern="\(\d{2}\) \d{4,5}-\d{4}"
            title="Digite o DDD e o número, no formato (11) 99999-9999"
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
      {/* Os dois `le-junto` são nomes próprios que não podem partir no meio de
          uma linha: a marca e o nome da política. O resto do aviso quebra
          livre, com as linhas igualadas pelo CSS. */}
      <p className="le-lgpd">
        Ao enviar, você autoriza o contato da <span className="le-junto">VEJA Negócios</span> e do
        BlockTrends sobre esta formação e concorda com a{" "}
        {POLITICA
          ? <a className="le-junto" href={POLITICA} target="_blank" rel="noopener noreferrer">Política de Privacidade · LGPD</a>
          : <span className="le-junto">Política de Privacidade · LGPD</span>}
        .
      </p>
      <input type="hidden" name="lgpd" value="aceito-no-envio" />

      {/* Botão em trabalho (DESIGN.md §3): o rótulo vira gerúndio, o botão
          desabilita e anuncia aria-busy. Sem spinner, e sem travar largura —
          este é width:100%, então a tela não pula na troca de rótulo. */}
      {/* `role="alert"` para o leitor de tela anunciar sozinho: a mensagem nasce
          depois de um clique, e sem isso ela apareceria em silêncio para quem
          não está olhando a tela.

          O texto cita o bloqueador porque essa é a causa de longe mais comum de
          os dois canais caírem juntos, e porque é a única que a pessoa consegue
          resolver sozinha. Sem acusar: "pode estar barrando". */}
      {erro && (
        <p className="le-erro" role="alert">
          Não deu para concluir o envio agora. Se você usa bloqueador de anúncios, ele pode estar
          barrando o cadastro; desative para este site e tente de novo. Seus dados continuam
          preenchidos.
        </p>
      )}

      <button className="le-cta" type="submit" disabled={enviando} aria-busy={enviando}>
        {enviando ? "Enviando..." : "Quero receber o convite"}
      </button>

    </form>
  );
}

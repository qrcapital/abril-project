/**
 * Card de confirmação da pré-lista.
 *
 * Ocupa o lugar e as medidas do formulário, no mesmo card. Decisão de 02/set: a
 * confirmação acontece aqui, sem redirect para página de obrigado — é o fallback
 * do design, promovido a caminho único. Fica como componente para o dia em que
 * uma página de obrigado for pedida: ela nasce com dez linhas em volta disto.
 *
 * A copy promete convite da live, exclusividade da lista e o aviso da abertura.
 * Nada de vaga garantida, número de professores ou data (ver "Copy: o que não
 * prometer" no handoff).
 *
 * **O canal é só o e-mail.** A versão anterior prometia também o WhatsApp, e o
 * disparo por WhatsApp não está montado: o campo é coletado para a operação, não
 * para entrega automática. Se um dia entrar, a frase volta aqui.
 *
 * A primeira frase vem de `live.ts` e muda sozinha quando a live passa: prometer
 * "o convite da live" no dia seguinte à transmissão seria a mentira mais cara da
 * página, porque é dita a quem acabou de entregar nome, e-mail e telefone.
 */
import contato from "@/lib/contato.json";

import { LIVE_EM, copyDaLive, livePassou } from "./live";

/**
 * Plano B do e-mail (06/out/2026). O José Henrique se cadastrou e o RD descartou o e-mail de
 * confirmação na hora ("descartado permanentemente", endereço desativado no RD), sem nada na tela
 * que avisasse. Quem depende só do e-mail fica sem a data. Agora o cartão entrega a data direto na
 * agenda e diz para onde ir se a confirmação não chegar.
 */
const FIM_LIVE = new Date(LIVE_EM.getTime() + 2 * 3_600_000);
const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const TITULO = "Live Estratégia Internacional (VEJA Negócios e BlockTrends)";
const DETALHE = "Live gratuita de lançamento, ao vivo no YouTube da VEJA Negócios. O link chega por e-mail perto da live.";
const GOOGLE = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(TITULO)}&dates=${utc(LIVE_EM)}/${utc(FIM_LIVE)}&details=${encodeURIComponent(DETALHE)}`;
const ICS = `data:text/calendar;charset=utf-8,${encodeURIComponent(
  [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BlockTrends//Estrategia Internacional//PT", "BEGIN:VEVENT",
    "UID:live-estrategia-internacional-20261013@blocktrends.abril.com.br", `DTSTAMP:${utc(LIVE_EM)}`,
    `DTSTART:${utc(LIVE_EM)}`, `DTEND:${utc(FIM_LIVE)}`, `SUMMARY:${TITULO}`, `DESCRIPTION:${DETALHE}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n"),
)}`;

export default function CartaoConfirmado() {
  return (
    <div className="le-card le-card-ok">
      <span className="le-rotulo le-rotulo-campo">Inscrição confirmada</span>
      <h2 className="le-h2 le-h2-ok">Você está na lista.</h2>
      {/* `{" "}` depois da expressão: o JSX apara o começo do nó de texto seguinte quando
          ele continua na linha de baixo, e as duas frases sairiam coladas. O comentário
          fica fora do <p> porque dentro ele parte o nó de texto e come o espaço também. */}
      <p className="le-p-ok">
        {copyDaLive().confirmacao}{" "}
        Só quem está nesta lista recebe. Fique de olho na caixa de entrada e, se não chegar,
        procure por Estratégia Internacional no spam.
      </p>
      {!livePassou() && (
        <p className="le-p-ok le-p-agenda">
          <a href={GOOGLE} target="_blank" rel="noopener noreferrer">Salvar na agenda do Google</a>
          {" · "}
          <a href={ICS} download="live-estrategia-internacional.ics">Outra agenda (.ics)</a>
        </p>
      )}
      <p className="le-p-ok le-p-ajuda">
        O e-mail não chegou em alguns minutos?{" "}
        <a href={contato.whatsapp} target="_blank" rel="noopener noreferrer">Fale com a gente no WhatsApp</a>
        {" "}e a gente confirma por lá.
      </p>
    </div>
  );
}

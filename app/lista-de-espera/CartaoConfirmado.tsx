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
 */
export default function CartaoConfirmado() {
  return (
    <div className="le-card le-card-ok">
      <span className="le-rotulo le-rotulo-campo">Inscrição confirmada</span>
      <h2 className="le-h2 le-h2-ok">Você está na lista.</h2>
      <p className="le-p-ok">
        O convite da live e o aviso da abertura chegam no e-mail que você cadastrou. Só quem
        está nesta lista recebe. Fique de olho na caixa de entrada e, se não chegar, procure
        por Estratégia Internacional no spam.
      </p>
    </div>
  );
}

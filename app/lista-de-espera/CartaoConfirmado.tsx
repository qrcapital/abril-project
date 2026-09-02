/**
 * Card de confirmação da pré-lista.
 *
 * Ocupa o lugar e as medidas do formulário. Dois consumidores: o estado local do
 * `Formulario` (quando não há página de obrigado configurada) e a própria
 * `/lista-de-espera/obrigado`, que é o destino do redirect em produção. Um só
 * componente porque a copy é a mesma e divergir os dois é questão de tempo.
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

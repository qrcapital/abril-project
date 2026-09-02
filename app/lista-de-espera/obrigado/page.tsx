import type { Metadata } from "next";
import Tela from "../Tela";
import CartaoConfirmado from "../CartaoConfirmado";

/**
 * Destino do redirect pós-inscrição, quando
 * `NEXT_PUBLIC_LISTA_ESPERA_OBRIGADO_URL` aponta para cá. O conteúdo é o mesmo
 * card de confirmação que o formulário mostra no lugar, sem redirect.
 *
 * Não é a `/obrigado` da raiz: aquela é pós-compra do checkout do Guru, com
 * prazo de boleto e reenvio de acesso, e não tem nada a ver com a pré-lista.
 */

export const metadata: Metadata = {
  title: "Você está na lista",
  description: "Inscrição na pré-lista da formação Estratégia Internacional confirmada.",
  // Página de fim de fluxo: não há o que indexar, e indexada ela apareceria em
  // busca no lugar da página de captura.
  robots: { index: false, follow: false },
};

export default function ListaDeEsperaObrigado() {
  return (
    <Tela>
      <CartaoConfirmado />
    </Tela>
  );
}

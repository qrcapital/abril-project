import { CORPO, Painel } from "@/app/app/_ui/feedback";

/**
 * Sinal de transição entre telas da área. Vale para todas de uma vez: toda rota de `/app/*`
 * é dinâmica (o build marca com `ƒ`) e faz `getUser()` mais leitura de dado antes de
 * responder, então em conexão lenta o clique num card ficava sem resposta nenhuma.
 *
 * Sem spinner de propósito: o DESIGN.md §2 reserva movimento ao glow da oferta. O que o
 * aluno precisa aqui é saber que o clique pegou, e uma linha de texto diz isso.
 */
export default function Carregando() {
  return (
    <Painel titulo="Carregando" role="status">
      <p style={CORPO}>Um instante.</p>
    </Painel>
  );
}

// Os dois estados do botão "marcar como concluída" da aula.
//
// Até 29/set/2026 este arquivo preenchia o HTML portado da aula (`screens/aula.html`) por
// substituição de trechos, e montava a sidebar e o player em strings. A aula virou tela em JSX
// no modo teatro (`app/app/(sala)/modulo/[m]/aula/[n]/page.tsx`, CSS em `app/app/_ui/sala.css`),
// e o que sobrou aqui é o contrato do botão: o servidor pinta o estado inicial, o cliente
// (`AulaClient`) repinta na hora do clique, e os dois leem daqui para não divergirem no primeiro
// ajuste de texto. O vídeo saiu para `lib/video.ts`, que tem self-check.

export function estadoConcluir(concluida: boolean): { classe: string; rotulo: string } {
  return concluida
    ? { classe: "sl-concluir is-feita", rotulo: "Aula concluída · desmarcar" }
    : { classe: "sl-concluir", rotulo: "Marcar aula como concluída" };
}

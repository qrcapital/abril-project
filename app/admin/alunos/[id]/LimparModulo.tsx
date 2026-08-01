"use client";

import { confirmar, emTrabalho } from "@/app/app/_ui/feedback";

/**
 * Limpar o progresso de um módulo. Cliente pelo mesmo motivo do `ApagarAula`: confirmação pelo
 * padrão 5 do `DESIGN.md` §3, e não `window.confirm`.
 *
 * A confirmação diz a CONSEQUÊNCIA MEDIDA, e aqui ela tem duas partes: as aulas que o aluno perde e,
 * quando o módulo conta para o gate, o fato de que a prova final pode fechar. Essa segunda é a que
 * ninguém lembra na hora de clicar, e é a que gera o ticket.
 *
 * Marcar como concluído não tem diálogo: é reversível por este mesmo botão e não tira nada de
 * ninguém.
 */
export default function LimparModulo({
  userId,
  ord,
  titulo,
  concluidas,
  contaNoGate,
}: {
  userId: string;
  ord: number;
  titulo: string;
  concluidas: number;
  contaNoGate: boolean;
}) {
  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button");

    const ok = await confirmar({
      titulo: "Limpar o progresso deste módulo?",
      corpo:
        `O aluno volta a 0 aula concluída em ${titulo}, e ${concluidas === 1 ? "a aula marcada" : `as ${concluidas} aulas marcadas`} some${concluidas === 1 ? "" : "m"} do histórico.` +
        (contaNoGate
          ? " Este módulo conta para as 16 aulas que liberam a Prova Final, então o acesso à prova fecha até ele concluir de novo."
          : ""),
      destaque: titulo,
      confirmar: "Limpar progresso",
      cancelar: "Cancelar",
    });
    if (!ok) return;

    emTrabalho(btn as HTMLButtonElement, "Limpando...");
    form.submit();
  };

  return (
    <form method="post" action="/admin/api/aluno" onSubmit={enviar} className="inline">
      <input type="hidden" name="acao" value="progresso" />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="ord" value={ord} />
      <input type="hidden" name="modo" value="limpar" />
      <button
        type="submit"
        className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-falha hover:border-falha"
      >
        Limpar
      </button>
    </form>
  );
}

"use client";

import { confirmar, emTrabalho } from "@/app/app/_ui/feedback";

/**
 * Libera a 2ª chamada da prova. Cliente pelo padrão 5 do `DESIGN.md` §3, como as outras ações
 * sensíveis do painel.
 *
 * A confirmação diz as duas coisas que decidem o clique: que a nota anterior **fica no histórico** (a
 * tentativa antiga não é apagada, e é isso que preserva o registro de que houve uma reprovação), e que
 * o aluno recomeça pelas instruções com sorteio novo, ou seja, não é a mesma prova de novo.
 */
export default function SegundaChamada({
  userId,
  nome,
  nota,
}: {
  userId: string;
  nome: string;
  /** Nota da tentativa que reprovou, para o diálogo dizer de onde ele está partindo. */
  nota: number | null;
}) {
  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button");

    const ok = await confirmar({
      titulo: "Liberar a 2ª chamada da prova?",
      corpo: `${nome} ganha uma tentativa nova, com sorteio novo de questões, e recomeça pela tela de instruções. ${
        nota === null ? "" : `A nota de ${nota}% continua no histórico. `
      }A prova é de tentativa única, então isto é exceção e fica registrado com o seu nome.`,
      destaque: nome,
      confirmar: "Liberar tentativa",
      cancelar: "Cancelar",
    });
    if (!ok) return;

    emTrabalho(btn as HTMLButtonElement, "Liberando...");
    form.submit();
  };

  return (
    <form method="post" action="/admin/api/prova" onSubmit={enviar}>
      <input type="hidden" name="acao" value="segunda-chamada" />
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-grafite hover:border-pedra"
      >
        Liberar 2ª chamada
      </button>
    </form>
  );
}

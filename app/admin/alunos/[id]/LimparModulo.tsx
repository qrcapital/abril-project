"use client";

import { confirmar, emTrabalho } from "@/app/app/_ui/feedback";

/**
 * Limpar o progresso de um módulo. Cliente pelo mesmo motivo do `ApagarAula`: confirmação pelo
 * padrão 5 do `DESIGN.md` §3, e não `window.confirm`.
 *
 * A confirmação diz a CONSEQUÊNCIA MEDIDA, e aqui ela tem duas partes: as aulas que o aluno perde e,
 * quando o módulo conta para o gate, o efeito no certificado. Desde 30/set/2026 o certificado sai na
 * conclusão das aulas e não é revogado ao desmarcar, então o efeito é só para quem ainda não tem: a
 * emissão espera ele concluir de novo.
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
          ? " Este módulo conta para a conclusão da formação: se o aluno ainda não tem certificado, a emissão espera ele concluir de novo. Certificado já emitido não é revogado."
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

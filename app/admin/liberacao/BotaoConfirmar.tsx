"use client";

import { confirmar, emTrabalho } from "@/app/app/_ui/feedback";

/**
 * Ativar e apagar política, com confirmação (padrão 5 do `DESIGN.md` §3). Cliente pelo mesmo
 * motivo do `ApagarQuestao`: o diálogo. Um componente para as duas ações porque só mudam os
 * textos e o tom do botão; o corpo é calculado no servidor, que é quem sabe dos avisos.
 */
export default function BotaoConfirmar({
  acao,
  id,
  rotulo,
  rotuloTrabalhando,
  titulo,
  corpo,
  confirmarRotulo,
  perigo = false,
}: {
  acao: "ativar" | "apagar";
  id: string;
  rotulo: string;
  rotuloTrabalhando: string;
  titulo: string;
  corpo: string;
  confirmarRotulo: string;
  perigo?: boolean;
}) {
  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button");

    const ok = await confirmar({
      titulo,
      corpo,
      confirmar: confirmarRotulo,
      cancelar: "Cancelar",
    });
    if (!ok) return;

    emTrabalho(btn as HTMLButtonElement, rotuloTrabalhando);
    form.submit();
  };

  return (
    <form method="post" action="/admin/api/liberacao" onSubmit={enviar} className="inline">
      <input type="hidden" name="acao" value={acao} />
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={
          perigo
            ? "rounded-md border border-areia px-3 py-1.5 text-[12px] text-falha hover:border-falha"
            : "rounded-md bg-verde px-4 py-2 text-[12px] font-semibold text-offwhite hover:bg-verde-2"
        }
      >
        {rotulo}
      </button>
    </form>
  );
}

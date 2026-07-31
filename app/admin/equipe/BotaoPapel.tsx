"use client";

import { confirmar, emTrabalho } from "@/app/app/_ui/feedback";

/**
 * Botão de promover/revogar. Cliente por um motivo só: pedir confirmação antes de mexer em
 * privilégio, com o padrão 5 do `DESIGN.md` §3 (`confirmar()`), em vez de `window.confirm`.
 *
 * O envio é `form.submit()` nativo, que não passa pelo `onSubmit` do React. Então a tela
 * funciona sem JS também: sem hidratação, o clique manda o POST direto, sem a confirmação. Para
 * uma ação que já é confirmada no servidor por três travas, perder o diálogo é degradação
 * aceitável; perder o botão não seria.
 */
export default function BotaoPapel({
  userId,
  email,
  promover,
  mestre = false,
  q,
}: {
  userId: string;
  email: string;
  promover: boolean;
  /** O alvo é admin mestre. Só chega aqui com botão se quem olha também é mestre. */
  mestre?: boolean;
  q: string;
}) {
  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button");

    const ok = await confirmar(
      promover
        ? {
            titulo: "Dar acesso de admin?",
            corpo: `${email} passa a ver e editar tudo neste painel, incluindo o banco de questões com o gabarito da prova.`,
            destaque: email,
            confirmar: "Dar acesso",
            cancelar: "Cancelar",
          }
        : {
            titulo: mestre ? "Remover um admin mestre?" : "Remover o acesso de admin?",
            corpo: mestre
              ? `${email} é admin mestre. Perde o painel e o nível de mestre na próxima navegação. O acesso de aluno não muda.`
              : `${email} perde o painel na próxima navegação. O acesso de aluno não muda.`,
            destaque: email,
            confirmar: "Remover acesso",
            cancelar: "Cancelar",
          },
    );
    if (!ok) return;

    emTrabalho(btn as HTMLButtonElement, promover ? "Dando..." : "Removendo...");
    form.submit();
  };

  return (
    <form method="post" action="/admin/api/papel" onSubmit={enviar}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="acao" value={promover ? "promover" : "revogar"} />
      <input type="hidden" name="q" value={q} />
      <button
        type="submit"
        className={
          promover
            ? "rounded-md bg-verde px-3 py-1.5 text-[12px] font-semibold text-offwhite hover:bg-verde-2"
            : "rounded-md border border-areia px-3 py-1.5 text-[12px] text-grafite hover:border-pedra"
        }
      >
        {promover ? "Dar acesso" : "Remover"}
      </button>
    </form>
  );
}

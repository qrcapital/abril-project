"use client";

import { confirmar, emTrabalho } from "@/app/app/_ui/feedback";

/**
 * Reenvia o e-mail de acesso (PRD §16, "reenviar acesso"). Cliente pelo mesmo motivo do
 * `BotaoPapel` e do `ApagarAula`: confirmação com o padrão 5 do `DESIGN.md` §3.
 *
 * A confirmação existe porque isto **manda uma mensagem para outra pessoa**, o que não se desfaz, e
 * porque tem consequência que não é óbvia no botão: o link antigo para de funcionar. Quem clicou
 * sem saber disso deixaria um aluno com dois e-mails e um link morto.
 */
export default function ReenviarAcesso({ userId, email }: { userId: string; email: string }) {
  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button");

    const ok = await confirmar({
      titulo: "Reenviar o e-mail de acesso?",
      corpo: `${email} recebe uma mensagem nova com um link de criação de senha. O link enviado antes deixa de funcionar.`,
      destaque: email,
      confirmar: "Reenviar acesso",
      cancelar: "Cancelar",
    });
    if (!ok) return;

    emTrabalho(btn as HTMLButtonElement, "Enviando...");
    form.submit();
  };

  return (
    <form method="post" action="/admin/api/emails" onSubmit={enviar}>
      <input type="hidden" name="acao" value="reenviar-acesso" />
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-grafite hover:border-pedra"
      >
        Reenviar acesso
      </button>
    </form>
  );
}

"use client";

import { confirmar, emTrabalho } from "@/app/app/_ui/feedback";

/**
 * As duas ações do papel de observador (migration 0029) na tela de Equipe. Cliente pelo mesmo
 * motivo do `BotaoPapel`: confirmar antes de mexer em acesso. Sem JS, o formulário manda o POST
 * direto, sem o diálogo, e a rota confere tudo de novo.
 */

const CORPO_CONCEDER =
  "passa a ver o painel de indicadores: vendas, receita e conclusão do curso, sempre em números agregados. Não vê alunos, e-mails, auditoria nem conteúdo. Se ainda não tiver conta, ela é criada agora e a pessoa recebe o e-mail para criar a senha.";

export function ConcederObservador({ q }: { q: string }) {
  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email) return;
    const btn = form.querySelector("button");

    const ok = await confirmar({
      titulo: "Dar acesso de observador?",
      corpo: `${email} ${CORPO_CONCEDER}`,
      destaque: email,
      confirmar: "Dar acesso",
      cancelar: "Cancelar",
    });
    if (!ok) return;

    emTrabalho(btn as HTMLButtonElement, "Dando...");
    form.submit();
  };

  return (
    <form method="post" action="/admin/api/papel" onSubmit={enviar} className="flex max-w-xl gap-2">
      <input type="hidden" name="acao" value="observador-conceder" />
      <input type="hidden" name="q" value={q} />
      <input
        type="email"
        name="email"
        required
        placeholder="e-mail completo da pessoa"
        aria-label="E-mail do observador"
        className="min-w-0 flex-1 rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-acento focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md bg-acento px-4 py-2 text-[13px] font-semibold text-offwhite hover:bg-acento-fundo"
      >
        Dar acesso
      </button>
    </form>
  );
}

export function RevogarObservador({ userId, email, q }: { userId: string; email: string; q: string }) {
  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button");

    const ok = await confirmar({
      titulo: "Remover o acesso de observador?",
      corpo: `${email} perde o painel de indicadores na próxima navegação. A conta continua existindo.`,
      destaque: email,
      confirmar: "Remover acesso",
      cancelar: "Cancelar",
    });
    if (!ok) return;

    emTrabalho(btn as HTMLButtonElement, "Removendo...");
    form.submit();
  };

  return (
    <form method="post" action="/admin/api/papel" onSubmit={enviar}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="acao" value="observador-revogar" />
      <input type="hidden" name="q" value={q} />
      <button
        type="submit"
        className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-grafite hover:border-pedra"
      >
        Remover
      </button>
    </form>
  );
}

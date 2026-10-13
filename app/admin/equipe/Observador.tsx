"use client";

import { useEffect, useState } from "react";

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

/**
 * Observador por usuário (13/out/2026): a conta nasce aqui com senha gerada, sem e-mail. Sem
 * confirmação de propósito: criar não tira acesso de ninguém, e o erro (usuário repetido, formato)
 * volta da rota na mesma tela.
 */
export function CriarObservadorUsuario() {
  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    emTrabalho(e.currentTarget.querySelector("button") as HTMLButtonElement, "Criando...");
  };
  const campo =
    "min-w-0 rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-acento focus:outline-none";

  return (
    <form
      method="post"
      action="/admin/api/observador-usuario"
      onSubmit={enviar}
      className="flex max-w-xl flex-wrap gap-2"
    >
      <input type="hidden" name="acao" value="criar" />
      <input
        type="text"
        name="login"
        required
        minLength={3}
        maxLength={40}
        autoCapitalize="none"
        autoComplete="off"
        spellCheck={false}
        placeholder="usuário, ex.: abril.indicadores"
        aria-label="Usuário"
        className={`${campo} flex-[2]`}
      />
      <input
        type="text"
        name="nome"
        required
        maxLength={80}
        placeholder="nome, ex.: Abril"
        aria-label="Nome da conta"
        className={`${campo} flex-1`}
      />
      <button
        type="submit"
        className="rounded-md bg-acento px-4 py-2 text-[13px] font-semibold text-offwhite hover:bg-acento-fundo"
      >
        Criar acesso
      </button>
    </form>
  );
}

export function NovaSenhaObservador({ userId, login }: { userId: string; login: string }) {
  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button");

    const ok = await confirmar({
      titulo: "Gerar senha nova?",
      corpo: `A senha atual de ${login} deixa de valer agora, e quem entrar com a nova precisa trocá-la no primeiro acesso. Quem já está logado continua logado.`,
      destaque: login,
      confirmar: "Gerar senha",
      cancelar: "Cancelar",
    });
    if (!ok) return;

    emTrabalho(btn as HTMLButtonElement, "Gerando...");
    form.submit();
  };

  return (
    <form method="post" action="/admin/api/observador-usuario" onSubmit={enviar}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="acao" value="nova-senha" />
      <button
        type="submit"
        className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-grafite hover:border-pedra"
      >
        Nova senha
      </button>
    </form>
  );
}

/**
 * O quadro da senha gerada. Ao montar, pede à rota para apagar o cookie que a trouxe: a senha
 * aparece nesta visita e não volta num recarregar. Copiar leva tudo o que a pessoa precisa.
 */
export function QuadroCredencial({
  login,
  nome,
  senha,
  url,
  nova,
}: {
  login: string;
  nome: string | null;
  senha: string;
  url: string;
  nova: boolean;
}) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const corpo = new FormData();
    corpo.set("acao", "esquecer");
    fetch("/admin/api/observador-usuario", { method: "POST", body: corpo }).catch(() => {});
  }, []);

  const texto = `Acesso ao painel de indicadores${nome ? ` (${nome})` : ""}\nEndereço: ${url}\nUsuário: ${login}\nSenha provisória: ${senha}\nNo primeiro acesso, o sistema pede para criar uma senha nova.`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
    } catch {
      /* sem permissão de área de transferência: os dados continuam na tela */
    }
  };

  const linha = "grid grid-cols-[130px_1fr] gap-2 py-1.5 text-[13px]";
  return (
    <div className="mb-6 max-w-xl rounded-lg border border-sucesso/30 bg-white px-5 py-4" role="status">
      <p className="mb-2 text-[14px] font-semibold text-tinta">
        {nova ? "Senha nova gerada" : "Acesso criado"}
        {nome ? ` · ${nome}` : ""}
      </p>
      <div className={linha}>
        <span className="text-pedra">Endereço</span>
        <span className="break-all text-grafite">{url}</span>
      </div>
      <div className={linha}>
        <span className="text-pedra">Usuário</span>
        <code className="text-grafite">{login}</code>
      </div>
      <div className={linha}>
        <span className="text-pedra">Senha provisória</span>
        <code className="text-[15px] font-semibold tracking-wide text-tinta select-all">{senha}</code>
      </div>
      <p className="mt-2 text-[12px] text-medio">
        No primeiro acesso a pessoa precisa criar uma senha nova. Esta senha não aparece de novo:
        copie agora e envie por um canal seguro.
      </p>
      <button
        type="button"
        onClick={copiar}
        className="mt-3 rounded-md bg-acento px-4 py-2 text-[13px] font-semibold text-offwhite hover:bg-acento-fundo"
      >
        {copiado ? "Copiado" : "Copiar dados de acesso"}
      </button>
    </div>
  );
}

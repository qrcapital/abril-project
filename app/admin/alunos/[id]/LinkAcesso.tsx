"use client";

import { useState } from "react";

/**
 * Gera o link de criação de senha e mostra para o admin copiar e mandar por WhatsApp. É o plano B
 * para quando o e-mail de acesso não chega na caixa do aluno. Gerar um link novo invalida o anterior.
 */
export default function LinkAcesso({ userId }: { userId: string }) {
  const [link, setLink] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const gerar = async () => {
    setCarregando(true);
    setErro(null);
    setCopiado(false);
    try {
      const fd = new FormData();
      fd.set("acao", "link-acesso");
      fd.set("userId", userId);
      const r = await fetch("/admin/api/emails", { method: "POST", body: fd });
      const j = (await r.json().catch(() => ({}))) as { link?: string; erro?: string };
      if (!r.ok || !j.link) setErro(j.erro ?? "Não consegui gerar o link.");
      else setLink(j.link);
    } catch {
      setErro("Não consegui gerar o link.");
    } finally {
      setCarregando(false);
    }
  };

  const copiar = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={gerar}
        disabled={carregando}
        className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-grafite hover:border-pedra disabled:opacity-60"
      >
        {carregando ? "Gerando..." : "Gerar link de acesso"}
      </button>
      {link && (
        <div className="flex max-w-[520px] flex-col gap-1 text-[12px]">
          <input readOnly value={link} className="w-full rounded-md border border-areia bg-white px-2 py-1 font-mono text-[11px]" onFocus={(e) => e.currentTarget.select()} />
          <div className="flex items-center gap-3">
            <button type="button" onClick={copiar} className="rounded-md border border-areia px-2 py-1 text-[12px] hover:border-pedra">
              {copiado ? "Copiado" : "Copiar"}
            </button>
            <span className="text-pedra">Vale por 24 horas e uma vez só. Mande por WhatsApp para o aluno.</span>
          </div>
        </div>
      )}
      {erro && <p className="text-[12px] text-red-700">{erro}</p>}
    </div>
  );
}

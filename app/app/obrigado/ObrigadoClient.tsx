"use client";

import { useEffect, useState } from "react";

import AcessoClient from "../acesso/AcessoClient";

/**
 * A página de compra aprovada, com o acesso direto (10/out/2026).
 *
 * Com `?v=` (id da venda, posto pelo Guru no redirecionamento), tenta abrir a sessão da conta nova
 * em `/api/acesso/compra` e leva a pessoa direto para criar a senha. O webhook do Guru costuma
 * chegar segundos depois do redirecionamento, então a tela consulta a cada 3 segundos por até
 * um minuto. Se não der (sem `v`, webhook atrasado, conta já usada), cai na página de antes, que
 * explica o e-mail de acesso.
 *
 * O `v` sai da barra de endereço assim que é lido, para não ficar no histórico nem ir junto se a
 * pessoa compartilhar a tela.
 */
const INTERVALO_MS = 3000;
const TENTATIVAS = 20;

export default function ObrigadoClient({
  padrao,
  preparando,
  jaEntrou,
}: {
  padrao: string;
  preparando: string;
  jaEntrou: string;
}) {
  const [tela, setTela] = useState<"lendo" | "preparando" | "padrao" | "ja-entrou">("lendo");

  useEffect(() => {
    const url = new URL(window.location.href);
    const v = url.searchParams.get("v") ?? "";
    if (!/^[A-Za-z0-9_-]{8,64}$/.test(v)) {
      setTela("padrao");
      return;
    }
    url.searchParams.delete("v");
    window.history.replaceState(null, "", url.pathname + url.search);
    setTela("preparando");

    let vivo = true;
    let tentativa = 0;
    const tentar = async () => {
      if (!vivo) return;
      tentativa += 1;
      try {
        const r = await fetch("/api/acesso/compra", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ v }),
          credentials: "same-origin",
        });
        const j = (await r.json().catch(() => ({}))) as { estado?: string; destino?: string };
        if (!vivo) return;
        if (j.estado === "ok" && j.destino) {
          window.location.replace(j.destino);
          return;
        }
        if (j.estado === "ja-entrou") {
          setTela("ja-entrou");
          return;
        }
        if (j.estado === "aguardando" && tentativa < TENTATIVAS) {
          setTimeout(tentar, INTERVALO_MS);
          return;
        }
      } catch {
        if (tentativa < TENTATIVAS) {
          setTimeout(tentar, INTERVALO_MS);
          return;
        }
      }
      setTela("padrao");
    };
    tentar();
    return () => {
      vivo = false;
    };
  }, []);

  if (tela === "lendo") return null;
  if (tela === "preparando") return <div dangerouslySetInnerHTML={{ __html: preparando }} />;
  if (tela === "ja-entrou") return <AcessoClient html={jaEntrou} />;
  return <AcessoClient html={padrao} />;
}

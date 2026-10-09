"use client";

import { useEffect, useState } from "react";

import AcessoClient from "../acesso/AcessoClient";
import Html from "@/app/app/_ui/Html";

/**
 * A página de compra aprovada, com o acesso direto (10/out/2026).
 *
 * Com `?v=` (id da venda, posto pelo Guru no redirecionamento), tenta abrir a sessão da conta nova
 * em `/api/acesso/compra` e leva a pessoa direto para criar a senha. Se não der (sem `v`, conta já
 * usada, prazo esgotado), cai na página de antes, que explica o e-mail de acesso.
 *
 * ┌─ QUANTO ESPERAR (09/out/2026) ────────────────────────────────────────────────────────────────┐
 * │ A primeira versão esperava 1 minuto, achando que o webhook do Guru chega segundos depois do   │
 * │ redirecionamento. Na compra de teste ele chegou 2 minutos depois (redirecionamento às 17:32,  │
 * │ webhook às 17:34): a tela desistiu antes e o comprador ficou sem nada. Agora a espera vai até │
 * │ 6 minutos, a cada 3 s no começo e a cada 5 s depois, e a tela avisa o que está acontecendo.   │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * O `v` sai da barra de endereço assim que é lido (não fica no histórico nem vai junto num print),
 * mas fica guardado na aba (`sessionStorage`, 30 minutos): recarregar a página continua a espera em
 * vez de cair na tela genérica.
 */
const CHAVE = "ei-compra-v";
const VALIDADE_MS = 30 * 60 * 1000;
const PRAZO_MS = 6 * 60 * 1000;
const FORMATO = /^[A-Za-z0-9_-]{8,64}$/;

type Tela = "lendo" | "preparando" | "demorando" | "padrao" | "ja-entrou";

function lerV(): string {
  const url = new URL(window.location.href);
  const daUrl = url.searchParams.get("v") ?? "";
  if (FORMATO.test(daUrl)) {
    try {
      sessionStorage.setItem(CHAVE, JSON.stringify({ v: daUrl, em: Date.now() }));
    } catch {
      /* aba privada sem storage: segue só com a URL */
    }
    url.searchParams.delete("v");
    window.history.replaceState(null, "", url.pathname + url.search);
    return daUrl;
  }
  try {
    const salvo = JSON.parse(sessionStorage.getItem(CHAVE) ?? "null") as { v?: string; em?: number } | null;
    if (salvo?.v && FORMATO.test(salvo.v) && Date.now() - (salvo.em ?? 0) < VALIDADE_MS) return salvo.v;
  } catch {
    /* nada guardado */
  }
  return "";
}

const esquecer = () => {
  try {
    sessionStorage.removeItem(CHAVE);
  } catch {
    /* nada a fazer */
  }
};

export default function ObrigadoClient({
  padrao,
  preparando,
  demorando,
  jaEntrou,
}: {
  padrao: string;
  preparando: string;
  demorando: string;
  jaEntrou: string;
}) {
  const [tela, setTela] = useState<Tela>("lendo");

  useEffect(() => {
    const v = lerV();
    if (!v) {
      setTela("padrao");
      return;
    }
    setTela("preparando");

    let vivo = true;
    const inicio = Date.now();
    const tentar = async () => {
      if (!vivo) return;
      const passou = Date.now() - inicio;
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
          esquecer();
          window.location.replace(j.destino);
          return;
        }
        if (j.estado === "ja-entrou") {
          esquecer();
          setTela("ja-entrou");
          return;
        }
        if (j.estado === "invalido") {
          esquecer();
          setTela("padrao");
          return;
        }
        // "aguardando", "limite" e "erro" de rede seguem tentando até o prazo.
      } catch {
        /* rede caiu: tenta de novo */
      }
      if (!vivo) return;
      if (passou > 45_000) setTela("demorando");
      if (passou > PRAZO_MS) {
        setTela("padrao");
        return;
      }
      setTimeout(tentar, passou < 60_000 ? 3000 : 5000);
    };
    tentar();
    return () => {
      vivo = false;
    };
  }, []);

  if (tela === "lendo") return null;
  if (tela === "preparando") return <Html html={preparando} />;
  if (tela === "demorando") return <Html html={demorando} />;
  if (tela === "ja-entrou") return <AcessoClient html={jaEntrou} />;
  return <AcessoClient html={padrao} />;
}

"use client";

import { useEffect, useRef, useState } from "react";

import { pedirReset } from "./actions";
import { emTrabalho, pintarCaixa } from "@/app/app/_ui/feedback";

const SUCESSO =
  "Se existir conta com esse e-mail, o link chega em poucos minutos. Vale olhar o spam.";

/**
 * "Esqueci minha senha". A confirmação é sempre a mesma, tenha o e-mail conta ou não: a
 * tela não pode virar verificador de quais e-mails compraram o curso.
 *
 * O markup vem do `login.html` portado, com a coluna do formulário trocada, então o
 * `<form>` precisa envolver o HTML injetado para o Enter submeter.
 */
export default function RecuperarClient({
  html,
  aviso,
}: {
  html: string;
  aviso?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enviado, setEnviado] = useState(false);

  // A caixa vive DENTRO da coluna do formulário (o slot que o senha-template emite), e não
  // como irmã do HTML injetado, senão cai no fim da página.
  useEffect(() => {
    const slot = ref.current?.querySelector<HTMLElement>("[data-feedback]");
    if (enviado) pintarCaixa(slot, "sucesso", SUCESSO);
    else pintarCaixa(slot, "aviso", aviso ?? null);
  }, [aviso, enviado]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input = ref.current?.querySelector<HTMLInputElement>("#email");
    const email = input?.value ?? "";
    if (!email) return;

    const btn = ref.current?.querySelector("button") ?? null;
    if (btn?.disabled) return;
    const restaurar = emTrabalho(btn, "Enviando...");
    try {
      await pedirReset(email);
    } finally {
      restaurar();
    }
    setEnviado(true);

    // Some os campos e o botão: repetir o envio só gastaria o rate limit do Supabase.
    ref.current?.querySelector<HTMLElement>("[data-campos]")?.style.setProperty("display", "none");
    if (btn) btn.style.display = "none";
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
    </form>
  );
}

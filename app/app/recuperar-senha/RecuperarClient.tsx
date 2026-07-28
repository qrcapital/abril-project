"use client";

import { useRef, useState } from "react";

import { pedirReset } from "./actions";

const CAIXA = {
  maxWidth: 400,
  margin: "16px auto 0",
  padding: "12px 14px",
  borderRadius: 8,
  fontFamily: "'Montserrat',system-ui,sans-serif",
  fontSize: 12.5,
  lineHeight: 1.5,
} as const;

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
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (enviando || enviado) return;
    const input = ref.current?.querySelector<HTMLInputElement>("#email");
    const email = input?.value ?? "";
    if (!email) return;

    setEnviando(true);
    await pedirReset(email);
    setEnviando(false);
    setEnviado(true);

    // Some os campos e o botão: repetir o envio só gastaria o rate limit do Supabase.
    ref.current?.querySelector<HTMLElement>("[data-campos]")?.style.setProperty("display", "none");
    const btn = ref.current?.querySelector("button");
    if (btn) btn.style.display = "none";
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />

      {aviso && !enviado && (
        <p
          role="alert"
          style={{
            ...CAIXA,
            border: "1px solid rgba(217,190,133,.35)",
            background: "rgba(217,190,133,.08)",
            color: "#D9BE85",
          }}
        >
          {aviso}
        </p>
      )}

      {enviando && (
        <p style={{ ...CAIXA, color: "#8FA398" }} aria-live="polite">
          Enviando...
        </p>
      )}

      {enviado && (
        <p
          aria-live="polite"
          style={{
            ...CAIXA,
            border: "1px solid rgba(217,190,133,.35)",
            background: "rgba(217,190,133,.08)",
            color: "#EDE6DD",
          }}
        >
          Se existir conta com esse e-mail, o link chega em poucos minutos. Vale olhar o
          spam.
        </p>
      )}
    </form>
  );
}

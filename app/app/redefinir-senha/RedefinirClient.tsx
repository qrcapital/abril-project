"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { definirSenha } from "./actions";
import { validarSenha } from "@/lib/senha";

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
 * Formulário da senha nova. A conferência de "as duas iguais" é local, porque é erro de
 * digitação e não precisa de ida ao servidor; o tamanho mínimo é conferido nos dois lados,
 * já que validação de cliente não é garantia de nada.
 *
 * Deu certo, vai direto para `/app`: o aluno acabou de provar posse do e-mail, então exigir
 * login em seguida seria atrito sem ganho.
 */
export default function RedefinirClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (salvando) return;

    const root = ref.current;
    const senha = root?.querySelector<HTMLInputElement>("#senha")?.value ?? "";
    const repetir = root?.querySelector<HTMLInputElement>("#repetir")?.value ?? "";

    const problema = validarSenha(senha);
    if (problema) {
      setErro(problema);
      return;
    }
    if (senha !== repetir) {
      setErro("As duas senhas não são iguais.");
      return;
    }

    setErro(null);
    setSalvando(true);
    const r = await definirSenha(senha);
    if (r.ok) {
      router.push("/app");
    } else {
      setSalvando(false);
      setErro(r.erro);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />

      {erro && (
        <p
          role="alert"
          style={{
            ...CAIXA,
            border: "1px solid rgba(176,65,62,.4)",
            background: "rgba(176,65,62,.1)",
            color: "#E6A9A7",
          }}
        >
          {erro}
        </p>
      )}
      {salvando && (
        <p style={{ ...CAIXA, color: "#8FA398" }} aria-live="polite">
          Salvando...
        </p>
      )}
    </form>
  );
}

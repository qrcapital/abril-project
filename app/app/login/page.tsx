import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import LoginClient from "./LoginClient";

export const metadata: Metadata = { title: "Entrar" };

const dir = join(process.cwd(), "app", "app", "_ui", "screens");
const variants: Record<string, string> = {
  regular: readFileSync(join(dir, "login.html"), "utf8"),
  erro: readFileSync(join(dir, "login-error.html"), "utf8"),
  pendente: readFileSync(join(dir, "login-pending.html"), "utf8"),
  primeiro: readFileSync(join(dir, "login-first.html"), "utf8"),
};

// Motivos de o aluno ter caído aqui sem pedir. O proxy manda o `estado`; sem ele, a tela é a
// de sempre. Mesmo padrão da recuperação de senha.
const AVISOS: Record<string, string> = {
  expirou: "Sua sessão expirou por inatividade. Entre de novo para continuar de onde parou.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; estado?: string }>;
}) {
  const { s, estado } = await searchParams;
  return (
    <LoginClient
      html={variants[s ?? "regular"] ?? variants.regular}
      mode={s === "primeiro" ? "primeiro" : "login"}
      aviso={estado ? AVISOS[estado] : undefined}
    />
  );
}

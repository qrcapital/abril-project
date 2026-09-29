import type { Metadata } from "next";
import { LOGIN } from "@/lib/auth-casca";
import { cadastroAberto } from "@/lib/seguranca";
import LoginClient from "./LoginClient";

export const metadata: Metadata = { title: "Entrar" };

// As quatro variantes saem da casca nova (`lib/auth-casca.ts`), e não mais dos
// `screens/login*.html` do porte, que eram a identidade verde e saíram do repo em 29/set/2026.
const variants: Record<string, string> = LOGIN;

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
      // Avaliado AQUI, no servidor, e não no componente: a regra lê `CADASTRO_ABERTO`, que não
      // tem prefixo `NEXT_PUBLIC_` e por isso não existe no navegador. É a mesma chamada que a
      // action `criarConta` faz, então a barra de teste e a porta abrem e fecham juntas.
      cadastro={cadastroAberto()}
    />
  );
}

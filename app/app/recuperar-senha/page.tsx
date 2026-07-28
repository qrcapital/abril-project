import type { Metadata } from "next";
import { tela } from "@/lib/telas";
import { linkSenha, telaSenha } from "@/lib/senha-template";
import RecuperarClient from "./RecuperarClient";

export const metadata: Metadata = { title: "Redefinir senha" };

const html = telaSenha(tela("login"), {
  titulo: "Redefinir sua senha",
  lead: "Informe o e-mail que você usou na compra e a gente envia um link para você criar uma senha nova.",
  campos: [
    {
      nome: "email",
      rotulo: "E-mail",
      tipo: "email",
      autoComplete: "email",
      placeholder: "seu@email.com",
    },
  ],
  botao: "ENVIAR O LINK",
  rodapeHtml: `Lembrou a senha? ${linkSenha("/app/login", "Voltar para o login")}`,
});

const AVISOS: Record<string, string> = {
  expirado: "Esse link já não vale. Peça outro aqui.",
  invalido: "Esse link chegou incompleto. Peça outro aqui.",
};

export default async function RecuperarSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  return <RecuperarClient html={html} aviso={estado ? AVISOS[estado] : undefined} />;
}

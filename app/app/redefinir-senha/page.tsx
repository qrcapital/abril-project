import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { tela } from "@/lib/telas";
import { telaSenha } from "@/lib/senha-template";
import { createClient } from "@/lib/supabase/server";
import RedefinirClient from "./RedefinirClient";
import { REGRA_SENHA } from "@/lib/senha";

export const metadata: Metadata = { title: "Criar senha nova" };

const html = telaSenha(tela("login"), {
  titulo: "Criar uma senha nova",
  lead: `Escolha uma senha de ${REGRA_SENHA}. Ela passa a valer assim que você confirmar.`,
  campos: [
    { nome: "senha", rotulo: "Senha nova", tipo: "password", autoComplete: "new-password" },
    { nome: "repetir", rotulo: "Repita a senha", tipo: "password", autoComplete: "new-password" },
  ],
  botao: "SALVAR A SENHA",
});

/**
 * Só abre com a sessão que o `/auth/confirm` cria ao consumir o token do e-mail. Sem ela,
 * o formulário não teria o que fazer, então manda de volta para pedir outro link.
 */
export default async function RedefinirSenhaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/app/recuperar-senha?estado=expirado");

  return <RedefinirClient html={html} />;
}

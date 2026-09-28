import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { tela } from "@/lib/telas";
import { caixaAceite, telaSenha } from "@/lib/senha-template";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TEXTO_ACEITE, URL_POLITICA, URL_TERMOS, aceitouVigente } from "@/lib/consentimento";
import RedefinirClient from "./RedefinirClient";
import { REGRA_SENHA } from "@/lib/senha";

export const metadata: Metadata = { title: "Criar senha nova" };

const CAMPOS = [
  { nome: "senha", rotulo: "Senha nova", tipo: "password" as const, autoComplete: "new-password" },
  { nome: "repetir", rotulo: "Repita a senha", tipo: "password" as const, autoComplete: "new-password" },
];

/** Redefinição comum: a conta já aceitou os documentos, então não há o que colher aqui. */
const htmlSemAceite = telaSenha(tela("login"), {
  titulo: "Criar uma senha nova",
  lead: `Escolha uma senha de ${REGRA_SENHA}. Ela passa a valer assim que você confirmar.`,
  campos: CAMPOS,
  botao: "SALVAR A SENHA",
});

/**
 * Primeiro acesso, ou conta que ainda não aceitou a versão vigente dos documentos.
 *
 * O título muda junto com a caixa de propósito: "criar uma senha nova" numa tela que também está
 * pedindo o aceite dos Termos descreveria metade do que está acontecendo.
 */
const htmlComAceite = telaSenha(tela("login"), {
  titulo: "Crie sua senha de acesso",
  lead: `Escolha uma senha de ${REGRA_SENHA} e confirme os documentos do curso para entrar.`,
  campos: CAMPOS,
  botao: "CRIAR SENHA E ENTRAR",
  aceiteHtml: caixaAceite({
    texto: TEXTO_ACEITE,
    urlTermos: URL_TERMOS,
    urlPolitica: URL_POLITICA,
  }),
});

/**
 * Só abre com a sessão que o `/auth/confirm` cria ao consumir o token do e-mail. Sem ela,
 * o formulário não teria o que fazer, então manda de volta para pedir outro link.
 *
 * A CAIXA DE ACEITE APARECE POR ESTADO, NÃO POR TIPO DE LINK. Seria mais direto olhar o `type` do
 * token (`invite` é primeiro acesso, `recovery` é senha esquecida), mas ele morre no
 * `/auth/confirm` e chegaria aqui como parâmetro de query, ou seja, escolhido por quem digita o
 * endereço. Perguntar ao banco "esta conta já aceitou a versão vigente?" não é adulterável, cobre
 * quem entrou antes de o log existir, e volta a pedir o aceite sozinha no dia em que a Abril
 * publicar uma revisão dos documentos.
 */
export default async function RedefinirSenhaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/app/recuperar-senha?estado=expirado");

  // Service role: `consents` tem RLS ligada e sem policy, então a sessão do aluno não enxerga nem
  // as próprias linhas. Quem lê o log é sempre o servidor.
  const jaAceitou = await aceitouVigente(createAdminClient(), user.id);

  return <RedefinirClient html={jaAceitou ? htmlSemAceite : htmlComAceite} exigeAceite={!jaAceitou} />;
}

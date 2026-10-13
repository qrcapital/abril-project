import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { caixaAceite, telaSenha } from "@/lib/senha-template";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TEXTO_ACEITE, URL_POLITICA, URL_TERMOS, aceitouVigente } from "@/lib/consentimento";
import RedefinirClient from "./RedefinirClient";
import { REGRA_SENHA } from "@/lib/senha";
import { papelAtual } from "@/lib/admin";
import { precisaTrocarSenha, rotuloDaConta } from "@/lib/usuario-login";

export const metadata: Metadata = { title: "Criar senha nova" };

const CAMPOS = [
  { nome: "senha", rotulo: "Senha nova", tipo: "password" as const, autoComplete: "new-password" },
  { nome: "repetir", rotulo: "Repita a senha", tipo: "password" as const, autoComplete: "new-password" },
];

/** Redefinição comum: a conta já aceitou os documentos, então não há o que colher aqui. */
const htmlSemAceite = (email: string) => telaSenha({
  titulo: "Criar uma senha nova",
  lead: `Senha da conta ${email}. Escolha uma de ${REGRA_SENHA}; ela passa a valer assim que você confirmar.`,
  campos: CAMPOS,
  botao: "SALVAR A SENHA",
});

/**
 * Troca obrigatória (13/out/2026): conta criada pelo admin com senha gerada, como os observadores
 * por usuário. O proxy traz a pessoa para cá até ela trocar, então o título diz por quê.
 */
const htmlObrigatoria = (conta: string) => telaSenha({
  titulo: "Crie uma senha nova para continuar",
  lead: `Conta ${conta}. A senha que você recebeu vale só para este primeiro acesso. Escolha uma de ${REGRA_SENHA}.`,
  campos: CAMPOS,
  botao: "SALVAR E ENTRAR",
});

/**
 * Primeiro acesso, ou conta que ainda não aceitou a versão vigente dos documentos.
 *
 * O título muda junto com a caixa de propósito: "criar uma senha nova" numa tela que também está
 * pedindo o aceite dos Termos descreveria metade do que está acontecendo.
 */
const htmlComAceite = (email: string) => telaSenha({
  titulo: "Crie sua senha de acesso",
  lead: `Senha da conta ${email}. Escolha uma de ${REGRA_SENHA} e confirme os documentos do curso para entrar.`,
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
export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ primeiro?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/app/recuperar-senha?estado=expirado");

  // Observador (0029) não é aluno e não aceita os documentos do curso: a caixa não aparece para ele,
  // e a action dispensa o aceite pela mesma pergunta.
  const { papel } = await papelAtual();
  const observador = papel === "observador";

  // Service role: `consents` tem RLS ligada e sem policy, então a sessão do aluno não enxerga nem
  // as próprias linhas. Quem lê o log é sempre o servidor.
  const jaAceitou = observador || (await aceitouVigente(createAdminClient(), user.id));

  // O título da troca obrigatória sai da MARCA na conta, e não só do `?primeiro=1`: a query é
  // escolhida por quem digita o endereço, a marca não. O parâmetro só entra se, além dele, a conta
  // for de observador, que nunca precisa da caixa de aceite.
  const { primeiro } = await searchParams;
  const obrigatoria = precisaTrocarSenha(user) || (primeiro === "1" && observador);
  // Conta de usuário aparece pelo usuário, não pelo e-mail interno que ninguém digita.
  const conta = rotuloDaConta(user.email);

  const html = obrigatoria && jaAceitou
    ? htmlObrigatoria(conta)
    : jaAceitou
      ? htmlSemAceite(conta)
      : htmlComAceite(conta);
  return <RedefinirClient html={html} exigeAceite={!jaAceitou} />;
}

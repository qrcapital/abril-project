import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { tela } from "@/lib/telas";
import { caixaAceite, telaSenha } from "@/lib/senha-template";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TEXTO_ACEITE, URL_POLITICA, URL_TERMOS, aceitouVigente } from "@/lib/consentimento";
import TermosClient from "./TermosClient";

export const metadata: Metadata = { title: "Termos e privacidade" };

/**
 * A rede de segurança do log de consentimento (migration `0023`).
 *
 * A porta principal é a tela de senha do primeiro acesso, e ela cobre todo aluno novo. Esta cobre
 * os outros dois casos, que existem e não são raros:
 *
 * - quem já tinha conta quando o log passou a existir, e portanto nunca teve caixa nenhuma para
 *   marcar;
 * - quem tem conta antiga no dia em que a Abril publicar uma revisão dos documentos, quando o
 *   aceite guardado deixa de ser o da versão vigente.
 *
 * MORA FORA DO GRUPO `(sala)` pelo mesmo motivo que a `/app/acesso`: o gate que manda para cá vive
 * no layout do grupo, e uma tela de dentro se redirecionaria para si mesma em laço.
 *
 * Sem `campos`, o `telaSenha` vira exatamente o que esta tela precisa: a coluna de marca do login,
 * um título, um parágrafo, a caixa e o botão. Escrever JSX novo aqui daria uma tela que diverge do
 * resto do produto na primeira vez que alguém mexer no design.
 */
const html = telaSenha(tela("login"), {
  titulo: "Antes de continuar",
  lead: "Atualizamos os documentos do curso. Para seguir usando a plataforma, confirme a leitura abaixo. Leva um instante e só é pedido uma vez por versão.",
  campos: [],
  botao: "CONFIRMAR E CONTINUAR",
  aceiteHtml: caixaAceite({
    texto: TEXTO_ACEITE,
    urlTermos: URL_TERMOS,
    urlPolitica: URL_POLITICA,
  }),
});

export default async function TermosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/app/login");

  // Quem já aceitou não tem o que fazer aqui, e cair nesta tela depois de aceitar pareceria que o
  // clique anterior não pegou. Vale também para quem chega pelo endereço digitado.
  if (await aceitouVigente(createAdminClient(), user.id)) redirect("/app");

  return <TermosClient html={html} />;
}

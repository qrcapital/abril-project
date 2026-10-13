import type { Metadata } from "next";
import { tela } from "@/lib/telas";
import { getMatricula } from "@/lib/matricula";
import { getUsuario } from "@/lib/usuario";
import { preencherUsuario } from "@/lib/usuario-template";
import ContaClient from "./ContaClient";

export const metadata: Metadata = { title: "Minha conta" };

const template = tela("conta");

/**
 * Nome, e-mail e prazo de acesso saem do servidor. Esta tela era estática e passou a ser
 * dinâmica na tarefa 5: é a tela em que o dado do aluno É o conteúdo, então servir o do
 * design e trocar depois no navegador era o pior lugar possível para esse atraso.
 */
export default async function ContaPage() {
  // O prazo sai do `expires_at` REAL da matrícula (o proxy de `created_at + 1 ano` errava
  // para matrícula estendida ou renovada). `getMatricula` é cache(): o layout já a leu.
  const [user, { expiraEm, observador }] = await Promise.all([getUsuario(), getMatricula()]);
  const html = preencherUsuario(template, user, expiraEm);
  return <ContaClient html={observador ? acessoDoObservador(html) : html} />;
}

/**
 * O observador (0029) não comprou e não tem prazo: o acesso dura o papel. Sem esta troca, o cartão
 * diria "1 ano a partir da compra" com uma data inventada (`created_at` + 1 ano, o recuo do
 * `preencherUsuario` para quem não tem matrícula).
 */
function acessoDoObservador(html: string): string {
  return html
    .replace(">Acesso liberado por 1 ano<", ">Acesso de acompanhamento<")
    .replace(/A partir da compra[\s\S]*?<\/b>/, "Vale enquanto sua conta de observador estiver ativa");
}

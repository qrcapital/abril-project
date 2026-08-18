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
  const [user, { expiraEm }] = await Promise.all([getUsuario(), getMatricula()]);
  return <ContaClient html={preencherUsuario(template, user, expiraEm)} />;
}

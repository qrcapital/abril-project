import type { Metadata } from "next";
import { tela } from "@/lib/telas";
import { getUsuario } from "@/lib/usuario";
import { preencherUsuario } from "@/lib/usuario-template";
import CertificadoClient from "./CertificadoClient";

export const metadata: Metadata = { title: "Certificado" };

const template = tela("certificado");

/**
 * O nome do certificado sai do servidor. Era a pior ocorrência do problema da tarefa 5: a
 * peça que fecha o curso, com o nome em Playfair grande, chegava com o nome de outra pessoa
 * e trocava depois. Vale também para o PDF, que é gerado a partir desta tela.
 */
export default async function CertificadoPage() {
  const user = await getUsuario();
  return <CertificadoClient html={preencherUsuario(template, user)} />;
}

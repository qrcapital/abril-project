import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { tela } from "@/lib/telas";
import { emitirSeConcluiu, lerCertificado } from "@/lib/certificados";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUsuario } from "@/lib/usuario";
import { preencherCodigo, preencherUsuario } from "@/lib/usuario-template";
import CertificadoClient from "./CertificadoClient";

export const metadata: Metadata = { title: "Certificado" };

const template = tela("certificado");

/**
 * O nome e o CÓDIGO do certificado saem do servidor.
 *
 * O nome era a pior ocorrência do problema da tarefa 5: a peça que fecha o curso, com o nome em
 * Playfair grande, chegava com o nome de outra pessoa e trocava depois. O código era pior ainda e
 * durou até 31/jul/2026: ele vinha de uma constante, **igual para todos os alunos**, então o link de
 * validação e o do LinkedIn levavam ao certificado de outra pessoa.
 *
 * Lê, e emite quando não há o que ler, e é de propósito: a guarda do grupo já garantiu que este
 * aluno tem certificado ou concluiu todas as aulas, então se ele não tem código é porque a emissão
 * na conclusão falhou ou porque ele concluiu **antes de a emissão por conclusão existir**
 * (30/set/2026). Emitir aqui resolve os dois casos sem ninguém abrir ticket, e manda o e-mail
 * `certificado` se for a primeira emissão. A função é idempotente: quem já tem código não ganha
 * outro.
 *
 * Service role porque a emissão é escrita confiável, como toda escrita do projeto. A RLS de
 * `certificates` deixaria o aluno LER o próprio, mas não escrever, e a policy existente
 * (`certificates_self_select`) continua sendo a que vale para qualquer leitura futura pelo cliente.
 */
export default async function CertificadoPage() {
  const user = await getUsuario();
  // A guarda do grupo já barrou anônimo; isto é o teto do TypeScript, não uma segunda guarda.
  if (!user) notFound();

  const db = createAdminClient();
  const cert = (await lerCertificado(db, user.id)) ?? (await emitirSeConcluiu(db, user.id));

  const html = preencherCodigo(preencherUsuario(template, user), cert?.codigo ?? null);
  return (
    <CertificadoClient
      html={html}
      codigo={cert?.codigo ?? ""}
      emitidoEm={cert?.emitidoEm ?? new Date().toISOString()}
    />
  );
}

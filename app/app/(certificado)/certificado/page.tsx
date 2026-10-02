import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AcoesCertificado from "@/app/_certificado/AcoesCertificado";
import Folha from "@/app/_certificado/Folha";
import Nps from "@/app/_certificado/Nps";
import { CORPO, Painel } from "@/app/app/_ui/feedback";
import contato from "@/lib/contato.json";
import { emitirSeConcluiu, lerCertificado } from "@/lib/certificados";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUsuario } from "@/lib/usuario";

export const metadata: Metadata = { title: "Certificado" };

/**
 * O certificado do aluno: a folha A4, as ações (PDF, impressão, LinkedIn) e a régua de NPS.
 *
 * **JSX desde out/2026**, e não mais o `screens/certificado.html` portado. A folha nova é desenhada em
 * milímetros e tem três destinos (tela, PDF e impressão); com ela em React, o nome e o código entram
 * como texto escapado pelo próprio JSX, sem marcador `data-u`/`data-cert` para um porte apagar.
 *
 * O nome e o CÓDIGO saem do servidor, como antes. O código foi uma constante igual para todos até
 * 31/jul/2026, e o nome chegava do design ("Pedro Teixeira") até ser trocado no cliente.
 *
 * Lê, e emite quando não há o que ler, e é de propósito: a guarda do grupo já garantiu que este
 * aluno tem certificado ou concluiu todas as aulas, então se ele não tem código é porque a emissão
 * na conclusão falhou ou porque ele concluiu **antes de a emissão por conclusão existir**
 * (30/set/2026). Emitir aqui resolve os dois casos sem ninguém abrir ticket, e manda o e-mail
 * `certificado` se for a primeira emissão. A função é idempotente: quem já tem código não ganha
 * outro.
 *
 * Service role porque a emissão é escrita confiável, como toda escrita do projeto. A RLS de
 * `certificates` deixaria o aluno LER o próprio, mas não escrever.
 */
export default async function CertificadoPage() {
  const user = await getUsuario();
  // A guarda do grupo já barrou anônimo; isto é o teto do TypeScript, não uma segunda guarda.
  if (!user) notFound();

  const db = createAdminClient();
  const cert = (await lerCertificado(db, user.id)) ?? (await emitirSeConcluiu(db, user.id));
  // Sem código não há folha: um certificado com QR para "/verificar/" vazio é um papel que nenhum
  // RH consegue conferir. O caso é falha de banco na emissão, e a próxima visita tenta de novo.
  if (!cert) {
    return (
      <Painel titulo="Seu certificado ainda não saiu" role="alert">
        <p style={CORPO}>
          Você concluiu todas as aulas, mas não conseguimos emitir o certificado agora. Recarregue a página em alguns
          minutos; se continuar assim, fale com o suporte no{" "}
          <a href={contato.whatsapp} style={{ color: "#1a1815" }}>
            WhatsApp
          </a>
          .
        </p>
      </Painel>
    );
  }
  const nome = ((user.user_metadata?.nome as string | undefined) ?? "").trim();
  const { codigo, emitidoEm } = cert;

  return (
    <div className="cf-pagina">
      <div className="cf-pagina-in">
        <header className="cf-cabeca">
          <p className="cf-sobre">Formação concluída</p>
          <h1>Seu certificado está pronto</h1>
          <p>
            Baixe o PDF, imprima em A4 ou leve ao seu perfil do LinkedIn. Qualquer pessoa confere a autenticidade
            pelo código ou pelo QR code impresso na folha.
          </p>
        </header>

        <div className="cf-vitrine">
          <Folha nome={nome} codigo={codigo} emitidoEm={emitidoEm} />
        </div>

        <AcoesCertificado codigo={codigo} emitidoEm={emitidoEm} />
        <Nps />

        <Link className="cf-volta" href="/app">
          Voltar para a home
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { botao, casca, esc, eyebrow, lead, rodape, titulo } from "@/lib/auth-casca";
import { destinoSeguro } from "@/lib/seguranca";

export const metadata: Metadata = {
  title: "Confirmar acesso",
  robots: { index: false, follow: false },
  // O token está na URL desta página: nada de levá-lo junto em `Referer` para fora.
  referrer: "no-referrer",
};

// Lê o token da query a cada pedido: nunca pode virar página estática nem ir para cache.
export const dynamic = "force-dynamic";

/**
 * A tela do "falta um clique", na cara do curso (09/out/2026). Antes era um HTML solto servido
 * pelo próprio `/auth/confirm`, com outra identidade. O GET do `/auth/confirm` agora só redireciona
 * para cá.
 *
 * ┌─ POR QUE ESTA TELA EXISTE ────────────────────────────────────────────────────────────────────┐
 * │ O link do e-mail vale uma vez só. Filtros de e-mail corporativo (Outlook Safe Links,           │
 * │ Proofpoint, Mimecast) abrem todo link da mensagem antes da pessoa, para checar se é golpe.     │
 * │ Se abrir o link já gastasse o token, o robô gastaria, e o aluno clicaria num link "expirado"   │
 * │ que ele nunca usou. Por isso o token só é consumido no POST deste botão: robô faz GET e não    │
 * │ envia formulário; gente clica. Sem JS que se envie sozinho, de propósito: alguns robôs rodam   │
 * │ JS.                                                                                           │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 */
const TIPOS = new Set(["recovery", "invite", "magiclink", "email"]);
const ENTRADA = new Set(["magiclink", "email"]);
const TOKEN = /^[A-Za-z0-9_-]{10,256}$/;

export default async function ContinuarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const um = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const tokenHash = um("token_hash");
  const tipo = um("type");
  if (!TOKEN.test(tokenHash) || !TIPOS.has(tipo)) redirect("/app/recuperar-senha?estado=invalido");

  const entrada = ENTRADA.has(tipo);
  const next = destinoSeguro(um("next") || null, entrada ? "/app" : "/app/redefinir-senha");

  const html = casca(
    eyebrow(entrada ? "Acesso à formação" : "Primeiro acesso") +
      titulo(entrada ? "Confirme para entrar" : "Confirme para criar sua senha") +
      lead(
        entrada
          ? "Por segurança, o link do e-mail só vale quando você confirma aqui. Um clique e você está dentro da plataforma."
          : "Por segurança, o link do e-mail só vale quando você confirma aqui. Em seguida você escolhe a sua senha e entra na plataforma.",
      ) +
      `<form method="post" action="/auth/confirm" style="margin-top:28px">` +
      `<input type="hidden" name="token_hash" value="${esc(tokenHash)}">` +
      `<input type="hidden" name="type" value="${esc(tipo)}">` +
      `<input type="hidden" name="next" value="${esc(next)}">` +
      botao("CONTINUAR") +
      `</form>` +
      rodape("Não pediu este acesso? Pode fechar esta página: nada muda na sua conta."),
  );

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

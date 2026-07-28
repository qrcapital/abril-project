"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Dispara o e-mail de redefinição.
 *
 * Devolve sempre o MESMO resultado, exista o e-mail ou não, inclusive quando o Supabase
 * barra por rate limit. Revelar a diferença transformaria a tela num verificador de quais
 * e-mails têm conta (`ROUTES.md`). O que acontece de verdade fica no log do servidor.
 */
export async function pedirReset(email: string): Promise<{ ok: true }> {
  const limpo = email.trim().toLowerCase();

  // Validação de forma só para não gastar chamada com entrada vazia; o resultado para o
  // usuário é o mesmo de qualquer jeito.
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(limpo)) {
    const supabase = await createClient();
    // O template do e-mail monta o link como
    //   {{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery
    // então o `redirectTo` vai SEM query string. Usar `{{ .RedirectTo }}` em vez de
    // `{{ .SiteURL }}` faz o link seguir o ambiente que pediu o reset: pedido no localhost
    // chega apontando para o localhost, pedido no homolog aponta para o homolog, sem
    // ninguém trocar o Site URL do projeto.
    //
    // Isso é seguro porque o Supabase valida o `redirectTo` contra a allowlist de Redirect
    // URLs do projeto; um host que não esteja lá é recusado por ele, não por nós.
    const host = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const { error } = await supabase.auth.resetPasswordForEmail(limpo, {
      redirectTo: `${host}/auth/confirm`,
    });
    if (error) console.warn("[recuperar-senha] resetPasswordForEmail:", error.message);
  }

  return { ok: true };
}

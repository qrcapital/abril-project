"use server";

import { createClient } from "@/lib/supabase/server";
import { validarSenha } from "@/lib/senha";

/**
 * Grava a senha nova.
 *
 * Depende da sessão que o `/auth/confirm` criou ao consumir o `token_hash`, então usa o
 * cliente com a sessão do usuário, nunca a service role: quem pode trocar a senha é o dono
 * do link, e é a sessão que prova isso.
 */
export async function definirSenha(
  senha: string,
): Promise<{ ok: true } | { ok: false; erro: string }> {
  const problema = validarSenha(senha);
  if (problema) return { ok: false, erro: problema };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      ok: false,
      erro: "O link de redefinição já não vale. Peça outro na tela anterior.",
    };

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    console.warn("[redefinir-senha] updateUser:", error.message);
    return { ok: false, erro: "Não foi possível salvar a senha. Tente de novo." };
  }
  return { ok: true };
}

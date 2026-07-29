"use server";

import { createClient } from "@/lib/supabase/server";
import { validarSenha } from "@/lib/senha";

/**
 * Troca a senha de quem está logado, exigindo a senha ATUAL.
 *
 * Por que pedir a atual, se a sessão já prova quem é: por padrão o Supabase deixa a sessão
 * sozinha trocar a senha (a opção "Secure password change" do painel vem desligada). Sem esta
 * exigência, um navegador destravado por dois minutos basta para alguém trocar a senha do
 * aluno sem saber a antiga, e aí o dono perde a conta. A checagem é feita com
 * `signInWithPassword`, que é o único jeito de verificar a senha atual no Supabase.
 *
 * Diferente da redefinição por e-mail (`/app/redefinir-senha`), que prova posse pelo link.
 */
export async function trocarSenha(
  atual: string,
  nova: string,
): Promise<{ ok: true } | { ok: false; erro: string }> {
  if (!atual) return { ok: false, erro: "Informe a senha atual." };

  const problema = validarSenha(nova);
  if (problema) return { ok: false, erro: problema };
  if (atual === nova) return { ok: false, erro: "A senha nova precisa ser diferente da atual." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, erro: "Sua sessão expirou. Entre de novo." };

  // Confere a senha atual. Erro aqui não mexe na sessão: quem errou continua logado.
  const { error: errAtual } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: atual,
  });
  if (errAtual) return { ok: false, erro: "A senha atual não confere." };

  const { error } = await supabase.auth.updateUser({ password: nova });
  if (error) {
    console.warn("[conta] updateUser:", error.message);
    return { ok: false, erro: "Não foi possível salvar a senha. Tente de novo." };
  }
  return { ok: true };
}

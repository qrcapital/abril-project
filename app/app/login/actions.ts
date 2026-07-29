"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { validarSenha } from "@/lib/senha";

/** Anos de acesso da matrícula. Espelha o ACCESS_YEARS do webhook do Guru. */
const ANOS_ACESSO = 1;

/**
 * Cria a conta do aluno no primeiro acesso (homolog simula a compra do Guru).
 * Usa a service role: cria o usuário JÁ CONFIRMADO (sem depender de e-mail de
 * confirmação) e garante o perfil — idempotente, caso o trigger não rode.
 * Em produção, quem cria a conta é o webhook do Guru; aqui é o próprio signup.
 */
export async function criarConta(
  email: string,
  password: string,
  nome?: string
): Promise<{ ok?: true; error?: string }> {
  if (!email) return { error: "Informe o e-mail." };
  // Mesma regra da tela de redefinição: as duas portas que criam senha usam o mesmo
  // validador, senão o produto passa a ter duas exigências diferentes.
  const problema = validarSenha(password);
  if (problema) return { error: problema };

  const nomeLimpo = nome?.trim();
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    // Mesma chave que o webhook do Guru grava em produção. Em homolog, vem do
    // campo "Nome completo" do primeiro acesso, para o nome sair certo no certificado.
    ...(nomeLimpo ? { user_metadata: { nome: nomeLimpo } } : {}),
  });

  if (error) {
    return {
      error: /already|registered|exists/i.test(error.message)
        ? "Este e-mail já tem conta. Faça login."
        : error.message,
    };
  }
  if (data.user) {
    // Em homolog este signup FAZ o papel da compra, então ele também cria a matrícula. Em
    // produção quem cria é o webhook do Guru, com o `guru_order_id` real. Sem isto, a conta
    // nasceria sem matrícula e a guarda de acesso do `(sala)` mandaria o aluno recém-criado
    // direto para a tela de bloqueio.
    const expiraEm = new Date();
    expiraEm.setFullYear(expiraEm.getFullYear() + ANOS_ACESSO);
    const { error: matricula } = await admin.from("enrollments").insert({
      user_id: data.user.id,
      status: "active",
      expires_at: expiraEm.toISOString(),
    });
    if (matricula) {
      console.error("[login] matricula nao criada:", matricula.message);
      await admin.auth.admin.deleteUser(data.user.id);
      return { error: "Não foi possível concluir o cadastro. Tente de novo." };
    }

    const { error: perfil } = await admin
      .from("profiles")
      .upsert({ id: data.user.id }, { onConflict: "id" });
    // Sem perfil a conta fica pela metade: o verify_certificate() faz join em profiles,
    // então o certificado não verifica lá na frente. Desfaz o usuário para o retry
    // funcionar, senão ele esbarra em "já tem conta" e o furo continua invisível.
    if (perfil) {
      console.error("[login] perfil não criado:", perfil.message);
      await admin.auth.admin.deleteUser(data.user.id);
      return { error: "Não foi possível concluir o cadastro. Tente de novo." };
    }
  }
  return { ok: true };
}

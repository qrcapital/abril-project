"use server";

import { createAdminClient } from "@/lib/supabase/admin";

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
  if (!email || password.length < 6) return { error: "Dados inválidos." };

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
    await admin.from("profiles").upsert({ id: data.user.id }, { onConflict: "id" });
  }
  return { ok: true };
}

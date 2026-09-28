"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { aceitouVigente, registrarConsentimento } from "@/lib/consentimento";

/**
 * Registra o aceite de quem chegou ao curso sem passar pela tela de primeiro acesso.
 *
 * Server action é porta própria, então a conferência de sessão é aqui e não na tela.
 *
 * Idempotente por vontade própria: se a conta já aceitou a versão vigente, devolve ok sem gravar
 * de novo. Sem isso, dois cliques no botão viram duas linhas iguais no log, e log de consentimento
 * com duplicata faz quem audita perguntar qual das duas vale.
 */
export async function aceitarDocumentos(): Promise<{ ok: true } | { ok: false; erro: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: "Sua sessão expirou. Entre de novo para continuar." };

  const admin = createAdminClient();
  if (await aceitouVigente(admin, user.id)) return { ok: true };

  const { data: matricula } = await admin
    .from("enrollments")
    .select("guru_order_id")
    .eq("user_id", user.id)
    .order("purchased_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const linhas = await registrarConsentimento(admin, {
    userId: user.id,
    email: user.email ?? "",
    nome: (user.user_metadata?.nome as string | undefined) ?? null,
    origem: "primeiro-acesso",
    guruOrderId: matricula?.guru_order_id ?? null,
  });

  // AQUI A REGRA DE "NÃO DERRUBAR NINGUÉM" SE INVERTE, e de propósito. Nas outras portas a pessoa
  // estava fazendo outra coisa (criando senha) e o aceite pegava carona; aqui o aceite é a única
  // coisa que a tela faz. Deixar passar com a gravação falhada devolveria o aluno ao curso e ele
  // cairia nesta mesma tela na próxima navegação, num laço sem explicação.
  if (linhas === 0)
    return { ok: false, erro: "Não foi possível registrar o aceite agora. Tente de novo." };

  return { ok: true };
}

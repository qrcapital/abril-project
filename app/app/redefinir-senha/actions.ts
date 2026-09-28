"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { aceitouVigente, registrarConsentimento } from "@/lib/consentimento";
import { validarSenha } from "@/lib/senha";

/**
 * Grava a senha nova e, no primeiro acesso, o aceite dos documentos.
 *
 * Depende da sessão que o `/auth/confirm` criou ao consumir o `token_hash`, então usa o
 * cliente com a sessão do usuário, nunca a service role: quem pode trocar a senha é o dono
 * do link, e é a sessão que prova isso.
 *
 * ┌─ POR QUE A EXIGÊNCIA DO ACEITE É CONFERIDA AQUI DE NOVO ──────────────────────────────────────┐
 * │ Server action é porta própria: recebe POST direto, sem passar pela tela. O `required` do       │
 * │ checkbox e a validação do cliente são conforto, não guarda. Quem decide se este usuário        │
 * │ precisa aceitar é esta função, perguntando ao banco, do mesmo jeito que a página perguntou.    │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * A ORDEM IMPORTA: o aceite é gravado ANTES da troca de senha. Se fosse depois e a gravação
 * falhasse, o aluno já estaria com senha nova e entraria no curso sem registro nenhum; do jeito
 * que está, a única janela ruim é gravar o aceite e a senha falhar, que se resolve sozinha na
 * próxima tentativa, porque o aceite vale e a tela deixa de pedir a caixa.
 */
export async function definirSenha(
  senha: string,
  aceite = false,
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

  const admin = createAdminClient();
  const jaAceitou = await aceitouVigente(admin, user.id);

  if (!jaAceitou) {
    // Não conseguir gravar o aceite não pode barrar ninguém (ver a regra no topo de
    // `lib/consentimento.ts`). Não ter aceite, sim: aqui não há consentimento para registrar.
    if (!aceite)
      return {
        ok: false,
        erro: "Para continuar, confirme que leu e aceita os Termos de Uso e a Política de Privacidade.",
      };

    // O pedido do Guru amarra o aceite à compra. Pode não existir (conta criada à mão em homolog),
    // e a ausência dele não é motivo para não registrar o resto.
    const { data: matricula } = await admin
      .from("enrollments")
      .select("guru_order_id")
      .eq("user_id", user.id)
      .order("purchased_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    await registrarConsentimento(admin, {
      userId: user.id,
      email: user.email ?? "",
      nome: (user.user_metadata?.nome as string | undefined) ?? null,
      origem: "primeiro-acesso",
      guruOrderId: matricula?.guru_order_id ?? null,
    });
  }

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    console.warn("[redefinir-senha] updateUser:", error.message);
    return { ok: false, erro: "Não foi possível salvar a senha. Tente de novo." };
  }
  return { ok: true };
}

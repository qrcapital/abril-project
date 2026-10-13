"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { aceitouVigente, registrarConsentimento } from "@/lib/consentimento";
import { validarSenha } from "@/lib/senha";
import { papelAtual } from "@/lib/admin";
import { precisaTrocarSenha } from "@/lib/usuario-login";

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
): Promise<{ ok: true; destino: string; renovar: boolean } | { ok: false; erro: string }> {
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
  // Observador (0029) não é aluno: não comprou, não tem matrícula, e os Termos e a Política são os
  // do curso. A mesma pergunta que a página faz para esconder a caixa, refeita aqui porque esta
  // action recebe POST direto.
  const { papel } = await papelAtual();
  const observador = papel === "observador";
  const jaAceitou = observador || (await aceitouVigente(admin, user.id));

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

  // TROCA OBRIGATÓRIA (13/out/2026): a senha gerada pelo admin já foi substituída, então a marca
  // sai. Service role porque `app_metadata` não é editável pelo próprio usuário, e é isso que
  // impede alguém de se livrar da troca sozinho. O id é o da sessão conferida acima, nunca um que
  // venha do cliente. O resto do `app_metadata` vai junto para nada se perder na gravação.
  const trocaObrigatoria = precisaTrocarSenha(user);
  if (trocaObrigatoria) {
    const { error: erroMarca } = await admin.auth.admin.updateUserById(user.id, {
      app_metadata: { ...user.app_metadata, trocar_senha: false },
    });
    if (erroMarca) {
      // A senha nova vale, mas o proxy continuaria pedindo a troca. Dizer isso é melhor que mandar
      // a pessoa para um painel que a devolveria a esta tela.
      console.error("[redefinir-senha] marca trocar_senha nao limpa:", erroMarca.message);
      return { ok: false, erro: "A senha foi salva, mas o acesso não foi liberado. Tente de novo." };
    }
  }

  // Senha trocada derruba as OUTRAS sessões, e esta continua. Quem troca a senha porque desconfia
  // que alguém entrou na conta espera que esse alguém saia; sem isto, a sessão do intruso seguiria
  // valendo até expirar sozinha. Melhor esforço: a senha nova já está gravada, e uma falha aqui
  // não pode virar "não foi possível salvar" na tela.
  //
  // EXCETO O OBSERVADOR: a conta da Abril e a da QR Capital são usadas por mais de uma pessoa, em
  // mais de um aparelho, ao mesmo tempo (pedido do Marcelo, 13/out/2026). Derrubar as outras
  // sessões a cada troca tiraria do painel quem não trocou nada.
  if (!observador) {
    try {
      const { error: saida } = await supabase.auth.signOut({ scope: "others" });
      if (saida) console.warn("[redefinir-senha] signOut(others):", saida.message);
    } catch (e) {
      console.warn("[redefinir-senha] signOut(others) falhou:", e instanceof Error ? e.message : e);
    }
  }

  // O destino é decidido aqui, com o papel já lido: observador vai direto para a única tela dele,
  // admin para o painel, aluno para a sala, como sempre foi.
  const destino =
    papel === "observador" ? "/admin/indicadores" : papel === "admin" ? "/admin" : "/app";
  return { ok: true, destino, renovar: trocaObrigatoria };
}

import "server-only";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export type Papel = "admin" | "aluno" | "anonimo";

/**
 * Quem é o dono desta sessão, do ponto de vista do admin.
 *
 * Lê com o cliente **anon**, e isso é deliberado. O `PLANO-ADMIN.md` §2 diz que toda
 * leitura do admin passa pela service role, o que vale para os DADOS que o painel mostra e
 * não pode valer para esta pergunta: a service role não tem sessão, `auth.uid()` é null
 * nela, e ela responderia "não é admin" para todo mundo, inclusive para o admin de verdade.
 * Identidade se pergunta com a chave do usuário.
 *
 * A checagem é a função `is_admin()` do banco, e não um `select is_admin from profiles`,
 * porque é a MESMA função em que as dez policies de RLS se apoiam. Se um dia a definição de
 * admin mudar, a guarda da tela e a do banco mudam juntas; com o select solto, uma das duas
 * ficaria para trás sem avisar.
 *
 * `cache()` porque o layout pergunta para decidir se serve a tela e a tela pergunta de novo
 * para mostrar quem está logado: uma ida ao banco por requisição, não duas.
 */
export const papelAtual = cache(
  async (): Promise<{ papel: Papel; mestre: boolean; id?: string; email?: string }> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { papel: "anonimo", mestre: false };

    const base = { id: user.id, email: user.email };
    const { data, error } = await supabase.rpc("is_admin");
    // Erro aqui é falha de rede ou de grant, e o lado seguro de "não sei" é "não entra".
    if (error || data !== true) return { papel: "aluno", mestre: false, ...base };

    // `mestre` é um campo À PARTE e `papel` continua "admin" para os dois níveis, de propósito:
    // se mestre virasse um valor de `papel`, toda checagem existente na forma
    // `papel !== "admin"` passaria a trancar justamente o mestre para fora. A guarda do layout é
    // uma dessas.
    const { data: eMestre } = await supabase.rpc("is_master");
    return { papel: "admin", mestre: eMestre === true, ...base };
  },
);

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Registra uma ação sensível do admin (PLANO-ADMIN §2, tabela da migration `0014`).
 *
 * **Não lança, e continua logando no servidor.** As duas coisas são deliberadas:
 *
 * - não lançar, porque interromper uma revogação de privilégio ou uma liberação de 2ª chamada por
 *   causa de uma falha de gravação do rastro seria trocar um problema de registro por um problema de
 *   operação, e quem clicou não tem o que fazer com esse erro;
 * - manter o `console.error`, porque é o rastro que existia antes desta tabela. Se a gravação falhar,
 *   o pior caso volta a ser o de ontem, e não fica pior que ele.
 *
 * O `autor_email` é gravado junto do `autor_id` de propósito: o id vira null se a conta do admin for
 * apagada (`on delete set null`), e um rastro que diz "alguém fez isso" não serve para nada.
 */
export async function auditar(
  db: SupabaseClient,
  {
    autor,
    acao,
    alvo,
    detalhe = {},
  }: {
    autor: { id?: string; email?: string };
    /** `dominio.acao`, para a listagem futura poder agrupar: `papel.promover`, `prova.segunda-chamada`. */
    acao: string;
    alvo?: string | null;
    detalhe?: Record<string, unknown>;
  },
): Promise<void> {
  console.log(`[admin] ${autor.email ?? autor.id ?? "?"} ${acao} ${alvo ?? ""}`.trim());

  const { error } = await db.from("admin_audit").insert({
    autor_id: autor.id ?? null,
    autor_email: autor.email ?? null,
    acao,
    alvo_id: alvo ?? null,
    detalhe,
  });
  if (error) console.error(`[admin] nao deu para auditar ${acao}:`, error.message);
}

import { createHash } from "node:crypto";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Teto de pedidos por chave, com o estado no Postgres (`consumir_limite`, migration `0025`).
 *
 * Existe porque o teto em memória não vale na Netlify: cada instância tem o próprio contador e
 * reinício zera. O banco é o único estado que todas as instâncias enxergam.
 *
 * DEVOLVE `true` QUANDO O PEDIDO PODE SEGUIR. Em erro de banco (migration não aplicada, rede),
 * também devolve `true` e grita no log: as duas portas que usam isto são a recuperação de senha e
 * o registro de consentimento, e trancar as duas porque o contador caiu troca um risco de abuso
 * por um defeito certo, que é aluno sem conseguir recuperar a senha.
 */
export async function consumirLimite(
  db: SupabaseClient,
  chave: string,
  limite: number,
  janelaSegundos: number,
): Promise<boolean> {
  const { data, error } = await db.rpc("consumir_limite", {
    chave,
    limite,
    janela_segundos: janelaSegundos,
  });
  if (error) {
    console.error(`[limite] consumir_limite falhou (${chave.split(":")[0]}):`, error.message);
    return true;
  }
  return data !== false;
}

/**
 * O e-mail vira hash antes de virar chave: a tabela `rate_limits` não precisa saber QUEM pediu,
 * só quantas vezes o mesmo endereço pediu. Sem isto, ela seria mais um lugar com e-mail pessoal
 * sem dono, fora do log de consentimento e da política de retenção.
 */
export const chaveDeEmail = (prefixo: string, email: string) =>
  `${prefixo}:email:${createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32)}`;

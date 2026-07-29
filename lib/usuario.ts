import { cache } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "./supabase/server";

/**
 * O usuário logado, uma vez por requisição.
 *
 * O `cache()` do React é o que segura o custo: o layout e a tela pedem o usuário cada um por
 * sua conta, e o Supabase é chamado uma vez só. Sem ele, toda tela de `/app` passaria a fazer
 * três chamadas de autenticação por requisição (proxy + layout + tela) em vez de duas.
 *
 * Por isso **toda tela de `(sala)` usa este helper** em vez de chamar `auth.getUser()`
 * direto: quem chamar por fora fica de fora do cache e paga a chamada extra.
 *
 * O preenchimento do markup vive em `usuario-template.ts`, que é puro: este módulo puxa
 * `next/headers` pela cadeia do cliente Supabase e não roda fora do Next.
 */
export const getUsuario = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
});

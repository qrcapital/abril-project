// Rotina de hora em hora: avisa por e-mail quem teve um módulo liberado no próprio calendário.
// A regra inteira mora em `lib/avisos-modulo.ts`; aqui só o agendamento e as credenciais.
//
// Função agendada da Netlify: roda só no deploy publicado (não em preview), com teto de 30 s.
// Para rodar à mão, use "Run now" na aba Functions do painel da Netlify.

import { createClient } from "@supabase/supabase-js";

import { avisarModulosLiberados } from "../../lib/avisos-modulo.ts";

export default async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) {
    console.error("[avisos-modulo] faltam NEXT_PUBLIC_SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY");
    return new Response("sem credenciais", { status: 500 });
  }
  const db = createClient(url, chave, { auth: { autoRefreshToken: false, persistSession: false } });
  try {
    const resumo = await avisarModulosLiberados(db);
    console.log("[avisos-modulo]", JSON.stringify(resumo));
    return Response.json(resumo);
  } catch (e) {
    console.error("[avisos-modulo] falhou:", e instanceof Error ? e.message : e);
    return new Response("falhou", { status: 500 });
  }
};

export const config = { schedule: "@hourly" };

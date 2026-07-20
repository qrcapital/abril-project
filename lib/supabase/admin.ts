import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a service role: IGNORA a RLS.
 * Uso EXCLUSIVO no servidor, para operações confiáveis:
 * webhook do Guru (criar usuário, matrícula), correção da prova,
 * emissão de certificado, ações do admin. Nunca expor ao navegador.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

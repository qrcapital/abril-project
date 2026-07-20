import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para o navegador (Client Components).
 * Usa a chave anon: respeita a RLS.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

import { NextResponse, type NextRequest } from "next/server";
import { destinoSeguro } from "@/lib/seguranca";
import { createClient } from "@/lib/supabase/server";

/**
 * Troca o `token_hash` do e-mail por uma sessão em cookie.
 *
 * Serve as DUAS portas, mudando só o `type`:
 * - `recovery`: "esqueci minha senha";
 * - `invite`: primeiro acesso, que é o link que o webhook do Guru gera
 *   (`app/api/webhooks/guru/route.ts` já usa `generateLink({ type: "invite" })`).
 *
 * Por que `verifyOtp` com `token_hash` e não a troca de `code` do PKCE: o `@supabase/ssr`
 * fixa `flowType: "pkce"`, e PKCE guarda um `code_verifier` no cookie do dispositivo que
 * PEDIU o reset. Quem pede no celular e abre o e-mail no desktop não tem esse verifier, e
 * a troca falha. O `token_hash` é autossuficiente e atravessa dispositivo.
 *
 * O token morre aqui: a tela onde a senha é digitada não o recebe, então ele não fica no
 * histórico do navegador nem escapa por `Referer`.
 */

const TIPOS = new Set(["recovery", "invite"]);

// A guarda de destino (`destinoSeguro`) mora em `lib/seguranca.ts`, puro, porque este route
// handler não roda no node do self-check — e ela ganhou um caso que dói: `/\evil.com`.

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type");

  const paraRecuperar = (estado: string) =>
    NextResponse.redirect(new URL(`/app/recuperar-senha?estado=${estado}`, origin));

  if (!tokenHash || !tipo || !TIPOS.has(tipo)) return paraRecuperar("invalido");

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: tipo as "recovery" | "invite",
    token_hash: tokenHash,
  });

  if (error) {
    // Link expirado, já usado, ou hash adulterado. A mensagem na tela é a mesma nos três
    // casos, para não virar oráculo de token válido.
    console.warn("[auth/confirm] verifyOtp falhou:", error.message);
    return paraRecuperar("expirado");
  }

  return NextResponse.redirect(
    new URL(destinoSeguro(searchParams.get("next"), "/app/redefinir-senha"), origin),
  );
}

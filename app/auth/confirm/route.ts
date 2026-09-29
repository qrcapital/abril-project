import { NextResponse, type NextRequest } from "next/server";

import { origemValida } from "@/lib/admin-guarda";
import { esc } from "@/lib/auth-casca";
import { destinoSeguro } from "@/lib/seguranca";
import { createClient } from "@/lib/supabase/server";

/**
 * Troca o `token_hash` do e-mail por uma sessão em cookie.
 *
 * Serve as DUAS portas, mudando só o `type`:
 * - `recovery`: "esqueci minha senha" E, desde 29/set/2026, o primeiro acesso do comprador
 *   (`enviarAcesso` em `lib/email.ts` explica por que o `invite` deixou de servir);
 * - `invite`: segunda tentativa do mesmo `enviarAcesso`, para conta ainda não confirmada.
 *
 * ┌─ O GET NÃO CONSOME O TOKEN ───────────────────────────────────────────────────────────────────┐
 * │ Até 29/set o GET chamava `verifyOtp` direto. O link é de uso único, e filtro de e-mail        │
 * │ corporativo (Outlook Safe Links, Proofpoint, Mimecast) abre todo link da mensagem antes da    │
 * │ pessoa, para ver se é malicioso. Esse robô gastava o token, e o aluno clicava num link que já │
 * │ tinha "expirado" sem nunca ter sido usado por ele.                                            │
 * │                                                                                               │
 * │ Agora o GET só mostra uma tela com o botão "Continuar", que manda o token por POST. Robô de   │
 * │ varredura faz GET e não envia formulário; gente clica. A tela não tem JS que se envie sozinho │
 * │ de propósito: alguns desses robôs executam JS.                                               │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Por que `verifyOtp` com `token_hash` e não a troca de `code` do PKCE: o `@supabase/ssr` fixa
 * `flowType: "pkce"`, e PKCE guarda um `code_verifier` no cookie do dispositivo que PEDIU o reset.
 * Quem pede no celular e abre o e-mail no desktop não tem esse verifier, e a troca falha. O
 * `token_hash` é autossuficiente e atravessa dispositivo.
 *
 * O token morre no POST: a tela onde a senha é digitada não o recebe, então ele não fica no
 * histórico do navegador nem escapa por `Referer`.
 */

const TIPOS = new Set(["recovery", "invite"]);
const DESTINO_PADRAO = "/app/redefinir-senha";

// A guarda de destino (`destinoSeguro`) mora em `lib/seguranca.ts`, puro, porque este route
// handler não roda no node do self-check.

const paraRecuperar = (req: NextRequest, estado: string) =>
  // 303: depois de um POST, o navegador segue com GET.
  NextResponse.redirect(new URL(`/app/recuperar-senha?estado=${estado}`, req.nextUrl.origin), 303);

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type");
  if (!tokenHash || !tipo || !TIPOS.has(tipo)) return paraRecuperar(req, "invalido");

  const next = destinoSeguro(searchParams.get("next"), DESTINO_PADRAO);

  return new NextResponse(pagina({ tokenHash, tipo, next }), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // O token está no HTML: nada de cache, nem no navegador nem na borda.
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function POST(req: NextRequest) {
  // Formulário vindo de outro site seria login forçado na conta de outra pessoa (o atacante manda
  // o token DELE e a vítima passa a navegar logada como ele). O `Origin` fecha isso.
  if (!origemValida(req)) return paraRecuperar(req, "invalido");

  const form = await req.formData().catch(() => null);
  const tokenHash = String(form?.get("token_hash") ?? "");
  const tipo = String(form?.get("type") ?? "");
  if (!tokenHash || !TIPOS.has(tipo)) return paraRecuperar(req, "invalido");

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: tipo as "recovery" | "invite",
    token_hash: tokenHash,
  });

  if (error) {
    // Link expirado, já usado, ou hash adulterado. A mensagem na tela é a mesma nos três
    // casos, para não virar oráculo de token válido.
    console.warn("[auth/confirm] verifyOtp falhou:", error.message);
    return paraRecuperar(req, "expirado");
  }

  const destino = destinoSeguro(String(form?.get("next") ?? ""), DESTINO_PADRAO);
  return NextResponse.redirect(new URL(destino, req.nextUrl.origin), 303);
}

/**
 * A tela do botão. HTML próprio e autocontido, e não a casca das telas de acesso
 * (`lib/auth-casca.ts`): aquela depende do `auth.css`, que só o layout de `/app` injeta, e esta
 * rota mora em `/auth`. As cores são as mesmas (creme, tinta, vermelho da campanha).
 */
function pagina({ tokenHash, tipo, next }: { tokenHash: string; tipo: string; next: string }) {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Continuar | Estratégia Internacional</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
    background:#f7f4ee;color:#1a1815;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif}
  .cartao{width:100%;max-width:440px;background:#fdfbf6;border:1px solid #e2dacd;border-radius:16px;overflow:hidden}
  .faixa{background:#8E1522;color:#f7f4ee;padding:14px 28px;font-size:11px;font-weight:700;letter-spacing:.16em}
  .miolo{padding:28px}
  h1{margin:0 0 10px;font-family:Georgia,"Times New Roman",serif;font-weight:400;font-size:24px;line-height:1.3}
  p{margin:0 0 22px;font-size:15px;line-height:1.6;color:#6b655c}
  button{width:100%;border:0;border-radius:14px;padding:15px 20px;background:#C1121F;color:#f7f4ee;
    font-family:inherit;font-weight:700;font-size:15px;line-height:1;cursor:pointer}
  button:hover{background:#A01827}
  button:focus-visible{outline:3px solid #1a1815;outline-offset:3px}
</style></head>
<body>
<main class="cartao">
  <div class="faixa">VEJA NEGÓCIOS&nbsp;&nbsp;|&nbsp;&nbsp;ESTRATÉGIA INTERNACIONAL</div>
  <div class="miolo">
    <h1>Falta um clique</h1>
    <p>Continue para criar sua senha. O link do e-mail vale uma vez só, e por isso ele só é usado quando você clica no botão.</p>
    <form method="post" action="/auth/confirm">
      <input type="hidden" name="token_hash" value="${esc(tokenHash)}">
      <input type="hidden" name="type" value="${esc(tipo)}">
      <input type="hidden" name="next" value="${esc(next)}">
      <button type="submit">Continuar</button>
    </form>
  </div>
</main>
</body></html>`;
}

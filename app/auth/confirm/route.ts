import { NextResponse, type NextRequest } from "next/server";

import { vaiAoPainel } from "@/lib/acesso-painel";
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

/**
 * `magiclink` e `email` entraram em 30/set/2026: são o "Send magic link" do painel do Supabase.
 * O modelo de e-mail do painel foi apontado para esta rota (antes ele levava à raiz do site, que é
 * a pré-lista da live). Esse link não cria senha, só abre sessão, então o destino é outro: o admin
 * vai para o `/admin`, o aluno para o `/app`.
 */
const TIPOS = new Set(["recovery", "invite", "magiclink", "email"]);
const ENTRADA = new Set(["magiclink", "email"]);
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

  const next = destinoSeguro(searchParams.get("next"), ENTRADA.has(tipo) ? "/app" : DESTINO_PADRAO);

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

  // ┌─ SESSÃO ANTERIOR SAI ANTES DO TOKEN ENTRAR (10/out/2026) ──────────────────────────────────┐
  // │ Bug visto na compra de teste do Marcelo: o navegador já estava logado em OUTRA conta (a do  │
  // │ admin), ele abriu o link de primeiro acesso da conta nova, e a senha foi gravada na conta   │
  // │ antiga, que seguiu logada. A sessão nova e a velha conviviam nos cookies (o `@supabase/ssr` │
  // │ divide a sessão em pedaços `.0`, `.1`, e um pedaço velho podia vencer a leitura). Agora a   │
  // │ sessão que estiver no navegador é encerrada aqui, antes do `verifyOtp`, e o que fica é só   │
  // │ a do dono do link. Falhar ao sair não bloqueia: o pior caso é o comportamento antigo.       │
  // └─────────────────────────────────────────────────────────────────────────────────────────────┘
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch (e) {
    console.warn("[auth/confirm] signOut(local) antes do token:", e instanceof Error ? e.message : e);
  }

  const { error } = await supabase.auth.verifyOtp({
    // `magiclink` é o nome antigo do tipo `email`; o Auth aceita os dois, mas o SDK tipa só o novo.
    type: (ENTRADA.has(tipo) ? "email" : tipo) as "recovery" | "invite" | "email",
    token_hash: tokenHash,
  });

  if (error) {
    // Link expirado, já usado, ou hash adulterado. A mensagem na tela é a mesma nos três
    // casos, para não virar oráculo de token válido.
    console.warn("[auth/confirm] verifyOtp falhou:", error.message);
    return paraRecuperar(req, "expirado");
  }

  if (ENTRADA.has(tipo)) {
    // Link de entrada: admin e observador caem no painel, aluno na sala. Mesma regra do login com
    // senha (`lib/acesso-painel.ts`).
    const painel = await vaiAoPainel(supabase);
    return NextResponse.redirect(new URL(painel ? "/admin" : "/app", req.nextUrl.origin), 303);
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
    <p>${ENTRADA.has(tipo) ? "Continue para entrar na sua conta." : "Continue para criar sua senha."} O link do e-mail vale uma vez só, e por isso ele só é usado quando você clica no botão.</p>
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

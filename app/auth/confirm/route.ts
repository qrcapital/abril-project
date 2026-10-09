import { redirecionar303 } from "@/lib/redirecionar";
import { NextResponse, type NextRequest } from "next/server";

import { vaiAoPainel } from "@/lib/acesso-painel";
import { origemValida } from "@/lib/admin-guarda";
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
 * │ Agora o GET só leva à tela `/app/continuar`, com o botão que manda o token por POST. Robô de  │
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
  redirecionar303(`/app/recuperar-senha?estado=${estado}`);

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type");
  if (!tokenHash || !tipo || !TIPOS.has(tipo)) return paraRecuperar(req, "invalido");

  const next = destinoSeguro(searchParams.get("next"), ENTRADA.has(tipo) ? "/app" : DESTINO_PADRAO);

  // A tela do botão mora em `/app/continuar` (09/out/2026), com a casca das telas de acesso. Aqui
  // só se confere o básico e se repassa; o token continua sem ser consumido no GET.
  const destino = new URL("/app/continuar", req.nextUrl.origin);
  destino.searchParams.set("token_hash", tokenHash);
  destino.searchParams.set("type", tipo);
  destino.searchParams.set("next", next);
  const r = redirecionar303(destino);
  r.headers.set("Cache-Control", "no-store");
  r.headers.set("Referrer-Policy", "no-referrer");
  return r;
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
    return redirecionar303(painel ? "/admin" : "/app");
  }

  const destino = destinoSeguro(String(form?.get("next") ?? ""), DESTINO_PADRAO);
  return redirecionar303(destino);
}

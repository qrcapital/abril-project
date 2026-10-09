import { NextResponse } from "next/server";

/**
 * Redirecionamento 303 com `Location` RELATIVO (só caminho e query).
 *
 * ┌─ POR QUE (09/out/2026) ───────────────────────────────────────────────────────────────────────┐
 * │ Atrás do domínio `blocktrends.abril.com.br`, o `req.url` que chega à função às vezes traz o   │
 * │ endereço interno da Netlify (`homolog--abril-project.netlify.app`). `NextResponse.redirect`   │
 * │ exige URL absoluta, e a montada a partir do `req.url` mandava o admin para o domínio da       │
 * │ Netlify, onde o cookie da sessão não existe: caía no login ("Adicionar aluno" de 09/out). Com  │
 * │ caminho relativo o navegador resolve contra o endereço em que ele já está, seja qual for.     │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 */
export function redirecionar303(destino: URL | string): NextResponse {
  const u = typeof destino === "string" ? new URL(destino, "http://local") : destino;
  return new NextResponse(null, {
    status: 303,
    headers: { Location: `${u.pathname}${u.search}`, "Cache-Control": "no-store" },
  });
}

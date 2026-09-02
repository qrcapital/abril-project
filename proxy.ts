import { NextResponse, type NextRequest } from "next/server";

/**
 * ATENÇÃO: esta versão do proxy só existe na branch `pre-lista-isolada`.
 *
 * Ela é a vitrine da pré-lista: uma URL própria, para mandar a tela de captura
 * a quem precisa ver **sem** dar acesso ao resto do projeto. A raiz serve a
 * pré-lista e `/lista-de-espera` também responde; qualquer outro caminho devolve
 * 404 vazio, LP de vendas e área do aluno inclusive.
 *
 * **Esta branch nunca volta para `homolog` nem para `main`.** Ela sai delas, não
 * entra: para atualizar a vitrine, refaça a branch a partir da `homolog` e
 * reaplique este arquivo. Um merge daqui derrubaria o ambiente inteiro.
 *
 * A chamada ao `updateSession` saiu de propósito, e não é só limpeza. O proxy
 * original toca o Supabase em toda request, e sem as chaves no ambiente a edge
 * function estoura — foi o 502 intermitente que apareceu no deploy preview do
 * PR #1, na raiz inclusive. A pré-lista é estática e não tem sessão para
 * renovar, então sem essa chamada **este deploy sobe sem nenhuma variável de
 * ambiente configurada**.
 */

/** Com e sem barra final. Nada mais passa. */
const PERMITIDO = /^\/lista-de-espera\/?$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A raiz serve a pré-lista. É rewrite, não redirect: o link que se manda é a
  // URL nua do site, e ela precisa continuar nua na barra de endereço em vez de
  // saltar para /lista-de-espera assim que abre.
  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/lista-de-espera", request.url));
  }

  if (PERMITIDO.test(pathname)) return NextResponse.next();

  // 404 vazio, não redirect: redirect anuncia que existe outra coisa em algum
  // lugar, e a graça da vitrine é não anunciar.
  return new NextResponse(null, { status: 404 });
}

export const config = {
  // O mesmo matcher da branch de origem: roda em tudo menos assets estáticos.
  // Ele é o que deixa passar as fontes e os SVGs de marca em /lp/ sem o proxy
  // precisar conhecê-los um a um — sem isso, a vitrine bloquearia os próprios
  // assets e a página subiria em Georgia e sem logo.
  // `robots.txt` entrou na lista: `.txt` não está entre as extensões liberadas,
  // então sem esta exceção a própria vitrine bloquearia o arquivo que diz aos
  // buscadores para não indexá-la.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|fonts/|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|woff2?|ttf|otf|mp4)$).*)",
  ],
};

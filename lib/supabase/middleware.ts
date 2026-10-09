import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Renova a sessão do Supabase a cada request e protege as rotas da área do aluno.
 * Sem sessão em /app/* (exceto as telas de acesso), redireciona para /app/login.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Só as áreas com sessão precisam do resto: a LP (`/`), o `/verificar` e o webhook não têm
  // cookie para renovar nem guarda para aplicar, e o getUser() abaixo é uma ida ao Auth por
  // request. O `/admin` FICA na lista mesmo com a guarda morando no layout: server component
  // não grava cookie, então a RENOVAÇÃO da sessão do admin só acontece aqui.
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/app") && !path.startsWith("/auth") && !path.startsWith("/admin")) {
    return response;
  }
  // O `/auth/confirm` troca o token do e-mail por uma sessão NOVA, de outra conta talvez. Renovar
  // aqui a sessão que já estava no navegador gravaria cookies da conta antiga na mesma resposta
  // e podia vencer os da conta nova (bug da compra de teste, 10/out/2026). A rota cuida sozinha.
  if (path.startsWith("/auth/confirm")) return response;

  // Lido ANTES do getUser: quando o refresh token não vale mais, o cliente do Supabase
  // limpa os cookies da sessão pelo `setAll` abaixo, e a checagem depois daria sempre falso.
  // Serve para separar "a sessão acabou" de "nunca entrou", que é a diferença entre explicar
  // o redirecionamento e mentir para quem só digitou o endereço.
  const tinhaSessao = request.cookies
    .getAll()
    .some((c) => /^sb-.*-auth-token(\.\d+)?$/.test(c.name));

  // Supabase ainda não configurado (dev/homolog sem credenciais): não bloqueia nada.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Telas de acesso público dentro de /app (login, primeiro acesso, recuperação).
  const isAccessScreen =
    path.startsWith("/app/login") ||
    path.startsWith("/app/primeiro-acesso") ||
    path.startsWith("/app/recuperar-senha") ||
    path.startsWith("/app/redefinir-senha") ||
    // O "falta um clique" do link do e-mail: quem chega aqui ainda não tem sessão.
    path.startsWith("/app/continuar") ||
    // A página de compra aprovada recebe quem acabou de pagar e ainda não tem sessão.
    path.startsWith("/app/obrigado");

  if (!user && path.startsWith("/app") && !isAccessScreen) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/login";
    // A query da tela de origem não interessa ao login, e levá-la junto vaza contexto na
    // barra de endereço.
    url.search = "";
    // Só explica para quem de fato tinha sessão. Sem isso, quem digitou /app sem nunca ter
    // entrado leria que a sessão dele expirou, o que manda procurar um problema que não existe.
    if (tinhaSessao) url.searchParams.set("estado", "expirou");
    return NextResponse.redirect(url);
  }

  return response;
}

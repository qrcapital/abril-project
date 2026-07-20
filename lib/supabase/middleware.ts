import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Renova a sessão do Supabase a cada request e protege as rotas da área do aluno.
 * Sem sessão em /app/* (exceto as telas de acesso), redireciona para /app/login.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

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

  const path = request.nextUrl.pathname;
  // Telas de acesso público dentro de /app (login, primeiro acesso, recuperação).
  const isAccessScreen =
    path.startsWith("/app/login") ||
    path.startsWith("/app/primeiro-acesso") ||
    path.startsWith("/app/recuperar-senha") ||
    path.startsWith("/app/redefinir-senha");

  if (!user && path.startsWith("/app") && !isAccessScreen) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/login";
    return NextResponse.redirect(url);
  }

  return response;
}

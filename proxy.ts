import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: "middleware" passou a se chamar "proxy" (mesma funcionalidade).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Roda em tudo, menos assets estáticos: imagens, fontes e vídeo. Cada request que passa
  // aqui pode custar um getUser() (uma ida ao Auth), e fonte da LP não tem sessão para renovar.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts/|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|woff2?|ttf|otf|mp4)$).*)",
  ],
};

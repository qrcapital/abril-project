import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: "middleware" passou a se chamar "proxy" (mesma funcionalidade).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Roda em tudo, menos assets estáticos e imagens.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts/|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)"],
};

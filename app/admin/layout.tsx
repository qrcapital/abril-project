import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import Nav from "@/app/admin/_ui/Nav";
import { papelAtual } from "@/lib/admin";

import "./admin.css";

export const metadata: Metadata = { title: "Administração" };

/**
 * Guarda do admin (PLANO-ADMIN §2, decisões do Pedro de 30/jul/2026).
 *
 * Fica no LAYOUT e não no `proxy.ts`, embora o §2 diga proxy, pelo mesmo motivo que já tirou
 * a guarda de matrícula de lá: o proxy roda em toda requisição do site, inclusive na LP, e
 * responder "é admin?" custa uma ida ao banco que a LP não deveria pagar. O proxy continua
 * fazendo o que sabe, que é renovar a sessão.
 *
 * Consequência que exige cuidado: o proxy só protege `/app/*`, então `/admin` recebe visita
 * anônima e os dois casos são tratados aqui, com respostas diferentes de propósito:
 *
 * - **Sem sessão → login.** Não é 404. Quem não está logado não revelou nada sobre si, e
 *   um 404 aqui deixaria o admin legítimo de fora, sem entender que só faltava entrar.
 * - **Logado e não admin → 404.** Redirecionar para `/app` confirmaria que `/admin` existe
 *   para qualquer aluno que digitasse o endereço. O 404 não confirma nem nega.
 *
 * Sobre a armadilha do HANDOFF §6 ("`redirect()` em Server Component sai como 200"): ela vale
 * quando o streaming já começou e o começo da resposta foi enviado. Aqui a decisão acontece na
 * primeira linha do layout, antes de renderizar qualquer coisa, então a resposta é um 307 de
 * verdade, com `location: /app/login` — medido em 30/jul/2026. Vale conferir pelo status NESTE
 * caso, e só neste.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { papel, email } = await papelAtual();
  if (papel === "anonimo") redirect("/app/login");
  if (papel !== "admin") notFound();

  return (
    <div className="admin-root grid min-h-dvh grid-cols-[232px_1fr]">
      <aside className="sticky top-0 h-dvh">
        <Nav email={email} />
      </aside>
      <main className="min-w-0 px-8 py-8">{children}</main>
    </div>
  );
}

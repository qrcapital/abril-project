import { redirect } from "next/navigation";

import { getMatricula } from "@/lib/matricula";
import Chrome from "@/app/app/_ui/Chrome";

// Telas autenticadas do curso. O login (/app/login) e a tela de acesso (/app/acesso) ficam
// fora deste grupo, sem chrome. O certificado também saiu daqui, para o grupo `(certificado)`,
// porque a guarda dele é outra: ver o layout de lá.

/**
 * Guarda de acesso por matrícula (PRD §4). O `proxy.ts` só sabe dizer se existe sessão; quem
 * sabe se o acesso vale é a matrícula.
 *
 * Fica AQUI, e não no proxy, por dois motivos: o proxy roda em toda requisição do site,
 * inclusive a LP, e pagaria uma ida ao banco por página; e aqui o `cache()` faz esta consulta
 * ser a mesma que a tela de acesso usa depois.
 *
 * `/app/acesso` mora fora deste grupo de propósito: dentro, o bloqueio se redirecionaria para
 * si mesmo em laço.
 */
export default async function SalaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Sem `?estado=` na URL: a tela de acesso lê o estado do banco, porque parâmetro de query é
  // escolhido por quem digita o endereço e faria a tela contar a história que o visitante quiser.
  const { estado } = await getMatricula();
  if (estado !== "ativa") redirect("/app/acesso");

  return <Chrome>{children}</Chrome>;
}

import { redirect } from "next/navigation";

import { concluiuAFormacao, lerCertificado } from "@/lib/certificados";
import { getMatricula } from "@/lib/matricula";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUsuario } from "@/lib/usuario";
import Chrome from "@/app/app/_ui/Chrome";

/**
 * O certificado tem guarda própria, e por isso saiu do grupo `(sala)`.
 *
 * **O diploma é do aluno, não do prazo dele** (decisão do Pedro, 29/jul/2026). Quem concluiu o
 * curso continua podendo baixar o certificado depois de o acesso terminar: o conteúdo é que
 * expira, não a conquista. Bloquear a peça que a pessoa já ganhou seria punição, e viraria
 * ticket de suporte na mesma hora.
 *
 * Duas exceções à passagem livre:
 *
 * - **Matrícula revogada** continua bloqueada. Revogação é reembolso ou chargeback, ou seja, a
 *   compra foi desfeita; manter o certificado seria entregar o produto de graça. É a única
 *   diferença de tratamento entre "o prazo acabou" e "a compra não vale".
 * - **Sem certificado emitido e sem todas as aulas concluídas, ninguém entra.** Até 30/set/2026 a
 *   régua era a aprovação na prova final; o curso deixou de ter prova e o certificado passou a sair
 *   na conclusão das aulas que contam (`lessons.conta_no_gate`). Quem já tem certificado entra
 *   sempre, inclusive quem o ganhou pela prova: o código dele continua valendo.
 *
 * As duas leituras usam a service role porque a conta das aulas precisa funcionar para quem já
 * perdeu o acesso ao conteúdo, e a RLS de `lessons` exige acesso ativo.
 */
export default async function CertificadoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [{ estado }, user] = await Promise.all([getMatricula(), getUsuario()]);

  if (estado === "revogada") redirect("/app/acesso");

  const db = createAdminClient();
  const liberado =
    user !== null && ((await lerCertificado(db, user.id)) !== null || (await concluiuAFormacao(db, user.id)));
  // Quem não concluiu vai para onde dá para concluir, se o acesso permitir; se não permitir, a
  // tela de acesso explica o bloqueio, que é a informação mais útil naquele momento.
  if (!liberado) redirect(estado === "ativa" ? "/app" : "/app/acesso");

  return <Chrome>{children}</Chrome>;
}

import { redirect } from "next/navigation";

import { getMatricula } from "@/lib/matricula";
import { foiAprovado } from "@/lib/prova";
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
 * - **Sem aprovação na prova, ninguém entra**, com acesso válido ou não. Este porteiro não
 *   existia até 29/jul: qualquer conta logada abria a tela e baixava um PDF com o próprio nome
 *   sem ter feito a prova, apesar de o `ROUTES.md` já prometer o contrário.
 */
export default async function CertificadoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [{ estado }, aprovado] = await Promise.all([getMatricula(), foiAprovado()]);

  if (estado === "revogada") redirect("/app/acesso");
  // Quem não concluiu vai para onde dá para concluir, se o acesso permitir; se não permitir, a
  // tela de acesso explica o bloqueio, que é a informação mais útil naquele momento.
  if (!aprovado) redirect(estado === "ativa" ? "/app/prova" : "/app/acesso");

  return <Chrome>{children}</Chrome>;
}

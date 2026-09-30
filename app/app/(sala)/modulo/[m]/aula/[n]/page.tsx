import { notFound, redirect } from "next/navigation";

import { getCurriculo } from "@/lib/curriculo";
import { href } from "@/lib/curso";

/**
 * A rota antiga da aula, que virou redirect em 30/set/2026.
 *
 * A aula deixou de ter página própria: ela toca no teatro da página do módulo, escolhida por
 * `?aula=<posição no módulo>`. Esta rota continua existindo porque o endereço dela já saiu em e-mail,
 * favorito e histórico de navegador, e um 404 ali seria o aluno achando que a aula sumiu.
 *
 * O `[n]` daqui é o número GLOBAL da aula (0 a 16), e o destino usa a posição dentro do módulo; quem
 * converte é o currículo, pelo `href`. O `[m]` da URL antiga é ignorado de propósito: quem manda é o
 * módulo real da aula, então um endereço com o módulo errado ainda chega à aula certa.
 *
 * Nenhuma guarda de liberação aqui, e não falta: o destino é a página do módulo, que é quem decide
 * se a aula pode tocar. Checar aqui também daria duas regras para a mesma porta.
 */
export default async function AulaAntiga({ params }: { params: Promise<{ m: string; n: string }> }) {
  const { n } = await params;
  const curriculo = await getCurriculo();
  const achada = curriculo.acharAula(Number(n));
  if (!achada) notFound();
  redirect(href(achada.aula));
}

import { notFound, redirect } from "next/navigation";

/**
 * A página própria do notebook deixou de existir em 30/set/2026: o notebook virou a parte de baixo
 * da página do módulo, uma seção por aula. Fica o redirect para o endereço antigo não virar 404 em
 * quem o guardou.
 */
export default async function NotebookAntigo({ params }: { params: Promise<{ m: string }> }) {
  const { m } = await params;
  const ord = Number(m);
  if (!Number.isInteger(ord) || ord < 0) notFound();
  redirect(`/app/modulo/${ord}#notebook`);
}

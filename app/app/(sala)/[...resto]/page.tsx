import { notFound } from "next/navigation";

/**
 * Captura qualquer URL solta sob `/app` e a joga no `not-found.tsx` do grupo `(sala)`, para
 * o 404 sair com o chrome da área em vez do 404 cru do Next.
 *
 * Existe porque `not-found.tsx` aninhado só atende quem chama `notFound()` dentro do seu
 * ramo; URL sem rota nenhuma cairia no 404 global, que é do layout raiz e vem no tema claro
 * da LP. Rota explícita sempre vence catch-all, então `/app/login`, `/app/conta` e as
 * demais seguem intactas.
 */
export default function Resto() {
  notFound();
}

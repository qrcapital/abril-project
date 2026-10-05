import { redirect } from "next/navigation";

/**
 * Antigo "Comece por aqui", a porta do Módulo 0 de boas-vindas (29/set/2026).
 *
 * Desde 05/out/2026 o curso não tem mais o Módulo 0: começa direto pelo Módulo I, que abre na
 * compra. A rota fica para os links antigos (e-mails já enviados, favoritos) e manda para a página
 * do primeiro módulo, que tem o teatro, a playlist e o notebook.
 *
 * Mora dentro de `(sala)`, então a matrícula e o aceite dos termos já foram conferidos pelo layout.
 */
export default function ComecePage() {
  redirect("/app/modulo/0");
}

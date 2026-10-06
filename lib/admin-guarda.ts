import "server-only";

import { notFound, redirect } from "next/navigation";

import { papelAtual } from "@/lib/admin";

/**
 * As duas guardas do admin que não moram no layout.
 *
 * ┌─ POR QUE A PÁGINA PERGUNTA DE NOVO, SE O LAYOUT JÁ PERGUNTOU ─────────────────────────────────┐
 * │ No App Router, layout e página renderizam em PARALELO, não em sequência. O `redirect()` do    │
 * │ layout impede que a tela chegue ao navegador, mas não impede a página de já ter rodado a      │
 * │ consulta com a service role. Hoje isso não vaza nada, porque a resposta é descartada. É uma   │
 * │ garantia que depende de detalhe de implementação do framework, numa tela que lê e-mail,       │
 * │ telefone e nota de todos os alunos sem RLS nenhuma. A página que lê com `createAdminClient`   │
 * │ chama `exigirAdmin()` na primeira linha, e a leitura só acontece depois da resposta.          │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * `papelAtual` tem `cache()`, então a segunda pergunta na mesma requisição não vai ao banco.
 */
export async function exigirAdmin() {
  const eu = await papelAtual();
  // As mesmas duas respostas do layout, pelos mesmos motivos (ver `app/admin/layout.tsx`):
  // sem sessão vai para o login; logado sem papel recebe 404, que não confirma que /admin existe.
  if (eu.papel === "anonimo") redirect("/app/login");
  // O observador (0029) passa pelo layout, então ESTA linha é a cerca dele em toda tela de admin.
  // Vai para a única tela que é dele, em vez de um 404: ele já sabe que o /admin existe, e é por
  // aqui que o login o manda para `/admin`.
  if (eu.papel === "observador") redirect("/admin/indicadores");
  if (eu.papel !== "admin") notFound();
  return eu;
}

/**
 * A guarda da tela de indicadores, a única que o observador abre. Admin passa também.
 *
 * A tela não lê nada com a service role: os números vêm de `painel_indicadores()`, chamada com a
 * sessão de quem olha, e a função confere o papel de novo dentro do banco. Esta guarda decide quem
 * vê a TELA; a do banco decide quem recebe o DADO.
 */
export async function exigirPainel() {
  const eu = await papelAtual();
  if (eu.papel === "anonimo") redirect("/app/login");
  if (eu.papel !== "admin" && eu.papel !== "observador") notFound();
  return eu;
}

/**
 * O POST veio de uma tela nossa?
 *
 * As rotas do admin autenticam por cookie, e cookie o navegador manda sozinho. O `SameSite=Lax`
 * do Supabase já barra o POST cruzado na maioria dos casos, mas não em todos (navegador antigo,
 * subdomínio irmão, e o `lax` deixa passar navegação de nível superior). A conferência do `Origin`
 * fecha o resto sem token de formulário: navegador moderno sempre manda o cabeçalho em POST, e
 * uma página de outro site não consegue forjá-lo.
 *
 * AUSENTE PASSA, E ISSO É DE PROPÓSITO: `curl` e ferramentas de servidor não mandam `Origin`, e
 * elas não carregam o cookie da vítima, que é o que o ataque precisa. Presente e diferente é o
 * caso que importa, e esse é recusado. O valor literal `null` (iframe em sandbox, redirect entre
 * origens) também é recusado.
 *
 * A origem aceita é a da própria requisição e a de `NEXT_PUBLIC_SITE_URL`: atrás da Netlify, as
 * duas coincidem; em deploy preview, só a primeira existe.
 */
export function origemValida(req: Request): boolean {
  const origem = req.headers.get("origin");
  if (origem === null) return true;

  const aceitas = new Set<string>();
  try {
    aceitas.add(new URL(req.url).origin);
  } catch {
    /* url sem base: sobra a do site */
  }
  // O host que o navegador pediu. Cabeçalho que página de terceiro não consegue escolher, então
  // aceitá-lo não abre nada; ele cobre o caso de o `req.url` chegar com o host interno do runtime.
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host) {
    const proto = (req.headers.get("x-forwarded-proto") ?? "https").split(",")[0].trim();
    aceitas.add(`${proto}://${host.split(",")[0].trim()}`);
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    try {
      aceitas.add(new URL(site).origin);
    } catch {
      /* variável malformada não abre nada */
    }
  }
  return aceitas.has(origem);
}

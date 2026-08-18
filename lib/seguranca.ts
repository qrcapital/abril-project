// Regras puras de segurança de borda. Sem IO e sem Next, como os outros módulos com
// self-check (AGENTS.md): quem as exercita é o `scripts/seguranca-check.mts`, em node puro.
// Os consumidores são `app/app/login/actions.ts` e `app/auth/confirm/route.ts`.

/**
 * O cadastro pela tela só existe FORA de produção: lá a conta nasce do webhook do Guru, com o
 * `guru_order_id` da compra real. Sem esta regra, `criarConta` em produção seria o curso de
 * graça — a action cria usuário confirmado E matrícula ativa de um ano (plano de correções de
 * 17/ago, item 16).
 */
export const cadastroAberto = (env: string | undefined): boolean => env !== "production";

/**
 * Só destino INTERNO para o redirect pós-autenticação; qualquer outra coisa cai no `padrao`.
 *
 * O `\` vira `/` antes do teste: navegador trata os dois como separador, então `/\evil.com`
 * passava pela guarda de `//` e o `new URL()` o resolvia como `//evil.com` — open redirect
 * em cima de um link de e-mail legítimo (item 18).
 */
export function destinoSeguro(valor: string | null, padrao: string): string {
  const v = (valor ?? "").replaceAll("\\", "/");
  if (!v.startsWith("/") || v.startsWith("//")) return padrao;
  return v;
}

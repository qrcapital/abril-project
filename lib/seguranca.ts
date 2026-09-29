// Regras puras de segurança de borda. Sem IO e sem Next, como os outros módulos com
// self-check (AGENTS.md): quem as exercita é o `scripts/seguranca-check.mts`, em node puro.
// Os consumidores são `app/app/login/*`, `app/auth/confirm/route.ts`, o webhook do Guru e a
// recuperação de senha.
//
// Nada aqui lê `process.env` sozinho: o ambiente entra por parâmetro, com o valor de hoje como
// padrão. É o que deixa o check exercitar produção e homolog na mesma execução.

/**
 * Os ambientes onde o produto pode se comportar como ambiente de teste. Lista FECHADA, e tudo que
 * não está nela é produção.
 *
 * A regra era o contrário até 29/set/2026: "produção é quando `NEXT_PUBLIC_APP_ENV` diz
 * `production`". Isso é fail-open. Um deploy com a variável faltando (contexto novo na Netlify,
 * branch nova, alguém limpando variáveis) virava ambiente de teste em cima do domínio público, com
 * cadastro livre e webhook sem token. Invertida, a mesma falta de variável tranca em vez de abrir.
 */
const AMBIENTES_DE_TESTE = new Set(["development", "homolog", "local"]);

/** Estamos em produção? Na dúvida (variável vazia ou com valor desconhecido), sim. */
export const emProducao = (appEnv: string | undefined = process.env.NEXT_PUBLIC_APP_ENV): boolean =>
  !AMBIENTES_DE_TESTE.has((appEnv ?? "").trim().toLowerCase());

/**
 * O cadastro pela tela só existe FORA de produção: lá a conta nasce do webhook do Guru, com o
 * `guru_order_id` da compra real. Sem esta regra, `criarConta` em produção seria o curso de
 * graça, porque a action cria usuário confirmado E matrícula ativa de um ano (plano de correções
 * de 17/ago, item 16).
 *
 * `CADASTRO_ABERTO=sim` é a chave manual para abrir num ambiente que a lista acima considera
 * produção. Ela é lida SÓ no servidor (sem `NEXT_PUBLIC_`), então quem decide mostrar a barra de
 * teste na tela é a página, que passa o resultado para o componente de cliente.
 */
export const cadastroAberto = (
  appEnv: string | undefined = process.env.NEXT_PUBLIC_APP_ENV,
  chave: string | undefined = process.env.CADASTRO_ABERTO,
): boolean => chave?.trim().toLowerCase() === "sim" || !emProducao(appEnv);

/**
 * Só destino INTERNO para o redirect pós-autenticação; qualquer outra coisa cai no `padrao`.
 *
 * Duas limpezas ANTES do teste, as duas pelo mesmo motivo: o navegador normaliza o endereço
 * depois da nossa guarda, e o que conta é o que ele vai abrir.
 *
 * - `\t`, `\r` e `\n` somem: a especificação de URL manda o navegador descartar esses três em
 *   qualquer posição, então `/\t/evil.com` passava pela guarda de `//` e chegava como
 *   `//evil.com`.
 * - `\` vira `/`: navegador trata os dois como separador, então `/\evil.com` passava pela guarda
 *   e o `new URL()` o resolvia como `//evil.com`, open redirect em cima de um link de e-mail
 *   legítimo (item 18).
 *
 * Por fim, a prova dos nove: resolvido contra uma origem qualquer, o destino tem de continuar
 * nela. Pega o que as duas regras de texto não previram.
 */
export function destinoSeguro(valor: string | null, padrao: string): string {
  const v = (valor ?? "").replace(/[\t\r\n\u0000-\u001f]/g, "").replaceAll("\\", "/");
  if (!v.startsWith("/") || v.startsWith("//")) return padrao;
  try {
    const base = "https://destino.invalid";
    if (new URL(v, base).origin !== base) return padrao;
  } catch {
    return padrao;
  }
  return v;
}

/**
 * A base dos links que saem por e-mail (acesso e redefinição de senha).
 *
 * EM PRODUÇÃO, SÓ `NEXT_PUBLIC_SITE_URL`. O `Origin` da requisição é cabeçalho, e cabeçalho quem
 * escreve é o cliente: aceitar ele ali deixaria qualquer um pedir a redefinição da senha de outra
 * pessoa com `Origin: https://atacante.com`, e o e-mail legítimo, do nosso remetente, levaria o
 * token para o domínio dele. Fora de produção o `Origin` vem primeiro, para o link pedido no
 * localhost voltar para o localhost.
 *
 * Devolve `""` quando não há base confiável. O envio recusa link relativo (`linkUtilizavel`), e é
 * melhor não mandar do que mandar botão morto.
 */
export function baseDoSite({
  appEnv = process.env.NEXT_PUBLIC_APP_ENV,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL,
  origem,
}: {
  appEnv?: string;
  siteUrl?: string;
  origem?: string | null;
}): string {
  const limpa = (s: string | null | undefined) => {
    const v = (s ?? "").trim().replace(/\/+$/, "");
    return /^https?:\/\/[^/\s]+$/i.test(v) ? v : "";
  };
  if (emProducao(appEnv)) return limpa(siteUrl);
  return limpa(origem) || limpa(siteUrl);
}

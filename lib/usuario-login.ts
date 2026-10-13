/**
 * Login por USUÁRIO, sem e-mail (13/out/2026): as contas de observador da Abril, da QR Capital e a
 * de teste entram com um nome como `abril.indicadores`.
 *
 * O Auth do Supabase só entra com senha a partir de um e-mail, então o usuário vira um e-mail
 * sintético num domínio nosso que não recebe correspondência. Nada é gravado além disso: a conta é
 * uma conta comum do Auth, e o login guarda só a conversão. Por isso o domínio é uma constante
 * única: trocá-lo depois de criar contas tranca essas contas para fora.
 *
 * Sem `server-only` e sem IO: a tela de login converte no navegador, antes de chamar o Supabase, e
 * a rota do admin valida com as mesmas regras no servidor.
 */

export const DOMINIO_LOGIN = "acesso.blocktrends.abril.com.br";

/**
 * 3 a 40 caracteres de `[a-z0-9._-]`, começando e terminando em letra ou número. As pontas e o
 * `..` proibido não são gosto: o e-mail sintético precisa passar na validação do Auth, que recusa
 * parte local com ponto na borda ou ponto duplo.
 */
const MOLDE_USUARIO = /^[a-z0-9](?:[a-z0-9._-]{1,38})[a-z0-9]$/;

export function normalizarUsuario(login: string): string {
  return login.trim().toLowerCase();
}

export function usuarioValido(login: string): boolean {
  return MOLDE_USUARIO.test(login) && !login.includes("..");
}

/** O e-mail interno de um usuário. Não confere o formato; quem cria a conta confere antes. */
export function emailDoUsuario(login: string): string {
  return `${normalizarUsuario(login)}@${DOMINIO_LOGIN}`;
}

/**
 * O que o campo "E-mail ou usuário" do login manda ao Supabase. Com `@` é e-mail de aluno e segue
 * como sempre foi; sem `@` é usuário e vira o e-mail sintético.
 */
export function emailParaEntrar(campo: string): string {
  const v = campo.trim();
  return v.includes("@") ? v : emailDoUsuario(v);
}

/** O usuário por trás de um e-mail sintético, ou `null` se é um e-mail de verdade. */
export function usuarioDoEmail(email: string | null | undefined): string | null {
  const sufixo = `@${DOMINIO_LOGIN}`;
  const e = (email ?? "").toLowerCase();
  return e.endsWith(sufixo) ? e.slice(0, -sufixo.length) : null;
}

/** Como mostrar a conta na tela: o usuário, se for conta de usuário, senão o e-mail. */
export function rotuloDaConta(email: string | null | undefined): string {
  return usuarioDoEmail(email) ?? email ?? "";
}

// Sem 0/O, 1/l/I: a senha gerada é lida na tela e digitada à mão do outro lado, muitas vezes
// passada por mensagem. Cada grupo garante uma classe que `validarSenha` exige.
const MAIUSCULAS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const MINUSCULAS = "abcdefghijkmnopqrstuvwxyz";
const DIGITOS = "23456789";
const TODOS = MAIUSCULAS + MINUSCULAS + DIGITOS;

/** Inteiro uniforme em [0, n), sem o viés do `% n` (descarta o resto da última faixa). */
function sorteio(n: number): number {
  const teto = Math.floor(0x1_0000_0000 / n) * n;
  const buf = new Uint32Array(1);
  for (;;) {
    globalThis.crypto.getRandomValues(buf);
    if (buf[0] < teto) return buf[0] % n;
  }
}

/**
 * Senha provisória forte, com o CSPRNG da plataforma (Web Crypto, igual no Node e no navegador).
 * 16 caracteres de um alfabeto de 57 dão por volta de 93 bits, e ela vive só até o primeiro acesso.
 */
export function gerarSenha(tamanho = 16): string {
  const chars = [
    MAIUSCULAS[sorteio(MAIUSCULAS.length)],
    MINUSCULAS[sorteio(MINUSCULAS.length)],
    DIGITOS[sorteio(DIGITOS.length)],
  ];
  while (chars.length < tamanho) chars.push(TODOS[sorteio(TODOS.length)]);
  // Embaralha (Fisher-Yates) para as três classes garantidas não ficarem sempre no começo.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = sorteio(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

/** A conta precisa trocar a senha antes de usar o resto? Marca gravada pela rota do admin. */
export function precisaTrocarSenha(
  user: { app_metadata?: Record<string, unknown> | null } | null | undefined,
): boolean {
  return user?.app_metadata?.trocar_senha === true;
}

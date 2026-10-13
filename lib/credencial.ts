import "server-only";

/**
 * A credencial que a rota `admin/api/observador-usuario` entrega à tela de Equipe, pelo cookie de
 * vida curta descrito lá. Mora aqui, e não na rota, porque arquivo `route.ts` só pode exportar os
 * métodos HTTP e a tela também precisa ler o formato.
 */

export const COOKIE_CREDENCIAL = "bt_credencial";
/** O cookie só vai para a tela que o mostra. */
export const CAMINHO_CREDENCIAL = "/admin/equipe";

export type Credencial = {
  tipo: "criada" | "nova";
  login: string;
  nome: string | null;
  senha: string;
  /** Endereço do login, absoluto quando o servidor sabe a base do site. */
  url: string;
};

export function codificarCredencial(c: Credencial): string {
  return Buffer.from(JSON.stringify(c)).toString("base64url");
}

/** Valor ausente ou adulterado volta `null`: a tela simplesmente não mostra o quadro. */
export function lerCredencial(valor: string | undefined): Credencial | null {
  if (!valor) return null;
  try {
    const c = JSON.parse(Buffer.from(valor, "base64url").toString("utf8")) as Partial<Credencial>;
    if (typeof c.login !== "string" || typeof c.senha !== "string" || typeof c.url !== "string") {
      return null;
    }
    return {
      tipo: c.tipo === "nova" ? "nova" : "criada",
      login: c.login,
      nome: typeof c.nome === "string" ? c.nome : null,
      senha: c.senha,
      url: c.url,
    };
  } catch {
    return null;
  }
}

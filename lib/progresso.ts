// Estado de conclusão das aulas (progresso do aluno), POR USUÁRIO.
//
// Guardado num cookie escopado pelo id do usuário (`ei_progresso_<userId>`), para
// que cada conta tenha o seu progresso e uma conta nova comece do zero. O SSR lê o
// cookie do usuário logado; o cliente atualiza ao marcar/desmarcar. Quando o DB
// entrar (tabela `progress`), estas funções passam a ler/gravar no banco.

const PREFIXO = "ei_progresso_";

export function nomeCookie(userId: string): string {
  return PREFIXO + userId;
}

// Estado inicial: vazio (aluno começa do zero).
export function parseConcluidas(raw?: string | null): Set<number> {
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map(Number)) : new Set();
  } catch {
    return new Set();
  }
}

// ---- cliente ----
export function lerConcluidas(userId: string): Set<number> {
  if (typeof document === "undefined" || !userId) return new Set();
  const m = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${PREFIXO}${userId}=([^;]*)`)
  );
  return parseConcluidas(m ? decodeURIComponent(m[1]) : null);
}

function gravar(userId: string, s: Set<number>) {
  const val = encodeURIComponent(JSON.stringify([...s].sort((a, b) => a - b)));
  document.cookie = `${nomeCookie(userId)}=${val}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function alternarConcluida(userId: string, n: number): boolean {
  const s = lerConcluidas(userId);
  if (s.has(n)) s.delete(n);
  else s.add(n);
  gravar(userId, s);
  return s.has(n);
}

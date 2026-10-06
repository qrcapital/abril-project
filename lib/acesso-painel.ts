/**
 * O destino depois de entrar: esta conta vai para o `/admin` ou para a sala?
 *
 * Admin e observador (migration 0029) vão para o `/admin`; o observador cai na tela de indicadores
 * pela guarda das páginas. Os três pontos de entrada (login com senha, link do painel do Supabase e
 * `/auth/confirm`) perguntam por aqui, para a regra não divergir entre eles.
 *
 * Sem IO próprio e sem `server-only`: recebe o cliente de quem chama, do navegador ou do servidor.
 *
 * Se `acesso_painel` falhar (inclusive por não existir, antes de a 0029 rodar), a pergunta volta a
 * ser a antiga, `is_admin`. Sem esse recuo, aplicar o código antes da migration mandaria o próprio
 * admin para a sala no login.
 */
type ComRpc = {
  rpc: (fn: string) => PromiseLike<{ data: unknown; error: unknown }>;
};

export async function vaiAoPainel(supabase: ComRpc): Promise<boolean> {
  const { data, error } = await supabase.rpc("acesso_painel");
  if (!error) return data === true;
  const { data: admin } = await supabase.rpc("is_admin");
  return admin === true;
}

// Emissão e leitura do certificado no banco. O IO que o `lib/certificado.ts` não pode ter, porque
// aquele arquivo é importado por componente de cliente.
//
// O cliente do Supabase entra por parâmetro e não há `server-only`, pelo mesmo motivo do
// `lib/email.ts`: a emissão dispara nos DOIS caminhos de aprovação, e um deles é a rotina que roda
// numa Netlify function agendada, fora do bundle do Next.

import type { SupabaseClient } from "@supabase/supabase-js";

import { gerarCodigo } from "./certificado.ts";

export type Certificado = { codigo: string; emitidoEm: string };

/** Quantas vezes tentar quando o código sorteado já existe. Ver o comentário de `emitir`. */
const TENTATIVAS = 5;

/**
 * Emite o certificado do aluno, ou devolve o que já existe. **Idempotente.**
 *
 * TRÊS COISAS ACONTECEM AQUI, e a ordem importa:
 *
 * 1. **Lê antes de escrever**, para o caminho comum (aluno já aprovado que volta) não gastar sorteio
 *    nem tentativa de gravação.
 * 2. **Deixa o banco decidir a corrida.** O `on conflict do nothing` sobre `certificates_user_unico`
 *    (migration `0012`) é o que faz duas rotas de aprovação simultâneas produzirem um certificado só.
 *    Conferir "já existe?" e depois inserir tem uma janela entre as duas coisas, e é justamente nela
 *    que a segunda rota entra.
 * 3. **Tenta de novo quando o CÓDIGO colide.** Com 656 bilhões de combinações isso praticamente não
 *    acontece, mas "praticamente" não é "nunca", e o custo de estar preparado é um laço de cinco
 *    voltas. Sem ele, uma colisão viraria "não deu para emitir seu certificado" para um aluno que
 *    passou na prova.
 *
 * Devolve `null` só quando o banco recusou por outro motivo, e aí o chamador decide: nenhum deles
 * derruba o fluxo, porque perder a prova por causa do certificado seria pior.
 */
export async function emitirCertificado(
  db: SupabaseClient,
  userId: string,
): Promise<Certificado | null> {
  const existente = await lerCertificado(db, userId);
  if (existente) return existente;

  for (let tentativa = 0; tentativa < TENTATIVAS; tentativa++) {
    const codigo = gerarCodigo();
    const { data, error } = await db
      .from("certificates")
      .insert({ user_id: userId, codigo })
      .select("codigo, issued_at")
      .maybeSingle();

    if (data) return { codigo: data.codigo as string, emitidoEm: data.issued_at as string };

    // 23505 é violação de unique. Pode ser o `user_id` (outra rota emitiu primeiro: o certificado
    // dele já existe e a leitura resolve) ou o `codigo` (sorteio repetido: tenta outro).
    if (error?.code === "23505") {
      const jaExiste = await lerCertificado(db, userId);
      if (jaExiste) return jaExiste;
      continue;
    }

    console.error(`[certificado] falha ao emitir para ${userId}:`, error?.message);
    return null;
  }

  console.error(`[certificado] ${TENTATIVAS} colisoes de codigo seguidas para ${userId}`);
  return null;
}

/** O certificado do aluno, se já foi emitido. */
export async function lerCertificado(
  db: SupabaseClient,
  userId: string,
): Promise<Certificado | null> {
  const { data, error } = await db
    .from("certificates")
    .select("codigo, issued_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error(`[certificado] falha ao ler o de ${userId}:`, error.message);
    return null;
  }
  return data ? { codigo: data.codigo as string, emitidoEm: data.issued_at as string } : null;
}

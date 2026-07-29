"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getUsuario } from "@/lib/usuario";
import { getMatricula } from "@/lib/matricula";
import { liberacao } from "@/lib/liberacao";
import { getCurriculo } from "@/lib/curriculo";

/**
 * Marca ou desmarca uma aula como concluída.
 *
 * Escreve com o cliente da SESSÃO, nunca com a service role: a policy `progress_self_write`
 * amarra a linha ao `auth.uid()`, então o banco é quem garante que ninguém marca aula por
 * outro. Com service role, essa garantia dependeria de eu lembrar do `where`.
 *
 * A checagem de liberação é repetida aqui de propósito. A página da aula já barra módulo
 * fechado, mas server action é uma porta própria: quem chamar direto, sem passar pela tela,
 * marcaria aulas de módulos que ainda nem abriram e furaria a esteira por fora.
 */
export async function marcarAula(
  n: number,
  concluida: boolean,
): Promise<{ ok: true } | { ok: false; erro: string }> {
  const user = await getUsuario();
  if (!user) return { ok: false, erro: "Sua sessão expirou. Entre de novo." };

  const curriculo = await getCurriculo();
  const found = curriculo.acharAula(n);
  if (!found) return { ok: false, erro: "Aula não encontrada." };

  const { inicioEm, liberacaoTotal } = await getMatricula();
  if (
    !inicioEm ||
    !liberacao(inicioEm, liberacaoTotal, curriculo.modulos.length).abertos.has(found.aula.modulo)
  )
    return { ok: false, erro: "Este módulo ainda não foi liberado." };

  const lessonId = found.aula.id;

  const supabase = await createClient();
  const { error } = concluida
    ? await supabase.from("progress").upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          status: "completed",
          watched_pct: 100,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      )
    : await supabase.from("progress").delete().eq("lesson_id", lessonId);

  if (error) {
    console.error("[progresso] falha ao gravar:", error.message);
    return { ok: false, erro: "Não foi possível salvar. Tente de novo." };
  }

  // A sidebar, o percentual e o gate da prova são renderizados no servidor a partir deste
  // dado, então a árvore precisa ser revalidada para eles acompanharem.
  revalidatePath("/app", "layout");
  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { getUsuario } from "@/lib/usuario";
import { getMatricula } from "@/lib/matricula";
import { liberacao } from "@/lib/liberacao";
import { getRegras } from "@/lib/politicas";
import { getCurriculo } from "@/lib/curriculo";

/**
 * Marca ou desmarca uma aula como concluída.
 *
 * Escreve pela SERVICE ROLE desde a 0019, e o motivo é o inverso do que este comentário dizia
 * antes: enquanto o aluno tinha grant de escrita em `progress`, a policy amarrava só o
 * `user_id` — segurava CONTRA QUEM ele escreve, não O QUE. Pelo PostgREST dava para marcar
 * aula de módulo fechado e completar o gate da prova sem passar por aqui. O grant caiu, esta
 * action virou a única porta de escrita, e a checagem de liberação abaixo virou garantia em
 * vez de cortesia.
 *
 * Com a service role, o `user_id` explícito (do upsert e do delete) é O guarda contra gravar
 * no progresso de outro aluno — ele vem da sessão resolvida no servidor, nunca de parâmetro.
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

  const { inicioEm, liberacaoTotal, politicaId } = await getMatricula();
  const regras = await getRegras(politicaId);
  if (!inicioEm || !liberacao(inicioEm, liberacaoTotal, regras).abertos.has(found.aula.modulo))
    return { ok: false, erro: "Este módulo ainda não foi liberado." };

  const lessonId = found.aula.id;

  const db = createAdminClient();
  const { error } = await (concluida
    ? db.from("progress").upsert(
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
    : db.from("progress").delete().eq("lesson_id", lessonId).eq("user_id", user.id));

  if (error) {
    console.error("[progresso] falha ao gravar:", error.message);
    return { ok: false, erro: "Não foi possível salvar. Tente de novo." };
  }

  // A sidebar, o percentual e o gate da prova são renderizados no servidor a partir deste
  // dado, então a árvore precisa ser revalidada para eles acompanharem.
  revalidatePath("/app", "layout");
  return { ok: true };
}

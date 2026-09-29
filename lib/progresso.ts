import "server-only";
import { cache } from "react";

import { createClient } from "./supabase/server";
import { getUsuario } from "./usuario";
import { getCurriculo } from "./curriculo";

// Estado de conclusão das aulas (progresso do aluno), na tabela `progress`.
//
// Morava num cookie até 29/jul/2026, e o cookie é escrito pelo próprio aluno: o gate de 16/16
// que libera a prova, e portanto o certificado, era conferido contra um dado que ele edita.
// Isso foi explorado três vezes no mesmo dia, por mim, para conseguir testar outras coisas.
// Agora o estado é do servidor, e o cookie antigo é simplesmente ABANDONADO.
//
// Cheguei a escrever uma migração que lia o cookie e semeava o banco na primeira visita, para
// ninguém perder o que já tinha marcado. **Removi depois de testar o ataque:** com o cookie
// forjado e o banco vazio, a prova abria. A semente era uma porta para o aluno PLANTAR o dado
// que eu acabara de tirar das mãos dele, e não existe versão segura disso, porque o cookie é
// escrito por quem está do outro lado. Quem precisar de progresso para testar usa
// `scripts/progresso-conta.mjs`, que escreve pelo servidor.
//
// A ponte entre número e id que existia aqui morreu junto com o currículo em código: a aula
// carregada do banco já traz o próprio `id`, então não há mais duas listas para casar.

/**
 * Quando o aluno logado concluiu cada aula: `lessons.id` → instante da conclusão.
 *
 * Existe desde 29/set/2026 por causa da regra `apos_modulo` (migration 0024): ela abre um módulo
 * a partir da DATA em que o anterior foi concluído, e o conjunto de números do `getConcluidas`
 * não carrega data. Uma consulta só alimenta os dois, via `cache()`.
 *
 * A leitura usa o cliente com a sessão: a policy `progress_self_select` restringe à própria
 * linha, então quem garante o isolamento é a RLS. O `.eq("user_id")` é a segunda camada, pela
 * lição do `getMatricula` (a policy é mais larga do que o `where` que você não escreveu).
 *
 * `completed_at` nulo cai no `updated_at`: toda escrita de hoje grava os dois, mas uma linha
 * antiga sem a data de conclusão não pode sumir do progresso por isso. O `modulo_aberto()` do
 * banco faz o mesmo `coalesce`.
 */
export const getConclusoesDasAulas = cache(async (): Promise<Map<string, Date>> => {
  const user = await getUsuario();
  if (!user) return new Map();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("lesson_id,completed_at,updated_at")
    .eq("user_id", user.id)
    .eq("status", "completed");
  if (error) {
    console.error("[progresso] falha ao ler:", error.message);
    return new Map();
  }
  return new Map(
    (data ?? []).map((l) => [
      l.lesson_id as string,
      new Date((l.completed_at as string | null) ?? (l.updated_at as string)),
    ]),
  );
});

/**
 * As aulas concluídas do aluno logado, por número. Derivado do `getConclusoesDasAulas`.
 */
export const getConcluidas = cache(async (): Promise<Set<number>> => {
  const [porAula, { aulas }] = await Promise.all([getConclusoesDasAulas(), getCurriculo()]);
  const concluidas = new Set<number>();
  for (const a of aulas) if (porAula.has(a.id)) concluidas.add(a.n);
  return concluidas;
});

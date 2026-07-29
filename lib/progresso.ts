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
 * As aulas concluídas do aluno logado, por número.
 *
 * A leitura usa o cliente com a sessão: a policy `progress_self_select` restringe à própria
 * linha, então quem garante o isolamento é a RLS, não um `where` que alguém pode esquecer.
 */
export const getConcluidas = cache(async (): Promise<Set<number>> => {
  const user = await getUsuario();
  if (!user) return new Set();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("status", "completed");
  if (error) {
    console.error("[progresso] falha ao ler:", error.message);
    return new Set();
  }

  const { aulas } = await getCurriculo();
  const numeroPorId = new Map(aulas.map((a) => [a.id, a.n]));
  const concluidas = new Set<number>();
  for (const linha of data ?? []) {
    const n = numeroPorId.get(linha.lesson_id as string);
    if (n !== undefined) concluidas.add(n);
  }
  return concluidas;
});

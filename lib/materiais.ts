import "server-only";
import { cache } from "react";

import { createClient } from "./supabase/server";
import { getCurriculo } from "./curriculo";

export type Material = { titulo: string; arquivo: string };

/**
 * Os materiais de uma aula: o resumo dela mais a apostila do módulo a que pertence.
 *
 * O Módulo 0 (boas-vindas) não tem apostila nem resumo, e é justamente ele que exercita o
 * estado vazio hoje.
 */
export const getMateriais = cache(async (numeroDaAula: number): Promise<Material[]> => {
  const { aulas } = await getCurriculo();
  const aula = aulas.find((a) => a.n === numeroDaAula);
  if (!aula) return [];

  const supabase = await createClient();
  const { data: linha } = await supabase
    .from("lessons")
    .select("module_id")
    .eq("id", aula.id)
    .maybeSingle();

  // O que é da AULA (resumo) e o que é do MÓDULO (apostila) viram uma lista só: o aluno não faz
  // essa distinção olhando a tela.
  const filtros = [`lesson_id.eq.${aula.id}`];
  if (linha?.module_id) filtros.push(`module_id.eq.${linha.module_id}`);

  // O tipo `ebook` fica fora da tela desde 30/set/2026: o curso não entrega e-book (decisão do dono).
  // O valor continua no enum do banco porque apagar valor de enum no Postgres é migração cara e sem
  // ganho; o filtro aqui é o que garante que uma linha antiga desse tipo não apareça para o aluno.
  const { data, error } = await supabase
    .from("materials")
    .select("titulo,arquivo")
    .or(filtros.join(","))
    .neq("tipo", "ebook");

  if (error) {
    // Falha de leitura NÃO vira "em breve": dizer que não há material quando a consulta é que
    // falhou seria mentir sobre conteúdo que existe. Seção vazia e erro no log.
    console.error("[materiais] falha ao ler:", error.message);
    return [];
  }
  return (data ?? []) as Material[];
});

import "server-only";
import { cache } from "react";

import { createAdminClient } from "./supabase/admin";
import { montarCurriculo, rotuloModulo, type Aula, type Curriculo, type Modulo } from "./curso";

// Carrega o currículo do banco. Fonte única desde 29/jul/2026: o `lib/curso.ts` deixou de
// guardar as 17 aulas e passou a guardar só a lógica, porque o admin vai editar título,
// descrição, vídeo e materiais pelo painel, e painel não edita código.

/**
 * Lido com a **service role**, e não com a sessão do aluno, de propósito: a RLS de `modules` e
 * `lessons` exige `has_active_access()`, e o currículo também precisa ser montado para quem
 * está bloqueado (a tela de acesso, o modal de módulo travado, o cálculo de datas). Nada aqui
 * é segredo: são os títulos que a própria LP publica. O que a RLS protege de verdade são as
 * questões e o progresso, e esses continuam intocados.
 */
export const getCurriculo = cache(async (): Promise<Curriculo> => {
  const db = createAdminClient();
  const [{ data: mods, error: erroMods }, { data: linhas, error: erroAulas }] = await Promise.all([
    db.from("modules").select("id,ord,titulo,docente").order("ord"),
    db.from("lessons").select("id,module_id,ord,titulo,descricao,panda_video_id"),
  ]);
  if (erroMods) throw erroMods;
  if (erroAulas) throw erroAulas;

  const modulos: Modulo[] = (mods ?? []).map((m) => ({
    idx: m.ord as number,
    label: rotuloModulo(m.ord as number),
    titulo: m.titulo as string,
    docente: (m.docente as string | null) ?? undefined,
  }));

  const ordDoModulo = new Map((mods ?? []).map((m) => [m.id as string, m.ord as number]));

  // A ordem define o `n`, que é o número na URL: módulo primeiro, posição dentro do módulo
  // depois. É a mesma ordenação que o progresso usava para casar código e banco, e agora ela
  // deixou de ser uma ponte entre dois lugares para ser simplesmente a ordem do curso.
  const aulas: Aula[] = (linhas ?? [])
    .map((l) => ({
      id: l.id as string,
      modulo: ordDoModulo.get(l.module_id as string) ?? 0,
      ord: l.ord as number,
      titulo: l.titulo as string,
      descricao: (l.descricao as string | null) ?? "",
      video: (l.panda_video_id as string | null) ?? null,
    }))
    .sort((x, y) => x.modulo - y.modulo || x.ord - y.ord)
    .map((l, i) => ({
      id: l.id,
      n: i,
      modulo: l.modulo,
      // O Módulo 0 é boas-vindas e não recebe numeral; as demais numeram 01 em diante.
      numero: i === 0 ? "" : String(i).padStart(2, "0"),
      titulo: l.titulo,
      descricao: l.descricao,
      video: l.video,
    }));

  return montarCurriculo(modulos, aulas);
});

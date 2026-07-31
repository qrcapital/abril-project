-- ============================================================
-- 0007 — Trocar duas aulas de lugar (PLANO-ADMIN §4.6)
-- ============================================================
--
-- Reordenar aulas foi decidido pelo Pedro em 31/jul/2026, com a consequência aceita: o `ord`
-- define o `n` da aula, que é o número na URL, então reordenar reescreve o destino de links já
-- compartilhados. O progresso do aluno não se perde, porque é gravado por `lesson_id`.
--
-- POR QUE UMA FUNÇÃO, e não dois UPDATE do lado do TypeScript: `lessons` tem
-- `unique (module_id, ord)`, e o Postgres checa unique **linha por linha**, não no fim do
-- comando. Trocar A com B em dois UPDATE separados quebra no primeiro, quando os dois ficam com o
-- mesmo `ord` por um instante. O caminho é passar por um valor temporário, e isso precisa dos três
-- passos na MESMA transação: uma função plpgsql é uma transação, dois `await db.update()` do
-- supabase-js não são. Se falhasse no meio, uma aula ficaria com `ord = -1` e o currículo
-- inteiro sairia fora de ordem, sem nada reclamando.
--
-- Troca com o VIZINHO IMEDIATO e não com `ord ± 1`: apagar aula deixa buraco na numeração (e
-- apagar é permitido nesta mesma tela), então `ord - 1` pode não existir. O `curriculo-check`
-- exige `ord` único dentro do módulo, não sequência sem buraco, justamente por isso.
--
-- Sem `security definer`, ao contrário das funções da `0004` e `0006`: quem chama é a service
-- role, que já ignora RLS. Definer aqui só ampliaria a superfície de privilégio de graça.
-- O `revoke` de PUBLIC é o que fecha a porta (a armadilha já registrada quatro vezes neste
-- schema: revogar de anon/authenticated não fecha nada, porque o EXECUTE vem de PUBLIC).

create or replace function mover_aula(p_lesson uuid, p_delta int)
returns void language plpgsql set search_path = public as $$
declare
  v_modulo      uuid;
  v_ord         smallint;
  v_vizinho     uuid;
  v_ord_vizinho smallint;
begin
  select module_id, ord into v_modulo, v_ord from lessons where id = p_lesson;
  if v_modulo is null then
    raise exception 'aula % nao existe', p_lesson;
  end if;

  if p_delta < 0 then
    select id, ord into v_vizinho, v_ord_vizinho
      from lessons where module_id = v_modulo and ord < v_ord
      order by ord desc limit 1;
  else
    select id, ord into v_vizinho, v_ord_vizinho
      from lessons where module_id = v_modulo and ord > v_ord
      order by ord asc limit 1;
  end if;

  -- Já está na ponta do módulo. Sai sem erro: a tela esconde a seta nesse caso, e um clique que
  -- chegue aqui de todo jeito (duas abas abertas) não é erro do admin.
  if v_vizinho is null then
    return;
  end if;

  -- O -1 é o valor de passagem. Nenhuma aula nasce com `ord` negativo, e como isto está dentro
  -- de uma transação, ninguém enxerga esse estado.
  update lessons set ord = -1            where id = p_lesson;
  update lessons set ord = v_ord         where id = v_vizinho;
  update lessons set ord = v_ord_vizinho where id = p_lesson;
end $$;

revoke execute on function mover_aula(uuid, int) from public;
revoke execute on function mover_aula(uuid, int) from anon, authenticated;

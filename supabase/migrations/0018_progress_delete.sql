-- 0018 — Policy de DELETE em `progress` (plano de correções de 17/ago, item 9)
--
-- Desmarcar aula era NO-OP: o client manda o delete, a RLS sem policy de DELETE filtra zero
-- linhas e o PostgREST responde 200 sem apagar nada — o botão parecia funcionar e a aula
-- voltava marcada no recarregar. INSERT e UPDATE têm policy desde a 0001; DELETE ficou de fora.
--
-- `(select auth.uid())` em vez de `auth.uid()` cru: o SELECT deixa o planner avaliar a função
-- uma vez por consulta, não por linha (recomendação do próprio Supabase).
--
-- Se a escrita de progresso migrar para a service role (plano, item 17), esta policy cai
-- junto com as demais de escrita.

create policy progress_self_delete on progress
  for delete using ((select auth.uid()) = user_id);

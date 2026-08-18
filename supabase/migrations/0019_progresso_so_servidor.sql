-- 0019 — Escrita de progresso sai do cliente (plano de correções de 17/ago, item 17)
--
-- O aluno tinha grant de INSERT/UPDATE (e DELETE, desde a 0018) em `progress`, com policy
-- amarrando só o `user_id`. A policy segura CONTRA QUEM ele escreve, não O QUE: pelo
-- PostgREST, sem passar por tela nenhuma, dava para marcar como concluída aula de módulo que
-- a esteira ainda não abriu e completar o gate da prova por fora — exatamente o furo que a
-- migração do cookie para o banco (29/jul) tinha fechado, reaberto por outra porta.
--
-- A escrita agora é SÓ do servidor: o `marcarAula` confere a liberação e grava pela service
-- role, com o `user_id` vindo da sessão. O SELECT do aluno continua como está
-- (`progress_self_select`), porque a leitura é dele mesmo e a RLS resolve.
--
-- As três policies de escrita caem junto com os grants: policy sem grant é letra morta, e
-- letra morta em segurança vira "achei que estava protegido". A `progress_self_delete` nasceu
-- na 0018 já avisando que cairia aqui.

revoke insert, update, delete on progress from anon, authenticated;

drop policy progress_self_write on progress;
drop policy progress_self_update on progress;
drop policy progress_self_delete on progress;

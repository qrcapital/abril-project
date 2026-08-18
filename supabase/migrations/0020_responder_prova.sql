-- 0020 — Resposta da prova gravada por merge no banco (plano de correções de 17/ago, item 20)
--
-- O `salvarResposta` lia o `answers` inteiro, juntava a resposta nova em JS e gravava o
-- objeto de volta. Duas abas respondendo perto uma da outra perdiam a resposta da mais lenta
-- (read-modify-write clássico), e a perda só aparecia na nota. O merge passa para o banco,
-- atômico por linha: `||` de jsonb num único UPDATE.
--
-- Os guards de estado e prazo entram no WHERE do mesmo comando: resposta só entra em prova
-- em andamento e dentro do prazo, sem janela entre conferir e gravar. Devolve true quando
-- gravou; null quando nada casou (o TypeScript relê a tentativa para dizer o motivo).
--
-- Sem `security definer` (mesma razão da `mover_aula`, 0007): quem chama é a service role.
-- E o revoke de PUBLIC primeiro, porque revogar só de anon/authenticated não fecha nada —
-- a armadilha registrada quatro vezes neste schema.

create or replace function responder_prova(p_exam uuid, p_posicao int, p_letra text)
returns boolean language sql set search_path = public as $$
  update exams
     set answers = coalesce(answers, '{}'::jsonb) || jsonb_build_object(p_posicao::text, p_letra)
   where id = p_exam
     and status = 'in_progress'
     and (deadline is null or deadline > now())
  returning true;
$$;

revoke execute on function responder_prova(uuid, int, text) from public;
revoke execute on function responder_prova(uuid, int, text) from anon, authenticated;

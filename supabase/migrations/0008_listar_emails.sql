-- ============================================================
-- 0008 — Log de e-mails para o admin (PLANO-ADMIN §4.5)
-- ============================================================
--
-- Mesma família e mesmas escolhas das funções da `0004` e `0006`: `security definer` porque
-- precisa ler `auth.users` (o e-mail não está em `profiles`), e revogada de PUBLIC, anon e
-- authenticated, porque só a service role chama, do servidor, depois de a guarda do layout passar.
--
-- ARMADILHA JÁ REGISTRADA QUATRO VEZES NESTE SCHEMA: `revoke ... from anon, authenticated` não
-- fecha função, porque o EXECUTE vem de PUBLIC. O revoke de PUBLIC é o que fecha.
--
-- POR QUE `left join` NOS DOIS LADOS, e não join comum: `email_log.user_id` é
-- `on delete set null`, de propósito — o registro de que um e-mail foi enviado sobrevive à conta
-- que o recebeu, e é isso que faz dele um log. Com join comum, apagar uma conta apagaria o
-- histórico da tela sem apagar nada do banco, que é o pior tipo de omissão: silenciosa e
-- convincente.
--
-- O TERMO DE BUSCA CASA COM E-MAIL **OU** TEMPLATE. São as duas perguntas que se faz a um log de
-- e-mail ("o que foi para esta pessoa?" e "quem recebeu este template?"), e uma caixa que responde
-- as duas custa menos que dois filtros.

create or replace function listar_emails(termo text default '', limite int default 200)
returns table (
  id        uuid,
  email     text,
  nome      text,
  template  text,
  sent_at   timestamptz,
  status    text
)
language sql stable security definer set search_path = public as $$
  select l.id,
         u.email::text,
         p.nome,
         l.template,
         l.sent_at,
         l.status
  from email_log l
  left join auth.users u on u.id = l.user_id
  left join profiles   p on p.id = l.user_id
  where termo = ''
     or coalesce(u.email::text, '') ilike '%' || termo || '%'
     or l.template ilike '%' || termo || '%'
  -- Mais recente primeiro: num log, a última linha é a que se procura.
  order by l.sent_at desc
  limit least(greatest(limite, 1), 1000);
$$;

revoke execute on function listar_emails(text, int) from public;
revoke execute on function listar_emails(text, int) from anon, authenticated;

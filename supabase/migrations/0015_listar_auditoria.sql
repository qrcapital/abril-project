-- ============================================================
-- 0015 — Leitura do rastro do admin (PLANO-ADMIN §2)
-- ============================================================
--
-- A `0014` criou a `admin_audit` e o comentário dela dizia que faltava tela. Em 31/jul/2026 o rastro
-- passou a guardar cinco tipos de ação (papel, 2ª chamada e as três de aluno, incluindo troca de
-- e-mail, que é troca de login), e "consulta-se por SQL" deixou de ser aceitável: auditoria que só o
-- dono do banco consegue ler não responde a quem precisa perguntar.
--
-- Mesma família e mesmas escolhas da `0004`, `0006` e `0008`: `security definer` porque precisa ler
-- `auth.users` (o e-mail do alvo não está em `profiles`), e revogada de PUBLIC, anon e authenticated,
-- porque só a service role chama, do servidor, depois de a guarda do layout passar.
--
-- ARMADILHA JÁ REGISTRADA CINCO VEZES NESTE SCHEMA: `revoke ... from anon, authenticated` não fecha
-- função, porque o EXECUTE vem de PUBLIC. O revoke de PUBLIC é o que fecha.
--
-- `left join` no alvo pelo mesmo motivo da `0008`: `alvo_id` não tem FK e a conta pode ter sido
-- apagada. O rastro do que se fez com uma conta precisa sobreviver ao fim dela, senão apagar a conta
-- vira o jeito de apagar o histórico. O `autor_email` já vem congelado da própria tabela.
--
-- O TERMO CASA COM AUTOR, ALVO OU AÇÃO. São as três perguntas que se faz a um rastro: "o que o
-- fulano andou fazendo?", "quem mexeu nesta conta?" e "quem liberou 2ª chamada este mês?".

create or replace function listar_auditoria(termo text default '', limite int default 200)
returns table (
  id          uuid,
  autor_email text,
  acao        text,
  alvo_id     uuid,
  alvo_email  text,
  alvo_nome   text,
  detalhe     jsonb,
  created_at  timestamptz
)
language sql stable security definer set search_path = public as $$
  select a.id,
         a.autor_email,
         a.acao,
         a.alvo_id,
         u.email::text,
         p.nome,
         a.detalhe,
         a.created_at
  from admin_audit a
  left join auth.users u on u.id = a.alvo_id
  left join profiles   p on p.id = a.alvo_id
  where termo = ''
     or coalesce(a.autor_email, '')  ilike '%' || termo || '%'
     or coalesce(u.email::text, '')  ilike '%' || termo || '%'
     or coalesce(p.nome, '')         ilike '%' || termo || '%'
     or a.acao                       ilike '%' || termo || '%'
  -- Mais recente primeiro, e o índice `admin_audit_data_idx` da 0014 já atende esta ordem.
  order by a.created_at desc
  limit least(greatest(limite, 1), 1000);
$$;

revoke execute on function listar_auditoria(text, int) from public;
revoke execute on function listar_auditoria(text, int) from anon, authenticated;

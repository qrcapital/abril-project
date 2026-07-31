-- ============================================================
-- 0006 — Lista de alunos para o admin (PLANO-ADMIN §4.2)
-- ============================================================
--
-- POR QUE EM SQL e não agregando em JavaScript: a lista precisa, por aluno, de aulas concluídas e
-- situação da prova. Em JS isso é puxar `progress` inteiro (16 linhas por aluno) e `exams` inteiro
-- para contar na memória, ou uma consulta por aluno. Com nove contas dá na mesma; com uma turma de
-- verdade, a primeira opção traz dezenas de milhares de linhas para exibir uma tabela. Aqui é uma
-- ida ao banco, sempre.
--
-- Mesma família das funções da `0004`, com as mesmas escolhas: `security definer` porque precisa
-- ler `auth.users` (o e-mail não está em `profiles`), e revogada de PUBLIC, anon e authenticated,
-- porque só a service role chama, do servidor, depois de a guarda do layout ter passado.
--
-- ARMADILHA JÁ REGISTRADA TRÊS VEZES NESTE SCHEMA: `revoke ... from anon, authenticated` não fecha
-- função, porque o EXECUTE vem de PUBLIC. O revoke de PUBLIC é o que fecha.
--
-- O ESTADO DE ACESSO NÃO É CALCULADO AQUI, de propósito. Esta função devolve `status` e
-- `expires_at` crus, e quem traduz para ativa/expirada/revogada/ausente é o
-- `lib/matricula-estado.ts`, que é a mesma função que a guarda do aluno usa. Repetir a regra em
-- SQL criaria uma segunda verdade sobre quem tem acesso, e a divergência apareceria no suporte,
-- não no build.

create or replace function listar_alunos(termo text default '', limite int default 100)
returns table (
  id                uuid,
  email             text,
  nome              text,
  is_admin          boolean,
  status            text,
  expires_at        timestamptz,
  inicio_em         timestamptz,
  liberacao_total   boolean,
  guru_customer_id  text,
  concluidas        int,
  prova_status      text,
  prova_score       int,
  prova_tentativas  int,
  criado_em         timestamptz
)
language sql stable security definer set search_path = public as $$
  with matricula as (
    -- A mais recente manda, igual ao `getMatricula`: renovação cria linha nova em vez de editar a
    -- antiga, então pegar qualquer uma daria estado errado para quem já renovou.
    select distinct on (e.user_id)
           e.user_id, e.status::text, e.expires_at, e.inicio_em, e.liberacao_total
    from enrollments e
    order by e.user_id, e.expires_at desc
  ),
  feitas as (
    -- Só aula que conta para o gate de 16/16, senão o Módulo 0 entraria na conta e o progresso
    -- passaria de 16.
    select p.user_id, count(*)::int as n
    from progress p
    join lessons l on l.id = p.lesson_id
    where p.status = 'completed' and l.conta_no_gate
    group by p.user_id
  ),
  prova as (
    select distinct on (x.user_id)
           x.user_id, x.status::text, x.score::int,
           (select count(*)::int from exams y where y.user_id = x.user_id) as tentativas
    from exams x
    order by x.user_id, x.attempt desc
  )
  select u.id,
         u.email::text,
         p.nome,
         coalesce(p.is_admin, false),
         m.status,
         m.expires_at,
         m.inicio_em,
         coalesce(m.liberacao_total, false),
         p.guru_customer_id,
         coalesce(f.n, 0),
         pr.status,
         pr.score,
         coalesce(pr.tentativas, 0),
         u.created_at
  from auth.users u
  left join profiles  p  on p.id = u.id
  left join matricula m  on m.user_id = u.id
  left join feitas    f  on f.user_id = u.id
  left join prova     pr on pr.user_id = u.id
  -- Termo vazio devolve TODOS aqui, ao contrário do `buscar_usuarios`: esta é uma tela de lista,
  -- e lista que abre vazia esconde a operação. O `limite` é que segura o tamanho.
  where termo = ''
     or u.email ilike '%' || termo || '%'
     or coalesce(p.nome, '') ilike '%' || termo || '%'
  order by u.created_at desc
  limit least(greatest(limite, 1), 500);
$$;

revoke execute on function listar_alunos(text, int) from public;
revoke execute on function listar_alunos(text, int) from anon, authenticated;

-- Progresso por módulo, para o detalhe do aluno (§4.3). Devolve TODOS os módulos, inclusive os
-- sem nenhuma aula concluída, com `left join` a partir de `modules`: um módulo ausente da lista
-- seria lido como "não existe" em vez de "nada feito aqui".
create or replace function aluno_modulos(alvo uuid)
returns table (ord smallint, titulo text, total int, concluidas int, conta_no_gate boolean)
language sql stable security definer set search_path = public as $$
  select m.ord,
         m.titulo,
         count(l.id)::int as total,
         count(pr.lesson_id)::int as concluidas,
         bool_or(l.conta_no_gate) as conta_no_gate
  from modules m
  left join lessons l on l.module_id = m.id
  left join progress pr
         on pr.lesson_id = l.id and pr.user_id = alvo and pr.status = 'completed'
  group by m.ord, m.titulo
  order by m.ord;
$$;

revoke execute on function aluno_modulos(uuid) from public;
revoke execute on function aluno_modulos(uuid) from anon, authenticated;

-- ============================================================
-- 0004 — Busca de usuários por e-mail, para a tela de Equipe do admin
-- ============================================================
--
-- POR QUE UMA FUNÇÃO, e não uma consulta direta: o e-mail vive em `auth.users`, schema que o
-- PostgREST não expõe, e `public.profiles` não guarda e-mail (só id, nome, telefone,
-- guru_customer_id, is_admin). Sem isto a busca teria que ser `auth.admin.listUsers()` com
-- filtro em memória, que traz o banco inteiro em páginas de 1000 para achar uma linha.
--
-- A `buscar_usuarios` também é o primitivo que a tela de Alunos (PLANO-ADMIN §4.2) vai precisar,
-- que pede "busca por nome/e-mail". Aqui ela cobre só e-mail, que é o que foi pedido; estender
-- para nome é acrescentar uma cláusula, não reescrever.
--
-- QUEM PODE CHAMAR: só a service role. As duas são `security definer` porque precisam ler
-- `auth.users`, e estão revogadas de PUBLIC, anon e authenticated.
--
-- NÃO existe checagem de `is_admin()` dentro delas, e isso é deliberado: na service role
-- `auth.uid()` é null, então a checagem reprovaria toda chamada e a função seria inútil. A
-- autorização é feita em TypeScript, por `papelAtual()`, nos dois lugares que chamam:
-- `app/admin/equipe/page.tsx` e `app/admin/api/papel/route.ts`. No route handler essa checagem
-- é o ÚNICO guarda, porque route handler não passa por layout — está comentado lá e verificado
-- com curl.
--
-- ARMADILHA JÁ REGISTRADA DUAS VEZES NESTE SCHEMA (ver 0001, bloco do `sortear_prova`):
-- `revoke execute ... from anon, authenticated` NÃO fecha uma função. O Postgres concede
-- EXECUTE a PUBLIC ao criar, e os dois papéis herdam desse grant. O revoke de PUBLIC é o que
-- fecha; os outros dois ficam como documentação da intenção.
--
-- `search_path` é fixado em `public` pela recomendação de `security definer`, e `auth.users`
-- aparece qualificado, que dispensa search_path.

create or replace function buscar_usuarios(termo text, limite int default 20)
returns table (id uuid, email text, nome text, is_admin boolean, criado_em timestamptz)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text, p.nome, coalesce(p.is_admin, false), u.created_at
  from auth.users u
  left join public.profiles p on p.id = u.id
  -- Termo vazio devolve nada, em vez de devolver o banco inteiro: a tela abre sem busca feita,
  -- e "sem filtro" não pode significar "liste todos os e-mails".
  where termo <> '' and u.email ilike '%' || termo || '%'
  -- Acerto exato primeiro: quem cola o e-mail completo quer aquela linha no topo.
  order by (u.email = termo) desc, u.email
  limit least(greatest(limite, 1), 100);
$$;

revoke execute on function buscar_usuarios(text, int) from public;
revoke execute on function buscar_usuarios(text, int) from anon, authenticated;

-- Quem tem a chave hoje. Separada da busca em vez de virar um parâmetro da mesma função: são
-- duas perguntas diferentes, e a tela faz as duas sempre (a lista de admins aparece com ou sem
-- busca). A rota também a usa para a trava do último admin.
create or replace function listar_admins()
returns table (id uuid, email text, nome text, criado_em timestamptz)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text, p.nome, u.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.is_admin
  order by u.email;
$$;

revoke execute on function listar_admins() from public;
revoke execute on function listar_admins() from anon, authenticated;

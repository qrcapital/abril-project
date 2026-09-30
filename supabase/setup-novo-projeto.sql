-- SETUP COMPLETO DO BANCO, projeto Supabase novo (gerado em 30/set/2026 a partir de supabase/migrations/0001 a 0025).
-- Rodar UMA vez, num projeto vazio, no SQL Editor. Não contém dado de aluno nem seed de teste.

-- ================================================================
-- 0001_init.sql
-- ================================================================
-- Estratégia Internacional — schema inicial (S1)
-- Deriva de PRD.md §13 (modelo de dados), §4 (acesso), §7 (prova), §16 (admin).
-- Convenção: RLS ligada em tudo. Escritas sensíveis (webhook, correção da prova,
-- emissão de certificado) passam pela service role, que ignora RLS por padrão.

-- ============================================================
-- Extensões
-- ============================================================
create extension if not exists "pgcrypto";      -- gen_random_uuid()

-- ============================================================
-- Enums
-- ============================================================
do $$ begin
  create type enrollment_status as enum ('active','revoked','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type progress_status as enum ('started','completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type exam_status as enum ('available','in_progress','submitted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type material_tipo as enum ('apostila','planilha','resumo','ebook');
exception when duplicate_object then null; end $$;

-- ============================================================
-- Tabelas
-- ============================================================

-- perfil, estende auth.users (1:1)
create table if not exists profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  nome              text,
  telefone          text,
  guru_customer_id  text,
  is_admin          boolean not null default false,
  created_at        timestamptz not null default now()
);

-- matrícula do aluno no curso
create table if not exists enrollments (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  status         enrollment_status not null default 'active',
  purchased_at   timestamptz not null default now(),
  expires_at     timestamptz not null,             -- purchased_at + 1 ano
  guru_order_id  text unique,                       -- dedupe do webhook
  created_at     timestamptz not null default now()
);
create index if not exists enrollments_user_idx on enrollments(user_id);

-- módulos (0 = boas-vindas, 1..4 = I..IV)
create table if not exists modules (
  id          uuid primary key default gen_random_uuid(),
  ord         smallint not null unique check (ord between 0 and 4),
  titulo      text not null,
  docente     text,
  arte        text,
  created_at  timestamptz not null default now()
);

-- aulas
create table if not exists lessons (
  id              uuid primary key default gen_random_uuid(),
  module_id       uuid not null references modules(id) on delete cascade,
  ord             smallint not null,               -- ordem dentro do módulo
  titulo          text not null,
  descricao       text,
  panda_video_id  text,
  duracao         integer,                          -- segundos
  conta_no_gate   boolean not null default true,    -- false no Módulo 0 (não conta p/ 16/16)
  created_at      timestamptz not null default now(),
  unique (module_id, ord)
);
create index if not exists lessons_module_idx on lessons(module_id);

-- materiais (por aula ou por módulo)
create table if not exists materials (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid references lessons(id) on delete cascade,
  module_id   uuid references modules(id) on delete cascade,
  tipo        material_tipo not null,
  titulo      text not null,
  arquivo     text not null,                        -- caminho no Storage
  created_at  timestamptz not null default now(),
  check (lesson_id is not null or module_id is not null)
);

-- progresso por aula
create table if not exists progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  lesson_id     uuid not null references lessons(id) on delete cascade,
  status        progress_status not null default 'started',
  watched_pct   smallint not null default 0 check (watched_pct between 0 and 100),
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists progress_user_idx on progress(user_id);

-- banco de questões (NUNCA legível pelo aluno: contém a resposta correta)
create table if not exists questions (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid not null references modules(id) on delete cascade,
  enunciado    text not null,
  alternativas jsonb not null,                      -- ["A ...","B ...","C ...","D ..."]
  correta      smallint not null check (correta between 0 and 3),
  ativo        boolean not null default true,
  created_at   timestamptz not null default now(),
  check (jsonb_array_length(alternativas) = 4)
);
create index if not exists questions_module_idx on questions(module_id) where ativo;

-- tentativas de prova
create table if not exists exams (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  attempt            smallint not null default 1,
  status             exam_status not null default 'available',
  score              smallint,                       -- 0..100
  started_at         timestamptz,
  deadline           timestamptz,                    -- started_at + 120 min
  submitted_at       timestamptz,
  questions_snapshot jsonb,                          -- as 20 sorteadas (com correta, uso server-side)
  answers            jsonb,                          -- respostas do aluno
  created_at         timestamptz not null default now(),
  unique (user_id, attempt)
);
create index if not exists exams_user_idx on exams(user_id);

-- certificados
create table if not exists certificates (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  codigo     text not null unique,                   -- EI-2026-XXXX
  issued_at  timestamptz not null default now(),
  pdf        text                                    -- caminho no Storage
);

-- log de e-mails
create table if not exists email_log (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid references auth.users(id) on delete set null,
  template  text not null,
  sent_at   timestamptz not null default now(),
  status    text
);

-- ============================================================
-- Funções auxiliares
-- ============================================================

-- é admin?
create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- tem acesso ativo (matrícula active e não expirada)?
create or replace function has_active_access()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from enrollments
    where user_id = auth.uid()
      and status = 'active'
      and expires_at > now()
  );
$$;

-- sorteia a prova: 5 questões ativas de cada módulo I..IV (20 no total).
-- Retorna as questões (sem a resposta correta), para uso do server action.
create or replace function sortear_prova()
returns table (id uuid, module_ord smallint, enunciado text, alternativas jsonb)
language sql volatile security definer set search_path = public as $$
  select q.id, m.ord, q.enunciado, q.alternativas
  from (
    select q.*,
           row_number() over (partition by q.module_id order by random()) as rn
    from questions q
    where q.ativo
  ) q
  join modules m on m.id = q.module_id
  where m.ord between 1 and 4 and q.rn <= 5
  order by m.ord, random();
$$;

-- verificação pública do certificado (sem expor a tabela)
create or replace function verify_certificate(p_codigo text)
returns table (nome text, codigo text, issued_at timestamptz, valido boolean)
language sql stable security definer set search_path = public as $$
  select p.nome, c.codigo, c.issued_at, true
  from certificates c
  join profiles p on p.id = c.user_id
  where c.codigo = p_codigo;
$$;

-- cria o perfil automaticamente quando um usuário nasce no auth
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, nome, telefone)
  values (new.id, new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'telefone')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- RLS
-- ============================================================
alter table profiles     enable row level security;
alter table enrollments  enable row level security;
alter table modules      enable row level security;
alter table lessons      enable row level security;
alter table materials    enable row level security;
alter table progress     enable row level security;
alter table questions    enable row level security;
alter table exams        enable row level security;
alter table certificates enable row level security;
alter table email_log    enable row level security;

-- profiles: dono lê/edita o próprio; admin lê todos
create policy profiles_self_select on profiles for select using (id = auth.uid() or is_admin());
create policy profiles_self_update on profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- enrollments: dono lê o próprio; admin lê todos. Escrita só service role (webhook/admin server).
create policy enrollments_self_select on enrollments for select using (user_id = auth.uid() or is_admin());

-- catálogo (modules, lessons, materials): legível por quem tem acesso ativo, ou admin
create policy modules_read   on modules   for select using (has_active_access() or is_admin());
create policy lessons_read   on lessons   for select using (has_active_access() or is_admin());
create policy materials_read on materials for select using (has_active_access() or is_admin());

-- progress: dono lê e escreve o próprio
create policy progress_self_select on progress for select using (user_id = auth.uid());
create policy progress_self_write  on progress for insert with check (user_id = auth.uid());
create policy progress_self_update on progress for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- questions: SÓ admin (aluno nunca lê; sorteio é via função security definer no server)
create policy questions_admin_only on questions for select using (is_admin());

-- exams: dono lê o próprio; admin lê todos. Escrita (criar tentativa, corrigir) só service role.
create policy exams_self_select on exams for select using (user_id = auth.uid() or is_admin());

-- ...MAS o snapshot guarda a `correta` de cada uma das 20 questões (é o que permite
-- corrigir e auditar contra o que o aluno viu). Com a policy acima, o aluno lê a PRÓPRIA
-- linha, então sem o que vem abaixo ele baixaria o gabarito da própria prova com a chave
-- anon: `GET /rest/v1/exams?select=questions_snapshot`. RLS é por LINHA e não resolve
-- coluna. A correção roda com service role, que não é afetada por nada disto.
--
-- ATENÇÃO ao jeito de fazer: `revoke select (questions_snapshot) ...` sozinho NÃO
-- funciona. O Supabase concede SELECT no nível da TABELA para anon/authenticated, e um
-- grant de tabela cobre todas as colunas, presentes e futuras; não se subtrai uma coluna
-- de dentro dele. É preciso revogar a tabela e reconceder a lista de colunas permitidas.
-- Consequência: coluna nova em `exams` NÃO fica legível para o aluno até ser adicionada
-- nesta lista, o que é o padrão seguro, mas surpreende quem esquecer.
revoke select on exams from anon, authenticated;
grant select (id, user_id, attempt, status, score, started_at, deadline, submitted_at, answers, created_at)
  on exams to anon, authenticated;

-- certificates: dono lê o próprio; admin lê todos. (Verificação pública usa verify_certificate.)
create policy certificates_self_select on certificates for select using (user_id = auth.uid() or is_admin());

-- email_log: só admin
create policy email_log_admin on email_log for select using (is_admin());

-- ============================================================
-- Permissões nas funções públicas
-- ============================================================
grant execute on function verify_certificate(text) to anon, authenticated;
grant execute on function has_active_access() to authenticated;
grant execute on function is_admin() to authenticated;
-- sortear_prova NÃO é exposta a anon/authenticated: chamada só pela service role no server.
--
-- ATENÇÃO (corrigido em 28/jul/2026): revogar só de `anon, authenticated` NÃO fecha a
-- função. O Postgres concede EXECUTE a PUBLIC por padrão ao criar uma função, e os dois
-- papéis herdam desse grant, então a função seguia chamável pela chave anon via PostgREST
-- (verificado no homolog: `has_function_privilege('anon', ..., 'EXECUTE')` dava true e o
-- ACL mostrava `=X/postgres`, que é o grant de PUBLIC). Um aluno conseguia enumerar o
-- banco de questões repetindo a chamada, 5 por módulo a cada vez. A `correta` não vazava,
-- porque a função não a retorna, mas os enunciados e as alternativas sim.
--
-- O revoke de PUBLIC é o que fecha de fato. Os outros dois são redundantes depois dele,
-- e ficam como documentação da intenção.
revoke execute on function sortear_prova() from public;
revoke execute on function sortear_prova() from anon, authenticated;


-- ================================================================
-- 0002_liberacao.sql
-- ================================================================
-- 0002 — Liberação gradual do curso (29/jul/2026)
--
-- Um módulo por semana a partir do início da matrícula, com chave de liberação total por
-- aluno. A razão não é pedagógica, é comercial: sem esteira, um aluno termina o curso em
-- poucos dias, emite o certificado e pede reembolso dentro da janela de arrependimento.
--
-- Dois campos:
--
--   inicio_em        âncora do calendário. Nasce igual a purchased_at, e existe SEPARADA dela
--                    de propósito: o curso tem turmas, e no dia em que turma virar operação de
--                    verdade basta gravar a mesma data de início para todos os alunos da turma
--                    para o calendário virar coletivo, sem migração nova nem reescrita da regra.
--
--   liberacao_total  abre o curso inteiro para um aluno. Decisão do Pedro (29/jul): fica só nas
--                    mãos do admin, para casos específicos. A garantia disso é estrutural, não
--                    de disciplina: a tabela `enrollments` não tem policy de UPDATE, então nem
--                    o próprio dono da linha consegue virar a chave pela API. Só a service role
--                    (webhook, admin) escreve aqui.

alter table enrollments add column if not exists inicio_em timestamptz;
update enrollments set inicio_em = purchased_at where inicio_em is null;
alter table enrollments alter column inicio_em set not null;
alter table enrollments alter column inicio_em set default now();

alter table enrollments
  add column if not exists liberacao_total boolean not null default false;

comment on column enrollments.inicio_em is
  'Ancora do calendario de liberacao. Nasce = purchased_at; vira data da turma quando turma for operacao.';
comment on column enrollments.liberacao_total is
  'Abre o curso inteiro para este aluno. Só admin/service role escreve: nao ha policy de UPDATE nesta tabela.';


-- ================================================================
-- 0003_guarda_admin.sql
-- ================================================================
-- 0003 — Fecha a escalada de privilégio do `is_admin` (30/jul/2026)
--
-- O FURO, confirmado contra o banco vivo do homolog antes desta migração existir: qualquer
-- aluno logado virava admin com uma chamada, usando só a chave anon.
--
--   PATCH /rest/v1/profiles?id=eq.<seu uid>   { "is_admin": true }   -> 200, coluna virava true
--
-- A causa é a mesma dos dois furos que o HANDOFF §6 registra, e o 0001 já tinha escrito a lição
-- no bloco do `exams`: **RLS é por LINHA e não resolve COLUNA.** A policy `profiles_self_update`
-- restringia corretamente QUAL linha o aluno altera (a dele) e não dizia nada sobre QUAIS
-- colunas. O Supabase concede UPDATE no nível da tabela para `anon`/`authenticated`, e grant de
-- tabela cobre todas as colunas, presentes e futuras.
--
-- Por que era grave e não teórico: hoje ninguém é admin, então o furo é latente. No instante em
-- que o admin da Fase 1 subir, `is_admin = true` faz o aluno passar nas DEZ policies que chamam
-- `is_admin()` — inclusive `questions_admin_only`, que é o banco de questões com o gabarito. O
-- aluno se promoveria e leria as respostas da própria prova.
--
-- ============================================================
-- Camada 1 — o aluno não escreve em `profiles`, ponto
-- ============================================================
-- A primeira versão desta migração reconcedia `update (nome, telefone)` ao aluno, na linha do
-- que o `exams` faz com SELECT. Estava errado por excesso: o PRD §9 define "Minha conta" como
-- tela ENXUTA de propósito ("cada campo a mais é um ticket de suporte a mais"). Nome é exibido,
-- e-mail muda via suporte, e a única ação self-service é trocar senha, que é Auth e não
-- `profiles`. Conferido também no código: a ÚNICA escrita em `profiles` no app é o upsert de
-- `app/app/login/actions.ts`, e ela usa a service role.
--
-- Então a garantia aqui é a mesma que o 0002 escolheu para `enrollments`: a tabela não tem
-- policy de UPDATE, e por isso nem o dono da linha escreve nela pela API. Só a service role
-- (webhook do Guru, admin, migração) grava. Estrutural, não disciplina.
--
-- SE UM DIA o produto quiser deixar o aluno editar o próprio nome, são DUAS coisas, e esquecer
-- a segunda reabre este furo: (1) criar a policy de UPDATE restringindo a linha, e (2) conceder
-- UPDATE **apenas nas colunas permitidas** — nunca `grant update on profiles`, que traz
-- `is_admin` de volta junto. A camada 2 abaixo existe para o caso de alguém esquecer.
revoke update on profiles from anon, authenticated;
drop policy if exists profiles_self_update on profiles;

-- ============================================================
-- Camada 2 — trigger que guarda a coluna de privilégio
-- ============================================================
-- A camada 1 sozinha basta hoje. Esta existe porque o schema deste projeto já foi aplicado à
-- mão por psql, e "à mão" é exatamente onde um `grant all` reaparece num reset — e porque no dia
-- em que alguém reabrir o UPDATE do aluno para editar o nome, o `is_admin` continua fechado.
--
-- Quem pode mudar `is_admin`:
--   - a service role (webhook, admin, migração, psql), que chega sem `auth.uid()`;
--   - um admin que JÁ era admin antes deste UPDATE.
-- Qualquer outro caminho estoura, em vez de gravar em silêncio.
--
-- `is_admin()` é `security definer` e `stable`, então lê o estado ANTERIOR ao UPDATE, que é
-- justamente a pergunta certa: quem chamou era admin antes de tentar mexer nisto?
create or replace function guarda_is_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.is_admin is distinct from old.is_admin then
    -- Sem JWT de usuário: service role, migração ou psql. É o caminho legítimo de conceder e
    -- revogar o papel enquanto não existe tela de admin para isso.
    if auth.uid() is null then
      return new;
    end if;
    if not is_admin() then
      raise exception
        'is_admin so pode ser alterado por um admin existente ou pela service role'
        using errcode = '42501';  -- insufficient_privilege
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guarda_is_admin on profiles;
create trigger profiles_guarda_is_admin
  before update on profiles
  for each row execute function guarda_is_admin();

-- O trigger é chamado pelo Postgres, nunca pelo cliente: não precisa (e não deve) ter EXECUTE
-- aberto. Mesma lição do `sortear_prova` no 0001 — o revoke que fecha de fato é o de PUBLIC,
-- porque é dele que `anon` e `authenticated` herdam.
revoke execute on function guarda_is_admin() from public;

comment on function guarda_is_admin() is
  'Barra mudanca de profiles.is_admin por quem nao e admin. Camada 2 do 0003; a 1 e a ausencia de UPDATE para o aluno.';


-- ================================================================
-- 0004_buscar_usuarios.sql
-- ================================================================
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


-- ================================================================
-- 0005_admin_mestre.sql
-- ================================================================
-- ============================================================
-- 0005 — Admin mestre (dois níveis de admin)
-- ============================================================
--
-- Pedido pelo Pedro em 30/jul/2026, depois de testar a tela de Equipe: um **admin mestre**, e os
-- outros admins podem fazer tudo menos mexer no acesso dele.
--
-- POR QUE UMA SEGUNDA COLUNA e não um enum `papel`: `is_admin()` sustenta **dez policies** de RLS
-- e o trigger da `0003`. Trocar por enum obrigaria a reescrever a função e revalidar as dez, com
-- risco alto e ganho nenhum. `is_master` é ortogonal: quem é mestre também é admin, e nenhuma
-- policy existente precisa saber que a coluna existe.
--
-- A regra "mestre implica admin" fica no banco como CHECK, e não como acordo de cavalheiros: sem
-- ela o estado (is_master=true, is_admin=false) é representável, e aí um mestre não entra no
-- painel mas ninguém consegue mexer nele.

alter table profiles
  add column if not exists is_master boolean not null default false;

alter table profiles drop constraint if exists profiles_master_implica_admin;
alter table profiles
  add constraint profiles_master_implica_admin check (not is_master or is_admin);

-- Espelha `is_admin()`, inclusive nas escolhas: `security definer` para ler a própria linha sem
-- depender de policy, e `stable` porque não escreve.
create or replace function is_master()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_master from profiles where id = auth.uid()), false);
$$;

-- ATENÇÃO à armadilha já registrada duas vezes neste schema: `revoke` de anon/authenticated não
-- fecha função, porque o EXECUTE vem de PUBLIC. Aqui a intenção é o CONTRÁRIO: `authenticated`
-- PRECISA chamar, porque `lib/admin.ts` pergunta "eu sou mestre?" com o cliente anon, do mesmo
-- jeito que já pergunta `is_admin()`. E a função só conta sobre a PRÓPRIA linha de quem chama,
-- então não há o que vazar.
grant execute on function is_master() to authenticated;

-- ============================================================
-- O trigger da 0003, agora ciente dos dois níveis
-- ============================================================
--
-- Este é o BACKSTOP, não o controle principal. O caminho do app escreve com a **service role**,
-- onde `auth.uid()` é null e este trigger passa direto de propósito; quem barra ali é a checagem
-- em TypeScript do `app/admin/api/papel/route.ts`. As duas implementam as MESMAS regras, e a
-- duplicação é consciente: o trigger não tem como enxergar a intenção do app, e sem ele qualquer
-- caminho direto ao banco (psql de alguém, uma policy reaberta por engano no futuro) ficaria sem
-- regra nenhuma. É a mesma razão pela qual a `0003` criou o trigger mesmo com o UPDATE revogado.
create or replace function guarda_is_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- service role, migração, webhook: sem sessão, passa. É o caminho do app e o do bootstrap.
  if auth.uid() is null then
    return new;
  end if;

  -- Conceder ou tirar o próprio nível de mestre é privilégio de mestre. Sem esta regra um admin
  -- comum se promoveria a mestre e a distinção não existiria.
  if new.is_master is distinct from old.is_master then
    if not is_master() then
      raise exception 'is_master so pode ser alterado por um admin mestre ou pela service role'
        using errcode = '42501';
    end if;
  end if;

  if new.is_admin is distinct from old.is_admin then
    if not is_admin() then
      raise exception 'is_admin so pode ser alterado por um admin existente ou pela service role'
        using errcode = '42501';
    end if;

    -- O pedido do Pedro, na camada do banco: admin comum não mexe no acesso de um mestre.
    -- `old.is_master` e não `new`: o que importa é o que a linha ERA quando alguém a atacou.
    if old.is_master and not is_master() then
      raise exception 'o acesso de um admin mestre so pode ser alterado por outro admin mestre'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guarda_is_admin on profiles;
create trigger profiles_guarda_is_admin
  before update on profiles for each row execute function guarda_is_admin();

revoke execute on function guarda_is_admin() from public;

-- ============================================================
-- As duas funções de leitura da tela de Equipe, agora com o nível
-- ============================================================
--
-- `create or replace` não muda tipo de retorno, então as duas precisam cair primeiro.

drop function if exists buscar_usuarios(text, int);
create or replace function buscar_usuarios(termo text, limite int default 20)
returns table (
  id uuid, email text, nome text, is_admin boolean, is_master boolean, criado_em timestamptz
)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text, p.nome,
         coalesce(p.is_admin, false), coalesce(p.is_master, false), u.created_at
  from auth.users u
  left join public.profiles p on p.id = u.id
  where termo <> '' and u.email ilike '%' || termo || '%'
  order by (u.email = termo) desc, u.email
  limit least(greatest(limite, 1), 100);
$$;
revoke execute on function buscar_usuarios(text, int) from public;
revoke execute on function buscar_usuarios(text, int) from anon, authenticated;

drop function if exists listar_admins();
create or replace function listar_admins()
returns table (id uuid, email text, nome text, is_master boolean, criado_em timestamptz)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text, p.nome, p.is_master, u.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.is_admin
  -- Mestre primeiro: é quem responde por quem, e a lista é curta.
  order by p.is_master desc, u.email;
$$;
revoke execute on function listar_admins() from public;
revoke execute on function listar_admins() from anon, authenticated;


-- ================================================================
-- 0006_listar_alunos.sql
-- ================================================================
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


-- ================================================================
-- 0007_mover_aula.sql
-- ================================================================
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


-- ================================================================
-- 0008_listar_emails.sql
-- ================================================================
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


-- ================================================================
-- 0009_email_templates.sql
-- ================================================================
-- ============================================================
-- 0009 — Templates de e-mail editáveis pelo admin (PRD §14, PLANO-ADMIN §4.5)
-- ============================================================
--
-- Pedido do Pedro em 31/jul/2026: um **builder para os transacionais nossos**. O Guru já dispara os
-- de pagamento (PIX, boleto, cartão recusado, carrinho); os do produto são nossos, e boas-vindas e
-- certificado não existiam em lugar nenhum — o webhook gerava o link de acesso e não mandava nada.
--
-- ASSUNTO E CORPO NO BANCO, LAYOUT EM CÓDIGO. É a mesma divisão do currículo: quem edita texto é o
-- painel, e painel não edita código. O que fica no código é a moldura (marca, tipografia, botão,
-- rodapé), que é design system e não conteúdo, mais o **contrato de variáveis**: qual `{{campo}}`
-- cada template pode usar. Esse contrato é entre o gatilho e o texto, então mora onde o gatilho
-- mora, senão o editor inventaria variável que ninguém preenche e o aluno receberia `{{nome}}` cru.
--
-- O CTA é rótulo + destino, e o destino NÃO é editável: ele vem do gatilho (o link de senha, o
-- certificado, o WhatsApp). Deixar a URL no editor seria a forma mais barata de mandar todo mundo
-- para o lugar errado, e a mais difícil de perceber.
--
-- RLS LIGADA E NENHUMA POLICY, de propósito: só a service role lê e escreve aqui. Aluno não tem o
-- que fazer com esta tabela, e admin chega por ela pelo servidor, depois da guarda do layout.

create table if not exists email_templates (
  chave       text primary key,
  assunto     text not null,
  corpo       text not null,
  cta         text,
  ativo       boolean not null default true,
  updated_at  timestamptz not null default now()
);

alter table email_templates enable row level security;

comment on table email_templates is
  'Assunto e corpo dos transacionais nossos. Layout e variáveis permitidas vivem em lib/email-render.ts.';
comment on column email_templates.cta is
  'Rótulo do botão. O destino vem do gatilho, nunca do editor.';
comment on column email_templates.ativo is
  'Desligado não envia. O envio continua registrado em email_log, com status "desligado".';

-- Carga inicial. Copy no guia do docs/COPY.md: sem travessão, sem hype, número concreto.
-- `on conflict do nothing` para reaplicar a migration não desfazer edição feita no painel.
insert into email_templates (chave, assunto, corpo, cta) values
  (
    'boas-vindas',
    'Seu acesso à Estratégia Internacional está pronto',
    E'{{nome}}, sua matrícula está confirmada.\n'
    'O primeiro passo é criar sua senha, no botão abaixo. Depois disso você entra sempre pela mesma tela, com e-mail e senha.\n'
    'O curso abre um módulo por semana a partir de hoje, e o Módulo 0 de boas-vindas já está liberado. Se o link abaixo não funcionar mais, use "Esqueci minha senha" na tela de entrada.',
    'Criar minha senha'
  ),
  (
    'resultado-aprovado',
    'Você foi aprovado na prova final',
    E'{{nome}}, sua nota foi {{nota}}% e a aprovação está registrada.\n'
    'O certificado de conclusão já está na sua área, com download em PDF e um código de verificação que qualquer pessoa pode conferir online.',
    'Ver meu certificado'
  ),
  (
    'resultado-reprovado',
    'Resultado da sua prova final',
    E'{{nome}}, sua nota foi {{nota}}% e o mínimo para aprovação é {{minimo}}%.\n'
    'A prova tem tentativa única e a segunda chamada é liberada caso a caso. Fale com o suporte pelo WhatsApp para combinar a sua.\n'
    'Seu acesso às aulas continua valendo até o fim do prazo, então dá para revisar os módulos antes de tentar de novo.',
    'Falar com o suporte'
  )
on conflict (chave) do nothing;


-- ================================================================
-- 0010_email_banner.sql
-- ================================================================
-- ============================================================
-- 0010 — Banner de imagem por template de e-mail (PRD §14)
-- ============================================================
--
-- Pedido do Pedro em 31/jul/2026, depois de ver a prévia sem imagem nenhuma.
--
-- DUAS COLUNAS E NÃO UMA, e a segunda não é zelo: **cliente de e-mail bloqueia imagem por padrão**
-- (Outlook desktop, e Gmail em conta configurada assim). Sem `banner_alt`, o e-mail bloqueado abre
-- com uma caixa vazia no topo; com ele, abre com a frase. É a diferença entre um e-mail que degrada
-- e um que parece quebrado, e é por isso que a tela exige o alt quando existe banner.
--
-- O ENDEREÇO É URL COLADA, igual aos materiais do curso (decisão de 31/jul): o projeto não tem
-- bucket de Storage. Caminho começando com `/` é resolvido contra `NEXT_PUBLIC_SITE_URL` na hora de
-- montar o e-mail, porque **URL relativa não funciona em e-mail**: a mensagem é aberta fora do nosso
-- domínio e não existe base para resolver.
--
-- Nenhum dos três templates nasce com banner: a arte ainda não existe, e um banner de exemplo
-- viraria um placeholder saindo para aluno de verdade.

alter table email_templates
  add column if not exists banner     text,
  add column if not exists banner_alt text;

comment on column email_templates.banner is
  'Endereço do banner. https:// completo, ou caminho iniciando em / resolvido contra NEXT_PUBLIC_SITE_URL. Vazio = e-mail sem banner.';
comment on column email_templates.banner_alt is
  'Texto que aparece no lugar do banner quando o cliente de e-mail bloqueia imagem. Obrigatório quando existe banner.';


-- ================================================================
-- 0011_bucket_email.sql
-- ================================================================
-- ============================================================
-- 0011 — Bucket do Storage para o banner dos e-mails (PRD §14)
-- ============================================================
--
-- Pedido do Pedro em 31/jul/2026: campo de **upload** para o banner, em vez de só URL colada. Faz
-- sentido aqui e não fazia nos materiais do curso: banner é arte que alguém acabou de exportar, e
-- exigir que ela já esteja hospedada em algum lugar é pedir um passo que não existe.
--
-- **O BUCKET NASCE NA MIGRATION, e não por chamada de código.** Criar bucket sob demanda no primeiro
-- upload funciona e deixa uma peça de infraestrutura invisível: ninguém sabe que ela existe, com que
-- limites, nem como recriá-la no `ei-prod`. Aqui ele fica versionado junto com o resto do schema.
--
-- **PÚBLICO, e isso é requisito e não descuido:** cliente de e-mail busca a imagem sem sessão
-- nenhuma, de um proxy do Gmail ou do Outlook, então URL assinada com validade **não serve** para
-- banner de e-mail. Nada sensível vive aqui: é arte de campanha que também vai na caixa de entrada de
-- quem receber o e-mail.
--
-- **Os dois limites são de estrutura, não de tela.** A rota do admin já recusa arquivo grande e tipo
-- errado, e essa checagem é a primeira barreira; estes limites são a que sobra quando alguém escrever
-- um segundo caminho de upload e esquecer a validação. É o mesmo raciocínio do trigger
-- `guarda_is_admin`: a regra vive onde ela não depende de quem chama.
--
-- WebP fica FORA da lista de propósito: Outlook e versões antigas do Apple Mail não renderizam, e o
-- banner apareceria como caixa vazia justamente para parte de quem abre e-mail no desktop.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('email', 'email', true, 512000, array['image/png', 'image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Nenhuma policy em `storage.objects`: leitura de bucket público não passa por RLS, e a escrita sai
-- pela service role, que a ignora. Aluno e anônimo não têm caminho de escrita aqui.


-- ================================================================
-- 0012_certificado_unico.sql
-- ================================================================
-- ============================================================
-- 0012 — Um certificado por aluno (PRD §8)
-- ============================================================
--
-- A tabela `certificates` já nasceu com `codigo` unique, o que garante que dois alunos não
-- compartilhem código. Faltava a outra metade: **nada impedia o mesmo aluno de ter dois**.
--
-- Por que isso aconteceria na prática, e não em teoria: a emissão dispara na aprovação, e a aprovação
-- tem dois caminhos (o botão "Enviar" da prova e a rotina que fecha prova abandonada). Some a isso a
-- 2ª chamada, em que o aluno reprovado tenta de novo e passa. Sem esta restrição, duas rotas
-- concorrentes ou uma segunda tentativa aprovada produziriam duas linhas, e o aluno passaria a ter
-- **dois códigos válidos** para o mesmo curso — os dois verificáveis publicamente, sem nada dizendo
-- qual é o dele.
--
-- O índice único é o que faz o `on conflict do nothing` da emissão ser suficiente: quem chegar
-- segundo não grava, e a leitura seguinte devolve o certificado que já existe. É a mesma escolha do
-- webhook do Guru com `guru_order_id`: deixar o banco decidir a corrida em vez de conferir antes de
-- escrever, que é onde mora a janela entre a checagem e a gravação.

create unique index if not exists certificates_user_unico on certificates(user_id);

comment on index certificates_user_unico is
  'Um certificado por aluno. A emissao usa on conflict do nothing e conta com esta restricao.';


-- ================================================================
-- 0013_minimo_literal.sql
-- ================================================================
-- ============================================================
-- 0013 — A nota de corte sai de variável e vira texto (PRD §7)
-- ============================================================
--
-- Decisão do Pedro em 31/jul/2026: `{{minimo}}` não precisa ser variável, porque a nota mínima é 70 e
-- é premissa travada do PRD. Concordo com o argumento: variável que nunca varia é uma linha a mais na
-- legenda que quem escreve tem de entender para descobrir que ela não muda nada.
--
-- POR QUE ISSO É MIGRATION E NÃO EDIÇÃO NO PAINEL, que é o caminho normal para copy: a mudança de
-- texto está **acoplada a uma mudança de código**. Tirar `minimo` do contrato de variáveis sem trocar
-- o corpo deixaria a frase "o mínimo para aprovação é %" — o interpolador substitui variável ausente
-- por vazio, de propósito, para nunca mostrar `{{minimo}}` cru a um aluno. Os dois lados precisam
-- andar juntos, e o `ei-prod` precisa nascer com o texto certo.
--
-- O `where` faz a migration ser idempotente e, mais importante, **não pisar em edição feita no
-- painel**: se alguém já reescreveu esse parágrafo, não há `{{minimo}}` para trocar e nada acontece.
--
-- TETO CONHECIDO, e é o preço da decisão: o "70%" agora é texto. Se a nota de corte mudar no
-- `NOTA_MINIMA`, este e-mail continua dizendo 70 e nenhum check pega, porque o corpo vive no banco e
-- os checks não leem copy. Quem mexer no corte tem que passar por aqui — está anotado no PRD §7.

update email_templates
   set corpo = replace(corpo, '{{minimo}}', '70'),
       updated_at = now()
 where chave = 'resultado-reprovado'
   and corpo like '%{{minimo}}%';


-- ================================================================
-- 0014_admin_audit.sql
-- ================================================================
-- ============================================================
-- 0014 — Rastro das ações sensíveis do admin (PLANO-ADMIN §2)
-- ============================================================
--
-- O §2 pede, desde o plano de 20/jul, "registro de quem fez e quando" para ação sensível, com a
-- coluna ou o log "a definir". Ficou a definir por três levas: a tela de Equipe passou a conceder
-- privilégio de admin, a de Conteúdo a apagar aula com progresso, e a de Questões a apagar questão.
-- As três resolveram com `console.log`, e o comentário da rota de papel registra o teto: **log de
-- servidor tem retenção curta e ninguém consulta de propósito**.
--
-- A liberação de 2ª chamada seria a quarta escrita sensível sobre o mesmo rastro fraco, e é a que
-- mais pede rastro: ela devolve a alguém o direito de refazer a prova que ele já perdeu, caso a caso,
-- por decisão de uma pessoa. Perguntar depois "quem liberou, quando e por quê" é o motivo de existir
-- auditoria.
--
-- Uma tabela, cinco colunas, nada de genérico. `detalhe` é jsonb porque cada ação tem seu punhado de
-- campos (a nota que reprovou, o e-mail do alvo, o título da aula apagada), e inventar coluna para
-- cada uma seria uma tabela que muda a cada ação nova.
--
-- **Nenhuma escrita passa pelo aluno**: a tabela só é escrita pela service role, do servidor, depois
-- da checagem de papel da rota. RLS ligada e sem policy nenhuma, como `email_templates`: para anon e
-- authenticated ela não existe.
--
-- `on delete set null` no autor, e não cascade: se um admin sair da equipe e a conta for apagada, o
-- rastro do que ele fez **continua**. Auditoria que desaparece com quem foi auditado não é auditoria.

create table if not exists admin_audit (
  id         uuid primary key default gen_random_uuid(),
  autor_id   uuid references auth.users(id) on delete set null,
  autor_email text,                                  -- congelado: o e-mail de então, não o de hoje
  acao       text not null,                           -- 'papel.promover', 'prova.segunda-chamada', ...
  alvo_id    uuid,                                    -- aluno ou conta afetada, quando há uma
  detalhe    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists admin_audit_data_idx on admin_audit(created_at desc);
create index if not exists admin_audit_alvo_idx on admin_audit(alvo_id);

alter table admin_audit enable row level security;

comment on table admin_audit is
  'Quem fez o que, sobre quem e quando. Escrita so pela service role, depois da checagem de papel.';
comment on column admin_audit.autor_email is
  'Copia do e-mail do autor no momento da acao: se a conta dele sair, o rastro continua legivel.';


-- ================================================================
-- 0015_listar_auditoria.sql
-- ================================================================
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


-- ================================================================
-- 0016_politicas_liberacao.sql
-- ================================================================
-- 0016 — Políticas de liberação de conteúdo (17/ago/2026)
--
-- A cadência fixa de um módulo por semana (migration 0002, constante em lib/liberacao.ts) vira
-- POLÍTICA configurável pelo admin: uma regra por módulo, de quatro tipos (livre, em_breve,
-- dias após a compra, data programada). Decisões do Pedro em 17/ago:
--
--   - UMA política ativa para o curso inteiro, valendo para todos os alunos. Trocar a ativa
--     muda o curso para todo mundo; a exceção individual continua sendo a `liberacao_total`
--     da matrícula (0002).
--   - Política que deixa o curso concluível dentro da janela de arrependimento gera AVISO na
--     tela, não recusa: o admin pode escolher o risco de propósito.
--   - Módulo em breve não trava a prova (uso previsto: materiais complementares).
--
-- Sem policies de leitura para anon/authenticated DE PROPÓSITO: quem lê é o servidor, com a
-- service role, pelo mesmo motivo do currículo (lib/curriculo.ts) — a liberação também precisa
-- ser calculada para quem está bloqueado, e nada aqui é segredo de qualquer forma. RLS ligada
-- com zero policies = fechada para o cliente do aluno.

create table release_policies (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 80),
  ativa boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table release_policies is
  'Politicas de liberacao de conteudo. Uma ativa por vez (indice parcial); as demais sao rascunho/reserva.';

-- Uma ativa por vez, garantido pelo banco e não por disciplina de tela.
create unique index release_policies_uma_ativa on release_policies (ativa) where ativa;

create table release_rules (
  policy_id uuid not null references release_policies (id) on delete cascade,
  module_id uuid not null references modules (id) on delete cascade,
  tipo text not null check (tipo in ('livre', 'em_breve', 'dias', 'data')),
  -- Cada tipo carrega só o campo dele; os checks fazem a forma valer no banco.
  dias integer check (dias between 0 and 3650),
  abre_em timestamptz,
  primary key (policy_id, module_id),
  check ((tipo = 'dias') = (dias is not null)),
  check ((tipo = 'data') = (abre_em is not null))
);

comment on table release_rules is
  'Uma regra por (politica, modulo). Modulo sem regra na politica ativa fica em breve (REGRA_PADRAO do lib/liberacao.ts).';

-- FK sem índice vira seq scan no cascade e no join da tela.
create index release_rules_module_id on release_rules (module_id);

alter table release_policies enable row level security;
alter table release_rules enable row level security;

-- A política de estreia reproduz o comportamento que estava em código: boas-vindas e Módulo I
-- no ato, um por semana dali em diante. Ativa desde já, então nenhum aluno percebe a migração.
--
-- NOTA (18/ago): num banco NOVO esta migration roda antes do seed, quando `modules` está
-- vazia — a política nasce ativa e SEM regras (tudo em breve). Quem semeia as regras nesse
-- caso é o `supabase/seed.sql`, idempotente. Produção não roda seed: lá a política se monta
-- pela tela do admin, que é o caminho normal.
with politica as (
  insert into release_policies (nome, ativa)
  values ('Esteira semanal', true)
  returning id
)
insert into release_rules (policy_id, module_id, tipo, dias)
select politica.id, m.id, 'dias', greatest(0, m.ord - 1) * 7
from modules m, politica;


-- ================================================================
-- 0017_politica_por_matricula.sql
-- ================================================================
-- 0017 — Política de liberação por matrícula (17/ago/2026)
--
-- Complemento da 0016, pedido do Pedro no mesmo dia: a política ativa continua sendo o PADRÃO
-- de todos os alunos, e cada matrícula pode apontar para uma política específica, escolhida no
-- detalhe do aluno. NULL = segue o padrão.
--
-- `on delete set null`: apagar uma política devolve quem apontava para ela ao padrão, que é o
-- comportamento seguro (nunca abre nada por acidente; a tela de políticas avisa na confirmação).
-- Sem policy de UPDATE em `enrollments`, como sempre: só a service role escreve aqui.

alter table enrollments
  add column release_policy_id uuid references release_policies (id) on delete set null;

comment on column enrollments.release_policy_id is
  'Politica de liberacao especifica deste aluno. NULL = a politica ativa (padrao de todos).';

-- FK sem índice vira seq scan no on delete set null e na pergunta "quem usa esta política?".
create index enrollments_release_policy_id on enrollments (release_policy_id)
  where release_policy_id is not null;


-- ================================================================
-- 0018_progress_delete.sql
-- ================================================================
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


-- ================================================================
-- 0019_progresso_so_servidor.sql
-- ================================================================
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


-- ================================================================
-- 0020_responder_prova.sql
-- ================================================================
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


-- ================================================================
-- 0021_higiene.sql
-- ================================================================
-- 0021 — Higiene de banco (plano de correções de 17/ago, rodada 4, itens 22 e 24)
--
-- Índices para três FKs consultadas sem índice — FK sem índice vira seq scan no cascade e
-- nos joins das telas (mesma razão do release_rules_module_id, 0016):
--   - progress.lesson_id: o cascade de apagar aula e o join do gate no painel;
--   - email_log.user_id: o left join da tela de E-mails e o `on delete set null`;
--   - admin_audit.autor_id: o `on delete set null` de conta de admin apagada.
create index if not exists progress_lesson_idx on progress (lesson_id);
create index if not exists email_log_user_idx on email_log (user_id);
create index if not exists admin_audit_autor_idx on admin_audit (autor_id);

-- O comentário da coluna sempre disse "0..100"; agora o banco também. A nota nasce do
-- corrigir(), que respeita a faixa, mas CHECK é o que segura um update manual no futuro.
alter table exams add constraint exams_score_0_100
  check (score is null or score between 0 and 100);

-- ACL residual: `guarda_is_admin` teve o revoke de PUBLIC (0003/0005) e `handle_new_user`,
-- também security definer, ficou de fora. `returns trigger` não é chamável por RPC, então o
-- buraco era teórico — fecha mesmo assim, pela regra da casa: nenhuma função fica com o
-- EXECUTE de PUBLIC que o Postgres concede por padrão.
revoke execute on function handle_new_user() from public;


-- ================================================================
-- 0022_varredura_seguranca.sql
-- ================================================================
-- 0022 — Fechos da varredura de segurança de 18/ago/2026 (dois achados de baixa severidade)
--
-- 1. `is_admin()`, `is_master()` e `has_active_access()` nunca receberam o revoke de PUBLIC:
--    o grant explícito para `authenticated` (0001/0005) convivia com o EXECUTE default de
--    PUBLIC, então ANON conseguia chamá-las via RPC. Impacto nulo hoje — cada uma só lê a
--    linha do próprio `auth.uid()`, que para anon é null —, mas é a armadilha registrada
--    cinco vezes neste schema, e a regra da casa (0021) é nenhuma função ficar com o EXECUTE
--    de PUBLIC. O grant de `authenticated` fica: as policies de modules/lessons/materials e
--    profiles avaliam essas funções no papel de quem consulta.

--    O revoke de PUBLIC sozinho NÃO fecha para anon: o Supabase concede EXECUTE a
--    anon/authenticated por DEFAULT PRIVILEGES, um grant direto — conferido com
--    `has_function_privilege('anon', ...)` depois do primeiro revoke, que veio true. É a
--    razão de a 0007 revogar dos dois; aqui igual, mantendo `authenticated`.

revoke execute on function is_admin() from public, anon;
revoke execute on function is_master() from public, anon;
revoke execute on function has_active_access() from public, anon;

-- 2. `exams` e `enrollments` estavam com a escrita protegida em CAMADA ÚNICA: os grants
--    default de INSERT/UPDATE/DELETE nunca foram revogados, e só a ausência de policy de
--    escrita bloqueava o aluno de gravar `answers`/`score` ou `liberacao_total` direto pelo
--    PostgREST. Barreira real, mas uma policy larga criada no futuro abriria tudo de uma
--    vez — `profiles` (0003) e `progress` (0019) já têm o revoke, estes dois ficam iguais.
--    Toda escrita nas duas é da service role (webhook, motor da prova, admin), que não
--    depende de grant.

revoke insert, update, delete on exams from anon, authenticated;
revoke insert, update, delete on enrollments from anon, authenticated;


-- ================================================================
-- 0023_consentimento.sql
-- ================================================================
-- ============================================================
-- 0023 — Log de consentimento (pedido do jurídico da Abril, set/2026)
-- ============================================================
--
-- A Abril perguntou, em cima da revisão da Política e dos Termos: "o log de consentimento fica sob
-- responsabilidade de vocês? Há como mantermos acesso a ele?". A resposta que demos foi sim para as
-- duas, e esta migration é a primeira metade dela.
--
-- O QUE EXISTIA ANTES DAQUI: nada. Vale dizer em voz alta, porque é fácil olhar o produto e supor
-- que existia. A conta do aluno nasce do webhook do Guru, e o aceite dos documentos acontecia no
-- checkout do Guru, na base deles. A `/lista-de-espera` coletava nome, e-mail e telefone com o
-- consentimento sendo o próprio envio, e quem guardava o lead era o RD Station. Em nenhum dos dois
-- caminhos havia registro NOSSO de quem aceitou o quê, quando e em qual versão do texto. Pedir o log
-- a um fornecedor, no dia em que um titular reclamar, é a diferença entre responder em minutos e
-- responder em semanas.
--
-- ┌─ O QUE FAZ UM LOG DE CONSENTIMENTO VALER ALGUMA COISA ────────────────────────────────────────┐
-- │ Não é a data. É poder provar QUAL TEXTO a pessoa tinha na frente quando marcou a caixa. Uma    │
-- │ linha dizendo "fulano aceitou a política em 12/out" não responde nada se a política mudou três │
-- │ vezes desde então. Por isso são duas tabelas e não uma: `consent_documents` guarda as versões, │
-- │ e cada linha de `consents` aponta para uma delas e ainda carrega, congelada, a frase exata que  │
-- │ estava na tela.                                                                                │
-- └───────────────────────────────────────────────────────────────────────────────────────────────┘
--
-- Mesma família da `0014` (admin_audit) em três escolhas, pelos mesmos motivos: RLS ligada e sem
-- policy nenhuma, então para anon e authenticated estas tabelas não existem e só a service role
-- escreve; `on delete set null` no titular, para o registro sobreviver ao fim da conta; e o e-mail
-- congelado na linha, porque consentimento que some junto com quem consentiu não prova nada.
--
-- A diferença em relação à `0014` é que aqui a imutabilidade é imposta pelo BANCO, por trigger, e
-- não só por convenção. Rastro de admin é operacional; log de consentimento é prova. UPDATE e DELETE
-- levantam exceção, inclusive para a service role, que ignora RLS mas não ignora trigger. Quem tem
-- o dono do banco na mão consegue dropar o trigger, claro, e isso fica registrado no histórico de
-- migrations, que é exatamente onde se quer que fique.

-- ------------------------------------------------------------
-- As versões dos documentos
-- ------------------------------------------------------------
--
-- `sha256` fica nulo até o texto estar publicado e congelado. Quando estiver, o hash é o que fecha a
-- prova: com ele dá para pegar o arquivo de hoje, calcular e dizer se é o mesmo que a pessoa leu.
-- `url` também nasce nulo porque o endereço final depende da publicação em blocktrends.abril.com.br.
--
-- `vigente_desde` e não um booleano `ativo`: booleano precisa de alguém para desligar e vira mentira
-- no dia em que esquecerem. A versão vigente é sempre a de maior `vigente_desde` já passada, o que
-- também permite agendar a entrada de um texto novo.

create table if not exists consent_documents (
  id            uuid primary key default gen_random_uuid(),
  tipo          text not null check (tipo in ('politica', 'termos')),
  versao        text not null,                    -- data ISO da revisão: '2026-09-28'
  url           text,                             -- nulo até publicar no domínio final
  sha256        text,                             -- nulo até o texto estar congelado
  vigente_desde timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  unique (tipo, versao)
);
create index if not exists consent_documents_vigencia_idx
  on consent_documents(tipo, vigente_desde desc);

alter table consent_documents enable row level security;

comment on table consent_documents is
  'Versoes da Politica de Privacidade e dos Termos de Uso. A vigente e a de maior vigente_desde ja passada.';
comment on column consent_documents.sha256 is
  'Hash do texto publicado. Com ele se prova que o documento de hoje e o mesmo que o titular leu.';

-- ------------------------------------------------------------
-- O log em si
-- ------------------------------------------------------------
--
-- `user_id` é nulo de propósito e isso não é frouxidão: o consentimento da `/lista-de-espera` vem de
-- alguém que ainda não comprou e por definição não tem conta. O que nunca é nulo é o `email`, que é
-- como o titular se identifica quando exerce um direito dele.
--
-- `texto` guarda a frase que estava na tela, inteira, e não um código. Parece redundante com
-- `documento_versao` e não é: a versão diz qual documento, o texto diz o que a caixa de aceite
-- prometia. As duas coisas mudam em ritmos diferentes.
--
-- `ip` é `inet` e não `text` porque o Postgres valida o formato e a coluna passa a ser consultável
-- por faixa. O aplicativo manda nulo quando não consegue um endereço confiável: preferimos um
-- consentimento registrado sem IP a um insert que estoura e não registra consentimento nenhum.
--
-- SEM UNIQUE POR (user_id, documento_tipo). Foi tentador e está errado: a pessoa aceita de novo
-- quando a versão muda, e append-only significa que o aceite de ontem continua lá ao lado do de
-- hoje. Quem quer "o aceite vigente" pede o mais recente; quem quer a história pede todos.

create table if not exists consents (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  email            text not null,                 -- congelado: o e-mail de então, nao o de hoje
  nome             text,
  origem           text not null,                 -- 'primeiro-acesso', 'lista-de-espera', 'signup-homolog'
  documento_id     uuid references consent_documents(id),
  documento_tipo   text not null check (documento_tipo in ('politica', 'termos')),
  documento_versao text not null,
  texto            text not null,                 -- a frase exata exibida ao lado da caixa
  ip               inet,
  user_agent       text,
  guru_order_id    text,                          -- amarra o aceite ao pedido, quando ha um
  created_at       timestamptz not null default now()
);
create index if not exists consents_data_idx    on consents(created_at desc);
create index if not exists consents_user_idx    on consents(user_id);
create index if not exists consents_email_idx   on consents(lower(email));

alter table consents enable row level security;

comment on table consents is
  'Log append-only de aceite dos documentos. Escrita so pela service role; UPDATE e DELETE bloqueados por trigger.';
comment on column consents.user_id is
  'Nulo quando o titular ainda nao tem conta (lista de espera) ou quando a conta foi apagada depois.';
comment on column consents.texto is
  'A frase de aceite como estava na tela. A versao diz qual documento; isto diz o que a caixa prometia.';

-- ------------------------------------------------------------
-- Append-only de verdade
-- ------------------------------------------------------------
--
-- ARMADILHA: RLS não fecha isto. A service role ignora policy, e é ela que escreve. O que impede a
-- linha de ser reescrita é o trigger, que roda para todo mundo. Sem ele, "append-only" seria uma
-- palavra no comentário da tabela.
--
-- `tg_op` na mensagem para o erro dizer qual operação foi barrada, em vez de um "não pode" genérico
-- que manda quem está depurando ler esta migration para descobrir o que aconteceu.

create or replace function consents_append_only()
returns trigger language plpgsql as $$
begin
  raise exception
    'consents e append-only: % bloqueado. Consentimento se revoga inserindo uma revogacao, nao apagando o aceite.',
    tg_op;
end;
$$;

drop trigger if exists consents_sem_update on consents;
create trigger consents_sem_update before update on consents
  for each row execute function consents_append_only();

drop trigger if exists consents_sem_delete on consents;
create trigger consents_sem_delete before delete on consents
  for each row execute function consents_append_only();

-- ------------------------------------------------------------
-- Leitura pelo painel
-- ------------------------------------------------------------
--
-- Mesma família da `0015` e pelos mesmos motivos: `security definer` porque precisa de `auth.users`
-- para o e-mail atual do titular, e revogada de PUBLIC antes de anon e authenticated.
--
-- ARMADILHA JÁ REGISTRADA SEIS VEZES NESTE SCHEMA: `revoke ... from anon, authenticated` não fecha
-- função, porque o EXECUTE vem de PUBLIC. O revoke de PUBLIC é o que fecha.
--
-- `email_atual` ao lado do `email` congelado: quando os dois diferem, alguém trocou o e-mail de
-- login depois de aceitar, e essa é justamente a pergunta que aparece quando um titular escreve de
-- um endereço que não está no log.

create or replace function listar_consentimentos(termo text default '', limite int default 500)
returns table (
  id               uuid,
  user_id          uuid,
  email            text,
  email_atual      text,
  nome             text,
  origem           text,
  documento_tipo   text,
  documento_versao text,
  texto            text,
  ip               text,
  user_agent       text,
  guru_order_id    text,
  created_at       timestamptz
)
language sql stable security definer set search_path = public as $$
  select c.id,
         c.user_id,
         c.email,
         u.email::text,
         c.nome,
         c.origem,
         c.documento_tipo,
         c.documento_versao,
         c.texto,
         host(c.ip),
         c.user_agent,
         c.guru_order_id,
         c.created_at
  from consents c
  left join auth.users u on u.id = c.user_id
  where termo = ''
     or c.email                     ilike '%' || termo || '%'
     or coalesce(u.email::text, '') ilike '%' || termo || '%'
     or coalesce(c.nome, '')        ilike '%' || termo || '%'
     or coalesce(c.guru_order_id, '') ilike '%' || termo || '%'
     or c.origem                    ilike '%' || termo || '%'
  order by c.created_at desc
  limit least(greatest(limite, 1), 5000);
$$;

revoke execute on function listar_consentimentos(text, int) from public;
revoke execute on function listar_consentimentos(text, int) from anon, authenticated;

-- ------------------------------------------------------------
-- Semeadura das versões de hoje
-- ------------------------------------------------------------
--
-- A versão é a data da revisão que foi para a Abril. Quando o texto for publicado no domínio final,
-- é aqui que entram `url` e `sha256`, por UPDATE nesta tabela, que não tem trigger de imutabilidade
-- justamente porque a versão é um cadastro, não um fato consumado.

insert into consent_documents (tipo, versao, vigente_desde)
values ('politica', '2026-09-28', now()),
       ('termos',   '2026-09-28', now())
on conflict (tipo, versao) do nothing;


-- ================================================================
-- 0024_liberacao_por_conclusao.sql
-- ================================================================
-- ============================================================
-- 0024: Liberação por conclusão de módulo, esteira semanal nova e RLS do conteúdo (29/set/2026)
-- ============================================================
--
-- Três pedidos do Pedro, uma migration, porque os três mexem na mesma regra:
--
--   1. Um quinto tipo de regra, `apos_modulo`: o módulo abre quando o aluno CONCLUI outro (todas
--      as aulas dele), mais N dias opcionais. É o que o Cademi oferece e o que ele quer poder
--      escolher pela tela de Liberação, módulo a módulo.
--   2. A esteira muda: Módulo 0 ("Comece por aqui") no ato e o Módulo I só uma semana depois da
--      matrícula (II em 14 dias, III em 21, IV em 28). Até aqui o 0 e o I abriam juntos.
--   3. A trava sai do código e desce também para o banco. Até aqui a liberação era conferida só
--      nas páginas e actions; a RLS de `lessons` e `materials` exigia apenas `has_active_access()`,
--      então um aluno ativo listava pelo PostgREST as aulas de módulo ainda fechado, com o
--      `panda_video_id` e o caminho do `arquivo` de cada material. A esteira era respeitada por
--      quem usava a tela, e só por ele.
--
-- A regra em TypeScript (`lib/liberacao.ts`, com self-check) continua sendo a que as telas usam.
-- A função `modulo_aberto()` abaixo é a MESMA regra reescrita em SQL, e as duas precisam andar
-- juntas: mudou uma, muda a outra. Não há como uma chamar a outra, e a duplicação é o preço de a
-- trava valer também para quem não passa pela tela.
--
-- Idempotente onde dá: `if not exists`, `create or replace`, `drop ... if exists`, e os checks
-- antigos (criados sem nome na 0001 e na 0016) são achados pelo catálogo em vez de pelo nome que o
-- Postgres inventou para eles.

-- ------------------------------------------------------------
-- 1. `modules.ord` passa de 0..4 para 0..20
-- ------------------------------------------------------------
-- O curso tem cinco módulos hoje, mas o limite de 4 era do desenho da primeira turma, não do
-- produto: com regra por conclusão, módulo extra (bônus, aula ao vivo gravada) deixa de ser raro.
-- 20 é teto de sanidade, não de negócio. O `check:curriculo` segue garantindo ords sem buraco.
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.modules'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%ord%'
  loop
    execute format('alter table public.modules drop constraint %I', c.conname);
  end loop;
end $$;

alter table modules add constraint modules_ord_0_20 check (ord between 0 and 20);

-- ------------------------------------------------------------
-- 2. `release_rules`: tipo `apos_modulo` e a coluna do pré-requisito
-- ------------------------------------------------------------
-- `depende_de_ord` guarda o ORD do módulo pré-requisito, não o uuid. O ord é o que o aluno vê
-- ("Módulo I"), o que a URL usa e o que as regras em TypeScript indexam; com uuid, cada leitor
-- precisaria de mais um join só para traduzir.
--
-- `dias` é reaproveitada: em `dias` continua sendo "dias após a matrícula", e em `apos_modulo`
-- vira "dias após concluir o pré-requisito" (0 = no ato da conclusão). Sem default na coluna de
-- propósito: um default 0 faria `insert ... (tipo) values ('livre')` bater no check de forma.
alter table release_rules add column if not exists depende_de_ord smallint;

comment on column release_rules.depende_de_ord is
  'So em apos_modulo: ord do modulo que o aluno precisa concluir antes. Sempre menor que o ord do proprio modulo (trigger).';
comment on column release_rules.dias is
  'Em dias: dias apos o inicio_em da matricula. Em apos_modulo: dias apos concluir o pre-requisito (0 = no ato).';

-- Os checks de tipo e de forma nasceram sem nome na 0016; saem todos e voltam nomeados.
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.release_rules'::regclass and contype = 'c'
  loop
    execute format('alter table public.release_rules drop constraint %I', c.conname);
  end loop;
end $$;

alter table release_rules
  add constraint release_rules_tipo
    check (tipo in ('livre', 'em_breve', 'dias', 'data', 'apos_modulo')),
  add constraint release_rules_dias_faixa
    check (dias between 0 and 3650),
  add constraint release_rules_depende_faixa
    check (depende_de_ord between 0 and 20),
  -- Cada tipo carrega só os campos dele, como na 0016. `dias` agora serve a dois tipos.
  add constraint release_rules_forma_dias
    check ((tipo in ('dias', 'apos_modulo')) = (dias is not null)),
  add constraint release_rules_forma_data
    check ((tipo = 'data') = (abre_em is not null)),
  add constraint release_rules_forma_apos
    check ((tipo = 'apos_modulo') = (depende_de_ord is not null));

-- O pré-requisito é sempre um módulo ANTERIOR. Dependência de si mesmo ou para frente pode
-- fechar um ciclo (II depende do III, III depende do II), e ciclo tranca os dois módulos para
-- sempre sem erro nenhum na tela: o aluno só veria "após o Módulo III" eternamente. Check não
-- enxerga outra tabela, por isso trigger. A rota do admin valida antes, com mensagem boa; isto é
-- a segunda camada, para quem escrever por SQL ou por outra porta.
--
-- Limite conhecido: reordenar `modules.ord` depois não revalida as regras existentes. Hoje não
-- há tela que mude o ord de módulo; se um dia houver, ela precisa conferir isto.
create or replace function release_rules_valida_dependencia()
returns trigger language plpgsql set search_path = public as $$
declare v_ord smallint;
begin
  if new.tipo = 'apos_modulo' then
    select ord into v_ord from modules where id = new.module_id;
    if v_ord is null or new.depende_de_ord >= v_ord then
      raise exception 'apos_modulo precisa depender de um modulo anterior (modulo %, depende de %)',
        v_ord, new.depende_de_ord
        using errcode = 'check_violation';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists release_rules_valida_dependencia on release_rules;
create trigger release_rules_valida_dependencia
  before insert or update on release_rules
  for each row execute function release_rules_valida_dependencia();

-- Regra da casa (0021): nenhuma função fica com o EXECUTE que o Postgres dá a PUBLIC.
revoke execute on function release_rules_valida_dependencia() from public, anon, authenticated;

-- ------------------------------------------------------------
-- 3. A política ATIVA vira a esteira semanal nova: ord * 7 dias
-- ------------------------------------------------------------
-- Pedido explícito do Pedro para a política que vale hoje, seja qual for o nome dela: Módulo 0
-- em 0 dias (no ato), I em 7, II em 14, III em 21, IV em 28. É a mesma conta do `regraEsteira`
-- de `lib/liberacao.ts` e do `supabase/seed.sql`. Política em rascunho não é tocada: rascunho é
-- do admin. Upsert, para módulo que estivesse sem regra (e portanto em breve) entrar também.
--
-- Efeito para quem já está matriculado: a conta é a partir do `inicio_em` de cada um, então quem
-- comprou há mais de 7 dias não perde o Módulo I. Quem comprou nos últimos 7 dias perde o acesso
-- ao I até completar a primeira semana; o progresso dele não é apagado.
insert into release_rules (policy_id, module_id, tipo, dias, abre_em, depende_de_ord)
select p.id, m.id, 'dias', m.ord * 7, null, null
from release_policies p
cross join modules m
where p.ativa
on conflict (policy_id, module_id) do update
  set tipo = excluded.tipo,
      dias = excluded.dias,
      abre_em = null,
      depende_de_ord = null;

-- ------------------------------------------------------------
-- 4. `modulo_aberto()`: a regra de liberação em SQL, para a RLS
-- ------------------------------------------------------------
-- Espelho de `calendarioDoAluno` (lib/liberacao.ts) para o usuário da sessão (`auth.uid()`):
--
--   admin                       sempre aberto (o admin revisa conteúdo fechado pela área).
--   sem matrícula               fechado.
--   sem regra na política       fechado (REGRA_PADRAO, em breve).
--   em_breve                    fechado, mesmo com liberação total.
--   liberacao_total             aberto.
--   livre                       aberto.
--   dias                        now() >= inicio_em + dias * 24h.
--   data                        now() >= abre_em.
--   apos_modulo                 todas as aulas do módulo de ord `depende_de_ord` concluídas, e
--                               now() >= última conclusão + dias * 24h. Módulo sem aula nunca
--                               conta como concluído (senão abriria no ato).
--
-- Detalhes que precisam bater com o TypeScript, e por quê:
--   - A matrícula é a MAIS RECENTE por `expires_at`, como no `getMatricula`. Se estiver vencida,
--     quem barra é o `has_active_access()` da policy, não esta função.
--   - A política é a da matrícula (`release_policy_id`, 0017) ou, sem ela, a ativa.
--   - `dias * interval '24 hours'`, e não `interval 'N days'`: o TS soma milissegundos, e um
--     intervalo em dias segue o calendário do fuso da sessão (virada de horário de verão daria
--     uma hora de diferença entre a tela e o banco).
--   - Concluir é `progress.status = 'completed'`, e a data é `coalesce(completed_at, updated_at)`,
--     igual ao `getConclusoesDasAulas`.
--
-- SECURITY DEFINER porque lê `enrollments`, `release_rules` e `progress` de um jeito que a RLS do
-- aluno não permite (as regras de liberação não têm policy nenhuma, 0016). `stable` porque não
-- escreve e o resultado não muda dentro de uma consulta. search_path fixo, como todas as outras.
create or replace function modulo_aberto(p_module_id uuid)
returns boolean
language plpgsql stable security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_inicio timestamptz;
  v_total_livre boolean;
  v_politica uuid;
  v_tipo text;
  v_dias integer;
  v_abre_em timestamptz;
  v_depende smallint;
  v_aulas integer;
  v_feitas integer;
  v_ultima timestamptz;
begin
  if v_uid is null or p_module_id is null then
    return false;
  end if;

  if is_admin() then
    return true;
  end if;

  select e.inicio_em, e.liberacao_total, e.release_policy_id
    into v_inicio, v_total_livre, v_politica
  from enrollments e
  where e.user_id = v_uid
  order by e.expires_at desc
  limit 1;
  if not found then
    return false;
  end if;

  if v_politica is not null then
    select r.tipo, r.dias, r.abre_em, r.depende_de_ord
      into v_tipo, v_dias, v_abre_em, v_depende
    from release_rules r
    where r.policy_id = v_politica and r.module_id = p_module_id;
  else
    select r.tipo, r.dias, r.abre_em, r.depende_de_ord
      into v_tipo, v_dias, v_abre_em, v_depende
    from release_rules r
    join release_policies p on p.id = r.policy_id
    where p.ativa and r.module_id = p_module_id;
  end if;
  if not found or v_tipo = 'em_breve' then
    return false;
  end if;

  if v_total_livre then
    return true;
  end if;

  if v_tipo = 'livre' then
    return true;
  elsif v_tipo = 'dias' then
    return now() >= v_inicio + v_dias * interval '24 hours';
  elsif v_tipo = 'data' then
    return now() >= v_abre_em;
  elsif v_tipo = 'apos_modulo' then
    select count(l.id), count(pr.id), max(coalesce(pr.completed_at, pr.updated_at))
      into v_aulas, v_feitas, v_ultima
    from modules m
    join lessons l on l.module_id = m.id
    left join progress pr
      on pr.lesson_id = l.id and pr.user_id = v_uid and pr.status = 'completed'
    where m.ord = v_depende;
    if v_aulas = 0 or v_feitas < v_aulas then
      return false;
    end if;
    return now() >= v_ultima + coalesce(v_dias, 0) * interval '24 hours';
  end if;

  return false;
end $$;

comment on function modulo_aberto(uuid) is
  'Liberacao do modulo para auth.uid(). Espelho SQL de calendarioDoAluno (lib/liberacao.ts): mudou um, muda o outro.';

-- As policies avaliam a função no papel de quem consulta, então `authenticated` precisa do
-- EXECUTE. PUBLIC e anon saem, pela armadilha registrada no AGENTS.md: o revoke de PUBLIC sozinho
-- não fecha para anon no Supabase (default privileges dão grant direto), por isso os dois.
revoke execute on function modulo_aberto(uuid) from public, anon;
grant execute on function modulo_aberto(uuid) to authenticated;

-- ------------------------------------------------------------
-- 5. RLS de `lessons` e `materials`: acesso ativo E módulo aberto
-- ------------------------------------------------------------
-- O que continua funcionando, conferido antes de fechar:
--   - A home, a trilha e os cards de módulo fechado leem o currículo pela SERVICE ROLE
--     (`lib/curriculo.ts`), que ignora RLS: títulos e contagem de aulas de módulo fechado seguem
--     aparecendo. É de propósito, a LP publica esses títulos.
--   - `lib/materiais.ts` lê com a sessão do aluno, mas só na página da aula, que já barrou módulo
--     fechado antes; para o módulo aberto a policy nova devolve o mesmo que a antiga.
--   - O painel do admin lê tudo pela service role, e o admin também passa pelo `is_admin()`.
--   - `modules` fica como está: título de módulo não é segredo.
drop policy if exists lessons_read on lessons;
create policy lessons_read on lessons for select
  using ((has_active_access() and modulo_aberto(module_id)) or is_admin());

-- Material pode pendurar no módulo (apostila) ou na aula (resumo). Pela aula, o módulo sai de
-- `lessons`; essa subconsulta roda com a RLS de quem consulta, então aula de módulo fechado nem
-- aparece e o material dela cai no `modulo_aberto(null)`, que é falso. Mesmo resultado, por dois
-- caminhos.
drop policy if exists materials_read on materials;
create policy materials_read on materials for select
  using (
    (has_active_access()
      and modulo_aberto(coalesce(module_id, (select l.module_id from lessons l where l.id = lesson_id))))
    or is_admin()
  );


-- ================================================================
-- 0025_guru_eventos.sql
-- ================================================================
-- ============================================================
-- 0025: Vendas ligadas: eventos do Guru, busca de conta por e-mail, teto de pedidos e os
--        e-mails de acesso na identidade nova (29/set/2026)
-- ============================================================
--
-- Quatro peças que a auditoria pré-lançamento pediu juntas, porque as quatro estão no caminho de
-- uma compra real até o primeiro login:
--
-- 1. `guru_events`: o registro cru de cada entrega do webhook do Guru.
-- 2. `usuario_por_email`: acha a conta pelo e-mail sem listar o banco inteiro.
-- 3. `rate_limits` + `consumir_limite`: teto por IP e por e-mail que vale entre instâncias.
-- 4. `email_templates`: o boas-vindas reescrito e o template novo de redefinição de senha.
--
-- ARMADILHA JÁ REGISTRADA SETE VEZES NESTE SCHEMA (AGENTS.md): `revoke ... from anon,
-- authenticated` não fecha uma função, porque o EXECUTE vem de PUBLIC. Aqui as duas funções novas
-- levam o revoke de PUBLIC, de anon e de authenticated, e o grant explícito para `service_role`, que
-- é o único papel que as chama. Conferir com `has_function_privilege('anon', oid, 'EXECUTE')`.

-- ------------------------------------------------------------
-- 1. Eventos do webhook do Guru
-- ------------------------------------------------------------
--
-- POR QUE GUARDAR O CRU: no dia em que um comprador escrever "paguei e não recebi nada", a
-- pergunta é se o Guru chegou a avisar, com qual status, e o que a gente fez com isso. Sem esta
-- tabela a resposta dependia do log da função na Netlify, que some em dias e não se consulta por
-- e-mail. A rota grava a linha ANTES de processar e preenche `processed_at`/`erro` depois, então
-- uma entrega que derrubou o processamento fica visível como linha sem `processed_at`.
--
-- O `api_token` do Guru chega DENTRO do corpo (o Guru não assina com HMAC). A rota o remove antes
-- de gravar: guardar o token da conta em tabela seria espalhar a credencial por backups e CSVs.
--
-- `resultado` é o desfecho legível ('processado', 'ignorado: produto fora da lista', ...) e é
-- coluna separada de `erro` de propósito: evento ignorado não é erro, e misturar os dois faria o
-- filtro "o que falhou" trazer todo evento de boleto gerado.
--
-- RLS LIGADA E NENHUMA POLICY, como `email_templates` e `consents`: para anon e authenticated a
-- tabela não existe. O revoke de tabela é a segunda camada, para o dia em que alguém criar uma
-- policy larga sem lembrar do que mora aqui (dado pessoal de comprador).

create table if not exists guru_events (
  id             uuid primary key default gen_random_uuid(),
  request_id     text,                          -- cabeçalho X-Request-ID do Guru
  transaction_id text,                          -- `id` da transação no Guru = enrollments.guru_order_id
  status         text,                          -- approved, completed, refunded, chargeback, ...
  webhook_type   text,                          -- 'transaction' é o único que processamos
  email          text,
  payload        jsonb not null,                -- o corpo recebido, SEM o api_token
  received_at    timestamptz not null default now(),
  processed_at   timestamptz,
  resultado      text,
  erro           text
);
create index if not exists guru_events_recebido_idx  on guru_events(received_at desc);
create index if not exists guru_events_transacao_idx on guru_events(transaction_id);
create index if not exists guru_events_email_idx     on guru_events(lower(email));

alter table guru_events enable row level security;
revoke all on guru_events from anon, authenticated;

comment on table guru_events is
  'Cada entrega do webhook do Guru, crua e sem o api_token. Escrita e leitura so pela service role.';
comment on column guru_events.processed_at is
  'Nulo = a entrega chegou e o processamento nao terminou (erro ou timeout). O Guru reentrega.';

-- ------------------------------------------------------------
-- 2. Conta pelo e-mail
-- ------------------------------------------------------------
--
-- O webhook fazia `auth.admin.listUsers()` e procurava o e-mail na memória. Essa chamada devolve a
-- PRIMEIRA PÁGINA (50 contas por padrão), então a partir do 51º aluno a recompra de quem já tinha
-- conta falhava em "não foi possível criar nem localizar o usuário", o Guru reentregava, e falhava
-- de novo, para sempre. A `buscar_usuarios` (0004) é `ilike` com curinga, feita para a tela de
-- busca; aqui a pergunta é de igualdade e tem uma resposta só.
--
-- `lower()` dos dois lados: o Supabase grava o e-mail em minúsculas, mas conta criada à mão no
-- painel ou importada pode não estar, e o Guru manda o e-mail como o comprador digitou.

create or replace function usuario_por_email(p_email text)
returns uuid
language sql stable security definer set search_path = public as $$
  select u.id
  from auth.users u
  where lower(u.email) = lower(trim(p_email))
  order by u.created_at
  limit 1;
$$;

revoke execute on function usuario_por_email(text) from public;
revoke execute on function usuario_por_email(text) from anon, authenticated;
grant execute on function usuario_por_email(text) to service_role;

-- ------------------------------------------------------------
-- 3. Teto de pedidos, compartilhado entre instâncias
-- ------------------------------------------------------------
--
-- O teto da `/api/consentimento` era um Map em memória, e o comentário dele já avisava: cada
-- instância da Netlify tem o seu, e reinício zera. Para a recuperação de senha isso não serve, porque
-- cada pedido dispara um e-mail do nosso remetente, e reputação de remetente não volta com deploy.
--
-- Janela FIXA (o relógio é cortado em fatias de `janela_segundos`) e não deslizante: uma linha por
-- chave por janela, um upsert por pedido, e a pior borda é o dobro do teto em dois segundos
-- seguidos na virada da janela. Para robô de formulário, é o bastante.
--
-- A chave é texto livre montado pelo chamador ('senha:ip:1.2.3.4', 'senha:email:<hash>'). O
-- chamador manda o e-mail em hash, para esta tabela não virar mais um lugar com endereço pessoal.
--
-- `#variable_conflict use_column`: o parâmetro se chama `chave`, como a coluna, porque é o nome que
-- a API do Supabase expõe na chamada `rpc('consumir_limite', { chave, ... })`. Sem a diretiva, o
-- plpgsql acusa referência ambígua no `on conflict`.

create table if not exists rate_limits (
  chave    text        not null,
  janela   timestamptz not null,
  contagem int         not null default 0,
  primary key (chave, janela)
);

alter table rate_limits enable row level security;
revoke all on rate_limits from anon, authenticated;

comment on table rate_limits is
  'Contagem de pedidos por chave e janela fixa. So consumir_limite() escreve aqui.';

create or replace function consumir_limite(chave text, limite int, janela_segundos int)
returns boolean
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare
  passo  int := greatest(coalesce(janela_segundos, 60), 1);
  inicio timestamptz := to_timestamp(floor(extract(epoch from now()) / passo) * passo);
  atual  int;
begin
  insert into rate_limits (chave, janela, contagem)
  values (consumir_limite.chave, inicio, 1)
  on conflict (chave, janela) do update set contagem = rate_limits.contagem + 1
  returning contagem into atual;

  -- Faxina oportunista, em 1% das chamadas: sem ela a tabela cresce uma linha por IP por hora para
  -- sempre. Um dia de folga cobre a maior janela em uso (uma hora) com sobra.
  if random() < 0.01 then
    delete from rate_limits where janela < now() - interval '1 day';
  end if;

  return atual <= limite;
end;
$$;

revoke execute on function consumir_limite(text, int, int) from public;
revoke execute on function consumir_limite(text, int, int) from anon, authenticated;
grant execute on function consumir_limite(text, int, int) to service_role;

-- ------------------------------------------------------------
-- 4. Os e-mails de acesso
-- ------------------------------------------------------------
--
-- O boas-vindas é REESCRITO, e por isso `do update` e não `do nothing`, ao contrário da 0009: o
-- texto antigo mandava criar a senha num link sem dizer a validade nem por onde começar, e o link
-- agora é outro (recovery, 24 horas). Edição feita no painel antes desta
-- migration se perde, e é a intenção: o texto de lá descreve um fluxo que deixou de existir.
--
-- A redefinição é template NOVO. Até aqui ela saía pelo SMTP do Supabase Auth, com o template do
-- painel deles e o teto de 30 por hora do projeto inteiro. Agora sai pelo nosso envio.
--
-- A VALIDADE ESCRITA NOS DOIS É 24 HORAS, e isso não é descuido na redefinição: o Supabase tem UM
-- prazo para todo token de e-mail ("Email OTP Expiration"), e ele fica em 86400 segundos para o
-- link de boas-vindas aguentar o intervalo entre a compra e a primeira abertura da caixa. Escrever
-- "1 hora" na redefinição seria prometer um prazo que o sistema não aplica.
--
-- Copy com o checklist do docs/COPY.md: sem travessão, sem exclamação, número concreto. Cada linha
-- do corpo é um parágrafo (regra de `lib/email-render.ts`).

insert into email_templates (chave, assunto, corpo, cta, ativo, updated_at) values
  (
    'boas-vindas',
    'Seu acesso à Estratégia Internacional está pronto',
    E'{{nome}}, sua compra foi confirmada e a sua vaga na Estratégia Internacional está garantida.\n'
    'Para entrar, crie sua senha no botão abaixo. Depois comece pelo módulo zero, "Comece por aqui", que mostra como o curso funciona e por onde seguir.\n'
    'Este link é pessoal e vale por 24 horas. Se ele expirar, use "Esqueci minha senha" em blocktrends.abril.com.br/app/login e um link novo chega em instantes.\n'
    'Equipe Estratégia Internacional',
    'Criar minha senha e entrar',
    true,
    now()
  ),
  (
    'redefinicao-senha',
    'Redefina sua senha da Estratégia Internacional',
    E'{{nome}}, recebemos um pedido para criar uma senha nova na sua conta da Estratégia Internacional, e o botão abaixo leva direto para isso.\n'
    'O link vale por 24 horas e funciona uma vez só. Se você não fez esse pedido, pode ignorar este e-mail: sua senha atual continua valendo.\n'
    'Equipe Estratégia Internacional',
    'Criar nova senha',
    true,
    now()
  )
on conflict (chave) do update
  set assunto    = excluded.assunto,
      corpo      = excluded.corpo,
      cta        = excluded.cta,
      updated_at = excluded.updated_at;


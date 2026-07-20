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
revoke execute on function sortear_prova() from anon, authenticated;

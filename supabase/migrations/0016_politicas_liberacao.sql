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
with politica as (
  insert into release_policies (nome, ativa)
  values ('Esteira semanal', true)
  returning id
)
insert into release_rules (policy_id, module_id, tipo, dias)
select politica.id, m.id, 'dias', greatest(0, m.ord - 1) * 7
from modules m, politica;

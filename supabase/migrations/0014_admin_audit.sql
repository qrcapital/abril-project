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

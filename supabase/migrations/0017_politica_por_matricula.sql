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

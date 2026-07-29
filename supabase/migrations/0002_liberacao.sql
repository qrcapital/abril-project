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

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

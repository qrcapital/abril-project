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

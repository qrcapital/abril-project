-- Prova as regras do admin mestre (migration 0005) CONTRA O BANCO, dentro de uma transação que
-- é desfeita no fim. Nada aqui persiste.
--
--   npm run check:mestre
--
-- Existe pelo mesmo motivo do `check:rls`: a única prova que vale para regra de privilégio é
-- contra o banco. Um teste em TypeScript provaria a checagem da rota, que é o controle do caminho
-- do app; este prova o TRIGGER, que é o backstop de qualquer caminho direto.
--
-- COMO FORJA A SESSÃO: `auth.uid()` no Supabase lê `request.jwt.claims`, então basta um
-- `set_config` local. Tentar redefinir `auth.uid()` não funciona neste banco, porque a conexão
-- não é dona do schema `auth` ("permission denied for schema auth").
--
-- Ele NÃO fixa e-mail: pega três perfis quaisquer e monta o estado deles, porque quem são as
-- contas é irrelevante para a regra e a transação desfaz tudo. Assim o check roda em qualquer
-- ambiente, inclusive no `ei-prod` recém-provisionado.

\set ON_ERROR_STOP on
begin;

do $$
declare
  mestre uuid;
  comum  uuid;
  vitima uuid;
  falhas int := 0;
begin
  select id into mestre from profiles order by created_at, id offset 0 limit 1;
  select id into comum  from profiles order by created_at, id offset 1 limit 1;
  select id into vitima from profiles order by created_at, id offset 2 limit 1;
  if mestre is null or comum is null or vitima is null then
    raise exception 'o banco precisa de ao menos 3 perfis para este check; tem %',
      (select count(*) from profiles);
  end if;

  update profiles set is_admin = true,  is_master = true  where id = mestre;
  update profiles set is_admin = true,  is_master = false where id = comum;
  update profiles set is_admin = false, is_master = false where id = vitima;

  -- Passa a agir como o admin COMUM.
  perform set_config('request.jwt.claims', json_build_object('sub', comum::text)::text, true);
  if not is_admin() or is_master() then
    raise exception 'cenario nao montou: esperava admin comum, veio is_admin=% is_master=%',
      is_admin(), is_master();
  end if;

  begin
    update profiles set is_admin = false where id = mestre;
    raise notice 'FALHOU: admin comum revogou o mestre';
    falhas := falhas + 1;
  exception when insufficient_privilege then
    raise notice 'ok: admin comum NAO revoga o mestre';
  end;

  -- A forma REAL do ataque, e a mesma que a rota usa para revogar: limpar os dois campos de uma
  -- vez. Sem esta asserção o check passava e o caminho ficava aberto, porque o CHECK do banco só
  -- barra quando `is_master` fica pendurado sozinho.
  begin
    update profiles set is_admin = false, is_master = false where id = mestre;
    raise notice 'FALHOU: admin comum derrubou o mestre limpando os dois campos';
    falhas := falhas + 1;
  exception when insufficient_privilege then
    raise notice 'ok: admin comum NAO derruba o mestre nem limpando os dois campos';
  end;

  begin
    update profiles set is_master = true where id = comum;
    raise notice 'FALHOU: admin comum se promoveu a mestre';
    falhas := falhas + 1;
  exception when insufficient_privilege then
    raise notice 'ok: admin comum NAO se promove a mestre';
  end;

  begin
    update profiles set is_admin = true, is_master = true where id = vitima;
    raise notice 'FALHOU: admin comum criou um mestre novo';
    falhas := falhas + 1;
  exception when insufficient_privilege then
    raise notice 'ok: admin comum NAO cria mestre';
  end;

  -- O que o admin comum PRECISA continuar podendo. Sem esta asserção, "consertar" a regra
  -- apertando tudo passaria no teste e quebraria o produto.
  begin
    update profiles set is_admin = true where id = vitima;
    raise notice 'ok: admin comum AINDA promove admin comum';
  exception when insufficient_privilege then
    raise notice 'FALHOU: admin comum perdeu o que devia poder fazer';
    falhas := falhas + 1;
  end;

  -- Agora como o MESTRE: ele tem que conseguir o que o outro não conseguiu.
  perform set_config('request.jwt.claims', json_build_object('sub', mestre::text)::text, true);
  begin
    update profiles set is_admin = true, is_master = true where id = comum;
    raise notice 'ok: mestre cria outro mestre';
  exception when insufficient_privilege then
    raise notice 'FALHOU: mestre nao consegue criar mestre';
    falhas := falhas + 1;
  end;

  -- O CHECK do banco, que sustenta "mestre implica admin".
  begin
    update profiles set is_admin = false, is_master = true where id = comum;
    raise notice 'FALHOU: banco aceitou mestre que nao e admin';
    falhas := falhas + 1;
  exception when check_violation then
    raise notice 'ok: banco recusa mestre que nao e admin';
  end;

  if falhas > 0 then
    raise exception 'mestre-check: % falha(s)', falhas;
  end if;
  raise notice 'mestre-check: ok (7 asercoes)';
end $$;

rollback;

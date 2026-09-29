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

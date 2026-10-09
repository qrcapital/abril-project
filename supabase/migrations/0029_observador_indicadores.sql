-- ============================================================
-- 0029: Papel de observador e o painel de indicadores (06/out/2026)
-- ============================================================
--
-- Pedido do Marcelo: pessoas de fora do time (gente da Abril, por exemplo) precisam acompanhar os
-- números do projeto sem ver aluno nenhum. Até aqui havia dois papéis, admin e aluno, e o admin vê
-- tudo: lista de alunos, e-mails, telefones, consentimentos, auditoria. Dar admin a quem só quer
-- os números seria abrir dado pessoal de todos os compradores para conferir uma soma.
--
-- O NOME É "OBSERVADOR". Diz o que a pessoa faz no painel (olha, não opera), e "parceiro" já
-- significa outra coisa neste projeto (os parceiros da folha do certificado, os docentes).
--
-- TRÊS PEÇAS:
--
-- 1. `profiles.is_observer` + `is_observer()`: o papel. Coluna à parte, como o `is_master` da 0005,
--    e pelo mesmo motivo: `is_admin()` sustenta as policies de RLS, e um enum de papel obrigaria a
--    revalidar todas. Aqui o contrário também é verdade e é o que torna o papel seguro: NENHUMA
--    policy passa a conhecer o observador. Para a RLS ele é um usuário logado comum, que só lê as
--    próprias linhas. Ele não ganha leitura de tabela nenhuma.
-- 2. `painel_indicadores()`: a ÚNICA porta de dado do observador. Security definer, confere o papel
--    lá dentro e devolve só contagens e somas, em jsonb. Nenhuma linha de aluno sai daqui.
-- 3. `listar_observadores()` e `acesso_painel()`: a tela de Equipe e o destino do login.
--
-- ARMADILHA JÁ REGISTRADA NESTE SCHEMA (AGENTS.md): `revoke ... from anon, authenticated` não fecha
-- função, porque o EXECUTE vem de PUBLIC. Toda função nova aqui leva o revoke de PUBLIC e o grant
-- explícito para quem chama. Conferir com `has_function_privilege('anon', oid, 'EXECUTE')`.
--
-- Rodar inteira no SQL editor do Supabase. É idempotente (`if not exists`, `create or replace`).

-- ------------------------------------------------------------
-- 1. O papel
-- ------------------------------------------------------------

alter table profiles
  add column if not exists is_observer boolean not null default false;

-- Observador e admin são excludentes. Admin já vê o painel de indicadores, então a combinação não
-- acrescenta nada e só criaria a dúvida de qual dos dois vale. Promover um observador a admin limpa
-- a marca de observador (a rota de Equipe faz isso na mesma gravação).
alter table profiles drop constraint if exists profiles_observador_nao_admin;
alter table profiles
  add constraint profiles_observador_nao_admin check (not (is_observer and is_admin));

comment on column profiles.is_observer is
  'Observador: entra no /admin e ve so o painel de indicadores (agregados). Nenhuma policy de RLS le esta coluna.';

-- Espelha `is_admin()` e `is_master()`: security definer para ler a própria linha sem depender de
-- policy, `stable` porque não escreve, e só conta sobre quem chama.
create or replace function is_observer()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_observer from profiles where id = auth.uid()), false);
$$;

revoke execute on function is_observer() from public;
revoke execute on function is_observer() from anon;
grant execute on function is_observer() to authenticated;

-- Uma pergunta só para o destino do login: "esta conta entra no /admin?". Sem ela, a tela de login
-- faria duas idas ao banco (is_admin e depois is_observer) para decidir um redirect.
create or replace function acesso_painel()
returns boolean language sql stable security definer set search_path = public as $$
  select is_admin() or is_observer();
$$;

revoke execute on function acesso_painel() from public;
revoke execute on function acesso_painel() from anon;
grant execute on function acesso_painel() to authenticated;

-- ------------------------------------------------------------
-- O trigger da 0003/0005, agora guardando também o observador
-- ------------------------------------------------------------
--
-- O aluno já não tem UPDATE em `profiles` (0003, camada 1), então hoje ninguém se dá o papel pela
-- API. Este é o backstop para o dia em que alguém reabrir o UPDATE: conceder ou tirar observador é
-- coisa de admin ou da service role. As regras de admin e mestre são as da 0005, sem mudança.
create or replace function guarda_is_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- service role, migração, webhook: sem sessão, passa. É o caminho do app e o do bootstrap.
  if auth.uid() is null then
    return new;
  end if;

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
    if old.is_master and not is_master() then
      raise exception 'o acesso de um admin mestre so pode ser alterado por outro admin mestre'
        using errcode = '42501';
    end if;
  end if;

  -- Novo na 0029. Um observador não se promove nem promove ninguém: ele não é admin.
  if new.is_observer is distinct from old.is_observer then
    if not is_admin() then
      raise exception 'is_observer so pode ser alterado por um admin ou pela service role'
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

-- ------------------------------------------------------------
-- 2. Quem é observador hoje (tela de Equipe)
-- ------------------------------------------------------------
--
-- Só a service role, como `listar_admins` (0004/0005): lê `auth.users`. A autorização é a guarda
-- de admin da tela de Equipe, em TypeScript.
create or replace function listar_observadores()
returns table (id uuid, email text, nome text, criado_em timestamptz)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text, p.nome, u.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.is_observer
  order by u.email;
$$;

revoke execute on function listar_observadores() from public;
revoke execute on function listar_observadores() from anon, authenticated;
grant execute on function listar_observadores() to service_role;

-- ------------------------------------------------------------
-- 3. Os números do painel
-- ------------------------------------------------------------
--
-- Valor numérico de um campo do payload do Guru, que pode chegar como número JSON ou como texto.
-- Texto fora do formato (moeda formatada, vazio) vira nulo em vez de derrubar a soma inteira.
create or replace function guru_numero(v jsonb)
returns numeric language sql immutable set search_path = public as $$
  select case
    when v is null then null
    when jsonb_typeof(v) = 'number' then (v #>> '{}')::numeric
    when jsonb_typeof(v) = 'string' and (v #>> '{}') ~ '^\s*-?[0-9]+([.,][0-9]+)?\s*$'
      then replace(trim(v #>> '{}'), ',', '.')::numeric
    else null
  end;
$$;

revoke execute on function guru_numero(jsonb) from public;
revoke execute on function guru_numero(jsonb) from anon, authenticated;

-- A porta de dado do observador (e do admin, na mesma tela).
--
-- QUEM PODE CHAMAR: `authenticated`, com o cliente da própria sessão. A função confere
-- `is_admin() or is_observer()` na primeira linha e recusa o resto com 42501. É por isso que a
-- tela de indicadores NÃO usa a service role: a autorização mora no banco, junto do dado, e um
-- observador que chame a RPC direto pela API recebe exatamente o que a tela mostra, nada além.
-- Na service role `auth.uid()` é nulo e a chamada é recusada, o que está certo: ninguém precisa
-- destes números sem uma pessoa do outro lado.
--
-- O QUE SAI: só contagens, somas e médias. Nenhum id, e-mail, nome ou data de pessoa. O único texto
-- livre é o título dos módulos, que é conteúdo do curso.
--
-- DE ONDE VEM O DINHEIRO: de `guru_events.payload` (0025), o corpo cru de cada entrega do Guru. Para
-- cada transação que virou matrícula (`enrollments.guru_order_id`), vale o último evento aprovado
-- (`approved`/`completed`) processado. Bruto é o primeiro valor presente entre `payment.total`,
-- `payment.gross`, `values.total` e `invoice.value`; líquido, entre `payment.net` e `values.net`. Os
-- caminhos cobrem o formato documentado e o alternativo, como o `normalizarGuru` de `lib/guru.ts`
-- faz com os outros campos; o envelope `data` também é aceito. Transação cujo último evento
-- processado é `refunded` ou `chargeback` sai das somas e entra em "estornos".
-- Sem nenhum valor líquido no payload, `liquido` volta nulo e a tela diz "indisponível".
create or replace function painel_indicadores()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  -- `saida` e não `resultado`: `guru_events` tem uma coluna `resultado`, e em plpgsql o nome
  -- repetido vira "column reference is ambiguous" na primeira chamada.
  saida jsonb;
begin
  if not (is_admin() or is_observer()) then
    raise exception 'painel_indicadores: acesso restrito' using errcode = '42501';
  end if;

  with
  aulas_gate as (
    select l.id, l.module_id from lessons l where l.conta_no_gate
  ),
  matriculados as (
    select distinct e.user_id from enrollments e
  ),
  feitas as (
    -- Aulas do gate concluídas, só de quem tem ou teve matrícula.
    select p.user_id, a.module_id
    from progress p
    join aulas_gate a on a.id = p.lesson_id
    join matriculados m on m.user_id = p.user_id
    where p.status = 'completed'
  ),
  por_aluno as (
    select user_id, count(*) as n from feitas group by user_id
  ),
  -- Vendas: matrícula com pedido do Guru. As sem pedido são cortesia ou cadastro de homologação, e
  -- as `manual-*` (09/out/2026) são alunos adicionados pelo admin, que também não são venda.
  pagas as (
    select e.guru_order_id, e.purchased_at from enrollments e
    where e.guru_order_id is not null and e.guru_order_id not like 'manual-%'
  ),
  ultimo_status as (
    select distinct on (g.transaction_id) g.transaction_id, g.status
    from guru_events g
    where g.transaction_id is not null and g.resultado = 'processado'
    order by g.transaction_id, g.received_at desc
  ),
  valores as (
    select distinct on (g.transaction_id)
      g.transaction_id,
      coalesce(
        guru_numero(d.v #> '{payment,total}'),
        guru_numero(d.v #> '{payment,gross}'),
        guru_numero(d.v #> '{values,total}'),
        guru_numero(d.v #> '{invoice,value}')
      ) as bruto,
      coalesce(
        guru_numero(d.v #> '{payment,net}'),
        guru_numero(d.v #> '{values,net}')
      ) as liquido
    from guru_events g
    cross join lateral (
      select case when jsonb_typeof(g.payload -> 'data') = 'object' then g.payload -> 'data'
                  else g.payload end as v
    ) d
    where g.transaction_id is not null
      and g.resultado = 'processado'
      and g.status in ('approved', 'completed')
    order by g.transaction_id, g.received_at desc
  ),
  vendas as (
    select
      p.guru_order_id,
      p.purchased_at,
      coalesce(u.status in ('refunded', 'chargeback'), false) as estornada,
      v.bruto,
      v.liquido
    from pagas p
    left join ultimo_status u on u.transaction_id = p.guru_order_id
    left join valores v on v.transaction_id = p.guru_order_id
  ),
  dias as (
    select generate_series(
      (now() at time zone 'America/Sao_Paulo')::date - 13,
      (now() at time zone 'America/Sao_Paulo')::date,
      interval '1 day'
    )::date as dia
  )
  select jsonb_build_object(
    'gerado_em', now(),

    'vendas', jsonb_build_object(
      'total',            (select count(*) from vendas),
      'estornos',         (select count(*) from vendas where estornada),
      'validas',          (select count(*) from vendas where not estornada),
      'com_valor',        (select count(*) from vendas where not estornada and bruto is not null),
      'com_liquido',      (select count(*) from vendas where not estornada and liquido is not null),
      'bruto',            (select sum(bruto) from vendas where not estornada),
      'liquido',          (select sum(liquido) from vendas where not estornada),
      'cortesias',        (select count(*) from enrollments
                            where guru_order_id is null or guru_order_id like 'manual-%'),
      'por_dia', (
        select coalesce(jsonb_agg(jsonb_build_object('dia', d.dia, 'n', coalesce(c.n, 0)) order by d.dia), '[]'::jsonb)
        from dias d
        left join (
          select (purchased_at at time zone 'America/Sao_Paulo')::date as dia, count(*) as n
          from vendas where not estornada group by 1
        ) c on c.dia = d.dia
      )
    ),

    'alunos', jsonb_build_object(
      'matriculados',   (select count(*) from matriculados),
      'acesso_ativo',   (select count(distinct user_id) from enrollments
                          where status = 'active' and expires_at > now()),
      'comecaram',      (select count(distinct p.user_id) from progress p
                          join matriculados m on m.user_id = p.user_id),
      'ativos_7d',      (select count(distinct p.user_id) from progress p
                          join matriculados m on m.user_id = p.user_id
                          where p.updated_at > now() - interval '7 days'),
      'concluintes',    (select count(*) from por_aluno
                          where (select count(*) from aulas_gate) > 0
                            and n >= (select count(*) from aulas_gate)),
      'certificados',   (select count(*) from certificates)
    ),

    'aulas', jsonb_build_object(
      'total',      (select count(*) from aulas_gate),
      'concluidas', (select count(*) from feitas)
    ),

    'modulos', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'ord', m.ord,
        'titulo', m.titulo,
        'aulas', (select count(*) from aulas_gate a where a.module_id = m.id),
        'concluidas', (select count(*) from feitas f where f.module_id = m.id)
      ) order by m.ord), '[]'::jsonb)
      from modules m
    ),

    -- Saúde da integração, em contagem: se o webhook está recebendo e se está processando.
    'guru', jsonb_build_object(
      'eventos',      (select count(*) from guru_events),
      'eventos_7d',   (select count(*) from guru_events where received_at > now() - interval '7 days'),
      'processados',  (select count(*) from guru_events where resultado = 'processado'),
      'erros',        (select count(*) from guru_events where erro is not null),
      'pendentes',    (select count(*) from guru_events
                        where processed_at is null and received_at < now() - interval '10 minutes'),
      'ultimo',       (select max(received_at) from guru_events)
    )
  )
  into saida;

  return saida;
end;
$$;

revoke execute on function painel_indicadores() from public;
revoke execute on function painel_indicadores() from anon;
grant execute on function painel_indicadores() to authenticated;

comment on function painel_indicadores() is
  'Agregados do projeto para admin e observador. So contagens e somas; recusa quem nao e admin nem observador.';

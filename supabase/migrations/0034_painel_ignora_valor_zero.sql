-- ============================================================
-- 0034: painel de indicadores ignora venda de valor zero (09/out/2026)
-- ============================================================
--
-- Pedido do Marcelo: as compras com cupom de 100% (testes do fluxo de compra) entravam como venda e
-- derrubavam o ticket médio. Agora venda cujo valor bruto é ZERO sai de "vendas" (contagem, somas,
-- vendas por dia) e entra em "cortesias", junto das matrículas sem pedido e das `manual-*`.
-- Venda sem valor conhecido (bruto nulo) continua contando como venda, como antes: ali o problema
-- é o payload, não o preço. E só é venda a matrícula cujo pedido tem evento do Guru processado: a
-- `interno-admin-marcelo` (matrícula do admin criada à mão em 30/set) contava como venda sem valor.
-- Cortesias passam a ser simplesmente as matrículas que não são venda.
--
-- Rodar inteira no SQL editor. Só troca a função (create or replace); nada de dado muda.

create or replace function painel_indicadores()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
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
    select p.user_id, a.module_id
    from progress p
    join aulas_gate a on a.id = p.lesson_id
    join matriculados m on m.user_id = p.user_id
    where p.status = 'completed'
  ),
  por_aluno as (
    select user_id, count(*) as n from feitas group by user_id
  ),
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
    where u.transaction_id is not null and coalesce(v.bruto, -1) <> 0
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
      'cortesias',        (select count(*) from enrollments) - (select count(*) from vendas),
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
  'Agregados do projeto para admin e observador. So contagens e somas; recusa quem nao e admin nem observador. Venda de valor zero conta como cortesia (0034).';

notify pgrst, 'reload schema';

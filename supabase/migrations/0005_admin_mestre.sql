-- ============================================================
-- 0005 — Admin mestre (dois níveis de admin)
-- ============================================================
--
-- Pedido pelo Pedro em 30/jul/2026, depois de testar a tela de Equipe: um **admin mestre**, e os
-- outros admins podem fazer tudo menos mexer no acesso dele.
--
-- POR QUE UMA SEGUNDA COLUNA e não um enum `papel`: `is_admin()` sustenta **dez policies** de RLS
-- e o trigger da `0003`. Trocar por enum obrigaria a reescrever a função e revalidar as dez, com
-- risco alto e ganho nenhum. `is_master` é ortogonal: quem é mestre também é admin, e nenhuma
-- policy existente precisa saber que a coluna existe.
--
-- A regra "mestre implica admin" fica no banco como CHECK, e não como acordo de cavalheiros: sem
-- ela o estado (is_master=true, is_admin=false) é representável, e aí um mestre não entra no
-- painel mas ninguém consegue mexer nele.

alter table profiles
  add column if not exists is_master boolean not null default false;

alter table profiles drop constraint if exists profiles_master_implica_admin;
alter table profiles
  add constraint profiles_master_implica_admin check (not is_master or is_admin);

-- Espelha `is_admin()`, inclusive nas escolhas: `security definer` para ler a própria linha sem
-- depender de policy, e `stable` porque não escreve.
create or replace function is_master()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_master from profiles where id = auth.uid()), false);
$$;

-- ATENÇÃO à armadilha já registrada duas vezes neste schema: `revoke` de anon/authenticated não
-- fecha função, porque o EXECUTE vem de PUBLIC. Aqui a intenção é o CONTRÁRIO: `authenticated`
-- PRECISA chamar, porque `lib/admin.ts` pergunta "eu sou mestre?" com o cliente anon, do mesmo
-- jeito que já pergunta `is_admin()`. E a função só conta sobre a PRÓPRIA linha de quem chama,
-- então não há o que vazar.
grant execute on function is_master() to authenticated;

-- ============================================================
-- O trigger da 0003, agora ciente dos dois níveis
-- ============================================================
--
-- Este é o BACKSTOP, não o controle principal. O caminho do app escreve com a **service role**,
-- onde `auth.uid()` é null e este trigger passa direto de propósito; quem barra ali é a checagem
-- em TypeScript do `app/admin/api/papel/route.ts`. As duas implementam as MESMAS regras, e a
-- duplicação é consciente: o trigger não tem como enxergar a intenção do app, e sem ele qualquer
-- caminho direto ao banco (psql de alguém, uma policy reaberta por engano no futuro) ficaria sem
-- regra nenhuma. É a mesma razão pela qual a `0003` criou o trigger mesmo com o UPDATE revogado.
create or replace function guarda_is_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- service role, migração, webhook: sem sessão, passa. É o caminho do app e o do bootstrap.
  if auth.uid() is null then
    return new;
  end if;

  -- Conceder ou tirar o próprio nível de mestre é privilégio de mestre. Sem esta regra um admin
  -- comum se promoveria a mestre e a distinção não existiria.
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

    -- O pedido do Pedro, na camada do banco: admin comum não mexe no acesso de um mestre.
    -- `old.is_master` e não `new`: o que importa é o que a linha ERA quando alguém a atacou.
    if old.is_master and not is_master() then
      raise exception 'o acesso de um admin mestre so pode ser alterado por outro admin mestre'
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

-- ============================================================
-- As duas funções de leitura da tela de Equipe, agora com o nível
-- ============================================================
--
-- `create or replace` não muda tipo de retorno, então as duas precisam cair primeiro.

drop function if exists buscar_usuarios(text, int);
create or replace function buscar_usuarios(termo text, limite int default 20)
returns table (
  id uuid, email text, nome text, is_admin boolean, is_master boolean, criado_em timestamptz
)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text, p.nome,
         coalesce(p.is_admin, false), coalesce(p.is_master, false), u.created_at
  from auth.users u
  left join public.profiles p on p.id = u.id
  where termo <> '' and u.email ilike '%' || termo || '%'
  order by (u.email = termo) desc, u.email
  limit least(greatest(limite, 1), 100);
$$;
revoke execute on function buscar_usuarios(text, int) from public;
revoke execute on function buscar_usuarios(text, int) from anon, authenticated;

drop function if exists listar_admins();
create or replace function listar_admins()
returns table (id uuid, email text, nome text, is_master boolean, criado_em timestamptz)
language sql stable security definer set search_path = public as $$
  select u.id, u.email::text, p.nome, p.is_master, u.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.is_admin
  -- Mestre primeiro: é quem responde por quem, e a lista é curta.
  order by p.is_master desc, u.email;
$$;
revoke execute on function listar_admins() from public;
revoke execute on function listar_admins() from anon, authenticated;

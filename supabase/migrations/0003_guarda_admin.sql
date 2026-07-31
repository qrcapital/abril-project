-- 0003 — Fecha a escalada de privilégio do `is_admin` (30/jul/2026)
--
-- O FURO, confirmado contra o banco vivo do homolog antes desta migração existir: qualquer
-- aluno logado virava admin com uma chamada, usando só a chave anon.
--
--   PATCH /rest/v1/profiles?id=eq.<seu uid>   { "is_admin": true }   -> 200, coluna virava true
--
-- A causa é a mesma dos dois furos que o HANDOFF §6 registra, e o 0001 já tinha escrito a lição
-- no bloco do `exams`: **RLS é por LINHA e não resolve COLUNA.** A policy `profiles_self_update`
-- restringia corretamente QUAL linha o aluno altera (a dele) e não dizia nada sobre QUAIS
-- colunas. O Supabase concede UPDATE no nível da tabela para `anon`/`authenticated`, e grant de
-- tabela cobre todas as colunas, presentes e futuras.
--
-- Por que era grave e não teórico: hoje ninguém é admin, então o furo é latente. No instante em
-- que o admin da Fase 1 subir, `is_admin = true` faz o aluno passar nas DEZ policies que chamam
-- `is_admin()` — inclusive `questions_admin_only`, que é o banco de questões com o gabarito. O
-- aluno se promoveria e leria as respostas da própria prova.
--
-- ============================================================
-- Camada 1 — o aluno não escreve em `profiles`, ponto
-- ============================================================
-- A primeira versão desta migração reconcedia `update (nome, telefone)` ao aluno, na linha do
-- que o `exams` faz com SELECT. Estava errado por excesso: o PRD §9 define "Minha conta" como
-- tela ENXUTA de propósito ("cada campo a mais é um ticket de suporte a mais"). Nome é exibido,
-- e-mail muda via suporte, e a única ação self-service é trocar senha, que é Auth e não
-- `profiles`. Conferido também no código: a ÚNICA escrita em `profiles` no app é o upsert de
-- `app/app/login/actions.ts`, e ela usa a service role.
--
-- Então a garantia aqui é a mesma que o 0002 escolheu para `enrollments`: a tabela não tem
-- policy de UPDATE, e por isso nem o dono da linha escreve nela pela API. Só a service role
-- (webhook do Guru, admin, migração) grava. Estrutural, não disciplina.
--
-- SE UM DIA o produto quiser deixar o aluno editar o próprio nome, são DUAS coisas, e esquecer
-- a segunda reabre este furo: (1) criar a policy de UPDATE restringindo a linha, e (2) conceder
-- UPDATE **apenas nas colunas permitidas** — nunca `grant update on profiles`, que traz
-- `is_admin` de volta junto. A camada 2 abaixo existe para o caso de alguém esquecer.
revoke update on profiles from anon, authenticated;
drop policy if exists profiles_self_update on profiles;

-- ============================================================
-- Camada 2 — trigger que guarda a coluna de privilégio
-- ============================================================
-- A camada 1 sozinha basta hoje. Esta existe porque o schema deste projeto já foi aplicado à
-- mão por psql, e "à mão" é exatamente onde um `grant all` reaparece num reset — e porque no dia
-- em que alguém reabrir o UPDATE do aluno para editar o nome, o `is_admin` continua fechado.
--
-- Quem pode mudar `is_admin`:
--   - a service role (webhook, admin, migração, psql), que chega sem `auth.uid()`;
--   - um admin que JÁ era admin antes deste UPDATE.
-- Qualquer outro caminho estoura, em vez de gravar em silêncio.
--
-- `is_admin()` é `security definer` e `stable`, então lê o estado ANTERIOR ao UPDATE, que é
-- justamente a pergunta certa: quem chamou era admin antes de tentar mexer nisto?
create or replace function guarda_is_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.is_admin is distinct from old.is_admin then
    -- Sem JWT de usuário: service role, migração ou psql. É o caminho legítimo de conceder e
    -- revogar o papel enquanto não existe tela de admin para isso.
    if auth.uid() is null then
      return new;
    end if;
    if not is_admin() then
      raise exception
        'is_admin so pode ser alterado por um admin existente ou pela service role'
        using errcode = '42501';  -- insufficient_privilege
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guarda_is_admin on profiles;
create trigger profiles_guarda_is_admin
  before update on profiles
  for each row execute function guarda_is_admin();

-- O trigger é chamado pelo Postgres, nunca pelo cliente: não precisa (e não deve) ter EXECUTE
-- aberto. Mesma lição do `sortear_prova` no 0001 — o revoke que fecha de fato é o de PUBLIC,
-- porque é dele que `anon` e `authenticated` herdam.
revoke execute on function guarda_is_admin() from public;

comment on function guarda_is_admin() is
  'Barra mudanca de profiles.is_admin por quem nao e admin. Camada 2 do 0003; a 1 e a ausencia de UPDATE para o aluno.';

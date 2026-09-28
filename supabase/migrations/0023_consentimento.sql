-- ============================================================
-- 0023 — Log de consentimento (pedido do jurídico da Abril, set/2026)
-- ============================================================
--
-- A Abril perguntou, em cima da revisão da Política e dos Termos: "o log de consentimento fica sob
-- responsabilidade de vocês? Há como mantermos acesso a ele?". A resposta que demos foi sim para as
-- duas, e esta migration é a primeira metade dela.
--
-- O QUE EXISTIA ANTES DAQUI: nada. Vale dizer em voz alta, porque é fácil olhar o produto e supor
-- que existia. A conta do aluno nasce do webhook do Guru, e o aceite dos documentos acontecia no
-- checkout do Guru, na base deles. A `/lista-de-espera` coletava nome, e-mail e telefone com o
-- consentimento sendo o próprio envio, e quem guardava o lead era o RD Station. Em nenhum dos dois
-- caminhos havia registro NOSSO de quem aceitou o quê, quando e em qual versão do texto. Pedir o log
-- a um fornecedor, no dia em que um titular reclamar, é a diferença entre responder em minutos e
-- responder em semanas.
--
-- ┌─ O QUE FAZ UM LOG DE CONSENTIMENTO VALER ALGUMA COISA ────────────────────────────────────────┐
-- │ Não é a data. É poder provar QUAL TEXTO a pessoa tinha na frente quando marcou a caixa. Uma    │
-- │ linha dizendo "fulano aceitou a política em 12/out" não responde nada se a política mudou três │
-- │ vezes desde então. Por isso são duas tabelas e não uma: `consent_documents` guarda as versões, │
-- │ e cada linha de `consents` aponta para uma delas e ainda carrega, congelada, a frase exata que  │
-- │ estava na tela.                                                                                │
-- └───────────────────────────────────────────────────────────────────────────────────────────────┘
--
-- Mesma família da `0014` (admin_audit) em três escolhas, pelos mesmos motivos: RLS ligada e sem
-- policy nenhuma, então para anon e authenticated estas tabelas não existem e só a service role
-- escreve; `on delete set null` no titular, para o registro sobreviver ao fim da conta; e o e-mail
-- congelado na linha, porque consentimento que some junto com quem consentiu não prova nada.
--
-- A diferença em relação à `0014` é que aqui a imutabilidade é imposta pelo BANCO, por trigger, e
-- não só por convenção. Rastro de admin é operacional; log de consentimento é prova. UPDATE e DELETE
-- levantam exceção, inclusive para a service role, que ignora RLS mas não ignora trigger. Quem tem
-- o dono do banco na mão consegue dropar o trigger, claro, e isso fica registrado no histórico de
-- migrations, que é exatamente onde se quer que fique.

-- ------------------------------------------------------------
-- As versões dos documentos
-- ------------------------------------------------------------
--
-- `sha256` fica nulo até o texto estar publicado e congelado. Quando estiver, o hash é o que fecha a
-- prova: com ele dá para pegar o arquivo de hoje, calcular e dizer se é o mesmo que a pessoa leu.
-- `url` também nasce nulo porque o endereço final depende da publicação em blocktrends.abril.com.br.
--
-- `vigente_desde` e não um booleano `ativo`: booleano precisa de alguém para desligar e vira mentira
-- no dia em que esquecerem. A versão vigente é sempre a de maior `vigente_desde` já passada, o que
-- também permite agendar a entrada de um texto novo.

create table if not exists consent_documents (
  id            uuid primary key default gen_random_uuid(),
  tipo          text not null check (tipo in ('politica', 'termos')),
  versao        text not null,                    -- data ISO da revisão: '2026-09-28'
  url           text,                             -- nulo até publicar no domínio final
  sha256        text,                             -- nulo até o texto estar congelado
  vigente_desde timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  unique (tipo, versao)
);
create index if not exists consent_documents_vigencia_idx
  on consent_documents(tipo, vigente_desde desc);

alter table consent_documents enable row level security;

comment on table consent_documents is
  'Versoes da Politica de Privacidade e dos Termos de Uso. A vigente e a de maior vigente_desde ja passada.';
comment on column consent_documents.sha256 is
  'Hash do texto publicado. Com ele se prova que o documento de hoje e o mesmo que o titular leu.';

-- ------------------------------------------------------------
-- O log em si
-- ------------------------------------------------------------
--
-- `user_id` é nulo de propósito e isso não é frouxidão: o consentimento da `/lista-de-espera` vem de
-- alguém que ainda não comprou e por definição não tem conta. O que nunca é nulo é o `email`, que é
-- como o titular se identifica quando exerce um direito dele.
--
-- `texto` guarda a frase que estava na tela, inteira, e não um código. Parece redundante com
-- `documento_versao` e não é: a versão diz qual documento, o texto diz o que a caixa de aceite
-- prometia. As duas coisas mudam em ritmos diferentes.
--
-- `ip` é `inet` e não `text` porque o Postgres valida o formato e a coluna passa a ser consultável
-- por faixa. O aplicativo manda nulo quando não consegue um endereço confiável: preferimos um
-- consentimento registrado sem IP a um insert que estoura e não registra consentimento nenhum.
--
-- SEM UNIQUE POR (user_id, documento_tipo). Foi tentador e está errado: a pessoa aceita de novo
-- quando a versão muda, e append-only significa que o aceite de ontem continua lá ao lado do de
-- hoje. Quem quer "o aceite vigente" pede o mais recente; quem quer a história pede todos.

create table if not exists consents (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  email            text not null,                 -- congelado: o e-mail de então, nao o de hoje
  nome             text,
  origem           text not null,                 -- 'primeiro-acesso', 'lista-de-espera', 'signup-homolog'
  documento_id     uuid references consent_documents(id),
  documento_tipo   text not null check (documento_tipo in ('politica', 'termos')),
  documento_versao text not null,
  texto            text not null,                 -- a frase exata exibida ao lado da caixa
  ip               inet,
  user_agent       text,
  guru_order_id    text,                          -- amarra o aceite ao pedido, quando ha um
  created_at       timestamptz not null default now()
);
create index if not exists consents_data_idx    on consents(created_at desc);
create index if not exists consents_user_idx    on consents(user_id);
create index if not exists consents_email_idx   on consents(lower(email));

alter table consents enable row level security;

comment on table consents is
  'Log append-only de aceite dos documentos. Escrita so pela service role; UPDATE e DELETE bloqueados por trigger.';
comment on column consents.user_id is
  'Nulo quando o titular ainda nao tem conta (lista de espera) ou quando a conta foi apagada depois.';
comment on column consents.texto is
  'A frase de aceite como estava na tela. A versao diz qual documento; isto diz o que a caixa prometia.';

-- ------------------------------------------------------------
-- Append-only de verdade
-- ------------------------------------------------------------
--
-- ARMADILHA: RLS não fecha isto. A service role ignora policy, e é ela que escreve. O que impede a
-- linha de ser reescrita é o trigger, que roda para todo mundo. Sem ele, "append-only" seria uma
-- palavra no comentário da tabela.
--
-- `tg_op` na mensagem para o erro dizer qual operação foi barrada, em vez de um "não pode" genérico
-- que manda quem está depurando ler esta migration para descobrir o que aconteceu.

create or replace function consents_append_only()
returns trigger language plpgsql as $$
begin
  raise exception
    'consents e append-only: % bloqueado. Consentimento se revoga inserindo uma revogacao, nao apagando o aceite.',
    tg_op;
end;
$$;

drop trigger if exists consents_sem_update on consents;
create trigger consents_sem_update before update on consents
  for each row execute function consents_append_only();

drop trigger if exists consents_sem_delete on consents;
create trigger consents_sem_delete before delete on consents
  for each row execute function consents_append_only();

-- ------------------------------------------------------------
-- Leitura pelo painel
-- ------------------------------------------------------------
--
-- Mesma família da `0015` e pelos mesmos motivos: `security definer` porque precisa de `auth.users`
-- para o e-mail atual do titular, e revogada de PUBLIC antes de anon e authenticated.
--
-- ARMADILHA JÁ REGISTRADA SEIS VEZES NESTE SCHEMA: `revoke ... from anon, authenticated` não fecha
-- função, porque o EXECUTE vem de PUBLIC. O revoke de PUBLIC é o que fecha.
--
-- `email_atual` ao lado do `email` congelado: quando os dois diferem, alguém trocou o e-mail de
-- login depois de aceitar, e essa é justamente a pergunta que aparece quando um titular escreve de
-- um endereço que não está no log.

create or replace function listar_consentimentos(termo text default '', limite int default 500)
returns table (
  id               uuid,
  user_id          uuid,
  email            text,
  email_atual      text,
  nome             text,
  origem           text,
  documento_tipo   text,
  documento_versao text,
  texto            text,
  ip               text,
  user_agent       text,
  guru_order_id    text,
  created_at       timestamptz
)
language sql stable security definer set search_path = public as $$
  select c.id,
         c.user_id,
         c.email,
         u.email::text,
         c.nome,
         c.origem,
         c.documento_tipo,
         c.documento_versao,
         c.texto,
         host(c.ip),
         c.user_agent,
         c.guru_order_id,
         c.created_at
  from consents c
  left join auth.users u on u.id = c.user_id
  where termo = ''
     or c.email                     ilike '%' || termo || '%'
     or coalesce(u.email::text, '') ilike '%' || termo || '%'
     or coalesce(c.nome, '')        ilike '%' || termo || '%'
     or coalesce(c.guru_order_id, '') ilike '%' || termo || '%'
     or c.origem                    ilike '%' || termo || '%'
  order by c.created_at desc
  limit least(greatest(limite, 1), 5000);
$$;

revoke execute on function listar_consentimentos(text, int) from public;
revoke execute on function listar_consentimentos(text, int) from anon, authenticated;

-- ------------------------------------------------------------
-- Semeadura das versões de hoje
-- ------------------------------------------------------------
--
-- A versão é a data da revisão que foi para a Abril. Quando o texto for publicado no domínio final,
-- é aqui que entram `url` e `sha256`, por UPDATE nesta tabela, que não tem trigger de imutabilidade
-- justamente porque a versão é um cadastro, não um fato consumado.

insert into consent_documents (tipo, versao, vigente_desde)
values ('politica', '2026-09-28', now()),
       ('termos',   '2026-09-28', now())
on conflict (tipo, versao) do nothing;

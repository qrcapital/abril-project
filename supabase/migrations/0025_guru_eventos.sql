-- ============================================================
-- 0025: Vendas ligadas: eventos do Guru, busca de conta por e-mail, teto de pedidos e os
--        e-mails de acesso na identidade nova (29/set/2026)
-- ============================================================
--
-- Quatro peças que a auditoria pré-lançamento pediu juntas, porque as quatro estão no caminho de
-- uma compra real até o primeiro login:
--
-- 1. `guru_events`: o registro cru de cada entrega do webhook do Guru.
-- 2. `usuario_por_email`: acha a conta pelo e-mail sem listar o banco inteiro.
-- 3. `rate_limits` + `consumir_limite`: teto por IP e por e-mail que vale entre instâncias.
-- 4. `email_templates`: o boas-vindas reescrito e o template novo de redefinição de senha.
--
-- ARMADILHA JÁ REGISTRADA SETE VEZES NESTE SCHEMA (AGENTS.md): `revoke ... from anon,
-- authenticated` não fecha uma função, porque o EXECUTE vem de PUBLIC. Aqui as duas funções novas
-- levam o revoke de PUBLIC, de anon e de authenticated, e o grant explícito para `service_role`, que
-- é o único papel que as chama. Conferir com `has_function_privilege('anon', oid, 'EXECUTE')`.

-- ------------------------------------------------------------
-- 1. Eventos do webhook do Guru
-- ------------------------------------------------------------
--
-- POR QUE GUARDAR O CRU: no dia em que um comprador escrever "paguei e não recebi nada", a
-- pergunta é se o Guru chegou a avisar, com qual status, e o que a gente fez com isso. Sem esta
-- tabela a resposta dependia do log da função na Netlify, que some em dias e não se consulta por
-- e-mail. A rota grava a linha ANTES de processar e preenche `processed_at`/`erro` depois, então
-- uma entrega que derrubou o processamento fica visível como linha sem `processed_at`.
--
-- O `api_token` do Guru chega DENTRO do corpo (o Guru não assina com HMAC). A rota o remove antes
-- de gravar: guardar o token da conta em tabela seria espalhar a credencial por backups e CSVs.
--
-- `resultado` é o desfecho legível ('processado', 'ignorado: produto fora da lista', ...) e é
-- coluna separada de `erro` de propósito: evento ignorado não é erro, e misturar os dois faria o
-- filtro "o que falhou" trazer todo evento de boleto gerado.
--
-- RLS LIGADA E NENHUMA POLICY, como `email_templates` e `consents`: para anon e authenticated a
-- tabela não existe. O revoke de tabela é a segunda camada, para o dia em que alguém criar uma
-- policy larga sem lembrar do que mora aqui (dado pessoal de comprador).

create table if not exists guru_events (
  id             uuid primary key default gen_random_uuid(),
  request_id     text,                          -- cabeçalho X-Request-ID do Guru
  transaction_id text,                          -- `id` da transação no Guru = enrollments.guru_order_id
  status         text,                          -- approved, completed, refunded, chargeback, ...
  webhook_type   text,                          -- 'transaction' é o único que processamos
  email          text,
  payload        jsonb not null,                -- o corpo recebido, SEM o api_token
  received_at    timestamptz not null default now(),
  processed_at   timestamptz,
  resultado      text,
  erro           text
);
create index if not exists guru_events_recebido_idx  on guru_events(received_at desc);
create index if not exists guru_events_transacao_idx on guru_events(transaction_id);
create index if not exists guru_events_email_idx     on guru_events(lower(email));

alter table guru_events enable row level security;
revoke all on guru_events from anon, authenticated;

comment on table guru_events is
  'Cada entrega do webhook do Guru, crua e sem o api_token. Escrita e leitura so pela service role.';
comment on column guru_events.processed_at is
  'Nulo = a entrega chegou e o processamento nao terminou (erro ou timeout). O Guru reentrega.';

-- ------------------------------------------------------------
-- 2. Conta pelo e-mail
-- ------------------------------------------------------------
--
-- O webhook fazia `auth.admin.listUsers()` e procurava o e-mail na memória. Essa chamada devolve a
-- PRIMEIRA PÁGINA (50 contas por padrão), então a partir do 51º aluno a recompra de quem já tinha
-- conta falhava em "não foi possível criar nem localizar o usuário", o Guru reentregava, e falhava
-- de novo, para sempre. A `buscar_usuarios` (0004) é `ilike` com curinga, feita para a tela de
-- busca; aqui a pergunta é de igualdade e tem uma resposta só.
--
-- `lower()` dos dois lados: o Supabase grava o e-mail em minúsculas, mas conta criada à mão no
-- painel ou importada pode não estar, e o Guru manda o e-mail como o comprador digitou.

create or replace function usuario_por_email(p_email text)
returns uuid
language sql stable security definer set search_path = public as $$
  select u.id
  from auth.users u
  where lower(u.email) = lower(trim(p_email))
  order by u.created_at
  limit 1;
$$;

revoke execute on function usuario_por_email(text) from public;
revoke execute on function usuario_por_email(text) from anon, authenticated;
grant execute on function usuario_por_email(text) to service_role;

-- ------------------------------------------------------------
-- 3. Teto de pedidos, compartilhado entre instâncias
-- ------------------------------------------------------------
--
-- O teto da `/api/consentimento` era um Map em memória, e o comentário dele já avisava: cada
-- instância da Netlify tem o seu, e reinício zera. Para a recuperação de senha isso não serve, porque
-- cada pedido dispara um e-mail do nosso remetente, e reputação de remetente não volta com deploy.
--
-- Janela FIXA (o relógio é cortado em fatias de `janela_segundos`) e não deslizante: uma linha por
-- chave por janela, um upsert por pedido, e a pior borda é o dobro do teto em dois segundos
-- seguidos na virada da janela. Para robô de formulário, é o bastante.
--
-- A chave é texto livre montado pelo chamador ('senha:ip:1.2.3.4', 'senha:email:<hash>'). O
-- chamador manda o e-mail em hash, para esta tabela não virar mais um lugar com endereço pessoal.
--
-- `#variable_conflict use_column`: o parâmetro se chama `chave`, como a coluna, porque é o nome que
-- a API do Supabase expõe na chamada `rpc('consumir_limite', { chave, ... })`. Sem a diretiva, o
-- plpgsql acusa referência ambígua no `on conflict`.

create table if not exists rate_limits (
  chave    text        not null,
  janela   timestamptz not null,
  contagem int         not null default 0,
  primary key (chave, janela)
);

alter table rate_limits enable row level security;
revoke all on rate_limits from anon, authenticated;

comment on table rate_limits is
  'Contagem de pedidos por chave e janela fixa. So consumir_limite() escreve aqui.';

create or replace function consumir_limite(chave text, limite int, janela_segundos int)
returns boolean
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare
  passo  int := greatest(coalesce(janela_segundos, 60), 1);
  inicio timestamptz := to_timestamp(floor(extract(epoch from now()) / passo) * passo);
  atual  int;
begin
  insert into rate_limits (chave, janela, contagem)
  values (consumir_limite.chave, inicio, 1)
  on conflict (chave, janela) do update set contagem = rate_limits.contagem + 1
  returning contagem into atual;

  -- Faxina oportunista, em 1% das chamadas: sem ela a tabela cresce uma linha por IP por hora para
  -- sempre. Um dia de folga cobre a maior janela em uso (uma hora) com sobra.
  if random() < 0.01 then
    delete from rate_limits where janela < now() - interval '1 day';
  end if;

  return atual <= limite;
end;
$$;

revoke execute on function consumir_limite(text, int, int) from public;
revoke execute on function consumir_limite(text, int, int) from anon, authenticated;
grant execute on function consumir_limite(text, int, int) to service_role;

-- ------------------------------------------------------------
-- 4. Os e-mails de acesso
-- ------------------------------------------------------------
--
-- O boas-vindas é REESCRITO, e por isso `do update` e não `do nothing`, ao contrário da 0009: o
-- texto antigo mandava criar a senha num link sem dizer a validade nem por onde começar, e o link
-- agora é outro (recovery, 24 horas). Edição feita no painel antes desta
-- migration se perde, e é a intenção: o texto de lá descreve um fluxo que deixou de existir.
--
-- A redefinição é template NOVO. Até aqui ela saía pelo SMTP do Supabase Auth, com o template do
-- painel deles e o teto de 30 por hora do projeto inteiro. Agora sai pelo nosso envio.
--
-- A VALIDADE ESCRITA NOS DOIS É 24 HORAS, e isso não é descuido na redefinição: o Supabase tem UM
-- prazo para todo token de e-mail ("Email OTP Expiration"), e ele fica em 86400 segundos para o
-- link de boas-vindas aguentar o intervalo entre a compra e a primeira abertura da caixa. Escrever
-- "1 hora" na redefinição seria prometer um prazo que o sistema não aplica.
--
-- Copy com o checklist do docs/COPY.md: sem travessão, sem exclamação, número concreto. Cada linha
-- do corpo é um parágrafo (regra de `lib/email-render.ts`).

insert into email_templates (chave, assunto, corpo, cta, ativo, updated_at) values
  (
    'boas-vindas',
    'Seu acesso à Estratégia Internacional está pronto',
    E'{{nome}}, sua compra foi confirmada e a sua vaga na Estratégia Internacional está garantida.\n'
    'Para entrar, crie sua senha no botão abaixo. Depois comece pelo módulo zero, "Comece por aqui", que mostra como o curso funciona e por onde seguir.\n'
    'Este link é pessoal e vale por 24 horas. Se ele expirar, use "Esqueci minha senha" em blocktrends.abril.com.br/app/login e um link novo chega em instantes.\n'
    'Equipe Estratégia Internacional',
    'Criar minha senha e entrar',
    true,
    now()
  ),
  (
    'redefinicao-senha',
    'Redefina sua senha da Estratégia Internacional',
    E'{{nome}}, recebemos um pedido para criar uma senha nova na sua conta da Estratégia Internacional, e o botão abaixo leva direto para isso.\n'
    'O link vale por 24 horas e funciona uma vez só. Se você não fez esse pedido, pode ignorar este e-mail: sua senha atual continua valendo.\n'
    'Equipe Estratégia Internacional',
    'Criar nova senha',
    true,
    now()
  )
on conflict (chave) do update
  set assunto    = excluded.assunto,
      corpo      = excluded.corpo,
      cta        = excluded.cta,
      updated_at = excluded.updated_at;

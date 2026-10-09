-- ============================================================
-- 0033: rastreio de entrega dos e-mails do SES (09/out/2026)
-- ============================================================
--
-- O `email_log` diz "enviado" quando a API do SES aceitou o pedido, e nada além disso. O que
-- acontece depois (o servidor do destinatário aceitou, adiou ou devolveu) não chegava até nós. Uma
-- aluna do @outlook.com não recebeu dois e-mails que constam como enviados, e ela não está na lista
-- de supressão do SES: sem os eventos de entrega, não havia como dizer onde a mensagem parou.
--
-- O caminho, de ponta a ponta (passo a passo da AWS em docs/SES-RASTREIO.md):
--
--   envio com ConfigurationSetName  ->  SES publica os eventos no tópico SNS
--   ->  SNS faz POST em /api/webhooks/ses  ->  a rota confere a assinatura e grava aqui
--
-- Duas peças:
--
-- 1. `email_log.ses_message_id`: o `MessageId` que o SES devolve no envio. É a chave da junção.
-- 2. `email_eventos`: uma linha por evento e por destinatário, com um resumo curto do motivo.
--
-- Idempotente: pode rodar de novo sem efeito. Rodar inteira no SQL editor do projeto
-- estrategia-internacional. O código tolera a ordem inversa (deploy antes da migration): o envio
-- grava o log sem o id, e a tela do aluno mostra "sem rastreio".

-- ------------------------------------------------------------
-- 1. O id do SES no log de envio
-- ------------------------------------------------------------
--
-- Nulo para tudo que veio antes, para envio pelo Resend e para falha (não houve mensagem). Índice
-- parcial: a busca é sempre por um id que existe, e as linhas sem id não precisam ocupar o índice.

alter table email_log add column if not exists ses_message_id text;

create index if not exists email_log_ses_message_idx
  on email_log (ses_message_id) where ses_message_id is not null;

comment on column email_log.ses_message_id is
  'MessageId devolvido pelo SES no envio. Liga a linha aos eventos de entrega em email_eventos.';

-- ------------------------------------------------------------
-- 2. Os eventos de entrega
-- ------------------------------------------------------------
--
-- `tipo` é o `eventType` do SES, cru: Send, Delivery, Bounce, Complaint, DeliveryDelay, Reject,
-- Rendering Failure. Texto livre e sem check, de propósito: tipo novo que a AWS inventar entra como
-- linha em vez de derrubar a entrega do SNS em erro de constraint (o SNS reentregaria até desistir).
--
-- `detalhe` é um resumo, não o evento: bounceType/subType, delayType, status e diagnosticCode do
-- servidor do destinatário, smtpResponse da entrega. Até 500 caracteres, cortado pela rota. O JSON
-- inteiro traz cabeçalhos e o endereço de todo mundo, e não precisa morar no banco.
--
-- `sns_message_id` é o id do envelope do SNS, que se repete quando o SNS reentrega. O índice único
-- com o destinatário é o que faz a reentrega virar no-op (a rota faz upsert ignorando duplicata).
-- Nulos são distintos no Postgres, então um evento sem destinatário não trava o próximo.
--
-- `ocorrido_em` é o horário do evento segundo o SES; `recebido_em`, o da chegada aqui. A diferença
-- entre os dois mostra atraso do próprio SNS, que é outra pergunta.
--
-- RLS LIGADA E NENHUMA POLICY, como `guru_events`: para anon e authenticated a tabela não existe. A
-- rota grava e o admin lê pela service role. O revoke é a segunda camada, para o dia em que alguém
-- criar uma policy larga sem lembrar do que mora aqui (endereço de e-mail de aluno).

create table if not exists email_eventos (
  id              uuid primary key default gen_random_uuid(),
  ses_message_id  text not null,
  sns_message_id  text,
  tipo            text not null,
  destinatario    text,
  detalhe         text,
  ocorrido_em     timestamptz,
  recebido_em     timestamptz not null default now()
);

create index if not exists email_eventos_ses_message_idx on email_eventos (ses_message_id);
create index if not exists email_eventos_destinatario_idx on email_eventos (lower(destinatario));
create index if not exists email_eventos_recebido_idx on email_eventos (recebido_em desc);
create unique index if not exists email_eventos_sns_unico
  on email_eventos (sns_message_id, destinatario);

alter table email_eventos enable row level security;
revoke all on email_eventos from anon, authenticated;

comment on table email_eventos is
  'Eventos de entrega do SES (via SNS em /api/webhooks/ses). Escrita e leitura so pela service role.';
comment on column email_eventos.detalhe is
  'Resumo curto do motivo (bounceType/subType, delayType, diagnosticCode, smtpResponse), ate 500 caracteres.';

-- Conferência: as duas peças existem e a tabela nova está fechada para o aluno.
select
  exists (select 1 from information_schema.columns
           where table_name = 'email_log' and column_name = 'ses_message_id') as log_tem_id,
  (select relrowsecurity from pg_class where relname = 'email_eventos')       as eventos_com_rls,
  has_table_privilege('anon', 'email_eventos', 'SELECT')                     as anon_le_eventos;

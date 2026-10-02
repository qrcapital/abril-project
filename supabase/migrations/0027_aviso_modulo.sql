-- ============================================================
-- 0027: Aviso por e-mail de módulo liberado (02/out/2026)
-- ============================================================
--
-- A régua de liberação é por aluno (o Módulo I abre 7 dias depois da compra, o II em 14...), então
-- o aviso não é campanha com data: é a rotina de hora em hora de `lib/avisos-modulo.ts`, chamada
-- por `netlify/functions/avisos-modulo.mts`. Esta migration dá a ela as duas coisas que faltam no
-- banco: a memória de quem já foi avisado e o texto do e-mail.
--
-- Idempotente e autossuficiente: pode ser colada inteira no SQL editor do Supabase.

-- ------------------------------------------------------------
-- 1. Quem já foi avisado de qual módulo
-- ------------------------------------------------------------
--
-- A chave (user_id, modulo_ord) é a garantia de "uma vez por aluno e módulo". A rotina grava a linha
-- ANTES de mandar, como reserva, e apaga se o envio falhar (para tentar de novo na hora seguinte).
-- Ord e não `module_id`: o aviso é sobre a posição na régua, e é o ord que a URL e o e-mail usam.
--
-- RLS ligada sem policy: só a service role lê e escreve. Aluno não tem o que fazer aqui.

create table if not exists modulo_avisos (
  user_id     uuid not null references auth.users(id) on delete cascade,
  modulo_ord  smallint not null,
  status      text not null default 'enviando',
  criado_em   timestamptz not null default now(),
  primary key (user_id, modulo_ord)
);

alter table modulo_avisos enable row level security;

-- ------------------------------------------------------------
-- 2. O template `modulo-liberado`
-- ------------------------------------------------------------
--
-- Variáveis: `{{nome}}`, `{{modulo}}` (I, II...), `{{titulo}}` e `{{proximo}}` (a frase pronta
-- sobre o próximo módulo, calculada no calendário do próprio aluno). É o contrato de `VARIAVEIS` em
-- `lib/email-render.ts`. O botão leva a `/app/modulo/<ord>`, montado pela rotina.
--
-- `on conflict do nothing`: texto editado pelo painel vence a migration reaplicada.

insert into email_templates (chave, assunto, corpo, cta, ativo, updated_at)
values (
  'modulo-liberado',
  'Módulo {{modulo}} liberado: {{titulo}}',
  E'{{nome}}, o Módulo {{modulo}} da Estratégia Internacional, {{titulo}}, acabou de abrir na sua área.\n'
  'As aulas e o notebook do módulo já estão lá, para você assistir no seu ritmo. {{proximo}}\n'
  'Equipe Estratégia Internacional',
  'Assistir ao módulo',
  true,
  now()
)
on conflict (chave) do nothing;

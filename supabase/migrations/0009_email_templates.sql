-- ============================================================
-- 0009 — Templates de e-mail editáveis pelo admin (PRD §14, PLANO-ADMIN §4.5)
-- ============================================================
--
-- Pedido do Pedro em 31/jul/2026: um **builder para os transacionais nossos**. O Guru já dispara os
-- de pagamento (PIX, boleto, cartão recusado, carrinho); os do produto são nossos, e boas-vindas e
-- certificado não existiam em lugar nenhum — o webhook gerava o link de acesso e não mandava nada.
--
-- ASSUNTO E CORPO NO BANCO, LAYOUT EM CÓDIGO. É a mesma divisão do currículo: quem edita texto é o
-- painel, e painel não edita código. O que fica no código é a moldura (marca, tipografia, botão,
-- rodapé), que é design system e não conteúdo, mais o **contrato de variáveis**: qual `{{campo}}`
-- cada template pode usar. Esse contrato é entre o gatilho e o texto, então mora onde o gatilho
-- mora, senão o editor inventaria variável que ninguém preenche e o aluno receberia `{{nome}}` cru.
--
-- O CTA é rótulo + destino, e o destino NÃO é editável: ele vem do gatilho (o link de senha, o
-- certificado, o WhatsApp). Deixar a URL no editor seria a forma mais barata de mandar todo mundo
-- para o lugar errado, e a mais difícil de perceber.
--
-- RLS LIGADA E NENHUMA POLICY, de propósito: só a service role lê e escreve aqui. Aluno não tem o
-- que fazer com esta tabela, e admin chega por ela pelo servidor, depois da guarda do layout.

create table if not exists email_templates (
  chave       text primary key,
  assunto     text not null,
  corpo       text not null,
  cta         text,
  ativo       boolean not null default true,
  updated_at  timestamptz not null default now()
);

alter table email_templates enable row level security;

comment on table email_templates is
  'Assunto e corpo dos transacionais nossos. Layout e variáveis permitidas vivem em lib/email-render.ts.';
comment on column email_templates.cta is
  'Rótulo do botão. O destino vem do gatilho, nunca do editor.';
comment on column email_templates.ativo is
  'Desligado não envia. O envio continua registrado em email_log, com status "desligado".';

-- Carga inicial. Copy no guia do docs/COPY.md: sem travessão, sem hype, número concreto.
-- `on conflict do nothing` para reaplicar a migration não desfazer edição feita no painel.
insert into email_templates (chave, assunto, corpo, cta) values
  (
    'boas-vindas',
    'Seu acesso à Estratégia Internacional está pronto',
    E'{{nome}}, sua matrícula está confirmada.\n'
    'O primeiro passo é criar sua senha, no botão abaixo. Depois disso você entra sempre pela mesma tela, com e-mail e senha.\n'
    'O curso abre um módulo por semana a partir de hoje, e o Módulo 0 de boas-vindas já está liberado. Se o link abaixo não funcionar mais, use "Esqueci minha senha" na tela de entrada.',
    'Criar minha senha'
  ),
  (
    'resultado-aprovado',
    'Você foi aprovado na prova final',
    E'{{nome}}, sua nota foi {{nota}}% e a aprovação está registrada.\n'
    'O certificado de conclusão já está na sua área, com download em PDF e um código de verificação que qualquer pessoa pode conferir online.',
    'Ver meu certificado'
  ),
  (
    'resultado-reprovado',
    'Resultado da sua prova final',
    E'{{nome}}, sua nota foi {{nota}}% e o mínimo para aprovação é {{minimo}}%.\n'
    'A prova tem tentativa única e a segunda chamada é liberada caso a caso. Fale com o suporte pelo WhatsApp para combinar a sua.\n'
    'Seu acesso às aulas continua valendo até o fim do prazo, então dá para revisar os módulos antes de tentar de novo.',
    'Falar com o suporte'
  )
on conflict (chave) do nothing;

-- ============================================================
-- 0032: o e-mail de boas-vindas vira o e-mail da compra (10/out/2026)
-- ============================================================
--
-- Pedido do Marcelo depois da compra de teste: o único e-mail que chegava era o padrão do Guru, com
-- remetente genérico. O nosso (boas-vindas, que sai do webhook pelo SES como
-- "Estratégia Internacional <contato@blocktrends.com.br>") passa a abrir confirmando a compra, já no
-- assunto, e deixa de citar o "módulo zero", que saiu do curso (0028).
--
-- Rodar inteira no SQL editor do projeto estrategia-internacional.

update email_templates
   set assunto = 'Compra confirmada: seu acesso à Estratégia Internacional',
       corpo = E'{{nome}}, sua compra foi aprovada e a sua vaga na Estratégia Internacional está garantida.\n'
               'Para entrar, crie sua senha no botão abaixo. O Módulo I já está liberado, e os módulos II, III e IV chegam um por semana.\n'
               'Este link é pessoal e vale por 24 horas. Se ele expirar, use "Esqueci minha senha" em blocktrends.abril.com.br/app/login e um link novo chega em instantes.\n'
               'Equipe Estratégia Internacional',
       cta = 'Criar minha senha e entrar',
       updated_at = now()
 where chave = 'boas-vindas';

select chave, assunto from email_templates where chave = 'boas-vindas';

-- ============================================================
-- 0010 — Banner de imagem por template de e-mail (PRD §14)
-- ============================================================
--
-- Pedido do Pedro em 31/jul/2026, depois de ver a prévia sem imagem nenhuma.
--
-- DUAS COLUNAS E NÃO UMA, e a segunda não é zelo: **cliente de e-mail bloqueia imagem por padrão**
-- (Outlook desktop, e Gmail em conta configurada assim). Sem `banner_alt`, o e-mail bloqueado abre
-- com uma caixa vazia no topo; com ele, abre com a frase. É a diferença entre um e-mail que degrada
-- e um que parece quebrado, e é por isso que a tela exige o alt quando existe banner.
--
-- O ENDEREÇO É URL COLADA, igual aos materiais do curso (decisão de 31/jul): o projeto não tem
-- bucket de Storage. Caminho começando com `/` é resolvido contra `NEXT_PUBLIC_SITE_URL` na hora de
-- montar o e-mail, porque **URL relativa não funciona em e-mail**: a mensagem é aberta fora do nosso
-- domínio e não existe base para resolver.
--
-- Nenhum dos três templates nasce com banner: a arte ainda não existe, e um banner de exemplo
-- viraria um placeholder saindo para aluno de verdade.

alter table email_templates
  add column if not exists banner     text,
  add column if not exists banner_alt text;

comment on column email_templates.banner is
  'Endereço do banner. https:// completo, ou caminho iniciando em / resolvido contra NEXT_PUBLIC_SITE_URL. Vazio = e-mail sem banner.';
comment on column email_templates.banner_alt is
  'Texto que aparece no lugar do banner quando o cliente de e-mail bloqueia imagem. Obrigatório quando existe banner.';

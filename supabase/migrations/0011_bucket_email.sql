-- ============================================================
-- 0011 — Bucket do Storage para o banner dos e-mails (PRD §14)
-- ============================================================
--
-- Pedido do Pedro em 31/jul/2026: campo de **upload** para o banner, em vez de só URL colada. Faz
-- sentido aqui e não fazia nos materiais do curso: banner é arte que alguém acabou de exportar, e
-- exigir que ela já esteja hospedada em algum lugar é pedir um passo que não existe.
--
-- **O BUCKET NASCE NA MIGRATION, e não por chamada de código.** Criar bucket sob demanda no primeiro
-- upload funciona e deixa uma peça de infraestrutura invisível: ninguém sabe que ela existe, com que
-- limites, nem como recriá-la no `ei-prod`. Aqui ele fica versionado junto com o resto do schema.
--
-- **PÚBLICO, e isso é requisito e não descuido:** cliente de e-mail busca a imagem sem sessão
-- nenhuma, de um proxy do Gmail ou do Outlook, então URL assinada com validade **não serve** para
-- banner de e-mail. Nada sensível vive aqui: é arte de campanha que também vai na caixa de entrada de
-- quem receber o e-mail.
--
-- **Os dois limites são de estrutura, não de tela.** A rota do admin já recusa arquivo grande e tipo
-- errado, e essa checagem é a primeira barreira; estes limites são a que sobra quando alguém escrever
-- um segundo caminho de upload e esquecer a validação. É o mesmo raciocínio do trigger
-- `guarda_is_admin`: a regra vive onde ela não depende de quem chama.
--
-- WebP fica FORA da lista de propósito: Outlook e versões antigas do Apple Mail não renderizam, e o
-- banner apareceria como caixa vazia justamente para parte de quem abre e-mail no desktop.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('email', 'email', true, 512000, array['image/png', 'image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Nenhuma policy em `storage.objects`: leitura de bucket público não passa por RLS, e a escrita sai
-- pela service role, que a ignora. Aluno e anônimo não têm caminho de escrita aqui.

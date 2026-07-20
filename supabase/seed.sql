-- Seed de desenvolvimento — Estratégia Internacional
-- Conteúdo real de módulos e aulas (do design final) + banco de questões de EXEMPLO
-- só para testar o motor de sorteio da prova. As questões reais são trabalho nosso.
-- Idempotente: pode rodar de novo.

-- ------------------------------------------------------------
-- Módulos (0 = boas-vindas, 1..4 = I..IV)
-- ------------------------------------------------------------
insert into modules (ord, titulo, docente) values
  (0, 'Bem-vindo', null),
  (1, 'Macro e Estratégia Global', 'Rodolfo Bastos'),
  (2, 'Renda Fixa e Ações nos EUA', 'Tony Volpon'),
  (3, 'Como Acessar o Mercado Americano', 'Luiz Fernando Roxo'),
  (4, 'Criptoativos em Dólar', 'Alexandre Ywata')
on conflict (ord) do update set titulo = excluded.titulo, docente = excluded.docente;

-- ------------------------------------------------------------
-- Aulas
-- ------------------------------------------------------------
-- Módulo 0 (não conta para o gate de 16/16)
insert into lessons (module_id, ord, titulo, descricao, conta_no_gate)
select id, 1, 'Como aproveitar a formação', 'Orientação de boas-vindas e como navegar a plataforma.', false
from modules where ord = 0
on conflict (module_id, ord) do update set titulo = excluded.titulo, descricao = excluded.descricao;

-- Aulas avaliadas (I..IV), via VALUES (módulo, ordem, título, descrição)
with dados(mord, lord, titulo, descricao) as (values
  (1,1,'Por que a dolarização de ativos?','Risco fiscal, inflação crônica e perda do valor real.'),
  (1,2,'O dólar como reserva de valor','Comparativo histórico BRL x USD e hedge cambial.'),
  (1,3,'Conta internacional na prática','Abertura nos EUA, remessa e câmbio no dia a dia.'),
  (1,4,'Carteira global e perfil de investidor','Perfil offshore e montagem de carteira.'),
  (2,1,'Tesouro americano','T-Bills, Notes, Bonds, TIPS e FRNs.'),
  (2,2,'Crédito privado internacional','Investment grade vs. high yield, risco-retorno.'),
  (2,3,'Comprando ações nos EUA','Como encontrar, analisar e selecionar stocks.'),
  (2,4,'Dividendos vs. growth investing','Setores, múltiplos e quando preferir cada um.'),
  (3,1,'ETFs: a forma mais barata de investir nos EUA','Gestão ativa vs. passiva na carteira offshore.'),
  (3,2,'REITs: o imóvel americano na carteira','FFO, P/FFO e comparação com FIIs.'),
  (3,3,'BDRs: comprando EUA pela bolsa brasileira','Tipos e principais fundos internacionais.'),
  (3,4,'Tributação e sucessão internacional','Declaração de ativos e proteção patrimonial.'),
  (4,1,'Bitcoin e Ethereum','Reserva de valor vs. contratos inteligentes.'),
  (4,2,'Tokens, RWA e o ecossistema','Tokenização de ativos e regulação.'),
  (4,3,'ETFs de cripto e análise on-chain','ETFs spot nos EUA e métricas on-chain.'),
  (4,4,'Tributação de criptoativos','Regras BR e EUA, ganho de capital, compliance.')
)
insert into lessons (module_id, ord, titulo, descricao, conta_no_gate)
select m.id, d.lord, d.titulo, d.descricao, true
from dados d join modules m on m.ord = d.mord
on conflict (module_id, ord) do update set titulo = excluded.titulo, descricao = excluded.descricao;

-- ------------------------------------------------------------
-- Banco de questões de EXEMPLO (6 por módulo I..IV = 24), só para testar o sorteio.
-- Conteúdo real das questões é trabalho nosso, populado depois.
-- ------------------------------------------------------------
delete from questions where enunciado like '[EXEMPLO]%';

insert into questions (module_id, enunciado, alternativas, correta, ativo)
select m.id,
  '[EXEMPLO] Questão ' || g || ' do Módulo ' || m.ord || ' (placeholder para testar o sorteio da prova)',
  jsonb_build_array('A. Alternativa A', 'B. Alternativa B', 'C. Alternativa C', 'D. Alternativa D'),
  (g % 4),
  true
from modules m cross join generate_series(1, 6) g
where m.ord between 1 and 4;

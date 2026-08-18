-- Seed de desenvolvimento — Estratégia Internacional
-- Conteúdo real de módulos e aulas (do design final) + banco de questões de EXEMPLO
-- só para testar o motor de sorteio da prova. As questões reais são trabalho nosso.
-- Idempotente: pode rodar de novo.
--
-- Desde 29/jul/2026 o banco é a fonte única do currículo (`lib/curriculo.ts` lê daqui);
-- este seed é a carga inicial, não uma cópia de código.

-- ------------------------------------------------------------
-- Módulos (0 = boas-vindas, 1..4 = I..IV)
-- ------------------------------------------------------------
insert into modules (ord, titulo, docente) values
  (0, 'Bem-vindo', null),
  (1, 'Macro e Estratégia Global', 'Rodolfo Bastos'),
  (2, 'Renda Fixa e Ações nos EUA', 'Tony Volpon'),
  (3, 'Como Acessar o Mercado Americano', 'Luiz Fernando Roxo'),
  (4, 'Ativos Digitais em Dólar', 'Alexandre Ywata')
on conflict (ord) do update set titulo = excluded.titulo, docente = excluded.docente;

-- ------------------------------------------------------------
-- Aulas
-- ------------------------------------------------------------
-- Módulo 0 (não conta para o gate de 16/16)
insert into lessons (module_id, ord, titulo, descricao, conta_no_gate)
select id, 1, 'Como aproveitar a formação', 'Boas-vindas à formação e um guia rápido de como tirar o máximo dos módulos, dos materiais e da certificação.', false
from modules where ord = 0
on conflict (module_id, ord) do update set titulo = excluded.titulo, descricao = excluded.descricao;

-- Aulas avaliadas (I..IV), via VALUES (módulo, ordem, título, descrição)
with dados(mord, lord, titulo, descricao) as (values
  (1,1,'Por que a dolarização de ativos?','O racional de proteger o patrimônio movendo parte da carteira para o dólar, e o que muda no longo prazo.'),
  (1,2,'O dólar como reserva de valor','O papel da moeda americana na preservação de patrimônio e por que ela ancora a estratégia internacional.'),
  (1,3,'Conta internacional na prática','Como abrir, movimentar e operar uma conta fora do Brasil, do cadastro à primeira remessa.'),
  (1,4,'Carteira global e perfil de investidor','Montando a alocação internacional de acordo com o seu perfil de risco e seus objetivos.'),
  (2,1,'Tesouro americano','Como funciona a renda fixa mais segura do mundo e os caminhos para acessá-la do Brasil.'),
  (2,2,'Crédito privado internacional','Bonds corporativos e as oportunidades de renda em dólar além dos títulos do governo.'),
  (2,3,'Comprando ações nos EUA','Como encontrar, analisar e selecionar stocks: análise fundamentalista e técnica aplicadas ao mercado americano, do primeiro filtro à decisão de alocação.'),
  (2,4,'Dividendos vs. growth investing','Duas filosofias de investimento em ações e como decidir qual faz sentido para a sua carteira.'),
  (3,1,'ETFs','Investindo em cestas diversificadas de ativos com um único papel, de forma simples e barata.'),
  (3,2,'REITs','Como investir no mercado imobiliário americano e receber aluguéis em dólar.'),
  (3,3,'BDRs','Acessando ações e ETFs internacionais direto pela bolsa brasileira.'),
  (3,4,'Tributação e sucessão internacional','Impostos, declaração e planejamento sucessório dos ativos mantidos no exterior.'),
  (4,1,'Bitcoin e Ethereum','Os fundamentos dos dois principais criptoativos e o papel de cada um numa carteira dolarizada.'),
  (4,2,'Tokens, RWA e o ecossistema','Além do Bitcoin: tokens, ativos do mundo real (RWA) e como ler o ecossistema cripto.'),
  (4,3,'ETFs e análise on-chain','Exposição por ETF regulado, seja de ativos digitais ou de um setor específico da economia global, com métricas on-chain para ler o que o preço não mostra.'),
  (4,4,'Tributação de criptoativos','Como declarar e pagar impostos sobre ganhos com criptoativos no Brasil.')
)
insert into lessons (module_id, ord, titulo, descricao, conta_no_gate)
select m.id, d.lord, d.titulo, d.descricao, true
from dados d join modules m on m.ord = d.mord
on conflict (module_id, ord) do update set titulo = excluded.titulo, descricao = excluded.descricao;

-- ------------------------------------------------------------
-- Regras da política de estreia (plano de correções de 17/ago, item 3)
-- ------------------------------------------------------------
-- Num banco NOVO a migration 0016 roda antes deste seed, quando `modules` está vazia: a
-- política "Esteira semanal" nasce ativa e sem regra nenhuma, e tudo cai no "em breve".
-- Quem semeia as regras é este arquivo, que é quem cria os módulos. `do nothing` preserva
-- o que o admin já tiver editado pela tela.
insert into release_rules (policy_id, module_id, tipo, dias)
select p.id, m.id, 'dias', greatest(0, m.ord - 1) * 7
from release_policies p, modules m
where p.nome = 'Esteira semanal'
on conflict (policy_id, module_id) do nothing;

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

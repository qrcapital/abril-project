-- ============================================================
-- 0030: Módulo II com as três aulas gravadas pelo Tony Volpon (08/out/2026)
-- ============================================================
--
-- O Módulo II foi planejado com quatro aulas e o Tony gravou três (no Panda: TONY VOLPON - VÍDEO 01,
-- 02 e 03). Pelas transcrições (`transcricoes/modulo-1/`), a terceira gravação cobre as duas últimas
-- aulas planejadas, "Comprando ações nos EUA" e "Dividendos vs. growth investing": é uma aula só
-- sobre ações americanas, com crescimento, valor e dividendos dentro dela. Por isso a aula 3 recebe o
-- vídeo 03 e a aula 4 sai (o material em PDF dela vai junto, em cascata). O módulo passa a ter três
-- aulas, e o notebook (`content/notebooks/modulo-1.ts`) tem uma seção por aula.
--
-- `panda_video_id` é o ID do PLAYER do Panda (o do `?v=` do embed), não o do painel: o do painel não
-- toca (descoberto nas aulas do Rodolfo, 07/out/2026). Duração em segundos, do próprio Panda.
--
-- Rodar inteira no SQL editor do projeto estrategia-internacional. Escrita para rodar uma vez.

begin;

update lessons
   set titulo = 'O paradoxo do devedor mais seguro do mundo',
       descricao = 'Por que o país mais endividado do planeta paga um dos menores juros, e como os títulos do Tesouro americano viram a régua de toda a renda fixa em dólar e a âncora de uma carteira internacional.',
       panda_video_id = 'fe74b31a-835c-4dc3-bc6f-02eb5b4c59d4',
       duracao = 2671,
       conta_no_gate = true
 where id = '9a925e4c-43cf-49ce-9631-d141044af16f';

update lessons
   set titulo = 'O spread não é de graça',
       descricao = 'O crédito das empresas americanas, do investment grade, que se comporta como uma Treasury que paga um pouco mais, ao high yield, que anda junto com a bolsa: como ler o rating, a perda esperada e a fronteira do grau de investimento.',
       panda_video_id = 'f275689a-8fed-4712-b2f0-d732940b08de',
       duracao = 2965,
       conta_no_gate = true
 where id = 'cfda323b-8b3d-4390-83e1-da9406a16afe';

update lessons
   set titulo = 'O prêmio de quem fica',
       descricao = 'O que a bolsa americana pagou em 125 anos, quando decepcionou, por que virou um índice de tecnologia, crescimento contra valor e o papel dos dividendos, e o S&P 500 contra o Ibovespa em dólar.',
       panda_video_id = 'ed57a132-4d89-435b-b8f7-4a87efc309ba',
       duracao = 2786,
       conta_no_gate = true
 where id = '0acf9333-8b35-44cd-93e3-c6cfd5e50f0c';

-- A antiga aula 4 ("Dividendos vs. growth investing") está dentro da aula 3.
delete from lessons where id = '760292c2-a72c-4a0e-9e66-38c1b651337b';

commit;

-- Conferência
select l.ord, l.titulo, l.panda_video_id, l.duracao
  from lessons l join modules m on m.id = l.module_id
 where m.ord = 1
 order by l.ord;

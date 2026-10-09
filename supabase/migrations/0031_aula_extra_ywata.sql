-- ============================================================
-- 0031: Módulo IV ganha uma quinta aula (Alexandre Ywata) e a formação volta a ter 16 aulas
-- ============================================================
--
-- Decisão do Marcelo (10/out/2026): a formação tem 16 aulas, sempre. Com o Módulo II em três aulas
-- (0030), o total caiu para 15. Entra "Custódia e segurança" no Módulo IV, antes da tributação, que
-- passa a fechar o módulo como aula 5. Sem vídeo ainda: o panda_video_id entra quando a aula for
-- gravada. Conta para o certificado, como as outras.
--
-- Rodar inteira no SQL editor do projeto estrategia-internacional. Escrita para rodar uma vez.

begin;

-- A tributação desce para a posição 5 (unique (module_id, ord) exige abrir a vaga antes)
update lessons l
   set ord = 5
  from modules m
 where m.id = l.module_id and m.ord = 3 and l.ord = 4;

insert into lessons (module_id, ord, titulo, descricao, conta_no_gate)
select m.id, 4, 'Custódia e segurança',
       'Onde o ativo digital fica guardado e quem responde por ele: corretora, custodiante ou carteira própria, chaves, golpes comuns e os cuidados de herança.',
       true
  from modules m
 where m.ord = 3;

commit;

-- Conferência: 16 aulas no total, 5 no Módulo IV
select m.ord, m.titulo, l.ord, l.titulo
  from lessons l join modules m on m.id = l.module_id
 where m.ord = 3
 order by l.ord;
select count(*) as total_aulas from lessons where conta_no_gate;

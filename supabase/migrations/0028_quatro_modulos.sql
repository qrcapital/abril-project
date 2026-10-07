-- ============================================================
-- 0028: O curso passa a ter 4 módulos, sem Módulo 0 (05/out/2026)
-- ============================================================
--
-- Decisão do Marcelo em 05/out/2026: não existe mais o Módulo 0 de boas-vindas. O curso começa pelas
-- duas aulas do Felippe Hermes, que passam a abrir o Módulo I, seguidas de duas aulas do Rodolfo
-- Bastos. O Módulo I abre na hora da compra; os outros três seguem a esteira semanal.
--
--   ord 0  Módulo I    Macro e Estratégia Global      Felippe Hermes e Rodolfo Bastos   abre no ato
--   ord 1  Módulo II   Renda Fixa e Ações nos EUA     Tony Volpon                       +7 dias
--   ord 2  Módulo III  Como Acessar o Mercado Americano  Luiz Fernando Roxo             +14 dias
--   ord 3  Módulo IV   Ativos Digitais em Dólar       Alexandre Ywata                   +21 dias
--
-- O `ord` continua começando em 0 de propósito: a política de liberação e o calendário indexam as
-- regras pela posição do módulo (`regras[ord]`). O que mudou é o RÓTULO: `lib/curso.ts` passou a
-- chamar o ord 0 de "Módulo I".
--
-- As duas aulas do Rodolfo entram com título, descrição e vídeo do Panda definidos em 07/out/2026,
-- depois da leitura das transcrições (`transcricoes/modulo-0/aula-3.txt` e `aula-4.txt`). As outras
-- duas vagas do antigo Módulo I (que nunca tiveram vídeo) saem, com os resumos em PDF delas.
--
-- Rodar inteira no SQL editor. Não é idempotente: escrita para rodar uma vez sobre o banco de 05/out.

begin;

-- 1. O antigo Módulo 0 vira o Módulo I
update modules
   set titulo = 'Macro e Estratégia Global',
       docente = 'Felippe Hermes e Rodolfo Bastos'
 where id = 'b8224a06-be0f-4ed3-a0cd-1fe6727fb4b1';

-- As duas aulas do Felippe passam a contar para o certificado (a segunda não contava, por ser
-- "aula extra" do módulo de boas-vindas).
update lessons set conta_no_gate = true
 where module_id = 'b8224a06-be0f-4ed3-a0cd-1fe6727fb4b1';

-- 2. Duas aulas do Rodolfo, depois das do Felippe
delete from materials
 where lesson_id in ('62942a48-99b4-4835-9633-c819a89c32a3', '1deae6fb-dbe4-41ab-8e2f-a9cdd457cad4');

update lessons
   set module_id = 'b8224a06-be0f-4ed3-a0cd-1fe6727fb4b1', ord = 3,
       titulo = 'Menos de 1% do mundo, quase 100% do patrimônio',
       descricao = 'Rodolfo Bastos, ex-CEO da XP nos Estados Unidos, mostra que o brasileiro concentra quase tudo num mercado que é menos de 1% das opções globais, e que o motivo não são os juros, mas vieses como o home bias e a ancoragem.',
       panda_video_id = '830546aa-c3db-48bd-9d98-ac91e2f65159',
       conta_no_gate = true
 where id = '62942a48-99b4-4835-9633-c819a89c32a3';

update lessons
   set module_id = 'b8224a06-be0f-4ed3-a0cd-1fe6727fb4b1', ord = 4,
       titulo = 'O comportamento decide antes da planilha',
       descricao = 'Por que tentar acertar o momento do dólar costuma custar caro, o que o tamanho, a composição e a demografia dos mercados americano e brasileiro dizem sobre diversificar, e o que sustenta a decisão no longo prazo.',
       panda_video_id = '281ea869-7e1e-44ea-a1fd-6fae086bb057',
       conta_no_gate = true
 where id = '1deae6fb-dbe4-41ab-8e2f-a9cdd457cad4';

-- A apostila do antigo Módulo I acompanha o título, que foi para o novo Módulo I.
update materials set module_id = 'b8224a06-be0f-4ed3-a0cd-1fe6727fb4b1'
 where id = 'b11b78a6-80ae-489b-bba2-c00eacc5f2be';

-- 3. Sai o antigo Módulo I (as duas aulas restantes, os resumos e a regra vão em cascata)
delete from modules where id = '10c459d0-2f4b-484e-964f-db54d75133d8';

-- 4. Os seguintes sobem uma posição, um por vez (o `ord` é único e tem check de 0 a 4)
update modules set ord = 1 where id = 'ba37e1c0-c8fb-4bd7-b6f9-50dd20af5ef7';
update modules set ord = 2 where id = 'bc5372ee-816c-4095-87c5-1743aa8afc43';
update modules set ord = 3 where id = '1b602533-a72c-4321-b113-5cd567db40aa';

-- 5. Esteira: I no ato, II em 7 dias, III em 14, IV em 21
update release_rules r set tipo = 'dias', dias = m.ord * 7, abre_em = null, depende_de_ord = null
  from modules m
 where m.id = r.module_id;

-- 6. Textos de e-mail que citavam o Módulo 0
update email_templates
   set corpo = replace(corpo, 'do Módulo 0 ao IV', 'do Módulo I ao IV'), updated_at = now()
 where chave = 'certificado';

update email_templates
   set corpo = replace(corpo,
         'Depois comece pelo módulo zero, "Comece por aqui", que mostra como o curso funciona e por onde seguir.',
         'Depois é só começar pelo Módulo I, que já está liberado na sua área.'),
       updated_at = now()
 where chave = 'boas-vindas';

commit;

-- Conferência
select m.ord, m.titulo, m.docente, (select count(*) from lessons l where l.module_id = m.id) aulas,
       (select r.dias from release_rules r where r.module_id = m.id) dias
  from modules m order by m.ord;

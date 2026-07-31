-- ============================================================
-- 0013 — A nota de corte sai de variável e vira texto (PRD §7)
-- ============================================================
--
-- Decisão do Pedro em 31/jul/2026: `{{minimo}}` não precisa ser variável, porque a nota mínima é 70 e
-- é premissa travada do PRD. Concordo com o argumento: variável que nunca varia é uma linha a mais na
-- legenda que quem escreve tem de entender para descobrir que ela não muda nada.
--
-- POR QUE ISSO É MIGRATION E NÃO EDIÇÃO NO PAINEL, que é o caminho normal para copy: a mudança de
-- texto está **acoplada a uma mudança de código**. Tirar `minimo` do contrato de variáveis sem trocar
-- o corpo deixaria a frase "o mínimo para aprovação é %" — o interpolador substitui variável ausente
-- por vazio, de propósito, para nunca mostrar `{{minimo}}` cru a um aluno. Os dois lados precisam
-- andar juntos, e o `ei-prod` precisa nascer com o texto certo.
--
-- O `where` faz a migration ser idempotente e, mais importante, **não pisar em edição feita no
-- painel**: se alguém já reescreveu esse parágrafo, não há `{{minimo}}` para trocar e nada acontece.
--
-- TETO CONHECIDO, e é o preço da decisão: o "70%" agora é texto. Se a nota de corte mudar no
-- `NOTA_MINIMA`, este e-mail continua dizendo 70 e nenhum check pega, porque o corpo vive no banco e
-- os checks não leem copy. Quem mexer no corte tem que passar por aqui — está anotado no PRD §7.

update email_templates
   set corpo = replace(corpo, '{{minimo}}', '70'),
       updated_at = now()
 where chave = 'resultado-reprovado'
   and corpo like '%{{minimo}}%';

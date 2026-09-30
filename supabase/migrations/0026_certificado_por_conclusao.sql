-- ============================================================
-- 0026: Certificado por conclusão das aulas, sem prova final (30/set/2026)
-- ============================================================
--
-- DECISÃO DO DONO EM 30/SET/2026: o curso não tem prova final nem e-book. O certificado de conclusão
-- passa a ser emitido quando o aluno conclui todas as aulas que contam (`lessons.conta_no_gate`), no
-- momento em que marca a última delas (`marcarAula` em `app/app/(sala)/modulo/[m]/actions.ts`, via
-- `emitirSeConcluiu` de `lib/certificados.ts`). Nesse momento sai o e-mail `certificado`, que é o
-- template novo desta migration.
--
-- O QUE ESTA MIGRATION NÃO FAZ, de propósito:
--
-- - **Não apaga tabela nem função da prova.** `questions`, `exams`, `sortear_prova()` e
--   `responder_prova()` ficam no banco, sem leitor no código. Apagar histórico de prova de quem já
--   fez não tem ganho, e certificado emitido pela prova continua valendo com o mesmo código.
-- - **Não mexe no enum `material_tipo`.** O valor `ebook` continua existindo; a tela do aluno é que
--   filtra esse tipo (`lib/materiais.ts`). Tirar valor de enum no Postgres é recriar o tipo.
-- - **Não mexe em `certificates`.** O índice único de `user_id` (0012) segue sendo quem decide a
--   corrida entre duas marcações simultâneas, e a emissão continua com `insert` que recusa duplicata.
--
-- Idempotente e autossuficiente: pode ser colada inteira no SQL editor do Supabase, e rodar de novo
-- não duplica nada nem pisa em texto editado pelo painel.

-- ------------------------------------------------------------
-- 1. O template `certificado`
-- ------------------------------------------------------------
--
-- Variáveis: `{{nome}}` e `{{codigo}}`, o contrato de `VARIAVEIS` em `lib/email-render.ts`. O destino
-- do botão vem do gatilho (`/app/certificado`), nunca do texto, como em todo template (ver a 0009).
-- Cada linha do corpo é um parágrafo.
--
-- `on conflict do nothing`: se o template já existir (migration reaplicada, ou alguém criou pelo
-- painel), o texto de lá vence.

insert into email_templates (chave, assunto, corpo, cta, ativo, updated_at)
values (
  'certificado',
  'Seu certificado da Estratégia Internacional está pronto',
  E'{{nome}}, parabéns: você concluiu todas as aulas da Estratégia Internacional, do Módulo 0 ao IV, e o seu certificado de conclusão de 30 horas acabou de ser emitido.\n'
  'Ele já está na sua área, com download em PDF e o código de verificação {{codigo}}, que qualquer pessoa confere online. Guarde esse código, porque é ele que um recrutador pede quando você cita a formação no currículo ou no LinkedIn.',
  'Ver meu certificado',
  true,
  now()
)
on conflict (chave) do nothing;

-- ------------------------------------------------------------
-- 2. Os e-mails de resultado da prova saem de uso
-- ------------------------------------------------------------
--
-- Nenhum código dispara mais `resultado-aprovado` nem `resultado-reprovado`, e os dois saíram da tela
-- `/admin/emails` (que lista só as chaves registradas em `lib/email-render.ts`). As linhas ficam, para
-- o `email_log` antigo continuar apontando para algo que existe, mas desligadas: se algum código
-- esquecido chamar, o envio vira "desligado" no log em vez de mandar um resultado de prova que não
-- existe mais.

update email_templates
   set ativo = false,
       updated_at = now()
 where chave in ('resultado-aprovado', 'resultado-reprovado')
   and ativo;

-- ------------------------------------------------------------
-- 3. Termos de Uso, revisão de 30/set/2026
-- ------------------------------------------------------------
--
-- Os Termos diziam que o certificado dependia da aprovação numa Avaliação Final. O texto foi ajustado
-- no mínimo necessário (a condição passou a ser a conclusão das aulas; o resto ficou igual) e a versão
-- vigente em `lib/consentimento.ts` (`VERSOES.termos`) virou '2026-09-30'. É essa constante que faz a
-- sala pedir o aceite de novo; esta linha só registra a revisão no histórico, como a 0023 fez com a
-- primeira. Sem ela o aceite grava do mesmo jeito, com `documento_id` nulo.

insert into consent_documents (tipo, versao, vigente_desde)
values ('termos', '2026-09-30', now())
on conflict (tipo, versao) do nothing;

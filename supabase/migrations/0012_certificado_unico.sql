-- ============================================================
-- 0012 — Um certificado por aluno (PRD §8)
-- ============================================================
--
-- A tabela `certificates` já nasceu com `codigo` unique, o que garante que dois alunos não
-- compartilhem código. Faltava a outra metade: **nada impedia o mesmo aluno de ter dois**.
--
-- Por que isso aconteceria na prática, e não em teoria: a emissão dispara na aprovação, e a aprovação
-- tem dois caminhos (o botão "Enviar" da prova e a rotina que fecha prova abandonada). Some a isso a
-- 2ª chamada, em que o aluno reprovado tenta de novo e passa. Sem esta restrição, duas rotas
-- concorrentes ou uma segunda tentativa aprovada produziriam duas linhas, e o aluno passaria a ter
-- **dois códigos válidos** para o mesmo curso — os dois verificáveis publicamente, sem nada dizendo
-- qual é o dele.
--
-- O índice único é o que faz o `on conflict do nothing` da emissão ser suficiente: quem chegar
-- segundo não grava, e a leitura seguinte devolve o certificado que já existe. É a mesma escolha do
-- webhook do Guru com `guru_order_id`: deixar o banco decidir a corrida em vez de conferir antes de
-- escrever, que é onde mora a janela entre a checagem e a gravação.

create unique index if not exists certificates_user_unico on certificates(user_id);

comment on index certificates_user_unico is
  'Um certificado por aluno. A emissao usa on conflict do nothing e conta com esta restricao.';

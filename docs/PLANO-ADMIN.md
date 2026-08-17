# Plano — Área Administrativa (V2)

> **Escopo V2.** Fica planejado para depois — o foco atual (V1/homolog) é fechar as
> pendências da LP e da área do aluno. Este documento é a planta para quando
> começarmos o admin.

Plano de construção do admin (`/admin/*`) da Estratégia Internacional. Complementa
`ROUTES.md` (rotas) e `PRD.md` (regras). Objetivo: um painel enxuto para a operação
gerenciar alunos, acesso, prova e comunicação — sem tocar no checkout (Guru) nem no
conteúdo do curso pelo aluno.

_Rascunho para aprovação — 2026-07-20._

## 1. Princípios

- **Fora da experiência do aluno.** Navegação, layout e URL próprios (`/admin`), sem
  o chrome da área do aluno.
- **Design próprio no Meridiano/Tailwind.** Não há bundle de design para o admin (só
  LP e Área do Aluno foram entregues como HTML). É onde o Tailwind + tokens do
  Meridiano voltam: UI funcional e sóbria (tabelas, filtros, cards de métrica,
  formulários), sem o peso editorial.
- **Homolog-first.** Cada tela nasce funcional com dados de exemplo/seed; depois
  pluga o Supabase; por fim, as ações que mutam de verdade.
- **Role-based.** Só entra `role = admin`.

## 2. Acesso e segurança

- ~~Guarda em `proxy.ts`~~: **a guarda mora no `app/admin/layout.tsx`** (construído em
  30/jul/2026). O plano dizia proxy, e mudou pelo mesmo motivo que já tirou a guarda de
  matrícula de lá: o proxy roda em toda requisição do site, inclusive na LP, e responder
  "é admin?" custa uma ida ao banco que a LP não deveria pagar. O proxy segue fazendo o que
  sabe, que é renovar a sessão.

  Consequência que exige atenção: **o proxy só protege `/app/*`**, então `/admin` recebe
  visita anônima, e são dois casos com respostas diferentes de propósito:

  | Quem chega | Resposta | Por quê |
  |---|---|---|
  | Sem sessão | `redirect("/app/login")`, 307 medido | Não revelou nada sobre si; 404 aqui deixaria o admin legítimo de fora sem entender que só faltava entrar |
  | Logado, não admin | `notFound()` → 404 | Redirecionar para `/app` **confirmaria** que `/admin` existe para qualquer aluno que digitasse o endereço |

  As duas verificadas em 30/jul: o anônimo por `curl` (307 com `location: /app/login`), e o
  404 na tela, com sessão de aluno. A prova do segundo fecha porque anônimo dá 307, então um
  404 só pode vir de sessão existente e sem o papel.
- A checagem usa a função **`is_admin()`** já existente no banco (RLS por papel), e não um
  `select is_admin from profiles`, porque é a MESMA função em que as dez policies se apoiam:
  se a definição de admin mudar, guarda e RLS mudam juntas.

  Ela é chamada com o cliente **anon**, não com a service role, e isso contradiz de propósito
  a linha seguinte deste plano: a service role não tem sessão, `auth.uid()` é null nela, e ela
  responderia "não é admin" para todo mundo. Identidade se pergunta com a chave do usuário; o
  resto (os dados que o painel mostra) é que vai pela service role.
- Todas as leituras/escritas do admin passam pelo cliente **service role** apenas em
  rotas de servidor (nunca no browser), respeitando as políticas.
- Ações sensíveis registram quem fez e quando. **Definido em 31/jul/2026: a tabela `admin_audit`**
  (migration `0014`), com autor, ação, alvo, `detalhe` em jsonb e data. Escrita só pela service role,
  depois da checagem de papel da rota; RLS ligada e sem policy, então para anon e authenticated ela não
  existe. O `autor_email` é congelado junto do id, e o id é `on delete set null`, porque auditoria que
  desaparece com quem foi auditado não é auditoria.

  Ficou "a definir" por três levas (papel de admin, apagar aula, apagar questão), todas resolvendo com
  `console.log`, cujo teto estava anotado na rota de papel: log de servidor tem retenção curta e
  ninguém consulta de propósito. A liberação de 2ª chamada foi a quarta, e a que mais pede rastro:
  devolver a alguém o direito de refazer uma prova de tentativa única é decisão caso a caso de uma
  pessoa.

  ~~**Ainda não há tela para consultar o rastro**~~ **FEITA no mesmo dia**, em `/admin/auditoria`,
  com a `listar_auditoria` da migration `0015`. Ela é **somente leitura, sem exceção**: apagar linha
  de auditoria pelo painel desfaria o motivo de ela existir. Qualquer admin lê, não só o mestre, e a
  busca casa com autor, alvo ou nome da ação.

  **Ela se pagou antes de ficar pronta.** Foi na primeira lista carregada que apareceu uma edição de
  nome que ninguém tinha feito, causada pelo preenchimento automático do navegador em cima do
  salvamento automático da tela do aluno (detalhe no `CHANGELOG.md`). É o argumento de auditoria em
  uma frase: o registro pegou uma alteração que nenhuma pessoa teria notado.

## 3. Casca (layout do admin)

- **Sidebar** fixa: Painel · Alunos · Questões · **Conteúdo** (§4.6) · E-mails, e depois de uma
  régua, **Equipe** (§4.7) e **Auditoria** (§2). A régua separa quem **opera** de o que é
  **operado**. Rodapé com **"Área do aluno"**, "voltar ao site" e sair.

  **"Área do aluno" entrou em 31/jul/2026, a pedido do Pedro.** Leva a `/app` com a conta do próprio
  admin, e não é personificação: matrícula, progresso e esteira semanal são os dele. Abre em outra
  aba porque o chrome do aluno não tem caminho de volta para o `/admin`. Quando a matrícula do admin
  não está ativa (o caso de quem opera o suporte sem ter comprado), o item aparece sem link e marcado
  "sem acesso", pelo mesmo motivo do "em breve" abaixo.

  Construída em 30/jul/2026. Item cuja tela ainda não existe aparece sem link e marcado "em
  breve": a alternativa era listar seis links e entregar quatro 404, e navegação é a promessa da
  casca. **Desde 31/jul/2026 nenhum item está nesse estado**, porque as seis telas existem; o
  caminho do "em breve" fica no código para a próxima tela que aparecer.
- **Header**: título da tela, busca contextual, avatar do admin.
- Estados de tabela: carregando, vazio, erro, paginação. Padrões reutilizáveis.

## 4. Telas

### 4.1 `/admin` — Painel

> **Redesenhado em 17/ago/2026** ("muito cru e com poucas informações", nas palavras do Pedro).
> Cinco blocos, na ordem das perguntas de quem abre:

- **Os quatro cards** de sempre: matrículas, conclusão, aprovação, certificados. NPS segue
  fora até a pesquisa existir.
- **Precisa de você**: só o que exige ação, com link da tela que resolve — e-mails falhando
  (24 h), módulo abaixo do piso de questões, prova com prazo estourado, matrículas expirando em
  30 dias, alunos parados há 7+ dias, banco abaixo da meta. Nada pendente vira uma linha.
- **Funil da formação**: do acesso ativo ao certificado, em barras; é onde se vê ONDE os
  alunos param. Conta só matrículas ativas.
- **Últimas ações da auditoria** (decisão do Pedro: auditoria aqui, não feed com nome de
  aluno), com link para a tela.
- **Saúde do sistema**: política de liberação ativa (com os avisos dela), régua do banco de
  questões, e-mails das últimas 24 h.
- **Relatórios em CSV** (`api/relatorios`): alunos e progresso, log de e-mails e auditoria.
  Ponto e vírgula + BOM (Excel pt-BR abre com dois cliques), em cima das RPCs que as telas já
  usam (`listar_alunos`, `listar_emails`, `listar_auditoria`, teto de 1000 linhas). **Toda
  exportação é auditada** (`relatorio.exportar`): é dado de aluno saindo do sistema.
- _Dados_: agregações sobre `enrollments`, `progress`, `exams`, `certificates`, `email_log`,
  `questions`, `release_policies` e `admin_audit`.

### 4.2 `/admin/alunos` — Lista + busca

> **FEITA em 30/jul/2026.** Migration `0006_listar_alunos.sql`, aplicada no homolog.

- Tabela: nome, e-mail, status de acesso (ativo/expirado/revogado), progresso (X/16),
  situação da prova. Busca por nome/e-mail; filtro por status.
- _Dados_: `profiles` + `enrollments` (+ resumo de `progress`/`exams`).

**Uma consulta, não N+1.** `listar_alunos(termo, limite)` agrega em SQL porque a alternativa é
puxar `progress` inteiro (16 linhas por aluno) e `exams` inteiro para contar na memória. Com nove
contas dá na mesma; com uma turma de verdade, são dezenas de milhares de linhas para exibir uma
tabela.

**O ESTADO DE ACESSO NÃO É CALCULADO EM SQL, de propósito.** A função devolve `status` e
`expires_at` crus, e quem traduz para ativa/expirada/revogada/ausente é o
`lib/matricula-estado.ts` — a **mesma** função que a guarda do aluno usa. Repetir a regra em SQL
criaria uma segunda verdade sobre quem tem acesso, e a divergência não apareceria em build nem em
lint: apareceria no suporte, com o painel dizendo "ativo" para quem o app tranca na porta.

Essa decisão custou uma extração: a derivação morava dentro do `getMatricula`, acoplada à sessão do
aluno logado, e virou função pura com 12 casos em `npm run check:matricula`. **Consequência de
projeto:** o filtro por status roda depois da derivação, em TypeScript, e não na cláusula `where`.

**Busca e filtro em `<form method="get">`**, com os termos na URL: nenhuma linha de JS, e o
resultado fica compartilhável e recarregável. Ao contrário do `buscar_usuarios`, aqui termo vazio
devolve TODOS, porque lista que abre vazia esconde a operação; o `limite` é que segura o tamanho, e
a tela avisa quando ele é atingido.

### 4.3 `/admin/alunos/[id]` — Detalhe do aluno
- **Dados**: nome, e-mail, `guru_customer_id`, datas de acesso.
- **Progresso**: aulas concluídas por módulo (`progress`).
- **Prova**: tentativas, notas, situação (`exams`).
- **Ações**:
  - Reenviar acesso / e-mail de boas-vindas (→ SES).
  - Trocar e-mail.
  - Liberar 2ª chamada da prova.
  - Revogar ou estender acesso (`enrollments`).
  - _As que dependem de SES/Guru ficam para a Fase 3._

> **FEITA em 30/jul/2026, somente leitura.** Cadastro e datas, progresso por módulo (com a coluna
> "conta no gate", que explica por que o Módulo 0 não entra no 16/16) e a tabela de tentativas da
> prova com nota e horários.
>
> **ATUALIZADO em 31/jul/2026, e a tela deixou de ser só leitura.** Entraram, nesta ordem: reenviar
> acesso, liberar 2ª chamada e, a pedido do Pedro, a **edição de nome, e-mail, telefone e progresso
> por módulo**. O que destravou tudo foi a auditoria (`admin_audit`, migration `0014`), que era a
> dívida citada no parágrafo abaixo: agora cada ação grava quem fez, em quem, e o de/para.
>
> **A edição é no lugar:** "Editar" no alto, os três campos viram caixa de texto onde já estavam, e
> cada um salva ao perder o foco ou no Enter, com Escape para desfazer. Sem botão "Salvar".
>
> **Quatro decisões da edição que não são óbvias:**
>
> - **Salva ao sair do campo, nunca por debounce de tecla.** O e-mail é o login: gravar um endereço
>   pela metade a caminho do certo trocaria o acesso do aluno por algo que não existe.
> - **O nome é gravado em dois lugares** (`profiles.nome` e `user_metadata.nome`), porque são duas
>   moradas com leitores diferentes: a verificação **pública** do certificado lê a primeira, as telas
>   do aluno e os e-mails leem a segunda, e o trigger só copia uma vez, no cadastro.
> - **E-mail repetido é conferido antes de gravar**, pela `buscar_usuarios`: o erro do Admin API para
>   esse caso vem como status 500 com `message` igual a `"{}"`, indistinguível de queda de rede.
> - **Progresso por módulo, não por aula**, que é o caso real do suporte ("assisti tudo e não
>   marcou"). Limpar pede confirmação e avisa quando fecha o acesso à prova.
>
> **Revogar e estender acesso seguem fora**, agora só por decisão de produto sobre a matrícula.
>
> _(Contexto de 30/jul, mantido:)_ As ações continuam fora, inclusive as duas que não dependem de
> integração (liberar 2ª chamada e estender acesso). O §2 pede auditoria para ação sensível, e a tela
> de Equipe já abriu essa dívida com log de servidor; somar mais três ações sobre o mesmo rastro
> fraco é a hora errada.
>
> **Leitura mista, e a mistura é a escolha barata:** `aluno_modulos` é função da `0006` porque
> agrupar por módulo é agregação; o resto vem do PostgREST direto, porque é uma linha por tabela
> para um aluno só. O e-mail vem do Admin API (`getUserById`), o único jeito de alcançar
> `auth.users` sem função nova. `aluno_modulos` parte de `modules` com `left join` para devolver
> **todos** os módulos: módulo ausente da lista seria lido como "não existe" em vez de "nada feito
> aqui".

### 4.4 `/admin/questoes` — Banco de questões

> **CONSTRUÍDA em 31/jul/2026**, a pedido do Pedro, antes das ~100 questões existirem: a casca vale
> por si, porque escrever questão sem tela é escrever SQL. **Nenhuma migration foi necessária** — a
> tabela `questions` já tinha tudo, e é a primeira tela do painel que não precisou de banco novo.

- CRUD por módulo: enunciado, 4 alternativas, qual é a correta, ativo/inativo. Cada questão é um
  formulário com [Salvar] e [Apagar]; cada módulo tem um formulário de questão nova.
- **Quatro módulos e não cinco**, porque é o que o sorteio usa (`m.ord between 1 and 4`). Um acordeão
  do Módulo 0 aqui seria convite a escrever questão que nunca cai na prova.
- **Duas réguas por módulo, e a diferença entre elas decide a prioridade:**
  - **piso de 5 ativas** (o `q.rn <= 5` do `sortear_prova`): abaixo dele o sorteio não completa as 20,
    o `abrirTentativa` estoura e **a prova para de abrir para todos os alunos**. Aviso vermelho na
    tela, e desde 31/jul também uma asserção no `npm run check:curriculo`, que fala com o banco;
  - **meta de 25** (PRD §7): acima do piso a prova abre, mas com banco pequeno dois alunos veem quase
    as mesmas questões. Com as 6 do seed, dois sorteios repetem 19 das 20.
- **Apagar existe além de desativar**, e a confirmação diz o que ninguém sabe de cabeça: prova já
  feita **não muda**, porque cada tentativa guarda `exams.questions_snapshot` com enunciado e gabarito
  de quando o aluno respondeu. Desativar é para questão que pode voltar; apagar é para questão que
  nasceu errada.
- Os números (4 alternativas, 5 por módulo, meta de 25) saíram para `lib/questoes.ts`, derivados de
  `TOTAL_QUESTOES` onde faz sentido: eles viviam em três lugares que não conversavam (o `CHECK` da
  migration, o `sortear_prova` e a prosa do PRD).
- _Dados_: `questions` (leitura e escrita pela service role).

**A rota de escrita é a mais sensível do painel**, e o comentário em caixa dela diz por quê: a coluna
`correta` é o gabarito, a tabela é fechada para o aluno de propósito, e a escrita sai pela service
role. Sem a checagem de papel dentro da rota, qualquer pessoa logada editaria o gabarito do próprio
exame.

### 4.5 `/admin/emails` — Log de e-mails

> **CONSTRUÍDA em 31/jul/2026**, com migration `0008_listar_emails.sql` aplicada no `ei-homolog`.

- Tabela: quando, aluno, template, status. Somente leitura, e a tela diz isso: não dispara nem
  reenvia.
- **Busca por e-mail ou template** num `<form method="get">`, com o termo na URL. São as duas
  perguntas que se faz a um log ("o que foi para esta pessoa?" e "quem recebeu este template?"), e
  uma caixa que responde as duas custa menos que dois filtros.
- _Dados_: `email_log` (somente leitura), via `listar_emails`.

**Ela nasce mostrando estado vazio, e é por isso que valeu construir agora.** O SES não está
configurado (PRD §14: 12 dos 14 templates saem por ele) e hoje só o webhook do Guru escreve uma
linha aqui, na compra aprovada. Tela existindo antes do dado é o que faz alguém olhar o log no
primeiro dia, em vez de descobrir meses depois que ninguém recebeu nada.

**Três decisões pequenas que evitam retrabalho:**

- **`left join` em `auth.users` e `profiles`, não join comum.** `email_log.user_id` é
  `on delete set null`: o registro do envio sobrevive à conta que o recebeu, e é isso que faz dele
  um log. Com join comum, apagar uma conta apagaria o histórico **da tela** sem apagar nada do
  banco. A linha mostra "conta removida".
- **O nome do template aparece cru.** Quem escreve o valor é quem dispara (hoje `boas-vindas`), e um
  mapa de rótulos aqui seria uma segunda lista para manter sincronizada: template novo cairia na
  tela como branco ou "—", pior que ler o identificador real.
- **O tom do status é conservador.** O vocabulário é de quem envia (o webhook grava `queued` e
  `link_error`; o SES vai trazer os dele), então o padrão é **neutro**. Pintar de vermelho o que não
  se reconhece transformaria cada template novo num incidente falso. `queued` fica em atenção de
  propósito: enfileirado não é entregue.

### 4.6 `/admin/conteudo` — Aulas e materiais

> **Escopo NOVO, decidido pelo Pedro em 29/jul/2026.** Este plano não previa edição de conteúdo:
> a Fase 1 ia de casca a e-mails sem passar por aulas. A tela nasceu de uma pergunta dele sobre
> onde ficariam os links de vídeo, e a resposta puxou o resto junto — **painel não edita código**,
> então tudo o que o admin mexe precisa estar no banco.
>
> A migração que isso exigia **já foi feita no mesmo dia** (tarefa 15b): o `lib/curso.ts` não
> guarda mais as aulas, o currículo vem de `modules`/`lessons` e os materiais de `materials`.
> Trocar título, descrição ou `panda_video_id` no banco já muda a tela **sem deploy**, o que foi
> verificado. Falta só a tela que faz isso com as mãos de alguém.

> **CONSTRUÍDA em 31/jul/2026** e no ar em homolog, com as três decisões abaixo tomadas pelo Pedro
> no mesmo dia. Migration `0007_mover_aula.sql` aplicada no `ei-homolog`.

- **Lista de módulos**, com as aulas de cada um em acordeão, na ordem do curso.
- **Editar módulo**: título e docente.
- **Editar aula**: título, descrição, **link do vídeo** (`panda_video_id`) e se conta para o gate
  de 16/16 (`conta_no_gate`).
- **Reordenar, criar e apagar aula**, o último com confirmação que diz a consequência medida.
- **Materiais**: adicionar, renomear e remover, com o vínculo à **aula** (resumo) ou ao
  **módulo** (apostila), que é a distinção que a tabela já suporta.
- _Dados_: `modules`, `lessons`, `materials` (leitura e escrita).

**As três decisões, como ficaram:**

| Pergunta | Decisão | Consequência |
|---|---|---|
| Arquivo: upload ou URL? | **URL colada** | Zero bucket, zero policy de Storage, zero tela de upload. O template da aula já joga `materials.arquivo` direto no `href`, então nada mudou do lado do aluno. A validação do endereço mora na rota |
| Reordenar aulas? | **Sim**, com setas ↑↓ | A ordem define o número da aula na URL, então link já compartilhado passa a abrir a aula que ficou naquela posição. O aviso está na tela. O progresso acompanha a aula, porque é gravado por `lesson_id` |
| Criar e apagar aula? | **Sim**, com confirmação forte | O diálogo diz **quantos alunos perdem o progresso** gravado naquela aula, contado na hora. O `on delete cascade` leva `progress` e `materials` junto |

**Duas coisas ficaram fora, e não por esquecimento.** `lessons.duracao` e `modules.arte` não têm
leitor nenhum no app hoje (o `getCurriculo` nem seleciona as colunas). Campo de formulário que
grava dado que nenhuma tela mostra é pior que campo ausente: quem preenche fica esperando o
efeito. Entram quando a tela do aluno passar a exibi-los.

**O `tipo` do material é derivado do vínculo** (aula = resumo, módulo = apostila) em vez de
perguntado. É a distinção que o `lib/materiais.ts` já faz ao juntar os dois numa lista só para o
aluno, nada lê a coluna hoje, e um `<select>` a mais seria escolha sem consequência.

**Por que a troca de ordem é uma função no banco** (`mover_aula`, migration `0007`): `lessons` tem
`unique (module_id, ord)` e o Postgres checa unique **linha por linha**, não no fim do comando.
Trocar A com B em dois `update` do supabase-js quebra no primeiro, e passar por um valor
temporário exige os três passos na mesma transação — que uma função plpgsql é e dois `await` não
são. Se falhasse no meio, uma aula ficaria com `ord = -1` e o currículo inteiro sairia de ordem
sem nada reclamar. Ela troca com o **vizinho imediato** e não com `ord ± 1`, porque apagar aula
deixa buraco na numeração.

**Sem JS na tela, por escolha:** acordeão é `<details>` nativo, cada bloco é um
`<form method="post">`, e a ação sai do `name`/`value` do botão de submit clicado — é isso que
deixa [Salvar] [↑] [↓] num formulário só em vez de três. O único componente de cliente é o
diálogo de apagar aula.

### 4.6.1 `/admin/liberacao` — Políticas de liberação de conteúdo

> **Escopo NOVO, pedido pelo Pedro em 17/ago/2026.** Construída no mesmo dia, migration `0016`
> (`release_policies` + `release_rules`, uma ativa por índice único parcial, seed "Esteira
> semanal" reproduzindo a cadência de 29/jul).

- **A política ativa é o padrão de todos os alunos**; as demais são rascunho ou exceção. O
  detalhe do aluno aponta qualquer política só para ele (`enrollments.release_policy_id`,
  migration `0017`, pedido do Pedro no mesmo dia), além da `liberacao_total` de sempre.
  Apagar uma política devolve quem apontava para ela ao padrão.
- Cada política é **uma regra por módulo**, de quatro tipos: acesso livre, em breve
  (indisponível, sem data), dias após a compra, data programada (grava meia-noite de Brasília).
- **Avisa e não trava**, em dois casos: política que deixa o curso concluível dentro da
  garantia de 7 dias, e módulo avaliado (I a IV) em breve. Os avisos entram também no diálogo
  de confirmação do ativar, que é a escrita de maior raio do painel — e por isso as quatro
  ações são auditadas (`liberacao.criar/salvar/ativar/apagar`).
- A ativa não se apaga (o curso cairia inteiro no "em breve" padrão). Módulo sem regra na
  política ativa fica **em breve**: rascunho não vaza.
- Sem JS além dos diálogos de confirmação, como as outras telas: um `<form method="post">` por
  política, ação no `name`/`value`, rota `app/admin/api/liberacao/route.ts` com a checagem de
  papel própria (route handler não passa por layout).

### 4.7 `/admin/equipe` — Quem tem acesso ao painel

> **Escopo NOVO, pedido pelo Pedro em 30/jul/2026**, no mesmo dia da casca. Este plano previa que
> conceder o papel fosse só operação por script; ele pediu que **um admin possa dar admin a
> outros**, com **busca por e-mail**. Construída e no ar. A migration que ela exigiu
> (`0004_buscar_usuarios.sql`) foi aplicada no homolog no mesmo dia.

- **Busca por e-mail**, inteiro ou em parte, num `<form method="get">`: o termo vive na URL, sem
  uma linha de JS, e a busca fica compartilhável e recarregável.
- **Lista de quem tem acesso hoje**, sempre visível, com ou sem busca feita. Sem ela, "dar" e
  "tirar" acontecem no escuro.
- **Dar e remover acesso**, com confirmação pelo padrão 5 do `DESIGN.md` §3. A confirmação diz a
  consequência concreta: admin lê o banco de questões **com o gabarito**.
- _Dados_: `auth.users` + `profiles`, pelas duas funções da `0004`.

**Tela própria, e não um botão dentro de `/admin/alunos`** (§4.2): admin é equipe interna, a lista
de Alunos é uma lista de compradores com progresso e situação de prova, e a pessoa a promover pode
não ser aluna. Procurar um colega ali seria procurar no lugar errado.

### 4.7.1 Dois níveis: admin mestre e admin comum

> **Pedido pelo Pedro em 30/jul/2026**, depois de testar dar e revogar acesso: um **admin mestre**,
> e os outros admins fazem tudo menos mexer no acesso dele. Migration `0005_admin_mestre.sql`,
> aplicada no homolog no mesmo dia.

| | Admin comum | Admin mestre |
|---|---|---|
| Tudo o mais do painel | sim | sim |
| Dar/tirar acesso de admin comum | sim | sim |
| Mexer no acesso de um mestre | **não** | sim |
| Conceder o nível de mestre | **não** | só pelo script |

**Coluna nova (`profiles.is_master`) e não um enum `papel`.** `is_admin()` sustenta **dez policies**
de RLS e o trigger da `0003`; trocar por enum obrigaria a reescrever a função e revalidar as dez,
com risco alto e ganho nenhum. `is_master` é ortogonal, e nenhuma policy existente precisa saber
que a coluna existe.

**"Mestre implica admin" é CHECK no banco**, não acordo de cavalheiros: sem ele o estado
`(is_master=true, is_admin=false)` é representável, e nesse estado o mestre não entra no painel e
**ninguém mais consegue mexer nele**. De quebra o CHECK virou uma segunda camada útil, descoberta
ao testar: rebaixar um mestre sem limpar `is_master` falha na gravação sozinho.

**No código, `papel` continua `"admin"` para os dois níveis**, e mestre é um campo à parte
(`lib/admin.ts`). Se mestre fosse um valor de `papel`, toda checagem na forma `papel !== "admin"`
passaria a trancar justamente o mestre para fora, e a guarda do layout é uma dessas.

**Conceder mestre é só pelo script** (`admin-conta.mjs --mestre`), fora do painel. É o nível que
decide quem mexe em quem, então sai do caminho de quem só tem o navegador. Não foi pedida tela para
isso, e uma segunda UI de privilégio é superfície nova sem demanda.

**`npm run check:mestre` prova as regras contra o banco**, em transação desfeita, com a sessão
forjada por `request.jwt.claims` (redefinir `auth.uid()` não dá: a conexão não é dona do schema
`auth`). Sete asserções, e três merecem nota:

- **A quarta é a que faltava:** o ataque real limpa `is_admin` e `is_master` na MESMA instrução, que
  é a forma que a própria rota usa para revogar. Sem essa asserção o check passava e o caminho
  ficava aberto, porque o CHECK do banco só barra quando `is_master` fica pendurado sozinho.
- **A quinta afirma o que o admin comum PRECISA continuar podendo.** Sem ela, "consertar" apertando
  tudo passaria no teste e quebraria o produto.
- **O check foi rodado contra a versão antiga do trigger e ACUSOU**, então ele tem dentes.

**Onde mora o risco, e as travas.** Esta é a primeira tela do admin que **escreve**, e o
que ela escreve é privilégio:

| Trava | Onde | Por quê |
|---|---|---|
| Checagem de papel dentro da rota | `app/admin/api/papel/route.ts` | **Route handler não passa por layout.** A guarda do §2 não protege endpoint nenhum, e a escrita sai pela service role, onde o trigger `guarda_is_admin` libera. Sem esta linha, a rota é a escalada da `0003` de volta, servida em HTTP |
| Admin comum não mexe em mestre | rota + tela + **trigger** | O pedido do Pedro. É a única trava que existe também no banco, porque é regra de produto e não só de tela |
| Não pode revogar a si mesmo | rota + tela | Sem ela o admin se tranca por fora, e o conserto só volta por psql |
| Não pode revogar o último admin | rota + tela | Mesma trava do `scripts/admin-conta.mjs` |
| Não pode revogar o último mestre | rota + tela | Sem mestre nenhum, ninguém mexe num mestre, e a saída seria o script com a service role |
| Confere lendo de volta | rota | Update pode "passar" sem afetar linha; numa tela de privilégio, sucesso falso é pior que erro |

Todas as travas de limite aparecem na tela como **ausência de botão**, para o admin não descobrir o
limite levando um erro depois do clique; o servidor recusa de novo de todo jeito.

**A regra do mestre vive em DOIS lugares, e a duplicação é consciente.** A checagem em TypeScript é
o controle do caminho do app; o trigger `guarda_is_admin` é o backstop de qualquer caminho direto ao
banco. As duas existem porque o app escreve com a **service role**, onde `auth.uid()` é null e o
trigger passa direto de propósito. É a mesma razão pela qual a `0003` criou o trigger mesmo já tendo
revogado o UPDATE: um guarda por camada, porque neste projeto guarda de uma camada já falhou quatro
vezes em cobrir a vizinha.

**Verificado em 30/jul/2026:** POST direto na rota **sem sessão** dá 404, e **com sessão de aluno**
dá 404 também, testado do próprio navegador logado, com uuid inexistente para nada poder ser
alterado nem se a guarda falhasse. Os grants das duas funções conferidos por
`has_function_privilege`: `anon` e `authenticated` com `f`, `service_role` com `t`.

**Auditoria: a premissa do §8 mudou aqui.** Lá está escrito que auditoria podia esperar porque a
Fase 1 só leria. Esta tela escreve, e o que escreve é a ação mais sensível do produto. Por
enquanto o registro é **log de servidor** (`console.log` com quem fez, o que fez e para quem), que
é rastro de verdade e custa zero migração. **Teto conhecido:** log de servidor tem retenção curta
e ninguém consulta de propósito. O caminho, se a operação crescer, é uma tabela `admin_audit`, e
isso é decisão do Pedro, não foi pedido.

## 5. Modelo de dados (tabelas usadas)

`profiles`, `enrollments`, `modules`, `lessons`, `materials`, `progress`, `questions`,
`exams`, `certificates`, `email_log` — todas já no schema (`supabase/migrations/0001_init.sql`).
Funções úteis: `is_admin`, `has_active_access`, `sortear_prova`, `verify_certificate`.

## 6. Fases

> **As Fases 1 e 2 colapsaram numa só, decisão do Pedro em 30/jul/2026.** A tabela abaixo foi
> escrita em 20/jul, quando o Supabase ainda não existia, e por isso mandava a Fase 1 usar
> dados mock. O Supabase está provisionado desde 28/jul, o schema aplicado, e o currículo vive
> no banco desde 29/jul: construir camada de mock agora seria construir para jogar fora. Cada
> tela nasce lendo o banco.

| Fase | Entrega | Depende de | Estado |
|---|---|---|---|
| **1 — UI funcional** | ~~Casca + Painel (métricas de exemplo)~~ + Questões (CRUD sobre o seed) + ~~Alunos/Detalhe~~/E-mails ~~com dados mock~~ **com dados reais** + **Conteúdo (aulas e materiais)** | — | **Casca, Painel, Equipe (§4.7), Alunos e Detalhe feitos** em 30/jul, todos com dados reais. Faltam **Questões**, **Conteúdo** e **E-mails** |
| **2 — Supabase real** | ~~Todas as leituras vindas do banco; guarda `is_admin` no proxy~~ | Supabase provisionado | **Absorvida pela Fase 1.** A guarda ficou no layout, não no proxy (ver §2) |
| **3 — Ações que mutam** | Revogar/estender acesso, reenviar acesso, liberar 2ª chamada, trocar e-mail | Guru (docs/secret) + SES | Bloqueada, sem mudança |

## 7. Dependências externas (bloqueiam a Fase 3)

- **Guru**: relação `guru_customer_id`/`guru_order_id` para reprovisionar acesso.
- **SES**: envio real dos e-mails (reenvio de acesso, 2ª chamada).
- **Provisionamento Supabase** (chaves por ambiente) para a Fase 2.

## 8. Pontos a definir

> **FECHADO em 30/jul/2026.** As quatro decisões que travavam a primeira fatia foram tomadas
> pelo Pedro e já estão no código. O que sobra nesta seção é o que **não** trava a construção,
> marcado abaixo.

**Acesso de admin (pendência registrada em 25/jul/2026 — decidir antes da Fase 1):**

- ~~**Bootstrap do papel**~~: **RESPONDIDO (30/jul/2026): `scripts/admin-conta.mjs`.**
  *Quem* pode conceder já estava imposto pelo banco desde a migration `0003`: só a **service
  role** ou um **admin que já era admin**, com o trigger `guarda_is_admin` estourando em
  qualquer outro caminho. A **ergonomia** que faltava é um script de operação:

  ```
  node scripts/admin-conta.mjs                            # lista os admins de hoje
  node scripts/admin-conta.mjs <email>                    # simula
  node scripts/admin-conta.mjs <email> --aplicar           # promove
  node scripts/admin-conta.mjs <email> --revogar --aplicar # despromove
  ```

  Uma tela dentro do próprio admin **não resolve o caso de partida**, e é por isso que o script
  existe e não sai: no dia em que o `ei-prod` subir não vai existir admin nenhum, e ninguém entra
  na tela para criar o primeiro. Alguém tem que quebrar o ovo de fora, com a service role.

  **Do segundo admin em diante é pela tela** (`/admin/equipe`, §4.7, pedida pelo Pedro em
  30/jul/2026): busca por e-mail, dar e remover acesso. Os dois caminhos coexistem de propósito, e
  não são redundantes — o script é o único que funciona num banco sem admin, e a tela é o único
  que funciona para quem não tem a service role na mão.

  **Este script NÃO é atalho de teste** e não entra na lista de remoção do go-live, ao
  contrário do `aprovar-conta.mjs`. Ele tem duas travas: simula por padrão (só grava com
  `--aplicar`), e recusa revogar o último admin, que deixaria o painel sem ninguém.

  **Primeiro admin do homolog criado em 30/jul/2026:** `pedrohfontei@gmail.com`. Antes disso
  o banco tinha **zero** admins, o que nenhum documento registrava.
- ~~**Onde o papel vive**~~: **RESPONDIDO na prática (30/jul/2026):** é a coluna
  `profiles.is_admin`, e **dez policies de RLS** já dependem de `is_admin()`, que lê dali.
  Trocar para `app_metadata` ou tabela própria obrigaria a reescrever a função e revalidar
  as dez — custo alto sem ganho identificado. A exigência de "algo que o aluno não consiga
  se atribuir" **não estava atendida** e virou um furo real: ver o incidente da terceira
  armadilha no `HANDOFF.md` §6. Fechado pela `0003`, com `npm run check:rls` provando.
- ~~**Porta de entrada**~~: **RESPONDIDO (30/jul/2026): a mesma `/app/login`**, com o redirect
  pós-login decidindo por papel (`app/app/login/LoginClient.tsx`). Uma superfície de
  autenticação só para manter e proteger, e os fluxos de recuperação e de política de senha já
  existem e estão testados; `/admin/login` dobraria a superfície e pediria o próprio fluxo de
  recuperação. Custa uma chamada `is_admin()` a mais, **só no login** e só no caminho de
  login: no "primeiro acesso" a conta acaba de nascer e nunca é admin, então lá não se
  pergunta. Se a chamada falhar, cai em `/app`.

  Custo aceito: o admin vê a tela temática do aluno ("Bem-vindo de volta") ao entrar.
- ~~Não-admin em `/admin`~~: **RESPONDIDO (30/jul/2026): 404.** Detalhe e as duas medições em
  §2, incluindo por que quem está **deslogado** recebe redirect e não 404.
- **Proteção extra**: e-mail corporativo obrigatório? 2FA? Ou sessão Supabase comum
  basta para o v1? — **não trava nada.** É endurecimento sobre a porta que já existe, e a
  política de senha da plataforma já foi imposta em 30/jul (`AMBIENTES.md`, item 6).
- Precisamos de auditoria (quem fez cada ação) já na Fase 1 ou só depois? — **não trava a Fase
  1.** As ações que precisam de auditoria (revogar acesso, reenviar, trocar e-mail) são todas
  da Fase 3, que está bloqueada em Guru + SES. A Fase 1 só lê.
- ~~O NPS entra no Painel agora (mock) ou espera a pesquisa real?~~ **RESOLVIDO por
  consequência (30/jul/2026): espera a pesquisa.** Decorre da decisão de não usar mock — card
  de métrica com número inventado é o tipo de coisa que alguém cita numa reunião como se fosse
  dado. O Painel entregou quatro cards reais no lugar: matrículas, conclusão de aulas,
  aprovação na prova e certificados.

---

_Ao aprovar, começo pela Fase 1 na ordem: casca → Painel → Questões → Alunos/Detalhe →
E-mails. Cada tela validada com você antes de seguir._

**Entregues em 30/jul/2026:** casca, Painel, Equipe (§4.7, escopo novo), Alunos (§4.2) e Detalhe do
aluno (§4.3). Migrations `0003` a `0006`, todas aplicadas no homolog.

**Restam três, e a ordem depende do Pedro:** **Questões** (§4.4) só significa algo depois das ~100
questões reais, que são tarefa dele; **Conteúdo** (§4.6) espera as três decisões do próprio §4.6;
**E-mails** (§4.5) é a mais barata e nasce mostrando estado vazio, porque o SES não está configurado
e o `email_log` está vazio.

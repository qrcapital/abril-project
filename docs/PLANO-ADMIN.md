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
- Ações sensíveis (revogar acesso, reenviar) registram quem fez e quando (auditoria
  simples — coluna/《log》a definir).

## 3. Casca (layout do admin)

- **Sidebar** fixa: Painel · Alunos · Questões · **Conteúdo** (§4.6) · E-mails, e depois de uma
  régua, **Equipe** (§4.7). A régua separa quem **opera** de o que é **operado**. Rodapé com
  "voltar ao site" e sair.

  Construída em 30/jul/2026. Item cuja tela ainda não existe aparece sem link e marcado "em
  breve": a alternativa era listar seis links e entregar quatro 404, e navegação é a promessa da
  casca.
- **Header**: título da tela, busca contextual, avatar do admin.
- Estados de tabela: carregando, vazio, erro, paginação. Padrões reutilizáveis.

## 4. Telas

### 4.1 `/admin` — Painel
- **Métricas** (cards): total de alunos (`profiles`/`enrollments`), taxa de conclusão
  (`progress` vs total de aulas), taxa de aprovação (`exams`), NPS médio
  (`certificates`/pesquisa).
- **Atalhos**: últimos e-mails (`email_log`), alunos recentes.
- _Dados_: agregações sobre `enrollments`, `progress`, `exams`, `certificates`.

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
> **As ações continuam fora, inclusive as duas que não dependem de integração** (liberar 2ª chamada
> e estender acesso). O §2 pede auditoria para ação sensível, e a tela de Equipe já abriu essa
> dívida com log de servidor; somar mais três ações sobre o mesmo rastro fraco é a hora errada.
>
> **Leitura mista, e a mistura é a escolha barata:** `aluno_modulos` é função da `0006` porque
> agrupar por módulo é agregação; o resto vem do PostgREST direto, porque é uma linha por tabela
> para um aluno só. O e-mail vem do Admin API (`getUserById`), o único jeito de alcançar
> `auth.users` sem função nova. `aluno_modulos` parte de `modules` com `left join` para devolver
> **todos** os módulos: módulo ausente da lista seria lido como "não existe" em vez de "nada feito
> aqui".

### 4.4 `/admin/questoes` — Banco de questões
- CRUD por módulo: enunciado, 4 alternativas, correta, ativo/inativo.
- Contador por módulo (a prova sorteia 5 por módulo — `sortear_prova`).
- _Dados_: `questions`. **Já dá para usar o seed real** — vira funcional cedo.

### 4.5 `/admin/emails` — Log de e-mails
- Tabela: aluno, template, data de envio, status (enviado/falha).
- _Dados_: `email_log` (somente leitura).

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

- **Lista de módulos**, com as aulas de cada um em acordeão, na ordem do curso.
- **Editar módulo**: título, docente, arte.
- **Editar aula**: título, descrição, **link do vídeo** (`panda_video_id`), duração, e se
  conta para o gate de 16/16 (`conta_no_gate`).
- **Materiais**: adicionar, renomear e remover, com o vínculo à **aula** (resumo) ou ao
  **módulo** (apostila), que é a distinção que a tabela já suporta.
- _Dados_: `modules`, `lessons`, `materials` (leitura e escrita).

**A definir antes de construir:**

- **Arquivo: upload ou URL?** O material pode ser enviado pelo painel para o Supabase Storage,
  ou o admin cola um link já hospedado. A coluna `materials.arquivo` guarda caminho, então as
  duas cabem; muda o tamanho da tela e se precisamos de bucket com policy.
- **Reordenar aulas.** O `ord` define a ordem do curso e, por consequência, o **número da aula
  na URL**. Deixar reordenar é útil e perigoso: o progresso do aluno é gravado por `lesson_id`,
  então ele não se perde, mas links compartilhados apontariam para outra aula. Talvez reordenar
  fique fora do v1.
- **Criar e apagar aula.** Apagar aula com progresso gravado apaga o progresso junto (o
  `on delete cascade` da tabela). Isso pede confirmação forte, ou desativação em vez de exclusão.

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

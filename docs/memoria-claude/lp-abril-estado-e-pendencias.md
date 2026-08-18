---
name: lp-abril-estado-e-pendencias
description: Estado e ponto de retomada do Abril (Estratégia Internacional) — 18/ago: o PLANO-CORRECOES.md inteiro executado, QA'd, commitado (c757f12, 5c42324, 31307ff) e PUSHADO em homolog; migrations 0018–0021 aplicadas. Sobrou só o item 23 (URLs de Termos/LGPD, insumo do Pedro).
metadata: 
  node_type: memory
  type: project
  originSessionId: 4b72866b-75a2-4ccb-9364-0b22495f53bd
  modified: 2026-08-18T17:27:40.972Z
---

Estado da **Estratégia Internacional**. Repo em **`~/projects/abril-project`** no MacBook, branch `homolog` (o caminho antigo do Windows, `C:\Users\pedro\Claude\abril-estrategia-internacional`, não existe mais — ver [[ambiente-mac-abril]]). Ver [[critique-lp-abril]], [[estado-abril-plataforma]], [[projeto-abril-estrategia-internacional]], [[copy-md-obrigatorio]].

O corpo abaixo está em ordem cronológica **inversa**: o ponto de retomada é o próximo bloco, e o que vem depois é histórico de sessões anteriores, que só interessa se algo antigo voltar à tona.

**PONTO DE RETOMADA (18/ago/2026, fim da sessão — branch `homolog`, TUDO pushado até
`ce4d86c`, working tree limpo, migrations 0018–0022 aplicadas e conferidas no `ei-homolog`):**

A sessão fechou TRÊS frentes, em 7 commits:

1. **O `docs/PLANO-CORRECOES.md` inteiro** (28 achados da revisão de 17/ago): Rodadas 1+2 em
   `c757f12`, Rodada 3 (críticos de produção: criarConta recusa produção, open redirect,
   progresso só servidor/0019, auditoria de questões+conteúdo, concorrência da prova/0020)
   em `5c42324`, Rodada 4 (middleware fora da LP/fontes, 0021, `lib/politica-avisos.ts`
   unificado) em `31307ff`. QA manual COMPLETO com o Chrome do Pedro logado em localhost,
   incluindo a prova de ponta a ponta via 2ª chamada na conta dele (que terminou reprovada
   com 5/100 na tentativa 2 — estado esperado, e o e-mail de resultado saiu UM só; o log de
   31/07 guarda o par duplicado do bug antigo como contraste). `lib/seguranca.ts` +
   `check:seguranca` novos (12º check da suíte).
2. **Varredura de segurança** (duas frentes, banco + app): veredito SEM vulnerabilidade
   alta/média; 3 fechos de baixa severidade em `e5a35fe` (migration **0022**: revoke de
   PUBLIC **e anon** em is_admin/is_master/has_active_access, revoke de escrita em
   exams/enrollments; `escapar` do CSV cobrindo `\t=`). Anotado sem ação: verify_certificate
   enumerável por design; `guarda_is_admin` vira INSERT OR UPDATE se `profiles` um dia
   ganhar policy de INSERT. Relatório completo na entrada "Segurança" do CHANGELOG.
3. **Copy "BlockTrends é masculino"** (decisão do Pedro, regra no guia de copy do AGENTS.md):
   `43d5c92` (LP + PRD) e `ce4d86c` (a leva que o grep quebrado escondeu — 4 telas de login,
   RODAPÉ DOS E-MAILS em `lib/email-render.ts`, HANDOFF, BACKLOG; as telas portadas foram
   corrigidas no gerado E no `port-area.mjs`, senão o próximo porte reverte).

**Lições novas que valem para sempre:** [[grep-boundary-falha-no-mac]] (o `\b` que relatou
varredura limpa com 6 ocorrências vivas); **revoke de PUBLIC não fecha função no Supabase** —
anon/authenticated têm grant DIRETO por default privileges, revogar dos dois e conferir com
`has_function_privilege`; clique de browser SEMPRE com screenshot fresco e conferido com
reload (a janela muda de tamanho e o clique cai fora do botão em silêncio).

**Estado de homolog:** `RESEND_API_KEY` ATIVA (e-mails saem de verdade); conta do Pedro
`pedrohfontei@gmail.com` é admin mestre, 17/17 no gate, reprovada na tentativa 2.

**Fila da próxima sessão:** (1) **item 23** do plano, único aberto — URLs de Termos de uso e
Privacidade/LGPD da LP, insumo do Pedro (a correção entra pelo `port-lp.mjs`); (2) oferecido
sem resposta: copy que degrada mal com nome vazio ("Olá," / "O tempo acabou, ." — a conta
dele não tem `nome` no metadata); (3) o resto do pré-produção segue no bloco "▶ PRÓXIMA
SESSÃO" do `PENDENCIAS-LP.md` (insumos externos: checkout Guru, vídeos, materiais, domínio
de e-mail) e nos itens antigos de [[pendencias-lp-abril]]. Item 8 do plano morreu sem
mudança (decisão dele: a política padrão é semanal mesmo).

Colateral achado no QA: a conta `pedrohfontei@gmail.com` não tem `nome` no metadata, e as
telas mostram "Olá," e "O tempo acabou, ." — a copy não degrada bem com nome vazio; ofereci
como item da Rodada 4, sem resposta ainda.

Descobertas de 18/ago: o **item 5 do plano já estava correto** no código (faltava só a regra
"gate vale para começar, não para continuar" no `iniciarProva`, coberta no item 4); política
nova nasce com tudo em breve e o preset da esteira é ação explícita
(`/admin/liberacao?preset=esteira`).

**PONTO DE RETOMADA (17/ago/2026, fim da sessão — branch `homolog`, tudo pushado até
`3cd1c65`; ficaram POR COMMITAR só `docs/PLANO-CORRECOES.md` e o ponteiro dele no
`PENDENCIAS-LP.md`):**

A sessão entregou, em dois commits no ar em homolog: **políticas de liberação de conteúdo**
(migrations `0016`/`0017`, aplicadas no `ei-homolog` por psql — tela `/admin/liberacao`, política
ativa como padrão de todos + política própria por aluno no detalhe), **painel redesenhado**
(fila "Precisa de você", funil, auditoria recente, saúde) com **relatórios CSV** auditados, o
pacote visual (wordmark da LP na sidebar, algarismos lining em admin+área, camada única de
feedback de botão no `admin.css`), e a mudança de que **o gate da prova passou a ler
`conta_no_gate`** (decisão do Pedro: boas-vindas conta, gate hoje é 17/17 em homolog; antes o
checkbox do admin era letra morta).

**Depois disso, uma revisão geral (5 revisores) achou 28 defeitos reais, 3 críticos de
produção** (criarConta sem guarda de ambiente, progresso gravável via API direta contornando a
esteira, open redirect por `\` no /auth/confirm). **A fila de código da retomada é
`docs/PLANO-CORRECOES.md`** (4 rodadas, começar pela 1), aprovado como plano mas com o Pedro
adiando a execução ("vou atacar outra pendência, depois voltamos"). Dois insumos dele lá
dentro: copy nova do e-mail de boas-vindas (item 8) e URLs de Termos/LGPD (item 23).

Coisas desta sessão que mudam como trabalhar aqui: **decisão de produto nova = perguntar com
AskUserQuestion antes de construir** (as 3 da liberação renderam, e uma mudou no meio: em breve
NÃO trava a prova); **checks que leem o banco podem falhar por dado que o Pedro mudou pela tela**
(o curriculo-check acusou o conta_no_gate da boas-vindas — era intencional, o check é que
mudou); espécimes visuais servidos por `python3 -m http.server` no scratchpad + aba do Chrome
(file:// é bloqueado); e o Resend/`EMAIL_FROM` seguem pendentes como antes.

**MIGRAÇÃO DE MÁQUINA (25/jul/2026):** o Pedro comprou um MacBook e vai **transferir o desenvolvimento deste projeto do Windows para lá**. Foi criado o **`docs/HANDOFF.md`** (commit `712b0cb` em `homolog`, pushado), documento de continuidade que consolida tudo desta nota e mais: o que não vem no `git clone`, setup no macOS, armadilhas e decisões fechadas. **Ao trabalhar neste projeto em qualquer máquina, ler o `docs/HANDOFF.md` primeiro** — o `AGENTS.md` já aponta para ele. As memórias do Abril foram copiadas para **`docs/memoria-claude/`** (viajam no git; o README de lá tem o procedimento de reinstalação no Mac) e o `COPY.md` virou `docs/COPY.md`, versionado. Fora do git e a transferir na mão: `.env.local` (recriar do dashboard Supabase) e os insumos brutos de `referencias/cowork/` (~9 MB; um arquivo tem marca d'água Dreamstime, não commitar em bloco). **Os geradores do globo e o `checkpoint-canvas/` do scratchpad já foram apagados pelo sistema, não existem mais em lugar nenhum** — os dados de saída seguem versionados em `scripts/globo-*.txt`.

**PONTO DE RETOMADA (31/jul/2026, fim da sessão — repo em `~/projects/abril-project`, branch
`homolog`):**

Comece pelo bloco **"▶ PRÓXIMA SESSÃO"** do `docs/PENDENCIAS-LP.md`, remontado em 31/jul. **Não
recontar história**: ler o bloco e ir para o trabalho. O histórico está no `CHANGELOG.md`.

**O PAINEL ESTÁ COMPLETO** em homolog: casca, Painel, Alunos, Detalhe do aluno, Equipe, Conteúdo,
E-mails e **Questões** (as três últimas de 31/jul). O detalhe do aluno ganhou **"Reenviar acesso"**,
que gera link novo (o anterior morre).

**2ª CHAMADA DA PROVA E AUDITORIA (31/jul).** A liberação era prometida na tela do reprovado e no
e-mail, e não existia em código nenhum: o primeiro aluno a reprovar geraria ticket sem resposta. Usa o
estado `available` do enum (que existia e nunca foi usado), o `abrirTentativa` passou a **armar** a
tentativa liberada, e três telas do aluno ganharam guarda para esse estado. Junto entrou a tabela
`admin_audit` (`0014`), que o §2 pedia desde 20/jul. **Regra: só quem entregou e REPROVOU** — liberar
para aprovado tiraria o acesso ao certificado dele, porque o porteiro olha a tentativa mais recente.

**O bug que o teste pegou e vale como lição:** eu pedi um booleano `aprovado` para a função pura, e os
dois chamadores calcularam diferente (tela pela coluna `score`, rota recorrigindo o snapshot) — a tela
oferecia o botão e a rota liberava para aprovado. É [[abril-escalada-is-admin]] em outra roupa: duas
verdades sobre o mesmo fato. **Função pura recebe dado cru e decide sozinha; quem chama não calcula.**

**CERTIFICADO COM EMISSÃO REAL (31/jul).** Era o maior buraco depois do painel: `lib/certificado.ts`
tinha UM código fixo (`EI-2026-4817`) e o nome "Pedro Teixeira", então todo aluno aprovado teria o
mesmo código e a página pública mostrava o nome errado para qualquer consulta. Agora: `EI-XXXX-XXXX`
com 8 símbolos aleatórios (decisão dele: sem ano, sem sequência), alfabeto de 30 sem `I O L U 0 1`
porque o código é **ditado por telefone e digitado de PDF**, sorteio por Web Crypto com descarte de
viés, emissão na aprovação nos dois caminhos + resgate na tela, migration `0012` com um certificado
por aluno, e `/verificar/:codigo` consultando `verify_certificate` com o cliente **anon**.
`lib/certificado.ts` é importado por componente de CLIENTE, então nada de `node:*` nele.

**A tela de Questões** foi pedida antes das ~100 questões existirem e não precisou de migration
nenhuma. Duas decisões que ficaram: **apagar E desativar** (desativar é questão que pode voltar,
apagar é questão que nasceu errada; nenhum dos dois corrompe prova feita, por causa do
`questions_snapshot`), e **duas réguas por módulo** — o piso de 5 ativas, que rompido faz a prova
parar de abrir para todo mundo, e a meta de 25 do PRD. O piso virou asserção no `check:curriculo`,
então **desativar questão demais faz `npm run check` falhar de propósito**.

**A `/admin/emails` tem duas metades**: o log e o **builder dos transacionais nossos**, que o Pedro
pediu ao ver o log vazio. Decisões que não se repropõem: `left join` em `auth.users` porque
`email_log.user_id` é `on delete set null` e o log sobrevive à conta apagada; nome de template **cru**
e tom de status **neutro por padrão**, porque pintar de vermelho o desconhecido faz de cada status novo
um incidente falso.

**A CAMADA DE ENVIO NÃO EXISTIA ATÉ 31/JUL, e isso é o achado da sessão:** o webhook gerava o link de
acesso e **não mandava nada**, porque `generateLink` gera sem enviar (quem envia é `inviteUserByEmail`).
O `queued` que ele escrevia no log era falso, e quem comprava recebia silêncio. Hoje: `lib/email.ts`
(envio, provedor atrás de uma função, nunca lança, registra toda tentativa), `lib/email-render.ts`
(puro, com `npm run check:email`) e `email_templates` no banco.

**Cinco regras do e-mail que valem para sempre:** assunto e corpo no banco, **layout e destino do botão
em código** (URL no editor seria a forma mais barata de mandar a turma para o lugar errado); cada
template tem um **contrato de variáveis** em código e a tela recusa ao salvar o que estiver fora dele;
**nenhuma imagem no e-mail**, nem logo, porque cliente bloqueia imagem e cabeçalho-imagem chega em
branco; botão **verde com texto claro**, porque dourado com branco dá 2,9:1; e **aprovado recebe um
e-mail só**, o do certificado, senão são duas mensagens no mesmo segundo dizendo a mesma coisa.

**Provedor: Resend por HTTP com `fetch`, zero dependência.** É o mesmo Resend do SMTP do Auth. O SES
segue previsto para produção junto com a decisão do domínio, e a troca é uma chamada em `lib/email.ts`
(SigV4 pede o SDK). **Falta a `RESEND_API_KEY` no `.env.local` e no Netlify** para o primeiro e-mail
sair: ver [[email-boas-vindas-antes-do-lancamento]].

**A tela de Conteúdo (`/admin/conteudo`) é a única que muda o curso sem deploy**, e as três
decisões do Pedro que a definiram não se repropõem: material é **URL colada** (não existe bucket de
Storage no projeto), **reordenar aula é permitido** e muda o número da aula na URL, e **apagar aula
é permitido** com confirmação que diz quantos alunos perdem progresso. `lessons.duracao` e
`modules.arte` ficaram de fora porque **nenhuma tela do app lê essas colunas**.

**`liberacao_total` do homolog: resolvida em 31/jul.** Desligada em 8 das 9 matrículas; só
`pedrohfontei@gmail.com` mantém liberação total. Consequência para quem testa: com outra conta, a
área do aluno mostra só os módulos que a esteira já abriu, contando de `inicio_em` (29/jul).

**Estado do git:** `25b35b1` pushado e **`dd33052` commitado sem push** (ele pediu só o commit); a
leva do certificado está por commitar. Antes: **`25b35b1`** ("Admin: tela de Conteudo, log de e-mails e a camada de envio que nao existia"),
30 arquivos, migrations `0007` a `0011`. Antes dela, `964bd80`, `8b22869` e `1bb23d9`, de 30/jul.
`build`, `lint` e `check` (7/7) passando. Commit em uma leva só porque as três frentes se cruzam nos
mesmos arquivos (a tela de E-mails nasceu log e virou builder no mesmo dia).

**Convenção de mensagem de commit deste repo, que eu quase quebrei: SEM ACENTO.** Todo o histórico é
assim, herança do Windows. Título curto + parágrafos longos explicando as decisões, e o trailer
`Co-Authored-By`.

**Migrations `0003` a `0014` aplicadas no `ei-homolog`** por `psql`, que vive em
`/usr/local/opt/libpq/bin/psql` (fora do PATH). A conta `pedrohfontei@gmail.com` é **admin mestre**
e tem a senha de teste conhecida em homolog — **que eu não sei**. Para conferir tela autenticada por
`curl` sem ela, o caminho que funcionou: criar admin temporário pela service role, gerar o cookie do
`@supabase/ssr` (`sb-<ref>-auth-token` = `base64-` + base64url do JSON da sessão) e apagar a conta
no fim.

**Cinco coisas desta sessão que mudam como trabalhar aqui:**

1. **`npm run build` com o `next dev` de pé TRAVA o dev server** — e o sintoma chega como defeito de
   produto. Ver [[dev-server-so-em-localhost]], que ganhou essa segunda seção.
2. **Route handler não passa por layout.** Guarda em layout não protege endpoint, e com escrita por
   service role o trigger do banco também não. Rota nova sob `app/admin/` refaz a checagem de papel.
   É a **quarta** repetição do padrão "o guarda de um caminho não guarda o vizinho" —
   ver [[abril-escalada-is-admin]].
3. **Lógica que precisa de self-check não pode morar no módulo que importa Supabase**, porque
   `next/headers` não roda em node puro. Daí os pares `prova-correcao`/`prova`,
   `usuario-template`/`usuario` e `matricula-estado`/`matricula`.
4. **O Tailwind só roda no admin.** O `app/globals.css` que o `AGENTS.md` mandava usar **nunca
   existiu**; os tokens do Meridiano vivem em `app/admin/admin.css`.
5. **Dois níveis de admin** (mestre e comum). O primeiro admin de cada ambiente nasce de
   `scripts/admin-conta.mjs --mestre`, senão o `/admin` sobe inacessível — item 7 do `AMBIENTES.md`.

**Pendente do Pedro:** a **`RESEND_API_KEY`** (é a única que trava entrega de e-mail), as **~100
questões** (13), se quer **tabela de auditoria** no admin, a URL do checkout do Guru, os materiais e
vídeos reais, e o **domínio de envio** (hoje o remetente é `onboarding@resend.dev`). O template
**Invite user** saiu da lista: o link de acesso vai no nosso e-mail agora.

**O que a sessão de 29/jul fez.** Fechou as tarefas 1, 2, 3b, 4, 5, 6, 7, 8, 9, 10, 12, metade
da 11, e depois **14 e 15** inteiras. Mais duas frentes que o Pedro abriu no caminho: o
**certificado sobrevive ao fim do acesso** (com o porteiro de aprovação que nunca existiu, e
matrícula revogada continua bloqueada) e a **liberação gradual do curso**, um módulo por semana,
cuja razão é comercial e não pedagógica: sem esteira o aluno conclui, emite o certificado e pede
reembolso dentro da janela de arrependimento.

**Três mudanças de arquitetura que valem mais que a lista de tarefas:**

1. **O currículo saiu do código para o banco.** `lib/curso.ts` não guarda mais as aulas; ele tem
   tipo e lógica pura, e `lib/curriculo.ts` carrega de `modules`/`lessons`. O motivo é o admin:
   ele vai editar título, descrição, vídeo e materiais pelo painel, e painel não edita código.
   Verificado: mudar no banco muda a tela **sem deploy**. Registrado como escopo novo do admin
   em `PLANO-ADMIN.md` §4.6, com três decisões pendentes.
2. **O progresso saiu do cookie para a tabela `progress`.** O gate de 16/16 era conferido contra
   um dado que o aluno escrevia, e eu explorei isso três vezes no mesmo dia. Escrevi uma migração
   que semeava o banco a partir do cookie e **removi ao testar o ataque**: era uma porta para
   plantar o dado. Cookie de aluno nunca é fonte de verdade, nem "só para migrar".
3. **A guarda de acesso mora no layout do `(sala)`**, não no proxy, com quatro estados de
   matrícula e `/app/acesso` fora do grupo (senão o bloqueio se redireciona em laço).

**Regras novas que saíram daí e valem para sempre:** cor semântica tem
[[cor-semantica-por-fundo]]; a área do aluno **não é escura** (o chrome é, o miolo das telas é
claro `#F7F5F2`), então todo padrão nasce com dois pares; e caixa de mensagem se pinta **no
DOM**, nunca em JSX irmão do HTML injetado, senão vai parar no fim da página.

**A fila válida agora** é o bloco "▶ PRÓXIMA SESSÃO" do `PENDENCIAS-LP.md`. De código sobraram as
três telas de admin (Conteúdo, E-mails, Questões); as duas tarefas antigas de código, **16** e
**17**, saíram em 30/jul, e a **18** foi destravada e construída.

**Correção do signup (29/jul), para não reabrir:** o `upsert` em `profiles` não devolvia mais
"uma linha de tratamento", como a pendência estimava. Só capturar o erro deixaria a conta pela
metade, usuário no auth sem linha em `profiles`, e o `verify_certificate()` faz join em
`profiles`, então o furo reapareceria na verificação pública do certificado. Agora loga, desfaz
o usuário com `deleteUser` e devolve erro à tela — o desfazer é o que faz o retry funcionar.

**Guardado a pedido do Pedro (29/jul):** as três pendências do e-mail de boas-vindas que só
vencem no lançamento e são invisíveis em homolog estão em
[[email-boas-vindas-antes-do-lancamento]] e no `PENDENCIAS-LP.md`. O template `Invite user` **não
tem decisão nenhuma** — é colar uma linha no painel.

**O que a sessão de 28/jul fez.** O **schema do Supabase homolog nunca tinha sido aplicado**, e
foi (mais backfill de 8 `profiles`). **Três correções de segurança**: o `revoke` do
`sortear_prova` era ineficaz por causa do grant de PUBLIC, o aluno leria o gabarito em
`exams.questions_snapshot` porque RLS não alcança coluna, e faltava guarda de redirect aberto.
O **motor da prova** ficou funcional e testado, sem o conteúdo das questões. A **recuperação de
senha** foi construída e validada com e-mail real, com SMTP em Resend, e o mesmo
`/auth/confirm` serve o primeiro acesso com `type=invite`. A **regra de senha** virou 8
caracteres com maiúscula, minúscula e número. E a **cor do desempenho por módulo** passou a ser
calculada por valor, com pill âmbar no módulo deficitário, junto com duas correções de AA
antigas. Detalhe no `CHANGELOG.md` e nas armadilhas do `HANDOFF.md` §6.

**Frente nova que o Pedro abriu no fim da sessão: feedback ao usuário.** Auditoria da área
logada em `docs/FEEDBACK-UX.md`, em duas camadas, com 12 achados graves. Os piores são de
**camada**, então consertam várias telas de uma vez: o HTML servido a um aluno logado traz o nome
**"Pedro"** e não o dele (o `AreaChrome` preenche no cliente), e não existe `loading.tsx`,
`error.tsx` nem `not-found.tsx` em lugar nenhum do projeto. O `error.tsx` virou necessidade
concreta porque o motor da prova estoura de propósito em duas situações e nenhuma tem tela.

**Pendente do Pedro (4):** template `Invite user` no painel (3), quem escreve as ~100 questões
(13, **TBD**, e não bloqueia nada), as quatro perguntas do acesso de admin (18, ele disse que
responde amanhã, e é a única que destrava construção nova) e espelhar a política de senha no
painel (20). Nada além da 18 trava trabalho.

**O que a sessão de 25/jul fez (9 commits, ver CHANGELOG):** alinhamento de nomes do
módulo IV entre LP e área (etapas 3b/3c novas no `port-area`); chancela e razão social da
área corrigidas; item "Nomenclatura da certificação" do BACKLOG fechado (card = "Certificado
de 30 horas", provisório); refactor ponytail (hover/foco do bundle viram **CSS gerado** em
`scripts/comum.mjs`, morreram `HoverRuntime`→virou `HeroPointer` e `AreaInteractions`;
`lib/telas.ts`, `lib/contato.json`; `next.config.ts` removido); e a **frente mobile da LP**:
globo mantido como está (decisão do Pedro com mock em
https://claude.ai/code/artifact/f13c280b-caba-425c-bd6a-dc59a53cf1ef), toque sem tranco
(`pointer:fine` no HeroPointer), Ferramentas com mockup entre lead e bullets
(`display:contents`), Quem Assina sem selo + slider 88%, **bolinhas nos 2 carrosseis**
(etapa 7s + `CarrosselDots.tsx`; inativas off-white sobre verde, ativa dourada via
`--dot-on`), wordmark da topbar corrigido (etapa 7t: compensação do tracking final +
proporções padrão escaladas) e **ENTRAR no hambúrguer** (7n).

**Fila de 25/jul, SUPERADA em 28/jul.** Ela dizia: 1) prova funcional; 2) recuperação de senha
(404); 3) acesso de admin; 4) `/obrigado` e `/app/acesso`; 5) migrar o curso para o banco. Os
itens 1 e 2 estão feitos, o 1 sem o conteúdo das questões. A fila válida hoje é o bloco
**"▶ PRÓXIMA SESSÃO"** do `docs/PENDENCIAS-LP.md`. Copy do FAQ e CTA final: **encerrado por
ora**, não repropor.

**Avisos de retomada:** `conta.html` (área) diverge do que o `port-area` gera (edição manual
antiga: atributo no span vs span aninhado) — toda vez que o porte roda, reverto com
`git checkout app/app/_ui/screens/conta.html`; unificar um dia. Bolinhas dos carrosseis:
comportamento dinâmico validado só por evento sintético (aba de automação oculta congela
scroll/rAF — HANDOFF §6); Pedro validou visual no ar. Área do aluno tem 2 rails na home
(62% snap) SEM bolinhas — oferecido, sem resposta ainda.

**Arquitetura:** a LP é gerada por `scripts/port-lp.mjs` a partir do bundle; TODA edição estável vive nesse script (etapas 7d–**7t**) para sobreviver a re-portes. Nunca editar só o `app/_lp/body.html`/`styles.css` (são gerados). Desde 25/jul: `scripts/comum.mjs` é compartilhado pelos dois portes (WhatsApp/DPO de `lib/contato.json` + `regrasDeEstado()`, que converte `style-hover`/`style-focus` em CSS com `!important` dentro de `@media(hover:hover)` — os runtimes de hover em JS morreram). Client components da LP: `HeroPointer` (mouse do hero, só `pointer:fine`), `GloboCanvas`, `CarrosselDots`. `app/page.tsx` lê o body/css em **runtime** dentro do componente — quando o hot-reload não pega, reiniciar o dev server (matar PID na 3000). O port termina com libuv assert às vezes — saída válida mesmo assim.

**Feito nesta sessão (commit `11ab621`, pushado em `homolog` — auto-deploy no ar):**
- **Seção nova "Ferramentas"** (id `entregaveis`, etapa 7i) após "A Formação": lista editorial à esquerda (apostilas/e-book/calculadora com ornamento estrela dourada + réguas internas) + **mockup pronto** de dispositivos à direita (`public/lp/mockup-devices.webp`, imagem final que o Pedro entregou, fundo transparente). Fundo branco.
- **"A Diferença" (comparativo) removida** (7j) — a Ferramentas ocupou o lugar.
- **"Quem assina" refeita em 2 cards** (7k): BlockTrends = *chancela técnica*; VEJA = *chancela institucional* (fim de "editorial"). Selo circular voltou, re-gravado em `public/lp/selo-veja.svg` ("CHANCELA INSTITUCIONAL · VEJA · GRUPO ABRIL", olho no centro).
- **Rodapé alinhado à VEJA Negócios**: faixa topo verde KV (`#0B2D20`, logo+SIGA+redes), faixas Grupo Abril/base em preto; razão social **"Abril Comunicações S.A. · CNPJ 44.597.052/0001-62"** (LP vai p/ subdomínio da Abril). Logo `public/lp/grupo_abril.svg`.
- Docentes: fotos **P&B→cor no hover** (5b), badges de trajetória (7h), cargo em 1 linha, numeral removido das fotos (7g). Afordância "→" no preço (7e), captions AA (7f), vermelho neutralizado, `lining-nums`, topbar padronizada.

**Seção "Quem assina" — FECHADA (23/jul):** selo Meridiano (SVG inline, faixa verde + VEJA NEGÓCIOS/BLOCKTRENDS em Playfair, olho reto no miolo areia, 180px) + os 2 cards finalizados. **Card VEJA:** kicker "A credibilidade de" + logo VEJA Negócios, copy de confiança/autoridade (desde 1950), rodapé "As marcas que informam o Brasil" com **3 logos reais** (Grupo Abril verde, VEJA, Super Interessante — `public/lp/`). **Card BlockTrends:** kicker "A técnica de", copy de pioneirismo ancorado na ANCORD (sem citar cripto), rodapé "Pioneira em certificação profissional" com logos **CCA** (`cca-ancord.svg`) e **pós Desenvolvedor Blockchain** (`pos-blockchain.png`) — as duas recoloridas por sharp de branco→escuro p/ fundo claro. Big numbers removidos. Logos-título equalizadas.

**Hero — globo do fundo (reescrito 24/jul, commit `79fa278`):** migrou de CSS/DOM para **canvas 2D** (`app/_lp/GloboCanvas.tsx`). A versão DOM punha 1 elemento por ponto num `preserve-3d` e travava ao adensar (3.697 elementos); canvas custa o que se pinta (body.html 180→69KB, nós ~2000→~600). Dados de geometria gerados no porte em `app/_lp/globo-dados.ts` (etapa **7l**). **Litoral** do Natural Earth `ne_50m_land` decimado a ~0,6° (5.155 pontos, 297 anéis) em `scripts/globo-costa.txt`; **massa de terra** realçada com 2.884 pontos de interior (Fibonacci + point-in-polygon) em `scripts/globo-terra.txt`. **Praças** em anel sonar (núcleo + anéis expandindo) com sigla IATA+país; **rotas** com corcova de luz que passeia, nascendo no **Brasil** (São Paulo→NY/Miami/Londres/Madri, Fortaleza→Londres — o cerne do curso). **Giro por mouse** (o cursor gira ±26°/inclina ±12° a esfera, lerp; lê `--mx/--my` do `HoverRuntime`) substituiu o parallax; **estrelas removidas**. Recorte: visibilidade por `pz > RG²/PERSP` (horizonte aparente), não `pz>0`, senão a casca traseira pisca na borda. Loop para fora da viewport (IntersectionObserver); `prefers-reduced-motion` desenha 1 quadro. **Parser de shapefile e gerador de stipple ficaram no scratchpad** (`shp-parse.mjs`, `terra-gen.mjs`); shapefiles do Natural Earth baixados no scratchpad, fora do git. Checkpoint do estado ANTERIOR (antes de sonar/terra/giro) em `scratchpad/checkpoint-canvas/`. **Não medir FPS na aba que a máquina dirige: roda oculta, rAF congela, timing 3,5× distorcido — validar animação com o Pedro ao vivo.**

**Feito na sessão de 23/jul (tarde/noite) — commit `cd7a6eb`, pushado em `homolog`:**
- **Corpo docente:** as pílulas de texto viraram as **logos reais** das casas em **mono off-white** (`public/lp/dl-*.png`, 12 logos). Fundos removidos de verdade por luminância via `sharp`: XP virou a caixa off-white com o "XP" **vazado** (marca real), Bradesco limpo do xadrez assado no `.jpg`, IPEA **invertido** (era branco-sobre-teal). Banco Central/QR Asset/Caixa são a marca real mesmo (colchetes, monograma, X). Alturas por logo p/ equalizar peso (wordmarks largos menores, empilhadas maiores) — mapa `LOGO` na etapa **7h**. **Balão flutuante** com o nome no hover de cada logo = **CSS puro** (`.dl-tip::after` com `attr(data-nome)`), card ganhou `overflow:visible` p/ não cortar; desativado em `hover:none`. Cargo do Ywata → **"Ex-VP Caixa · CRO QR Asset"**.
- **Hero copy (7m):** headline **"Seu patrimônio não devia depender de um só país"**, subtítulo com o peso dos 4 (BC/XP/Caixa/Bradesco), CTA **"DOLARIZE COMO OS GRANDES"**. Tira de especialistas removida.
- **Topbar (7n):** nav Professores/Formação/Ferramentas/Idealizadores/FAQ; ENTRAR e INSCREVA-SE em caixa alta.
- **Currículo (7h-bis):** as **16 aulas** ganharam **descrição completa** dos assuntos (em cima dos tópicos existentes), no lugar da linha curta; `line-height:1.55`; guard confere as 16. Guia anti-slop do COPY.md seguido.
- Docs sincronizados: **PRD.md** (topbar/hero/docentes/formação/cargo Ywata) e **CHANGELOG.md**.

**Método desta sessão:** iteração visual via Chrome dirigido é enganosa — a aba que a máquina dirige roda OCULTA, então `requestAnimationFrame` congela (animações e efeitos de mouse parecem não funcionar). Validar animação por medição (computed style / dispatch de evento com rAF sincronizado), NÃO por screenshot; e pedir ao Pedro que teste ao vivo com a aba dele em foco. Reload sem cache: navegar com `?v=N` na URL (o hot-reload do Next às vezes serve body.html velho). **Commit via Bash: NÃO usar here-string `@'...'@` (é PowerShell, vaza "@" pro assunto); usar múltiplos `-m`.**

**Sessão de 24/jul (commit `93bdbc3`, pushado em `homolog` — auto-deploy no ar):** revisão de copy da **Ferramentas** (H2 "O que fica com você depois da última aula") e da **Oferta** (H2 "Um pagamento, um ano para aplicar"; subtítulo do bundle removido; lista refeita em 6 itens; parcelamento "10x de R$ 39,70 sem juros"; régua do rótulo "Você recebe" removida). CTA final passou a repetir "DOLARIZE COMO OS GRANDES". **Módulo IV virou "Ativos Digitais"** (era Criptoativos) e a aula 15 virou "ETFs e análise on-chain" — mas as 4 aulas do módulo continuam sendo de cripto, o currículo precisa acompanhar quando o conteúdo abrir. **Revisão geral:** chancela "editorial"→"institucional" no rodapé, copyright com "·", card do Módulo III → "Mercado Americano", resumo do currículo espelhando a Ferramentas, grafia "e-book", nav do rodapé igual à topbar, links duplicados da faixa base cortados, prazo unificado em "1 ano", bio do Ywata corrigida (SEPEC/Min. Economia + VP de riscos da Caixa). **Ritmo vertical uniformizado em 200px** entre todas as seções (etapa 7q; regra registrada no DESIGN.md §5). Novas etapas do port: **7o** (Oferta), **7p** (CTA final), **7q** (ritmo vertical), **7r** (coerência de nomes). PRD/CHANGELOG/DESIGN sincronizados.

**Segunda leva de 24/jul (commit `e05c7ff`, pushado em `homolog`):** chip de módulo dos cards de docente **sempre em 1 linha** (`.chip-modulo` com nowrap; "Mercado Americano" não cabia nos 236px úteis e virou **"Mercado dos EUA"**; media query encolhe fonte/tracking abaixo de 760px porque o card cai para 78% e o `overflow:visible` deixaria vazar). Bio do Ywata reduzida de 221 p/ 152 caracteres (as outras têm 136–148 — **manter essa unidade**). Faixa de logos com `min-height:28px`: a altura seguia a maior logo e fazia a divisória subir no card do Roxo.

**Ritmo vertical da LP (regra vigente, DESIGN.md §5):** **200px** de respiro quando há **virada de fundo** entre seções (claro ↔ verde) e **128px** quando não há (`padding-bottom:24px` na de cima + 104 na de baixo). Minha primeira versão — 200px para tudo — estava errada e o Pedro corrigiu. Exceções: hero → ficha técnica se sobrepõe (`margin-top:-44px`); currículo → Ferramentas tem o **divisor decorativo do olho** no meio (96 + ornamento + 104 = 303px, não é bug).

**Decisões do Pedro registradas (não repropor):** a calculadora mantém "Simule cenários e decida com números, não com achismo"; o e-book fica genérico ("Ebook exclusivo") porque ainda é placeholder; **o curso TEM turmas** (nunca escrever "sem turma"); sem âncora de preço no card (nada de "menos de R$ 25 por aula" nem comparação com spread de remessa); preço à vista grande e os 3 selos mantidos; "GARANTIR MINHA VAGA" segue válido justamente porque há turma.

**Pendências abertas (atualizado 25/jul, sessão do Mac):**
1. **Links reais das redes sociais** do rodapé (hoje `href="#"`).
2. ~~Rodapé~~ fechado em 25/jul (nav da LP já vinha da etapa 9; o da área foi alinhado no `buildFooter()` do port-area).
3. ~~COPY.md~~ promovido a `docs/COPY.md` no handoff de 25/jul; segue faltando o `banned-words.md` que ele referencia.
4. **Copy seção a seção: ENCERRADA por decisão do Pedro (25/jul).** FAQ e CTA final, as duas últimas seções, foram dados como **finalizados por ora**, sem varredura: o texto atual fica. Reabrir só se a rodada pré-launch pedir. Histórico que segue valendo e NÃO se reproprõe: o eco "o Brasil lê" (Quem Assina), a pergunta de conta no exterior do FAQ, o H2 do CTA final, a Ficha técnica e o Diagnóstico — tudo copy aprovado pelo Pedro com minhas ressalvas registradas e recusadas.
5. **Mobile da LP trabalhado em 25/jul** (globo mantido; Ferramentas reordenada; Quem Assina sem selo + slider; bolinhas nos carrosseis; wordmark e Entrar na topbar) — ver CHANGELOG da data.

**Registro:** CHANGELOG.md, docs/BACKLOG.md e docs/DESIGN.md atualizados. Imagens de referência em `referencias/cowork/` (inclui uma com marca d'água dreamstime — NÃO commitar) ficaram fora do git de propósito. Impeccable instalado em System32 — usado nesta LP (ver [[impeccable-instalado-system32]]).

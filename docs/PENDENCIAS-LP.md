# Pendências — LP + Área do Aluno

Checklist vivo do que falta antes do "pronto para produção" (V1/homolog). Atualizado
conforme os insumos chegam. Quando o Pedro perguntar "quais as pendências?", este é o
documento a puxar. (O admin é V2 — ver `PLANO-ADMIN.md`.)

_Última atualização: **2026-08-18, fim do dia**. A fila da próxima sessão está no bloco
**"▶ PRÓXIMA SESSÃO"** logo abaixo, e é por ali que se começa._

**O que mudou de lugar e vale saber antes de mexer em qualquer coisa:**

- O **currículo vive no banco** (`modules`/`lessons`), não em `lib/curso.ts`, e o **progresso**
  também (tabela `progress`, era cookie que o aluno editava).
- A **guarda de acesso do aluno** mora no layout do `(sala)`, não no proxy. A **do admin** mora no
  layout do `/admin`, pelo mesmo motivo.
- O **Tailwind só roda no admin**. LP e área do aluno são HTML portado com CSS próprio, e o
  `app/globals.css` que o `AGENTS.md` citava nunca existiu; os tokens vivem em
  `app/admin/admin.css`.
- Existem **dois níveis de admin** (mestre e comum), e `profiles.is_admin` só muda pela service role
  ou por um admin existente. O primeiro admin de cada ambiente nasce de
  `scripts/admin-conta.mjs --mestre`, senão o `/admin` sobe inacessível.

**Três armadilhas de operação que já custaram tempo**, todas detalhadas no `HANDOFF.md` §6:
`npm run build` com o `next dev` de pé **trava o dev server** (parece defeito de produto e não é);
**route handler não passa por layout**, então rota que muta refaz a checagem de papel; e lógica que
precisa de self-check **não pode morar no módulo que importa Supabase**.

O histórico completo de tudo o que foi entregue está no `CHANGELOG.md`, em "Não lançado". Este
documento é a lista do que **falta**.

> Legenda: 🟢 dá para fazer agora (sem insumo externo) · 🔒 bloqueado por insumo/decisão.

---

## ▶ PRÓXIMA SESSÃO (fila montada em 31/jul, ao fim da leva de Conteúdo e E-mails)

**Revisão geral de 17/ago:** 28 achados (3 críticos de produção), plano de ataque em 4
rodadas no **`docs/PLANO-CORRECOES.md`** — é a fila de código da vez, junto com este bloco.
**Sessão de 18/ago FECHADA, tudo pushado até `ce4d86c`** (7 commits): as **4 rodadas do
plano** feitas e QA'd (1+2 em `c757f12`, 3 em `5c42324`, 4 em `31307ff`; migrations
**0018–0022** aplicadas no ei-homolog), **varredura de segurança** sem vulnerabilidade
alta/média com os fechos de baixa em `e5a35fe` (relatório na entrada "Segurança" do
CHANGELOG), e a copy **"BlockTrends é masculino"** em `43d5c92`+`ce4d86c` (regra no
AGENTS.md). Do plano sobrou só o **item 23** (🔒 URLs de Termos/LGPD — insumo do Pedro; a
correção entra pelo `port-lp.mjs`). Oferecido sem resposta: copy que degrada mal com nome
vazio ("Olá," na topbar). O resto desta fila abaixo segue valendo (insumos externos:
checkout do Guru, vídeos, materiais, domínio de e-mail).

Nada de recontar história: leia este bloco e vá para o trabalho. O que aconteceu está no
`CHANGELOG.md`; o que **decidir** está aqui.

**Onde paramos:** o **painel está completo** — Painel, Alunos, Detalhe do aluno, Equipe, Conteúdo,
E-mails, **Questões**, **Auditoria** e a casca, todas no ar em homolog. O detalhe do aluno **edita**
nome, e-mail, telefone e progresso por módulo, com salvamento automático e rastro. Entrou também a **camada de envio de e-mail**
(que não existia) com o builder dos transacionais nossos. Migrations `0003` a `0015` aplicadas no
`ei-homolog`. A conta
`pedrohfontei@gmail.com` é **admin mestre**, e a senha dela em homolog é a de teste conhecida. Duas
travas caíram em 31/jul: as **três decisões do §4.6** (tela construída) e a **`liberacao_total`** do
homolog, agora desligada em 8 das 9 matrículas.

**Uma coisa sua destrava entrega de e-mail:** a `RESEND_API_KEY` no `.env.local` e nas variáveis do
Netlify (item 2 abaixo). Fora isso, o que sobra é insumo externo (checkout do Guru, vídeos, materiais,
domínio de e-mail) e as duas decisões pequenas do §4.4.

### Código, na ordem sugerida

1. ~~**Tela de conteúdo do admin**~~ **FEITA em 31/jul**, com as três decisões do §4.6 tomadas no
   mesmo dia: URL colada em vez de upload, reordenar aulas permitido, criar e apagar com
   confirmação que diz quantos alunos perdem progresso. Detalhe no `CHANGELOG.md` e no
   `PLANO-ADMIN.md` §4.6. O que ficou de fora e por quê: `lessons.duracao` e `modules.arte`, que
   não têm leitor nenhum no app.
2. ~~**`/admin/emails`**~~ **FEITA em 31/jul**, migration `0008` (log) e `0009` (templates). A tela
   virou duas metades no mesmo dia: o log e o **builder dos transacionais nossos**, pedido pelo Pedro
   depois de ver o log vazio. Junto veio a **camada de envio**, que não existia: até 31/jul o projeto
   não mandava e-mail nenhum, e o "queued" do log era falso.

   **🔒 Falta uma coisa sua para o primeiro e-mail sair de verdade: a `RESEND_API_KEY` no
   `.env.local`** (e nas variáveis do Netlify, contexto de produção, para o homolog no ar). É a mesma
   conta Resend que você configurou em 28/jul como SMTP do Supabase Auth: o painel do Resend, em API
   Keys. Sem ela tudo funciona menos a entrega, e cada tentativa fica registrada no log com
   `falha: sem RESEND_API_KEY no ambiente`. Não me mande a chave por aqui, cole no arquivo.
3. ~~**`/admin/questoes`**~~ **FEITA em 31/jul**, a pedido do Pedro, e **sem migration nenhuma**: a
   tabela `questions` já tinha tudo. As duas decisões que estavam listadas aqui foram tomadas na
   construção: **apagar E desativar**, porque são coisas diferentes (desativar é questão que pode
   voltar, apagar é questão que nasceu errada, e nenhum dos dois corrompe prova já feita por causa do
   snapshot), e **sim ao contador**, com duas réguas: o piso de 5 ativas por módulo, que se rompido
   faz a prova parar de abrir, e a meta de 25 do PRD.

   **O painel está completo.** As telas do `PLANO-ADMIN` estão no ar, e desde o fim do dia são sete,
   com a de Auditoria.

4. **QA dos caminhos da prova, um a um no navegador** (pedido do Pedro em 31/jul). Andados até o fim:
   conta nova até a prova, aprovação, reprovação, liberação da 2ª chamada pelo suporte, 2ª chamada
   aprovada e **abandono** (nas duas metades: o aluno que volta atrasado e o que nunca volta). Cada
   caminho achou defeito que build e lint não pegam — quatro no total, todos consertados no mesmo dia
   e no `CHANGELOG.md`. **Falta um caminho:** entregar com questão em branco, para ver como a grade do
   modal de envio pinta quem ficou vazia (item no "Guardado para pensar depois").

**Uma consequência de 31/jul para quem for testar a área do aluno:** com a `liberacao_total`
desligada e `inicio_em` em 29/jul, as contas de teste veem só os módulos que a esteira já abriu.
Isso é o produto. Para inspecionar o curso inteiro, use `pedrohfontei@gmail.com`.

**Corrigido em 31/jul, ao fim do dia:** essa conta **não** tem mais `liberacao_total`. Conferido no
banco: a coluna está `false` nas nove matrículas. O que abre o curso inteiro para ela é o
`inicio_em` em **01/jul**, ou seja, a esteira semanal já rodou até o fim. Para uma conta nova ver
tudo, o caminho é recuar o `inicio_em` ou ligar a coluna, e o segundo é o que se parece menos com o
produto real.

**Ao construir tela nova de admin, três coisas que já custaram tempo** (detalhe no `HANDOFF.md` §6):
route handler **não passa por layout**, então rota que muta refaz a checagem de papel; peças de
tabela vêm de `app/admin/_ui/tabela.tsx`, não se inventa a sexta; e **não rode `npm run build` com o
`next dev` de pé**.

### Suas, e nenhuma trava construção nova agora

- 🔒 **13 · Quem escreve as ~100 questões.** Não bloqueia código, mas é o que falta para a prova
  deixar de rodar sobre as 24 de exemplo, onde dois sorteios repetem 19 das 20.
- ~~🔒 **Auditoria do admin**~~ **COMPLETA em 31/jul**, tabela e tela. A `admin_audit` (migration
  `0014`) entrou junto com a liberação de 2ª chamada, e a tela `/admin/auditoria` (migration `0015`)
  no fim do mesmo dia, quando o rastro já guardava cinco tipos de ação, incluindo troca de e-mail.
  Somente leitura, com busca por autor, alvo ou ação. **Achou um defeito na primeira lista carregada:**
  o preenchimento automático do navegador tinha alterado o nome de um aluno sozinho, em cima do
  salvamento automático da tela de edição.
- 🔒 **URL do checkout do Guru** e os **materiais e vídeos reais**, que seguem pendentes.
- 🔒 **Arte do banner dos e-mails**, se você quiser usar (o campo existe desde 31/jul, por template,
  com **upload** na tela). **1120 × 360 px** em PNG ou JPG, de preferência abaixo de 200 KB, que exibe
  em 560 de largura. Lembrando que ele é decoração: o texto do e-mail se explica sem imagem, porque
  boa parte dos clientes bloqueia imagem por padrão, e o texto alternativo é obrigatório por isso.
- 🔴 **DOMÍNIO DE E-MAIL: isto virou BLOQUEIO DE LANÇAMENTO, não questão de marca** (medido em
  31/jul/2026). Com o remetente de teste `onboarding@resend.dev`, o Resend **só entrega para o e-mail
  do dono da conta**. Provado sem querer: o e-mail de aprovação disparado para `carlos@testinho.com`
  voltou `403 validation_error: You can only send testing emails to your own email address`, e está
  registrado assim no `email_log`.
  **Consequência:** hoje o único endereço do mundo que recebe e-mail nosso é o do Pedro. Toda a camada
  funciona (template, banner, variáveis, gatilhos, log), e nenhum aluno receberia nada. Verificar um
  domínio no Resend, ou configurar o SES, é o que destrava **todos** os e-mails de uma vez.
  Enquanto isso, o log conta a verdade: a falha aparece com o motivo em vez de sumir.

  **Conferido na API do Resend em 31/jul:** a conta **não tem nenhum domínio cadastrado**, e não existe
  lista de teste ou allowlist. Os dois contornos óbvios foram testados e recusados com a mesma
  mensagem: alias com `+` no próprio endereço (`pedrohfontei+aluno1@gmail.com`) e outro endereço
  qualquer (`ph@maracajalabs.com`). Verificar domínio é o único caminho, e **é liberado no plano free**
  (o free limita volume, não destinatário).

  **RECOMENDAÇÃO, e ela separa dois problemas que não precisam andar juntos:** verificar um
  **subdomínio de um domínio que já é nosso** (algo em `maracajalabs.com` ou `qr.capital`) só para o
  homolog destrava todo o e-mail hoje, para qualquer destinatário. O remetente **de produção** é outra
  decisão: a LP vai para um subdomínio da Abril, e registro DNS em domínio da Abril depende de gente e
  prazo institucional. Amarradas, o e-mail fica esperando a Abril; separadas, o homolog anda agora — e
  manter remetentes diferentes é saudável, porque reputação de teste não contamina a de produção.
  Depois do domínio: preencher `EMAIL_FROM` (a variável já está ligada) e rodar a bateria de entrega.
- 🔒 **Template `Invite user`**, que era o item 3, **deixou de ser necessário** para o acesso do aluno:
  o link agora é montado com o `hashed_token` e vai no nosso e-mail de boas-vindas. Só volta a importar
  se alguém convidar gente pelo painel do Supabase.

### Já resolvidas, para não voltarem à fila

**18 · Acesso de admin** (as quatro decisões, 30/jul), **20 · Política de senha** no painel do
Supabase (30/jul), **16 · Cron da prova abandonada**, **17 · Modal de envio e grade**, a **escalada
de privilégio** do `is_admin` e o **admin mestre**. Em 31/jul entraram as **três decisões da tela de
conteúdo** (§4.6) e a **`liberacao_total` do homolog**, desligada em 8 das 9 matrículas. Tudo no
`CHANGELOG.md` em "Não lançado".

### Feedback ao usuário: a camada que atravessa a área logada

Levantada pelo Pedro em 28/jul. Auditoria completa e priorizada em `docs/FEEDBACK-UX.md`: 12
achados graves, 11 médios, 13 pontos já cobertos. Estes quatro primeiros são de **camada**, cada
um consertando várias telas de uma vez, e é por isso que vêm antes dos de tela.

4. ~~**Definir os quatro padrões de feedback e registrá-los no `DESIGN.md` §3.**~~ **FEITO em
   29/jul**, junto com a 6, como estava combinado. Os quatro estão no `DESIGN.md` §3 com
   contraste medido **nos dois temas** (a área não é escura como o login: o chrome é, o miolo
   das telas é claro), e implementados em `app/app/_ui/feedback.tsx`. As três caixas escritas à
   mão nos clients de login, recuperação e redefinição foram substituídas pela mesma peça.
   **APROVADO pelo Pedro em 29/jul**, as cinco decisões inteiras, com uma ressalva que virou
   regra nova: o verde semântico precisa de **um valor por fundo**, porque nenhum passa AA nos
   dois (`#1B7A50` no claro, `#3FB07A` no escuro, este escolhido por ele). Está no `DESIGN.md` §2. Não é dívida aberta:
   hoje o verde semântico só aparece em fundo claro.
   O padrão 4, a lista de exigências, ficou sem componente de propósito, porque o consumidor é
   a tarefa 10; o que existe é a fonte dele, a lista `EXIGENCIAS` de `lib/senha.ts`, que virou
   dado em vez de prosa.
5. ~~**Preencher o nome do aluno no servidor.**~~ **FEITO em 29/jul.** O `getUsuario()` com
   `cache()` do React + o `preencherUsuario()` puro, usados pelo layout (chrome) e por cada
   tela com marcador. Conta e certificado **viraram dinâmicas**, que era a decisão embutida:
   o Pedro aprovou depois de ver o custo medido, porque a chamada extra cai nas duas telas
   menos visitadas do produto e some das dezenas de aberturas de aula. O preenchimento no
   cliente saiu do `AreaChrome`, junto com uma chamada de sessão por navegação. Verificado no
   HTML servido: zero ocorrências de "Pedro" nas três telas. Guarda em `npm run check:usuario`.

   _Texto original:_ Medido: o HTML servido a um aluno logado traz
   `>Pedro<` duas vezes e o nome real zero vezes, porque o `AreaChrome` preenche num efeito de
   cliente. Cai também no resultado da prova ("Você concluiu a formação, Pedro"). Fazer como o
   `fillHome` e o `fillQuestao` já fazem com outros dados. Vale para `[data-u]`, `[data-email]`
   e `[data-acesso]`.

   **Achado de 29/jul que muda o tamanho desta tarefa:** `/app/conta` e `/app/certificado` são
   **estáticas** no build (`○`), não dinâmicas, e já eram antes. Elas não leem nada no
   servidor, só servem o HTML portado. Preencher o nome no servidor nessas duas significa
   torná-las dinâmicas, o que é decisão a mais e não só mudança de lugar. E são justamente as
   duas onde o dado importa: "Minha conta" mostra e-mail e prazo, e o certificado leva o nome.
6. ~~**`loading.tsx`, `error.tsx` e `not-found.tsx` no grupo `(sala)`.**~~ **FEITO em 29/jul.**
   Saíram quatro arquivos, não três: o `not-found.tsx` aninhado só atende quem chama
   `notFound()` no próprio ramo, então uma URL sem rota nenhuma continuaria caindo no 404
   global, que vem no tema claro da LP. O catch-all `(sala)/[...resto]` traz essas URLs para o
   painel da área. Verificado no dev server com sessão real, não só por build.
7. ~~**Sessão expirada explicada** na volta ao login.~~ **FEITO em 29/jul**, no padrão que a
   recuperação de senha já usa. O detalhe que fez a tarefa render mais que um parâmetro: o
   proxy só manda o `?estado=expirou` para quem **de fato tinha sessão**, checado pela presença
   do cookie `sb-*-auth-token` lido ANTES do `getUser()` (quando o token não vale mais, o
   cliente do Supabase limpa esses cookies, e a checagem depois daria sempre falso). Sem isso,
   quem só digitou `/app` sem nunca ter entrado leria que a sessão dele expirou, e sairia
   procurando um problema que não existe. O redirect também passou a **descartar a query** da
   tela de origem, que vazava contexto na barra de endereço.

### Feedback ao usuário: por tela

8. ~~**"Trocar senha" em Minha conta não faz nada.**~~ **FEITO em 29/jul, junto com a 10.**
   Decisão do Pedro: trocar **ali mesmo, pedindo a senha atual**, em vez de mandar para o
   e-mail. O motivo é de segurança e não de conforto: por padrão o Supabase deixa a **sessão
   sozinha** trocar a senha (a opção "Secure password change" do painel vem desligada), então
   sem a senha atual um navegador destravado por dois minutos bastaria para alguém tomar a
   conta do aluno. A conferência usa `signInWithPassword`, único jeito de verificar a senha
   atual no Supabase; errar ali não mexe na sessão de quem já está logado.
9. ~~**`catch` no download do certificado**, mais rótulo de trabalho.~~ **FEITO em 29/jul.**
   Saíram três consertos: rótulo "Gerando PDF..." pelo `emTrabalho()` (a operação leva
   segundos, e opacidade sozinha é indistinguível de clique perdido), o `catch` com caixa de
   erro no tema claro, e o fechamento de um **quinto caminho mudo** que a pendência não
   listava: sem o `#cert-preview`, a função fazia `return` na primeira linha, sem nem a
   opacidade piscar. O `pintarCaixa` ganhou link opcional, montado com nós de texto e nunca
   com `innerHTML`, para o "WhatsApp" da mensagem ser clicável sem abrir porta de injeção
   num caminho de erro. Verificado no browser forçando a falha dentro do `try`.
10. ~~**Indicador progressivo das exigências de senha.**~~ **FEITO em 29/jul, junto com a 8.**
    O `ligarExigencias()` do `_ui/feedback.tsx` (padrão 4 do `DESIGN.md` §3), alimentado pela
    lista `EXIGENCIAS` de `lib/senha.ts`. Saiu em **três** telas, não duas: primeiro acesso,
    redefinição e o formulário novo da conta. No primeiro acesso ele **substituiu** a frase
    estática da regra, que era exatamente o sintoma que o Pedro tinha apontado. Vai sempre
    depois do primeiro campo de senha, que é onde ela é escolhida, nunca depois do "repita".
11. **Aviso de tempo acabando na prova.** ~~E aula sem material mostrando "em breve".~~
    A metade do cronômetro está **FEITA em 29/jul**: aviso a 10 e a 5 minutos, com o
    cronômetro virando pill âmbar (o mesmo par do módulo deficitário, `DESIGN.md` §2, cor como
    informação). A frase diz o que **acontece** no zero, e não só quanto falta, porque saber
    que o respondido é enviado tira o pânico de perder tudo. Verificado de ponta a ponta,
    encurtando o `deadline` no banco para cruzar os dois limiares.

    A metade do "em breve" **saiu daqui e foi para a tarefa 15**, por decisão do Pedro em
    29/jul. Motivo: o estado "aula sem material" **não existe no sistema**. O `lib/curso.ts`
    não tem campo de materiais, e o `fillAula` reescreve os três links do design para o mesmo
    PDF de exemplo, então toda aula mostra três materiais. Construir a tela vazia agora seria
    escrever um caminho que nada alcança, com um modelo de dado inventado que seria refeito
    quando os materiais reais chegarem.
12. ~~**O resto do mapa.**~~ **FEITO em 29/jul.** Metade dela já tinha caído junto das outras
    tarefas do dia, e isso fica registrado para ninguém procurar trabalho que não existe mais:
    o `role="alert"` passou a sair do `pintarCaixa` em toda caixa de erro (e o `aria-live` nas
    de aviso e sucesso), e o rótulo de botão em trabalho do login saiu na tarefa 4.

    O que sobrava e foi feito agora: **marcação otimista do "Concluir aula"**, porque o cookie
    muda na hora mas a tela só acompanha depois do `router.refresh`, que é ida ao servidor, e
    nesse intervalo o botão ficava idêntico e o clique parecia não ter pego. Os dois estados do
    botão viraram `estadoConcluir()` em `lib/aula-template.ts`, exportado, para servidor e
    cliente pintarem do mesmo lugar. E **feedback do "Sair"**: `signOut` é ida à rede, e o menu
    ficava aberto e parado. O rótulo vira "Saindo..." e o link para de aceitar clique. O
    `emTrabalho` passou a aceitar link, que não tem `disabled`: barra pelo ponteiro e diz
    `aria-disabled` ao leitor de tela.

### Frentes grandes

13. 🔒 **Banco de questões da prova**, ~100 questões, 25 por módulo. É o que falta para a prova
    deixar de rodar sobre as 24 `[EXEMPLO]`. Com 6 por módulo, dois sorteios repetem 19 das 20
    questões; com 25, a sobreposição esperada cai para cerca de 4.

    **TBD (28/jul):** quem escreve as questões ainda não está definido. O `PRD.md` §7 diz que o
    banco é construção nossa ponta a ponta, estrutura e conteúdo, e não dependência de docente
    nem de terceiro; falta decidir se saem daqui ou de outra fonte. **Não bloqueia mais nada:**
    o motor está pronto e testado sobre as 24 de exemplo, então tudo da fila anda sem isto.
14. ~~**Matrículas + `/app/acesso` + guarda real de acesso.**~~ **FEITO em 29/jul.**

    - **A guarda mora no layout do `(sala)`, não no `proxy.ts`.** O proxy roda em toda
      requisição do site, inclusive a LP, e pagaria uma ida ao banco por página; no layout, o
      `cache()` faz a consulta ser a mesma que a tela de acesso usa depois. O proxy continua
      responsável só por "existe sessão?".
    - **`/app/acesso` fica FORA do grupo `(sala)`**: lá dentro, a guarda se redirecionaria para
      si mesma em laço. Sem chrome também é o certo, porque a navegação do chrome leva ao curso,
      que é justamente o que está bloqueado. Reaproveita a coluna do login pelo `telaSenha` sem
      campos, então o aluno bloqueado continua dentro da marca.
    - **Quatro estados, não três:** `ativa`, `expirada`, `revogada` e **`ausente`**. O último é
      conta logada sem matrícula nenhuma, que pelo PRD §4 é anomalia de provisionamento e não
      prazo vencido; tratar os dois igual esconderia um defeito atrás de uma tela de renovação.
      Cada um tem texto próprio, e os três de bloqueio dizem que **o progresso não é apagado**.
    - **O estado vem do banco, nunca da URL.** Cheguei a aceitar `?estado=` no redirect e tirei:
      parâmetro de query é escolhido por quem digita o endereço, e a tela passaria a contar a
      história que o visitante quisesse.
    - **O primeiro acesso passou a criar a matrícula.** Em homolog o `?s=primeiro` faz o papel
      da compra, então ele também provisiona; sem isso a conta nova nasceria bloqueada. Em
      produção quem cria continua sendo o webhook do Guru, com o `guru_order_id` real.
    - **Backfill aplicado:** `scripts/matricular-existentes.mjs` (idempotente, com simulação por
      padrão) criou matrícula para as **9 contas** que já existiam sem nenhuma, incluindo as de
      pessoas de verdade que testam o homolog. Sem ele, o primeiro deploy trancaria todo mundo
      para fora.
    - Verificado nos quatro estados, com a matrícula da conta de teste virada uma a uma.
15. **Migrar o curso para o banco** (a 14 já saiu, então está destravada).

    > **Correção de 29/jul: este item dizia que a tabela `lessons` estava vazia. Não está.**
    > Medido no homolog: `modules` tem **5** linhas, `lessons` tem **17**, com `conta_no_gate`
    > marcando exatamente as 16 avaliadas, e `questions` tem as 24 de exemplo. O seed foi
    > aplicado em algum momento e o documento não acompanhou. Só `materials`, `progress` e
    > `certificates` estão vazias, e as duas primeiras por motivo legítimo (não há material real
    > nem progresso gravado ainda).
    >
    > **Consequência: a tarefa é menor do que parecia.** Não é migrar dado, é o app parar de ler
    > `lib/curso.ts` e o progresso sair do cookie. Conferido também que a ordem e os títulos do
    > banco batem com o `lib/curso.ts` nas 17 aulas, então a ponte entre os dois é determinística.

    Ela se divide em duas metades, e elas são **acopladas**: `progress.lesson_id` é FK para
    `lessons`, então não dá para tirar o progresso do cookie sem as aulas no banco (o que hoje
    já é verdade).

    **15a — progresso no banco.** É a metade com consequência. O gate de 16/16, o
    `aulasRestantes` e a sidebar são conferidos hoje contra um cookie que o aluno edita, e isso
    já foi explorado três vezes em 29/jul: para abrir o gate da prova, para forjar 16/16 contra
    a esteira, e para fazer um módulo travado se exibir como "4/4 ✓". As policies de escrita do
    próprio aluno em `progress` já existem no schema.

    **A aula sem material saiu desta tarefa e já está FEITA (29/jul).** Ela não dependia do
    banco: virou dado em `lib/materiais.ts`, e aula sem material declarado mostra "em breve".
    Cheguei a implementar lendo da tabela `materials` e o Pedro mandou reverter, com o argumento
    que ficou como regra: **material é conteúdo da página, não estado do aluno**, então mora no
    código junto do resto do currículo e não custa consulta por página.

    **15b — currículo lido do banco.** Mata a duplicação entre `seed.sql` e `lib/curso.ts` e
    destrava o "em breve" dos materiais, que veio da tarefa 11. Estrutural, sem risco de
    segurança.

    **Entra aqui junto (movido da tarefa 11 em 29/jul):** a **aula sem material** mostrando
    "em breve" em vez de seção vazia, que o `PRD.md` §6 exige. Ela veio parar nesta tarefa
    porque hoje o estado é **inalcançável**: o `lib/curso.ts` não tem campo de materiais, e o
    `fillAula` reescreve os três links do design para o mesmo PDF de exemplo, então toda aula
    exibe três materiais. O estado vazio só passa a existir quando os materiais tiverem fonte
    de verdade, que é a tabela `materials` desta migração. Fazer antes seria inventar um
    modelo de dado provisório e reescrevê-lo depois.

### Dívidas da prova, marcadas de propósito

16. **Cron da prova abandonada.** Quem fecha a aba e não volta deixa a tentativa `in_progress`
    para sempre: o cronômetro do cliente só envia com a aba aberta. O `PRD.md` §15 prevê
    exatamente essa rotina ("prova com deadline estourado") e ela não existe.
17. **Modal de confirmação de envio e grade de questões.** Hoje o envio usa um `window.confirm`
    provisório, posto porque a tentativa é única. O critique de design aponta a ausência da grade
    como a maior lacuna de UX da tela, e é o trabalho mais pesado dela. Depende da 4.

### Decisões esperando o Pedro

18. 🔒 **Acesso de admin**, as quatro perguntas do `PLANO-ADMIN.md` §8. Ganhou urgência concreta:
    `is_admin()` existe, `admins = 0` e nada no sistema atribui o papel, então o admin seria
    construído sem porta de entrada.
19. ~~**Percentual verde no resultado aprovado.**~~ **RESOLVIDO em 28/jul**, ainda na sessão. O
    Pedro decidiu verde para sucesso e pill âmbar para módulo deficitário, com corte em 70%.
    Implementado, com as duas falhas de AA antigas dessas telas consertadas na mesma leva.
    Exceção de acento registrada no `DESIGN.md` §2 e medições no `FEEDBACK-UX.md`.
20. 🔒 **Espelhar a política de senha no painel do Supabase.** A regra do produto subiu para **8
    caracteres** com maiúscula, minúscula e número (decisão do Pedro em 28/jul), e já vale no
    nosso código nas duas portas. Falta a plataforma, e a distância entre as duas **aumentou**
    com o mínimo em 8. Medido na API em 28/jul, com a service role trocando a senha de uma conta
    de teste:

    | Senha | Supabase |
    |---|---|
    | `abc` | **recusa**: "Password should be at least 6 characters." |
    | `abcdef` | aceita |
    | `ABCDEF` | aceita |
    | `123456` | aceita |

    Ou seja, a plataforma garante **6 de comprimento e nenhuma classe de caractere**. Com a nossa
    regra em 8, até `Abc123` passa pelo Supabase e só é barrada pelo `validarSenha`. Qualquer
    caminho que não passe por ele (chamada direta à API, código futuro que esqueça o validador,
    a própria API de admin, que é como eu medi) aceita senha fraca. Em **Authentication →
    Password Requirements** dá para exigir as classes; o mínimo de 8 vai no campo de comprimento
    da mesma tela.

**Anotações que não são tarefa, mas evitam susto:**

- **Região.** O Supabase está em **us-east-2** e as funções do Netlify em **us-east-1**. O
  `PRD.md` §17 pede a mesma região pela regra de um roundtrip. Não vale migrar projeto de
  homolog por isso; é decisão de quando o `main` virar produção.
- **`NEXT_PUBLIC_WHATSAPP_URL` é env var morta**: o link está hardcoded em cinco lugares.
- **Conta de teste** `prova.motor@example.com` existe no homolog, com uma tentativa de prova
  aprovada em 85, útil para inspecionar as telas. Não precisa limpeza antes de produção, porque
  o `ei-prod` é outro projeto Supabase. O endereço `@example.com` é recusado pelo mailer do
  Supabase, então essa conta nunca recebe e-mail.
- **SMTP em homolog é o Resend**, remetente `onboarding@resend.dev`, usuário literal `resend`,
  senha sendo a API key, `smtp.resend.com:587`. Detalhe por ambiente no `AMBIENTES.md`.

---

## 🔴 Venda / checkout

- [x] **Homolog: compra → primeiro acesso** — "GARANTIR MINHA VAGA" leva a
      `/app/login?s=primeiro` (simula a compra, sem Guru) (2026-07-20).
- [ ] **Produção: checkout do Guru** — trocar o CTA pela **URL do checkout Guru**.
      _Insumo:_ URL do checkout (PH, com docs/secret do webhook).

## 🟢 Dá para fazer agora (sem insumo)

- [ ] **Prova funcional** — **motor pronto (28/jul)**, falta o **conteúdo**. Sorteio
      balanceado, snapshot, respostas e correção em 14/20 gravando em `exams`, cronômetro no
      `exams.deadline` (reentrada não reinicia), resultado com nota e desempenho por módulo
      reais. Pendente: escrever as **~100 questões**, 25 por módulo. O motor roda hoje sobre
      as 24 `[EXEMPLO]` do seed.
- [ ] **Definir como funcionará o acesso de admin** — o `PLANO-ADMIN.md` §2 já cobre o
      mecanismo (guarda no proxy + `is_admin()` + service role só no servidor), mas
      falta a operação: como o papel é concedido e o primeiro admin criado (bootstrap),
      se entra pela mesma `/app/login` ou por tela própria, e o que o não-admin vê em
      `/admin`. É decisão de spec, sem insumo externo; os pontos estão listados no
      `PLANO-ADMIN.md` §8. (O build do admin em si segue V2.)
- [ ] **Política de senha no painel do Supabase** — a regra do produto (8 caracteres, com
      maiúscula, minúscula e número) está em `lib/senha.ts` e vale nas duas portas que criam
      senha, nos dois lados. Falta espelhá-la em **Authentication** no painel, que é quem
      recusa também quem chame a API por fora do nosso código. _Insumo:_ ajuste no dashboard.
- [ ] **Cron da prova com deadline estourado** — previsto no `PRD.md` §15 e inexistente. O
      cronômetro do cliente só envia com a aba aberta, então quem fecha e não volta deixa a
      tentativa `in_progress` para sempre. A rotina corrige o respondido e registra o resultado.
- [ ] **Prova: modal de confirmação de envio e grade de questões** — hoje o envio usa um
      `window.confirm` provisório, colocado porque a tentativa é única e um clique acidental
      encerra a prova. O critique de design aponta a ausência da grade de questões como a maior
      lacuna de UX da tela, e é o trabalho mais pesado dela.
- [ ] **Matrículas (`enrollments`) e a guarda real de acesso** — há **zero** matrículas hoje, e
      a RLS de `modules`/`lessons`/`materials` exige `has_active_access()`. Sem isso, migrar o
      curso para o banco entrega currículo vazio a todo aluno logado. O `proxy.ts` só checa
      sessão; o `PRD.md` §4 manda `revoked` e `expired` caírem em `/app/acesso`. Frente única
      com a tela `/app/acesso`.
- [ ] **`{{ preco }}` / `{{ parcelas }}`** configuráveis (hoje hardcoded no porte).
- [ ] **Telas secundárias** — `/obrigado`, `/app/acesso`.
- [ ] **Remover atalhos de teste** (login e prova) antes do go-live. Entra aqui também o
      `scripts/aprovar-conta.mjs`, criado em 29/jul para revisar o design do certificado sem
      responder 20 questões: ele grava um resultado de prova que não aconteceu, o que em
      produção significaria emitir certificado para quem não fez a prova.
      **Senhas fracas conhecidas:** `testinhos@joao.com.br` e, desde 30/jul, também
      **`pedrohfontei@gmail.com`**, que é a conta de admin do homolog e está com `Admin123`.
      Essa segunda é a que pesa: senha de oito caracteres previsível numa conta que passa nas
      dez policies de `is_admin()` e lê o banco de questões com o gabarito. Vale só no homolog,
      e o `ei-prod` nasce com admin próprio pelo item 7 do `AMBIENTES.md`.
      **NÃO remover o `scripts/admin-conta.mjs`**: é procedimento de produção, não atalho.
- [x] **RESOLVIDO em 31/jul/2026: desligada em 8 das 9.** Decisão do Pedro: o homolog volta a
      gotejar, e só `pedrohfontei@gmail.com` mantém liberação total, para inspecionar o curso
      inteiro sem esperar a esteira. Quem for testar a área do aluno com outra conta vê os módulos
      que a esteira já abriu, contando de `inicio_em` (29/jul nas nove). O texto original abaixo,
      para o registro do que era o problema.
- [ ] **As 9 matrículas do homolog estão com `liberacao_total = true`** (achado em 30/jul/2026 pela
      própria tela de Alunos, no primeiro carregamento). Isso **desliga o calendário de liberação
      gradual para todo mundo**: o curso inteiro abre na hora, em vez de um módulo por semana.
      O default da coluna é `false`, a `0002` escreve `false` e o backfill não toca nela, então foi
      service role em algum teste, provavelmente para conferir as telas do curso sem esperar a
      esteira.
      **Por que importa:** a esteira existe por razão comercial, para o aluno não concluir e pedir
      reembolso dentro da janela de arrependimento. Com `liberacao_total`, um stakeholder testando
      homolog aprova um comportamento que **não é o produto**. Decidir se o homolog volta a
      gotejar (e quais contas ficam liberadas para teste), e garantir que nenhuma matrícula de
      produção nasça assim.
- [x] ~~**Código do certificado é fixo para todo mundo**~~ **RESOLVIDO em 31/jul/2026.** Emissão real:
      código `EI-XXXX-XXXX` aleatório e único por aluno (migration `0012` garante um por pessoa), gerado
      na aprovação nos dois caminhos, e a página pública passou a consultar `verify_certificate` no
      banco em vez de comparar com uma constante. O nome fixo "Pedro Teixeira" saiu junto: ele vinha da
      mesma constante e aparecia para qualquer consulta pública.
- [ ] **Pixels de tracking** (`fbq`/`gtag`) — estrutura pronta; precisa dos IDs.
- [x] ~~**Migrar o curso para o banco**~~ **FEITO em 29/jul/2026**, e o texto que estava aqui
      errava em dois pontos: a tabela `lessons` **não** estava vazia (o seed já tinha rodado) e o
      progresso saiu do cookie para a tabela `progress` no mesmo dia. Desde 31/jul quem edita esse
      conteúdo é `/admin/conteudo`.

## 🔍 Achados do QA visual de 31/jul/2026

Primeira passada visual nas telas construídas hoje, com o Chrome de volta. As três telas de admin
(Conteúdo, E-mails, Questões), o detalhe do aluno com as duas ações novas e o card de 2ª chamada na
home foram vistos ao vivo. Dois achados já foram corrigidos na hora (a copy do card, que não caberia na
coluna da prateleira, e o `margin-bottom` inútil num item de grid). Os de baixo ficaram.

- [x] ~~🔴 **O certificado imprime uma frase sem sujeito quando a conta não tem nome.**~~ **FECHADO por
      decisão do Pedro em 31/jul: não é problema, porque o nome será entrada obrigatória no cadastro.**
      Ele aparece vazio hoje na conta dele e em três telas (certificado, resultado "Você concluiu a
      formação, ." e o "Olá," do chrome), e isso é artefato de conta de teste criada sem metadata. Não
      construir guarda para um caso que o cadastro obrigatório elimina.
      **Consequência a não esquecer:** quando o cadastro obrigatório existir, ele precisa valer também
      para a conta criada pelo **webhook do Guru** (que hoje grava `nome` do payload) e para o
      backfill de contas antigas, senão o caso volta pela porta de trás.
- [x] ~~🟡 **O card da Prova Final na home não conhece o estado do aluno.**~~ **RESOLVIDO em 31/jul**,
      no mesmo dia, a pedido do Pedro: seis estados, com a linha e o destino do clique mudando em cada
      um. O reprovado não leva mais à prova e abre o WhatsApp.
- [ ] 🟡 **"Validar em estrategiainternacional.com/verificar"** é texto do design, no cartão do código.
      O link funciona (aponta para o `/verificar/<codigo>` real), mas o domínio escrito ali precisa
      casar com o domínio de produção quando ele existir.
- [ ] 🟡 **Duas assinaturas do certificado seguem "nome a definir"**, e o ano está fixo em 2026 no
      canto. Insumo, não código.
- [ ] 🟢 **O "certa" repetido nas quatro alternativas** da tela de Questões (`A certa`, `B certa`...)
      polui a leitura: o rótulo do grupo já diz "Alternativas, e qual delas é a correta". Tirar o
      "certa" de cada linha é uma linha de diff, e eu deixei para não misturar com o QA.

### Achados do caminho da 2ª chamada (31/jul)

- [ ] 🔴 **17 das 20 questões repetiram entre a 1ª e a 2ª chamada**, medido num ciclo completo de
      verdade. É consequência direta do banco de 24: sorteando 5 de 6 por módulo, a segunda prova é
      quase a mesma. **Isso esvazia o sentido da 2ª chamada**, porque o aluno refaz o mesmo exame. Não é
      bug de código, é o número que torna concreta a pendência das ~100 questões (tarefa 13): com 25 por
      módulo, a sobreposição esperada cai para 1 em 5.
- [ ] 🟡 **Uma resposta se perdeu ao responder e navegar em menos de 1 segundo.** No teste automatizado
      da 2ª chamada, a questão 2 ficou sem resposta: o contador mostrou 9 de 10 respondidas. Voltando
      pela URL, a resposta gravou normalmente. **Não sei se é artefato do meu robô ou corrida real**
      entre a server action que grava e a navegação do cliente. Um aluno humano clica mais devagar, mas
      numa prova de tentativa única perder resposta é grave, então vale isolar: reproduzir com dois
      cliques em sequência rápida e olhar se o `salvarResposta` chegou ao servidor.

### Achados do caminho do abandono (31/jul)

Caminho andado inteiro: 7 de 20 respondidas, aba fechada, prazo estourado no banco, e as **duas**
metades testadas — o aluno que volta atrasado e o que nunca volta (a rotina). Um bug encontrado e
consertado no mesmo dia (TDZ do cronômetro, no `CHANGELOG.md`). O que sobrou é copy:

- [x] ~~🟢 **Nenhuma tela diz ao aluno que o tempo acabou.**~~ **FEITO em 31/jul**, copy aprovado pelo
      Pedro no mesmo dia. Quatro textos trocam quando `submitted_at == deadline`, e dois deles são os
      que mais enganavam (o "ONDE REVISAR" sobre módulos que ficaram em 0% por não terem sido
      respondidos, e o mesmo conselho repetido no pé). Detalhe no `CHANGELOG.md`. O caso negativo foi
      conferido em tela: mesma nota entregue por clique continua com "Faltou pouco".
- [ ] 🟢 **"Faltou pouco, ."** — o nome vazio na tela de resultado, com a vírgula e o ponto órfãos. É
      o mesmo caso que o Pedro fechou como não-problema em 31/jul (nome vira entrada obrigatória no
      cadastro), registrado aqui só porque desta vez apareceu **em tela**, não em e-mail. Continua
      valendo a ressalva: a garantia tem de alcançar as contas criadas pelo Guru e as antigas.

### Guardado para pensar depois (31/jul)

- [ ] 🟡 **O NPS do certificado não grava nada.** A régua de 0 a 10 embaixo do certificado é clicável e
      pinta a escolha, e para aí: não existe tabela, rota nem coluna para a resposta. O `PRD.md` §4.1
      já lista "NPS médio" como métrica do Painel do admin, então hoje essa métrica não tem fonte.
      Decidir se entra no lançamento e como: uma tabela `nps` com nota e data por aluno resolve, e a
      pergunta de produto é se a resposta é anônima ou identificada.
- [ ] 🟡 **A grade do modal de envio não foi testada com questão em branco.** No teste de 31/jul as 20
      estavam respondidas, então todas apareceram douradas; falta ver como ela pinta quem ficou vazia,
      que é justamente quando essa grade serve para alguma coisa.
- [ ] 🟢 **Copy dos estados do card da Prova Final:** o reprovado e o aprovado ficaram em frase
      ("Você reprovou. Clique aqui...", "Aprovado. Baixe seu certificado."), e os outros três seguem no
      estilo do design, minúsculo com "·" ("liberada · 20 questões em 120 minutos", "prova em andamento
      · continue de onde parou", "2ª chamada liberada · comece quando quiser"). Decidir se harmoniza.

## 🆕 Pré-lista `/lista-de-espera` (construída em 02/set/2026, branch `lista-de-espera`)

Tela de captura da lista de espera, do handoff de design "LP de lista de espera — Estratégia
Internacional". Rota própria, CSS próprio (`app/lista-de-espera/estilo.css`) e componente de
globo próprio (`GloboEspera.tsx`, parado e em dois canvas). **Não encosta na LP de vendas:**
do que já existe ela só lê os dados do globo (`app/_lp/globo-dados.ts`) e os `@font-face` de
`app/_lp/styles.css`, e não passa pelo `port-lp.mjs`. Estática no build, junto com
`/lista-de-espera/obrigado`.

### Como o lead chega no RD (decidido em 02/set, testado com a conta real)

Pela **captura automática de Leads**, não pela API de conversões e não pelo formulário
embedado. O código de monitoramento do RD está no `<body>` das duas rotas (`Tela.tsx`), com
`defer` e não `async`, pelas duas exigências deles: o script vai no corpo e o `<form>` precisa
existir quando ele roda. A página é estática, então o formulário vem pronto na primeira
resposta e o aviso do RD sobre SPA não se aplica.

Três coisas que o formulário carrega por causa disso, e que somem se alguém mexer sem saber:
o `id="form-lista-de-espera"`, que é como o RD batiza o formulário no painel; o
`<input type="hidden" name="investe_fora">`, porque os chips são `<button>` e a captura só
enxerga campo de formulário; e o `<input type="hidden" name="lgpd" value="aceito-no-envio">`,
que registra a base legal depois que a caixa de aceite saiu.

**Não precisa de token.** Não há envio nosso: a rota `/api/lista-de-espera` existiu por meia
sessão como rede de proteção e **foi removida em 02/set**, junto com a `/lista-de-espera/obrigado`,
pela decisão do Pedro de confiar no RD e manter a confirmação no próprio card. O `CartaoConfirmado`
continua sendo componente, então uma página de obrigado, se um dia for pedida, nasce com dez linhas
em volta dele.

**Uma armadilha no `Formulario.tsx`, marcada em comentário:** o handler espera **400ms** antes de
trocar o formulário pelo card. Não é enfeite. Trocar o estado desmonta o `<form>`, e o RD lê os
campos depois do evento de submit; o teste que validou a captura rodava com um POST nosso no meio,
que dava exatamente essa janela, e ela ficou de propósito quando o POST saiu. Encurtar ou remover
faz o lead deixar de chegar no RD **sem erro nenhum na tela**.

### Trava para divulgar (uma, e não bloqueia o homolog)

- [ ] 🔒 **URL da política de privacidade** (`NEXT_PUBLIC_POLITICA_PRIVACIDADE_URL`). É o mesmo
      item 23 do `PLANO-CORRECOES.md`, aqui com consequência maior: a tela coleta dado pessoal,
      e desde 02/set o consentimento é o próprio envio, não uma caixa marcada. Sem a variável o
      trecho "Política de Privacidade · LGPD" sai **sem link**. Decisão do Pedro em 02/set:
      dispensável enquanto for homolog, necessária antes de divulgar.

### Decidido em 02/set, para não voltar à fila

- **O `/api/lista-de-espera` saiu.** Quem grava é o RD, e um endpoint que valida sem persistir
  só dava a impressão de rede de proteção.
- **A confirmação fica no card**, sem redirect. A `/lista-de-espera/obrigado` saiu junto.
- **SPF, DKIM e DMARC do domínio do BlockTrends: feito.** É de lá que o e-mail do RD sai, e com
  o WhatsApp fora da promessa o e-mail é canal único.
- **"live de lançamento" caiu de quatro para três aparições**: o primeiro bullet virou "Convite
  para a live.", já que o lide e o rótulo da rota estabelecem qual live é.

### Decisões de design tomadas aqui, para não se perderem

- **Onde o handoff escrito e o protótipo divergem, vale o protótipo**, que é o artefato que o
  cliente viu. São quatro valores: chip selecionado (`#F0E9D8` / `#7E6836` / peso 700, contra
  `rgba(169,142,78,.16)` / `#0B2D20` / 600), placeholder (`#8F887E` contra `#A8A49B`),
  transição do chip (`.2s` contra `.15s`) e as paradas do `vsGlow`.
- **A copy da tela não é mais a do handoff.** Headline, lide, bullets, teaser, aceite e card de
  confirmação foram reescritos com o Pedro em 02/set. O que sobreviveu do handoff é a estrutura
  e os limites do "o que não prometer": nada de vaga garantida, número de professores ou data
  de abertura.
- **Os 01..04 do teaser viraram uma rota**, com praça, trilho e uma corcova de luz percorrendo,
  nas mesmas cores e no mesmo período (5200ms) das rotas do globo. A ordem virou `<ol>`, para
  não se perder com os números fora da tela.
- **Três pontos de quebra, todos por container query e não por media query**, porque o que
  importa é a largura da coluna, que muda sem a janela mudar de faixa: a rota vira fileira de
  quatro em 540px de coluna (medido: o rótulo mais largo dá 119px), a assinatura empilha
  abaixo de 420px, e o globo repete o corte de 990px do `auto-fit` em JS (`CORTE` em
  `GloboEspera.tsx`) — esse último anda junto com a grade externa, mexer num sem o outro
  descola os dois.
- **Empilhadas, VEJA e BlockTrends casam por largura (200px), não por altura.** Deitadas valem
  os 30px e 19px do design. Numa pilha o olho compara a extensão da linha, e 122px contra
  207px fazia a VEJA parecer metade.
- **O globo compacto cruza a headline entre ~600px e o corte de 990px, e fica assim.**
  Verificado a 960px: o que passa por trás é stipple a 9–16% e linha de rota a 12%, e o texto
  continua legível. Abaixo de 400px fica limpo.

### Medido, não olhado

Varredura em 390, 768, 1024, 1280, 1440 e 1920px, com a viewport fixada por CDP (a
`--window-size` do Chrome inclui a moldura e não serve como viewport — dois prints meus
mentiram por isso): **estouro horizontal zero em todas**, e de 1024px para cima a tela cabe
inteira sem rolagem. Abaixo disso rola, e é inerente ao empilhamento.

**O que não foi verificado no navegador:** `prefers-reduced-motion`. O código está nos dois
lados (o globo pinta um quadro só, a luz da rota e o glow do card saem), mas nunca foi
exercido de fato.

## 🔒 Bloqueado por insumo

- [x] ~~**Template de e-mail do convite (primeiro acesso)**~~ **DEIXOU DE SER PENDÊNCIA em
      31/jul/2026**, e não por ter sido feito: o e-mail de boas-vindas passou a ser **nosso**, com o
      link montado a partir do `hashed_token` apontando para o nosso `/auth/confirm`. O template
      **Invite user** do painel só voltaria a importar se alguém convidasse gente pelo dashboard do
      Supabase.

### Antes de produção: o e-mail de boas-vindas (registrado em 29/jul, a pedido do Pedro)

**Duas das três caíram em 31/jul/2026**, quando a camada de envio passou a existir: o e-mail é
nosso, com layout de marca e copy passada pelo `COPY.md`, e o link não depende mais do painel do
Supabase. Sobrou o **remetente**, que é decisão de domínio. Continua valendo o aviso de que nada
disso aparece em homolog enquanto o atalho `?s=primeiro` pular o e-mail: quem quiser ver o de
verdade usa o "Enviar teste para mim" da tela de E-mails.

- [x] ~~**Colar a linha do `Invite user`** no painel~~ **RESOLVIDO por outro caminho em 31/jul**: o
      link vai no nosso e-mail, montado com o `hashed_token`. Era a única das três que quebrava o
      fluxo, e não quebra mais.
- [x] ~~**Corpo do e-mail #3 (boas-vindas + acesso)**~~ **ESCRITO em 31/jul**, na marca e passado
      pelo `COPY.md`, e agora **editável em `/admin/emails`** sem deploy. A spec do `FLUXO-v1.md`
      nunca chegou ao repo; se ela aparecer, é edição de texto no painel, não de código.
- [ ] 🔒 **Remetente definitivo, a única das três que sobrou.** Hoje é `onboarding@resend.dev`,
      remetente de **teste** do Resend, escolhido em 28/jul para destravar o homolog e agora usado
      também pelos nossos transacionais (`EMAIL_FROM` vazio cai nele). Depende da decisão de domínio do
      `AMBIENTES.md`: seguir no Resend com domínio verificado, ou passar para o SES, que já é o
      previsto para os outros doze e-mails. Enquanto for o de teste, o e-mail sai de um domínio
      que não é o da Abril, com o custo de entregabilidade e de confiança que isso tem numa
      compra de R$ 397. Se for SES, o warm-up com SPF/DKIM/DMARC precisa começar **antes**, não
      na véspera.
- [ ] **Links das redes sociais do rodapé** — hoje `href="#"`. _Insumo:_ URLs reais dos
      perfis.
- [ ] **`banned-words.md`** — o `docs/COPY.md` referencia esse arquivo, que nunca existiu.

## 🚫 Fora do homolog (decisão 2026-07-20)

Não entram no homolog; ficam para produção com o conteúdo real:
- **Termos de uso** e **Privacidade · LGPD** (páginas/URLs) — rodapé segue `href="#"`.
- **VSL do hero** — segue placeholder.
- **Vídeo real (Panda)** — homolog usa clipe de exemplo.
- **Materiais reais** (apostilas/planilhas) — homolog baixa PDF de exemplo.
- **Arte dos módulos** — homolog usa placeholder.

## 🔌 Backend (Fase 2)

- **Auth Supabase** (login real, sessão, guarda de rotas).
- **Webhook Guru** (provisionar acesso na compra).
- **E-mails** (boas-vindas, reset, resultado).
- Trocar as fontes de dados (progresso/curso/certificado) para o banco.

## ✅ Já resolvido

- [x] **Dados jurídicos do rodapé** — a razão social passou a ser **"Abril Comunicações
      S.A. · CNPJ 44.597.052/0001-62"**, porque a LP vai para um subdomínio da Abril
      (2026-07-22). Substitui "1971 Comunicações e Sistemas LTDA.", registrada em
      2026-07-20 e superada. DPO segue `dpo@qr.capital`.
- [x] **Copy do FAQ e do CTA final** — dado como **finalizado por ora** pelo Pedro
      (2026-07-25): o texto atual fica como está, sem nova varredura. Era a última etapa
      da revisão seção a seção (hero, docentes, currículo, Ferramentas e Oferta já tinham
      passado). Reabrir só se a rodada de copy pré-launch pedir; o H2 do CTA final e a
      pergunta de conta no exterior do FAQ são decisões travadas (`HANDOFF.md` §7).
- [x] **Nav do rodapé** — o da LP já saíra alinhado à topbar (Professores, Formação,
      Ferramentas, Idealizadores, FAQ) na etapa 9 do `port-lp`; faltava o **rodapé da
      área**, que ainda listava O Diagnóstico, Corpo Docente, A Formação e Quem Assina.
      Alinhado no `buildFooter()` do `port-area`, junto com a razão social superada e a
      troca de "chancela editorial" por "institucional" (2026-07-25).
- [x] **Recuperação de senha** — `/app/recuperar-senha`, `/auth/confirm` e
      `/app/redefinir-senha` construídos e **validados com e-mail real** (2026-07-28): o Pedro
      pediu a redefinição pela tela, recebeu na caixa dele, clicou e trocou a senha. O
      "Esqueci minha senha" do login deixou de dar 404. O mesmo handler serve o **primeiro
      acesso** com `type=invite`.
- [x] **SMTP do Supabase** — **Resend** configurado em 2026-07-28, remetente de teste
      `onboarding@resend.dev`, credencial de SMTP sendo a API key (usuário literal `resend`,
      host `smtp.resend.com`, porta 587). O template de Reset Password aponta para
      `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery`, e `localhost:3000` mais o
      domínio do Netlify estão na allowlist de Redirect URLs. Usar `{{ .RedirectTo }}` em vez
      de `{{ .SiteURL }}` faz o link seguir o ambiente que pediu o reset, então dá para testar
      local sem mexer no Site URL do projeto. Escolhido para destravar o homolog; o remetente
      definitivo depende da decisão do domínio de produção.
- [x] **`COPY.md` promovido para `docs/`** — a diretriz anti-slop saiu de
      `referencias/cowork/` (fora do git) e virou `docs/COPY.md`, versionado (2026-07-25).

- [x] **Progresso real** — marcar aula concluída (cookie); sidebar/%/home/"Continuar"/gate da prova reagem (2026-07-20).
- [x] **Certificado — Baixar PDF** (imprime o preview, fiel ao design) + **Compartilhar no LinkedIn** (add-to-profile oficial) + "Validar" → `/verificar` (2026-07-20).
- [x] **Página pública `/verificar/:codigo`** — válido/inválido, on-brand (2026-07-20).
- [x] **`og:image` da LP** — imagem 1200×630 branded + twitter card (2026-07-20).
- [x] **WhatsApp** — botão flutuante + link do rodapé plugados em
      `https://wa.me/message/W2USYZZK75FMC1` (2026-07-20).
- [x] **Performance de imagens** — PNG/JPG → WebP + lazy-load (6,3 MB → 1,3 MB).
- [x] **Hovers de botões/links** — restaurados via `HoverRuntime` (`style-hover`).
- [x] **Glow do card de preço** — efeito `.vs-hl` aplicado à Oferta.
- [x] **"Entrar" da topbar** → `/app/login` (área do aluno). Login já construído (2026-07-20).
- [x] **Rodapé reestruturado** — colunas Institucional/Políticas/Contato + DPO + copyright
      + voltar ao topo, inspirado no cca.blocktrends.com.br (2026-07-20).

---

_Como plugar cada pendência: os pontos da LP vivem em `app/_lp/body.html` (gerado pelo
porte). Trocas estáveis devem ir também em `scripts/port-lp.mjs` para sobreviver a
reexecuções — foi assim com WhatsApp, glow e otimização de imagem._

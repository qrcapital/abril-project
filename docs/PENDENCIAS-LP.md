# Pendências — LP + Área do Aluno

Checklist vivo do que falta antes do "pronto para produção" (V1/homolog). Atualizado
conforme os insumos chegam. Quando o Pedro perguntar "quais as pendências?", este é o
documento a puxar. (O admin é V2 — ver `PLANO-ADMIN.md`.)

_Última atualização: 2026-07-29, fim do dia. **Dia grande: a camada de feedback fechou inteira,
e a arquitetura de conteúdo e acesso mudou de lugar.** Saíram as tarefas **1, 2, 3b, 4, 5, 6, 7,
8, 9, 10, 11 (a metade que fazia sentido), 12, 14 e 15**, mais duas frentes que o Pedro abriu no
caminho: o **certificado sobrevivendo ao fim do acesso** e a **liberação gradual do curso** (um
módulo por semana, para o aluno não concluir e pedir reembolso dentro da janela de
arrependimento).

Três coisas saíram do lugar e vale saber antes de mexer: **o currículo agora vive no banco** (o
`lib/curso.ts` não guarda mais as aulas), **o progresso também** (era cookie, e o aluno o
editava), e **a guarda de acesso mora no layout do `(sala)`**, não no proxy.

A fila de amanhã está logo abaixo._

_**Atualização de 2026-07-30.** Saíram as duas tarefas de código que restavam: a **16** (rotina
da prova abandonada) e a **17** (diálogo de envio e grade de questões). As duas levas acharam um
furo cada uma, os dois no mesmo lugar conceitual: o porteiro do certificado aprovava prova sem
questão (`0 >= 70 * 0`), e o glifo branco da bolinha sobre o dourado falhava AA na grade._

_**Atualização de 2026-07-30, fim do dia. A 18 foi destravada e o admin começou.** Você tomou as
quatro decisões que faltavam, e a **casca, a guarda e o Painel** estão de pé — com números reais,
não mock, porque a tabela de fases do `PLANO-ADMIN` foi escrita antes do Supabase existir e
mandava usar mock por um motivo que já não vale. **A escalada de privilégio da `0003` criou um
problema de partida que nenhum documento tinha:** o banco tinha **zero admins**, e depois do
conserto só a service role concede o papel. Resolvido por `scripts/admin-conta.mjs`, que **tem
que ser rodado no `ei-prod`** ou o `/admin` de produção sobe inacessível (`AMBIENTES.md`, item 7).
Descoberto no caminho: **o `app/globals.css` que o `AGENTS.md` manda usar nunca existiu**, e o
admin é o primeiro lugar do projeto onde o Tailwind roda de fato._

_**Ainda em 30/jul: a tela de Equipe** (`/admin/equipe`, escopo novo que você pediu), com busca
por e-mail e concessão do papel de admin. Migration `0004` aplicada no homolog. **A armadilha desta
leva é a quarta repetição do mesmo padrão do projeto:** route handler **não passa por layout**,
então a guarda de admin não protege endpoint, e como a escrita sai pela service role o trigger
também não segura — a checagem em TypeScript é o único guarda dessa rota. Provado dos dois lados
(sem sessão e com sessão de aluno, os dois 404). Ver `HANDOFF.md` §6._

_**E o admin mestre**, que você pediu depois de testar dar e revogar: dois níveis, e admin comum faz
tudo menos mexer no acesso de um mestre. Migration `0005`, com a regra no trigger além da rota, e
`npm run check:mestre` provando as 7 asserções contra o banco. **Sua conta é a mestre.**_

_**Uma armadilha de operação que custou um bug relatado que não existia:** `npm run build` com o
`next dev` de pé **trava o dev server** — ele fica com a porta escutando e para de responder, então
a tela parece renderizada, o clique não faz nada e nenhuma requisição aparece no log. Parece
defeito de produto e não é. O diagnóstico de dez segundos está no `HANDOFF.md` §6._

> Legenda: 🟢 dá para fazer agora (sem insumo externo) · 🔒 bloqueado por insumo/decisão.

---

## ▶ PRÓXIMA SESSÃO (fila montada em 29/jul, para retomar em 30/jul)

Tudo o que estava na fila de 28/jul saiu, menos o que depende de você. O que resta:

### Código, na ordem sugerida

1. ~~**17 · Modal de envio e grade de questões da prova.**~~ **FEITO em 30/jul/2026**, faltando a
   conferida visual na tela real. O `window.confirm` saiu; entrou o padrão 5 do `DESIGN.md` §3
   (`confirmar()`, `<dialog>` nativo) com a grade de 20 chips, respondida contra em branco por
   preenchimento e não só por cor, clicáveis para ir direto à questão. A frase diz quantas
   ficaram em branco e que em branco conta como erro. Modelo e frase são puros
   (`resumoProva`/`fraseEmBranco`), com 11 casos novos no `check:prova`. O envio ganhou o botão
   em trabalho, que faltava. **Achado ao medir:** o glifo branco da bolinha sobre o dourado dá
   3,15:1 e falha AA; na grade virou `#0A2B1E` (4,84:1), e a bolinha da alternativa ficou como
   está, por ser design aprovado. **Conferido na tela real** em 30/jul, com tentativa de
   verdade (17 respondidas, 3 em branco): abre centralizado sobre a questão com o backdrop
   cobrindo o cabeçalho sticky, o clique na grade navega e o diálogo não sobra na tela seguinte,
   Esc devolve o foco ao botão que abriu, clique fora remove o nó do DOM, e o banco seguiu
   `in_progress` depois de tudo. **Não exercitado:** confirmar o envio (botão virando
   "Enviando..." e a tela de resultado), porque consome a tentativa única.
2. ~~**16 · Cron da prova abandonada.**~~ **CÓDIGO FEITO em 30/jul/2026, falta o deploy para
   verificar.** `lib/prova-expiradas.ts` (decisão pura + IO separados),
   `netlify/functions/prova-expiradas.mts` a cada 15 minutos, e `npm run prova:expiradas` para
   rodar à mão. Gatilho é função agendada do Netlify, **não** `pg_cron` — desvio registrado no
   `PRD.md` §15. Achado no caminho: `corrigir([], {})` aprovava (`0 >= 70 * 0`), e esse booleano
   é o porteiro do certificado; consertado na raiz em `lib/prova-correcao.ts`. **O que falta é
   só o que exige deploy:** confirmar que o agendador dispara e que a rotina fecha uma tentativa
   real. Nada disso é verificável local.
2b. ~~**18 · Definir acesso de admin.**~~ **DESTRAVADA por você em 30/jul/2026**, e a primeira
   fatia já construída: casca, guarda e Painel. As quatro decisões: **porta única** (`/app/login`
   com redirect por papel), **404** para não-admin logado, **sua conta** como primeiro admin,
   **dados reais em vez de mock**. As duas respostas da guarda foram medidas — anônimo recebe 307
   para o login, aluno logado recebe 404 — e a segunda fecha porque a primeira é 307. Detalhe no
   `PLANO-ADMIN.md` §2 e §8.

   **O que sobrou da 18 não trava nada:** 2FA/e-mail corporativo (endurecimento sobre a porta que
   já existe) e auditoria (as ações que precisam dela são todas da Fase 3, bloqueada em Guru +
   SES).

   **A próxima fatia é escolha sua:** Alunos e E-mails já têm dado real no banco; Questões só
   significa algo depois das ~100 questões reais (tarefa 13, sua).

3. **Tela de conteúdo do admin** (`PLANO-ADMIN.md` §4.6), que agora depende **só** das três
   decisões do §4.6, não mais da 18. A migração que
   ela exigia já está pronta: mudar título, descrição ou vídeo no banco já muda a tela sem
   deploy. Falta a tela.

### Suas, e a primeira trava construção nova

- 🔒 **18 · Acesso de admin**, as perguntas do `PLANO-ADMIN.md` §8. Continua sendo a
  única que impede começar o admin. Todas são sobre **acesso**, não sobre conteúdo.
  **Duas delas saíram em 30/jul:** "onde o papel vive" já estava respondido na prática
  (`profiles.is_admin`, com dez policies dependendo), e "como o papel é protegido" era um
  **furo aberto** — qualquer aluno se promovia a admin com uma chamada. Fechado pela
  migration `0003_guarda_admin.sql`; ver o incidente no `HANDOFF.md` §6 e
  `npm run check:rls`. O que resta são decisões de ergonomia e escopo, não de arquitetura.
- 🔒 **3 · Template `Invite user`** no painel: colar uma linha.
- 🔒 **20 · Política de senha** no painel: a nossa é 8 com classes, a plataforma garante 6 e
  nenhuma classe.
- 🔒 **13 · Quem escreve as ~100 questões.** Não bloqueia código, mas é o que falta para a prova
  deixar de rodar sobre as 24 de exemplo.
- 🔒 **Três decisões novas da tela de conteúdo** (§4.6): upload de arquivo ou URL colada;
  se dá para reordenar aulas (o `ord` define o número na URL); e o que acontece ao apagar aula
  com progresso gravado.
- 🔒 **URL do checkout do Guru** e os **materiais e vídeos reais**, que seguem pendentes.

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
- [ ] **Código do certificado é fixo para todo mundo** — `EI-2026-4817`, em `lib/certificado.ts`,
      com nome fixo junto. Dois alunos teriam o mesmo código de verificação, e o
      `/verificar/:codigo` valida contra esse único código. A emissão real (tabela
      `certificates`, código por aluno, função `verify_certificate`) pertence à migração para o
      banco, tarefa 15. Achado em 29/jul, ao construir a guarda do certificado.
- [ ] **Pixels de tracking** (`fbq`/`gtag`) — estrutura pronta; precisa dos IDs.
- [ ] **Migrar o curso para o banco** — hoje vive em `lib/curso.ts`, a tabela `lessons`
      está vazia e o progresso é cookie.

## 🔒 Bloqueado por insumo

- [ ] **Template de e-mail do convite (primeiro acesso)** — o `/auth/confirm` já aceita
      `type=invite`, e o webhook do Guru já gera esse link, mas o template **Invite user** no
      painel segue no padrão. Mesma edição do Reset Password, trocando o tipo:
      `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=invite`. Não urge, porque o primeiro
      acesso do homolog usa o atalho `?s=primeiro` até o Guru entrar.

### Antes de produção: o e-mail de boas-vindas (registrado em 29/jul, a pedido do Pedro)

O **link** do convite não é decisão, é a linha acima. Estas três são, e todas vencem no
lançamento, não antes. Elas se juntam porque quem for editar o template no painel resolve as
três de uma vez, e porque nenhuma delas aparece em homolog: o atalho `?s=primeiro` pula o
e-mail inteiro, então o furo só apareceria com o primeiro aluno real pagante.

- [ ] **Colar a linha do `Invite user`** no painel. Sem ela, o link do e-mail que o webhook do
      Guru dispara na compra aprovada não leva a lugar nenhum útil, e é o **primeiro contato do
      aluno que pagou**. É a única das três que quebra o fluxo se ficar para trás.
- [ ] **Corpo do e-mail #3 (boas-vindas + acesso)**, do `PRD.md` §14. A spec está no
      `FLUXO-v1.md`, documento referenciado que nunca foi trazido ao repo (pendência antiga).
      Sem ele, o aluno recebe o corpo padrão do Supabase: funciona, mas fora da marca, sem o
      template base (logo clara, fundo claro, CTA dourado) e sem passar pelo `COPY.md`.
- [ ] **Remetente definitivo.** Hoje é `onboarding@resend.dev`, remetente de **teste** do
      Resend, escolhido em 28/jul para destravar o homolog. Depende da decisão de domínio do
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

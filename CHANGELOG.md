# Changelog — Abril · Estratégia Internacional

Registro de todas as mudanças relevantes do projeto (Landing Page + Área de Membros).
Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Datas em `AAAA-MM-DD`. Enquanto não houver release em produção, tudo vive em **Não lançado**
e é validado no ambiente de **homolog** (branch `homolog`).

## Não lançado

### Corrigido
- **Signup não engole mais erro de banco, e não deixa conta pela metade** — 2026-07-29
  - `app/app/login/actions.ts` descartava o retorno do `upsert` em `profiles`. Foi esse silêncio
    que escondeu o **schema vazio do Supabase por meses** (`HANDOFF.md` §6): a conta era criada
    no auth, o perfil falhava, e a tela dizia que deu certo.
  - A correção não coube em uma linha, como estava estimado. Só capturar o erro deixaria a conta
    **pela metade**: usuário no auth, sem linha em `profiles`. E `verify_certificate()` faz
    `join profiles` (`0001_init.sql:198`), então o furo não apareceria no cadastro, e sim lá na
    frente, na verificação pública do certificado, que é a entrega final do curso.
  - Agora o erro é logado no padrão `[escopo]` do projeto, o usuário recém-criado é **desfeito**
    com `deleteUser`, e a tela recebe erro de verdade. O desfazer é o que faz o retry funcionar:
    sem ele, a segunda tentativa esbarra em "Este e-mail já tem conta. Faça login", a pessoa
    entra sem perfil, e o silêncio volta pelo outro lado.
  - `lint`, `check` e `build` passando.

### Adicionado
- **Resultado da prova: cor do desempenho por módulo virou informação, e duas falhas de AA
  antigas caíram** — 2026-07-28
  - Decisão do Pedro. O design pintava os quatro percentuais de verde na tela de aprovado,
    porque partia de números uniformemente bons (88, 82, 90, 80). Com nota real, um aprovado com
    40% num módulo via 40% em verde: a tela pintava a deficiência como sucesso.
  - Agora a cor é **calculada por valor**, com corte na própria nota de aprovação (70%). Sucesso
    em verde; módulo deficitário numa **pill âmbar**. Eu havia proposto resolver por intensidade
    de dourado, para não somar acento; o Pedro preferiu verde e amarelo, e é o que vale. Exceção
    registrada no `DESIGN.md` §2, com o motivo, para ninguém "corrigir" de volta.
  - **Por que pill e não texto amarelo:** amarelo vivo não passa AA como texto sobre branco, é
    física da cor. O `#e0a54e` do design dá 2,17:1 contra os 4,5 exigidos em 12px. Pondo o
    amarelo no fundo, onde não há essa exigência, a cor fica vibrante e o texto passa com folga
    (5,71:1). De quebra, etiqueta colorida chama mais atenção que número colorido.
  - **Bug meu, do mesmo dia, corrigido:** eu substituía o número e não a cor, então na tela de
    reprovado uma linha com 90% real herdava o vermelho que o design fixara no 42% de exemplo.
    A cor agora é calculada nas duas variantes; o vermelho da reprovação fica no veredito grande,
    não nas linhas de diagnóstico.
  - **Duas falhas de AA anteriores a esta mudança**, consertadas na mesma leva: o percentual em
    `#1F8A5B` dava 4,33:1 e falhava por pouco em 12px (foi para `#1B7A50`, 5,32:1), e a barra
    dourada `#A98E4E` dava 2,54:1 sobre o trilho `#EDE6DD`, abaixo dos 3,0 do WCAG 1.4.11 para
    objeto gráfico. Encerra o item do critique de 21/jul sobre cores fora de paleta nessas telas.
  - Medições todas em `docs/FEEDBACK-UX.md`; o `npm run check:prova` passou a assertar cor por
    valor nas duas variantes, e que nenhuma das cores reprovadas sobrou.
- **Regra de senha: 8 caracteres, com maiúscula, minúscula e número** — 2026-07-28
  - Decisão do Pedro. Antes era só o comprimento mínimo de 6, herdado do padrão do Supabase. O
    mínimo nasceu 6 nesta mesma sessão e subiu para 8 em seguida, também por decisão dele.
  - Um validador único em `lib/senha.ts` (`validarSenha`), usado nas **duas portas** que criam
    senha e nos **dois lados** de cada uma: primeiro acesso (`criarConta` no servidor e o
    `LoginClient` no navegador) e redefinição (a server action e o `RedefinirClient`). Antes a
    regra aparecia escrita por extenso em três lugares, com o risco de divergirem.
  - A mensagem de erro diz qual exigência faltou, em vez de repetir a lista inteira. E a regra
    aparece **antes** de o aluno tentar: na tela de redefinição pelo texto de apoio, e no
    primeiro acesso por uma linha inserida sob o campo de senha (só nesse modo; no login
    normal o aluno digita a senha que já tem).
  - `\p{Lu}`/`\p{Ll}` em vez de `[A-Z]`/`[a-z]`, para acento contar: "Ástrid1x" tem maiúscula
    de verdade e seria recusada por faixa ASCII sem o aluno entender o motivo.
  - Novo `npm run check:senha`, e `npm run check` roda os dois checks. Cobre o limite exato de
    8, cada classe faltando, senha só de símbolos, acento, a precedência do comprimento
    sobre as classes, e a senha de 6 caracteres que o Supabase aceitaria sozinho.
  - **A plataforma garante menos que a gente, e a distância aumentou.** Medido na API em 28/jul:
    o Supabase recusa `abc` ("at least 6 characters") mas **aceita** `abcdef`, `ABCDEF` e
    `123456`. Ou seja, ele garante o comprimento de 6 e nenhuma classe de caractere. Com o
    mínimo em 8, `Abc123` passa por ele e só é barrada pelo nosso `validarSenha`. Espelhar a
    regra em Authentication → Password Requirements segue pendente (`PENDENCIAS-LP.md`).
  - **Falta espelhar no painel do Supabase**: validação de aplicação é conveniência; a recusa
    que vale para quem chama a API por fora é a política do projeto em Authentication.
- **Recuperação de senha, e o caminho real do primeiro acesso junto** — 2026-07-28
  - `/app/recuperar-senha` pede o e-mail e dispara o link; `/auth/confirm` troca o
    `token_hash` por sessão em cookie; `/app/redefinir-senha` grava a senha nova e leva para
    `/app` já logado. O link "Esqueci minha senha" do login deixou de dar 404.
  - **`verifyOtp` com `token_hash`, não a troca de `code` do PKCE.** O `@supabase/ssr` fixa
    `flowType: "pkce"`, e o PKCE guarda um `code_verifier` no cookie do dispositivo que
    **pediu** o reset: quem pede no celular e abre o e-mail no desktop não conclui. O
    `token_hash` atravessa dispositivo. De brinde, o token morre no handler e nunca chega à
    URL da tela onde a senha é digitada, então não fica no histórico nem escapa por `Referer`.
  - **O mesmo handler serve o primeiro acesso**, com `type=invite`, que é o link que o webhook
    do Guru já gera (`generateLink({ type: "invite" })`). Quando o Guru entrar, a porta real
    do primeiro acesso já existe; o atalho `?s=primeiro` do homolog segue valendo até lá.
  - `ROUTES.md` atualizado: o token **não** passa mais pelas telas, então
    `/app/redefinir-senha/:token` e `/app/primeiro-acesso/:token` deixaram de existir como
    especificados. A nota de implementação lá explica o porquê e registra que, depois do
    `verifyOtp`, a sessão é completa e não apenas permissão de trocar senha.
  - Guarda de redirect aberto no `next`, e mensagem idêntica para hash inválido, link
    expirado e link já usado, para não virar oráculo de token válido. A confirmação de envio
    também é sempre a mesma, exista o e-mail ou não, inclusive sob rate limit do Supabase.
  - Visual: as duas telas reaproveitam o `login.html` portado, trocando só o miolo da coluna
    do formulário, então a coluna de marca e a moldura seguem idênticas ao login sem markup
    duplicado. O helper de fatiar div balanceada saiu do `home-template.ts` para
    `lib/html-slice.ts`, agora com três consumidores.
  - **Validado com e-mail real no mesmo dia.** O SMTP do Supabase passou a ser o **Resend**
    (remetente de teste `onboarding@resend.dev`, usuário literal `resend`, senha sendo a API
    key, `smtp.resend.com:587`), escolhido para destravar o homolog sem depender da decisão do
    domínio de produção. O Pedro pediu a redefinição pela tela, recebeu na caixa dele, clicou
    e trocou a senha; conferido no banco pelo `last_sign_in_at` e o `updated_at` da conta
    andando no mesmo minuto.
  - O template usa **`{{ .RedirectTo }}`**, não `{{ .SiteURL }}`, então o link segue o
    ambiente que pediu o reset: pedido no `localhost:3000` chega apontando para o localhost, e
    dá para testar local sem trocar o Site URL do projeto. Por isso o `resetPasswordForEmail`
    passa `redirectTo` **sem** query string, e o template monta
    `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery`. É seguro porque o Supabase
    valida o `redirectTo` contra a allowlist de Redirect URLs, onde entraram o localhost e o
    domínio do Netlify.
  - Segue pendente, sem urgência, o template **Invite user** para o primeiro acesso: o handler
    já aceita `type=invite`, mas o e-mail do convite ainda usa o padrão do painel.
- **Prova final: motor funcional (sem o banco de questões real)** — 2026-07-28
  - A prova deixou de ser fachada de cliente e passou a ter estado no banco. `lib/prova.ts`
    abre a tentativa (sorteio balanceado por `sortear_prova()`, snapshot das 20 com
    gabarito, `deadline` = início + 120 min), grava resposta a resposta, e corrige com a
    aprovação em 14 de 20. Tudo com service role, porque `exams` só tem policy de SELECT do
    dono e o `sortear_prova()` não é exposto ao cliente.
  - **O cronômetro saiu do `sessionStorage` para o `exams.deadline`.** Antes o tempo vivia na
    aba: fechar o navegador ou abrir em outro devolvia 120 minutos limpos. Agora a reentrada
    não reinicia, que é o que o `PRD.md` §7 exige.
  - `lib/prova-correcao.ts` guarda a regra de nota sem nenhum IO, e é o que o
    `npm run check:prova` exercita. A aprovação compara inteiros (`acertos * 100 >=
    70 * total`) em vez do score arredondado, para que um total diferente de 20 não promova
    69,5% a 70.
  - Server actions em `app/app/(sala)/prova/actions.ts` resolvem o aluno pela **sessão**,
    nunca por id vindo do cliente: com service role, aceitar id do navegador entregaria a
    prova de um aluno a outro. O gate de 16/16 passou a ser checado no servidor também.
  - `lib/prova-template.ts` injeta enunciado, alternativas, contadores, cronômetro e o
    desempenho por módulo nas telas portadas, escapando o que vem do banco. Se um porte
    futuro mudar o markup, estoura em vez de servir o placeholder do design como se fosse
    conteúdo real.
  - Saíram os atalhos "Simular aprovação/reprovação" da tela de questão e o `?r=reprovado`
    do resultado: a variante agora vem da correção.
  - **Ainda falta o conteúdo**: as ~100 questões (25 por módulo) continuam a escrever. O
    motor roda sobre as 24 `[EXEMPLO]` do seed.
  - Novo: `npm run check:prova`. Cobre a regra de nota e as âncoras de HTML.
- **Pacote de continuidade para transferir o desenvolvimento de máquina** — 2026-07-25
  - **`docs/HANDOFF.md`**: documento de continuidade do projeto, escrito para migrar o
    trabalho da máquina Windows para um MacBook. Reúne o que os outros documentos não
    tinham: o estado real do repositório, o que viaja no git e o que precisa ser
    transferido na mão (segredos, insumos brutos de `referencias/cowork/`, memória do
    Claude Code), o setup passo a passo no macOS, as armadilhas que já custaram tempo
    (o porte que sobrescreve edição manual, o cache do dev server, a medição de animação
    em aba oculta) e as decisões já fechadas que não devem voltar à mesa.
  - **`docs/memoria-claude/`**: cópia de transporte das seis memórias do Claude Code
    referentes a este projeto, que viviam apenas no perfil da máquina de origem e não
    acompanham um `git clone`. O `README.md` da pasta traz o procedimento de reinstalação
    e o índice `MEMORY.md` pronto para colar.
  - **`docs/COPY.md`**: a diretriz anti-slop de escrita saiu de `referencias/cowork/`,
    que está fora do git, e passou a ser versionada. Ela é obrigatória em qualquer copy
    do projeto, então não podia depender de transferência manual. Fecha uma pendência
    apontada no PRD.
  - **`docs/PENDENCIAS-LP.md` ressincronizado**: estava parado em 2026-07-20 e ainda
    registrava a razão social antiga do rodapé ("1971 Comunicações e Sistemas LTDA.",
    superada por "Abril Comunicações S.A."). Ganhou também os itens abertos que só
    existiam na conversa: copy do FAQ e do CTA final, recuperação de senha, nav do
    rodapé, migração do curso para o banco e os dois itens bloqueados por insumo.

### Alterado
- **Pendência nova: definir o acesso de admin** — 2026-07-25
  - Registrada em `PENDENCIAS-LP.md` e detalhada no `PLANO-ADMIN.md` §8: o mecanismo
    (proxy + `is_admin()`) já está na planta, mas falta a operação — bootstrap do
    primeiro admin, onde o papel vive, porta de entrada (mesma `/app/login` ou tela
    própria) e o que o não-admin vê. Decisão de spec antes da Fase 1 do admin.
- **Copy do FAQ e do CTA final: finalizado por ora** — 2026-07-25
  - Decisão do Pedro: o texto atual das duas seções fica como está, sem a varredura que
    era a última etapa da revisão seção a seção. `PENDENCIAS-LP.md` e `HANDOFF.md`
    atualizados; reabrir só se a rodada de copy pré-launch pedir.
- **LP · Mobile: wordmark da topbar alinhado e Entrar no hambúrguer** — 2026-07-25
  - **Wordmark torto no mobile** (feedback do Pedro): três somas pequenas. O letter-spacing
    põe espaço também depois da última letra, então a hairline direita passava ~3px do "A"
    e o INTERNACIONAL ficava ~1,5px fora do centro; e o override mobile do bundle trocava as
    proporções do lockup (tracking .16em/.34em) em vez de escalar a aplicação padrão.
    Correção (etapa **7t**): margem negativa igual ao tracking compensa o espaço final (em
    todos os tamanhos) e o mobile volta às proporções do `DESIGN.md` (.26em/.44em) em fonte
    menor (16px/6.5px em ≤430, 14.5px/6px em ≤380). Medido após o ajuste: hairline
    terminando na borda visual do "A" e palavra a 0,6px do centro.
  - **Entrar no hambúrguer**: o botão ENTRAR da topbar some no mobile (regra do bundle) e o
    acesso à área do aluno ficava sem porta. O menu ganhou um **ENTRAR** dourado ao fim,
    separado das âncoras por hairline (etapa 7n); `display:none` no desktop, onde o botão
    próprio continua.
- **LP · Mobile: bolinhas de posição nos carrosseis** — 2026-07-25
  - Os dois sliders da LP (docentes e Quem Assina) ganharam indicadores de posição
    abaixo da faixa, prática de mercado para o usuário saber que o bloco desliza. Markup
    estático no porte (etapa **7s**, sem layout shift no SSG): dots dourados seguindo o
    fundo da seção (gold-lit no verde, gold no claro), só em ≤760px. O comportamento
    (bolinha ativa acompanha o card mais centrado; toque na bolinha rola até o card,
    respeitando `prefers-reduced-motion`) vive em `app/_lp/CarrosselDots.tsx`, que
    emparelha cada `.carr-dots` com o slider anterior. Sem JS, os dots ficam estáticos e
    o slider segue funcionando: é reforço de affordance, não mecanismo.
  - **Cor revisada após o Pedro ver no ar**: no verde dos docentes, a inativa em dourado
    translúcido sumia. As inativas passaram a **off-white a 38%** (regra do `DESIGN.md`:
    secundário sobre verde usa off-white/muted) e a **ativa segue dourada**, via CSS var
    `--dot-on` que separa as duas cores por carrossel. No Quem Assina (fundo claro) tudo
    dourado como estava, só com a inativa em 38% (era 28%, ajuste global).
  - Verificação: markup, CSS e pareamento conferidos em viewport de 390px; a lógica do
    dot ativo validada com evento sintético (aba de automação roda oculta e congela
    scroll/rAF, a armadilha do HANDOFF §6). Comportamento ao vivo: validar no celular.
- **LP · Mobile: Ferramentas e Quem Assina** — 2026-07-25
  - **Ferramentas**: no mobile o mockup de dispositivos entra **entre o lead e os bullets**
    (título e lead apresentam a seção, a imagem mostra, a lista detalha). Sem mexer no
    markup: o wrapper de texto vira `display:contents` na media query e a lista ganha
    `order:1`, então o palco entra na posição pela ordem do documento (etapa 7i).
  - **Quem Assina**: o selo Meridiano de 180px **sai no mobile** (`.qa-selo`) e os 2 cards
    viram **carrossel com snap a 88%**, mesma receita dos docentes. Restaura o comportamento
    que o `DESIGN.md` §5 já previa ("chancela 88%") e que se perdeu quando a etapa 7k trocou
    a seção do bundle (`.chancela-grid`) pelos cards novos (`.qa-grid`): a regra antiga ficou
    órfã no CSS, sem markup. As 5 regras mortas do carrossel antigo foram removidas na 7k.
  - **Hero**: a resposta do globo ao mouse agora só liga com ponteiro fino
    (`pointer: fine` no `HeroPointer`). No toque, o arrastar do scroll dispara `pointermove`
    e o globo girava aos trancos junto com a rolagem.
  - Verificado em viewport real de 390px (iframe de teste): ordem título → imagem → bullets,
    selo oculto, slider com snap funcionando nos 2 cards; desktop a 1440px inalterado.
  - O globo do hero **fica como está no mobile** (decisão do Pedro em 25/jul, avaliada com
    mock das alternativas): a composição atual, com as rotas emoldurando o texto, funcionou.
- **LP · Globo do hero reescrito em canvas 2D, mais detalhe e vida** — 2026-07-24
  - **Migração DOM → canvas** (`app/_lp/GloboCanvas.tsx`). A versão anterior punha um
    elemento por ponto dentro de um `preserve-3d`; ao adensar o mapa e somar cidades e
    rotas (3.697 elementos) a página travava, porque o navegador reordena todos os filhos
    por profundidade a cada quadro. Em canvas o custo é proporcional ao que se pinta: o
    `body.html` caiu de 180 KB para 69 KB, os nós da página de ~2.000 para ~600, e sobra
    folga para os efeitos abaixo. O globo virou **um** `<canvas>`; os dados de geometria
    são gerados no porte (`app/_lp/globo-dados.ts`).
  - **Mapa muito mais detalhado**: litoral do Natural Earth (`ne_50m_land`, domínio
    público) decimado a ~0,6°, de 1.389 vértices e ~142 ilhas para **5.155 pontos em 297
    anéis** — Golfo do México, Caribe, Mediterrâneo e ilhas médias que antes sumiam.
  - **Massa de terra realçada**: 2.884 pontos de interior (distribuição Fibonacci +
    point-in-polygon), bem apagados por baixo do litoral, para o continente "acender"
    sobre o oceano escuro sem virar preenchimento sólido (que destoaria do globo
    pontilhado e esbarraria no recorte de polígono no limbo).
  - **Praças em anel sonar**: o halo difuso virou núcleo nítido + anéis que expandem
    sumindo, cada praça com ciclo próprio. Cada uma leva sigla IATA de cidade + país
    (LON GB, NYC US…), que somem antes do limbo. Destaca por movimento, não por brilho.
  - **Rotas com corcova de luz**: um relevo estreito percorre cada rota, erguendo-se um
    tico da superfície e brilhando — "rebarba passeando", não um ponto viajando. As rotas
    passaram a **nascer no Brasil** (o cerne do curso): São Paulo irradia para Nova York,
    Miami, Londres e Madri, e Fortaleza faz a ponte com Londres; a malha global ao redor
    só contextualiza.
  - **Globo segue o mouse**: o cursor gira (±26°) e inclina (±12°) a esfera, com lerp
    suave e retorno ao centro. Substituiu o parallax de translação das camadas, que
    perdeu sentido quando as **estrelas foram removidas** (eram a camada que dava a
    profundidade).
  - **Correção de recorte**: o teste de visibilidade passou de `pz > 0` para `pz > RG²/PERSP`
    (o horizonte aparente da perspectiva, não o equador geométrico). Antes, uma faixa da
    casca traseira era desenhada sobre a frente e piscava na borda em vez de contornar a
    curvatura; os pontos que surgem no limbo entram com raio crescente (respiro), não com
    tamanho cheio.
  - O loop **para fora da viewport** (`IntersectionObserver`) e `prefers-reduced-motion`
    desenha um quadro estático. Geradores de dados (parser de shapefile, stipple de terra)
    ficaram no scratchpad; os dados-fonte estáticos entraram em `scripts/globo-*.txt`.
- **LP · Revisão de copy (Ferramentas e Oferta) e revisão geral da página** — 2026-07-24
  - **Ferramentas**: H2 passou a "O que fica com você depois da última aula" (o anterior,
    "Você sai com mais do que aulas. Sai com ferramentas.", repetia o kicker e usava a
    fórmula "não é X, é Y"). Linha de apoio reescrita sem antítese e sem prender por prazo.
    Apostilas viraram "Apostilas dos 4 módulos", com a descrição falando do que se faz com
    elas. E-book e calculadora mantidos por decisão do Pedro (o e-book ainda é placeholder).
  - **Oferta**: H2 "Um pagamento, um ano para aplicar" ancora a inscrição no **tempo**;
    o subtítulo do bundle **saiu** (parafraseava o H2 e afirmava "sem turma", o que é falso:
    o curso tem turmas). Parcelamento corrigido para "10x de R$ 39,70 sem juros". A régua ao
    lado do rótulo "Você recebe" saiu (sangrava até a borda sem separar nada). Lista refeita
    em 6 itens, com "materiais complementares" (vago) trocado pelas ferramentas de apoio.
  - **CTA final**: botão passou de "QUERO ME INSCREVER" para **"DOLARIZE COMO OS GRANDES"**,
    o mesmo comando do hero. A página tinha três textos de CTA diferentes; agora tem dois,
    com "GARANTIR MINHA VAGA" reservado ao botão que leva ao checkout.
  - **Módulo IV**: tema aberto de "Criptoativos" para **"Ativos Digitais"** (card do docente,
    título no currículo e bio do Ywata). A aula 15 virou "ETFs e análise on-chain" e sua
    descrição passou a caber ETFs temáticos de qualquer setor, sem nomear nenhum.
  - **Coerência entre seções** (revisão geral): rodapé passou a dizer "chancela
    **institucional**" (contradizia a decisão de 23/jul); copyright voltou ao separador
    "·" da página; card do Módulo III passou a "Mercado Americano" (anunciava "ETFs, REITs
    & BDRs" enquanto o currículo chamava de outra coisa); resumo do currículo passou a
    espelhar a seção Ferramentas; grafia unificada em "e-book"; nav do rodapé espelha a
    topbar e ganhou link para Ferramentas; os três links duplicados na faixa preta de base
    foram cortados; prazo de acesso unificado em "1 ano".
  - **Bio do Ywata corrigida**: "vice-presidente de riscos da Caixa e secretário especial de
    Produtividade no Ministério da Economia" (o texto dizia só "secretário da Economia").
    Conferido em Agência Brasil e gov.br: SEPEC, nomeação em julho de 2022.

### Corrigido
- **Segurança: o aluno leria o gabarito da própria prova em `exams.questions_snapshot`** — 2026-07-28
  - O snapshot guarda a `correta` das 20 questões, por desenho (`PRD.md` §7: corrigir e
    auditar contra o que o aluno viu). A policy `exams_self_select` libera a própria linha,
    então um `GET /rest/v1/exams?select=questions_snapshot` com a chave anon devolveria o
    gabarito. RLS é por linha e não alcança coluna.
  - Fechado com privilégio de coluna. **E o jeito óbvio não funciona**: `revoke select
    (questions_snapshot) ...` sozinho não surte efeito, porque o Supabase concede SELECT no
    nível da tabela e um grant de tabela cobre todas as colunas. Foi preciso revogar a
    tabela e reconceder a lista sem o snapshot. Verificado: `authenticated` e `anon` em
    false, `service_role` em true.
  - Efeito colateral a lembrar: coluna nova em `exams` não fica legível para o aluno até
    entrar naquela lista de grant.
  - Era vazamento latente, não explorado: não existia nenhuma linha em `exams` até agora.
    Foi corrigido antes de o motor gravar o primeiro snapshot.
- **Segurança: `sortear_prova()` estava chamável pela chave anon** — 2026-07-28
  - O `revoke execute ... from anon, authenticated` da migration **não fechava a função**. O
    Postgres concede `EXECUTE` a **PUBLIC** por padrão ao criar função, e os dois papéis
    herdam desse grant, então remover as entradas nomeadas não altera o resultado. No ACL
    aparece como `=X/postgres`, sem role à esquerda.
  - Efeito: pela chave anon, via `POST /rest/v1/rpc/sortear_prova`, dava para **enumerar o
    banco de questões**, 5 por módulo a cada chamada, repetindo à vontade. A resposta
    `correta` não vazava, porque a função não a seleciona, mas enunciados e alternativas sim.
    Inofensivo hoje, com 24 questões `[EXEMPLO]`; comprometeria a integridade da prova assim
    que o banco real entrasse. Contraria o `AGENTS.md`, que define o sorteio como server-side.
  - Corrigido com `revoke execute on function sortear_prova() from public`, aplicado no
    homolog e **na migration**, para o `ei-prod` não herdar o mesmo buraco. Verificado:
    `anon` false, `authenticated` false, `service_role` true, e a chamada anon devolve `42501`.
  - Lição de método registrada no `HANDOFF.md` §6: conferir privilégio de função com
    `has_function_privilege('anon', oid, 'EXECUTE')`. A consulta em
    `information_schema.role_routine_grants` filtrada por nome de role **não** revela a
    herança de PUBLIC, e foi ela que deu o falso "seguro" na primeira verificação.
- **Schema do Supabase homolog aplicado, com backfill de `profiles`** — 2026-07-28
  - Migration e seed aplicados por `psql`. Verificado: 10 tabelas, todas com RLS ligada e 12
    policies; as 5 funções; 5 módulos, 17 aulas (16 no gate) e 24 questões; `sortear_prova()`
    devolvendo 20 questões em 5 por módulo. O PostgREST voltou a enxergar o schema sozinho.
  - **Backfill**: havia 8 contas em `auth.users` e zero linhas em `profiles`, porque o trigger
    só dispara em criação nova e todas as contas antecedem o schema. Preenchidas com a mesma
    lógica do `handle_new_user`. Nenhuma é admin, o que confirma na prática a pendência do
    acesso de admin.
  - Nota de qualidade do sorteio: dois sorteios seguidos repetiram 19 das 20 questões, que é o
    esperado com 6 questões por módulo (sortear 5 de 6 duas vezes). Não é defeito do motor, é
    o tamanho do banco de exemplo, e é exatamente o argumento psicométrico do `PRD.md` §7.
    Com os ~25 por módulo da meta, a sobreposição esperada cai para cerca de 4 em 20.
- **Schema do Supabase homolog nunca foi aplicado (diagnóstico)** — 2026-07-28
  - Conferido com a service role, que ignora RLS: `public` tem **zero tabelas e zero
    funções** no projeto homolog. Toda leitura devolve `PGRST205` e toda RPC devolve
    `PGRST202`. A migration `0001_init.sql` nunca rodou; o item 5 do checklist de
    provisionamento do `AMBIENTES.md` era o único que nenhum documento registrava como
    concluído.
  - Passou meses invisível porque a área do aluno não lê nada de `public`: currículo
    estático em `lib/curso.ts`, progresso em cookie, certificado gerado no cliente e Auth
    no schema `auth`, que funciona. O único toque em `public` é o `upsert` em `profiles`
    do `app/app/login/actions.ts`, cujo retorno é descartado, então a falha era engolida.
  - Reinterpreta a nota do `HANDOFF.md` §6 que atribuía a ausência do profile a uma INSERT
    policy faltando no trigger `handle_new_user`: sem migration não há trigger nem tabela.
    Mesmo sintoma, causa diferente. O signup usar a service role segue correto, por
    espelhar o webhook do Guru, mas não pela razão registrada antes.
  - Bloqueia a prova funcional, que depende de `questions`, `exams` e `sortear_prova()`.
    Registrado como item 2 do `HANDOFF.md` §2 e como armadilha na §6.
- **`supabase/seed.sql` alinhado ao `lib/curso.ts`** — 2026-07-28
  - O seed ficou na versão de 20/jul e teria levado o conteúdo velho para o banco na hora
    de aplicar a migration. Corrigidos: o módulo IV (**"Criptoativos em Dólar"** →
    "Ativos Digitais em Dólar"), a aula 15 ("ETFs de cripto e análise on-chain" → "ETFs e
    análise on-chain"), os títulos longos do módulo III ("ETFs: a forma mais barata de
    investir nos EUA", "REITs: o imóvel americano na carteira", "BDRs: comprando EUA pela
    bolsa brasileira" → **ETFs**, **REITs**, **BDRs**) e as **17 descrições**, que eram as
    linhas curtas anteriores à revisão de 23/jul.
  - Completa a correção de 25/jul abaixo, que alinhou o `lib/curso.ts` e não pegou o seed.
    A duplicação entre o SQL e o TS ficou marcada com comentário no topo do arquivo e morre
    quando o curso migrar para o banco.
- **Área do aluno · Nomes de módulo alinhados à LP e ao PRD** — 2026-07-25
  - O currículo da área (`lib/curso.ts`) ainda chamava o módulo IV de **"Criptoativos em
    Dólar"** e a aula 15 de "ETFs de cripto e análise on-chain", nomes que a LP abandonou em
    24/jul (etapa 7r do porte) quando o módulo abriu para além de cripto. Passaram a
    **"Ativos Digitais em Dólar"** e **"ETFs e análise on-chain"**, com a descrição da aula
    15 falando em ETF de ativos digitais **ou** de um setor da economia global, sem nomear
    setor, como no currículo da LP. As quatro aulas do módulo continuam sendo de cripto (ver
    a nota do `PRD.md` §2).
  - Os módulos II e III tinham título encurtado ("Renda Fixa e Ações", "Acesso ao Mercado
    Americano") em relação ao PRD e ao próprio design da área, que já traz "Renda Fixa e
    Ações nos EUA" e "Como Acessar o Mercado Americano" nos cards da vitrine. Alinhados.
  - As telas geradas por `port-area.mjs` traziam o nome antigo em quatro pontos, e o
    desempenho por módulo da tela de resultado ainda é estático, então ele aparecia para o
    aluno. **Etapa 3b** nova no porte renomeia no `body`, valendo para todas as telas de uma
    vez; `home.html` e `aula.html` são regerados em runtime a partir de `lib/curso.ts` e já
    seguiam o nome novo por tabela.
- **Área do aluno · Chancela, razão social e nav do rodapé** — 2026-07-25
  - O card da Prova Final na home anunciava **"Certificação VEJA Negócios"**, formulação
    proibida no `PRD.md` §8: a VEJA é marca editorial cossignatária, não entidade
    certificadora, e quem emite é a BlockTrends. O card passou a anunciar o que o aluno
    recebe, **"Certificado de 30 horas"**; o selo do próprio card já traz as duas marcas.
  - **"Chancela editorial"** virou "institucional" no rodapé da área e no `alt` do selo das
    telas de prova e resultado, acompanhando a separação de papéis feita em 23/jul na LP.
  - O rodapé da área ainda trazia a razão social **"1971 Comunicações e Sistemas LTDA."**,
    superada em 22/jul por **Abril Comunicações S.A. · CNPJ 44.597.052/0001-62**, e a coluna
    Institucional com os nomes antigos das seções (O Diagnóstico, Corpo Docente, A Formação,
    Quem Assina). Agora espelha a nav da LP: Professores, Formação, Ferramentas,
    Idealizadores, FAQ. Com isso fecha o item "nav do rodapé" de `PENDENCIAS-LP.md`, que
    valia para a área (o rodapé da LP já tinha sido alinhado na etapa 9 do `port-lp`).
  - Tudo em **etapa 3c** do `port-area.mjs` e no `buildFooter()`, para sobreviver ao próximo
    porte.
  - Fecha também o item **"Nomenclatura da certificação"** do `BACKLOG.md`, que previa esse
    ajuste para a rodada de copy antes do launch. O termo do card fica como está por ora e
    volta à mesa nessa rodada, junto com os nomes que assinam o certificado; o racional está
    no `PRD.md` §8.
- **LP · Chancela "editorial" e headline antiga nos metadados** — 2026-07-25
  - A `description` da LP ainda dizia "Chancela **editorial** da VEJA Negócios", termo
    substituído por "institucional" em 23/jul em toda a página (a VEJA assina a instituição,
    a BlockTrends a técnica). O `og:description` seguia com a headline antiga ("Sua liberdade
    financeira começa pela geografia"), aposentada quando o hero virou "Seu patrimônio não
    devia depender de um só país", que é o que o link agora mostra ao ser compartilhado.
- **`HANDOFF.md` · Nota de aprovação da prova** — 2026-07-25
  - A lista do que falta descrevia a prova com "gate de 16/16 acertos". A aprovação é de
    **70%, ou seja 14 dos 20 acertos** (`PRD.md` §7); 16/16 é o gate de **aulas** concluídas
    que libera a prova. Corrigido para não induzir a implementação ao erro.
- **LP · Cards de docente: chip de módulo em uma linha, bio equalizada e divisória alinhada** — 2026-07-24
  - O chip "Módulo III · Mercado Americano" pedia 241px e o card só oferece 236px úteis
    (280 menos 22px de padding de cada lado), então quebrava em duas linhas. Virou
    **"Mercado dos EUA"** (220px) e os quatro chips ganharam `white-space:nowrap` via
    `.chip-modulo`. No mobile o card cai para 78% da faixa (~193px úteis), onde o nowrap
    faria o texto vazar para fora do card (que tem `overflow:visible` por causa do balão
    das logos): media query reduz para `font-size:8.5px` / `letter-spacing:.12em`, e os
    quatro passam a medir 184, 184, 178 e 162px.
  - **Bio do Ywata** tinha 221 caracteres contra 136, 148 e 136 das outras, o que abria uma
    quarta linha só nesse card. Reduzida para 152, mantendo os dois cargos conferidos.
  - **Divisória acima das logos** subia e descia de card para card: a faixa fica ancorada na
    base (`margin-top:auto`) e sua altura seguia a maior logo de cada card (20, 22, 27 e
    23px), então no card do Roxo a linha nascia 7px mais alta. `min-height:28px` na faixa
    fecha os quatro em 44px. Com a bio menor, os cards caíram de 623px para 588px.
- **LP · Ritmo vertical entre seções** — 2026-07-24
  - O respiro passou a depender de **haver ou não virada de fundo**: **200px** quando o
    fundo muda (claro ↔ verde, onde a faixa colorida sustenta o espaço maior) e **128px**
    quando não muda. Antes, as duas transições entre seções **claras consecutivas** caíam
    para pouco mais de 100px porque nenhuma das duas contribuía com padding de baixo:
    Ferramentas → Quem assina (104px) e FAQ → CTA final (114px). As duas foram para 200px
    e depois ajustadas para **128px** (`padding-bottom:24px` na de cima + 104 na de baixo),
    que é onde as seções voltam a se ler como um bloco só e o fechamento para de boiar no
    fim da página. O último `<details>` do FAQ teve a margem de 10px zerada para não vazar
    da seção (etapa 7q).
  - Medido no browser via `getBoundingClientRect` a cada passo. Duas exceções ficam de pé:
    hero → tese segue em 259px porque a ficha técnica flutua sobre a virada
    (`margin-top:-44px`), e currículo → Ferramentas tem o divisor decorativo do olho no
    meio (96px de margem + 102px de ornamento + 104px da seção).

### Adicionado
- **LP · Corpo docente: logos das casas + balão no hover** — 2026-07-23
  - No rodapé de cada card, as **logos reais** das empresas onde o professor atuou
    (XP, Oyster, GAP Asset; Banco Central, UBS, Nomura; Bradesco, Safra, ZenEconomics;
    Caixa, QR Asset, IPEA), no lugar das pílulas de texto. Tratamento **mono off-white**
    uniforme com os fundos removidos de verdade: XP virou a caixa off-white com o "XP"
    vazado (a marca real), Bradesco limpo do xadrez assado no JPG, IPEA invertido de
    branco-sobre-teal. Alturas calibradas por proporção (wordmarks largos menores,
    marcas empilhadas maiores). Logos processadas com `sharp` (recolor por luminância,
    key de fundo), assets finais em `public/lp/dl-*.png`; montagem no `port-lp.mjs` (7h).
  - **Balão flutuante** com o nome da empresa ao passar o mouse em cada logo (CSS puro,
    funciona com o body injetado; desativado no touch). O card ganhou `overflow:visible`
    para o balão não ser cortado, com os cantos do topo arredondados na foto.
- **LP · Hero: fundo com globo 3D girando + parallax no hover** — 2026-07-23
  - Fundo do hero ganhou um **globo 3D em CSS puro** (sem JS de animação, sem libs):
    ~1.400 pontos de litoral do Natural Earth (`ne_50m_land`, domínio público) projetados
    na superfície de uma esfera que gira no eixo Y, então o **mundo inteiro passa** (não só
    um hemisfério). Tilt (−20°) e fase (45°) calibrados para destacar **América do Norte e
    Europa** (polos do curso) no primeiro quadro. Pontos pré-computados em
    `scripts/globo-costa.txt`. Somam-se um campo de **estrelas de 4 pontas** piscando fora
    do globo e a trama de pontos rebaixada a grão de fundo.
  - **Parallax de camadas no hover:** estrelas, trama e globo deslizam em intensidades
    diferentes seguindo o cursor (profundidade). O `HoverRuntime` (client component) põe um
    listener no `window` que re-busca o hero e seta `--mx/--my`; o CSS faz o resto.
  - Tudo composited (só `transform`/`opacity`), `contain:layout style` no globo para isolar
    ~1.400 filhos do layout, e **`prefers-reduced-motion`** desliga giro, piscar e parallax.
    Exceção de motion registrada no `DESIGN.md`.
- **LP · Nova seção "Ferramentas" (entregáveis)** — 2026-07-21
  - Seção nova após "A Formação": à esquerda, os entregáveis (apostilas, e-book,
    calculadora) numa lista editorial com ornamento (estrela dourada) e réguas
    internas; à direita, um mockup de dispositivos (monitor com a área do aluno,
    laptop com a calculadora, tablet/celular com e-book e apostila), a partir da
    imagem final fornecida (PNG com fundo transparente).
- **LP · "Quem assina" refeita como 2 cards** — 2026-07-21
  - Cards paralelos: BlockTrends (**chancela técnica** — conteúdo e método) e VEJA
    Negócios (**chancela institucional** — credibilidade, com as marcas do Grupo
    Abril). Fim do termo "editorial". Selo circular re-gravado (`public/lp/selo-veja.svg`).
    Termo da chancela da VEJA e logos de VEJA/Super Interessante pendentes — ver
    `docs/BACKLOG.md`.

### Alterado
- **LP · Hero: copy refocado em dolarização + risco Brasil** — 2026-07-23
  - Headline **"Seu patrimônio não devia depender de um só país"** (risco Brasil sem
    citar eleição). Subtítulo imprime o peso dos 4 especialistas ancorando no produto:
    **"Aprenda o método de dolarização de quem operou por dentro do Banco Central, da XP,
    da Caixa e do Bradesco."** CTA trocado para **"DOLARIZE COMO OS GRANDES"**. A tira de
    especialistas foi removida (o peso migrou para o subtítulo). `port-lp.mjs` (7m).
- **LP · Topbar renomeada** — 2026-07-23
  - Nav: **Professores · Formação · Ferramentas · Idealizadores · FAQ**; botões **ENTRAR**
    e **INSCREVA-SE** em caixa alta. `port-lp.mjs` (7n).
- **LP · Corpo docente: cargo do Ywata** — 2026-07-23
  - "PhD Northwestern · CRO QR Asset" → **"Ex-VP Caixa · CRO QR Asset"** (o cargo executivo
    na Caixa no lugar da credencial acadêmica, junto do CRO QR Asset).
- **LP · Currículo: descrições completas das 16 aulas** — 2026-07-23
  - Cada aula ganhou um **parágrafo** explicando os assuntos abordados, elaborado em cima
    dos tópicos que já existiam (T-Bills/Notes/Bonds/TIPS/FRNs, FFO/P-FFO, investment grade
    vs. high yield, RWAs, ETFs spot, on-chain etc.), no lugar da linha curta. Guia anti-slop
    do `COPY.md` (sem travessão, sem regra de três, voz ativa, frases de tamanho variado).
    `line-height:1.55` nas descrições. `port-lp.mjs` (7h-bis), com guard que confere as 16.
- **LP · Cards "Quem assina": copy reescrito + logos reais** — 2026-07-23
  - **Card VEJA:** kicker **"A credibilidade de"** + logo VEJA Negócios (a frase completa na
    lockup); parágrafo novo com foco em confiança/autoridade ("publicação de economia da
    VEJA... um grupo que o Brasil lê desde 1950"); rodapé **"As marcas que informam o
    Brasil"** com as 3 marcas reais em sequência — **Grupo Abril** (verde), **VEJA**,
    **Super Interessante** — nas cores originais. Fecha a pendência das logos VEJA/Super.
  - **Card BlockTrends:** kicker **"A técnica de"**; parágrafo de pioneirismo ancorado em
    fato ("criou a primeira certificação profissional reconhecida pela **ANCORD**, a
    entidade que credencia o mercado de capitais", sem citar cripto — o curso é finanças
    amplas); rodapé **"Pioneira em certificação profissional"** com as logos do **CCA
    (Programa Certificação Criptoativos ANCORD)** e da pós **Desenvolvedor Blockchain**,
    ambas recoloridas para fundo claro (vinham em branco, p/ fundo escuro). Big numbers
    removidos.
  - Logos-título (VEJA Negócios × BLOCKTRENDS) equalizadas em cap-height e na linha de base.
    Copy seguiu o guia anti-slop (`referencias/cowork/COPY.md`): sem travessão, voz ativa,
    números concretos.
- **LP · Selo "Quem assina" refeito + nomenclatura travada** — 2026-07-22
  - Selo circular agora **une as duas marcas**: faixa verde profunda com **VEJA NEGÓCIOS**
    (arco superior) e **BLOCKTRENDS** (arco inferior) em Playfair off-white, olho reto no
    centro na proporção real (328×238, sem esticar), miolo cor de areia (`#F0E9D8`) com
    aros dourados e losangos nas laterais. Passou de `<img>` para **SVG inline** no card
    (`scripts/port-lp.mjs`, 7k) para herdar a fonte Playfair da página; `public/lp/selo-veja.svg`
    mantido em sincronia como referência.
  - **Nomenclatura da chancela da VEJA travada:** "institucional" → **"Chancela de
    credibilidade"** (BlockTrends segue "Chancela técnica"). Resolve a pendência aberta no
    `docs/BACKLOG.md`. Logos de VEJA/Super Interessante seguem como placeholder de texto.
- **LP · Rodapé alinhado ao da VEJA Negócios** — 2026-07-21
  - Estrutura em 3 faixas espelhando `veja.abril.com.br/veja-negocios`: faixa superior
    no verde do KV (logo + "SIGA" + redes sociais), faixas Grupo Abril/institucional
    em preto, com a logo do Grupo Abril e razão social **"Abril Comunicações S.A. ·
    CNPJ 44.597.052/0001-62"** (LP irá para subdomínio da Abril). Links sociais reais
    pendentes.
- **LP · Corpo docente** — 2026-07-21
  - Fotos em **P&B no repouso, revelando cor no hover** (antes era duotone verde que se
    confundia com o fundo); **badges de trajetória** por professor (empresas pesquisadas
    e verificadas); **cargo em uma linha**; numeral romano removido de cima das fotos.
- **LP · Ajustes de design** — 2026-07-21
  - Comparativo neutralizado e depois **removido** (substituído por "Ferramentas");
    seta "→" no preço da ficha técnica (afordância); contraste AA dos captions
    (`#8F887E`→`#6D6D6D` nos textos pequenos); botões da topbar padronizados;
    algarismos com `lining-nums`; correção de contraste do copyright blindada no porte.
- **DX · Leitura da LP em runtime** — 2026-07-21
  - `app/page.tsx` passou a ler `body.html`/`styles.css` **dentro** do componente (roda
    no build para o SSG; em dev, a cada request), para edições aparecerem sem reiniciar
    o dev server. Todas as mudanças de LP acima vivem em `scripts/port-lp.mjs` (etapas
    7d–7k), à prova de re-porte.

### Removido
- **LP · Seção "A Diferença" (comparativo)** — 2026-07-21
  - Substituída pela nova seção "Ferramentas", que ocupou o lugar dela.

### Adicionado
- **Nome, e-mail e prazo de acesso dinâmicos na área** — 2026-07-21
  - As telas da área (topbar, home, conta, resultado e **certificado**) deixam de
    exibir dados fixos e passam a mostrar os do aluno logado. O `AreaChrome` preenche
    marcadores `data-u` (nome completo / primeiro nome / inicial), `data-email` e
    `data-acesso` a partir da sessão; o certificado em PDF sai com o nome correto.
  - **Prazo de acesso** calculado (compra + 1 ano) em vez de data fixa. Em homolog usa
    a data de criação da conta como proxy; em produção a fonte é `enrollments.expires_at`.
  - **Primeiro acesso** pede **"Nome completo"** (só em homolog, onde não há webhook do
    Guru para trazê-lo); a conta é criada com `user_metadata.nome` (mesma chave do Guru).

- **Deploy homolog: variáveis de ambiente no Netlify** — 2026-07-21
  - Chaves do Supabase (URL, anon, service role como *secret*), `NEXT_PUBLIC_SITE_URL`
    e WhatsApp configuradas no site `abril-project`, destravando o auth no deploy.

### Alterado
- **WhatsApp: link unificado em `wa.me`** — 2026-07-21
  - Padronizado `https://wa.me/message/W2USYZZK75FMC1` no código, `.env.example` e Netlify.

### Removido
- **Home: botão "Ver a formação" do hero** — 2026-07-21
  - Redundante com os cards da prateleira "A Formação" logo abaixo.

### Adicionado
- **Autenticação Supabase (email + senha)** — 2026-07-20
  - Login (`signInWithPassword`) e **primeiro acesso = signup** (cria a conta já
    confirmada via server action com service role, sem e-mail de confirmação;
    espelha o webhook do Guru). Guarda de sessão em `proxy.ts` protege `/app/*`.
    "Sair" faz `signOut`. Erros inline. `.env.local` com as chaves (fora do git).

- **Área do aluno funcional (dados reais)** — 2026-07-20
  - **Modelo de dados do curso** (`lib/curso.ts`): 5 módulos, 17 aulas, docentes,
    descrições. Página de aula **data-driven** (`lib/aula-template.ts`): título,
    breadcrumb, descrição, materiais e sidebar por aula; navegação real prev/próxima;
    sidebar com estados concluída/atual/futura, clicável.
  - **Home dinâmica** (`lib/home-template.ts`): hero "Continue de onde parou" e os
    cards de módulo vindos dos dados.
  - **Progresso real, por usuário**: botão "Concluir aula" persistido em cookie
    escopado pelo `user.id` (conta nova começa do zero); sidebar, %, home, "Continuar"
    e o gate da prova reagem. Popup de bloqueio da Prova Final até 16/16.
  - **Player** tocando (clipe de exemplo local, sem download) e **materiais** baixáveis
    (PDF de exemplo). "Comprar" na LP → primeiro acesso (homolog, sem Guru).

- **Certificado + verificação** — 2026-07-20
  - **Baixar PDF**: captura o preview (`html2canvas`) e monta um PDF do tamanho exato
    (`jsPDF`), sem corte, ~190 KB; logos VEJA/BlockTrends rasterizadas para o PDF.
  - **Compartilhar no LinkedIn** (add-to-profile oficial) e **"Validar"** → `/verificar`.
  - **`/verificar/:codigo`** — página pública (válido/inválido), on-brand.
  - **`og:image`** da LP (1200×630 branded) + twitter card.

### Adicionado
- **Área do aluno: estados de login e atalhos de teste (homolog)** — 2026-07-20
  - Estados da tela de login por query param: **senha errada** (`?s=erro`), **pagamento
    em processamento** (`?s=pendente`) e **1º acesso / defina sua senha** (`?s=primeiro`),
    além do normal. Saem dos próprios `sc-if` do design (nenhum markup novo).
  - Barra fixa de **atalhos de teste** no login para pular entre os estados.
  - **Resultado — variante REPROVADO** (`/app/prova/resultado?r=reprovado`): "Faltou
    pouco", nota, desempenho por módulo, "Solicitar 2ª chamada no WhatsApp". Ícone de
    alerta do cowork (`atencao.png`) recolorido via CSS mask.
  - Atalhos de teste na tela de questão: **Simular aprovação / reprovação**.
  - Refinos: selo (chancela com olho) na prova; glow `vsGlow` no card da nota (aprovado);
    ícone oficial do LinkedIn no certificado; ano de emissão no canto do certificado.

- **Área do aluno: telas P3–P7 (aula, prova, resultado, certificado, conta)** — 2026-07-20
  - **P3 · Aula** (`/app/modulo/[m]/aula/[n]`): player full-width (letterbox), coluna
    com breadcrumb/título/materiais, sidebar de progresso com acordeões nativos.
    Botões ← / Próxima navegam entre aulas.
  - **P4a · Prova, instruções** (`/app/prova`): checkbox "estou ciente" habilita o
    "INICIAR PROVA" (desabilitado por padrão) → questão 1.
  - **P4b · Prova, questão** (`/app/prova/questao/[q]`): alternativas selecionáveis
    (radio, persistidas), cronômetro regressivo com deadline em sessionStorage
    (sobrevive à navegação/refresh), contador + barra de progresso, "Enviar prova"
    na última questão → resultado. Enunciado/alternativas são placeholders.
  - **P5 · Resultado** (`/app/prova/resultado`): variante APROVADO (nota, desempenho
    por módulo, selo VEJA) → "Emitir certificado". REPROVADO é a outra variante.
  - **P6 · Certificado** (`/app/certificado`): preview do certificado, código de
    verificação, Baixar PDF / Compartilhar (pendentes), NPS 0–10 selecionável.
  - **P7 · Minha conta** (`/app/conta`): dados, prazo de acesso, suporte no WhatsApp.
  - `port-area.mjs`: expande os `sc-for` (alternativas da prova, escala NPS), resolve
    a variante do resultado e o player full-width; placeholders resolvidos.

### Corrigido
- **Área do aluno: prova (P4b)** — 2026-07-20
  - **Seleção dupla**: ao navegar entre questões o DOM é reaproveitado; reler o estilo
    base do DOM pegava a versão já pintada e a seleção anterior grudava. Agora o base
    limpo fica num WeakMap de módulo. Também limpo listeners com AbortController.
  - **Barra de progresso** passou a refletir a posição da questão (q/20), assada no
    servidor por questão — antes resetava ao valor padrão a cada navegação.

- **Área do aluno: ajustes da Home (P2)** — 2026-07-20
  - Placeholder de arte do módulo (`.art-slot`) passou a `position:absolute;inset:0`
    — antes transbordava a área e sobrepunha o texto do card.
  - Menu de conta (avatar): o dropdown "Minha conta / Sair" (bloco `accountOpen`)
    era descartado no porte; agora é preservado oculto e alterna no clique do avatar
    (fecha no fora-clique). "Minha conta" → `/app/conta`, "Sair" → `/app/login`.
  - Rodapé da área trocado pelo mesmo rodapé estruturado da LP (Institucional /
    Políticas / Contato + DPO + copyright + Voltar ao topo).

### Adicionado
- **Área do aluno: Home / vitrine (P2)** — 2026-07-20
  - Segunda tela (`/app`): banner "Continue de onde parou" + prateleira "A Formação"
    (5 módulos com estado e progresso) + materiais/certificação. Design portado fiel.
  - Chrome autenticado: route group `(sala)` com `AreaChrome` (topbar + footer). O login
    fica fora do grupo, sem chrome. Nav: Início → `/app`, FAQ → LP, Suporte → WhatsApp.
  - `port-area.mjs` agora extrai também topbar, footer e a Home; os `x-import`
    (arte de módulo) viram placeholders on-brand (`.art-slot`) — arte é pendência.
  - CTA/cards levam à página de aula (P3, próxima tela; ainda 404).
  - Correção: botão de login em caixa alta (**ENTRAR**).

- **Área do aluno: tela de Login (P1)** — 2026-07-20
  - Primeira tela da área interna (`/app/login`), design portado fiel do bundle
    `Area-do-Aluno.html` (split "Bem-vindo de volta" + marca VEJA × BlockTrends).
  - Novo pipeline `scripts/port-area.mjs`: extrai assets (WebP), CSS e cada tela
    (bloco `<sc-if>`, resolvido para o estado padrão via `hint-placeholder-val`).
  - Infra da área: `app/app/layout.tsx` (injeta o CSS, tema dark, `noindex`),
    `AreaInteractions` (hover + focus, com MutationObserver para telas futuras).
  - Interatividade de homolog: "Entrar" navega para `/app` (auth Supabase depois),
    "Fale no WhatsApp" ligado. "Esqueci minha senha" fica placeholder até a rota existir.
  - Próximas telas: Home (P2), Aula (P3), Prova (P4), Resultado (P5), Certificado (P6),
    Minha conta (P7).

- **LP: rodapé reestruturado** — 2026-07-20
  - Rodapé de uma linha substituído por um estruturado, inspirado no
    `cca.blocktrends.com.br` (mesma empresa): colunas **Institucional** (nav para as
    seções), **Políticas** (Termos, Privacidade) e **Contato** (WhatsApp + DPO
    `dpo@qr.capital`), mais barra de copyright e "Voltar ao topo".
  - Mantém a identidade Meridiano (verde/dourado, Playfair), não o preto da referência.
  - Wordmark do rodapé usa o markup idêntico ao da topbar (ESTRATÉGIA + INTERNACIONAL
    entre as duas linhas douradas), para consistência de marca.
  - Feito em `scripts/port-lp.mjs` (passo 9) → sobrevive a reexecuções do porte.
  - _A confirmar:_ razão social ("1971 Comunicações e Sistemas LTDA.") e DPO, herdados
    do site da QR Capital. Termos e Privacidade seguem como `#` até as páginas existirem.

- **LP: link do WhatsApp plugado** — 2026-07-20
  - Botão flutuante e link "Suporte no WhatsApp" do rodapé agora apontam para
    `https://wa.me/message/W2USYZZK75FMC1` (antes `href="#"`), com `target="_blank"`.
  - Passo embutido em `scripts/port-lp.mjs` (sobrevive a reexecuções do porte).
  - Pendências ainda a povoar: URL do checkout Guru, Termos de uso e Privacidade·LGPD.

- **LP: glow pulsante no card de preço da Oferta** — 2026-07-20
  - Aplicado o mesmo efeito `.vs-hl` (animação `@keyframes vsGlow`, halo dourado
    pulsante) usado no box verde da seção "A Diferença" ao card de preço (R$ 397)
    da seção Oferta. O card claro sobre o fundo verde escuro faz o halo destacar.
  - O passo foi embutido em `scripts/port-lp.mjs` (match pela borda dourada
    exclusiva do card), então sobrevive a reexecuções do porte.

### Corrigido
- **LP: hovers de botões/links restaurados** — 2026-07-20
  - O bundle original aplicava os hovers via atributo `style-hover` (estilo inline
    trocado por JS em runtime); o porte estático removeu esse JS e os 12 hovers de
    botões/links ficaram inertes. Restaurados por um client component leve
    (`app/_lp/HoverRuntime.tsx`, ~15 linhas, sem framework de animação) que
    reproduz o mesmo comportamento — as transições já viviam no `style` base, então
    a suavidade voltou idêntica ao design.
  - Diagnóstico: os "JS" do bundle eram apenas React/ReactDOM — não havia biblioteca
    de motion. Menu mobile (checkbox `:checked`) e acordeões (`<details>` nativos) já
    funcionavam no porte; o glow do selo VEJA (`@keyframes vsGlow`) idem.
  - Verificado no navegador: 12/12 hovers reagindo, 12 acordeões alternando, menu e
    glow intactos.

### Performance
- **LP: imagens otimizadas (WebP + lazy-load)** — `ac21497` · 2026-07-20
  - PNG/JPEG convertidos para **WebP** no porte: `public/lp` de **6,3 MB → 1,3 MB**
    (raster de **5,65 MB → 0,66 MB**). Ex.: hero **2,98 MB → 214 KB**; outro **1,05 MB → 54 KB**.
  - `loading="lazy"` da 9ª imagem em diante (logo + hero seguem *eager* para preservar o LCP)
    e `decoding="async"` nas 21 imagens.
  - `scripts/port-lp.mjs` passou a aplicar essa otimização, então reexecuções do porte
    **não regridem** o ganho. `sharp` declarado em `devDependencies`.
  - _Pendência conhecida:_ as animações JS do bundle continuam de fora (o porte remove
    `<script>`); serão tratadas à parte.

### Landing Page
- **LP: porte fiel do design original do bundle** — `3b4470e` · 2026-07-20
  - A LP passa a renderizar o **HTML+CSS reais** do `LP-Estrategia-Internacional.html`
    (bundle do Claude Design) via `app/_lp/{body.html,styles.css}`, injetados na página (SSG).
  - `scripts/port-lp.mjs`: extrai assets, resolve `{{ preco }}`/`{{ parcelas }}`,
    desembrulha `<sc-if>` (VSL e WhatsApp) e reescreve as refs de asset para `/public/lp`.
  - 35 assets (olho em gravura, fotos duotone, gravuras, fontes) em `public/lp`.
  - LP isolada do Tailwind (o layout não importa mais `globals.css`) para máxima fidelidade.
  - Remove a LP reescrita anterior e os assets órfãos.
  - _Motivo:_ a versão React reescrita divergia visualmente do design aprovado; agora a LP
    é o design original, pixel a pixel.

- **LP: reconstrução da landing page (SSG) no Meridiano** — `c578a69` · 2026-07-20
  _(substituída pelo porte fiel acima)_
  - `app/page.tsx` com 10 seções fiéis ao design (topbar, hero, ficha, diagnóstico, docentes,
    formação, diferença, quem assina, oferta, FAQ, CTA + footer).
  - Tokens do Meridiano via Tailwind + efeitos em `globals.css` (textura de pontos, wordmark,
    atos, duotone dos docentes, glow da oferta, acordeões, menu mobile).
  - Decisões aplicadas: kicker de marcas no hero, **R$ 397 / 10x sem juros**, chancela
    editorial VEJA (não "Certificação VEJA").
  - Fotos dos docentes e olho em `public/`; layout pt-BR sem fontes Geist.
  - `proxy` não bloqueia quando o Supabase ainda não está configurado (shell no homolog).

### Infraestrutura
- **Arquitetura de ambientes (homolog-first)** — `5d5af09` · 2026-07-20
  - `netlify.toml`: contextos **production** (branch `main`) e **homolog** (branch `homolog`).
  - `docs/AMBIENTES.md`: estratégia de 3 ambientes (local, homolog, produção), deploy e checklist.
  - `LEIA-ME`: índice de ambientes.

- **Scaffold: Next.js 16 + Supabase + fundação do produto** — `9e85719` · 2026-07-20
  - Next.js 16 (App Router, RSC) + Tailwind v4 com tokens do Meridiano.
  - Fontes Playfair/Montserrat self-hosted em `public/fonts`.
  - Supabase: clientes anon (server/client) e service role (admin).
  - `proxy.ts` (ex-middleware) para renovar sessão e proteger `/app/*`.
  - Schema inicial: 10 tabelas, enums, RLS, funções (`is_admin`, `has_active_access`,
    `sortear_prova`, `verify_certificate`) e trigger de perfil.
  - Seed de dev: módulos, 16 aulas reais e banco de questões de exemplo.
  - Esqueleto do webhook Guru: idempotente, provisiona conta/matrícula, revoga em reembolso
    (assinatura e SES marcados como pendência).
  - Fundação do projeto em `docs/` (PRD, ROUTES, DESIGN, BACKLOG).

---

_Convenção: cada entrada referencia o commit (`hash`) e a data. Ao abrir a versão de produção,
mover os itens de **Não lançado** para uma seção versionada (ex.: `## [1.0.0] — AAAA-MM-DD`)._

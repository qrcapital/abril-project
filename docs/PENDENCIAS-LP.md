# Pendências — LP + Área do Aluno

Checklist vivo do que falta antes do "pronto para produção" (V1/homolog). Atualizado
conforme os insumos chegam. Quando o Pedro perguntar "quais as pendências?", este é o
documento a puxar. (O admin é V2 — ver `PLANO-ADMIN.md`.)

_Última atualização: 2026-07-29. As tarefas 1 e 2 da fila abaixo saíram: os 12 arquivos que
tinham ficado na árvore depois do `c76e196` foram commitados junto com a correção do `upsert`
silencioso do signup. A fila válida começa agora na tarefa 3._

> Legenda: 🟢 dá para fazer agora (sem insumo externo) · 🔒 bloqueado por insumo/decisão.

---

## ▶ PRÓXIMA SESSÃO (fila montada em 28/jul, para retomar em 29/jul)

Tarefas discretas, na ordem sugerida. O detalhe de cada uma está nas seções abaixo e, para as
de feedback, no `docs/FEEDBACK-UX.md`.

### Rápidas, minutos cada

1. ~~**Commitar os 12 arquivos da árvore**, incluindo o `.nvmrc`.~~ **FEITO em 29/jul**, junto
   com a tarefa 2. O `.nvmrc` (três bytes, `22`)
   ficou fora do `c76e196` porque é arquivo do Pedro e a regra era não mexer sem perguntar; ele
   autorizou deixar para o commit seguinte. Registrar no `HANDOFF` que passou a ser versionado.
   Conteúdo do commit: regra de senha em 8 caracteres, cor calculada do desempenho por módulo
   com as duas correções de AA, o `docs/FEEDBACK-UX.md` novo, e a sincronia de PRD, DESIGN,
   AGENTS, LEIA-ME, CHANGELOG e deste documento. `npm run build`, `npm run lint` e
   `npm run check` estavam passando no fim da sessão. Push é ordem separada.
2. ~~**`upsert` silencioso** em `app/app/login/actions.ts`.~~ **FEITO em 29/jul.** Saiu em seis
   linhas, não uma: só capturar o erro deixaria a conta pela metade, com usuário no auth e sem
   linha em `profiles`, e o `verify_certificate()` faz join em `profiles`, então o furo só
   apareceria na verificação pública do certificado. Agora loga, **desfaz o usuário** e devolve
   erro à tela. Sem o desfazer, o retry esbarra em "já tem conta" e o silêncio volta pelo outro
   lado.
3. 🔒 **Template `Invite user`** no painel do Supabase, para o primeiro acesso ficar pronto antes
   do Guru: `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=invite`. Tarefa do Pedro.
   **Não há o que decidir aqui:** é a mesma edição do Reset Password trocando o tipo, e o
   `/auth/confirm` já aceita `invite`. O que fica em aberto é vizinho e só importa no lançamento
   (corpo do e-mail e remetente) — ver "Antes de produção: o e-mail de boas-vindas" abaixo.

### Feedback ao usuário: a camada que atravessa a área logada

Levantada pelo Pedro em 28/jul. Auditoria completa e priorizada em `docs/FEEDBACK-UX.md`: 12
achados graves, 11 médios, 13 pontos já cobertos. Estes quatro primeiros são de **camada**, cada
um consertando várias telas de uma vez, e é por isso que vêm antes dos de tela.

4. **Definir os quatro padrões de feedback e registrá-los no `DESIGN.md` §3**: caixa de erro,
   caixa de sucesso, botão em trabalho, e lista de exigências que marca conforme cumpre. **Faça
   antes das tarefas 8 a 12 e da 17**, senão nascem cinco jeitos de dizer "carregando". As duas
   primeiras já existem quase iguais em três clients, com CSS inline duplicado; vale extrair.

   **TBD (28/jul):** o desenho ainda não existe. Não é decisão que dependa do Pedro, é proposta
   nossa para ele aprovar. Caminho combinado: propor os quatro junto com a tarefa 6, porque o
   `error.tsx` obriga a decidir a cara de erro de qualquer forma, e aí os outros três saem no
   mesmo movimento em vez de virar reunião separada.
5. **Preencher o nome do aluno no servidor.** Medido: o HTML servido a um aluno logado traz
   `>Pedro<` duas vezes e o nome real zero vezes, porque o `AreaChrome` preenche num efeito de
   cliente. Cai também no resultado da prova ("Você concluiu a formação, Pedro"). Fazer como o
   `fillHome` e o `fillQuestao` já fazem com outros dados. Vale para `[data-u]`, `[data-email]`
   e `[data-acesso]`.
6. **`loading.tsx`, `error.tsx` e `not-found.tsx` no grupo `(sala)`.** Não existem em lugar
   nenhum do projeto. Três arquivos pequenos: sinal de transição entre telas (todas são
   dinâmicas e fazem `getUser()` antes de responder), tela de erro na marca, e 404 dentro do
   shell escuro. O `error.tsx` virou necessidade concreta em 28/jul, porque o motor da prova
   estoura de propósito em duas situações (`exigir` dos templates e banco de questões curto) e
   nenhuma tem tela.
7. **Sessão expirada explicada** na volta ao login. Hoje é redirect mudo: o aluno estava na aula
   7 e cai num "Bem-vindo de volta" sem entender por quê. Um `?estado=expirou` no padrão que a
   recuperação de senha já usa.

### Feedback ao usuário: por tela

8. **"Trocar senha" em Minha conta não faz nada.** O comentário do `ContaClient` diz "pendente
   até o fluxo real"; o fluxo real existe desde 28/jul. Apontar para `/app/recuperar-senha`, ou
   trocar ali mesmo pedindo a senha atual. Botão morto é o pior feedback que existe.
9. **`catch` no download do certificado**, mais rótulo de trabalho. Tem `opacity .6` e
   `pointer-events:none` num `finally`, mas **não tem `catch`**: se o `html2canvas` falhar, o
   botão volta ao normal e nada é dito, o que é indistinguível de "o clique não funcionou". É a
   entrega final do curso.
10. **Indicador progressivo das exigências de senha**, nas duas telas que criam senha. É o caso
    que o Pedro citou: hoje a regra é frase estática e o erro sai um por vez, no envio. Marcar
    cada exigência conforme a pessoa digita.
11. **Aula sem material** mostrando "em breve" em vez de seção vazia (`PRD.md` §6), e **aviso de
    tempo acabando** na prova, a 10 e a 5 minutos.
12. **O resto do mapa:** `role="alert"` onde falta, rótulo de botão em trabalho no login,
    marcação otimista do "Concluir aula", feedback do "Sair".

### Frentes grandes

13. 🔒 **Banco de questões da prova**, ~100 questões, 25 por módulo. É o que falta para a prova
    deixar de rodar sobre as 24 `[EXEMPLO]`. Com 6 por módulo, dois sorteios repetem 19 das 20
    questões; com 25, a sobreposição esperada cai para cerca de 4.

    **TBD (28/jul):** quem escreve as questões ainda não está definido. O `PRD.md` §7 diz que o
    banco é construção nossa ponta a ponta, estrutura e conteúdo, e não dependência de docente
    nem de terceiro; falta decidir se saem daqui ou de outra fonte. **Não bloqueia mais nada:**
    o motor está pronto e testado sobre as 24 de exemplo, então tudo da fila anda sem isto.
14. **Matrículas + `/app/acesso` + guarda real de acesso.** Hoje há **zero `enrollments`**, e a
    RLS de `modules`/`lessons`/`materials` exige `has_active_access()`: no dia em que o curso
    sair do `lib/curso.ts` para o banco, todo aluno logado vê currículo vazio. O `proxy.ts` só
    checa se existe sessão, e o `PRD.md` §4 manda `revoked` e `expired` caírem em `/app/acesso`.
    Criar matrícula para as contas de teste do homolog entra aqui.
15. **Migrar o curso para o banco** (depende da 14). Mata a duplicação entre `seed.sql` e
    `lib/curso.ts`, tira o progresso do cookie e transforma o gate de 16/16 em garantia de
    verdade, em vez de checagem sobre cookie editável pelo aluno.

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
- [ ] **Remover atalhos de teste** (login e prova) antes do go-live.
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

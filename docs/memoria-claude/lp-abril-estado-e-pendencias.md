---
name: lp-abril-estado-e-pendencias
description: Estado e ponto de retomada do Abril (Estrategia Internacional) - ultima sessao 30/jul, fila de codigo vazia; ler o bloco PROXIMA SESSAO do docs/PENDENCIAS-LP.md antes de qualquer coisa.
metadata: 
  node_type: memory
  type: project
  originSessionId: 4b72866b-75a2-4ccb-9364-0b22495f53bd
  modified: 2026-07-26T02:04:57.735Z
---

Estado da **LP Estratégia Internacional** (repo `C:\Users\pedro\Claude\abril-estrategia-internacional`, branch `homolog`) após a sessão de **21/jul/2026 (noite)**. Ver [[critique-lp-abril]], [[estado-abril-plataforma]], [[projeto-abril-estrategia-internacional]], [[copy-md-obrigatorio]].

**MIGRAÇÃO DE MÁQUINA (25/jul/2026):** o Pedro comprou um MacBook e vai **transferir o desenvolvimento deste projeto do Windows para lá**. Foi criado o **`docs/HANDOFF.md`** (commit `712b0cb` em `homolog`, pushado), documento de continuidade que consolida tudo desta nota e mais: o que não vem no `git clone`, setup no macOS, armadilhas e decisões fechadas. **Ao trabalhar neste projeto em qualquer máquina, ler o `docs/HANDOFF.md` primeiro** — o `AGENTS.md` já aponta para ele. As memórias do Abril foram copiadas para **`docs/memoria-claude/`** (viajam no git; o README de lá tem o procedimento de reinstalação no Mac) e o `COPY.md` virou `docs/COPY.md`, versionado. Fora do git e a transferir na mão: `.env.local` (recriar do dashboard Supabase) e os insumos brutos de `referencias/cowork/` (~9 MB; um arquivo tem marca d'água Dreamstime, não commitar em bloco). **Os geradores do globo e o `checkpoint-canvas/` do scratchpad já foram apagados pelo sistema, não existem mais em lugar nenhum** — os dados de saída seguem versionados em `scripts/globo-*.txt`.

**PONTO DE RETOMADA (30/jul/2026, fim da sessão — repo em `~/projects/abril-project`):**

Comece pelo bloco **"▶ PRÓXIMA SESSÃO"** no topo do `docs/PENDENCIAS-LP.md`. Não recontar
história: ler o bloco e ir para o trabalho.

**A fila de código voltou a ter trabalho: o ADMIN começou em 30/jul.** As duas tarefas antigas
saíram (a **16**, rotina da prova abandonada, e a **17**, diálogo de envio e grade), e depois
disso o Pedro **destravou a 18** decidindo as quatro perguntas do `PLANO-ADMIN.md` §8: porta única
em `/app/login` com redirect por papel, **404** para não-admin logado, a conta dele como primeiro
admin, e **dados reais em vez de mock** (as Fases 1 e 2 do plano colapsaram numa só, porque a
tabela de fases foi escrita antes de o Supabase existir). Já de pé: `app/admin/` com guarda,
sidebar e Painel de quatro cards reais.

**Três coisas dessa sessão que não estavam em documento nenhum:** (1) o banco tinha **zero
admins**, e depois da `0003` só a service role concede o papel — resolvido por
`scripts/admin-conta.mjs`, que **tem que rodar no `ei-prod`** ou o `/admin` de produção sobe
inacessível; (2) o **`app/globals.css` que o `AGENTS.md` manda usar nunca existiu**, e o admin é o
primeiro lugar do projeto onde o Tailwind roda de fato (tokens em `app/admin/admin.css`); (3) a
armadilha do `redirect()` sair como 200 vale **só com streaming já iniciado** — na primeira linha
de um layout é 307 de verdade, medido.

**Alunos e detalhe do aluno saíram em 30/jul** (§4.2 e §4.3, migration `0006`), somente leitura. A
decisão de projeto dessa fatia: **o estado de acesso não é calculado em SQL** — a função devolve
`status` e `expires_at` crus, e a tradução é a MESMA `estadoDaMatricula` que a guarda do aluno usa,
extraída para `lib/matricula-estado.ts` com `npm run check:matricula`. Duas verdades sobre quem tem
acesso apareceriam no suporte, não no build.

**A tela achou um problema no primeiro carregamento:** as 9 matrículas do homolog estão com
`liberacao_total = true`, o que desliga a esteira semanal para todo mundo. Não revertido, porque
pode ter sido deliberado para teste e muda o que os stakeholders veem. Pendência do Pedro.

**Restam do admin:** Questões (§4.4, só significa algo depois das ~100 questões) e E-mails (§4.5,
`email_log` vazio até o SES). Dele: as três decisões do §4.6, o banco de ~100
questões (a prova hoje roda sobre
24 `[EXEMPLO]`, e dois sorteios repetem 19 das 20), o template Invite user e a política de senha
no painel do Supabase.

**Duas armadilhas de ambiente que custaram tempo em 30/jul, as duas com o mesmo formato — o erro
apontava para a causa errada:**

- **O dev server só funciona em `localhost:3000`.** Por `127.0.0.1:3000` o Next bloqueia os
  recursos de dev por cross-origin e a **hidratação morre em silêncio**: a página renderiza, os
  chunks carregam, o console fica limpo, e nenhum `useEffect` roda. Na tela de login isso aparece
  como os valores de exemplo do design (`pedro@email.com`) permanecendo nos campos, e clicar em
  ENTRAR não faz nada, sem caixa de erro. O aviso está na **primeira linha** do output do dev
  server. Medir em um comando: procurar chaves `__react` subindo a árvore a partir de um input;
  nenhuma significa que não hidratou. Cuidado com um falso positivo: `nextjs-portal` existe
  sempre em dev, não indica erro.
- **A extensão do Chrome não pareia até reiniciar o Chrome por completo.** Clicar no ícone,
  recarregar a extensão e conferir o login não resolvem.

**Preparo de teste da área do aluno** (só homolog, e está na lista da tarefa 10 para remover
antes do go-live): a conta `testinhos@joao.com.br` está com senha `Admin123`, matrícula ativa com
`liberacao_total`, 17/17 de progresso e uma tentativa de prova **já enviada** (`submitted`, nota
20, 17 respondidas e 3 em branco). O Pedro confirmou o envio no fim da sessão, o que exercitou o
último caminho que faltava do diálogo: botão virando "Enviando..." e a tela de resultado.
**Consequência para quem for testar a prova de novo:** `/app/prova` agora redireciona esta conta
para `/app/prova/resultado`, porque a tentativa é única. Para reabrir, apagar a linha de `exams`
desta conta (é o que o `scripts/aprovar-conta.mjs` faz antes de gravar a dele). O progresso se
marca com `scripts/progresso-conta.mjs <email> --tudo`.

**Estado do git (29/jul, fim do dia):** três commits em `homolog`, **todos pushados e no ar**.
`f22e297` (tarefas 1 e 2), **`33f6469`** (camada de feedback inteira) e **`ecafa52`** (acesso por
matrícula, liberação gradual, progresso e currículo no banco). Deploy conferido em
https://abril-project.netlify.app. Árvore limpa, `build`, `lint` e `check` (5/5) passando.

**Estado do git (30/jul):** a leva de hoje foi commitada e pushada em `homolog` com as tarefas 16
e 17 juntas, mais os documentos. A cópia desta memória em `docs/memoria-claude/` sempre fica um
passo atrás por construção, porque é atualizada depois do commit; se ela aparecer modificada na
árvore, é isso, e vai junto no commit seguinte.

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

**A fila válida agora** é o bloco "▶ PRÓXIMA SESSÃO" do `PENDENCIAS-LP.md`. Este parágrafo
descrevia o estado de 29/jul, quando **16** e **17** ainda estavam abertas; as duas saíram em
30/jul e **não sobrou código desbloqueado** — ver o PONTO DE RETOMADA no topo. Do lado do Pedro
segue: **18** (acesso de admin, única que trava construção nova), 3, 20, 13, as três decisões da
tela de conteúdo, e os insumos que faltam (URL do checkout, vídeos e materiais reais).

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

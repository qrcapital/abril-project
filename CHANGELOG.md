# Changelog — Abril · Estratégia Internacional

Registro de todas as mudanças relevantes do projeto (Landing Page + Área de Membros).
Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Datas em `AAAA-MM-DD`. Enquanto não houver release em produção, tudo vive em **Não lançado**
e é validado no ambiente de **homolog** (branch `homolog`).

## Não lançado

### Adicionado
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

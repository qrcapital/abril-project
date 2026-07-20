# Changelog — Abril · Estratégia Internacional

Registro de todas as mudanças relevantes do projeto (Landing Page + Área de Membros).
Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Datas em `AAAA-MM-DD`. Enquanto não houver release em produção, tudo vive em **Não lançado**
e é validado no ambiente de **homolog** (branch `homolog`).

## Não lançado

### Adicionado
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

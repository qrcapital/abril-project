---
name: projeto-abril-estrategia-internacional
description: Projeto novo (LP + área de membros de curso); copy é livre e HTML manda sobre wireframe.
metadata: 
  node_type: memory
  type: project
  originSessionId: d528ec48-5394-4faf-b7bc-74bf18655cb2
  modified: 2026-07-21T14:04:56.522Z
---

Projeto **Abril — Estratégia Internacional**: Landing Page + Área de Membros de um curso. Fica em `C:\Users\pedro\Claude\abril-estrategia-internacional\`, seguindo o padrão de pasta-por-projeto do "lugar interno" `C:\Users\pedro\Claude\`.

Inputs em `referencias/`: `htmls/` (design, fonte de verdade visual), `fluxos-wireframes/` (fluxos válidos; wireframes defasados) e `cowork/`.

Duas regras deste projeto:
- **Copy é livre no texto, estilo mantido** — posso reescrever qualquer texto, mas seguindo o guia de estilo (sem travessão "—", tom editorial sóbrio, sem hype). É o OPOSTO da imutabilidade dos sites i-Educar em [[copy-wireframe-imutavel]].
- **Onde HTML e wireframe divergirem no visual, vale o HTML.**

Decisão de início: usar a skill **blueprint-projeto** para gerar PRD + rotas + design system, encaixando o material existente (IMPLEMENTACAO.md, designs, fluxos) com as criações da skill — não refazer do zero.

Handoff técnico é `referencias/cowork/IMPLEMENTACAO.md` (v1.0, fonte de verdade). Designs são bundles do Claude Design (manifest gzip+base64 + `<script type="__bundler/template">` com HTML escapado em JSON); desempacotar com Node: extrair o template, `JSON.parse`, e os assets do manifest (fontes woff2, olho, fotos vêm embutidos). Stack: Next.js + Supabase + Vercel + Panda Video + Amazon SES + checkout Guru; LP em `/`, plataforma em `/app`.

Decisões desta rodada (17/jul/2026): kicker de marcas VOLTA ao hero da LP (altera o design final); exit-intent FORA do corte inicial (candidato fase 2); prova = 20 questões fixo.

Fundação em `docs/`: PRD.md, ROUTES.md, DESIGN.md ("Meridiano"), BACKLOG.md, e apresentação de stack (artifact publicado). Estilo confirmado: Tailwind com tokens do Meridiano.

Decisões fechadas na revisão de 20/jul: preço **R$ 397** à vista ou 10x sem juros de R$ 39,70; suporte via short link `https://wa.me/message/W2USYZZK75FMC1` (unificado em 21/jul; `wa.me` é a forma canônica do WhatsApp — `api.whatsapp.com` só redireciona pra ela; link hardcoded no código, env `NEXT_PUBLIC_WHATSAPP_URL` não é lida); prova = 20 questões **sorteadas de um banco de ~100** (meta 5×, piso 60), balanceado 5 por módulo. **O banco de questões é construção nossa/interna, ponta a ponta** (estrutura de funcionamento E o conteúdo das questões), não é dependência externa de docentes nem terceiros; é trabalho de escopo, populado por nós. **não usar "Certificação VEJA Negócios"** (VEJA é chancela editorial cossignatária, emissora é BlockTrends); modo claro na plataforma foi para o BACKLOG (não descartado).

S1 executada e commitada (branch `main`, commit inicial): scaffold Next.js 16 + Tailwind v4 (tokens Meridiano no globals.css, fontes self-hosted em public/fonts), Supabase (clientes anon + service role), `proxy.ts` (Next 16 renomeou middleware→proxy) protegendo /app, schema `supabase/migrations/0001_init.sql` (10 tabelas, RLS em tudo, funções is_admin/has_active_access/sortear_prova/verify_certificate + trigger de perfil), `supabase/seed.sql` (módulos, 16 aulas, banco de questões exemplo), esqueleto do webhook Guru (idempotente; assinatura e SES com TODO). Build passa limpo.

**Arquitetura de ambientes (decidida, homolog-first):** branch `homolog` → ambiente de homolog que stakeholders testam por link; branch `main` → produção. 2 projetos Supabase (`ei-homolog`, `ei-prod`), 1 site Netlify com contextos homolog/production (`netlify.toml`), integrações em sandbox no homolog. Detalhe em `docs/AMBIENTES.md`.

Homolog NO AR: repo GitHub `qrcapital/abril-project` (branches main + homolog; commits reautorados para `ophteixeira`/pedrohfontei@gmail.com via filter-branch + force-push; identidade git local já é essa). Netlify site `abril-project`, com **Production branch apontada para `homolog`** (interino, na fase de review) servindo a LP em https://abril-project.netlify.app. `main` fica como tronco de produção futuro. Push em homolog faz auto-deploy.

Passo 4 CONCLUÍDO (área do aluno construída e no ar em homolog) — estado atual e próximos passos em [[estado-abril-plataforma]]. Sem `gh`/netlify CLI na máquina; ações outward (push) rodam via `!` na sessão do usuário.

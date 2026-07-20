<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Estratégia Internacional

Formação on-demand em dolarização de patrimônio (BlockTrends × VEJA Negócios). Um projeto Next.js com **LP de vendas pública** (`/`, SSG, tema claro) e **área do aluno autenticada** (`/app/*`, tema dark).

## Fundação (leia antes de construir)

A planta do projeto está em `docs/`. É a fonte de verdade:

- `docs/PRD.md` — especificação completa (features, regras, edge cases, modelo de dados, e-mails, admin, QA).
- `docs/ROUTES.md` — mapa de telas e navegação.
- `docs/DESIGN.md` — design system **Meridiano** (tokens, patterns, guarda-corpos anti-slop).
- `docs/BACKLOG.md` — o que ficou fora do v1.
- `referencias/` — handoff (`cowork/IMPLEMENTACAO.md`), designs finais (`htmls/`, bundles do Claude Design) e fluxos.

## Stack

TypeScript · Next.js 16 (App Router, RSC) · Tailwind v4 · Supabase (Postgres, Auth, Storage, RLS) · Panda Video · Amazon SES · checkout Guru+Pagar.me · WhatsApp (wa.me) · deploy **Netlify** (funções em AWS, Supabase na mesma região).

## Convenções

- **Design:** só usar os tokens do Meridiano (`app/globals.css`, `@theme`). Cores por nome (`bg-verde`, `text-gold`), fontes `font-serif` (Playfair) e `font-sans` (Montserrat). Teto de radius 14px. Seguir o anti-slop checklist do `DESIGN.md`.
- **Copy:** livre no texto, mas com o guia de estilo: **sem travessão**, tom editorial sóbrio, sem hype, números concretos. Vale para UI, e-mails, erros.
- **Supabase:** RLS ligada em tudo. No app, usar o cliente anon (`lib/supabase/server.ts` / `client.ts`) que respeita a RLS. Escritas confiáveis (webhook, correção de prova, certificado, admin) usam a service role (`lib/supabase/admin.ts`), só no servidor.
- **Segurança:** a tabela `questions` guarda a resposta correta e nunca é lida pelo aluno; o sorteio da prova é a função `sortear_prova()` (server-side). Certificado tem verificação pública via `verify_certificate()`.

## Banco de dados

Migrations em `supabase/migrations/`, seed de dev em `supabase/seed.sql` (módulos, 16 aulas reais e um banco de questões de exemplo para testar o sorteio). O banco de questões real, estrutura e conteúdo, é construção nossa.

## Rodar

```
npm run dev      # dev server
npm run build    # build de produção
npm run lint
```
Variáveis em `.env.local` (ver `.env.example`). Sem elas, o app sobe mas as integrações ficam inertes.

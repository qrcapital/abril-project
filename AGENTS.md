<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Estratégia Internacional

Formação on-demand em dolarização de patrimônio (BlockTrends × VEJA Negócios). Um projeto Next.js com **LP de vendas pública** (`/`, SSG, tema claro) e **área do aluno autenticada** (`/app/*`, tema dark).

## Primeira sessão nesta máquina? Comece pelo handoff

**`docs/HANDOFF.md`** é o documento de continuidade: estado real do repositório, o que não
vem no `git clone` (segredos, insumos brutos, e a memória do Claude Code em
`docs/memoria-claude/`), setup, armadilhas conhecidas e as decisões já fechadas pelo Pedro.
Leia antes de editar qualquer arquivo.

Duas dele que quebram trabalho quando ignoradas: a LP é **gerada** por
`scripts/port-lp.mjs`, então editar só o `app/_lp/body.html` perde a mudança no próximo
porte; e o checklist de `docs/COPY.md` roda no texto **final** de qualquer copy, não no rascunho.

## Fundação (leia antes de construir)

A planta do projeto está em `docs/`. É a fonte de verdade:

- `docs/HANDOFF.md` — continuidade, estado atual e armadilhas de operação.
- `docs/PRD.md` — especificação completa (features, regras, edge cases, modelo de dados, e-mails, admin, QA).
- `docs/ROUTES.md` — mapa de telas e navegação.
- `docs/DESIGN.md` — design system **Meridiano** (tokens, patterns, guarda-corpos anti-slop).
- `docs/BACKLOG.md` — o que ficou fora do v1.
- `docs/COPY.md` — diretriz anti-slop de escrita, obrigatória em todo copy.
- `docs/PENDENCIAS-LP.md` — checklist vivo do que falta para o "pronto para produção".
- `referencias/` — handoff (`cowork/IMPLEMENTACAO.md`), designs finais (`htmls/`, bundles do Claude Design) e fluxos.

## Stack

TypeScript · Next.js 16 (App Router, RSC) · Tailwind v4 · Supabase (Postgres, Auth, Storage, RLS) · Panda Video · Amazon SES · checkout Guru+Pagar.me · WhatsApp (wa.me) · deploy **Netlify** (funções em AWS, Supabase na mesma região).

## Convenções

- **Design:** só usar os tokens do Meridiano (`app/globals.css`, `@theme`). Cores por nome (`bg-verde`, `text-gold`), fontes `font-serif` (Playfair) e `font-sans` (Montserrat). Teto de radius 14px. Seguir o anti-slop checklist do `DESIGN.md`.
- **Copy:** livre no texto, mas com o guia de estilo: **sem travessão**, tom editorial sóbrio, sem hype, números concretos. Vale para UI, e-mails, erros.
- **Supabase:** RLS ligada em tudo. No app, usar o cliente anon (`lib/supabase/server.ts` / `client.ts`) que respeita a RLS. Escritas confiáveis (webhook, correção de prova, certificado, admin) usam a service role (`lib/supabase/admin.ts`), só no servidor.
- **Segurança:** a tabela `questions` guarda a resposta correta e nunca é lida pelo aluno; o sorteio da prova é a função `sortear_prova()` (server-side). Certificado tem verificação pública via `verify_certificate()`.
- **Duas armadilhas de privilégio no Postgres, as duas já custaram um vazamento latente aqui** (28/jul/2026, detalhe no `HANDOFF.md` §6):
  - `revoke execute ... from anon, authenticated` **não fecha uma função**. O Postgres concede `EXECUTE` a **PUBLIC** por padrão ao criar função, e os dois papéis herdam disso. O que fecha é `revoke execute ... from public`. Conferir sempre com `has_function_privilege('anon', oid, 'EXECUTE')`, nunca por consulta em `information_schema` filtrando nome de role: a herança de PUBLIC não aparece como linha de grantee.
  - `revoke select (coluna) ...` **não subtrai uma coluna** de um grant de tabela, e o Supabase concede SELECT no nível da tabela. É preciso revogar a tabela e reconceder a lista de colunas permitidas, como está feito em `exams` para esconder o `questions_snapshot`, que carrega o gabarito. Coluna nova em `exams` não fica legível para o aluno até entrar nessa lista.

## Banco de dados

Migrations em `supabase/migrations/`, seed de dev em `supabase/seed.sql` (módulos, 16 aulas reais e um banco de questões de exemplo para testar o sorteio). O banco de questões real, estrutura e conteúdo, é construção nossa.

## Rodar

```
npm run dev      # dev server
npm run build    # build de produção
npm run lint
npm run check    # self-checks de regra de negócio (prova + senha)
```
Variáveis em `.env.local` (ver `.env.example`). Sem elas, o app sobe mas as integrações ficam inertes.

O `npm run check` roda os scripts de `scripts/*-check.mts` em node puro, sem framework de teste.
Cobrem as regras que doem quando quebram: a correção da prova (nota de corte, questão em
branco, desempenho por módulo) e a política de senha. Rodam também as âncoras de HTML dos
templates, para uma mudança no porte estourar ali em vez de servir placeholder do design como
se fosse conteúdo real. **Ao mexer em nota, senha ou nos templates de tela, rode antes de
commitar.**

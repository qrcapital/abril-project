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
- `docs/PENDENCIAS-LP.md` — checklist vivo do que falta para o "pronto para produção". O bloco **"▶ PRÓXIMA SESSÃO"** no topo é a fila ordenada de trabalho.
- `docs/FEEDBACK-UX.md` — mapa tela por tela de onde o aluno precisa de resposta do sistema, o que existe e o que falta. Consultar antes de mexer em formulário, botão de ação demorada ou estado de erro.
- `referencias/` — handoff (`cowork/IMPLEMENTACAO.md`), designs finais (`htmls/`, bundles do Claude Design) e fluxos.

## Stack

TypeScript · Next.js 16 (App Router, RSC) · Tailwind v4 · Supabase (Postgres, Auth, Storage, RLS) · Panda Video · Amazon SES · checkout Guru+Pagar.me · WhatsApp (wa.me) · deploy **Netlify** (funções em AWS, Supabase na mesma região).

## Convenções

- **Design:** só usar os tokens do Meridiano. Cores por nome (`bg-verde`, `text-gold`), fontes `font-serif` (Playfair) e `font-sans` (Montserrat). Teto de radius 14px. Seguir o anti-slop checklist do `DESIGN.md`.
  **Onde os tokens moram de fato** (corrigido em 30/jul/2026): o `app/globals.css` que esta linha citava **nunca existiu**. A LP e a área do aluno são HTML portado, cada uma com o próprio CSS injetado, e não usam Tailwind. O único lugar onde o Tailwind roda é o **admin**, e o bloco `@theme` vive em `app/admin/admin.css`. Tela nova de admin herda os tokens dali; tela nova de LP ou de área do aluno passa pelo porte, não por classe Tailwind.
- **Copy:** livre no texto, mas com o guia de estilo: **sem travessão**, tom editorial sóbrio, sem hype, números concretos. Vale para UI, e-mails, erros.
- **Supabase:** RLS ligada em tudo. No app, usar o cliente anon (`lib/supabase/server.ts` / `client.ts`) que respeita a RLS. Escritas confiáveis (webhook, correção de prova, certificado, admin) usam a service role (`lib/supabase/admin.ts`), só no servidor.
- **Segurança:** a tabela `questions` guarda a resposta correta e nunca é lida pelo aluno; o sorteio da prova é a função `sortear_prova()` (server-side). Certificado tem verificação pública via `verify_certificate()`.
- **Duas armadilhas de privilégio no Postgres, as duas já custaram um vazamento latente aqui** (28/jul/2026, detalhe no `HANDOFF.md` §6):
  - `revoke execute ... from anon, authenticated` **não fecha uma função**. O Postgres concede `EXECUTE` a **PUBLIC** por padrão ao criar função, e os dois papéis herdam disso. O que fecha é `revoke execute ... from public`. Conferir sempre com `has_function_privilege('anon', oid, 'EXECUTE')`, nunca por consulta em `information_schema` filtrando nome de role: a herança de PUBLIC não aparece como linha de grantee.
  - `revoke select (coluna) ...` **não subtrai uma coluna** de um grant de tabela, e o Supabase concede SELECT no nível da tabela. É preciso revogar a tabela e reconceder a lista de colunas permitidas, como está feito em `exams` para esconder o `questions_snapshot`, que carrega o gabarito. Coluna nova em `exams` não fica legível para o aluno até entrar nessa lista.

## Banco de dados

Migrations em `supabase/migrations/`, seed em `supabase/seed.sql`. O banco de questões real,
estrutura e conteúdo, é construção nossa.

**O currículo vive no banco desde 29/jul/2026.** O `lib/curso.ts` não guarda mais as aulas: ele
tem tipos e lógica pura, e o `lib/curriculo.ts` carrega módulos e aulas de `modules`/`lessons`,
uma vez por requisição. Materiais vêm de `materials`. A razão é o admin: ele vai editar título,
descrição, link de vídeo e materiais pelo painel (`PLANO-ADMIN.md` §4.6), e painel não edita
código. Consequência prática: **mudar conteúdo no banco muda a tela sem deploy**, e o seed
deixou de duplicar o código para virar a carga inicial.

**O progresso também é do banco** (tabela `progress`), e não mais um cookie. O gate de 16/16 que
libera a prova era conferido contra um dado que o próprio aluno escrevia; isso foi explorado
três vezes em 29/jul. Se precisar de progresso para testar, use
`scripts/progresso-conta.mjs`, que escreve pelo servidor.

## Rodar

```
npm run dev           # dev server
npm run build         # build de produção — NÃO rodar com o dev de pé (ver abaixo)
npm run lint
npm run check         # self-checks offline (prova, senha, usuário, liberação, currículo, matrícula)
npm run check:rls     # contra o banco: aluno não vira admin (precisa de rede + .env.local)
npm run check:mestre  # contra o banco: regras do admin mestre (idem)
```

**`npm run build` com o `next dev` de pé trava o dev server.** Os dois escrevem no mesmo `.next`, e
o dev não morre: fica com a porta escutando e para de responder, o que chega como defeito de
produto. Detalhe e o diagnóstico de dez segundos no `HANDOFF.md` §6.
Variáveis em `.env.local` (ver `.env.example`). Sem elas, o app sobe mas as integrações ficam inertes.

O `npm run check` roda os scripts de `scripts/*-check.mts` em node puro, sem framework de teste.
Cobrem as regras que doem quando quebram: a correção da prova (nota de corte, questão em
branco, desempenho por módulo), a política de senha, os **marcadores de usuário** do markup
portado, o **calendário de liberação** (que falha o build se o curso ficar concluível dentro da
janela de arrependimento), as **invariantes do currículo** no banco e o **estado de acesso** derivado
da matrícula. Rodam também as âncoras de HTML dos templates, para uma mudança no porte estourar ali
em vez de servir placeholder do design como se fosse conteúdo real. **Ao mexer em nota, senha,
nos dados do aluno ou nos templates de tela, rode antes de commitar.**

**Lógica que precisa de check não pode morar no módulo que importa Supabase.** Quem puxa
`lib/supabase/server.ts` puxa `next/headers` por baixo e **não roda fora do Next**: o node do
`npm run check` estoura com `ERR_MODULE_NOT_FOUND` apontando para um arquivo que existe. É a razão
dos pares `prova-correcao`/`prova`, `usuario-template`/`usuario` e `matricula-estado`/`matricula`.
Regra pura no módulo sem IO, IO importando dela. Detalhe no `HANDOFF.md` §6.

O `check:matricula` guarda a derivação de ativa/expirada/revogada/**ausente**, que desde 30/jul tem
**dois** leitores: a guarda do aluno e o painel do admin. O caso que justifica a função existir é
`status = 'active'` com prazo já vencido — nada reescreve a coluna na virada, então confiar só nela
daria acesso a matrícula expirada. Divergência entre os dois leitores não aparece em build nem em
lint; aparece no suporte.

O `check:usuario` existe por uma armadilha específica: o `preencherUsuario` troca o texto DENTRO
de cada marcador, então um porte que remova um marcador faz a tela voltar a servir o texto do
design ("Pedro Teixeira") como se fosse o nome do aluno, **sem erro nenhum**. Ele guarda os 9
marcadores em 6 arquivos, o escape de HTML no nome, e a âncora do link "Trocar senha", que é
onde o formulário de troca é montado.

## Feedback ao usuário

Os quatro padrões (caixa de erro, caixa de sucesso e aviso, botão em trabalho, lista de
exigências de senha) estão no `DESIGN.md` §3 e implementados em `app/app/_ui/feedback.tsx`.
**Estenda daqui, não invente variante.** Três coisas que economizam tempo:

- **A área do aluno não é escura.** O chrome é; o miolo de toda tela de `(sala)` é claro
  (`#F7F5F2`, texto `#333333`). Cada padrão tem os dois pares, e usar o do tema errado deixa a
  caixa ilegível.
- **A caixa se pinta no DOM** (`pintarCaixa`), não em JSX. As telas são HTML portado injetado
  inteiro, então JSX irmão vira vizinho do layout e a caixa vai parar no fim da página, longe do
  formulário. Tela nova que precise de caixa emite um slot `[data-feedback]` no próprio markup.
- **Cor semântica tem um valor por fundo** (`DESIGN.md` §2): nenhum verde passa AA no claro e no
  escuro ao mesmo tempo.

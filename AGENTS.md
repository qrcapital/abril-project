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
- **Copy:** livre no texto, mas com o guia de estilo: **sem travessão**, tom editorial sóbrio, sem hype, números concretos. Vale para UI, e-mails, erros. **BlockTrends é masculino** (decisão do Pedro, 18/ago/2026): sempre "o/do/pelo BlockTrends", e concordância no masculino ("emissor", nunca "emissora").
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
npm run check         # 10 self-checks offline (prova, senha, usuário, liberação, currículo, matrícula, e-mail, certificado, aluno, auditoria)
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
portado, o **calendário de liberação** (a regra pura das políticas da 0016; desde 17/ago a
proteção da janela de arrependimento é AVISO na tela de Liberação, não trava de build — o
check exercita a regra, é detector e não porteiro), as **invariantes do currículo** no banco, o
**estado de acesso** derivado da matrícula e as **regras de borda** de `lib/seguranca.ts` (cadastro
fechado em produção, destino de redirect). Rodam também as âncoras de HTML dos templates, para uma mudança no porte estourar ali
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

## E-mail transacional

Criado em 31/jul/2026, e antes disso **o projeto não mandava e-mail nenhum**. Três arquivos:
`lib/email-render.ts` (puro: variáveis, layout, versão texto), `lib/email.ts` (envio pelo Resend por
HTTP, sem dependência nova, e o registro em `email_log`) e a tabela `email_templates`, editável em
`/admin/emails` com prévia e teste.

- **Assunto, corpo e banner no banco; layout e destino do botão em código.** Mesma divisão do
  currículo: painel edita conteúdo, não código. A URL do CTA vem do gatilho, nunca do editor.
- **Banner sem texto alternativo não sai.** Cliente de e-mail bloqueia imagem por padrão em boa parte
  dos casos, e sem o alt a mensagem abre com uma caixa muda no topo. A medida da arte e os limites de
  peso saem da constante `BANNER` de `lib/email-render.ts`, que é também o que a tela mostra ao lado
  do campo e o que a rota usa para recusar.
- **O bucket `email` do Storage é declarado na migration `0011`**, público e com limite de peso e de
  MIME na própria tabela `storage.buckets`. Público é requisito: cliente de e-mail busca a imagem de
  um proxy do Gmail ou do Outlook, sem sessão, então URL assinada não serve. Upload novo apaga a arte
  anterior **depois** de gravar, e o nome leva carimbo de tempo porque proxy de imagem cacheia.
- **Cada template tem um contrato de variáveis** (`VARIAVEIS`, em `lib/email-render.ts`), e a tela
  recusa ao salvar qualquer `{{campo}}` fora dele. Template novo se registra ali junto com o rótulo e
  o gatilho, senão ele não aparece na tela.
- **`enviarEmail` recebe o cliente do Supabase por parâmetro e nunca lança.** Ela roda dentro do
  webhook de compra aprovada: erro de e-mail que derrubasse o handler viraria reentrega do Guru e
  matrícula duplicada. Toda tentativa vira linha no log, inclusive as falhas e os testes.
- **Os de pagamento não são nossos.** PIX, boleto, cartão recusado e carrinho saem pelo Guru.
- Sem `RESEND_API_KEY` no ambiente, tudo funciona menos a entrega, e o log registra o motivo.

## Certificado

Emissão real desde 31/jul/2026. Antes disso o código era uma constante igual para todos, e a página
pública mostrava o nome escrito nela para qualquer consulta.

- **`lib/certificado.ts` é puro E client-safe.** O `CertificadoClient` importa dele, então nada de
  `node:*` ali: o sorteio usa Web Crypto, que existe nos dois lados. O IO vive em
  `lib/certificados.ts`, com o cliente do Supabase por parâmetro.
- **O alfabeto do código não tem `I`, `O`, `L`, `U`, `0` nem `1`.** O código é ditado por telefone e
  digitado de um PDF; símbolo ambíguo vira "inválido" para um certificado verdadeiro. Mexer no
  alfabeto ou no formato quebra códigos já emitidos e já publicados em perfil de LinkedIn.
- **Emissão na aprovação, nos dois caminhos** (`lib/prova.ts` e `lib/prova-expiradas.ts`), mais o
  resgate na tela. É idempotente, e o índice único de `certificates(user_id)` é quem decide a corrida.
- **A verificação pública usa o cliente anon** e a função `verify_certificate`. Página pública não
  pode depender de sessão, e a service role ali estaria errada por definição.
- **O código entra no markup por marcador `data-cert`**, emitido pelo `port-area.mjs`. Editar o HTML
  gerado não sobrevive ao próximo porte, e o `check:usuario` guarda o marcador.

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

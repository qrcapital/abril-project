# HANDOFF — Estratégia Internacional

**Documento de continuidade do projeto.** Escrito em 25/jul/2026 para transferir o
desenvolvimento da máquina Windows (`C:\Users\pedro\Claude\abril-estrategia-internacional`)
para um MacBook, sem perder contexto.

Se você é o Claude Code rodando no Mac pela primeira vez neste repo: **leia este
documento inteiro antes de tocar em qualquer arquivo.** Ele contém o que os outros
documentos não têm, o estado real, as armadilhas que já custaram horas e as decisões
que não devem ser repropostas.

Ordem de leitura recomendada: este arquivo → `AGENTS.md` → `docs/PRD.md` → `docs/DESIGN.md`.

---

## 1. O projeto em uma tela

**Estratégia Internacional** é uma formação on-demand sobre dolarização de patrimônio,
assinada por **BlockTrends** (chancela técnica) e **VEJA Negócios / Grupo Abril**
(chancela institucional). O produto de software tem duas metades:

| Metade | Rota | Tema | Estado |
|---|---|---|---|
| Landing page de vendas | `/` | claro | funcional, em polimento de copy |
| Área do aluno autenticada | `/app/*` | escuro | funcional, com lacunas (prova, reset de senha) |

Preço: **R$ 397** à vista ou **10x de R$ 39,70** sem juros. O curso **tem turmas**
(nunca escrever "sem turma" em lugar nenhum).

Stack: TypeScript · Next.js 16 (App Router, RSC) · Tailwind v4 · Supabase (Postgres,
Auth, RLS) · Netlify · Panda Video · Amazon SES · checkout Guru.

---

## 2. Estado exato em 29/jul/2026

> **Atualização de 29/jul.** Duas levas entraram depois do que esta seção descrevia. A de
> 28/jul aplicou o schema do Supabase, fechou três furos de privilégio, deixou o motor da
> prova funcional e construiu a recuperação de senha. A de 29/jul fechou a **camada de
> feedback inteira** da área do aluno: os quatro padrões do `DESIGN.md` §3, as telas de
> `loading`/`error`/`not-found` do grupo `(sala)`, o **nome do aluno vindo do servidor** (que
> tornou `/app/conta` e `/app/certificado` dinâmicas), a sessão expirada explicada no login, a
> troca de senha na conta exigindo a senha atual, o indicador progressivo de exigências em três
> telas, o `catch` do download do certificado, o aviso de tempo na prova, a marcação otimista do
> concluir aula e o feedback do sair. Detalhe no `CHANGELOG.md`; a fila que sobrou está no bloco
> "▶ PRÓXIMA SESSÃO" do `PENDENCIAS-LP.md`.
>
> **Mais duas levas entraram depois disso, no mesmo 29/jul, e mudaram arquitetura:**
> a **guarda de acesso por matrícula** (tarefa 14, com `/app/acesso` e quatro estados), o
> **certificado sobrevivendo ao fim do acesso** (grupo de rota próprio, com o porteiro de
> aprovação que nunca existiu), a **liberação gradual do curso** (um módulo por semana a partir
> de `enrollments.inicio_em`, com migração `0002` aplicada), o **progresso saindo do cookie para
> a tabela `progress`**, e o **currículo saindo do código para o banco**. Os dois últimos são os
> que mais mudam o dia a dia: `lib/curso.ts` não guarda mais as aulas, e mexer em conteúdo no
> banco muda a tela sem deploy.
>
> **Três regras novas que economizam tempo de quem chegar agora:** a área do aluno **não é
> escura** (o chrome é, o miolo das telas é claro `#F7F5F2`), então todo padrão visual nasce com
> dois pares de cor; **caixa de mensagem se pinta no DOM**, nunca em JSX irmão do HTML injetado,
> senão vai parar no fim da página; e **cor semântica tem um valor por fundo**, porque nenhum
> verde passa AA nos dois.

- Branch de trabalho: **`homolog`**. Último commit: o desta leva de 29/jul. O `59aed6c` que
  esta seção citava era o estado de 25/jul, antes das duas levas acima.
- `main` existe como tronco de produção futuro e está atrás; ninguém trabalha nele hoje.
- Remoto: `https://github.com/qrcapital/abril-project.git`.
- Ambiente no ar: **https://abril-project.netlify.app** (auto-deploy a cada push em `homolog`).
- Working tree limpa, exceto os arquivos de `referencias/cowork/` que estão fora do git
  de propósito (ver seção 4).

**Atenção ao Netlify:** o site tem a *Production branch* apontada para `homolog`
(arranjo interino da fase de review). Ou seja, o deploy público roda no contexto
`production`, não `homolog`, e o bloco `[context.homolog.environment]` do `netlify.toml`
**não** se aplica a ele. Quando `main` virar produção de verdade, isso precisa ser
reescopado junto com as variáveis de ambiente.

### O que está pronto

**Landing page.** Hero com globo 3D em canvas, corpo docente com logos reais das casas,
currículo de 16 aulas com descrições completas, seção Ferramentas com mockup de
dispositivos, Oferta, "Quem assina" com selo Meridiano e dois cards de chancela, rodapé
alinhado à identidade VEJA Negócios. Revisão de copy feita em hero, docentes, currículo,
Ferramentas e Oferta.

**Área do aluno.** Login e primeiro acesso com Supabase Auth (e-mail + senha), guarda de
sessão no `proxy.ts`, home dinâmica, páginas de aula data-driven com player e materiais,
progresso por usuário, certificado com download em PDF, botão de adicionar ao LinkedIn e
página pública de verificação em `/verificar/:codigo`. Nome, e-mail e prazo de acesso
vêm do usuário logado, não são mais fixos.

### O que falta

Em ordem do que eu atacaria primeiro:

1. ~~**Copy do FAQ e do CTA final.**~~ Dado como finalizado por ora (25/jul): o texto
   atual fica, sem nova varredura; reabrir só se a rodada pré-launch pedir.
2. ~~**Aplicar o schema no Supabase homolog.**~~ **FEITO em 28/jul/2026.** A migration nunca
   tinha rodado e o schema `public` estava vazio, o que bloqueava a prova. Aplicado e
   verificado, mais o backfill de `profiles` e a correção do `revoke` do `sortear_prova()`;
   ver a seção 6.
3. **Prova funcional.** **Motor FEITO em 28/jul/2026**, conteúdo pendente. O sorteio
   balanceado, o snapshot, a persistência em `exams`, a correção em 14 de 20 e o cronômetro
   ancorado no `exams.deadline` estão de pé (`lib/prova.ts`, `lib/prova-correcao.ts`,
   `lib/prova-template.ts`, `app/app/(sala)/prova/actions.ts`; check em
   `npm run check:prova`). O 16/16 é o gate de **aulas** que libera a prova, não a nota.
   **Falta o banco de ~100 questões** (25 por módulo, construção nossa): o motor hoje roda
   sobre as 24 `[EXEMPLO]` do seed, e com um banco desse tamanho dois sorteios repetem 19
   das 20 questões.
4. ~~**Recuperação de senha.**~~ **FEITO e validado com e-mail real em 28/jul/2026.**
   `/app/recuperar-senha`, `/auth/confirm` e `/app/redefinir-senha` de pé; o "Esqueci minha
   senha" do login funciona. O SMTP do Supabase passou a ser o **Resend** (ver
   `AMBIENTES.md`), o template de Reset Password aponta para
   `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery`, e o fluxo foi percorrido de
   ponta a ponta com entrega em caixa de verdade. O mesmo `/auth/confirm` serve o **primeiro
   acesso** com `type=invite`, que é o link do webhook do Guru; falta só editar o template
   **Invite user** no painel, o que não urge. O desenho e o porquê estão na nota de
   implementação do `ROUTES.md`.
5. **Pendências pequenas da LP.** Os links de redes sociais do rodapé seguem `href="#"`,
   esperando as URLs reais. (A nav do rodapé já foi alinhada em 25/jul.)
6. ~~**Migrar o curso para o banco.**~~ **FEITO em 29/jul/2026**, e este item estava errado em
   duas afirmações: a tabela `lessons` **não** estava vazia (o seed já tinha rodado, com 5
   módulos e 17 aulas), e o progresso saiu do cookie no mesmo dia. Hoje o `lib/curso.ts` guarda
   só tipos e lógica; `lib/curriculo.ts` carrega do banco; `progress` guarda a conclusão. Mudar
   conteúdo no banco muda a tela sem deploy, que é o que a tela de conteúdo do admin
   (`PLANO-ADMIN.md` §4.6) vai usar.
7. **Antes de produção:** remover os atalhos de teste da tela de login e trocar o CTA de
   compra pela URL do checkout Guru.

O `docs/PENDENCIAS-LP.md` é o checklist formal, mas estava congelado em 20/jul e já
divergia do real. Foi ressincronizado junto com este handoff.

---

## 3. Como o código é gerado (leia antes de editar a LP)

Esta é a armadilha número um do projeto.

A LP e a área do aluno **não são escritas à mão**. Elas são portadas de bundles do Claude
Design que ficam em `referencias/htmls/` por dois scripts:

- `scripts/port-lp.mjs` → gera `app/_lp/body.html`, `app/_lp/styles.css` e `app/_lp/globo-dados.ts`
- `scripts/port-area.mjs` → gera as telas em `app/app/_ui/screens/`

Os arquivos gerados **são commitados**, o que dá a falsa impressão de que podem ser
editados direto. Podem, mas a edição morre na próxima execução do porte.

> **Regra que não se quebra:** toda mudança estável na LP vai no `scripts/port-lp.mjs`,
> nas etapas numeradas (7d, 7e, ..., 7r). Editar só o `body.html` significa perder a
> mudança quando alguém rodar o port de novo. Isso já aconteceu com uma correção de
> contraste AA que voltou sozinha.

As etapas do port são comentadas em português no próprio script e explicam o porquê de
cada transformação. Ao adicionar uma etapa nova, siga a numeração e escreva o motivo, não
só o efeito.

O port termina com um assert do libuv de vez em quando. A saída continua válida.

---

## 4. O que viaja no git e o que você precisa levar na mão

Esta seção é o motivo deste documento existir. Clonar o repo **não** traz o projeto inteiro.

### Viaja no git (é só clonar)

Todo o código, os documentos de `docs/`, os assets processados em `public/lp/` e
`public/fonts/`, as migrations do Supabase, e os bundles de design em
`referencias/htmls/` (9,5 MB, versionados de propósito porque são a fonte de verdade
visual e os scripts de porte dependem deles).

### Não viaja: você precisa transferir manualmente

**a) `.env.local` com os segredos.** Está no `.gitignore` e deve continuar assim. No Mac,
copie o `.env.example` para `.env.local` e preencha. As cinco chaves em uso hoje:

```
NEXT_PUBLIC_SUPABASE_URL        # https://jbfkkkjxgkmbqujpcgjy.supabase.co (projeto homolog)
NEXT_PUBLIC_SUPABASE_ANON_KEY   # dashboard Supabase > Project Settings > API
SUPABASE_SERVICE_ROLE_KEY       # MESMO LUGAR. Altamente sensível, ignora RLS, nunca no cliente
NEXT_PUBLIC_SITE_URL            # http://localhost:3000 no local
NEXT_PUBLIC_WHATSAPP_URL        # existe, mas é variável MORTA (o link está hardcoded no código)
```

As demais chaves do `.env.example` (Guru, Panda, SES, pixels) ainda não têm valor. A
forma mais segura de levar os segredos é pegá-los de novo no dashboard do Supabase, não
copiar o arquivo por canal inseguro.

**b) `referencias/cowork/` (a parte não versionada).** São cerca de 9 MB de insumos
brutos: logos originais das casas dos docentes, mockups de dispositivos, o PDF do
certificado, o `COPY.md`. Ficaram fora do git de propósito, e um dos arquivos tem marca
d'água da Dreamstime, então **não commite a pasta em bloco**. Transfira por AirDrop, pen
drive ou zip.

A boa notícia: as logos já foram tratadas (fundo removido por luminância com `sharp`,
recoloridas onde precisava) e as versões finais estão em `public/lp/`, que é versionado.
Os brutos só voltam a importar se for preciso reprocessar alguma.

O `COPY.md` era o único item crítico dessa pasta e foi promovido para `docs/COPY.md`
neste handoff, então ele viaja no git agora.

**c) A memória do Claude Code.** Ver seção 8. É o item mais importante e o mais fácil de
esquecer.

### Não viaja e não precisa

O scratchpad da sessão do globo (`shp-parse.mjs`, `terra-gen.mjs`, os shapefiles do
Natural Earth, o `checkpoint-canvas/`) **já foi limpo pelo sistema e não existe mais**,
nem nesta máquina. Se um dia for preciso regenerar a geometria do globo, o caminho é
baixar o `ne_50m_land` do Natural Earth de novo e reescrever os geradores. Os dados de
saída, que são o que a LP consome, estão versionados em `scripts/globo-costa.txt`
(5.155 pontos de litoral, 297 anéis) e `scripts/globo-terra.txt` (2.884 pontos de
interior), então isso só seria necessário para mudar a densidade ou a projeção.

---

## 5. Setup no MacBook, passo a passo

```bash
# 1. Ferramentas (assumindo Homebrew instalado)
brew install git node
node -v          # 22 ou 24; o Netlify builda com 22 (netlify.toml), local roda 24 sem problema
#    O .nvmrc (só "22") é versionado desde 29/jul/2026: com fnm ou nvm, um `fnm use` na raiz
#    já alinha o local com o que o Netlify builda, sem depender de lembrar a versão.

# 2. Clonar (no Mac, o repo ficou em ~/projects/abril-project)
git clone git@github.com:qrcapital/abril-project.git abril-project
cd abril-project
git checkout homolog

# 3. Identidade do git (a mesma usada até aqui, o histórico foi reautorado para ela)
git config user.name  "Pedro Teixeira"
git config user.email "pedrohfontei@gmail.com"

# 4. Dependências
npm install      # resolve os binários darwin de sharp, swc, tailwind-oxide e lightningcss

# 5. Segredos
cp .env.example .env.local
#    preencher as chaves do Supabase (ver seção 4a)

# 6. Rodar
npm run dev      # http://localhost:3000
npm run build    # tem que passar limpo antes de qualquer push
```

**Autenticação no GitHub. RESOLVIDO no Mac (28/jul/2026).** No Windows as credenciais
viviam no Windows Credential Manager. No Mac isso não existe, e os dois caminhos que este
documento mandava escolher já estão montados: chave SSH em `~/.ssh/id_ed25519`
autenticando como `ophteixeira`, remoto já apontado para
`git@github.com:qrcapital/abril-project.git`, e o **GitHub CLI instalado** em
`/usr/local/bin/gh`, logado na mesma conta (scopes `gist`, `read:org`, `repo`). Nada a
fazer aqui.

Atenção às **três identidades**, todas corretas e nenhuma para remover: os commits são
assinados pela config **local do repo** (`Pedro Teixeira <pedrohfontei@gmail.com>`, autor
de todo o histórico), a config **global da máquina** é outra (`ophteixeira`), e quem
empurra para o GitHub é a conta `ophteixeira` da chave SSH.

**Sobre o `package-lock.json`.** O conselho que estava aqui, de que o lock ganharia
entradas `darwin-arm64` e que commitar isso "é esperado e correto", **está errado por
duas razões**. Primeiro, o lock já continha todas as plataformas
(`sharp-darwin-x64`, `swc-darwin-x64`, `oxide-darwin-*`), porque entrada de dependência
opcional cobre todos os alvos e o npm instala apenas o que casa. Segundo, este MacBook é
**Intel (x86_64)**, então o alvo é `-x64` e não `-arm64`.

O que `npm install` faz de verdade aqui é **churn de versão de npm**: ele adiciona
`"dev": true` em pacotes do `sharp` e **remove os campos `libc: ["glibc"]`**, que só
existem a partir do npm 11. O npm que vem com o Node 22 é o 10.9.8 e apaga esse metadado
escrito pela máquina Windows, o que é um downgrade do lock. Nenhum pacote entra ou sai.

**Portanto: não commitar.** Depois de qualquer `npm install`, conferir o `git status`; se
só o `package-lock.json` aparecer modificado, reverter com
`git checkout package-lock.json`. O lock do `HEAD` é o que já vem buildando no Netlify com
o site no ar, e o Netlify roda `NODE_VERSION = "22"`, o mesmo npm 10.9 do local, então
ignora os campos `libc` do mesmo jeito.

**Diferenças de shell.** Todo o histórico deste projeto foi tocado de um Windows com
PowerShell e Git Bash. No Mac o shell é zsh, o que na prática **simplifica**: some a
armadilha do here-string do PowerShell (`@'...'@`) que já vazou um `@` para dentro de uma
mensagem de commit. Ainda assim, prefira múltiplos `-m` a mensagens multilinha.

**Sensibilidade a maiúsculas.** O macOS usa um sistema de arquivos que ignora
maiúsculas por padrão, igual ao Windows, então nada muda aqui. Só não relaxe: o Netlify
builda em Linux, onde `Logo.svg` e `logo.svg` são arquivos diferentes.

---

## 6. Armadilhas que já custaram tempo

**O dev server serve HTML velho.** O `app/page.tsx` lê o `body.html` e o `styles.css` em
runtime, dentro do componente, o que era para resolver o cache. Não resolve sempre: o
Next ainda serve versão antiga em algumas situações. Quando a mudança não aparecer, mate
o processo na porta 3000 e suba o `next dev` de novo. Truque auxiliar: navegar com
`?v=2`, `?v=3` na URL fura o cache do navegador.

**E serve 404 em rota que existe.** Variante da anterior, vista em 29/jul: depois de criar um
`actions.ts` novo dentro de uma pasta de rota, o Turbopack passou a devolver **404** em
`/app/conta` para usuário logado, enquanto o `npm run build` compilava a rota sem reclamar.
Reiniciar o dev server resolveu. Antes de caçar bug em rota que sumiu, reinicie: o sintoma
imita perfeitamente um erro de código.

**JSX irmão do HTML injetado vira vizinho do layout inteiro.** As telas são markup portado
injetado com `dangerouslySetInnerHTML`; um elemento React colocado ao lado desse bloco não fica
ao lado do formulário, fica ao lado da página. Em 29/jul isso pôs a caixa de aviso da
recuperação de senha **350px abaixo do formulário**, centrada entre as duas colunas, e nem
build nem lint enxergam. O conserto é emitir um slot no próprio markup (`[data-feedback]`) e
pintar nele com o `pintarCaixa`. **Valide posicionamento no browser, não por build.**

**Cookie do aluno nunca é fonte de verdade, nem "só para migrar".** Em 29/jul o progresso saiu
do cookie para a tabela `progress`, e no meio do caminho escrevi uma migração que semeava o banco
a partir do cookie na primeira visita, para ninguém perder o que tinha marcado. Testando o
ataque, a prova abriu com cookie forjado e banco vazio: a semente era uma porta para o aluno
**plantar** o dado que eu acabara de tirar das mãos dele. Não existe versão segura disso. Se
precisar de progresso para testar, use `scripts/progresso-conta.mjs`.

**`redirect()` em Server Component sai como 200, não 307.** Com streaming, o começo da resposta
já foi enviado quando o redirect acontece, então o status fica 200 e a navegação vai no payload.
Isso me fez ler "a guarda não disparou" duas vezes no mesmo dia. Confira o **corpo** da resposta,
ou o `location.pathname` no browser, nunca o status.

**Contraste não é erro de sintaxe.** Nenhuma ferramenta do projeto reprova cor ilegível. Ao
escolher qualquer cor de texto, meça nos dois fundos da área (o chrome escuro `#0B2D20` e o
miolo claro `#F7F5F2`): em 29/jul ficou provado que **nenhum verde passa AA nos dois**, e a
regra do par por fundo está no `DESIGN.md` §2.

**Não meça animação pela aba que o Claude dirige.** A aba controlada pela automação roda
oculta, então o `requestAnimationFrame` congela e o timing sai distorcido em até 3,5×.
Animações e efeitos de mouse parecem quebrados quando estão perfeitos. Valide animação
por medição (computed style, evento sintético com rAF sincronizado) ou peça ao Pedro para
olhar ao vivo com a aba dele em foco. Screenshot não serve de prova aqui.

**O globo do hero é canvas, não DOM.** `app/_lp/GloboCanvas.tsx`. A versão antiga
colocava um elemento por ponto dentro de um `preserve-3d` e travava com 3.697 elementos;
o canvas custa o que se pinta. Detalhes que parecem bug e não são: a visibilidade dos
pontos usa `pz > RG²/PERSP` (horizonte aparente) e não `pz > 0`, senão a casca de trás
pisca na borda; o loop para fora da viewport por IntersectionObserver; com
`prefers-reduced-motion` ele desenha um quadro só.

**Ritmo vertical da LP.** São **200px** de respiro quando há virada de fundo entre seções
(claro ↔ verde) e **128px** quando não há. Minha primeira versão aplicou 200px em tudo e
o Pedro corrigiu. Duas exceções legítimas: o hero e a ficha técnica se sobrepõem de
propósito (`margin-top:-44px`), e entre currículo e Ferramentas existe o divisor
decorativo do olho, que soma 303px no total.

**O schema do Supabase homolog está VAZIO (descoberto em 28/jul/2026).** A migration
`supabase/migrations/0001_init.sql` **nunca foi aplicada** ao projeto homolog. Conferido
com a service role, que ignora RLS: `zero` tabelas e `zero` funções em `public`
(`PGRST205` em qualquer leitura, `PGRST202` em qualquer RPC, spec do PostgREST sem nenhuma
rota). O item 5 do checklist de provisionamento do `AMBIENTES.md` é o único que nenhum
documento registra como concluído.

Por que passou meses sem ninguém notar: **a área do aluno não lê nada de `public`**. O
currículo é `lib/curso.ts` estático, o progresso é cookie, o certificado é gerado no
cliente, e o Auth vive no schema `auth`, que funciona normalmente. O único toque em
`public` é o `admin.from("profiles").upsert(...)` do `app/app/login/actions.ts`, e o
retorno dele é descartado, então a falha é engolida em silêncio.

Isso **reinterpreta uma nota antiga deste documento**, que dizia que o trigger
`handle_new_user` não conseguia criar o profile por falta de INSERT policy. Se a migration
nunca rodou, não existe trigger nem tabela `profiles`: mesmo sintoma, causa diferente. O
signup usar a service role continua certo, porque espelha o webhook do Guru, mas não é
pela razão registrada antes.

**RESOLVIDO no mesmo dia.** A migration e o seed foram aplicados por `psql` em 28/jul, e o
estado foi verificado item por item: 10 tabelas, todas com RLS ligada e 12 policies no
total; as 5 funções; seed com 5 módulos, 17 aulas (16 contando para o gate) e as 24
questões `[EXEMPLO]`; `sortear_prova()` devolvendo 20 questões em 5 por módulo. O
PostgREST voltou a enxergar o schema sem precisar recarregar cache.

**Backfill de `profiles` (28/jul).** Havia 8 contas em `auth.users` e nenhuma linha em
`profiles`, porque o trigger só dispara em criação nova e todas as contas nasceram antes do
schema existir. Preenchidas com a mesma lógica do `handle_new_user`, lendo nome e telefone
de `raw_user_meta_data`. Três tinham nome; nenhuma é admin, o que confirma de forma empírica
a pendência do acesso de admin: `is_admin()` existe e nada atribui o papel. Se um dia o
schema for recriado do zero, refazer o backfill, senão as contas antigas ficam sem perfil.

O trigger **vai funcionar** nas próximas contas: é `security definer`, o dono é `postgres` e
`profiles` também pertence a `postgres`, que não é submetido à RLS da própria tabela.

**Supabase, outras particularidades do projeto homolog.** A confirmação de e-mail está
ligada. O PostgREST às vezes reclama de "schema cache" em leituras de `public.*`;
recarregar o cache no dashboard resolve. Não confundir esse aviso com schema realmente
ausente: a diferença se tira com
`select count(*) from pg_tables where schemaname = 'public'`.

**Revogar de `anon`/`authenticated` NÃO fecha uma função (corrigido em 28/jul/2026).** O
`revoke` original do `sortear_prova()` era ineficaz e a função estava chamável pela chave
**anon** via PostgREST. O Postgres concede `EXECUTE` a **PUBLIC** por padrão ao criar
função, e os dois papéis herdam desse grant, então tirar as entradas nomeadas não muda o
resultado. No ACL isso aparece como `=X/postgres`, sem role à esquerda. Um aluno conseguia
enumerar o banco de questões repetindo a chamada, 5 por módulo por vez; a `correta` não
vazava, porque a função não a retorna, mas enunciado e alternativas sim.

O que fecha é `revoke execute on function ... from public`. Já aplicado no homolog e
corrigido na migration, para o `ei-prod` não herdar o buraco. Hoje: `anon` false,
`authenticated` false, `service_role` true, e a chamada anon devolve `42501`.

Ao conferir privilégio de função, usar **`has_function_privilege('anon', oid, 'EXECUTE')`**,
não uma consulta em `information_schema.role_routine_grants` filtrando por nome de role: a
herança de PUBLIC não aparece como linha de grantee, e essa foi exatamente a consulta que
me fez dar o schema por seguro na primeira passada. O `handle_new_user` também é chamável
em teoria, mas não é explorável: o próprio Postgres recusa com "trigger functions can only
be called as triggers". Deixado como está.

---

## 7. Decisões travadas (não repropor)

Estas já foram discutidas e fechadas pelo Pedro. Sugerir de novo é retrabalho.

**Copy e conteúdo.** A calculadora mantém "Simule cenários e decida com números, não com
achismo". O e-book fica genérico ("Ebook exclusivo") porque ainda é placeholder. O curso
tem turmas, então "GARANTIR MINHA VAGA" é válido. Nada de âncora de preço no card (sem
"menos de R$ 25 por aula", sem comparação com spread de remessa); o preço à vista fica
grande e os três selos ficam.

**Copy aprovado que eu questionei e o Pedro mandou manter.** A ficha técnica e o
diagnóstico ficam como estão. Também ficam: o eco de "o Brasil lê" entre o subtítulo e o
card da seção "Quem assina", a pergunta "Preciso já ter conta no exterior?" no FAQ, e o
H2 do CTA final ("Investir no mundo é proteger o que você constrói"). Minhas ressalvas
estão registradas e foram recusadas, o assunto está encerrado.

**Marca.** Nunca usar "Certificação VEJA Negócios": a VEJA é chancela institucional
cossignatária, quem emite é a BlockTrends. A razão social do rodapé da LP é
**Abril Comunicações S.A., CNPJ 44.597.052/0001-62**, porque a LP vai para um subdomínio
da Abril (a razão social "1971 Comunicações e Sistemas LTDA." aparece em documento antigo
e está superada).

**Produto.** A prova são 20 questões sorteadas de um banco de ~100, balanceado em 5 por
módulo, com meta de 5× e piso de 60. O banco inteiro, estrutura e conteúdo, é construção
nossa, não dependência de docente nem de terceiro. Exit-intent ficou fora do corte
inicial. Modo claro na plataforma foi para o backlog, não foi descartado.

**Fim do relógio da prova (decidido em 30/jul/2026).** O cronômetro é **relógio de parede**,
ancorado no `exams.deadline`: fechar a aba por 30 minutos consome 30 minutos da prova, e isso
é intencional — pausar permitiria consultar material. Fechar a aba **não** encerra a
tentativa: o aluno retoma de onde parou dentro do prazo, com as respostas já gravadas
(cada clique em alternativa grava na hora) e a escolha repintada pelo servidor.

No fim do relógio o envio acontece **sempre**, independente de haver navegador aberto — é o
que a rotina `netlify/functions/prova-expiradas.mts` garante; o auto-envio do `QuizClient` é
só o caminho rápido de quem está com a tela aberta. Vale o que foi respondido: se passou
assim, passou; se não, reprovou. Ao voltar, o aluno vai para o resultado.

Descartado explicitamente: auto-enviar **no fechamento da aba**. Além de contrariar a
retomada, `beforeunload`/`visibilitychange` não garantem trabalho assíncrono, e crash,
bateria ou aba morta por memória não disparam nada — seria um envio que falha em silêncio
exatamente nos casos em que importaria, numa prova de tentativa única.

**Escopo do homolog.** Termos, Privacidade, LGPD, VSL, vídeos e materiais reais não
entram no homolog. O rodapé fica com razão social e DPO por enquanto.

---

## 8. A memória do Claude Code (não pule esta parte)

Boa parte do que você acabou de ler existia apenas como memória do Claude Code na máquina
Windows, em `C:\Users\pedro\.claude\projects\C--Windows-System32\memory\`. Essa pasta
**não** está no repo e **não** é sincronizada entre máquinas.

As cinco memórias do projeto Abril foram copiadas para **`docs/memoria-claude/`**, que
viaja no git. O `README.md` de lá explica como reinstalá-las no Mac. Faça isso logo na
primeira sessão: sem elas, o Claude Code no MacBook começa sem saber nada do que foi
decidido, e você vai gastar a sessão inteira recontando história em vez de trabalhar.

Vale notar que há outras memórias na máquina Windows que **não** são deste projeto
(sites i-Educar/Portábilis, Astro, Impeccable). Só as do Abril foram trazidas. Se você
também vai continuar aqueles projetos no Mac, a pasta inteira precisa ser copiada por fora.

---

## 9. Como trabalhar neste projeto

Um resumo do método que se firmou ao longo das sessões:

- **Copy é livre no texto, mas o estilo é fechado.** Sem travessão, tom editorial sóbrio,
  sem hype, números concretos. O checklist anti-slop de `docs/COPY.md` roda no texto
  **final**, não no rascunho. Ele já pegou travessão, construção "não é X, é Y" e regra de
  três depois de eu achar que estava limpo.
- **Onde o HTML de design e o wireframe divergirem, vale o HTML.**
- **Só tokens do Meridiano** (`docs/DESIGN.md`): cores por nome, Playfair nos títulos,
  Montserrat no corpo, teto de radius em 14px, dourado como acento único.
- **Toda mudança relevante entra no `CHANGELOG.md`**, e o que altera a especificação
  (nomes de seção, escopo, regras de produto) entra também no `PRD.md`. Os dois divergem
  em silêncio se não forem atualizados na mesma leva.
- **`npm run build` tem que passar** antes de qualquer push, porque o push publica.

---

_Dúvida sobre algo que não está aqui: `CHANGELOG.md` tem o histórico commit a commit e
`docs/PRD.md` tem a especificação. Se ainda assim faltar, pergunte ao Pedro em vez de
inferir._

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

## 2. Estado exato em 25/jul/2026

- Branch de trabalho: **`homolog`**. Último commit: **`79fa278`** (globo do hero em canvas).
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

1. **Copy do FAQ e do CTA final.** É o que resta da varredura de copy seção a seção da LP.
2. **Prova funcional.** Hoje o card só abre um popup de "bloqueada". Precisa do banco de
   ~100 questões (construção nossa, conteúdo incluído), sorteio de 20 pela função
   `sortear_prova()` e correção com aprovação em 70%, ou seja 14 dos 20 acertos. O
   16/16 é o gate de **aulas** que libera a prova, não a nota.
3. **Recuperação de senha.** `/app/recuperar-senha` e `/app/redefinir-senha` não existem;
   o link "Esqueci minha senha" dá 404.
4. **Pendências pequenas da LP.** Nav do rodapé ainda usa os nomes antigos das seções
   (a topbar já é Professores/Formação/Ferramentas/Idealizadores/FAQ) e os links de redes
   sociais são `href="#"` esperando as URLs reais.
5. **Migrar o curso para o banco.** Hoje ele vive em `lib/curso.ts` e a tabela `lessons`
   está vazia; o progresso é cookie, não linha de tabela.
6. **Antes de produção:** remover os atalhos de teste da tela de login e trocar o CTA de
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

# 2. Clonar
git clone https://github.com/qrcapital/abril-project.git abril-estrategia-internacional
cd abril-estrategia-internacional
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

**Autenticação no GitHub.** No Windows as credenciais viviam no Windows Credential
Manager e `git push` funcionava direto. No Mac isso não existe. Escolha um caminho:
`gh auth login` (instalando o GitHub CLI, que **não** existe hoje nesta máquina) ou uma
chave SSH trocando o remoto para `git@github.com:qrcapital/abril-project.git`. Faça isso
antes do primeiro push, não no meio de um.

**Sobre o `package-lock.json`.** Ele carrega os pacotes opcionais de plataforma
(`@img/sharp-win32-x64`, `@next/swc-win32-*`, `lightningcss-win32-*`). Isso é normal e
não quebra nada: o npm instala só o que casa com a plataforma atual. Depois do primeiro
`npm install` no Mac o lock pode ganhar as entradas `darwin-arm64`; commitar essa
mudança é esperado e correto.

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

**Supabase, particularidades do projeto homolog.** A confirmação de e-mail está ligada. O
trigger `handle_new_user` não consegue criar o profile porque não há INSERT policy, e é
por isso que o signup usa a service role com `email_confirm: true`, espelhando o que o
webhook do Guru vai fazer. O PostgREST às vezes reclama de "schema cache" em leituras de
`public.*`; recarregar o cache no dashboard resolve.

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

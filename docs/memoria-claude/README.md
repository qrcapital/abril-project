# Memória do Claude Code — projeto Abril

Esta pasta é uma **cópia de transporte**. Ela existe porque a memória do Claude Code vive
fora do repositório, na máquina, e não acompanha um `git clone`.

Na máquina Windows de origem, os arquivos moravam em:

```
C:\Users\pedro\.claude\projects\C--Windows-System32\memory\
```

O `C--Windows-System32` do caminho é o *slug* do diretório de onde o Claude Code era
executado (`C:\Windows\System32`). No Mac o slug será outro, derivado do diretório de
trabalho de lá. Por isso o procedimento abaixo descobre o caminho em vez de assumi-lo.

## Como reinstalar no MacBook

**1.** Abra o Claude Code uma vez de dentro do diretório do projeto. Isso cria a pasta do
projeto com o slug correto:

```bash
cd ~/caminho/para/abril-estrategia-internacional
claude
```

**2.** Descubra qual pasta foi criada e copie as memórias para dentro dela:

```bash
ls ~/.claude/projects/                       # identifique a pasta do projeto
SLUG=$(ls -t ~/.claude/projects/ | head -1)  # normalmente a mais recente
mkdir -p ~/.claude/projects/$SLUG/memory
cp docs/memoria-claude/*.md ~/.claude/projects/$SLUG/memory/
rm ~/.claude/projects/$SLUG/memory/README.md # este arquivo não é uma memória
```

**3.** O índice `MEMORY.md` **viaja junto** desde 29/jul/2026, então o `cp` do passo 2 já
o levou. Ele é o arquivo que o Claude carrega no começo de cada sessão; sem ele, as
memórias existem mas não são encontradas. Confira que chegou:

```bash
cat ~/.claude/projects/$SLUG/memory/MEMORY.md
```

Antes ele era um bloco colado à mão aqui neste README, que envelhecia a cada memória nova.
Ao acrescentar uma memória, copie a pasta inteira de volta para `docs/memoria-claude/`:
uma cópia de backup desatualizada engana mais do que a ausência dela.

**4.** Reinicie o Claude Code e confirme que ele reconhece o projeto.

## O que não foi trazido

A máquina Windows tinha outras memórias que **não** são deste projeto: os sites
i-Educar/Portábilis, armadilhas do Astro 5, o `<dialog>` com `position: relative`, a
marca da Portábilis e a instalação do linter **impeccable**. Se você também vai continuar
aqueles trabalhos no Mac, copie a pasta `memory` inteira da máquina antiga por fora do git.

Uma nota sobre o impeccable, que foi usado nesta LP: ele estava instalado em
`C:\Windows\System32\.claude\` com um hook `PostToolUse` ativo. Nada disso viaja. Para
usar no Mac é preciso instalar de novo (`npx impeccable install`) e reconfigurar o hook.
Ele produz falsos positivos recorrentes neste projeto (reclama da Montserrat, que é
mandada pelo `DESIGN.md`, e de triângulos CSS que são ícones de play); classifique como
falso positivo em vez de silenciar sem falar com o Pedro.

## Aviso de validade

Memórias são observações datadas, não estado ao vivo. Cada arquivo tem a data no
frontmatter. Onde uma delas citar arquivo, função ou linha, **verifique no código antes
de afirmar como verdade**. O documento com o retrato mais recente é o `docs/HANDOFF.md`.

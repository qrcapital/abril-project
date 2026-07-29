---
name: ambiente-mac-abril
description: Como o ambiente do Abril está montado no MacBook (Intel): fnm + Node 22, repo em ~/projects/abril-project, identidade local Pedro Teixeira.
metadata:
  type: project
---

O projeto foi transferido da máquina Windows para o MacBook em 25/jul/2026. Estado do
ambiente, que não está no `docs/HANDOFF.md` porque foi decidido depois dele:

- Repo em `~/projects/abril-project` (não `abril-estrategia-internacional`, como o
  HANDOFF sugeria), branch `homolog`, remoto por SSH.
- MacBook **Intel (x86_64)**, não Apple Silicon. Os binários que importam são `-x64`,
  não `-arm64`.
- Node gerenciado por **fnm**, fixado em **22** por um `.nvmrc` na raiz do repo, para
  espelhar o `NODE_VERSION = "22"` do `netlify.toml`. O fnm troca sozinho ao entrar na
  pasta (`--use-on-cd` no `~/.zshrc`). O Node do Homebrew foi removido para não haver
  duas instalações disputando o PATH.
- Identidade git **local do repo**: `Pedro Teixeira <pedrohfontei@gmail.com>`, que é o
  autor dos 28 commits. A identidade global da máquina é outra (`ophteixeira`), então
  nunca remover o config local.
- `referencias/cowork/` recebeu os 25 insumos brutos do pacote de transferência e ganhou
  regra no `.gitignore`. Antes ficava fora do git só por nunca ter sido adicionada, o que
  é frágil num repositório **público** que contém um mockup com marca d'água da
  Dreamstime.

**Why:** o HANDOFF foi escrito antes da migração e descreve o que fazer, não o que foi
feito. Estes são os fatos consumados, e alguns divergem do que ele sugeria.

**How to apply:** conferir `node -v` (deve dar 22.x) antes de acusar bug de build.
Ver [[lock-churn-npm-libc]] para o efeito colateral do `npm install`.

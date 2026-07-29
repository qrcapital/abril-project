---
name: lock-churn-npm-libc
description: No Mac, npm install reescreve o package-lock removendo campos libc; é churn de versão de npm, não adaptação de plataforma. Não commitar.
metadata:
  type: project
---

Rodar `npm install` no MacBook deixa o `package-lock.json` modificado (~25 inserções,
114 remoções). **Não é** o que o `docs/HANDOFF.md` seção 5 previa. Reverter com
`git checkout package-lock.json`.

O diff não adiciona nem remove nenhum pacote. Ele faz duas coisas: adiciona `"dev": true`
em pacotes do `sharp` e **remove os campos `libc: ["glibc"]`**. O campo `libc` só existe a
partir do npm 11; o npm que vem com o Node 22 é o 10.9.8 e apaga esse metadado escrito
pela máquina Windows. É downgrade do lock.

**Why:** o HANDOFF diz que o lock "pode ganhar as entradas darwin-arm64" e que commitar
"é esperado e correto". A premissa está errada: o lock já continha todas as plataformas
(`sharp-darwin-x64`, `swc-darwin-x64`, `oxide-darwin-*`), porque entradas de dependência
opcional cobrem todos os alvos e o npm instala só o que casa. Seguir aquele conselho
commita churn de versão de npm achando que é adaptação de plataforma, e o diff passa a
oscilar entre máquinas.

**How to apply:** depois de qualquer `npm install`, conferir `git status`; se só o
`package-lock.json` aparecer modificado, reverter. O lock do `HEAD` é o que já vem
buildando no Netlify com o site no ar, e o Netlify roda `NODE_VERSION = "22"`, o mesmo
npm 10.9 do local, então ele ignora os campos `libc` do mesmo jeito. Corrigir a seção 5
do HANDOFF quando for atualizá-lo. Ver [[ambiente-mac-abril]].

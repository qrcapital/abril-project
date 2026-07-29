---
name: commit-push-so-com-ordem
description: Nunca commitar nem pushar sem ordem explícita do Pedro; push em homolog publica direto.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6cfa15f0-2ade-445a-b691-618fbc63a8c2
  modified: 2026-07-26T01:37:14.949Z
---

O Pedro pediu (25/jul/2026, sessão do mobile da LP): **não commitar e não pushar sem ele
dar a ordem**. A regra veio depois de um push feito com base na aprovação de um plano que
previa "validação no celular via deploy": aprovação de plano não é autorização de push.

**Why:** a branch `homolog` é a production branch do Netlify, então todo push publica no
ar imediatamente. O Pedro quer ver a mudança (local ou em screenshot) e só então mandar
publicar. Confirmações passadas ("pode pushar") valem para aquele momento, não como
autorização permanente.

**How to apply:** terminar a mudança, rodar porte/build/verificação, deixar a árvore
pronta e PARAR. Informar que está pronto para commit e aguardar a ordem. Vale igual para
commit e para push, cada um com sua ordem, a menos que ele peça os dois de uma vez.
Ver [[projeto-abril-estrategia-internacional]].

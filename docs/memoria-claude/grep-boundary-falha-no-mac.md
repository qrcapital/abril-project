---
name: grep-boundary-falha-no-mac
description: "No MacBook do Pedro, regex com \\b no grep falha EM SILÊNCIO (zero matches, exit limpo) — varredura \"limpa\" com ocorrências vivas; usar classe literal `( |>|^)` em vez de \\b."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dbdd9796-8e59-44d4-9707-2f7eef3ebd7b
  modified: 2026-08-18T16:24:00.043Z
---

Numa varredura de copy no Abril (18/ago/2026), `grep -rniE "(\ba|\bda) blocktrends"` relatou
**zero ocorrências com seis vivas** — inclusive no rodapé de todos os e-mails. O `grep` desta
máquina (aliased para ugrep em alguns contextos, BSD em outros; ver [[ambiente-mac-abril]])
não casa `\b` de forma confiável e **não dá erro**: devolve vazio com exit normal, que parece
"varredura limpa". O Pedro pegou o que escapou olhando a tela de login.

**Why:** resultado vazio de grep é indistinguível de regex quebada; com `\b` a falha não
aparece nem no exit code.

**How to apply:** em varredura que decide algo (copy, segurança, refactor), não usar `\b` —
usar classe explícita tipo `( |>|^)palavra` — e testar o padrão contra UMA ocorrência
conhecida antes de confiar no "não achou nada".

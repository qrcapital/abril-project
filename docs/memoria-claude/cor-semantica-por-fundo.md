---
name: cor-semantica-por-fundo
description: No Abril, cor semântica (verde de sucesso, etc.) tem um valor por fundo; nenhum verde passa AA no claro e no escuro.
metadata:
  node_type: memory
  type: feedback
---

Regra que o Pedro levantou em 29/jul/2026, ao aprovar os quatro padrões de feedback: **o verde
que encaixa no fundo branco não é o que encaixa no verde escuro**. Vale para qualquer cor
semântica, não só o verde. Registrada no `DESIGN.md` §2. Ver [[lp-abril-estado-e-pendencias]].

**Why:** medi os candidatos e não existe meio-termo, nenhum verde passa AA nos dois fundos. O
`#1B7A50` das telas de resultado dá 4,89:1 sobre o claro `#F7F5F2` e despenca para 2,80:1 sobre
o verde `#0B2D20`; o `#3FB07A` faz o inverso, 5,46:1 no escuro e 2,51:1 no claro. Escrever
"verde de sucesso" como um token só reprovaria metade das telas em contraste sem ninguém
perceber, porque a falha é silenciosa: build e lint não veem contraste.

**How to apply:** ao introduzir qualquer cor semântica nova, medir nos DOIS fundos antes de
nomear o token, e nomear por fundo quando divergirem. O par do verde de sucesso é **claro `#1B7A50`, escuro
`#3FB07A`**, este último escolhido pelo Pedro em 29/jul/2026 sobre a minha proposta de
`#5BC48F`: os dois passavam AA, então a decisão foi de tom, e ele quis o mais saturado, mais
próximo da família de verdes do produto. Não repropor o pastel. A área
do aluno tem os dois fundos ao mesmo tempo, o chrome escuro e o miolo claro, então a pergunta
"em qual fundo isto vai aparecer?" precede a escolha da cor. Mesma disciplina dos padrões de
caixa, que nasceram com dois pares por isso.

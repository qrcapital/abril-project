# Tom do notebook (decisão do Marcelo, 07/out/2026)

O notebook é o material complementar de um curso online de R$ 399, não de uma graduação. O leitor é um
investidor pessoa física inteligente, sem formação em economia. O nível do conteúdo continua alto; o que
muda é a linguagem.

## O tom certo

A referência é a abertura da Aula 1: "Pensa rápido comigo. O celular que você está segurando é de uma
empresa americana ou sul-coreana..." Conversa, não artigo.

- Fale com o leitor ("você"), em frases curtas e diretas. Um parágrafo, uma ideia.
- Comece pelo exemplo concreto e só depois nomeie o conceito ("Imagine que você converteu R$ 50 mil...
  Isso tem nome: custo médio").
- Explicação técnica pode e deve existir, seguida do "na prática": o que isso muda na decisão de quem
  pensa em dolarizar parte do patrimônio.
- Tom de revista de negócios bem escrita (VEJA Negócios), nunca de paper.

## O que evitar

- Linguagem acadêmica: nada de "Segundo Swensen (2007)", "Brinson, Hood e Beebower (1986) demonstraram",
  "a literatura", "et al.", anos entre parênteses no corpo do texto, "cabe ressaltar", "nesse sentido",
  "à luz de". Pode citar pessoas quando ajuda ("David Swensen, que cuidou do dinheiro de Yale por 36
  anos, dizia..."), sem ano e sem tom de citação bibliográfica. A fonte fica no campo `fonte` do bloco
  e no bloco `referencias` do fim.
- Fórmulas, sempre que der. Troque por uma frase lógica ("o seu ganho em reais é o ganho do ativo
  somado ao do dólar, e mais um pouquinho, porque um rende sobre o outro") e por um exemplo com números
  redondos. Fórmula só quando for inevitável, e então com a leitura em palavras logo ao lado. No bloco
  `conceito`, o campo `formula` é opcional: na dúvida, tire.
- Siglas e jargão sem tradução (duration, marcação a mercado, IHFA, PTAX, FRN...). Se precisar do
  termo, explique na primeira vez em meia frase.
- Excesso de números no mesmo parágrafo. Escolha o número que conta a história; o resto vai para o
  gráfico, a tabela ou os kpis.
- Rigor de checagem exibido no texto ("conferido na série 3696 do SGS em..."). A checagem continua
  existindo: mora no `fonte` e na `nota` da figura, curta.
- Pílula "Na aula" repetida: `tempo` só no bloco onde o assunto de fato começa na fala, não em todos.
- Travessão ("—" e "–"): proibido.

## Voz institucional (decisão do Marcelo, 08/out/2026)

O notebook é PARTE da aula, não um comentário sobre ela. Tom institucional, em terceira pessoa, como o
material oficial de um curso: o conteúdo fala por si.

- Nada de "o Rodolfo disse", "Felippe lembra", "na aula, o professor fala em...", "Tony explica".
  Escreva o conteúdo diretamente ("O Brasil responde por menos de 2% do PIB mundial..."). O nome do
  professor pode aparecer no máximo na abertura da seção ou num destaque com a frase dele.
- A segunda pessoa ("você") continua valendo para falar com o leitor; o que sai é a narração da aula.

## Números da aula e números das fontes

- Nunca diga que o professor errou, nem "corrija" a fala. Na dúvida, siga a narrativa do professor.
- Quando a fala e a fonte trazem números diferentes, a explicação é que são recortes e fontes
  diferentes ("o peso do Brasil varia entre 1,6% e 2% do PIB mundial, conforme a fonte e o câmbio do
  ano"), apresentada como informação, não como conserto.
- Harmonize os professores entre si: se uma aula fala em 2% e outra em 1,6%, os notebooks contam a mesma
  história (uma faixa, com a razão da diferença), nunca um desmentindo o outro.
- Só ajuste explicitamente quando o erro for grosseiro e prejudicar o aluno (uma conta que não fecha,
  uma data histórica trocada); mesmo assim, sem apontar o dedo: escreva o dado certo e siga.

## Conteúdo técnico sempre amarrado à aula

- Todo dado, conceito ou caso de livro entra para aprofundar o ponto que a aula está fazendo naquele
  momento. Nada de fato solto: antes de inserir, diga em uma frase por que aquilo importa ali e o que
  acrescenta ao argumento da aula. Se não acrescenta, não entra.
- A ordem é a da aula: o ponto da aula, depois o aprofundamento, depois o que muda na prática.

## O que não muda

- Os números conferidos e as fontes (no campo `fonte` e na `nota` das figuras).
- Sem recomendação de percentual de alocação, de ativo específico ou de "melhor hora" para o dólar.
- O eixo do curso: concentração de risco, não decadência do Brasil.

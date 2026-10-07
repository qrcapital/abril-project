# Verbete do glossário como artigo (07/out/2026)

Pedido do Marcelo: "achei as explicações do glossário muito curtas, dá uma engordada". O verbete deixa de
ser uma definição e vira um artigo curto e completo, que o aluno lê de ponta a ponta e sai sabendo do
assunto. Referência de profundidade: os artigos da linha do tempo do site da QR Asset
(`qrasset-site/lib/timelineArticles.js`, cada um com seções "O contexto da época", "Como funcionava",
"Por que foi decisivo"), sem nada de produtos da QR.

## Estrutura de cada verbete (tipo `Verbete` em lib/glossario.ts)

- `resumo`: continua curto (1 a 2 frases, até ~240 caracteres). É o balão do link no notebook.
- `texto`: a abertura, 2 a 3 parágrafos. Começa pelo concreto (uma cena, um número, uma pergunta) e
  entrega a definição clara.
- `secoes`: NOVO. De 3 a 5 seções com intertítulo, 2 a 4 parágrafos cada. Escolha os intertítulos que
  servem ao verbete, por exemplo:
  - "De onde vem" (origem, história, quem inventou, quando mudou)
  - "Como funciona" (o mecanismo, passo a passo, em palavras)
  - "No Brasil e lá fora" (como o mesmo conceito aparece aqui e nos EUA ou no mundo)
  - "Os números" (ordens de grandeza conferidas, com data)
  - "Por que importa para quem investe"
  - "Erros comuns" ou "O que costuma confundir"
  - "Um caso real" (um episódio histórico ou de mercado que ilustra o conceito)
- `exemplo`: uma conta ou situação concreta, números redondos, hipotética marcada como tal.
- `naPratica`: o que muda para quem pensa em dolarizar parte do patrimônio (1 parágrafo bom).
- `relacionados`: 4 a 8 slugs existentes.

Tamanho alvo: 450 a 900 palavras por verbete, somando tudo. Verbetes centrais para o curso (câmbio,
juro real, inflação, diversificação, home bias, ETF, Treasury, Plano Real, dívida pública, bitcoin,
stablecoin, IOF, Lei 14.754 etc.) ficam no alto da faixa; termos periféricos podem ficar perto de 450.

## Tom e regras (as mesmas de docs/TOM-DO-NOTEBOOK.md)

- Conversa inteligente, segunda pessoa, exemplo antes do conceito, frases curtas.
- Sem fórmula quando der; se inevitável, com a leitura em palavras.
- Sem academicismo: nada de "Segundo X (ano)", "a literatura", "et al.". Pessoas podem aparecer quando
  ajudam a contar a história.
- Números e regras atuais só conferidos em fonte primária (BCB, IBGE, Receita, Planalto, Tesouro, CVM,
  Fed, SEC, IRS, S&P, MSCI). Sem conferir, sem número.
- Sem recomendação de percentual, ativo ou "melhor hora". Sem tom político.
- PROIBIDO travessão ("—" e "–").
- Não mexa em `slug`, `termo`, `sigla`, `categoria`, `apelidos` nem `noCurso` (os links do notebook
  dependem deles), salvo erro objetivo.

import type { Verbete } from "@/lib/glossario";

// Verbetes: Carteira e risco, Comportamento. Separados por bloco de categorias em 07/out/2026 para a revisão
// paralela (um agente por arquivo). 47 verbetes.
//
// Verbete como artigo (07/out/2026, docs/GLOSSARIO-ARTIGOS.md): abertura em `texto`, de 3 a 5 `secoes`
// com intertítulo, `exemplo` e `naPratica`. Números conferidos em 07/out/2026: retornos anuais de
// Damodaran (NYU Stern, histretSP, jan/2026, 1928 a 2025), J.P. Morgan (Guide to Retirement 2026),
// S&P Dow Jones Indices (SPIVA EUA e América Latina, fim de 2025), Morningstar (Mind the Gap 2025),
// Cboe (2025 U.S. Equities Year in Review), B3 (boletins mensais de 2025), Moody's (rebaixamento dos EUA,
// 16/mai/2025), CVM (Resolução 30/2021), BCB (liquidação do Banco Master, 18/nov/2025) e os números já
// conferidos nos notebooks das aulas 1 a 4 (BCB SGS, MSCI, Coeurdacier e Rey).
export const VERBETES_CARTEIRA: Verbete[] = [
  {
    slug: "diversificacao",
    termo: "Diversificação",
    categoria: "Carteira e risco",
    apelidos: [
      "diversificar",
      "diversificado",
      "diversificada",
      "diversifica",
      "diversificação internacional",
    ],
    resumo: "Espalhar o dinheiro entre ativos que não sobem e descem todos juntos, para que o tropeço de um não derrube a carteira inteira. Não elimina o risco: troca um risco grande por vários menores.",
    texto: [
      "Imagine que todo o seu dinheiro está numa única empresa. Se ela quebra, você perde tudo. Divida entre 50 empresas de setores diferentes, e a quebra de uma vira um arranhão. Isso é diversificar: espalhar o dinheiro entre coisas que não sobem e descem todas juntas.",
      "O ganho vem justamente de os ativos não andarem em bloco. Quando um tropeça, outro segura. A carteira inteira oscila menos que a média das partes, e o retorno esperado não precisa cair por isso. É a única ideia de finanças que costuma ser chamada de almoço grátis.",
      "Mas há um limite. Diversificar dentro de um país reduz o risco de cada empresa, não o do país. Trocar uma ação brasileira por outra não protege da moeda, dos juros nem das regras de Brasília. Para isso, é preciso ir além da fronteira.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A intuição é velha: não pôr todos os ovos na mesma cesta. Quem transformou a intuição em conta foi Harry Markowitz, um estudante de doutorado que, aos 24 anos, publicou em 1952 um artigo curto chamado Portfolio Selection. Ele mostrou que o risco de uma carteira não é a soma dos riscos de cada ativo. Depende também de como eles se movem uns em relação aos outros.",
          "A ideia rendeu a Markowitz o Nobel de Economia em 1990, dividido com William Sharpe e Merton Miller. Dela saíram quase todas as ferramentas que gestores usam até hoje para montar carteiras, dos fundos de pensão aos ETFs de índice.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Pense em dois ativos que rendem o mesmo em média, mas sobem e descem em momentos diferentes. Sozinho, cada um dá solavancos. Juntos, os solavancos de um preenchem os buracos do outro, e a linha da carteira fica mais lisa. Quanto menor a correlação entre eles, maior o efeito.",
          "O risco de uma ação tem duas camadas. Uma é dela: um contrato perdido, uma fraude, um produto que não vende. Essa camada some quando você tem dezenas de empresas, porque o azar de uma é compensado pela sorte de outra. A outra camada é a do mercado inteiro: recessão, juros, câmbio, política. Essa não some por mais ações do mesmo país que você compre.",
          "Diversificar entre países e moedas ataca justamente essa segunda camada. O que é risco de mercado para quem só investe no Brasil vira risco de uma parte da carteira para quem investe no mundo.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "No fim de 1989, a bolsa japonesa era a maior do mundo, e o índice Nikkei fechou o ano perto de 38.916 pontos. O Japão parecia imbatível. O índice só voltou a esse nível em fevereiro de 2024, 34 anos depois. Um investidor japonês com tudo em casa passou boa parte da vida adulta esperando recuperar o pico.",
          "O ponto não é que o Japão fosse um mau país para investir. É que ninguém sabia, em 1989, qual mercado ia decepcionar nas três décadas seguintes. Diversificar é a resposta honesta para essa ignorância.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Achar que ter muitos produtos é estar diversificado. Cinco fundos que compram as mesmas ações brasileiras e três CDBs de bancos daqui são, na prática, uma aposta só: Brasil, em reais.",
          "Achar que diversificar é trocar uma concentração por outra. Sair de tudo em Brasil para tudo em tecnologia americana não reduz o risco; muda o endereço dele.",
          "E esquecer o que fica fora do extrato. Salário, aposentadoria do INSS e imóvel também são posições, e quase sempre estão no mesmo país da carteira.",
        ],
      },
    ],
    exemplo: "Em 2008, o S&P 500 caiu 37% em dólar, com dividendos, e o dólar subiu 32% contra o real. Para quem mora no Brasil, a bolsa americana medida em reais caiu cerca de 16%, enquanto o Ibovespa perdeu 41%. As bolsas do mundo caíram juntas; o que diversificou foi a moeda.",
    naPratica: "O argumento do curso é de diversificação, não de aposta: diminuir a dependência de uma única economia, moeda e caneta. A bolsa brasileira é perto de 0,5% do índice global de ações mais usado, e o brasileiro costuma ter quase tudo nela. Diversificar começa pelo patrimônio inteiro, incluindo salário, imóvel e aposentadoria, e a fatia em outra moeda é uma decisão de cada um, sem número mágico.",
    relacionados: [
      "correlacao",
      "risco-de-concentracao",
      "risco-sistematico",
      "alocacao-de-ativos",
      "dolarizacao",
      "home-bias",
      "capital-humano",
      "msci-acwi",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "22:12" },
      { modulo: 0, aula: 3, tempo: "23:44" },
      { modulo: 1, aula: 1, tempo: "36:10" },
      { modulo: 1, aula: 2, tempo: "44:09" },
      { modulo: 1, aula: 3, tempo: "32:00" },
    ],
  },
  {
    slug: "correlacao",
    termo: "Correlação",
    categoria: "Carteira e risco",
    apelidos: [
      "correlações",
      "correlacionados",
      "andam juntos",
      "reagiram juntos",
      "caem juntos",
      "caíram juntas",
    ],
    resumo: "Uma medida, de −1 a +1, de quanto dois ativos sobem e descem juntos. Quanto menor, mais um amortece o outro numa carteira.",
    texto: [
      "Dois sorveteiros na mesma praia vendem bem nos mesmos dias de sol: os resultados deles têm correlação alta. Um sorveteiro e um vendedor de guarda-chuva se compensam: num dia de chuva, um vende e o outro não. Uma sociedade entre os dois oscila bem menos que cada negócio sozinho.",
      "Correlação é a medida de quanto duas coisas sobem e descem juntas. Vai de −1 a +1. Perto de +1, andam sempre no mesmo sentido. Perto de zero, uma não diz nada sobre a outra. Perto de −1, quando uma sobe, a outra desce.",
      "É a peça que faz a diversificação funcionar. Juntar ativos de correlação alta não reduz quase nada do risco. Juntar ativos de correlação baixa ou negativa reduz muito.",
    ],
    secoes: [
      {
        titulo: "Como ler o número",
        paragrafos: [
          "Correlação não mede tamanho, mede direção. Duas ações podem ter correlação alta e uma oscilar o dobro da outra. Também não fala de causa: o sorvete e o guarda-chuva não se influenciam, só respondem ao mesmo tempo, o clima.",
          "Na prática, quase todas as ações de um mesmo país têm correlação positiva entre si, porque respondem à mesma economia. Ações de países diferentes costumam ter correlação menor. O dólar e a bolsa, vistos do Brasil, muitas vezes têm correlação negativa: quando o mundo foge do risco, o dólar sobe e a bolsa daqui cai.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "As correlações mudam com o tempo, e costumam subir nas crises, justo quando você mais precisaria que fossem baixas. Em 2008, bolsas do mundo inteiro caíram juntas. Em 1998, o fundo americano Long-Term Capital Management, que tinha dois ganhadores do Nobel entre os sócios, quebrou em parte porque apostas que pareciam independentes passaram a andar juntas na crise russa.",
          "Em 2022, foi a vez da dupla ações e títulos. Durante anos, a renda fixa americana subia quando a bolsa caía. Com a inflação alta e os juros subindo rápido, os dois caíram juntos: o S&P 500 perdeu 18% e o título de 10 anos do Tesouro americano, quase 18%. Uma carteira com 60% em ações e 40% nesses títulos perdeu perto de 18%, o terceiro pior ano dela desde 1928.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "Nos choques brasileiros, câmbio, juros e bolsa costumam reagir juntos porque respondem à mesma causa. Em 1999, 2002, 2015 e 2020, o real caiu, os juros futuros subiram e a bolsa recuou. Para quem tem tudo aqui, isso é uma posição só, ainda que espalhada em vários produtos.",
          "Em março de 2020, por exemplo, o Ibovespa chegou a cair quase pela metade desde o recorde de janeiro, enquanto o dólar saiu de R$ 4,02 no começo do ano para R$ 5,94 em maio. Quem tinha uma parte em dólar viu essa parte subir em reais no pior momento do resto da carteira.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Um ativo que oscila bastante sozinho pode deixar a carteira mais calma, se andar diferente do resto. Por isso olhar cada investimento isolado engana. A pergunta certa é como ele se move junto com tudo o que você já tem.",
          "E como a correlação muda, nenhuma combinação é garantia. O que se busca é reduzir a chance de tudo cair junto, não eliminá-la.",
        ],
      },
    ],
    exemplo: "Hipotético: você tem metade do dinheiro num fundo de ações brasileiras e metade num fundo de bolsa americana sem proteção cambial. Num ano em que o Brasil vai mal e o dólar sobe 20% contra o real, a bolsa daqui cai 15% e a americana fica parada em dólar. Medida em reais, a metade de fora sobe 20%, e a carteira inteira termina com ganho de 2,5%, em vez de perder 15%.",
    naPratica: "O dólar tende a subir quando a economia brasileira vai mal, o que dá a ele uma correlação útil com o resto de um patrimônio em reais: salário, imóvel, CDI e Ibovespa. Não é garantia, e há anos em que tudo cai junto, mas é a razão de a moeda ser, para o brasileiro, metade do benefício de investir lá fora.",
    relacionados: [
      "diversificacao",
      "volatilidade",
      "risco-sistematico",
      "beta",
      "carteira-60-40",
      "crise-de-2008",
      "risco-cambial",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "1:29:44" },
      { modulo: 1, aula: 1, tempo: "34:33" },
      { modulo: 1, aula: 2, tempo: "16:19" },
      { modulo: 1, aula: 3, tempo: "33:25" },
    ],
  },
  {
    slug: "volatilidade",
    termo: "Volatilidade",
    categoria: "Carteira e risco",
    apelidos: [
      "volátil",
      "voláteis",
      "volatilidade anual",
      "oscilação",
      "oscilações",
      "sobe e desce",
      "desvio-padrão",
      "montanha-russa",
    ],
    resumo: "O quanto um preço sobe e desce em torno da média. É a medida mais usada de risco de mercado, normalmente expressa em percentual ao ano.",
    texto: [
      "Dois investimentos rendem 10% ao ano em média. Um entrega 9%, 11%, 10%, 10%. O outro, 30%, −15%, 25%, 0%. Chegam a lugares parecidos, mas o segundo faz a viagem aos solavancos. Isso é volatilidade: o tamanho do sobe e desce em torno da média.",
      "É a medida de risco de mercado mais usada no mundo, quase sempre expressa em percentual ao ano. Tecnicamente, é o desvio-padrão dos retornos, a distância típica entre cada resultado e a média. Ela não diz para que lado o preço vai, só o tamanho do balanço.",
      "Uma regra de bolso ajuda a ler o número. Se uma bolsa rende 10% em média com volatilidade de 20%, em cerca de dois terços dos anos o resultado fica entre −10% e +30%. No terço restante, fica fora dessa faixa, para cima ou para baixo.",
    ],
    secoes: [
      {
        titulo: "Os números",
        paragrafos: [
          "Nos dez anos até agosto de 2026, a bolsa brasileira, medida em dólar pelo índice MSCI Brazil, oscilou 30,8% ao ano. Os emergentes como um todo, 17,5%. O mundo, 14,7%. É quase o dobro da média dos emergentes, como diz a aula.",
          "Nos Estados Unidos, o mercado acompanha um índice próprio de volatilidade, o VIX, criado pela Cboe em 1993 e hoje calculado a partir dos preços de opções do S&P 500. Em dias normais, ele fica entre 12 e 20. O maior fechamento da história foi 82,69, em 16 de março de 2020, no auge do pânico da pandemia; o pico durante um pregão, 89,53, em outubro de 2008.",
        ],
      },
      {
        titulo: "Por que o sobe e desce custa caro",
        paragrafos: [
          "Volatilidade não é só desconforto: ela come o retorno composto. Se você ganha 50% num ano e perde 50% no outro, a média simples é zero, mas o seu dinheiro encolheu 25%. R$ 100 viram R$ 150 e depois R$ 75. Quanto maior o balanço, maior a distância entre a média dos anos e o que de fato sobra no bolso.",
          "O outro custo é comportamental. Quem vende no fundo transforma uma oscilação, que poderia se desfazer, numa perda definitiva. Boa parte da diferença entre o que um fundo rende e o que o investidor dele ganha nasce aí.",
        ],
      },
      {
        titulo: "O que a volatilidade não mostra",
        paragrafos: [
          "Volatilidade baixa não quer dizer risco baixo. Um título pós-fixado quase não oscila e ainda assim carrega risco de crédito. Um imóvel parece estável porque ninguém cota o preço dele todo dia. E uma ação pode ficar parada por anos e despencar num único pregão.",
          "Ela também olha para trás. Mede o que aconteceu num período, e os períodos calmos costumam terminar sem aviso. Por isso vale olhar junto o drawdown, a maior queda do pico ao fundo, que fala da dor de verdade.",
        ],
      },
      {
        titulo: "Na moeda de quem mede",
        paragrafos: [
          "A mesma bolsa tem volatilidades diferentes conforme a moeda em que você mede. Para o brasileiro, a bolsa americana em reais soma dois balanços, o das ações e o do câmbio. Às vezes eles se anulam, como em 2008; às vezes se somam, num ano de bolsa em queda e real forte.",
        ],
      },
    ],
    exemplo: "Hipotético: R$ 100 mil numa carteira com volatilidade de 20% ao ano. Um ano ruim, com o resultado uma volatilidade abaixo da média, algo que acontece mais ou menos um ano em cada seis, pode levar o saldo para perto de R$ 80 mil. Se essa cifra faria você resgatar tudo, o problema não está no investimento, e sim no tamanho da fatia.",
    naPratica: "A volatilidade importa por causa do seu comportamento. A fatia em dólar e em bolsa deve ser a que você consegue ver oscilar, inclusive medida em reais, sem vender. Antes de converter, vale imaginar o pior ano provável dessa fatia e perguntar se você continuaria dormindo.",
    relacionados: [
      "risco-de-mercado",
      "drawdown",
      "indice-de-sharpe",
      "tolerancia-ao-risco",
      "marcacao-a-mercado",
      "msci-brazil",
      "correlacao",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "18:55" },
      { modulo: 0, aula: 3, tempo: "23:44" },
      { modulo: 1, aula: 1, tempo: "35:10" },
      { modulo: 1, aula: 2, tempo: "13:25" },
      { modulo: 1, aula: 3, tempo: "10:46" },
    ],
  },
  {
    slug: "drawdown",
    termo: "Drawdown",
    categoria: "Carteira e risco",
    apelidos: ["maior queda", "do pico ao fundo", "perda do pico ao fundo", "queda máxima"],
    resumo: "A queda de um investimento desde o ponto mais alto até o mais baixo seguinte. Mostra o tamanho do estrago que você teria de aguentar.",
    texto: [
      "Sua carteira chegou a R$ 500 mil, caiu para R$ 350 mil e depois voltou a subir. Do pico ao fundo, a queda foi de 30%. Esse número tem nome: drawdown. É a maior perda que você teria sofrido se tivesse comprado no pico e vendido no fundo.",
      "É uma medida de risco mais intuitiva que a volatilidade, porque fala da dor de verdade. Ninguém perde o sono com um desvio-padrão. Perde com o saldo encolhendo um terço.",
      "O drawdown tem duas dimensões: a profundidade, quanto caiu, e a duração, quanto tempo levou para voltar ao pico. As duas importam, porque a segunda é a que testa a paciência.",
    ],
    secoes: [
      {
        titulo: "A aritmética cruel",
        paragrafos: [
          "Perdas e ganhos não são simétricos. Para recuperar uma queda de 20%, basta subir 25%. Para recuperar 50%, é preciso subir 100%. Para recuperar 75%, 300%. Quanto mais fundo o buraco, mais tempo para sair dele, mesmo com o mercado andando bem.",
          "Por isso evitar as quedas mais fundas pesa tanto no resultado de longo prazo. Uma carteira que cai menos nos anos ruins não precisa subir tanto nos bons para chegar ao mesmo lugar.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Desde 1987, a maior queda do MSCI Brazil, medida em dólar, foi de 75,8%. A do MSCI Emerging Markets, de 65,1%. A do MSCI ACWI, o índice das bolsas do mundo, de 58,1%. Até a carteira global, a mais diversificada que existe, já perdeu mais da metade do valor.",
          "Nos Estados Unidos, o S&P 500 caiu cerca de 57% entre outubro de 2007 e março de 2009, e só voltou ao pico anterior em 2013. O Nasdaq perdeu perto de 78% entre março de 2000 e outubro de 2002 e levou até 2015 para recuperar o topo. No Japão, o Nikkei levou 34 anos, de 1989 a 2024.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em fevereiro de 2020, o S&P 500 estava no recorde. Em pouco mais de um mês, caiu cerca de 34%, a queda mais rápida dessa profundidade da história do índice. Em agosto, já estava de volta ao pico. Quem vendeu em março, para esperar passar, transformou um drawdown de seis meses numa perda definitiva.",
          "O exemplo mostra o outro lado: nem todo drawdown fundo é longo. Mas ninguém sabe, no meio da queda, se ela vai durar seis meses ou quinze anos.",
        ],
      },
      {
        titulo: "Como usar a medida",
        paragrafos: [
          "Olhe o pior drawdown histórico de qualquer investimento que você considera, na moeda em que você mede o seu patrimônio. E lembre que o histórico mostra o pior até agora, não o pior possível.",
        ],
      },
    ],
    exemplo: "Hipotético: você põe R$ 200 mil numa carteira de ações globais. Se ela repetir a maior queda do MSCI ACWI, de 58%, o saldo vai a R$ 84 mil antes de voltar. Para retornar aos R$ 200 mil, ela precisa então subir 138%. Se essa travessia faria você vender no caminho, a fatia está grande demais para o seu estômago.",
    naPratica: "Antes de definir quanto pôr em bolsa, aqui ou lá fora, aplique o pior drawdown histórico ao seu patrimônio, em reais. Lembre que o câmbio pode amortecer, como em 2008, ou agravar a queda. A fatia certa é a que você consegue atravessar inteira sem vender, porque é na volta que o investimento paga.",
    relacionados: [
      "volatilidade",
      "bull-e-bear-market",
      "tolerancia-ao-risco",
      "aversao-a-perda",
      "msci-acwi",
      "crise-de-2008",
      "pandemia-de-2020",
      "market-timing",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "20:29" },
      { modulo: 1, aula: 3, tempo: "10:46" },
    ],
  },
  {
    slug: "risco-de-mercado",
    termo: "Risco de mercado",
    categoria: "Carteira e risco",
    apelidos: ["riscos de mercado"],
    resumo: "O risco de o preço de um ativo cair por movimentos do mercado: bolsa, juros, câmbio, commodities. É a oscilação que você vê no extrato.",
    texto: [
      "Você comprou um título prefixado do Tesouro e, um mês depois, o extrato mostra que ele vale menos. Ninguém deu calote. Os juros do mercado subiram, e um título que paga a taxa antiga ficou menos atraente. Isso é risco de mercado: a chance de o preço cair por movimentos do mercado.",
      "Ele está em ações, em títulos, em moedas, em commodities, em imóveis. O preço de cada um sobe e desce todo dia por notícias, juros e humor dos investidores. Enquanto você não vende, a perda é de papel. Se precisar vender num dia ruim, ela vira realidade.",
      "É diferente do risco de crédito, a chance de quem emitiu um título não pagar. Os dois convivem. Um título longo de uma empresa tem os dois. Um pós-fixado brasileiro quase não tem o primeiro e tem o segundo.",
    ],
    secoes: [
      {
        titulo: "De onde ele vem",
        paragrafos: [
          "O mercado costuma dividir esse risco em quatro fontes. A bolsa, quando as ações caem juntas. Os juros, que mexem no preço de todo título com taxa fixa. O câmbio, que muda o valor em reais de tudo o que está em outra moeda. E as commodities, como petróleo e minério, que pesam muito na bolsa brasileira.",
          "Quanto mais longo o título, mais ele sente os juros. Um prefixado de dez anos comprado a 4% ao ano passa a valer cerca de 9% menos se os juros do mercado subirem para 5%. O mesmo movimento quase não mexe num título que vence daqui a três meses.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2022, o título de 10 anos do Tesouro americano, que muita gente trata como o ativo mais seguro do mundo, perdeu quase 18%. Não houve calote nenhum. Foi puro risco de mercado: o Fed subiu os juros muito rápido para conter a inflação, e o preço dos títulos antigos caiu.",
          "No mesmo ano, o S&P 500 perdeu 18%. Ações e títulos caíram juntos, o que quebrou a ideia de que um sempre protege o outro.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Aqui, boa parte da renda fixa é pós-fixada, presa ao CDI, e quase não oscila. Por isso o brasileiro se acostumou a achar que renda fixa não balança. O Tesouro Direto mostra o sobe e desce dos prefixados e dos atrelados à inflação todos os dias, mas o CDB levado ao vencimento aparece no extrato como se nada tivesse mudado.",
          "Lá fora, quase toda renda fixa tem taxa fixa e oscila. O americano vê o preço dos títulos mudar no extrato e se acostumou a isso. Quem leva dinheiro para fora encontra o risco de mercado em quase tudo, inclusive no câmbio de volta para reais.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Risco de mercado não é sinônimo de prejuízo. É a variação, para os dois lados. O mesmo movimento de juros que derruba um prefixado quando a taxa sobe valoriza o título quando ela cai.",
          "E não dá para zerá-lo sem abrir mão de retorno. O retorno extra que as ações pagam no longo prazo existe porque elas oscilam. O que se escolhe é quanto dele carregar, e em que moedas.",
        ],
      },
    ],
    exemplo: "Em 2022, o título de 10 anos do Tesouro americano perdeu quase 18% e o S&P 500, 18%, enquanto o CDI rendeu 12,38% no Brasil sem nenhum mês negativo. Os números medem só a oscilação: o CDI não mostra o risco de crédito de quem emite o título, e o Treasury não mostra que, levado até o vencimento, paga exatamente o combinado.",
    naPratica: "A palavra risco mistura coisas diferentes. O erro, diz Rodolfo, é comparar 15% com 4% como se os dois números medissem a mesma coisa. Não existe aplicação sem risco; existe a escolha de qual risco carregar, e em que dose. Ao dolarizar, você troca uma parte do risco de crédito e de moeda do Brasil por risco de mercado em outra moeda.",
    relacionados: [
      "risco-de-credito",
      "volatilidade",
      "marcacao-a-mercado",
      "risco-sistematico",
      "duration",
      "prefixado",
      "risco-cambial",
      "treasury",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "23:44" },
      { modulo: 1, aula: 1, tempo: "37:35" },
    ],
  },
  {
    slug: "risco-de-credito",
    termo: "Risco de crédito",
    categoria: "Carteira e risco",
    apelidos: ["riscos de crédito", "risco do emissor", "risco de calote"],
    resumo: "A chance de quem emitiu um título não pagar, ou de o mercado passar a duvidar e derrubar o preço do papel. Existe até na aplicação mais estável.",
    texto: [
      "Quando você compra um CDB, empresta dinheiro ao banco. Quando compra um título público, empresta ao governo. Quando compra uma debênture, empresta a uma empresa. Em todos os casos, existe a chance de o dinheiro não voltar inteiro ou não voltar na data. É o risco de crédito.",
      "Ele aparece de duas formas. A óbvia é o calote, quando o devedor deixa de pagar. A menos óbvia é a desconfiança: se o mercado passa a achar o emissor mais arriscado, o preço do título cai mesmo sem calote, e a taxa extra que ele precisa pagar, o spread de crédito, sobe.",
      "Existe até na aplicação mais estável. O pós-fixado brasileiro quase não oscila, mas depende de quem o emitiu continuar pagando.",
    ],
    secoes: [
      {
        titulo: "Como se mede",
        paragrafos: [
          "A régua mais conhecida é o rating, a nota dada por agências como S&P, Moody's e Fitch. Vai do triplo A, o devedor mais confiável, até o D, de calote. Abaixo de uma certa linha, o título deixa de ser grau de investimento e vira especulativo.",
          "A outra régua é o próprio mercado. Quanto mais arriscado o devedor, mais juros ele paga acima de um título considerado seguro. Quando essa diferença dispara, é sinal de que o mercado está com medo.",
        ],
      },
      {
        titulo: "A proteção do FGC e os limites dela",
        paragrafos: [
          "No Brasil, o Fundo Garantidor de Créditos cobre depósitos e títulos como CDB, LCI e LCA até R$ 250 mil por CPF em cada instituição, com teto de R$ 1 milhão a cada quatro anos. Acima disso, o investidor vira credor na massa falida e espera.",
          "O caso mais recente mostra que isso não é teoria. Em 18 de novembro de 2025, o Banco Central decretou a liquidação do Banco Master, que vendia CDBs com taxas bem acima da média. Foi o maior acionamento da história do FGC. Quem tinha até o limite recebeu; quem tinha mais entrou na fila. A taxa alta era o preço do risco.",
          "Títulos do governo não têm FGC. A garantia é o próprio Tesouro, que pode, no limite, emitir moeda para pagar em reais. Daí outro risco: receber em dia, mas em moeda que vale menos.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O Brasil ganhou o grau de investimento da S&P em 2008 e perdeu em 2015. Os Estados Unidos, ao contrário, foram por décadas o devedor de referência do mundo. Mesmo eles perderam a nota máxima nas três grandes agências: na S&P em 2011, na Fitch em 2023 e na Moody's em 16 de maio de 2025, a última que ainda dava triplo A.",
          "Na prática, o título americano de curto prazo segue como o ativo de menor risco de crédito que existe para quem pensa em dólar. Mas o rebaixamento lembra que nenhum devedor está acima da conta.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Olhar só a taxa. Um CDB que paga muito acima do CDI paga isso por um motivo. Somar vários CDBs de bancos pequenos para ficar dentro do FGC ajuda, mas não elimina o risco de o fundo levar meses para pagar.",
          "E achar que diversificar entre emissores brasileiros resolve tudo. Bancos, empresas e governo daqui dependem do mesmo país e da mesma moeda.",
        ],
      },
    ],
    exemplo: "O CDI rendeu 12,38% em 2008 e, por coincidência, também em 2022, sem nenhum ano negativo em décadas. Esse número simplesmente não mostra o outro risco. Hipotético: quem tinha R$ 400 mil em CDBs de um único banco liquidado recebe R$ 250 mil do FGC e espera a massa falida pelo resto, sem saber quanto nem quando.",
    naPratica: "Toda a renda fixa brasileira, por mais espalhada entre emissores, depende em última instância do crédito do país e do valor do real. Ter títulos de outros governos e empresas, em outra moeda, espalha esse risco. Lá fora, a lógica é a mesma: título do Tesouro americano, título de empresa e fundo de renda fixa têm riscos de crédito bem diferentes, e taxa alta continua sendo aviso.",
    relacionados: [
      "risco-de-mercado",
      "spread-de-credito",
      "rating",
      "default",
      "cdb",
      "risco-pais",
      "fgc",
      "grau-de-investimento",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "23:44" },
      { modulo: 1, aula: 1, tempo: "24:32" },
      { modulo: 1, aula: 2, tempo: "1:04" },
    ],
  },
  {
    slug: "risco-sistematico",
    termo: "Risco sistemático",
    categoria: "Carteira e risco",
    apelidos: [
      "risco não diversificável",
      "risco específico",
      "risco diversificável",
      "risco da empresa",
      "risco do setor",
      "risco de mercado como um todo",
    ],
    resumo: "A parte do risco que afeta todo um mercado e não some por mais ações dele que você tenha. O oposto é o risco específico, de cada empresa, que a diversificação elimina.",
    texto: [
      "Se uma empresa perde um grande contrato, só ela sofre. Uma carteira com 40 empresas quase não sente. Se o país entra em recessão, todas sofrem juntas, e ter 40 em vez de 4 não ajuda muito. A primeira parte é risco específico. A segunda é risco sistemático.",
      "Risco sistemático é a parte do risco que afeta um mercado inteiro e que não some por mais ativos daquele mercado que você tenha: juros, câmbio, recessão, inflação, mudanças de regra. O risco específico, de cada empresa, se dilui com a diversificação. O sistemático, não.",
      "A sutileza é que sistemático depende de qual mercado é o seu universo. O que é inevitável para quem só investe no Brasil pode ser diversificável para quem investe no mundo.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A distinção ganhou força nos anos 1960, com o modelo que William Sharpe e outros economistas construíram a partir das ideias de Markowitz. A conclusão era elegante: se qualquer investidor elimina o risco específico de graça, só diversificando, o mercado não paga prêmio por ele. Só paga por carregar o risco que não dá para diluir.",
          "Daí vem o beta, a medida de quanto uma ação acompanha o mercado. Uma ação de beta alto carrega mais risco sistemático e, na teoria, deveria render mais no longo prazo.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Monte uma carteira com uma ação e vá acrescentando outras, de setores diferentes. O sobe e desce cai rápido nas primeiras dezenas de empresas e depois quase para de cair. O que sobra é o piso: o risco do próprio mercado.",
          "Para baixar esse piso, não adianta mais ações do mesmo país. É preciso mudar de mercado, de moeda ou de classe de ativo, juntando coisas que respondem a forças diferentes.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "Em 18 de maio de 2017, o dia que o mercado apelidou de Joesley Day, a divulgação de uma gravação envolvendo o presidente fez a bolsa brasileira cair quase 9% num único pregão, com o circuit breaker acionado, e o dólar subir perto de 9%. Nenhuma diversificação dentro do Ibovespa protegeu ninguém naquele dia.",
          "A greve dos caminhoneiros de 2018, as intervenções em preços de combustíveis, as mudanças de imposto e as decisões de um regulador atingem ao mesmo tempo ações, títulos, câmbio e imóveis do mesmo país. São riscos de jurisdição: não estão numa empresa, estão no endereço.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Investir no mundo não elimina o risco sistemático. Existe um risco sistemático global, aquele que derrubou todas as bolsas em 2008 e em março de 2020. O que a diversificação internacional faz é trocar o risco de um país pelo risco do mundo, que costuma ser menor e mais espalhado.",
          "Também não é verdade que risco sistemático seja sempre ruim. Ele é a fonte do retorno extra das ações. A pergunta é de quantos países e moedas você quer que esse risco venha.",
        ],
      },
    ],
    exemplo: "Hipotético: uma carteira com 30 ações brasileiras de setores diferentes já diluiu boa parte do risco de cada empresa. Num dia de choque político, as 30 caem juntas, e a carteira perde quase o mesmo que o índice. Uma carteira com metade disso em ações de outros países, sem proteção cambial, sente o choque pela metade, e a parte de fora ainda tende a subir em reais se o dólar disparar.",
    naPratica: "É o centro do argumento do curso. O risco que a carteira brasileira não consegue diluir sozinha, de moeda, de regra e de economia, vira diversificável quando você inclui outras jurisdições. Não é preciso apostar contra o Brasil para fazer isso, só reconhecer que todo patrimônio num país só carrega o risco sistemático desse país inteiro.",
    relacionados: [
      "diversificacao",
      "beta",
      "risco-de-concentracao",
      "correlacao",
      "risco-pais",
      "joesley-day",
      "jurisdicao",
      "premio-de-risco",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "22:12" },
    ],
  },
  {
    slug: "risco-de-concentracao",
    termo: "Risco de concentração",
    categoria: "Carteira e risco",
    apelidos: [
      "concentração de risco",
      "aposta concentrada",
      "concentração",
      "concentrado",
      "concentrada",
      "concentrar",
    ],
    resumo: "O risco de ter uma parte grande do patrimônio dependendo de uma única coisa: uma empresa, um setor, um país ou uma moeda. É o eixo do curso.",
    texto: [
      "Salário em reais, aposentadoria do INSS, imóvel no Brasil, investimentos na B3 e no CDI. Tudo depende da mesma economia, da mesma moeda e das mesmas decisões de Brasília. Quando o país vai mal, tudo vai mal ao mesmo tempo. Isso é risco de concentração.",
      "É o risco de ter uma parte grande do patrimônio dependendo de uma única coisa: uma empresa, um setor, um país ou uma moeda. Não aparece num extrato, porque cada produto parece seguro sozinho. Aparece quando a única coisa da qual tudo depende tropeça.",
      "Não é uma aposta contra o Brasil. É reconhecer que deixar 100% numa moeda e numa economia já é uma aposta, e quase ninguém a faz de propósito.",
    ],
    secoes: [
      {
        titulo: "Como ele se esconde",
        paragrafos: [
          "A concentração raramente é uma escolha. Ela se acumula. O salário é em reais porque você mora aqui. O imóvel é aqui porque a família está aqui. A carteira fica aqui porque é o que você conhece e o que o gerente oferece. Cada decisão faz sentido sozinha, e juntas formam uma aposta única.",
          "Ela também se esconde atrás da variedade. Dez fundos, três bancos e cinco ações dão a sensação de diversificação. Se todos dependem do mesmo país e da mesma moeda, a variedade é de rótulo, não de risco.",
        ],
      },
      {
        titulo: "Casos reais",
        paragrafos: [
          "Quando o Lehman Brothers quebrou, em 2008, os funcionários tinham cerca de 30% das ações do banco e perderam perto de US$ 10 bilhões. Emprego e poupança estavam no mesmo lugar e sumiram no mesmo dia. Sete anos antes, os funcionários da Enron tinham passado pelo mesmo, com boa parte da previdência aplicada em ações da própria empresa.",
          "No Brasil, em janeiro de 2023, as ações da Americanas perderam mais de três quartos do valor num único pregão depois do anúncio de um rombo contábil bilionário. Quem tinha uma fatia pequena do patrimônio ali levou um susto. Quem tinha quase tudo, levou um golpe.",
        ],
      },
      {
        titulo: "Também vale do outro lado",
        paragrafos: [
          "Trocar uma concentração por outra não é diversificar. Pôr tudo em tecnologia americana, ou numa única ação famosa, ou numa única criptomoeda, só muda o endereço do risco.",
          "Até o índice americano está concentrado: as dez maiores empresas eram 38% do MSCI USA em setembro de 2026, quase todas de tecnologia. Em março de 2000, 87% do Nasdaq 100 estava em tecnologia e comunicações, e o índice caiu 64% nos 21 meses seguintes.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O risco de concentração é o eixo deste curso, e a pergunta que ele faz é simples: se a única coisa da qual o seu patrimônio depende der errado, quanto sobra? Para a maioria dos brasileiros, a resposta honesta é quase nada, porque o capital humano, a casa e a carteira estão no mesmo cesto.",
        ],
      },
    ],
    exemplo: "Hipotético: um engenheiro de 40 anos trabalha numa grande empresa de energia, recebe parte do bônus em ações dela, tem um apartamento financiado em São Paulo e o resto do dinheiro em CDB e fundos de ações brasileiras. Um escândalo na empresa, somado a uma crise no país, pode atingir emprego, bônus, carteira e valor do imóvel no mesmo ano.",
    naPratica: "O eixo do curso é concentração de risco, não decadência do Brasil. A pergunta não é se o Brasil vai dar certo, e sim quanto do seu futuro você quer amarrado a uma única moeda e a uma única caneta. Uma parte em outra moeda e em outros mercados reduz essa dependência, e a dose é decisão de cada um.",
    relacionados: [
      "diversificacao",
      "capital-humano",
      "home-bias",
      "risco-sistematico",
      "dolarizacao",
      "bolha",
      "jurisdicao",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "0:19" },
      { modulo: 0, aula: 4, tempo: "26:46" },
      { modulo: 1, aula: 3, tempo: "3:14" },
    ],
  },
  {
    slug: "beta",
    termo: "Beta",
    categoria: "Carteira e risco",
    apelidos: ["beta de mercado"],
    resumo: "Quanto uma ação costuma se mover quando o mercado se move. Beta 1 acompanha o índice; acima de 1, amplifica; abaixo de 1, amortece.",
    texto: [
      "Se a bolsa sobe 10% e uma ação costuma subir 15%, o beta dela é 1,5. Se uma empresa de energia elétrica sobe 5% quando a bolsa sobe 10%, o beta dela fica perto de 0,5. Beta é isso: quanto uma ação costuma se mover quando o mercado se move.",
      "Beta 1 quer dizer que a ação acompanha o índice. Acima de 1, amplifica os movimentos, para cima e para baixo. Abaixo de 1, amortece. Beta negativo, raro, quer dizer que o ativo tende a ir na direção oposta.",
      "O beta mede só o risco sistemático, a parte que vem do mercado. Uma ação pode oscilar muito por motivos próprios e ainda assim ter beta baixo.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O beta é a peça central do modelo de precificação de ativos que William Sharpe e outros economistas desenvolveram nos anos 1960. A lógica: se o risco de cada empresa se elimina diversificando, o investidor só deveria ser pago pela parte que sobra, a exposição ao mercado. O beta mede essa exposição.",
          "Na teoria, uma ação de beta 1,5 deveria render, no longo prazo, uma vez e meia o retorno extra do mercado. Na prática, a relação entre beta e retorno é bem mais fraca do que o modelo prevê, e os economistas discutem isso até hoje.",
        ],
      },
      {
        titulo: "Como se calcula",
        paragrafos: [
          "Pega-se o histórico de retornos da ação e do índice, normalmente de dois a cinco anos, e mede-se quanto da variação da ação acompanha a do índice. Em palavras: é a correlação entre os dois multiplicada pela razão entre a oscilação da ação e a do mercado.",
          "Por isso o beta muda com o período e com a régua. O mesmo número calculado em anos calmos e em anos de crise pode ser bem diferente.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "O beta depende do índice de comparação. Uma ação brasileira pode ter beta alto contra o Ibovespa e beta baixo contra um índice global, porque o Brasil inteiro anda de um jeito próprio. Uma exportadora pode subir quando o real cai e a bolsa daqui sofre.",
          "Beta baixo também não é sinônimo de segurança. Uma ação de beta 0,6 pode cair 80% por um problema da própria empresa, que o beta não captura.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Para quem compra um índice inteiro por um ETF, o beta é 1 por definição: você recebe o mercado, nem mais nem menos. Para quem monta uma carteira com ativos de vários países, o beta de cada pedaço contra o resto da carteira diz quanto ele ajuda ou atrapalha a diversificação.",
        ],
      },
    ],
    exemplo: "Hipotético: numa queda de 20% da bolsa, uma ação de beta 1,3 tende a cair perto de 26%, e uma de beta 0,6, perto de 12%. Numa alta de 20%, a primeira tende a subir perto de 26% e a segunda, perto de 12%. Tendência, não regra: num dia específico, qualquer uma pode fazer o oposto.",
    naPratica: "O beta depende da régua, e a régua de quem mora no Brasil é o patrimônio em reais. Para quem diversifica entre países, o que importa é como cada pedaço se move contra a carteira inteira. Uma bolsa estrangeira medida em reais pode ter beta baixo ou até negativo contra o resto de um patrimônio brasileiro, porque o câmbio tende a compensar as quedas daqui.",
    relacionados: [
      "risco-sistematico",
      "alfa",
      "correlacao",
      "volatilidade",
      "indice-de-mercado",
      "gestao-passiva",
    ],
  },
  {
    slug: "alfa",
    termo: "Alfa",
    categoria: "Carteira e risco",
    apelidos: ["alpha", "gerar alfa"],
    resumo: "O retorno acima do que o risco assumido justificaria. É o que um gestor ativo promete entregar, e o que, depois dos custos, poucos entregam de forma consistente.",
    texto: [
      "Um fundo de ações rendeu 12% num ano em que o índice rendeu 10%. Parece que o gestor ganhou do mercado por 2 pontos. Mas, se o fundo tinha ações mais arriscadas que o índice, era de esperar que ganhasse mais numa alta. O que sobra depois de descontar esse risco extra é o alfa.",
      "Alfa é o retorno acima do que o risco assumido justificaria. É o que um gestor ativo promete entregar e o motivo de cobrar taxa de administração e de performance. É também a coisa mais rara e mais difícil de prever em finanças.",
      "O nome vem de uma letra da equação: o beta mede quanto você ganha por acompanhar o mercado; o alfa, quanto você ganha além disso.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1968, o economista Michael Jensen olhou para 115 fundos de ações americanos entre 1945 e 1964 e perguntou se eles ganhavam do mercado depois de ajustar pelo risco. A resposta foi não: em média, depois dos custos, ficavam atrás. Nem os melhores mostravam sinais claros de habilidade que se repetisse.",
          "O estudo deu nome ao alfa de Jensen e abriu uma discussão que levou, anos depois, à criação dos fundos de índice, que desistem de buscar alfa e entregam o mercado barato.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "A S&P Dow Jones Indices publica todo semestre um placar chamado SPIVA. Nos 15 anos até o fim de 2025, 89,9% dos fundos ativos de ações de grandes empresas americanas renderam menos que o S&P 500. Só em 2025, 79% perderam.",
          "No Brasil, o placar é parecido. Nos dez anos até 2025, 90,8% dos fundos ativos de ações brasileiras ficaram atrás do índice de referência, e 80,5% dos fundos focados em grandes empresas também.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Ganhar do índice não é a mesma coisa que ter alfa. Um fundo pode ganhar só por ter mais risco, ou por estar concentrado no setor que subiu naquele ano. Alfa é o que sobra depois desse ajuste.",
          "E alfa passado não garante alfa futuro. Fundos que se destacaram num período frequentemente ficam na média ou abaixo dela no seguinte. Parte do que parecia talento era sorte, e é muito difícil separar as duas coisas com poucos anos de dados.",
          "Por fim, o alfa precisa sobreviver aos custos. Uma taxa de 2% ao ano mais 20% do que passar do índice consome boa parte de qualquer habilidade.",
        ],
      },
    ],
    exemplo: "Hipotético: o índice rende 10% e um fundo com beta 1,2 rende 12%. Com juro sem risco de 6%, o risco do fundo justificaria perto de 10,8%: os 6% do juro mais 1,2 vez os 4 pontos que o índice rendeu acima dele. O alfa é de perto de 1,2 ponto, antes de checar se foi sorte, e antes de saber se vai se repetir.",
    naPratica: "Pagar caro por alfa é apostar que o gestor vai repetir o que fez. Para a parte da carteira que busca só a exposição a um mercado, como a bolsa americana ou global para quem quer dolarizar, alfa não é necessário: um ETF de índice entrega o beta barato. Se quiser gestão ativa, compare o resultado com o índice certo, na mesma moeda e depois de todas as taxas.",
    relacionados: [
      "beta",
      "gestao-ativa",
      "gestao-passiva",
      "indice-de-sharpe",
      "taxa-de-performance",
      "etf",
      "taxa-de-administracao",
    ],
  },
  {
    slug: "premio-de-risco",
    termo: "Prêmio de risco",
    categoria: "Carteira e risco",
    apelidos: [
      "prêmio por risco",
      "prêmios de risco",
      "prêmio de risco das ações",
      "prêmio pelo risco",
      "preço do risco",
    ],
    resumo: "O retorno a mais que um investimento arriscado precisa oferecer, acima de uma aplicação sem risco, para alguém aceitar carregá-lo.",
    texto: [
      "Se um título do governo paga 4% ao ano sem risco, por que alguém compraria ações que podem cair 40% num ano? Só se esperasse ganhar mais no longo prazo. Esse retorno a mais é o prêmio de risco.",
      "É o retorno extra que um investimento arriscado precisa oferecer, acima de uma aplicação sem risco, para alguém aceitar carregá-lo. Está em toda parte: na taxa extra que uma empresa paga para se financiar, no risco-país de um governo, no retorno a mais que as ações costumam entregar sobre os títulos.",
      "A palavra importante é esperado. O prêmio de risco não é garantido. É uma expectativa, e em muitos anos ele vem negativo. Se viesse sempre, não seria prêmio por risco.",
    ],
    secoes: [
      {
        titulo: "Os números",
        paragrafos: [
          "Pela base histórica de Aswath Damodaran, professor da NYU, de 1928 a 2025 o S&P 500 com dividendos rendeu em média 10,0% ao ano. O título de 10 anos do Tesouro americano, 4,5%. A letra de três meses, 3,3%. A diferença de perto de 5,5 pontos por ano entre ações e títulos longos, composta por quase um século, é o prêmio de risco das ações americanas.",
          "Ele cobrou caro no caminho. Em 26 desses 98 anos, a bolsa caiu. Em 35, rendeu menos que o título do Tesouro. Mesmo em janelas de dez anos, perdeu dele em 13 de 89. Em janelas de 20 anos, só uma vez.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O mesmo raciocínio vale para governos. Em 2002, quando o mercado temia um calote, cobrava perto de 24 pontos percentuais ao ano acima dos títulos americanos para emprestar ao Brasil em dólar. Esse é o prêmio de risco-país no seu pior momento.",
          "Juro alto em reais é, em boa parte, prêmio de risco. O investidor cobra mais para emprestar a um país com histórico de inflação, moratória e mudanças de regra. Não é presente, é pagamento por um risco que existe, ainda que não apareça no extrato do CDI.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Prêmio alto não é oportunidade automática. Às vezes ele é alto porque o risco é real e vai se materializar. O CDB que paga muito acima do CDI e o título de um país em crise pagam mais por um motivo.",
          "E o prêmio passado não define o futuro. O retorno de quase um século das ações americanas é de um país que deu certo. Bolsas de outros países, no mesmo período, entregaram prêmios menores, e algumas foram fechadas por guerras e revoluções.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Entender o prêmio de risco muda a pergunta. Não é qual investimento rende mais, e sim qual risco você está sendo pago para carregar, e se o pagamento compensa. Um retorno alto sem risco aparente quase sempre esconde um risco que você ainda não viu.",
        ],
      },
    ],
    exemplo: "Hipotético: dois investimentos de dez anos. O primeiro paga 5% ao ano com certeza. O segundo deve render 10% ao ano em média, mas pode perder metade do valor numa crise. A diferença de 5 pontos é o prêmio que o mercado oferece pelo risco. Se você precisa do dinheiro em dois anos, nenhum prêmio compensa; se pode esperar vinte, a conta muda.",
    naPratica: "Juro alto em reais é prêmio de risco, não presente. E o retorno mais alto que se espera das ações, aqui ou lá fora, só existe porque elas podem cair muito. Ao dolarizar, você troca parte do prêmio de risco brasileiro, que vem do crédito e da moeda do país, por prêmios de outros mercados. Prêmio e risco andam sempre juntos.",
    relacionados: [
      "ativo-livre-de-risco",
      "spread-de-credito",
      "risco-pais",
      "indice-de-sharpe",
      "risco-sistematico",
      "embi",
      "crise-de-2002",
      "juro-real",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "45:15" },
      { modulo: 1, aula: 1, tempo: "24:32" },
      { modulo: 1, aula: 2, tempo: "25:16" },
      { modulo: 1, aula: 3, tempo: "9:50" },
    ],
  },
  {
    slug: "ativo-livre-de-risco",
    termo: "Ativo livre de risco",
    categoria: "Carteira e risco",
    apelidos: ["livre de risco", "sem risco", "taxa livre de risco", "juro sem risco"],
    resumo: "Na teoria, a aplicação que paga um retorno certo, sem chance de calote nem oscilação no prazo. Na prática, um título curto do governo na própria moeda é o que mais se aproxima.",
    texto: [
      "Todo modelo de finanças começa com uma pergunta: quanto você ganharia sem correr risco nenhum? Esse é o ponto de partida. Qualquer outro investimento é medido pelo quanto paga acima dele.",
      "Na teoria, o ativo livre de risco paga um retorno certo, sem chance de calote nem de oscilação no prazo combinado. Na prática, nada é perfeito, e o que mais se aproxima é um título de curto prazo do governo, na moeda do próprio governo. Nos Estados Unidos, são as letras do Tesouro de três meses. No Brasil, a Selic e o Tesouro Selic.",
      "Mas livre de risco depende da régua. Um título é sem risco numa moeda e num prazo. Mude a moeda ou o prazo, e o risco aparece.",
    ],
    secoes: [
      {
        titulo: "Por que o governo",
        paragrafos: [
          "Um governo que deve na própria moeda tem uma vantagem que nenhuma empresa tem: pode, no limite, emitir dinheiro para pagar. Por isso o risco de calote nominal é muito baixo. O risco que sobra é outro: receber em dia, mas numa moeda que perdeu valor pela inflação.",
          "E o prazo curto importa. Um título que vence em três meses quase não oscila com os juros. Um que vence em 30 anos é livre de calote, mas pode perder 20% ou 30% do preço no caminho, como os títulos longos americanos em 2022.",
        ],
      },
      {
        titulo: "Nem os Estados Unidos têm mais triplo A",
        paragrafos: [
          "Durante décadas, o título do Tesouro americano foi chamado de ativo livre de risco do mundo. As agências de rating foram tirando a nota máxima: a S&P em 2011, a Fitch em 2023 e a Moody's em 16 de maio de 2025, a última das três grandes. Pela primeira vez em mais de um século, o país ficou sem triplo A em nenhuma delas.",
          "Na prática, os títulos curtos americanos seguem como a referência de menor risco para quem pensa em dólar. O rebaixamento só lembra que livre de risco é uma aproximação útil, não uma lei da natureza.",
        ],
      },
      {
        titulo: "Depende de quem mede",
        paragrafos: [
          "Um título do Tesouro americano é quase sem risco para quem gasta em dólar. Para quem gasta em reais, ele carrega o risco do câmbio: pode render 4% em dólar e perder 10% em reais num ano de real forte.",
          "E um título brasileiro em reais, sem risco para quem gasta aqui, é arriscado medido em dólar. A pergunta nunca é se um ativo é livre de risco, e sim livre de risco para gastar o quê, onde e quando.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Confundir sem oscilação com sem risco. O pós-fixado não balança, mas carrega risco de crédito e de moeda. E esquecer a inflação: um título que paga 4% ao ano com inflação de 5% é livre de calote e, ainda assim, faz você perder poder de compra.",
        ],
      },
    ],
    exemplo: "Hipotético: você vai pagar a faculdade de um filho nos Estados Unidos daqui a cinco anos, em dólar. Para esse objetivo, o investimento mais seguro é um título do Tesouro americano que vença perto da data, e não um CDB em reais. O CDB é sem risco em reais, mas o compromisso é em dólar, e o câmbio de daqui a cinco anos ninguém sabe.",
    naPratica: "Não existe investimento sem risco, existe investimento sem risco numa moeda e num prazo. Para quem tem gastos em reais, a reserva de emergência e o dinheiro de curto prazo ficam bem em títulos curtos do governo brasileiro. Para gastos futuros em dólar, o lugar seguro é o dólar. A pergunta é sempre: sem risco para gastar o quê, onde e quando?",
    relacionados: [
      "risco-de-base",
      "premio-de-risco",
      "treasury",
      "tesouro-selic",
      "rating-soberano",
      "selic",
      "tips",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "23:44" },
      { modulo: 1, aula: 1, tempo: "1:40" },
      { modulo: 1, aula: 3, tempo: "9:50" },
    ],
  },
  {
    slug: "risco-de-base",
    termo: "Risco de base",
    categoria: "Carteira e risco",
    apelidos: ["descasamento de moeda", "descasamento"],
    resumo: "O risco de um investimento seguro numa moeda ou unidade não casar com o objetivo, que está em outra. Um título sem risco em reais é arriscado para um gasto em dólar.",
    texto: [
      "Imagine que você guardou R$ 300 mil no Tesouro Selic para pagar, daqui a três anos, um mestrado nos Estados Unidos que custa US$ 60 mil. O título é o mais seguro do Brasil. Mesmo assim, se o dólar subir 50% até lá, o dinheiro não chega, mesmo com os juros do período. O investimento era seguro; o descasamento com o objetivo, não.",
      "Isso é risco de base: a distância entre a moeda ou a unidade em que o investimento é seguro e a moeda ou a unidade do objetivo. Um título é sem risco só em relação a uma unidade de conta. Para um gasto em outra, ele carrega risco, por mais sólido que seja.",
      "A ideia muda a pergunta da dolarização. Ela deixa de ser real ou dólar e passa a ser em que moeda estão os seus gastos futuros.",
    ],
    secoes: [
      {
        titulo: "De onde vem o nome",
        paragrafos: [
          "O termo nasceu nos mercados de proteção. Um produtor de soja que se protege com um contrato negociado em Chicago fica exposto à diferença entre o preço de lá e o preço que ele recebe no porto daqui. Essa diferença se chama base, e o risco de ela mudar é o risco de base.",
          "Em finanças pessoais, a lógica é a mesma. Você se protege numa régua, mas o seu problema está medido em outra.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Pense em três famílias. A primeira vai se aposentar no Brasil, gastando em reais. Para ela, um título em reais é o porto seguro, e a parte em dólar é diversificação, que oscila. A segunda tem filhos que vão estudar fora. Para os gastos em dólar dela, o porto seguro é um título em dólar, e a parte em reais é que carrega risco. A terceira mistura as duas coisas.",
          "Para quem vai gastar em dólar, o lugar seguro é o dólar. Para quem vai gastar em reais, é o real. Quase todo mundo tem um pouco de cada, mesmo sem perceber: viagens, produtos importados, tecnologia e combustível têm preço atrelado ao mundo.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Achar que segurança é uma propriedade do investimento. Não é: é uma relação entre o investimento e o objetivo. O mesmo título do Tesouro americano é porto seguro para um aluno que vai estudar em Boston e aposta cambial para um aposentado em Belo Horizonte.",
          "Também confunde a ideia de que manter tudo em reais é ficar parado. Para quem tem gastos futuros em dólar, ficar em reais é tomar risco de moeda todos os dias.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O risco de base dá um critério objetivo para parte da decisão de dolarizar. Antes de discutir cenário, juros ou eleição, liste os gastos futuros e a moeda de cada um. Uma parte da resposta já sai dessa lista.",
        ],
      },
    ],
    exemplo: "No exemplo da abertura: com o dólar a R$ 5, os R$ 300 mil compram US$ 60 mil, o valor exato do mestrado. Se em três anos o dólar estiver a R$ 6,50 e o Tesouro Selic tiver rendido 35%, os R$ 405 mil compram perto de US$ 62 mil. Se o dólar for a R$ 7,50, compram US$ 54 mil, e falta dinheiro. Hipotético, com números redondos.",
    naPratica: "Liste seus gastos futuros e a moeda de cada um: aposentadoria no Brasil, viagens, estudos dos filhos, um imóvel lá fora, a possibilidade de morar em outro país. A divisão entre moedas que casa com essa lista reduz o risco de base. O resto da decisão, quanto mais diversificar além disso, é escolha de cada um.",
    relacionados: [
      "ativo-livre-de-risco",
      "risco-cambial",
      "horizonte-de-investimento",
      "alocacao-de-ativos",
      "hedge-cambial",
      "dolarizacao",
      "politica-de-investimento",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "26:46" },
    ],
  },
  {
    slug: "indice-de-sharpe",
    termo: "Índice de Sharpe",
    categoria: "Carteira e risco",
    apelidos: ["Sharpe", "retorno ajustado ao risco", "retorno por unidade de risco"],
    resumo: "Quanto um investimento rendeu acima da aplicação sem risco para cada unidade de oscilação. Serve para comparar retornos que vieram com riscos diferentes.",
    texto: [
      "Dois fundos renderam 15% num ano em que o juro sem risco foi de 10%. Um oscilou 5% ao ano; o outro, 20%. Os dois entregaram o mesmo resultado, mas o primeiro fez isso com muito menos solavanco. Qual foi melhor? O índice de Sharpe responde.",
      "Ele mede quanto um investimento rendeu acima da aplicação sem risco para cada unidade de oscilação. Em palavras: pegue o retorno, tire o que você ganharia sem risco e divida o que sobrou pela volatilidade. Quanto maior o número, mais retorno você recebeu por cada solavanco.",
      "É a régua mais usada no mundo para comparar retornos que vieram com riscos diferentes.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "William Sharpe apresentou a medida em 1966, com o nome de razão entre recompensa e variabilidade. Era uma forma simples de comparar fundos de ações sem cair na armadilha de premiar só quem arriscou mais. Sharpe dividiu o Nobel de Economia de 1990 com Harry Markowitz e Merton Miller, pelos trabalhos sobre carteiras e preços de ativos.",
          "Com o tempo, a razão ganhou o nome do autor e virou padrão em relatórios de fundos, materiais de gestoras e comparações de estratégias.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Pela base de Aswath Damodaran, de 1928 a 2025 o S&P 500 rendeu em média perto de 8,5 pontos por ano acima da letra do Tesouro americano, com volatilidade perto de 19%. O Sharpe de longo prazo da bolsa americana fica, assim, perto de 0,4.",
          "Uma carteira com 60% em ações e 40% em títulos de 10 anos rendeu menos, 8,3% ao ano contra 10,0%, mas oscilou bem menos, perto de 12% contra 19%. O Sharpe dela fica um pouco acima do da bolsa pura. Menos retorno, mais retorno por unidade de risco.",
        ],
      },
      {
        titulo: "Limites da régua",
        paragrafos: [
          "O Sharpe trata alta e queda do mesmo jeito: um fundo que dá saltos para cima é penalizado como um que despenca. Por isso existem variações que olham só as quedas.",
          "Ele também depende muito do período. Três anos calmos podem gerar um Sharpe lindo que some na primeira crise. Estratégias que ganham pouco quase sempre e perdem muito de vez em quando costumam exibir Sharpe ótimo até o dia em que deixam de exibir.",
          "E o resultado muda com a moeda. O Sharpe de um fundo americano medido em dólar não é o mesmo medido em reais, porque o câmbio entra na oscilação e no retorno.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O Sharpe ajuda a lembrar que retorno sozinho não diz nada. Um fundo que rendeu mais pode simplesmente ter arriscado mais. E mostra que juntar ativos que andam diferente pode melhorar a relação entre retorno e risco do conjunto, mesmo que cada ativo sozinho pareça pior.",
        ],
      },
    ],
    exemplo: "No exemplo da abertura, o primeiro fundo tem Sharpe de 1: rendeu 5 pontos acima do juro sem risco e oscilou 5. O segundo tem Sharpe de 0,25: os mesmos 5 pontos de excesso divididos por 20 de oscilação. Para o mesmo resultado, o segundo exigiu que você aguentasse quatro vezes mais solavanco.",
    naPratica: "O objetivo de diversificar não é só reduzir o risco, e sim melhorar a relação entre retorno e risco da carteira inteira. Um ativo que oscila muito sozinho, como a bolsa americana medida em reais, pode melhorar o Sharpe de um patrimônio brasileiro, se andar diferente do resto. Ao comparar opções, use a mesma moeda e o mesmo período para todas.",
    relacionados: [
      "volatilidade",
      "premio-de-risco",
      "diversificacao",
      "alfa",
      "carteira-60-40",
      "ativo-livre-de-risco",
    ],
    noCurso: [
      { modulo: 1, aula: 1, tempo: "34:33" },
      { modulo: 1, aula: 2, tempo: "45:15" },
      { modulo: 1, aula: 3, tempo: "27:44" },
    ],
  },
  {
    slug: "alocacao-de-ativos",
    termo: "Alocação de ativos",
    categoria: "Carteira e risco",
    apelidos: [
      "alocação",
      "asset allocation",
      "classes de ativos",
      "classe de ativos",
      "tipos de investimento",
      "divisão entre tipos de investimento",
    ],
    resumo: "A decisão de quanto do dinheiro vai para cada tipo de investimento, e, para quem vive no Brasil, para cada moeda e país. Pesa mais no resultado que a escolha do papel ou da hora.",
    texto: [
      "Quanto do seu dinheiro vai para caixa, quanto para renda fixa, quanto para ações, quanto para imóveis? E, para quem vive no Brasil, quanto fica em reais e quanto vai para outras moedas e países? A resposta a essas perguntas é a sua alocação de ativos.",
      "Ela vem antes da escolha de qualquer papel e é mantida ao longo do tempo. A escolha do fundo, da ação ou do dia de comprar acontece dentro dessa moldura.",
      "É a decisão mais importante e a mais negligenciada de quem investe. A maioria das pessoas passa horas escolhendo um fundo e nenhum minuto decidindo quanto deveria ter em cada classe.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "David Swensen, que cuidou do dinheiro da Universidade Yale por 36 anos, dizia que existem três jeitos de buscar resultado: decidir quanto pôr em cada tipo de investimento, acertar a hora de entrar e sair, e escolher o papel. O primeiro pesa muito mais que os outros dois. Na conta lembrada na aula, 80% do resultado de longo prazo vem do andamento dos mercados, e 20%, da hora certa e da escolha do papel.",
          "Um estudo clássico de três pesquisadores americanos, com 91 grandes fundos de pensão, concluiu que a divisão entre classes de ativos explicava mais de 90% do sobe e desce dos retornos de cada fundo ao longo do tempo. A cifra é muitas vezes mal lida: explica a oscilação, não necessariamente o tamanho do retorno. Mas a mensagem central resistiu às revisões.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Você parte de três perguntas: para que serve o dinheiro, quando vai precisar dele e quanto de queda aguenta sem mudar de rota. Daí sai uma divisão-alvo entre classes e moedas.",
          "Depois, o mercado mexe nas fatias. A que subiu cresce, a que caiu encolhe. De tempos em tempos, você rebalanceia para voltar ao alvo. É um processo chato, e é justamente por ser chato que funciona.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Nos Estados Unidos, a referência clássica de alocação moderada é a carteira 60/40, com 60% em ações e 40% em títulos. No Brasil, a alocação típica do investidor pessoa física é quase toda em renda fixa pós-fixada, em reais, com uma fatia pequena de ações brasileiras e quase nada fora.",
          "Para o brasileiro, a alocação tem uma dimensão a mais que para o americano: a moeda. O americano já mora na moeda de reserva do mundo. O brasileiro precisa decidir, explicitamente, quanto do patrimônio quer em reais.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Montar a alocação por acaso, comprando o que o gerente oferece ou o que está na moda. Mudar a alocação a cada notícia, o que vira tentativa de acertar o momento. E esquecer o que está fora da carteira: salário, imóvel e previdência também são parte do patrimônio e pesam na conta.",
        ],
      },
    ],
    exemplo: "Hipotético: dois investidores escolhem fundos completamente diferentes, mas ambos deixam 70% em renda fixa e 30% em ações. Os resultados deles tendem a ficar mais parecidos entre si do que com o de um terceiro que tem 30% em renda fixa e 70% em ações. Quem decidiu o rumo foi a divisão, não o fundo.",
    naPratica: "Quanto fica no Brasil e quanto vai para fora é uma pergunta de alocação, e por isso pesa mais no seu resultado do que a escolha do ETF ou o dia da conversão. O curso não propõe um percentual, e zero é uma resposta legítima. O que importa, insiste Rodolfo, é decidir com calma, deixar por escrito e respeitar a decisão depois.",
    relacionados: [
      "rebalanceamento",
      "carteira-60-40",
      "politica-de-investimento",
      "market-timing",
      "diversificacao",
      "risco-de-base",
      "horizonte-de-investimento",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "0:12" },
      { modulo: 1, aula: 1, tempo: "39:43" },
      { modulo: 1, aula: 3, tempo: "31:01" },
    ],
  },
  {
    slug: "carteira-60-40",
    termo: "Carteira 60/40",
    categoria: "Carteira e risco",
    apelidos: ["60/40", "carteira moderada", "carteira 60/40 americana"],
    resumo: "A carteira clássica do mercado americano: 60% em ações e 40% em títulos, rebalanceada de tempos em tempos. Serve de referência para uma alocação moderada.",
    texto: [
      "Durante décadas, a resposta padrão de um consultor americano para quem não sabia como investir era: 60% em ações, para crescer, e 40% em títulos, para amortecer as quedas. Rebalanceada uma vez por ano, essa carteira vende um pouco do que subiu e compra do que caiu.",
      "É a carteira 60/40, a referência clássica de alocação moderada nos Estados Unidos. Não é uma recomendação mágica, e sim uma régua simples contra a qual se medem outras estratégias.",
      "Atenção a um detalhe da aula: na fala, a carteira moderada aparece como 60% em renda fixa e 40% em ações, mas os números mostrados são os da versão clássica, com 60% em ações.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A ideia é combinar dois ativos que costumam se comportar de forma diferente. Nas crises, quando as ações caem, os juros tendem a cair e os títulos sobem, segurando a carteira. Nas fases boas, as ações puxam o crescimento.",
          "O rebalanceamento faz o resto. Se as ações sobem muito e viram 70% da carteira, você vende uma parte e volta aos 60%. Se caem e viram 50%, você compra. É uma disciplina que obriga a vender caro e comprar barato.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Pela base de Aswath Damodaran, de 1928 a 2025 uma 60/40 com o S&P 500 e o título de 10 anos do Tesouro americano, rebalanceada todo ano, rendeu em média 8,3% ao ano, contra 10,0% da bolsa pura. Em troca, oscilou perto de 12% ao ano, contra 19%.",
          "Em 2008, a bolsa americana caiu 37%, os títulos de 10 anos subiram 20%, e a 60/40 caiu 14%. Foi o amortecedor funcionando como prometido.",
        ],
      },
      {
        titulo: "Quando ela falha",
        paragrafos: [
          "A 60/40 depende de ações e títulos andarem em sentidos diferentes. Em 2022, com a inflação alta e os juros subindo rápido, os dois caíram juntos: a bolsa perdeu 18% e o título de 10 anos, quase 18%. A carteira perdeu perto de 18%, o terceiro pior ano dela desde 1928, atrás só de 1931 e 1937.",
          "Depois de 2022, muita gente decretou a morte da 60/40. Em 2023 e 2024 ela voltou a render bem. O episódio mostra o limite de qualquer régua: funciona na média, não em todo ano.",
        ],
      },
      {
        titulo: "Um caso real, o da aula",
        paragrafos: [
          "Rodolfo usa a 60/40 para mostrar o custo de trocar de classe olhando o retrovisor. Quem aplicou US$ 100 nela em janeiro de 2009 e só rebalanceou chegou ao fim de 2012 com US$ 149. Quem foi trocando de classe, sempre atrás da que tinha acabado de ganhar, terminou com perto de US$ 101.",
        ],
      },
    ],
    exemplo: "Em 2008, a bolsa americana caiu 37%, os títulos de 10 anos subiram 20% e a 60/40 caiu 14%. Quem aplicou US$ 100 nela em janeiro de 2009 e só rebalanceou uma vez por ano chegou ao fim de 2012 com US$ 149. Em 2022, a mesma carteira perdeu perto de 18%, porque ações e títulos caíram juntos.",
    naPratica: "A 60/40 é uma régua, não uma recomendação, e foi pensada para quem gasta em dólar. Para o brasileiro, a mesma ideia aparece em outra forma: combinar ativos que reagem a forças diferentes, incluindo moedas diferentes. O ponto da aula é outro: uma regra simples, mantida com disciplina, ganhou de quem tentou trocar de classe todo ano.",
    relacionados: [
      "alocacao-de-ativos",
      "rebalanceamento",
      "sp-500",
      "treasury",
      "vies-de-recencia",
      "correlacao",
      "renda-fixa",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "25:26" },
      { modulo: 0, aula: 4, tempo: "22:22" },
      { modulo: 1, aula: 2, tempo: "46:35" },
    ],
  },
  {
    slug: "rebalanceamento",
    termo: "Rebalanceamento",
    categoria: "Carteira e risco",
    apelidos: ["rebalancear", "rebalanceada", "rebalanceado", "voltar à divisão escolhida"],
    resumo: "Voltar a carteira à divisão planejada depois que os movimentos do mercado a desarrumaram. Na prática, vender um pouco do que subiu e comprar do que caiu.",
    texto: [
      "Você decidiu ter 30% do patrimônio em dólar. O dólar disparou e a fatia virou 40%. Rebalancear é vender parte do que subiu para voltar aos 30%. Se o dólar cair e a fatia virar 22%, é comprar mais até voltar ao alvo.",
      "Rebalanceamento é isso: devolver a carteira à divisão planejada depois que os movimentos do mercado a desarrumaram. Na prática, é vender um pouco do que subiu e comprar um pouco do que caiu.",
      "Parece simples, e é. O difícil é fazer, porque contraria o instinto.",
    ],
    secoes: [
      {
        titulo: "Por que fazer",
        paragrafos: [
          "Sem rebalancear, a carteira muda de perfil sozinha. A classe que mais sobe vai ocupando espaço, e você termina com muito mais risco do que escolheu. Pela base de Damodaran, quem montasse uma 60/40 americana em 2000 e nunca mais mexesse chegaria a 2025 com perto de 81% em ações. Começando em 1970, chegaria a 95%. Uma carteira moderada vira, sem ninguém decidir, uma carteira agressiva.",
          "O rebalanceamento não promete render mais. O que ele garante é que o risco da carteira continue sendo o que você escolheu.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Há dois jeitos principais. Por calendário: uma vez por ano, numa data fixa, você confere as fatias e corrige. Por faixa: você só mexe quando uma fatia se afasta muito do alvo, por exemplo mais de 5 pontos para cima ou para baixo.",
          "Os aportes novos são a forma mais barata. Em vez de vender o que subiu, você direciona o dinheiro novo para a parte que ficou para trás. Assim evita custo de transação e, no caso de investimentos lá fora, novas idas e vindas de câmbio.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Rebalancear demais. Mexer toda semana gera custo, imposto e ansiedade, sem ganho real. Uma vez por ano, ou quando a faixa estoura, costuma bastar.",
          "Esquecer o imposto. No Brasil, vender com lucro pode gerar imposto de renda, e lá fora a regra é outra. Às vezes vale mais corrigir com aportes do que com vendas.",
          "E abandonar a regra no momento em que ela mais importa. Depois de uma queda forte, rebalancear significa comprar o que está caindo, e é exatamente aí que o medo diz para esperar.",
        ],
      },
      {
        titulo: "Por que é difícil",
        paragrafos: [
          "Rebalancear pede o contrário do que o viés de recência sugere: vender o vencedor recente e comprar o perdedor recente. Por isso vale escrever a regra antes de o mercado se mexer, com data e faixas, e cumpri-la sem reabrir a discussão a cada vez.",
        ],
      },
    ],
    exemplo: "Hipotético: carteira de R$ 100 mil, 70% em reais e 30% em dólar. Depois de um ano de dólar forte, ficaram R$ 68 mil em reais e R$ 42 mil em dólar, R$ 110 mil no total, com 38% em dólar. Para voltar aos 30%, você move cerca de R$ 9 mil do dólar para os reais. Ou, se for aportar R$ 20 mil no período, põe tudo do lado dos reais e a fatia volta sozinha para perto de 32%.",
    naPratica: "Rebalancear é o contrário do que o instinto pede: vender o que está indo bem e comprar o que está indo mal. Para quem dolariza, isso quer dizer comprar dólar quando ele cai e vender um pouco quando dispara, sem tentar adivinhar o próximo movimento. Deixe a regra escrita antes, com data e faixa, e use os aportes sempre que puder.",
    relacionados: [
      "alocacao-de-ativos",
      "carteira-60-40",
      "politica-de-investimento",
      "vies-de-recencia",
      "custo-medio",
      "ganho-de-capital",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "28:53" },
    ],
  },
  {
    slug: "custo-medio",
    termo: "Custo médio",
    categoria: "Carteira e risco",
    apelidos: [
      "custo médio em janelas",
      "preço médio",
      "converter em janelas",
      "converta em janelas",
      "aportes periódicos",
      "aportes mensais",
      "dollar cost averaging",
    ],
    resumo: "Investir ou converter aos poucos, em parcelas regulares, em vez de tudo de uma vez. Você compra mais quando está barato e menos quando está caro.",
    texto: [
      "Imagine que você converte R$ 2 mil todo mês. Num mês o dólar está a R$ 5,50, e seus R$ 2 mil compram US$ 364. No outro, ele cai para R$ 4,90, e os mesmos R$ 2 mil compram US$ 408. Quando está caro, você compra menos dólares; quando está barato, compra mais.",
      "Isso tem nome: custo médio, ou investimento em parcelas. Em vez de aplicar ou converter tudo de uma vez, você divide o valor em partes iguais e faz uma por vez, em datas marcadas, sem tentar adivinhar o dia certo.",
      "Como você compra mais unidades quando o preço está baixo, o preço médio que você paga nunca fica acima da média das cotações do período.",
    ],
    secoes: [
      {
        titulo: "O que as parcelas fazem e o que não fazem",
        paragrafos: [
          "As parcelas não fazem você ganhar mais. Num estudo da Vanguard, aplicar tudo de uma vez rendeu mais que dividir em parcelas em cerca de dois terços dos períodos históricos analisados, simplesmente porque os mercados sobem mais do que caem e o dinheiro fica mais tempo investido.",
          "O ganho é outro. Você elimina o risco de concentrar tudo no pior dia possível, reduz o tamanho de qualquer arrependimento e tira a decisão do campo da emoção. É uma troca consciente: abrir mão do melhor dia para escapar do pior.",
        ],
      },
      {
        titulo: "Como montar",
        paragrafos: [
          "Na aula 4, Rodolfo sugere dividir o valor que você decidiu dolarizar em 12 parcelas mensais, ou 5, ou 15, e converter uma por vez. O número exato importa menos que a regra estar escrita e ser cumprida.",
          "Vale definir antes o dia do mês, o valor de cada parcela e o que fazer se o dólar disparar ou despencar no meio do caminho. A resposta certa, quase sempre, é seguir o plano. Mudar o calendário por causa da cotação traz de volta exatamente o problema que as parcelas resolviam.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Usar as parcelas como desculpa para esperar. Converter a primeira e suspender as outras até o dólar voltar a um preço que você acha justo é tentar acertar o momento com outro nome.",
          "Esquecer o custo de cada operação. Spread e IOF são cobrados em toda conversão. Parcelas muito pequenas ou muito frequentes podem encarecer a conta; parcelas mensais costumam ser um bom equilíbrio.",
          "Confundir custo médio com aporte mensal. Quem investe parte do salário todo mês já faz custo médio sem querer. A decisão aqui é sobre um valor que você já tem e precisa decidir como converter.",
        ],
      },
    ],
    exemplo: "R$ 12 mil convertidos em seis parcelas de R$ 2 mil, com cotações hipotéticas de R$ 5,20, R$ 5,50, R$ 5,80, R$ 5,30, R$ 4,90 e R$ 5,10, compraram US$ 2.270,76, a R$ 5,28 em média, abaixo da média das cotações, R$ 5,30. Tudo de uma vez compraria de US$ 2.069, no mês mais caro, a US$ 2.449, no mais barato.",
    naPratica: "Para quem decidiu dolarizar, Rodolfo sugere dividir o valor em parcelas mensais e converter uma por vez, sem tentar adivinhar o dia certo. Isso protege de três tropeços clássicos: correr atrás do que já subiu, esperar o dólar voltar a um preço antigo e ficar parado por medo de errar. Quem espera o dólar cair para começar costuma esperar para sempre.",
    relacionados: [
      "market-timing",
      "vies-de-ancoragem",
      "alocacao-de-ativos",
      "aversao-ao-arrependimento",
      "spread-cambial",
      "iof",
      "remessa",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "1:23" },
    ],
  },
  {
    slug: "market-timing",
    termo: "Market timing",
    categoria: "Carteira e risco",
    apelidos: [
      "acertar o momento",
      "acertar a hora",
      "hora certa",
      "melhor momento",
      "melhor hora",
      "time in the market",
      "melhores dias",
      "perder os melhores dias",
      "trocar o pé",
      "troca o pé",
      "trocando o pé",
    ],
    resumo: "Tentar acertar a hora de entrar e sair do mercado. Parece intuitivo, mas os melhores dias aparecem colados aos piores, e quem sai na queda costuma perder a volta.",
    texto: [
      "Mando agora ou espero o dólar cair? Saio da bolsa até a eleição passar? Volto quando a guerra acabar? Tentar acertar o momento de entrar e sair é a tentação mais comum de quem investe, e uma das mais caras. O mercado chama isso de market timing.",
      "A ideia parece óbvia: comprar antes da alta, vender antes da queda. O problema é que, para ganhar, você precisa acertar duas vezes, a saída e a volta. E os dias que decidem décadas costumam aparecer justamente quando a vontade é estar fora.",
      "A frase que Rodolfo lembra na aula resume: o segredo não é o market timing, é o time in the market, o tempo dentro do mercado.",
    ],
    secoes: [
      {
        titulo: "Os números",
        paragrafos: [
          "O J.P. Morgan publica todo ano um gráfico simples. Na edição de 2026, US$ 10 mil aplicados no S&P 500 de janeiro de 2006 a dezembro de 2025, com dividendos, viraram US$ 80.619, ou 11,0% ao ano. Quem perdeu só os 10 melhores dias desses 20 anos ficou com US$ 35.866, 6,6% ao ano. Sem os 20 melhores, US$ 21.177. Sem os 40, terminou abaixo dos US$ 10 mil iniciais.",
          "Dez dias são perto de 0,2% dos pregões do período. Perder esse punhado cortou o patrimônio final pela metade.",
        ],
      },
      {
        titulo: "Por que é tão difícil",
        paragrafos: [
          "Os maiores dias de alta acontecem no meio das crises, e não depois que elas passam. Na edição de 2025 do mesmo levantamento, sete dos dez melhores dias dos 20 anos anteriores vieram até duas semanas depois de um dos dez piores. Em março de 2020, o segundo pior dia do ano foi seguido, no dia seguinte, pelo segundo melhor.",
          "Em abril de 2025, depois de dias de queda forte com o anúncio de tarifas americanas, o S&P 500 subiu cerca de 9,5% num único pregão, em 9 de abril, a maior alta diária desde outubro de 2008. Quem tinha vendido para esperar a poeira baixar perdeu exatamente esse dia.",
        ],
      },
      {
        titulo: "No câmbio é igual",
        paragrafos: [
          "Com o dólar, a tentação vem com cotação: esperar voltar a R$ 4,90, esperar passar a eleição, esperar o Copom. Ninguém acerta o câmbio de forma consistente, nem os bancos que vivem disso. Quem espera o dólar cair para começar costuma esperar para sempre, ou começar justo depois de uma alta, por medo de ficar de fora.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Ficar investido não elimina o risco. Quem esteve no S&P 500 o tempo todo também atravessou quedas de 34% em 2020 e de mais de 50% entre 2007 e 2009. O argumento contra o market timing não é que o mercado sempre sobe, e sim que ninguém sabe quando ele vai virar.",
          "Rebalancear e converter em parcelas não são market timing. As duas coisas seguem uma regra combinada antes, que não depende de previsão.",
        ],
      },
    ],
    exemplo: "De 2006 a 2025, o S&P 500 com dividendos rendeu 11,0% ao ano para quem ficou investido. Quem perdeu só os 10 melhores dias, em 20 anos, ficou com 6,6% ao ano e terminou com menos da metade do patrimônio: US$ 35.866 contra US$ 80.619, a partir de US$ 10 mil. Os números da aula, de 2005 a 2024, contam a mesma história.",
    naPratica: "O argumento não é de aposta, é de alocação: a fatia em dólar ou em bolsa deve ser aquela que você consegue carregar na pior semana, porque é nela que a decisão de sair ou ficar é tomada. Para entrar, converter em parcelas com datas marcadas tira a pergunta do agora ou depois da mesa.",
    relacionados: [
      "custo-medio",
      "vies-de-recencia",
      "retorno-do-investidor",
      "horizonte-de-investimento",
      "alocacao-de-ativos",
      "sp-500",
      "aversao-ao-arrependimento",
      "vies-de-ancoragem",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "2:25" },
      { modulo: 0, aula: 3, tempo: "25:26" },
    ],
  },
  {
    slug: "horizonte-de-investimento",
    termo: "Horizonte de investimento",
    categoria: "Carteira e risco",
    apelidos: ["horizonte", "diversificação no tempo", "quando o dinheiro será usado"],
    resumo: "Por quanto tempo o dinheiro pode ficar aplicado antes de você precisar dele. Define que tipo de oscilação a carteira pode suportar.",
    texto: [
      "Dinheiro para a reforma do ano que vem e dinheiro para a aposentadoria daqui a 30 anos não podem ser investidos do mesmo jeito. O primeiro não pode estar em baixa na hora de usar. O segundo pode atravessar várias crises e ainda chegar inteiro. A diferença entre os dois é o horizonte.",
      "Horizonte de investimento é por quanto tempo o dinheiro pode ficar aplicado antes de você precisar dele. Ele define que tipo de oscilação a carteira suporta e, por isso, que tipo de investimento faz sentido para cada parte do patrimônio.",
      "Quase ninguém tem um horizonte só. Tem vários, um para cada objetivo.",
    ],
    secoes: [
      {
        titulo: "Os números",
        paragrafos: [
          "Pela base de Aswath Damodaran, de 1928 a 2025, o S&P 500 com dividendos caiu em 26 dos 98 anos, mais ou menos um em cada quatro. Em janelas de dez anos seguidos, terminou no negativo 5 vezes em 89. Em janelas de 15 anos, uma vez. Em janelas de 20 anos, nunca, em valores nominais.",
          "Em outros mercados, a história é menos generosa. A bolsa japonesa levou 34 anos para voltar ao pico de 1989. Prazo longo melhora as chances; não as transforma em certeza.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Prazo longo ajuda, mas não faz o risco sumir. Num horizonte longo, fica menos provável que a bolsa perca da renda fixa, mas o tamanho do estrago nos piores cenários cresce, porque há mais tempo para as coisas darem errado. Os economistas chamam a ideia de que o tempo elimina o risco de diversificação no tempo, e boa parte deles a considera um equívoco: o tempo dá mais chances de recuperar, não proteção.",
          "Outro engano é tratar o horizonte como fixo. Uma demissão, uma doença ou uma oportunidade podem antecipar a necessidade do dinheiro. Por isso a reserva de emergência vem antes de tudo.",
        ],
      },
      {
        titulo: "No câmbio",
        paragrafos: [
          "O câmbio também tem horizonte. Quem converteu reais em dólar no fim de 2024, com o dólar acima de R$ 6, e deixou o dinheiro em títulos curtos do Tesouro americano chegou ao fim de 2025 perdendo perto de 8% em reais: o rendimento de cerca de 4% em dólar não cobriu a queda de cerca de 11% do dólar. De dezembro de 1994 a dezembro de 2025, porém, o dólar subiu em média perto de 6% ao ano contra o real. Num ano, o câmbio pode anular o rendimento; em décadas, pesa de outra forma.",
        ],
      },
      {
        titulo: "Como usar",
        paragrafos: [
          "Separe o patrimônio por objetivos e dê uma data a cada um. O que vence em até dois anos fica em algo que não oscila e está na moeda do gasto. O que vence em dez anos ou mais pode carregar bolsa, câmbio e outros riscos, porque tem tempo de esperar a volta.",
        ],
      },
    ],
    exemplo: "Hipotético: uma família tem R$ 600 mil. R$ 60 mil são a reserva de emergência. R$ 140 mil vão pagar a entrada de um imóvel em 18 meses. Os R$ 400 mil restantes são para a aposentadoria, daqui a 25 anos. Só essa última parte tem horizonte para atravessar anos de queda sem ser vendida, e é nela que a discussão sobre dolarizar faz sentido.",
    naPratica: "Dolarizar faz sentido para a parte do patrimônio que pode atravessar anos de sobe e desce sem ser vendida. Para obra, chamada de capital ou emergências, Rodolfo não recomenda o exterior: tanto a bolsa quanto a renda fixa americanas oscilam, e o dólar oscila junto. A exceção é o gasto futuro em dólar com data marcada, que pede um título em dólar que vença perto dela.",
    relacionados: [
      "reserva-de-emergencia",
      "risco-de-base",
      "duration",
      "tolerancia-ao-risco",
      "market-timing",
      "drawdown",
      "alocacao-de-ativos",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "26:46" },
      { modulo: 1, aula: 3, tempo: "11:45" },
    ],
  },
  {
    slug: "reserva-de-emergencia",
    termo: "Reserva de emergência",
    categoria: "Carteira e risco",
    apelidos: ["reservas de emergência", "dinheiro à mão", "emergências do dia a dia"],
    resumo: "Dinheiro guardado para imprevistos, como perda de emprego ou uma despesa médica, aplicado em algo seguro e que se resgata na hora, na moeda dos seus gastos.",
    texto: [
      "O carro quebra. A empresa corta o seu cargo. Aparece uma despesa médica que ninguém previu. Nessas horas, o dinheiro precisa estar à mão, inteiro, na moeda das contas. É para isso que existe a reserva de emergência.",
      "É um colchão de dinheiro guardado para imprevistos, aplicado em algo seguro e que se resgata na hora. Ela não existe para render: existe para que você nunca precise vender um investimento de longo prazo no pior momento.",
      "É a primeira peça de qualquer plano. Antes de pensar em bolsa, em dólar ou em qualquer outro risco, ela precisa estar montada.",
    ],
    secoes: [
      {
        titulo: "Os três requisitos",
        paragrafos: [
          "Segurança: o valor não pode cair. Liquidez: o dinheiro precisa estar disponível no mesmo dia ou no seguinte, sem multa nem perda. Moeda certa: ela precisa estar na moeda em que você gasta. Para quem mora e gasta no Brasil, isso quer dizer reais.",
          "No Brasil, os candidatos naturais são o Tesouro Selic, CDBs de liquidez diária de bancos sólidos, dentro do limite do FGC, e fundos DI de taxa baixa. Ações, fundos multimercado e dólar não cumprem os requisitos, por melhores que sejam como investimento.",
        ],
      },
      {
        titulo: "Quanto guardar",
        paragrafos: [
          "A regra de bolso mais citada fala em alguns meses de despesas. Quem tem renda muito previsível, como um servidor público, pode ficar no lado baixo. Quem é autônomo, empresário ou trabalha num setor instável, no lado alto. Quem sustenta outras pessoas também tende a precisar de mais.",
          "O número exato importa menos que o critério: quanto tempo você levaria para recompor a renda se ela parasse amanhã, e quanto custaria a vida nesse intervalo.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Deixar a reserva na poupança por hábito, perdendo rendimento sem ganhar segurança extra. Investir a reserva em algo que oscila porque rende mais. Misturar a reserva com o dinheiro de objetivos, e acabar gastando-a numa viagem.",
          "E o erro oposto: guardar demais. Uma reserva de cinco anos de despesas deixa de ser reserva e vira uma carteira inteira em pós-fixado, com o risco de concentração que isso traz.",
        ],
      },
      {
        titulo: "E quem mora fora ou gasta em dólar",
        paragrafos: [
          "A regra da moeda vale para os dois lados. Quem vive no exterior, ou tem despesas recorrentes em dólar, precisa de uma reserva nessa moeda, em algo líquido e seguro de lá, como fundos de títulos curtos do Tesouro americano.",
        ],
      },
    ],
    exemplo: "Hipotético: uma família gasta R$ 10 mil por mês e decide guardar seis meses de despesas. São R$ 60 mil num título pós-fixado de liquidez diária, separados do resto da carteira. Se a renda parar, eles têm seis meses para se reorganizar sem tocar nos investimentos de longo prazo, nem na parte em dólar.",
    naPratica: "Para quem gasta em reais, a reserva fica em reais. A aula é clara: dinheiro que vai ser usado logo não deve ficar exposto ao sobe e desce do dólar e da bolsa americana. A dolarização começa depois que a reserva está montada, e é justamente a reserva que permite manter a parte em dólar sem vender nas crises.",
    relacionados: [
      "horizonte-de-investimento",
      "liquidez",
      "tesouro-selic",
      "fundo-di",
      "contabilidade-mental",
      "fgc",
      "pos-fixado",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "26:46" },
    ],
  },
  {
    slug: "perfil-de-investidor",
    termo: "Perfil de investidor",
    categoria: "Carteira e risco",
    apelidos: ["perfil de risco", "suitability", "adequação ao perfil"],
    resumo: "A classificação, feita por questionário, de quanto risco uma pessoa pode e quer correr, conforme objetivos, prazo, patrimônio e experiência. Bancos e corretoras são obrigados a fazê-la.",
    texto: [
      "Antes de oferecer um investimento, o banco ou a corretora precisa saber se ele combina com você. Por isso, ao abrir a conta, você responde a um questionário sobre objetivos, prazo, patrimônio e experiência. O resultado é um rótulo: conservador, moderado, arrojado.",
      "Esse é o perfil de investidor. No mercado, o processo se chama suitability, adequação em inglês. Ele classifica quanto risco uma pessoa pode e quer correr e serve para impedir que alguém receba uma oferta incompatível com a própria situação.",
      "É um ponto de partida útil e uma obrigação legal. Não é uma sentença sobre quem você é.",
    ],
    secoes: [
      {
        titulo: "A regra no Brasil",
        paragrafos: [
          "A regra atual é a Resolução 30 da CVM, de 11 de maio de 2021. Ela obriga corretoras, bancos, consultores e gestores que recomendam ou distribuem investimentos a verificar se o produto é adequado ao cliente, com base em objetivos, situação financeira e conhecimento. O perfil precisa ser atualizado em intervalos de até 24 meses.",
          "Se você quiser comprar algo acima do seu perfil, a instituição precisa alertar e pedir uma declaração de ciência. Investidores qualificados, com mais de R$ 1 milhão aplicado, e profissionais, com mais de R$ 10 milhões, têm acesso a produtos mais complexos e a algumas dispensas.",
        ],
      },
      {
        titulo: "O que o questionário mistura",
        paragrafos: [
          "O questionário junta duas coisas que vale separar. Uma é a capacidade de correr risco: depende de patrimônio, renda, estabilidade do emprego e prazo. A outra é a disposição: é temperamento, o quanto você aguenta ver o saldo cair sem perder o sono.",
          "As duas podem divergir muito. Um jovem com renda estável e 30 anos pela frente tem capacidade alta, mas pode ter disposição baixa. Um aposentado com patrimônio grande pode ter disposição alta e capacidade limitada, se depende daquele dinheiro para viver.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Responder o questionário pensando no que se quer ouvir, para liberar um produto. Tratar o rótulo como fixo, quando a vida muda. E confundir o perfil com a alocação: o perfil diz quanto risco cabe no total, não onde ele deve estar.",
        ],
      },
      {
        titulo: "Lá fora",
        paragrafos: [
          "Corretoras americanas também perguntam sobre experiência, renda e objetivos, e liberam produtos mais arriscados, como opções e margem, conforme as respostas. A lógica é a mesma: proteger o cliente e a instituição de uma operação incompatível.",
        ],
      },
    ],
    exemplo: "Hipotético: uma pessoa de 35 anos, com renda estável e 30 anos até se aposentar, tem capacidade alta de correr risco. Se ela vende tudo a cada queda de 10%, a disposição é baixa. Uma carteira que ignore a capacidade fica conservadora demais para os objetivos; uma que ignore a disposição não dura até a próxima crise. As duas precisam caber.",
    naPratica: "O perfil diz quanto risco cabe no total, não onde ele está. Dá para ter um perfil conservador e, ainda assim, querer diversificar moeda: concentrar tudo em reais também é um risco, só que não aparece como oscilação no extrato. Uma parte em dólar aplicada em algo conservador, como títulos curtos do Tesouro americano, pode caber num perfil cauteloso.",
    relacionados: [
      "tolerancia-ao-risco",
      "horizonte-de-investimento",
      "alocacao-de-ativos",
      "politica-de-investimento",
      "risco-de-concentracao",
      "corretora-internacional",
    ],
  },
  {
    slug: "tolerancia-ao-risco",
    termo: "Tolerância ao risco",
    categoria: "Carteira e risco",
    apelidos: [
      "capacidade de correr risco",
      "disposição para o risco",
      "capacidade e disposição",
      "estômago",
      "caber no seu estômago",
      "aversão ao risco",
    ],
    resumo: "Quanto de queda você aguenta sem mudar de rota. Tem duas partes: a capacidade, que é financeira, e a disposição, que é emocional.",
    texto: [
      "Um empresário de 55 anos vende a empresa e fica com R$ 50 milhões, sem dívidas e sem precisar do dinheiro para viver. Capacidade de correr risco ele tem de sobra. Aí perde R$ 1 milhão em duas semanas, 2% do patrimônio, e vende tudo. Faltou a outra metade da tolerância ao risco.",
      "Tolerância ao risco é quanto de queda você aguenta sem mudar de rota. Tem duas partes. A capacidade é financeira: depende de patrimônio, renda e prazo. A disposição é emocional: depende de temperamento, experiência e de como você reage a ver o saldo cair.",
      "As duas coisas são diferentes, e uma carteira que ignora qualquer uma delas não dura.",
    ],
    secoes: [
      {
        titulo: "O caso da aula",
        paragrafos: [
          "O cliente do Rodolfo, aquele dos R$ 50 milhões, disse: perdi em duas semanas o que demorei 30 anos para fazer. Vendeu para defender os 49 que sobraram e ficou na renda fixa. Quando o mercado voltou e ele quis entrar de novo, a maior parte da alta já tinha passado.",
          "Repare na conta. R$ 1 milhão era 2% do patrimônio, mas pesou como um milhão inteiro. A cabeça não pensou no pedaço da carteira; pensou no valor perdido. A disposição dele era muito menor que a capacidade, e ninguém tinha montado uma carteira que coubesse nessa diferença.",
        ],
      },
      {
        titulo: "Como medir a sua",
        paragrafos: [
          "Questionários ajudam, mas pecam por uma razão simples: responder sobre uma queda hipotética é muito mais fácil do que viver uma. Pesquisas com investidores mostram que as respostas mudam com o humor do mercado, mais ousadas depois de altas e mais medrosas depois de quedas.",
          "Um teste melhor é o histórico. O que você fez na última queda forte que viveu? Vendeu, ficou parado, comprou mais? Outro é traduzir percentuais em dinheiro: uma queda de 30% numa carteira de R$ 500 mil são R$ 150 mil. Imagine ver esse número no extrato.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Tolerância ao risco não é coragem nem conhecimento. Peter Lynch, que ficou famoso gerindo o fundo Magellan, da Fidelity, dizia que todo mundo tem capacidade intelectual para ganhar dinheiro com ações, mas nem todo mundo tem estômago. Saber que o mercado costuma voltar não impede o pânico.",
          "Ela também muda ao longo da vida: com a idade, a família, a proximidade de um objetivo e as experiências de mercado. Vale revisitá-la de tempos em tempos.",
        ],
      },
    ],
    exemplo: "Hipotético: R$ 1 milhão de patrimônio, R$ 300 mil numa carteira em dólar. Se essa fatia cair 35% medida em reais, num ano de bolsa ruim lá fora e real se valorizando, a perda é de R$ 105 mil, 10,5% do patrimônio. Se você consegue olhar esse número sem vender, a fatia cabe. Se não, ela é grande demais, por melhor que seja a tese.",
    naPratica: "A fatia em dólar tem de caber no seu estômago, e não só na sua planilha. Como a crise vai vir, daqui ou de fora, sem data marcada, só quem não vende no fundo do poço pega a volta. Vale começar com uma fatia menor, viver uma oscilação de verdade e ajustar depois, com calma.",
    relacionados: [
      "perfil-de-investidor",
      "aversao-a-perda",
      "drawdown",
      "volatilidade",
      "financas-comportamentais",
      "horizonte-de-investimento",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "10:27" },
    ],
  },
  {
    slug: "politica-de-investimento",
    termo: "Política de investimento",
    categoria: "Carteira e risco",
    apelidos: [
      "política de investimentos",
      "deixar por escrito",
      "regra escrita",
      "regra combinada antes",
      "plano de investimento",
    ],
    resumo: "Um documento curto, escrito por você, com objetivos, prazos, divisão entre classes e moedas e regras de revisão. Serve para decidir com calma e cumprir depois.",
    texto: [
      "Na Odisseia, Ulisses quer ouvir o canto das sereias sem se jogar no mar. A solução: pede à tripulação que o amarre ao mastro e ignore qualquer ordem que ele dê enquanto o canto durar. Ele decide com calma o que fazer no momento em que não vai conseguir decidir.",
      "Uma política de investimento é a corda de Ulisses do investidor. É um documento curto, escrito por você, com os objetivos do dinheiro, os prazos, a divisão entre classes e moedas e as regras para revisar. Serve para decidir com calma e cumprir depois, quando o mercado estiver cantando.",
      "Fundos de pensão, fundações e universidades têm um documento assim há décadas. Pessoas físicas podem ter o mesmo, numa página.",
    ],
    secoes: [
      {
        titulo: "O que vai nela",
        paragrafos: [
          "Para que serve cada parte do dinheiro e quando você vai precisar dela. Quanto vai para cada classe de ativo e cada moeda, com uma faixa de tolerância em volta de cada alvo. De quanto em quanto tempo você rebalanceia. Como novos aportes são distribuídos. E o que fazer numa queda forte: quanto tempo esperar antes de qualquer venda e que conta refazer.",
          "Vale também escrever o porquê. Daqui a três anos, numa semana ruim, é o motivo original que vai segurar a decisão.",
        ],
      },
      {
        titulo: "Por que funciona",
        paragrafos: [
          "O valor do documento aparece nas semanas ruins. Uma regra combinada antes protege de três tropeços clássicos: correr atrás do que já subiu, esperar o preço voltar a um patamar antigo e ficar parado por medo de errar.",
          "Ela também transforma decisões grandes em pequenas. Em vez de decidir, a cada notícia, se deve ou não ter dólar, você só confere se a fatia está dentro da faixa. A pergunta difícil foi respondida uma vez, com calma.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Os fundos de pensão brasileiros são obrigados por regra do Conselho Monetário Nacional a ter uma política de investimentos aprovada e revista periodicamente. Nos Estados Unidos, consultores e gestores de patrimônio costumam formalizar o mesmo documento com cada cliente.",
          "David Swensen, que cuidou do dinheiro de Yale por 36 anos, atribuía boa parte do resultado da universidade à disciplina de seguir a alocação definida, inclusive comprando o que estava em baixa.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Escrever e nunca mais ler. Rever o documento a cada susto, o que o transforma em desculpa. E fazer uma política complicada demais para ser cumprida. Uma página clara vale mais que dez páginas que ninguém segue.",
        ],
      },
    ],
    exemplo: "Hipotético: 25% do patrimônio investido em dólar, convertido em 12 parcelas mensais. Rebalanceamento uma vez por ano, só se a fatia sair da faixa de 20% a 30%. Aportes novos vão para a parte que estiver abaixo do alvo. Nenhuma venda por causa de uma queda sem passar uma semana e refazer as contas. Revisão completa a cada dois anos ou quando a vida mudar.",
    naPratica: "Quanto dolarizar é decisão de cada um, e zero é uma resposta legítima. O que importa, insiste Rodolfo, é decidir com calma, deixar por escrito e respeitar a decisão depois. O documento não precisa de advogado nem de formato oficial: precisa ser seu, curto e lido de novo antes de qualquer decisão tomada no susto.",
    relacionados: [
      "alocacao-de-ativos",
      "rebalanceamento",
      "sistema-1-e-sistema-2",
      "custo-medio",
      "perfil-de-investidor",
      "vies-de-recencia",
      "aversao-ao-arrependimento",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "0:12" },
    ],
  },
  {
    slug: "liquidez",
    termo: "Liquidez",
    categoria: "Carteira e risco",
    apelidos: ["mais líquido", "liquidez diária", "ilíquido"],
    resumo: "A facilidade de transformar um investimento em dinheiro rápido, sem derrubar o preço. Um mercado com mais compradores e vendedores é mais líquido.",
    texto: [
      "Ações de uma grande empresa americana são vendidas em segundos, pelo preço da tela. Um apartamento pode levar meses para encontrar comprador e, com pressa, sai com desconto. Os dois são investimentos, mas a liquidez é muito diferente.",
      "Liquidez é a facilidade de transformar um investimento em dinheiro rápido, sem derrubar o preço. Um mercado com muitos compradores e vendedores é líquido: você entra e sai sem mexer na cotação. Um mercado com poucos participantes é ilíquido: para vender rápido, é preciso aceitar um preço pior.",
      "Ela tem duas dimensões. O prazo, quanto tempo leva para o dinheiro cair na conta. E o custo, quanto do preço você perde para vender agora.",
    ],
    secoes: [
      {
        titulo: "Os números",
        paragrafos: [
          "Em 2025, as bolsas e plataformas americanas negociaram em média US$ 1,1 trilhão em ações por dia, segundo a Cboe, uma das operadoras desse mercado. No mesmo ano, o mercado à vista de ações da B3 girou, nos boletins mensais, entre R$ 22 bilhões e R$ 28 bilhões por dia, algo como US$ 4 a 5 bilhões. A diferença passa de 200 vezes.",
          "Na aula 4, Rodolfo fala em liquidez 46 vezes maior nos Estados Unidos, número que depende do critério e que não conseguimos reproduzir. A direção, porém, não está em dúvida: o mercado americano é o mais líquido do mundo, e por larga margem.",
        ],
      },
      {
        titulo: "Quando ela some",
        paragrafos: [
          "A liquidez costuma sumir justamente nas crises, quando todos querem vender ao mesmo tempo. Em março de 2020, até o mercado de títulos do Tesouro americano, o mais líquido do planeta, travou por alguns dias, e o Fed precisou comprar títulos em volume recorde para que ele voltasse a funcionar.",
          "No Brasil, fundos de crédito privado e fundos imobiliários já passaram por isso: muitos cotistas pedindo resgate ou vendendo cotas ao mesmo tempo, e o preço caindo bem mais do que os ativos por trás justificariam.",
        ],
      },
      {
        titulo: "Liquidez no papel e na prática",
        paragrafos: [
          "Muitos produtos parecem líquidos e não são. Um fundo pode ter resgate em 30 ou 90 dias. Um CDB pode ter carência. Uma previdência pode cobrar taxa de saída. Um título pode ser vendido a qualquer momento, mas pelo preço do dia, que pode estar baixo. Vale ler o prazo e o custo de saída antes de entrar.",
          "No exterior, entra mais uma etapa: trazer o dinheiro de volta. Vender um ETF em Nova York leva um ou dois dias; a remessa para o Brasil, mais alguns, com custo de câmbio.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Mais liquidez significa entrar e sair com custo menor, inclusive nas crises. Para a reserva de emergência, liquidez é tudo. Para o patrimônio de longo prazo, dá para aceitar menos liquidez em troca de outras vantagens, desde que você saiba que está fazendo essa troca.",
        ],
      },
    ],
    exemplo: "Hipotético: você precisa de R$ 200 mil em uma semana. Se o dinheiro estiver num ETF de bolsa americana, vende em minutos, recebe em dois dias e remete em mais alguns, pagando o câmbio. Se estiver num imóvel, talvez precise aceitar 15% ou 20% de desconto para vender tão rápido. Os dois valiam R$ 200 mil no papel; só um valia isso na semana em que você precisou.",
    naPratica: "Para quem dolariza, a liquidez é um dos argumentos a favor do mercado americano: ações, ETFs e títulos do Tesouro de lá estão entre os ativos mais fáceis de vender no mundo. Mas a reserva de emergência continua em reais, porque liquidez de verdade inclui estar na moeda da conta que você vai pagar.",
    relacionados: [
      "bolsa-de-valores",
      "reserva-de-emergencia",
      "custo-total",
      "horizonte-de-investimento",
      "etf",
      "treasury",
      "spread-cambial",
      "fundo-imobiliario",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "8:05" },
      { modulo: 1, aula: 1, tempo: "6:07" },
      { modulo: 1, aula: 2, tempo: "38:02" },
    ],
  },
  {
    slug: "capital-humano",
    termo: "Capital humano",
    categoria: "Carteira e risco",
    apelidos: ["renda do trabalho", "salário em reais"],
    resumo: "O valor de hoje de tudo o que você ainda vai ganhar trabalhando. Não aparece no extrato, mas, para quem está na ativa, costuma ser o maior bem que a pessoa tem.",
    texto: [
      "Pense em quanto você ainda vai ganhar trabalhando até se aposentar, trazido para valores de hoje. Para um profissional de 40 anos, essa soma costuma valer mais que todos os investimentos, o carro e às vezes até a casa. Isso tem nome: capital humano.",
      "Não aparece no extrato da corretora nem no imposto de renda, mas, para quem está na ativa, é quase sempre o maior bem que a pessoa tem. Com o tempo, ele vai sendo convertido em salário, e parte do salário vira poupança e investimentos.",
      "E ele tem endereço e moeda. Quem trabalha no Brasil tem o capital humano atrelado à economia brasileira e ao real.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A ideia de tratar a capacidade de trabalho como um patrimônio foi desenvolvida por economistas como Theodore Schultz e Gary Becker, ambos premiados com o Nobel. Becker mostrou que educação e treinamento funcionam como investimento: custam hoje e rendem salários mais altos no futuro.",
          "Os planejadores financeiros levaram o conceito para a carteira pessoal. Se o capital humano é um ativo, ele precisa entrar na conta da diversificação, como qualquer outro.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "O capital humano tem perfil de risco, como um investimento. Um servidor público estável tem um capital humano parecido com um título de renda fixa: renda previsível, pouco ligada aos ciclos. Um corretor, um empresário ou um executivo com bônus tem um capital humano parecido com ações: renda que sobe e desce com a economia.",
          "Daí uma ideia contraintuitiva. Quem já tem um capital humano arriscado pode querer uma carteira mais calma. Quem tem um capital humano estável pode carregar mais risco nos investimentos.",
        ],
      },
      {
        titulo: "O Brasil que você nem escolheu",
        paragrafos: [
          "O capital humano anda junto com a economia do país. Quando o Brasil vai mal, salários e empregos sofrem junto com as empresas daqui, com o mercado imobiliário e com a bolsa. Na prática, é uma posição em Brasil que você nem escolheu.",
          "A aposentadoria do INSS reforça a mesma exposição. Ela é paga em reais, por um sistema que depende dos salários e do número de contribuintes brasileiros. Dessa lista toda, a parte financeira é a única que você diversifica com alguns cliques.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Quando o Lehman Brothers quebrou, em 2008, os funcionários tinham cerca de 30% das ações do banco e perderam perto de US$ 10 bilhões. O capital humano e o financeiro estavam no mesmo lugar e foram atingidos no mesmo dia. Em escala de país, é a situação de quem recebe em reais, contribui para o INSS, tem imóvel aqui e investe tudo aqui.",
        ],
      },
    ],
    exemplo: "R$ 120 mil por ano durante 25 anos, trazidos a valor de hoje com juro de 5% ao ano, valem cerca de R$ 1,7 milhão. Somados a R$ 300 mil investidos, o patrimônio total chega a R$ 2 milhões. Mesmo que todos os investimentos estivessem fora do país, 85% desse total seguiria atrelado ao Brasil. Com tudo aqui, 100%.",
    naPratica: "Diversificar começa pelo patrimônio inteiro, não só pela carteira. Quem já tem salário, aposentadoria e imóvel em reais tem mais motivo, e não menos, para olhar a moeda dos investimentos. E quem tem uma renda muito ligada aos ciclos do Brasil, como empresários e profissionais com bônus, tem ainda mais exposição ao país do que parece.",
    relacionados: [
      "risco-de-concentracao",
      "valor-presente",
      "diversificacao",
      "home-bias",
      "previdencia",
      "demografia",
      "alocacao-de-ativos",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "9:00" },
    ],
  },
  {
    slug: "cisne-negro",
    termo: "Cisne negro",
    categoria: "Carteira e risco",
    apelidos: ["cisnes negros", "evento extremo", "risco de cauda"],
    resumo: "Um evento raro, de impacto enorme, que quase ninguém previa e que depois parece óbvio. O termo foi popularizado por Nassim Taleb.",
    texto: [
      "Durante séculos, os europeus tinham certeza de que todo cisne era branco. Nunca alguém tinha visto outro. Até que exploradores encontraram cisnes negros na Austrália, e uma certeza construída por milhões de observações caiu com uma só.",
      "O ensaísta e ex-operador de mercado Nassim Taleb usou a imagem para falar de eventos raros, de impacto enorme, que quase ninguém previa e que, depois de acontecer, parecem óbvios. São os cisnes negros. Ele popularizou o termo num livro de 2007, pouco antes da crise financeira global.",
      "Três traços definem um cisne negro: é inesperado, tem consequências gigantescas e, olhando para trás, ganha uma explicação convincente que faz parecer que dava para prever.",
    ],
    secoes: [
      {
        titulo: "Por que os modelos falham",
        paragrafos: [
          "Muitos modelos de risco tratam os retornos como se seguissem uma curva bem-comportada, em que quedas enormes são quase impossíveis. A realidade tem caudas mais gordas: os extremos acontecem bem mais do que a curva prevê.",
          "Em 19 de outubro de 1987, o índice Dow Jones caiu 22,6% num único dia. Pelos modelos que tratam os retornos como uma curva bem-comportada, um dia assim seria praticamente impossível. Aconteceu numa segunda-feira.",
          "Em 1998, o fundo americano Long-Term Capital Management, que tinha entre os sócios dois ganhadores do Nobel de Economia, quebrou depois que a moratória da Rússia desencadeou movimentos que os modelos dele consideravam praticamente impossíveis.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "O brasileiro tem um cisne negro próprio na memória: em março de 1990, o Plano Collor bloqueou por 18 meses o dinheiro de contas e aplicações acima de um limite. Quem achava que poupança era o investimento mais seguro do país descobriu, de um dia para o outro, que o risco estava na regra.",
          "A aula chama a pandemia de cisne negro. Em março de 2020, a B3 interrompeu os pregões seis vezes em oito sessões pelo circuit breaker, as cadeias globais de produção pararam e o dólar foi de R$ 4,02 no começo do ano a R$ 5,94 em maio.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Nem toda crise é cisne negro. Uma recessão, uma eleição tensa ou uma alta de juros são riscos conhecidos, ainda que difíceis de prever na data. O cisne negro é o que ninguém tinha no mapa.",
          "E chamar um evento de cisne negro depois que ele acontece pode virar desculpa. Muitas crises tinham sinais visíveis para quem quisesse ver; o que faltava era alguém disposto a agir.",
        ],
      },
    ],
    exemplo: "Hipotético: um investidor monta a carteira em fevereiro de 2020 com base nos dez anos anteriores, em que a bolsa americana quase só subiu e o dólar andou de lado. Nenhum cenário dele inclui uma pandemia. Em cinco semanas, a bolsa daqui cai quase pela metade; até maio, o dólar sobe perto de 48% desde o começo do ano. A carteira que sobrevive não é a que previu o vírus, e sim a que não dependia de nenhuma previsão.",
    naPratica: "Não dá para prever o próximo cisne negro. Dá para montar uma carteira que sobreviva a ele: diversificada entre países e moedas, com reserva à mão e sem precisar vender no pior momento. Ter uma parte do patrimônio fora da jurisdição brasileira é, entre outras coisas, um seguro contra o tipo de surpresa que só acontece num país.",
    relacionados: [
      "drawdown",
      "risco-sistematico",
      "diversificacao",
      "circuit-breaker",
      "pandemia-de-2020",
      "plano-collor",
      "vies-de-retrospectiva",
      "jurisdicao",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "1:22:05" },
    ],
  },
  {
    slug: "retorno-do-investidor",
    termo: "Retorno do fundo e retorno do investidor",
    categoria: "Carteira e risco",
    apelidos: [
      "retorno ponderado pelo tempo",
      "retorno ponderado pelo dinheiro",
      "investidor médio",
      "custo do comportamento",
      "Dalbar",
    ],
    resumo: "O fundo pode render 10% ao ano e o investidor dele ganhar bem menos, porque entrou depois das altas e saiu nas quedas. A distância é o custo do comportamento.",
    texto: [
      "Imagine um fundo que rendeu 10% ao ano numa década. Esse é o retorno do fundo: o que ganhou quem entrou no primeiro dia e não mexeu mais. Agora pense no investidor que aplicou depois de um ano ótimo, quando o fundo estava na moda, e resgatou no meio de uma queda. O fundo rendeu 10%. Ele ganhou bem menos.",
      "A distância entre o retorno do fundo e o retorno do investidor é o custo do comportamento. Ela nasce do momento em que o dinheiro entra e sai: mais dinheiro entrando perto dos topos, mais saindo perto dos fundos.",
      "É uma das ideias mais incômodas de finanças, porque diz que o produto pode ser bom e o resultado, ruim.",
    ],
    secoes: [
      {
        titulo: "Como se mede",
        paragrafos: [
          "No mercado, o primeiro número se chama retorno ponderado pelo tempo. Ele ignora quando o dinheiro entrou e mede só o desempenho do investimento. É o que os fundos divulgam.",
          "O segundo se chama retorno ponderado pelo dinheiro. Ele dá mais peso aos períodos em que havia mais dinheiro aplicado. Se você aplicou pouco na alta e muito antes da queda, ele mostra isso.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Um gráfico do J.P. Morgan com dados da consultoria Dalbar, de 2002 a 2021, mostrou o investidor médio em fundos americanos com 3,6% ao ano, abaixo da bolsa, com 9,5%, da renda fixa, com 4,3%, e de uma simples carteira 60/40, com 7,4%. O método da Dalbar tem críticos, porque trata todo aporte como se devesse ter sido feito no começo do período.",
          "A Morningstar faz a conta de forma mais cuidadosa no estudo Mind the Gap. Na edição de 2025, o investidor em fundos americanos ganhou, em dez anos, cerca de 1,2 ponto por ano a menos que os próprios fundos. A distância foi maior nos fundos mais voláteis e menor nos mais calmos.",
        ],
      },
      {
        titulo: "Por que acontece",
        paragrafos: [
          "Quase tudo o que este glossário chama de viés aparece aqui. O efeito manada leva dinheiro para o que está na moda. O viés de recência faz projetar o último ano para o futuro. A aversão à perda faz vender na queda. Somados, eles produzem o padrão clássico: comprar caro e vender barato.",
          "Fundos mais voláteis amplificam o problema, porque dão mais sustos e mais tentações. Fundos calmos, ou regras automáticas de aporte, reduzem a distância.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Ver o retorno de um fundo ou de um índice e supor que você teria ganho aquilo. Você só teria se tivesse entrado no começo e ficado até o fim, sem mexer.",
        ],
      },
    ],
    exemplo: "Hipotético: um fundo sobe 30% no primeiro ano e cai 10% no segundo. Quem aplicou R$ 100 mil no começo termina com R$ 117 mil, ganho de 17%. Outro investidor aplica R$ 10 mil no começo e, animado com a alta, mais R$ 90 mil no início do segundo ano. Termina com R$ 92,7 mil sobre R$ 100 mil aplicados, uma perda de mais de 7%, no mesmo fundo que rendeu 17% no período.",
    naPratica: "O retorno que importa é o da sua conta, em reais e com o câmbio do dia de cada aporte, e ele depende do seu comportamento. Na dolarização, a distância aparece quando a pessoa converte depois de uma disparada do dólar e desiste depois de uma queda. Regras escritas, parcelas com data marcada e aportes regulares existem para encurtar essa distância.",
    relacionados: [
      "market-timing",
      "vies-de-recencia",
      "efeito-manada",
      "politica-de-investimento",
      "custo-medio",
      "aversao-a-perda",
      "fundo-de-investimento",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "4:06" },
    ],
  },
  {
    slug: "financas-comportamentais",
    termo: "Finanças comportamentais",
    categoria: "Comportamento",
    apelidos: ["economia comportamental", "vieses", "viés", "vieses comportamentais", "vieses cognitivos"],
    resumo: "O estudo de como as pessoas decidem sobre dinheiro na vida real, com atalhos mentais e emoções, e não como a calculadora racional dos modelos clássicos.",
    texto: [
      "Os modelos clássicos de finanças supõem um investidor que pesa probabilidades com frieza, nunca se arrepende e não liga para o que os vizinhos estão fazendo. Basta passar uma semana de bolsa em queda perto de qualquer pessoa real para perceber que esse investidor não existe.",
      "Finanças comportamentais é o estudo de como as pessoas decidem sobre dinheiro na vida real, com atalhos mentais, emoções e erros que se repetem. Esses erros previsíveis se chamam vieses.",
      "A área mostrou que errar não é falta de inteligência nem de informação. É o jeito como o cérebro humano funciona, inclusive o de quem trabalha com números o dia inteiro.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Nos anos 1970, dois psicólogos israelenses, Daniel Kahneman e Amos Tversky, começaram a testar como as pessoas tomam decisões sob incerteza. Mostraram que elas erram de jeitos sistemáticos: dão peso demais a perdas, se ancoram em números irrelevantes, julgam pela facilidade de lembrar. Em 1979, publicaram a teoria do prospecto, que virou um dos artigos mais citados da economia.",
          "Tversky morreu em 1996. Kahneman recebeu o Nobel de Economia em 2002, sendo psicólogo de formação. Richard Thaler, que levou as ideias para a poupança, a previdência e as políticas públicas, ganhou o Nobel em 2017.",
        ],
      },
      {
        titulo: "O debate com a teoria clássica",
        paragrafos: [
          "Durante décadas, a ideia dominante era a de mercados eficientes: os preços refletem toda a informação disponível, e os erros de uns são corrigidos pelos acertos de outros. Em 2013, o Nobel foi dividido entre Eugene Fama, o grande defensor dessa visão, Robert Shiller, que estudava as bolhas e os exageros do mercado, e Lars Peter Hansen.",
          "O consenso que sobrou é razoável. Os mercados são difíceis de vencer, e por isso a maioria dos gestores perde dos índices. Mas os investidores, individualmente, erram muito, e esses erros custam caro para quem os comete.",
        ],
      },
      {
        titulo: "Os vieses mais comuns",
        paragrafos: [
          "Aversão à perda, ancoragem, efeito manada, viés de recência, excesso de confiança, viés de confirmação, contabilidade mental, efeito disposição, viés do status quo e viés doméstico. Cada um tem verbete próprio neste glossário.",
          "Quase todos aparecem na decisão de dolarizar: no medo de converter e ver o dólar cair no dia seguinte, na espera por uma cotação antiga, na vontade de converter só quando todo mundo está falando de dólar.",
        ],
      },
    ],
    exemplo: "O cliente da aula vendeu a empresa, aplicou parte de R$ 50 milhões na bolsa e, depois de perder R$ 1 milhão em duas semanas, 2% do patrimônio, vendeu tudo e ficou na renda fixa. Quando o mercado voltou, a maior parte da alta já tinha passado. Nenhuma planilha recomendaria aquela decisão; o medo, sim.",
    naPratica: "Na aula 3, Rodolfo Bastos usa as finanças comportamentais para responder por que o brasileiro deixa quase tudo em casa: não é o juro, é o jeito como o cérebro decide. Conhecer os vieses não imuniza ninguém, mas ajuda a criar defesas: decidir antes, com calma, deixar por escrito e impor uma pausa entre o susto e a ordem de venda.",
    relacionados: [
      "sistema-1-e-sistema-2",
      "aversao-a-perda",
      "vies-de-ancoragem",
      "home-bias",
      "vies-de-recencia",
      "teoria-do-prospecto",
      "heuristica",
      "efeito-manada",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "11:35" },
    ],
  },
  {
    slug: "sistema-1-e-sistema-2",
    termo: "Sistema 1 e sistema 2",
    categoria: "Comportamento",
    apelidos: ["sistema 1", "sistema 2", "Rápido e devagar", "dois sistemas"],
    resumo: "Os dois modos de pensar descritos por Daniel Kahneman: o sistema 1, rápido, automático e emocional, e o sistema 2, lento, analítico e trabalhoso.",
    texto: [
      "Você ouve uma buzina e pula para trás antes de pensar. Isso é o sistema 1. Agora calcule 17 vezes 24 de cabeça. O esforço, a pausa, a sensação de estar trabalhando: isso é o sistema 2.",
      "São os dois modos de pensar descritos por Daniel Kahneman no livro Rápido e devagar. O sistema 1 é rápido, automático, intuitivo e emocional. O sistema 2 é lento, analítico e trabalhoso.",
      "Os dois são úteis. O problema é que o sistema 2 cansa e, por isso, costuma aceitar o que o sistema 1 sugere sem conferir. Muitas vezes, ele só chega depois, para justificar o que já foi decidido.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Os nomes foram propostos pelos psicólogos Keith Stanovich e Richard West, e Kahneman os popularizou no livro publicado em 2011, que no Brasil saiu como Rápido e devagar: duas formas de pensar. O livro resume décadas de pesquisa feitas por ele e por Amos Tversky.",
          "Kahneman avisa que os dois sistemas não são lugares do cérebro. São personagens, um jeito de contar como o pensamento funciona.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "O sistema 1 está sempre ligado. Reconhece rostos, entende frases, percebe raiva numa voz e produz impressões instantâneas. Ele adora histórias coerentes e não se preocupa com o que está faltando nelas.",
          "O sistema 2 é acionado quando algo exige atenção: uma conta, uma comparação, um formulário. Ele é preguiçoso por natureza. Se a resposta do sistema 1 parece razoável, ele assina embaixo.",
          "Um teste famoso mostra a dupla em ação. Em três perguntas simples criadas pelo economista Shane Frederick, a resposta errada aparece primeiro. De 3.428 pessoas testadas, muitas de universidades de elite, só 17% acertaram as três.",
        ],
      },
      {
        titulo: "Na hora de investir",
        paragrafos: [
          "Para atravessar a rua, o sistema 1 é perfeito. Para investir, quase nunca há pressa, e dá tempo de chamar o sistema 2. Mandar dinheiro para fora ou trazer de volta não é questão de vida ou morte.",
          "O erro mais comum, de investidores e de profissionais, é reagir. Uma manchete, um gráfico vermelho, uma conversa no almoço, e o sistema 1 já decidiu. O sistema 2 aparece depois com bons argumentos para a decisão tomada.",
          "A defesa não é tentar desligar o sistema 1, o que ninguém consegue. É mudar o ambiente: decidir as regras em momentos calmos, olhar a carteira com menos frequência e criar um intervalo obrigatório entre a vontade e a ordem. Uma decisão que sobrevive a uma noite de sono e a uma conta no papel costuma ser do sistema 2.",
        ],
      },
    ],
    exemplo: "Uma queda forte da bolsa ou uma disparada do dólar acordam o sistema 1, que pede para vender ou comprar já. O sistema 2 faria outras perguntas: o que mudou no motivo que me fez investir? A fatia ainda está dentro da faixa que eu defini? Se eu não tivesse essa posição hoje, compraria? Respondidas por escrito, essas perguntas costumam esfriar a pressa.",
    naPratica: "Decida antes, com calma, quanto do patrimônio fica em cada classe e moeda, e combine com você mesmo que todo susto passa por uma pausa e uma conta antes de virar ordem. Deixe o sistema 1 despertar a curiosidade sobre dolarizar, e o sistema 2 fechar a conta.",
    relacionados: [
      "financas-comportamentais",
      "heuristica",
      "problema-do-taco-e-da-bola",
      "politica-de-investimento",
      "excesso-de-confianca",
      "vies-de-ancoragem",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "11:35" },
    ],
  },
  {
    slug: "heuristica",
    termo: "Heurística",
    categoria: "Comportamento",
    apelidos: ["heurísticas", "busca por atalho", "atalho mental", "atalhos mentais"],
    resumo: "Um atalho mental: trocar uma pergunta difícil por uma fácil e responder a fácil. Economiza esforço, mas leva a erros sistemáticos.",
    texto: [
      "Alguém pergunta se você deveria investir fora do Brasil. É uma pergunta difícil, sobre concentração de risco, moedas, prazos e objetivos. A cabeça, sem avisar, troca por uma fácil: o juro aqui é alto? Responde que sim e encerra o assunto. Você sai com a sensação de ter respondido à pergunta original.",
      "Isso é uma heurística: um atalho mental que troca uma pergunta difícil por uma fácil e responde a fácil. Na aula, Rodolfo chama de busca por atalho.",
      "Heurísticas não são defeito. Sem elas, ninguém conseguiria atravessar um dia, porque cada pequena decisão exigiria uma análise completa. O problema aparece quando o atalho é usado numa decisão grande, rara e cheia de números, como as de dinheiro.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1974, Amos Tversky e Daniel Kahneman publicaram na revista Science um artigo curto sobre como as pessoas julgam probabilidades. Eles descreveram três atalhos que funcionam bem quase sempre e falham de jeitos previsíveis. O artigo virou a base de tudo o que hoje se chama finanças comportamentais.",
        ],
      },
      {
        titulo: "Os três atalhos clássicos",
        paragrafos: [
          "Disponibilidade: julgar a frequência de algo pela facilidade com que exemplos vêm à memória. Depois de ver notícias de um sequestro, a cidade parece mais perigosa. Depois de um ano de dólar em queda, a alta parece improvável.",
          "Representatividade: julgar pela semelhança com um estereótipo. Uma empresa com um fundador carismático e um produto bonito parece um bom investimento, mesmo que o preço da ação já embuta tudo isso.",
          "Ancoragem: partir de um número qualquer e ajustar pouco a partir dele. A última cotação do dólar vira o preço justo, por mais arbitrária que seja.",
        ],
      },
      {
        titulo: "Como reconhecer",
        paragrafos: [
          "O sinal mais comum é a sensação de que a resposta veio fácil demais para uma pergunta difícil. Outro é a resposta que fala de uma coisa diferente da pergunta. Perguntaram sobre risco de concentração e você respondeu sobre taxa de juros. Perguntaram sobre o patrimônio de 20 anos e você respondeu sobre a cotação desta semana.",
          "Kahneman resume o mecanismo assim: diante de uma pergunta difícil, a mente responde a uma mais fácil, quase sempre sem perceber a troca.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Decisões de investimento juntam tudo o que as heurísticas odeiam: probabilidade, longo prazo, números grandes e feedback lento. Você só descobre se acertou anos depois, e até lá o atalho já foi tomado muitas vezes.",
        ],
      },
    ],
    exemplo: "O juro aqui é alto, então não preciso olhar para fora. A taxa responde a uma pergunta que era sobre concentração de risco. O juro alto pode ser ótimo e, ainda assim, todo o patrimônio continua dependendo da mesma moeda, da mesma economia e das mesmas regras. As duas perguntas são legítimas, mas só uma estava sendo feita.",
    naPratica: "Antes de decidir quanto dolarizar, escreva qual é a pergunta de verdade: quanto do meu patrimônio quero que dependa de uma única moeda e de um único país? Se a resposta que você deu responde a outra pergunta, mais fácil, como o dólar está caro ou o juro está alto, o atalho está agindo.",
    relacionados: [
      "sistema-1-e-sistema-2",
      "vies-de-ancoragem",
      "problema-do-taco-e-da-bola",
      "financas-comportamentais",
      "home-bias",
      "vies-de-recencia",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "14:57" },
    ],
  },
  {
    slug: "problema-do-taco-e-da-bola",
    termo: "Problema do taco e da bola",
    categoria: "Comportamento",
    apelidos: ["taco e a bola", "taco e da bola", "taco e bola", "teste de reflexão cognitiva"],
    resumo: "Um enigma simples que a maioria das pessoas erra por responder no automático. Mostra como a intuição tropeça até em contas de centavos.",
    texto: [
      "Um taco e uma bola custam R$ 1,10 juntos. O taco custa R$ 1,00 a mais que a bola. Quanto custa a bola? Se você pensou em 10 centavos, está em ótima companhia, e errou.",
      "Com a bola a 10 centavos, o taco custaria R$ 1,10, e os dois juntos, R$ 1,20. A conta só fecha com a bola a 5 centavos e o taco a R$ 1,05. A resposta errada aparece sozinha, rápida e convincente. A certa exige parar e conferir.",
      "É um enigma simples que a maioria das pessoas erra por responder no automático. Mostra como a intuição tropeça até em contas de centavos.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O problema faz parte do teste de reflexão cognitiva, criado pelo economista Shane Frederick e publicado em 2005. São só três perguntas, todas com a mesma armadilha: uma resposta errada que pula na frente.",
          "As outras duas são parecidas. Se cinco máquinas levam cinco minutos para fazer cinco peças, quanto tempo cem máquinas levam para fazer cem peças? A intuição diz cem minutos; a resposta é cinco. Num lago, uma mancha de plantas dobra de tamanho todo dia e cobre o lago inteiro em 48 dias. Em quantos dias cobre metade? A intuição diz 24; a resposta é 47.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Frederick aplicou o teste a 3.428 pessoas, muitas delas de universidades de elite americanas. Só 17% acertaram as três perguntas, e 33% erraram todas.",
          "Kahneman conta que mais da metade dos alunos de Harvard, MIT e Princeton dá a resposta errada no problema do taco e da bola. Em universidades menos disputadas, mais de 80%. Inteligência ajuda, mas não protege: o erro não é de capacidade, é de não parar para conferir.",
        ],
      },
      {
        titulo: "O que ele ensina",
        paragrafos: [
          "O problema é a demonstração mais simples da dupla que Kahneman chama de sistema 1 e sistema 2. O sistema 1 oferece uma resposta instantânea. O sistema 2 poderia conferir, mas não confere, porque a resposta parece certa e conferir dá trabalho.",
          "Quem erra não deixa de saber fazer a conta. Deixa de fazê-la. É exatamente o que acontece em decisões de dinheiro: o investidor sabe calcular o peso de uma perda na carteira, mas não calcula, porque o número em reais já assustou.",
        ],
      },
    ],
    exemplo: "Na aula, Rodolfo admite que ele e colegas que mexem com números o dia inteiro também caem nessa. Hipotético, no mesmo espírito: o dólar caiu de R$ 5,50 para R$ 5,00, e a cabeça conclui que tudo andou 10%. Mas, para quem tem dólares, a perda medida em reais é de 9,1%, enquanto quem ainda vai comprar leva 10% a mais de dólares com o mesmo dinheiro. Conta rápida, conclusão errada.",
    naPratica: "Se a intuição tropeça numa conta de centavos, imagine numa decisão sobre o seu patrimônio, tomada com medo ou com euforia. Antes de converter, vender ou adiar, faça a conta no papel: quanto essa posição representa do total, o que muda no seu objetivo e qual era o plano. É mais um motivo para decidir devagar.",
    relacionados: [
      "sistema-1-e-sistema-2",
      "heuristica",
      "excesso-de-confianca",
      "financas-comportamentais",
      "vies-de-ancoragem",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "13:23" },
    ],
  },
  {
    slug: "vies-de-ancoragem",
    termo: "Viés de ancoragem",
    categoria: "Comportamento",
    apelidos: ["ancoragem", "ancorado", "ancorada", "âncora mental", "esperar voltar ao preço"],
    resumo: "A tendência de usar um número visto antes, mesmo irrelevante, como referência para a decisão seguinte. No câmbio, a última cotação vira a régua do preço justo.",
    texto: [
      "Não vou mandar agora, que está a R$ 5,20; vou esperar voltar a R$ 4,90. Meses depois: está a R$ 6, vou esperar R$ 5,70. Repare que o preço considerado justo muda sempre, e é sempre o que esteve na tela pouco tempo antes.",
      "Isso é o viés de ancoragem: a tendência de usar um número visto antes, mesmo irrelevante, como ponto de partida para a decisão seguinte. A cabeça ajusta a partir da âncora, mas ajusta pouco.",
      "No câmbio, a última cotação vira a régua do preço justo. Na bolsa, o preço que você pagou. No imóvel, o valor do auge.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Num experimento famoso de Kahneman e Tversky, as pessoas giravam uma roleta viciada, que parava no 10 ou no 65, e depois estimavam quantos países da ONU eram africanos. Quem tinha visto o 10 respondia, tipicamente, 25%. Quem tinha visto o 65, 45%. Um número sorteado, sem nada a ver com a pergunta, puxou a resposta.",
        ],
      },
      {
        titulo: "Até especialistas",
        paragrafos: [
          "Corretores de imóveis experientes, convidados a avaliar uma casa, deram valores bem diferentes conforme o preço pedido que viram na ficha, e a maioria jurou que não tinha sido influenciada. Em outro estudo, juízes alemães com anos de carreira jogaram dados viciados antes de propor uma pena para um caso hipotético. Os que tiraram números altos propuseram penas mais longas.",
          "A âncora funciona mesmo quando a pessoa sabe que o número é aleatório. Saber que o viés existe ajuda pouco; o que ajuda é mudar o processo.",
        ],
      },
      {
        titulo: "No dinheiro",
        paragrafos: [
          "O preço que você pagou numa ação vira a referência de lucro e prejuízo, embora o mercado não saiba nem se importe com ele. O pico de um índice vira a medida do que é caro. A cotação do dólar no dia em que você começou a pensar no assunto vira o preço que você está disposto a pagar.",
          "No câmbio, a âncora é especialmente traiçoeira porque o real não tem um preço justo óbvio. Qualquer número recente parece razoável, e o investidor fica esperando uma cotação que talvez não volte.",
        ],
      },
      {
        titulo: "Como se defender",
        paragrafos: [
          "Tire o número da decisão. Converter em parcelas com datas marcadas faz com que nenhuma cotação específica decida por você. Avaliar a posição pelo papel que ela cumpre no patrimônio, e não pelo preço de compra, também ajuda.",
        ],
      },
    ],
    exemplo: "Hipotético: em 2020, um investidor decide dolarizar parte do patrimônio, mas acha o dólar caro a R$ 5,20 e resolve esperar a volta aos cerca de R$ 4,50 do fim de fevereiro. O dólar não volta a esse patamar nos anos seguintes. A decisão não foi rejeitada; ficou adiada, ancorada num número que tinha virado história.",
    naPratica: "Não existe preço certo do dólar para começar. Converter em janelas, com datas marcadas e valores iguais, tira a âncora da decisão. E, depois de convertido, avalie a parte em dólar pelo que ela faz pelo patrimônio, não pela cotação do dia em que você comprou.",
    relacionados: [
      "custo-medio",
      "heuristica",
      "market-timing",
      "vies-de-recencia",
      "efeito-disposicao",
      "teoria-do-prospecto",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "14:16" },
      { modulo: 0, aula: 3, tempo: "25:26" },
    ],
  },
  {
    slug: "aversao-a-perda",
    termo: "Aversão à perda",
    categoria: "Comportamento",
    apelidos: ["aversão a perdas", "aversão às perdas", "medo de perder"],
    resumo: "A dor de perder pesa mais que o prazer de ganhar o mesmo valor, cerca de duas vezes mais. Faz o investidor vender no fundo e evitar riscos que valeriam a pena.",
    texto: [
      "Alguém te oferece uma aposta no cara ou coroa: cara, você ganha R$ 100; coroa, perde R$ 100. A chance é meio a meio e a conta dá zero, mas a maioria recusa. Para aceitar, as pessoas costumam exigir perto de R$ 200 de ganho se der cara.",
      "Isso é aversão à perda: a dor de perder pesa mais que o prazer de ganhar o mesmo valor. Pelas medições de Kahneman e Tversky, perto de duas vezes e um quarto mais.",
      "É talvez o viés mais caro para quem investe. Faz vender no fundo, evitar riscos que valeriam a pena e segurar o que deu errado à espera de voltar ao preço de compra.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A aversão à perda é a peça central da teoria do prospecto, publicada por Kahneman e Tversky em 1979. Em vez de olhar para a riqueza total, as pessoas olham para mudanças, ganhos e perdas a partir de um ponto de referência. E as perdas doem mais.",
          "Num experimento clássico de Kahneman, Jack Knetsch e Richard Thaler, metade de uma turma recebeu uma caneca. Quem ganhou a caneca pedia, tipicamente, mais que o dobro para vendê-la do que quem não ganhou aceitava pagar por ela. Só por ser sua, a caneca passou a valer mais, porque abrir mão dela seria uma perda.",
        ],
      },
      {
        titulo: "Como aparece no investimento",
        paragrafos: [
          "A perda é sentida em reais, não em percentual. A cabeça não pensa no pedaço da carteira que estava em risco; pensa no valor perdido. Por isso uma queda de 2% num patrimônio grande pode doer como uma tragédia.",
          "Ela piora com a frequência com que você olha. A bolsa americana sobe em pouco mais da metade dos dias, mas subiu em perto de três de cada quatro anos desde 1928. Quem olha todo dia vê quase tantas perdas quanto ganhos e sofre muito mais. Quem olha uma vez por ano vê, quase sempre, ganho. Richard Thaler e Shlomo Benartzi chamaram isso de aversão míope à perda.",
        ],
      },
      {
        titulo: "Um caso real, o da aula",
        paragrafos: [
          "O cliente do Rodolfo, com R$ 50 milhões, perdeu R$ 1 milhão em duas semanas. Era 2% do patrimônio, mas pesou como um milhão inteiro: perdi em duas semanas o que demorei 30 anos para fazer. Vendeu para defender os 49 que sobraram e ficou de fora da recuperação.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Aversão à perda não é o mesmo que prudência. Prudência é dimensionar o risco antes. Aversão à perda é reagir ao prejuízo depois, quase sempre no pior momento. E ela também aparece como inação: não fazer nada parece não arriscar perder, mesmo quando ficar parado é a aposta mais concentrada.",
        ],
      },
    ],
    exemplo: "Hipotético: você converte R$ 50 mil e, na semana seguinte, o dólar cai 4%. No papel, são R$ 2 mil, 0,4% de um patrimônio de R$ 500 mil. Na cabeça, é a prova de que você errou e a vontade de desfazer tudo. Se o dólar tivesse subido 4%, o prazer seria bem menor que esse desconforto.",
    naPratica: "A aversão à perda aparece duas vezes na dolarização: no medo de converter e ver o dólar cair no dia seguinte, e na vontade de vender tudo na primeira queda. Tamanho de posição que caiba no estômago é a primeira defesa. Olhar a parte em dólar com menos frequência, e pelo papel que ela cumpre no patrimônio, é a segunda.",
    relacionados: [
      "teoria-do-prospecto",
      "tolerancia-ao-risco",
      "efeito-disposicao",
      "aversao-ao-arrependimento",
      "drawdown",
      "vies-do-status-quo",
      "financas-comportamentais",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "7:48" },
    ],
  },
  {
    slug: "teoria-do-prospecto",
    termo: "Teoria do prospecto",
    categoria: "Comportamento",
    apelidos: ["prospect theory", "função de valor", "ponto de referência"],
    resumo: "A teoria de Kahneman e Tversky sobre como as pessoas decidem sob risco: avaliam ganhos e perdas a partir de um ponto de referência, e as perdas pesam mais.",
    texto: [
      "Escolha uma: ganhar R$ 900 com certeza ou ter 90% de chance de ganhar R$ 1.000. A maioria fica com os R$ 900 garantidos. Agora outra: perder R$ 900 com certeza ou ter 90% de chance de perder R$ 1.000. A maioria prefere arriscar. As contas são idênticas, as escolhas são opostas.",
      "A teoria do prospecto, de Daniel Kahneman e Amos Tversky, explica por quê. As pessoas não avaliam decisões pelo patrimônio final, como dizia a teoria clássica. Avaliam ganhos e perdas a partir de um ponto de referência, e reagem de forma diferente a cada lado dele.",
      "Prospecto, aqui, quer dizer uma aposta, um conjunto de resultados possíveis com suas chances.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Kahneman e Tversky publicaram a teoria em 1979, numa revista de economia, e ela virou um dos artigos mais citados da área. Em 1992, refinaram a versão e estimaram os números que ficaram famosos: uma perda pesa cerca de 2,25 vezes um ganho do mesmo tamanho.",
          "A teoria foi a principal razão do Nobel de Economia dado a Kahneman em 2002. Tversky tinha morrido em 1996, e o prêmio não é dado depois da morte.",
        ],
      },
      {
        titulo: "As três ideias",
        paragrafos: [
          "Ponto de referência: o que importa é a mudança em relação a algo, como o preço de compra, o saldo do mês passado ou o bônus do ano anterior. O mesmo saldo de R$ 1 milhão é uma alegria para quem tinha R$ 800 mil e uma tristeza para quem tinha R$ 1,2 milhão.",
          "Aversão à perda: a curva desce mais depressa do lado das perdas do que sobe do lado dos ganhos.",
          "Sensibilidade decrescente: a diferença entre ganhar R$ 100 e R$ 200 parece maior do que a entre R$ 10.100 e R$ 10.200. Por isso, diante de ganhos, as pessoas evitam risco; diante de perdas, passam a aceitar riscos maiores para tentar recuperar.",
        ],
      },
      {
        titulo: "E as probabilidades",
        paragrafos: [
          "A teoria também mostra que as pessoas dão peso demais a chances pequenas. É por isso que alguém compra bilhete de loteria e, ao mesmo tempo, faz seguro contra eventos muito raros. Nos dois casos, uma probabilidade minúscula parece maior do que é.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Ela explica comportamentos que parecem irracionais: vender cedo o que dá lucro e segurar o que dá prejuízo, dobrar a aposta numa posição perdedora, sentir uma queda pequena como um desastre. Saber que o ponto de referência é arbitrário ajuda a escolher um melhor.",
        ],
      },
    ],
    exemplo: "Hipotético: você comprou dólar a R$ 5,50 e ele está a R$ 5,00. Mesmo que a razão de longo prazo para ter dólar continue de pé, a referência de R$ 5,50 faz cada dia abaixo dela parecer um prejuízo a ser desfeito. Se você tivesse comprado a R$ 4,80, a mesma cotação de R$ 5,00 seria motivo de satisfação.",
    naPratica: "O ponto de referência é arbitrário. Avaliar a parte em dólar pelo papel que ela cumpre no patrimônio, e não pelo preço de compra, ajuda a sair dessa armadilha. Uma pergunta útil: se eu não tivesse essa posição hoje e tivesse o dinheiro na mão, montaria a mesma posição?",
    relacionados: [
      "aversao-a-perda",
      "efeito-disposicao",
      "vies-de-ancoragem",
      "financas-comportamentais",
      "aversao-ao-arrependimento",
      "contabilidade-mental",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "7:48" },
    ],
  },
  {
    slug: "efeito-manada",
    termo: "Efeito manada",
    categoria: "Comportamento",
    apelidos: [
      "manada",
      "comportamento de manada",
      "seguir a multidão",
      "FOMO",
      "medo de ficar de fora",
      "fear of missing out",
    ],
    resumo: "Fazer o que os outros estão fazendo, por conforto ou por medo de ficar de fora. No mercado, empurra preços para cima nas euforias e para baixo nos pânicos.",
    texto: [
      "Duas lanchonetes lado a lado. Uma está cheia, a outra vazia. Sem saber nada das duas, você entra na cheia. Na vida, é um atalho razoável: se tanta gente escolheu, deve haver um motivo.",
      "No mercado, o mesmo atalho tem nome: efeito manada. É fazer o que os outros estão fazendo, por conforto, por medo de ficar de fora ou pela suposição de que eles sabem algo que você não sabe. Ele empurra preços para cima nas euforias e para baixo nos pânicos.",
      "O problema é que, quando todo mundo já comprou, o preço já subiu. E quando todo mundo já vendeu, o preço já caiu.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1720, as ações da Companhia dos Mares do Sul, na Inglaterra, subiram como nunca. Isaac Newton comprou, vendeu com lucro e, vendo os amigos ganharem ainda mais, voltou a comprar perto do topo. Pelo relato mais conhecido, perdeu uma fortuna e teria dito que conseguia calcular o movimento dos astros, mas não a loucura das pessoas.",
          "John Maynard Keynes comparou o mercado a um concurso de beleza em que o prêmio não vai para quem escolhe o rosto mais bonito, e sim para quem adivinha o rosto que os outros vão escolher. Cada um passa a tentar prever o que a multidão vai fazer.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "O motor emocional costuma ter nome em inglês: FOMO, fear of missing out, o medo de ficar de fora ao ver outros ganhando com algo que você não tem. Ele aparece perto dos topos, quando a alta já é assunto de jantar de família.",
          "Há também uma lógica fria. Se você não sabe muito sobre um investimento, observar o que os outros fazem parece informação. Mas, quando todos fazem isso, ninguém está de fato analisando, e a manada pode correr para o abismo em fila.",
        ],
      },
      {
        titulo: "Casos reais",
        paragrafos: [
          "Em março de 2000, 87% do Nasdaq 100 estava em tecnologia e comunicações, e qualquer empresa com ponto com no nome atraía dinheiro. O índice caiu 64% nos 21 meses seguintes. O mesmo enredo se repetiu nos imóveis americanos até 2006 e em várias ondas de criptomoedas.",
          "Na outra ponta, os pânicos. Em março de 2020, investidores do mundo inteiro venderam quase tudo ao mesmo tempo. Quem seguiu a manada saiu perto do fundo e perdeu uma das recuperações mais rápidas da história.",
        ],
      },
      {
        titulo: "A versão silenciosa",
        paragrafos: [
          "O efeito manada também aparece como inércia: ficar parado porque todo mundo à sua volta também está. Se ninguém da família, do trabalho ou do grupo de amigos tem dinheiro fora do Brasil, ter tudo aqui parece normal, mesmo sendo uma aposta concentrada.",
        ],
      },
    ],
    exemplo: "Dolarizar quando todo mundo fala de dólar, quase sempre depois de uma alta, e desistir quando o assunto esfria. Hipotético: o dólar sobe 20% em seis meses, vira capa de revista e você converte tudo de uma vez. No ano seguinte, ele devolve parte da alta, o assunto some e você desfaz a posição com prejuízo. É o caminho mais comum para comprar caro e vender barato.",
    naPratica: "A decisão de ter uma parte em dólar não deveria depender do assunto da semana. Uma regra combinada antes, como converter em parcelas mensais com datas marcadas, protege de correr atrás do que já subiu. E protege também da versão silenciosa: não ter nada fora só porque ninguém à sua volta tem.",
    relacionados: [
      "bolha",
      "vies-de-recencia",
      "retorno-do-investidor",
      "market-timing",
      "nasdaq",
      "custo-medio",
      "home-bias",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "14:57" },
    ],
  },
  {
    slug: "vies-de-recencia",
    termo: "Viés de recência",
    categoria: "Comportamento",
    apelidos: ["recência", "efeito recência", "olhar o retrovisor"],
    resumo: "Dar peso demais ao que acabou de acontecer e projetar isso para a frente. Faz o investidor comprar a classe que acabou de subir e vender a que acabou de cair.",
    texto: [
      "Depois de um ano ótimo da bolsa, parece óbvio que ela vai continuar subindo. Depois de um ano ruim, que vai continuar caindo. Depois de uma disparada do dólar, que ele nunca mais volta. A memória recente pesa mais que décadas de história.",
      "Isso é o viés de recência: dar peso demais ao que acabou de acontecer e projetar isso para a frente. Ele faz o investidor comprar a classe que acabou de subir e vender a que acabou de cair.",
      "O resultado é chegar sempre um ano atrasado à festa e sair logo antes de ela recomeçar.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O que aconteceu há pouco está fresco, vívido e cheio de detalhes. O que aconteceu há dez anos virou um número abstrato. A cabeça trata o vívido como mais provável. É um parente próximo da heurística da disponibilidade: o que vem fácil à memória parece mais frequente.",
          "Nos mercados, isso se traduz em fluxo de dinheiro. Fundos que foram bem no último ano recebem aplicações; fundos que foram mal sofrem resgates. Como os vencedores de um ano raramente se repetem no seguinte, o investidor que segue o fluxo compra o que já ficou caro.",
        ],
      },
      {
        titulo: "Um caso real, o da aula",
        paragrafos: [
          "Rodolfo monta o roteiro com índices americanos. Janeiro de 2009: você olha para trás e vê que, em 2008, a bolsa caiu 37% e a renda fixa subiu 20%. Vai para a renda fixa. Em 2009, ela perde 11% e a bolsa sobe 26%; você espera. Em 2010, renda fixa mais 8%, bolsa mais 15%. Convencido, vai para a bolsa em 2011, justo quando ela sobe 2% e a renda fixa, 16%. Volta para a renda fixa em 2012, que rende 3%, enquanto a bolsa sobe 16%.",
          "Resultado: US$ 100 viraram uns US$ 101 em quatro anos. A carteira 60/40, sem nenhuma decisão além de rebalancear uma vez por ano, chegou a US$ 149. Você não escolheu a pior classe; escolheu sempre a que tinha acabado de ganhar, e ficou com o pior das duas.",
        ],
      },
      {
        titulo: "No câmbio",
        paragrafos: [
          "No fim de 2024, com o dólar acima de R$ 6, dolarizar virou assunto de todo lado. Quem converteu ali, movido pela alta recente, viu o dólar cair cerca de 11% em 2025. Anos antes, entre 2003 e 2011, o real se valorizou tanto que dolarizar parecia um erro óbvio, e quem desistiu ali perdeu a alta dos anos seguintes.",
          "Nos dois casos, a decisão foi tomada olhando o retrovisor.",
        ],
      },
      {
        titulo: "Como se defender",
        paragrafos: [
          "Olhar janelas longas, de dez anos ou mais, antes de qualquer decisão. Seguir uma alocação definida e rebalancear, o que obriga a fazer o contrário da recência. E desconfiar da sensação de que agora é óbvio.",
        ],
      },
    ],
    exemplo: "Quem aplicou US$ 100 em janeiro de 2009 e foi trocando de classe, renda fixa em 2009 e 2010, bolsa em 2011 e renda fixa de novo em 2012, sempre guiado pelo resultado recente, terminou 2012 com uns US$ 101. A carteira 60/40, só rebalanceada, chegou a US$ 149. A bolsa sozinha, a US$ 171.",
    naPratica: "Julgar a dolarização pelo último ano do dólar é recência pura. A pergunta certa não muda com a cotação: quanto do seu patrimônio você quer que dependa de uma só moeda? Respondida com calma, ela vale tanto depois de um ano de dólar em alta quanto depois de um ano de dólar em queda.",
    relacionados: [
      "market-timing",
      "carteira-60-40",
      "efeito-manada",
      "vies-de-ancoragem",
      "retorno-do-investidor",
      "rebalanceamento",
      "heuristica",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "14:57" },
      { modulo: 0, aula: 3, tempo: "28:53" },
    ],
  },
  {
    slug: "regra-do-pico-fim",
    termo: "Regra do pico-fim",
    categoria: "Comportamento",
    apelidos: ["pico-fim", "efeito pico-fim"],
    resumo: "A lembrança de uma experiência fica marcada pelo momento mais intenso e pelo final, e não pela média de tudo o que aconteceu.",
    texto: [
      "Pense nas suas últimas férias. O que vem à memória não é a média dos dias, e sim o melhor momento e o último dia. Se a viagem terminou com um voo cancelado, ela parece pior do que foi. Se terminou com um jantar inesquecível, melhor.",
      "Essa é a regra do pico-fim: a lembrança de uma experiência fica marcada pelo momento mais intenso e pelo final, e não pela soma ou pela média de tudo o que aconteceu. A duração quase não conta.",
      "A memória, que é o que usamos para decidir o que fazer da próxima vez, guarda um resumo distorcido.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Num experimento de Kahneman e colegas, voluntários puseram a mão em água gelada duas vezes. Numa, ficaram 60 segundos numa temperatura dolorosa. Na outra, os mesmos 60 segundos e mais 30 numa água um pouco menos fria. A segunda experiência teve mais dor no total. Mesmo assim, quando perguntados qual repetiriam, a maioria escolheu a mais longa, porque terminava menos mal.",
          "Em estudos com pacientes que fizeram exames médicos desconfortáveis, a lembrança do exame dependia quase só do pior momento e do final, e não de quanto tempo ele tinha durado.",
        ],
      },
      {
        titulo: "Os dois eus",
        paragrafos: [
          "Kahneman separa o eu que vive a experiência, momento a momento, do eu que lembra e conta a história depois. É o segundo que toma as decisões. Por isso escolhemos repetir ou evitar experiências pela lembrança, e não pela experiência em si.",
        ],
      },
      {
        titulo: "No investimento",
        paragrafos: [
          "Uma carteira que rendeu bem por cinco anos e terminou com um mês ruim é lembrada como uma decepção. Um mês terrível pode apagar anos de bons resultados. E o investimento que deu um grande susto, mesmo que tenha se recuperado, fica marcado como perigoso.",
          "Isso pesa muito na dolarização. O mês em que o dólar caiu logo depois da compra vira a lembrança dominante, e não o resultado de anos. Quem saiu de um investimento no fundo de uma queda tende a lembrar dele pelo pico de dor, e nunca mais volta.",
        ],
      },
      {
        titulo: "Como se defender",
        paragrafos: [
          "Avaliar pelos números, e não pela lembrança. Olhar o resultado acumulado de períodos longos, e não o último mês. E registrar por escrito, na hora da decisão, por que ela foi tomada e o que se espera dela, para comparar depois com fatos e não com memórias.",
        ],
      },
    ],
    exemplo: "Hipotético: você mantém uma parte em dólar por quatro anos. Nos três primeiros, ela rende bem em reais. No último trimestre do quarto ano, o real se valoriza e a posição devolve parte do ganho. Na lembrança, o investimento em dólar foi uma dor de cabeça, embora o resultado dos quatro anos seja positivo e a posição tenha cumprido o papel de diversificar.",
    naPratica: "Avalie a parte em dólar por janelas longas e pelo papel que ela cumpre no patrimônio. Registrar por escrito o motivo da decisão ajuda a não reescrever a história pelo último susto. E evite tomar decisões de longo prazo logo depois de um mês ruim, quando o fim da experiência ainda está pesando sobre a memória.",
    relacionados: [
      "vies-de-recencia",
      "aversao-a-perda",
      "financas-comportamentais",
      "politica-de-investimento",
      "vies-de-retrospectiva",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "14:57" },
    ],
  },
  {
    slug: "home-bias",
    termo: "Home bias",
    categoria: "Comportamento",
    apelidos: ["viés doméstico", "viés de casa", "home-country bias", "preferir o que é familiar"],
    resumo: "A mania de deixar no próprio país uma fatia da carteira muito maior do que o peso desse país no mundo. Acontece em toda parte; o brasileiro está no extremo.",
    texto: [
      "O Brasil é perto de 0,5% do índice global de ações mais usado por investidores profissionais. Mesmo assim, o investidor brasileiro costuma ter quase todas as suas ações aqui. Ele não está sozinho: o americano, o japonês e o canadense fazem o mesmo, em escalas diferentes.",
      "Isso é home bias, ou viés doméstico: a mania de deixar no próprio país uma fatia da carteira muito maior do que o peso desse país no mundo. Acontece em toda parte. O brasileiro está no extremo.",
      "Em versão menor, aparece no dono de construtora que investe em imóveis e no executivo de petroleira que compra ações de óleo e gás. É o conforto do conhecido.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O termo ganhou força com um estudo de 1991 dos economistas Kenneth French e James Poterba. Eles mostraram que, no fim dos anos 1980, americanos e japoneses tinham mais de 90% das ações em empresas de casa, e os britânicos, mais de 80%, bem acima do peso desses mercados no mundo.",
          "Desde então, os economistas procuram um custo, um imposto ou uma barreira que explique um viés tão grande e tão teimoso. Nenhuma explicação racional dá conta sozinha. Sobra o comportamento: familiaridade, confiança excessiva no que se conhece e medo do desconhecido.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Dá para medir numa escala de zero a um: zero é quem investe com os pesos do mundo; um é quem deixa tudo em casa. Em 2008, a bolsa brasileira era 1,6% do mundo, e o brasileiro tinha 99% das suas ações aqui, o que dá 0,98 na escala. O americano tinha 77% em casa, num mercado que era um terço do mundo. O canadense, 80%, num mercado de menos de 3%.",
          "O viés vem caindo devagar. Pelos cálculos mais recentes da Vanguard, o canadense já está perto de 50% em casa, e o americano, perto de 81%, num mercado que hoje pesa mais no mundo do que em 2008.",
        ],
      },
      {
        titulo: "Não é o juro",
        paragrafos: [
          "A explicação mais comum no Brasil é o juro alto: para que ir para fora se aqui o CDI paga bem? O home bias derruba esse argumento. Ele existe em países de juro alto e de juro zero, de moeda forte e de moeda fraca. Em Bangladesh, na Índia, na Turquia e no Japão, a população também deixa quase tudo em casa.",
          "O juro alto pode reforçar o viés, mas não o cria. O que todos têm em comum é um traço humano, e não brasileiro.",
        ],
      },
      {
        titulo: "Por que é caro",
        paragrafos: [
          "Quem investe só em casa junta o risco da carteira ao risco do salário, do imóvel e da aposentadoria, todos do mesmo país. E abre mão de setores que quase não existem na bolsa local: no Brasil, tecnologia é praticamente zero no índice MSCI das ações brasileiras.",
        ],
      },
    ],
    exemplo: "Em 2008, a bolsa brasileira era 1,6% do mundo, e o brasileiro tinha 99% das suas ações aqui. Na escala de zero a um, isso dá 0,98. O americano tinha 77% em casa, num mercado que era um terço do mundo; o canadense, 80%, num mercado de menos de 3%. Todos com viés, o brasileiro quase no máximo.",
    naPratica: "A medida não aponta um alvo, e o curso não propõe um. Ninguém precisa investir com os pesos do mundo; há boas razões para manter mais em casa, como gastar em reais. Ela só mostra que ter tudo em casa já é uma aposta concentrada, e não um ponto de partida neutro. Diminuir o viés é uma decisão consciente, na dose que fizer sentido para você.",
    relacionados: [
      "risco-de-concentracao",
      "diversificacao",
      "msci-acwi",
      "capital-humano",
      "vies-do-status-quo",
      "msci-brazil",
      "excesso-de-confianca",
      "jurisdicao",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "15:56" },
    ],
  },
  {
    slug: "vies-de-confirmacao",
    termo: "Viés de confirmação",
    categoria: "Comportamento",
    apelidos: ["viés da confirmação"],
    resumo: "A tendência de procurar, notar e lembrar só as informações que confirmam o que você já pensa, e de desprezar as que contrariam.",
    texto: [
      "Quem acha que o Brasil vai dar errado lê cada notícia ruim como prova. Quem acha que vai dar certo, cada notícia boa. Os dois leem o mesmo jornal, na mesma manhã, e saem ainda mais convencidos do que já pensavam.",
      "Isso é o viés de confirmação: a tendência de procurar, notar, interpretar e lembrar as informações que confirmam o que você já pensa, e de desprezar as que contrariam.",
      "Em investimento, ele transforma uma tese em fé. Você para de procurar sinais de que pode estar errado, justamente os que mais importam.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Nos anos 1960, o psicólogo Peter Wason mostrou a pessoas a sequência 2, 4, 6 e pediu que descobrissem a regra por trás dela, testando outras sequências. A regra era só números em ordem crescente. Quase todos testaram apenas sequências que confirmavam o próprio palpite, como 8, 10, 12, e quase ninguém testou algo que pudesse derrubá-lo.",
          "Em outro estudo clássico, defensores e críticos da pena de morte leram os mesmos dois estudos, um a favor e um contra. Cada grupo achou o estudo favorável mais convincente e saiu da experiência mais firme na posição original.",
        ],
      },
      {
        titulo: "Como aparece no investimento",
        paragrafos: [
          "Você compra uma ação e passa a ler as análises que falam bem dela. Decide que o dólar vai subir e só presta atenção nas notícias de risco fiscal. Ou decide que não vai dolarizar e coleciona cada semana de real forte como prova.",
          "Hoje, o viés tem ajuda. Redes sociais, grupos de mensagem e algoritmos entregam mais do que você já curtiu. A dieta de informação de cada um vira um espelho.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Convicção não é o problema. Toda decisão precisa de alguma. O problema é a convicção que não aceita teste. Um investidor disciplinado sabe dizer, antes, o que o faria mudar de ideia.",
          "Também confunde a ideia de que estar bem informado protege. Pessoas mais informadas costumam ser melhores em achar argumentos para o que já acreditam.",
        ],
      },
      {
        titulo: "Como se defender",
        paragrafos: [
          "Procurar de propósito o melhor argumento contrário. Escrever, junto com a decisão, o que a invalidaria. E preferir estratégias que não dependem de uma tese estar certa.",
        ],
      },
    ],
    exemplo: "Hipotético: você decidiu não dolarizar porque o real ia se fortalecer. Cada semana de dólar em queda reforça a decisão; as semanas de alta viram ruído ou exceção. Três anos depois, você nem lembra mais quais eram os argumentos do outro lado, e a decisão, que era uma hipótese, virou identidade.",
    naPratica: "O curso insiste que o eixo não é decadência do Brasil, e sim concentração de risco. Isso protege da armadilha: não é preciso acertar uma tese sobre o país para diversificar, nem para um lado nem para o outro. Quem dolariza porque acha que o Brasil vai quebrar está tão exposto ao viés quanto quem não dolariza porque acha que o Brasil vai decolar.",
    relacionados: [
      "excesso-de-confianca",
      "vies-de-retrospectiva",
      "financas-comportamentais",
      "heuristica",
      "efeito-manada",
      "risco-de-concentracao",
    ],
  },
  {
    slug: "excesso-de-confianca",
    termo: "Excesso de confiança",
    categoria: "Comportamento",
    apelidos: ["overconfidence", "confiança excessiva"],
    resumo: "Superestimar o próprio conhecimento e a capacidade de prever. Leva a negociar demais, concentrar demais e subestimar riscos.",
    texto: [
      "Peça a motoristas que se avaliem e a grande maioria vai se dizer acima da média, o que é matematicamente impossível. Num estudo clássico com estudantes americanos, 93% se colocaram na metade mais habilidosa.",
      "Com investimentos é igual. Quase todo mundo acha que escolhe ações, fundos ou o momento do dólar melhor que os outros. Esse é o excesso de confiança: superestimar o próprio conhecimento e a própria capacidade de prever.",
      "Ele leva a negociar demais, concentrar demais e subestimar riscos. E é especialmente perigoso porque quem tem excesso de confiança raramente desconfia de si mesmo.",
    ],
    secoes: [
      {
        titulo: "Os números",
        paragrafos: [
          "Os economistas Brad Barber e Terrance Odean analisaram as contas de 66.465 famílias numa corretora americana entre 1991 e 1996. As que mais negociavam renderam 11,4% ao ano, contra 17,9% do mercado. A família média trocava 75% da carteira por ano. O título do estudo resume: negociar faz mal ao seu patrimônio.",
          "Em outro trabalho, os mesmos autores mostraram que homens negociavam bem mais que mulheres e, por isso, tinham resultado pior. Não por saberem menos, e sim por confiarem mais.",
        ],
      },
      {
        titulo: "As formas do viés",
        paragrafos: [
          "Acima da média: achar que você é melhor que os outros. Precisão demais: dar faixas estreitas demais para as próprias previsões, como ter certeza de que o dólar vai ficar entre R$ 5,40 e R$ 5,60 no fim do ano. Ilusão de controle: achar que acompanhar o mercado todo dia dá algum poder sobre ele.",
          "As três se alimentam de sucessos recentes. Acertar duas vezes a direção do câmbio parece prova de habilidade, embora uma moeda jogada para cima também acerte duas vezes seguidas com frequência.",
        ],
      },
      {
        titulo: "E os profissionais",
        paragrafos: [
          "Profissionais também caem. Nos 15 anos até 2025, 89,9% dos fundos ativos de ações de grandes empresas americanas ficaram atrás do S&P 500. No Brasil, nos dez anos até 2025, 90,8% dos fundos ativos de ações brasileiras perderam do índice de referência. Cada gestor achava que estaria entre os poucos que ganham.",
        ],
      },
      {
        titulo: "Como se defender",
        paragrafos: [
          "Anotar as previsões e conferir depois. Contar quantas vezes você acertou de verdade. E preferir estratégias que funcionam mesmo se você não souber prever nada.",
        ],
      },
    ],
    exemplo: "Hipotético: depois de acertar duas vezes a direção do dólar, um investidor passa a converter e desconverter a cada notícia. Cada ida e volta paga spread de câmbio e IOF, e eventualmente imposto sobre o ganho. A terceira previsão erra, e o custo acumulado das operações já tinha comido boa parte do que as duas primeiras renderam.",
    naPratica: "Ninguém acerta o câmbio com regularidade, nem os bancos que vivem disso. Uma estratégia que não depende de previsão, como uma alocação definida e conversão em parcelas, é mais robusta que confiar no próprio palpite. E, para a parte em bolsa lá fora, um fundo de índice barato dispensa a necessidade de ser melhor que os outros.",
    relacionados: [
      "vies-de-confirmacao",
      "market-timing",
      "gestao-ativa",
      "vies-de-retrospectiva",
      "alfa",
      "gestao-passiva",
      "custo-total",
    ],
  },
  {
    slug: "contabilidade-mental",
    termo: "Contabilidade mental",
    categoria: "Comportamento",
    apelidos: ["contas mentais", "gavetas mentais"],
    resumo: "Tratar o dinheiro como se estivesse em gavetas separadas, com regras diferentes para cada uma, mesmo sendo tudo do mesmo bolso.",
    texto: [
      "Você paga juros de cheque especial enquanto mantém, intocável, uma aplicação para as férias. Financeiramente, não faz sentido: o dinheiro é o mesmo, e o juro da dívida é bem maior que o rendimento. Mas a cabeça vê duas contas diferentes, com regras diferentes.",
      "Isso é contabilidade mental: tratar o dinheiro como se estivesse em gavetas separadas, com regras próprias para cada uma, mesmo sendo tudo do mesmo bolso. O nome foi dado por Richard Thaler, que ganhou o Nobel de Economia em 2017.",
      "Ela tem um lado ruim e um lado útil. Depende de como você usa.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Num experimento de Tversky e Kahneman, as pessoas imaginavam que iam ao teatro e, ao chegar, descobriam que tinham perdido uma nota do valor do ingresso. A grande maioria disse que compraria o ingresso mesmo assim. Em outra versão, tinham comprado o ingresso antes e perdido o ingresso. Aí, menos da metade compraria outro. A perda era a mesma; a gaveta, diferente.",
          "Thaler reuniu esses comportamentos numa teoria: as pessoas criam contas mentais por origem do dinheiro, por destino e por período, e as tratam como se não se misturassem.",
        ],
      },
      {
        titulo: "O lado ruim",
        paragrafos: [
          "Gastar com facilidade o dinheiro que parece extra, como o 13º salário, a restituição do imposto ou um ganho na bolsa, como se valesse menos que o salário. Arriscar demais com o lucro, porque ele parece dinheiro do cassino.",
          "Olhar cada investimento sozinho, e não o patrimônio inteiro. Uma parte em dólar pode parecer ruim isoladamente num ano de real forte, mesmo tendo cumprido o papel de reduzir o risco do conjunto.",
        ],
      },
      {
        titulo: "O lado útil",
        paragrafos: [
          "Separar dinheiro por objetivo ajuda a não gastar a reserva de emergência numa viagem e a aguentar a oscilação da parte de longo prazo. Uma gaveta chamada aposentadoria é mais fácil de deixar quieta numa crise do que uma gaveta chamada investimentos.",
          "Muitos planejadores usam isso de propósito: dividir o patrimônio em baldes, um para o curto prazo, outro para o médio, outro para o longo, cada um com o investimento adequado.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "As gavetas são úteis para o comportamento, mas o risco é de todas juntas. Uma carteira bem dividida em gavetas pode estar inteira no mesmo país e na mesma moeda.",
        ],
      },
    ],
    exemplo: "Hipotético: uma pessoa tem 30% do patrimônio em dólar e trata essa parte como aposta, conferindo a cotação todo dia e sofrendo com cada queda. Se pensasse nela como a gaveta da aposentadoria, com horizonte de 20 anos, olharia uma vez por ano, rebalancearia quando preciso e dormiria melhor, com exatamente o mesmo investimento.",
    naPratica: "Use a contabilidade mental a seu favor: uma gaveta para a reserva em reais, outra para objetivos com data, outra para o longo prazo, onde mora a dolarização. Mas olhe também o conjunto, que inclui salário, imóvel e previdência, porque o risco de concentração está na soma das gavetas, e não em nenhuma delas.",
    relacionados: [
      "reserva-de-emergencia",
      "horizonte-de-investimento",
      "capital-humano",
      "financas-comportamentais",
      "teoria-do-prospecto",
      "alocacao-de-ativos",
    ],
  },
  {
    slug: "efeito-disposicao",
    termo: "Efeito disposição",
    categoria: "Comportamento",
    resumo: "A tendência de vender cedo o que está dando lucro e segurar demais o que está dando prejuízo, à espera de voltar ao preço de compra.",
    texto: [
      "Você tem duas ações. Uma subiu 30%, a outra caiu 30%. Precisa de dinheiro e vai vender uma delas. Qual? A maioria vende a que subiu, para garantir o ganho, e guarda a que caiu, para não admitir a perda, esperando que ela volte.",
      "Esse é o efeito disposição: a tendência de vender cedo o que está dando lucro e segurar demais o que está dando prejuízo, à espera de voltar ao preço de compra. O nome foi dado pelos economistas Hersh Shefrin e Meir Statman, nos anos 1980.",
      "É filho direto da aversão à perda e do ponto de referência. Vender no prejuízo transforma uma perda de papel numa perda de verdade, e isso dói. Vender no lucro dá uma sensação de acerto.",
    ],
    secoes: [
      {
        titulo: "Os números",
        paragrafos: [
          "Terrance Odean analisou milhares de contas de uma corretora americana e encontrou o padrão com clareza: os investidores realizavam ganhos cerca de uma vez e meia mais que perdas. E escolhiam mal. As ações vencedoras que vendiam renderam, no ano seguinte, mais que as perdedoras que guardavam.",
          "Ou seja: além de não fazer sentido em teoria, o hábito custava dinheiro na prática.",
        ],
      },
      {
        titulo: "Por que não faz sentido",
        paragrafos: [
          "O mercado não sabe por quanto você comprou. O preço de compra é um número que só existe na sua cabeça e no seu extrato. A pergunta que importa é para onde cada investimento vai daqui para a frente, e se ele ainda cumpre um papel na carteira.",
          "Há ainda o imposto. Em muitos países, inclusive no Brasil, vender com prejuízo pode gerar um crédito para abater de ganhos futuros, enquanto vender com lucro gera imposto agora. A lógica fiscal costuma apontar para o lado oposto do instinto.",
        ],
      },
      {
        titulo: "Como aparece no câmbio",
        paragrafos: [
          "Com o dólar, o efeito disposição aparece de duas formas. Quem comprou caro espera voltar ao preço antes de fazer qualquer coisa, mesmo que a vida tenha mudado. Quem comprou barato sente vontade de realizar o ganho e trazer tudo de volta, embora a razão para ter dólar continue a mesma.",
          "Nos dois casos, quem decide é o preço de compra, e não o papel que a posição cumpre no patrimônio.",
        ],
      },
      {
        titulo: "Como se defender",
        paragrafos: [
          "Faça a pergunta do dinheiro na mão: se eu tivesse hoje o valor dessa posição em dinheiro, compraria a mesma coisa? Se a resposta for sim, a perda de papel não é motivo para vender. Se for não, o preço de compra não é motivo para segurar.",
        ],
      },
    ],
    exemplo: "Hipotético: o dólar comprado a R$ 5,80 está a R$ 5,20. O investidor decide só mexer quando voltar a R$ 5,80, mesmo que a necessidade dele tenha mudado e ele precise do dinheiro em reais para comprar um imóvel. Um ano depois, o dólar está a R$ 5,00, e a decisão continua presa a um número que só existe no extrato dele.",
    naPratica: "O mercado não sabe por quanto você comprou. Para a parte em dólar, a pergunta útil é se, com o dinheiro na mão hoje, você montaria a mesma posição. Rebalancear com regra escrita, vendendo o que passou da faixa e comprando o que ficou abaixo, independentemente do preço de compra, é a forma mais simples de neutralizar o efeito.",
    relacionados: [
      "aversao-a-perda",
      "teoria-do-prospecto",
      "vies-de-ancoragem",
      "compensacao-de-perdas",
      "rebalanceamento",
      "ganho-de-capital",
    ],
  },
  {
    slug: "vies-do-status-quo",
    termo: "Viés do status quo",
    categoria: "Comportamento",
    apelidos: ["status quo", "inércia", "ficar parado"],
    resumo: "A preferência por deixar as coisas como estão, mesmo quando mudar seria melhor. Não decidir parece neutro, mas também é uma decisão.",
    texto: [
      "Nos planos de previdência de empresas americanas, quando a adesão exige que o funcionário peça para entrar, muita gente nunca pede. Quando a adesão é automática e quem quiser sai, quase todo mundo fica. O plano é o mesmo, o salário é o mesmo, a decisão é a mesma. Só mudou o ponto de partida.",
      "Esse é o viés do status quo: a preferência por deixar as coisas como estão, mesmo quando mudar seria melhor. Não decidir parece neutro, seguro e sem responsabilidade. Mas também é uma decisão.",
      "O termo foi cunhado pelos economistas William Samuelson e Richard Zeckhauser em 1988.",
    ],
    secoes: [
      {
        titulo: "Os números",
        paragrafos: [
          "Num estudo que virou referência, Brigitte Madrian e Dennis Shea acompanharam uma grande empresa americana que passou a inscrever automaticamente os novos funcionários no plano de previdência. A participação dos recém-contratados, que era de menos da metade, saltou para 86%. E a maioria ficou com a contribuição e o investimento padrão escolhidos pela empresa.",
          "O mesmo padrão aparece na doação de órgãos. Em países onde todos são doadores a menos que digam o contrário, a taxa de adesão costuma ficar perto de 90% ou acima. Em países vizinhos e culturalmente parecidos, onde é preciso se registrar, fica muitas vezes abaixo de 20%.",
        ],
      },
      {
        titulo: "Por que acontece",
        paragrafos: [
          "Três forças se somam. A aversão à perda: o que você já tem pesa mais do que o que poderia ter. O arrependimento: errar por ter mudado dói mais do que errar por ter ficado parado. E o esforço: mudar dá trabalho, exige pesquisa, formulário, conta nova.",
          "Richard Thaler e Cass Sunstein usaram a ideia de forma construtiva: se as pessoas ficam no padrão, vale escolher bem o padrão. É a base do que eles chamaram de nudge, um empurrão gentil.",
        ],
      },
      {
        titulo: "No patrimônio do brasileiro",
        paragrafos: [
          "O viés do status quo reforça o viés doméstico. O patrimônio começa em reais porque a vida começa em reais: salário, conta no banco, CDB que o gerente ofereceu. E lá fica, sem que ninguém tenha escolhido.",
          "Abrir uma conta no exterior, entender o imposto e fazer a primeira remessa são pequenos obstáculos. Cada um sozinho é fácil. Juntos, bastam para que a decisão fique para o mês que vem, todo mês.",
        ],
      },
    ],
    exemplo: "Hipotético: um investidor estuda o tema por três anos, lê, assiste a cursos, concorda com os argumentos e não converte nada, sempre esperando um momento melhor, uma cotação mais baixa ou uma regra mais clara. A inércia decidiu por ele: 100% em reais. Se fosse o contrário, se ele já tivesse 20% em dólar, provavelmente também deixaria como está.",
    naPratica: "Quanto dolarizar é escolha de cada um, e zero é uma resposta legítima. O problema não é o zero, é chegar nele sem ter decidido. Uma forma de vencer a inércia é criar o seu próprio padrão: decidir uma vez a fatia e o calendário de conversões, automatizar o que der, e passar a exigir um motivo para mudar, e não para começar.",
    relacionados: [
      "home-bias",
      "aversao-ao-arrependimento",
      "custo-medio",
      "politica-de-investimento",
      "aversao-a-perda",
      "previdencia",
      "conta-global",
    ],
  },
  {
    slug: "vies-de-retrospectiva",
    termo: "Viés de retrospectiva",
    categoria: "Comportamento",
    apelidos: ["hindsight bias", "eu já sabia", "efeito eu já sabia"],
    resumo: "A sensação, depois que algo acontece, de que era previsível desde o começo. Faz o investidor confiar demais na própria capacidade de prever.",
    texto: [
      "Depois de 2008, todo mundo sabia que havia uma bolha imobiliária nos Estados Unidos. Depois da pandemia, todo mundo sabia que um vírus podia parar o mundo. Antes, quase ninguém agiu. A memória reescreve o passado para que ele pareça óbvio.",
      "Isso é o viés de retrospectiva: a sensação, depois que algo acontece, de que era previsível desde o começo. É o famoso eu sabia.",
      "O perigo é a lição que ele ensina. Se o passado parece ter sido previsível, o futuro também parece, e o investidor passa a apostar em previsões.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1972, antes de o presidente americano Richard Nixon viajar à China e à União Soviética, o psicólogo Baruch Fischhoff e uma colega pediram a voluntários que estimassem a chance de vários resultados da viagem. Depois da viagem, pediram que lembrassem o que tinham estimado. As pessoas lembravam ter dado probabilidades mais altas para o que de fato aconteceu, e mais baixas para o que não aconteceu.",
          "A mente não guarda a incerteza que havia antes. Guarda o resultado e reconstrói o caminho até ele.",
        ],
      },
      {
        titulo: "Como aparece no investimento",
        paragrafos: [
          "Em novembro de 2008, a rainha Elizabeth II, visitando a London School of Economics, perguntou aos economistas por que ninguém tinha visto a crise chegar. A pergunta ficou famosa porque, olhando para trás, tudo parecia claro. Na época, os sinais estavam misturados com muitos outros que não deram em nada.",
          "Com gráficos, o viés é ainda mais forte. Uma série histórica mostra só o caminho que aconteceu, e não os mil caminhos que pareciam possíveis em cada ponto dela.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Aprender com o passado é útil; achar que ele era previsível, não. A lição certa de uma crise costuma ser sobre o risco que estava lá, e não sobre a data em que ele se materializou.",
          "O viés também é injusto com as decisões. Uma boa decisão pode ter um resultado ruim, e uma má decisão, um resultado bom. Julgar só pelo resultado faz repetir sortes e abandonar bons processos.",
        ],
      },
      {
        titulo: "Como se defender",
        paragrafos: [
          "Registrar por escrito, no momento da decisão, o que você sabia, o que esperava e com que grau de certeza. Depois, comparar com o que aconteceu. É um jeito simples de descobrir quanto do passado era de fato previsível.",
        ],
      },
    ],
    exemplo: "Hipotético: olhando o gráfico do dólar de 1994 a 2026, a alta parece uma escada óbvia. No caminho, porém, houve anos longos de real forte, como de 2003 a 2011, quando o dólar caiu de cerca de R$ 3,50 para R$ 1,53, em julho de 2011, e dolarizar parecia um erro evidente. Quem diz hoje que era óbvio provavelmente não estava comprando dólar em 2008.",
    naPratica: "Os gráficos do curso mostram o passado, não garantem o futuro. O argumento para diversificar não depende de o dólar subir: depende justamente de não saber o que vai acontecer. Se você tivesse certeza do futuro, concentraria tudo no vencedor. Como ninguém tem, espalha.",
    relacionados: [
      "excesso-de-confianca",
      "vies-de-confirmacao",
      "cisne-negro",
      "market-timing",
      "crise-de-2008",
      "regra-do-pico-fim",
    ],
  },
  {
    slug: "aversao-ao-arrependimento",
    termo: "Aversão ao arrependimento",
    categoria: "Comportamento",
    apelidos: ["medo de errar", "arrependimento", "medo de se arrepender"],
    resumo: "Evitar decisões para não sentir o arrependimento de ter errado. Paralisa: não converter o dólar hoje porque ele pode cair amanhã.",
    texto: [
      "Paulo tem ações da empresa A. Pensou em trocar pelas da empresa B, mas não trocou, e descobriu que teria ganho R$ 12 mil. Jorge tinha ações da B, trocou pelas da A e descobriu que, se tivesse ficado, teria ganho os mesmos R$ 12 mil. Quem se sente pior? Quase todo mundo responde Jorge.",
      "Errar por ter agido costuma doer mais que errar por ter ficado parado. Esse é o coração da aversão ao arrependimento: evitar decisões para não sentir o arrependimento de ter errado.",
      "Ela paralisa. Não converter o dólar hoje porque ele pode cair amanhã. Não vender o que caiu porque pode voltar. Não fazer nada porque fazer algo poderia dar errado.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A história de Paulo e Jorge é uma versão de um exemplo de Kahneman e Tversky. Na pesquisa original, mais de 90% das pessoas disseram que quem trocou de ação se sentia pior. O resultado financeiro era idêntico; o que mudava era a sensação de responsabilidade.",
          "Outros estudos mostram o mesmo efeito em lugares inesperados. Medalhistas de bronze em Olimpíadas costumam parecer mais felizes no pódio que os de prata. O de prata pensa no ouro que quase teve; o de bronze, na medalha que quase não teve.",
        ],
      },
      {
        titulo: "Até Markowitz",
        paragrafos: [
          "Harry Markowitz, o economista que ganhou o Nobel por criar a teoria moderna de carteiras, contou anos depois como dividiu a própria previdência. Em vez de fazer as contas que ele mesmo tinha inventado, imaginou o arrependimento se a bolsa subisse muito e ele estivesse fora, ou caísse muito e ele estivesse todo dentro. Pôs metade em ações e metade em títulos, para minimizar o arrependimento futuro.",
          "A escolha não foi irracional. Foi humana, e mostra que até quem entende a teoria decide com a emoção na mesa.",
        ],
      },
      {
        titulo: "Como funciona no dinheiro",
        paragrafos: [
          "O efeito é mais forte quando a decisão é grande, rara e de uma vez só, como converter uma parte relevante do patrimônio para outra moeda. Se der errado, não há outra decisão para diluir o erro.",
          "Ele também se mistura com o status quo. Ficar parado parece não ser uma escolha, e por isso parece não gerar culpa. Mas ficar 100% em reais também é uma escolha, só que menos visível.",
        ],
      },
      {
        titulo: "Como se defender",
        paragrafos: [
          "Dividir a decisão em partes reduz o tamanho de cada possível arrependimento. Escrever o raciocínio antes ajuda a julgar depois o processo, e não só o resultado.",
        ],
      },
    ],
    exemplo: "Hipotético: com R$ 120 mil para converter, um investidor adia por medo de pegar o pior dia e se culpar depois. Em 12 parcelas mensais de R$ 10 mil, nenhuma conversão sozinha pode ser o grande erro. Se o dólar cair depois da primeira, a próxima compra mais barato. Se subir, a primeira já foi feita.",
    naPratica: "As janelas de conversão da aula 4 funcionam também como remédio para o arrependimento: abrem mão do melhor dia para escapar do pior e tiram a decisão do campo da emoção. Fazer como Markowitz, dividindo para dormir tranquilo, é legítimo. O que não vale é deixar o medo do arrependimento decidir por você que a resposta é nunca.",
    relacionados: [
      "custo-medio",
      "aversao-a-perda",
      "vies-do-status-quo",
      "market-timing",
      "diversificacao",
      "teoria-do-prospecto",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "1:23" },
    ],
  },
  {
    slug: "bolha",
    termo: "Bolha",
    categoria: "Comportamento",
    apelidos: ["bolhas", "bolha especulativa", "bolha da internet", "bolha imobiliária"],
    resumo: "Quando o preço de um ativo sobe muito acima do que os fundamentos justificam, puxado pela expectativa de que vai continuar subindo, até que estoura.",
    texto: [
      "Na Holanda do século 17, bulbos de tulipa raros chegaram a ser negociados por preços de casas. Em fevereiro de 1637, os compradores sumiram e os preços desabaram em semanas. Em todos os casos parecidos, a lógica é a mesma: as pessoas compram porque o preço sobe, e o preço sobe porque as pessoas compram.",
      "Uma bolha é isso. O preço de um ativo sobe muito acima do que os fundamentos justificam, puxado pela expectativa de que vai continuar subindo, até que estoura.",
      "Bolhas são fáceis de ver depois e difíceis de identificar antes, porque sempre há uma história convincente de que desta vez é diferente.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Quase toda bolha começa com uma novidade real: uma tecnologia, um mercado novo, uma mudança de juros. Os primeiros investidores ganham, a notícia se espalha, e entra gente que compra não pelo negócio, e sim pela alta. Crédito fácil acelera tudo. Em algum momento, faltam compradores novos, e a queda alimenta mais queda.",
          "Em dezembro de 1996, o então presidente do Fed, Alan Greenspan, perguntou em público se a bolsa americana não estaria com exuberância irracional. O Nasdaq ainda mais que triplicaria antes do pico. Bolhas podem durar muito mais do que parece razoável.",
        ],
      },
      {
        titulo: "Casos reais",
        paragrafos: [
          "Japão: no fim de 1989, o índice Nikkei fechou perto de 38.916 pontos, e os terrenos em volta do palácio imperial de Tóquio valiam, segundo as contas da época, mais que todo o estado da Califórnia. O índice só voltou ao pico em 2024, 34 anos depois.",
          "Internet: em março de 2000, 87% do Nasdaq 100 estava em tecnologia e comunicações, e empresas sem lucro valiam bilhões. O índice caiu 64% nos 21 meses seguintes, e o Nasdaq amplo levou até 2015 para recuperar o topo.",
          "Imóveis americanos: os preços subiram até 2006 sob a crença de que nunca caíam em todo o país ao mesmo tempo. Caíram, e a crise de 2008 nasceu ali.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "O Brasil teve a sua bolha clássica logo no começo da República. Entre 1889 e 1891, crédito farto e emissão de moeda alimentaram uma febre de abertura de empresas e de especulação na bolsa do Rio, que ficou conhecida como Encilhamento. Muitas das empresas só existiam no papel. A quebra veio rápida e deixou inflação e falências.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Nem toda alta forte é bolha. Às vezes os fundamentos mudaram de verdade. E nem toda bolha estoura com uma queda total: algumas desinflam devagar, ao longo de anos de preço parado.",
        ],
      },
    ],
    exemplo: "Em março de 2000, 87% do Nasdaq 100 estava em tecnologia e comunicações. O índice caiu 64% nos 21 meses seguintes. Hipotético: quem tinha toda a carteira de ações nesse índice viu R$ 100 mil virarem R$ 36 mil; quem tinha uma fatia de 10% do patrimônio nele perdeu 6,4% do total e seguiu em frente.",
    naPratica: "Ninguém precisa adivinhar bolhas para se proteger delas: basta não concentrar o patrimônio numa única tese, setor ou país. Trocar a concentração brasileira por uma concentração em tecnologia americana, em criptomoedas ou em qualquer tema da moda não resolve o problema. Diversificar é justamente a forma de não depender de saber qual é a próxima bolha.",
    relacionados: [
      "efeito-manada",
      "nasdaq",
      "risco-de-concentracao",
      "afrouxamento-quantitativo",
      "crise-de-2008",
      "drawdown",
      "vies-de-retrospectiva",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "14:31" },
      { modulo: 1, aula: 3, tempo: "22:51" },
    ],
  },
];

import type { Verbete } from "@/lib/glossario";

// Verbetes: Ações, Fundos e ETFs. Separados por bloco de categorias em 07/out/2026 para a revisão
// paralela (um agente por arquivo). 43 verbetes, reescritos como artigos curtos em 07/out/2026
// (abertura em `texto`, seções com intertítulo em `secoes`, exemplo e "na prática").
export const VERBETES_ACOES_FUNDOS: Verbete[] = [
  {
    slug: "acao",
    termo: "Ação",
    categoria: "Ações",
    apelidos: [
      "ações",
      "ação americana",
      "ações americanas",
      "ações brasileiras",
      "ação brasileira",
      "acionista",
      "acionistas",
    ],
    resumo: "Um pedaço de uma empresa. Quem tem ações é sócio: participa do lucro, por dividendos ou pela valorização, e do risco do negócio.",
    texto: [
      "Uma empresa vale R$ 1 bilhão e está dividida em 100 milhões de ações. Cada ação é um pedaço de R$ 10 dela. Se você compra 1.000 ações, vira dono de uma fatia pequena do negócio: tem direito a uma parte do lucro e, em muitos casos, a votar em assembleia.",
      "Ação é isso: um pedaço de uma empresa. O ganho vem de dois lugares. Um são os dividendos, a parte do lucro que a empresa distribui. O outro é a valorização, quando o mercado passa a pagar mais pela ação porque a empresa cresceu ou porque o humor mudou. A perda também vem de dois lugares: o preço pode cair muito, e a empresa pode quebrar.",
      "No longo prazo, ações costumam render mais que títulos de dívida, como pagamento pelo risco maior. No curto prazo, oscilam bastante, e às vezes por anos seguidos. Entender essa troca é o primeiro passo para decidir quanto do patrimônio cabe em bolsa, aqui ou lá fora.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A ação negociável nasceu em Amsterdã, em 1602, com a Companhia Holandesa das Índias Orientais. Mandar navios à Ásia era caro e arriscado demais para um só dono. A solução foi dividir o negócio em muitas partes, vender cada parte a quem quisesse e deixar que essas partes mudassem de mão. Nascia, junto, a primeira bolsa.",
          "Duas ideias daquela época continuam no centro de tudo. A primeira é a responsabilidade limitada: o acionista pode perder o que pôs, mas não responde pelas dívidas da empresa com o próprio patrimônio. A segunda é a liquidez: você não precisa esperar a empresa acabar para reaver o dinheiro, basta vender a ação para outra pessoa.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "No Brasil, há dois tipos principais. As ordinárias, de código terminado em 3, dão direito a voto. As preferenciais, terminadas em 4, em geral não votam, mas têm prioridade no recebimento de dividendos. A Lei das S.A. obriga a distribuir aos acionistas um mínimo do lucro ajustado, definido no estatuto; o piso usual é de 25%.",
          "Nos Estados Unidos, a regra é outra. Não há dividendo mínimo obrigatório, e muitas empresas preferem devolver dinheiro recomprando as próprias ações. Também há empresas com classes de ações de votos diferentes, em que o fundador mantém o controle com uma fatia pequena do capital.",
          "Em qualquer país, o preço de uma ação é o encontro entre quem quer comprar e quem quer vender. No longo prazo, ele tende a seguir o lucro da empresa. No curto, segue também o medo, a euforia e os juros.",
        ],
      },
      {
        titulo: "O risco de uma ação só",
        paragrafos: [
          "A maior parte do risco de uma ação isolada é dela mesma: um produto que falha, um escândalo, uma dívida mal feita. Esse risco some quando você tem muitas empresas. O que não some é o risco do mercado inteiro, que cai junto numa crise.",
          "Um caso conhecido: quem comprou ações da General Electric no pico de agosto de 2000, perto de US$ 60, viu o papel perder perto de 90% até março de 2009. Era uma das empresas mais admiradas do mundo. É por isso que fundos de índice e ETFs, que compram centenas de empresas de uma vez, viraram o caminho padrão para quem não quer depender de uma aposta.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "A bolsa brasileira tem poucas centenas de empresas, concentradas em bancos, petróleo, mineração e energia. Nos Estados Unidos, há milhares, de quase todos os setores, inclusive os que mal existem aqui, como software, semicondutores e boa parte da saúde.",
          "O tamanho não garante retorno melhor. O Japão é o lembrete: o índice Nikkei atingiu o pico em dezembro de 1989 e só voltou a esse nível em fevereiro de 2024, 34 anos depois. Quem estava concentrado num único mercado esperou uma geração.",
        ],
      },
    ],
    exemplo: "Na aula, Rodolfo lembra que o S&P 500 rendeu de 6% a 11% ao ano em dólar, conforme a janela, sem contar dividendos. Em 2008, o índice caiu 37%, já contando os dividendos. Hipotético: quem tinha US$ 100 mil no índice no começo daquele ano terminou com perto de US$ 63 mil, e precisou de mais de quatro anos, com os dividendos reinvestidos, para voltar ao valor inicial.",
    naPratica: "Ações americanas e de outros países dão acesso a setores que quase não existem na bolsa brasileira. É a via de dolarizar com ativos que geram lucro e renda, e não com dinheiro parado. O preço da escolha é a oscilação: a parte em ações precisa ser dinheiro que pode esperar anos, e a decisão de quanto pôr em cada país pesa mais que a escolha de cada papel.",
    relacionados: [
      "renda-variavel",
      "dividendo",
      "bolsa-de-valores",
      "sp-500",
      "valuation",
      "risco-sistematico",
      "etf",
      "diversificacao",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "13:04",
      },
      {
        modulo: 0,
        aula: 4,
        tempo: "8:05",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "4:30",
      },
    ],
  },
  {
    slug: "renda-variavel",
    termo: "Renda variável",
    categoria: "Ações",
    apelidos: [
      "renda variável americana",
      "ativos de renda variável",
    ],
    resumo: "Investimentos cujo retorno não é combinado de antemão e depende do desempenho do ativo e do mercado, como ações, fundos imobiliários e ETFs de ações.",
    texto: [
      "Você aplica R$ 10 mil num CDB e já sabe a regra: tanto por cento do CDI, pago no vencimento, se o banco honrar. Você aplica os mesmos R$ 10 mil numa ação e não sabe nada disso. Nem quanto vai receber de dividendos, nem por quanto vai conseguir vender. Essa é a diferença entre renda fixa e renda variável.",
      "Renda variável é todo investimento cujo retorno não é combinado de antemão. Depende do desempenho do ativo e do humor do mercado. Ações, fundos de ações, ETFs, fundos imobiliários e REITs são os exemplos mais comuns. O resultado pode ser muito maior ou muito menor que o de um título.",
      "No Brasil, o termo virou quase sinônimo de bolsa. Mas a fronteira é mais borrada do que parece, e entender onde ela fica ajuda a montar uma carteira mais honesta com o próprio risco.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Na renda fixa, você empresta dinheiro e recebe juros. O risco principal é o devedor não pagar. Na renda variável, você vira sócio. Não há promessa: o dinheiro que volta depende do lucro do negócio e do preço que outra pessoa aceita pagar pela sua parte.",
          "Em troca dessa incerteza, o investidor exige um retorno esperado maior. É o prêmio de risco das ações. Ele não aparece todo ano, e às vezes some por uma década, mas é a razão de existir da bolsa como investimento de longo prazo.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Renda fixa não quer dizer preço fixo. Um título prefixado longo, vendido antes do vencimento, pode oscilar tanto quanto uma ação: se os juros sobem, o preço dele cai. É a marcação a mercado. Quem só olha o rótulo se assusta com o extrato.",
          "O contrário também vale. Uma ação de empresa madura, que paga e aumenta dividendos há décadas, pode servir de fonte de renda. Na aula 4, Rodolfo usa essa ideia: se o dividendo paga a escola dos filhos, a ação cumpre o papel de renda, mesmo que o preço dela suba e desça.",
          "O que separa as duas classes, no fim, é a natureza do compromisso. O cupom de um título é obrigação. O dividendo de uma ação, não.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Em 2008, o S&P 500 caiu 37% em dólar, contando os dividendos. No mesmo ano, o título de 10 anos do Tesouro americano rendeu cerca de 20%, porque os investidores correram para a segurança. Em 2009, os papéis se inverteram: a bolsa subiu 26% e o título caiu. É esse contraste que faz das duas classes boas companheiras numa mesma carteira.",
          "No Brasil, de 2010 a 2025, o Ibovespa rendeu cerca de 5,5% ao ano e o CDI, cerca de 9,7%. Foi um período em que a renda variável brasileira não pagou o risco. Em outros períodos, pagou. A lição é que o prêmio existe na média de muitos anos e muitos mercados, não em qualquer janela de um país só.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "A pergunta útil não é se renda variável é boa ou ruim, e sim quanto dela você aguenta carregar na pior semana. Rodolfo insiste nisso: a estratégia vive ou morre na semana em que a carteira cai 10%, 15%, 20%, e não na planilha.",
          "Por isso a fatia de renda variável depende do prazo, da reserva de emergência e do quanto da sua renda já está exposto ao mesmo risco.",
        ],
      },
    ],
    exemplo: "Hipotético: R$ 10 mil numa ação podem virar R$ 15 mil ou R$ 6 mil em um ano. R$ 10 mil num pós-fixado de 12% viram R$ 11.200, se o emissor pagar. Numa carteira com metade em cada um, os extremos ficam mais estreitos: algo entre R$ 8.600 e R$ 13.100. Menos sonho, menos susto.",
    naPratica: "Ter renda variável lá fora soma dois riscos: o da bolsa e o do câmbio. Às vezes eles se compensam, como em 2008, quando o dólar subiu enquanto as ações caíam; às vezes se somam. A fatia certa é aquela que você consegue carregar na pior semana, porque é nela que a decisão é testada.",
    relacionados: [
      "acao",
      "renda-fixa",
      "volatilidade",
      "tolerancia-ao-risco",
      "etf",
      "premio-de-risco",
      "marcacao-a-mercado",
      "drawdown",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 3,
        tempo: "4:57",
      },
      {
        modulo: 1,
        aula: 1,
        tempo: "35:10",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "32:00",
      },
    ],
  },
  {
    slug: "bolsa-de-valores",
    termo: "Bolsa de valores",
    categoria: "Ações",
    apelidos: [
      "bolsa",
      "bolsas",
      "bolsas de valores",
      "B3",
      "Nyse",
      "New York Stock Exchange",
      "bolsa americana",
      "pregão",
      "pregões",
    ],
    resumo: "O mercado organizado onde se compram e vendem ações, ETFs e outros ativos. No Brasil, a B3; nos Estados Unidos, principalmente a Nyse e a Nasdaq.",
    texto: [
      "Quando você compra uma ação pelo aplicativo da corretora, a ordem não vai para a empresa. Vai para uma bolsa, onde encontra alguém disposto a vender pelo mesmo preço. A bolsa organiza esse encontro, registra o negócio e garante que o dinheiro e as ações troquem de mãos.",
      "Bolsa de valores é esse mercado organizado, com regras, horários e fiscalização, onde se negociam ações, ETFs, fundos imobiliários e outros ativos. No Brasil, há uma única bolsa, a B3, em São Paulo. Nos Estados Unidos, as maiores são a Nyse, em Wall Street, e a Nasdaq.",
      "A diferença de tamanho entre as duas pontas é enorme, e é um dos argumentos centrais do curso: quem investe só na B3 escolhe entre uma fração pequena das empresas do mundo.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A Bolsa de Nova York nasceu de um acordo assinado em 1792 por 24 corretores, sob uma árvore de Wall Street, para negociar entre si com comissões combinadas. A Nasdaq surgiu em 1971 como a primeira bolsa eletrônica, sem pregão físico, e virou a casa de boa parte das empresas de tecnologia.",
          "No Brasil, a origem é a Bolsa Livre de São Paulo, de 1890. Depois de muitas fusões, a Bovespa se uniu à BM&F em 2008 e, em 2017, à Cetip, formando a B3. Por isso a mesma empresa cuida de ações, derivativos e do registro de títulos de renda fixa.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "A bolsa é o mercado secundário: quem compra paga a quem vende, e a empresa não recebe nada. A empresa só recebe dinheiro no mercado primário, quando emite ações novas, por exemplo numa oferta inicial, o IPO.",
          "Cada ordem entra num livro de ofertas. A ordem a mercado executa pelo melhor preço disponível; a ordem limitada só executa no preço que você definiu ou melhor. Em dias de muito nervosismo, a ordem limitada evita surpresas.",
          "Depois do negócio vem a liquidação, a troca efetiva de dinheiro e ativo. Na B3, ela acontece dois dias úteis depois. Nos Estados Unidos, desde maio de 2024, um dia útil depois.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "No fim de 2025, as empresas listadas nos Estados Unidos valiam US$ 68,9 trilhões, 43,7% de todas as bolsas do mundo. As da B3, perto de US$ 0,85 trilhão. Pela mesma proporção, para cada dólar de ações listadas aqui havia mais de 80 lá.",
          "Na aula, Rodolfo fala também em liquidez, a facilidade de vender rápido sem derrubar o preço. Um mercado maior tem mais compradores e vendedores para cada papel, o que reduz o custo de entrar e sair.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Bolsa e índice não são a mesma coisa. Quando o noticiário diz que a bolsa caiu 2%, está falando de um índice, como o Ibovespa ou o S&P 500, e não de todas as ações listadas.",
          "E tamanho não é qualidade. Um mercado maior oferece mais setores, mais prazos e mais liquidez, mas pode estar caro ou concentrado. O argumento do curso não é que a bolsa americana seja melhor, e sim que ficar só numa bolsa pequena é uma aposta concentrada.",
        ],
      },
    ],
    exemplo: "Pela proporção do fim de 2025, para cada dólar de ações listadas na B3 havia mais de 80 nas bolsas americanas. A Nvidia sozinha valia mais que a bolsa brasileira inteira. Hipotético: se você tivesse de montar uma carteira com uma empresa de cada setor relevante da economia mundial usando só a B3, ficaria sem opção em vários deles.",
    naPratica: "Quem investe só na B3 escolhe entre uma fração pequena das empresas do mundo. Acessar outras bolsas pode ser feito por conta no exterior, por BDRs ou por ETFs listados aqui, cada caminho com custos e impostos próprios, tema do Módulo III. Um mercado maior não é necessariamente melhor, mas oferece mais setores, mais prazos e mais liquidez.",
    relacionados: [
      "acao",
      "ibovespa",
      "sp-500",
      "nasdaq",
      "liquidez",
      "capitalizacao-de-mercado",
      "circuit-breaker",
      "home-bias",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "8:05",
      },
      {
        modulo: 0,
        aula: 1,
        tempo: "3:49",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "0:00",
      },
    ],
  },
  {
    slug: "dividendo",
    termo: "Dividendo",
    categoria: "Ações",
    apelidos: [
      "dividendos",
      "proventos",
      "pagadoras de dividendos",
      "boas pagadoras",
      "dividendo crescente",
      "juros sobre capital próprio",
    ],
    resumo: "A parte do lucro que a empresa distribui aos acionistas, em dinheiro. Ao contrário do cupom de um título, não é obrigação: o conselho pode aumentar, manter ou cortar.",
    texto: [
      "Uma empresa lucrou R$ 1 bilhão no ano. Parte ela reinveste no negócio; parte entrega aos sócios. Essa parte entregue, paga por ação, é o dividendo. Se você tem 1% das ações, recebe 1% do que foi distribuído.",
      "Ao contrário do cupom de um título, o dividendo não é obrigação. O conselho da empresa decide quanto pagar e quando, de acordo com o lucro, o caixa e os planos de investimento. Pode aumentar, manter ou cortar.",
      "Para quem pensa em renda, o dividendo é a parte mais visível do retorno de uma ação. Mas não é a única, e nem sempre a mais importante.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O conselho anuncia o valor por ação e uma data de corte. Quem tem a ação até essa data recebe. No dia seguinte, a ação passa a ser negociada ex-dividendo, e o preço tende a cair mais ou menos pelo valor pago. Por isso comprar uma ação só para pegar o dividendo não gera ganho: o dinheiro sai de um bolso e entra no outro.",
          "Nos Estados Unidos, a maioria das empresas paga a cada trimestre, em datas regulares. No Brasil, os pagamentos são menos padronizados, e há os juros sobre capital próprio, uma forma parecida de distribuir lucro que a empresa pode abater do imposto dela.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "A Lei das S.A. obriga as empresas brasileiras a distribuir um mínimo do lucro, definido no estatuto, em geral 25%. Nos Estados Unidos, não há mínimo, e muitas empresas preferem recomprar ações a pagar dividendos.",
          "O imposto também mudou. Por décadas, o dividendo foi isento para a pessoa física no Brasil. Desde janeiro de 2026, pela Lei 15.270, há retenção de 10% quando uma mesma empresa paga mais de R$ 50 mil num mês à mesma pessoa. E, pela Lei Complementar 224, de 2025, os juros sobre capital próprio passaram a ter 17,5% retidos na fonte.",
          "O dividendo americano pago a quem mora no Brasil chega com 30% retidos nos Estados Unidos, porque os dois países não têm tratado para evitar a dupla tributação. Como isso conversa com o imposto brasileiro é tema do Módulo III.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Dividendo não é dinheiro de graça. Em teoria, uma empresa que paga R$ 1 por ação vale R$ 1 a menos depois do pagamento, e quem preferisse renda poderia vender um pedaço das ações e obter o mesmo resultado. Na prática, impostos, custos e disciplina fazem a forma de pagamento importar, mas o retorno total é o que conta.",
          "E dividendo alto não é sinônimo de empresa boa. Muitas vezes reflete uma empresa madura, sem onde reinvestir, ou um preço que caiu porque o mercado já espera um corte.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em fevereiro de 2009, no auge da crise financeira, o JPMorgan cortou o dividendo trimestral de US$ 0,38 para US$ 0,05 por ação. Era um dos bancos mais sólidos dos Estados Unidos. Quem vivia daquele dividendo viu a renda cair a perto de um oitavo de um trimestre para o outro.",
          "O corte não foi exceção. Em crises fortes, bancos e empresas cíclicas cortam primeiro. É o momento em que o dividendo mais faz falta e o preço da ação está mais baixo, o que obriga a vender barato quem não tem outra reserva.",
        ],
      },
    ],
    exemplo: "Hipotético: você tem US$ 100 mil numa carteira de ações americanas que paga 2% ao ano em dividendos. São US$ 2 mil brutos. Com 30% retidos nos Estados Unidos, chegam US$ 1.400. Se a crise vier e as empresas cortarem um terço do pagamento, a renda cai para perto de US$ 930, no mesmo ano em que o valor da carteira também encolhe.",
    naPratica: "Uma carteira de empresas que pagam e aumentam dividendos pode cumprir o papel de renda em dólar, desde que tenha empresas suficientes para aguentar o corte de algumas delas. O dividendo é fluxo, mas não é garantia. E, para quem mora no Brasil, a forma como o lucro volta, dividendo ou recompra, muda o imposto, por isso o retorno deve ser comparado depois dos impostos.",
    relacionados: [
      "dividend-yield",
      "dividend-aristocrats",
      "suavizacao-de-dividendos",
      "recompra-de-acoes",
      "cupom",
      "imposto-retido-nos-eua",
      "dupla-tributacao",
      "reit",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "11:53",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "5:25",
      },
    ],
  },
  {
    slug: "dividend-yield",
    termo: "Dividend yield",
    categoria: "Ações",
    apelidos: [
      "dividendos, % do preço",
      "rendimento de dividendos",
      "taxa de dividendos",
    ],
    resumo: "Os dividendos pagos em 12 meses divididos pelo preço da ação. Diz quanto a ação rende em dinheiro, em percentual, a quem a compra hoje.",
    texto: [
      "Uma ação custa R$ 50 e pagou R$ 3 de dividendos nos últimos 12 meses. O dividend yield, ou rendimento de dividendos, é de 6%. É quanto a ação rende em dinheiro, em percentual, para quem a compra hoje, se os pagamentos se repetirem.",
      "O indicador é útil para comparar o rendimento em dinheiro de ações diferentes, ou de uma bolsa inteira. Também é perigoso, porque um número alto pode significar coisas opostas: um pagamento generoso ou um preço que despencou.",
      "Para ler o yield direito, é preciso olhar o que está por trás dele: o setor, o estágio da empresa, a política de recompras e o risco do país.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A conta é simples: dividendos pagos em 12 meses divididos pelo preço atual. Há variações. Algumas casas usam o dividendo projetado para os próximos 12 meses; outras multiplicam o último pagamento trimestral por quatro.",
          "Como o preço está no denominador, o yield sobe quando o preço cai. Se a ação de R$ 50 cai para R$ 30 e o dividendo continua R$ 3, o yield vai a 10%. Mas o mercado raramente derruba um preço à toa: muitas vezes está antecipando que o dividendo será cortado.",
        ],
      },
      {
        titulo: "Yield, crescimento e retorno",
        paragrafos: [
          "Uma forma útil de pensar: o retorno de longo prazo de uma ação é aproximadamente o yield de hoje somado ao crescimento do dividendo. Uma empresa que rende 2% e aumenta o pagamento 7% ao ano entrega perto de 9%. Uma que rende 8% e não cresce entrega perto de 8%.",
          "Por isso empresas que crescem muito costumam pagar pouco: elas reinvestem o lucro. E empresas maduras, sem onde reinvestir, pagam muito. O yield retrata o estágio de vida da empresa mais do que a qualidade dela.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Em agosto de 2026, os dividendos da bolsa brasileira equivaliam a 5,46% do preço, pelo índice da MSCI. Nos emergentes, 2,01%; no mundo, 1,56%.",
          "A diferença tem três origens. A bolsa brasileira é feita de bancos e commodities, setores maduros que distribuem muito. O preço das ações daqui embute o risco do país, o que empurra o yield para cima. E a lei brasileira obriga a distribuir um mínimo do lucro.",
          "Nos Estados Unidos, o yield baixo esconde outra coisa: as recompras. A fatia de empresas americanas que paga dividendos caiu muito desde os anos 1970, e parte do dinheiro que voltaria como dividendo volta como recompra.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "O primeiro é comparar o yield de uma ação com a taxa de um título como se fossem a mesma promessa. O título deve pagar; a ação pode cortar.",
          "O segundo é a armadilha do yield alto: comprar a ação que mais paga sem perguntar por que o preço caiu tanto. Às vezes, o pagamento passado não volta.",
        ],
      },
    ],
    exemplo: "Hipotético: duas empresas custam US$ 100. A primeira paga US$ 6 por ano, mas o lucro está em queda; no ano seguinte corta para US$ 3 e a ação cai para US$ 70. A segunda paga US$ 2 e aumenta 8% ao ano; em cinco anos paga perto de US$ 2,94. Quem olhou só o yield de partida escolheu a primeira e ficou com menos renda e menos patrimônio.",
    naPratica: "Yield alto no Brasil reflete, em parte, empresas maduras de bancos e commodities, e em parte o desconto pelo risco do país. Yield baixo nos Estados Unidos reflete empresas que reinvestem e fazem recompras. Os números não se comparam sem olhar o que está por trás, e o dividendo americano ainda chega com imposto retido, o que reduz o yield efetivo para quem mora aqui.",
    relacionados: [
      "dividendo",
      "preco-lucro",
      "growth-e-value",
      "recompra-de-acoes",
      "modelo-de-gordon",
      "msci-brazil",
      "imposto-retido-nos-eua",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "20:29",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "6:33",
      },
    ],
  },
  {
    slug: "dividend-aristocrats",
    termo: "Dividend Aristocrats e Dividend Kings",
    categoria: "Ações",
    apelidos: [
      "aristocratas",
      "aristocratas do dividendo",
      "S&P 500 Dividend Aristocrats",
      "Dividend Kings",
      "Kings",
      "King",
      "reis do dividendo",
    ],
    resumo: "Aristocrats são as empresas do S&P 500 que aumentam o dividendo há pelo menos 25 anos seguidos, com índice oficial. Kings, apelido do mercado, são as que aumentam há 50 anos ou mais.",
    texto: [
      "Aumentar o dividendo um ano é fácil. Aumentar por 25 anos seguidos, atravessando recessões, crises e guerras, é raro. As empresas do S&P 500 que conseguem isso formam os Dividend Aristocrats, um índice criado pela S&P em 2005.",
      "Um degrau acima estão os Dividend Kings, com 50 anos ou mais de aumentos seguidos. É um apelido do mercado, sem índice oficial e sem exigência de estar no S&P 500.",
      "Na aula 4, Rodolfo usa os dois grupos para mostrar que uma ação pode funcionar como fonte de renda crescente em dólar. E usa um banco para mostrar o limite da ideia.",
    ],
    secoes: [
      {
        titulo: "Como funciona o índice",
        paragrafos: [
          "Para entrar nos Aristocrats, a empresa precisa estar no S&P 500, ter aumentado o dividendo por pelo menos 25 anos seguidos e cumprir critérios de tamanho e liquidez. Cada empresa tem o mesmo peso, e não o peso do valor de mercado, o que evita que poucas gigantes dominem o índice.",
          "A lista é revista todo ano, no começo do ano. Quem deixa de aumentar o dividendo, ou sai do S&P 500, sai também do índice. Em 2025, eram 69 empresas, o número citado na aula.",
          "Os Kings não têm metodologia oficial. As listas independentes somam cerca de 55 empresas; a aula fala em mais de 54.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "A Procter & Gamble aumentou o dividendo pela 70ª vez seguida em abril de 2026, e paga dividendos há 136 anos. É, ao mesmo tempo, aristocrata e king.",
          "O contraexemplo é o JPMorgan. Na aula, Rodolfo diz que o banco era king até 2008. Os registros mostram que ele nunca chegou a 50 anos de aumentos e que cortou o dividendo em fevereiro de 2009, de US$ 0,38 para US$ 0,05 por trimestre. O recado da aula continua de pé: uma longa sequência pode acabar justamente na crise.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Aristocrata não quer dizer barata, nem a que mais paga. Muitas dessas empresas têm yield modesto, porque o mercado já paga caro pela previsibilidade. O que o índice seleciona é a disciplina de aumentar o pagamento, não o tamanho dele.",
          "Há também um efeito de sobrevivência. A lista de hoje mostra quem conseguiu chegar lá; não mostra quantas candidatas ficaram pelo caminho. Na crise de 2008 e 2009, vários bancos e empresas cíclicas deixaram o índice de uma vez.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Para quem pensa em renda em dólar, o grupo é uma referência útil: são empresas maduras, de setores como consumo, saúde e indústria, que tratam o dividendo quase como compromisso. Isso dá alguma previsibilidade ao fluxo.",
          "Mas a previsibilidade é estatística, não contratual. A sequência costuma se manter em tempos normais e pode quebrar quando você mais precisa da renda.",
        ],
      },
    ],
    exemplo: "Hipotético: uma empresa paga US$ 2 por ação e aumenta o dividendo 6% ao ano. Em 12 anos, o pagamento dobra para cerca de US$ 4. Quem comprou a ação a US$ 50 passa a receber perto de 8% ao ano sobre o preço que pagou, mesmo que o yield de mercado continue em 4%. É o efeito que torna as aristocratas atraentes para quem pensa em renda de longo prazo.",
    naPratica: "Uma longa sequência de aumentos mostra disciplina, mas não é promessa. Para quem quer renda em dólar, vale combinar muitas pagadoras de setores diferentes, lembrar que o dividendo americano chega com 30% retidos para quem mora no Brasil e ter outra reserva para o ano em que algumas delas cortarem.",
    relacionados: [
      "dividendo",
      "suavizacao-de-dividendos",
      "sp-500",
      "indice-de-mercado",
      "dividend-yield",
      "risco-de-concentracao",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "11:53",
      },
    ],
  },
  {
    slug: "suavizacao-de-dividendos",
    termo: "Suavização de dividendos",
    categoria: "Ações",
    apelidos: [
      "dividendos suavizados",
      "evitar cortar dividendo",
      "corte de dividendo",
      "cortou o dividendo",
    ],
    resumo: "O hábito das empresas de só aumentar o dividendo quando acham que o lucro maior veio para ficar, e de evitar cortes. Por isso um corte é lido como sinal de problema.",
    texto: [
      "O lucro de uma empresa salta 40% num ano bom. O dividendo, em vez de saltar junto, sobe 8%. No ano ruim seguinte, o lucro cai 30%, e o dividendo fica parado. Isso não é descuido da diretoria: é método.",
      "Suavização de dividendos é o hábito das empresas de só aumentar o pagamento quando acham que o lucro maior veio para ficar, de aumentar devagar e de evitar cortes a quase qualquer custo. O resultado é um dividendo muito mais estável que o lucro.",
      "Por causa desse hábito, o mercado aprendeu a ler o dividendo como um recado. Aumento é sinal de confiança. Corte é sinal de que as coisas vão mal.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O economista John Lintner, de Harvard, entrevistou diretores financeiros de empresas americanas nos anos 1950 e descreveu o padrão: cada empresa tem uma meta de quanto do lucro distribuir no longo prazo e anda em direção a ela aos poucos, ajustando só uma parte da diferença a cada ano.",
          "Meio século depois, uma pesquisa com centenas de executivos financeiros americanos voltou ao tema e encontrou o mesmo comportamento. Nela, 93,8% disseram evitar reduzir o dividendo.",
        ],
      },
      {
        titulo: "Como o mercado lê o dividendo",
        paragrafos: [
          "Como cortar é tão raro e tão doloroso, o dividendo vira uma forma de a diretoria falar sem falar. Estudos sobre o primeiro dividendo de uma empresa mostram alta de cerca de 4% no preço no anúncio. Quando a empresa omite o dividendo, a queda média é de cerca de 9,5%.",
          "As recompras de ações funcionam de outro jeito. Elas não criam a mesma expectativa de repetição, e por isso as empresas as usam como válvula: recompram muito nos anos bons e param nos ruins, sem o mesmo castigo do mercado.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "O primeiro é achar que dividendo estável significa lucro estável. A estabilidade é construída pela diretoria e tem limite: numa crise grave, até empresas tradicionais cortam, como fizeram muitos bancos americanos em 2009.",
          "O segundo é ler todo corte como desastre. Às vezes a empresa corta para investir num projeto bom ou para pagar dívida, e o mercado acaba premiando a decisão.",
        ],
      },
    ],
    exemplo: "Hipotético: uma empresa lucra US$ 10 por ação e quer distribuir metade no longo prazo. Hoje paga US$ 4. O lucro sobe para US$ 12, e a meta passaria a US$ 6. Em vez de saltar para US$ 6, ela ajusta um terço da diferença e paga US$ 4,67. Se o lucro voltar a US$ 10 no ano seguinte, ela não precisa cortar.",
    naPratica: "A suavização torna o dividendo mais previsível que o lucro, o que é bom para quem busca renda em dólar. Mas, numa crise grave, até empresas tradicionais cortam. Depender de poucas pagadoras traz de volta o risco de concentração; uma carteira ampla, de vários setores e países, transforma a previsibilidade estatística em algo mais próximo de renda confiável.",
    relacionados: [
      "dividendo",
      "dividend-aristocrats",
      "risco-de-concentracao",
      "recompra-de-acoes",
      "dividend-yield",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "12:50",
      },
    ],
  },
  {
    slug: "recompra-de-acoes",
    termo: "Recompra de ações",
    categoria: "Ações",
    apelidos: [
      "recompras",
      "recompra",
      "buyback",
      "buybacks",
    ],
    resumo: "Quando a empresa usa o próprio caixa para comprar suas ações no mercado. Cada ação que sobra passa a representar uma fatia maior do negócio.",
    texto: [
      "Uma empresa tem 100 milhões de ações e lucro de R$ 1 bilhão: R$ 10 por ação. Ela usa o caixa para recomprar 10 milhões de ações no mercado e as cancela. Com o mesmo lucro, cada ação restante passa a ter R$ 11,11.",
      "Recompra de ações é isso: a empresa compra as próprias ações e reduz o número de partes em que o negócio está dividido. Quem não vendeu fica com uma fatia maior. É outra forma de devolver dinheiro aos sócios, além do dividendo.",
      "Nos Estados Unidos, as recompras são tão comuns que, em muitos anos, as empresas do S&P 500 gastam com elas tanto quanto ou mais que com dividendos. Entender isso muda a forma de comparar a renda de ações americanas e brasileiras.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Até o começo dos anos 1980, recomprar ações em grande escala nos Estados Unidos expunha a empresa à acusação de manipular o preço. Em 1982, a SEC, a CVM americana, criou uma regra de porto seguro: seguindo limites de volume, horário e preço, a recompra deixa de ser vista como manipulação.",
          "Desde então, a prática explodiu. Em 2007, por exemplo, a Exxon Mobil recomprou US$ 31 bilhões em ações e a Microsoft, US$ 28 bilhões. Desde 2023, os Estados Unidos cobram um imposto de 1% sobre o valor recomprado.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "A empresa anuncia um programa, com um limite de valor e de prazo, e compra aos poucos na bolsa. As ações recompradas podem ser canceladas ou ficar em tesouraria, para uso futuro, por exemplo em planos de remuneração de executivos.",
          "Para o acionista, o efeito econômico se parece com o de um dividendo. Quem quer dinheiro vende parte das ações à própria empresa; quem não quer fica com uma fatia maior. A diferença é que cada um escolhe, e que quem não vende não tem evento de imposto naquele momento.",
          "No Brasil, a recompra também existe, regulada pela CVM, com limites para a quantidade que a empresa pode manter em tesouraria.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Recompra não cria valor por mágica. Se a empresa paga caro pelas próprias ações, transfere riqueza de quem fica para quem vende. Se paga barato, faz o contrário. Recompra feita no pico, com dinheiro emprestado, já destruiu muito valor.",
          "E parte das recompras só compensa a emissão de ações para remunerar executivos. Nesses casos, o número de ações não cai tanto quanto o anúncio sugere.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O dividend yield americano parece baixo porque mede só uma parte do dinheiro devolvido. Somando dividendos e recompras, a distância para outras bolsas diminui.",
          "Para quem mora no Brasil, a forma importa por causa do imposto. O dividendo americano chega com 30% retidos na fonte. A recompra não gera retenção: o ganho aparece no preço da ação e só é tributado quando você vende, pela regra brasileira.",
        ],
      },
    ],
    exemplo: "Hipotético: duas empresas devolvem 5% do valor de mercado ao ano. Uma paga tudo em dividendos; a outra paga 2% em dividendos e recompra 3%. Para quem mora no Brasil, os 5% de dividendos da primeira chegam como 3,5% depois da retenção americana. Na segunda, a retenção incide só sobre os 2%, e os outros 3% ficam dentro do preço da ação, até a venda.",
    naPratica: "Ao comparar a renda de ações americanas com a das brasileiras, considere as recompras, que são parte do retorno ao acionista. E lembre que dividendo e recompra têm tratamentos de imposto diferentes para quem mora no Brasil: o modo como o dinheiro volta pode pesar tanto quanto o quanto volta.",
    relacionados: [
      "dividendo",
      "dividend-yield",
      "growth-e-value",
      "capitalizacao-de-mercado",
      "imposto-retido-nos-eua",
      "suavizacao-de-dividendos",
    ],
    noCurso: [
      { modulo: 1, aula: 3, tempo: "5:25" },
    ],
  },
  {
    slug: "preco-lucro",
    termo: "Preço/lucro",
    sigla: "P/L",
    categoria: "Ações",
    apelidos: [
      "preço sobre lucro",
      "P/E",
      "vezes o lucro",
      "múltiplo",
      "múltiplos",
      "preço/lucro esperado",
      "lucro por ação",
      "LPA",
      "P/VP",
      "EV/EBITDA",
    ],
    resumo: "O preço de uma ação dividido pelo lucro por ação. Diz, de forma simples, quantos anos de lucro atual você paga ao comprar a empresa.",
    texto: [
      "Uma empresa lucra R$ 2 por ação e a ação custa R$ 20. O P/L, preço sobre lucro, é 10: você paga dez anos do lucro de hoje. É o jeito mais simples de ver se uma ação, ou uma bolsa inteira, está cara ou barata em relação ao que ganha.",
      "O P/L é o múltiplo mais citado do mercado. Aparece em relatório de banco, em conversa de corretora e em manchete. E é também o mais mal usado, porque um número baixo não quer dizer barato, nem um número alto quer dizer caro.",
      "O preço embute três apostas: quanto a empresa vai crescer, quanto vai distribuir e quanto retorno o mercado exige pelo risco dela. O P/L é o resumo dessas apostas num número só.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Há duas versões principais: com o lucro dos últimos 12 meses e com o lucro esperado para os próximos 12. A segunda depende de projeção de analista, e por isso costuma ser menor quando o mercado espera crescimento.",
          "O inverso do P/L também é útil. Um P/L de 10 equivale a um lucro de 10% do preço; um de 25, a 4%. Essa leitura ajuda a comparar com os juros: quando o título do governo paga muito, o mercado tende a aceitar pagar menos vezes o lucro pelas ações.",
          "Há outros múltiplos da mesma família, como o preço sobre valor patrimonial (P/VP) e o valor da empresa sobre a geração de caixa operacional (EV/EBITDA). Cada um tem seus pontos cegos.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Empresas cíclicas, como mineradoras e petroleiras, parecem mais baratas justamente no pico do ciclo, quando o lucro está inflado. Quando o preço da commodity cai, o lucro some e o P/L dispara. Por isso há uma versão que usa a média de dez anos de lucro corrigido pela inflação, para tirar o efeito do ciclo.",
          "Lucro negativo torna o P/L sem sentido. E diferenças de contabilidade entre países mudam o lucro reportado: o mesmo negócio pode ter P/L diferente só pela regra contábil.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "No fim de 1972, as cerca de 50 ações de crescimento mais admiradas dos Estados Unidos, o chamado Nifty Fifty, valiam em média perto de 42 vezes o lucro, contra 19 do S&P 500. O mercado as tratava como compráveis a qualquer preço. Do pico de janeiro de 1973 ao fundo de outubro de 1974, o S&P 500 caiu 48%, e algumas delas caíram muito mais: a Disney, 86%; Polaroid e Avon, mais de 90%.",
          "Em março de 2000, as empresas lucrativas do Nasdaq 100 valiam em média 228 vezes o lucro. Nos 21 meses seguintes, o índice caiu 64%. Preço alto pode se sustentar por anos, mas cobra a conta quando o crescimento não vem.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Em agosto de 2026, a bolsa brasileira valia 9,3 vezes o lucro, contra 15,2 vezes nos emergentes e 21,9 vezes no mundo, pelos índices da MSCI.",
          "Parte da diferença é setor: bancos e commodities valem menos vezes o lucro em qualquer país, e a bolsa brasileira é feita deles. Parte é risco: juros altos e incerteza sobre regras fazem o investidor exigir mais retorno, e pagar menos pelo mesmo lucro.",
        ],
      },
    ],
    exemplo: "Hipotético: duas empresas lucram US$ 5 por ação. A primeira não cresce e vale US$ 50, P/L de 10. A segunda cresce 15% ao ano e vale US$ 125, P/L de 25. Se a segunda mantiver o ritmo por cinco anos, o lucro chega a cerca de US$ 10, e o P/L sobre esse lucro futuro cai para perto de 12,5. Qual é a mais barata depende de o crescimento acontecer.",
    naPratica: "Comparar P/L entre países exige comparar setores e riscos. A pergunta não é qual bolsa está barata, e sim que crescimento e que risco cada preço já embute. Uma bolsa barata e instável, como a brasileira, e uma cara e concentrada, como a americana, têm riscos diferentes, e combiná-las é mais útil do que tentar adivinhar qual está certa.",
    relacionados: [
      "valuation",
      "modelo-de-gordon",
      "growth-e-value",
      "msci-brazil",
      "risco-pais",
      "bolha",
      "dividend-yield",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "20:29",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "6:33",
      },
    ],
  },
  {
    slug: "valuation",
    termo: "Valuation",
    categoria: "Ações",
    apelidos: [
      "avaliação de empresas",
      "valor justo",
      "preço justo",
    ],
    resumo: "O trabalho de estimar quanto uma empresa vale, a partir do dinheiro que ela deve gerar no futuro, para comparar com o preço que o mercado cobra.",
    texto: [
      "Comprar uma ação é comprar uma parte dos lucros futuros de uma empresa. A pergunta óbvia é quanto vale essa parte. Valuation, ou avaliação, é o trabalho de tentar responder: estimar quanto a empresa vale a partir do dinheiro que ela deve gerar, para comparar com o preço que o mercado cobra hoje.",
      "Há dois caminhos principais. O primeiro projeta o caixa futuro e o traz a valor de hoje, descontando pelo tempo e pelo risco. O segundo compara a empresa com outras parecidas por múltiplos, como o P/L. O primeiro diz quanto vale; o segundo diz se está cara ou barata em relação aos pares.",
      "Todo valuation depende de premissas: quanto a empresa vai crescer, por quanto tempo, com que margem e qual retorno exigir pelo risco. Pequenas mudanças nelas mudam muito o resultado. Por isso dois analistas sérios podem chegar a valores bem diferentes para a mesma empresa.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A ideia de que o valor de uma ação é o valor presente do dinheiro que ela vai pagar foi formalizada pelo economista John Burr Williams nos anos 1930. Na mesma época, Benjamin Graham, professor em Columbia e mentor de Warren Buffett, ensinava a separar preço de valor e a comprar só com margem de segurança.",
          "Graham tinha uma imagem para o mercado: um sócio maníaco-depressivo que todo dia oferece um preço pela sua parte. Em alguns dias, eufórico, oferece demais; em outros, deprimido, oferece de menos. O valuation é a régua para não se deixar levar por ele.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "No caminho absoluto, o analista projeta receitas, margens, investimentos e o caixa que sobra para os sócios, ano a ano, e desconta tudo a uma taxa que reflete o risco. É o fluxo de caixa descontado. A versão mais simples, para empresas maduras, é o modelo de Gordon.",
          "No caminho relativo, ele escolhe empresas comparáveis e aplica os múltiplos delas. Se bancos parecidos valem 8 vezes o lucro, o banco analisado deveria valer algo perto disso, salvo diferenças de crescimento e risco.",
          "Um terceiro uso, muito prático, é ler o preço ao contrário: em vez de calcular o valor, perguntar que crescimento o preço atual já pressupõe. Se a resposta exige que a empresa cresça 25% ao ano por uma década, você sabe o tamanho da aposta.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Valor não é preço-alvo de curto prazo. Preço e valor podem se afastar por anos, e a ação cara pode ficar mais cara antes de corrigir. Valuation ajuda a evitar pagar qualquer preço, não a acertar o momento.",
          "E empresa boa não é sinônimo de investimento bom. Uma empresa excelente comprada cara pode render pouco por muito tempo. A pergunta certa é sempre a mesma: quanto do futuro já está no preço?",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Quem compra índice não precisa avaliar empresa por empresa. Mas o raciocínio de valuation explica fenômenos que afetam qualquer carteira: por que ações de tecnologia caem mais quando os juros sobem, por que a bolsa brasileira vale menos vezes o lucro que a americana e por que bolhas acabam.",
          "É o tema do Módulo II, com Tony Volpon, aplicado às ações americanas.",
        ],
      },
    ],
    exemplo: "Hipotético: uma empresa deve gerar R$ 100 milhões de caixa no ano que vem, crescendo 3% ao ano depois disso, e você exige 10% de retorno. Pelo modelo de crescimento constante, ela vale perto de R$ 1,43 bilhão. Exija 12% e ela cai para perto de R$ 1,11 bilhão. Dois pontos a mais de exigência, por risco ou por juro mais alto, tiraram mais de um quinto do valor.",
    naPratica: "Para o investidor de índice, o ponto principal é que preço e valor podem se afastar por anos, e a bolsa cara de hoje pode continuar cara. Para quem compara Brasil e Estados Unidos, o valuation mostra que a diferença de múltiplos tem razões: setores, crescimento, juros e risco. Diversificar entre mercados é uma forma de não depender de acertar qual deles está mal precificado.",
    relacionados: [
      "fluxo-de-caixa-descontado",
      "preco-lucro",
      "modelo-de-gordon",
      "growth-e-value",
      "valor-presente",
      "premio-de-risco",
      "bolha",
    ],
  },
  {
    slug: "fluxo-de-caixa-descontado",
    termo: "Fluxo de caixa descontado",
    sigla: "DCF",
    categoria: "Ações",
    apelidos: [
      "fluxos de caixa descontados",
      "discounted cash flow",
    ],
    resumo: "Método de valuation que projeta o caixa que a empresa vai gerar ano a ano e traz tudo a valor de hoje por uma taxa que reflete o risco.",
    texto: [
      "Imagine que uma empresa vai gerar R$ 10 milhões de caixa livre no ano que vem, R$ 11 milhões no seguinte e assim por diante. Cada um desses valores vale menos hoje, porque está no futuro e tem risco. Descontando todos a uma taxa de retorno exigida e somando, você chega ao valor da empresa.",
      "Esse é o fluxo de caixa descontado, conhecido pela sigla em inglês DCF. É o método mais completo de valuation, o que bancos e gestoras usam como base, e também o mais sensível às premissas.",
      "A lógica é a mesma de qualquer investimento: um real recebido daqui a dez anos vale menos que um real hoje. Quanto mais longe e mais incerto o dinheiro, menos ele vale agora.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O analista projeta o caixa livre ano a ano, em geral por cinco a dez anos: o que a empresa gera depois de pagar custos, impostos e os investimentos necessários para continuar crescendo. Depois, estima um valor terminal, que resume tudo o que vem depois do último ano projetado, em geral supondo um crescimento estável para sempre.",
          "Cada valor é dividido por um fator que cresce com o tempo e com a taxa de desconto. A taxa reflete o retorno que investidores e credores exigem para financiar a empresa. Somando os valores descontados, chega-se ao valor da empresa; tirando a dívida líquida, ao valor das ações.",
        ],
      },
      {
        titulo: "O peso do valor terminal",
        paragrafos: [
          "Na maioria das avaliações, mais da metade do valor está no valor terminal, e em empresas de crescimento pode passar de 100%, quando os primeiros anos têm caixa negativo. Ou seja: boa parte do preço-alvo depende do que se supõe para um futuro distante, que ninguém enxerga.",
          "Por isso uma boa pergunta diante de qualquer avaliação é quanto do valor vem dos anos projetados e quanto vem do resto. Se quase tudo vem do resto, a conclusão é frágil.",
        ],
      },
      {
        titulo: "Juros e ações de crescimento",
        paragrafos: [
          "O DCF explica um fenômeno que o investidor sente no bolso. O lucro de empresas de crescimento, como as de tecnologia, está mais no futuro. Quando os juros sobem, a taxa de desconto sobe junto, e o dinheiro distante perde mais valor que o próximo.",
          "Foi o que se viu em 2022: o Fed subiu os juros de perto de zero para mais de 4% ao ano, e o Nasdaq 100, concentrado em tecnologia, caiu perto de um terço. Empresas maduras, que lucram hoje, sofreram bem menos.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Misturar moedas e inflações é um erro clássico: caixa projetado em reais nominais precisa de taxa em reais nominais; caixa em dólar, taxa em dólar. Usar a taxa de um com o caixa do outro distorce tudo.",
          "Outro é tratar o resultado como preciso. Um DCF bem feito entrega uma faixa de valores para diferentes cenários, e não um número com centavos.",
        ],
      },
    ],
    exemplo: "Hipotético: R$ 100 recebidos daqui a 10 anos, descontados a 10% ao ano, valem cerca de R$ 39 hoje. A 6%, valem R$ 56. Os mesmos R$ 100 recebidos daqui a um ano valem R$ 91 e R$ 94. A queda dos juros de 10% para 6% aumentou em 45% o valor do dinheiro distante, e em só 4% o do próximo.",
    naPratica: "O DCF explica por que ações de crescimento, como as de tecnologia americanas, reagem tanto aos juros do Fed: o lucro delas está mais no futuro, e o futuro vale menos quando os juros sobem. Quem dolariza comprando um índice americano concentrado em tecnologia está, sem perceber, fazendo também uma aposta sobre os juros americanos.",
    relacionados: [
      "valuation",
      "valor-presente",
      "modelo-de-gordon",
      "growth-e-value",
      "fed",
      "juros-compostos",
    ],
  },
  {
    slug: "modelo-de-gordon",
    termo: "Modelo de Gordon",
    categoria: "Ações",
    apelidos: [
      "modelo de dividendos descontados",
      "crescimento constante",
      "modelo de crescimento constante",
    ],
    resumo: "Uma fórmula simples de valuation: o preço de uma ação é o dividendo do próximo ano dividido pela diferença entre o retorno exigido e o crescimento esperado.",
    texto: [
      "Suponha uma empresa que paga R$ 5 de dividendo no ano que vem e aumenta esse pagamento 4% ao ano para sempre. Se você exige 9% de retorno, ela vale R$ 5 dividido pela diferença entre 9% e 4%, ou R$ 100.",
      "Esse é o modelo de Gordon, em homenagem ao economista Myron Gordon, que o popularizou nos anos 1950. É a versão mais simples do fluxo de caixa descontado: em vez de projetar ano a ano, supõe que o dividendo cresce a um ritmo constante para sempre.",
      "Em palavras: o preço é o dividendo do próximo ano dividido pela folga entre o retorno que você exige e o crescimento que espera. Mais crescimento, preço maior. Mais exigência, preço menor.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A fórmula só faz sentido quando o crescimento é menor que o retorno exigido, e quando a empresa já é madura, com dividendo estável e crescimento previsível. Para empresas que crescem rápido hoje e vão desacelerar, usa-se um modelo em dois estágios: projeta-se a fase rápida ano a ano e aplica-se Gordon só na fase estável.",
          "O modelo também funciona ao contrário. Se você sabe o preço e o dividendo, pode calcular o retorno que o mercado está pedindo: é o rendimento de dividendos somado ao crescimento esperado. Uma ação que rende 4% e cresce 6% embute um retorno perto de 10%.",
        ],
      },
      {
        titulo: "A sensibilidade",
        paragrafos: [
          "Quando o crescimento e o retorno exigido estão próximos, pequenas mudanças viram grandes diferenças de preço. Na empresa do exemplo, se o crescimento esperado passa de 4% para 5%, o preço vai de R$ 100 para R$ 125. Se a exigência sobe de 9% para 10%, cai para R$ 83.",
          "É por isso que a bolsa reage tanto a notícias sobre juros e crescimento: elas mexem justamente nos dois números do denominador.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Usar um crescimento alto demais para sempre. Nenhuma empresa cresce acima da economia indefinidamente; quem põe 10% de crescimento perpétuo numa fórmula de Gordon está supondo que a empresa um dia será maior que o país.",
          "Aplicar o modelo a empresas que não pagam dividendos, ou que pagam de forma errática. Nesses casos, o dividendo não diz nada sobre o valor, e é melhor descontar o caixa livre.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O modelo ajuda a entender o desconto da bolsa brasileira sem precisar de planilha. Menos crescimento esperado e mais risco cobrado reduzem a folga do denominador por dois lados ao mesmo tempo.",
          "E ajuda a ler o múltiplo P/L: o P/L justo de uma empresa é a fatia do lucro que ela distribui dividida pela folga entre retorno exigido e crescimento.",
        ],
      },
    ],
    exemplo: "Uma empresa que distribui metade do lucro, cresce 5% ao ano e de quem se exige 9% de retorno vale cerca de 13 vezes o lucro. Baixe o crescimento para 4% e suba a exigência para 11%, e o mesmo negócio passa a valer perto de 7 vezes. Nenhuma linha do balanço mudou; mudaram as expectativas.",
    naPratica: "É o desconto brasileiro em miniatura: menos crescimento esperado e mais risco cobrado explicam por que a bolsa daqui vale menos vezes o lucro que a de fora. Para quem diversifica, o recado é que bolsa barata pode continuar barata enquanto o risco percebido não mudar, e que bolsa cara depende de o crescimento prometido acontecer.",
    relacionados: [
      "valuation",
      "preco-lucro",
      "fluxo-de-caixa-descontado",
      "dividendo",
      "dividend-yield",
      "risco-pais",
      "premio-de-risco",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "20:29",
      },
    ],
  },
  {
    slug: "capitalizacao-de-mercado",
    termo: "Capitalização de mercado",
    categoria: "Ações",
    apelidos: [
      "valor de mercado",
      "market cap",
      "maior empresa do mundo",
      "large caps",
      "small caps",
    ],
    resumo: "O valor de uma empresa na bolsa: o preço da ação multiplicado pelo número de ações. É a medida usada para comparar tamanhos e montar a maioria dos índices.",
    texto: [
      "Uma empresa tem 1 bilhão de ações cotadas a US$ 50. A capitalização de mercado, ou valor de mercado, é de US$ 50 bilhões. É quanto o mercado diz que a empresa vale naquele dia, e muda a cada negócio fechado na bolsa.",
      "É a medida usada para comparar tamanhos de empresas e de bolsas, e a base da maioria dos índices. Quando se diz que a maior empresa do mundo vale tantos trilhões, é da capitalização de mercado que se fala.",
      "A medida é simples, mas tem consequências grandes: quem compra um índice pesado por valor de mercado põe mais dinheiro nas empresas que já são maiores.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Basta multiplicar o preço da ação pelo número de ações. Se a empresa tem mais de uma classe, como ordinárias e preferenciais no Brasil, somam-se todas.",
          "Pelo tamanho, o mercado separa as empresas em grandes, médias e pequenas, as large caps, mid caps e small caps. As pequenas tendem a oscilar mais, a ter menos liquidez e a ser menos acompanhadas por analistas.",
          "Valor de mercado não é o mesmo que valor da empresa. Para saber quanto custaria comprar o negócio inteiro, soma-se a dívida e subtrai-se o caixa. Duas empresas com o mesmo valor de mercado podem ter dívidas muito diferentes.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "A Apple foi a primeira empresa americana a valer US$ 1 trilhão, em agosto de 2018. Em 2025, a Nvidia passou dos US$ 4 trilhões e, depois, dos US$ 5 trilhões, puxada pela corrida da inteligência artificial.",
          "Em agosto de 2026, a Nvidia valia mais de dez vezes o índice brasileiro inteiro da MSCI. O MSCI ACWI, que reúne as grandes e médias empresas de 47 países, somava US$ 104 trilhões.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "A maioria dos índices, como o S&P 500 e o MSCI ACWI, dá a cada empresa um peso proporcional ao valor de mercado em livre circulação. É uma escolha lógica: o índice reflete o mercado como ele é, e quase não precisa de compras e vendas para se manter, porque os pesos andam sozinhos com os preços.",
          "O efeito colateral é a concentração. Em setembro de 2026, as dez maiores empresas eram 38% do índice MSCI das ações americanas, montado com a mesma lógica do S&P 500. Quando poucas gigantes sobem, o índice sobe com elas; quando caem, cai junto.",
          "Há índices que dão o mesmo peso a todas as empresas, como os Dividend Aristocrats. Diversificam mais entre empresas, mas exigem rebalanceamento constante e se afastam do mercado.",
        ],
      },
    ],
    exemplo: "Hipotético: um índice com duas empresas, uma de US$ 900 bilhões e outra de US$ 100 bilhões. A primeira pesa 90%. Se ela sobe 10% e a outra cai 10%, o índice sobe 8%. Pesando igual, ficaria parado. Quem compra o índice pesado por valor de mercado aposta, sem dizer, nas maiores.",
    naPratica: "Pesar por valor de mercado faz o índice acompanhar o tamanho das empresas, mas também concentrar. Comprar o S&P 500 para sair da concentração brasileira em bancos e commodities é trocar uma concentração por outra, em tecnologia. Olhar o peso das maiores posições do ETF antes de comprar é parte da diversificação.",
    relacionados: [
      "free-float",
      "indice-de-mercado",
      "sp-500",
      "risco-de-concentracao",
      "msci-acwi",
      "nasdaq",
      "bolsa-de-valores",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "13:04",
      },
      {
        modulo: 0,
        aula: 4,
        tempo: "8:05",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "3:14",
      },
    ],
  },
  {
    slug: "free-float",
    termo: "Free float",
    categoria: "Ações",
    apelidos: [
      "ações em livre circulação",
      "livre circulação",
    ],
    resumo: "A parte das ações de uma empresa que está de fato disponível para negociação, fora das mãos de controladores, governo e tesouraria.",
    texto: [
      "Uma empresa vale US$ 100 bilhões, mas o fundador tem 60% das ações e não vende. Só US$ 40 bilhões estão de fato em circulação, disponíveis para quem quiser comprar. Esse é o free float, ou ações em livre circulação.",
      "O conceito separa o tamanho da empresa do tamanho do pedaço que o mercado consegue negociar. Ficam de fora as ações de controladores, governos, executivos com restrição de venda e as que a própria empresa mantém em tesouraria.",
      "Parece um detalhe técnico, mas define quanto cada empresa, e cada país, pesa nos índices que o mundo inteiro usa como referência.",
    ],
    secoes: [
      {
        titulo: "Como funciona nos índices",
        paragrafos: [
          "Os grandes provedores de índices contam só o free float para dar peso às empresas. A MSCI adotou o ajuste no começo dos anos 2000, e a S&P passou o S&P 500 para a mesma régua em 2005. Antes disso, uma empresa controlada pelo governo podia pesar no índice como se todas as ações estivessem à venda.",
          "O ajuste reduz o peso de companhias controladas pelo Estado ou por famílias e de mercados fechados a estrangeiros. É uma forma de o índice refletir o que um investidor consegue, de fato, comprar.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "A China é o exemplo mais citado. Boa parte das ações listadas em Xangai e Shenzhen, as chamadas ações A, tinha acesso restrito a estrangeiros. A MSCI começou a incluí-las em 2018, contando só uma fração pequena do valor delas, e elevou essa fração para 20% ao longo de 2019. Por isso a China pesa nos índices globais bem menos do que o tamanho da bolsa chinesa sugeriria.",
          "No Brasil, empresas com o Estado como controlador, como bancos e petroleira, também têm uma parte das ações fora do free float.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Free float baixo costuma vir com liquidez baixa: poucas ações disponíveis, menos negócios, preço que se move mais com cada ordem grande. Também concentra poder nas mãos do controlador, o que aumenta o risco de decisões que favorecem ele e não o minoritário.",
          "Por isso a B3 exige, no Novo Mercado, seu segmento de maior governança, um percentual mínimo de ações em circulação.",
        ],
      },
    ],
    exemplo: "O MSCI ACWI conta só as ações em livre circulação, o que reduz o peso de mercados como a China. Hipotético: uma bolsa vale US$ 10 trilhões, mas só US$ 4 trilhões estão disponíveis para estrangeiros. No índice global, ela pesa como uma bolsa de US$ 4 trilhões, menos da metade do tamanho que aparece nas manchetes.",
    naPratica: "Ao ver o peso de um país num índice global, lembre que ele mede o que um investidor estrangeiro consegue comprar, e não o tamanho total da bolsa. Quando o curso diz que o Brasil é menos de 0,5% do MSCI ACWI, a régua é essa: o mercado acessível, ajustado pelo free float.",
    relacionados: [
      "capitalizacao-de-mercado",
      "indice-de-mercado",
      "msci-acwi",
      "liquidez",
      "msci-emerging-markets",
      "mercados-emergentes",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "6:50",
      },
    ],
  },
  {
    slug: "growth-e-value",
    termo: "Growth e value",
    categoria: "Ações",
    apelidos: [
      "ações de crescimento",
      "ações de valor",
      "ações growth",
      "ações value",
      "dividendos x growth",
      "crescimento x valor",
    ],
    resumo: "Dois estilos de ação. Growth são empresas que crescem rápido e reinvestem o lucro; value são empresas negociadas a múltiplos baixos, muitas vezes maduras e boas pagadoras.",
    texto: [
      "Uma empresa de software cresce 30% ao ano, reinveste tudo e quase não paga dividendos; a ação vale 40 vezes o lucro. Um banco cresce 5% ao ano, distribui metade do lucro e vale 8 vezes. A primeira é uma ação de crescimento, ou growth. A segunda, de valor, ou value.",
      "São os dois grandes estilos do mercado de ações. Growth são empresas que crescem rápido e cujo preço embute esse crescimento futuro. Value são empresas negociadas a múltiplos baixos, muitas vezes maduras, boas pagadoras de dividendos, às vezes fora de moda.",
      "Nenhum estilo é melhor o tempo todo. Eles se revezam na liderança por longos períodos, e é esse revezamento que torna útil ter os dois.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O investimento em valor tem pai conhecido: Benjamin Graham, que nos anos 1930 ensinava a comprar empresas abaixo do valor dos ativos, com margem de segurança. Warren Buffett, aluno dele, ampliou a ideia para empresas boas compradas a preço razoável.",
          "Nos anos 1990, os economistas Eugene Fama e Kenneth French mostraram que, nos dados americanos de décadas, ações baratas em relação ao patrimônio tinham rendido mais que as caras. O chamado prêmio de valor virou um dos fatores mais estudados das finanças.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Provedores de índices separam as empresas por indicadores como P/L, preço sobre patrimônio, dividend yield e crescimento de lucro e receita. As de múltiplos baixos vão para o índice value; as de crescimento alto, para o growth.",
          "O lucro das empresas de growth está mais no futuro. Por isso elas sofrem mais quando os juros sobem: o dinheiro distante perde valor. As de value, que lucram hoje, tendem a ir melhor em ciclos de juros e inflação mais altos.",
        ],
      },
      {
        titulo: "Os ciclos",
        paragrafos: [
          "Na bolha da internet, growth dominou até 2000 e despencou depois, enquanto value atravessou melhor os anos seguintes. Na década de juros quase zero depois de 2008, growth voltou a liderar com folga, puxado pelas gigantes de tecnologia. Em 2022, com a alta rápida dos juros americanos, as ações de crescimento caíram várias vezes mais que as de valor.",
          "O prêmio de valor documentado nos estudos antigos ficou muito mais fraco nas últimas décadas. Há quem diga que sumiu; há quem diga que é só um ciclo longo. Ninguém sabe.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "A bolsa brasileira é, em boa parte, value: bancos, petróleo, mineração, energia elétrica. A americana tem muito growth, sobretudo em tecnologia. Comparar o P/L das duas sem lembrar disso é comparar estilos diferentes, e não só países.",
        ],
      },
    ],
    exemplo: "Hipotético: os juros longos americanos sobem 1 ponto. Uma ação de growth cujo lucro está concentrado daqui a 10 anos cai mais que a de um banco que lucra hoje e paga dividendo trimestral. Se a primeira cai 15% e a segunda 5%, uma carteira com metade em cada estilo cai 10%, menos que a carteira só de growth.",
    naPratica: "Combinar bolsas diferentes também é combinar estilos. Quem tem a carteira toda no Brasil já está carregado de value; quem dolariza só com um índice de tecnologia vai para o extremo oposto. A discussão de dividendos contra crescimento do Módulo II não tem lado certo: são riscos e fontes de retorno diferentes.",
    relacionados: [
      "preco-lucro",
      "dividend-yield",
      "valuation",
      "gics",
      "fluxo-de-caixa-descontado",
      "nasdaq",
      "ibovespa",
    ],
    noCurso: [
      { modulo: 1, aula: 3, tempo: "26:43" },
    ],
  },
  {
    slug: "gics",
    termo: "GICS",
    categoria: "Ações",
    apelidos: [
      "classificação GICS",
      "classificação de setores",
    ],
    resumo: "O padrão global de classificação de empresas por setor, criado pela MSCI e pela S&P em 1999. Divide o mercado em 11 setores, como tecnologia, financeiro e energia.",
    texto: [
      "Para dizer que a bolsa brasileira tem muito banco e pouca tecnologia, é preciso uma régua comum de setores. Sem ela, cada analista classificaria as empresas do seu jeito, e as comparações entre países não fechariam.",
      "A régua mais usada é o GICS, sigla em inglês de Padrão Global de Classificação Setorial, criado pela MSCI e pela S&P em 1999. Ele divide o mercado em 11 setores, como tecnologia da informação, financeiro, saúde e energia.",
      "Quase todo índice, ETF e relatório de gestora usa essa classificação. Saber como ela funciona ajuda a entender o que você está comprando quando compra uma bolsa.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "São 11 setores: tecnologia da informação, financeiro, saúde, consumo discricionário, consumo básico, industriais, energia, materiais, utilidades públicas, serviços de comunicação e imobiliário. Cada setor se divide em grupos de indústria, indústrias e subindústrias, num total de mais de 160 categorias no nível mais fino.",
          "Cada empresa recebe uma única classificação, pela principal fonte de receita. Uma empresa que vende carros vai para consumo discricionário; uma que vende comida e produtos de limpeza, para consumo básico.",
        ],
      },
      {
        titulo: "As mudanças",
        paragrafos: [
          "A régua muda com a economia. Em 2016, o setor imobiliário foi separado do financeiro. Em 2018, nasceu o setor de serviços de comunicação, que recebeu empresas como Alphabet, dona do Google, e Meta, antes classificadas como tecnologia, além de empresas de mídia e telecomunicações. Em 2023, as bandeiras de cartão, como Visa e Mastercard, saíram de tecnologia e foram para o financeiro.",
          "Essas mudanças alteram o peso dos setores nos índices da noite para o dia, sem que nenhuma empresa tenha mudado de negócio. Vale lembrar disso ao comparar números de anos diferentes.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Tecnologia, no GICS, é um setor mais estreito do que a palavra sugere. A Amazon, por exemplo, está em consumo discricionário, e Google e Meta, em comunicação. Para medir a exposição de um índice à economia digital, é preciso somar setores.",
          "E setor não é país. Uma mineradora brasileira e uma australiana estão no mesmo setor, mas respondem a moedas, juros e regras diferentes.",
        ],
      },
    ],
    exemplo: "No fim de setembro de 2026, tecnologia era 39,5% do índice MSCI das ações americanas e zero no das brasileiras, onde bancos e financeiras eram 39,1%, e energia e materiais, 31,5%. Hipotético: quem tem R$ 500 mil numa carteira que segue a bolsa brasileira tem perto de R$ 350 mil em três setores ligados a juros e commodities, e nada em tecnologia.",
    naPratica: "Comprar só Ibovespa não dá exposição a inteligência artificial, semicondutores, software ou à maior parte da saúde. Olhar os setores é o jeito mais rápido de ver o que uma bolsa tem e o que falta nela, e de checar se a carteira que você monta lá fora complementa a daqui ou repete a concentração com outro nome.",
    relacionados: [
      "msci-brazil",
      "sp-500",
      "ibovespa",
      "diversificacao",
      "risco-de-concentracao",
      "growth-e-value",
      "indice-de-mercado",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "15:30",
      },
      {
        modulo: 0,
        aula: 1,
        tempo: "17:05",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "21:28",
      },
    ],
  },
  {
    slug: "adr",
    termo: "ADR",
    categoria: "Ações",
    apelidos: [
      "ADRs",
      "American Depositary Receipt",
      "American Depositary Receipts",
      "recibo de ações",
    ],
    resumo: "Um certificado negociado nas bolsas americanas que representa ações de uma empresa estrangeira. É o caminho inverso do BDR.",
    texto: [
      "Petrobras, Vale e Itaú, entre outras empresas brasileiras, têm ações negociadas em Nova York. Não são as ações da B3 atravessando o oceano: são certificados chamados ADRs, sigla em inglês de recibos de depósito americanos.",
      "Funciona assim: um banco americano guarda as ações originais no Brasil e emite, nos Estados Unidos, certificados que as representam. Os certificados são cotados em dólar, negociados no horário americano e pagam os dividendos convertidos em dólar.",
      "O ADR é o caminho inverso do BDR. Um leva empresas de fora para o investidor americano; o outro traz empresas de fora para o investidor brasileiro.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O primeiro ADR foi criado em 1927, por um banco que hoje faz parte do J.P. Morgan, para que americanos pudessem comprar ações da Selfridges, uma loja de departamentos britânica, sem abrir conta em Londres.",
          "Hoje há centenas de empresas estrangeiras com ADRs nos Estados Unidos, de bancos europeus a gigantes de tecnologia asiáticas. Para muitas delas, a listagem em Nova York é uma forma de acessar o maior mercado de capitais do mundo e ganhar visibilidade.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Há três níveis. No nível I, o ADR é negociado só no mercado de balcão, sem exigências fortes de informação. No nível II, vai para a bolsa, e a empresa passa a seguir regras de divulgação da SEC, a CVM americana. No nível III, a empresa faz uma oferta pública e capta dinheiro novo nos Estados Unidos.",
          "Cada ADR representa um número fixo de ações originais, que pode ser uma, duas ou uma fração. Arbitradores mantêm os preços alinhados: se o ADR fica caro em relação à ação local convertida pelo câmbio, eles compram aqui e vendem lá, até a diferença sumir.",
          "O banco depositário cobra uma pequena taxa de custódia por certificado, descontada em geral dos dividendos.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Ser cotado em dólar não elimina o risco cambial. O preço do ADR é, aproximadamente, o preço da ação na B3 convertido pelo câmbio do dia. Se o real cai, o ADR cai junto em dólar, mesmo que a ação fique parada em reais.",
          "Também não muda o risco do país. A empresa continua sujeita às mesmas regras, ao mesmo governo e à mesma economia. Em 2020, os Estados Unidos aprovaram uma lei que permite tirar da bolsa empresas estrangeiras cujas auditorias não possam ser inspecionadas, pensada sobretudo para empresas chinesas: o ADR depende também da relação entre os dois países.",
        ],
      },
    ],
    exemplo: "Hipotético: um ADR representa uma ação de uma empresa brasileira. Se a ação sobe 10% na B3 e o real se desvaloriza 10% contra o dólar, o ADR fica perto de zero a zero em dólar. Para o investidor americano, a alta da empresa foi engolida pelo câmbio.",
    naPratica: "Comprar ADR de empresa brasileira em dólar não diversifica o risco Brasil: a ação segue a mesma empresa, as mesmas regras e a mesma economia. Muda só a moeda da cotação. Para quem quer diversificar de verdade, o que conta é a origem do lucro das empresas, e não a bolsa ou a moeda em que o papel é negociado.",
    relacionados: [
      "bdr",
      "acao",
      "bolsa-de-valores",
      "risco-cambial",
      "risco-pais",
      "custodia",
    ],
  },
  {
    slug: "circuit-breaker",
    termo: "Circuit breaker",
    categoria: "Ações",
    apelidos: [
      "circuit breakers",
      "pregão foi interrompido",
      "interrompeu os pregões",
      "acionou o circuit breaker",
    ],
    resumo: "A interrupção automática do pregão quando a bolsa cai demais num dia. Na B3, a primeira parada acontece numa queda de 10% do Ibovespa.",
    texto: [
      "Quando o pânico toma conta, uma pausa ajuda. O circuit breaker, ou disjuntor, é a interrupção automática do pregão quando a bolsa cai demais num mesmo dia. A ideia é dar tempo para os investidores respirarem, lerem as notícias e reavaliarem as ordens antes de continuar vendendo.",
      "Na B3, se o Ibovespa cai 10% em relação ao fechamento anterior, os negócios param por 30 minutos. Numa queda de 15%, por uma hora. Aos 20%, a bolsa pode suspender o pregão pelo tempo que julgar necessário.",
      "É raro, mas quando acontece costuma marcar a história: o mecanismo só é acionado nos dias em que um choque atinge o mercado inteiro de uma vez.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Na segunda-feira 19 de outubro de 1987, o índice Dow Jones caiu 22,6% num único dia, a maior queda diária da história americana. Ordens automáticas de venda alimentavam novas quedas, e o sistema não dava conta. A comissão criada para investigar o episódio recomendou pausas obrigatórias, adotadas no ano seguinte.",
          "A regra americana foi revista várias vezes. A versão atual, de 2013, usa o S&P 500: paradas de 15 minutos em quedas de 7% e de 13%, e fim do pregão numa queda de 20%. As duas primeiras só valem até perto do fim do dia, para não travar o fechamento.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Os limites são calculados sobre o fechamento do dia anterior. Durante a parada, ninguém compra nem vende ações. Na volta, a negociação recomeça com um leilão, para que o preço se forme com todas as ordens acumuladas.",
          "Além da regra para o mercado todo, há mecanismos para ações isoladas: quando um papel oscila demais em poucos minutos, entra em leilão, com uma pausa curta para formar o preço.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 18 de maio de 2017, o Joesley Day, a divulgação de uma gravação envolvendo o então presidente derrubou a bolsa logo na abertura, e o pregão foi interrompido, o que não acontecia desde 2008. O dólar disparou no mesmo dia.",
          "Em março de 2020, no começo da pandemia, o circuit breaker foi acionado seis vezes na B3 em oito pregões, duas delas no mesmo dia. Nos Estados Unidos, a parada de 7% aconteceu quatro vezes no mesmo mês.",
        ],
      },
    ],
    exemplo: "Hipotético: o Ibovespa fechou ontem em 130 mil pontos. Se hoje cair a 117 mil, 10% abaixo, o pregão para por 30 minutos. Se, na volta, chegar a 110.500, 15% abaixo, para por uma hora. Uma queda até 104 mil pontos, 20% abaixo, permite à B3 suspender os negócios pelo resto do dia.",
    naPratica: "O circuit breaker é um lembrete de que choques locais param o mercado inteiro de uma vez. Num dia assim, câmbio, juros e bolsa brasileiros reagem juntos, porque respondem à mesma causa. Ter parte do patrimônio em outro país e outra moeda é ter algo que não depende do mesmo disjuntor.",
    relacionados: [
      "ibovespa",
      "volatilidade",
      "cisne-negro",
      "risco-sistematico",
      "joesley-day",
      "pandemia-de-2020",
      "bull-e-bear-market",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 2,
        tempo: "1:15:24",
      },
    ],
  },
  {
    slug: "bull-e-bear-market",
    termo: "Bull market e bear market",
    categoria: "Ações",
    apelidos: [
      "bull market",
      "bear market",
      "mercado de alta",
      "mercado de baixa",
      "queda forte",
    ],
    resumo: "Nomes do mercado para períodos de alta prolongada (bull, o touro que ataca de baixo para cima) e de queda prolongada (bear, o urso que ataca de cima para baixo).",
    texto: [
      "O touro ataca de baixo para cima, com os chifres. O urso ataca de cima para baixo, com as patas. Daí os apelidos do mercado: bull market é um período de alta prolongada; bear market, de queda prolongada.",
      "Por convenção, a bolsa entra em bear market quando cai 20% ou mais a partir do pico, e em bull market quando sobe 20% a partir do fundo. Quedas entre 10% e 20% costumam ser chamadas de correção.",
      "Os termos parecem folclore, mas carregam uma lição prática: os ciclos existem, não têm duração fixa e quase nunca avisam quando começam ou terminam.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A expressão do urso nasceu em Londres no século XVIII. Os comerciantes de peles chamavam de vendedores de pele de urso quem vendia a pele antes de caçar o animal, apostando que compraria mais barato depois. Na bolsa, o apelido foi para quem vende apostando na queda. O touro veio como contraponto.",
          "Hoje, bull e bear designam tanto o mercado quanto as pessoas: um investidor bullish espera alta; um bearish, queda.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Nos Estados Unidos, o bull market que começou em março de 2009 durou quase 11 anos, até fevereiro de 2020. O bear market seguinte, da pandemia, foi o mais curto da história: o S&P 500 caiu 34% em cerca de um mês e voltou a subir logo depois.",
          "Os mais longos e profundos doem mais. De outubro de 2007 a março de 2009, o S&P 500 perdeu mais da metade do valor. Em 2022, com a alta dos juros, caiu cerca de 25% do pico ao fundo.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Tentar sair antes do bear market e voltar antes do bull. Os melhores dias da bolsa costumam aparecer no meio dos piores períodos, muitas vezes poucos dias depois das maiores quedas. Quem sai para se proteger costuma perder justamente a recuperação.",
          "O J.P. Morgan mede isso todo ano. Na edição de 2006 a 2025, quem ficou investido no S&P 500 o tempo todo teve 11,0% ao ano; quem perdeu só os 10 melhores dias, 6,6%.",
          "Outro erro é achar que o fim de um bear market se anuncia. Ele só é reconhecido depois, quando o índice já subiu 20% a partir do fundo.",
        ],
      },
    ],
    exemplo: "Hipotético: o índice vai de 5.000 a 3.900 pontos em quatro meses, 22% abaixo do pico. Pela convenção, é um bear market. Se depois ele sobe de 3.900 a 4.700, 20% acima do fundo, começa um novo bull market, mesmo ainda abaixo do pico anterior. Quem esperou a confirmação para voltar perdeu esses 20%.",
    naPratica: "Rodolfo chama de queda forte a semana em que a carteira perde 10%, 15%, 20%. É nela que a estratégia vive ou morre. Para quem dolariza, o bear market lá fora pode vir junto com a alta do dólar, o que amortece a queda em reais, ou não. Ter uma regra escrita de quanto manter em cada mercado protege mais que qualquer previsão de ciclo.",
    relacionados: [
      "drawdown",
      "volatilidade",
      "market-timing",
      "aversao-a-perda",
      "sp-500",
      "rebalanceamento",
      "crise-de-2008",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "2:25",
      },
    ],
  },
  {
    slug: "indice-de-mercado",
    termo: "Índice de mercado",
    categoria: "Ações",
    apelidos: [
      "índice de ações",
      "índices de ações",
      "índices de mercado",
      "índice de referência",
      "benchmark",
      "benchmarks",
    ],
    resumo: "Uma cesta teórica de ativos, com regras públicas, que mostra como um mercado ou um pedaço dele se comporta. Serve de régua e de base para fundos e ETFs.",
    texto: [
      "Quando o noticiário diz que a bolsa subiu 1%, está falando de um índice: uma cesta teórica de ações, com pesos definidos por regras públicas. O S&P 500 mede as grandes empresas americanas; o Ibovespa, as mais negociadas da B3; o MSCI ACWI, as ações do mundo.",
      "O índice é uma régua. Mostra como um mercado, ou um pedaço dele, se comportou num período, sem a escolha de nenhum gestor. Serve para avaliar quem administra dinheiro e de base para fundos que tentam copiá-lo.",
      "Ninguém investe diretamente num índice. Você compra um fundo ou ETF que o acompanha, com algum custo e alguma diferença em relação à cesta original.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O primeiro índice de ações foi criado em 1884 por Charles Dow, um dos fundadores do Wall Street Journal: uma média simples dos preços de algumas ferrovias. Em 1896, ele lançou o Dow Jones Industrial, com empresas industriais, que existe até hoje.",
          "O passo seguinte foram os índices pesados pelo valor de mercado, como o S&P 500, de 1957, que representam melhor o mercado. E, em 1976, John Bogle lançou o primeiro fundo de índice para o público, que transformou a régua em produto.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Cada índice tem uma metodologia: quais ações entram, com que peso e com que frequência a lista é revista. Há três formas principais de pesar. Por preço, como o Dow Jones, em que a ação mais cara pesa mais. Por valor de mercado, como o S&P 500 e os índices da MSCI, em que a empresa maior pesa mais. E por peso igual, em que todas pesam o mesmo.",
          "Outro detalhe importa muito: se o índice conta ou não os dividendos. O S&P 500 que aparece no noticiário é só de preço. O Ibovespa é de retorno total, com os proventos reinvestidos. Comparar um com o outro sem esse ajuste distorce a conta em vários pontos por ano.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Os índices servem de benchmark, a régua contra a qual um gestor é medido. Um fundo de ações americanas que rendeu 15% num ano em que o S&P 500 rendeu 20% foi mal, mesmo com ganho.",
          "E servem de base para a gestão passiva. Saber qual índice um ETF segue diz quase tudo sobre o que você está comprando: quais países, quais setores, quanta concentração, se paga ou reinveste dividendos.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Índice não é carteira neutra. Toda regra embute escolhas: o S&P 500 exige lucro para a empresa entrar; o Ibovespa privilegia as mais negociadas; os índices da MSCI contam só as ações em livre circulação. Dois índices do mesmo mercado podem render bem diferente.",
        ],
      },
    ],
    exemplo: "Na aula 3, Rodolfo usa índices, e não fundos, para comparar bolsa e renda fixa americanas, para que a habilidade de nenhum gestor entre na conta. Hipotético: num ano em que as empresas pagam 1,5% de dividendos, o índice de preço sobe 10% e o de retorno total, perto de 11,5%. Quem compara um fundo com o índice errado acha que o gestor foi melhor do que foi.",
    naPratica: "Saber qual índice um ETF segue diz quase tudo sobre o que você está comprando. Antes de dolarizar via fundo ou ETF, vale abrir a metodologia do índice: quantos países, quais setores, quanto pesam as dez maiores posições. É ali que está a diversificação, ou a falta dela.",
    relacionados: [
      "sp-500",
      "ibovespa",
      "msci-acwi",
      "etf",
      "gestao-passiva",
      "capitalizacao-de-mercado",
      "free-float",
      "tracking-error",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 3,
        tempo: "25:26",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "8:23",
      },
    ],
  },
  {
    slug: "sp-500",
    termo: "S&P 500",
    categoria: "Ações",
    apelidos: [
      "S&P",
      "Standard & Poor's 500",
      "índice das maiores empresas americanas",
      "principal índice de ações americano",
    ],
    resumo: "O índice das cerca de 500 maiores empresas listadas nos Estados Unidos, pesadas pelo valor de mercado. É a principal régua da bolsa americana.",
    texto: [
      "Quando um americano pergunta como foi a bolsa hoje, a resposta quase sempre é o S&P 500. O índice reúne cerca de 500 das maiores empresas listadas nos Estados Unidos, pesadas pelo valor de mercado, e cobre perto de 80% do valor de todas as ações americanas.",
      "Criado em 1957 pela Standard & Poor's, virou a principal régua da bolsa americana, a referência de desempenho para gestores do mundo inteiro e a base dos maiores ETFs do planeta.",
      "É também o índice que o curso usa para mostrar o que acontece com o dinheiro do brasileiro que leva parte do patrimônio para fora: a soma do desempenho da bolsa americana com o do dólar.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "As empresas não entram por tamanho automaticamente. Um comitê escolhe, seguindo critérios de valor de mercado, liquidez, ações em livre circulação e lucro: a soma dos lucros dos últimos quatro trimestres precisa ser positiva. Por isso a Tesla, por exemplo, só entrou em 2020, anos depois de já ser uma das maiores empresas do país.",
          "O peso de cada empresa é proporcional ao valor de mercado em livre circulação. Por isso as gigantes de tecnologia dominam: em setembro de 2026, as dez maiores empresas eram 38% do índice MSCI das ações americanas, que segue a mesma lógica de peso.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Com dividendos reinvestidos, o S&P 500 rendeu 8,0% ao ano em dólar de 2000 a 2025 e 14,7% ao ano de 2016 a 2025, pela base do professor Aswath Damodaran, da NYU. A diferença entre as janelas mostra quanto o ponto de partida importa.",
          "No caminho houve tombos. A primeira década do século foi perdida: de 2000 a 2009, o índice terminou ligeiramente abaixo de onde começou, mesmo com dividendos. Em 2008, caiu 37%.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Quando se fala do retorno do S&P, vale conferir se os dividendos estão incluídos. O índice que aparece no noticiário é só de preço. Nas janelas usadas na aula, deixar os dividendos de fora tira de 2 a 4 pontos por ano, o que, em décadas, faz uma diferença enorme.",
          "E as empresas do S&P 500 são americanas, mas vendem para o mundo todo. Uma parte relevante da receita delas vem de fora dos Estados Unidos. Ainda assim, o índice é de um país só, sujeito às regras, aos juros e ao humor de um único mercado.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Na aula 3, Rodolfo soma o S&P 500 e o dólar para mostrar o que o brasileiro teria ganho em reais. Em 2008, o S&P caiu 37% em dólar e o dólar subiu 32% contra o real. A conta exata dá uma perda de perto de 17% em reais, bem menor que a do Ibovespa no mesmo ano.",
          "O índice pode ser comprado por ETFs listados nos Estados Unidos, por ETFs domiciliados na Europa e por fundos e BDRs negociados na B3. Cada caminho tem custo e imposto diferentes, tema do Módulo III.",
        ],
      },
    ],
    exemplo: "Na aula, o S&P rende de 6% a 11% ao ano em dólar, conforme a janela, sem dividendos. Com os dividendos, a base do professor Damodaran dá de 8% a quase 15%. Hipotético: US$ 10 mil a 8% ao ano viram cerca de US$ 46.600 em 20 anos; a 6%, cerca de US$ 32.100. Os dividendos esquecidos na conta valem mais de US$ 14 mil.",
    naPratica: "O S&P 500 é a porta de entrada mais comum para a bolsa americana, via ETFs de custo muito baixo. Mas é um índice de um país só e concentrado em tecnologia: comprar o índice também é comprar essa concentração. Para quem sai de uma carteira 100% brasileira, ele já diversifica muito; para quem quer o mundo, é só uma parte dele.",
    relacionados: [
      "indice-de-mercado",
      "nasdaq",
      "msci-acwi",
      "etf",
      "carteira-60-40",
      "dividend-aristocrats",
      "capitalizacao-de-mercado",
      "retorno-em-reais",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 3,
        tempo: "18:48",
      },
      {
        modulo: 0,
        aula: 4,
        tempo: "2:25",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "5:25",
      },
    ],
  },
  {
    slug: "ibovespa",
    termo: "Ibovespa",
    categoria: "Ações",
    apelidos: [
      "Índice Bovespa",
      "bolsa brasileira",
    ],
    resumo: "O principal índice da bolsa brasileira, com as ações mais negociadas da B3. Existe desde 1968 e é dominado por bancos, petróleo e mineração.",
    texto: [
      "O Ibovespa é o número que o noticiário usa para dizer se a bolsa brasileira subiu ou caiu. É uma carteira teórica das ações mais negociadas da B3, revista a cada quatro meses, e existe desde 2 de janeiro de 1968, quando começou em 100 pontos.",
      "O índice reflete a economia que a bolsa brasileira representa: bancos, petróleo, mineração, energia elétrica e algumas empresas de consumo e varejo. Tecnologia quase não aparece.",
      "Para o curso, o Ibovespa é a régua do que o investidor brasileiro típico já tem. Saber o que há dentro dele ajuda a ver o que falta.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A carteira é refeita em janeiro, maio e setembro. Entram as ações que somam a maior parte dos negócios da bolsa e que cumprem critérios de presença nos pregões e de preço mínimo. Desde 2014, o peso de cada ação segue o valor de mercado das ações em circulação, com limites para que nenhuma domine o índice.",
          "O Ibovespa é um índice de retorno total: os dividendos e juros sobre capital próprio são considerados reinvestidos. Por isso ele não se compara diretamente com o S&P 500 do noticiário, que é só de preço.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "Nos anos de inflação alta, o índice chegou a valores astronômicos e teve zeros cortados várias vezes, como a moeda. Os gráficos de longo prazo do Ibovespa que você vê hoje já vêm ajustados por esses cortes.",
          "Em reais nominais, o índice atravessou recordes e tombos ligados quase sempre a eventos do país: a crise de 2002, a de 2008, a recessão de 2015 e 2016, o Joesley Day em 2017 e a pandemia em 2020.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "De janeiro de 2010 a dezembro de 2025, o Ibovespa subiu 135%, cerca de 5,5% ao ano, abaixo do CDI no mesmo período, que acumulou 340%. Foi um período em que a renda variável brasileira não pagou o risco.",
          "Em dólar, a conta muda de novo. Em 2008, o Ibovespa caiu 41% em reais e o dólar subiu 32%; para um investidor estrangeiro, a queda passou de 55%. A bolsa brasileira e o real costumam cair juntos, porque respondem às mesmas notícias.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Ter muitas ações do Ibovespa não é ter uma carteira diversificada. Bancos, petroleira e mineradora oscilam com os juros brasileiros, o preço das commodities e o risco do país. Diversificar entre empresas brasileiras não diversifica entre economias.",
        ],
      },
    ],
    exemplo: "De janeiro de 2010 a dezembro de 2025, o Ibovespa subiu 135%, cerca de 5,5% ao ano, abaixo do CDI, que acumulou 340%. Hipotético: R$ 100 mil aplicados no índice no começo de 2010 viraram perto de R$ 235 mil; no CDI, perto de R$ 440 mil. Com mais oscilação no caminho, a bolsa entregou menos.",
    naPratica: "Comprar Ibovespa é diversificar entre empresas brasileiras, não entre economias. O risco do país, da moeda e da regra continua o mesmo para todas elas, e se soma ao do salário, do imóvel e da previdência, que também estão aqui. Por isso o curso trata a bolsa brasileira como uma parte da carteira, e não como a carteira de ações inteira.",
    relacionados: [
      "indice-de-mercado",
      "msci-brazil",
      "bolsa-de-valores",
      "gics",
      "home-bias",
      "cdi",
      "circuit-breaker",
      "risco-pais",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "14:31",
      },
      {
        modulo: 0,
        aula: 4,
        tempo: "22:22",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "36:56",
      },
    ],
  },
  {
    slug: "msci-acwi",
    termo: "MSCI ACWI",
    categoria: "Ações",
    apelidos: [
      "índice global de ações",
      "índice global",
      "All Country World Index",
      "ACWI",
    ],
    resumo: "O índice da MSCI que reúne as ações de grandes e médias empresas de 47 países, ricos e emergentes. É a régua mais usada para o mercado de ações do mundo.",
    texto: [
      "Se você quisesse comprar um pedaço de cada grande empresa do mundo, na proporção do tamanho de cada uma, compraria algo parecido com o MSCI ACWI. O nome é a sigla em inglês de índice de todos os países do mundo.",
      "O índice cobre 23 países desenvolvidos e 24 emergentes, com perto de 2.450 empresas grandes e médias. Em agosto de 2026, somava US$ 104 trilhões em valor de mercado. É a régua mais usada para o mercado global de ações.",
      "No curso, é o número que mais impressiona: o Brasil é menos de 0,5% dele.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A MSCI nasceu dos índices internacionais que a Capital International começou a calcular no fim dos anos 1960, quando quase ninguém media bolsas fora dos Estados Unidos. O banco Morgan Stanley licenciou os índices nos anos 1980, e o nome virou Morgan Stanley Capital International, hoje uma empresa independente.",
          "O ACWI juntou num só índice os de países desenvolvidos e emergentes. Virou referência para fundos de pensão, gestores globais e ETFs de ações do mundo.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Em cada país, o índice busca cobrir perto de 85% do valor das ações em livre circulação, com as empresas grandes e médias. As pequenas ficam numa versão ampliada.",
          "Cada empresa pesa pelo valor de mercado ajustado pelo free float. Mercados com restrição a estrangeiros, como parte da bolsa chinesa, entram com peso reduzido.",
          "Uma vez por ano, a MSCI revisa a classificação dos países: quem é desenvolvido, quem é emergente, quem é de fronteira. A mudança de categoria move bilhões de dólares de fundos que seguem os índices.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Os Estados Unidos são quase dois terços do índice. Japão, Reino Unido, China e outros vêm muito atrás. O Brasil, menos de 0,5%. Tecnologia é quase um terço.",
          "Em agosto de 2026, os dividendos do ACWI equivaliam a 1,56% do preço, e a volatilidade anual de dez anos era de 14,7%, menos da metade da do índice brasileiro.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Comprar o mundo não é fugir da concentração. Com quase dois terços em um país e quase um terço em um setor, o ACWI também tem apostas grandes, só que são as apostas do mercado como um todo.",
          "E o índice é medido em dólar. Para o brasileiro, o resultado em reais soma o desempenho das ações ao do dólar contra o real.",
        ],
      },
    ],
    exemplo: "Em agosto de 2026, o MSCI ACWI somava US$ 104 trilhões em valor de mercado. Quem investe só na B3 olha para menos de um duzentos avos desse universo. Hipotético: uma carteira de R$ 1 milhão montada na proporção do índice teria menos de R$ 5 mil no Brasil e perto de R$ 640 mil nos Estados Unidos.",
    naPratica: "O ACWI é a referência do que seria uma carteira neutra de ações do mundo. Não é recomendação de alocação: o brasileiro tem salário, imóvel e gastos em reais, e pode fazer sentido ter mais Brasil do que o índice. Mas ele ajuda a medir o tamanho da aposta de quem tem tudo em casa.",
    relacionados: [
      "msci-emerging-markets",
      "msci-brazil",
      "indice-de-mercado",
      "home-bias",
      "free-float",
      "diversificacao",
      "sp-500",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "6:50",
      },
      {
        modulo: 0,
        aula: 3,
        tempo: "4:57",
      },
    ],
  },
  {
    slug: "msci-emerging-markets",
    termo: "MSCI Emerging Markets",
    categoria: "Ações",
    apelidos: [
      "índice de emergentes da MSCI",
      "MSCI EM",
      "índice de emergentes",
      "ações emergentes",
    ],
    resumo: "O índice da MSCI para ações de países emergentes, com cerca de 1.180 empresas de 24 países. China, Taiwan e Índia têm os maiores pesos; o Brasil, uma fatia pequena.",
    texto: [
      "Emergentes não são um bloco só. O índice da MSCI para esses países reúne 1.178 ações de 24 mercados, de Taiwan à África do Sul, do México à Indonésia. China, Taiwan e Índia têm os maiores pesos. O Brasil é só 3,9% dele.",
      "O MSCI Emerging Markets é a régua mais usada para as bolsas de países de renda média. Gestores do mundo inteiro o usam para decidir quanto pôr nesses mercados, e os ETFs que o seguem estão entre os maiores do mundo.",
      "Para o investidor brasileiro, ele tem uma utilidade especial: mostra que sair do Brasil não precisa significar ir só para os Estados Unidos.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O índice foi lançado em 1988, com dez países que, somados, eram uma fração mínima do mercado global de ações. O Brasil estava entre eles.",
          "De lá para cá, a composição mudou muito. A Ásia ganhou peso, a China entrou e cresceu, Taiwan e Coreia do Sul viraram potências de semicondutores. Países também saem: a Rússia foi retirada em 2022, depois da invasão da Ucrânia, quando as ações russas ficaram inegociáveis para estrangeiros.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Segue a mesma lógica dos outros índices da MSCI: empresas grandes e médias, pesadas pelo valor de mercado das ações em livre circulação. Mercados com restrições a estrangeiros entram com peso reduzido.",
          "A classificação de um país como emergente depende do desenvolvimento econômico, do tamanho e da liquidez da bolsa e da facilidade de acesso para estrangeiros. Por isso a Coreia do Sul, um país rico, ainda está no índice de emergentes da MSCI: há restrições de câmbio e de acesso que a MSCI considera relevantes.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Em agosto de 2026, a volatilidade anual de dez anos do MSCI Emerging Markets foi de 17,5%, contra 30,8% do MSCI Brazil e 14,7% do MSCI ACWI. O índice valia 15,2 vezes o lucro e pagava 2,01% em dividendos.",
          "Desde 1987, a maior queda do índice, do pico ao fundo, foi de 65,1% em dólar. Na mesma régua, a do índice brasileiro foi de 75,8%.",
        ],
      },
    ],
    exemplo: "Em agosto de 2026, a volatilidade anual de dez anos do MSCI Brazil foi de 30,8%, contra 17,5% do MSCI Emerging Markets e 14,7% do MSCI ACWI. Hipotético: numa carteira de US$ 100 mil, uma oscilação típica de um ano é de US$ 31 mil para cima ou para baixo no Brasil, e de US$ 17,5 mil nos emergentes como grupo.",
    naPratica: "Diversificar não é só ir aos Estados Unidos. Emergentes como México, Indonésia e Coreia do Sul crescem em ritmos e por razões diferentes do Brasil, e combinados oscilam bem menos que qualquer um deles sozinho. Mas lembre que o índice de emergentes já inclui o Brasil, e que em crises globais esses mercados tendem a cair juntos.",
    relacionados: [
      "mercados-emergentes",
      "msci-acwi",
      "msci-brazil",
      "volatilidade",
      "diversificacao",
      "correlacao",
      "free-float",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "13:04",
      },
    ],
  },
  {
    slug: "msci-brazil",
    termo: "MSCI Brazil",
    categoria: "Ações",
    apelidos: [
      "índice da MSCI para o Brasil",
      "índice MSCI das ações brasileiras",
      "índice brasileiro",
    ],
    resumo: "O índice da MSCI para ações brasileiras, com cerca de 46 empresas. É a forma como o investidor estrangeiro enxerga a bolsa do Brasil.",
    texto: [
      "O MSCI Brazil é o retrato da bolsa brasileira usado lá fora, em dólar. É por ele que gestores estrangeiros decidem quanto pôr no Brasil, e é a base dos ETFs de Brasil negociados em Nova York.",
      "Em 2026, tinha 46 empresas. Financeiro, energia e materiais somavam 71% do índice, e as dez maiores posições eram 61%. É uma bolsa pequena, concentrada em poucos setores e em poucas empresas.",
      "Por ser calculado em dólar, ele junta o desempenho das ações com o do real. Por isso oscila mais que o Ibovespa visto em reais.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Segue a metodologia padrão da MSCI: empresas grandes e médias, pesadas pelo valor de mercado das ações em livre circulação, cobrindo perto de 85% desse valor. Por isso tem bem menos empresas que o Ibovespa.",
          "O Brasil faz parte do índice de emergentes desde o lançamento, em 1988. O peso do país nesse índice sobe e desce com a bolsa e com o real; em 2026, estava em 3,9%.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Desde 1987, a maior queda do MSCI Brazil, do pico ao fundo, foi de 75,8% em dólar. No índice de emergentes, foi de 65,1%; no global, de 58,1%.",
          "Em agosto de 2026, o índice valia 9,3 vezes o lucro e pagava 5,46% em dividendos, com volatilidade anual de dez anos de 30,8%, quase o dobro da média dos emergentes.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2008, o Ibovespa caiu 41% em reais. No mesmo ano, o dólar subiu 32%. Para quem mede em dólar, as duas perdas se multiplicaram, e a queda passou de 55%.",
          "É o padrão do risco brasileiro visto de fora: quando o mundo foge do risco, a bolsa cai e a moeda também. Para o estrangeiro, o Brasil é uma aposta dobrada. Para o brasileiro com patrimônio em reais, é o mesmo fenômeno visto do outro lado.",
        ],
      },
    ],
    exemplo: "Desde 1987, a maior queda do MSCI Brazil, do pico ao fundo, foi de 75,8% em dólar. No índice de emergentes, foi de 65,1%; no global, de 58,1%. Hipotético: US$ 100 mil no pico viraram US$ 24 mil no fundo no Brasil e quase US$ 42 mil no índice global. Para recuperar, o primeiro precisa subir mais de 300%; o segundo, perto de 140%.",
    naPratica: "A bolsa brasileira é barata e instável ao mesmo tempo: valia 9,3 vezes o lucro em agosto de 2026, com volatilidade quase o dobro da média dos emergentes. Para o brasileiro, o índice mostra o que o mundo vê quando olha para cá, e ajuda a entender por que o patrimônio todo em reais e em ações daqui é uma aposta concentrada, ainda que possa ser bem paga.",
    relacionados: [
      "ibovespa",
      "msci-emerging-markets",
      "msci-acwi",
      "preco-lucro",
      "gics",
      "drawdown",
      "risco-pais",
      "risco-cambial",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "13:04",
      },
      {
        modulo: 0,
        aula: 1,
        tempo: "20:29",
      },
    ],
  },
  {
    slug: "nasdaq",
    termo: "Nasdaq",
    categoria: "Ações",
    apelidos: [
      "Nasdaq 100",
      "Nasdaq-100",
      "Nasdaq Composite",
    ],
    resumo: "A bolsa eletrônica americana onde estão listadas muitas empresas de tecnologia, e o nome dos índices que a acompanham, como o Nasdaq 100.",
    texto: [
      "Apple, Microsoft, Nvidia, Amazon, Alphabet e Meta têm uma coisa em comum além do tamanho: estão listadas na Nasdaq, a bolsa eletrônica americana que virou a casa da tecnologia.",
      "O nome designa duas coisas. A bolsa, criada em 1971 como a primeira negociação de ações totalmente eletrônica, sem pregão físico. E os índices que a acompanham, como o Nasdaq Composite, com quase todas as empresas listadas nela, e o Nasdaq 100, com as cem maiores empresas não financeiras.",
      "Quando o noticiário fala que a Nasdaq caiu, quase sempre está falando de um desses índices, e quase sempre de tecnologia.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A Nasdaq foi criada pela associação das corretoras americanas para organizar o mercado de balcão, onde eram negociadas empresas pequenas demais para a Bolsa de Nova York. Em vez de um pregão, uma rede de computadores mostrava os preços de quem estava disposto a comprar e vender.",
          "Empresas jovens de tecnologia, nos anos 1980 e 1990, preferiram listar ali, pelo custo menor e pela afinidade com o modelo. Muitas cresceram e ficaram. O Nasdaq 100 foi lançado em 1985.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "A bolha da internet é o grande episódio da Nasdaq. Em março de 2000, 87% do Nasdaq 100 estava em tecnologia e comunicações, e as empresas lucrativas do índice valiam em média 228 vezes o lucro. Nos 21 meses seguintes, o índice caiu 64%.",
          "O Nasdaq Composite, que tinha passado dos 5.000 pontos, perdeu perto de 78% até 2002 e só voltou ao pico em 2015, 15 anos depois. Muitas empresas daquela época simplesmente sumiram.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Nasdaq 100 e S&P 500 têm muitas empresas em comum, sobretudo as gigantes de tecnologia. A diferença é que o Nasdaq 100 deixa de fora os bancos e quase toda a economia tradicional, e por isso é muito mais concentrado em tecnologia e oscila mais.",
          "Bom desempenho recente também não é garantia. O índice brilhou na década de juros baixos depois de 2008 e caiu perto de um terço em 2022, quando os juros americanos subiram rápido.",
        ],
      },
    ],
    exemplo: "Em março de 2000, 87% do Nasdaq 100 estava em tecnologia e comunicações. O índice caiu 64% nos 21 meses seguintes. Hipotético: US$ 100 mil no pico viraram US$ 36 mil. Para voltar ao ponto de partida, a carteira precisava subir quase 180%.",
    naPratica: "Trocar a concentração brasileira em bancos e commodities por uma concentração em tecnologia não é diversificar. É trocar uma aposta por outra. O ganho está em combinar exposições diferentes, e um índice amplo, de vários setores e países, faz isso melhor do que o índice do setor que mais subiu nos últimos anos.",
    relacionados: [
      "sp-500",
      "bolsa-de-valores",
      "risco-de-concentracao",
      "bolha",
      "growth-e-value",
      "gics",
      "volatilidade",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "14:31",
      },
    ],
  },
  {
    slug: "mercados-emergentes",
    termo: "Mercados emergentes",
    categoria: "Ações",
    apelidos: [
      "emergentes",
      "países emergentes",
      "país emergente",
      "mercado emergente",
    ],
    resumo: "Países de renda média, com mercados financeiros em desenvolvimento, como Brasil, China, Índia, México e Indonésia. Prometem mais crescimento e cobram mais risco.",
    texto: [
      "Brasil, China, Índia, México, Indonésia, África do Sul. São países de renda média, com mercados financeiros em desenvolvimento, que prometem crescer mais que os ricos e cobram por isso mais risco. São os mercados emergentes.",
      "O termo designa economias que se integram ao mercado global, com bolsas e moedas mais voláteis que as dos países desenvolvidos, instituições ainda em construção e sensibilidade maior aos juros e ao humor dos investidores de fora.",
      "Para o brasileiro, a categoria tem um detalhe curioso: quem investe só no Brasil já está 100% num mercado emergente, e num só.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A expressão foi cunhada em 1981 por Antoine van Agtmael, economista da IFC, braço do Banco Mundial para o setor privado. Ele tentava convencer investidores a pôr dinheiro num fundo de ações de países pobres, e percebeu que terceiro mundo não vendia nada. Mercados emergentes vendia esperança.",
          "A ideia pegou nos anos 1990, com a abertura de vários países ao capital estrangeiro. E logo vieram as crises: México em 1994, Ásia em 1997, Rússia em 1998, Brasil em 1999, Argentina em 2001.",
        ],
      },
      {
        titulo: "Como funciona a classificação",
        paragrafos: [
          "Não há uma lista única. Provedores de índices como MSCI e FTSE olham o desenvolvimento econômico, o tamanho e a liquidez da bolsa e a facilidade de acesso para estrangeiros. Por isso os critérios nem sempre batem: a Coreia do Sul é desenvolvida para a FTSE e emergente para a MSCI.",
          "Abaixo dos emergentes estão os mercados de fronteira, menores e menos acessíveis. Acima, os desenvolvidos. Países sobem e descem de categoria, e cada mudança move bilhões de dólares de fundos que seguem os índices.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Ser emergente não garante crescer mais. Cada país corre em direção ao próprio teto, definido por instituições, educação, poupança e contas públicas. Uns convergem para a renda dos ricos; outros ficam presos no meio do caminho por décadas.",
          "E crescimento alto não garante bolsa boa. Se o preço já embute o crescimento, ou se o lucro vai para o Estado, para o controlador ou para fora, o acionista minoritário pode ganhar pouco num país que cresce muito.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Pelo FMI, o Brasil deve crescer 1,9% em 2026, contra 3,9% dos emergentes como grupo. Em agosto de 2026, o índice de emergentes da MSCI tinha 24 países, e o Brasil era 3,9% dele.",
        ],
      },
    ],
    exemplo: "Pelo FMI, o Brasil deve crescer 1,9% em 2026, contra 3,9% dos emergentes como grupo. Diferenças pequenas, repetidas por décadas, viram distâncias enormes. Hipotético: duas economias do mesmo tamanho, uma crescendo 2% e outra 4% ao ano. Em 35 anos, a primeira dobra; a segunda fica quase quatro vezes maior.",
    naPratica: "Diversificar não é só sair do Brasil para os Estados Unidos. Outros emergentes têm moedas, setores e ciclos diferentes, e podem ser parte da mesma estratégia. Mas lembre que, nas crises globais, os emergentes costumam cair juntos e as moedas deles também, o que limita o quanto eles protegem quem já tem o patrimônio num país emergente.",
    relacionados: [
      "msci-emerging-markets",
      "risco-pais",
      "diversificacao",
      "msci-acwi",
      "convergencia-condicional",
      "crescimento-potencial",
      "instituicoes",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "30:33",
      },
      {
        modulo: 1,
        aula: 1,
        tempo: "12:33",
      },
      {
        modulo: 1,
        aula: 3,
        tempo: "0:00",
      },
    ],
  },
  {
    slug: "fundo-de-investimento",
    termo: "Fundo de investimento",
    categoria: "Fundos e ETFs",
    apelidos: [
      "fundos de investimento",
      "cotas",
      "cotista",
      "cotistas",
      "mutual fund",
      "mutual funds",
      "fundos mútuos",
    ],
    resumo: "Um condomínio de investidores: cada um compra cotas, e um gestor aplica o dinheiro de todos segundo uma política definida no regulamento.",
    texto: [
      "Mil pessoas juntam R$ 100 mil cada uma. Com R$ 100 milhões, contratam um gestor profissional para investir conforme regras escritas. Cada pessoa recebe cotas proporcionais ao que aplicou, e o valor da cota sobe ou desce com a carteira. Isso é um fundo de investimento.",
      "Juridicamente, o fundo é um condomínio: o dinheiro é de todos os cotistas, separado do patrimônio do banco ou da gestora que o administra. Se a gestora quebrar, a carteira do fundo continua sendo dos cotistas.",
      "O fundo dá acesso a ativos e escala que o investidor sozinho não teria, mas cobra por isso. E há fundos para quase tudo: renda fixa, ações, multimercado, câmbio, imóveis e, cada vez mais, investimentos no exterior.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O primeiro fundo aberto moderno, em que o cotista pode entrar e sair a qualquer momento pelo valor da cota, nasceu em Boston em 1924. Nos Estados Unidos, esse tipo de fundo se chama mutual fund.",
          "No Brasil, o primeiro fundo de investimento foi o Crescinco, de 1957. A indústria cresceu com a inflação, quando aplicar sozinho era difícil, e hoje é regulada pela CVM. A regra atual, a Resolução 175, em vigor desde 2023, reorganizou os fundos em classes e subclasses e ampliou o espaço para investir lá fora.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "O valor da cota é o patrimônio do fundo, marcado a preço de mercado, dividido pelo número de cotas. Quando você aplica, compra cotas pelo valor do dia; quando resgata, vende.",
          "Há vários papéis. O administrador cuida da parte legal e contábil; o gestor decide onde investir; o custodiante guarda os ativos; o distribuidor vende as cotas. Cada um é pago, e a soma aparece nas taxas.",
          "O regulamento é o contrato. Ele diz o que o gestor pode comprar, quanto pode concentrar, se pode usar derivativos, quanto cobra e em quantos dias você recebe o dinheiro no resgate.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Os fundos brasileiros abertos têm o come-cotas: duas vezes por ano, em maio e novembro, parte do imposto sobre o rendimento é recolhida antecipadamente, com redução no número de cotas. Fundos de ações seguem outra regra.",
          "Lá fora, além dos mutual funds, os ETFs ganharam espaço justamente por custarem menos e serem negociados em bolsa. Fundos não têm a garantia do FGC: o risco é o dos ativos da carteira.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Comprar pelo nome. Um fundo chamado global pode ter uma fatia pequena lá fora, ou ter tudo lá fora com proteção cambial, o que elimina justamente a exposição ao dólar. Só o regulamento e a lâmina dizem.",
          "E escolher pelo retorno do último ano. O desempenho passado de um fundo diz pouco sobre o futuro; a taxa cobrada, ao contrário, se repete todo ano com certeza.",
        ],
      },
    ],
    exemplo: "Hipotético: você aplica R$ 10 mil num fundo cuja cota vale R$ 2,00 e recebe 5.000 cotas. Um ano depois, a cota vale R$ 2,20. Seu investimento vale R$ 11 mil, já descontadas as taxas. Se o fundo tiver come-cotas, em maio e novembro parte desse ganho vira imposto e o número de cotas diminui um pouco.",
    naPratica: "Fundos brasileiros que investem lá fora são uma das portas para dolarizar sem abrir conta no exterior. Leia o regulamento: ele diz se há proteção cambial, quanto custa, quanto de fato está fora e por quantas camadas de fundo o dinheiro passa até chegar ao ativo. Cada camada pode ter a sua taxa.",
    relacionados: [
      "etf",
      "taxa-de-administracao",
      "gestao-ativa",
      "gestao-passiva",
      "fundo-cambial",
      "fundo-multimercado",
      "custo-total",
      "fgc",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "35:56",
      },
    ],
  },
  {
    slug: "etf",
    termo: "ETF",
    categoria: "Fundos e ETFs",
    apelidos: [
      "ETFs",
      "exchange traded fund",
      "exchange traded funds",
      "fundo negociado em bolsa",
      "fundos negociados em bolsa",
      "fundo de índice",
      "fundos de índice",
      "ETFs locais",
    ],
    resumo: "Um fundo negociado em bolsa como uma ação, que em geral copia um índice. Com uma única cota, você vira sócio de centenas ou milhares de empresas.",
    texto: [
      "Comprar as 500 ações do S&P 500 uma a uma, na proporção certa, seria caro e trabalhoso. Um ETF faz isso por você. É um fundo que, em geral, replica um índice, e cujas cotas são compradas e vendidas na bolsa, durante o pregão, como qualquer ação.",
      "A sigla vem do inglês exchange-traded fund, fundo negociado em bolsa. Com uma única cota, às vezes de algumas dezenas de dólares, você vira sócio de centenas ou milhares de empresas, de dezenas de países.",
      "É o veículo mais simples e, em geral, o mais barato para diversificar entre mercados. Por isso aparece em praticamente toda conversa sobre dolarizar com método.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O primeiro ETF do mundo foi lançado em Toronto, em 1990. O que popularizou o formato foi o americano que segue o S&P 500, lançado em janeiro de 1993. Em pouco mais de três décadas, os ETFs saíram do zero para vários trilhões de dólares e viraram a principal forma de investir em índices.",
          "No Brasil, o primeiro ETF de ações chegou em 2004. Hoje a B3 tem ETFs de índices brasileiros e estrangeiros, de renda fixa e de cripto, além de BDRs de ETFs listados lá fora.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Há dois mercados ao mesmo tempo. No dia a dia, você compra e vende cotas de outros investidores na bolsa. Por trás, grandes instituições, os participantes autorizados, criam cotas novas entregando ao fundo a cesta de ações, ou resgatam cotas recebendo as ações de volta.",
          "Esse mecanismo mantém o preço da cota colado ao valor da carteira. Se a cota fica cara, alguém cria cotas novas e as vende; se fica barata, alguém compra cotas e as resgata. E, como os resgates são feitos em ações e não em dinheiro, o fundo raramente precisa vender a carteira, o que reduz custos e impostos dentro dele.",
          "A maioria dos ETFs é passiva e cobra pouco: os maiores de S&P 500 cobram de 0,03% a 0,1% ao ano.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Achar que todo ETF é diversificado. Há ETFs de um setor, de um país, de uma estratégia alavancada que multiplica o movimento diário do índice, de apostas na queda. Esses não servem como base de carteira de longo prazo.",
          "Ignorar o preço em dias de estresse. No flash crash de 6 de maio de 2010, parte dos ETFs americanos chegou a ser negociada por menos da metade do valor de fechamento por alguns minutos. Ordens limitadas, que fixam o preço máximo ou mínimo, evitam esse tipo de execução.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O mesmo índice pode ser comprado por um ETF americano, por um ETF europeu, por um ETF brasileiro que investe no índice de fora ou por um BDR de ETF na B3. A carteira é parecida; mudam o custo, a moeda da cotação, a forma de tributação e o que acontece na sucessão.",
          "O domicílio do ETF, o país onde ele está registrado, é uma das escolhas técnicas mais importantes, tema do Módulo III com Luiz Roxo.",
        ],
      },
    ],
    exemplo: "Hipotético: uma cota de ETF de ações globais custa US$ 100 e segue um índice com milhares de empresas de dezenas de países. Com ela, você tem um pedacinho de cada uma, por uma taxa que pode ficar abaixo de 0,1% ao ano. Em US$ 50 mil, isso dá menos de US$ 50 por ano. Um fundo ativo que cobre 1,5% custaria US$ 750.",
    naPratica: "ETF é o atalho para diversificar entre países e setores com pouco dinheiro e custo baixo. Mas o rótulo não basta: vale saber qual índice ele segue, quanto cobra, onde está domiciliado, se distribui ou reinveste os dividendos e como é tributado para quem mora no Brasil. O Módulo III trata de onde comprar e de quanto custa cada caminho.",
    relacionados: [
      "gestao-passiva",
      "indice-de-mercado",
      "bdr",
      "etf-ucits",
      "taxa-de-administracao",
      "tracking-error",
      "custo-total",
      "liquidez",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "13:04",
      },
    ],
  },
  {
    slug: "gestao-passiva",
    termo: "Gestão passiva",
    categoria: "Fundos e ETFs",
    apelidos: [
      "investimento passivo",
      "fundo passivo",
      "fundos passivos",
      "fundo indexado",
      "fundos indexados",
      "estratégia passiva",
    ],
    resumo: "Estratégia que não tenta bater o mercado: só replica um índice, com custo baixo. É a lógica da maioria dos ETFs.",
    texto: [
      "Um gestor ativo escolhe ações tentando ganhar do índice. Um fundo passivo simplesmente compra o índice inteiro, nos mesmos pesos, e aceita ficar com o retorno do mercado menos um custo pequeno.",
      "Gestão passiva é isso: uma estratégia que não tenta bater o mercado, só replicá-lo, com custo baixo. É a lógica da maioria dos ETFs e dos fundos de índice.",
      "Parece pouco ambicioso. Na prática, depois dos custos, essa falta de ambição supera a maioria dos gestores profissionais na maior parte dos mercados e prazos.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "John Bogle, fundador da Vanguard, lançou o primeiro fundo de índice para o público em 1976. A captação inicial foi um fracasso: cerca de US$ 11 milhões, muito abaixo do esperado, e o fundo ganhou o apelido de loucura de Bogle. Um concorrente chegou a espalhar cartazes dizendo que fundo de índice era coisa antiamericana.",
          "Quase meio século depois, os fundos passivos passaram os ativos em patrimônio nos Estados Unidos. A ideia virou o padrão da indústria.",
        ],
      },
      {
        titulo: "Como funciona o argumento",
        paragrafos: [
          "O argumento é aritmético, e foi resumido pelo economista William Sharpe, ganhador do Nobel. Somados, todos os investidores são o mercado. Antes dos custos, o investidor ativo médio empata com o passivo médio. Depois dos custos, que são maiores na gestão ativa, perde.",
          "Não é preciso supor que os gestores sejam ruins. Muitos são excelentes. O problema é que competem entre si, e a média deles, menos as taxas, fica abaixo do índice.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Os levantamentos SPIVA, da S&P, medem isso há mais de duas décadas. Em 2025, 79% dos fundos ativos de grandes empresas americanas ficaram atrás do S&P 500. Em 15 anos, perto de nove em cada dez.",
          "Warren Buffett transformou o argumento em aposta: em 2008, apostou que um fundo de índice do S&P 500 renderia mais em dez anos que uma seleção de fundos de hedge escolhida por um gestor profissional. O fundo de índice rendeu cerca de 8,5% ao ano; a média da seleção, menos de 3%.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Passivo não quer dizer sem risco. Um ETF de S&P 500 cai tanto quanto o S&P 500. A gestão passiva elimina o risco de o gestor errar, não o risco do mercado.",
          "E escolher o índice já é uma decisão ativa. Quem compra só um índice de tecnologia, ou só de um país, está fazendo uma aposta, mesmo que o veículo seja passivo.",
        ],
      },
    ],
    exemplo: "Hipotético: o mercado rende 8% ao ano. Um fundo passivo que cobra 0,1% entrega perto de 7,9%. Um ativo que cobra 1,5% precisa ganhar do mercado por 1,4 ponto todo ano só para empatar. Em 20 anos, R$ 100 mil viram perto de R$ 457 mil no passivo e R$ 352 mil no ativo que só empatou com o mercado antes das taxas.",
    naPratica: "Para quem quer exposição a um país ou ao mundo, a gestão passiva resolve o essencial com custo baixo. A decisão que mais pesa continua sendo a alocação: quanto em cada classe, moeda e país. Escolher o veículo barato e gastar a energia na alocação e na disciplina costuma render mais do que procurar o gestor que vai bater o mercado.",
    relacionados: [
      "gestao-ativa",
      "etf",
      "indice-de-mercado",
      "taxa-de-administracao",
      "alocacao-de-ativos",
      "custo-total",
      "alfa",
    ],
    noCurso: [
      { modulo: 1, aula: 3, tempo: "29:54" },
    ],
  },
  {
    slug: "gestao-ativa",
    termo: "Gestão ativa",
    categoria: "Fundos e ETFs",
    apelidos: [
      "gestor ativo",
      "gestores ativos",
      "fundo ativo",
      "fundos ativos",
      "escolha do papel",
      "escolher a ação A ou o fundo B",
      "stock picking",
    ],
    resumo: "Estratégia em que o gestor escolhe ativos e momentos tentando render mais que um índice de referência. Cobra mais caro por isso.",
    texto: [
      "O gestor ativo estuda empresas, setores e cenários e monta uma carteira diferente do índice, apostando que vai render mais. Escolhe quais ativos comprar, quanto de cada um e quando entrar e sair. Por esse trabalho, cobra mais caro que um fundo passivo.",
      "Pode dar certo, e alguns gestores têm históricos excelentes. O problema não é a existência de bons gestores; é identificá-los de antemão e pagar por eles menos do que eles entregam a mais.",
      "A gestão ativa é a regra nos fundos brasileiros, sobretudo nos multimercados e nos de ações. Lá fora, perdeu espaço para os fundos de índice.",
    ],
    secoes: [
      {
        titulo: "As fontes de resultado",
        paragrafos: [
          "David Swensen, que cuidou do dinheiro de Yale por 36 anos, separava três fontes de resultado: quanto pôr em cada classe de ativo, a hora de entrar e sair e a escolha do papel. As duas últimas são o terreno da gestão ativa, e pesam bem menos no longo prazo do que a primeira.",
          "Mesmo Swensen, um dos investidores institucionais mais bem-sucedidos da história, recomendava fundos de índice para o investidor pessoa física. Ele tinha acesso aos melhores gestores do mundo; o pequeno investidor, em geral, não.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "A evidência é dura para a média. Nos levantamentos da S&P, a maioria dos fundos ativos de ações americanas fica atrás do índice ano após ano, e quase todos ficam em prazos de 15 anos ou mais.",
          "Pior: o sucesso passado se repete pouco. Os estudos mostram que os fundos que vão mal tendem a continuar mal, porque taxas e giro alto são características estáveis, enquanto os que vão bem raramente sustentam a vantagem por muito tempo.",
        ],
      },
      {
        titulo: "Onde faz sentido",
        paragrafos: [
          "Há mercados em que a gestão ativa tem mais chance: os menos acompanhados por analistas, os de crédito privado, os de empresas pequenas e algumas estratégias específicas. Também há gestores que agregam valor de outras formas, controlando risco, evitando concentrações e mantendo o cliente disciplinado.",
          "Há ainda um argumento de escala. Um ponto a mais de retorno sobre US$ 1 bilhão paga uma equipe inteira de analistas; sobre US$ 100 mil, não paga quase nada. Pesquisa séria só compensa em carteiras grandes.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Peter Lynch, gestor do fundo Magellan, da Fidelity, entregou perto de 29% ao ano de 1977 a 1990, um dos melhores históricos de que se tem notícia. Mas boa parte dos cotistas não ganhou isso: entravam depois das altas e saíam depois das quedas. O resultado do gestor e o resultado do cotista podem ser muito diferentes.",
        ],
      },
    ],
    exemplo: "Hipotético: um fundo ativo bate o índice por 2 pontos num ano e perde por 3 no seguinte. Depois de uma taxa de 2% ao ano, o cotista ficou bem atrás de quem só comprou o índice: perto de 5 pontos abaixo em dois anos, já somadas as taxas.",
    naPratica: "Gestão ativa pode fazer sentido em mercados menos eficientes ou em estratégias específicas. Para a parte do patrimônio que você quer dolarizar com simplicidade, custo e alocação costumam importar mais que a escolha do gestor. Se optar por um ativo, pergunte o que ele faz que um ETF barato não faz, e quanto cobra por isso.",
    relacionados: [
      "gestao-passiva",
      "taxa-de-performance",
      "alfa",
      "fundo-multimercado",
      "alocacao-de-ativos",
      "excesso-de-confianca",
      "retorno-do-investidor",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "0:12",
      },
    ],
  },
  {
    slug: "taxa-de-administracao",
    termo: "Taxa de administração",
    categoria: "Fundos e ETFs",
    apelidos: [
      "taxas de administração",
      "expense ratio",
      "taxa total",
      "taxa anual",
      "custo anual",
    ],
    resumo: "O percentual que o fundo cobra por ano sobre o patrimônio, descontado aos poucos da cota. Parece pequeno, mas incide todo ano, sobre tudo, com juros compostos.",
    texto: [
      "Um fundo cobra 1% ao ano. Você não recebe boleto: a taxa é descontada todos os dias do valor da cota, e o rendimento que aparece no extrato já vem líquido dela. Por isso muita gente nem percebe quanto paga.",
      "Taxa de administração é esse percentual anual cobrado sobre todo o patrimônio que você tem no fundo, independentemente do resultado. Remunera a gestão, a administração, a custódia e, muitas vezes, quem vendeu o fundo para você.",
      "Parece pequeno. Mas incide todo ano, sobre tudo, com juros compostos, e é um dos poucos fatores do investimento que você conhece com certeza antes de entrar.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A taxa é anual, mas cobrada diariamente: 1% ao ano equivale a um desconto de perto de 0,004% por dia útil. Como a cobrança é sobre o patrimônio e não sobre o ganho, ela existe mesmo nos anos em que o fundo perde dinheiro.",
          "Na regra atual da CVM, a cobrança aparece separada em partes: a de administração, a de gestão e a de distribuição. Parte do que você paga pode voltar ao distribuidor como rebate, uma comissão pela venda. É um incentivo a oferecer fundos mais caros.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Nos ETFs americanos, a taxa equivalente se chama expense ratio. Os maiores ETFs de S&P 500 cobram em torno de 0,03% a 0,1% ao ano. Fundos ativos no Brasil podem cobrar 1%, 2% ou mais, às vezes com taxa de performance por cima.",
          "A competição entre os grandes gestores de índices derrubou as taxas nos Estados Unidos ao longo das últimas décadas. No Brasil, o movimento é mais lento, mas também existe.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Um livro-texto de investimentos faz a conta com três fundos que rendem os mesmos 12% ao ano antes dos custos. Em 20 anos, a diferença de um ponto de taxa entre o mais barato e um fundo ativo típico custou cerca de 16% do patrimônio final.",
          "Quanto mais longo o prazo, maior o peso. É a mesma mágica dos juros compostos, trabalhando contra você.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Comparar taxas de fundos com estratégias diferentes. Um fundo de renda fixa simples que cobra 1% e um multimercado que cobra 2% não estão na mesma régua.",
          "E esquecer as camadas. Um fundo que investe em outro fundo, que investe num ETF, pode cobrar três taxas sobre o mesmo dinheiro. A conta que importa é o custo total.",
        ],
      },
    ],
    exemplo: "Hipotético: R$ 100 mil por 20 anos a 8% ao ano viram cerca de R$ 466 mil. Com 1 ponto de taxa, rendendo 7%, viram R$ 387 mil. A diferença, perto de R$ 80 mil, é o custo de um ponto por ano. Com 2 pontos, rendendo 6%, sobram R$ 321 mil.",
    naPratica: "Ao comparar formas de investir lá fora, some a taxa do veículo ao custo de câmbio e aos impostos. Em prazos longos, a taxa é um dos poucos fatores que você controla com certeza, e pagar caro só faz sentido quando o veículo entrega algo que um caminho barato não entrega.",
    relacionados: [
      "custo-total",
      "taxa-de-performance",
      "juros-compostos",
      "gestao-passiva",
      "etf",
      "fundo-de-investimento",
      "gestao-ativa",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "35:56",
      },
    ],
  },
  {
    slug: "taxa-de-performance",
    termo: "Taxa de performance",
    categoria: "Fundos e ETFs",
    apelidos: [
      "taxas de performance",
      "taxa de incentivo",
      "performance fee",
    ],
    resumo: "Uma fatia do ganho que o gestor cobra quando o fundo rende acima de um índice de referência, em geral 20% do que exceder.",
    texto: [
      "Um multimercado cobra 2% de administração e 20% do que render acima do CDI. Se o CDI deu 10% e o fundo, 15% antes da performance, o gestor fica com 20% dos 5 pontos de excesso, ou 1 ponto.",
      "Taxa de performance é essa fatia do ganho que o gestor cobra quando o fundo rende acima de um índice de referência, em geral 20% do que exceder. A ideia é alinhar interesses: o gestor ganha mais quando o cotista ganha mais.",
      "É comum nos multimercados e fundos de ações brasileiros e nos fundos de hedge lá fora. Bem desenhada, premia quem entrega. Mal entendida, pode custar mais do que parece.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O primeiro fundo de hedge, criado em 1949 por Alfred Winslow Jones, já cobrava 20% do lucro. O modelo de 2% de administração e 20% de performance virou o padrão da indústria e ganhou até apelido: dois e vinte.",
          "No Brasil, a CVM exige que a performance seja cobrada sobre um índice de referência compatível com a política do fundo e que respeite a linha d'água.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "A linha d'água, ou high water mark, impede o gestor de cobrar de novo antes de recuperar perdas anteriores. Se a cota caiu de R$ 100 para R$ 90, ele só volta a cobrar performance depois que ela passar dos R$ 100.",
          "A cobrança é feita em períodos definidos no regulamento, em geral a cada semestre, e só sobre a parte que superou o índice de referência no período.",
        ],
      },
      {
        titulo: "O custo escondido",
        paragrafos: [
          "Uma forma de enxergar a taxa de performance é como uma aposta de mão única para o gestor. Se a carteira sobe muito, ele ganha uma fatia. Se cai, não devolve nada. Quanto mais a carteira oscila, mais vale essa aposta para ele.",
          "Um livro-texto de investimentos faz a conta para um fundo com oscilação alta: a taxa de 20% equivalia a cerca de 2,4% do patrimônio por ano em valor esperado. Somada aos 2% de administração, o custo total ficava perto de 4,4% ao ano. Esse incentivo a correr risco é uma das razões da linha d'água.",
        ],
      },
    ],
    exemplo: "Hipotético: um fundo rende 15% bruto, cobra 2% de administração e 20% sobre o que passar de um CDI de 10%. Depois da administração, sobram 13%; a performance leva 20% dos 3 pontos de excesso, 0,6 ponto. O cotista fica com perto de 12,4%. Somadas as duas taxas, o gestor ficou com cerca de um sexto do ganho bruto.",
    naPratica: "Taxa de performance faz sentido quando o gestor de fato agrega algo difícil de comprar barato. Para exposição a mercados amplos, como bolsas e títulos americanos, há caminhos sem ela. E, num fundo que investe lá fora, confira contra qual índice a performance é medida: cobrar sobre o CDI uma carteira que ganha com a alta do dólar pode premiar o câmbio, e não o gestor.",
    relacionados: [
      "taxa-de-administracao",
      "gestao-ativa",
      "fundo-multimercado",
      "custo-total",
      "alfa",
      "ihfa",
    ],
  },
  {
    slug: "tracking-error",
    termo: "Tracking error",
    categoria: "Fundos e ETFs",
    apelidos: [
      "erro de rastreamento",
      "tracking difference",
      "descolamento do índice",
    ],
    resumo: "O quanto um fundo de índice se afasta do índice que deveria copiar. Vem de taxas, impostos sobre dividendos, caixa parado e custos de operação.",
    texto: [
      "O índice subiu 10% no ano, e o ETF que deveria copiá-lo subiu 9,8%. Esses 0,2 ponto de diferença têm causa: a taxa do fundo, o imposto retido sobre os dividendos, o dinheiro que fica parado em caixa e o custo de comprar e vender ações.",
      "No uso comum, tracking error é esse descolamento entre um fundo de índice e o índice que ele copia. No sentido técnico, é a medida de quanto essa diferença oscila ao longo do tempo.",
      "Para quem escolhe entre ETFs parecidos, é o número que mostra se o fundo faz bem o único trabalho que tem.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Os profissionais separam duas coisas. A diferença de retorno, quanto o fundo rendeu a menos ou a mais que o índice num período. E o tracking error propriamente dito, o quanto essa diferença varia de um período para outro.",
          "Um bom ETF tem diferença pequena e estável, perto da taxa que cobra. Um ruim se afasta do índice de forma irregular, às vezes para mais, às vezes para menos, o que torna o resultado imprevisível.",
        ],
      },
      {
        titulo: "De onde vem a diferença",
        paragrafos: [
          "A taxa de administração é a parte previsível. O imposto sobre dividendos depende do domicílio do fundo e dos tratados do país dele: um ETF irlandês que compra ações americanas tem 15% retidos sobre os dividendos; um fundo de outro país pode ter mais.",
          "Há ainda o caixa parado, os custos de rebalancear quando o índice muda e a amostragem: em índices com milhares de ações, o fundo às vezes compra só uma parte representativa delas.",
          "Também há receitas que reduzem a diferença. Muitos ETFs emprestam ações da carteira a outros investidores e cobram por isso, o que pode fazer o fundo render um pouco acima do índice.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Num fundo passivo, você não paga para alguém ganhar do mercado; paga para receber o mercado. Uma diferença grande e irregular frustra esse objetivo, mesmo que a taxa anunciada seja baixa.",
          "Para o investidor brasileiro, entra mais uma camada. Um ETF brasileiro que replica um índice estrangeiro pode ter a diferença do câmbio de referência, do horário de fechamento e de eventuais proteções cambiais.",
        ],
      },
    ],
    exemplo: "Hipotético: dois ETFs seguem o mesmo índice e cobram a mesma taxa de 0,1%. Um rende 0,1 ponto abaixo do índice ao ano; o outro, 0,6 ponto. Em 20 anos, sobre US$ 100 mil num índice que rende 8%, a diferença entre os dois chega perto de US$ 40 mil. O segundo tem custos escondidos, como imposto maior sobre dividendos ou operação ineficiente.",
    naPratica: "Ao escolher entre ETFs parecidos, olhe o desempenho contra o índice ao longo de vários anos, e não só a taxa anunciada. O domicílio do fundo pode pesar aqui, por causa do imposto sobre dividendos, e é por isso que a escolha entre um ETF americano e um europeu não é só de preferência.",
    relacionados: [
      "etf",
      "gestao-passiva",
      "taxa-de-administracao",
      "etf-ucits",
      "indice-de-mercado",
      "custo-total",
    ],
  },
  {
    slug: "reit",
    termo: "REIT",
    categoria: "Fundos e ETFs",
    apelidos: [
      "REITs",
      "Real Estate Investment Trust",
      "fundos imobiliários americanos",
      "fundo imobiliário americano",
      "self storage",
      "self storages",
    ],
    resumo: "Empresa americana que tem e administra imóveis que geram renda e distribui quase todo o lucro aos acionistas. É o primo americano do fundo imobiliário.",
    texto: [
      "Você pode ser dono de um pedaço de um data center na Virgínia, de uma torre de celular no Texas ou de um galpão logístico na Califórnia comprando uma ação na bolsa. É o que um REIT permite.",
      "REIT é a sigla em inglês de fundo de investimento imobiliário, mas o formato é de empresa: uma companhia americana que tem e administra imóveis que geram renda e distribui quase todo o lucro aos acionistas. É o primo americano do fundo imobiliário brasileiro.",
      "O mercado americano tem REITs de nichos que nem existem por aqui, e por isso eles aparecem na aula 4 como exemplo de diversificação que a bolsa brasileira não oferece.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Os REITs foram criados pelo Congresso americano em 1960, para que o investidor comum pudesse ter imóveis comerciais grandes, antes acessíveis só a famílias ricas e instituições. A lógica era a mesma de um fundo: muitas pessoas, cada uma com um pedaço, e gestão profissional.",
          "O modelo foi copiado no mundo inteiro. O fundo imobiliário brasileiro, de 1993, segue a mesma ideia com outro formato jurídico.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Em troca de não pagar imposto de renda na empresa, o REIT precisa cumprir regras: ter a maior parte dos ativos e da receita ligada a imóveis e distribuir pelo menos 90% do lucro tributável aos acionistas. O imposto fica para quem recebe.",
          "Há REITs de quase tudo: escritórios, shoppings, apartamentos para aluguel, hospitais, hotéis, torres de telecomunicação, data centers, galpões e os self storages, depósitos alugados por quem se mudou para um apartamento menor e não tem onde guardar a prancha de surfe, o exemplo da aula. Há também os REITs de hipotecas, que não têm imóveis e sim financiamentos imobiliários.",
        ],
      },
      {
        titulo: "O risco dos juros",
        paragrafos: [
          "REITs oscilam como ações e são sensíveis aos juros por dois caminhos. Quando os juros sobem, os dividendos ficam menos atraentes em comparação com os títulos do governo. E o financiamento dos próprios REITs, que costumam usar muita dívida, fica mais caro.",
          "Em 2022, com a alta rápida dos juros americanos, os índices de REITs caíram perto de um quarto. Escritórios sofreram mais, pela combinação de juros altos e trabalho remoto.",
        ],
      },
      {
        titulo: "Para quem mora no Brasil",
        paragrafos: [
          "O dividendo de REIT pago a quem mora no Brasil tem 30% retidos nos Estados Unidos, como o de qualquer ação americana. Como os REITs distribuem quase todo o lucro, esse imposto pesa mais neles do que em empresas que pagam pouco. O tratamento no Brasil é tema do Módulo III.",
        ],
      },
    ],
    exemplo: "Hipotético: um REIT de galpões logísticos lucra US$ 100 milhões no ano e distribui US$ 92 milhões. Quem tem 1% das ações recebe US$ 920 mil antes de impostos. Para um investidor que mora no Brasil, a retenção americana de 30% deixa US$ 644 mil.",
    naPratica: "REITs dão acesso a imóveis americanos com renda em dólar, sem comprar um imóvel lá, e a setores imobiliários que não existem no Brasil. Para quem já tem imóvel próprio e fundos imobiliários aqui, são uma forma de diversificar o patrimônio imobiliário de país e de moeda. O preço é a oscilação de ação e o imposto maior sobre a renda.",
    relacionados: [
      "fundo-imobiliario",
      "dividendo",
      "etf",
      "renda-variavel",
      "acao",
      "imposto-retido-nos-eua",
      "data-center",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "14:31",
      },
    ],
  },
  {
    slug: "fundo-imobiliario",
    termo: "Fundo imobiliário",
    sigla: "FII",
    categoria: "Fundos e ETFs",
    apelidos: [
      "fundos imobiliários",
      "FIIs",
    ],
    resumo: "Fundo brasileiro negociado em bolsa que investe em imóveis ou em títulos ligados a imóveis e distribui a maior parte da renda aos cotistas, em geral todo mês.",
    texto: [
      "Com algumas dezenas de reais, você compra uma cota de um fundo dono de lajes corporativas, galpões ou shoppings, e recebe todo mês uma parte dos aluguéis. É o fundo imobiliário, o FII.",
      "É um fundo brasileiro negociado em bolsa que investe em imóveis ou em títulos ligados a imóveis e distribui a maior parte da renda aos cotistas. Para muita gente, foi a porta de entrada na B3: o rendimento mensal lembra um aluguel, sem inquilino para administrar.",
      "Para o curso, o FII interessa por outro motivo: é imóvel brasileiro, em reais, sujeito ao ciclo de juros daqui. Ajuda a entender o que um REIT americano acrescenta e o que não acrescenta.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O fundo imobiliário foi criado por lei em 1993, inspirado nos REITs americanos. Passou anos como produto de nicho e explodiu na década de 2010, com juros em queda, acesso pelo aplicativo da corretora e a isenção de imposto sobre os rendimentos para a pessoa física.",
          "Hoje há centenas de fundos listados na B3, e o IFIX, índice da bolsa para esses fundos, serve de régua do setor.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "A lei obriga o fundo a distribuir pelo menos 95% do lucro apurado em cada semestre, e por isso o rendimento costuma cair na conta todo mês. As cotas são negociadas na B3 e oscilam como ações.",
          "Há dois grandes tipos. Os de tijolo têm imóveis físicos e vivem de aluguel. Os de papel compram títulos de crédito imobiliário, como os CRIs, e vivem dos juros e da correção desses títulos. Há ainda os fundos de fundos, que compram cotas de outros FIIs.",
          "Os rendimentos são isentos de imposto de renda para a pessoa física se o fundo tiver pelo menos 100 cotistas, cotas negociadas em bolsa ou balcão e se o investidor tiver menos de 10% das cotas. O ganho na venda das cotas é tributado.",
        ],
      },
      {
        titulo: "O risco dos juros",
        paragrafos: [
          "Quando a Selic sobe, o rendimento de um FII passa a competir com títulos públicos que pagam mais, sem risco de vacância. O preço das cotas cai até o rendimento voltar a ser atraente. Quando a Selic cai, acontece o contrário.",
          "Por isso o FII é, em boa parte, uma aposta nos juros brasileiros. Rendimento mensal estável não quer dizer patrimônio estável.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Rendimento alto não é retorno alto. Se o fundo distribui 10% ao ano e a cota cai 15%, você perdeu dinheiro. E parte do rendimento de alguns fundos pode vir de ganhos pontuais, como a venda de um imóvel, que não se repetem.",
        ],
      },
    ],
    exemplo: "Hipotético: uma cota custa R$ 100 e paga R$ 0,80 por mês. O rendimento é de perto de 10% ao ano, se o aluguel se mantiver e o preço não mudar, o que nenhuma das duas coisas garante. Se a Selic sobe e o mercado passa a exigir 12%, a mesma cota tende a cair para perto de R$ 80, mesmo com o aluguel intacto.",
    naPratica: "FII é imóvel brasileiro, em reais, sujeito ao ciclo de juros daqui. Combinado a um imóvel próprio, ao salário e à previdência, aumenta a dependência da mesma economia. Para quem quer diversificar o patrimônio imobiliário de país e de moeda, os REITs americanos fazem o papel que o FII não faz, com imposto e oscilação próprios.",
    relacionados: [
      "reit",
      "dividendo",
      "renda-variavel",
      "risco-de-concentracao",
      "selic",
      "home-bias",
      "capital-humano",
    ],
  },
  {
    slug: "bdr",
    termo: "BDR",
    categoria: "Fundos e ETFs",
    apelidos: [
      "BDRs",
      "Brazilian Depositary Receipt",
      "Brazilian Depositary Receipts",
      "recibos de ações estrangeiras",
      "BDRs de ETFs",
      "BDR de ETF",
    ],
    resumo: "Certificado negociado na B3, em reais, que representa ações ou ETFs listados no exterior. Desde 2020, qualquer investidor pode comprar.",
    texto: [
      "Você quer ações de uma empresa americana, mas não quer abrir conta lá fora. Uma instituição brasileira compra as ações nos Estados Unidos, guarda-as em custódia e emite na B3 certificados que as representam. Você compra e vende em reais, pela corretora de sempre.",
      "Esses certificados são os BDRs, sigla em inglês de recibos de depósito brasileiros. É o caminho inverso do ADR: em vez de levar empresas brasileiras para Nova York, traz empresas e fundos de fora para a B3.",
      "É um dos caminhos mais simples para ter ativos e dólar no patrimônio, e um dos que o Módulo III compara com a conta no exterior.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Os BDRs existem no Brasil há décadas, mas por muito tempo os mais comuns, os não patrocinados, eram restritos a investidores qualificados, com mais de R$ 1 milhão aplicado.",
          "Em agosto de 2020, a CVM mudou a regra: a partir de setembro daquele ano, qualquer investidor passou a poder comprar esses BDRs, e foram autorizados os BDRs de ETFs. Com isso, ficou possível comprar, de dentro do Brasil, fundos que seguem índices de fora, como o S&P 500 ou o índice global de ações.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Cada BDR representa uma quantidade definida de ações ou cotas lá fora, às vezes uma fração delas. O preço acompanha o do ativo original convertido pelo câmbio do dia, com algum descolamento quando há pouca liquidez ou quando a bolsa americana está fechada e a B3 aberta.",
          "Há BDRs patrocinados, emitidos com a participação da própria empresa estrangeira, e não patrocinados, emitidos por uma instituição depositária por conta própria. A maioria dos BDRs disponíveis é do segundo tipo.",
          "Os dividendos da empresa de fora chegam convertidos em reais, depois de passar pelo imposto retido no país de origem.",
        ],
      },
      {
        titulo: "O que muda em relação à conta lá fora",
        paragrafos: [
          "Com o BDR, o patrimônio continua no Brasil: custódia na B3, corretora brasileira, regras e impostos brasileiros. É mais simples de declarar e não exige remessa nem câmbio separado.",
          "O outro lado é que o dinheiro não sai da jurisdição brasileira. Se o objetivo for também diversificar o lugar onde o patrimônio está guardado, a sucessão ou o acesso em caso de crise local, o BDR não resolve. A liquidez também costuma ser menor que a do ativo original, o que pode encarecer a compra e a venda.",
        ],
      },
    ],
    exemplo: "Hipotético: uma ação americana sobe 5% e o dólar sobe 3% no dia. O BDR dela na B3 tende a subir perto de 8%, mesmo cotado em reais. No dia em que a ação sobe 5% e o dólar cai 5%, o BDR fica perto de zero.",
    naPratica: "O BDR dá exposição ao ativo e ao dólar sem tirar o dinheiro do país. Isso tem vantagens de simplicidade e limites: o patrimônio continua sob custódia e regras brasileiras, com imposto próprio. Para muitos investidores, é o primeiro passo; o Módulo III compara o BDR com a conta no exterior em custo, imposto e sucessão.",
    relacionados: [
      "adr",
      "etf",
      "risco-cambial",
      "liquidez",
      "custo-total",
      "conta-global",
      "corretora-internacional",
      "custodia",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "13:04",
      },
    ],
  },
  {
    slug: "fundo-multimercado",
    termo: "Fundo multimercado",
    categoria: "Fundos e ETFs",
    apelidos: [
      "multimercado",
      "multimercados",
      "fundos multimercados",
      "fundos multimercado",
      "hedge fund",
      "hedge funds",
    ],
    resumo: "Fundo brasileiro que pode investir em várias classes ao mesmo tempo, como juros, câmbio, bolsa e derivativos, conforme a visão do gestor. É o parente local dos hedge funds.",
    texto: [
      "Um gestor acha que os juros brasileiros vão cair, o dólar vai subir e a bolsa americana vai bem. Num fundo multimercado, ele pode montar as três apostas no mesmo fundo, com uma liberdade que um fundo de renda fixa ou de ações não teria.",
      "Multimercado é o fundo brasileiro que pode investir em várias classes ao mesmo tempo, como juros, câmbio, ações e derivativos, conforme a visão do gestor. É o tipo de fundo daqui que mais se parece com os hedge funds americanos.",
      "Nos anos de juros altos e gestores estrelados, virou sinônimo de sofisticação no Brasil. A pergunta que importa, porém, é a mesma de qualquer gestão ativa: o que sobra para o cotista depois das taxas?",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O regulamento dá ao gestor um mandato amplo. Ele pode comprar e vender a descoberto, usar derivativos para alavancar ou proteger posições e mudar de estratégia rapidamente.",
          "Há vários estilos. Os macro apostam em juros, moedas e bolsas a partir de cenários econômicos, e são a maior parte da indústria brasileira. Os long short compram umas ações e vendem outras. Os quantitativos seguem modelos estatísticos. Há também multimercados que são, na prática, carteiras de investimento no exterior.",
          "Quase todos cobram taxa de administração e de performance, em geral sobre o CDI.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "De janeiro de 2010 a dezembro de 2025, o IHFA, índice que mede a média dos multimercados, acumulou 388%, ou 10,4% ao ano, um pouco acima do CDI, que fez 9,7% ao ano. Na média, a indústria entregou o CDI com um pouco mais e com mais oscilação.",
          "A média esconde dispersão enorme. Alguns fundos multiplicaram o capital; outros perderam para o CDI por anos seguidos e fecharam.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Um multimercado pode ter posições em dólar, mas não é o mesmo que dolarizar. As apostas mudam com o gestor: hoje ele pode estar comprado em dólar, amanhã vendido. Você não controla a sua exposição à moeda.",
          "Muitos multimercados também apostam em grande parte nos juros brasileiros. Quem já tem renda fixa, imóvel e salário no Brasil pode estar dobrando o mesmo risco sem perceber.",
        ],
      },
    ],
    exemplo: "De janeiro de 2010 a dezembro de 2025, o IHFA, índice dos multimercados, acumulou 388%, ou 10,4% ao ano, um pouco acima do CDI, que fez 9,7% ao ano. Hipotético: R$ 100 mil viraram perto de R$ 488 mil na média dos multimercados e perto de R$ 440 mil no CDI. Uma diferença de 0,7 ponto ao ano, num investimento que oscilou bem mais.",
    naPratica: "Um multimercado pode ter posições em dólar, mas não é o mesmo que dolarizar: as apostas mudam com o gestor, e a moeda do fundo continua o real. Saber o que está por dentro é o que define o risco. Para a parte do patrimônio que você quer em dólar de forma estável, um veículo cuja exposição você controla tende a ser mais previsível.",
    relacionados: [
      "ihfa",
      "gestao-ativa",
      "taxa-de-performance",
      "fundo-de-investimento",
      "cdi",
      "taxa-de-administracao",
      "alfa",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "22:22",
      },
    ],
  },
  {
    slug: "ihfa",
    termo: "IHFA",
    categoria: "Fundos e ETFs",
    apelidos: [
      "Índice de Hedge Funds Anbima",
      "índice dos fundos multimercados",
      "índice dos multimercados",
    ],
    resumo: "O índice da Anbima que mede o desempenho médio dos fundos multimercados brasileiros. É a régua para saber como a indústria de multimercados foi no período.",
    texto: [
      "Como saber se um multimercado foi bem? Comparar com o CDI diz se ele bateu a renda fixa. Comparar com o IHFA diz se ele foi melhor ou pior que os concorrentes.",
      "O IHFA, Índice de Hedge Funds Anbima, mede o desempenho médio de uma amostra ampla de fundos multimercados brasileiros, ponderado pelo tamanho de cada fundo. É a régua da indústria de multimercados.",
      "Na aula 4, Rodolfo o usa para pôr lado a lado o que o investidor brasileiro teria ganho em diferentes caminhos de 2010 a 2025.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A Anbima, associação das instituições do mercado de capitais, seleciona os fundos que entram no índice por critérios de tamanho, histórico e classificação, e revisa a carteira periodicamente. O retorno do índice é a média dos retornos dos fundos, com peso maior para os maiores.",
          "Como é uma média de fundos reais, o IHFA já vem líquido das taxas que esses fundos cobram. É o que o cotista médio de multimercado teria ganho, antes do imposto.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Na aula, Rodolfo compara de 2010 a 2025 o IHFA, com 10,4% ao ano; o CDI, com 9,7%; o Ibovespa, com 5,5%; e uma carteira americana 60/40 medida em reais, com cerca de 15,2%.",
          "A comparação mostra duas coisas. A primeira é que, na média, os multimercados ficaram perto do CDI. A segunda é que, nesse período, a maior diferença de resultado veio de onde o dinheiro estava, em reais ou em dólar, e não da escolha do gestor.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Índices de fundos podem ter viés de sobrevivência: fundos que vão muito mal fecham e deixam de aparecer na conta, o que faz a média parecer melhor do que a experiência real dos cotistas.",
          "E comparar o IHFA com a carteira americana exige cuidado. Uma está em reais, com muito juro brasileiro; a outra, em dólar convertido. Parte da diferença de 2010 a 2025 veio da alta do dólar no período, que não se repete por obrigação.",
        ],
      },
    ],
    exemplo: "Na aula 4, Rodolfo compara de 2010 a 2025 o IHFA (10,4% ao ano), o CDI (9,7%), o Ibovespa (5,5%) e uma carteira americana 60/40 medida em reais (cerca de 15,2%). Hipotético: R$ 100 mil no começo de 2010 viraram perto de R$ 488 mil na média dos multimercados e quase o dobro disso, perto de R$ 960 mil, na carteira americana em reais.",
    naPratica: "O IHFA mostra que, em média, os multimercados ficaram perto do CDI no período. Para comparar com investimentos lá fora, é preciso trazer tudo para a mesma moeda e o mesmo risco, e lembrar que o período escolhido pesa muito no resultado. A lição durável não é qual ganhou, e sim que a decisão de onde estar pesou mais que a escolha de quem gere.",
    relacionados: [
      "fundo-multimercado",
      "cdi",
      "ibovespa",
      "carteira-60-40",
      "gestao-ativa",
      "retorno-em-reais",
      "alocacao-de-ativos",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 4,
        tempo: "22:22",
      },
    ],
  },
  {
    slug: "fundo-di",
    termo: "Fundo DI",
    categoria: "Fundos e ETFs",
    apelidos: [
      "fundos DI",
      "fundo referenciado DI",
      "fundos referenciados DI",
      "money market",
      "fundos de money market",
    ],
    resumo: "Fundo brasileiro que busca acompanhar o CDI, aplicando em títulos pós-fixados de baixo risco. Nos Estados Unidos, o parente são os fundos de money market.",
    texto: [
      "Um fundo DI aplica em Tesouro Selic, títulos de bancos e outros papéis que acompanham o juro de curto prazo, com o objetivo de render perto do CDI. É uma das formas mais comuns de guardar o caixa no Brasil, com resgate rápido e risco baixo.",
      "O nome vem do DI, o depósito interfinanceiro, que dá origem ao CDI. A rentabilidade do fundo é o CDI do período menos a taxa de administração e eventuais perdas com crédito.",
      "Nos Estados Unidos, o parente direto são os fundos de money market, onde o americano estaciona o dinheiro que não quer arriscar.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Pela regra da CVM, o fundo referenciado DI precisa manter a maior parte da carteira em ativos que acompanham o CDI, com predominância de títulos públicos ou de crédito de baixo risco. O resgate costuma cair na conta no mesmo dia ou no dia seguinte.",
          "O imposto segue a tabela regressiva da renda fixa, de 22,5% para aplicações curtas a 15% para as de mais de dois anos, com come-cotas em maio e novembro.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O fundo de money market americano aplica em títulos de curtíssimo prazo do Tesouro, os T-bills, e em papéis de empresas e bancos de alta qualidade, e rende perto do juro básico do Fed. É o lugar natural do caixa em dólar.",
          "Um caso real mostra que nem esse caixa é risco zero. Em setembro de 2008, um dia depois da quebra do Lehman Brothers, um dos fundos de money market mais antigos dos Estados Unidos anunciou que a cota tinha caído abaixo de US$ 1, porque tinha papéis do banco. O pânico obrigou o governo americano a garantir temporariamente esses fundos.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Pagar caro por um produto simples. Um fundo DI que cobra 1% ao ano entrega bem menos que o CDI, numa estratégia que o próprio investidor replica comprando Tesouro Selic direto.",
          "E confundir fundo DI com investimento de longo prazo. Ele guarda poder de compra em reais enquanto o juro real brasileiro for positivo, mas não diversifica moeda nem país.",
        ],
      },
    ],
    exemplo: "Hipotético: um fundo DI que cobra 1% ao ano, com o CDI a 13%, rende perto de 12% bruto. Um Tesouro Selic direto, sem essa taxa, rende perto do CDI. Em R$ 200 mil, a diferença é de cerca de R$ 2 mil por ano, só pelo pedágio.",
    naPratica: "O fundo DI é o lugar natural da reserva de emergência em reais. O money market cumpre papel parecido para quem já tem dinheiro em dólar: é onde o caixa fica enquanto espera alocação, rendendo o juro americano de curto prazo. Comparar os dois exige olhar o juro de cada moeda e o que o câmbio pode fazer no meio do caminho.",
    relacionados: [
      "cdi",
      "pos-fixado",
      "tesouro-selic",
      "reserva-de-emergencia",
      "taxa-de-administracao",
      "fed-funds",
      "crise-de-2008",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 3,
        tempo: "20:26",
      },
      {
        modulo: 1,
        aula: 1,
        tempo: "11:28",
      },
    ],
  },
  {
    slug: "fundo-cambial",
    termo: "Fundo cambial",
    categoria: "Fundos e ETFs",
    apelidos: [
      "fundos cambiais",
      "fundo de dólar",
    ],
    resumo: "Fundo brasileiro que busca acompanhar a variação de uma moeda estrangeira, em geral o dólar, aplicando a maior parte em ativos ligados a ela.",
    texto: [
      "O fundo cambial é o jeito mais direto de ter a variação do dólar sem sair do Brasil. Você aplica em reais, pela corretora ou pelo banco, e a cota sobe quando o dólar sobe e cai quando ele cai.",
      "Pela regra da CVM, pelo menos 80% da carteira precisa estar em ativos ligados à moeda estrangeira, como contratos futuros de dólar e títulos cambiais. O resto pode ficar em renda fixa.",
      "É uma ferramenta de proteção, e não de construção de patrimônio. Entender a diferença evita usar o produto para o objetivo errado.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A maior parte desses fundos não compra dólares de verdade. Eles aplicam o dinheiro em reais, em títulos que rendem perto do CDI, e compram contratos de dólar futuro na B3, que sobem e descem com a moeda.",
          "O preço do dólar futuro embute a diferença entre o juro brasileiro e o juro em dólar. Por isso o resultado do fundo não é só a variação do câmbio: soma também um pequeno juro em dólar, o cupom cambial, e desconta a taxa de administração.",
          "O imposto segue as regras de fundos de renda fixa, com come-cotas.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Fundo cambial não é patrimônio no exterior. O dinheiro continua no Brasil, sob regras brasileiras. Se o objetivo for também diversificar onde o patrimônio está, ele não resolve.",
          "E fundo cambial é dólar parado. Rende o câmbio e um juro baixo, sem a renda de ações ou títulos lá fora. Num período em que o dólar fica estável, o fundo rende quase nada, enquanto o CDI continua pagando.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O produto faz sentido para quem tem um gasto em dólar com data marcada: uma viagem, um curso no exterior, uma parcela de imóvel lá fora. Ele trava o poder de compra em dólar até a data, sem exigir remessa.",
          "Para quem quer construir patrimônio em dólar no longo prazo, a comparação é com ativos que rendem em dólar, como títulos do Tesouro americano e ações, e não com o fundo cambial.",
        ],
      },
    ],
    exemplo: "Hipotético: o dólar à vista sobe 5% num ano. Um fundo cambial pode render algo diferente disso, para mais ou para menos, por causa da taxa, do cupom cambial e de como os contratos futuros são rolados. Se o dólar ficar parado o ano inteiro, o fundo pode render perto de zero menos a taxa, enquanto um título do Tesouro americano pagaria o juro dele.",
    naPratica: "Fundo cambial protege contra a alta do dólar, mas é dólar parado, sem a renda de ações ou títulos lá fora, e continua sob a jurisdição brasileira. Serve a quem tem um gasto em dólar com data marcada mais do que a quem quer construir patrimônio no exterior.",
    relacionados: [
      "dolar-futuro",
      "hedge-cambial",
      "fundo-de-investimento",
      "dolarizacao",
      "risco-de-base",
      "paridade-de-juros",
      "treasury",
    ],
  },
  {
    slug: "etf-ucits",
    termo: "ETF UCITS",
    categoria: "Fundos e ETFs",
    apelidos: [
      "UCITS",
      "ETF irlandês",
      "ETFs irlandeses",
      "domicílio do ETF",
      "ETF de acumulação",
      "ETFs de acumulação",
      "ETF de distribuição",
      "acumulação e distribuição",
    ],
    resumo: "ETFs domiciliados na Europa, quase sempre na Irlanda ou em Luxemburgo, sob a regra europeia UCITS. Muito usados por investidores de fora dos EUA por diferenças de imposto.",
    texto: [
      "O mesmo índice, o S&P 500, pode ser comprado por um ETF registrado nos Estados Unidos ou por um registrado na Irlanda. Os dois seguem as mesmas ações, cobram taxas parecidas e sobem e descem juntos. Mas, para quem mora no Brasil, o domicílio muda o imposto e a sucessão.",
      "ETF UCITS é o ETF domiciliado na Europa, quase sempre na Irlanda ou em Luxemburgo, sob a regra europeia de fundos para o investidor comum, chamada UCITS. Muitos investidores de fora dos Estados Unidos preferem esses ETFs por razões de imposto.",
      "É uma das escolhas técnicas mais importantes de quem dolariza, e uma das menos óbvias.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A diretiva UCITS foi criada pela então Comunidade Europeia em 1985, para que um fundo registrado num país do bloco pudesse ser vendido nos outros com regras comuns de diversificação, liquidez e proteção ao investidor. O selo virou sinônimo de fundo regulado para o público em geral, e é aceito em muitos países fora da Europa.",
          "A Irlanda virou o principal domicílio dos ETFs europeus pela combinação de regras fiscais favoráveis e de uma rede ampla de tratados, inclusive com os Estados Unidos.",
        ],
      },
      {
        titulo: "Como funciona o imposto",
        paragrafos: [
          "Um ETF irlandês recebe os dividendos das empresas americanas com 15% de imposto retido, pelo tratado entre Irlanda e Estados Unidos. Um investidor brasileiro que recebe dividendos americanos diretamente, ou por um ETF americano, tem 30% retidos, porque não há tratado entre Brasil e Estados Unidos.",
          "Muitos ETFs UCITS são de acumulação: reinvestem o dividendo dentro do fundo, em vez de distribuí-lo. Para o investidor brasileiro, isso adia o imposto, porque, pela Lei 14.754, o ganho de aplicações financeiras no exterior é tributado em 15% quando realizado, na declaração anual.",
        ],
      },
      {
        titulo: "A questão da herança",
        paragrafos: [
          "Os Estados Unidos cobram imposto sobre a herança de estrangeiros que deixam ativos americanos acima de US$ 60 mil, com alíquotas que chegam a 40%. Ações e ETFs americanos contam como ativo americano. Um ETF irlandês, mesmo que invista em ações americanas, em geral não conta.",
          "Para quem pretende deixar patrimônio relevante em dólar para a família, a diferença pode ser maior que todos os outros custos somados.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "UCITS não quer dizer que o ETF invista na Europa. A maioria dos maiores ETFs UCITS segue índices americanos ou globais. O selo diz onde o fundo está registrado, e não onde ele investe.",
          "E as regras mudam. Tratados, leis brasileiras e interpretações da Receita podem alterar a conta, e por isso vale conferir a regra em vigor antes de decidir.",
        ],
      },
    ],
    exemplo: "Hipotético: um índice com dividendos de 1,5% ao ano. Com 30% retidos, você perde 0,45 ponto por ano; com 15%, 0,22 ponto. Em US$ 500 mil, a diferença é de pouco mais de US$ 1.100 por ano. Em 20 anos, numa carteira que renda 8% ao ano, a diferença acumulada passa de US$ 90 mil.",
    naPratica: "O domicílio do ETF é uma das escolhas técnicas mais importantes de quem dolariza, e envolve imposto sobre dividendos, momento da tributação no Brasil e risco de imposto sobre herança nos Estados Unidos. É assunto do Módulo III, com Luiz Roxo; confira sempre a regra em vigor e, para patrimônios grandes, a orientação de um especialista.",
    relacionados: [
      "etf",
      "imposto-de-renda",
      "tracking-error",
      "dividendo",
      "custo-total",
      "estate-tax",
      "lei-14754",
      "imposto-retido-nos-eua",
    ],
  },
  {
    slug: "custo-total",
    termo: "Custo total do investimento",
    categoria: "Fundos e ETFs",
    apelidos: [
      "custo total",
      "spread de compra e venda",
      "spread bid-ask",
      "bid-ask",
      "custo de câmbio",
      "custos de transação",
    ],
    resumo: "A soma de tudo o que sai do seu bolso para investir: câmbio, spread, IOF, corretagem, taxa do fundo, imposto. É ela, e não a taxa anunciada, que mede o custo de verdade.",
    texto: [
      "Investir lá fora tem várias camadas de custo, e quase nenhuma aparece num boleto. Cada uma parece pequena. Somadas, podem consumir uma parte relevante do retorno, sobretudo para quem entra e sai com frequência.",
      "Custo total é a soma de tudo o que sai do seu bolso para investir: câmbio, spread, IOF, corretagem, taxa do fundo, imposto retido, imposto no Brasil. É ela, e não a taxa anunciada, que mede o custo de verdade.",
      "Quando Felippe lista o que observar antes de investir lá fora, a lista começa por taxas de administração e de câmbio. Não é por acaso: são os custos que se repetem.",
    ],
    secoes: [
      {
        titulo: "As camadas",
        paragrafos: [
          "Na entrada, o spread cambial, a diferença entre o dólar que a instituição cobra e a cotação de referência, e o IOF. Para a remessa de uma pessoa física com finalidade de investimento, o IOF é de 1,1% desde 2025; outras operações de câmbio pagam alíquotas maiores.",
          "Na compra, a corretagem, hoje zero em muitas corretoras americanas, e o spread de compra e venda do ativo, a diferença entre o preço de quem vende e o de quem compra.",
          "Durante, a taxa do fundo ou do ETF, o imposto retido sobre dividendos e, em alguns veículos, taxa de custódia. Na saída, de novo câmbio e o imposto sobre o ganho no Brasil.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Um livro-texto de investimentos faz a conta com fundos que rendem o mesmo antes dos custos: em 20 anos, um ponto a mais de taxa por ano custou cerca de 16% do patrimônio final.",
          "No caminho internacional, a ordem de grandeza das camadas varia muito. Um ETF grande pode cobrar menos de 0,1% ao ano; um fundo brasileiro que investe lá fora via outros fundos pode somar mais de 2%. O imposto sobre dividendos depende do domicílio do veículo.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Comparar só a taxa anunciada. Um veículo com taxa baixa e câmbio caro, ou com imposto maior sobre dividendos, pode sair mais caro que outro com taxa um pouco maior.",
          "Entrar e sair com frequência. Os custos de entrada e saída, como spread e IOF, são pagos a cada movimento. Para quem fica dez anos, diluem-se; para quem gira a carteira todo ano, se repetem.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Retorno de mercado ninguém controla. Custo, em grande parte, sim. Por isso a comparação entre caminhos, conta no exterior, BDR, ETF local, fundo, deve ser feita pelo custo total ao longo do prazo que você pretende ficar, e não pela taxa da vitrine.",
        ],
      },
    ],
    exemplo: "Hipotético: 1% de spread cambial na ida, 1,1% de IOF, 0,1% ao ano de taxa do ETF e 30% retidos de dividendos de 1,5% ao ano. Em dez anos, a taxa e o imposto sobre dividendos custam perto de 5,5 pontos do patrimônio, além dos 2,1 pontos da entrada. Com um ETF que retém 15%, os 5,5 pontos caem para perto de 3,3.",
    naPratica: "Compare veículos pelo custo total, ao longo do prazo que você pretende ficar. Para quem dolariza aos poucos, vale somar câmbio, IOF, taxa, imposto sobre dividendos e imposto no Brasil num único número anual. O Módulo III faz essa conta caminho por caminho.",
    relacionados: [
      "spread-cambial",
      "taxa-de-administracao",
      "etf-ucits",
      "imposto-de-renda",
      "juros-compostos",
      "iof",
      "imposto-retido-nos-eua",
      "remessa",
    ],
    noCurso: [
      {
        modulo: 0,
        aula: 1,
        tempo: "35:56",
      },
    ],
  },
];

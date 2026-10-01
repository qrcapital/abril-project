import type { SecaoDaAula } from "@/lib/notebook";

// Módulo 0, aula 1 ("AULA 0"): abertura do curso, com Marcelo Campos e Felippe Hermes.
// Segue a ordem da aula (transcrição em `transcricoes/modulo-0/aula-1.txt`): a abertura, os mitos
// sobre dolarização e as cinco razões de Felippe, e o fechamento sobre estudo e tributação.
//
// NÚMEROS CONFERIDOS EM 01/OUT/2026 nas fontes primárias citadas em cada bloco. Onde a aula cita um
// número diferente do da fonte (inflação de 1979 a 1994, inflação americana, P/L, ano do ETF de ouro),
// o texto registra as duas coisas, sem apagar o que foi dito em aula.

const secao: SecaoDaAula = {
  aula: 1,
  blocos: [
    // ---- abertura ----------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "a-vida-ja-e-global",
      titulo: "A vida já é global; o patrimônio, não",
      resumo: "Concentrar tudo em uma moeda é uma aposta, e o acesso ao exterior deixou de ser privilégio de poucos.",
      tempo: "0:19",
    },
    {
      tipo: "texto",
      capitular: true,
      tempo: "0:19",
      paragrafos: [
        "O celular, o sistema operacional, a plataforma de streaming, o tênis: quase tudo o que o brasileiro consome no dia a dia tem dono, marca ou preço formado fora do Brasil. O patrimônio, porém, costuma ficar inteiro aqui, em reais, aplicado em empresas e títulos de um único país. A aula abre com essa assimetria, e ela é o ponto de partida do curso: manter 100% em uma moeda e em uma economia não é ausência de escolha, é uma aposta concentrada que raramente se faz de forma consciente.",
        "O que mudou foi o acesso. Até poucos anos atrás, investir lá fora pedia private banking, contrato de câmbio na agência e aplicação mínima alta. A Lei 14.286, de 2021, o novo marco cambial que entrou em vigor no último dia de 2022, simplificou as operações de câmbio e abriu caminho para contas em moeda estrangeira e para as contas globais oferecidas por bancos e fintechs. Hoje a abertura de conta cabe num aplicativo. A barreira deixou de ser operacional e passou a ser de método.",
        "Marcelo Campos faz uma ressalva antes de qualquer argumento a favor: dolarizar também tem risco. Quem vive e gasta em reais e compra um ativo em dólar passa a carregar dois riscos ao mesmo tempo, o do ativo e o da moeda. Uma ação americana que sobe 8% em dólar entrega perto de 19% em reais se o dólar subir 10% no período, e cerca de −3% se o dólar cair 10%. É o que o mercado chama de risco duplo, e ele vale nos dois sentidos: o câmbio que protege numa crise local é o mesmo que corrói o resultado quando o real se fortalece.",
        "O curso segue essa lógica, em quatro módulos que vão do porquê à prática: estratégia e diagnóstico com Rodolfo Bastos, renda fixa e ações americanas com Tony Volpon, acesso ao mercado dos Estados Unidos com Luiz Roxo e ativos digitais com Alexandre Ywata. Nesta abertura, Felippe Hermes, fundador da BlockTrends e do Spotniks, organiza o argumento em cinco razões. Este notebook acompanha a mesma ordem, com os números conferidos nas fontes originais.",
      ],
    },
    {
      tipo: "destaque",
      texto: "E isso não é uma escolha. É uma aposta. Uma aposta numa única moeda, numa única economia.",
      fonte: "Abertura da aula, 0:49",
    },

    // ---- razão 1: escala --------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "dois-por-cento-do-mundo",
      titulo: "Razão 1: o Brasil é cerca de 2% do mundo",
      resumo: "Dolarizar não é guardar cédula; é participar de uma economia cinquenta vezes maior que a brasileira.",
      tempo: "3:49",
    },
    {
      tipo: "texto",
      tempo: "3:49",
      paragrafos: [
        "Antes das razões, Felippe desfaz um mito. Dolarizar não é comprar dólar e guardar no colchão, nem uma posição política sobre este ou aquele governo. É ter parte do patrimônio em ações, imóveis e outros ativos que produzem renda fora do país. E \"fora\" não quer dizer só Estados Unidos: o dólar se consolidou como moeda de referência global com os acordos de Bretton Woods, em 1944, e carne, soja, minério e boa parte dos serviços do mundo são cotados nele. Antes do dólar, esse papel coube à libra esterlina, e o hábito de medir valor numa moeda central não desaparece se a moeda central mudar.",
        "A primeira razão é de escala. Pelas projeções do FMI de abril de 2026, o PIB brasileiro deve somar cerca de US$ 2,6 trilhões neste ano, perto de 2,1% de uma economia mundial de US$ 126 trilhões. Os números da aula, 1,9% e US$ 2,2 trilhões contra US$ 118 trilhões, correspondem a 2025: a fatia oscila conforme o ano e, sobretudo, conforme o câmbio. Em qualquer das contas, o resto do mundo produz cerca de 98% da riqueza, e é nesse resto que está a maior parte das marcas que o brasileiro conhece e usa.",
        "No mercado de ações, a distância é ainda maior. O MSCI ACWI, índice que cobre cerca de 85% do valor das ações negociáveis em 47 países, somava US$ 104 trilhões no fim de agosto de 2026; a parte brasileira, perto de US$ 490 bilhões, equivale a menos de 0,5% do total, enquanto os Estados Unidos sozinhos respondem por 63,6%. O índice pondera as empresas pelo valor das ações em livre circulação, o que reduz o peso de mercados com controle estatal ou acesso restrito a estrangeiros, como a China. Ainda assim, a mensagem não muda: quem investe só na B3 investe em menos de um duzentos avos do mercado global.",
        "Há um argumento que costuma passar despercebido, e a aula o expõe perto dos 9 minutos: o investidor brasileiro já está muito exposto ao Brasil antes de aplicar o primeiro real. Salário, carreira, aposentadoria do INSS e imóvel dependem da mesma economia, da mesma moeda e das mesmas decisões de política. Baxter e Jermann mostraram, num artigo de 1997 na American Economic Review, que a renda do trabalho tende a andar junto com o mercado de ações do próprio país, o que torna a concentração doméstica da carteira mais arriscada do que parece. A parte financeira do patrimônio é a única que se diversifica com alguns cliques.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "6:50",
      titulo: "O Brasil é 2% do PIB mundial e menos de 0,5% do mercado global de ações",
      subtitulo: "% do total mundial: PIB em US$ correntes (projeção 2026) e peso no índice MSCI ACWI (31/ago/2026)",
      forma: "barra",
      eixoX: ["EUA", "China", "Japão", "Reino Unido", "Índia", "Brasil"],
      series: [
        { nome: "PIB mundial", valores: [25.6, 16.5, 3.5, 3.4, 3.3, 2.1] },
        { nome: "Mercado global de ações (MSCI ACWI)", valores: [63.6, 2.4, 5.1, 3.1, 1.3, 0.5], destaque: true },
      ],
      formato: { sufixo: "%", casas: 1 },
      fonte:
        "FMI, World Economic Outlook, abr/2026 (PIB em US$ correntes); MSCI, factsheets MSCI ACWI e MSCI Emerging Markets, 31/ago/2026",
      nota:
        "Pesos de China, Índia e Brasil no ACWI calculados a partir do peso de cada país no MSCI Emerging Markets e do valor dos dois índices. O índice pondera pelo valor em livre circulação, o que reduz o peso de mercados com acesso restrito a estrangeiros.",
    },
    {
      tipo: "texto",
      tempo: "9:48",
      paragrafos: [
        "A outra metade da primeira razão é histórica. Quem viveu os anos 1980 lembra que a moeda brasileira não guardava valor de um mês para o outro. Pelo IPCA, índice que o IBGE calcula desde dezembro de 1979, os preços subiram cerca de 11 trilhões por cento entre o fim de 1979 e junho de 1994, o mês anterior ao real. A aula cita 13 trilhões, cifra que circula com outras janelas e outros índices; a ordem de grandeza é a mesma, e nenhuma das duas cabe na imaginação.",
        "Nesse ambiente, o brasileiro já usava o dólar como reserva de valor, ainda que não como meio de pagamento. A indexação se espalhou pelos contratos, e índices como o IGP-M, criado pela FGV em 1989, com peso grande de preços no atacado e de commodities cotadas em dólar, passaram a reajustar aluguéis e tarifas. Entre 1942 e 1994 o país trocou de moeda oito vezes, cinco delas em apenas oito anos, de 1986 a 1994.",
        "O real é o grande sucesso dessa história e, ainda assim, não escapou da inflação. De julho de 1994 a agosto de 2026, o IPCA acumulou alta de 733%: são precisos cerca de R$ 8,30 hoje para comprar o que R$ 1 comprava no lançamento da moeda, uma perda de 88% do poder de compra. No mesmo período, a média mensal do dólar comercial passou de R$ 0,93 para R$ 5,15, uma desvalorização de 82% do real contra a moeda americana. São esses os dois números por trás dos 762% e dos 83% citados em aula, que variam conforme o mês de referência.",
        "O detalhe que muda a decisão vem em seguida: o dólar também perde valor. O índice de preços ao consumidor americano subiu 126% no mesmo intervalo (a aula fala em 200%), e uma nota de dólar guardada desde 1994 compra hoje menos da metade do que comprava. Daí a conclusão de Felippe: dolarizar exige ativos que gerem renda e acompanhem a inflação, e não moeda parada.",
      ],
    },
    {
      tipo: "linhaDoTempo",
      tempo: "11:49",
      titulo: "Oito trocas de moeda entre 1942 e 1994",
      subtitulo: "Padrões monetários brasileiros e o corte de zeros em cada troca",
      eventos: [
        { data: "nov/1942", titulo: "Cruzeiro", texto: "Substitui o réis: mil réis passam a valer um cruzeiro." },
        { data: "fev/1967", titulo: "Cruzeiro novo", texto: "Corte de três zeros." },
        { data: "mai/1970", titulo: "Cruzeiro", texto: "Volta o nome antigo, sem corte de zeros." },
        { data: "fev/1986", titulo: "Cruzado", texto: "Plano Cruzado: três zeros a menos e congelamento de preços." },
        { data: "jan/1989", titulo: "Cruzado novo", texto: "Plano Verão: mais três zeros." },
        { data: "mar/1990", titulo: "Cruzeiro", texto: "Plano Collor: volta o nome, com bloqueio de aplicações financeiras." },
        { data: "ago/1993", titulo: "Cruzeiro real", texto: "Mais três zeros." },
        { data: "jul/1994", titulo: "Real", texto: "Um real passa a valer 2.750 cruzeiros reais, o valor de uma URV." },
      ],
      fonte: "Banco Central do Brasil, Museu de Valores, histórico das moedas brasileiras",
    },
    {
      tipo: "grafico",
      tempo: "12:31",
      titulo: "Desde o real, os preços subiram oito vezes aqui e pouco mais de duas vezes nos EUA",
      subtitulo: "Índice, julho de 1994 = 100; dezembro de cada ano e agosto de 2026",
      forma: "linha",
      escala: "log",
      eixoX: ["jul/1994", "dez/1994", "dez/1999", "dez/2004", "dez/2009", "dez/2014", "dez/2019", "dez/2024", "ago/2026"],
      series: [
        { nome: "IPCA, Brasil", valores: [100, 111, 173, 262, 329, 443, 581, 775, 833], destaque: true },
        { nome: "Dólar comercial em reais", valores: [100, 91, 197, 291, 188, 283, 440, 653, 552] },
        { nome: "Inflação ao consumidor, EUA", valores: [100, 101, 113, 128, 146, 158, 173, 213, 226] },
      ],
      formato: "indice",
      referencia: { valor: 100, rotulo: "Julho de 1994" },
      fonte:
        "IBGE, IPCA (Sidra, tabela 1737); Banco Central do Brasil, SGS 3698 (dólar comercial, venda, média mensal); BLS, CPI-U sem ajuste sazonal (FRED, CPIAUCNS)",
      nota:
        "Escala logarítmica. O dólar subiu mais do que a diferença entre as duas inflações (5,5 vezes contra 3,7 vezes): além da inflação, o real perdeu valor real contra a moeda americana no período.",
    },

    // ---- razão 2: a bolsa brasileira ----------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "uma-bolsa-de-bancos-e-commodities",
      titulo: "Razão 2: uma bolsa de bancos e commodities",
      resumo: "A B3 concentra finanças, energia e mineração; as teses que movem o mundo estão quase todas fora dela.",
      tempo: "13:04",
    },
    {
      tipo: "texto",
      tempo: "13:32",
      paragrafos: [
        "A segunda razão aparece quando o investidor já decidiu diversificar dentro do Brasil e olha para a bolsa. As empresas brasileiras mais lembradas, Itaú, Petrobras, JBS, Bradesco, Banco do Brasil, dividem-se entre bancos e commodities. O MSCI Brazil, que cobre cerca de 85% do valor do mercado local com 46 empresas, mostra o tamanho da concentração: no fim de agosto de 2026, financeiro, energia e materiais somavam 71% do índice, e as dez maiores posições, 61%. Tecnologia da informação não aparece.",
        "As 46 empresas citadas na aula vêm da mesma família de índices. O MSCI Emerging Markets reúne 1.178 ações de 24 países emergentes, e o Brasil responde por 3,9% dele; Taiwan, Coreia do Sul e China, juntos, passam de dois terços. O MSCI ACWI, que soma emergentes e desenvolvidos, tem 2.458 ações e valia US$ 104 trilhões em agosto, cerca de 214 vezes o MSCI Brazil. É a esse índice global, e não ao de emergentes, que corresponde a cifra de mais de 100 trilhões de dólares mencionada em aula.",
        "Os ETFs são o atalho para esse universo: fundos negociados em bolsa que replicam um índice e permitem comprar centenas ou milhares de empresas numa única cota, muitas vezes por algumas dezenas de dólares, e em vários casos pela própria B3, via ETFs locais e BDRs. É o tema do módulo de Luiz Roxo. A consequência prática é o acesso a teses que a bolsa brasileira não oferece. Só a Nvidia, a maior empresa do mundo em valor de mercado, tinha em agosto de 2026 US$ 5,1 trilhões em ações em livre circulação, mais de dez vezes o MSCI Brazil inteiro. Semicondutores, software, inteligência artificial, robótica e exploração espacial são negócios quase ausentes da B3.",
        "Felippe faz questão de separar constatação de recomendação: citar Inter, C6, BTG ou Itaú não é sugerir uma instituição, e sim registrar algo que já aconteceu. A onda de fintechs da última década, que pôs um banco digital brasileiro entre os maiores do mundo em número de clientes, é a mesma infraestrutura que hoje leva o investidor comum ao exterior.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "17:05",
      titulo: "Na bolsa brasileira não há tecnologia; no índice global, ela é quase um terço",
      subtitulo: "Peso de cada setor no índice, em %, 31/ago/2026",
      forma: "barra",
      eixoX: ["Tecnologia da informação", "Financeiro", "Energia", "Materiais", "Utilidades públicas", "Saúde", "Consumo discricionário"],
      series: [
        { nome: "MSCI Brazil", valores: [0, 39.1, 17.3, 14.4, 11.5, 1.0, 2.5], destaque: true },
        { nome: "MSCI ACWI (mundo)", valores: [31.2, 17.0, 4.0, 3.8, 2.3, 8.5, 8.7] },
      ],
      formato: { sufixo: "%", casas: 1 },
      fonte: "MSCI, factsheets MSCI Brazil e MSCI ACWI (USD), 31/ago/2026",
      nota: "Classificação setorial GICS. Setores omitidos: industriais, consumo básico, comunicação e imobiliário.",
    },

    // ---- razão 3: o câmbio --------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "o-cambio-e-o-preco-do-risco",
      titulo: "Razão 3: o câmbio e o preço do risco",
      resumo: "O real se desvalorizou em saltos, e o mesmo risco aparece no preço e na oscilação das ações brasileiras.",
      tempo: "18:55",
    },
    {
      tipo: "texto",
      tempo: "18:55",
      paragrafos: [
        "A terceira razão é o próprio dólar. Nos primeiros anos do Plano Real, a moeda americana valeu perto de um real: a média mensal ficou abaixo de R$ 1 até meados de 1996 e subiu devagar, dentro de uma banda administrada pelo Banco Central, até R$ 1,21 em dezembro de 1998. Em janeiro de 1999 o regime caiu. O Banco Central alterou a banda em 13 de janeiro, o câmbio passou a flutuar dias depois, e em fevereiro a média mensal do dólar já estava em R$ 1,91, 59% acima de dezembro. A aula descreve o episódio como uma desvalorização esperada que o mercado antecipou; para quem tinha tudo em reais, o efeito foi um corte abrupto do patrimônio medido em dólar.",
        "É esse o risco político e cambial de que fala Felippe. Ele tem histórico e pode ser medido, por exemplo, observando como o dólar se comporta em anos de eleição, como 2002, quando a média mensal passou de R$ 3,80 em outubro. Não há como evitá-lo. O que se escolhe é quanto do patrimônio fica exposto a ele.",
        "O mesmo risco aparece no preço das empresas. No fim de agosto de 2026, o MSCI Brazil era negociado a 9,3 vezes o lucro dos últimos doze meses, contra 15,2 vezes do MSCI Emerging Markets e 21,9 vezes do índice global. A aula cita 9,6 e 18,6 vezes, números de outra data; a distância é da mesma natureza. Parte dela vem da expectativa de crescimento menor e parte é prêmio de risco: o investidor estrangeiro não deixa de comprar Brasil por causa de uma eleição turbulenta, mas cobra o risco no preço do papel.",
        "A volatilidade completa o quadro. Nos dez anos até agosto de 2026, o desvio-padrão anualizado dos retornos mensais em dólar foi de 30,8% no MSCI Brazil e de 17,5% no MSCI Emerging Markets, quase o dobro, como diz a aula. Parte da diferença vem de decisões concentradas: uma reunião em Brasília sobre preço de combustíveis mexe com uma das maiores empresas do índice, e um parecer do Cade decide o destino de uma fusão. Diversificar entre países é trocar a exposição a um único conjunto de regras pela exposição a muitos.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "19:04",
      titulo: "O real perdeu valor em saltos, não em linha reta",
      subtitulo: "Dólar comercial, R$ por US$, média anual das médias mensais de venda",
      forma: "linha",
      eixoX: [
        "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004",
        "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015",
        "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026",
      ],
      series: [
        {
          nome: "Dólar",
          valores: [
            0.87, 0.92, 1.01, 1.08, 1.16, 1.81, 1.83, 2.35, 2.92, 3.08, 2.93, 2.44, 2.18, 1.95, 1.83, 2.0, 1.76,
            1.67, 1.95, 2.16, 2.35, 3.33, 3.49, 3.19, 3.65, 3.95, 5.16, 5.4, 5.16, 4.99, 5.39, 5.59, 5.15,
          ],
          destaque: true,
        },
      ],
      formato: "brl",
      marcos: [
        { em: "1999", rotulo: "Fim da banda cambial" },
        { em: "2002", rotulo: "Eleição" },
        { em: "2008", rotulo: "Crise global" },
        { em: "2015", rotulo: "Recessão" },
        { em: "2020", rotulo: "Pandemia" },
      ],
      fonte: "Banco Central do Brasil, SGS 3698 (dólar comercial, venda, média mensal)",
      nota: "1994: julho a dezembro. 2026: janeiro a agosto.",
    },
    {
      tipo: "comparativo",
      tempo: "20:29",
      titulo: "A bolsa brasileira é mais barata e mais instável que a de seus pares",
      subtitulo: "Indicadores dos índices MSCI em dólar, 31/ago/2026",
      opcoes: [
        { nome: "MSCI Brazil", resumo: "46 empresas", destaque: true },
        { nome: "MSCI Emerging Markets", resumo: "1.178 empresas" },
        { nome: "MSCI ACWI", resumo: "2.458 empresas" },
      ],
      metricas: [
        { rotulo: "Preço/lucro, 12 meses", valores: [9.33, 15.23, 21.85], formato: "multiplo" },
        { rotulo: "Preço/lucro projetado", valores: [8.34, 10.07, 16.87], formato: "multiplo" },
        { rotulo: "Dividend yield", valores: [5.46, 2.01, 1.56], formato: "pct" },
        { rotulo: "Volatilidade anual, 10 anos", valores: [30.77, 17.45, 14.71], formato: "pct", melhor: "menor" },
        { rotulo: "Maior queda desde 1987", valores: [-75.79, -65.14, -58.06], formato: "pct", melhor: "maior" },
      ],
      fonte: "MSCI, factsheets MSCI Brazil, MSCI Emerging Markets e MSCI ACWI (USD), 31/ago/2026",
      nota:
        "Volatilidade: desvio-padrão anualizado de retornos mensais em dólar. Maior queda: perda máxima do pico ao fundo, pela tabela do factsheet do MSCI Brazil (série desde dez/1987).",
    },
    {
      tipo: "simulador",
      id: "patrimonio-medido-em-dolar",
      tempo: "19:49",
      titulo: "O seu patrimônio medido em dólar",
      descricao:
        "Um patrimônio em reais, sem rendimento, medido em dólar ao longo do tempo, com uma fatia convertida hoje. Mude a perda anual do real e a fatia em dólar para ver quanto da diferença vem só do câmbio.",
      modelo: "cambioPatrimonio",
      parametros: {
        cambio: { valor: 5.15, ajuda: "Média mensal de agosto de 2026: R$ 5,15 (BCB, SGS 3698)." },
        depreciacao: {
          valor: 4,
          ajuda:
            "De julho de 1994 a agosto de 2026, o real perdeu em média cerca de 5,5% ao ano contra o dólar, com anos de alta e de queda. O passado não define o futuro.",
        },
        fatia: { valor: 30 },
      },
    },
    {
      tipo: "conceito",
      tempo: "22:12",
      termo: "Holdup e risco de regra",
      definicao:
        "Depois que o capital está investido e não pode sair sem custo, quem fixa impostos, tarifas, preços ou regras passa a ter incentivo para capturar parte do retorno, porque a decisão já não altera o investimento feito. Antecipando isso, o investidor exige retorno maior ou investe menos. Na formulação de Acemoglu, a ineficiência persiste quando quem governa não consegue se comprometer de forma crível a não mudar a regra depois.",
      naPratica:
        "Trocar uma ação brasileira por outra diversifica o risco da empresa, não o da regra: uma intervenção em preços, uma mudança tributária ou uma decisão regulatória atinge ao mesmo tempo ações, títulos, câmbio e imóveis do mesmo país. Só outra jurisdição dilui esse fator. O exterior não elimina o risco político; troca um risco concentrado por vários riscos diferentes.",
      referencia: {
        autor: "Daron Acemoglu",
        obra: "Political Economy Lecture Notes",
        capitulo: "caps. 1 e 11, problema de compromisso e holdup",
      },
    },

    // ---- razão 4: o fiscal --------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "o-risco-brasil-tem-endereco",
      titulo: "Razão 4: o risco Brasil tem endereço fiscal",
      resumo: "Carga alta, dívida alta e juro alto contam a mesma história: o prêmio que o país paga para se financiar.",
      tempo: "23:49",
    },
    {
      tipo: "texto",
      tempo: "23:49",
      paragrafos: [
        "A quarta razão explica de onde vêm o desconto das ações e o juro alto: o orçamento público. A carga tributária bruta do governo geral chegou a 32,4% do PIB em 2025, a maior da série do Tesouro Nacional iniciada em 2010. A aula fala em cerca de 34% para o Brasil e 25% na média dos emergentes; o ponto é que o país arrecada como economia rica com renda de economia emergente, porque gasta em áreas, a seguridade social à frente, que pares de renda parecida não financiam na mesma escala.",
        "Mesmo arrecadando muito, o Estado gasta mais do que arrecada, e a diferença vira dívida. Pela metodologia do FMI, que inclui todos os títulos na carteira do Banco Central, a dívida bruta do governo geral deve chegar a 96,5% do PIB em 2026, o número citado na aula; pela metodologia do Banco Central, estava em 82,9% em agosto. Japão e Estados Unidos devem mais, cerca de 204% e 126% do PIB, e pagam juros muito menores. Em setembro de 2026, a Selic estava em 13,75% ao ano e o juro básico americano, na faixa de 3,75% a 4% (a aula usa 14,25% e 3%, números do momento da gravação). A 13,75% ao ano, um capital dobra em pouco mais de cinco anos; a 4%, leva quase 18.",
        "Por que o país que deve menos paga mais? A aula aponta três motivos. O histórico: Reinhart e Rogoff contam nove episódios de calote ou reestruturação da dívida externa brasileira entre 1828 e 1983. A poupança doméstica que financia essa dívida, pequena em relação ao PIB quando comparada à de Japão e Estados Unidos. E a baixa integração financeira: um governo europeu em dificuldade recorre a um mercado amplo de investidores globais, enquanto o brasileiro depende muito mais da poupança interna e de capital externo volátil. Juro alto, portanto, não é generosidade com o poupador. É o preço que se exige para carregar o risco do país, e por isso uma aplicação 100% em reais não é um porto neutro: ela é o próprio risco Brasil, remunerado.",
        "Dois sinais fecham a razão. O primeiro é o atraso no acesso a novas teses: o primeiro ETF de ouro do mundo, o Gold Bullion Securities, estreou na bolsa australiana em março de 2003; na B3, o primeiro ETF de ouro, o GOLD11, chegou em dezembro de 2020, e o primeiro lastreado em barras físicas, em 2025. A aula fala em 2002 e 2023, mas a distância de quase duas décadas se mantém. O segundo é o crescimento: pelas projeções do FMI de abril de 2026, o Brasil deve crescer 1,9% neste ano, contra 3,9% do conjunto de emergentes e economias em desenvolvimento, os mesmos números da aula. Barro e Sala-i-Martin lembram que diferenças pequenas de crescimento, compostas por décadas, pesam mais do que qualquer ciclo, e por isso diversificar não é só ir aos Estados Unidos, mas também a México, Indonésia, Coreia do Sul e outros emergentes.",
      ],
    },
    {
      tipo: "kpis",
      tempo: "24:45",
      titulo: "O retrato fiscal em quatro números",
      itens: [
        { rotulo: "Carga tributária bruta", valor: 32.4, formato: { sufixo: "% do PIB", casas: 1 }, nota: "governo geral, 2025" },
        {
          rotulo: "Dívida bruta, critério do FMI",
          valor: 96.5,
          formato: { sufixo: "% do PIB", casas: 1 },
          destaque: true,
          nota: "projeção 2026; 82,9% pelo critério do BCB, ago/2026",
        },
        { rotulo: "Selic", valor: 13.75, formato: { sufixo: "% a.a.", casas: 2 }, nota: "meta, set/2026" },
        { rotulo: "Juro básico nos EUA", valor: 4, formato: { sufixo: "% a.a.", casas: 2 }, nota: "teto da faixa de 3,75% a 4%, set/2026" },
      ],
      fonte:
        "Tesouro Nacional, estimativa da carga tributária bruta 2025; FMI, World Economic Outlook, abr/2026; Banco Central do Brasil, SGS 13762 e 432; Federal Reserve, decisão do FOMC de 16/set/2026",
    },
    {
      tipo: "grafico",
      tempo: "27:05",
      titulo: "O Brasil deve menos que Japão e EUA, mas paga juro muito mais alto",
      subtitulo: "Dívida bruta do governo geral, % do PIB, projeção para 2026",
      forma: "barra",
      eixoX: ["Japão", "EUA", "China", "Brasil", "Índia", "México", "Indonésia"],
      series: [{ nome: "Dívida bruta", valores: [204.4, 125.8, 106.9, 96.5, 83.4, 62.7, 41.5] }],
      formato: { sufixo: "% do PIB", casas: 1 },
      fonte: "FMI, World Economic Outlook, abr/2026 (GGXWDG_NGDP)",
      nota: "Critério do FMI. Para o Brasil, inclui os títulos públicos na carteira do Banco Central, por isso fica acima da série do BCB.",
    },
    {
      tipo: "conceito",
      tempo: "26:22",
      termo: "Superávit primário que estabiliza a dívida",
      definicao:
        "A dívida pública como proporção do PIB cresce sozinha quando o juro real que o governo paga (r) supera o crescimento real da economia (g). Para mantê-la estável, é preciso um superávit primário, receitas menos despesas sem contar juros, proporcional ao tamanho da dívida (b) e à distância entre r e g. Se o mercado duvida de que esses superávits virão, cobra um prêmio maior, e r sobe.",
      formula: "s* = (r − g)/(1 + g) × b",
      naPratica:
        "Com dívida de 96% do PIB, cada ponto de diferença entre juro real e crescimento exige perto de 1% do PIB de superávit só para a dívida não subir. Por isso juro alto e dívida alta se alimentam, e por isso o juro de uma aplicação em reais carrega o risco fiscal do país.",
      referencia: {
        autor: "F. Rocha, em Arvate e Biderman (orgs.)",
        obra: "Economia do Setor Público no Brasil",
        capitulo: "cap. 24, déficit público e sustentabilidade fiscal",
        ano: 2004,
      },
    },

    // ---- razão 5: demografia ------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "a-demografia-nao-negocia",
      titulo: "Razão 5: a demografia não negocia",
      resumo: "A população brasileira para de crescer em 2041, e o Estado foi desenhado para outra pirâmide etária.",
      tempo: "31:28",
    },
    {
      tipo: "texto",
      tempo: "31:28",
      paragrafos: [
        "A quinta razão junta as anteriores, crescimento baixo, dívida alta, juro alto e regulação pesada, a uma variável que nenhum governo controla no curto prazo: a demografia. Para uma população se manter estável sem imigração, cada mulher precisa ter em média cerca de 2,1 filhos, a chamada taxa de reposição. O Brasil passou abaixo dela na primeira metade dos anos 2000. Pelas projeções do IBGE de 2024, a fecundidade caiu de 2,32 filhos por mulher em 2000 para 1,57 em 2023 e deve chegar a 1,44 por volta de 2041.",
        "As consequências são aritméticas. A população deve parar de crescer em 2041, com 220,4 milhões de habitantes, e cair para 199,2 milhões em 2070. A parcela de pessoas com 60 anos ou mais, que era de 8,7% em 2000 e de 15,6% em 2023, deve chegar a 37,8% em 2070. Menos gente entra no mercado de trabalho, mais gente se aposenta e vive mais tempo aposentada. Num sistema em que os ativos de hoje pagam os benefícios de hoje, isso pressiona o orçamento por décadas, e a reforma da Previdência de 2019 dificilmente terá sido a última, como diz a aula.",
        "O ajuste tem poucos caminhos. A carga tributária já é alta para o padrão emergente, e cada real a mais de imposto sai do investimento ou do consumo de famílias e empresas; imprimir moeda não cria riqueza, só transfere a perda para quem guarda reais. Felippe é direto ao dizer que a aposentadoria pública tende a valer menos do que o trabalhador espera e que a resposta individual é construir a própria estratégia de proteção. A aula reconhece o outro lado: uma população mais velha tende a ser mais escolarizada, mais rica por pessoa e com menos problemas urbanos. Para o investidor, porém, o dado que pesa é que haverá menos trabalhadores para sustentar um Estado com gastos sociais já contratados.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "31:56",
      titulo: "O Brasil já está abaixo da taxa de reposição e deve continuar abaixo",
      subtitulo: "Taxa de fecundidade total, filhos por mulher; de 2030 em diante, projeção",
      forma: "linha",
      eixoX: ["2000", "2010", "2023", "2030", "2041", "2050", "2060", "2070"],
      series: [{ nome: "Brasil", valores: [2.32, 1.75, 1.57, 1.47, 1.44, 1.45, 1.47, 1.5], destaque: true }],
      formato: { casas: 2 },
      referencia: { valor: 2.1, rotulo: "Taxa de reposição" },
      marcos: [{ em: "2041", rotulo: "População para de crescer" }],
      fonte: "IBGE, Projeções da População, revisão 2024",
      nota: "O eixo traz os anos divulgados pelo IBGE, com intervalos desiguais.",
    },
    {
      tipo: "conceito",
      tempo: "33:09",
      termo: "Regime de repartição",
      definicao:
        "No regime de repartição, as contribuições de quem trabalha hoje pagam os benefícios de quem está aposentado hoje. O retorno implícito do sistema depende do crescimento dos salários (w) e do número de contribuintes (n), pela fórmula de Samuelson e Aaron. Quando a população em idade ativa para de crescer, n vai a zero ou fica negativo, e o sistema só fecha com mais contribuição, menos benefício ou mais dívida.",
      formula: "1 + r = (1 + w)(1 + n)",
      naPratica:
        "Quem contribui para o INSS já tem uma parte grande da aposentadoria atrelada à demografia e aos salários brasileiros, em reais. A poupança própria é o espaço em que essa exposição pode ser diversificada, inclusive entre moedas e países.",
      referencia: {
        autor: "L. E. Afonso, em Arvate e Biderman (orgs.)",
        obra: "Economia do Setor Público no Brasil",
        capitulo: "cap. 20, seguridade social",
        ano: 2004,
      },
    },
    {
      tipo: "fluxo",
      tempo: "33:28",
      titulo: "Da demografia ao patrimônio",
      nos: [
        { titulo: "Fecundidade", texto: "1,57 filho por mulher em 2023, abaixo da reposição.", sentido: "desce" },
        { titulo: "Força de trabalho", texto: "A população para de crescer em 2041.", sentido: "desce" },
        { titulo: "Gasto previdenciário", texto: "Mais aposentados, por mais tempo.", sentido: "sobe" },
        { titulo: "Imposto, dívida ou inflação", texto: "Alguém paga a conta do ajuste.", sentido: "sobe" },
        { titulo: "Prêmio de risco", texto: "Juro e câmbio cobram mais de quem está só em reais.", sentido: "sobe" },
      ],
      ligacoes: ["reduz", "pressiona", "exige", "eleva"],
      fonte: "Síntese da aula, com dados do IBGE (Projeções da População, revisão 2024)",
    },

    // ---- fechamento ----------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "facil-nao-e-simples",
      titulo: "Mais fácil não quer dizer mais simples",
      resumo: "O acesso ao exterior virou um clique; entender veículo, custo e imposto continua sendo trabalho.",
      tempo: "35:56",
    },
    {
      tipo: "texto",
      tempo: "36:09",
      paragrafos: [
        "A aula termina com um alerta que soa contraintuitivo num curso sobre investir lá fora. Quando abrir conta no exterior exigia papelada e valores altos, a própria barreira funcionava como filtro: só passava por ela quem tinha estudado o tema. Agora que basta um aplicativo, o filtro sumiu, e é fácil comprar um ativo sem saber se ele é uma ação, um ETF, um BDR ou um fundo, quanto custa mantê-lo e como ele é tributado.",
        "Felippe resume o que observar: taxas de administração e de câmbio, o veículo usado, o apelo emocional de uma cotação na tela e, sobretudo, a tributação. Desde a Lei 14.754, de 2023, os rendimentos de aplicações financeiras no exterior de pessoas físicas residentes no Brasil são tributados a 15%, em apuração anual, e o ganho é calculado em reais. A consequência é pouco intuitiva: o imposto alcança também a variação do câmbio. Um ativo vendido pelo mesmo preço em dólar pode gerar imposto se o dólar subiu contra o real no período, e o investidor paga sobre um ganho que, medido em dólar, não existiu. As regras detalhadas, com exceções e compensação de perdas, são tema dos próximos módulos e devem ser conferidas na legislação vigente.",
        "Não há fórmula para ganhar 2% ou 10% ao mês, insiste a aula, e não há atalho; há formas corretas de fazer. O curso foi montado com professores escolhidos pela experiência no mercado, e não pela presença em redes sociais, para percorrer cada uma delas: o diagnóstico, a renda fixa e as ações americanas, os veículos de acesso e os ativos digitais.",
      ],
    },
    {
      tipo: "comparativo",
      tempo: "38:15",
      titulo: "O imposto é calculado em reais, e o câmbio entra na conta",
      subtitulo: "US$ 10 mil comprados com o dólar a R$ 5,00 e vendidos um ano depois pelo mesmo preço em dólar",
      opcoes: [
        { nome: "Dólar sobe para R$ 5,50", resumo: "o real se desvaloriza 10%", destaque: true },
        { nome: "Dólar cai para R$ 4,50", resumo: "o real se valoriza 10%" },
      ],
      metricas: [
        { rotulo: "Ganho medido em dólar", valores: [0, 0], formato: { base: "usd", casas: 0 } },
        { rotulo: "Valor da venda em reais", valores: [55000, 45000], formato: { base: "brl", casas: 0 } },
        { rotulo: "Resultado em reais", valores: [5000, -5000], formato: { base: "brl", casas: 0, sinal: true } },
        { rotulo: "Imposto de renda a 15%", valores: [750, 0], formato: { base: "brl", casas: 0 } },
      ],
      ilustrativo: true,
      fonte: "regra geral da Lei 14.754/2023",
      nota: "Conta simplificada: ignora custos, IOF, compensação de perdas e as exceções previstas na lei.",
    },
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Paulo Roberto Arvate e Ciro Biderman (orgs.)",
          titulo: "Economia do Setor Público no Brasil",
          ano: 2004,
          nota: "Cap. 20, seguridade social, e cap. 24, sustentabilidade da dívida pública.",
        },
        {
          autor: "Marianne Baxter e Urban J. Jermann",
          titulo: "The International Diversification Puzzle Is Worse Than You Think",
          ano: 1997,
          nota: "American Economic Review. Por que a renda do trabalho reforça o argumento para diversificar fora do país.",
        },
        {
          autor: "Carmen M. Reinhart e Kenneth S. Rogoff",
          titulo: "This Time Is Different: Eight Centuries of Financial Folly",
          ano: 2009,
          nota: "A cronologia de calotes e reestruturações soberanas, Brasil incluído.",
        },
        {
          autor: "Robert J. Barro e Xavier Sala-i-Martin",
          titulo: "Economic Growth",
          ano: 2004,
          nota: "Introdução e cap. 12: por que o crescimento difere tanto entre países.",
        },
      ],
    },
  ],
};

export default secao;

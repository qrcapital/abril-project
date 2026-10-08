import type { SecaoDaAula } from "@/lib/notebook";

// Módulo I, aula 1 ("Cinco razões para olhar para fora"), com Marcelo Campos e Felippe Hermes. Até
// 05/out/2026 era a "AULA 0" do Módulo 0 de boas-vindas; o arquivo mora em `modulo-0/` porque o
// diretório segue o `ord` do módulo, que continua 0.
// Segue a ordem da aula (transcrição em `transcricoes/modulo-0/aula-1.txt`): a abertura, os mitos
// sobre dolarização e as cinco razões de Felippe, e o fechamento sobre estudo e tributação.
//
// NÚMEROS CONFERIDOS EM 01/OUT/2026 nas fontes primárias citadas em cada bloco. Onde a aula cita um
// número diferente do da fonte (peso no PIB mundial, inflação de 1979 a 1994, inflação americana, P/L,
// carga tributária, juros, ano do ETF de ouro), o texto apresenta uma faixa e a razão da diferença
// (fonte, data, recorte), sem desmentir a fala. O peso do Brasil no PIB mundial segue a mesma faixa da
// aula 3 (1,6% a 2%, conforme a fonte e o câmbio do ano).
//
// TOM REESCRITO EM 07/OUT/2026 pelo guia `docs/TOM-DO-NOTEBOOK.md`: conversa em segunda pessoa,
// exemplo antes do conceito, fórmulas traduzidas em palavras e citações acadêmicas só no fim.
// VOZ INSTITUCIONAL EM 08/OUT/2026: sem narrar a aula ("Felippe disse", "na aula"); cada inserção
// técnica abre dizendo por que importa para o ponto da aula.

const secao: SecaoDaAula = {
  aula: 1,
  blocos: [
    // ---- abertura ----------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "a-vida-ja-e-global",
      titulo: "A sua vida já é global. O seu dinheiro, não",
      resumo: "Deixar tudo numa moeda só é uma aposta, e investir lá fora deixou de ser coisa de poucos.",
      tempo: "0:19",
    },
    {
      tipo: "texto",
      capitular: true,
      paragrafos: [
        "Olhe em volta. O celular, o sistema operacional, a série de ontem, o tênis: quase tudo o que você usa tem dono ou preço formado fora do Brasil. O seu patrimônio, porém, provavelmente está inteiro aqui, em reais, em empresas e títulos de um país só. Parece neutro, mas não é. Deixar 100% numa moeda e numa economia é uma aposta, e quase ninguém faz essa aposta de propósito.",
        "O que mudou foi a porta de entrada. Até pouco tempo atrás, investir lá fora pedia private banking, papelada na agência e um valor mínimo alto. O novo marco cambial, a Lei 14.286, que passou a valer no fim de 2022, simplificou o câmbio e abriu espaço para as contas globais de bancos e fintechs. Hoje você abre uma conta internacional pelo celular. A barreira deixou de ser burocrática e passou a ser de método.",
        "Antes de qualquer argumento a favor, um alerta: dolarizar também tem risco. Se você vive e gasta em reais e compra um ativo em dólar, passa a carregar dois riscos de uma vez, o do ativo e o da moeda. Imagine uma ação americana que sobe 8% num ano. Se o dólar subir 10% no mesmo período, você ganha perto de 19% em reais. Se o dólar cair 10%, termina com cerca de 3% de prejuízo, mesmo com a ação no azul. É o chamado risco duplo, e ele corta para os dois lados.",
        "O curso tem quatro módulos, do porquê à prática: macro e estratégia global com Felippe Hermes e Rodolfo Bastos, renda fixa e ações americanas com Tony Volpon, acesso ao mercado americano com Luiz Roxo e ativos digitais com Alexandre Ywata. A primeira aula, com Felippe Hermes, fundador da BlockTrends e do Spotniks, organiza o argumento em cinco razões, apresentadas a seguir na mesma ordem.",
      ],
    },
    {
      tipo: "destaque",
      texto: "E isso não é uma escolha. É uma aposta. Uma aposta numa única moeda, numa única economia.",
      fonte: "Abertura da aula, 0:49",
    },
    {
      tipo: "conceito",
      tempo: "2:00",
      termo: "Retorno em reais de um ativo em dólar",
      definicao:
        "Quando você compra algo lá fora, na verdade compra duas coisas: o ativo e a moeda em que ele é cotado. O seu resultado em reais junta os dois movimentos, e não é uma simples soma, porque um ganho rende em cima do outro. Se o ativo sobe 10% e o dólar também sobe 10%, você não ganha 20%, ganha 21%: a alta do dólar incide sobre um valor que já tinha crescido. Em movimentos pequenos a soma quase acerta; nos grandes, a diferença aparece.",
      naPratica:
        "É por isso que o mesmo investimento pode dar lucro em dólar e prejuízo em reais, ou o contrário. Daí saem duas consequências. Ação de exportadora brasileira não faz o mesmo papel, porque o preço dela segue a bolsa daqui, mesmo com receita em dólar. E quem neutraliza todo o câmbio com uma operação de proteção (o chamado hedge) joga fora boa parte do benefício: o mesmo câmbio que cria o risco duplo é, para quem ganha e gasta só em reais, perto de metade da proteção que o exterior oferece.",
      referencia: {
        autor: "Zvi Bodie, Alex Kane e Alan J. Marcus",
        obra: "Investments",
        capitulo: "cap. 25",
        ano: 2014,
      },
    },
    {
      tipo: "tabela",
      titulo: "Ativo e moeda se multiplicam: o que você ganha em reais",
      colunas: ["Retorno do ativo em dólar", "Dólar cai 10%", "Dólar estável", "Dólar sobe 10%"],
      linhas: [
        ["−10%", "−19%", "−10%", "−1%"],
        ["0%", "−10%", "0%", "+10%"],
        ["+10%", "−1%", "+10%", "+21%"],
      ],
      nota:
        "Ilustrativo, sem impostos, IOF e custos. Repare nos cantos: ativo e dólar subindo 10% cada dão 21%, e não 20%; ativo subindo 10% com o dólar caindo 10% dão 1% de perda, e não zero.",
    },

    // ---- razão 1: escala --------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "dois-por-cento-do-mundo",
      titulo: "Razão 1: o Brasil é cerca de 2% do mundo",
      resumo: "Dolarizar não é guardar nota de dólar. É participar de uma economia cinquenta vezes maior que a brasileira.",
      tempo: "3:49",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Antes das razões, vale desfazer um mito. Dolarizar não é comprar dólar e guardar no colchão, e também não é torcer contra o governo da vez. É ter parte do patrimônio em ações, imóveis e outros ativos que geram renda fora do país. E fora não quer dizer só Estados Unidos. Carne, soja, minério e boa parte dos serviços do mundo são cotados em dólar desde que ele virou a moeda de referência global, nos acordos de Bretton Woods, em 1944. Antes dele, o posto era da libra esterlina. Se um dia o dólar for substituído, o hábito de medir tudo numa moeda central continua.",
        "A primeira razão é de escala. O Brasil produz cerca de 2% da riqueza do mundo. Conforme a fonte e o câmbio do ano, essa fatia anda entre 1,6% e 2%: como a conta é feita em dólar, um real mais fraco encolhe o PIB brasileiro e um real mais forte o aumenta. Com números de 2025, são US$ 2,2 trilhões contra US$ 118 trilhões do planeta, ou 1,9%; pelas projeções do FMI para 2026, com o real mais valorizado, US$ 2,6 trilhões contra US$ 126 trilhões, perto de 2%. O recado não muda: 98% da riqueza é produzida lá fora, e é lá que está a maioria das marcas que você usa.",
        "Para quem investe, a régua que importa é a bolsa, e nela a distância é ainda maior. O MSCI ACWI, índice que reúne as principais ações de 47 países, somava US$ 104 trilhões em agosto de 2026. O Brasil pesa menos de 0,5% nesse índice, que conta só as ações em livre circulação; somando tudo o que está listado na B3, a fatia nas bolsas do mundo fica entre 0,6% e 0,7%, conforme a data. Os Estados Unidos, sozinhos, são quase dois terços do índice. Ou seja: quem investe só na B3 está olhando para menos de 1% do mercado de ações do mundo.",
        "Tem um ponto que costuma passar batido: você já está muito exposto ao Brasil antes de investir o primeiro real. Salário, carreira, aposentadoria do INSS e imóvel dependem da mesma economia, da mesma moeda e das mesmas decisões de Brasília. E quando a economia vai mal, costuma ir mal para o seu emprego e para a bolsa ao mesmo tempo. Dessa lista, a parte financeira é a única que você diversifica com alguns cliques.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "6:50",
      titulo: "O Brasil é 2% do PIB mundial e menos de 0,5% do mercado global de ações",
      subtitulo: "% do total mundial: PIB (projeção 2026) e peso no índice global de ações MSCI ACWI (31/ago/2026)",
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
        "Pesos de China, Índia e Brasil no ACWI estimados a partir do índice de emergentes da MSCI. O índice conta só as ações em livre circulação, o que reduz o peso de mercados fechados a estrangeiros, como a China.",
    },
    {
      tipo: "conceito",
      tempo: "9:00",
      termo: "Capital humano",
      definicao:
        "Pense em quanto você ainda vai ganhar trabalhando até se aposentar, trazido para valores de hoje. Isso tem nome: capital humano. Não aparece no extrato da corretora, mas, para quem está na ativa, costuma ser o maior bem que a pessoa tem. Um exemplo: R$ 120 mil por ano durante 25 anos, trazidos a valor de hoje com juro de 5% ao ano, valem cerca de R$ 1,7 milhão. E esse bem anda junto com a economia do país: quando o Brasil vai mal, salários e empregos sofrem junto com as empresas daqui. Na prática, é uma posição em Brasil que você nem escolheu.",
      naPratica:
        "Um caso extremo mostra o tamanho do problema. Quando o Lehman Brothers quebrou, em 2008, os funcionários tinham cerca de 30% das ações e perderam perto de US$ 10 bilhões: emprego e poupança estavam no mesmo lugar. Em escala de país, é a situação de quem recebe salário em reais, contribui para o INSS, tem imóvel aqui e investe tudo aqui. Diversificar começa pelo patrimônio inteiro, não só pela carteira.",
      referencia: {
        autor: "Zvi Bodie, Alex Kane e Alan J. Marcus",
        obra: "Investments",
        capitulo: "caps. 9, 11 e 28",
        ano: 2014,
      },
    },
    {
      tipo: "tabela",
      titulo: "Mesmo com todos os investimentos fora, a maior parte do seu patrimônio segue atrelada ao Brasil",
      colunas: ["Parcela dos investimentos no exterior", "Investimentos atrelados ao Brasil", "Patrimônio total atrelado ao Brasil"],
      linhas: [
        ["Nenhuma", "100%", "100%"],
        ["Um quarto", "75%", "96%"],
        ["Metade", "50%", "92%"],
        ["Tudo", "0%", "85%"],
      ],
      nota:
        "Ilustrativo, e não sugestão de alocação: renda de R$ 120 mil por ano por 25 anos, trazida a valor de hoje a 5% ao ano, dá cerca de R$ 1,69 milhão de capital humano, somado a R$ 300 mil investidos. A última coluna é a parte desse total que depende do Brasil. Um imóvel no país elevaria todas as linhas.",
    },
    {
      tipo: "texto",
      tempo: "9:48",
      paragrafos: [
        "A outra metade da primeira razão é história. Quem viveu os anos 1980 lembra: o dinheiro não guardava valor de um mês para o outro. Nos quinze anos anteriores ao real, os preços subiram na casa dos trilhões por cento: entre 11 e 13 trilhões, conforme o índice e o mês em que a conta começa e termina. Pelo IPCA, o índice oficial de inflação, do fim de 1979 a junho de 1994, véspera do real, são cerca de 11 trilhões. E a conta começa em 1979 porque foi quando o IPCA nasceu: a inflação dos anos anteriores fica de fora. Nenhum desses números cabe na imaginação.",
        "Nesse ambiente, o brasileiro já usava o dólar para guardar valor, ainda que não para pagar o pão. Os contratos passaram a ser corrigidos por índices como o IGP-M, criado em 1989 e muito influenciado por preços cotados em dólar, que até hoje reajusta aluguéis. E o país trocou de moeda oito vezes entre 1942 e 1994, cinco delas em só oito anos.",
        "O real é o grande sucesso dessa história e, mesmo assim, perdeu valor. Pense em R$ 1 em julho de 1994: para comprar a mesma coisa hoje, você precisa de cerca de R$ 8,30. Contra o dólar, o tombo foi parecido: a moeda americana saiu de R$ 0,93 para R$ 5,15. Desde o lançamento, a inflação acumulada fica na casa de 730% a 760%, e a perda do real contra o dólar, entre 82% e 83%; os números mudam conforme o mês de referência, e até agosto de 2026 são 733% e 82%.",
        "Um detalhe de aritmética evita confundir esses dois números: alta e perda são o mesmo movimento visto de lados opostos. Se o dólar dobra de preço, ele subiu 100%, mas o real perdeu metade do valor, e não 100%. Pelo mesmo motivo, 733% de alta dos preços equivalem a 88% de perda do poder de compra.",
        "E aqui vem o ponto que muda a decisão: o dólar também perde valor. Os preços nos Estados Unidos mais que dobraram desde 1994. A inflação americana acumulada aparece com números bem diferentes conforme o índice e o período escolhidos; pelo índice ao consumidor, de julho de 1994 a agosto de 2026, são 126%. Por qualquer conta, uma nota de dólar guardada desde 1994 compra hoje menos da metade do que comprava. Por isso, dolarizar é ter ativos que geram renda e acompanham a inflação, não dinheiro parado.",
      ],
    },
    {
      tipo: "linhaDoTempo",
      tempo: "11:49",
      titulo: "Oito trocas de moeda entre 1942 e 1994",
      subtitulo: "As moedas do Brasil e os zeros cortados em cada troca",
      eventos: [
        { data: "nov/1942", titulo: "Cruzeiro", texto: "Substitui o réis: mil réis passam a valer um cruzeiro." },
        { data: "fev/1967", titulo: "Cruzeiro novo", texto: "Três zeros a menos." },
        { data: "mai/1970", titulo: "Cruzeiro", texto: "Volta o nome antigo, sem cortar zeros." },
        { data: "fev/1986", titulo: "Cruzado", texto: "Plano Cruzado: três zeros a menos e preços congelados." },
        { data: "jan/1989", titulo: "Cruzado novo", texto: "Plano Verão: mais três zeros." },
        { data: "mar/1990", titulo: "Cruzeiro", texto: "Plano Collor: volta o nome, e as aplicações ficam bloqueadas." },
        { data: "ago/1993", titulo: "Cruzeiro real", texto: "Mais três zeros." },
        { data: "jul/1994", titulo: "Real", texto: "Um real passa a valer 2.750 cruzeiros reais, o valor de uma URV." },
      ],
      fonte: "Banco Central do Brasil, Museu de Valores, histórico das moedas brasileiras",
    },
    {
      tipo: "grafico",
      tempo: "12:31",
      titulo: "Desde o real, os preços subiram oito vezes aqui e pouco mais de duas vezes nos EUA",
      subtitulo: "Quanto cada um subiu desde julho de 1994 (= 100); dezembro de cada ano e agosto de 2026",
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
        "Escala logarítmica: distâncias iguais no eixo são multiplicações iguais. O dólar subiu 5,5 vezes, mais que a diferença entre as duas inflações (3,7 vezes): além da inflação, o real perdeu valor de verdade contra o dólar.",
    },

    // ---- razão 2: a bolsa brasileira ----------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "uma-bolsa-de-bancos-e-commodities",
      titulo: "Razão 2: uma bolsa de bancos e commodities",
      resumo: "A B3 é feita de bancos, energia e mineração. As teses que movem o mundo estão quase todas fora dela.",
      tempo: "13:04",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Faça o exercício contrário ao da abertura. Pense nas empresas brasileiras mais lembradas: Itaú, Petrobras, JBS, Bradesco, Banco do Brasil. Quase todas são bancos ou commodities. O índice da MSCI para o Brasil, com 46 empresas, confirma: financeiro, energia e materiais somam 71% dele, e as dez maiores posições, 61%. Tecnologia simplesmente não aparece.",
        "Agora compare com os vizinhos. O índice de emergentes da MSCI reúne 1.178 ações de 24 países; 46 são brasileiras, e o Brasil pesa só 3,9% dele. Somados os países ricos, chega-se ao índice global, que passa de US$ 100 trilhões. A comparação com o Brasil muda conforme o recorte: é mais de cem vezes tudo o que está listado na B3 e cerca de 214 vezes o índice brasileiro da MSCI, que conta só as maiores empresas e só as ações em livre circulação.",
        "O atalho para esse universo são os ETFs, fundos negociados em bolsa que copiam um índice. Com uma única cota, às vezes de algumas dezenas de dólares, você vira sócio de centenas ou milhares de empresas, em muitos casos pela própria B3, via ETFs locais e BDRs (recibos de ações estrangeiras negociados aqui). É o tema do módulo de Luiz Roxo. E é o caminho para teses que a bolsa brasileira não oferece. Só a Nvidia, a maior empresa do mundo, valia em agosto de 2026 mais de dez vezes o índice brasileiro inteiro. Chips, software, inteligência artificial, robótica e exploração espacial quase não existem na B3.",
        "Uma ressalva, para separar constatação de recomendação: citar Inter, C6, BTG ou Itaú não é indicar banco, é registrar algo que já aconteceu. A onda de fintechs, que pôs um banco digital brasileiro entre os maiores do mundo em clientes, é a mesma que hoje leva o investidor comum para fora.",
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
      nota: "Setores pela classificação da MSCI. Ficaram fora do gráfico: indústria, consumo básico, comunicação e imobiliário.",
    },

    // ---- razão 3: o câmbio --------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "o-cambio-e-o-preco-do-risco",
      titulo: "Razão 3: o câmbio e o preço do risco",
      resumo: "O real perdeu valor aos saltos, e o mesmo risco aparece no preço e no sobe e desce das ações brasileiras.",
      tempo: "18:55",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A terceira razão é o próprio dólar. Nos primeiros anos do real, a moeda americana valia perto de R$ 1 e subia devagar, dentro de uma faixa controlada pelo Banco Central. Em janeiro de 1999 essa faixa caiu, o câmbio passou a flutuar e o real perdeu perto de um terço do valor em semanas: em fevereiro, o dólar já valia R$ 1,91, 59% acima de dezembro. O mercado já esperava a desvalorização e só a antecipou. Para quem tinha tudo em reais, o efeito foi um corte brusco do patrimônio medido em dólar.",
        "Esse é o risco político e cambial de quem está 100% numa moeda só. Dá para medir, olhando, por exemplo, como o dólar se comporta em anos de eleição: em 2002, ele passou de R$ 3,80. Não dá para evitar. O que você escolhe é quanto do seu patrimônio fica exposto a ele.",
        "O mesmo risco aparece no preço das empresas. Um jeito simples de ver se uma bolsa está cara é o preço/lucro: quantos anos de lucro você paga ao comprar a ação. O número muda com a data e com a fonte, mas a distância se mantém: a bolsa brasileira costuma valer perto de 9 a 10 vezes o lucro, e os emergentes, algo entre 15 e 19 vezes. No fechamento de agosto de 2026, eram 9,3 vezes aqui, 15,2 vezes nos emergentes e 21,9 vezes no mundo. Parte da diferença é crescimento esperado menor. Parte é risco: o estrangeiro não deixa de comprar Brasil por causa de uma eleição turbulenta, mas cobra o risco no preço.",
        "Falta a montanha-russa. O mercado chama de volatilidade o quanto um preço sobe e desce. Nos últimos dez anos, a bolsa brasileira, medida em dólar, oscilou quase o dobro da média dos emergentes. Parte disso vem de decisões concentradas: uma reunião em Brasília sobre combustíveis mexe com uma das maiores empresas do índice, e um parecer do Cade decide uma fusão. Investir em vários países é trocar um único conjunto de regras por muitos.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "O real perdeu valor em saltos, não em linha reta",
      subtitulo: "Dólar comercial, R$ por US$, média anual",
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
        { rotulo: "Preço/lucro, últimos 12 meses", valores: [9.33, 15.23, 21.85], formato: "multiplo" },
        { rotulo: "Preço/lucro esperado", valores: [8.34, 10.07, 16.87], formato: "multiplo" },
        { rotulo: "Dividendos, % do preço", valores: [5.46, 2.01, 1.56], formato: "pct" },
        { rotulo: "Volatilidade anual, 10 anos", valores: [30.77, 17.45, 14.71], formato: "pct", melhor: "menor" },
        { rotulo: "Maior queda desde 1987", valores: [-75.79, -65.14, -58.06], formato: "pct", melhor: "maior" },
      ],
      fonte: "MSCI, factsheets MSCI Brazil, MSCI Emerging Markets e MSCI ACWI (USD), 31/ago/2026",
      nota:
        "Volatilidade: quanto os retornos mensais em dólar variaram, em ritmo anual. Maior queda: a perda do pico ao fundo, na série desde dez/1987.",
    },
    {
      tipo: "conceito",
      termo: "Preço/lucro entre países",
      definicao:
        "Para entender de onde vem o desconto da bolsa brasileira, vale abrir o número. Quando você paga 10 vezes o lucro por uma empresa, o preço embute três apostas: quanto ela vai distribuir aos acionistas, quanto vai crescer e quanto retorno você exige para correr o risco dela. A lógica é intuitiva. Mais crescimento esperado justifica pagar mais. Mais risco, ou juro mais alto no país, obriga a pagar menos. Entre países, entram ainda diferenças de contabilidade e de setores.",
      naPratica:
        "Um exemplo com números redondos. Uma empresa que distribui metade do lucro, cresce 5% ao ano e de quem se exige 9% de retorno vale cerca de 13 vezes o lucro. Baixe o crescimento para 4% e suba a exigência para 11%, e o mesmo negócio passa a valer perto de 7 vezes. É o desconto brasileiro em miniatura. Mas parte da distância é só de composição: bancos e commodities, que dominam a B3, valem menos vezes o lucro em qualquer país, e tecnologia, quase um terço do índice global, vale mais. Preço/lucro baixo não quer dizer barato. A pergunta é que crescimento e que risco o preço já embute.",
      referencia: {
        autor: "John D. Stowe, Thomas R. Robinson, Jerald E. Pinto e Dennis W. McLeavey",
        obra: "Analysis of Equity Investments: Valuation",
        capitulo: "caps. 2 e 4",
        ano: 2002,
      },
    },
    {
      tipo: "simulador",
      id: "patrimonio-medido-em-dolar",
      tempo: "19:49",
      titulo: "O seu patrimônio medido em dólar",
      descricao:
        "Um patrimônio em reais, sem rendimento, medido em dólar ao longo dos anos, com uma parte convertida hoje. Mexa na perda anual do real e na fatia em dólar para ver quanto da diferença vem só do câmbio.",
      modelo: "cambioPatrimonio",
      parametros: {
        cambio: { valor: 5.15, ajuda: "Média de agosto de 2026, pelo Banco Central: R$ 5,15." },
        depreciacao: {
          valor: 4,
          ajuda:
            "De 1994 para cá, o real perdeu em média cerca de 5,5% ao ano contra o dólar, com anos de alta e de queda. O passado não garante o futuro.",
        },
        fatia: { valor: 30 },
      },
    },
    {
      tipo: "conceito",
      tempo: "22:12",
      termo: "Risco de mudança de regra",
      definicao:
        "A reunião em Brasília que mexe no preço de uma estatal e o parecer do Cade que decide uma fusão são exemplos de um risco que a economia estuda há tempos. Imagine que você construiu uma fábrica. Ela não sai do lugar. A partir daí, quem define impostos, tarifas e preços sabe que pode apertar sem que você vá embora, porque o investimento já está feito. Os economistas chamam isso de holdup. Quem entende o jogo se antecipa: cobra retorno maior para entrar ou investe menos. O problema persiste quando o governo não consegue prometer, de um jeito que convença, que não vai mudar a regra depois.",
      naPratica:
        "Trocar uma ação brasileira por outra reduz o risco da empresa, não o da regra. Uma intervenção em preços, um imposto novo ou uma decisão regulatória atinge ao mesmo tempo ações, títulos, câmbio e imóveis do mesmo país. Só outra jurisdição dilui esse risco. O exterior não elimina o risco político: troca um risco concentrado por vários diferentes.",
      referencia: {
        autor: "Daron Acemoglu",
        obra: "Political Economy Lecture Notes",
        capitulo: "caps. 1 e 11",
      },
    },
    {
      tipo: "tabela",
      titulo: "O que cada escolha dilui, e o que não dilui",
      colunas: ["Risco", "Mais ações brasileiras", "Exportadoras e multinacionais brasileiras", "Ativos no exterior"],
      linhas: [
        ["Da empresa", "Dilui", "Dilui", "Dilui"],
        ["Do setor", "Pouco: a B3 se concentra em bancos e commodities", "Pouco: são poucos setores", "Dilui"],
        ["Da moeda", "Não", "Em parte: a receita é em dólar, mas a ação é cotada em reais e segue a bolsa daqui", "Dilui, e acrescenta o risco do dólar"],
        ["Desconto do risco Brasil no preço", "Não", "Não", "Dilui"],
        ["De regra: impostos, preços, intervenções", "Não", "Não: a empresa segue sob as mesmas leis", "Em parte: você continua pagando imposto no Brasil"],
      ],
      fonte:
        "Síntese do notebook a partir de Bodie, Kane e Marcus, Investments, cap. 25, e Laffont, Regulation and Development, caps. 4 e 7",
      nota:
        "Nenhuma coluna elimina risco: diversificar troca um risco concentrado por vários riscos menores e diferentes. A aplicação a carteiras é leitura do notebook, não dos livros.",
    },

    // ---- razão 4: o fiscal --------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "o-risco-brasil-tem-endereco",
      titulo: "Razão 4: o risco Brasil tem endereço fiscal",
      resumo: "Imposto alto, dívida alta e juro alto contam a mesma história: o preço que o país paga para se financiar.",
      tempo: "23:49",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A quarta razão explica de onde vêm a bolsa barata e o juro alto: as contas do governo. O Brasil arrecada em impostos cerca de um terço de tudo o que produz, contra perto de 25% na média dos emergentes. A cifra exata fica entre 32% e 34% do PIB, conforme a fonte e o que cada uma conta como imposto; pela conta do Tesouro, foram 32,4% em 2025, o maior nível da série. Ou seja: o país cobra imposto como país rico, com renda de emergente, porque gasta, sobretudo com previdência e assistência, numa escala que países de renda parecida não bancam.",
        "Mesmo arrecadando muito, o governo gasta mais do que arrecada, e a diferença vira dívida. Pelo critério do FMI, ela deve chegar a 96,5% do PIB em 2026; pelo do Banco Central, que deixa de fora os títulos em poder do próprio BC, eram 82,9% em agosto. Japão e Estados Unidos devem mais e pagam muito menos juro. Os números mudam a cada reunião dos bancos centrais, mas a distância fica: o juro básico brasileiro está na casa de 14% ao ano (13,75% em setembro de 2026), e o americano, na faixa de 3% a 4%. Veja no tempo para dobrar um capital: com o juro brasileiro, pouco mais de cinco anos; com o americano, de 18 a mais de 20 anos.",
        "Por que o país que deve menos paga mais? São três motivos. O histórico: o Brasil deu calote ou renegociou a dívida externa nove vezes entre 1828 e 1983. A poupança: os brasileiros têm pouco guardado em relação ao tamanho da dívida, bem menos que japoneses e americanos. E o isolamento: um governo europeu em apuros recorre a investidores do mundo todo, enquanto o brasileiro depende da poupança interna e de capital estrangeiro que vai e volta. Juro alto, portanto, não é presente para o poupador. É o preço de carregar o risco do país. Uma aplicação 100% em reais não é um porto neutro: é o próprio risco Brasil, com remuneração.",
        "Dois sinais fecham a razão. O primeiro é o atraso. O ouro serve de reserva de valor há milênios, e mesmo assim a tese levou perto de duas décadas para chegar aqui num formato simples. O primeiro ETF de ouro do mundo estreou na Austrália em 2003. No Brasil, a data muda conforme o critério: o primeiro ETF ligado ao ouro chegou à B3 em 2020, e o primeiro lastreado em barras de verdade, em 2025. O segundo sinal é o crescimento: pelo FMI, o Brasil deve crescer 1,9% em 2026, contra 3,9% dos emergentes. Diferenças pequenas, repetidas por décadas, viram distâncias enormes. Por isso diversificar não é só ir aos Estados Unidos, mas também a México, Indonésia, Coreia do Sul e outros emergentes.",
      ],
    },
    {
      tipo: "kpis",
      tempo: "24:45",
      titulo: "O retrato fiscal em quatro números",
      itens: [
        { rotulo: "Carga tributária", valor: 32.4, formato: { sufixo: "% do PIB", casas: 1 }, nota: "governo geral, 2025" },
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
      subtitulo: "Dívida bruta do governo, % do PIB, projeção para 2026",
      forma: "barra",
      eixoX: ["Japão", "EUA", "China", "Brasil", "Índia", "México", "Indonésia"],
      series: [{ nome: "Dívida bruta", valores: [204.4, 125.8, 106.9, 96.5, 83.4, 62.7, 41.5] }],
      formato: { sufixo: "% do PIB", casas: 1 },
      fonte: "FMI, World Economic Outlook, abr/2026 (GGXWDG_NGDP)",
      nota: "Critério do FMI, que no caso do Brasil inclui os títulos em poder do Banco Central e por isso fica acima da conta do BCB.",
    },
    {
      tipo: "conceito",
      tempo: "26:22",
      termo: "Paridade de juros",
      definicao:
        "Para comparar uma aplicação em reais com uma em dólar, você precisa medir as duas na mesma moeda. A aplicação em dólar, vista daqui, rende o juro americano mais o que o dólar subir no período. As duas empatam quando o dólar sobe exatamente o suficiente para cobrir a diferença de juros. Esse ponto de empate se chama paridade. A conta simples deixa de fora o risco-país: parte do juro mais alto daqui é a desvalorização esperada do real, e parte é o prêmio por emprestar ao Brasil.",
      naPratica:
        "É a resposta a uma pergunta comum: por que não ficar só no CDB? Com a Selic a 13,75% e o juro americano em 4%, o dólar precisaria subir cerca de 9,4% ao ano para a aplicação lá fora empatar com a daqui, antes de impostos e custos. Isso não é ganho garantido de um lado nem perda certa do outro: é o preço do risco. Quem fica 100% em reais aposta, sem dizer, que o real vai perder menos do que isso. E não adianta tentar adivinhar o dólar do ano pela diferença de juros: na vida real, o câmbio se afasta muito dessa conta.",
      referencia: {
        autor: "Alexandre Assaf Neto",
        obra: "Mercado Financeiro",
        capitulo: "cap. 5",
      },
    },
    {
      tipo: "conceito",
      termo: "O superávit que segura a dívida",
      definicao:
        "Dívida alta e juro alto não são dois problemas separados, e esta conta mostra por quê. Pense na dívida pública medida em relação à renda do país. Se o juro que o governo paga for maior que o crescimento da economia, a dívida cresce sozinha, mesmo sem gasto novo. Para segurá-la, o governo precisa fechar o ano no azul antes de pagar os juros, o chamado superávit primário. Quanto maior a dívida e maior a distância entre juro e crescimento, maior esse azul precisa ser.",
      naPratica:
        "Com uma dívida perto de 96% do PIB, cada ponto de diferença entre o juro já descontada a inflação e o crescimento exige cerca de 1% do PIB de superávit só para a dívida não subir. Se o mercado duvida que esse superávit virá, cobra mais juro, e a conta piora. Por isso dívida alta e juro alto se alimentam, e por isso o juro de uma aplicação em reais carrega o risco fiscal do país.",
      referencia: {
        autor: "F. Rocha, em Arvate e Biderman (orgs.)",
        obra: "Economia do Setor Público no Brasil",
        capitulo: "cap. 24",
        ano: 2004,
      },
    },

    {
      tipo: "conceito",
      tempo: "30:33",
      termo: "Convergência condicional",
      definicao:
        "Por que o Brasil cresce metade do que crescem os outros emergentes, se ainda tem tanto espaço para crescer? Há uma ideia popular de que países mais pobres crescem mais rápido, porque têm mais espaço para correr atrás. A teoria do crescimento diz algo mais sutil. Cada país corre em direção ao próprio teto, definido por instituições, educação, contas públicas e estabilidade, e cresce mais rápido quanto mais longe está desse teto, e não dos países ricos. E corre devagar: a distância costuma fechar uns 2% por ano, o que dá perto de 35 anos para percorrer metade do caminho.",
      naPratica:
        "Ser emergente não garante crescer mais. O Brasil caminha para o patamar que as próprias instituições permitem, e os choques daqui, fiscais, políticos ou de preço de commodities, atingem de uma vez todo o patrimônio aplicado aqui. É um argumento de concentração, não de decadência, e não depende de adivinhar que país vai crescer mais. Um cuidado: crescimento alto não garante bolsa boa, porque o preço pode já embutir esse crescimento.",
      referencia: {
        autor: "Robert J. Barro e Xavier Sala-i-Martin",
        obra: "Economic Growth",
        capitulo: "caps. 1 e 12",
        ano: 2004,
      },
    },

    // ---- razão 5: demografia ------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "a-demografia-nao-negocia",
      titulo: "Razão 5: a demografia não negocia",
      resumo: "A população brasileira para de crescer em 2041, e o Estado foi desenhado para outra pirâmide de idades.",
      tempo: "31:28",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A quinta razão junta tudo o que veio antes, crescimento baixo, dívida alta, juro alto e regra instável, a uma variável que nenhum governo muda no curto prazo: a demografia. Para uma população se manter estável sem imigração, cada mulher precisa ter, em média, cerca de 2,1 filhos. O Brasil caiu abaixo disso no começo dos anos 2000 e hoje está em pouco mais de 1,5.",
        "As consequências são aritmética pura. Pelo IBGE, a população para de crescer em 2041 e depois começa a encolher. Em 2070, quase quatro em cada dez brasileiros terão 60 anos ou mais. Menos gente entra no mercado de trabalho, mais gente se aposenta e vive mais tempo aposentada. Num sistema em que quem trabalha hoje paga a aposentadoria de quem parou hoje, isso pressiona o orçamento por décadas. A reforma da Previdência de 2019 dificilmente terá sido a última.",
        "O ajuste tem poucos caminhos. O imposto já é alto para um emergente, e cada real a mais sai do investimento ou do consumo. Imprimir dinheiro não cria riqueza, só passa a conta para quem guarda reais. A consequência é direta: a aposentadoria pública tende a valer menos do que você espera, e a resposta é montar a própria estratégia de proteção. Há também o outro lado: uma população mais velha tende a ser mais escolarizada e mais rica por pessoa. Para o investidor, porém, o que pesa é que haverá menos trabalhadores sustentando um Estado com gastos sociais já contratados.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "31:56",
      titulo: "O Brasil já está abaixo da taxa de reposição e deve continuar abaixo",
      subtitulo: "Filhos por mulher; de 2030 em diante, projeção",
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
      termo: "Previdência por repartição",
      definicao:
        "No INSS, o que você contribui hoje não fica guardado para você: paga quem está aposentado hoje. É o regime de repartição. O rendimento desse sistema vem de duas fontes: quanto os salários crescem e quanto cresce o número de pessoas contribuindo. Se os salários sobem 2% ao ano e os contribuintes aumentam 1%, o sistema rende cerca de 3%. Se os contribuintes passam a diminuir 1% ao ano, cai para perto de 1%.",
      naPratica:
        "Quando a população em idade de trabalhar para de crescer, o sistema só fecha com mais contribuição, menos benefício ou mais dívida. Quem contribui para o INSS já tem boa parte da aposentadoria presa à demografia e aos salários brasileiros, em reais. A sua poupança própria é o lugar onde essa exposição pode ser diversificada, inclusive entre moedas e países.",
      referencia: {
        autor: "L. E. Afonso, em Arvate e Biderman (orgs.)",
        obra: "Economia do Setor Público no Brasil",
        capitulo: "cap. 20",
        ano: 2004,
      },
    },
    {
      tipo: "fluxo",
      titulo: "Da demografia ao seu patrimônio",
      nos: [
        { titulo: "Filhos por mulher", texto: "1,57 em 2023, abaixo da reposição.", sentido: "desce" },
        { titulo: "Gente trabalhando", texto: "A população para de crescer em 2041.", sentido: "desce" },
        { titulo: "Gasto com aposentadoria", texto: "Mais aposentados, por mais tempo.", sentido: "sobe" },
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
      resumo: "Investir lá fora virou um clique. Entender o veículo, o custo e o imposto continua dando trabalho.",
      tempo: "35:56",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Fica um último alerta, que parece estranho num curso sobre investir lá fora. Quando abrir conta no exterior exigia papelada e muito dinheiro, a própria barreira funcionava como filtro: só passava quem tinha estudado. Agora que basta um aplicativo, o filtro sumiu. Fica fácil comprar algo sem saber se é ação, ETF, BDR ou fundo, quanto custa manter e como é tributado.",
        "A lista do que observar é curta: taxas de administração e de câmbio, o veículo usado, a emoção de ver a cotação na tela e, acima de tudo, o imposto. Desde a Lei 14.754, de 2023, o ganho de pessoa física com aplicações no exterior paga 15%, na declaração anual, e é calculado em reais. Daí vem uma surpresa: o imposto pega também a variação do câmbio. Se você vende um ativo pelo mesmo preço em dólar que pagou, mas o dólar subiu, paga imposto sobre um ganho que, em dólar, não existiu. Os detalhes, com exceções e compensação de perdas, ficam para os próximos módulos e devem ser sempre conferidos na regra em vigor.",
        "O outro imposto no caminho é o IOF, e ele mostra por que a regra tributária pede atenção constante: o governo o muda por decreto, com efeito imediato, para frear ou estimular a entrada e a saída de dinheiro. Em 2022, um decreto prometeu zerar o IOF sobre câmbio até 2029. Em 2025, decretos de maio e junho desfizeram a promessa e subiram as alíquotas; o Congresso chegou a derrubar a mudança, e o STF restabeleceu quase tudo em julho. Hoje, mandar dinheiro para investir lá fora em seu próprio nome paga 1,1%; comprar dólar em espécie, gastar no cartão internacional e outras saídas pagam 3,5%. Não é a primeira vez que a regra muda no meio do jogo. Quando o imposto sobre aplicações subiu no fim dos anos 1990, o governo contava com um investidor sem saída. Quem tem acesso ao exterior deixa de ser cativo, mas precisa comparar os retornos depois de todos esses custos.",
        "Não há fórmula para ganhar 2% ou 10% ao mês, e não há atalho. Há formas corretas de fazer. O curso foi montado com professores escolhidos pela experiência de mercado, e não pela fama nas redes, para percorrer cada uma delas: o diagnóstico, a renda fixa e as ações americanas, os veículos de acesso e os ativos digitais.",
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
          nota: "Imposto sobre aplicações e IOF, previdência e o equilíbrio da dívida pública.",
        },
        {
          autor: "Marianne Baxter e Urban J. Jermann",
          titulo: "The International Diversification Puzzle Is Worse Than You Think",
          ano: 1997,
          nota: "Por que a renda do trabalho reforça o argumento para diversificar fora do país.",
        },
        {
          autor: "Carmen M. Reinhart e Kenneth S. Rogoff",
          titulo: "This Time Is Different: Eight Centuries of Financial Folly",
          ano: 2009,
          nota: "A história dos calotes de governos, Brasil incluído.",
        },
        {
          autor: "Robert J. Barro e Xavier Sala-i-Martin",
          titulo: "Economic Growth",
          ano: 2004,
          nota: "Por que o crescimento difere tanto entre países.",
        },
        {
          autor: "Zvi Bodie, Alex Kane e Alan J. Marcus",
          titulo: "Investments",
          ano: 2014,
          nota: "10ª ed. Câmbio e diversificação internacional; a renda do trabalho como parte do patrimônio.",
        },
        {
          autor: "John D. Stowe, Thomas R. Robinson, Jerald E. Pinto e Dennis W. McLeavey",
          titulo: "Analysis of Equity Investments: Valuation",
          ano: 2002,
          nota: "O preço/lucro que os fundamentos justificam e a comparação de múltiplos entre países.",
        },
        {
          autor: "Alexandre Assaf Neto",
          titulo: "Mercado Financeiro",
          ano: 2014,
          nota: "12ª ed. Paridade de juros e risco cambial.",
        },
        {
          autor: "Jean-Jacques Laffont",
          titulo: "Regulation and Development",
          ano: 2005,
          nota: "Regulação em países em desenvolvimento e o risco de o governo mudar a regra depois.",
        },
      ],
    },
  ],
};

export default secao;

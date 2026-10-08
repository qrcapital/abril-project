import type { Verbete } from "@/lib/glossario";

// Verbetes: Câmbio e moeda, Juros e inflação, Renda fixa. Separados por bloco de categorias em 07/out/2026 para a revisão
// paralela (um agente por arquivo). 58 verbetes. Reescritos como artigo (abertura em `texto`, `secoes` com intertítulo)
// em 07/out/2026, conforme docs/GLOSSARIO-ARTIGOS.md.
export const VERBETES_MERCADO: Verbete[] = [
  {
    slug: "cambio",
    termo: "Câmbio",
    categoria: "Câmbio e moeda",
    apelidos: ["taxa de câmbio", "taxas de câmbio", "cotação do dólar", "o câmbio"],
    resumo: "O preço de uma moeda medido em outra. Quando se diz que o dólar está a R$ 5, é o câmbio: quantos reais você entrega por um dólar.",
    texto: [
      "Você vai viajar e precisa de US$ 1.000. Se o dólar está a R$ 5, a conta dá R$ 5.000. Se na semana seguinte ele vai a R$ 5,50, a mesma viagem passa a custar R$ 5.500. Você não mudou de hotel nem de passagem. Mudou o preço da moeda. Esse preço, que muda todo dia, é a taxa de câmbio.",
      "Câmbio é isso: quanto de uma moeda você entrega para ter uma unidade de outra. No Brasil, a cotação é dada em reais por dólar. Por isso, dólar subindo quer dizer real perdendo valor, e dólar caindo, real ganhando.",
      "O preço sai do encontro de quem quer comprar e de quem quer vender moeda: exportadores que trazem dólares para casa, importadores que precisam pagar fornecedores lá fora, turistas, empresas que pagam dívida no exterior e investidores que entram e saem do país. Quando sobra gente querendo dólar, ele sobe. Quando sobra gente querendo real, ele cai.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Não existe um único preço do dólar. Existe o dólar comercial, negociado entre bancos e grandes empresas, que é o número do noticiário. Existe a PTAX, a média que o Banco Central calcula todo dia útil e que serve de referência para contratos e para a Receita. E existe o preço do balcão, o da casa de câmbio, do cartão e do aplicativo, sempre um pouco mais caro para quem compra, porque embute a margem de quem vende.",
          "Por trás desse preço há forças de curto e de longo prazo. No curto prazo, mandam os juros, o humor dos investidores e as notícias: uma eleição apertada, uma crise lá fora, uma decisão do Banco Central. No longo prazo, pesa a inflação: a moeda do país em que os preços sobem mais tende a perder valor contra a do país em que sobem menos. É a ideia da paridade do poder de compra.",
          "Há também a política. O câmbio pode ser fixo, quando o governo prende a moeda a outra, ou flutuante, quando o mercado decide. O Brasil adota o flutuante desde janeiro de 1999, com o Banco Central entrando no mercado quando acha que o movimento ficou desordenado.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Quando o real foi lançado, em julho de 1994, um real valia um dólar, e nos meses seguintes chegou a valer mais: a média de julho foi de R$ 0,93 por dólar, e em outubro o dólar chegou a R$ 0,83. No fim de setembro de 2026, a PTAX estava perto de R$ 5,18. Medido a partir daquele primeiro mês, o real perdeu cerca de 82% do seu valor em dólar em pouco mais de três décadas.",
          "Esse caminho não foi uma linha reta. Houve saltos em 1999, 2002, 2008, 2015 e 2020, e longos períodos de real forte no meio, como entre 2003 e 2011, quando o dólar chegou a ficar abaixo de R$ 1,60. Quem olhava só aqueles anos achava que o dólar era um mau negócio.",
          "No mundo, o mercado de câmbio é o maior de todos: segundo o levantamento trienal do BIS, o banco dos bancos centrais, giravam US$ 9,6 trilhões por dia em abril de 2025, e o dólar estava de um dos lados de 89% das operações.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Primeiro, os percentuais não batem dos dois lados. Se o dólar vai de R$ 4 para R$ 5, ele subiu 25%, mas o real perdeu 20% do valor em dólar. É o mesmo movimento, medido com réguas diferentes.",
          "Segundo, dólar caro e dólar barato são impressões, não fatos. Um dólar a R$ 5 hoje não é comparável a um dólar a R$ 5 em 2020, porque os preços aqui e lá mudaram desde então. E mesmo descontando a inflação dos dois países, o câmbio pode passar anos longe do que a teoria diz, porque reage a notícias que ainda não aconteceram.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Quem mora no Brasil e investe só em reais está, sem perceber, apostando no câmbio: tudo o que tem preço global, de um celular a uma viagem, de um remédio importado a um curso no exterior, fica mais caro quando o real cai. O patrimônio inteiro em reais encolhe medido em dólar.",
          "Quem investe lá fora carrega o câmbio do outro lado: o resultado em reais depende do ativo e da moeda. É por isso que o curso trata câmbio como risco a diversificar, e não como aposta a acertar.",
        ],
      },
    ],
    exemplo: "Hipotético: uma ação americana custa US$ 100. Com o dólar a R$ 5, você paga R$ 500 por ela. Um ano depois, a ação continua em US$ 100, mas o dólar foi a R$ 5,50. Em reais, ela vale R$ 550, 10% a mais, sem que a empresa tenha mudado nada. Com o dólar a R$ 4,50, valeria R$ 450.",
    naPratica: "Todo investimento em dólar tem duas partes: o ativo e o câmbio. O câmbio pode somar ou tirar do seu resultado em reais, e ninguém acerta com regularidade para onde ele vai no ano seguinte. Por isso, em vez de tentar adivinhar o melhor momento, faz mais sentido perguntar em que moeda estão os seus gastos futuros e quanto do seu patrimônio depende de uma moeda só. Dividir as compras no tempo e comparar sempre o custo de conversão com o dólar comercial são dois hábitos que reduzem o peso do câmbio na decisão.",
    relacionados: [
      "dolar-comercial",
      "ptax",
      "desvalorizacao-cambial",
      "risco-cambial",
      "cambio-flutuante",
      "paridade-do-poder-de-compra",
      "spread-cambial",
      "retorno-em-reais",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "18:55" },
      { modulo: 0, aula: 2, tempo: "21:18" },
    ],
  },
  {
    slug: "dolar-comercial",
    termo: "Dólar comercial",
    categoria: "Câmbio e moeda",
    apelidos: ["dólar comercial em reais", "cotação comercial", "mercado interbancário"],
    resumo: "A cotação do dólar no mercado entre bancos, empresas e grandes investidores. É o número que aparece no noticiário e serve de base para as outras cotações.",
    texto: [
      "Quando o jornal diz que o dólar fechou a R$ 5,15, está falando do dólar comercial. É o preço das operações grandes, entre bancos e de bancos com empresas que exportam, importam ou pagam dívidas no exterior. É a cotação de atacado da moeda.",
      "Ninguém na pessoa física paga exatamente esse preço. Entre o comercial e você existe uma margem, o spread, e às vezes tarifas e imposto. Saber onde está o comercial é saber quanto você está pagando a mais.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O comercial nasce do mercado interbancário de câmbio, em que bancos autorizados pelo Banco Central compram e vendem moeda entre si e com clientes grandes. Como os volumes são altos e a concorrência é grande, a diferença entre o preço de compra e o de venda fica pequena, de frações de centavo.",
          "O preço muda a cada negócio, ao longo do dia. Quando a notícia diz que o dólar fechou a tal valor, ela usa o último preço negociado no fim da sessão, que não é a mesma coisa que a PTAX, uma média calculada pelo Banco Central em quatro janelas do dia.",
          "Em geral, essas operações são liquidadas em dois dias úteis: os reais saem de uma conta e os dólares entram em outra lá fora. É o chamado câmbio à vista, ou pronto.",
        ],
      },
      {
        titulo: "As outras cotações",
        paragrafos: [
          "O dólar turismo, o do papel-moeda e do cartão pré-pago, é o comercial acrescido de custos de logística, transporte de notas, seguro e margem. Por isso costuma ficar bem acima. O dólar do cartão de crédito internacional segue regra própria de cada emissor, também com margem embutida.",
          "As contas internacionais digitais e as corretoras que fazem remessa costumam cobrar menos, mas também partem do comercial e adicionam uma margem. O que muda de uma instituição para outra é o tamanho dessa margem e a forma como ela aparece, às vezes como tarifa, às vezes escondida no preço.",
          "Em cima de tudo vem o IOF, o imposto sobre operações de câmbio, cuja alíquota depende do tipo de operação. A regra mudou mais de uma vez nos últimos anos; vale conferir a vigente antes de converter.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "O erro mais frequente é comparar a cotação anunciada por duas instituições sem olhar o custo total. Uma pode mostrar um preço melhor e cobrar tarifa à parte; a outra, preço pior sem tarifa. A comparação certa é o valor efetivo total, que soma tudo.",
          "Outro erro é tomar o comercial do noticiário como o preço que você vai conseguir naquele minuto. Ele muda o dia inteiro, e o fechamento do jornal da noite já é passado quando você abre o aplicativo na manhã seguinte.",
        ],
      },
    ],
    exemplo: "Hipotético: o comercial está a R$ 5,00. Uma conta internacional que cobra 1% de spread converte a R$ 5,05; uma casa de câmbio que vende papel-moeda pode cobrar R$ 5,25 ou mais. Para converter R$ 50 mil, a diferença entre os dois caminhos fica perto de R$ 2 mil, antes do IOF. Os três preços convivem no mesmo dia, e só um deles é o do noticiário.",
    naPratica: "Use o comercial como régua para saber quanto você realmente paga ao converter. A distância entre ele e o preço que te ofereceram é o custo da conversão, antes do IOF. Para quem pretende dolarizar uma parte do patrimônio aos poucos, com aportes ao longo de anos, essa distância se repete a cada operação e vira um custo relevante. Vale anotar o comercial no momento da conversão e comparar com o preço efetivo que apareceu no comprovante.",
    relacionados: ["cambio", "ptax", "spread-cambial", "custo-total", "iof", "remessa", "conta-global"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "12:31" },
    ],
  },
  {
    slug: "ptax",
    termo: "PTAX",
    categoria: "Câmbio e moeda",
    apelidos: [
      "dólar PTAX",
      "taxa PTAX",
      "cotação oficial do Banco Central",
      "cotação oficial diária",
    ],
    resumo: "A taxa de câmbio de referência calculada pelo Banco Central todo dia útil, a partir de consultas aos bancos. É usada em contratos, balanços e declarações.",
    texto: [
      "Imagine que um contrato precisa dizer quanto vale um dólar numa data. Qual cotação usar, se ela muda a cada segundo? Escolher o preço de um banco seria injusto com a outra parte. Para isso existe a PTAX, a taxa de referência calculada pelo Banco Central todo dia útil.",
      "A PTAX é uma média do mercado de um pedaço do dia, apurada com regras públicas. Como todo mundo pode conferir, ela vira a régua oficial de contratos, balanços de empresas, fundos e declarações de imposto.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O Banco Central faz quatro consultas aos bancos que atuam como dealers de câmbio, em janelas de dez minutos que começam às 10h, 11h, 12h e 13h. Em cada janela, os bancos informam as cotações de compra e de venda que praticam.",
          "Das respostas de cada consulta, o Banco Central descarta as mais altas e as mais baixas e tira a média do que sobra. A PTAX do dia é a média das quatro consultas. O resultado sai no começo da tarde, com uma taxa de compra e outra de venda, e fica disponível no site do Banco Central.",
          "O mesmo cálculo vale para outras moedas, como euro, libra e iene, sempre com o dólar como ponte.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "O nome vem do código da transação no sistema de informações do Banco Central, o Sisbacen, que publicava a taxa média do mercado. A metodologia atual, com as quatro janelas de consulta, está em vigor desde 2011.",
          "Antes dela, a PTAX era a média ponderada de todos os negócios do dia no interbancário, o que a deixava mais exposta a operações isoladas. A troca buscou uma referência mais difícil de distorcer com poucos negócios fechados num momento só.",
        ],
      },
      {
        titulo: "Onde ela aparece",
        paragrafos: [
          "A PTAX é usada para liquidar contratos de dólar futuro na B3 no vencimento, para converter balanços de empresas com operações em dólar, para calcular cotas de fundos que investem lá fora e para a declaração de bens no exterior no imposto de renda.",
          "Para referência histórica, é a série mais usada, inclusive nos gráficos deste curso. Ela tem a vantagem de ser uma só por dia e de existir há décadas, o que permite comparações longas.",
          "Como é uma média de um pedaço do dia, a PTAX quase nunca bate com o dólar de fechamento do mercado. Em dias agitados, a diferença pode ser de vários centavos.",
        ],
      },
    ],
    exemplo: "Em janeiro de 1999, quando o câmbio passou a flutuar, a PTAX foi de R$ 1,21 no dia 12 para R$ 1,98 no dia 29. Em 13 pregões, o real perdeu 39% do valor em dólar. Quem tinha contrato atrelado à PTAX viu a conta mudar de tamanho em duas semanas, sem nenhuma renegociação.",
    naPratica: "Ao declarar bens e calcular imposto sobre investimentos no exterior, a regra usa cotações oficiais do Banco Central em datas definidas, e não o dólar que você pagou no aplicativo. Guarde as datas das suas conversões e dos seus comprovantes: elas importam na hora da conta. E, ao avaliar o desempenho da parte dolarizada da carteira, usar a PTAX do início e do fim do período dá uma comparação limpa, sem o ruído do horário em que você olhou a cotação.",
    relacionados: [
      "cambio",
      "dolar-comercial",
      "imposto-de-renda",
      "cambio-flutuante",
      "variacao-cambial-no-imposto",
      "dolar-futuro",
      "declaracao-de-capitais-no-exterior",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "21:18" },
    ],
  },
  {
    slug: "spread-cambial",
    termo: "Spread cambial",
    categoria: "Câmbio e moeda",
    apelidos: [
      "spread de câmbio",
      "dólar turismo",
      "dólar em espécie",
      "VET",
      "valor efetivo total",
    ],
    resumo: "A margem que o banco ou a corretora cobra sobre a cotação de mercado ao converter seu dinheiro. É um custo que quase nunca aparece como tarifa, mas está no preço.",
    texto: [
      "Você vê o dólar comercial a R$ 5,00 e o aplicativo converte a R$ 5,10. Não apareceu tarifa nenhuma na tela, mas você pagou 2% a mais. Essa diferença é o spread cambial, e é assim que boa parte das instituições ganha dinheiro com câmbio.",
      "Spread, em inglês, quer dizer distância. No câmbio, é a distância entre o preço de referência do mercado e o preço que a instituição cobra de você. É um custo real, que quase nunca aparece como tarifa, porque já está embutido no preço.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Quem vende moeda compra no atacado, perto do comercial, e revende no varejo, com margem. Quem compra a sua moeda faz o contrário: paga menos que o comercial. Se você converte reais em dólares e depois desfaz a operação, paga o spread duas vezes, na ida e na volta.",
          "O tamanho do spread varia muito. Contas internacionais digitais costumam cobrar frações de ponto percentual; bancos tradicionais, mais; cartão de crédito internacional e papel-moeda em casa de câmbio, o chamado dólar turismo, costumam cobrar bem mais. Em cima disso vem o IOF, que depende do tipo de operação.",
        ],
      },
      {
        titulo: "O VET, a régua do Banco Central",
        paragrafos: [
          "Para facilitar a comparação, o Banco Central exige que as instituições informem o VET, o valor efetivo total: quantos reais você paga por unidade de moeda estrangeira, somando cotação, tarifas e imposto. É o número que importa.",
          "Duas ofertas podem mostrar cotações diferentes e tarifas diferentes e, no fim, ter o mesmo VET. Ou o contrário: a cotação mais bonita pode esconder uma tarifa fixa que, num valor pequeno, pesa muito. O VET resolve essa conta por você.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Não há um spread oficial ou máximo: cada instituição define o seu. Por isso, os números variam de uma casa para outra e mudam com o tempo. A ordem de grandeza costuma ser de menos de 1% nas plataformas digitais especializadas, de 1% a 3% em bancos tradicionais e mais que isso em papel-moeda, mas a única forma de saber é comparar no dia.",
          "O spread também aumenta em momentos de estresse. Quando o dólar dispara, quem vende moeda se protege alargando a margem, e o custo de converter sobe justamente quando todo mundo quer converter.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Comparar só a tarifa anunciada, sem olhar a cotação usada. Instituições que dizem não cobrar tarifa podem cobrar no preço.",
          "Esquecer a volta. Se o dinheiro vai voltar ao Brasil um dia, o spread da conversão de volta também entra na conta do retorno.",
        ],
      },
    ],
    exemplo: "Hipotético: converter R$ 100 mil com spread de 2% custa R$ 2 mil. Com spread de 0,5%, custa R$ 500. Se você faz aportes de R$ 5 mil por mês durante dez anos, são R$ 600 mil convertidos. A diferença entre os dois spreads chega a R$ 9 mil só na ida, sem contar o IOF e a volta.",
    naPratica: "Antes de escolher onde converter, compare o VET, e não a cotação anunciada. Em investimento de longo prazo, o custo de entrada e de saída pesa tanto quanto a taxa de administração de um fundo, e se repete a cada aporte. Para quem dolariza aos poucos, escolher bem o canal de conversão é uma das decisões de maior retorno garantido: cada ponto de spread economizado é um ponto que fica no seu bolso, sem risco nenhum.",
    relacionados: [
      "dolar-comercial",
      "custo-total",
      "ptax",
      "cambio",
      "iof",
      "remessa",
      "conta-global",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "35:56" },
    ],
  },
  {
    slug: "desvalorizacao-cambial",
    termo: "Desvalorização cambial",
    categoria: "Câmbio e moeda",
    apelidos: [
      "desvalorização",
      "desvalorização do real",
      "depreciação",
      "depreciação cambial",
      "valorização do real",
      "apreciação",
      "o real perdeu valor",
      "real perdeu valor",
      "perda anual do real",
    ],
    resumo: "Quando uma moeda passa a valer menos em relação a outra. Se o dólar sobe de R$ 4 para R$ 5, o real se desvalorizou contra o dólar.",
    texto: [
      "Pense em US$ 1.000 que custavam R$ 4.000 e agora custam R$ 5.000. O dólar subiu 25%. Visto do outro lado, os seus R$ 4.000 passaram a comprar só US$ 800, 20% a menos. É o mesmo movimento, medido de lados opostos, e por isso os percentuais não batem.",
      "Desvalorização cambial é isso: a moeda passar a valer menos em relação a outra. No caso brasileiro, real se desvalorizando quer dizer dólar subindo. O contrário é a valorização, ou apreciação.",
      "Os economistas costumam chamar de desvalorização a decisão do governo de baixar o valor de uma moeda presa a outra, e de depreciação a queda num câmbio que flutua. No dia a dia, as duas palavras se misturam.",
    ],
    secoes: [
      {
        titulo: "Por que uma moeda perde valor",
        paragrafos: [
          "No longo prazo, a principal força é a inflação. Se os preços sobem mais rápido aqui que lá fora, cada real compra menos coisas, e o câmbio tende a acompanhar. É a ideia da paridade do poder de compra.",
          "No curto prazo, pesam o medo e os juros. Uma eleição incerta, uma dúvida sobre as contas públicas ou uma crise global fazem investidores venderem reais para comprar dólares. Um corte forte de juros reduz o atrativo de deixar dinheiro aqui. O resultado aparece no câmbio em minutos.",
          "Há também os termos de troca: quando o preço das commodities que o Brasil exporta cai, entram menos dólares e o real tende a enfraquecer.",
        ],
      },
      {
        titulo: "No Brasil: saltos, não linha reta",
        paragrafos: [
          "O real perdeu valor em saltos. Em 1999, com o fim da banda cambial, o dólar foi de R$ 1,21 a mais de R$ 2 em semanas. Em 2002, na eleição, chegou perto de R$ 4. Em 2008, na crise global, saiu de R$ 1,56 em agosto para mais de R$ 2,40 em dezembro. Em 2015, na recessão, passou de R$ 4. Em 2020, na pandemia, chegou a R$ 5,94.",
          "No meio, houve longos períodos de real forte. Entre 2003 e 2011, o dólar caiu quase sem parar, a ponto de ficar abaixo de R$ 1,60. Quem olhava só esses anos achava que dolarizar era um mau negócio. É esse ritmo irregular que torna o câmbio tão difícil de prever.",
        ],
      },
      {
        titulo: "A conta que confunde",
        paragrafos: [
          "Se o dólar dobra de preço, ele subiu 100%, mas o real perdeu metade do valor, e não 100%. A perda de valor de uma moeda nunca passa de 100%, por mais que a outra suba.",
          "Por isso, ao ler uma notícia, preste atenção em qual moeda é a base. Dólar subiu 25% e real caiu 20% são a mesma frase.",
        ],
      },
      {
        titulo: "Quem ganha e quem perde",
        paragrafos: [
          "A desvalorização ajuda exportadores, que recebem em dólar e pagam custos em reais, e encarece importados, viagens e dívidas em moeda estrangeira. Também costuma pressionar a inflação, porque muitos preços, de combustível a alimento, seguem cotações internacionais.",
          "Para o investidor, ela reduz o valor do patrimônio em reais medido em dólar e aumenta o valor, em reais, de quem tem ativos lá fora.",
        ],
      },
    ],
    exemplo: "Se o dólar dobra de preço, ele subiu 100%, mas o real perdeu metade do valor. Pela mesma lógica, o dólar ter ido de R$ 0,93, a média do primeiro mês do real, para perto de R$ 5,18 no fim de setembro de 2026 significa que o real perdeu cerca de 82% do seu valor em dólar. Em reais, o dólar subiu mais de 450%.",
    naPratica: "A desvalorização do real reduz o seu patrimônio medido em dólar e encarece tudo o que tem preço lá fora. Ter uma parte em outra moeda é o jeito de diluir esse risco sem precisar adivinhar quando o próximo salto vem. E, como os saltos costumam coincidir com crises internas, a parte em dólar tende a ganhar valor justamente quando o resto do patrimônio sofre.",
    relacionados: [
      "cambio",
      "cambio-flutuante",
      "poder-de-compra",
      "risco-cambial",
      "paridade-do-poder-de-compra",
      "crise-de-1999",
      "crise-de-2002",
      "termos-de-troca",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "18:55" },
      { modulo: 0, aula: 2, tempo: "21:18" },
    ],
  },
  {
    slug: "cambio-flutuante",
    termo: "Câmbio flutuante",
    categoria: "Câmbio e moeda",
    apelidos: [
      "flutuante e sujo",
      "câmbio passou a flutuar",
      "câmbio flutua",
      "flutuação suja",
      "intervenção cambial",
      "swap cambial",
      "swaps cambiais",
    ],
    resumo: "Regime em que o preço do dólar é definido pelo mercado, sem um valor fixado pelo governo. No Brasil desde 1999, com o Banco Central intervindo quando acha o movimento exagerado.",
    texto: [
      "Até janeiro de 1999, o Banco Central mantinha o dólar dentro de uma faixa estreita e conhecida. Quando a faixa caiu, o preço passou a ser decidido todo dia pela oferta e pela procura. Isso é câmbio flutuante: o governo não fixa o preço, o mercado decide.",
      "O regime virou um dos três pés do tripé macroeconômico brasileiro, ao lado da meta de inflação e da meta de superávit nas contas públicas. Os três foram montados em 1999, logo depois da crise que derrubou o câmbio controlado.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Nos primeiros anos do Plano Real, o câmbio servia de âncora contra a inflação. O dólar andava dentro de uma banda controlada, e o país pagava juros altíssimos e gastava reservas para mantê-lo ali. Depois das crises da Ásia, em 1997, e da Rússia, em 1998, o dinheiro começou a sair em massa.",
          "Em 13 de janeiro de 1999, o presidente do Banco Central deixou o cargo, e o governo tentou uma banda mais larga. Não durou. Dois dias depois, o câmbio passou a flutuar. O dólar saiu de R$ 1,21 em 12 de janeiro e chegou a R$ 2,16 no começo de março. A inflação subiu, mas não voltou ao descontrole, porque logo veio a meta de inflação.",
        ],
      },
      {
        titulo: "Flutuante e sujo",
        paragrafos: [
          "Na aula, Felippe usa a expressão flutuante e sujo. Quer dizer que o Banco Central não fixa o preço, mas entra no mercado quando o movimento parece desordenado. Ele pode vender dólares das reservas, fazer leilões de linha, em que empresta dólares com compromisso de recompra, ou oferecer swaps cambiais, contratos que pagam a variação do dólar e funcionam como proteção para quem precisa dela, sem gastar reservas na hora.",
          "O objetivo declarado não é defender um nível de câmbio, e sim reduzir solavancos. Na prática, o mercado testa os limites o tempo todo, e o Banco Central escolhe quando entrar.",
        ],
      },
      {
        titulo: "Vantagens e custos",
        paragrafos: [
          "A vantagem é que o câmbio absorve os choques. Em vez de o país gastar reservas para defender um preço até elas acabarem, o dólar sobe, encarece importações, barateia exportações e ajuda a reequilibrar as contas externas. É uma válvula de escape.",
          "Com o regime, o Brasil passou a acumular reservas em vez de queimá-las. Hoje elas giram em torno de algumas centenas de bilhões de dólares, o que dá ao Banco Central munição para intervir sem precisar defender uma promessa.",
          "O custo, para quem tem tudo em reais, é a volatilidade. Qualquer notícia que mude a percepção de risco sobre o Brasil aparece no dólar em minutos, e o real está entre as moedas que mais oscilam no mundo.",
        ],
      },
      {
        titulo: "No mundo",
        paragrafos: [
          "As grandes economias, como Estados Unidos, zona do euro, Japão e Reino Unido, têm câmbio flutuante. Muitos emergentes adotam versões administradas, com mais ou menos intervenção. Alguns países mantêm a moeda presa ao dólar, como Hong Kong e vários países do Golfo, e outros simplesmente usam o dólar, como Equador e Panamá.",
        ],
      },
    ],
    exemplo: "Em 13 de janeiro de 1999, o presidente do Banco Central deixou o cargo; dois dias depois, o câmbio passou a flutuar. O dólar saiu de R$ 1,21 em 12 de janeiro e chegou a R$ 2,16 no começo de março, uma alta de quase 80% em menos de dois meses. Quem tinha dívida em dólar e receita em reais viu a conta quase dobrar.",
    naPratica: "Com câmbio flutuante, qualquer notícia que mude a percepção de risco sobre o Brasil aparece no dólar em minutos. O risco cambial não some com o tempo: ele é o preço de um regime que, por outro lado, evita crises como as do câmbio fixo. Para quem vive em reais, isso significa que o valor do patrimônio em moeda forte oscila o tempo todo, e que uma parcela em outra moeda funciona como amortecedor, não como aposta.",
    relacionados: [
      "cambio-fixo",
      "desvalorizacao-cambial",
      "meta-de-inflacao",
      "risco-cambial",
      "plano-real",
      "tripe-macroeconomico",
      "reservas-internacionais",
      "crise-de-1999",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "31:42" },
      { modulo: 0, aula: 1, tempo: "18:55" },
    ],
  },
  {
    slug: "cambio-fixo",
    termo: "Câmbio fixo",
    categoria: "Câmbio e moeda",
    apelidos: [
      "âncora cambial",
      "banda cambial",
      "câmbio controlado",
      "paridade com o dólar",
      "moeda presa ao dólar",
      "faixa controlada",
    ],
    resumo: "Regime em que o governo prende a moeda a outra, num valor fixo ou dentro de uma faixa. Ajuda a derrubar a inflação, mas exige reservas e juros altos para se sustentar.",
    texto: [
      "Imagine um país com inflação crônica, em que ninguém acredita nas promessas do banco central. Uma saída é amarrar a moeda ao dólar: se um peso vale sempre um dólar, os preços dos produtos que vêm de fora param de subir, e os de dentro perdem espaço para subir. O país pega emprestada a reputação de outro banco central. Isso é câmbio fixo, ou âncora cambial.",
      "No câmbio fixo, o governo promete comprar e vender a moeda estrangeira a um preço definido, ou dentro de uma faixa. Enquanto a promessa for crível, o câmbio para de ser um risco. O problema é quando ela deixa de ser.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Para sustentar o preço, o banco central precisa ter dólares para vender quando todo mundo quer comprar. Por isso o regime exige reservas grandes. Quando as reservas começam a cair, a outra arma são os juros: subi-los até o ponto em que ficar na moeda local volte a valer a pena.",
          "Há versões mais e menos rígidas. Na paridade pura, a moeda vale um número fixo de dólares. No currency board, cada nota emitida precisa ter um dólar guardado atrás. Na banda cambial, o preço pode andar dentro de uma faixa, que às vezes se desloca devagar ao longo do tempo.",
          "A amarra só dura enquanto mantê-la custa menos que soltá-la. Quando o mercado duvida que o banco central aguenta, vende a moeda em massa e testa a promessa. Se as reservas não bastam, o regime cai, e o preço salta de uma vez.",
        ],
      },
      {
        titulo: "No Brasil e na Argentina",
        paragrafos: [
          "Nos primeiros anos do Plano Real, o Brasil usou uma banda cambial, com o dólar subindo devagar e sob controle. A âncora ajudou a derrubar a inflação, mas veio com juros altíssimos e um déficit externo crescente. Depois das crises da Ásia e da Rússia, as reservas derreteram, e em janeiro de 1999 o país trocou de regime e deixou o câmbio flutuar.",
          "A Argentina foi mais longe. De 1991 a 2002, a lei garantia um peso por um dólar, com um sistema próximo de um currency board. A inflação caiu de quatro dígitos para quase zero. Mas, quando o real se desvalorizou e a economia argentina perdeu competitividade, a conta não fechou. O fim veio com o bloqueio de depósitos, o corralito, o calote da dívida e uma desvalorização brutal do peso.",
        ],
      },
      {
        titulo: "Onde ainda funciona",
        paragrafos: [
          "Câmbio fixo não é sinônimo de fracasso. Hong Kong mantém o dólar local preso ao americano desde 1983, e vários países do Golfo fazem o mesmo, sustentados por reservas enormes e por receitas de petróleo em dólar. A Dinamarca prende a coroa ao euro há décadas.",
          "O que esses casos têm em comum é munição de sobra e disposição de abrir mão da política de juros própria. O país que fixa o câmbio passa a seguir, na prática, os juros do país da moeda-âncora.",
        ],
      },
    ],
    exemplo: "Hipotético: um banco central promete o dólar a no máximo R$ 1,20 e tem US$ 30 bilhões em reservas. Se investidores querem trocar o equivalente a US$ 40 bilhões em reais por dólares, ele não tem como honrar todos. Pode subir os juros para segurar parte da saída, mas cada ponto a mais pesa na economia e na dívida pública. Se a fuga continua, a promessa cai, e o preço salta de uma vez.",
    naPratica: "Câmbio fixo dá a sensação de que o dólar não é um risco. A história mostra que o risco fica represado e aparece de uma vez, quando o regime acaba, muitas vezes junto com medidas que atingem quem confiou na promessa, como bloqueio de depósitos. Estabilidade de preço por decreto não é o mesmo que estabilidade de valor. Para quem diversifica moeda, a lição é desconfiar de períodos de câmbio calmo demais e não tomá-los como prova de que a proteção é desnecessária.",
    relacionados: [
      "cambio-flutuante",
      "plano-real",
      "desvalorizacao-cambial",
      "meta-de-inflacao",
      "corralito",
      "crise-de-1999",
      "reservas-internacionais",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "12:06" },
    ],
  },
  {
    slug: "risco-cambial",
    termo: "Risco cambial",
    categoria: "Câmbio e moeda",
    apelidos: [
      "risco da moeda",
      "risco de moeda",
      "risco do câmbio",
      "risco do dólar",
      "exposição cambial",
      "risco político e cambial",
    ],
    resumo: "A chance de o câmbio mudar e alterar o valor do seu patrimônio medido na moeda em que você vive. Corta para os dois lados.",
    texto: [
      "Você compra US$ 10 mil em ações com o dólar a R$ 5. As ações ficam paradas, mas o dólar cai para R$ 4,50. Em reais, você perdeu R$ 5 mil sem que nada tenha acontecido com as empresas. Esse é o risco cambial: a chance de o câmbio mudar e alterar o valor do seu patrimônio medido na moeda em que você vive.",
      "O risco existe dos dois lados. Quem investe em dólar e gasta em reais corre o risco de o dólar cair. Quem tem tudo em reais e um dia vai precisar de dólar, para estudar, morar fora, viajar ou comprar algo com preço global, corre o risco de o dólar subir. Ficar todo numa moeda não elimina o risco cambial: só escolhe um lado dele.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O risco cambial aparece sempre que existe uma diferença entre a moeda do que você tem e a moeda do que você vai gastar. Empresas chamam isso de descasamento: dívida em dólar com receita em reais, ou o contrário. Na vida da pessoa física, o descasamento costuma estar escondido.",
          "Pense no seu consumo. Gasolina, trigo, remédios, eletrônicos, passagens e boa parte do que você compra têm preço formado lá fora, em dólar, mesmo pagos em reais. Quando o real cai, esses preços sobem, com algum atraso. Ou seja: mesmo quem nunca vai viajar tem uma parte dos gastos ligada ao dólar.",
        ],
      },
      {
        titulo: "O efeito que joga a favor",
        paragrafos: [
          "O real costuma perder valor justamente quando a economia brasileira vai mal, junto com a bolsa, o emprego e o preço dos imóveis. Nessas horas, a parte do patrimônio em dólar tende a subir em reais e amortecer as perdas do resto.",
          "Para quem vive no Brasil, isso faz do dólar uma espécie de seguro: ele costuma pagar quando o resto vai mal. É o oposto do que acontece com um americano que compra ações brasileiras, para quem o real costuma cair junto com a bolsa daqui, e o risco cambial piora a perda.",
          "Esse padrão não é lei. Há períodos em que o real e a bolsa sobem juntos por anos e a parte dolarizada parece um peso. Mas, nas grandes crises brasileiras e globais das últimas décadas, o padrão se repetiu.",
        ],
      },
      {
        titulo: "Como se mede e como se reduz",
        paragrafos: [
          "A medida simples é a exposição: quanto do patrimônio está em cada moeda, comparado a quanto dos gastos futuros está em cada moeda. Uma família que planeja pagar a faculdade de um filho no exterior tem gastos em dólar; uma que pretende viver no Brasil para sempre tem quase tudo em reais, com uma fatia escondida em dólar.",
          "O risco cambial pode ser reduzido com hedge, operações que neutralizam a variação da moeda, ou equilibrado com diversificação, mantendo patrimônio em mais de uma moeda. O hedge tem custo e elimina também o efeito que joga a favor; a diversificação aceita a oscilação em troca de não depender de uma moeda só.",
        ],
      },
    ],
    exemplo: "Em 2008, o S&P 500 caiu 37% em dólar, contando os dividendos, mas o dólar subiu de R$ 1,77 para R$ 2,34. Para quem mora no Brasil, a perda em reais foi de perto de 17%. A moeda amorteceu mais da metade da queda da bolsa. No mesmo ano, o Ibovespa caiu 41% em reais.",
    naPratica: "A pergunta útil não é se o dólar vai subir, mas em que moeda estão os seus gastos futuros. Gastos em reais, investimento em dólar: o câmbio oscila contra você às vezes, e a favor nas crises. Gastos em dólar, investimento em reais: o risco é o inverso, e costuma doer na pior hora. Mapear isso antes de decidir quanto dolarizar evita tratar o câmbio como aposta e ajuda a enxergá-lo como risco a equilibrar.",
    relacionados: [
      "retorno-em-reais",
      "hedge-cambial",
      "risco-de-base",
      "desvalorizacao-cambial",
      "diversificacao",
      "correlacao",
      "risco-de-concentracao",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "2:00" },
      { modulo: 0, aula: 3, tempo: "22:31" },
      { modulo: 1, aula: 3, tempo: "12:30" },
    ],
  },
  {
    slug: "retorno-em-reais",
    termo: "Retorno em reais de um ativo em dólar",
    categoria: "Câmbio e moeda",
    apelidos: [
      "risco duplo",
      "retorno em reais",
      "ganho em reais",
      "S&P mais dólar",
      "dólar mais S&P",
    ],
    resumo: "O resultado em reais de um investimento em dólar junta dois movimentos, o do ativo e o do câmbio. Eles não só se somam: se multiplicam.",
    texto: [
      "Uma ação sobe 10% em dólar e o dólar sobe 10% contra o real. Você ganhou 20%? Não, 21%. A alta do dólar incide sobre um valor que já tinha crescido. É por isso que se diz que ativo e moeda não só se somam: se multiplicam.",
      "O resultado em reais de um investimento em dólar junta dois movimentos, o do ativo e o do câmbio. Na aula, Marcelo Campos chama isso de risco duplo: quem vive em reais e compra um ativo em dólar carrega dois riscos de uma vez, que às vezes se somam e às vezes se anulam.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A conta é a mesma dos juros compostos. Você transforma reais em dólares, o ativo cresce em dólares, e no fim você transforma os dólares de volta em reais a um câmbio diferente. Cada etapa multiplica a anterior.",
          "Em palavras: o ganho em reais é o ganho do ativo somado ao ganho do dólar, mais um pouquinho, porque um rende sobre o outro. Esse pouquinho é o produto dos dois percentuais. Com 10% e 10%, ele é 1 ponto; com 30% e 30%, já são 9 pontos.",
          "A conta vale para baixo também. Ativo subindo 10% e dólar caindo 10% não dão zero: dão 1% de perda. Em movimentos pequenos, a soma simples quase acerta. Em movimentos grandes, a diferença aparece.",
        ],
      },
      {
        titulo: "Separar as duas partes",
        paragrafos: [
          "Para avaliar um investimento lá fora, vale olhar o resultado em dólar e o resultado em reais separados. O primeiro diz se o ativo foi bom. O segundo diz o que aconteceu com o seu poder de compra aqui.",
          "Um fundo de ações americanas pode render 20% em reais num ano em que o S&P 500 ficou parado, só porque o dólar subiu. E pode perder em reais num ano em que as ações foram muito bem, porque o real se fortaleceu. Julgar o ativo pelo número em reais leva a conclusões erradas nos dois casos.",
        ],
      },
      {
        titulo: "Quando os dois andam juntos ou separados",
        paragrafos: [
          "Para quem mora no Brasil, os dois riscos costumam se compensar em parte. Quando o mundo entra em pânico, as ações caem lá fora, mas o dólar sobe aqui. Em 2008 e em 2020, foi o que aconteceu: a perda em reais foi bem menor que a perda em dólar.",
          "Nos períodos de calmaria e de entrada de dinheiro no Brasil, o contrário pode ocorrer: as ações sobem lá fora e o real se fortalece, e o ganho em reais fica menor que o ganho em dólar. Entre 2003 e 2011, quem tinha ações americanas viu boa parte do ganho comida pelo câmbio.",
        ],
      },
    ],
    exemplo: "Uma ação americana sobe 8% num ano. Se o dólar sobe 10% no mesmo período, você ganha perto de 19% em reais. Se o dólar cai 10%, termina com cerca de 3% de prejuízo, mesmo com a ação no azul. Hipotético, com números redondos: R$ 10 mil viram R$ 11.880 no primeiro caso e R$ 9.720 no segundo.",
    naPratica: "Ao olhar o desempenho de um investimento lá fora, separe as duas partes: quanto veio do ativo e quanto do câmbio. Num período de dólar forte, tudo parece ótimo em reais; num de real forte, um bom investimento pode parecer ruim. Essa separação evita duas armadilhas: vender um bom ativo porque o câmbio andou contra, e achar que acertou na escolha quando quem fez o trabalho foi o dólar.",
    relacionados: [
      "risco-cambial",
      "cambio",
      "hedge-cambial",
      "sp-500",
      "juros-compostos",
      "retorno-do-investidor",
      "vies-de-recencia",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "2:00" },
      { modulo: 0, aula: 3, tempo: "22:31" },
      { modulo: 0, aula: 4, tempo: "23:18" },
    ],
  },
  {
    slug: "hedge-cambial",
    termo: "Hedge cambial",
    categoria: "Câmbio e moeda",
    apelidos: [
      "hedge",
      "proteção cambial",
      "operação de proteção",
      "com hedge",
      "sem hedge",
      "hedgeado",
      "hedgeada",
    ],
    resumo: "Operação que neutraliza o efeito do câmbio sobre um investimento. Você fica com o resultado do ativo, sem o sobe e desce da moeda, pagando por isso.",
    texto: [
      "Imagine um fundo brasileiro que compra ações americanas e, ao mesmo tempo, vende dólar no mercado futuro na mesma quantia. Se o dólar sobe, o ganho nas ações em reais é compensado pela perda na venda de dólar, e vice-versa. O cotista fica só com o desempenho das ações. Isso é um hedge cambial.",
      "Hedge, em inglês, é a cerca viva que separa dois terrenos. Em finanças, é qualquer operação que neutraliza um risco. No câmbio, é a operação que tira do investimento o sobe e desce da moeda, pagando por isso.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O instrumento mais comum é o dólar futuro. Quem tem ativos em dólar vende contratos de dólar futuro no mesmo valor. Se o dólar sobe, os ativos ganham em reais e os contratos perdem; se o dólar cai, o contrário. O resultado do câmbio se anula.",
          "Como os ativos mudam de valor todo dia, a proteção precisa ser ajustada de tempos em tempos e renovada a cada vencimento. Por isso o hedge nunca é perfeito: sempre sobra um pequeno descasamento, e há custos de operação.",
        ],
      },
      {
        titulo: "Quanto custa",
        paragrafos: [
          "A proteção tem preço, e no Brasil ele costuma ser favorável a quem a faz. Como o juro aqui é bem mais alto que nos Estados Unidos, o dólar futuro é negociado acima do dólar de hoje. Quem vende dólar futuro trava esse preço mais alto, e a diferença entra como ganho.",
          "Na prática, um fundo com hedge rende algo perto do desempenho do ativo em dólar mais a diferença de juros entre os dois países. Quando o juro brasileiro é muito maior que o americano, isso soma vários pontos por ano. Quando a diferença diminui, o ganho do hedge some. Para um americano que protege um ativo brasileiro, a mesma diferença vira custo.",
        ],
      },
      {
        titulo: "Com ou sem hedge",
        paragrafos: [
          "Fundos e ETFs que fazem a proteção costumam dizer isso no nome ou no regulamento, às vezes com a palavra hedge, às vezes com a expressão com proteção cambial. Muitos fundos brasileiros que investem lá fora oferecem as duas versões.",
          "A escolha muda tudo. A versão com hedge entrega o ativo estrangeiro medido como se fosse em reais. A versão sem hedge entrega o ativo e a moeda. Quem busca diversificar o risco do real precisa da segunda; quem quer só o desempenho de uma bolsa estrangeira, sem apostar na moeda, pode preferir a primeira.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Comprar um fundo com hedge achando que está dolarizando. Ele investe lá fora, mas o resultado volta a depender só de ativos e juros, com a moeda neutralizada.",
          "Comparar o desempenho das duas versões num único ano e concluir que uma é melhor. A diferença entre elas é, quase toda, o movimento do câmbio daquele ano.",
        ],
      },
    ],
    exemplo: "Hipotético: dois fundos compram o mesmo índice americano. Num ano em que o índice sobe 10% e o dólar sobe 15%, o fundo sem hedge ganha perto de 26% em reais; o com hedge fica perto dos 10%, mais a diferença de juros, digamos 19% no total. Num ano em que o dólar cai 15%, o sem hedge perde cerca de 6,5%, e o com hedge continua perto dos 19%.",
    naPratica: "Para quem ganha e gasta em reais, boa parte da proteção que o exterior oferece vem da própria moeda, porque o dólar tende a subir nas crises brasileiras. Fazer hedge de todo o câmbio elimina justamente essa parte. A escolha entre com e sem hedge depende do motivo de investir lá fora: diversificar a moeda pede a versão sem proteção; buscar outros setores e empresas, sem mexer na exposição ao real, pode pedir a com proteção.",
    relacionados: [
      "risco-cambial",
      "dolar-futuro",
      "paridade-de-juros",
      "retorno-em-reais",
      "diversificacao",
      "fundo-cambial",
      "bdr",
      "etf",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "2:00" },
      { modulo: 1, aula: 3, tempo: "12:30" },
    ],
  },
  {
    slug: "dolar-futuro",
    termo: "Dólar futuro",
    categoria: "Câmbio e moeda",
    apelidos: [
      "contrato futuro de dólar",
      "mercado futuro de dólar",
      "minidólar",
      "mercado futuro",
      "contratos futuros",
    ],
    resumo: "Contrato negociado na B3 que fixa hoje o preço do dólar numa data futura. É a ferramenta mais usada para proteger ou apostar no câmbio.",
    texto: [
      "Um importador sabe que vai pagar US$ 1 milhão daqui a três meses e não quer correr o risco de o dólar disparar. Ele compra dólar futuro: trava hoje o preço que vai valer no vencimento. Se o dólar subir, o ganho no contrato compensa a conta mais cara. Se cair, ele perde no contrato, mas paga menos ao fornecedor. De um jeito ou de outro, o custo fica conhecido.",
      "O dólar futuro é um contrato negociado na B3 que fixa hoje o preço do dólar numa data futura. É a ferramenta mais usada no Brasil para proteger ou apostar no câmbio, e o mercado dele é tão grande que muitas vezes é ali que o preço do dólar se forma.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Na B3, há o contrato cheio, de US$ 50 mil, e o minicontrato, de US$ 10 mil, usado também por pessoas físicas. Os contratos vencem no primeiro dia útil de cada mês e são liquidados pela PTAX do último dia útil do mês anterior. Ninguém entrega dólares: só a diferença em reais muda de mãos.",
          "Os contratos exigem margem de garantia, um depósito que a bolsa guarda para cobrir perdas, e têm ajuste diário: ganhos e perdas caem na conta todo dia, e não só no vencimento. É esse mecanismo que permite operar valores grandes com pouco dinheiro, e que torna o instrumento perigoso para quem aposta sem entender.",
        ],
      },
      {
        titulo: "Por que o futuro é mais caro",
        paragrafos: [
          "O preço do dólar futuro não é uma previsão do mercado sobre o câmbio. É o dólar de hoje corrigido pela diferença de juros entre os dois países. Com juro mais alto no Brasil, o futuro fica acima do dólar à vista.",
          "O motivo é a arbitragem. Se o futuro estivesse barato, daria para comprar dólar futuro, aplicar os reais aqui a juro alto e ganhar sem risco. Se estivesse caro, o inverso. O preço se ajusta até essa vantagem sumir. É a mesma lógica da paridade coberta de juros.",
          "O juro em dólar que o mercado brasileiro usa nessa conta tem nome próprio, cupom cambial, e nem sempre bate com o juro americano, porque embute também o risco de fazer a operação a partir do Brasil.",
        ],
      },
      {
        titulo: "Quem usa",
        paragrafos: [
          "Exportadores vendem dólar futuro para garantir quanto vão receber em reais. Importadores e empresas com dívida em dólar compram. Fundos usam para fazer hedge de ativos no exterior ou para apostar no câmbio. O Banco Central, quando oferece swaps cambiais, entra num mercado vizinho, com contratos que pagam a variação do dólar.",
          "Para a pessoa física, o minicontrato virou instrumento de operação de curto prazo. Para quem investe pensando em anos, ele aparece de forma indireta, dentro dos fundos.",
        ],
      },
    ],
    exemplo: "Hipotético: dólar à vista a R$ 5,00, juro de 14% ao ano aqui e de 4% lá. O dólar para daqui a um ano sai por perto de R$ 5,48. Não porque alguém espera esse preço, mas porque é o valor que impede ganhar dinheiro sem risco com a diferença de juros. Se daqui a um ano o dólar estiver a R$ 5,20, quem comprou o futuro perdeu, mesmo com o dólar mais alto que hoje.",
    naPratica: "Para a maioria dos investidores, o dólar futuro aparece de forma indireta: é o que fundos com hedge e fundos cambiais usam por dentro. Saber que ele embute a diferença de juros explica por que esses fundos rendem diferente do dólar à vista, e por que um fundo cambial costuma ficar um pouco atrás da cotação no longo prazo. Operar o contrato diretamente é outra coisa: com ajuste diário e alavancagem, ele serve para proteger ou especular, não para guardar patrimônio em dólar.",
    relacionados: [
      "hedge-cambial",
      "paridade-de-juros",
      "fundo-cambial",
      "carry-trade",
      "ptax",
      "cambio",
    ],
  },
  {
    slug: "paridade-do-poder-de-compra",
    termo: "Paridade do poder de compra",
    sigla: "PPC",
    categoria: "Câmbio e moeda",
    apelidos: ["paridade de poder de compra", "lei do preço único", "índice Big Mac", "PPP"],
    resumo: "A ideia de que, no longo prazo, a moeda do país com mais inflação tende a perder valor na medida da diferença de inflação entre os dois países.",
    texto: [
      "Se um tênis custa US$ 100 em Nova York e R$ 300 em São Paulo, com o dólar a R$ 5, alguém vai comprar aqui e vender lá até os preços se aproximarem. Essa é a lei do preço único: o mesmo produto tende a custar o mesmo em todo lugar, medido na mesma moeda.",
      "Levada para todos os preços da economia, a ideia vira a paridade do poder de compra, ou PPC: no longo prazo, a moeda do país com mais inflação tende a perder valor na medida da diferença de inflação entre os dois países.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A versão útil é a relativa, de longo prazo: se os preços sobem 10% aqui e 2% lá, o dólar tende a ficar perto de 8% mais caro. Em palavras, o câmbio tende a andar na mesma direção da diferença entre as inflações.",
          "A lógica é simples. Se o real não perdesse valor enquanto os preços daqui sobem mais, os produtos brasileiros ficariam cada vez mais caros para os estrangeiros, e os importados, cada vez mais baratos para nós. Exportações cairiam, importações subiriam, e a pressão sobre o câmbio acabaria empurrando o real para baixo.",
        ],
      },
      {
        titulo: "Por que não funciona no curto prazo",
        paragrafos: [
          "Muitos preços não viajam. Corte de cabelo, aluguel e serviços em geral não podem ser comprados num país e revendidos em outro. Há frete, impostos, tarifas de importação e diferenças de qualidade.",
          "E o câmbio de curto prazo é dominado por fluxos de dinheiro, não de mercadorias. Juros, medo, eleições e crises globais podem afastar o câmbio da linha da PPC por anos. Por isso ela não serve para prever o dólar do ano que vem.",
        ],
      },
      {
        titulo: "O índice Big Mac",
        paragrafos: [
          "Em 1986, a revista The Economist criou uma forma bem-humorada de explicar a ideia: comparar o preço do Big Mac em vários países. Se o sanduíche custa mais em dólares num país que nos Estados Unidos, a moeda dele parece cara; se custa menos, parece barata.",
          "O índice virou referência popular justamente por ser simples. Ele tem limites óbvios, porque o preço do sanduíche depende de aluguel e salário locais, mas mostra bem a intuição de que câmbio e preços estão ligados.",
        ],
      },
      {
        titulo: "Os números do Brasil",
        paragrafos: [
          "Nas três décadas do real, a inflação brasileira foi muito maior que a americana, e só isso explica boa parte da alta do dólar. O resto veio das crises, que empurraram o real para abaixo do que a diferença de inflação justificaria.",
          "Quando um economista diz que o real está desvalorizado em termos reais, está usando essa régua: compara o câmbio de hoje com o que a diferença de inflação desde uma data de referência indicaria.",
        ],
      },
    ],
    exemplo: "De 1995 a 2025, os preços no Brasil subiram 6,4 vezes e, nos Estados Unidos, 2,1 vezes. Só essa diferença levaria o dólar médio de R$ 0,92, em 1995, para cerca de R$ 2,78. A média de 2025 foi de R$ 5,59: o resto foi perda real do real, concentrada nas crises. Em outras palavras, a diferença de inflação explica uma parte grande da alta do dólar, mas não toda.",
    naPratica: "Ficar todo em reais amarra o poder de compra do seu patrimônio lá fora à inflação brasileira e aos solavancos do dólar. A PPC não serve para prever o câmbio do ano que vem, mas explica por que, em décadas, a moeda de inflação mais alta costuma perder. Para quem pensa no longo prazo, ela é um lembrete de que a parte do patrimônio em reais precisa render acima da inflação daqui só para não ficar para trás em dólar.",
    relacionados: [
      "inflacao",
      "paridade-de-juros",
      "desvalorizacao-cambial",
      "poder-de-compra",
      "cpi",
      "ipca",
      "cambio",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "1:21:02" },
    ],
  },
  {
    slug: "paridade-de-juros",
    termo: "Paridade de juros",
    categoria: "Câmbio e moeda",
    apelidos: [
      "paridade coberta de juros",
      "paridade descoberta de juros",
      "diferença de juros",
      "diferencial de juros",
    ],
    resumo: "O ponto em que uma aplicação em reais e outra em dólar rendem o mesmo quando medidas na mesma moeda: o dólar precisa subir o suficiente para cobrir a diferença de juros.",
    texto: [
      "Para comparar um CDB com um título americano, você precisa medir os dois em reais. A aplicação aqui rende o juro brasileiro. A de lá rende o juro americano mais o que o dólar subir no período. As duas empatam quando o dólar sobe exatamente o suficiente para cobrir a diferença de juros. Esse ponto de empate é a paridade de juros.",
      "A ideia explica por que o juro alto no Brasil não é dinheiro de graça. Se o mercado inteiro pudesse ganhar a diferença sem risco, todo mundo faria isso, e os preços se ajustariam até a vantagem sumir.",
    ],
    secoes: [
      {
        titulo: "Duas versões",
        paragrafos: [
          "A paridade coberta usa o preço do dólar futuro, que o mercado fixa hoje. Ela vale quase sempre, porque qualquer desvio daria lucro sem risco: bastaria tomar dinheiro de um lado, aplicar do outro e travar o câmbio no futuro. É por isso que o dólar futuro fica acima do dólar à vista quando o juro brasileiro é maior.",
          "A paridade descoberta usa a expectativa sobre o dólar de amanhã, sem trava nenhuma. Ela diz que, em média, o dólar deveria subir a diferença de juros. Na vida real, essa versão falha muito: o câmbio se afasta da conta por anos, para os dois lados. É dessa falha que vive o carry trade.",
        ],
      },
      {
        titulo: "O que está dentro da diferença",
        paragrafos: [
          "A diferença de juros entre Brasil e Estados Unidos mistura duas coisas. A primeira é a desvalorização do real que o mercado espera, ligada sobretudo à diferença de inflação entre os dois países. A segunda é um prêmio por emprestar a um país mais arriscado, com histórico de calotes, congelamentos e crises cambiais.",
          "Esse prêmio é o motivo de o juro real brasileiro ser tão alto. Quem empresta em reais quer ser pago pela inflação esperada e por tudo o que pode dar errado no caminho. Quando a confiança nas contas públicas cai, o prêmio sobe; quando melhora, cai.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Em setembro de 2026, o Copom levou a Selic a 13,75% ao ano, e o Fed subiu o juro americano para a faixa de 3,75% a 4%. A diferença, perto de 10 pontos percentuais, é uma das maiores entre países relevantes.",
          "Nas três décadas do real, a diferença de juros foi quase sempre grande, às vezes de mais de 20 pontos. Em boa parte desse tempo, o dólar subiu menos que ela, e quem ficou em reais ganhou. Nas crises, o dólar subiu mais que ela em poucos meses, e o ganho de anos sumiu.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Comparar a Selic com o juro americano como se fossem duas prateleiras do mesmo mercado. São rendimentos em moedas diferentes, com riscos diferentes. A comparação só faz sentido depois de pôr os dois na mesma moeda.",
          "Achar que a paridade prevê o câmbio. A diferença de juros diz quanto o dólar precisaria subir para empatar, e não quanto ele vai subir.",
        ],
      },
    ],
    exemplo: "Com a Selic a 13,75% e o juro americano em 4%, o dólar precisaria subir cerca de 9,4% ao ano para a aplicação lá fora empatar com a daqui, antes de impostos e custos. Hipotético: em cinco anos, isso daria um dólar 56% mais caro. Se ele subir menos, ficar em reais ganhou; se subir mais, o exterior ganhou. A conta não diz qual dos dois vai acontecer.",
    naPratica: "Juro alto em reais não é um presente: é o preço do risco de ficar em reais. Quem fica todo aqui aposta, sem dizer, que o real vai perder menos que a diferença de juros. Quem vai para fora aceita ganhar menos juro em troca de diversificar a moeda. Nenhuma das duas escolhas é gratuita, e entender a paridade ajuda a ver que a decisão de dolarizar não é sobre qual taxa é maior, e sim sobre quanto risco de uma moeda só você quer carregar.",
    relacionados: [
      "carry-trade",
      "dolar-futuro",
      "selic",
      "fed-funds",
      "risco-pais",
      "juro-real",
      "hedge-cambial",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "26:22" },
    ],
  },
  {
    slug: "carry-trade",
    termo: "Carry trade",
    categoria: "Câmbio e moeda",
    apelidos: ["operação de carry", "carry", "dinheiro de curto prazo"],
    resumo: "Tomar dinheiro emprestado onde o juro é baixo e aplicar onde é alto, ganhando a diferença enquanto o câmbio não vira contra. O Brasil é um destino clássico.",
    texto: [
      "Um fundo estrangeiro toma dólares emprestados a 4% ao ano, converte em reais e aplica a 14%. Se o câmbio ficar parado, embolsa perto de 10 pontos por ano. Essa é a operação de carry trade: tomar dinheiro onde o juro é baixo e aplicar onde é alto, ganhando a diferença enquanto o câmbio não vira contra.",
      "O real, por ter um dos juros mais altos do mundo, é uma das moedas preferidas para a operação. Isso ajuda a explicar tanto os anos de real forte quanto as quedas bruscas nas crises.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O nome vem de carregar uma posição: o investidor carrega o ativo de juro alto e ganha a diferença todo dia, como quem recebe um aluguel. A operação pode ser feita com empréstimo de verdade ou, mais comum, com derivativos, como contratos de câmbio a termo, que embutem a diferença de juros.",
          "As moedas de financiamento são as de juro baixo: por muitos anos, o iene japonês e o franco suíço, e o dólar nas épocas de juro perto de zero. As moedas de destino são as de juro alto, como o real, o peso mexicano e a lira turca.",
        ],
      },
      {
        titulo: "Sobe de escada, desce de elevador",
        paragrafos: [
          "O risco está no câmbio. Se o real cair 15% num susto, o ganho de um ano inteiro some em semanas. Por isso o carry costuma render devagar e perder rápido. Os operadores descrevem o padrão assim: sobe de escada e desce de elevador.",
          "Quando o medo aparece no mundo, todo mundo tenta sair ao mesmo tempo, e a moeda de juro alto despenca. A saída em massa reforça a queda, que força mais gente a sair. É um dos motivos de o real cair justamente nas crises globais, como em 2008 e em 2020.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "No fim de julho de 2024, o Banco do Japão subiu os juros, e o iene, que vinha financiando operações de carry no mundo inteiro, se valorizou de repente. Investidores que tinham tomado ienes emprestados para comprar ativos de juro alto correram para desfazer as posições. Em 5 de agosto, a bolsa de Tóquio caiu mais de 12% num único dia, e moedas como o peso mexicano e o real sofreram junto.",
          "O episódio mostrou como uma operação que parece tranquila por meses pode se desfazer em dias, e como ela liga mercados que, à primeira vista, nada têm a ver um com o outro.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "Parte do dinheiro estrangeiro que entra no Brasil é desse tipo: vem atrás da diferença de juros e vai embora no primeiro sinal de perigo. Esse fluxo fortalece o real quando o juro sobe e a confiança está alta, e o derruba quando o juro cai muito ou o medo cresce.",
          "Por isso um corte forte de juros, como o de 2020, pode pesar no dólar: o Brasil perde o atrativo para esse dinheiro de curto prazo.",
        ],
      },
    ],
    exemplo: "Em 2020, com a Selic em queda rumo à mínima de 2%, que veio em agosto, e o juro real indo para o negativo, o Brasil perdeu o atrativo para esse dinheiro de curto prazo. O dólar, que começara o ano a R$ 4,02, chegou a R$ 5,94 em maio. Hipotético, do lado de quem fazia o carry: quem tinha aplicado US$ 1 milhão em reais no começo do ano, ganhando juro de 4,5%, terminou maio com perda perto de 30% em dólar.",
    naPratica: "Parte do fluxo que sustenta o real é dinheiro que vai embora no primeiro susto. É mais uma razão por que o câmbio brasileiro oscila tanto, e por que o patrimônio todo em reais fica exposto aos humores do mundo. Quem fica só em renda fixa brasileira faz, sem perceber, uma versão doméstica do carry: ganha a diferença de juros enquanto o real aguenta, e sente o câmbio de uma vez quando ele não aguenta.",
    relacionados: [
      "paridade-de-juros",
      "selic",
      "juro-real",
      "cambio-flutuante",
      "desvalorizacao-cambial",
      "dolar-futuro",
      "pandemia-de-2020",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "1:22:05" },
    ],
  },
  {
    slug: "moeda-de-reserva",
    termo: "Moeda de reserva",
    categoria: "Câmbio e moeda",
    apelidos: [
      "moeda de referência global",
      "moeda de reserva global",
      "moeda central",
      "moeda forte",
      "moedas fortes",
    ],
    resumo: "A moeda que bancos centrais guardam como reserva e que o mundo usa para cotar e liquidar comércio e dívidas. Desde Bretton Woods, é o dólar.",
    texto: [
      "Carne, soja, minério e petróleo são cotados em dólar no mundo inteiro, mesmo quando nem o vendedor nem o comprador são americanos. Bancos centrais guardam a maior parte das reservas em dólar. Empresas de dezenas de países tomam empréstimos em dólar. Isso é ser moeda de reserva.",
      "Uma moeda de reserva é a que o mundo usa para guardar valor, cotar preços e liquidar comércio e dívidas entre países. Desde a Segunda Guerra, esse papel é do dólar americano.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O posto foi da libra esterlina durante o século 19 e a primeira metade do século 20, quando Londres era o centro financeiro do mundo. Duas guerras mundiais e as dívidas que vieram com elas enfraqueceram o Reino Unido.",
          "Em 1944, os acordos de Bretton Woods montaram um sistema em que as moedas se prendiam ao dólar, e o dólar ao ouro. Em 1971, os Estados Unidos deixaram de trocar dólares por ouro, mas o dólar continuou no centro: a essa altura, o mundo já estava organizado em torno dele.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Segundo o FMI, o dólar respondia por 56,7% das reservas de câmbio dos bancos centrais no segundo trimestre de 2026, bem à frente do euro. A fatia já foi maior, perto de 70% no começo dos anos 2000, e vem caindo devagar.",
          "No mercado de câmbio, o domínio é ainda maior. Pelo levantamento trienal do BIS, o dólar estava de um dos lados de 89% das operações em abril de 2025, num mercado que girava US$ 9,6 trilhões por dia. Quem troca reais por pesos chilenos, por exemplo, muitas vezes passa pelo dólar no meio do caminho.",
        ],
      },
      {
        titulo: "O privilégio e o custo",
        paragrafos: [
          "Ser a moeda de reserva dá aos Estados Unidos uma vantagem que um ministro francês chamou de privilégio exorbitante: o mundo precisa de dólares e compra títulos do Tesouro americano, o que ajuda o país a se financiar mais barato e a ter déficits que outros não conseguiriam sustentar.",
          "O outro lado é que o dólar tende a se fortalecer nas crises globais, quando todo mundo corre para o ativo mais líquido do mundo, mesmo que a crise tenha começado nos Estados Unidos, como em 2008. Isso pesa nos exportadores americanos e nos países endividados em dólar.",
        ],
      },
      {
        titulo: "O debate sobre o fim do dólar",
        paragrafos: [
          "De tempos em tempos, surge a previsão de que o dólar vai perder o posto, para o euro, para o yuan chinês, para o ouro ou para alguma moeda digital. Até agora, nenhuma alternativa reuniu o que o dólar tem ao mesmo tempo: mercado de títulos enorme e líquido, livre movimento de capital e instituições confiáveis.",
          "Isso não quer dizer que o posto é eterno. A libra perdeu o dela em algumas décadas. Mas mudanças assim costumam ser lentas.",
        ],
      },
    ],
    exemplo: "Uma empresa brasileira que vende minério à China provavelmente fecha o contrato em dólar. Quando o dólar sobe, a receita dela em reais sobe junto, mesmo que nenhum americano tenha participado do negócio. Hipotético: um contrato de US$ 100 milhões vale R$ 500 milhões com o dólar a R$ 5, e R$ 550 milhões com ele a R$ 5,50.",
    naPratica: "Dolarizar não é apostar nos Estados Unidos: é ter parte do patrimônio na moeda em que boa parte do mundo cobra e paga. Como essa moeda tende a se fortalecer nas crises, ela funciona como amortecedor para quem vive em reais. E, se um dia o dólar perder o posto, o raciocínio continua valendo: a ideia é não depender de uma única moeda, e não escolher uma vencedora para sempre.",
    relacionados: [
      "bretton-woods",
      "dolarizacao",
      "treasury",
      "funcoes-da-moeda",
      "ouro",
      "padrao-ouro",
      "reservas-internacionais",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "3:49" },
      { modulo: 1, aula: 1, tempo: "4:55" },
    ],
  },
  {
    slug: "funcoes-da-moeda",
    termo: "Funções da moeda",
    categoria: "Câmbio e moeda",
    apelidos: [
      "três funções da moeda",
      "três funções",
      "unidade de conta",
      "meio de troca",
      "reserva de valor",
    ],
    resumo: "Moeda serve para três coisas: ser a régua dos preços (unidade de conta), o meio de pagar (meio de troca) e um lugar para guardar poder de compra (reserva de valor).",
    texto: [
      "Pense no que você faz com dinheiro. Você compara preços nele: o carro custa tanto, o salário é tanto. Você paga com ele. E você guarda nele, para usar depois. São as três funções da moeda: unidade de conta, meio de troca e reserva de valor.",
      "Uma moeda saudável cumpre as três ao mesmo tempo, e ninguém pensa nisso. É quando uma delas falha que as pessoas percebem que existem.",
    ],
    secoes: [
      {
        titulo: "As três funções",
        paragrafos: [
          "Unidade de conta é a régua dos preços. Sem ela, cada coisa teria preço em termos de todas as outras, e comparar ficaria impossível. Meio de troca é a capacidade de pagar: todo mundo aceita a moeda em troca de mercadorias e serviços, e isso dispensa o escambo. Reserva de valor é a capacidade de guardar poder de compra hoje para usar amanhã.",
          "A terceira é a mais frágil. Uma moeda pode continuar sendo aceita nas compras do dia a dia e, ao mesmo tempo, perder valor tão rápido que ninguém quer guardá-la.",
        ],
      },
      {
        titulo: "Quando as funções se separam",
        paragrafos: [
          "Com inflação alta, as funções se separam. Nos anos 1980 e no começo dos 1990, o brasileiro pagava o pão na moeda da vez, cruzeiro, cruzado ou cruzeiro real, mas guardava valor em dólar, em imóveis ou em aplicações de um dia corrigidas pela inflação, o overnight. Contratos eram reajustados por índices. A moeda nacional continuava meio de troca, mas tinha deixado de ser reserva de valor e, em boa parte, unidade de conta.",
          "Em países com hiperinflação, a separação vai mais longe. O dólar vira a unidade de conta de fato, com preços de imóveis e carros cotados nele, e às vezes vira também meio de troca, como aconteceu na Argentina e na Venezuela em vários momentos.",
        ],
      },
      {
        titulo: "Um caso real: a URV",
        paragrafos: [
          "O Plano Real usou essa separação de propósito. Em março de 1994, a URV, Unidade Real de Valor, passou a ser a unidade de conta: preços, salários e contratos passaram a ser expressos nela, enquanto os pagamentos continuavam em cruzeiros reais, convertidos todo dia.",
          "Por quatro meses, o país viveu com uma régua estável e uma moeda de pagamento podre. Quando a régua já estava aceita, em julho de 1994, ela virou a moeda nova, o real. A unidade de conta veio antes do meio de troca.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Para o investidor, a função que mais importa é a reserva de valor, e nenhuma moeda parada a cumpre perfeitamente: até o dólar perde poder de compra com a inflação americana. A reserva de valor de verdade vem de ativos que geram renda ou que acompanham os preços.",
        ],
      },
    ],
    exemplo: "Hipotético: num mês de inflação de 30%, quem recebe o salário no dia 1 corre para o supermercado, porque no fim do mês o mesmo dinheiro compra 23% menos. A moeda ainda paga as compras, mas não guarda valor. É o que o Brasil viveu por anos antes de 1994, com meses de inflação acima de 40%.",
    naPratica: "Quando a aula fala em dolarizar, fala de buscar a moeda que cumpre melhor as três funções ao mesmo tempo, no mundo inteiro. Mas, para o investidor, a que mais importa é a reserva de valor, e ela vem dos ativos que geram renda, não da nota parada. Ter parte do patrimônio em ativos de fora é uma forma de não depender de uma só moeda para guardar valor.",
    relacionados: [
      "moeda-de-reserva",
      "inflacao",
      "plano-real",
      "poder-de-compra",
      "dolarizacao",
      "urv",
      "hiperinflacao",
      "overnight",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "9:02" },
    ],
  },
  {
    slug: "dolarizacao",
    termo: "Dolarização",
    categoria: "Câmbio e moeda",
    apelidos: [
      "dolarizar",
      "dolarizado",
      "dolarizada",
      "dolarização do patrimônio",
      "dinheiro dolarizado",
      "fatia em dólar",
    ],
    resumo: "No sentido do curso, ter parte do patrimônio em ativos fora do Brasil, cotados em dólar ou em outras moedas fortes. Não é guardar nota de dólar nem torcer contra o país.",
    texto: [
      "A palavra tem dois sentidos. Em economia, dolarização é um país adotar o dólar no lugar da própria moeda, como fizeram Equador e El Salvador. No curso, é uma decisão de investidor: deixar parte do patrimônio em ativos de fora, cotados em dólar ou em outras moedas fortes, em vez de 100% em reais e em empresas e títulos brasileiros.",
      "Dolarizar, no sentido do curso, não é guardar nota de dólar nem torcer contra o país. É reconhecer que ter tudo numa moeda, numa economia e num sistema jurídico já é uma aposta concentrada, mesmo que não pareça.",
    ],
    secoes: [
      {
        titulo: "A dolarização dos países",
        paragrafos: [
          "Alguns países abriram mão da própria moeda. O Panamá usa o dólar desde o começo do século 20. O Equador adotou o dólar em 2000, depois de uma crise bancária e de uma inflação descontrolada. El Salvador fez o mesmo em 2001. Na Argentina, a ideia de dolarizar a economia volta ao debate a cada crise.",
          "A troca acaba com o risco cambial dentro do país e costuma derrubar a inflação, mas tem um custo: o país deixa de ter política de juros própria e de poder desvalorizar a moeda num choque. Passa a depender do Fed, que decide pensando nos Estados Unidos.",
          "Existe também a dolarização informal, quando as pessoas passam a guardar valor em dólar por conta própria, mesmo com a moeda local em circulação. Foi o que muitos brasileiros fizeram nos anos de inflação alta.",
        ],
      },
      {
        titulo: "A dolarização do patrimônio",
        paragrafos: [
          "Felippe insiste num ponto: dolarizar não é comprar dólar e guardar no colchão. O dólar também perde poder de compra com a inflação americana. É ter ações, títulos, imóveis e outros ativos que geram renda lá fora, e não só nos Estados Unidos.",
          "O motivo central não é achar que o Brasil vai mal. É que quem mora aqui já tem uma exposição enorme ao país: o salário, o imóvel, o emprego, a aposentadoria pública e o negócio da família estão em reais. Pôr também os investimentos todos aqui concentra ainda mais o risco.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Dolarizar não é sinônimo de investir nos Estados Unidos. A bolsa americana é a maior do mundo, mas o mundo tem outros mercados, setores e moedas. Diversificar fora do país pode significar várias geografias.",
          "Também não é uma decisão de tudo ou nada. Quanto dolarizar é uma decisão pessoal, e zero é uma resposta legítima. O que o curso discute é por que deixar tudo numa moeda e numa economia já é uma escolha, com riscos próprios.",
          "Por fim, não é market timing. Esperar o dólar cair para começar é tentar adivinhar o câmbio, algo que ninguém faz com regularidade.",
        ],
      },
      {
        titulo: "Os caminhos",
        paragrafos: [
          "Há várias portas, com custos, impostos e graus de controle diferentes. Sem sair do Brasil, dá para comprar BDRs, que são recibos de ações estrangeiras negociados na B3, ETFs locais que replicam índices de fora e fundos brasileiros que investem no exterior, com ou sem proteção cambial. Saindo do Brasil, dá para abrir conta numa corretora internacional e comprar ações, ETFs e títulos diretamente, em dólar.",
          "Cada porta muda o que você de fato carrega. Um fundo com hedge investe lá fora, mas não dolariza. Uma conta no exterior dolariza de verdade, mas traz obrigações de declaração e regras próprias de imposto. O curso trata dessas diferenças nos módulos seguintes.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Estudos sobre o comportamento de investidores mostram que as pessoas, no mundo inteiro, concentram o patrimônio no próprio país muito além do que o tamanho da economia justificaria. É o viés doméstico, ou home bias. No Brasil, com a bolsa representando menos de 1% do valor das bolsas do mundo, esse viés é especialmente caro em diversificação.",
        ],
      },
    ],
    exemplo: "Quem comprou dólar no fim de 2002 e deixou parado até o fim de 2010 perdeu cerca de 70% do poder de compra em reais: o dólar caiu 53% e os preços no Brasil subiram 57%. Dólar parado protege contra a moeda, não contra a inflação. Quem, em vez disso, comprou ativos que geram renda lá fora teve dividendos e juros no período, o que reduziu bastante a perda.",
    naPratica: "Pense na dolarização como diversificação do patrimônio inteiro, que inclui salário, imóvel e aposentadoria em reais. A pergunta não é se o dólar vai subir, e sim quanto você quer depender de uma única economia, e em que moeda estão os seus gastos futuros. A resposta muda de pessoa para pessoa, e é esse o trabalho que o curso propõe: decidir com critério, sem pressa de acertar o momento.",
    relacionados: [
      "diversificacao",
      "risco-de-concentracao",
      "moeda-de-reserva",
      "home-bias",
      "alocacao-de-ativos",
      "capital-humano",
      "market-timing",
      "conta-global",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "3:49" },
      { modulo: 0, aula: 4, tempo: "0:12" },
      { modulo: 1, aula: 3, tempo: "45:31" },
    ],
  },
  {
    slug: "ouro",
    termo: "Ouro",
    categoria: "Câmbio e moeda",
    apelidos: ["ETF de ouro", "ETFs de ouro", "barras de ouro"],
    resumo: "O metal que serviu de lastro às moedas por séculos e hoje é guardado por bancos centrais e investidores como reserva de valor. Não paga juros nem dividendos.",
    texto: [
      "Durante séculos, ter dinheiro era ter um direito sobre ouro. Uma nota de dólar podia, em tese, ser trocada por uma quantidade fixa do metal. Esse lastro acabou em 1971, quando os Estados Unidos deixaram de trocar dólares por ouro, mas o metal não saiu de cena: continua nos cofres dos bancos centrais e nas carteiras de investidores que querem um ativo fora do sistema de qualquer moeda.",
      "Para o investidor, o ouro é um ativo curioso. Não paga juros, não paga dividendos, não tem lucro. O retorno vem só da variação de preço, cotado em dólar.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O padrão-ouro, em que as moedas eram conversíveis em ouro, organizou o comércio mundial no século 19 e no começo do 20. Depois da Segunda Guerra, o sistema de Bretton Woods prendeu as moedas ao dólar, e só o dólar ao ouro, a US$ 35 a onça.",
          "Com déficits crescentes e reservas de ouro caindo, os Estados Unidos fecharam a janela de conversão em agosto de 1971. Desde então, o preço do ouro flutua livremente, e as moedas do mundo não têm lastro em nada além da confiança em quem as emite.",
        ],
      },
      {
        titulo: "Os bancos centrais voltaram a comprar",
        paragrafos: [
          "Depois de décadas vendendo ouro, os bancos centrais viraram compradores. Segundo o World Gold Council, compraram mais de mil toneladas por ano em 2022, 2023 e 2024, um ritmo recorde, e 863 toneladas em 2025. O Banco Central do Brasil esteve entre os compradores relevantes de 2025.",
          "Parte desse movimento é atribuída ao desejo de alguns países de depender menos do dólar, sobretudo depois que reservas russas foram congeladas em 2022. O ouro guardado no próprio cofre não pode ser bloqueado por outro governo.",
        ],
      },
      {
        titulo: "Como funciona como investimento",
        paragrafos: [
          "O ouro costuma ser procurado em momentos de medo, inflação alta, juros reais negativos ou desconfiança das moedas. Como não paga renda, ele compete com os títulos: quando o juro real sobe, carregar ouro fica mais caro em termos de oportunidade, e o preço tende a sofrer.",
          "Ele pode passar longos períodos parado ou caindo. Depois do pico de 1980, levou mais de duas décadas para voltar ao mesmo preço nominal. Depois do pico de 2011, levou quase uma década. Quem compra ouro precisa ter estômago para esses intervalos.",
        ],
      },
      {
        titulo: "Como ter ouro hoje",
        paragrafos: [
          "Dá para ter ouro em barra, em moedas, em contratos na bolsa e por ETFs, fundos negociados em bolsa que acompanham o preço do metal. O primeiro ETF de ouro do mundo estreou na Austrália em 2003; o mais conhecido, americano, em 2004. Na B3, o primeiro chegou em 2020, e o primeiro lastreado em barras de verdade, em 2025.",
        ],
      },
    ],
    exemplo: "Hipotético: o ouro está a US$ 2.000 a onça e o dólar a R$ 5. Se o metal sobe 10% e o dólar fica parado, você ganha 10% em reais. Se o metal sobe 10% e o dólar cai 10%, você termina perto de 1% no prejuízo. Como é cotado em dólar, o ouro carrega também o risco cambial para quem mede em reais.",
    naPratica: "O ouro é uma forma de ter um ativo fora do sistema de uma moeda só, mas sem renda: o resultado depende inteiramente do preço e do câmbio. A distância de quase duas décadas entre o primeiro ETF de ouro do mundo e o primeiro na B3 é, na aula, um sinal de como o investidor brasileiro chega tarde a certos instrumentos. Para quem pensa em diversificar moeda, o ouro pode ser uma peça, mas não substitui ativos que geram renda.",
    relacionados: [
      "moeda-de-reserva",
      "etf",
      "bretton-woods",
      "bitcoin",
      "funcoes-da-moeda",
      "padrao-ouro",
      "reservas-internacionais",
      "juro-real",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "23:49" },
      { modulo: 1, aula: 1, tempo: "8:02" },
    ],
  },
  {
    slug: "juros-compostos",
    termo: "Juros compostos",
    categoria: "Juros e inflação",
    apelidos: ["juro composto", "juros sobre juros", "capitalização composta"],
    resumo: "Juro que rende sobre o juro já ganho. No começo parece pouco; com o tempo, é a força que mais pesa no resultado de quem investe, e de quem deve.",
    texto: [
      "Você aplica R$ 1.000 a 10% ao ano. No primeiro ano ganha R$ 100. No segundo, ganha 10% sobre R$ 1.100, ou R$ 110. No terceiro, R$ 121. O juro de cada ano incide sobre tudo o que já se acumulou, inclusive os juros anteriores. Isso é juro composto, ou juros sobre juros.",
      "No começo, parece pouco: a diferença de um ano para o outro é de alguns reais. Com o tempo, é a força que mais pesa no resultado de quem investe, e de quem deve.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A diferença para o juro simples, que rende sempre sobre o valor inicial, é pequena em prazos curtos e enorme em prazos longos. No juro simples, o dinheiro cresce em linha reta. No composto, cresce em curva, cada vez mais inclinada.",
          "Em 30 anos, a 10% ao ano, R$ 1.000 viram cerca de R$ 17.400 com juros compostos, contra R$ 4.000 com juros simples. A maior parte do resultado aparece no fim: nos últimos dez anos, o dinheiro cresce mais do que nos vinte primeiros somados.",
          "Por isso, nos juros compostos, o tempo vale tanto quanto a taxa. Começar dez anos antes costuma pesar mais do que conseguir um ponto a mais de rendimento.",
        ],
      },
      {
        titulo: "O lado de quem paga",
        paragrafos: [
          "A mesma lógica funciona contra você. Numa dívida de cartão ou de cheque especial, os juros se acumulam sobre juros, e o saldo cresce depressa. Numa taxa de administração cobrada todo ano, o custo também se compõe: você perde não só a taxa, mas tudo o que ela renderia nos anos seguintes.",
          "E a inflação é um juro composto ao contrário: corrói o poder de compra mês após mês, também sobre o que já foi corroído. Uma inflação de 5% ao ano parece pequena, mas em 14 anos corta pela metade o valor do dinheiro parado.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Somar taxas em vez de multiplicar. Dois anos de 10% não dão 20%, dão 21%. Um ganho de 50% seguido de uma perda de 50% não dá zero: dá 25% de prejuízo. Retornos se encadeiam, não se somam.",
          "Subestimar custos pequenos. Um ponto percentual por ano parece irrelevante num extrato mensal, mas em décadas vira uma fatia grande do patrimônio final.",
          "Há uma frase famosa, atribuída a Albert Einstein, que chama os juros compostos de oitava maravilha do mundo. Ninguém nunca achou prova de que ele a tenha dito. A ideia, porém, é boa.",
        ],
      },
      {
        titulo: "No curso",
        paragrafos: [
          "Juros compostos aparecem em quase toda conta do curso: no retorno em reais de um ativo em dólar, que multiplica o ganho do ativo pelo da moeda; no peso das taxas de fundos; e no argumento de que tempo investido vale mais que acertar o momento de entrar.",
        ],
      },
    ],
    exemplo: "Hipotético: dois investidores aplicam R$ 100 mil por 20 anos. Um rende 8% ao ano; o outro, 7%, porque paga 1 ponto a mais de taxa. No fim, o primeiro tem cerca de R$ 466 mil, e o segundo, R$ 387 mil. Um ponto por ano virou quase R$ 80 mil, quase o valor aplicado no começo.",
    naPratica: "Juros compostos explicam por que o retorno em reais de um ativo em dólar não é a soma dos dois ganhos, por que custos baixos importam tanto e por que tempo investido costuma valer mais que acertar o momento. Para quem dolariza aos poucos, a lição é dupla: começar cedo, mesmo com pouco, e prestar atenção nos custos de conversão, de corretagem e de administração, que se compõem contra você pelo mesmo mecanismo.",
    relacionados: [
      "regra-dos-72",
      "valor-presente",
      "juro-real",
      "taxa-de-administracao",
      "retorno-em-reais",
      "custo-total",
      "horizonte-de-investimento",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "23:49" },
      { modulo: 1, aula: 3, tempo: "13:18" },
    ],
  },
  {
    slug: "regra-dos-72",
    termo: "Regra dos 72",
    categoria: "Juros e inflação",
    apelidos: ["tempo para dobrar", "anos para dobrar", "dobra em", "para dobrar"],
    resumo: "Atalho de cabeça: divida 72 pela taxa de juros anual e você tem, mais ou menos, quantos anos um valor leva para dobrar.",
    texto: [
      "Quanto tempo R$ 10 mil levam para virar R$ 20 mil a 8% ao ano? Divida 72 por 8: cerca de nove anos. É a regra dos 72, um atalho de cabeça para os juros compostos.",
      "Funciona assim: divida 72 pela taxa anual e você tem, mais ou menos, quantos anos um valor leva para dobrar. Ao contrário, divida 72 pelo número de anos e você tem a taxa necessária para dobrar nesse prazo.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A regra aparece num livro de matemática comercial do frei italiano Luca Pacioli, o mesmo que divulgou o método das partidas dobradas da contabilidade, no fim do século 15. Ele a apresenta como coisa já conhecida dos comerciantes.",
          "O 72 não é mágico. A conta exata usa logaritmos, e o número ideal seria perto de 69 para taxas muito baixas. O 72 foi escolhido porque é fácil de dividir por 2, 3, 4, 6, 8, 9 e 12, e porque acerta bem na faixa de taxas mais comum, entre 6% e 10% ao ano.",
        ],
      },
      {
        titulo: "Onde ela serve",
        paragrafos: [
          "Serve para qualquer coisa que cresça a uma taxa constante: um investimento, uma dívida, a população, os preços numa inflação. Funciona bem para taxas entre 2% e 20% ao ano; fora disso, o erro aumenta.",
          "Ela também mede a perda. Se os preços sobem 6% ao ano, o seu dinheiro parado perde metade do poder de compra em uns 12 anos. Se sobem 3%, em uns 24. É um jeito rápido de sentir o estrago da inflação sobre dinheiro guardado.",
          "Também vale para crescimento econômico. Um país que cresce 2% ao ano dobra a renda em 36 anos; um que cresce 7%, em pouco mais de 10. Diferenças pequenas de taxa viram gerações de diferença.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Usar taxa mensal com a regra pensada para taxa anual. Se a taxa é mensal, o resultado sai em meses: a 1% ao mês, algo dobra em uns 72 meses, ou seis anos.",
          "Esquecer a inflação. Dobrar o valor em reais não é dobrar o poder de compra. Para saber em quanto tempo o seu dinheiro dobra de verdade, use o juro real na conta.",
        ],
      },
    ],
    exemplo: "A 13,75% ao ano, a Selic definida pelo Copom em setembro de 2026, um capital dobra em pouco mais de cinco anos. A 4%, perto do juro básico americano, leva quase 18. Em 2002, com um custo de 27% ao ano somando juro americano e risco-país, uma dívida brasileira em dólar dobrava em menos de três.",
    naPratica: "A regra ajuda a sentir o peso das taxas. Juro alto dobra o dinheiro rápido, mas também mostra quanto o mercado cobra para carregar o risco do país. E ajuda a ver o estrago da inflação sobre dinheiro parado, em reais ou em dólar. Ao comparar caminhos para o patrimônio, aplique a regra ao juro real, e não ao nominal: é ele que diz em quanto tempo o seu poder de compra dobra.",
    relacionados: [
      "juros-compostos",
      "selic",
      "inflacao",
      "poder-de-compra",
      "juro-real",
      "fed-funds",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "23:49" },
      { modulo: 0, aula: 2, tempo: "44:20" },
    ],
  },
  {
    slug: "valor-presente",
    termo: "Valor presente",
    categoria: "Juros e inflação",
    apelidos: [
      "valor de hoje",
      "a valor de hoje",
      "trazido a valor de hoje",
      "trazidos a valor de hoje",
      "trazidos para valores de hoje",
      "taxa de desconto",
    ],
    resumo: "Quanto vale hoje um dinheiro que só vai chegar no futuro. Você acha descontando o valor futuro pelos juros do período.",
    texto: [
      "Alguém te oferece R$ 1.100 daqui a um ano. Quanto isso vale hoje? Se você consegue 10% ao ano numa aplicação segura, vale o mesmo que R$ 1.000 hoje, porque R$ 1.000 aplicados virariam R$ 1.100. Esses R$ 1.000 são o valor presente.",
      "Valor presente é quanto vale hoje um dinheiro que só vai chegar no futuro. Você acha descontando o valor futuro pelos juros do período. É o caminho inverso dos juros compostos.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A ideia de fundo é que dinheiro hoje vale mais que o mesmo dinheiro amanhã. Hoje você pode aplicar, gastar ou se proteger de imprevistos. Amanhã, há a espera, a inflação e o risco de não receber.",
          "Para trazer um valor do futuro a hoje, divide-se pelo crescimento que o dinheiro teria no período. Quanto mais longe o pagamento e mais alta a taxa, menos ele vale hoje. R$ 1.000 daqui a 10 anos, a 10% ao ano, valem perto de R$ 386 hoje. A 5%, perto de R$ 614.",
          "Quando há vários pagamentos, como num título com cupons ou num aluguel, traz-se cada um a valor de hoje e somam-se todos.",
        ],
      },
      {
        titulo: "A taxa de desconto",
        paragrafos: [
          "A taxa usada para trazer o futuro a hoje se chama taxa de desconto. Ela embute o juro sem risco, a inflação esperada e um prêmio pelo risco de o dinheiro não chegar inteiro. Um fluxo garantido pelo governo é descontado a uma taxa menor que o lucro incerto de uma empresa nova.",
          "Escolher a taxa é a parte mais delicada de qualquer avaliação. Pequenas mudanças nela mudam muito o resultado, sobretudo em fluxos longos.",
        ],
      },
      {
        titulo: "Onde aparece",
        paragrafos: [
          "É a base de quase toda conta de finanças. O preço de um título é o valor presente dos cupons e do principal. O valor de uma empresa, numa avaliação por fluxo de caixa descontado, é o valor presente dos lucros futuros. Quanto vale uma aposentadoria, quanto vale um imóvel alugado, quanto vale um contrato: tudo passa por aqui.",
          "Também explica um fenômeno que confunde muita gente: quando os juros sobem, títulos longos e ações de empresas que vão lucrar só lá na frente caem mais. O dinheiro de amanhã passa a valer menos hoje, e quanto mais longe ele está, mais o efeito pesa. Foi o que aconteceu em 2022, quando a alta de juros nos Estados Unidos derrubou ao mesmo tempo títulos longos e ações de tecnologia.",
        ],
      },
    ],
    exemplo: "R$ 120 mil por ano durante 25 anos, trazidos a valor de hoje com juro de 5% ao ano, valem cerca de R$ 1,7 milhão. É a conta do capital humano da aula 1: a renda futura do seu trabalho é, provavelmente, o maior ativo que você tem, e ele está todo em reais.",
    naPratica: "Valor presente explica por que títulos longos e ações de empresas que vão lucrar só no futuro caem mais quando os juros sobem. E, aplicado à sua renda futura, mostra quanto do seu patrimônio de verdade já está amarrado ao Brasil antes de qualquer investimento. Para quem pensa em dolarizar, esse é um ponto de partida: o salário em reais já é uma enorme posição em reais.",
    relacionados: [
      "juros-compostos",
      "fluxo-de-caixa-descontado",
      "duration",
      "capital-humano",
      "marcacao-a-mercado",
      "custo-de-oportunidade",
      "yield",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "9:00" },
    ],
  },
  {
    slug: "juro-nominal",
    termo: "Juro nominal",
    categoria: "Juros e inflação",
    apelidos: ["juros nominais", "taxa nominal", "retorno nominal", "retornos nominais"],
    resumo: "A taxa que aparece no contrato ou no extrato, sem descontar a inflação. Diz quanto o número cresceu, não quanto o seu poder de compra cresceu.",
    texto: [
      "Um CDB promete 12% ao ano. Esses 12% são o juro nominal: em reais, R$ 100 viram R$ 112. Se a inflação do ano foi de 5%, porém, as coisas que você compra também ficaram mais caras, e o ganho de verdade foi menor, perto de 6,7%.",
      "Juro nominal é a taxa que aparece no contrato ou no extrato, sem descontar a inflação. Diz quanto o número cresceu, não quanto o seu poder de compra cresceu.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Quase toda taxa divulgada é nominal: Selic, CDI, poupança, cupom de título prefixado, rendimento de fundo, juro do financiamento. Para saber o ganho real, é preciso descontar a inflação do período, de preferência dividindo, e não subtraindo.",
          "Uma taxa nominal pode ser lida como a soma de três peças: a remuneração pela espera, a compensação pela inflação esperada e um prêmio pelo risco. Num país de inflação alta e risco alto, as duas últimas peças inflam a taxa nominal, mesmo que o ganho real seja modesto.",
        ],
      },
      {
        titulo: "A ilusão monetária",
        paragrafos: [
          "Economistas chamam de ilusão monetária a tendência de olhar o número e não o poder de compra. Um aumento de salário de 8% num ano de inflação de 10% parece ganho, mas é perda. Um imóvel que valorizou 50% em dez anos, com a inflação somando 70%, ficou mais barato em termos reais.",
          "No Brasil dos anos de hiperinflação, a ilusão era levada ao extremo. Aplicações que rendiam milhares por cento ao ano pareciam fortunas, e muitas vezes perdiam para os preços.",
        ],
      },
      {
        titulo: "Brasil e Estados Unidos",
        paragrafos: [
          "Ao comparar países, o juro nominal engana ainda mais. Uma Selic de 13,75% e um juro americano perto de 4% vêm de inflações, moedas e riscos diferentes. Parte da diferença compensa a inflação mais alta daqui, e parte paga o risco de emprestar ao Brasil.",
          "Por isso, olhar só a taxa nominal leva a conclusões apressadas, como a de que ficar em reais é sempre melhor porque o número é maior. O que importa é o ganho real e o risco de cada lado, e, para comparar moedas, o que acontece com o câmbio.",
        ],
      },
    ],
    exemplo: "Hipotético: em 1993, uma aplicação que rendesse 2.000% no ano parecia um sucesso. Com inflação de 2.477%, quem aplicou terminou o ano mais pobre: o dinheiro multiplicou por 21, mas os preços multiplicaram por quase 26. A perda real foi perto de 19%.",
    naPratica: "Ao comparar Brasil e exterior, não compare só taxas nominais. Uma Selic de 13,75% e um juro americano de 4% vêm de inflações e riscos diferentes. O que importa é o ganho real, medido contra a inflação da moeda em que você vai gastar, e o risco de cada lado. Para a parte do patrimônio pensada para gastos em reais, a régua é o IPCA; para gastos em dólar, o CPI americano.",
    relacionados: ["juro-real", "inflacao", "selic", "cdi", "ipca", "prefixado"],
  },
  {
    slug: "juro-real",
    termo: "Juro real",
    categoria: "Juros e inflação",
    apelidos: [
      "juros reais",
      "juro real negativo",
      "conta de Fisher",
      "equação de Fisher",
      "juro já descontada a inflação",
      "ganho real",
    ],
    resumo: "O juro que sobra depois de descontar a inflação: quanto o seu dinheiro passa a comprar a mais. A conta certa divide, em vez de subtrair.",
    texto: [
      "Uma aplicação paga 21% num ano em que a inflação foi de 10%. Quanto você ganhou de verdade? A conta de cabeça diz 11%. A certa diz 10%: no fim do ano você tem 121 para comprar o que agora custa 110, e 121 é 10% a mais que 110.",
      "Juro real é isso: o juro que sobra depois de descontar a inflação, ou seja, quanto o seu dinheiro passa a comprar a mais. É a medida que importa para quem quer saber se ficou mais rico.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A conta certa divide, em vez de subtrair. Em palavras: o quanto o dinheiro cresceu, dividido pelo quanto os preços cresceram. Com inflação baixa, a subtração quase acerta. Com inflação alta, a diferença cresce, e pode mudar a conclusão.",
          "A ideia leva o nome do economista americano Irving Fisher, que a organizou no começo do século 20. Ele também observou que o juro nominal tende a subir junto com a inflação esperada, porque quem empresta quer ser compensado.",
          "O juro real pode ser negativo: quando a aplicação rende menos que a inflação, você perde poder de compra mesmo vendo o saldo crescer.",
        ],
      },
      {
        titulo: "Antes e depois",
        paragrafos: [
          "Há dois jeitos de medir. O juro real passado, ou ex post, compara o que a aplicação rendeu com a inflação que de fato aconteceu. O juro real esperado, ou ex ante, compara a taxa de hoje com a inflação que o mercado espera para frente.",
          "O mercado brasileiro oferece uma medida direta do segundo: a taxa dos títulos do Tesouro atrelados ao IPCA. Quem compra um Tesouro IPCA+ a 6% está travando 6% de juro real por ano, se levar até o vencimento. Nos Estados Unidos, o equivalente é a taxa dos TIPS.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O juro real brasileiro está entre os mais altos do mundo há décadas. Nos anos 2000 e 2010, passou muitas vezes de 5% ao ano, enquanto nos países ricos ficava perto de zero ou negativo, sobretudo na década do dinheiro barato depois de 2008.",
          "Esse juro alto é a remuneração pelo risco do país: inflação mais incerta, contas públicas frágeis e histórico de calotes e congelamentos. Não é um ganho de graça, e pode virar perda quando a inflação surpreende para cima.",
          "Na pandemia, o Brasil experimentou o outro extremo. Com a Selic em 2% e a inflação subindo, o juro real ficou negativo, e quem estava no pós-fixado perdeu poder de compra.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Comparar o juro real de um país com o nominal de outro. Ou medir uma aplicação em dólar contra a inflação brasileira sem considerar o câmbio. Juro real só faz sentido contra a inflação da moeda em que você mede o resultado.",
          "Esquecer o imposto. O imposto de renda incide sobre o ganho nominal, inclusive sobre a parte que só repôs a inflação. Com inflação alta, o juro real depois do imposto pode ser bem menor do que parece, e às vezes negativo.",
          "Achar que juro real alto é sempre bom para o investidor. Ele é bom para quem empresta e já está aplicado, mas encarece o crédito, freia a economia e pesa na dívida pública, o que acaba voltando para o risco do próprio país.",
        ],
      },
    ],
    exemplo: "Com Selic de 14,25% e inflação de 4,5%, o juro real era de 9,33% ao ano, e não os 9,75% da subtração. Na pandemia, Selic de 2% com inflação de 4,5% dava juro real negativo, de 2,4% ao ano. Hipotético: R$ 100 mil aplicados nessas condições terminariam o ano com R$ 102 mil, que comprariam o que R$ 97,6 mil compravam antes.",
    naPratica: "O juro real brasileiro está entre os mais altos do mundo, e é ele que segura muita gente em reais. Mas ele é a remuneração pelo risco do país, não um ganho de graça. A mesma conta vale para o dólar parado: se ele sobe menos que a inflação daqui, você perde poder de compra em reais. Ao comparar caminhos, compare ganhos reais na moeda em que você vai gastar, e lembre que o juro real alto de hoje não garante o de amanhã.",
    relacionados: [
      "juro-nominal",
      "inflacao",
      "selic",
      "tesouro-ipca",
      "carry-trade",
      "tips",
      "ipca",
      "afrouxamento-quantitativo",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "1:03:56" },
      { modulo: 1, aula: 1, tempo: "19:11" },
    ],
  },
  {
    slug: "inflacao",
    termo: "Inflação",
    categoria: "Juros e inflação",
    apelidos: [
      "inflações",
      "alta dos preços",
      "alta de preços",
      "inflação brasileira",
      "inflação alta",
    ],
    resumo: "A alta generalizada dos preços ao longo do tempo. Cada ponto de inflação é um pedaço do poder de compra do seu dinheiro que vai embora.",
    texto: [
      "Com R$ 100 você enchia um carrinho de supermercado. Um ano depois, o mesmo carrinho custa R$ 105. Os preços subiram 5%: isso é inflação. Não é um produto ficando caro, é o conjunto dos preços subindo ao mesmo tempo.",
      "Inflação é a alta generalizada dos preços ao longo do tempo. Visto do outro lado, é a perda de valor do dinheiro: cada ponto de inflação é um pedaço do poder de compra que vai embora.",
    ],
    secoes: [
      {
        titulo: "Como se mede",
        paragrafos: [
          "A inflação é medida por índices que acompanham o preço de uma cesta de produtos e serviços, com pesos parecidos com os do orçamento de uma família típica. No Brasil, o índice oficial é o IPCA, do IBGE. Nos Estados Unidos, o CPI, do Bureau of Labor Statistics. Há também os IGPs, da FGV, que pesam mais os preços no atacado.",
          "Um pouco de inflação é normal numa economia que cresce. O problema é quando ela é alta, imprevisível ou fora de controle: as pessoas param de planejar, contratos encurtam, e quem não tem como se proteger, geralmente os mais pobres, perde mais.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "As causas clássicas são três. Demanda maior que a capacidade de produzir: todo mundo quer comprar, e os preços sobem. Choques de custo: o petróleo dispara, o câmbio desvaloriza, uma seca encarece alimentos. E excesso de moeda: quando o governo financia gastos imprimindo dinheiro, a moeda perde valor.",
          "No Brasil, havia uma quarta: a inércia. Com contratos, salários e aluguéis reajustados pela inflação passada, a inflação de ontem virava a de hoje, mesmo sem nova causa. Foi esse ciclo que o Plano Real quebrou com a URV.",
        ],
      },
      {
        titulo: "O Brasil conhece o extremo",
        paragrafos: [
          "Entre o fim de 1979 e junho de 1994, os preços subiram cerca de 11 trilhões por cento pelo IPCA. Em 1993, último ano inteiro antes do real, a inflação foi de 2.477%, e os preços dobravam a cada dois meses e meio. Entre 1986 e 1991, cinco planos econômicos tentaram resolver o problema antes do Real, com congelamentos, troca de moeda e até o bloqueio das aplicações no Plano Collor.",
          "Desde 1999, o Banco Central trabalha com metas de inflação. A meta atual é de 3% ao ano, medida de forma contínua, com tolerância de 1,5 ponto para cima ou para baixo. O Fed persegue 2% ao ano nos Estados Unidos.",
        ],
      },
      {
        titulo: "Lá fora também",
        paragrafos: [
          "Os países ricos tiveram sua década de inflação alta nos anos 1970, com o choque do petróleo. Nos Estados Unidos, ela chegou perto de 15% ao ano em 1980, e só cedeu quando o Fed subiu os juros para perto de 20%. Em 2022, depois da pandemia, a inflação americana voltou a passar de 9% ao ano, o maior nível em quatro décadas.",
          "Por isso, nem o dólar é uma reserva de valor perfeita. Ele perde menos que o real, mas também perde.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Inflação caindo não quer dizer preços caindo. Se a inflação passa de 10% para 4%, os preços continuam subindo, só que mais devagar. Preços caindo de forma generalizada é outra coisa, a deflação, rara e quase sempre sinal de economia em apuros.",
          "E a inflação oficial é uma média. A sua inflação pessoal depende do que você consome: quem gasta mais com escola, plano de saúde ou aluguel costuma sentir números diferentes dos do índice. Para planejar, vale pensar em quais preços pesam no seu orçamento futuro, inclusive os que seguem o dólar.",
        ],
      },
    ],
    exemplo: "Pense em R$ 1 em julho de 1994: para comprar a mesma coisa em 2026, você precisa de cerca de R$ 8,30. Nos Estados Unidos, os preços subiram 126% no mesmo período: uma nota de dólar guardada desde 1994 compra menos da metade do que comprava. Hipotético: quem guardou R$ 10 mil em notas desde então tem hoje o poder de compra de uns R$ 1.200 daquela época.",
    naPratica: "Nenhuma moeda parada escapa da inflação, nem o dólar. Por isso dolarizar, no sentido do curso, é ter ativos que geram renda e acompanham os preços, e não dinheiro guardado. E por isso a régua de qualquer investimento é o ganho acima da inflação da moeda em que você vai gastar: IPCA para gastos em reais, CPI para gastos em dólar. Uma carteira que vence as duas, em média, preserva o poder de compra dos dois lados.",
    relacionados: [
      "ipca",
      "cpi",
      "poder-de-compra",
      "juro-real",
      "meta-de-inflacao",
      "plano-real",
      "hiperinflacao",
      "inflacao-inercial",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "9:48" },
      { modulo: 0, aula: 2, tempo: "0:19" },
      { modulo: 1, aula: 1, tempo: "32:30" },
      { modulo: 1, aula: 3, tempo: "17:57" },
    ],
  },
  {
    slug: "poder-de-compra",
    termo: "Poder de compra",
    categoria: "Juros e inflação",
    apelidos: [
      "perda de poder de compra",
      "taxa de desvalorização da moeda",
      "desvalorização da moeda",
      "perda do poder de compra",
    ],
    resumo: "Quanto o seu dinheiro consegue comprar. Quando os preços dobram, a inflação foi de 100%, mas o dinheiro perdeu metade do poder de compra, e não 100%.",
    texto: [
      "Imagine que os preços dobraram. A inflação foi de 100%, mas o seu dinheiro não perdeu 100%: perdeu metade, porque agora compra a metade do que comprava. Essa perda tem nome, taxa de desvalorização da moeda, e é a forma mais honesta de medir o estrago da inflação.",
      "Poder de compra é quanto o seu dinheiro consegue comprar. Não é o número no extrato, é a cesta de coisas que ele paga. Quando os preços sobem mais rápido que o seu dinheiro, você fica mais pobre, mesmo vendo o saldo crescer.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A perda de poder de compra é sempre menor que a inflação e nunca chega a 100%, mas se aproxima disso bem depressa quando a inflação dispara. Uma inflação de 10% tira cerca de 9% do poder de compra. Uma de 100%, metade. Uma de 733%, como a acumulada no Brasil desde o lançamento do real, 88%.",
          "A conta é a mesma do câmbio: quando o dólar dobra, o real perde metade do valor em dólar. Em palavras, a perda é a alta dos preços dividida pelo novo nível de preços.",
        ],
      },
      {
        titulo: "Poder de compra em duas moedas",
        paragrafos: [
          "Para quem vive no Brasil, o poder de compra tem duas faces. Uma é a interna: quanto o seu dinheiro compra aqui, medido pelo IPCA. A outra é a externa: quanto ele compra lá fora, ou de produtos com preço global, medido pelo câmbio e pela inflação de lá.",
          "As duas podem andar separadas por anos. Entre 2003 e 2011, o real se fortaleceu muito, e o brasileiro viajava e importava barato, mesmo com inflação aqui. Entre 2014 e 2020, o contrário: o poder de compra externo despencou, mesmo em anos de inflação comportada.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Achar que dinheiro parado está seguro. Ele não oscila no extrato, mas perde poder de compra todos os dias, em silêncio. Em reais, a perda é rápida; em dólar, mais lenta, mas existe.",
          "Comparar valores de épocas diferentes sem corrigir. Um salário de R$ 5 mil em 2010 e um de R$ 5 mil em 2026 não valem o mesmo. Para comparar, é preciso trazer os dois para preços de uma mesma data.",
          "Medir o patrimônio só em reais. Se o real perde valor contra o dólar, o seu patrimônio encolhe em tudo o que tem preço global, mesmo que o extrato em reais mostre alta.",
        ],
      },
    ],
    exemplo: "Em março de 1990, o pior mês do IPCA, a inflação de 82% levou 45% do poder de compra de quem tinha dinheiro parado. Em 1993, com 2.477% no ano, a perda foi de 96%: quem começou o ano com o equivalente a um carro terminou com o equivalente a uma moto usada.",
    naPratica: "A mesma lógica vale para o câmbio: se o dólar dobra, o seu patrimônio em reais passa a valer metade em dólar. Poder de compra é a medida que interessa, em qualquer moeda. Para quem pensa em dolarizar, a pergunta útil é: o que eu vou comprar com esse dinheiro, e em que moeda esses preços são formados? Proteger o poder de compra é casar o patrimônio com os gastos futuros.",
    relacionados: [
      "inflacao",
      "desvalorizacao-cambial",
      "juro-real",
      "funcoes-da-moeda",
      "ipca",
      "paridade-do-poder-de-compra",
      "hiperinflacao",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "1:57" },
    ],
  },
  {
    slug: "ipca",
    termo: "IPCA",
    categoria: "Juros e inflação",
    apelidos: [
      "Índice Nacional de Preços ao Consumidor Amplo",
      "índice oficial de inflação",
      "inflação oficial",
      "IPCA+",
    ],
    resumo: "O índice oficial de inflação do Brasil, calculado pelo IBGE todo mês. É a referência da meta de inflação e de títulos como o Tesouro IPCA+.",
    texto: [
      "Todo mês, pesquisadores do IBGE anotam preços de alimentos, aluguel, transporte, saúde, educação, roupas e centenas de outros itens em várias capitais e regiões metropolitanas do país. No fim, calculam quanto a cesta toda ficou mais cara. O resultado é o IPCA, Índice Nacional de Preços ao Consumidor Amplo.",
      "É o índice oficial de inflação do Brasil. Serve de referência para a meta de inflação do Banco Central, para os títulos do Tesouro IPCA+ e para boa parte dos reajustes de contratos.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A cesta representa o consumo de famílias com renda entre 1 e 40 salários mínimos, o que cobre a grande maioria da população urbana. Os itens são agrupados em nove grupos, como alimentação e bebidas, habitação, transportes, saúde e educação, e cada um tem um peso proporcional ao que as famílias gastam com ele.",
          "Os pesos vêm de uma pesquisa grande do próprio IBGE sobre o orçamento das famílias, refeita de tempos em tempos para acompanhar mudanças de hábito: gastos com celular e internet, por exemplo, pesam muito mais hoje do que há trinta anos.",
          "O IBGE divulga o IPCA do mês por volta do dia 10 do mês seguinte, e uma prévia, o IPCA-15, no meio do mês.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "O índice existe desde o fim de 1979. Atravessou a hiperinflação, os planos econômicos e a troca de moedas, o que faz dele a série mais longa e consistente para medir a inflação brasileira.",
          "Desde 1999, é o índice da meta de inflação. Hoje a meta é de 3% ao ano, perseguida de forma contínua, com tolerância de 1,5 ponto para cima ou para baixo. Se o IPCA acumulado em 12 meses fica fora da faixa por seis meses seguidos, o Banco Central precisa explicar publicamente por quê.",
        ],
      },
      {
        titulo: "Os irmãos do IPCA",
        paragrafos: [
          "O IBGE calcula também o INPC, com a mesma metodologia mas focado em famílias de 1 a 5 salários mínimos, usado em reajustes do salário mínimo e de benefícios. A FGV calcula os IGPs, que pesam mais os preços no atacado e reagem mais ao dólar.",
          "Nos Estados Unidos, o par do IPCA é o CPI. Comparar os dois ao longo do tempo é o que permite medir quanto da alta do dólar foi diferença de inflação.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Como toda média, o IPCA pode não bater com a sua inflação pessoal. Quem gasta mais com saúde e educação, por exemplo, costuma sentir preços que sobem acima do índice. E itens que seguem o dólar, como eletrônicos e passagens aéreas, pesam pouco na cesta média, mas podem pesar muito no seu orçamento.",
        ],
      },
    ],
    exemplo: "Um título que paga IPCA + 6% ao ano, num ano de IPCA de 4%, rende perto de 10,2% nominal: os 4% repõem os preços e os 6% são o ganho real. Hipotético: R$ 100 mil viram R$ 110.240 em um ano, antes do imposto.",
    naPratica: "O IPCA é a régua para saber se o seu patrimônio em reais está ganhando ou perdendo poder de compra aqui. Para comparar com o dólar, o par é o CPI americano. Para quem planeja gastos futuros nas duas moedas, faz sentido acompanhar as duas réguas: uma carteira que vence o IPCA protege o consumo no Brasil, mas não necessariamente o que você vai pagar em dólar.",
    relacionados: [
      "inflacao",
      "meta-de-inflacao",
      "tesouro-ipca",
      "igp-m",
      "cpi",
      "poder-de-compra",
      "juro-real",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "9:48" },
      { modulo: 0, aula: 2, tempo: "1:10" },
    ],
  },
  {
    slug: "igp-m",
    termo: "IGP-M",
    categoria: "Juros e inflação",
    apelidos: ["IGP-DI", "Índice Geral de Preços", "IGPs", "índice do aluguel"],
    resumo: "Índice de inflação da FGV, muito usado para reajustar aluguéis e contratos. Pesa bastante os preços no atacado, muitos deles cotados em dólar.",
    texto: [
      "Se você mora de aluguel, provavelmente já viu o contrato ser reajustado pelo IGP-M. Em 2020, muita gente levou um susto: o índice subiu mais de 23% no ano, enquanto a inflação oficial ficou perto de 4,5%. O aluguel subiu cinco vezes mais que os preços do supermercado.",
      "O IGP-M, Índice Geral de Preços do Mercado, é um índice de inflação calculado pela Fundação Getulio Vargas. Ele pesa bastante os preços no atacado, muitos deles cotados em dólar, e por isso reage ao câmbio muito mais que o IPCA.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O IGP-M mistura três índices. O de preços ao produtor, com peso de 60%, que acompanha matérias-primas e produtos no atacado. O de preços ao consumidor, com 30%. E o da construção civil, com 10%.",
          "Como o atacado tem muitas commodities, como minério, soja, milho, carne e petróleo, cotadas no mercado internacional, o índice sobe muito quando o dólar dispara ou quando esses preços sobem lá fora, e pode cair quando eles recuam. Em anos de câmbio agitado, ele se descola bastante do IPCA.",
          "O IGP-DI é o irmão dele, com a mesma composição e outro período de coleta: o mês cheio, enquanto o IGP-M vai do dia 21 de um mês ao dia 20 do seguinte, para sair antes.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "Os índices gerais de preços da FGV são mais antigos que o IPCA: o IGP-DI existe desde os anos 1940. O IGP-M foi criado em 1989, a pedido do mercado financeiro, que queria um índice divulgado mais cedo para corrigir aplicações e contratos.",
          "Durante a alta inflação, os IGPs serviram de indexador para quase tudo, de aluguéis a tarifas de energia e telefonia. Muitos desses contratos atravessaram décadas, e o hábito ficou.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2020 e 2021, com o dólar alto e as commodities em disparada, o IGP-M acumulou mais de 40% em dois anos. Inquilinos passaram a negociar a troca do índice pelo IPCA, e muitos contratos novos já nasceram com o IPCA. Em 2023, com commodities caindo, o IGP-M ficou negativo, e quem tinha aluguel atrelado a ele teve redução.",
        ],
      },
    ],
    exemplo: "Em 2020, o IGP-M subiu 23,1% e o IPCA, 4,5%. Hipotético: um aluguel de R$ 3.000 reajustado pelo IGP-M foi a perto de R$ 3.690; pelo IPCA, iria a R$ 3.135. A diferença, de mais de R$ 500 por mês, veio quase toda do dólar e das commodities.",
    naPratica: "O IGP-M mostra como o dólar contamina preços no Brasil, de aluguel a matéria-prima, e depois chega ao consumidor. É mais uma porta pela qual o câmbio entra na sua vida, mesmo sem nenhum investimento lá fora. Quem acha que não tem exposição ao dólar porque não viaja nem importa costuma esquecer essas portas.",
    relacionados: [
      "ipca",
      "inflacao",
      "cambio",
      "desvalorizacao-cambial",
      "correcao-monetaria",
      "superciclo-de-commodities",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "9:48" },
    ],
  },
  {
    slug: "cpi",
    termo: "CPI",
    categoria: "Juros e inflação",
    apelidos: [
      "inflação americana",
      "inflação ao consumidor, EUA",
      "CPI-U",
      "PCE",
      "inflação nos Estados Unidos",
    ],
    resumo: "O índice de preços ao consumidor dos Estados Unidos, calculado pelo Bureau of Labor Statistics. É o par do IPCA do lado de lá.",
    texto: [
      "O Consumer Price Index, ou CPI, faz nos Estados Unidos o que o IPCA faz aqui: mede quanto ficou mais cara uma cesta de consumo. É divulgado todo mês pelo Bureau of Labor Statistics, o órgão de estatísticas do trabalho do governo americano.",
      "A divulgação do CPI é um dos dias mais tensos do mercado mundial. Um número acima do esperado pode mexer com os juros americanos, com o dólar e com as bolsas do mundo inteiro, inclusive a brasileira, em minutos.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O índice mais citado é o CPI-U, que cobre os consumidores urbanos, a grande maioria da população. A cesta inclui moradia, alimentação, transporte, saúde, educação e lazer. Moradia pesa muito, mais de um terço do índice, o que faz o custo de aluguel ser decisivo para o resultado.",
          "Os analistas olham também o núcleo, que exclui alimentos e energia, preços que oscilam muito por motivos passageiros. O núcleo ajuda a ver se a inflação está espalhada pela economia ou concentrada em choques.",
        ],
      },
      {
        titulo: "CPI e PCE",
        paragrafos: [
          "O Fed acompanha de perto outro índice, o PCE, calculado por outro órgão do governo, que mede os gastos de consumo de forma mais ampla, incluindo o que é pago em nome das famílias, como parte da saúde. É pelo PCE que o Fed persegue a meta de 2% ao ano.",
          "Os dois costumam andar juntos, com o CPI um pouco acima. Para o investidor, o CPI tem uma importância extra: é ele que corrige os TIPS, os títulos do Tesouro americano protegidos contra a inflação.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Os americanos também tiveram sua década de inflação alta. Perto de 1980, o CPI subia perto de 15% ao ano, e o Fed de Paul Volcker levou os juros para perto de 20% para quebrar o ciclo, ao custo de uma recessão dura.",
          "Em junho de 2022, depois da pandemia, o CPI chegou a 9,1% em 12 meses, o maior nível em quatro décadas. O Fed respondeu com a alta de juros mais rápida em gerações, e títulos e ações caíram juntos naquele ano.",
        ],
      },
    ],
    exemplo: "De julho de 1994 a agosto de 2026, os preços nos Estados Unidos subiram 126%, contra cerca de 733% no Brasil. É essa diferença que a paridade do poder de compra usa para explicar parte da alta do dólar. Hipotético: US$ 100 guardados desde 1994 compram hoje o que US$ 44 compravam então.",
    naPratica: "O dólar também perde valor. Um investimento em dólar precisa render acima do CPI para preservar o poder de compra lá fora, assim como um em reais precisa vencer o IPCA. Para quem tem gastos futuros em dólar, como estudo ou moradia no exterior, o CPI é a régua certa, e os TIPS são o instrumento que se protege dele diretamente.",
    relacionados: [
      "inflacao",
      "ipca",
      "fed",
      "tips",
      "paridade-do-poder-de-compra",
      "fed-funds",
      "poder-de-compra",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "12:31" },
      { modulo: 1, aula: 1, tempo: "16:16" },
    ],
  },
  {
    slug: "selic",
    termo: "Selic",
    categoria: "Juros e inflação",
    apelidos: [
      "taxa Selic",
      "meta Selic",
      "meta da Selic",
      "juro básico",
      "juros básicos",
      "taxa básica de juros",
    ],
    resumo: "A taxa básica de juros do Brasil, definida pelo Copom. Serve de referência para quase todo o resto: CDI, poupança, crédito e títulos pós-fixados.",
    texto: [
      "Quando o Banco Central quer esfriar a inflação, sobe a Selic; quando quer estimular a economia, corta. Essa taxa é a peça mais importante do sistema financeiro brasileiro: a partir dela se formam o CDI, o rendimento da poupança, o custo do crédito e o preço de boa parte dos títulos.",
      "A Selic é a taxa básica de juros do Brasil. Tecnicamente, é a taxa média dos empréstimos de um dia entre bancos, garantidos por títulos públicos e registrados no sistema que dá nome a ela, o Sistema Especial de Liquidação e de Custódia, criado em 1979.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O Copom decide uma meta para a Selic em oito reuniões por ano. A partir daí, a mesa de operações do Banco Central compra e vende títulos públicos no mercado, todos os dias, para que a taxa efetiva das operações de um dia fique colada na meta. Na prática, ela fica um pouquinho abaixo.",
          "Quando a Selic sobe, o crédito fica mais caro, as pessoas e empresas consomem e investem menos, e a pressão sobre os preços cede, com alguns meses de atraso. Também tende a atrair dinheiro estrangeiro e segurar o dólar. Quando cai, acontece o contrário.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "A Selic brasileira é historicamente alta. Chegou a 45% em março de 1999, logo depois da crise cambial. Caiu para a casa de um dígito só no fim dos anos 2000. Foi de 14,25% em 2015 e 2016 a 2% entre 2020 e 2021, a mínima da história. No ciclo seguinte, voltou a 13,75% e, depois, a 15% em 2025.",
          "Em 16 de setembro de 2026, o Copom cortou a taxa para 13,75% ao ano, num ciclo de cortes depois do pico de 15%. No mesmo dia, o Fed subiu o juro americano para a faixa de 3,75% a 4%.",
        ],
      },
      {
        titulo: "Por que é tão alta",
        paragrafos: [
          "Parte da resposta é a inflação, historicamente maior que a dos países ricos. Outra parte é o risco: dívida pública alta e de prazo curto, histórico de calotes, dúvidas recorrentes sobre as contas do governo. E parte é estrutural: crédito direcionado e subsidiado, que reduz o efeito da Selic e obriga o Banco Central a subi-la mais para fazer o mesmo efeito.",
          "Há também um círculo: como mais da metade da dívida pública segue a Selic, cada alta de juros pesa rápido nas contas do governo, o que alimenta a desconfiança que pede juros altos.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "A Selic é uma taxa nominal. Com inflação de 5%, uma Selic de 13,75% paga perto de 8% reais; com inflação de 10%, menos de 4%. O que mede o ganho de verdade é o juro real.",
          "E ela não fica parada. Quem decidiu que não precisava diversificar com a Selic a 14% em 2016 viu a taxa cair a 2% em 2020, e quem a ignorou em 2020 viu ela voltar a 13,75% em 2022. Planejar o patrimônio com a taxa do momento é planejar com um número que muda a cada 45 dias.",
        ],
      },
    ],
    exemplo: "Hipotético: com a Selic a 13,75%, um título pós-fixado que acompanha a taxa rende perto de 1,08% ao mês. R$ 100 mil viram cerca de R$ 113.750 em um ano, antes do imposto. É esse rendimento estável e alto que faz muita gente achar que não precisa olhar para fora.",
    naPratica: "A Selic alta não é um presente para o poupador: é o preço de carregar o risco do país. E o rendimento que ela paga é em reais. Comparar Selic com juro americano sem olhar câmbio e risco é comparar números que medem coisas diferentes. Para quem decide quanto dolarizar, a Selic é o custo de oportunidade a encarar com honestidade, lembrando que ela paga o risco de uma moeda e de um país, e não o elimina.",
    relacionados: [
      "copom",
      "cdi",
      "pos-fixado",
      "tesouro-selic",
      "paridade-de-juros",
      "fed-funds",
      "juro-real",
      "custo-de-oportunidade",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "24:45" },
      { modulo: 0, aula: 2, tempo: "1:11:50" },
      { modulo: 0, aula: 3, tempo: "5:48" },
    ],
  },
  {
    slug: "cdi",
    termo: "CDI",
    categoria: "Juros e inflação",
    apelidos: [
      "taxa DI",
      "certificado de depósito interbancário",
      "100% do CDI",
      "rendimento do CDI",
    ],
    resumo: "A taxa dos empréstimos de um dia entre bancos, calculada pela B3. Anda colada na Selic e é a régua com que o brasileiro mede quase todo investimento.",
    texto: [
      "Todo dia, bancos emprestam dinheiro uns aos outros por um dia. Quem fechou o dia com sobra empresta a quem fechou com falta. A taxa média dessas operações é o CDI, ou taxa DI, calculada pela B3.",
      "Na prática, o CDI anda colado na Selic, um pouquinho abaixo, e acompanha cada mudança dela. É a régua com que o brasileiro mede quase todo investimento: daí o hábito de dizer que um CDB paga 100% do CDI ou que um fundo rendeu 110% do CDI.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O nome vem do Certificado de Depósito Interbancário, o título usado nessas operações entre bancos. A B3 calcula a taxa a partir das operações registradas e a divulga todo dia útil, em termos anuais, numa base de 252 dias úteis.",
          "Um investimento que paga 100% do CDI rende, a cada dia útil, a taxa daquele dia. Um que paga 90% rende 90% dela. Um que paga CDI mais 2% rende a taxa do dia mais um adicional fixo, convertido para o dia.",
        ],
      },
      {
        titulo: "Por que virou régua",
        paragrafos: [
          "O CDI virou referência nos anos de inflação alta, quando quase todo investimento precisava se ajustar diariamente para não perder dos preços. A estrutura sobreviveu ao Plano Real: até hoje, a maior parte da renda fixa e dos fundos brasileiros é pós-fixada e se compara ao CDI.",
          "É uma régua prática para investimentos em reais de curto prazo, que rendem um pouco todo dia sem grandes sustos no extrato. Fundos multimercado, de crédito e até de ações costumam ser julgados por quanto bateram o CDI.",
        ],
      },
      {
        titulo: "O que a régua não mede",
        paragrafos: [
          "O CDI mede um rendimento em reais de curtíssimo prazo. Não mede o risco de crédito de quem emitiu o título, nem quanto o seu patrimônio vale em dólar, nem o que acontece com o poder de compra em períodos longos.",
          "Por isso, usá-lo para julgar um investimento em outra moeda, ou pensado para décadas, distorce a comparação. Uma carteira global pode passar anos atrás do CDI e, mesmo assim, cumprir o papel para o qual foi montada: diversificar a moeda e o país.",
        ],
      },
    ],
    exemplo: "De 2010 a 2025, o CDI acumulou 340%, ou 9,7% ao ano. No mesmo período, uma carteira americana 60/40, com 60% em ações e 40% em títulos, medida em reais, rendeu cerca de 15,2% ao ano, numa janela favorável ao dólar; em outras janelas, a vantagem foi bem menor ou inexistente. A escolha das datas muda a conclusão.",
    naPratica: "Comparar tudo com o CDI é natural para o brasileiro, mas pode enganar: ele é uma taxa de curto prazo em reais. Para uma parte do patrimônio pensada para décadas e para outra moeda, a régua precisa incluir o câmbio, a inflação de cada lado e o risco de cada caminho. Uma pergunta melhor que quanto rendeu contra o CDI é: o que essa parte da carteira faz quando o real e a economia brasileira vão mal?",
    relacionados: [
      "selic",
      "pos-fixado",
      "cdb",
      "fundo-di",
      "risco-de-credito",
      "carteira-60-40",
      "custo-de-oportunidade",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "17:57" },
      { modulo: 0, aula: 4, tempo: "22:22" },
      { modulo: 1, aula: 1, tempo: "16:16" },
    ],
  },
  {
    slug: "copom",
    termo: "Copom",
    categoria: "Juros e inflação",
    apelidos: ["Comitê de Política Monetária", "reunião do Copom", "reuniões do Copom"],
    resumo: "O comitê do Banco Central que decide a meta da Selic, em oito reuniões por ano. As decisões e as atas movem juros, câmbio e bolsa.",
    texto: [
      "A cada 45 dias, mais ou menos, o presidente e os diretores do Banco Central se reúnem por dois dias em Brasília. No fim da tarde do segundo dia, sai um comunicado curto com a nova meta da Selic. Em minutos, juros, dólar e bolsa reagem. É o Copom, Comitê de Política Monetária.",
      "O Copom é o comitê do Banco Central que decide a taxa básica de juros do país. Criado em 1996, ele se reúne oito vezes por ano, e cada decisão mexe com o rendimento de quase toda aplicação em reais.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Votam o presidente e os oito diretores do Banco Central. No primeiro dia, técnicos apresentam a situação da economia: inflação, expectativas, atividade, emprego, crédito, câmbio, contas públicas e o cenário lá fora. No segundo, os membros discutem e votam a meta.",
          "O comunicado sai logo depois. Na terça-feira seguinte, vem a ata, mais longa, lida linha por linha pelo mercado em busca de pistas sobre os próximos passos. Uma palavra trocada de uma ata para outra pode mover as taxas de juros futuras.",
          "Desde 2021, o Banco Central tem autonomia formal: presidente e diretores têm mandatos fixos, que não coincidem com o do presidente da República. A ideia é proteger as decisões de juros de pressões de curto prazo.",
        ],
      },
      {
        titulo: "O que o Copom persegue",
        paragrafos: [
          "O objetivo principal é a meta de inflação, definida pelo Conselho Monetário Nacional. Hoje ela é de 3% ao ano, medida pelo IPCA de forma contínua, com tolerância de 1,5 ponto. Como os juros levam de seis a dezoito meses para fazer efeito pleno, o Copom decide olhando a inflação esperada para a frente, e não a de hoje.",
          "Por isso, as expectativas importam tanto. O Banco Central pesquisa toda semana o que economistas esperam para inflação, juros e câmbio, no boletim Focus. Se as expectativas se afastam da meta, o comitê tende a apertar.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2020, com a inflação medida em queda no auge do isolamento, o Copom levou a Selic de 4,5% a 2% em agosto, a mínima da história. O juro real ficou negativo e o dinheiro estrangeiro de curto prazo saiu. No auge do pânico, em maio, o dólar, que começara o ano a R$ 4,02, chegou a R$ 5,94.",
          "A inflação voltou mais forte do que o esperado. A partir de março de 2021, o comitê iniciou um dos ciclos de alta mais rápidos de sua história, que levou a Selic a 13,75% em menos de um ano e meio.",
        ],
      },
    ],
    exemplo: "Em 16 de setembro de 2026, o Copom cortou a Selic de 14% para 13,75% ao ano, por unanimidade. Hipotético: para quem tem R$ 500 mil num título pós-fixado, um corte de 0,25 ponto significa perto de R$ 1.250 a menos de rendimento bruto por ano. Para quem tem um prefixado longo, o mesmo corte pode valorizar o título no mercado.",
    naPratica: "Uma decisão do Copom mexe de uma vez no rendimento do pós-fixado, no preço dos títulos prefixados, no câmbio e na bolsa. É um exemplo de como uma única caneta afeta todo o patrimônio que está em reais. Ter parte do patrimônio sujeita a outros bancos centrais, com outras moedas e outros ciclos, reduz a dependência de uma única decisão.",
    relacionados: [
      "selic",
      "meta-de-inflacao",
      "fed",
      "cdi",
      "banco-central",
      "independencia-do-banco-central",
      "juro-real",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "1:11:50" },
    ],
  },
  {
    slug: "fed",
    termo: "Federal Reserve",
    sigla: "Fed",
    categoria: "Juros e inflação",
    apelidos: [
      "banco central dos Estados Unidos",
      "banco central americano",
      "FOMC",
      "juros do Fed",
    ],
    resumo: "O banco central dos Estados Unidos. Define o juro básico americano e, com isso, mexe no custo do dinheiro do mundo inteiro.",
    texto: [
      "Quando o presidente do banco central americano fala, o mercado do mundo inteiro para para ouvir. Uma frase sobre juros pode mexer com o dólar, com o preço do petróleo, com a bolsa de São Paulo e com o custo da dívida de dezenas de países no mesmo dia.",
      "O Federal Reserve, ou Fed, é o banco central dos Estados Unidos. Define o juro básico americano e, como o dólar é a moeda de reserva do mundo, mexe com o custo do dinheiro em todo lugar.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O Fed foi criado em 1913, depois de uma série de pânicos bancários que deixaram claro que o país precisava de um emprestador de última instância. A estrutura é peculiar: um conselho em Washington, com sete governadores indicados pelo presidente e aprovados pelo Senado, e doze bancos regionais espalhados pelo país.",
          "Quem decide os juros é o FOMC, Comitê Federal de Mercado Aberto, com 12 votantes: os sete governadores, o presidente do Fed de Nova York e quatro presidentes de bancos regionais que se revezam. O comitê se reúne oito vezes por ano.",
        ],
      },
      {
        titulo: "O mandato duplo",
        paragrafos: [
          "Diferente de muitos bancos centrais, o Fed tem por lei um mandato duplo: buscar o máximo emprego e preços estáveis. Na prática, preços estáveis significam inflação de 2% ao ano, medida pelo índice PCE.",
          "Os dois objetivos às vezes puxam para lados opostos. Juros altos ajudam a controlar a inflação, mas podem custar empregos. Boa parte do debate sobre o Fed é sobre qual dos dois deve pesar mais em cada momento.",
        ],
      },
      {
        titulo: "Dois episódios",
        paragrafos: [
          "No começo dos anos 1980, Paul Volcker levou os juros para perto de 20% para matar a inflação. Conseguiu, ao custo de uma recessão dura nos Estados Unidos. A conta chegou à América Latina, endividada em dólar a juros flutuantes: o México quebrou em 1982, e o Brasil entrou na crise da dívida externa que marcou a década perdida.",
          "Em 2008, Ben Bernanke cortou os juros a quase zero e passou a comprar títulos em massa, o afrouxamento quantitativo. Em 2020, o Fed repetiu a dose em escala ainda maior. Em 2022, com a inflação acima de 9%, fez a alta de juros mais rápida em décadas.",
        ],
      },
      {
        titulo: "O alcance do Fed",
        paragrafos: [
          "Juro americano mais alto atrai dinheiro para títulos do Tesouro de lá e tende a fortalecer o dólar contra moedas emergentes, como o real. Juro americano mais baixo empurra investidores para ativos de mais risco, inclusive em países como o Brasil. Por isso o Copom acompanha o Fed de perto, e o mercado brasileiro reage às decisões de Washington às vezes mais do que às de Brasília.",
        ],
      },
    ],
    exemplo: "Em 16 de setembro de 2026, o Fed subiu o juro básico em 0,25 ponto, para a faixa de 3,75% a 4% ao ano, alegando inflação ainda elevada. No mesmo dia, o Copom cortou a Selic para 13,75%. A diferença entre os dois, perto de 10 pontos, é uma das forças que movem o câmbio.",
    naPratica: "Para quem investe em dólar, o Fed define quanto rende o caixa e os títulos curtos lá fora e influencia o preço de títulos longos e ações. Para quem fica no Brasil, ele mexe no dólar e no apetite por emergentes. De um jeito ou de outro, o Fed afeta o seu patrimônio: dolarizar parte dele não elimina essa influência, mas troca a dependência de um banco central por a de dois, com ciclos diferentes.",
    relacionados: [
      "fed-funds",
      "afrouxamento-quantitativo",
      "treasury",
      "cpi",
      "copom",
      "crise-da-divida-externa",
      "independencia-do-banco-central",
      "crise-de-2008",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "4:02" },
      { modulo: 1, aula: 1, tempo: "17:21" },
      { modulo: 1, aula: 2, tempo: "14:16" },
      { modulo: 1, aula: 3, tempo: "15:58" },
    ],
  },
  {
    slug: "fed-funds",
    termo: "Fed funds",
    categoria: "Juros e inflação",
    apelidos: [
      "juro básico americano",
      "juro básico nos EUA",
      "juro americano",
      "juros americanos",
      "taxa dos Fed funds",
      "federal funds rate",
    ],
    resumo: "O juro básico dos Estados Unidos: a taxa dos empréstimos de um dia entre bancos, para a qual o Fed define uma faixa-alvo. É o equivalente americano da Selic.",
    texto: [
      "Bancos americanos emprestam reservas uns aos outros de um dia para o outro, como os brasileiros fazem no CDI. A taxa dessas operações se chama federal funds rate, ou Fed funds. É o juro básico dos Estados Unidos, o equivalente americano da Selic.",
      "O Fed não fixa essa taxa diretamente: anuncia uma faixa-alvo de um quarto de ponto, como 3,75% a 4%, e usa seus instrumentos para manter a taxa dentro dela.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Hoje, o principal instrumento é o juro que o Fed paga sobre as reservas que os bancos deixam depositadas nele. Nenhum banco empresta a outro por menos do que receberia deixando o dinheiro parado no Fed, e isso segura o piso. O Fed também oferece operações diárias com fundos e outras instituições para reforçar o controle.",
          "Antes de 2008, o mecanismo era outro: o Fed comprava e vendia títulos todo dia para ajustar a quantidade de reservas no sistema. Com o afrouxamento quantitativo, as reservas ficaram tão abundantes que esse método deixou de funcionar, e o juro sobre reservas virou a ferramenta central.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Depois de 2008, a faixa ficou perto de zero por sete anos. Voltou a zero em 2020, com a pandemia. Em 2022 e 2023, subiu até 5,25% a 5,5%, o maior nível em mais de vinte anos. Os cortes vieram em 2024 e 2025, até 3,5% a 3,75% em dezembro de 2025.",
          "Em 16 de setembro de 2026, o Fed voltou a subir os juros, para a faixa de 3,75% a 4%, citando inflação ainda acima da meta. No mesmo dia, o Copom levou a Selic a 13,75%.",
        ],
      },
      {
        titulo: "O que deriva dela",
        paragrafos: [
          "É do Fed funds que derivam o rendimento dos títulos curtos do Tesouro americano, os T-bills, o dos fundos de money market, que são o caixa remunerado dos americanos, e o juro que as corretoras pagam sobre saldo parado. Quando o Fed sobe, esses rendimentos sobem quase na hora.",
          "Os juros longos, como o do Treasury de 10 anos, não seguem o Fed funds de forma automática. Dependem também das expectativas de inflação, do crescimento e do prêmio por prazo. Há épocas em que o Fed sobe e os longos caem, e o contrário.",
        ],
      },
    ],
    exemplo: "Hipotético: com os Fed funds perto de 4% e a Selic em 13,75%, US$ 10 mil parados num fundo de money market rendem perto de US$ 400 por ano, e o equivalente em reais num pós-fixado, perto de R$ 6.875 com o dólar a R$ 5. A diferença é o que a paridade de juros diz que o dólar precisaria subir para empatar.",
    naPratica: "Comparar Fed funds com Selic é o ponto de partida da conversa sobre ir para fora, mas não o fim. A aula 3 mostra que o argumento não está na taxa de juros, e sim na concentração de risco. Para quem já tem dinheiro em dólar, o Fed funds é a referência do caixa: é quanto rende, sem risco relevante, o dinheiro que espera para ser investido.",
    relacionados: [
      "fed",
      "selic",
      "paridade-de-juros",
      "treasury",
      "carry-trade",
      "curva-de-juros",
      "cdi",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "24:45" },
      { modulo: 0, aula: 3, tempo: "5:48" },
      { modulo: 1, aula: 1, tempo: "17:21" },
    ],
  },
  {
    slug: "afrouxamento-quantitativo",
    termo: "Afrouxamento quantitativo",
    sigla: "QE",
    categoria: "Juros e inflação",
    apelidos: [
      "quantitative easing",
      "compra de títulos",
      "comprar títulos em massa",
      "dinheiro barato",
      "dinheiro quase de graça",
    ],
    resumo: "Quando o banco central, com os juros já perto de zero, compra títulos em grande quantidade para baixar os juros longos e irrigar o sistema com dinheiro.",
    texto: [
      "Em dezembro de 2008, o Fed tinha cortado o juro básico a quase zero, e ainda assim a economia não reagia. Não dava para cortar mais. A saída foi comprar títulos do Tesouro e títulos lastreados em hipotecas, em quantidades gigantescas, pagando com reservas novas criadas na hora. Isso derrubou os juros longos e encheu os bancos de dinheiro.",
      "É o afrouxamento quantitativo, ou QE, da sigla em inglês para quantitative easing: o banco central compra títulos em grande quantidade para baixar os juros de prazo longo quando o juro curto já está no chão.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Quando o banco central compra títulos, aparece no mercado um comprador enorme que não liga para o preço. Os títulos sobem, e as taxas caem. Os investidores que venderam ficam com dinheiro na mão e vão procurar outros ativos, como títulos de empresas, ações e imóveis, empurrando os preços desses também.",
          "O efeito é parecido com o de um corte de juros, só que agindo diretamente na ponta longa da curva, a que define o custo de hipotecas e de empréstimos de empresas.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "O Japão foi o pioneiro, no começo dos anos 2000, depois de uma década de deflação. Mas foi o Fed, a partir de 2008, que transformou o QE em ferramenta global. O programa se repetiu em ondas até 2014 e voltou com força em 2020, na pandemia. O Banco Central Europeu, o Banco da Inglaterra e outros fizeram o mesmo.",
          "No Brasil, uma emenda constitucional de 2020 autorizou o Banco Central a comprar títulos no mercado durante a pandemia, numa versão pequena e temporária.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "O balanço do Fed, que tinha perto de US$ 900 bilhões antes de 2008, chegou perto de US$ 9 trilhões em 2022. O caminho inverso, o aperto quantitativo, em que o Fed deixa os títulos vencerem sem repor, começou em 2022 e foi encerrado no fim de 2025, com o balanço ainda muito acima do nível de antes da crise.",
        ],
      },
      {
        titulo: "Os efeitos colaterais",
        paragrafos: [
          "O efeito colateral foi uma década de dinheiro barato. Quem tinha ativos para dar em garantia tomou crédito e comprou mais ativos, o que ajudou a inflar ações e imóveis e aumentou a desigualdade de patrimônio. Os juros reais nos países ricos ficaram perto de zero ou negativos por anos.",
          "Críticos dizem que o QE adiou ajustes e alimentou bolhas; defensores, que evitou depressões em 2008 e em 2020. O debate segue aberto. O que é certo é que o regime de juros do mundo rico mudou várias vezes em quinze anos.",
        ],
      },
    ],
    exemplo: "Hipotético: o banco central compra US$ 1 trilhão em títulos de 10 anos. Com mais um comprador gigante, o preço dos títulos sobe e a taxa cai, digamos de 3,5% para 2,5%. Uma hipoteca de US$ 400 mil em 30 anos fica perto de US$ 220 mais barata por mês. Empresas emitem dívida mais barato, e investidores, sem rendimento nos títulos, migram para ações.",
    naPratica: "A década do dinheiro barato ajuda a explicar a alta das ações de tecnologia americanas e o juro real perto de zero no mundo rico, enquanto o Brasil pagava juros reais que muitas vezes passavam de 5% ao ano. Quem compara os dois lados precisa saber que esses regimes mudam: o desempenho de ações e títulos americanos entre 2009 e 2021 aconteceu num ambiente que pode não se repetir. Diversificar não é apostar que o passado volta, é não depender de um único regime.",
    relacionados: [
      "fed",
      "treasury",
      "curva-de-juros",
      "juro-real",
      "bolha",
      "crise-de-2008",
      "fed-funds",
      "pandemia-de-2020",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "56:28" },
    ],
  },
  {
    slug: "custo-de-oportunidade",
    termo: "Custo de oportunidade",
    categoria: "Juros e inflação",
    apelidos: ["custos de oportunidade"],
    resumo: "O que você deixa de ganhar ao escolher uma alternativa em vez de outra. Todo investimento se compara com o melhor uso possível do mesmo dinheiro.",
    texto: [
      "Você deixa R$ 50 mil parados na conta corrente. Não perdeu nada no extrato, mas abriu mão de quanto eles renderiam numa aplicação segura: com a Selic a 13,75%, quase R$ 6.900 em um ano. Essa renúncia é o custo de oportunidade.",
      "Custo de oportunidade é o que você deixa de ganhar ao escolher uma alternativa em vez de outra. Todo investimento, e toda decisão, se compara com o melhor uso possível do mesmo dinheiro e do mesmo tempo.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A ideia é antiga. No século 19, o francês Frédéric Bastiat escreveu sobre o que se vê e o que não se vê: o dinheiro gasto para consertar uma vidraça quebrada aparece, mas o par de sapatos que o dono deixou de comprar não aparece em lugar nenhum. O custo de oportunidade mora no que não se vê.",
          "Em finanças, ele vira a taxa de desconto: o retorno que você exige de um investimento é, no mínimo, o que conseguiria na melhor alternativa de risco parecido.",
        ],
      },
      {
        titulo: "No Brasil, a régua é alta",
        paragrafos: [
          "Com juros altos, o custo de oportunidade de qualquer coisa é alto. O CDI vira a régua contra a qual tudo é medido: imóvel, empresa, ação, previdência, investimento lá fora. É por isso que muita gente pergunta para que ir para fora se o juro aqui paga tão bem.",
          "A pergunta é legítima, mas incompleta. Ela compara um rendimento em reais, de curto prazo, com o retorno de ativos em outra moeda e de prazo longo, sem olhar o risco de cada lado.",
        ],
      },
      {
        titulo: "Vale para os dois lados",
        paragrafos: [
          "O custo de oportunidade não é só de quem sai do CDI. Ficar 100% em reais também tem o seu: abrir mão de diversificar moeda, setores e jurisdição, e de ter algo que tende a subir quando o Brasil vai mal.",
          "Esperar também tem custo. Quem adia uma decisão à espera do momento certo abre mão do que o investimento renderia no período, e corre o risco de o momento nunca chegar.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Ignorar o tempo. O custo de oportunidade de um imóvel vazio, de um dinheiro parado ou de uma decisão adiada se acumula todo mês, pelos juros compostos.",
          "Comparar retornos de riscos diferentes. O custo de oportunidade de uma ação não é o CDI puro, e sim o CDI mais o prêmio que você exige por aceitar o risco da ação.",
        ],
      },
    ],
    exemplo: "Hipotético: esperar o dólar voltar a R$ 4,90 por dois anos, quando ele estava a R$ 5,20, tem um custo de oportunidade: tudo o que o investimento lá fora teria rendido no período, além do risco de o dólar nunca voltar. Se a carteira lá fora rendesse 7% ao ano em dólar, a espera custaria perto de 14,5% do valor, bem mais que os 6% que a queda do dólar economizaria.",
    naPratica: "A comparação certa não é taxa contra taxa. É o retorno esperado de cada caminho, com o risco que ele carrega, contra o que você deixa de ter ao não seguir o outro. Para quem pensa em dolarizar, o custo de oportunidade de sair do CDI é visível no extrato; o de não diversificar só aparece na próxima crise. Pôr os dois na mesa é a melhor forma de decidir sem se enganar.",
    relacionados: [
      "cdi",
      "selic",
      "market-timing",
      "premio-de-risco",
      "valor-presente",
      "vies-do-status-quo",
      "juros-compostos",
    ],
    noCurso: [
      { modulo: 1, aula: 1, tempo: "33:36" },
    ],
  },
  {
    slug: "renda-fixa",
    termo: "Renda fixa",
    categoria: "Renda fixa",
    apelidos: ["aplicação de renda fixa", "aplicações de renda fixa", "fluxo combinado"],
    resumo: "Investimentos em que você empresta dinheiro e recebe juros em datas e regras combinadas. Fixa é a regra do pagamento, não o preço no caminho.",
    texto: [
      "Quando você compra um título, empresta dinheiro a um governo, banco ou empresa. Em troca, recebe juros numa regra combinada: uma taxa prefixada, um índice como o CDI ou a inflação mais um adicional. Isso é renda fixa.",
      "O nome engana. Fixa é a regra do pagamento, não o preço no caminho. Um título pode oscilar bastante até o vencimento, e o emissor pode não pagar. O que está combinado desde o início é como o dinheiro vai voltar para você.",
    ],
    secoes: [
      {
        titulo: "Duas leituras de renda fixa",
        paragrafos: [
          "O brasileiro costuma associar renda fixa a um rendimento que sobe um pouquinho todo mês, como o CDB que paga 100% do CDI. É a leitura de quem cresceu com o pós-fixado.",
          "Na aula 4, Rodolfo Bastos propõe outra leitura: renda fixa é dinheiro que cai na sua conta em datas e valores combinados, como o cupom de um título ou o aluguel de um inquilino que nunca atrasa. É a leitura de quem precisa de fluxo, como um aposentado ou um fundo de pensão, e é a dominante nos Estados Unidos, onde quase todo título é prefixado e paga cupom.",
        ],
      },
      {
        titulo: "Os riscos da renda fixa",
        paragrafos: [
          "Risco de crédito: quem emitiu pode não pagar, ou pagar menos e mais tarde. É por isso que um título de empresa paga mais que um título do governo.",
          "Risco de mercado: se você vender antes do vencimento, recebe o preço do dia, que cai quando os juros sobem. Quanto mais longo o título, maior o efeito.",
          "Risco de inflação: um título prefixado pode perder poder de compra se a inflação surpreender. E risco de liquidez: alguns títulos são difíceis de vender antes do prazo sem desconto.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "No Brasil, a renda fixa é dominada por títulos pós-fixados, que acompanham o CDI e quase não oscilam, e por títulos atrelados à inflação. Mais da metade da dívida pública federal segue a Selic. O resultado é um extrato estável, que reforça a impressão de que renda fixa não tem risco.",
          "Nos Estados Unidos, o mercado de renda fixa é o maior do mundo, com dezenas de trilhões de dólares em títulos de governo, de empresas, de estados e cidades e lastreados em hipotecas. Quase tudo é prefixado e marcado a mercado, e o investidor vê o preço subir e descer todo dia.",
        ],
      },
    ],
    exemplo: "Em 2022, o título de 10 anos do Tesouro americano perdeu quase 18% no ano, praticamente o mesmo que a bolsa. Quem o levasse até o vencimento receberia o combinado; quem precisou vender no meio do caminho realizou a perda. Hipotético: quem comprou US$ 10 mil no começo de 2022 via no extrato perto de US$ 8.200 no fim do ano, mas segue recebendo os cupons e os US$ 10 mil no vencimento, se mantiver o título.",
    naPratica: "A renda fixa americana oscila mais no extrato que o pós-fixado brasileiro, porque lá quase tudo é prefixado e marcado a mercado. Isso não a torna pior, só diferente: o que se compra é um fluxo em dólar, não um rendimento estável em reais. Para quem dolariza, a renda fixa de lá pode cumprir o papel de base da carteira, desde que o prazo dos títulos combine com quando você vai precisar do dinheiro.",
    relacionados: [
      "titulo-de-divida",
      "cupom",
      "prefixado",
      "pos-fixado",
      "marcacao-a-mercado",
      "treasury",
      "risco-de-credito",
      "duration",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "10:09" },
      { modulo: 0, aula: 3, tempo: "23:44" },
      { modulo: 1, aula: 1, tempo: "0:00" },
      { modulo: 1, aula: 2, tempo: "0:00" },
    ],
  },
  {
    slug: "titulo-de-divida",
    termo: "Título de dívida",
    categoria: "Renda fixa",
    apelidos: [
      "bond",
      "bonds",
      "título de renda fixa",
      "títulos de renda fixa",
      "títulos de dívida",
    ],
    resumo: "Um papel que formaliza um empréstimo: quem emite recebe o dinheiro hoje e promete pagar juros e devolver o valor no vencimento. Em inglês, bond.",
    texto: [
      "Uma prefeitura precisa construir um hospital, uma empresa quer abrir uma fábrica, um governo precisa fechar as contas do ano. Em vez de ir ao banco, cada um pode pedir dinheiro emprestado diretamente a milhares de investidores, emitindo títulos. Quem compra empresta; quem emite promete pagar juros e devolver o valor numa data. Isso é um título de dívida, ou bond, em inglês.",
      "É um papel, hoje quase sempre eletrônico, que formaliza um empréstimo com regras conhecidas por todos: quanto, até quando e quanto de juros.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Um título de dívida tem quatro peças. Quem deve, o emissor. Quanto vai devolver no fim, o valor de face. Quando, o vencimento. E quanto paga de juros no caminho, o cupom ou a taxa. O contrato que define tudo isso, com as garantias e as obrigações do emissor, se chama escritura ou prospecto.",
          "Depois de emitido, o título pode trocar de mãos no mercado secundário. O preço passa a variar com os juros do mercado e com a confiança no emissor. Quem compra no meio do caminho leva o direito aos pagamentos que faltam, e paga por eles o preço do dia.",
          "Em caso de problema, o credor tem prioridade sobre o acionista: numa falência, os donos de títulos recebem antes dos donos de ações. Por isso a dívida é, em geral, menos arriscada que as ações da mesma empresa.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "Governos emitem dívida há séculos. Cidades italianas da Idade Média financiavam guerras assim, e a Inglaterra criou seu banco central, em 1694, justamente para organizar empréstimos ao governo.",
          "Há títulos antigos que ainda pagam juros. Um título emitido em 1648 por uma associação holandesa que cuidava de diques, para financiar obras contra enchentes, continua rendendo alguns euros por ano a quem o guarda, a Universidade Yale. É um exemplo extremo de como uma promessa bem escrita pode durar.",
        ],
      },
      {
        titulo: "Os tipos",
        paragrafos: [
          "Pelo emissor, há títulos públicos, de governos, e privados, de bancos e empresas. Pela forma de pagar juros, há prefixados, com taxa fixa; pós-fixados ou flutuantes, que seguem um juro de curto prazo; e atrelados à inflação, que corrigem o valor pelos preços. Pelo fluxo, há os que pagam cupons periódicos e os que pagam tudo no fim, chamados de zero cupom.",
          "No Brasil, quase todo título que a pessoa física compra tem nome próprio: CDB, LCI, LCA, debênture, Tesouro Selic, Tesouro IPCA+. Todos são, no fundo, títulos de dívida com regras diferentes.",
        ],
      },
    ],
    exemplo: "Hipotético: uma empresa emite um título de R$ 1.000, com vencimento em cinco anos e juros de 10% ao ano pagos semestralmente. Você recebe R$ 50 a cada seis meses e os R$ 1.000 no fim, se a empresa pagar: R$ 1.500 no total, em dez datas marcadas.",
    naPratica: "Nos Estados Unidos, o mercado de títulos é gigante, com papéis de governo e de empresas de todos os prazos; só o Tesouro americano tinha US$ 31,8 trilhões em títulos negociáveis no fim de setembro de 2026. Para quem pensa em dolarizar, títulos são uma forma de ter renda combinada em dólar, com datas conhecidas, e com riscos que o curso discute no Módulo II: crédito, prazo e câmbio.",
    relacionados: [
      "renda-fixa",
      "cupom",
      "treasury",
      "credito-privado",
      "yield",
      "titulo-publico",
      "debenture",
      "default",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "8:05" },
      { modulo: 1, aula: 1, tempo: "13:57" },
      { modulo: 1, aula: 2, tempo: "7:45" },
    ],
  },
  {
    slug: "prefixado",
    termo: "Prefixado",
    categoria: "Renda fixa",
    apelidos: [
      "prefixada",
      "prefixados",
      "título prefixado",
      "títulos prefixados",
      "Tesouro Prefixado",
      "LTN",
      "NTN-F",
    ],
    resumo: "Título cuja taxa é conhecida no dia da compra, por exemplo 12% ao ano. Você sabe quanto recebe no vencimento, mas o preço oscila até lá.",
    texto: [
      "Você compra um título que paga 12% ao ano por três anos. Aconteça o que acontecer com a Selic, com a inflação ou com o dólar, é isso que você recebe se levar até o fim e o emissor pagar. Isso é um prefixado: a taxa é conhecida no dia da compra.",
      "A certeza vale para o vencimento. No caminho, o preço oscila, às vezes bastante, e é aí que mora a maior parte das surpresas de quem compra prefixado sem entender.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Um prefixado zero cupom, como o Tesouro Prefixado, funciona assim: você paga um valor hoje, menor que o de face, e recebe o valor de face cheio no vencimento. A diferença é o juro. Se o título paga R$ 1.000 daqui a três anos e você paga R$ 712 hoje, a taxa é de 12% ao ano.",
          "Se os juros do mercado sobem para 14%, quem compra um título igual hoje paga menos por ele, para ganhar os 14%. O seu título, que paga só 12%, passa a valer menos no mercado. Se os juros caem, acontece o contrário, e o seu título se valoriza. Quanto mais longo o título, maior o sobe e desce.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "No Tesouro Direto, os prefixados são o Tesouro Prefixado, que paga tudo no fim e tem nome técnico LTN, e o Tesouro Prefixado com juros semestrais, a NTN-F. Bancos emitem CDBs prefixados, e empresas, debêntures prefixadas.",
          "No Brasil, o prefixado é minoria: perto de 20% da dívida pública federal em agosto de 2026, segundo o Tesouro. Curiosamente, é o preferido dos estrangeiros, que tinham 70% dos seus títulos públicos brasileiros em prefixados.",
          "Nos Estados Unidos, é o contrário: quase toda a dívida pública é prefixada, das T-bills aos títulos de 30 anos. A renda fixa americana é, na maior parte, uma renda fixa de taxa travada.",
        ],
      },
      {
        titulo: "Quando faz sentido e quando dói",
        paragrafos: [
          "O prefixado protege quem acerta que os juros vão cair e quem precisa de um valor certo numa data certa. Se você sabe que vai precisar de R$ 100 mil daqui a quatro anos, um prefixado com esse vencimento entrega o valor com precisão, se levado até o fim.",
          "Ele pune quem precisa vender quando os juros sobem, e quem é surpreendido pela inflação: se você trava 12% e a inflação vai a 10%, o ganho real fica pequeno. Em 2015, quando a inflação passou de 10%, quem tinha prefixados comprados a taxas menores sentiu as duas coisas ao mesmo tempo.",
        ],
      },
    ],
    exemplo: "Imagine um título prefixado que paga tudo daqui a dez anos, comprado a 4% ao ano. Se os juros do mercado sobem para 5%, ele passa a valer cerca de 9% menos hoje. Se caem para 3%, passa a valer cerca de 10% mais. Hipotético: US$ 10 mil investidos podem aparecer como US$ 9.100 ou US$ 11.000 no extrato, para o mesmo valor no vencimento.",
    naPratica: "O prefixado protege quem acerta que os juros vão cair e pune quem precisa vender quando eles sobem. A renda fixa americana é, na maior parte, prefixada, e por isso o extrato de lá oscila mais que um CDI. Para quem dolariza, a forma de conviver com isso é escolher prazos que combinem com quando você vai precisar do dinheiro, e não se assustar com a oscilação de um título que você pretende levar até o fim.",
    relacionados: [
      "pos-fixado",
      "marcacao-a-mercado",
      "duration",
      "curva-de-juros",
      "treasury",
      "tesouro-direto",
      "yield",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "23:44" },
      { modulo: 1, aula: 1, tempo: "3:39" },
    ],
  },
  {
    slug: "pos-fixado",
    termo: "Pós-fixado",
    categoria: "Renda fixa",
    apelidos: [
      "pós-fixada",
      "pós-fixados",
      "título pós-fixado",
      "aplicação pós-fixada",
      "1% ao mês",
      "atrelada à Selic",
      "atrelado ao CDI",
      "atrelada ao CDI",
    ],
    resumo: "Título que rende conforme um índice que só se conhece no caminho, como CDI ou Selic. O preço quase não oscila, e por isso o extrato parece sempre subir.",
    texto: [
      "Um CDB que paga 100% do CDI não diz quanto você vai ganhar: diz que vai acompanhar o juro de curto prazo, seja ele qual for. Se a Selic sobe, o rendimento sobe junto; se cai, cai junto. Isso é um pós-fixado: a taxa só se conhece depois, no caminho.",
      "Como a taxa se ajusta sozinha, o preço do título quase não reage aos juros, e o extrato mostra um crescimento suave, dia após dia. É o conforto do pós-fixado, que Rodolfo cita como uma das razões de o brasileiro ficar em casa.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O título acumula, a cada dia útil, o juro daquele dia, ou uma fração dele. Se a Selic muda, o rendimento do dia seguinte já reflete a mudança. Por isso o título não fica preso a uma taxa velha, e o preço quase não precisa se ajustar.",
          "Os pós-fixados mais comuns no Brasil seguem o CDI, como CDBs, LCIs, LCAs e debêntures, ou a Selic, como o Tesouro Selic. Alguns pagam o índice mais um adicional fixo, como CDI mais 1% ao ano.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "O pós-fixado é filho da inflação alta. Nos anos 1980, ninguém aceitava emprestar ao governo ou aos bancos a uma taxa fixa, porque a inflação podia mudar tudo em semanas. A solução foi atrelar o rendimento ao juro de um dia, que se ajustava o tempo todo. O Tesouro passou a emitir títulos assim no fim daquela década.",
          "A inflação foi domada em 1994, mas o hábito ficou. Hoje, mais da metade da dívida pública federal segue a taxa Selic: 52,7% em agosto de 2026, segundo o Tesouro. Nos Estados Unidos, os títulos de juro flutuante são cerca de 2% da dívida negociável.",
        ],
      },
      {
        titulo: "O que o conforto esconde",
        paragrafos: [
          "Não oscilar não é o mesmo que não ter risco. O pós-fixado carrega risco de crédito de quem emitiu: se o banco ou a empresa quebra, o extrato suave não ajuda. Carrega o risco de o juro cair, como em 2020, quando a Selic foi a 2% e o rendimento real ficou negativo. E é todo em reais.",
          "Para o país, há outro efeito. Como tanta dívida segue a Selic, cada alta de juros pesa rápido nas contas do governo, e a política monetária fica mais cara de fazer.",
        ],
      },
    ],
    exemplo: "De 2000 a 2024, o CDI não teve nenhum ano negativo. No mesmo período, o título de 10 anos do Tesouro americano teve anos de perda, e em 2022 caiu quase 18%. Hipotético: R$ 100 mil num pós-fixado em 2022 terminaram o ano perto de R$ 112 mil, sem um único dia no vermelho; US$ 100 mil num Treasury longo terminaram perto de US$ 82 mil no extrato.",
    naPratica: "Não oscilar não é o mesmo que não ter risco. O pós-fixado carrega risco de crédito de quem emitiu, inclusive do governo, e é todo em reais. Comparar o rendimento dele com o de um título americano é comparar riscos diferentes. Para quem dolariza, o equivalente lá fora existe, em T-bills, títulos de juro flutuante e fundos de money market, mas é a exceção, e não a regra, da renda fixa americana.",
    relacionados: [
      "prefixado",
      "cdi",
      "selic",
      "tesouro-selic",
      "frn",
      "risco-de-credito",
      "marcacao-na-curva",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "5:48" },
      { modulo: 0, aula: 3, tempo: "20:26" },
      { modulo: 1, aula: 1, tempo: "19:11" },
    ],
  },
  {
    slug: "titulo-publico",
    termo: "Título público",
    categoria: "Renda fixa",
    apelidos: [
      "títulos públicos",
      "título do Tesouro",
      "títulos do Tesouro",
      "títulos de governo",
    ],
    resumo: "Título emitido pelo governo para financiar suas contas. No Brasil, pelo Tesouro Nacional; nos Estados Unidos, pelo Tesouro americano.",
    texto: [
      "Quando o governo gasta mais do que arrecada, cobre a diferença vendendo títulos. Quem compra empresta dinheiro ao governo e recebe juros. Também se emitem títulos para rolar, isto é, pagar com dívida nova a dívida antiga que vence.",
      "Título público é isso: um título de dívida emitido pelo governo para financiar suas contas. No Brasil, pelo Tesouro Nacional; nos Estados Unidos, pelo Tesouro americano.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O Tesouro vende os títulos em leilões semanais, dos quais participam bancos e grandes investidores, e diretamente à pessoa física pelo Tesouro Direto. Os títulos brasileiros podem ser prefixados, pós-fixados ou atrelados à inflação, com prazos que vão de meses a mais de trinta anos.",
          "Na moeda do próprio país, título público costuma ser considerado o investimento de menor risco de crédito, porque o governo pode cobrar impostos e, no limite, emitir moeda para pagar. O custo dessa segunda saída aparece na inflação e no câmbio. É por isso que a taxa do título público serve de referência para todo o resto: nenhum emissor privado costuma pagar menos que o governo do próprio país.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Em agosto de 2026, a dívida pública federal brasileira somava R$ 9,29 trilhões, segundo o Tesouro. Mais da metade seguia a Selic, perto de um quarto era atrelada à inflação e um quinto era prefixada. O prazo médio era de pouco mais de quatro anos.",
          "Os maiores donos são instituições financeiras, fundos de previdência e fundos de investimento. Estrangeiros tinham perto de 10% da dívida interna, e as pessoas físicas, pelo Tesouro Direto, cerca de 3%.",
          "Nos Estados Unidos, a dívida negociável do Tesouro somava US$ 31,8 trilhões no fim de setembro de 2026, em títulos que bancos centrais do mundo inteiro guardam como reserva.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Menor risco de crédito não quer dizer risco nenhum. Governos já deram calote, inclusive o brasileiro, na dívida externa, e já mudaram as regras no meio do caminho, como no bloqueio das aplicações do Plano Collor.",
          "E título público de dois países diferentes não é a mesma coisa. Um título do Tesouro brasileiro e um do Tesouro americano são ambos dívida de governo, mas de governos, moedas, inflações e históricos diferentes.",
        ],
      },
    ],
    exemplo: "Em dezembro de 2025, a dívida pública federal brasileira somava R$ 8,6 trilhões; em agosto de 2026, R$ 9,3 trilhões, alta de quase 8% em oito meses, puxada pelos juros. Hipotético: com mais da metade atrelada à Selic, cada ponto a mais na taxa básica acrescenta dezenas de bilhões de reais por ano ao custo da dívida.",
    naPratica: "Título público brasileiro e título público americano são ambos dívida de governo, mas de governos, moedas e históricos diferentes. Ter só o primeiro é concentrar o risco de crédito e de moeda num único emissor, que é também quem define o seu imposto e a sua aposentadoria pública. Para quem dolariza, o Treasury é a contrapartida natural: o ativo de menor risco do outro lado.",
    relacionados: [
      "tesouro-direto",
      "treasury",
      "divida-publica",
      "risco-de-credito",
      "renda-fixa",
      "divida-pib",
      "plano-collor",
      "rating-soberano",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "8:05" },
      { modulo: 1, aula: 1, tempo: "0:00" },
    ],
  },
  {
    slug: "tesouro-direto",
    termo: "Tesouro Direto",
    categoria: "Renda fixa",
    apelidos: ["programa Tesouro Direto"],
    resumo: "O programa que permite à pessoa física comprar títulos públicos federais pela internet, com valores baixos. Existe desde 2002.",
    texto: [
      "Antes de 2002, título público era coisa de banco e de fundo. A pessoa física só chegava a ele por intermédio de algum produto, pagando taxas. Com o Tesouro Direto, qualquer pessoa com CPF e conta numa corretora passou a comprar títulos do governo pela internet, com aplicações pequenas.",
      "O Tesouro Direto é o programa do Tesouro Nacional, operado em parceria com a B3, que vende títulos públicos federais diretamente à pessoa física.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O programa oferece os títulos com nomes simples: Tesouro Selic, pós-fixado; Tesouro Prefixado, com e sem juros semestrais; e Tesouro IPCA+, com e sem juros semestrais. Há também títulos voltados a objetivos, como o Tesouro RendA+, que paga uma renda mensal a partir da aposentadoria, e o Tesouro Educa+, que paga parcelas para custear a educação.",
          "A aplicação mínima é de 1% do valor de um título, respeitado um piso de R$ 30. O Tesouro recompra os títulos todo dia útil, pelo preço de mercado, o que dá liquidez ao investidor. A B3 cobra uma taxa de custódia de 0,20% ao ano, com isenção para os primeiros R$ 10 mil no Tesouro Selic, e incide imposto de renda sobre o ganho, com alíquota menor quanto mais longo o prazo.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Em agosto de 2026, o programa tinha 3,8 milhões de investidores ativos e um estoque de R$ 272 bilhões, segundo o Tesouro. Os títulos atrelados à inflação eram a maior fatia do estoque, perto de 47%, seguidos pelo Tesouro Selic, com perto de 39%. Apesar do crescimento, a pessoa física detém só cerca de 3% da dívida interna.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "O Tesouro Direto mostra todo dia o preço de mercado de cada título. É por isso que um Tesouro Prefixado ou um Tesouro IPCA+ longo pode aparecer no vermelho num mês de alta dos juros, enquanto um CDB, marcado pela curva, parece só subir. A oscilação não é defeito do programa: é transparência sobre o que o título vale se vendido naquele dia.",
          "A taxa contratada só é garantida para quem leva o título até o vencimento. Quem vende antes recebe o preço do dia, que pode ser maior ou menor.",
        ],
      },
      {
        titulo: "E nos Estados Unidos",
        paragrafos: [
          "O equivalente americano, o TreasuryDirect, existe desde os anos 1980 e permite comprar títulos direto do governo. Mas ele é pensado para cidadãos e residentes nos Estados Unidos. Para um brasileiro, o acesso a Treasuries costuma vir por corretoras internacionais, que compram os títulos no mercado, ou por ETFs que reúnem carteiras de títulos.",
        ],
      },
    ],
    exemplo: "Hipotético: você compra um Tesouro IPCA+ longo e, seis meses depois, os juros reais do mercado sobem de 6% para 7%. O extrato mostra queda no valor do título, que pode passar de 10% num papel de prazo muito longo. Se você levar até o vencimento, recebe a inflação mais os 6% contratados, como se nada tivesse acontecido.",
    naPratica: "O Tesouro Direto é a porta mais simples para títulos públicos brasileiros, e um ótimo lugar para aprender, com pouco dinheiro, como funcionam marcação a mercado e prazo. O equivalente americano, o TreasuryDirect, é pensado para residentes nos Estados Unidos; de fora, o acesso a Treasuries costuma vir por corretoras e ETFs. A lógica dos títulos, porém, é a mesma dos dois lados.",
    relacionados: [
      "titulo-publico",
      "tesouro-selic",
      "tesouro-ipca",
      "prefixado",
      "marcacao-a-mercado",
      "corretora-internacional",
      "treasury",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "20:26" },
    ],
  },
  {
    slug: "tesouro-selic",
    termo: "Tesouro Selic",
    sigla: "LFT",
    categoria: "Renda fixa",
    apelidos: [
      "Letra Financeira do Tesouro",
      "LFTs",
      "títulos atrelados à Selic",
      "dívida atrelada à Selic",
    ],
    resumo: "O título público pós-fixado do Brasil, que rende a Selic do período. É o que mais se parece com dinheiro em caixa rendendo juros.",
    texto: [
      "Se você precisa guardar dinheiro que pode usar a qualquer momento, rendendo juros e com o menor risco possível em reais, o Tesouro Selic é provavelmente o primeiro nome que vai ouvir. É o título público pós-fixado do Brasil: rende a Selic do período.",
      "O nome técnico é LFT, Letra Financeira do Tesouro. É o que mais se parece com dinheiro em caixa rendendo juros, e é o título preferido de quem monta uma reserva de emergência.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O Tesouro Selic paga a taxa Selic acumulada desde a compra até a venda ou o vencimento. Como o rendimento se ajusta a cada dia ao juro do momento, o preço oscila pouquíssimo. Em períodos de estresse, ele pode ter pequenas variações, porque o mercado às vezes exige um adicional ou aceita um desconto sobre a Selic, mas a oscilação é mínima perto dos outros títulos.",
          "Pode ser vendido em qualquer dia útil, e o dinheiro cai na conta rapidamente. Paga imposto de renda sobre o ganho, com alíquota regressiva, e tem isenção de taxa de custódia para os primeiros R$ 10 mil.",
        ],
      },
      {
        titulo: "Uma peculiaridade brasileira",
        paragrafos: [
          "Nasceu nos anos de inflação alta, quando ninguém emprestava ao governo a taxa fixa. E continua enorme. Em agosto de 2026, as LFTs somavam R$ 4,9 trilhões, mais da metade da dívida interna, segundo o Tesouro. No Tesouro Direto, eram perto de 39% do estoque.",
          "Isso faz uma alta de juros pesar rápido nas contas públicas: diferente de um título prefixado longo, cujo custo fica travado, a LFT passa a pagar mais no dia seguinte à decisão do Copom.",
          "Nenhuma grande economia tem uma fatia tão grande da dívida em títulos assim. Nos Estados Unidos, o mais parecido são as T-bills, títulos curtos, e os títulos de juro flutuante, que somam perto de 2% da dívida negociável.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Menor risco em reais não é risco zero. O Tesouro Selic depende da capacidade de pagamento do governo brasileiro e é todo em reais. Se o real perde valor, o Tesouro Selic perde junto, medido em dólar.",
          "E o rendimento depende de onde a Selic vai. Quem estava confortável com 14% em 2016 recebia 2% em 2020.",
        ],
      },
    ],
    exemplo: "Hipotético: com a Selic a 13,75% ao ano, R$ 10 mil no Tesouro Selic viram perto de R$ 11.375 em um ano, antes de imposto, quase sem oscilação no caminho. Com a Selic a 2%, como em 2020, os mesmos R$ 10 mil virariam R$ 10.200, menos que a inflação daquele ano.",
    naPratica: "É o ativo de menor risco em reais, mas segue sendo um risco em reais e do governo brasileiro. Para a reserva de emergência, que vai pagar gastos em reais, ele faz todo o sentido. Para a parte do patrimônio pensada para diversificar moeda, não substitui um ativo de fora. O equivalente americano mais próximo são as T-bills, títulos curtos do Tesouro de lá, os títulos de juro flutuante e os fundos de money market.",
    relacionados: [
      "pos-fixado",
      "selic",
      "titulo-publico",
      "frn",
      "reserva-de-emergencia",
      "tesouro-direto",
      "liquidez",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "20:26" },
      { modulo: 1, aula: 1, tempo: "19:11" },
    ],
  },
  {
    slug: "tesouro-ipca",
    termo: "Tesouro IPCA+",
    sigla: "NTN-B",
    categoria: "Renda fixa",
    apelidos: [
      "NTN-Bs",
      "Tesouro IPCA+ com juros semestrais",
      "título atrelado à inflação",
      "títulos atrelados à inflação",
      "título do Tesouro atrelado à inflação",
    ],
    resumo: "Título público que paga a inflação medida pelo IPCA mais uma taxa fixa combinada na compra. Protege o poder de compra em reais, se levado ao vencimento.",
    texto: [
      "Um título que paga IPCA + 6% garante que, no vencimento, você terá o poder de compra original mais 6% ao ano de ganho real, aconteça o que acontecer com a inflação. Se os preços dobrarem, o título dobra junto, e ainda paga os 6% em cima.",
      "É o Tesouro IPCA+, título público que paga a inflação medida pelo IPCA mais uma taxa fixa combinada na compra. O nome técnico é NTN-B, para a versão com cupons semestrais, ou NTN-B Principal, para a que paga tudo no fim.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O valor do título é corrigido todo mês pelo IPCA. Sobre esse valor corrigido incide a taxa real contratada. Na versão com juros semestrais, a cada seis meses cai na conta um cupom de cerca de 3%, sempre sobre o valor já atualizado pela inflação. Na versão sem cupom, tudo se acumula e é pago no vencimento.",
          "A parte da inflação protege contra a alta dos preços no Brasil. A parte fixa, a taxa real, é que oscila com o mercado: se os juros reais sobem depois da compra, o título vale menos no caminho; se caem, vale mais.",
        ],
      },
      {
        titulo: "O sobe e desce dos longos",
        paragrafos: [
          "Os títulos mais longos, com vencimento em 2045, 2050 ou além, oscilam bastante. Uma alta de um ponto na taxa real pode derrubar o preço de um título de 25 anos em mais de 10%. Quem compra e precisa vender no meio do caminho pode ter perdas grandes, mesmo num título do governo corrigido pela inflação.",
          "Esse é o lado menos conhecido do Tesouro IPCA+. Ele é muito seguro para quem leva até o vencimento e bem volátil para quem não leva.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Em agosto de 2026, os títulos atrelados a índices de preços eram perto de 23% da dívida pública federal, segundo o Tesouro. Os fundos de previdência são os maiores interessados: tinham mais da metade da sua carteira de títulos públicos nesse tipo de papel, porque precisam pagar aposentadorias corrigidas pela inflação décadas à frente.",
          "Na aula 4, a versão com juros semestrais é o exemplo de renda fixa como fluxo: um cupom que cai na conta a cada seis meses, corrigido pela inflação, como um aluguel indexado.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Achar que a taxa do título é o rendimento total. IPCA + 6% num ano de IPCA de 4% rende perto de 10,2% nominal, e não 6%.",
          "Esquecer que o imposto incide sobre o ganho nominal, inclusive sobre a correção pela inflação, o que reduz o ganho real líquido.",
        ],
      },
    ],
    exemplo: "Hipotético: R$ 100 mil num IPCA + 6% por dez anos, com inflação média de 4%, viram perto de R$ 265 mil no vencimento, antes de imposto. Em poder de compra de hoje, são cerca de R$ 179 mil: os 6% reais compostos por dez anos.",
    naPratica: "O Tesouro IPCA+ protege da inflação brasileira, não do câmbio. Para quem tem gastos em reais, como a aposentadoria no Brasil, é um bom pedaço de proteção. Para gastos futuros em dólar, o equivalente seria um título americano corrigido pela inflação de lá, como os TIPS. Ter os dois é proteger o poder de compra nas duas moedas, cada um com seu papel.",
    relacionados: [
      "ipca",
      "juro-real",
      "cupom",
      "tips",
      "marcacao-a-mercado",
      "tesouro-direto",
      "duration",
      "previdencia",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "10:09" },
      { modulo: 1, aula: 1, tempo: "16:16" },
    ],
  },
  {
    slug: "cdb",
    termo: "CDB",
    categoria: "Renda fixa",
    apelidos: [
      "CDBs",
      "certificado de depósito bancário",
      "certificados de depósito bancário",
    ],
    resumo: "Título emitido por um banco para captar dinheiro. Na prática, você empresta ao banco e recebe juros, quase sempre atrelados ao CDI.",
    texto: [
      "Quando você aplica num CDB, empresta dinheiro ao banco, que usa esses recursos para emprestar a outros clientes, cobrando mais caro. Em troca, ele te paga juros, geralmente um percentual do CDI, como 100% ou 110%, e às vezes uma taxa prefixada ou atrelada à inflação.",
      "O CDB, Certificado de Depósito Bancário, é o investimento de renda fixa mais popular do Brasil depois da poupança. É simples, tem a garantia do FGC e aparece em qualquer aplicativo de banco ou corretora.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Cada CDB tem um emissor, um prazo, uma taxa e uma regra de liquidez. Alguns podem ser resgatados a qualquer momento, com liquidez diária; outros só no vencimento. Em geral, quanto menos liquidez e menor o banco, maior a taxa.",
          "O imposto de renda é regressivo: 22,5% sobre o ganho para aplicações de até seis meses, caindo até 15% para as de mais de dois anos. Nos primeiros 30 dias, há também IOF sobre o rendimento.",
        ],
      },
      {
        titulo: "A garantia do FGC",
        paragrafos: [
          "O CDB tem a garantia do FGC, o Fundo Garantidor de Créditos, mantido pelos próprios bancos. Ele cobre até R$ 250 mil por CPF por instituição ou conglomerado, com limite total de R$ 1 milhão a cada quatro anos.",
          "Acima disso, o risco é do banco. E mesmo dentro do limite, o dinheiro não volta no dia seguinte à quebra: há um processo, que leva semanas ou meses.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em novembro de 2025, o Banco Central decretou a liquidação extrajudicial do Banco Master, que por anos havia captado bilhões oferecendo CDBs a taxas bem acima do mercado, distribuídos por plataformas de investimento com o argumento da garantia do FGC. Foi o maior acionamento da história do fundo: cerca de R$ 41 bilhões em garantias para perto de 1,6 milhão de credores.",
          "Quem tinha até R$ 250 mil foi ressarcido ao longo dos meses seguintes. Quem tinha mais entrou na fila dos credores da liquidação. O caso mostrou que taxa muito acima da média é um sinal de risco, e não um presente.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "No extrato, o CDB costuma aparecer marcado pela curva, crescendo dia a dia como se o mercado não tivesse mudado. Se você precisar vender antes do vencimento um CDB sem liquidez diária, o preço pode ser outro, e às vezes o banco nem recompra.",
        ],
      },
    ],
    exemplo: "Hipotético: dois CDBs pagam 100% e 120% do CDI. O segundo paga mais porque o banco emissor é menor ou mais arriscado. Com o CDI a 13,65%, R$ 100 mil rendem perto de R$ 13.650 no primeiro e R$ 16.380 no segundo, brutos. Os R$ 2.730 de diferença são o prêmio pelo risco de crédito, e só valem a pena se o banco pagar.",
    naPratica: "A pergunta da aula, por que não ficar só no CDB, não é sobre o CDB ser ruim. É que ele concentra três riscos no mesmo lugar: o do banco, o do juro brasileiro e o do real. O FGC cobre o primeiro até um limite; os outros dois ficam com você. Para quem pensa em dolarizar, o CDB pode seguir cumprindo o papel de caixa em reais, enquanto outra parte do patrimônio cuida da moeda.",
    relacionados: [
      "cdi",
      "pos-fixado",
      "risco-de-credito",
      "marcacao-na-curva",
      "credito-privado",
      "fgc",
      "liquidez",
      "spread-de-credito",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "26:22" },
      { modulo: 0, aula: 3, tempo: "20:26" },
    ],
  },
  {
    slug: "debenture",
    termo: "Debênture",
    categoria: "Renda fixa",
    apelidos: ["debêntures", "debêntures incentivadas"],
    resumo: "Título de dívida emitido por uma empresa não financeira para se financiar. Paga mais que o título público porque carrega o risco da empresa.",
    texto: [
      "Uma concessionária de rodovias precisa de dinheiro para duplicar uma estrada. Em vez de pegar empréstimo no banco, emite debêntures: títulos que prometem juros e a devolução do valor em datas combinadas. Quem compra vira credor da empresa e passa a depender da capacidade dela de pagar.",
      "Debênture é um título de dívida emitido por uma empresa, quase sempre não financeira, para se financiar no mercado. Paga mais que o título público porque carrega o risco da empresa.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A empresa define o valor, o prazo, a forma de remuneração, que pode ser prefixada, atrelada ao CDI ou ao IPCA, e as garantias. Tudo fica numa escritura, com um agente fiduciário encarregado de defender os interesses dos credores. Algumas debêntures têm garantia real, como um imóvel ou recebíveis; outras, só a promessa da empresa.",
          "Debêntures não têm a garantia do FGC. Se a empresa não pagar, o credor entra na fila de uma recuperação judicial ou falência, e pode receber só parte do que emprestou, muitos anos depois.",
          "Depois de emitidas, as debêntures podem ser negociadas no mercado secundário, mas muitas têm pouca liquidez: vender antes do prazo pode exigir aceitar um desconto.",
        ],
      },
      {
        titulo: "As incentivadas",
        paragrafos: [
          "Uma lei de 2011 criou as debêntures incentivadas, que financiam projetos de infraestrutura, como energia, saneamento, rodovias e portos, e são isentas de imposto de renda para a pessoa física. A isenção fez delas um produto popular, e as taxas costumam ser menores por causa do benefício.",
          "Mudanças nessa regra entram no debate de tempos em tempos; vale conferir a legislação vigente antes de comprar.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em janeiro de 2023, a Americanas revelou inconsistências contábeis bilionárias e, dias depois, pediu recuperação judicial. A empresa tinha debêntures em circulação, muitas nas carteiras de fundos de crédito brasileiros. Os títulos despencaram, fundos tiveram resgates em massa, e o mercado de crédito privado travou por meses.",
          "O episódio mostrou que nem empresas grandes e conhecidas estão livres de calote, e que o risco de crédito costuma aparecer de uma vez.",
        ],
      },
    ],
    exemplo: "Hipotético: o título público de cinco anos paga IPCA + 6%, e a debênture de uma empresa sólida, IPCA + 7%. Esse ponto a mais é o spread de crédito, o pagamento por aceitar o risco da empresa. Em R$ 100 mil, ele vale perto de R$ 1 mil por ano a mais, que somem rapidamente se a empresa atrasar um único pagamento.",
    naPratica: "Debênture é crédito privado em reais. Somada a títulos públicos e CDBs, mantém o patrimônio concentrado no ciclo de crédito brasileiro, por mais que os emissores sejam diferentes: numa recessão forte aqui, todos sofrem ao mesmo tempo. Nos Estados Unidos, o equivalente são os corporate bonds, um mercado de vários trilhões de dólares, que permite diversificar o crédito por país e setor.",
    relacionados: [
      "credito-privado",
      "spread-de-credito",
      "rating",
      "risco-de-credito",
      "default",
      "titulo-de-divida",
      "liquidez",
    ],
  },
  {
    slug: "credito-privado",
    termo: "Crédito privado",
    categoria: "Renda fixa",
    apelidos: [
      "títulos de empresas",
      "títulos privados",
      "papéis privados",
      "corporate bonds",
      "títulos corporativos",
      "dívida de empresas",
    ],
    resumo: "Títulos de dívida emitidos por empresas e bancos, e não pelo governo. Pagam um adicional sobre os títulos públicos pelo risco de calote.",
    texto: [
      "Toda dívida que não é do governo é crédito privado: debêntures, CDBs, letras de bancos, notas de empresas, títulos de empresas americanas. A lógica é a mesma do título público, com um risco a mais, o de quem emitiu não pagar.",
      "Para compensar esse risco, o crédito privado paga um prêmio sobre o título público de mesmo prazo, o spread de crédito. Empresas sólidas pagam pouco a mais; empresas arriscadas, muito.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Antes de emprestar, o investidor quer saber a chance de calote e quanto recuperaria se ele acontecesse. Agências de rating dão notas que ajudam a separar uns dos outros, e a linha mais importante é a que divide o grau de investimento, de risco menor, do grau especulativo, o chamado high yield, de juros altos.",
          "O preço dos títulos privados depende de duas coisas: dos juros em geral, como qualquer título, e da confiança no emissor. Quando o medo cresce, o spread se abre e os preços caem, mesmo que a empresa continue pagando tudo em dia.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "No Brasil, o crédito privado cresceu muito nos últimos anos, em fundos, debêntures e títulos ligados ao agronegócio e ao mercado imobiliário. Boa parte é pós-fixada e acompanha o CDI, o que dá a impressão de estabilidade até que um emissor grande tropeça.",
          "Nos Estados Unidos, há títulos de empresas de todos os tamanhos, setores e notas, num mercado muito mais profundo e líquido. A aula 4 cita perto de US$ 14 trilhões só nesse segmento. Ali é possível montar uma carteira de crédito espalhada por centenas de emissores, inclusive por ETFs.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2008, os spreads dos títulos americanos de grau especulativo passaram de 20 pontos percentuais: empresas arriscadas precisavam pagar mais de 20% ao ano acima do Tesouro. Muitas quebraram; quem segurou as que sobreviveram teve ganhos enormes nos anos seguintes. Em março de 2020, o mesmo filme durou semanas, até o Fed anunciar que compraria títulos de empresas.",
          "No Brasil, a recuperação judicial da Americanas, em 2023, provocou uma onda de resgates em fundos de crédito e mostrou como o risco aparece de uma vez.",
        ],
      },
    ],
    exemplo: "Hipotético: o Tesouro americano de cinco anos paga 4% ao ano. Uma empresa com nota alta paga 5%; uma com nota baixa, 8%. Os 4 pontos de diferença na segunda pagam a chance maior de calote. Se, numa carteira de 100 títulos assim, três empresas quebram por ano e se recupera metade do valor delas, a perda média come perto de 1,5 ponto, e sobra um ganho extra de 2,5 pontos.",
    naPratica: "No Módulo II, o curso trata de crédito americano. A pergunta é sempre a mesma: o prêmio pago compensa o risco? Em crises, os spreads se abrem e os preços caem junto com a bolsa, o que reduz o papel de proteção da renda fixa. Para quem dolariza, crédito privado pode somar renda, mas não substitui títulos de governo como a parte mais estável da carteira.",
    relacionados: [
      "debenture",
      "spread-de-credito",
      "rating",
      "grau-de-investimento",
      "risco-de-credito",
      "default",
      "cdb",
      "crise-de-2008",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "8:05" },
      { modulo: 1, aula: 2, tempo: "0:00" },
    ],
  },
  {
    slug: "treasury",
    termo: "Treasury",
    categoria: "Renda fixa",
    apelidos: [
      "Treasuries",
      "título do Tesouro americano",
      "títulos do Tesouro americano",
      "Treasury de 10 anos",
      "título de 10 anos do Tesouro",
      "títulos de 10 anos do Tesouro americano",
      "título de 10 anos do Tesouro americano",
      "T-bills",
      "T-bill",
      "T-notes",
      "T-bonds",
    ],
    resumo: "Os títulos de dívida do governo dos Estados Unidos. São a referência de investimento de baixo risco em dólar e a base do mercado financeiro global.",
    texto: [
      "Quando o governo americano precisa de dinheiro, emite títulos do Tesouro, os Treasuries. Eles são a referência de investimento de baixo risco em dólar e a base do mercado financeiro global: a taxa do Treasury de 10 anos influencia o custo das hipotecas nos Estados Unidos, o preço das ações no mundo inteiro e até o juro que o Brasil paga para se financiar lá fora.",
      "Para quem pensa em dolarizar, o Treasury é o equivalente do título público brasileiro, só que em dólar e emitido pelo governo da maior economia do mundo.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Há três famílias pelo prazo. As T-bills, de até um ano, que não pagam cupom: são compradas com desconto e pagam o valor cheio no vencimento. As T-notes, de 2 a 10 anos. E as T-bonds, de 20 e 30 anos. Notes e bonds pagam cupom a cada seis meses.",
          "Além delas, há os TIPS, corrigidos pela inflação, e os títulos de juro flutuante, que seguem a taxa das T-bills. O Tesouro vende tudo em leilões frequentes, e os títulos são negociados num mercado secundário que gira centenas de bilhões de dólares por dia.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "A dívida americana nasceu com o país. Em 1790, o primeiro secretário do Tesouro, Alexander Hamilton, convenceu o Congresso a assumir as dívidas dos estados na guerra de independência e a pagá-las integralmente, contra quem defendia um desconto. A decisão criou a reputação de bom pagador que sustenta o mercado até hoje.",
          "Depois da Segunda Guerra, com o dólar no centro do sistema de Bretton Woods, os Treasuries viraram a reserva preferida dos bancos centrais do mundo.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "No fim de setembro de 2026, a dívida negociável do Tesouro americano somava US$ 31,8 trilhões, segundo o próprio Tesouro: US$ 16,3 trilhões em notes, US$ 7,1 trilhões em bills, US$ 5,6 trilhões em bonds, US$ 2,2 trilhões em TIPS e US$ 0,7 trilhão em títulos de juro flutuante. É o maior mercado de títulos do mundo.",
          "A nota de crédito dos Estados Unidos caiu da máxima nas três grandes agências: na S&P em 2011, na Fitch em 2023 e na Moody's em 2025, por causa dos déficits e da dívida crescente. Ainda assim, o Treasury segue como o ativo para onde o dinheiro corre nas crises.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Baixo risco de crédito não quer dizer preço estável. Um Treasury longo oscila bastante quando os juros mudam: em 2022, o de 10 anos perdeu quase 18%, e os de 30 anos, bem mais. O risco de calote é baixo; o risco de mercado, para quem vende antes do vencimento, não.",
          "E Treasury não é sinônimo de dólar parado. Ele paga juros, e esses juros, reinvestidos ao longo dos anos, são boa parte do resultado.",
        ],
      },
      {
        titulo: "Como o brasileiro chega lá",
        paragrafos: [
          "Há três caminhos principais. Comprar os títulos diretamente por uma corretora internacional, escolhendo o vencimento. Comprar ETFs que reúnem carteiras de Treasuries de um prazo determinado, curto, médio ou longo, negociados lá fora ou, em versões locais, na B3. Ou investir por fundos brasileiros que aplicam em títulos americanos, com ou sem proteção cambial.",
          "Cada caminho tem custos, impostos e riscos diferentes. Na compra direta, você sabe exatamente o que vai receber se levar ao vencimento. No ETF, o prazo médio da carteira se mantém, e não há uma data em que o dinheiro volta inteiro. No fundo com hedge, some a exposição ao dólar, que é justamente o que muita gente procura. Os ganhos lá fora seguem as regras de tributação de aplicações no exterior, que mudaram em 2024 e são tratadas no curso.",
        ],
      },
    ],
    exemplo: "Hipotético: você compra um Treasury de 10 anos com cupom de 4%, a US$ 1.000. Recebe US$ 20 a cada seis meses e os US$ 1.000 no fim. Se os juros sobem para 5% no ano seguinte, o título vale perto de US$ 930 no mercado. Se você segurar até o fim, recebe tudo o que foi combinado; o resultado em reais depende ainda do câmbio na hora de converter.",
    naPratica: "Para quem dolariza, o Treasury é o equivalente do título público brasileiro, só que em dólar. Levado ao vencimento, entrega exatamente o combinado; o resultado em reais depende do câmbio. Escolher o prazo é a decisão principal: T-bills funcionam como caixa em dólar, e títulos longos como uma aposta em juros, mais voláteis. É o tema central do módulo de Tony Volpon.",
    relacionados: [
      "titulo-publico",
      "tips",
      "curva-de-juros",
      "duration",
      "fed-funds",
      "moeda-de-reserva",
      "etf",
      "lei-14754",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "23:44" },
      { modulo: 0, aula: 3, tempo: "25:26" },
      { modulo: 1, aula: 1, tempo: "3:39" },
      { modulo: 1, aula: 2, tempo: "0:00" },
      { modulo: 1, aula: 3, tempo: "33:25" },
    ],
  },
  {
    slug: "tips",
    termo: "TIPS",
    categoria: "Renda fixa",
    apelidos: [
      "Treasury Inflation-Protected Securities",
      "título americano corrigido pela inflação",
      "títulos corrigidos pela inflação",
    ],
    resumo: "Títulos do Tesouro americano com o principal corrigido pela inflação de lá (o CPI). São o equivalente americano do Tesouro IPCA+.",
    texto: [
      "Um TIPS funciona como uma NTN-B em dólar. O valor do título é corrigido pela inflação americana, medida pelo CPI, e o cupom incide sobre esse valor corrigido. No vencimento, você recebe o principal atualizado. O nome vem de Treasury Inflation-Protected Securities, títulos do Tesouro protegidos contra a inflação.",
      "São o equivalente americano do Tesouro IPCA+: protegem o poder de compra em dólar, e pagam um juro real combinado na compra.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O Tesouro americano emite TIPS de 5, 10 e 30 anos. O principal é ajustado pela variação do CPI, e os cupons, pagos a cada seis meses, são calculados sobre o principal ajustado. Se a inflação sobe, os pagamentos sobem junto.",
          "Há uma proteção extra: no vencimento, o investidor recebe o maior valor entre o principal corrigido e o principal original. Se houver deflação acumulada, ele não perde o valor de face.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "Os TIPS existem desde 1997. O Reino Unido já emitia títulos atrelados à inflação desde os anos 1980, e o Brasil tinha a experiência das ORTNs, os títulos com correção monetária criados nos anos 1960. Nos Estados Unidos, a ideia demorou porque a inflação baixa dos anos 1990 fazia a proteção parecer desnecessária.",
          "No fim de setembro de 2026, havia US$ 2,2 trilhões em TIPS em circulação, cerca de 7% da dívida negociável americana. Bem menos, proporcionalmente, que a fatia dos títulos atrelados à inflação no Brasil.",
        ],
      },
      {
        titulo: "A inflação implícita",
        paragrafos: [
          "Comparar a taxa de um Treasury comum com a de um TIPS do mesmo prazo dá uma medida do que o mercado espera de inflação, a chamada inflação implícita, ou breakeven. Se o Treasury de 10 anos paga 4,2% e o TIPS de 10 anos paga 1,9% acima da inflação, o mercado espera algo perto de 2,3% de inflação por ano.",
          "Se a inflação vier maior que isso, o TIPS ganha do título comum; se vier menor, perde. O mesmo raciocínio vale no Brasil, entre o Tesouro Prefixado e o Tesouro IPCA+.",
        ],
      },
    ],
    exemplo: "Hipotético: você compra US$ 10 mil em TIPS com juro real de 2% ao ano. Se a inflação americana for de 3% num ano, o principal vai a US$ 10.300 e o cupom anual, de 2%, é calculado sobre esse valor: US$ 206, em duas parcelas. Em 2022, quando o CPI passou de 9% em 12 meses, o principal dos TIPS subiu na mesma medida.",
    naPratica: "Os TIPS protegem o poder de compra em dólar, não em reais. Para quem planeja gastos futuros nos Estados Unidos, como estudo dos filhos, moradia ou aposentadoria no exterior, essa é a proteção que casa com o objetivo. Como o Tesouro IPCA+, eles oscilam quando o juro real muda; levados ao vencimento, entregam o combinado.",
    relacionados: [
      "treasury",
      "tesouro-ipca",
      "cpi",
      "juro-real",
      "risco-de-base",
      "inflacao",
      "correcao-monetaria",
    ],
    noCurso: [
      { modulo: 1, aula: 1, tempo: "16:16" },
    ],
  },
  {
    slug: "frn",
    termo: "Título de juro flutuante",
    sigla: "FRN",
    categoria: "Renda fixa",
    apelidos: [
      "títulos de juro flutuante",
      "floating rate note",
      "floating rate notes",
      "juro flutuante",
    ],
    resumo: "Título cujo cupom acompanha um juro de curto prazo e muda com ele. É o parente mais próximo do pós-fixado brasileiro.",
    texto: [
      "Em vez de pagar uma taxa fixa, um título de juro flutuante paga uma taxa que se ajusta à de curto prazo, mais um pequeno adicional. Se os juros sobem, o cupom sobe; se caem, cai. Como acompanha o mercado, o preço quase não oscila.",
      "Em inglês, o nome é floating rate note, ou FRN. É o parente mais próximo, lá fora, do pós-fixado brasileiro, como o Tesouro Selic ou o CDB que paga 100% do CDI.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O título define uma taxa de referência, como o rendimento das T-bills de três meses ou uma taxa interbancária, e um adicional fixo, chamado de spread. A cada período, o cupom é recalculado: taxa de referência do momento mais o spread.",
          "Como o rendimento se ajusta, o título não fica preso a uma taxa velha quando os juros mudam. Por isso o preço fica perto do valor de face o tempo todo. O que pode mexer com ele é a confiança no emissor: se o spread que o mercado exige aumenta, o título perde um pouco de valor.",
        ],
      },
      {
        titulo: "Nos Estados Unidos",
        paragrafos: [
          "O Tesouro americano emite títulos assim desde janeiro de 2014, com prazo de dois anos, atrelados à taxa dos leilões de T-bills de três meses e com juros pagos a cada três meses. São uma fatia pequena da dívida americana: cerca de US$ 708 bilhões de um total de US$ 31,8 trilhões em títulos negociáveis no fim de setembro de 2026, perto de 2%.",
          "No mercado privado, títulos de juro flutuante são comuns em empréstimos a empresas mais arriscadas, os chamados leveraged loans, e em títulos lastreados em empréstimos. Ali, o risco de crédito pesa muito mais que o de juros.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "No Brasil, o juro flutuante é a regra, e não a exceção. Em agosto de 2026, os títulos atrelados à taxa Selic eram 52,7% da dívida pública federal, segundo o Tesouro. CDBs, LCIs, LCAs e boa parte das debêntures seguem o CDI.",
          "É a herança dos anos de inflação alta, quando ninguém aceitava taxa fixa. E explica uma diferença de experiência: o investidor brasileiro se acostumou a um extrato que só sobe, enquanto o americano convive com a oscilação dos prefixados.",
        ],
      },
    ],
    exemplo: "No Brasil, mais da metade da dívida federal segue a Selic. Nos Estados Unidos, os títulos de juro flutuante são perto de 2% da dívida negociável. Hipotético: US$ 10 mil num título flutuante do Tesouro americano, com T-bills a 4% e spread de 0,1%, rendem perto de US$ 410 por ano, pagos a cada três meses, e o valor de mercado quase não sai dos US$ 10 mil.",
    naPratica: "O pós-fixado não é uma invenção exclusiva brasileira, mas o tamanho dele aqui é. Quem procura algo parecido lá fora encontra T-bills, títulos de juro flutuante e fundos de money market, ótimos para o caixa em dólar. Para o resto da renda fixa americana, a regra é a taxa prefixada, e vale se preparar para ver o extrato oscilar.",
    relacionados: ["pos-fixado", "tesouro-selic", "treasury", "fed-funds", "prefixado", "cdi"],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "20:26" },
      { modulo: 1, aula: 1, tempo: "16:16" },
    ],
  },
  {
    slug: "cupom",
    termo: "Cupom",
    categoria: "Renda fixa",
    apelidos: [
      "cupons",
      "título com cupom",
      "títulos com cupom",
      "cupom semestral",
      "juros semestrais",
      "título zero cupom",
      "zero cupom",
      "risco de reinvestimento",
    ],
    resumo: "Os juros que um título paga periodicamente, por exemplo a cada seis meses, até o vencimento. Título que paga tudo só no fim é chamado de zero cupom.",
    texto: [
      "Pense num título que você compra por R$ 1.000, que paga R$ 50 a cada seis meses e devolve os R$ 1.000 no vencimento. Esses R$ 50 são o cupom: os juros que o título paga periodicamente até o fim.",
      "O nome vem do tempo em que os títulos eram de papel. Vinham com uma folha de cupons destacáveis, um para cada data de pagamento, que o dono recortava e trocava por dinheiro no banco. Nos Estados Unidos do começo do século 20, rentista era chamado de cortador de cupons.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O cupom é definido na emissão, como um percentual do valor de face, pago numa frequência combinada: semestral nos Treasuries e na maioria dos títulos de empresas americanas, anual em muitos títulos europeus. Num título de R$ 1.000 com cupom de 10% ao ano pago a cada semestre, cada pagamento é de perto de R$ 50.",
          "O que está combinado é o fluxo, não o preço. Se os juros do mercado caem, o título com cupom antigo fica mais atraente e passa a valer mais que R$ 1.000; se sobem, passa a valer menos. O cupom continua o mesmo; o que muda é quanto alguém paga por ele.",
        ],
      },
      {
        titulo: "Zero cupom e risco de reinvestimento",
        paragrafos: [
          "Há títulos que não pagam nada no caminho e entregam tudo no fim, os zero cupom, como o Tesouro Prefixado e as T-bills. Você paga menos que o valor de face hoje e recebe o valor cheio no vencimento.",
          "O título com cupom traz um risco a mais, o de reinvestimento: cada cupom recebido precisa ser aplicado de novo, à taxa que estiver valendo. Se os juros caíram, o reinvestimento rende menos que o planejado. O zero cupom elimina esse risco, mas oscila mais no caminho.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "No Tesouro Direto, pagam cupom o Tesouro Prefixado com juros semestrais, a NTN-F, com 10% ao ano, e o Tesouro IPCA+ com juros semestrais, a NTN-B, com 6% ao ano sobre o valor corrigido pela inflação. As versões sem cupom acumulam tudo para o fim.",
          "Para quem quer renda periódica, o cupom é a forma mais direta de transformar patrimônio em fluxo de caixa, sem vender nada.",
        ],
      },
    ],
    exemplo: "Hipotético: uma NTN-B com cupom de 6% ao ano paga perto de 3% a cada seis meses sobre o valor corrigido pela inflação. Quem tem R$ 200 mil nela recebe perto de R$ 6 mil por semestre, mais a correção, que faz os pagamentos crescerem com os preços. Em dez anos, são vinte cupons, cada um um pouco maior que o anterior.",
    naPratica: "Na leitura da aula 4, o cupom é o coração da renda fixa: dinheiro que cai na conta em data conhecida. Se você vai precisar do dinheiro numa data, faz sentido um título que vença perto dela. E, diferente do dividendo, que a empresa pode cortar, deixar de pagar o cupom é calote. Para quem dolariza, uma carteira de títulos com cupom em dólar é uma forma de ter renda em moeda forte com datas marcadas.",
    relacionados: [
      "renda-fixa",
      "titulo-de-divida",
      "yield",
      "dividendo",
      "tesouro-ipca",
      "default",
      "treasury",
    ],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "10:56" },
      { modulo: 1, aula: 1, tempo: "13:57" },
      { modulo: 1, aula: 2, tempo: "7:45" },
    ],
  },
  {
    slug: "yield",
    termo: "Yield",
    categoria: "Renda fixa",
    apelidos: [
      "yield to maturity",
      "taxa até o vencimento",
      "rendimento até o vencimento",
      "taxa do título",
      "yields",
    ],
    resumo: "O retorno anual que você recebe se comprar um título pelo preço de hoje e levá-lo até o vencimento. Sobe quando o preço cai, e vice-versa.",
    texto: [
      "Um título com cupom de 4% custava US$ 1.000. Os juros subiram e ele passou a ser negociado a US$ 930. Quem compra agora recebe os mesmos cupons, mas paga menos, e ainda ganha a diferença até os US$ 1.000 do vencimento. O retorno total dessa compra, em ritmo anual, é o yield.",
      "Yield, em inglês, quer dizer rendimento. Na renda fixa, a palavra quase sempre se refere ao yield to maturity, a taxa até o vencimento: o retorno anual de quem compra um título pelo preço de hoje e o leva até o fim, recebendo tudo o que foi prometido.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O yield é a taxa que faz o valor presente de todos os pagamentos futuros do título, cupons e principal, ficar igual ao preço de hoje. Em palavras: é a taxa de juros que você está, de fato, contratando ao pagar aquele preço.",
          "Preço e yield andam em sentidos opostos, sempre. Se o preço cai, o mesmo fluxo custa menos, e o retorno de quem compra sobe. Por isso, nos Estados Unidos, as notícias dizem que o yield do Treasury de 10 anos subiu, o que é o mesmo que dizer que o preço caiu.",
          "O yield supõe duas coisas: que o emissor vai pagar tudo e que os cupons serão reinvestidos à mesma taxa. Se uma delas falhar, o retorno efetivo será outro.",
        ],
      },
      {
        titulo: "Yield não é cupom",
        paragrafos: [
          "O cupom é fixo e definido na emissão. O yield muda todo dia, com o preço. Um título com cupom de 2% comprado com desconto pode render 5% até o vencimento, e um com cupom de 6% comprado com ágio pode render 4%.",
          "No Brasil, a ideia é a mesma, mas a palavra quase não se usa: fala-se em taxa do título. Quando o Tesouro Direto mostra que um Tesouro IPCA+ está pagando IPCA mais 6,5%, está mostrando o yield de quem compra naquele dia.",
        ],
      },
      {
        titulo: "Um número que o mundo acompanha",
        paragrafos: [
          "O yield do Treasury de 10 anos é talvez o número mais importante das finanças globais. Ele serve de base para as hipotecas americanas, para o custo de empréstimos de empresas e para a taxa de desconto com que analistas avaliam ações no mundo inteiro. Quando ele sobe muito, as bolsas costumam sofrer, e moedas emergentes como o real também.",
        ],
      },
    ],
    exemplo: "Hipotético: um Treasury de 10 anos com cupom de 4% passa a valer US$ 930. O yield de quem compra a esse preço fica perto de 4,9% ao ano: os 4% de cupom, mais o ganho de US$ 70 até o vencimento, distribuído pelos anos que faltam. Quem tinha comprado a US$ 1.000 continua ganhando 4% ao ano, se segurar até o fim.",
    naPratica: "Ao comparar títulos, olhe o yield, não o cupom. É ele que diz quanto você vai ganhar a partir de hoje, se o emissor pagar e você segurar até o fim. E, para comparar um título americano com um brasileiro, lembre que o yield de cada um é na moeda dele: o que importa para você é o resultado depois do câmbio e da inflação de cada lado.",
    relacionados: [
      "cupom",
      "marcacao-a-mercado",
      "curva-de-juros",
      "treasury",
      "duration",
      "valor-presente",
      "dividend-yield",
    ],
    noCurso: [
      { modulo: 1, aula: 1, tempo: "1:40" },
      { modulo: 1, aula: 2, tempo: "8:18" },
    ],
  },
  {
    slug: "marcacao-a-mercado",
    termo: "Marcação a mercado",
    categoria: "Renda fixa",
    apelidos: [
      "marcado a mercado",
      "marcada a mercado",
      "marcados a mercado",
      "marcar a mercado",
      "preço do dia",
      "preço de mercado",
    ],
    resumo: "Atualizar o valor de um título pelo preço que ele teria se fosse vendido hoje, e não pelo que vai pagar no vencimento.",
    texto: [
      "É olhar quanto o seu título vale hoje, se você precisasse vender. Se você segura até o fim, recebe a taxa combinada, desde que o emissor pague. Se vende antes, recebe o preço do dia, que cai quando os juros sobem e sobe quando eles caem.",
      "Marcação a mercado é atualizar o valor de um título, ou de qualquer ativo, pelo preço que ele teria se fosse vendido hoje, e não pelo que vai pagar no vencimento.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Todo dia, o título é avaliado pela taxa que o mercado está pedindo para papéis parecidos. Se você comprou um título que paga 10% e o mercado agora pede 12%, o seu vale menos: ninguém pagaria o preço cheio por um título que rende menos que os novos. A diferença aparece no extrato como perda, mesmo sem nada ter mudado no emissor.",
          "A marcação não cria nem destrói valor: mostra o que já aconteceu. Se você levar o título até o fim, a perda do caminho desaparece, e você recebe exatamente o combinado.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Fundos de investimento no Brasil marcam a mercado os títulos que têm, e o Tesouro Direto mostra o preço diário de cada papel. Já o CDB levado ao vencimento costuma aparecer no extrato pela curva, subindo devagar como se o mercado não tivesse mudado.",
          "Nos Estados Unidos, o investidor vê o sobe e desce dos títulos no extrato todo dia, e se acostumou a ele. Como quase toda a renda fixa americana é prefixada, a marcação a mercado é a regra.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2002, as regras passaram a exigir que os fundos brasileiros marcassem os títulos a mercado, num momento em que os juros estavam subindo com a incerteza eleitoral. Cotistas de fundos de renda fixa, que nunca tinham visto o extrato cair, viram perdas de uma hora para outra. Houve uma onda de resgates, que forçou vendas e derrubou ainda mais os preços.",
          "O episódio ensinou ao investidor brasileiro que renda fixa oscila, e que a estabilidade de antes era, em parte, efeito de contabilidade.",
        ],
      },
    ],
    exemplo: "Imagine um título prefixado que paga tudo daqui a dez anos, comprado a 4% ao ano. Se os juros do mercado sobem para 5%, ele passa a valer cerca de 9% menos hoje. O extrato marcado na curva esconde essa perda, mas ela aparece se você precisar vender antes do prazo. Se os juros voltarem a 4% um ano depois, a perda some.",
    naPratica: "A marcação a mercado não cria nem destrói valor: mostra o que já aconteceu. Ela explica por que a renda fixa americana parece tão volátil e por que parte da oscilação da renda fixa brasileira fica escondida. Para quem dolariza, a lição é olhar a oscilação de um título pelo que ela é: o preço de sair antes. Se o prazo do título combina com o seu, ela importa pouco.",
    relacionados: [
      "marcacao-na-curva",
      "prefixado",
      "duration",
      "yield",
      "volatilidade",
      "tesouro-direto",
      "crise-de-2002",
    ],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "20:26" },
    ],
  },
  {
    slug: "marcacao-na-curva",
    termo: "Marcação na curva",
    categoria: "Renda fixa",
    apelidos: ["pela curva", "marcado na curva", "preço na curva"],
    resumo: "Atualizar o título pela taxa contratada na compra, como se o mercado não tivesse mudado. Mostra o que você recebe no vencimento, não o que receberia vendendo hoje.",
    texto: [
      "Você comprou um CDB a 12% ao ano. Na marcação na curva, o extrato mostra o valor crescendo exatamente 12% ao ano, todo dia um pouquinho, aconteça o que acontecer com os juros lá fora. Se os juros do mercado dispararem, o extrato nem pisca.",
      "Marcação na curva é atualizar o título pela taxa contratada na compra, como se o mercado não tivesse mudado. Mostra o que você recebe no vencimento, não o que receberia vendendo hoje.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A curva, aqui, é a trajetória do valor do título entre a compra e o vencimento, crescendo à taxa contratada. Marcar na curva é andar sobre ela, ignorando o preço que o mercado pagaria no dia.",
          "É uma forma legítima de mostrar quanto o título vai valer no vencimento, e faz sentido para quem tem certeza de que vai segurar até o fim. O problema aparece quando você precisa vender antes: o comprador paga o preço de mercado, que pode ser maior ou menor que o da curva.",
        ],
      },
      {
        titulo: "Onde aparece",
        paragrafos: [
          "No Brasil, CDBs, LCIs e LCAs costumam aparecer marcados pela curva no extrato das corretoras e dos bancos. Fundos de previdência e seguradoras podem manter na curva títulos que pretendem carregar até o vencimento, com regras específicas.",
          "Bancos, no mundo todo, também classificam parte dos títulos como mantidos até o vencimento, contabilizados pela curva. Isso suaviza o balanço, mas pode esconder perdas grandes.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "O Silicon Valley Bank, na Califórnia, tinha aplicado boa parte dos depósitos em títulos longos do Tesouro americano e em títulos lastreados em hipotecas, comprados quando os juros estavam perto de zero. Muitos estavam contabilizados como mantidos até o vencimento, pela curva. Quando os juros subiram em 2022, esses títulos passaram a valer bem menos no mercado, mas a perda não aparecia no resultado.",
          "Em março de 2023, os depositantes começaram a sacar, o banco precisou vender títulos com prejuízo, a perda escondida veio à tona, e a corrida virou quebra em dois dias. Na época, foi a maior falência bancária americana desde 2008.",
        ],
      },
    ],
    exemplo: "Hipotético: o seu CDB prefixado de 12% está a R$ 11.200 pela curva. Os juros subiram para 14% e você precisa resgatar antes. O banco recompra pelo preço de mercado, digamos R$ 11.000. Os R$ 200 de diferença sempre estiveram lá; a marcação na curva só não os mostrava.",
    naPratica: "A estabilidade do extrato brasileiro é, em parte, efeito de contabilidade. Na comparação com um título americano marcado a mercado, lembre que um mostra o preço do dia e o outro, o valor da promessa. Os dois podem ser o mesmo investimento visto de jeitos diferentes. Julgar a renda fixa de fora como mais arriscada só porque o extrato oscila é cair numa ilusão de ótica.",
    relacionados: ["marcacao-a-mercado", "cdb", "prefixado", "volatilidade", "liquidez", "duration"],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "20:26" },
    ],
  },
  {
    slug: "duration",
    termo: "Duration",
    categoria: "Renda fixa",
    apelidos: ["prazo médio", "duração"],
    resumo: "O prazo médio em que você recebe o dinheiro de um título. Na prática, mede quanto o preço dele reage a uma mudança de juros: quanto maior, mais oscila.",
    texto: [
      "Dois títulos pagam a mesma taxa, um vence em 2 anos e o outro em 20. Os juros do mercado sobem 1 ponto. O primeiro perde perto de 2% de valor; o segundo, mais de 10%. A diferença entre os dois tem nome: duration.",
      "Duration é o prazo médio em que você recebe o dinheiro de um título. Na prática, é a medida de quanto o preço dele reage a uma mudança de juros: quanto maior a duration, mais o título oscila.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Um título paga vários valores ao longo do tempo: cupons no caminho e o principal no fim. A duration é a média dos prazos desses pagamentos, pesando cada um pelo seu valor de hoje. Num título que paga tudo no fim, a duration é o próprio prazo. Num título com cupons, é menor, porque parte do dinheiro chega antes.",
          "A ideia foi formulada pelo economista canadense Frederick Macaulay nos anos 1930, e por isso a versão clássica leva o nome dele. A versão usada para medir risco, a duration modificada, é um ajuste pequeno sobre a de Macaulay.",
        ],
      },
      {
        titulo: "A regra de bolso",
        paragrafos: [
          "Cada ponto percentual de alta nos juros derruba o preço do título em mais ou menos tantos por cento quanto a duration, em anos. Um título com duration de 8 cai perto de 8% se os juros sobem 1 ponto, e sobe perto de 8% se caem 1 ponto.",
          "A regra é uma aproximação, boa para movimentos pequenos. Em movimentos grandes, o preço sobe um pouco mais do que a regra diz quando os juros caem, e cai um pouco menos quando sobem. Essa curvatura se chama convexidade, e joga a favor de quem tem o título.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2022, o Fed subiu os juros de perto de zero para mais de 4% em menos de um ano. O Treasury de 10 anos, com duration perto de 8, perdeu quase 18%. Os títulos de 20 a 30 anos, com duration perto de 17, perderam perto de 30%, tanto quanto ou mais que a bolsa americana. Foi o pior ano da renda fixa americana em décadas.",
          "No Brasil, o mesmo efeito aparece nos Tesouro IPCA+ longos, que oscilam forte quando os juros reais mudam.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Confundir duration com prazo de vencimento. Um título de 10 anos com cupom alto tem duration bem menor que 10.",
          "Achar que título longo é sempre mais seguro porque é do governo. O risco de crédito pode ser baixo e o risco de preço, alto.",
        ],
      },
    ],
    exemplo: "Hipotético: um título com duration de 8 anos e juros subindo de 4% para 5%. O preço cai perto de 8%: US$ 10 mil viram cerca de US$ 9.200 no extrato. Se os juros caem 1 ponto, ele sobe perto de 8%, um pouco mais por causa da convexidade. Um título com duration de 2 anos, no mesmo cenário, oscilaria perto de 2%.",
    naPratica: "Duration é a ferramenta para casar a renda fixa com o seu horizonte. Se você vai precisar do dinheiro em três anos, títulos de duration parecida reduzem o risco de vender na hora errada. Títulos longos oscilam como ações em anos de juros agitados. Para quem monta a parte de renda fixa em dólar, escolher a duration é escolher quanto do resultado vai depender do caminho dos juros americanos.",
    relacionados: [
      "marcacao-a-mercado",
      "curva-de-juros",
      "prefixado",
      "treasury",
      "horizonte-de-investimento",
      "yield",
      "tesouro-ipca",
    ],
    noCurso: [
      { modulo: 1, aula: 1, tempo: "14:51" },
      { modulo: 1, aula: 2, tempo: "12:08" },
    ],
  },
  {
    slug: "curva-de-juros",
    termo: "Curva de juros",
    categoria: "Renda fixa",
    apelidos: [
      "estrutura a termo",
      "estrutura a termo das taxas de juros",
      "juros longos",
      "juro longo",
      "curva invertida",
      "inversão da curva",
      "curva de juros invertida",
      "juros de longo prazo",
    ],
    resumo: "O gráfico das taxas de juros por prazo, do curtíssimo ao longo. Mostra quanto o mercado cobra para emprestar por um mês, um ano ou trinta anos.",
    texto: [
      "Emprestar dinheiro por um mês e por dez anos não custa o mesmo. Ligue num gráfico as taxas de cada prazo, de títulos do mesmo emissor, do mais curto ao mais longo, e você tem a curva de juros, ou estrutura a termo das taxas de juros.",
      "A curva mostra quanto o mercado cobra para emprestar por um mês, um ano ou trinta anos. E, pelo formato dela, dá para ler o que o mercado espera da inflação, dos juros e da economia.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A ponta curta segue o banco central: as taxas de poucos meses ficam perto da Selic aqui e dos Fed funds lá. A ponta longa reflete três coisas: a expectativa para os juros curtos no futuro, a inflação esperada e um prêmio por emprestar por mais tempo, já que muita coisa pode dar errado em dez ou trinta anos.",
          "No Brasil, a curva é formada sobretudo pelos contratos de DI futuro negociados na B3 e pelos títulos públicos. Nos Estados Unidos, pelos Treasuries de todos os prazos.",
        ],
      },
      {
        titulo: "Os formatos",
        paragrafos: [
          "Normalmente, a curva sobe: prazo maior, taxa maior. É a curva positiva, sinal de que o mercado cobra um prêmio pelo tempo.",
          "Quando os juros curtos ficam acima dos longos, ela está invertida, sinal de que o mercado espera cortes de juros, muitas vezes por medo de recessão. Nos Estados Unidos, a inversão antecedeu as recessões de 1990, 2001 e 2008, mas sem prazo previsível. Entre 2022 e 2024, a curva americana passou mais de dois anos invertida, a inversão mais longa já registrada, e a recessão esperada não veio no período.",
          "Há também a curva com barriga, em que os prazos intermediários pagam menos que os curtos e os longos, e a curva plana, quando quase não há diferença.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "No Brasil, a ponta longa sobe rápido quando o mercado desconfia das contas públicas, mesmo sem o Banco Central mexer na Selic. É o prêmio de risco fiscal: quem empresta ao governo por dez anos quer ser pago pela chance de inflação mais alta ou de problemas com a dívida.",
          "Por isso, a curva brasileira costuma ser mais inclinada e mais nervosa que a americana, e um título longo daqui oscila mais.",
        ],
      },
    ],
    exemplo: "Hipotético: o título de 3 meses paga 4%, o de 2 anos, 3,6%, e o de 10 anos, 4,1%. A curva tem uma barriga: o mercado espera cortes no curto prazo e cobra prêmio no longo. Quem compra o de 2 anos aposta, sem dizer, que os cortes virão; quem fica no de 3 meses aceita reinvestir à taxa que existir lá na frente.",
    naPratica: "Escolher títulos é escolher um ponto da curva. No Módulo II, Tony Volpon trata da curva americana e do que ela sinaliza. Para você, o essencial é saber que prazos diferentes reagem de jeitos diferentes à mesma notícia, e que a ponta longa brasileira carrega um prêmio de risco do país que não existe da mesma forma na americana.",
    relacionados: [
      "duration",
      "yield",
      "treasury",
      "fed",
      "prefixado",
      "selic",
      "afrouxamento-quantitativo",
      "risco-pais",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "14:55" },
      { modulo: 1, aula: 1, tempo: "22:35" },
    ],
  },
  {
    slug: "rating",
    termo: "Rating",
    categoria: "Renda fixa",
    apelidos: [
      "nota de crédito",
      "notas de crédito",
      "classificação de risco",
      "agência de rating",
      "agências de rating",
    ],
    resumo: "A nota que agências como S&P, Moody's e Fitch dão à capacidade de um governo ou empresa pagar suas dívidas. Vai de AAA, a melhor, até D, de calote.",
    texto: [
      "Antes de emprestar a alguém que você não conhece, você quer uma opinião sobre o risco. É o que fazem as agências de rating: analisam contas, histórico e perspectivas de um governo ou de uma empresa e dão uma nota à capacidade dele de pagar suas dívidas.",
      "A escala começa em AAA, a melhor nota, e desce por AA, A, BBB, BB, B e assim por diante, até D, de calote. Cada letra tem degraus intermediários, marcados com mais e menos.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "As três maiores agências são S&P Global, Moody's e Fitch, com escalas parecidas. A Moody's escreve de outro jeito: Aaa, Aa1, Baa3 e assim por diante. Em geral, é o emissor que contrata e paga a agência para ser avaliado, o que cria um conflito de interesses conhecido.",
          "A linha mais importante separa o grau de investimento, de BBB menos para cima, do grau especulativo, de BB mais para baixo. Muitos fundos de pensão e seguradoras só podem comprar títulos com grau de investimento. Perder esse selo pode forçar vendas em massa e encarecer de uma vez o crédito do emissor.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "As agências nasceram nos Estados Unidos no começo do século 20, quando o analista John Moody começou a publicar notas para os títulos de ferrovias, o grande mercado de crédito da época. O modelo se espalhou para governos, cidades e empresas do mundo todo.",
        ],
      },
      {
        titulo: "O Brasil e os Estados Unidos",
        paragrafos: [
          "O Brasil ganhou o grau de investimento em 2008 e o perdeu entre 2015 e 2016, durante a recessão e a crise fiscal. Em 2026, segue abaixo da linha: um degrau abaixo na Moody's e dois na S&P e na Fitch.",
          "Até os Estados Unidos perderam a nota máxima nas três agências: na S&P em 2011, na Fitch em 2023 e na Moody's em 2025, por causa dos déficits e da dívida crescente.",
        ],
      },
      {
        titulo: "Rating é opinião",
        paragrafos: [
          "Rating é opinião, não garantia. As agências erraram feio antes de 2008, dando nota máxima a títulos lastreados em hipotecas que viraram pó. E costumam reagir depois dos fatos: muitas vezes, o mercado já cobrou o risco no preço dos títulos antes de a nota mudar.",
        ],
      },
    ],
    exemplo: "Hipotético: duas empresas do mesmo setor emitem títulos de cinco anos. A de nota A paga 5% ao ano; a de nota BB, 7,5%. A diferença é quanto o mercado cobra pelo risco a mais. Se a segunda for rebaixada para B, o título pode cair 5% ou mais no mesmo dia, mesmo sem atrasar nenhum pagamento.",
    naPratica: "O rating ajuda a filtrar o crédito, mas não substitui olhar o prêmio pago e a concentração. Uma carteira só de títulos de um país herda a nota daquele país em tudo: nenhuma empresa brasileira costuma ter nota maior que a do próprio Brasil na escala global. Diversificar entre países é também diversificar entre ratings soberanos.",
    relacionados: [
      "grau-de-investimento",
      "spread-de-credito",
      "risco-de-credito",
      "default",
      "risco-pais",
      "rating-soberano",
      "crise-de-2008",
    ],
    noCurso: [
      { modulo: 1, aula: 1, tempo: "24:32" },
      { modulo: 1, aula: 2, tempo: "1:04" },
    ],
  },
  {
    slug: "spread-de-credito",
    termo: "Spread de crédito",
    categoria: "Renda fixa",
    apelidos: ["spreads de crédito", "prêmio de crédito", "pontos-base", "pontos base"],
    resumo: "A diferença entre a taxa de um título com risco de calote e a de um título público de mesmo prazo. É o preço que o mercado cobra pelo risco do emissor.",
    texto: [
      "Se o título do Tesouro de cinco anos paga 4% e o de uma empresa, no mesmo prazo, paga 5,5%, o spread de crédito é de 1,5 ponto, ou 150 pontos-base. Cada ponto-base é um centésimo de ponto percentual.",
      "Spread de crédito é a diferença entre a taxa de um título com risco de calote e a de um título público de mesmo prazo. É o preço que o mercado cobra, em juros, pelo risco do emissor.",
    ],
    secoes: [
      {
        titulo: "O que está dentro do spread",
        paragrafos: [
          "Boa parte do spread paga a perda esperada: a chance de o emissor não pagar, vezes quanto se perderia se isso acontecesse. Outra parte paga a liquidez, já que títulos de empresas são mais difíceis de vender que os do governo. E uma parte é prêmio puro, porque os investidores não gostam de incerteza e cobram por ela.",
          "Por isso, mesmo empresas que quase nunca dão calote pagam algum spread, e empresas arriscadas pagam muito mais do que a perda média justificaria.",
        ],
      },
      {
        titulo: "Como se move",
        paragrafos: [
          "O spread se abre quando o medo cresce e se fecha quando a confiança volta. Por isso títulos de empresas costumam cair junto com a bolsa nas crises, mesmo que paguem tudo em dia. Em 2008, os spreads dos títulos americanos de grau especulativo passaram de 20 pontos percentuais; em tempos calmos, ficam perto de 3 a 4.",
          "Para quem compra no meio do medo, spread aberto é oportunidade; para quem precisa vender, é perda.",
        ],
      },
      {
        titulo: "O spread dos países",
        paragrafos: [
          "O risco-país é um spread de crédito aplicado a governos: quanto um país paga acima do Tesouro americano para se financiar em dólar. O indicador mais conhecido é o EMBI, do banco JP Morgan, e outro termômetro é o preço do CDS, um seguro contra calote.",
          "O spread do Brasil já passou de 2.000 pontos-base em crises e já ficou abaixo de 200 em fases de euforia. Ele resume, num número, a confiança do mundo nas contas brasileiras.",
        ],
      },
    ],
    exemplo: "Em 2002, o Brasil pagava 24 pontos percentuais acima dos títulos americanos, mais de 2.400 pontos-base. Quando o novo governo confirmou os compromissos fiscais, o prêmio caiu em poucos meses sem que a dívida mudasse de tamanho. Hipotético: num título de US$ 10 mil com duration de 5, uma queda de 10 pontos no spread valorizaria o papel em algo como 40% a 50%.",
    naPratica: "Ao olhar um título que paga mais, pergunte de onde vem o adicional. Quase sempre é spread de crédito, e ele é pago justamente porque, em algum cenário, o dinheiro não volta inteiro. Para quem dolariza, o spread também é a régua para comparar crédito americano e brasileiro: o que importa é se o prêmio compensa o risco, e não o tamanho da taxa.",
    relacionados: [
      "risco-de-credito",
      "rating",
      "credito-privado",
      "risco-pais",
      "premio-de-risco",
      "embi",
      "cds",
      "carta-ao-povo-brasileiro",
    ],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "45:15" },
      { modulo: 1, aula: 1, tempo: "31:27" },
      { modulo: 1, aula: 2, tempo: "13:25" },
    ],
  },
  {
    slug: "default",
    termo: "Default",
    categoria: "Renda fixa",
    apelidos: ["calote", "calotes", "inadimplência", "deu calote", "dando calote"],
    resumo: "Quando o emissor de uma dívida deixa de pagar juros ou principal como combinado. Pode acabar em perda parcial, renegociação forçada ou perda total.",
    texto: [
      "Default é o nome técnico do calote: o devedor não paga um cupom ou o principal na data combinada. Para o credor, é o momento em que a promessa da renda fixa deixa de valer, e começa uma negociação em que ele quase sempre recebe menos do que emprestou.",
      "Pode acabar em perda parcial, em renegociação forçada, com prazos esticados e juros cortados, ou, no limite, em perda total.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Para empresas, o default costuma levar à recuperação judicial, em que a empresa continua funcionando enquanto negocia com os credores um plano de pagamento, ou à falência, em que os bens são vendidos para pagar as dívidas numa ordem definida em lei. Credores com garantia recebem antes; acionistas, por último, se sobrar algo.",
          "Historicamente, quem tem títulos de empresas sem garantia específica recupera, em média, perto de 40% do valor nos Estados Unidos, com enorme variação de caso a caso.",
        ],
      },
      {
        titulo: "Quando o devedor é o governo",
        paragrafos: [
          "Para governos, não há falência: há renegociação, às vezes com prazos esticados e juros cortados. O Brasil deixou de pagar ou renegociou a dívida externa várias vezes entre o século 19 e 1987, ano da moratória declarada pelo governo Sarney. O acerto definitivo veio só em 1994, com o Plano Brady.",
          "A Argentina, em 2001, fez o que era então o maior calote de dívida soberana da história, e passou quase quinze anos em disputa com credores nos tribunais americanos.",
        ],
      },
      {
        titulo: "O calote disfarçado",
        paragrafos: [
          "Governos também dão calote na própria moeda, por caminhos menos óbvios. Inflação alta corrói o valor real da dívida. Bloqueio de aplicações, como no Plano Collor, em 1990, impede o credor de usar o dinheiro. Trocas forçadas de títulos mudam as condições no meio do caminho. A Rússia, em 1998, chegou a deixar de pagar títulos na própria moeda.",
          "Por isso o risco de crédito de um governo não se resume à chance de ele parar de pagar: inclui a chance de pagar com uma moeda que vale menos ou de mudar as regras.",
        ],
      },
    ],
    exemplo: "Hipotético: você tem R$ 100 mil em debêntures de uma empresa que entra em recuperação judicial. Depois de dois anos de negociação, o plano aprovado paga 40% do valor, em parcelas ao longo de dez anos, sem correção. Trazido a valor de hoje, o que você recupera fica perto de R$ 20 mil a R$ 25 mil, conforme a taxa usada no desconto.",
    naPratica: "A diferença entre cupom e dividendo está aqui: deixar de pagar o cupom é default; cortar o dividendo é uma decisão do conselho. E concentrar a renda fixa num único país põe todo o risco de default, inclusive o disfarçado, numa só caneta. Ter parte da renda fixa em títulos de outro governo e em outra moeda é uma forma de não depender de uma única promessa.",
    relacionados: [
      "risco-de-credito",
      "rating",
      "spread-de-credito",
      "cupom",
      "divida-publica",
      "moratoria-de-1987",
      "corralito",
      "plano-collor",
    ],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "23:49" },
      { modulo: 1, aula: 2, tempo: "12:08" },
    ],
  },
];

import type { Verbete } from "@/lib/glossario";

// Verbetes: Macro e contas públicas, História do Brasil. Separados por bloco de categorias em 07/out/2026 para a revisão
// paralela (um agente por arquivo). 65 verbetes. Em 07/out/2026 cada verbete virou artigo (abertura em `texto`,
// seções em `secoes`), conforme docs/GLOSSARIO-ARTIGOS.md.
export const VERBETES_MACRO_BRASIL: Verbete[] = [
  {
    slug: "pib",
    termo: "Produto Interno Bruto",
    sigla: "PIB",
    categoria: "Macro e contas públicas",
    apelidos: ["PIBs", "produto interno", "PIB mundial", "PIB per capita"],
    resumo: "O valor de tudo o que um país produz num período, de pão a software. É a régua mais usada para medir o tamanho de uma economia e quanto ela cresce.",
    texto: [
      "Pense em tudo o que foi produzido no Brasil num ano: a soja colhida em Mato Grosso, o carro montado no ABC, a consulta no posto de saúde, o aplicativo de entrega, o corte de cabelo. Some o valor de cada coisa, sem contar duas vezes o que virou insumo de outra, e você tem o Produto Interno Bruto, o PIB.",
      "Em 2025, pelas contas do IBGE, esse total chegou a R$ 12,7 trilhões, com crescimento real de 2,3% sobre o ano anterior. Dividido pela população, deu perto de R$ 60 mil por pessoa. É a régua mais usada no mundo para medir o tamanho de uma economia e a velocidade com que ela cresce.",
      "O PIB não mede felicidade, riqueza acumulada nem distribuição de renda. Mede fluxo: quanto foi produzido num período. Mesmo com essas limitações, é o número que organiza quase toda a conversa sobre economia, da dívida do governo ao lucro das empresas.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O IBGE calcula o PIB por três caminhos que, em tese, chegam ao mesmo lugar. Pela produção, soma o valor que cada setor adiciona: agropecuária, indústria e serviços. Pela despesa, soma o que foi gasto: consumo das famílias, gasto do governo, investimento e exportações, menos as importações. Pela renda, soma salários, lucros, aluguéis e impostos.",
          "O cuidado central é não contar duas vezes. O aço que vira carro entra uma vez só, dentro do carro. Por isso se fala em valor adicionado: cada etapa conta apenas o que acrescentou ao que comprou da etapa anterior.",
          "Existe o PIB nominal, em reais correntes, inflado pelos preços, e o PIB real, descontada a inflação. Quando o jornal diz que o PIB cresceu 2%, fala da conta real: a economia produziu 2% a mais em quantidade, não em preço. O IBGE divulga o número a cada trimestre e revisa os anteriores conforme chegam dados melhores, por isso o crescimento de um ano pode mudar um pouco depois da primeira divulgação.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Para comparar países, o PIB precisa virar uma moeda comum, quase sempre o dólar, e aí o câmbio pesa muito. Se o real perde 20% de valor num ano, o PIB brasileiro medido em dólar encolhe perto disso, mesmo que nada tenha mudado dentro do país. É por isso que o Brasil sobe e desce no ranking das maiores economias sem que a produção tenha mudado tanto.",
          "Uma alternativa é a paridade do poder de compra, que ajusta o PIB pelo custo de vida de cada lugar. Um corte de cabelo custa menos em São Paulo do que em Nova York, e essa conta corrige a diferença. Pelas projeções do FMI para 2026, o Brasil produz cerca de US$ 2,6 trilhões a câmbio de mercado, contra US$ 126 trilhões do mundo: perto de 2% do total.",
        ],
      },
      {
        titulo: "Os números que contam a história",
        paragrafos: [
          "O PIB brasileiro já teve anos de crescimento acima de 7%, como 2010, e anos de queda forte. Caiu 3,5% em 2015 e 3,3% em 2016, a pior sequência da série moderna, e de novo 3,3% em 2020, com a pandemia. Em 2025, cresceu 2,3%, puxado por uma safra recorde.",
          "Por trás dessas oscilações há uma tendência mais lenta: o crescimento médio do país vem caindo década a década desde os anos 1970. Esse ritmo de fundo, que não depende de um ano bom ou ruim, é o que os economistas chamam de crescimento potencial.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O PIB é o pano de fundo do lucro das empresas, da arrecadação do governo e da capacidade de pagar a dívida pública. Quando ele cresce pouco por muito tempo, todas essas contas apertam ao mesmo tempo.",
          "Mas crescimento alto não garante bolsa boa. O preço das ações já embute expectativas, e empresas listadas podem faturar no mundo inteiro. O PIB serve menos para escolher ativos e mais para lembrar o tamanho da fatia do mundo em que o seu patrimônio está aplicado.",
        ],
      },
    ],
    exemplo: "Hipotético: um país produz o equivalente a R$ 1.000 num ano. No ano seguinte, produz R$ 1.100 em reais correntes, mas os preços subiram 8%. O PIB nominal cresceu 10%; o real, perto de 1,9%, porque 1.100 dividido por 1,08 dá cerca de 1.019. Se nesse mesmo período o real perdeu 10% contra o dólar, o PIB medido em dólar ficou praticamente parado.",
    naPratica: "Se o Brasil é perto de 2% da economia mundial, 98% da riqueza produzida, das empresas e das oportunidades estão fora daqui. Você já está exposto ao PIB brasileiro pelo seu salário, pela sua casa e pelo seu negócio. Ter também todo o patrimônio financeiro no país é concentrar tudo numa fatia pequena do mundo, por mais que ela seja a sua casa.",
    relacionados: ["crescimento-potencial", "produtividade", "divida-pib", "convergencia-condicional", "home-bias", "paridade-do-poder-de-compra", "recessao-2015-2016"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "3:49" }, { modulo: 0, aula: 2 }, { modulo: 0, aula: 3, tempo: "4:57" }],
  },
  {
    slug: "crescimento-potencial",
    termo: "Crescimento potencial",
    categoria: "Macro e contas públicas",
    apelidos: ["PIB potencial", "crescimento de longo prazo", "potencial de crescimento"],
    resumo: "Quanto uma economia consegue crescer por ano sem acelerar a inflação, usando bem o que tem de gente, máquinas e tecnologia. É o ritmo de cruzeiro, não o pico de um ano bom.",
    texto: [
      "Um carro pode passar de 180 km/h numa reta, mas não aguenta esse ritmo a viagem inteira: o motor esquenta, o combustível acaba. Com a economia é igual. Num ano de safra recorde ou de juro baixo, o PIB pode crescer bem acima do normal. Se o ritmo passa da capacidade de produzir, faltam trabalhadores e máquinas, e os preços começam a subir.",
      "O ritmo sustentável, aquele que a economia aguenta por anos sem acelerar a inflação, é o crescimento potencial. Ele depende de três coisas: quantas pessoas trabalham, quanto capital elas têm à mão (máquinas, estradas, computadores) e quão bem tudo isso é combinado, o que os economistas chamam de produtividade.",
      "No Brasil, as estimativas do potencial costumam ficar perto de 2% ao ano, bem abaixo do que o país cresceu nos anos 1960 e 1970.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Pense numa padaria. Ela pode produzir mais contratando padeiros, comprando outro forno ou organizando melhor o turno para o forno não ficar parado. As duas primeiras saídas custam dinheiro e esbarram em limites: o décimo padeiro numa cozinha pequena atrapalha mais do que ajuda. A terceira não tem teto tão claro.",
          "Na economia inteira, a lógica é a mesma. Mais gente e mais capital fazem o PIB crescer por um tempo. O que sustenta o crescimento da renda por pessoa em prazos longos é a produtividade, a padaria fazendo mais pão com o mesmo forno e os mesmos padeiros.",
          "O potencial não aparece em nenhuma estatística oficial. É uma estimativa, feita pelo Banco Central, pelo Tesouro e por economistas privados, e cada método chega a um número um pouco diferente. O que importa é a ordem de grandeza e a direção.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "Entre 1940 e 1980, o Brasil cresceu perto de 7% ao ano. Boa parte desse ritmo veio de acumular: gente saindo do campo para a cidade, população crescendo rápido, investimento pesado em indústria e infraestrutura. A produtividade ajudou, mas foi a parte menor.",
          "Esse motor perdeu força. A população em idade de trabalhar está perto de parar de crescer, e o investimento do país fica em torno de 17% do PIB, baixo para padrões de emergentes que cresceram rápido. Sem gente nova entrando no mercado em grande quantidade, o potencial passa a depender quase só de produtividade.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Quando a economia cresce acima do potencial, o Banco Central tende a subir os juros para conter a inflação. Quando cresce abaixo, há espaço para cortar. Por isso o potencial é uma peça escondida em quase toda decisão do Copom.",
          "Ele também funciona como teto para o lucro agregado das empresas de um país e para a capacidade do governo de pagar a dívida. Se o potencial é de 2% e o juro real é de 6%, a conta pública precisa de superávit só para a dívida não crescer em relação ao PIB.",
        ],
      },
    ],
    exemplo: "Hipotético: um país cresce 4% num ano, mas o potencial dele é 2%. Fábricas operam no limite, falta mão de obra, salários e preços sobem, e o banco central reage com juro mais alto. No ano seguinte o crescimento volta para perto dos 2%, e a inflação extra fica como conta a pagar. Agora o inverso: crescer 1% com potencial de 2% deixa máquinas paradas e gente desempregada, e a inflação tende a cair.",
    naPratica: "Um potencial baixo não significa bolsa ruim nem real fraco num ano específico. Significa que o país em que você mora tende a andar devagar por bastante tempo, e que a sua renda do trabalho e o seu imóvel já dependem desse ritmo. Ter parte do patrimônio em economias com outros motores de crescimento é uma forma de não amarrar tudo a uma única velocidade de cruzeiro.",
    relacionados: ["pib", "produtividade", "bonus-demografico", "demografia", "convergencia-condicional", "juro-real", "divida-pib"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "30:33" }],
  },
  {
    slug: "produtividade",
    termo: "Produtividade",
    categoria: "Macro e contas públicas",
    apelidos: ["produtividade do trabalho", "produtividade total dos fatores", "PTF", "ganho de produtividade"],
    resumo: "Quanto se produz com o mesmo esforço. Quando sobe, o país fica mais rico sem precisar de mais gente nem de mais horas de trabalho. É o motor do crescimento de longo prazo.",
    texto: [
      "Na safra 1976/77, a primeira da série da Conab, o Brasil colheu 47 milhões de toneladas de grãos em 37 milhões de hectares. Na safra 2024/25, colheu 350 milhões de toneladas em 82 milhões de hectares. A área pouco mais que dobrou; a produção foi multiplicada por mais de sete.",
      "A diferença tem nome: produtividade. É quanto se produz com o mesmo esforço, a mesma terra, as mesmas horas. Quando ela sobe, o país fica mais rico sem precisar de mais gente nem de mais horas de trabalho.",
      "No longo prazo, quase toda a diferença de renda entre países ricos e pobres é diferença de produtividade. Um trabalhador americano não trabalha cinco vezes mais horas do que um brasileiro; ele produz mais por hora, porque tem mais máquinas, mais treinamento e um ambiente que desperdiça menos.",
    ],
    secoes: [
      {
        titulo: "Como se mede",
        paragrafos: [
          "Os economistas medem de dois jeitos. A produtividade do trabalho é quanto cada pessoa ocupada, ou cada hora trabalhada, produz. É a mais intuitiva e a mais fácil de calcular.",
          "A produtividade total dos fatores é mais sutil. É o que sobra do crescimento depois de descontar o aumento de gente e de máquinas: a parte que vem de tecnologia, de organização, de instituições e de eficiência. Os economistas também a chamam de resíduo, porque é calculada como a sobra de uma conta.",
          "Essa sobra é a parte que importa a longo prazo. Mais máquinas e mais gente esbarram em limites. Fazer mais com o mesmo, não necessariamente.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "Entre 1940 e 1990, o PIB brasileiro cresceu perto de 5,6% ao ano. Pelas contas reunidas por Robert Barro e Xavier Sala-i-Martin num manual clássico de crescimento, só cerca de um quinto disso veio da produtividade total; o resto veio de acumular capital e trabalho. Nos países ricos do pós-guerra, a produtividade explicou mais de um terço do crescimento.",
          "O agronegócio é a exceção que confirma a regra. Com a Embrapa, criada em 1973, sementes adaptadas ao cerrado, correção de solo e mecanização, a produtividade do campo brasileiro está entre as que mais cresceram no mundo. Já em boa parte dos serviços e da indústria, o avanço foi lento, travado por educação de qualidade desigual, infraestrutura cara, crédito caro e regras complexas.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Produtividade é o que sustenta salário real, lucro e arrecadação ao mesmo tempo. Um país em que ela cresce pouco tende a ter crescimento baixo, contas públicas apertadas e menos espaço para juro baixo.",
          "Também muda a escolha de setores. Parte das áreas em que a produtividade mais cresce hoje, como software, semicondutores e inteligência artificial, quase não tem empresas listadas na bolsa brasileira.",
        ],
      },
    ],
    exemplo: "Hipotético: duas fábricas de 100 funcionários. A primeira produz 1.000 peças por dia; a segunda, depois de trocar uma máquina e reorganizar a linha, 1.300. Com o mesmo número de pessoas, a segunda pode pagar salários maiores, cobrar menos pela peça e ainda lucrar mais. Repita isso em milhares de empresas por décadas e você tem a diferença entre um país que enriquece e um que fica parado.",
    naPratica: "A bolsa brasileira é concentrada em bancos, commodities e energia, setores importantes, mas que não são onde a fronteira da produtividade está se movendo mais rápido. Para ter exposição às empresas que lideram essa fronteira, o caminho passa pelo exterior. Não é uma aposta contra o Brasil; é reconhecer que boa parte da inovação mundial acontece em empresas que a B3 não oferece.",
    relacionados: ["crescimento-potencial", "pib", "convergencia-condicional", "instituicoes", "inteligencia-artificial", "capital-humano", "semicondutor"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "30:33" }],
  },
  {
    slug: "convergencia-condicional",
    termo: "Convergência condicional",
    categoria: "Macro e contas públicas",
    apelidos: ["convergência", "convergência absoluta", "estado estacionário", "teto de renda"],
    resumo: "A ideia de que cada país corre em direção ao próprio teto de renda, definido por suas instituições, educação e contas públicas, e não necessariamente em direção aos países ricos.",
    texto: [
      "Nos anos 1960, Coreia do Sul e Gana tinham renda por pessoa parecida. Seis décadas depois, a Coreia é um país rico, sede de algumas das maiores empresas de tecnologia do mundo. Gana avançou, mas continua longe. Se ser pobre bastasse para crescer rápido, as duas teriam chegado perto do mesmo lugar.",
      "Existe uma intuição popular: país pobre cresce mais rápido porque tem mais espaço para correr atrás. Os dados mostram que isso só vale com uma condição. Cada economia corre em direção ao próprio teto de renda, definido por suas instituições, educação, poupança e estabilidade, e não necessariamente em direção aos países ricos.",
      "Essa ideia tem nome: convergência condicional. Convergência porque os países se aproximam de um ponto de chegada; condicional porque esse ponto depende das condições de cada um.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A teoria nasceu do modelo de crescimento de Robert Solow, dos anos 1950. Nele, um país com pouco capital ganha muito com cada máquina nova, e por isso cresce depressa no começo. Conforme o capital se acumula, cada máquina a mais rende menos, e o crescimento desacelera até um ponto de equilíbrio.",
          "Nos anos 1990, os economistas Robert Barro e Xavier Sala-i-Martin testaram a ideia com dados de mais de cem países. A conclusão: comparando todos os países juntos, os pobres não cresceram mais que os ricos entre 1960 e 2000. Mas, quando se controla por escolaridade, estabilidade, tamanho do governo e regras, a convergência aparece com clareza.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Pense em dois corredores. Um está a 10 km da sua linha de chegada; o outro, a 2 km. O primeiro corre mais rápido, mas o que importa é a distância até a linha dele, e não a distância até o vencedor da prova.",
          "A velocidade também é lenta. Pelos estudos clássicos, a distância até o ponto de chegada fecha cerca de 2% ao ano, o que dá algo como 35 anos para percorrer metade do trajeto. Mesmo um país que faz tudo certo leva gerações para colher o resultado inteiro.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Pelas séries históricas usadas nesses estudos, a renda por pessoa do Brasil passou de cerca de 15% da americana em 1900 para perto de 25% no fim dos anos 1980. O país cresceu mais que os Estados Unidos no século 20, mas fechou só uma parte pequena da distância.",
          "A Argentina fez o caminho inverso: tinha quase metade da renda americana por pessoa no começo do século 20 e terminou os anos 1980 com cerca de um quarto. Ser rico também não garante continuar rico.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "O erro mais frequente é concluir que emergente sempre cresce mais e, portanto, sempre rende mais. O primeiro passo já falha: a convergência é condicional.",
          "O segundo falha também: crescimento do PIB não é retorno de bolsa, porque o preço das ações pode já embutir o crescimento esperado.",
        ],
      },
    ],
    exemplo: "Hipotético: dois países com a mesma renda hoje. Um tem contas públicas equilibradas, escola boa e regras estáveis; o outro, não. O primeiro tem um teto alto e cresce rápido por décadas. O segundo para perto do teto baixo que suas instituições permitem, mesmo continuando pobre, e o investidor que apostou só na pobreza inicial dele ficou esperando um crescimento que não veio.",
    naPratica: "Ser emergente não garante crescer mais. Para quem investe, o recado é de concentração, não de pessimismo: deixar todo o patrimônio num país é apostar que o teto dele vai subir. Espalhar o dinheiro entre economias diferentes evita depender de uma única aposta sobre instituições, educação e contas públicas, sem precisar adivinhar qual país vai crescer mais.",
    relacionados: ["crescimento-potencial", "produtividade", "instituicoes", "pib", "diversificacao", "mercados-emergentes", "capital-humano"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "30:33" }],
  },
  {
    slug: "divida-publica",
    termo: "Dívida pública",
    categoria: "Macro e contas públicas",
    apelidos: ["dívida bruta", "dívida líquida", "dívida do governo", "dívida pública federal", "dívida bruta do governo geral", "DBGG"],
    resumo: "Tudo o que o governo deve, sobretudo em títulos vendidos a bancos, fundos e pessoas. Cresce quando o governo gasta mais do que arrecada e com os juros sobre o que já deve.",
    texto: [
      "Quando o governo gasta mais do que arrecada, precisa pegar dinheiro emprestado. Faz isso vendendo títulos, como os que você compra no Tesouro Direto. Quem compra empresta ao governo e recebe juros. A soma de todos esses empréstimos é a dívida pública.",
      "No Brasil, ela é quase toda em reais e está espalhada por bancos, fundos de investimento, fundos de pensão, seguradoras, estrangeiros e pessoas físicas. Se você tem um fundo DI, um CDB ou previdência privada, é muito provável que parte do seu dinheiro esteja financiando o governo, direta ou indiretamente.",
      "A dívida, em si, não é problema. Quase todo país tem. O que importa é o tamanho em relação à economia, o juro que se paga, o prazo e a confiança de que o governo vai conseguir rolá-la.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Um título público é uma promessa: o Tesouro recebe hoje e devolve depois, com juros. Quando um título vence, o governo raramente paga com dinheiro guardado. Ele emite um título novo e usa o dinheiro para pagar o antigo. Isso se chama rolar a dívida.",
          "A rolagem funciona enquanto há gente disposta a comprar os títulos novos. Se a confiança cai, os compradores pedem juros maiores ou prazos mais curtos, e a dívida fica mais cara justamente quando o governo está em apuros.",
          "Os títulos brasileiros vêm em três sabores principais: prefixados, com taxa definida na compra; atrelados à Selic, que acompanham o juro básico dia a dia; e atrelados à inflação, que pagam juro real mais o IPCA.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Há dois números principais. A dívida bruta soma tudo o que o governo deve. A dívida líquida desconta o que ele tem a receber, como as reservas internacionais. Os critérios também mudam entre instituições: o FMI conta os títulos que estão na carteira do Banco Central, e o próprio Banco Central não, por isso o número do FMI fica mais alto.",
          "Em dezembro de 2025, a dívida bruta do governo geral era de 78,6% do PIB pelo critério do Banco Central. Pelo critério do FMI, a projeção para 2026 é de 96,5%. E há uma particularidade brasileira: quase metade da dívida federal acompanha a Selic, contra pouco mais de 2% da americana atrelada a juro flutuante.",
        ],
      },
      {
        titulo: "Por que essa composição importa",
        paragrafos: [
          "Quando quase metade da dívida acompanha a Selic, cada alta de juros encarece rapidamente a conta do governo. É um dos motivos pelos quais o Banco Central brasileiro precisa olhar o fiscal com atenção, e um dos ingredientes do que se chama dominância fiscal.",
          "A composição é herança da inflação alta. Por décadas, ninguém aceitava emprestar ao governo brasileiro por prazo longo a taxa fixa. Os títulos atrelados à taxa diária foram a solução, e ficaram.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "A dívida americana passa de 100% do PIB, e a japonesa, de 200%, e mesmo assim os dois países pagam juros bem menores que o Brasil. A diferença está em três coisas: a moeda, o histórico e o prazo. Títulos do Tesouro americano são o ativo de reserva do mundo; o Japão financia a dívida quase toda com a própria poupança doméstica, a juros baixíssimos por décadas.",
          "O Brasil paga mais porque tem histórico de inflação alta e de calotes, uma dívida mais curta e juro real elevado. Por isso o mesmo nível de dívida que é confortável para um país rico pode ser desconfortável aqui. A comparação justa não é só o tamanho, é o custo de carregá-la.",
        ],
      },
    ],
    exemplo: "Hipotético: o governo tem R$ 100 bilhões em títulos vencendo no mês. Se o mercado está tranquilo, emite títulos novos de cinco anos a 13% ao ano e paga os antigos. Se o mercado está nervoso, só consegue vender papéis de dois anos a 15%. A dívida não aumentou de tamanho naquele dia, mas ficou mais cara e mais curta, e a próxima rolagem chega mais cedo.",
    naPratica: "Quem tem dinheiro em títulos públicos, CDB ou fundo DI está, direta ou indiretamente, emprestando ao governo brasileiro e recebendo pelo risco de fazer isso. Diversificar para fora também é diversificar o devedor: o seu patrimônio deixa de depender de uma única capacidade de pagamento, de um único Tesouro e de uma única moeda.",
    relacionados: ["divida-pib", "resultado-primario", "resultado-nominal", "risco-pais", "selic", "dominancia-fiscal", "tesouro-direto", "titulo-publico"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "23:49" }, { modulo: 0, aula: 2, tempo: "1:24:02" }, { modulo: 0, aula: 3 }],
  },
  {
    slug: "divida-pib",
    termo: "Dívida/PIB",
    categoria: "Macro e contas públicas",
    apelidos: ["dívida sobre o PIB", "relação dívida/PIB", "dívida em relação ao PIB", "aritmética da dívida", "dinâmica da dívida"],
    resumo: "A dívida do governo dividida pelo tamanho da economia. É o jeito de comparar dívidas de países diferentes e de saber se ela está crescendo mais rápido do que a capacidade de pagar.",
    texto: [
      "Uma dívida de R$ 500 mil é pesada para quem ganha R$ 5 mil por mês e leve para quem ganha R$ 500 mil. Com países é igual: a dívida só faz sentido comparada à renda, e a renda de um país é o PIB.",
      "Dívida/PIB é exatamente isso: o tamanho da dívida do governo dividido pelo tamanho da economia num ano. É o jeito de comparar países de tamanhos diferentes e, mais importante, de saber se a dívida está crescendo mais rápido do que a capacidade de pagá-la.",
      "Em dezembro de 2025, a dívida bruta do governo geral brasileiro estava em 78,6% do PIB, pelo critério do Banco Central. Esse número sozinho diz pouco. O que o mercado olha é para onde ele vai.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A relação muda por três forças. Os juros fazem a dívida crescer sozinha, como uma aplicação que rende para o credor. O crescimento da economia aumenta o tamanho do PIB e dilui a dívida. E o superávit primário, a economia que o governo faz antes de pagar juros, abate parte dela.",
          "A conta que resume tudo é a corrida entre o juro real e o crescimento. Se o juro real é maior que o crescimento, a dívida tende a subir sozinha, e o governo precisa de superávit só para a relação ficar parada. Se o crescimento é maior que o juro real, a dívida tende a cair mesmo com algum déficit.",
          "A inflação também mexe na conta, porque infla o PIB em reais e corrói o valor de parte da dívida. Foi o que ajudou a dívida brasileira a recuar de 86,9% para 71,7% do PIB entre 2020 e 2022.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O Japão tem dívida acima de 200% do PIB e paga juros baixos. Os Estados Unidos passam de 100%. O Brasil, com menos de 80% pelo critério do Banco Central, paga juros bem mais altos. A diferença está no histórico, na moeda e no juro real.",
          "Países que emitem moeda de reserva, com histórico longo de pagar o que devem, conseguem carregar dívidas maiores. Um país com histórico de calotes e inflação alta paga um prêmio, e o prêmio torna a dívida mais pesada, num círculo que só a credibilidade quebra.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Quando a conta não fecha, o ajuste costuma vir por juros mais altos, inflação ou câmbio mais fraco. As três coisas atingem quem tem o patrimônio inteiro em reais, mesmo quem nunca comprou um título público.",
          "Você não precisa de modelo sofisticado para acompanhar isso. Três números bastam: o juro real que o governo paga, o crescimento esperado da economia e o resultado primário. Se o primeiro é bem maior que o segundo e o terceiro está no vermelho, a dívida tende a subir, e o mercado vai cobrar por isso.",
        ],
      },
    ],
    exemplo: "Com dívida de 100% do PIB, juro real de 6% e crescimento de 2%, sem superávit nenhum, a dívida vai a quase 104% do PIB no ano seguinte. Para ela ficar parada, o governo precisaria de um superávit primário de cerca de 4% do PIB. Se o juro real cair para 4%, o superávit necessário cai para perto de 2%. É por isso que juro e dívida andam tão juntos no Brasil.",
    naPratica: "É a conta que o mercado faz o tempo todo, e você pode fazê-la de cabeça: juro real, crescimento e superávit. Quando os três números não fecham, o prêmio de risco sobe, e ele aparece no dólar e nos juros longos antes de aparecer na inflação. Ter parte do patrimônio fora dessa conta é uma forma de não depender de que ela feche.",
    relacionados: ["divida-publica", "resultado-primario", "juro-real", "pib", "dominancia-fiscal", "crescimento-potencial", "pandemia-de-2020"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "27:05" }, { modulo: 0, aula: 2, tempo: "52:52" }],
  },
  {
    slug: "resultado-primario",
    termo: "Resultado primário",
    categoria: "Macro e contas públicas",
    apelidos: ["superávit primário", "superávits primários", "déficit primário", "primário", "meta de superávit primário", "meta de primário", "superávit nas contas"],
    resumo: "Quanto sobra ou falta no caixa do governo antes de pagar os juros da dívida. Superávit primário mostra que o governo consegue, ao menos em parte, conter a própria dívida.",
    texto: [
      "Imagine o orçamento de uma família com salário de R$ 10 mil, gastos de R$ 9 mil e R$ 1,5 mil de juros do financiamento do apartamento. Antes dos juros, sobram R$ 1 mil: é um superávit primário. Depois dos juros, faltam R$ 500: é um déficit nominal. As duas coisas são verdade ao mesmo tempo.",
      "No governo é igual. O resultado primário é a receita menos a despesa, sem contar os juros da dívida. Quando sobra, é superávit primário; quando falta, déficit primário.",
      "Por que separar os juros? Porque eles dependem do tamanho da dívida acumulada no passado e da Selic, que o Banco Central define. O primário é a parte que depende das escolhas do governo de agora: quanto arrecada e quanto gasta com salários, aposentadorias, saúde, educação e obras.",
    ],
    secoes: [
      {
        titulo: "Como se mede",
        paragrafos: [
          "O Banco Central mede o resultado pela variação da dívida, olhando o que os governos devem e têm a receber. O Tesouro mede pelo caixa, somando receitas e despesas. Os dois números costumam ficar próximos, mas não idênticos.",
          "Há também o recorte. O governo central inclui Tesouro, Previdência e Banco Central. O setor público consolidado soma estados, municípios e estatais, exceto Petrobras e Eletrobras. A meta oficial da regra fiscal vale para o governo central; o mercado acompanha os dois.",
          "Um detalhe que confunde: o Banco Central publica a necessidade de financiamento do setor público, em que déficit aparece com sinal positivo e superávit com sinal negativo.",
        ],
      },
      {
        titulo: "A história recente",
        paragrafos: [
          "Desde 1999, a meta de primário é um dos três pés do tripé macroeconômico. O Brasil fez superávits acima de 3% do PIB todos os anos de 2002 a 2008, com pico de 3,7% em 2005, no setor público consolidado.",
          "A partir de 2009 o superávit foi encolhendo e, em 2014, virou déficit pela primeira vez na série. Seguiram-se anos no vermelho, o rombo de 9,2% do PIB em 2020, com a pandemia, e um superávit de 1,3% em 2022, ajudado pela inflação e pelas commodities. Em 2025, o setor público fechou com déficit de 0,4% do PIB.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O primário é o termômetro que o mercado usa para medir a disposição do governo de segurar a dívida. Mais do que o número de um ano, conta a direção e a coerência com a regra anunciada.",
          "Quando ele piora sem perspectiva de melhora, o prêmio cobrado no juro longo e no câmbio tende a subir. Foi o que aconteceu entre 2014 e 2015: o superávit sumiu, o dólar subiu forte e o país perdeu o grau de investimento.",
        ],
      },
    ],
    exemplo: "Em 2020, ano da pandemia, o setor público teve déficit primário de 9,2% do PIB, o maior da série, por causa do auxílio emergencial e da queda da arrecadação. Em 2022, voltou a um superávit de 1,3%. Para ter uma noção de escala: com um PIB de R$ 12,7 trilhões, como o de 2025, cada ponto percentual de primário equivale a perto de R$ 127 bilhões por ano.",
    naPratica: "Você não precisa acompanhar cada divulgação mensal. Basta saber a direção: o governo está fazendo superávit suficiente para a dívida parar de crescer? Quando a resposta é não por muitos anos seguidos, a conta tende a chegar ao patrimônio em reais pelo juro, pela inflação ou pelo câmbio. Ter parte do dinheiro fora dessa conta é diversificar esse risco.",
    relacionados: ["resultado-nominal", "divida-pib", "arcabouco-fiscal", "tripe-macroeconomico", "divida-publica", "recessao-2015-2016", "teto-de-gastos"],
    noCurso: [{ modulo: 0, aula: 1 }, { modulo: 0, aula: 2, tempo: "51:10" }],
  },
  {
    slug: "resultado-nominal",
    termo: "Déficit nominal",
    categoria: "Macro e contas públicas",
    apelidos: ["resultado nominal", "déficit nominal do governo", "necessidade de financiamento do setor público", "NFSP", "déficit operacional"],
    resumo: "O resultado das contas do governo depois de pagar os juros da dívida. Mostra quanto a dívida vai precisar crescer para fechar o ano.",
    texto: [
      "Em 2025, o setor público brasileiro teve déficit primário de 0,4% do PIB. Parece pouco. Mas, somando os juros da dívida, o rombo foi de 8,3% do PIB. Entre um número e outro estão perto de 8% do PIB pagos em juros, perto de R$ 1 trilhão num ano.",
      "Esse segundo número é o resultado nominal, ou déficit nominal: as contas do governo depois de pagar os juros. Ele mostra quanto a dívida precisa crescer para fechar o ano.",
      "É por isso que o país pode ter superávit primário e déficit nominal no mesmo ano, e as duas manchetes estarem certas. Uma fala do caixa antes dos juros; a outra, do caixa depois deles.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A conta é simples: resultado nominal é o primário menos os juros nominais da dívida. Se o primário é zero e os juros custam 8% do PIB, o déficit nominal é de 8% do PIB, e a dívida cresce perto disso no ano.",
          "No Brasil, os juros pesam mais do que em quase qualquer país grande, por dois motivos. A dívida é alta para um emergente, e a Selic é alta. Como quase metade da dívida federal acompanha a Selic, cada alta de juros aparece rápido na conta.",
          "O Banco Central publica esse número como necessidade de financiamento do setor público, em que déficit aparece com sinal positivo.",
        ],
      },
      {
        titulo: "Nominal, operacional e real",
        paragrafos: [
          "Com inflação alta, o nominal engana. Parte dos juros só repõe a inflação, e o credor não ficou mais rico com ela. Por isso os economistas olham também o resultado operacional, que tira da conta a correção monetária e fica só com os juros reais.",
          "Nos anos de hiperinflação, o déficit nominal chegava a números absurdos, e o operacional era o que fazia sentido. Com inflação de um dígito, os dois ficam mais próximos, mas a lógica continua: o que pesa de verdade é o juro real sobre a dívida.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Os Estados Unidos também têm déficit nominal alto, perto de 6% do PIB nos últimos anos, mas com juros menores sobre uma moeda de reserva. A diferença é que o mercado aceita financiar o Tesouro americano a taxas baixas por décadas, e o brasileiro cobra um prêmio de risco considerável.",
          "O Japão é o caso extremo do outro lado: dívida acima de 200% do PIB e, por décadas, juros perto de zero, porque a poupança doméstica financia o governo. A lição é que o tamanho do déficit importa, mas o custo de financiá-lo, definido pela confiança, importa tanto quanto.",
        ],
      },
    ],
    exemplo: "Hipotético: dívida de 70% do PIB, juro nominal de 11% ao ano, inflação de 4% e superávit primário de 1% do PIB. Os juros custam cerca de 7,7% do PIB, e o déficit nominal fica perto de 6,7% do PIB, mesmo com o caixa no azul antes dos juros. Descontada a inflação, o déficit operacional é de cerca de 3,9% do PIB. Três números, todos corretos, contando a mesma história.",
    naPratica: "Para entender por que o juro brasileiro é alto, olhe o nominal: é ele que diz quanto o governo precisa tomar emprestado todo ano. E quem empresta, inclusive você via CDB, fundo DI ou Tesouro, cobra pelo risco. O juro alto que você recebe é, em boa parte, a outra face desse déficit, e não um presente do mercado.",
    relacionados: ["resultado-primario", "divida-publica", "divida-pib", "selic", "juro-real", "juro-nominal", "dominancia-fiscal"],
    noCurso: [{ modulo: 0, aula: 2 }],
  },
  {
    slug: "carga-tributaria",
    termo: "Carga tributária",
    categoria: "Macro e contas públicas",
    apelidos: ["carga tributária bruta", "carga de impostos", "arrecadação"],
    resumo: "Quanto o governo arrecada em impostos e contribuições, medido como fatia do PIB. No Brasil, é perto de um terço de tudo o que o país produz.",
    texto: [
      "Some todos os impostos e contribuições pagos num ano no Brasil: o imposto de renda, o INSS, o ICMS embutido na gasolina, o ISS do dentista, o IPTU, o IOF da viagem. Divida pelo PIB. Em 2025, pelas contas do Tesouro Nacional, deu 32,4%, o maior nível da série iniciada em 2010.",
      "Esse número é a carga tributária. Ela diz quanto da economia passa pelas mãos do Estado na forma de tributos. De cada R$ 100 produzidos no país, perto de R$ 32 viraram arrecadação.",
      "Do total de 2025, 21,6 pontos foram do governo federal, 8,4 dos estados e 2,4 dos municípios. É um nível de país rico, com renda de emergente.",
    ],
    secoes: [
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Pelos dados da OCDE, a média dos países ricos ficou em 34,1% do PIB em 2024. Os Estados Unidos arrecadam perto de 25%. O México, menos de 20%. O Brasil está mais perto da Europa do que dos vizinhos latino-americanos.",
          "A comparação com países de renda parecida é a que mais chama a atenção. Na aula, Felippe Hermes cita perto de 34% no Brasil contra cerca de 25% na média dos emergentes. A explicação está no lado do gasto: previdência, assistência e saúde pública numa escala que países de renda parecida não costumam bancar.",
        ],
      },
      {
        titulo: "Como a carga é formada",
        paragrafos: [
          "O Brasil cobra muito sobre consumo e pouco sobre patrimônio. Boa parte da arrecadação vem de tributos embutidos nos preços, que todo mundo paga sem ver, rico ou pobre. Por isso a carga sobre consumo pesa proporcionalmente mais em quem ganha menos.",
          "A trajetória também conta uma história. Pelas séries da época, a carga subiu cerca de sete pontos do PIB só entre 1998 e 2002. Sem o imposto inflacionário, o governo passou a cobrar a conta pela via explícita, com contribuições como a CPMF, que subiu de 0,20% para 0,38% sobre cada movimentação bancária em 1999.",
          "A reforma tributária aprovada em 2023, pela Emenda Constitucional 132, troca cinco tributos sobre consumo por um imposto sobre valor adicionado em dois pedaços, a CBS federal e o IBS de estados e municípios, numa transição que começa em 2026 e vai até 2033. A promessa é simplificar, não necessariamente arrecadar menos.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Com uma carga já alta, subir imposto tem limite. Cada real a mais sai do consumo ou do investimento, e parte da base, como o capital financeiro, pode ir embora ou mudar de forma.",
          "Quando a conta pública não fecha e o imposto já é alto, sobram mais dívida e inflação como saídas.",
        ],
      },
    ],
    exemplo: "Hipotético: uma família gasta R$ 5 mil por mês em compras, contas e serviços. Se um terço do preço desses itens for tributo, como é comum em energia, combustível e telefonia, perto de R$ 1,6 mil do orçamento vai para o governo antes de qualquer imposto de renda. É a parte invisível da carga.",
    naPratica: "A carga alta é um dos elos entre o risco fiscal e o patrimônio de quem tem tudo em reais: se aumentar imposto é difícil, o ajuste tende a vir por outros caminhos. E ela lembra que regras tributárias mudam. Diversificar para fora não livra você do imposto brasileiro, que alcança a renda de quem mora aqui no mundo todo, mas reduz a dependência de uma única política econômica.",
    relacionados: ["resultado-primario", "divida-publica", "iof", "imposto-de-renda", "previdencia", "lei-14754", "arcabouco-fiscal"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "24:45" }],
  },
  {
    slug: "arcabouco-fiscal",
    termo: "Arcabouço fiscal",
    categoria: "Macro e contas públicas",
    apelidos: ["novo arcabouço fiscal", "regime fiscal sustentável", "Lei Complementar 200", "regra fiscal", "regras fiscais"],
    resumo: "A regra fiscal em vigor desde 2023, que substituiu o teto de gastos. Liga o crescimento da despesa ao da receita e fixa metas anuais de resultado primário com margem de tolerância.",
    texto: [
      "Uma regra fiscal é um combinado que o governo faz consigo mesmo, e com quem lhe empresta dinheiro, para não gastar demais. O Brasil já teve várias: a Lei de Responsabilidade Fiscal em 2000, o teto de gastos em 2016 e, desde agosto de 2023, o chamado arcabouço fiscal.",
      "O nome oficial é Regime Fiscal Sustentável, criado pela Lei Complementar 200, de 30 de agosto de 2023. Ele nasceu de uma exigência da Emenda Constitucional 126, de dezembro de 2022, que mandou substituir o teto de gastos por uma regra nova.",
      "A lógica central cabe numa frase: a despesa pode crescer, mas só uma parte do que a receita cresceu, e dentro de um piso e de um teto. Junto vem uma meta anual de resultado primário.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A despesa federal pode crescer, acima da inflação, até 70% da alta real da arrecadação. Se a meta de primário do ano anterior não foi cumprida, o limite cai para 50%. E há um piso e um teto: o gasto sobe pelo menos 0,6% e no máximo 2,5% ao ano acima da inflação, cresça a receita o quanto crescer.",
          "A meta de resultado primário vem com uma banda de tolerância de 0,25 ponto do PIB para cima ou para baixo. Se o governo descumpre a meta, entram gatilhos que restringem, por exemplo, a criação de cargos e o aumento de despesas obrigatórias.",
          "O desenho tem uma consequência importante: como a despesa cresce menos que a receita, o ajuste depende de a arrecadação subir. Por isso a regra veio acompanhada de várias medidas para aumentar receitas.",
        ],
      },
      {
        titulo: "Comparado ao teto",
        paragrafos: [
          "O teto de gastos congelava a despesa em termos reais, sem olhar a receita. Era simples de entender e duro de cumprir, e acabou recebendo exceções por emendas constitucionais.",
          "O arcabouço é mais flexível: permite crescimento real do gasto e se ajusta ao ciclo da economia. O preço da flexibilidade é ser mais difícil de acompanhar, com mais regras e mais itens fora do limite.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Despesas deixadas fora da regra e mudanças nas metas são acompanhadas de perto pelo mercado, porque mexem com a confiança na trajetória da dívida. Em abril de 2024, por exemplo, o governo reduziu as metas de primário para os anos seguintes, e os juros longos subiram.",
          "O efeito aparece primeiro nos juros futuros e no dólar, antes de qualquer número fiscal oficial. Quando o mercado passa a duvidar de que a regra será cumprida, cobra mais caro para financiar o governo por prazos longos, e esse custo chega ao crédito de empresas e famílias.",
        ],
      },
    ],
    exemplo: "Hipotético: se a receita cresce 4% acima da inflação, a despesa pode crescer 2,5%, que é 70% de 4% limitado ao teto da regra. Se a receita não cresce nada, a despesa ainda sobe 0,6%, o piso. Num ano assim, mesmo cumprindo a regra, o resultado primário piora, e a meta vira o freio.",
    naPratica: "Regras fiscais reduzem o risco enquanto são respeitadas. A história brasileira mostra que elas mudam com alguma frequência: três regras em pouco mais de duas décadas. Por isso o mercado olha menos a regra escrita e mais o resultado que aparece, ano após ano, nas contas. Para você, a lição é não depender de que a regra em vigor hoje seja a mesma daqui a dez anos.",
    relacionados: ["teto-de-gastos", "lei-de-responsabilidade-fiscal", "resultado-primario", "divida-pib", "risco-pais", "tripe-macroeconomico"],
  },
  {
    slug: "teto-de-gastos",
    termo: "Teto de gastos",
    categoria: "Macro e contas públicas",
    apelidos: ["Emenda Constitucional 95", "EC 95", "PEC do teto"],
    resumo: "A regra aprovada em dezembro de 2016 que limitou o crescimento da despesa federal à inflação do ano anterior, por até 20 anos. Foi substituída pelo arcabouço fiscal em 2023.",
    texto: [
      "Depois da recessão de 2015 e 2016, o governo apostou numa regra simples o bastante para caber num título de jornal: a despesa federal de cada ano só poderia crescer o equivalente à inflação do ano anterior. Em termos reais, o gasto ficaria congelado.",
      "Era a Emenda Constitucional 95, promulgada em 15 de dezembro de 2016. Valeria por 20 anos, com revisão possível a partir do décimo. A ideia era que, com a economia crescendo e o gasto parado, a despesa perderia peso no PIB aos poucos, e a dívida voltaria a cair.",
      "O teto funcionou como âncora por alguns anos, foi recebendo exceções e acabou substituído pelo arcabouço fiscal, aprovado em 2023.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 2016, o Brasil saía de dois anos de PIB em queda, déficit primário, Selic de 14,25% e grau de investimento perdido. A dívida subia rápido, e o mercado duvidava de que ela fosse parar.",
          "Num orçamento em que a maior parte da despesa é obrigatória por lei, cortar gastos de uma vez era politicamente inviável. A saída foi travar o crescimento da despesa total e deixar o tempo trabalhar. Para valer, a regra foi posta na Constituição, o que a tornava mais difícil de mudar.",
        ],
      },
      {
        titulo: "Como funcionou",
        paragrafos: [
          "Nos primeiros anos, a regra ganhou credibilidade, e o efeito apareceu nos juros. Com a expectativa de dívida sob controle e a inflação em queda, o Banco Central levou a Selic de 14,25% para 6,5% até março de 2018, e depois mais abaixo.",
          "O problema estava dentro do orçamento. Como aposentadorias e salários crescem sozinhos, o espaço para investimento e custeio encolhia todo ano. A pressão por exceções foi aumentando: emendas constitucionais tiraram despesas do teto em 2019, 2021 e 2022, e a de dezembro de 2022 mandou substituí-lo por uma nova regra.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "O teto mostrou duas coisas. Primeiro, que uma regra crível baixa juros: o mercado aceita financiar o governo mais barato quando acredita na trajetória da dívida.",
          "Segundo, que regra fiscal sem reforma do gasto obrigatório tende a estourar.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Regras que limitam a despesa existem em vários países. Suécia e Holanda usam tetos de gasto de vários anos, e a União Europeia tem regras que pedem déficit abaixo de 3% do PIB e dívida abaixo de 60%, frequentemente descumpridas. A diferença do teto brasileiro era a rigidez: congelamento real por 20 anos, escrito na Constituição.",
          "A experiência internacional sugere que regras funcionam melhor quando são flexíveis o bastante para sobreviver a crises e firmes o bastante para não virarem letra morta. O teto brasileiro teve dificuldade com a primeira parte.",
        ],
      },
    ],
    exemplo: "Hipotético: com inflação de 4% e gasto federal de R$ 2 trilhões, o teto do ano seguinte seria de R$ 2,08 trilhões, cresça a arrecadação o quanto crescer. Se as aposentadorias subissem R$ 60 bilhões por conta própria, sobrariam só R$ 20 bilhões de aumento para todo o resto, e algo teria de ser cortado.",
    naPratica: "O teto mostra como uma regra crível pode baixar juros em pouco tempo. E mostra também que regras fiscais brasileiras costumam ter vida curta: uma emenda pensada para 20 anos durou, na prática, perto de seis. Esse risco de mudança de regra é parte do que um patrimônio 100% local carrega sem perceber.",
    relacionados: ["arcabouco-fiscal", "recessao-2015-2016", "resultado-primario", "lei-de-responsabilidade-fiscal", "selic", "previdencia"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:09:04" }],
  },
  {
    slug: "dominancia-fiscal",
    termo: "Dominância fiscal",
    categoria: "Macro e contas públicas",
    apelidos: ["aritmética monetarista desagradável", "aritmética desagradável", "Sargent e Wallace", "monetização", "monetização da dívida"],
    resumo: "Situação em que a dívida do governo é tão pesada que subir juros deixa de segurar a inflação e passa a piorá-la, porque engorda a dívida que um dia pode acabar paga com emissão de dinheiro.",
    texto: [
      "Normalmente, quando a inflação sobe, o banco central sobe os juros. O crédito fica caro, o consumo esfria, o dólar tende a cair e a inflação recua. Funciona porque o governo, do outro lado, ajusta as contas para pagar os juros mais altos.",
      "Agora imagine uma dívida que já está no limite do que o mercado aceita financiar. Cada alta de juros faz a dívida crescer mais rápido, a desconfiança aumenta, o investidor vende reais, o dólar sobe e a inflação vem junto. O remédio vira veneno.",
      "Esse cenário tem nome: dominância fiscal. A política fiscal manda, e a política monetária perde força. É o pesadelo de qualquer banco central e um dos riscos mais discutidos na economia brasileira.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1981, os economistas Thomas Sargent e Neil Wallace publicaram um artigo com um título provocador: aritmética monetarista desagradável. A ideia: se existe um teto para a dívida que o público aceita carregar, juros altos hoje aceleram a dívida e obrigam o governo, mais adiante, a imprimir dinheiro para pagá-la. Sabendo disso, as pessoas já esperam inflação maior, e a inflação de hoje pode subir em vez de cair.",
          "O termo dominância fiscal ficou popular no mercado depois. Olivier Blanchard, que viria a ser economista-chefe do FMI, usou o Brasil de 2002 como exemplo: a alta de juros parecia aumentar o risco de calote e enfraquecer o real, em vez de fortalecê-lo.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "Estudos das contas públicas de 1947 ao começo dos anos 1990 chegam sempre ao mesmo lugar: receitas e gastos só fechavam quando se contava a emissão de moeda. Por quase meio século, o orçamento fechou com a ajuda de quem guardava dinheiro.",
          "O Plano Real, o tripé de 1999 e a Lei de Responsabilidade Fiscal foram tentativas de encerrar esse histórico, proibindo o Banco Central de financiar o Tesouro e criando metas de superávit. Mesmo assim, o debate volta sempre que a dívida sobe rápido, como em 2002, em 2015 e no fim de 2024.",
        ],
      },
      {
        titulo: "Como reconhecer os sinais",
        paragrafos: [
          "A dominância raramente aparece de uma vez. Os sinais costumam ser o dólar subindo junto com os juros, em vez de cair quando o juro sobe; os juros longos subindo mais que os curtos; e as expectativas de inflação se descolando da meta mesmo com a Selic alta.",
          "Nenhum desses sinais, isolado, prova que o país entrou em dominância fiscal. Eles mostram que o mercado começou a duvidar. O antídoto conhecido é o mesmo de sempre: um resultado fiscal crível, que faça a dívida parar de subir, e não só mais juros.",
        ],
      },
    ],
    exemplo: "Hipotético: o banco central sobe o juro de 12% para 15%. Num país com contas sólidas, o dólar cai e a inflação recua. Num país sob dominância fiscal, o mercado lê a alta como mais dívida no futuro, vende reais, o dólar sobe, os importados encarecem e a inflação sobe mesmo com o juro maior.",
    naPratica: "É o cenário em que o juro alto deixa de proteger quem está em reais. A dúvida sobre as contas aparece primeiro no dólar e nos juros longos e só depois na inflação. Ter uma parte do patrimônio em moeda cujo banco central não depende do Tesouro local é uma forma de não ficar exposto a esse único cenário, sem precisar prever se ele vai acontecer.",
    relacionados: ["senhoriagem", "imposto-inflacionario", "divida-pib", "banco-central", "inconsistencia-temporal", "crise-de-2002", "selic"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "16:53" }],
  },
  {
    slug: "senhoriagem",
    termo: "Senhoriagem",
    categoria: "Macro e contas públicas",
    apelidos: ["receita de emissão", "emissão de moeda", "imprimir dinheiro", "imprimindo moeda", "emissão de base monetária"],
    resumo: "O ganho de quem emite o dinheiro. Imprimir uma nota custa centavos, e ela compra o valor de face. Quando o governo usa essa fonte para pagar contas, a conta acaba na inflação.",
    texto: [
      "Uma nota de R$ 100 custa ao Banco Central uma fração pequena desse valor para ser impressa: papel especial, tinta, elementos de segurança. Mas, na sua mão, ela compra R$ 100 em mercadorias. A diferença entre o que a moeda compra e o que custa produzi-la é a senhoriagem.",
      "O nome vem da Idade Média. O senhor feudal que cunhava moedas ficava com a diferença entre o valor de face e o valor do metal usado. Era uma fonte de renda, e uma tentação: bastava pôr menos prata na moeda para ganhar mais.",
      "Hoje a senhoriagem é o ganho de quem emite dinheiro. Em doses pequenas, é uma receita normal de qualquer banco central. O problema começa quando o governo passa a depender dela para fechar o orçamento.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Pense no papel-moeda como um empréstimo sem juros que você faz ao Banco Central. Você guarda a nota, que não rende nada, e o Banco Central aplica o equivalente em títulos que rendem. O lucro dessa diferença, no Brasil, acaba transferido ao Tesouro.",
          "Enquanto a economia cresce e as pessoas precisam de mais dinheiro para transações, emitir moeda na mesma proporção não gera inflação. A senhoriagem, nesse caso, é saudável e pequena.",
          "Quando o governo emite dinheiro para pagar despesas que não cabem no orçamento, a história muda. Mais dinheiro circulando sem mais produção vira preço mais alto. A senhoriagem cresce, mas quem paga é quem tem moeda parada, pela inflação.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "No Brasil, a senhoriagem foi peça central das contas públicas por quase meio século antes do real. Estudos com dados de 1947 ao começo dos anos 1990 mostram que receitas e gastos só fechavam quando se contava a emissão de moeda.",
          "Até 1986, uma conta chamada conta movimento ligava o Banco Central ao Banco do Brasil e permitia que o dinheiro saísse do emissor para gastos do governo quase sem controle. A Constituição de 1988 proibiu o Banco Central de emprestar ao Tesouro, e a Lei de Responsabilidade Fiscal, em 2000, fechou outras portas, como a de o governo se financiar nos bancos que controla.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Pelas contas dos economistas Rubens Penha Cysne e Paulo Coimbra-Lisboa, a perda de quem guardava papel-moeda e depósitos chegou a perto de 5% do PIB em 1993, somando Banco Central e bancos.",
          "Em 1995, já com o real, tinha caído para menos de 0,5%. A outra face dessa receita, vista do lado de quem guarda dinheiro, é o imposto inflacionário.",
        ],
      },
    ],
    exemplo: "Hipotético: a economia precisa de R$ 100 bilhões em dinheiro circulando e cresce 2% ao ano. O Banco Central emite R$ 2 bilhões a mais, e os preços não se mexem: senhoriagem sadia. Agora o governo manda emitir R$ 30 bilhões para cobrir um rombo. Com a mesma produção e 30% mais dinheiro, os preços tendem a subir, e o ganho do governo sai do bolso de quem tinha reais parados.",
    naPratica: "Uma moeda é uma promessa de quem a emite. Quando você deixa todo o patrimônio numa só moeda, aposta que esse emissor não vai recorrer à impressora quando as contas apertarem. Diversificar entre moedas é diversificar essa promessa, sem precisar achar que o emissor de hoje vai quebrá-la.",
    relacionados: ["imposto-inflacionario", "dominancia-fiscal", "hiperinflacao", "banco-central", "inflacao", "lei-de-responsabilidade-fiscal", "funcoes-da-moeda"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "16:53" }],
  },
  {
    slug: "imposto-inflacionario",
    termo: "Imposto inflacionário",
    categoria: "Macro e contas públicas",
    apelidos: ["impostos inflacionários", "transferências inflacionárias", "imposto da inflação"],
    resumo: "O poder de compra que a inflação tira de quem guarda dinheiro parado. Não passa pelo Congresso nem aparece no orçamento, mas transfere riqueza para quem emite a moeda.",
    texto: [
      "Pense em R$ 1.000 parados na conta num mês de inflação de 30%. No fim do mês, eles compram o que R$ 770 compravam. Esses R$ 230 de poder de compra não sumiram: ficaram com quem emite o dinheiro.",
      "Isso tem nome: imposto inflacionário. É o poder de compra que a inflação tira de quem guarda dinheiro parado. Não passa pelo Congresso, não aparece no orçamento, não tem alíquota publicada no Diário Oficial. Mesmo assim, transfere riqueza de um lado para outro, todo mês.",
      "No Brasil dos anos 1980 e começo dos 1990, ele foi uma das maiores fontes de receita do Estado, e também de lucro dos bancos.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Uma parte do imposto vai para o Banco Central, dono do papel-moeda. Ele emite as notas, que perdem valor nas suas mãos, enquanto o governo usa o dinheiro novo para pagar contas.",
          "Outra parte ia para os bancos. Eles recebiam o seu depósito à vista, que não rendia nada, e aplicavam o dinheiro a juros que acompanhavam a inflação. A diferença ficava com eles.",
          "Quanto maior a inflação e quanto mais dinheiro parado na economia, maior o imposto. Com inflação muito alta, as pessoas reduzem o dinheiro parado ao mínimo, e a base do imposto encolhe. É um imposto que, levado ao extremo, destrói a própria base.",
        ],
      },
      {
        titulo: "Quem pagava",
        paragrafos: [
          "Ele pesa mais sobre quem tem menos acesso a aplicações protegidas. Quem tinha conta remunerada, overnight ou dólar se defendia. Quem recebia salário em dinheiro e gastava ao longo do mês perdia um pouco a cada dia. Era comum fazer a compra do mês no dia do pagamento, com o carrinho cheio, antes que os preços mudassem.",
          "Por isso a hiperinflação brasileira foi também uma máquina de concentração de renda: tirava proporcionalmente mais de quem tinha menos.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "Até 1993, a inflação transferia de 3% a 7% do PIB por ano a quem emitia moeda, somando Banco Central e bancos, pelas contas de Rubens Penha Cysne e Paulo Coimbra-Lisboa. Quando o real derrubou a inflação, o ganho dos bancos com depósitos caiu de quase 2% do PIB em 1993 para menos de 0,1% em 1995, e parte do sistema que vivia disso quebrou.",
          "Para ter uma ideia de escala, 5% do PIB é mais do que o governo federal gasta hoje com saúde num ano. Era uma receita enorme, cobrada sem lei específica, e que desapareceu em poucos meses depois de julho de 1994. O buraco que ela deixou teve de ser coberto por impostos explícitos e por dívida.",
        ],
      },
    ],
    exemplo: "Hipotético: um trabalhador recebe R$ 3.000 no dia 1º e gasta R$ 100 por dia ao longo do mês, com inflação de 30% ao mês. Na média, ele carrega R$ 1.500 em dinheiro parado. Ao fim do mês, terá perdido perto de R$ 300 em poder de compra sem pagar nenhum imposto declarado. Quem recebe o mesmo salário e aplica no overnight perde quase nada.",
    naPratica: "Quando o imposto inflacionário some, o governo perde uma receita que não precisava de votação, e o rombo que ela escondia aparece. Foi o que aconteceu depois de 1994. Esse risco, de a conta pública voltar a ser paga por quem guarda a moeda, é o motivo de fundo para que a reserva de valor do seu patrimônio não dependa só de uma moeda.",
    relacionados: ["senhoriagem", "hiperinflacao", "inflacao", "plano-real", "overnight", "proer", "poder-de-compra"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "2:56" }],
  },
  {
    slug: "risco-pais",
    termo: "Risco-país",
    categoria: "Macro e contas públicas",
    apelidos: ["risco país", "risco Brasil", "prêmio de risco país", "prêmio de risco soberano", "spread soberano"],
    resumo: "Quanto um país paga a mais que o governo americano para pegar dinheiro emprestado em dólar. É o preço, cotado todo dia, da chance de o combinado não ser cumprido.",
    texto: [
      "Se o Tesouro americano paga 4% ao ano por um título de dez anos e o governo brasileiro precisa pagar 6,5% num título parecido, também em dólar, a diferença de 2,5 pontos é o risco-país. É quanto o mercado cobra a mais para emprestar ao Brasil do que para emprestar ao governo dos Estados Unidos.",
      "No mercado, a diferença é contada em pontos-base: 100 pontos equivalem a 1 ponto percentual ao ano. Um risco-país de 250 pontos significa pagar 2,5% ao ano acima dos títulos americanos.",
      "É o preço, cotado todo dia, da chance de o combinado não ser cumprido. Junta tudo o que pode dar errado: calote, renegociação forçada, mudança de regra, crise política, desvalorização.",
    ],
    secoes: [
      {
        titulo: "Como se mede",
        paragrafos: [
          "Por muito tempo a medida mais citada foi o EMBI+, do JP Morgan, que comparava títulos de emergentes em dólar com títulos do Tesouro americano de prazo parecido. O índice foi descontinuado em julho de 2024.",
          "Hoje se usa muito o CDS de cinco anos, uma espécie de seguro contra calote negociado entre bancos e fundos. Também se olha a diferença entre os juros longos em reais e os americanos, que embute, além do risco de calote, a expectativa de inflação e de desvalorização do real.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Na eleição de 2002, o EMBI+ Brasil bateu 2.443 pontos em 27 de setembro: o país pagava 24 pontos percentuais acima dos títulos americanos. Em 2007, a média do ano foi de 181 pontos. A dívida não tinha mudado de tamanho na mesma proporção; o que mudou foi a confiança.",
          "Outros saltos marcam a história recente. Em 2015, com a recessão e a perda do grau de investimento, o indicador voltou a passar de 400 pontos em vários momentos. No Joesley Day, em maio de 2017, subiu 42 pontos num único dia.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O risco-país não fica só nos títulos em dólar. Ele contamina o juro em reais, o câmbio e o preço das ações, porque todos os ativos de um país dividem a mesma base de risco. Quando ele sobe, o dólar costuma subir, os juros longos também e a bolsa cai.",
          "É por isso que, numa crise brasileira, trocar uma ação local por outra, ou um título público por outro, protege pouco. Tudo depende da mesma percepção sobre o país.",
        ],
      },
    ],
    exemplo: "Hipotético: uma empresa brasileira quer tomar US$ 100 milhões emprestados por cinco anos. Se o Tesouro americano paga 4% e o risco-país está em 200 pontos, ela pagará algo acima de 6%, porque o risco dela parte do risco do país. Se o risco-país dobra para 400 pontos, o custo sobe para mais de 8%, e o projeto que fazia sentido pode deixar de fazer.",
    naPratica: "O risco-país explica por que o juro brasileiro é alto: não é um presente para o poupador, é a remuneração por carregar o risco do país. Uma aplicação 100% em reais não é um porto neutro. É o próprio risco Brasil, com remuneração. Diversificar para fora é escolher carregar só uma parte dele.",
    relacionados: ["embi", "cds", "rating-soberano", "selic", "crise-de-2002", "premio-de-risco", "joesley-day", "grau-de-investimento"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "26:22" }, { modulo: 0, aula: 2, tempo: "44:20" }],
  },
  {
    slug: "embi",
    termo: "EMBI+",
    categoria: "Macro e contas públicas",
    apelidos: ["EMBI", "EMBI+ Brasil", "Emerging Markets Bond Index", "índice do JP Morgan"],
    resumo: "Índice do JP Morgan que media quanto os títulos em dólar de países emergentes pagavam acima dos títulos americanos. Foi por décadas a régua mais conhecida do risco-país brasileiro.",
    texto: [
      "Durante três décadas, quando um telejornal dizia que o risco-país do Brasil subiu, quase sempre estava citando o mesmo número: o EMBI+ Brasil, do banco americano JP Morgan.",
      "EMBI é a sigla em inglês de Índice de Títulos de Mercados Emergentes. O JP Morgan montava uma cesta de títulos que governos emergentes vendem em dólar e calculava, todo dia, quanto eles rendiam a mais que títulos do Tesouro americano de prazo parecido. O resultado, em pontos, era o EMBI+. A versão para o Brasil virou sinônimo de risco-país.",
      "O índice foi descontinuado em julho de 2024. A série que ele deixou continua sendo uma das melhores maneiras de contar a história econômica recente do Brasil em um gráfico só.",
    ],
    secoes: [
      {
        titulo: "Como funcionava",
        paragrafos: [
          "Pense numa régua entre dois devedores que pagam na mesma moeda, o dólar. De um lado, o governo americano, considerado o devedor mais seguro do mundo. Do outro, o governo brasileiro. A diferença de juros entre os dois, título contra título, de prazo parecido, é o prêmio que o mercado exige para correr o risco Brasil.",
          "Como os dois títulos são em dólar, o risco de câmbio sai da conta. Sobra o risco de calote, de renegociação e de mudança de regra. Cada 100 pontos equivalem a 1 ponto percentual de juros ao ano.",
          "A família tinha vários membros. O EMBI+ olhava os títulos mais negociados; o EMBI Global, uma cesta mais ampla, e é este que o JP Morgan mantém.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "A série brasileira, que começa nos anos 1990, conta a história do país: mais de 1.000 pontos na média de 1995 e de 1999, pico de 2.443 em setembro de 2002, menos de 200 no auge da confiança, em 2007 e entre 2011 e 2012. Depois, novas altas com a recessão de 2015 e a pandemia de 2020.",
          "Repare que os maiores saltos coincidem com eventos que pouco tinham a ver com a capacidade imediata de pagamento: uma eleição, uma crise externa, uma pandemia. O índice media mais a confiança do que a contabilidade.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Os picos do EMBI+ coincidem com os saltos do dólar e com as quedas da bolsa brasileira. Em 2002, 2008, 2015 e 2020, o risco-país, o câmbio e o Ibovespa se moveram juntos, porque respondiam à mesma causa.",
          "Para quem tinha o patrimônio todo no Brasil, esses movimentos conjuntos significavam perder em todas as frentes ao mesmo tempo. Para quem tinha parte em dólar, o salto do câmbio compensava, em reais, parte da queda do resto.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "O EMBI media o risco de títulos em dólar, não o juro em reais. Um título público em reais embute, além do risco de calote, a expectativa de inflação e de desvalorização do real, por isso paga bem mais do que o risco-país sugere. Para a dívida em moeda local, o JP Morgan tem outra família de índices.",
          "Outro ponto: o EMBI media prêmio, não probabilidade. Um risco-país de 1.000 pontos não quer dizer 10% de chance de calote. Quer dizer que o mercado exigia 10 pontos percentuais a mais por ano para carregar o risco.",
        ],
      },
    ],
    exemplo: "Em 2002, o EMBI+ Brasil teve média de 1.364 pontos no ano: o país pagava, em média, quase 14 pontos percentuais acima dos títulos americanos. Em 2007, a média foi de 181 pontos, menos de 2 pontos acima. Com uma dívida externa de US$ 10 bilhões, a diferença entre os dois anos seria de mais de US$ 1 bilhão em juros por ano.",
    naPratica: "O gráfico do EMBI+ é a prova visual de que câmbio, juro e ações do mesmo país respondem à mesma causa. Ter todo o patrimônio no Brasil é estar exposto, de uma vez, ao mesmo termômetro de confiança. Ter parte fora faz com que nem tudo dependa dele.",
    relacionados: ["risco-pais", "cds", "crise-de-2002", "rating-soberano", "treasury", "mercados-emergentes", "correlacao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "44:20" }],
  },
  {
    slug: "cds",
    termo: "Credit default swap",
    sigla: "CDS",
    categoria: "Macro e contas públicas",
    apelidos: ["CDS de cinco anos", "CDS de 5 anos", "seguro contra calote", "swap de crédito"],
    resumo: "Um contrato que funciona como seguro contra o calote de um devedor. O preço do CDS de um país, cotado todo dia, é uma das medidas mais usadas do risco-país.",
    texto: [
      "Imagine que você tem um título da dívida de um país e quer se proteger de um calote. Você paga um prêmio anual a alguém que se compromete a cobrir a perda se o país não pagar. Esse contrato existe e tem nome: credit default swap, ou CDS.",
      "Funciona como um seguro. Quem compra a proteção paga um valor por ano; quem vende recebe esse valor e, se o devedor der calote, cobre a diferença entre o valor de face do título e o que ele passou a valer.",
      "O preço é cotado em pontos-base por ano sobre o valor protegido. Um CDS de 150 pontos significa pagar 1,5% ao ano do valor para ter a proteção. O mais acompanhado é o de cinco anos.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O CDS nasceu nos anos 1990, em grandes bancos americanos, como forma de transferir o risco de crédito de empréstimos sem precisar vendê-los. Cresceu rápido e virou um dos mercados mais importantes do sistema financeiro.",
          "Também ficou famoso pelo lado ruim. Na crise de 2008, a seguradora americana AIG tinha vendido proteção demais sobre papéis ligados a hipotecas e precisou de socorro do governo. Em 2012, a renegociação da dívida da Grécia acionou os contratos de CDS sobre o país.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Você não precisa ter o título para comprar o CDS. Muita gente compra só para apostar que o risco vai subir ou para se proteger de forma indireta, por exemplo, um banco com muitos empréstimos a empresas de um país.",
          "Como é negociado o tempo todo, o CDS reage rápido a notícias. Uma eleição, uma regra fiscal mudada ou uma crise externa aparecem no preço em minutos. Por isso virou a régua preferida do risco-país depois que o EMBI+ foi descontinuado.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "O CDS não é uma previsão de calote. Um CDS de 200 pontos não significa 2% de chance de o país não pagar.",
          "O preço mistura a probabilidade de calote, a perda esperada se ele acontecer e um prêmio pela incerteza. Serve mais para comparar momentos e países do que para calcular probabilidades exatas.",
        ],
      },
    ],
    exemplo: "Hipotético: um investidor protege US$ 10 milhões em títulos brasileiros com um CDS a 150 pontos. Ele paga US$ 150 mil por ano. Se o Brasil der calote e o título passar a valer 40% do valor de face, recebe US$ 6 milhões, a diferença. Se nada acontecer, pagou o seguro e ficou com o título, como quem paga o seguro do carro sem bater.",
    naPratica: "Quando o CDS do Brasil sobe, costumam subir junto o dólar e os juros longos, e a bolsa costuma cair. Acompanhar esse número ajuda a entender o humor do mercado com o país, sem precisar adivinhar o próximo movimento. E mostra que o risco do país é cotado e precificado todo dia, mesmo quando ninguém fala dele.",
    relacionados: ["risco-pais", "embi", "rating-soberano", "grau-de-investimento", "divida-publica", "crise-de-2008", "risco-de-credito"],
  },
  {
    slug: "rating-soberano",
    termo: "Rating soberano",
    categoria: "Macro e contas públicas",
    apelidos: ["ratings", "nota soberana"],
    resumo: "A nota que agências como S&P, Moody's e Fitch dão à capacidade de um governo pagar suas dívidas. Vai de AAA, o melhor, até a nota de calote.",
    texto: [
      "Assim como um banco avalia se você paga o financiamento antes de liberar o crédito, três agências privadas avaliam se governos pagam as suas dívidas: S&P, Moody's e Fitch. A nota que elas dão a um país é o rating soberano.",
      "A escala vai de AAA, risco mínimo, descendo por AA, A, BBB, BB, B, CCC e assim por diante, até a nota de calote. Cada letra tem degraus intermediários, com sinais de mais e de menos. A Moody's usa letras um pouco diferentes: Aaa no topo, Ba1 no lugar de BB+, Baa3 no lugar de BBB-.",
      "Em 2026, o Brasil tem BB pela S&P e pela Fitch e Ba1 pela Moody's: de um a dois degraus abaixo do grau de investimento, que perdeu entre 2015 e 2016.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "As agências olham contas públicas, crescimento, instituições, dívida externa, reservas e histórico de pagamento. Também pesam a moeda: um país que deve na própria moeda tem mais saídas do que um que deve em moeda estrangeira.",
          "Junto com a nota vem a perspectiva: positiva, estável ou negativa. Ela sinaliza para onde a nota pode ir nos próximos um ou dois anos. Uma perspectiva positiva costuma anteceder uma alta; uma negativa, um rebaixamento.",
          "As notas mudam devagar e raramente antecipam crises. Muitas vezes só confirmam o que o mercado já precificou no risco-país e no CDS.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O Brasil ganhou o grau de investimento da S&P em abril de 2008, da Fitch em maio de 2008 e da Moody's em setembro de 2009, no auge do ciclo de commodities. Perdeu na S&P em setembro de 2015, na Fitch em dezembro de 2015 e na Moody's em fevereiro de 2016, no meio da recessão.",
          "Nem os Estados Unidos estão imunes. A S&P tirou o AAA americano em 2011, a Fitch em 2023 e a Moody's em 2025, todas citando a trajetória da dívida. O país continua com notas altíssimas, mas o recado é que nenhuma nota é eterna.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Muitos fundos de pensão, seguradoras e fundos de índice do mundo só podem comprar títulos com grau de investimento.",
          "Perder a nota tira compradores do país de uma vez e costuma pesar no câmbio e no juro. Ganhar a nota faz o caminho inverso.",
        ],
      },
    ],
    exemplo: "Hipotético: um fundo de pensão europeu tem regra que só permite títulos com nota BBB- ou melhor. Se um país cai de BBB- para BB+, o fundo precisa vender os títulos em poucos meses, mesmo que o gestor ache que o país vai pagar. Multiplique isso por centenas de fundos e você tem uma onda de venda que derruba preços e pressiona o câmbio.",
    naPratica: "A nota de crédito é mais um sinal de como o mundo enxerga o risco Brasil, e de quanto o preço dos ativos daqui pode oscilar com uma decisão de agência. Não serve para prever crise. Serve para lembrar que o seu patrimônio em reais está atrelado a um devedor que o mercado classifica como especulativo, e que isso faz parte do preço do juro alto que ele paga.",
    relacionados: ["grau-de-investimento", "risco-pais", "cds", "recessao-2015-2016", "divida-publica", "rating", "superciclo-de-commodities"],
  },
  {
    slug: "grau-de-investimento",
    termo: "Grau de investimento",
    categoria: "Macro e contas públicas",
    apelidos: ["investment grade", "grau especulativo", "selo de bom pagador"],
    resumo: "A faixa de notas de crédito considerada de baixo risco de calote, de BBB- para cima. Abaixo dela fica o grau especulativo, que muitos investidores institucionais não podem comprar.",
    texto: [
      "As agências de rating dividem a escala de notas em dois mundos. Do BBB- para cima, na S&P e na Fitch, ou do Baa3 para cima, na Moody's, o emissor tem grau de investimento: risco de calote considerado baixo. Abaixo, tem grau especulativo, também chamado de high yield, alto rendimento, ou junk, lixo, no jargão menos educado do mercado.",
      "A linha é arbitrária, mas tem efeito prático enorme. Regras e estatutos de muitos fundos de pensão, seguradoras, bancos centrais e fundos de índice exigem grau de investimento para comprar um título. Cruzar a linha para baixo obriga parte desses investidores a vender.",
      "O Brasil ficou com grau de investimento de 2008 a 2015 nas três grandes agências. Desde então, está no grau especulativo.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Pense no grau de investimento como um selo de entrada num clube. Dentro, há uma multidão de compradores obrigatoriamente conservadores, com trilhões de dólares para aplicar. Fora, o público é menor e cobra mais caro.",
          "Quando um país ou empresa perde o selo, vira o que o mercado chama de anjo caído. A venda forçada costuma ser concentrada, e o preço dos títulos cai mais do que a mudança de risco justificaria. Quando ganha o selo, o efeito é o inverso: entra dinheiro novo, os juros caem e a moeda tende a se valorizar.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em abril de 2008, quando a S&P deu grau de investimento ao Brasil, a bolsa subiu forte no dia, e o real seguiu se valorizando até a crise global do segundo semestre. Era o auge do ciclo de commodities e da confiança no país.",
          "Quando a S&P tirou o grau de investimento, em setembro de 2015, o dólar já vinha em forte alta desde o começo do ano, e o risco-país estava no maior nível desde 2009. A notícia confirmou um movimento que o mercado vinha fazendo. As outras duas agências seguiram em dezembro de 2015 e fevereiro de 2016.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Grau de investimento não é garantia de que o país vai pagar, e grau especulativo não é sentença de calote.",
          "Vários países especulativos pagam tudo em dia por décadas. O selo mede risco relativo e define quem pode comprar, não o futuro.",
        ],
      },
    ],
    exemplo: "Hipotético: um país com grau de investimento paga 5% ao ano para vender títulos de dez anos em dólar. Perde o selo e, para atrair compradores fora do clube, passa a pagar 6,5%. Numa dívida externa de US$ 50 bilhões, renovada aos poucos, a diferença chega a US$ 750 milhões por ano quando toda ela tiver sido rolada.",
    naPratica: "O selo não garante nada, mas muda quem pode comprar os ativos do país. Para você, é mais um sinal de como o mundo enxerga o risco Brasil. E é um lembrete de que boa parte das aplicações em reais está, por tabela, num devedor que os grandes investidores institucionais do mundo tratam como especulativo.",
    relacionados: ["rating-soberano", "risco-pais", "cds", "recessao-2015-2016", "treasury", "rating", "superciclo-de-commodities"],
  },
  {
    slug: "balanca-de-pagamentos",
    termo: "Balanço de pagamentos",
    categoria: "Macro e contas públicas",
    apelidos: ["balança de pagamentos", "transações correntes", "conta corrente do país", "déficit em conta corrente", "balança comercial", "investimento direto no país"],
    resumo: "O registro de todo o dinheiro que entra e sai de um país: exportações, importações, juros, lucros, viagens e investimentos. Mostra se o país depende de capital de fora para fechar as contas.",
    texto: [
      "Pense no extrato da sua família com o resto do mundo. Entra dinheiro quando o país exporta soja e minério, recebe turistas ou atrai uma fábrica estrangeira. Sai quando importa remédios e celulares, paga juros a credores de fora, manda lucros de multinacionais às matrizes ou quando brasileiros viajam e compram lá fora.",
      "O registro de todo esse vaivém é o balanço de pagamentos. No Brasil, quem publica é o Banco Central, todo mês. Ele mostra se o país gasta mais do que ganha com o exterior e, se gasta, quem está cobrindo a diferença.",
      "É uma das engrenagens que mais mexem com o câmbio, e por isso ajuda a entender por que o dólar sobe ou cai mesmo quando nada parece ter mudado dentro do país.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A conta tem duas metades. A primeira, transações correntes, é o dia a dia: a balança comercial de bens, os serviços (fretes, viagens, software, royalties) e as rendas (juros e lucros que entram e saem).",
          "A segunda metade é a conta financeira, que registra o dinheiro que vem para ficar ou para aplicar: o investimento direto, de quem constrói fábrica ou compra empresa, e o investimento em carteira, de quem compra ações e títulos.",
          "As duas metades se compensam. Se as transações correntes fecham no vermelho, o país precisa atrair dinheiro pela conta financeira para cobrir a diferença, ou usar as reservas. Se não consegue nenhum dos dois, o câmbio se ajusta: o dólar sobe até que importar fique caro e exportar fique barato o bastante para fechar a conta.",
        ],
      },
      {
        titulo: "Os números",
        paragrafos: [
          "O Brasil costuma ter superávit na balança comercial, puxado por soja, petróleo e minério, e déficit grande em serviços e rendas, por causa de juros, lucros enviados ao exterior e viagens. Somando tudo, as transações correntes ficam quase sempre no vermelho.",
          "Em 2025, pelos dados do Banco Central, o déficit em transações correntes foi de US$ 68,8 bilhões, cerca de 3% do PIB. O investimento direto no país somou US$ 77,7 bilhões, perto de 3,4% do PIB, mais do que suficiente para cobrir o buraco.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Investimento direto costuma ser estável: ninguém desmonta uma fábrica numa semana. Dinheiro aplicado em títulos e ações pode sair em dias. Quando a conta depende do segundo tipo e o humor global muda, o câmbio é que se ajusta, e rápido.",
          "Foi o que aconteceu em várias crises que começaram fora do Brasil, como em 1998, 2008 e 2020: o dinheiro de curto prazo foi embora, e o real perdeu valor antes que qualquer coisa mudasse dentro do país.",
        ],
      },
    ],
    exemplo: "Hipotético: um país com déficit em transações correntes de 3% do PIB, coberto em parte por investimento direto e em parte por dinheiro de curto prazo. Numa crise global, o dinheiro de curto prazo vai embora, sobra um buraco de 1,5% do PIB, e o dólar sobe até que importações caiam e exportações cresçam o suficiente para fechá-lo. Quem tinha tudo em reais viu o poder de compra lá fora encolher sem ter feito nada.",
    naPratica: "É uma das engrenagens que explicam por que o real oscila tanto em crises que começam fora do Brasil. Você não controla essa engrenagem; pode, no máximo, decidir quanto do seu patrimônio fica exposto a ela. Ter uma parte em moeda forte faz com que essas oscilações deixem de ser só perda e passem a ser, em parte, compensação.",
    relacionados: ["reservas-internacionais", "cambio-flutuante", "termos-de-troca", "risco-cambial", "cambio", "superciclo-de-commodities", "crise-de-1999"],
  },
  {
    slug: "reservas-internacionais",
    termo: "Reservas internacionais",
    categoria: "Macro e contas públicas",
    apelidos: ["reservas", "reservas cambiais", "colchão de reservas"],
    resumo: "O dinheiro em moeda forte que o Banco Central guarda, sobretudo em títulos do governo americano. Serve de colchão para o país pagar compromissos externos e conter disparadas do dólar.",
    texto: [
      "Assim como você guarda uma reserva de emergência, um país guarda reservas em moeda forte: dólar, euro, ouro e outras. No Brasil, quem administra é o Banco Central, e boa parte está aplicada em títulos do Tesouro americano, que podem ser vendidos a qualquer hora.",
      "No começo de outubro de 2026, as reservas brasileiras estavam perto de US$ 360 bilhões, pela série diária do Banco Central. É um colchão grande para padrões de emergentes, e uma mudança enorme em relação ao passado.",
      "Até os anos 1990, a falta de reservas foi o calcanhar de Aquiles do Brasil. Toda crise externa terminava com o país sem dólares para pagar as contas, pedindo socorro ao FMI ou suspendendo pagamentos.",
    ],
    secoes: [
      {
        titulo: "Para que servem",
        paragrafos: [
          "As reservas servem para duas coisas. A primeira é garantir que o país consiga pagar importações e dívidas externas mesmo se o dinheiro de fora secar de uma hora para outra.",
          "A segunda é dar munição ao Banco Central para vender dólares quando o mercado entra em pânico. No câmbio flutuante brasileiro, o BC não defende uma cotação, mas pode entrar para conter movimentos que julga exagerados, vendendo dólares à vista ou oferecendo contratos de proteção, os swaps cambiais.",
          "Há um custo. As reservas rendem os juros baixos dos títulos americanos, enquanto o governo paga a Selic sobre a dívida em reais. Essa diferença é o preço do seguro.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1987, com as reservas no chão, o Brasil declarou moratória da dívida externa. Entre 1998 e o começo de 1999, perdeu dezenas de bilhões de dólares tentando segurar o real, mesmo com um pacote de cerca de US$ 41,5 bilhões montado com o FMI no fim de 1998. Em janeiro de 1999, a banda cambial caiu.",
          "A virada veio nos anos 2000. Com o ciclo de commodities, o Banco Central comprou dólares em grande quantidade. Desde 2008, as reservas superam a dívida externa do setor público, e o país passou de devedor a credor líquido em moeda estrangeira.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2020, no auge da pandemia, o dólar foi de R$ 4,02 a R$ 5,94 em poucos meses.",
          "O Banco Central vendeu dólares e ofereceu swaps, e em nenhum momento se falou em calote externo. Vinte anos antes, um choque desse tamanho teria virado crise de balanço de pagamentos.",
        ],
      },
    ],
    exemplo: "Em janeiro de 1999, a perda de reservas tornou insustentável a banda cambial, e o real passou a flutuar: o dólar foi de R$ 1,21 para quase R$ 2 em pouco mais de duas semanas. Em 2020, com reservas altas, o dólar também subiu forte, mas o país pagou todas as contas externas em dia, e o debate foi sobre juros, não sobre calote.",
    naPratica: "Reservas altas reduzem o risco de uma crise externa clássica, mas não protegem contra crises domésticas, fiscais ou políticas, nem impedem o real de perder valor. Elas são o seguro do país, e protegem o país como devedor. O seguro do seu patrimônio contra a moeda é outra conversa, e depende de você.",
    relacionados: ["balanca-de-pagamentos", "banco-central", "cambio-flutuante", "crise-de-1999", "moratoria-de-1987", "treasury", "fmi"],
    noCurso: [{ modulo: 0, aula: 2 }],
  },
  {
    slug: "banco-central",
    termo: "Banco Central",
    sigla: "BC",
    categoria: "Macro e contas públicas",
    apelidos: ["Banco Central do Brasil", "BCB", "bancos centrais", "Bacen"],
    resumo: "A instituição que emite a moeda, define os juros básicos e cuida da estabilidade do sistema financeiro. No Brasil é o Banco Central do Brasil; nos Estados Unidos, o Federal Reserve.",
    texto: [
      "Todo país com moeda própria tem uma instituição que cuida dela. No Brasil, é o Banco Central do Brasil. Nos Estados Unidos, o Federal Reserve, o Fed. Na zona do euro, o Banco Central Europeu.",
      "O banco central emite o dinheiro, define a taxa básica de juros, supervisiona os bancos, guarda as reservas internacionais e cuida dos sistemas de pagamento. Foi o Banco Central brasileiro que criou o Pix, lançado em 2020.",
      "A missão principal é manter a inflação sob controle. No Brasil, o objetivo é perseguir a meta definida pelo Conselho Monetário Nacional, hoje de 3% ao ano. Nos Estados Unidos, o Fed tem duplo mandato: preços estáveis e máximo emprego.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A ferramenta mais conhecida é o juro básico. No Brasil, a Selic é decidida pelo Copom, o Comitê de Política Monetária, em oito reuniões por ano. O Banco Central atua no mercado de títulos públicos para que os bancos negociem dinheiro entre si perto da taxa decidida.",
          "Quando a Selic sobe, o crédito fica mais caro, o consumo e o investimento esfriam, o real tende a se valorizar e a inflação recua, com alguns meses de atraso. Quando ela cai, o efeito é o inverso.",
          "O banco central também é o emprestador de última instância: em pânico bancário, empresta aos bancos para evitar que uma corrida vire colapso do sistema.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "O Banco Central do Brasil foi criado pela Lei 4.595, de 31 de dezembro de 1964. Antes, as funções eram divididas entre a Sumoc e o Banco do Brasil. Até 1986, uma conta ligava o BC ao Banco do Brasil e permitia emissão de dinheiro para gastos do governo, e a Constituição de 1988 proibiu o BC de financiar o Tesouro.",
          "O Copom nasceu em 1996, e o regime de metas de inflação, em 1999. Desde 2021, o Banco Central tem autonomia formal, com mandatos fixos para a diretoria.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O Fed foi criado em 1913 e virou o banco central mais importante do mundo, porque emite a moeda de reserva global.",
          "As decisões dele mexem com o dólar, com o juro de todos os países e com o fluxo de dinheiro para emergentes. Muitas vezes, o que acontece no Copom é resposta ao que aconteceu no Fed.",
        ],
      },
    ],
    exemplo: "Em 1979, o Fed, comandado por Paul Volcker, subiu os juros para perto de 20% para derrubar a inflação americana. A decisão funcionou nos Estados Unidos, mas encareceu a dívida em dólar da América Latina e ajudou a provocar a década perdida. Um banco central decide pelo próprio país; os efeitos atravessam fronteiras.",
    naPratica: "Ter todo o patrimônio em reais é confiar em um único banco central. Uma parte em outra moeda põe o seu dinheiro sob outra política monetária, com outros erros e outros acertos. Não se trata de achar um banco central melhor, mas de não depender de um só.",
    relacionados: ["independencia-do-banco-central", "meta-de-inflacao", "selic", "reservas-internacionais", "senhoriagem", "tripe-macroeconomico", "copom", "fed"],
    noCurso: [{ modulo: 0, aula: 1 }, { modulo: 0, aula: 2 }],
  },
  {
    slug: "independencia-do-banco-central",
    termo: "Autonomia do Banco Central",
    categoria: "Macro e contas públicas",
    apelidos: ["independência do Banco Central", "independência do BC", "autonomia do BC", "Lei Complementar 179", "banco central independente", "bancos centrais independentes"],
    resumo: "A regra que dá ao Banco Central mandatos fixos e o protege de pressões do governo da vez. No Brasil, vale desde a Lei Complementar 179, de fevereiro de 2021.",
    texto: [
      "Um governo perto de eleição tem uma tentação conhecida: baixar juros para aquecer a economia, gerar emprego e consumo, mesmo que isso custe inflação depois da votação. Um banco central protegido dessa pressão consegue resistir. É a lógica da autonomia.",
      "No Brasil, a Lei Complementar 179, de 24 de fevereiro de 2021, deu mandatos fixos de quatro anos ao presidente e aos diretores do Banco Central, desencontrados do mandato do presidente da República. Eles só podem ser demitidos em situações previstas na lei, com aval do Senado.",
      "O desenho faz o presidente do BC assumir no começo do terceiro ano de cada governo, e os diretores serem trocados aos poucos. Assim, nenhum presidente da República escolhe a diretoria inteira de uma vez.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A ideia ganhou força nos anos 1970 e 1980, depois de uma década de inflação alta no mundo rico. Os economistas mostraram que promessas de inflação baixa feitas por quem também quer ganhar eleições não são críveis, um problema chamado inconsistência temporal. A solução foi entregar a tarefa a alguém com outro horizonte.",
          "O Bundesbank alemão virou referência. Depois vieram a Nova Zelândia, o Banco da Inglaterra, em 1997, e o Banco Central Europeu, que nasceu independente.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Autonomia não significa fazer o que quiser. O Conselho Monetário Nacional, com dois ministros e o presidente do BC, define a meta de inflação. O Banco Central escolhe como chegar lá, ajustando a Selic, e presta contas ao Senado e ao público em atas, relatórios e cartas.",
          "A lei manteve como objetivo principal a estabilidade de preços e acrescentou objetivos secundários: zelar pelo sistema financeiro, suavizar as flutuações da atividade e fomentar o pleno emprego.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "No Fed, os governadores têm mandatos de 14 anos, e o presidente, de quatro, renovável. Mesmo assim, a pressão política sobre bancos centrais aparece de tempos em tempos em vários países.",
          "A autonomia é uma proteção institucional, não uma garantia: uma lei pode ser mudada por outra lei.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "A credibilidade do banco central aparece nos juros longos e nas expectativas de inflação. Quando o mercado acredita que o banco central vai perseguir a meta, mesmo sob pressão política, aceita taxas menores em títulos de prazo longo. Quando duvida, cobra um prêmio.",
          "Por isso as indicações para a diretoria do Banco Central são acompanhadas de perto, e declarações de governantes sobre juros mexem com o câmbio. Autonomia formal reduz esse ruído, mas não o elimina.",
        ],
      },
    ],
    exemplo: "Hipotético: um presidente da República eleito em 2026 só indica o presidente do Banco Central para começar em 2029. Até lá, convive com uma diretoria que não escolheu inteira. Se quiser juros mais baixos antes da eleição seguinte, terá de convencer um colegiado com mandato próprio, e não simplesmente trocá-lo.",
    naPratica: "Autonomia reduz o risco de a política monetária ser usada para fins eleitorais, e isso costuma aparecer em expectativas de inflação mais ancoradas e juros longos menores. Mas não elimina a dominância fiscal: se as contas não fecham, nenhum banco central segura a moeda sozinho. Para o seu patrimônio, a autonomia é uma camada de proteção, não um motivo para concentrar tudo numa moeda.",
    relacionados: ["banco-central", "inconsistencia-temporal", "meta-de-inflacao", "dominancia-fiscal", "instituicoes", "copom", "fed"],
  },
  {
    slug: "meta-de-inflacao",
    termo: "Meta de inflação",
    categoria: "Macro e contas públicas",
    apelidos: ["metas de inflação", "regime de metas", "regime de metas de inflação", "meta contínua", "centro da meta"],
    resumo: "O alvo de inflação que o Banco Central persegue ajustando os juros. No Brasil, o regime existe desde junho de 1999; desde 2025, o alvo é de 3% ao ano, com tolerância de 1,5 ponto.",
    texto: [
      "Em vez de prometer uma cotação de dólar, o Banco Central passa a prometer uma inflação. O Conselho Monetário Nacional fixa o alvo, e o BC calibra a Selic para chegar lá. Se a inflação ameaça subir, o juro sobe; se está abaixo do alvo, ele pode cair.",
      "O Brasil adotou o regime em junho de 1999, com inspiração na Nova Zelândia, pioneira em 1990, logo depois de o real deixar de ser preso ao dólar. É um dos três pés do tripé macroeconômico.",
      "Desde 2025, a meta é contínua: 3% ao ano, com intervalo de 1,5 ponto para cima ou para baixo, cobrada mês a mês sobre a inflação dos 12 meses anteriores, medida pelo IPCA.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Os juros levam de seis meses a dois anos para fazer efeito pleno nos preços. Por isso o Banco Central não olha a inflação de hoje, e sim a projetada para o horizonte em que a decisão vai pesar. É como dirigir olhando a estrada lá na frente, não o capô.",
          "A peça mais importante é a expectativa. Se empresas e trabalhadores acreditam que a inflação vai ficar perto de 3%, reajustam preços e salários perto disso, e a meta se cumpre com menos esforço. Se não acreditam, o BC precisa de juros mais altos para convencer.",
          "Pela regra atual, se a inflação passar seis meses seguidos fora do intervalo, a meta é considerada descumprida, e o presidente do BC escreve uma carta aberta ao ministro da Fazenda explicando o porquê e o que vai fazer.",
        ],
      },
      {
        titulo: "A história da meta",
        paragrafos: [
          "As primeiras metas foram de 8% em 1999, 6% em 2000 e 4% em 2001. De 2005 a 2018, o centro ficou em 4,5%. Depois, caiu aos poucos até 3% em 2024 e passou a ser contínua em 2025.",
          "A meta foi descumprida várias vezes, em anos como 2001, 2002, 2003, 2015, 2021 e 2022, quase sempre depois de choques de câmbio ou de preços. Em julho de 2025, saiu a primeira carta pelo regime contínuo: em junho, o IPCA de 12 meses estava em 5,35%, acima do teto de 4,5% pelo sexto mês seguido.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Os bancos centrais dos países ricos costumam mirar 2%. O Fed adotou formalmente essa meta em 2012.",
          "A diferença de um ponto entre as metas daqui e de lá é parte da explicação de por que o real tende a perder valor contra o dólar no longo prazo.",
        ],
      },
    ],
    exemplo: "Se o IPCA acumulado em 12 meses fica em 5% por seis meses seguidos, acima do teto de 4,5%, o Banco Central escreve uma carta ao ministro da Fazenda explicando as causas e quando espera voltar ao intervalo. Não há multa nem demissão: a punição é de reputação, e por isso o mercado lê cada carta com atenção.",
    naPratica: "Uma meta crível ancora as expectativas e permite juros menores. Quando o mercado duvida dela, cobra mais caro nos títulos longos e no câmbio. A credibilidade da meta é parte do risco que você carrega com patrimônio em reais, e a diferença entre a meta brasileira e a americana ajuda a entender por que o dólar tende a subir com o tempo.",
    relacionados: ["tripe-macroeconomico", "banco-central", "ipca", "selic", "inconsistencia-temporal", "inflacao", "paridade-do-poder-de-compra"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "31:42" }],
  },
  {
    slug: "tripe-macroeconomico",
    termo: "Tripé macroeconômico",
    categoria: "Macro e contas públicas",
    apelidos: ["tripé", "tripé de 1999", "os três pés"],
    resumo: "O regime adotado em 1999: meta de inflação, meta de superávit primário e câmbio flutuante. Com ajustes, é a base da política econômica brasileira até hoje.",
    texto: [
      "Em janeiro de 1999, o real deixou de ser preso ao dólar, e em poucas semanas a moeda perdeu perto de 40% do valor. O Brasil precisava, com urgência, de outro jeito de convencer o mercado de que a inflação não voltaria e de que a dívida não sairia do controle.",
      "A resposta veio em três pés, montados em poucos meses pela equipe de Arminio Fraga no Banco Central e de Pedro Malan na Fazenda: meta de inflação, meta de superávit primário e câmbio flutuante. O conjunto ganhou o apelido de tripé macroeconômico.",
      "Com ajustes, é a base da política econômica brasileira até hoje, atravessando governos de orientações diferentes.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O primeiro pé é a meta de inflação: o BC anuncia um alvo e calibra os juros para atingi-lo. O segundo é a meta de superávit primário, a economia que o governo faz antes de pagar juros, para mostrar que a dívida não cresceria sem controle. O terceiro é o câmbio flutuante: o dólar encontra o preço no mercado, e o BC só entra quando acha o movimento exagerado, o que a aula chama de câmbio flutuante e sujo.",
          "Em 2000, a Lei de Responsabilidade Fiscal amarrou o desenho, impondo limites a estados e municípios e proibindo, entre outras coisas, que um governo se financie no banco que controla.",
        ],
      },
      {
        titulo: "Por que três pés",
        paragrafos: [
          "Os três se apoiam, e um sozinho não para em pé. Sem superávit, a meta de inflação perde força, porque o mercado teme que a dívida um dia seja paga com emissão.",
          "Sem câmbio flutuante, o BC gasta reservas defendendo uma cotação e perde o controle dos juros. Sem meta de inflação, o câmbio flutuante vira só desvalorização sem âncora.",
        ],
      },
      {
        titulo: "A história",
        paragrafos: [
          "De 2002 a 2008, o tripé funcionou com folga: superávits acima de 3% do PIB, inflação perto da meta e reservas crescendo. A partir de 2011, o pé fiscal foi enfraquecendo, e em 2014 o superávit virou déficit. O resultado veio em 2015: recessão, dólar em alta, perda do grau de investimento.",
          "As regras fiscais que vieram depois, o teto de gastos em 2016 e o arcabouço em 2023, foram tentativas de reconstruir esse pé.",
        ],
      },
    ],
    exemplo: "Hipotético: um choque externo faz o dólar subir 20%. Com o tripé funcionando, o câmbio absorve o choque, a inflação sobe um pouco, o BC ajusta os juros e o superávit garante que a dívida não dispare. Com o pé fiscal fraco, o mesmo choque assusta o mercado, o dólar sobe mais, os juros longos também, e o BC precisa apertar bem mais para segurar a inflação.",
    naPratica: "Quando um dos pés fraqueja, como o fiscal a partir de 2014, o prêmio de risco volta a subir, e você sente no dólar e nos juros. Acompanhar o tripé é uma forma simples de ler o risco do país, sem ter de adivinhar o dólar do mês. E é um lembrete de que o regime que protege a moeda depende de escolhas que se renovam a cada governo.",
    relacionados: ["meta-de-inflacao", "resultado-primario", "cambio-flutuante", "lei-de-responsabilidade-fiscal", "crise-de-1999", "arcabouco-fiscal", "banco-central"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "31:42" }],
  },
  {
    slug: "inconsistencia-temporal",
    termo: "Inconsistência temporal",
    categoria: "Macro e contas públicas",
    apelidos: ["âncora nominal", "âncoras nominais", "credibilidade", "Barro e Gordon", "compromisso crível"],
    resumo: "O problema de quem promete algo hoje e, amanhã, tem incentivo para mudar de ideia. Em política monetária, explica por que uma promessa de inflação baixa só vale se houver amarra crível.",
    texto: [
      "Na Odisseia, Ulisses quer ouvir o canto das sereias sem afundar o navio. A solução: manda a tripulação amarrá-lo ao mastro e ignorar qualquer ordem que ele der depois. Ele sabe que, na hora, vai querer mudar de ideia.",
      "Governos têm o mesmo problema. Um governo promete inflação baixa. Depois que salários e contratos foram fechados contando com a promessa, surge a tentação de soltar um pouco mais de inflação para aquecer a economia. Só que todo mundo sabe disso e já negocia contando com a traição.",
      "Esse é o problema da inconsistência temporal: o que é ótimo prometer hoje deixa de ser ótimo cumprir amanhã. E, quando os outros antecipam isso, a promessa perde o valor desde o começo.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Os economistas Finn Kydland e Edward Prescott formalizaram a ideia no fim dos anos 1970 e ganharam o Nobel por ela em 2004. Robert Barro e David Gordon aplicaram o raciocínio à política monetária.",
          "A conclusão é desconfortável. Mesmo um governo bem-intencionado acaba com inflação mais alta do que queria, sem nenhum crescimento a mais, porque o público já embutiu a tentação no preço. O viés só some quando quem decide consegue se amarrar à promessa.",
        ],
      },
      {
        titulo: "Como se amarrar",
        paragrafos: [
          "As amarras mais comuns são chamadas de âncoras nominais. A primeira é prender a moeda a outra, como o real ao dólar de 1994 a 1999, pegando emprestada a reputação de outro banco central. A segunda é dar autonomia ao banco central e uma meta de inflação pública. A terceira é a reputação, construída ao longo de anos cumprindo o prometido.",
          "Nenhuma é perfeita. Câmbio fixo pode ser abandonado; leis de autonomia podem ser mudadas; reputação leva décadas para construir e meses para perder.",
        ],
      },
      {
        titulo: "Fora da política monetária",
        paragrafos: [
          "O mesmo problema aparece em impostos, regras e contratos.",
          "Um governo promete não tributar um investimento para atraí-lo; depois que a fábrica está construída, a tentação de tributar aparece. É a mesma lógica do risco de expropriação.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O investidor convive com a inconsistência temporal o tempo todo, nas regras de tributação. Uma regra que hoje incentiva um tipo de aplicação pode mudar quando o governo precisar de receita. A Lei 14.754, de dezembro de 2023, por exemplo, mudou a forma como são tributados os investimentos de pessoas físicas no exterior e os fundos fechados.",
          "Isso não é argumento para paralisia, nem para tentar adivinhar a próxima mudança. É argumento para não depender de uma única regra, de um único país, para que todo o planejamento faça sentido.",
        ],
      },
    ],
    exemplo: "O real usou o dólar como âncora de 1994 a 1999. Funcionou enquanto manter a amarra custava menos do que soltá-la. Quando o custo em reservas e juros ficou alto demais, o mercado testou a promessa, e ela caiu em janeiro de 1999. A âncora seguinte, a meta de inflação, sobrevive há mais de 25 anos, em parte porque o custo de abandoná-la seria visível para todos.",
    naPratica: "Toda promessa de política econômica tem prazo de validade implícito. Para o seu patrimônio, isso significa que regras estáveis hoje não garantem regras estáveis amanhã, um argumento a mais para espalhar o dinheiro entre jurisdições. Não por desconfiança de um governo específico, mas porque a tentação de mudar a regra existe em qualquer lugar.",
    relacionados: ["cambio-fixo", "meta-de-inflacao", "independencia-do-banco-central", "risco-de-expropriacao", "plano-real", "crise-de-1999", "instituicoes"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "12:06" }],
  },
  {
    slug: "demografia",
    termo: "Demografia",
    categoria: "Macro e contas públicas",
    apelidos: ["transição demográfica", "envelhecimento da população", "pirâmide etária", "projeções da população", "envelhecimento"],
    resumo: "O estudo do tamanho e da composição da população: quantos nascem, quantos morrem, quantos migram e quantos estão em cada idade. Muda devagar, mas muda tudo: trabalho, consumo, previdência e dívida.",
    texto: [
      "Quem vai se aposentar em 2050 já nasceu. Quem vai entrar no mercado de trabalho em 2045 também. Por isso as projeções demográficas são das mais confiáveis da economia: boa parte do futuro da população já está escrita no presente.",
      "Demografia é o estudo do tamanho e da composição da população: quantos nascem, quantos morrem, quantos migram e quantos estão em cada idade. Muda devagar, mas muda tudo: trabalho, consumo, previdência, saúde, dívida pública e até o preço dos imóveis.",
      "É também a variável que nenhum governo muda no curto prazo. Juros e impostos mudam numa reunião; a pirâmide de idades leva gerações.",
    ],
    secoes: [
      {
        titulo: "O Brasil em transição",
        paragrafos: [
          "O Brasil passa por uma das transições demográficas mais rápidas do mundo. Em 1960, a mulher brasileira tinha, em média, mais de seis filhos. Hoje tem perto de um e meio. Ao mesmo tempo, as pessoas vivem muito mais.",
          "Pelas projeções do IBGE divulgadas em 2024, a população para de crescer em 2041, com 220,4 milhões de pessoas, e cai para 199,2 milhões em 2070. Em 2023, 15,6% dos brasileiros tinham 60 anos ou mais. Em 2070, serão 37,8%, quase quatro em cada dez.",
          "O que países europeus levaram mais de um século para fazer, o Brasil está fazendo em poucas décadas. E com uma diferença importante: envelhecendo antes de ficar rico.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Os Estados Unidos também envelhecem, mas a população continua crescendo, puxada pela imigração e por uma fecundidade um pouco maior. A fatia com 65 anos ou mais deve passar de 17% em 2022 para 23% em 2050, uma mudança mais lenta que a brasileira.",
          "No outro extremo estão Japão, Coreia do Sul, Itália e China, onde a população já encolhe ou está prestes a encolher. Cada país está num ponto diferente da mesma curva, e isso pesa no crescimento, no consumo e nas contas públicas de cada um.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Menos gente trabalhando e mais gente aposentada pressionam o orçamento por décadas: previdência, saúde e assistência crescem sozinhas. A conta tende a vir por imposto, por dívida ou por inflação.",
          "A demografia também muda o crescimento potencial. Com menos gente entrando no mercado de trabalho, o PIB depende cada vez mais de produtividade, que anda devagar.",
        ],
      },
    ],
    exemplo: "Em 2023, 15,6% dos brasileiros tinham 60 anos ou mais. Pelo IBGE, serão 37,8% em 2070. Hipotético: se hoje há quatro pessoas em idade de trabalhar para cada idoso, e em 2070 houver pouco mais de uma, cada trabalhador do futuro sustentará, via impostos e contribuições, uma fatia muito maior das aposentadorias do que um trabalhador de hoje.",
    naPratica: "A demografia não decide sozinha o futuro do país, e envelhecimento não é sinônimo de crise. Mas é um dos riscos que uma carteira concentrada em reais carrega sem perceber: o seu INSS, o seu imposto e o juro da dívida dependem dessa pirâmide. Diversificar entre economias em fases demográficas diferentes é uma forma de não depender de uma só.",
    relacionados: ["bonus-demografico", "taxa-de-fecundidade", "previdencia", "crescimento-potencial", "divida-pib", "produtividade", "capital-humano"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "31:28" }, { modulo: 0, aula: 4, tempo: "18:03" }],
  },
  {
    slug: "bonus-demografico",
    termo: "Bônus demográfico",
    categoria: "Macro e contas públicas",
    apelidos: ["janela demográfica", "dividendo demográfico", "fim do bônus demográfico"],
    resumo: "A fase em que a população em idade de trabalhar cresce mais que a de crianças e idosos. A economia ganha um empurrão, e ele acaba quando a população envelhece.",
    texto: [
      "Quando a fecundidade de um país cai, abre-se uma janela rara. As famílias têm menos filhos, então há menos crianças para sustentar. Os avós ainda são relativamente poucos, porque a geração mais velha nasceu numa época de população menor. No meio, cresce a fatia de gente em idade de trabalhar.",
      "Essa fase tem nome: bônus demográfico. A economia ganha um empurrão. Há mais gente produzindo e menos dependentes por trabalhador, a poupança aumenta, sobra dinheiro para investir em escola e infraestrutura.",
      "O bônus não dura. As pessoas que formavam a fatia ativa envelhecem e se aposentam, e a geração seguinte é menor. O empurrão vira freio.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Os demógrafos olham a razão de dependência: quantas crianças e idosos existem para cada pessoa em idade de trabalhar. Quando ela cai, o país está no bônus. Quando volta a subir, puxada pelos idosos, a janela está fechando.",
          "O bônus não se transforma em riqueza automaticamente. Ele precisa de emprego para quem chega à idade de trabalhar e de investimento para que essas pessoas sejam produtivas. Uma geração grande sem escola boa e sem vaga vira desemprego, não crescimento.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Países que aproveitaram o bônus para educar e investir, como a Coreia do Sul, ficaram ricos antes de envelhecer. Hoje a Coreia tem uma das fecundidades mais baixas do mundo, perto de 0,7 filho por mulher em 2023, mas enfrenta o envelhecimento com renda alta.",
          "O Brasil está no fim dessa janela. Pelas projeções do IBGE, a população inteira para de crescer em 2041, e a fatia de idosos já cresce bem mais depressa que a de jovens. Parte do bônus foi aproveitada, com a expansão do ensino básico e o crescimento dos anos 2000. Parte se perdeu em décadas de crescimento baixo e produtividade parada.",
        ],
      },
      {
        titulo: "O que vem depois",
        paragrafos: [
          "Quando o bônus acaba, o crescimento passa a depender quase só de produtividade, e as contas públicas passam a carregar mais aposentadorias e mais saúde. Não é uma sentença de crise: é uma mudança de regime, que exige reformas e eficiência.",
          "Japão, Itália e Alemanha já vivem essa fase, com renda alta. O desafio brasileiro é atravessá-la com renda média, o que torna os ganhos de produtividade ainda mais urgentes.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Países em pleno bônus costumam ter mercado de trabalho crescendo, consumo em alta e poupança aumentando, um ambiente favorável para empresas locais. Países no fim do bônus precisam de produtividade para manter o ritmo e enfrentam pressão crescente sobre a previdência.",
          "Para o investidor, isso significa que o mesmo nível de juros e de impostos pode ser mais ou menos sustentável conforme a fase demográfica. É mais uma variável que muda de país para país e que favorece olhar além de uma economia só.",
        ],
      },
    ],
    exemplo: "Hipotético: num país com 100 pessoas em idade de trabalhar e 50 dependentes, cada trabalhador sustenta meia pessoa. Se o número de dependentes sobe para 80, cada trabalhador passa a sustentar 0,8 pessoa. Para manter o mesmo padrão de vida de todos, a produção por trabalhador precisa crescer 20%, ou alguém vai ter de abrir mão de alguma coisa.",
    naPratica: "O fim do bônus reduz o crescimento potencial e aperta a previdência. Não é uma previsão de crise, é aritmética. Diversificar entre economias em fases demográficas diferentes é uma forma de não depender de uma só pirâmide de idades, especialmente para quem está montando hoje o patrimônio que vai sustentar a própria aposentadoria daqui a 20 ou 30 anos.",
    relacionados: ["demografia", "taxa-de-fecundidade", "previdencia", "crescimento-potencial", "produtividade", "capital-humano"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "31:28" }],
  },
  {
    slug: "taxa-de-fecundidade",
    termo: "Taxa de fecundidade",
    categoria: "Macro e contas públicas",
    apelidos: ["fecundidade", "taxa de reposição", "filhos por mulher", "taxa de fecundidade total"],
    resumo: "O número médio de filhos por mulher. Para a população se manter estável sem imigração, ele precisa ficar perto de 2,1. O Brasil está em pouco mais de 1,5.",
    texto: [
      "Para uma população não encolher, cada casal precisa, em média, ter dois filhos, um pouco mais para compensar quem morre antes da idade de ter filhos. Esse número mágico, perto de 2,1 filhos por mulher, é a taxa de reposição.",
      "A taxa de fecundidade é o número médio de filhos que uma mulher teria ao longo da vida, se seguisse o padrão de nascimentos de hoje. É o termômetro mais simples do futuro demográfico de um país.",
      "O Brasil caiu abaixo da reposição no começo dos anos 2000. Em 2023, a taxa era de 1,57 filho por mulher, e as projeções do IBGE a mantêm perto de 1,5 até 2070.",
    ],
    secoes: [
      {
        titulo: "A queda",
        paragrafos: [
          "Em 1960, a brasileira tinha, em média, mais de seis filhos. A queda veio com urbanização, escolaridade feminina, entrada das mulheres no mercado de trabalho, acesso a métodos contraceptivos e a própria redução da mortalidade infantil: quando os filhos sobrevivem, as famílias têm menos.",
          "Em 2000, a taxa era de 2,32. Em 2010, de 1,75. Em 2023, de 1,57. Pelo IBGE, deve ficar entre 1,44 e 1,50 de 2041 a 2070.",
        ],
      },
      {
        titulo: "Como funciona o atraso",
        paragrafos: [
          "Fecundidade baixa não esvazia o país de um dia para o outro. Ainda há muitas pessoas em idade de ter filhos, nascidas nas décadas em que a fecundidade era alta. Por isso a população continua crescendo por um tempo mesmo abaixo da reposição. Os demógrafos chamam isso de inércia demográfica.",
          "O efeito aparece com décadas de atraso: primeiro menos crianças nas escolas, depois menos jovens entrando no mercado de trabalho, por fim menos contribuintes para cada aposentado.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "A fecundidade baixa é quase universal nos países de renda média e alta. Os Estados Unidos estão abaixo da reposição, mas compensam com imigração.",
          "Japão, Itália e Coreia do Sul estão bem abaixo, e a Coreia chegou a cerca de 0,7 filho por mulher em 2023, o menor nível do mundo. Políticas de incentivo à natalidade, testadas em vários países, costumam ter efeito pequeno.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "A fecundidade de hoje define o tamanho da força de trabalho daqui a 20 anos e o número de contribuintes da previdência daqui a 30. É uma das poucas variáveis econômicas que dá para projetar com décadas de antecedência, e por isso aparece em todo cálculo sério de crescimento potencial e de contas públicas.",
          "Ela também mexe com setores inteiros: menos crianças significa menos demanda futura por escolas e produtos infantis, e mais idosos significa mais demanda por saúde, serviços e renda de aposentadoria. Quem investe com horizonte longo está, querendo ou não, apostando numa trajetória demográfica.",
        ],
      },
    ],
    exemplo: "Hipotético: 100 mulheres com 1,5 filho em média geram 150 crianças, das quais perto de 75 meninas. Se elas mantiverem o mesmo padrão, terão perto de 112 filhos, e assim por diante. Em três gerações, sem imigração, o número de nascimentos cai para menos da metade do ponto de partida.",
    naPratica: "Com menos nascimentos, haverá menos contribuintes para sustentar a aposentadoria de cada aposentado. Para quem conta com o INSS, a demografia já é parte do risco do patrimônio, e a poupança própria é onde dá para diversificar esse risco, inclusive entre moedas e países com outras pirâmides de idade.",
    relacionados: ["demografia", "bonus-demografico", "previdencia", "crescimento-potencial", "capital-humano"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "31:56" }],
  },
  {
    slug: "previdencia",
    termo: "Previdência",
    categoria: "Macro e contas públicas",
    apelidos: ["Previdência Social", "INSS", "previdência por repartição", "regime de repartição", "repartição", "capitalização", "reforma da Previdência", "aposentadoria pública"],
    resumo: "O sistema que paga aposentadorias e pensões. No INSS, quem trabalha hoje paga a aposentadoria de quem parou hoje, por isso a conta depende da demografia.",
    texto: [
      "No INSS, a contribuição que sai do seu salário todo mês não fica guardada numa conta com o seu nome. Ela paga quem está aposentado hoje. Quando você se aposentar, quem paga é quem estiver trabalhando na época.",
      "Esse modelo é o regime de repartição, e é a base da previdência pública no Brasil e na maioria dos países. Ele funciona bem quando há muitos trabalhadores para cada aposentado e os salários crescem. Fica pesado quando a população envelhece.",
      "Previdência é o sistema que paga aposentadorias e pensões. No Brasil, convivem três pilares: o INSS, para quem trabalha no setor privado; os regimes próprios dos servidores públicos; e a previdência complementar, privada e voluntária.",
    ],
    secoes: [
      {
        titulo: "Repartição e capitalização",
        paragrafos: [
          "O outro modelo é a capitalização: cada um forma a própria poupança, que rende juros até a aposentadoria. A previdência privada, os planos PGBL e VGBL e os fundos de pensão de empresas seguem essa lógica.",
          "Na repartição, o rendimento implícito da sua contribuição depende de duas coisas: quanto crescem os salários e quanto cresce o número de contribuintes. Na capitalização, depende dos juros e do retorno dos investimentos.",
          "Migrar de um modelo para o outro é caro: durante a transição, uma geração precisa pagar a aposentadoria de quem já está aposentado e, ao mesmo tempo, poupar para a própria.",
        ],
      },
      {
        titulo: "A reforma de 2019",
        paragrafos: [
          "Com a população envelhecendo, a repartição exige mais contribuição, menos benefício ou mais dinheiro do Tesouro. A Emenda Constitucional 103, de 12 de novembro de 2019, fixou idade mínima de 65 anos para homens e 62 para mulheres no INSS, mudou o cálculo dos benefícios e criou regras de transição.",
          "Na aula, Felippe Hermes lembra que dificilmente terá sido a última. A conta demográfica continua andando: com a fecundidade abaixo da reposição e a expectativa de vida subindo, a relação entre contribuintes e aposentados tende a piorar por décadas.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "A previdência é o maior gasto do governo federal.",
          "Quando ela cresce mais que a economia, pressiona o resultado primário, a dívida e, no fim, os juros. É o elo entre demografia e risco fiscal.",
        ],
      },
    ],
    exemplo: "Hipotético: se os salários sobem 2% ao ano e o número de contribuintes cresce 1%, o sistema de repartição rende perto de 3%. Se os contribuintes passam a diminuir 1% ao ano, o rendimento cai para perto de 1%. Na capitalização, com juro real de 4%, a mesma contribuição renderia mais, mas com risco de mercado e sem o seguro coletivo que a repartição oferece.",
    naPratica: "Quem contribui para o INSS já tem boa parte da aposentadoria presa à demografia, aos salários e à moeda do Brasil. A sua poupança própria é o espaço onde essa exposição pode ser diversificada, inclusive entre moedas e países. Pensar a aposentadoria em camadas, uma pública em reais e outra privada mais diversificada, é uma forma de não pôr todos os ovos na mesma cesta.",
    relacionados: ["demografia", "taxa-de-fecundidade", "bonus-demografico", "divida-pib", "carga-tributaria", "resultado-primario", "horizonte-de-investimento"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "33:09" }],
  },
  {
    slug: "instituicoes",
    termo: "Instituições",
    categoria: "Macro e contas públicas",
    apelidos: ["instituições econômicas", "instituições políticas", "qualidade institucional", "regras do jogo", "estado de direito"],
    resumo: "As regras do jogo de uma sociedade: leis, direitos de propriedade, tribunais, contratos e a forma como o poder é exercido. São a explicação mais aceita para a diferença de renda entre países.",
    texto: [
      "Por que a Coreia do Sul ficou rica e a do Norte não, se as duas começaram com o mesmo povo, a mesma língua, a mesma geografia e a mesma história? Por volta de 2000, a renda por pessoa do Sul era cerca de 16 vezes a do Norte. A resposta mais aceita é que, depois da divisão, os dois lados adotaram regras diferentes.",
      "Isso tem nome: instituições. São as regras do jogo de uma sociedade: leis, direitos de propriedade, tribunais, contratos, a forma como o poder é escolhido e limitado. São a explicação mais aceita para a diferença de renda entre países.",
      "Em 2024, os economistas Daron Acemoglu, Simon Johnson e James Robinson ganharam o Nobel de Economia justamente por estudos sobre como as instituições moldam a prosperidade.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Acemoglu e Robinson separam dois tipos. Instituições econômicas definem se a propriedade está protegida, se contratos são cumpridos e se qualquer um pode abrir um negócio. Instituições políticas definem quem faz as regras e quanto pode mudá-las. As segundas moldam as primeiras.",
          "Boas instituições tornam crível que o governo não vai tomar o retorno de quem investiu. Quando essa confiança falta, as pessoas investem menos, cobram mais caro para investir ou levam o dinheiro para outro lugar.",
          "Elas também podem ser informais: costumes, reputação, a expectativa de que uma decisão judicial será respeitada. Duas constituições quase iguais podem funcionar de maneiras muito diferentes.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "Um exemplo clássico é a Inglaterra depois de 1688. A Revolução Gloriosa limitou o poder do rei de cobrar impostos e confiscar bens sem o Parlamento. Nas décadas seguintes, o governo inglês passou a pegar dinheiro emprestado mais barato, porque os credores confiavam que seriam pagos.",
          "No outro extremo, os pesquisadores mostram que ex-colônias montadas para extrair recursos tendem a ter instituições piores até hoje, com efeito duradouro sobre a renda.",
        ],
      },
      {
        titulo: "No Brasil",
        paragrafos: [
          "O Brasil tem instituições sólidas em muitos aspectos: eleições regulares, Banco Central com autonomia, imprensa livre, mercado de capitais regulado. E tem um histórico de mudanças de regra que pesa no preço: bloqueios, moratórias, congelamentos, regras fiscais de vida curta.",
          "A leitura útil não é a de um país bom ou ruim, e sim a de um país com riscos institucionais conhecidos, que o mercado cobra no juro e no câmbio. Esses riscos mudam devagar, para melhor ou para pior, e atingem todos os ativos daqui ao mesmo tempo.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Instituições aparecem no preço dos ativos. Países com regras instáveis pagam juros mais altos, e as empresas deles costumam ser negociadas a múltiplos menores de lucro, porque o investidor desconta o risco de a regra mudar.",
          "Às vezes, o risco aparece de forma extrema. Em 2022, depois da invasão da Ucrânia, investidores estrangeiros com ações russas ficaram impedidos de vendê-las, e os provedores de índices retiraram a Rússia das carteiras a preço praticamente zero. Ninguém precisou errar a análise de uma empresa para perder tudo: bastou estar sob a jurisdição errada.",
        ],
      },
    ],
    exemplo: "O bloqueio das aplicações no Plano Collor, em 1990, foi uma decisão tomada num dia que alterou contratos de milhões de pessoas. Episódios assim ficam na memória dos investidores e entram no preço por décadas, na forma de juros mais altos e de uma preferência por aplicações curtas e líquidas.",
    naPratica: "Diversificar entre países é também diversificar instituições. Nenhuma jurisdição é perfeita, e os países ricos também mudam regras. Mas espalhar o patrimônio evita que uma única caneta decida o destino de tudo o que você tem.",
    relacionados: ["risco-de-expropriacao", "convergencia-condicional", "jurisdicao", "risco-pais", "plano-collor", "inconsistencia-temporal", "independencia-do-banco-central"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "22:12" }, { modulo: 0, aula: 2 }],
  },
  {
    slug: "risco-de-expropriacao",
    termo: "Risco de expropriação",
    categoria: "Macro e contas públicas",
    apelidos: ["risco de mudança de regra", "risco de regra", "holdup", "compromisso não crível", "expropriação", "expropriação regulatória", "risco regulatório", "risco político"],
    resumo: "A chance de quem faz as regras tomar, depois do fato, parte do retorno de quem já investiu: com imposto novo, controle de preço, bloqueio ou desvalorização. Os economistas chamam o mecanismo de holdup.",
    texto: [
      "Imagine que você construiu uma fábrica. Ela não sai do lugar. A partir daí, quem define impostos, tarifas e preços sabe que pode apertar sem que você vá embora, porque o investimento já está feito. Você pode até reclamar, mas não consegue desfazer a fábrica.",
      "Os economistas chamam isso de holdup, algo como ficar refém. E chamam de risco de expropriação a chance de quem faz as regras tomar, depois do fato, parte do retorno de quem já investiu.",
      "Expropriação não precisa ser tomada de bens à força. Pode ser um imposto criado depois do investimento, um preço controlado, um bloqueio de aplicações, uma moratória, uma mudança contratual ou uma inflação que corrói contratos. O efeito é o mesmo: o retorno combinado muda depois que você entrou.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O investidor que entende o jogo se antecipa. Cobra retorno maior para entrar, investe menos ou prefere ativos que consegue tirar rápido. É por isso que países com histórico de mudança de regra pagam juros mais altos e recebem menos investimento de longo prazo.",
          "O problema persiste quando o governo não consegue prometer, de forma convincente, que não vai mudar a regra depois. É a inconsistência temporal aplicada a impostos e contratos.",
          "O curioso é que o holdup é ruim até para quem o pratica. Se o investidor sabe que vai ser espremido, não investe, e o governo acaba sem a fábrica e sem o imposto.",
        ],
      },
      {
        titulo: "Casos reais",
        paragrafos: [
          "Em 2012, a Argentina expropriou a maior parte da petroleira YPF, que pertencia à espanhola Repsol. Na Venezuela, empresas de petróleo, energia e telecomunicações foram nacionalizadas nos anos 2000.",
          "Em escala menor, mudanças repentinas de tributação e de regras de setor regulado são formas brandas do mesmo risco, e acontecem também em países ricos.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Trocar uma ação brasileira por outra diversifica a empresa, não a regra. Uma intervenção atinge ao mesmo tempo ações, títulos, câmbio e imóveis do mesmo país, porque todos estão sob a mesma caneta.",
          "Diversificar dentro do mesmo país protege contra o erro de uma empresa ou de um setor. Contra uma mudança de regra que vale para todos, a única proteção é ter parte do patrimônio sob outra jurisdição.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "O primeiro erro é achar que esse risco só existe em países instáveis. Países ricos também mudam regras: criam impostos extraordinários sobre lucros de setores específicos, impõem sanções, mudam a tributação de investimentos estrangeiros. O que muda é a frequência e a previsibilidade.",
          "O segundo é achar que ter um ativo estrangeiro comprado por meio de uma instituição local resolve tudo. Um título americano custodiado no Brasil, ou um fundo brasileiro que investe lá fora, continua sujeito a regras brasileiras sobre custódia, câmbio e resgate. A jurisdição de quem guarda o ativo também conta.",
        ],
      },
    ],
    exemplo: "A moratória de Minas Gerais, em janeiro de 1999, o bloqueio do Plano Collor, em 1990, e as idas e vindas do IOF sobre câmbio em 2025 são exemplos brasileiros de regra alterada com o jogo em andamento. Em cada um, quem tinha tudo sob a mesma jurisdição não tinha para onde correr no dia seguinte.",
    naPratica: "Só outra jurisdição dilui esse risco, e mesmo assim não o elimina: troca um risco concentrado por vários diferentes. E vale lembrar o limite: manter dinheiro fora não livra você do imposto brasileiro, que alcança a renda de quem mora aqui no mundo todo. O que muda é que nem todo o patrimônio fica sujeito a uma única decisão.",
    relacionados: ["instituicoes", "jurisdicao", "plano-collor", "crise-de-1999", "iof", "inconsistencia-temporal", "corralito"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "22:12" }, { modulo: 0, aula: 2 }],
  },
  {
    slug: "restricao-orcamentaria-fraca",
    termo: "Restrição orçamentária fraca",
    categoria: "Macro e contas públicas",
    apelidos: ["socorro aos estados", "renegociação das dívidas dos estados", "federalismo fiscal"],
    resumo: "Situação em que um estado, município ou estatal gasta além da conta porque espera ser socorrido pela União. O benefício fica com quem gastou; a conta, com o país inteiro.",
    texto: [
      "Se um governador sabe que, no aperto, a União vai socorrê-lo, gastar além da conta vira um bom negócio. Ele colhe os benefícios, as obras, as contratações, os aumentos, e divide a fatura com todos os brasileiros.",
      "Esse problema tem nome: restrição orçamentária fraca. O termo foi criado pelo economista húngaro János Kornai para descrever estatais socialistas que nunca quebravam, porque o Estado sempre cobria o prejuízo. A ideia vale para qualquer ente que conta com socorro: estados, municípios, estatais, bancos públicos.",
      "Quando a restrição é fraca, o incentivo para gastar com cuidado some. O benefício fica com quem gastou; a conta, com o país inteiro.",
    ],
    secoes: [
      {
        titulo: "No Brasil",
        paragrafos: [
          "O Brasil viveu isso por décadas. A União socorreu bancos estaduais depois das eleições de 1982 e 1986 e renegociou dívidas de estados e municípios em 1989, 1991, 1993 e 1997. Na última, assumiu a dívida em títulos dos estados por 30 anos.",
          "Bancos estaduais como Banespa e Banerj financiavam gastos dos governadores até serem saneados, privatizados ou fechados. Em 2003, o Tesouro tinha a receber dos estados e municípios cerca de 26% do PIB por conta dessas renegociações.",
        ],
      },
      {
        titulo: "A resposta",
        paragrafos: [
          "A Lei de Responsabilidade Fiscal, de 2000, veio como resposta, proibindo socorros entre entes e limitando o endividamento. A renegociação de 1997 também proibiu os estados de emitir novos títulos por décadas, e os bancos estaduais foram, na maioria, privatizados.",
          "Mesmo assim, o problema não desapareceu. Houve novas renegociações depois: mudança no indexador das dívidas em 2014, alongamento em 2016, o Regime de Recuperação Fiscal em 2017 e um novo programa de renegociação em 2025. Estados que gastam boa parte do orçamento com juros e folha investem menos e prestam serviços piores.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O risco fiscal que importa é o do setor público como um todo. A dívida de um estado ou de uma estatal tende a terminar no balanço federal, e uma briga entre um governador e a União pode mexer no câmbio do país inteiro.",
          "Por isso a qualidade das contas de estados grandes, como São Paulo, Rio de Janeiro, Minas Gerais e Rio Grande do Sul, também entra na conta do risco Brasil, mesmo para quem só tem títulos federais.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O problema não é exclusividade de governos locais brasileiros. Na crise de 2008, bancos grandes demais para quebrar foram socorridos nos Estados Unidos e na Europa, e o debate sobre o incentivo que isso cria, de correr riscos sabendo que haverá resgate, dura até hoje. Os economistas chamam esse incentivo de risco moral.",
          "Na zona do euro, os resgates à Grécia, a Portugal e à Irlanda reacenderam a mesma discussão entre países: quem gasta demais conta com o socorro dos vizinhos? A resposta, em quase todo lugar, foi criar regras mais duras e, ao mesmo tempo, socorrer quando a crise apertou.",
        ],
      },
    ],
    exemplo: "Em 6 de janeiro de 1999, o governador de Minas Gerais anunciou uma moratória de 90 dias da dívida com a União. A desconfiança se espalhou, o presidente do Banco Central deixou o cargo uma semana depois, e o real deixou a banda cambial nove dias após o anúncio. A dívida de um estado mudou o preço do dólar para todo mundo.",
    naPratica: "Ao medir o risco fiscal brasileiro, olhe o setor público como um todo, não só o governo federal. E lembre que o socorro de hoje vira dívida federal amanhã, paga com imposto, juro ou inflação. É mais uma razão para não deixar todo o patrimônio dependente de uma única conta pública.",
    relacionados: ["lei-de-responsabilidade-fiscal", "crise-de-1999", "divida-publica", "instituicoes", "privatizacoes", "resultado-primario"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "28:17" }],
  },
  {
    slug: "superciclo-de-commodities",
    termo: "Superciclo de commodities",
    categoria: "Macro e contas públicas",
    apelidos: ["boom de commodities", "ciclo de commodities", "alta das commodities", "fim do boom", "IC-Br", "Índice de Commodities do Banco Central"],
    resumo: "Período longo de alta nos preços de matérias-primas como minério, soja e petróleo. O mais recente foi puxado pela China entre o começo dos anos 2000 e 2011, e mudou a economia brasileira.",
    texto: [
      "Em dezembro de 2001, a China entrou na Organização Mundial do Comércio. Na década seguinte, o país levou centenas de milhões de pessoas do campo para as cidades, construiu prédios, estradas, portos e fábricas numa escala que o mundo nunca tinha visto. Tudo isso precisava de minério de ferro, soja, carne, cobre e petróleo, justamente o que o Brasil vende.",
      "O resultado foi um superciclo de commodities: um período longo, de uma década ou mais, de alta nos preços de matérias-primas. Diferente de uma alta de um ano por causa de uma seca ou de uma guerra, o superciclo vem de uma mudança estrutural na demanda.",
      "O índice de commodities do Banco Central, medido em dólar, quase triplicou entre 2002 e 2011. Para o Brasil, foi a maior bonança externa em gerações.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Do lado da demanda, um país grande se industrializa e passa anos consumindo matérias-primas acima do normal. Do lado da oferta, abrir uma mina ou expandir a fronteira agrícola leva anos. Enquanto a oferta não alcança a demanda, os preços ficam altos.",
          "Quando a oferta finalmente chega, e a demanda desacelera, os preços caem, às vezes por muitos anos. Por isso os ciclos são longos para os dois lados.",
        ],
      },
      {
        titulo: "O que aconteceu no Brasil",
        paragrafos: [
          "Entrou dólar, o real se valorizou, a arrecadação cresceu, a bolsa subiu e o país viveu anos de crescimento mais forte. O dólar, que tinha chegado perto de R$ 4 em 2002, terminou 2010 a R$ 1,67 e tocou R$ 1,53 em julho de 2011, a mínima do período. No meio do caminho, em 2008, o Brasil ganhou o grau de investimento.",
          "A partir de 2011, a desaceleração chinesa derrubou os preços. O Brasil ficou com despesas que tinham crescido na bonança e receitas que já não acompanhavam, um dos ingredientes da recessão de 2015 e 2016.",
        ],
      },
      {
        titulo: "A lição",
        paragrafos: [
          "O Brasil já tinha visto esse filme com o café e a borracha. O risco de toda bonança externa é tratar como permanente uma renda que é temporária.",
          "Países como Chile e Noruega criaram regras para poupar parte da renda das commodities nos anos bons e gastar nos ruins.",
        ],
      },
    ],
    exemplo: "Quem comprou dólar no fim de 2002 e o deixou parado até o fim de 2010 perdeu cerca de 70% do poder de compra em reais: o dólar caiu 53% e os preços no Brasil subiram 57% no período. Foi o melhor momento da história recente para ter tudo em reais, e o pior para ter dólar parado. Nenhuma estratégia de diversificação ganha em todos os períodos.",
    naPratica: "A bolsa brasileira é feita em boa parte de bancos e commodities. Quando o ciclo vira, ela sofre junto com o real e com a arrecadação, porque tudo depende do mesmo preço. Diversificar para setores que dependem de outros motores, como tecnologia e consumo global, reduz essa dependência, sem exigir que você adivinhe quando o próximo ciclo começa ou termina.",
    relacionados: ["termos-de-troca", "balanca-de-pagamentos", "recessao-2015-2016", "cambio-flutuante", "diversificacao", "ibovespa", "grau-de-investimento"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "47:14" }, { modulo: 0, aula: 4, tempo: "14:31" }],
  },
  {
    slug: "termos-de-troca",
    termo: "Termos de troca",
    categoria: "Macro e contas públicas",
    apelidos: ["relação de trocas", "preço das exportações"],
    resumo: "A relação entre o preço do que um país exporta e o preço do que importa. Quando melhora, o país fica mais rico sem produzir mais, só porque o que vende ficou mais caro.",
    texto: [
      "Imagine que o Brasil exporta uma tonelada de soja e, com o dinheiro, importa um certo número de celulares. Se o preço da soja sobe e o do celular fica parado, a mesma tonelada passa a comprar mais celulares. O país ficou mais rico sem produzir um grão a mais.",
      "Essa relação entre o preço do que um país exporta e o preço do que importa tem nome: termos de troca. Quando melhoram, o país ganha poder de compra lá fora. Quando pioram, perde.",
      "Para um exportador de commodities como o Brasil, os termos de troca oscilam muito, porque minério, petróleo, soja e carne têm preços instáveis, formados em dólar, em bolsas do mundo inteiro.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Quando os termos de troca melhoram, entram mais dólares, o real tende a se valorizar, a arrecadação sobe, as empresas exportadoras lucram mais e a bolsa costuma acompanhar. Quando pioram, acontece o contrário, e tudo ao mesmo tempo.",
          "Essa renda vinda de fora é real, mas não depende do esforço do país. Por isso economistas recomendam tratá-la como temporária, poupando parte dela nos anos bons.",
          "Há também um efeito colateral conhecido como doença holandesa. O nome vem da Holanda dos anos 1960, onde a descoberta de gás natural valorizou a moeda e tirou competitividade da indústria. Uma bonança de commodities pode fazer o mesmo: o real forte encarece tudo o que o país produz além das matérias-primas.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "A Noruega descobriu petróleo nos anos 1960 e criou um fundo soberano que hoje passa de US$ 1,5 trilhão, aplicado fora do país, justamente para não gastar a renda do petróleo de uma vez. O Chile adotou regras fiscais que guardam parte da renda do cobre quando o preço está alto.",
          "No Brasil, a disciplina variou. Na aula, Felippe Hermes lembra que Campos Salles arrumou as contas e entregou o governo a Rodrigues Alves em pleno ciclo da borracha, e que no primeiro governo Lula a bonança da China veio acompanhada de superávits acima de 3% do PIB. A partir de 2011, a piora dos termos de troca encontrou despesas que tinham crescido.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O índice da bolsa brasileira tem peso grande de empresas de commodities, como mineração, petróleo e papel e celulose. Quando os termos de troca pioram, essas empresas lucram menos, o real tende a cair e a arrecadação do governo perde força, tudo ao mesmo tempo.",
          "Por isso, uma carteira concentrada em ativos brasileiros carrega, sem perceber, uma aposta grande nos preços internacionais de matérias-primas. Saber disso ajuda a entender por que o seu patrimônio pode oscilar por causa de uma decisão do governo chinês ou de uma safra recorde nos Estados Unidos.",
        ],
      },
    ],
    exemplo: "Hipotético: um país exporta US$ 100 bilhões em minério e importa US$ 100 bilhões em máquinas. Se o preço do minério sobe 30% e o das máquinas fica parado, sobram US$ 30 bilhões para gastar ou poupar, sem esforço adicional. Se no ano seguinte o minério volta ao preço antigo, os US$ 30 bilhões somem, e quem gastou como se fossem permanentes fica com a conta.",
    naPratica: "Real, bolsa e contas públicas brasileiros são sensíveis ao mesmo fator: o preço das commodities. Isso significa que o seu salário, os seus investimentos em reais e o imposto que o governo arrecada podem piorar juntos quando o ciclo vira. Ter parte do patrimônio em economias com outra pauta de exportações é uma forma de não depender só dele.",
    relacionados: ["superciclo-de-commodities", "balanca-de-pagamentos", "cambio-flutuante", "pib", "ibovespa", "diversificacao"],
  },
  {
    slug: "fmi",
    termo: "Fundo Monetário Internacional",
    sigla: "FMI",
    categoria: "Macro e contas públicas",
    apelidos: ["IMF", "acordo com o FMI", "World Economic Outlook"],
    resumo: "Organismo criado em Bretton Woods, em 1944, que empresta a países em crise de balanço de pagamentos e acompanha a economia mundial. Publica projeções de PIB e dívida usadas no mundo todo.",
    texto: [
      "Quando um país fica sem dólares para pagar as contas externas, a quem recorre? Desde 1944, a resposta costuma ser o Fundo Monetário Internacional, o FMI, uma espécie de cooperativa de países com sede em Washington.",
      "O FMI nasceu em Bretton Woods, junto com o Banco Mundial, para dar estabilidade ao sistema de câmbio do pós-guerra. Hoje tem 191 países membros: o mais recente, Liechtenstein, entrou em outubro de 2024. Cada um aporta recursos de acordo com o tamanho da economia, a chamada cota, e pode tomar empréstimos em momentos de crise.",
      "Além de emprestar, o FMI acompanha a economia de cada país membro, em relatórios anuais, e publica projeções usadas no mundo inteiro.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Os empréstimos vêm com condições: metas fiscais, reformas, metas de reservas, às vezes mudanças no regime de câmbio. Por isso o FMI ficou associado, na América Latina, a ajustes duros e impopulares.",
          "A outra face é que um acordo com o Fundo serve de selo para o mercado. Ele sinaliza que o país tem um plano e um fiscal externo acompanhando, o que costuma reduzir o risco-país e trazer de volta o crédito privado.",
          "Duas vezes por ano, em abril e outubro, o FMI publica o World Economic Outlook, com projeções de crescimento, inflação e dívida de praticamente todos os países. Muitos números deste curso vêm dali.",
        ],
      },
      {
        titulo: "O Brasil e o FMI",
        paragrafos: [
          "O Brasil recorreu ao Fundo várias vezes. No começo dos anos 1980, durante a crise da dívida externa. No fim de 1998, num pacote internacional de cerca de US$ 41,5 bilhões para defender o real, que não evitou a desvalorização de janeiro de 1999. Em 2001 e, de novo, em 2002, em plena crise eleitoral.",
          "Em dezembro de 2005, o país pagou adiantado os US$ 15,5 bilhões que ainda devia. Desde então, o Brasil é credor do Fundo, e não devedor.",
        ],
      },
      {
        titulo: "Lá fora",
        paragrafos: [
          "A Argentina é o caso mais frequente na história recente. Em 2018, recebeu o maior empréstimo da história do Fundo, de cerca de US$ 57 bilhões, e em 2025 fechou um novo acordo, de US$ 20 bilhões.",
          "Grécia, Portugal e Irlanda também recorreram ao Fundo na crise do euro, no começo dos anos 2010, junto com os vizinhos europeus. O FMI não é coisa só de país pobre: é o socorro de quem fica sem acesso ao crédito, seja qual for a renda.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "O FMI não é o Banco Mundial. Os dois nasceram juntos, mas o Banco Mundial financia projetos de longo prazo, como estradas e saneamento, enquanto o FMI empresta para crises de balanço de pagamentos e cuida da estabilidade monetária.",
          "O FMI também não socorre empresas nem bancos privados, e não define a política econômica de quem não pede dinheiro. Para os países que não têm acordo, o papel dele é de conselheiro e de fonte de dados.",
        ],
      },
    ],
    exemplo: "Em agosto de 2002, em plena crise eleitoral, o Brasil fechou com o FMI um acordo de cerca de US$ 30 bilhões (na aula, o número lembrado é US$ 40 bilhões). A maior parte só seria liberada em 2003, condicionada a metas de superávit que o novo governo teria de cumprir. O acordo funcionou como ponte entre dois governos.",
    naPratica: "As projeções do FMI são uma boa régua para comparar países sem depender de um único analista. Mostram, por exemplo, que o Brasil é cerca de 2% do PIB mundial, e que a escolha de onde investir abrange os outros 98%. E a história do Fundo lembra que crises de moeda e de dívida externa são recorrentes no mundo emergente.",
    relacionados: ["bretton-woods", "balanca-de-pagamentos", "crise-de-2002", "divida-publica", "pib", "crise-da-divida-externa", "reservas-internacionais"],
    noCurso: [{ modulo: 0, aula: 1 }, { modulo: 0, aula: 2 }],
  },
  {
    slug: "bretton-woods",
    termo: "Bretton Woods",
    categoria: "Macro e contas públicas",
    apelidos: ["acordos de Bretton Woods", "acordo de Bretton Woods", "sistema de Bretton Woods", "fim de Bretton Woods", "choque Nixon"],
    resumo: "O acordo de 1944 que pôs o dólar no centro do sistema monetário mundial, preso ao ouro a US$ 35 por onça, com as outras moedas presas ao dólar. Acabou em 1971, mas o dólar continuou no centro.",
    texto: [
      "Em julho de 1944, ainda na Segunda Guerra Mundial, delegados de 44 países se reuniram num hotel em Bretton Woods, uma estação de montanha no estado americano de New Hampshire, para desenhar o sistema monetário do pós-guerra. O Brasil estava lá.",
      "O acordo pôs o dólar no centro do mundo. O dólar valeria ouro, a US$ 35 por onça, e os bancos centrais poderiam trocar dólares por ouro com o governo americano. As outras moedas teriam câmbio fixo, mas ajustável, contra o dólar.",
      "Do encontro nasceram também o FMI e o Banco Mundial. A libra esterlina, que tinha sido a moeda de referência do mundo no século 19, cedeu o posto.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Os anos 1930 tinham sido um desastre monetário: desvalorizações competitivas, barreiras comerciais, colapso do padrão-ouro e a Grande Depressão. Os negociadores queriam câmbio estável sem a rigidez total do ouro.",
          "Duas figuras dominaram a conferência: o economista britânico John Maynard Keynes e o americano Harry Dexter White. Keynes defendia uma moeda internacional nova. Prevaleceu o plano americano, com o dólar no centro, refletindo o peso dos Estados Unidos, que detinham a maior parte do ouro do mundo.",
        ],
      },
      {
        titulo: "Como funcionava",
        paragrafos: [
          "Pense em uma escada. No topo, o ouro. No degrau seguinte, o dólar, conversível em ouro para bancos centrais. Embaixo, as outras moedas, presas ao dólar. Um país podia ajustar a sua paridade em caso de desequilíbrio grave, com aval do FMI.",
          "O sistema tinha uma tensão interna. Para o mundo ter dólares suficientes para comerciar, os Estados Unidos precisavam gastar mais do que recebiam. Mas, quanto mais dólares circulavam, menor a confiança de que todos poderiam ser trocados por ouro a US$ 35.",
        ],
      },
      {
        titulo: "O fim e o que ficou",
        paragrafos: [
          "Nos anos 1960, com gastos de guerra e inflação, os dólares no exterior passaram a superar o ouro americano. Em 15 de agosto de 1971, o presidente Richard Nixon suspendeu a conversão. Em 1973, as grandes moedas passaram a flutuar.",
          "Mesmo assim, o dólar seguiu como a moeda em que se cotam petróleo, soja, minério e boa parte do comércio, das dívidas e das reservas do mundo.",
        ],
      },
    ],
    exemplo: "Por isso, até hoje, o preço da soja que o Brasil exporta e do petróleo que importa é formado em dólar. Quando o real perde valor, esses preços sobem em reais mesmo que nada tenha mudado lá fora. Hipotético: se o barril custa US$ 80 e o dólar vai de R$ 5 para R$ 6, o mesmo barril passa de R$ 400 para R$ 480.",
    naPratica: "Dolarizar não é torcer pelos Estados Unidos. É reconhecer que a moeda de referência do comércio e das finanças mundiais é o dólar desde 1944, e que boa parte do que você consome tem preço formado nela. Se um dia o dólar for substituído, o hábito de medir tudo numa moeda central deve continuar, e a lógica de não depender de uma moeda só vale do mesmo jeito.",
    relacionados: ["padrao-ouro", "fmi", "cambio-fixo", "cambio-flutuante", "cambio", "moeda-de-reserva", "ouro"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "3:49" }],
  },
  {
    slug: "padrao-ouro",
    termo: "Padrão-ouro",
    categoria: "Macro e contas públicas",
    apelidos: ["padrão ouro", "lastro em ouro", "conversibilidade em ouro", "moeda lastreada"],
    resumo: "Sistema em que a moeda de um país pode ser trocada por uma quantidade fixa de ouro. Dominou o comércio mundial no século 19 e no começo do século 20 e foi abandonado entre as décadas de 1930 e 1970.",
    texto: [
      "No padrão-ouro, uma nota de dinheiro é um recibo. O banco central promete trocá-la, a qualquer momento, por um peso fixo de ouro. Se você tem a nota, tem direito ao metal.",
      "Como a quantidade de ouro no mundo cresce devagar, o governo não consegue imprimir dinheiro à vontade. Os preços tendem a ficar estáveis no longo prazo, e a moeda de um país vale o mesmo que a de outro na proporção do ouro que cada uma representa.",
      "O sistema dominou o comércio mundial no século 19 e no começo do século 20 e foi abandonado aos poucos, entre a década de 1930 e 1971.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O Reino Unido foi o centro desse sistema. A libra foi atrelada ao ouro de forma oficial no começo do século 19, e Londres virou o coração financeiro do mundo. Nas décadas seguintes, Alemanha, França e Estados Unidos aderiram, e o comércio internacional cresceu sobre essa base comum.",
          "O Brasil tentou entrar no clube algumas vezes, com paridades fixas no século 19 e, entre 1906 e 1914, com a Caixa de Conversão, que trocava notas por ouro. As tentativas esbarravam sempre na falta de reservas.",
        ],
      },
      {
        titulo: "Como funcionava",
        paragrafos: [
          "Se um país importava mais do que exportava, pagava a diferença em ouro. O ouro saía, a quantidade de dinheiro dentro do país diminuía, os preços caíam, as exportações ficavam mais baratas e o desequilíbrio se corrigia sozinho. Era uma âncora automática.",
          "O preço da disciplina era a rigidez. Em crises, o país não podia baixar juros nem emitir moeda sem arriscar perder ouro. O ajuste vinha por queda de preços e de salários, o que significa recessão e desemprego.",
        ],
      },
      {
        titulo: "O fim",
        paragrafos: [
          "Na Grande Depressão, quem saiu do padrão-ouro mais cedo, como o Reino Unido em 1931, se recuperou antes. Os Estados Unidos desvalorizaram o dólar em 1933 e 1934, fixando o ouro a US$ 35 a onça.",
          "Depois da Segunda Guerra, Bretton Woods manteve um vínculo indireto: só o dólar valia ouro. Esse último fio foi cortado em 1971. Desde então, as moedas são fiduciárias: valem pela confiança em quem as emite.",
        ],
      },
    ],
    exemplo: "Hipotético: se uma onça de ouro vale US$ 35 por lei, e o governo emite dólares demais, as pessoas trocam notas por ouro, as reservas do banco central caem e ele é obrigado a apertar. Não há reunião, nem decisão, nem votação: a regra decide sozinha. É uma âncora poderosa e, ao mesmo tempo, uma camisa de força.",
    naPratica: "O padrão-ouro ajuda a entender por que o bitcoin, com oferta limitada por regra, costuma ser comparado ao ouro, e por que muitos bancos centrais voltaram a comprar ouro para as reservas. Em qualquer moeda sem lastro, a reserva de valor depende da disciplina de quem a emite, e é por isso que concentrar tudo numa só moeda é concentrar essa confiança.",
    relacionados: ["bretton-woods", "senhoriagem", "cambio-fixo", "bitcoin", "inflacao", "ouro", "funcoes-da-moeda"],
  },
  {
    slug: "crise-de-2008",
    termo: "Crise de 2008",
    categoria: "Macro e contas públicas",
    apelidos: ["crise financeira de 2008", "crise global", "crise do subprime", "subprime", "Lehman Brothers", "quebra do Lehman"],
    resumo: "A crise que começou no crédito imobiliário americano e virou pânico global com a quebra do banco Lehman Brothers, em setembro de 2008. Inaugurou uma década de juros perto de zero no mundo rico.",
    texto: [
      "Durante anos, bancos americanos emprestaram dinheiro para compra de casas a quem não tinha renda para pagar, contando com uma regra que parecia eterna: o preço dos imóveis só sobe. Esses empréstimos, chamados subprime, foram empacotados em títulos e vendidos a investidores do mundo todo, muitas vezes com nota máxima das agências de rating.",
      "Quando os preços dos imóveis caíram, as garantias passaram a valer menos que as dívidas. Ninguém sabia exatamente quem tinha os papéis podres, e os bancos pararam de emprestar uns aos outros.",
      "Em 15 de setembro de 2008, o banco de investimento Lehman Brothers, com mais de US$ 600 bilhões em ativos, pediu falência, a maior da história americana. O que era uma crise imobiliária virou pânico global.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Nas semanas seguintes, a seguradora AIG precisou de socorro, bancos foram vendidos às pressas e o crédito secou no mundo inteiro. Em outubro, o Congresso americano aprovou um pacote de US$ 700 bilhões para estabilizar os bancos.",
          "O Fed, presidido por Ben Bernanke, estudioso da Grande Depressão, levou os juros para perto de zero em dezembro de 2008 e passou a comprar títulos em massa para irrigar o sistema, o chamado afrouxamento quantitativo. O mundo rico entrou numa década de juros reais perto de zero ou negativos.",
        ],
      },
      {
        titulo: "O Brasil em 2008",
        paragrafos: [
          "O Brasil sentiu pelo câmbio e pela bolsa. O dinheiro estrangeiro saiu, o dólar disparou, empresas que tinham apostado no real forte com derivativos tiveram perdas bilionárias. O Banco Central vendeu dólares, ofereceu swaps e liberou recursos do compulsório dos bancos.",
          "Com reservas altas e dívida pública quase toda em reais, o país atravessou a crise sem calote nem socorro do FMI. O PIB ficou praticamente parado em 2009 e cresceu 7,5% em 2010.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "A crise deixou bancos mais regulados, bancos centrais mais ativos e uma década de dinheiro barato que inflou preços de ativos, em especial ações de tecnologia americanas. Também deixou uma lição sobre correlação: em pânico, quase todas as bolsas caem juntas.",
          "Para o Brasil, a década seguinte teve dois tempos: primeiro, dinheiro global procurando retorno nos emergentes; depois, com o fim do ciclo de commodities, a saída desse dinheiro e a recessão de 2015.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Em 2008, diversificar entre bolsas de países diferentes ajudou pouco no primeiro momento, porque quase todas caíram juntas. O que funcionou foi diversificar entre tipos de ativos e entre moedas: títulos do Tesouro americano e o próprio dólar se valorizaram enquanto as ações despencavam.",
          "Para o investidor brasileiro, a crise deixou uma regra prática: em pânico global, o real costuma perder valor, e ter uma parte do patrimônio em dólar funciona como amortecedor. Não é garantia, mas é um padrão que se repetiu em 2008, em 2015 e em 2020.",
        ],
      },
    ],
    exemplo: "Em 2008, o S&P 500 caiu 37% em dólar, e o dólar subiu 32% contra o real, de R$ 1,77 para R$ 2,34. Para quem mora no Brasil, a bolsa americana medida em reais caiu 16%, enquanto o Ibovespa caiu 41%. A moeda amorteceu mais da metade da queda.",
    naPratica: "Em crises globais, as bolsas costumam cair juntas, e o que protegeu o investidor brasileiro em 2008 foi a moeda, não a bolsa de fora. O dólar tende a subir quando o mundo entra em pânico e o real tende a cair. Não há garantia de que o padrão se repita, mas é um exemplo de por que o câmbio também é diversificação.",
    relacionados: ["banco-central", "risco-cambial", "diversificacao", "treasury", "superciclo-de-commodities", "afrouxamento-quantitativo", "fed", "correlacao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "56:28" }, { modulo: 0, aula: 3 }],
  },
  {
    slug: "corralito",
    termo: "Corralito",
    categoria: "Macro e contas públicas",
    apelidos: ["Plano Cavallo", "conversibilidade argentina", "conversibilidade", "pesificação", "um peso por um dólar"],
    resumo: "O limite a saques bancários imposto pela Argentina em dezembro de 2001, no fim do regime em que um peso valia um dólar por lei. Veio junto com calote e com a conversão forçada de depósitos em dólar para pesos.",
    texto: [
      "Em abril de 1991, a Argentina aprovou a Lei de Conversibilidade, do ministro Domingo Cavallo: um peso passaria a valer um dólar, por lei, e o banco central só poderia emitir pesos com dólares em caixa. A hiperinflação acabou em poucos meses.",
      "Confiantes, muitos argentinos passaram a guardar dinheiro em dólar dentro dos bancos do país. Pareciam protegidos duas vezes: pela paridade e pela moeda americana.",
      "Em 1º de dezembro de 2001, com recessão, dívida crescente e uma corrida aos bancos, o governo limitou os saques em dinheiro a 250 pesos por semana. Era o corralito, o cercadinho. O que veio depois mostrou que o dólar guardado no sistema argentino estava sujeito às regras argentinas.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "No fim dos anos 1990, a paridade virou uma armadilha. O peso forte tirava competitividade das exportações, o real desvalorizado no vizinho piorou a situação, e a dívida em dólar crescia. O país entrou em recessão em 1998, e ela se arrastaria até 2002.",
          "O corralito provocou protestos e panelaços. Em poucas semanas, o país teve cinco presidentes. Em dezembro de 2001 veio o anúncio do maior calote de dívida soberana até então. Em janeiro de 2002, a Lei 25.561 acabou com a paridade, e o peso despencou.",
        ],
      },
      {
        titulo: "A pesificação",
        paragrafos: [
          "O golpe final foi a pesificação. Depósitos em dólar foram convertidos em pesos a 1,40 peso por dólar, corrigidos pela inflação, enquanto o dólar no mercado chegou perto de 4 pesos ao longo de 2002. Parte dos depósitos ainda ficou reprogramada, liberada só anos depois.",
          "Quem tinha dólares em casa ou fora do país passou pela crise com o patrimônio em dólar intacto. Quem tinha dólares no banco argentino recebeu pesos que valiam bem menos.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "O corralito marcou uma geração de argentinos. O hábito de guardar dólares em casa, o famoso dólar do colchão, ficou mais forte. O país conviveu, por longos períodos, com controles de câmbio, o chamado cepo, e com várias cotações paralelas do dólar, como o dólar blue.",
          "Desde então, a Argentina passou por novos ciclos de inflação alta, controles e liberalizações. Em abril de 2025, o governo retirou a maior parte das restrições à compra de dólares por pessoas físicas, num novo acordo com o FMI. A desconfiança com o sistema bancário local, porém, leva décadas para se desfazer.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "A diferença entre ter uma moeda e ter um ativo em outra jurisdição é o ponto central. Uma conta em dólar num banco do próprio país protege contra a desvalorização da moeda local, mas não contra uma regra nova do governo local.",
          "Também vale o contrário: ter ativos fora do país, mas por meio de estruturas que dependem do sistema local, pode não dar a proteção esperada. Entender onde o ativo está custodiado e sob qual lei faz parte da diversificação.",
        ],
      },
    ],
    exemplo: "Um argentino com US$ 10 mil depositados num banco de Buenos Aires em 2001 tinha, na prática, um direito sobre o sistema bancário argentino, não dólares. Pela pesificação, recebeu 14 mil pesos corrigidos. Com o dólar perto de 3,40 pesos no fim de 2002, isso comprava cerca de US$ 4 mil, antes da correção pela inflação.",
    naPratica: "Dólar dentro do sistema do próprio país continua sujeito às regras desse país. É a diferença entre ter uma moeda e ter um ativo em outra jurisdição, e um dos motivos para entender onde e com quem o seu dinheiro fica custodiado. O corralito não é uma previsão para o Brasil; é o exemplo mais claro de que a jurisdição faz parte do risco.",
    relacionados: ["cambio-fixo", "jurisdicao", "custodia", "risco-de-expropriacao", "plano-collor", "conta-em-moeda-estrangeira", "dolarizacao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "13:06" }],
  },
  {
    slug: "cruzeiro",
    termo: "Cruzeiro",
    categoria: "História do Brasil",
    apelidos: ["cruzeiros", "cruzeiro novo", "cruzeiros novos", "NCr$", "réis", "mil réis", "padrões monetários"],
    resumo: "A moeda que substituiu o réis em 1942 e que, com idas e vindas de nome, foi o dinheiro do Brasil na maior parte do século 20. Voltou três vezes, a última no Plano Collor, em 1990.",
    texto: [
      "Em novembro de 1942, em plena Segunda Guerra e no governo Vargas, o Brasil aposentou o réis, a moeda que vinha dos tempos da colônia. Mil réis passaram a valer um cruzeiro. Começava a moeda que, com idas e vindas de nome, seria o dinheiro do Brasil na maior parte do século 20.",
      "O cruzeiro viveu mais vidas do que qualquer outra moeda brasileira. Foi cortado, renomeado, substituído e ressuscitado três vezes, a última no Plano Collor, em 1990.",
      "Contar a história do cruzeiro é contar a história da inflação brasileira: cada volta do nome marcava uma tentativa de recomeçar do zero, literalmente cortando zeros.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "O primeiro cruzeiro durou até fevereiro de 1967, quando, depois de anos de inflação alta, veio o cruzeiro novo, com três zeros a menos. Em maio de 1970, o nome antigo voltou, sem corte de zeros. Em 1984, até os centavos foram extintos, porque já não valiam nada.",
          "Em fevereiro de 1986, o cruzeiro deu lugar ao cruzado, com mais três zeros cortados. Em março de 1990, no Plano Collor, o nome voltou de novo, trocado um por um pelo cruzado novo. Em agosto de 1993, perdeu mais três zeros e virou cruzeiro real. Em julho de 1994, o real encerrou a sequência.",
        ],
      },
      {
        titulo: "Por que deu errado",
        paragrafos: [
          "Cada troca tinha a mesma promessa: dinheiro novo, inflação domada. Nenhuma das anteriores ao real cumpriu, porque o nome da moeda não era o problema.",
          "O governo continuava gastando mais do que arrecadava e fechando a conta com emissão de dinheiro. Cortar zeros mudava o tamanho dos números na nota, não a quantidade de dinheiro sendo criada.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "Entre 1942 e 1994, contando o real, o país teve oito moedas. Para o brasileiro, ficou o hábito de desconfiar da moeda nacional como reserva de valor e de procurar proteção em correção monetária, aplicações diárias, imóveis e dólar.",
          "Ficou também uma pergunta que atravessa gerações: em que moeda faz sentido guardar o que se pretende usar daqui a 20 ou 30 anos? Para muitas famílias brasileiras, a resposta prática sempre incluiu alguma coisa fora do real.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Uma moeda não é um ativo neutro. Ela é a promessa de um governo, e o valor dela depende de como esse governo fecha as contas. Mudar o nome, cortar zeros ou trocar a cédula não muda a promessa.",
          "Por isso, ao olhar o patrimônio, vale separar duas perguntas: em que moeda ele está medido e quem está por trás dessa moeda. No século 20, quem respondeu só a primeira pergunta viu o patrimônio encolher a cada troca.",
        ],
      },
    ],
    exemplo: "Somando os quatro cortes de três zeros e a conversão final de 2.750 cruzeiros reais por real, 2,75 quatrilhões de cruzeiros de 1942 equivalem a um único real. Um conto de réis, um milhão de réis, que no começo do século 20 comprava uma casa, vale hoje uma fração tão pequena de um centavo que não dá para escrever sem notação científica.",
    naPratica: "A sequência de moedas mostra que, no Brasil, a unidade em que se mede o patrimônio já mudou várias vezes por decisão do governo. Por décadas, o brasileiro usou o dólar como reserva de valor justamente por isso. O real resolveu boa parte do problema, mas a memória explica por que a ideia de guardar parte do patrimônio em outra moeda soa familiar para tantas famílias.",
    relacionados: ["cruzado", "cruzeiro-real", "plano-real", "hiperinflacao", "plano-collor", "funcoes-da-moeda", "correcao-monetaria"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "11:49" }, { modulo: 0, aula: 2, tempo: "1:10" }],
  },
  {
    slug: "cruzado",
    termo: "Cruzado",
    sigla: "Cz$",
    categoria: "História do Brasil",
    apelidos: ["cruzados", "cruzado novo", "cruzados novos", "NCz$"],
    resumo: "A moeda do Plano Cruzado, de fevereiro de 1986, com três zeros a menos que o cruzeiro. Em janeiro de 1989, no Plano Verão, virou cruzado novo, com mais três zeros cortados.",
    texto: [
      "Em 28 de fevereiro de 1986, os brasileiros acordaram com uma moeda nova. Mil cruzeiros passaram a valer um cruzado, com o símbolo Cz$. Junto com ela, os preços foram congelados por decreto e a correção monetária foi suspensa.",
      "Era o Plano Cruzado, o primeiro grande plano de estabilização depois da volta dos civis ao poder. A moeda carregou o nome do plano e, durante alguns meses, foi símbolo de esperança: a inflação quase sumiu e a popularidade do governo disparou.",
      "O cruzado durou menos de três anos. Em janeiro de 1989, no Plano Verão, virou cruzado novo, com mais três zeros cortados.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Com preços congelados e salários reajustados, o consumo explodiu. Faltaram carne, leite, carros e eletrodomésticos nas prateleiras, e surgiu o ágio, o preço cobrado por fora da tabela. Cidadãos com a lista oficial de preços na mão fiscalizavam supermercados.",
          "Depois das eleições de novembro de 1986, vieram os reajustes do Cruzado II, de tarifas e impostos, o congelamento foi desmontado e a inflação voltou mais forte. Em fevereiro de 1987, com as reservas no chão, o país suspendeu o pagamento de juros da dívida externa.",
        ],
      },
      {
        titulo: "Por que deu errado",
        paragrafos: [
          "Trocar o nome da moeda e congelar preços não resolve inflação se a causa continua lá.",
          "O governo seguia com déficit, a demanda estava aquecida e o congelamento escondia o desequilíbrio em vez de corrigi-lo. Quando os preços foram liberados, a inflação reprimida apareceu de uma vez.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "O cruzado deixou uma lição que os economistas do real levariam a sério: inflação com indexação generalizada não se mata por decreto. Também deixou a desconfiança do público com planos de choque, que pesou contra todos os planos seguintes.",
          "Também ficou a imagem dos fiscais do Sarney, cidadãos que denunciavam supermercados por remarcar preços. A mobilização mostrava a ânsia por estabilidade, e o fracasso mostrou que ela não se impõe por fiscalização.",
        ],
      },
      {
        titulo: "Um detalhe que conta a história",
        paragrafos: [
          "Não houve tempo de imprimir todo o dinheiro novo. Nas primeiras semanas, circularam notas de cruzeiro carimbadas com o novo valor em cruzados: a cédula de 10 mil cruzeiros ganhou um carimbo de 10 cruzados. A cena virou símbolo de improviso.",
          "Três anos depois, o cruzado novo repetiu a solução, com notas de cruzado carimbadas. E, em 1990, as notas de cruzado novo foram carimbadas como cruzeiro. A tinta dos carimbos acompanhou a pressa dos planos.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Os meses de preços congelados pareciam a prova de que o problema estava resolvido. Quem tomou decisões olhando só esse período, como manter dinheiro parado ou fechar contratos longos sem correção, perdeu quando a inflação voltou.",
          "A estabilidade que importa é a sustentada por contas que fecham, e não a imposta por decreto. Esse é o filtro mais útil para avaliar qualquer moeda, inclusive as de países que hoje parecem sólidos.",
        ],
      },
    ],
    exemplo: "O IPCA de 1986 foi de 80%, perto de um terço dos 242% do ano anterior. Em 1987, foi de 363%. Hipotético: quem guardou Cz$ 10 mil em dinheiro vivo de março de 1986 até o fim de 1987 terminou com menos de um quinto do poder de compra, apesar de meses de inflação quase zero no começo.",
    naPratica: "O cruzado é o exemplo clássico de que estabilidade de alguns meses não prova nada. Para quem guarda patrimônio, o que importa é se as contas que sustentam a moeda fecham, e não o nome dela nem a inflação do último trimestre. É uma lição que vale para qualquer país e qualquer moeda.",
    relacionados: ["plano-cruzado", "plano-verao", "cruzeiro", "hiperinflacao", "correcao-monetaria", "moratoria-de-1987", "inflacao-inercial"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "11:49" }, { modulo: 0, aula: 2, tempo: "1:10" }],
  },
  {
    slug: "cruzeiro-real",
    termo: "Cruzeiro real",
    categoria: "História do Brasil",
    apelidos: ["cruzeiros reais"],
    resumo: "A última moeda antes do real, em vigor de agosto de 1993 a junho de 1994. Em 1º de julho de 1994, 2.750 cruzeiros reais passaram a valer um real.",
    texto: [
      "Em 1º de agosto de 1993, no governo Itamar Franco, o cruzeiro perdeu três zeros e virou cruzeiro real, com o símbolo CR$. Seria a última moeda antes do real, e também a mais curta: durou menos de um ano.",
      "Foi o ano de inflação mais alta da série do IPCA: 2.477%. Os preços dobravam a cada dois meses e meio, mais ou menos. Ninguém guardava dinheiro parado, e os supermercados remarcavam etiquetas várias vezes por semana.",
      "O cruzeiro real não foi um plano de estabilização. Foi uma troca técnica, para os números caberem nas máquinas e nos talões de cheque, enquanto a equipe econômica preparava o plano de verdade.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Enquanto ele circulava, o governo montava a saída em etapas. Em meados de 1993, veio um programa de ajuste das contas públicas. No começo de 1994, um fundo que deu ao governo mais liberdade no orçamento.",
          "A partir de 1º de março de 1994, os preços passaram a ser escritos numa régua estável, a URV. O cruzeiro real seguiu só como o dinheiro do bolso, perdendo valor todos os dias contra a URV. No primeiro dia, uma URV valia CR$ 647,50; no último dia de junho, CR$ 2.750.",
        ],
      },
      {
        titulo: "Por que deu certo, por tabela",
        paragrafos: [
          "O cruzeiro real em si não resolveu nada. Mas, ao conviver com a URV, permitiu algo que nenhum plano anterior tinha feito: que as pessoas se acostumassem a pensar em preços estáveis antes de a moeda estável existir.",
          "Ele foi o pano de fundo inflacionado contra o qual a URV parecia sólida.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "Em 1º de julho de 1994, cada URV virou um real, e CR$ 2.750 viraram R$ 1. Foi a última conversão de moeda do país, e a única feita sem congelamento de preços.",
          "Para a memória popular, o cruzeiro real ficou como a moeda das notas com valores gigantescos e da remarcação diária. Para os economistas, como o último capítulo antes de o Brasil finalmente ter uma moeda que guardava valor.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Em 1993, a pergunta não era quanto o dinheiro rendia, e sim quanto tempo ele aguentava parado. Quem tinha acesso a bancos aplicava no mesmo dia; quem não tinha, gastava tudo o mais rápido possível.",
          "A desigualdade de proteção é a lição que fica: em crises de moeda, quem já tem alternativas montadas se defende, e quem precisa montá-las na pressa paga caro. Diversificar é algo que se faz com calma, antes, e não no meio da tempestade.",
        ],
      },
    ],
    exemplo: "Com inflação de 2.477% no ano, quem segurou cruzeiros reais de janeiro a dezembro de 1993 terminou comprando menos de um vigésimo do que comprava. E só nos quatro meses da URV, de março a junho de 1994, o cruzeiro real perdeu mais de três quartos do valor contra a nova régua.",
    naPratica: "A curta vida do cruzeiro real mostra o que é viver numa moeda que não guarda valor: ninguém deixava dinheiro parado, e quem podia se protegia em aplicações diárias ou em dólar. Quem não podia pagava a conta. É a raiz do hábito brasileiro de buscar aplicações que rendem um pouco todo dia.",
    relacionados: ["urv", "plano-real", "cruzeiro", "hiperinflacao", "overnight", "imposto-inflacionario"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:10" }],
  },
  {
    slug: "urv",
    termo: "Unidade Real de Valor",
    sigla: "URV",
    categoria: "História do Brasil",
    apelidos: ["URVs", "régua estável"],
    resumo: "A unidade de conta criada em março de 1994 para preparar o real. Por quatro meses, preços e salários foram escritos em URV, enquanto se pagava em cruzeiros reais. Em julho, a URV virou o real.",
    texto: [
      "Pensa numa régua que não encolhe. De 1º de março a 30 de junho de 1994, preços, salários e contratos no Brasil passaram a ser expressos em URV, a Unidade Real de Valor, uma unidade que o Banco Central atualizava todo dia em cruzeiros reais.",
      "Você continuava pagando em cruzeiros reais, que perdiam valor diariamente. Mas o preço em URV ficava parado. Uma camisa custava 20 URV em março e 20 URV em junho; em cruzeiros reais, o valor subia todo dia.",
      "A URV nunca existiu em cédula. Era só uma unidade de conta, uma régua. E foi a peça mais engenhosa do Plano Real.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "A URV foi criada pela Medida Provisória 434, de 27 de fevereiro de 1994. No primeiro dia, valia CR$ 647,50. O valor diário acompanhava a inflação e, na prática, o dólar.",
          "Aos poucos, salários foram convertidos pela média dos últimos meses, aluguéis e contratos passaram a ser renegociados em URV, e os comerciantes começaram a exibir os dois preços. Em quatro meses, a economia inteira se acostumou a pensar numa moeda estável antes de ela existir.",
          "Em 1º de julho de 1994, a régua virou dinheiro: cada URV passou a valer um real. Naquele dia, uma URV valia 2.750 cruzeiros reais, a mesma cotação do dólar no último dia útil de junho.",
        ],
      },
      {
        titulo: "Por que deu certo",
        paragrafos: [
          "A ideia vinha de economistas brasileiros como Persio Arida e André Lara Resende, que, nos anos 1980, estudavam como desmontar a inflação inercial. O problema dos congelamentos era que cada preço e cada salário estavam num ponto diferente do ciclo de reajuste. Congelar tudo num dia deixava uns no topo e outros no fundo, e a briga para recuperar recomeçava.",
          "A URV resolveu isso sem congelar nada. Deu tempo para que cada preço e cada salário se alinhassem na nova régua. Quando a moeda nova chegou, não havia mais memória de inflação embutida nos contratos.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "A URV é estudada em cursos de economia no mundo todo como uma solução original para um problema que outros países resolveram com mais dor. E mostrou, na prática, que uma moeda pode ter funções separadas.",
          "Para o brasileiro comum, ficou a lembrança dos preços duplos nas vitrines e dos salários convertidos pela média. Foi uma transição trabalhosa, mas sem surpresas, sem confisco e sem congelamento, e é exatamente isso que a tornou crível.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "A URV funcionou porque separou a régua do dinheiro do bolso. Você pode usar a mesma ideia no seu patrimônio: medir o que tem numa unidade estável, e não só no número de reais na conta.",
          "Se o seu patrimônio cresceu 10% em reais num ano em que o real perdeu 15% contra o dólar, você ficou mais pobre na régua do mundo. Olhar o patrimônio também em dólar, ou corrigido pela inflação, é uma forma simples de não se enganar com números nominais.",
        ],
      },
    ],
    exemplo: "Um aluguel de 500 URV ficava em 500 URV de março a junho. Em cruzeiros reais, o valor subia todo dia: de CR$ 323.750 no começo de março para CR$ 1.375.000 no fim de junho. Em julho, virou simplesmente R$ 500, e o inquilino e o proprietário pararam de brigar pelo índice.",
    naPratica: "A URV separou as três funções da moeda: régua de preços, meio de pagamento e reserva de valor. Vale lembrar que, por décadas, a função de reserva de valor no Brasil era cumprida pelo dólar e pela correção monetária, não pela moeda nacional. Pensar nessas três funções separadamente ajuda a decidir o que você espera de cada moeda no seu patrimônio.",
    relacionados: ["plano-real", "inflacao-inercial", "cruzeiro-real", "correcao-monetaria", "hiperinflacao", "funcoes-da-moeda"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "9:02" }],
  },
  {
    slug: "plano-real",
    termo: "Plano Real",
    categoria: "História do Brasil",
    apelidos: ["plano do real", "estabilização de 1994"],
    resumo: "O plano que derrubou a hiperinflação em 1994. Combinou ajuste nas contas, a URV como transição e uma moeda nova, o real, em vigor desde 1º de julho de 1994. É a moeda brasileira mais duradoura desde o réis.",
    texto: [
      "Entre 1986 e 1991, cinco planos tentaram derrubar a inflação com congelamentos, trocas de moeda e até bloqueio de aplicações. Todos falharam, e cada fracasso deixou a inflação mais alta. Em 1993, os preços subiram 2.477% pelo IPCA.",
      "O Plano Real, preparado no governo Itamar Franco por uma equipe reunida por Fernando Henrique Cardoso no Ministério da Fazenda, fez diferente. Não congelou preços, não bloqueou dinheiro e não surpreendeu ninguém: foi anunciado e executado em etapas.",
      "Em 1º de julho de 1994, o real entrou em circulação. É a moeda brasileira mais duradoura desde o réis, e já passou de três décadas.",
    ],
    secoes: [
      {
        titulo: "Quem fez",
        paragrafos: [
          "O plano foi obra de uma equipe que vinha estudando a inflação brasileira havia mais de uma década. Economistas como Persio Arida, André Lara Resende, Edmar Bacha, Gustavo Franco, Pedro Malan e Winston Fritsch se revezaram entre o Ministério da Fazenda e o Banco Central.",
          "Fernando Henrique Cardoso, ministro da Fazenda de maio de 1993 a março de 1994, deu o respaldo político. A moeda nova foi lançada com Rubens Ricupero no ministério, no governo Itamar Franco. A combinação de diagnóstico técnico maduro e apoio político foi o que faltou aos planos anteriores.",
        ],
      },
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Primeiro, um ajuste nas contas públicas, com corte de gastos e o Fundo Social de Emergência, que desvinculou parte das receitas e deu ao governo mais liberdade no orçamento. Depois, a URV, de março a junho de 1994, para alinhar preços e salários numa régua estável. Por fim, a moeda nova, inicialmente presa ao dólar e sustentada por juros altos.",
          "A renegociação da dívida externa, fechada em abril de 1994, e a abertura comercial ajudaram: com importados mais baratos, os produtores nacionais não conseguiam subir preços à vontade.",
        ],
      },
      {
        titulo: "Por que deu certo",
        paragrafos: [
          "Sem congelamento e sem surpresa, a inflação caiu de 2.477% em 1993 para 22% em 1995 e menos de 10% em 1996. O plano atacou a inércia com a URV e ganhou credibilidade com a âncora no dólar.",
          "Mas o sucesso trouxe um problema: sem o imposto inflacionário, o governo e parte dos bancos tiveram de se ajustar. Vieram o Proer, a renegociação das dívidas dos estados, as privatizações e juros altos para segurar o câmbio.",
          "A virada aparece em qualquer série. O IPCA foi de 2.477% em 1993 para 916% em 1994, quase toda essa alta concentrada no primeiro semestre, antes da moeda nova. Depois, 22% em 1995, menos de 10% em 1996 e menos de 2% em 1998. Em quatro anos, o país saiu de uma inflação de quatro dígitos para um patamar de país desenvolvido.",
          "O custo também aparece. Para segurar o real perto do dólar, o Banco Central manteve juros reais altíssimos por anos, e a dívida pública cresceu. Quando a crise da Rússia chegou, em 1998, a âncora já estava cara demais.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "A âncora cambial caiu em janeiro de 1999. No lugar, veio o tripé: meta de inflação, superávit primário e câmbio flutuante, com a Lei de Responsabilidade Fiscal em 2000.",
          "O real sobreviveu à troca de regime, a crises externas e a governos de orientações diferentes, um feito raro na história monetária brasileira.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Mesmo uma moeda bem-sucedida perde valor. A inflação de um dígito, somada por 30 anos, ainda corrói muito o poder de compra.",
          "Também vale lembrar que o sucesso do real dependeu de escolhas que se renovam: superávit, metas, responsabilidade fiscal. A moeda é sólida enquanto essas escolhas são mantidas. Diversificar é uma forma de não depender de que todas sejam mantidas para sempre.",
        ],
      },
    ],
    exemplo: "R$ 1 de julho de 1994 equivale a cerca de R$ 8,30 em agosto de 2026, corrigido pelo IPCA. O dólar saiu de perto de R$ 0,93 para R$ 5,15 no mesmo período. Hipotético: quem guardou R$ 10 mil numa gaveta em 1994 tem hoje o poder de compra de pouco mais de R$ 1.200 daquela época.",
    naPratica: "O real é o grande sucesso dessa história e, mesmo assim, perdeu valor contra o dólar e contra os preços. Dolarizar não é apostar contra ele. É reconhecer que uma moeda bem-sucedida ainda é uma só moeda, com um só banco central e uma só política fiscal por trás.",
    relacionados: ["urv", "hiperinflacao", "imposto-inflacionario", "tripe-macroeconomico", "cambio-fixo", "paridade-do-poder-de-compra", "cruzeiro-real", "crise-de-1999"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "12:31" }, { modulo: 0, aula: 2, tempo: "4:02" }],
  },
  {
    slug: "plano-cruzado",
    termo: "Plano Cruzado",
    categoria: "História do Brasil",
    apelidos: ["Cruzado II", "congelamento de preços", "fiscais do Sarney", "gatilho salarial"],
    resumo: "O plano de fevereiro de 1986 que trocou o cruzeiro pelo cruzado, congelou preços e suspendeu a correção monetária. Derrubou a inflação por alguns meses e terminou com ela mais alta.",
    texto: [
      "Em 28 de fevereiro de 1986, o presidente José Sarney foi à televisão anunciar o fim da inflação. Os preços estavam congelados por tempo indeterminado, a moeda passava a se chamar cruzado e a correção monetária estava suspensa. Era o Plano Cruzado, o primeiro grande plano de estabilização da redemocratização, com o ministro Dilson Funaro na Fazenda.",
      "Nos primeiros meses, funcionou como mágica. A inflação quase sumiu, o poder de compra dos salários subiu e a popularidade do governo disparou. Cidadãos com a tabela de preços na mão fiscalizavam supermercados.",
      "Em menos de um ano, o plano tinha desmoronado, e a inflação voltou mais alta do que antes.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Os salários ganharam um reajuste no lançamento e um gatilho, que os corrigiria automaticamente sempre que a inflação acumulasse 20%. Com renda maior e preços travados, o consumo explodiu.",
          "Logo faltaram carne, leite, carros e eletrodomésticos. O ágio, preço cobrado por fora da tabela, virou regra. Fornecedores reduziam a produção ou maquiavam produtos para escapar do congelamento.",
          "Depois das eleições de novembro de 1986, o Cruzado II reajustou tarifas e impostos. A inflação voltou rápido, o gatilho disparou e alimentou mais inflação. Em fevereiro de 1987, com as reservas no chão, o Brasil suspendeu o pagamento de juros da dívida externa.",
        ],
      },
      {
        titulo: "Por que deu errado",
        paragrafos: [
          "O congelamento atacou o sintoma, não a causa. O governo continuava gastando mais do que arrecadava, a demanda estava aquecida e os preços relativos tinham sido congelados num momento de desalinhamento: alguns produtos tinham acabado de subir, outros estavam defasados.",
          "O gatilho salarial garantiu que, quando a inflação voltasse, voltaria acelerando.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "O Cruzado ensinou que choque sem ajuste fiscal não funciona e queimou a confiança do público em congelamentos.",
          "Os planos seguintes, Bresser e Verão, já começaram desacreditados. Oito anos depois, o Plano Real seria desenhado justamente para não repetir esses erros.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "O Cruzado mostra como decisões de governo podem mudar, de uma hora para outra, as regras de preços, de contratos e de aplicações. A correção monetária foi suspensa por decreto, e quem tinha aplicações indexadas viu as regras mudarem com o dinheiro aplicado.",
          "A memória desse período ajuda a entender por que o brasileiro valoriza liquidez diária e desconfia de aplicações longas. É uma herança racional, mas que pode virar armadilha se impedir de enxergar riscos que não aparecem no extrato do dia.",
        ],
      },
    ],
    exemplo: "O IPCA caiu para 80% em 1986, perto de um terço do ano anterior, e subiu para 363% em 1987 e 980% em 1988. Hipotético: um comerciante que vendia um produto a Cz$ 100 tabelado, mas pagava Cz$ 120 ao fornecedor com ágio, tinha duas saídas: tirar o produto da prateleira ou vender por fora. Multiplique isso pela economia inteira.",
    naPratica: "Congelar preços represa a inflação sem resolver a causa. Para quem guarda patrimônio, o recado é que a estabilidade de um ano não prova nada: o que importa é se as contas que a sustentam fecham. E que governos sob pressão podem mudar regras de preços, de contratos e de aplicações de um dia para o outro.",
    relacionados: ["cruzado", "plano-bresser", "moratoria-de-1987", "inflacao-inercial", "hiperinflacao", "correcao-monetaria", "decada-perdida"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:57" }],
  },
  {
    slug: "plano-bresser",
    termo: "Plano Bresser",
    categoria: "História do Brasil",
    apelidos: ["URP"],
    resumo: "O plano de junho de 1987, do ministro Luiz Carlos Bresser-Pereira, que congelou preços e salários por 90 dias. Não trocou a moeda e não segurou a inflação.",
    texto: [
      "Pouco mais de um ano depois do Cruzado, a inflação estava de volta e já passava de 10% ao mês. Em junho de 1987, o novo ministro da Fazenda, Luiz Carlos Bresser-Pereira, tentou outro choque.",
      "O Plano Bresser congelou preços e salários por 90 dias e criou uma nova regra de reajuste salarial, a Unidade de Referência de Preços, a URP. Diferente do Cruzado, não trocou a moeda e não prometeu o fim da inflação: o objetivo declarado era um choque temporário, seguido de flexibilização controlada.",
      "Também não segurou a inflação. Ao fim dos 90 dias, os preços voltaram a subir, e o ministro deixou o cargo no fim do ano.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "O plano incluía medidas fiscais, como corte de subsídios e aumento de tarifas públicas, e uma tentativa de reorganizar a negociação da dívida externa, então suspensa pela moratória. Mas o congelamento era o centro, e o público, escaldado pelo Cruzado, já não acreditava.",
          "Empresas tinham aprendido a remarcar preços preventivamente, temendo novos congelamentos. Quando ele terminou, a pressão represada voltou. A inflação de 1987 fechou em 363%, e a de 1988 chegou a 980%.",
        ],
      },
      {
        titulo: "Por que deu errado",
        paragrafos: [
          "O plano repetia o diagnóstico de que a inflação era sobretudo inercial, mas sem resolver o déficit público e sem um mecanismo para alinhar preços e salários. Também sofria do mal de todo segundo plano: cada fracasso anterior tornava o seguinte menos crível, e as pessoas se antecipavam ao congelamento subindo preços antes dele.",
          "O ministro tinha clareza do problema fiscal e propôs medidas para enfrentá-lo, mas elas dependiam de apoio político que não veio. Sem ele, o congelamento ficou sozinho, e congelamento sozinho não segura inflação.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "O Bresser ficou conhecido também pela longa disputa judicial sobre a correção da poupança naquele mês. A regra mudou com o dinheiro já aplicado, e poupadores foram à Justiça.",
          "Só em 2018, mais de 30 anos depois, o Supremo homologou um acordo entre bancos e poupadores para pagar as perdas dos planos Bresser, Verão e Collor II.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "O Bresser mostra o custo da reputação perdida. Um plano parecido com outro que já falhou já nasce sob suspeita, e as pessoas se defendem antes, tornando o fracasso mais provável.",
          "Para quem investe, o histórico de quem faz a promessa conta tanto quanto a promessa. E o tempo de reparação também: quando uma regra muda com o dinheiro já aplicado, a compensação, se vier, pode levar décadas.",
        ],
      },
    ],
    exemplo: "O IPCA de 1987 fechou em 363%. Em 1988, chegou a 980%. Hipotético: um poupador com o equivalente a 10 mil em junho de 1987, que discordou da correção aplicada naquele mês, só recebeu a diferença, se aderiu ao acordo, a partir de 2018, depois de três décadas de processo.",
    naPratica: "As disputas sobre a poupança nos planos Bresser, Verão e Collor levaram décadas para terminar. É um exemplo concreto de risco de regra: o que estava combinado mudou com o dinheiro já aplicado, e a reparação, quando veio, demorou uma geração. Não depender de uma única jurisdição é uma forma de não ter todo o patrimônio sujeito a esse tipo de espera.",
    relacionados: ["plano-cruzado", "plano-verao", "risco-de-expropriacao", "hiperinflacao", "correcao-monetaria", "inflacao-inercial", "moratoria-de-1987"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:57" }],
  },
  {
    slug: "plano-verao",
    termo: "Plano Verão",
    categoria: "História do Brasil",
    resumo: "O plano de janeiro de 1989 que criou o cruzado novo, com três zeros a menos, e congelou preços outra vez. Foi seguido pelo ano de inflação mais alta até então.",
    texto: [
      "Em 15 de janeiro de 1989, já no último ano do governo Sarney, o ministro Maílson da Nóbrega anunciou o terceiro choque em três anos. Mil cruzados viraram um cruzado novo, os preços foram congelados outra vez e o principal indexador da época, a OTN, foi extinto.",
      "Era o Plano Verão. Ele trazia também uma desvalorização do câmbio, seguida de congelamento da cotação, e a promessa de cortar gastos.",
      "A credibilidade, porém, estava gasta. O congelamento ruiu em poucos meses, e 1989 terminou com a inflação mais alta da história do país até então: 1.973% pelo IPCA.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Para quebrar a indexação, o plano extinguiu a OTN, que corrigia contratos, impostos e aplicações, e mudou as regras de reajuste. Como no Bresser, a mudança atingiu a correção da poupança no mês do plano, e o caso também foi parar na Justiça.",
          "As medidas fiscais prometidas dependiam do Congresso e esbarraram num ano de eleição presidencial, a primeira direta desde 1960. Os gastos não caíram. Em poucos meses, a inflação voltou e acelerou.",
        ],
      },
      {
        titulo: "Por que deu errado",
        paragrafos: [
          "Cada plano que falhava tornava o seguinte menos crível. Em 1989, empresas e trabalhadores já sabiam o roteiro: congelamento, escassez, descongelamento, inflação maior.",
          "Antecipavam-se subindo preços antes e logo depois do anúncio. Sem ajuste fiscal e sem confiança, o congelamento era só uma pausa.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "No fim de 1989, os preços já subiam perto de 50% ao mês, a linha que os economistas usam para definir hiperinflação. O país chegou à eleição presidencial à beira do descontrole total, e foi nesse cenário que nasceu o Plano Collor, com a medida mais drástica de todas.",
          "Também ficou mais uma disputa judicial sobre a correção da poupança, resolvida só com o acordo homologado pelo Supremo em 2018. Três planos em três anos haviam deixado três disputas sobre a mesma aplicação.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O Brasil não foi o único a tentar congelamentos nos anos 1980. A Argentina lançou o Plano Austral em 1985, com moeda nova e preços congelados, e o Plano Primavera em 1988, ambos fracassados. Israel, que vivia inflação de três dígitos, conseguiu estabilizar em 1985 porque combinou congelamento com um corte profundo do déficit.",
          "A comparação reforça o diagnóstico: o congelamento pode ajudar a quebrar a inércia, mas sem ajuste fiscal a inflação volta.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "O Verão é o retrato do país sem âncora: cada nova medida era recebida com descrença, e a melhor defesa individual era fugir da moeda nacional o mais rápido possível, para dólar, imóveis, estoques ou aplicações diárias.",
          "A lição não é que isso vá se repetir, e sim que a confiança numa moeda é um ativo que se acumula devagar e se perde depressa. Quando ela se perde, quem já tem parte do patrimônio em outra moeda não precisa correr.",
        ],
      },
    ],
    exemplo: "O IPCA de 1989 foi de 1.973%. No fim daquele ano, os preços subiam perto de 50% ao mês. Hipotético: a 50% ao mês, um salário recebido no dia 1º compra, no dia 30, só dois terços do que comprava. Em um ano nesse ritmo, os preços se multiplicam por quase 130.",
    naPratica: "Cada plano que falhava tornava o seguinte menos crível. É a lógica da reputação: o mercado cobra mais de quem já quebrou promessas, e o preço disso aparece em juros, câmbio e na fuga para ativos de fora. Para o seu patrimônio, a lição é olhar o histórico de quem faz a promessa, e não só a promessa.",
    relacionados: ["cruzado", "plano-collor", "hiperinflacao", "inconsistencia-temporal", "plano-bresser", "correcao-monetaria", "plano-cruzado"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:57" }],
  },
  {
    slug: "plano-collor",
    termo: "Plano Collor",
    categoria: "História do Brasil",
    apelidos: ["bloqueio das aplicações", "bloqueio da poupança", "confisco da poupança", "sequestro da liquidez", "Collor II", "Medida Provisória 168", "MP 168"],
    resumo: "O plano de março de 1990 que bloqueou por 18 meses o dinheiro acima de NCz$ 50 mil em contas e poupanças, trouxe o cruzeiro de volta e congelou preços. É o caso mais lembrado de mudança de regra contra o poupador no Brasil.",
    texto: [
      "Em 16 de março de 1990, um dia depois da posse de Fernando Collor, os brasileiros descobriram que não podiam mexer no próprio dinheiro. Pela Medida Provisória 168, saldos acima de 50 mil cruzados novos em conta corrente e na poupança ficaram presos no Banco Central por 18 meses. Um feriado bancário decretado na véspera da posse tinha deixado os bancos fechados por três dias.",
      "Em aplicações a prazo e fundos, as regras eram ainda mais duras: só uma parte pequena podia ser resgatada no vencimento. A moeda voltou a se chamar cruzeiro, e os preços foram congelados.",
      "É o caso mais lembrado de mudança de regra contra o poupador no Brasil, e ganhou um apelido que ficou: sequestro da liquidez.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "O país vivia hiperinflação: em março de 1990, o IPCA subiu 82% num único mês. A equipe da ministra Zélia Cardoso de Mello concluiu que havia dinheiro demais circulando e aplicado no curtíssimo prazo, pronto para virar consumo e remarcação. A solução foi tirar esse dinheiro de circulação de uma vez.",
          "O dinheiro não sumiu. Foi devolvido em 12 parcelas mensais a partir de setembro de 1991, corrigido e com juros de 6% ao ano. Mas, por um ano e meio, empresas e famílias ficaram sem acesso à maior parte do que tinham. Empresas não conseguiam pagar salários, negócios fecharam, tratamentos e mudanças foram adiados.",
        ],
      },
      {
        titulo: "Por que deu errado",
        paragrafos: [
          "A inflação caiu por alguns meses e voltou. O bloqueio não resolveu o déficit público nem a indexação, e o governo foi abrindo exceções para liberar recursos, o que devolveu dinheiro à economia sem controle. O PIB de 1990 caiu mais de 4%.",
          "Em janeiro de 1991, o Plano Collor II tentou outro congelamento e criou a Taxa Referencial, a TR, que até hoje corrige a poupança. A inflação de 1991 fechou em 473% e a de 1992 passou de 1.000%.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "O confisco deixou uma marca profunda na relação do brasileiro com o sistema financeiro.",
          "A preferência por liquidez diária, a desconfiança de aplicações longas e o hábito de guardar parte do patrimônio em dólar ou em imóveis têm raízes aqui. A disputa judicial sobre a correção da poupança no Collor durou décadas.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "O bloqueio atingiu ao mesmo tempo conta, poupança e aplicações de quem tinha dinheiro no sistema brasileiro.",
          "Trocar de banco ou de aplicação não teria protegido ninguém: a regra valia para todos. A diversificação que funcionaria era de outra natureza, entre jurisdições.",
        ],
      },
    ],
    exemplo: "Hipotético: uma família com o equivalente a NCz$ 200 mil na poupança em março de 1990 pôde sacar NCz$ 50 mil. Os outros NCz$ 150 mil ficaram presos e só começaram a voltar, em parcelas, um ano e meio depois. Se ela tinha uma reforma em andamento, um negócio para pagar ou uma mudança marcada, teve de esperar.",
    naPratica: "É o exemplo mais forte do risco de jurisdição: só outra jurisdição dilui uma decisão como essa. Não se trata de prever um novo confisco, que hoje esbarraria em regras e instituições bem diferentes das de 1990, e sim de não deixar todo o patrimônio sob uma única caneta. Uma parte fora do país, em outra moeda, não depende das mesmas decisões.",
    relacionados: ["risco-de-expropriacao", "hiperinflacao", "cruzeiro", "jurisdicao", "instituicoes", "plano-verao", "liquidez"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:57" }],
  },
  {
    slug: "hiperinflacao",
    termo: "Hiperinflação",
    categoria: "História do Brasil",
    apelidos: ["hiperinflações", "inflação galopante", "inflação descontrolada", "superinflação"],
    resumo: "Inflação tão alta que a moeda deixa de funcionar. A definição clássica fala em mais de 50% ao mês. O Brasil chegou lá no começo de 1990, depois de quase uma década de inflação de três ou quatro dígitos ao ano.",
    texto: [
      "Imagine receber o salário no dia 1º e saber que, no dia 30, ele vai comprar só dois terços do que compra hoje. Você corre ao supermercado no mesmo dia, enche o carrinho, aplica o resto antes de o banco fechar. Ninguém guarda dinheiro parado; todo mundo foge da moeda.",
      "Isso é hiperinflação: inflação tão alta que a moeda deixa de funcionar como reserva de valor e, no limite, até como régua de preços. O economista Phillip Cagan, nos anos 1950, propôs a definição clássica: preços subindo mais de 50% ao mês.",
      "O Brasil passou dessa linha no começo de 1990, depois de quase uma década de inflação de três ou quatro dígitos ao ano.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Em março de 1990, o IPCA subiu 82% num único mês, e a inflação de 12 meses chegou a 6.821% em abril. Mas a hiperinflação brasileira foi menos um pico e mais uma longa doença. De janeiro de 1980 a junho de 1994, os preços subiram cerca de 11 trilhões por cento pelo IPCA. Na aula, o número citado é de 13 trilhões; pelo IGP-DI, da FGV, o mesmo período dá 14 trilhões.",
          "Nesse período, o país trocou de moeda cinco vezes, lançou seis planos de estabilização e conviveu com remarcações diárias de preços.",
        ],
      },
      {
        titulo: "Por que aconteceu",
        paragrafos: [
          "Na raiz, um governo que gastava mais do que arrecadava e fechava a conta com emissão de dinheiro. Por cima, a indexação: como quase tudo era corrigido pela inflação passada, a inflação de ontem virava a de hoje. Choques externos, como o do petróleo e a alta de juros americana, aceleraram o processo.",
          "O Brasil se defendeu com indexação: correção monetária em contratos, aplicações diárias, preços em dólar. Isso evitou o colapso total da moeda que Alemanha, Hungria e, mais tarde, Zimbábue e Venezuela viveram, mas tornou a inflação mais resistente.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "A hiperinflação acabou com o Plano Real, em 1994. Ficaram hábitos: a preferência por aplicações pós-fixadas, a desconfiança de prazos longos, a cultura de reajuste anual de contratos e a ideia de que o dólar é a reserva de valor de verdade.",
          "Ficou também uma geração de economistas brasileiros especializados em inflação, cujas ideias sobre indexação e inércia viraram referência internacional. O país que mais sofreu com o problema acabou produzindo uma das soluções mais originais para ele.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Hiperinflação é a forma extrema de o governo cobrar a conta de quem guarda moeda.",
          "Ela não pesa igual para todos: quem tinha acesso a dólar ou a aplicações indexadas se protegia; quem não tinha pagava. A proteção, quando funcionou, foi montada antes.",
        ],
      },
    ],
    exemplo: "Em março de 1990, os preços dobravam a cada 35 dias, mais ou menos. Em 1993, o último ano inteiro antes do real, dobravam a cada dois meses e meio. Hipotético: com 50% ao mês, R$ 1.000 parados viram, em poder de compra, R$ 667 depois de um mês, R$ 444 depois de dois e menos de R$ 10 depois de um ano.",
    naPratica: "A memória desse período é uma das razões pelas quais muitos brasileiros veem o dólar como reserva de valor. Hoje o Brasil tem meta de inflação, Banco Central autônomo e reservas altas, e uma volta da hiperinflação não está no horizonte. Mas a lição permanece: a moeda é uma promessa, e diversificar entre moedas é diversificar promessas.",
    relacionados: ["imposto-inflacionario", "senhoriagem", "correcao-monetaria", "plano-real", "inflacao", "ipca", "plano-collor", "poder-de-compra"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "9:48" }, { modulo: 0, aula: 2, tempo: "1:57" }],
  },
  {
    slug: "correcao-monetaria",
    termo: "Correção monetária",
    categoria: "História do Brasil",
    apelidos: ["indexação", "indexador", "indexadores", "ORTN", "OTN", "BTN", "TR", "Taxa Referencial", "contratos corrigidos"],
    resumo: "A regra de corrigir automaticamente valores pela inflação passada: salários, aluguéis, impostos, poupança e títulos. Criada em 1964, ajudou o país a conviver com a inflação e, ao mesmo tempo, a perpetuá-la.",
    texto: [
      "Em 1964, o Brasil tinha inflação perto de 90% ao ano. Ninguém emprestava dinheiro a prazo, porque a inflação comeria o valor antes do pagamento. O governo não conseguia vender títulos, e o crédito para comprar casa praticamente não existia.",
      "A solução foi a correção monetária: corrigir automaticamente valores pela inflação passada. Naquele ano, o governo criou as Obrigações Reajustáveis do Tesouro Nacional, as ORTN, títulos cujo valor subia com os preços. A ideia se espalhou: impostos, aluguéis, salários, poupança, financiamentos e contratos passaram a ser reajustados por índices.",
      "Funcionou como proteção, e virou armadilha. A correção ajudou o país a conviver com a inflação e, ao mesmo tempo, a perpetuá-la.",
    ],
    secoes: [
      {
        titulo: "Como funcionava",
        paragrafos: [
          "No começo, a correção resolveu um problema real. Com ela, quem emprestava sabia que receberia o valor de volta corrigido. Nasceram a poupança indexada, o Sistema Financeiro da Habitação e um mercado de títulos públicos.",
          "Com o tempo, a indexação virou regra para quase tudo. Se todo preço sobe porque subiu no mês passado, a inflação de ontem vira a de hoje. É a inflação inercial. Quanto mais curto o intervalo de reajuste, mais rápido a roda gira.",
        ],
      },
      {
        titulo: "Os indexadores",
        paragrafos: [
          "Os indexadores mudaram de nome várias vezes: ORTN, OTN em 1986, BTN em 1989 e, desde 1991, a TR, que ainda corrige a poupança e o FGTS. O IGP-M, criado em 1989 pela FGV e muito influenciado por preços em dólar, segue até hoje corrigindo aluguéis.",
          "O Plano Real atacou o problema de frente. A lei que consolidou a nova moeda proibiu cláusulas de reajuste com periodicidade inferior a um ano, quebrando a roda que girava todo mês.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "A correção monetária não desapareceu, mudou de forma. Títulos atrelados ao IPCA, como o Tesouro IPCA, aluguéis pelo IGP-M ou pelo IPCA, salários com reajuste anual e o salário mínimo corrigido pela inflação são herdeiros diretos dela.",
          "A diferença é que hoje a correção é anual, e não mensal ou diária.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Títulos corrigidos pela inflação existem no mundo todo, mas surgiram como exceção. O Tesouro americano só começou a emitir os seus, os TIPS, em 1997. O Reino Unido tem títulos indexados desde os anos 1980. Nos dois casos, são uma fatia menor da dívida, ao lado de títulos prefixados.",
          "No Brasil, a indexação foi a regra por décadas. Isso explica por que o Tesouro IPCA é um produto tão popular aqui e por que o investidor brasileiro tende a olhar o juro real com mais atenção que o americano.",
        ],
      },
    ],
    exemplo: "Hipotético: um aluguel de 1.000 corrigido todo mês pela inflação do mês anterior. Se a inflação foi de 20%, o aluguel vai a 1.200, o que obriga o inquilino a pedir aumento, que vira custo para a empresa, que sobe preços, que viram a inflação do mês seguinte. A roda continua girando sozinha, mesmo sem nenhum choque novo.",
    naPratica: "A correção monetária explica por que o brasileiro se acostumou a aplicações pós-fixadas que rendem um pouco todo dia. É uma herança que muda o jeito de olhar risco: lá fora, renda fixa oscila no extrato, e o mercado é maior em títulos prefixados. Quem vai investir no exterior precisa reaprender a conviver com essa oscilação, que não é perda, é o preço do título se ajustando aos juros.",
    relacionados: ["inflacao-inercial", "urv", "hiperinflacao", "overnight", "inflacao", "igp-m", "tesouro-ipca", "pos-fixado"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "9:48" }, { modulo: 0, aula: 2 }],
  },
  {
    slug: "inflacao-inercial",
    termo: "Inflação inercial",
    categoria: "História do Brasil",
    apelidos: ["inércia inflacionária", "inércia da inflação", "memória inflacionária"],
    resumo: "A inflação que se repete só porque houve inflação antes, já que preços, salários e contratos são reajustados pelo passado. Foi o diagnóstico brasileiro que inspirou a URV.",
    texto: [
      "Em economias muito indexadas, a inflação ganha vida própria. O aluguel sobe porque o índice subiu. O salário sobe porque o aluguel subiu. O preço do pão sobe porque o salário do padeiro subiu. Mesmo sem nenhum choque novo, sem seca, sem alta do petróleo, sem emissão extra de dinheiro, a inflação do mês passado se repete neste.",
      "Isso tem nome: inflação inercial. É a inflação que continua só porque houve inflação antes, como um corpo em movimento que segue em frente por inércia.",
      "Foi o diagnóstico brasileiro dos anos 1980, e a chave para entender tanto o fracasso dos congelamentos quanto o sucesso da URV.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Economistas brasileiros como Persio Arida, André Lara Resende e Francisco Lopes estudaram esse fenômeno nos anos 1980. A pergunta deles era por que a inflação brasileira não caía mesmo em recessão, com desemprego alto e demanda fraca.",
          "A resposta: com a indexação generalizada, cada preço e cada salário estavam amarrados ao passado. A inflação tinha uma memória. Para derrubá-la, era preciso apagar essa memória, e não só esfriar a economia.",
        ],
      },
      {
        titulo: "Por que os congelamentos falharam",
        paragrafos: [
          "A primeira tentativa foi o choque heterodoxo: congelar tudo de uma vez. O problema é que cada contrato estava num ponto diferente do ciclo de reajuste. Quem tinha acabado de ser reajustado ficava no topo; quem estava para ser reajustado ficava no fundo. Congelar nesse momento criava ganhadores e perdedores, e a briga para recuperar recomeçava assim que o congelamento acabava.",
          "Cruzado, Bresser e Verão repetiram o roteiro, com variações. E nenhum deles resolveu o outro lado do problema, o déficit público.",
        ],
      },
      {
        titulo: "A solução do real",
        paragrafos: [
          "A URV foi a resposta engenhosa: alinhar todos os preços numa régua comum antes de trocar a moeda.",
          "Durante quatro meses, cada preço e cada salário foram migrando para a nova unidade, no seu próprio ritmo. Quando o real chegou, não havia mais memória de inflação embutida nos contratos.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "A inércia diminuiu muito com o real, mas não sumiu. O salário mínimo tem regra de reajuste ligada à inflação passada, aluguéis seguem índices, tarifas de energia, água e telefonia são corrigidas por contrato e muitas aposentadorias acompanham a inflação do ano anterior.",
          "Por isso, quando a inflação sobe por um choque, como em 2015 ou em 2021, ela demora para voltar: parte dos preços do ano seguinte já nasce corrigida pelo choque do ano anterior. Nos Estados Unidos, onde a indexação formal é menor, a inflação costuma responder mais rápido aos juros.",
        ],
      },
    ],
    exemplo: "Hipotético: dois trabalhadores com o mesmo salário médio, um reajustado em janeiro e o outro em junho, com inflação de 10% ao mês. Se tudo for congelado em março, o primeiro sai ganhando, porque acabou de ter reajuste, e o segundo perde, porque estava com o salário corroído havia meses. A pressão para reajustar recomeça no dia seguinte ao descongelamento.",
    naPratica: "Entender a inércia ajuda a ler por que a inflação brasileira ainda demora a cair mesmo com juro alto: há muitos preços indexados ao passado, de aluguéis a tarifas e salário mínimo. E é parte da explicação de por que o Brasil convive com juros reais tão mais altos que os de outros países, o que pesa na comparação entre aplicar aqui e lá fora.",
    relacionados: ["correcao-monetaria", "urv", "plano-cruzado", "plano-real", "juro-real", "plano-bresser", "ipca"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "9:02" }],
  },
  {
    slug: "decada-perdida",
    termo: "Década perdida",
    categoria: "História do Brasil",
    apelidos: ["década perdida latino-americana"],
    resumo: "O apelido dos anos 1980 na América Latina: crise da dívida externa, inflação alta e renda por pessoa praticamente parada. No Brasil, foi a década dos planos econômicos fracassados.",
    texto: [
      "Nos anos 1960 e 1970, a América Latina cresceu rápido. O Brasil viveu o chamado milagre econômico, com o PIB crescendo perto de 10% ao ano no começo dos anos 1970. Boa parte desse crescimento foi financiada com dinheiro emprestado em dólar, a juros que acompanhavam os juros americanos.",
      "Então veio a conta. Nos anos 1980, a região mergulhou em crise da dívida, inflação alta e crescimento quase nulo. A renda por pessoa de muitos países terminou a década perto de onde começou, ou abaixo.",
      "O apelido pegou: década perdida. Para muitos países latino-americanos, foram dez anos sem avanço de renda, com crise atrás de crise.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Em 1979, o Fed, comandado por Paul Volcker, começou a subir os juros para derrubar a inflação americana, levando-os para perto de 20%. Ao mesmo tempo, o segundo choque do petróleo encareceu as importações e a recessão nos países ricos derrubou o preço das exportações latino-americanas.",
          "O México parou de pagar em agosto de 1982, e os bancos internacionais cortaram o crédito para a região inteira. Os países tiveram de gerar dólares para pagar juros: cortaram investimento, desvalorizaram as moedas e, em vários casos, imprimiram dinheiro.",
          "No Brasil, a inflação passou de três dígitos, o país recorreu ao FMI, declarou moratória em 1987 e lançou plano atrás de plano.",
        ],
      },
      {
        titulo: "Por que deu errado",
        paragrafos: [
          "O modelo de crescimento financiado por dívida externa a juros flutuantes deixava os países expostos a uma decisão tomada em Washington.",
          "Quando os juros americanos subiram, a conta explodiu sem que os devedores tivessem tomado um centavo a mais. E a resposta doméstica, de financiar o déficit com emissão, alimentou a inflação.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "A década perdida terminou com renegociação das dívidas, abertura comercial e, nos anos 1990, planos de estabilização. No Brasil, deixou a hiperinflação como herança e uma lição duradoura sobre dívida em moeda estrangeira: hoje a dívida pública brasileira é quase toda em reais.",
          "Para a América Latina inteira, a década perdida deixou a desconfiança em dívida externa, a valorização das reservas internacionais e, em vários países, a busca por bancos centrais com mais autonomia.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "A expressão foi usada também para o Japão. Depois do estouro da bolha de ações e imóveis em 1990, o país passou os anos seguintes com crescimento baixo, preços estagnados e bancos frágeis. A bolsa japonesa levou mais de três décadas para voltar ao pico de 1989.",
          "Os dois casos são diferentes, mas deixam a mesma lição: uma economia inteira pode passar muito tempo andando de lado, e quem estava concentrado nela sentiu cada ano.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Uma economia pode passar uma década inteira sem crescer. Quem tinha todo o patrimônio, a renda e o futuro amarrados a ela passou dez anos andando para trás em poder de compra.",
          "Dez anos parecem pouco num livro de história e são muito numa vida financeira. É o tempo de pagar a faculdade dos filhos, de juntar a entrada de um imóvel, de chegar perto da aposentadoria.",
        ],
      },
    ],
    exemplo: "O Brasil teve cinco moedas entre 1986 e 1994 e declarou moratória da dívida externa em 1987. A dívida só foi renegociada de forma definitiva em abril de 1994. Hipotético: uma família que poupou em cruzeiros de 1980 a 1990, sem correção, chegou ao fim da década com uma fração insignificante do que guardou.",
    naPratica: "A década perdida mostra como uma decisão tomada fora do país, a alta de juros nos Estados Unidos, pode desmontar uma economia emergente endividada em dólar. É um exemplo de choque que nenhuma carteira só brasileira teria evitado, e de por que horizontes longos pedem diversificação entre economias, e não só entre ativos do mesmo país.",
    relacionados: ["crise-da-divida-externa", "moratoria-de-1987", "hiperinflacao", "banco-central", "fmi", "fed", "mercados-emergentes"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "4:02" }],
  },
  {
    slug: "crise-da-divida-externa",
    termo: "Crise da dívida externa",
    categoria: "História do Brasil",
    apelidos: ["crise da dívida", "dívida externa", "choque do petróleo", "choques do petróleo", "choque de juros de 1979", "Plano Brady"],
    resumo: "A crise que começou em 1979, com o segundo choque do petróleo e a alta de juros nos Estados Unidos, e quebrou a América Latina endividada em dólar. Só foi resolvida no Brasil com o acordo de 1994.",
    texto: [
      "Em 1979, a Revolução Iraniana disparou o preço do petróleo, e a inflação americana encostou em 15% ao ano. O Fed, comandado por Paul Volcker, decidiu que ia derrubá-la custasse o que custasse, e levou os juros para perto de 20%.",
      "Do outro lado do continente, a América Latina devia centenas de bilhões de dólares a bancos americanos e europeus, a juros que acompanhavam os americanos. A conta dos juros explodiu justo quando os preços das exportações caíam.",
      "O que veio depois foi a crise da dívida externa: uma década de moratórias, renegociações e ajustes que quebrou a América Latina endividada em dólar e só foi resolvida, no caso brasileiro, em 1994.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Nos anos 1970, os bancos internacionais estavam cheios de dólares de países exportadores de petróleo e emprestavam com facilidade aos emergentes. O Brasil usou esse crédito para financiar estradas, hidrelétricas, siderúrgicas e o próprio petróleo. A dívida externa brasileira chegou perto de US$ 100 bilhões no meio dos anos 1980.",
          "Quando os juros subiram, o México declarou moratória em agosto de 1982, e o crédito sumiu para a região. O Brasil recorreu ao FMI, assinou uma série de cartas de intenções, cortou importações e, em fevereiro de 1987, suspendeu o pagamento de juros aos bancos.",
        ],
      },
      {
        titulo: "Por que deu errado",
        paragrafos: [
          "Duas fragilidades se somaram: a dívida era em moeda estrangeira, que o país não emite, e os juros eram flutuantes, ditados pelo Fed.",
          "Os devedores não controlavam nem o preço da moeda nem o custo da dívida. Bastou uma mudança de política nos Estados Unidos para a conta dobrar ou triplicar.",
        ],
      },
      {
        titulo: "Como terminou",
        paragrafos: [
          "A saída veio pela renegociação, com títulos novos e descontos, no modelo conhecido como Plano Brady, do secretário do Tesouro americano Nicholas Brady, lançado em 1989.",
          "O acordo brasileiro com os bancos saiu em abril de 1994, sem o FMI, e o Brasil comprou por conta própria os títulos americanos dados em garantia. Os títulos Brady viraram, por anos, o principal termômetro do risco-país.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "O endividamento em moeda que você não controla é frágil. Isso vale para países, para empresas e também para famílias que assumem dívidas ou compromissos em outra moeda sem renda ou patrimônio nela.",
          "Para uma família, a versão moderna desse risco é assumir compromissos em dólar, como estudar fora ou planejar uma mudança, sem ter nenhuma reserva na mesma moeda. Se o câmbio dispara no meio do caminho, a conta muda de tamanho sem que nada mais tenha mudado.",
        ],
      },
    ],
    exemplo: "Hipotético: um país deve US$ 100 bilhões a juros flutuantes de 6% ao ano. Se o juro americano sobe e a taxa vai a 16%, a conta anual passa de US$ 6 bilhões para US$ 16 bilhões, sem que o país tenha tomado um centavo a mais. Se, ao mesmo tempo, as exportações caem 20%, o dinheiro para pagar encolhe enquanto a conta cresce.",
    naPratica: "Hoje a dívida pública brasileira é quase toda em reais, e as reservas superam a dívida externa do governo, o que reduz esse risco específico. Mas o episódio mostra como juros americanos e o preço do dólar chegam ao patrimônio de quem está no Brasil, mesmo de quem nunca comprou um dólar. Ter parte do patrimônio na moeda que dita as regras do jogo é uma forma de proteção.",
    relacionados: ["decada-perdida", "moratoria-de-1987", "fmi", "banco-central", "risco-pais", "fed", "reservas-internacionais"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "4:02" }],
  },
  {
    slug: "moratoria-de-1987",
    termo: "Moratória de 1987",
    categoria: "História do Brasil",
    apelidos: ["moratória em 1987", "moratória externa", "moratória da dívida externa"],
    resumo: "A suspensão, em fevereiro de 1987, do pagamento de juros da dívida externa brasileira com bancos estrangeiros. Foi a última vez que o Brasil deixou de pagar credores externos.",
    texto: [
      "Em 20 de fevereiro de 1987, o presidente José Sarney foi à televisão anunciar que o Brasil deixaria de pagar os juros da dívida externa aos bancos comerciais estrangeiros. As reservas tinham caído a um nível perigoso depois do fracasso do Plano Cruzado, e o país não tinha dólares para honrar os compromissos.",
      "Era a moratória de 1987. Foi a última vez que o Brasil deixou de pagar credores externos, e um dos episódios mais marcantes da crise da dívida dos anos 1980.",
      "O anúncio foi apresentado como afirmação de soberania. Na prática, não resolveu o problema e fechou ainda mais as portas do crédito.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "O Cruzado tinha aquecido o consumo, as importações cresceram, as exportações caíram e as reservas despencaram ao longo de 1986. No começo de 1987, o país estava sem munição. A suspensão atingiu os juros devidos aos bancos privados, não as dívidas com organismos como o FMI e o Banco Mundial.",
          "Nos meses seguintes, os bancos credores reagiram reduzindo linhas de crédito comercial, e o país ficou ainda mais isolado. A moratória foi sendo desfeita a partir de 1988, com acordos parciais, até a renegociação definitiva com os bancos, assinada em abril de 1994, pouco antes do real.",
        ],
      },
      {
        titulo: "Por que deu errado",
        paragrafos: [
          "A moratória foi menos uma estratégia e mais o reconhecimento de que não havia dinheiro.",
          "Sem um plano fiscal crível e com a inflação voltando, ela não melhorou a capacidade de pagamento do país, só piorou a reputação. O custo apareceu nos anos seguintes, em crédito mais caro e escasso.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "Na conta dos economistas Carmen Reinhart e Kenneth Rogoff, o Brasil deu calote ou renegociou a dívida externa nove vezes entre 1828 e 1983.",
          "Esse histórico ainda pesa no prêmio que o mercado cobra do país. Desde 1994, o Brasil pagou todas as dívidas externas em dia, e em 2005 quitou antecipadamente o que devia ao FMI.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O Brasil não está sozinho nessa história. A Rússia deu calote na dívida interna em 1998, a Argentina protagonizou o maior calote soberano até então em 2001 e voltou a reestruturar dívidas depois, e a Grécia impôs perdas a credores privados em 2012, dentro da zona do euro.",
          "Calotes de governos são mais comuns do que parece, e quase sempre acontecem depois de anos de alerta: dívida crescendo, reservas caindo, juros subindo. O que muda de um caso para outro é quem paga a conta, se credores de fora, poupadores de dentro ou os dois.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "O mercado tem memória longa. Um calote pesa no preço do crédito de um país por décadas, mesmo depois de anos pagando tudo em dia.",
          "O inverso também vale: construir reputação leva tempo. O Brasil paga em dia há mais de três décadas, e mesmo assim o prêmio de risco carrega um pouco da memória de 1987 e dos calotes anteriores.",
        ],
      },
    ],
    exemplo: "Na aula, a moratória aparece numa matriz de quatro saídas para uma conta pública que não fecha: mais impostos, menos gastos, imprimir dinheiro ou não pagar o credor. Em 1987, o Brasil escolheu a última para a dívida externa, enquanto seguia usando a terceira, a emissão de moeda, para a interna.",
    naPratica: "Calote, renegociação forçada e bloqueio são formas de passar a conta ao credor. Quem concentra o patrimônio em títulos e depósitos de um único país fica exposto a essa saída, mesmo que ela pareça improvável hoje. Diversificar devedores, inclusive entre países, é diversificar esse risco.",
    relacionados: ["crise-da-divida-externa", "decada-perdida", "risco-pais", "reservas-internacionais", "plano-cruzado", "default", "fmi"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "23:49" }, { modulo: 0, aula: 2, tempo: "4:02" }],
  },
  {
    slug: "proer",
    termo: "Proer",
    categoria: "História do Brasil",
    apelidos: ["Programa de Estímulo à Reestruturação e ao Fortalecimento do Sistema Financeiro Nacional", "socorro aos bancos", "Banco Econômico", "Banco Nacional", "Bamerindus"],
    resumo: "O programa criado em novembro de 1995 para reorganizar bancos que quebraram com o fim da inflação alta. Financiou a venda de instituições como Nacional e Bamerindus a bancos mais sólidos.",
    texto: [
      "Com inflação alta, um banco brasileiro ganhava dinheiro só por existir. Ele recebia o depósito à vista do cliente, que não rendia nada, e aplicava o dinheiro a taxas que acompanhavam a inflação. Era o imposto inflacionário na versão privada, e sustentava agências, funcionários e, em muitos casos, administrações pouco eficientes.",
      "Quando o Plano Real derrubou a inflação, essa receita desapareceu. Bancos mal administrados ficaram sem chão, e alguns grandes nomes do sistema começaram a balançar.",
      "A resposta foi o Proer, o Programa de Estímulo à Reestruturação e ao Fortalecimento do Sistema Financeiro Nacional, criado pelo Banco Central em novembro de 1995 para reorganizar bancos em dificuldade sem deixar o sistema quebrar.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Pelas contas de Rubens Penha Cysne e Paulo Coimbra-Lisboa, o ganho dos bancos com depósitos caiu de quase 2% do PIB em 1993 para menos de 0,1% em 1995. Ao mesmo tempo, os juros altos para sustentar o real elevaram a inadimplência.",
          "Em agosto de 1995, o Banco Central interveio no Econômico. Em novembro, criou o Proer, com linhas de crédito e incentivos para que bancos saudáveis comprassem a parte boa dos problemáticos, enquanto a parte ruim ficava para ser liquidada. O Banco Nacional foi vendido ao Unibanco em 1995, e o Bamerindus, ao HSBC em 1997. Um programa paralelo cuidou dos bancos estaduais.",
        ],
      },
      {
        titulo: "Por que deu certo (com custo)",
        paragrafos: [
          "O Proer evitou uma corrida bancária generalizada, que teria posto em risco o próprio Plano Real. Os depositantes não perderam o dinheiro, e o sistema saiu mais concentrado e mais sólido.",
          "O custo foi alvo de críticas: dinheiro público usado para socorrer bancos privados e uma recuperação lenta e parcial dos valores. O debate sobre quem deve pagar a conta de um banco quebrado continuou por anos.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "No mesmo período nasceu o Fundo Garantidor de Créditos, o FGC, mantido pelas próprias instituições financeiras, que protege depósitos e algumas aplicações até um limite.",
          "Hoje, o limite é de R$ 250 mil por CPF por instituição, com teto de R$ 1 milhão a cada quatro anos. A regulação bancária ficou mais rígida, e o sistema brasileiro passou por 2008 sem quebras relevantes.",
        ],
      },
    ],
    exemplo: "Hipotético: um banco tinha R$ 1 bilhão em depósitos à vista e ganhava 30% ao mês aplicando esse dinheiro em títulos indexados, sem pagar nada ao cliente. Com o real e a inflação a 2% ao mês, a mesma conta passou a render uma fração disso, e o custo de 500 agências e milhares de funcionários continuou igual. A conta não fechava mais.",
    naPratica: "O Proer mostra que o sistema bancário também é parte do risco do país. A proteção que existe hoje, o FGC, tem limite por CPF e por instituição, e ela própria é brasileira: protege contra a quebra de um banco, não contra uma crise do país. Saber o que cada camada de proteção cobre ajuda a entender por que diversificar entre instituições e entre países são coisas diferentes.",
    relacionados: ["fgc", "imposto-inflacionario", "plano-real", "banco-central", "custodia", "risco-de-credito", "sipc"],
    noCurso: [{ modulo: 0, aula: 2 }],
  },
  {
    slug: "crise-de-1999",
    termo: "Crise de 1999",
    categoria: "História do Brasil",
    apelidos: ["janeiro de 1999", "desvalorização de 1999", "fim da banda", "fim da banda cambial", "moratória de Minas", "moratória de Minas Gerais", "maxidesvalorização"],
    resumo: "A crise que, em janeiro de 1999, derrubou a banda cambial do real. Em semanas, o dólar foi de R$ 1,21 para quase R$ 2. Dela nasceu o tripé macroeconômico.",
    texto: [
      "Em 12 de janeiro de 1999, um dólar custava R$ 1,21. Dezessete dias depois, custava R$ 1,98. Em pouco mais de duas semanas, o real perdeu perto de 40% do valor em dólar, e quem tinha tudo em reais viu o seu poder de compra no mundo encolher na mesma proporção.",
      "Era a crise de 1999, que derrubou o regime em que o Banco Central controlava a cotação do real dentro de uma faixa estreita, a banda cambial. Dela nasceu o tripé macroeconômico que, com ajustes, organiza a política econômica brasileira até hoje.",
      "A crise tinha raízes externas e um gatilho interno, e é um dos melhores exemplos de como uma decisão fora do controle do investidor pode redesenhar o patrimônio dele em dias.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Depois das crises do México, em 1994 e 1995, da Ásia, em 1997, e da Rússia, em 1998, o mercado passou a desconfiar de toda moeda emergente presa ao dólar. O Brasil gastou reservas e subiu juros para defender o real ao longo de 1998, com um pacote de cerca de US$ 41,5 bilhões montado com o FMI no fim do ano.",
          "Em 6 de janeiro de 1999, o governador de Minas Gerais, Itamar Franco, anunciou uma moratória de 90 dias da dívida do estado com a União. A desconfiança se espalhou. Gustavo Franco deixou a presidência do Banco Central em 13 de janeiro e, dois dias depois, o câmbio passou a flutuar.",
          "O dólar chegou a R$ 2,16 no começo de março. Arminio Fraga assumiu o Banco Central, subiu a Selic para 45% ao ano e, em poucos meses, montou o regime de metas de inflação.",
        ],
      },
      {
        titulo: "Por que deu errado (e depois deu certo)",
        paragrafos: [
          "A âncora cambial tinha funcionado para derrubar a inflação, mas exigia juros altíssimos e reservas cada vez maiores para se sustentar. Com o déficit público ainda alto e o mundo desconfiado, a promessa ficou cara demais. O mercado testou, e ela caiu.",
          "O que surpreendeu foi o depois. Muitos previam a volta da inflação alta. Com o tripé, a inflação de 1999 fechou em 8,9% pelo IPCA, perto da primeira meta, de 8%. O real flutuante sobreviveu.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "Ficaram o câmbio flutuante, a meta de inflação, as metas de superávit primário e, no ano seguinte, a Lei de Responsabilidade Fiscal. Ficou também a lição de que o real, sem âncora, oscila muito, e de que o dólar no Brasil pode dar saltos de dezenas de por cento em semanas.",
          "Para o investidor, ficou a prova de que regimes cambiais mudam. O que parecia uma regra fixa, o real perto do dólar, durou menos de cinco anos.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Uma briga entre dois pedaços do mesmo Estado redesenhou em semanas o patrimônio de quem tinha tudo em títulos públicos em reais. Nada disso dependia da carteira de quem sofreu as consequências, nem da qualidade das escolhas que essa pessoa tinha feito.",
          "Também não dependia de prever a data. Quem tentou acertar o momento exato de comprar dólar em 1998 quase sempre chegou tarde. Quem já tinha uma parte do patrimônio em moeda forte não precisou acertar nada.",
        ],
      },
    ],
    exemplo: "Pela cotação oficial do Banco Central, a alta do dólar de 12 a 29 de janeiro de 1999 foi de 64%: em dólar, o real perdeu 39% do valor em pouco mais de duas semanas. Na aula, o número lembrado é de 30% no mês. Hipotético: quem tinha R$ 121 mil, o equivalente a US$ 100 mil no dia 12, passou a ter o equivalente a pouco mais de US$ 61 mil no dia 29, sem ter feito nada.",
    naPratica: "A crise de 1999 é a demonstração mais clara de que ficar todo em reais não é ficar sem risco de câmbio: é ter 100% do patrimônio exposto a ele, só que do lado que perde quando o real cai. Uma parte em dólar não teria evitado a crise, mas teria compensado parte da perda, sem exigir que alguém adivinhasse a data.",
    relacionados: ["cambio-fixo", "cambio-flutuante", "tripe-macroeconomico", "restricao-orcamentaria-fraca", "reservas-internacionais", "meta-de-inflacao", "desvalorizacao-cambial"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "18:55" }, { modulo: 0, aula: 2, tempo: "21:18" }],
  },
  {
    slug: "crise-de-2002",
    termo: "Crise de 2002",
    categoria: "História do Brasil",
    apelidos: ["eleição de 2002", "crise eleitoral de 2002"],
    resumo: "A crise de confiança da eleição presidencial de 2002. Antes de o novo governo tomar qualquer decisão, o dólar foi a R$ 3,96 e o risco-país passou de 2.400 pontos.",
    texto: [
      "Em abril de 2002, o dólar estava a R$ 2,27. Em outubro, chegou a R$ 3,96. O risco-país passou de 2.400 pontos, a Selic terminou o ano em 25% e o Brasil fechou um acordo de US$ 30 bilhões com o FMI. Tudo isso antes de o novo governo tomar qualquer decisão.",
      "Era a crise de confiança da eleição presidencial de 2002. O mercado não reagia a uma medida, mas à hipótese de uma: a chance de o próximo governo mudar as regras do tripé, renegociar a dívida ou voltar a usar a inflação para fechar as contas.",
      "É o caso clássico de risco político puro: o preço da dúvida.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "O candidato favorito, Lula, disputava a quarta eleição presidencial depois de ter se oposto ao Plano Real, às privatizações e à Lei de Responsabilidade Fiscal. O mercado cobrou pela hipótese de ruptura antes de qualquer ato.",
          "O dólar subiu 74% entre a mínima de abril e a máxima de outubro. O EMBI+ Brasil chegou a 2.443 pontos em 27 de setembro: o país pagava 24 pontos percentuais acima dos títulos americanos. Empresas tiveram linhas de crédito externo cortadas, e a inflação voltou a subir com o câmbio: o IPCA de 2002 fechou em 12,5%.",
          "Em junho, a Carta ao Povo Brasileiro comprometeu o candidato com o superávit e o respeito aos contratos. Em agosto, veio o acordo com o FMI, com a maior parte dos recursos liberada só no governo seguinte e condicionada a metas fiscais.",
        ],
      },
      {
        titulo: "Por que passou",
        paragrafos: [
          "Eleito, o governo cumpriu a carta. Manteve o tripé, subiu a meta de superávit primário e conduziu um aperto monetário no começo de 2003.",
          "O prêmio de risco caiu sem que a dívida tivesse mudado de tamanho: o EMBI+ terminou 2003 com média de 835 pontos e seguiu caindo. O dólar fechou 2003 abaixo de R$ 2,90.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "A crise mostrou que o risco político existe antes de qualquer decisão e que credibilidade se constrói com atos, não com discurso. Também mostrou que, num país com dívida curta e atrelada aos juros, a dúvida eleitoral pode custar caro em poucos meses.",
          "Ficou ainda a lição de que o mercado exagera para os dois lados. O dólar perto de R$ 4 em outubro de 2002 caiu abaixo de R$ 3 um ano depois, e abaixo de R$ 2 em alguns anos. Quem comprou no pânico pagou caro; quem já tinha posição montada atravessou a tempestade protegido.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Anos eleitorais costumam trazer mais volatilidade no câmbio brasileiro. Isso não autoriza tentar acertar o momento, mas ajuda a entender por que construir a diversificação aos poucos, independentemente do calendário político, é mais tranquilo do que correr no meio da turbulência.",
          "A volatilidade de anos eleitorais não depende de quem está à frente nas pesquisas. Ela vem da incerteza em si, e por isso costuma aparecer em qualquer eleição disputada.",
        ],
      },
    ],
    exemplo: "A 27% ao ano, a soma do juro americano com o risco-país citado na aula para 2002, uma dívida dobra em menos de três anos. Hipotético: quem tinha R$ 100 mil em abril de 2002, o equivalente a cerca de US$ 44 mil, viu esse valor cair para perto de US$ 25 mil em outubro, medido em dólar, sem ter mexido em nada.",
    naPratica: "O risco político existe antes de qualquer decisão: basta a dúvida. Ele dá para medir, olhando como o dólar se comporta em anos de eleição, mas não dá para evitar nem prever. O que você escolhe é quanto do patrimônio fica exposto a ele, e isso vale qualquer que seja o candidato favorito.",
    relacionados: ["carta-ao-povo-brasileiro", "risco-pais", "embi", "fmi", "cambio-flutuante", "selic", "tripe-macroeconomico"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "18:55" }, { modulo: 0, aula: 2, tempo: "41:25" }],
  },
  {
    slug: "carta-ao-povo-brasileiro",
    termo: "Carta ao Povo Brasileiro",
    categoria: "História do Brasil",
    apelidos: ["carta ao povo"],
    resumo: "O documento divulgado por Lula em 22 de junho de 2002, durante a campanha, com o compromisso de manter o superávit primário, respeitar contratos e controlar a inflação. Marcou a virada da crise daquele ano.",
    texto: [
      "Em 22 de junho de 2002, com o dólar subindo e o risco-país disparando, a campanha do candidato Lula divulgou um texto dirigido ao eleitor e, na prática, ao mercado. Nele, o candidato se comprometia a preservar o superávit primário necessário para a dívida não crescer, a respeitar os contratos e a manter a inflação sob controle.",
      "Era a Carta ao Povo Brasileiro. Virou um dos documentos mais citados da história econômica recente do país, menos pelo que dizia e mais pelo que veio depois.",
      "O episódio virou exemplo de como compromissos públicos ganham valor quando são confirmados pelos atos.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "A carta não acalmou o mercado de imediato. O pior da crise veio entre setembro e outubro de 2002, com o dólar perto de R$ 4 e o risco-país acima de 2.400 pontos. Muitos investidores trataram o texto como promessa de campanha, e promessas de campanha, por definição, não obrigam ninguém.",
          "O que mudou a leitura foi o que veio depois da eleição. O governo eleito manteve o tripé, nomeou uma equipe econômica que sinalizou continuidade, subiu a meta de superávit primário para 4,25% do PIB e, em dezembro de 2005, pagou adiantado o que devia ao FMI.",
        ],
      },
      {
        titulo: "Por que deu certo",
        paragrafos: [
          "A teoria econômica tem um nome para o problema que a carta tentava resolver: promessa sem compromisso é conversa barata. Qualquer candidato pode prometer qualquer coisa. O que dá valor à promessa é o custo de quebrá-la, e esse custo só aparece quando a promessa é cumprida e o mercado passa a contar com ela.",
          "Por isso a carta, sozinha, não bastou. Foram os primeiros meses de governo, com superávit maior e juros altos, que transformaram o texto em compromisso crível.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "O episódio criou um padrão que se repetiu em eleições seguintes: candidatos passaram a sinalizar compromisso com regras fiscais para acalmar o mercado. E deixou um teste que vale para qualquer governo: o mercado precifica promessas pelo histórico de cumpri-las.",
          "Também ficou claro que o mercado não espera a posse para reagir. A janela entre a campanha e os primeiros atos do governo é, quase sempre, o período de maior volatilidade.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Em ano de eleição, discursos e cartas mexem com o preço dos ativos por alguns dias. O que define a tendência é o que acontece depois, quando as decisões aparecem no orçamento, nas nomeações e nas regras. Reagir a cada declaração costuma sair caro.",
          "A forma mais tranquila de lidar com esse ruído é não depender dele: montar a diversificação aos poucos, em qualquer cenário político, e não no meio de uma crise de confiança, quando o dólar já subiu e o pânico já está no preço.",
        ],
      },
    ],
    exemplo: "O EMBI+ Brasil teve média de 1.364 pontos em 2002 e de 835 em 2003. A dívida não tinha encolhido nesse intervalo; a confiança, sim. Hipotético: num título de US$ 1 bilhão, a diferença entre pagar 13,6 e 8,4 pontos percentuais acima dos títulos americanos equivale a mais de US$ 50 milhões de juros por ano.",
    naPratica: "Para o investidor, a lição é que o mercado precifica promessas pelo histórico de cumpri-las. Isso vale para qualquer governo e qualquer país, de qualquer orientação, e é um dos motivos para não deixar todo o patrimônio dependente de uma única leitura política, sobre um único país.",
    relacionados: ["crise-de-2002", "resultado-primario", "risco-pais", "tripe-macroeconomico", "inconsistencia-temporal", "embi", "fmi"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "41:25" }],
  },
  {
    slug: "lei-de-responsabilidade-fiscal",
    termo: "Lei de Responsabilidade Fiscal",
    sigla: "LRF",
    categoria: "História do Brasil",
    apelidos: ["Lei Complementar 101", "LC 101", "responsabilidade fiscal"],
    resumo: "A lei de maio de 2000 que impôs limites a gastos com pessoal e a dívidas de União, estados e municípios, proibiu socorros entre eles e vedou o governo de se financiar no banco que controla.",
    texto: [
      "Até os anos 1990, era comum um governador ou prefeito terminar o mandato deixando contas sem dinheiro para pagar, folha de salários acima da arrecadação e dívidas com bancos estaduais que acabavam no colo da União. O sucessor herdava o rombo, e o país inteiro pagava.",
      "A Lei de Responsabilidade Fiscal, a LRF, foi a resposta. A Lei Complementar 101, de 4 de maio de 2000, impôs limites a gastos com pessoal e a dívidas de União, estados e municípios, proibiu socorros entre eles e vedou o governo de se financiar no banco que controla.",
      "Ela fechou o desenho do tripé com regras para todas as esferas de governo e é, até hoje, a base das finanças públicas brasileiras.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "A lei veio depois de uma sequência de socorros: renegociações de dívidas estaduais em 1989, 1991, 1993 e 1997, privatização ou fechamento de bancos estaduais e a moratória de Minas Gerais em 1999. O recado era que a festa tinha acabado.",
          "Ela limita o gasto com pessoal a uma fatia da receita: 50% para a União e 60% para estados e municípios, somando todos os Poderes. Exige metas fiscais anuais e um anexo com riscos fiscais. Proíbe que um ente socorra outro e impede que o governante deixe, nos últimos oito meses do mandato, despesas que não possam ser pagas.",
        ],
      },
      {
        titulo: "Por que funcionou (em parte)",
        paragrafos: [
          "O cumprimento é cobrado sobretudo por sanções práticas, como o corte de transferências voluntárias e o bloqueio de crédito, e pelos tribunais de contas. Nos primeiros anos, os resultados foram visíveis: estados e municípios passaram a fazer superávit, e o setor público como um todo contribuiu para os superávits acima de 3% do PIB.",
          "A lei controla mais estados e municípios do que a União. E foi contornada de várias formas, com contabilidade criativa e reclassificação de despesas, sobretudo nos anos 2010.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "Os artigos 35 e 36 proíbem que um governo tome empréstimo no banco público que controla. O desrespeito a essa lógica, com bancos federais cobrindo despesas da União, as chamadas pedaladas fiscais, embasou o processo de impeachment de 2016.",
          "Desde então, a LRF serviu de base para as regras fiscais seguintes, o teto de gastos e o arcabouço.",
        ],
      },
    ],
    exemplo: "Hipotético: um estado com receita corrente líquida de R$ 100 bilhões pode gastar até R$ 60 bilhões com pessoal, somando todos os Poderes. Se passar do limite, tem um prazo para voltar e, se não voltar, sofre restrições, como deixar de receber transferências voluntárias e de contratar operações de crédito.",
    naPratica: "A LRF reduziu o risco de socorros e de financiamento disfarçado, mas não o eliminou: houve renegociações de dívidas estaduais depois dela. Regras ajudam; o que o mercado acompanha é se são cumpridas. Para você, é um lembrete de que o risco fiscal brasileiro diminuiu muito desde os anos 1990, sem ter desaparecido.",
    relacionados: ["restricao-orcamentaria-fraca", "tripe-macroeconomico", "arcabouco-fiscal", "teto-de-gastos", "resultado-primario", "divida-publica"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "31:42" }],
  },
  {
    slug: "recessao-2015-2016",
    termo: "Recessão de 2015 e 2016",
    categoria: "História do Brasil",
    apelidos: ["recessão", "recessão de 2015", "grande depressão brasileira", "crise de 2015"],
    resumo: "Dois anos seguidos de PIB em queda, de 3,5% em 2015 e 3,3% em 2016. O superávit primário virou déficit, o Brasil perdeu o grau de investimento e a Selic foi a 14,25%.",
    texto: [
      "Em 2015, o PIB brasileiro caiu 3,5%. Em 2016, caiu mais 3,3%. Foram dois anos seguidos de queda, a pior sequência da série moderna, com desemprego subindo, empresas quebrando, inflação de dois dígitos e o país perdendo o grau de investimento nas três grandes agências.",
      "A aula chama o período de grande depressão brasileira. Diferente das crises de 1999 e 2002, que começaram no câmbio e na confiança, esta foi uma crise da economia real, sentida no emprego e na renda de milhões de famílias.",
      "E, diferente de 2008, não veio de fora. Foi uma crise brasileira, que somou o fim da bonança das commodities a erros de política econômica.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "O fim do boom de commodities, a partir de 2011, deixou o Brasil com despesas que tinham crescido nos anos de bonança e receitas que já não acompanhavam. O superávit primário, acima de 3% do PIB por anos, foi encolhendo e virou déficit em 2014.",
          "Em 2015, vieram a correção de preços represados, como energia e combustíveis, a inflação a 10,7%, a Selic a 14,25% e uma crise política que paralisou decisões. O dólar médio passou de R$ 2,35 em 2014 para R$ 3,33 em 2015 e chegou a passar de R$ 4 em setembro.",
          "Com o orçamento quase todo carimbado, o ajuste caiu sobre investimento, custeio e regras de benefícios. As três grandes agências tiraram o grau de investimento do país entre setembro de 2015 e fevereiro de 2016. O desemprego subiu até passar de 13% no começo de 2017.",
        ],
      },
      {
        titulo: "Por que deu tão errado",
        paragrafos: [
          "Vários fatores se somaram: a queda dos preços das commodities, despesas obrigatórias crescendo mais que a receita, preços administrados represados que depois tiveram de ser corrigidos de uma vez, investimento público e privado em queda e uma crise política que tornou difícil aprovar qualquer ajuste.",
          "Nenhum desses fatores, sozinho, teria produzido dois anos de queda. Somados, criaram um círculo vicioso: menos receita, mais dívida, juros maiores, menos investimento, menos crescimento e, de novo, menos receita.",
        ],
      },
      {
        titulo: "Como saiu",
        paragrafos: [
          "A saída veio com uma aposta em previsibilidade: o teto de gastos, em dezembro de 2016, a reforma trabalhista em 2017 e, depois, a reforma da previdência em 2019.",
          "No Banco Central, a Selic caiu de 14,25% para 6,5% até março de 2018. A recuperação, porém, foi lenta: o PIB só voltou ao nível de 2014 anos depois.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Numa recessão doméstica, renda, emprego, bolsa e câmbio do país pioram juntos.",
          "A pessoa que perde o emprego vê, ao mesmo tempo, o patrimônio em reais perder valor em dólar. É o pior momento para descobrir que tudo depende da mesma economia.",
        ],
      },
    ],
    exemplo: "A média do dólar passou de R$ 2,35 em 2014 para R$ 3,33 em 2015, uma alta de 42% em um ano. Hipotético: alguém com R$ 200 mil investidos em reais e o emprego numa empresa brasileira viu, em 2015, a renda em risco e o patrimônio valer, em dólar, perto de 30% menos que um ano antes, tudo pela mesma causa.",
    naPratica: "Numa recessão doméstica, renda, emprego, bolsa e câmbio do país pioram juntos. É exatamente o cenário em que ter uma parte do patrimônio fora da economia brasileira faz diferença, porque ela não depende das mesmas causas, e muitas vezes se valoriza em reais justamente quando o resto está caindo.",
    relacionados: ["resultado-primario", "teto-de-gastos", "grau-de-investimento", "superciclo-de-commodities", "joesley-day", "pib", "selic"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:09:04" }],
  },
  {
    slug: "joesley-day",
    termo: "Joesley Day",
    categoria: "História do Brasil",
    apelidos: ["18 de maio de 2017"],
    resumo: "O 18 de maio de 2017, dia seguinte à revelação de uma gravação do presidente Michel Temer feita pelo empresário Joesley Batista. A bolsa caiu tanto que o pregão foi interrompido, e o dólar subiu 8,8%.",
    texto: [
      "Na noite de 17 de maio de 2017, uma notícia publicada pelo colunista Lauro Jardim, do jornal O Globo, revelou que o empresário Joesley Batista tinha gravado uma conversa com o presidente Michel Temer, como parte de um acordo de delação premiada.",
      "No dia seguinte, 18 de maio, o mercado brasileiro viveu um dos pregões mais violentos da sua história recente. O Ibovespa caiu mais de 10% logo cedo, e a negociação na bolsa foi interrompida automaticamente. O dia entrou para o vocabulário do mercado com um apelido: Joesley Day.",
      "Não importa aqui o mérito político do episódio. O que importa para quem investe é como uma única notícia, numa noite, mexeu de uma vez com bolsa, câmbio e juros.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "Naquele momento, o governo tentava aprovar reformas no Congresso, entre elas a da previdência, e o mercado tinha embutido nos preços a expectativa de que elas passariam. A notícia foi lida como ameaça direta a essa agenda.",
          "No dia 18, o circuit breaker, mecanismo que interrompe o pregão quando a queda passa de 10%, foi acionado pela primeira vez desde 2008. O Ibovespa fechou em queda de 8,8%. O dólar subiu de R$ 3,11 para R$ 3,38, alta de 8,8%. O risco-país saltou 42 pontos. Os juros futuros dispararam.",
        ],
      },
      {
        titulo: "Por que o impacto foi tão grande",
        paragrafos: [
          "Os preços dos ativos brasileiros estavam apoiados numa aposta: reformas aprovadas, juros em queda, recuperação da economia. Quando a aposta ficou em dúvida, tudo foi reprecificado ao mesmo tempo, porque tudo dependia da mesma premissa.",
          "Ações, câmbio e juros reagiram juntos porque não eram apostas independentes. Eram a mesma aposta, sobre o mesmo país, vestida de formas diferentes.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "O governo sobreviveu, mas gastou o capital político que seria usado em reformas, e a da previdência só seria aprovada em 2019, no governo seguinte. Os mercados se recuperaram nos meses seguintes, mas o episódio virou referência de risco político concentrado.",
          "Ficou também a imagem do pregão interrompido, que se tornaria comum, de outro jeito, três anos depois, na pandemia.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Choques políticos de um dia não são exclusividade brasileira. Na madrugada de 24 de junho de 2016, quando o resultado do referendo do Brexit ficou claro, a libra esterlina caiu mais de 8% contra o dólar em poucas horas, para o menor nível em mais de 30 anos. O Reino Unido tem uma das democracias mais estáveis do mundo, e mesmo assim a moeda sentiu.",
          "O que muda entre países é a frequência e o tamanho desses choques, e quanto do patrimônio de cada investidor está exposto a eles.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Ninguém prevê uma gravação. O risco político não aparece em planilha, não tem data marcada e pode virar o mercado em horas.",
          "A única defesa é estrutural: decidir antes quanto do patrimônio fica exposto a eventos assim.",
        ],
      },
    ],
    exemplo: "Em um único dia, quem tinha todo o patrimônio em ações brasileiras viu perto de 9% evaporar, e quem tinha uma parte em dólar viu essa parte subir quase o mesmo tanto em reais. Hipotético: numa carteira de R$ 500 mil com 80% em ações brasileiras e 20% em dólar, a perda do dia teria sido de cerca de R$ 26 mil, em vez dos R$ 44 mil de uma carteira toda em ações brasileiras.",
    naPratica: "Na aula, a frase que resume o episódio é que o risco político brasileiro não pode ser 100% do seu risco patrimonial. Ninguém prevê uma gravação, uma delação ou uma crise de governo; dá apenas para decidir quanto do patrimônio fica exposto a eventos assim, e essa decisão se toma em dias calmos.",
    relacionados: ["risco-pais", "recessao-2015-2016", "cambio-flutuante", "risco-de-expropriacao", "diversificacao", "circuit-breaker", "ibovespa"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:17:30" }],
  },
  {
    slug: "pandemia-de-2020",
    termo: "Pandemia de 2020",
    categoria: "História do Brasil",
    apelidos: ["pandemia", "covid", "covid-19", "orçamento de guerra", "cisne negro de 2020"],
    resumo: "O choque da covid-19 na economia brasileira: déficit de 9,2% do PIB, dívida a 87% do PIB, Selic a 2% e dólar de R$ 4,02 a R$ 5,94 em cinco meses.",
    texto: [
      "Em março de 2020, o mundo parou. Fábricas fecharam, aviões ficaram no chão, lojas baixaram as portas. A bolsa brasileira interrompeu o pregão seis vezes em poucos dias, e o Ibovespa perdeu quase metade do valor entre janeiro e o fim de março.",
      "A pandemia de covid-19 foi o choque mais rápido e mais amplo da economia moderna. No Brasil, deixou números de crise de guerra: déficit primário de 9,2% do PIB, dívida bruta a 86,9% do PIB, Selic a 2% e dólar de R$ 4,02 a R$ 5,94 em cinco meses.",
      "É o exemplo perfeito do que o mercado chama de cisne negro: um evento raro, de impacto enorme, que ninguém tinha posto no cenário.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "O PIB brasileiro caiu 3,3% em 2020. Para segurar a renda das famílias, o governo pagou o auxílio emergencial e programas de manutenção de emprego. Em maio, o Congresso aprovou o chamado orçamento de guerra, a Emenda Constitucional 106, que separou os gastos da emergência das regras fiscais normais.",
          "Com a inflação em queda no auge do isolamento, o Banco Central levou a Selic a 2% em agosto de 2020, o menor nível da história. Com juro real negativo, o Brasil perdeu atrativo para o dinheiro de curto prazo, e o dólar chegou a R$ 5,94 em maio.",
          "Cadeias globais de produção quebraram. A falta de chips travou a indústria de carros por anos.",
        ],
      },
      {
        titulo: "Por que a conta veio depois",
        paragrafos: [
          "Na reabertura, a demanda voltou antes da oferta. Combustíveis, alimentos e bens industriais subiram no mundo todo. No Brasil, somou-se o dólar alto. A inflação de 2021 fechou em 10,1%, e a Selic voltou a subir a partir de março daquele ano, chegando a 13,75% em 2022.",
          "A dívida, por outro lado, melhorou rápido: voltou a 71,7% do PIB em 2022, ajudada pela inflação, que inflou o PIB em reais e a arrecadação.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "A pandemia deixou dívidas maiores no mundo inteiro, uma onda de inflação global e juros mais altos em quase todos os países. Também deixou a lição de que a correlação entre ativos muda em pânico: no primeiro momento, quase tudo caiu junto, menos o dólar e os títulos do Tesouro americano.",
          "No Brasil, ficou também a lembrança de como a Selic a 2% era frágil: em pouco mais de um ano, o juro voltou a dois dígitos. Juros muito baixos num país com histórico de inflação costumam durar pouco.",
        ],
      },
      {
        titulo: "A lição para quem investe",
        paragrafos: [
          "Não há como se preparar para um evento específico que ninguém previu. Há como se preparar para a categoria: ter o patrimônio espalhado entre causas diferentes, para que nenhum choque único decida tudo.",
          "Nenhum analista pôs uma pandemia global no cenário de 2020. Quem estava diversificado entre moedas e países não precisou ter previsto nada para sofrer menos.",
        ],
      },
    ],
    exemplo: "Em 2020, o dólar foi de R$ 4,02 em janeiro para R$ 5,94 em maio, uma alta de quase 48%. Hipotético: um investidor com 20% do patrimônio em dólar viu essa parte subir perto de 48% em reais nos mesmos meses em que a bolsa brasileira despencava, o que amorteceu boa parte da queda do total.",
    naPratica: "A pandemia é o cisne negro clássico: um evento raro e de impacto enorme que ninguém pôs no cenário. A defesa contra o que não dá para prever é não ter tudo exposto à mesma causa. Em choques globais, o dólar tende a se valorizar contra moedas emergentes, e é por isso que ele costuma funcionar como amortecedor numa carteira brasileira.",
    relacionados: ["divida-pib", "resultado-primario", "selic", "juro-real", "cambio-flutuante", "cisne-negro", "circuit-breaker"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:22:05" }],
  },
  {
    slug: "privatizacoes",
    termo: "Privatizações",
    categoria: "História do Brasil",
    apelidos: ["privatização", "Programa Nacional de Desestatização", "PND", "desestatização"],
    resumo: "A venda de empresas estatais ao setor privado, iniciada em 1990 com o Programa Nacional de Desestatização e acelerada nos anos 1990, com siderúrgicas, Vale e o sistema Telebras.",
    texto: [
      "Até os anos 1980, o Estado brasileiro era dono de siderúrgicas, mineradoras, telefônicas, petroquímicas, bancos estaduais, distribuidoras de energia e até de empresas de aviação. Muitas davam prejuízo, dependiam de aportes do Tesouro e serviam de instrumento de política, controlando preços para segurar a inflação.",
      "Privatização é a venda de empresas estatais ao setor privado. No Brasil, o movimento começou em 1990, com o Programa Nacional de Desestatização, e acelerou nos anos 1990 com siderúrgicas, a Vale e o sistema Telebras.",
      "Foi uma das respostas ao buraco nas contas que o fim da inflação revelou, e mudou a cara da economia e da bolsa brasileira.",
    ],
    secoes: [
      {
        titulo: "O que aconteceu",
        paragrafos: [
          "O Programa Nacional de Desestatização foi criado em abril de 1990. A primeira grande venda foi a Usiminas, em outubro de 1991. Seguiram-se outras siderúrgicas, como a CSN, petroquímicas e a Embraer.",
          "Em maio de 1997, a Vale do Rio Doce foi a leilão, num negócio de cerca de R$ 3,3 bilhões. Em julho de 1998, o sistema Telebras foi dividido em 12 empresas e vendido por R$ 22 bilhões, com ágio de 63% sobre o preço mínimo. Bancos estaduais como o Banespa foram vendidos na mesma época.",
          "Nas décadas seguintes, o movimento continuou em ondas menores, com concessões de rodovias, aeroportos e saneamento, a capitalização da Eletrobras em 2022 e a da Sabesp em 2024.",
        ],
      },
      {
        titulo: "Por que importou",
        paragrafos: [
          "As privatizações ajudaram a abater dívida, trouxeram investimento e tiraram do Tesouro empresas que precisavam de aporte. O caso das telecomunicações é o mais visível: a telefonia se espalhou rapidamente pelo país depois da venda.",
          "Os debates continuam até hoje, sobre preços de venda, regulação e o papel do Estado. O que é consenso é que o mapa empresarial brasileiro mudou.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "A composição da bolsa reflete essa história. Muitas das maiores empresas listadas são ex-estatais ou ainda têm o governo como controlador.",
          "Isso traz para a carteira um risco particular: decisões de política pública podem afetar preços, investimentos e dividendos dessas empresas.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O Brasil privatizou no mesmo período em que boa parte do mundo fazia o mesmo. O Reino Unido, nos anos 1980, vendeu a British Telecom, a British Gas e outras estatais, numa onda que espalhou ações entre milhões de pequenos investidores. O Leste Europeu privatizou economias inteiras depois do fim do comunismo, e o Chile vendeu estatais ainda nos anos 1970 e 1980.",
          "O resultado variou muito de país para país, conforme a qualidade da regulação que veio depois. Privatizar é vender a empresa; fazer o setor funcionar bem depende das regras que ficam.",
        ],
      },
    ],
    exemplo: "Antes da venda do sistema Telebras, uma linha de telefone fixo era um bem que entrava na declaração de imposto de renda e podia custar milhares de reais no mercado paralelo, com fila de espera de anos. Depois, a linha virou serviço comum, e o celular chegou a quase todos os brasileiros.",
    naPratica: "Quem compra um índice de ações brasileiro compra, junto, uma fatia relevante de empresas sob influência do governo. Não é bom nem ruim por si; é um risco específico, que se soma ao risco do país. Diversificar para bolsas com outra composição setorial e outro tipo de controle é uma forma de não concentrar esse risco.",
    relacionados: ["plano-real", "restricao-orcamentaria-fraca", "divida-publica", "risco-de-expropriacao", "ibovespa", "acao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "14:55" }],
  },
  {
    slug: "overnight",
    termo: "Overnight",
    categoria: "História do Brasil",
    apelidos: ["aplicação de um dia para o outro", "conta remunerada", "open market"],
    resumo: "Aplicação de um dia para o outro, lastreada em títulos públicos, que protegia da inflação quem tinha acesso aos bancos nos anos de hiperinflação. Era o refúgio diário do dinheiro de empresas e famílias de renda mais alta.",
    texto: [
      "Com preços subindo mais de 1% por dia, deixar dinheiro parado de um dia para o outro era perder. Nos anos de inflação alta, os bancos ofereciam uma saída: o overnight. O dinheiro era aplicado à noite em títulos públicos e voltava na manhã seguinte com a correção do dia.",
      "O nome, em inglês, quer dizer de um dia para o outro. Para empresas e famílias com conta em banco, era o refúgio diário. Para quem recebia em dinheiro vivo, era uma porta fechada.",
      "O overnight foi uma das faces mais desiguais da hiperinflação, e uma das heranças mais duradouras dela no jeito brasileiro de investir.",
    ],
    secoes: [
      {
        titulo: "Como funcionava",
        paragrafos: [
          "No fim do dia, o banco recolhia o saldo das contas que aceitavam a aplicação e comprava títulos públicos com compromisso de revenda no dia seguinte. A taxa acompanhava a inflação e os juros do dia. De manhã, o dinheiro voltava à conta, um pouco maior.",
          "Nos anos mais agudos, surgiram contas remuneradas que faziam isso automaticamente. Empresas tinham tesoureiros dedicados a aplicar o caixa todo dia.",
        ],
      },
      {
        titulo: "Quem ganhava e quem perdia",
        paragrafos: [
          "Quem tinha conta remunerada se defendia da inflação. Quem recebia em dinheiro vivo, ou não tinha acesso a banco, pagava o imposto inflacionário inteiro. A diferença entre os dois, acumulada mês a mês, aprofundava a desigualdade.",
          "O mesmo mecanismo financiava o governo todos os dias, rolando a dívida pública em prazos curtíssimos. Era um sistema frágil: a dívida inteira vencia, na prática, todo dia.",
        ],
      },
      {
        titulo: "O que ficou",
        paragrafos: [
          "O Plano Collor bloqueou boa parte desse dinheiro em 1990, e a estabilização do real tirou do overnight a razão de existir. Mas a lógica sobreviveu.",
          "A taxa de um dia entre bancos, o CDI, virou a referência de quase toda a renda fixa brasileira, e a Selic diária é herdeira direta do mercado de overnight.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "O termo continua vivo no mercado. Nos Estados Unidos, overnight é o empréstimo de um dia entre bancos e fundos, lastreado em títulos do Tesouro, e as taxas desse mercado servem de referência para trilhões de dólares em contratos. A diferença é que lá a taxa de um dia é uma peça técnica, quase invisível para o investidor comum.",
          "No Brasil, a taxa de um dia está no centro da vida financeira de todo mundo. A Selic é, na prática, a taxa do overnight com títulos públicos, e o CDI, a do overnight entre bancos. Quando você compara um CDB a 100% do CDI, está usando uma régua que nasceu do refúgio diário contra a hiperinflação.",
        ],
      },
    ],
    exemplo: "Hipotético: com inflação de 40% ao mês, R$ 10 mil parados por um mês viravam o equivalente a cerca de R$ 7 mil em poder de compra. No overnight, voltavam corrigidos dia a dia e preservavam quase todo o valor. Duas famílias com o mesmo saldo terminavam o mês com patrimônios bem diferentes.",
    naPratica: "O hábito brasileiro de buscar aplicações que rendem um pouquinho todo dia, como o CDI, vem desse tempo. Ele explica parte do conforto com o pós-fixado e do estranhamento com investimentos que oscilam, como a renda fixa americana. Entender essa herança ajuda a não confundir oscilação de preço com perda quando você começa a investir lá fora.",
    relacionados: ["imposto-inflacionario", "hiperinflacao", "correcao-monetaria", "cdi", "plano-collor", "pos-fixado", "selic"],
    noCurso: [{ modulo: 0, aula: 2 }],
  },
];

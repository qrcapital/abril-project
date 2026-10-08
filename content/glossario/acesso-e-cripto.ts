import type { Verbete } from "@/lib/glossario";

// Verbetes: Acesso, contas e impostos; Cripto e tecnologia. Separados por bloco de categorias em
// 07/out/2026 para a revisão paralela (um agente por arquivo). 64 verbetes.
//
// Engordados como artigos em 07/out/2026 (docs/GLOSSARIO-ARTIGOS.md): abertura em `texto`, 3 a 5
// `secoes` com intertítulo, `exemplo` e `naPratica`. Regras tributárias e cambiais conferidas em
// fonte primária (Planalto, BCB, Receita Federal, IRS, SIPC, FGC) em outubro de 2026: Decreto 12.499/2025
// (IOF), Lei 14.754/2023, Lei 15.270/2025, Resolução BCB 279/2022 (CBE), Resolução BCB 521/2025,
// IN RFB 2.291/2025 (DeCripto). Nada aqui é orientação tributária individual.
export const VERBETES_ACESSO_CRIPTO: Verbete[] = [
  {
    slug: "marco-cambial",
    termo: "Marco cambial",
    categoria: "Acesso, contas e impostos",
    apelidos: ["novo marco cambial", "Lei 14.286", "Lei 14.286/2021", "nova lei de câmbio", "lei cambial"],
    resumo:
      "A Lei 14.286, de dezembro de 2021, em vigor desde o fim de 2022, que reescreveu as regras de câmbio do Brasil. Simplificou o envio de dinheiro ao exterior e abriu espaço para contas globais e remessas digitais.",
    texto: [
      "Até o fim de 2022, mandar dinheiro para fora do Brasil era um exercício de paciência. Havia formulário, código de natureza da operação, às vezes uma ida à agência para explicar ao gerente por que você queria comprar dólar. As regras estavam espalhadas em dezenas de leis, decretos e normas, algumas escritas nos anos 1930, quando o país vivia com medo crônico de faltar moeda forte.",
      "O marco cambial é a lei que arrumou essa gaveta. A Lei 14.286, de 29 de dezembro de 2021, em vigor desde 31 de dezembro de 2022, reuniu as regras de câmbio e de capital estrangeiro num texto só e deu ao Banco Central a tarefa de detalhar o resto por resolução.",
      "Para quem investe, o efeito mais visível foi indireto. Com regras mais simples, bancos, corretoras e fintechs passaram a oferecer contas em dólar, remessas pelo celular e acesso a corretoras no exterior a custos que, dez anos antes, eram privilégio de quem tinha private banking.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O Brasil passou boa parte do século 20 com pouca reserva em dólar e crises recorrentes de balanço de pagamentos. A legislação refletia esse trauma: tratava a saída de dinheiro como algo a ser vigiado de perto, com um decreto de 1933 que classificava certas operações de câmbio como ilegítimas e uma lei de 1962 sobre capital estrangeiro que ficou em pé por seis décadas.",
          "Com o real estável, câmbio flutuante desde 1999 e reservas internacionais grandes, o medo diminuiu. O Banco Central foi simplificando por normas ao longo dos anos 2000 e 2010, mas a base legal continuava velha. O marco cambial foi a reforma da base: revogou dezenas de dispositivos antigos e trocou a lógica da autorização prévia pela lógica do registro e da informação.",
        ],
      },
      {
        titulo: "O que mudou na prática",
        paragrafos: [
          "Algumas mudanças são concretas e fáceis de lembrar. O limite de dinheiro vivo que se pode levar ou trazer numa viagem internacional sem declarar passou a ser de US$ 10 mil, ou o equivalente em outra moeda. Pessoas físicas passaram a poder vender moeda estrangeira em espécie entre si, de forma eventual e não profissional, até US$ 500.",
          "Outras mudanças são estruturais. O Banco Central ganhou espaço para autorizar novos modelos de negócio, como empresas de pagamento internacional e contas em moeda estrangeira, e para regulamentar tudo em resoluções que entraram em vigor junto com a lei, no último dia de 2022. Uma delas é a que trata das declarações de capital brasileiro no exterior.",
          "O que a lei não mudou: o IOF, que continua definido por decreto, e o imposto de renda sobre o que você ganha lá fora, que segue as leis tributárias. O marco cambial facilita a porta, mas não mexe no pedágio.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Dolarizar parte do patrimônio deixou de ser um problema de acesso e passou a ser um problema de método. Hoje, a pergunta já não é se dá para mandar dinheiro, e sim por qual canal, com qual custo total e com que organização de documentos para a declaração.",
          "Isso também cria uma armadilha: facilidade estimula impulso. Abrir uma conta e mandar dinheiro em minutos não substitui a decisão de quanto, em quais ativos e com que horizonte.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Muita gente acha que o marco cambial liberou contas em dólar dentro do Brasil para qualquer pessoa. Não liberou. A lei abriu a possibilidade, mas quem pode ter conta em moeda estrangeira no país continua dependendo de regulamentação do Banco Central, que segue restrita. As contas globais que você abre pelo celular, em geral, ficam numa instituição no exterior.",
          "Outra confusão é achar que simplificar é sinônimo de garantir. Regras de câmbio são escolha de política econômica. O Brasil já teve, em outros tempos, limites rígidos para comprar dólar. A abertura de hoje é uma boa notícia, não uma promessa eterna.",
        ],
      },
    ],
    exemplo:
      "Hipotético: em 2012, um investidor que quisesse US$ 20 mil numa corretora americana precisava de um banco disposto a fechar o câmbio, de formulários e de alguns dias. Em 2026, ele abre a conta pelo aplicativo, informa que a remessa é para investimento em nome próprio, paga 1,1% de IOF e o custo do câmbio, e o dinheiro chega em um ou dois dias úteis. O que continua igual: guardar o contrato de câmbio, declarar a conta e calcular o imposto em reais.",
    naPratica:
      "O marco cambial é a razão pela qual dolarizar ficou acessível ao investidor comum. Use isso a seu favor comparando canais pelo custo total, e não pela propaganda, e montando desde a primeira remessa uma pasta com contratos de câmbio e extratos. E trate a abertura como algo a aproveitar com método, sabendo que regra de câmbio é decisão política e pode mudar.",
    relacionados: ["remessa", "iof", "conta-global", "corretora-internacional", "conta-em-moeda-estrangeira", "declaracao-de-capitais-no-exterior", "cambio-flutuante", "banco-central"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "0:19" }],
  },
  {
    slug: "iof",
    termo: "Imposto sobre Operações Financeiras",
    sigla: "IOF",
    categoria: "Acesso, contas e impostos",
    apelidos: ["IOF câmbio", "IOF sobre câmbio", "IOF de câmbio", "IOF-Câmbio"],
    resumo:
      "Imposto federal sobre crédito, câmbio, seguros e títulos. No câmbio, desde 2025: 1,1% para mandar dinheiro ao exterior para investir em nome próprio e 3,5% em espécie, cartão internacional e conta de disponibilidade.",
    texto: [
      "Você manda R$ 100 mil para uma corretora nos Estados Unidos. Antes de virar dólar, uma parte fica no caminho: R$ 1.100, se a remessa for classificada como investimento em seu nome; R$ 3.500, se for para ter saldo disponível lá fora. Essa diferença tem nome e sobrenome: Imposto sobre Operações Financeiras, o IOF.",
      "O IOF é um imposto federal que incide sobre crédito, câmbio, seguros e operações com títulos. No câmbio, é cobrado pela própria instituição na hora em que você compra ou vende moeda estrangeira, e a alíquota depende da finalidade da operação.",
      "É um imposto diferente dos outros por um detalhe constitucional: o governo pode mudar as alíquotas por decreto, com efeito imediato, sem passar pelo Congresso e sem esperar o ano seguinte. Por isso ele funciona mais como uma alavanca de política econômica do que como uma fonte estável de arrecadação.",
    ],
    secoes: [
      {
        titulo: "Como funciona no câmbio",
        paragrafos: [
          "A regra está no Decreto 6.306, de 2007, que regulamenta o IOF e é alterado sempre que o governo muda as alíquotas. Pela redação dada pelo Decreto 12.499, de 11 de junho de 2025, as principais alíquotas para pessoa física ficaram assim.",
          "Remessa ao exterior de residente no país com finalidade de investimento: 1,1%. Remessa para manter saldo disponível lá fora, sem finalidade de investimento, inclusive para cônjuge ou parente: 3,5%. Compra de dólar em espécie: 3,5%. Gastos com cartão de crédito ou débito no exterior e saques lá fora: 3,5%. Carga de cartão pré-pago e cheques de viagem: 3,5%. As demais remessas para fora não enquadradas em outro item também pagam 3,5%, e as demais entradas de recursos, 0,38%.",
          "Quem informa a finalidade é você, no momento de fechar o câmbio. Quem cobra e recolhe é a instituição. Por isso vale conferir no contrato de câmbio como a operação foi classificada: um enquadramento errado muda a conta.",
        ],
      },
      {
        titulo: "De onde vem a regra atual",
        paragrafos: [
          "Em março de 2022, o Decreto 10.997 desenhou uma redução gradual do IOF sobre câmbio até zerar em 2029, como parte do esforço do Brasil para entrar na OCDE. O cronograma chegou a ser aplicado nos primeiros anos.",
          "Em maio de 2025, com as contas públicas apertadas, o governo mudou de rumo. Dois decretos, de 22 e 23 de maio, subiram alíquotas de câmbio e de crédito, e o segundo recuou em parte depois da reação do mercado. Em 11 de junho, o Decreto 12.499 consolidou a nova tabela. O Congresso aprovou um decreto legislativo para derrubar a alta, o caso foi parar no Supremo e, em julho de 2025, uma decisão do tribunal restabeleceu quase todo o decreto do governo.",
          "A lição é menos sobre os números e mais sobre o mecanismo: uma promessa de zerar um imposto até 2029 durou três anos. Em 2026, a tabela de junho de 2025 continua valendo.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O IOF é custo de entrada, pago uma vez sobre o valor convertido. Numa remessa de investimento, 1,1% equivale a uns três meses de rendimento de um título americano de curto prazo com juros perto de 4% ao ano. Não é motivo para desistir de dolarizar, e sim para evitar idas e vindas.",
          "Ele também pesa na comparação entre caminhos. Um ETF de ações globais comprado na B3 não paga IOF de câmbio, porque você compra em reais. Uma remessa para uma corretora lá fora paga. Em compensação, a conta lá fora põe o ativo em outra jurisdição, coisa que o ETF local não faz. A escolha envolve custo, imposto de renda e risco, não só o IOF.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Mandar dinheiro para uma conta global como disponibilidade, pagando 3,5%, e depois usar o saldo para investir. A finalidade declarada na remessa é o que conta para o IOF, e a diferença de 2,4 pontos percentuais fica pelo caminho.",
          "Esquecer o spread. O IOF é visível; a diferença entre o dólar que você paga e o dólar comercial às vezes é maior que ele. O Valor Efetivo Total, que a instituição é obrigada a mostrar antes da operação, junta as duas coisas.",
          "Achar que a alíquota de hoje está garantida. Ela pode mudar por decreto a qualquer momento. Confira a tabela vigente antes de cada remessa relevante.",
        ],
      },
    ],
    exemplo:
      "Hipotético, com números redondos: você converte R$ 110 mil com o dólar comercial a R$ 5,50. Se a instituição cobra um spread de 1% sobre a cotação, o seu dólar sai a R$ 5,555. Sem IOF, você receberia cerca de US$ 19.800. Com o IOF de investimento de 1,1%, recebe perto de US$ 19.585, uma diferença de uns US$ 215. Se a mesma remessa fosse classificada como disponibilidade, com 3,5%, chegariam perto de US$ 19.130, quase US$ 700 a menos que sem imposto.",
    naPratica:
      "Para quem vai dolarizar em etapas, o IOF é um custo previsível que precisa entrar na conta de cada remessa e no plano como um todo. Informe corretamente a finalidade de investimento quando ela for verdadeira, compare canais pelo custo total e evite idas e vindas desnecessárias. E lembre que o mesmo governo que cobra 1,1% hoje pode cobrar outro número amanhã, inclusive num momento de estresse, o que é parte do argumento para não deixar a diversificação toda para a última hora.",
    relacionados: ["remessa", "conta-global", "marco-cambial", "spread-cambial", "custo-total", "risco-de-expropriacao", "bdr", "etf"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "35:56" }],
  },
  {
    slug: "conta-global",
    termo: "Conta global",
    categoria: "Acesso, contas e impostos",
    apelidos: ["contas globais", "conta internacional", "contas internacionais", "conta em dólar", "contas em dólar"],
    resumo:
      "Conta em dólar ou outra moeda, aberta pelo aplicativo de um banco ou fintech brasileira, mas mantida numa instituição no exterior. Serve para gastar em viagem, guardar saldo em dólar e, em alguns casos, investir.",
    texto: [
      "Você abre o aplicativo do banco, toca num botão e, em alguns minutos, tem uma conta em dólar com cartão de débito. Parece uma conta brasileira com outra moeda, mas, na maioria dos casos, não é. O dinheiro fica numa instituição fora do Brasil, e o aplicativo daqui é só a porta de entrada.",
      "Conta global é o nome comercial desse produto: uma conta em dólar, euro ou outra moeda, aberta pelo celular por meio de um banco, corretora ou fintech brasileira, mas mantida por uma instituição parceira no exterior, quase sempre nos Estados Unidos.",
      "Ela serve para três coisas principais: gastar em viagem com menos custo que o cartão de crédito comum, guardar uma reserva em outra moeda e, em alguns casos, investir em ações, ETFs e títulos americanos sem abrir conta numa corretora separada.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Por trás da tela há quase sempre três peças. A instituição brasileira, que atende você e faz o câmbio. Uma instituição no exterior, que mantém a conta de fato, em seu nome ou numa conta coletiva com registro individual. E, quando há investimentos, uma corretora americana que guarda os ativos.",
          "O câmbio é uma operação regular, fechada por instituição autorizada pelo Banco Central, com IOF. O saldo em dólar fica sob as regras do país onde a conta está. Se é um banco americano, o depósito pode ter a cobertura do FDIC, o seguro federal de depósitos, até US$ 250 mil por depositante, por banco e por tipo de titularidade. Se é uma corretora, os ativos têm a proteção da SIPC, que cobre o sumiço do ativo, e não a queda de preço.",
        ],
      },
      {
        titulo: "O que perguntar antes de abrir",
        paragrafos: [
          "Em que instituição o dinheiro fica, e em que país. O nome no aplicativo é brasileiro, mas o contrato é com quem guarda o saldo.",
          "A conta está em seu nome ou numa conta coletiva? Isso muda a proteção de depósito e o que acontece se a parceira tiver problemas.",
          "Qual é o custo total de entrada e saída, com spread, tarifa e IOF? E como a remessa é classificada: investimento, com 1,1% de IOF, ou disponibilidade, com 3,5%?",
          "O saldo rende? Se rende, o rendimento e a variação cambial sobre ele entram no imposto de renda como aplicação financeira no exterior. Se não rende, a variação do dólar sobre o depósito não é tributada, pela Lei 14.754.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Do ponto de vista do Brasil, a conta global é um bem no exterior. Ela precisa aparecer na ficha de bens e direitos da declaração de imposto de renda e, se o total que você tem fora chegar a US$ 1 milhão ou mais em 31 de dezembro, entra também na declaração de capitais brasileiros no exterior, ao Banco Central.",
          "Do ponto de vista dos Estados Unidos, você é um cliente estrangeiro. A instituição vai pedir o formulário W-8BEN, e as informações da conta chegam à Receita Federal pelos acordos de troca automática entre os dois países.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Tratar a conta global como investimento. Saldo parado em dólar, numa conta sem juros, protege contra a desvalorização do real, mas não rende nada, e a inflação americana corrói o poder de compra dele com o tempo.",
          "Esquecer de declarar porque o valor é pequeno. Os limites que a Receita dispensa de declarar para saldos em conta são baixos, e a informação da conta chega de qualquer jeito pelos acordos internacionais.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você manda US$ 5 mil para uma conta global para usar numa viagem. A remessa é disponibilidade, paga 3,5% de IOF, e sai mais barata que gastar no cartão de crédito comum só se o spread da conta for menor. Meses depois, sobram US$ 2 mil parados, e o dólar subiu de R$ 5 para R$ 5,50. Como a conta não paga juros, os R$ 1.000 de ganho em reais não são tributados. Se ela pagasse 4% ao ano, os juros e a variação cambial entrariam no imposto de 15% da Lei 14.754.",
    naPratica:
      "A conta global é uma porta útil e barata para ter dólar à mão e, em alguns casos, para começar a investir lá fora. Entenda quem guarda o seu dinheiro, que proteção existe e como a remessa é classificada. E não confunda reserva em dólar com investimento em dólar: a primeira protege contra o câmbio; a segunda é a que, ao longo dos anos, pode fazer o patrimônio crescer.",
    relacionados: ["marco-cambial", "iof", "remessa", "corretora-internacional", "custodia", "sipc", "lei-14754", "conta-em-moeda-estrangeira"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "0:19" }],
  },
  {
    slug: "corretora-internacional",
    termo: "Corretora internacional",
    categoria: "Acesso, contas e impostos",
    apelidos: ["corretoras internacionais", "corretora americana", "corretoras americanas", "corretora no exterior", "broker", "broker-dealer"],
    resumo:
      "Corretora de valores fora do Brasil, geralmente nos Estados Unidos, que dá acesso direto a ações, ETFs, títulos e outros ativos do mercado internacional.",
    texto: [
      "Quando você compra um ETF americano pela corretora brasileira de sempre, na maioria das vezes está comprando um BDR, um recibo negociado aqui. Para ter o ETF de verdade, em seu nome, registrado lá fora, você precisa de outra coisa: uma conta numa corretora no exterior.",
      "Corretora internacional é a corretora de valores registrada fora do Brasil, quase sempre nos Estados Unidos, que dá acesso direto a ações, ETFs, títulos do Tesouro americano e outros ativos daquele mercado. Lá, ela precisa estar registrada na SEC, a comissão de valores mobiliários americana, e ser membro da Finra, a entidade que fiscaliza as corretoras.",
      "Algumas são americanas e aceitam clientes estrangeiros. Outras pertencem a grupos brasileiros, que abriram uma corretora registrada nos Estados Unidos e atendem em português. O que importa, nos dois casos, é onde e em nome de quem os seus ativos ficam guardados.",
    ],
    secoes: [
      {
        titulo: "Como funciona, passo a passo",
        paragrafos: [
          "Primeiro, a abertura da conta, com documentos e o formulário W-8BEN, em que você declara ao fisco americano que não é residente fiscal de lá. Sem ele, a corretora pode reter impostos que não se aplicariam a você.",
          "Depois, a remessa: você converte reais em dólares numa instituição autorizada pelo Banco Central, informa a finalidade de investimento e paga o IOF correspondente, hoje de 1,1%. O dinheiro chega na conta em um ou dois dias úteis.",
          "A partir daí, você compra os ativos em dólar. Nos Estados Unidos, a liquidação de ações e ETFs acontece em um dia útil desde maio de 2024. Os ativos ficam registrados em seu nome nos livros da corretora, e ela os guarda por meio da estrutura de custódia americana.",
        ],
      },
      {
        titulo: "Que proteção existe",
        paragrafos: [
          "As corretoras americanas precisam separar os ativos dos clientes do patrimônio próprio. Se uma delas quebra e faltam ativos, entra a SIPC, que cobre até US$ 500 mil por cliente, dos quais até US$ 250 mil em dinheiro, e vale também para estrangeiros. A SIPC não cobre perda de valor: se a ação cai, o problema é do mercado, não da corretora.",
          "Algumas corretoras contratam seguros privados acima do limite da SIPC. Vale ler as condições, porque cada apólice tem regras próprias.",
        ],
      },
      {
        titulo: "As obrigações do lado de cá",
        paragrafos: [
          "A corretora americana não calcula nem recolhe o imposto brasileiro. Os rendimentos e ganhos entram na declaração anual pela Lei 14.754, com 15% sobre o resultado do ano, calculado em reais. Dividendos de empresas americanas já chegam com 30% retidos lá, porque o Brasil não tem tratado de imposto de renda com os Estados Unidos.",
          "Há também a sucessão. Ações e ETFs americanos em nome de um não residente estão sujeitos ao estate tax, o imposto de herança americano, acima de US$ 60 mil. É um ponto que muita gente só descobre tarde.",
        ],
      },
      {
        titulo: "Corretora lá fora, BDR ou ETF local",
        paragrafos: [
          "Comprar BDRs ou ETFs na B3 é mais simples: sem câmbio, sem IOF de remessa, imposto pelas regras brasileiras e sucessão no inventário brasileiro. Mas a custódia e as regras continuam no Brasil.",
          "A corretora internacional põe o ativo de fato em outra jurisdição, com acesso a um universo muito maior de ativos e custos de negociação baixos. Em troca, exige mais trabalho: câmbio, declaração, cálculo do imposto e planejamento sucessório. Muita gente usa os dois caminhos, cada um com uma função.",
        ],
      },
    ],
    exemplo:
      "Hipotético: com o dólar a R$ 5,50, você converte R$ 55 mil. Descontados um spread de 0,5% e o IOF de 1,1%, chegam perto de US$ 9.840. Você compra cotas de um ETF de ações globais. Um ano depois, o ETF pagou US$ 150 de dividendos, com US$ 45 retidos nos Estados Unidos, e você não vendeu nada. Na declaração, os dividendos entram na ficha de aplicações no exterior, e o imposto pago lá pode ser abatido do brasileiro, dentro do limite.",
    naPratica:
      "A corretora internacional é o caminho mais direto para ter patrimônio em outra jurisdição, que é justamente o que dilui o risco de regra brasileira. Antes de abrir conta, confira o registro da corretora no BrokerCheck, da Finra, e se ela é membro da SIPC. Organize os comprovantes desde o começo e, quando o valor crescer, olhe com um profissional a questão sucessória.",
    relacionados: ["w-8ben", "sipc", "custodia", "remessa", "estate-tax", "lei-14754", "imposto-retido-nos-eua", "bdr"],
    noCurso: [{ modulo: 0, aula: 1 }],
  },
  {
    slug: "conta-em-moeda-estrangeira",
    termo: "Conta em moeda estrangeira",
    categoria: "Acesso, contas e impostos",
    apelidos: ["contas em moeda estrangeira", "conta no exterior", "contas no exterior", "depósito no exterior", "depósitos no exterior"],
    resumo:
      "Conta bancária mantida em dólar, euro ou outra moeda. Pessoas físicas residentes no Brasil podem ter contas assim no exterior; dentro do Brasil, elas ainda são restritas a casos previstos pelo Banco Central.",
    texto: [
      "Um empresário brasileiro recebe pagamentos de clientes no exterior e quer deixar parte em dólar. Uma família quer uma reserva em euro porque a filha vai estudar em Portugal. Os dois chegam à mesma pergunta: posso ter uma conta em moeda estrangeira, e onde?",
      "Conta em moeda estrangeira é uma conta bancária mantida em dólar, euro ou outra moeda. Para o residente no Brasil, a resposta curta é esta: no exterior, pode, desde que o dinheiro saia pelos canais oficiais e a conta seja declarada. Dentro do Brasil, ainda é uma exceção, permitida só em casos previstos pelo Banco Central.",
      "A diferença entre as duas situações é a jurisdição: a conta lá fora segue as leis, os tribunais e a proteção de depósito do país onde está; a de dentro, as daqui.",
    ],
    secoes: [
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "No exterior, qualquer residente pode abrir conta num banco estrangeiro, diretamente ou pelos aplicativos de conta global. O dinheiro precisa sair por uma operação de câmbio regular, numa instituição autorizada, e a conta precisa aparecer na declaração de imposto de renda. Se o total de bens e valores no exterior chegar a US$ 1 milhão ou mais em 31 de dezembro, também entra na declaração anual ao Banco Central.",
          "Dentro do Brasil, contas em moeda estrangeira existem para situações específicas, como certas empresas, instituições e prestadores ligados ao comércio exterior e ao turismo. O marco cambial abriu caminho para ampliar esse universo, mas a ampliação depende de regulamentação do Banco Central, que tem sido gradual. Uma conta em dólar aberta pelo aplicativo de um banco brasileiro quase sempre fica, na verdade, numa instituição no exterior.",
        ],
      },
      {
        titulo: "Como o imposto trata",
        paragrafos: [
          "A Lei 14.754, em vigor desde 2024, criou uma regra útil para quem só quer guardar moeda. A variação cambial de depósitos em conta corrente no exterior não é tributada, desde que a conta não pague juros e esteja numa instituição autorizada a funcionar pela autoridade monetária do país em que está.",
          "Se a conta paga juros, ela vira aplicação financeira no exterior. Os juros e a variação cambial sobre o principal passam a ser tributados em 15% na declaração anual, quando forem efetivamente recebidos ou resgatados. A mesma lógica vale para carteiras digitais e contas remuneradas.",
        ],
      },
      {
        titulo: "Que proteção existe",
        paragrafos: [
          "O FGC brasileiro não cobre conta no exterior, nem mesmo depósitos captados lá fora por bancos brasileiros. A proteção é a do país onde o banco está. Nos Estados Unidos, o FDIC cobre até US$ 250 mil por depositante, por banco e por tipo de titularidade. Na União Europeia, os fundos de garantia nacionais cobrem até 100 mil euros por depositante e por banco.",
          "Isso significa que a escolha do banco e do país importa. Uma conta numa instituição sólida, num país com regras estáveis, é uma forma simples de diversificar jurisdição. Uma conta num lugar escolhido só pela taxa ou pela facilidade pode trazer riscos que você não vê.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você mantém US$ 20 mil numa conta sem juros num banco americano. O dólar sobe de R$ 5 para R$ 5,50 e você usa o dinheiro numa viagem. O ganho de R$ 10 mil em reais não paga imposto. Se a mesma conta pagasse 4% ao ano, os US$ 800 de juros e a variação cambial sobre o principal resgatado entrariam na ficha de aplicações no exterior, com 15%.",
    naPratica:
      "Uma conta no exterior é o jeito mais simples de ter uma reserva em outra moeda e em outra jurisdição. Para quem quer só proteção cambial e liquidez, a conta sem juros tem um tratamento tributário simples. Para quem quer rendimento, vale comparar com títulos ou fundos de curto prazo, sabendo que aí o rendimento e o câmbio passam a ser tributados. Em qualquer caso: canal oficial, comprovantes guardados e declaração em dia.",
    relacionados: ["conta-global", "lei-14754", "declaracao-de-capitais-no-exterior", "fgc", "jurisdicao", "marco-cambial", "variacao-cambial-no-imposto"],
  },
  {
    slug: "remessa",
    termo: "Remessa internacional",
    categoria: "Acesso, contas e impostos",
    apelidos: ["remessa", "remessas", "remessas internacionais", "transferência internacional", "envio de dinheiro ao exterior", "eFX"],
    resumo:
      "O envio de dinheiro do Brasil para o exterior, ou o contrário, por meio de uma operação de câmbio. O custo total junta cotação, tarifa e IOF, e a instituição é obrigada a mostrá-lo antes, no chamado VET.",
    texto: [
      "Duas instituições anunciam o dólar: uma a R$ 5,50, outra a R$ 5,52. A primeira parece mais barata. Mas ela cobra R$ 80 de tarifa, e a segunda não cobra nada. Numa remessa de US$ 1.000, a conta vira. É por isso que comparar remessa pela cotação anunciada é um erro comum.",
      "Remessa internacional é o envio de dinheiro do Brasil para o exterior, ou o contrário, por meio de uma operação de câmbio. Você entrega reais, uma instituição autorizada pelo Banco Central converte em moeda estrangeira e envia para a conta de destino, sua ou de outra pessoa.",
      "Pode ser feita por banco, corretora de câmbio, fintech ou empresa de pagamento internacional. O que todas têm em comum é a obrigação de seguir as regras do Banco Central e de mostrar, antes de você fechar, quanto a operação custa de verdade.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Toda remessa tem um contrato de câmbio por trás. Nele aparecem a moeda, a cotação, o valor em reais, a finalidade declarada e os dados de quem envia e de quem recebe. A finalidade não é burocracia: é ela que define a alíquota de IOF e que, mais tarde, ajuda a explicar a origem do dinheiro.",
          "O custo tem três partes. A cotação usada, que costuma ficar acima do dólar comercial, e a diferença é o spread. As tarifas, fixas ou percentuais, às vezes cobradas também pelo banco que recebe lá fora. E o IOF: 1,1% para remessa de residente com finalidade de investimento; 3,5% para manter disponibilidade no exterior, inclusive para parentes, e para as demais remessas.",
        ],
      },
      {
        titulo: "O número que resume tudo",
        paragrafos: [
          "Para comparar, existe o Valor Efetivo Total, o VET. É uma regra do Banco Central: a instituição precisa informar, antes de fechar a operação, quantos reais você vai pagar no total por unidade de moeda estrangeira entregue, já com spread, tarifas e impostos dentro.",
          "O VET tira da frente o truque do câmbio bonito com tarifa escondida. Se duas instituições mostram VET de R$ 5,62 e R$ 5,58 por dólar, a segunda é mais barata, ponto. Diferenças de meio por cento parecem pequenas, mas se repetem em cada remessa ao longo dos anos.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Quem dolariza aos poucos faz muitas remessas. Somadas, as diferenças de custo entre canais viram dinheiro de verdade. Escolher o canal antes de começar, e não a cada vez, evita decisões apressadas num dia de dólar nervoso.",
          "A remessa também é o primeiro documento da sua vida fiscal lá fora. O contrato de câmbio mostra quanto você converteu, em que data e por qual valor em reais. Esse é o custo de aquisição que a Receita usa para calcular o ganho, anos depois.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Usar canais informais, como o dólar comprado de um conhecido que tem conta lá fora, para economizar no IOF. Além de ilegal, isso deixa o dinheiro sem origem comprovada e sem custo registrado.",
          "Declarar finalidade errada para pagar menos imposto. A finalidade de investimento vale para aplicar em seu nome; usar a remessa para outra coisa é irregular.",
          "Não guardar comprovantes. Sem eles, provar a origem e o custo do dinheiro fica difícil, e a conta do imposto pode sair maior do que deveria.",
        ],
      },
    ],
    exemplo:
      "Hipotético, numa remessa de US$ 10 mil para investimento: a instituição A anuncia R$ 5,50 e cobra R$ 150 de tarifa; a B anuncia R$ 5,53 sem tarifa. Com o IOF de 1,1% sobre o valor convertido, a A sai por cerca de R$ 55.755 e a B por cerca de R$ 55.908. Mudando para US$ 2 mil, a tarifa fixa pesa mais, a A sai por cerca de R$ 11.271 e a B por cerca de R$ 11.182. O VET mostra isso sem conta nenhuma.",
    naPratica:
      "Antes de começar a dolarizar, escolha o canal pelo VET, confira como a finalidade será registrada e crie uma pasta com cada contrato de câmbio. Se o plano é converter em várias janelas ao longo de meses, a diferença entre um canal caro e um barato pode ser maior do que qualquer tentativa de acertar o melhor dia do dólar.",
    relacionados: ["iof", "marco-cambial", "conta-global", "corretora-internacional", "spread-cambial", "cambio", "dolar-comercial", "custo-medio"],
  },
  {
    slug: "lei-14754",
    termo: "Lei 14.754/2023",
    categoria: "Acesso, contas e impostos",
    apelidos: ["Lei 14.754", "lei das offshores", "tributação de aplicações no exterior", "tributação de investimentos no exterior", "lei das offshores e trusts"],
    resumo:
      "A lei que, desde janeiro de 2024, tributa em 15%, na declaração anual, os rendimentos de pessoas físicas com aplicações financeiras, offshores e trusts no exterior. O cálculo é em reais, com a variação do câmbio dentro.",
    texto: [
      "Imagine dois investidores. Um tem US$ 200 mil num ETF comprado direto numa corretora americana. O outro tem os mesmos US$ 200 mil, mas dentro de uma empresa nas Ilhas Virgens Britânicas que compra o mesmo ETF. Até 2023, o segundo podia adiar o imposto brasileiro quase para sempre. Desde 2024, os dois pagam os mesmos 15%, e o adiamento acabou.",
      "A Lei 14.754, de 12 de dezembro de 2023, em vigor desde 1º de janeiro de 2024, mudou a forma como o Brasil tributa o dinheiro que pessoas físicas residentes aplicam no exterior. Rendimentos de aplicações financeiras lá fora, lucros de empresas controladas no exterior e bens em trusts passaram a ter regra própria, numa ficha separada da declaração anual, com alíquota de 15%.",
      "É a lei mais importante para quem pensa em investir diretamente fora do país. Ela diz como o imposto é calculado, quando é devido e o que pode ser abatido.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A lei chama de aplicação financeira no exterior quase tudo o que um investidor pessoa física tem lá fora: depósitos remunerados, ações, ETFs, fundos, títulos de renda fixa, derivativos e também ativos virtuais e carteiras digitais, nos termos que a Receita regulamenta. Os rendimentos incluem juros, dividendos, ganhos na venda e a variação do câmbio sobre o que foi aplicado.",
          "Esses rendimentos entram na declaração anual de ajuste, numa ficha própria, e pagam 15% sem nenhuma dedução. O imposto é devido quando o rendimento é efetivamente recebido: no pagamento de juros ou dividendos, e, no caso de ganhos, no resgate, na venda, no vencimento ou na liquidação. Enquanto você não vende, a valorização não é tributada.",
          "Perdas realizadas e comprovadas compensam ganhos do mesmo ano. O que sobrar pode abater lucros de empresas controladas no exterior e, depois, ganhos dos anos seguintes. Cada perda só pode ser usada uma vez. E o imposto pago no país de origem pode ser abatido do brasileiro quando houver tratado ou reciprocidade, até o limite do imposto brasileiro sobre aquele rendimento, sem direito de levar a sobra para outro ano.",
        ],
      },
      {
        titulo: "Offshores e trusts",
        paragrafos: [
          "A segunda parte da lei mira as empresas no exterior controladas por pessoas físicas. Se a empresa está num país de tributação favorecida, ou se menos de 60% da renda dela vem de atividade própria, como acontece com quem só recebe juros e dividendos, o lucro é tributado em 15% no Brasil todo 31 de dezembro, distribuído ou não. As demais controladas são tributadas quando o lucro chega à pessoa física.",
          "Os trusts passaram a ser tratados como transparentes: os bens continuam sendo do instituidor para o imposto, até que sejam distribuídos ao beneficiário ou que o instituidor morra, o que vier primeiro. Nesse momento, a lei trata a passagem como doação ou herança.",
        ],
      },
      {
        titulo: "As isenções que vale conhecer",
        paragrafos: [
          "Duas regras ajudam quem só quer guardar moeda. A variação cambial de depósitos em conta corrente no exterior não é tributada, desde que a conta não pague juros e esteja numa instituição autorizada pela autoridade monetária do país. E a variação cambial na venda de moeda estrangeira em espécie é isenta até o equivalente a US$ 5 mil por ano; acima disso, tudo passa a ser tributado.",
          "Bens no exterior que não são aplicações financeiras, como um imóvel em Lisboa ou um carro em Miami, ficam fora dessa lei e seguem a regra tradicional de ganho de capital.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "A lei trouxe duas consequências práticas. O imposto é calculado em reais, então a alta do dólar entra na conta mesmo quando o ativo ficou parado em dólar. O imposto não é retido na fonte pela corretora estrangeira: você calcula e paga na declaração.",
          "Para quem tem renda alta, há um detalhe novo desde 2026: a Lei 15.270, de 2025, criou uma tributação mínima para quem recebe mais de R$ 600 mil por ano somando todas as rendas, e os rendimentos da Lei 14.754 entram nessa soma. O imposto já pago por essa lei é abatido do cálculo do mínimo. Como as duas regras conversam no seu caso é assunto para um contador.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você compra US$ 10 mil de um ETF com o dólar a R$ 5,00, um custo de R$ 50 mil, e vende dois anos depois por US$ 12 mil com o dólar a R$ 5,50, recebendo R$ 66 mil. O ganho tributável é de R$ 16 mil: R$ 11 mil vêm do ETF e R$ 5 mil, do câmbio. O imposto é de R$ 2.400, pago na declaração do ano seguinte. Se no mesmo ano você tivesse vendido outro ativo com R$ 6 mil de perda, a base cairia para R$ 10 mil e o imposto para R$ 1.500.",
    naPratica:
      "A Lei 14.754 tornou o imposto sobre investimentos no exterior previsível e, para a maioria das pessoas, simples: 15% sobre o que você efetivamente realizou no ano, em reais. O trabalho está na organização: guardar contratos de câmbio, notas de compra e venda e extratos, para provar custo, perdas e imposto pago lá fora. A regra geral é essa; os casos com offshore, trust, renda alta ou cripto fora de corretora pedem um contador que conheça o assunto.",
    relacionados: ["imposto-de-renda", "variacao-cambial-no-imposto", "compensacao-de-perdas", "offshore", "trust", "ganho-de-capital", "dupla-tributacao", "conta-em-moeda-estrangeira"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "35:56" }],
  },
  {
    slug: "imposto-de-renda",
    termo: "Imposto de renda sobre investimentos no exterior",
    categoria: "Acesso, contas e impostos",
    apelidos: ["imposto de renda", "IRPF", "imposto sobre a renda", "declaração de imposto de renda", "declaração anual", "Declaração de Ajuste Anual", "bens e direitos"],
    resumo:
      "Quem mora no Brasil paga imposto de renda sobre o que ganha no mundo inteiro. Investimentos no exterior entram na declaração anual, com regra própria, e precisam aparecer também na ficha de bens e direitos.",
    texto: [
      "Você mora em São Paulo e tem um CDB, umas ações na B3, um ETF numa corretora americana e uma conta em euro em Portugal. Para a Receita Federal, tudo isso é seu, e tudo o que render entra na sua declaração. O que muda de um para outro é a regra aplicada.",
      "O Brasil tributa os residentes pela renda mundial. Não importa se o ganho veio de um título em reais ou de uma ação em Nova York: quem é residente fiscal aqui declara e paga imposto aqui sobre o que ganha em qualquer lugar. Investimentos no exterior entram na declaração anual com regra própria e precisam aparecer também na ficha de bens e direitos.",
      "O que costuma assustar é a variedade. Há pelo menos três regimes diferentes para quem investe com exposição ao exterior, e entender qual vale para cada ativo é metade do trabalho.",
    ],
    secoes: [
      {
        titulo: "Os três regimes",
        paragrafos: [
          "Aplicações financeiras no exterior, como ações, ETFs, títulos, fundos e depósitos remunerados mantidos lá fora, seguem a Lei 14.754: 15% sobre o resultado do ano, numa ficha separada da declaração anual, com compensação de perdas e abatimento do imposto pago fora, dentro de limites.",
          "Bens no exterior que não são aplicações financeiras, como um imóvel, seguem a regra de ganho de capital: o imposto é apurado na venda, com alíquotas que começam em 15% e sobem por faixas até 22,5% conforme o tamanho do ganho, e é pago até o último dia útil do mês seguinte.",
          "Investimentos feitos no Brasil, mesmo com exposição ao exterior, seguem as regras brasileiras. BDRs e ETFs da B3 que replicam índices americanos são renda variável aqui, com apuração mensal e pagamento até o fim do mês seguinte ao da venda com lucro. Fundos brasileiros que investem lá fora seguem as regras dos fundos daqui.",
        ],
      },
      {
        titulo: "O que mudou em 2026",
        paragrafos: [
          "A Lei 15.270, de 26 de novembro de 2025, mexeu no imposto de renda das pessoas físicas a partir de 2026. Para a maioria, a mudança foi uma redução: quem ganha até R$ 5 mil por mês deixou de pagar imposto sobre o salário, com redução decrescente até R$ 7.350.",
          "Para quem tem renda alta, vieram duas novidades. Dividendos acima de R$ 50 mil por mês pagos por uma mesma empresa brasileira a uma mesma pessoa passaram a ter retenção de 10% na fonte. E quem recebe mais de R$ 600 mil por ano, somando praticamente todas as rendas, inclusive as isentas e as tributadas pela Lei 14.754, passou a ter uma tributação mínima, que chega a 10% para rendas a partir de R$ 1,2 milhão. Do mínimo se abate o que já foi pago, inclusive o imposto dos investimentos no exterior.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Escolher o veículo também é escolher o regime de imposto. O ganho numa ação americana comprada lá fora só é tributado quando você vende, e o imposto vem na declaração anual. Um BDR da mesma empresa pode gerar imposto mensal a cada venda com lucro. Um ETF brasileiro que compra ETFs americanos tem a sua própria camada de imposto dentro do fundo, como o imposto retido sobre dividendos lá fora.",
          "Imposto não deve decidir sozinho, porque ele vem junto com outras diferenças: jurisdição, custódia, sucessão, liquidez e custo. Mas ele precisa entrar na comparação, sempre em reais e depois de todos os impostos.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Achar que, se a corretora é estrangeira, a Receita não fica sabendo. Bancos e corretoras de fora informam saldos e rendimentos de clientes brasileiros por acordos de troca automática de informações.",
          "Esquecer a ficha de bens e direitos. Mesmo sem venda e sem rendimento no ano, o que você tem lá fora precisa ser declarado, com o custo em reais.",
          "Misturar perdas de lá com ganhos de cá. Perdas em aplicações no exterior compensam ganhos no exterior; perdas em ações na B3 compensam ganhos na B3. Os dois mundos não se misturam.",
        ],
      },
    ],
    exemplo:
      "Hipotético: no mesmo ano, você vendeu com lucro cotas de um ETF americano comprado direto lá fora e cotas de um ETF da B3 que replica o S&P 500. O primeiro entra na ficha de aplicações no exterior e paga 15% na declaração do ano seguinte. O segundo foi apurado no mês da venda e pago por guia até o fim do mês seguinte, também a 15%, mas sem a isenção de R$ 20 mil, que vale só para ações. Mesma exposição, mesma alíquota, calendários e formulários diferentes.",
    naPratica:
      "Antes de escolher entre conta lá fora, ETF local ou BDR, desenhe como cada um será tributado, em que momento e quanto trabalho de cálculo ele dá. Organize os documentos desde o início, declare tudo o que tiver fora e, quando a carteira ganhar tamanho ou complexidade, leve o desenho a um contador. Aqui a regra geral está explicada; cada caso tem os seus detalhes.",
    relacionados: ["lei-14754", "ganho-de-capital", "variacao-cambial-no-imposto", "dupla-tributacao", "bdr", "residencia-fiscal", "troca-automatica-de-informacoes", "compensacao-de-perdas"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "35:56" }, { modulo: 0, aula: 4, tempo: "12:50" }],
  },
  {
    slug: "ganho-de-capital",
    termo: "Ganho de capital",
    categoria: "Acesso, contas e impostos",
    apelidos: ["ganhos de capital", "lucro na venda", "imposto sobre ganho de capital", "GCAP"],
    resumo:
      "A diferença entre o preço de venda e o custo de compra de um bem ou investimento. É sobre ela que, em geral, incide o imposto quando você vende com lucro.",
    texto: [
      "Comprou por 100 e vendeu por 130? O ganho de capital é 30. Parece simples, e na essência é: o imposto incide sobre a diferença entre o preço de venda e o custo de compra, e não sobre o valor total que você recebeu.",
      "O que complica é o resto. Em que moeda se mede o custo? Que despesas entram nele? Quando o imposto é devido? E qual alíquota vale para cada tipo de bem? As respostas mudam conforme o que foi vendido e onde ele estava.",
      "Para quem investe lá fora, há um ingrediente a mais: o câmbio. O custo e a venda são convertidos em reais pelas cotações de cada data, e a variação do dólar entra no ganho.",
    ],
    secoes: [
      {
        titulo: "Como funciona no Brasil",
        paragrafos: [
          "O ganho de capital tradicional vale para bens e direitos em geral: imóveis, participações em empresas fora de bolsa, carros, obras de arte. A alíquota é progressiva por faixa de ganho: 15% sobre a parte do ganho até R$ 5 milhões, 17,5% entre R$ 5 milhões e R$ 10 milhões, 20% entre R$ 10 milhões e R$ 30 milhões e 22,5% acima disso. O imposto é apurado em cada venda e pago até o último dia útil do mês seguinte.",
          "Ações negociadas na B3 têm regra própria de renda variável: 15% sobre o lucro nas operações comuns, com apuração mensal, e isenção quando o total vendido em ações no mês fica em até R$ 20 mil. A isenção não vale para ETFs, BDRs nem fundos imobiliários.",
          "Aplicações financeiras no exterior, desde 2024, saíram do ganho de capital tradicional e seguem a Lei 14.754, com 15% na declaração anual. O ganho de capital tradicional ficou para os bens no exterior que não são aplicações financeiras.",
        ],
      },
      {
        titulo: "Como entra o câmbio",
        paragrafos: [
          "Para quem mora no Brasil e comprou um bem lá fora com reais, a conta é feita em reais. O custo é convertido pela cotação do dia da compra; o preço de venda, pela cotação do dia da venda. A diferença é o ganho tributável, e parte dela pode ser só o dólar que subiu.",
          "Há regras específicas para bens comprados com dinheiro ganho em moeda estrangeira, por exemplo quando a pessoa ainda morava fora. Nesses casos, o ganho pode ser calculado de outra forma. É um dos pontos em que a ajuda de um contador evita erro.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Ganho de capital não é renda do ano. Se você vende um imóvel e reinveste tudo em outro, o imposto continua devido, salvo nas isenções específicas previstas para imóveis no Brasil.",
          "Valorização sem venda não é ganho realizado. Uma ação que subiu 50% e continua na carteira não gera imposto até ser vendida. Isso dá ao investidor algum controle sobre o momento de pagar.",
          "Custo de aquisição não é só o preço. Corretagem, impostos de transmissão e, no caso de imóveis, benfeitorias comprovadas entram no custo e reduzem o ganho.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um apartamento em Miami comprado por US$ 300 mil, com o dólar a R$ 4, custou R$ 1,2 milhão. Vendido anos depois pelos mesmos US$ 300 mil, com o dólar a R$ 5,50, rende R$ 1,65 milhão. Em dólar, o ganho foi zero. Em reais, foram R$ 450 mil, sobre os quais incide o imposto de ganho de capital, observadas as reduções e as regras de conversão previstas na lei, que dependem de como e com que dinheiro o imóvel foi comprado.",
    naPratica:
      "Guarde, para cada compra lá fora, a data, o valor em dólar, o contrato de câmbio e as despesas. É isso que permite calcular o ganho certo anos depois, inclusive a parte que veio do câmbio. Ao comparar investimentos em dólar com investimentos em reais, faça a conta depois do imposto: parte do que parece ganho em reais pode ser só a moeda, e ela também é tributada.",
    relacionados: ["lei-14754", "imposto-de-renda", "variacao-cambial-no-imposto", "compensacao-de-perdas", "bdr", "custo-medio"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "38:15" }],
  },
  {
    slug: "compensacao-de-perdas",
    termo: "Compensação de perdas",
    categoria: "Acesso, contas e impostos",
    apelidos: ["compensar perdas", "prejuízo acumulado", "abater prejuízo", "compensação de prejuízos"],
    resumo:
      "O direito de abater, do ganho tributável, as perdas que você teve em outros investimentos. Nas aplicações no exterior, a Lei 14.754 permite compensar no mesmo ano e levar o que sobrar para os anos seguintes.",
    texto: [
      "No mesmo ano, você ganhou R$ 20 mil numa ação americana e perdeu R$ 8 mil em outra. Pagar imposto sobre os R$ 20 mil, sem olhar a perda, seria tributar um dinheiro que você não ganhou. A compensação de perdas existe para isso: o imposto incide sobre os R$ 12 mil líquidos.",
      "Compensar perdas é o direito de abater, do ganho tributável, as perdas que você realizou em outros investimentos da mesma natureza. Cada regime de imposto tem a sua regra, e é aí que mora o detalhe.",
      "Para aplicações financeiras no exterior, a regra está na Lei 14.754 e é relativamente generosa: compensa no mesmo ano, e o que sobrar pode ser levado para os anos seguintes.",
    ],
    secoes: [
      {
        titulo: "Como funciona no exterior",
        paragrafos: [
          "Pela Lei 14.754, as perdas realizadas em aplicações financeiras no exterior, desde que comprovadas por documentação idônea, compensam os rendimentos de aplicações no exterior do mesmo ano, na ficha própria da declaração anual.",
          "Se as perdas forem maiores que os ganhos, o excesso pode abater lucros e dividendos de empresas controladas no exterior computados no mesmo ano. E, se ainda sobrar, as perdas acumuladas podem ser usadas contra rendimentos dessa ficha nos anos seguintes. Cada perda só pode ser usada uma vez.",
          "Perda realizada é perda em venda, resgate ou liquidação. Uma ação que caiu 30% e continua na carteira não gera perda compensável.",
        ],
      },
      {
        titulo: "No Brasil é outra conta",
        paragrafos: [
          "Na renda variável brasileira, prejuízos em ações, ETFs, BDRs e outros ativos negociados em bolsa compensam lucros futuros em operações da mesma modalidade, mês a mês, sem prazo para usar. Operações comuns e day trade são contas separadas.",
          "As duas contas, a do exterior e a da B3, não se misturam. Uma perda num BDR não abate o ganho num ETF comprado lá fora, e vice-versa, embora os dois ativos possam ser da mesma empresa ou do mesmo índice.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "A compensação muda a conta do imposto em anos de mercado ruim, que são justamente os anos em que você mais precisa que ela funcione. Quem rebalanceia a carteira vendendo o que caiu para comprar o que ficou para trás pode, ao mesmo tempo, gerar perdas que reduzem o imposto de ganhos realizados.",
          "Ela também cria uma tentação: vender só para gerar perda fiscal. O imposto é uma das variáveis, não a decisão inteira. Vender o que você queria manter só para economizar 15% de uma perda raramente compensa o custo de sair e voltar ao ativo, com câmbio e IOF no meio.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Não guardar a nota de corretagem ou o extrato que comprova a perda. Sem documento, a perda não vale perante a Receita.",
          "Esquecer de informar as perdas na declaração do ano em que aconteceram. Sem esse registro, fica difícil usar o saldo nos anos seguintes.",
        ],
      },
    ],
    exemplo:
      "Hipotético: em 2026, você realiza R$ 15 mil de perdas e R$ 5 mil de ganhos no exterior. Não paga imposto sobre aplicações no exterior naquele ano e carrega R$ 10 mil de perdas. Em 2027, realiza R$ 18 mil de ganhos. Abate os R$ 10 mil acumulados e paga 15% sobre R$ 8 mil, ou seja, R$ 1.200, em vez de R$ 2.700.",
    naPratica:
      "Para quem tem carteira no exterior, manter um controle anual de ganhos e perdas realizados, em reais, é tão importante quanto acompanhar a rentabilidade. Faça o fechamento do ano antes de dezembro acabar, quando ainda dá para decidir com calma se alguma venda faz sentido, e guarde os comprovantes. Quando houver perdas grandes, controladas ou ativos de natureza diferente, confirme a conta com um contador.",
    relacionados: ["lei-14754", "ganho-de-capital", "imposto-de-renda", "variacao-cambial-no-imposto", "rebalanceamento", "aversao-a-perda"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "35:56" }],
  },
  {
    slug: "variacao-cambial-no-imposto",
    termo: "Variação cambial no imposto",
    categoria: "Acesso, contas e impostos",
    apelidos: ["imposto sobre a variação cambial", "imposto sobre o câmbio"],
    resumo:
      "Para quem mora no Brasil, o ganho com investimentos no exterior é calculado em reais. Se o dólar sobe, você pode pagar imposto mesmo sem ter ganhado nada em dólar.",
    texto: [
      "Você comprou US$ 10 mil em ações quando o dólar valia R$ 5,00. Um ano depois, vendeu pelos mesmos US$ 10 mil. Em dólar, não ganhou nada. Mas o dólar foi a R$ 5,50, e você recebeu R$ 55 mil por algo que custou R$ 50 mil. Para a Receita, há R$ 5 mil de ganho, e R$ 750 de imposto.",
      "Variação cambial no imposto é isso: para quem mora no Brasil, o ganho com investimentos no exterior é medido em reais. O custo é convertido pelo câmbio do dia da compra; a venda, pelo câmbio do dia da venda. A diferença é o ganho tributável, com o efeito do dólar dentro.",
      "É uma das regras que mais surpreendem quem começa a investir lá fora, e uma das mais importantes para comparar retornos de forma honesta.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A Lei 14.754 diz com todas as letras que a variação cambial da moeda estrangeira em relação ao real é rendimento de aplicação financeira no exterior. Ela é tributada junto com o ganho do ativo, em 15%, quando o rendimento é efetivamente realizado: na venda, no resgate, no vencimento ou no recebimento de juros e dividendos.",
          "O efeito vale para os dois lados. Se o dólar sobe, aparece um ganho em reais mesmo que o ativo tenha ficado parado. Se o dólar cai, aparece uma perda em reais que pode compensar outros ganhos no exterior, mesmo que o ativo tenha subido um pouco em dólar.",
          "A variação conta sobre o principal aplicado. Se você manda dólares para fora, compra um ETF e vende, a conta compara os reais que custaram aqueles dólares com os reais que eles valem na venda.",
        ],
      },
      {
        titulo: "As exceções",
        paragrafos: [
          "A mesma lei criou duas isenções. A variação cambial de depósitos em conta corrente no exterior não é tributada, desde que a conta não pague juros e esteja num banco autorizado pela autoridade monetária do país. E a variação cambial na venda de moeda estrangeira em espécie é isenta até o equivalente a US$ 5 mil vendidos no ano.",
          "Na prática, quem só guarda dólar parado numa conta sem juros não paga imposto pela alta do dólar. Quem coloca esse dólar para render passa a ter a variação cambial tributada, junto com o rendimento.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Ela muda a comparação com o CDI. Se um título americano rendeu 4% em dólar e o dólar subiu 8% no ano, o seu ganho em reais foi de cerca de 12%, e o imposto incide sobre os 12%, não sobre os 4%. A conta justa é sempre em reais e depois do imposto.",
          "Ela também mostra um lado bom da diversificação: em anos em que o real se valoriza, as perdas em reais nos ativos lá fora podem abater ganhos realizados no mesmo ano. O imposto acompanha o que aconteceu com o seu patrimônio medido na moeda em que você vive.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Achar que o imposto é sobre o ganho em dólar. Não é, para residentes no Brasil que investiram com reais. A conta é em reais.",
          "Achar que o imposto é cobrado todo ano sobre a valorização. Não é: enquanto você não vende nem recebe rendimento, a variação do dólar sobre o ativo não é tributada.",
        ],
      },
    ],
    exemplo:
      "Hipotético, com o mesmo investimento de US$ 10 mil comprado com o dólar a R$ 5,00. Cenário 1: um ano depois, você vende pelos mesmos US$ 10 mil com o dólar a R$ 5,50. Recebe R$ 55 mil, tem R$ 5 mil de ganho e paga R$ 750. Cenário 2: o dólar caiu para R$ 4,50. Recebe R$ 45 mil, tem R$ 5 mil de perda, não paga nada e pode usar a perda para abater outros ganhos no exterior. Cenário 3: o ativo subiu para US$ 11 mil e o dólar caiu para R$ 4,50. Recebe R$ 49.500, tem R$ 500 de perda em reais, embora tenha ganho 10% em dólar.",
    naPratica:
      "Quem dolariza parte do patrimônio quer justamente que o dólar trabalhe a favor quando o real se desvaloriza. O imposto sobre a variação cambial é o preço dessa proteção quando ela se realiza. Na hora de planejar vendas e comparar alternativas, faça a conta em reais e depois do imposto, e lembre que saldo parado em conta sem juros tem um tratamento diferente do dinheiro aplicado.",
    relacionados: ["lei-14754", "ganho-de-capital", "compensacao-de-perdas", "risco-cambial", "imposto-de-renda", "retorno-em-reais", "conta-em-moeda-estrangeira"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "38:15" }],
  },
  {
    slug: "declaracao-de-capitais-no-exterior",
    termo: "Declaração de Capitais Brasileiros no Exterior",
    sigla: "CBE",
    categoria: "Acesso, contas e impostos",
    apelidos: ["DCBE", "declaração ao Banco Central", "capitais brasileiros no exterior", "declaração de bens no exterior"],
    resumo:
      "Declaração anual ao Banco Central, obrigatória para residentes no Brasil com US$ 1 milhão ou mais em bens e valores no exterior em 31 de dezembro. É separada da declaração de imposto de renda.",
    texto: [
      "Em 31 de dezembro, você tem US$ 700 mil numa corretora americana e um apartamento de US$ 400 mil em Portugal. Além da declaração de imposto de renda, há outra obrigação no calendário, com outro destinatário: o Banco Central.",
      "A Declaração de Capitais Brasileiros no Exterior, a CBE, é o levantamento anual que o Banco Central faz do que os residentes no Brasil têm fora do país. É obrigatória para quem tinha, na data-base de 31 de dezembro, o equivalente a US$ 1 milhão ou mais em bens, direitos e valores no exterior.",
      "Não é imposto e não gera cobrança. É informação estatística, usada para montar as contas externas do país, a posição de investimento internacional. Mas é obrigatória, e quem deixa de entregar está sujeito às penalidades previstas na regulamentação.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A regra está na Resolução BCB 279, de 31 de dezembro de 2022, que regulamenta o marco cambial na parte de capitais brasileiros no exterior. A declaração anual é exigida quando o total no exterior, em 31 de dezembro, chega a US$ 1 milhão ou mais. Quem tem US$ 100 milhões ou mais entrega também declarações trimestrais.",
          "O prazo da declaração anual vai de 15 de fevereiro a 5 de abril do ano seguinte à data-base. Para a data-base de 31 de dezembro de 2025, foi de 15 de fevereiro a 5 de abril de 2026. A entrega é eletrônica, no sistema do Banco Central.",
          "O responsável é o próprio residente que detém o capital. A documentação que sustenta a declaração precisa ser guardada por dez anos.",
        ],
      },
      {
        titulo: "O que entra e o que não entra",
        paragrafos: [
          "Entram participações em empresas no exterior, cotas de fundos lá fora, títulos de dívida de emissores estrangeiros, depósitos em bancos no exterior, empréstimos a não residentes, imóveis fora do país, derivativos negociados lá fora e ativos virtuais. Desde fevereiro de 2026, a regra deixa explícito que operações de capital brasileiro no exterior em ativos virtuais seguem a mesma resolução.",
          "Também entra o patrimônio transferido a um agente fiduciário no exterior para administração em favor de beneficiários residentes, como num trust. Nesse caso, quem declara é o beneficiário residente.",
          "Ficam fora da conta do limite os BDRs e as cotas de fundos brasileiros que investem no exterior, porque quem informa esses casos são as próprias instituições. Em conta conjunta, cada titular considera o valor integral para saber se está obrigado, mas declara só a sua parte.",
        ],
      },
      {
        titulo: "CBE e imposto de renda não são a mesma coisa",
        paragrafos: [
          "A declaração de imposto de renda vai para a Receita Federal, todo ano, para qualquer valor relevante no exterior, e mede tudo em reais pelo custo de aquisição. A CBE vai para o Banco Central, só acima de US$ 1 milhão, e trabalha com valores em moeda estrangeira na data-base, pelos critérios do manual do declarante.",
          "Uma não substitui a outra. Quem tem US$ 1,2 milhão lá fora entrega as duas, com números que não precisam bater entre si, porque medem coisas diferentes.",
        ],
      },
    ],
    exemplo:
      "Hipotético: em 31 de dezembro de 2026, você tem US$ 700 mil numa corretora americana, um imóvel avaliado em US$ 400 mil em Portugal e R$ 300 mil em BDRs na B3. Os BDRs não contam para o limite. A soma do resto é US$ 1,1 milhão, e a CBE é obrigatória entre 15 de fevereiro e 5 de abril de 2027, além da declaração de imposto de renda. Se o imóvel fosse de US$ 250 mil, o total ficaria abaixo de US$ 1 milhão e a CBE não seria exigida.",
    naPratica:
      "Investir lá fora é legal e cada vez mais simples, mas vem com deveres de transparência que crescem junto com o patrimônio. Mantenha uma planilha anual com o valor de cada bem no exterior em 31 de dezembro, em dólar e em reais, e o custo de aquisição. Ela serve às duas declarações e evita a correria de março. Perto do limite de US$ 1 milhão, lembre que uma alta do dólar ou da bolsa pode colocar você na obrigação sem que você tenha mandado um centavo a mais.",
    relacionados: ["imposto-de-renda", "marco-cambial", "conta-em-moeda-estrangeira", "troca-automatica-de-informacoes", "banco-central", "trust", "balanca-de-pagamentos"],
  },
  {
    slug: "offshore",
    termo: "Offshore",
    categoria: "Acesso, contas e impostos",
    apelidos: ["offshores", "empresa no exterior", "empresas no exterior", "controlada no exterior", "controladas no exterior", "PIC", "holding no exterior"],
    resumo:
      "Empresa constituída fora do país de residência do dono, muitas vezes usada para guardar investimentos. Desde 2024, a Lei 14.754 tributa no Brasil, todo ano, o lucro das offshores de investimento controladas por pessoas físicas.",
    texto: [
      "Durante décadas, a receita de quem tinha patrimônio alto era quase sempre a mesma: abrir uma empresa num país de imposto baixo, mandar o dinheiro para ela e investir por meio dela. Enquanto o lucro ficasse lá dentro, o imposto brasileiro esperava. Às vezes, esperava para sempre.",
      "Offshore é o nome popular de uma empresa constituída fora do país de residência do dono, muitas vezes numa jurisdição de tributação baixa, como as Ilhas Virgens Britânicas, as Bahamas ou as Ilhas Cayman. Pode ser usada para investir, para organizar a sucessão, para reunir bens de uma família ou para atividades empresariais reais.",
      "Ter uma offshore é legal, desde que ela seja declarada. O que mudou em 2024, com a Lei 14.754, foi a vantagem de adiar o imposto: para as offshores de investimento, ela acabou.",
    ],
    secoes: [
      {
        titulo: "Como funcionava antes",
        paragrafos: [
          "Até 2023, a pessoa física só pagava imposto sobre o lucro da empresa no exterior quando ele era distribuído a ela. Uma offshore que comprava ações, títulos e fundos podia reinvestir juros, dividendos e ganhos por anos, com o imposto brasileiro diferido. Para patrimônios grandes, o efeito dos juros compostos sobre o imposto adiado era relevante.",
          "Esse diferimento era o principal motivo de muitas estruturas. O custo de abrir e manter a empresa, com taxas de registro, agente local, contabilidade e às vezes auditoria, compensava para quem tinha alguns milhões de dólares.",
        ],
      },
      {
        titulo: "Como funciona desde 2024",
        paragrafos: [
          "A Lei 14.754 criou o conceito de entidade controlada no exterior por pessoa física. Em geral, é controlada a empresa em que você tem mais de 50% do capital ou dos lucros, sozinho ou com pessoas ligadas, ou em que tem poder de decidir.",
          "Se a controlada está num país com tributação favorecida ou num regime fiscal privilegiado, ou se menos de 60% da renda dela vem de atividade própria, como acontece com quem vive de juros, dividendos e ganhos financeiros, o lucro é tributado em 15% no Brasil todo 31 de dezembro, como se tivesse sido distribuído. As demais controladas, em geral empresas operacionais de verdade, continuam tributadas quando o lucro chega à pessoa física.",
          "A lei também permitiu uma alternativa: declarar os bens da controlada como se fossem detidos diretamente pela pessoa física, a chamada opção pela transparência. A escolha é feita empresa por empresa e não pode ser desfeita enquanto você detiver aquela empresa.",
        ],
      },
      {
        titulo: "Para que uma offshore ainda serve",
        paragrafos: [
          "Sem o diferimento, sobram motivos que não são fiscais, ou que são fiscais de outra natureza. Uma empresa no exterior pode organizar a sucessão, permitindo que os herdeiros recebam cotas da empresa em vez de ativos espalhados por várias contas. Pode reduzir a exposição ao estate tax americano, já que, em certas estruturas, o que passa aos herdeiros são cotas de uma empresa estrangeira e não ações americanas. Pode centralizar a gestão de bens de uma família em vários países.",
          "Cada um desses benefícios tem custo, risco e condições. Uma estrutura mal desenhada pode ser desconsiderada pelo fisco, americano ou brasileiro, e virar só despesa.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Usar offshore para esconder. Com a troca automática de informações entre países, contas e empresas no exterior chegam ao conhecimento da Receita. Esconder, além de crime, passou a ser inútil.",
          "Abrir estrutura por moda. Para quem tem algumas centenas de milhares de dólares lá fora, os custos fixos de uma offshore costumam superar qualquer benefício. Avalie pelo resultado depois de custos e impostos, com profissionais, e não pela promessa.",
        ],
      },
    ],
    exemplo:
      "Hipotético: sua offshore nas Ilhas Virgens Britânicas teve lucro equivalente a R$ 200 mil num ano, só com juros e dividendos de uma carteira de ETFs, e não distribuiu nada. Até 2023, o imposto brasileiro esperaria a distribuição, talvez por décadas. Desde 2024, o lucro é considerado seu em 31 de dezembro, e você paga R$ 30 mil na declaração do ano seguinte. É o mesmo que pagaria se a carteira estivesse em seu nome numa corretora americana e você tivesse recebido esses juros e dividendos.",
    naPratica:
      "Para a grande maioria de quem começa a dolarizar, a conta em nome próprio numa corretora no exterior resolve, com menos custo e menos burocracia. A offshore entra na conversa quando o patrimônio lá fora fica grande o bastante para que sucessão, estate tax e organização familiar justifiquem custos fixos anuais. Nesse ponto, a decisão é de planejamento patrimonial, com advogado e contador, e não de investimento.",
    relacionados: ["lei-14754", "trust", "estate-tax", "jurisdicao", "imposto-de-renda", "troca-automatica-de-informacoes", "declaracao-de-capitais-no-exterior"],
  },
  {
    slug: "trust",
    termo: "Trust",
    categoria: "Acesso, contas e impostos",
    apelidos: ["trusts", "instituidor", "trustee", "settlor"],
    resumo:
      "Estrutura comum em países de direito anglo-saxão em que alguém entrega bens a um administrador, o trustee, para que sejam geridos em favor de beneficiários. Desde 2024, a lei brasileira trata o trust como transparente para o imposto.",
    texto: [
      "Imagine que você quer deixar recursos para os filhos, mas com regras: uma parte aos 25 anos, outra aos 35, e alguém de confiança cuidando do dinheiro até lá, com instruções claras do que pode e do que não pode. No Brasil, isso exigiria uma combinação de testamento, holding e cláusulas. Nos Estados Unidos e no Reino Unido, existe um instrumento feito para isso: o trust.",
      "Trust é uma figura do direito de origem anglo-saxã em que uma pessoa, o instituidor, transfere bens a um administrador, o trustee, que passa a geri-los em favor de beneficiários, seguindo as regras de uma escritura e, muitas vezes, de uma carta de desejos.",
      "O direito brasileiro não tem trust. Mas residentes no Brasil podem instituir trusts no exterior ou ser beneficiários de um, e desde 2024 a lei brasileira diz como isso é tratado para o imposto.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Três papéis. O instituidor, em inglês settlor, é quem coloca os bens no trust. O trustee é a pessoa ou empresa com dever fiduciário de administrar esses bens. Os beneficiários são quem recebe, nas condições previstas.",
          "Há trusts revogáveis, em que o instituidor pode desfazer a estrutura e retomar os bens, e irrevogáveis, em que ele abre mão disso. Há trusts com regras rígidas de distribuição e outros em que o trustee tem margem para decidir. Cada país tem as suas leis, e a escolha da jurisdição faz parte do desenho.",
        ],
      },
      {
        titulo: "Como o Brasil trata",
        paragrafos: [
          "A Lei 14.754 tratou o trust como transparente para o imposto. Depois da instituição, os bens continuam sendo do instituidor para a Receita, e os rendimentos entram na declaração dele. Os bens passam ao beneficiário quando houver distribuição ou quando o instituidor morrer, o que vier primeiro. Se o instituidor abrir mão, de forma irrevogável, de parte do patrimônio, aquela parte também passa ao beneficiário.",
          "Essa passagem é tratada como doação, se acontece em vida, ou como herança, se decorre da morte. Isso leva à discussão do imposto estadual sobre transmissão, o ITCMD, que segue as regras de cada estado e da Constituição.",
          "Há também deveres de informação. O instituidor ou os beneficiários precisam pedir ao trustee as informações necessárias para cumprir as obrigações no Brasil, e o patrimônio do trust em favor de residentes entra também na declaração de capitais brasileiros no exterior, ao Banco Central, quando passa do limite.",
        ],
      },
      {
        titulo: "Para que serve, e para que não serve",
        paragrafos: [
          "Trust é ferramenta de planejamento sucessório e de proteção patrimonial: organiza a transmissão, evita disputas, protege herdeiros jovens ou vulneráveis e pode evitar processos de inventário em vários países ao mesmo tempo.",
          "Não é investimento nem esconderijo. Os bens dentro do trust continuam sendo investidos em ações, títulos ou imóveis, com os mesmos riscos. E, com a regra de transparência e a troca automática de informações, ele não reduz o imposto de renda brasileiro do instituidor.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você institui um trust revogável em Nova York com US$ 2 milhões em ETFs e títulos, nomeando os dois filhos como beneficiários. Enquanto você estiver vivo e nada for distribuído, os rendimentos e ganhos continuam sendo seus para a Receita e entram na sua declaração pela Lei 14.754. Se, aos 25 anos, um dos filhos recebe US$ 200 mil do trust, essa distribuição é tratada como doação sua a ele, com as consequências do imposto estadual.",
    naPratica:
      "Para quem está começando a dolarizar, trust é assunto de horizonte longo. Ele começa a fazer sentido quando o patrimônio no exterior ganha tamanho e a pergunta deixa de ser onde investir e passa a ser como transmitir. Nesse ponto, a conversa é com advogado e contador que conheçam as leis dos dois países, olhando ao mesmo tempo imposto de renda, ITCMD e o estate tax americano.",
    relacionados: ["lei-14754", "offshore", "estate-tax", "jurisdicao", "declaracao-de-capitais-no-exterior", "horizonte-de-investimento"],
  },
  {
    slug: "estate-tax",
    termo: "Estate tax",
    categoria: "Acesso, contas e impostos",
    apelidos: ["imposto sobre herança americano", "imposto de herança americano", "imposto sobre heranças nos EUA", "Form 706-NA"],
    resumo:
      "O imposto americano sobre heranças. Para quem não é cidadão nem residente dos Estados Unidos, incide sobre ativos situados lá, como ações e imóveis americanos, acima de US$ 60 mil, com alíquotas que chegam a 40%.",
    texto: [
      "Um investidor brasileiro morre com US$ 500 mil em ações americanas numa corretora em Nova York. Os herdeiros fazem o inventário no Brasil e descobrem que, antes de receber os ativos, precisam declarar a herança ao fisco americano. E pagar uma conta que pode passar de US$ 100 mil.",
      "Estate tax é o imposto americano sobre a transmissão de patrimônio por morte. Para cidadãos e residentes dos Estados Unidos, incide acima de uma isenção alta, de milhões de dólares. Para estrangeiros não residentes, a régua é outra: o imposto alcança os bens situados nos Estados Unidos, e a declaração é obrigatória quando eles passam de US$ 60 mil.",
      "É o tema mais ignorado por quem começa a investir lá fora, porque não aparece em nenhum extrato. Só aparece quando já é tarde para planejar.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Pela regra do IRS, o executor do espólio de um não residente que não é cidadão americano precisa entregar uma declaração de imposto sobre herança, o formulário 706-NA, se o valor de mercado dos bens situados nos Estados Unidos na data da morte passar de US$ 60 mil.",
          "Acima desse valor, aplica-se a tabela progressiva do imposto, cuja alíquota máxima é de 40%. Para não residentes, a isenção efetiva é pequena, o equivalente aos US$ 60 mil, e não os milhões que valem para americanos.",
          "O IRS pode cobrar o imposto não pago de quem recebeu os bens. Na prática, as corretoras costumam bloquear a transferência dos ativos aos herdeiros até que a situação fiscal americana seja resolvida.",
        ],
      },
      {
        titulo: "O que conta como bem americano",
        paragrafos: [
          "Entram imóveis nos Estados Unidos, bens físicos lá localizados e ações de empresas constituídas sob a lei americana, mesmo que os certificados estejam fora do país ou em nome de um intermediário. Em geral, cotas de fundos e ETFs domiciliados nos Estados Unidos também são tratadas como bens americanos.",
          "Ficam fora certos depósitos bancários e certos títulos de dívida previstos na lei americana, além de seguros de vida de não residentes. Ações de empresas estrangeiras, mesmo negociadas em Nova York, e ETFs domiciliados fora dos Estados Unidos, como os ETFs irlandeses do padrão europeu, também ficam fora.",
        ],
      },
      {
        titulo: "Por que o Brasil sai em desvantagem",
        paragrafos: [
          "Países com tratado de herança com os Estados Unidos têm regras melhores para os seus residentes, com isenções maiores ou definição mais estreita do que é bem americano. O Brasil não tem esse tratado.",
          "Do lado brasileiro, a herança ainda pode estar sujeita ao imposto estadual sobre transmissão, o ITCMD, cujas regras para bens no exterior passaram por mudanças nos últimos anos. Sem planejamento, os herdeiros podem enfrentar dois processos, dois impostos e meses de espera.",
        ],
      },
      {
        titulo: "Como se costuma lidar com isso",
        paragrafos: [
          "As soluções mais comuns mexem na forma de deter os ativos: usar ETFs domiciliados fora dos Estados Unidos para a exposição a ações americanas, manter parte da reserva em instrumentos que não são considerados bens americanos, ou deter os investimentos por meio de uma estrutura no exterior, como uma empresa ou um trust, desenhada para isso.",
          "Cada caminho tem custos, efeitos no imposto de renda e riscos de ser desconsiderado se for mal feito. É o tipo de decisão que se toma com advogado e contador, olhando o patrimônio inteiro.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um investidor brasileiro morre com US$ 500 mil em ações e ETFs americanos numa corretora nos Estados Unidos. Os herdeiros precisam entregar o 706-NA. Aplicada a tabela e descontado o crédito que corresponde aos US$ 60 mil isentos, o imposto fica perto de US$ 140 mil. Se a mesma exposição estivesse em ETFs domiciliados na Irlanda, esse imposto não existiria, embora a herança continuasse sujeita às regras brasileiras.",
    naPratica:
      "Não é motivo para deixar de investir lá fora. É motivo para planejar cedo, enquanto as escolhas são baratas. Quando o valor em ativos americanos começar a crescer, compare o domicílio dos ETFs que você usa, entenda o que é e o que não é bem americano e converse com um profissional sobre a estrutura, olhando ao mesmo tempo imposto de renda e sucessão.",
    relacionados: ["corretora-internacional", "trust", "offshore", "etf-ucits", "custodia", "jurisdicao", "treasury"],
  },
  {
    slug: "w-8ben",
    termo: "W-8BEN",
    categoria: "Acesso, contas e impostos",
    apelidos: ["formulário W-8BEN", "W8BEN", "W-8"],
    resumo:
      "Formulário do fisco americano em que o investidor declara à corretora que não é residente fiscal dos Estados Unidos. Define como os seus rendimentos serão tributados lá.",
    texto: [
      "Na abertura da conta numa corretora americana, entre um documento e outro, aparece um formulário com um nome estranho: W-8BEN. Muita gente assina sem ler. Ele é curto, mas decide como o fisco americano vai tratar os seus investimentos.",
      "O W-8BEN é o formulário em que um investidor pessoa física declara à instituição financeira americana que não é cidadão nem residente fiscal dos Estados Unidos. É o documento que separa você, para o IRS, do contribuinte americano comum.",
      "Com ele, a corretora aplica as regras de não residente. Sem ele, pode tratar você como alguém que deveria ter um número de contribuinte americano e aplicar retenções que não se aplicariam.",
    ],
    secoes: [
      {
        titulo: "O que você informa",
        paragrafos: [
          "Nome, país de cidadania, endereço de residência permanente fora dos Estados Unidos, data de nascimento e o número de contribuinte do país de residência, no caso do Brasil, o CPF. Você declara, sob as penas da lei, que é o beneficiário efetivo dos rendimentos e que não é pessoa americana para fins fiscais.",
          "Há uma parte do formulário para pedir benefícios de tratado de imposto. Como o Brasil não tem tratado de imposto de renda com os Estados Unidos, essa parte, em regra, fica em branco para o residente no Brasil.",
        ],
      },
      {
        titulo: "O que muda com ele",
        paragrafos: [
          "Dividendos de empresas americanas sofrem retenção de 30% na fonte, a alíquota padrão para não residentes sem tratado. Juros de títulos do Tesouro americano, de boa parte dos títulos corporativos e de depósitos bancários costumam ficar livres de retenção para não residentes. E o ganho na venda de ações, em geral, não é tributado nos Estados Unidos, ficando para o país de residência.",
          "Sem o formulário válido, a corretora pode aplicar a chamada retenção de segurança, o backup withholding, hoje de 24%, que vale para quem não comprovou a situação fiscal e pode incidir sobre o valor bruto das vendas, e não só sobre o lucro, o que atrapalha a conta e o caixa.",
        ],
      },
      {
        titulo: "Validade e atualização",
        paragrafos: [
          "Em regra, o W-8BEN vale até o último dia do terceiro ano civil seguinte ao da assinatura. A maioria das corretoras avisa quando é hora de renovar, e a renovação costuma ser feita pelo próprio site.",
          "Mudanças de circunstância, como trocar de endereço para outro país, obter residência americana ou passar a morar lá por muito tempo, exigem um formulário novo. Se você se tornar residente fiscal americano, o W-8BEN deixa de servir e o tratamento passa a ser outro, muito diferente.",
        ],
      },
    ],
    exemplo:
      "Hipotético: assinado em março de 2026, o formulário vale até 31 de dezembro de 2029. Em 2027, você recebe US$ 1.000 em dividendos de uma empresa americana: a corretora retém US$ 300 e credita US$ 700. Na mesma conta, você vende com lucro de US$ 5 mil uma ação americana: nada é retido nos Estados Unidos, e o ganho entra na sua declaração no Brasil, em reais, pela Lei 14.754.",
    naPratica:
      "É um detalhe burocrático que evita imposto indevido e problemas de caixa. Confira se o formulário foi aceito pela corretora, anote a data de validade e mantenha o endereço atualizado. Se um dia você pensar em morar nos Estados Unidos, esse é um dos primeiros papéis que muda, junto com todo o resto da vida fiscal.",
    relacionados: ["corretora-internacional", "imposto-retido-nos-eua", "dupla-tributacao", "residencia-fiscal", "lei-14754", "treasury"],
  },
  {
    slug: "imposto-retido-nos-eua",
    termo: "Imposto retido nos EUA",
    categoria: "Acesso, contas e impostos",
    apelidos: ["imposto retido nos Estados Unidos", "imposto retido na fonte nos EUA", "retenção na fonte", "withholding tax", "dividendos americanos", "imposto sobre dividendos americanos"],
    resumo:
      "Os 30% que o governo americano retém dos dividendos pagos a investidores residentes no Brasil. Como não há tratado entre os dois países para o imposto de renda, a alíquota é a cheia.",
    texto: [
      "Uma empresa americana anuncia dividendos de US$ 1 por ação. Você tem mil ações e espera US$ 1.000. Chegam US$ 700. Os outros US$ 300 ficaram com o governo americano antes de o dinheiro tocar a sua conta.",
      "Imposto retido nos Estados Unidos é a parcela que a corretora desconta na fonte, por regra do IRS, dos rendimentos de fonte americana pagos a investidores estrangeiros. Para dividendos, a alíquota padrão é de 30% e só cai para residentes de países com tratado de imposto de renda com os Estados Unidos.",
      "O Brasil não tem esse tratado. Por isso, o investidor residente aqui paga a alíquota cheia sobre dividendos americanos.",
    ],
    secoes: [
      {
        titulo: "O que é retido e o que não é",
        paragrafos: [
          "Dividendos de ações de empresas americanas e de ETFs domiciliados nos Estados Unidos: 30%. Distribuições de fundos imobiliários americanos, os REITs, em geral também.",
          "Juros de títulos do Tesouro americano, de boa parte dos títulos de empresas e de depósitos bancários costumam ficar isentos de retenção para não residentes, por uma exceção da lei americana para juros de carteira. O ganho de capital na venda de ações, em regra, não é tributado lá.",
          "O resultado é uma assimetria: para o residente no Brasil, a renda de juros americanos chega inteira, e a de dividendos chega com um corte de 30%.",
        ],
      },
      {
        titulo: "Como o Brasil trata",
        paragrafos: [
          "Os dividendos recebidos entram na ficha de aplicações no exterior da declaração anual, pelo valor bruto convertido em reais, e pagam 15% pela Lei 14.754. A lei permite abater o imposto pago lá fora quando há tratado ou reciprocidade, e a Receita reconhece reciprocidade com os Estados Unidos.",
          "O abatimento, porém, é limitado ao imposto brasileiro sobre aquele rendimento. Como o imposto americano, de 30%, é o dobro do brasileiro, de 15%, você não paga nada a mais aqui, mas também não recupera a diferença. O imposto pago lá fora não abatido no ano não pode ser usado em outros anos.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Para quem busca renda com dividendos americanos, o rendimento efetivo é de cerca de 70% do anunciado. Uma ação com dividend yield de 4% entrega, na prática, 2,8%. Isso muda a comparação com títulos de renda fixa, cujos juros chegam sem retenção.",
          "Também explica por que o veículo importa. ETFs domiciliados em países com tratado com os Estados Unidos, como a Irlanda, sofrem uma retenção menor sobre os dividendos americanos dentro do fundo, em geral de 15%, e muitos deles acumulam os dividendos em vez de distribuí-los. Cada estrutura tem os seus custos e os seus efeitos no imposto brasileiro e na sucessão, e a comparação precisa olhar tudo junto. O tema é aprofundado no Módulo III.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você recebe US$ 1.000 de dividendos de uma empresa americana. A corretora retém US$ 300 e credita US$ 700. No Brasil, o imposto sobre esse rendimento seria de 15%, ou US$ 150 convertidos em reais. Você abate integralmente com o que já pagou lá, não paga mais nada aqui e não recupera os outros US$ 150. Se, em vez de dividendos, fossem US$ 1.000 de juros de um título do Tesouro americano, chegariam os US$ 1.000 inteiros, e você pagaria os 15% no Brasil.",
    naPratica:
      "Antes de montar uma carteira de renda em dólar, compare o rendimento depois de todos os impostos, dos dois lados. Dividendos americanos têm um custo fiscal alto para o residente no Brasil; juros de títulos do Tesouro, bem menor. A escolha entre ações que pagam dividendos, títulos e ETFs de diferentes domicílios muda bastante o resultado líquido, e é aí que a ajuda de um profissional costuma se pagar.",
    relacionados: ["dupla-tributacao", "w-8ben", "lei-14754", "imposto-de-renda", "treasury", "dividend-yield", "etf-ucits", "reit"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "12:50" }],
  },
  {
    slug: "dupla-tributacao",
    termo: "Dupla tributação",
    categoria: "Acesso, contas e impostos",
    apelidos: ["bitributação", "tratado para evitar a dupla tributação", "tratados de dupla tributação", "acordo de bitributação", "reciprocidade"],
    resumo:
      "Quando a mesma renda é tributada por dois países. Tratados internacionais e regras de reciprocidade permitem abater, num país, o imposto pago no outro, dentro de limites.",
    texto: [
      "Você mora no Brasil e recebe um rendimento gerado na França. A França quer tributar porque a renda nasceu lá. O Brasil quer tributar porque você mora aqui. Sem nenhuma regra, você pagaria duas vezes sobre o mesmo dinheiro.",
      "Dupla tributação é isso: a mesma renda sendo tributada por dois países. Ela acontece porque os países usam critérios diferentes para cobrar imposto, o lugar onde a renda é gerada e o lugar onde mora quem a recebe, e os dois critérios se sobrepõem.",
      "Para evitar que isso trave o comércio e o investimento, os países criaram dois instrumentos: os tratados para evitar a dupla tributação e as regras de reciprocidade.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Um tratado divide o direito de tributar. Para cada tipo de renda, como dividendos, juros, salários ou ganhos de capital, ele diz qual país pode cobrar, com que alíquota máxima e como o outro país deve aliviar a cobrança, geralmente permitindo abater o imposto já pago.",
          "O Brasil tem tratados com dezenas de países, entre eles vários da Europa, da Ásia e da América Latina. Não tem com os Estados Unidos. Nesse caso, vale a reciprocidade: a lei brasileira permite abater o imposto pago lá fora quando o outro país dá tratamento equivalente aos rendimentos de origem brasileira, e a Receita reconhece essa reciprocidade com os Estados Unidos.",
        ],
      },
      {
        titulo: "O limite do abatimento",
        paragrafos: [
          "Para aplicações financeiras no exterior, a Lei 14.754 diz que o imposto pago lá fora pode ser deduzido do imposto brasileiro, mas só até o valor do imposto brasileiro sobre aquele mesmo rendimento. Se o imposto estrangeiro foi maior, a diferença não volta.",
          "Também não vale abater imposto estrangeiro que pode ser reembolsado ou compensado lá fora, e o que não foi abatido num ano não pode ser usado em outro. O imposto pago no exterior é convertido em reais pela cotação de compra do Banco Central do dia em que foi pago.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O país de origem do rendimento e a existência de tratado mudam o retorno líquido. Dividendos de empresas americanas sofrem 30% de retenção, e o residente no Brasil só consegue abater 15%. Juros de títulos americanos, em geral sem retenção, pagam só o imposto brasileiro.",
          "Por isso, a escolha do tipo de ativo e do domicílio do fundo tem efeito fiscal. Um ETF domiciliado num país com tratado com os Estados Unidos pode sofrer uma retenção menor sobre os dividendos dentro do fundo. Essa vantagem precisa ser pesada contra custos, liquidez e outras regras.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Achar que tratado elimina imposto. Ele evita pagar duas vezes; não elimina o imposto.",
          "Achar que pagar lá fora dispensa declarar aqui. O rendimento entra na declaração brasileira de qualquer jeito, e o imposto pago fora aparece como dedução, dentro do limite.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um rendimento de R$ 10 mil foi tributado em R$ 1 mil no país de origem. No Brasil, a alíquota é de 15%, ou R$ 1,5 mil. Você abate os R$ 1 mil e paga só R$ 500 aqui. Se o imposto lá fora tivesse sido de R$ 3 mil, você abateria R$ 1,5 mil, não pagaria nada no Brasil e perderia os outros R$ 1,5 mil.",
    naPratica:
      "Quando se comparam caminhos para investir lá fora, a conta precisa considerar os impostos dos dois lados e o limite do abatimento. Guarde os comprovantes do imposto retido no exterior, que a corretora informa nos extratos anuais, porque sem eles não há dedução. E, em casos com vários países, rendimentos de natureza diferente ou mudança de residência, a análise fica técnica o bastante para pedir um contador.",
    relacionados: ["imposto-retido-nos-eua", "lei-14754", "residencia-fiscal", "imposto-de-renda", "w-8ben", "etf-ucits"],
  },
  {
    slug: "custodia",
    termo: "Custódia",
    categoria: "Acesso, contas e impostos",
    apelidos: ["custodiante", "custodiantes", "custodiado", "custodiados", "segregação patrimonial"],
    resumo:
      "A guarda dos seus investimentos por uma instituição autorizada. Saber quem custodia, em que país e com que proteção é tão importante quanto saber o que você comprou.",
    texto: [
      "Quando você compra uma ação, ela não vai para uma gaveta. Vira um registro, em nome de alguém, numa instituição que tem a obrigação de guardá-lo. Saber quem é esse alguém, em que país está e que regras segue é tão importante quanto saber o que você comprou.",
      "Custódia é a guarda dos seus ativos por uma instituição autorizada. Ela registra quem é dono de quê, recebe dividendos e juros em nome do cliente, processa eventos como desdobramentos e garante que o ativo vendido saia da sua conta e o comprado entre.",
      "Em tempos calmos, ninguém pensa nisso. Em crises, a custódia é a diferença entre o ativo estar onde você acha que está e virar um crédito numa falência.",
    ],
    secoes: [
      {
        titulo: "Como funciona no Brasil e lá fora",
        paragrafos: [
          "No Brasil, ações, ETFs, BDRs e fundos imobiliários negociados na B3 ficam registrados na central depositária da própria bolsa, em nome do seu CPF. A corretora é a intermediária, mas o registro de que o ativo é seu está na B3, e você pode conferir pela área do investidor.",
          "Nos Estados Unidos, a estrutura é diferente. A maior parte das ações fica numa grande central depositária, e a corretora registra nos seus livros quais delas pertencem a cada cliente. É o chamado registro em nome da corretora, por conta dos clientes. As regras americanas obrigam a corretora a manter os ativos dos clientes separados dos próprios e a fazer reconciliações frequentes.",
        ],
      },
      {
        titulo: "Segregação, a palavra-chave",
        paragrafos: [
          "O que protege o investidor é a segregação: os ativos dos clientes não podem se misturar com o patrimônio da instituição. Se a corretora quebra, esses ativos não entram na massa falida e são transferidos para outra instituição.",
          "Quando a segregação falha, por fraude ou erro, entram os mecanismos de proteção de cada país. Nos Estados Unidos, a SIPC cobre o que faltar até US$ 500 mil por cliente. No Brasil, a B3 mantém um mecanismo de ressarcimento para certos prejuízos causados por intermediários. Nenhum deles cobre queda de preço.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em novembro de 2022, a FTX, uma das maiores corretoras de criptoativos do mundo, pediu falência. Os clientes descobriram que os criptoativos que achavam ter não estavam separados: haviam sido usados pela empresa e por uma firma ligada a ela. Saldos que apareciam na tela viraram créditos num processo de recuperação que levou anos.",
          "Oito anos antes, a japonesa Mt. Gox, que chegou a processar a maior parte das negociações de bitcoin do mundo, também quebrou depois de perder os ativos dos clientes. As duas histórias têm a mesma lição: com criptoativos, quem tem as chaves tem o ativo. Numa exchange, as chaves são dela. Na autocustódia, são suas, com todo o benefício e todo o risco.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Diversificar jurisdição só funciona se a custódia estiver de fato na jurisdição escolhida. Um BDR tem como lastro uma ação lá fora, mas o que você tem é um recibo custodiado na B3, sob regras brasileiras. Uma ação comprada numa corretora americana fica custodiada lá, sob regras americanas. Um fundo brasileiro que investe no exterior tem cotas aqui e ativos lá.",
          "Nenhuma dessas formas é certa ou errada. Cada uma resolve um problema diferente, e misturá-las pode ser exatamente o que você quer. O erro é não saber qual delas você escolheu.",
        ],
      },
    ],
    exemplo:
      "Hipotético: três investidores têm exposição às mesmas ações americanas. O primeiro, por BDRs na B3: custódia no Brasil, ativo de lastro lá fora. O segundo, por um ETF brasileiro que compra ETFs americanos: cotas no Brasil, ativos do fundo lá fora. O terceiro, por uma conta numa corretora americana: custódia nos Estados Unidos. Se amanhã uma regra brasileira restringisse saídas de capital, só o terceiro estaria com o patrimônio fora do alcance direto dela.",
    naPratica:
      "Pergunte sempre onde e em nome de quem o ativo está. Para dolarizar parte do patrimônio, isso define se você está diversificando só a moeda ou também a jurisdição. Na escolha de uma instituição, confira se ela é regulada, se segrega os ativos dos clientes e que mecanismo de proteção existe se algo der errado. Com criptoativos, a pergunta é ainda mais direta: quem tem as chaves?",
    relacionados: ["sipc", "fgc", "autocustodia", "corretora-internacional", "jurisdicao", "exchange", "bdr", "chave-privada"],
  },
  {
    slug: "sipc",
    termo: "Securities Investor Protection Corporation",
    sigla: "SIPC",
    categoria: "Acesso, contas e impostos",
    apelidos: ["proteção SIPC", "seguro SIPC"],
    resumo:
      "O fundo americano que protege clientes de corretoras que quebram e não devolvem os ativos. Cobre até US$ 500 mil por cliente, dos quais até US$ 250 mil em dinheiro. Não cobre queda de preço.",
    texto: [
      "Sua corretora americana quebra. O que acontece com as ações que estavam lá? Na imensa maioria dos casos, nada de dramático: elas estavam separadas do patrimônio da corretora e são transferidas para outra instituição. Mas, se faltar alguma coisa, por fraude ou erro contábil, entra em cena a SIPC.",
      "A Securities Investor Protection Corporation é uma entidade sem fins lucrativos criada pelo Congresso americano em 1970 para devolver aos clientes o dinheiro e os títulos que faltarem quando uma corretora associada quebra. A proteção é de até US$ 500 mil por cliente, dos quais até US$ 250 mil em dinheiro.",
      "O detalhe que mais importa: a SIPC protege a guarda do ativo, não o valor dele. Se a ação que você comprou cai 50%, isso é risco de mercado, e ninguém devolve.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Quando uma corretora associada à SIPC entra em liquidação e faltam ativos nas contas dos clientes, um administrador é nomeado para devolver o que existe. O primeiro passo costuma ser transferir as contas inteiras para outra corretora. O que faltar é reposto pela SIPC até o limite, com recursos de um fundo mantido por contribuições das próprias corretoras.",
          "A proteção vale para ações, títulos, títulos do Tesouro, certificados de depósito, fundos mútuos e fundos de mercado monetário, e para o dinheiro mantido na conta para comprar ou vender esses ativos. Não há exigência de que o cliente seja americano ou more nos Estados Unidos: um estrangeiro com conta numa corretora associada tem a mesma proteção.",
        ],
      },
      {
        titulo: "O que não está coberto",
        paragrafos: [
          "Queda de preço, ativos sem valor vendidos a você, maus conselhos de investimento. Também ficam fora contratos futuros de commodities, operações de câmbio e contratos de investimento não registrados na SEC.",
          "Criptoativos merecem atenção. A SIPC protege valores mobiliários, e criptoativos que não são valores mobiliários registrados na SEC, inclusive stablecoins, não são cobertos, mesmo que estejam guardados numa corretora associada. Um ETF de bitcoin registrado, por outro lado, é um valor mobiliário como qualquer ETF.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "A comparação natural é com o FGC brasileiro, mas eles são diferentes. O FGC garante créditos contra bancos, como CDBs e poupança, até R$ 250 mil. A SIPC garante a devolução de ativos custodiados em corretoras. Nos Estados Unidos, o equivalente ao FGC para depósitos bancários é o FDIC, com cobertura de até US$ 250 mil por depositante, por banco e por tipo de titularidade.",
          "Muitas contas de investimento americanas usam as duas coisas: o dinheiro parado é varrido para depósitos em bancos com seguro do FDIC, e os ativos ficam sob a proteção da SIPC. Vale ler como a sua corretora faz isso.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Na quebra do Lehman Brothers, em setembro de 2008, a corretora do grupo entrou em liquidação sob a lei que criou a SIPC, na maior liquidação de corretora da história americana. Cerca de 110 mil contas de clientes, com US$ 92 bilhões, foram transferidas para outras corretoras em uns dez dias, com os ativos dentro. A segregação fez o trabalho: ao fim do processo, os clientes tinham recebido o que era deles sem que fosse preciso usar dinheiro da SIPC.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você tem US$ 300 mil em ações e US$ 50 mil em dinheiro numa corretora associada que quebra, e parte dos ativos não aparece. A SIPC devolve o que faltar até US$ 500 mil no total, respeitando o limite de US$ 250 mil para o dinheiro. Se a sua carteira fosse de US$ 800 mil e faltasse tudo, a parte acima do limite dependeria do que o administrador conseguisse recuperar e de eventuais seguros privados da corretora.",
    naPratica:
      "Ao escolher uma corretora americana, confira se ela é membro da SIPC, na lista do próprio site da entidade, e registrada na Finra. Alguns nomes grandes oferecem seguros privados acima do limite, que vale ler com atenção. E lembre que essa proteção é contra o sumiço do ativo, não contra a oscilação do mercado, que continua sendo o risco principal de qualquer carteira.",
    relacionados: ["custodia", "fgc", "corretora-internacional", "conta-global", "crise-de-2008", "etf-de-bitcoin"],
  },
  {
    slug: "fgc",
    termo: "Fundo Garantidor de Créditos",
    sigla: "FGC",
    categoria: "Acesso, contas e impostos",
    apelidos: ["garantia do FGC", "cobertura do FGC"],
    resumo:
      "O fundo privado brasileiro que devolve até R$ 250 mil por CPF e por instituição a quem tem depósitos e certos investimentos num banco que quebra, com teto de R$ 1 milhão a cada quatro anos.",
    texto: [
      "Você tem R$ 400 mil em CDBs de um único banco médio, que paga um pouco mais que os grandes. Um dia, o Banco Central decreta a liquidação dele. Quanto volta? Até R$ 250 mil, pelo Fundo Garantidor de Créditos. O resto entra na fila da liquidação, sem prazo nem valor garantidos.",
      "O FGC é uma entidade privada, mantida por contribuições dos bancos associados, que devolve aos clientes de uma instituição que quebra os valores cobertos, até o limite de R$ 250 mil por CPF ou CNPJ, por instituição ou conglomerado financeiro. Há ainda um teto de R$ 1 milhão por pessoa a cada período de quatro anos.",
      "Ele existe para que a quebra de um banco não vire uma corrida contra todos os outros. É uma proteção forte contra um risco específico, e só contra ele.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O FGC foi criado em 1995, logo depois do Plano Real, quando o fim da inflação alta expôs bancos que viviam de ganhar com ela. Nos anos seguintes, o país viu a quebra ou a intervenção em bancos conhecidos, e o governo montou programas de socorro como o Proer. O fundo nasceu para dar ao pequeno depositante uma garantia que não dependesse de socorro público.",
          "Desde então, o limite foi elevado algumas vezes. O teto de R$ 1 milhão a cada quatro anos foi aprovado pelo Conselho Monetário Nacional no fim de 2017, para evitar que grandes investidores espalhassem dinheiro por bancos frágeis contando com a garantia repetidas vezes.",
        ],
      },
      {
        titulo: "O que cobre e o que não cobre",
        paragrafos: [
          "Estão cobertos, entre outros, depósitos à vista, poupança, CDB, RDB, LCI, LCA, letras de câmbio e letras hipotecárias. Os créditos de cada pessoa contra todas as instituições de um mesmo conglomerado são somados para o limite, e em conta conjunta o limite é dividido entre os titulares.",
          "Não estão cobertos títulos do Tesouro, ações, debêntures e cotas de fundos de investimento, que não são créditos contra o banco. Também ficam fora depósitos captados no exterior, letras imobiliárias garantidas e instrumentos subordinados. E, claro, uma conta em banco americano ou europeu não tem nada a ver com o FGC: vale a proteção do país onde ela está.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 18 de novembro de 2025, o Banco Central decretou a liquidação do Banco Master, que captava por meio de CDBs com taxas bem acima das do mercado. Foi o maior acionamento da história do fundo. Os depositantes cobertos passaram a ser ressarcidos dentro do limite, e o episódio levou o Conselho Monetário Nacional a endurecer, em 2026, as regras de contribuição dos bancos que dependem muito de captação garantida.",
          "A lição para o investidor é antiga: taxa muito acima da média costuma pagar por um risco. O FGC transfere parte desse risco para o sistema, mas só até o limite, e o ressarcimento leva algum tempo.",
        ],
      },
      {
        titulo: "Por que importa para quem pensa em dolarizar",
        paragrafos: [
          "O FGC protege contra a quebra de um banco. Não protege contra inflação, desvalorização do real, mudança de regra, confisco ou crise fiscal, que são justamente os riscos que a diversificação internacional tenta diluir. Num cenário de estresse do país, todos os bancos e o próprio FGC estão sob a mesma jurisdição.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você tem R$ 400 mil em CDBs de um banco que quebra e R$ 100 mil em LCA de outro banco do mesmo conglomerado. A soma contra o conglomerado é R$ 500 mil, e o FGC devolve R$ 250 mil. Os outros R$ 250 mil entram na liquidação. Se os mesmos R$ 500 mil estivessem divididos entre dois conglomerados diferentes, até R$ 250 mil em cada um, o FGC cobriria tudo, respeitado o teto de R$ 1 milhão em quatro anos.",
    naPratica:
      "Use o FGC pelo que ele é: uma rede de segurança para renda fixa bancária, que permite comprar CDBs de bancos menores dentro do limite. Não confunda isso com proteção do patrimônio. Uma carteira toda coberta pelo FGC continua 100% exposta ao real, aos juros e às regras do Brasil. A diversificação de moeda e de jurisdição resolve outro problema.",
    relacionados: ["proer", "custodia", "sipc", "cdb", "risco-de-credito", "diversificacao", "plano-real", "risco-de-concentracao"],
  },
  {
    slug: "residencia-fiscal",
    termo: "Residência fiscal",
    categoria: "Acesso, contas e impostos",
    apelidos: ["residente fiscal", "residentes fiscais", "não residente", "saída definitiva", "declaração de saída definitiva", "comunicação de saída definitiva"],
    resumo:
      "O país que tem o direito de tributar a sua renda mundial. Quem mora no Brasil é residente fiscal aqui, mesmo com todo o dinheiro lá fora. Para deixar de ser, é preciso sair do país e cumprir os passos formais.",
    texto: [
      "Todo o seu dinheiro está numa corretora em Nova York e numa conta em Lisboa. Você mora em Belo Horizonte. Onde paga imposto? No Brasil. Imposto de renda não segue o endereço do banco nem o passaporte: segue a residência fiscal.",
      "Residência fiscal é o vínculo que dá a um país o direito de tributar a sua renda mundial. Quem é residente fiscal no Brasil declara e paga imposto aqui sobre o que ganha em qualquer lugar, com as regras próprias para cada tipo de rendimento.",
      "É por isso que investir no exterior, morando aqui, não muda o lugar onde você paga imposto. E é por isso que mudar de país, de verdade, muda tanto.",
    ],
    secoes: [
      {
        titulo: "Como funciona no Brasil",
        paragrafos: [
          "Brasileiros que moram no Brasil são residentes. Estrangeiros passam a ser residentes, em regra, quando vêm com visto de residência ou quando ficam no país mais de 183 dias, contínuos ou não, num período de 12 meses.",
          "Quem vai embora precisa formalizar a saída. Ao sair em caráter definitivo, a pessoa entrega à Receita a comunicação e a declaração de saída definitiva do país e passa a ser não residente a partir da data da saída. Quem sai sem formalizar continua tratado como residente até completar 12 meses consecutivos fora, e só então deixa de ser.",
        ],
      },
      {
        titulo: "O que muda quando você muda",
        paragrafos: [
          "O não residente no Brasil passa a ser tributado aqui só sobre rendimentos de fonte brasileira, em geral com retenção na fonte, e deixa de declarar a renda mundial. Em compensação, passa a ser residente fiscal do novo país, que vai tributar a renda mundial dele pelas regras de lá, inclusive sobre investimentos que já tinha.",
          "Alguns países tributam ganhos acumulados antes da chegada, outros dão regimes especiais para recém-chegados, outros cobram imposto na saída. Os Estados Unidos têm uma particularidade: tributam cidadãos e portadores de green card onde quer que morem.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Quem dolariza morando no Brasil continua residente fiscal aqui. Isso significa declarar tudo, calcular o imposto em reais e seguir a Lei 14.754. Não existe atalho em que o dinheiro lá fora deixa de ser problema da Receita.",
          "Quem planeja morar fora um dia tem outra agenda. A ordem das coisas importa: vender antes ou depois da mudança, como declarar a saída, como o novo país trata o que você leva. É planejamento para fazer com profissionais dos dois lados, com antecedência.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Mudar de país e não fazer a saída definitiva. Para a Receita, você continua residente por um ano e, sem a declaração de saída, pode continuar obrigado a declarar aqui.",
          "Achar que ter cidadania estrangeira muda a residência fiscal. Passaporte europeu não faz ninguém deixar de ser residente no Brasil.",
        ],
      },
    ],
    exemplo:
      "Hipotético: uma brasileira se muda para Portugal para trabalhar em março e não faz a comunicação de saída definitiva. Até março do ano seguinte, para a Receita, ela continua residente e deve declarar aqui a renda que ganha lá, ao mesmo tempo em que Portugal passa a considerá-la residente pela regra de presença. As duas declarações e o abatimento do imposto pelo tratado entre Brasil e Portugal viram um quebra-cabeça que a saída formal teria evitado.",
    naPratica:
      "Ter dinheiro lá fora não muda onde você paga imposto: quem manda é a residência. Para quem fica no Brasil, a consequência é simples e às vezes esquecida: tudo o que está fora entra na declaração daqui. Para quem pensa em se mudar, a decisão fiscal vem antes da mudança, não depois.",
    relacionados: ["imposto-de-renda", "dupla-tributacao", "w-8ben", "lei-14754", "troca-automatica-de-informacoes", "jurisdicao"],
  },
  {
    slug: "troca-automatica-de-informacoes",
    termo: "Troca automática de informações",
    sigla: "CRS",
    categoria: "Acesso, contas e impostos",
    apelidos: ["Common Reporting Standard", "FATCA", "troca de informações fiscais", "intercâmbio de informações"],
    resumo:
      "Os acordos pelos quais bancos e corretoras de dezenas de países informam aos fiscos os saldos e rendimentos de clientes estrangeiros. A Receita recebe, todo ano, dados de contas de brasileiros no exterior.",
    texto: [
      "Você abre uma conta num banco em Portugal, investe, e esquece de declarar. No ano seguinte, sem que ninguém peça nada, os dados da conta chegam à Receita Federal: saldo, rendimentos, titular. Não foi um fiscal desconfiado. Foi um acordo internacional funcionando como deveria.",
      "Troca automática de informações é o conjunto de acordos pelos quais bancos, corretoras e outras instituições de dezenas de países identificam os clientes residentes em outros países e enviam os dados ao fisco local, que os repassa ao país de residência do cliente, todo ano.",
      "Há pouco mais de uma década, uma conta no exterior podia passar despercebida. Hoje, ela é visível por padrão.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A virada começou nos Estados Unidos. Em 2010, o Congresso americano aprovou o FATCA, uma lei que obriga instituições financeiras do mundo inteiro a identificar contas de cidadãos e residentes americanos e informar ao IRS, sob pena de uma retenção pesada sobre pagamentos americanos. Para operacionalizar, os Estados Unidos assinaram acordos com outros países. O acordo com o Brasil foi assinado em 2014 e prevê troca nos dois sentidos.",
          "Em seguida, a OCDE transformou a ideia num padrão multilateral, o Common Reporting Standard, o CRS, aprovado em 2014. Mais de cem jurisdições aderiram, inclusive centros financeiros como Suíça, Luxemburgo, Singapura, Cayman e Ilhas Virgens Britânicas. O Brasil participa e fez as primeiras trocas em 2018. Os Estados Unidos não aderiram ao CRS e seguem trocando dados pelo FATCA.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Ao abrir a conta, a instituição pergunta onde você é residente fiscal e qual o seu número de contribuinte, no caso, o CPF. Todo ano, ela informa ao fisco do país dela os saldos, juros, dividendos e valores de vendas das contas de não residentes. Os fiscos trocam os arquivos entre si, e a Receita cruza com as declarações.",
          "O mesmo caminho está sendo aberto para criptoativos. A OCDE aprovou um padrão específico, o CARF, e o Brasil se alinhou a ele com a nova declaração de criptoativos da Receita, a DeCripto, criada pela Instrução Normativa RFB 2.291, de novembro de 2025, com coleta a partir de julho de 2026.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Investir lá fora é legal e não exige esconder nada. A troca automática só complica a vida de quem tenta esconder: omissões viram cruzamento, multa e, nos casos graves, processo.",
          "Para quem declara direito, ela não muda nada, a não ser reforçar a importância de manter os números da declaração coerentes com os extratos que a instituição estrangeira vai informar.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você abre conta num banco em Portugal, deposita o equivalente a R$ 200 mil e recebe juros durante o ano. Esquece de declarar. No ano seguinte, o banco informa o saldo e os juros ao fisco português, que repassa os dados à Receita pelo CRS. No cruzamento, a conta aparece sem registro na sua declaração, e a regularização sai bem mais cara do que teria sido declarar.",
    naPratica:
      "Parta do princípio de que tudo o que você tem lá fora será informado à Receita, porque será. Declare contas, investimentos e rendimentos com os mesmos números dos extratos e guarde os documentos. A diversificação internacional funciona melhor quando é feita às claras, com o imposto calculado e pago no prazo.",
    relacionados: ["imposto-de-renda", "declaracao-de-capitais-no-exterior", "residencia-fiscal", "lei-14754", "w-8ben", "offshore", "marco-legal-dos-criptoativos"],
  },
  {
    slug: "jurisdicao",
    termo: "Jurisdição",
    categoria: "Acesso, contas e impostos",
    apelidos: ["jurisdições", "outra jurisdição", "risco de jurisdição", "risco jurisdicional"],
    resumo:
      "O território cujas leis, tribunais e governo valem para um ativo ou contrato. Diversificar jurisdição é ter parte do patrimônio sob regras que não mudam com a mesma caneta.",
    texto: [
      "Uma ação da Petrobras, um CDB, um apartamento em Curitiba, a poupança e um título do Tesouro. Parecem cinco investimentos diferentes, e são, em emissor, prazo e risco. Mas os cinco respondem às mesmas leis, aos mesmos tribunais, ao mesmo Banco Central e ao mesmo Congresso.",
      "Jurisdição é o território cujas leis, tribunais e autoridades valem para um ativo ou um contrato. Diversificar jurisdição é ter parte do patrimônio sob regras que não mudam com a mesma caneta.",
      "É uma das ideias centrais do curso. Trocar um ativo brasileiro por outro diversifica a empresa ou o emissor, mas não a regra do jogo. Só ativos sob outra jurisdição diluem esse risco.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Todo ativo tem uma lei que o rege e um lugar onde está registrado ou custodiado. Uma ação brasileira é regida pela lei brasileira e fica na central depositária da B3. Uma ação americana numa corretora americana é regida pela lei americana e fica custodiada nos Estados Unidos. Um BDR é um recibo brasileiro com lastro americano: um pé em cada lugar.",
          "Quando um governo muda uma regra, como um bloqueio de aplicações, um imposto novo, um controle de capitais ou uma intervenção num setor, ela alcança de uma vez tudo o que está sob a sua jurisdição. A diversificação entre ativos do mesmo país não protege contra isso.",
        ],
      },
      {
        titulo: "Casos reais",
        paragrafos: [
          "Em março de 1990, o Plano Collor bloqueou por 18 meses saldos de conta corrente, poupança e aplicações acima de um limite. Valeu para todo o sistema financeiro brasileiro ao mesmo tempo. Quem tinha recursos declarados em outra jurisdição não foi atingido por aquele bloqueio.",
          "Em dezembro de 2001, a Argentina limitou saques bancários no episódio que ficou conhecido como corralito, e depois converteu depósitos em dólar para pesos a uma taxa desfavorável. Em 2013, Chipre impôs perdas a depósitos acima de 100 mil euros em dois grandes bancos para resgatar o sistema. Em 2022, depois da invasão da Ucrânia, parte das reservas do banco central russo guardadas no exterior foi bloqueada. Jurisdição é risco nos dois sentidos: a de casa e a de fora.",
        ],
      },
      {
        titulo: "O que diversificar jurisdição faz e não faz",
        paragrafos: [
          "Faz: coloca parte do patrimônio fora do alcance direto de uma única autoridade. Dilui o risco de regra, de confisco, de controle de capitais e de crise institucional do país onde você vive.",
          "Não faz: não muda a sua residência fiscal. Você continua declarando e pagando imposto no Brasil sobre o que tem lá fora. E não elimina risco, porque o outro país também tem o seu, como mostram os casos de Chipre e das reservas russas. Por isso a escolha da jurisdição importa: estabilidade das regras, independência dos tribunais e respeito a contratos contam tanto quanto a rentabilidade.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um investidor tem R$ 1 milhão dividido entre ações da B3, CDBs, Tesouro e um fundo imobiliário. Está diversificado em ativos, mas 100% na jurisdição brasileira. Outro tem os mesmos R$ 1 milhão, com R$ 700 mil nessa mesma mistura e R$ 300 mil numa corretora americana. Diante de uma mudança de regra que atinja o sistema brasileiro, o segundo tem 30% do patrimônio fora do alcance direto dela.",
    naPratica:
      "Na aula, a tabela de riscos mostra que só ativos fora do país diluem o risco de regra. É um argumento de concentração, não de pessimismo: o objetivo não é apostar contra o Brasil, e sim não deixar uma única caneta decidir sobre todo o seu patrimônio. Ao dolarizar, pergunte não só em que moeda está o ativo, mas sob que lei e em que país ele está guardado.",
    relacionados: ["risco-de-expropriacao", "instituicoes", "custodia", "bdr", "diversificacao", "plano-collor", "corralito", "risco-de-concentracao"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "22:12" }, { modulo: 0, aula: 2 }],
  },
  {
    slug: "bitcoin",
    termo: "Bitcoin",
    sigla: "BTC",
    categoria: "Cripto e tecnologia",
    apelidos: ["bitcoins", "Satoshi Nakamoto", "whitepaper do bitcoin"],
    resumo:
      "O primeiro criptoativo: um dinheiro digital que funciona sem banco central nem intermediário, com emissão limitada a 21 milhões de unidades por regra. Criado em 2008 e em funcionamento desde janeiro de 2009.",
    texto: [
      "Em 31 de outubro de 2008, seis semanas depois da quebra do Lehman Brothers, alguém sob o nome de Satoshi Nakamoto mandou para uma lista de discussão sobre criptografia um texto de nove páginas. O título prometia um sistema de dinheiro eletrônico de pessoa para pessoa. Ninguém sabe até hoje quem é Satoshi. O sistema funciona desde então, sem parar.",
      "O bitcoin é o primeiro criptoativo: um dinheiro digital que circula sem banco central, sem banco comercial e sem nenhum intermediário que precise aprovar as transações. As regras estão no código, que qualquer um pode ler, e a emissão é limitada a 21 milhões de unidades.",
      "Para o investidor, ele é ao mesmo tempo três coisas: uma tecnologia, um ativo global negociado 24 horas por dia e um dos ativos mais voláteis que existem. Separar as três é o primeiro passo para pensar nele com calma.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O problema que o bitcoin resolveu era antigo. Um arquivo digital pode ser copiado infinitas vezes; um dinheiro digital precisa impedir que a mesma moeda seja gasta duas vezes. Até 2008, toda solução dependia de alguém no centro conferindo as contas, um banco ou uma empresa.",
          "Satoshi juntou peças que já existiam: a criptografia de chave pública dos anos 1970, os registros encadeados por impressão digital de Stuart Haber e Scott Stornetta, de 1991, a prova de trabalho do Hashcash, de Adam Back, de 1997, e as propostas de dinheiro descentralizado de Wei Dai e Nick Szabo, de 1998. A novidade foi o desenho de incentivos: quem gasta energia para proteger o registro recebe moedas novas por isso.",
          "Em 3 de janeiro de 2009, Satoshi criou o primeiro bloco, com uma manchete do jornal The Times daquele dia gravada dentro: o ministro das Finanças britânico à beira de um segundo resgate aos bancos. Dias depois, mandou as primeiras moedas ao programador Hal Finney.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Cada transação é assinada com a chave privada de quem envia e espalhada para milhares de computadores da rede. A cada dez minutos, em média, um minerador agrupa transações num bloco e o acrescenta a um registro público compartilhado, a blockchain. Para ganhar o direito de escrever o bloco, ele precisa vencer uma competição de esforço computacional, a prova de trabalho.",
          "A política monetária é fixa e conhecida por todos. Novos bitcoins entram em circulação como recompensa aos mineradores, e essa recompensa cai pela metade a cada 210 mil blocos, mais ou menos a cada quatro anos, no evento chamado halving. Pelo ritmo do protocolo, mais de 95% dos 21 milhões já foram emitidos em 2026, e o último bitcoin deve sair por volta de 2140. Não há comitê que mude isso.",
        ],
      },
      {
        titulo: "Os números e os tombos",
        paragrafos: [
          "A escassez programada não impede oscilações enormes. O bitcoin já caiu mais de 70% do pico ao fundo em pelo menos quatro ciclos, e em todas as vezes houve quem anunciasse o fim dele. Também já multiplicou de valor várias vezes em poucos anos. Quem entra precisa estar preparado para os dois lados, inclusive para perdas grandes que duram anos.",
          "O ativo mudou de público ao longo do tempo. Começou entre programadores e entusiastas, passou por exchanges pouco reguladas e chegou, em janeiro de 2024, aos ETFs à vista aprovados pela SEC nos Estados Unidos, que trouxeram gestoras tradicionais e investidores institucionais. Na B3, ETFs de bitcoin existem desde 2021.",
        ],
      },
      {
        titulo: "Como o imposto trata no Brasil",
        paragrafos: [
          "Depende de onde e como você tem o bitcoin. Comprado numa exchange brasileira, o ganho na venda segue a regra de ganho de capital, com isenção quando o total vendido em criptoativos no mês fica em até R$ 35 mil e alíquotas a partir de 15% acima disso. Um ETF de bitcoin na B3 segue a regra de renda variável, com 15% sobre o lucro e sem isenção. Criptoativos tratados como aplicação financeira no exterior entram na Lei 14.754, com 15% na declaração anual.",
          "A fronteira entre os regimes é técnica, e as obrigações de informar à Receita mudaram em 2026 com a nova declaração de criptoativos, a DeCripto. Cada caso pede conferência com um contador.",
        ],
      },
    ],
    exemplo:
      "Hipotético, para dimensionar o risco: você destina R$ 10 mil ao bitcoin. Num ciclo bom, ele pode dobrar ou triplicar. Num tombo de 75%, que já aconteceu mais de uma vez, os R$ 10 mil viram R$ 2.500, e podem ficar assim por dois ou três anos. Se esses R$ 10 mil fossem 2% de um patrimônio de R$ 500 mil, o tombo custaria 1,5% do total. Se fossem 40%, custaria 30%. O tamanho da posição decide se a volatilidade é suportável.",
    naPratica:
      "O bitcoin é uma forma de ter um ativo global, negociado o tempo todo, fora do sistema de qualquer banco central, e é por isso que aparece na conversa sobre dolarização. Mas ele não é dólar nem renda fixa: é um ativo de risco alto, que pode cair muito quando todo o resto também cai. O curso trata dos ativos digitais no Módulo IV, com o cuidado de separar a tecnologia da especulação e de discutir as formas de ter o ativo, por ETF, por exchange ou em autocustódia.",
    relacionados: ["blockchain", "halving", "mineracao", "prova-de-trabalho", "etf-de-bitcoin", "padrao-ouro", "autocustodia", "volatilidade"],
  },
  {
    slug: "blockchain",
    termo: "Blockchain",
    categoria: "Cripto e tecnologia",
    apelidos: ["blockchains", "cadeia de blocos", "registro distribuído", "tecnologia de registro distribuído", "DLT", "descentralização", "descentralizado"],
    resumo:
      "Um registro de transações copiado em milhares de computadores, organizado em blocos encadeados de forma que mudar o passado exigiria refazer tudo o que veio depois. Dispensa um dono central do livro.",
    texto: [
      "Pense num livro-caixa que, em vez de ficar na gaveta de um banco, tem uma cópia idêntica em milhares de computadores pelo mundo. Cada página nova traz, no rodapé, uma impressão digital da página anterior. Se alguém tentar apagar uma linha antiga, a impressão digital deixa de bater, e todo mundo percebe.",
      "Blockchain é isso: um registro de transações organizado em blocos encadeados, copiado entre muitos participantes, em que alterar o passado exigiria refazer tudo o que veio depois e convencer a maioria da rede. O nome vem justamente daí, cadeia de blocos.",
      "A tecnologia permite que desconhecidos concordem sobre quem tem o quê sem confiar num intermediário. É a base do bitcoin, do Ethereum, das stablecoins e da tokenização.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1991, os pesquisadores Stuart Haber e Scott Stornetta publicaram um método para carimbar documentos digitais no tempo de forma à prova de fraude: cada carimbo incorporava uma marca criptográfica do anterior, formando uma corrente. Alterar um documento antigo invalidaria toda a sequência posterior.",
          "A ideia ficou anos sem grande uso prático. Em 2008, o texto original do bitcoin citou Haber e Stornetta e juntou o encadeamento a duas outras peças: uma rede de pessoa para pessoa, em que cada participante guarda uma cópia, e uma regra para decidir quem escreve o próximo bloco. A palavra blockchain se popularizou depois, para descrever esse conjunto.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Cada bloco tem um cabeçalho com a impressão digital, o hash, do bloco anterior, e um resumo matemático de todas as transações que ele contém. Mudar uma transação muda o resumo, que muda o hash do bloco, que deixa de bater com o que está gravado no bloco seguinte.",
          "Quem decide qual será o próximo bloco é o mecanismo de consenso. No bitcoin, é a prova de trabalho: vence quem gasta esforço computacional e encontra a resposta certa primeiro. No Ethereum, desde 2022, é a prova de participação: validadores que deixam dinheiro em garantia são sorteados para propor blocos e perdem parte da garantia se trapacearem.",
          "Os participantes que guardam cópias completas, os nós, conferem cada bloco antes de aceitá-lo. Um bloco que quebra as regras é simplesmente ignorado, por maior que seja o poder de quem o enviou.",
        ],
      },
      {
        titulo: "Pública ou privada",
        paragrafos: [
          "Nas blockchains públicas, como bitcoin e Ethereum, qualquer pessoa pode ler o registro, mandar transações e participar da validação. É isso que garante a neutralidade, e é também o que as torna mais lentas e caras que um banco de dados comum.",
          "Nas blockchains permissionadas, só participantes autorizados escrevem no registro. Bancos e bancos centrais costumam testar esse modelo, porque ele dá controle e sigilo. Em troca, volta a existir alguém no centro decidindo quem entra, o que tira parte da graça original.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Blockchain não é sinônimo de bitcoin, e nem todo problema precisa de uma. Faz sentido quando o valor está justamente em não depender de uma parte central: dinheiro digital, registro de ativos que circulam entre muitas instituições, contratos que se executam sozinhos. Para o controle de estoque de uma loja, um banco de dados comum resolve melhor.",
          "Imutável também não quer dizer verdadeiro. A blockchain garante que o registro não foi alterado depois de escrito, não que a informação estava certa quando entrou. Se um imóvel é tokenizado com dados errados, o erro fica gravado com a mesma segurança.",
        ],
      },
    ],
    exemplo:
      "Hipotético: dez amigos mantêm uma planilha de quem deve a quem, cada um com uma cópia. Toda semana, as novas anotações são fechadas numa página, com um código calculado a partir da página anterior. Se um deles tentar apagar uma dívida antiga na própria cópia, o código das páginas seguintes deixa de bater com o dos outros nove, e a fraude aparece. A blockchain faz isso com milhares de participantes, que não se conhecem.",
    naPratica:
      "Blockchain é a infraestrutura; o investimento é outra coisa. Uma empresa dizer que usa blockchain não diz nada sobre se ela é um bom negócio, e um token registrado numa blockchain não vale mais por isso. Entender a tecnologia ajuda a separar o que é seguro por desenho do que depende de confiar em alguém, que é a pergunta central para avaliar qualquer ativo digital.",
    relacionados: ["bitcoin", "hash", "mineracao", "contrato-inteligente", "tokenizacao", "ethereum", "prova-de-trabalho", "prova-de-participacao"],
  },
  {
    slug: "halving",
    termo: "Halving",
    categoria: "Cripto e tecnologia",
    apelidos: ["halvings", "corte pela metade", "redução da recompensa"],
    resumo:
      "O corte pela metade da quantidade de novos bitcoins criados a cada bloco, que acontece a cada 210 mil blocos, mais ou menos a cada quatro anos. O último foi em abril de 2024, quando a recompensa caiu para 3,125 bitcoins.",
    texto: [
      "Em janeiro de 2009, quem registrava um bloco do bitcoin ganhava 50 bitcoins novos. Hoje, ganha 3,125. A queda não foi decisão de ninguém: estava escrita no código desde o primeiro dia.",
      "Halving é o corte pela metade da recompensa paga aos mineradores por bloco, que acontece a cada 210 mil blocos. Como sai um bloco a cada dez minutos, em média, isso dá perto de quatro anos entre um corte e outro.",
      "É o mecanismo que faz a emissão do bitcoin encolher até parar, com o total se aproximando de 21 milhões sem nunca passar disso.",
    ],
    secoes: [
      {
        titulo: "Os cortes até aqui",
        paragrafos: [
          "O primeiro halving aconteceu em novembro de 2012, no bloco 210 mil, e levou a recompensa de 50 para 25 bitcoins. O segundo, em julho de 2016, para 12,5. O terceiro, em maio de 2020, para 6,25. O quarto, em abril de 2024, no bloco 840 mil, para 3,125. O próximo é esperado para 2028, no bloco 1,05 milhão, quando a recompensa cairá para 1,5625.",
          "A soma de uma série que começa em 50 e cai pela metade a cada etapa explica o teto: 210 mil blocos vezes 50, mais 210 mil vezes 25, e assim por diante, dá praticamente 21 milhões. A emissão deve terminar por volta de 2140, quando a recompensa ficar menor que a menor fração de bitcoin que o protocolo registra.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "O minerador que registra um bloco inclui nele uma transação especial que cria as moedas novas e as manda para si. As regras do protocolo dizem quanto essa transação pode criar em cada altura da cadeia. Se um minerador tentar criar mais, os outros nós rejeitam o bloco.",
          "Além das moedas novas, o minerador recebe as taxas pagas pelas transações incluídas no bloco. Com os halvings, a parte das taxas tende a ganhar peso na receita de quem protege a rede. Se a segurança do bitcoin poderá ser paga só com taxas, no longo prazo, é um dos debates abertos sobre o ativo.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "O halving reduz a oferta nova de um ativo cuja demanda varia muito. Nos ciclos passados, os anos seguintes aos cortes tiveram altas fortes, o que alimentou a narrativa do ciclo de quatro anos.",
          "Mas o halving é o evento mais previsível do mercado: todo mundo sabe a data com anos de antecedência. Um evento assim tende a estar, ao menos em parte, no preço. E a oferta nova já é pequena perto do estoque: depois de 2024, a emissão anual ficou abaixo de 1% do total em circulação. Quatro observações não fazem uma lei, e o mercado de hoje, com ETFs e grandes investidores, é diferente do de 2012.",
        ],
      },
    ],
    exemplo:
      "Com perto de 144 blocos por dia, a emissão diária caiu de cerca de 900 bitcoins para cerca de 450 em abril de 2024. Hipotético: se o bitcoin valesse US$ 60 mil, a oferta nova que os mineradores precisavam vender por dia para pagar contas teria caído de uns US$ 54 milhões para uns US$ 27 milhões, da noite para o dia. É esse corte na oferta nova, e não no estoque, que o halving produz.",
    naPratica:
      "Halving não é calendário de ganho garantido. Use-o para entender como funciona a política monetária do bitcoin, que é fixa e transparente, ao contrário da de qualquer moeda de governo. Mas não planeje compras e vendas em torno da data: os ciclos passados não obrigam os futuros a se repetir, e quem confiou no padrão em ciclos recentes viu o mercado se comportar de forma diferente do esperado.",
    relacionados: ["bitcoin", "mineracao", "prova-de-trabalho", "padrao-ouro", "senhoriagem", "market-timing"],
  },
  {
    slug: "mineracao",
    termo: "Mineração",
    categoria: "Cripto e tecnologia",
    apelidos: ["mineradores", "minerador", "minerar", "minerado", "mineração de bitcoin"],
    resumo:
      "O trabalho de computadores que competem para registrar o próximo bloco do bitcoin, gastando energia para resolver um problema matemático. Quem vence recebe bitcoins novos e as taxas das transações.",
    texto: [
      "Em algum galpão no Texas, numa represa no Paraguai ou num campo de petróleo no Canadá, máquinas do tamanho de uma caixa de sapato fazem a mesma conta bilhões de vezes por segundo, dia e noite. Elas estão disputando o direito de escrever a próxima página do bitcoin.",
      "Mineração é esse trabalho: computadores especializados competem para registrar o próximo bloco da blockchain de uma rede de prova de trabalho, gastando energia para encontrar a resposta de um problema matemático. Quem acha primeiro registra o bloco e recebe bitcoins novos mais as taxas das transações incluídas.",
      "O nome é uma metáfora: como no ouro, há esforço, custo e recompensa, e a quantidade que se pode extrair diminui com o tempo.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O minerador monta um bloco candidato com transações pendentes e calcula a impressão digital dele, o hash. A regra exige que esse hash fique abaixo de um alvo, o que, na prática, significa começar com uma longa fila de zeros. Como não dá para prever o resultado, a única forma é variar um número no cabeçalho, o nonce, e tentar de novo, bilhões de vezes.",
          "Quem encontra um hash válido espalha o bloco pela rede. Os outros nós conferem em um instante, aceitam e passam a minerar o bloco seguinte em cima dele. A dificuldade se ajusta sozinha a cada 2.016 blocos, cerca de duas semanas, para que os blocos continuem saindo a cada dez minutos em média, não importa quantas máquinas entrem ou saiam.",
          "Como a chance de um minerador pequeno ganhar um bloco é mínima, a maioria se junta em grupos, os pools, que somam o poder de computação e dividem as recompensas na proporção do esforço de cada um.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "Nos primeiros meses, Satoshi e alguns entusiastas mineravam com processadores de computadores comuns. Logo vieram as placas de vídeo, que faziam a conta muito mais rápido, e, a partir de 2013, os chips feitos só para isso, os ASICs. Hoje, minerar bitcoin sem equipamento especializado e energia barata não paga a conta de luz.",
          "A geografia mudou junto. Por anos, a China concentrou boa parte da mineração mundial. Em 2021, o governo chinês proibiu a atividade, e as máquinas migraram para os Estados Unidos, o Cazaquistão, a Rússia, o Canadá e outros lugares. A rede não parou: a dificuldade caiu, se ajustou e voltou a subir.",
        ],
      },
      {
        titulo: "Por que importa",
        paragrafos: [
          "O esforço é caro, e é justamente isso que protege a rede. Para reescrever o histórico, um atacante precisaria de mais poder de computação do que todo o resto somado e gastaria uma fortuna em máquinas e energia para isso.",
          "A mineração também liga o bitcoin ao mundo físico: chips, energia e infraestrutura. Mineradores buscam a eletricidade mais barata do planeta, de hidrelétricas com sobra a gás que seria queimado sem uso em campos de petróleo. O consumo de energia é um dos pontos de debate regulatório e ambiental do ativo, e foi um dos motivos para outras redes adotarem a prova de participação.",
        ],
      },
      {
        titulo: "Um negócio, não uma renda",
        paragrafos: [
          "Mineração é uma atividade industrial, com margens que oscilam com o preço do bitcoin, a dificuldade e o custo da energia. Depois de cada halving, a receita por máquina cai pela metade de um dia para o outro, e os menos eficientes saem do negócio. Empresas de mineração listadas em bolsa costumam oscilar ainda mais que o próprio bitcoin.",
        ],
      },
    ],
    exemplo:
      "Hipotético: uma mineradora tem custo de energia e operação equivalente a US$ 40 mil por bitcoin produzido. Com o bitcoin a US$ 60 mil, ela lucra. No dia seguinte a um halving, passa a produzir metade dos bitcoins com as mesmas máquinas e o mesmo custo, e o custo por bitcoin vai a US$ 80 mil. Se o preço não subir, ela opera no prejuízo e precisa desligar máquinas, trocar por modelos mais eficientes ou buscar energia mais barata.",
    naPratica:
      "Para quem investe, a mineração ajuda a entender de onde vem a segurança do bitcoin e por que ela tem um custo real. Não é preciso minerar para ter o ativo. E ações de mineradoras são uma aposta diferente da do bitcoin: alavancada, operacional e sujeita a custos de energia e de equipamento, com risco ainda maior.",
    relacionados: ["prova-de-trabalho", "bitcoin", "halving", "hash", "prova-de-participacao", "semicondutor"],
  },
  {
    slug: "prova-de-trabalho",
    termo: "Prova de trabalho",
    categoria: "Cripto e tecnologia",
    apelidos: ["proof of work", "proof-of-work", "Hashcash"],
    resumo:
      "O mecanismo do bitcoin para decidir quem registra o próximo bloco: quem gastar esforço computacional e provar isso com a resposta certa. É caro de fazer e barato de conferir.",
    texto: [
      "Um cadeado de combinação com bilhões de possibilidades. Abrir exige testar uma por uma, e leva tempo. Mas, depois de aberto, qualquer pessoa confere em um segundo que ele está aberto. Essa assimetria, difícil de fazer e fácil de conferir, é o coração da prova de trabalho.",
      "Prova de trabalho é o mecanismo do bitcoin para decidir quem registra o próximo bloco: ganha o direito quem demonstrar, com uma resposta verificável, que gastou esforço computacional real. O esforço custa energia e máquinas. A conferência custa quase nada.",
      "O resultado é uma rede em que mentir é caro. Quem quisesse reescrever o histórico teria de refazer todo o trabalho já gasto e superar o resto da rede ao mesmo tempo.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A ideia nasceu contra o spam. Em 1992, os cientistas da computação Cynthia Dwork e Moni Naor propuseram cobrar um pequeno esforço de processamento por mensagem enviada. Em 1997, o criptógrafo britânico Adam Back criou o Hashcash, um sistema prático nessa linha: cada e-mail carregava uma pequena prova de cálculo. Para quem manda um e-mail, o custo é irrelevante; para quem manda milhões, fica proibitivo.",
          "Por uma década, a prova de trabalho ficou à espera de uma aplicação maior. Nick Szabo a usou no desenho do Bit Gold, em 1998, que nunca virou sistema funcional. Satoshi Nakamoto percebeu que o mesmo mecanismo podia servir para coordenar e proteger um dinheiro sem dono e citou o Hashcash no texto original do bitcoin.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "O problema a resolver é encontrar um número que, combinado com os dados do bloco e passado por uma função hash, produza um resultado abaixo de um certo alvo. Funções hash são imprevisíveis por desenho, então não há atalho: é tentativa e erro.",
          "Quando alguém encontra, os outros conferem com um único cálculo. Se a resposta estiver certa e as transações forem válidas, o bloco é aceito. A cadeia válida é a que acumula mais trabalho, e por isso um bloco fica mais seguro a cada novo bloco construído em cima dele.",
        ],
      },
      {
        titulo: "Força e fraqueza",
        paragrafos: [
          "A força é a ancoragem no mundo físico. A segurança do bitcoin não depende de reputação nem de promessa: depende de quanto custaria superar o poder de computação da rede, hoje enorme.",
          "A fraqueza também é física. O consumo de energia é alto e entra no debate regulatório e ambiental. E redes pequenas de prova de trabalho, com pouco poder de computação, já sofreram ataques em que alguém alugou máquinas suficientes para reescrever parte do histórico e gastar a mesma moeda duas vezes. A prova de trabalho protege bem quem tem muito trabalho acumulado.",
        ],
      },
    ],
    exemplo:
      "Hipotético, em escala de brinquedo: a regra diz que a impressão digital do bloco precisa começar com dois zeros. Você troca um número no bloco e calcula de novo, e de novo, até sair algo como 00a3f9. Em média, leva umas 256 tentativas. Quem recebe o bloco faz uma conta só e vê os dois zeros. Na rede real, a exigência é tão maior que a rede inteira, somada, precisa de dez minutos em média para achar uma resposta.",
    naPratica:
      "A prova de trabalho dá ao bitcoin uma segurança ligada a custos reais, e esse é um dos argumentos de quem o compara ao ouro. A contrapartida é o consumo de energia, que pode virar alvo de regulação em alguns países. Para o investidor, vale entender que a segurança da rede e o preço do ativo são coisas diferentes: a primeira tem se mostrado robusta; o segundo continua muito volátil.",
    relacionados: ["mineracao", "bitcoin", "hash", "prova-de-participacao", "blockchain", "halving"],
  },
  {
    slug: "prova-de-participacao",
    termo: "Prova de participação",
    categoria: "Cripto e tecnologia",
    apelidos: ["proof of stake", "proof-of-stake", "validadores", "validador", "The Merge"],
    resumo:
      "Mecanismo de consenso em que quem valida as transações são participantes que deixam criptoativos bloqueados como garantia. Gasta muito menos energia que a mineração. O Ethereum adotou em setembro de 2022.",
    texto: [
      "Na prova de trabalho, quem quer validar a rede gasta energia. Na prova de participação, põe dinheiro em jogo. Se agir direito, recebe recompensas. Se trapacear, perde parte do que deixou em garantia.",
      "Prova de participação é o mecanismo de consenso em que os validadores das transações são participantes que bloqueiam uma quantidade do criptoativo da própria rede como caução. A rede sorteia entre eles quem propõe cada bloco, e os demais conferem e atestam.",
      "Gasta uma fração mínima da energia da mineração. O Ethereum, segunda maior rede, trocou um modelo pelo outro em setembro de 2022.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "A ideia apareceu poucos anos depois do bitcoin, em fóruns de entusiastas, como resposta ao consumo de energia da mineração. A primeira rede a usar uma versão dela foi o Peercoin, em 2012.",
          "O grande teste foi o Ethereum. A rede nasceu em 2015 com mineração e, em dezembro de 2020, lançou uma cadeia paralela de prova de participação. Em 15 de setembro de 2022, no evento chamado The Merge, as duas se fundiram e a mineração foi desligada, sem interromper a rede. O consumo de energia caiu mais de 99%.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "No Ethereum, quem quer ser validador deposita ao menos 32 ethers num contrato da rede e mantém um computador ligado, rodando o software de validação. O tempo é dividido em intervalos de 12 segundos. Em cada um, um validador é sorteado para propor o bloco, e um comitê de outros validadores atesta que ele é válido.",
          "Os validadores recebem recompensas em ether por propor e atestar corretamente. Se ficam fora do ar, perdem um pouco. Se fazem algo que só um trapaceiro faria, como assinar dois blocos conflitantes, sofrem uma punição mais dura, o slashing: perdem parte da caução e são expulsos.",
          "A segurança vem do custo econômico de agir mal. Atacar a rede exigiria controlar uma parte enorme de todo o ether em caução, e o ataque destruiria o valor do próprio ativo do atacante.",
        ],
      },
      {
        titulo: "As críticas",
        paragrafos: [
          "Quem defende a prova de trabalho argumenta que a prova de participação favorece quem já tem mais moedas, já que quem tem mais caução recebe mais recompensas, e que a segurança fica ancorada no próprio sistema, e não num custo físico externo.",
          "Há também o risco de concentração: grandes plataformas que fazem staking em nome de clientes acabam controlando uma fatia relevante dos validadores. A rede tem mecanismos para lidar com isso, mas o debate é real.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um validador deixa 32 ethers em caução. Se valida corretamente, recebe ao longo de um ano algo como 3% a mais em ether, conforme as condições da rede. Se o servidor dele cai por uma semana, deixa de ganhar e perde uma fração pequena. Se, por erro de configuração, ele roda duas cópias do mesmo validador e assina blocos conflitantes, sofre slashing: perde parte dos 32 ethers e é removido.",
    naPratica:
      "Redes de prova de participação permitem o staking, uma forma de rendimento em criptoativo. Esse rendimento não é juro de renda fixa: vem no próprio ativo, que pode cair muito de preço, e traz riscos técnicos, de prazo de saque e da plataforma que faz a validação por você. Entender o mecanismo ajuda a avaliar a taxa anunciada com o ceticismo que ela merece.",
    relacionados: ["staking", "ethereum", "prova-de-trabalho", "mineracao", "blockchain", "contrato-inteligente"],
  },
  {
    slug: "staking",
    termo: "Staking",
    categoria: "Cripto e tecnologia",
    apelidos: ["fazer staking", "rendimento de staking", "recompensas de staking"],
    resumo:
      "Bloquear criptoativos para ajudar a validar uma rede de prova de participação e receber recompensas por isso. É a forma de rendimento mais comum em redes como o Ethereum.",
    texto: [
      "Uma plataforma anuncia: deixe seus ethers parados aqui e receba 3% ao ano. Parece uma poupança em cripto. Não é. O rendimento existe, tem origem conhecida, mas vem com riscos que nenhuma aplicação bancária tem.",
      "Staking é bloquear criptoativos para ajudar a validar uma rede de prova de participação e receber recompensas por isso, pagas no próprio ativo. Você pode fazer diretamente, rodando um validador, ou por meio de uma plataforma que junta recursos de muitos clientes e faz a validação em nome deles.",
      "É a forma de rendimento mais comum em redes como o Ethereum, e uma das mais mal compreendidas.",
    ],
    secoes: [
      {
        titulo: "De onde vem o rendimento",
        paragrafos: [
          "Nas redes de prova de participação, quem valida transações recebe duas coisas: moedas novas criadas pelo protocolo e uma parte das taxas pagas pelos usuários. O staking é a forma de participar dessa remuneração.",
          "A taxa não é fixa. Ela cai quando mais gente entra em staking, porque a recompensa é dividida entre mais participantes, e sobe com o uso da rede, que gera mais taxas. E, como a recompensa vem em ether, ou no ativo da rede, o seu ganho em reais depende do preço desse ativo.",
        ],
      },
      {
        titulo: "Os riscos que um CDB não tem",
        paragrafos: [
          "Prazo para sair. Para tirar ativos do staking, é preciso entrar numa fila de saída, que pode levar de horas a semanas conforme a demanda. Num tombo de mercado, você pode não conseguir vender na hora que quer.",
          "Punições. Se o validador falha ou age de forma conflitante, parte do que está em caução é cortada. Quando você delega a uma plataforma, o erro técnico dela vira o seu prejuízo.",
          "Intermediário. Se a plataforma guarda as chaves, você corre o risco dela: quebra, bloqueio de saques, ordem judicial. Há ainda os tokens de staking líquido, que representam o ether em staking e podem ser negociados; eles trazem o risco do contrato que os emite e podem perder a paridade em momentos de estresse.",
          "Regra. O tratamento regulatório e tributário do staking ainda está se formando em vários países, inclusive no Brasil, e a forma de declarar as recompensas pede orientação de um contador.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2022, durante a crise do mercado cripto, plataformas que prometiam rendimento sobre depósitos de clientes, como a Celsius, suspenderam saques e quebraram. Parte do que elas chamavam de rendimento vinha de staking, parte de empréstimos arriscados. Os clientes descobriram que tinham um crédito contra a empresa, e não ativos guardados.",
          "Em fevereiro de 2023, uma grande exchange americana fechou um acordo com a SEC e encerrou o seu programa de staking para clientes nos Estados Unidos. O episódio mostrou que, para o regulador, oferecer rendimento sobre o ativo do cliente pode ser um produto financeiro com regras próprias. A posição mudou depois: em 2025, com outra direção, a área técnica da SEC declarou que o staking feito diretamente no protocolo, em geral, não é oferta de valor mobiliário. A regra muda com o regulador, e isso também é risco.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você deixa 10 ethers em staking, comprados a US$ 3 mil cada, US$ 30 mil no total, e recebe 3% ao ano em ether. Um ano depois, tem 10,3 ethers. Se o preço caiu 30%, para US$ 2.100, a posição vale cerca de US$ 21.630: você tem mais ethers e menos dinheiro. Se o preço subiu 30%, vale cerca de US$ 40.170. O staking mudou pouco o resultado; o preço decidiu quase tudo.",
    naPratica:
      "Staking não é renda fixa nem jeito de transformar cripto em aplicação conservadora. É uma remuneração em ativo volátil, com riscos técnicos, de liquidez e de custódia. Antes de olhar a taxa anunciada, pergunte quem guarda as chaves durante o staking, quanto tempo leva para sair e o que acontece se a plataforma falhar. Para quem está dolarizando, ele é um detalhe dentro da parcela de risco, nunca um substituto para a parcela segura.",
    relacionados: ["prova-de-participacao", "ethereum", "autocustodia", "exchange", "defi", "custodia", "liquidez"],
  },
  {
    slug: "carteira-cripto",
    termo: "Carteira de criptoativos",
    categoria: "Cripto e tecnologia",
    apelidos: ["carteira digital", "carteiras digitais", "wallet", "wallets", "carteira fria", "carteira quente", "cold wallet", "hot wallet", "frase de recuperação"],
    resumo:
      "O aplicativo ou dispositivo que guarda as chaves que dão acesso aos seus criptoativos. As moedas ficam na blockchain; a carteira guarda a senha que permite movê-las.",
    texto: [
      "Um detalhe confunde quase todo mundo que começa: os bitcoins não ficam dentro da carteira. Eles estão registrados na blockchain, num endereço. O que a carteira guarda são as chaves que provam que você pode movimentá-los.",
      "Carteira de criptoativos é o aplicativo, programa ou dispositivo que gera e guarda essas chaves, mostra o saldo dos seus endereços e assina as transações quando você quer enviar algo. Perder a carteira não apaga os ativos da blockchain; perder as chaves, sim, apaga o seu acesso a eles.",
      "Escolher uma carteira é escolher um equilíbrio entre praticidade e segurança, e entre confiar em alguém ou só em você.",
    ],
    secoes: [
      {
        titulo: "Os tipos",
        paragrafos: [
          "Carteira quente é a que fica conectada à internet: um aplicativo no celular, uma extensão no navegador, um programa no computador. É prática para o dia a dia e para usar serviços na blockchain, mas mais exposta a vírus, golpes e roubo do aparelho.",
          "Carteira fria é a que guarda as chaves fora da internet: um dispositivo físico dedicado, parecido com um pen drive, que assina transações sem nunca expor a chave ao computador. É mais segura para valores maiores guardados por muito tempo.",
          "Há ainda a distinção entre carteiras de custódia, em que uma empresa guarda as chaves por você, como numa exchange, e carteiras de autocustódia, em que só você tem as chaves.",
        ],
      },
      {
        titulo: "A frase de recuperação",
        paragrafos: [
          "Ao criar uma carteira de autocustódia, você recebe uma sequência de 12 ou 24 palavras, sorteadas de uma lista padrão de 2.048 palavras. Dessa frase saem, por matemática, todas as chaves da carteira. Com ela, você reconstrói a carteira em qualquer aparelho, de qualquer fabricante compatível.",
          "Isso é ao mesmo tempo a maior vantagem e o maior risco. Quem tem a frase tem os ativos, onde quer que esteja. Se você perder a frase e o aparelho, ninguém consegue recuperar o acesso: não há central de atendimento nem esqueci minha senha.",
        ],
      },
      {
        titulo: "Erros comuns",
        paragrafos: [
          "Guardar a frase de recuperação em foto no celular, em e-mail ou numa nota na nuvem. Se a conta for invadida, os ativos vão junto.",
          "Digitar a frase num site ou passá-la a alguém que se apresenta como suporte. Nenhum serviço legítimo pede a frase de recuperação. Esse é o golpe mais comum do setor.",
          "Comprar dispositivo físico de revendedor desconhecido. Um aparelho adulterado pode vir com chaves já conhecidas por quem o vendeu.",
          "Não planejar a herança. Se só você sabe onde está a frase, os seus herdeiros podem nunca ter acesso aos ativos.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2013, um técnico de informática no País de Gales jogou fora um disco rígido antigo que guardava as chaves de milhares de bitcoins minerados nos primeiros anos. O disco foi parar num aterro sanitário. Ele passou mais de uma década tentando obter autorização para escavar o lugar, sem sucesso. Os bitcoins continuam lá, visíveis na blockchain e, ao que tudo indica, inacessíveis para sempre.",
        ],
      },
    ],
    exemplo:
      "Hipotético: seu celular com a carteira é roubado. Se você anotou a frase de 24 palavras em papel, guardada num lugar seguro e longe do celular, instala a carteira num aparelho novo, digita a frase e, em minutos, tem o controle dos ativos de volta. Mais prudente ainda: transfere tudo para uma carteira nova, já que não sabe se o ladrão conseguiu ver a frase. Se você não anotou, o acesso está perdido, e nada nem ninguém pode reverter isso.",
    naPratica:
      "Ter cripto numa carteira própria é a forma mais direta de ter o ativo sem depender de intermediário nenhum. Também é a forma em que todo erro é seu. Muitos investidores preferem a exposição por ETF ou por uma exchange regulada justamente por isso. Se escolher a carteira própria, trate a frase de recuperação como trataria a escritura de um imóvel, e pense desde já em como alguém de confiança chegaria a ela se você não puder.",
    relacionados: ["chave-privada", "autocustodia", "exchange", "bitcoin", "custodia", "etf-de-bitcoin"],
  },
  {
    slug: "chave-privada",
    termo: "Chave privada",
    categoria: "Cripto e tecnologia",
    apelidos: ["chaves privadas", "chave pública", "chaves públicas", "assinatura digital"],
    resumo:
      "O número secreto que prova que você é dono de um endereço numa blockchain e permite assinar transações. Quem tem a chave privada controla os ativos.",
    texto: [
      "Pense numa caixa de correio com uma fenda na frente. Qualquer pessoa que saiba o endereço pode deixar uma carta lá dentro. Só quem tem a chave da portinhola consegue tirar o que está lá. Num sistema como o bitcoin, o endereço é público; a chave da portinhola é a chave privada.",
      "Chave privada é o número secreto que prova que você controla um endereço numa blockchain e permite assinar transações a partir dele. Quem tem a chave privada controla os ativos. Quem não tem, não controla, por mais que o nome dele esteja em algum cadastro.",
      "Daí vem o ditado do mercado: se não são as suas chaves, não são as suas moedas.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "A chave privada é um número enorme, gerado ao acaso. No bitcoin, ele tem 256 bits, o que dá uma quantidade de possibilidades parecida com o número de átomos do universo observável. Adivinhar a chave de alguém por tentativa não é difícil: é impossível na prática.",
          "Da chave privada sai, por uma conta matemática de mão única, a chave pública, e da chave pública sai o endereço. O caminho de volta não existe: conhecer o endereço ou a chave pública não revela a privada.",
          "Quando você envia bitcoins, a carteira usa a chave privada para assinar a transação. A rede confere a assinatura usando a chave pública, sem nunca ver a privada. Uma assinatura válida prova que quem mandou tem a chave, e serve só para aquela transação: não pode ser reaproveitada para mandar outra.",
        ],
      },
      {
        titulo: "Por que importa",
        paragrafos: [
          "A chave privada é a forma digital de posse. Não há banco para estornar uma transação assinada, nem juiz que consiga desfazê-la na blockchain. Se alguém obtém a sua chave, pode transferir tudo para outro endereço, e a transferência é definitiva.",
          "Quem deixa os ativos numa exchange confia que ela guarda as chaves com segurança e honra os saques. É uma escolha legítima, com outro tipo de risco: o da empresa.",
        ],
      },
      {
        titulo: "Um olho no futuro",
        paragrafos: [
          "A segurança das chaves de hoje depende de problemas matemáticos que os computadores atuais não resolvem em tempo útil. Computadores quânticos grandes o bastante, se um dia existirem, poderiam quebrar parte desses esquemas. A comunidade técnica estuda algoritmos resistentes a isso, e redes como o bitcoin precisariam de uma atualização coordenada para adotá-los. Não é um risco de curto prazo, mas é um dos debates sérios sobre o futuro dos criptoativos.",
        ],
      },
    ],
    exemplo:
      "Hipotético: alguém descobre a sua chave privada, ou a frase de recuperação que gera todas as suas chaves, porque você a fotografou e a sua conta na nuvem foi invadida. Em minutos, o invasor transfere todos os seus criptoativos para um endereço dele. Você vê a transação na blockchain, sabe para onde foi, e não tem como trazer de volta. Não há central para ligar.",
    naPratica:
      "Não existe recuperação de senha em cripto. A segurança da chave privada é toda a segurança do ativo, e é por isso que autocustódia exige método: cópia em papel ou metal, local seguro, nenhum registro digital e desconfiança total de qualquer um que peça a frase. Se esse nível de responsabilidade não combina com você, a custódia por uma instituição regulada ou a exposição por ETF são caminhos legítimos.",
    relacionados: ["criptografia-de-chave-publica", "carteira-cripto", "autocustodia", "bitcoin", "hash", "custodia"],
  },
  {
    slug: "criptografia-de-chave-publica",
    termo: "Criptografia de chave pública",
    categoria: "Cripto e tecnologia",
    apelidos: ["criptografia", "criptografia assimétrica", "RSA", "Diffie-Hellman"],
    resumo:
      "O sistema de pares de chaves, uma pública e uma privada, que permite trocar segredos e assinar mensagens com quem você nunca encontrou. Está por trás do cadeado do navegador, do Pix e do bitcoin.",
    texto: [
      "Até os anos 1970, para mandar uma mensagem cifrada, as duas pontas precisavam combinar antes uma senha secreta, pessoalmente ou por um mensageiro de confiança. Governos e bancos faziam isso com malotes e códigos. Para dois desconhecidos na internet, seria impossível.",
      "Criptografia de chave pública é o sistema que resolveu esse problema com um par de chaves ligadas por matemática: uma pública, que pode ser divulgada a qualquer um, e uma privada, que fica só com o dono. O que uma tranca, só a outra abre.",
      "Ela está por trás do cadeado do navegador quando você acessa o banco, dos certificados digitais, das assinaturas eletrônicas e, décadas depois, das moedas digitais sem banco central.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1976, os pesquisadores americanos Whitfield Diffie e Martin Hellman publicaram um artigo com um título ambicioso, Novos Caminhos em Criptografia. Mostraram que duas pessoas podiam combinar um segredo conversando em público, sem que quem estivesse ouvindo descobrisse o segredo.",
          "No ano seguinte, três pesquisadores do MIT, Ron Rivest, Adi Shamir e Leonard Adleman, criaram o RSA, o primeiro sistema prático de chave pública para cifrar e assinar. Anos depois, soube-se que criptógrafos do serviço de inteligência britânico tinham chegado a ideias parecidas no começo dos anos 1970, mas o trabalho era secreto. Em 1985, surgiu a criptografia de curvas elípticas, que faz o mesmo com chaves menores e é a usada no bitcoin.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Há dois usos principais. Para sigilo, alguém cifra uma mensagem com a sua chave pública, e só a sua chave privada consegue decifrar. Para assinatura, você usa a chave privada para assinar um documento, e qualquer pessoa confere a assinatura com a sua chave pública.",
          "A segurança vem de problemas matemáticos fáceis de fazer num sentido e muito difíceis no outro, como multiplicar dois números primos grandes, que é rápido, contra descobrir quais primos foram multiplicados, que é inviável na prática com números de centenas de dígitos.",
        ],
      },
      {
        titulo: "Onde você usa sem perceber",
        paragrafos: [
          "No cadeado do navegador: o site do banco apresenta um certificado com a chave pública dele, assinado por uma autoridade reconhecida, e o seu navegador usa isso para combinar uma senha de sessão que ninguém no meio do caminho consegue ler.",
          "Nos certificados digitais usados para assinar documentos com validade jurídica e para autenticar empresas e instituições financeiras em sistemas de pagamento. E no bitcoin e em todas as redes que vieram depois, em que a assinatura com a chave privada é o que autoriza cada transação.",
        ],
      },
    ],
    exemplo:
      "Hipotético: Ana quer receber um documento sigiloso de Bruno, que ela nunca encontrou. Ela publica a sua chave pública no site da empresa. Bruno cifra o documento com essa chave e manda por e-mail comum. Mesmo que alguém intercepte a mensagem, não consegue ler: só a chave privada de Ana, que nunca saiu do computador dela, abre o arquivo. Se Ana assinar a resposta com a chave privada, Bruno confere com a chave pública que veio mesmo dela.",
    naPratica:
      "Entender a lógica das chaves ajuda a separar o que é seguro por desenho do que depende de confiar em alguém. É a base para avaliar qualquer forma de guardar ativos digitais: numa carteira própria, a segurança vem da matemática e do seu cuidado; numa instituição, da regulação e da reputação dela. Nenhuma das duas é infalível, e cada uma falha de um jeito.",
    relacionados: ["chave-privada", "hash", "bitcoin", "internet", "blockchain", "carteira-cripto"],
  },
  {
    slug: "hash",
    termo: "Hash",
    categoria: "Cripto e tecnologia",
    apelidos: ["hashes", "função hash", "funções hash", "SHA-256"],
    resumo:
      "Uma função que transforma qualquer conteúdo numa sequência curta e de tamanho fixo, como uma impressão digital. Mudar uma vírgula no conteúdo muda o resultado por completo, e não dá para fazer o caminho de volta.",
    texto: [
      "Passe um livro inteiro de 500 páginas por uma função hash e você recebe uma sequência de 64 caracteres. Passe de novo e recebe exatamente a mesma sequência. Troque uma vírgula na página 312 e o resultado muda por completo, sem nenhuma semelhança com o anterior.",
      "Hash é uma função que transforma qualquer conteúdo, de uma palavra a um filme, numa sequência curta e de tamanho fixo, como uma impressão digital. É fácil de calcular, inviável de reverter e praticamente impossível de duas entradas diferentes darem o mesmo resultado.",
      "Essas propriedades fazem do hash uma das peças mais usadas da computação, da senha do seu e-mail à segurança do bitcoin.",
    ],
    secoes: [
      {
        titulo: "As propriedades que importam",
        paragrafos: [
          "Determinismo: a mesma entrada sempre gera a mesma saída. Efeito avalanche: uma mudança mínima na entrada muda a saída inteira. Mão única: dado o resultado, não há como descobrir a entrada a não ser tentando todas as possibilidades. Resistência a colisões: encontrar duas entradas com o mesmo resultado é inviável na prática.",
          "Funções antigas, como MD5 e SHA-1, perderam a resistência a colisões com o avanço das técnicas, e pesquisadores conseguiram produzir colisões reais. Por isso foram aposentadas em usos de segurança. A SHA-256, publicada em 2001 pelo órgão de padrões americano, segue de pé.",
        ],
      },
      {
        titulo: "Como a blockchain usa",
        paragrafos: [
          "Cada bloco carrega o hash do bloco anterior. Mexer numa transação antiga muda o hash daquele bloco, que deixa de bater com o registro no bloco seguinte, e assim por diante até o fim da cadeia. A fraude se denuncia sozinha.",
          "Dentro de cada bloco, as transações são combinadas em pares de hashes, até sobrar um único hash que resume todas. Isso permite provar que uma transação está no bloco sem baixar o bloco inteiro.",
          "E a mineração é, no fundo, uma busca por hash: o minerador procura um número que faça o hash do bloco ficar abaixo de um alvo. O bitcoin usa a SHA-256 aplicada duas vezes, e outra função para encurtar as chaves públicas em endereços.",
        ],
      },
      {
        titulo: "Onde mais você usa",
        paragrafos: [
          "Sites sérios não guardam a sua senha, guardam o hash dela. Quando você digita, o sistema calcula o hash e compara. Se o banco de dados vazar, o invasor não vê as senhas diretamente.",
          "Programas e arquivos são distribuídos com o hash publicado ao lado, para que você confira que baixou exatamente o arquivo original, sem adulteração. Peritos usam hashes para provar que uma prova digital não foi alterada.",
        ],
      },
    ],
    exemplo:
      "Hipotético, com a SHA-256: a palavra dolar gera uma sequência de 64 caracteres que começa de um jeito. A palavra Dolar, só com a primeira letra maiúscula, gera outra sequência de 64 caracteres sem nenhum trecho em comum com a primeira. Não existe forma de olhar as duas sequências e deduzir que vieram de palavras quase iguais. É essa imprevisibilidade que torna o hash útil como lacre.",
    naPratica:
      "O hash é uma das peças que fazem de uma blockchain um registro difícil de adulterar. Não é preciso entender a matemática para investir; basta saber que a integridade do registro vem do desenho, e não de uma empresa garantindo o livro. O que o hash não garante é que a informação estava certa quando entrou, nem que o ativo registrado vale alguma coisa.",
    relacionados: ["blockchain", "mineracao", "prova-de-trabalho", "criptografia-de-chave-publica", "bitcoin", "chave-privada"],
  },
  {
    slug: "autocustodia",
    termo: "Autocustódia",
    categoria: "Cripto e tecnologia",
    apelidos: ["auto custódia", "custódia própria", "self-custody", "autocustodiar"],
    resumo:
      "Guardar os próprios criptoativos, com as próprias chaves, sem depender de exchange ou banco. Elimina o risco do intermediário e transfere para você todo o risco de erro, perda e golpe.",
    texto: [
      "Quando você compra bitcoin numa exchange e deixa lá, o que aparece na tela é um saldo: uma promessa da empresa de entregar os ativos quando você pedir. As chaves que movimentam os bitcoins estão com ela. Autocustódia é tirar os ativos de lá e guardá-los numa carteira cujas chaves só você controla.",
      "Autocustódia é guardar os próprios criptoativos, com as próprias chaves, sem depender de exchange, banco ou qualquer intermediário. É a forma de posse que o bitcoin tornou possível: um ativo financeiro que você controla diretamente, como dinheiro vivo, só que digital e global.",
      "Ela elimina o risco do intermediário e transfere para você todo o risco de erro, perda e golpe. Não há resposta certa universal; há uma escolha entre dois tipos de risco.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Você cria uma carteira própria, quente ou fria, anota a frase de recuperação e transfere os ativos da exchange para um endereço dessa carteira. A partir daí, nenhuma empresa pode bloquear, congelar ou perder os seus ativos. Também nenhuma empresa pode recuperá-los se você perder as chaves.",
          "Para valores maiores, há arranjos mais robustos, como carteiras que exigem duas ou três assinaturas de chaves guardadas em lugares diferentes para movimentar os ativos. Isso reduz o risco de um único ponto de falha, mas aumenta a complexidade.",
        ],
      },
      {
        titulo: "Casos reais",
        paragrafos: [
          "Na quebra da FTX, em novembro de 2022, quem tinha os criptoativos em autocustódia não foi afetado. Quem tinha saldo na exchange ficou anos esperando a recuperação judicial. No começo de 2019, a canadense QuadrigaCX parou de funcionar depois da morte do fundador, que seria o único a ter acesso a parte das chaves; mais tarde, a investigação mostrou que o dinheiro dos clientes tinha sido desviado.",
          "O outro lado também tem casos. Pessoas perderam fortunas por esquecer senhas, jogar fora discos rígidos ou digitar a frase de recuperação em sites falsos. Na autocustódia, não há a quem reclamar.",
        ],
      },
      {
        titulo: "Como a regra brasileira trata",
        paragrafos: [
          "As regras do Banco Central para as prestadoras de serviços de ativos virtuais, em vigor desde 2 de fevereiro de 2026, mantiveram a possibilidade de o cliente transferir os ativos para a própria carteira. Em contrapartida, as prestadoras precisam identificar o dono da carteira autocustodiada e verificar a origem e o destino dos ativos em certas transferências, como parte das regras contra lavagem de dinheiro.",
          "Autocustódia não tira os ativos do alcance da Receita: eles continuam sendo bens que precisam ser declarados, e as operações feitas fora de prestadoras brasileiras têm obrigações próprias de informação.",
        ],
      },
      {
        titulo: "Os dois riscos lado a lado",
        paragrafos: [
          "Na custódia por terceiros, o risco é da instituição: quebra, fraude, bloqueio de saques, ordem judicial, ataque hacker. A regulação reduz esse risco, mas não o zera.",
          "Na autocustódia, o risco é seu: perda da frase, roubo, golpe, erro ao digitar um endereço, herdeiros sem acesso. A disciplina reduz esse risco, mas também não o zera.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um investidor tem o equivalente a R$ 50 mil em bitcoin. Deixa R$ 5 mil numa exchange regulada, para ter liquidez rápida, e guarda R$ 45 mil numa carteira fria, com a frase de recuperação anotada em metal e guardada num cofre, e uma carta com instruções para a família num envelope separado. Ele aceita o risco de uma pequena parte na exchange e assume pessoalmente o risco da maior parte, com um método para isso.",
    naPratica:
      "Autocustódia é a forma mais pura de ter um ativo sem intermediário, e por isso conversa com a lógica da diversificação de jurisdição do curso, ainda que você continue sujeito às leis e à Receita do país onde mora. Mas ela só faz sentido com método. Para valores relevantes, entenda bem os dois riscos antes de decidir, teste o processo com valores pequenos e pense na sucessão. Se a responsabilidade não combinar com você, ETF ou instituição regulada são escolhas igualmente válidas.",
    relacionados: ["carteira-cripto", "chave-privada", "exchange", "custodia", "marco-legal-dos-criptoativos", "jurisdicao", "etf-de-bitcoin"],
  },
  {
    slug: "exchange",
    termo: "Exchange",
    categoria: "Cripto e tecnologia",
    apelidos: ["exchanges", "corretora de criptoativos", "corretoras de criptoativos", "corretora de cripto", "prestadora de serviços de ativos virtuais", "prestadoras de serviços de ativos virtuais", "SPSAV"],
    resumo:
      "Empresa que intermedeia a compra, a venda e a guarda de criptoativos. No Brasil, desde fevereiro de 2026, precisa de autorização do Banco Central para funcionar.",
    texto: [
      "Você deposita reais por Pix, toca em comprar e, segundos depois, tem um saldo em bitcoin na tela. Do outro lado dessa operação está uma exchange: a empresa que fez a ponte entre o seu dinheiro e o ativo digital, e que, se você deixar o saldo lá, também o guarda.",
      "Exchange, ou corretora de criptoativos, é a empresa que intermedeia a compra, a venda e a troca de criptoativos e, muitas vezes, a guarda deles. É a porta de entrada mais comum para quem começa nesse mercado.",
      "No Brasil, desde 2 de fevereiro de 2026, essas empresas precisam de autorização do Banco Central para funcionar, como bancos e corretoras de câmbio.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Há dois modelos principais. No livro de ofertas, a exchange junta compradores e vendedores, como uma bolsa, e cobra uma taxa por negociação. No modelo de balcão, ela mesma vende e compra de você, com o custo embutido no preço, o spread.",
          "Depois da compra, você escolhe: deixar os ativos na exchange, que guarda as chaves em nome dos clientes, ou sacar para uma carteira própria. No primeiro caso, o que você tem é um saldo nos registros da empresa. No segundo, o ativo está sob seu controle direto na blockchain.",
        ],
      },
      {
        titulo: "De onde vem a regra",
        paragrafos: [
          "Por mais de uma década, exchanges funcionaram com pouca regulação no mundo inteiro, e algumas das maiores perdas da história do setor vieram delas. A japonesa Mt. Gox, que chegou a processar a maior parte das negociações de bitcoin do mundo, quebrou em 2014 depois de perder centenas de milhares de bitcoins de clientes. A FTX, em 2022, misturou o dinheiro dos clientes com o de uma empresa ligada e pediu falência em poucos dias.",
          "No Brasil, a Lei 14.478, de dezembro de 2022, criou o marco legal das prestadoras de serviços de ativos virtuais. Em 2023, o Banco Central foi designado regulador. Em novembro de 2025, publicou as Resoluções 519, 520 e 521, em vigor desde 2 de fevereiro de 2026: exigem autorização prévia, governança, controles internos, regras de proteção ao cliente e de prevenção à lavagem de dinheiro, e trazem para o mercado de câmbio as operações internacionais com criptoativos e a negociação de stablecoins. As empresas que já operavam ganharam um período de transição para se adaptar e pedir autorização.",
        ],
      },
      {
        titulo: "Exchange brasileira ou estrangeira",
        paragrafos: [
          "Uma exchange autorizada no Brasil segue as regras do Banco Central, informa as operações dos clientes à Receita e tem de separar os ativos dos clientes do patrimônio próprio. Uma exchange estrangeira que atende brasileiros sem autorização fica fora dessas regras, e o cliente que deixa ativos lá fica sem as proteções exigidas aqui.",
          "Para a Receita, a nova declaração de criptoativos, a DeCripto, em vigor desde julho de 2026, alcança também prestadoras constituídas no exterior que dirigem as suas atividades ao mercado brasileiro. E quem opera fora de prestadoras brasileiras tem obrigações próprias de informar.",
        ],
      },
      {
        titulo: "O que conferir",
        paragrafos: [
          "Se a empresa é autorizada pelo Banco Central, ou está no processo de autorização dentro do prazo de transição. Onde e como ela guarda os ativos dos clientes, e se publica alguma forma de prova de reservas auditada. Quanto cobra no total, somando taxa de negociação, spread e taxa de saque. E se permite sacar os ativos para uma carteira própria quando você quiser.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você compra R$ 10 mil em bitcoin numa exchange e deixa o saldo lá. Se ela segrega os ativos e quebra, os bitcoins são seus e devem ser devolvidos no processo. Se ela não segregava, como aconteceu na FTX, você vira credor numa falência, recebe o que sobrar depois de anos e no valor que a Justiça definir. A diferença entre os dois cenários não aparece na tela do aplicativo enquanto tudo vai bem.",
    naPratica:
      "A exchange é uma porta prática e, agora, regulada. Para quem quer uma parcela do patrimônio em criptoativos, o primeiro filtro é a autorização do Banco Central; o segundo, o custo total; o terceiro, a decisão consciente entre deixar o ativo com a empresa ou levá-lo para a própria carteira. Para quem quer só exposição ao preço, sem lidar com nada disso, os ETFs de criptoativos são outro caminho.",
    relacionados: ["marco-legal-dos-criptoativos", "autocustodia", "custodia", "stablecoin", "carteira-cripto", "etf-de-bitcoin", "spread-cambial"],
  },
  {
    slug: "stablecoin",
    termo: "Stablecoin",
    categoria: "Cripto e tecnologia",
    apelidos: ["stablecoins", "moeda estável", "moedas estáveis", "dólar digital", "dólar tokenizado", "USDT", "USDC", "GENIUS Act"],
    resumo:
      "Criptoativo feito para valer sempre o mesmo que uma moeda tradicional, quase sempre o dólar, geralmente lastreado em depósitos e títulos do Tesouro americano. No Brasil, desde 2026, transações internacionais com stablecoins são tratadas como câmbio.",
    texto: [
      "Um comerciante em Buenos Aires recebe pagamentos em pesos e, no fim do dia, troca tudo por um token que vale um dólar e mora no celular dele. Uma empresa brasileira paga um fornecedor na Ásia em minutos, num domingo, sem passar por banco correspondente. Os dois estão usando a mesma coisa: uma stablecoin.",
      "Stablecoin é um criptoativo feito para valer sempre o mesmo que uma moeda tradicional, quase sempre o dólar. Para cumprir a promessa, o emissor guarda reservas, em geral dinheiro e títulos de curto prazo do Tesouro americano, e se compromete a trocar cada token por uma unidade da moeda.",
      "Ela virou a ponte entre o mundo cripto e o dinheiro tradicional. No Brasil, é de longe o criptoativo mais negociado: pelos dados da Receita Federal, as stablecoins responderam por cerca de 80% do volume declarado de operações com criptoativos em 2025.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Os primeiros tokens do que viria a ser o Tether foram emitidos em 2014, com a ideia de dar aos operadores de cripto um jeito de sair de posições sem voltar para o sistema bancário. A USDC, de uma empresa americana, veio em 2018, com a proposta de reservas mais transparentes.",
          "O caminho teve tropeços. Em maio de 2022, a TerraUSD, uma stablecoin que tentava manter a paridade só com um algoritmo, sem reservas de verdade, perdeu o dólar e desabou em dias, levando junto dezenas de bilhões de dólares em valor. Em março de 2023, a USDC chegou a valer menos de 90 centavos por um fim de semana, quando parte das reservas ficou presa no Silicon Valley Bank, que quebrou. Voltou à paridade quando o governo americano garantiu os depósitos do banco.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Nas stablecoins lastreadas em moeda, o emissor recebe dólares, emite o mesmo número de tokens numa blockchain e aplica o dinheiro em ativos seguros e líquidos. Quando alguém devolve tokens, ele os destrói e paga os dólares. O lucro do emissor vem dos juros das reservas; o detentor do token, em regra, não recebe esses juros.",
          "Os tokens circulam livremente entre carteiras e exchanges, 24 horas por dia. A paridade se mantém enquanto o mercado confia que as reservas existem e que o resgate funciona. Quando a confiança some, o token pode negociar abaixo de um dólar, como aconteceu com a USDC em 2023.",
        ],
      },
      {
        titulo: "A regra nos Estados Unidos e no Brasil",
        paragrafos: [
          "Os Estados Unidos aprovaram em julho de 2025 o GENIUS Act, a primeira lei federal para stablecoins de pagamento: exige reserva de um para um em ativos líquidos, como dinheiro e títulos curtos do Tesouro, publicação mensal da composição das reservas e supervisão dos emissores.",
          "No Brasil, as regras do Banco Central em vigor desde fevereiro de 2026 incluíram no mercado de câmbio a compra, a venda e a troca de criptoativos referenciados em moeda estrangeira e os pagamentos e transferências internacionais feitos com criptoativos, com limite por operação quando a contraparte não é instituição autorizada a operar câmbio. A natureza jurídica das stablecoins segue em debate no Congresso, e a cobrança de IOF sobre essas operações está em discussão.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Uma stablecoin dá exposição ao dólar com a praticidade de um token. Mas o risco não é o de uma conta num banco americano. Você depende do emissor, da qualidade e da guarda das reservas, da exchange ou carteira onde o token está e da regulação de vários países. Não há seguro de depósito, e o token, em regra, não rende juros para quem o detém.",
          "Para a Receita e o Banco Central, também não é um jeito de escapar das regras de câmbio e de imposto. As operações são informadas, e o ganho com a variação do dólar entra no imposto pelas regras de criptoativos.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você troca R$ 5.500 por 1.000 tokens atrelados ao dólar numa exchange, com o dólar a R$ 5,50. Se o emissor for sólido, os tokens valem US$ 1.000 em qualquer lugar do mundo, a qualquer hora. Um ano depois, com o dólar a R$ 6, eles valem R$ 6.000, e a variação entra nas regras de imposto de criptoativos. Se, no meio do caminho, surgisse dúvida sobre as reservas, o token poderia negociar a US$ 0,90 por dias, e quem precisasse vender naquele momento teria uma perda que uma conta em dólar não teria.",
    naPratica:
      "Stablecoin é uma ferramenta, não um porto seguro. Pode ser útil para pagamentos e para movimentar valor entre plataformas, e dá exposição ao dólar. Para guardar patrimônio em dólar por anos, compare com alternativas que rendem juros e têm proteções conhecidas, como títulos do Tesouro americano ou contas em bancos regulados lá fora. Se usar, escolha emissores com reservas auditadas, saiba onde os tokens estão guardados e declare tudo.",
    relacionados: ["tokenizacao", "exchange", "marco-legal-dos-criptoativos", "cbdc", "treasury", "remessa", "dolarizacao", "rwa"],
  },
  {
    slug: "token",
    termo: "Token",
    categoria: "Cripto e tecnologia",
    apelidos: ["tokens", "criptoativo", "criptoativos", "ativo virtual", "ativos virtuais", "ativos digitais", "criptomoeda", "criptomoedas"],
    resumo:
      "Uma unidade digital registrada numa blockchain que representa valor ou um direito: uma moeda, uma cota, um título, um ingresso. Criptoativo é o nome geral para esses ativos.",
    texto: [
      "Uma ficha de fliperama, um ingresso de show, uma cota de fundo, uma ação. Todas são representações de um direito: jogar uma partida, entrar no estádio, receber parte de um patrimônio. Um token é a versão digital dessa ideia, registrada numa blockchain.",
      "Token é uma unidade digital registrada numa blockchain que representa valor ou um direito. Pode ser a moeda nativa de uma rede, como o bitcoin ou o ether, ou algo criado em cima de uma rede existente, como uma stablecoin, um título tokenizado, um ponto de fidelidade ou uma obra digital única.",
      "Criptoativo é o nome geral para esses ativos. A lei brasileira usa outra expressão: ativo virtual.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Criar um token em cima de uma rede como o Ethereum é relativamente simples: basta publicar um contrato inteligente que segue um padrão. Em 2015, a comunidade do Ethereum definiu um padrão para tokens intercambiáveis, em que todas as unidades são iguais, como moedas. Em 2018, outro padrão para tokens únicos, os chamados NFTs, em que cada unidade é diferente das outras.",
          "O contrato registra quem tem quantos tokens e define as regras de transferência. Qualquer carteira e exchange que entende o padrão consegue mostrar e movimentar o token, sem precisar de autorização de quem o criou.",
        ],
      },
      {
        titulo: "O que a lei brasileira diz",
        paragrafos: [
          "A Lei 14.478, de 2022, define ativo virtual como a representação digital de valor que pode ser negociada ou transferida por meios eletrônicos e usada para pagamentos ou com propósito de investimento. Ficam fora dessa definição, entre outros, a moeda nacional e as estrangeiras, a moeda eletrônica, os pontos e programas de fidelidade e os valores mobiliários e ativos financeiros que já têm regulação própria.",
          "Isso significa que o mesmo formato pode ter naturezas jurídicas diferentes. Um token que dá direito a uma parte dos lucros de um projeto, oferecido ao público como investimento, pode ser um valor mobiliário, sob as regras da CVM, que publicou em 2022 uma orientação sobre o tema. Um token de pagamento é ativo virtual, sob o Banco Central. Um ponto de fidelidade não é nenhum dos dois.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em 2017, milhares de projetos levantaram dinheiro vendendo tokens ao público em ofertas iniciais, as ICOs, muitas vezes com pouco mais que um documento de intenções. Bilhões de dólares entraram. A maioria dos projetos nunca entregou o que prometia, e muitos tokens perderam quase todo o valor. Nos Estados Unidos, a SEC passou a tratar várias dessas ofertas como emissões irregulares de valores mobiliários.",
          "A lição ficou: o formato token não diz nada sobre a qualidade do que está por trás.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um imóvel comercial é dividido em 1.000 tokens, cada um dando direito a uma fração do aluguel, por meio de uma estrutura jurídica que liga o token ao imóvel. Quem compra 10 tokens recebe 1% da renda líquida e pode vendê-los a qualquer hora para outra pessoa, em minutos. Mas, se a estrutura jurídica for frágil, ou se o administrador sumir com o aluguel, o token continua existindo na blockchain e vale pouco ou nada.",
    naPratica:
      "Token é forma, não conteúdo. Antes de comprar qualquer um, as perguntas são sempre as mesmas: o que está por trás dele, quem garante esse direito, sob que lei e em que tribunal você reclamaria se algo desse errado. Na dúvida sobre a resposta, a dúvida já é a resposta.",
    relacionados: ["tokenizacao", "rwa", "stablecoin", "blockchain", "marco-legal-dos-criptoativos", "contrato-inteligente", "bolha"],
  },
  {
    slug: "tokenizacao",
    termo: "Tokenização",
    categoria: "Cripto e tecnologia",
    apelidos: ["tokenizar", "tokenizado", "tokenizados", "ativos tokenizados", "tokenização de ativos"],
    resumo:
      "Representar um ativo tradicional, como título, cota de fundo, imóvel ou recebível, como um token numa blockchain. Promete negociação a qualquer hora, liquidação mais rápida e frações menores.",
    texto: [
      "Hoje, comprar um título ou uma cota de fundo passa por corretora, custodiante, câmara de liquidação e, às vezes, alguns dias de espera, sempre em horário comercial. A tokenização propõe registrar esse mesmo ativo numa blockchain, onde a troca de dono pode acontecer em minutos, a qualquer hora, em frações pequenas.",
      "Tokenizar é representar um ativo tradicional, como um título público, uma cota de fundo, um imóvel ou um recebível, como um token numa blockchain, ligado a ele por uma estrutura jurídica. O ativo continua o mesmo: um título do Tesouro americano tokenizado ainda é um título do Tesouro americano. Muda a forma de registrar e de transferir.",
      "Depois de anos de promessas, a ideia ganhou escala a partir de 2024, puxada por grandes gestoras e bancos.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "Três camadas. O ativo, guardado por um custodiante tradicional. A estrutura jurídica, geralmente um fundo ou uma empresa, que é dona do ativo e emite os tokens. E o token na blockchain, que dá ao detentor o direito sobre uma fração do que a estrutura tem.",
          "A blockchain registra quem tem quantos tokens. Contratos inteligentes podem automatizar pagamentos de juros, restrições de quem pode comprar e regras de transferência. O vínculo entre o token e o ativo, porém, depende de contratos, auditorias e da lei de algum país, e não da blockchain.",
        ],
      },
      {
        titulo: "De onde vem e onde está",
        paragrafos: [
          "Em 2021, uma gestora americana passou a registrar as cotas de um fundo de títulos do governo numa blockchain pública. Em março de 2024, a BlackRock, maior gestora do mundo, lançou no Ethereum um fundo tokenizado que aplica em títulos do Tesouro americano e caixa. Bancos, bolsas e bancos centrais passaram a testar tokenização de depósitos, títulos e garantias.",
          "No Brasil, o Drex nasceu com a ideia de criar uma plataforma para ativos tokenizados no sistema financeiro, e o mercado de recebíveis tokenizados cresceu sob as regras da CVM. A adoção, aqui e lá fora, ainda é pequena perto do mercado tradicional.",
        ],
      },
      {
        titulo: "As promessas e os limites",
        paragrafos: [
          "As promessas: negociação 24 horas, liquidação quase imediata, frações pequenas que abrem acesso a ativos antes restritos, menos intermediários e custos menores, transparência sobre quem tem o quê.",
          "Os limites: o direito sobre o ativo depende da estrutura jurídica e do emissor; liquidez 24 horas só existe se houver compradores do outro lado; muitos tokens só podem ser comprados por investidores qualificados ou de certos países; e as regras de custódia, imposto e falência ainda estão sendo escritas em vários lugares.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um título que paga juros semestrais é colocado num fundo, e as cotas do fundo são emitidas como tokens de US$ 10. Um investidor compra 50 tokens num sábado e recebe os juros na carteira, automaticamente, a cada semestre. Na segunda, vende metade a outro investidor, com liquidação em minutos. Se o fundo for bem estruturado, ele tem o mesmo direito que um cotista tradicional. Se não for, tem um token e uma dúvida.",
    naPratica:
      "A tokenização pode, no futuro, baratear e simplificar o acesso a ativos de fora, inclusive títulos americanos, para quem está no Brasil. Por ora, trate cada produto tokenizado como trataria qualquer investimento novo: entenda o que está por trás, quem é o emissor, onde o ativo está guardado, sob que lei e o que acontece se algo der errado. A tecnologia muda o trilho; o risco do ativo continua o mesmo.",
    relacionados: ["rwa", "token", "stablecoin", "drex", "contrato-inteligente", "treasury", "blockchain", "liquidez"],
  },
  {
    slug: "rwa",
    termo: "Ativos do mundo real",
    sigla: "RWA",
    categoria: "Cripto e tecnologia",
    apelidos: ["real world assets", "real-world assets", "RWAs", "ativos reais tokenizados"],
    resumo:
      "Ativos tradicionais, como títulos públicos, crédito, imóveis e commodities, representados por tokens numa blockchain. É o nome de mercado para o resultado da tokenização.",
    texto: [
      "No vocabulário cripto, por muito tempo, tudo era nativo da blockchain: moedas criadas pela própria rede, tokens de projetos, obras digitais. A partir de 2023, uma sigla passou a aparecer em todo relatório do setor: RWA, de real world assets, ativos do mundo real.",
      "RWA são tokens que representam algo que existe fora da blockchain: um título do Tesouro americano, um recebível de empresa, um empréstimo, um imóvel, uma barra de ouro. É o nome de mercado para o resultado da tokenização.",
      "O segmento cresceu puxado por um motivo simples: com os juros americanos altos, dava para levar para dentro da blockchain o rendimento dos títulos do governo dos Estados Unidos.",
    ],
    secoes: [
      {
        titulo: "Como cresceu",
        paragrafos: [
          "Entre 2022 e 2023, os juros americanos saíram de perto de zero para mais de 5% ao ano. Protocolos de finanças descentralizadas que guardavam bilhões em stablecoins sem rendimento perceberam que podiam aplicar parte das reservas em títulos do Tesouro. Gestoras passaram a oferecer fundos tokenizados de títulos públicos, que pagam juros a quem tem os tokens.",
          "As próprias stablecoins são, em certo sentido, o maior caso de RWA: tokens cujo valor depende de dinheiro e títulos guardados fora da blockchain. Em seguida vieram crédito privado tokenizado, ouro tokenizado e experiências com imóveis e ações.",
        ],
      },
      {
        titulo: "As duas camadas de risco",
        paragrafos: [
          "A primeira é a do ativo em si. Um token de título do Tesouro americano tem o risco do Tesouro americano. Um token de crédito a pequenas empresas num país emergente tem o risco dessas empresas, que pode ser alto, mesmo que o token esteja numa blockchain moderna.",
          "A segunda é a da estrutura que liga o token ao ativo: o emissor, o custodiante, o auditor, o contrato inteligente e a lei que se aplica numa disputa. Se qualquer elo falha, o token pode deixar de representar o que prometia. Em crédito privado tokenizado, já houve casos de inadimplência que mostraram que a blockchain registra a dívida, mas não a cobra.",
        ],
      },
      {
        titulo: "O que costuma confundir",
        paragrafos: [
          "Achar que RWA é uma classe de ativo. Não é: é um formato. Um título público, um recebível e um imóvel tokenizados continuam sendo coisas muito diferentes.",
          "Achar que estar na blockchain dá liquidez. A negociação 24 horas só existe se houver compradores, e muitos RWAs têm restrições de quem pode comprar e vender.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um token de RWA representa uma fração de um fundo que compra títulos do Tesouro americano de curto prazo. Se esses títulos rendem 4% ao ano e o fundo cobra 0,5%, o detentor recebe perto de 3,5%, pagos em tokens ou em stablecoins. É praticamente o mesmo rendimento de um fundo tradicional parecido, com uma camada a mais de risco tecnológico e jurídico, e algumas vantagens de liquidação e de acesso.",
    naPratica:
      "RWA aproxima o mundo cripto da renda fixa tradicional. Não muda o risco do ativo por trás e acrescenta o risco da estrutura. Para quem quer títulos americanos, comprar o título diretamente, numa corretora regulada, continua sendo o caminho mais simples. A pergunta diante de qualquer RWA é sempre a mesma: o que exatamente eu tenho, e quem me garante isso?",
    relacionados: ["tokenizacao", "token", "stablecoin", "defi", "treasury", "risco-de-credito", "credito-privado"],
  },
  {
    slug: "defi",
    termo: "Finanças descentralizadas",
    sigla: "DeFi",
    categoria: "Cripto e tecnologia",
    apelidos: ["protocolos DeFi", "protocolo DeFi"],
    resumo:
      "Serviços financeiros, como empréstimo, troca de ativos e aplicação, executados por programas numa blockchain, sem banco ou corretora no meio. Funcionam 24 horas e têm riscos próprios, como falhas de código.",
    texto: [
      "Imagine uma casa de câmbio sem dono, sem funcionários e sem horário: um programa público que troca um token por outro a qualquer hora, seguindo regras escritas no código. Ou um sistema de empréstimo em que você deixa um criptoativo como garantia e toma outro emprestado, sem cadastro, sem análise de crédito e sem gerente.",
      "Isso é DeFi, sigla de finanças descentralizadas: serviços financeiros como troca, empréstimo, aplicação e derivativos executados por contratos inteligentes numa blockchain, sem banco ou corretora no meio. Qualquer pessoa com uma carteira pode usar.",
      "É talvez a demonstração mais clara do potencial da tecnologia, e também a mais clara dos seus riscos.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "As peças surgiram sobre o Ethereum. Em 2017, um protocolo lançou uma stablecoin criada a partir de empréstimos com garantia em ether, sem banco emissor. Em 2018, surgiu a primeira grande corretora automática, em que os preços são definidos por uma fórmula a partir de reservas depositadas por usuários, e não por um livro de ofertas.",
          "Em 2020, o uso explodiu. Protocolos passaram a distribuir tokens próprios a quem depositasse recursos, e bilhões de dólares entraram em poucos meses, num período que o mercado apelidou de verão DeFi.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Numa corretora automática, usuários depositam pares de tokens num fundo comum e recebem uma parte das taxas de quem troca ali. O preço se ajusta pela proporção entre os tokens no fundo: quem compra um deles o torna mais escasso e, portanto, mais caro.",
          "Num protocolo de empréstimo, você deposita uma garantia maior que o valor emprestado. Se o preço da garantia cai e a relação fica apertada, o contrato vende a garantia automaticamente para pagar a dívida, sem aviso e sem negociação.",
          "Tudo é público: o código, as reservas, as transações. Qualquer pessoa pode conferir quanto há em cada protocolo e para onde o dinheiro foi.",
        ],
      },
      {
        titulo: "Os riscos próprios",
        paragrafos: [
          "Risco de código. Em 2016, um erro num contrato chamado The DAO permitiu que um atacante drenasse uma parte grande dos recursos, e a comunidade do Ethereum dividiu a rede para desfazer o ataque. Desde então, ataques a contratos e às pontes entre blockchains já levaram bilhões de dólares, às vezes em minutos.",
          "Risco de liquidação. Numa queda forte, garantias são vendidas em cascata, e o preço cai ainda mais. Risco de oráculo: os contratos dependem de fontes externas de preço, que podem ser manipuladas. Risco de governança: muitos protocolos são controlados, na prática, por poucos detentores de tokens.",
          "E não há fundo garantidor, ouvidoria ou juiz que desfaça uma transação. A regulação também está se formando: o que é permitido oferecer a quem, em cada país, ainda está em discussão.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você deposita o equivalente a US$ 10 mil em ether como garantia e toma US$ 5 mil em stablecoin emprestados. O protocolo exige que a garantia valha pelo menos 1,25 vez a dívida. Se o ether cai 40%, a garantia passa a valer US$ 6 mil, abaixo dos US$ 6.250 exigidos. O contrato vende parte do seu ether automaticamente, com uma multa, para cobrir a dívida. Você não recebe ligação, não negocia prazo e descobre pela tela.",
    naPratica:
      "DeFi mostra o potencial de recriar serviços financeiros sem intermediário, com transparência total. Para o investidor, exige entender o risco técnico, além do de preço, e aceitar que não existe a quem recorrer. Não é lugar para a parcela segura do patrimônio, nem para quem está começando. O tema volta no Módulo IV, ao lado de stablecoins e tokenização.",
    relacionados: ["contrato-inteligente", "ethereum", "stablecoin", "staking", "rwa", "token", "risco-de-credito"],
  },
  {
    slug: "contrato-inteligente",
    termo: "Contrato inteligente",
    categoria: "Cripto e tecnologia",
    apelidos: ["contratos inteligentes", "smart contract", "smart contracts"],
    resumo:
      "Um programa que roda numa blockchain e executa regras automaticamente quando as condições são cumpridas. Ninguém consegue impedir nem alterar a execução depois que ele está no ar.",
    texto: [
      "Pense numa máquina de refrigerante. Você põe a moeda, aperta o botão e a lata cai. Não há vendedor, não há negociação, não há como a máquina mudar de ideia. O cientista da computação Nick Szabo usou essa imagem nos anos 1990 para descrever contratos que se executam sozinhos.",
      "Contrato inteligente é um programa publicado numa blockchain que executa regras automaticamente quando as condições previstas são cumpridas: recebe ativos, guarda, calcula, paga. Depois de publicado, ninguém consegue impedir nem alterar a execução, a não ser que o próprio código preveja isso.",
      "É a peça que transformou a blockchain de um registro de pagamentos numa plataforma para construir serviços financeiros inteiros.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Szabo descreveu a ideia em textos de meados dos anos 1990, quando a internet comercial começava. Faltava uma infraestrutura em que o código rodasse sem depender de um servidor de alguém, que poderia ser desligado ou alterado.",
          "O bitcoin trouxe a infraestrutura, mas com uma linguagem de programação propositalmente limitada. Em 2013, Vitalik Buterin propôs uma blockchain com uma linguagem completa, em que qualquer pessoa pudesse publicar qualquer programa. O Ethereum entrou no ar em 2015 e tornou os contratos inteligentes práticos.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "O programador escreve o contrato, publica na rede e ele ganha um endereço, como uma carteira. Qualquer pessoa pode interagir com ele mandando uma transação. Todos os computadores da rede executam o mesmo código e chegam ao mesmo resultado, que fica gravado na blockchain.",
          "Cada operação tem um custo, pago na moeda da rede, que remunera quem processa e impede programas infinitos. O código e o estado do contrato são públicos: qualquer um pode ler as regras e conferir quanto dinheiro está guardado ali.",
        ],
      },
      {
        titulo: "A força e o risco vêm do mesmo lugar",
        paragrafos: [
          "O contrato faz exatamente o que o código diz, nem mais nem menos. Isso elimina a necessidade de confiar numa contraparte, e também elimina a possibilidade de corrigir um erro depois.",
          "Em 2016, um contrato chamado The DAO, que reunia o equivalente a uma fatia grande de todo o ether da época, tinha uma falha que permitia sacar recursos repetidamente. Um atacante explorou a brecha. A comunidade do Ethereum decidiu alterar a própria rede para desfazer o ataque, e quem discordou manteve a versão original, que existe até hoje com outro nome. Em 2017, outro erro congelou para sempre centenas de milhares de ethers em carteiras que dependiam de um mesmo contrato.",
        ],
      },
      {
        titulo: "Onde está hoje",
        paragrafos: [
          "Contratos inteligentes são a base das stablecoins, das finanças descentralizadas, dos tokens de todo tipo e da tokenização de ativos tradicionais. Grandes gestoras e bancos usam contratos para registrar cotas de fundos e automatizar pagamentos. Auditorias de código viraram um setor próprio, e ainda assim falhas continuam aparecendo.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um contrato inteligente guarda o pagamento de um frete. Ele só libera o dinheiro à transportadora quando recebe, de uma fonte de dados combinada, a confirmação da entrega. Se a entrega não acontece em 30 dias, devolve o valor ao comprador. Ninguém precisa conferir nada manualmente. Mas, se a fonte de dados for manipulada ou o código tiver um erro, o contrato também executará isso à risca.",
    naPratica:
      "Ao usar qualquer serviço construído sobre contratos inteligentes, você está confiando num código. Auditorias, tempo de funcionamento sem incidentes e o volume de recursos que o contrato já protegeu importam tanto quanto a reputação de quem o criou. Para quem está dolarizando, isso é parte da parcela de risco do patrimônio, nunca da parcela de segurança.",
    relacionados: ["ethereum", "defi", "tokenizacao", "blockchain", "drex", "token", "stablecoin"],
  },
  {
    slug: "ethereum",
    termo: "Ethereum",
    sigla: "ETH",
    categoria: "Cripto e tecnologia",
    apelidos: ["ether", "ethers", "rede Ethereum", "Vitalik Buterin"],
    resumo:
      "A blockchain programável lançada em 2015, que permite rodar contratos inteligentes. Sua moeda é o ether. Desde setembro de 2022 funciona por prova de participação.",
    texto: [
      "Se o bitcoin é uma calculadora feita para uma coisa só, o dinheiro digital, o Ethereum é um computador mundial em que qualquer pessoa pode publicar programas, que rodam do mesmo jeito para todo mundo e não podem ser desligados por ninguém.",
      "Ethereum é a blockchain programável lançada em 30 de julho de 2015, que permite rodar contratos inteligentes. A moeda nativa da rede é o ether, usado para pagar as taxas de uso e como garantia dos validadores. Desde setembro de 2022, a rede funciona por prova de participação.",
      "Boa parte do que existe em cripto além do bitcoin, como stablecoins, finanças descentralizadas e tokenização, nasceu ou funciona sobre ele.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Vitalik Buterin, um programador russo-canadense que escrevia sobre bitcoin desde a adolescência, publicou a proposta no fim de 2013, aos 19 anos. A ideia era uma blockchain com uma linguagem de programação completa. Em 2014, o projeto levantou recursos numa venda pública de ether, e a rede entrou no ar em 2015.",
          "A história teve momentos decisivos. Em 2016, depois do ataque ao contrato The DAO, a rede foi alterada para devolver os recursos, e uma parte da comunidade manteve a versão antiga. Em 2021, uma mudança passou a queimar parte das taxas pagas, reduzindo a oferta. Em setembro de 2022, no evento chamado The Merge, a mineração foi substituída pela prova de participação, e o consumo de energia caiu mais de 99%.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Cada operação na rede consome uma quantidade de processamento, paga em ether. Quando a rede está congestionada, a taxa sobe, porque os usuários competem por espaço nos blocos. Parte da taxa é queimada, parte vai para os validadores.",
          "Para baratear o uso, surgiram redes de segunda camada, que processam muitas transações fora da rede principal e registram nela só o resumo. Uma atualização de 2024 reduziu bastante o custo para essas redes. A emissão de ether não tem um teto fixo como a do bitcoin: depende das recompensas aos validadores e de quanto é queimado em taxas.",
        ],
      },
      {
        titulo: "Como o mercado chegou até ele",
        paragrafos: [
          "Em julho de 2024, começaram a ser negociados nos Estados Unidos os ETFs de ether à vista, depois dos de bitcoin. Em 2026, a SEC incluiu o ether, ao lado do bitcoin, entre os exemplos de ativos digitais tratados como mercadorias, e não como valores mobiliários.",
          "O valor do ether está ligado ao uso da rede como infraestrutura: quanto mais aplicações, stablecoins e ativos tokenizados rodam ali, mais taxas e mais demanda pelo ativo. Isso o torna um ativo diferente do bitcoin, cuja tese é mais próxima de reserva de valor.",
        ],
      },
      {
        titulo: "Os riscos",
        paragrafos: [
          "O ether oscila muito, em geral mais que o bitcoin, e os dois costumam cair juntos em crises. A rede enfrenta concorrência de outras blockchains programáveis, mais rápidas ou mais baratas. E o sucesso das redes de segunda camada levanta uma dúvida sobre quanto do valor gerado chega, de fato, ao ether.",
        ],
      },
    ],
    exemplo:
      "Hipotético: ao trocar uma stablecoin por outra num protocolo de finanças descentralizadas, você paga uma taxa em ether à rede. Num dia calmo, ela custa centavos de dólar numa rede de segunda camada. Num dia de pânico no mercado, com milhares de pessoas tentando sair ao mesmo tempo, a mesma operação na rede principal pode custar dezenas de dólares. O preço do uso sobe justamente quando todos querem usar.",
    naPratica:
      "O ether é uma aposta na adoção de uma infraestrutura, com risco alto e oscilações grandes. Para quem está montando uma parcela em ativos digitais, ele não é um substituto do bitcoin, e sim uma tese diferente, que pode ou não fazer sentido ao lado dele. ETF, exchange ou carteira própria são formas diferentes de ter o mesmo ativo, cada uma com custos e riscos próprios.",
    relacionados: ["contrato-inteligente", "prova-de-participacao", "defi", "staking", "bitcoin", "stablecoin", "tokenizacao", "etf-de-bitcoin"],
  },
  {
    slug: "etf-de-bitcoin",
    termo: "ETF de bitcoin",
    categoria: "Cripto e tecnologia",
    apelidos: ["ETFs de bitcoin", "ETF de cripto", "ETFs de cripto", "ETFs de criptoativos", "ETF de criptoativos", "ETF à vista de bitcoin"],
    resumo:
      "Fundo negociado em bolsa que dá exposição ao bitcoin sem que o investidor precise lidar com carteira e chaves. Os primeiros à vista nos Estados Unidos foram aprovados em janeiro de 2024; na B3, existem desde 2021.",
    texto: [
      "Durante anos, ter bitcoin exigia aprender sobre exchanges, carteiras, chaves e frases de recuperação. Para muita gente, a barreira era essa, e não o preço. O ETF de bitcoin tirou a barreira: o ativo passou a caber no mesmo aplicativo da corretora em que você compra ações.",
      "ETF de bitcoin é um fundo negociado em bolsa que compra e guarda bitcoins, ou acompanha o preço deles, e emite cotas negociadas como uma ação. Para o investidor, a exposição vem pela corretora de sempre, sem carteira, chave privada ou exchange.",
      "Os primeiros ETFs de bitcoin à vista nos Estados Unidos foram aprovados em janeiro de 2024. Na B3, ETFs de criptoativos existem desde 2021.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Os pedidos para lançar um ETF de bitcoin nos Estados Unidos começaram em 2013 e foram negados pela SEC por anos, com o argumento de que o mercado à vista era sujeito a manipulação. Em 2021, a SEC aprovou ETFs que compram contratos futuros de bitcoin, não o ativo em si. No mesmo ano, o Canadá e o Brasil já tinham ETFs ligados ao bitcoin.",
          "A virada veio da Justiça. Em agosto de 2023, um tribunal federal de apelação considerou que a SEC não tinha justificado bem por que aprovava ETFs de futuros e negava os de bitcoin à vista. Em 10 de janeiro de 2024, a SEC aprovou onze ETFs à vista de uma vez, e a negociação começou no dia seguinte. Os ETFs de ether à vista vieram em julho de 2024.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Quando há demanda por cotas, grandes instituições entregam dinheiro ou bitcoins ao fundo e recebem cotas novas; quando há venda, o caminho é o inverso. Esse mecanismo mantém o preço da cota próximo do valor dos bitcoins que o fundo tem. Os bitcoins ficam com um custodiante, em geral uma instituição regulada especializada, em carteiras frias.",
          "O investidor paga uma taxa de administração anual, descontada do patrimônio do fundo, e os custos de negociação da bolsa. Nos Estados Unidos, a disputa entre gestoras levou as taxas de boa parte desses ETFs para perto de 0,25% ao ano.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "Um ETF de bitcoin na B3 é negociado em reais, regulado pela CVM e tributado como renda variável no Brasil: 15% sobre o lucro na venda, apurado mês a mês, sem a isenção de R$ 20 mil das ações. O preço da cota acompanha o bitcoin em dólar e o câmbio.",
          "Um ETF de bitcoin americano, comprado numa corretora lá fora, é negociado em dólar, entra na Lei 14.754, com 15% na declaração anual, e, por ser um fundo americano, conta como bem americano para o estate tax. A escolha muda imposto, sucessão e jurisdição, não o ativo de fundo.",
        ],
      },
      {
        titulo: "O que você troca ao escolher o ETF",
        paragrafos: [
          "Você troca o risco da autocustódia, de perder chaves ou cair num golpe, pelo risco do gestor e do custodiante do fundo, num ambiente regulado e auditado. Abre mão de usar o bitcoin como dinheiro, já que a cota não pode ser enviada a uma carteira. E aceita pagar uma taxa anual pela conveniência.",
          "Também aceita os horários da bolsa: o bitcoin negocia 24 horas, e a cota, só no pregão. Num fim de semana agitado, o preço da cota na segunda pode abrir longe do de sexta.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você compra R$ 10 mil em cotas de um ETF de bitcoin na B3. Num ano em que o bitcoin sobe 10% em dólar e o dólar sobe 2% contra o real, a cota sobe perto de 12% em reais, menos a taxa do fundo. Se o bitcoin cai 50% em dólar e o real se valoriza 5%, a cota cai mais de 50% em reais. A conveniência do ETF não muda nada no risco do ativo.",
    naPratica:
      "O ETF é a forma mais simples de ter exposição a bitcoin dentro de uma estrutura regulada, e combina bem com quem não quer lidar com chaves e carteiras. Compare taxa de administração, liquidez da cota, domicílio do fundo e tratamento tributário. E lembre que facilidade de compra não diminui a volatilidade: o tamanho da posição continua sendo a decisão mais importante.",
    relacionados: ["bitcoin", "etf", "autocustodia", "custodia", "ethereum", "taxa-de-administracao", "estate-tax", "lei-14754"],
  },
  {
    slug: "cbdc",
    termo: "Moeda digital de banco central",
    sigla: "CBDC",
    categoria: "Cripto e tecnologia",
    apelidos: ["CBDCs", "moedas digitais de banco central", "moeda digital do banco central", "real digital", "yuan digital", "euro digital"],
    resumo:
      "A versão digital da moeda oficial, emitida pelo próprio banco central. É diferente do bitcoin e das stablecoins: é dinheiro do Estado, só que em formato digital e programável.",
    texto: [
      "O dinheiro na sua conta bancária já é digital. Mas, a rigor, ele não é dinheiro do Banco Central: é uma dívida do seu banco com você. Só as cédulas e moedas no seu bolso são passivo direto do Banco Central. Uma CBDC seria a versão digital dessas cédulas.",
      "CBDC, sigla em inglês para moeda digital de banco central, é a moeda oficial de um país emitida em formato digital diretamente pelo banco central. É diferente do bitcoin, que não tem emissor, e das stablecoins, que são emitidas por empresas privadas. É dinheiro do Estado, com todo o poder e todo o risco que isso traz.",
      "Mais de cem bancos centrais estudaram o tema na última década. Pouquíssimos lançaram de fato.",
    ],
    secoes: [
      {
        titulo: "Os dois tipos",
        paragrafos: [
          "A CBDC de varejo seria usada por pessoas e empresas no dia a dia, como uma versão digital das cédulas, guardada em carteiras oferecidas pelo banco central ou por bancos. É a que mais gera debate, porque muda a relação entre cidadão, bancos e Estado.",
          "A CBDC de atacado seria usada só entre instituições financeiras, para liquidar operações entre elas, inclusive com ativos tokenizados. É menos visível e menos polêmica, e é para onde caminhou boa parte dos projetos.",
        ],
      },
      {
        titulo: "Quem fez o quê",
        paragrafos: [
          "As Bahamas lançaram a primeira CBDC de varejo em 2020. A Nigéria lançou a sua em 2021, com adoção baixa. A China testa o yuan digital desde 2020 em várias cidades. O Banco Central Europeu trabalha num euro digital, que depende de uma lei da União Europeia.",
          "Os Estados Unidos seguiram outro caminho. Em janeiro de 2025, uma ordem executiva proibiu agências federais de promover um dólar digital de varejo, e o país passou a apostar na regulação de stablecoins privadas, aprovada em lei em julho daquele ano. O Brasil começou com um projeto de real digital e mudou o desenho ao longo do caminho, no que virou o Drex.",
        ],
      },
      {
        titulo: "O debate",
        paragrafos: [
          "A favor, argumenta-se que uma CBDC pode baratear pagamentos, incluir quem não tem conta em banco e manter o dinheiro público relevante num mundo de pagamentos privados digitais.",
          "Contra, pesam a privacidade, já que o banco central poderia ver cada pagamento; o risco para os bancos, que poderiam perder depósitos numa crise se as pessoas corressem para a moeda do banco central; e a programabilidade. Um dinheiro que só pode ser gasto em certas coisas, ou que expira, é tecnicamente possível. Isso pode ser útil para políticas específicas e preocupante como ferramenta de controle.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um governo paga um benefício em moeda digital programada para ser gasta só com alimentos, num prazo de 90 dias, em estabelecimentos cadastrados. Para o objetivo do programa, é eficiente: o dinheiro chega ao destino pretendido. Para o cidadão, levanta perguntas: quem decide o que pode ser comprado, quem vê cada compra e o que impediria a mesma lógica de ser aplicada a outros pagamentos.",
    naPratica:
      "Uma CBDC continua sendo a moeda do país, com o mesmo banco central e o mesmo risco de inflação e de regra. Mudar o formato do dinheiro não diversifica nada. Para quem pensa em dolarizar parte do patrimônio, a questão não é se o real será digital, e sim quanto do patrimônio está exposto a uma única moeda e a uma única jurisdição.",
    relacionados: ["drex", "stablecoin", "banco-central", "pix", "tokenizacao", "funcoes-da-moeda", "senhoriagem"],
  },
  {
    slug: "drex",
    termo: "Drex",
    categoria: "Cripto e tecnologia",
    apelidos: ["piloto do Drex"],
    resumo:
      "O projeto do Banco Central para uma infraestrutura digital do real, nascido para usar blockchain e tokenização. Em 2025, o BC redesenhou o plano: a primeira entrega, prevista para 2026, fica restrita ao sistema financeiro e sem blockchain.",
    texto: [
      "Em 2023, o Banco Central apresentou com destaque o nome Drex: seria a plataforma do real digital, em que bancos emitiriam versões tokenizadas de depósitos e títulos públicos poderiam ser negociados com contratos inteligentes. Dois anos depois, o próprio Banco Central mudou o plano.",
      "Drex é o projeto do Banco Central para uma infraestrutura digital do real voltada ao sistema financeiro. Nasceu para usar blockchain e tokenização. Em 2025, foi redesenhado: a primeira entrega, prevista para 2026, ficou restrita a um problema concreto do mercado de crédito e sem uso de blockchain.",
      "Ao contrário do que muitas vezes se diz, o Drex nunca foi pensado como uma nova moeda para o cidadão gastar no dia a dia. É infraestrutura.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O Banco Central começou a estudar o real digital em 2020, no rastro do sucesso do Pix e do interesse mundial por moedas digitais de banco central. Em 2023, lançou um piloto com dezenas de instituições, organizadas em consórcios, para testar uma plataforma em que depósitos bancários tokenizados e títulos públicos federais circulariam entre participantes, com liquidação automática.",
          "O nome Drex foi apresentado em agosto de 2023. Em 2024, a segunda fase do piloto testou casos de uso com outros ativos, como crédito com garantia e imóveis.",
        ],
      },
      {
        titulo: "Por que mudou",
        paragrafos: [
          "Os testes esbarraram num problema difícil: conciliar a transparência de uma blockchain, em que os participantes enxergam o registro, com o sigilo bancário exigido por lei. As soluções de privacidade testadas não ficaram maduras o bastante para o Banco Central.",
          "Em 2025, o Banco Central anunciou a mudança de rota. A primeira fase do Drex passaria a focar em reconciliar informações sobre garantias de crédito entre instituições, para evitar que o mesmo bem seja dado em garantia mais de uma vez, sem usar a tecnologia de registro distribuído. A tokenização e o uso de blockchain ficaram para etapas futuras.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "No curto prazo, quase nada muda para o investidor pessoa física. No longo prazo, uma infraestrutura que permita negociar ativos tokenizados com liquidação automática pode baratear crédito, operações com títulos e, quem sabe, o acesso a ativos de fora.",
          "O caso também ensina sobre promessas tecnológicas: projetos de infraestrutura pública mudam de rumo quando encontram limites reais, e isso é sinal de prudência, não necessariamente de fracasso.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um carro dado como garantia num financiamento aparece como gravado para todos os bancos ao mesmo tempo, num registro compartilhado. Quando o dono tenta usá-lo como garantia de um segundo empréstimo em outro banco, o sistema avisa na hora. É esse tipo de problema, chato e caro para o sistema de crédito, que a primeira fase do Drex pretende resolver.",
    naPratica:
      "O Drex não muda o risco de ter o patrimônio em reais: é o mesmo real, com o mesmo Banco Central. Vale acompanhar porque pode, no futuro, baratear operações e o acesso a ativos tokenizados, mas não é motivo para comprar nem para vender nada hoje. E não confunda: nenhum token que alguém ofereça como Drex é produto do Banco Central para investidores.",
    relacionados: ["cbdc", "tokenizacao", "pix", "banco-central", "contrato-inteligente", "blockchain"],
  },
  {
    slug: "pix",
    termo: "Pix",
    categoria: "Cripto e tecnologia",
    apelidos: ["pagamento instantâneo", "pagamentos instantâneos"],
    resumo:
      "O sistema de pagamentos instantâneos do Banco Central, lançado em novembro de 2020. Transfere dinheiro em segundos, 24 horas por dia, e virou o meio de pagamento mais usado do Brasil.",
    texto: [
      "Às 23h de um domingo, você paga o encanador com um código QR no celular. O dinheiro cai na conta dele em segundos, sem tarifa. Em 2019, a mesma operação seria uma TED que só cairia na segunda, se feita em horário bancário, e quase sempre com custo.",
      "Pix é o sistema de pagamentos instantâneos criado pelo Banco Central, que entrou em funcionamento em 16 de novembro de 2020. Transfere dinheiro entre contas de qualquer instituição participante em segundos, 24 horas por dia, todos os dias do ano.",
      "Em poucos anos, virou o meio de pagamento mais usado do país em número de transações, à frente de cartões e boletos, e um caso estudado por bancos centrais do mundo inteiro.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O Banco Central construiu e opera a infraestrutura central, que liquida as transferências entre as instituições em tempo real, usando reservas que elas mantêm no próprio Banco Central. Bancos, fintechs e instituições de pagamento se conectam a ela e oferecem o serviço aos clientes.",
          "As chaves Pix, como CPF, celular ou e-mail, são apelidos para os dados da conta, guardados num diretório central. Para pessoas físicas, transferências e pagamentos são gratuitos na maior parte dos casos. Ao longo dos anos, vieram funções novas, como o Pix agendado, o Pix por aproximação e o Pix Automático, para pagamentos recorrentes.",
        ],
      },
      {
        titulo: "Por que deu certo",
        paragrafos: [
          "O Pix é um exemplo de infraestrutura pública digital: o Banco Central faz os trilhos e obriga as grandes instituições a participar, e o mercado constrói os serviços em cima. A adesão obrigatória dos maiores bancos garantiu, desde o primeiro dia, que quase todo mundo pudesse receber.",
          "A gratuidade para pessoas físicas, a facilidade das chaves e a rede de comércios que passaram a aceitar o código QR fizeram o resto. A adoção foi muito mais rápida que a de qualquer meio de pagamento anterior no Brasil.",
        ],
      },
      {
        titulo: "Os riscos",
        paragrafos: [
          "A velocidade que agrada o usuário também agrada o golpista. O Pix trouxe golpes de engenharia social, falsos parentes, falsas centrais de atendimento e sequestros relâmpago. O Banco Central respondeu com limites noturnos, prazos para aumento de limite e um mecanismo especial de devolução para casos de fraude, que não garante o ressarcimento, mas cria um caminho para tentar.",
          "Para quem usa Pix como porta de entrada para outros serviços, inclusive exchanges e contas globais, vale a regra de ouro: transferência feita é difícil de desfazer.",
        ],
      },
      {
        titulo: "Pix e dólar",
        paragrafos: [
          "O Pix é real, no sistema brasileiro. Muitas contas globais e plataformas de remessa usam o Pix para receber os reais que você quer converter, o que deixa o processo rápido. Mas a conversão em dólar continua sendo uma operação de câmbio, com IOF, contrato e as regras do Banco Central.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você quer mandar R$ 20 mil para a sua conta numa corretora americana. Abre o aplicativo da plataforma de remessa, informa a finalidade de investimento, vê o valor efetivo total e paga com Pix. Os reais chegam à plataforma em segundos. A partir daí, começa a operação de câmbio, com IOF de 1,1% e cotação da plataforma, e o dinheiro chega lá fora em um ou dois dias úteis. O Pix acelerou a primeira etapa, não a segunda.",
    naPratica:
      "O Pix mudou a forma de pagar no Brasil, não a moeda em que o seu patrimônio está. É uma conquista de infraestrutura que mostra o que o país consegue fazer bem, e ao mesmo tempo um lembrete de que tudo o que passa por ele está sob as regras brasileiras. Use a praticidade a seu favor para dolarizar com custo menor, sem confundir a velocidade do pagamento com proteção do patrimônio.",
    relacionados: ["banco-central", "drex", "cbdc", "remessa", "conta-global", "iof"],
  },
  {
    slug: "marco-legal-dos-criptoativos",
    termo: "Marco legal dos criptoativos",
    categoria: "Cripto e tecnologia",
    apelidos: ["Lei 14.478", "Lei 14.478/2022", "marco legal das criptomoedas", "regulação de cripto", "regras do Banco Central para cripto"],
    resumo:
      "A Lei 14.478, de dezembro de 2022, que criou as regras básicas para empresas de ativos virtuais no Brasil. O Banco Central foi escolhido como regulador e publicou as normas detalhadas em novembro de 2025, em vigor desde fevereiro de 2026.",
    texto: [
      "Até 2022, quem abria uma empresa de cripto no Brasil não precisava pedir licença a ninguém. Exchanges cresciam, guardavam bilhões de reais em ativos de clientes e não tinham um regulador definido. Quando algo dava errado, o cliente descobria que estava num território sem regras claras.",
      "O marco legal dos criptoativos é a Lei 14.478, de 21 de dezembro de 2022, que criou as regras básicas para as empresas que prestam serviços com ativos virtuais no Brasil, definiu o que é ativo virtual e criou um crime específico de fraude com esses ativos.",
      "A lei deixou para um regulador, escolhido por decreto, os detalhes. Em 2023, o escolhido foi o Banco Central, que publicou as normas em novembro de 2025. Elas estão em vigor desde 2 de fevereiro de 2026.",
    ],
    secoes: [
      {
        titulo: "O que a lei definiu",
        paragrafos: [
          "Ativo virtual é a representação digital de valor que pode ser negociada ou transferida por meios eletrônicos e usada para pagamentos ou investimento. Ficam fora, entre outros, a moeda nacional e as estrangeiras, os pontos de fidelidade e os valores mobiliários, que continuam com a CVM.",
          "Prestadora de serviços de ativos virtuais é a empresa que, em nome de terceiros, troca ativos virtuais por reais ou moedas estrangeiras, troca ativos entre si, transfere, custodia ou participa de ofertas. A lei passou a exigir autorização para funcionar e incluiu no Código Penal o crime de fraude com uso de ativos virtuais, além de colocar essas empresas nas regras contra lavagem de dinheiro.",
        ],
      },
      {
        titulo: "As regras do Banco Central",
        paragrafos: [
          "Em novembro de 2025, o Banco Central publicou três resoluções. A 519 trata da autorização das prestadoras. A 520 disciplina a prestação dos serviços, quem pode prestá-los e um novo tipo de instituição, a sociedade prestadora de serviços de ativos virtuais. A 521 liga o mundo cripto ao câmbio: pagamentos e transferências internacionais com ativos virtuais e a negociação de stablecoins passaram a integrar o mercado de câmbio.",
          "Entre os pontos centrais estão a exigência de autorização prévia, regras de governança, segurança e controles internos, proteção e transparência na relação com os clientes, prevenção à lavagem de dinheiro e um limite por operação para pagamentos internacionais com cripto quando a contraparte não é instituição autorizada a operar câmbio. A possibilidade de autocustódia foi mantida, com regras de identificação de carteiras em certas transferências.",
        ],
      },
      {
        titulo: "O que ainda está em aberto",
        paragrafos: [
          "A natureza jurídica das stablecoins está em discussão no Congresso, com o Banco Central defendendo tratá-las como moeda de emissão privada e associações do setor defendendo que continuem como ativos virtuais. A cobrança de IOF sobre operações com stablecoins também está em debate.",
          "Do lado da Receita, a nova declaração de criptoativos, a DeCripto, substituiu a regra antiga a partir de julho de 2026 e alinhou o Brasil ao padrão internacional de troca de informações sobre cripto.",
        ],
      },
    ],
    exemplo:
      "Hipotético: uma exchange estrangeira atende brasileiros pelo aplicativo, em português, sem autorização do Banco Central. Para o cliente, a tela é igual à de uma exchange autorizada. A diferença aparece num problema: lá, não há obrigação de seguir as regras brasileiras de proteção ao cliente, e uma disputa terá de ser resolvida sob outra lei, em outro país. Aqui, há um regulador a quem reclamar e regras que a empresa precisa cumprir para continuar funcionando.",
    naPratica:
      "A regulação dá mais segurança a quem usa intermediários no Brasil e aproxima as operações com cripto das regras de câmbio e de imposto. Cripto não é atalho para fugir delas. Para quem quer uma parcela em ativos digitais, a primeira pergunta passou a ser simples: a empresa é autorizada pelo Banco Central? A segunda continua a mesma: quem guarda as chaves?",
    relacionados: ["exchange", "stablecoin", "autocustodia", "token", "banco-central", "troca-automatica-de-informacoes", "marco-cambial"],
  },
  {
    slug: "internet",
    termo: "Internet",
    categoria: "Cripto e tecnologia",
    apelidos: ["rede mundial"],
    resumo:
      "A rede que liga computadores do mundo inteiro por protocolos comuns. Nasceu de projetos militares e acadêmicos nos Estados Unidos, nos anos 1960 e 1970, e chegou ao uso comercial no Brasil em 1995.",
    texto: [
      "Ninguém é dono da internet. Não há uma empresa, um governo ou um prédio central que a controle. Ela funciona porque milhões de redes diferentes, de universidades, empresas, operadoras e governos, aceitaram conversar seguindo as mesmas regras.",
      "A internet é essa rede de redes, que liga computadores do mundo inteiro por protocolos comuns, os TCP/IP. Sobre ela rodam serviços diferentes: a web, o e-mail, os aplicativos de mensagem, o streaming, os sistemas de pagamento e as blockchains.",
      "Nasceu de projetos militares e acadêmicos nos Estados Unidos, nos anos 1960 e 1970, e chegou ao uso comercial no Brasil em 1995. Trinta anos depois, é a infraestrutura sobre a qual funcionam bancos, bolsas, o Pix, as redes cripto e a inteligência artificial.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O começo foi a ARPANET, financiada pela agência de pesquisa do Departamento de Defesa americano, que ligou os primeiros computadores de universidades em 1969. Nos anos 1970, Vint Cerf e Bob Kahn desenharam os protocolos para interligar redes diferentes, e em 1983 a ARPANET os adotou como padrão.",
          "Por duas décadas, foi coisa de pesquisadores. Dois passos a levaram ao público: a abertura da rede ao uso comercial, concluída nos Estados Unidos em meados dos anos 1990, e a World Wide Web, criada por Tim Berners-Lee no CERN entre 1989 e 1991, que trouxe páginas e links clicáveis. No Brasil, a rede acadêmica chegou no fim dos anos 1980, e o acesso comercial começou em 1995.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Tudo o que trafega na internet é quebrado em pequenos pacotes, cada um com o endereço de origem e de destino. Roteadores espalhados pelo mundo encaminham esses pacotes pelo melhor caminho disponível, e o destino os remonta. Se um caminho cai, os pacotes usam outro.",
          "A rede em si é burra de propósito: só entrega pacotes. A inteligência fica nas pontas, nos aplicativos. Esse desenho permitiu que qualquer pessoa criasse um serviço novo sem pedir licença a ninguém, e é o motivo de a internet ter crescido tanto.",
        ],
      },
      {
        titulo: "Um caso real",
        paragrafos: [
          "Em agosto de 1995, a Netscape, dona do navegador mais usado da época, abriu o capital. A ação, vendida a US$ 28, fechou o primeiro dia a US$ 58,25. Começava a corrida das empresas de internet na bolsa. Cinco anos depois, em março de 2000, o índice Nasdaq chegou ao pico e, nos dois anos e meio seguintes, perdeu perto de 78%. Muitas empresas sumiram.",
          "Algumas sobreviveram e viraram as maiores do mundo. A tecnologia estava certa; muitos preços, não. A mesma internet que derrubou o mercado em 2000 criou, nas duas décadas seguintes, uma das maiores ondas de riqueza da história.",
        ],
      },
    ],
    exemplo:
      "A mensagem inaugural da ARPANET, enviada da Universidade da Califórnia em Los Angeles para o Instituto de Pesquisa de Stanford em 29 de outubro de 1969, era para ser a palavra login. O sistema caiu depois das duas primeiras letras. A primeira mensagem da história da rede foi, sem querer, lo. Meio século depois, a mesma lógica de pacotes leva o seu pedido de compra de um ETF de São Paulo a Nova York em frações de segundo.",
    naPratica:
      "As empresas que mais ganharam com a internet estão quase todas listadas fora do Brasil. É um exemplo de como transformações tecnológicas grandes podem acontecer longe da bolsa onde está o seu dinheiro. E a bolha de 2000 é a outra lição: estar certo sobre uma tecnologia não garante ganhar dinheiro com ela, sobretudo se o preço já embute todo o otimismo.",
    relacionados: ["arpanet", "tcp-ip", "world-wide-web", "inteligencia-artificial", "semicondutor", "bolha", "nasdaq"],
  },
  {
    slug: "arpanet",
    termo: "ARPANET",
    categoria: "Cripto e tecnologia",
    apelidos: ["comutação de pacotes"],
    resumo:
      "A primeira grande rede de computadores por comutação de pacotes, financiada pelo governo americano e inaugurada em 1969. É a avó da internet.",
    texto: [
      "Em 1957, a União Soviética pôs o Sputnik em órbita, e os Estados Unidos levaram um susto tecnológico. Uma das respostas foi criar, no ano seguinte, uma agência para financiar pesquisa de ponta no Departamento de Defesa, a ARPA. Uma década depois, ela financiou a rede que daria origem à internet.",
      "A ARPANET foi a primeira grande rede de computadores por comutação de pacotes, inaugurada em 1969 para ligar universidades e centros de pesquisa. É a avó da internet: testou na prática as ideias e os protocolos que viriam a ligar o mundo.",
      "O objetivo inicial era modesto: permitir que pesquisadores compartilhassem computadores caros e raros, sem precisar viajar até eles.",
    ],
    secoes: [
      {
        titulo: "Como funcionava",
        paragrafos: [
          "A inovação técnica foi a comutação de pacotes, pensada de forma independente por Paul Baran, nos Estados Unidos, e por Donald Davies, no Reino Unido, nos anos 1960. Em vez de abrir uma linha dedicada de ponta a ponta, como num telefonema, a mensagem é quebrada em pedaços que viajam por caminhos diferentes e são remontados no destino.",
          "Cada universidade ligada à rede tinha um pequeno computador dedicado a encaminhar os pacotes, construído por uma empresa de engenharia da região de Boston. Se uma linha ou um nó caísse, os pacotes procurariam outro caminho. A rede não tinha um ponto central cuja falha derrubasse tudo.",
        ],
      },
      {
        titulo: "A cronologia",
        paragrafos: [
          "Em 29 de outubro de 1969, a equipe de Leonard Kleinrock, na Universidade da Califórnia em Los Angeles, mandou a primeira mensagem para o Instituto de Pesquisa de Stanford. Em dezembro, eram quatro nós. Em 1971, Ray Tomlinson mandou o primeiro e-mail entre computadores diferentes e escolheu o arroba para separar o nome do usuário do nome da máquina.",
          "Ao longo dos anos 1970, a rede cresceu, ganhou ligações internacionais e serviu de laboratório para os protocolos TCP/IP, adotados em 1983. A ARPANET original foi desativada em 1990, quando outras redes, maiores, já tinham assumido o papel.",
        ],
      },
      {
        titulo: "Por que importa",
        paragrafos: [
          "A ARPANET é um exemplo clássico de pesquisa pública com financiamento de longo prazo que, décadas depois, virou uma indústria privada gigantesca. Nenhum dos envolvidos em 1969 previu o comércio eletrônico, as redes sociais ou os bancos digitais.",
          "É também um lembrete de humildade: o valor econômico de uma tecnologia raramente é visível no começo, e quase nunca vai para quem a inventou.",
        ],
      },
    ],
    exemplo:
      "Hipotético: uma carta de dez páginas enviada como dez envelopes separados, cada um por uma rota diferente, com o número da página no envelope. O destinatário reorganiza tudo na ordem. Se um carteiro se perde, só aquele envelope precisa ser reenviado. A ARPANET fazia isso com dados, em milissegundos, e a internet faz até hoje.",
    naPratica:
      "A ARPANET levou mais de 25 anos para virar um negócio de massa, e o dinheiro grande foi parar em empresas que nem existiam em 1969. É um motivo a mais para humildade com previsões sobre inteligência artificial e cripto: a direção pode estar certa, e o tempo, os vencedores e os preços, muito errados. Diversificar dentro de uma tese tecnológica é tão importante quanto escolher a tese.",
    relacionados: ["internet", "tcp-ip", "world-wide-web", "transistor", "diversificacao"],
  },
  {
    slug: "tcp-ip",
    termo: "TCP/IP",
    categoria: "Cripto e tecnologia",
    apelidos: ["protocolo TCP/IP", "protocolos TCP/IP", "protocolo IP", "endereço IP"],
    resumo:
      "O conjunto de regras que permite que redes diferentes conversem entre si e que os dados cheguem inteiros ao destino. É a língua comum da internet desde 1983.",
    texto: [
      "Nos anos 1970, havia várias redes de computadores, cada uma com a sua língua: a ARPANET, redes de rádio, redes por satélite. Um computador de uma não conseguia falar com outro de outra. Faltava um idioma comum.",
      "TCP/IP é o conjunto de regras que resolveu isso. O IP dá um endereço a cada máquina e encaminha os pacotes de dados de rede em rede até o destino. O TCP confere se todos os pacotes chegaram, na ordem certa, e pede de novo o que se perdeu. Juntos, são a língua comum da internet desde 1983.",
      "Quase tudo o que você faz on-line, de abrir um site a mandar uma ordem de compra para a corretora, passa por eles.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1974, Vint Cerf e Bob Kahn publicaram o desenho de um protocolo para interligar redes diferentes. A ideia central era não exigir que as redes mudassem por dentro: bastava que todas aceitassem encaminhar pacotes num formato comum, com endereços comuns. O protocolo foi depois dividido em duas partes, o TCP e o IP.",
          "Em 1º de janeiro de 1983, a ARPANET adotou o TCP/IP como padrão obrigatório, numa virada combinada com antecedência. A partir daí, qualquer rede que falasse essa língua podia se ligar às outras. Nascia a internet como rede de redes. No mesmo período, surgiu o sistema de nomes que traduz endereços numéricos em nomes legíveis, como os de sites.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Pense em camadas. Na de baixo, cabos, fibras e ondas de rádio. Acima, o IP, que só sabe entregar pacotes a um endereço, sem garantia. Acima dele, o TCP, que numera os pacotes, confere a chegada e reenvia o que faltou. No topo, os aplicativos: navegador, e-mail, aplicativo do banco.",
          "Cada camada ignora os detalhes das outras. Por isso o mesmo navegador funciona no wi-fi, no 5G e na fibra, e um aplicativo novo pode ser criado sem mexer em nada da rede.",
        ],
      },
      {
        titulo: "Por que venceu",
        paragrafos: [
          "Nos anos 1980, governos e grandes empresas de telecomunicação apoiavam um padrão concorrente, mais completo e mais formal, desenhado por comitês internacionais. O TCP/IP venceu por ser simples, já estar funcionando e ser aberto: qualquer um podia implementar sem pagar licença.",
          "O sucesso trouxe problemas que só apareceram com a escala. A versão original do IP tem pouco mais de 4 bilhões de endereços, e eles se esgotaram na década de 2010. A versão nova, com uma quantidade praticamente ilimitada, convive com a antiga até hoje.",
        ],
      },
    ],
    exemplo:
      "Cada vez que você abre o site da corretora, o seu aparelho descobre o endereço IP do servidor, divide o pedido em pacotes e os envia. Alguns pacotes podem ir por São Paulo, outros por Miami. Se um se perde, o TCP percebe a falta e pede de novo. Em milésimos de segundo, a página chega inteira, e você nem nota que parte dela fez uma volta maior.",
    naPratica:
      "Protocolos abertos criaram mercados gigantes para quem construiu em cima deles, e quase nada para quem os inventou. As redes públicas de blockchain tentam repetir essa lógica com dinheiro e registro de ativos: um protocolo aberto, sobre o qual qualquer um constrói serviços. Se vão chegar à mesma escala, e quem vai capturar o valor, ainda está em aberto.",
    relacionados: ["internet", "arpanet", "world-wide-web", "blockchain", "bitcoin"],
  },
  {
    slug: "world-wide-web",
    termo: "World Wide Web",
    sigla: "WWW",
    categoria: "Cripto e tecnologia",
    apelidos: ["Web", "Tim Berners-Lee", "hipertexto"],
    resumo:
      "O sistema de páginas ligadas por links que roda sobre a internet, criado por Tim Berners-Lee no CERN entre 1989 e 1991. Foi o que levou a internet dos laboratórios para o público.",
    texto: [
      "Internet e web não são a mesma coisa. A internet é a rede, os cabos e os protocolos que levam dados de um lugar a outro. A web é um dos serviços que rodam sobre ela, como o e-mail: o sistema de páginas ligadas por links que você abre no navegador.",
      "A World Wide Web foi criada pelo físico britânico Tim Berners-Lee no CERN, o laboratório europeu de física de partículas, na Suíça, entre 1989 e 1991. Foi ela que levou a internet dos laboratórios para o público.",
      "Uma decisão tomada em 1993, a de liberar a tecnologia sem cobrança de licença, ajudou a criar uma das maiores ondas de riqueza da história.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O CERN tinha milhares de pesquisadores de vários países, com documentos espalhados em computadores incompatíveis. Em março de 1989, Berners-Lee propôs um sistema para organizar essa informação com documentos ligados por links. O chefe dele anotou na capa da proposta: vago, mas empolgante.",
          "Ele criou os três ingredientes que usamos até hoje: o endereço de cada página, a linguagem para escrevê-la e o protocolo para buscá-la. O primeiro servidor e o primeiro navegador funcionaram no fim de 1990, e em 1991 o projeto foi aberto ao mundo. Em 30 de abril de 1993, o CERN declarou a tecnologia de domínio público.",
        ],
      },
      {
        titulo: "Como virou meio de massa",
        paragrafos: [
          "Em 1993, um navegador gráfico criado numa universidade americana permitiu ver imagens junto com o texto e clicar com o mouse. Um dos autores fundou no ano seguinte a Netscape, cuja abertura de capital, em 1995, marcou o começo da corrida das empresas de internet na bolsa.",
          "Com a web, vieram o comércio eletrônico, os buscadores, os portais, os bancos pela internet e, depois, as redes sociais e as plataformas. Berners-Lee recebeu em 2016 o Prêmio Turing, a maior distinção da computação.",
        ],
      },
      {
        titulo: "Por que importa",
        paragrafos: [
          "A web é o exemplo mais claro de como um padrão aberto pode gerar valor muito maior do que um produto fechado. Se o CERN tivesse cobrado licença, sistemas concorrentes e proprietários talvez tivessem dominado, e a história seria outra.",
          "O valor, porém, não ficou com quem criou o padrão. Ficou com as empresas que construíram serviços em cima dele e conquistaram escala: buscadores, lojas, plataformas de anúncios. Muitas delas estão hoje entre as maiores empresas do mundo.",
        ],
      },
    ],
    exemplo:
      "Toda vez que você clica num link e vai de uma página a outra, mesmo em servidores de países diferentes, está usando a ideia de 1989. Hipotético: ao pesquisar um ETF, você sai do site de notícias, vai à página da gestora em Nova York, abre o documento do fundo hospedado na Irlanda e volta à corretora no Brasil, em quatro cliques. Para o seu navegador, é tudo a mesma teia.",
    naPratica:
      "A onda de riqueza criada pela web se concentrou em empresas que hoje pesam muito nos índices globais e quase nada na bolsa brasileira. Para quem investe só na B3, essa transformação passou praticamente ao largo. É um dos argumentos do curso para olhar além do mercado local: as grandes mudanças tecnológicas costumam ter os seus vencedores listados em outro lugar.",
    relacionados: ["internet", "tcp-ip", "arpanet", "inteligencia-artificial", "home-bias", "bolha"],
  },
  {
    slug: "transistor",
    termo: "Transistor",
    categoria: "Cripto e tecnologia",
    apelidos: ["transistores", "circuito integrado", "circuitos integrados"],
    resumo:
      "A chave eletrônica microscópica que liga e desliga a passagem de corrente. Inventado em 1947, é a célula básica de todo chip. Um processador moderno tem dezenas de bilhões deles.",
    texto: [
      "O ENIAC, um dos primeiros computadores eletrônicos, ficou pronto em 1945. Ocupava uma sala, pesava cerca de 30 toneladas e usava quase 18 mil válvulas, que esquentavam e queimavam com frequência. Um celular de hoje faz bilhões de vezes mais com um chip menor que uma unha. A diferença tem nome: transistor.",
      "Transistor é uma chave eletrônica que liga e desliga, ou amplifica, a passagem de corrente, sem partes móveis. Inventado em 1947, é a célula básica de todo chip. Combinando bilhões deles, faz-se de uma calculadora a um modelo de inteligência artificial.",
      "Os maiores chips de inteligência artificial de hoje passam de 200 bilhões de transistores.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em dezembro de 1947, nos Laboratórios Bell, nos Estados Unidos, John Bardeen e Walter Brattain demonstraram o primeiro transistor, feito de germânio. Pouco depois, William Shockley, o chefe do grupo, criou uma versão mais prática. Os três dividiram o Prêmio Nobel de Física de 1956.",
          "Shockley foi para a Califórnia e abriu uma empresa de semicondutores. Em 1957, oito dos seus engenheiros saíram para fundar a Fairchild Semiconductor. De lá sairiam, depois, a Intel e dezenas de outras empresas. O Vale do Silício nasceu desse racha.",
        ],
      },
      {
        titulo: "Do transistor ao chip",
        paragrafos: [
          "O passo seguinte foi pôr vários transistores e as ligações entre eles numa única peça de material semicondutor. Jack Kilby, da Texas Instruments, demonstrou o circuito integrado em 1958, e Robert Noyce, da Fairchild, chegou meses depois a uma versão em silício mais fácil de fabricar.",
          "Em 1971, a Intel lançou o 4004, o primeiro microprocessador comercial, com 2.300 transistores. Desde então, a indústria encolheu os transistores sem parar. Quanto menores, mais cabem num chip, mais rápido ele fica e menos energia gasta por operação.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Um transistor tem três terminais. Uma pequena tensão aplicada num deles controla se a corrente passa ou não entre os outros dois. Ligado ou desligado, um ou zero: é o bit, a unidade de toda a computação digital.",
          "Combinando transistores, fazem-se portas lógicas, que fazem contas simples; combinando portas, fazem-se somadores, memórias e processadores inteiros. A complexidade do chip vem da quantidade e da organização, não da sofisticação de cada peça.",
        ],
      },
    ],
    exemplo:
      "Hipotético, para ter a escala: se cada transistor de um chip moderno de IA fosse do tamanho de um grão de arroz, o chip cobriria perto de 3 quilômetros quadrados, algo como 400 campos de futebol. Na realidade, os 200 bilhões de transistores cabem numa peça de alguns centímetros, fabricada em poucas fábricas do mundo, com máquinas que custam centenas de milhões de dólares cada.",
    naPratica:
      "Toda a cadeia que vai do transistor ao chip de inteligência artificial está concentrada em poucas empresas e poucos países, quase nenhum deles representado na bolsa brasileira. Para quem quer participar dessa história, o caminho passa pelo exterior, sabendo que é um setor cíclico, intensivo em capital e sujeito a disputas geopolíticas.",
    relacionados: ["semicondutor", "lei-de-moore", "gpu", "inteligencia-artificial", "arpanet", "data-center"],
  },
  {
    slug: "semicondutor",
    termo: "Semicondutor",
    categoria: "Cripto e tecnologia",
    apelidos: ["semicondutores", "chip", "chips", "silício", "indústria de semicondutores", "fabricação de chips"],
    resumo:
      "Material que conduz eletricidade de forma controlável, como o silício, e, por extensão, a indústria dos chips feitos com ele. É a matéria-prima da computação, da inteligência artificial e de quase toda a eletrônica.",
    texto: [
      "Em 2021, montadoras do mundo inteiro, inclusive no Brasil, pararam linhas de produção. Não faltava aço, nem borracha, nem gente. Faltavam chips de poucos dólares, que controlam desde o vidro elétrico até a injeção de combustível. Um componente minúsculo travou a produção de um bem de dezenas de milhares de dólares.",
      "Semicondutor é um material que conduz eletricidade de forma controlável, como o silício, e, por extensão, o nome da indústria que fabrica chips com ele. É a matéria-prima da computação, da inteligência artificial, dos celulares, dos carros e de quase toda a eletrônica.",
      "Também virou um dos assuntos mais estratégicos da geopolítica, porque a produção dos chips mais avançados está concentrada em pouquíssimos lugares.",
    ],
    secoes: [
      {
        titulo: "Como funciona a indústria",
        paragrafos: [
          "Um semicondutor fica entre o condutor, como o cobre, e o isolante, como o vidro. Adicionando impurezas em pontos precisos, dá para controlar onde e quando ele conduz, e é isso que permite construir transistores. O silício é o mais usado e deu nome ao Vale do Silício.",
          "A cadeia tem etapas muito diferentes. Há empresas que só desenham chips, sem fábrica própria, como a Nvidia. Há as fundições, que fabricam para os outros, como a TSMC, de Taiwan, fundada em 1987 e responsável pela maior parte dos chips mais avançados do mundo. Há fabricantes de equipamentos, como a holandesa ASML, única fornecedora das máquinas de litografia mais avançadas. E há quem faz memória, encapsula, testa e fornece materiais.",
        ],
      },
      {
        titulo: "Os números da escala",
        paragrafos: [
          "Uma fábrica de ponta custa dezenas de bilhões de dólares e leva anos para ficar pronta. As máquinas de litografia mais avançadas, que desenham circuitos com luz ultravioleta extrema, custam centenas de milhões de dólares cada.",
          "Essa barreira de entrada explica a concentração: poucas empresas conseguem acompanhar o ritmo de investimento, e cada nova geração de chips concentra ainda mais a produção nas mesmas mãos.",
        ],
      },
      {
        titulo: "A geopolítica",
        paragrafos: [
          "Em 2022, os Estados Unidos aprovaram uma lei com dezenas de bilhões de dólares em subsídios para fábricas de chips no próprio território e passaram a restringir a exportação de chips avançados e de equipamentos para a China. Europa, Japão, Coreia do Sul e a própria China lançaram programas parecidos.",
          "Para o investidor, isso significa que o setor responde não só a ciclos de demanda, mas também a decisões de governo, tarifas e tensões entre países, em especial em torno de Taiwan.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um investidor brasileiro que, em 2015, quisesse participar do crescimento dos chips usados em inteligência artificial não encontraria quase nada na B3. As empresas do setor, de quem desenha a quem fabrica e a quem faz as máquinas, estão listadas nos Estados Unidos, em Taiwan, na Holanda, na Coreia do Sul e no Japão. Só uma carteira com exposição internacional alcançava essa tese.",
    naPratica:
      "Na aula, Felippe Hermes e Rodolfo Bastos lembram que chips, semicondutores e inteligência artificial quase não existem na B3. Quem quer exposição a esses setores precisa olhar para fora, sabendo que eles também são concentrados, cíclicos e sujeitos a riscos geopolíticos. Exposição a tecnologia ganha com diversificação dentro dela, por índice ou por um conjunto amplo de empresas, em vez de uma aposta única.",
    relacionados: ["transistor", "lei-de-moore", "gpu", "inteligencia-artificial", "data-center", "home-bias", "risco-de-concentracao"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "13:04" }, { modulo: 0, aula: 4, tempo: "14:31" }],
  },
  {
    slug: "lei-de-moore",
    termo: "Lei de Moore",
    categoria: "Cripto e tecnologia",
    apelidos: ["Gordon Moore"],
    resumo:
      "A observação de Gordon Moore, em 1965, de que o número de transistores num chip dobrava em intervalos regulares. Revista em 1975 para a cada dois anos, guiou o ritmo da indústria por cinco décadas.",
    texto: [
      "Em 1965, um químico de 36 anos foi convidado por uma revista de eletrônica a prever o que aconteceria com os chips nos dez anos seguintes. Ele olhou para os poucos dados que tinha e notou um padrão: o número de componentes num chip vinha dobrando a cada ano. Gordon Moore apostou que continuaria assim.",
      "A Lei de Moore é essa observação: o número de transistores que cabem num chip dobra em intervalos regulares. Em 1975, Moore ajustou o ritmo para a cada dois anos. Por cinco décadas, a indústria cumpriu a previsão, mais ou menos à risca.",
      "Não é uma lei da física. É uma meta que a indústria transformou em calendário, investindo bilhões para acompanhá-la.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Moore escreveu o artigo em 1965, quando trabalhava na Fairchild Semiconductor. Três anos depois, fundou a Intel com Robert Noyce. O primeiro microprocessador da empresa, de 1971, tinha 2.300 transistores.",
          "A previsão virou referência para toda a cadeia. Fabricantes de chips, de equipamentos e de software planejavam os seus produtos contando com a próxima geração no prazo. A lei se cumpria, em parte, porque todos agiam como se ela fosse se cumprir.",
        ],
      },
      {
        titulo: "Como funciona o ganho",
        paragrafos: [
          "Transistores menores cabem em maior número no mesmo espaço, gastam menos energia e mudam de estado mais rápido. Por décadas, encolher os transistores trazia tudo isso ao mesmo tempo: chips mais rápidos, mais baratos por operação e mais eficientes.",
          "Em meados dos anos 2000, uma parte do ganho acabou: os chips pararam de ficar mais rápidos só por encolher, porque esquentavam demais. A indústria passou a colocar vários processadores no mesmo chip e, depois, a criar chips especializados para tarefas específicas, como os gráficos e a inteligência artificial.",
        ],
      },
      {
        titulo: "O ritmo hoje",
        paragrafos: [
          "Desde os anos 2010, o ritmo desacelerou. Os transistores chegaram perto de limites físicos, medidos em poucas dezenas de átomos, e o custo das fábricas explodiu. Cada nova geração custa mais e entrega um ganho proporcionalmente menor.",
          "O desempenho continua crescendo, mas por outros caminhos: chips empilhados, vários chips num mesmo pacote, arquiteturas especializadas e software otimizado. Para a inteligência artificial, a capacidade de computação usada no treinamento dos maiores modelos cresceu muito mais rápido que a Lei de Moore, à custa de usar mais chips e mais energia.",
        ],
      },
    ],
    exemplo:
      "Dobrar a cada dois anos por 50 anos significa dobrar 25 vezes, o que multiplica o ponto de partida por mais de 30 milhões. É a distância entre os 2.300 transistores do primeiro microprocessador da Intel, de 1971, e as dezenas de bilhões dos chips de hoje. Hipotético, em dinheiro: R$ 1 que dobrasse a cada dois anos por 50 anos viraria mais de R$ 33 milhões.",
    naPratica:
      "Crescimento exponencial de capacidade não se traduz automaticamente em lucro para todas as empresas do setor. Muitos fabricantes que lideraram uma geração ficaram para trás na seguinte, e a própria Intel perdeu a liderança de fabricação para a TSMC. Exposição a tecnologia ganha com diversificação dentro dela, e com a consciência de que o vencedor de uma década pode não ser o da próxima.",
    relacionados: ["transistor", "semicondutor", "gpu", "inteligencia-artificial", "juros-compostos", "data-center"],
  },
  {
    slug: "gpu",
    termo: "Unidade de processamento gráfico",
    sigla: "GPU",
    categoria: "Cripto e tecnologia",
    apelidos: ["GPUs", "placa de vídeo", "placas de vídeo", "processador gráfico", "Nvidia", "CUDA"],
    resumo:
      "Processador com milhares de núcleos que fazem contas em paralelo. Criado para os gráficos dos videogames, virou o motor do treinamento de inteligência artificial.",
    texto: [
      "Por duas décadas, as placas de vídeo eram coisa de quem jogava videogame no computador. Em 2012, três pesquisadores de Toronto treinaram uma rede neural em duas dessas placas, compradas em loja, e venceram com folga a principal competição de reconhecimento de imagens do mundo. Começava ali a mudança que transformaria um fabricante de placas de jogos numa das empresas mais valiosas do planeta.",
      "GPU, sigla em inglês para unidade de processamento gráfico, é um processador com milhares de núcleos simples que fazem contas em paralelo. Foi criado para desenhar os gráficos dos jogos e virou o motor do treinamento e do uso de inteligência artificial.",
      "Hoje, GPUs para data centers estão entre os produtos mais disputados da tecnologia, com fila de espera, restrição de exportação e preço de dezenas de milhares de dólares por unidade.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O processador comum, a CPU, é como um chef muito habilidoso que faz tarefas complexas, uma de cada vez, muito rápido. A GPU é como uma cozinha com milhares de ajudantes fazendo tarefas simples ao mesmo tempo. Para desenhar milhões de pixels de uma tela, cada um com uma conta parecida, a segunda ganha de longe.",
          "Uma rede neural é, no fundo, uma montanha de multiplicações de números organizadas em tabelas. O mesmo tipo de conta que desenha os gráficos de um jogo. Por isso a GPU, desenhada para os jogos, serviu tão bem para a inteligência artificial.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "A Nvidia foi fundada em 1993 e, em 1999, passou a chamar de GPU a sua placa que fazia sozinha boa parte do trabalho gráfico. Em 2006, lançou o CUDA, uma plataforma que permitia programar as placas para cálculos gerais, e não só para gráficos. Pesquisadores de física, biologia e finanças começaram a usar.",
          "Depois da vitória da rede neural de 2012, o aprendizado profundo passou a depender de GPUs, e o CUDA virou o padrão de fato da área. Com a explosão da inteligência artificial generativa, a partir de 2022, a demanda por GPUs de data center disparou. Em outubro de 2025, a Nvidia se tornou a primeira empresa a valer US$ 5 trilhões em bolsa, mais do que todas as empresas da B3 somadas.",
        ],
      },
      {
        titulo: "A disputa",
        paragrafos: [
          "A liderança atrai concorrentes. Outros fabricantes de chips oferecem GPUs rivais, e as grandes empresas de nuvem desenvolvem chips próprios, especializados em inteligência artificial, para depender menos de um único fornecedor. Os Estados Unidos restringem a venda das GPUs mais avançadas para a China, o que mexe com a receita das empresas e estimula a China a desenvolver as suas.",
          "Para o investidor, isso significa um setor com crescimento muito alto, margens excepcionais e, ao mesmo tempo, riscos de concorrência, de ciclo de investimento e de política.",
        ],
      },
    ],
    exemplo:
      "Hipotético: treinar um modelo de linguagem grande exige trilhões de multiplicações por segundo, durante semanas. Numa CPU comum, a tarefa levaria décadas. Num aglomerado de milhares de GPUs ligadas em rede, leva semanas, consumindo eletricidade suficiente para abastecer milhares de casas. É por isso que a corrida da IA virou também uma corrida por chips e por energia.",
    naPratica:
      "A corrida da IA criou um dos setores mais concentrados e voláteis da bolsa americana, e quase nada dele existe na B3. Ter exposição a ele, por um índice amplo ou por um fundo setorial, é uma forma de participar de uma tese que o mercado brasileiro não oferece. Também é assumir o risco do outro lado: poucos nomes pesando muito nos índices, preços que embutem muito otimismo e quedas fortes quando a expectativa muda.",
    relacionados: ["semicondutor", "aprendizado-profundo", "inteligencia-artificial", "data-center", "lei-de-moore", "risco-de-concentracao", "sp-500"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "13:04" }, { modulo: 0, aula: 4, tempo: "8:05" }],
  },
  {
    slug: "data-center",
    termo: "Data center",
    categoria: "Cripto e tecnologia",
    apelidos: ["data centers", "centro de dados", "centros de dados", "computação em nuvem", "hyperscalers"],
    resumo:
      "Prédio cheio de servidores, cabos e sistemas de refrigeração onde rodam a nuvem, os aplicativos e os modelos de inteligência artificial. Consome muita energia e virou um dos maiores destinos de investimento da tecnologia.",
    texto: [
      "Quando você guarda uma foto na nuvem, assiste a uma série ou faz uma pergunta a um assistente de inteligência artificial, a palavra nuvem engana. O trabalho acontece num lugar bem físico: um galpão com milhares de servidores, quilômetros de cabos, geradores a diesel de reserva e sistemas de refrigeração que funcionam sem parar.",
      "Data center é esse prédio: a instalação onde ficam os servidores, o armazenamento e a rede que fazem funcionar a internet, os aplicativos, os bancos digitais e os modelos de inteligência artificial.",
      "Com a corrida da IA, data centers viraram um dos maiores destinos de investimento do mundo, e um dos maiores consumidores novos de eletricidade.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Empresas sempre tiveram salas de servidores. A mudança veio com a computação em nuvem: em 2006, a Amazon passou a alugar armazenamento e processamento pagos por uso. Em vez de comprar servidores, as empresas passaram a alugar capacidade de grandes operadores, que construíram data centers gigantes pelo mundo.",
          "A partir de 2022, a inteligência artificial generativa mudou a escala. Data centers para IA são cheios de GPUs, que consomem e esquentam muito mais que servidores comuns. Os maiores operadores passaram a investir, juntos, centenas de bilhões de dólares por ano em novas instalações.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Um data center precisa de quatro coisas em abundância: energia confiável, refrigeração, conectividade e terreno. A localização é escolhida pela proximidade de linhas de transmissão e de usinas, pelo clima, pela disponibilidade de água para resfriamento e pelas leis locais.",
          "Por dentro, tudo é redundante: duas fontes de energia, baterias, geradores e rotas de rede alternativas, para que uma falha não derrube o serviço. Num data center de IA, os chips ficam tão quentes que muitos passaram a usar resfriamento com líquido direto nos processadores.",
        ],
      },
      {
        titulo: "A cadeia por trás",
        paragrafos: [
          "A tese envolve muito mais do que empresas de software: fabricantes de chips e de equipamentos de rede, empresas de energia e de transmissão, fornecedores de sistemas de refrigeração, construtoras e fundos imobiliários especializados em data centers, que alugam os prédios às empresas de tecnologia.",
          "A energia virou o gargalo. Empresas de tecnologia passaram a fechar contratos de longo prazo com geradores, inclusive nucleares, e uma usina nuclear desativada nos Estados Unidos ganhou um acordo para voltar a funcionar e abastecer data centers.",
        ],
      },
      {
        titulo: "Os riscos",
        paragrafos: [
          "Investimento pesado em infraestrutura costuma vir em ondas, e ondas às vezes passam do ponto. Se a demanda por IA crescer menos que o previsto, parte da capacidade pode ficar ociosa, como aconteceu com a fibra óptica depois da bolha de 2000. Há ainda o risco regulatório, ligado ao consumo de energia e de água.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um data center grande para treinar modelos de IA pode demandar tanta eletricidade quanto uma cidade média. Se uma empresa de tecnologia anuncia dez instalações assim nos próximos anos, ela precisa garantir a energia antes de construir. Por isso contratos de energia de 20 anos, usinas dedicadas e linhas de transmissão novas viraram parte da estratégia das empresas de tecnologia.",
    naPratica:
      "A infraestrutura física da IA é uma tese de investimento que atravessa vários setores, de chips a energia e imóveis. Quase todos esses setores, na escala global, estão fora da bolsa brasileira. Quem quiser participar precisa olhar para fora e, de preferência, de forma diversificada, porque ondas de investimento em infraestrutura costumam ter vencedores e perdedores bem diferentes do que se imaginava no início.",
    relacionados: ["gpu", "inteligencia-artificial", "semicondutor", "internet", "reit", "bolha"],
  },
  {
    slug: "inteligencia-artificial",
    termo: "Inteligência artificial",
    sigla: "IA",
    categoria: "Cripto e tecnologia",
    apelidos: ["inteligências artificiais", "IA generativa", "inteligência artificial generativa", "ChatGPT"],
    resumo:
      "O campo que busca fazer máquinas executarem tarefas que exigiriam inteligência humana, como entender linguagem, reconhecer imagens e decidir. Ganhou escala a partir de 2012 e chegou ao grande público com a IA generativa, em 2022.",
    texto: [
      "Em novembro de 2022, uma empresa americana abriu ao público um assistente de conversa na internet. Em poucas semanas, milhões de pessoas estavam pedindo a ele que escrevesse e-mails, resumisse documentos, explicasse conceitos e corrigisse código. A inteligência artificial, um campo com setenta anos de história, virou assunto de mesa de jantar.",
      "Inteligência artificial é o campo que busca fazer máquinas executarem tarefas que exigiriam inteligência humana, como entender e produzir linguagem, reconhecer imagens, planejar e decidir. Hoje, quase toda a IA que funciona de verdade vem do aprendizado de máquina: sistemas que aprendem padrões a partir de dados, em vez de seguirem regras escritas à mão.",
      "Para o investidor, a IA é ao mesmo tempo uma transformação tecnológica, uma corrida de investimentos de centenas de bilhões de dólares por ano e um teste de paciência para quem lembra de outras ondas de euforia.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1950, Alan Turing propôs um jogo para testar se uma máquina conversa como gente. Em 1955, quatro pesquisadores escreveram a proposta de um encontro de verão na faculdade de Dartmouth, realizado em 1956, que deu nome ao campo. O otimismo era enorme: achava-se que máquinas inteligentes estavam a uma geração de distância.",
          "Não estavam. Os sistemas baseados em regras escritas à mão funcionavam em problemas estreitos e falhavam no mundo real. O campo viveu dois longos invernos, nos anos 1970 e no fim dos anos 1980, com cortes de verbas e descrédito. Houve marcos pelo caminho, como a vitória de um computador sobre o campeão mundial de xadrez em 1997, mas baseados mais em força bruta do que em aprendizado.",
        ],
      },
      {
        titulo: "A virada",
        paragrafos: [
          "A virada veio do aprendizado de máquina, com três ingredientes que se juntaram na década de 2010: muitos dados, graças à internet; muito poder de computação barato, graças às GPUs; e redes neurais profundas. Em 2012, uma rede neural venceu com folga a principal competição de reconhecimento de imagens. Em 2016, um programa venceu Lee Sedol, um dos maiores jogadores de go do mundo, num jogo de tabuleiro muito mais complexo que o xadrez.",
          "Em 2017, pesquisadores do Google publicaram a arquitetura transformer, que abriu caminho para os grandes modelos de linguagem. O lançamento do ChatGPT, em 2022, levou a IA generativa, que escreve, resume, programa e cria imagens, ao uso de massa. Em 2024, o Nobel de Física premiou pioneiros das redes neurais, e metade do de Química foi para os criadores de um sistema de IA que prevê a estrutura de proteínas.",
        ],
      },
      {
        titulo: "A corrida dos investimentos",
        paragrafos: [
          "A IA moderna é cara. Treinar e operar os maiores modelos exige chips especializados, data centers e energia em escala industrial. As grandes empresas de tecnologia passaram a investir centenas de bilhões de dólares por ano nessa infraestrutura, e os fornecedores de chips viraram algumas das empresas mais valiosas do mundo.",
          "A pergunta que o mercado faz é se a receita gerada pela IA vai justificar esse investimento, e quando. A história da tecnologia mostra os dois desfechos: a internet transformou a economia e, no meio do caminho, a bolha de 2000 destruiu boa parte do valor de quem pagou caro cedo demais.",
        ],
      },
      {
        titulo: "No Brasil e lá fora",
        paragrafos: [
          "As empresas que mais investem e mais faturam com IA, dos chips às plataformas, estão listadas quase todas nos Estados Unidos e em alguns mercados da Ásia. Na bolsa brasileira, a tese praticamente não existe como setor. Empresas brasileiras usam IA para ganhar eficiência, mas não são as fornecedoras da tecnologia.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um escritório que levava uma semana para revisar mil contratos passa a fazer uma primeira triagem em horas, com um modelo de linguagem marcando as cláusulas fora do padrão para um advogado conferir. O ganho é real. Mas, para o investidor, a pergunta é outra: quem fica com esse ganho? O escritório, que cobra menos e atende mais? O cliente, que paga menos? Ou a empresa que vende o modelo? A resposta muda o valor de cada empresa da cadeia.",
    naPratica:
      "Na aula, inteligência artificial aparece como uma das teses que quase não existem na B3. As empresas que mais investem e faturam com IA estão listadas fora, e um índice global amplo já dá exposição relevante a elas. Isso não torna o setor uma aposta segura: euforia, concentração e preços que embutem anos de crescimento também fazem parte da história da tecnologia. Participar com diversificação, sem apostar tudo numa narrativa, é o caminho mais prudente.",
    relacionados: ["aprendizado-de-maquina", "rede-neural", "modelo-de-linguagem", "gpu", "semicondutor", "data-center", "bolha", "home-bias"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "13:04" }, { modulo: 0, aula: 4, tempo: "14:31" }],
  },
  {
    slug: "aprendizado-de-maquina",
    termo: "Aprendizado de máquina",
    categoria: "Cripto e tecnologia",
    apelidos: ["machine learning", "aprendizagem de máquina"],
    resumo:
      "O jeito de fazer computadores aprenderem padrões a partir de exemplos, em vez de seguirem regras escritas por programadores. É a base de quase toda a inteligência artificial moderna.",
    texto: [
      "Tente escrever as regras para reconhecer um gato numa foto: orelhas pontudas, bigodes, quatro patas. Logo aparecem as exceções: o gato deitado, o gato de costas, o cachorro de orelhas pontudas. Escrever regras para o mundo real é uma tarefa sem fim.",
      "O aprendizado de máquina inverte o problema. Em vez de programar as regras, você mostra ao sistema milhares de exemplos, fotos marcadas como gato ou não gato, e ele ajusta sozinho os próprios parâmetros até acertar. As regras saem dos dados.",
      "É a base de quase toda a inteligência artificial moderna, do filtro de spam do seu e-mail aos grandes modelos de linguagem.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "O termo foi popularizado em 1959 por Arthur Samuel, da IBM, que criou um programa de damas que melhorava jogando contra si mesmo e acabou jogando melhor que o próprio autor. A ideia de uma máquina que aprende com a experiência estava ali.",
          "Por décadas, conviveu com a abordagem de regras escritas à mão. Foi ganhando espaço nos anos 1990 e 2000, com mais dados e computadores mais rápidos, em tarefas como detecção de fraude, recomendação de produtos e filtros de spam. Na década de 2010, com as redes neurais profundas, virou o centro do campo.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "No aprendizado supervisionado, o mais comum, o sistema recebe exemplos com a resposta certa, como fotos marcadas ou empréstimos que foram pagos ou não, e aprende a prever a resposta para casos novos. No não supervisionado, recebe dados sem resposta e procura agrupamentos e padrões por conta própria. No aprendizado por reforço, aprende por tentativa e erro, recebendo recompensas quando acerta, como num jogo.",
          "Em todos os casos, o modelo é ajustado para errar menos nos dados de treino e testado em dados que nunca viu. Se vai bem no treino e mal no teste, decorou em vez de aprender, um problema conhecido como sobreajuste.",
        ],
      },
      {
        titulo: "Onde já está nas finanças",
        paragrafos: [
          "Bancos usam aprendizado de máquina para conceder crédito, detectar fraudes em cartões em tempo real e prevenir lavagem de dinheiro. Corretoras e gestoras usam para executar ordens, prever liquidez e analisar textos de balanços e notícias. Seguradoras usam para precificar riscos.",
          "Também há limites. Um modelo treinado com dados enviesados reproduz o viés, por exemplo negando crédito a grupos que foram mal atendidos no passado. E um modelo que aprendeu num período calmo pode falhar justamente quando o mercado muda de regime.",
        ],
      },
    ],
    exemplo:
      "Hipotético: um banco treina um modelo com o histórico de 1 milhão de empréstimos, sabendo quais foram pagos e quais atrasaram. O modelo aprende que certos padrões, como o uso crescente do limite do cartão nos meses anteriores, antecedem atrasos, e passa a sinalizar clientes com risco maior. Funciona bem até que uma recessão muda o comportamento de todo mundo ao mesmo tempo, e os padrões do passado deixam de valer.",
    naPratica:
      "Modelos que aprendem com o passado têm a mesma limitação que o investidor que olha o retrovisor: funcionam enquanto o futuro se parece com o passado. É uma boa lembrança de humildade com qualquer previsão de mercado, venha ela de uma pessoa, de um modelo estatístico ou de uma inteligência artificial. Rupturas, os cisnes negros, são justamente o que os dados históricos não mostram.",
    relacionados: ["inteligencia-artificial", "rede-neural", "aprendizado-profundo", "modelo-de-linguagem", "cisne-negro", "vies-de-recencia"],
  },
  {
    slug: "rede-neural",
    termo: "Rede neural",
    categoria: "Cripto e tecnologia",
    apelidos: ["redes neurais", "rede neural artificial", "neurônios artificiais", "perceptron"],
    resumo:
      "Um modelo matemático feito de camadas de unidades simples, inspiradas de longe nos neurônios, que aprendem ajustando a força das ligações entre si. É a peça central da IA atual.",
    texto: [
      "Cada neurônio artificial faz uma coisa muito simples: recebe alguns números, multiplica cada um por um peso, soma tudo e passa o resultado adiante, às vezes depois de uma pequena transformação. Sozinho, não faz quase nada. Milhões ou bilhões deles, organizados em camadas, reconhecem rostos, traduzem idiomas e escrevem textos.",
      "Rede neural é um modelo matemático formado por camadas dessas unidades simples, inspiradas de longe nos neurônios do cérebro, que aprende ajustando a força das ligações entre elas, os pesos. É a peça central da inteligência artificial atual.",
      "A ideia tem mais de 80 anos. Passou boa parte desse tempo desacreditada.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em 1943, Warren McCulloch e Walter Pitts descreveram um modelo matemático simples de neurônio. Em 1958, Frank Rosenblatt construiu o perceptron, uma máquina que aprendia a classificar imagens simples, e a imprensa da época falou em computadores que logo pensariam. Em 1969, um livro de dois pesquisadores influentes mostrou limitações sérias do perceptron, e o interesse e as verbas secaram.",
          "Nos anos 1980, um método para ajustar os pesos camada por camada, a retropropagação, popularizado num artigo de 1986, permitiu treinar redes com várias camadas. Nos anos 1990, redes neurais já liam números escritos à mão em cheques bancários nos Estados Unidos. Mas faltavam dados e poder de computação para ir muito além.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "Os dados entram pela primeira camada, passam pelas camadas do meio e saem na última como uma resposta, por exemplo, a probabilidade de a foto ser de um gato. No começo, os pesos são aleatórios, e a resposta é ruim.",
          "O treinamento compara a resposta da rede com a resposta certa, calcula o erro e ajusta cada peso um pouquinho na direção que reduz esse erro. Repetido milhões de vezes, com milhões de exemplos, o processo faz a rede ficar boa na tarefa. Ninguém programa o que cada neurônio faz: os papéis emergem do treinamento.",
        ],
      },
      {
        titulo: "O que mudou",
        paragrafos: [
          "Quando a internet trouxe dados em abundância e as GPUs trouxeram computação barata, as redes neurais deixaram de ser curiosidade acadêmica. Redes maiores, com mais camadas e mais dados, passaram a vencer todas as outras abordagens em visão, voz e linguagem.",
          "Um efeito colateral é a opacidade: uma rede com bilhões de pesos funciona, mas é difícil explicar por que tomou uma decisão específica. Em crédito, saúde e justiça, essa dificuldade virou tema de regulação.",
        ],
      },
    ],
    exemplo:
      "Hipotético: uma rede recebe os pixels de uma foto. As primeiras camadas aprendem, sozinhas, a detectar bordas e contrastes. As do meio combinam bordas em formas, como círculos e triângulos. As seguintes combinam formas em partes, como olhos e orelhas. A última decide se é um gato. Ninguém disse à rede que olhos importam; ela descobriu isso porque ajudava a acertar.",
    naPratica:
      "Não é preciso entender a matemática para entender o investimento: as redes neurais transformaram poder de computação em produto, e é por isso que chips, energia e data centers viraram parte da mesma tese. A história delas, com décadas de descrédito antes da virada, também ensina que o tempo de uma tecnologia é imprevisível, para cima e para baixo.",
    relacionados: ["aprendizado-profundo", "aprendizado-de-maquina", "transformer", "gpu", "inteligencia-artificial", "modelo-de-linguagem"],
  },
  {
    slug: "aprendizado-profundo",
    termo: "Aprendizado profundo",
    categoria: "Cripto e tecnologia",
    apelidos: ["deep learning", "aprendizagem profunda", "redes neurais profundas", "AlexNet"],
    resumo:
      "O uso de redes neurais com muitas camadas, treinadas com grandes volumes de dados em GPUs. Foi o que destravou a IA moderna, a partir de 2012.",
    texto: [
      "Em 2012, o desafio ImageNet, que pedia a programas de computador que identificassem objetos em mais de um milhão de fotos, teve um vencedor inesperado. Uma rede neural treinada em duas placas de vídeo errou cerca de 15% das vezes, contra 26% do segundo colocado. Numa área em que avanços eram medidos em décimos de ponto, foi um terremoto.",
      "Aprendizado profundo é o uso de redes neurais com muitas camadas, treinadas com grandes volumes de dados em GPUs. O profundo do nome se refere ao número de camadas.",
      "Foi o que destravou a inteligência artificial moderna, da visão computacional aos modelos de linguagem.",
    ],
    secoes: [
      {
        titulo: "Por que profundidade importa",
        paragrafos: [
          "Com poucas camadas, uma rede aprende padrões simples. Com dezenas ou centenas, aprende representações cada vez mais abstratas: de pixels a bordas, de bordas a formas, de formas a objetos; de letras a palavras, de palavras a frases, de frases a ideias.",
          "Redes profundas existiam no papel havia décadas, mas eram difíceis de treinar: os ajustes se perdiam no caminho entre as camadas, e faltavam dados e computação. A partir do fim dos anos 2000, técnicas novas de treinamento, bases de dados enormes como a própria ImageNet, criada em 2009, e o uso de GPUs resolveram o problema.",
        ],
      },
      {
        titulo: "Os pioneiros",
        paragrafos: [
          "Três pesquisadores mantiveram a ideia viva nos anos de descrédito: Geoffrey Hinton, no Canadá, Yann LeCun, nos Estados Unidos, e Yoshua Bengio, também no Canadá. A equipe de Hinton foi a que venceu o ImageNet de 2012. Os três receberam o Prêmio Turing, o mais importante da computação, referente a 2018.",
          "Em 2024, Hinton dividiu o Nobel de Física com John Hopfield, pelos trabalhos que lançaram as bases das redes neurais. No mesmo ano, metade do Nobel de Química foi para pesquisadores que usaram aprendizado profundo para prever a estrutura de proteínas, um problema de biologia aberto havia meio século.",
        ],
      },
      {
        titulo: "O que veio depois",
        paragrafos: [
          "Em poucos anos, o aprendizado profundo passou a dominar reconhecimento de imagens, de voz, tradução e jogos. Em 2016, um programa baseado nele venceu um dos maiores jogadores de go do mundo. Em 2017, a arquitetura transformer levou a técnica para a linguagem em escala, e daí vieram os grandes modelos de linguagem.",
          "A lógica que guiou a década foi simples e cara: modelos maiores, com mais dados e mais computação, ficam melhores. Isso transformou o aprendizado profundo num negócio de infraestrutura.",
        ],
      },
    ],
    exemplo:
      "O reconhecimento de rosto que desbloqueia o seu celular, a transcrição automática de áudio, a tradução instantânea de uma página em outro idioma e a sugestão de resposta no e-mail são aplicações de aprendizado profundo que você usa sem perceber. Hipotético: o mesmo tipo de técnica, aplicado a anos de transações de cartão, permite a um banco bloquear uma compra suspeita em milissegundos.",
    naPratica:
      "O aprendizado profundo transformou chips de videogame em infraestrutura estratégica. Quem acompanha tecnologia como tese de investimento precisa entender que boa parte do valor está no hardware, na energia e em quem tem dados e escala, e não só em quem escreve o software. E que a corrida por modelos cada vez maiores tem custo alto, o que favorece poucas empresas gigantes.",
    relacionados: ["rede-neural", "gpu", "transformer", "aprendizado-de-maquina", "inteligencia-artificial", "data-center"],
  },
  {
    slug: "transformer",
    termo: "Transformer",
    categoria: "Cripto e tecnologia",
    apelidos: ["transformers", "arquitetura transformer", "mecanismo de atenção", "Attention Is All You Need"],
    resumo:
      "A arquitetura de rede neural apresentada por pesquisadores do Google em 2017, baseada num mecanismo de atenção. É a base de praticamente todos os grandes modelos de linguagem.",
    texto: [
      "Leia a frase: o banco fechou porque ele estava sem dinheiro. Quem estava sem dinheiro? Você sabe na hora que ele é o banco. Para um computador, ligar o ele ao banco, e não a outra palavra, exige olhar a frase inteira ao mesmo tempo e entender como as palavras se relacionam.",
      "Transformer é a arquitetura de rede neural, apresentada por pesquisadores do Google em 2017, que resolveu isso com um mecanismo chamado atenção: cada palavra olha para todas as outras e decide em quais prestar mais atenção para entender o próprio sentido.",
      "É a base de praticamente todos os grandes modelos de linguagem. O T de GPT vem de transformer.",
    ],
    secoes: [
      {
        titulo: "De onde vem",
        paragrafos: [
          "Em junho de 2017, oito pesquisadores publicaram um artigo com um título provocador, A atenção é tudo de que você precisa. A proposta era abandonar as redes que liam o texto palavra por palavra, em sequência, e usar só o mecanismo de atenção.",
          "O artigo foi publicado abertamente, como é comum em pesquisa de inteligência artificial. Em menos de dois anos, a arquitetura estava em modelos de várias empresas. Vários dos autores saíram do Google para fundar empresas próprias de IA.",
        ],
      },
      {
        titulo: "Como funciona",
        paragrafos: [
          "O texto é quebrado em pedaços, os tokens, e cada um vira uma lista de números. Em cada camada, o mecanismo de atenção calcula, para cada token, o quanto ele deve levar em conta cada um dos outros, e mistura as informações de acordo. Camada após camada, as representações ficam mais ricas: a palavra banco passa a carregar se é instituição financeira ou assento de praça.",
          "A grande vantagem prática é o paralelismo. Os modelos anteriores precisavam processar uma palavra depois da outra. O transformer processa o texto inteiro de uma vez, o que casa perfeitamente com as GPUs, feitas para fazer muitas contas ao mesmo tempo.",
        ],
      },
      {
        titulo: "Por que mudou tudo",
        paragrafos: [
          "O paralelismo permitiu treinar modelos com bilhões de parâmetros em volumes enormes de texto. Em 2018, surgiram os primeiros modelos de linguagem pré-treinados baseados nele. Em 2020, pesquisadores mostraram que o desempenho melhorava de forma previsível com mais dados, mais parâmetros e mais computação, o que disparou a corrida por escala.",
          "A mesma arquitetura passou a ser usada para imagens, áudio, vídeo, proteínas e código. Uma ideia publicada num artigo aberto virou, em cinco anos, a base de uma indústria de centenas de bilhões de dólares.",
        ],
      },
    ],
    exemplo:
      "Hipotético: ao traduzir do alemão uma frase longa em que o verbo só aparece no fim, o modelo liga esse verbo ao sujeito lá do começo, porque a atenção conecta as duas palavras diretamente, sem precisar carregar a informação palavra por palavra. Numa frase sobre mercado, como o real caiu depois que o banco central sinalizou juros menores, a atenção ajuda o modelo a entender que caiu se refere ao real, e não aos juros.",
    naPratica:
      "Uma ideia publicada num artigo científico aberto virou, em poucos anos, a base de uma corrida de investimentos gigantesca, e o valor não ficou necessariamente com quem a inventou. É um lembrete de como a inovação pode mudar setores inteiros rapidamente, para cima e para baixo, e de por que apostar numa única empresa dentro de uma tese tecnológica é mais arriscado do que parece.",
    relacionados: ["modelo-de-linguagem", "aprendizado-profundo", "rede-neural", "gpu", "inteligencia-artificial", "diversificacao"],
  },
  {
    slug: "modelo-de-linguagem",
    termo: "Modelo de linguagem",
    sigla: "LLM",
    categoria: "Cripto e tecnologia",
    apelidos: ["modelos de linguagem", "grande modelo de linguagem", "grandes modelos de linguagem", "LLMs", "large language model", "alucinação", "alucinações"],
    resumo:
      "Um modelo de IA treinado em enormes volumes de texto para prever a próxima palavra. Em escala, essa tarefa simples produz sistemas capazes de conversar, resumir, programar e raciocinar sobre problemas.",
    texto: [
      "Complete a frase: o dólar subiu porque o mercado ficou... Você provavelmente pensou em nervoso, preocupado ou com medo. Fez isso usando tudo o que já leu e ouviu na vida. Um modelo de linguagem faz a mesma coisa, palavra por palavra, depois de ter lido uma parte gigantesca do texto disponível no mundo.",
      "Modelo de linguagem é um modelo de inteligência artificial treinado em enormes volumes de texto para prever o próximo pedaço de texto. Os grandes, chamados em inglês de LLMs, têm bilhões de parâmetros e são a base dos assistentes de conversa, das ferramentas de escrita e dos programas que geram código.",
      "O que surpreende é que uma tarefa tão simples, prever a próxima palavra, produza em escala sistemas capazes de conversar, resumir, traduzir, programar e raciocinar sobre problemas.",
    ],
    secoes: [
      {
        titulo: "Como funciona",
        paragrafos: [
          "O texto é quebrado em tokens, pedaços de palavras. No pré-treinamento, o modelo lê trilhões de tokens e, a cada um, tenta prever o seguinte, ajustando os seus parâmetros quando erra. Para prever bem, ele é obrigado a captar gramática, fatos, estilos e alguma forma de raciocínio.",
          "Depois, vem o ajuste. O modelo é treinado com exemplos de perguntas e boas respostas e com avaliações humanas sobre quais respostas são melhores, para seguir instruções, ser útil e evitar conteúdos perigosos. Na hora de responder, ele gera um token de cada vez, escolhendo entre os mais prováveis.",
        ],
      },
      {
        titulo: "De onde vem",
        paragrafos: [
          "Modelos de linguagem estatísticos existem há décadas, em corretores ortográficos e teclados de celular. A arquitetura transformer, de 2017, permitiu treinar modelos muito maiores. Em 2020, um modelo com 175 bilhões de parâmetros mostrou que, em escala, surgiam habilidades que ninguém tinha programado.",
          "Em novembro de 2022, o lançamento do ChatGPT pôs um modelo de linguagem ajustado para conversa nas mãos do público e deflagrou a corrida atual, com modelos fechados de grandes empresas e modelos abertos que qualquer um pode baixar e adaptar.",
        ],
      },
      {
        titulo: "Os limites",
        paragrafos: [
          "Modelos de linguagem erram com confiança, o que se chama de alucinação: inventam fatos, números, citações ou fontes que parecem plausíveis. Isso acontece porque o modelo produz o texto mais provável, e não necessariamente o verdadeiro.",
          "Eles também têm uma data de corte do conhecimento, podem reproduzir vieses dos textos em que foram treinados e não têm acesso, por padrão, a dados atualizados como cotações do dia. Funcionam melhor com conferência humana e quando ligados a fontes confiáveis, como documentos e bases de dados oficiais.",
        ],
      },
      {
        titulo: "Por que importa para quem investe",
        paragrafos: [
          "Como ferramenta, modelos de linguagem já ajudam a estudar finanças, resumir relatórios de empresas, comparar regulamentos de fundos e organizar ideias. Como tese de investimento, estão no centro da corrida por chips, data centers e energia, e da disputa entre as maiores empresas de tecnologia do mundo.",
        ],
      },
    ],
    exemplo:
      "Hipotético: você pergunta a um modelo qual foi a alíquota do IOF para remessas de investimento em determinado ano. Ele pode responder certo, citando o decreto. Ou pode dar um número plausível e errado, com a mesma segurança. Se você pedir também o link da fonte oficial e conferir no site do Planalto ou da Receita, transforma o modelo num atalho útil, e não numa fonte de erro.",
    naPratica:
      "Modelos de linguagem já são ferramentas úteis para estudar, resumir documentos e organizar ideias sobre investimentos. Não substituem a checagem de números em fonte oficial, o contador nas questões de imposto nem a sua decisão sobre quanto risco aceitar. Use como um assistente rápido e falível, que ajuda a pensar, e não como um oráculo que decide por você.",
    relacionados: ["transformer", "inteligencia-artificial", "aprendizado-profundo", "gpu", "data-center", "excesso-de-confianca", "vies-de-confirmacao"],
  },
];

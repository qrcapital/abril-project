import type { SecaoDaAula } from "@/lib/notebook";

// Módulo I, aula 4 ("O comportamento decide antes da planilha", cerca de 28 min), com Rodolfo Bastos,
// fundador da Oyster Academy. É a segunda aula dele e a que encerra o Módulo I. Segue a ordem da fala
// (transcrição em `transcricoes/modulo-0/aula-4.txt`): Swensen e a alocação, as janelas de
// dolarização, o custo de perder os melhores dias, o investidor médio, o tamanho dos mercados, a renda
// fixa como fluxo combinado, Kings e Aristocrats, a composição setorial, a demografia do consumo e o
// comparativo de 2010 a 2025 em reais.
//
// NÚMEROS CONFERIDOS EM 07/OUT/2026 nas fontes citadas em cada bloco: BCB SGS (4391 CDI mensal,
// 3696 e 1 PTAX), ANBIMA IHFA e Ibovespa (séries anuais via Mais Retorno), Damodaran (histretSP, jan/2026),
// J.P. Morgan Asset Management (Guide to Retirement 2026; edição de 2025 e Guide to the Markets 3T/2022
// em reproduções), SIFMA (Capital Markets Fact Book 2026), Tesouro Nacional, MSCI (factsheets de
// 30/set/2026), BLS (Consumer Expenditure Survey 2022), IBGE (Projeções 2024) e Census Bureau (2023 e
// Vintage 2025). Critério: quando a aula cita número diferente da fonte, o texto registra os dois, com
// a razão provável da diferença (janela, edição, índice com ou sem dividendos), sem tom de errata. O que
// não deu para conferir na fonte original está dito na nota do bloco. Itens do super dossiê usados:
// BKM-043, BKM-074, BKM-057, BKM-064, BKM-045, BKM-029, AMC-065, AMF-053, BMA-020, BMA-021, VAL-016,
// VAL-014, BKM-076, AMC-051, BKM-072 e BKM-075.
//
// TOM (07/out/2026, `docs/TOM-DO-NOTEBOOK.md`): texto reescrito em linguagem de curso, sem fórmulas
// nos conceitos e sem citação acadêmica no corpo. As fontes ficam no `fonte`, na `nota` e nas
// `referencias`.

// Fim de cada ano, base dez/2009 = 100.
const anosJanela = ["2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
// CDI: composto das taxas mensais da SGS 4391.
const cdiIdx = [100, 110, 122, 133, 143, 159, 180, 205, 226, 240, 254, 261, 273, 307, 347, 385, 440];
// IHFA (ANBIMA): composto dos retornos anuais.
const ihfaIdx = [100, 110, 123, 141, 153, 164, 193, 224, 251, 269, 299, 315, 322, 366, 400, 423, 488];
// Ibovespa: 68.588 pontos em dez/2009 e 161.125 em dez/2025, composto dos retornos anuais.
const ibovIdx = [100, 101, 83, 89, 75, 73, 63, 88, 111, 128, 169, 174, 153, 160, 196, 175, 235];
// 60% Treasury de 10 anos e 40% S&P 500 com dividendos (Damodaran), rebalanceada a cada ano, convertida
// pela PTAX de fim de ano (SGS 3696). Em dólar, a mesma carteira chega a 304.
const carteira6040Brl = [100, 106, 133, 156, 191, 243, 361, 318, 355, 409, 505, 740, 865, 662, 695, 967, 961];

const secao: SecaoDaAula = {
  aula: 4,
  blocos: [
    // ---- 1. carregar ou acertar o momento ---------------------------------------------------------
    {
      tipo: "capitulo",
      id: "carregar-ou-acertar-o-momento",
      titulo: "Carregar no longo prazo ou acertar o momento",
      resumo: "O que mais pesa no seu resultado é como você divide o dinheiro entre tipos de investimento, e não o dia da compra nem a ação escolhida.",
      tempo: "0:12",
    },
    {
      tipo: "texto",
      capitular: true,
      paragrafos: [
        "Você decidiu ter uma parte do patrimônio em dólar. Fez as contas, entendeu o câmbio, o risco fiscal e a demografia, e está convencido. Aí chega a primeira semana em que tudo cai 15%. É nesse momento, e não na planilha, que a estratégia vive ou morre. Esse é o tema da aula que fecha o Módulo I, a segunda com Rodolfo Bastos.",
        "Rodolfo parte de David Swensen, que cuidou do dinheiro da Universidade Yale por 36 anos. Swensen dizia que existem três jeitos de buscar resultado: decidir quanto pôr em cada tipo de investimento, acertar a hora de entrar e sair, e escolher a ação A ou o fundo B. O primeiro pesa muito mais que os outros dois. Na conta da aula, 80% do resultado de longo prazo vem do andamento natural dos mercados, e 20%, da hora certa e da escolha do papel.",
        "Os estudos que deram fama a essa ideia vão até mais longe. Um levantamento clássico com 91 grandes fundos de pensão americanos concluiu que a divisão entre tipos de investimento explicava mais de 90% do sobe e desce de cada fundo ao longo do tempo. Pesquisas seguintes mostraram por quê: quem tenta acertar a hora ou o papel ganha às vezes e perde às vezes, e, depois dos custos, uma coisa tende a anular a outra. O 80/20 da aula é, portanto, uma conta conservadora.",
        "Daí o conselho prático. Decidiu dolarizar, porque gasta em dólar, porque quer uma reserva em outra moeda ou porque pensa em morar fora? Então converta em janelas: divida o valor em 12 parcelas mensais (ou 5, ou 15) e converta uma por vez, sem tentar adivinhar o dia certo. Quanto dolarizar é decisão de cada um, e zero é uma resposta legítima, insiste Rodolfo. O que importa é decidir com calma, deixar por escrito e respeitar a decisão depois.",
      ],
    },
    {
      tipo: "conceito",
      termo: "Alocação de ativos",
      definicao:
        "É a resposta para a pergunta \"quanto do meu dinheiro vai para cada tipo de investimento?\": caixa, renda fixa, ações, imóveis e, para quem vive no Brasil, também quanto fica em cada moeda e em cada país. Ela vem antes da escolha de qualquer papel e é mantida ao longo do tempo. A escolha do fundo e do dia de comprar acontecem dentro dessa moldura.",
      naPratica:
        "\"Quanto fica no Brasil e quanto vai para fora\" é uma pergunta de alocação, e por isso pesa mais no seu resultado do que a escolha do ETF ou o dia da conversão. Depois de uma queda, voltar à divisão escolhida significa vender o que subiu e comprar o que caiu. É o contrário do que o instinto pede, e é por isso que vale deixar a regra escrita.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 7, box sobre Brinson, e cap. 28, seção 28.4", ano: 2014 },
    },
    {
      tipo: "conceito",
      tempo: "1:23",
      termo: "Custo médio em janelas",
      definicao:
        "Imagine que você converte R$ 2 mil todo mês. Num mês o dólar está a R$ 5,50, e seus R$ 2 mil compram US$ 364. No outro, ele cai para R$ 4,90, e os mesmos R$ 2 mil compram US$ 408. Quando o dólar está caro, você compra menos dólares; quando está barato, compra mais. Por isso o preço médio que você paga nunca fica acima da média das cotações do período.",
      naPratica:
        "As janelas não fazem você ganhar mais. Num estudo da Vanguard, aplicar tudo de uma vez rendeu mais em cerca de dois terços dos períodos históricos, porque o dinheiro fica mais tempo investido. O ganho é outro: você elimina o risco de concentrar tudo no pior dia e tira a decisão do campo da emoção. Uma regra combinada antes também protege de três tropeços clássicos: correr atrás do que já subiu, esperar \"voltar ao preço\" e ficar parado por medo de errar. Quem espera o dólar cair para começar costuma esperar para sempre.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 12, box \"Why It's So Tough to Fix Your Portfolio\"", ano: 2014 },
    },
    {
      tipo: "tabela",
      titulo: "R$ 12 mil convertidos em seis janelas de R$ 2 mil",
      colunas: ["Mês", "Dólar (R$)", "Dólares comprados (US$)"],
      linhas: [
        ["1", "5,20", "384,62"],
        ["2", "5,50", "363,64"],
        ["3", "5,80", "344,83"],
        ["4", "5,30", "377,36"],
        ["5", "4,90", "408,16"],
        ["6", "5,10", "392,16"],
        ["Total", "média simples 5,30", "2.270,76"],
      ],
      fonte: "Conta ilustrativa, com cotações hipotéticas",
      nota:
        "Você pagou em média R$ 5,28 por dólar (R$ 12.000 ÷ US$ 2.270,76), abaixo da média das cotações, R$ 5,30. Tudo de uma vez renderia de US$ 2.069, no mês mais caro, a US$ 2.449, no mais barato: as janelas abrem mão do melhor dia para escapar do pior.",
    },

    // ---- 2. poucos dias explicam décadas ------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "poucos-dias-explicam-decadas",
      titulo: "Poucos dias explicam décadas",
      resumo: "Os melhores dias da bolsa aparecem colados aos piores, e quem sai na queda costuma perder a volta.",
      tempo: "2:25",
    },
    {
      tipo: "texto",
      paragrafos: [
        "O J.P. Morgan publica todo ano um gráfico simples e assustador: quanto rende o dinheiro aplicado no S&P 500, o principal índice de ações americano, para quem ficou o tempo todo investido e para quem perdeu os 10, 20 ou 60 melhores dias. Na versão citada em aula, de 1995 a 2022, o índice rendeu perto de 8% ao ano, e quem perdeu os 40 melhores dias terminou perto de zero ou no negativo. Esses 8% não contam os dividendos; com eles reinvestidos, o retorno sobe para perto de 9,8% ao ano.",
        "Por que tão poucos dias pesam tanto? Porque os maiores dias de alta acontecem no meio das crises, e não depois que elas passam. Na edição de 2025 do gráfico, sete dos dez melhores dias dos 20 anos anteriores vieram até duas semanas depois de um dos dez piores. Em 2020, o segundo pior dia do ano, 12 de março, foi seguido no dia seguinte pelo segundo melhor. Quem vende para \"esperar passar\" quase sempre está fora quando a recuperação começa.",
        "Rodolfo chama isso de queda forte. Não é a alta de 20% quando você esperava 30%. É a semana em que a carteira perde 10%, 15%, 20%, e o estômago decide no lugar da cabeça.",
        "Ele compara com o tênis. Roger Federer venceu quase 80% das 1.526 partidas de simples que disputou, mas ganhou só 54% dos pontos, como contou num discurso de formatura em 2024 (na aula, Rodolfo fala em 43% ou 44% de pontos perdidos; foram 46%). Uma carreira vitoriosa feita de quase tantos pontos perdidos quanto ganhos é uma boa imagem para uma carteira de longo prazo.",
      ],
    },
    {
      tipo: "kpis",
      tempo: "4:06",
      titulo: "O investidor médio rendeu menos que qualquer tipo de investimento",
      itens: [
        { rotulo: "Investidor médio", valor: 3.6, formato: { sufixo: "% a.a.", casas: 1 }, destaque: true, nota: "fundos americanos, segundo a Dalbar" },
        { rotulo: "Carteira 60/40", valor: 7.4, formato: { sufixo: "% a.a.", casas: 1 }, nota: "60% S&P 500, 40% títulos" },
        { rotulo: "S&P 500", valor: 9.5, formato: { sufixo: "% a.a.", casas: 1 }, nota: "com dividendos" },
        { rotulo: "Renda fixa americana", valor: 4.3, formato: { sufixo: "% a.a.", casas: 1 }, nota: "Bloomberg US Aggregate" },
      ],
      fonte: "J.P. Morgan Asset Management, Guide to the Markets, 3T/2022, com dados da Dalbar Inc.",
      nota:
        "Retornos médios por ano de 2002 a 2021, em dólar, conferidos em reproduções do gráfico. Fundos imobiliários americanos (11%) e ações emergentes (10%), citados em aula, estão no mesmo gráfico e não foram conferidos na edição original. Na carteira 60/40 do J.P. Morgan, 60% são ações; a aula descreve o inverso.",
    },
    {
      tipo: "conceito",
      termo: "O retorno do fundo e o retorno do investidor",
      definicao:
        "Imagine um fundo que rendeu 10% ao ano numa década. Esse é o retorno do fundo: o que ganhou quem entrou no primeiro dia e não mexeu mais. Agora pense no investidor que aplicou depois de um ano bom, quando o fundo estava na moda, e resgatou no meio de uma queda. O fundo rendeu 10%, mas ele ganhou bem menos. No mercado, o primeiro número se chama retorno ponderado pelo tempo; o segundo, retorno ponderado pelo dinheiro. A distância entre os dois é o custo do comportamento.",
      naPratica:
        "É essa distância que o gráfico da Dalbar tenta medir, e o método tem críticos: ele trata todo aporte como se devesse ter sido feito no começo do período, o que pune quem simplesmente poupou aos poucos. Contas mais cuidadosas, como as da Morningstar, encontram uma diferença menor, de um a dois pontos por ano. A lição continua de pé: o retorno que importa é o da sua conta, em reais e com o câmbio do dia de cada aporte, e ele depende do seu comportamento.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 24, retornos ponderados pelo tempo e pelo dinheiro", ano: 2014 },
    },
    {
      tipo: "destaque",
      tempo: "5:15",
      texto: "O segredo não é o market timing, é o time in the market.",
      fonte: "Frase lembrada por Rodolfo Bastos na aula",
    },
    {
      tipo: "grafico",
      tempo: "6:05",
      titulo: "Perder os 10 melhores dias em 20 anos corta o patrimônio final pela metade",
      subtitulo: "US$ 10 mil aplicados no S&P 500 de 2/jan/2006 a 31/dez/2025, valor final em US$",
      forma: "barra",
      eixoX: ["Investido o tempo todo", "Sem os 10 melhores dias", "Sem os 20", "Sem os 30", "Sem os 40", "Sem os 50", "Sem os 60"],
      series: [{ nome: "Valor final", valores: [80619, 35866, 21177, 13826, 9462, 6763, 4966], destaque: true }],
      formato: { base: "usd", casas: 0 },
      referencia: { valor: 10000, rotulo: "Valor aplicado" },
      fonte: "J.P. Morgan Asset Management, Guide to Retirement 2026, \"Impact of being out of the market\" (dados até 31/dez/2025)",
      nota:
        "S&P 500 com dividendos reinvestidos, sem custos. Retorno por ano em cada caso: 11,0%, 6,6%, 3,8%, 1,6%, −0,3%, −1,9% e −3,4%. A aula usa a edição anterior, de 2005 a 2024: US$ 71.750 para quem ficou investido e US$ 32.871 sem os 10 melhores dias.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Os números da aula, US$ 10 mil virando US$ 70 mil, US$ 32 mil sem os 10 melhores dias e US$ 12 mil sem os 30, vêm da edição de 2025 desse gráfico. Ela cobre 20 anos, de 2005 a 2024, e cerca de 5.000 pregões (na fala, 25 anos e 6.300 dias). Ou seja: 10 dias são 0,2% do período, e 30 dias, 0,6%. Perder esses 30 dias deixava perto de US$ 13 mil no fim, cerca de 82% a menos do que quem ficou. Na edição de 2026, no gráfico acima, as proporções se repetem.",
        "Agora, uma ressalva honesta. Ficar investido não elimina o risco, e o tempo não faz ele sumir. Num prazo longo, fica menos provável que a bolsa perca da renda fixa, mas o tamanho do estrago nos piores cenários cresce. Por isso o argumento da aula é de alocação, e não de aposta: a fatia em dólar ou em bolsa deve ser aquela que você consegue carregar na pior semana, porque é nela que a decisão é testada.",
      ],
    },

    // ---- 3. um mercado de outro tamanho --------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "um-mercado-de-outro-tamanho",
      titulo: "Um mercado de outro tamanho",
      resumo: "Ações e títulos americanos somam dezenas de vezes o mercado brasileiro. Isso significa mais opções, e não um mercado melhor ou pior.",
      tempo: "8:05",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Rodolfo quer tirar a conversa dos juros, 15% aqui contra 3% ou 4% lá, e levar para o tamanho. As empresas listadas nos Estados Unidos valiam US$ 68,9 trilhões no fim de 2025, 43,7% do valor de todas as bolsas do mundo. As da B3 somavam R$ 4,7 trilhões, perto de US$ 0,85 trilhão. É uma proporção de mais de 80 para 1. Na aula, Rodolfo fala em 35 vezes, com números de outra data; pelos dados mais recentes, a diferença é ainda maior. A Nvidia sozinha, com mais de US$ 5 trilhões, vale mais que a bolsa brasileira inteira.",
        "Na renda fixa, a lógica é a mesma. A aula soma US$ 14 trilhões em títulos de empresas e US$ 34 trilhões em títulos de governo, o que dá 48 trilhões (ele arredonda para 50), contra US$ 2,4 trilhões no Brasil. Pelos dados da SIFMA, a associação dos bancos e corretoras americanos, havia US$ 61,2 trilhões em títulos americanos em circulação em 2025. Só a dívida do governo federal brasileiro era de R$ 8,6 trilhões, cerca de US$ 1,6 trilhão; somando os títulos de empresas, chega-se perto do número da aula.",
        "E Rodolfo insiste: tamanho não é qualidade. Um mercado maior oferece mais empresas, mais prazos, mais setores e mais liquidez, que é a chance de vender rápido sem derrubar o preço. Ele fala em liquidez 46 vezes maior nos Estados Unidos, número que depende do critério e que não conseguimos reproduzir, mas a direção não está em dúvida. A conclusão é que os dois mercados se completam. Um não substitui o outro.",
      ],
    },
    {
      tipo: "kpis",
      titulo: "Os dois mercados em quatro números",
      itens: [
        { rotulo: "Ações nos EUA", valor: 68.9, formato: { prefixo: "US$ ", sufixo: " tri", casas: 1 }, destaque: true, nota: "fim de 2025, 43,7% do mundo" },
        { rotulo: "Ações na B3", valor: 0.85, formato: { prefixo: "US$ ", sufixo: " tri", casas: 2 }, nota: "R$ 4,7 tri, dez/2025" },
        { rotulo: "Títulos de renda fixa nos EUA", valor: 61.2, formato: { prefixo: "US$ ", sufixo: " tri", casas: 1 }, nota: "em circulação, 2025" },
        { rotulo: "Dívida pública federal do Brasil", valor: 1.57, formato: { prefixo: "US$ ", sufixo: " tri", casas: 2 }, nota: "R$ 8,6 tri, dez/2025, sem títulos privados" },
      ],
      fonte:
        "SIFMA, Capital Markets Fact Book 2026; Elos Ayta, via InfoMoney (19/jun/2026); Tesouro Nacional, Dívida Pública Federal, dez/2025; Banco Central do Brasil, PTAX de 31/dez/2025 (SGS 1)",
      nota: "Valores em reais convertidos a R$ 5,5024 por dólar. A base brasileira de ações reúne 302 companhias com dados em todas as datas da amostra.",
    },

    // ---- 4. renda fixa é fluxo combinado -------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "renda-fixa-e-fluxo-combinado",
      titulo: "Renda fixa é fluxo combinado, não rendimento estável",
      resumo: "Aluguel, cupom e dividendo crescente têm em comum o dinheiro que cai na conta em data conhecida. Só o cupom é obrigação.",
      tempo: "10:09",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Aqui vem a provocação mais original da aula, e ela é sobre uma palavra. O brasileiro chama de renda fixa aquela aplicação atrelada ao CDI que rende um pouquinho todo mês. Rodolfo propõe outra definição: renda fixa é dinheiro que cai na sua conta em datas e valores combinados.",
        "Pense num imóvel alugado para um inquilino que nunca atrasa. Aquele aluguel é renda fixa. O cupom semestral de um título prefixado ou de uma NTN-B, o título do Tesouro atrelado à inflação, também. Já o CDI mede um rendimento estável em reais, e não um fluxo de dinheiro, nem quanto você consegue comprar em dólar.",
        "E a ideia vai além. Uma ação americana que aumenta o dividendo há décadas pode cumprir o mesmo papel: se o dividendo paga a escola dos filhos, o aluguel ou o padrão de vida, ela funciona como renda fixa, mesmo que o preço dela suba e desça.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "10:56",
      termo: "Título com cupom",
      definicao:
        "Pense num título que você compra por R$ 1.000, que paga R$ 50 a cada seis meses e devolve os R$ 1.000 no vencimento. Esses R$ 50 são o cupom. O que está combinado é o fluxo, não o preço. Se os juros do mercado caem, o título fica mais atraente e passa a valer mais que R$ 1.000; se os juros sobem, passa a valer menos. Esse sobe e desce do preço no caminho é o que se chama de marcação a mercado.",
      naPratica:
        "É o sentido de renda fixa da aula. Quem leva uma NTN-B com cupom ou um título do Tesouro americano até o vencimento recebe exatamente o combinado; quem vende no meio do caminho recebe o preço do dia. Se você vai precisar do dinheiro numa data, faz sentido ter um título que vença perto dela.",
      referencia: { autor: "Alexandre Assaf Neto", obra: "Matemática Financeira e suas Aplicações", capitulo: "cap. 11, seções 11.3.3 e 11.3.4", ano: 2012 },
    },
    {
      tipo: "tabela",
      tempo: "11:53",
      titulo: "Reis, aristocratas e um banco que cortou o dividendo",
      colunas: ["Caso", "Critério ou fato", "Situação"],
      linhas: [
        ["Dividend Aristocrats", "Empresas do S&P 500 que aumentam o dividendo há pelo menos 25 anos seguidos; têm índice oficial, revisto todo ano", "69 empresas em 2025, o número da aula"],
        ["Dividend Kings", "50 anos ou mais de aumentos seguidos; apelido do mercado, sem índice oficial", "Cerca de 55 em listas independentes (a aula fala em mais de 54)"],
        ["Procter & Gamble", "Aumentou o dividendo pela 70ª vez seguida em abril de 2026; paga dividendos há 136 anos", "King (69 anos na época da gravação)"],
        ["JPMorgan Chase", "Cortou o dividendo trimestral de US$ 0,38 para US$ 0,05 por ação em fevereiro de 2009, para reforçar o caixa na crise", "Fora das duas listas; voltou a aumentar o dividendo a partir de 2011"],
      ],
      fonte: "S&P Dow Jones Indices, metodologia do S&P 500 Dividend Aristocrats; Procter & Gamble, comunicado de 14/abr/2026; JPMorgan Chase, comunicado de 23/fev/2009 e formulário 10-Q",
      nota: "O conselho de cada empresa decide o dividendo a cada trimestre. As datas são regulares, mas não há obrigação de pagar.",
    },
    {
      tipo: "texto",
      tempo: "12:50",
      paragrafos: [
        "O exemplo do JPMorgan pede cuidado. Na aula, Rodolfo diz que a ação era King até 2008 e perdeu o título naquele ano, mas manteve os pagamentos. Os registros contam outra história: o banco nunca chegou a 50 anos de aumentos seguidos e, em fevereiro de 2009, cortou o dividendo de US$ 0,38 para US$ 0,05 por ação a cada trimestre, para guardar capital no auge da crise. Quem vivia daquele dividendo viu a renda cair a perto de um oitavo de um trimestre para o outro.",
        "É aí que o dividendo se separa do cupom. Deixar de pagar o cupom de um título é calote. Já o dividendo é uma decisão do conselho da empresa, que pode reduzi-lo quando o lucro some ou o caixa aperta.",
        "Mais dois detalhes. O dividendo americano pago a quem mora no Brasil tem imposto retido nos Estados Unidos, tema do Módulo III. E uma carteira de boas pagadoras pode, sim, servir de fonte de renda, desde que tenha empresas suficientes para aguentar o corte de uma delas.",
      ],
    },
    {
      tipo: "conceito",
      termo: "Suavização de dividendos",
      definicao:
        "As empresas evitam cortar dividendo. Só aumentam o pagamento quando acham que o lucro maior veio para ficar, e aumentam devagar, para não ter de voltar atrás. O economista John Lintner descreveu esse hábito nos anos 1950, e ele continua lá: numa pesquisa com executivos financeiros americanos, 93,8% disseram evitar reduzir o dividendo. Por isso o mercado lê um aumento como sinal de confiança e um corte como sinal de problema.",
      naPratica:
        "Uma sequência de 50 ou 70 anos de aumentos mostra disciplina, mas não é promessa. Ela costuma se manter em tempos normais e pode quebrar justamente quando você mais precisa da renda, como em 2008 e 2009. Depender de poucas pagadoras para viver traz de volta o risco de concentração que o curso tenta diluir.",
      referencia: { autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen", obra: "Princípios de Finanças Corporativas", capitulo: "cap. 16, seções 16.3 a 16.5", ano: 2013 },
    },

    // ---- 5. commodities aqui, tecnologia lá ----------------------------------------------------------
    {
      tipo: "capitulo",
      id: "commodities-aqui-tecnologia-la",
      titulo: "Commodities aqui, tecnologia lá",
      resumo: "A bolsa de cada país espelha a economia que ele tem. Combinar as duas é combinar setores diferentes.",
      tempo: "14:31",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Olhe o que existe dentro de cada bolsa. Pelos números de Rodolfo, em 1990 o S&P 500 tinha 9% em tecnologia e 6% em commodities, e hoje tem 31% em tecnologia. O Ibovespa foi de 24% para 42% em commodities, com tecnologia parada em 4%. Os números de 1990 são difíceis de conferir, porque a classificação de setores usada hoje só foi criada em 1999. O retrato atual, porém, confirma o argumento: no fim de setembro de 2026, tecnologia era 39,5% do índice MSCI das ações americanas e zero no das brasileiras, onde energia e materiais somavam 31,5%, e bancos e financeiras, 39,1%.",
        "\"Então a bolsa brasileira é antiquada?\", pergunta Rodolfo. Não. A bolsa reflete a economia. O Brasil é o maior exportador de soja e de café do mundo, o segundo produtor de minério de ferro, atrás da Austrália, e um dos grandes produtores de petróleo. Há boas oportunidades nesses setores. Mas comprar Ibovespa não dá exposição a inteligência artificial, semicondutores, software ou à maior parte da saúde.",
        "Ele dá um exemplo fora do óbvio: os self storages americanos, depósitos alugados por quem se mudou para um apartamento menor e não tem onde guardar a prancha de surfe ou o taco de golfe. Lá, várias empresas desse negócio têm ações na bolsa. Mercado maior também significa nichos que nem existem na bolsa daqui.",
        "Uma ressalva completa o quadro e reforça o eixo do curso. A bolsa americana também é concentrada: as dez maiores empresas eram 38% do índice em setembro de 2026, quase todas de tecnologia. Em março de 2000, 87% do Nasdaq 100 estava em tecnologia e comunicações, e o índice caiu 64% nos 21 meses seguintes. Trocar uma concentração por outra não é diversificar. O ganho está em combinar as duas.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "15:30",
      titulo: "Nos EUA, tecnologia; no Brasil, bancos e commodities",
      subtitulo: "Peso de cada setor no índice, em %, 30/set/2026",
      forma: "barra",
      eixoX: ["Tecnologia da informação", "Energia e materiais", "Financeiro", "Saúde", "Utilidades públicas"],
      series: [
        { nome: "MSCI Brazil", valores: [0, 31.54, 39.13, 1.16, 11.57], destaque: true },
        { nome: "MSCI USA", valores: [39.5, 5.21, 11.2, 9.34, 1.84] },
      ],
      formato: { sufixo: "%", casas: 1 },
      fonte: "MSCI, factsheets MSCI Brazil e MSCI USA (USD), 30/set/2026",
      nota:
        "Setores pela classificação GICS, o padrão do mercado. Energia e materiais somados: 18,42% e 13,12% no Brasil; 3,48% e 1,73% nos EUA. Ficaram de fora industriais, consumo, comunicação e imobiliário. Os números da aula para 1990 não têm série pública comparável.",
    },

    // ---- 6. quem vai consumir o quê ------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "quem-vai-consumir-o-que",
      titulo: "Quem vai consumir o quê",
      resumo: "O consumo muda com a idade, e as duas populações envelhecem em ritmos e por razões diferentes.",
      tempo: "18:03",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Agora a pergunta olha para a frente: quais setores ganham conforme a população envelhece? Pense na sua própria vida. Aos 20, o dinheiro vai para estudo e transporte. Dos 30 aos 60, para casa, carro, viagens e consumo em geral. Depois dos 65, saúde, remédios, plano de saúde e bem-estar ganham peso. Nos Estados Unidos, as famílias chefiadas por alguém com menos de 25 anos gastam 2,9% do orçamento com saúde; acima dos 65, 13%.",
        "O curso já tratou da demografia na aula de Felippe Hermes, pelo lado das contas públicas. Aqui o ângulo é o consumo. Pelas projeções do IBGE, a população brasileira, de 214,2 milhões em 2026, para de crescer em 2041 e cai para 199,2 milhões em 2070, quando 37,8% dos brasileiros terão 60 anos ou mais. A aula usa o corte de 65 anos: 11% hoje e 31% em 2070.",
        "Os Estados Unidos também envelhecem, mas a população continua crescendo, e o motivo é a imigração. São 341,8 milhões de habitantes, e a fatia com 65 anos ou mais deve passar de 17% em 2022 para 23% em 2050 (a aula fala em 26%, num horizonte mais longo). A imigração decide o resto: em 2100, a população seria de 319 milhões com pouca imigração e de 435 milhões com muita. O Brasil, lembra Rodolfo, exporta gente; os Estados Unidos importam, e junto vêm consumidores entre 30 e 60 anos.",
        "Não é questão de melhor ou pior. É saber em que mercado estarão as empresas de saúde, consumo e educação que vão atender essas pessoas nos próximos 30 ou 40 anos, que é o horizonte de quem tem 30 anos hoje.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Depois dos 65, a saúde pesa mais de quatro vezes o que pesa antes dos 25",
      subtitulo: "Participação no gasto anual das famílias americanas, por idade de quem chefia a família, em %, 2022",
      forma: "barra",
      eixoX: ["Menos de 25", "25 a 34", "35 a 44", "45 a 54", "55 a 64", "65 ou mais"],
      series: [
        { nome: "Saúde", valores: [2.9, 5.2, 6.2, 6.7, 8.6, 13.0], destaque: true },
        { nome: "Transporte", valores: [20.7, 17.8, 17.7, 17.1, 17.4, 14.1] },
        { nome: "Educação", valores: [6.4, 1.4, 1.4, 2.9, 2.0, 0.6] },
      ],
      formato: { sufixo: "%", casas: 1 },
      fonte: "U.S. Bureau of Labor Statistics, Consumer Expenditure Survey 2022, tabela por faixa etária da pessoa de referência",
      nota: "Moradia, o maior item em todas as faixas (de 31% a 36%), ficou de fora para não achatar a escala.",
    },
    {
      tipo: "tabela",
      tempo: "19:32",
      titulo: "Duas populações, dois ritmos de envelhecimento",
      colunas: ["Indicador", "Brasil", "Estados Unidos"],
      linhas: [
        ["População recente", "214,2 milhões (2026)", "341,8 milhões (jul/2025)"],
        ["Pico projetado", "220,4 milhões em 2041", "Perto de 370 milhões por volta de 2080"],
        ["Fim do horizonte", "199,2 milhões em 2070", "366 milhões em 2100 (319 a 435 milhões, conforme a imigração)"],
        ["Idosos", "60 anos ou mais: 15,6% em 2023 e 37,8% em 2070", "65 anos ou mais: 17% em 2022 e 23% em 2050"],
        ["O que faz crescer", "Nascimentos, cada vez menos; pouca imigração", "Imigração, que define o cenário de longo prazo"],
      ],
      fonte: "IBGE, Projeções da População, revisão 2024, e Estimativas da População 2026; U.S. Census Bureau, 2023 National Population Projections e Vintage 2025",
      nota:
        "Os dois institutos destacam cortes de idade diferentes, então as linhas de idosos não se comparam diretamente. A aula cita 65 anos ou mais: de 11% para 31% no Brasil e de 17% para 26% nos EUA.",
    },

    // ---- 7. uma janela favorável --------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "uma-janela-favoravel",
      titulo: "Uma janela favorável, e o que ela não prova",
      resumo: "De 2010 a 2025, a carteira americana medida em reais ganhou do CDI, dos multimercados e da bolsa. Boa parte veio do dólar.",
      tempo: "22:22",
    },
    {
      tipo: "texto",
      tempo: "23:18",
      paragrafos: [
        "Para fechar, Rodolfo faz um comparativo de 16 anos, de janeiro de 2010 a dezembro de 2025, e os números dele batem com as fontes. O IHFA, índice dos fundos multimercados, acumulou 388%, ou 10,4% ao ano. O CDI acumulou 340%, 9,7% ao ano. O Ibovespa subiu 135%, cerca de 5,5% ao ano. Uma carteira americana com 60% em títulos do Tesouro e 40% no S&P 500 rendeu cerca de 204% em dólar, 7,2% ao ano (na aula, 213% e 7,4%, com outro índice de renda fixa).",
        "Só que essa última está em dólar, e as outras, em reais. Para comparar, é preciso trazer a carteira americana para reais. No período, o dólar foi de R$ 1,74 para R$ 5,50, uma alta de 7,5% ao ano. O ganho em reais é o ganho em dólar somado à alta do dólar, e mais um pouquinho, porque um rende sobre o outro. Resultado: cerca de 15,2% ao ano e 861% no acumulado (a aula fala em 15,4% e 890%).",
        "Rodolfo faz questão de desmontar a conclusão apressada. A janela foi favorável: começa com o dólar a R$ 1,74, perto das mínimas daquela década, e termina depois de quinze anos de real perdendo valor. Cerca de metade do ganho anual em reais veio do câmbio. Em outras janelas, a conta muda. Quem converteu no fim de 2024, com o dólar acima de R$ 6, chegou ao fim de 2025 praticamente no zero a zero em reais, porque o dólar caiu cerca de 11% e comeu o rendimento.",
        "Nem sempre o exterior vai ganhar. O argumento é outro: espalhar o dinheiro entre moedas e mercados diminui a dependência de uma única economia, e isso continua valendo nos anos em que o Brasil vai melhor.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Em reais, a carteira 60/40 americana liderou de 2010 a 2025, puxada pelo câmbio",
      subtitulo: "Valor acumulado em reais, dezembro de 2009 = 100, fim de cada ano",
      forma: "linha",
      eixoX: anosJanela,
      series: [
        { nome: "Carteira 60/40 americana, em reais", valores: carteira6040Brl, destaque: true },
        { nome: "IHFA (multimercados)", valores: ihfaIdx },
        { nome: "CDI", valores: cdiIdx },
        { nome: "Ibovespa", valores: ibovIdx },
      ],
      formato: "indice",
      referencia: { valor: 100, rotulo: "Dezembro de 2009" },
      marcos: [{ em: "2024", rotulo: "Dólar acima de R$ 6" }],
      fonte:
        "Banco Central do Brasil, SGS 4391 (CDI) e SGS 3696 (PTAX de fim de mês); ANBIMA, IHFA, e B3, Ibovespa, retornos anuais via Mais Retorno; Aswath Damodaran, Historical Returns on Stocks, Bonds and Bills (jan/2026)",
      nota:
        "Carteira 60/40 como descrita na aula: 60% em títulos de 10 anos do Tesouro americano e 40% no S&P 500 com dividendos, rebalanceada uma vez por ano, sem custos nem impostos. Em dólar, a mesma carteira chega a 304.",
    },
    {
      tipo: "tabela",
      tempo: "24:30",
      titulo: "Os números da aula e a conta conferida, de jan/2010 a dez/2025",
      colunas: ["Índice", "Na aula", "Conferido, acumulado", "Conferido, ao ano"],
      linhas: [
        ["IHFA (multimercados)", "388%, cerca de 10% a.a.", "388%", "10,4%"],
        ["CDI", "340%, 9,7% a.a.", "340%", "9,7%"],
        ["Ibovespa", "135%", "135%", "5,5%"],
        ["Carteira 60/40 em dólar", "213%, 7,4% a.a.", "204%", "7,2%"],
        ["Dólar (PTAX)", "n/d", "216%", "7,5%"],
        ["Carteira 60/40 em reais", "890%, 15,4% a.a.", "861%", "15,2%"],
      ],
      fonte: "Mesmas fontes do gráfico acima",
      nota: "A diferença na carteira americana vem do índice de renda fixa: a conferência usa o título de 10 anos do Tesouro americano, da série de Damodaran; a aula não diz qual índice usou.",
    },
    {
      tipo: "simulador",
      id: "aportes-em-duas-moedas",
      titulo: "Aportes em duas moedas, medidos em reais",
      descricao:
        "Monte uma carteira com valor inicial e aportes mensais e mande uma parte de cada aporte para o dólar. Compare com a carteira que ficou toda em reais e mexa no câmbio para ver quanto do resultado depende dele. Nenhuma combinação aqui é recomendação.",
      modelo: "jurosCompostos",
      parametros: {
        taxaBrl: { valor: 10, ajuda: "O CDI rendeu em média 9,7% ao ano de 2010 a 2025 (BCB, SGS 4391)." },
        taxaUsd: { valor: 7, ajuda: "A carteira 60/40 da aula rendeu cerca de 7,2% ao ano em dólar de 2010 a 2025." },
        depreciacao: {
          valor: 4,
          ajuda:
            "De 2010 a 2025, o dólar subiu em média 7,5% ao ano contra o real, numa janela favorável; de 1994 a 2026, cerca de 5,5%. Há anos de queda. O passado não define o futuro.",
        },
      },
    },
    {
      tipo: "matriz",
      tempo: "26:46",
      modo: "quadrante",
      titulo: "Onde o dinheiro dolarizado faz sentido depende de quando e em que moeda ele será gasto",
      eixoLinhas: "Quando o dinheiro será usado",
      eixoColunas: "Em que moeda será gasto",
      linhas: ["Em até dois anos", "Em dez anos ou mais"],
      colunas: ["Em reais", "Em dólar"],
      celulas: [
        [
          {
            texto: "Reserva de emergência, obra, chamada de capital: dinheiro à mão, em reais.",
            explicacao:
              "A aula é clara: dinheiro que vai ser usado logo não deve ficar exposto ao sobe e desce do dólar e da bolsa americana. Nesse prazo, oscilação é risco, e não diversificação.",
            marca: "Fora, segundo a aula",
          },
          {
            texto: "Viagem, curso ou compromisso em dólar com data marcada.",
            explicacao:
              "O risco é o câmbio no dia de pagar. Um investimento em dólar que vence perto da data do compromisso casa com ele; deixar o dinheiro em reais é que expõe você à moeda.",
          },
        ],
        [
          {
            texto: "Aposentadoria e patrimônio de longo prazo, com gastos em reais.",
            explicacao:
              "É onde mora o argumento do módulo: uma parte em dólar diminui a dependência de uma só economia, ao preço de oscilar quando medida em reais. Vale para a parte do patrimônio que você consegue ver cair sem vender.",
            marca: "Onde mora o argumento",
          },
          {
            texto: "Vida fora, filhos estudando no exterior, gastos atrelados a preços globais.",
            explicacao:
              "Para quem vai gastar em dólar, o lugar seguro é o dólar; a parte em reais é que carrega o risco de moeda. A pergunta certa não é real ou dólar, mas em que moeda estão os seus gastos futuros.",
          },
        ],
      ],
      fonte: "Síntese da aula, com o conceito de risco de base (Bodie, Kane e Marcus, Investments, cap. 28)",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A última recomendação é sobre o destino do dinheiro. Para uma obra, uma chamada de capital ou emergências do dia a dia, Rodolfo não recomenda o exterior: tanto a renda fixa quanto as ações americanas oscilam, e o dólar oscila junto. Dolarizar faz sentido para a parte do patrimônio que pode atravessar anos de sobe e desce sem ser vendida. Retorno e risco importam, mas são o prazo e a necessidade de ter o dinheiro à mão que decidem o que fica em cada lugar.",
        "O Módulo I termina onde começou, na concentração de risco, agora vista por dentro. A planilha mostra que o mercado americano é maior, mais líquido e mais variado. O comportamento decide se você vai estar lá quando os melhores dias chegarem. Rodolfo chama de inteligência emocional a capacidade de sustentar, nas semanas ruins, uma decisão tomada com calma, e diz que ela é tão importante quanto a análise que veio antes.",
      ],
    },
    {
      tipo: "destaque",
      texto: "O comportamento decide antes da planilha.",
      fonte: "Rodolfo Bastos, encerramento do Módulo I, 26:46",
    },
    {
      tipo: "referencias",
      itens: [
        {
          autor: "David F. Swensen",
          titulo: "Pioneering Portfolio Management: An Unconventional Approach to Institutional Investment",
          ano: 2000,
          nota: "Edição revista em 2009. As três ferramentas da gestão (alocação, hora de entrar e escolha do papel) e por que a primeira pesa mais.",
        },
        {
          autor: "Gary P. Brinson, L. Randolph Hood e Gilbert L. Beebower",
          titulo: "Determinants of Portfolio Performance",
          ano: 1986,
          nota: "Financial Analysts Journal. Em 91 fundos de pensão, a alocação explicou 93,6% do sobe e desce dos retornos.",
        },
        {
          autor: "Roger G. Ibbotson e Paul D. Kaplan",
          titulo: "Does Asset Allocation Policy Explain 40, 90, or 100 Percent of Performance?",
          ano: 2000,
          nota: "Financial Analysts Journal. Separa as três perguntas que a cifra de Brinson costuma misturar.",
        },
        {
          autor: "Zvi Bodie, Alex Kane e Alan J. Marcus",
          titulo: "Investments",
          ano: 2014,
          nota: "10ª ed. Caps. 5 e 7 (risco no longo prazo), 12 (vieses e rebalanceamento), 24 (retorno do fundo e do investidor) e 28 (objetivos, restrições e risco de base).",
        },
        {
          autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen",
          titulo: "Princípios de Finanças Corporativas",
          ano: 2013,
          nota: "10ª ed. Cap. 16: por que as empresas evitam cortar dividendo (Lintner), o que um aumento ou corte sinaliza e a tese de Miller e Modigliani.",
        },
        {
          autor: "Alexandre Assaf Neto",
          titulo: "Matemática Financeira e suas Aplicações",
          ano: 2012,
          nota: "12ª ed. Cap. 11: títulos com cupom, ágio, par e deságio.",
        },
        {
          autor: "J.P. Morgan Asset Management",
          titulo: "Guide to Retirement",
          ano: 2026,
          nota: "Gráfico \"Impact of being out of the market\", com dados até dez/2025. A edição de 2025 traz os números citados em aula.",
        },
      ],
    },
  ],
};

export default secao;

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
      resumo: "A decisão que mais pesa no resultado é quanto pôr em cada classe de ativo, e não quando entrar nem qual papel escolher.",
      tempo: "0:12",
    },
    {
      tipo: "texto",
      capitular: true,
      tempo: "0:12",
      paragrafos: [
        "Rodolfo Bastos fecha o Módulo I com uma tese que desloca o centro da conversa. Até aqui o curso tratou de razões para olhar para fora: escala, câmbio, risco fiscal, demografia. Esta aula trata do que acontece depois que a decisão está tomada. A planilha justifica internacionalizar, diz ele; o comportamento decide se a estratégia sobrevive às primeiras quedas.",
        "O ponto de partida é David Swensen, que dirigiu os investimentos do fundo patrimonial (endowment) da Universidade Yale de 1985 até morrer, em 2021, 36 anos à frente da carteira. Em Pioneering Portfolio Management, de 2000, Swensen divide a gestão em três ferramentas: a alocação entre classes de ativos, o timing (entrar e sair no momento certo) e a seleção de títulos (escolher a ação A ou o fundo B). A primeira, defende, domina as outras duas. A aula traduz a ideia numa conta didática: 80% do resultado de longo prazo viria da valorização natural dos mercados e 20% de timing e seleção.",
        "A literatura em que Swensen se apoia é ainda mais enfática, com uma ressalva que muda a leitura. Brinson, Hood e Beebower (1986) estudaram 91 grandes fundos de pensão americanos e concluíram que a política de alocação explicava, em média, 93,6% da variação dos retornos de cada fundo ao longo do tempo. Ibbotson e Kaplan (2000) separaram três perguntas: a política explica cerca de 90% das oscilações de um fundo no tempo, cerca de 40% da diferença de resultado entre fundos e, em média, praticamente 100% do nível de retorno, porque timing e seleção, somados e descontados os custos, tendem a se anular. O 80/20 da aula, portanto, é conservador; e o que os estudos medem é a variação dos retornos, não a fatia do lucro que cabe a cada decisão.",
        "Daí a recomendação prática da aula. Quem decidiu ter parte do patrimônio em dólar, porque gasta em dólar, porque quer uma reserva cambial ou porque pretende morar fora, faz a conversão em janelas: divide o valor em 12 parcelas mensais, ou em 5, ou em 15, e converte uma parcela por vez, em vez de tentar acertar o dia. O percentual, insiste Rodolfo, é individual, e zero é uma resposta legítima. O que a aula pede é que a decisão seja tomada com calma, por escrito, e depois respeitada.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "0:12",
      termo: "Política de alocação de ativos",
      definicao:
        "A divisão de longo prazo do patrimônio entre classes de ativos (caixa, renda fixa, ações, imóveis e, para o investidor brasileiro, também entre moedas e países), definida antes de escolher papéis e mantida por rebalanceamento. Bodie, Kane e Marcus descrevem o processo em quatro passos: definir as classes, formar expectativas de retorno e risco, derivar a fronteira eficiente e escolher a combinação que respeita objetivos e restrições. Timing e seleção operam dentro dessa moldura.",
      naPratica:
        "A pergunta \"quanto do patrimônio fica no Brasil e quanto fica fora\" é uma decisão de alocação, e portanto de primeira ordem: pesa mais no resultado do que a escolha do ETF ou do dia da conversão. Rebalancear depois de uma queda (vender o que subiu, comprar o que caiu, até voltar à fatia escolhida) é o oposto do impulso natural, e por isso convém deixar a regra escrita.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 7, box sobre Brinson, e cap. 28, seção 28.4", ano: 2014 },
    },
    {
      tipo: "conceito",
      tempo: "1:23",
      termo: "Custo médio em janelas",
      definicao:
        "Converter o mesmo valor em reais a intervalos regulares, independentemente da cotação. Como cada parcela compra mais dólares quando o dólar está barato e menos quando está caro, o preço médio pago é a média harmônica das cotações, que nunca supera a média simples delas. A técnica não aumenta o retorno esperado: estudos como o da Vanguard (2012) mostram que aplicar tudo de uma vez rendeu mais em cerca de dois terços das janelas históricas, porque o dinheiro passa mais tempo investido. O ganho é outro: a técnica elimina o risco de concentrar a conversão no pior dia e retira a decisão do campo da emoção.",
      formula: "preço médio = total em reais ÷ total de dólares = n ÷ Σ (1 ÷ câmbioᵢ)",
      naPratica:
        "Janelas são uma regra definida antes, do tipo que Bodie, Kane e Marcus recomendam contra os três erros clássicos de quem mexe na própria carteira: perseguir o que já subiu, esperar \"voltar ao preço\" para agir e ficar parado por medo de se arrepender. Quem espera o dólar cair para começar costuma esperar para sempre.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 12, box \"Why It's So Tough to Fix Your Portfolio\"", ano: 2014 },
    },
    {
      tipo: "tabela",
      tempo: "1:23",
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
        "Preço médio pago: R$ 12.000 ÷ US$ 2.270,76 = R$ 5,28, abaixo da média simples das cotações (R$ 5,30). Tudo de uma vez renderia entre US$ 2.069 (no mês mais caro) e US$ 2.449 (no mais barato): as janelas trocam a chance do melhor dia pela proteção contra o pior.",
    },

    // ---- 2. poucos dias explicam décadas ------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "poucos-dias-explicam-decadas",
      titulo: "Poucos dias explicam décadas",
      resumo: "Os melhores pregões aparecem colados aos piores, e quem sai na queda costuma perder a recuperação.",
      tempo: "2:25",
    },
    {
      tipo: "texto",
      tempo: "2:25",
      paragrafos: [
        "O argumento a favor de ficar investido vem de um gráfico que o J.P. Morgan Asset Management atualiza todo ano no Guide to Retirement: quanto rende uma aplicação no S&P 500 para quem fica o tempo todo dentro e para quem perde os 10, 20 ou 60 melhores dias. A aula cita uma versão de 1995 a 2022, com retorno médio perto de 8% ao ano. O número corresponde à variação do índice sem dividendos (de 459 para 3.840 pontos, cerca de 7,9% ao ano); com os dividendos reinvestidos, o S&P 500 rendeu perto de 9,8% ao ano no mesmo período, pela série de Aswath Damodaran. Nas edições que conferimos, todas com janelas de 20 anos, quem perde os 40 melhores dias termina com retorno próximo de zero ou negativo, como diz a aula.",
        "O padrão vem de uma regularidade estatística: os maiores pregões de alta acontecem no meio das crises, e não depois que elas passam. Na edição de 2025, sete dos dez melhores dias dos 20 anos anteriores ocorreram até duas semanas depois de um dos dez piores; na de 2026, seis. Em 2020, o segundo pior dia do ano, 12 de março, foi seguido no dia seguinte pelo segundo melhor. Quem vende para \"esperar passar\" quase sempre está fora quando a recuperação começa. É a queda forte de que fala Rodolfo: não a alta menor do que a esperada, mas a semana em que a carteira perde 10%, 15% ou 20% e o estômago decide no lugar da cabeça.",
        "A aula compara com o tênis. Roger Federer, em discurso de formatura em Dartmouth, em 2024, contou que venceu quase 80% das 1.526 partidas de simples que disputou, mas apenas 54% dos pontos (a aula fala em 43% ou 44% de pontos perdidos; foram 46%). Uma carreira vitoriosa feita de quase tantos pontos perdidos quanto ganhos é uma boa imagem para uma carteira de longo prazo.",
      ],
    },
    {
      tipo: "kpis",
      tempo: "4:06",
      titulo: "O investidor médio rendeu menos que qualquer classe de ativo",
      itens: [
        { rotulo: "Investidor médio", valor: 3.6, formato: { sufixo: "% a.a.", casas: 1 }, destaque: true, nota: "fundos americanos, segundo a Dalbar" },
        { rotulo: "Carteira 60/40", valor: 7.4, formato: { sufixo: "% a.a.", casas: 1 }, nota: "60% S&P 500, 40% títulos" },
        { rotulo: "S&P 500", valor: 9.5, formato: { sufixo: "% a.a.", casas: 1 }, nota: "com dividendos" },
        { rotulo: "Renda fixa americana", valor: 4.3, formato: { sufixo: "% a.a.", casas: 1 }, nota: "Bloomberg US Aggregate" },
      ],
      fonte: "J.P. Morgan Asset Management, Guide to the Markets, 3T/2022, com dados da Dalbar Inc.",
      nota:
        "Retornos anualizados de 2002 a 2021, em dólar. Conferidos em reproduções do gráfico. REITs (11%) e ações emergentes (10%), citados em aula, aparecem no mesmo gráfico e não foram conferidos na edição original. Na carteira 60/40 do J.P. Morgan, 60% são ações; a aula descreve o inverso.",
    },
    {
      tipo: "conceito",
      tempo: "4:06",
      termo: "Retorno ponderado pelo tempo e pelo dinheiro",
      definicao:
        "O retorno ponderado pelo tempo é a média geométrica dos retornos de cada período e mede o desempenho do ativo ou do gestor, sem importar quando entrou ou saiu dinheiro. O ponderado pelo dinheiro é a taxa interna de retorno dos fluxos do próprio investidor e mede o que ele de fato ganhou: dá mais peso aos períodos em que havia mais dinheiro aplicado. Quem aporta depois de uma alta e resgata depois de uma queda tem retorno em dinheiro abaixo do retorno do fundo que comprou.",
      formula: "tempo: (1 + r)ⁿ = Π (1 + rₜ)   ·   dinheiro: r tal que Σ CFₜ ÷ (1 + r)ᵗ = 0",
      naPratica:
        "É essa diferença que o gráfico da Dalbar tenta medir, e o método é contestado: ele trata todo aporte como se devesse ter sido feito no início do período, o que pune quem simplesmente poupou aos poucos. Estimativas mais cuidadosas, como as da Morningstar, encontram uma distância menor, de um a dois pontos ao ano. A lição sobrevive à crítica: o retorno que importa é o da sua conta, calculado em reais e com o câmbio da data de cada aporte, e ele depende de comportamento.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 24, retornos ponderados pelo tempo e pelo dinheiro", ano: 2014 },
    },
    {
      tipo: "destaque",
      tempo: "5:15",
      texto: "O segredo não é o market timing, é o time in the market.",
      fonte: "Frase lembrada por Rodolfo Bastos, na aula, 5:15",
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
        "S&P 500 com dividendos reinvestidos, sem custos. Retornos anualizados: 11,0%, 6,6%, 3,8%, 1,6%, −0,3%, −1,9% e −3,4%. A aula usa a edição de 2025 (2005 a 2024): US$ 71.750 investido o tempo todo, US$ 32.871 sem os 10 melhores dias.",
    },
    {
      tipo: "texto",
      tempo: "7:02",
      paragrafos: [
        "Os números citados em aula, US$ 10 mil virando US$ 70 mil, US$ 32 mil sem os 10 melhores dias e US$ 12 mil sem os 30, vêm da edição de 2025 do mesmo gráfico, que cobre de janeiro de 2005 a dezembro de 2024. São 20 anos e cerca de 5.000 pregões, e não 25 anos e 6.300 dias, como diz a fala; por isso os 10 dias equivalem a 0,2% do período, e os 30 dias, a 0,6%. Na edição de 2025, perder os 10 melhores dias levava o valor final de US$ 71.750 para US$ 32.871, uma queda de 54%, e perder os 30 deixava um retorno de 1,4% ao ano, perto de US$ 13 mil, cerca de 82% abaixo de quem ficou. Na edição de 2026, acima, as proporções se repetem.",
        "Vale a ressalva honesta que o próprio raciocínio pede. Ficar investido não elimina o risco; o tempo não o dilui. Bodie, Kane e Marcus mostram que, num horizonte longo, cai a probabilidade de a bolsa render menos que a renda fixa, mas cresce o tamanho da perda possível nos piores cenários: o seguro contra esse resultado fica mais caro, e não mais barato, com o prazo. Por isso o argumento da aula é de alocação, e não de aposta: a fatia em dólar ou em bolsa deve ser aquela que o investidor consegue carregar na pior semana, porque é nela que a decisão é testada.",
      ],
    },

    // ---- 3. um mercado de outro tamanho --------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "um-mercado-de-outro-tamanho",
      titulo: "Um mercado de outro tamanho",
      resumo: "Ações e títulos americanos somam dezenas de vezes o mercado brasileiro; isso é mais alternativa, não melhor ou pior.",
      tempo: "8:05",
    },
    {
      tipo: "texto",
      tempo: "8:05",
      paragrafos: [
        "A segunda parte da aula sai da comparação de taxas de juros, os 15% de cá contra os 3% ou 4% de lá, para a comparação de tamanho. Pelo levantamento da SIFMA, a associação das corretoras e bancos de investimento americanos, as ações listadas nos Estados Unidos valiam US$ 68,9 trilhões no fim de 2025, 43,7% do valor de todas as bolsas do mundo. As companhias da B3 somavam R$ 4,7 trilhões em dezembro, segundo a Elos Ayta, perto de US$ 0,85 trilhão ao câmbio do último dia do ano. A proporção passa de 80 para 1. A aula cita US$ 35,7 trilhões contra US$ 1 trilhão, 35 vezes, número de outra base ou data; a ordem de grandeza é a mesma, e a Nvidia sozinha, com mais de US$ 5 trilhões, vale mais que toda a bolsa brasileira.",
        "Na renda fixa, a aula soma US$ 14 trilhões em títulos corporativos e US$ 34 trilhões em títulos de governo, o que dá 48 trilhões, e não os 50 ditos, contra US$ 2,4 trilhões no Brasil. A SIFMA registra US$ 61,2 trilhões em títulos americanos em circulação em 2025, 38,1% do total mundial, somando Tesouro, hipotecas securitizadas, empresas, agências e municípios. Só a dívida pública federal brasileira chegou a R$ 8,6 trilhões em dezembro de 2025, cerca de US$ 1,6 trilhão; com debêntures e outros títulos privados, o total se aproxima do número da aula.",
        "Rodolfo insiste na leitura: tamanho não é qualidade. Um mercado maior oferece mais emissores, mais prazos, mais setores e mais liquidez, isto é, a possibilidade de vender rápido sem derrubar o preço. A aula fala em liquidez 46 vezes maior nos Estados Unidos, número que depende do critério e que não conseguimos reproduzir; a direção é incontroversa. Para o investidor brasileiro, a consequência é que os dois mercados são complementares, e não substitutos.",
      ],
    },
    {
      tipo: "kpis",
      tempo: "8:05",
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
      resumo: "Aluguel, cupom e dividendo crescente têm em comum o dinheiro que cai em data conhecida; só o cupom é contratual.",
      tempo: "10:09",
    },
    {
      tipo: "texto",
      tempo: "10:09",
      paragrafos: [
        "A provocação mais original da aula é sobre vocabulário. O brasileiro chama de renda fixa a aplicação pós-fixada que rende um pouco todo mês, atrelada ao CDI. Rodolfo propõe outra definição: renda fixa é dinheiro que cai na conta em datas e valores combinados. O aluguel de um imóvel sem inadimplência é renda fixa nesse sentido; o cupom semestral de um título prefixado ou de uma NTN-B também. O CDI, régua mental do investidor brasileiro, mede um rendimento estável em reais, e não um fluxo, nem o poder de compra em dólar.",
        "A distinção tem consequência prática. Um título com cupom tem preço que oscila no caminho, a chamada marcação a mercado, mas quem o leva até o vencimento recebe exatamente o fluxo contratado. A aula estende a ideia às ações americanas que pagam dividendos crescentes há décadas: se o dividendo cobre a escola dos filhos, o aluguel ou o padrão de vida, a ação pode cumprir a função de uma renda fixa, ainda que o preço dela varie.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "10:56",
      termo: "Título com cupom",
      definicao:
        "Um título que paga juros periódicos (os cupons, em geral semestrais) e devolve o principal no vencimento. O preço de hoje é o valor presente desse fluxo, descontado à taxa que o mercado exige. Se essa taxa cai abaixo do cupom, o título passa a valer mais que o valor de face (ágio); se sobe, vale menos (deságio). O fluxo prometido não muda; muda o preço de quem precisa vender antes.",
      formula: "P₀ = Σ C ÷ (1 + K)ᵗ + F ÷ (1 + K)ⁿ",
      naPratica:
        "É o sentido de renda fixa da aula: o que está fixo é o fluxo, não o preço. Uma NTN-B com cupom ou um Treasury levado ao vencimento entregam o combinado; vendidos no meio do caminho, entregam o preço do dia. Quem precisa do dinheiro numa data deve escolher um título que vença perto dela.",
      referencia: { autor: "Alexandre Assaf Neto", obra: "Matemática Financeira e suas Aplicações", capitulo: "cap. 11, seções 11.3.3 e 11.3.4", ano: 2012 },
    },
    {
      tipo: "tabela",
      tempo: "11:53",
      titulo: "Reis, aristocratas e um banco que cortou o dividendo",
      colunas: ["Caso", "Critério ou fato", "Situação"],
      linhas: [
        ["Dividend Aristocrats", "Empresas do S&P 500 que aumentaram o dividendo por pelo menos 25 anos seguidos; índice oficial, de pesos iguais, revisto todo ano", "69 empresas em 2025, o número da aula"],
        ["Dividend Kings", "50 anos ou mais de aumentos seguidos; convenção de mercado, sem índice oficial", "Cerca de 55 em listas independentes (a aula fala em mais de 54)"],
        ["Procter & Gamble", "Aumentou o dividendo pela 70ª vez seguida em abril de 2026; paga dividendos há 136 anos", "King (69 anos na época da gravação)"],
        ["JPMorgan Chase", "Cortou o dividendo trimestral de US$ 0,38 para US$ 0,05 por ação em fevereiro de 2009, para reforçar o capital na crise", "Fora das duas listas; voltou a elevar o dividendo a partir de 2011"],
      ],
      fonte: "S&P Dow Jones Indices, metodologia do S&P 500 Dividend Aristocrats; Procter & Gamble, comunicado de 14/abr/2026; JPMorgan Chase, comunicado de 23/fev/2009 e formulário 10-Q",
      nota: "Pagamentos são declarados pelo conselho a cada trimestre, com datas regulares, mas sem obrigação contratual.",
    },
    {
      tipo: "texto",
      tempo: "12:50",
      paragrafos: [
        "O exemplo do JPMorgan pede cuidado. A aula diz que a ação foi King até 2008 e perdeu o status naquele ano, mantendo os pagamentos. Os registros mostram outra coisa: o banco nunca acumulou 50 anos de aumentos seguidos e, em fevereiro de 2009, cortou o dividendo trimestral em 87%, de US$ 0,38 para US$ 0,05 por ação, para preservar cerca de US$ 5 bilhões de capital por ano no auge da crise. O pagamento continuou, mas encolheu, e quem dependia dele para pagar contas viu a renda cair a um oitavo de um trimestre para o outro.",
        "É a ressalva que separa o dividendo do cupom. O cupom de um título é obrigação; deixar de pagá-lo é calote. O dividendo é decisão do conselho, que pode reduzi-lo quando o lucro some ou o capital aperta. As empresas sabem que o mercado pune cortes e por isso suavizam os pagamentos, mas a suavização é um hábito, não uma garantia. E, em mercado sem atritos, Miller e Modigliani mostraram que a política de dividendos não altera o valor da empresa: quem quer renda pode vender uma fração das ações. Na prática, impostos e custos fazem diferença, e o dividendo americano pago a residente no Brasil sofre retenção na fonte nos Estados Unidos, tema do Módulo III. Uma carteira de pagadores consistentes pode funcionar como fonte de renda, desde que diversificada o bastante para absorver o corte de um deles.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "13:53",
      termo: "Suavização de dividendos",
      definicao:
        "Lintner (1956) observou que os gestores fixam o dividendo pelo lucro de longo prazo e o ajustam devagar em direção a uma meta de distribuição, evitando cortes. Brav, Graham, Harvey e Michaely (2005) confirmaram o padrão: 93,8% dos executivos entrevistados disseram evitar reduzir o dividendo. Por isso um aumento costuma ser lido como sinal de confiança, e um corte, como sinal de dificuldade.",
      formula: "Dₜ − Dₜ₋₁ = c × (meta de distribuição × lucroₜ − Dₜ₋₁),  com 0 < c < 1",
      naPratica:
        "A sequência de 50 ou 70 anos de aumentos é evidência de disciplina, não promessa. Ela tende a se manter em tempos normais e pode quebrar justamente quando o investidor mais precisa da renda, como em 2008 e 2009. Concentrar a renda de que se vive em poucos pagadores reintroduz o risco que o curso tenta diluir.",
      referencia: { autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen", obra: "Princípios de Finanças Corporativas", capitulo: "cap. 16, seções 16.3 a 16.5", ano: 2013 },
    },

    // ---- 5. commodities aqui, tecnologia lá ----------------------------------------------------------
    {
      tipo: "capitulo",
      id: "commodities-aqui-tecnologia-la",
      titulo: "Commodities aqui, tecnologia lá",
      resumo: "A bolsa de cada país reflete a economia que ele tem; diversificar entre as duas é diversificar entre setores.",
      tempo: "14:31",
    },
    {
      tipo: "texto",
      tempo: "14:31",
      paragrafos: [
        "A aula compara a composição do S&P 500 e do Ibovespa de 1990 a 2025. Pelos números de Rodolfo, o índice americano tinha 9% em tecnologia e 6% em commodities em 1990 e chegou a 31% em tecnologia; o Ibovespa foi de 24% para 42% em commodities, com tecnologia parada em 4%. Não há série pública comparável para conferir 1990: a classificação setorial usada hoje por índices do mundo todo, o GICS, foi criada pela MSCI e pela S&P em 1999, e os pesos anteriores são reconstruções. O retrato atual, porém, é verificável e confirma o argumento: no fim de setembro de 2026, tecnologia da informação era 39,5% do MSCI USA e zero no MSCI Brazil, onde energia e materiais somavam 31,5% e o setor financeiro, 39,1%.",
        "\"Então a bolsa brasileira é antiquada?\", pergunta a aula, e responde que não. A bolsa reflete a economia. O Brasil é o maior exportador mundial de soja e de café, o segundo produtor de minério de ferro, atrás da Austrália, e um dos maiores produtores de petróleo. Há boas oportunidades nesses setores, mas comprar Ibovespa não dá exposição a inteligência artificial, semicondutores, software ou à maior parte da saúde. Rodolfo cita um exemplo fora do óbvio: as empresas americanas de self storage, os depósitos alugados por quem mudou para um apartamento menor e não tem onde guardar a prancha ou os tacos de golfe. Mercado maior significa também nichos que nem existem na bolsa local.",
        "Uma ressalva completa o quadro, e ela reforça o eixo do curso. O índice americano também é concentrado: as dez maiores empresas respondiam por 38% do MSCI USA em setembro de 2026, quase todas de tecnologia. Em março de 2000, 87% do Nasdaq 100 estava em tecnologia e comunicações, e o índice caiu 64% nos 21 meses seguintes, enquanto o S&P 500 caiu 23%. Trocar uma concentração por outra não é diversificar; o ganho está na combinação das duas.",
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
        "Classificação GICS. Energia e materiais somados: 18,42% e 13,12% no Brasil; 3,48% e 1,73% nos EUA. Setores omitidos: industriais, consumo, comunicação e imobiliário. Os números da aula para 1990 não têm série pública comparável.",
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
      tempo: "18:03",
      paragrafos: [
        "Depois de olhar para trás, a aula olha para a frente com uma pergunta de analista: quais setores ganham com a idade média da população? O padrão de gasto por faixa etária é conhecido. Jovens gastam proporcionalmente mais com educação e transporte; entre os 30 e os 60, pesam moradia, carro, viagens e consumo em geral; depois dos 65, sobem saúde, remédios, planos e bem-estar. A pesquisa de orçamentos do Bureau of Labor Statistics americano mostra o tamanho da curva: em 2022, as famílias chefiadas por alguém com menos de 25 anos dedicaram 2,9% do gasto à saúde; as chefiadas por alguém com 65 anos ou mais, 13%.",
        "A demografia já apareceu no curso, na aula de Felippe Hermes, como problema fiscal: fecundidade abaixo da reposição e previdência em regime de repartição. Aqui o ângulo é outro, o do consumo. Pelas projeções do IBGE de 2024, a população brasileira, de 214,2 milhões em 2026, para de crescer em 2041 e cai para 199,2 milhões em 2070, quando 37,8% dos brasileiros terão 60 anos ou mais. A aula usa o corte de 65 anos: 11% hoje e 31% em 2070.",
        "Os Estados Unidos também envelhecem, mas a população continua crescendo, e a diferença tem nome: imigração. O Census Bureau estimou 341,8 milhões de habitantes em julho de 2025. No cenário central das projeções de 2023, a população chega perto de 370 milhões por volta de 2080 e a fatia com 65 anos ou mais passa de 17% em 2022 para 23% em 2050 (a aula fala em 26%, para um horizonte mais longo). A imigração decide o resto: em 2100, a população seria de 319 milhões com pouca imigração e de 435 milhões com muita. O Brasil, lembra Rodolfo, exporta gente; os Estados Unidos importam, e com ela importam consumidores na faixa de 30 a 60 anos. Não é questão de melhor ou pior. É saber em que mercado estarão as empresas de saúde, consumo e educação que vão atender essas populações nos próximos 30 ou 40 anos, o horizonte de quem tem 30 anos hoje.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "18:03",
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
      nota: "Moradia, o maior item em todas as faixas (de 31% a 36%), foi omitida para não achatar a escala.",
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
        ["Motor do crescimento", "Crescimento natural, em queda; saldo migratório baixo", "Imigração, que define o cenário de longo prazo"],
      ],
      fonte: "IBGE, Projeções da População, revisão 2024, e Estimativas da População 2026; U.S. Census Bureau, 2023 National Population Projections e Vintage 2025",
      nota:
        "Os dois institutos divulgam cortes etários diferentes como destaque, por isso as linhas de idosos não são diretamente comparáveis. A aula cita 65 anos ou mais: 11% para 31% no Brasil e 17% para 26% nos EUA.",
    },

    // ---- 7. uma janela favorável --------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "uma-janela-favoravel",
      titulo: "Uma janela favorável, e o que ela não prova",
      resumo: "De 2010 a 2025, a carteira americana em reais superou CDI, multimercados e bolsa; boa parte veio do câmbio.",
      tempo: "22:22",
    },
    {
      tipo: "texto",
      tempo: "23:18",
      paragrafos: [
        "O fechamento da aula é um comparativo de 16 anos, de janeiro de 2010 a dezembro de 2025, e os números de Rodolfo resistem à conferência. O IHFA, índice de fundos multimercados da ANBIMA, acumulou 388%, 10,4% ao ano. O CDI acumulou 340%, 9,7% ao ano, pela série do Banco Central. O Ibovespa foi de 68.588 para 161.125 pontos, alta de 135%, cerca de 5,5% ao ano. Uma carteira americana com 60% em títulos do Tesouro e 40% no S&P 500, rebalanceada a cada ano, rendeu cerca de 204% em dólar, 7,2% ao ano, perto dos 213% e 7,4% da aula, que usou outro índice de renda fixa.",
        "Para comparar na mesma moeda, a aula converte a carteira americana para reais. O dólar foi de R$ 1,74 no fim de 2009 para R$ 5,50 no fim de 2025, alta de 216%, 7,5% ao ano. Compondo as duas coisas, (1 + 7,2%) × (1 + 7,5%), a carteira rendeu cerca de 15,2% ao ano em reais e acumulou 861%; a aula fala em 15,4% e 890%. A conta não é uma soma simples, e sim um produto, mas para taxas desse tamanho os dois resultados ficam próximos.",
        "Rodolfo faz questão de desmontar a conclusão apressada. A janela foi favorável, e ele diz isso: começa com o dólar a R$ 1,74, perto das mínimas daquela década, e termina depois de quinze anos de desvalorização do real. Cerca de metade da taxa anual em reais veio do câmbio. Em outras janelas, a conta muda: quem converteu no fim de 2024, com o dólar acima de R$ 6, chegou ao fim de 2025 com a carteira praticamente parada em reais, porque o câmbio caiu cerca de 11% e anulou o rendimento em dólar. Nem sempre o exterior vai ganhar. O argumento é outro: diversificar entre moedas e mercados reduz a dependência de uma única economia, e isso vale também nos anos em que o Brasil vai melhor.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "23:18",
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
        "Carteira 60/40 como descrita na aula: 60% em Treasury de 10 anos e 40% no S&P 500 com dividendos, rebalanceada uma vez por ano, sem custos nem impostos. Em dólar, a mesma carteira chega a 304.",
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
      nota: "A diferença na carteira americana vem do índice de renda fixa: a conferência usa o Treasury de 10 anos da série de Damodaran; a aula não nomeia o índice.",
    },
    {
      tipo: "simulador",
      id: "aportes-em-duas-moedas",
      tempo: "24:30",
      titulo: "Aportes em duas moedas, medidos em reais",
      descricao:
        "Uma carteira com valor inicial e aportes mensais, em que uma fatia de cada aporte vai para o dólar. Compare com a carteira que ficou inteira em reais e mude o câmbio anual para ver quanto do resultado depende dele. Nenhuma combinação aqui é recomendação.",
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
            texto: "Reserva de emergência, obra, chamada de capital: liquidez em reais.",
            explicacao:
              "A aula é explícita: dinheiro com uso próximo não deve ficar exposto à volatilidade do câmbio e da bolsa americana. Nesse prazo, a oscilação é risco, e não diversificação.",
            marca: "Fora, segundo a aula",
          },
          {
            texto: "Viagem, curso ou compromisso em dólar com data marcada.",
            explicacao:
              "O risco é o câmbio na data do pagamento. Um ativo em dólar de prazo próximo ao do compromisso casa com ele; uma aplicação em reais é que carrega o risco de moeda.",
          },
        ],
        [
          {
            texto: "Aposentadoria e patrimônio de longo prazo, com gastos em reais.",
            explicacao:
              "É onde mora o argumento do módulo: uma fatia em dólar diversifica o risco de uma só economia, ao preço de oscilar quando medida em reais. Vale para a parte do patrimônio que o investidor consegue ver cair sem vender.",
            marca: "Onde mora o argumento",
          },
          {
            texto: "Vida fora, filhos estudando no exterior, gastos atrelados a preços globais.",
            explicacao:
              "Para quem vai gastar em dólar, o ativo sem risco é o de dólar; a parte em reais é que carrega o risco de moeda. A pergunta certa não é real ou dólar, mas em que moeda estão os gastos futuros.",
          },
        ],
      ],
      fonte: "Síntese da aula, com o conceito de risco de base (Bodie, Kane e Marcus, Investments, cap. 28)",
    },
    {
      tipo: "texto",
      tempo: "26:46",
      paragrafos: [
        "A última recomendação é sobre destino. Dinheiro para uma obra, para uma chamada de capital ou para emergências do dia a dia não deve ir para o exterior, diz Rodolfo, porque oscila demais, seja em renda fixa ou em ações americanas, e porque o câmbio oscila junto. Dolarizar faz sentido para a parte do patrimônio que pode atravessar anos de volatilidade sem ser vendida. É a mesma lógica dos objetivos e restrições que orienta qualquer política de investimento: retorno e risco importam, mas liquidez e horizonte decidem o que pode ficar em cada lugar.",
        "O Módulo I termina onde começou, na concentração de risco, agora vista por dentro. A planilha mostra que o mercado americano é maior, mais líquido e mais diverso; o comportamento decide se o investidor vai estar lá quando os melhores dias chegarem. Rodolfo chama de inteligência emocional a capacidade de sustentar, nas semanas ruins, uma decisão tomada com calma, e põe essa capacidade no mesmo nível da análise que a precedeu.",
      ],
    },
    {
      tipo: "destaque",
      tempo: "26:46",
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
          nota: "Edição revista em 2009. As três ferramentas da gestão (alocação, timing e seleção) e o peso da alocação no resultado.",
        },
        {
          autor: "Gary P. Brinson, L. Randolph Hood e Gilbert L. Beebower",
          titulo: "Determinants of Portfolio Performance",
          ano: 1986,
          nota: "Financial Analysts Journal. A política de alocação explicou 93,6% da variação dos retornos de 91 fundos de pensão.",
        },
        {
          autor: "Roger G. Ibbotson e Paul D. Kaplan",
          titulo: "Does Asset Allocation Policy Explain 40, 90, or 100 Percent of Performance?",
          ano: 2000,
          nota: "Financial Analysts Journal. As três perguntas que a cifra de Brinson costuma misturar.",
        },
        {
          autor: "Zvi Bodie, Alex Kane e Alan J. Marcus",
          titulo: "Investments",
          ano: 2014,
          nota: "10ª ed. Caps. 5 e 7 (risco no longo prazo e a falácia da diversificação temporal), 12 (vieses e rebalanceamento), 24 (retorno ponderado pelo tempo e pelo dinheiro) e 28 (objetivos, restrições e risco de base).",
        },
        {
          autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen",
          titulo: "Princípios de Finanças Corporativas",
          ano: 2013,
          nota: "10ª ed. Cap. 16: suavização de dividendos (Lintner), conteúdo informativo e a irrelevância de Miller e Modigliani.",
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

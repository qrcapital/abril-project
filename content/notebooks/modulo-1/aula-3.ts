import type { SecaoDaAula } from "@/lib/notebook";

// Módulo II, aula 3 (Tony Volpon, cerca de 46 min), escrita em 08/out/2026. ESTA AULA VALE POR DUAS:
// o módulo foi planejado com "Comprando ações nos EUA" e "Dividendos vs. growth investing", e o Tony
// gravou as duas num vídeo só. O dono do curso pediu um notebook à altura das duas, então esta seção
// é mais densa que as outras e se divide em duas partes, na ordem da fala (transcrição em
// `transcricoes/modulo-1/aula-3.txt`): Parte 1, ações americanas (tamanho do mercado, o que é uma
// ação, dividendos e recompras, os três motores do retorno, o que o índice esconde, o prêmio de 125
// anos, quedas e horizonte, câmbio, eras de decepção, o S&P 500 como índice de tecnologia e os EUA
// contra os outros desenvolvidos); Parte 2, crescimento, valor e dividendos (os dois estilos, o que
// a empresa faz com o lucro, pesos iguais contra pesos por valor, as duas camadas de diversificação
// e o debate das Treasuries, o S&P 500 contra o Ibovespa em dólar e a assimetria entre perdas e
// ganhos).
//
// NÚMEROS CONFERIDOS EM 08/OUT/2026 nas fontes citadas em cada bloco: UBS Global Investment Returns
// Yearbook 2025, resumo público (Dimson, Marsh e Staunton; 1900 a 2024); Aswath Damodaran,
// histretSP (atualização de jan/2026; inflação até 2023 na versão de jan/2024 e, em 2024 e 2025, o
// CPI de dezembro a dezembro do BLS, 2,9% e 2,7%); multpl.com (dividend yield e CAPE de Shiller);
// MSCI (factsheets de 30/set/2026 de USA, World ex USA, USA Value, USA Equal Weighted, e de
// 31/ago/2026 do USA Growth); SPDR S&P 500 ETF (carteira de 5/out/2026, via Business Quant); S&P Dow
// Jones Indices (recompras e dividendos, 12 meses até set/2025); CME Group (peso de tecnologia,
// jul/2026); First Trust com dados da Bloomberg (peso de tecnologia em ago/2022); Hartford Funds
// (eras de crescimento e valor, Russell 1000, 3T/2026); Yardeni Research (quedas do S&P 500); EFA
// como aproximação do MSCI EAFE (ChartRow); Banco Central do Brasil (SGS 3696, dólar de fim de mês,
// e SGS 7845, Ibovespa até 2018) e fechamentos anuais da B3 de 2019 a 2025; SIFMA (Fact Book 2026).
//
// DIVERGÊNCIAS ENTRE A FALA E AS FONTES, registradas com leveza no texto: os 6,6% são retorno real
// (a aula também os chama de nominal); US$ 107.409 e US$ 67 são valores nominais; os prêmios de 4,7 e
// 3,4 pontos fecham com a carteira mundial, não com a americana (6,1 e 4,9); Nixon renunciou antes
// da votação do impeachment; houve quedas perto de 50% também em 1937-38 e 1973-74; nos EUA o
// dividendo qualificado paga a mesma alíquota do ganho de capital de longo prazo, e a vantagem da
// recompra é sobretudo adiar o imposto; "retorno real, então leva em conta dividendos" mistura retorno
// real com retorno total; o S&P 500 contra o Ibovespa dá 8,7% contra 5,4% ao ano em dólar de 2001 a
// 2025 (na aula, 8,8 e 6,6).
//
// ITENS DO SUPER DOSSIÊ USADOS (RANKING-MODULO-II.md, seção "Aula 3"): VAL-020, BMA-028, BMA-025,
// BKM-026, VAL-021, BMA-029, VAL-030, VAL-032, BMA-016, VAL-049, VAL-012, VAL-013, VAL-014,
// BMA-019, BMA-021, BMA-022, BMA-023, VAL-016, AMC-064, AMC-067, AMC-083, BKM-050, BMA-031, BKM-037,
// BMA-030, BKM-025, BMA-047 e BKM-063.
//
// PONTES: a aula 4 do Módulo I (Rodolfo Bastos) já tratou de Dividend Kings e Aristocrats, dos melhores
// dias, da composição setorial S&P x Ibovespa e da carteira 60/40 em reais. Aqui esses temas só
// aparecem como ponte curta. Tom conforme `docs/TOM-DO-NOTEBOOK.md`.

// ---- séries ----------------------------------------------------------------------------------------

// Dividend yield do S&P 500 em 31 de dezembro de cada ano (multpl.com, com dados de Shiller e S&P).
const anosDy = Array.from({ length: 76 }, (_, i) => String(1950 + i));
const dy = [
  7.44, 6.02, 5.41, 5.84, 4.4, 3.61, 3.75, 4.44, 3.27, 3.1, 3.43, 2.82, 3.4, 3.07, 2.98, 2.97, 3.53, 3.06, 2.88, 3.47, 3.49, 3.1,
  2.68, 3.57, 5.37, 4.15, 3.87, 4.98, 5.28, 5.24, 4.61, 5.36, 4.93, 4.31, 4.58, 3.81, 3.33, 3.66, 3.53, 3.17, 3.68, 3.14, 2.84,
  2.7, 2.89, 2.24, 2.0, 1.61, 1.36, 1.17, 1.22, 1.37, 1.79, 1.61, 1.62, 1.76, 1.76, 1.87, 3.23, 2.02, 1.83, 2.13, 2.2, 1.94, 1.92,
  2.11, 2.03, 1.84, 2.09, 1.83, 1.58, 1.29, 1.71, 1.5, 1.24, 1.15,
];

// CAPE de Shiller (P/L sobre o lucro real médio de dez anos) em janeiro de cada ano, e o de 7/out/2026.
const anosCape = [...Array.from({ length: 67 }, (_, i) => String(1960 + i)), "out/2026"];
const cape = [
  18.34, 18.47, 21.2, 19.26, 21.63, 23.27, 24.06, 20.43, 21.51, 21.19, 17.09, 16.46, 17.26, 18.71, 13.53, 8.92, 11.19, 11.44,
  9.24, 9.26, 8.85, 9.26, 7.39, 8.76, 9.89, 10.0, 11.72, 14.92, 13.9, 15.09, 17.05, 15.61, 19.77, 20.32, 21.41, 20.22, 24.76,
  28.33, 32.86, 40.57, 43.77, 36.98, 30.28, 22.9, 27.66, 26.59, 26.47, 27.21, 24.02, 15.17, 20.53, 22.98, 21.21, 21.9, 24.86,
  26.49, 24.21, 28.06, 33.31, 28.38, 30.99, 34.51, 36.94, 28.34, 31.97, 37.14, 39.65, 41.8,
];

// Retorno real médio composto por década, S&P 500 com dividendos, descontada a inflação americana.
// Conta sobre os retornos anuais de Damodaran (1930 a 2025).
const decadas = ["Anos 30", "Anos 40", "Anos 50", "Anos 60", "Anos 70", "Anos 80", "Anos 90", "Anos 2000", "Anos 2010", "2020 a 2025"];
const realDecada = [1.1, 3.0, 16.9, 5.1, -1.4, 11.7, 14.7, -3.4, 11.5, 10.6];

// S&P 500 com dividendos (Damodaran) e Ibovespa convertido pela PTAX de fim de ano (SGS 3696), em
// dólar, fim de 1999 = 100. Ibovespa: SGS 7845 até 2018 e fechamentos da B3 de 2019 a 2025.
const anosBr = Array.from({ length: 27 }, (_, i) => String(1999 + i));
const spUsd = [100, 91, 80, 63, 80, 89, 93, 108, 114, 72, 91, 104, 107, 123, 163, 185, 188, 210, 255, 244, 321, 378, 486, 398, 502, 627, 739];
const ibovUsd = [100, 82, 61, 33, 81, 103, 150, 218, 378, 168, 412, 435, 317, 312, 230, 197, 116, 193, 242, 237, 300, 240, 197, 220, 290, 203, 307];

// MSCI USA Equal Weighted e MSCI USA, retorno de preço em dólar, por ano (factsheet de 30/set/2026).
const anos1225 = Array.from({ length: 14 }, (_, i) => String(2012 + i));
const msciEw = [15.05, 33.57, 11.32, -4.24, 12.09, 17.14, -9.73, 27.59, 13.1, 23.81, -18.44, 15.45, 12.78, 8.44];
const msciUsaPreco = [13.52, 29.85, 11.1, -0.77, 9.21, 19.5, -6.33, 29.07, 19.22, 25.24, -20.76, 25.05, 23.4, 16.29];

// Quanto cada estilo ganhou ou perdeu do índice-mãe a cada ano, em pontos percentuais. Crescimento:
// MSCI USA Growth menos MSCI USA, retorno de preço (factsheet de 31/ago/2026). Valor: MSCI USA Value
// menos MSCI USA, retorno líquido com dividendos (factsheet de 30/set/2026). Cada estilo é comparado
// ao índice na mesma base, por isso as duas linhas podem ser lidas lado a lado.
const crescMenosIndice = [2.01, 1.15, 1.88, 4.04, -4.1, 7.71, 3.31, 7.33, 22.79, 0.48, -11.59, 20.81, 12.0, 4.31];
const valorMenosIndice = [-1.37, -0.57, -1.33, -3.51, 4.94, -6.77, -2.92, -6.27, -20.68, -0.16, 12.89, -18.14, -11.03, -4.34];

const secao: SecaoDaAula = {
  aula: 3,
  blocos: [
    // ================================================================================================
    // PARTE 1 · AÇÕES AMERICANAS
    // ================================================================================================

    // ---- 1. o maior mercado, e o que você compra nele ------------------------------------------------
    {
      tipo: "capitulo",
      id: "parte-1-acoes-americanas",
      titulo: "Parte 1 · Ações americanas: o maior mercado e o que você compra nele",
      resumo: "Quase metade do valor de todas as bolsas do mundo, muito concentrada em poucas empresas. E uma ação é um contrato bem diferente de um título.",
      tempo: "0:00",
    },
    {
      tipo: "texto",
      capitular: true,
      paragrafos: [
        "Pense nas cinco empresas que você mais usa num dia comum: o celular, o buscador, a loja online, a rede social, o programa do trabalho. É provável que quase todas tenham ações negociadas em Nova York. Esta aula é sobre essa bolsa, a maior do planeta, e sobre como ela paga quem fica nela.",
        "Ela vale por duas. O módulo foi planejado com uma aula sobre comprar ações nos Estados Unidos e outra sobre dividendos e crescimento, e Tony Volpon, ex-diretor do Banco Central, juntou as duas numa gravação só. Por isso o notebook também tem duas partes: a primeira sobre o mercado americano e o que ele pagou em 125 anos; a segunda sobre os estilos de investir dentro dele, crescimento e valor, e sobre o que a empresa faz com o lucro.",
        "A tese de Tony aparece logo no começo. Num histórico longo, a bolsa americana entregou retornos maiores e mais consistentes que as outras, reflexo da maior economia do mundo e da liderança em tecnologia. Houve exceções, e ele mesmo lembra a principal: no começo dos anos 2000, os emergentes, inclusive o Brasil, foram melhor. Ainda assim, para ele, qualquer carteira montada fora do Brasil deve ter uma fatia relevante em ações americanas.",
      ],
    },
    {
      tipo: "kpis",
      tempo: "3:14",
      titulo: "Um mercado gigante, e concentrado",
      itens: [
        { rotulo: "Ações listadas nos EUA", valor: 68.9, formato: { prefixo: "US$ ", sufixo: " tri", casas: 1 }, nota: "fim de 2025, 43,7% do mundo" },
        { rotulo: "As sete maiores no S&P 500", valor: 34.9, formato: { sufixo: "%", casas: 1 }, destaque: true, nota: "5/out/2026; na aula, 32%" },
        { rotulo: "As dez maiores no S&P 500", valor: 39.3, formato: { sufixo: "%", casas: 1 }, nota: "5/out/2026" },
        { rotulo: "Dividendo do índice", valor: 1.1, formato: { sufixo: "% a.a.", casas: 1 }, nota: "MSCI USA, set/2026; na aula, 1,2%" },
      ],
      fonte: "SIFMA, Capital Markets Fact Book 2026; carteira do SPDR S&P 500 ETF (SPY) em 5/out/2026, via Business Quant; MSCI USA, factsheet de 30/set/2026",
      nota: "As sete: Nvidia, Apple, Microsoft, Amazon, Alphabet (duas classes de ação), Meta e Tesla. Na aula, Tony fala em cerca de US$ 75 trilhões para o mercado todo, número de outra data; o valor muda todo dia.",
    },
    {
      tipo: "texto",
      tempo: "4:30",
      paragrafos: [
        "Antes do prêmio, a pergunta básica: o que você compra quando compra uma ação? Imagine uma padaria que fatura R$ 1 milhão por ano. Desse dinheiro saem os salários, os impostos, a farinha, a energia e os juros do empréstimo do forno. Só o que sobra depois de pagar todo mundo é do dono. O acionista é esse dono: o último da fila, que fica com o resto.",
        "Daí vêm as diferenças para a renda fixa que você viu nas aulas anteriores. Um título tem vencimento e cupom combinados. A ação não tem nem um nem outro. Ela pode render muito quando a padaria prospera e pode valer quase nada quando as dívidas engolem o lucro. Esse sobe e desce é o risco que o mercado paga para você carregar, e é ele que a primeira parte da aula tenta medir.",
      ],
    },
    {
      tipo: "tabela",
      tempo: "5:25",
      titulo: "Como a empresa devolve dinheiro ao acionista, aqui e lá",
      colunas: ["", "Brasil", "Estados Unidos"],
      linhas: [
        ["Dividendo mínimo", "Obrigatório por lei; o estatuto fixa o mínimo, muitas vezes 25% do lucro ajustado", "Não existe; muitas empresas grandes não pagam nada"],
        ["Forma preferida", "Dividendos e juros sobre capital próprio", "Recompra de ações no mercado"],
        ["Imposto para o investidor local", "Regras próprias, com mudanças recentes", "Dividendo qualificado paga a mesma alíquota do ganho de longo prazo (0%, 15% ou 20%); a recompra só gera imposto quando o acionista vende"],
        ["Para quem mora no Brasil e investe lá", "Não se aplica", "Retenção de 30% na fonte sobre dividendos; ganho na venda segue a regra brasileira (Módulo III)"],
      ],
      fonte: "Lei 6.404/1976 (Lei das S.A.), art. 202; IRS, Topic 404 (Dividends) e Topic 409 (Capital Gains); IRS, Publication 515",
      nota: "Na aula, Tony diz que nos EUA o ganho de capital paga menos imposto que o dividendo. Para o dividendo qualificado, as alíquotas são iguais; a vantagem da recompra está em adiar o imposto até a venda, e em quem não vende não pagar nada naquele ano.",
    },
    {
      tipo: "conceito",
      termo: "Recompra de ações",
      definicao:
        "Imagine uma empresa com 100 ações e US$ 1.000 de lucro sobrando. Ela pode pagar US$ 10 a cada ação, como dividendo, ou usar os US$ 1.000 para comprar 10 ações de volta na bolsa e cancelá-las. No segundo caso, você não recebe nada na conta, mas passa a ser dono de um pedaço maior da mesma empresa: o lucro agora se divide por 90 ações, e não por 100. É a recompra.",
      naPratica:
        "Nos EUA, a fatia das empresas listadas que pagam dividendo caiu de 66,5% em 1978 para 20,8% em 1999, e a recompra ocupou o espaço. Num mundo sem impostos e sem custos, as duas saídas valem o mesmo, e quem precisa de renda pode vender um pouco das ações. Por isso o dividendo baixo do S&P 500 não quer dizer que as empresas devolvam pouco: elas devolvem mais por recompra do que por dividendo. Para o investidor brasileiro, a forma importa por causa do imposto retido lá fora sobre o dividendo, tema do Módulo III.",
      referencia: { autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen", obra: "Princípios de Finanças Corporativas", capitulo: "cap. 16, seções 16.1, 16.2, 16.5 e 16.7" },
    },
    {
      tipo: "kpis",
      titulo: "As empresas do S&P 500 devolvem mais por recompra do que por dividendo",
      itens: [
        { rotulo: "Recompras", valor: 1020, formato: { prefixo: "US$ ", sufixo: " bi", casas: 0 }, destaque: true, nota: "recorde, 12 meses até set/2025" },
        { rotulo: "Dividendos", valor: 664.9, formato: { prefixo: "US$ ", sufixo: " bi", casas: 1 }, nota: "recorde, mesmo período" },
        { rotulo: "Total devolvido", valor: 1685, formato: { prefixo: "US$ ", sufixo: " bi", casas: 0 }, nota: "alta de 9,8% em 12 meses" },
      ],
      fonte: "S&P Dow Jones Indices, comunicado de 18/dez/2025 sobre recompras e dividendos do S&P 500 no 3º trimestre de 2025",
    },

    // ---- 2. três motores, e o que o índice esconde ----------------------------------------------------
    {
      tipo: "capitulo",
      id: "tres-motores-do-retorno",
      titulo: "Os três motores do retorno, e o que o índice esconde",
      resumo: "Dividendo, crescimento do lucro e mudança do múltiplo. No longo prazo, quem puxa é o lucro.",
      tempo: "6:33",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Volte à padaria. Ela lucra R$ 100 mil por ano e alguém paga R$ 1,5 milhão por ela: 15 vezes o lucro. Esse 15 é o P/L, o preço sobre o lucro. Daqui a cinco anos, o seu ganho pode vir de três lugares. Do dinheiro que ela distribuiu no caminho. Do lucro que cresceu, digamos para R$ 150 mil. E do humor do comprador seguinte, que pode pagar 20 vezes o lucro, ou só 10.",
        "Esses são os três motores de Tony. O primeiro, no S&P 500, é pequeno: o dividendo anda perto de 1% ao ano. O terceiro, o múltiplo, sobe e desce com o otimismo do mercado e costuma voltar para perto da média com o tempo. Sobra o do meio. \"O que entrega realmente o retorno é o crescimento do lucro\", resume ele.",
        "Para quem mora no Brasil existe um quarto motor, que Tony retoma mais adiante: o câmbio. Você mede a vida em reais, e a ação americana está em dólar.",
      ],
    },
    {
      tipo: "fluxo",
      titulo: "De onde vem o retorno de uma ação americana, medido em reais",
      nos: [
        { titulo: "Dividendo", texto: "Perto de 1% ao ano no S&P 500 hoje; já foi 7% em 1950." },
        { titulo: "Crescimento do lucro", texto: "Receita, margem e reinvestimento. O motor de longo prazo.", sentido: "sobe" },
        { titulo: "Mudança do múltiplo", texto: "Quanto o mercado aceita pagar por cada dólar de lucro. Vai e volta." },
        { titulo: "Câmbio", texto: "O quarto motor de quem gasta em reais." },
        { titulo: "Seu retorno em reais", texto: "A soma dos quatro, mais um pouquinho, porque um rende sobre o outro." },
      ],
      ligacoes: ["soma com", "soma com", "soma com", "resulta em"],
      fonte: "Síntese da aula; decomposição do retorno em dividendo, crescimento e múltiplo conforme Stowe, Robinson, Pinto e McLeavey, Analysis of Equity Investments: Valuation, cap. 2",
    },
    {
      tipo: "grafico",
      titulo: "O dividendo do S&P 500 encolheu de mais de 7% para cerca de 1% ao ano",
      subtitulo: "Dividendos dos últimos 12 meses sobre o preço do índice, em %, em 31 de dezembro de cada ano",
      forma: "linha",
      eixoX: anosDy,
      series: [{ nome: "Dividend yield do S&P 500", valores: dy, destaque: true }],
      formato: { sufixo: "%", casas: 2 },
      marcos: [
        { em: "2000", rotulo: "Bolha da internet, 1,2%" },
        { em: "2008", rotulo: "Crise, 3,2%" },
      ],
      fonte: "multpl.com, S&P 500 Dividend Yield by Year, com dados de Robert Shiller e da S&P",
      nota: "Em out/2026, estimado em 1,04%. A queda reflete preços mais altos em relação ao lucro e a troca do dividendo pela recompra como forma principal de devolver dinheiro.",
    },
    {
      tipo: "conceito",
      termo: "P/L e o crescimento que ele já embute",
      definicao:
        "O P/L diz quantos anos do lucro de hoje você paga ao comprar a ação. Um P/L de 15 é pagar 15 anos de lucro; um de 30, 30 anos. Quem paga 30 não está necessariamente louco: está apostando que o lucro vai crescer bastante, a ponto de o preço de hoje parecer barato depois. Uma regra de bolso ajuda a ler o mercado inteiro: se o múltiplo ficar parado, o retorno de longo prazo de uma bolsa fica perto do dividendo somado ao crescimento do lucro. Com dividendo de 1% e lucro crescendo 6% ao ano, algo como 7% ao ano.",
      naPratica:
        "Um P/L alto não é caro em si; é caro se o crescimento que ele embute não vier. Por isso uma boa empresa nem sempre é um bom investimento: o retorno depende do preço que você paga por ela. Quando o múltiplo já está alto, um dos três motores tende a jogar contra, e o lucro precisa correr mais para compensar.",
      referencia: { autor: "John D. Stowe, Thomas R. Robinson, Jerald E. Pinto e Dennis W. McLeavey", obra: "Analysis of Equity Investments: Valuation", capitulo: "cap. 1, seção 5.1, e cap. 2, seções 4.3 e 4.5" },
    },
    {
      tipo: "texto",
      tempo: "8:23",
      paragrafos: [
        "Agora, o que o índice esconde. O S&P 500 troca de empresas o tempo todo. Quem encolhe ou quebra sai, e no lugar entra quem cresceu. O gráfico do índice é, por construção, a história dos que deram certo. Quem comprou cada empresa separada sentiu também as perdas das que saíram pelo caminho. Isso tem nome: viés de sobrevivência.",
        "O mesmo raciocínio vale para países. Em 1900, as ferrovias eram 63% do valor da bolsa americana; tecnologia, saúde e energia como as conhecemos praticamente não existiam. E os Estados Unidos foram o país que deu certo no século XX. Bolsas como a da Rússia, em 1917, e a da China, em 1949, simplesmente zeraram para quem tinha ações. Estudar só a bolsa americana é estudar o vencedor.",
        "Tony aponta ainda o efeito da ponderação por valor: o índice dá mais peso a quem já ficou grande, ou seja, a quem já subiu. Comprar o índice é comprar mais do que está caro e menos do que está barato. A segunda parte da aula volta a esse ponto.",
      ],
    },
    {
      tipo: "conceito",
      termo: "Viés de sobrevivência",
      definicao:
        "Imagine que você estuda os restaurantes de uma rua famosa olhando só os que estão abertos hoje. Vai concluir que abrir restaurante ali é ótimo negócio, porque os que fecharam sumiram da amostra. Com bolsas acontece o mesmo: os índices descartam as empresas que fracassaram, e as séries históricas mais longas e mais citadas são justamente as dos países que prosperaram.",
      naPratica:
        "Os 125 anos da bolsa americana são um dado excepcional, e não uma lei da natureza. Num estudo com 17 países desde 1900, os Estados Unidos ficam perto da média do prêmio, e não no topo. A lição para o investidor é dupla: a ação existe para pagar um prêmio no longo prazo, em quase todo lugar; e não convém apostar tudo que um único país vai repetir o próprio passado, nem o Brasil, nem os Estados Unidos.",
      referencia: { autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen", obra: "Princípios de Finanças Corporativas", capitulo: "cap. 7, seção 7.1" },
    },

    // ---- 3. 125 anos de prêmio --------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "premio-de-125-anos",
      titulo: "125 anos de prêmio, com quedas de 50% no caminho",
      resumo: "As ações americanas renderam 6,6% ao ano acima da inflação desde 1900. A conta tem quedas brutais e exige anos de paciência.",
      tempo: "9:50",
    },
    {
      tipo: "kpis",
      titulo: "O que cada classe rendeu nos EUA, acima da inflação, de 1900 a 2024",
      itens: [
        { rotulo: "Ações americanas", valor: 6.6, formato: { sufixo: "% a.a.", casas: 1 }, destaque: true, nota: "9,7% ao ano em dólar nominal" },
        { rotulo: "Títulos longos do governo", valor: 1.6, formato: { sufixo: "% a.a.", casas: 1 }, nota: "4,6% nominal" },
        { rotulo: "T-Bills (caixa)", valor: 0.5, formato: { sufixo: "% a.a.", casas: 1 }, nota: "3,4% nominal" },
        { rotulo: "Ações do mundo todo", valor: 5.2, formato: { sufixo: "% a.a.", casas: 1 }, nota: "real, carteira mundial" },
      ],
      fonte: "UBS Global Investment Returns Yearbook 2025, resumo público (Elroy Dimson, Paul Marsh e Mike Staunton); Cambridge Judge Business School, 7/mar/2025",
      nota: "Retornos reais derivados dos nominais e da inflação média de 2,9% ao ano. A aula cita 4,3% para as ações fora dos EUA, número da edição completa do anuário, que não está no resumo público.",
    },
    {
      tipo: "tabela",
      titulo: "Um dólar aplicado em 1900, no fim de 2024",
      colunas: ["Aplicação", "Valor em dólar", "Em dólares de 1900 (descontada a inflação)"],
      linhas: [
        ["Ações americanas", "107.409", "cerca de 2.900"],
        ["Títulos longos do governo", "268", "cerca de 7,2"],
        ["T-Bills", "67", "cerca de 1,8"],
        ["Inflação (o que custava US$ 1)", "37", "1"],
      ],
      fonte: "UBS Global Investment Returns Yearbook 2025, resumo público, figura 10",
      nota: "Valores nominais do anuário, divididos pelo índice de inflação (37) na última coluna. Com dividendos reinvestidos, sem custos nem impostos.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "O prêmio de risco é o quanto a ação pagou acima da aplicação sem risco, o T-Bill, o título curtíssimo do Tesouro americano, parente da nossa LFT, que você viu na aula 1 deste módulo (na fala, Tony diz \"aula 4\"). Ele foi positivo em todos os mercados estudados ao longo de 125 anos.",
        "Alguns números da aula pedem uma leitura cuidadosa, e ela não muda a mensagem. Os 6,6% ao ano são retorno real, já descontada a inflação, como Tony diz na maior parte da fala (em um momento ele os chama de nominais). Já os US$ 107.409 e os US$ 67 são valores nominais; descontada a inflação, US$ 1 de 1900 vira algo como US$ 2.900 em ações e menos de US$ 2 em T-Bills. E os prêmios de 4,7 pontos sobre o T-Bill e 3,4 sobre os títulos longos fecham com a carteira mundial de ações, que rendeu 5,2% reais. Para a bolsa americana, o prêmio foi maior: cerca de 6,1 pontos sobre o T-Bill e 4,9 sobre os títulos longos.",
        "E por que o mercado paga esse prêmio? Porque a ação oscila muito. Tony fala em volatilidade de 15% a 16% ao ano, o dobro do crédito privado e o triplo dos títulos longos do Tesouro. E porque, de vez em quando, ela cai pela metade.",
      ],
    },
    {
      tipo: "conceito",
      termo: "Prêmio de risco",
      definicao:
        "Pense em duas aplicações. Uma rende 4% ao ano, garantidos. A outra rende, em média, 10%, mas num ano pode cair 40%. Ninguém escolheria a segunda se ela rendesse os mesmos 4%. A diferença que o mercado exige para aceitar o susto, aqui 6 pontos, é o prêmio de risco. Ele é medido olhando para trás, mas o que interessa é o prêmio que se pode esperar daqui para a frente.",
      naPratica:
        "O prêmio não é constante. Quando a bolsa está cara, o prêmio que ela promete daqui para a frente tende a ser menor, porque você paga mais pelo mesmo lucro. Use a média histórica como Tony sugere, como ponto de referência, e não como promessa: com uma volatilidade tão grande, até um século de dados deixa uma margem de erro de alguns pontos para cima ou para baixo.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 5, seção 5.4, e cap. 6, seção 6.6" },
    },
    {
      tipo: "grafico",
      tempo: "10:46",
      titulo: "Quedas perto de 50% aconteceram cinco vezes, e não três",
      subtitulo: "Maiores quedas do S&P 500, do pico ao fundo, em % (preço, em dólar nominal)",
      forma: "barra",
      eixoX: ["1929 a 1932", "1937 a 1938", "1973 a 1974", "2000 a 2002", "2007 a 2009", "2020", "2022"],
      series: [{ nome: "Queda do pico ao fundo", valores: [-86.2, -54.5, -48.2, -49.1, -56.8, -33.9, -25.4], cor: "negativo" }],
      formato: { sufixo: "%", casas: 1 },
      referencia: { valor: -50, rotulo: "Metade do valor" },
      fonte: "Yardeni Research, S&P 500 Bull and Bear Market Tables; S&P Dow Jones Indices",
      nota: "Na aula, Tony cita três quedas de 50% (1929, 2000 e 2008). As de 1937-38 e 1973-74 chegaram perto disso; descontada a inflação dos anos 70, a de 1973-74 passou de 50%.",
    },
    {
      tipo: "destaque",
      tempo: "11:45",
      texto: "Se você não tem um horizonte de investimento de, no mínimo, cinco anos, deveria repensar qualquer investimento numa bolsa, até numa bolsa com uma performance tão boa como a americana.",
      fonte: "Tony Volpon, na aula",
    },
    {
      tipo: "texto",
      paragrafos: [
        "O prêmio não chega em fatias iguais, ano após ano. Ele se concentra em poucos anos muito bons, e quem sai na hora errada perde justamente esses anos. Você viu a versão mais extrema disso com o Rodolfo, na aula 4 do Módulo I: perder os 10 melhores dias de duas décadas cortava o patrimônio final pela metade.",
      ],
    },
    {
      tipo: "texto",
      tempo: "12:30",
      paragrafos: [
        "E vem o quarto motor. A ação americana é um investimento em dólar, e você faz a contabilidade em reais. Dá para proteger a carteira do câmbio com hedge, um contrato que neutraliza a variação da moeda, mas proteger ou não é uma decisão sobre a carteira inteira, e não sobre uma ação. Tony não diz qual é a resposta certa; diz que a pergunta precisa ser feita.",
      ],
    },
    {
      tipo: "simulador",
      id: "quarto-motor-cambio",
      titulo: "O quarto motor: ações em dólar, medidas em reais",
      descricao:
        "Mande uma parte de cada aporte para ações americanas e compare com a carteira que ficou toda em reais. Mexa no rendimento em dólar e na variação do câmbio para ver quanto do resultado vem de cada motor. Nenhuma combinação aqui é recomendação.",
      modelo: "jurosCompostos",
      parametros: {
        taxaUsd: {
          valor: 8,
          rotulo: "Rendimento das ações em dólar",
          ajuda: "As ações americanas renderam 9,7% ao ano em dólar de 1900 a 2024, com dividendos e com décadas negativas no meio (UBS). O passado não garante o futuro.",
        },
        taxaBrl: { valor: 10, ajuda: "O CDI rendeu em média 9,7% ao ano de 2010 a 2025 (BCB, SGS 4391)." },
        depreciacao: { valor: 3, ajuda: "De 1999 a 2025, o dólar subiu em média cerca de 4,4% ao ano contra o real (PTAX), com anos de queda forte. Zero é um cenário possível." },
      },
    },

    // ---- 4. eras de decepção ---------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "eras-de-decepcao",
      titulo: "Eras de decepção: os anos 70 e os anos 2000",
      resumo: "Duas décadas em que a bolsa americana perdeu da inflação. Na primeira, a culpa foi da inflação; na segunda, do preço de entrada.",
      tempo: "14:42",
    },
    {
      tipo: "grafico",
      titulo: "Duas décadas no vermelho em termos reais: os anos 70 e os anos 2000",
      subtitulo: "S&P 500 com dividendos, retorno médio por ano acima da inflação americana, em %",
      forma: "barra",
      eixoX: decadas,
      series: [{ nome: "Retorno real médio ao ano", valores: realDecada, destaque: true }],
      formato: { sufixo: "%", casas: 1 },
      referencia: { valor: 0, rotulo: "Zero real" },
      fonte: "Aswath Damodaran, Historical Returns on Stocks, Bonds and Bills (NYU Stern, jan/2026); inflação de 2024 e 2025 pelo BLS (CPI, dezembro a dezembro)",
      nota: "Média composta de cada década, de janeiro a dezembro. A aula cita quase 17% nos anos 50, −1,4% nos anos 70, 11,2% nos anos 2010 e cerca de 10% de 2020 a 2025; a diferença nos anos 2010 vem da base de dados.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Os anos 50 foram a melhor década da amostra, com quase 17% ao ano acima da inflação. Os anos 70 foram o oposto. Dois choques do petróleo, gasto público expansionista, inflação alta e crescimento fraco. A bolsa até subiu em dólares correntes, mas perdeu da inflação: −1,4% ao ano em termos reais. Foi também uma década de turbulência política, com o caso Watergate (Nixon renunciou em agosto de 1974, antes de a Câmara votar o impeachment que Tony menciona).",
        "Quem entrou no fim de 1968 chegou a ficar no azul em 1972, voltou ao vermelho com a crise de 1973-74 e só deixou o prejuízo para trás, de vez, em 1983. Foram mais de dez anos parados, descontada a inflação.",
        "Os anos 2000 foram ainda piores, −3,4% ao ano, e por outro motivo. A economia não ia mal, e o lucro das empresas cresceu. O problema foi o preço de entrada: a bolha da internet tinha levado os múltiplos a recordes, e eles desabaram. Quem comprou no começo de 2000 só recuperou o poder de compra perto de 2013. No meio do caminho vieram duas recessões, o 11 de setembro e a crise de 2008. E, como Tony lembrou na abertura, foi a década em que os emergentes, Brasil incluído, deram de goleada.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Os anos 70 começaram caros e acabaram baratos; os 2000 começaram no recorde",
      subtitulo: "CAPE de Shiller: preço do S&P 500 sobre o lucro médio dos dez anos anteriores, corrigido pela inflação, em janeiro de cada ano",
      forma: "linha",
      eixoX: anosCape,
      series: [{ nome: "CAPE do S&P 500", valores: cape, destaque: true }],
      formato: { sufixo: "×", casas: 1 },
      referencia: { valor: 17.42, rotulo: "Média desde 1871" },
      marcos: [
        { em: "1968", rotulo: "1968: 21,5×" },
        { em: "1982", rotulo: "1982: 7,4×" },
        { em: "2000", rotulo: "2000: 43,8×" },
        { em: "2009", rotulo: "2009: 15,2×" },
      ],
      fonte: "multpl.com, Shiller PE Ratio by Year, com dados de Robert Shiller (Irrational Exuberance)",
      nota: "O último ponto é o de 7/out/2026, 41,8×, perto do recorde da bolha. Média de 17,4× e mediana de 16,1× desde 1871. Múltiplo alto não marca data de queda; ele diz que um dos motores tende a ajudar menos daqui para a frente.",
    },
    {
      tipo: "tabela",
      tempo: "20:08",
      titulo: "De 1968 a 1982, o dividendo não pagou a inflação",
      colunas: ["Camada do retorno", "Ao ano", "Na aula"],
      linhas: [
        ["Só o preço do S&P 500, em dólar", "+2,2%", "2,2%"],
        ["Preço, descontada a inflação (7,5% ao ano)", "−4,9%", "−4,9%"],
        ["Preço mais dividendos reinvestidos", "+6,7%", "6,7%"],
        ["Preço mais dividendos, descontada a inflação", "−0,8%", "−0,7%"],
      ],
      fonte: "S&P 500 de 103,86 pontos (31/dez/1968) e 140,64 (31/dez/1982); retorno com dividendos e inflação de Aswath Damodaran, Historical Returns on Stocks, Bonds and Bills",
      nota: "Quatorze anos, de dezembro de 1968 a dezembro de 1982. Os números da aula fecham com a fonte.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A tabela acima é a frase de Tony em números: os dividendos, que nos anos 70 rendiam de 3% a 5% ao ano, quase compensaram a inflação, mas não compensaram de todo. Quem vivia de dividendo viu o poder de compra cair por uma década e meia.",
        "Sobre os anos 2000, a lição é sobre o terceiro motor. O lucro fez a parte dele; o múltiplo andou para trás. É por isso que o CAPE de hoje, perto do recorde de 2000, aparece em toda discussão sobre o que esperar da bolsa americana. Não é sinal de venda nem data marcada. É a lembrança de que, partindo de múltiplo alto, o lucro precisa crescer mais para entregar a mesma coisa.",
      ],
    },

    // ---- 5. um índice de tecnologia ----------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "um-indice-de-tecnologia",
      titulo: "O S&P 500 é, na prática, um índice de tecnologia",
      resumo: "O setor oficial passa de um terço do índice; somando as empresas de tecnologia classificadas em outros setores, chega perto da metade.",
      tempo: "21:28",
    },
    {
      tipo: "kpis",
      titulo: "Quanto da bolsa americana é tecnologia",
      itens: [
        { rotulo: "Setor de tecnologia, MSCI USA", valor: 39.5, formato: { sufixo: "%", casas: 1 }, destaque: true, nota: "set/2026; na aula, 34% no S&P 500" },
        { rotulo: "Alphabet, Meta, Amazon e Tesla", valor: 13.2, formato: { sufixo: "%", casas: 1 }, nota: "no S&P 500, fora do setor oficial" },
        { rotulo: "Tecnologia nos outros desenvolvidos", valor: 11.0, formato: { sufixo: "%", casas: 1 }, nota: "MSCI World ex USA, set/2026" },
      ],
      fonte: "MSCI, factsheets MSCI USA e MSCI World ex USA, 30/set/2026; carteira do SPDR S&P 500 ETF (SPY) em 5/out/2026, via Business Quant",
      nota: "Alphabet e Meta estão em serviços de comunicação; Amazon e Tesla, em consumo. Na aula, a soma com essas quatro chega a 45%; pelos dados de set/out/2026, passa de 50%.",
    },
    {
      tipo: "linhaDoTempo",
      tempo: "22:51",
      titulo: "O peso de tecnologia no S&P 500 voltou ao pico da bolha, e passou",
      subtitulo: "Setor de tecnologia da informação, em % do índice",
      eventos: [
        { data: "1990", titulo: "Perto de 7%", texto: "Antes de a internet chegar à bolsa." },
        { data: "mar/2000", titulo: "Cerca de 33%", texto: "Auge da bolha da internet." },
        { data: "2002 a 2008", titulo: "Volta à casa dos 15%", texto: "A bolha estoura e o peso não volta a 7%." },
        { data: "2009", titulo: "Começa a subida contínua", texto: "Acima de 15% e sem parar desde então." },
        { data: "ago/2022", titulo: "27,7%", texto: "Maior setor do índice, com folga." },
        { data: "2026", titulo: "Perto de 39%", texto: "Acima de qualquer pico anterior de um setor." },
      ],
      fonte: "CME Group, OpenMarkets, \"What Past Sector Concentrations Tell Us About Today's Tech-Heavy S&P 500\" (28/jul/2026); First Trust, com dados da Bloomberg (ago/2022)",
      nota: "Na aula, Tony fala em abaixo de 10% antes de 1995, 35% no auge da bolha e cerca de 15% depois do estouro. A ordem de grandeza é a mesma.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A conclusão de Tony é direta: quem compra o S&P 500 hoje está fazendo, principalmente, um investimento no setor de tecnologia americano, espalhado por vários setores oficiais. A concentração de agora é comparável à da bolha de 2000. Ele faz questão de separar as duas coisas, porém. Concentração igual não quer dizer bolha igual. Há analistas que veem bolha hoje; Tony diz que, na opinião dele, não há.",
        "Você já viu com o Rodolfo, na aula 4 do Módulo I, o que aconteceu com o Nasdaq depois de 2000. A diferença que Tony sublinha é que lá a concentração veio com múltiplos absurdos e lucros que não existiam; hoje, as maiores empresas lucram muito. Isso não elimina o risco. Muda a pergunta: o crescimento que o preço embute vai mesmo acontecer?",
      ],
    },
    {
      tipo: "destaque",
      texto: "Não necessariamente o estado da bolsa americana hoje é de uma bolha. Não cometa o erro de pensar assim pela igualdade de concentração que você vê no início dos anos 2000 e hoje.",
      fonte: "Tony Volpon, na aula, 22:51",
    },

    // ---- 6. os EUA contra o mundo desenvolvido ------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "eua-contra-o-mundo",
      titulo: "Por que os EUA venceram o resto do mundo rico desde 2008",
      resumo: "Até 2007, a Europa e o Japão foram melhor. Desde 2008, o lucro americano cresceu mais e o mercado passou a pagar mais caro por ele.",
      tempo: "24:23",
    },
    {
      tipo: "grafico",
      titulo: "Até 2007 o resto do mundo rico ganhou; desde 2008, os EUA dispararam",
      subtitulo: "Retorno médio por ano em dólar, com dividendos, em %",
      forma: "barra",
      eixoX: ["2002 a 2007", "2008 a 2025"],
      series: [
        { nome: "S&P 500", valores: [6.0, 11.0], destaque: true },
        { nome: "Desenvolvidos fora dos EUA (MSCI EAFE)", valores: [14.1, 4.2] },
      ],
      formato: { sufixo: "%", casas: 1 },
      fonte: "Aswath Damodaran, Historical Returns on Stocks, Bonds and Bills (jan/2026); MSCI EAFE pelo ETF EFA, via ChartRow",
      nota: "O EFA começa a ter anos completos em 2002 e desconta a taxa do fundo; a aula compara a partir de 2000. EAFE reúne Europa, Australásia e Extremo Oriente, sem o Canadá.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Por que a virada? Tony aponta o setor de tecnologia. Pense em Nvidia, Microsoft, Alphabet e Meta: não há empresas equivalentes na Europa ou no Japão. Existem gigantes importantes, como a holandesa ASML, que fabrica as máquinas que fazem os chips, e várias empresas em Taiwan e no resto da Ásia, mas nada do tamanho do conjunto americano. A ASML, a maior empresa do MSCI World ex USA, pesa 2,9% daquele índice; a Nvidia sozinha pesa 8% do índice americano.",
        "E não foi só preço. Pelos números de Tony, desde 2008 o lucro das empresas americanas cresceu quatro vezes mais rápido que o das outras bolsas desenvolvidas, um cálculo que não conseguimos reproduzir com dado público, mas cuja direção é inquestionável. O múltiplo também subiu: o P/L do S&P 500 foi de 12,8 para acima de 21 vezes, segundo a aula. Os dois motores ajudaram juntos.",
        "O detalhe mais interessante está no que os preços dizem hoje. As outras bolsas estão mais baratas pelo lucro que entregam. Se o mercado achasse que essa diferença de lucro ia acabar, os múltiplos já teriam se aproximado. Não se aproximaram: o mercado aposta que a vantagem americana continua. Essa aposta pode estar certa, mas é uma aposta, e está no preço.",
      ],
    },
    {
      tipo: "comparativo",
      titulo: "O mercado paga mais caro pelo lucro americano",
      subtitulo: "MSCI USA contra MSCI World ex USA, 30/set/2026",
      opcoes: [
        { nome: "EUA", resumo: "MSCI USA, 513 empresas", destaque: true },
        { nome: "Desenvolvidos fora dos EUA", resumo: "MSCI World ex USA, 736 empresas" },
      ],
      metricas: [
        { rotulo: "P/L sobre o lucro passado", valores: [25.37, 17.66], formato: { sufixo: "×", casas: 1 }, melhor: "menor" },
        { rotulo: "P/L sobre o lucro esperado em 12 meses", valores: [19.38, 14.89], formato: { sufixo: "×", casas: 1 }, melhor: "menor" },
        { rotulo: "Dividend yield", valores: [1.11, 2.61], formato: { sufixo: "%", casas: 2 }, melhor: "maior" },
        { rotulo: "Peso de tecnologia", valores: [39.5, 10.96], formato: { sufixo: "%", casas: 1 } },
        { rotulo: "Retorno médio ao ano, 2012 a 2025", valores: [14.9, 8.6], formato: { sufixo: "%", casas: 1 }, melhor: "maior" },
      ],
      fonte: "MSCI, factsheets MSCI USA e MSCI World ex USA (USD), 30/set/2026",
      nota: "Retornos brutos com dividendos, em dólar, compostos a partir das tabelas anuais dos factsheets. \"Melhor\" aqui é só o sentido da métrica: barato pode continuar barato.",
    },
    {
      tipo: "conceito",
      termo: "Comparar múltiplos entre países",
      definicao:
        "Duas empresas lucram US$ 1 por ação. Uma custa US$ 25, a outra US$ 17. A de US$ 17 está mais barata? Só se as duas tiverem o mesmo futuro. Se a primeira vai dobrar o lucro em cinco anos e a segunda vai ficar parada, os US$ 25 podem ser a pechincha. Entre países vale o mesmo, com mais camadas: setores diferentes, regras contábeis diferentes, juros e riscos diferentes.",
      naPratica:
        "O P/L menor da Europa e do Japão reflete, em boa parte, a mistura de setores: mais bancos, indústria e energia, menos tecnologia. Comparar a bolsa americana com as outras pede a pergunta de Tony: o crescimento de lucro que justifica a diferença vai continuar? Ter alguma convicção sobre isso, e sobre o ciclo da tecnologia, ajuda a decidir quanto da parte internacional fica nos EUA.",
      referencia: { autor: "John D. Stowe, Thomas R. Robinson, Jerald E. Pinto e Dennis W. McLeavey", obra: "Analysis of Equity Investments: Valuation", capitulo: "cap. 4, seções 3.2 e 3.3" },
    },

    // ================================================================================================
    // PARTE 2 · CRESCIMENTO, VALOR E DIVIDENDOS
    // ================================================================================================

    // ---- 7. crescimento e valor -------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "parte-2-crescimento-e-valor",
      titulo: "Parte 2 · Crescimento e valor: dois jeitos de olhar a mesma bolsa",
      resumo: "Empresas que crescem rápido e custam caro, e empresas maduras, mais baratas, que pagam dividendos. Cada estilo tem a sua época.",
      tempo: "26:43",
    },
    {
      tipo: "texto",
      capitular: true,
      paragrafos: [
        "Compare duas empresas. A primeira vende chips para inteligência artificial, dobra a receita em dois anos, quase não paga dividendo e custa 33 vezes o lucro. A segunda é um banco grande: lucro que cresce devagar, dividendo gordo, 12 vezes o lucro. A primeira é o que o mercado chama de ação de crescimento; a segunda, de valor. Em inglês, growth e value.",
        "Tony descreve os dois grupos assim. As de crescimento aumentam receita e lucro rapidamente e operam com múltiplos esticados, porque o mercado já está pagando pelo futuro. As de valor são mais tradicionais, crescem menos, oscilam um pouco menos, costumam pagar dividendos e têm múltiplos menores. Bancos, empresas de commodities e do setor imobiliário caem quase sempre do lado do valor. Banco, diz ele, é um negócio mais careta, fora das bolhas.",
        "Um detalhe curioso mostra que o rótulo vem de números, e não da fama. No índice de valor da MSCI, em set/2026, a maior empresa era a Microsoft, com 11% do peso, e a Meta vinha em segundo. Pelas métricas de preço sobre lucro esperado e sobre patrimônio, elas tinham ficado relativamente baratas. No índice de crescimento, Nvidia e Apple somavam quase 30%.",
      ],
    },
    {
      tipo: "comparativo",
      titulo: "Crescimento custa mais caro e paga menos dividendo",
      subtitulo: "Índices de estilo da MSCI para as ações americanas",
      opcoes: [
        { nome: "Crescimento", resumo: "MSCI USA Growth, 177 empresas", destaque: true },
        { nome: "Valor", resumo: "MSCI USA Value, 381 empresas" },
        { nome: "Índice inteiro", resumo: "MSCI USA, 513 empresas" },
      ],
      metricas: [
        { rotulo: "P/L sobre o lucro passado", valores: [33.33, 20.57, 25.37], formato: { sufixo: "×", casas: 1 } },
        { rotulo: "P/L sobre o lucro esperado", valores: [26.26, 15.63, 19.38], formato: { sufixo: "×", casas: 1 } },
        { rotulo: "Dividend yield", valores: [0.36, 1.88, 1.11], formato: { sufixo: "%", casas: 2 } },
        { rotulo: "Peso de tecnologia", valores: [52.05, 25.04, 39.5], formato: { sufixo: "%", casas: 1 } },
        { rotulo: "Peso das dez maiores", valores: [63.51, 32.8, 38.19], formato: { sufixo: "%", casas: 1 } },
      ],
      fonte: "MSCI, factsheets MSCI USA Growth (31/ago/2026), MSCI USA Value e MSCI USA (30/set/2026)",
      nota: "O índice de crescimento usa o factsheet de agosto, o mais recente em dólar disponível. Uma empresa pode estar nos dois índices, dividida.",
    },
    {
      tipo: "matriz",
      tempo: "27:44",
      modo: "quadrante",
      titulo: "Qual estilo costuma ir melhor depende do momento da bolsa",
      eixoLinhas: "Momento do mercado",
      eixoColunas: "Estilo",
      linhas: ["Economia forte e tema tecnológico forte", "Bolsa fraca, correção ou juros subindo"],
      colunas: ["Crescimento", "Valor"],
      celulas: [
        [
          {
            texto: "Lidera. Anos 90 e de 2009 a 2021; de novo desde 2023, com a inteligência artificial.",
            explicacao:
              "Quando o lucro das empresas de tecnologia cresce rápido e a economia ajuda, o mercado aceita pagar múltiplos ainda maiores. Num índice concentrado em tecnologia, como o americano, isso puxa o índice inteiro.",
            marca: "Onde estamos, segundo a aula",
          },
          {
            texto: "Sobe, mas fica para trás. Bancos e commodities crescem sem explodir.",
            explicacao:
              "As empresas de valor também ganham numa economia forte, só que menos. Foi o caso de quase todos os anos de 2012 a 2021: valor rendeu bem e, ainda assim, perdeu do índice.",
          },
        ],
        [
          {
            texto: "Sofre mais. O múltiplo esticado é o primeiro a encolher.",
            explicacao:
              "Na correção, a diferença de múltiplos entre os dois estilos se achata: o P/L de crescimento cai mais que o de valor. Em 2022, com os juros subindo, o índice de crescimento caiu 32%, e o de valor, 7%.",
          },
          {
            texto: "Resiste melhor. Dividendo e múltiplo baixo amortecem a queda.",
            explicacao:
              "Foi o que aconteceu de 2001 a 2008, quando a bolsa americana decepcionou: valor superou crescimento. Mais dividendo e menos expectativa no preço deixam menos espaço para cair.",
            marca: "Início dos anos 2000",
          },
        ],
      ],
      fonte: "Síntese da aula, com Hartford Funds (Russell 1000 Growth e Value, eras de 1985 a 2026) e MSCI (factsheets de 2026)",
    },
    {
      tipo: "grafico",
      titulo: "Em 2020 e 2023, crescimento passou o índice por mais de 20 pontos; em 2022, valor ganhou por 13",
      subtitulo: "Quanto cada estilo rendeu acima (ou abaixo) do MSCI USA no ano, em pontos percentuais",
      forma: "barra",
      eixoX: anos1225,
      series: [
        { nome: "Crescimento menos o índice", valores: crescMenosIndice, destaque: true },
        { nome: "Valor menos o índice", valores: valorMenosIndice },
      ],
      formato: { sufixo: " p.p.", casas: 1 },
      referencia: { valor: 0, rotulo: "Igual ao índice" },
      fonte: "MSCI, factsheets MSCI USA Growth (retorno de preço, 31/ago/2026) e MSCI USA Value (retorno líquido, 30/set/2026), cada um contra o MSCI USA na mesma base",
      nota: "Como cada estilo é comparado ao índice-mãe na mesma medida, as diferenças podem ser lidas lado a lado, mesmo que uma use preço e a outra inclua dividendos.",
    },
    {
      tipo: "linhaDoTempo",
      titulo: "Crescimento e valor se revezam, às vezes por mais de uma década",
      subtitulo: "Quem foi melhor em janelas móveis de cinco anos, Russell 1000 Growth contra Russell 1000 Value",
      eventos: [
        { data: "1985 a 1991", titulo: "Valor", texto: "Retomada depois da recessão, inflação domada, cortes de impostos." },
        { data: "1991 a 2001", titulo: "Crescimento", texto: "Computador pessoal, internet e a bolha." },
        { data: "2001 a 2008", titulo: "Valor", texto: "Volta dos fundamentos: lucro e dividendo." },
        { data: "2008 a 2021", titulo: "Crescimento", texto: "Grandes de tecnologia, juro zero e dinheiro farto." },
        { data: "2022", titulo: "Valor", texto: "Juros sobem e os múltiplos altos encolhem." },
        { data: "2023 a 2026", titulo: "Crescimento", texto: "As sete gigantes puxam o S&P 500." },
      ],
      fonte: "Hartford Funds, Client Conversations, \"The Cyclical Nature of Growth vs. Value Investing\" (3T/2026), com dados da Morningstar; MSCI para 2022",
    },
    {
      tipo: "conceito",
      termo: "Pagar qualquer preço pelo crescimento",
      definicao:
        "No começo dos anos 70, cerca de 50 grandes empresas americanas de crescimento, o Nifty Fifty, eram vistas como ações para comprar a qualquer preço e nunca vender. No fim de 1972, custavam em média 37 vezes o lucro, contra 18 do S&P 500. Até o fim de 1974, o índice caiu 46%, e as estrelas caíram mais: Disney, 91%; Coca-Cola, 67%; Kodak, 59%. As empresas continuaram boas. O preço é que não cabia em nenhum futuro razoável.",
      naPratica:
        "Crescimento é uma ótima qualidade, e o mercado sabe disso, por isso cobra por ela. O risco do estilo não está na empresa, está no múltiplo. Quem compra crescimento caro precisa que o futuro seja ainda melhor do que o preço já supõe. Por isso Tony fala em diversificação contínua e dinâmica, e não em escolher um lado para sempre.",
      referencia: { autor: "John D. Stowe, Thomas R. Robinson, Jerald E. Pinto e Dennis W. McLeavey", obra: "Analysis of Equity Investments: Valuation", capitulo: "Prefácio, p. xv" },
    },
    {
      tipo: "conceito",
      termo: "O fator valor",
      definicao:
        "Na academia, valor virou um fator: uma fonte de retorno que se mede separando as ações baratas das caras, por patrimônio ou por lucro, e comparando as duas carteiras. Num histórico longo, as baratas renderam mais. Mas o prêmio pode ficar negativo por décadas: o anuário da UBS mostra prêmios de fator negativos por décadas inteiras, e nos Estados Unidos o de valor ficou negativo na maior parte dos anos 2010.",
      naPratica:
        "Fundos e ETFs de valor ou de crescimento são exposições a estilos, e não talento de gestor. Antes de pagar por um deles, vale perguntar se você quer mudar o perfil da carteira ou só está correndo atrás do estilo que foi melhor nos últimos anos, que é o jeito mais comum de entrar tarde.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 10, modelo de três fatores de Fama e French" },
    },

    // ---- 8. dividendos ou crescimento -------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "dividendos-ou-crescimento",
      titulo: "Dividendos ou crescimento: o que a empresa faz com o lucro",
      resumo: "Pagar dividendo não é virtude nem defeito. É um retrato da fase da empresa e da regra de imposto.",
      tempo: "28:58",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Na hora da correção, diz Tony, as empresas de valor vão melhor e pagam mais dividendos. Isso leva à pergunta que dava nome à aula planejada: vale mais a pena buscar dividendos ou crescimento?",
        "Comece pelo que a empresa faz com o lucro. Ela pode reinvestir tudo, se tem onde aplicar o dinheiro a um retorno alto. Pode devolver aos acionistas, por dividendo ou recompra. Ou pode fazer um pouco de cada. Uma empresa jovem, com muitas oportunidades, costuma reter; uma madura, que já ocupou o mercado dela, costuma distribuir. O dividendo conta mais sobre a fase da empresa do que sobre a qualidade dela.",
        "As listas de empresas que aumentam o dividendo há décadas, os Aristocrats e Kings, você viu com o Rodolfo, na aula 4 do Módulo I, junto com o lembrete de que o conselho pode cortar o dividendo quando o caixa aperta. Aqui o ângulo é outro: o que muda para o seu retorno total.",
      ],
    },
    {
      tipo: "tabela",
      titulo: "O ciclo de vida do dividendo",
      colunas: ["Fase da empresa", "O que faz com o lucro", "Estilo típico", "Para o investidor"],
      linhas: [
        ["Jovem, crescendo rápido", "Reinveste quase tudo; dividendo zero ou simbólico", "Crescimento", "Retorno vem do lucro e do múltiplo; mais oscilação"],
        ["Em expansão, já lucrativa", "Começa a recomprar ações; dividendo pequeno", "Crescimento ou misto", "O caso de boa parte das gigantes americanas hoje"],
        ["Madura", "Distribui a maior parte, por dividendo e recompra", "Valor", "Renda mais previsível; crescimento menor"],
        ["Em declínio", "Dividendo alto em relação ao preço, às vezes insustentável", "Valor, com cuidado", "Dividend yield alto pode ser sinal de preço caindo, e não de generosidade"],
      ],
      fonte: "Síntese a partir de Brealey, Myers e Allen, Princípios de Finanças Corporativas, cap. 16 (ciclo de vida dos dividendos, DeAngelo, DeAngelo e Skinner)",
    },
    {
      tipo: "conceito",
      termo: "Dividendo e venda de ações dão no mesmo, quase",
      definicao:
        "Você tem 100 ações de US$ 50 e quer US$ 200 de renda. Se a empresa pagar US$ 2 por ação, cada ação cai para cerca de US$ 48 no dia em que o dividendo sai, e você fica com US$ 4.800 em ações e US$ 200 na mão. Se ela não pagar nada, você vende 4 ações a US$ 50 e fica com 96 ações, os mesmos US$ 4.800, e os mesmos US$ 200. Num mercado sem impostos e sem custos, o dividendo não cria valor: só muda o formato em que o dinheiro chega. A ideia é de Merton Miller e Franco Modigliani, dois Nobel de Economia.",
      naPratica:
        "A renda pode ser fabricada vendendo um pouco da carteira. Por isso ação boa pagadora de dividendo não é, por si só, melhor que ação de crescimento. Na vida real, o que desempata são impostos e custos. Para quem mora no Brasil, o dividendo americano sofre retenção na fonte, e a venda segue a regra brasileira: é conta para o Módulo III, e ela costuma pesar a favor das empresas que devolvem por recompra.",
      referencia: { autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen", obra: "Princípios de Finanças Corporativas", capitulo: "cap. 16, seções 16.5 a 16.8" },
    },

    // ---- 9. pesos iguais ou por valor ------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "pesos-iguais-ou-por-valor",
      titulo: "Pesos por valor ou pesos iguais",
      resumo: "O índice por valor ganha quando poucas gigantes puxam a alta. O de pesos iguais costuma ganhar quando a liderança se espalha.",
      tempo: "29:54",
    },
    {
      tipo: "texto",
      paragrafos: [
        "O S&P 500 dá a cada empresa um peso proporcional ao valor dela na bolsa. A Nvidia pesa cerca de 8%; a menor das 500, uma fração de 0,01%. Existe outro jeito: dar o mesmo peso a todas, cerca de 0,2% para cada uma, e reequilibrar de tempos em tempos. Na prática, isso significa vender um pouco do que subiu e comprar um pouco do que caiu.",
        "Tony explica a consequência. Quando o crescimento está concentrado em poucas empresas, como agora com a inteligência artificial, o índice por valor vai melhor, porque essas empresas pesam cada vez mais dentro dele. Quando há correção, ou a liderança passa para outros setores, o de pesos iguais tende a ir melhor. Desde 2020, os dois índices passaram a andar menos juntos: a correlação dos retornos diários, que costumava ficar acima de 0,95, tem rondado 0,8.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Desde 2023, o índice por valor deixou o de pesos iguais para trás",
      subtitulo: "Retorno de preço no ano, em dólar, em %",
      forma: "barra",
      eixoX: anos1225,
      series: [
        { nome: "MSCI USA (por valor)", valores: msciUsaPreco, destaque: true },
        { nome: "MSCI USA Equal Weighted (pesos iguais)", valores: msciEw },
      ],
      formato: { sufixo: "%", casas: 1 },
      fonte: "MSCI, factsheet MSCI USA Equal Weighted Index (USD), 30/set/2026",
      nota: "Mesmas 513 empresas nos dois índices. O de pesos iguais é reequilibrado a cada trimestre. Retorno de preço, sem dividendos.",
    },
    {
      tipo: "kpis",
      titulo: "No prazo longo, a disputa fica mais equilibrada",
      itens: [
        { rotulo: "Pesos iguais, desde dez/1974", valor: 10.18, formato: { sufixo: "% a.a.", casas: 1 }, nota: "retorno de preço" },
        { rotulo: "Por valor, desde dez/1974", valor: 9.37, formato: { sufixo: "% a.a.", casas: 1 }, nota: "retorno de preço" },
        { rotulo: "Por valor, últimos 10 anos", valor: 13.44, formato: { sufixo: "% a.a.", casas: 1 }, destaque: true, nota: "pesos iguais: 9,20%" },
        { rotulo: "Pior queda, pesos iguais", valor: -61.06, formato: { sufixo: "%", casas: 1 }, nota: "2007 a 2009; por valor, −56,8%" },
      ],
      fonte: "MSCI, factsheet MSCI USA Equal Weighted Index (USD), 30/set/2026",
      nota: "Dados anteriores a jan/2008 são simulados pela MSCI com a regra do índice. O de pesos iguais tem mais empresas médias e mais setores fora da tecnologia.",
    },
    {
      tipo: "conceito",
      termo: "Gestão passiva",
      definicao:
        "Em vez de escolher ações, você compra o índice inteiro, por um fundo ou ETF que copia a carteira dele. Não tenta bater o mercado: aceita o resultado médio, a um custo baixo. Um fundo de índice amplo nos EUA cobra frações de 0,1% ao ano; um fundo ativo típico já cobrou perto de 1%. A diferença de custo é certa; a vantagem de escolher ações, para quem não tem uma análise muito superior, é incerta.",
      naPratica:
        "Comprar o S&P 500 é uma decisão ativa disfarçada, como Tony mostra: você aceita a regra de pesos por valor e, hoje, uma aposta grande em tecnologia. Isso pode ser exatamente o que você quer. Só não é neutro. Saber o que está dentro do índice faz parte da diversificação, e o papel de um bom assessor é mais adaptar a carteira à sua vida do que prometer bater o mercado.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 11, gestão ativa e passiva" },
    },

    // ---- 10. duas camadas e as Treasuries ------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "duas-camadas-de-diversificacao",
      titulo: "Duas camadas de diversificação, e o debate das Treasuries",
      resumo: "Diversificar dentro da bolsa e diversificar entre bolsa e renda fixa são decisões diferentes, que precisam ser pensadas juntas.",
      tempo: "32:00",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Aqui Tony é honesto sobre um dilema. Diversificar demais dentro da bolsa pode deixar você de fora das empresas que lideram o ciclo tecnológico. Diversificar de menos deixa a carteira na mão de um tema só. A saída que ele propõe é pensar em duas camadas.",
        "A primeira é dentro de cada classe: quantas ações, de quais setores, por quais pesos. A segunda é entre classes: quanto em renda variável e quanto em renda fixa. As duas conversam. Dá para montar, diz ele, uma parte de ações até mais concentrada em inteligência artificial que o S&P 500, desde que a carteira tenha uma parcela relevante em renda fixa para amortecer uma correção. O exemplo é de como pensar, e não de quanto pôr em cada lugar.",
      ],
    },
    {
      tipo: "conceito",
      termo: "Risco que some e risco que fica",
      definicao:
        "Uma carteira com uma ação só carrega dois riscos: o da empresa (um produto que falha, um executivo que erra) e o da economia inteira (juros, recessão, inflação). Somando ações, o risco de cada empresa se dilui, porque os tropeços de uma se compensam com os acertos de outra. O risco da economia não se dilui: todas sentem a recessão ao mesmo tempo. Entre 20 e 30 ações já eliminam a maior parte do primeiro risco.",
      naPratica:
        "É por isso que a primeira camada tem limite e a segunda existe. Mais ações americanas não protegem de uma queda da bolsa americana; para isso servem outras classes e outras moedas. Para quem mora no Brasil, a mesma lógica vale um degrau acima: o risco do país e do real não se dilui comprando mais ações brasileiras.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 7, seção 7.1" },
    },
    {
      tipo: "tabela",
      tempo: "33:25",
      titulo: "A escada da carteira americana",
      colunas: ["Classe", "O que você carrega", "O que costuma pagar", "Relação com as ações"],
      linhas: [
        ["T-Bills", "Quase nenhum risco; é o caixa", "Retorno real pequeno, mas positivo: 0,5% ao ano desde 1900", "Neutra"],
        ["Treasuries longas", "Sem risco de crédito, com risco de prazo (o preço oscila com os juros)", "Prêmio sobre o T-Bill: 1,6% real ao ano desde 1900", "Muitas vezes negativa, mas não sempre"],
        ["Crédito com grau de investimento", "Risco de prazo e de calote, baixo", "Prêmio sobre as Treasuries", "Positiva, mais fraca"],
        ["High yield", "Calote mais provável; mistura de bolsa e renda fixa", "Prêmio adicional", "Mais próxima das ações"],
        ["Ações", "Último da fila; oscilação de 15% a 20% ao ano", "6,6% real ao ano desde 1900", "n/d"],
      ],
      fonte: "Síntese da aula; retornos reais do UBS Global Investment Returns Yearbook 2025 (resumo público)",
      nota: "Crédito e high yield foram tema da aula 2 deste módulo.",
    },
    {
      tipo: "kpis",
      tempo: "35:53",
      titulo: "As Treasuries protegem das quedas da bolsa? Quase sempre, não sempre",
      itens: [
        { rotulo: "Correlação ações e títulos nos EUA", valor: 0.19, formato: { casas: 2 }, nota: "média de longo prazo, desde 1900" },
        { rotulo: "S&P 500 em 2022", valor: -18.04, formato: { sufixo: "%", casas: 1 }, destaque: true, nota: "com dividendos" },
        { rotulo: "Treasury de 10 anos em 2022", valor: -17.83, formato: { sufixo: "%", casas: 1 }, nota: "caíram juntos" },
        { rotulo: "Treasury de 10 anos em 2008", valor: 20.1, formato: { sufixo: "%", casas: 1 }, nota: "S&P 500: −36,6%" },
      ],
      fonte: "UBS Global Investment Returns Yearbook 2025, resumo público (figura 55); Aswath Damodaran, Historical Returns on Stocks, Bonds and Bills (jan/2026)",
      nota: "Correlação vai de −1 (sempre em sentidos opostos) a 1 (sempre juntos). Do fim dos anos 1990 até 2021, ela foi predominantemente negativa nos EUA; a era terminou em 2022, quando ações e títulos caíram juntos.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "É o grande debate que Tony traz. Durante duas décadas, quando a bolsa caía, as Treasuries subiam: em 2008, o título de 10 anos rendeu 20% enquanto o S&P 500 perdia 37%. Essa proteção natural é o motivo de tanta gente ter ações e títulos americanos na mesma carteira. Em 2022, com a inflação alta e os juros subindo rápido, os dois caíram quase 18%.",
        "Parte do mercado acha que os grandes déficits do governo americano estão tirando das Treasuries o papel de proteção: com muita dívida para vender, o título longo passaria a cair justamente quando o mundo fica nervoso. Tony não crava a resposta. Ele lembra que, ao montar a carteira, você toma uma posição nesse debate, conscientemente ou não, e que vale levar essa conversa ao seu assessor.",
      ],
    },

    // ---- 11. S&P 500 contra Ibovespa ----------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "sp-500-contra-ibovespa",
      titulo: "S&P 500 contra Ibovespa, em dólar",
      resumo: "Até 2010, o Brasil ganhou de goleada; depois, o jogo virou. No total, os EUA renderam mais, e com muito menos sobe e desce.",
      tempo: "36:56",
    },
    {
      tipo: "grafico",
      titulo: "US$ 100 no fim de 1999 viraram cerca de US$ 740 no S&P 500 e US$ 310 no Ibovespa",
      subtitulo: "Valor acumulado em dólar, com dividendos, fim de 1999 = 100, escala logarítmica",
      forma: "linha",
      escala: "log",
      eixoX: anosBr,
      series: [
        { nome: "S&P 500", valores: spUsd, destaque: true },
        { nome: "Ibovespa em dólar", valores: ibovUsd },
      ],
      formato: "indice",
      referencia: { valor: 100, rotulo: "Fim de 1999" },
      marcos: [
        { em: "2007", rotulo: "Boom das commodities" },
        { em: "2010", rotulo: "Pico do Ibovespa em dólar" },
        { em: "2015", rotulo: "Fundo: −73% desde 2010" },
      ],
      fonte: "Aswath Damodaran, Historical Returns on Stocks, Bonds and Bills (jan/2026); Banco Central do Brasil, SGS 7845 (Ibovespa, até 2018) e SGS 3696 (dólar de fim de mês); B3, fechamentos anuais do Ibovespa de 2019 a 2025",
      nota: "Fim de cada ano, em dólar nominal. O Ibovespa já reinveste os proventos das empresas. Na aula, Tony lê no gráfico US$ 800 e US$ 500; a diferença vem da base de dados usada.",
    },
    {
      tipo: "tabela",
      titulo: "As eras de um contra o outro, em dólar",
      colunas: ["Período", "S&P 500, ao ano", "Ibovespa em dólar, ao ano", "Quem ganhou"],
      linhas: [
        ["2000 a 2007", "+1,6%", "+18,1%", "Brasil, de goleada"],
        ["2008 a 2010, com a crise no meio", "−2,8%", "+4,9%", "Brasil"],
        ["2011 a 2025", "+13,9%", "−2,3%", "EUA, de goleada"],
        ["2001 a 2025 (recorte da aula)", "+8,7%", "+5,4%", "EUA"],
        ["2001 a 2025, descontada a inflação americana", "+6,1%", "+2,8%", "EUA"],
      ],
      fonte: "Mesmas fontes do gráfico acima; inflação americana de Damodaran e BLS",
      nota: "Na aula, 8,8% contra 6,6% ao ano, de 2001 a 2025, com outra base. Tony chama esses números de retorno real e diz que, por isso, incluem dividendos; são duas coisas diferentes. Retorno real desconta a inflação; retorno total inclui os dividendos. Aqui, as linhas de cima são retorno total em dólar nominal, e a última é retorno total real.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A leitura de Tony bate com os dados. De 2000 a 2007, o Brasil surfou o boom das commodities puxado pela China, com um primeiro governo Lula bem avaliado pelo mercado, e deu uma surra na bolsa americana. Atravessou até a crise de 2008 em vantagem. A partir de 2011, a relação se inverteu: queda das commodities, desaceleração chinesa e, na opinião de Tony, a má gestão econômica do primeiro mandato de Dilma Rousseff.",
        "No período inteiro, a diferença não parece enorme. Só que 3 pontos ao ano, compostos por 25 anos, viram mais que o dobro de patrimônio no fim. E o que o número médio esconde é o caminho: a bolsa brasileira em dólar oscilou três vezes mais.",
      ],
    },
    {
      tipo: "kpis",
      tempo: "40:09",
      titulo: "O Ibovespa em dólar oscilou três vezes mais que o S&P 500",
      itens: [
        { rotulo: "Oscilação anual, Ibovespa em dólar", valor: 50.6, formato: { sufixo: "%", casas: 0 }, destaque: true, nota: "desvio-padrão, 2000 a 2025" },
        { rotulo: "Oscilação anual, S&P 500", valor: 17.4, formato: { sufixo: "%", casas: 0 }, nota: "desvio-padrão, 2000 a 2025" },
        { rotulo: "Anos negativos, Ibovespa em dólar", valor: 13, formato: { sufixo: " de 26" }, nota: "S&P 500: 6 de 26" },
        { rotulo: "Pior queda, Ibovespa em dólar", valor: -73, formato: { sufixo: "%", casas: 0 }, nota: "fim de 2010 ao fim de 2015" },
      ],
      fonte: "Cálculo sobre os retornos anuais em dólar do gráfico acima (Damodaran; BCB; B3)",
      nota: "Com dados de fim de ano. Pelos fechamentos mensais, as quedas do pico ao fundo são ainda maiores.",
    },

    // ---- 12. a matemática cruel ---------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "a-matematica-cruel-das-quedas",
      titulo: "A matemática cruel das quedas",
      resumo: "Perder 50% pede uma alta de 100% para voltar. Por isso evitar grandes quedas vale mais que pegar grandes altas.",
      tempo: "41:13",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Você tem R$ 100 mil. A carteira cai 50% e vira R$ 50 mil. Quanto ela precisa subir para voltar aos R$ 100 mil? Não são 50%: 50% de R$ 50 mil são R$ 25 mil, e você chega a R$ 75 mil. Precisa dobrar, subir 100%. Essa é a assimetria que Tony chama de cruel e que, segundo ele, muitos investidores, e até assessores, não entendem bem.",
        "Quanto maior a queda, mais a conta piora. Uma perda de 10% pede 11% de alta; uma de 30%, 43%; uma de 73%, como a do Ibovespa em dólar entre 2010 e 2015, pede 270%. No fim de 2025, dez anos depois do fundo, o Ibovespa em dólar ainda estava 30% abaixo do pico de 2010.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Quanto maior a queda, mais desproporcional a alta para voltar",
      subtitulo: "Alta necessária para recuperar cada queda, em %",
      forma: "barra",
      eixoX: ["Queda de 10%", "20%", "30%", "40%", "50%", "60%", "73%", "80%"],
      series: [{ nome: "Alta necessária para voltar", valores: [11.1, 25, 42.9, 66.7, 100, 150, 270.4, 400], destaque: true }],
      formato: { sufixo: "%", casas: 0 },
      ilustrativo: true,
      nota: "Conta exata: a alta necessária é a queda dividida pelo que sobrou. Perder 50% e depois ganhar 50% deixa você com 75% do início.",
    },
    {
      tipo: "destaque",
      texto: "É mais importante você evitar grandes quedas do que tentar pegar as grandes altas. A matemática é cruel nesse sentido.",
      fonte: "Tony Volpon, na aula, 41:13",
    },
    {
      tipo: "kpis",
      titulo: "Depois das grandes quedas, quanto tempo a bolsa americana levou para voltar",
      itens: [
        { rotulo: "Crash de 1929", valor: 15.5, formato: { sufixo: " anos", casas: 1 }, destaque: true, nota: "fundo em jul/1932, volta em fev/1945" },
        { rotulo: "1973 a 1974", valor: 10, formato: { prefixo: "mais de ", sufixo: " anos" }, nota: "debaixo d'água em termos reais" },
        { rotulo: "Bolha da internet", valor: 7.5, formato: { sufixo: " anos", casas: 1 }, nota: "de mar/2000 a jul/2007" },
        { rotulo: "Crise de 2008", valor: 4, formato: { sufixo: " anos" }, nota: "do fundo de fev/2009 à recuperação" },
      ],
      fonte: "UBS Global Investment Returns Yearbook 2025, resumo público, figura 36 (Dimson, Marsh e Staunton)",
      nota: "Retornos reais com dividendos. Nos anos de recuperação, o investidor precisa continuar investido; quem sai no fundo transforma a queda em perda definitiva.",
    },
    {
      tipo: "conceito",
      termo: "Média que engana",
      definicao:
        "Duas carteiras rendem, em média, 10% ao ano. A primeira sobe 10% todo ano. A segunda sobe 60% num ano e cai 40% no outro: média de 10%, mas R$ 100 viram R$ 160 e depois R$ 96. Perdeu dinheiro. Quanto mais a carteira oscila, maior a distância entre a média dos anos e o que você de fato acumula. É o arrasto da volatilidade.",
      naPratica:
        "Por isso Tony insiste na volatilidade quando compara as duas bolsas. Um mercado que oscila muito, como o brasileiro em dólar, pode ter anos espetaculares e, ainda assim, entregar pouco no fim. E a oscilação cobra também na cabeça: quanto mais a bolsa cai, maior a disciplina para não vender no fundo. Na bolsa americana, a disciplina exigida é menor, porque, fora as grandes crises, ela cai menos.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 5, seção 5.5" },
    },
    {
      tipo: "conceito",
      tempo: "42:21",
      termo: "Aversão à perda",
      definicao:
        "Perder R$ 1.000 dói mais do que ganhar R$ 1.000 alegra. Os psicólogos Daniel Kahneman e Amos Tversky mediram isso: para a maioria das pessoas, a dor da perda pesa cerca de duas vezes o prazer do ganho do mesmo tamanho. Além disso, cada um mede o resultado a partir do preço que pagou, e não do valor de hoje, o que leva a segurar perdedoras esperando voltar ao preço e a vender vencedoras cedo demais.",
      naPratica:
        "A matemática das quedas e a psicologia das perdas trabalham juntas contra o investidor. A queda pede uma alta desproporcional para voltar, e o medo empurra para vender justamente antes dela. Tony chama de cristalizar a perda. A defesa é decidir antes, com calma, quanto da carteira você aguenta ver cair, e deixar a regra escrita para as semanas ruins.",
      referencia: { autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen", obra: "Princípios de Finanças Corporativas", capitulo: "cap. 13, seção 13.4" },
    },
    {
      tipo: "texto",
      tempo: "43:28",
      paragrafos: [
        "Tony fecha com cinco mensagens. Entenda o que é uma ação, principalmente em comparação com a renda fixa. A bolsa americana pagou um bom prêmio, perto de 6,6% ao ano acima da inflação, e essa média serve de referência, sabendo que o prêmio muda muito conforme o momento. Há eras, e algumas são de decepção. A vantagem americana desde 2008 veio do lucro e também do múltiplo. E o Ibovespa não foi tão pior assim, quando se contam os bons anos do começo do século, mas com uma volatilidade muito maior.",
        "Para quem monta uma carteira fora do Brasil, a lição prática é ter alguma tese sobre o momento, em especial sobre o ciclo da tecnologia, para decidir quanto da parte internacional fica na bolsa americana. E manter as duas camadas de diversificação conversando: dentro da bolsa e entre bolsa e renda fixa. Esta é a última aula de Tony no curso; com ela, você tem material para uma conversa mais concreta com quem cuida dos seus investimentos.",
      ],
    },
    {
      tipo: "destaque",
      texto: "Qualquer investidor brasileiro deve ter parte dos seus investimentos fora do Brasil, por questão de diversificação e de performance.",
      fonte: "Tony Volpon, encerramento do Módulo II, 45:31",
    },
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Elroy Dimson, Paul Marsh e Mike Staunton",
          titulo: "UBS Global Investment Returns Yearbook 2025: Summary Edition",
          ano: 2025,
          nota: "125 anos de retornos de ações, títulos e caixa em 35 mercados; base dos números de 1900 a 2024 da aula.",
        },
        {
          autor: "Aswath Damodaran",
          titulo: "Historical Returns on Stocks, Bonds and Bills: 1928-2025",
          ano: 2026,
          nota: "NYU Stern, atualização de jan/2026. Retornos anuais do S&P 500 com dividendos, T-Bills e Treasuries.",
        },
        {
          autor: "Robert J. Shiller",
          titulo: "Irrational Exuberance",
          ano: 2015,
          nota: "3ª ed. Origem do CAPE e das séries longas de preço, lucro e dividendo do S&P 500.",
        },
        {
          autor: "John D. Stowe, Thomas R. Robinson, Jerald E. Pinto e Dennis W. McLeavey",
          titulo: "Analysis of Equity Investments: Valuation",
          ano: 2002,
          nota: "AIMR. Prêmio de risco histórico e prospectivo, P/L justificado, Nifty Fifty e comparação de múltiplos entre países.",
        },
        {
          autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen",
          titulo: "Princípios de Finanças Corporativas",
          ano: 2013,
          nota: "10ª ed. Cap. 7 (um século de retornos e o prêmio em 17 países), cap. 13 (finanças comportamentais) e cap. 16 (dividendos, recompras e impostos).",
        },
        {
          autor: "Zvi Bodie, Alex Kane e Alan J. Marcus",
          titulo: "Investments",
          ano: 2014,
          nota: "10ª ed. Caps. 5 e 6 (prêmio de risco e médias), 7 (diversificação), 10 (fatores) e 11 (gestão passiva).",
        },
        {
          autor: "Merton H. Miller e Franco Modigliani",
          titulo: "Dividend Policy, Growth, and the Valuation of Shares",
          ano: 1961,
          nota: "Journal of Business. A tese de que, sem impostos e custos, a política de dividendos não muda o valor da empresa.",
        },
        {
          autor: "Daniel Kahneman e Amos Tversky",
          titulo: "Prospect Theory: An Analysis of Decision under Risk",
          ano: 1979,
          nota: "Econometrica. A origem da aversão à perda.",
        },
      ],
    },
  ],
};

export default secao;

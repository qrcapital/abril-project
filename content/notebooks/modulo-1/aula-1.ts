import type { SecaoDaAula } from "@/lib/notebook";

// Módulo II, aula 1 ("O paradoxo do devedor mais seguro do mundo"), com Tony Volpon, cerca de 44 min. No
// Panda é o "TONY VOLPON - VÍDEO 01" (ele a chama de "aula número 5", pela numeração global do curso).
// Seção escrita a partir da transcrição em `transcricoes/modulo-1/aula-1.txt` e do super dossiê
// (`_referencias-livros/dossie/`, seção "Aula 1" do RANKING-MODULO-II.md). Segue a ordem da fala: o
// paradoxo do maior devedor, as quatro razões do juro baixo (dólar, liquidez, regulação, capacidade
// fiscal), os instrumentos e seus pares brasileiros, a curva de juros, a precificação de tudo o que é
// dólar sobre a Treasury (crédito, prazo, liquidez, opções embutidas), a escada de prêmios, a taxa
// real, o T-Bill como taxa mínima, o Sharpe e a duration.
// Tom de docs/TOM-DO-NOTEBOOK.md: conversa, exemplo antes do conceito, sem fórmula no corpo.
//
// NÚMEROS CONFERIDOS EM 08/OUT/2026 nas fontes primárias citadas em cada bloco: Tesouro americano
// (Daily Treasury Par Yield Curve de 3/jul/2023, 30/jun/2026 e 5/out/2026; Debt to the Penny de
// 5/out/2026), Federal Reserve H.15 via FRED (GS10 e FII10 mensais até set/2026; DFII10 diário),
// ICE BofA via FRED (spreads IG, BB, B e CCC de 5/out/2026; o FRED só guarda três anos dessas séries
// desde abr/2026, por isso não há gráfico histórico de spread), FMI (COFER, Data Brief de 30/set/2026),
// CRFB (estimativa do ano fiscal de 2026, de 1º/out/2026), BLS (CPI de ago/2026), BCB (SGS 5727 e
// 13522), Tesouro Direto (taxas de 5/out/2026, via EuQueroInvestir) e Damodaran (retornos de 2008 e
// 2022, os mesmos do notebook da aula 3 do Módulo I). Voz institucional (docs/TOM-DO-NOTEBOOK.md): o
// texto não narra a fala nem a corrige. Onde fala e fonte diferem, usa o dado da fonte e explica como
// recorte: a dívida bruta (US$ 37 tri em meados de 2025, mais de 40 em 2026; os "27" da fala ficam de
// fora), as reservas em dólar (59% no fim de 2020, 56,7% no 2º tri/2026, mesma série do FMI), o FRN
// (emitido desde 2014, mas cerca de 2% da dívida negociável, como no notebook da aula 3 do Módulo I),
// a LFT (segue a Selic, que anda junto com o CDI), o investment grade (escala de AAA a BBB-, com a
// maior parte do mercado em A e BBB), a última taxa real do slide (4,45% pela conta do exemplo) e a
// volatilidade da bolsa no exemplo de Sharpe (cerca de 15%, hipótese do exercício).
//
// ILUSTRATIVO: a escada de taxas reais e o Sharpe vêm do slide da aula (marcados como tal); o gráfico de
// duration é conta do autor sobre títulos hipotéticos; o simulador de dívida usa premissas declaradas.
//
// Itens do super dossiê usados: AMC-063, BKM-067, BMA-008, BKM-066, AMF-055, BKM-065, BMA-010,
// BKM-021, BKM-023, AMF-067, AMC-058, AMF-045, BKM-068, AMC-052, BMA-009, BKM-033, BKM-069, AMC-054,
// BMA-086, AMC-079, BKM-038 e AMC-059.

// Mensal, jan/2016 a set/2026 (médias mensais de dias úteis, H.15).
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const meses = Array.from({ length: 129 }, (_, i) => `${MESES[i % 12]}/${2016 + Math.floor(i / 12)}`);
// Treasury de 10 anos, nominal (FRED GS10).
const t10 = [
  2.09, 1.78, 1.89, 1.81, 1.81, 1.64, 1.5, 1.56, 1.63, 1.76, 2.14, 2.49,
  2.43, 2.42, 2.48, 2.3, 2.3, 2.19, 2.32, 2.21, 2.2, 2.36, 2.35, 2.4,
  2.58, 2.86, 2.84, 2.87, 2.98, 2.91, 2.89, 2.89, 3.0, 3.15, 3.12, 2.83,
  2.71, 2.68, 2.57, 2.53, 2.4, 2.07, 2.06, 1.63, 1.7, 1.71, 1.81, 1.86,
  1.76, 1.5, 0.87, 0.66, 0.67, 0.73, 0.62, 0.65, 0.68, 0.79, 0.87, 0.93,
  1.08, 1.26, 1.61, 1.64, 1.62, 1.52, 1.32, 1.28, 1.37, 1.58, 1.56, 1.47,
  1.76, 1.93, 2.13, 2.75, 2.9, 3.14, 2.9, 2.9, 3.52, 3.98, 3.89, 3.62,
  3.53, 3.75, 3.66, 3.46, 3.57, 3.75, 3.9, 4.17, 4.38, 4.8, 4.5, 4.02,
  4.06, 4.21, 4.21, 4.54, 4.48, 4.31, 4.25, 3.87, 3.72, 4.1, 4.36, 4.39,
  4.63, 4.45, 4.28, 4.28, 4.42, 4.38, 4.39, 4.26, 4.12, 4.06, 4.09, 4.14,
  4.21, 4.13, 4.25, 4.32, 4.48, 4.47, 4.6, 4.68, 4.99,
];
// TIPS de 10 anos, juro real (FRED FII10).
const tips10 = [
  0.67, 0.47, 0.34, 0.19, 0.21, 0.17, 0.04, 0.09, 0.12, 0.1, 0.32, 0.56,
  0.42, 0.4, 0.49, 0.39, 0.47, 0.46, 0.55, 0.43, 0.37, 0.5, 0.5, 0.5,
  0.54, 0.76, 0.75, 0.74, 0.84, 0.79, 0.77, 0.79, 0.88, 1.04, 1.11, 1.02,
  0.92, 0.8, 0.66, 0.6, 0.57, 0.37, 0.31, 0.04, 0.11, 0.15, 0.17, 0.14,
  0.04, -0.11, -0.12, -0.45, -0.44, -0.54, -0.83, -1.01, -0.98, -0.92, -0.84, -0.98,
  -1.0, -0.92, -0.66, -0.71, -0.85, -0.82, -1.01, -1.07, -0.97, -0.95, -1.06, -0.99,
  -0.69, -0.52, -0.72, -0.14, 0.21, 0.53, 0.53, 0.39, 1.14, 1.59, 1.52, 1.36,
  1.29, 1.41, 1.36, 1.19, 1.36, 1.55, 1.6, 1.83, 2.04, 2.41, 2.2, 1.84,
  1.79, 1.93, 1.9, 2.15, 2.15, 2.05, 1.97, 1.76, 1.62, 1.81, 2.03, 2.09,
  2.23, 2.03, 1.95, 2.04, 2.11, 2.09, 2.01, 1.88, 1.75, 1.76, 1.83, 1.9,
  1.91, 1.82, 1.91, 1.94, 2.04, 2.18, 2.35, 2.4, 2.64,
];

// Curva par do Tesouro americano, taxas de fechamento.
const prazosCurva = ["1 mês", "3 meses", "6 meses", "1 ano", "2 anos", "3 anos", "5 anos", "7 anos", "10 anos", "20 anos", "30 anos"];
const curva5out26 = [4.05, 4.22, 4.3, 4.47, 4.84, 4.97, 5.06, 5.19, 5.31, 5.7, 5.66];
const curva30jun26 = [3.7, 3.87, 4.01, 3.98, 4.14, 4.15, 4.19, 4.3, 4.44, 4.93, 4.91];
const curva3jul23 = [5.27, 5.44, 5.53, 5.43, 4.94, 4.56, 4.19, 4.03, 3.86, 4.08, 3.87];

// Variação de preço, em %, de títulos com cupom de 5% ao ano (pago a cada seis meses) comprados ao par,
// a 5%, se a taxa de mercado vai a 6% ou a 4%. Conta do autor, valor presente dos fluxos.
const prazosDuration = ["1 ano", "2 anos", "5 anos", "10 anos", "30 anos"];
const quedaSeSobe = [-1.0, -1.9, -4.3, -7.4, -13.8];
const altaSeCai = [1.0, 1.9, 4.5, 8.2, 17.4];

const secao: SecaoDaAula = {
  aula: 1,
  blocos: [
    // ---- 1. O paradoxo ---------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "o-paradoxo",
      titulo: "O maior devedor do mundo paga um dos menores juros",
      resumo: "Os Estados Unidos devem mais de US$ 40 trilhões e tomam emprestado por dez anos a pouco mais de 5%. O Brasil paga 13%. Por quê?",
      tempo: "0:00",
    },
    {
      tipo: "texto",
      capitular: true,
      paragrafos: [
        "Pense num país que deve mais de US$ 40 trilhões, gasta todo ano bem mais do que arrecada e, mesmo assim, consegue pegar dinheiro emprestado por dez anos pagando pouco mais de 5% ao ano. Agora pense no Brasil, que deve muito menos e paga 13%. Parece injusto. É por esse paradoxo que começa o módulo de Tony Volpon, ex-diretor do Banco Central.",
        "São três aulas sobre os Estados Unidos: primeiro o Tesouro americano, depois o crédito das empresas e, por fim, as bolsas. A ordem tem razão de ser: a taxa dos títulos do Tesouro americano, as Treasuries, é a régua com que o mundo dá preço a quase tudo o que rende em dólar. Entender essa régua é o primeiro passo para qualquer decisão sobre renda fixa lá fora.",
      ],
    },
    {
      tipo: "texto",
      tempo: "3:39",
      paragrafos: [
        "Os números do paradoxo. A dívida bruta do governo americano passou de US$ 40 trilhões em 2026. O déficit, a diferença entre o que o governo gasta e o que arrecada, ficou perto de 6% do PIB no ano fiscal encerrado em setembro, nível alto para um país rico e sem recessão. Ainda assim, em meados de 2026, o título de dez anos do Tesouro rendia entre 4,5% e 4,6%, contra 14% a 16% dos prefixados brasileiros de prazo parecido.",
        "A dívida cresce depressa: eram US$ 37 trilhões em meados de 2025 e, em 2026, a conta já passou dos 40. Desse total, US$ 32,4 trilhões estão nas mãos do público, isto é, de investidores, bancos, bancos centrais estrangeiros e do próprio Fed. O resto o governo deve a si mesmo, em fundos como o da previdência. A parte do público é a que importa para o paradoxo: é ela que o mercado precisa comprar e carregar, e é dela que parte o simulador mais adiante.",
        "De lá para cá, os juros americanos subiram e os brasileiros caíram, depois do primeiro turno da eleição. A distância diminuiu, mas o paradoxo continua de pé: quem deve mais paga muito menos.",
      ],
    },
    {
      tipo: "kpis",
      titulo: "O paradoxo em quatro números",
      itens: [
        { rotulo: "Dívida bruta do governo americano", valor: 40.25, formato: { prefixo: "US$ ", sufixo: " tri", casas: 2 }, nota: "5/out/2026" },
        { rotulo: "Déficit americano no ano fiscal de 2026", valor: 6.2, formato: { sufixo: "% do PIB", casas: 1 }, nota: "estimativa preliminar" },
        { rotulo: "Treasury de 10 anos", valor: 5.31, formato: { sufixo: "% a.a.", casas: 2 }, destaque: true, nota: "5/out/2026" },
        { rotulo: "Tesouro Prefixado 2037 (Brasil)", valor: 13.0, formato: { sufixo: "% a.a.", casas: 2 }, nota: "5/out/2026, com juros semestrais" },
      ],
      fonte:
        "U.S. Department of the Treasury, Debt to the Penny e Daily Treasury Par Yield Curve Rates; Committee for a Responsible Federal Budget (CRFB), estimativa de 1º/out/2026; Tesouro Direto, taxas de 5/out/2026",
      nota: "O ano fiscal americano vai de outubro a setembro. O número oficial do déficit sai em outubro. A taxa brasileira é a do dia seguinte ao primeiro turno; na sexta anterior, era de 14,17%.",
    },

    // ---- 2. Por que o juro é baixo -----------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "por-que-o-juro-e-baixo",
      titulo: "Por que o mundo aceita ganhar pouco",
      resumo: "Boa parte de quem compra Treasuries não está atrás da taxa. Está atrás de serviços que só esse papel entrega.",
      tempo: "4:55",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Juro, como qualquer preço, sai do encontro entre oferta e procura. O Tesouro americano oferece muitos títulos, é verdade. Mas a procura por eles é de um tipo raro, e tem quatro razões.",
        "A primeira é o dólar. Ele é a principal moeda de reserva do planeta, a moeda em que se fatura boa parte do comércio de bens e de commodities e em que se emitem trilhões em dívida fora dos Estados Unidos, o chamado mercado de eurodólar. Uma exportadora brasileira que vende para uma importadora italiana provavelmente vai faturar em dólar, não em reais nem em euros. Tudo isso cria uma procura natural por ativos em dólar.",
        "A segunda é a liquidez: dá para comprar ou vender bilhões em Treasuries sem mexer no preço. A terceira é a regulação. Bancos precisam guardar ativos líquidos e de alta qualidade, fundos de money market compram T-Bills por exigência de segurança e câmaras de compensação aceitam Treasuries como a garantia preferida. A quarta é a capacidade fiscal: uma economia enorme e produtiva, com carga tributária baixa para um país rico e que só se endivida na própria moeda.",
      ],
    },
    {
      tipo: "fluxo",
      titulo: "Do dólar como moeda do mundo ao juro mais baixo",
      nos: [
        { titulo: "Dólar, a moeda do mundo", texto: "Comércio, reservas e dívidas fora dos EUA em dólar." },
        { titulo: "Procura natural por ativos em dólar", texto: "Quem vive de dólar precisa guardar dólar.", sentido: "sobe" },
        { titulo: "Treasury vira o \"quase dinheiro\"", texto: "É caixa, garantia e margem do sistema financeiro." },
        { titulo: "Compradores cativos", texto: "Bancos, fundos de money market, câmaras e bancos centrais.", sentido: "sobe" },
        { titulo: "Juro mais baixo", texto: "O investidor aceita menos em troca dessas conveniências.", sentido: "desce" },
      ],
      ligacoes: ["cria", "concentra-se na", "atrai", "derruba o"],
      fonte: "Síntese da aula",
    },
    {
      tipo: "texto",
      tempo: "8:02",
      paragrafos: [
        "As reservas cambiais dos bancos centrais mostram o peso do dólar. Pela série do FMI, a fatia da moeda americana era de 59% no fim de 2020 e de 56,7% no segundo trimestre de 2026, o dado mais recente; o número varia conforme a data do recorte. A direção não muda: o dólar perde espaço devagar, para o euro, para moedas menores e, fora dessa conta, para o ouro. Mas ainda pesa quase três vezes o euro, o segundo colocado.",
        "Isso importa para o juro porque reserva em dólar, na prática, fica guardada em Treasuries. Cada banco central que mantém dólar no cofre é um comprador fiel do Tesouro americano, e é essa fila de compradores que ajuda a segurar a taxa.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "O dólar perde espaço nas reservas do mundo, mas devagar",
      subtitulo: "Fatia do dólar nas reservas cambiais com moeda identificada, em %",
      forma: "barra",
      eixoX: ["1999", "fim de 2020", "1º tri/2026", "2º tri/2026"],
      series: [{ nome: "Dólar nas reservas", valores: [71, 59, 57.18, 56.7], destaque: true }],
      formato: { sufixo: "%", casas: 1 },
      fonte:
        "FMI, Currency Composition of Official Foreign Exchange Reserves (COFER), Data Brief de 30/set/2026; FMI, IMF Blog (mai/2021) para 1999 e 2020",
      nota: "Valores de 1999 e 2020 arredondados na fonte. No 2º tri/2026, o euro tinha 20,6%, o iene 5,0% e o renminbi 2,1%. O ouro não entra nesta conta, que só mede moedas.",
    },
    {
      tipo: "texto",
      tempo: "9:57",
      paragrafos: [
        "Um fundo brasileiro que vai operar derivativos em Chicago precisa deixar uma garantia, a margem. Quase sempre, ela vai em Treasuries. Se ele tentar entregar outro papel, vai precisar de um valor maior, porque o outro é menos líquido e menos seguro. É nesse sentido que a Treasury é o \"quase dinheiro\" do sistema financeiro.",
        "Isso tem nome técnico: serviços não pecuniários. Quem tem Treasuries recebe a taxa e mais uma série de conveniências que não aparecem no extrato. Pode usá-las como garantia, vender a qualquer hora, cumprir a regra do regulador. Como essas conveniências valem alguma coisa, o investidor aceita uma taxa menor. Parte do juro baixo americano é o preço desse serviço.",
      ],
    },
    {
      tipo: "texto",
      tempo: "12:33",
      paragrafos: [
        "Capacidade fiscal não é perfeição fiscal. O mercado aposta que, se for preciso, os Estados Unidos conseguem arrumar as contas, como já fizeram em outros momentos. Mas isso é uma decisão política, não uma garantia. E os déficits que cresceram na pandemia e não voltaram já empurram os juros longos para cima e ajudam a explicar por que a curva americana opera mais alta do que antes de 2020.",
        "Os números de 2026 mostram de onde vem essa pressão. Os juros da dívida custaram cerca de US$ 1,1 trilhão no ano fiscal, 3,4% do PIB, mais do que o orçamento de defesa. Juro pago com déficit vira mais dívida, que precisa de mais compradores. Dá para sentir essa aritmética no simulador abaixo, que parte da dívida americana nas mãos do público, perto de 100% do PIB, e de um déficit primário, o que não conta os juros, de cerca de 2,8% do PIB.",
      ],
    },
    {
      tipo: "simulador",
      id: "divida-americana",
      titulo: "A aritmética da dívida americana",
      descricao:
        "A dívida cresce com o juro e encolhe, em proporção do PIB, com o crescimento da economia. O déficit primário soma mais dívida todo ano. Mexa nos três para ver quanto esforço fiscal seria preciso para parar a conta.",
      modelo: "dividaPib",
      parametros: {
        divida: {
          valor: 100,
          rotulo: "Dívida americana nas mãos do público",
          ajuda: "Cerca de US$ 32,3 trilhões no fim do ano fiscal de 2026, perto de 100% do PIB (estimativa do CRFB).",
        },
        juros: {
          valor: 1.5,
          rotulo: "Juro real médio da dívida (r)",
          ajuda: "Os juros custaram US$ 1,1 trilhão sobre US$ 32,3 trilhões em 2026, perto de 3,4% nominais. Descontada a inflação, o custo médio fica abaixo de 1%; um TIPS de 10 anos novo pagava 2,95% reais em 5/out/2026. O valor inicial fica no meio.",
        },
        crescimento: { valor: 2, ajuda: "Hipótese de crescimento real perto da média americana recente." },
        primario: {
          valor: -2.75,
          ajuda: "Déficit total de 6,2% do PIB menos juros de 3,4% do PIB, pela estimativa do CRFB para 2026. Negativo é déficit.",
        },
        anos: { valor: 10 },
      },
      aviso:
        "Aritmética com juro, crescimento e primário constantes. Ignora a reação dos juros à própria dívida, a inflação e o ciclo econômico. Não é projeção oficial: a do CBO, de fev/2026, leva a dívida a 120% do PIB em 2036.",
    },

    // ---- 3. Os instrumentos ------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "os-instrumentos",
      titulo: "Cinco títulos, cinco problemas resolvidos",
      resumo: "T-Bills, notes, bonds, TIPS e FRNs, cada um com seu parente no Tesouro Direto. A pergunta certa é qual problema você quer resolver.",
      tempo: "13:57",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Comece pelo mais simples. O T-Bill é um título de até um ano que não paga juros no caminho. Você compra com desconto e recebe o valor cheio no vencimento: paga 98 hoje, recebe 100 daqui a um ano, e a diferença, pouco mais de 2%, é o seu rendimento. É o mesmo desenho da LTN, o Tesouro Prefixado brasileiro. Como o prazo é curto, o preço quase não oscila. É o lugar natural do caixa.",
        "Depois vêm os notes, de 2 a 10 anos, e os bonds, de 20 e 30 anos. Os dois pagam juros fixos a cada seis meses, definidos no leilão em que o Tesouro vende os papéis. Cada trecho tem sua clientela. Quem precisa de caixa fica no curto. Bancos centrais que guardam reservas em dólar preferem a faixa do meio: segundo estudos sobre o tema, o prazo médio das carteiras deles fica entre 2 e 5 anos. Seguradoras de vida e fundos de pensão, que têm compromissos para daqui a décadas, compram os bonds.",
      ],
    },
    {
      tipo: "texto",
      tempo: "16:16",
      paragrafos: [
        "O TIPS é o primo americano do Tesouro IPCA+, a NTN-B. O valor do título é corrigido pela inflação ao consumidor, o CPI, e a taxa combinada vem por cima, como juro real. Imagine um TIPS de US$ 1.000 que paga 2% reais ao ano. Se a inflação americana for de 3% num ano, o principal vira US$ 1.030 e os juros passam a ser calculados sobre esse valor maior. O poder de compra em dólar fica protegido. Há TIPS de 5, 10 e 30 anos.",
        "Por fim, o título de juro flutuante, o FRN, que acompanha a taxa de curto prazo e por isso quase não oscila de preço. É o parente da LFT, o Tesouro Selic, que segue a Selic, taxa que anda colada ao CDI. A diferença está no peso. O Tesouro americano emite FRNs de 2 anos desde janeiro de 2014, atrelados ao T-Bill de 13 semanas, mas eles são uma parcela pequena da dívida, cerca de 2% do que é negociável, contra quase metade da dívida brasileira em LFT. Quem quer mais papel flutuante em dólar recorre a bancos que montam esses títulos a partir de Treasuries e swaps, contratos que trocam juro fixo por juro flutuante.",
        "Para quem está acostumado ao pós-fixado, essa é a diferença que mais pesa: em dólar, quase toda a renda fixa do governo tem taxa travada, e o preço dela oscila com os juros. O capítulo da duration volta a esse ponto.",
      ],
    },
    {
      tipo: "texto",
      tempo: "19:11",
      paragrafos: [
        "Em meados de 2026, o TIPS de 10 anos pagava perto de 2% acima da inflação, contra 6% a 8% das NTN-Bs. Os números andaram. Em 5 de outubro de 2026, o TIPS de 10 anos pagava 2,95% reais e o Tesouro IPCA+ com Juros Semestrais 2037, 6,86%, depois de uma queda forte das taxas brasileiras no dia seguinte ao primeiro turno.",
        "O gráfico mostra a história mais longa. Antes da pandemia, o juro real americano estava perto de zero. De 2020 até o começo de 2022, ficou negativo, perto de 1% abaixo da inflação: quem comprava um TIPS de 10 anos aceitava perder poder de compra. Depois, subiu junto com os juros do Fed. A linha de cima, a da Treasury nominal, conta a mesma história e volta no capítulo da precificação.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Em 2020 e 2021, o Tesouro americano pagou juro real negativo",
      subtitulo: "Taxa dos títulos de 10 anos, % ao ano, média mensal",
      forma: "linha",
      eixoX: meses,
      series: [
        { nome: "Treasury de 10 anos (nominal)", valores: t10 },
        { nome: "TIPS de 10 anos (real, acima da inflação)", valores: tips10, destaque: true },
      ],
      formato: { sufixo: "%", casas: 2 },
      referencia: { valor: 0, rotulo: "Zero" },
      marcos: [
        { em: "mar/2020", rotulo: "Pandemia" },
        { em: "mar/2022", rotulo: "Fed começa a subir juros" },
      ],
      fonte: "Federal Reserve, H.15, via FRED (séries GS10 e FII10)",
      nota: "Jan/2016 a set/2026. A diferença entre as duas linhas é a inflação que o mercado espera para os dez anos seguintes. O TIPS ficou abaixo de zero de fev/2020 a abr/2022.",
    },
    {
      tipo: "tabela",
      tempo: "20:29",
      titulo: "O problema que cada título resolve, e o parente dele no Brasil",
      colunas: ["Título", "Prazo", "Como paga", "Parente no Brasil", "O problema que resolve"],
      linhas: [
        ["T-Bill", "4 semanas a 1 ano", "Sem juros no caminho; comprado com desconto", "LTN curta (Tesouro Prefixado)", "Guardar caixa com pouco risco e algum rendimento"],
        ["Treasury Note", "2, 3, 5, 7 e 10 anos", "Juro fixo a cada seis meses", "NTN-F (Tesouro Prefixado com Juros Semestrais)", "Ser o núcleo da renda fixa: algum prazo, sem exagero"],
        ["Treasury Bond", "20 e 30 anos", "Juro fixo a cada seis meses", "Não há prefixado tão longo; o mais perto é a NTN-B longa", "Casar com compromissos de décadas, como os de seguradoras e fundos de pensão"],
        ["TIPS", "5, 10 e 30 anos", "Juro real a cada seis meses, sobre o principal corrigido pelo CPI", "NTN-B (Tesouro IPCA+)", "Travar um retorno acima da inflação e proteger o poder de compra"],
        ["FRN", "2 anos", "Juro que acompanha o T-Bill de 13 semanas, a cada três meses", "LFT (Tesouro Selic)", "Ter renda que segue o juro curto, com preço estável"],
      ],
      nota: "Prazos das emissões regulares em out/2026. No Tesouro Direto, o prefixado mais longo vence em 2037.",
      fonte: "U.S. Department of the Treasury (TreasuryDirect) e Tesouro Nacional; síntese da aula",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Antes de qualquer aplicação, a pergunta é simples: que problema eu estou tentando resolver? Caixa para daqui a seis meses pede uma coisa; um objetivo em dólar daqui a dez anos, outra. Para quem precisa do dinheiro em um ano, o ativo seguro é um título de um ano; para quem tem uma despesa em dólar daqui a cinco, um título de prazo parecido, e não o CDI nem uma Treasury de 30 anos.",
      ],
    },

    // ---- 4. A curva de juros -----------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "curva-de-juros",
      titulo: "A curva de juros: o preço do dinheiro em cada prazo",
      resumo: "O Fed segura a ponta curta. A ponta longa depende do que o mercado espera e de um prêmio pelo prazo.",
      tempo: "22:35",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Ponha num gráfico a taxa de cada título do Tesouro, do mais curto ao mais longo, e você tem a curva de juros. A ponta curta é ancorada pelo Fed, que fixa a taxa dos empréstimos de um dia para o outro entre os bancos. A ponta longa depende do que o mercado espera para os juros nos anos seguintes e de um prêmio a mais pelo prazo.",
        "Normalmente, a curva sobe. Quem empresta por dez anos só recebe a taxa combinada se esperar dez anos, e qualquer mudança nos juros mexe mais no preço desse título do que no de um papel de dois anos. O risco extra é pago com uma taxa maior. Mas a curva pode se inverter, com o curto pagando mais que o longo. Acontece quando o Fed sobe muito os juros e o mercado aposta que ele vai ter de cortá-los adiante. Foi o caso de 2023.",
        "Em meados de 2026, a curva subia com o prazo e a ponta curta estava um pouco abaixo de 4%. Desde então ela subiu inteira, e mais na ponta longa: o título de 10 anos foi de 4,44% no fim de junho para 5,31% em 5 de outubro.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Normalmente a curva sobe; em 2023, ela chegou a se inverter",
      subtitulo: "Taxa dos títulos do Tesouro americano por prazo, % ao ano",
      forma: "linha",
      eixoX: prazosCurva,
      series: [
        { nome: "5/out/2026", valores: curva5out26, destaque: true },
        { nome: "30/jun/2026, perto da gravação", valores: curva30jun26 },
        { nome: "3/jul/2023, curva invertida", valores: curva3jul23 },
      ],
      formato: { sufixo: "%", casas: 2 },
      fonte: "U.S. Department of the Treasury, Daily Treasury Par Yield Curve Rates",
      nota: "Taxas de fechamento. A curva de 30 de junho representa o meio de 2026. O eixo de prazos não é proporcional.",
    },

    // ---- 5. Precificação sobre a Treasury ----------------------------------------------------------
    {
      tipo: "capitulo",
      id: "precificacao-sobre-a-treasury",
      titulo: "Toda taxa em dólar começa na Treasury",
      resumo: "Qualquer título em dólar paga a Treasury de prazo parecido e mais um prêmio. Saber de onde vem o prêmio é saber o que você está comprando.",
      tempo: "24:32",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Qualquer título em dólar que não seja do Tesouro americano, de uma empresa, de um banco ou de outro país, paga a taxa da Treasury de prazo parecido e mais um prêmio. O prêmio existe porque o título tem algum risco que a Treasury não tem. É a mesma lógica do risco-país: um título do governo brasileiro em dólar rende a Treasury mais um prêmio, que o mercado acompanha pelo índice EMBI.",
        "O prêmio tem quatro fontes. Crédito: a empresa pode não pagar, e o Tesouro, que emite a própria moeda, não corre esse risco. Prazo: quanto mais longo, mais o preço oscila, e isso já vem embutido na própria curva. Liquidez: um título corporativo pode levar dias para achar comprador, e quem o carrega quer ser pago por isso. E as opções embutidas, cláusulas que dão a alguém o direito de mudar as regras no meio do caminho.",
      ],
    },
    {
      tipo: "fluxo",
      titulo: "Como se monta a taxa de um título em dólar",
      nos: [
        { titulo: "Treasury do mesmo prazo", texto: "A base, sem risco de crédito. Já inclui o prêmio pelo prazo." },
        { titulo: "Prêmio de crédito", texto: "Segue a nota de rating do emissor.", sentido: "sobe" },
        { titulo: "Prêmio de liquidez", texto: "Paga a dificuldade de vender rápido.", sentido: "sobe" },
        { titulo: "Prêmio por opções embutidas", texto: "Pré-pagamento, resgate antecipado e outras cláusulas.", sentido: "sobe" },
        { titulo: "Taxa do título", texto: "Dá para decompor e ver quanto paga cada risco." },
      ],
      ligacoes: ["mais", "mais", "mais", "resulta na"],
      fonte: "Síntese da aula",
    },
    {
      tipo: "conceito",
      tempo: "26:35",
      termo: "Opção de pré-pagamento",
      definicao:
        "Nos Estados Unidos, quem financia a casa com hipoteca pode quitar a dívida antes, quando quiser. Se os juros caem, quase todo mundo faz isso e refinancia mais barato. Para quem comprou o título lastreado nessas hipotecas, é o pior momento possível: o dinheiro volta justamente quando as taxas estão baixas. Em linguagem de mercado, o comprador do título vendeu uma opção ao mutuário.",
      naPratica:
        "Imagine um título de hipotecas de 30 anos que paga 5% ao ano. Cinco anos depois, os juros caem para 3%, os mutuários quitam e o seu dinheiro volta. Agora você só consegue reinvestir a 3%. Por isso esses títulos pagam um prêmio sobre a Treasury, que nunca devolve o dinheiro antes do prazo. A lição vale para qualquer título que não seja do Tesouro: leia as cláusulas e entenda quem tem o direito de mudar o jogo.",
      referencia: { autor: "Richard Brealey, Stewart Myers e Franklin Allen", obra: "Princípios de Finanças Corporativas", capitulo: "cap. 24, seção 24.4, cláusulas de reembolso", ano: 2013 },
    },
    {
      tipo: "texto",
      tempo: "29:00",
      paragrafos: [
        "Agora a escada do crédito, que a próxima aula aprofunda. No exemplo da aula, a Treasury de 10 anos paga 4,55%. Um título investment grade, de empresa com boa nota de crédito, paga 0,8 ponto a mais, e a taxa passa de 5%. No high yield de nota BB, o prêmio vai a 1,9 ponto, acima de 6% no total. E nas notas de B a CCC, a 3,4 pontos, perto de 8%.",
        "A régua das agências de rating vai do AAA, a nota máxima, ao BBB-, o último degrau do investment grade; abaixo dele começa o high yield. A maior parte do mercado de grau de investimento fica nas notas A e BBB, e é aí que o prêmio do exemplo se apoia. O gráfico compara os prêmios do exemplo com os do mercado em 5 de outubro de 2026. Os degraus estão quase iguais. O ponto de atenção é o fundo da escada: o exemplo junta B e CCC num degrau só, e o grupo CCC e abaixo, sozinho, pagava 12 pontos acima da Treasury. Um degrau só pode esconder riscos muito diferentes.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Cada degrau abaixo na nota de crédito paga mais sobre a Treasury",
      subtitulo: "Prêmio sobre a Treasury, em pontos percentuais",
      forma: "barra",
      eixoX: ["Investment grade", "High yield BB", "High yield B"],
      series: [
        { nome: "Mercado em 5/out/2026", valores: [0.84, 1.93, 3.14], destaque: true },
        { nome: "Exemplo da aula", valores: [0.8, 1.9, 3.4] },
      ],
      formato: { sufixo: " p.p.", casas: 2 },
      fonte:
        "ICE BofA US Corporate, BB e Single-B Option-Adjusted Spreads (BAMLC0A0CM, BAMLH0A1HYBB e BAMLH0A2HYB), via FRED; slide da aula",
      nota: "Prêmio ajustado pelas opções embutidas, medido contra a curva do Tesouro. No exemplo da aula, o último degrau junta B e CCC; o índice CCC e abaixo marcava 12,11 pontos em 5/out/2026.",
    },
    {
      tipo: "texto",
      tempo: "30:32",
      paragrafos: [
        "Desde 2016, essas taxas fizeram um caminho de ida e volta. A Treasury de 10 anos rodava entre 2% e 3% antes da pandemia. Em 2020, com os cortes de juros, caiu para perto de 1%: a média mensal mais baixa foi de 0,62%, em julho, e no pior dia ficou perto de 0,5%. Quem estava comprado ganhou bastante. Com o surto de inflação da reabertura, a taxa voltou a 4% e, em setembro de 2026, teve média de 4,99%. É a linha de cima do gráfico do capítulo dos instrumentos.",
        "Os títulos corporativos seguiram o mesmo desenho, com uma diferença em 2022. Com inflação alta, Fed subindo juros e medo de recessão, o prêmio do high yield sobre a Treasury abriu bem mais do que nos anos anteriores. Recessão é justamente o cenário em que empresas frágeis deixam de pagar. É o assunto da aula 2.",
      ],
    },

    // ---- 6. Taxa real ----------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "taxa-real",
      titulo: "O que sobra depois da inflação",
      resumo: "Taxa nominal é a do papel. Taxa real é o que sobra, e é ela que diz se você ficou mais rico.",
      tempo: "32:30",
    },
    {
      tipo: "texto",
      paragrafos: [
        "O exemplo da aula desconta de cada taxa uma inflação americana de 3,5% ao ano, perto do que se via em 2026: o CPI subiu 3,4% nos 12 meses até agosto. Sobram 0,45% no T-Bill, 1,05% na Treasury de 10 anos, 1,85% no investment grade, 2,95% no high yield BB e 4,45% no grupo de B a CCC.",
        "É a conta de bolso, por subtração, a hipótese do exemplo. A conta exata divide uma taxa pela outra e dá um pouco menos: 4,55% nominais com 3,5% de inflação são 1,01% reais, em vez de 1,05%. Com inflação nesse nível, a diferença é pequena e não muda a leitura da escada.",
        "Repare como sobra pouco no T-Bill. Não é coisa de 2026. De 1926 a 2012, os T-Bills renderam em média 3,55% ao ano, mas o ganho real médio foi de 0,52%. Seguro, em dólar, não quer dizer rico: o T-Bill protege o caixa, mas não é ele que faz o patrimônio crescer. Por isso ele serve de taxa mínima, como mostra o próximo capítulo, e não de destino final. E o raciocínio vale para os dois lados: se a inflação cair, quem travou as taxas de hoje ganha; se subir, perde.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Descontada a inflação, a escada encolhe, e o T-Bill quase zera",
      subtitulo: "Taxa ao ano, em %, com inflação de 3,5% ao ano",
      forma: "barra",
      eixoX: ["T-Bill", "Treasury 10 anos", "Investment grade", "High yield BB", "High yield B a CCC"],
      series: [
        { nome: "Taxa nominal", valores: [3.95, 4.55, 5.35, 6.45, 7.95] },
        { nome: "Taxa real (nominal menos 3,5%)", valores: [0.45, 1.05, 1.85, 2.95, 4.45], destaque: true },
      ],
      formato: { sufixo: "%", casas: 2 },
      ilustrativo: true,
      fonte: "Slide da aula; taxa nominal do T-Bill deduzida da real",
      nota: "Corte de um momento de 2026, não média histórica. Taxa real pela subtração, como no exemplo da aula.",
    },
    {
      tipo: "texto",
      tempo: "42:17",
      paragrafos: [
        "Para o investidor brasileiro, nada disso é novidade. Juro real aqui é assunto de mesa de jantar. E juro real negativo também não é coisa só de país emergente: com o surto de inflação de 2021 e 2022, as taxas reais americanas ficaram abaixo de zero.",
        "A diferença está no tamanho. O comparativo abaixo põe lado a lado os dois países no começo de outubro de 2026. Juro real maior aqui não é presente: é a remuneração por emprestar ao Brasil, em reais. A pergunta que importa não é qual paga mais, e sim em que moeda está o seu risco.",
      ],
    },
    {
      tipo: "comparativo",
      titulo: "Brasil e Estados Unidos: juros, inflação e déficit",
      subtitulo: "Títulos públicos de cerca de 10 anos e contas públicas mais recentes",
      opcoes: [
        { nome: "Brasil", resumo: "Tesouro Direto, vencimento 2037" },
        { nome: "Estados Unidos", resumo: "Treasury e TIPS de 10 anos", destaque: true },
      ],
      metricas: [
        { rotulo: "Juro prefixado (nominal)", valores: [13.0, 5.31], formato: { sufixo: "% a.a.", casas: 2 } },
        { rotulo: "Juro real (acima da inflação)", valores: [6.86, 2.95], formato: { sufixo: "% a.a.", casas: 2 } },
        { rotulo: "Inflação em 12 meses até agosto", valores: [4.22, 3.4], formato: { sufixo: "%", casas: 2 } },
        { rotulo: "Déficit nominal", valores: [9.35, 6.2], formato: { sufixo: "% do PIB", casas: 1 } },
      ],
      fonte:
        "Tesouro Direto (Prefixado e IPCA+ com Juros Semestrais 2037, 5/out/2026); U.S. Treasury e Federal Reserve H.15 (5/out/2026); IBGE via BCB, SGS 13522; BLS (CPI); BCB, SGS 5727; CRFB",
      nota: "Taxas de 5/out/2026, dia seguinte ao primeiro turno, quando os juros brasileiros caíram mais de 1 ponto. Déficit do Brasil: setor público consolidado, 12 meses até jul/2026. Dos EUA: governo federal, ano fiscal de 2026, estimativa preliminar. Os recortes não são idênticos.",
    },

    // ---- 7. A âncora da carteira -------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "ancora-da-carteira",
      titulo: "A âncora da carteira: taxa mínima e Sharpe",
      resumo: "O T-Bill é a régua que todo investimento em dólar precisa superar. E a renda fixa melhora a relação entre risco e retorno da carteira.",
      tempo: "33:36",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A renda fixa em dólar é a âncora de qualquer carteira internacional, por três razões. A primeira é a taxa mínima, o que o mercado chama de hurdle rate. O T-Bill não tem risco de crédito, porque é o Tesouro americano, e quase não tem risco de prazo. Qualquer outro investimento em dólar, inclusive outros títulos do Tesouro, carrega mais risco e, por isso, precisa prometer mais.",
      ],
    },
    {
      tipo: "destaque",
      texto: "Qualquer outra coisa que chegue na sua carteira com uma taxa menor que a do T-Bill deve ser sumariamente rejeitada.",
      fonte: "Tony Volpon, na aula, 33:36",
    },
    {
      tipo: "texto",
      tempo: "34:33",
      paragrafos: [
        "A segunda razão é a diversificação. Títulos do Tesouro oscilam menos que ações e não andam perfeitamente juntos com elas. Ao misturar os dois, você abre mão de um pouco de retorno, mas a oscilação da carteira cai mais do que proporcionalmente. A régua dessa troca tem nome.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "35:10",
      termo: "Índice de Sharpe",
      definicao:
        "Responde a uma pergunta: para cada unidade de risco que eu corro, quanto ganho a mais do que ganharia no ativo sem risco? Pegue o retorno esperado, tire a taxa do T-Bill e divida o que sobrar pela volatilidade, a medida de quanto o investimento oscila. Quanto maior o número, melhor a troca entre risco e retorno.",
      naPratica:
        "No exemplo da aula, um exercício com números de mercado, o T-Bill paga 3,9% e uma Treasury intermediária, 4,6%, com volatilidade de 6,5% ao ano. O ganho a mais é de 0,7 ponto; dividido por 6,5, dá um Sharpe de 0,11. Na bolsa americana, com retorno esperado de 8,5%, o ganho a mais é de 4,6 pontos e o Sharpe, 0,30. A régua só funciona dentro de uma moeda: Sharpe em dólar usa o T-Bill; em reais, o CDI.",
      referencia: { autor: "Alexandre Assaf Neto", obra: "Mercado Financeiro", capitulo: "cap. 16, seções 16.7 a 16.10", ano: 2014 },
    },
    {
      tipo: "grafico",
      tempo: "39:43",
      titulo: "Misturando as três peças, o Sharpe da carteira supera o de cada uma",
      subtitulo: "Índice de Sharpe esperado, em dólar, com T-Bill de 3,9% como taxa sem risco",
      forma: "barra",
      eixoX: ["Só Treasury intermediária", "Só crédito investment grade", "Só S&P 500", "Carteira 40/20/40"],
      series: [{ nome: "Índice de Sharpe", valores: [0.11, 0.2, 0.3, 0.32], destaque: true }],
      formato: { casas: 2 },
      ilustrativo: true,
      fonte: "Slide da aula, com números de mercado num exercício hipotético",
      nota: "Carteira 40/20/40: 40% em Treasury, 20% em crédito investment grade e 40% em S&P 500. Exercício da aula, não previsão nem recomendação de alocação.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Nas hipóteses do exemplo, a bolsa oscila bem mais que a renda fixa: para um Sharpe de 0,30 com 8,5% de retorno esperado, a volatilidade dela fica perto de 15% ao ano, contra 6,5% da Treasury intermediária. É um caso modelo, não uma previsão. O que importa é o desenho: a carteira 40/20/40 tem Sharpe maior que qualquer peça sozinha e oscila menos que a bolsa. Em outras palavras, dá para dormir mais tranquilo à noite.",
      ],
    },
    {
      tipo: "texto",
      tempo: "36:10",
      paragrafos: [
        "A terceira razão é que, em muitas crises, os títulos sobem quando as ações caem. Na crise, o mercado aposta que o Fed vai cortar juros, as taxas caem e o preço dos títulos, sobretudo os mais longos, sobe. Foi o que aconteceu em 2008. Mas não é lei. Em 2022, a crise era de inflação, o Fed subia juros, e títulos e ações caíram juntos. A proteção existe, mas depende de qual é a crise. Na prática, a Treasury protege melhor contra uma recessão do que contra um surto de inflação.",
      ],
    },
    {
      tipo: "comparativo",
      titulo: "Em 2008, a Treasury amorteceu a queda da bolsa; em 2022, caiu junto",
      subtitulo: "Retorno no ano, em dólar",
      opcoes: [
        { nome: "Treasury de 10 anos", destaque: true },
        { nome: "S&P 500", resumo: "com dividendos" },
      ],
      metricas: [
        { rotulo: "2008: crise financeira, Fed cortando juros", valores: [20.1, -36.55], formato: { base: "pct", sinal: true }, melhor: "maior" },
        { rotulo: "2022: surto de inflação, Fed subindo juros", valores: [-17.83, -18.04], formato: { base: "pct", sinal: true }, melhor: "maior" },
      ],
      fonte: "Aswath Damodaran, NYU Stern, Historical Returns on Stocks, Bonds and Bills",
      nota: "Os mesmos números do notebook da aula 3 do Módulo I. O passado não garante que o padrão de 2008 ou o de 2022 se repita.",
    },

    // ---- 8. Duration ---------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "duration",
      titulo: "Duration: o risco que o Tesouro não tira",
      resumo: "Livre de risco quer dizer livre de calote. O preço de uma Treasury longa oscila, e muito.",
      tempo: "37:35",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Quando se diz que a Treasury é livre de risco, fala-se de risco de crédito: o Tesouro americano vai pagar. Não se fala de risco de preço. Se você precisar vender antes do vencimento, recebe o preço do dia, e esse preço cai quando os juros sobem. Quanto mais longo o título, maior o tombo. A matriz abaixo separa os dois riscos.",
      ],
    },
    {
      tipo: "matriz",
      modo: "quadrante",
      titulo: "Dois riscos diferentes: o de não receber e o de o preço cair",
      eixoLinhas: "Risco de crédito",
      eixoColunas: "Prazo",
      linhas: ["Sem risco de crédito (Tesouro americano)", "Com risco de crédito (empresas)"],
      colunas: ["Curto", "Longo"],
      celulas: [
        [
          {
            texto: "T-Bill",
            marca: "Taxa mínima",
            explicacao: "Nem calote, nem oscilação relevante. É a régua contra a qual todo o resto se mede.",
          },
          {
            texto: "Treasury de 10 a 30 anos",
            explicacao: "Sem calote, mas com risco de preço. Em 2022, o título de 10 anos perdeu quase 18% no ano.",
          },
        ],
        [
          {
            texto: "Crédito corporativo curto",
            explicacao: "Pouca oscilação por juros, mas o emissor pode não pagar. O prêmio paga o risco de crédito.",
          },
          {
            texto: "Crédito corporativo longo",
            marca: "Dois riscos somados",
            explicacao: "O preço oscila com os juros e com a saúde da empresa. É onde o prêmio precisa ser maior.",
          },
        ],
      ],
      fonte: "Síntese da aula",
    },
    {
      tipo: "conceito",
      termo: "Duration",
      definicao:
        "É o prazo médio em que você recebe o dinheiro de volta, contando juros e principal, e serve para medir quanto o preço reage aos juros. Um título com duration de 8 anos perde cerca de 8% do valor se os juros sobem 1 ponto, e ganha um pouco mais do que isso se caem 1 ponto. Num título que paga tudo no fim, a duration é igual ao prazo; com juros no caminho, é menor.",
      naPratica:
        "Um título de 10 anos com cupom de 5% tem duration de cerca de 8 anos. Se os juros de mercado sobem de 5% para 6%, ele perde perto de 7,4%; um de 30 anos perde perto de 14%. Nada disso é calote. É o preço de ter travado uma taxa antes de os juros subirem. Se você leva o título até o vencimento, recebe a taxa combinada; a perda só se realiza se vender antes.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 16, \"Duration\", p. 519 a 524", ano: 2014 },
    },
    {
      tipo: "grafico",
      titulo: "Quanto mais longo o título, maior o tombo quando o juro sobe",
      subtitulo: "Variação no preço, em %, se a taxa de mercado sobe ou cai 1 ponto",
      forma: "barra",
      eixoX: prazosDuration,
      series: [
        { nome: "Se o juro sobe de 5% para 6%", valores: quedaSeSobe, destaque: true, cor: "negativo" },
        { nome: "Se o juro cai de 5% para 4%", valores: altaSeCai, cor: "positivo" },
      ],
      formato: { base: "pct", sinal: true },
      referencia: { valor: 0, rotulo: "Preço de compra" },
      ilustrativo: true,
      fonte: "Conta do autor, pelo valor presente dos fluxos",
      nota: "Títulos hipotéticos com cupom de 5% ao ano, pago a cada seis meses, comprados ao par. A alta quando o juro cai é maior que a queda quando ele sobe; a diferença cresce com o prazo.",
    },
    {
      tipo: "texto",
      tempo: "43:43",
      paragrafos: [
        "Isso não quer dizer fugir do prazo. O prazo paga prêmio, e quem estava comprado em títulos longos quando os juros despencaram em 2020 ganhou bastante. A pergunta, como em tudo, é se o prêmio oferecido naquele momento compensa o risco de preço que você vai carregar.",
        "Para fechar, as ideias centrais. A Treasury é a régua do mundo por causa do dólar, da liquidez, da regulação e da capacidade fiscal americana. Cada título do Tesouro resolve um problema. Todo título em dólar é a Treasury mais um prêmio que dá para decompor. O juro real importa lá como importa aqui. E o T-Bill é a taxa mínima de qualquer decisão em dólar. A próxima aula sobe um degrau na escada: o crédito das empresas americanas, onde o prêmio é maior e o risco também.",
      ],
    },
    {
      tipo: "destaque",
      texto: "Duration não é necessariamente algo a ser evitado, porque duration paga prêmio.",
      fonte: "Tony Volpon, na aula, 43:43",
    },

    // ---- referências ---------------------------------------------------------------------------
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Zvi Bodie, Alex Kane e Alan J. Marcus",
          titulo: "Investments, 10ª edição",
          ano: 2014,
          nota: "TIPS (cap. 2), juro nominal e real e os T-Bills de 1926 a 2012 (cap. 5), o ativo livre de risco depende da moeda e do prazo (cap. 6), estrutura a termo (cap. 15), duration, as propriedades de preço e taxa e imunização (cap. 16).",
        },
        {
          autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen",
          titulo: "Princípios de Finanças Corporativas, 10ª edição",
          ano: 2013,
          nota: "Preço de títulos, duração, estrutura temporal, juro real e TIPS (cap. 3); cláusulas de reembolso e resgate antecipado (cap. 24).",
        },
        {
          autor: "Alexandre Assaf Neto",
          titulo: "Mercado Financeiro, 12ª edição",
          ano: 2014,
          nota: "Títulos públicos e marcação a mercado (cap. 4), curva de juros e risco-país (cap. 7), taxa, preço e duration (cap. 10), índice de Sharpe (cap. 16).",
        },
        {
          autor: "Alexandre Assaf Neto",
          titulo: "Matemática Financeira e suas Aplicações, 12ª edição",
          ano: 2012,
          nota: "Prefixado e pós-fixado (cap. 11), relação entre preço e taxa (cap. 11) e NTN-B (cap. 15).",
        },
        {
          autor: "U.S. Department of the Treasury",
          titulo: "Daily Treasury Par Yield Curve Rates; Debt to the Penny; TreasuryDirect",
          ano: 2026,
          nota: "Curvas de 3/jul/2023, 30/jun/2026 e 5/out/2026; dívida de 5/out/2026; características dos títulos.",
        },
        {
          autor: "Federal Reserve, H.15, via FRED (Federal Reserve Bank of St. Louis)",
          titulo: "Séries GS10, FII10 e DFII10",
          ano: 2026,
          nota: "Treasury e TIPS de 10 anos, médias mensais de jan/2016 a set/2026 e taxa diária de 5/out/2026.",
        },
        {
          autor: "ICE Data Indices, via FRED",
          titulo: "ICE BofA US Corporate, BB, Single-B e CCC & Lower Option-Adjusted Spreads",
          ano: 2026,
          nota: "Prêmios de crédito de 5/out/2026.",
        },
        {
          autor: "Fundo Monetário Internacional",
          titulo: "Currency Composition of Official Foreign Exchange Reserves (COFER), Data Brief",
          ano: 2026,
          nota: "Publicado em 30/set/2026, com dados do 2º tri/2026. A série desde 1999 está no IMF Blog de mai/2021, de Serkan Arslanalp e Chima Simpson-Bell.",
        },
        {
          autor: "Committee for a Responsible Federal Budget",
          titulo: "U.S. Ran a $2 Trillion Deficit Last Year, We Estimate",
          ano: 2026,
          nota: "Estimativa preliminar do ano fiscal de 2026: déficit, dívida nas mãos do público e juros em % do PIB.",
        },
        {
          autor: "Aswath Damodaran (NYU Stern)",
          titulo: "Historical Returns on Stocks, Bonds and Bills: 1928 a 2025",
          ano: 2026,
          nota: "Retornos de 2008 e 2022 do S&P 500 e do Treasury de 10 anos.",
        },
        {
          autor: "Banco Central do Brasil, Tesouro Direto e BLS",
          titulo: "SGS 5727 e 13522; taxas do Tesouro Direto; Consumer Price Index",
          ano: 2026,
          nota: "Déficit nominal e IPCA do Brasil, taxas dos títulos de 2037 em 5/out/2026 e inflação americana até ago/2026.",
        },
      ],
    },
  ],
};

export default secao;

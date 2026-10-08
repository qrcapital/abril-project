import type { SecaoDaAula } from "@/lib/notebook";

// Módulo I, aula 2 ("O real e o risco de uma moeda só", 1h32; até 05/out/2026, a "AULA EXTRA" do
// Módulo 0 de boas-vindas). Seção do notebook escrita a partir da transcrição em
// `transcricoes/modulo-0/aula-2.txt`. Segue a ordem da aula: as oito moedas e a hiperinflação, as
// raízes do Plano Real, a crise de janeiro de 1999, o tripé, a eleição de 2002, o boom de
// commodities, 2008, a recessão de 2015 e 2016, o Joesley Day e a pandemia.
//
// DADOS. Toda série real foi baixada das fontes primárias em 01/out/2026: BCB SGS (433 IPCA,
// 190 IGP-DI, 1 e 3698 dólar, 432 meta Selic, 5793 primário, 13762 dívida bruta, 7326 PIB,
// 29042 IC-Br em US$), IpeaData (JPM366_EMBI366, EMBI+ Brasil), BCB Museu de Valores (padrões
// monetários) e Cysne e Coimbra-Lisboa (2004, tabela 1) para o imposto inflacionário. Voz
// institucional (docs/TOM-DO-NOTEBOOK.md): o texto é parte da aula, sem narrar a fala. Onde a fala e
// a série oficial trazem números diferentes, a diferença é explicada como fonte, recorte ou data
// distintos, nunca como correção. Contas e exemplos levam `ilustrativo`.

const anosIpca = ["1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996"];
// IPCA acumulado no ano, composto a partir das variações mensais da série SGS 433.
const ipcaAnual = [99.3, 95.6, 104.8, 164.0, 215.3, 242.2, 79.7, 363.4, 980.2, 1972.9, 1621.0, 472.7, 1119.1, 2477.2, 916.4, 22.4, 9.6];

const anosCysne = [
  "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991",
  "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003",
];
// Cysne e Coimbra-Lisboa (2004), tabela 1, colunas II/PIB e TI/PIB.
const impostoInflacionario = [2.46, 1.84, 1.97, 2.58, 2.03, 2.11, 1.34, 3.27, 3.45, 4.35, 3.39, 3.08, 2.69, 2.91, 1.0, 0.35, 0.2, 0.19, 0.08, 0.71, 0.31, 0.35, 1.07, 0.29];
const transferenciasBancos = [3.81, 2.64, 2.49, 2.89, 2.23, 2.45, 1.88, 3.42, 3.06, 2.36, 1.89, 2.11, 1.9, 1.99, 0.56, 0.07, 0.07, 0.09, 0.02, 0.18, 0.14, 0.18, 0.53, 0.13];

// PTAX de venda (SGS 1), dias úteis de janeiro de 1999.
const diasJan99 = ["4/jan", "5/jan", "6/jan", "7/jan", "8/jan", "11/jan", "12/jan", "13/jan", "14/jan", "15/jan", "18/jan", "19/jan", "20/jan", "21/jan", "22/jan", "25/jan", "26/jan", "27/jan", "28/jan", "29/jan"];
const dolarJan99 = [1.2078, 1.2085, 1.2096, 1.2101, 1.2104, 1.2109, 1.2114, 1.3193, 1.3194, 1.4659, 1.5384, 1.558, 1.5735, 1.6602, 1.7049, 1.7606, 1.877, 1.8886, 1.9206, 1.9832];

// EMBI+ Brasil, média anual dos pontos diários (IpeaData, JPM366_EMBI366). 2024 vai até julho,
// quando a série foi descontinuada.
const anosEmbi = [
  "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009",
  "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024",
];
const embiMedia = [1118, 690, 445, 800, 1034, 727, 890, 1364, 835, 540, 398, 235, 181, 300, 306, 203, 194, 184, 205, 231, 346, 382, 268, 272, 241, 321, 301, 303, 228, 214];

// IC-Br em dólares (SGS 29042), média anual dos índices mensais.
const anosIcbr = ["1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"];
const icbrUsd = [72.8, 62.7, 67.4, 63.7, 59.4, 69.4, 81.3, 89.7, 102.9, 111.6, 130.5, 103.4, 125.7, 159.8, 140.8, 132.9, 133.2, 112.0, 109.5];

// Resultado primário do setor público consolidado, % do PIB, acumulado em 12 meses até dezembro
// (SGS 5793, NFSP sem desvalorização cambial). O BCB publica a necessidade de financiamento, em que
// superávit sai negativo; aqui o sinal foi invertido para superávit sair positivo.
const anosPrimario = [
  "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013",
  "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025",
];
const primario = [3.19, 3.24, 3.69, 3.74, 3.15, 3.24, 3.33, 1.94, 2.62, 2.94, 2.18, 1.71, -0.56, -1.86, -2.48, -1.68, -1.55, -0.84, -9.24, 0.72, 1.25, -2.28, -0.4, -0.43];

// PIB, variação real anual (IBGE, via SGS 7326).
const anosPib = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
const pib = [7.53, 3.97, 1.92, 3.0, 0.5, -3.55, -3.28, 1.32, 1.78, 1.22, -3.28, 4.76, 3.02, 3.24, 3.42, 2.29];

// Meta Selic no último dia de cada ano (SGS 432); o último ponto é 30/set/2026.
const anosSelic = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "set/2026"];
const selic = [11.75, 14.25, 13.75, 7.0, 6.5, 4.5, 2.0, 9.25, 13.75, 11.75, 12.25, 15.0, 13.75];

// Dívida bruta do governo geral, % do PIB, dezembro (SGS 13762).
const anosDivida = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
const dividaBruta = [56.28, 65.5, 69.84, 73.72, 75.27, 74.44, 86.94, 77.31, 71.68, 73.83, 76.27, 78.64];

// Dólar, média anual das médias mensais de venda (SGS 3698).
const anosDolar = [
  "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010",
  "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025",
];
const dolarMedia = [
  0.918, 1.005, 1.078, 1.161, 1.815, 1.83, 2.35, 2.921, 3.078, 2.926, 2.435, 2.176, 1.948, 1.835, 1.998, 1.76,
  1.675, 1.955, 2.158, 2.354, 3.332, 3.49, 3.192, 3.654, 3.945, 5.156, 5.395, 5.165, 4.995, 5.39, 5.588,
];

// Dólar pela PPC relativa (conferido em 07/out/2026): o dólar médio de 1995 corrigido, ano a ano,
// pela razão entre o IPCA (SGS 433, índice composto das variações mensais, média do ano) e o CPI-U
// americano (BLS, CPIAUCNS via FRED, média do ano). Em 2025 o CPI não tem outubro (o BLS não
// publicou o mês), e a média usa os 11 meses disponíveis.
const dolarPpc = [
  0.918, 1.032, 1.079, 1.096, 1.125, 1.165, 1.21, 1.292, 1.449, 1.504, 1.555, 1.569, 1.582, 1.61, 1.694, 1.751,
  1.81, 1.869, 1.956, 2.047, 2.229, 2.394, 2.425, 2.454, 2.5, 2.549, 2.636, 2.668, 2.68, 2.717, 2.78,
];

const secao: SecaoDaAula = {
  aula: 2,
  blocos: [
    // ---- 1. As oito moedas e a hiperinflação ---------------------------------------------------
    {
      tipo: "capitulo",
      id: "oito-moedas",
      titulo: "Oito moedas em 52 anos",
      resumo: "Antes de 1994, cada moeda nova prometia acabar com a inflação. Nenhuma conseguiu.",
      tempo: "0:19",
    },
    {
      tipo: "texto",
      capitular: true,
      paragrafos: [
        "Pensa na moeda que está na sua carteira. O real tem mais de 30 anos e é, de longe, a moeda mais bem-sucedida que o Brasil teve em um século. Mesmo assim, passou por crises que mudaram em semanas o patrimônio de quem guardava tudo nele. E antes dele foi bem pior: entre 1942 e 1994, o país trocou de moeda oito vezes, quase sempre junto com um plano que congelava preços, achatava salários ou bloqueava aplicações.",
        "A ideia desta aula é simples, e por isso útil. Você não precisa achar que o Brasil vai dar errado para ver que deixar todo o patrimônio numa moeda, num banco central e num sistema político é uma aposta concentrada. A própria história do real tem pelo menos seis momentos em que uma decisão fora do seu controle mexeu, de uma vez, no câmbio, nos juros e na bolsa. Vamos a eles, um por um.",
      ],
    },
    {
      tipo: "linhaDoTempo",
      titulo: "Do cruzeiro ao real, oito padrões monetários",
      subtitulo: "Quando cada moeda entrou em vigor e quanto valia na troca",
      eventos: [
        { data: "nov/1942", titulo: "Cruzeiro (Cr$)", texto: "Substitui o réis: mil réis viram um cruzeiro. Governo Vargas." },
        { data: "fev/1967", titulo: "Cruzeiro novo (NCr$)", texto: "Corta três zeros, no governo Castello Branco." },
        { data: "mai/1970", titulo: "Cruzeiro (Cr$)", texto: "O nome antigo volta, sem corte de zeros." },
        { data: "fev/1986", titulo: "Cruzado (Cz$)", texto: "Mais três zeros a menos e preços congelados no Plano Cruzado." },
        { data: "jan/1989", titulo: "Cruzado novo (NCz$)", texto: "Outro corte de três zeros, no Plano Verão." },
        { data: "mar/1990", titulo: "Cruzeiro (Cr$)", texto: "Volta o cruzeiro, sem corte, no Plano Collor." },
        { data: "ago/1993", titulo: "Cruzeiro real (CR$)", texto: "Mais três zeros a menos, no governo Itamar." },
        { data: "jul/1994", titulo: "Real (R$)", texto: "CR$ 2.750 passam a valer R$ 1." },
      ],
      fonte: "Banco Central do Brasil, Museu de Valores, Síntese dos padrões monetários brasileiros",
      nota: "Contando o réis, que valeu até outubro de 1942, são nove moedas.",
      tempo: "1:10",
    },
    {
      tipo: "numero",
      valor: "2,75 quatrilhões",
      legenda: "de cruzeiros de 1942 equivalem a um único real.",
      nota: "Conta sobre as conversões oficiais do Banco Central: quatro cortes de três zeros e, no fim, CR$ 2.750 por R$ 1.",
    },
    {
      tipo: "linhaDoTempo",
      titulo: "Cada plano derrubou a inflação por alguns meses, e ela voltou mais alta",
      subtitulo: "IPCA no ano, em %, em escala logarítmica (o eixo cresce multiplicando, não somando)",
      eventos: [
        { data: "fev/1986", em: "1986", titulo: "Plano Cruzado", texto: "Moeda nova e preços congelados: a inflação cai a um terço em 1986 e explode em 1987." },
        { data: "jun/1987", em: "1987", titulo: "Plano Bresser", texto: "Mais um congelamento, de 90 dias." },
        { data: "jan/1989", em: "1989", titulo: "Plano Verão", texto: "Cruzado novo e outro congelamento." },
        { data: "mar/1990", em: "1990", titulo: "Plano Collor", texto: "Dinheiro acima de NCz$ 50 mil fica bloqueado no banco." },
        { data: "ago/1993", em: "1993", titulo: "Cruzeiro real", texto: "O pior ano da série: 2.477%." },
        { data: "jul/1994", em: "1994", titulo: "Real", texto: "URV em março, moeda nova em julho. Em 1995, 22%." },
      ],
      serie: { nome: "IPCA no ano", eixoX: anosIpca, valores: ipcaAnual, formato: { sufixo: "%", casas: 0 }, escala: "log" },
      fonte: "IBGE, IPCA, via Banco Central do Brasil (SGS 433)",
      nota: "Inflação de janeiro a dezembro, acumulada mês a mês.",
      tempo: "1:57",
    },
    {
      tipo: "numero",
      valor: "18 meses",
      legenda:
        "foi o tempo que o dinheiro acima de NCz$ 50 mil, na conta corrente ou na poupança, ficou preso no Banco Central no Plano Collor, de março de 1990, antes de começar a voltar em 12 parcelas.",
      nota: "Lei 8.024/1990 (MP 168, de 15/mar/1990). Em aplicações a prazo e fundos, só 20% saía no vencimento. A devolução começou em 16/set/1991, corrigida e com mais 6% ao ano. O valor não sumiu; ficou indisponível por ordem do governo, o que Assaf Neto chama de sequestro da liquidez.",
    },
    {
      tipo: "kpis",
      titulo: "A hiperinflação em quatro números",
      itens: [
        { rotulo: "Pior mês do IPCA", valor: 82.39, formato: { sufixo: "%", casas: 2 }, destaque: true, nota: "mar/1990" },
        { rotulo: "Pico em 12 meses", valor: 6821, formato: { sufixo: "%", casas: 0 }, nota: "abr/1990" },
        { rotulo: "IPCA de 1993", valor: 2477, formato: { sufixo: "%", casas: 0 }, nota: "jan a dez" },
        { rotulo: "IPCA acumulado", valor: 11.3, formato: { sufixo: " trilhões %", casas: 1 }, nota: "jan/1980 a jun/1994" },
      ],
      fonte: "IBGE, IPCA (BCB SGS 433); FGV, IGP-DI (BCB SGS 190)",
      nota: "Acumulados mês a mês. Pelo IGP-DI, da FGV, o mesmo período dá 14,1 trilhões por cento.",
    },
    {
      tipo: "conceito",
      termo: "Taxa de desvalorização da moeda",
      definicao:
        "Imagine que os preços dobraram. A inflação foi de 100%, mas o seu dinheiro não perdeu 100%: perdeu metade, porque agora compra a metade do que comprava. Essa perda de poder de compra é a taxa de desvalorização da moeda. Ela é sempre menor que a inflação e nunca chega a 100%, mas se aproxima disso bem depressa.",
      naPratica:
        "Em março de 1990, o pior mês do IPCA, a inflação de 82% levou 45% do poder de compra de quem tinha dinheiro parado. Em 1993, com 2.477% no ano, a perda foi de 96%: quem segurou a moeda de janeiro a dezembro terminou comprando menos de um vigésimo do que comprava. A mesma lógica vale para o câmbio: se o dólar dobra, o seu patrimônio em reais passa a valer metade em dólar.",
      referencia: { autor: "Alexandre Assaf Neto", obra: "Matemática Financeira e suas Aplicações", capitulo: "cap. 4, seção 4.3", ano: 2012 },
    },
    {
      tipo: "texto",
      paragrafos: [
        "Nos quinze anos antes do real, os preços subiram na casa dos trilhões por cento, e a cifra de 13 trilhões, a mais citada, fica no meio da faixa. O número exato muda com o índice e com o mês em que a conta começa e termina: de janeiro de 1980 a junho de 1994, foram 11 trilhões pelo IPCA, o índice oficial, e 14 trilhões pelo IGP-DI, da FGV. No pior mês, março de 1990, os preços dobravam a cada 35 dias, mais ou menos. Em 1993, último ano inteiro antes do real, dobravam a cada dois meses e meio.",
        "Inflação assim não pesa igual para todo mundo. Quem tinha conta remunerada, dólar ou aplicação de um dia para o outro (o famoso overnight) se defendia. Quem recebia salário e gastava ao longo do mês perdia um pedaço a cada dia. Essa perda tem nome, imposto inflacionário, e foi medida no Brasil pelos economistas Rubens Penha Cysne e Mario Henrique Simonsen. Ela concentrava a destruição de valor justamente em quem tinha menos como se proteger.",
      ],
    },
    {
      tipo: "conceito",
      termo: "Imposto inflacionário",
      definicao:
        "Pensa em R$ 1.000 parados na conta num mês de inflação de 30%. No fim do mês, eles compram o que R$ 770 compravam. Esses R$ 230 de poder de compra não evaporaram: ficaram com quem emite o dinheiro. Uma parte com o Banco Central, dono do papel-moeda; outra com os bancos, que aplicavam o seu depósito a juros que acompanhavam a inflação e não te pagavam nada. Quanto maior a inflação e mais dinheiro parado, maior esse imposto.",
      naPratica:
        "É um imposto que ninguém votou e que pesa mais sobre quem tem menos acesso a aplicações protegidas. Quando ele some, como em 1994, o governo perde uma receita que não precisava passar pelo Congresso, e o rombo que a inflação escondia aparece.",
      referencia: { autor: "Paulo Roberto Arvate e Ciro Biderman (orgs.)", obra: "Economia do Setor Público no Brasil", capitulo: "cap. 24", ano: 2004 },
      tempo: "2:56",
    },
    {
      tipo: "grafico",
      titulo: "Até 1993, a inflação transferia de 3% a 7% do PIB por ano a quem emite moeda",
      subtitulo: "O que a inflação tirou de quem guardava dinheiro, em % do PIB",
      forma: "barraEmpilhada",
      eixoX: anosCysne,
      series: [
        { nome: "Imposto inflacionário (Banco Central)", valores: impostoInflacionario, destaque: true },
        { nome: "Transferências aos bancos comerciais", valores: transferenciasBancos },
      ],
      formato: { sufixo: "% do PIB", casas: 2 },
      marcos: [{ em: "1994", rotulo: "Real" }],
      fonte: "Cysne e Coimbra-Lisboa, Revista de Economia Política, v. 24, n. 4, 2004, tabela 1",
      nota: "Banco Central: a perda sobre o papel-moeda e as reservas dos bancos. Bancos comerciais: a perda sobre os depósitos à vista. O tamanho exato varia com o critério de cálculo, e para 1993 circulam estimativas perto de 6% do PIB; nesta série, as duas partes somam 4,9%, divididas quase meio a meio.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Repare que a conta se divide quase meio a meio entre Banco Central e bancos. Com inflação alta, um banco ganhava só por guardar o seu depósito, que não rendia nada, e aplicar esse dinheiro a taxas que acompanhavam os preços. Quando o real derrubou a inflação, esse ganho caiu de quase 2% do PIB em 1993 para menos de 0,1% em 1995, e parte do sistema que vivia disso quebrou. O Banco Central interveio no Econômico em 1995, criou no fim daquele ano o Proer, um programa de socorro aos bancos, e ainda teve de lidar com o Nacional e o Bamerindus.",
        "O governo perdeu a sua metade no exato momento em que a Constituição de 1988 ampliava previdência rural, assistência social e saúde pública. Ou seja: trocar a moeda e parar por aí teria aberto um buraco nas contas. E buraco nas contas, cedo ou tarde, volta como inflação.",
      ],
    },

    // ---- 2. Raízes do Real ------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "raizes-do-real",
      titulo: "Um plano que começou antes da moeda",
      resumo: "Do choque do petróleo à URV: o real fecha quinze anos de dívida em dólar e planos fracassados.",
      tempo: "4:02",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A história começa a piorar em 1979. A Revolução Iraniana dispara o preço do petróleo, a inflação americana encosta em 15% ao ano e o Fed, o banco central dos Estados Unidos, comandado por Paul Volcker, leva os juros para perto de 20%. A América Latina tinha crescido nos anos 1960 e 1970 com dívida em dólar a juros que flutuavam. Quando os juros americanos explodiram, a conta veio junto: o México parou de pagar em 1982, o Brasil declarou moratória em 1987 e a região entrou na década perdida.",
        "Para renegociar com os credores, cada país precisava de um plano que convencesse o FMI e o Tesouro americano. A Argentina conseguiu esse apoio para o Plano Cavallo; o Brasil, não. Por isso faz sentido marcar o início do Plano Real em 1992, uma data algo arbitrária, quando o país passou a montar sozinho a renegociação da dívida externa. O acordo com os bancos saiu em abril de 1994, sem o FMI, e o Brasil comprou por conta própria os títulos americanos dados em garantia: fez com recursos próprios o que, nos vizinhos, contou com o apoio do Tesouro americano.",
      ],
    },
    {
      tipo: "fluxo",
      titulo: "Como o choque de 1979 virou a década perdida",
      nos: [
        { titulo: "Petróleo", texto: "Segundo choque, com a Revolução Iraniana.", sentido: "sobe" },
        { titulo: "Inflação americana", texto: "Perto de 15% ao ano em 1980.", sentido: "sobe" },
        { titulo: "Juros do Fed", texto: "Volcker sobe os juros para conter a inflação.", sentido: "sobe" },
        { titulo: "Dívida latino-americana", texto: "Tomada em dólar, a juro flutuante.", sentido: "sobe" },
        { titulo: "Moratórias", texto: "México em 1982, Brasil em 1987." },
        { titulo: "Crescimento", texto: "A década perdida na região.", sentido: "desce" },
      ],
      ligacoes: ["acelera", "provoca", "encarece", "leva a", "derrubam"],
      fonte: "Síntese da aula",
    },
    {
      tipo: "texto",
      paragrafos: [
        "O que separa o real dos planos anteriores é o que veio antes e depois da troca de moeda. Cruzado, Bresser, Verão e Collor mudaram o nome do dinheiro ou congelaram preços, mas ninguém passou a confiar mais em quem emitia a moeda. O real teve um ensaio: a URV, Unidade Real de Valor, em vigor a partir de 1º de março de 1994.",
        "Funcionou assim. Por quatro meses, preços, salários e contratos passaram a ser escritos numa unidade estável, a URV, enquanto você continuava pagando em cruzeiros reais, que perdiam valor todo dia. Em 1º de julho, a régua virou dinheiro: cada URV passou a valer um real, e CR$ 2.750 viraram R$ 1. Não por acaso, era também a cotação do dólar em cruzeiros reais no último dia útil de junho.",
        "Repare no que isso significa. Para dar credibilidade à moeda nova, o próprio governo a prendeu ao dólar, e ela ficou assim até 1999. O Estado brasileiro dolarizou o real por quatro anos e meio, a mesma ideia de buscar uma moeda mais estável que está por trás deste curso.",
      ],
      tempo: "9:02",
    },
    {
      tipo: "tabela",
      titulo: "Como a URV separou as funções da moeda",
      colunas: ["Função", "Até fev/1994", "Mar a jun/1994", "A partir de jul/1994"],
      linhas: [
        ["Unidade de conta", "Cruzeiro real, corroído dia a dia", "URV", "Real"],
        ["Meio de troca", "Cruzeiro real", "Cruzeiro real", "Real"],
        ["Reserva de valor", "Correção monetária e dólar", "URV, quase um para um com o dólar", "Real, preso ao dólar até 1999"],
      ],
      fonte: "Banco Central do Brasil (MP 434/1994 e Lei 8.880/1994); síntese da aula",
      nota: "Unidade de conta é a régua dos preços; meio de troca, o que você usa para pagar; reserva de valor, onde você guarda poder de compra.",
    },
    {
      tipo: "conceito",
      termo: "Inconsistência temporal e âncora nominal",
      definicao:
        "Por que prender a moeda à de outro país ajuda? Imagine um governo que promete inflação baixa. Depois que salários e contratos já foram fechados contando com a promessa, surge a tentação de soltar um pouco mais de inflação para aquecer a economia. Só que todo mundo sabe disso e já negocia contando com a traição. Resultado: a inflação fica mais alta do que o governo queria, sem nenhum crescimento a mais. Os economistas Robert Barro e David Gordon mostraram que esse viés só some quando o banco central consegue se amarrar à promessa.",
      naPratica:
        "Prender a moeda ao dólar é um jeito de pegar emprestada a reputação de outro banco central. Foi o que o real fez de 1994 a 1999. Mas a amarra só vale enquanto mantê-la custa menos do que soltá-la. Quando o preço em reservas e juros fica alto demais, o mercado testa a promessa, e foi exatamente o que aconteceu em janeiro de 1999.",
      referencia: { autor: "Robert Gibbons", obra: "Game Theory for Applied Economists", capitulo: "cap. 2.3.E", ano: 1992 },
      tempo: "12:06",
    },
    {
      tipo: "tabela",
      titulo: "Duas âncoras no dólar, dois finais",
      colunas: ["", "Brasil", "Argentina"],
      linhas: [
        ["Regime", "Câmbio controlado pelo Banco Central, numa faixa a partir de 1995", "Um peso por um dólar, por lei"],
        ["Início", "Julho de 1994", "Abril de 1991"],
        ["Fim", "Janeiro de 1999", "Janeiro de 2002"],
        ["Como saiu", "Desvalorização e câmbio flutuante, sem calote", "Calote externo, saques bloqueados e dólares convertidos à força em pesos"],
        ["O que veio depois", "Meta de inflação, superávit nas contas e Lei de Responsabilidade Fiscal", "Cinco presidentes em cerca de duas semanas"],
      ],
      fonte: "Banco Central do Brasil; Argentina, Lei 23.928/1991 e Lei 25.561/2002",
      nota: "A duração da paridade argentina muda conforme o marco de início e de fim escolhido (a lei de 1991, a troca do austral pelo peso, a crise de dezembro de 2001 ou o fim formal, em janeiro de 2002). Em qualquer conta, durou bem mais que a âncora brasileira, de quatro anos e meio.",
      tempo: "13:06",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A âncora brasileira durou menos que a argentina, e boa parte da diferença vem do entusiasmo do FMI pelo plano de Cavallo, um apoio que o Brasil nunca teve. Para quem investe, importa mais a saída: o Brasil largou o câmbio fixo trocando de regime; a Argentina, dando calote. Antes disso, porém, o real teve de resolver o problema que o próprio sucesso criou.",
        "Sem o imposto inflacionário, o governo precisava pagar com impostos, ou com dívida, os gastos que a Constituição tinha ampliado. As respostas foram muitas e pouco vistosas: a renegociação das dívidas dos estados em 1997, que acabou com o hábito dos governadores de bancar despesas com bancos estaduais como Banespa e Banerj; as privatizações, iniciadas com Collor e aceleradas com Fernando Henrique; e juros altos para segurar dólares no país e sustentar o câmbio. Por que tanto esforço? Porque existe uma conta por trás.",
      ],
      tempo: "14:55",
    },
    {
      tipo: "conceito",
      termo: "Aritmética monetarista desagradável",
      definicao:
        "Pensa numa dívida que já está no limite do que o mercado aceita financiar. Os próximos rombos não têm mais quem pague com empréstimo, e alguém vai ter de imprimir dinheiro. A partir daí, subir os juros hoje pode piorar a inflação de amanhã, porque engorda a dívida que um dia vai ser paga com emissão. Os economistas Thomas Sargent e Neil Wallace batizaram isso de aritmética monetarista desagradável; no mercado, o nome hoje é dominância fiscal.",
      naPratica:
        "A dívida cresce com os juros, encolhe em relação à economia quando o PIB cresce e cai quando o governo economiza antes de pagar juros. Com dívida de 100% do PIB, juro real de 6% e crescimento de 2%, sem economia nenhuma ela vira quase 104% no ano seguinte. Por isso o real precisou de superávit, renegociação dos estados e privatizações, e não só de moeda nova. Para você, é o cenário em que juro alto deixa de segurar o câmbio, e a dúvida sobre as contas do governo aparece no dólar e nos juros longos antes de aparecer na inflação.",
      referencia: { autor: "Paulo Roberto Arvate e Ciro Biderman (orgs.)", obra: "Economia do Setor Público no Brasil", capitulo: "cap. 24, sobre Sargent e Wallace", ano: 2004 },
      tempo: "16:53",
    },
    {
      tipo: "matriz",
      modo: "quadrante",
      titulo: "Quatro portas para fechar uma conta fiscal, e quem paga em cada uma",
      subtitulo: "Toda conta pública que não fecha acaba em uma delas, ou numa mistura",
      eixoLinhas: "Por onde passa o ajuste",
      eixoColunas: "O que o governo faz",
      linhas: ["Pelo orçamento", "Fora do orçamento"],
      colunas: ["Arrecada mais", "Paga menos"],
      celulas: [
        [
          {
            texto: "Mais impostos. Paga o contribuinte.",
            explicacao: "O ajuste votado. Depois de 1999, boa parte do superávit veio de arrecadação, como a CPMF, que subiu de 0,20% para 0,38% naquele ano.",
          },
          {
            texto: "Menos gastos. Paga quem depende do gasto.",
            explicacao: "Também passa pelo Congresso. Em 2015 o corte caiu sobre investimento e regras de benefícios; em 2016 o teto de gastos limitou a despesa federal à inflação.",
          },
        ],
        [
          {
            texto: "Monetização. Paga quem guarda moeda.",
            marca: "A porta brasileira até 1994",
            explicacao: "O Banco Central imprime dinheiro para cobrir o rombo, e a inflação cobra a conta de quem tem dinheiro parado. Não precisa de votação, e por isso foi tão usada.",
          },
          {
            texto: "Repúdio. Paga o credor.",
            explicacao: "Calote ou renegociação forçada: a moratória externa de 1987, o bloqueio do Plano Collor em 1990, que na prática alongou a dívida interna à força, e a moratória de Minas Gerais com a União em 1999.",
          },
        ],
      ],
      fonte: "Síntese da aula sobre F. Rocha, em Arvate e Biderman (orgs.), Economia do Setor Público no Brasil, 2004, cap. 24",
      nota: "As duas de cima passam pelo orçamento; as de baixo jogam a conta em quem tem dinheiro e títulos do país. Em três das quatro, quem concentra o patrimônio em ativos brasileiros perde alguma coisa.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "No Brasil, a porta usada foi a de baixo, à esquerda. Os estudos das contas públicas de 1947 ao começo dos anos 1990 chegam sempre ao mesmo lugar: receitas e gastos só fechavam quando se contava o dinheiro que o governo ganhava imprimindo moeda. Por quase meio século, o orçamento fechou com a ajuda de quem guardava dinheiro. E, a partir de 1981, o governo não aumentava o superávit quando a dívida crescia.",
        "É esse histórico que está por trás da pergunta central do Plano Real: como convencer o mercado de que o governo não vai voltar a imprimir dinheiro para pagar as contas? O tripé de 1999 foi a primeira tentativa duradoura de trocar essa porta pelas duas de cima. E a credibilidade não vem da promessa, vem do que o governo faz quando a dívida sobe. Quando o superávit fraqueja, como você vai ver a partir de 2014, o mercado volta a cobrar um prêmio de quem um dia pode reabrir a porta da inflação.",
      ],
    },

    // ---- 3. Janeiro de 1999 -------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "janeiro-de-1999",
      titulo: "Quando uma decisão política vira câmbio",
      resumo: "A moratória de Minas Gerais e o fim do câmbio controlado, em janeiro de 1999.",
      tempo: "21:18",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Em 1998, a crise da Rússia veio somar-se à do México, de 1994 e 1995, e o mercado passou a desconfiar de toda moeda emergente presa ao dólar. Dentro do governo havia duas linhas: amarrar ainda mais o real ao dólar, como defendia Gustavo Franco, presidente do Banco Central, ou deixá-lo perder valor aos poucos. O cenário com que o Banco Central trabalhava era o da desvalorização gradual, de cerca de 30% ao longo de 1999.",
        "O plano não passou da primeira quinzena. Em 6 de janeiro, Itamar Franco, recém-empossado governador de Minas Gerais, anunciou uma moratória de 90 dias da dívida do estado com a União. A desconfiança se espalhou, Gustavo Franco deixou o Banco Central no dia 13 e, dois dias depois, o câmbio passou a flutuar. A desvalorização prevista para o ano inteiro aconteceu ainda em janeiro, e foi além: o dólar saiu de R$ 1,21 em 12 de janeiro para R$ 1,98 no dia 29 e chegou a R$ 2,16 no começo de março.",
        "O ponto não é julgar o governador, cuja queixa contra a correção da dívida tinha a sua parte de razão. É ver como uma briga entre dois pedaços do mesmo Estado redesenhou, em semanas, o patrimônio de quem tinha tudo em títulos públicos em reais.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Em 13 pregões, o dólar foi de R$ 1,21 para R$ 1,98",
      subtitulo: "R$ por US$, cotação oficial diária do Banco Central (PTAX), janeiro de 1999",
      forma: "linha",
      eixoX: diasJan99,
      series: [{ nome: "Dólar", valores: dolarJan99, destaque: true }],
      formato: "brl",
      marcos: [
        { em: "6/jan", rotulo: "Moratória de Minas" },
        { em: "13/jan", rotulo: "Franco sai, banda alargada" },
        { em: "15/jan", rotulo: "Câmbio flutua" },
      ],
      fonte: "Banco Central do Brasil, SGS 1 (dólar, venda, diário)",
      nota: "O tamanho do salto depende da régua. Pela cotação diária, de 12 a 29 de janeiro o dólar subiu 64%, e o real perdeu 39% do valor em dólar; pela média mensal, em fevereiro o dólar já estava 59% acima de dezembro. Em qualquer medida, o real perdeu em semanas mais que os 30% previstos para o ano.",
      tempo: "24:50",
    },
    {
      tipo: "conceito",
      termo: "Compromisso não crível e risco de regra",
      definicao:
        "O episódio de Minas é um caso de um problema geral: quem manda hoje não tem como se obrigar a não mudar a regra amanhã. Depois que o seu dinheiro já está aplicado num país, quem faz as regras pode tributá-lo, bloqueá-lo ou desvalorizá-lo, e você não consegue desfazer o investimento a tempo. Sabendo disso, o investidor cobra mais para entrar ou investe menos. O economista Daron Acemoglu põe esse problema no centro da explicação de por que as instituições importam.",
      naPratica:
        "Trocar uma ação brasileira por outra, ou um título público por outro, diversifica empresas e prazos, não a regra do jogo. Uma moratória estadual, um imposto novo ou um bloqueio de aplicações atinge de uma vez tudo o que está sob a mesma caneta. Só outra jurisdição dilui esse risco.",
      referencia: { autor: "Daron Acemoglu", obra: "Political Economy Lecture Notes", capitulo: "caps. 1 e 11 (holdup, seção 11.2.9)" },
    },
    {
      tipo: "texto",
      paragrafos: [
        "Isso não é exclusividade brasileira, nem defeito dos políticos daqui. Um americano com toda a aposentadoria em títulos do Tesouro também perde quando uma política de tarifas pressiona a inflação e os juros longos. O britânico viu a libra despencar depois do Brexit, em 2016. O que muda de um país para outro é a frequência e a força desses episódios.",
        "E 1999 não ficou no passado. A União renegociou as dívidas dos estados outras vezes desde então, e estados que gastam boa parte do orçamento com juros, como Rio de Janeiro e Rio Grande do Sul, investem menos e prestam serviços piores. Isso também tem nome.",
      ],
      tempo: "26:37",
    },
    {
      tipo: "conceito",
      termo: "Restrição orçamentária fraca",
      definicao:
        "Se um estado sabe que, no aperto, a União vai socorrê-lo, gastar além da conta vira um bom negócio: o benefício fica com o governador, e a conta é dividida com o país inteiro. No Brasil, a União renegociou dívidas de estados e municípios em 1989, 1991, 1993 e 1997, e a Lei de Responsabilidade Fiscal veio em 2000 como resposta.",
      naPratica:
        "O risco que importa para você é o das contas públicas como um todo, porque o socorro de hoje vira dívida federal amanhã. Por isso uma briga entre um governador e a União, como a de 1999, mexe no câmbio do país inteiro.",
      referencia: { autor: "Paulo Roberto Arvate e Ciro Biderman (orgs.)", obra: "Economia do Setor Público no Brasil", capitulo: "cap. 22 (federalismo fiscal, M. Mendes)", ano: 2004 },
      tempo: "28:17",
    },

    // ---- 4. O tripé --------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "o-tripe",
      titulo: "A resposta de 1999: o tripé",
      resumo: "Meta de inflação, superávit nas contas e câmbio flutuante, amarrados depois pela Lei de Responsabilidade Fiscal.",
      tempo: "31:42",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A reação começou pela troca no comando do Banco Central. Arminio Fraga, que vinha da gestora de George Soros e conhecia por dentro os ataques especulativos contra moedas, assumiu em março de 1999 e montou em poucos meses o regime que o país usa até hoje, com ajustes. Ele tem três pés.",
        "O primeiro é a meta de inflação, criada em junho de 1999 com inspiração na Nova Zelândia: o Banco Central anuncia um alvo e calibra os juros para chegar lá. O alvo e a tolerância mudaram ao longo dos anos; desde 2025, o alvo é de 3%, com tolerância de 1,5 ponto para cima ou para baixo, e é cobrado continuamente, não só em dezembro. Se a inflação passa do teto, é sinal de que os juros não estão cumprindo o papel. O segundo é a meta de superávit primário, a economia que o governo faz antes de pagar juros, para mostrar que a dívida não vai crescer sem controle. O terceiro é o câmbio flutuante, ou, como se diz no mercado, flutuante e sujo: o Banco Central não fixa o preço do dólar, mas entra no mercado quando acha o movimento exagerado.",
        "Em maio de 2000, a Lei de Responsabilidade Fiscal fechou o desenho. Entre outras regras, ela proíbe o governo de se financiar nos bancos que controla (artigos 35 e 36). Foi o desrespeito a essa lógica, com Caixa, Banco do Brasil e BNDES cobrindo despesas da União, que embasou o impeachment de 2016.",
        "Dos três pés, a meta de inflação é o que mais depende de confiança: só funciona se o mercado acreditar que o Banco Central vai cumpri-la mesmo quando cumprir custa caro. Essa confiança se constrói como num jogo que se repete, e é o mesmo problema que fez o real nascer preso ao dólar. A matriz abaixo resume o jogo.",
      ],
    },
    {
      tipo: "matriz",
      modo: "payoff",
      titulo: "Meta de inflação: um jogo de credibilidade",
      subtitulo: "Notas de 0 (pior) a 4 (melhor); o primeiro número é do Banco Central, o segundo, do mercado",
      eixoLinhas: "Banco Central",
      eixoColunas: "Mercado",
      linhas: ["Cumpre a meta", "Cede à pressão"],
      colunas: ["Acredita", "Duvida"],
      celulas: [
        [
          { valores: [3, 3], marca: "Sustentável com reputação", explicacao: "Inflação na meta com juros menores: a confiança poupa o custo de provar, e os dois ganham." },
          { valores: [0, 2], explicacao: "O Banco Central segura a inflação com juro alto enquanto o mercado ainda desconfia. É o preço de construir reputação." },
        ],
        [
          { valores: [4, 0], explicacao: "A surpresa: o Banco Central solta inflação e ganha no curto prazo; quem acreditou perde. É a tentação de quebrar a promessa." },
          { valores: [1, 1], marca: "Equilíbrio de uma rodada", explicacao: "Inflação alta sem crescimento a mais. Se o jogo acontecesse uma vez só, terminaria aqui." },
        ],
      ],
      ilustrativo: true,
      nota: "Matriz didática da lógica de Barro e Gordon. Numa rodada única, ceder compensa para o Banco Central. Como o jogo se repete e o mercado pune quem quebra a promessa, cumprir a meta se sustenta, desde que o Banco Central dê peso suficiente ao futuro. O detalhe curioso: um banco central muito avesso à inflação tem mais dificuldade de sustentar a reputação, porque a punição, voltar à inflação da rodada única, pesa menos para ele.",
      tempo: "33:28",
    },

    // ---- 5. 2002 -------------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "eleicao-de-2002",
      titulo: "2002: o preço da incerteza",
      resumo: "Dólar perto de R$ 4 e risco-país acima de 2.400 pontos antes de o novo governo tomar qualquer decisão.",
      tempo: "41:25",
    },
    {
      tipo: "kpis",
      titulo: "A crise de 2002 em quatro números",
      itens: [
        { rotulo: "Dólar, máxima do ano", valor: 3.9552, formato: { base: "brl", casas: 2 }, destaque: true, nota: "PTAX, 22/out/2002" },
        { rotulo: "Risco-país, pico", valor: 2443, formato: { sufixo: " pontos", casas: 0 }, nota: "EMBI+ Brasil, 27/set/2002" },
        { rotulo: "Meta Selic", valor: 25, formato: { sufixo: "% a.a.", casas: 2 }, nota: "dez/2002" },
        { rotulo: "IPCA do ano", valor: 12.53, formato: { sufixo: "%", casas: 1 }, nota: "2002" },
      ],
      fonte: "Banco Central do Brasil (SGS 1, 432 e 433); JP Morgan, EMBI+, via IpeaData",
      tempo: "43:18",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A Lei de Responsabilidade Fiscal não acaba com o risco político, e a eleição de 2002 provou isso. O favorito, Lula, disputava pela quarta vez depois de ter sido contra o Plano Real, as privatizações, a reforma da previdência de Fernando Henrique, a LRF e o tripé. O mercado cobrou pela hipótese de ruptura antes de qualquer ato do candidato: entre abril e outubro, o dólar subiu mais de 60%, e da mínima de abril, R$ 2,27, à máxima de outubro, R$ 3,96, foram 74%.",
        "O risco-país passou de 2.400 pontos. Com o título americano pagando perto de 3% ao ano, isso queria dizer que o Brasil teria de pagar cerca de 27% para tomar dinheiro lá fora, um custo que dobra uma dívida em menos de três anos. Na prática, captar no exterior ficou inviável.",
        "Em junho, a Carta ao Povo Brasileiro comprometeu o candidato com o superávit e o respeito aos contratos. Em agosto, o Brasil fechou com o FMI um acordo de cerca de US$ 30 bilhões, um apoio para atravessar a transição, não o socorro a um país quebrado. O governo eleito cumpriu a carta, subiu a meta de superávit e, em dezembro de 2005, pagou adiantado os US$ 15,5 bilhões que ainda devia ao Fundo, um gesto para mostrar que o país não dependia mais dele.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "O risco-país de 2002 foi o mais alto desde o Plano Real",
      subtitulo: "EMBI+ Brasil: quanto o Brasil pagava a mais que o Tesouro americano, em pontos (100 pontos = 1% ao ano), média anual",
      forma: "barra",
      eixoX: anosEmbi,
      series: [{ nome: "EMBI+ Brasil", valores: embiMedia, destaque: true }],
      formato: { sufixo: " pontos", casas: 0 },
      marcos: [{ em: "2002", rotulo: "Pico diário: 2.443" }],
      fonte: "JP Morgan, EMBI+ Brasil, via IpeaData (JPM366_EMBI366)",
      nota: "Média dos valores diários de cada ano. A série acabou em julho de 2024; o último ponto vai de janeiro a julho.",
      tempo: "44:20",
    },
    {
      tipo: "grafico",
      titulo: "A 27% ao ano, uma dívida dobra em menos de três anos",
      subtitulo: "Quantos anos uma dívida leva para dobrar só com juros, conforme o custo anual",
      forma: "barra",
      eixoX: ["3%", "7%", "12%", "27%"],
      series: [{ nome: "Anos para dobrar", valores: [23.4, 10.2, 6.1, 2.9] }],
      formato: { sufixo: " anos", casas: 1 },
      ilustrativo: true,
      nota: "Juros sobre juros, a taxa constante. Os 27% somam 3% do título americano a 24 pontos percentuais de risco-país, perto do pico de 2002; os 7% são uma estimativa do custo atual, com o juro americano perto de 3,25% e risco-país entre 300 e 400 pontos.",
    },
    {
      tipo: "conceito",
      termo: "Prêmio de risco e cumprimento de contratos",
      definicao:
        "Se existe chance de um contrato ser reescrito no meio do caminho, quem empresta cobra por isso. Quanto menor a confiança de que o combinado vai ser cumprido, maior o prêmio. O economista Jean-Jacques Laffont trata essa confiança como uma probabilidade, que sobe quando as instituições funcionam e cai com a corrupção; o que falta para a certeza vira renegociação, com perda para quem investiu.",
      naPratica:
        "Visto assim, o risco-país é o preço, cotado todo dia, da chance de o combinado não ser cumprido. Em 2002, o mercado cobrava 24 pontos percentuais acima dos títulos americanos porque via chance alta de a dívida ser renegociada. Quando a política fiscal confirmou a carta, o prêmio caiu sem que a dívida tivesse mudado de tamanho.",
      referencia: { autor: "Jean-Jacques Laffont", obra: "Regulation and Development", capitulo: "cap. 4", ano: 2005 },
      tempo: "45:15",
    },

    // ---- 6. Boom de commodities ----------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "boom-de-commodities",
      titulo: "O vento a favor e a conta que ficou",
      resumo: "A China entra no comércio mundial, as commodities disparam e o Brasil escolhe entre poupar a bonança ou gastá-la.",
      tempo: "47:14",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Em dezembro de 2001, a China entrou na Organização Mundial do Comércio e passou a década seguinte levando centenas de milhões de pessoas do campo para as cidades. Isso virou demanda por minério de ferro, soja, carne e petróleo, justamente o que o Brasil vende. Pelo índice agregado de commodities do JP Morgan, a alta entre 2001 e 2007 chegou perto de 700%: a mesma cesta passou a render muito mais dólares. O índice do Banco Central mede outra cesta, com o peso que cada produto tem nas vendas brasileiras, e por isso mostra um salto menor, mas decisivo: em dólar, quase triplicou entre 2002 e 2011.",
        "O Brasil já tinha visto esse filme. Campos Salles arrumou as contas e renegociou a dívida externa entre 1898 e 1902 e entregou o governo a Rodrigues Alves em pleno ciclo da borracha. O risco desses ciclos é a bonança virar licença para gastar. No primeiro governo Lula isso não aconteceu: o superávit ficou acima de 3% do PIB todos os anos e a dívida caiu. A Selic recuou de 25% no fim de 2002 para 10,75% no fim de 2010, e o dólar, que chegara perto de R$ 4, terminou 2010 a R$ 1,67 e tocou R$ 1,53 em julho de 2011.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Em dólar, as commodities do Brasil subiram 2,7 vezes entre 2002 e 2011",
      subtitulo: "Índice de Commodities do Banco Central (IC-Br), em dólar, média anual",
      forma: "linha",
      eixoX: anosIcbr,
      series: [{ nome: "IC-Br em US$", valores: icbrUsd, destaque: true }],
      formato: { casas: 0 },
      marcos: [
        { em: "2001", rotulo: "China na OMC" },
        { em: "2008", rotulo: "Crise global" },
      ],
      fonte: "Banco Central do Brasil, SGS 29042 (IC-Br em US$)",
      nota: "Média dos índices mensais. O índice de commodities do JP Morgan usa outra cesta e outros pesos, e por isso mostra uma alta bem maior no mesmo período.",
      tempo: "49:14",
    },
    {
      tipo: "numero",
      valor: "−70%",
      legenda:
        "foi a perda de poder de compra, em reais, de quem comprou dólar no fim de 2002 e o deixou parado até o fim de 2010: o dólar caiu 53% e os preços no Brasil subiram 57%.",
      nota: "PTAX de 31/dez/2002 (R$ 3,5333) e de 31/dez/2010 (R$ 1,6662), BCB SGS 1; IPCA de 2003 a 2010, BCB SGS 433. A conta: o dólar passou a valer 47% do que valia, e cada real passou a comprar 64% do que comprava; 47% de 64% dá 30%. Sem rendimento sobre o dólar. Outra janela daria outro número, e o ponto é esse: dólar parado protege contra a moeda, não contra a inflação. Por isso dolarizar, no sentido deste curso, é ter ativos que rendem lá fora, e não nota de dólar guardada.",
    },
    {
      tipo: "grafico",
      titulo: "O superávit ficou acima de 3% do PIB por sete anos e virou déficit em 2014",
      subtitulo: "Resultado primário do setor público (o que sobra antes de pagar juros), % do PIB, no ano",
      forma: "barra",
      eixoX: anosPrimario,
      series: [{ nome: "Resultado primário", valores: primario, destaque: true }],
      formato: { sufixo: "% do PIB", casas: 2 },
      referencia: { valor: 0, rotulo: "Equilíbrio" },
      faixas: [{ de: "2002", ate: "2008", rotulo: "Acima de 3% do PIB" }],
      fonte: "Banco Central do Brasil, SGS 5793 (NFSP sem desvalorização cambial, primário)",
      nota: "O Banco Central publica com o sinal ao contrário; aqui, positivo é superávit. O pico foi em 2005, o maior da série. O tamanho exato muda com o recorte (só o governo central ou todo o setor público) e com a revisão do PIB usada na conta; aqui, para o setor público consolidado, são 3,74% do PIB.",
      tempo: "51:10",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A Argentina recebeu o mesmo vento a favor por outro caminho. A saída do peso igual ao dólar veio com o corralito, que limitou saques a partir de dezembro de 2001, com a conversão forçada de depósitos em dólar para pesos e com o maior calote de dívida externa até então. A alta da soja, da carne e do trigo trouxe dólares suficientes para adiar a crise seguinte e tirou do país o incentivo de fazer as reformas que o Brasil foi obrigado a fazer em 1999, sem bonança nenhuma.",
        "Há também uma lição de aritmética. Se o gasto público cresce 6% ao ano e a economia cresce perto de 8% em reais correntes (inflação de 4,5% mais crescimento de 3,5%), o gasto perde peso. Com inflação de 4% e crescimento de 2%, o mesmo gasto deixa de caber. Com a dívida é igual: o que decide se ela sobe ou cai é a corrida entre o juro real e o crescimento, descontada a economia que o governo faz. Teste no simulador abaixo.",
      ],
      tempo: "52:52",
    },
    {
      tipo: "simulador",
      id: "aritmetica-da-divida",
      titulo: "A aritmética da dívida",
      descricao:
        "Ponto de partida: dívida bruta perto de 79% do PIB, como em dezembro de 2025, pelo Banco Central. Mexa no juro real, no crescimento e no resultado primário e veja quando a dívida para de crescer. O painel também mostra o superávit que deixa a dívida parada: com juro real de 6% e crescimento de 2%, ele fica perto de 3,1% do PIB. Em 2025, o governo teve déficit de 0,4% do PIB.",
      modelo: "dividaPib",
      parametros: { divida: { valor: 79 }, anos: { valor: 15 } },
    },

    // ---- 7. 2008 e o dinheiro barato -----------------------------------------------------------
    {
      tipo: "capitulo",
      id: "dinheiro-barato",
      titulo: "2008 e a década do dinheiro barato",
      resumo: "A crise americana, a resposta do Fed e uma década de dinheiro quase de graça no mundo rico.",
      tempo: "56:28",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A crise de 2008 nasceu onde menos se esperava: no mercado de imóveis dos Estados Unidos, cujos preços quase só tinham subido por décadas. Famílias tomavam crédito dando a casa como garantia, contando com a valorização, e bancos emprestavam a quem não tinha renda para pagar. Quando os preços caíram, as garantias passaram a valer menos que as dívidas. O credor pedia mais garantia ou tomava a casa, e cada venda forçada derrubava os preços ainda mais.",
        "A quebra do Lehman Brothers, em setembro de 2008, levou o Congresso americano a aprovar um pacote de US$ 700 bilhões e o Fed, presidido por Ben Bernanke, estudioso da Grande Depressão, a comprar títulos em massa para irrigar o sistema. O mundo rico entrou numa década de juros reais perto de zero ou negativos; a Dinamarca levou parte das taxas para baixo de zero em 2012. Com dinheiro barato, quem tinha patrimônio para dar em garantia tomou crédito e comprou ativos. Esse dinheiro barato ajuda a explicar tanto a alta das ações de tecnologia americanas quanto a dificuldade dos mais jovens, sem patrimônio para dar em garantia, de comprar imóvel.",
        "Para o Brasil, a década teve dois tempos. O dinheiro global procurou retorno nos emergentes por alguns anos, mas a desaceleração chinesa e o fim da alta das commodities, a partir de 2011, deixaram o país com despesas subindo e receitas que já não acompanhavam. E o juro brasileiro seguiu no extremo oposto do juro zero: com Selic de 14,25% e inflação de 4,5%, o juro real fica perto de 10% ao ano, entre os mais altos do mundo. É esse juro alto que costuma atrair dólares para o Brasil, e é por isso que, quando ele cai demais, o câmbio sente.",
      ],
    },
    {
      tipo: "conceito",
      termo: "Juro real e a conta de Fisher",
      definicao:
        "Uma aplicação paga 21% num ano em que a inflação foi de 10%. Quanto você ganhou de verdade? A conta de cabeça diz 11%. A certa diz 10%: no fim do ano você tem 121 para comprar o que agora custa 110, e 121 é 10% a mais que 110. Juro real é isso, quanto o seu dinheiro compra a mais, e se acha dividindo, não subtraindo. A diferença é pequena com inflação baixa e cresce com ela. A ideia leva o nome do economista americano Irving Fisher.",
      naPratica:
        "Com Selic de 14,25% e inflação de 4,5%, a conta de cabeça dá 9,75% de juro real, e a divisão, 9,33% ao ano: com inflação nesse nível, a subtração serve bem como aproximação. Na pandemia, Selic de 2% com inflação de 4,5% dava juro real negativo, de −2,4%, e essa perda de atrativo ajuda a explicar a alta do dólar em 2020. A mesma conta vale para o dólar parado: se ele sobe menos que a inflação brasileira, você perde poder de compra em reais, como de 2002 a 2010.",
      referencia: { autor: "Alexandre Assaf Neto", obra: "Matemática Financeira e suas Aplicações", capitulo: "cap. 4, seções 4.2 e 4.4", ano: 2012 },
      tempo: "1:03:56",
    },

    // ---- 8. Recessão e Joesley Day ------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "recessao-e-joesley-day",
      titulo: "A recessão e o dia em que a bolsa parou",
      resumo: "Dois anos de PIB em queda, cortes onde dava para cortar e uma gravação que virou o mercado em horas.",
      tempo: "1:09:04",
    },
    {
      tipo: "grafico",
      titulo: "O PIB encolheu mais de 3% em 2015 e de novo em 2016",
      subtitulo: "PIB, variação real no ano, em %",
      forma: "barra",
      eixoX: anosPib,
      series: [{ nome: "PIB", valores: pib, destaque: true }],
      formato: { sufixo: "%", casas: 1, sinal: true },
      referencia: { valor: 0, rotulo: "Zero" },
      fonte: "IBGE, Contas Nacionais, via Banco Central do Brasil (SGS 7326)",
      tempo: "1:11:50",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Foi a grande depressão brasileira: o PIB caiu 3,5% em 2015 e 3,3% em 2016. Num orçamento federal em que perto de 94% da despesa é obrigatória ou corrigida automaticamente, o ajuste caiu sobre o que dava para cortar: investimento, custeio e regras de benefícios. O seguro-desemprego, por exemplo, passou a exigir 12 meses de trabalho nos 18 anteriores no primeiro pedido.",
        "Depois do impeachment, a aposta foi em previsibilidade. O teto de gastos, aprovado em dezembro de 2016 e em vigor a partir de 2017, limitou por 20 anos o crescimento da despesa federal à inflação, com revisão possível a partir do décimo. No Banco Central, Ilan Goldfajn levou a Selic de 14,25% para 7% no fim de 2017 e 6,5% em março de 2018, com a inflação também em queda. Os cortes seguiram depois dele, até 4,5% no fim de 2019 e 2% em agosto de 2020.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "A Selic foi de 14,25% a 2% em cinco anos e voltou a 15%",
      subtitulo: "Meta Selic no último dia de cada ano, % ao ano",
      forma: "linha",
      eixoX: anosSelic,
      series: [{ nome: "Meta Selic", valores: selic, destaque: true }],
      formato: { sufixo: "% a.a.", casas: 2 },
      marcos: [
        { em: "2016", rotulo: "Teto de gastos" },
        { em: "2020", rotulo: "Pandemia" },
      ],
      fonte: "Banco Central do Brasil, SGS 432 (meta Selic definida pelo Copom)",
      nota: "O último ponto é a meta vigente em 30 de setembro de 2026.",
      tempo: "1:15:24",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Na noite de 17 de maio de 2017, o colunista Lauro Jardim, de O Globo, revelou que o empresário Joesley Batista tinha gravado o presidente Michel Temer no Palácio do Jaburu, numa conversa lida como aval a pagamentos ao ex-deputado Eduardo Cunha, então preso. A gravação fazia parte de uma delação premiada. No dia seguinte, com as reformas em dúvida, a bolsa caiu tanto que o pregão foi interrompido automaticamente (o circuit breaker), coisa que não acontecia desde 2008. Dali em diante, o governo gastou capital político para sobreviver, não para aprovar reformas.",
      ],
      tempo: "1:17:30",
    },
    {
      tipo: "kpis",
      titulo: "18 de maio de 2017, o Joesley Day",
      itens: [
        { rotulo: "Ibovespa, mínima do dia", valor: -10.47, formato: { sufixo: "%", casas: 2 }, destaque: true, nota: "acionou o circuit breaker" },
        { rotulo: "Ibovespa, fechamento", valor: -8.8, formato: { sufixo: "%", casas: 1 } },
        { rotulo: "Dólar, PTAX", valor: 8.8, formato: { sufixo: "%", casas: 1, sinal: true }, nota: "de R$ 3,11 para R$ 3,38" },
        { rotulo: "Risco-país", valor: 42, formato: { sufixo: " pontos", casas: 0, sinal: true }, nota: "EMBI+, de 258 para 300" },
      ],
      fonte: "B3, via InfoMoney (Ibovespa); Banco Central do Brasil, SGS 1 (PTAX); JP Morgan, via IpeaData (EMBI+)",
      nota: "Variações sobre 17 de maio de 2017. Visto do outro lado, o dólar 8,8% mais caro quer dizer que o real perdeu cerca de 8% do valor em dólar num único dia.",
    },
    {
      tipo: "destaque",
      texto: "O risco político brasileiro não pode ser 100% do seu risco patrimonial.",
      fonte: "Na aula, 1:20:22",
      tempo: "1:20:22",
    },

    // ---- 9. Pandemia ----------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "cisne-negro",
      titulo: "2020: o cisne negro",
      resumo: "A pandemia, o orçamento de guerra e um corte de juros que pesou no dólar.",
      tempo: "1:22:05",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A pandemia foi um cisne negro: um evento raro e de impacto enorme. Em março de 2020, a bolsa brasileira interrompeu os pregões várias vezes, as cadeias globais de produção pararam e a falta de chips travou a indústria de carros por anos. Em maio, o chamado orçamento de guerra separou os gastos da emergência do orçamento normal, e o Brasil ficou entre os países que mais gastaram para compensar o fechamento. O setor público fechou 2020 com déficit primário de 9,2% do PIB, e a dívida bruta chegou a 86,9% do PIB.",
        "Dois anos depois, a dívida tinha voltado a 71,7% do PIB. Boa parte da melhora veio da inflação e do jeito como o Brasil cobra impostos: com a alta dos combustíveis na reabertura, a arrecadação cresceu bem mais depressa que a economia, e o PIB em reais correntes, inflado pelos preços, cresceu mais que a dívida.",
        "O lado dos juros foi menos feliz. Com a inflação medida em queda no auge do isolamento, num índice que demorou a captar a mudança no que as pessoas compravam (menos passagem e restaurante, mais delivery), o Banco Central acelerou os cortes e levou a Selic de 4,5% a 2% em agosto de 2020. Com juro real negativo, o Brasil perdeu o principal atrativo para o dinheiro de curto prazo, e o dólar, que começara o ano a R$ 4,02, chegou a R$ 5,94 em maio. A inflação de 2021 fechou em 10,1%, e a Selic voltou a subir a partir de março daquele ano.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "A dívida bruta saltou para 87% do PIB em 2020 e recuou nos dois anos seguintes",
      subtitulo: "Dívida bruta do governo geral, % do PIB, dezembro de cada ano",
      forma: "linha",
      eixoX: anosDivida,
      series: [{ nome: "Dívida bruta", valores: dividaBruta, destaque: true }],
      formato: { sufixo: "% do PIB", casas: 1 },
      marcos: [{ em: "2020", rotulo: "Orçamento de guerra" }],
      fonte: "Banco Central do Brasil, SGS 13762 (dívida bruta do governo geral, metodologia de 2008)",
      tempo: "1:24:02",
    },

    // ---- 10. A lição ---------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "seis-choques",
      titulo: "Seis choques em trinta anos de real",
      resumo: "O que a sequência de crises ensina sobre deixar o patrimônio inteiro num lugar só.",
      tempo: "1:29:44",
    },
    {
      tipo: "linhaDoTempo",
      titulo: "O dólar em reais e os choques de trinta anos de real",
      subtitulo: "R$ por US$, média anual",
      eventos: [
        { data: "1999", titulo: "Fim da banda", texto: "Moratória de Minas e câmbio flutuante." },
        { data: "2002", titulo: "Eleição", texto: "Dólar a R$ 3,96 e risco-país acima de 2.400 pontos." },
        { data: "2008", titulo: "Crise global", texto: "Lehman Brothers e o dinheiro barato." },
        { data: "2011", titulo: "Fim do boom", texto: "Dólar na mínima do período, R$ 1,53 em julho." },
        { data: "2015", titulo: "Recessão", texto: "PIB cai 3,5% e o superávit vira déficit." },
        { data: "2017", titulo: "Joesley Day", texto: "Pregão interrompido e dólar 8,8% mais caro num dia." },
        { data: "2020", titulo: "Pandemia", texto: "Selic a 2% e dólar a R$ 5,94 em maio." },
      ],
      serie: { nome: "Dólar", eixoX: anosDolar, valores: dolarMedia, formato: "brl" },
      fonte: "Banco Central do Brasil, SGS 3698 (dólar, venda, média mensal)",
      nota: "Média anual das médias mensais.",
    },
    {
      tipo: "numero",
      valor: "6,1×",
      legenda: "foi quanto o dólar médio subiu em reais de 1995 a 2025, perto de 6,2% ao ano.",
      nota: "Médias anuais do Banco Central (SGS 3698): R$ 0,92 em 1995 e R$ 5,59 em 2025. Sem descontar a diferença de inflação entre os dois países, que explica só uma parte dessa alta, como mostra o conceito a seguir.",
    },
    {
      tipo: "conceito",
      termo: "Paridade do poder de compra",
      definicao:
        "Se um tênis custa US$ 100 em Nova York e R$ 300 em São Paulo, com o dólar a R$ 5, alguém vai comprar aqui e vender lá até os preços se aproximarem. Essa é a lei do preço único. Levada para todos os preços da economia, vira a paridade do poder de compra. A versão que interessa a você é a de longo prazo: a moeda do país com mais inflação tende a perder valor na medida da diferença. Se os preços sobem 10% aqui e 2% lá, o dólar tende a ficar perto de 8% mais caro. No curto prazo, o câmbio pode passar anos longe dessa linha.",
      naPratica:
        "De 1995 a 2025, os preços no Brasil subiram 6,4 vezes e, nos Estados Unidos, 2,1 vezes. Só essa diferença levaria o dólar de R$ 0,92 para cerca de R$ 2,78. O resto da alta até R$ 5,59 foi perda real do real, concentrada nas crises desta aula. Ficar todo em reais, portanto, não elimina o risco do câmbio: amarra o poder de compra do seu patrimônio lá fora à inflação brasileira e aos solavancos do dólar.",
      referencia: { autor: "Richard Brealey, Stewart Myers e Franklin Allen", obra: "Princípios de Finanças Corporativas", capitulo: "cap. 27, seção 27.2", ano: 2013 },
      tempo: "1:21:02",
    },
    {
      tipo: "grafico",
      titulo: "Pela diferença de inflação, o dólar iria de R$ 0,92 a R$ 2,78; foi a R$ 5,59",
      subtitulo: "R$ por US$, média anual: o dólar de verdade e o que a diferença de inflação explicaria a partir de 1995",
      forma: "linha",
      eixoX: anosDolar,
      series: [
        { nome: "Dólar observado", valores: dolarMedia, destaque: true },
        { nome: "Só a diferença de inflação", valores: dolarPpc },
      ],
      formato: "brl",
      marcos: [
        { em: "2002", rotulo: "Eleição" },
        { em: "2011", rotulo: "Abaixo da linha" },
      ],
      fonte: "Banco Central do Brasil, SGS 3698 (dólar) e SGS 433 (IPCA); U.S. Bureau of Labor Statistics, CPI-U (CPIAUCNS), via FRED",
      nota: "A segunda linha parte do dólar médio de 1995 e o corrige pela inflação daqui em relação à de lá, em médias anuais. O ponto de partida pesa: em 1995 o real estava preso ao dólar, e outro ano mudaria a distância. A linha não é preço justo nem previsão. Em 2025, a inflação americana usa 11 meses, porque o governo de lá não publicou outubro.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Repare no padrão. Em 1999, uma briga entre um governador e a União; em 2002, a incerteza de uma eleição; em 2015, uma recessão que somou erros de política ao fim da bonança; em 2017, uma gravação; em 2020, um vírus e um corte de juros que o próprio Banco Central depois desfez. Nada disso dependia da carteira de quem sofreu as consequências. E em todos os casos câmbio, juros e bolsa reagiram juntos, porque respondiam à mesma causa.",
        "Por isso dolarizar, aqui, tem sentido amplo. Comprar ações europeias, asiáticas ou americanas, ou qualquer ativo fora do Brasil, também é dolarizar: é recorrer à moeda que cumpre melhor as três funções da moeda que a URV separou, guardar valor, servir de régua e ser aceita em qualquer mercado. O objetivo não é apostar contra o real, a moeda brasileira mais duradoura desde o réis. É deixar de depender de uma única caneta para tudo o que você planeja. Quanto e como, você vê nos próximos módulos.",
      ],
    },
    {
      tipo: "simulador",
      id: "patrimonio-em-dolar",
      titulo: "O mesmo patrimônio, medido em dólar",
      descricao:
        "Ponto de partida: dólar a R$ 5,18, cotação de 30 de setembro de 2026. Quanto o real perde por ano é uma hipótese sua, não uma previsão. Para ter uma referência: os 6,2% de alta anual do dólar de 1995 a 2025 equivalem a o real perder perto de 5,8% ao ano; contando desde o começo do real, a perda média fica entre 5,5% e 6%, conforme o mês de partida e a cotação usada, sempre com longos trechos de real se valorizando no meio.",
      modelo: "cambioPatrimonio",
      parametros: { cambio: { valor: 5.18 }, depreciacao: { valor: 4 } },
    },
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Rubens Penha Cysne e Paulo C. Coimbra-Lisboa",
          titulo: "Imposto inflacionário e transferências inflacionárias no Brasil: 1947-2003",
          ano: 2004,
          nota: "Revista de Economia Política, v. 24, n. 4. Base do gráfico do imposto inflacionário.",
        },
        { autor: "Mario Henrique Simonsen e Rubens Penha Cysne", titulo: "Macroeconomia", ano: 1995, nota: "Cap. 3: como medir o que a inflação transfere." },
        { autor: "Paulo Roberto Arvate e Ciro Biderman (orgs.)", titulo: "Economia do Setor Público no Brasil", ano: 2004, nota: "Cap. 22, federalismo fiscal. Cap. 24, de Fabiana Rocha: as quatro saídas para uma conta pública que não fecha e os estudos de Rocha, Issler e Lima e Luporini sobre o peso da emissão de moeda no orçamento." },
        { autor: "Robert Gibbons", titulo: "Game Theory for Applied Economists", ano: 1992, nota: "Cap. 2.3.E: política monetária, a tentação de quebrar a promessa e a reputação no jogo repetido." },
        { autor: "Jean-Jacques Laffont", titulo: "Regulation and Development", ano: 2005, nota: "Cap. 4: contratos que nem sempre são cumpridos e a renegociação." },
        { autor: "Alexandre Assaf Neto", titulo: "Matemática Financeira e suas Aplicações", ano: 2012, nota: "12ª ed., cap. 4: desvalorização da moeda e juro real." },
        { autor: "Alexandre Assaf Neto", titulo: "Mercado Financeiro", ano: 2014, nota: "12ª ed., cap. 2, seção 2.4.1: os planos de 1986 a 1994 e o bloqueio do Plano Collor." },
        { autor: "Richard Brealey, Stewart Myers e Franklin Allen", titulo: "Princípios de Finanças Corporativas", ano: 2013, nota: "10ª ed., cap. 27, seção 27.2: lei do preço único e paridade do poder de compra." },
        { autor: "Brasil", titulo: "Lei 8.024, de 12 de abril de 1990", ano: 1990, nota: "Conversão da MP 168: o cruzeiro e o bloqueio das aplicações no Plano Collor." },
        { autor: "Banco Central do Brasil, Museu de Valores", titulo: "Síntese dos padrões monetários brasileiros", ano: 2007, nota: "Datas e conversões das oito moedas." },
      ],
    },
  ],
};

export default secao;

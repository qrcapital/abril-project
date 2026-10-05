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
// monetários) e Cysne e Coimbra-Lisboa (2004, tabela 1) para o imposto inflacionário. Onde a aula
// cita um número diferente da série oficial, o texto mostra os dois, sem corrigir o docente em tom
// de errata. Contas e exemplos levam `ilustrativo`.

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

const secao: SecaoDaAula = {
  aula: 2,
  blocos: [
    // ---- 1. As oito moedas e a hiperinflação ---------------------------------------------------
    {
      tipo: "capitulo",
      id: "oito-moedas",
      titulo: "Oito moedas em 52 anos",
      resumo: "Antes de 1994, cada troca de moeda prometeu o fim da inflação, e nenhuma entregou.",
      tempo: "1:10",
    },
    {
      tipo: "texto",
      capitular: true,
      paragrafos: [
        "A aula parte de uma constatação que o brasileiro conhece de cor e costuma esquecer na hora de investir: o real, com mais de três décadas de circulação, é a moeda mais bem-sucedida que o país teve em cem anos, e mesmo assim atravessou crises que mudaram, em semanas, o patrimônio de quem o guardava. Entre 1942 e 1994 o Brasil trocou de padrão monetário oito vezes, quase sempre junto com um plano econômico que trazia congelamento de preços, arrocho salarial ou bloqueio de aplicações.",
        "O argumento que atravessa a hora e meia de aula é mais modesto do que parece e, por isso, mais útil. Ninguém precisa acreditar que o Brasil vai dar errado para concluir que manter todo o patrimônio sob uma moeda, um banco central e um sistema político é uma aposta concentrada, porque a própria história do real tem pelo menos seis momentos em que uma decisão fora do alcance do investidor mexeu, de uma vez, no câmbio, nos juros e na bolsa. Este notebook segue a aula na ordem em que ela foi dada e confere os números citados contra as séries oficiais.",
      ],
      tempo: "0:19",
    },
    {
      tipo: "linhaDoTempo",
      titulo: "Do cruzeiro ao real, oito padrões monetários",
      subtitulo: "Data de entrada em vigor e conversão em relação à moeda anterior",
      eventos: [
        { data: "nov/1942", titulo: "Cruzeiro (Cr$)", texto: "Substitui o réis: mil réis passam a valer um cruzeiro. Governo Vargas." },
        { data: "fev/1967", titulo: "Cruzeiro novo (NCr$)", texto: "Corta três zeros, no governo Castello Branco." },
        { data: "mai/1970", titulo: "Cruzeiro (Cr$)", texto: "O nome antigo volta, sem corte de zeros." },
        { data: "fev/1986", titulo: "Cruzado (Cz$)", texto: "Mais três zeros a menos e congelamento de preços no Plano Cruzado." },
        { data: "jan/1989", titulo: "Cruzado novo (NCz$)", texto: "Outro corte de três zeros, no Plano Verão." },
        { data: "mar/1990", titulo: "Cruzeiro (Cr$)", texto: "Volta o cruzeiro, sem corte, no Plano Collor." },
        { data: "ago/1993", titulo: "Cruzeiro real (CR$)", texto: "Mais três zeros a menos, no governo Itamar." },
        { data: "jul/1994", titulo: "Real (R$)", texto: "CR$ 2.750 passam a valer R$ 1." },
      ],
      fonte: "Banco Central do Brasil, Museu de Valores, Síntese dos padrões monetários brasileiros",
      nota: "Contando o réis, que vigorou até outubro de 1942, o país teve nove padrões monetários.",
      tempo: "1:10",
    },
    {
      tipo: "numero",
      valor: "2,75 quatrilhões",
      legenda: "de cruzeiros de 1942 equivalem a um real, depois de quatro cortes de três zeros e da conversão de 1994.",
      nota: "Conta sobre as equivalências oficiais do Banco Central: 1.000 × 1.000 × 1.000 × 1.000 × 2.750.",
    },
    {
      tipo: "linhaDoTempo",
      titulo: "Cada plano derrubou a inflação por alguns meses, e ela voltou mais alta",
      subtitulo: "IPCA no ano, em %, escala logarítmica",
      eventos: [
        { data: "fev/1986", em: "1986", titulo: "Plano Cruzado", texto: "Nova moeda e congelamento: a inflação de 1986 cai a um terço da de 1985 e explode em 1987." },
        { data: "jun/1987", em: "1987", titulo: "Plano Bresser", texto: "Novo congelamento, de 90 dias." },
        { data: "jan/1989", em: "1989", titulo: "Plano Verão", texto: "Cruzado novo e mais um congelamento." },
        { data: "mar/1990", em: "1990", titulo: "Plano Collor", texto: "Bloqueio de depósitos e aplicações acima de NCz$ 50 mil." },
        { data: "ago/1993", em: "1993", titulo: "Cruzeiro real", texto: "O ano de maior inflação da série: 2.477%." },
        { data: "jul/1994", em: "1994", titulo: "Real", texto: "URV em março, moeda nova em julho. Em 1995, 22%." },
      ],
      serie: { nome: "IPCA no ano", eixoX: anosIpca, valores: ipcaAnual, formato: { sufixo: "%", casas: 0 }, escala: "log" },
      fonte: "IBGE, IPCA, via Banco Central do Brasil (SGS 433)",
      nota: "Inflação de janeiro a dezembro, composta a partir das variações mensais.",
      tempo: "1:57",
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
      nota: "Acumulados compostos a partir das variações mensais. Pelo IGP-DI, o acumulado do mesmo período é de 14,1 trilhões por cento.",
      tempo: "1:57",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Os números confirmam a ordem de grandeza citada na aula, que fala em 13 trilhões por cento nos quinze anos anteriores ao real. Pelo IPCA, a inflação acumulada entre janeiro de 1980 e junho de 1994 passou de 11 trilhões por cento; pelo IGP-DI, da Fundação Getulio Vargas, chegou a 14 trilhões. No pior momento, em março de 1990, os preços subiram 82% num único mês, ritmo em que dobram a cada 35 dias, mais ou menos. Em 1993, último ano inteiro antes do real, a média mensal ficou perto de 31%, e os preços dobravam a cada dois meses e meio.",
        "Inflação desse tamanho não pesa igual para todos. Quem tinha conta remunerada, aplicação no overnight ou dólar conseguia se defender; quem recebia salário em dinheiro e o gastava ao longo do mês perdia um pedaço do poder de compra a cada dia. Essa perda tem nome técnico, e a aula a apresenta a partir dos estudos de Rubens Penha Cysne e Mario Henrique Simonsen: imposto inflacionário.",
      ],
    },
    {
      tipo: "conceito",
      termo: "Imposto inflacionário",
      definicao:
        "Perda de poder de compra imposta a quem guarda moeda que não paga juros enquanto os preços sobem. A receita correspondente vai para quem emite essa moeda: o Banco Central, no caso do papel-moeda e das reservas bancárias, e os bancos comerciais, no caso dos depósitos à vista, que eles aplicam a taxas indexadas enquanto pagam zero ao depositante. Na restrição orçamentária do governo, aparece ao lado dos impostos e da dívida como uma das fontes de financiamento do déficit.",
      naPratica:
        "É um imposto que ninguém votou e que cai mais sobre quem tem menos acesso a aplicações protegidas. Quando ele desaparece, como em 1994, o governo perde uma receita que não precisava aprovar no Congresso, e a conta fiscal, antes escondida na inflação, fica à vista.",
      formula: "II ≈ π × m  (inflação × base monetária real)",
      referencia: { autor: "Paulo Roberto Arvate e Ciro Biderman (orgs.)", obra: "Economia do Setor Público no Brasil", capitulo: "cap. 24", ano: 2004 },
      tempo: "2:56",
    },
    {
      tipo: "grafico",
      titulo: "Até 1993, a inflação transferia de 4% a 7% do PIB por ano a quem emite moeda",
      subtitulo: "Transferências inflacionárias, em % do PIB",
      forma: "barraEmpilhada",
      eixoX: anosCysne,
      series: [
        { nome: "Imposto inflacionário (Banco Central)", valores: impostoInflacionario, destaque: true },
        { nome: "Transferências aos bancos comerciais", valores: transferenciasBancos },
      ],
      formato: { sufixo: "% do PIB", casas: 2 },
      marcos: [{ em: "1994", rotulo: "Real" }],
      fonte: "Cysne e Coimbra-Lisboa, Revista de Economia Política, v. 24, n. 4, 2004, tabela 1",
      nota: "Juros reais negativos pagos pela base monetária (Banco Central) e pela diferença entre M1 e a base (bancos comerciais). A aula cita cerca de 6% do PIB em 1993; a série publicada registra 4,9%.",
      tempo: "2:56",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A divisão quase meio a meio entre Banco Central e bancos explica uma passagem da aula. Com inflação alta, um banco ganhava só por manter depósitos à vista, que não pagavam nada, e aplicar o dinheiro a taxas que acompanhavam os preços. Quando o real derrubou a inflação, esse ganho caiu de quase 2% do PIB em 1993 para menos de 0,1% em 1995, e parte do sistema que dependia dele quebrou: o Banco Central interveio no Econômico em 1995, criou o Proer no fim daquele ano e ainda teria de lidar com o Nacional e o Bamerindus.",
        "O governo perdeu a sua metade da receita no mesmo momento em que a Constituição de 1988 ampliava a previdência rural, a assistência social e a saúde pública. É o ponto de partida do capítulo seguinte. Um plano de estabilização que se resumisse à troca de moeda teria aberto um buraco fiscal, e buraco fiscal, cedo ou tarde, volta como inflação.",
      ],
    },

    // ---- 2. Raízes do Real ------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "raizes-do-real",
      titulo: "Um plano que começou antes da moeda",
      resumo: "Do choque do petróleo à URV, o real é o desfecho de quinze anos de crise da dívida e de planos fracassados.",
      tempo: "4:02",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A aula situa o agravamento do problema em 1979. A Revolução Iraniana provocou o segundo choque do petróleo, a inflação americana se aproximou de 15% ao ano e o Federal Reserve, sob Paul Volcker, levou os juros dos Estados Unidos para perto de 20%. A América Latina tinha financiado o crescimento dos anos 1960 e 1970 com dívida em dólar a juros flutuantes, e o choque chegou pela conta de juros: o México suspendeu pagamentos em 1982, o Brasil declarou moratória em fevereiro de 1987 e a região entrou na chamada década perdida.",
        "Renegociar com os credores exigia, país a país, um programa de estabilização que convencesse o FMI e o Tesouro americano. A Argentina obteve esse apoio para o Plano Cavallo; o Brasil não. Por isso a aula data o início do Plano Real, por um critério que ela mesma chama de arbitrário, em 1992, quando o país passou a montar sozinho as condições para reestruturar a dívida externa. A troca com os bancos credores, nos moldes do Plano Brady, foi concluída em abril de 1994 sem acordo vigente com o FMI, e o Brasil comprou por conta própria os títulos do Tesouro americano dados em garantia.",
      ],
      tempo: "4:02",
    },
    {
      tipo: "fluxo",
      titulo: "Como o choque de 1979 virou a década perdida",
      nos: [
        { titulo: "Petróleo", texto: "Segundo choque, com a Revolução Iraniana.", sentido: "sobe" },
        { titulo: "Inflação americana", texto: "Perto de 15% ao ano em 1980.", sentido: "sobe" },
        { titulo: "Juros do Fed", texto: "Volcker aperta a política monetária.", sentido: "sobe" },
        { titulo: "Dívida latino-americana", texto: "Contratada em dólar, a juro flutuante.", sentido: "sobe" },
        { titulo: "Moratórias", texto: "México em 1982, Brasil em 1987." },
        { titulo: "Crescimento", texto: "A década perdida na região.", sentido: "desce" },
      ],
      ligacoes: ["acelera", "provoca", "encarece", "leva a", "derrubam"],
      fonte: "Síntese da aula",
      tempo: "5:02",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A diferença que a aula enfatiza entre o real e os planos anteriores está no antes e no depois da troca de moeda. O Cruzado, o Bresser, o Verão e o Collor mudaram o nome do dinheiro ou congelaram preços sem mudar a confiança no emissor, e a moeda nova durou pouco. O real teve uma etapa prévia, a Unidade Real de Valor, criada por medida provisória no fim de fevereiro de 1994 e em vigor a partir de 1º de março.",
        "A URV separou as funções da moeda que a hiperinflação tinha embaralhado. Por quatro meses, preços, salários e contratos passaram a ser expressos numa unidade estável, enquanto os pagamentos continuavam em cruzeiros reais, que perdiam valor todo dia. Em 1º de julho, a unidade de conta virou dinheiro: cada URV passou a valer um real, e CR$ 2.750 viraram R$ 1. Não por acaso, essa era também a cotação do dólar em cruzeiros reais no último dia útil de junho, como registra a série histórica do Banco Central.",
      ],
      tempo: "9:02",
    },
    {
      tipo: "tabela",
      titulo: "Como a URV repartiu as funções da moeda",
      colunas: ["Função", "Até fev/1994", "Mar a jun/1994", "A partir de jul/1994"],
      linhas: [
        ["Unidade de conta", "Cruzeiro real, corroído dia a dia", "URV", "Real"],
        ["Meio de troca", "Cruzeiro real", "Cruzeiro real", "Real"],
        ["Reserva de valor", "Indexação e dólar", "URV, perto da paridade com o dólar", "Real, com âncora no dólar até 1999"],
      ],
      fonte: "Banco Central do Brasil (MP 434/1994 e Lei 8.880/1994); síntese da aula",
      nota: "As três funções seguem a definição dada na aula: unidade de conta, meio de troca e reserva de valor.",
      tempo: "10:07",
    },
    {
      tipo: "conceito",
      termo: "Inconsistência temporal e âncora nominal",
      definicao:
        "Um governo que promete inflação baixa tem, depois que salários e contratos já foram fixados, a tentação de surpreender com mais inflação para estimular a atividade. O público antecipa a tentação, e a inflação de equilíbrio fica acima da desejada sem nenhum ganho de produto. No modelo de Barro e Gordon, o viés cresce quando o banco central pesa pouco a inflação (c baixo) e some quando ele consegue se comprometer.",
      naPratica:
        "Atrelar a moeda ao dólar é uma forma de tomar emprestada a reputação de outro banco central, e foi o que o real fez entre 1994 e 1999. O compromisso, porém, só vale enquanto mantê-lo custa menos do que abandoná-lo; quando o custo em reservas e juros fica alto demais, o mercado testa a promessa. A aplicação ao câmbio é uma extensão do modelo, que trata de política monetária.",
      formula: "π = d(1 − b)y*/c",
      referencia: { autor: "Robert Gibbons", obra: "Game Theory for Applied Economists", capitulo: "cap. 2.3.E", ano: 1992 },
      tempo: "12:06",
    },
    {
      tipo: "tabela",
      titulo: "Duas âncoras no dólar, dois finais",
      colunas: ["", "Brasil", "Argentina"],
      linhas: [
        ["Regime", "Câmbio administrado, com bandas a partir de 1995", "Conversibilidade por lei, um peso por dólar"],
        ["Início", "Julho de 1994", "Abril de 1991"],
        ["Fim", "Janeiro de 1999", "Janeiro de 2002"],
        ["Como saiu", "Desvalorização e câmbio flutuante, sem calote", "Moratória da dívida externa, corralito e pesificação"],
        ["O que veio depois", "Metas de inflação, superávit primário e LRF", "Cinco presidentes em cerca de duas semanas"],
      ],
      fonte: "Banco Central do Brasil; Argentina, Lei 23.928/1991 e Lei 25.561/2002",
      nota: "A aula fala em oito anos de paridade argentina; contada da lei de abril de 1991 ao fim do regime, a conversibilidade durou pouco mais de dez anos.",
      tempo: "13:06",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A âncora brasileira durou menos que a argentina, e a aula atribui a diferença ao entusiasmo do FMI pelo Plano Cavallo. Para quem investe, pesa mais o que veio depois: o Brasil saiu do câmbio fixo trocando de regime de política econômica, enquanto a Argentina saiu com calote. Antes disso, porém, o real teve de resolver o problema fiscal criado pelo próprio sucesso.",
        "Sem o imposto inflacionário, o governo precisava financiar com impostos, ou com dívida, os gastos que a Constituição tinha ampliado. As respostas dos anos seguintes foram muitas e pouco vistosas: a renegociação das dívidas estaduais em 1997, que tirou dos governadores o hábito de financiar despesa corrente em bancos como Banespa e Banerj; as privatizações, iniciadas no governo Collor e aceleradas no de Fernando Henrique; e juros altos para manter dólares em caixa e sustentar a cotação. A teoria ajuda a entender por que esse trabalho era inevitável.",
      ],
      tempo: "14:55",
    },
    {
      tipo: "conceito",
      termo: "Aritmética monetarista desagradável",
      definicao:
        "Resultado de Sargent e Wallace: se a dívida pública chega ao limite do que o mercado aceita financiar, os déficits seguintes terão de ser cobertos com emissão de moeda. Nesse regime, subir os juros hoje pode aumentar a inflação de amanhã, porque engorda a dívida que um dia será monetizada. O nome que o mercado usa hoje para o mesmo mecanismo é dominância fiscal.",
      naPratica:
        "Explica por que o real precisou de superávit, renegociação das dívidas estaduais e privatizações, e não só de uma moeda nova. Para o investidor, é o cenário em que juro alto deixa de defender o câmbio, e a dúvida sobre a solvência do governo aparece no dólar e na curva longa antes de aparecer na inflação.",
      formula: "b' = b(1 + r)/(1 + g) − s",
      referencia: { autor: "Paulo Roberto Arvate e Ciro Biderman (orgs.)", obra: "Economia do Setor Público no Brasil", capitulo: "cap. 24, sobre Sargent e Wallace (1981)", ano: 2004 },
      tempo: "16:53",
    },

    // ---- 3. Janeiro de 1999 -------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "janeiro-de-1999",
      titulo: "Quando uma decisão política vira câmbio",
      resumo: "A moratória de Minas Gerais e o fim da banda cambial, em janeiro de 1999.",
      tempo: "21:18",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Em 1998, a crise da Rússia somou-se à do México, de 1994 e 1995, e os mercados passaram a desconfiar de toda moeda emergente presa ao dólar. Dentro do governo havia duas linhas: aprofundar a dolarização, como defendia Gustavo Franco, ou deixar o real perder valor aos poucos. Segundo a aula, o Banco Central trabalhava com uma desvalorização de cerca de 30% ao longo de 1999.",
        "O plano não passou da primeira quinzena do ano. Itamar Franco, recém-empossado no governo de Minas Gerais, anunciou em 6 de janeiro uma moratória de 90 dias da dívida do estado com a União, renegociada dois anos antes. A desconfiança se espalhou, Gustavo Franco deixou o Banco Central em 13 de janeiro, a banda foi alargada e, dois dias depois, o câmbio passou a flutuar. Pela PTAX, o dólar saiu de R$ 1,21 em 12 de janeiro para R$ 1,98 no dia 29 e chegou a R$ 2,16 no início de março.",
        "O ponto da aula não é julgar o governador, cuja queixa contra os indexadores da dívida o próprio docente considera razoável em parte. É mostrar como uma divergência entre dois entes do mesmo Estado redesenhou, em semanas, o patrimônio de quem tinha tudo aplicado em títulos públicos em reais.",
      ],
      tempo: "21:18",
    },
    {
      tipo: "grafico",
      titulo: "Em 13 pregões, o dólar foi de R$ 1,21 para R$ 1,98",
      subtitulo: "R$ por US$, PTAX de venda, janeiro de 1999",
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
      nota: "A aula fala em 30% no mês. Medida pela PTAX, a alta de 12 a 29 de janeiro foi de 64%, o equivalente a uma perda de 39% do valor do real em dólar.",
      tempo: "24:50",
    },
    {
      tipo: "conceito",
      termo: "Compromisso não crível e risco de regra",
      definicao:
        "Quem detém o poder não consegue se obrigar, hoje, a não mudar as regras amanhã. Depois que o capital está aplicado sob uma jurisdição, quem fixa a regra pode tributá-lo, bloqueá-lo ou desvalorizá-lo sem arcar com o efeito sobre o investimento já feito. Antecipando isso, o investidor cobra prêmio ou investe menos; é o problema de holdup, que Acemoglu põe no centro da economia política das instituições.",
      naPratica:
        "Trocar uma ação brasileira por outra, ou um título público por outro, diversifica empresas e prazos, não a regra do jogo. Uma moratória estadual, uma mudança de imposto ou um bloqueio de aplicações atinge ao mesmo tempo tudo o que está sob a mesma caneta. Só outra jurisdição dilui esse fator.",
      referencia: { autor: "Daron Acemoglu", obra: "Political Economy Lecture Notes", capitulo: "caps. 1 e 11 (holdup, seção 11.2.9)" },
      tempo: "25:42",
    },
    {
      tipo: "texto",
      paragrafos: [
        "O raciocínio não é exclusivo do Brasil, e a aula faz questão de dizer isso. Um americano com toda a aposentadoria em títulos do Tesouro também perde quando uma política tarifária pressiona a inflação e os juros longos; o britânico viu a libra despencar depois do referendo do Brexit, em junho de 2016. O que muda de um país para outro é a frequência e a intensidade desses episódios, não a existência deles.",
        "O exemplo de 1999 tampouco ficou no passado. A aula lembra que, desde então, a União renegociou outras vezes as dívidas dos estados, e que governos estaduais que comprometem parcela grande do orçamento com juros, como Rio de Janeiro e Rio Grande do Sul, investem menos e prestam serviços piores. A teoria do federalismo fiscal tem um nome para a raiz do problema.",
      ],
      tempo: "26:37",
    },
    {
      tipo: "conceito",
      termo: "Restrição orçamentária fraca",
      definicao:
        "Quando estados e municípios esperam ser socorridos pela União, endividar-se além da conta passa a ser racional: o benefício do gasto fica com o governo local, e o custo é dividido com o país inteiro. No Brasil, a União renegociou dívidas subnacionais em 1989, 1991, 1993 e 1997, e a Lei de Responsabilidade Fiscal veio em 2000 como resposta.",
      naPratica:
        "O risco fiscal relevante para o investidor é o do setor público consolidado, porque o socorro de hoje vira dívida federal amanhã. Por isso uma briga entre um governador e a União, como a de 1999, mexe no câmbio do país inteiro.",
      referencia: { autor: "Paulo Roberto Arvate e Ciro Biderman (orgs.)", obra: "Economia do Setor Público no Brasil", capitulo: "cap. 22 (federalismo fiscal, M. Mendes)", ano: 2004 },
      tempo: "28:17",
    },

    // ---- 4. O tripé --------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "o-tripe",
      titulo: "A resposta de 1999: o tripé",
      resumo: "Metas de inflação, superávit primário e câmbio flutuante, amarrados depois pela Lei de Responsabilidade Fiscal.",
      tempo: "31:42",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A reação começou pela troca no comando do Banco Central. Arminio Fraga, que vinha da gestora de George Soros e conhecia por dentro os ataques especulativos contra moedas, assumiu em março de 1999 e montou em poucos meses o regime que o país usa até hoje, com ajustes.",
        "O primeiro pé foi o regime de metas de inflação, instituído por decreto em junho de 1999 e inspirado no modelo que a Nova Zelândia adotara no começo da década. O Banco Central passa a perseguir uma meta anunciada, com intervalo de tolerância; desde 2025, a meta é contínua, de 3%, com 1,5 ponto percentual para cima ou para baixo. O segundo pé foi a meta de superávit primário, a economia que o setor público faz antes de pagar juros, prometida para mostrar que a dívida não cresceria sem controle. O terceiro foi o câmbio flutuante, que a aula descreve como flutuante e sujo: o Banco Central não fixa preço, mas intervém quando julga o movimento excessivo.",
        "Em maio de 2000, a Lei de Responsabilidade Fiscal fechou o desenho. A aula se refere ao artigo que impede os entes públicos de se financiarem nos próprios bancos; no texto da lei, a proibição está nos artigos 35 e 36, que vedam operações de crédito entre entes da Federação e entre um banco estatal e o ente que o controla. Foi o desrespeito a essa lógica, com Caixa, Banco do Brasil e BNDES cobrindo despesas da União, que embasou o processo de impeachment de 2016.",
      ],
      tempo: "31:42",
    },
    {
      tipo: "matriz",
      modo: "payoff",
      titulo: "Meta de inflação: um jogo de credibilidade",
      subtitulo: "Pagamentos ordinais, de 0 (pior) a 4 (melhor), para Banco Central e mercado",
      eixoLinhas: "Banco Central",
      eixoColunas: "Mercado",
      linhas: ["Cumpre a meta", "Cede à pressão"],
      colunas: ["Acredita", "Duvida"],
      celulas: [
        [
          { valores: [3, 3], marca: "Sustentável com reputação", explicacao: "Inflação na meta com juros menores: a credibilidade poupa o custo de provar, e os dois ganham." },
          { valores: [0, 2], explicacao: "O Banco Central segura a inflação com juro alto enquanto o mercado ainda desconfia. É o custo de construir reputação." },
        ],
        [
          { valores: [4, 0], explicacao: "Surpresa inflacionária: ganho curto para o Banco Central, perda para quem acreditou. É a tentação descrita por Barro e Gordon." },
          { valores: [1, 1], marca: "Equilíbrio de uma rodada", explicacao: "Inflação alta sem ganho de produto. Se o jogo acontecesse uma vez só, seria o resultado." },
        ],
      ],
      ilustrativo: true,
      nota: "Matriz didática da lógica de Barro e Gordon (Gibbons, cap. 2.3.E). Numa rodada única, ceder é a melhor resposta do Banco Central; com o jogo repetido e um mercado que pune desvios, cumprir a meta se sustenta.",
      tempo: "33:28",
    },

    // ---- 5. 2002 -------------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "eleicao-de-2002",
      titulo: "2002: o preço da incerteza",
      resumo: "Dólar perto de R$ 4 e risco-país acima de 2.400 pontos antes de qualquer decisão do novo governo.",
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
        "A Lei de Responsabilidade Fiscal não elimina o risco político, lembra a aula, e a eleição de 2002 foi a prova. O favorito, Luiz Inácio Lula da Silva, chegava à quarta disputa depois de ter feito oposição ao Plano Real, às privatizações, à reforma da previdência de Fernando Henrique, à LRF e ao tripé. O mercado precificou a hipótese de ruptura antes de qualquer ato do candidato: pela PTAX, o dólar subiu 74% entre a mínima de abril, R$ 2,27, e a máxima de 22 de outubro, R$ 3,96.",
        "Em junho, a Carta ao Povo Brasileiro comprometeu o candidato com o superávit primário e o respeito aos contratos, e em agosto o Brasil acertou com o FMI um acordo de cerca de US$ 30 bilhões; a aula fala em uma linha de US$ 40 bilhões. O governo eleito cumpriu a carta, elevou a meta de superávit e, em dezembro de 2005, antecipou o pagamento de US$ 15,5 bilhões que ainda devia ao Fundo, valor bem maior que os 3 a 4 bilhões lembrados na aula.",
      ],
      tempo: "43:18",
    },
    {
      tipo: "grafico",
      titulo: "O risco-país de 2002 foi o mais alto desde o Plano Real",
      subtitulo: "EMBI+ Brasil, pontos-base acima dos títulos do Tesouro americano, média anual",
      forma: "barra",
      eixoX: anosEmbi,
      series: [{ nome: "EMBI+ Brasil", valores: embiMedia, destaque: true }],
      formato: { sufixo: " pontos", casas: 0 },
      marcos: [{ em: "2002", rotulo: "Pico diário: 2.443" }],
      fonte: "JP Morgan, EMBI+ Brasil, via IpeaData (JPM366_EMBI366)",
      nota: "Média dos valores diários de cada ano. A série foi descontinuada em julho de 2024; o último ponto cobre janeiro a julho.",
      tempo: "44:20",
    },
    {
      tipo: "grafico",
      titulo: "A 27% ao ano, uma dívida dobra em menos de três anos",
      subtitulo: "Anos para uma dívida dobrar só com juros, conforme o custo anual",
      forma: "barra",
      eixoX: ["3%", "7%", "12%", "27%"],
      series: [{ nome: "Anos para dobrar", valores: [23.4, 10.2, 6.1, 2.9] }],
      formato: { sufixo: " anos", casas: 1 },
      ilustrativo: true,
      nota: "ln(2) / ln(1 + taxa), com taxa constante. Os 27% somam os 3% do título americano aos 24 pontos de risco-país citados na aula para 2002; os 7% são o custo que a aula estima para os dias de hoje.",
      tempo: "44:20",
    },
    {
      tipo: "conceito",
      termo: "Prêmio de risco e cumprimento de contratos",
      definicao:
        "Onde contratos podem ser reescritos, o investidor cobra pela probabilidade de o combinado não ser cumprido. Laffont modela o cumprimento como uma probabilidade π, que cresce com o gasto em instituições de enforcement e cai com a corrupção; o que falta para 1 vira renegociação, com perda para quem investiu.",
      naPratica:
        "Lido assim, o risco-país é o preço, cotado todo dia, de 1 − π. Em 2002 o mercado cobrava 24 pontos percentuais acima dos títulos americanos porque atribuía chance alta de a dívida ser renegociada; quando a política fiscal confirmou a carta, o prêmio caiu sem que o tamanho da dívida mudasse da noite para o dia. O livro trata de concessões de serviços públicos, e a aplicação a títulos soberanos é uma transposição.",
      referencia: { autor: "Jean-Jacques Laffont", obra: "Regulation and Development", capitulo: "cap. 4", ano: 2005 },
      tempo: "45:15",
    },

    // ---- 6. Boom de commodities ----------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "boom-de-commodities",
      titulo: "O vento a favor e a conta que ficou",
      resumo: "A China na OMC, o boom de commodities e a escolha entre poupar a bonança ou gastá-la.",
      tempo: "47:14",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A China entrou na Organização Mundial do Comércio em dezembro de 2001 e passou a década seguinte levando centenas de milhões de pessoas do campo para as cidades, o que se traduziu em demanda por minério de ferro, soja, carne e petróleo, justamente o que o Brasil exporta. A aula cita um índice do JP Morgan com alta de 700% entre 2001 e 2007. O Índice de Commodities do Banco Central, que pondera os produtos relevantes para a economia brasileira, mostra um movimento menor, mas igualmente decisivo: em dólar, ele quase triplicou entre 2002 e 2011.",
        "O Brasil já tinha vivido esse roteiro de reforma seguida de bonança externa. Campos Salles saneou as contas e renegociou a dívida externa entre 1898 e 1902 e entregou o governo, a Rodrigues Alves, em pleno ciclo da borracha. O risco do roteiro, diz a aula, é que a bonança funcione como licença para expandir o gasto. No primeiro governo Lula, porém, o superávit primário ficou acima de 3% do PIB em todos os anos, a dívida caiu e a Selic recuou de 25% no fim de 2002 para 10,75% no fim de 2010. O dólar, que chegara perto de R$ 4, terminou 2010 a R$ 1,67 e tocou R$ 1,53 em julho de 2011.",
      ],
      tempo: "47:14",
    },
    {
      tipo: "grafico",
      titulo: "Em dólar, as commodities do Brasil subiram 2,7 vezes entre 2002 e 2011",
      subtitulo: "Índice de Commodities Brasil (IC-Br) em dólares, média anual",
      forma: "linha",
      eixoX: anosIcbr,
      series: [{ nome: "IC-Br em US$", valores: icbrUsd, destaque: true }],
      formato: { casas: 0 },
      marcos: [
        { em: "2001", rotulo: "China na OMC" },
        { em: "2008", rotulo: "Crise global" },
      ],
      fonte: "Banco Central do Brasil, SGS 29042 (IC-Br em US$)",
      nota: "Média dos índices mensais. O índice citado na aula, do JP Morgan, mede outra cesta e por isso mostra outra variação.",
      tempo: "49:14",
    },
    {
      tipo: "grafico",
      titulo: "O superávit ficou acima de 3% do PIB por sete anos e virou déficit em 2014",
      subtitulo: "Resultado primário do setor público consolidado, % do PIB, acumulado no ano",
      forma: "barra",
      eixoX: anosPrimario,
      series: [{ nome: "Resultado primário", valores: primario, destaque: true }],
      formato: { sufixo: "% do PIB", casas: 2 },
      referencia: { valor: 0, rotulo: "Equilíbrio" },
      faixas: [{ de: "2002", ate: "2008", rotulo: "Acima de 3% do PIB" }],
      fonte: "Banco Central do Brasil, SGS 5793 (NFSP sem desvalorização cambial, primário)",
      nota: "Sinal invertido em relação ao BCB, que publica a necessidade de financiamento: aqui, positivo é superávit. Pico da série em 2005, com 3,74% do PIB; a aula cita 3,5%.",
      tempo: "51:10",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A Argentina recebeu o mesmo vento a favor por outro caminho. O fim da conversibilidade veio com o corralito, que limitou saques bancários a partir de dezembro de 2001, com a conversão forçada de depósitos em dólar para pesos e com a moratória da dívida externa, a maior registrada até então. A alta da soja, da carne e do trigo trouxe dólares suficientes para adiar a crise seguinte, e a aula sustenta que isso tirou do país o incentivo para fazer as reformas que o Brasil foi obrigado a fazer em 1999, quando não havia bonança.",
        "Há também uma lição de aritmética, que a aula expõe ao comparar os anos 2000 com hoje. Gasto público que cresce 6% ao ano em termos nominais perde peso quando a inflação é de 4,5% e o PIB real cresce 3,5%, porque o PIB nominal avança perto de 8%; com inflação de 4% e crescimento de 2%, o mesmo ritmo de gasto deixa de abrir espaço. O simulador abaixo mostra o lado da dívida dessa conta: o que a faz subir ou cair é a distância entre o juro real e o crescimento real, descontado o resultado primário.",
      ],
      tempo: "52:52",
    },
    {
      tipo: "simulador",
      id: "aritmetica-da-divida",
      titulo: "A aritmética da dívida",
      descricao:
        "Ponto de partida: dívida bruta do governo geral perto de 79% do PIB, como em dezembro de 2025 (BCB, SGS 13762). Mexa no juro real, no crescimento e no resultado primário e veja em que combinação a dívida para de crescer.",
      modelo: "dividaPib",
      parametros: { divida: { valor: 79 }, anos: { valor: 15 } },
      tempo: "53:51",
    },

    // ---- 7. 2008 e o dinheiro barato -----------------------------------------------------------
    {
      tipo: "capitulo",
      id: "dinheiro-barato",
      titulo: "2008 e a década do dinheiro barato",
      resumo: "A crise americana, a resposta do Fed e um mundo de juros reais perto de zero.",
      tempo: "56:28",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A crise de 2008 começou onde a aula considera o lugar mais improvável: o mercado imobiliário americano, cujos preços quase só tinham subido por décadas. Famílias tomavam crédito contra o valor do imóvel contando com a valorização, e bancos emprestavam a quem não tinha renda para pagar. Quando os preços caíram, as garantias passaram a valer menos do que as dívidas e vieram as chamadas de margem: o credor exige mais garantia ou executa a que tem, e a venda forçada derruba os preços ainda mais.",
        "A quebra do Lehman Brothers, em setembro de 2008, levou o Tesouro americano a um pacote de US$ 700 bilhões e o Federal Reserve, presidido por Ben Bernanke, estudioso da Grande Depressão, a comprar títulos em grande escala para dar liquidez ao sistema. O mundo desenvolvido entrou numa década de juros reais perto de zero ou negativos, e o banco central da Dinamarca levou parte de suas taxas para baixo de zero em 2012. Com dinheiro barato, quem já tinha patrimônio para dar em garantia tomou crédito e comprou ativos; a aula liga a esse movimento tanto a alta das ações americanas de tecnologia quanto a dificuldade dos mais jovens para comprar imóveis.",
        "Para o Brasil, a década teve dois tempos. O dinheiro global procurou retorno em emergentes por alguns anos, mas a desaceleração chinesa e o fim da alta das commodities, a partir de 2011, deixaram o país com despesas que continuavam subindo e receitas que já não acompanhavam. Com os números citados na aula, Selic de 14,25% e inflação de 4,5%, o juro real brasileiro, de quase 10% ao ano, estava entre os mais altos do mundo, no extremo oposto do juro zero.",
      ],
      tempo: "57:12",
    },

    // ---- 8. Recessão e Joesley Day ------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "recessao-e-joesley-day",
      titulo: "A recessão e o dia em que a bolsa parou",
      resumo: "Duas quedas seguidas do PIB, o ajuste pelo investimento e uma gravação que virou o humor do mercado em horas.",
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
        "A aula chama o período de grande depressão brasileira: o PIB caiu 3,5% em 2015 e 3,3% em 2016. O ajuste possível, num orçamento que a aula descreve como 94% indexado ou obrigatório, recaiu sobre o que podia ser cortado: investimento, custeio e regras de acesso a benefícios, como a do seguro-desemprego, que passou a exigir 12 meses de trabalho nos 18 anteriores no primeiro pedido.",
        "Depois do impeachment, o governo apostou em previsibilidade. O teto de gastos, aprovado por emenda constitucional em dezembro de 2016, limitou por 20 anos, com revisão possível a partir do décimo, o crescimento da despesa federal à inflação. No Banco Central, Ilan Goldfajn conduziu a Selic de 14,25% para 6,5% em março de 2018, e o ciclo de cortes seguiu até 2% em agosto de 2020. A aula fala em 7% no fim de 2019; a série oficial mostra 7% no fim de 2017 e 4,5% no fim de 2019.",
      ],
      tempo: "1:12:45",
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
        "Na noite de 17 de maio de 2017, o colunista Lauro Jardim, de O Globo, revelou que o empresário Joesley Batista havia gravado o presidente Michel Temer no Palácio do Jaburu, num diálogo lido como aval a pagamentos ao ex-deputado Eduardo Cunha, então preso. A gravação fazia parte de um acordo de delação premiada. No dia seguinte, com a agenda de reformas posta em dúvida, a bolsa acionou o circuit breaker pela primeira vez desde 2008, e o governo passou a gastar capital político para sobreviver em vez de aprovar reformas.",
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
      nota: "Variações em relação a 17 de maio de 2017. A aula diz que o dólar se desvalorizou 8%; foi o real que perdeu valor, com o dólar em alta.",
      tempo: "1:19:41",
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
      resumo: "A pandemia, o orçamento de guerra e um corte de juros que pesou no câmbio.",
      tempo: "1:22:05",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A aula chama a pandemia de cisne negro, um evento raro de impacto enorme. Em março de 2020 a bolsa brasileira acionou o circuit breaker em vários pregões, as cadeias globais de suprimento pararam e a falta de semicondutores atingiu a indústria automobilística por anos. Em maio, a Emenda Constitucional 106, o orçamento de guerra, separou os gastos da emergência do orçamento regular. O setor público fechou 2020 com déficit primário de 9,2% do PIB, e a dívida bruta chegou a 86,9% do PIB.",
        "Dois anos depois, a dívida tinha voltado a 71,7% do PIB. A aula atribui boa parte da melhora à inflação e ao modo como o Brasil tributa: com a alta dos combustíveis na reabertura, a arrecadação cresceu muito mais depressa do que a economia, e o PIB nominal, inflado pelos preços, cresceu mais do que a dívida.",
        "O lado monetário foi menos feliz. Com a inflação medida em queda no auge do isolamento, num índice que, argumenta a aula, demorou a captar a mudança de hábitos de consumo, o Banco Central acelerou os cortes e levou a Selic de 4,5% a 2% em agosto de 2020. Com juro real negativo, o Brasil perdeu o principal atrativo para o capital de curto prazo, e o dólar, que começara o ano a R$ 4,02, chegou a R$ 5,94 em meados de maio. A inflação de 2021 fechou em 10,1%, e a Selic voltou a subir a partir de março.",
      ],
      tempo: "1:22:28",
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
      resumo: "O que a sequência de crises ensina sobre concentrar o patrimônio num só lugar.",
      tempo: "1:29:44",
    },
    {
      tipo: "linhaDoTempo",
      titulo: "O dólar em reais e os choques citados na aula",
      subtitulo: "R$ por US$, média anual",
      eventos: [
        { data: "1999", titulo: "Fim da banda", texto: "Moratória de Minas e câmbio flutuante." },
        { data: "2002", titulo: "Eleição", texto: "Dólar a R$ 3,96 e risco-país acima de 2.400 pontos." },
        { data: "2008", titulo: "Crise global", texto: "Lehman Brothers e o dinheiro barato." },
        { data: "2011", titulo: "Fim do boom", texto: "Dólar na mínima do período, R$ 1,53 em julho." },
        { data: "2015", titulo: "Recessão", texto: "PIB cai 3,5% e o primário vira déficit." },
        { data: "2017", titulo: "Joesley Day", texto: "Circuit breaker e dólar 8,8% mais caro num dia." },
        { data: "2020", titulo: "Pandemia", texto: "Selic a 2% e dólar a R$ 5,94 em maio." },
      ],
      serie: { nome: "Dólar", eixoX: anosDolar, valores: dolarMedia, formato: "brl" },
      fonte: "Banco Central do Brasil, SGS 3698 (dólar, venda, média mensal)",
      nota: "Média anual das médias mensais.",
      tempo: "1:29:44",
    },
    {
      tipo: "numero",
      valor: "6,1×",
      legenda: "foi quanto o dólar médio subiu em reais entre 1995 e 2025, cerca de 6,2% ao ano.",
      nota: "Médias anuais da série SGS 3698 do Banco Central: R$ 0,92 em 1995 e R$ 5,59 em 2025. Variação nominal, sem descontar a diferença de inflação entre os dois países.",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A sequência que a aula percorre tem um padrão. Em 1999, foi a disputa entre um governador e a União; em 2002, a incerteza eleitoral; em 2015, uma recessão que somou erros de política ao fim da bonança; em 2017, uma gravação; em 2020, um vírus seguido de um corte de juros que o próprio Banco Central depois reverteu. Nenhum desses episódios dependia da carteira de quem os sofreu, e em todos o câmbio, os juros e a bolsa reagiram juntos, porque respondiam ao mesmo fator.",
        "Por isso a aula define dolarização de forma ampla. Comprar ações europeias, asiáticas ou americanas, ou qualquer ativo fora da jurisdição brasileira, também é dolarizar, no sentido de recorrer à moeda que cumpre melhor as três funções vistas no início: reserva de valor, unidade de conta global e meio de troca aceito em qualquer mercado. O objetivo não é apostar contra o real, a moeda brasileira mais duradoura desde os réis, mas deixar de depender de uma única caneta para tudo o que se planeja. Quanto e como fazer isso é assunto dos módulos seguintes.",
      ],
      tempo: "1:21:02",
    },
    {
      tipo: "simulador",
      id: "patrimonio-em-dolar",
      titulo: "O mesmo patrimônio, medido em dólar",
      descricao:
        "Ponto de partida: dólar a R$ 5,18, PTAX de 30 de setembro de 2026. A perda anual do real é uma hipótese, não uma previsão; como referência, a média nominal de 1995 a 2025 ficou perto de 6% ao ano, com longos períodos de valorização do real no meio.",
      modelo: "cambioPatrimonio",
      parametros: { cambio: { valor: 5.18 }, depreciacao: { valor: 4 } },
      tempo: "1:29:44",
    },
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Rubens Penha Cysne e Paulo C. Coimbra-Lisboa",
          titulo: "Imposto inflacionário e transferências inflacionárias no Brasil: 1947-2003",
          ano: 2004,
          nota: "Revista de Economia Política, v. 24, n. 4. Fonte do gráfico do imposto inflacionário.",
        },
        { autor: "Mario Henrique Simonsen e Rubens Penha Cysne", titulo: "Macroeconomia", ano: 1995, nota: "Cap. 3, a metodologia das transferências inflacionárias citada na aula." },
        { autor: "Paulo Roberto Arvate e Ciro Biderman (orgs.)", titulo: "Economia do Setor Público no Brasil", ano: 2004, nota: "Caps. 22 (federalismo fiscal) e 24 (déficit público e sustentabilidade)." },
        { autor: "Robert Gibbons", titulo: "Game Theory for Applied Economists", ano: 1992, nota: "Cap. 2.3.E, política monetária e inconsistência temporal." },
        { autor: "Jean-Jacques Laffont", titulo: "Regulation and Development", ano: 2005, nota: "Cap. 4, enforcement imperfeito e renegociação de contratos." },
        { autor: "Banco Central do Brasil, Museu de Valores", titulo: "Síntese dos padrões monetários brasileiros", ano: 2007, nota: "Datas e conversões das oito moedas." },
      ],
    },
  ],
};

export default secao;

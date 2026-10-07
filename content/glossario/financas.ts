import type { Verbete } from "@/lib/glossario";

// Verbetes de finanças: câmbio e moeda, juros e inflação, renda fixa, ações, fundos e ETFs,
// carteira e risco, comportamento. Escritos em 07/out/2026 a partir dos quatro notebooks do Módulo I
// (os `apelidos` repetem as formas usadas lá), do super dossiê dos livros-texto e das transcrições.
// Números de mercado só quando conferidos (os mesmos dos notebooks, com a data) ou quando são regra
// estável; exemplos com números redondos vêm marcados como hipotéticos. Sem recomendação de
// alocação, de ativo ou de momento. Tom: `docs/TOM-DO-NOTEBOOK.md`, sem travessão.

export const VERBETES_FINANCAS: Verbete[] = [
  // ==== CÂMBIO E MOEDA ==========================================================================
  {
    slug: "cambio",
    termo: "Câmbio",
    categoria: "Câmbio e moeda",
    apelidos: ["taxa de câmbio", "taxas de câmbio", "cotação do dólar", "o câmbio"],
    resumo:
      "O preço de uma moeda medido em outra. Quando se diz que o dólar está a R$ 5, é o câmbio: quantos reais você entrega por um dólar.",
    texto: [
      "Você vai viajar e precisa de US$ 1.000. Se o dólar está a R$ 5, a conta dá R$ 5.000. Se na semana seguinte ele vai a R$ 5,50, a mesma viagem passa a custar R$ 5.500. Esse preço que muda todo dia é a taxa de câmbio.",
      "No Brasil, a cotação é dada em reais por dólar. Por isso, dólar subindo quer dizer real perdendo valor, e dólar caindo, real ganhando. O preço sai do encontro de quem quer comprar e de quem quer vender moeda: exportadores, importadores, turistas, empresas que pagam dívida lá fora e investidores que entram e saem do país.",
      "Existem várias cotações ao mesmo tempo. A do mercado entre bancos e empresas (o dólar comercial), a referência oficial do Banco Central (a PTAX) e a do balcão da casa de câmbio, sempre um pouco mais cara para quem compra.",
    ],
    exemplo:
      "Hipotético: uma ação americana custa US$ 100. Com o dólar a R$ 5, você paga R$ 500 por ela. Um ano depois, a ação continua em US$ 100, mas o dólar foi a R$ 5,50. Em reais, ela vale R$ 550, 10% a mais, sem que a empresa tenha mudado nada.",
    naPratica:
      "Todo investimento em dólar tem duas partes: o ativo e o câmbio. O câmbio pode somar ou tirar do seu resultado em reais, e ninguém acerta com regularidade para onde ele vai no ano seguinte.",
    relacionados: ["dolar-comercial", "ptax", "desvalorizacao-cambial", "risco-cambial", "cambio-flutuante"],
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
    resumo:
      "A cotação do dólar no mercado entre bancos, empresas e grandes investidores. É o número que aparece no noticiário e serve de base para as outras cotações.",
    texto: [
      "Quando o jornal diz que o dólar fechou a R$ 5,15, está falando do dólar comercial. É o preço das operações grandes, entre bancos e de bancos com empresas que exportam, importam ou pagam dívidas no exterior.",
      "Por ser um mercado de volumes altos, a diferença entre o preço de compra e o de venda é pequena. Ninguém na pessoa física paga exatamente essa cotação: o banco, a corretora ou a casa de câmbio acrescentam uma margem, o spread, e às vezes tarifas e imposto.",
    ],
    exemplo:
      "Hipotético: o comercial está a R$ 5,00. Uma conta internacional que cobra 1% de spread converte a R$ 5,05; uma casa de câmbio que vende papel-moeda pode cobrar R$ 5,25 ou mais. Os três preços convivem no mesmo dia.",
    naPratica:
      "Use o comercial como régua para saber quanto você realmente paga ao converter. A distância entre ele e o preço que te ofereceram é o custo da conversão, antes do IOF.",
    relacionados: ["cambio", "ptax", "spread-cambial", "custo-total"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "12:31" }],
  },
  {
    slug: "ptax",
    termo: "PTAX",
    categoria: "Câmbio e moeda",
    apelidos: ["dólar PTAX", "taxa PTAX", "cotação oficial do Banco Central", "cotação oficial diária"],
    resumo:
      "A taxa de câmbio de referência calculada pelo Banco Central todo dia útil, a partir de consultas aos bancos. É usada em contratos, balanços e declarações.",
    texto: [
      "Imagine que um contrato precisa dizer quanto vale um dólar numa data. Qual cotação usar, se ela muda a cada segundo? Para isso existe a PTAX, a taxa oficial do Banco Central.",
      "O cálculo é feito com quatro consultas aos bancos que atuam como dealers, em janelas de dez minutos que começam às 10h, 11h, 12h e 13h. O Banco Central descarta as cotações mais extremas e tira a média. O resultado sai no começo da tarde, com uma taxa de compra e outra de venda.",
      "Como é uma média de um pedaço do dia, a PTAX quase nunca bate com o dólar de fechamento do mercado. Para referência histórica, é a série mais usada, inclusive nos gráficos deste curso.",
    ],
    exemplo:
      "Em janeiro de 1999, quando o câmbio passou a flutuar, a PTAX foi de R$ 1,21 no dia 12 para R$ 1,98 no dia 29. Em 13 pregões, o real perdeu 39% do valor em dólar.",
    naPratica:
      "Ao declarar bens e calcular imposto sobre investimentos no exterior, a regra usa cotações oficiais do Banco Central em datas definidas. Guarde as datas das suas conversões: elas importam na hora da conta.",
    relacionados: ["cambio", "dolar-comercial", "imposto-de-renda", "cambio-flutuante"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "21:18" }],
  },
  {
    slug: "spread-cambial",
    termo: "Spread cambial",
    categoria: "Câmbio e moeda",
    apelidos: ["spread de câmbio", "dólar turismo", "dólar em espécie", "VET", "valor efetivo total"],
    resumo:
      "A margem que o banco ou a corretora cobra sobre a cotação de mercado ao converter seu dinheiro. É um custo que quase nunca aparece como tarifa, mas está no preço.",
    texto: [
      "Você vê o dólar comercial a R$ 5,00 e o aplicativo converte a R$ 5,10. Não houve tarifa nenhuma na tela, mas você pagou 2% a mais. Essa diferença é o spread cambial, e é assim que boa parte das instituições ganha dinheiro com câmbio.",
      "O spread varia muito. Contas internacionais digitais costumam cobrar frações de ponto percentual; cartão de crédito internacional e papel-moeda em casa de câmbio (o chamado dólar turismo) costumam cobrar bem mais. Em cima disso, vem o IOF, que depende do tipo de operação.",
      "Para facilitar a comparação, o Banco Central exige que as instituições informem o VET, o valor efetivo total: quantos reais você paga por dólar somando cotação, tarifas e imposto.",
    ],
    exemplo:
      "Hipotético: converter R$ 100 mil com spread de 2% custa R$ 2 mil. Com spread de 0,5%, custa R$ 500. Em aportes mensais ao longo de anos, essa diferença vira um pedaço relevante do retorno.",
    naPratica:
      "Antes de escolher onde converter, compare o VET, e não a cotação anunciada. Em investimento de longo prazo, o custo de entrada e de saída pesa tanto quanto a taxa de administração.",
    relacionados: ["dolar-comercial", "custo-total", "ptax", "cambio"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "35:56" }],
  },
  {
    slug: "desvalorizacao-cambial",
    termo: "Desvalorização cambial",
    categoria: "Câmbio e moeda",
    apelidos: ["desvalorização", "desvalorização do real", "depreciação", "depreciação cambial", "valorização do real", "apreciação", "o real perdeu valor", "real perdeu valor", "perda anual do real"],
    resumo:
      "Quando uma moeda passa a valer menos em relação a outra. Se o dólar sobe de R$ 4 para R$ 5, o real se desvalorizou contra o dólar.",
    texto: [
      "Pense em US$ 1.000 que custavam R$ 4.000 e agora custam R$ 5.000. O dólar subiu 25%. Visto do outro lado, os seus R$ 4.000 passaram a comprar só US$ 800, 20% a menos. É o mesmo movimento, medido de lados opostos, e por isso os percentuais não batem.",
      "Os economistas costumam chamar de desvalorização a decisão do governo de baixar o valor de uma moeda presa a outra, e de depreciação a queda num câmbio que flutua. No dia a dia, as duas palavras se misturam. O contrário é a valorização, ou apreciação.",
      "O real perdeu valor em saltos, e não em linha reta: em 1999, com o fim da banda cambial, em 2002, na eleição, em 2008, na crise global, em 2015, na recessão, e em 2020, na pandemia. No meio, houve longos períodos de real forte.",
    ],
    exemplo:
      "Se o dólar dobra de preço, ele subiu 100%, mas o real perdeu metade do valor, e não 100%. Pela mesma lógica, o dólar ter ido de R$ 0,93 em 1994 para R$ 5,15 em 2026 significa que o real perdeu cerca de 82% do seu valor em dólar.",
    naPratica:
      "A desvalorização do real reduz o seu patrimônio medido em dólar e encarece tudo o que tem preço lá fora. Ter uma parte em outra moeda é o jeito de diluir esse risco, sem precisar adivinhar quando o próximo salto vem.",
    relacionados: ["cambio", "cambio-flutuante", "poder-de-compra", "risco-cambial", "paridade-do-poder-de-compra"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "18:55" },
      { modulo: 0, aula: 2, tempo: "21:18" },
    ],
  },
  {
    slug: "cambio-flutuante",
    termo: "Câmbio flutuante",
    categoria: "Câmbio e moeda",
    apelidos: ["flutuante e sujo", "câmbio passou a flutuar", "câmbio flutua", "flutuação suja", "intervenção cambial", "swap cambial", "swaps cambiais"],
    resumo:
      "Regime em que o preço do dólar é definido pelo mercado, sem um valor fixado pelo governo. No Brasil desde 1999, com o Banco Central intervindo quando acha o movimento exagerado.",
    texto: [
      "Até janeiro de 1999, o Banco Central mantinha o dólar dentro de uma faixa estreita. Quando a faixa caiu, o preço passou a ser decidido todo dia pela oferta e pela procura. Isso é câmbio flutuante, um dos três pés do tripé macroeconômico, ao lado da meta de inflação e da meta de superávit.",
      "Na aula, Felippe usa a expressão flutuante e sujo. Quer dizer que o Banco Central não fixa o preço, mas entra no mercado vendendo dólares das reservas ou oferecendo contratos de proteção, os swaps cambiais, quando o movimento parece descontrolado.",
      "A vantagem do regime é que o câmbio absorve os choques: em vez de o país gastar reservas para defender um preço, o dólar sobe e encarece importações, o que ajuda a reequilibrar as contas externas. A desvantagem, para quem tem tudo em reais, é a volatilidade.",
    ],
    exemplo:
      "Em 13 de janeiro de 1999, o presidente do Banco Central deixou o cargo; dois dias depois, o câmbio passou a flutuar. O dólar saiu de R$ 1,21 em 12 de janeiro e chegou a R$ 2,16 no começo de março.",
    naPratica:
      "Com câmbio flutuante, qualquer notícia que mude a percepção de risco sobre o Brasil aparece no dólar em minutos. O risco cambial não some com o tempo: ele é o preço de um regime que, por outro lado, evita crises como as do câmbio fixo.",
    relacionados: ["cambio-fixo", "desvalorizacao-cambial", "meta-de-inflacao", "risco-cambial", "plano-real"],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "31:42" },
      { modulo: 0, aula: 1, tempo: "18:55" },
    ],
  },
  {
    slug: "cambio-fixo",
    termo: "Câmbio fixo",
    categoria: "Câmbio e moeda",
    apelidos: ["âncora cambial", "banda cambial", "câmbio controlado", "paridade com o dólar", "moeda presa ao dólar", "faixa controlada"],
    resumo:
      "Regime em que o governo prende a moeda a outra, num valor fixo ou dentro de uma faixa. Ajuda a derrubar a inflação, mas exige reservas e juros altos para se sustentar.",
    texto: [
      "Imagine um país com inflação crônica, em que ninguém acredita nas promessas do banco central. Uma saída é amarrar a moeda ao dólar: se um peso vale sempre um dólar, os preços param de subir tanto. O país pega emprestada a reputação de outro banco central. Isso é câmbio fixo, ou âncora cambial.",
      "A versão mais flexível é a banda cambial, uma faixa dentro da qual o preço pode andar. Foi o que o Brasil usou nos primeiros anos do real, com o dólar subindo devagar e sob controle.",
      "A amarra só dura enquanto mantê-la custa menos que soltá-la. Para defender o preço, o banco central gasta reservas e sobe juros. Quando o mercado duvida que ele aguenta, vende a moeda em massa e testa a promessa. O Brasil saiu do regime trocando de regime, em 1999; a Argentina, que tinha paridade de um para um, saiu em 2002 com calote e congelamento de depósitos.",
    ],
    exemplo:
      "Hipotético: um banco central promete o dólar a no máximo R$ 1,20 e tem US$ 30 bilhões em reservas. Se investidores querem trocar US$ 40 bilhões em reais por dólares, ele não tem como honrar todos. A promessa cai, e o preço salta de uma vez.",
    naPratica:
      "Câmbio fixo dá a sensação de que o dólar não é um risco. A história mostra que o risco fica represado e aparece de uma vez, quando o regime acaba. Estabilidade de preço por decreto não é o mesmo que estabilidade de valor.",
    relacionados: ["cambio-flutuante", "plano-real", "desvalorizacao-cambial", "meta-de-inflacao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "12:06" }],
  },
  {
    slug: "risco-cambial",
    termo: "Risco cambial",
    categoria: "Câmbio e moeda",
    apelidos: ["risco da moeda", "risco de moeda", "risco do câmbio", "risco do dólar", "exposição cambial", "risco político e cambial"],
    resumo:
      "A chance de o câmbio mudar e alterar o valor do seu patrimônio medido na moeda em que você vive. Corta para os dois lados.",
    texto: [
      "Você compra US$ 10 mil em ações com o dólar a R$ 5. As ações ficam paradas, mas o dólar cai para R$ 4,50. Em reais, você perdeu R$ 5 mil sem que nada tenha acontecido com as empresas. Esse é o risco cambial.",
      "O risco existe dos dois lados. Quem investe em dólar e gasta em reais corre o risco de o dólar cair. Quem tem tudo em reais e um dia vai precisar de dólar, para estudar, morar fora ou comprar algo com preço global, corre o risco de o dólar subir. Ficar todo numa moeda não elimina o risco cambial: só escolhe um lado dele.",
      "Há também um efeito que joga a favor. O real costuma perder valor justamente quando a economia brasileira vai mal, junto com a bolsa e o emprego. Nessas horas, a parte em dólar tende a amortecer as perdas medidas em reais.",
    ],
    exemplo:
      "Em 2008, o S&P 500 caiu 37% em dólar, mas o dólar subiu de R$ 1,77 para R$ 2,34. Para quem mora no Brasil, a perda em reais foi de cerca de 16%. A moeda amorteceu a queda da bolsa.",
    naPratica:
      "A pergunta útil não é se o dólar vai subir, mas em que moeda estão os seus gastos futuros. Gastos em reais, investimento em dólar: o câmbio oscila contra você às vezes. Gastos em dólar, investimento em reais: o risco é o inverso.",
    relacionados: ["retorno-em-reais", "hedge-cambial", "risco-de-base", "desvalorizacao-cambial", "diversificacao"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "2:00" },
      { modulo: 0, aula: 3, tempo: "22:31" },
    ],
  },
  {
    slug: "retorno-em-reais",
    termo: "Retorno em reais de um ativo em dólar",
    categoria: "Câmbio e moeda",
    apelidos: ["risco duplo", "retorno em reais", "ganho em reais", "S&P mais dólar", "dólar mais S&P"],
    resumo:
      "O resultado em reais de um investimento em dólar junta dois movimentos, o do ativo e o do câmbio. Eles não só se somam: se multiplicam.",
    texto: [
      "Uma ação sobe 10% em dólar e o dólar sobe 10% contra o real. Você ganhou 20%? Não, 21%. A alta do dólar incide sobre um valor que já tinha crescido. É por isso que se diz que ativo e moeda se multiplicam.",
      "A conta vale para baixo também. Ativo subindo 10% e dólar caindo 10% não dão zero: dão 1% de perda. Em movimentos pequenos, a soma simples quase acerta. Em movimentos grandes, a diferença aparece.",
      "Na aula, Marcelo Campos chama isso de risco duplo: quem vive em reais e compra um ativo em dólar carrega dois riscos de uma vez.",
    ],
    exemplo:
      "Uma ação americana sobe 8% num ano. Se o dólar sobe 10% no mesmo período, você ganha perto de 19% em reais. Se o dólar cai 10%, termina com cerca de 3% de prejuízo, mesmo com a ação no azul.",
    naPratica:
      "Ao olhar o desempenho de um investimento lá fora, separe as duas partes: quanto veio do ativo e quanto do câmbio. Num período de dólar forte, tudo parece ótimo em reais; num de real forte, um bom investimento pode parecer ruim.",
    relacionados: ["risco-cambial", "cambio", "hedge-cambial", "sp-500", "juros-compostos"],
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
    apelidos: ["hedge", "proteção cambial", "operação de proteção", "com hedge", "sem hedge", "hedgeado", "hedgeada"],
    resumo:
      "Operação que neutraliza o efeito do câmbio sobre um investimento. Você fica com o resultado do ativo, sem o sobe e desce da moeda, pagando por isso.",
    texto: [
      "Imagine um fundo brasileiro que compra ações americanas e, ao mesmo tempo, vende dólar no mercado futuro na mesma quantia. Se o dólar sobe, o ganho nas ações em reais é compensado pela perda na venda de dólar, e vice-versa. O cotista fica só com o desempenho das ações. Isso é um hedge cambial.",
      "A proteção tem preço. Como o juro no Brasil é bem mais alto que nos Estados Unidos, o dólar futuro é negociado acima do dólar de hoje, e essa diferença entra na conta. Historicamente, isso fez o hedge render algo perto da diferença de juros entre os dois países, a favor ou contra conforme o lado.",
      "Fundos e ETFs que fazem a proteção costumam dizer isso no nome ou no regulamento, às vezes com a palavra hedge.",
    ],
    exemplo:
      "Hipotético: dois fundos compram o mesmo índice americano. Num ano em que o índice sobe 10% e o dólar sobe 15%, o fundo sem hedge ganha perto de 26% em reais; o com hedge fica perto dos 10%, mais ou menos a diferença de juros. Num ano em que o dólar cai 15%, a ordem se inverte.",
    naPratica:
      "Para quem ganha e gasta em reais, boa parte da proteção que o exterior oferece vem da própria moeda. Fazer hedge de todo o câmbio elimina justamente essa parte. A escolha entre com e sem hedge depende do motivo de investir lá fora.",
    relacionados: ["risco-cambial", "dolar-futuro", "paridade-de-juros", "retorno-em-reais", "diversificacao"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "2:00" }],
  },
  {
    slug: "dolar-futuro",
    termo: "Dólar futuro",
    categoria: "Câmbio e moeda",
    apelidos: ["contrato futuro de dólar", "mercado futuro de dólar", "minidólar", "mercado futuro", "contratos futuros"],
    resumo:
      "Contrato negociado na B3 que fixa hoje o preço do dólar numa data futura. É a ferramenta mais usada para proteger ou apostar no câmbio.",
    texto: [
      "Um importador sabe que vai pagar US$ 1 milhão daqui a três meses e não quer correr o risco de o dólar disparar. Ele compra dólar futuro: trava hoje o preço que vai valer no vencimento. Se o dólar subir, o ganho no contrato compensa a conta mais cara. Se cair, ele perde no contrato, mas paga menos ao fornecedor.",
      "O preço do dólar futuro não é uma previsão do mercado. É o dólar de hoje corrigido pela diferença de juros entre os dois países. Com juro mais alto no Brasil, o futuro fica acima do dólar à vista; é a mesma lógica da paridade de juros.",
      "Na B3, há o contrato cheio e o minicontrato, menor, usado também por pessoas físicas. Os contratos exigem margem de garantia e têm ajuste diário: ganhos e perdas caem na conta todo dia.",
    ],
    exemplo:
      "Hipotético: dólar à vista a R$ 5,00, juro de 14% ao ano aqui e de 4% lá. O dólar para daqui a um ano sai por perto de R$ 5,48. Não porque alguém espera esse preço, mas porque é o valor que impede ganhar dinheiro sem risco com a diferença de juros.",
    naPratica:
      "Para a maioria dos investidores, o dólar futuro aparece de forma indireta: é o que fundos com hedge e fundos cambiais usam por dentro. Saber que ele embute a diferença de juros explica por que esses fundos rendem diferente do dólar à vista.",
    relacionados: ["hedge-cambial", "paridade-de-juros", "fundo-cambial", "carry-trade"],
  },
  {
    slug: "paridade-do-poder-de-compra",
    termo: "Paridade do poder de compra",
    sigla: "PPC",
    categoria: "Câmbio e moeda",
    apelidos: ["paridade de poder de compra", "lei do preço único", "índice Big Mac", "PPP"],
    resumo:
      "A ideia de que, no longo prazo, a moeda do país com mais inflação tende a perder valor na medida da diferença de inflação entre os dois países.",
    texto: [
      "Se um tênis custa US$ 100 em Nova York e R$ 300 em São Paulo, com o dólar a R$ 5, alguém vai comprar aqui e vender lá até os preços se aproximarem. Essa é a lei do preço único. Levada para todos os preços da economia, vira a paridade do poder de compra.",
      "A versão útil é a de longo prazo: se os preços sobem 10% aqui e 2% lá, o dólar tende a ficar perto de 8% mais caro. No curto prazo, o câmbio pode passar anos longe dessa linha, empurrado por juros, fluxos de capital e medo.",
      "A revista The Economist popularizou a ideia com o índice Big Mac, que compara o preço do sanduíche em vários países para dizer quais moedas parecem caras ou baratas.",
    ],
    exemplo:
      "De 1995 a 2025, os preços no Brasil subiram 6,4 vezes e, nos Estados Unidos, 2,1 vezes. Só essa diferença levaria o dólar de R$ 0,92 para cerca de R$ 2,78. Ele foi a R$ 5,59: o resto foi perda real do real, concentrada nas crises.",
    naPratica:
      "Ficar todo em reais amarra o poder de compra do seu patrimônio lá fora à inflação brasileira e aos solavancos do dólar. A PPC não serve para prever o câmbio do ano que vem, mas explica por que, em décadas, a moeda de inflação mais alta costuma perder.",
    relacionados: ["inflacao", "paridade-de-juros", "desvalorizacao-cambial", "poder-de-compra", "cpi"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:21:02" }],
  },
  {
    slug: "paridade-de-juros",
    termo: "Paridade de juros",
    categoria: "Câmbio e moeda",
    apelidos: ["paridade coberta de juros", "paridade descoberta de juros", "diferença de juros", "diferencial de juros"],
    resumo:
      "O ponto em que uma aplicação em reais e outra em dólar rendem o mesmo quando medidas na mesma moeda: o dólar precisa subir o suficiente para cobrir a diferença de juros.",
    texto: [
      "Para comparar um CDB com um título americano, você precisa medir os dois em reais. A aplicação lá fora rende o juro americano mais o que o dólar subir. As duas empatam quando o dólar sobe exatamente a diferença de juros. Esse empate é a paridade.",
      "Há duas versões. A coberta usa o preço do dólar futuro, que o mercado fixa hoje; ela vale quase sempre, porque qualquer desvio daria lucro sem risco. A descoberta usa a expectativa sobre o dólar de amanhã, e na vida real falha muito: o câmbio se afasta da conta por anos.",
      "A diferença de juros entre Brasil e Estados Unidos mistura duas coisas: a desvalorização do real que o mercado espera e um prêmio por emprestar a um país mais arriscado.",
    ],
    exemplo:
      "Com a Selic a 13,75% e o juro americano em 4%, o dólar precisaria subir cerca de 9,4% ao ano para a aplicação lá fora empatar com a daqui, antes de impostos e custos.",
    naPratica:
      "Juro alto em reais não é um presente: é o preço do risco de ficar em reais. Quem fica todo aqui aposta, sem dizer, que o real vai perder menos que a diferença de juros. Quem vai para fora aceita ganhar menos juro em troca de diversificar a moeda.",
    relacionados: ["carry-trade", "dolar-futuro", "selic", "fed-funds", "risco-pais"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "26:22" }],
  },
  {
    slug: "carry-trade",
    termo: "Carry trade",
    categoria: "Câmbio e moeda",
    apelidos: ["operação de carry", "carry", "dinheiro de curto prazo"],
    resumo:
      "Tomar dinheiro emprestado onde o juro é baixo e aplicar onde é alto, ganhando a diferença enquanto o câmbio não vira contra. O Brasil é um destino clássico.",
    texto: [
      "Um fundo estrangeiro toma dólares a 4% ao ano, converte em reais e aplica a 14%. Se o câmbio ficar parado, embolsa perto de 10 pontos por ano. Essa é a operação de carry trade, e o real, por ter um dos juros mais altos do mundo, é uma das moedas preferidas para ela.",
      "O risco está no câmbio. Se o real cair 15% num susto, o ganho de um ano inteiro some em semanas. Por isso o carry costuma render devagar e perder rápido: quando o medo aparece no mundo, todo mundo tenta sair ao mesmo tempo, e a moeda de juro alto despenca.",
      "Esse vaivém ajuda a explicar por que o real costuma cair justamente nas crises globais, como em 2008 e em 2020, e por que um corte forte de juros, como o de 2020, pode pesar no dólar.",
    ],
    exemplo:
      "Em 2020, com a Selic a 2% e juro real negativo, o Brasil perdeu o atrativo para esse dinheiro de curto prazo. O dólar, que começara o ano a R$ 4,02, chegou a R$ 5,94 em maio.",
    naPratica:
      "Parte do fluxo que sustenta o real é dinheiro que vai embora no primeiro susto. É mais uma razão por que o câmbio brasileiro oscila tanto, e por que o patrimônio todo em reais fica exposto aos humores do mundo.",
    relacionados: ["paridade-de-juros", "selic", "juro-real", "cambio-flutuante", "desvalorizacao-cambial"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:22:05" }],
  },
  {
    slug: "moeda-de-reserva",
    termo: "Moeda de reserva",
    categoria: "Câmbio e moeda",
    apelidos: ["moeda de referência global", "moeda de reserva global", "moeda central", "moeda forte", "moedas fortes"],
    resumo:
      "A moeda que bancos centrais guardam como reserva e que o mundo usa para cotar e liquidar comércio e dívidas. Desde Bretton Woods, é o dólar.",
    texto: [
      "Carne, soja, minério e petróleo são cotados em dólar no mundo inteiro, mesmo quando nem o vendedor nem o comprador são americanos. Bancos centrais guardam a maior parte das reservas em dólar. Isso é ser moeda de reserva.",
      "O posto foi da libra esterlina até a primeira metade do século 20 e passou ao dólar com os acordos de Bretton Woods, em 1944. O dólar responde por mais da metade das reservas dos bancos centrais e aparece num dos lados de quase nove em cada dez operações de câmbio do mundo, segundo levantamentos do FMI e do BIS.",
      "Ser a moeda de reserva dá aos Estados Unidos uma vantagem: o mundo precisa de dólares e compra títulos do Tesouro americano, o que ajuda o país a se financiar mais barato.",
    ],
    exemplo:
      "Uma empresa brasileira que vende minério à China provavelmente fecha o contrato em dólar. Quando o dólar sobe, a receita dela em reais sobe junto, mesmo que nenhum americano tenha participado do negócio.",
    naPratica:
      "Dolarizar não é apostar nos Estados Unidos: é ter parte do patrimônio na moeda em que boa parte do mundo cobra e paga. Se um dia o dólar perder o posto, o hábito de medir tudo numa moeda central continua.",
    relacionados: ["bretton-woods", "dolarizacao", "treasury", "funcoes-da-moeda", "ouro"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "3:49" }],
  },
  {
    slug: "funcoes-da-moeda",
    termo: "Funções da moeda",
    categoria: "Câmbio e moeda",
    apelidos: ["três funções da moeda", "três funções", "unidade de conta", "meio de troca", "reserva de valor"],
    resumo:
      "Moeda serve para três coisas: ser a régua dos preços (unidade de conta), o meio de pagar (meio de troca) e um lugar para guardar poder de compra (reserva de valor).",
    texto: [
      "Pense no que você faz com dinheiro. Você compara preços nele, paga com ele e guarda nele. São as três funções da moeda: unidade de conta, meio de troca e reserva de valor.",
      "Com inflação alta, as funções se separam. Nos anos 1980, o brasileiro pagava o pão em cruzeiros, mas guardava valor em dólar ou em aplicações de um dia, e reajustava contratos por índices. O cruzeiro continuava meio de troca, mas tinha deixado de ser reserva de valor.",
      "O Plano Real usou essa separação de propósito. Em 1994, a URV passou a ser a unidade de conta por quatro meses, enquanto os pagamentos continuavam em cruzeiros reais. Quando a régua já estava aceita, ela virou a moeda nova.",
    ],
    exemplo:
      "Hipotético: num mês de inflação de 30%, quem recebe o salário no dia 1 corre para o supermercado, porque no fim do mês o mesmo dinheiro compra 23% menos. A moeda ainda paga as compras, mas não guarda valor.",
    naPratica:
      "Quando a aula fala em dolarizar, fala de buscar a moeda que cumpre melhor as três funções ao mesmo tempo. Para o investidor, a que mais importa é a reserva de valor, e ela vem dos ativos que geram renda, não da nota parada.",
    relacionados: ["moeda-de-reserva", "inflacao", "plano-real", "poder-de-compra", "dolarizacao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "9:02" }],
  },
  {
    slug: "dolarizacao",
    termo: "Dolarização",
    categoria: "Câmbio e moeda",
    apelidos: ["dolarizar", "dolarizado", "dolarizada", "dolarização do patrimônio", "dinheiro dolarizado", "fatia em dólar"],
    resumo:
      "No sentido do curso, ter parte do patrimônio em ativos fora do Brasil, cotados em dólar ou em outras moedas fortes. Não é guardar nota de dólar nem torcer contra o país.",
    texto: [
      "A palavra tem dois sentidos. Em economia, dolarização é um país adotar o dólar no lugar da própria moeda, como fizeram Equador e El Salvador. No curso, é uma decisão de investidor: deixar parte do patrimônio em ativos de fora, em vez de 100% em reais e em empresas e títulos brasileiros.",
      "Felippe insiste num ponto: dolarizar não é comprar dólar e guardar no colchão. O dólar também perde poder de compra com a inflação americana. É ter ações, títulos, imóveis e outros ativos que geram renda lá fora, e não só nos Estados Unidos.",
      "Quanto dolarizar é uma decisão pessoal, e zero é uma resposta legítima. O que o curso discute é por que deixar tudo numa moeda e numa economia já é uma aposta concentrada.",
    ],
    exemplo:
      "Quem comprou dólar no fim de 2002 e deixou parado até o fim de 2010 perdeu cerca de 70% do poder de compra em reais: o dólar caiu 53% e os preços no Brasil subiram 57%. Dólar parado protege contra a moeda, não contra a inflação.",
    naPratica:
      "Pense na dolarização como diversificação do patrimônio inteiro, que inclui salário, imóvel e aposentadoria em reais. A pergunta é quanto você quer depender de uma única economia, e em que moeda estão os seus gastos futuros.",
    relacionados: ["diversificacao", "risco-de-concentracao", "moeda-de-reserva", "home-bias", "alocacao-de-ativos"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "3:49" },
      { modulo: 0, aula: 4, tempo: "0:12" },
    ],
  },
  {
    slug: "ouro",
    termo: "Ouro",
    categoria: "Câmbio e moeda",
    apelidos: ["ETF de ouro", "ETFs de ouro", "barras de ouro"],
    resumo:
      "O metal que serviu de lastro às moedas por séculos e hoje é guardado por bancos centrais e investidores como reserva de valor. Não paga juros nem dividendos.",
    texto: [
      "Durante séculos, ter dinheiro era ter um direito sobre ouro. Esse lastro acabou em 1971, quando os Estados Unidos deixaram de trocar dólares por ouro, mas o metal continuou nas reservas dos bancos centrais, que nos últimos anos compraram ouro em ritmo recorde.",
      "Para o investidor, o ouro é um ativo sem renda: não paga cupom nem dividendo. O retorno vem só da variação de preço, cotado em dólar. Ele costuma ser procurado em momentos de medo, inflação alta ou desconfiança das moedas, e pode passar longos períodos parado ou caindo.",
      "Hoje dá para ter ouro por ETFs. O primeiro do mundo estreou na Austrália em 2003; na B3, o primeiro chegou em 2020, e o primeiro lastreado em barras de verdade, em 2025.",
    ],
    exemplo:
      "Hipotético: o ouro está a US$ 2.000 a onça e o dólar a R$ 5. Se o metal sobe 10% e o dólar fica parado, você ganha 10% em reais. Como é cotado em dólar, o ouro carrega também o risco cambial para quem mede em reais.",
    naPratica:
      "O ouro é uma forma de ter um ativo fora do sistema de uma moeda só, mas sem renda. A distância de quase duas décadas entre o primeiro ETF de ouro do mundo e o primeiro na B3 é, na aula, um sinal de como o investidor brasileiro chega tarde a certos instrumentos.",
    relacionados: ["moeda-de-reserva", "etf", "bretton-woods", "bitcoin", "funcoes-da-moeda"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "23:49" }],
  },
  // ==== JUROS E INFLAÇÃO ========================================================================
  {
    slug: "juros-compostos",
    termo: "Juros compostos",
    categoria: "Juros e inflação",
    apelidos: ["juro composto", "juros sobre juros", "capitalização composta"],
    resumo:
      "Juro que rende sobre o juro já ganho. No começo parece pouco; com o tempo, é a força que mais pesa no resultado de quem investe, e de quem deve.",
    texto: [
      "Você aplica R$ 1.000 a 10% ao ano. No primeiro ano ganha R$ 100. No segundo, ganha 10% sobre R$ 1.100, ou R$ 110. No terceiro, R$ 121. O juro de cada ano incide sobre tudo o que já se acumulou. Isso é juro composto.",
      "A diferença para o juro simples, que rende sempre sobre o valor inicial, é pequena em prazos curtos e enorme em prazos longos. Em 30 anos, a 10% ao ano, R$ 1.000 viram cerca de R$ 17.400 com juros compostos, contra R$ 4.000 com juros simples.",
      "A mesma lógica funciona contra você: numa dívida, no custo de uma taxa de administração cobrada todo ano ou na inflação, que corrói o poder de compra mês após mês, também sobre o que já foi corroído.",
    ],
    exemplo:
      "Hipotético: dois investidores aplicam R$ 100 mil por 20 anos. Um rende 8% ao ano; o outro, 7%, porque paga 1 ponto a mais de taxa. No fim, o primeiro tem cerca de R$ 466 mil, e o segundo, R$ 387 mil. Um ponto por ano virou quase R$ 80 mil.",
    naPratica:
      "Juros compostos explicam por que o retorno em reais de um ativo em dólar não é a soma dos dois ganhos, por que custos baixos importam tanto e por que tempo investido costuma valer mais que acertar o momento.",
    relacionados: ["regra-dos-72", "valor-presente", "juro-real", "taxa-de-administracao", "retorno-em-reais"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "23:49" }],
  },
  {
    slug: "regra-dos-72",
    termo: "Regra dos 72",
    categoria: "Juros e inflação",
    apelidos: ["tempo para dobrar", "anos para dobrar", "dobra em", "para dobrar"],
    resumo:
      "Atalho de cabeça: divida 72 pela taxa de juros anual e você tem, mais ou menos, quantos anos um valor leva para dobrar.",
    texto: [
      "Quanto tempo R$ 10 mil levam para virar R$ 20 mil a 8% ao ano? Divida 72 por 8: cerca de nove anos. É a regra dos 72, uma aproximação dos juros compostos que funciona bem para taxas entre 2% e 20% ao ano.",
      "Serve para qualquer coisa que cresça a uma taxa constante: um investimento, uma dívida, os preços numa inflação. E ao contrário: se os preços sobem 6% ao ano, o seu dinheiro parado perde metade do poder de compra em uns 12 anos.",
    ],
    exemplo:
      "A 13,75% ao ano, a Selic de setembro de 2026, um capital dobra em pouco mais de cinco anos. A 4%, perto do juro básico americano, leva quase 18. Em 2002, com um custo de 27% ao ano somando juro americano e risco-país, uma dívida dobrava em menos de três.",
    naPratica:
      "A regra ajuda a sentir o peso das taxas. Juro alto dobra o dinheiro rápido, mas também mostra quanto o mercado cobra para carregar o risco do país. E ajuda a ver o estrago da inflação sobre dinheiro parado, em reais ou em dólar.",
    relacionados: ["juros-compostos", "selic", "inflacao", "poder-de-compra"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "23:49" },
      { modulo: 0, aula: 2, tempo: "44:20" },
    ],
  },
  {
    slug: "valor-presente",
    termo: "Valor presente",
    categoria: "Juros e inflação",
    apelidos: ["valor de hoje", "a valor de hoje", "trazido a valor de hoje", "trazidos a valor de hoje", "trazidos para valores de hoje", "taxa de desconto"],
    resumo:
      "Quanto vale hoje um dinheiro que só vai chegar no futuro. Você acha descontando o valor futuro pelos juros do período.",
    texto: [
      "Alguém te oferece R$ 1.100 daqui a um ano. Se você consegue 10% ao ano numa aplicação segura, isso vale o mesmo que R$ 1.000 hoje, porque R$ 1.000 aplicados virariam R$ 1.100. Esses R$ 1.000 são o valor presente.",
      "É o caminho inverso dos juros compostos, e é a base de quase toda conta de finanças: preço de título, valor de empresa, quanto vale uma aposentadoria. Quanto mais longe o dinheiro e mais alta a taxa, menos ele vale hoje.",
      "A taxa usada para trazer o futuro a hoje se chama taxa de desconto. Ela embute o juro sem risco e um prêmio pelo risco de o dinheiro não chegar.",
    ],
    exemplo:
      "R$ 120 mil por ano durante 25 anos, trazidos a valor de hoje com juro de 5% ao ano, valem cerca de R$ 1,7 milhão. É a conta do capital humano da aula 1.",
    naPratica:
      "Valor presente explica por que títulos longos e ações de empresas que vão lucrar só no futuro caem mais quando os juros sobem: o dinheiro de amanhã passa a valer menos hoje.",
    relacionados: ["juros-compostos", "fluxo-de-caixa-descontado", "duration", "capital-humano", "marcacao-a-mercado"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "9:00" }],
  },
  {
    slug: "juro-nominal",
    termo: "Juro nominal",
    categoria: "Juros e inflação",
    apelidos: ["juros nominais", "taxa nominal", "retorno nominal", "retornos nominais"],
    resumo:
      "A taxa que aparece no contrato ou no extrato, sem descontar a inflação. Diz quanto o número cresceu, não quanto o seu poder de compra cresceu.",
    texto: [
      "Um CDB promete 12% ao ano. Esses 12% são o juro nominal: em reais, R$ 100 viram R$ 112. Se a inflação do ano foi de 5%, porém, as coisas que você compra também ficaram mais caras, e o ganho de verdade foi menor.",
      "Quase toda taxa divulgada é nominal: Selic, CDI, cupom de título, rendimento de fundo. Para saber o ganho real, é preciso descontar a inflação do período.",
    ],
    exemplo:
      "Hipotético: em 1993, uma aplicação que rendesse 2.000% no ano parecia um sucesso. Com inflação de 2.477%, quem aplicou terminou o ano mais pobre.",
    naPratica:
      "Ao comparar Brasil e exterior, não compare só taxas nominais. Uma Selic de 13,75% e um juro americano de 4% vêm de inflações e riscos diferentes. O que importa é o ganho real e o risco de cada lado.",
    relacionados: ["juro-real", "inflacao", "selic", "cdi"],
  },
  {
    slug: "juro-real",
    termo: "Juro real",
    categoria: "Juros e inflação",
    apelidos: ["juros reais", "juro real negativo", "conta de Fisher", "equação de Fisher", "juro já descontada a inflação", "ganho real"],
    resumo:
      "O juro que sobra depois de descontar a inflação: quanto o seu dinheiro passa a comprar a mais. A conta certa divide, em vez de subtrair.",
    texto: [
      "Uma aplicação paga 21% num ano em que a inflação foi de 10%. Quanto você ganhou de verdade? A conta de cabeça diz 11%. A certa diz 10%: no fim do ano você tem 121 para comprar o que agora custa 110, e 121 é 10% a mais que 110.",
      "Juro real é isso, quanto o seu dinheiro compra a mais. A ideia leva o nome do economista americano Irving Fisher. Com inflação baixa, a subtração quase acerta; com inflação alta, a diferença cresce.",
      "O juro real pode ser negativo: quando a aplicação rende menos que a inflação, você perde poder de compra mesmo vendo o saldo crescer.",
    ],
    exemplo:
      "Com Selic de 14,25% e inflação de 4,5%, o juro real era de 9,33% ao ano, e não os 9,75% da subtração. Na pandemia, Selic de 2% com inflação de 4,5% dava juro real negativo, de −2,4%.",
    naPratica:
      "O juro real brasileiro está entre os mais altos do mundo, e é ele que segura muita gente em reais. Mas ele é a remuneração pelo risco do país, não um ganho de graça. A mesma conta vale para o dólar parado: se ele sobe menos que a inflação daqui, você perde poder de compra em reais.",
    relacionados: ["juro-nominal", "inflacao", "selic", "tesouro-ipca", "carry-trade"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:03:56" }],
  },
  {
    slug: "inflacao",
    termo: "Inflação",
    categoria: "Juros e inflação",
    apelidos: ["inflações", "alta dos preços", "alta de preços", "inflação brasileira", "inflação alta"],
    resumo:
      "A alta generalizada dos preços ao longo do tempo. Cada ponto de inflação é um pedaço do poder de compra do seu dinheiro que vai embora.",
    texto: [
      "Com R$ 100 você enchia um carrinho de supermercado. Um ano depois, o mesmo carrinho custa R$ 105. Os preços subiram 5%: isso é inflação. Não é um produto ficando caro, é o conjunto dos preços subindo.",
      "Ela é medida por índices que acompanham uma cesta de produtos e serviços, como o IPCA no Brasil e o CPI nos Estados Unidos. Um pouco de inflação é normal numa economia que cresce; o problema é quando ela é alta, imprevisível ou fora de controle.",
      "O Brasil conhece o extremo. Entre o fim de 1979 e junho de 1994, os preços subiram cerca de 11 trilhões por cento pelo IPCA. Em 1993, último ano inteiro antes do real, dobravam a cada dois meses e meio.",
    ],
    exemplo:
      "Pense em R$ 1 em julho de 1994: para comprar a mesma coisa em 2026, você precisa de cerca de R$ 8,30. Nos Estados Unidos, os preços subiram 126% no mesmo período: uma nota de dólar guardada desde 1994 compra menos da metade do que comprava.",
    naPratica:
      "Nenhuma moeda parada escapa da inflação, nem o dólar. Por isso dolarizar, no sentido do curso, é ter ativos que geram renda e acompanham os preços, e não dinheiro guardado.",
    relacionados: ["ipca", "cpi", "poder-de-compra", "juro-real", "meta-de-inflacao", "plano-real"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "9:48" },
      { modulo: 0, aula: 2, tempo: "0:19" },
    ],
  },
  {
    slug: "poder-de-compra",
    termo: "Poder de compra",
    categoria: "Juros e inflação",
    apelidos: ["perda de poder de compra", "taxa de desvalorização da moeda", "desvalorização da moeda", "perda do poder de compra"],
    resumo:
      "Quanto o seu dinheiro consegue comprar. Quando os preços dobram, a inflação foi de 100%, mas o dinheiro perdeu metade do poder de compra, e não 100%.",
    texto: [
      "Imagine que os preços dobraram. A inflação foi de 100%, mas o seu dinheiro não perdeu 100%: perdeu metade, porque agora compra a metade do que comprava. Essa perda é a taxa de desvalorização da moeda.",
      "Ela é sempre menor que a inflação e nunca chega a 100%, mas se aproxima disso bem depressa quando a inflação dispara. Por isso 733% de alta dos preços equivalem a 88% de perda do poder de compra.",
    ],
    exemplo:
      "Em março de 1990, o pior mês do IPCA, a inflação de 82% levou 45% do poder de compra de quem tinha dinheiro parado. Em 1993, com 2.477% no ano, a perda foi de 96%.",
    naPratica:
      "A mesma lógica vale para o câmbio: se o dólar dobra, o seu patrimônio em reais passa a valer metade em dólar. Poder de compra é a medida que interessa, em qualquer moeda.",
    relacionados: ["inflacao", "desvalorizacao-cambial", "juro-real", "funcoes-da-moeda"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:57" }],
  },
  {
    slug: "ipca",
    termo: "IPCA",
    categoria: "Juros e inflação",
    apelidos: ["Índice Nacional de Preços ao Consumidor Amplo", "índice oficial de inflação", "inflação oficial", "IPCA+"],
    resumo:
      "O índice oficial de inflação do Brasil, calculado pelo IBGE todo mês. É a referência da meta de inflação e de títulos como o Tesouro IPCA+.",
    texto: [
      "Todo mês, o IBGE pesquisa preços de alimentos, aluguel, transporte, saúde, educação e centenas de outros itens nas principais regiões do país, e calcula quanto a cesta ficou mais cara. O resultado é o IPCA, Índice Nacional de Preços ao Consumidor Amplo.",
      "A cesta representa o consumo de famílias com renda entre 1 e 40 salários mínimos. O índice existe desde o fim de 1979 e, desde 1999, é o que o Banco Central usa para a meta de inflação.",
      "Como toda média, o IPCA pode não bater com a sua inflação pessoal: quem gasta mais com saúde e educação, por exemplo, costuma sentir preços diferentes.",
    ],
    exemplo:
      "Um título que paga IPCA + 6% ao ano, num ano de IPCA de 4%, rende perto de 10,2% nominal: os 4% repõem os preços e os 6% são o ganho real.",
    naPratica:
      "O IPCA é a régua para saber se o seu patrimônio em reais está ganhando ou perdendo poder de compra aqui. Para comparar com o dólar, o par é o CPI americano.",
    relacionados: ["inflacao", "meta-de-inflacao", "tesouro-ipca", "igp-m", "cpi"],
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
    resumo:
      "Índice de inflação da FGV, muito usado para reajustar aluguéis e contratos. Pesa bastante os preços no atacado, muitos deles cotados em dólar.",
    texto: [
      "Se você mora de aluguel, provavelmente já viu o contrato ser reajustado pelo IGP-M. Criado pela Fundação Getulio Vargas em 1989, ele mistura três índices: preços no atacado (60%), ao consumidor (30%) e da construção (10%).",
      "Por pesar tanto o atacado, onde estão commodities como minério, soja e petróleo, o IGP-M sobe muito quando o dólar dispara e pode cair quando ele recua. Em anos de câmbio agitado, ele se descola bastante do IPCA. O IGP-DI é o irmão dele, com a mesma composição e outro período de coleta.",
    ],
    exemplo:
      "De janeiro de 1980 a junho de 1994, pelo IGP-DI, os preços subiram 14 trilhões por cento; pelo IPCA, 11 trilhões. Índices diferentes, mesma ordem de grandeza.",
    naPratica:
      "O IGP-M mostra como o dólar contamina preços no Brasil, de aluguel a matéria-prima. É mais uma porta pela qual o câmbio entra na sua vida, mesmo sem nenhum investimento lá fora.",
    relacionados: ["ipca", "inflacao", "cambio", "desvalorizacao-cambial"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "9:48" }],
  },
  {
    slug: "cpi",
    termo: "CPI",
    categoria: "Juros e inflação",
    apelidos: ["inflação americana", "inflação ao consumidor, EUA", "CPI-U", "PCE", "inflação nos Estados Unidos"],
    resumo:
      "O índice de preços ao consumidor dos Estados Unidos, calculado pelo Bureau of Labor Statistics. É o par do IPCA do lado de lá.",
    texto: [
      "O Consumer Price Index, ou CPI, faz nos Estados Unidos o que o IPCA faz aqui: mede quanto ficou mais cara uma cesta de consumo. É divulgado todo mês e move juros, dólar e bolsas no mundo inteiro.",
      "O Fed acompanha de perto outro índice, o PCE, que mede os gastos de consumo de forma mais ampla, e persegue uma meta de 2% ao ano por ele. Os dois costumam andar juntos.",
      "Os americanos também tiveram sua década de inflação alta: perto de 15% ao ano em 1980, o que levou o Fed de Paul Volcker a subir os juros para perto de 20%.",
    ],
    exemplo:
      "De julho de 1994 a agosto de 2026, os preços nos Estados Unidos subiram 126%, contra cerca de 733% no Brasil. É essa diferença que a paridade do poder de compra usa para explicar parte da alta do dólar.",
    naPratica:
      "O dólar também perde valor. Um investimento em dólar precisa render acima do CPI para preservar o poder de compra lá fora, assim como um em reais precisa vencer o IPCA.",
    relacionados: ["inflacao", "ipca", "fed", "tips", "paridade-do-poder-de-compra"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "12:31" }],
  },
  {
    slug: "selic",
    termo: "Selic",
    categoria: "Juros e inflação",
    apelidos: ["taxa Selic", "meta Selic", "meta da Selic", "juro básico", "juros básicos", "taxa básica de juros"],
    resumo:
      "A taxa básica de juros do Brasil, definida pelo Copom. Serve de referência para quase todo o resto: CDI, poupança, crédito e títulos pós-fixados.",
    texto: [
      "Quando o Banco Central quer esfriar a inflação, sobe a Selic; quando quer estimular a economia, corta. A taxa é a referência das operações de um dia entre bancos com títulos públicos, registradas no sistema que dá nome a ela, o Sistema Especial de Liquidação e de Custódia.",
      "A meta é decidida pelo Copom, em oito reuniões por ano. A partir dela se formam o CDI, o rendimento do Tesouro Selic e boa parte do custo do crédito no país.",
      "A Selic brasileira é historicamente alta. Foi de 14,25% a 2% entre 2016 e 2020, voltou a 15% no ciclo seguinte e estava em 13,75% em setembro de 2026, contra um juro básico americano perto de 4%.",
    ],
    exemplo:
      "Hipotético: com a Selic a 13,75%, um título pós-fixado que acompanha a taxa rende perto de 1,1% ao mês. É esse rendimento estável que faz muita gente achar que não precisa olhar para fora.",
    naPratica:
      "A Selic alta não é um presente para o poupador: é o preço de carregar o risco do país. E o rendimento que ela paga é em reais. Comparar Selic com juro americano sem olhar câmbio e risco é comparar números que medem coisas diferentes.",
    relacionados: ["copom", "cdi", "pos-fixado", "tesouro-selic", "paridade-de-juros", "fed-funds"],
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
    apelidos: ["taxa DI", "certificado de depósito interbancário", "100% do CDI", "rendimento do CDI"],
    resumo:
      "A taxa dos empréstimos de um dia entre bancos, calculada pela B3. Anda colada na Selic e é a régua com que o brasileiro mede quase todo investimento.",
    texto: [
      "Todo dia, bancos emprestam dinheiro uns aos outros por um dia. A taxa média dessas operações é o CDI, ou taxa DI, calculada pela B3. Na prática, fica pouquinho abaixo da Selic e acompanha cada mudança dela.",
      "Daí vem o hábito de dizer que um CDB paga 100% do CDI ou que um fundo rendeu 110% do CDI. É uma régua prática para investimentos pós-fixados em reais, que rendem um pouco todo dia sem grandes sustos no extrato.",
      "Essa estabilidade tem outra face. O CDI mede um rendimento em reais; não mede o risco de crédito de quem emitiu o título, nem quanto o seu patrimônio vale em dólar.",
    ],
    exemplo:
      "De 2010 a 2025, o CDI acumulou 340%, ou 9,7% ao ano. No mesmo período, uma carteira americana 60/40 medida em reais rendeu cerca de 15,2% ao ano, numa janela favorável ao dólar; em outras janelas, a vantagem foi bem menor.",
    naPratica:
      "Comparar tudo com o CDI é natural para o brasileiro, mas pode enganar: ele é uma taxa de curto prazo em reais. Para uma parte do patrimônio pensada para décadas e para outra moeda, a régua precisa incluir o câmbio e o risco de cada lado.",
    relacionados: ["selic", "pos-fixado", "cdb", "fundo-di", "risco-de-credito"],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "17:57" },
      { modulo: 0, aula: 4, tempo: "22:22" },
    ],
  },
  {
    slug: "copom",
    termo: "Copom",
    categoria: "Juros e inflação",
    apelidos: ["Comitê de Política Monetária", "reunião do Copom", "reuniões do Copom"],
    resumo:
      "O comitê do Banco Central que decide a meta da Selic, em oito reuniões por ano. As decisões e as atas movem juros, câmbio e bolsa.",
    texto: [
      "A cada 45 dias, mais ou menos, o presidente e os diretores do Banco Central se reúnem por dois dias e anunciam a nova meta da Selic. É o Copom, Comitê de Política Monetária, criado em 1996.",
      "O comitê olha inflação, expectativas, atividade, câmbio e contas públicas para decidir se sobe, mantém ou corta os juros. Uma semana depois, publica a ata, lida linha por linha pelo mercado em busca de pistas sobre os próximos passos.",
    ],
    exemplo:
      "Em 2020, com a inflação medida em queda no auge do isolamento, o Copom levou a Selic de 4,5% a 2%. O dólar, que começara o ano a R$ 4,02, chegou a R$ 5,94 em maio. A partir de março de 2021, o comitê voltou a subir os juros.",
    naPratica:
      "Uma decisão do Copom mexe de uma vez no rendimento do pós-fixado, no preço dos títulos prefixados, no câmbio e na bolsa. É um exemplo de como uma única caneta afeta todo o patrimônio que está em reais.",
    relacionados: ["selic", "meta-de-inflacao", "fed", "cdi"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:11:50" }],
  },
  {
    slug: "fed",
    termo: "Federal Reserve",
    sigla: "Fed",
    categoria: "Juros e inflação",
    apelidos: ["banco central dos Estados Unidos", "banco central americano", "FOMC", "juros do Fed"],
    resumo:
      "O banco central dos Estados Unidos. Define o juro básico americano e, com isso, mexe no custo do dinheiro do mundo inteiro.",
    texto: [
      "Criado em 1913, o Federal Reserve tem um mandato duplo: buscar o máximo emprego e preços estáveis, o que hoje significa inflação de 2% ao ano. Quem decide os juros é o FOMC, um comitê de 12 votantes que se reúne oito vezes por ano.",
      "Como o dólar é a moeda de reserva do mundo, o que o Fed faz não fica nos Estados Unidos. Juro americano mais alto atrai dinheiro para títulos do Tesouro de lá e tende a fortalecer o dólar contra moedas emergentes, como o real.",
      "Dois episódios ajudam a entender o alcance do Fed. No começo dos anos 1980, Paul Volcker levou os juros para perto de 20% para matar a inflação, e a conta chegou à América Latina endividada em dólar. Em 2008, Ben Bernanke cortou os juros a quase zero e passou a comprar títulos em massa.",
    ],
    exemplo:
      "Em setembro de 2026, o Fed mantinha o juro básico na faixa de 3,75% a 4% ao ano, enquanto a Selic estava em 13,75%. A diferença entre os dois é uma das forças que movem o câmbio.",
    naPratica:
      "Para quem investe em dólar, o Fed define quanto rende o caixa e os títulos curtos lá fora e influencia o preço de títulos longos e ações. Para quem fica no Brasil, ele mexe no dólar e no apetite por emergentes.",
    relacionados: ["fed-funds", "afrouxamento-quantitativo", "treasury", "cpi", "copom"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "4:02" }],
  },
  {
    slug: "fed-funds",
    termo: "Fed funds",
    categoria: "Juros e inflação",
    apelidos: ["juro básico americano", "juro básico nos EUA", "juro americano", "juros americanos", "taxa dos Fed funds", "federal funds rate"],
    resumo:
      "O juro básico dos Estados Unidos: a taxa dos empréstimos de um dia entre bancos, para a qual o Fed define uma faixa-alvo. É o equivalente americano da Selic.",
    texto: [
      "Bancos americanos emprestam reservas uns aos outros de um dia para o outro. A taxa dessas operações se chama federal funds rate. O Fed não a fixa diretamente: anuncia uma faixa-alvo de um quarto de ponto, como 3,75% a 4%, e usa seus instrumentos para manter a taxa dentro dela.",
      "É dela que derivam o rendimento dos títulos curtos do Tesouro americano, dos fundos de money market e do caixa nas corretoras de lá. Depois de 2008 e de novo em 2020, a faixa ficou perto de zero por anos.",
    ],
    exemplo:
      "Hipotético: com os Fed funds em 4% e a Selic em 13,75%, o dinheiro parado em dólar rende bem menos que o parado em reais. A diferença é o que a paridade de juros diz que o dólar precisaria subir para empatar.",
    naPratica:
      "Comparar Fed funds com Selic é o ponto de partida da conversa sobre ir para fora, mas não o fim. A aula 3 mostra que o argumento não está na taxa de juros, e sim na concentração de risco.",
    relacionados: ["fed", "selic", "paridade-de-juros", "treasury", "carry-trade"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "24:45" },
      { modulo: 0, aula: 3, tempo: "5:48" },
    ],
  },
  {
    slug: "afrouxamento-quantitativo",
    termo: "Afrouxamento quantitativo",
    sigla: "QE",
    categoria: "Juros e inflação",
    apelidos: ["quantitative easing", "compra de títulos", "comprar títulos em massa", "dinheiro barato", "dinheiro quase de graça"],
    resumo:
      "Quando o banco central, com os juros já perto de zero, compra títulos em grande quantidade para baixar os juros longos e irrigar o sistema com dinheiro.",
    texto: [
      "Em 2008, o Fed cortou o juro básico a quase zero e ainda assim a economia não reagia. A saída foi comprar títulos do Tesouro e títulos lastreados em hipotecas, pagando com reservas novas. Isso derrubou os juros longos e encheu os bancos de dinheiro. É o afrouxamento quantitativo, ou QE.",
      "O programa se repetiu em ondas até 2014 e voltou com força em 2020. O balanço do Fed, que tinha perto de US$ 900 bilhões antes de 2008, chegou perto de US$ 9 trilhões em 2022. Outros bancos centrais, do Japão à Europa, fizeram o mesmo.",
      "O efeito colateral foi uma década de dinheiro barato. Quem tinha ativos para dar em garantia tomou crédito e comprou mais ativos, o que ajudou a inflar ações e imóveis. O caminho inverso, o aperto quantitativo, começou em 2022.",
    ],
    exemplo:
      "Hipotético: o banco central compra US$ 1 trilhão em títulos de 10 anos. Com mais um comprador gigante, o preço dos títulos sobe e a taxa cai, digamos de 3,5% para 2,5%. Financiar uma casa ou uma empresa fica mais barato.",
    naPratica:
      "A década do dinheiro barato ajuda a explicar a alta das ações de tecnologia americanas e o juro real perto de zero no mundo rico, enquanto o Brasil pagava perto de 10% reais. Quem compara os dois lados precisa saber que esses regimes mudam.",
    relacionados: ["fed", "treasury", "curva-de-juros", "juro-real", "bolha"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "56:28" }],
  },
  {
    slug: "custo-de-oportunidade",
    termo: "Custo de oportunidade",
    categoria: "Juros e inflação",
    apelidos: ["custos de oportunidade"],
    resumo:
      "O que você deixa de ganhar ao escolher uma alternativa em vez de outra. Todo investimento se compara com o melhor uso possível do mesmo dinheiro.",
    texto: [
      "Você deixa R$ 50 mil parados na conta corrente. Não perdeu nada no extrato, mas abriu mão de quanto eles renderiam numa aplicação segura. Essa renúncia é o custo de oportunidade.",
      "No Brasil, com juros altos, o custo de oportunidade de qualquer coisa é alto: o CDI vira a régua contra a qual tudo é medido. É por isso que muita gente pergunta para que ir para fora se o juro aqui paga bem.",
      "Mas o custo de oportunidade vale para os dois lados. Ficar 100% em reais também tem o seu: abrir mão de diversificar moeda, setores e jurisdição.",
    ],
    exemplo:
      "Hipotético: esperar o dólar voltar a R$ 4,90 por dois anos, quando ele estava a R$ 5,20, tem um custo de oportunidade: tudo o que o investimento lá fora teria rendido no período, além do risco de o dólar nunca voltar.",
    naPratica:
      "A comparação certa não é taxa contra taxa. É o retorno esperado de cada caminho, com o risco que ele carrega, contra o que você deixa de ter ao não seguir o outro.",
    relacionados: ["cdi", "selic", "market-timing", "premio-de-risco"],
  },
  // ==== RENDA FIXA ==============================================================================
  {
    slug: "renda-fixa",
    termo: "Renda fixa",
    categoria: "Renda fixa",
    apelidos: ["aplicação de renda fixa", "aplicações de renda fixa", "fluxo combinado"],
    resumo:
      "Investimentos em que você empresta dinheiro e recebe juros em datas e regras combinadas. Fixa é a regra do pagamento, não o preço no caminho.",
    texto: [
      "Quando você compra um título, empresta dinheiro a um governo, banco ou empresa. Em troca, recebe juros numa regra combinada: uma taxa prefixada, um índice como o CDI ou a inflação mais um adicional. Isso é renda fixa.",
      "O brasileiro costuma associar renda fixa a um rendimento que sobe um pouquinho todo mês. Na aula 4, Rodolfo Bastos propõe outra leitura: renda fixa é dinheiro que cai na sua conta em datas e valores combinados, como o cupom de um título ou o aluguel de um inquilino que nunca atrasa.",
      "Fixa não quer dizer sem risco nem sem oscilação. Se você vender antes do vencimento, recebe o preço do dia, que cai quando os juros sobem. E há sempre o risco de quem emitiu não pagar.",
    ],
    exemplo:
      "Em 2022, o título de 10 anos do Tesouro americano perdeu quase 18% no ano, praticamente o mesmo que a bolsa. Quem o levasse até o vencimento receberia o combinado; quem precisou vender no meio do caminho realizou a perda.",
    naPratica:
      "A renda fixa americana oscila mais no extrato que o pós-fixado brasileiro, porque lá quase tudo é prefixado e marcado a mercado. Isso não a torna pior, só diferente: o que se compra é um fluxo em dólar, não um rendimento estável em reais.",
    relacionados: ["titulo-de-divida", "cupom", "prefixado", "pos-fixado", "marcacao-a-mercado", "treasury"],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "10:09" },
      { modulo: 0, aula: 3, tempo: "23:44" },
    ],
  },
  {
    slug: "titulo-de-divida",
    termo: "Título de dívida",
    categoria: "Renda fixa",
    apelidos: ["bond", "bonds", "título de renda fixa", "títulos de renda fixa", "títulos de dívida"],
    resumo:
      "Um papel que formaliza um empréstimo: quem emite recebe o dinheiro hoje e promete pagar juros e devolver o valor no vencimento. Em inglês, bond.",
    texto: [
      "Um título de dívida tem quatro peças: quem deve (o emissor), quanto vai devolver no fim (o valor de face), quando (o vencimento) e quanto paga de juros no caminho (o cupom ou a taxa). Governos, bancos e empresas emitem títulos para se financiar.",
      "Depois de emitido, o título pode trocar de mãos. O preço passa a variar com os juros do mercado e com a confiança no emissor. Quem compra no meio do caminho leva o direito aos pagamentos que faltam.",
    ],
    exemplo:
      "Hipotético: uma empresa emite um título de R$ 1.000, com vencimento em cinco anos e juros de 10% ao ano pagos semestralmente. Você recebe R$ 50 a cada seis meses e os R$ 1.000 no fim, se a empresa pagar.",
    naPratica:
      "Nos Estados Unidos, o mercado de títulos é gigante, com dezenas de trilhões de dólares em papéis de governo e de empresas, de todos os prazos. Para quem pensa em dolarizar, é uma forma de ter renda combinada em dólar, com riscos que o curso discute no Módulo II.",
    relacionados: ["renda-fixa", "cupom", "treasury", "credito-privado", "yield"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "8:05" }],
  },
  {
    slug: "prefixado",
    termo: "Prefixado",
    categoria: "Renda fixa",
    apelidos: ["prefixada", "prefixados", "título prefixado", "títulos prefixados", "Tesouro Prefixado", "LTN", "NTN-F"],
    resumo:
      "Título cuja taxa é conhecida no dia da compra, por exemplo 12% ao ano. Você sabe quanto recebe no vencimento, mas o preço oscila até lá.",
    texto: [
      "Você compra um título que paga 12% ao ano por três anos. Aconteça o que acontecer com a Selic, é isso que você recebe se levar até o fim. Isso é um prefixado.",
      "A certeza vale para o vencimento. No caminho, se os juros do mercado sobem para 14%, o seu título de 12% fica menos atraente e o preço cai. Se os juros caem, o preço sobe. Quanto mais longo o título, maior o sobe e desce.",
      "No Tesouro Direto, os prefixados são o Tesouro Prefixado (a antiga LTN) e o Tesouro Prefixado com juros semestrais (a NTN-F). Nos Estados Unidos, quase toda a dívida pública é prefixada.",
    ],
    exemplo:
      "Imagine um título prefixado que paga tudo daqui a dez anos, comprado a 4% ao ano. Se os juros do mercado sobem para 5%, ele passa a valer cerca de 9% menos hoje.",
    naPratica:
      "O prefixado protege quem acerta que os juros vão cair e pune quem precisa vender quando eles sobem. A renda fixa americana é, na maior parte, prefixada, e por isso o extrato de lá oscila mais que um CDI.",
    relacionados: ["pos-fixado", "marcacao-a-mercado", "duration", "curva-de-juros", "treasury"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "23:44" }],
  },
  {
    slug: "pos-fixado",
    termo: "Pós-fixado",
    categoria: "Renda fixa",
    apelidos: ["pós-fixada", "pós-fixados", "título pós-fixado", "aplicação pós-fixada", "1% ao mês", "atrelada à Selic", "atrelado ao CDI", "atrelada ao CDI"],
    resumo:
      "Título que rende conforme um índice que só se conhece no caminho, como CDI ou Selic. O preço quase não oscila, e por isso o extrato parece sempre subir.",
    texto: [
      "Um CDB que paga 100% do CDI não diz quanto você vai ganhar: diz que vai acompanhar o juro de curto prazo, seja ele qual for. Se a Selic sobe, o rendimento sobe junto. Isso é um pós-fixado.",
      "Como a taxa se ajusta sozinha, o preço do título quase não reage aos juros, e o extrato mostra um crescimento suave. É o conforto do pós-fixado que Rodolfo cita como uma das razões de o brasileiro ficar em casa.",
      "O Brasil é um caso raro. Quase metade da dívida pública federal segue a Selic; nos Estados Unidos, os títulos de juro flutuante são pouco mais de 2% da dívida negociável.",
    ],
    exemplo:
      "De 2000 a 2024, o CDI não teve nenhum ano negativo. No mesmo período, o título de 10 anos do Tesouro americano teve anos de perda, e em 2022 caiu quase 18%.",
    naPratica:
      "Não oscilar não é o mesmo que não ter risco. O pós-fixado carrega risco de crédito de quem emitiu, inclusive do governo, e é todo em reais. Comparar o rendimento dele com o de um título americano é comparar riscos diferentes.",
    relacionados: ["prefixado", "cdi", "selic", "tesouro-selic", "frn", "risco-de-credito"],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "5:48" },
      { modulo: 0, aula: 3, tempo: "20:26" },
    ],
  },
  {
    slug: "titulo-publico",
    termo: "Título público",
    categoria: "Renda fixa",
    apelidos: ["títulos públicos", "título do Tesouro", "títulos do Tesouro", "títulos de governo"],
    resumo:
      "Título emitido pelo governo para financiar suas contas. No Brasil, pelo Tesouro Nacional; nos Estados Unidos, pelo Tesouro americano.",
    texto: [
      "Quando o governo gasta mais do que arrecada, cobre a diferença vendendo títulos. Quem compra empresta dinheiro ao governo e recebe juros. No Brasil, esses títulos são do Tesouro Nacional e podem ser prefixados, pós-fixados ou atrelados à inflação.",
      "Na moeda do próprio país, título público costuma ser considerado o investimento de menor risco de crédito, porque o governo pode cobrar impostos e, no limite, emitir moeda para pagar. O custo dessa segunda saída aparece na inflação e no câmbio.",
    ],
    exemplo:
      "Em dezembro de 2025, a dívida pública federal brasileira somava R$ 8,6 trilhões, cerca de US$ 1,6 trilhão. Os títulos americanos em circulação, de governo e de empresas, passavam de US$ 60 trilhões.",
    naPratica:
      "Título público brasileiro e título público americano são ambos dívida de governo, mas de governos, moedas e históricos diferentes. Ter só o primeiro é concentrar o risco de crédito e de moeda num único emissor.",
    relacionados: ["tesouro-direto", "treasury", "divida-publica", "risco-de-credito", "renda-fixa"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "8:05" }],
  },
  {
    slug: "tesouro-direto",
    termo: "Tesouro Direto",
    categoria: "Renda fixa",
    apelidos: ["programa Tesouro Direto"],
    resumo:
      "O programa que permite à pessoa física comprar títulos públicos federais pela internet, com valores baixos. Existe desde 2002.",
    texto: [
      "Antes de 2002, título público era coisa de banco e de fundo. Com o Tesouro Direto, qualquer pessoa com CPF e conta numa corretora passou a comprar títulos do governo diretamente, com aplicações pequenas.",
      "O programa oferece os títulos com nomes simples: Tesouro Selic, Tesouro Prefixado e Tesouro IPCA+, com e sem juros semestrais, além de títulos voltados à aposentadoria e à educação.",
      "Um detalhe pouco notado: o Tesouro Direto mostra todo dia o preço de mercado de cada título. É por isso que um Tesouro Prefixado pode aparecer no vermelho num mês de alta dos juros, enquanto um CDB, marcado pela curva, parece só subir.",
    ],
    exemplo:
      "Hipotético: você compra um Tesouro IPCA+ longo e, seis meses depois, os juros de mercado sobem. O extrato mostra queda no valor do título. Se você levar até o vencimento, recebe a taxa contratada.",
    naPratica:
      "O Tesouro Direto é a porta mais simples para títulos públicos brasileiros. O equivalente americano, o TreasuryDirect, é pensado para residentes nos Estados Unidos; de fora, o acesso a Treasuries costuma vir por corretoras e ETFs.",
    relacionados: ["titulo-publico", "tesouro-selic", "tesouro-ipca", "prefixado", "marcacao-a-mercado"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "20:26" }],
  },
  {
    slug: "tesouro-selic",
    termo: "Tesouro Selic",
    sigla: "LFT",
    categoria: "Renda fixa",
    apelidos: ["Letra Financeira do Tesouro", "LFTs", "títulos atrelados à Selic", "dívida atrelada à Selic"],
    resumo:
      "O título público pós-fixado do Brasil, que rende a Selic do período. É o que mais se parece com dinheiro em caixa rendendo juros.",
    texto: [
      "O Tesouro Selic, cujo nome técnico é LFT (Letra Financeira do Tesouro), paga a taxa Selic acumulada até a venda ou o vencimento. Por isso o preço oscila pouquíssimo e o título serve como reserva de curto prazo.",
      "Ele é uma peculiaridade brasileira. Nasceu nos anos de inflação alta, quando ninguém emprestava ao governo a taxa fixa, e continua grande: quase metade da dívida federal está atrelada à Selic. Isso faz uma alta de juros pesar rápido nas contas públicas.",
    ],
    exemplo:
      "Hipotético: com a Selic a 13,75% ao ano, R$ 10 mil no Tesouro Selic viram perto de R$ 11.375 em um ano, antes de imposto e taxas, quase sem oscilação no caminho.",
    naPratica:
      "É o ativo de menor risco em reais, mas segue sendo um risco em reais e do governo brasileiro. O equivalente americano mais próximo são as T-bills, títulos curtos do Tesouro de lá, e os títulos de juro flutuante.",
    relacionados: ["pos-fixado", "selic", "titulo-publico", "frn", "reserva-de-emergencia"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "20:26" }],
  },
  {
    slug: "tesouro-ipca",
    termo: "Tesouro IPCA+",
    sigla: "NTN-B",
    categoria: "Renda fixa",
    apelidos: ["NTN-Bs", "Tesouro IPCA+ com juros semestrais", "título atrelado à inflação", "títulos atrelados à inflação", "título do Tesouro atrelado à inflação"],
    resumo:
      "Título público que paga a inflação medida pelo IPCA mais uma taxa fixa combinada na compra. Protege o poder de compra em reais, se levado ao vencimento.",
    texto: [
      "Um título que paga IPCA + 6% garante que, no vencimento, você terá o poder de compra original mais 6% ao ano de ganho real. É o Tesouro IPCA+, cujo nome técnico é NTN-B (com cupons semestrais) ou NTN-B Principal (que paga tudo no fim).",
      "A parte da inflação protege contra a alta dos preços no Brasil. A parte fixa, a taxa real, é que oscila com o mercado: se os juros reais sobem depois da compra, o título vale menos no caminho, e os longos oscilam bastante.",
      "A versão com juros semestrais é o exemplo da aula 4 de renda fixa como fluxo: um cupom que cai na conta a cada seis meses, corrigido pela inflação.",
    ],
    exemplo:
      "Hipotético: R$ 100 mil num IPCA + 6% por dez anos, com inflação média de 4%, viram perto de R$ 265 mil no vencimento, antes de imposto. Em poder de compra de hoje, são cerca de R$ 179 mil.",
    naPratica:
      "O Tesouro IPCA+ protege da inflação brasileira, não do câmbio. Para quem tem gastos em reais, é um bom pedaço de proteção; para gastos futuros em dólar, o equivalente seria um título americano corrigido pela inflação de lá, como os TIPS.",
    relacionados: ["ipca", "juro-real", "cupom", "tips", "marcacao-a-mercado"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "10:09" }],
  },
  {
    slug: "cdb",
    termo: "CDB",
    categoria: "Renda fixa",
    apelidos: ["CDBs", "certificado de depósito bancário", "certificados de depósito bancário"],
    resumo:
      "Título emitido por um banco para captar dinheiro. Na prática, você empresta ao banco e recebe juros, quase sempre atrelados ao CDI.",
    texto: [
      "Quando você aplica num CDB, empresta dinheiro ao banco, que usa esses recursos para emprestar a outros clientes. Em troca, paga juros, geralmente um percentual do CDI, como 100% ou 110%, e às vezes uma taxa prefixada ou atrelada à inflação.",
      "O CDB tem a garantia do FGC, o fundo mantido pelos próprios bancos, até R$ 250 mil por CPF por instituição, com limite total de R$ 1 milhão a cada quatro anos. Acima disso, ou se o banco quebrar e o FGC demorar, o risco é do banco.",
      "No extrato, o CDB costuma aparecer marcado pela curva, crescendo dia a dia como se o mercado não tivesse mudado. Se você precisar vender antes do vencimento, o preço pode ser outro.",
    ],
    exemplo:
      "Hipotético: dois CDBs pagam 100% e 120% do CDI. O segundo paga mais porque o banco emissor é menor ou mais arriscado. A diferença é o prêmio pelo risco de crédito.",
    naPratica:
      "A pergunta da aula, por que não ficar só no CDB, não é sobre o CDB ser ruim. É que ele concentra três riscos no mesmo lugar: o do banco, o do juro brasileiro e o do real.",
    relacionados: ["cdi", "pos-fixado", "risco-de-credito", "marcacao-na-curva", "credito-privado"],
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
    resumo:
      "Título de dívida emitido por uma empresa não financeira para se financiar. Paga mais que o título público porque carrega o risco da empresa.",
    texto: [
      "Uma concessionária de rodovias precisa de dinheiro para duplicar uma estrada. Em vez de pegar empréstimo no banco, emite debêntures: títulos que prometem juros e a devolução do valor em datas combinadas. Quem compra vira credor da empresa.",
      "Debêntures não têm a garantia do FGC. O risco é o da empresa pagar, e por isso a taxa costuma ser maior que a de um título público de prazo parecido. Algumas, chamadas incentivadas, financiam infraestrutura e têm regras de imposto diferentes, que vale conferir na legislação em vigor.",
      "Nos Estados Unidos, o equivalente são os corporate bonds, um mercado de vários trilhões de dólares.",
    ],
    exemplo:
      "Hipotético: o título público de cinco anos paga IPCA + 6%, e a debênture de uma empresa sólida, IPCA + 7%. Esse ponto a mais é o spread de crédito, o pagamento por aceitar o risco da empresa.",
    naPratica:
      "Debênture é crédito privado em reais. Somada a títulos públicos e CDBs, mantém o patrimônio concentrado no ciclo de crédito brasileiro, por mais que os emissores sejam diferentes.",
    relacionados: ["credito-privado", "spread-de-credito", "rating", "risco-de-credito"],
  },
  {
    slug: "credito-privado",
    termo: "Crédito privado",
    categoria: "Renda fixa",
    apelidos: ["títulos de empresas", "títulos privados", "papéis privados", "corporate bonds", "títulos corporativos", "dívida de empresas"],
    resumo:
      "Títulos de dívida emitidos por empresas e bancos, e não pelo governo. Pagam um adicional sobre os títulos públicos pelo risco de calote.",
    texto: [
      "Toda dívida que não é do governo é crédito privado: debêntures, CDBs, notas de bancos, títulos de empresas americanas. A lógica é a mesma do título público, com um risco a mais, o de a empresa não pagar.",
      "Para compensar, o crédito privado paga um prêmio, o spread de crédito. Empresas sólidas pagam pouco a mais; empresas arriscadas, muito. Agências de rating dão notas que ajudam a separar uns dos outros.",
      "Nos Estados Unidos, há títulos de empresas de todos os tamanhos e notas. A aula 4 cita perto de US$ 14 trilhões só nesse segmento.",
    ],
    exemplo:
      "Hipotético: o Tesouro americano de cinco anos paga 4% ao ano. Uma empresa com nota alta paga 5%; uma com nota baixa, 8%. Os 4 pontos de diferença na segunda pagam a chance maior de calote.",
    naPratica:
      "No Módulo II, o curso trata de crédito americano. A pergunta é sempre a mesma: o prêmio pago compensa o risco? Em crises, os spreads se abrem e os preços caem junto com a bolsa.",
    relacionados: ["debenture", "spread-de-credito", "rating", "grau-de-investimento", "risco-de-credito"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "8:05" }],
  },
  {
    slug: "treasury",
    termo: "Treasury",
    categoria: "Renda fixa",
    apelidos: ["Treasuries", "título do Tesouro americano", "títulos do Tesouro americano", "Treasury de 10 anos", "título de 10 anos do Tesouro", "títulos de 10 anos do Tesouro americano", "título de 10 anos do Tesouro americano", "T-bills", "T-bill", "T-notes", "T-bonds"],
    resumo:
      "Os títulos de dívida do governo dos Estados Unidos. São a referência de investimento de baixo risco em dólar e a base do mercado financeiro global.",
    texto: [
      "Quando o governo americano precisa de dinheiro, emite Treasuries. Há três famílias pelo prazo: T-bills, de até um ano, que pagam tudo no vencimento; T-notes, de 2 a 10 anos; e T-bonds, de 20 e 30 anos. Notes e bonds pagam cupom a cada seis meses.",
      "É o maior mercado de títulos do mundo, com quase US$ 30 trilhões em dívida negociável em 2025. Bancos centrais guardam reservas em Treasuries, e a taxa do título de 10 anos serve de régua para hipotecas, crédito de empresas e valor de ações no mundo inteiro.",
      "Baixo risco de crédito não quer dizer preço estável. Um Treasury longo oscila bastante quando os juros mudam: em 2022, o de 10 anos perdeu quase 18%.",
    ],
    exemplo:
      "Hipotético: você compra um Treasury de 10 anos com cupom de 4%, a US$ 1.000. Recebe US$ 20 a cada seis meses e os US$ 1.000 no fim. Se os juros sobem para 5% no ano seguinte, o título vale perto de US$ 930 no mercado.",
    naPratica:
      "Para quem dolariza, o Treasury é o equivalente do título público brasileiro, só que em dólar. Levado ao vencimento, entrega exatamente o combinado; o resultado em reais depende do câmbio. É o tema central do módulo de Tony Volpon.",
    relacionados: ["titulo-publico", "tips", "frn", "curva-de-juros", "duration", "fed-funds"],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "23:44" },
      { modulo: 0, aula: 3, tempo: "25:26" },
    ],
  },
  {
    slug: "tips",
    termo: "TIPS",
    categoria: "Renda fixa",
    apelidos: ["Treasury Inflation-Protected Securities", "título americano corrigido pela inflação", "títulos corrigidos pela inflação"],
    resumo:
      "Títulos do Tesouro americano com o principal corrigido pela inflação de lá (o CPI). São o equivalente americano do Tesouro IPCA+.",
    texto: [
      "Um TIPS funciona como uma NTN-B em dólar. O valor do título é corrigido pela inflação americana, e o cupom incide sobre esse valor corrigido. No vencimento, você recebe o principal atualizado.",
      "Existem desde 1997, com prazos de 5, 10 e 30 anos. A taxa que eles pagam acima da inflação é a melhor medida do juro real americano de cada prazo.",
    ],
    exemplo:
      "Hipotético: você compra US$ 10 mil em TIPS com juro real de 2% ao ano. Se a inflação americana for de 3% num ano, o principal vai a US$ 10.300 e o cupom é calculado sobre esse valor.",
    naPratica:
      "Os TIPS protegem o poder de compra em dólar, não em reais. Para quem planeja gastos futuros nos Estados Unidos, essa é a proteção que casa com o objetivo.",
    relacionados: ["treasury", "tesouro-ipca", "cpi", "juro-real", "risco-de-base"],
  },
  {
    slug: "frn",
    termo: "Título de juro flutuante",
    sigla: "FRN",
    categoria: "Renda fixa",
    apelidos: ["títulos de juro flutuante", "floating rate note", "floating rate notes", "juro flutuante"],
    resumo:
      "Título cujo cupom acompanha um juro de curto prazo e muda com ele. É o parente mais próximo do pós-fixado brasileiro.",
    texto: [
      "Em vez de pagar uma taxa fixa, um título de juro flutuante paga uma taxa que se ajusta à de curto prazo, mais um pequeno adicional. Como acompanha o mercado, o preço quase não oscila.",
      "O Tesouro americano emite títulos assim, de dois anos, desde janeiro de 2014, atrelados às T-bills de três meses. São uma fatia pequena da dívida americana: cerca de US$ 690 bilhões de US$ 29,7 trilhões em setembro de 2025.",
    ],
    exemplo:
      "No Brasil, quase metade da dívida federal segue a Selic. Nos Estados Unidos, os títulos de juro flutuante são pouco mais de 2% da dívida negociável. Por isso a renda fixa de lá oscila mais no extrato.",
    naPratica:
      "O pós-fixado não é uma invenção exclusiva brasileira, mas o tamanho dele aqui é. Quem procura algo parecido lá fora encontra T-bills, títulos de juro flutuante e fundos de money market.",
    relacionados: ["pos-fixado", "tesouro-selic", "treasury", "fed-funds"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "20:26" }],
  },
  {
    slug: "cupom",
    termo: "Cupom",
    categoria: "Renda fixa",
    apelidos: ["cupons", "título com cupom", "títulos com cupom", "cupom semestral", "juros semestrais", "título zero cupom", "zero cupom", "risco de reinvestimento"],
    resumo:
      "Os juros que um título paga periodicamente, por exemplo a cada seis meses, até o vencimento. Título que paga tudo só no fim é chamado de zero cupom.",
    texto: [
      "Pense num título que você compra por R$ 1.000, que paga R$ 50 a cada seis meses e devolve os R$ 1.000 no vencimento. Esses R$ 50 são o cupom. O nome vem do tempo em que os títulos eram de papel e tinham cupons destacáveis, trocados por dinheiro em cada data.",
      "O que está combinado é o fluxo, não o preço. Se os juros do mercado caem, o título fica mais atraente e passa a valer mais que R$ 1.000; se sobem, passa a valer menos.",
      "Há títulos que não pagam nada no caminho e entregam tudo no fim, os zero cupom, como o Tesouro Prefixado e as T-bills. O título com cupom traz um risco a mais, o de reinvestimento: cada cupom recebido precisa ser aplicado de novo, à taxa que estiver valendo.",
    ],
    exemplo:
      "Hipotético: uma NTN-B com cupom de 6% ao ano paga perto de 3% a cada seis meses sobre o valor corrigido pela inflação. Quem tem R$ 200 mil nela recebe perto de R$ 6 mil por semestre, mais a correção.",
    naPratica:
      "Na leitura da aula 4, o cupom é o coração da renda fixa: dinheiro que cai na conta em data conhecida. Se você vai precisar do dinheiro numa data, faz sentido um título que vença perto dela. E diferente do dividendo, deixar de pagar o cupom é calote.",
    relacionados: ["renda-fixa", "titulo-de-divida", "yield", "dividendo", "tesouro-ipca"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "10:56" }],
  },
  {
    slug: "yield",
    termo: "Yield",
    categoria: "Renda fixa",
    apelidos: ["yield to maturity", "taxa até o vencimento", "rendimento até o vencimento", "taxa do título", "yields"],
    resumo:
      "O retorno anual que você recebe se comprar um título pelo preço de hoje e levá-lo até o vencimento. Sobe quando o preço cai, e vice-versa.",
    texto: [
      "Um título com cupom de 4% custava US$ 1.000. Os juros subiram e ele passou a ser negociado a US$ 930. Quem compra agora recebe os mesmos cupons, mas paga menos, e ainda ganha a diferença até os US$ 1.000 do vencimento. O retorno total dessa compra, em ritmo anual, é o yield, ou taxa até o vencimento.",
      "Preço e yield andam em sentidos opostos, sempre. Por isso, nos Estados Unidos, as notícias dizem que o yield do Treasury de 10 anos subiu, o que é o mesmo que dizer que o preço caiu.",
    ],
    exemplo:
      "Hipotético: um Treasury de 10 anos com cupom de 4% passa a valer US$ 930. O yield de quem compra a esse preço fica perto de 4,9% ao ano.",
    naPratica:
      "Ao comparar títulos, olhe o yield, não o cupom. É ele que diz quanto você vai ganhar a partir de hoje, se o emissor pagar e você segurar até o fim.",
    relacionados: ["cupom", "marcacao-a-mercado", "curva-de-juros", "treasury", "duration"],
  },
  {
    slug: "marcacao-a-mercado",
    termo: "Marcação a mercado",
    categoria: "Renda fixa",
    apelidos: ["marcado a mercado", "marcada a mercado", "marcados a mercado", "marcar a mercado", "preço do dia", "preço de mercado"],
    resumo:
      "Atualizar o valor de um título pelo preço que ele teria se fosse vendido hoje, e não pelo que vai pagar no vencimento.",
    texto: [
      "É olhar quanto o seu título vale hoje, se você precisasse vender. Se você segura até o fim, recebe a taxa combinada, desde que o emissor pague. Se vende antes, recebe o preço do dia, que cai quando os juros sobem e sobe quando eles caem.",
      "Fundos de investimento no Brasil marcam a mercado os títulos que têm, e o Tesouro Direto mostra o preço diário de cada papel. Já o CDB levado ao vencimento costuma aparecer no extrato pela curva, subindo devagar como se o mercado não tivesse mudado.",
      "Nos Estados Unidos, o investidor vê o sobe e desce dos títulos no extrato todo dia, e se acostumou a ele.",
    ],
    exemplo:
      "Imagine um título prefixado que paga tudo daqui a dez anos, comprado a 4% ao ano. Se os juros do mercado sobem para 5%, ele passa a valer cerca de 9% menos hoje. O extrato marcado na curva esconde essa perda, mas ela aparece se você precisar vender antes do prazo.",
    naPratica:
      "A marcação a mercado não cria nem destrói valor: mostra o que já aconteceu. Ela explica por que a renda fixa americana parece tão volátil e por que parte da oscilação da renda fixa brasileira fica escondida.",
    relacionados: ["marcacao-na-curva", "prefixado", "duration", "yield", "volatilidade"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "20:26" }],
  },
  {
    slug: "marcacao-na-curva",
    termo: "Marcação na curva",
    categoria: "Renda fixa",
    apelidos: ["pela curva", "marcado na curva", "preço na curva"],
    resumo:
      "Atualizar o título pela taxa contratada na compra, como se o mercado não tivesse mudado. Mostra o que você recebe no vencimento, não o que receberia vendendo hoje.",
    texto: [
      "Você comprou um CDB a 12% ao ano. Na marcação na curva, o extrato mostra o valor crescendo exatamente 12% ao ano, todo dia um pouquinho, aconteça o que acontecer com os juros lá fora.",
      "É uma forma legítima de mostrar quanto o título vai valer no vencimento. O problema aparece quando você precisa vender antes: o comprador paga o preço de mercado, que pode ser maior ou menor que o da curva.",
    ],
    exemplo:
      "Hipotético: o seu CDB prefixado de 12% está a R$ 11.200 pela curva. Os juros subiram para 14% e você precisa resgatar antes. O banco recompra pelo preço de mercado, digamos R$ 11.000.",
    naPratica:
      "A estabilidade do extrato brasileiro é, em parte, efeito de contabilidade. Na comparação com um título americano marcado a mercado, lembre que um mostra o preço do dia e o outro, o valor da promessa.",
    relacionados: ["marcacao-a-mercado", "cdb", "prefixado", "volatilidade"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "20:26" }],
  },
  {
    slug: "duration",
    termo: "Duration",
    categoria: "Renda fixa",
    apelidos: ["prazo médio", "duração"],
    resumo:
      "O prazo médio em que você recebe o dinheiro de um título. Na prática, mede quanto o preço dele reage a uma mudança de juros: quanto maior, mais oscila.",
    texto: [
      "Dois títulos pagam a mesma taxa, um vence em 2 anos e o outro em 20. Os juros do mercado sobem 1 ponto. O primeiro perde perto de 2% de valor; o segundo, bem mais. A diferença é a duration.",
      "Ela é o prazo médio dos pagamentos de um título, pesando cada um pelo seu valor de hoje. Num título que paga tudo no fim, a duration é o próprio prazo. Num título com cupons, é menor, porque parte do dinheiro chega antes.",
      "A regra de bolso é simples: cada ponto percentual de alta nos juros derruba o preço em mais ou menos tantos por cento quanto a duration, em anos.",
    ],
    exemplo:
      "Hipotético: um título com duration de 8 anos e juros subindo de 4% para 5%. O preço cai perto de 8%. Se os juros caem 1 ponto, ele sobe perto de 8%.",
    naPratica:
      "Duration é a ferramenta para casar a renda fixa com o seu horizonte. Se você vai precisar do dinheiro em três anos, títulos de duration parecida reduzem o risco de vender na hora errada. Títulos longos oscilam como ações em anos de juros agitados.",
    relacionados: ["marcacao-a-mercado", "curva-de-juros", "prefixado", "treasury", "horizonte-de-investimento"],
  },
  {
    slug: "curva-de-juros",
    termo: "Curva de juros",
    categoria: "Renda fixa",
    apelidos: ["estrutura a termo", "estrutura a termo das taxas de juros", "juros longos", "juro longo", "curva invertida", "inversão da curva", "curva de juros invertida", "juros de longo prazo"],
    resumo:
      "O gráfico das taxas de juros por prazo, do curtíssimo ao longo. Mostra quanto o mercado cobra para emprestar por um mês, um ano ou trinta anos.",
    texto: [
      "Emprestar dinheiro por um mês e por dez anos não custa o mesmo. Ligue num gráfico as taxas de cada prazo, de títulos do mesmo emissor, e você tem a curva de juros. A ponta curta segue o banco central; a longa reflete expectativas de inflação, de juros futuros e o prêmio por emprestar por mais tempo.",
      "Normalmente, a curva sobe: prazo maior, taxa maior. Quando os juros curtos ficam acima dos longos, ela está invertida, sinal de que o mercado espera cortes de juros, muitas vezes por medo de recessão. Nos Estados Unidos, a inversão antecedeu várias recessões, mas não com prazo previsível.",
      "No Brasil, a ponta longa sobe rápido quando o mercado desconfia das contas públicas, mesmo sem o Banco Central mexer na Selic.",
    ],
    exemplo:
      "Hipotético: o título de 3 meses paga 4%, o de 2 anos, 3,6%, e o de 10 anos, 4,1%. A curva tem uma barriga: o mercado espera cortes no curto prazo e cobra prêmio no longo.",
    naPratica:
      "Escolher títulos é escolher um ponto da curva. No Módulo II, Tony Volpon trata da curva americana e do que ela sinaliza. Para você, o essencial é saber que prazos diferentes reagem de jeitos diferentes à mesma notícia.",
    relacionados: ["duration", "yield", "treasury", "fed", "prefixado"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "14:55" }],
  },
  {
    slug: "rating",
    termo: "Rating",
    categoria: "Renda fixa",
    apelidos: ["nota de crédito", "notas de crédito", "classificação de risco", "agência de rating", "agências de rating"],
    resumo:
      "A nota que agências como S&P, Moody's e Fitch dão à capacidade de um governo ou empresa pagar suas dívidas. Vai de AAA, a melhor, até D, de calote.",
    texto: [
      "Antes de emprestar a alguém que você não conhece, você quer uma opinião sobre o risco. É o que fazem as agências de rating: analisam contas, histórico e perspectivas de um emissor e dão uma nota, numa escala que começa em AAA e desce até D.",
      "As três maiores são S&P Global, Moody's e Fitch, com escalas parecidas (a Moody's escreve Aaa, Aa1 e assim por diante). A linha mais importante separa o grau de investimento do grau especulativo.",
      "Rating é opinião, não garantia. As agências erraram feio antes de 2008, dando nota máxima a títulos de hipoteca que viraram pó. E até os Estados Unidos perderam a nota máxima nas três: na S&P em 2011, na Fitch em 2023 e na Moody's em 2025.",
    ],
    exemplo:
      "Hipotético: duas empresas do mesmo setor emitem títulos de cinco anos. A de nota A paga 5% ao ano; a de nota BB, 7,5%. A diferença é quanto o mercado cobra pelo risco a mais.",
    naPratica:
      "O rating ajuda a filtrar o crédito, mas não substitui olhar o prêmio pago e a concentração. Uma carteira só de títulos de um país herda a nota daquele país em tudo.",
    relacionados: ["grau-de-investimento", "spread-de-credito", "risco-de-credito", "default", "risco-pais"],
  },
  {
    slug: "spread-de-credito",
    termo: "Spread de crédito",
    categoria: "Renda fixa",
    apelidos: ["spreads de crédito", "prêmio de crédito", "pontos-base", "pontos base"],
    resumo:
      "A diferença entre a taxa de um título com risco de calote e a de um título público de mesmo prazo. É o preço que o mercado cobra pelo risco do emissor.",
    texto: [
      "Se o título do Tesouro de cinco anos paga 4% e o de uma empresa, no mesmo prazo, paga 5,5%, o spread de crédito é de 1,5 ponto, ou 150 pontos-base (cada ponto-base é um centésimo de ponto percentual).",
      "O spread se abre quando o medo cresce e se fecha quando a confiança volta. Por isso títulos de empresas costumam cair junto com a bolsa nas crises, mesmo que paguem tudo em dia.",
      "O risco-país é um spread de crédito aplicado a governos: quanto um país paga acima do Tesouro americano.",
    ],
    exemplo:
      "Em 2002, o Brasil pagava 24 pontos percentuais acima dos títulos americanos, mais de 2.400 pontos-base. Quando a política fiscal confirmou os compromissos, o prêmio caiu sem que a dívida mudasse de tamanho.",
    naPratica:
      "Ao olhar um título que paga mais, pergunte de onde vem o adicional. Quase sempre é spread de crédito, e ele é pago justamente porque, em algum cenário, o dinheiro não volta inteiro.",
    relacionados: ["risco-de-credito", "rating", "credito-privado", "risco-pais", "premio-de-risco"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "45:15" }],
  },
  {
    slug: "default",
    termo: "Default",
    categoria: "Renda fixa",
    apelidos: ["calote", "calotes", "inadimplência", "deu calote", "dando calote"],
    resumo:
      "Quando o emissor de uma dívida deixa de pagar juros ou principal como combinado. Pode acabar em perda parcial, renegociação forçada ou perda total.",
    texto: [
      "Default é o nome técnico do calote: o devedor não paga um cupom ou o principal na data. Para empresas, costuma levar à recuperação judicial e a uma negociação em que o credor recebe só parte do que emprestou. Para governos, vira renegociação, às vezes com prazos esticados e juros cortados.",
      "Governos também dão calote, inclusive na própria moeda, por caminhos menos óbvios: bloqueio de aplicações, troca forçada de títulos ou inflação. O Brasil deixou de pagar ou renegociou a dívida externa várias vezes entre o século 19 e 1987; a Argentina, em 2001, fez o maior calote de dívida externa até então.",
    ],
    exemplo:
      "Hipotético: você tem R$ 100 mil em debêntures de uma empresa que entra em recuperação judicial. Depois de dois anos de negociação, recebe 40% do valor, em parcelas.",
    naPratica:
      "A diferença entre cupom e dividendo está aqui: deixar de pagar o cupom é default; cortar o dividendo é uma decisão do conselho. E concentrar a renda fixa num único país põe todo o risco de default numa só caneta.",
    relacionados: ["risco-de-credito", "rating", "spread-de-credito", "cupom", "divida-publica"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "23:49" }],
  },
  // ==== AÇÕES ===================================================================================
  {
    slug: "acao",
    termo: "Ação",
    categoria: "Ações",
    apelidos: ["ações", "ação americana", "ações americanas", "ações brasileiras", "ação brasileira", "acionista", "acionistas"],
    resumo:
      "Um pedaço de uma empresa. Quem tem ações é sócio: participa do lucro, por dividendos ou pela valorização, e do risco do negócio.",
    texto: [
      "Uma empresa vale R$ 1 bilhão e está dividida em 100 milhões de ações. Cada ação é um pedaço de R$ 10 dela. Se você compra 1.000 ações, vira dono de uma fatia pequena do negócio: tem direito a uma parte do lucro e, em muitos casos, a votar em assembleia.",
      "O ganho vem de dois lugares: dividendos, a parte do lucro que a empresa distribui, e a valorização, quando o mercado passa a pagar mais pela ação porque a empresa cresceu ou porque o humor mudou. A perda também: o preço pode cair muito, e a empresa pode quebrar.",
      "No longo prazo, ações costumam render mais que títulos, como pagamento pelo risco maior. No curto prazo, oscilam bastante, e às vezes por anos.",
    ],
    exemplo:
      "Na aula, Rodolfo lembra que o S&P 500 rendeu de 6% a 11% ao ano em dólar, conforme a janela, sem dividendos. Em 2008, o mesmo índice caiu 37%.",
    naPratica:
      "Ações americanas e de outros países dão acesso a setores que quase não existem na bolsa brasileira, como tecnologia e boa parte da saúde. É a via de dolarizar com ativos que geram renda, e não com dinheiro parado.",
    relacionados: ["renda-variavel", "dividendo", "bolsa-de-valores", "sp-500", "valuation"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "13:04" },
      { modulo: 0, aula: 4, tempo: "8:05" },
    ],
  },
  {
    slug: "renda-variavel",
    termo: "Renda variável",
    categoria: "Ações",
    apelidos: ["renda variável americana", "ativos de renda variável"],
    resumo:
      "Investimentos cujo retorno não é combinado de antemão e depende do desempenho do ativo e do mercado, como ações, fundos imobiliários e ETFs de ações.",
    texto: [
      "Na renda fixa, há uma regra de pagamento combinada. Na renda variável, não: você compra uma ação e não sabe quanto vai receber de dividendos nem por quanto vai conseguir vender. O resultado pode ser muito maior ou muito menor que o de um título.",
      "No Brasil, o termo costuma ser sinônimo de bolsa. A fronteira, porém, é mais borrada do que parece: um título prefixado longo pode oscilar tanto quanto uma ação, e uma ação de boa pagadora de dividendos pode servir de fonte de renda.",
    ],
    exemplo:
      "Hipotético: R$ 10 mil numa ação podem virar R$ 15 mil ou R$ 6 mil em um ano. R$ 10 mil num pós-fixado de 12% viram R$ 11.200, se o emissor pagar.",
    naPratica:
      "Ter renda variável lá fora soma o risco da bolsa ao do câmbio. A fatia certa é aquela que você consegue carregar na pior semana, porque é nela que a decisão é testada.",
    relacionados: ["acao", "renda-fixa", "volatilidade", "tolerancia-ao-risco", "etf"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "4:57" }],
  },
  {
    slug: "bolsa-de-valores",
    termo: "Bolsa de valores",
    categoria: "Ações",
    apelidos: ["bolsa", "bolsas", "bolsas de valores", "B3", "Nyse", "New York Stock Exchange", "bolsa americana", "pregão", "pregões"],
    resumo:
      "O mercado organizado onde se compram e vendem ações, ETFs e outros ativos. No Brasil, a B3; nos Estados Unidos, principalmente a Nyse e a Nasdaq.",
    texto: [
      "Quando você compra uma ação pelo aplicativo da corretora, a ordem vai para uma bolsa, onde encontra alguém disposto a vender pelo mesmo preço. A bolsa organiza esse encontro, registra os negócios e garante que o dinheiro e as ações troquem de mãos.",
      "No Brasil, há uma única bolsa, a B3, em São Paulo. Nos Estados Unidos, as maiores são a Nyse, em Wall Street, e a Nasdaq, nascida eletrônica em 1971 e casa de boa parte das empresas de tecnologia.",
      "A diferença de tamanho é enorme. No fim de 2025, as empresas listadas nos Estados Unidos valiam US$ 68,9 trilhões, 43,7% de todas as bolsas do mundo; as da B3, perto de US$ 0,85 trilhão.",
    ],
    exemplo:
      "Pela proporção do fim de 2025, para cada dólar de ações listadas na B3 havia mais de 80 nas bolsas americanas. A Nvidia sozinha valia mais que a bolsa brasileira inteira.",
    naPratica:
      "Quem investe só na B3 escolhe entre uma fração pequena das empresas do mundo. Um mercado maior não é necessariamente melhor, mas oferece mais setores, mais prazos e mais liquidez.",
    relacionados: ["acao", "ibovespa", "sp-500", "nasdaq", "liquidez", "capitalizacao-de-mercado"],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "8:05" },
      { modulo: 0, aula: 1, tempo: "3:49" },
    ],
  },
  {
    slug: "dividendo",
    termo: "Dividendo",
    categoria: "Ações",
    apelidos: ["dividendos", "proventos", "pagadoras de dividendos", "boas pagadoras", "dividendo crescente", "juros sobre capital próprio"],
    resumo:
      "A parte do lucro que a empresa distribui aos acionistas, em dinheiro. Ao contrário do cupom de um título, não é obrigação: o conselho pode aumentar, manter ou cortar.",
    texto: [
      "Uma empresa lucrou R$ 1 bilhão no ano. Parte ela reinveste no negócio; parte entrega aos sócios. Essa parte entregue é o dividendo, pago por ação. No Brasil, há também os juros sobre capital próprio, uma forma parecida de distribuir lucro com tratamento de imposto diferente.",
      "Nos Estados Unidos, a maioria das empresas paga dividendos a cada trimestre, em datas regulares. Mas a data regular não é promessa: o dividendo depende do lucro e do caixa, e pode ser cortado.",
      "Para quem mora no Brasil, o dividendo americano chega com imposto retido nos Estados Unidos, tema do Módulo III.",
    ],
    exemplo:
      "Em fevereiro de 2009, no auge da crise, o JPMorgan cortou o dividendo trimestral de US$ 0,38 para US$ 0,05 por ação. Quem vivia daquele dividendo viu a renda cair a um oitavo de um trimestre para o outro.",
    naPratica:
      "Uma carteira de empresas que pagam e aumentam dividendos pode cumprir o papel de renda, desde que tenha empresas suficientes para aguentar o corte de uma delas. O dividendo é fluxo, mas não é garantia.",
    relacionados: ["dividend-yield", "dividend-aristocrats", "suavizacao-de-dividendos", "recompra-de-acoes", "cupom"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "11:53" }],
  },
  {
    slug: "dividend-yield",
    termo: "Dividend yield",
    categoria: "Ações",
    apelidos: ["dividendos, % do preço", "rendimento de dividendos", "taxa de dividendos"],
    resumo:
      "Os dividendos pagos em 12 meses divididos pelo preço da ação. Diz quanto a ação rende em dinheiro, em percentual, a quem a compra hoje.",
    texto: [
      "Uma ação custa R$ 50 e pagou R$ 3 de dividendos nos últimos 12 meses. O dividend yield é de 6%. É uma forma rápida de comparar o rendimento em dinheiro de ações diferentes, ou de uma bolsa inteira.",
      "Cuidado com yield alto demais. Ele pode vir de um dividendo generoso, mas também de um preço que despencou porque o mercado espera um corte. E empresas que crescem muito costumam pagar pouco, porque reinvestem o lucro.",
    ],
    exemplo:
      "Em agosto de 2026, os dividendos da bolsa brasileira equivaliam a 5,46% do preço, pelo índice da MSCI. Nos emergentes, 2,01%; no mundo, 1,56%.",
    naPratica:
      "Yield alto no Brasil reflete, em parte, empresas maduras de bancos e commodities, e em parte o desconto pelo risco do país. Yield baixo nos Estados Unidos reflete empresas que reinvestem e fazem recompras. Os números não se comparam sem olhar o que está por trás.",
    relacionados: ["dividendo", "preco-lucro", "growth-e-value", "recompra-de-acoes"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "20:29" }],
  },
  {
    slug: "dividend-aristocrats",
    termo: "Dividend Aristocrats e Dividend Kings",
    categoria: "Ações",
    apelidos: ["aristocratas", "aristocratas do dividendo", "S&P 500 Dividend Aristocrats", "Dividend Kings", "Kings", "King", "reis do dividendo"],
    resumo:
      "Aristocrats são as empresas do S&P 500 que aumentam o dividendo há pelo menos 25 anos seguidos, com índice oficial. Kings, apelido do mercado, são as que aumentam há 50 anos ou mais.",
    texto: [
      "Aumentar o dividendo um ano é fácil. Aumentar por 25 anos seguidos, atravessando recessões, crises e guerras, é raro. As empresas do S&P 500 que conseguem isso formam os Dividend Aristocrats, um índice criado em 2005.",
      "O índice dá o mesmo peso a cada empresa e é revisto todo ano: quem deixa de aumentar o dividendo sai. Em 2025, eram 69 empresas, o número citado na aula.",
      "Um degrau acima estão os Dividend Kings, com 50 anos ou mais de aumentos seguidos. É um apelido do mercado, sem índice oficial e sem exigência de estar no S&P 500; as listas independentes somam cerca de 55 empresas (a aula fala em mais de 54). Na aula, Rodolfo diz que o JPMorgan era king até 2008; os registros mostram que o banco nunca chegou a 50 anos de aumentos e cortou o dividendo em 2009.",
    ],
    exemplo:
      "A Procter & Gamble aumentou o dividendo pela 70ª vez seguida em abril de 2026 e paga dividendos há 136 anos. É, ao mesmo tempo, aristocrata e king.",
    naPratica:
      "Uma longa sequência de aumentos mostra disciplina, mas não é promessa. Ela costuma se manter em tempos normais e pode quebrar justamente quando você mais precisa da renda.",
    relacionados: ["dividendo", "suavizacao-de-dividendos", "sp-500", "indice-de-mercado"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "11:53" }],
  },
  {
    slug: "suavizacao-de-dividendos",
    termo: "Suavização de dividendos",
    categoria: "Ações",
    apelidos: ["dividendos suavizados", "evitar cortar dividendo", "corte de dividendo", "cortou o dividendo"],
    resumo:
      "O hábito das empresas de só aumentar o dividendo quando acham que o lucro maior veio para ficar, e de evitar cortes. Por isso um corte é lido como sinal de problema.",
    texto: [
      "As empresas evitam cortar dividendo. Só aumentam o pagamento quando acham que o lucro maior é duradouro, e aumentam devagar, para não ter de voltar atrás. O economista John Lintner descreveu esse comportamento nos anos 1950.",
      "Ele continua lá: numa pesquisa com executivos financeiros americanos, 93,8% disseram evitar reduzir o dividendo. Por isso o mercado lê um aumento como sinal de confiança da diretoria e um corte como sinal de que as coisas vão mal.",
    ],
    exemplo:
      "Hipotético: o lucro de uma empresa salta 40% num ano bom. Em vez de dobrar o dividendo, ela sobe 8%, e guarda o resto para não ter de cortar se o ano seguinte for ruim.",
    naPratica:
      "A suavização torna o dividendo mais previsível que o lucro, o que é bom para quem busca renda. Mas, numa crise grave, até empresas tradicionais cortam. Depender de poucas pagadoras traz de volta o risco de concentração.",
    relacionados: ["dividendo", "dividend-aristocrats", "risco-de-concentracao"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "12:50" }],
  },
  {
    slug: "recompra-de-acoes",
    termo: "Recompra de ações",
    categoria: "Ações",
    apelidos: ["recompras", "recompra", "buyback", "buybacks"],
    resumo:
      "Quando a empresa usa o próprio caixa para comprar suas ações no mercado. Cada ação que sobra passa a representar uma fatia maior do negócio.",
    texto: [
      "Uma empresa tem 100 milhões de ações e lucro de R$ 1 bilhão: R$ 10 por ação. Ela recompra 10 milhões de ações e as cancela. Com o mesmo lucro, cada ação restante passa a ter R$ 11,11. É outra forma de devolver dinheiro aos sócios, além do dividendo.",
      "Nos Estados Unidos, as recompras são tão comuns que, em muitos anos, as empresas do S&P 500 gastam com elas tanto quanto ou mais que com dividendos. Por isso o dividend yield americano parece baixo: parte do retorno ao acionista vem por esse outro caminho.",
    ],
    exemplo:
      "Hipotético: duas empresas devolvem 5% do valor de mercado ao ano. Uma paga tudo em dividendos; a outra paga 2% em dividendos e recompra 3%. O acionista da segunda recebe menos em dinheiro, mas vê sua fatia da empresa crescer.",
    naPratica:
      "Ao comparar a renda de ações americanas com as brasileiras, considere as recompras. E lembre que dividendo e recompra podem ter tratamentos de imposto diferentes para quem mora no Brasil.",
    relacionados: ["dividendo", "dividend-yield", "growth-e-value", "capitalizacao-de-mercado"],
  },
  {
    slug: "preco-lucro",
    termo: "Preço/lucro",
    sigla: "P/L",
    categoria: "Ações",
    apelidos: ["preço sobre lucro", "P/E", "vezes o lucro", "múltiplo", "múltiplos", "preço/lucro esperado", "lucro por ação", "LPA", "P/VP", "EV/EBITDA"],
    resumo:
      "O preço de uma ação dividido pelo lucro por ação. Diz, de forma simples, quantos anos de lucro atual você paga ao comprar a empresa.",
    texto: [
      "Uma empresa lucra R$ 2 por ação e a ação custa R$ 20. O P/L é 10: você paga dez anos do lucro de hoje. É o jeito mais simples de ver se uma ação, ou uma bolsa inteira, está cara ou barata em relação ao que ganha.",
      "Há duas versões: com o lucro dos últimos 12 meses e com o lucro esperado para os próximos 12. E há outros múltiplos parecidos, como preço sobre valor patrimonial (P/VP) e valor da empresa sobre geração de caixa operacional (EV/EBITDA).",
      "P/L baixo não quer dizer barato. O preço embute crescimento esperado e risco. Mais crescimento justifica pagar mais; mais risco, ou juro mais alto no país, obriga a pagar menos.",
    ],
    exemplo:
      "Em agosto de 2026, a bolsa brasileira valia 9,3 vezes o lucro, contra 15,2 vezes nos emergentes e 21,9 vezes no mundo. Parte da diferença é setor: bancos e commodities valem menos vezes o lucro em qualquer país. Parte é risco Brasil.",
    naPratica:
      "Comparar P/L entre países exige comparar setores e riscos. A pergunta não é qual bolsa está barata, e sim que crescimento e que risco cada preço já embute.",
    relacionados: ["valuation", "modelo-de-gordon", "growth-e-value", "msci-brazil", "risco-pais"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "20:29" }],
  },
  {
    slug: "valuation",
    termo: "Valuation",
    categoria: "Ações",
    apelidos: ["avaliação de empresas", "valor justo", "preço justo"],
    resumo:
      "O trabalho de estimar quanto uma empresa vale, a partir do dinheiro que ela deve gerar no futuro, para comparar com o preço que o mercado cobra.",
    texto: [
      "Comprar uma ação é comprar uma parte dos lucros futuros de uma empresa. Valuation é tentar responder quanto vale essa parte. Há dois caminhos principais: projetar o caixa futuro e trazê-lo a valor de hoje, ou comparar a empresa com outras parecidas por múltiplos, como o P/L.",
      "Todo valuation depende de premissas: quanto a empresa vai crescer, por quanto tempo, com que margem e qual retorno exigir pelo risco. Pequenas mudanças nessas premissas mudam muito o resultado, e por isso dois analistas sérios podem chegar a valores bem diferentes.",
    ],
    exemplo:
      "Hipotético: uma empresa deve gerar R$ 100 milhões de caixa no ano que vem, crescendo 3% ao ano depois disso, e você exige 10% de retorno. Pelo modelo de crescimento constante, ela vale perto de R$ 1,43 bilhão. Exija 12% e ela cai para perto de R$ 1,11 bilhão.",
    naPratica:
      "Valuation é o tema do Módulo II, com as ações americanas. Para o investidor de índice, o ponto principal é outro: preço e valor podem se afastar por anos, e a bolsa cara de hoje pode continuar cara.",
    relacionados: ["fluxo-de-caixa-descontado", "preco-lucro", "modelo-de-gordon", "growth-e-value", "valor-presente"],
  },
  {
    slug: "fluxo-de-caixa-descontado",
    termo: "Fluxo de caixa descontado",
    sigla: "DCF",
    categoria: "Ações",
    apelidos: ["fluxos de caixa descontados", "discounted cash flow"],
    resumo:
      "Método de valuation que projeta o caixa que a empresa vai gerar ano a ano e traz tudo a valor de hoje por uma taxa que reflete o risco.",
    texto: [
      "Imagine que uma empresa vai gerar R$ 10 milhões no ano que vem, R$ 11 milhões no seguinte e assim por diante. Cada um desses valores vale menos hoje, porque está no futuro e tem risco. Descontando todos a uma taxa de retorno exigida e somando, você chega ao valor da empresa.",
      "O método é o mais completo, mas também o mais sensível às premissas. Boa parte do valor costuma estar no chamado valor terminal, a estimativa de tudo o que vem depois dos anos projetados.",
    ],
    exemplo:
      "Hipotético: R$ 100 recebidos daqui a 10 anos, descontados a 10% ao ano, valem cerca de R$ 39 hoje. A 6%, valem R$ 56. É por isso que juros mais altos derrubam o valor de empresas cujo lucro está mais longe.",
    naPratica:
      "O DCF explica por que ações de crescimento, como as de tecnologia, reagem tanto aos juros americanos: o lucro delas está mais no futuro, e o futuro vale menos quando os juros sobem.",
    relacionados: ["valuation", "valor-presente", "modelo-de-gordon", "growth-e-value"],
  },
  {
    slug: "modelo-de-gordon",
    termo: "Modelo de Gordon",
    categoria: "Ações",
    apelidos: ["modelo de dividendos descontados", "crescimento constante", "modelo de crescimento constante"],
    resumo:
      "Uma fórmula simples de valuation: o preço de uma ação é o dividendo do próximo ano dividido pela diferença entre o retorno exigido e o crescimento esperado.",
    texto: [
      "Suponha uma empresa que paga R$ 5 de dividendo no ano que vem e aumenta esse pagamento 4% ao ano para sempre. Se você exige 9% de retorno, ela vale R$ 5 dividido pela diferença entre 9% e 4%, ou R$ 100. É o modelo de Gordon, em homenagem ao economista Myron Gordon.",
      "A lógica é intuitiva: mais crescimento aumenta o preço; mais retorno exigido, por risco ou juro alto, diminui. E a fórmula mostra quanto o preço é sensível a pequenas mudanças quando crescimento e retorno exigido estão próximos.",
    ],
    exemplo:
      "Uma empresa que distribui metade do lucro, cresce 5% ao ano e de quem se exige 9% de retorno vale cerca de 13 vezes o lucro. Baixe o crescimento para 4% e suba a exigência para 11%, e o mesmo negócio passa a valer perto de 7 vezes.",
    naPratica:
      "É o desconto brasileiro em miniatura: menos crescimento esperado e mais risco cobrado explicam por que a bolsa daqui vale menos vezes o lucro que a de fora.",
    relacionados: ["valuation", "preco-lucro", "fluxo-de-caixa-descontado", "dividendo"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "20:29" }],
  },
  {
    slug: "capitalizacao-de-mercado",
    termo: "Capitalização de mercado",
    categoria: "Ações",
    apelidos: ["valor de mercado", "market cap", "maior empresa do mundo", "large caps", "small caps"],
    resumo:
      "O valor de uma empresa na bolsa: o preço da ação multiplicado pelo número de ações. É a medida usada para comparar tamanhos e montar a maioria dos índices.",
    texto: [
      "Uma empresa tem 1 bilhão de ações cotadas a US$ 50. A capitalização de mercado, ou valor de mercado, é de US$ 50 bilhões. É quanto o mercado diz que a empresa vale naquele dia.",
      "Pelo tamanho, o mercado separa as empresas em large caps (grandes), mid caps (médias) e small caps (pequenas). As pequenas tendem a oscilar mais e a ter menos liquidez.",
      "A maioria dos índices, como o S&P 500 e o MSCI ACWI, dá a cada empresa um peso proporcional ao valor de mercado. Por isso as maiores mandam no resultado.",
    ],
    exemplo:
      "Em agosto de 2026, a Nvidia, a maior empresa do mundo, valia mais de dez vezes o índice brasileiro inteiro da MSCI.",
    naPratica:
      "Pesar por valor de mercado faz o índice acompanhar o tamanho das empresas, mas também concentrar: no S&P 500, as dez maiores eram 38% do índice em setembro de 2026. Comprar o índice é comprar essa concentração.",
    relacionados: ["free-float", "indice-de-mercado", "sp-500", "risco-de-concentracao"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "13:04" },
      { modulo: 0, aula: 4, tempo: "8:05" },
    ],
  },
  {
    slug: "free-float",
    termo: "Free float",
    categoria: "Ações",
    apelidos: ["ações em livre circulação", "livre circulação"],
    resumo:
      "A parte das ações de uma empresa que está de fato disponível para negociação, fora das mãos de controladores, governo e tesouraria.",
    texto: [
      "Uma empresa vale US$ 100 bilhões, mas o fundador tem 60% das ações e não vende. Só US$ 40 bilhões estão em circulação no mercado. Esse é o free float.",
      "Os grandes índices contam só o free float para dar peso às empresas. Isso reduz o peso de companhias controladas pelo Estado ou por famílias, e de mercados fechados a estrangeiros.",
    ],
    exemplo:
      "O MSCI ACWI conta só as ações em livre circulação, o que reduz o peso de mercados como a China, onde parte das ações é restrita a investidores estrangeiros.",
    naPratica:
      "Ao ver o peso de um país num índice global, lembre que ele mede o que um investidor estrangeiro consegue comprar, e não o tamanho total da bolsa.",
    relacionados: ["capitalizacao-de-mercado", "indice-de-mercado", "msci-acwi", "liquidez"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "6:50" }],
  },
  {
    slug: "growth-e-value",
    termo: "Growth e value",
    categoria: "Ações",
    apelidos: ["ações de crescimento", "ações de valor", "ações growth", "ações value", "dividendos x growth", "crescimento x valor"],
    resumo:
      "Dois estilos de ação. Growth são empresas que crescem rápido e reinvestem o lucro; value são empresas negociadas a múltiplos baixos, muitas vezes maduras e boas pagadoras.",
    texto: [
      "Uma empresa de software cresce 30% ao ano, reinveste tudo e quase não paga dividendos; a ação vale 40 vezes o lucro. Um banco cresce 5% ao ano, distribui metade do lucro e vale 8 vezes. A primeira é uma ação de crescimento, ou growth; a segunda, de valor, ou value.",
      "Os dois estilos se revezam na liderança por longos períodos. Growth tende a sofrer mais quando os juros sobem, porque o lucro dela está mais no futuro; value tende a ir melhor em ciclos de juros e inflação mais altos.",
      "A bolsa brasileira é, em boa parte, value: bancos e commodities. A americana tem muito growth, sobretudo em tecnologia.",
    ],
    exemplo:
      "Hipotético: os juros longos americanos sobem 1 ponto. Uma ação de growth cujo lucro está concentrado daqui a 10 anos cai mais que a de um banco que lucra hoje e paga dividendo trimestral.",
    naPratica:
      "Combinar bolsas diferentes também é combinar estilos. A discussão de dividendos x growth do Módulo II não tem lado certo: são riscos e fontes de retorno diferentes.",
    relacionados: ["preco-lucro", "dividend-yield", "valuation", "gics", "fluxo-de-caixa-descontado"],
  },
  {
    slug: "gics",
    termo: "GICS",
    categoria: "Ações",
    apelidos: ["classificação GICS", "classificação de setores"],
    resumo:
      "O padrão global de classificação de empresas por setor, criado pela MSCI e pela S&P em 1999. Divide o mercado em 11 setores, como tecnologia, financeiro e energia.",
    texto: [
      "Para dizer que a bolsa brasileira tem muito banco e pouca tecnologia, é preciso uma régua comum de setores. A mais usada é o GICS, Global Industry Classification Standard, criado em 1999.",
      "São 11 setores: tecnologia da informação, financeiro, saúde, consumo discricionário, consumo básico, industriais, energia, materiais, utilidades públicas, comunicação e imobiliário. Cada setor se divide em grupos, indústrias e subindústrias.",
    ],
    exemplo:
      "No fim de setembro de 2026, tecnologia era 39,5% do índice MSCI das ações americanas e zero no das brasileiras, onde bancos e financeiras eram 39,1%, e energia e materiais, 31,5%.",
    naPratica:
      "Comprar só Ibovespa não dá exposição a inteligência artificial, semicondutores, software ou à maior parte da saúde. Olhar os setores é o jeito mais rápido de ver o que uma bolsa tem e o que falta nela.",
    relacionados: ["msci-brazil", "sp-500", "ibovespa", "diversificacao", "risco-de-concentracao"],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "15:30" },
      { modulo: 0, aula: 1, tempo: "17:05" },
    ],
  },
  {
    slug: "adr",
    termo: "ADR",
    categoria: "Ações",
    apelidos: ["ADRs", "American Depositary Receipt", "American Depositary Receipts", "recibo de ações"],
    resumo:
      "Um certificado negociado nas bolsas americanas que representa ações de uma empresa estrangeira. É o caminho inverso do BDR.",
    texto: [
      "Petrobras, Vale e Itaú, entre outras, têm ações negociadas em Nova York na forma de ADRs. Um banco americano guarda as ações originais e emite certificados que circulam lá, em dólar.",
      "O primeiro ADR foi criado em 1927. O mecanismo permite ao investidor americano comprar empresas de fora sem abrir conta em outro país.",
    ],
    exemplo:
      "Hipotético: um ADR representa uma ação de uma empresa brasileira. Se a ação sobe 10% na B3 e o real se desvaloriza 10%, o ADR fica perto de zero a zero em dólar.",
    naPratica:
      "Comprar ADR de empresa brasileira em dólar não diversifica o risco Brasil: a ação segue a mesma empresa, as mesmas regras e a mesma economia. Muda só a moeda da cotação.",
    relacionados: ["bdr", "acao", "bolsa-de-valores", "risco-cambial"],
  },
  {
    slug: "circuit-breaker",
    termo: "Circuit breaker",
    categoria: "Ações",
    apelidos: ["circuit breakers", "pregão foi interrompido", "interrompeu os pregões", "acionou o circuit breaker"],
    resumo:
      "A interrupção automática do pregão quando a bolsa cai demais num dia. Na B3, a primeira parada acontece numa queda de 10% do Ibovespa.",
    texto: [
      "Quando o pânico toma conta, uma pausa ajuda. Na B3, se o Ibovespa cai 10% em relação ao fechamento anterior, os negócios param por 30 minutos; numa queda de 15%, por uma hora; aos 20%, a bolsa pode suspender o pregão pelo tempo que julgar necessário.",
      "Nos Estados Unidos, a regra usa o S&P 500: paradas de 15 minutos em quedas de 7% e de 13%, e fim do pregão numa queda de 20%.",
    ],
    exemplo:
      "Em 18 de maio de 2017, o Joesley Day, a bolsa caiu tanto que o pregão foi interrompido, o que não acontecia desde 2008. Em março de 2020, na pandemia, o circuit breaker foi acionado várias vezes em poucos dias.",
    naPratica:
      "O circuit breaker é um lembrete de que choques locais param o mercado inteiro de uma vez. Num dia assim, câmbio, juros e bolsa brasileiros reagem juntos, porque respondem à mesma causa.",
    relacionados: ["ibovespa", "volatilidade", "cisne-negro", "risco-sistematico"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:15:24" }],
  },
  {
    slug: "bull-e-bear-market",
    termo: "Bull market e bear market",
    categoria: "Ações",
    apelidos: ["bull market", "bear market", "mercado de alta", "mercado de baixa", "queda forte"],
    resumo:
      "Nomes do mercado para períodos de alta prolongada (bull, o touro que ataca de baixo para cima) e de queda prolongada (bear, o urso que ataca de cima para baixo).",
    texto: [
      "Por convenção, a bolsa entra em bear market quando cai 20% ou mais a partir do pico, e em bull market quando sobe 20% a partir do fundo. Quedas entre 10% e 20% costumam ser chamadas de correção.",
      "Os ciclos não têm duração fixa. Nos Estados Unidos, houve bull markets de mais de dez anos e bear markets de poucas semanas, como o de 2020.",
    ],
    exemplo:
      "Hipotético: o índice vai de 5.000 a 3.900 pontos em quatro meses, 22% abaixo do pico. Pela convenção, é um bear market. Se depois ele sobe de 3.900 a 4.700, 20% acima do fundo, começa um novo bull market, mesmo ainda abaixo do pico.",
    naPratica:
      "Rodolfo chama de queda forte a semana em que a carteira perde 10%, 15%, 20%. É nela que a estratégia vive ou morre. Os melhores dias da bolsa costumam aparecer no meio dos bear markets, e não depois.",
    relacionados: ["drawdown", "volatilidade", "market-timing", "aversao-a-perda"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "2:25" }],
  },
  {
    slug: "indice-de-mercado",
    termo: "Índice de mercado",
    categoria: "Ações",
    apelidos: ["índice de ações", "índices de ações", "índices de mercado", "índice de referência", "benchmark", "benchmarks"],
    resumo:
      "Uma cesta teórica de ativos, com regras públicas, que mostra como um mercado ou um pedaço dele se comporta. Serve de régua e de base para fundos e ETFs.",
    texto: [
      "Quando o noticiário diz que a bolsa subiu 1%, está falando de um índice: uma cesta de ações com pesos definidos por regras. O S&P 500 mede as grandes empresas americanas; o Ibovespa, as mais negociadas da B3; o MSCI ACWI, as ações do mundo.",
      "Índices servem de régua para avaliar gestores, que chamam o índice de benchmark, e de base para fundos passivos e ETFs, que tentam replicar a cesta.",
      "Ninguém investe diretamente num índice: você compra um fundo ou ETF que o acompanha, com algum custo e alguma diferença.",
    ],
    exemplo:
      "Na aula 3, Rodolfo usa índices, e não fundos, para comparar bolsa e renda fixa americanas, para que a habilidade de nenhum gestor entre na conta.",
    naPratica:
      "Saber qual índice um ETF segue diz quase tudo sobre o que você está comprando: quais países, quais setores, quanta concentração.",
    relacionados: ["sp-500", "ibovespa", "msci-acwi", "etf", "gestao-passiva"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "25:26" }],
  },
  {
    slug: "sp-500",
    termo: "S&P 500",
    categoria: "Ações",
    apelidos: ["S&P", "Standard & Poor's 500", "índice das maiores empresas americanas", "principal índice de ações americano"],
    resumo:
      "O índice das cerca de 500 maiores empresas listadas nos Estados Unidos, pesadas pelo valor de mercado. É a principal régua da bolsa americana.",
    texto: [
      "Criado em 1957 pela Standard & Poor's, o S&P 500 reúne cerca de 500 grandes empresas americanas, escolhidas por um comitê com critérios de tamanho, liquidez e lucro. Cobre perto de 80% do valor das ações listadas nos Estados Unidos.",
      "O peso de cada empresa é proporcional ao valor de mercado em livre circulação. Por isso as gigantes de tecnologia dominam: em setembro de 2026, as dez maiores eram 38% do índice.",
      "Quando se fala do retorno do S&P, vale conferir se os dividendos estão incluídos. Sem eles, o número é bem menor.",
    ],
    exemplo:
      "Na aula, o S&P rende de 6% a 11% ao ano em dólar, conforme a janela, sem dividendos. Com os dividendos, a base do professor Aswath Damodaran, da NYU, dá de 8% a quase 15%.",
    naPratica:
      "O S&P 500 é a porta de entrada mais comum para a bolsa americana, via ETFs de custo muito baixo. Mas é um índice de um país só e concentrado em tecnologia: comprar o índice também é comprar essa concentração.",
    relacionados: ["indice-de-mercado", "nasdaq", "msci-acwi", "etf", "carteira-60-40", "dividend-aristocrats"],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "18:48" },
      { modulo: 0, aula: 4, tempo: "2:25" },
    ],
  },
  {
    slug: "ibovespa",
    termo: "Ibovespa",
    categoria: "Ações",
    apelidos: ["Índice Bovespa", "bolsa brasileira"],
    resumo:
      "O principal índice da bolsa brasileira, com as ações mais negociadas da B3. Existe desde 1968 e é dominado por bancos, petróleo e mineração.",
    texto: [
      "O Ibovespa é uma carteira teórica das ações mais negociadas da B3, revista a cada quatro meses. Começou em janeiro de 1968 e é o número que o noticiário usa para dizer se a bolsa subiu ou caiu.",
      "O índice reflete a economia brasileira: bancos, petróleo, mineração, energia e algumas empresas de consumo. Tecnologia quase não aparece.",
    ],
    exemplo:
      "De janeiro de 2010 a dezembro de 2025, o Ibovespa subiu 135%, cerca de 5,5% ao ano, abaixo do CDI no mesmo período, que acumulou 340%.",
    naPratica:
      "Comprar Ibovespa é diversificar entre empresas brasileiras, não entre economias. O risco do país, da moeda e da regra continua o mesmo para todas elas.",
    relacionados: ["indice-de-mercado", "msci-brazil", "bolsa-de-valores", "gics", "home-bias"],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "14:31" },
      { modulo: 0, aula: 4, tempo: "22:22" },
    ],
  },
  {
    slug: "msci-acwi",
    termo: "MSCI ACWI",
    categoria: "Ações",
    apelidos: ["índice global de ações", "índice global", "All Country World Index", "ACWI"],
    resumo:
      "O índice da MSCI que reúne as ações de grandes e médias empresas de 47 países, ricos e emergentes. É a régua mais usada para o mercado de ações do mundo.",
    texto: [
      "Se você quisesse comprar um pedaço de cada grande empresa do mundo, na proporção do tamanho de cada uma, compraria algo parecido com o MSCI ACWI. O índice cobre 23 países desenvolvidos e 24 emergentes, com cerca de 2.450 empresas.",
      "Os Estados Unidos são quase dois terços do índice; o Brasil, menos de 0,5%. Tecnologia é quase um terço.",
    ],
    exemplo:
      "Em agosto de 2026, o MSCI ACWI somava US$ 104 trilhões em valor de mercado. Quem investe só na B3 olha para menos de um duzentos avos desse universo.",
    naPratica:
      "O ACWI é a referência do que seria uma carteira neutra de ações do mundo. Não é recomendação de alocação, mas ajuda a medir o tamanho da aposta de quem tem tudo em casa.",
    relacionados: ["msci-emerging-markets", "msci-brazil", "indice-de-mercado", "home-bias", "free-float"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "6:50" },
      { modulo: 0, aula: 3, tempo: "4:57" },
    ],
  },
  {
    slug: "msci-emerging-markets",
    termo: "MSCI Emerging Markets",
    categoria: "Ações",
    apelidos: ["índice de emergentes da MSCI", "MSCI EM", "índice de emergentes", "ações emergentes"],
    resumo:
      "O índice da MSCI para ações de países emergentes, com cerca de 1.180 empresas de 24 países. China, Taiwan e Índia têm os maiores pesos; o Brasil, uma fatia pequena.",
    texto: [
      "Emergentes não são um bloco só. O índice da MSCI para esses países reúne 1.178 ações de 24 mercados, de Taiwan à África do Sul, e o Brasil é só 3,9% dele.",
      "Em relação à bolsa brasileira, os emergentes como um todo são mais diversificados por setor e por país e, nos últimos dez anos, oscilaram bem menos.",
    ],
    exemplo:
      "Em agosto de 2026, a volatilidade anual de dez anos do MSCI Brazil foi de 30,8%, contra 17,5% do MSCI Emerging Markets e 14,7% do MSCI ACWI.",
    naPratica:
      "Diversificar não é só ir aos Estados Unidos. Emergentes como México, Indonésia e Coreia do Sul crescem em ritmos e por razões diferentes do Brasil.",
    relacionados: ["mercados-emergentes", "msci-acwi", "msci-brazil", "volatilidade"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "13:04" }],
  },
  {
    slug: "msci-brazil",
    termo: "MSCI Brazil",
    categoria: "Ações",
    apelidos: ["índice da MSCI para o Brasil", "índice MSCI das ações brasileiras", "índice brasileiro"],
    resumo:
      "O índice da MSCI para ações brasileiras, com cerca de 46 empresas. É a forma como o investidor estrangeiro enxerga a bolsa do Brasil.",
    texto: [
      "O MSCI Brazil é o retrato da bolsa brasileira usado lá fora, em dólar. Em 2026, tinha 46 empresas, e financeiro, energia e materiais somavam 71% do índice. As dez maiores posições eram 61%.",
      "Por ser calculado em dólar, ele junta o desempenho das ações com o do real. Por isso oscila mais que o Ibovespa visto em reais.",
    ],
    exemplo:
      "Desde 1987, a maior queda do MSCI Brazil, do pico ao fundo, foi de 75,8% em dólar. No índice de emergentes, foi de 65,1%; no global, de 58,1%.",
    naPratica:
      "A bolsa brasileira é barata e instável: em agosto de 2026, valia 9,3 vezes o lucro, com volatilidade quase o dobro da média dos emergentes. Barata e arriscada, ao mesmo tempo.",
    relacionados: ["ibovespa", "msci-emerging-markets", "msci-acwi", "preco-lucro", "gics"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "13:04" },
      { modulo: 0, aula: 1, tempo: "20:29" },
    ],
  },
  {
    slug: "nasdaq",
    termo: "Nasdaq",
    categoria: "Ações",
    apelidos: ["Nasdaq 100", "Nasdaq-100", "Nasdaq Composite"],
    resumo:
      "A bolsa eletrônica americana onde estão listadas muitas empresas de tecnologia, e o nome dos índices que a acompanham, como o Nasdaq 100.",
    texto: [
      "Criada em 1971 como a primeira bolsa eletrônica, a Nasdaq virou a casa de boa parte das empresas de tecnologia americanas. O Nasdaq 100 reúne as cem maiores empresas não financeiras listadas nela.",
      "Por isso o índice é muito mais concentrado em tecnologia que o S&P 500, e oscila mais.",
    ],
    exemplo:
      "Em março de 2000, 87% do Nasdaq 100 estava em tecnologia e comunicações. O índice caiu 64% nos 21 meses seguintes.",
    naPratica:
      "Trocar a concentração brasileira em bancos e commodities por uma concentração em tecnologia não é diversificar. O ganho está em combinar exposições diferentes.",
    relacionados: ["sp-500", "bolsa-de-valores", "risco-de-concentracao", "bolha"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "14:31" }],
  },
  {
    slug: "mercados-emergentes",
    termo: "Mercados emergentes",
    categoria: "Ações",
    apelidos: ["emergentes", "países emergentes", "país emergente", "mercado emergente"],
    resumo:
      "Países de renda média, com mercados financeiros em desenvolvimento, como Brasil, China, Índia, México e Indonésia. Prometem mais crescimento e cobram mais risco.",
    texto: [
      "O termo nasceu nos anos 1980 para vender aos investidores a ideia de países em ascensão. Hoje designa economias de renda média que se integram ao mercado global, com bolsas e moedas mais voláteis que as dos países ricos.",
      "Ser emergente não garante crescer mais. Cada país corre em direção ao próprio teto, definido por instituições, educação e contas públicas. E crescimento alto não garante bolsa boa, porque o preço pode já embutir esse crescimento.",
    ],
    exemplo:
      "Pelo FMI, o Brasil deve crescer 1,9% em 2026, contra 3,9% dos emergentes como grupo. Diferenças pequenas, repetidas por décadas, viram distâncias enormes.",
    naPratica:
      "Diversificar não é só sair do Brasil para os Estados Unidos. Outros emergentes têm moedas, setores e ciclos diferentes, e podem ser parte da mesma estratégia.",
    relacionados: ["msci-emerging-markets", "risco-pais", "diversificacao", "msci-acwi"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "30:33" }],
  },
  // ==== FUNDOS E ETFs ===========================================================================
  {
    slug: "fundo-de-investimento",
    termo: "Fundo de investimento",
    categoria: "Fundos e ETFs",
    apelidos: ["fundos de investimento", "cotas", "cotista", "cotistas", "mutual fund", "mutual funds", "fundos mútuos"],
    resumo:
      "Um condomínio de investidores: cada um compra cotas, e um gestor aplica o dinheiro de todos segundo uma política definida no regulamento.",
    texto: [
      "Mil pessoas juntam R$ 100 mil cada uma. Com R$ 100 milhões, contratam um gestor profissional para investir conforme regras escritas. Cada pessoa tem cotas proporcionais ao que aplicou, e o valor da cota sobe ou desce com a carteira. Isso é um fundo de investimento.",
      "O fundo dá acesso a ativos e escala que o investidor sozinho não teria, mas cobra por isso: taxa de administração, às vezes taxa de performance, e custos de operação. No Brasil, os fundos são regulados pela CVM; nos Estados Unidos, os fundos abertos tradicionais se chamam mutual funds.",
      "Há fundos para quase tudo: renda fixa, ações, multimercado, câmbio, imobiliário, e fundos que investem no exterior. O ETF é um tipo de fundo negociado em bolsa.",
    ],
    exemplo:
      "Hipotético: você aplica R$ 10 mil num fundo cuja cota vale R$ 2,00 e recebe 5.000 cotas. Um ano depois, a cota vale R$ 2,20. Seu investimento vale R$ 11 mil, já descontadas as taxas.",
    naPratica:
      "Fundos brasileiros que investem lá fora são uma das portas para dolarizar sem abrir conta no exterior. Leia o regulamento: ele diz se há proteção cambial, quanto custa e onde o dinheiro de fato está.",
    relacionados: ["etf", "taxa-de-administracao", "gestao-ativa", "gestao-passiva", "fundo-cambial"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "35:56" }],
  },
  {
    slug: "etf",
    termo: "ETF",
    categoria: "Fundos e ETFs",
    apelidos: ["ETFs", "exchange traded fund", "exchange traded funds", "fundo negociado em bolsa", "fundos negociados em bolsa", "fundo de índice", "fundos de índice", "ETFs locais"],
    resumo:
      "Um fundo negociado em bolsa como uma ação, que em geral copia um índice. Com uma única cota, você vira sócio de centenas ou milhares de empresas.",
    texto: [
      "Comprar as 500 ações do S&P 500 uma a uma, na proporção certa, seria caro e trabalhoso. Um ETF faz isso por você: é um fundo que replica o índice e cujas cotas são compradas e vendidas na bolsa, durante o pregão, como qualquer ação.",
      "O primeiro ETF americano de grande sucesso, que segue o S&P 500, estreou em 1993. Hoje há ETFs de bolsas do mundo inteiro, de títulos do Tesouro americano, de setores, de ouro e de muito mais. Os maiores cobram taxas muito baixas.",
      "Na B3, há ETFs locais que seguem índices brasileiros e estrangeiros, e BDRs de ETFs listados lá fora.",
    ],
    exemplo:
      "Hipotético: uma cota de ETF de ações globais custa US$ 100 e segue um índice com milhares de empresas de dezenas de países. Com ela, você tem um pedacinho de cada uma, por uma taxa que pode ficar abaixo de 0,1% ao ano.",
    naPratica:
      "ETF é o atalho para diversificar entre países e setores com pouco dinheiro. O Módulo III trata de onde comprar, de quanto custa e de como o domicílio do ETF muda o imposto.",
    relacionados: ["gestao-passiva", "indice-de-mercado", "bdr", "etf-ucits", "taxa-de-administracao", "tracking-error"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "13:04" }],
  },
  {
    slug: "gestao-passiva",
    termo: "Gestão passiva",
    categoria: "Fundos e ETFs",
    apelidos: ["investimento passivo", "fundo passivo", "fundos passivos", "fundo indexado", "fundos indexados", "estratégia passiva"],
    resumo:
      "Estratégia que não tenta bater o mercado: só replica um índice, com custo baixo. É a lógica da maioria dos ETFs.",
    texto: [
      "Um gestor ativo escolhe ações tentando ganhar do índice. Um fundo passivo simplesmente compra o índice inteiro, nos mesmos pesos, e aceita ficar com o retorno do mercado menos um custo pequeno.",
      "A ideia ganhou força com John Bogle, fundador da Vanguard, que lançou o primeiro fundo de índice para o público em 1976. O argumento é aritmético: na média, os gestores ativos são o próprio mercado, e depois dos custos perdem dele. Os levantamentos SPIVA, da S&P, mostram ano após ano que a maioria dos fundos ativos de ações americanas fica atrás do índice em prazos longos.",
    ],
    exemplo:
      "Hipotético: o mercado rende 8% ao ano. Um fundo passivo que cobra 0,1% entrega perto de 7,9%. Um ativo que cobra 1,5% precisa ganhar do mercado por 1,4 ponto todo ano só para empatar.",
    naPratica:
      "Para quem quer exposição a um país ou ao mundo, a gestão passiva resolve o essencial com custo baixo. A decisão que mais pesa continua sendo a alocação: quanto em cada classe, moeda e país.",
    relacionados: ["gestao-ativa", "etf", "indice-de-mercado", "taxa-de-administracao", "alocacao-de-ativos"],
  },
  {
    slug: "gestao-ativa",
    termo: "Gestão ativa",
    categoria: "Fundos e ETFs",
    apelidos: ["gestor ativo", "gestores ativos", "fundo ativo", "fundos ativos", "escolha do papel", "escolher a ação A ou o fundo B", "stock picking"],
    resumo:
      "Estratégia em que o gestor escolhe ativos e momentos tentando render mais que um índice de referência. Cobra mais caro por isso.",
    texto: [
      "O gestor ativo estuda empresas, setores e cenários e monta uma carteira diferente do índice, apostando que vai render mais. Pode dar certo, e alguns gestores têm históricos excelentes. Mas identificar de antemão quem vai continuar bem é difícil.",
      "David Swensen, que cuidou do dinheiro de Yale por 36 anos, separava três fontes de resultado: quanto pôr em cada classe, a hora de entrar e sair, e a escolha do papel. As duas últimas são o terreno da gestão ativa, e pesam bem menos no longo prazo do que a primeira.",
    ],
    exemplo:
      "Hipotético: um fundo ativo bate o índice por 2 pontos num ano e perde por 3 no seguinte. Depois de uma taxa de 2% ao ano, o cotista ficou bem atrás de quem só comprou o índice.",
    naPratica:
      "Gestão ativa pode fazer sentido em mercados menos eficientes ou em estratégias específicas. Para a parte do patrimônio que você quer dolarizar com simplicidade, custo e alocação costumam importar mais que a escolha do gestor.",
    relacionados: ["gestao-passiva", "taxa-de-performance", "alfa", "fundo-multimercado", "alocacao-de-ativos"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "0:12" }],
  },
  {
    slug: "taxa-de-administracao",
    termo: "Taxa de administração",
    categoria: "Fundos e ETFs",
    apelidos: ["taxas de administração", "expense ratio", "taxa total", "taxa anual", "custo anual"],
    resumo:
      "O percentual que o fundo cobra por ano sobre o patrimônio, descontado aos poucos da cota. Parece pequeno, mas incide todo ano, sobre tudo, com juros compostos.",
    texto: [
      "Um fundo cobra 1% ao ano. Você não recebe boleto: a taxa é descontada diariamente do valor da cota, e o rendimento que aparece já vem líquido dela. Por isso muita gente nem percebe quanto paga.",
      "Nos ETFs americanos, a taxa equivalente se chama expense ratio. Os maiores ETFs de S&P 500 cobram em torno de 0,03% a 0,1% ao ano. Fundos ativos no Brasil podem cobrar 1%, 2% ou mais, às vezes com taxa de performance por cima.",
    ],
    exemplo:
      "Hipotético: R$ 100 mil por 20 anos a 8% ao ano viram cerca de R$ 466 mil. Com 1 ponto de taxa, rendendo 7%, viram R$ 387 mil. A diferença, perto de R$ 80 mil, é o custo de um ponto por ano.",
    naPratica:
      "Ao comparar formas de investir lá fora, some a taxa do veículo ao custo de câmbio e aos impostos. Em prazos longos, a taxa é um dos poucos fatores que você controla com certeza.",
    relacionados: ["custo-total", "taxa-de-performance", "juros-compostos", "gestao-passiva", "etf"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "35:56" }],
  },
  {
    slug: "taxa-de-performance",
    termo: "Taxa de performance",
    categoria: "Fundos e ETFs",
    apelidos: ["taxas de performance", "taxa de incentivo", "performance fee"],
    resumo:
      "Uma fatia do ganho que o gestor cobra quando o fundo rende acima de um índice de referência, em geral 20% do que exceder.",
    texto: [
      "Um multimercado cobra 2% de administração e 20% do que render acima do CDI. Se o CDI deu 10% e o fundo, 15% antes da performance, o gestor fica com 20% dos 5 pontos de excesso, ou 1 ponto. A ideia é alinhar interesses: o gestor ganha mais quando o cotista ganha mais.",
      "Os regulamentos costumam ter uma regra que impede cobrar de novo antes de recuperar perdas anteriores, a linha d'água, ou high water mark.",
    ],
    exemplo:
      "Hipotético: um fundo rende 15% bruto, cobra 2% de administração e 20% sobre o que passar de um CDI de 10%. O cotista fica com perto de 12%. Somadas as duas taxas, o gestor ficou com cerca de um sexto do ganho bruto.",
    naPratica:
      "Taxa de performance faz sentido quando o gestor de fato agrega algo difícil de comprar barato. Para exposição a mercados amplos, como bolsas e títulos americanos, há caminhos sem ela.",
    relacionados: ["taxa-de-administracao", "gestao-ativa", "fundo-multimercado", "custo-total"],
  },
  {
    slug: "tracking-error",
    termo: "Tracking error",
    categoria: "Fundos e ETFs",
    apelidos: ["erro de rastreamento", "tracking difference", "descolamento do índice"],
    resumo:
      "O quanto um fundo de índice se afasta do índice que deveria copiar. Vem de taxas, impostos sobre dividendos, caixa parado e custos de operação.",
    texto: [
      "O índice subiu 10% no ano e o ETF que o copia subiu 9,8%. Esses 0,2 ponto de diferença são o descolamento, causado sobretudo pela taxa, pelo imposto retido sobre dividendos e pelo custo de comprar e vender ações.",
      "O tracking error, no sentido técnico, mede o quanto essa diferença oscila. Um bom ETF tem diferença pequena e estável; um ruim se afasta do índice de forma irregular.",
    ],
    exemplo:
      "Hipotético: dois ETFs seguem o mesmo índice e cobram a mesma taxa. Um rende 0,1 ponto abaixo do índice; o outro, 0,6 ponto. O segundo tem custos escondidos, como impostos maiores sobre dividendos ou operação ineficiente.",
    naPratica:
      "Ao escolher entre ETFs parecidos, olhe o desempenho contra o índice ao longo de vários anos, e não só a taxa anunciada. O domicílio do fundo pode pesar aqui, por causa do imposto sobre dividendos.",
    relacionados: ["etf", "gestao-passiva", "taxa-de-administracao", "etf-ucits"],
  },
  {
    slug: "reit",
    termo: "REIT",
    categoria: "Fundos e ETFs",
    apelidos: ["REITs", "Real Estate Investment Trust", "fundos imobiliários americanos", "fundo imobiliário americano", "self storage", "self storages"],
    resumo:
      "Empresa americana que tem e administra imóveis que geram renda e distribui quase todo o lucro aos acionistas. É o primo americano do fundo imobiliário.",
    texto: [
      "Criados pelo Congresso americano em 1960, os REITs permitem a qualquer pessoa ser dona de pedaços de shoppings, galpões, prédios de escritórios, hospitais, torres de celular ou data centers. Em troca de não pagar imposto de renda na empresa, são obrigados a distribuir pelo menos 90% do lucro tributável.",
      "O mercado americano tem REITs de nichos que nem existem por aqui. O exemplo da aula são os self storages, depósitos alugados por quem se mudou para um apartamento menor e não tem onde guardar a prancha de surfe.",
      "REITs oscilam como ações e são sensíveis aos juros: quando eles sobem, os dividendos fixos ficam menos atraentes e o financiamento fica mais caro.",
    ],
    exemplo:
      "Hipotético: um REIT de galpões logísticos lucra US$ 100 milhões no ano e distribui US$ 92 milhões. Quem tem 1% das ações recebe US$ 920 mil, antes de impostos.",
    naPratica:
      "REITs dão acesso a imóveis americanos com renda em dólar, sem comprar um imóvel lá. O dividendo pago a quem mora no Brasil tem imposto retido nos Estados Unidos, tema do Módulo III.",
    relacionados: ["fundo-imobiliario", "dividendo", "etf", "renda-variavel", "acao"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "14:31" }],
  },
  {
    slug: "fundo-imobiliario",
    termo: "Fundo imobiliário",
    sigla: "FII",
    categoria: "Fundos e ETFs",
    apelidos: ["fundos imobiliários", "FIIs"],
    resumo:
      "Fundo brasileiro negociado em bolsa que investe em imóveis ou em títulos ligados a imóveis e distribui a maior parte da renda aos cotistas, em geral todo mês.",
    texto: [
      "Com algumas dezenas de reais, você compra uma cota de um fundo dono de lajes corporativas, galpões ou shoppings, e recebe uma parte dos aluguéis. É o fundo imobiliário, criado por lei em 1993.",
      "A regra obriga o fundo a distribuir pelo menos 95% do lucro apurado em cada semestre, e por isso o rendimento costuma cair na conta todo mês. As cotas são negociadas na B3 e oscilam como ações.",
    ],
    exemplo:
      "Hipotético: uma cota custa R$ 100 e paga R$ 0,80 por mês. O rendimento é de perto de 10% ao ano, se o aluguel se mantiver e o preço não mudar, o que nenhuma das duas coisas garante.",
    naPratica:
      "FII é imóvel brasileiro, em reais, sujeito ao ciclo de juros daqui. Combinado a um imóvel próprio e ao salário, aumenta a dependência da mesma economia.",
    relacionados: ["reit", "dividendo", "renda-variavel", "risco-de-concentracao"],
  },
  {
    slug: "bdr",
    termo: "BDR",
    categoria: "Fundos e ETFs",
    apelidos: ["BDRs", "Brazilian Depositary Receipt", "Brazilian Depositary Receipts", "recibos de ações estrangeiras", "BDRs de ETFs", "BDR de ETF"],
    resumo:
      "Certificado negociado na B3, em reais, que representa ações ou ETFs listados no exterior. Desde 2020, qualquer investidor pode comprar.",
    texto: [
      "Você quer ações de uma empresa americana, mas não quer abrir conta lá fora. Uma instituição brasileira compra as ações nos Estados Unidos, guarda-as em custódia e emite na B3 certificados que as representam: os BDRs. Você compra e vende em reais, pela corretora de sempre.",
      "Até 2020, os BDRs eram restritos a investidores qualificados. Desde então, foram abertos a todos, e passaram a existir também BDRs de ETFs, o que permite comprar, de dentro do Brasil, fundos que seguem índices de fora.",
      "O preço do BDR acompanha o da ação lá fora convertido pelo câmbio, com algum descolamento quando há pouca liquidez.",
    ],
    exemplo:
      "Hipotético: uma ação americana sobe 5% e o dólar sobe 3% no dia. O BDR dela na B3 tende a subir perto de 8%, mesmo cotado em reais.",
    naPratica:
      "O BDR dá exposição ao ativo e ao dólar sem tirar o dinheiro do país. Isso tem vantagens de simplicidade e limites: o patrimônio continua sob custódia e regras brasileiras. O Módulo III compara o BDR com a conta no exterior.",
    relacionados: ["adr", "etf", "risco-cambial", "liquidez", "custo-total"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "13:04" }],
  },
  {
    slug: "fundo-multimercado",
    termo: "Fundo multimercado",
    categoria: "Fundos e ETFs",
    apelidos: ["multimercado", "multimercados", "fundos multimercados", "fundos multimercado", "hedge fund", "hedge funds"],
    resumo:
      "Fundo brasileiro que pode investir em várias classes ao mesmo tempo, como juros, câmbio, bolsa e derivativos, conforme a visão do gestor. É o parente local dos hedge funds.",
    texto: [
      "Um gestor acha que os juros vão cair, o dólar vai subir e a bolsa americana vai bem. Num multimercado, ele pode montar as três apostas no mesmo fundo, com liberdade que um fundo de renda fixa ou de ações não teria.",
      "É o tipo de fundo brasileiro que mais se parece com os hedge funds americanos. Costuma cobrar taxa de administração e de performance, e o resultado depende muito do gestor.",
    ],
    exemplo:
      "De janeiro de 2010 a dezembro de 2025, o IHFA, índice dos multimercados, acumulou 388%, ou 10,4% ao ano, um pouco acima do CDI, que fez 9,7% ao ano.",
    naPratica:
      "Um multimercado pode ter posições em dólar, mas não é o mesmo que dolarizar: as apostas mudam com o gestor, e a moeda do fundo continua o real. Saber o que está por dentro é o que define o risco.",
    relacionados: ["ihfa", "gestao-ativa", "taxa-de-performance", "fundo-de-investimento"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "22:22" }],
  },
  {
    slug: "ihfa",
    termo: "IHFA",
    categoria: "Fundos e ETFs",
    apelidos: ["Índice de Hedge Funds Anbima", "índice dos fundos multimercados", "índice dos multimercados"],
    resumo:
      "O índice da Anbima que mede o desempenho médio dos fundos multimercados brasileiros. É a régua para saber como a indústria de multimercados foi no período.",
    texto: [
      "O IHFA, Índice de Hedge Funds Anbima, reúne o desempenho de uma amostra ampla de multimercados, ponderado pelo tamanho de cada fundo. Serve para comparar um fundo específico com a média do setor.",
    ],
    exemplo:
      "Na aula 4, Rodolfo compara de 2010 a 2025 o IHFA (10,4% ao ano), o CDI (9,7%), o Ibovespa (5,5%) e uma carteira americana 60/40 medida em reais (cerca de 15,2%).",
    naPratica:
      "O IHFA mostra que, em média, os multimercados ficaram perto do CDI no período. Para comparar com investimentos lá fora, é preciso trazer tudo para a mesma moeda e o mesmo risco.",
    relacionados: ["fundo-multimercado", "cdi", "ibovespa", "carteira-60-40"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "22:22" }],
  },
  {
    slug: "fundo-di",
    termo: "Fundo DI",
    categoria: "Fundos e ETFs",
    apelidos: ["fundos DI", "fundo referenciado DI", "fundos referenciados DI", "money market", "fundos de money market"],
    resumo:
      "Fundo brasileiro que busca acompanhar o CDI, aplicando em títulos pós-fixados de baixo risco. Nos Estados Unidos, o parente são os fundos de money market.",
    texto: [
      "Um fundo DI aplica em Tesouro Selic, títulos de bancos e outros papéis que seguem o juro de curto prazo, com o objetivo de render perto do CDI. É uma forma comum de guardar caixa com liquidez diária.",
      "O equivalente americano são os fundos de money market, que aplicam em T-bills e outros papéis de curtíssimo prazo e rendem perto do juro básico do Fed.",
    ],
    exemplo:
      "Hipotético: um fundo DI que cobra 1% ao ano, com o CDI a 13%, rende perto de 12% bruto. Um Tesouro Selic direto, sem essa taxa, rende perto do CDI.",
    naPratica:
      "O fundo DI é o lugar natural da reserva de emergência em reais. O money market cumpre papel parecido para quem já tem dinheiro em dólar.",
    relacionados: ["cdi", "pos-fixado", "tesouro-selic", "reserva-de-emergencia", "taxa-de-administracao"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "20:26" }],
  },
  {
    slug: "fundo-cambial",
    termo: "Fundo cambial",
    categoria: "Fundos e ETFs",
    apelidos: ["fundos cambiais", "fundo de dólar"],
    resumo:
      "Fundo brasileiro que busca acompanhar a variação de uma moeda estrangeira, em geral o dólar, aplicando a maior parte em ativos ligados a ela.",
    texto: [
      "O fundo cambial é o jeito mais direto de ter a variação do dólar sem sair do Brasil. Pela regra da CVM, a maior parte da carteira, pelo menos 80%, precisa estar em ativos ligados à moeda, como contratos futuros de dólar e títulos cambiais.",
      "O rendimento, porém, não é só o dólar. Como esses fundos usam dólar futuro, carregam a diferença de juros embutida no contrato, e cobram taxa.",
    ],
    exemplo:
      "Hipotético: o dólar à vista sobe 5% num ano. Um fundo cambial pode render algo diferente disso, para mais ou para menos, por causa da taxa e de como os contratos futuros são rolados.",
    naPratica:
      "Fundo cambial protege contra a alta do dólar, mas é dólar parado, sem a renda de ações ou títulos lá fora. Serve a quem tem um gasto em dólar com data marcada mais do que a quem quer construir patrimônio no exterior.",
    relacionados: ["dolar-futuro", "hedge-cambial", "fundo-de-investimento", "dolarizacao", "risco-de-base"],
  },
  {
    slug: "etf-ucits",
    termo: "ETF UCITS",
    categoria: "Fundos e ETFs",
    apelidos: ["UCITS", "ETF irlandês", "ETFs irlandeses", "domicílio do ETF", "ETF de acumulação", "ETFs de acumulação", "ETF de distribuição", "acumulação e distribuição"],
    resumo:
      "ETFs domiciliados na Europa, quase sempre na Irlanda ou em Luxemburgo, sob a regra europeia UCITS. Muito usados por investidores de fora dos EUA por diferenças de imposto.",
    texto: [
      "O mesmo índice, o S&P 500, pode ser comprado por um ETF registrado nos Estados Unidos ou por um registrado na Irlanda. Os dois seguem as mesmas ações, mas o domicílio muda o imposto.",
      "Um ETF irlandês recebe os dividendos das empresas americanas com 15% de imposto retido, pelo tratado entre Irlanda e Estados Unidos; um investidor brasileiro que recebe dividendos americanos diretamente tem 30% retidos. E muitos ETFs UCITS são de acumulação: reinvestem o dividendo dentro do fundo, em vez de distribuí-lo.",
      "Há ainda a questão da herança: ativos americanos em nome de estrangeiros podem estar sujeitos ao imposto sucessório dos Estados Unidos acima de um valor baixo, o que não se aplica da mesma forma a um ETF irlandês.",
    ],
    exemplo:
      "Hipotético: um índice com dividendos de 1,5% ao ano. Com 30% retidos, você perde 0,45 ponto por ano; com 15%, 0,22 ponto. Em 20 anos, essa diferença pesa.",
    naPratica:
      "O domicílio do ETF é uma das escolhas técnicas mais importantes de quem dolariza, e envolve também as regras brasileiras de imposto. É assunto do Módulo III, com Luiz Roxo; confira sempre a regra em vigor.",
    relacionados: ["etf", "imposto-de-renda", "tracking-error", "dividendo", "custo-total"],
  },
  {
    slug: "custo-total",
    termo: "Custo total do investimento",
    categoria: "Fundos e ETFs",
    apelidos: ["custo total", "spread de compra e venda", "spread bid-ask", "bid-ask", "custo de câmbio", "custos de transação"],
    resumo:
      "A soma de tudo o que sai do seu bolso para investir: câmbio, spread, IOF, corretagem, taxa do fundo, imposto. É ela, e não a taxa anunciada, que mede o custo de verdade.",
    texto: [
      "Investir lá fora tem várias camadas de custo. Na entrada, o spread cambial e o IOF. Na compra, a corretagem e o spread de compra e venda, a diferença entre o preço de quem vende e o de quem compra. Durante, a taxa do fundo ou do ETF e o imposto retido sobre dividendos. Na saída, de novo câmbio e o imposto sobre o ganho.",
      "Cada camada parece pequena. Somadas, podem consumir uma parte relevante do retorno, sobretudo para quem entra e sai com frequência.",
    ],
    exemplo:
      "Hipotético: 1% de spread cambial na ida, 1,1% de IOF, 0,1% ao ano de taxa do ETF e 30% retidos de dividendos de 1,5% ao ano. Em dez anos, a taxa e o imposto sobre dividendos custam perto de 5,5 pontos do patrimônio, além dos 2,1 pontos da entrada.",
    naPratica:
      "Quando Felippe lista o que observar antes de investir lá fora, a lista começa por taxas de administração e de câmbio. Compare veículos pelo custo total, ao longo do prazo que você pretende ficar.",
    relacionados: ["spread-cambial", "taxa-de-administracao", "etf-ucits", "imposto-de-renda", "juros-compostos"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "35:56" }],
  },
  // ==== CARTEIRA E RISCO ========================================================================
  {
    slug: "diversificacao",
    termo: "Diversificação",
    categoria: "Carteira e risco",
    apelidos: ["diversificar", "diversificado", "diversificada", "diversifica", "diversificação internacional"],
    resumo:
      "Espalhar o dinheiro entre ativos que não sobem e descem todos juntos, para que o tropeço de um não derrube a carteira inteira. Não elimina o risco: troca um risco grande por vários menores.",
    texto: [
      "Imagine que todo o seu dinheiro está numa única empresa. Se ela quebra, você perde tudo. Divida entre 50 empresas de setores diferentes, e a quebra de uma vira um arranhão. Isso é diversificar.",
      "O ganho vem de os ativos não andarem juntos. Quanto menor a correlação entre eles, mais o sobe e desce de um compensa o do outro. Por isso diversificar entre países e moedas protege de riscos que diversificar dentro de um país não alcança: trocar uma ação brasileira por outra reduz o risco da empresa, não o da moeda nem o da regra.",
      "Harry Markowitz, que ganhou o Nobel por formalizar a ideia, mostrou que dá para reduzir o risco sem abrir mão do retorno esperado. É por isso que se costuma chamar a diversificação de único almoço grátis das finanças.",
    ],
    exemplo:
      "Em 2008, o S&P 500 caiu 37% em dólar, mas o dólar subiu 32% contra o real. Para quem mora no Brasil, a bolsa americana medida em reais caiu cerca de 16%, bem menos que o Ibovespa. As bolsas caíram juntas; o que diversificou foi a moeda.",
    naPratica:
      "O argumento do curso é de diversificação, não de aposta: diminuir a dependência de uma única economia, moeda e caneta. E diversificar começa pelo patrimônio inteiro, que inclui salário, imóvel e aposentadoria.",
    relacionados: ["correlacao", "risco-de-concentracao", "risco-sistematico", "alocacao-de-ativos", "dolarizacao", "home-bias"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "22:12" },
      { modulo: 0, aula: 3, tempo: "23:44" },
    ],
  },
  {
    slug: "correlacao",
    termo: "Correlação",
    categoria: "Carteira e risco",
    apelidos: ["correlações", "correlacionados", "andam juntos", "reagiram juntos", "caem juntos", "caíram juntas"],
    resumo:
      "Uma medida, de −1 a +1, de quanto dois ativos sobem e descem juntos. Quanto menor, mais um amortece o outro numa carteira.",
    texto: [
      "Dois sorveteiros na mesma praia vendem bem nos mesmos dias de sol: os resultados têm correlação alta. Um sorveteiro e um vendedor de guarda-chuva se compensam: correlação negativa. A carteira dos dois juntos oscila menos que cada um sozinho.",
      "Com ativos é igual. Correlação +1 quer dizer que andam sempre no mesmo sentido; 0, que não têm relação; −1, que andam sempre em sentidos opostos. A diversificação funciona melhor com correlações baixas.",
      "O problema é que as correlações mudam, e costumam subir nas crises, quando você mais precisaria que fossem baixas. Em 2008, bolsas do mundo inteiro caíram juntas; em 2022, títulos e ações americanos também.",
    ],
    exemplo:
      "Nos choques brasileiros, de 1999 a 2020, câmbio, juros e bolsa reagiram juntos, porque respondiam à mesma causa: o real caía, os juros subiam e a bolsa recuava. Para quem tem tudo aqui, é tudo uma posição só.",
    naPratica:
      "O dólar tende a subir quando a economia brasileira vai mal, o que dá a ele uma correlação útil com o resto de um patrimônio em reais. Não é garantia, mas é a razão de a moeda ser, para o brasileiro, metade do benefício de investir lá fora.",
    relacionados: ["diversificacao", "volatilidade", "risco-sistematico", "beta"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:29:44" }],
  },
  {
    slug: "volatilidade",
    termo: "Volatilidade",
    categoria: "Carteira e risco",
    apelidos: ["volátil", "voláteis", "volatilidade anual", "oscilação", "oscilações", "sobe e desce", "desvio-padrão", "montanha-russa"],
    resumo:
      "O quanto um preço sobe e desce em torno da média. É a medida mais usada de risco de mercado, normalmente expressa em percentual ao ano.",
    texto: [
      "Dois investimentos rendem 10% ao ano em média. Um entrega 9%, 11%, 10%, 10%. O outro, 30%, −15%, 25%, 0%. O segundo é muito mais volátil, e a viagem até o mesmo destino dá muito mais enjoo.",
      "Tecnicamente, a volatilidade é o desvio-padrão dos retornos: mede a distância típica entre cada resultado e a média. Ela não diz para que lado o preço vai, só o tamanho dos solavancos.",
      "Volatilidade não é o único risco. Um pós-fixado quase não oscila e ainda assim tem risco de crédito; uma ação pode ficar estável por anos e despencar num dia.",
    ],
    exemplo:
      "Nos dez anos até agosto de 2026, a bolsa brasileira medida em dólar oscilou 30,8% ao ano, contra 17,5% dos emergentes e 14,7% do mundo. Quase o dobro da média dos emergentes, como diz a aula.",
    naPratica:
      "A volatilidade importa por causa do seu comportamento: quem vende no fundo transforma oscilação em perda. A fatia em dólar e em bolsa deve ser a que você consegue ver oscilar sem vender.",
    relacionados: ["risco-de-mercado", "drawdown", "indice-de-sharpe", "tolerancia-ao-risco", "marcacao-a-mercado"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "18:55" },
      { modulo: 0, aula: 3, tempo: "23:44" },
    ],
  },
  {
    slug: "drawdown",
    termo: "Drawdown",
    categoria: "Carteira e risco",
    apelidos: ["maior queda", "do pico ao fundo", "perda do pico ao fundo", "queda máxima"],
    resumo:
      "A queda de um investimento desde o ponto mais alto até o mais baixo seguinte. Mostra o tamanho do estrago que você teria de aguentar.",
    texto: [
      "Sua carteira chegou a R$ 500 mil, caiu para R$ 350 mil e depois voltou a subir. O drawdown foi de 30%, do pico ao fundo. É uma medida de risco mais intuitiva que a volatilidade, porque fala da dor de verdade.",
      "Há uma aritmética cruel aqui: para recuperar uma queda de 50%, é preciso subir 100%. Quanto maior o buraco, mais tempo para sair dele.",
    ],
    exemplo:
      "Desde 1987, a maior queda do MSCI Brazil, em dólar, foi de 75,8%; a do MSCI Emerging Markets, de 65,1%; a do MSCI ACWI, de 58,1%. Até o índice global já perdeu mais da metade do valor.",
    naPratica:
      "Antes de definir quanto pôr em bolsa, aqui ou lá fora, imagine o pior drawdown histórico aplicado ao seu patrimônio, em reais. Se a cifra faria você vender, a fatia está grande demais para o seu estômago.",
    relacionados: ["volatilidade", "bull-e-bear-market", "tolerancia-ao-risco", "aversao-a-perda"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "20:29" }],
  },
  {
    slug: "risco-de-mercado",
    termo: "Risco de mercado",
    categoria: "Carteira e risco",
    apelidos: ["riscos de mercado"],
    resumo:
      "O risco de o preço de um ativo cair por movimentos do mercado: bolsa, juros, câmbio, commodities. É a oscilação que você vê no extrato.",
    texto: [
      "Risco de mercado é a oscilação. O preço de uma ação, do dólar ou de um título prefixado sobe e desce todo dia, por notícias, juros e humor dos investidores. Se você precisa vender num dia ruim, a perda vira realidade.",
      "Ele é diferente do risco de crédito, a chance de quem emitiu um título não pagar. Os dois convivem: um título longo de uma empresa tem os dois; um pós-fixado brasileiro quase não tem o primeiro e tem o segundo.",
    ],
    exemplo:
      "Em 2022, o título de 10 anos do Tesouro americano perdeu quase 18%. Não houve calote nenhum: foi puro risco de mercado, causado pela alta dos juros.",
    naPratica:
      "A palavra risco mistura coisas diferentes. O erro, diz Rodolfo, é comparar 15% com 4% como se os dois números medissem a mesma coisa. Não existe aplicação sem risco; existe a escolha de qual risco carregar, e em que dose.",
    relacionados: ["risco-de-credito", "volatilidade", "marcacao-a-mercado", "risco-sistematico"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "23:44" }],
  },
  {
    slug: "risco-de-credito",
    termo: "Risco de crédito",
    categoria: "Carteira e risco",
    apelidos: ["riscos de crédito", "risco do emissor", "risco de calote"],
    resumo:
      "A chance de quem emitiu um título não pagar, ou de o mercado passar a duvidar e derrubar o preço do papel. Existe até na aplicação mais estável.",
    texto: [
      "Quando você compra um CDB, empresta ao banco. Se o banco quebra, você depende da garantia do FGC, com limites. Quando compra um título público, empresta ao governo. Quando compra uma debênture, à empresa. Em todos os casos, há a chance de o dinheiro não voltar inteiro: é o risco de crédito.",
      "Ele aparece de duas formas. A óbvia é o calote. A menos óbvia é a desconfiança: se o mercado passa a achar o emissor mais arriscado, o preço do título cai, mesmo sem calote, e o spread de crédito sobe.",
    ],
    exemplo:
      "O pós-fixado brasileiro quase não oscila, mas tem risco de crédito, seja do governo, do banco ou da empresa. O CDI rendeu 12,38% em 2008 e em 2022 sem nenhum ano negativo, e esse número simplesmente não mostra o outro risco.",
    naPratica:
      "Toda a renda fixa brasileira, por mais diversificada entre emissores, depende em última instância do crédito do país. Ter títulos de outros governos e empresas espalha esse risco.",
    relacionados: ["risco-de-mercado", "spread-de-credito", "rating", "default", "cdb", "risco-pais"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "23:44" }],
  },
  {
    slug: "risco-sistematico",
    termo: "Risco sistemático",
    categoria: "Carteira e risco",
    apelidos: ["risco não diversificável", "risco específico", "risco diversificável", "risco da empresa", "risco do setor", "risco de mercado como um todo"],
    resumo:
      "A parte do risco que afeta todo um mercado e não some por mais ações dele que você tenha. O oposto é o risco específico, de cada empresa, que a diversificação elimina.",
    texto: [
      "Se uma empresa perde um contrato, só ela sofre: é risco específico, e uma carteira com muitas empresas quase não sente. Se o país entra em recessão, todas sofrem juntas: é risco sistemático. Comprar mais ações do mesmo país não resolve.",
      "A teoria de carteiras diz que o mercado só paga prêmio pelo risco sistemático, porque o específico qualquer um elimina de graça diversificando. Mas sistemático depende de qual mercado é o seu universo: o risco Brasil é sistemático para quem só investe no Brasil, e diversificável para quem investe no mundo.",
    ],
    exemplo:
      "Uma intervenção em preços de combustíveis, um imposto novo ou uma decisão regulatória atinge ao mesmo tempo ações, títulos, câmbio e imóveis do mesmo país. Trocar uma ação brasileira por outra não dilui esse risco.",
    naPratica:
      "É o centro do argumento do curso. O risco que a carteira brasileira não consegue diluir sozinha, de moeda, de regra e de economia, vira diversificável quando você inclui outras jurisdições.",
    relacionados: ["diversificacao", "beta", "risco-de-concentracao", "correlacao", "risco-pais"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "22:12" }],
  },
  {
    slug: "risco-de-concentracao",
    termo: "Risco de concentração",
    categoria: "Carteira e risco",
    apelidos: ["concentração de risco", "aposta concentrada", "concentração", "concentrado", "concentrada", "concentrar"],
    resumo:
      "O risco de ter uma parte grande do patrimônio dependendo de uma única coisa: uma empresa, um setor, um país ou uma moeda. É o eixo do curso.",
    texto: [
      "Salário em reais, aposentadoria do INSS, imóvel no Brasil, investimentos na B3 e no CDI. Tudo depende da mesma economia, da mesma moeda e das mesmas decisões de Brasília. Quando o país vai mal, tudo vai mal ao mesmo tempo. Isso é risco de concentração.",
      "Não é uma aposta contra o Brasil. É reconhecer que deixar 100% numa moeda e numa economia já é uma aposta, e quase ninguém a faz de propósito. O mesmo vale ao contrário: trocar uma concentração por outra, como pôr tudo em tecnologia americana, não é diversificar.",
    ],
    exemplo:
      "Quando o Lehman Brothers quebrou, em 2008, os funcionários tinham cerca de 30% das ações e perderam perto de US$ 10 bilhões: emprego e poupança estavam no mesmo lugar.",
    naPratica:
      "O eixo do curso é concentração de risco, não decadência do Brasil. A pergunta não é se o Brasil vai dar certo, e sim quanto do seu futuro você quer amarrado a uma única caneta.",
    relacionados: ["diversificacao", "capital-humano", "home-bias", "risco-sistematico", "dolarizacao"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "0:19" },
      { modulo: 0, aula: 4, tempo: "26:46" },
    ],
  },
  {
    slug: "beta",
    termo: "Beta",
    categoria: "Carteira e risco",
    apelidos: ["beta de mercado"],
    resumo:
      "Quanto uma ação costuma se mover quando o mercado se move. Beta 1 acompanha o índice; acima de 1, amplifica; abaixo de 1, amortece.",
    texto: [
      "Se a bolsa sobe 10% e uma ação costuma subir 15%, o beta dela é 1,5. Uma empresa de energia elétrica que sobe 5% quando a bolsa sobe 10% tem beta perto de 0,5.",
      "O beta mede só o risco sistemático, a parte que vem do mercado. Na teoria clássica, é por ele que o investidor deveria ser pago, já que o resto se diversifica.",
    ],
    exemplo:
      "Hipotético: numa queda de 20% da bolsa, uma ação de beta 1,3 tende a cair perto de 26%, e uma de beta 0,6, perto de 12%. Tendência, não regra.",
    naPratica:
      "O beta depende da régua. Uma ação brasileira pode ter beta baixo contra o índice global e alto contra o Ibovespa. Para quem diversifica entre países, o que importa é como cada pedaço se move contra a carteira inteira.",
    relacionados: ["risco-sistematico", "alfa", "correlacao", "volatilidade"],
  },
  {
    slug: "alfa",
    termo: "Alfa",
    categoria: "Carteira e risco",
    apelidos: ["alpha", "gerar alfa"],
    resumo:
      "O retorno acima do que o risco assumido justificaria. É o que um gestor ativo promete entregar, e o que, depois dos custos, poucos entregam de forma consistente.",
    texto: [
      "Um fundo de ações rendeu 12% num ano em que o índice rendeu 10%. Parte desses 2 pontos pode ser só risco a mais: se o fundo tinha ações mais arriscadas, era de esperar que ganhasse mais na alta. O que sobra depois de descontar o risco é o alfa.",
      "Alfa é raro e difícil de prever. Fundos que entregaram alfa num período frequentemente não repetem no seguinte.",
    ],
    exemplo:
      "Hipotético: o índice rende 10% e um fundo com beta 1,2 rende 12%. Com juro sem risco de 6%, o risco do fundo justificaria perto de 10,8%. O alfa é de perto de 1,2 ponto, antes de checar se foi sorte.",
    naPratica:
      "Pagar caro por alfa é apostar que o gestor vai repetir. Para a parte da carteira que busca só a exposição a um mercado, alfa não é necessário: o índice entrega o beta barato.",
    relacionados: ["beta", "gestao-ativa", "gestao-passiva", "indice-de-sharpe"],
  },
  {
    slug: "premio-de-risco",
    termo: "Prêmio de risco",
    categoria: "Carteira e risco",
    apelidos: ["prêmio por risco", "prêmios de risco", "prêmio de risco das ações", "prêmio pelo risco", "preço do risco"],
    resumo:
      "O retorno a mais que um investimento arriscado precisa oferecer, acima de uma aplicação sem risco, para alguém aceitar carregá-lo.",
    texto: [
      "Se um título do governo paga 4% sem risco, por que alguém compraria ações que podem cair 40% num ano? Só se esperar ganhar mais no longo prazo. Esse retorno a mais é o prêmio de risco.",
      "Ele está em toda parte: no spread de crédito de uma empresa, no risco-país de um governo, no retorno extra que as ações costumam pagar sobre os títulos. Não é garantido: é uma expectativa, e em muitos anos ele vem negativo.",
    ],
    exemplo:
      "Se existe chance de um contrato ser reescrito no meio do caminho, quem empresta cobra por isso. Em 2002, o mercado cobrava 24 pontos percentuais acima dos títulos americanos para emprestar ao Brasil.",
    naPratica:
      "Juro alto em reais é prêmio de risco, não presente. E o retorno mais alto que se espera das ações, aqui ou lá fora, só existe porque elas podem cair muito. Prêmio e risco andam juntos.",
    relacionados: ["ativo-livre-de-risco", "spread-de-credito", "risco-pais", "indice-de-sharpe", "risco-sistematico"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "45:15" }],
  },
  {
    slug: "ativo-livre-de-risco",
    termo: "Ativo livre de risco",
    categoria: "Carteira e risco",
    apelidos: ["livre de risco", "sem risco", "taxa livre de risco", "juro sem risco"],
    resumo:
      "Na teoria, a aplicação que paga um retorno certo, sem chance de calote nem oscilação no prazo. Na prática, um título curto do governo na própria moeda é o que mais se aproxima.",
    texto: [
      "Os modelos de finanças partem de um ativo sem risco: nos Estados Unidos, as T-bills; no Brasil, a Selic. O resto é medido pelo prêmio que paga acima dele.",
      "Mas livre de risco depende da régua. Um título do Tesouro americano é quase sem risco para quem gasta em dólar. Para quem gasta em reais, ele carrega o risco do câmbio. E um título brasileiro em reais, sem risco para quem gasta aqui, é arriscado medido em dólar.",
    ],
    exemplo:
      "Hipotético: você vai pagar a faculdade de um filho nos Estados Unidos daqui a cinco anos. Para esse objetivo, o investimento mais seguro é um título americano que vença perto da data, e não um CDB em reais.",
    naPratica:
      "Não existe investimento sem risco, existe investimento sem risco numa moeda e num prazo. A pergunta é sempre: sem risco para gastar o quê, onde e quando?",
    relacionados: ["risco-de-base", "premio-de-risco", "treasury", "tesouro-selic"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "23:44" }],
  },
  {
    slug: "risco-de-base",
    termo: "Risco de base",
    categoria: "Carteira e risco",
    apelidos: ["descasamento de moeda", "descasamento"],
    resumo:
      "O risco de um investimento seguro numa moeda ou unidade não casar com o objetivo, que está em outra. Um título sem risco em reais é arriscado para um gasto em dólar.",
    texto: [
      "Um título é sem risco só em relação a uma unidade de conta. Se o seu objetivo é pagar algo em dólar, o seu dinheiro em reais carrega risco, por mais seguro que seja o título. Essa distância entre o ativo e o objetivo é o risco de base.",
      "A ideia muda a pergunta da dolarização. Ela não é real ou dólar, e sim em que moeda estão os seus gastos futuros.",
    ],
    exemplo:
      "Uma família que vai morar fora ou tem filhos estudando no exterior corre risco ao manter tudo em reais: para quem vai gastar em dólar, o lugar seguro é o dólar, e a parte em reais é que carrega o risco de moeda.",
    naPratica:
      "Liste seus gastos futuros e a moeda de cada um: aposentadoria no Brasil, viagens, estudos, um imóvel lá fora. A divisão entre moedas que casa com essa lista reduz o risco de base.",
    relacionados: ["ativo-livre-de-risco", "risco-cambial", "horizonte-de-investimento", "alocacao-de-ativos"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "26:46" }],
  },
  {
    slug: "indice-de-sharpe",
    termo: "Índice de Sharpe",
    categoria: "Carteira e risco",
    apelidos: ["Sharpe", "retorno ajustado ao risco", "retorno por unidade de risco"],
    resumo:
      "Quanto um investimento rendeu acima da aplicação sem risco para cada unidade de oscilação. Serve para comparar retornos que vieram com riscos diferentes.",
    texto: [
      "Dois fundos renderam 15% num ano em que o juro sem risco foi de 10%. Um oscilou 5% ao ano; o outro, 20%. O primeiro entregou o mesmo retorno com muito menos solavanco. O índice de Sharpe captura isso: divide o retorno acima do juro sem risco pela volatilidade.",
      "Criado por William Sharpe, Nobel de Economia, é a régua mais usada para retorno ajustado ao risco. Tem limites: trata alta e queda igualmente e depende muito do período.",
    ],
    exemplo:
      "No exemplo acima, o primeiro fundo tem Sharpe de 1 (5 pontos de excesso divididos por 5 de volatilidade); o segundo, de 0,25.",
    naPratica:
      "O objetivo de diversificar não é só reduzir o risco, e sim melhorar a relação entre retorno e risco da carteira inteira. Um ativo que oscila muito sozinho pode melhorar o Sharpe do conjunto, se andar diferente do resto.",
    relacionados: ["volatilidade", "premio-de-risco", "diversificacao", "alfa"],
  },
  {
    slug: "alocacao-de-ativos",
    termo: "Alocação de ativos",
    categoria: "Carteira e risco",
    apelidos: ["alocação", "asset allocation", "classes de ativos", "classe de ativos", "tipos de investimento", "divisão entre tipos de investimento"],
    resumo:
      "A decisão de quanto do dinheiro vai para cada tipo de investimento, e, para quem vive no Brasil, para cada moeda e país. Pesa mais no resultado que a escolha do papel ou da hora.",
    texto: [
      "É a resposta para a pergunta: quanto do meu dinheiro vai para caixa, renda fixa, ações, imóveis, e quanto fica em cada moeda e cada país? Ela vem antes da escolha de qualquer papel e é mantida ao longo do tempo.",
      "David Swensen, que cuidou do dinheiro de Yale por 36 anos, dizia que a alocação pesa muito mais que acertar a hora ou escolher a ação. Um estudo clássico com 91 fundos de pensão americanos concluiu que ela explicava mais de 90% do sobe e desce de cada fundo ao longo do tempo.",
    ],
    exemplo:
      "Hipotético: dois investidores escolhem fundos diferentes, mas ambos deixam 70% em renda fixa e 30% em ações. Os resultados deles tendem a ficar mais parecidos entre si do que com o de um terceiro que tem 30% em renda fixa e 70% em ações.",
    naPratica:
      "Quanto fica no Brasil e quanto vai para fora é uma pergunta de alocação, e por isso pesa mais no seu resultado do que a escolha do ETF ou o dia da conversão. Decida com calma, deixe por escrito e respeite a decisão depois.",
    relacionados: ["rebalanceamento", "carteira-60-40", "politica-de-investimento", "market-timing", "diversificacao"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "0:12" }],
  },
  {
    slug: "carteira-60-40",
    termo: "Carteira 60/40",
    categoria: "Carteira e risco",
    apelidos: ["60/40", "carteira moderada", "carteira 60/40 americana"],
    resumo:
      "A carteira clássica do mercado americano: 60% em ações e 40% em títulos, rebalanceada de tempos em tempos. Serve de referência para uma alocação moderada.",
    texto: [
      "Durante décadas, a carteira 60/40 foi o ponto de partida dos americanos: 60% em ações, para crescer, e 40% em títulos, para amortecer as quedas. Rebalanceada uma vez por ano, ela vende um pouco do que subiu e compra do que caiu.",
      "Ela funciona melhor quando ações e títulos andam em sentidos opostos, como em 2008. Em 2022, os dois caíram juntos, e a 60/40 teve um dos piores anos da história.",
      "Atenção a um detalhe da aula: na fala, a moderada aparece como 60% em renda fixa e 40% em ações, mas os números mostrados são os da versão clássica, com 60% em ações.",
    ],
    exemplo:
      "Em 2008, a bolsa americana caiu 37%, os títulos de 10 anos subiram 20% e a 60/40 caiu 14%. Quem aplicou US$ 100 nela em janeiro de 2009 e só rebalanceou chegou ao fim de 2012 com US$ 149.",
    naPratica:
      "A 60/40 é uma régua, não uma recomendação. O ponto da aula é outro: uma regra simples, mantida com disciplina, ganhou de quem tentou trocar de classe todo ano.",
    relacionados: ["alocacao-de-ativos", "rebalanceamento", "sp-500", "treasury", "vies-de-recencia"],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "25:26" },
      { modulo: 0, aula: 4, tempo: "22:22" },
    ],
  },
  {
    slug: "rebalanceamento",
    termo: "Rebalanceamento",
    categoria: "Carteira e risco",
    apelidos: ["rebalancear", "rebalanceada", "rebalanceado", "voltar à divisão escolhida"],
    resumo:
      "Voltar a carteira à divisão planejada depois que os movimentos do mercado a desarrumaram. Na prática, vender um pouco do que subiu e comprar do que caiu.",
    texto: [
      "Você decidiu ter 30% em dólar. O dólar disparou e a fatia virou 40%. Rebalancear é vender parte do que subiu para voltar aos 30%. Se o dólar cair e a fatia virar 22%, é comprar mais.",
      "Pode ser feito por calendário, uma vez por ano, ou por faixa, quando a fatia se afasta muito do alvo. Os aportes novos também servem: em vez de vender, você direciona o dinheiro novo para a parte que ficou para trás.",
    ],
    exemplo:
      "Hipotético: carteira de R$ 100 mil, 70% em reais e 30% em dólar. Depois de um ano de dólar forte, ficou R$ 68 mil em reais e R$ 42 mil em dólar, 38% do total. Para voltar aos 30%, você move R$ 9 mil do dólar para os reais.",
    naPratica:
      "Rebalancear é o contrário do que o instinto pede: vender o que está indo bem e comprar o que está indo mal. Por isso vale deixar a regra escrita antes de o mercado se mexer.",
    relacionados: ["alocacao-de-ativos", "carteira-60-40", "politica-de-investimento", "vies-de-recencia"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "28:53" }],
  },
  {
    slug: "custo-medio",
    termo: "Custo médio",
    categoria: "Carteira e risco",
    apelidos: ["custo médio em janelas", "preço médio", "converter em janelas", "converta em janelas", "aportes periódicos", "aportes mensais", "dollar cost averaging"],
    resumo:
      "Investir ou converter aos poucos, em parcelas regulares, em vez de tudo de uma vez. Você compra mais quando está barato e menos quando está caro.",
    texto: [
      "Imagine que você converte R$ 2 mil todo mês. Num mês o dólar está a R$ 5,50, e seus R$ 2 mil compram US$ 364. No outro, ele cai para R$ 4,90, e os mesmos R$ 2 mil compram US$ 408. O preço médio que você paga nunca fica acima da média das cotações do período.",
      "As janelas não fazem você ganhar mais. Num estudo da Vanguard, aplicar tudo de uma vez rendeu mais em cerca de dois terços dos períodos históricos, porque o dinheiro fica mais tempo investido. O ganho é outro: você elimina o risco de concentrar tudo no pior dia e tira a decisão do campo da emoção.",
    ],
    exemplo:
      "R$ 12 mil convertidos em seis janelas de R$ 2 mil, com cotações entre R$ 4,90 e R$ 5,80, compraram US$ 2.270,76, a R$ 5,28 em média, abaixo da média das cotações, R$ 5,30. Tudo de uma vez renderia de US$ 2.069, no mês mais caro, a US$ 2.449, no mais barato.",
    naPratica:
      "Para quem decidiu dolarizar, Rodolfo sugere dividir o valor em 12 parcelas mensais (ou 5, ou 15) e converter uma por vez, sem tentar adivinhar o dia certo. Quem espera o dólar cair para começar costuma esperar para sempre.",
    relacionados: ["market-timing", "vies-de-ancoragem", "alocacao-de-ativos", "aversao-ao-arrependimento"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "1:23" }],
  },
  {
    slug: "market-timing",
    termo: "Market timing",
    categoria: "Carteira e risco",
    apelidos: ["acertar o momento", "acertar a hora", "hora certa", "melhor momento", "melhor hora", "time in the market", "melhores dias", "perder os melhores dias", "trocar o pé", "troca o pé", "trocando o pé"],
    resumo:
      "Tentar acertar a hora de entrar e sair do mercado. Parece intuitivo, mas os melhores dias aparecem colados aos piores, e quem sai na queda costuma perder a volta.",
    texto: [
      "Mando agora ou espero o dólar cair? Saio da bolsa até a eleição passar? Tentar acertar o momento é a tentação mais comum do investidor, e uma das mais caras.",
      "O problema é que poucos dias explicam décadas. Os maiores dias de alta acontecem no meio das crises, e não depois que elas passam: na edição de 2025 do levantamento do J.P. Morgan, sete dos dez melhores dias dos 20 anos anteriores vieram até duas semanas depois de um dos dez piores. Quem vende para esperar passar quase sempre está fora quando a recuperação começa.",
      "A frase que Rodolfo lembra resume: o segredo não é o market timing, é o time in the market.",
    ],
    exemplo:
      "De 2006 a 2025, o S&P 500 com dividendos rendeu 11% ao ano para quem ficou investido. Quem perdeu só os 10 melhores dias, em 20 anos, ficou com 6,6% ao ano e terminou com perto da metade do patrimônio.",
    naPratica:
      "O argumento não é de aposta, é de alocação: a fatia em dólar ou em bolsa deve ser aquela que você consegue carregar na pior semana. É nela que a decisão de sair ou ficar é tomada.",
    relacionados: ["custo-medio", "vies-de-recencia", "retorno-do-investidor", "horizonte-de-investimento", "alocacao-de-ativos"],
    noCurso: [
      { modulo: 0, aula: 4, tempo: "2:25" },
      { modulo: 0, aula: 3, tempo: "25:26" },
    ],
  },
  {
    slug: "horizonte-de-investimento",
    termo: "Horizonte de investimento",
    categoria: "Carteira e risco",
    apelidos: ["horizonte", "diversificação no tempo", "quando o dinheiro será usado"],
    resumo:
      "Por quanto tempo o dinheiro pode ficar aplicado antes de você precisar dele. Define que tipo de oscilação a carteira pode suportar.",
    texto: [
      "Dinheiro para a reforma do ano que vem e dinheiro para a aposentadoria daqui a 30 anos não podem ser investidos do mesmo jeito. O primeiro não pode cair na hora de usar; o segundo pode atravessar várias crises. A diferença é o horizonte.",
      "Prazo longo ajuda, mas não faz o risco sumir. Num horizonte longo, fica menos provável que a bolsa perca da renda fixa, mas o tamanho do estrago nos piores cenários cresce. A chamada diversificação no tempo não é diversificação de verdade: só dá mais tempo para recuperar.",
    ],
    exemplo:
      "Quem converteu reais em dólar no fim de 2024, com o dólar acima de R$ 6, chegou ao fim de 2025 praticamente no zero a zero em reais. Num horizonte de um ano, o câmbio pode anular o rendimento; em décadas, pesa de outra forma.",
    naPratica:
      "Dolarizar faz sentido para a parte do patrimônio que pode atravessar anos de sobe e desce sem ser vendida. Para obra, chamada de capital ou emergências, Rodolfo não recomenda o exterior.",
    relacionados: ["reserva-de-emergencia", "risco-de-base", "duration", "tolerancia-ao-risco", "market-timing"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "26:46" }],
  },
  {
    slug: "reserva-de-emergencia",
    termo: "Reserva de emergência",
    categoria: "Carteira e risco",
    apelidos: ["reservas de emergência", "dinheiro à mão", "emergências do dia a dia"],
    resumo:
      "Dinheiro guardado para imprevistos, como perda de emprego ou uma despesa médica, aplicado em algo seguro e que se resgata na hora, na moeda dos seus gastos.",
    texto: [
      "O carro quebra, a renda some por alguns meses, aparece uma despesa que ninguém previu. A reserva de emergência existe para que você não precise vender investimentos de longo prazo no pior momento.",
      "Ela precisa de três coisas: segurança, liquidez imediata e estar na moeda em que você gasta. A regra de bolso mais citada fala em alguns meses de despesas, mais para quem tem renda instável e menos para quem tem renda muito previsível.",
    ],
    exemplo:
      "Hipotético: uma família gasta R$ 10 mil por mês e decide guardar seis meses de despesas. São R$ 60 mil num pós-fixado de liquidez diária, separados do resto da carteira.",
    naPratica:
      "Para quem gasta em reais, a reserva fica em reais. A aula é clara: dinheiro que vai ser usado logo não deve ficar exposto ao sobe e desce do dólar e da bolsa americana. A dolarização começa depois que a reserva está montada.",
    relacionados: ["horizonte-de-investimento", "liquidez", "tesouro-selic", "fundo-di", "contabilidade-mental"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "26:46" }],
  },
  {
    slug: "perfil-de-investidor",
    termo: "Perfil de investidor",
    categoria: "Carteira e risco",
    apelidos: ["perfil de risco", "suitability", "adequação ao perfil"],
    resumo:
      "A classificação, feita por questionário, de quanto risco uma pessoa pode e quer correr, conforme objetivos, prazo, patrimônio e experiência. Bancos e corretoras são obrigados a fazê-la.",
    texto: [
      "Antes de oferecer um investimento, o banco ou a corretora precisa verificar se ele é adequado a você. Pela regra da CVM, isso passa por um questionário sobre objetivos, prazo, situação financeira e conhecimento, que resulta num perfil, como conservador, moderado ou arrojado. No mercado, o processo se chama suitability.",
      "O questionário é um ponto de partida, não uma sentença. Ele mistura duas coisas que vale separar: a capacidade de correr risco, que depende de patrimônio, renda e prazo, e a disposição, que é temperamento.",
    ],
    exemplo:
      "Hipotético: uma pessoa de 35 anos, com renda estável e 30 anos até se aposentar, tem capacidade alta de correr risco. Se ela vende tudo a cada queda de 10%, a disposição é baixa, e a carteira precisa respeitar as duas coisas.",
    naPratica:
      "O perfil diz quanto risco cabe no total, não onde ele está. Dá para ter um perfil conservador e, ainda assim, querer diversificar moeda: concentrar tudo em reais também é um risco.",
    relacionados: ["tolerancia-ao-risco", "horizonte-de-investimento", "alocacao-de-ativos", "politica-de-investimento"],
  },
  {
    slug: "tolerancia-ao-risco",
    termo: "Tolerância ao risco",
    categoria: "Carteira e risco",
    apelidos: ["capacidade de correr risco", "disposição para o risco", "capacidade e disposição", "estômago", "caber no seu estômago", "aversão ao risco"],
    resumo:
      "Quanto de queda você aguenta sem mudar de rota. Tem duas partes: a capacidade, que é financeira, e a disposição, que é emocional.",
    texto: [
      "Uma pessoa com R$ 50 milhões, sem dívidas e sem precisar do dinheiro, tem capacidade enorme de correr risco. Se ela perde o sono com uma queda de 2%, a disposição é pequena. As duas coisas são diferentes, e uma carteira que ignora qualquer uma delas não dura.",
      "Peter Lynch, que ficou famoso gerindo o fundo Magellan, da Fidelity, dizia que todo mundo tem capacidade intelectual para ganhar dinheiro com ações, mas nem todo mundo tem estômago.",
    ],
    exemplo:
      "O cliente da aula 3, aos 55 anos, vendeu a empresa e ficou com R$ 50 milhões. Perdeu R$ 1 milhão em duas semanas, 2% do patrimônio, e vendeu tudo. Tinha capacidade de sobra; faltou uma carteira que coubesse na disposição dele.",
    naPratica:
      "A fatia em dólar tem de caber no seu estômago. Como a crise vai vir, daqui ou de fora, sem data marcada, só quem não vende no fundo do poço pega a volta.",
    relacionados: ["perfil-de-investidor", "aversao-a-perda", "drawdown", "volatilidade"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "10:27" }],
  },
  {
    slug: "politica-de-investimento",
    termo: "Política de investimento",
    categoria: "Carteira e risco",
    apelidos: ["política de investimentos", "deixar por escrito", "regra escrita", "regra combinada antes", "plano de investimento"],
    resumo:
      "Um documento curto, escrito por você, com objetivos, prazos, divisão entre classes e moedas e regras de revisão. Serve para decidir com calma e cumprir depois.",
    texto: [
      "Fundos de pensão e fundações têm um documento que diz o que podem comprar, em que proporção e quando revisar. Pessoas físicas podem ter a mesma coisa, numa página: para que serve o dinheiro, quanto vai para cada classe e moeda, de quanto em quanto tempo rebalancear e o que fazer numa queda forte.",
      "O valor do documento aparece nas semanas ruins. Uma regra combinada antes protege de três tropeços clássicos: correr atrás do que já subiu, esperar voltar ao preço e ficar parado por medo de errar.",
    ],
    exemplo:
      "Hipotético: 25% do patrimônio investido em dólar, convertido em 12 parcelas mensais, rebalanceado uma vez por ano se a fatia sair da faixa de 20% a 30%, e nenhuma venda por causa de uma queda sem passar uma semana e refazer as contas.",
    naPratica:
      "Quanto dolarizar é decisão de cada um, e zero é uma resposta legítima. O que importa, insiste Rodolfo, é decidir com calma, deixar por escrito e respeitar a decisão depois.",
    relacionados: ["alocacao-de-ativos", "rebalanceamento", "sistema-1-e-sistema-2", "custo-medio"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "0:12" }],
  },
  {
    slug: "liquidez",
    termo: "Liquidez",
    categoria: "Carteira e risco",
    apelidos: ["mais líquido", "liquidez diária", "ilíquido"],
    resumo:
      "A facilidade de transformar um investimento em dinheiro rápido, sem derrubar o preço. Um mercado com mais compradores e vendedores é mais líquido.",
    texto: [
      "Ações de uma grande empresa americana são vendidas em segundos, pelo preço da tela. Um imóvel pode levar meses e exigir desconto. Os dois são investimentos, mas a liquidez é muito diferente.",
      "Liquidez tem duas dimensões: prazo, quanto tempo leva para o dinheiro cair na conta, e custo, quanto do preço você perde para vender rápido. Ela costuma sumir justamente nas crises, quando todos querem vender ao mesmo tempo.",
    ],
    exemplo:
      "Na aula 4, Rodolfo fala em liquidez 46 vezes maior nos Estados Unidos, número que depende do critério e que não conseguimos reproduzir. A direção, porém, não está em dúvida: o mercado americano é o mais líquido do mundo.",
    naPratica:
      "Mais liquidez significa poder entrar e sair com custo menor. Para a reserva de emergência, liquidez é tudo; para o patrimônio de longo prazo, dá para aceitar menos em troca de outras vantagens.",
    relacionados: ["bolsa-de-valores", "reserva-de-emergencia", "custo-total", "horizonte-de-investimento"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "8:05" }],
  },
  {
    slug: "capital-humano",
    termo: "Capital humano",
    categoria: "Carteira e risco",
    apelidos: ["renda do trabalho", "salário em reais"],
    resumo:
      "O valor de hoje de tudo o que você ainda vai ganhar trabalhando. Não aparece no extrato, mas, para quem está na ativa, costuma ser o maior bem que a pessoa tem.",
    texto: [
      "Pense em quanto você ainda vai ganhar até se aposentar, trazido para valores de hoje. Isso é o seu capital humano. Para um profissional no meio da carreira, ele costuma valer mais que todos os investimentos juntos.",
      "E ele anda junto com a economia do país: quando o Brasil vai mal, salários e empregos sofrem junto com as empresas daqui. Na prática, é uma posição em Brasil que você nem escolheu.",
    ],
    exemplo:
      "R$ 120 mil por ano durante 25 anos, trazidos a valor de hoje com juro de 5% ao ano, valem cerca de R$ 1,7 milhão. Somados a R$ 300 mil investidos, mesmo com todos os investimentos fora, 85% do patrimônio total segue atrelado ao Brasil.",
    naPratica:
      "Diversificar começa pelo patrimônio inteiro, não só pela carteira. Quem já tem salário, aposentadoria e imóvel em reais tem mais motivo, e não menos, para olhar a moeda dos investimentos.",
    relacionados: ["risco-de-concentracao", "valor-presente", "diversificacao", "home-bias"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "9:00" }],
  },
  {
    slug: "cisne-negro",
    termo: "Cisne negro",
    categoria: "Carteira e risco",
    apelidos: ["cisnes negros", "evento extremo", "risco de cauda"],
    resumo:
      "Um evento raro, de impacto enorme, que quase ninguém previa e que depois parece óbvio. O termo foi popularizado por Nassim Taleb.",
    texto: [
      "Na Europa, durante séculos, todo cisne era branco, até que se encontraram cisnes negros na Austrália. Nassim Taleb usou a imagem para falar de eventos que os modelos tratam como quase impossíveis e que, quando acontecem, mudam tudo.",
      "Em finanças, a lição é que as caudas, os extremos, são mais gordas do que as médias sugerem. Quedas de 30% num mês acontecem mais do que uma curva bem-comportada faria esperar.",
    ],
    exemplo:
      "A aula chama a pandemia de cisne negro. Em março de 2020, a bolsa brasileira interrompeu os pregões várias vezes, as cadeias globais de produção pararam e o dólar foi de R$ 4,02 no começo do ano a R$ 5,94 em maio.",
    naPratica:
      "Não dá para prever o próximo cisne negro. Dá para montar uma carteira que sobreviva a ele: diversificada entre países e moedas, com reserva à mão e sem precisar vender no pior momento.",
    relacionados: ["drawdown", "risco-sistematico", "diversificacao", "circuit-breaker"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:22:05" }],
  },
  {
    slug: "retorno-do-investidor",
    termo: "Retorno do fundo e retorno do investidor",
    categoria: "Carteira e risco",
    apelidos: ["retorno ponderado pelo tempo", "retorno ponderado pelo dinheiro", "investidor médio", "custo do comportamento", "Dalbar"],
    resumo:
      "O fundo pode render 10% ao ano e o investidor dele ganhar bem menos, porque entrou depois das altas e saiu nas quedas. A distância é o custo do comportamento.",
    texto: [
      "Imagine um fundo que rendeu 10% ao ano numa década. Esse é o retorno do fundo: o que ganhou quem entrou no primeiro dia e não mexeu mais. Agora pense no investidor que aplicou depois de um ano bom e resgatou no meio de uma queda. O fundo rendeu 10%, mas ele ganhou bem menos.",
      "No mercado, o primeiro número se chama retorno ponderado pelo tempo; o segundo, retorno ponderado pelo dinheiro. Estudos como os da Dalbar apontam distâncias grandes; contas mais cuidadosas, como as da Morningstar, encontram de um a dois pontos por ano.",
    ],
    exemplo:
      "Segundo um gráfico do J.P. Morgan com dados da Dalbar, de 2002 a 2021 o investidor médio em fundos americanos rendeu menos que a bolsa, que a renda fixa e que uma simples carteira 60/40.",
    naPratica:
      "O retorno que importa é o da sua conta, em reais e com o câmbio do dia de cada aporte, e ele depende do seu comportamento. Regras escritas e aportes regulares existem para encurtar essa distância.",
    relacionados: ["market-timing", "vies-de-recencia", "efeito-manada", "politica-de-investimento"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "4:06" }],
  },
  // ==== COMPORTAMENTO ===========================================================================
  {
    slug: "financas-comportamentais",
    termo: "Finanças comportamentais",
    categoria: "Comportamento",
    apelidos: ["economia comportamental", "vieses", "viés", "vieses comportamentais", "vieses cognitivos"],
    resumo:
      "O estudo de como as pessoas decidem sobre dinheiro na vida real, com atalhos mentais e emoções, e não como a calculadora racional dos modelos clássicos.",
    texto: [
      "Os modelos clássicos de finanças supõem um investidor que pesa probabilidades com frieza. Os psicólogos Daniel Kahneman e Amos Tversky mostraram, a partir dos anos 1970, que as pessoas erram de jeitos previsíveis: dão peso demais a perdas, se ancoram em números irrelevantes, seguem a multidão.",
      "Esses erros sistemáticos se chamam vieses. Kahneman ganhou o Nobel de Economia em 2002, e Richard Thaler, outro nome central da área, em 2017.",
      "Na aula 3, Rodolfo Bastos usa as finanças comportamentais para responder por que o brasileiro deixa quase tudo em casa: não é o juro, é o jeito como o cérebro decide.",
    ],
    exemplo:
      "O cliente da aula vendeu tudo depois de perder R$ 1 milhão, 2% do patrimônio, e ficou na renda fixa. Quando o mercado voltou, a maior parte da alta já tinha passado. Nenhuma planilha recomendaria aquela decisão; o medo, sim.",
    naPratica:
      "Conhecer os vieses não imuniza ninguém, mas ajuda a criar defesas: decidir antes, com calma, deixar por escrito e impor uma pausa entre o susto e a ordem de venda.",
    relacionados: ["sistema-1-e-sistema-2", "aversao-a-perda", "vies-de-ancoragem", "home-bias", "vies-de-recencia"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "11:35" }],
  },
  {
    slug: "sistema-1-e-sistema-2",
    termo: "Sistema 1 e sistema 2",
    categoria: "Comportamento",
    apelidos: ["sistema 1", "sistema 2", "Rápido e devagar", "dois sistemas"],
    resumo:
      "Os dois modos de pensar descritos por Daniel Kahneman: o sistema 1, rápido, automático e emocional, e o sistema 2, lento, analítico e trabalhoso.",
    texto: [
      "Você ouve uma buzina e pula para trás antes de pensar: é o sistema 1. Você calcula 17 vezes 24 de cabeça, com esforço: é o sistema 2. Kahneman descreve os dois no livro Rápido e devagar.",
      "O sistema 1 funciona no automático e produz impressões e reações. O sistema 2 faz contas e compara, mas cansa, e por isso costuma aceitar o que o primeiro sugere sem conferir. Muitas vezes, chega só depois, para justificar o que já foi decidido.",
      "Para atravessar a rua, o sistema 1 é perfeito. Para investir, quase nunca há pressa, e dá tempo de chamar o sistema 2.",
    ],
    exemplo:
      "Uma queda forte da bolsa ou uma disparada do dólar acordam o sistema 1, que pede para vender ou comprar já. O sistema 2 perguntaria: o que mudou no motivo que me fez investir?",
    naPratica:
      "Decida antes, com calma, quanto do patrimônio fica em cada classe e moeda, e combine com você mesmo que todo susto passa por uma pausa e uma conta antes de virar ordem.",
    relacionados: ["financas-comportamentais", "heuristica", "problema-do-taco-e-da-bola", "politica-de-investimento"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "11:35" }],
  },
  {
    slug: "heuristica",
    termo: "Heurística",
    categoria: "Comportamento",
    apelidos: ["heurísticas", "busca por atalho", "atalho mental", "atalhos mentais"],
    resumo:
      "Um atalho mental: trocar uma pergunta difícil por uma fácil e responder a fácil. Economiza esforço, mas leva a erros sistemáticos.",
    texto: [
      "Perguntam se você deve investir lá fora, uma pergunta difícil, sobre concentração de risco, moedas e horizonte. A cabeça troca por uma fácil: o juro aqui é alto? Responde que sim e encerra o assunto. Isso é uma heurística, ou busca por atalho.",
      "Tversky e Kahneman catalogaram várias: a da ancoragem, a da disponibilidade (julgar a frequência pelo que vem fácil à memória), a da representatividade (julgar pela semelhança com um estereótipo). Na maior parte da vida, funcionam bem. Em decisões de dinheiro, cobram caro.",
    ],
    exemplo:
      "O juro aqui é alto, então não preciso olhar para fora: a taxa responde a uma pergunta que era sobre concentração de risco.",
    naPratica:
      "Antes de decidir, escreva qual é a pergunta de verdade. Se a resposta que você deu responde a outra pergunta, mais fácil, o atalho está agindo.",
    relacionados: ["sistema-1-e-sistema-2", "vies-de-ancoragem", "problema-do-taco-e-da-bola", "financas-comportamentais"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "14:57" }],
  },
  {
    slug: "problema-do-taco-e-da-bola",
    termo: "Problema do taco e da bola",
    categoria: "Comportamento",
    apelidos: ["taco e a bola", "taco e da bola", "taco e bola", "teste de reflexão cognitiva"],
    resumo:
      "Um enigma simples que a maioria das pessoas erra por responder no automático. Mostra como a intuição tropeça até em contas de centavos.",
    texto: [
      "Um taco e uma bola custam R$ 1,10. O taco custa R$ 1,00 a mais que a bola. Quanto custa a bola? Se você pensou em 10 centavos, está em ótima companhia, e errou. Com a bola a 10 centavos, o taco custaria R$ 1,10 e os dois juntos, R$ 1,20. A conta só fecha com a bola a 5 centavos e o taco a R$ 1,05.",
      "O problema faz parte do teste de reflexão cognitiva, criado pelo economista Shane Frederick. Kahneman conta que mais da metade dos alunos de Harvard, MIT e Princeton dá a resposta errada; em universidades menos disputadas, mais de 80%.",
    ],
    exemplo:
      "Na aula, Rodolfo admite que ele e colegas que mexem com números o dia inteiro também caem nessa.",
    naPratica:
      "Se a intuição tropeça numa conta de centavos, imagine numa decisão sobre o seu patrimônio, tomada com medo ou com euforia. É mais um motivo para decidir devagar.",
    relacionados: ["sistema-1-e-sistema-2", "heuristica", "excesso-de-confianca"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "13:23" }],
  },
  {
    slug: "vies-de-ancoragem",
    termo: "Viés de ancoragem",
    categoria: "Comportamento",
    apelidos: ["ancoragem", "ancorado", "ancorada", "âncora mental", "esperar voltar ao preço"],
    resumo:
      "A tendência de usar um número visto antes, mesmo irrelevante, como referência para a decisão seguinte. No câmbio, a última cotação vira a régua do preço justo.",
    texto: [
      "Num experimento famoso de Kahneman e Tversky, as pessoas giravam uma roleta viciada, que parava no 10 ou no 65, e depois chutavam quantos países da ONU eram africanos. Quem tinha visto o 10 respondia, tipicamente, 25%. Quem tinha visto o 65, 45%. Um número sem nada a ver com a pergunta puxou a resposta.",
      "No dinheiro, as âncoras estão por toda parte: o preço que você pagou numa ação, a cotação do dólar no mês passado, o valor de um imóvel no auge.",
    ],
    exemplo:
      "Não vou mandar agora, que está a 5,20; vou esperar voltar a 4,90. Está a 6, vou esperar 5,70. A cotação recente vira o preço justo, e a decisão fica para sempre adiada.",
    naPratica:
      "Não existe preço certo do dólar para começar. Converter em janelas, com datas marcadas, tira a âncora da decisão.",
    relacionados: ["custo-medio", "heuristica", "market-timing", "vies-de-recencia"],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "14:16" },
      { modulo: 0, aula: 3, tempo: "25:26" },
    ],
  },
  {
    slug: "aversao-a-perda",
    termo: "Aversão à perda",
    categoria: "Comportamento",
    apelidos: ["aversão a perdas", "aversão às perdas", "medo de perder"],
    resumo:
      "A dor de perder pesa mais que o prazer de ganhar o mesmo valor, cerca de duas vezes mais. Faz o investidor vender no fundo e evitar riscos que valeriam a pena.",
    texto: [
      "Alguém te oferece uma aposta: cara, você ganha R$ 100; coroa, perde R$ 100. A maioria recusa. Para aceitar, as pessoas costumam exigir ganhar perto de R$ 200 se der cara. Isso é aversão à perda.",
      "Kahneman e Tversky mediram o efeito: uma perda pesa cerca de 2,25 vezes um ganho do mesmo tamanho. E ela é sentida em reais, não em percentual: a cabeça não pensa no pedaço da carteira, pensa no valor perdido.",
    ],
    exemplo:
      "O cliente da aula, com R$ 50 milhões, perdeu R$ 1 milhão em duas semanas. Era 2% do patrimônio, mas pesou como um milhão inteiro: perdi em duas semanas o que demorei 30 anos para fazer. Vendeu para defender os 49 que sobraram.",
    naPratica:
      "A aversão à perda aparece duas vezes na dolarização: no medo de converter e ver o dólar cair no dia seguinte, e na vontade de vender tudo na primeira queda. Tamanho de posição que caiba no estômago é a defesa.",
    relacionados: ["teoria-do-prospecto", "tolerancia-ao-risco", "efeito-disposicao", "aversao-ao-arrependimento", "drawdown"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "7:48" }],
  },
  {
    slug: "teoria-do-prospecto",
    termo: "Teoria do prospecto",
    categoria: "Comportamento",
    apelidos: ["prospect theory", "função de valor", "ponto de referência"],
    resumo:
      "A teoria de Kahneman e Tversky sobre como as pessoas decidem sob risco: avaliam ganhos e perdas a partir de um ponto de referência, e as perdas pesam mais.",
    texto: [
      "A teoria clássica diz que você avalia uma decisão pelo patrimônio final. Kahneman e Tversky mostraram outra coisa: as pessoas olham para mudanças, ganhos e perdas, a partir de um ponto de referência, como o preço de compra ou o saldo do mês passado.",
      "A curva que descreve isso desce mais depressa do lado das perdas do que sobe do lado dos ganhos. E tem outro detalhe: diante de ganhos, as pessoas evitam risco; diante de perdas, passam a aceitar riscos maiores para tentar recuperar.",
    ],
    exemplo:
      "Hipotético: você comprou dólar a R$ 5,50 e ele está a R$ 5,00. Mesmo que a decisão de longo prazo continue de pé, a referência de R$ 5,50 faz cada dia abaixo dela parecer um prejuízo a ser desfeito.",
    naPratica:
      "O ponto de referência é arbitrário. Avaliar a parte em dólar pelo papel que ela cumpre no patrimônio, e não pelo preço de compra, ajuda a sair dessa armadilha.",
    relacionados: ["aversao-a-perda", "efeito-disposicao", "vies-de-ancoragem", "financas-comportamentais"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "7:48" }],
  },
  {
    slug: "efeito-manada",
    termo: "Efeito manada",
    categoria: "Comportamento",
    apelidos: ["manada", "comportamento de manada", "seguir a multidão", "FOMO", "medo de ficar de fora", "fear of missing out"],
    resumo:
      "Fazer o que os outros estão fazendo, por conforto ou por medo de ficar de fora. No mercado, empurra preços para cima nas euforias e para baixo nos pânicos.",
    texto: [
      "O restaurante cheio parece melhor que o vazio ao lado, mesmo sem você saber nada dos dois. Seguir a multidão é um atalho razoável na vida. No mercado, é caro: quando todo mundo já comprou, o preço já subiu.",
      "O motor emocional costuma ter nome em inglês: FOMO, fear of missing out, o medo de ficar de fora ao ver outros ganhando com algo que você não tem. Ele aparece perto dos topos, quando a alta já é assunto de todo mundo.",
      "O efeito manada alimenta bolhas e quedas exageradas. E tem uma versão silenciosa: ficar parado porque todo mundo à sua volta também está.",
    ],
    exemplo:
      "Dolarizar quando todo mundo fala de dólar, quase sempre depois de uma alta, e desistir quando o assunto esfria. É o caminho mais comum para comprar caro e vender barato.",
    naPratica:
      "A decisão de ter uma parte em dólar não deveria depender do assunto da semana. Uma regra combinada antes, como converter em parcelas mensais, protege de correr atrás do que já subiu.",
    relacionados: ["bolha", "vies-de-recencia", "retorno-do-investidor"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "14:57" }],
  },
  {
    slug: "vies-de-recencia",
    termo: "Viés de recência",
    categoria: "Comportamento",
    apelidos: ["recência", "efeito recência", "olhar o retrovisor"],
    resumo:
      "Dar peso demais ao que acabou de acontecer e projetar isso para a frente. Faz o investidor comprar a classe que acabou de subir e vender a que acabou de cair.",
    texto: [
      "Depois de um ano ótimo da bolsa, parece óbvio que ela vai continuar subindo; depois de um ano ruim, que vai continuar caindo. A memória recente pesa mais que décadas de história. Isso é o viés de recência.",
      "O resultado é chegar sempre um ano atrasado à classe que acabou de subir, e ficar com o pior de cada uma.",
    ],
    exemplo:
      "Quem montou uma carteira em janeiro de 2009, olhou para trás e foi para a renda fixa, depois para a bolsa em 2011 e de volta à renda fixa em 2012, trocando sempre para o que tinha acabado de ganhar, transformou US$ 100 em uns US$ 101 até o fim de 2012. A carteira 60/40, só rebalanceada, chegou a US$ 149.",
    naPratica:
      "Julgar a dolarização pelo último ano do dólar é recência pura. A pergunta certa não muda com a cotação: quanto do seu patrimônio você quer depender de uma só moeda?",
    relacionados: ["market-timing", "carteira-60-40", "efeito-manada", "vies-de-ancoragem", "retorno-do-investidor"],
    noCurso: [
      { modulo: 0, aula: 3, tempo: "14:57" },
      { modulo: 0, aula: 3, tempo: "28:53" },
    ],
  },
  {
    slug: "regra-do-pico-fim",
    termo: "Regra do pico-fim",
    categoria: "Comportamento",
    apelidos: ["pico-fim", "efeito pico-fim"],
    resumo:
      "A lembrança de uma experiência fica marcada pelo momento mais intenso e pelo final, e não pela média de tudo o que aconteceu.",
    texto: [
      "Em experimentos de Kahneman, pessoas que passaram por um desconforto um pouco mais longo, mas que terminava de forma mais leve, lembravam da experiência como menos ruim do que as que tiveram um desconforto mais curto que terminava no auge. A memória guarda o pico e o fim.",
      "Com investimentos, isso distorce o julgamento: um mês terrível ou um final ruim podem apagar anos de bons resultados.",
    ],
    exemplo:
      "Julgar o investimento lá fora pelo mês em que o dólar caiu logo depois da compra, e não pelo resultado de anos.",
    naPratica:
      "Avalie a parte em dólar por janelas longas e pelo papel que ela cumpre no patrimônio. Registrar por escrito o motivo da decisão ajuda a não reescrever a história pelo último susto.",
    relacionados: ["vies-de-recencia", "aversao-a-perda", "financas-comportamentais"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "14:57" }],
  },
  {
    slug: "home-bias",
    termo: "Home bias",
    categoria: "Comportamento",
    apelidos: ["viés doméstico", "viés de casa", "home-country bias", "preferir o que é familiar"],
    resumo:
      "A mania de deixar no próprio país uma fatia da carteira muito maior do que o peso desse país no mundo. Acontece em toda parte; o brasileiro está no extremo.",
    texto: [
      "O termo nasceu para falar de países. Americanos, japoneses e britânicos guardavam quase todas as ações em empresas de casa, bem acima do peso desses mercados no mundo. E até hoje ninguém achou um custo ou um imposto que explique um viés tão grande e tão teimoso.",
      "Dá para medir numa escala de zero a um: zero é quem investe com os pesos do mundo; um é quem deixa tudo em casa. O viés vale até para países ricos e de juro baixo, o que derruba a explicação de que a culpa é do juro alto.",
      "Em versão menor, aparece no dono de construtora que investe em imóveis e no executivo de petroleira que compra óleo e gás: o conforto do conhecido.",
    ],
    exemplo:
      "Em 2008, a bolsa brasileira era 1,6% do mundo, e o brasileiro tinha 99% das suas ações aqui. Na escala, isso dá 0,98. O americano tinha 77% em casa, num mercado que era um terço do mundo; o canadense, 80%, num mercado de menos de 3%.",
    naPratica:
      "A medida não aponta um alvo, e o curso não propõe um. Ela só mostra que ter tudo em casa já é uma aposta concentrada, e não um ponto de partida neutro.",
    relacionados: ["risco-de-concentracao", "diversificacao", "msci-acwi", "capital-humano", "vies-do-status-quo"],
    noCurso: [{ modulo: 0, aula: 3, tempo: "15:56" }],
  },
  {
    slug: "vies-de-confirmacao",
    termo: "Viés de confirmação",
    categoria: "Comportamento",
    apelidos: ["viés da confirmação"],
    resumo:
      "A tendência de procurar, notar e lembrar só as informações que confirmam o que você já pensa, e de desprezar as que contrariam.",
    texto: [
      "Quem acha que o Brasil vai dar errado lê cada notícia ruim como prova; quem acha que vai dar certo, cada notícia boa. Os dois leem o mesmo jornal e saem mais convencidos. É o viés de confirmação.",
      "Em investimento, ele transforma uma tese em fé: você para de procurar sinais de que pode estar errado, justamente os que mais importam.",
    ],
    exemplo:
      "Hipotético: você decidiu não dolarizar porque o real ia se fortalecer. Cada semana de dólar em queda reforça a decisão; as semanas de alta viram ruído. Três anos depois, você nem lembra mais quais eram os argumentos do outro lado.",
    naPratica:
      "O curso insiste que o eixo não é decadência do Brasil, e sim concentração de risco. Isso protege da armadilha: não é preciso acertar uma tese sobre o país para diversificar.",
    relacionados: ["excesso-de-confianca", "vies-de-retrospectiva", "financas-comportamentais", "heuristica"],
  },
  {
    slug: "excesso-de-confianca",
    termo: "Excesso de confiança",
    categoria: "Comportamento",
    apelidos: ["overconfidence", "confiança excessiva"],
    resumo:
      "Superestimar o próprio conhecimento e a capacidade de prever. Leva a negociar demais, concentrar demais e subestimar riscos.",
    texto: [
      "Peça a motoristas que se avaliem e a maioria vai se dizer acima da média, o que é impossível. Com investimentos é igual: quase todo mundo acha que escolhe ações ou acerta o dólar melhor que os outros.",
      "Um estudo clássico de Brad Barber e Terrance Odean, com dezenas de milhares de contas de corretora americanas, mostrou que os investidores que mais negociavam ficavam vários pontos por ano atrás dos que quase não mexiam. O título resume: negociar faz mal ao seu patrimônio.",
    ],
    exemplo:
      "Hipotético: depois de acertar duas vezes a direção do dólar, um investidor passa a converter e desconverter a cada notícia. Cada operação paga spread e IOF, e a terceira previsão erra.",
    naPratica:
      "Ninguém acerta o câmbio com regularidade. Uma estratégia que não depende de previsão, como alocação definida e conversão em parcelas, é mais robusta que confiar no próprio palpite.",
    relacionados: ["vies-de-confirmacao", "market-timing", "gestao-ativa", "vies-de-retrospectiva"],
  },
  {
    slug: "contabilidade-mental",
    termo: "Contabilidade mental",
    categoria: "Comportamento",
    apelidos: ["contas mentais", "gavetas mentais"],
    resumo:
      "Tratar o dinheiro como se estivesse em gavetas separadas, com regras diferentes para cada uma, mesmo sendo tudo do mesmo bolso.",
    texto: [
      "Você paga juros de cheque especial enquanto mantém uma aplicação intocável para as férias. Financeiramente não faz sentido, mas a cabeça vê duas contas diferentes. Richard Thaler, Nobel de Economia, chamou isso de contabilidade mental.",
      "Ela tem um lado ruim, quando faz você ignorar o patrimônio como um todo, e um lado útil: separar dinheiro por objetivo ajuda a não gastar a reserva e a aguentar a oscilação da parte de longo prazo.",
    ],
    exemplo:
      "Hipotético: uma pessoa tem 30% em dólar e trata essa parte como aposta, conferindo todo dia. Se pensasse nela como a gaveta da aposentadoria, olharia uma vez por ano.",
    naPratica:
      "Use a contabilidade mental a seu favor: uma gaveta para a reserva em reais, outra para objetivos com data, outra para o longo prazo, onde mora a dolarização. Mas olhe também o conjunto, que inclui salário e imóvel.",
    relacionados: ["reserva-de-emergencia", "horizonte-de-investimento", "capital-humano", "financas-comportamentais"],
  },
  {
    slug: "efeito-disposicao",
    termo: "Efeito disposição",
    categoria: "Comportamento",
    resumo:
      "A tendência de vender cedo o que está dando lucro e segurar demais o que está dando prejuízo, à espera de voltar ao preço de compra.",
    texto: [
      "Você tem duas ações. Uma subiu 30%, a outra caiu 30%. Precisa de dinheiro. A maioria vende a que subiu, para realizar o ganho, e guarda a que caiu, para não admitir a perda. Os economistas Hersh Shefrin e Meir Statman chamaram isso de efeito disposição.",
      "É filho direto da aversão à perda e do ponto de referência: vender no prejuízo transforma uma perda de papel numa perda de verdade, e isso dói.",
    ],
    exemplo:
      "Hipotético: o dólar comprado a R$ 5,80 está a R$ 5,20. O investidor decide só mexer quando voltar a R$ 5,80, mesmo que a necessidade dele tenha mudado. O preço de compra virou a regra de decisão.",
    naPratica:
      "O mercado não sabe por quanto você comprou. A pergunta útil é se, com o dinheiro na mão hoje, você montaria a mesma posição.",
    relacionados: ["aversao-a-perda", "teoria-do-prospecto", "vies-de-ancoragem"],
  },
  {
    slug: "vies-do-status-quo",
    termo: "Viés do status quo",
    categoria: "Comportamento",
    apelidos: ["status quo", "inércia", "ficar parado"],
    resumo:
      "A preferência por deixar as coisas como estão, mesmo quando mudar seria melhor. Não decidir parece neutro, mas também é uma decisão.",
    texto: [
      "Planos de previdência de empresas americanas descobriram que, quando a adesão é automática, quase todo mundo fica; quando é preciso pedir para entrar, muita gente nunca pede. A opção padrão vence. É o viés do status quo, descrito por William Samuelson e Richard Zeckhauser.",
      "Ele reforça o home bias: o patrimônio começa em reais, porque a vida começa em reais, e lá fica, sem que ninguém tenha escolhido.",
    ],
    exemplo:
      "Hipotético: um investidor estuda o tema por três anos, concorda com os argumentos e não converte nada, sempre esperando um momento melhor. A inércia decidiu por ele: 100% em reais.",
    naPratica:
      "Quanto dolarizar é escolha de cada um, e zero é uma resposta legítima. O problema não é o zero, é chegar nele sem ter decidido.",
    relacionados: ["home-bias", "aversao-ao-arrependimento", "custo-medio", "politica-de-investimento"],
  },
  {
    slug: "vies-de-retrospectiva",
    termo: "Viés de retrospectiva",
    categoria: "Comportamento",
    apelidos: ["hindsight bias", "eu já sabia", "efeito eu já sabia"],
    resumo:
      "A sensação, depois que algo acontece, de que era previsível desde o começo. Faz o investidor confiar demais na própria capacidade de prever.",
    texto: [
      "Depois de 2008, todos sabiam que havia uma bolha imobiliária. Depois da pandemia, todos sabiam que um vírus parava o mundo. Antes, quase ninguém agiu. A memória reescreve o passado para parecer óbvio, e isso se chama viés de retrospectiva.",
      "O perigo é a lição errada: se o passado parece previsível, o futuro também parece, e o investidor passa a apostar em previsões.",
    ],
    exemplo:
      "Hipotético: olhando o gráfico do dólar de 1994 a 2026, a alta parece uma escada óbvia. No caminho, houve anos de real forte, como de 2003 a 2011, em que dolarizar parecia um erro.",
    naPratica:
      "Os gráficos do curso mostram o passado, não garantem o futuro. O argumento para diversificar não depende de o dólar subir: depende de não saber o que vai acontecer.",
    relacionados: ["excesso-de-confianca", "vies-de-confirmacao", "cisne-negro", "market-timing"],
  },
  {
    slug: "aversao-ao-arrependimento",
    termo: "Aversão ao arrependimento",
    categoria: "Comportamento",
    apelidos: ["medo de errar", "arrependimento", "medo de se arrepender"],
    resumo:
      "Evitar decisões para não sentir o arrependimento de ter errado. Paralisa: não converter o dólar hoje porque ele pode cair amanhã.",
    texto: [
      "Errar por ter agido costuma doer mais que errar por ter ficado parado. Se você converte e o dólar cai, a culpa parece sua; se não converte e ele sobe, parece azar. Por isso muita gente prefere não decidir.",
      "O efeito é mais forte quando a decisão é grande e de uma vez só. Dividir a decisão em partes reduz o tamanho de cada possível arrependimento.",
    ],
    exemplo:
      "Hipotético: com R$ 120 mil para converter, um investidor adia por medo de pegar o pior dia. Em 12 parcelas de R$ 10 mil, nenhuma conversão sozinha pode ser o grande erro.",
    naPratica:
      "As janelas de conversão da aula 4 funcionam também como remédio para o arrependimento: abrem mão do melhor dia para escapar do pior, e tiram a decisão do campo da emoção.",
    relacionados: ["custo-medio", "aversao-a-perda", "vies-do-status-quo", "market-timing"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "1:23" }],
  },
  {
    slug: "bolha",
    termo: "Bolha",
    categoria: "Comportamento",
    apelidos: ["bolhas", "bolha especulativa", "bolha da internet", "bolha imobiliária"],
    resumo:
      "Quando o preço de um ativo sobe muito acima do que os fundamentos justificam, puxado pela expectativa de que vai continuar subindo, até que estoura.",
    texto: [
      "Na Holanda de 1637, bulbos de tulipa chegaram a ser trocados por preços de casas. Nos anos 1990, empresas de internet sem lucro valiam bilhões. Nos anos 2000, casas nos Estados Unidos só subiam. Em todos os casos, as pessoas compravam porque o preço subia, e o preço subia porque as pessoas compravam.",
      "Bolhas são fáceis de ver depois e difíceis de identificar antes, porque sempre há uma história convincente de que desta vez é diferente. Quando estouram, a queda costuma ser rápida e profunda.",
    ],
    exemplo:
      "Em março de 2000, 87% do Nasdaq 100 estava em tecnologia e comunicações. O índice caiu 64% nos 21 meses seguintes.",
    naPratica:
      "Ninguém precisa adivinhar bolhas para se proteger delas: basta não concentrar o patrimônio numa única tese, setor ou país. Trocar a concentração brasileira por uma concentração em tecnologia americana não resolve o problema.",
    relacionados: ["efeito-manada", "nasdaq", "risco-de-concentracao", "afrouxamento-quantitativo"],
    noCurso: [{ modulo: 0, aula: 4, tempo: "14:31" }],
  },
  // FIM-DOS-VERBETES
];

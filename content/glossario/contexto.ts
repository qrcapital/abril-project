import type { Verbete } from "@/lib/glossario";

// Verbetes de contexto: macro e contas públicas, história do Brasil, acesso, contas e impostos,
// cripto e tecnologia. Em produção (07/out/2026).
//
// CONFERÊNCIA (07/out/2026). Datas e números de história e de contas públicas vêm do Banco Central
// (SGS, Museu de Valores, notas do Copom), do IBGE, do Tesouro e do Planalto (texto das leis e
// decretos), os mesmos usados nos notebooks do Módulo I. Regras de acesso e de imposto conferidas no
// texto em vigor: Lei 14.754/2023 e Decreto 6.306/2007 com a redação do Decreto 12.499/2025 (IOF:
// 1,1% na remessa para investir em nome próprio, 3,5% em espécie, cartão e conta de disponibilidade),
// Resolução BCB 279/2022 (CBE anual acima de US$ 1 milhão), IRS (estate tax de não residente acima de
// US$ 60 mil), Lei 15.270/2025 (IR mínimo e dividendos), Resoluções BCB 519 a 521/2025 (prestadoras de
// ativos virtuais, em vigor desde 2/fev/2026). Ratings: S&P BB, Fitch BB e Moody's Ba1 em 2026.
// Onde a regra muda com frequência ou não foi possível conferir o número, o verbete fica sem ele.
//
// Tom: docs/TOM-DO-NOTEBOOK.md. Sem travessão, sem recomendação de alocação, sem tom político.

export const VERBETES_CONTEXTO: Verbete[] = [
  // =============================================================================================
  // MACRO E CONTAS PÚBLICAS
  // =============================================================================================
  {
    slug: "pib",
    termo: "Produto Interno Bruto",
    sigla: "PIB",
    categoria: "Macro e contas públicas",
    apelidos: ["PIBs", "produto interno", "PIB mundial", "PIB per capita"],
    resumo:
      "O valor de tudo o que um país produz num período, de pão a software. É a régua mais usada para medir o tamanho de uma economia e quanto ela cresce.",
    texto: [
      "Pense em tudo o que foi produzido no Brasil num ano: a soja colhida, o carro montado, a consulta médica, o aplicativo vendido. Some o valor de cada coisa, sem contar duas vezes o que virou insumo de outra, e você tem o PIB.",
      "Ele pode ser medido em reais correntes, inflados pelos preços, ou em termos reais, descontada a inflação. Quando o jornal diz que o PIB cresceu 2%, fala da conta real: a economia produziu 2% a mais em quantidade, não em preço.",
      "Para comparar países, o PIB é convertido em dólar, e aí o câmbio pesa muito. Um real mais fraco encolhe o PIB brasileiro medido em dólar mesmo que nada tenha mudado dentro do país. Dividido pela população, vira o PIB per capita, um retrato aproximado da renda média.",
    ],
    exemplo:
      "Pelas projeções do FMI para 2026, o Brasil produz cerca de US$ 2,6 trilhões, contra US$ 126 trilhões do mundo inteiro: perto de 2%. Em 2015, o PIB brasileiro caiu 3,5% em termos reais; em 2025, cresceu 2,3%.",
    naPratica:
      "Se o Brasil é perto de 2% da economia mundial, 98% da riqueza produzida, das empresas e das oportunidades estão fora daqui. Ter tudo aplicado no país é concentrar o patrimônio numa fatia pequena do mundo, por mais que ela seja a sua casa.",
    relacionados: ["crescimento-potencial", "produtividade", "divida-pib", "convergencia-condicional", "home-bias"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "3:49" },
      { modulo: 0, aula: 2 },
      { modulo: 0, aula: 3, tempo: "4:57" },
    ],
  },
  {
    slug: "crescimento-potencial",
    termo: "Crescimento potencial",
    categoria: "Macro e contas públicas",
    apelidos: ["PIB potencial", "crescimento de longo prazo", "potencial de crescimento"],
    resumo:
      "Quanto uma economia consegue crescer por ano sem acelerar a inflação, usando bem o que tem de gente, máquinas e tecnologia. É o ritmo de cruzeiro, não o pico de um ano bom.",
    texto: [
      "Um carro pode passar de 180 km/h numa reta, mas não aguenta esse ritmo a viagem inteira. Com a economia é igual. Num ano de safra recorde ou de juro baixo, o PIB pode crescer acima do normal. Se o ritmo for mais rápido do que a capacidade de produzir, os preços começam a subir.",
      "Esse ritmo sustentável é o crescimento potencial. Ele depende de três coisas: quantas pessoas trabalham, quanto capital elas têm à mão (máquinas, estradas, computadores) e quão bem tudo isso é combinado, o que os economistas chamam de produtividade.",
      "No Brasil, as estimativas do potencial costumam ficar perto de 2% ao ano, bem abaixo do que o país cresceu nos anos 1960 e 1970. Com a população em idade de trabalhar parando de crescer, o potencial passa a depender cada vez mais de produtividade.",
    ],
    exemplo:
      "Hipotético: um país cresce 4% num ano, mas o potencial dele é 2%. Fábricas operam no limite, falta mão de obra, salários e preços sobem, e o banco central reage com juro mais alto. No ano seguinte o crescimento volta para perto dos 2%.",
    naPratica:
      "O crescimento potencial é um teto para o lucro das empresas do país no longo prazo e para a capacidade do governo de pagar a dívida sem aperto. Um potencial baixo não significa bolsa ruim, mas é um dos motivos para não depender de uma só economia.",
    relacionados: ["pib", "produtividade", "bonus-demografico", "demografia", "convergencia-condicional"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "30:33" }],
  },
  {
    slug: "produtividade",
    termo: "Produtividade",
    categoria: "Macro e contas públicas",
    apelidos: ["produtividade do trabalho", "produtividade total dos fatores", "PTF", "ganho de produtividade"],
    resumo:
      "Quanto se produz com o mesmo esforço. Quando sobe, o país fica mais rico sem precisar de mais gente nem de mais horas de trabalho. É o motor do crescimento de longo prazo.",
    texto: [
      "Um agricultor que colhia 30 sacas por hectare e passa a colher 60, com a mesma terra e o mesmo trabalho, dobrou a produtividade. A diferença veio de semente melhor, de técnica, de máquina, de organização.",
      "Os economistas medem de dois jeitos. A produtividade do trabalho é quanto cada pessoa ocupada produz. A produtividade total dos fatores é o que sobra do crescimento depois de descontar o aumento de gente e de máquinas: é a parte que vem de tecnologia, de instituições e de eficiência.",
      "No longo prazo, quase toda a diferença de renda entre países ricos e pobres é diferença de produtividade. E ela anda devagar: depende de educação, de infraestrutura, de crédito, de competição e de regras estáveis.",
    ],
    exemplo:
      "O agronegócio brasileiro é o caso clássico. Com pesquisa, sementes adaptadas ao cerrado e mecanização, a produção de grãos cresceu muito mais do que a área plantada nas últimas décadas.",
    naPratica:
      "Parte dos setores em que a produtividade mais cresce hoje, como software, semicondutores e inteligência artificial, quase não tem empresas listadas na bolsa brasileira. Para ter exposição a eles, o caminho passa pelo exterior.",
    relacionados: ["crescimento-potencial", "pib", "convergencia-condicional", "instituicoes", "inteligencia-artificial"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "30:33" }],
  },
  {
    slug: "convergencia-condicional",
    termo: "Convergência condicional",
    categoria: "Macro e contas públicas",
    apelidos: ["convergência", "convergência absoluta", "estado estacionário", "teto de renda"],
    resumo:
      "A ideia de que cada país corre em direção ao próprio teto de renda, definido por suas instituições, educação e contas públicas, e não necessariamente em direção aos países ricos.",
    texto: [
      "Existe uma intuição popular: país pobre cresce mais rápido porque tem mais espaço para correr atrás. Os dados mostram que isso só vale com uma condição. Coreia do Sul e Gana tinham renda parecida nos anos 1960; uma virou país rico, a outra não.",
      "A explicação é que cada economia tem o seu ponto de chegada, um nível de renda que as suas instituições, a escolaridade, a poupança e a estabilidade permitem. O país cresce mais depressa quanto mais longe está desse ponto, e não quanto mais longe está dos Estados Unidos.",
      "E o caminho é lento. Pelos estudos clássicos de Robert Barro e Xavier Sala-i-Martin, a distância costuma fechar cerca de 2% por ano, o que dá algo como 35 anos para percorrer metade do trajeto.",
    ],
    exemplo:
      "Hipotético: dois países com a mesma renda hoje. Um tem contas públicas equilibradas, escola boa e regras estáveis; o outro, não. O primeiro tem um teto alto e cresce rápido por décadas. O segundo para perto do teto baixo que suas instituições permitem, mesmo sendo pobre.",
    naPratica:
      "Ser emergente não garante crescer mais. Para quem investe, o recado é de concentração, não de pessimismo: apostar tudo em um país é apostar que o teto dele vai subir. E vale o cuidado inverso: crescimento alto não garante bolsa boa, porque o preço pode já embutir esse crescimento.",
    relacionados: ["crescimento-potencial", "produtividade", "instituicoes", "pib", "diversificacao"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "30:33" }],
  },
  {
    slug: "divida-publica",
    termo: "Dívida pública",
    categoria: "Macro e contas públicas",
    apelidos: [
      "dívida bruta",
      "dívida líquida",
      "dívida do governo",
      "dívida pública federal",
      "dívida bruta do governo geral",
      "DBGG"],
    resumo:
      "Tudo o que o governo deve, sobretudo em títulos vendidos a bancos, fundos e pessoas. Cresce quando o governo gasta mais do que arrecada e com os juros sobre o que já deve.",
    texto: [
      "Quando o governo gasta mais do que arrecada, precisa pegar dinheiro emprestado. Faz isso vendendo títulos, como os do Tesouro Direto. Quem compra empresta ao governo e recebe juros. A soma desses empréstimos é a dívida pública.",
      "No Brasil, há dois números principais. A dívida bruta soma tudo o que o governo deve. A dívida líquida desconta o que ele tem a receber, como as reservas internacionais. Os critérios também mudam entre instituições: o FMI conta os títulos que estão na carteira do Banco Central, e o próprio Banco Central não, por isso o número do FMI fica mais alto.",
      "A dívida, em si, não é problema. O que importa é o tamanho em relação à economia, o juro que se paga sobre ela, o prazo e a confiança de que o governo vai conseguir rolá-la.",
    ],
    exemplo:
      "Em dezembro de 2025, a dívida bruta do governo geral era de 78,6% do PIB pelo critério do Banco Central. Pelo critério do FMI, a projeção para 2026 é de 96,5%. Quase metade da dívida federal brasileira acompanha a Selic, contra pouco mais de 2% da americana atrelada a juro flutuante.",
    naPratica:
      "Quem tem dinheiro em títulos públicos, CDB ou fundo DI está, direta ou indiretamente, emprestando ao governo brasileiro. Diversificar para fora também é diversificar o devedor: o seu patrimônio deixa de depender de uma única capacidade de pagamento.",
    relacionados: ["divida-pib", "resultado-primario", "resultado-nominal", "risco-pais", "selic", "dominancia-fiscal"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "23:49" },
      { modulo: 0, aula: 2, tempo: "1:24:02" },
      { modulo: 0, aula: 3 },
    ],
  },
  {
    slug: "divida-pib",
    termo: "Dívida/PIB",
    categoria: "Macro e contas públicas",
    apelidos: [
      "dívida sobre o PIB",
      "relação dívida/PIB",
      "dívida em relação ao PIB",
      "aritmética da dívida",
      "dinâmica da dívida",
    ],
    resumo:
      "A dívida do governo dividida pelo tamanho da economia. É o jeito de comparar dívidas de países diferentes e de saber se ela está crescendo mais rápido do que a capacidade de pagar.",
    texto: [
      "Uma dívida de R$ 500 mil é pesada para quem ganha R$ 5 mil por mês e leve para quem ganha R$ 500 mil. Com países é igual: a dívida só faz sentido comparada à renda, e a renda de um país é o PIB.",
      "A relação muda por três forças. Os juros fazem a dívida crescer sozinha. O crescimento da economia aumenta o denominador e dilui a dívida. E o superávit primário, a economia que o governo faz antes de pagar juros, abate parte dela. Se o juro real é maior que o crescimento, o governo precisa de superávit só para a relação ficar parada.",
      "A inflação também mexe na conta, porque infla o PIB em reais e corrói o valor de parte da dívida. Foi o que ajudou a dívida brasileira a recuar de 86,9% para 71,7% do PIB entre 2020 e 2022.",
    ],
    exemplo:
      "Com dívida de 100% do PIB, juro real de 6% e crescimento de 2%, sem superávit nenhum, a dívida vai a quase 104% do PIB no ano seguinte. Para ela ficar parada, o governo precisaria de um superávit primário de cerca de 4% do PIB.",
    naPratica:
      "É a conta que o mercado faz o tempo todo. Quando ela não fecha, o ajuste costuma vir por juros mais altos, inflação ou câmbio mais fraco, e as três coisas atingem quem tem o patrimônio inteiro em reais.",
    relacionados: ["divida-publica", "resultado-primario", "juro-real", "pib", "dominancia-fiscal"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "27:05" },
      { modulo: 0, aula: 2, tempo: "52:52" },
    ],
  },
  {
    slug: "resultado-primario",
    termo: "Resultado primário",
    categoria: "Macro e contas públicas",
    apelidos: [
      "superávit primário",
      "superávits primários",
      "déficit primário",
      "primário",
      "meta de superávit primário",
      "meta de primário",
      "superávit nas contas",
    ],
    resumo:
      "Quanto sobra ou falta no caixa do governo antes de pagar os juros da dívida. Superávit primário mostra que o governo consegue, ao menos em parte, conter a própria dívida.",
    texto: [
      "Imagine o orçamento de uma família com salário de R$ 10 mil, gastos de R$ 9 mil e R$ 1,5 mil de juros do financiamento. Antes dos juros, sobram R$ 1 mil: é um superávit primário. Depois dos juros, faltam R$ 500: é um déficit nominal. As duas coisas são verdade ao mesmo tempo.",
      "No governo é igual. O resultado primário é receita menos despesa, sem contar os juros. É o pedaço que depende das escolhas do governo, porque os juros dependem também do tamanho da dívida passada e da Selic.",
      "Desde 1999, a meta de primário é um dos três pés do tripé macroeconômico. O Brasil fez superávits acima de 3% do PIB de 2002 a 2008, passou a ter déficits a partir de 2014 e fechou 2025 com déficit de 0,4% do PIB no setor público consolidado.",
    ],
    exemplo:
      "Em 2020, ano da pandemia, o setor público teve déficit primário de 9,2% do PIB, o maior da série. Em 2022, voltou a um superávit de 1,3%.",
    naPratica:
      "O primário é o termômetro que o mercado usa para medir a disposição do governo de segurar a dívida. Quando ele piora sem perspectiva de melhora, o prêmio cobrado no juro e no câmbio tende a subir.",
    relacionados: ["resultado-nominal", "divida-pib", "arcabouco-fiscal", "tripe-macroeconomico", "divida-publica"],
    noCurso: [
      { modulo: 0, aula: 1 },
      { modulo: 0, aula: 2, tempo: "51:10" },
    ],
  },
  {
    slug: "resultado-nominal",
    termo: "Déficit nominal",
    categoria: "Macro e contas públicas",
    apelidos: [
      "resultado nominal",
      "déficit nominal do governo",
      "necessidade de financiamento do setor público",
      "NFSP",
      "déficit operacional",
    ],
    resumo:
      "O resultado das contas do governo depois de pagar os juros da dívida. Mostra quanto a dívida vai precisar crescer para fechar o ano.",
    texto: [
      "O primário mostra o caixa antes dos juros. O nominal mostra o caixa depois deles. A diferença entre os dois é a conta de juros, que no Brasil é alta porque a dívida é grande e a Selic também.",
      "É por isso que o país pode ter superávit primário e déficit nominal no mesmo ano, e as duas manchetes estarem certas. O Banco Central publica esse número como necessidade de financiamento do setor público, em que déficit aparece com sinal positivo.",
      "Com inflação alta, os economistas olham também o resultado operacional, que tira da conta a parte dos juros que só repõe a inflação. Nos anos de hiperinflação, era o número que fazia sentido.",
    ],
    exemplo:
      "Hipotético: dívida de 70% do PIB, juro de 11% ao ano e superávit primário de 1% do PIB. Os juros custam cerca de 7,7% do PIB, e o déficit nominal fica perto de 6,7% do PIB, mesmo com o caixa no azul antes dos juros.",
    naPratica:
      "Para entender por que o juro brasileiro é alto, olhe o nominal: é ele que diz quanto o governo precisa tomar emprestado todo ano. E quem empresta, inclusive você via CDB ou Tesouro, cobra pelo risco.",
    relacionados: ["resultado-primario", "divida-publica", "divida-pib", "selic", "juro-real"],
    noCurso: [{ modulo: 0, aula: 2 }],
  },
  {
    slug: "carga-tributaria",
    termo: "Carga tributária",
    categoria: "Macro e contas públicas",
    apelidos: ["carga tributária bruta", "carga de impostos", "arrecadação"],
    resumo:
      "Quanto o governo arrecada em impostos e contribuições, medido como fatia do PIB. No Brasil, é perto de um terço de tudo o que o país produz.",
    texto: [
      "Some todos os impostos pagos num ano, federais, estaduais e municipais, e divida pelo PIB. O resultado é a carga tributária. Ela diz quanto da economia passa pelas mãos do Estado.",
      "O Brasil arrecadou 32,4% do PIB em 2025, o maior nível da série do Tesouro. É um nível de país rico, com renda de emergente. A explicação está no lado do gasto: previdência, assistência e saúde pública numa escala que países de renda parecida não costumam bancar.",
      "Com uma carga já alta, subir imposto tem limite. Cada real a mais sai do consumo ou do investimento, e parte da base, como o capital financeiro, pode simplesmente ir embora.",
    ],
    exemplo:
      "Na aula, Felippe Hermes compara: perto de 34% do PIB no Brasil contra cerca de 25% na média dos emergentes. Pelo número oficial do Tesouro para 2025, são 32,4%.",
    naPratica:
      "Quando a conta pública não fecha e o imposto já é alto, sobram dívida e inflação como saídas. É um dos elos entre o risco fiscal e o patrimônio de quem tem tudo em reais.",
    relacionados: ["resultado-primario", "divida-publica", "iof", "imposto-de-renda", "previdencia"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "24:45" }],
  },
  {
    slug: "arcabouco-fiscal",
    termo: "Arcabouço fiscal",
    categoria: "Macro e contas públicas",
    apelidos: ["novo arcabouço fiscal", "regime fiscal sustentável", "Lei Complementar 200", "regra fiscal", "regras fiscais"],
    resumo:
      "A regra fiscal em vigor desde 2023, que substituiu o teto de gastos. Liga o crescimento da despesa ao da receita e fixa metas anuais de resultado primário com margem de tolerância.",
    texto: [
      "Uma regra fiscal é um combinado que o governo faz consigo mesmo para não gastar demais. O Brasil teve várias: a Lei de Responsabilidade Fiscal em 2000, o teto de gastos em 2016 e, desde agosto de 2023, o chamado arcabouço fiscal, da Lei Complementar 200.",
      "A lógica é simples. A despesa pode crescer, acima da inflação, uma parte do que a receita cresceu: 70% da alta real da arrecadação, ou 50% se a meta do ano anterior não foi cumprida. E há um piso e um teto para esse crescimento, de 0,6% a 2,5% ao ano acima da inflação.",
      "Junto vem uma meta de resultado primário para cada ano, com uma banda de tolerância de 0,25 ponto do PIB para cima ou para baixo. Despesas fora da regra e mudanças nas metas são acompanhadas de perto pelo mercado, porque mexem com a confiança na trajetória da dívida.",
    ],
    exemplo:
      "Hipotético: se a receita cresce 4% acima da inflação, a despesa pode crescer 2,5%, que é 70% de 4% limitado ao teto da regra. Se a receita não cresce nada, a despesa ainda sobe 0,6%, o piso.",
    naPratica:
      "Regras fiscais reduzem o risco enquanto são respeitadas. A história brasileira mostra que elas mudam com alguma frequência. Por isso o mercado olha menos a regra escrita e mais o resultado que aparece, ano após ano, nas contas.",
    relacionados: ["teto-de-gastos", "lei-de-responsabilidade-fiscal", "resultado-primario", "divida-pib", "risco-pais"],
  },
  {
    slug: "teto-de-gastos",
    termo: "Teto de gastos",
    categoria: "Macro e contas públicas",
    apelidos: ["Emenda Constitucional 95", "EC 95", "PEC do teto"],
    resumo:
      "A regra aprovada em dezembro de 2016 que limitou o crescimento da despesa federal à inflação do ano anterior, por até 20 anos. Foi substituída pelo arcabouço fiscal em 2023.",
    texto: [
      "Depois da recessão de 2015 e 2016, o governo apostou numa regra simples: a despesa federal de cada ano só poderia crescer o equivalente à inflação do ano anterior. Em termos reais, o gasto ficaria congelado.",
      "A Emenda Constitucional 95, promulgada em 15 de dezembro de 2016, valeria por 20 anos, com revisão possível a partir do décimo. A ideia era que, com a economia crescendo e o gasto parado, a despesa perderia peso no PIB aos poucos.",
      "Na prática, a regra foi recebendo exceções por emendas constitucionais a partir de 2019 e acabou substituída pelo arcabouço fiscal, aprovado em 2023.",
    ],
    exemplo:
      "Hipotético: com inflação de 4% e gasto de R$ 2 trilhões, o teto do ano seguinte seria de R$ 2,08 trilhões, cresça a arrecadação o quanto crescer.",
    naPratica:
      "O teto mostra como uma regra crível pode baixar juros: no período em que ela era vista como firme, o Banco Central levou a Selic de 14,25% para 6,5%. E mostra também que regras fiscais brasileiras costumam ter vida curta, um risco que o patrimônio 100% local carrega.",
    relacionados: ["arcabouco-fiscal", "recessao-2015-2016", "resultado-primario", "lei-de-responsabilidade-fiscal", "selic"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:09:04" }],
  },
  {
    slug: "dominancia-fiscal",
    termo: "Dominância fiscal",
    categoria: "Macro e contas públicas",
    apelidos: ["aritmética monetarista desagradável", "aritmética desagradável", "Sargent e Wallace", "monetização", "monetização da dívida"],
    resumo:
      "Situação em que a dívida do governo é tão pesada que subir juros deixa de segurar a inflação e passa a piorá-la, porque engorda a dívida que um dia pode acabar paga com emissão de dinheiro.",
    texto: [
      "Normalmente, o banco central sobe os juros para esfriar a economia e frear a inflação. Funciona porque o governo, do outro lado, ajusta as contas para pagar os juros mais altos.",
      "Agora imagine uma dívida que já está no limite do que o mercado aceita financiar. Cada alta de juros faz a dívida crescer mais rápido, a desconfiança aumenta, o dólar sobe e a inflação vem junto. Os economistas Thomas Sargent e Neil Wallace chamaram isso de aritmética monetarista desagradável. No mercado, o nome é dominância fiscal: a política fiscal manda, e a monetária perde força.",
      "No Brasil, estudos das contas de 1947 ao começo dos anos 1990 mostram que receitas e gastos só fechavam quando se contava a emissão de moeda. Foi esse histórico que o Plano Real e o tripé tentaram encerrar.",
    ],
    exemplo:
      "Hipotético: o banco central sobe o juro de 12% para 15%. Num país com contas sólidas, o dólar cai e a inflação recua. Num país sob dominância fiscal, o mercado lê a alta como mais dívida no futuro, vende reais e a inflação sobe mesmo com o juro maior.",
    naPratica:
      "É o cenário em que o juro alto deixa de proteger quem está em reais. A dúvida sobre as contas aparece primeiro no dólar e nos juros longos e só depois na inflação. Ter uma parte do patrimônio em moeda cujo banco central não depende do Tesouro local é uma forma de não ficar exposto a esse único cenário.",
    relacionados: ["senhoriagem", "imposto-inflacionario", "divida-pib", "banco-central", "inconsistencia-temporal"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "16:53" }],
  },
  {
    slug: "senhoriagem",
    termo: "Senhoriagem",
    categoria: "Macro e contas públicas",
    apelidos: ["receita de emissão", "emissão de moeda", "imprimir dinheiro", "imprimindo moeda", "emissão de base monetária"],
    resumo:
      "O ganho de quem emite o dinheiro. Imprimir uma nota custa centavos, e ela compra o valor de face. Quando o governo usa essa fonte para pagar contas, a conta acaba na inflação.",
    texto: [
      "Uma nota de R$ 100 custa ao Banco Central muito menos do que R$ 100 para ser feita. A diferença entre o que a moeda compra e o que custa produzi-la é a senhoriagem. O nome vem dos senhores feudais, que cunhavam moedas e ficavam com a diferença.",
      "Em doses pequenas, é uma receita normal de qualquer banco central, que acompanha o crescimento da economia e a necessidade de dinheiro em circulação. O problema começa quando o governo passa a depender dela para fechar o orçamento: mais dinheiro sem mais produção vira preço mais alto.",
      "No Brasil, a senhoriagem foi peça central das contas públicas por quase meio século antes do real. A outra face dela, vista do lado de quem guarda dinheiro, é o imposto inflacionário.",
    ],
    exemplo:
      "Pelas contas de Rubens Penha Cysne e Paulo Coimbra-Lisboa, a perda de quem guardava papel-moeda e depósitos chegou a perto de 5% do PIB em 1993, dividida entre Banco Central e bancos. Em 1995, já com o real, tinha caído para menos de 0,5%.",
    naPratica:
      "Uma moeda é uma promessa de quem a emite. Quando você deixa todo o patrimônio numa só moeda, aposta que esse emissor não vai recorrer à impressora. Diversificar entre moedas é diversificar essa promessa.",
    relacionados: ["imposto-inflacionario", "dominancia-fiscal", "hiperinflacao", "banco-central", "inflacao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "16:53" }],
  },
  {
    slug: "imposto-inflacionario",
    termo: "Imposto inflacionário",
    categoria: "Macro e contas públicas",
    apelidos: ["impostos inflacionários", "transferências inflacionárias", "imposto da inflação"],
    resumo:
      "O poder de compra que a inflação tira de quem guarda dinheiro parado. Não passa pelo Congresso nem aparece no orçamento, mas transfere riqueza para quem emite a moeda.",
    texto: [
      "Pense em R$ 1.000 parados na conta num mês de inflação de 30%. No fim do mês, eles compram o que R$ 770 compravam. Esses R$ 230 de poder de compra não sumiram: ficaram com quem emite o dinheiro.",
      "Uma parte vai para o Banco Central, dono do papel-moeda. Outra ia para os bancos, que aplicavam o seu depósito a juros que acompanhavam a inflação e não pagavam nada a você. Quanto maior a inflação e quanto mais dinheiro parado, maior o imposto.",
      "Ele pesa mais sobre quem tem menos acesso a aplicações protegidas. Quem tinha overnight ou dólar se defendia; quem recebia salário e gastava ao longo do mês perdia um pouco a cada dia.",
    ],
    exemplo:
      "Até 1993, a inflação transferia de 3% a 7% do PIB por ano a quem emitia moeda, somando Banco Central e bancos. Quando o real derrubou a inflação, o ganho dos bancos com depósitos caiu de quase 2% do PIB em 1993 para menos de 0,1% em 1995.",
    naPratica:
      "Quando o imposto inflacionário some, o governo perde uma receita que não precisava de votação, e o rombo que ela escondia aparece. Ficar atento a esse risco é o motivo de fundo para que a reserva de valor do seu patrimônio não dependa só de uma moeda.",
    relacionados: ["senhoriagem", "hiperinflacao", "inflacao", "plano-real", "overnight"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "2:56" }],
  },
  {
    slug: "risco-pais",
    termo: "Risco-país",
    categoria: "Macro e contas públicas",
    apelidos: ["risco país", "risco Brasil", "prêmio de risco país", "prêmio de risco soberano", "spread soberano"],
    resumo:
      "Quanto um país paga a mais que o governo americano para pegar dinheiro emprestado em dólar. É o preço, cotado todo dia, da chance de o combinado não ser cumprido.",
    texto: [
      "Se o Tesouro americano paga 4% ao ano por um título de dez anos e o governo brasileiro precisa pagar 6,5% num título parecido, também em dólar, a diferença de 2,5 pontos é o risco-país. No mercado, ela é contada em pontos-base: 100 pontos equivalem a 1 ponto percentual ao ano.",
      "O número junta tudo o que pode dar errado: calote, renegociação, mudança de regra, crise política. Por muito tempo a medida mais citada foi o EMBI+, do JP Morgan. Hoje se usa muito o CDS de cinco anos, uma espécie de seguro contra calote.",
      "O risco-país não fica só nos títulos em dólar. Ele contamina o juro em reais, o câmbio e o preço das ações, porque todos os ativos de um país dividem a mesma base de risco.",
    ],
    exemplo:
      "Na eleição de 2002, o EMBI+ Brasil bateu 2.443 pontos em 27 de setembro: o país pagava 24 pontos percentuais acima dos títulos americanos. No Joesley Day, em maio de 2017, o indicador subiu 42 pontos num único dia.",
    naPratica:
      "O risco-país explica por que o juro brasileiro é alto: não é um presente para o poupador, é a remuneração por carregar o risco do país. Uma aplicação 100% em reais não é um porto neutro. É o próprio risco Brasil, com remuneração.",
    relacionados: ["embi", "cds", "rating-soberano", "selic", "crise-de-2002", "paridade-do-poder-de-compra"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "26:22" },
      { modulo: 0, aula: 2, tempo: "44:20" },
    ],
  },
  {
    slug: "embi",
    termo: "EMBI+",
    categoria: "Macro e contas públicas",
    apelidos: ["EMBI", "EMBI+ Brasil", "Emerging Markets Bond Index", "índice do JP Morgan"],
    resumo:
      "Índice do JP Morgan que media quanto os títulos em dólar de países emergentes pagavam acima dos títulos americanos. Foi por décadas a régua mais conhecida do risco-país brasileiro.",
    texto: [
      "O JP Morgan montava uma cesta de títulos que governos emergentes vendem em dólar e calculava, todo dia, quanto eles rendiam a mais que títulos do Tesouro americano de prazo parecido. O resultado, em pontos, era o EMBI+. A versão para o Brasil virou sinônimo de risco-país.",
      "A série brasileira, que começa nos anos 1990, conta a história do país em números: mais de 1.000 pontos na média de 1995 e de 1999, pico de 2.443 em 2002, menos de 200 no auge da confiança, em 2007 e entre 2011 e 2012.",
      "O EMBI+ foi descontinuado em julho de 2024. O JP Morgan mantém outros índices da família, como o EMBI Global, e o mercado passou a citar mais o CDS de cinco anos.",
    ],
    exemplo:
      "Em 2002, o EMBI+ Brasil teve média de 1.364 pontos no ano. Em 2007, a média foi de 181 pontos. A dívida não tinha mudado de tamanho na mesma proporção: o que mudou foi a confiança.",
    naPratica:
      "Os picos do EMBI+ coincidem com os saltos do dólar e com as quedas da bolsa brasileira. É a prova, em gráfico, de que câmbio, juro e ações do mesmo país respondem à mesma causa.",
    relacionados: ["risco-pais", "cds", "crise-de-2002", "rating-soberano", "treasury"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "44:20" }],
  },
  {
    slug: "cds",
    termo: "Credit default swap",
    sigla: "CDS",
    categoria: "Macro e contas públicas",
    apelidos: ["CDS de cinco anos", "CDS de 5 anos", "seguro contra calote", "swap de crédito"],
    resumo:
      "Um contrato que funciona como seguro contra o calote de um devedor. O preço do CDS de um país, cotado todo dia, é uma das medidas mais usadas do risco-país.",
    texto: [
      "Imagine que você tem um título da dívida de um país e quer se proteger de um calote. Você paga um prêmio anual a alguém que se compromete a cobrir a perda se o país não pagar. Esse contrato é o credit default swap.",
      "O preço é cotado em pontos-base por ano sobre o valor protegido. Um CDS de 150 pontos significa pagar 1,5% ao ano do valor para ter a proteção. O mais acompanhado é o de cinco anos.",
      "Como é negociado o tempo todo, o CDS reage rápido a notícias. Por isso virou a régua preferida do risco-país depois que o EMBI+ foi descontinuado.",
    ],
    exemplo:
      "Hipotético: um investidor protege US$ 10 milhões em títulos brasileiros com um CDS a 150 pontos. Ele paga US$ 150 mil por ano. Se o Brasil der calote, recebe a diferença entre o valor de face e o que o título passou a valer.",
    naPratica:
      "Quando o CDS do Brasil sobe, costuma subir junto o dólar e cair a bolsa. Acompanhar esse número ajuda a entender o humor do mercado com o país, sem precisar adivinhar o próximo movimento.",
    relacionados: ["risco-pais", "embi", "rating-soberano", "grau-de-investimento", "divida-publica"],
  },
  {
    slug: "rating-soberano",
    termo: "Rating soberano",
    categoria: "Macro e contas públicas",
    apelidos: [ "ratings", "nota soberana"],
    resumo:
      "A nota que agências como S&P, Moody's e Fitch dão à capacidade de um governo pagar suas dívidas. Vai de AAA, o melhor, até a nota de calote.",
    texto: [
      "Assim como um banco avalia se você paga o financiamento, três agências privadas avaliam se governos pagam suas dívidas. A escala vai de AAA, risco mínimo, descendo por AA, A, BBB, BB, B e assim por diante. A Moody's usa letras um pouco diferentes, como Ba1 no lugar de BB+.",
      "As notas olham contas públicas, crescimento, instituições, dívida externa e histórico. Elas mudam devagar e raramente antecipam crises; muitas vezes só confirmam o que o mercado já precificou no risco-país.",
      "Em 2026, o Brasil tinha BB pela S&P e pela Fitch e Ba1 pela Moody's: de um a dois degraus abaixo do grau de investimento, que perdeu entre 2015 e 2016.",
    ],
    exemplo:
      "O Brasil ganhou o grau de investimento da S&P em abril de 2008, da Fitch em maio de 2008 e da Moody's em setembro de 2009. Perdeu na S&P em setembro de 2015, na Fitch em dezembro de 2015 e na Moody's em fevereiro de 2016.",
    naPratica:
      "A nota importa porque muitos fundos de pensão e seguradoras do mundo só podem comprar títulos com grau de investimento. Perder a nota tira compradores do país e costuma pesar no câmbio e no juro.",
    relacionados: ["grau-de-investimento", "risco-pais", "cds", "recessao-2015-2016", "divida-publica"],
  },
  {
    slug: "grau-de-investimento",
    termo: "Grau de investimento",
    categoria: "Macro e contas públicas",
    apelidos: ["investment grade", "grau especulativo", "selo de bom pagador"],
    resumo:
      "A faixa de notas de crédito considerada de baixo risco de calote, de BBB- para cima. Abaixo dela fica o grau especulativo, que muitos investidores institucionais não podem comprar.",
    texto: [
      "As agências de rating dividem a escala em dois mundos. Do BBB- (Baa3, na Moody's) para cima, o emissor tem grau de investimento. Abaixo, tem grau especulativo, também chamado de high yield ou junk.",
      "A linha importa porque regras e estatutos de muitos fundos de pensão, seguradoras e fundos de índice exigem grau de investimento. Cruzar a linha para baixo obriga parte desses investidores a vender.",
      "O Brasil ficou com grau de investimento de 2008 a 2015 nas três grandes agências. A perda veio com a recessão e a piora das contas públicas.",
    ],
    exemplo:
      "Quando a S&P tirou o grau de investimento do Brasil, em setembro de 2015, o dólar já vinha em forte alta desde o começo do ano e o risco-país estava no maior nível desde 2009. A notícia confirmou um movimento que o mercado vinha fazendo.",
    naPratica:
      "O selo não garante nada, mas muda quem pode comprar os ativos do país. Para você, é mais um sinal de como o mundo enxerga o risco Brasil, e de quanto o preço dos ativos daqui pode oscilar com uma decisão de agência.",
    relacionados: ["rating-soberano", "risco-pais", "cds", "recessao-2015-2016", "treasury"],
  },
  {
    slug: "balanca-de-pagamentos",
    termo: "Balanço de pagamentos",
    categoria: "Macro e contas públicas",
    apelidos: [
      "balança de pagamentos",
      "transações correntes",
      "conta corrente do país",
      "déficit em conta corrente",
      "balança comercial",
      "investimento direto no país",
    ],
    resumo:
      "O registro de todo o dinheiro que entra e sai de um país: exportações, importações, juros, lucros, viagens e investimentos. Mostra se o país depende de capital de fora para fechar as contas.",
    texto: [
      "Pense no extrato da sua família com o resto do mundo. Entra dinheiro quando o país exporta soja, recebe turistas ou atrai investimento. Sai quando importa remédios, paga juros a credores de fora ou envia lucros de multinacionais às matrizes.",
      "A parte do dia a dia, bens, serviços e rendas, chama-se transações correntes. Se ela fecha no vermelho, o país precisa atrair dinheiro de fora para cobrir a diferença, seja investimento em fábricas, seja dinheiro aplicado em bolsa e títulos.",
      "Investimento direto, de quem constrói fábrica, costuma ser mais estável. Dinheiro aplicado em títulos e ações pode sair em dias. Quando a conta depende do segundo tipo e o humor global muda, o câmbio é que se ajusta.",
    ],
    exemplo:
      "Hipotético: um país com déficit em transações correntes de 3% do PIB, coberto por investimento estrangeiro. Numa crise global, o dinheiro de curto prazo vai embora, sobra o buraco, e o dólar sobe até que importar fique caro e exportar fique barato o suficiente.",
    naPratica:
      "É uma das engrenagens que explicam por que o real oscila tanto em crises que começam fora do Brasil. Você não controla essa engrenagem; pode, no máximo, decidir quanto do seu patrimônio fica exposto a ela.",
    relacionados: ["reservas-internacionais", "cambio-flutuante", "termos-de-troca", "risco-cambial", "cambio"],
  },
  {
    slug: "reservas-internacionais",
    termo: "Reservas internacionais",
    categoria: "Macro e contas públicas",
    apelidos: ["reservas", "reservas cambiais", "colchão de reservas"],
    resumo:
      "O dinheiro em moeda forte que o Banco Central guarda, sobretudo em títulos do governo americano. Serve de colchão para o país pagar compromissos externos e conter disparadas do dólar.",
    texto: [
      "Assim como você guarda uma reserva de emergência, um país guarda reservas em dólar, euro, ouro e outras moedas fortes. No Brasil, quem administra é o Banco Central, e boa parte está aplicada em títulos do Tesouro americano.",
      "As reservas servem para duas coisas. Garantem que o país consiga pagar importações e dívidas externas mesmo se o dinheiro de fora secar. E dão munição para o Banco Central vender dólares quando o mercado entra em pânico, como no câmbio flutuante e sujo do tripé.",
      "Até os anos 1990, a falta de reservas foi o calcanhar de Aquiles do Brasil: em 1987, o país declarou moratória; entre 1998 e o começo de 1999, perdeu dezenas de bilhões de dólares tentando segurar o real. Desde 2008, as reservas superam a dívida externa do setor público, e estão acima de US$ 300 bilhões há mais de uma década.",
    ],
    exemplo:
      "Em janeiro de 1999, a perda de reservas tornou insustentável a banda cambial, e o real passou a flutuar. Em 2020, com reservas altas, o Banco Central pôde vender dólares no auge da pandemia sem que se falasse em calote externo.",
    naPratica:
      "Reservas altas reduzem o risco de uma crise externa clássica, mas não protegem contra crises domésticas, fiscais ou políticas. Elas são o seguro do país; o do seu patrimônio é outra conversa.",
    relacionados: ["balanca-de-pagamentos", "banco-central", "cambio-flutuante", "crise-de-1999", "moratoria-de-1987", "treasury"],
    noCurso: [{ modulo: 0, aula: 2 }],
  },
  {
    slug: "banco-central",
    termo: "Banco Central",
    sigla: "BC",
    categoria: "Macro e contas públicas",
    apelidos: ["Banco Central do Brasil", "BCB", "bancos centrais", "Bacen"],
    resumo:
      "A instituição que emite a moeda, define os juros básicos e cuida da estabilidade do sistema financeiro. No Brasil é o Banco Central do Brasil; nos Estados Unidos, o Federal Reserve.",
    texto: [
      "Todo país com moeda própria tem uma instituição que cuida dela. O banco central emite o dinheiro, define a taxa básica de juros (no Brasil, a Selic, decidida pelo Copom a cada 45 dias, mais ou menos), supervisiona bancos e guarda as reservas internacionais.",
      "A missão principal é manter a inflação sob controle. No Brasil, o objetivo é perseguir a meta definida pelo Conselho Monetário Nacional, hoje de 3% ao ano. Nos Estados Unidos, o Fed tem duplo mandato: preços estáveis e máximo emprego.",
      "O Banco Central do Brasil foi criado em 1964. Até a Constituição de 1988 e a Lei de Responsabilidade Fiscal, podia financiar o governo diretamente, o que ajudou a alimentar a inflação. Desde 2021 tem autonomia formal, com mandatos fixos para a diretoria.",
    ],
    exemplo:
      "Em 1979, o Fed, comandado por Paul Volcker, subiu os juros para perto de 20% para derrubar a inflação americana. A decisão encareceu a dívida em dólar da América Latina e ajudou a provocar a década perdida.",
    naPratica:
      "Ter todo o patrimônio em reais é confiar em um único banco central. Uma parte em outra moeda põe o seu dinheiro sob outra política monetária, com outros erros e outros acertos.",
    relacionados: ["independencia-do-banco-central", "meta-de-inflacao", "selic", "reservas-internacionais", "senhoriagem", "tripe-macroeconomico"],
    noCurso: [
      { modulo: 0, aula: 1 },
      { modulo: 0, aula: 2 },
    ],
  },
  {
    slug: "independencia-do-banco-central",
    termo: "Autonomia do Banco Central",
    categoria: "Macro e contas públicas",
    apelidos: [
      "independência do Banco Central",
      "independência do BC",
      "autonomia do BC",
      "Lei Complementar 179",
      "banco central independente",
      "bancos centrais independentes",
    ],
    resumo:
      "A regra que dá ao Banco Central mandatos fixos e o protege de pressões do governo da vez. No Brasil, vale desde a Lei Complementar 179, de fevereiro de 2021.",
    texto: [
      "Um governo perto de eleição tem a tentação de baixar juros para aquecer a economia, mesmo que isso custe inflação depois. Um banco central protegido dessa pressão consegue resistir. É a lógica da autonomia.",
      "No Brasil, a Lei Complementar 179, de 24 de fevereiro de 2021, deu mandatos de quatro anos ao presidente e aos diretores do Banco Central, desencontrados do mandato do presidente da República. O presidente do BC assume no terceiro ano do governo, e os diretores são trocados aos poucos.",
      "O objetivo principal continua sendo a estabilidade de preços. A lei acrescentou objetivos secundários: zelar pelo sistema financeiro, suavizar as flutuações da atividade e fomentar o pleno emprego.",
    ],
    exemplo:
      "Hipotético: um presidente da República eleito em 2026 só indica o presidente do Banco Central para começar em 2029. Até lá, convive com uma diretoria que não escolheu inteira.",
    naPratica:
      "Autonomia reduz o risco de a política monetária ser usada para fins eleitorais, mas não elimina a dominância fiscal: se as contas não fecham, nenhum banco central segura a moeda sozinho.",
    relacionados: ["banco-central", "inconsistencia-temporal", "meta-de-inflacao", "dominancia-fiscal", "instituicoes"],
  },
  {
    slug: "meta-de-inflacao",
    termo: "Meta de inflação",
    categoria: "Macro e contas públicas",
    apelidos: ["metas de inflação", "regime de metas", "regime de metas de inflação", "meta contínua", "centro da meta"],
    resumo:
      "O alvo de inflação que o Banco Central persegue ajustando os juros. No Brasil, o regime existe desde junho de 1999; desde 2025, o alvo é de 3% ao ano, com tolerância de 1,5 ponto.",
    texto: [
      "Em vez de prometer uma cotação de dólar, o Banco Central passa a prometer uma inflação. O Conselho Monetário Nacional fixa o alvo, e o BC calibra a Selic para chegar lá. Se a inflação ameaça subir, o juro sobe; se está abaixo, ele pode cair.",
      "O Brasil adotou o regime em junho de 1999, com inspiração na Nova Zelândia, logo depois da crise do câmbio. É um dos três pés do tripé macroeconômico.",
      "Desde 2025, a meta é contínua: 3% ao ano, com intervalo de 1,5 ponto para cima ou para baixo, cobrada mês a mês sobre os 12 meses anteriores. Se a inflação passar seis meses seguidos fora do intervalo, o presidente do BC precisa explicar o porquê em carta pública.",
    ],
    exemplo:
      "Se o IPCA acumulado em 12 meses fica em 5% por seis meses seguidos, acima do teto de 4,5%, o Banco Central escreve uma carta ao ministro da Fazenda explicando as causas e o que vai fazer.",
    naPratica:
      "Uma meta crível ancora as expectativas e permite juros menores. Quando o mercado duvida dela, cobra mais caro nos títulos longos e no câmbio. A credibilidade da meta é parte do risco que você carrega com patrimônio em reais.",
    relacionados: ["tripe-macroeconomico", "banco-central", "ipca", "selic", "inconsistencia-temporal"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "31:42" }],
  },
  {
    slug: "tripe-macroeconomico",
    termo: "Tripé macroeconômico",
    categoria: "Macro e contas públicas",
    apelidos: ["tripé", "tripé de 1999", "os três pés"],
    resumo:
      "O regime adotado em 1999: meta de inflação, meta de superávit primário e câmbio flutuante. Com ajustes, é a base da política econômica brasileira até hoje.",
    texto: [
      "Depois que a âncora no dólar caiu, em janeiro de 1999, o Brasil precisava de outro jeito de convencer o mercado de que a inflação não voltaria. A resposta veio em três pés, montados em poucos meses pela equipe de Arminio Fraga no Banco Central e de Pedro Malan na Fazenda.",
      "O primeiro é a meta de inflação: o BC anuncia um alvo e calibra os juros. O segundo é a meta de superávit primário, para mostrar que a dívida não cresceria sem controle. O terceiro é o câmbio flutuante: o dólar encontra o preço no mercado, e o BC só entra quando acha o movimento exagerado.",
      "Em 2000, a Lei de Responsabilidade Fiscal amarrou o desenho, proibindo, entre outras coisas, que o governo se financie no próprio banco que controla.",
    ],
    exemplo:
      "Os três pés se apoiam. Sem superávit, a meta de inflação perde força, porque o mercado teme a dominância fiscal. Sem câmbio flutuante, o BC gasta reservas defendendo uma cotação. Sem meta de inflação, o câmbio flutuante vira só desvalorização.",
    naPratica:
      "Quando um dos pés fraqueja, como o fiscal a partir de 2014, o prêmio de risco volta a subir. Acompanhar o tripé é uma forma simples de ler o risco do país, sem ter de adivinhar o dólar do mês.",
    relacionados: ["meta-de-inflacao", "resultado-primario", "cambio-flutuante", "lei-de-responsabilidade-fiscal", "crise-de-1999"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "31:42" }],
  },
  {
    slug: "inconsistencia-temporal",
    termo: "Inconsistência temporal",
    categoria: "Macro e contas públicas",
    apelidos: ["âncora nominal", "âncoras nominais", "credibilidade", "Barro e Gordon", "compromisso crível"],
    resumo:
      "O problema de quem promete algo hoje e, amanhã, tem incentivo para mudar de ideia. Em política monetária, explica por que uma promessa de inflação baixa só vale se houver amarra crível.",
    texto: [
      "Um governo promete inflação baixa. Depois que salários e contratos foram fechados contando com a promessa, surge a tentação de soltar um pouco mais de inflação para aquecer a economia. Só que todo mundo sabe disso e já negocia contando com a traição.",
      "O resultado, mostrado pelos economistas Robert Barro e David Gordon, é inflação mais alta do que o governo queria, sem nenhum crescimento a mais. O viés só some quando quem decide consegue se amarrar à promessa.",
      "As amarras mais comuns são chamadas de âncoras nominais: prender a moeda a outra (câmbio fixo), dar autonomia ao banco central com uma meta de inflação, ou construir reputação ao longo de anos cumprindo o prometido.",
    ],
    exemplo:
      "O real usou o dólar como âncora de 1994 a 1999. Funcionou enquanto manter a amarra custava menos do que soltá-la. Quando o custo em reservas e juros ficou alto demais, o mercado testou a promessa, e ela caiu.",
    naPratica:
      "Toda promessa de política econômica tem prazo de validade implícito. Para o seu patrimônio, isso significa que regras estáveis hoje não garantem regras estáveis amanhã, um argumento a mais para espalhar o dinheiro entre jurisdições.",
    relacionados: ["cambio-fixo", "meta-de-inflacao", "independencia-do-banco-central", "risco-de-expropriacao", "plano-real"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "12:06" }],
  },
  {
    slug: "demografia",
    termo: "Demografia",
    categoria: "Macro e contas públicas",
    apelidos: ["transição demográfica", "envelhecimento da população", "pirâmide etária", "projeções da população", "envelhecimento"],
    resumo:
      "O estudo do tamanho e da composição da população: quantos nascem, quantos morrem, quantos migram e quantos estão em cada idade. Muda devagar, mas muda tudo: trabalho, consumo, previdência e dívida.",
    texto: [
      "Demografia é a variável que nenhum governo muda no curto prazo. Quem vai se aposentar em 2050 já nasceu. Quem vai trabalhar em 2045 também. Por isso as projeções demográficas são das mais confiáveis da economia.",
      "O Brasil passa por uma transição rápida. As famílias encolheram, as pessoas vivem mais e, pelas projeções do IBGE, a população para de crescer em 2041, com 220,4 milhões, e cai para 199,2 milhões em 2070, quando quase quatro em cada dez brasileiros terão 60 anos ou mais.",
      "Os Estados Unidos também envelhecem, mas a população continua crescendo, puxada pela imigração. A diferença pesa em consumo, em mercado de trabalho e no tamanho futuro de cada economia.",
    ],
    exemplo:
      "Em 2023, 15,6% dos brasileiros tinham 60 anos ou mais. Pelo IBGE, serão 37,8% em 2070. Nos Estados Unidos, a fatia com 65 anos ou mais deve passar de 17% em 2022 para 23% em 2050.",
    naPratica:
      "Menos gente trabalhando e mais gente aposentada pressionam o orçamento por décadas, e a conta tende a vir por imposto, dívida ou inflação. A demografia não decide sozinha o futuro do país, mas é um dos riscos que uma carteira concentrada em reais carrega sem perceber.",
    relacionados: ["bonus-demografico", "taxa-de-fecundidade", "previdencia", "crescimento-potencial", "divida-pib"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "31:28" },
      { modulo: 0, aula: 4, tempo: "18:03" },
    ],
  },
  {
    slug: "bonus-demografico",
    termo: "Bônus demográfico",
    categoria: "Macro e contas públicas",
    apelidos: ["janela demográfica", "dividendo demográfico", "fim do bônus demográfico"],
    resumo:
      "A fase em que a população em idade de trabalhar cresce mais que a de crianças e idosos. A economia ganha um empurrão, e ele acaba quando a população envelhece.",
    texto: [
      "Quando a fecundidade cai, há uma geração de transição: menos crianças para sustentar e ainda poucos idosos. A fatia de gente em idade de trabalhar cresce, a poupança aumenta e a economia ganha fôlego. É o bônus.",
      "Ele não dura. As pessoas que formavam o bônus envelhecem e se aposentam, e a geração seguinte é menor. O empurrão vira um freio, e o crescimento passa a depender mais de produtividade.",
      "Países que aproveitaram o bônus para educar e investir, como a Coreia do Sul, ficaram ricos antes de envelhecer. O Brasil está no fim dessa janela: pelas projeções do IBGE, a população inteira para de crescer em 2041, e a fatia de idosos já cresce bem mais depressa que a de jovens.",
    ],
    exemplo:
      "Hipotético: num país com 100 pessoas em idade de trabalhar e 50 dependentes, cada trabalhador sustenta meia pessoa. Se o número de dependentes sobe para 80, cada trabalhador passa a sustentar 0,8 pessoa, e sobra menos para poupar e investir.",
    naPratica:
      "O fim do bônus reduz o crescimento potencial e aperta a previdência. Não é uma previsão de crise, é aritmética. Diversificar entre economias em fases demográficas diferentes é uma forma de não depender de uma só pirâmide de idades.",
    relacionados: ["demografia", "taxa-de-fecundidade", "previdencia", "crescimento-potencial", "produtividade"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "31:28" }],
  },
  {
    slug: "taxa-de-fecundidade",
    termo: "Taxa de fecundidade",
    categoria: "Macro e contas públicas",
    apelidos: ["fecundidade", "taxa de reposição", "filhos por mulher", "taxa de fecundidade total"],
    resumo:
      "O número médio de filhos por mulher. Para a população se manter estável sem imigração, ele precisa ficar perto de 2,1. O Brasil está em pouco mais de 1,5.",
    texto: [
      "Para uma população não encolher, cada casal precisa, em média, ter dois filhos, um pouco mais para compensar quem morre antes da idade de ter filhos. Esse número mágico, perto de 2,1 filhos por mulher, é a taxa de reposição.",
      "O Brasil caiu abaixo dela no começo dos anos 2000. Em 2023, a taxa era de 1,57, e as projeções do IBGE a mantêm perto de 1,5 até 2070.",
      "Fecundidade baixa não esvazia o país de um dia para o outro, porque ainda há muitas pessoas em idade de ter filhos. O efeito aparece com décadas de atraso, quando a população para de crescer e envelhece.",
    ],
    exemplo:
      "Em 2000, a taxa brasileira era de 2,32 filhos por mulher. Em 2010, de 1,75. Em 2023, de 1,57. Pelo IBGE, deve ficar entre 1,44 e 1,50 de 2041 a 2070.",
    naPratica:
      "Com menos nascimentos, haverá menos contribuintes para sustentar a aposentadoria de cada aposentado. Para quem conta com o INSS, a demografia já é parte do risco do patrimônio, e a poupança própria é onde dá para diversificar esse risco.",
    relacionados: ["demografia", "bonus-demografico", "previdencia", "crescimento-potencial"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "31:56" }],
  },
  {
    slug: "previdencia",
    termo: "Previdência",
    categoria: "Macro e contas públicas",
    apelidos: [
      "Previdência Social",
      "INSS",
      "previdência por repartição",
      "regime de repartição",
      "repartição",
      "capitalização",
      "reforma da Previdência",
      "aposentadoria pública",
    ],
    resumo:
      "O sistema que paga aposentadorias e pensões. No INSS, quem trabalha hoje paga a aposentadoria de quem parou hoje, por isso a conta depende da demografia.",
    texto: [
      "No INSS, a sua contribuição de hoje não fica guardada para você: paga quem está aposentado hoje. É o regime de repartição. Ele funciona bem quando há muitos trabalhadores para cada aposentado e os salários crescem.",
      "O outro modelo é a capitalização: cada um forma a própria poupança, que rende juros até a aposentadoria. A previdência privada, os planos PGBL e VGBL e os fundos de pensão seguem essa lógica.",
      "Com a população envelhecendo, a repartição exige mais contribuição, menos benefício ou mais dinheiro do Tesouro. A reforma de 2019, a Emenda Constitucional 103, fixou idade mínima de 65 anos para homens e 62 para mulheres no INSS. Na aula, Felippe Hermes lembra que dificilmente terá sido a última.",
    ],
    exemplo:
      "Hipotético: se os salários sobem 2% ao ano e o número de contribuintes cresce 1%, o sistema de repartição rende perto de 3%. Se os contribuintes passam a diminuir 1% ao ano, o rendimento cai para perto de 1%.",
    naPratica:
      "Quem contribui para o INSS já tem boa parte da aposentadoria presa à demografia, aos salários e à moeda do Brasil. A sua poupança própria é o espaço onde essa exposição pode ser diversificada, inclusive entre moedas e países.",
    relacionados: ["demografia", "taxa-de-fecundidade", "bonus-demografico", "divida-pib", "carga-tributaria"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "33:09" }],
  },
  {
    slug: "instituicoes",
    termo: "Instituições",
    categoria: "Macro e contas públicas",
    apelidos: ["instituições econômicas", "instituições políticas", "qualidade institucional", "regras do jogo", "estado de direito"],
    resumo:
      "As regras do jogo de uma sociedade: leis, direitos de propriedade, tribunais, contratos e a forma como o poder é exercido. São a explicação mais aceita para a diferença de renda entre países.",
    texto: [
      "Por que a Coreia do Sul ficou rica e a do Norte não, se as duas começaram com o mesmo povo, a mesma língua e a mesma história? A resposta mais aceita é que adotaram regras diferentes. Isso tem nome: instituições.",
      "Economistas como Daron Acemoglu, Nobel de Economia, separam dois tipos. Instituições econômicas definem se a propriedade está protegida e se contratos são cumpridos. Instituições políticas definem quem faz as regras e quanto ele pode mudá-las. As segundas moldam as primeiras.",
      "Boas instituições tornam crível que o governo não vai tomar o retorno de quem investiu. Quando essa confiança falta, as pessoas investem menos ou cobram mais caro para investir.",
    ],
    exemplo:
      "O bloqueio das aplicações no Plano Collor, em 1990, foi uma decisão tomada em um dia que alterou contratos de milhões de pessoas. Episódios assim ficam na memória dos investidores e entram no preço por décadas.",
    naPratica:
      "Diversificar entre países é também diversificar instituições. Nenhuma jurisdição é perfeita, mas espalhar o patrimônio evita que uma única caneta decida o destino de tudo o que você tem.",
    relacionados: ["risco-de-expropriacao", "convergencia-condicional", "jurisdicao", "risco-pais", "plano-collor"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "22:12" },
      { modulo: 0, aula: 2 },
    ],
  },
  {
    slug: "risco-de-expropriacao",
    termo: "Risco de expropriação",
    categoria: "Macro e contas públicas",
    apelidos: [
      "risco de mudança de regra",
      "risco de regra",
      "holdup",
      "compromisso não crível",
      "expropriação",
      "expropriação regulatória",
      "risco regulatório",
      "risco político",
    ],
    resumo:
      "A chance de quem faz as regras tomar, depois do fato, parte do retorno de quem já investiu: com imposto novo, controle de preço, bloqueio ou desvalorização. Os economistas chamam o mecanismo de holdup.",
    texto: [
      "Imagine que você construiu uma fábrica. Ela não sai do lugar. A partir daí, quem define impostos, tarifas e preços sabe que pode apertar sem que você vá embora, porque o investimento já está feito. Os economistas chamam isso de holdup.",
      "Expropriação não precisa ser tomada de bens à força. Pode ser um imposto criado depois do investimento, um preço controlado, um bloqueio de aplicações, uma moratória ou uma inflação que corrói contratos. O efeito é o mesmo: o retorno combinado muda depois que você entrou.",
      "Quem entende o jogo se antecipa: cobra retorno maior para entrar ou investe menos. O problema persiste quando o governo não consegue prometer, de forma convincente, que não vai mudar a regra depois.",
    ],
    exemplo:
      "A moratória de Minas Gerais, em janeiro de 1999, o bloqueio do Plano Collor, em 1990, e as idas e vindas do IOF sobre câmbio em 2025 são exemplos brasileiros de regra alterada com o jogo em andamento.",
    naPratica:
      "Trocar uma ação brasileira por outra diversifica a empresa, não a regra. Uma intervenção atinge ao mesmo tempo ações, títulos, câmbio e imóveis do mesmo país. Só outra jurisdição dilui esse risco, e mesmo assim não o elimina: troca um risco concentrado por vários diferentes.",
    relacionados: ["instituicoes", "jurisdicao", "plano-collor", "crise-de-1999", "iof", "inconsistencia-temporal"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "22:12" },
      { modulo: 0, aula: 2 },
    ],
  },
  {
    slug: "restricao-orcamentaria-fraca",
    termo: "Restrição orçamentária fraca",
    categoria: "Macro e contas públicas",
    apelidos: ["socorro aos estados", "renegociação das dívidas dos estados", "federalismo fiscal"],
    resumo:
      "Situação em que um estado, município ou estatal gasta além da conta porque espera ser socorrido pela União. O benefício fica com quem gastou; a conta, com o país inteiro.",
    texto: [
      "Se um governador sabe que, no aperto, a União vai socorrê-lo, gastar além da conta vira um bom negócio: ele colhe os benefícios e divide a fatura com todos os brasileiros.",
      "O Brasil viveu isso por décadas. A União renegociou dívidas de estados e municípios em 1989, 1991, 1993 e 1997, quando assumiu a dívida em títulos dos estados por 30 anos. Bancos estaduais como Banespa e Banerj financiavam gastos dos governadores até serem saneados e privatizados.",
      "A Lei de Responsabilidade Fiscal, de 2000, veio como resposta, proibindo socorros entre entes. Mesmo assim, novas renegociações aconteceram depois.",
    ],
    exemplo:
      "Em 6 de janeiro de 1999, o governador de Minas Gerais anunciou uma moratória de 90 dias da dívida com a União. A desconfiança se espalhou, e o real deixou a banda cambial nove dias depois.",
    naPratica:
      "Ao medir o risco fiscal, olhe o setor público como um todo. A dívida de estados e estatais tende a terminar no balanço federal, e uma briga entre um governador e a União pode mexer no câmbio do país inteiro.",
    relacionados: ["lei-de-responsabilidade-fiscal", "crise-de-1999", "divida-publica", "instituicoes", "privatizacoes"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "28:17" }],
  },
  {
    slug: "superciclo-de-commodities",
    termo: "Superciclo de commodities",
    categoria: "Macro e contas públicas",
    apelidos: ["boom de commodities", "ciclo de commodities", "alta das commodities", "fim do boom", "IC-Br", "Índice de Commodities do Banco Central"],
    resumo:
      "Período longo de alta nos preços de matérias-primas como minério, soja e petróleo. O mais recente foi puxado pela China entre o começo dos anos 2000 e 2011, e mudou a economia brasileira.",
    texto: [
      "Em dezembro de 2001, a China entrou na Organização Mundial do Comércio e passou a década seguinte levando centenas de milhões de pessoas do campo para as cidades. Isso virou demanda por minério de ferro, soja, carne e petróleo, justamente o que o Brasil vende.",
      "O índice de commodities do Banco Central, medido em dólar, quase triplicou entre 2002 e 2011. Entrou dólar, o real se valorizou, a arrecadação cresceu e o país viveu anos de crescimento mais forte.",
      "A partir de 2011, a desaceleração chinesa derrubou os preços. O Brasil ficou com despesas que tinham crescido na bonança e receitas que já não acompanhavam, um dos ingredientes da recessão de 2015 e 2016.",
    ],
    exemplo:
      "O dólar, que tinha chegado perto de R$ 4 em 2002, terminou 2010 a R$ 1,67 e tocou R$ 1,53 em julho de 2011, a mínima do período. Quem comprou dólar no fim de 2002 e o deixou parado até o fim de 2010 perdeu cerca de 70% do poder de compra em reais.",
    naPratica:
      "A bolsa brasileira é feita em boa parte de bancos e commodities. Quando o ciclo vira, ela sofre junto com o real e com a arrecadação. Diversificar para setores que dependem de outros motores, como tecnologia, reduz essa dependência de um único preço.",
    relacionados: ["termos-de-troca", "balanca-de-pagamentos", "recessao-2015-2016", "cambio-flutuante", "diversificacao"],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "47:14" },
      { modulo: 0, aula: 4, tempo: "14:31" },
    ],
  },
  {
    slug: "termos-de-troca",
    termo: "Termos de troca",
    categoria: "Macro e contas públicas",
    apelidos: ["relação de trocas", "preço das exportações"],
    resumo:
      "A relação entre o preço do que um país exporta e o preço do que importa. Quando melhora, o país fica mais rico sem produzir mais, só porque o que vende ficou mais caro.",
    texto: [
      "Imagine que o Brasil exporta uma tonelada de soja e, com o dinheiro, importa um certo número de celulares. Se o preço da soja sobe e o do celular fica parado, a mesma tonelada passa a comprar mais celulares. Os termos de troca melhoraram.",
      "Para um exportador de commodities como o Brasil, os termos de troca oscilam muito, porque minério, petróleo e grãos têm preços instáveis. Quando melhoram, entram mais dólares, o real tende a se valorizar e a arrecadação sobe. Quando pioram, acontece o contrário.",
      "Essa renda vinda de fora é real, mas não depende do esforço do país. Por isso economistas recomendam tratá-la como temporária, poupando parte dela nos anos bons.",
    ],
    exemplo:
      "Na aula, Felippe Hermes lembra que Campos Salles arrumou as contas e entregou o governo a Rodrigues Alves em pleno ciclo da borracha, e que no primeiro governo Lula a bonança da China veio acompanhada de superávits acima de 3% do PIB.",
    naPratica:
      "Real, bolsa e contas públicas brasileiros são sensíveis ao mesmo fator: o preço das commodities. Ter parte do patrimônio em economias com outra pauta de exportações é uma forma de não depender só dele.",
    relacionados: ["superciclo-de-commodities", "balanca-de-pagamentos", "cambio-flutuante", "pib"],
  },
  {
    slug: "fmi",
    termo: "Fundo Monetário Internacional",
    sigla: "FMI",
    categoria: "Macro e contas públicas",
    apelidos: ["IMF", "acordo com o FMI", "World Economic Outlook"],
    resumo:
      "Organismo criado em Bretton Woods, em 1944, que empresta a países em crise de balanço de pagamentos e acompanha a economia mundial. Publica projeções de PIB e dívida usadas no mundo todo.",
    texto: [
      "O FMI nasceu em 1944, junto com o Banco Mundial, para dar estabilidade ao sistema de câmbio do pós-guerra. Hoje tem quase 200 países membros, que aportam recursos e podem tomar empréstimos em momentos de crise.",
      "Os empréstimos vêm com condições: metas fiscais, reformas, metas de reservas. Por isso o FMI ficou associado, na América Latina, a ajustes duros. A outra face é que um acordo com o Fundo serve de selo para o mercado.",
      "Duas vezes por ano, o FMI publica o World Economic Outlook, com projeções de crescimento, inflação e dívida de praticamente todos os países. Muitos números deste curso vêm dali.",
    ],
    exemplo:
      "Em agosto de 2002, em plena crise eleitoral, o Brasil fechou com o FMI um acordo de cerca de US$ 30 bilhões. Em dezembro de 2005, pagou adiantado os US$ 15,5 bilhões que ainda devia.",
    naPratica:
      "As projeções do FMI são uma boa régua para comparar países sem depender de um único analista. Mostram, por exemplo, que o Brasil é cerca de 2% do PIB mundial, e que a escolha de onde investir abrange os outros 98%.",
    relacionados: ["bretton-woods", "balanca-de-pagamentos", "crise-de-2002", "divida-publica", "pib"],
    noCurso: [
      { modulo: 0, aula: 1 },
      { modulo: 0, aula: 2 },
    ],
  },
  {
    slug: "bretton-woods",
    termo: "Bretton Woods",
    categoria: "Macro e contas públicas",
    apelidos: ["acordos de Bretton Woods", "acordo de Bretton Woods", "sistema de Bretton Woods", "fim de Bretton Woods", "choque Nixon"],
    resumo:
      "O acordo de 1944 que pôs o dólar no centro do sistema monetário mundial, preso ao ouro a US$ 35 por onça, com as outras moedas presas ao dólar. Acabou em 1971, mas o dólar continuou no centro.",
    texto: [
      "Em julho de 1944, ainda na Segunda Guerra, representantes de 44 países se reuniram num hotel em Bretton Woods, nos Estados Unidos, para desenhar o sistema monetário do pós-guerra. O Brasil estava lá.",
      "A regra: o dólar valeria ouro, a US$ 35 por onça, e os bancos centrais poderiam trocar dólares por ouro com o governo americano. As outras moedas teriam câmbio fixo, mas ajustável, contra o dólar. Do encontro nasceram também o FMI e o Banco Mundial. A libra esterlina, que tinha sido a moeda de referência do mundo, cedeu o posto.",
      "O sistema durou até 15 de agosto de 1971, quando o presidente Richard Nixon suspendeu a conversão do dólar em ouro. Desde então, as grandes moedas flutuam e valem pela confiança em quem as emite. Mesmo assim, o dólar seguiu como a moeda em que se cotam petróleo, soja, minério e boa parte do comércio e das dívidas do mundo.",
    ],
    exemplo:
      "Por isso, até hoje, o preço da soja que o Brasil exporta e do petróleo que importa é formado em dólar. Quando o real perde valor, esses preços sobem em reais mesmo que nada tenha mudado lá fora.",
    naPratica:
      "Dolarizar não é torcer pelos Estados Unidos. É reconhecer que a moeda de referência do comércio e das finanças mundiais é o dólar desde 1944, e que boa parte do que você consome tem preço formado nela. Se um dia o dólar for substituído, o hábito de medir tudo numa moeda central deve continuar.",
    relacionados: ["padrao-ouro", "fmi", "cambio-fixo", "cambio-flutuante", "cambio"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "3:49" }],
  },
  {
    slug: "padrao-ouro",
    termo: "Padrão-ouro",
    categoria: "Macro e contas públicas",
    apelidos: ["padrão ouro", "lastro em ouro", "conversibilidade em ouro", "moeda lastreada"],
    resumo:
      "Sistema em que a moeda de um país pode ser trocada por uma quantidade fixa de ouro. Dominou o comércio mundial no século 19 e no começo do século 20 e foi abandonado entre as décadas de 1930 e 1970.",
    texto: [
      "No padrão-ouro, uma nota é um recibo: o banco central promete trocá-la por um peso fixo de ouro. Como a quantidade de ouro cresce devagar, o governo não consegue imprimir dinheiro à vontade, e os preços tendem a ficar estáveis no longo prazo.",
      "O Reino Unido foi o centro desse sistema no século 19, e a libra, a moeda de referência do mundo. O preço da disciplina era a rigidez: em crises, o país não podia baixar juros nem emitir moeda sem arriscar perder ouro. Na Grande Depressão, quem saiu do padrão-ouro mais cedo, como o Reino Unido em 1931, se recuperou antes.",
      "Depois da Segunda Guerra, Bretton Woods manteve um vínculo indireto: só o dólar valia ouro. Esse último fio foi cortado em 1971. Desde então, as moedas são fiduciárias, valem pela confiança em quem as emite.",
    ],
    exemplo:
      "Hipotético: se uma onça de ouro vale US$ 35 por lei, e o governo emite dólares demais, as pessoas trocam notas por ouro, as reservas do banco central caem e ele é obrigado a apertar. É uma âncora automática.",
    naPratica:
      "O padrão-ouro ajuda a entender por que o bitcoin, com oferta limitada por regra, costuma ser comparado ao ouro. Em qualquer moeda sem lastro, a reserva de valor depende da disciplina de quem a emite, e é por isso que concentrar tudo numa só moeda é concentrar essa confiança.",
    relacionados: ["bretton-woods", "senhoriagem", "cambio-fixo", "bitcoin", "inflacao"],
  },
  {
    slug: "crise-de-2008",
    termo: "Crise de 2008",
    categoria: "Macro e contas públicas",
    apelidos: ["crise financeira de 2008", "crise global", "crise do subprime", "subprime", "Lehman Brothers", "quebra do Lehman"],
    resumo:
      "A crise que começou no crédito imobiliário americano e virou pânico global com a quebra do banco Lehman Brothers, em setembro de 2008. Inaugurou uma década de juros perto de zero no mundo rico.",
    texto: [
      "Durante anos, bancos americanos emprestaram para compra de casas a quem não tinha renda para pagar, contando com a valorização dos imóveis. Esses empréstimos, chamados subprime, foram empacotados e vendidos a investidores do mundo todo.",
      "Quando os preços dos imóveis caíram, as garantias passaram a valer menos que as dívidas. Ninguém sabia quem tinha os papéis podres, e os bancos pararam de emprestar uns aos outros. O Lehman Brothers quebrou em 15 de setembro de 2008, e o pânico se espalhou.",
      "A resposta foi um pacote de US$ 700 bilhões do Tesouro americano e um Fed, presidido por Ben Bernanke, comprando títulos em massa para irrigar o sistema. O mundo rico entrou numa década de juros reais perto de zero ou negativos.",
    ],
    exemplo:
      "Em 2008, o S&P 500 caiu 37% em dólar, e o dólar subiu 32% contra o real, de R$ 1,77 para R$ 2,34. Para quem mora no Brasil, a bolsa americana medida em reais caiu 16%, enquanto o Ibovespa caiu 41%.",
    naPratica:
      "Em crises globais, as bolsas costumam cair juntas, e o que protegeu o investidor brasileiro em 2008 foi a moeda, não a bolsa de fora. Não há garantia de que o padrão se repita, mas é um exemplo de por que o câmbio também é diversificação.",
    relacionados: ["banco-central", "risco-cambial", "diversificacao", "treasury", "superciclo-de-commodities"],
    noCurso: [
      { modulo: 0, aula: 2, tempo: "56:28" },
      { modulo: 0, aula: 3 },
    ],
  },
  {
    slug: "corralito",
    termo: "Corralito",
    categoria: "Macro e contas públicas",
    apelidos: ["Plano Cavallo", "conversibilidade argentina", "conversibilidade", "pesificação", "um peso por um dólar"],
    resumo:
      "O limite a saques bancários imposto pela Argentina em dezembro de 2001, no fim do regime em que um peso valia um dólar por lei. Veio junto com calote e com a conversão forçada de depósitos em dólar para pesos.",
    texto: [
      "Em abril de 1991, a Argentina aprovou a Lei de Conversibilidade, do ministro Domingo Cavallo: um peso passaria a valer um dólar, e o banco central só poderia emitir pesos com dólares em caixa. A hiperinflação acabou, e muitos argentinos passaram a guardar dinheiro em dólar dentro dos bancos do país.",
      "No fim dos anos 1990, com recessão, dívida crescente e o real desvalorizado no vizinho, a paridade ficou insustentável. Em dezembro de 2001, para conter a corrida aos bancos, o governo limitou os saques: era o corralito, o cercadinho.",
      "Em seguida vieram o maior calote de dívida soberana até então, o fim da paridade em janeiro de 2002 e a pesificação: depósitos em dólar foram convertidos em pesos a uma taxa bem pior que a de mercado. O país teve cinco presidentes em cerca de duas semanas.",
    ],
    exemplo:
      "Um argentino com US$ 10 mil depositados num banco de Buenos Aires em 2001 tinha, na prática, um direito sobre o sistema bancário argentino, não dólares. Quando a regra mudou, recebeu pesos que valiam bem menos.",
    naPratica:
      "Dólar dentro do sistema do próprio país continua sujeito às regras desse país. É a diferença entre ter uma moeda e ter um ativo em outra jurisdição, e um dos motivos para entender onde e com quem o seu dinheiro fica custodiado.",
    relacionados: ["cambio-fixo", "jurisdicao", "custodia", "risco-de-expropriacao", "plano-collor"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "13:06" }],
  },

  // =============================================================================================
  // HISTÓRIA DO BRASIL
  // =============================================================================================
  {
    slug: "cruzeiro",
    termo: "Cruzeiro",
    categoria: "História do Brasil",
    apelidos: ["cruzeiros", "cruzeiro novo", "cruzeiros novos", "NCr$", "réis", "mil réis", "padrões monetários"],
    resumo:
      "A moeda que substituiu o réis em 1942 e que, com idas e vindas de nome, foi o dinheiro do Brasil na maior parte do século 20. Voltou três vezes, a última no Plano Collor, em 1990.",
    texto: [
      "Em novembro de 1942, no governo Vargas, o réis deu lugar ao cruzeiro: mil réis passaram a valer um cruzeiro. Foi a primeira das oito trocas de moeda que o país faria até 1994.",
      "O nome foi e voltou. Em fevereiro de 1967 veio o cruzeiro novo, com três zeros a menos. Em maio de 1970, o nome antigo voltou, sem corte. Em fevereiro de 1986 o cruzeiro deu lugar ao cruzado e, em março de 1990, no Plano Collor, voltou de novo, trocado um por um pelo cruzado novo. Em agosto de 1993, virou cruzeiro real.",
      "Cada troca tinha a mesma promessa: dinheiro novo, inflação domada. Nenhuma das anteriores ao real cumpriu.",
    ],
    exemplo:
      "Somando os quatro cortes de três zeros e a conversão final de 2.750 cruzeiros reais por real, 2,75 quatrilhões de cruzeiros de 1942 equivalem a um único real.",
    naPratica:
      "A sequência de moedas mostra que, no Brasil, a unidade em que se mede o patrimônio já mudou várias vezes por decisão do governo. Por décadas, o brasileiro usou o dólar como reserva de valor justamente por isso.",
    relacionados: ["cruzado", "cruzeiro-real", "plano-real", "hiperinflacao", "plano-collor"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "11:49" },
      { modulo: 0, aula: 2, tempo: "1:10" },
    ],
  },
  {
    slug: "cruzado",
    termo: "Cruzado",
    sigla: "Cz$",
    categoria: "História do Brasil",
    apelidos: ["cruzados", "cruzado novo", "cruzados novos", "NCz$"],
    resumo:
      "A moeda do Plano Cruzado, de fevereiro de 1986, com três zeros a menos que o cruzeiro. Em janeiro de 1989, no Plano Verão, virou cruzado novo, com mais três zeros cortados.",
    texto: [
      "Em 28 de fevereiro de 1986, o governo Sarney anunciou o Plano Cruzado: mil cruzeiros passaram a valer um cruzado, os preços foram congelados e a correção monetária foi suspensa.",
      "Durou pouco. Com preços congelados e salários reajustados, o consumo explodiu, faltaram produtos e surgiu o ágio, o preço cobrado por fora da tabela. Depois das eleições de novembro de 1986, vieram os reajustes do Cruzado II, o congelamento foi desmontado e a inflação voltou mais forte.",
      "Em janeiro de 1989, o Plano Verão cortou mais três zeros: mil cruzados viraram um cruzado novo. A moeda durou pouco mais de um ano, até o Plano Collor trazer de volta o cruzeiro.",
    ],
    exemplo:
      "O IPCA de 1986 foi de 80%, perto de um terço do ano anterior. Em 1987, foi de 363%.",
    naPratica:
      "O cruzado é o exemplo clássico de que trocar o nome da moeda e congelar preços não resolve inflação se a causa, as contas públicas, continua lá.",
    relacionados: ["plano-cruzado", "plano-verao", "cruzeiro", "hiperinflacao", "correcao-monetaria"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "11:49" },
      { modulo: 0, aula: 2, tempo: "1:10" },
    ],
  },
  {
    slug: "cruzeiro-real",
    termo: "Cruzeiro real",
    categoria: "História do Brasil",
    apelidos: ["cruzeiros reais"],
    resumo:
      "A última moeda antes do real, em vigor de agosto de 1993 a junho de 1994. Em 1º de julho de 1994, 2.750 cruzeiros reais passaram a valer um real.",
    texto: [
      "Em agosto de 1993, no governo Itamar Franco, o cruzeiro perdeu três zeros e virou cruzeiro real. Foi o ano de inflação mais alta da série do IPCA: 2.477%.",
      "Enquanto ele circulava, a equipe econômica preparava a saída. A partir de março de 1994, os preços passaram a ser escritos numa régua estável, a URV, e o cruzeiro real seguiu só como o dinheiro do bolso, perdendo valor todos os dias.",
      "Em 1º de julho de 1994, cada URV virou um real, e CR$ 2.750 viraram R$ 1.",
    ],
    exemplo:
      "Com inflação de 2.477% no ano, quem segurou cruzeiros reais de janeiro a dezembro de 1993 terminou comprando menos de um vigésimo do que comprava.",
    naPratica:
      "A curta vida do cruzeiro real mostra o que é viver numa moeda que não guarda valor: ninguém deixava dinheiro parado, e quem podia se protegia em aplicações diárias ou em dólar.",
    relacionados: ["urv", "plano-real", "cruzeiro", "hiperinflacao", "overnight"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:10" }],
  },
  {
    slug: "urv",
    termo: "Unidade Real de Valor",
    sigla: "URV",
    categoria: "História do Brasil",
    apelidos: ["URVs", "régua estável"],
    resumo:
      "A unidade de conta criada em março de 1994 para preparar o real. Por quatro meses, preços e salários foram escritos em URV, enquanto se pagava em cruzeiros reais. Em julho, a URV virou o real.",
    texto: [
      "Pensa numa régua que não encolhe. De 1º de março a 30 de junho de 1994, preços, salários e contratos passaram a ser expressos em URV, uma unidade que o Banco Central atualizava todo dia em cruzeiros reais, acompanhando a inflação e, na prática, o dólar.",
      "Você continuava pagando em cruzeiros reais, que perdiam valor diariamente. Mas o preço em URV ficava parado. Aos poucos, todo mundo se acostumou a pensar numa moeda estável antes de ela existir. A ideia vinha de economistas brasileiros como Persio Arida e André Lara Resende, que estudavam como desmontar a inflação inercial.",
      "Em 1º de julho de 1994, a régua virou dinheiro: cada URV passou a valer um real. Naquele dia, uma URV valia 2.750 cruzeiros reais, a mesma cotação do dólar no último dia útil de junho.",
    ],
    exemplo:
      "Um aluguel de 500 URV ficava em 500 URV de março a junho. Em cruzeiros reais, o valor subia todo dia. Em julho, virou simplesmente R$ 500.",
    naPratica:
      "A URV separou as três funções da moeda: régua de preços, meio de pagamento e reserva de valor. Vale lembrar que, por décadas, a função de reserva de valor no Brasil era cumprida pelo dólar e pela correção monetária, não pela moeda nacional.",
    relacionados: ["plano-real", "inflacao-inercial", "cruzeiro-real", "correcao-monetaria", "hiperinflacao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "9:02" }],
  },
  {
    slug: "plano-real",
    termo: "Plano Real",
    categoria: "História do Brasil",
    apelidos: ["plano do real", "estabilização de 1994"],
    resumo:
      "O plano que derrubou a hiperinflação em 1994. Combinou ajuste nas contas, a URV como transição e uma moeda nova, o real, em vigor desde 1º de julho de 1994. É a moeda brasileira mais duradoura desde o réis.",
    texto: [
      "Entre 1986 e 1991, cinco planos tentaram derrubar a inflação com congelamentos, trocas de moeda e até bloqueio de aplicações. Todos falharam. O real, preparado no governo Itamar Franco pela equipe de Fernando Henrique Cardoso na Fazenda, fez diferente em três etapas.",
      "Primeiro, um ajuste nas contas públicas, com corte de gastos e um fundo que deu ao governo mais liberdade no orçamento. Depois, a URV, de março a junho de 1994, para alinhar preços e salários numa régua estável. Por fim, a moeda nova, em 1º de julho, inicialmente presa ao dólar.",
      "Sem congelamento e sem surpresa, a inflação caiu de 2.477% em 1993 para 22% em 1995 e menos de 10% em 1996. O plano também mostrou o que a inflação escondia: sem o imposto inflacionário, o governo e parte dos bancos tiveram de se ajustar. Vieram o Proer, a renegociação das dívidas dos estados, as privatizações e, em 1999, o tripé.",
    ],
    exemplo:
      "R$ 1 de julho de 1994 equivale a cerca de R$ 8,30 em agosto de 2026, pelo IPCA. O dólar saiu de perto de R$ 0,93 para R$ 5,15 no mesmo período.",
    naPratica:
      "O real é o grande sucesso dessa história e, mesmo assim, perdeu valor contra o dólar e contra os preços. Dolarizar não é apostar contra ele. É reconhecer que uma moeda bem-sucedida ainda é uma só moeda.",
    relacionados: ["urv", "hiperinflacao", "imposto-inflacionario", "tripe-macroeconomico", "cambio-fixo", "paridade-do-poder-de-compra"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "12:31" },
      { modulo: 0, aula: 2, tempo: "4:02" },
    ],
  },
  {
    slug: "plano-cruzado",
    termo: "Plano Cruzado",
    categoria: "História do Brasil",
    apelidos: ["Cruzado II", "congelamento de preços", "fiscais do Sarney", "gatilho salarial"],
    resumo:
      "O plano de fevereiro de 1986 que trocou o cruzeiro pelo cruzado, congelou preços e suspendeu a correção monetária. Derrubou a inflação por alguns meses e terminou com ela mais alta.",
    texto: [
      "Em 28 de fevereiro de 1986, o governo Sarney anunciou o primeiro grande plano de estabilização da redemocratização. Os preços foram congelados por tempo indeterminado, os salários ganharam um reajuste e um gatilho, que os corrigiria sempre que a inflação acumulasse 20%, e a moeda virou cruzado.",
      "Nos primeiros meses, a inflação quase sumiu e a popularidade do governo disparou. Cidadãos fiscalizavam preços nos supermercados. Mas, com demanda forte e preços travados, faltaram carne, leite e carros, e o ágio virou regra.",
      "Depois das eleições de novembro de 1986, o Cruzado II reajustou tarifas e impostos. A inflação voltou rápido, e em fevereiro de 1987 o Brasil suspendeu o pagamento de juros da dívida externa.",
    ],
    exemplo:
      "O IPCA caiu para 80% em 1986, perto de um terço do ano anterior, e subiu para 363% em 1987.",
    naPratica:
      "Congelar preços represa a inflação sem resolver a causa. Para quem guarda patrimônio, o recado é que a estabilidade de um ano não prova nada: o que importa é se as contas que a sustentam fecham.",
    relacionados: ["cruzado", "plano-bresser", "moratoria-de-1987", "inflacao-inercial", "hiperinflacao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:57" }],
  },
  {
    slug: "plano-bresser",
    termo: "Plano Bresser",
    categoria: "História do Brasil",
    apelidos: ["URP"],
    resumo:
      "O plano de junho de 1987, do ministro Luiz Carlos Bresser-Pereira, que congelou preços e salários por 90 dias. Não trocou a moeda e não segurou a inflação.",
    texto: [
      "Pouco mais de um ano depois do Cruzado, com a inflação de volta, o governo tentou outro choque. Em junho de 1987, o Plano Bresser congelou preços e salários por 90 dias e criou uma nova regra de reajuste salarial, a Unidade de Referência de Preços, a URP.",
      "O plano incluía também medidas fiscais e uma tentativa de reorganizar a negociação da dívida externa, mas o congelamento era o centro. Ao fim dos 90 dias, os preços voltaram a subir.",
      "Ele ficou conhecido também pela longa disputa judicial sobre a correção da poupança naquele mês, um dos casos em que a mudança de regra no meio do jogo foi parar nos tribunais por décadas.",
    ],
    exemplo:
      "O IPCA de 1987 fechou em 363%. Em 1988, chegou a 980%.",
    naPratica:
      "As disputas judiciais sobre a correção da poupança em planos como Bresser, Verão e Collor levaram décadas para terminar. É um exemplo concreto de risco de regra: o que estava combinado mudou com o dinheiro já aplicado.",
    relacionados: ["plano-cruzado", "plano-verao", "risco-de-expropriacao", "hiperinflacao", "correcao-monetaria"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:57" }],
  },
  {
    slug: "plano-verao",
    termo: "Plano Verão",
    categoria: "História do Brasil",
    resumo:
      "O plano de janeiro de 1989 que criou o cruzado novo, com três zeros a menos, e congelou preços outra vez. Foi seguido pelo ano de inflação mais alta até então.",
    texto: [
      "Em 15 de janeiro de 1989, já no fim do governo Sarney, o ministro Maílson da Nóbrega anunciou o Plano Verão. Mil cruzados viraram um cruzado novo, os preços foram congelados e o principal indexador da época, a OTN, foi extinto.",
      "Era o terceiro choque em três anos, e a credibilidade estava gasta. O congelamento ruiu em poucos meses, e a inflação de 1989 passou de 1.900% pelo IPCA.",
      "O ano terminou com eleição presidencial e a sensação de que o país estava à beira de uma hiperinflação descontrolada, o cenário em que nasceu o Plano Collor.",
    ],
    exemplo:
      "O IPCA de 1989 foi de 1.973%. No fim daquele ano, os preços já subiam perto de 50% ao mês.",
    naPratica:
      "Cada plano que falhava tornava o seguinte menos crível. É a lógica da reputação: o mercado cobra mais de quem já quebrou promessas, e o preço disso aparece em juros, câmbio e na fuga para ativos de fora.",
    relacionados: ["cruzado", "plano-collor", "hiperinflacao", "inconsistencia-temporal", "plano-bresser"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:57" }],
  },
  {
    slug: "plano-collor",
    termo: "Plano Collor",
    categoria: "História do Brasil",
    apelidos: [
      "bloqueio das aplicações",
      "bloqueio da poupança",
      "confisco da poupança",
      "sequestro da liquidez",
      "Collor II",
      "Medida Provisória 168",
      "MP 168",
    ],
    resumo:
      "O plano de março de 1990 que bloqueou por 18 meses o dinheiro acima de NCz$ 50 mil em contas e poupanças, trouxe o cruzeiro de volta e congelou preços. É o caso mais lembrado de mudança de regra contra o poupador no Brasil.",
    texto: [
      "Em 16 de março de 1990, um dia depois da posse de Fernando Collor, a Medida Provisória 168 mudou a vida financeira do país. Saldos acima de 50 mil cruzados novos em conta corrente e na poupança ficaram presos no Banco Central por 18 meses. Em aplicações a prazo e fundos, as regras de saque eram ainda mais restritas. A moeda voltou a se chamar cruzeiro, e os preços foram congelados.",
      "A lógica era tirar dinheiro de circulação de uma vez para matar a inflação. O dinheiro não sumiu: foi devolvido em 12 parcelas a partir de setembro de 1991, corrigido e com juros de 6% ao ano. Mas, por um ano e meio, empresas e famílias ficaram sem acesso à maior parte do que tinham.",
      "A inflação caiu por alguns meses e voltou. Em janeiro de 1991, o Plano Collor II tentou outro congelamento e criou a Taxa Referencial, a TR, que até hoje corrige a poupança.",
    ],
    exemplo:
      "Hipotético: uma família com o equivalente a NCz$ 200 mil na poupança em março de 1990 pôde sacar NCz$ 50 mil. Os outros NCz$ 150 mil ficaram presos e só começaram a voltar, em parcelas, um ano e meio depois.",
    naPratica:
      "O bloqueio atingiu ao mesmo tempo conta, poupança e aplicações de quem tinha dinheiro no sistema brasileiro. Trocar de banco ou de aplicação não teria protegido ninguém. É o exemplo mais forte do risco de jurisdição: só outra jurisdição dilui uma decisão como essa.",
    relacionados: ["risco-de-expropriacao", "hiperinflacao", "cruzeiro", "jurisdicao", "instituicoes", "plano-verao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:57" }],
  },
  {
    slug: "hiperinflacao",
    termo: "Hiperinflação",
    categoria: "História do Brasil",
    apelidos: ["hiperinflações", "inflação galopante", "inflação descontrolada", "superinflação"],
    resumo:
      "Inflação tão alta que a moeda deixa de funcionar. A definição clássica fala em mais de 50% ao mês. O Brasil chegou lá no começo de 1990, depois de quase uma década de inflação de três ou quatro dígitos ao ano.",
    texto: [
      "O economista Phillip Cagan definiu hiperinflação como preços subindo mais de 50% ao mês. Nesse ritmo, o salário recebido no dia 1º compra, no fim do mês, só dois terços do que comprava. Ninguém guarda dinheiro, todo mundo corre para gastar ou aplicar no mesmo dia.",
      "O Brasil passou dessa linha no começo de 1990. Em março, o IPCA subiu 82% num único mês, e a inflação de 12 meses chegou a 6.821% em abril. Mas o país viveu mais de uma década de inflação altíssima: de janeiro de 1980 a junho de 1994, os preços subiram cerca de 11 trilhões por cento pelo IPCA.",
      "O Brasil se defendeu com indexação: correção monetária em contratos, aplicações diárias, preços em dólar. Isso evitou o colapso total da moeda que outros países viveram, mas tornou a inflação mais resistente.",
    ],
    exemplo:
      "Em março de 1990, os preços dobravam a cada 35 dias, mais ou menos. Em 1993, o último ano inteiro antes do real, dobravam a cada dois meses e meio.",
    naPratica:
      "Hiperinflação é a forma extrema de o governo cobrar a conta de quem guarda moeda. Quem tinha acesso a dólar ou a aplicações indexadas se protegia; quem não tinha pagava. A memória desse período é uma das razões pelas quais muitos brasileiros veem o dólar como reserva de valor.",
    relacionados: ["imposto-inflacionario", "senhoriagem", "correcao-monetaria", "plano-real", "inflacao", "ipca"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "9:48" },
      { modulo: 0, aula: 2, tempo: "1:57" },
    ],
  },
  {
    slug: "correcao-monetaria",
    termo: "Correção monetária",
    categoria: "História do Brasil",
    apelidos: ["indexação", "indexador", "indexadores", "ORTN", "OTN", "BTN", "TR", "Taxa Referencial", "contratos corrigidos"],
    resumo:
      "A regra de corrigir automaticamente valores pela inflação passada: salários, aluguéis, impostos, poupança e títulos. Criada em 1964, ajudou o país a conviver com a inflação e, ao mesmo tempo, a perpetuá-la.",
    texto: [
      "Em 1964, o governo criou as Obrigações Reajustáveis do Tesouro Nacional, as ORTN, títulos cujo valor era corrigido pela inflação. A ideia se espalhou: impostos, aluguéis, salários, poupança e contratos passaram a ser reajustados por índices.",
      "No começo, funcionou como proteção: com inflação de dois dígitos, ninguém emprestaria a prazo sem correção. Com o tempo, virou uma armadilha. Se todo preço sobe porque subiu no mês passado, a inflação de ontem vira a de hoje. É a inflação inercial.",
      "Os indexadores mudaram de nome várias vezes: ORTN, OTN, BTN e, desde 1991, a TR. O IGP-M, criado em 1989 pela FGV e muito influenciado por preços em dólar, segue até hoje corrigindo aluguéis.",
    ],
    exemplo:
      "Hipotético: um aluguel de 1.000 corrigido todo mês pela inflação do mês anterior. Se a inflação foi de 20%, o aluguel vai a 1.200, o que obriga o inquilino a pedir aumento, que vira custo para a empresa, que sobe preços. A roda continua girando sozinha.",
    naPratica:
      "A correção monetária explica por que o brasileiro se acostumou a aplicações pós-fixadas que rendem um pouco todo dia. É uma herança que muda o jeito de olhar risco: lá fora, renda fixa oscila no extrato, e o mercado é maior em títulos prefixados.",
    relacionados: ["inflacao-inercial", "urv", "hiperinflacao", "overnight", "inflacao"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "9:48" },
      { modulo: 0, aula: 2 },
    ],
  },
  {
    slug: "inflacao-inercial",
    termo: "Inflação inercial",
    categoria: "História do Brasil",
    apelidos: ["inércia inflacionária", "inércia da inflação", "memória inflacionária"],
    resumo:
      "A inflação que se repete só porque houve inflação antes, já que preços, salários e contratos são reajustados pelo passado. Foi o diagnóstico brasileiro que inspirou a URV.",
    texto: [
      "Em economias muito indexadas, a inflação ganha vida própria. O aluguel sobe porque o índice subiu; o salário sobe porque o aluguel subiu; o preço do pão sobe porque o salário subiu. Mesmo sem nenhum choque novo, a inflação do mês passado se repete neste.",
      "Economistas brasileiros como Persio Arida, André Lara Resende e Francisco Lopes estudaram esse fenômeno nos anos 1980. A conclusão: congelar preços não basta, porque cada contrato estava num ponto diferente do ciclo de reajuste. Alguém sempre sai perdendo, e a inflação volta.",
      "A solução do real foi a URV: alinhar todos os preços numa régua comum antes de trocar a moeda, quebrando a memória sem congelar nada.",
    ],
    exemplo:
      "Hipotético: dois trabalhadores com o mesmo salário médio, um reajustado em janeiro e o outro em junho. Se tudo for congelado em março, o primeiro sai ganhando e o segundo perdendo, e a pressão para reajustar recomeça.",
    naPratica:
      "Entender a inércia ajuda a ler por que a inflação brasileira demora a cair mesmo com juro alto: ainda há muitos preços indexados ao passado. E é parte da explicação de por que o Brasil convive com juros reais tão mais altos que os de outros países.",
    relacionados: ["correcao-monetaria", "urv", "plano-cruzado", "plano-real", "juro-real"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "9:02" }],
  },
  {
    slug: "decada-perdida",
    termo: "Década perdida",
    categoria: "História do Brasil",
    apelidos: ["década perdida latino-americana"],
    resumo:
      "O apelido dos anos 1980 na América Latina: crise da dívida externa, inflação alta e renda por pessoa praticamente parada. No Brasil, foi a década dos planos econômicos fracassados.",
    texto: [
      "Nos anos 1960 e 1970, a América Latina cresceu rápido, em boa parte com dinheiro emprestado em dólar a juros que flutuavam. Quando o Fed subiu os juros para perto de 20%, a partir de 1979, a conta explodiu.",
      "O México parou de pagar em 1982, e os bancos internacionais cortaram o crédito para a região inteira. Os países tiveram de gerar dólares para pagar juros, cortaram investimento, desvalorizaram as moedas e, em vários casos, imprimiram dinheiro. No Brasil, a inflação passou de três dígitos e a renda por pessoa terminou a década perto de onde começou.",
      "O nome pegou porque, para muitos países, foram dez anos sem avanço de renda, com crise atrás de crise.",
    ],
    exemplo:
      "O Brasil teve cinco moedas entre 1986 e 1994 e declarou moratória da dívida externa em 1987. A dívida só foi renegociada de forma definitiva em abril de 1994.",
    naPratica:
      "A década perdida mostra como uma decisão tomada fora do país, a alta de juros nos Estados Unidos, pode desmontar uma economia emergente endividada em dólar. É um exemplo de choque que nenhuma carteira só brasileira teria evitado.",
    relacionados: ["crise-da-divida-externa", "moratoria-de-1987", "hiperinflacao", "banco-central", "fmi"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "4:02" }],
  },
  {
    slug: "crise-da-divida-externa",
    termo: "Crise da dívida externa",
    categoria: "História do Brasil",
    apelidos: ["crise da dívida", "dívida externa", "choque do petróleo", "choques do petróleo", "choque de juros de 1979", "Plano Brady"],
    resumo:
      "A crise que começou em 1979, com o segundo choque do petróleo e a alta de juros nos Estados Unidos, e quebrou a América Latina endividada em dólar. Só foi resolvida no Brasil com o acordo de 1994.",
    texto: [
      "Em 1979, a Revolução Iraniana disparou o preço do petróleo, e a inflação americana encostou em 15% ao ano. O Fed, comandado por Paul Volcker, levou os juros para perto de 20% para derrubá-la.",
      "A América Latina devia em dólar e a juros que acompanhavam os americanos. A conta dos juros explodiu justo quando os preços das exportações caíam. O México declarou moratória em 1982, o crédito sumiu para a região, e o Brasil recorreu ao FMI e depois, em 1987, suspendeu o pagamento de juros aos bancos.",
      "A saída veio pela renegociação, com títulos novos e descontos, no modelo conhecido como Plano Brady. O acordo brasileiro com os bancos saiu em abril de 1994, sem o FMI, e o Brasil comprou por conta própria os títulos americanos dados em garantia.",
    ],
    exemplo:
      "Hipotético: um país deve US$ 100 bilhões a juros flutuantes de 6% ao ano. Se o juro americano sobe e a taxa vai a 16%, a conta anual passa de US$ 6 bilhões para US$ 16 bilhões, sem que o país tenha tomado um centavo a mais.",
    naPratica:
      "Hoje a dívida pública brasileira é quase toda em reais, o que reduz esse risco específico. Mas o episódio mostra como juros americanos e preço do dólar chegam ao patrimônio de quem está no Brasil, mesmo de quem nunca comprou um dólar.",
    relacionados: ["decada-perdida", "moratoria-de-1987", "fmi", "banco-central", "risco-pais"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "4:02" }],
  },
  {
    slug: "moratoria-de-1987",
    termo: "Moratória de 1987",
    categoria: "História do Brasil",
    apelidos: ["moratória em 1987", "moratória externa", "moratória da dívida externa"],
    resumo:
      "A suspensão, em fevereiro de 1987, do pagamento de juros da dívida externa brasileira com bancos estrangeiros. Foi a última vez que o Brasil deixou de pagar credores externos.",
    texto: [
      "Em 20 de fevereiro de 1987, com as reservas no chão depois do fracasso do Plano Cruzado, o governo Sarney anunciou que deixaria de pagar os juros da dívida externa aos bancos comerciais.",
      "A moratória não resolveu o problema e fechou ainda mais as portas do crédito. O país passou os anos seguintes renegociando, até o acordo definitivo com os bancos, assinado em abril de 1994, pouco antes do real.",
      "Na conta de Carmen Reinhart e Kenneth Rogoff, o Brasil deu calote ou renegociou a dívida externa nove vezes entre 1828 e 1983. Esse histórico ainda pesa no prêmio que o mercado cobra do país.",
    ],
    exemplo:
      "Na aula, a moratória aparece numa matriz de quatro saídas para uma conta pública que não fecha: mais impostos, menos gastos, imprimir dinheiro ou não pagar o credor. Em 1987, o Brasil escolheu a última.",
    naPratica:
      "Calote, renegociação forçada e bloqueio são formas de passar a conta ao credor. Quem concentra o patrimônio em títulos e depósitos de um único país fica exposto a essa saída. Diversificar devedores é diversificar esse risco.",
    relacionados: ["crise-da-divida-externa", "decada-perdida", "risco-pais", "reservas-internacionais", "plano-cruzado"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "23:49" },
      { modulo: 0, aula: 2, tempo: "4:02" },
    ],
  },
  {
    slug: "proer",
    termo: "Proer",
    categoria: "História do Brasil",
    apelidos: ["Programa de Estímulo à Reestruturação e ao Fortalecimento do Sistema Financeiro Nacional", "socorro aos bancos", "Banco Econômico", "Banco Nacional", "Bamerindus"],
    resumo:
      "O programa criado em novembro de 1995 para reorganizar bancos que quebraram com o fim da inflação alta. Financiou a venda de instituições como Nacional e Bamerindus a bancos mais sólidos.",
    texto: [
      "Com inflação alta, um banco ganhava só por guardar o depósito do cliente, que não rendia nada, e aplicar o dinheiro a taxas que acompanhavam os preços. Era o imposto inflacionário na versão privada.",
      "Quando o real derrubou a inflação, esse ganho caiu de quase 2% do PIB em 1993 para menos de 0,1% em 1995, e bancos mal administrados ficaram sem chão. O Banco Central interveio no Econômico em agosto de 1995 e, em novembro, criou o Proer, com linhas de crédito para que bancos saudáveis comprassem a parte boa dos problemáticos.",
      "Nacional e Bamerindus foram os casos mais conhecidos. No mesmo período nasceu o Fundo Garantidor de Créditos, o FGC, que protege depósitos até um limite.",
    ],
    exemplo:
      "O Banco Nacional foi vendido ao Unibanco em 1995, e o Bamerindus, ao HSBC em 1997, ambos com apoio do Proer.",
    naPratica:
      "O Proer mostra que o sistema bancário também é parte do risco do país. A proteção que existe hoje, o FGC, tem limite por CPF e por instituição, e ela própria é brasileira: protege contra a quebra de um banco, não contra uma crise do país.",
    relacionados: ["fgc", "imposto-inflacionario", "plano-real", "banco-central", "custodia"],
    noCurso: [{ modulo: 0, aula: 2 }],
  },
  {
    slug: "crise-de-1999",
    termo: "Crise de 1999",
    categoria: "História do Brasil",
    apelidos: [
      "janeiro de 1999",
      "desvalorização de 1999",
      "fim da banda",
      "fim da banda cambial",
      "moratória de Minas",
      "moratória de Minas Gerais",
      "maxidesvalorização",
    ],
    resumo:
      "A crise que, em janeiro de 1999, derrubou a banda cambial do real. Em semanas, o dólar foi de R$ 1,21 para quase R$ 2. Dela nasceu o tripé macroeconômico.",
    texto: [
      "Depois das crises do México, da Ásia e da Rússia, o mercado passou a desconfiar de toda moeda emergente presa ao dólar. O Brasil gastou reservas e subiu juros para defender o real ao longo de 1998.",
      "Em 6 de janeiro de 1999, o governador de Minas Gerais, Itamar Franco, anunciou uma moratória de 90 dias da dívida do estado com a União. A desconfiança se espalhou. Gustavo Franco deixou a presidência do Banco Central em 13 de janeiro e, dois dias depois, o câmbio passou a flutuar.",
      "O dólar saiu de R$ 1,21 em 12 de janeiro para R$ 1,98 no dia 29 e chegou a R$ 2,16 no começo de março. Arminio Fraga assumiu o Banco Central e, em poucos meses, montou o regime de metas de inflação.",
    ],
    exemplo:
      "Pela cotação oficial do Banco Central, a alta do dólar de 12 a 29 de janeiro de 1999 foi de 64%: em dólar, o real perdeu 39% do valor em pouco mais de duas semanas.",
    naPratica:
      "Uma briga entre dois pedaços do mesmo Estado redesenhou em semanas o patrimônio de quem tinha tudo em títulos públicos em reais. Nada disso dependia da carteira de quem sofreu as consequências.",
    relacionados: ["cambio-fixo", "cambio-flutuante", "tripe-macroeconomico", "restricao-orcamentaria-fraca", "reservas-internacionais"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "18:55" },
      { modulo: 0, aula: 2, tempo: "21:18" },
    ],
  },
  {
    slug: "crise-de-2002",
    termo: "Crise de 2002",
    categoria: "História do Brasil",
    apelidos: ["eleição de 2002", "crise eleitoral de 2002"],
    resumo:
      "A crise de confiança da eleição presidencial de 2002. Antes de o novo governo tomar qualquer decisão, o dólar foi a R$ 3,96 e o risco-país passou de 2.400 pontos.",
    texto: [
      "Em 2002, o candidato favorito, Lula, disputava a quarta eleição presidencial depois de ter se oposto ao Plano Real, às privatizações e à Lei de Responsabilidade Fiscal. O mercado cobrou pela hipótese de ruptura antes de qualquer ato.",
      "O dólar subiu 74% entre a mínima de abril, R$ 2,27, e a máxima de outubro, R$ 3,96. O EMBI+ Brasil chegou a 2.443 pontos em setembro, e a Selic terminou o ano em 25%. Em agosto, o país fechou com o FMI um acordo de cerca de US$ 30 bilhões.",
      "Em junho, a Carta ao Povo Brasileiro comprometeu o candidato com o superávit e o respeito aos contratos. Eleito, o governo cumpriu a carta, subiu a meta de superávit, e o prêmio de risco caiu sem que a dívida tivesse mudado de tamanho.",
    ],
    exemplo:
      "A 27% ao ano, a soma do juro americano com o risco-país citado na aula para 2002, uma dívida dobra em menos de três anos.",
    naPratica:
      "O risco político existe antes de qualquer decisão: basta a dúvida. Ele dá para medir, olhando como o dólar se comporta em anos de eleição, mas não dá para evitar. O que você escolhe é quanto do patrimônio fica exposto a ele.",
    relacionados: ["carta-ao-povo-brasileiro", "risco-pais", "embi", "fmi", "cambio-flutuante"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "18:55" },
      { modulo: 0, aula: 2, tempo: "41:25" },
    ],
  },
  {
    slug: "carta-ao-povo-brasileiro",
    termo: "Carta ao Povo Brasileiro",
    categoria: "História do Brasil",
    apelidos: ["carta ao povo"],
    resumo:
      "O documento divulgado por Lula em 22 de junho de 2002, durante a campanha, com o compromisso de manter o superávit primário, respeitar contratos e controlar a inflação. Marcou a virada da crise daquele ano.",
    texto: [
      "Com o dólar subindo e o risco-país disparando, a campanha de Lula divulgou, em junho de 2002, um texto dirigido ao eleitor e, na prática, ao mercado. Nele, o candidato se comprometia a preservar o superávit primário necessário para a dívida não crescer, a respeitar os contratos e a manter a inflação sob controle.",
      "A carta não acalmou o mercado de imediato: o pior da crise veio entre setembro e outubro. O que mudou a leitura foi o que veio depois. O governo eleito manteve o tripé, subiu a meta de superávit e, em 2005, pagou adiantado o que devia ao FMI.",
      "O episódio virou exemplo de como compromissos públicos ganham valor quando são confirmados pelos atos.",
    ],
    exemplo:
      "O EMBI+ Brasil teve média de 1.364 pontos em 2002 e de 835 em 2003. A dívida não tinha encolhido nesse intervalo; a confiança, sim.",
    naPratica:
      "Para o investidor, a lição é que o mercado precifica promessas pelo histórico de cumpri-las. Isso vale para qualquer governo e qualquer país, e é um dos motivos para não deixar todo o patrimônio dependente de uma única leitura política.",
    relacionados: ["crise-de-2002", "resultado-primario", "risco-pais", "tripe-macroeconomico", "inconsistencia-temporal"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "41:25" }],
  },
  {
    slug: "lei-de-responsabilidade-fiscal",
    termo: "Lei de Responsabilidade Fiscal",
    sigla: "LRF",
    categoria: "História do Brasil",
    apelidos: ["Lei Complementar 101", "LC 101", "responsabilidade fiscal"],
    resumo:
      "A lei de maio de 2000 que impôs limites a gastos com pessoal e a dívidas de União, estados e municípios, proibiu socorros entre eles e vedou o governo de se financiar no banco que controla.",
    texto: [
      "Depois de décadas de estados gastando além da conta e sendo socorridos pela União, o Congresso aprovou a Lei Complementar 101, de 4 de maio de 2000. Ela fechou o desenho do tripé com regras para todas as esferas de governo.",
      "A lei limita o gasto com pessoal a uma fatia da receita: 50% para a União e 60% para estados e municípios. Exige metas fiscais anuais, proíbe que um ente socorra outro e impede que o governante deixe, nos últimos oito meses do mandato, despesas que não possam ser pagas.",
      "Os artigos 35 e 36 proíbem que um governo tome empréstimo no banco público que controla. O desrespeito a essa lógica, com bancos federais cobrindo despesas da União, embasou o processo de impeachment de 2016.",
    ],
    exemplo:
      "Hipotético: um estado com receita corrente líquida de R$ 100 bilhões pode gastar até R$ 60 bilhões com pessoal, somando todos os Poderes. Se passar do limite, sofre restrições, como deixar de receber transferências voluntárias.",
    naPratica:
      "A LRF reduziu o risco de socorros e de financiamento disfarçado, mas não o eliminou: houve renegociações de dívidas estaduais depois dela. Regras ajudam; o que o mercado acompanha é se são cumpridas.",
    relacionados: ["restricao-orcamentaria-fraca", "tripe-macroeconomico", "arcabouco-fiscal", "teto-de-gastos", "resultado-primario"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "31:42" }],
  },
  {
    slug: "recessao-2015-2016",
    termo: "Recessão de 2015 e 2016",
    categoria: "História do Brasil",
    apelidos: ["recessão", "recessão de 2015", "grande depressão brasileira", "crise de 2015"],
    resumo:
      "Dois anos seguidos de PIB em queda, de 3,5% em 2015 e 3,3% em 2016. O superávit primário virou déficit, o Brasil perdeu o grau de investimento e a Selic foi a 14,25%.",
    texto: [
      "O fim do boom de commodities, a partir de 2011, deixou o Brasil com despesas que tinham crescido nos anos de bonança e receitas que já não acompanhavam. O superávit primário, acima de 3% do PIB por anos, virou déficit em 2014.",
      "Em 2015, a economia encolheu 3,5%; em 2016, mais 3,3%. A aula chama o período de grande depressão brasileira. Com o orçamento quase todo carimbado, o ajuste caiu sobre investimento, custeio e regras de benefícios. As três grandes agências tiraram o grau de investimento do país entre setembro de 2015 e fevereiro de 2016.",
      "A saída veio com uma aposta em previsibilidade: o teto de gastos, em dezembro de 2016, e a queda da Selic de 14,25% para 6,5% até março de 2018.",
    ],
    exemplo:
      "A média do dólar passou de R$ 2,35 em 2014 para R$ 3,33 em 2015, uma alta de 42% em um ano.",
    naPratica:
      "Numa recessão doméstica, renda, emprego, bolsa e câmbio do país pioram juntos. É exatamente o cenário em que ter uma parte do patrimônio fora da economia brasileira faz diferença, porque ele não depende das mesmas causas.",
    relacionados: ["resultado-primario", "teto-de-gastos", "grau-de-investimento", "superciclo-de-commodities", "joesley-day"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:09:04" }],
  },
  {
    slug: "joesley-day",
    termo: "Joesley Day",
    categoria: "História do Brasil",
    apelidos: ["18 de maio de 2017"],
    resumo:
      "O 18 de maio de 2017, dia seguinte à revelação de uma gravação do presidente Michel Temer feita pelo empresário Joesley Batista. A bolsa caiu tanto que o pregão foi interrompido, e o dólar subiu 8,8%.",
    texto: [
      "Na noite de 17 de maio de 2017, o colunista Lauro Jardim, de O Globo, revelou que o empresário Joesley Batista tinha gravado o presidente Michel Temer numa conversa que fazia parte de uma delação premiada. Com as reformas em andamento no Congresso, o mercado leu a notícia como ameaça a elas.",
      "No dia seguinte, o Ibovespa caiu mais de 10% logo cedo e o pregão foi interrompido automaticamente, o chamado circuit breaker, o que não acontecia desde 2008. O índice fechou em queda de 8,8%. O dólar subiu de R$ 3,11 para R$ 3,38, e o risco-país saltou 42 pontos.",
      "O governo sobreviveu, mas gastou o capital político que seria usado em reformas.",
    ],
    exemplo:
      "Em um único dia, quem tinha todo o patrimônio em ações brasileiras viu perto de 9% evaporar, e quem tinha uma parte em dólar viu essa parte subir quase o mesmo tanto em reais.",
    naPratica:
      "Na aula, a frase que resume o episódio é que o risco político brasileiro não pode ser 100% do seu risco patrimonial. Ninguém prevê uma gravação; dá apenas para decidir quanto do patrimônio fica exposto a eventos assim.",
    relacionados: ["risco-pais", "recessao-2015-2016", "cambio-flutuante", "risco-de-expropriacao", "diversificacao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:17:30" }],
  },
  {
    slug: "pandemia-de-2020",
    termo: "Pandemia de 2020",
    categoria: "História do Brasil",
    apelidos: ["pandemia", "covid", "covid-19", "orçamento de guerra", "cisne negro de 2020"],
    resumo:
      "O choque da covid-19 na economia brasileira: déficit de 9,2% do PIB, dívida a 87% do PIB, Selic a 2% e dólar de R$ 4,02 a R$ 5,94 em cinco meses.",
    texto: [
      "Em março de 2020, a pandemia parou cadeias de produção no mundo inteiro. A bolsa brasileira interrompeu o pregão várias vezes, e a falta de chips travou a indústria de carros por anos.",
      "Em maio, o Congresso aprovou o chamado orçamento de guerra, que separou os gastos da emergência das regras fiscais normais. O setor público fechou o ano com déficit primário de 9,2% do PIB, e a dívida bruta chegou a 86,9% do PIB.",
      "Com a inflação em queda no auge do isolamento, o Banco Central levou a Selic a 2% em agosto. Com juro real negativo, o Brasil perdeu atrativo para o dinheiro de curto prazo. O dólar, que começara o ano a R$ 4,02, chegou a R$ 5,94 em maio. A inflação de 2021 fechou em 10,1%, e os juros voltaram a subir.",
    ],
    exemplo:
      "Dois anos depois, a dívida tinha voltado a 71,7% do PIB, ajudada pela inflação, que inflou o PIB em reais e a arrecadação.",
    naPratica:
      "A pandemia é o cisne negro clássico: um evento raro e de impacto enorme que ninguém pôs no cenário. A defesa contra o que não dá para prever é não ter tudo exposto à mesma causa.",
    relacionados: ["divida-pib", "resultado-primario", "selic", "juro-real", "cambio-flutuante"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "1:22:05" }],
  },
  {
    slug: "privatizacoes",
    termo: "Privatizações",
    categoria: "História do Brasil",
    apelidos: ["privatização", "Programa Nacional de Desestatização", "PND", "desestatização"],
    resumo:
      "A venda de empresas estatais ao setor privado, iniciada em 1990 com o Programa Nacional de Desestatização e acelerada nos anos 1990, com siderúrgicas, Vale e o sistema Telebras.",
    texto: [
      "Até os anos 1980, o Estado brasileiro era dono de siderúrgicas, mineradoras, telefônicas, bancos estaduais e distribuidoras de energia. Muitas davam prejuízo e dependiam do Tesouro.",
      "Em 1990, o governo Collor criou o Programa Nacional de Desestatização. Nos anos seguintes foram vendidas siderúrgicas como a Usiminas, a Vale, em 1997, e o sistema Telebras, em 1998, além de bancos estaduais como o Banespa.",
      "As privatizações ajudaram a abater dívida, trouxeram investimento e tiraram do Tesouro empresas que precisavam de aporte. Na aula, aparecem como parte da resposta ao buraco que o fim da inflação revelou nas contas.",
    ],
    exemplo:
      "Antes da venda do sistema Telebras, uma linha de telefone fixo era um bem que entrava na declaração de imposto de renda e podia custar milhares de reais no mercado paralelo.",
    naPratica:
      "A composição da bolsa brasileira até hoje reflete essa história: muitas das maiores empresas são ex-estatais ou ainda têm o governo como controlador, o que traz para a carteira o risco de decisões políticas sobre preços e investimentos.",
    relacionados: ["plano-real", "restricao-orcamentaria-fraca", "divida-publica", "risco-de-expropriacao"],
    noCurso: [{ modulo: 0, aula: 2, tempo: "14:55" }],
  },
  {
    slug: "overnight",
    termo: "Overnight",
    categoria: "História do Brasil",
    apelidos: ["aplicação de um dia para o outro", "conta remunerada", "open market"],
    resumo:
      "Aplicação de um dia para o outro, lastreada em títulos públicos, que protegia da inflação quem tinha acesso aos bancos nos anos de hiperinflação. Era o refúgio diário do dinheiro de empresas e famílias de renda mais alta.",
    texto: [
      "Com preços subindo mais de 1% por dia, deixar dinheiro parado de um dia para o outro era perder. Os bancos ofereciam então o overnight: o dinheiro era aplicado à noite em títulos públicos e voltava na manhã seguinte com a correção do dia.",
      "Quem tinha conta remunerada se defendia da inflação. Quem recebia em dinheiro vivo, ou não tinha acesso a banco, pagava o imposto inflacionário inteiro. Era uma das faces mais desiguais da hiperinflação.",
      "O mesmo mecanismo financiava o governo todos os dias, rolando a dívida pública em prazos curtíssimos. O Plano Collor bloqueou boa parte desse dinheiro em 1990, e a estabilização do real tirou do overnight a razão de existir.",
    ],
    exemplo:
      "Hipotético: com inflação de 40% ao mês, R$ 10 mil parados por um mês viravam o equivalente a cerca de R$ 7 mil. No overnight, voltavam corrigidos dia a dia.",
    naPratica:
      "O hábito brasileiro de buscar aplicações que rendem um pouquinho todo dia, como o CDI, vem desse tempo. Ele explica parte do conforto com o pós-fixado e do estranhamento com investimentos que oscilam, como a renda fixa americana.",
    relacionados: ["imposto-inflacionario", "hiperinflacao", "correcao-monetaria", "cdi", "plano-collor"],
    noCurso: [{ modulo: 0, aula: 2 }],
  },

  // =============================================================================================
  // ACESSO, CONTAS E IMPOSTOS
  // =============================================================================================
  {
    slug: "marco-cambial",
    termo: "Marco cambial",
    categoria: "Acesso, contas e impostos",
    apelidos: ["novo marco cambial", "Lei 14.286", "Lei 14.286/2021", "nova lei de câmbio", "lei cambial"],
    resumo:
      "A Lei 14.286, de dezembro de 2021, em vigor desde o fim de 2022, que reescreveu as regras de câmbio do Brasil. Simplificou o envio de dinheiro ao exterior e abriu espaço para contas globais e remessas digitais.",
    texto: [
      "Até 2022, as regras de câmbio brasileiras estavam espalhadas em dezenas de leis e normas, algumas dos anos 1930. Mandar dinheiro para fora exigia papelada, enquadramento em códigos e, muitas vezes, uma ida à agência.",
      "A Lei 14.286, de 29 de dezembro de 2021, que passou a valer em 31 de dezembro de 2022, consolidou tudo e deu ao Banco Central poder para regulamentar o resto. Entre as mudanças práticas: o limite de dinheiro em espécie que se pode levar ou trazer numa viagem passou a ser de US$ 10 mil, e pessoas físicas podem vender entre si, de forma eventual, até US$ 500 em espécie.",
      "O mais importante para o investidor foi o efeito indireto. Com regras mais simples, bancos e fintechs passaram a oferecer contas em dólar no exterior e remessas pelo celular, a custos bem menores que os de antes.",
    ],
    exemplo:
      "Antes, investir lá fora pedia private banking, papelada e um valor mínimo alto. Hoje você abre uma conta internacional pelo aplicativo e faz a remessa em minutos. A barreira deixou de ser burocrática e passou a ser de método.",
    naPratica:
      "A lei facilitou a porta de entrada, mas não mudou os impostos nem as obrigações de declarar. E uma regra de câmbio pode voltar a mudar: a abertura de hoje é escolha política, não garantia.",
    relacionados: ["conta-global", "remessa", "iof", "corretora-internacional", "conta-em-moeda-estrangeira"],
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
      "O IOF é um imposto diferente dos outros: serve mais para o governo regular o fluxo de dinheiro do que para arrecadar. Por isso a Constituição permite que as alíquotas sejam mudadas por decreto, com efeito imediato, sem esperar o ano seguinte.",
      "Em 2022, um decreto prometeu zerar o IOF sobre câmbio até 2029. Em 2025, decretos de maio e junho desfizeram a promessa e subiram as alíquotas; o Congresso chegou a derrubar a mudança, e o Supremo restabeleceu quase tudo em julho. Pelo Decreto 12.499, de junho de 2025, a remessa de residente para investir no exterior paga 1,1%. Comprar dólar em espécie, gastar no cartão internacional ou mandar dinheiro para uma conta lá fora para ter saldo disponível paga 3,5%.",
      "Quem cobra é a instituição que faz o câmbio, na hora da operação. A alíquota certa depende da finalidade informada, por isso vale conferir como a operação foi classificada.",
    ],
    exemplo:
      "Hipotético: ao enviar R$ 100 mil para investir numa corretora no exterior em seu nome, você paga R$ 1.100 de IOF. Se o mesmo valor for para uma conta de disponibilidade, sem finalidade de investimento, o IOF é de R$ 3.500.",
    naPratica:
      "O IOF é um custo que o governo muda por decreto, inclusive em momentos de estresse. Faz sentido comparar caminhos pelo custo total, com câmbio, IOF e tarifas, e lembrar que a regra de hoje pode não ser a de amanhã. Confira a alíquota vigente antes de cada remessa.",
    relacionados: ["remessa", "conta-global", "marco-cambial", "risco-de-expropriacao", "bdr"],
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
      "Depois do marco cambial, vários bancos e fintechs passaram a oferecer contas em dólar abertas pelo celular. Na maioria dos casos, o dinheiro fica numa instituição parceira fora do Brasil, e o aplicativo brasileiro é a porta de entrada.",
      "É útil para quem viaja, paga serviços em dólar ou quer ter uma reserva em outra moeda. Algumas contas pagam rendimento sobre o saldo, outras dão acesso a investimentos como ações e ETFs americanos.",
      "Antes de abrir, vale entender três coisas: em que instituição o dinheiro fica de fato, que proteção existe se ela quebrar (nos Estados Unidos, depósitos em bancos têm o seguro do FDIC até US$ 250 mil, e investimentos em corretoras têm a SIPC), e como a remessa é classificada para o IOF.",
    ],
    exemplo:
      "Hipotético: você manda US$ 5 mil para uma conta global para usar numa viagem. A remessa paga 3,5% de IOF, porque não é investimento. Se a conta não pagar juros, a variação do dólar sobre esse saldo não é tributada, pela regra da Lei 14.754.",
    naPratica:
      "A conta global é uma porta, não um investimento. Saldo parado em dólar protege contra a moeda, mas não contra a inflação americana. E todo saldo e rendimento lá fora precisa ser declarado no imposto de renda.",
    relacionados: ["marco-cambial", "iof", "corretora-internacional", "custodia", "sipc", "lei-14754"],
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
      "Para comprar uma ação ou um ETF americano diretamente, você precisa de uma conta numa corretora autorizada a operar lá. Nos Estados Unidos, elas são registradas na SEC, o regulador do mercado, e na Finra, a entidade que fiscaliza as corretoras.",
      "O caminho tem três passos: abrir a conta, preencher o formulário W-8BEN para declarar que você não é residente fiscal americano, e mandar o dinheiro do Brasil por uma operação de câmbio. A partir daí, você compra os ativos em dólar.",
      "Os ativos ficam em seu nome, sob as regras americanas. Em caso de quebra da corretora, a SIPC cobre a falta de ativos de cada cliente até um limite. Quem cuida do imposto no Brasil, porém, é você: a corretora americana não recolhe o IR brasileiro.",
    ],
    exemplo:
      "Hipotético: você manda R$ 55 mil a uma corretora americana com o dólar a R$ 5,50 e recebe US$ 10 mil, menos o IOF de 1,1% e o custo do câmbio. Com isso, compra cotas de um ETF de ações globais em seu nome.",
    naPratica:
      "Investir direto lá fora põe o patrimônio em outra jurisdição de verdade, mas traz obrigações: declarar no Brasil, calcular o imposto em reais e pensar na sucessão, por causa do estate tax americano. Antes de abrir conta, confira o registro da corretora no BrokerCheck, da Finra.",
    relacionados: ["w-8ben", "sipc", "custodia", "remessa", "estate-tax", "lei-14754"],
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
      "Ter uma conta em dólar num banco de fora é legal para qualquer residente no Brasil, desde que o dinheiro tenha saído pelos canais oficiais e a conta seja declarada à Receita e, acima de certo valor, ao Banco Central.",
      "Dentro do Brasil, a história é outra. O marco cambial abriu caminho para ampliar as contas em moeda estrangeira no país, mas quem pode tê-las depende de regulamentação do Banco Central, que segue restrita a situações específicas.",
      "Para o imposto, há uma regra que vale conhecer: pela Lei 14.754, a variação do câmbio sobre depósitos em conta corrente no exterior que não paguem juros não é tributada, desde que o banco seja autorizado a funcionar no país em que está.",
    ],
    exemplo:
      "Hipotético: você mantém US$ 20 mil numa conta sem juros nos Estados Unidos. O dólar sobe de R$ 5 para R$ 5,50. Os R$ 10 mil de ganho em reais não pagam imposto. Se a conta pagasse juros, os juros e a variação cambial entrariam na conta da Lei 14.754.",
    naPratica:
      "Uma conta no exterior é o jeito mais simples de ter uma reserva em outra moeda e em outra jurisdição. A proteção do depósito, porém, é a do país onde o banco está, e não o FGC brasileiro.",
    relacionados: ["conta-global", "lei-14754", "declaracao-de-capitais-no-exterior", "fgc", "jurisdicao"],
  },
  {
    slug: "remessa",
    termo: "Remessa internacional",
    categoria: "Acesso, contas e impostos",
    apelidos: ["remessa", "remessas", "remessas internacionais", "transferência internacional", "envio de dinheiro ao exterior", "eFX"],
    resumo:
      "O envio de dinheiro do Brasil para o exterior, ou o contrário, por meio de uma operação de câmbio. O custo total junta cotação, tarifa e IOF, e a instituição é obrigada a mostrá-lo antes, no chamado VET.",
    texto: [
      "Toda remessa é uma operação de câmbio: você entrega reais, a instituição autorizada pelo Banco Central converte em dólar e envia para a conta de destino. Pode ser um banco, uma corretora de câmbio ou uma empresa de pagamento internacional, os chamados eFX.",
      "O custo tem três partes. A cotação usada, que costuma ficar acima do dólar comercial; tarifas fixas ou percentuais; e o IOF. Para comparar, use o Valor Efetivo Total, o VET, que a instituição tem de informar antes de fechar a operação: ele diz quantos reais você paga, no fim, por dólar entregue.",
      "A finalidade declarada importa. Para investimento em nome próprio, o IOF é de 1,1%; para manter saldo disponível lá fora, 3,5%. Guarde o comprovante: é o que prova a origem do dinheiro e o custo em reais para o imposto de renda.",
    ],
    exemplo:
      "Hipotético: duas instituições anunciam o dólar a R$ 5,50 e R$ 5,52. A primeira cobra R$ 80 de tarifa; a segunda, nada. Numa remessa de US$ 1.000, a primeira sai mais cara. Só o VET mostra isso de uma vez.",
    naPratica:
      "Diferenças de meio ponto percentual parecem pequenas, mas se repetem a cada remessa. Quem pretende converter em várias janelas, ao longo de meses, ganha comparando o VET e escolhendo um canal antes de começar.",
    relacionados: ["iof", "marco-cambial", "conta-global", "corretora-internacional", "cambio"],
  },
  {
    slug: "lei-14754",
    termo: "Lei 14.754/2023",
    categoria: "Acesso, contas e impostos",
    apelidos: ["Lei 14.754", "lei das offshores", "tributação de aplicações no exterior", "tributação de investimentos no exterior", "lei das offshores e trusts"],
    resumo:
      "A lei que, desde janeiro de 2024, tributa em 15%, na declaração anual, os rendimentos de pessoas físicas com aplicações financeiras, offshores e trusts no exterior. O cálculo é em reais, com a variação do câmbio dentro.",
    texto: [
      "Até 2023, o rendimento de aplicações no exterior era tributado de formas variadas, e muitas vezes o imposto podia ser adiado indefinidamente por meio de empresas no exterior. A Lei 14.754, de dezembro de 2023, em vigor desde 1º de janeiro de 2024, unificou a regra.",
      "Funciona assim. Rendimentos de aplicações financeiras no exterior, como juros, dividendos e ganhos na venda de ações, ETFs, títulos e também criptoativos, entram numa ficha separada da declaração anual e pagam 15%, sem deduções. O imposto é devido quando o rendimento é efetivamente recebido, por exemplo na venda ou no pagamento de juros. Perdas podem ser compensadas com ganhos.",
      "A lei também tratou de empresas no exterior controladas por pessoas físicas, as offshores, e de trusts. E trouxe isenções pontuais: a variação cambial de depósitos sem juros e a venda de até US$ 5 mil por ano em dólar em espécie não são tributadas.",
    ],
    exemplo:
      "Hipotético: você compra US$ 10 mil de um ETF com o dólar a R$ 5,00 (R$ 50 mil) e vende por US$ 12 mil com o dólar a R$ 5,50 (R$ 66 mil). O ganho tributável é de R$ 16 mil, e o imposto, de R$ 2.400, pago na declaração do ano seguinte.",
    naPratica:
      "Duas consequências pesam. O imposto pega também a alta do dólar, mesmo quando, em dólar, o ganho foi zero. E ele não é retido na fonte: cabe a você calcular, em reais, e declarar. Os detalhes, com exceções e compensação de perdas, devem sempre ser conferidos na regra em vigor.",
    relacionados: ["imposto-de-renda", "variacao-cambial-no-imposto", "compensacao-de-perdas", "offshore", "trust", "ganho-de-capital"],
    noCurso: [{ modulo: 0, aula: 1, tempo: "35:56" }],
  },
  {
    slug: "imposto-de-renda",
    termo: "Imposto de renda sobre investimentos no exterior",
    categoria: "Acesso, contas e impostos",
    apelidos: [
      "imposto de renda",
      "IRPF",
      "imposto sobre a renda",
      "declaração de imposto de renda",
      "declaração anual",
      "Declaração de Ajuste Anual",
      "bens e direitos",
    ],
    resumo:
      "Quem mora no Brasil paga imposto de renda sobre o que ganha no mundo inteiro. Investimentos no exterior entram na declaração anual, com regra própria, e precisam aparecer também na ficha de bens e direitos.",
    texto: [
      "O Brasil tributa os residentes pela renda mundial: não importa se o ganho veio de um CDB em São Paulo ou de uma ação em Nova York. O que muda é a regra aplicada a cada tipo de investimento.",
      "Aplicações financeiras no exterior seguem a Lei 14.754: 15% sobre o rendimento do ano, apurado na declaração anual. Bens que não são aplicações financeiras, como um imóvel no exterior, seguem a regra de ganho de capital, apurada no mês da venda. Investimentos feitos aqui, mesmo com exposição ao exterior, como BDRs e ETFs da B3, seguem as regras brasileiras de renda variável.",
      "Desde 2026, a Lei 15.270, de novembro de 2025, também alterou o imposto de quem tem renda alta, com uma tributação mínima para rendas acima de R$ 600 mil por ano e retenção de 10% sobre dividendos acima de R$ 50 mil por mês pagos por uma mesma empresa brasileira. As regras se somam, e vale conferir como elas conversam no seu caso.",
    ],
    exemplo:
      "Hipotético: no mesmo ano, você teve ganho num ETF americano, comprado direto lá fora, e num ETF brasileiro que replica o S&P 500. O primeiro entra na ficha de aplicações no exterior e paga 15% na declaração anual. O segundo segue a regra de renda variável no Brasil, apurada mês a mês.",
    naPratica:
      "Escolher o veículo, conta lá fora, ETF local ou BDR, também é escolher o regime de imposto, o momento de pagar e o trabalho de calcular. O imposto não deve decidir sozinho, mas precisa entrar na comparação.",
    relacionados: ["lei-14754", "ganho-de-capital", "variacao-cambial-no-imposto", "dupla-tributacao", "bdr", "residencia-fiscal"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "35:56" },
      { modulo: 0, aula: 4, tempo: "12:50" },
    ],
  },
  {
    slug: "ganho-de-capital",
    termo: "Ganho de capital",
    categoria: "Acesso, contas e impostos",
    apelidos: ["ganhos de capital", "lucro na venda", "imposto sobre ganho de capital", "GCAP"],
    resumo:
      "A diferença entre o preço de venda e o custo de compra de um bem ou investimento. É sobre ela que, em geral, incide o imposto quando você vende com lucro.",
    texto: [
      "Comprou por 100 e vendeu por 130? O ganho de capital é 30. O imposto incide sobre esse ganho, não sobre o valor total da venda.",
      "No Brasil, o tratamento depende do que foi vendido. Ações negociadas na B3 têm regra própria, com isenção para vendas de até R$ 20 mil por mês em ações. Aplicações financeiras no exterior seguem a Lei 14.754, com 15% na declaração anual. Bens no exterior que não são aplicações financeiras, como um imóvel, seguem o ganho de capital tradicional, com alíquotas de 15% a 22,5% conforme o tamanho do ganho, apuradas no mês seguinte à venda.",
      "Para investimentos no exterior, o custo e o preço de venda são convertidos em reais pelo câmbio de cada data. Por isso a variação do dólar entra no ganho.",
    ],
    exemplo:
      "Hipotético: um apartamento em Miami comprado por US$ 300 mil, com o dólar a R$ 4, custou R$ 1,2 milhão. Vendido por US$ 300 mil com o dólar a R$ 5,50, rende R$ 1,65 milhão. Em dólar, o ganho foi zero; em reais, R$ 450 mil, sobre os quais incide o imposto, observadas as regras e reduções previstas na lei.",
    naPratica:
      "Guardar comprovantes de cada compra, com data, valor em dólar e câmbio usado, é o que permite calcular o ganho certo anos depois. Sem eles, o custo pode ser difícil de provar.",
    relacionados: ["lei-14754", "imposto-de-renda", "variacao-cambial-no-imposto", "compensacao-de-perdas", "bdr"],
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
      "Imagine que, no mesmo ano, você ganhou R$ 20 mil numa ação americana e perdeu R$ 8 mil em outra. Pagar imposto sobre os R$ 20 mil, sem olhar a perda, seria tributar um ganho que você não teve. A compensação resolve isso: o imposto incide sobre os R$ 12 mil líquidos.",
      "Pela Lei 14.754, as perdas realizadas em aplicações financeiras no exterior, desde que comprovadas, são compensadas com os ganhos do mesmo ano. Se sobrar perda, ela pode abater lucros de empresas controladas no exterior e, se ainda sobrar, ser usada em anos seguintes, na mesma ficha da declaração. Cada perda só pode ser usada uma vez.",
      "Perdas em ações no Brasil seguem outra regra e não se misturam com as do exterior. Por isso a organização dos documentos de cada lado faz diferença.",
    ],
    exemplo:
      "Hipotético: em 2026 você tem R$ 15 mil de perdas e R$ 5 mil de ganhos no exterior. Não paga imposto naquele ano e carrega R$ 10 mil de perdas para abater ganhos de 2027.",
    naPratica:
      "A perda só conta quando é realizada, ou seja, quando você vende. E precisa de comprovante: extratos e notas da corretora são o que vale perante a Receita.",
    relacionados: ["lei-14754", "ganho-de-capital", "imposto-de-renda", "variacao-cambial-no-imposto"],
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
      "A Receita mede tudo em reais. O custo de um investimento no exterior é convertido pelo dólar do dia da compra, e o valor da venda, pelo dólar do dia da venda. A diferença é o ganho, e a variação do câmbio está dentro dela.",
      "O efeito vale para os dois lados. Se o dólar sobe, aparece um ganho em reais mesmo que o ativo não tenha se valorizado em dólar. Se o dólar cai, aparece uma perda em reais que pode compensar outros ganhos.",
      "Há exceções na Lei 14.754: a variação cambial de depósitos sem juros em conta no exterior não é tributada, e a venda de até US$ 5 mil por ano em dólar em espécie também não.",
    ],
    exemplo:
      "Você compra US$ 10 mil em ações com o dólar a R$ 5,00 e, um ano depois, vende pelos mesmos US$ 10 mil. Se o dólar foi a R$ 5,50, recebe R$ 55 mil, tem R$ 5 mil de ganho e paga R$ 750 de imposto. Se o dólar caiu para R$ 4,50, tem R$ 5 mil de perda e não paga nada.",
    naPratica:
      "Quem compara o retorno em dólar de um ativo com o CDI precisa lembrar desse detalhe: parte do ganho em reais, a que vem do câmbio, também é tributada. A conta justa é sempre depois do imposto e em reais.",
    relacionados: ["lei-14754", "ganho-de-capital", "compensacao-de-perdas", "risco-cambial", "imposto-de-renda"],
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
      "Além da Receita Federal, o Banco Central também quer saber quanto os residentes têm fora do país, para montar as estatísticas externas do Brasil. Para isso existe a CBE.",
      "Pela Resolução BCB 279, de 2022, que regulamenta o marco cambial, a declaração anual é obrigatória para quem tinha o equivalente a US$ 1 milhão ou mais no exterior em 31 de dezembro. Quem passa de US$ 100 milhões declara também a cada trimestre. Entram depósitos, ações, fundos, imóveis, participações em empresas e outros bens.",
      "O prazo costuma ir de meados de fevereiro ao começo de abril. Para a data-base de 31 de dezembro de 2025, foi de 15 de fevereiro a 5 de abril de 2026. Atraso e omissão podem gerar multa.",
    ],
    exemplo:
      "Hipotético: em 31 de dezembro, você tem US$ 700 mil numa corretora americana e um imóvel de US$ 400 mil em Portugal. A soma passa de US$ 1 milhão, e a CBE é obrigatória, além da declaração de imposto de renda.",
    naPratica:
      "Investir lá fora é legal e cada vez mais simples, mas vem com deveres de transparência. Manter um controle anual do patrimônio no exterior, em dólar e em reais, facilita as duas declarações.",
    relacionados: ["imposto-de-renda", "marco-cambial", "conta-em-moeda-estrangeira", "troca-automatica-de-informacoes", "banco-central"],
  },
  {
    slug: "offshore",
    termo: "Offshore",
    categoria: "Acesso, contas e impostos",
    apelidos: ["offshores", "empresa no exterior", "empresas no exterior", "controlada no exterior", "controladas no exterior", "PIC", "holding no exterior"],
    resumo:
      "Empresa constituída fora do país de residência do dono, muitas vezes usada para guardar investimentos. Desde 2024, a Lei 14.754 tributa no Brasil, todo ano, o lucro das offshores de investimento controladas por pessoas físicas.",
    texto: [
      "Durante décadas, uma estratégia comum de quem tinha patrimônio alto era abrir uma empresa num país de imposto baixo e investir por meio dela. Enquanto o lucro ficasse dentro da empresa, o imposto brasileiro era adiado.",
      "A Lei 14.754 mudou isso. Se a empresa no exterior é controlada por você e está num país de tributação favorecida, ou se vive basicamente de renda passiva, como juros e dividendos (menos de 60% de renda ativa), o lucro dela é tributado em 15% no Brasil todo 31 de dezembro, como se tivesse sido distribuído. As demais controladas são tributadas quando o lucro chega à pessoa física.",
      "Offshores continuam legais e podem fazer sentido para sucessão, organização ou proteção patrimonial. O que acabou foi a vantagem automática de adiar o imposto.",
    ],
    exemplo:
      "Hipotético: sua offshore nas Ilhas Virgens Britânicas teve lucro equivalente a R$ 200 mil num ano, só com juros e dividendos. Mesmo sem distribuir nada, você declara e paga R$ 30 mil na declaração do ano seguinte.",
    naPratica:
      "Uma estrutura no exterior tem custos fixos de abertura, manutenção e contabilidade. Avalie pelo resultado depois de todos os custos e impostos, com ajuda profissional, e não pela promessa de pagar menos imposto.",
    relacionados: ["lei-14754", "trust", "estate-tax", "jurisdicao", "imposto-de-renda"],
  },
  {
    slug: "trust",
    termo: "Trust",
    categoria: "Acesso, contas e impostos",
    apelidos: ["trusts", "instituidor", "trustee", "settlor"],
    resumo:
      "Estrutura comum em países de direito anglo-saxão em que alguém entrega bens a um administrador, o trustee, para que sejam geridos em favor de beneficiários. Desde 2024, a lei brasileira trata o trust como transparente para o imposto.",
    texto: [
      "Imagine que você quer deixar recursos para os filhos, mas com regras: uma parte aos 25 anos, outra aos 35, e alguém de confiança cuidando do dinheiro até lá. Nos Estados Unidos e no Reino Unido, isso se faz com um trust. Quem entrega os bens é o instituidor; quem administra é o trustee; quem recebe são os beneficiários.",
      "O Brasil não tem trust no seu direito, mas residentes podem instituir ou ser beneficiários de trusts no exterior. A Lei 14.754 definiu como tratar isso: os bens continuam sendo do instituidor para fins de imposto e passam ao beneficiário quando houver distribuição ou com a morte do instituidor, o que vier primeiro.",
      "Essa passagem é tratada como doação ou herança, o que leva à discussão do imposto estadual sobre transmissão. Trusts são usados sobretudo em planejamento sucessório, e as regras mudam conforme o país.",
    ],
    exemplo:
      "Hipotético: você institui um trust com US$ 2 milhões em investimentos. Enquanto estiver vivo e nada for distribuído, os rendimentos continuam sendo seus para a Receita e entram na sua declaração.",
    naPratica:
      "Trust é ferramenta de planejamento patrimonial e sucessório, não de investimento. Faz sentido discutir com advogado e contador quando o patrimônio no exterior ganha tamanho, inclusive por causa do estate tax americano.",
    relacionados: ["lei-14754", "offshore", "estate-tax", "jurisdicao"],
  },
  {
    slug: "estate-tax",
    termo: "Estate tax",
    categoria: "Acesso, contas e impostos",
    apelidos: ["imposto sobre herança americano", "imposto de herança americano", "imposto sobre heranças nos EUA", "Form 706-NA"],
    resumo:
      "O imposto americano sobre heranças. Para quem não é cidadão nem residente dos Estados Unidos, incide sobre ativos situados lá, como ações e imóveis americanos, acima de US$ 60 mil, com alíquotas que chegam a 40%.",
    texto: [
      "Quando um americano morre, o patrimônio paga imposto acima de uma isenção alta, de milhões de dólares. Para estrangeiros não residentes, a régua é bem diferente: os herdeiros precisam declarar ao IRS se os ativos americanos do falecido passarem de US$ 60 mil, e o imposto pode chegar a 40% sobre o que exceder a isenção.",
      "Entram na conta os ativos considerados situados nos Estados Unidos: imóveis lá, ações de empresas americanas (inclusive se custodiadas fora) e, em geral, cotas de fundos e ETFs domiciliados nos Estados Unidos. Ficam fora, pela regra do IRS, certos depósitos bancários e alguns títulos de dívida. Países com tratado de herança com os Estados Unidos têm regras melhores; o Brasil não tem esse tratado.",
      "O tema costuma ser ignorado por quem começa a investir lá fora, até ficar relevante. A forma de deter os ativos, o país de domicílio dos fundos e o uso de estruturas mudam o resultado.",
    ],
    exemplo:
      "Hipotético: um investidor brasileiro morre com US$ 500 mil em ações americanas numa corretora nos Estados Unidos. Os herdeiros precisam declarar ao IRS e podem ter uma conta de imposto de mais de US$ 100 mil, além do imposto sobre herança no Brasil, antes de receber os ativos.",
    naPratica:
      "Não é motivo para deixar de investir lá fora, mas é motivo para planejar. Quando o valor em ativos americanos começa a crescer, vale estudar a estrutura com um profissional, olhando ao mesmo tempo imposto de renda e sucessão.",
    relacionados: ["corretora-internacional", "trust", "offshore", "custodia", "jurisdicao"],
  },
  {
    slug: "w-8ben",
    termo: "W-8BEN",
    categoria: "Acesso, contas e impostos",
    apelidos: ["formulário W-8BEN", "W8BEN", "W-8"],
    resumo:
      "Formulário do fisco americano em que o investidor declara à corretora que não é residente fiscal dos Estados Unidos. Define como os seus rendimentos serão tributados lá.",
    texto: [
      "Ao abrir conta numa corretora americana, você vai preencher o W-8BEN. Nele, informa nome, endereço no Brasil e o seu número de contribuinte brasileiro, e declara que não é cidadão nem residente fiscal americano.",
      "Com o formulário em dia, a corretora aplica as regras de não residente: retém imposto sobre dividendos de empresas americanas e, em geral, não tributa o ganho na venda de ações, que fica para o Brasil. Sem ele, a corretora pode tratar você como contribuinte americano e aplicar retenções que não se aplicariam.",
      "O W-8BEN vale, em regra, até o fim do terceiro ano depois da assinatura. A corretora costuma avisar quando é hora de renovar, e mudanças de endereço ou de residência exigem atualização.",
    ],
    exemplo:
      "Hipotético: assinado em março de 2026, o formulário vale até 31 de dezembro de 2029.",
    naPratica:
      "É um detalhe burocrático que evita imposto indevido. Confira se foi aceito e se a data de validade está no radar. Se um dia você se mudar para os Estados Unidos, a situação muda por completo.",
    relacionados: ["corretora-internacional", "imposto-retido-nos-eua", "dupla-tributacao", "residencia-fiscal"],
  },
  {
    slug: "imposto-retido-nos-eua",
    termo: "Imposto retido nos EUA",
    categoria: "Acesso, contas e impostos",
    apelidos: [
      "imposto retido nos Estados Unidos",
      "imposto retido na fonte nos EUA",
      "retenção na fonte",
      "withholding tax",
      "dividendos americanos",
      "imposto sobre dividendos americanos",
    ],
    resumo:
      "Os 30% que o governo americano retém dos dividendos pagos a investidores residentes no Brasil. Como não há tratado entre os dois países para o imposto de renda, a alíquota é a cheia.",
    texto: [
      "Quando uma empresa americana paga dividendos a um investidor estrangeiro, a corretora retém imposto antes de creditar o valor. A alíquota padrão é de 30% e só cai para quem é residente de países com tratado com os Estados Unidos. O Brasil não tem tratado de imposto de renda com os Estados Unidos.",
      "Do lado brasileiro, a Lei 14.754 permite abater o imposto pago lá fora quando há tratado ou reciprocidade, e a Receita reconhece reciprocidade com os Estados Unidos. O abatimento, porém, é limitado ao imposto brasileiro sobre aquele rendimento, e o que passar disso não volta.",
      "Juros de títulos do Tesouro americano e de depósitos bancários costumam ficar livres dessa retenção para não residentes, e o ganho na venda de ações, em geral, não é tributado lá.",
    ],
    exemplo:
      "Hipotético: você recebe US$ 1.000 de dividendos de uma empresa americana. A corretora retém US$ 300 e credita US$ 700. No Brasil, o imposto seria de 15%, US$ 150, que você abate integralmente com o que já pagou lá. Não paga mais nada aqui, mas também não recupera os outros US$ 150.",
    naPratica:
      "Para quem busca renda com dividendos americanos, o rendimento efetivo é perto de 70% do anunciado. É uma das razões pelas quais o veículo e o tipo de ativo mudam bastante o resultado líquido. O tema é aprofundado no Módulo III.",
    relacionados: ["dupla-tributacao", "w-8ben", "lei-14754", "imposto-de-renda", "treasury"],
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
      "Você mora no Brasil e recebe um rendimento gerado na França. A França quer tributar porque a renda nasceu lá; o Brasil, porque você mora aqui. Sem regra nenhuma, pagaria duas vezes.",
      "Para evitar isso, países assinam tratados que dividem o direito de tributar e permitem que um imposto seja abatido do outro. O Brasil tem tratados com dezenas de países, mas não com os Estados Unidos. Nesse caso, vale a reciprocidade: a Receita aceita o abatimento porque os Estados Unidos dão tratamento equivalente.",
      "O abatimento tem limite: no máximo, o imposto que o Brasil cobraria sobre aquele rendimento. Se o imposto de fora foi maior, a diferença não volta.",
    ],
    exemplo:
      "Hipotético: um rendimento de R$ 10 mil foi tributado em R$ 1 mil no país de origem. No Brasil, a alíquota é de 15%, ou R$ 1,5 mil. Você abate os R$ 1 mil e paga só R$ 500 aqui.",
    naPratica:
      "O país de origem do rendimento e a existência de tratado mudam o retorno líquido. Quando se comparam caminhos para investir lá fora, a conta precisa considerar os impostos dos dois lados.",
    relacionados: ["imposto-retido-nos-eua", "lei-14754", "residencia-fiscal", "imposto-de-renda", "w-8ben"],
  },
  {
    slug: "custodia",
    termo: "Custódia",
    categoria: "Acesso, contas e impostos",
    apelidos: ["custodiante", "custodiantes", "custodiado", "custodiados", "segregação patrimonial"],
    resumo:
      "A guarda dos seus investimentos por uma instituição autorizada. Saber quem custodia, em que país e com que proteção é tão importante quanto saber o que você comprou.",
    texto: [
      "Quando você compra uma ação, ela não fica na gaveta. Fica registrada em nome de alguém numa instituição de custódia. No Brasil, as ações ficam na central depositária da B3, em seu CPF. Nos Estados Unidos, a corretora guarda os ativos por meio de uma instituição de liquidação e custódia.",
      "O ponto central é a segregação: os ativos dos clientes devem ficar separados do patrimônio da corretora. Se ela quebrar, os ativos são seus e não entram na massa falida. Quando há falha, existem fundos de proteção, como a SIPC nos Estados Unidos.",
      "Com criptoativos, a pergunta é ainda mais direta. Numa exchange, quem tem as chaves é a exchange. Na autocustódia, é você, com todo o benefício e todo o risco.",
    ],
    exemplo:
      "A quebra da FTX, em novembro de 2022, mostrou o que acontece quando a custódia falha: clientes descobriram que os criptoativos que achavam ter não estavam separados e ficaram anos esperando a recuperação judicial.",
    naPratica:
      "Diversificar jurisdição só funciona se a custódia estiver de fato na jurisdição escolhida. Um BDR tem ativo lá fora, mas custódia e regras aqui; uma conta numa corretora americana tem custódia lá. Pergunte sempre onde e em nome de quem o ativo está.",
    relacionados: ["sipc", "fgc", "autocustodia", "corretora-internacional", "jurisdicao", "exchange"],
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
      "Se uma corretora americana associada quebra e faltam ativos dos clientes, por fraude ou erro, a SIPC entra para devolver o que estava na conta, até o limite. A cobertura é de até US$ 500 mil por cliente, por categoria de conta, com sublimite de US$ 250 mil para dinheiro parado.",
      "A SIPC não é seguro contra perda de investimento. Se a ação que você comprou cai 50%, isso é risco de mercado, e ninguém devolve. Ela protege contra o sumiço do ativo, não contra a desvalorização dele.",
      "Na maioria das quebras, os ativos dos clientes estão segregados e são simplesmente transferidos para outra corretora. A SIPC cobre o que faltar.",
    ],
    exemplo:
      "Hipotético: você tem US$ 300 mil em ações e US$ 50 mil em dinheiro numa corretora que quebra, e parte dos ativos não aparece. A SIPC devolve o que faltar até US$ 500 mil no total. Se a sua carteira fosse de US$ 800 mil, a parte acima do limite dependeria do processo de liquidação.",
    naPratica:
      "Ao escolher uma corretora americana, confira se ela é membro da SIPC. Alguns grandes nomes oferecem proteção adicional contratada com seguradoras privadas, que vale ler com atenção.",
    relacionados: ["custodia", "fgc", "corretora-internacional", "conta-global"],
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
      "Criado em 1995, logo depois da onda de quebras bancárias do pós-real, o FGC é mantido pelos próprios bancos. Se uma instituição associada quebra, ele devolve aos clientes os valores garantidos, até o limite.",
      "A cobertura é de até R$ 250 mil por CPF por conglomerado financeiro, com teto de R$ 1 milhão por pessoa a cada período de quatro anos. Entram conta corrente, poupança, CDB, LCI, LCA e letras de câmbio, entre outros. Não entram títulos do Tesouro, ações, fundos de investimento nem debêntures.",
      "O FGC protege contra a quebra de um banco, não contra uma crise do país. E vale só para instituições brasileiras: uma conta no exterior tem a proteção do país em que está.",
    ],
    exemplo:
      "Hipotético: você tem R$ 400 mil em CDBs de um único banco que quebra. O FGC devolve R$ 250 mil. Os outros R$ 150 mil entram no processo de liquidação, sem prazo nem valor garantidos.",
    naPratica:
      "O FGC é uma boa proteção contra um risco específico e não deve ser confundido com proteção do patrimônio. Ele não protege contra inflação, câmbio, mudança de regra ou crise fiscal, que são os riscos que a diversificação internacional tenta diluir.",
    relacionados: ["proer", "custodia", "sipc", "cdi", "diversificacao"],
  },
  {
    slug: "residencia-fiscal",
    termo: "Residência fiscal",
    categoria: "Acesso, contas e impostos",
    apelidos: ["residente fiscal", "residentes fiscais", "não residente", "saída definitiva", "declaração de saída definitiva", "comunicação de saída definitiva"],
    resumo:
      "O país que tem o direito de tributar a sua renda mundial. Quem mora no Brasil é residente fiscal aqui, mesmo com todo o dinheiro lá fora. Para deixar de ser, é preciso sair do país e cumprir os passos formais.",
    texto: [
      "Imposto de renda não segue o passaporte nem o endereço do banco: segue a residência fiscal. Quem é residente no Brasil declara e paga imposto sobre o que ganha no mundo inteiro.",
      "Quem se muda de vez para outro país precisa comunicar a saída à Receita e entregar a declaração de saída definitiva. Sem isso, continua sendo tratado como residente e obrigado a declarar aqui. Quem sai temporariamente passa a ser não residente depois de um período fora previsto nas regras da Receita.",
      "Ao mudar de residência, você pode passar a ser tributado pelo novo país, inclusive sobre investimentos que já tinha. Antes de uma mudança, vale planejar com profissionais dos dois lados.",
    ],
    exemplo:
      "Hipotético: uma brasileira se muda para Portugal para trabalhar e não faz a saída definitiva. Para a Receita, ela continua residente e deve declarar aqui a renda que ganha lá, além de lidar com o fisco português.",
    naPratica:
      "Ter dinheiro lá fora não muda onde você paga imposto. É a residência que manda, e por isso investir no exterior morando no Brasil exige declarar tudo aqui.",
    relacionados: ["imposto-de-renda", "dupla-tributacao", "w-8ben", "lei-14754"],
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
      "Há pouco mais de uma década, uma conta no exterior podia passar despercebida pelo fisco do país de residência. Isso acabou. Pelo padrão criado na OCDE, o CRS, instituições financeiras de mais de cem jurisdições identificam clientes estrangeiros e mandam os dados ao fisco local, que repassa ao país de residência do cliente.",
      "O Brasil participa do CRS e faz as primeiras trocas desde 2018. Com os Estados Unidos, que não aderiram ao CRS, a troca se dá por outro acordo, o FATCA, assinado pelos dois países em 2014.",
      "Na prática, a Receita sabe que a conta existe, quanto havia nela e quanto rendeu, e cruza com a declaração.",
    ],
    exemplo:
      "Hipotético: você abre conta num banco em Portugal e esquece de declarar. No ano seguinte, os dados da conta chegam à Receita pelo CRS, e a omissão aparece no cruzamento.",
    naPratica:
      "Investir lá fora é legal e não exige esconder nada. Declarar tudo corretamente é o que permite aproveitar a diversificação sem dor de cabeça.",
    relacionados: ["imposto-de-renda", "declaracao-de-capitais-no-exterior", "residencia-fiscal", "lei-14754"],
  },
  {
    slug: "jurisdicao",
    termo: "Jurisdição",
    categoria: "Acesso, contas e impostos",
    apelidos: ["jurisdições", "outra jurisdição", "risco de jurisdição", "risco jurisdicional"],
    resumo:
      "O território cujas leis, tribunais e governo valem para um ativo ou contrato. Diversificar jurisdição é ter parte do patrimônio sob regras que não mudam com a mesma caneta.",
    texto: [
      "Todo investimento está sujeito a algum conjunto de regras. Uma ação da B3, um CDB, um imóvel em Curitiba e o dinheiro na poupança estão todos sob a jurisdição brasileira: leis, tribunais, Banco Central, Receita e Congresso daqui.",
      "Por isso, trocar um ativo brasileiro por outro diversifica a empresa ou o emissor, mas não a regra do jogo. Um bloqueio de aplicações, um imposto novo ou uma intervenção atinge tudo o que está sob a mesma jurisdição de uma vez.",
      "Ter um ativo custodiado em outro país, sob outra lei, dilui esse risco. Não elimina: você continua residente fiscal no Brasil e sujeito às regras daqui para declarar e pagar imposto, e o outro país também tem riscos.",
    ],
    exemplo:
      "No Plano Collor, em 1990, o bloqueio valeu para conta corrente, poupança e aplicações no sistema brasileiro. Quem tinha recursos declarados em outra jurisdição não foi atingido por aquele bloqueio.",
    naPratica:
      "Na aula, a tabela do risco mostra que só ativos fora do país diluem o risco de regra. É um argumento de concentração, não de pessimismo: o objetivo é não deixar uma única caneta decidir sobre todo o seu patrimônio.",
    relacionados: ["risco-de-expropriacao", "instituicoes", "custodia", "bdr", "diversificacao", "plano-collor"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "22:12" },
      { modulo: 0, aula: 2 },
    ],
  },

  // =============================================================================================
  // CRIPTO E TECNOLOGIA
  // =============================================================================================
  {
    slug: "bitcoin",
    termo: "Bitcoin",
    sigla: "BTC",
    categoria: "Cripto e tecnologia",
    apelidos: ["bitcoins", "Satoshi Nakamoto", "whitepaper do bitcoin"],
    resumo:
      "O primeiro criptoativo: um dinheiro digital que funciona sem banco central nem intermediário, com emissão limitada a 21 milhões de unidades por regra. Criado em 2008 e em funcionamento desde janeiro de 2009.",
    texto: [
      "Em 31 de outubro de 2008, semanas depois da quebra do Lehman Brothers, alguém sob o pseudônimo de Satoshi Nakamoto publicou um texto de nove páginas descrevendo um dinheiro eletrônico que podia ir de uma pessoa para outra sem passar por um banco. Em 3 de janeiro de 2009, a rede começou a funcionar.",
      "O problema que o bitcoin resolveu era antigo: como impedir que um dinheiro digital, que é só informação, seja gasto duas vezes, sem uma autoridade central para conferir? A resposta junta criptografia, um registro público compartilhado, a blockchain, e um incentivo econômico para quem mantém a rede, a mineração.",
      "A política monetária é fixa e conhecida por todos: novos bitcoins entram em circulação a um ritmo que cai pela metade a cada quatro anos, mais ou menos, até um total de 21 milhões. Mais de 90% já foram emitidos. É por isso que ele costuma ser comparado ao ouro.",
    ],
    exemplo:
      "A escassez programada não impede oscilações enormes. O bitcoin já caiu mais de 70% do pico ao fundo mais de uma vez, e também já multiplicou de valor em poucos anos.",
    naPratica:
      "O bitcoin é uma forma de ter um ativo global, negociado 24 horas, fora do sistema de qualquer banco central. É também um dos ativos mais voláteis que existem. O curso trata dos ativos digitais no Módulo IV, com o cuidado de separar a tecnologia da especulação.",
    relacionados: ["blockchain", "halving", "mineracao", "prova-de-trabalho", "etf-de-bitcoin", "padrao-ouro"],
  },
  {
    slug: "blockchain",
    termo: "Blockchain",
    categoria: "Cripto e tecnologia",
    apelidos: ["blockchains", "cadeia de blocos", "registro distribuído", "tecnologia de registro distribuído", "DLT", "descentralização", "descentralizado"],
    resumo:
      "Um registro de transações copiado em milhares de computadores, organizado em blocos encadeados de forma que mudar o passado exigiria refazer tudo o que veio depois. Dispensa um dono central do livro.",
    texto: [
      "Pense num livro-caixa que, em vez de ficar na gaveta de um banco, tem uma cópia idêntica em milhares de computadores pelo mundo. Cada página nova, um bloco, traz uma impressão digital da página anterior. Se alguém tentar alterar uma transação antiga, a impressão digital não bate mais, e todo mundo percebe.",
      "Esse encadeamento, somado a regras que definem quem pode escrever a próxima página, permite que desconhecidos concordem sobre quem tem o quê sem confiar num intermediário. É a base do bitcoin e de outras redes.",
      "A tecnologia tem custos: as redes públicas são mais lentas e caras que um banco de dados comum. Faz sentido quando o valor está justamente em não depender de uma parte central, como em dinheiro digital, registro de ativos e contratos que se executam sozinhos.",
    ],
    exemplo:
      "A ideia de carimbar documentos no tempo e encadeá-los por impressões digitais foi publicada por Stuart Haber e Scott Stornetta em 1991 e aparece citada no texto original do bitcoin.",
    naPratica:
      "Blockchain é a infraestrutura; o investimento é outra coisa. Uma empresa dizer que usa blockchain não diz nada sobre se ela é um bom negócio. Separar a tecnologia do ativo é o primeiro passo para olhar esse mercado com calma.",
    relacionados: ["bitcoin", "hash", "mineracao", "contrato-inteligente", "tokenizacao", "ethereum"],
  },
  {
    slug: "halving",
    termo: "Halving",
    categoria: "Cripto e tecnologia",
    apelidos: ["halvings", "corte pela metade", "redução da recompensa"],
    resumo:
      "O corte pela metade da quantidade de novos bitcoins criados a cada bloco, que acontece a cada 210 mil blocos, mais ou menos a cada quatro anos. O último foi em abril de 2024, quando a recompensa caiu para 3,125 bitcoins.",
    texto: [
      "No começo, quem minerava um bloco de bitcoin recebia 50 bitcoins novos. A regra do protocolo diz que essa recompensa cai pela metade a cada 210 mil blocos, o que dá perto de quatro anos.",
      "Foi para 25 em 2012, 12,5 em 2016, 6,25 em 2020 e 3,125 em abril de 2024. O próximo corte é esperado para 2028. Como a recompensa vai encolhendo, o total de bitcoins se aproxima de 21 milhões e nunca passa disso.",
      "O halving é previsível e conhecido por todos com anos de antecedência. Mesmo assim, é um dos eventos mais comentados do mercado, porque reduz a oferta nova de um ativo que tem demanda variável.",
    ],
    exemplo:
      "Com um bloco a cada dez minutos, perto de 144 blocos por dia, a emissão diária de bitcoins caiu de cerca de 900 para cerca de 450 em abril de 2024.",
    naPratica:
      "Um evento conhecido por todos com anos de antecedência tende a já estar, ao menos em parte, no preço. Halving não é calendário de ganho garantido: os ciclos passados não obrigam os futuros a se repetir.",
    relacionados: ["bitcoin", "mineracao", "prova-de-trabalho", "padrao-ouro"],
  },
  {
    slug: "mineracao",
    termo: "Mineração",
    categoria: "Cripto e tecnologia",
    apelidos: ["mineradores", "minerador", "minerar", "minerado", "mineração de bitcoin"],
    resumo:
      "O trabalho de computadores que competem para registrar o próximo bloco do bitcoin, gastando energia para resolver um problema matemático. Quem vence recebe bitcoins novos e as taxas das transações.",
    texto: [
      "Para escrever a próxima página da blockchain do bitcoin, os mineradores fazem uma espécie de loteria computacional: tentam bilhões de números por segundo até achar um que produza uma impressão digital com o formato exigido. Quem acha primeiro registra o bloco e leva a recompensa.",
      "O esforço é caro, em máquinas especializadas e eletricidade, e é justamente isso que protege a rede. Para reescrever o passado, um atacante precisaria de mais poder de computação do que todo o resto da rede somado.",
      "A dificuldade se ajusta sozinha a cada 2.016 blocos, cerca de duas semanas, para que os blocos continuem saindo a cada dez minutos em média, não importa quantos mineradores entrem ou saiam.",
    ],
    exemplo:
      "Mineradores buscam energia barata no mundo inteiro, de hidrelétricas a gás que seria queimado sem uso em campos de petróleo. Depois de cada halving, os menos eficientes saem do negócio.",
    naPratica:
      "A mineração liga o bitcoin ao mundo físico: energia, chips e infraestrutura. Também é um dos pontos de debate do ativo, pelo consumo de eletricidade, e por isso outras redes adotaram mecanismos diferentes, como a prova de participação.",
    relacionados: ["prova-de-trabalho", "bitcoin", "halving", "hash", "prova-de-participacao"],
  },
  {
    slug: "prova-de-trabalho",
    termo: "Prova de trabalho",
    categoria: "Cripto e tecnologia",
    apelidos: ["proof of work", "proof-of-work", "Hashcash"],
    resumo:
      "O mecanismo do bitcoin para decidir quem registra o próximo bloco: quem gastar esforço computacional e provar isso com a resposta certa. É caro de fazer e barato de conferir.",
    texto: [
      "A ideia veio antes do bitcoin. Em 1997, Adam Back propôs o Hashcash, um sistema contra spam que obrigava cada e-mail a carregar uma pequena prova de esforço computacional. Para quem manda um e-mail, o custo é irrelevante; para quem manda milhões, fica caro.",
      "O bitcoin usou o mesmo princípio para resolver o consenso. Quem quer registrar um bloco precisa encontrar uma resposta que só se acha por tentativa e erro, gastando computação e energia. Conferir a resposta, por outro lado, leva um instante.",
      "O resultado é uma rede em que mentir custa caro: alterar o histórico exigiria refazer todo o trabalho já gasto e superar o resto da rede.",
    ],
    exemplo:
      "Hipotético: é como um cadeado de combinação com bilhões de possibilidades. Abrir exige testar uma por uma; ver que está aberto leva um segundo.",
    naPratica:
      "A prova de trabalho dá ao bitcoin uma segurança ligada a custos físicos reais. A contrapartida é o consumo de energia, que entra no debate regulatório e ambiental sobre o ativo.",
    relacionados: ["mineracao", "bitcoin", "hash", "prova-de-participacao"],
  },
  {
    slug: "prova-de-participacao",
    termo: "Prova de participação",
    categoria: "Cripto e tecnologia",
    apelidos: ["proof of stake", "proof-of-stake", "validadores", "validador", "The Merge"],
    resumo:
      "Mecanismo de consenso em que quem valida as transações são participantes que deixam criptoativos bloqueados como garantia. Gasta muito menos energia que a mineração. O Ethereum adotou em setembro de 2022.",
    texto: [
      "Na prova de participação, em vez de gastar energia, os validadores põem dinheiro em jogo. Eles bloqueiam uma quantidade do criptoativo da rede e, em troca, ganham o direito de propor e conferir blocos, recebendo recompensas.",
      "Se um validador tenta trapacear, perde parte do que bloqueou. A segurança vem do custo econômico de agir mal, e não do custo de computação.",
      "O Ethereum trocou a mineração pela prova de participação em 15 de setembro de 2022, num processo chamado The Merge, e reduziu o consumo de energia da rede em mais de 99%.",
    ],
    exemplo:
      "Hipotético: um validador deixa 32 ethers bloqueados para participar da rede. Se segue as regras, recebe recompensas. Se valida transações conflitantes, parte dos 32 é cortada.",
    naPratica:
      "Redes de prova de participação permitem o staking, que gera rendimento em criptoativos. Esse rendimento traz riscos próprios, como bloqueio do ativo, falhas técnicas e regras de cada plataforma, e não se compara a um juro de renda fixa.",
    relacionados: ["staking", "ethereum", "prova-de-trabalho", "mineracao"],
  },
  {
    slug: "staking",
    termo: "Staking",
    categoria: "Cripto e tecnologia",
    apelidos: ["fazer staking", "rendimento de staking", "recompensas de staking"],
    resumo:
      "Bloquear criptoativos para ajudar a validar uma rede de prova de participação e receber recompensas por isso. É a forma de rendimento mais comum em redes como o Ethereum.",
    texto: [
      "Nas redes de prova de participação, quem bloqueia criptoativos para validar transações ganha recompensas pagas no próprio ativo. Fazer staking é participar disso, diretamente ou por meio de uma plataforma que junta os recursos de vários usuários.",
      "O rendimento varia com a rede e com o número de participantes. Ele vem em criptoativo, e não em reais ou dólares: se o preço do ativo cair, a recompensa não compensa a perda.",
      "Há riscos que um CDB não tem: prazo para desbloquear, punições por falha do validador, risco da plataforma intermediária e tratamento tributário e regulatório que ainda está se formando em vários países.",
    ],
    exemplo:
      "Hipotético: você deixa 10 ethers em staking e recebe 3% ao ano em ether. Se o ether cai 30% no ano, você termina com mais ethers e menos dinheiro.",
    naPratica:
      "Staking não é renda fixa. É uma remuneração em ativo volátil, com riscos técnicos e de custódia. Entender quem guarda as chaves durante o staking é tão importante quanto a taxa anunciada.",
    relacionados: ["prova-de-participacao", "ethereum", "autocustodia", "exchange", "defi"],
  },
  {
    slug: "carteira-cripto",
    termo: "Carteira de criptoativos",
    categoria: "Cripto e tecnologia",
    apelidos: ["carteira digital", "carteiras digitais", "wallet", "wallets", "carteira fria", "carteira quente", "cold wallet", "hot wallet", "frase de recuperação"],
    resumo:
      "O aplicativo ou dispositivo que guarda as chaves que dão acesso aos seus criptoativos. As moedas ficam na blockchain; a carteira guarda a senha que permite movê-las.",
    texto: [
      "Um detalhe confunde muita gente: os bitcoins não ficam dentro da carteira. Eles estão registrados na blockchain. O que a carteira guarda são as chaves que provam que você pode movimentá-los.",
      "Há dois tipos principais. A carteira quente é um aplicativo conectado à internet, prática para o dia a dia e mais exposta a ataques. A carteira fria é um dispositivo físico, desconectado, mais segura para guardar valores maiores por muito tempo.",
      "Ao criar uma carteira, você recebe uma frase de recuperação, normalmente de 12 ou 24 palavras. Quem tem essa frase tem os ativos. Se você perder a frase e o aparelho, ninguém consegue recuperar o acesso.",
    ],
    exemplo:
      "Hipotético: seu celular com a carteira é roubado. Se você guardou a frase de recuperação em papel, num lugar seguro, instala a carteira num aparelho novo e recupera tudo. Se não guardou, o acesso está perdido.",
    naPratica:
      "Ter cripto numa carteira própria é a forma mais direta de estar fora de qualquer intermediário e de qualquer jurisdição. Também é a forma em que todo erro é seu. Muitos investidores preferem a exposição por ETF ou por uma exchange regulada justamente por isso.",
    relacionados: ["chave-privada", "autocustodia", "exchange", "bitcoin", "custodia"],
  },
  {
    slug: "chave-privada",
    termo: "Chave privada",
    categoria: "Cripto e tecnologia",
    apelidos: ["chaves privadas", "chave pública", "chaves públicas", "assinatura digital"],
    resumo:
      "O número secreto que prova que você é dono de um endereço numa blockchain e permite assinar transações. Quem tem a chave privada controla os ativos.",
    texto: [
      "Pense numa caixa de correio com uma fenda. Qualquer pessoa que sabe o endereço pode depositar uma carta: esse é o papel da chave pública e do endereço que deriva dela. Só quem tem a chave da portinhola consegue tirar o que está dentro: essa é a chave privada.",
      "Na prática, a chave privada é um número enorme, gerado aleatoriamente. Com ela, você assina transações; a rede confere a assinatura usando a chave pública, sem nunca ver a privada.",
      "Daí vem o ditado do mercado: se não são as suas chaves, não são as suas moedas. Quem deixa os ativos numa exchange confia que ela guarda as chaves e honra os saques.",
    ],
    exemplo:
      "Hipotético: alguém descobre a sua chave privada. Pode transferir todos os seus criptoativos para outro endereço, e não há banco para estornar.",
    naPratica:
      "Não existe recuperação de senha em cripto. A segurança da chave privada é toda a segurança do ativo, e é por isso que autocustódia exige método: cópia em papel, local seguro e cuidado com golpes que pedem a frase de recuperação.",
    relacionados: ["criptografia-de-chave-publica", "carteira-cripto", "autocustodia", "bitcoin"],
  },
  {
    slug: "criptografia-de-chave-publica",
    termo: "Criptografia de chave pública",
    categoria: "Cripto e tecnologia",
    apelidos: ["criptografia", "criptografia assimétrica", "RSA", "Diffie-Hellman"],
    resumo:
      "O sistema de pares de chaves, uma pública e uma privada, que permite trocar segredos e assinar mensagens com quem você nunca encontrou. Está por trás do cadeado do navegador, do Pix e do bitcoin.",
    texto: [
      "Até os anos 1970, para mandar uma mensagem cifrada, as duas pontas precisavam combinar antes uma senha secreta. Em 1976, Whitfield Diffie e Martin Hellman mostraram que dava para fazer diferente, com duas chaves ligadas por matemática: o que uma tranca, só a outra abre.",
      "Em 1977, o algoritmo RSA tornou isso prático. A chave pública pode ser divulgada; a privada fica só com o dono. Com elas, dá para cifrar mensagens que só o destinatário lê e assinar documentos que qualquer um pode conferir.",
      "É essa ideia que faz funcionar o comércio na internet, os certificados digitais e, décadas depois, as moedas digitais sem banco central.",
    ],
    exemplo:
      "Quando você vê o cadeado na barra do navegador ao acessar o banco, um par de chaves está garantindo que você fala com o site certo e que ninguém no meio do caminho lê os dados.",
    naPratica:
      "Entender a lógica das chaves ajuda a separar o que é seguro por desenho do que depende de confiar em alguém. É a base para avaliar qualquer forma de guardar ativos digitais.",
    relacionados: ["chave-privada", "hash", "bitcoin", "internet"],
  },
  {
    slug: "hash",
    termo: "Hash",
    categoria: "Cripto e tecnologia",
    apelidos: ["hashes", "função hash", "funções hash", "SHA-256"],
    resumo:
      "Uma função que transforma qualquer conteúdo numa sequência curta e de tamanho fixo, como uma impressão digital. Mudar uma vírgula no conteúdo muda o resultado por completo, e não dá para fazer o caminho de volta.",
    texto: [
      "Passe um livro inteiro por uma função hash e você recebe uma sequência de 64 caracteres. Passe de novo e recebe a mesma sequência. Troque uma letra no livro e o resultado é totalmente diferente.",
      "Essas propriedades tornam o hash ideal para conferir integridade. Na blockchain, cada bloco carrega o hash do anterior. Mexer numa transação antiga muda aquele hash, quebra o encadeamento e denuncia a fraude.",
      "O bitcoin usa uma função chamada SHA-256, criada pela agência de segurança americana e usada em muitos outros sistemas. A mineração é, no fundo, uma busca por um hash com um formato específico.",
    ],
    exemplo:
      "Sites guardam o hash da sua senha, não a senha. Quando você digita, o sistema calcula o hash e compara. Se o banco de dados vazar, o invasor não vê as senhas diretamente.",
    naPratica:
      "O hash é uma das peças que fazem de uma blockchain um registro difícil de adulterar. Não é preciso entender a matemática; basta saber que a segurança vem do desenho, e não de uma empresa garantindo o registro.",
    relacionados: ["blockchain", "mineracao", "prova-de-trabalho", "criptografia-de-chave-publica"],
  },
  {
    slug: "autocustodia",
    termo: "Autocustódia",
    categoria: "Cripto e tecnologia",
    apelidos: ["auto custódia", "custódia própria", "self-custody", "autocustodiar"],
    resumo:
      "Guardar os próprios criptoativos, com as próprias chaves, sem depender de exchange ou banco. Elimina o risco do intermediário e transfere para você todo o risco de erro, perda e golpe.",
    texto: [
      "Quando você compra bitcoin numa exchange e deixa lá, a exchange guarda as chaves. Você tem um saldo, que é uma promessa da empresa de devolver os ativos quando pedir. Na autocustódia, você transfere os ativos para uma carteira cujas chaves só você controla.",
      "A vantagem é eliminar o risco de a empresa quebrar, bloquear saques ou ser alvo de ordem judicial. A desvantagem é que não há a quem recorrer: perdeu a frase de recuperação, perdeu os ativos.",
      "As regras do Banco Central para prestadoras de serviços de ativos virtuais, em vigor desde fevereiro de 2026, mantiveram a possibilidade de o cliente transferir os ativos para a própria carteira.",
    ],
    exemplo:
      "Na quebra da FTX, em 2022, quem tinha os criptoativos em autocustódia não foi afetado. Quem tinha saldo na exchange ficou anos esperando a recuperação judicial.",
    naPratica:
      "Autocustódia é uma escolha entre dois riscos: o do intermediário e o seu próprio. Para valores relevantes, faz sentido entender bem os dois antes de decidir, e não há resposta única.",
    relacionados: ["carteira-cripto", "chave-privada", "exchange", "custodia", "marco-legal-dos-criptoativos"],
  },
  {
    slug: "exchange",
    termo: "Exchange",
    categoria: "Cripto e tecnologia",
    apelidos: ["exchanges", "corretora de criptoativos", "corretoras de criptoativos", "corretora de cripto", "prestadora de serviços de ativos virtuais", "prestadoras de serviços de ativos virtuais", "SPSAV"],
    resumo:
      "Empresa que intermedeia a compra, a venda e a guarda de criptoativos. No Brasil, desde fevereiro de 2026, precisa de autorização do Banco Central para funcionar.",
    texto: [
      "A exchange é a porta de entrada mais comum para cripto: você deposita reais, compra bitcoin ou outros ativos e pode deixá-los guardados lá ou transferi-los para uma carteira própria.",
      "Por muito tempo, essas empresas funcionaram com pouca regulação no mundo inteiro, e quebras como a da Mt. Gox, em 2014, e a da FTX, em 2022, mostraram o risco de misturar o dinheiro dos clientes com o da empresa.",
      "No Brasil, a Lei 14.478, de 2022, criou o marco legal, e o Banco Central publicou em novembro de 2025 as regras para as prestadoras de serviços de ativos virtuais, em vigor desde 2 de fevereiro de 2026: exigem autorização, capital mínimo e separação entre o patrimônio da empresa e o dos clientes.",
    ],
    exemplo:
      "Hipotético: você compra R$ 10 mil em bitcoin numa exchange e deixa o saldo lá. Se ela segue as regras de segregação, os ativos são seus mesmo que a empresa tenha problemas. Se não segue, você vira credor numa falência.",
    naPratica:
      "Ao escolher uma exchange, confira se ela é autorizada pelo Banco Central, onde e como guarda os ativos dos clientes e quanto cobra no total, incluindo o spread embutido no preço.",
    relacionados: ["marco-legal-dos-criptoativos", "autocustodia", "custodia", "stablecoin", "carteira-cripto"],
  },
  {
    slug: "stablecoin",
    termo: "Stablecoin",
    categoria: "Cripto e tecnologia",
    apelidos: ["stablecoins", "moeda estável", "moedas estáveis", "dólar digital", "dólar tokenizado", "USDT", "USDC", "GENIUS Act"],
    resumo:
      "Criptoativo feito para valer sempre o mesmo que uma moeda tradicional, quase sempre o dólar, geralmente lastreado em depósitos e títulos do Tesouro americano. No Brasil, desde 2026, transações internacionais com stablecoins são tratadas como câmbio.",
    texto: [
      "Uma stablecoin é um token que circula numa blockchain e promete valer, por exemplo, um dólar. Para cumprir a promessa, o emissor guarda reservas, em geral dinheiro e títulos curtos do governo americano, e se compromete a trocar cada token por um dólar.",
      "Elas viraram a ponte entre o mundo cripto e o dinheiro tradicional e são muito usadas para pagamentos internacionais e para guardar valor em dólar. Os Estados Unidos aprovaram em julho de 2025 uma lei federal específica para stablecoins de pagamento, o GENIUS Act, com exigências de reservas e de transparência.",
      "Nem toda stablecoin é igual. As que se apoiavam só em algoritmos, sem reservas, mostraram o risco em maio de 2022, quando a TerraUSD perdeu a paridade e desabou em dias. No Brasil, as regras do Banco Central em vigor desde fevereiro de 2026 passaram a tratar operações internacionais com stablecoins como operações do mercado de câmbio.",
    ],
    exemplo:
      "Hipotético: você troca R$ 5.500 por 1.000 tokens atrelados ao dólar numa exchange. Se o emissor for sólido, os tokens valem US$ 1.000 em qualquer lugar do mundo, a qualquer hora. Se não for, a paridade pode quebrar.",
    naPratica:
      "Uma stablecoin dá exposição ao dólar, mas o risco não é o mesmo de uma conta em banco americano: depende do emissor, das reservas, da exchange e da regulação. Para a Receita e o Banco Central, também não é uma forma de escapar das regras de câmbio e de imposto.",
    relacionados: ["tokenizacao", "exchange", "marco-legal-dos-criptoativos", "cbdc", "treasury", "remessa"],
  },
  {
    slug: "token",
    termo: "Token",
    categoria: "Cripto e tecnologia",
    apelidos: ["tokens", "criptoativo", "criptoativos", "ativo virtual", "ativos virtuais", "ativos digitais", "criptomoeda", "criptomoedas"],
    resumo:
      "Uma unidade digital registrada numa blockchain que representa valor ou um direito: uma moeda, uma cota, um título, um ingresso. Criptoativo é o nome geral para esses ativos.",
    texto: [
      "Um token é um registro numa blockchain que diz quem tem o quê. Pode ser a moeda nativa de uma rede, como o bitcoin ou o ether, ou algo criado em cima de uma rede existente, como uma stablecoin ou a representação digital de um título.",
      "A lei brasileira usa a expressão ativo virtual: representação digital de valor que pode ser negociada ou transferida por meios eletrônicos e usada para pagamento ou investimento. Ficam fora dessa definição, por exemplo, a moeda nacional e os valores mobiliários, que têm regras próprias.",
      "O mesmo token pode ter naturezas jurídicas diferentes conforme o que ele representa. Um token que dá direito a lucros de uma empresa pode ser um valor mobiliário, sob a CVM, e não um simples ativo virtual.",
    ],
    exemplo:
      "Hipotético: um imóvel dividido em 1.000 tokens, cada um dando direito a uma fração do aluguel. Quem compra 10 tokens recebe 1% da renda, e pode vendê-los a qualquer hora para outra pessoa.",
    naPratica:
      "Token é forma, não conteúdo. A pergunta certa é sempre o que está por trás dele, quem garante esse direito e sob que lei.",
    relacionados: ["tokenizacao", "rwa", "stablecoin", "blockchain", "marco-legal-dos-criptoativos"],
  },
  {
    slug: "tokenizacao",
    termo: "Tokenização",
    categoria: "Cripto e tecnologia",
    apelidos: ["tokenizar", "tokenizado", "tokenizados", "ativos tokenizados", "tokenização de ativos"],
    resumo:
      "Representar um ativo tradicional, como título, cota de fundo, imóvel ou recebível, como um token numa blockchain. Promete negociação a qualquer hora, liquidação mais rápida e frações menores.",
    texto: [
      "Hoje, comprar um título ou uma cota de fundo passa por corretora, custodiante, câmara de liquidação e alguns dias de espera. A tokenização propõe registrar esse mesmo ativo numa blockchain, onde a troca de dono pode acontecer em minutos, a qualquer hora, em frações pequenas.",
      "O ativo continua o mesmo: um título do Tesouro americano tokenizado ainda é um título do Tesouro americano. O que muda é a forma de registro e transferência.",
      "Desde 2024, grandes gestoras e bancos passaram a lançar fundos de títulos públicos americanos tokenizados, e bancos centrais estudam usar a tecnologia em seus sistemas. A adoção ainda é pequena perto do mercado tradicional, e as questões jurídicas, como quem garante o direito sobre o ativo, seguem em discussão.",
    ],
    exemplo:
      "Hipotético: um título que paga juros semestrais é dividido em tokens de US$ 10. Um investidor no Brasil compra 50 tokens num sábado e, na segunda, vende metade para outro investidor, sem passar por câmara de liquidação.",
    naPratica:
      "A tokenização pode baratear e simplificar o acesso a ativos de fora no futuro. Por ora, o investidor precisa olhar o que está por trás do token, quem é o emissor, onde está o ativo e que proteção existe se algo der errado.",
    relacionados: ["rwa", "token", "stablecoin", "drex", "contrato-inteligente", "treasury"],
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
      "No vocabulário cripto, RWA, sigla de real world assets, designa tokens que representam algo que existe fora da blockchain: um título do Tesouro, um recebível de empresa, um imóvel, uma barra de ouro.",
      "O segmento cresceu a partir de 2023, puxado por fundos de títulos públicos americanos tokenizados, que pagam juros a quem tem os tokens, e por stablecoins lastreadas nesses mesmos títulos.",
      "O risco de um RWA tem duas camadas: o do ativo em si, como o crédito de uma empresa, e o da estrutura que liga o token ao ativo, como o emissor, o custodiante e a lei que se aplica em caso de disputa.",
    ],
    exemplo:
      "Hipotético: um token de RWA representa uma fração de um fundo que compra títulos do Tesouro americano de curto prazo. O rendimento acompanha esses títulos, menos as taxas do fundo.",
    naPratica:
      "RWA aproxima o mundo cripto da renda fixa tradicional. Não muda o risco do ativo por trás, e acrescenta o risco da estrutura. A pergunta é sempre a mesma: o que exatamente eu tenho, e quem me garante isso?",
    relacionados: ["tokenizacao", "token", "stablecoin", "defi", "treasury"],
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
      "Imagine uma casa de câmbio que não tem dono nem funcionários: é um programa público numa blockchain que troca um token por outro conforme regras escritas no código. Ou um sistema de empréstimo em que você deixa um criptoativo como garantia e toma outro emprestado, tudo automático. Isso é DeFi.",
      "Os protocolos funcionam com contratos inteligentes, quase sempre na rede do Ethereum e em redes parecidas. Qualquer pessoa com uma carteira pode usar, sem cadastro em banco.",
      "Os riscos são diferentes dos do sistema tradicional. Um erro no código pode ser explorado por hackers e drenar milhões em minutos. Garantias podem ser liquidadas automaticamente numa queda forte de preço. E não há fundo garantidor nem a quem reclamar.",
    ],
    exemplo:
      "Hipotético: você deixa o equivalente a US$ 10 mil em ether como garantia e toma US$ 5 mil em stablecoin emprestados. Se o ether cair 40%, o protocolo vende a sua garantia automaticamente para cobrir a dívida.",
    naPratica:
      "DeFi mostra o potencial da tecnologia para recriar serviços financeiros sem intermediário. Para o investidor, exige entender o risco técnico, além do de preço. O tema volta no Módulo IV.",
    relacionados: ["contrato-inteligente", "ethereum", "stablecoin", "staking", "rwa"],
  },
  {
    slug: "contrato-inteligente",
    termo: "Contrato inteligente",
    categoria: "Cripto e tecnologia",
    apelidos: ["contratos inteligentes", "smart contract", "smart contracts"],
    resumo:
      "Um programa que roda numa blockchain e executa regras automaticamente quando as condições são cumpridas. Ninguém consegue impedir nem alterar a execução depois que ele está no ar.",
    texto: [
      "Pense numa máquina de refrigerante: você põe a moeda, aperta o botão e a lata cai, sem vendedor no meio. O cientista da computação Nick Szabo usou essa imagem nos anos 1990 para descrever contratos que se executam sozinhos.",
      "O Ethereum, lançado em 2015, tornou a ideia prática: qualquer pessoa pode publicar um programa na rede, e ele passa a funcionar exatamente como foi escrito, para qualquer um que interagir com ele.",
      "A força e o risco vêm do mesmo lugar. O contrato faz exatamente o que o código diz, nem mais nem menos. Se o código tiver um erro, ele também será executado à risca.",
    ],
    exemplo:
      "Hipotético: um contrato inteligente guarda o pagamento de um frete e só libera o dinheiro à transportadora quando um sensor confirma a entrega. Ninguém precisa conferir nada manualmente.",
    naPratica:
      "Contratos inteligentes são a base de DeFi, de stablecoins e da tokenização. Ao usar qualquer serviço desse tipo, você está confiando num código: auditorias e histórico importam tanto quanto a reputação de quem o criou.",
    relacionados: ["ethereum", "defi", "tokenizacao", "blockchain", "drex"],
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
      "Se o bitcoin é uma calculadora feita para uma coisa só, o dinheiro digital, o Ethereum é um computador mundial em que qualquer pessoa pode publicar programas. A proposta foi apresentada por Vitalik Buterin no fim de 2013, e a rede entrou no ar em 30 de julho de 2015.",
      "Esses programas, os contratos inteligentes, deram origem a stablecoins, finanças descentralizadas, tokens de todo tipo e boa parte das experiências de tokenização. Para usar a rede, paga-se uma taxa em ether.",
      "Em 15 de setembro de 2022, o Ethereum trocou a mineração pela prova de participação, no evento chamado The Merge. A emissão de ether não tem um teto fixo como a do bitcoin; depende das regras da rede e do uso.",
    ],
    exemplo:
      "Hipotético: ao trocar uma stablecoin por outra num protocolo DeFi, você paga uma taxa em ether à rede. Em momentos de muito uso, essa taxa sobe.",
    naPratica:
      "O valor do ether está ligado ao uso da rede como infraestrutura, o que o torna um ativo diferente do bitcoin. Os dois oscilam muito e costumam cair juntos em crises de mercado.",
    relacionados: ["contrato-inteligente", "prova-de-participacao", "defi", "staking", "bitcoin", "stablecoin"],
  },
  {
    slug: "etf-de-bitcoin",
    termo: "ETF de bitcoin",
    categoria: "Cripto e tecnologia",
    apelidos: ["ETFs de bitcoin", "ETF de cripto", "ETFs de cripto", "ETFs de criptoativos", "ETF de criptoativos", "ETF à vista de bitcoin"],
    resumo:
      "Fundo negociado em bolsa que dá exposição ao bitcoin sem que o investidor precise lidar com carteira e chaves. Os primeiros à vista nos Estados Unidos foram aprovados em janeiro de 2024; na B3, existem desde 2021.",
    texto: [
      "Um ETF de bitcoin compra e guarda bitcoins, ou acompanha o preço deles, e emite cotas negociadas na bolsa como uma ação. Para o investidor, a exposição vem pela corretora de sempre, sem carteira, chave privada ou exchange.",
      "Na B3, ETFs de criptoativos são negociados desde 2021. Nos Estados Unidos, depois de anos de pedidos negados, a SEC aprovou os primeiros ETFs de bitcoin à vista em 10 de janeiro de 2024, e eles estão entre os lançamentos de ETF que mais captaram na história. ETFs de ether à vista vieram em julho de 2024.",
      "Os custos incluem a taxa de administração e o tratamento tributário do veículo, que segue as regras do país onde o ETF está listado.",
    ],
    exemplo:
      "Hipotético: você compra cotas de um ETF de bitcoin na B3 pela sua corretora. Se o bitcoin sobe 10% em dólar e o dólar sobe 2%, a cota sobe perto de 12% em reais, menos a taxa do fundo.",
    naPratica:
      "O ETF troca o risco da autocustódia pelo risco do gestor e do custodiante do fundo, e põe o ativo dentro da estrutura regulada da bolsa. É uma escolha entre formas de deter o mesmo ativo, cada uma com custos e riscos próprios.",
    relacionados: ["bitcoin", "etf", "autocustodia", "custodia", "ethereum"],
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
      "O dinheiro na sua conta bancária já é digital, mas é uma dívida do banco com você. Uma CBDC seria dinheiro digital emitido diretamente pelo banco central, como as notas de papel, só que em formato eletrônico.",
      "Vários países testaram ou lançaram versões. As Bahamas lançaram a sua em 2020, a China testa o yuan digital desde então, e o Banco Central Europeu estuda o euro digital. Os Estados Unidos seguiram outro caminho: em janeiro de 2025, uma ordem executiva proibiu agências federais de promover um dólar digital de varejo, e o país apostou na regulação de stablecoins privadas.",
      "O debate envolve privacidade, papel dos bancos e o que fazer com a programabilidade: um dinheiro que só pode ser gasto em certas coisas, ou que expira, é tecnicamente possível.",
    ],
    exemplo:
      "Hipotético: um governo paga um benefício em moeda digital programada para ser gasta só com alimentos, num prazo de 90 dias. É eficiente para o objetivo e levanta dúvidas sobre controle.",
    naPratica:
      "Uma CBDC continua sendo a moeda do país, com o mesmo banco central e o mesmo risco de inflação. Mudar o formato do dinheiro não diversifica nada; diversificar é ter ativos em outras moedas e jurisdições.",
    relacionados: ["drex", "stablecoin", "banco-central", "pix", "tokenizacao"],
  },
  {
    slug: "drex",
    termo: "Drex",
    categoria: "Cripto e tecnologia",
    apelidos: ["piloto do Drex"],
    resumo:
      "O projeto do Banco Central para uma infraestrutura digital do real, nascido para usar blockchain e tokenização. Em 2025, o BC redesenhou o plano: a primeira entrega, prevista para 2026, fica restrita ao sistema financeiro e sem blockchain.",
    texto: [
      "O Drex começou como o real digital: uma plataforma em que bancos emitiriam versões tokenizadas de depósitos, e títulos públicos e outros ativos poderiam ser negociados com contratos inteligentes. O piloto, com dezenas de instituições, começou em 2023.",
      "Os testes esbarraram num problema difícil: conciliar a transparência de uma blockchain com o sigilo bancário. Em 2025, o Banco Central anunciou uma mudança de rota. A primeira fase, prevista para 2026, focaria em reconciliar garantias de crédito entre instituições, sem usar a tecnologia de registro distribuído, e a tokenização ficaria para etapas futuras.",
      "Ao contrário do que muitas vezes se diz, o Drex não foi pensado como uma nova moeda para o cidadão usar no dia a dia: é infraestrutura para o sistema financeiro.",
    ],
    exemplo:
      "Hipotético: um carro dado como garantia num financiamento aparece como gravado em todos os bancos ao mesmo tempo, evitando que seja usado como garantia duas vezes. É o tipo de problema que a primeira fase do Drex pretende resolver.",
    naPratica:
      "O Drex não muda o risco de ter o patrimônio em reais: é o mesmo real, com o mesmo Banco Central. Vale acompanhar porque pode, no futuro, baratear operações e o acesso a ativos tokenizados.",
    relacionados: ["cbdc", "tokenizacao", "pix", "banco-central", "contrato-inteligente"],
  },
  {
    slug: "pix",
    termo: "Pix",
    categoria: "Cripto e tecnologia",
    apelidos: ["pagamento instantâneo", "pagamentos instantâneos"],
    resumo:
      "O sistema de pagamentos instantâneos do Banco Central, lançado em novembro de 2020. Transfere dinheiro em segundos, 24 horas por dia, e virou o meio de pagamento mais usado do Brasil.",
    texto: [
      "Antes do Pix, transferir dinheiro entre bancos significava TED com horário limitado ou DOC que caía no dia seguinte, quase sempre com tarifa. Em 16 de novembro de 2020, o Banco Central pôs no ar um sistema próprio, em que as instituições se conectam a uma infraestrutura pública.",
      "A adoção foi rapidíssima: em poucos anos, o Pix virou o meio de pagamento mais usado do país em número de transações, à frente de cartões e boletos. Para pessoas físicas, é gratuito na maior parte dos casos.",
      "O Pix é um exemplo de infraestrutura pública digital: o Banco Central faz os trilhos, e bancos e fintechs constroem os serviços em cima.",
    ],
    exemplo:
      "Hipotético: às 23h de um domingo, você paga um prestador com um código QR. O dinheiro cai na conta dele em segundos, sem tarifa.",
    naPratica:
      "O Pix é dinheiro em reais, no sistema brasileiro: mudou a forma de pagar, não a moeda. Parte das contas globais e das plataformas de remessa usa o Pix como porta de entrada para converter reais em dólar, mas a operação de câmbio, o IOF e as regras continuam as mesmas.",
    relacionados: ["banco-central", "drex", "cbdc", "remessa", "conta-global"],
  },
  {
    slug: "marco-legal-dos-criptoativos",
    termo: "Marco legal dos criptoativos",
    categoria: "Cripto e tecnologia",
    apelidos: ["Lei 14.478", "Lei 14.478/2022", "marco legal das criptomoedas", "regulação de cripto", "regras do Banco Central para cripto"],
    resumo:
      "A Lei 14.478, de dezembro de 2022, que criou as regras básicas para empresas de ativos virtuais no Brasil. O Banco Central foi escolhido como regulador e publicou as normas detalhadas em novembro de 2025, em vigor desde fevereiro de 2026.",
    texto: [
      "Até 2022, exchanges e outras empresas de cripto funcionavam no Brasil sem um regulador definido. A Lei 14.478, de 21 de dezembro de 2022, definiu o que é ativo virtual e o que é uma prestadora de serviços desses ativos, e criou um crime específico de fraude com ativos virtuais.",
      "Em 2023, um decreto designou o Banco Central como regulador. Em novembro de 2025, ele publicou as Resoluções 519, 520 e 521, que tratam da autorização das empresas, das regras de funcionamento e da ligação entre cripto e câmbio. Elas entraram em vigor em 2 de fevereiro de 2026.",
      "Entre os pontos centrais estão a exigência de autorização, capital mínimo, separação entre o patrimônio da empresa e o dos clientes, regras contra lavagem de dinheiro e o tratamento de operações internacionais com stablecoins como câmbio. A possibilidade de autocustódia foi mantida.",
    ],
    exemplo:
      "Hipotético: uma exchange estrangeira que atende brasileiros sem autorização passa a operar fora das regras. O cliente que deixa ativos lá fica sem a proteção da segregação patrimonial exigida aqui.",
    naPratica:
      "A regulação dá mais segurança a quem usa intermediários no Brasil, mas também aproxima as operações com cripto das regras de câmbio e de imposto. Cripto não é atalho para fugir delas.",
    relacionados: ["exchange", "stablecoin", "autocustodia", "token", "banco-central"],
  },
  {
    slug: "internet",
    termo: "Internet",
    categoria: "Cripto e tecnologia",
    apelidos: ["rede mundial"],
    resumo:
      "A rede que liga computadores do mundo inteiro por protocolos comuns. Nasceu de projetos militares e acadêmicos nos Estados Unidos, nos anos 1960 e 1970, e chegou ao uso comercial no Brasil em 1995.",
    texto: [
      "A internet não tem dono. É uma rede de redes, que conversam porque seguem as mesmas regras de comunicação, os protocolos TCP/IP. Começou com a ARPANET, um projeto financiado pelo Departamento de Defesa americano que ligou universidades em 1969.",
      "Por duas décadas, foi coisa de pesquisadores. Dois passos a levaram ao público: a adoção do TCP/IP como padrão, em 1983, e a World Wide Web, criada por Tim Berners-Lee no CERN entre 1989 e 1991, que trouxe páginas e links clicáveis.",
      "No Brasil, o acesso comercial começou em 1995. Trinta anos depois, a internet é a infraestrutura sobre a qual funcionam bancos, bolsas, o Pix, as redes cripto e a inteligência artificial.",
    ],
    exemplo:
      "A mensagem inaugural da ARPANET, enviada da Universidade da Califórnia em Los Angeles para o Instituto de Pesquisa de Stanford em outubro de 1969, era para ser a palavra login. O sistema caiu depois das duas primeiras letras.",
    naPratica:
      "As empresas que mais ganharam com a internet estão quase todas listadas fora do Brasil. É um exemplo de como transformações tecnológicas grandes podem acontecer longe da bolsa onde está o seu dinheiro.",
    relacionados: ["arpanet", "tcp-ip", "world-wide-web", "inteligencia-artificial", "semicondutor"],
  },
  {
    slug: "arpanet",
    termo: "ARPANET",
    categoria: "Cripto e tecnologia",
    apelidos: ["comutação de pacotes"],
    resumo:
      "A primeira grande rede de computadores por comutação de pacotes, financiada pelo governo americano e inaugurada em 1969. É a avó da internet.",
    texto: [
      "Nos anos 1960, a agência de projetos de pesquisa do Departamento de Defesa americano, a ARPA, financiou uma rede para ligar computadores de universidades e centros de pesquisa e permitir que compartilhassem recursos caros.",
      "A inovação técnica foi a comutação de pacotes: em vez de abrir uma linha dedicada, como num telefonema, a mensagem é quebrada em pedaços que viajam por caminhos diferentes e são remontados no destino. Se um caminho cai, os pacotes usam outro.",
      "Em 29 de outubro de 1969, os primeiros dois nós trocaram a primeira mensagem. Ao longo dos anos 1970, a rede cresceu e serviu de laboratório para os protocolos que viraram a internet.",
    ],
    exemplo:
      "Hipotético: uma carta de dez páginas enviada como dez envelopes separados, cada um por uma rota diferente, e reorganizada pelo destinatário. Se um carteiro se perde, só um envelope precisa ser reenviado.",
    naPratica:
      "A ARPANET é um exemplo de pesquisa pública que, décadas depois, virou uma indústria. Avaliar o impacto econômico de uma tecnologia no começo é quase impossível, um motivo a mais para humildade com previsões sobre IA e cripto.",
    relacionados: ["internet", "tcp-ip", "world-wide-web"],
  },
  {
    slug: "tcp-ip",
    termo: "TCP/IP",
    categoria: "Cripto e tecnologia",
    apelidos: ["protocolo TCP/IP", "protocolos TCP/IP", "protocolo IP", "endereço IP"],
    resumo:
      "O conjunto de regras que permite que redes diferentes conversem entre si e que os dados cheguem inteiros ao destino. É a língua comum da internet desde 1983.",
    texto: [
      "Em 1974, Vint Cerf e Bob Kahn publicaram o desenho de um protocolo para interligar redes diferentes. A ideia virou dois protocolos que trabalham juntos: o IP, que dá endereço a cada máquina e encaminha os pacotes, e o TCP, que confere se todos os pedaços chegaram e na ordem certa.",
      "Em 1º de janeiro de 1983, a ARPANET adotou o TCP/IP como padrão. A partir daí, qualquer rede que falasse essa língua podia se ligar às outras. Nascia a internet como rede de redes.",
      "O sucesso veio da simplicidade e da abertura: ninguém precisa pedir licença para criar um serviço novo sobre o TCP/IP, seja um site, um aplicativo de mensagens ou uma blockchain.",
    ],
    exemplo:
      "Cada vez que você abre um site, o seu aparelho divide o pedido em pacotes com o endereço IP do servidor. O TCP garante que a página chegue inteira, mesmo que alguns pacotes se percam e precisem ser reenviados.",
    naPratica:
      "Protocolos abertos criaram mercados gigantes para quem construiu em cima deles. As redes públicas de blockchain tentam repetir essa lógica com dinheiro e registro de ativos, e o resultado ainda está em aberto.",
    relacionados: ["internet", "arpanet", "world-wide-web", "blockchain"],
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
      "Internet e web não são a mesma coisa. A internet é a rede; a web é um dos serviços que rodam sobre ela, como o e-mail. Em março de 1989, o físico britânico Tim Berners-Lee, do CERN, na Suíça, propôs um sistema para organizar documentos ligados por links.",
      "Ele criou os três ingredientes que usamos até hoje: o endereço de cada página, a linguagem para escrevê-la e o protocolo para buscá-la. O primeiro site entrou no ar em 1991, e em 1993 o CERN liberou a tecnologia para uso livre.",
      "Com os navegadores gráficos que vieram em seguida, a web virou o meio de massa que conhecemos e abriu caminho para o comércio eletrônico e para as grandes empresas de tecnologia.",
    ],
    exemplo:
      "Toda vez que você clica num link e vai de uma página a outra, mesmo em servidores de países diferentes, está usando a ideia de 1989.",
    naPratica:
      "A decisão de liberar a web sem cobrança de licença ajudou a criar uma das maiores ondas de riqueza da história, concentrada em empresas que hoje pesam muito nos índices globais e quase nada na bolsa brasileira.",
    relacionados: ["internet", "tcp-ip", "arpanet", "inteligencia-artificial"],
  },
  {
    slug: "transistor",
    termo: "Transistor",
    categoria: "Cripto e tecnologia",
    apelidos: ["transistores", "circuito integrado", "circuitos integrados"],
    resumo:
      "A chave eletrônica microscópica que liga e desliga a passagem de corrente. Inventado em 1947, é a célula básica de todo chip. Um processador moderno tem dezenas de bilhões deles.",
    texto: [
      "Em dezembro de 1947, nos Laboratórios Bell, nos Estados Unidos, John Bardeen, Walter Brattain e William Shockley demonstraram o primeiro transistor. Ele fazia o trabalho das válvulas, grandes, quentes e frágeis, com muito menos espaço e energia. Os três ganharam o Nobel de Física.",
      "O passo seguinte foi pôr vários transistores numa única peça de material semicondutor. Jack Kilby, em 1958, e Robert Noyce, em 1959, criaram o circuito integrado, o chip.",
      "Desde então, a indústria encolheu os transistores sem parar. Quanto menores, mais cabem num chip, mais rápido ele fica e menos energia gasta por operação.",
    ],
    exemplo:
      "O ENIAC, de 1945, usava quase 18 mil válvulas e ocupava uma sala. Um celular de hoje tem bilhões de transistores num chip menor que uma unha.",
    naPratica:
      "Toda a cadeia que vai do transistor ao chip de inteligência artificial está concentrada em poucas empresas e países, quase nenhum deles na bolsa brasileira.",
    relacionados: ["semicondutor", "lei-de-moore", "gpu", "inteligencia-artificial"],
  },
  {
    slug: "semicondutor",
    termo: "Semicondutor",
    categoria: "Cripto e tecnologia",
    apelidos: ["semicondutores", "chip", "chips", "silício", "indústria de semicondutores", "fabricação de chips"],
    resumo:
      "Material que conduz eletricidade de forma controlável, como o silício, e, por extensão, a indústria dos chips feitos com ele. É a matéria-prima da computação, da inteligência artificial e de quase toda a eletrônica.",
    texto: [
      "Um semicondutor fica entre o condutor, como o cobre, e o isolante, como o vidro. Dá para controlar quando ele conduz, e é isso que permite construir transistores. O silício é o mais usado, e deu nome ao Vale do Silício.",
      "A indústria tem etapas muito diferentes e concentradas. Há empresas que desenham chips, como a Nvidia, e empresas que os fabricam, como a TSMC, de Taiwan, responsável pela maior parte dos chips mais avançados do mundo. As máquinas de litografia mais avançadas usadas nessa fabricação vêm de uma única empresa, a holandesa ASML.",
      "Essa concentração virou assunto geopolítico. Governos dos Estados Unidos, da Europa e da Ásia passaram a subsidiar fábricas locais e a restringir exportações de chips e equipamentos.",
    ],
    exemplo:
      "Em 2020 e 2021, a falta de chips parou linhas de montagem de carros no mundo inteiro, inclusive no Brasil. Um componente de poucos dólares travou a produção de um bem de dezenas de milhares.",
    naPratica:
      "Na aula, Felippe Hermes e Rodolfo Bastos lembram que chips, semicondutores e inteligência artificial quase não existem na B3. Quem quer exposição a esses setores precisa olhar para fora, sabendo que eles também são concentrados e voláteis.",
    relacionados: ["transistor", "lei-de-moore", "gpu", "inteligencia-artificial", "data-center"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "13:04" },
      { modulo: 0, aula: 4, tempo: "14:31" },
    ],
  },
  {
    slug: "lei-de-moore",
    termo: "Lei de Moore",
    categoria: "Cripto e tecnologia",
    apelidos: ["Gordon Moore"],
    resumo:
      "A observação de Gordon Moore, em 1965, de que o número de transistores num chip dobrava em intervalos regulares. Revista em 1975 para a cada dois anos, guiou o ritmo da indústria por cinco décadas.",
    texto: [
      "Em 1965, Gordon Moore, que depois fundaria a Intel, notou que o número de componentes num chip vinha dobrando a cada ano e previu que isso continuaria. Em 1975, ajustou a previsão para a cada dois anos.",
      "Não é uma lei da física. É uma meta que a indústria perseguiu, investindo bilhões para encolher transistores no ritmo previsto. O resultado foi um barateamento contínuo da computação.",
      "Nas últimas décadas, o ritmo desacelerou, porque os transistores chegaram perto de limites físicos e o custo das fábricas explodiu. O ganho de desempenho passou a vir também de arquiteturas novas, como os chips especializados em inteligência artificial.",
    ],
    exemplo:
      "Dobrar a cada dois anos por 50 anos significa multiplicar por mais de 30 milhões. É a distância entre os primeiros microprocessadores dos anos 1970, com milhares de transistores, e os chips de hoje, com dezenas de bilhões.",
    naPratica:
      "Crescimento exponencial de capacidade não se traduz automaticamente em lucro para todas as empresas do setor. Muitos fabricantes ficaram pelo caminho. Exposição a tecnologia ganha com diversificação dentro dela também.",
    relacionados: ["transistor", "semicondutor", "gpu", "inteligencia-artificial"],
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
      "O processador comum, a CPU, é como um chef muito habilidoso que faz uma tarefa complexa de cada vez. A GPU é como uma cozinha com milhares de ajudantes fazendo tarefas simples ao mesmo tempo. Para desenhar milhões de pixels de um jogo, ou para fazer as multiplicações de uma rede neural, a segunda ganha de longe.",
      "Em 2006, a Nvidia lançou o CUDA, que permitia usar suas placas para cálculos gerais, não só para gráficos. Em 2012, uma rede neural treinada em duas GPUs, a AlexNet, venceu com folga uma competição de reconhecimento de imagens e mostrou o caminho para o aprendizado profundo.",
      "Com a explosão da IA generativa, a partir de 2022, GPUs para data centers viraram o produto mais disputado da tecnologia, e a Nvidia passou a ser a empresa mais valiosa do mundo.",
    ],
    exemplo:
      "Em agosto de 2026, a Nvidia sozinha valia mais de dez vezes o índice inteiro de ações brasileiras da MSCI.",
    naPratica:
      "A corrida da IA criou um dos setores mais concentrados e voláteis da bolsa americana. Ter exposição a ele é uma forma de participar de uma tese que não existe na B3, e também de assumir o risco de concentração do outro lado.",
    relacionados: ["semicondutor", "aprendizado-profundo", "inteligencia-artificial", "data-center", "lei-de-moore"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "13:04" },
      { modulo: 0, aula: 4, tempo: "8:05" },
    ],
  },
  {
    slug: "data-center",
    termo: "Data center",
    categoria: "Cripto e tecnologia",
    apelidos: ["data centers", "centro de dados", "centros de dados", "computação em nuvem", "hyperscalers"],
    resumo:
      "Prédio cheio de servidores, cabos e sistemas de refrigeração onde rodam a nuvem, os aplicativos e os modelos de inteligência artificial. Consome muita energia e virou um dos maiores destinos de investimento da tecnologia.",
    texto: [
      "Quando você guarda uma foto na nuvem ou faz uma pergunta a um assistente de IA, o trabalho acontece num data center: galpões com milhares de servidores ligados em rede, energia redundante e refrigeração pesada.",
      "As grandes empresas de nuvem constroem e operam os maiores. Com a inteligência artificial, a demanda por data centers cheios de GPUs disparou, e com ela a necessidade de energia elétrica, terrenos, água para refrigeração e linhas de transmissão.",
      "A cadeia envolve muito mais do que empresas de software: fabricantes de chips, de equipamentos de rede, geradores de energia, construtoras e fundos imobiliários especializados.",
    ],
    exemplo:
      "Hipotético: um data center para treinar modelos de IA pode consumir tanta eletricidade quanto uma cidade média. Por isso empresas de tecnologia passaram a fechar contratos de energia de longo prazo, inclusive nuclear.",
    naPratica:
      "A infraestrutura física da IA é uma tese de investimento que atravessa vários setores. Quase todos esses setores, na escala global, estão fora da bolsa brasileira.",
    relacionados: ["gpu", "inteligencia-artificial", "semicondutor", "internet"],
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
      "O nome nasceu numa proposta de pesquisa de 1955 e num encontro na Universidade Dartmouth, em 1956. Por décadas, o campo alternou otimismo e frustração: os sistemas baseados em regras escritas à mão funcionavam em problemas estreitos e falhavam no mundo real.",
      "A virada veio do aprendizado de máquina: em vez de programar regras, alimentar o sistema com dados e deixá-lo achar os padrões. Com mais dados, GPUs e redes neurais profundas, a partir de 2012 as máquinas passaram a reconhecer imagens e voz quase tão bem quanto pessoas.",
      "Em 2017, a arquitetura transformer abriu caminho para os grandes modelos de linguagem. Em novembro de 2022, o lançamento do ChatGPT levou a IA generativa, que escreve, resume e cria imagens, ao uso de massa, e deflagrou uma corrida de investimentos em chips, data centers e energia.",
    ],
    exemplo:
      "Hipotético: um escritório que levava uma semana para revisar mil contratos passa a fazer uma primeira triagem em horas, com um modelo de linguagem marcando as cláusulas fora do padrão para um advogado conferir.",
    naPratica:
      "Na aula, inteligência artificial aparece como uma das teses que quase não existem na B3. As empresas que mais investem e mais faturam com IA estão listadas fora. Isso não torna o setor uma aposta segura: euforia e concentração também fazem parte da história da tecnologia.",
    relacionados: ["aprendizado-de-maquina", "rede-neural", "modelo-de-linguagem", "gpu", "semicondutor", "data-center"],
    noCurso: [
      { modulo: 0, aula: 1, tempo: "13:04" },
      { modulo: 0, aula: 4, tempo: "14:31" },
    ],
  },
  {
    slug: "aprendizado-de-maquina",
    termo: "Aprendizado de máquina",
    categoria: "Cripto e tecnologia",
    apelidos: ["machine learning", "aprendizagem de máquina"],
    resumo:
      "O jeito de fazer computadores aprenderem padrões a partir de exemplos, em vez de seguirem regras escritas por programadores. É a base de quase toda a inteligência artificial moderna.",
    texto: [
      "Tente escrever as regras para reconhecer um gato numa foto: orelhas pontudas, bigodes, quatro patas. Logo aparecem as exceções. O aprendizado de máquina inverte o problema: você mostra milhares de fotos marcadas como gato ou não gato, e o sistema ajusta sozinho os próprios parâmetros até acertar.",
      "A mesma lógica serve para prever inadimplência a partir do histórico de clientes, detectar fraude em cartões, recomendar filmes ou traduzir textos.",
      "O resultado depende muito dos dados. Exemplos ruins ou enviesados produzem um modelo ruim ou enviesado, e um modelo treinado no passado pode errar quando o mundo muda.",
    ],
    exemplo:
      "Hipotético: um banco treina um modelo com o histórico de 1 milhão de empréstimos. O modelo aprende que certos padrões de uso do cartão antecedem atrasos e passa a sinalizar clientes com risco maior.",
    naPratica:
      "Modelos que aprendem com o passado têm a mesma limitação que o investidor que olha o retrovisor: funcionam enquanto o futuro se parece com o passado. É uma boa lembrança de humildade com qualquer previsão de mercado.",
    relacionados: ["inteligencia-artificial", "rede-neural", "aprendizado-profundo", "modelo-de-linguagem"],
  },
  {
    slug: "rede-neural",
    termo: "Rede neural",
    categoria: "Cripto e tecnologia",
    apelidos: ["redes neurais", "rede neural artificial", "neurônios artificiais", "perceptron"],
    resumo:
      "Um modelo matemático feito de camadas de unidades simples, inspiradas de longe nos neurônios, que aprendem ajustando a força das ligações entre si. É a peça central da IA atual.",
    texto: [
      "Cada neurônio artificial recebe números, multiplica cada um por um peso, soma tudo e passa adiante o resultado. Sozinho, não faz quase nada. Milhões ou bilhões deles, organizados em camadas, conseguem reconhecer rostos, entender frases e jogar xadrez.",
      "A ideia é antiga: o perceptron, de Frank Rosenblatt, é de 1958. Nos anos 1980, um método para ajustar os pesos camada por camada, chamado retropropagação, tornou possível treinar redes com várias camadas.",
      "Faltavam dados e poder de computação. Quando os dois chegaram, com a internet e as GPUs, as redes neurais deixaram de ser curiosidade acadêmica e viraram tecnologia de massa.",
    ],
    exemplo:
      "Hipotético: uma rede recebe os pixels de uma foto. As primeiras camadas aprendem a detectar bordas, as do meio, formas como olhos e orelhas, e as últimas decidem se é um gato.",
    naPratica:
      "Não é preciso entender a matemática para entender o investimento: as redes neurais transformaram poder de computação em produto, e é por isso que chips, energia e data centers viraram parte da mesma tese.",
    relacionados: ["aprendizado-profundo", "aprendizado-de-maquina", "transformer", "gpu", "inteligencia-artificial"],
  },
  {
    slug: "aprendizado-profundo",
    termo: "Aprendizado profundo",
    categoria: "Cripto e tecnologia",
    apelidos: ["deep learning", "aprendizagem profunda", "redes neurais profundas", "AlexNet"],
    resumo:
      "O uso de redes neurais com muitas camadas, treinadas com grandes volumes de dados em GPUs. Foi o que destravou a IA moderna, a partir de 2012.",
    texto: [
      "O profundo do nome se refere ao número de camadas. Com poucas, uma rede aprende padrões simples; com dezenas ou centenas, aprende representações cada vez mais abstratas, de bordas a formas, de formas a objetos, de palavras a ideias.",
      "O marco foi 2012, quando a AlexNet, treinada em duas GPUs, venceu a competição de reconhecimento de imagens ImageNet com uma margem enorme. Em poucos anos, o aprendizado profundo passou a dominar visão computacional, reconhecimento de voz e tradução.",
      "Geoffrey Hinton, Yann LeCun e Yoshua Bengio, pioneiros da área, receberam o Prêmio Turing em 2018. Hinton dividiu o Nobel de Física de 2024 com John Hopfield.",
    ],
    exemplo:
      "O reconhecimento de rosto que desbloqueia o seu celular e a transcrição automática de áudio são aplicações de aprendizado profundo que você usa sem perceber.",
    naPratica:
      "O aprendizado profundo transformou chips de videogame em infraestrutura estratégica. Quem acompanha tecnologia como tese de investimento precisa entender que boa parte do valor está no hardware e na energia, e não só no software.",
    relacionados: ["rede-neural", "gpu", "transformer", "aprendizado-de-maquina", "inteligencia-artificial"],
  },
  {
    slug: "transformer",
    termo: "Transformer",
    categoria: "Cripto e tecnologia",
    apelidos: ["transformers", "arquitetura transformer", "mecanismo de atenção", "Attention Is All You Need"],
    resumo:
      "A arquitetura de rede neural apresentada por pesquisadores do Google em 2017, baseada num mecanismo de atenção. É a base de praticamente todos os grandes modelos de linguagem.",
    texto: [
      "Para entender uma frase, é preciso saber como cada palavra se relaciona com as outras. Em o banco fechou porque ele estava sem dinheiro, quem é ele? O transformer resolve isso com a atenção: cada palavra olha para todas as outras e decide em quais prestar mais atenção.",
      "O artigo que apresentou a ideia, Attention Is All You Need, saiu em 2017. A grande vantagem prática foi o paralelismo: ao contrário dos modelos anteriores, que liam palavra por palavra, o transformer processa o texto inteiro de uma vez, o que casa perfeitamente com GPUs.",
      "Isso permitiu treinar modelos com bilhões de parâmetros em volumes enormes de texto. O G de GPT significa generative e o T, transformer.",
    ],
    exemplo:
      "Hipotético: ao traduzir uma frase longa, o modelo liga o verbo no fim da frase em alemão ao sujeito lá do começo, porque a atenção conecta as duas palavras diretamente.",
    naPratica:
      "Uma ideia publicada num artigo científico aberto virou, em cinco anos, a base de uma corrida de centenas de bilhões de dólares. É um lembrete de como a inovação pode mudar setores inteiros em pouco tempo, para cima e para baixo.",
    relacionados: ["modelo-de-linguagem", "aprendizado-profundo", "rede-neural", "gpu", "inteligencia-artificial"],
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
      "Complete a frase: o dólar subiu porque o mercado ficou... Você provavelmente pensou em nervoso ou preocupado. Um modelo de linguagem faz isso, palavra por palavra, depois de ter lido uma parte gigantesca do texto disponível.",
      "Com bilhões de parâmetros e a arquitetura transformer, prever a próxima palavra obriga o modelo a captar gramática, fatos, estilo e alguma forma de raciocínio. Depois do treinamento básico, ele é ajustado com exemplos e avaliações humanas para seguir instruções e ser útil.",
      "Modelos de linguagem também erram com confiança, o que se chama de alucinação: inventam fatos, números ou fontes que parecem plausíveis. Por isso funcionam melhor com conferência humana e com acesso a fontes confiáveis.",
    ],
    exemplo:
      "Hipotético: você pede a um modelo a inflação americana de um ano específico. Ele pode responder certo, ou dar um número plausível e errado. Conferir na fonte oficial continua necessário.",
    naPratica:
      "Modelos de linguagem já são ferramentas úteis para estudar finanças, resumir documentos e organizar ideias. Não substituem a checagem de números nem a decisão de quanto risco você aceita carregar.",
    relacionados: ["transformer", "inteligencia-artificial", "aprendizado-profundo", "gpu", "data-center"],
  },
];

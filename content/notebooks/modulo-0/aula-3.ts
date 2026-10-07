import type { SecaoDaAula } from "@/lib/notebook";

// Módulo I, aula 3 ("Menos de 1% do mundo, quase 100% do patrimônio"), com Rodolfo Bastos, cerca de
// 30 min. No Panda é a "AULA RODOLFO 01" (ele a chama de "aula 1 do módulo 1"); no curso, é a
// terceira aula do Módulo I. Seção escrita a partir da transcrição em
// `transcricoes/modulo-0/aula-3.txt` e do super dossiê (`_referencias-livros/dossie/`, seção
// "Aula 3" do RANKING-POR-AULA.md). Segue a ordem da fala: o mapa do módulo e a apresentação, o
// tamanho do Brasil no mundo, a crise como regra, Kahneman e os vieses, o home bias, dólar mais
// S&P contra o CDI, risco de crédito e de mercado, e a carteira 60/40 de 2008 a 2012.
// Tom reescrito em 07/out/2026 conforme docs/TOM-DO-NOTEBOOK.md (conversa, sem fórmulas no corpo).
//
// NÚMEROS CONFERIDOS EM 07/OUT/2026 nas fontes primárias citadas em cada bloco: BCB SGS 3696 (dólar
// de fim de mês) e 4391 (CDI mensal), retornos anuais do S&P 500 e do Treasury de 10 anos de Aswath
// Damodaran (NYU Stern; 2024 e 2025 pelas atualizações de jan/2025 e jan/2026), Tesouro Nacional
// (RMD dez/2025), Tesouro americano (relatório financeiro FY2025), SIFMA (Fact Book 2026), WFE
// (FY 2025), FMI (WEO abr/2026, como na aula 1) e Coeurdacier e Rey (2013, tabela 1). Janelas de
// retorno vão de dezembro a dezembro, até dez/2025, o último ano completo da base de Damodaran. Onde
// a aula cita um número diferente da fonte, o texto registra os dois, sem tom de errata: a fala foi
// gravada em outra data e, em alguns casos, com outro recorte (índice sem dividendos, por exemplo).

// Janelas da aula: desde 1994, desde 2000, 20, 15 e 10 anos (todas até dez/2025).
const janelas = ["Desde 1994", "Desde 2000", "20 anos", "15 anos", "10 anos"];
// Dólar comercial, venda, fim de período (SGS 3696): dez/1994 0,846; dez/1999 1,789; dez/2005
// 2,3407; dez/2010 1,6662; dez/2015 3,9048; dez/2025 5,5024. Variação média composta ao ano.
const dolarSerie = [6.2, 4.4, 4.4, 8.3, 3.5];
const dolarAula = [5.3, 4.1, 4.5, 8.3, 4.9];
// S&P 500 com dividendos (Damodaran), média composta em dólar: 11,0; 8,0; 10,9; 13,9; 14,7.
// Em reais, pela conta exata (1 + S&P) × (1 + dólar) − 1. CDI composto a partir da SGS 4391.
const spReais = [18.0, 12.8, 15.7, 23.4, 18.7];
const cdiJanela = [15.0, 12.1, 10.2, 9.7, 9.3];
// A soma citada na aula: variação do dólar + S&P, pelos números falados.
const somaAula = [14.4, 10.7, 10.8, 18.3, 16.1];

// Retornos anuais (Damodaran): S&P 500 com dividendos e Treasury de 10 anos. A carteira 60/40 é a
// combinação com 60% em ações e 40% em Treasury, rebalanceada todo ano: é a que reproduz os números
// da aula (−14% em 2008, +11% em 2009).
const anos0712 = ["2007", "2008", "2009", "2010", "2011", "2012"];
const sp0712 = [5.48, -36.55, 25.94, 14.82, 2.1, 15.89];
const tb0712 = [10.21, 20.1, -11.12, 8.46, 16.04, 2.97];
const c6040 = [7.37, -13.89, 11.12, 12.28, 7.68, 10.72];

// R$ 100 aplicados em jan/2009. "Trocando o pé": renda fixa em 2009 e 2010, ações em 2011, renda
// fixa de novo em 2012, como no roteiro da aula.
const marcos0912 = ["jan/2009", "dez/2009", "dez/2010", "dez/2011", "dez/2012"];

const secao: SecaoDaAula = {
  aula: 3,
  blocos: [
    // ---- 1. O mapa do módulo e a pergunta da aula -----------------------------------------------
    {
      tipo: "capitulo",
      id: "menos-de-um-por-cento",
      titulo: "Menos de 1% das alternativas, quase 100% do patrimônio",
      resumo: "O Brasil é uma fatia pequena do mundo e, mesmo assim, fica com quase todo o dinheiro do brasileiro. Por quê?",
      tempo: "0:00",
    },
    {
      tipo: "texto",
      capitular: true,
      paragrafos: [
        "Rodolfo Bastos se apresenta pela família, antes do currículo, e isso já diz muito sobre a aula. Depois vêm mais de 25 anos sentado diante de investidores: começou na Gap, gestora do Rio de Janeiro, foi para a XP, onde ajudou a montar o Private e comandou a operação nos Estados Unidos, a partir de Miami, e hoje toca a Oyster, que forma profissionais de investimento.",
        "Nas duas primeiras aulas, Felippe Hermes falou do país: moeda, dívida, juro. Rodolfo fala de você, o investidor. E a pergunta dele é incômoda: se o mundo está cada vez mais global, por que você deixa quase todo o seu dinheiro num país só? A resposta, ele avisa, não está na taxa de juros. Está no jeito como o seu cérebro decide.",
      ],
    },
    {
      tipo: "texto",
      tempo: "4:57",
      paragrafos: [
        "Comece pelo tamanho. O Brasil responde por menos de 2% do PIB do mundo. Na bolsa, a fatia é ainda menor: tudo o que está listado na B3 vale perto de 0,6% das bolsas do planeta. Na renda fixa, fica na casa de 1%.",
        "Na aula, o Rodolfo fala em 1,6% do PIB e 0,7% da renda variável. As fontes mais recentes dão números um pouco diferentes, mas contam a mesma história: quem investe só aqui escolhe entre mais ou menos 1% das alternativas do mundo.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Em qualquer régua, o Brasil é uma fatia pequena do mundo",
      subtitulo: "Fatia do Brasil no total mundial, em %",
      forma: "barra",
      eixoX: ["PIB", "Títulos de renda fixa", "Valor das bolsas", "Índice MSCI ACWI"],
      series: [{ nome: "Brasil", valores: [1.9, 1.0, 0.6, 0.5], destaque: true }],
      formato: { sufixo: "%", casas: 1 },
      referencia: { valor: 1, rotulo: "1%" },
      fonte:
        "FMI, World Economic Outlook, abr/2026 (PIB de 2025 em US$ correntes); Tesouro Nacional, Relatório Mensal da Dívida, dez/2025, e SIFMA, Capital Markets Fact Book 2026; levantamento Elos Ayta (B3, fim de 2025) e WFE, FY 2025 Market Highlights; MSCI, factsheet MSCI ACWI, 31/ago/2026",
      nota:
        "Renda fixa: só a dívida pública federal (R$ 8,64 trilhões, a R$ 5,50 por dólar) contra US$ 160,7 trilhões de títulos no mundo; com os papéis privados, a fatia sobe um pouco. Bolsas: R$ 4,78 trilhões contra US$ 151,9 trilhões. O MSCI ACWI é o índice global de ações mais usado por investidores estrangeiros. Na aula: 1,6% do PIB, menos de 1% da renda fixa e 0,7% da renda variável.",
    },
    {
      tipo: "texto",
      tempo: "5:48",
      paragrafos: [
        "Então por que o brasileiro concentra tanto? O Rodolfo fez essa pergunta em palestras, congressos e pesquisas, e a resposta quase sempre vem em duas partes.",
        "A primeira é o juro. Para que mandar dinheiro para um país onde o juro já foi zero, se aqui ele passa de 10% ao ano? Em setembro de 2026, a Selic estava em 13,75%; nos Estados Unidos, entre 3,75% e 4%. A segunda é o conforto do pós-fixado: a aplicação que rende todo mês, sem susto no extrato, parece retorno alto e garantido.",
        "O Rodolfo não compra essa explicação. Para mostrar por quê, ele faz um desvio pelo comportamento humano, porque é ali que, para ele, mora a resposta.",
      ],
    },

    // ---- 2. Crise é regra -------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "crise-e-regra",
      titulo: "Crise não é exceção, é regra",
      resumo: "Você monta a estratégia com calma e a desmonta no primeiro susto. O problema não é a crise, é a sua reação a ela.",
      tempo: "6:57",
    },
    {
      tipo: "texto",
      tempo: "7:48",
      paragrafos: [
        "No papel, a decisão de investir é racional. Você olha o cenário, ouve economistas, separa uma reserva, define quanto risco aguenta e monta a carteira. Aí chega a primeira crise de verdade. E crise, para o Rodolfo, não é a bolsa subir 20% quando você esperava 30%. É cair 30%, 40%, 50%. É ver o patrimônio encolher em dias.",
        "Nessa hora, quase todo mundo pede o resgate. E pensa em reais perdidos, não no pedaço da carteira que estava em risco.",
        "O exemplo é de um cliente real. Aos 55 anos, ele vendeu a empresa que tinha construído a vida inteira e, pela primeira vez, ficou com R$ 50 milhões na mão. Pôs uma parte na bolsa, veio uma crise e, em duas semanas, perdeu R$ 1 milhão. \"Perdi em duas semanas o que demorei 30 anos para fazer\", disse ao Rodolfo. Vendeu para \"defender os 49 que sobraram\" e ficou na renda fixa. Quando o mercado voltou e ele quis entrar de novo, a maior parte da alta já tinha passado.",
        "Repare na conta que a cabeça dele fez. R$ 1 milhão era 2% do patrimônio, mas pesou como um milhão inteiro. E perder doeu muito mais do que ganhar teria alegrado. Daniel Kahneman e Amos Tversky mediram isso: uma perda pesa mais que o dobro de um ganho do mesmo tamanho. É a aversão à perda.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Perder R$ 1 milhão dói mais do que o dobro do prazer de ganhar R$ 1 milhão",
      subtitulo: "Quanto pesa, na cabeça, ganhar ou perder até R$ 1 milhão; eixo em mil reais, escala ilustrativa",
      forma: "linha",
      eixoX: ["−1.000", "−750", "−500", "−250", "0", "+250", "+500", "+750", "+1.000"],
      series: [{ nome: "Valor sentido", valores: [-982, -762, -534, -290, 0, 129, 237, 339, 437], destaque: true }],
      formato: "numero",
      referencia: { valor: 0, rotulo: "Ponto de referência" },
      ilustrativo: true,
      fonte: "Tversky e Kahneman (1992), função de valor da teoria do prospecto, com curvatura de 0,88 e peso de 2,25 para as perdas",
      nota: "A curva desce mais depressa do lado das perdas do que sobe do lado dos ganhos. Os parâmetros são as estimativas medianas do estudo original, não uma medida de você.",
    },
    {
      tipo: "destaque",
      tempo: "10:27",
      texto: "Crise não é exceção, crise é regra. A gente não sabe se ela vai existir amanhã, daqui a um mês ou daqui a 10 anos, mas ela faz parte.",
      fonte: "Rodolfo Bastos, na aula, 10:27",
    },
    {
      tipo: "texto",
      paragrafos: [
        "O recado para quem pensa em dolarizar: se a crise vai vir, daqui ou de fora, sem data marcada, não adianta escolher a fatia em dólar pelo \"melhor momento\" do câmbio. A fatia tem de caber no seu estômago. Só quem não vende no fundo do poço pega a volta.",
        "Ajuda separar duas coisas. Uma é a capacidade de correr risco, que depende de patrimônio, renda e prazo. A outra é a disposição, que é temperamento. O cliente dos R$ 50 milhões tinha capacidade de sobra. Faltou uma carteira que coubesse na disposição dele.",
      ],
    },

    // ---- 3. Kahneman, o taco e a bola, e os vieses ------------------------------------------------
    {
      tipo: "capitulo",
      id: "sistema-1-e-sistema-2",
      titulo: "Sistema 1, sistema 2 e a lista de vieses",
      resumo: "O cérebro responde rápido e justifica depois. Em investimento quase nunca há pressa, e é aí que vale chamar o sistema 2.",
      tempo: "11:35",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Para explicar a reação do cliente, o Rodolfo chama Daniel Kahneman, psicólogo que ganhou o Nobel de Economia e escreveu \"Rápido e devagar\". Kahneman divide o pensamento em dois sistemas. O sistema 1 é rápido e emocional: é ele que faz você pular para trás quando ouve uma buzina na rua. O sistema 2 é lento e analítico, e muitas vezes só chega depois, para justificar o que o primeiro já decidiu.",
        "Só que investir não é atravessar a rua. Mandar dinheiro para fora ou trazer de volta não é questão de vida ou morte; dá tempo de pensar. Deixe o sistema 1 despertar a curiosidade e o sistema 2 fechar a conta. O erro mais comum, de investidores e de profissionais, é reagir.",
      ],
    },
    {
      tipo: "conceito",
      termo: "Sistema 1 e sistema 2",
      definicao:
        "Os dois jeitos de pensar descritos por Kahneman. O sistema 1 funciona no automático, rápido e sem esforço, e produz impressões e reações. O sistema 2 é o que faz conta e compara, mas cansa, e por isso costuma aceitar o que o sistema 1 sugere sem conferir, a não ser que algo pareça muito errado.",
      naPratica:
        "Uma queda forte da bolsa ou uma disparada do dólar acordam o sistema 1. A defesa é decidir antes, com calma, quanto do patrimônio fica em cada classe e em cada moeda, e combinar com você mesmo que todo susto passa por uma pausa e uma conta antes de virar ordem.",
      referencia: { autor: "Daniel Kahneman", obra: "Rápido e devagar: duas formas de pensar", capitulo: "Parte I, caps. 1 a 3", ano: 2012 },
    },
    {
      tipo: "conceito",
      tempo: "13:23",
      termo: "O problema do taco e da bola",
      definicao:
        "Um taco e uma bola custam R$ 1,10. O taco custa R$ 1,00 a mais que a bola. Quanto custa a bola? Se você pensou em 10 centavos, está em ótima companhia, e errou. Com a bola a 10 centavos, o taco custaria R$ 1,10 e os dois juntos, R$ 1,20. A conta só fecha com a bola a 5 centavos e o taco a R$ 1,05. Kahneman conta que mais da metade dos alunos de Harvard, MIT e Princeton dá a resposta errada; em universidades menos disputadas, mais de 80%.",
      naPratica:
        "O Rodolfo admite que ele e colegas que mexem com números o dia inteiro também caem nessa. Se a intuição tropeça numa conta de centavos, imagine numa decisão sobre o seu patrimônio, tomada com medo ou com euforia.",
      referencia: { autor: "Daniel Kahneman", obra: "Rápido e devagar: duas formas de pensar", capitulo: "cap. 3, a partir de Frederick (2005)", ano: 2012 },
    },
    {
      tipo: "texto",
      tempo: "14:16",
      paragrafos: [
        "Agora troque a bola pelo dólar. \"Não vou mandar agora, que está a 5,20; vou esperar voltar a 4,90.\" \"Está a 6, vou esperar 5,70.\" Isso se chama ancoragem: a última cotação que você viu vira a régua do preço justo.",
        "Num experimento famoso de Kahneman e Tversky, as pessoas giravam uma roleta viciada, que parava no 10 ou no 65, e depois chutavam quantos países da ONU eram africanos. Quem tinha visto o 10 respondia, tipicamente, 25%. Quem tinha visto o 65, 45%. Um número sem nada a ver com a pergunta puxou a resposta.",
        "O Rodolfo resume numa imagem: temos órgãos sensíveis, o cérebro, o pulmão, o coração e o bolso. E cita Peter Lynch, que ficou famoso gerindo o fundo Magellan, da Fidelity (na aula ele aparece como gestor de hedge fund): \"Todo mundo tem capacidade intelectual para ganhar dinheiro com ações. Nem todo mundo tem estômago.\" Outra leitura que ele recomenda é \"A psicologia financeira\", de Morgan Housel.",
        "Por fim, ele lista os vieses que vão aparecer no módulo. A tabela traduz cada um para a decisão de dolarizar e inclui um sétimo, a recência, que volta no fim da aula.",
      ],
    },
    {
      tipo: "tabela",
      tempo: "14:57",
      titulo: "Os vieses citados na aula e como eles aparecem na decisão de dolarizar",
      colunas: ["Viés", "O que é", "Como aparece na decisão de dolarizar"],
      linhas: [
        [
          "Busca por atalho",
          "Trocar uma pergunta difícil por uma fácil e responder a fácil, como no taco e na bola.",
          "\"O juro aqui é alto, então não preciso olhar para fora\": a taxa responde a uma pergunta que era sobre concentração de risco.",
        ],
        [
          "Ancoragem",
          "Um número visto antes, mesmo sem relação, puxa a estimativa seguinte.",
          "\"Vou esperar o dólar voltar a 4,90\": a cotação recente vira o preço justo, e a decisão fica para sempre adiada.",
        ],
        [
          "Manada",
          "Fazer o que os outros estão fazendo, por conforto ou por medo de ficar de fora.",
          "Dolarizar quando todo mundo fala de dólar, quase sempre depois de uma alta, e desistir quando o assunto esfria.",
        ],
        [
          "Aversão à perda",
          "Uma perda pesa cerca de duas vezes mais do que um ganho do mesmo tamanho.",
          "Vender na crise para \"defender o que sobrou\", como o cliente do milhão, ou não comprar por medo de ver a cotação cair no dia seguinte.",
        ],
        [
          "Home bias",
          "Preferir o que é familiar: o próprio país, o próprio setor, a própria moeda.",
          "Manter quase tudo em reais e na B3 porque é o que se conhece, num mercado que é cerca de 1% das alternativas do mundo.",
        ],
        [
          "Pico-fim",
          "A lembrança de uma experiência fica marcada pelo pior momento e pelo final, não pela média.",
          "Julgar o investimento lá fora pelo mês em que o dólar caiu logo depois da compra, e não pelo resultado de anos.",
        ],
        [
          "Recência",
          "Dar peso demais ao que acabou de acontecer e projetar isso para a frente.",
          "Comprar depois de uma disparada e vender depois de uma queda: é o investidor que \"troca o pé\", no fim da aula.",
        ],
      ],
      fonte:
        "Síntese da aula, com Kahneman (2012), Tversky e Kahneman (1974 e 1992) e Bodie, Kane e Marcus, Investments, cap. 12",
    },

    // ---- 4. Home bias -------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "home-bias",
      titulo: "Home bias: não é o juro, é o ser humano",
      resumo: "Investidores do mundo inteiro, com juro alto ou baixo, preferem o próprio país. O brasileiro só está no extremo.",
      tempo: "15:56",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Home bias é o conforto do conhecido. O dono de uma construtora que vendeu bem tende a pôr o dinheiro em crédito e em ações do setor imobiliário, porque sabe ler aquele balanço. O executivo de uma petroleira faz o mesmo com óleo e gás. Os dois esquecem um detalhe que a aula 1 já apontou: o salário ou o negócio deles já dependem daquele setor e daquele país. A carteira concentrada põe risco em cima de risco.",
        "O termo nasceu para falar de países. Americanos, japoneses e britânicos guardavam quase todas as ações em empresas de casa, bem acima do peso desses mercados no mundo. E até hoje ninguém achou um custo ou um imposto que explique um viés tão grande e tão teimoso.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "16:53",
      termo: "Home bias (viés doméstico)",
      definicao:
        "A mania de deixar no próprio país uma fatia da carteira muito maior do que o peso desse país no mundo. Dá para medir numa escala de zero a um: zero é quem investe com os pesos do mundo; um é quem deixa tudo em casa.",
      naPratica:
        "Em 2008, a bolsa brasileira era 1,6% do mundo, e o brasileiro tinha 99% das suas ações aqui. Na escala, isso dá 0,98, quase o máximo. A medida não aponta um alvo, e o curso não propõe um. Ela só mostra que ter tudo em casa já é uma aposta concentrada, e não um ponto de partida neutro.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 25, \"Home-Country Bias\", p. 886", ano: 2014 },
    },
    {
      tipo: "texto",
      paragrafos: [
        "É aqui que o Rodolfo responde à pergunta do começo. Se a culpa fosse do juro alto, a concentração seria coisa de brasileiro. Não é. Em Bangladesh, Índia, Turquia, Filipinas, Egito, Indonésia, Rússia, China e Arábia Saudita, a população também deixa quase tudo em casa, com juros e moedas bem diferentes. O que todos têm em comum é o home bias, um traço do ser humano, e não do brasileiro.",
        "Vale até para países ricos e de juro baixo. Em 2008, o americano tinha 77% das ações em empresas americanas, que eram um terço do mercado mundial. O canadense tinha 80% num mercado que pesava menos de 3% do mundo. O brasileiro estava no extremo, com 99%. O viés vem caindo devagar: pelos cálculos mais recentes da Vanguard, o canadense já está perto de 50% em casa.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "No mundo todo o investidor fica em casa, e o brasileiro fica mais do que quase todos",
      subtitulo: "Em %, 2008: peso do país no valor das bolsas do mundo e fatia de ações do próprio país na carteira dos residentes",
      forma: "barra",
      eixoX: ["Brasil", "China", "Coreia do Sul", "Canadá", "EUA", "Austrália", "Japão", "Reino Unido"],
      series: [
        { nome: "Ações do próprio país na carteira", valores: [99, 99.2, 89, 80.2, 77.2, 76.1, 73.5, 54.5], destaque: true },
        { nome: "Peso do país no mercado mundial", valores: [1.6, 7.8, 1.4, 2.7, 32.6, 1.8, 8.9, 5.1] },
      ],
      formato: { sufixo: "%", casas: 1 },
      fonte:
        "Coeurdacier e Rey (2013), \"Home Bias in Open Economy Financial Macroeconomics\", Journal of Economic Literature, tabela 1 (dados do FMI, Coordinated Portfolio Investment Survey, e da FIBV)",
      nota:
        "Dado mais recente com essa cobertura de países. Atualização parcial: Vanguard (2024), com o levantamento do FMI de 2023, estima 50% para o Canadá (2,6% do mercado mundial) e cerca de 81% para os EUA.",
    },

    // ---- 5. Dólar mais S&P contra o CDI -------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "dolar-mais-sp",
      titulo: "Dólar mais S&P contra o CDI",
      resumo: "Em reais, quem comprou bolsa americana somou dois ganhos, o da bolsa e o do dólar, e ficou acima do CDI em todas as janelas da aula.",
      tempo: "17:57",
    },
    {
      tipo: "texto",
      tempo: "18:48",
      paragrafos: [
        "Se a explicação não é o juro, falta mostrar que lá fora também tem retorno. O Rodolfo monta a conta em duas camadas.",
        "A primeira é o câmbio. Desde o Plano Real, o dólar subiu em média entre 5% e 6% ao ano contra o real; nos 15 anos até 2025, mais de 8%. Nunca em linha reta: \"vai 10, cai 8, sobe 5\". Os números da aula e os do Banco Central diferem um pouco por causa da data de corte, e o gráfico mostra os dois.",
        "Quem leva o dinheiro e deixa parado numa conta americana fica só com essa camada. Mas ninguém precisa deixar parado. A segunda camada é quanto o dinheiro rende lá, e o Rodolfo escolhe o S&P 500, o índice das maiores empresas americanas, por um motivo cultural: o americano vive na bolsa. Somando ações e fundos, que em boa parte também são de ações, passa de 70% do dinheiro aplicado pelas famílias americanas.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "O dólar subiu contra o real em todas as janelas da aula",
      subtitulo: "Variação média do dólar comercial em reais, % ao ano",
      forma: "barra",
      eixoX: janelas,
      series: [
        { nome: "Série do Banco Central, até dez/2025", valores: dolarSerie, destaque: true },
        { nome: "Citado na aula", valores: dolarAula },
      ],
      formato: { sufixo: "% a.a.", casas: 1 },
      fonte: "Banco Central do Brasil, SGS 3696 (dólar comercial, venda, fim de período)",
      nota:
        "Janelas de dezembro a dezembro: desde dez/1994, dez/1999, dez/2005, dez/2010 e dez/2015, até dez/2025 (R$ 5,50). A partir de jul/1994, a média é de 5,8% ao ano. É uma média: no caminho houve anos de alta e de queda.",
    },
    {
      tipo: "texto",
      tempo: "21:37",
      paragrafos: [
        "Agora a bolsa. Na aula, o S&P rende de 6% a 11% ao ano em dólar, conforme a janela. Com os dividendos incluídos, a base do professor Aswath Damodaran, da NYU, dá números maiores, de 8% a quase 15%. A diferença vem quase toda daí: sem os dividendos, a conta desde 1994 bate exatamente com os 9,1% da aula.",
        "Some as duas camadas e você chega à conclusão do Rodolfo: uns 4,5% do câmbio mais uns 9% da bolsa dão algo entre 13% e 15% ao ano em reais. É a mesma régua do CDI com que o brasileiro está acostumado.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "22:31",
      termo: "Retorno em reais de um ativo em dólar",
      definicao:
        "Quando você investe em dólar e mede o resultado em reais, carrega duas apostas ao mesmo tempo: o ativo e a própria moeda. Os dois ganhos não só se somam, eles se multiplicam, porque o dólar também valoriza o que o ativo rendeu. Por isso a soma simples é só uma aproximação, boa quando os números são pequenos.",
      naPratica:
        "Se o S&P sobe 10% e o dólar sobe 5%, você ganha um pouco mais de 15% em reais, porque o ganho em dólar também se valoriza. A lógica vale para baixo. Em 2008, o S&P caiu 37% em dólar e o dólar subiu 32% contra o real. A soma sugere uma perda perto de 5%; na conta certa, ela foi de 16%. Câmbio e bolsa podem se compensar, como ali, ou se somar contra você, num ano de bolsa em queda e real forte.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 25, seção 25.2, risco cambial", ano: 2014 },
    },
    {
      tipo: "grafico",
      titulo: "Em reais, S&P mais dólar ficou acima do CDI nas cinco janelas, por margens muito diferentes",
      subtitulo: "Retorno médio em reais, % ao ano, até dez/2025, antes de impostos e custos",
      forma: "barra",
      eixoX: janelas,
      series: [
        { nome: "S&P 500 com dividendos, em reais (conta exata)", valores: spReais, destaque: true },
        { nome: "CDI", valores: cdiJanela },
        { nome: "Soma citada na aula", valores: somaAula },
      ],
      formato: { sufixo: "% a.a.", casas: 1 },
      fonte:
        "Aswath Damodaran, NYU Stern, Historical Returns on Stocks, Bonds and Bills (S&P 500 com dividendos; 2024 e 2025 pelas atualizações de jan/2025 e jan/2026); Banco Central do Brasil, SGS 3696 (dólar) e SGS 4391 (CDI)",
      nota:
        "Janelas de dezembro a dezembro, como no gráfico do câmbio. Desde 2000, a vantagem é de menos de 1 ponto por ano; a janela de 15 anos começa com o real muito forte (R$ 1,67 por dólar). O resultado muda bastante conforme o período, e o passado não garante a repetição.",
    },
    {
      tipo: "kpis",
      titulo: "2008 em reais: quando a bolsa caiu, o dólar amorteceu",
      itens: [
        { rotulo: "S&P 500 em dólar", valor: -36.55, formato: { base: "pct", sinal: true }, nota: "com dividendos" },
        { rotulo: "Dólar em reais", valor: 31.94, formato: { base: "pct", sinal: true }, nota: "R$ 1,77 para R$ 2,34" },
        { rotulo: "S&P 500 em reais", valor: -16.28, formato: { base: "pct", sinal: true }, destaque: true, nota: "bolsa e dólar juntos" },
        { rotulo: "Ibovespa", valor: -41.22, formato: { base: "pct", sinal: true }, nota: "em reais" },
      ],
      fonte: "Aswath Damodaran, NYU Stern (S&P 500); Banco Central do Brasil, SGS 3696 (dólar de fim de período, dez/2007 e dez/2008); B3 (Ibovespa)",
      nota: "As bolsas caíram juntas no mundo, e o que protegeu quem mora no Brasil foi a moeda, não a bolsa de fora. Não há garantia de que o padrão se repita.",
    },
    {
      tipo: "simulador",
      id: "cdi-contra-dolar-mais-bolsa",
      titulo: "Uma parte em reais, outra em dólar",
      descricao:
        "Compare quem deixou tudo em reais com quem mandou uma fatia de cada aporte para o dólar. Mexa no rendimento de cada lado e na perda anual do real para ver quanto do resultado vem da bolsa e quanto vem do câmbio.",
      modelo: "jurosCompostos",
      parametros: {
        taxaBrl: {
          valor: 10,
          rotulo: "Rendimento em reais (CDI)",
          ajuda: "O CDI rendeu 9,3% ao ano de 2016 a 2025 e 12,1% de 2000 a 2025 (BCB, SGS 4391).",
        },
        taxaUsd: {
          valor: 8,
          rotulo: "Rendimento em dólar (bolsa americana)",
          ajuda: "O S&P 500 com dividendos rendeu 8,0% ao ano em dólar de 2000 a 2025 e 14,7% de 2016 a 2025 (Damodaran), com anos de queda forte no caminho.",
        },
        cambio: { valor: 5.18, ajuda: "Fim de agosto de 2026: R$ 5,18 (BCB, SGS 3696)." },
        depreciacao: {
          valor: 4,
          ajuda: "De dez/1999 a dez/2025, o real perdeu em média 4,4% ao ano contra o dólar; nos últimos dez anos, 3,5%. O passado não define o futuro.",
        },
        fatia: { ajuda: "Valor de exemplo para a conta, não uma recomendação de alocação." },
      },
      aviso:
        "Taxas constantes, sem imposto, IOF, custo de câmbio ou volatilidade. Na vida real, a bolsa e o dólar oscilam muito de um ano para o outro, e o rendimento em reais também carrega risco de crédito.",
    },

    // ---- 6. Risco de crédito e risco de mercado -----------------------------------------------------
    {
      tipo: "capitulo",
      id: "dois-riscos",
      titulo: "Risco de crédito e risco de mercado",
      resumo: "O pós-fixado não oscila, mas não é livre de risco. E a renda fixa americana oscila, às vezes tanto quanto a bolsa.",
      tempo: "23:44",
    },
    {
      tipo: "texto",
      paragrafos: [
        "\"Legal, Rodolfo, mas lá fora tem risco e aqui não.\" Calma. A palavra risco mistura duas coisas. Risco de mercado é a oscilação: o preço de uma ação, do dólar ou de um título prefixado sobe e desce todo dia. Risco de crédito é a chance de quem emitiu o título não pagar, ou de o mercado passar a duvidar e derrubar o preço do papel.",
        "O pós-fixado brasileiro quase não oscila, é verdade. Mas tem risco de crédito, seja do governo, do banco ou da empresa. Não existe aplicação sem risco. Existe a escolha de qual risco carregar, e em que dose.",
        "O Rodolfo faz questão da ressalva: ele não diz que um risco é melhor que o outro, nem que investir lá fora é melhor que investir aqui. Diz que diversificar além de 1% das alternativas do mundo é saudável, e que o retorno não precisa ser menor. O erro é comparar 15% com 4% como se os dois números medissem a mesma coisa.",
      ],
    },
    {
      tipo: "comparativo",
      titulo: "O pós-fixado não oscila; a renda fixa americana oscila, e às vezes cai junto com a bolsa",
      subtitulo: "Retornos anuais nominais de 2000 a 2024, cada um na sua moeda",
      opcoes: [
        { nome: "Pós-fixado (CDI)", resumo: "em reais" },
        { nome: "Treasury de 10 anos", resumo: "em dólar", destaque: true },
        { nome: "S&P 500", resumo: "em dólar, com dividendos" },
      ],
      metricas: [
        { rotulo: "Anos com retorno negativo", valores: [0, 6, 6], formato: "numero", melhor: "menor" },
        { rotulo: "Pior ano", valores: [2.75, -17.83, -36.55], formato: { base: "pct", sinal: true }, melhor: "maior" },
        { rotulo: "Retorno em 2008", valores: [12.38, 20.1, -36.55], formato: { base: "pct", sinal: true }, melhor: "maior" },
        { rotulo: "Retorno em 2022", valores: [12.38, -17.83, -18.04], formato: { base: "pct", sinal: true }, melhor: "maior" },
      ],
      fonte: "Banco Central do Brasil, SGS 4391 (CDI); Aswath Damodaran, NYU Stern, Historical Returns on Stocks, Bonds and Bills",
      nota:
        "Os números medem só a oscilação. O CDI não mostra o risco de crédito de quem emite o título, o outro risco da aula. Por coincidência, o CDI rendeu 12,38% tanto em 2008 quanto em 2022.",
    },
    {
      tipo: "texto",
      tempo: "20:26",
      paragrafos: [
        "Mais cedo na aula, o Rodolfo disse que o pós-fixado, com seu \"1% ao mês\" constante, só existe no Brasil. Vale um ajuste fino. Os Estados Unidos também têm títulos que acompanham o juro de curto prazo e fundos parecidos com os nossos fundos DI. O que muda é o tamanho: quase metade da dívida pública brasileira segue a Selic; na americana, pouco mais de 2%.",
        "Por isso a renda fixa de lá oscila. O americano compra títulos e fundos cujo preço muda todo dia, e vê isso no extrato. Em 2022, o título de 10 anos do Tesouro americano perdeu quase 18%, praticamente o mesmo que a bolsa. Se as duas oscilam e a bolsa costuma render mais no longo prazo, faz sentido ele ter se acostumado com ações.",
        "Aqui, parte dessa oscilação fica escondida. O Tesouro Direto mostra o sobe e desce dos títulos todos os dias, mas o CDB levado ao vencimento costuma aparecer no extrato \"pela curva\", subindo devagar como se o mercado não tivesse mudado.",
      ],
    },
    {
      tipo: "kpis",
      titulo: "O tamanho do pós-fixado na dívida pública",
      itens: [
        { rotulo: "Brasil: dívida federal atrelada à Selic", valor: 48.3, formato: { sufixo: "%", casas: 1 }, destaque: true, nota: "dez/2025, de um estoque de R$ 8,64 trilhões" },
        { rotulo: "EUA: títulos de juro flutuante na dívida negociável", valor: 2.3, formato: { sufixo: "%", casas: 1 }, nota: "set/2025, US$ 690 bilhões de US$ 29,7 trilhões" },
      ],
      fonte:
        "Tesouro Nacional, Relatório Mensal da Dívida Pública Federal, dez/2025; U.S. Department of the Treasury, Financial Report FY2025, nota 12 (dívida federal)",
      nota: "Os títulos de juro flutuante do Tesouro americano existem desde janeiro de 2014.",
    },
    {
      tipo: "conceito",
      termo: "Marcação a mercado",
      definicao:
        "É olhar quanto o seu título vale hoje, se você precisasse vender, e não quanto ele vai pagar no vencimento. Se você segura até o fim, recebe a taxa combinada, desde que o emissor pague. Se vende antes, recebe o preço do dia, que cai quando os juros sobem e sobe quando eles caem. A marcação na curva faz o contrário: atualiza o título pela taxa da compra, como se nada tivesse mudado.",
      naPratica:
        "Imagine um título prefixado que paga tudo daqui a dez anos, comprado a 4% ao ano. Se os juros do mercado sobem para 5%, ele passa a valer cerca de 9% menos hoje. O extrato marcado na curva esconde essa perda, mas ela aparece se você precisar vender antes do prazo.",
      referencia: { autor: "Alexandre Assaf Neto", obra: "Mercado Financeiro", capitulo: "cap. 4, marcação a mercado e preço na curva", ano: 2014 },
    },

    // ---- 7. Ancoragem e o investidor que troca o pé ---------------------------------------------------
    {
      tipo: "capitulo",
      id: "trocar-o-pe",
      titulo: "Ancoragem e o investidor que troca o pé",
      resumo: "Decidir olhando o retrovisor faz você chegar sempre um ano atrasado à classe que acabou de subir.",
      tempo: "25:26",
    },
    {
      tipo: "texto",
      paragrafos: [
        "A última parte volta à ancoragem com a pergunta que todo investidor se faz: qual é a hora certa? Mando agora? Espero o dólar cair, a eleição passar, a guerra acabar? E a dúvida não é só de quem vai dolarizar; aparece em qualquer decisão de pôr mais ou menos risco na carteira.",
        "Para mostrar quanto ela custa, o Rodolfo usa índices americanos: o S&P 500 como bolsa, o título de 10 anos do Tesouro como renda fixa e uma carteira moderada com os dois. Índices, e não fundos, para que a habilidade de nenhum gestor entre na conta.",
        "Imagine janeiro de 2009. Você recebeu um bônus ou vendeu um imóvel e decidiu montar uma carteira moderada. Aí olha para trás. Em 2008, a bolsa caiu 37% e a moderada, 14%, enquanto a renda fixa subiu 20%. Ancorado nisso, você vai para a renda fixa, \"só até a bolsa melhorar\". \"Normal, gente, eu já fiz isso, todo mundo já fez isso\", diz o Rodolfo.",
        "Um detalhe: na fala, a moderada aparece como 60% em renda fixa e 40% em ações, mas os números mostrados (−14% em 2008, +11% em 2009) são os da combinação inversa, com 60% em ações, que é o \"60/40\" clássico do mercado americano. Os gráficos usam essa versão.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "27:48",
      titulo: "De 2008 a 2012, a classe vencedora mudou de lado quase todo ano",
      subtitulo: "Retorno anual em dólar, %",
      forma: "barra",
      eixoX: anos0712,
      series: [
        { nome: "S&P 500, com dividendos", valores: sp0712 },
        { nome: "Treasury de 10 anos", valores: tb0712 },
        { nome: "Carteira 60/40 (60% em ações)", valores: c6040, destaque: true },
      ],
      formato: { sufixo: "%", casas: 1 },
      marcos: [{ em: "2009", rotulo: "Decisão em jan/2009" }],
      fonte: "Aswath Damodaran, NYU Stern, Historical Returns on Stocks, Bonds and Bills",
      nota: "Carteira rebalanceada para 60% em S&P 500 e 40% em Treasury de 10 anos no início de cada ano. Com 60% em Treasury, como descrito na fala, ela teria caído cerca de 2,6% em 2008.",
    },
    {
      tipo: "texto",
      tempo: "28:53",
      paragrafos: [
        "Daí em diante, é uma troca atrás da outra. Em 2009, a renda fixa perde 11% e a bolsa sobe 26%; você respira fundo e espera. Em 2010, renda fixa mais 8%, bolsa mais 15%. Com a bolsa perto de 40% acima em dois anos, você decide que chegou a hora e vai para as ações em 2011, justo o ano em que elas sobem 2% e a renda fixa, 16%. \"Não sou de renda variável\", você conclui, e volta para a renda fixa em 2012, quando ela rende 3% e a bolsa, 16%.",
        "Resultado: quem aplicou R$ 100 em janeiro de 2009 e foi trocando o pé terminou 2012 com uns R$ 101. A carteira moderada, sem nenhuma decisão além de rebalancear uma vez por ano, chegou a R$ 149. Você não escolheu a pior classe. Escolheu, todo ano, a que tinha acabado de ganhar, e ficou com o pior das duas. Isso tem nome: viés de recência, dar peso demais ao que acabou de acontecer.",
        "Na próxima aula, o Rodolfo volta ao tema por outro lado: quanto custa tentar acertar a hora de entrar e de sair.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Quem trocou o pé terminou 2012 quase onde começou",
      subtitulo: "Valor de R$ 100 aplicados em jan/2009, em dólar, fim de cada ano",
      forma: "linha",
      eixoX: marcos0912,
      series: [
        { nome: "Trocando o pé", valores: [100, 88.9, 96.4, 98.4, 101.3], destaque: true },
        { nome: "Carteira 60/40", valores: [100, 111.1, 124.8, 134.3, 148.7] },
        { nome: "Só S&P 500", valores: [100, 125.9, 144.6, 147.6, 171.1] },
        { nome: "Só Treasury de 10 anos", valores: [100, 88.9, 96.4, 111.9, 115.2] },
      ],
      formato: { casas: 1 },
      referencia: { valor: 100, rotulo: "Valor aplicado" },
      fonte: "Aswath Damodaran, NYU Stern, Historical Returns on Stocks, Bonds and Bills; trajetórias calculadas a partir dos retornos anuais",
      nota:
        "\"Trocando o pé\": Treasury em 2009 e 2010, S&P 500 em 2011 e Treasury em 2012, como no roteiro da aula. Sem impostos, custos ou câmbio.",
    },

    // ---- referências ------------------------------------------------------------------------------
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Daniel Kahneman",
          titulo: "Rápido e devagar: duas formas de pensar",
          ano: 2012,
          nota: "Original de 2011. Os dois sistemas e o taco e a bola (Parte I), ancoragem (cap. 11), teoria do prospecto (Parte IV) e pico-fim (cap. 35).",
        },
        {
          autor: "Amos Tversky e Daniel Kahneman",
          titulo: "Judgment under Uncertainty: Heuristics and Biases",
          ano: 1974,
          nota: "Science, vol. 185. O experimento da roleta e a ancoragem.",
        },
        {
          autor: "Amos Tversky e Daniel Kahneman",
          titulo: "Advances in Prospect Theory: Cumulative Representation of Uncertainty",
          ano: 1992,
          nota: "Journal of Risk and Uncertainty. Os parâmetros da curva de ganhos e perdas (0,88 e 2,25).",
        },
        {
          autor: "Shane Frederick",
          titulo: "Cognitive Reflection and Decision Making",
          ano: 2005,
          nota: "Journal of Economic Perspectives. O teste que inclui o problema do taco e da bola.",
        },
        {
          autor: "Morgan Housel",
          titulo: "A psicologia financeira",
          ano: 2021,
          nota: "Original de 2020. Leitura recomendada na aula.",
        },
        {
          autor: "Peter Lynch e John Rothchild",
          titulo: "Beating the Street",
          ano: 1993,
          nota: "A frase sobre capacidade intelectual e estômago citada na aula.",
        },
        {
          autor: "Zvi Bodie, Alex Kane e Alan J. Marcus",
          titulo: "Investments, 10ª edição",
          ano: 2014,
          nota: "Capacidade e disposição para o risco (cap. 6), vieses (cap. 12, p. 389 a 395), home bias e risco cambial (cap. 25, p. 886).",
        },
        {
          autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen",
          titulo: "Princípios de Finanças Corporativas, 10ª edição",
          ano: 2013,
          nota: "Finanças comportamentais (cap. 13, p. 297 e 298) e o enigma do home bias (cap. 27, p. 642 e 643).",
        },
        {
          autor: "Alexandre Assaf Neto",
          titulo: "Mercado Financeiro, 12ª edição",
          ano: 2014,
          nota: "A crise de 2008 no Brasil (cap. 2); CDI, marcação a mercado e preço na curva (cap. 4).",
        },
        {
          autor: "Kenneth R. French e James M. Poterba",
          titulo: "Investor Diversification and International Equity Markets",
          ano: 1991,
          nota: "American Economic Review. O artigo que deu nome ao home bias.",
        },
        {
          autor: "Nicolas Coeurdacier e Hélène Rey",
          titulo: "Home Bias in Open Economy Financial Macroeconomics",
          ano: 2013,
          nota: "Journal of Economic Literature. Tabela 1, home bias por país em 2008.",
        },
        {
          autor: "Aswath Damodaran (NYU Stern)",
          titulo: "Historical Returns on Stocks, Bonds and Bills: 1928 a 2025",
          ano: 2026,
          nota: "Retornos anuais do S&P 500 com dividendos e do Treasury de 10 anos. Base dos gráficos de janelas e da carteira 60/40.",
        },
        {
          autor: "Banco Central do Brasil, Tesouro Nacional, SIFMA e WFE",
          titulo: "Séries SGS 3696 e 4391; Relatório Mensal da Dívida; Capital Markets Fact Book 2026; FY 2025 Market Highlights",
          ano: 2026,
          nota: "Câmbio, CDI, composição da dívida pública, tamanho dos mercados de renda fixa e de ações e carteira das famílias americanas.",
        },
      ],
    },
  ],
};

export default secao;

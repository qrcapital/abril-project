import type { SecaoDaAula } from "@/lib/notebook";

// Módulo I, aula 3 ("Menos de 1% do mundo, quase 100% do patrimônio"), com Rodolfo Bastos, cerca de
// 30 min. No Panda é a "AULA RODOLFO 01" (ele a chama de "aula 1 do módulo 1"); no curso, é a
// terceira aula do Módulo I. Seção escrita a partir da transcrição em
// `transcricoes/modulo-0/aula-3.txt` e do super dossiê (`_referencias-livros/dossie/`, seção
// "Aula 3" do RANKING-POR-AULA.md). Segue a ordem da fala: o mapa do módulo e a apresentação, o
// tamanho do Brasil no mundo, a crise como regra, Kahneman e os vieses, o home bias, dólar mais
// S&P contra o CDI, risco de crédito e de mercado, e a carteira 60/40 de 2008 a 2012.
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
      resumo: "O Brasil é uma fatia pequena do mundo, e mesmo assim concentra quase toda a carteira do brasileiro. A aula pergunta por quê.",
      tempo: "0:00",
    },
    {
      tipo: "texto",
      capitular: true,
      tempo: "0:00",
      paragrafos: [
        "Rodolfo Bastos abre a segunda metade do Módulo I com um roteiro de quatro temas: por que dolarizar ativos, o dólar como reserva de valor, a conta internacional na prática e a carteira global ajustada ao perfil do investidor. Esta é a primeira das duas aulas dele, e o ponto de vista é o de quem passou a carreira sentado diante de clientes. Foram 15 anos na Gap Asset Management, gestora do Rio de Janeiro, e 10 na XP, onde ajudou a montar o Private por volta de 2015, comandou a operação americana como CEO, com sede em Miami, de 2019 a 2024, e voltou para chefiar o Private B2B, a rede de assessores que atende clientes com mais de R$ 10 milhões. Em 2025 fundou a Oyster, voltada à formação de profissionais de investimento.",
        "Esse histórico explica o ângulo da aula. Felippe Hermes, nas duas primeiras, tratou do país: moeda, dívida, juro, demografia. Rodolfo trata do investidor. A pergunta que atravessa os trinta minutos é por que pessoas que vivem num mundo cada vez mais global mantêm quase todo o patrimônio num único país, e a resposta que ele defende não está na taxa de juros, e sim na forma como o cérebro humano decide.",
      ],
    },
    {
      tipo: "texto",
      tempo: "4:57",
      paragrafos: [
        "O ponto de partida é o tamanho do Brasil. Na aula, o país aparece com 1,6% do PIB global, um pouco menos de 1% da renda fixa e 0,7% da renda variável do mundo. As fontes atuais contam a mesma história com números um pouco diferentes. Pelo FMI, o PIB brasileiro foi cerca de 1,9% do mundial em 2025, medido em dólar corrente; a fatia oscila com o câmbio e ficou abaixo de 2% nos anos de real mais fraco. Na renda fixa, só a dívida pública federal, R$ 8,6 trilhões no fim de 2025, equivale a perto de 1% dos US$ 160,7 trilhões em títulos em circulação no mundo segundo a SIFMA; com os papéis privados, a fatia fica na casa de 1%. Sem grau de investimento, porém, o Brasil fica fora dos grandes índices globais de renda fixa usados por investidores estrangeiros.",
        "Nas ações, as empresas listadas na B3 valiam R$ 4,78 trilhões no fim de 2025, cerca de US$ 870 bilhões, ou 0,6% dos US$ 151,9 trilhões das bolsas do mundo contados pela WFE. No MSCI ACWI, o índice global que pondera as empresas pelas ações em livre circulação, o peso brasileiro é ainda menor, perto de 0,5%, como mostrou a aula 1. Qualquer que seja a régua, a conclusão de Rodolfo se mantém: o brasileiro que investe só aqui escolhe entre algo como 1% das alternativas disponíveis no planeta.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "4:57",
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
        "Renda fixa: só a dívida pública federal (R$ 8,64 trilhões, convertida a R$ 5,50) contra US$ 160,7 trilhões de títulos no mundo; os papéis privados elevariam um pouco a fatia. Bolsas: R$ 4,78 trilhões contra US$ 151,9 trilhões. Na aula: 1,6% do PIB, menos de 1% da renda fixa e 0,7% da renda variável.",
    },
    {
      tipo: "texto",
      tempo: "5:48",
      paragrafos: [
        "Por que, então, o brasileiro concentra? Rodolfo conta que fez a pergunta em palestras, congressos e pesquisas, e a resposta mais comum tem duas partes. A primeira é o juro: com a Selic na casa de 10% a 15% ao ano, para que aplicar num país onde o juro básico já foi zero e hoje gira em torno de 3% a 4%? Em setembro de 2026, a Selic estava em 13,75% ao ano e o juro básico americano, na faixa de 3,75% a 4%. A segunda é o pós-fixado: a aplicação que rende todo mês, sem sobressalto no extrato, dá ao investidor a sensação de um retorno alto e garantido.",
        "Rodolfo não aceita essa explicação, e a aula é construída para mostrar por quê. Antes de responder, porém, ele faz um desvio pelo comportamento humano, porque é ali que está, para ele, a causa da concentração.",
      ],
    },

    // ---- 2. Crise é regra -------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "crise-e-regra",
      titulo: "Crise não é exceção, é regra",
      resumo: "O investidor monta a estratégia com calma e a desfaz no primeiro susto. O problema não é a crise, é a reação a ela.",
      tempo: "6:57",
    },
    {
      tipo: "texto",
      tempo: "7:48",
      paragrafos: [
        "O roteiro de uma decisão de investimento costuma ser racional: olhar o cenário econômico e político, ouvir economistas, separar a reserva de liquidez, definir quanto risco se aceita e montar a alocação entre pós-fixado, prefixado, inflação, multimercado e exterior. O problema aparece na primeira crise de verdade, e Rodolfo é preciso sobre o que entende por crise: não uma bolsa que sobe 20% quando se esperava 30%, mas quedas de 30%, 40%, 50%, ou a marcação forte para baixo de uma carteira concentrada em crédito privado. Nesse momento o investidor pede o resgate, e pensa em reais perdidos, não no percentual da carteira que estava em risco.",
        "O exemplo é de um cliente real. Aos 55 anos, depois de construir uma empresa sem tirar dividendos e de viver como classe média, ele vendeu o negócio e passou a ter R$ 50 milhões em liquidez pela primeira vez na vida. Pôs uma parte em renda variável, veio uma crise e, em duas semanas, perdeu R$ 1 milhão, o equivalente a 2% do patrimônio. \"Perdi em duas semanas o que demorei 30 anos para fazer\", disse ao assessor. Vendeu para defender os R$ 49 milhões restantes, ficou na renda fixa e, quando o mercado se recuperou e ele quis voltar, a maior parte da alta já tinha passado.",
        "O episódio ilustra a teoria do prospecto de Daniel Kahneman e Amos Tversky, que os livros-texto de investimento tratam como a base das finanças comportamentais. Duas ideias explicam a reação do cliente. As pessoas avaliam ganhos e perdas a partir de um ponto de referência, e não pelo patrimônio total: o milhão perdido pesou como milhão, e não como 2% de 50. E uma perda dói mais do que um ganho do mesmo tamanho alegra; nas estimativas de Tversky e Kahneman, cerca de 2,25 vezes mais.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "9:05",
      titulo: "Perder R$ 1 milhão dói mais do que o dobro do prazer de ganhar R$ 1 milhão",
      subtitulo: "Valor subjetivo de um ganho ou de uma perda, em unidades arbitrárias; eixo em mil reais",
      forma: "linha",
      eixoX: ["−1.000", "−750", "−500", "−250", "0", "+250", "+500", "+750", "+1.000"],
      series: [{ nome: "Valor sentido", valores: [-982, -762, -534, -290, 0, 129, 237, 339, 437], destaque: true }],
      formato: "numero",
      referencia: { valor: 0, rotulo: "Ponto de referência" },
      ilustrativo: true,
      fonte: "função de valor de Tversky e Kahneman (1992): v(x) = x^0,88 nos ganhos e −2,25 × (−x)^0,88 nas perdas",
      nota: "A curva é côncava nos ganhos e convexa nas perdas, e mais inclinada do lado das perdas. Os parâmetros são as estimativas medianas do estudo original, não uma medida do aluno.",
    },
    {
      tipo: "destaque",
      tempo: "10:27",
      texto: "Crise não é exceção, crise é regra. A gente não sabe se ela vai existir amanhã, daqui a um mês ou daqui a 10 anos, mas ela faz parte.",
      fonte: "Rodolfo Bastos, na aula, 10:27",
    },
    {
      tipo: "texto",
      tempo: "10:27",
      paragrafos: [
        "A consequência prática vale diretamente para quem pensa em internacionalizar. Se a crise vai acontecer, brasileira ou internacional, sem data marcada, não faz sentido escolher a fatia em dólar pelo \"melhor ou pior momento\" do câmbio. A fatia precisa ser racional, ou seja, compatível com o que o estômago do investidor aguenta em volatilidade e em risco de crédito, porque só quem não vende no fundo do poço está posicionado para pegar a volta.",
        "Bodie, Kane e Marcus fazem a mesma distinção em termos mais técnicos: uma coisa é a capacidade de correr risco, que depende de patrimônio, renda e prazo; outra é a disposição, que é temperamental e difícil de medir. Os questionários de perfil capturam a segunda de forma imprecisa, e a prova real é quanto do patrimônio a pessoa suporta ver cair, por meses, sem desistir. O cliente dos R$ 50 milhões tinha capacidade de sobra; o que faltou foi uma alocação que coubesse na disposição dele.",
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
      tempo: "11:35",
      paragrafos: [
        "Para explicar a reação do cliente, Rodolfo recorre a Daniel Kahneman, psicólogo que recebeu o Nobel de Economia em 2002 e resumiu décadas de pesquisa em \"Rápido e devagar: duas formas de pensar\" (2011; no Brasil, 2012). O livro organiza o pensamento em dois sistemas. O sistema 1 é rápido, automático, intuitivo e emocional: é ele que faz o pedestre pular para trás ao ouvir uma buzina. O sistema 2 é lento, deliberado e analítico, e muitas vezes chega depois, para justificar o que o sistema 1 já decidiu.",
        "A sugestão da aula é usar cada um no seu papel. Investir ou resgatar, mandar dinheiro para fora ou trazê-lo de volta não é uma situação de vida ou morte; dá tempo de chamar o sistema 2. O sistema 1 pode servir de gatilho de curiosidade, mas quem fecha o raciocínio deve ser o segundo. O erro mais comum, de investidores e de profissionais, é reagir.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "11:35",
      termo: "Sistema 1 e sistema 2",
      definicao:
        "Dois modos de pensamento descritos por Kahneman. O sistema 1 opera de forma automática e rápida, com pouco ou nenhum esforço e sem sensação de controle voluntário; produz impressões, intuições e reações. O sistema 2 aloca atenção às atividades mentais que exigem esforço, como cálculos e comparações, e costuma aceitar as sugestões do sistema 1 sem conferi-las, a menos que algo pareça errado.",
      naPratica:
        "Uma queda forte da bolsa ou uma disparada do dólar acionam o sistema 1. A defesa é ter decidido antes, com calma, quanto do patrimônio fica em cada classe e em cada moeda, e combinar consigo mesmo que a reação a um susto passa por uma pausa e por uma conta.",
      referencia: { autor: "Daniel Kahneman", obra: "Rápido e devagar: duas formas de pensar", capitulo: "Parte I, caps. 1 a 3", ano: 2012 },
    },
    {
      tipo: "conceito",
      tempo: "13:23",
      termo: "O problema do taco e da bola",
      definicao:
        "Um taco e uma bola custam R$ 1,10. O taco custa R$ 1,00 a mais que a bola. Quanto custa a bola? A resposta que vem à cabeça, R$ 0,10, está errada: com ela, o taco custaria R$ 1,10 e o total, R$ 1,20. A bola custa R$ 0,05 e o taco, R$ 1,05. O problema faz parte do Teste de Reflexão Cognitiva de Shane Frederick (2005), e Kahneman relata que mais da metade dos estudantes de Harvard, do MIT e de Princeton deu a resposta intuitiva; em universidades menos seletivas, mais de 80%.",
      formula: "b + (b + 1,00) = 1,10  ⇒  2b = 0,10  ⇒  b = 0,05",
      naPratica:
        "Rodolfo admite que ele e colegas que lidam com números todos os dias também erram. Se a intuição falha numa conta de centavos, falha mais ainda numa decisão carregada de medo ou euforia, tomada por quem não trabalha com finanças.",
      referencia: { autor: "Daniel Kahneman", obra: "Rápido e devagar: duas formas de pensar", capitulo: "cap. 3, a partir de Frederick (2005)", ano: 2012 },
    },
    {
      tipo: "texto",
      tempo: "14:16",
      paragrafos: [
        "A ponte para o câmbio vem logo em seguida. \"Não vou internacionalizar agora porque o dólar está a 5,20, vou esperar ir a 4,90.\" \"Não vou agora, que está a 6, vou esperar ir a 5,70.\" Rodolfo chama isso de viés de ancoragem: a cotação vista há pouco vira a régua do preço justo. Tversky e Kahneman mostraram o efeito em 1974 com uma roleta viciada que parava em 10 ou em 65: perguntados depois que porcentagem dos países da ONU era africana, os participantes que tinham visto o 10 responderam, na mediana, 25%, e os que tinham visto o 65, 45%. Um número sem relação nenhuma com a pergunta puxou a resposta.",
        "Rodolfo resume o problema numa imagem: temos órgãos sensíveis, o cérebro, o pulmão, o coração e o bolso. E cita Peter Lynch, que geriu o Magellan, fundo mútuo da Fidelity, de 1977 a 1990 (na aula ele aparece como gestor de hedge fund): \"Todo mundo tem capacidade intelectual para ganhar dinheiro com ações. Nem todo mundo tem estômago\", frase do livro \"Beating the Street\", de 1993. A outra recomendação de leitura é \"A psicologia financeira\", de Morgan Housel. Por fim, ele lista os vieses que pretende usar ao longo do módulo: busca por atalho, ancoragem, manada, aversão à perda, home bias e pico-fim. A tabela abaixo traduz cada um para a decisão de dolarizar e acrescenta um sétimo, a recência, que os livros-texto tratam ao lado deles e que reaparece no fim da aula.",
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
          "Trocar uma pergunta difícil por uma fácil e responder a fácil, como no problema do taco e da bola.",
          "\"O juro aqui é alto, então não preciso olhar para fora\": a taxa responde a uma pergunta que era sobre concentração de risco.",
        ],
        [
          "Ancoragem",
          "Um número visto antes, mesmo irrelevante, puxa a estimativa seguinte.",
          "\"Vou esperar o dólar voltar a 4,90\": a cotação recente vira o preço justo, e a decisão é adiada indefinidamente.",
        ],
        [
          "Manada",
          "Seguir o que os outros estão fazendo, por conforto ou por medo de ficar de fora.",
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
          "A lembrança de uma experiência é dominada pelo pior momento e pelo final, não pela média.",
          "Julgar a experiência de investir lá fora pelo mês em que o dólar caiu logo depois da compra, e não pelo resultado de anos.",
        ],
        [
          "Recência",
          "Dar peso demais ao passado recente e projetá-lo para a frente.",
          "Comprar depois de uma disparada e vender depois de uma queda: é o mecanismo do investidor que \"troca o pé\", no fim da aula.",
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
      tempo: "15:56",
      paragrafos: [
        "Rodolfo define o home bias pela familiaridade: conhecer bem um assunto dá conforto para concentrar nele mais do que a teoria de carteiras recomendaria. O dono de uma construtora que vendeu bem tende a pôr o dinheiro em crédito e em ações do setor imobiliário, porque sabe ler o balanço e o ciclo daquelas empresas. O executivo de uma multinacional de óleo e gás faz o mesmo com o setor dele. Os dois exemplos têm um agravante que a aula 1 já discutiu: a renda do trabalho ou do negócio já depende daquele setor e daquele país, e a carteira concentrada soma risco a um risco que já existe.",
        "Na literatura de finanças, o termo nasceu com escopo geográfico. Kenneth French e James Poterba mostraram em 1991 que investidores de Estados Unidos, Japão e Reino Unido mantinham a maior parte das ações em empresas do próprio país, muito acima do peso desses mercados no mundo. Bodie, Kane e Marcus definem o viés como alocar em títulos domésticos uma fatia maior do que a diversificação neutra, pelo valor de mercado, indicaria, e Brealey, Myers e Allen o tratam como um enigma: nenhuma explicação de custo ou de imposto dá conta de um viés tão grande e tão persistente.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "16:53",
      termo: "Home bias (viés doméstico)",
      definicao:
        "Tendência de manter em ativos do próprio país uma parcela da carteira maior do que o peso desse país no mercado mundial. A medida mais usada compara a fatia estrangeira efetivamente na carteira com a fatia estrangeira na carteira mundial: zero indica uma carteira com os pesos do mundo; um indica uma carteira inteiramente doméstica.",
      formula: "Home bias = 1 − (fatia estrangeira na carteira ÷ fatia estrangeira no mercado mundial)",
      naPratica:
        "Em 2008, o Brasil era 1,6% do valor das bolsas do mundo e os brasileiros tinham 99% das ações em empresas brasileiras: 1 − (1% ÷ 98,4%) dá perto de 0,99, e Coeurdacier e Rey registram 0,98, quase o máximo da escala. O índice não dá um alvo de alocação, e o curso não propõe um; ele só mostra que 100% em casa é uma escolha concentrada, e não um ponto de partida neutro.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 25, \"Home-Country Bias\", p. 886", ano: 2014 },
    },
    {
      tipo: "texto",
      tempo: "16:53",
      paragrafos: [
        "É aqui que Rodolfo responde à pergunta do início. Se a concentração fosse culpa do juro alto, ela seria uma particularidade brasileira. Não é: a aula cita Bangladesh, Índia, Turquia, Filipinas, Egito, Indonésia, Rússia, China e Arábia Saudita como países em que a população também mantém quase tudo em casa, com juros e moedas muito diferentes entre si. A explicação comum, diz ele, é o home bias, um traço do ser humano, e não do brasileiro.",
        "Os dados confirmam o padrão também entre países ricos e de juro baixo. Nicolas Coeurdacier e Hélène Rey reuniram, a partir de levantamentos do FMI, a fatia doméstica das carteiras de ações em 2008: os americanos mantinham 77% em empresas americanas, que eram um terço do mercado mundial; os canadenses, 80% em ações de um mercado que pesava 2,7%. O brasileiro aparece no extremo, ao lado do chinês, com 99%. O viés vem caindo devagar: pelos cálculos da Vanguard com o levantamento de 2023 do FMI, o canadense tinha 50% em casa, para um mercado de 2,6% do mundo, e o americano, cerca de 81%.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "16:53",
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
      resumo: "Medido em reais, o investimento em ações americanas somou duas fontes de retorno e ficou acima do CDI em todas as janelas da aula.",
      tempo: "17:57",
    },
    {
      tipo: "texto",
      tempo: "18:48",
      paragrafos: [
        "Se a explicação não é o juro, falta mostrar que lá fora também há retorno. Rodolfo monta a comparação em duas camadas. A primeira é o câmbio: quanto o dólar subiu contra o real, por ano, em cinco janelas. Na aula, 5,3% desde o início do Plano Real, 4,1% desde 2000, 4,5% em 20 anos, 8,3% em 15 anos e 4,9% em 10 anos, sempre com volatilidade: \"vai 10, cai 8, sobe 5\". Pela série do Banco Central, com o dólar de fim de mês e as janelas fechadas em dezembro de 2025, os números são de 6,2%, 4,4%, 4,4%, 8,3% e 3,5%. As diferenças vêm da data de corte e do ponto de partida; a de 1994, por exemplo, cai para 5,8% se a conta começar em julho, no lançamento do real.",
        "Quem leva o dinheiro e o deixa parado numa conta corrente americana recebe só essa camada, a do câmbio. Mas o dinheiro não fica parado, e a segunda camada é o que ele rende lá. Rodolfo escolhe o S&P 500 e explica a escolha com um parêntese sobre cultura: o americano está acostumado à bolsa. Pelos números da SIFMA, ações respondiam por 57,2% dos US$ 80,4 trilhões em ativos financeiros líquidos das famílias americanas em 2025, e fundos mútuos, em boa parte de ações, por mais 17%; a soma passa de 70%, como diz a aula. Pela pesquisa do Fed, 58% das famílias têm ações, direta ou indiretamente.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "18:48",
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
        "Janelas de dezembro a dezembro: desde dez/1994, dez/1999, dez/2005, dez/2010 e dez/2015, até dez/2025 (R$ 5,50). A partir de jul/1994, a média é de 5,8% ao ano. Média composta, que esconde anos de alta e de queda.",
    },
    {
      tipo: "texto",
      tempo: "21:37",
      paragrafos: [
        "Para o S&P 500 nos mesmos períodos, a aula cita 9,1%, 6,6%, 6,3%, 10% e 11,2% ao ano, em dólar. Pela base de Aswath Damodaran, professor da NYU que publica os retornos anuais do índice com dividendos desde 1928, os números até dezembro de 2025 são maiores: 11,0% desde 1994, 8,0% desde 2000, 10,9% em 20 anos, 13,9% em 15 e 14,7% em 10. A diferença tem duas fontes prováveis. Uma é a data de corte. A outra são os dividendos: só a alta do índice, sem eles, dá 9,1% ao ano entre o fim de 1994 e o fim de 2025, exatamente o número da aula para essa janela.",
        "A conclusão de Rodolfo vem da soma das duas camadas: cerca de 4,5% do câmbio mais 9% da bolsa dão algo entre 13% e 15% ao ano em reais, na mesma régua do CDI de 10%, 14% ou 15% com que o brasileiro está acostumado. Desde 1994, 5,3 mais 9,1 dão 14,4%; nos últimos dez anos, 4,9 mais 11,2 dão 16,1%. A soma é uma boa aproximação quando os dois números são pequenos, mas a conta certa multiplica os fatores, e a diferença cresce justamente nos anos de movimento forte.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "22:31",
      termo: "Retorno em reais de um ativo em dólar",
      definicao:
        "Quem mede o resultado em reais carrega duas posições ao mesmo tempo: o ativo, que rende em dólar, e a própria moeda, que se valoriza ou se desvaloriza contra o real. Os dois efeitos se compõem, e por isso se multiplicam: o retorno em reais é o produto de um mais o retorno em dólar por um mais a variação do câmbio, menos um. A soma simples omite o termo cruzado, o retorno em dólar vezes a variação do câmbio.",
      formula: "1 + r(R$) = [1 + r(US$)] × [1 + v],  com v a variação do dólar em reais",
      naPratica:
        "Com os números da aula para 1994, (1,091 × 1,053) − 1 = 14,9% ao ano, contra 14,4% pela soma. Em 2008 a diferença é enorme: o S&P caiu 36,6% em dólar e o dólar subiu 31,9% em reais; a soma daria −4,6%, mas o resultado em reais foi −16,3%. A conta exata mostra também que câmbio e ativo podem se compensar, como na crise de 2008, ou se somar contra o investidor, como num ano de bolsa em queda e real forte.",
      referencia: { autor: "Zvi Bodie, Alex Kane e Alan J. Marcus", obra: "Investments", capitulo: "cap. 25, seção 25.2, risco cambial", ano: 2014 },
    },
    {
      tipo: "grafico",
      tempo: "22:31",
      titulo: "Em reais, S&P mais dólar ficou acima do CDI nas cinco janelas, por margens muito diferentes",
      subtitulo: "Retorno médio composto em reais, % ao ano, até dez/2025, antes de impostos e custos",
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
        "Janelas de dezembro a dezembro, como no gráfico do câmbio. Desde 2000, a vantagem é de menos de 1 ponto por ano; nos 15 anos, a janela começa num real excepcionalmente forte (R$ 1,67 por dólar). O resultado depende do período escolhido, e o passado não garante a repetição.",
    },
    {
      tipo: "kpis",
      tempo: "22:31",
      titulo: "2008 em reais: quando a bolsa caiu, o dólar amorteceu",
      itens: [
        { rotulo: "S&P 500 em dólar", valor: -36.55, formato: { base: "pct", sinal: true }, nota: "com dividendos" },
        { rotulo: "Dólar em reais", valor: 31.94, formato: { base: "pct", sinal: true }, nota: "R$ 1,77 para R$ 2,34" },
        { rotulo: "S&P 500 em reais", valor: -16.28, formato: { base: "pct", sinal: true }, destaque: true, nota: "conta exata" },
        { rotulo: "Ibovespa", valor: -41.22, formato: { base: "pct", sinal: true }, nota: "em reais" },
      ],
      fonte: "Aswath Damodaran, NYU Stern (S&P 500); Banco Central do Brasil, SGS 3696 (dólar de fim de período, dez/2007 e dez/2008); B3 (Ibovespa)",
      nota: "0,634 × 1,319 − 1 = −16,3%. As bolsas caíram juntas no mundo, e o que protegeu o residente no Brasil foi a moeda, não a bolsa estrangeira; não há garantia de que o padrão se repita.",
    },
    {
      tipo: "simulador",
      id: "cdi-contra-dolar-mais-bolsa",
      tempo: "22:31",
      titulo: "Uma parte em reais, outra em dólar",
      descricao:
        "Compare a carteira que ficou inteira em reais com outra que leva uma fatia de cada aporte para o dólar. Mude o rendimento de cada lado e a perda anual do real para ver quanto do resultado vem da bolsa e quanto vem do câmbio.",
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
      tempo: "23:44",
      paragrafos: [
        "A objeção previsível é que lá fora há risco e aqui não. Rodolfo separa os dois riscos que a palavra mistura. Risco de mercado é a volatilidade: o preço de uma ação, do dólar, de um multimercado ou de um título prefixado sobe e desce todos os dias. Risco de crédito é a possibilidade de o emissor não pagar, ou de o mercado passar a duvidar que ele pague e remarcar o papel para baixo. Uma aplicação pós-fixada no Brasil tem, de fato, volatilidade quase nula. Mas tem risco de crédito, seja do governo, seja do banco ou da empresa que emitiu o título. Não existe investimento sem risco; existe a escolha de qual risco carregar e em que dose.",
        "Ele faz questão da ressalva: não diz que o risco de volatilidade é melhor do que o de crédito, nem que internacionalizar é melhor do que ficar no Brasil. A provocação é outra. Diversificar para além de um mercado que oferece cerca de 1% das alternativas do mundo é saudável, e a rentabilidade, como o capítulo anterior mostrou, não precisa ser menor. Errado é decidir comparando uma taxa de 15% com uma de 4% como se as duas medissem a mesma coisa.",
      ],
    },
    {
      tipo: "comparativo",
      tempo: "24:21",
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
        "Os números medem só o risco de mercado. O CDI não capta o risco de crédito de quem emite o título, o outro risco discutido na aula. Por coincidência, o CDI rendeu 12,38% tanto em 2008 quanto em 2022.",
    },
    {
      tipo: "texto",
      tempo: "20:26",
      paragrafos: [
        "Na aula, a observação sobre a renda fixa vem antes, no parêntese sobre o S&P: o pós-fixado, com seu \"1% ao mês\" constante, e a marcação na curva de títulos prefixados e de inflação, que poupa o investidor de ver a oscilação, \"só existem no Brasil\". A frase pede um ajuste fino. Os Estados Unidos têm instrumentos que acompanham a taxa de curto prazo: o Tesouro americano emite notas de taxa flutuante desde 2014, e os fundos de money market, que fazem papel parecido com o de um fundo DI, respondiam por 6,6% dos ativos financeiros líquidos das famílias em 2025. O que distingue o Brasil é a escala. Quase metade da dívida federal brasileira é atrelada à Selic, contra pouco mais de 2% da dívida negociável americana em papéis de taxa flutuante, e a renda fixa bancária de varejo segue o CDI.",
        "A marcação na curva também tem nuance. No Brasil, os títulos prefixados e atrelados à inflação do Tesouro Direto são marcados a mercado todos os dias; a marcação na curva aparece sobretudo nos extratos de CDBs e outros papéis bancários levados ao vencimento. Nos Estados Unidos, a renda fixa de varejo passa por Treasuries, títulos corporativos e fundos e ETFs de renda fixa, cujo preço varia diariamente. É por isso que Rodolfo diz que a renda fixa americana \"tem volatilidade, e dependendo do ano até maior do que a bolsa\": em 2022, o Treasury de 10 anos perdeu 17,8%, praticamente o mesmo que o S&P 500. Se as duas classes oscilam e a bolsa promete mais no longo prazo, o americano se acostumou a ter ações.",
      ],
    },
    {
      tipo: "kpis",
      tempo: "20:26",
      titulo: "O tamanho do pós-fixado na dívida pública",
      itens: [
        { rotulo: "Brasil: dívida federal atrelada à Selic", valor: 48.3, formato: { sufixo: "%", casas: 1 }, destaque: true, nota: "dez/2025, de um estoque de R$ 8,64 trilhões" },
        { rotulo: "EUA: notas de taxa flutuante na dívida negociável", valor: 2.3, formato: { sufixo: "%", casas: 1 }, nota: "set/2025, US$ 690 bilhões de US$ 29,7 trilhões" },
      ],
      fonte:
        "Tesouro Nacional, Relatório Mensal da Dívida Pública Federal, dez/2025; U.S. Department of the Treasury, Financial Report FY2025, nota 12 (dívida federal)",
      nota: "As notas de taxa flutuante (FRN) do Tesouro americano existem desde janeiro de 2014.",
    },
    {
      tipo: "conceito",
      tempo: "20:26",
      termo: "Marcação a mercado",
      definicao:
        "Registrar um título pelo preço que ele alcançaria se fosse vendido hoje, e não pela taxa contratada na compra. Quem leva um título até o vencimento recebe a taxa combinada, se o emissor pagar; quem vende antes recebe o preço de mercado, que cai quando as taxas sobem e sobe quando elas caem. A marcação na curva atualiza o título pela taxa de emissão, como se nada mudasse até o vencimento.",
      formula: "P = VF ÷ (1 + y)^n",
      naPratica:
        "Um título prefixado sem cupom com dez anos até o vencimento, comprado a 4% ao ano, perde cerca de 9% do valor de mercado se a taxa subir para 5%: (1,04 ÷ 1,05)^10 − 1 ≈ −9,1%. A marcação na curva esconde essa oscilação do extrato, mas não do mundo: ela reaparece se o investidor precisar vender antes do prazo.",
      referencia: { autor: "Alexandre Assaf Neto", obra: "Mercado Financeiro", capitulo: "cap. 4, marcação a mercado e preço na curva", ano: 2014 },
    },

    // ---- 7. Ancoragem e o investidor que troca o pé ---------------------------------------------------
    {
      tipo: "capitulo",
      id: "trocar-o-pe",
      titulo: "Ancoragem e o investidor que troca o pé",
      resumo: "Decidir olhando o retrovisor faz o investidor chegar sempre um ano atrasado à classe que acabou de subir.",
      tempo: "25:26",
    },
    {
      tipo: "texto",
      tempo: "25:26",
      paragrafos: [
        "A última parte volta à ancoragem com a pergunta que todo investidor se faz: qual é o momento certo? Mando agora, espero o dólar cair, espero a eleição, espero a guerra acabar? A dúvida não é exclusiva de quem vai internacionalizar; aparece em qualquer decisão de pôr mais ou menos risco na carteira. Para mostrar o custo dela, Rodolfo usa os retornos anuais de índices americanos desde 1928, a base de Aswath Damodaran: o S&P 500 representa a renda variável, o Treasury de 10 anos, a renda fixa, e uma carteira moderada combina os dois. Índices, e não fundos, para não haver escolha de gestor na comparação.",
        "O cenário é janeiro de 2009. O investidor recebeu um bônus, vendeu um imóvel ou tem um dinheiro novo para alocar e decide por uma carteira moderada. Olha para trás e vê o que 2008 fez: as ações caíram 37%, a carteira moderada, 14%, e a renda fixa subiu 20%, depois de 10% em 2007. Ancorado nesse passado, ele vai para a renda fixa, com a ideia de voltar à carteira moderada \"quando a bolsa melhorar\". \"Normal, gente, eu já fiz isso, todo mundo já fez isso\", diz Rodolfo.",
        "Uma observação sobre os números. Na fala, a carteira moderada é descrita como 60% em renda fixa e 40% em ações; os resultados exibidos, −14% em 2008 e +11% em 2009, correspondem à combinação inversa, 60% em ações e 40% em Treasury, que é também a convenção do \"60/40\" no mercado americano. Com 60% em Treasury, a carteira teria caído cerca de 2,6% em 2008. Os gráficos abaixo usam 60% em ações, a versão que reproduz os números da aula.",
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
      nota: "Carteira rebalanceada para 60% em S&P 500 e 40% em Treasury de 10 anos no início de cada ano.",
    },
    {
      tipo: "texto",
      tempo: "28:53",
      paragrafos: [
        "O resto da história é a sequência de trocas. Em 2009, a renda fixa perdeu 11% e a bolsa subiu 26%; o investidor se convence de que doze meses são pouco e espera. Em 2010, a renda fixa rende 8% e a bolsa, mais 15%. Com a bolsa perto de 40% acima em dois anos, ele decide que chegou a hora do risco e vai para as ações em 2011, o ano em que elas sobem 2% e a renda fixa, 16%. Conclui que \"não é de renda variável\" e volta para a renda fixa em 2012, quando ela rende 3% e a bolsa, 16%.",
        "Somadas as trocas, quem aplicou R$ 100 em janeiro de 2009 terminou 2012 com cerca de R$ 101. A carteira moderada, sem nenhuma decisão além do rebalanceamento anual, chegou a R$ 149; só a renda fixa, a R$ 115; só a bolsa, a R$ 171. O investidor do exemplo não escolheu a pior classe; escolheu, a cada ano, a que tinha acabado de ganhar, e ficou com o pior das duas. É o viés de recência que Bodie, Kane e Marcus descrevem como dar peso demais à experiência recente, e que o mesmo livro mostra no comportamento de quem persegue vencedores. Na próxima aula, Rodolfo retoma o tema por outro lado: o custo de tentar acertar o momento de entrar e sair.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "28:53",
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
          nota: "Original de 2011. Parte I (os dois sistemas; cap. 3, o taco e a bola), cap. 11 (ancoragem), Parte IV (teoria do prospecto) e cap. 35 (regra do pico-fim).",
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
          nota: "Journal of Risk and Uncertainty. Os parâmetros da função de valor (0,88 e 2,25).",
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
          nota: "Cap. 6 (tolerância a risco, capacidade e disposição), cap. 12 (vieses de processamento de informação e de decisão, p. 389 a 395) e cap. 25 (home bias, p. 886, e risco cambial).",
        },
        {
          autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen",
          titulo: "Princípios de Finanças Corporativas, 10ª edição",
          ano: 2013,
          nota: "Cap. 13 (finanças comportamentais e teoria do prospecto, p. 297 e 298) e cap. 27 (custo de capital internacional e o enigma do home bias, p. 642 e 643).",
        },
        {
          autor: "Alexandre Assaf Neto",
          titulo: "Mercado Financeiro, 12ª edição",
          ano: 2014,
          nota: "Cap. 2 (a crise de 2008 e seus efeitos no Brasil) e cap. 4 (CDI, marcação a mercado e preço na curva).",
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

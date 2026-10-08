import type { SecaoDaAula } from "@/lib/notebook";

// Módulo II, aula 2 ("O spread não é de graça"), com Tony Volpon, cerca de 49 min. No Panda é o
// "TONY VOLPON - VÍDEO 02" (ele a chama de "aula seis", pela numeração global do curso). Escrita em
// 08/out/2026 a partir da transcrição em `transcricoes/modulo-1/aula-2.txt` e do super dossiê
// (`_referencias-livros/dossie/`, seção "Aula 2" do RANKING-MODULO-II.md). Segue a ordem da fala: o
// mercado de crédito tão variado quanto a bolsa, o tamanho, por que emprestar a empresas e a fila do
// pagamento, a escada das notas, investment grade como "Treasury plus" e high yield como quase ação, a
// fronteira BBB-/BB+ e os fallen angels, a perda esperada, juros e crédito puxando para lados opostos,
// o histórico dos spreads e o lugar do crédito na carteira. Tom de docs/TOM-DO-NOTEBOOK.md.
// A aula 1 do módulo já mostrou a escada de prêmios em três degraus, o Sharpe, a duration e a matriz
// crédito x prazo: aqui só há pontes curtas para esses blocos.
//
// NÚMEROS CONFERIDOS EM 08/OUT/2026 nas fontes citadas em cada bloco:
// - S&P Global Ratings, 2024 Annual Global Corporate Default and Rating Transition Study (27/mar/2025):
//   default médio em um ano por nota, 1981 a 2024 (tabela 4: AAA 0,00; AA 0,02; A 0,05; BBB 0,14;
//   BB 0,56; B 2,93; CCC/C 26,12) e default anual do high yield americano, 1981 a 2024 (tabela 5,
//   média 4,10%; 10,69% em 1991, 10,53% em 2001, 11,78% em 2009). O estudo de 2025 (mar/2026) está
//   atrás de assinatura; dele, só o total global (3,08% em 2025). EUA em 2025: 4,0% em 12 meses até
//   nov/2025 (S&P, 17/dez/2025). Recuperação média de títulos nos EUA, 40,4% (S&P, U.S. Recovery
//   Study, dez/2025).
// - ICE BofA via FRED, 5/out/2026: prêmios AAA 0,40; AA 0,59; A 0,72; BBB 1,04; BB 1,93; B 3,14;
//   CCC e abaixo 12,11; IG 0,84; HY 3,12; taxa total IG 6,03% e HY 8,15%. Mínimo do IG desde out/2023:
//   0,73 (2026). O FRED só guarda três anos dessas séries; os picos de 2008 (IG 6,56; HY 21,82) e de
//   2022 (IG perto de 1,65; HY perto de 6) vêm de levantamentos publicados sobre a série completa, e o
//   de 2020 (IG perto de 4, HY perto de 11) do Federal Reserve (FEDS Notes, out/2020).
// - Moody's Baa menos Treasury de 10 anos, FRED BAA10YM (mensal, sem corte), jan/2006 a set/2026.
// - SIFMA: estoque de US$ 12,1 tri (2º tri/2026), emissão anual de 2015 a 2025 (Fact Book 2026,
//   tabela 35), US$ 2,195 tri de jan a set/2026 (+24,5%), 82,9% de IG no 1º tri/2026.
// - iShares (06/out/2026): USIG, que replica o ICE BofA US Corporate, com duration de 6,06 anos e
//   composição AAA 0,61%, AA 9,72%, A 45,07%, BBB 44,42%; HYG com duration de 3,25 anos.
// - Bloomberg US Corporate e US Corporate High Yield, retorno anual 2019 a 2025, via YCharts.
// - Ratings do Brasil (S&P 9/set/2015, Fitch 16/dez/2015, Moody's 24/fev/2016; Moody's Ba1 em
//   1º/out/2024; BB, BB e Ba1 no prospecto do Tesouro na SEC de abr/2026); AAA só para Microsoft e
//   Johnson & Johnson na S&P; Apple Aaa na Moody's e AA+ na S&P.
//
// ONDE A FALA DIFERE DA FONTE (registrado com leveza no texto): o Brasil perdeu o grau em 2015 na S&P
// e na Fitch e só em 2016 na Moody's; o default do high yield passou de 10% em 1991, 2001 e 2009, e
// não "4%, 5% em anos de crise"; "25% de 50 é 25%" é 12,5%; só duas empresas AAA na S&P, e a Apple
// não é uma delas; a emissão de 1,5 a 2 tri é bruta, não líquida; chip da NVIDIA de 50 a 100 mil (a
// unidade custa de 25 a 40 mil; os valores maiores são de módulos e servidores); spread do IG "perto
// de zero" (o piso histórico fica perto de meio ponto); o spread do IG abriu em 2022, e a perda veio
// sobretudo da Treasury; a carteira 50/30/25 soma 105%; a fórmula é probabilidade vezes (1 menos a
// recuperação).
//
// ILUSTRATIVO: a perda esperada por nota (conta do autor sobre médias da S&P e prêmios do dia, com
// recuperação de 40%) e o exemplo de 3% de default com 40% de recuperação, que é o da aula.
//
// Itens do super dossiê usados: AMC-062, AMC-057, BMA-011, BMA-083, BMA-084, BMA-085, BMA-086,
// BMA-049, BMA-052, AMF-049, VAL-006 e BKM-026.

// Prêmio do Baa (Moody's) sobre a Treasury de 10 anos, média mensal, jan/2006 a set/2026 (FRED BAA10YM).
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const meses = Array.from({ length: 249 }, (_, i) => `${MESES[i % 12]}/${2006 + Math.floor(i / 12)}`);
const baa10y = [
  1.82, 1.7, 1.69, 1.69, 1.64, 1.67, 1.67, 1.71, 1.71, 1.69, 1.6, 1.66,
  1.58, 1.56, 1.71, 1.7, 1.64, 1.6, 1.65, 1.98, 2.07, 1.95, 2.25, 2.55,
  2.8, 3.08, 3.38, 3.29, 3.05, 2.97, 3.15, 3.26, 3.62, 5.07, 5.68, 6.01,
  5.62, 5.21, 5.6, 5.46, 4.77, 3.78, 3.53, 2.99, 2.91, 2.9, 2.92, 2.78,
  2.52, 2.65, 2.54, 2.4, 2.63, 3.03, 3.0, 2.96, 3.01, 3.18, 3.16, 2.81,
  2.7, 2.57, 2.62, 2.56, 2.61, 2.75, 2.76, 3.06, 3.29, 3.22, 3.13, 3.27,
  3.26, 3.17, 3.06, 3.14, 3.27, 3.4, 3.34, 3.23, 3.12, 2.83, 2.86, 2.91,
  2.82, 2.87, 2.89, 2.83, 2.8, 2.89, 2.74, 2.68, 2.66, 2.69, 2.66, 2.48,
  2.33, 2.39, 2.34, 2.19, 2.2, 2.2, 2.19, 2.27, 2.27, 2.39, 2.46, 2.53,
  2.57, 2.53, 2.5, 2.54, 2.69, 2.77, 2.88, 3.02, 3.17, 3.27, 3.2, 3.22,
  3.36, 3.56, 3.24, 2.98, 2.87, 2.89, 2.72, 2.68, 2.68, 2.62, 2.57, 2.34,
  2.23, 2.22, 2.2, 2.27, 2.25, 2.18, 2.07, 2.1, 2.1, 1.96, 1.92, 1.82,
  1.68, 1.65, 1.8, 1.8, 1.85, 1.92, 1.9, 1.88, 1.88, 1.92, 2.1, 2.3,
  2.41, 2.27, 2.27, 2.17, 2.23, 2.39, 2.22, 2.24, 2.21, 2.21, 2.13, 2.02,
  2.01, 2.11, 3.42, 3.47, 3.28, 2.91, 2.69, 2.62, 2.68, 2.65, 2.43, 2.23,
  2.16, 2.16, 2.13, 1.97, 2.0, 1.92, 1.92, 1.96, 1.86, 1.77, 1.72, 1.84,
  1.82, 2.04, 2.16, 1.91, 2.22, 2.13, 2.31, 2.25, 2.17, 2.28, 2.18, 1.97,
  1.97, 1.84, 2.05, 2.07, 2.2, 2.0, 1.84, 1.85, 1.78, 1.83, 1.79, 1.62,
  1.62, 1.56, 1.54, 1.46, 1.47, 1.51, 1.59, 1.73, 1.7, 1.53, 1.42, 1.41,
  1.45, 1.47, 1.65, 1.9, 1.87, 1.77, 1.71, 1.74, 1.71, 1.68, 1.77, 1.76,
  1.67, 1.68, 1.79, 1.71, 1.62, 1.53, 1.59, 1.64, 1.48,
];

// Default anual do high yield americano (S&P, "U.S. and tax havens"), 1990 a 2024.
const anosDefault = Array.from({ length: 35 }, (_, i) => String(1990 + i));
const defaultHy = [
  7.93, 10.69, 6.25, 2.4, 2.21, 3.66, 1.86, 2.18, 3.26, 5.34,
  7.38, 10.53, 7.24, 5.59, 2.44, 2.02, 1.37, 1.02, 4.29, 11.78,
  3.46, 2.15, 2.65, 2.19, 1.61, 2.85, 5.2, 3.09, 2.42, 3.12,
  6.66, 1.54, 1.66, 4.48, 5.13,
];

// Emissão bruta de títulos corporativos nos EUA, em US$ trilhões (SIFMA).
const anosEmissao = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026 até set"];
const emissao = [1.53, 1.56, 1.7, 1.39, 1.47, 2.38, 2.06, 1.4, 1.51, 1.97, 2.22, 2.2];

// Perda esperada em um ano por nota: default médio da S&P (1981 a 2024) vezes 60% (recuperação de 40%).
const notasPerda = ["A", "BBB", "BB", "B", "CCC e abaixo"];
const premioNota = [0.72, 1.04, 1.93, 3.14, 12.11];
const perdaNota = [0.03, 0.08, 0.34, 1.76, 15.67];

const secao: SecaoDaAula = {
  aula: 2,
  blocos: [
    // ---- 1. Um mercado tão variado quanto a bolsa -------------------------------------------------
    {
      tipo: "capitulo",
      id: "credito-como-a-bolsa",
      titulo: "Emprestar para uma empresa, e não para o governo",
      resumo: "O crédito corporativo americano tem tanta variedade quanto a bolsa. E um prêmio que nunca vem de graça.",
      tempo: "0:00",
    },
    {
      tipo: "texto",
      capitular: true,
      paragrafos: [
        "Imagine que você tem US$ 10 mil e duas propostas. A primeira é emprestar ao governo americano por sete anos, a pouco mais de 5% ao ano. A segunda é emprestar a uma empresa grande e conhecida, pelo mesmo prazo, a 6%. Um ponto a mais parece um bom negócio. A pergunta desta aula é o que você está aceitando em troca desse ponto.",
        "Na aula anterior, o Tony mostrou que toda taxa em dólar começa na Treasury e que cada degrau abaixo na qualidade do emissor paga um prêmio. Agora ele desce a escada. O crédito das empresas americanas, diz ele, tem tanta variedade quanto a bolsa: setores diferentes, riscos diferentes, estruturas diferentes. Só que, em vez de virar sócio, você vira credor.",
      ],
    },
    {
      tipo: "texto",
      tempo: "1:04",
      paragrafos: [
        "A primeira divisão do mercado é entre investment grade, o grau de investimento, e high yield, o alto rendimento. Antigamente, o segundo grupo se chamava junk bonds, títulos lixo. O nome não ajudava a vender, e a indústria trocou o rótulo. O risco continuou o mesmo.",
        "Quem decide de que lado cada empresa fica são as agências de rating, como S&P, Moody's e Fitch. E aqui vem o primeiro aviso do Tony: nota não substitui entender o que se compra. Antes de 2008, as agências deram notas máximas a pacotes de hipotecas americanas de baixa qualidade. Parte do problema era de incentivo: quem paga a agência é quem emite o título. Nem empresas grandes escaparam. A Enron tinha grau de investimento dois meses antes de quebrar, em 2001, e a Lehman Brothers, o maior calote de 2008 na conta da S&P, com US$ 144 bilhões em dívidas, ainda tinha nota da faixa A às vésperas da falência.",
      ],
    },

    // ---- 2. O tamanho ------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "o-tamanho",
      titulo: "Um mercado do tamanho de um país rico",
      resumo: "Mais de US$ 12 trilhões em títulos de empresas americanas, e um ritmo de emissão que voltou ao nível da pandemia.",
      tempo: "2:34",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Na aula, o Tony fala em cerca de US$ 7 trilhões em títulos investment grade e US$ 1,4 trilhão em high yield. São os tamanhos dos índices que o mercado usa para acompanhar cada grupo. A conta da SIFMA, a associação americana de bancos e corretoras, é mais larga, porque inclui todo título de empresa em circulação, de bancos e financeiras a papéis pequenos que não entram nos índices: US$ 12,1 trilhões no meio de 2026. Para comparar, é mais de cinco vezes o PIB do Brasil.",
        "O ritmo de emissão também impressiona. As empresas americanas venderam US$ 2,2 trilhões em títulos em 2025, o segundo maior volume da série, atrás só de 2020. Em 2026, até setembro, o volume já estava praticamente igual ao de 2025 inteiro. E mais de 80% disso é investment grade.",
      ],
    },
    {
      tipo: "kpis",
      titulo: "O crédito corporativo americano em quatro números",
      itens: [
        { rotulo: "Títulos de empresas americanas em circulação", valor: 12.1, formato: { prefixo: "US$ ", sufixo: " tri", casas: 1 }, nota: "2º tri/2026" },
        { rotulo: "Emitido em 2025", valor: 2.22, formato: { prefixo: "US$ ", sufixo: " tri", casas: 2 }, nota: "segundo maior ano, atrás de 2020" },
        {
          rotulo: "Emitido em 2026, até setembro",
          valor: 2.2,
          formato: { prefixo: "US$ ", sufixo: " tri", casas: 2 },
          destaque: true,
          variacao: { valor: 24.5, formato: { base: "pct", sinal: true }, rotulo: "sobre jan a set de 2025" },
        },
        { rotulo: "Fatia do investment grade nas emissões", valor: 82.9, formato: { sufixo: "%", casas: 1 }, nota: "1º tri/2026" },
      ],
      fonte: "SIFMA, US Corporate Bonds Statistics (out/2026), Capital Markets Fact Book 2026 e Research Quarterly do 1º tri/2026",
      nota: "Emissão bruta, sem descontar os títulos que vencem. Estoque inclui títulos de empresas financeiras e não financeiras.",
    },
    {
      tipo: "texto",
      tempo: "4:02",
      paragrafos: [
        "Dentro do investment grade, o Tony chama atenção para um detalhe: metade do mercado está nos degraus de baixo. O índice mais usado do grupo, o ICE BofA US Corporate, tem 45% em títulos de nota A e 44% em BBB, o último andar antes do high yield. Só 10% estão nas duas notas mais altas.",
        "Isso importa porque é no BBB que mora o risco de queda de andar. Quando a economia desacelera, as empresas da fronteira podem não aguentar o ajuste e cair para o high yield. Um capítulo adiante mostra o que acontece com o preço quando isso ocorre.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Quase metade do investment grade está no último andar, o BBB",
      subtitulo: "Composição do índice de títulos corporativos investment grade, por nota, em %",
      forma: "barra",
      eixoX: ["AAA", "AA", "A", "BBB"],
      series: [{ nome: "Fatia do índice", valores: [0.61, 9.72, 45.07, 44.42], destaque: true }],
      formato: { sufixo: "%", casas: 1 },
      fonte: "iShares (BlackRock), página do ETF USIG, que replica o ICE BofA US Corporate Index, posição de 6/out/2026",
      nota: "Pesos por valor de mercado. Na aula, o Tony fala em cerca de 50% abaixo da nota A.",
    },

    // ---- 3. Por que emprestar a empresas --------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "por-que-emprestar",
      titulo: "O credor entra na fila antes do acionista",
      resumo: "Cupom não depende de lucro, e quem empresta recebe antes do dono. Mas quando a empresa quebra, a fila decide quanto volta.",
      tempo: "6:14",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Uma empresa que precisa de dinheiro tem duas portas. Pode pedir ao banco ou vender títulos direto ao mercado. Quem usa a segunda costuma ser maior, mais antiga e mais organizada; as menores ficam com o banco, que conhece o cliente de perto e acompanha o risco melhor do que um investidor distante.",
        "O título funciona como qualquer outro: paga juros periódicos, o cupom, e devolve o principal no vencimento. A diferença para a ação está na obrigação. O dividendo depende do lucro e pode ser cortado. O cupom não. Se a empresa deixa de pagar, é um evento de crédito, que pode acabar em renegociação ou em falência. E, por lei, o credor recebe antes de qualquer centavo ir para o acionista.",
      ],
    },
    {
      tipo: "texto",
      tempo: "9:27",
      paragrafos: [
        "Quando o pior acontece, quase nunca você perde tudo. Há uma reestruturação, a empresa pode mudar de dono, e o credor costuma receber um título novo que vale uma fração do antigo. Essa fração é a taxa de recuperação. Para títulos sem garantia real, os mais comuns, o Tony fala em cerca de 40% do valor de face. A S&P dá 40,4% como média de longo prazo para títulos americanos.",
        "Mas a média esconde muito. Depende de onde você está na fila: quem tem garantia ou empréstimo bancário recupera bem mais; quem tem dívida subordinada, bem menos. E depende do momento: em 2025, até setembro, a recuperação média dos títulos americanos caiu para 21,3%, a mais baixa desde 2001, segundo a S&P. Por isso o Tony pede que o número sirva só de ponto de partida, nunca de premissa.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Quem está mais à frente na fila recupera mais",
      subtitulo: "Recuperação média depois do default, em % do valor de face, 1987 a 2006",
      forma: "barra",
      eixoX: ["Empréstimo bancário", "Título com garantia", "Título sem garantia", "Título subordinado"],
      series: [{ nome: "Recuperação média", valores: [82, 65, 38, 15], destaque: true }],
      formato: { sufixo: "%", casas: 0 },
      referencia: { valor: 40, rotulo: "Média citada na aula" },
      fonte: "Richard Brealey, Stewart Myers e Franklin Allen, Princípios de Finanças Corporativas, Figura 24.1",
      nota: "Títulos sênior com e sem garantia real e títulos subordinados. Pela S&P, a média de longo prazo dos títulos americanos é de 40,4%, e a de 2025 até setembro, 21,3%.",
    },

    // ---- 4. A escada das notas -----------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "a-escada-das-notas",
      titulo: "A escada das notas, do AAA ao CCC",
      resumo: "Cada degrau tem uma chance de calote e um prêmio sobre a Treasury. Do BBB para baixo, a chance cresce depressa.",
      tempo: "8:18",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Quase todo título de empresa americana tem nota. Ela é a melhor estimativa da agência sobre a chance de o emissor pagar, e pesa muito na taxa que o papel vai oferecer. A régua vai do AAA, quase um soberano, ao D, que é o default. Do BBB- para cima é investment grade; do BB+ para baixo, high yield. A Moody's usa outra grafia para os mesmos degraus: Aaa, Aa, A, Baa, Ba, B, Caa.",
        "A tabela abaixo junta, para cada degrau, o que a nota quer dizer, a frequência histórica de calote em um ano e o prêmio que o mercado pagava em 5 de outubro de 2026. Repare como o default quase não existe até o A, ainda é raro no BBB e dá um salto a cada degrau abaixo. Na aula 1, você viu três desses degraus num gráfico; aqui está a escada inteira.",
      ],
    },
    {
      tipo: "tabela",
      tempo: "22:41",
      titulo: "O que cada nota diz, quanto ela costuma falhar e quanto paga",
      colunas: ["Nota (S&P e Fitch / Moody's)", "O que a nota diz", "Quem está aí", "Default em um ano, média desde 1981", "Prêmio sobre a Treasury, 5/out/2026"],
      linhas: [
        ["AAA / Aaa", "Capacidade extremamente forte de pagar", "Na S&P, só Microsoft e Johnson & Johnson entre as empresas americanas", "0,00%", "0,40 p.p."],
        ["AA / Aa", "Muito forte; pouco abaixo do topo", "Grandes bancos e blue chips; a Apple é AA+ na S&P e Aaa na Moody's", "0,02%", "0,59 p.p."],
        ["A / A", "Forte, mas mais sensível a mudanças na economia", "45% do índice de investment grade", "0,05%", "0,72 p.p."],
        ["BBB / Baa", "Adequada; um cenário ruim pode enfraquecê-la. Último andar do investment grade", "44% do índice de investment grade", "0,14%", "1,04 p.p."],
        ["BB / Ba", "Paga hoje, mas exposta a incertezas grandes. Primeiro andar do high yield", "Fallen angels e empresas na fronteira; o Brasil é BB na S&P", "0,56%", "1,93 p.p."],
        ["B / B", "Mais vulnerável; um choque pode tirar a capacidade de pagar", "Empresas alavancadas, muitas compradas por fundos de private equity", "2,93%", "3,14 p.p."],
        ["CCC a C / Caa a C", "Vulnerável; depende de condições favoráveis para pagar", "Empresas em dificuldade, perto da reestruturação", "26,12%", "12,11 p.p."],
      ],
      nota: "Default: média ponderada global de 1981 a 2024, emissores com nota da S&P; inclui trocas de dívida forçadas. Prêmio: índices ICE BofA por nota, ajustados pelas opções embutidas; na última linha, CCC e abaixo.",
      fonte: "S&P Global Ratings, 2024 Annual Global Corporate Default and Rating Transition Study (mar/2025) e definições de rating; ICE BofA via FRED; iShares (USIG)",
    },
    {
      tipo: "texto",
      tempo: "22:52",
      paragrafos: [
        "Dois ajustes à fala. O Tony cita a Apple entre as empresas AAA e, logo depois, diz que só duas empresas americanas têm essa nota. A segunda parte está certa: na S&P, são a Microsoft e a Johnson & Johnson. A Apple tem a nota máxima só na Moody's; na S&P, é AA+, um degrau abaixo. Vale lembrar que o próprio governo americano é AA+ na S&P.",
        "No topo da escada também ficam emissores quase soberanos, como as agências de hipotecas apoiadas pelo governo americano e o Banco Mundial. Do outro lado, no B e no CCC, o Tony é direto: são empresas de altíssimo risco, e é preciso muito dever de casa para não comprar algo mal precificado.",
      ],
    },

    // ---- 5. Dois mundos ------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "treasury-plus-e-quase-acao",
      titulo: "Investment grade é quase Treasury; high yield é quase ação",
      resumo: "No grau de investimento, o risco que pesa é o do prazo. No high yield, é o da empresa, e o título passa a andar com a bolsa.",
      tempo: "12:08",
    },
    {
      tipo: "texto",
      paragrafos: [
        "O investment grade, diz o Tony, é uma \"Treasury plus\": quase a mesma segurança, uma taxa um pouco maior. O calote histórico fica abaixo de meio por cento ao ano, com um porém: a empresa que vai mal costuma cair primeiro para o high yield, e o eventual default entra na conta do outro grupo. O prazo médio é mais longo, com duration, a medida de quanto o preço reage aos juros, de 5 a 7 anos. No índice da ICE, pelo ETF que o replica, eram 6 anos em outubro de 2026.",
        "Por isso o risco principal do investment grade é o mesmo da Treasury: juros subindo. E, por isso, o Tony diz que ele melhora a relação entre retorno e oscilação da carteira, o Sharpe que você viu na aula 1, sem trazer muito risco novo.",
      ],
    },
    {
      tipo: "texto",
      tempo: "14:16",
      paragrafos: [
        "O high yield é quase o contrário. Empresas menores, mais endividadas, de setores que sofrem mais com o ciclo, como petróleo. O prazo é mais curto, com duration perto de 3 anos, e o risco que pesa é o de crédito. Na prática, diz o Tony, o título passa a seguir a ação da própria empresa.",
        "Há uma razão de fundo para isso. Quando uma empresa está muito endividada, o credor está, na prática, vendendo um seguro aos acionistas: se o negócio afundar, eles entregam a empresa e o prejuízo fica com quem emprestou. Quanto mais frágil a empresa, mais o título reage às mesmas notícias que movem a ação.",
      ],
    },
    {
      tipo: "comparativo",
      titulo: "Dois bichos diferentes: um sofre com juros, o outro com recessão",
      subtitulo: "Índices de títulos corporativos americanos",
      opcoes: [
        { nome: "Investment grade", resumo: "BBB- para cima" },
        { nome: "High yield", resumo: "BB+ para baixo", destaque: true },
      ],
      metricas: [
        { rotulo: "Prêmio sobre a Treasury, 5/out/2026", valores: [0.84, 3.12], formato: { sufixo: " p.p.", casas: 2 } },
        { rotulo: "Taxa total, 5/out/2026", valores: [6.03, 8.15], formato: { sufixo: "% a.a.", casas: 2 } },
        { rotulo: "Duration, em anos", valores: [6.06, 3.25], formato: { casas: 1 } },
        { rotulo: "Retorno em 2022, juros subindo", valores: [-15.76, -11.19], formato: { base: "pct", sinal: true } },
        { rotulo: "Retorno em 2023", valores: [8.52, 13.44], formato: { base: "pct", sinal: true } },
      ],
      fonte: "ICE BofA US Corporate e US High Yield via FRED; iShares (USIG e HYG, 6/out/2026); Bloomberg US Corporate e US Corporate High Yield via YCharts",
      nota: "A duration do high yield é a do ETF HYG, que segue um índice da Markit (iBoxx), não o da ICE. Retornos totais em dólar.",
    },
    {
      tipo: "texto",
      tempo: "15:29",
      paragrafos: [
        "Sobre o calote do high yield, o Tony dá uma média de 4% ao ano, de 2% a 3% nos anos bons e de 4% a 5% nas crises. A média bate com a da S&P para os Estados Unidos desde 1981: 4,1%. As crises, porém, foram mais duras do que a fala sugere. Em 1991, 2001 e 2009, mais de 10% das empresas do grupo deram calote no ano. O próprio Tony avisa que a distribuição não é normal: os calotes vêm em ondas, concentrados nas recessões.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "O calote no high yield vem em ondas, e passou de 10% em três crises",
      subtitulo: "Empresas americanas de nota high yield que deram default no ano, em %",
      forma: "barra",
      eixoX: anosDefault,
      series: [{ nome: "Default no high yield", valores: defaultHy, destaque: true }],
      formato: { sufixo: "%", casas: 1 },
      referencia: { valor: 4.1, rotulo: "Média de 1981 a 2024" },
      marcos: [
        { em: "1991", rotulo: "Recessão e crise das S&Ls" },
        { em: "2001", rotulo: "Bolha da internet" },
        { em: "2009", rotulo: "Crise financeira" },
        { em: "2020", rotulo: "Pandemia" },
      ],
      fonte: "S&P Global Ratings, 2024 Annual Global Corporate Default and Rating Transition Study, tabela 5",
      nota: "Estados Unidos, Bermudas e Ilhas Cayman; inclui trocas de dívida forçadas. Em 2025, a taxa em 12 meses até novembro era de 4,0% (S&P, dez/2025).",
    },
    {
      tipo: "texto",
      tempo: "25:16",
      paragrafos: [
        "Outra forma de ver a diferença é decompor a taxa. No dia em que o Tony gravou, um título investment grade pagava perto de 5,3%, uns 0,9 ponto acima da Treasury: cerca de 80% da taxa vinha da Treasury e 20% do prêmio de crédito. No high yield, diz ele, a proporção não chega a inverter, mas o prêmio pesa muito mais.",
        "Com os números de 5 de outubro de 2026, o desenho é o mesmo, com tudo um pouco mais alto, porque a Treasury subiu. No investment grade, o prêmio era 14% da taxa. No high yield, 38%.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "No investment grade, quase toda a taxa é Treasury; no high yield, o prêmio pesa muito mais",
      subtitulo: "Taxa total dos índices, em % ao ano, separada em base e prêmio de crédito",
      forma: "barraEmpilhada",
      eixoX: ["Investment grade", "High yield"],
      series: [
        { nome: "Parte que vem da Treasury", valores: [5.19, 5.03], cor: "cinzaClaro" },
        { nome: "Prêmio de crédito", valores: [0.84, 3.12], destaque: true },
      ],
      formato: { sufixo: "%", casas: 2 },
      fonte: "ICE BofA US Corporate e US High Yield (taxa efetiva e prêmio ajustado pelas opções), via FRED, 5/out/2026",
      nota: "A parte da Treasury é a taxa total do índice menos o prêmio: conta aproximada, porque o prêmio é medido contra toda a curva do Tesouro.",
    },
    {
      tipo: "texto",
      tempo: "10:18",
      paragrafos: [
        "Quem emite investment grade? Bancos, grandes empresas e, cada vez mais, as big techs. Durante anos elas quase não precisaram de dívida, porque sobrava caixa. Com a corrida pela inteligência artificial, isso mudou. No começo, a construção de data centers saiu do caixa próprio; desde 2025, sai também de dívida. A Oracle vendeu US$ 18 bilhões em títulos em setembro de 2025, e a Meta, US$ 30 bilhões em outubro, com pedidos de cerca de US$ 125 bilhões. O Tony vê nessa nova procura por dinheiro uma das razões para os juros americanos mais altos.",
        "Os bancos e as financeiras continuam sendo o maior setor do investment grade, porque balanço grande de um lado pede muita dívida do outro: o Tony fala em 28%; no índice da ICE, pela carteira do ETF que o replica, bancos, seguradoras e fundos imobiliários somavam perto de 31% em outubro de 2026. Tecnologia, diz ele, deve virar em breve o segundo maior setor.",
      ],
    },
    {
      tipo: "grafico",
      tempo: "36:03",
      titulo: "Depois do pico da pandemia, a dívida para a IA levou a emissão de volta ao topo",
      subtitulo: "Emissão bruta de títulos corporativos nos EUA, em US$ trilhões por ano",
      forma: "barra",
      eixoX: anosEmissao,
      series: [{ nome: "Emissão", valores: emissao, destaque: true }],
      formato: { prefixo: "US$ ", sufixo: " tri", casas: 2 },
      marcos: [
        { em: "2020", rotulo: "Pandemia: juros perto de zero" },
        { em: "2025", rotulo: "Dívida para a IA" },
      ],
      fonte: "SIFMA, Capital Markets Fact Book 2026 (tabela 35) e US Corporate Bonds Statistics (out/2026)",
      nota: "Inclui investment grade e high yield, financeiras e não financeiras. A última barra cobre só janeiro a setembro.",
    },
    {
      tipo: "texto",
      tempo: "38:50",
      paragrafos: [
        "Na aula, a emissão aparece como líquida. É bruta: a SIFMA soma tudo o que foi vendido, sem descontar o que venceu. O pico de 2020 tem explicação simples: com juros perto de zero, as empresas aproveitaram para alongar dívida barata, e acertaram. O de 2025 e 2026 tem outra: não é o juro baixo, que não está, mas a necessidade de financiar a IA.",
        "Daí vem também a novidade que o Tony chama de \"nova mania\": dívida com garantia em chips. A CoreWeave, que aluga capacidade de processamento, levantou US$ 2,3 bilhões em 2023 dando como garantia seus processadores H100 da NVIDIA, e repetiu a fórmula em escala maior depois. Um ajuste de valor: na aula, cada chip vale de 50 mil a 100 mil dólares. A unidade de um H100 ou de um B200 sai por algo entre 25 mil e 40 mil; os valores maiores são de módulos e servidores que juntam vários deles. A lição é a de sempre: olhe o que está na garantia, como ela se deprecia e que opções o título carrega.",
      ],
    },

    // ---- 6. A fronteira --------------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "a-fronteira",
      titulo: "A fronteira: quando o anjo cai",
      resumo: "Entre o BBB- e o BB+ há um degrau de verdade. Quem cai dele é vendido à força, e às vezes volta.",
      tempo: "17:04",
    },
    {
      tipo: "destaque",
      texto: "A regra define quem compra, o ciclo define quanto se paga.",
      fonte: "Tony Volpon, na aula, 17:04",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Seguradoras, fundos de pensão e fundos patrimoniais de universidades costumam ter uma regra no mandato: só podem comprar investment grade. Isso cria compradores cativos, que não têm alternativa, e comprador cativo derruba a taxa. Bancos pagam mais capital regulatório para carregar high yield, o que reforça a separação.",
        "Agora imagine uma empresa com nota BBB- que é rebaixada para BB+. Num dia, todos esses compradores passam a ser obrigados a vender. Pode haver um prazo de enquadramento, mas a venda vai acontecer. O preço cai mais do que o risco da empresa mudou de verdade. Por isso, diz o Tony, essa fronteira não é um rótulo simbólico: é um salto de preço e de taxa. Quem cai dela ganha um apelido, fallen angel, o anjo caído.",
      ],
    },
    {
      tipo: "fluxo",
      tempo: "18:13",
      titulo: "O caminho do anjo caído",
      nos: [
        { titulo: "Empresa BBB-", texto: "Último degrau do investment grade." },
        { titulo: "Rebaixamento para BB+", texto: "A economia desacelera e a empresa não se ajusta.", sentido: "desce" },
        { titulo: "Venda forçada", texto: "Fundos com mandato só de investment grade precisam sair.", sentido: "sobe" },
        { titulo: "Preço cai além do risco", texto: "A taxa sobe de uma vez, num salto.", sentido: "desce" },
        { titulo: "Comprador de high yield entra", texto: "Leva o título com desconto.", sentido: "sobe" },
        { titulo: "Se a empresa se recupera", texto: "Volta ao investment grade e o título se valoriza.", sentido: "sobe" },
      ],
      ligacoes: ["sofre", "provoca", "derruba o", "atrai o", "e espera"],
      fonte: "Síntese da aula",
    },
    {
      tipo: "texto",
      tempo: "5:03",
      paragrafos: [
        "O Brasil é o exemplo que o Tony usa. Uma correção de data: o país perdeu o grau de investimento em 2015, não em 2016. Primeiro na S&P, em setembro de 2015; depois na Fitch, em dezembro. A Moody's foi a última, em fevereiro de 2016. Desde então, o Brasil vive na fronteira: caiu mais um pouco, subiu de novo e hoje está a um degrau do grau de investimento na Moody's e a dois na S&P e na Fitch. Não desceu ao CCC ou ao D, como a Argentina e a Venezuela.",
      ],
    },
    {
      tipo: "linhaDoTempo",
      titulo: "O Brasil entrou, saiu e ficou na antessala do grau de investimento",
      subtitulo: "Nota de longo prazo do Brasil em moeda estrangeira",
      eventos: [
        { data: "abr/2008", titulo: "S&P dá o grau de investimento", texto: "O Brasil sobe para BBB-; Fitch e Moody's vêm depois." },
        { data: "set/2015", titulo: "S&P rebaixa para BB+", texto: "Primeira agência a tirar o grau, no meio da recessão." },
        { data: "dez/2015", titulo: "Fitch rebaixa para BB+", texto: "Segunda agência." },
        { data: "fev/2016", titulo: "Moody's rebaixa para Ba2", texto: "Corte de dois degraus, de Baa3 direto para Ba2." },
        { data: "out/2024", titulo: "Moody's sobe para Ba1", texto: "Um degrau abaixo do grau de investimento." },
        { data: "2026", titulo: "Hoje: BB, BB e Ba1", texto: "S&P e Fitch a dois degraus do corte; Moody's a um." },
      ],
      fonte: "S&P, Fitch e Moody's, ações de rating; República Federativa do Brasil, prospecto de emissão registrado na SEC (abr/2026)",
      nota: "Escalas da S&P e da Fitch (BB+, BB) e da Moody's (Ba1, Ba2). Notas de abr/2026.",
    },
    {
      tipo: "texto",
      tempo: "26:37",
      paragrafos: [
        "O BB é a antessala do investment grade. E aqui o mercado de empresas tem uma vantagem sobre o Brasil: muitas que caem acabam voltando. Fazem uma reestruturação, atravessam o pior do ciclo, reforçam o balanço e sobem de novo. O anjo volta ao céu, e quem comprou o título com desconto ganha com a valorização. O Tony vê na fronteira uma oportunidade recorrente, porque recessões americanas costumam ser curtas e a política econômica costuma reagir.",
        "Mais abaixo, do B para baixo, \"tem algo de errado\", nas palavras dele. Às vezes é a alavancagem: empresas compradas por fundos de private equity com muita dívida, uma operação que turbina o retorno do comprador e deixa a empresa bem mais frágil. Às vezes é o setor, que sofre demais com recessão. Nos dois casos, o prêmio tem de pagar por isso.",
      ],
    },

    // ---- 7. Perda esperada ---------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "perda-esperada",
      titulo: "O spread não é de graça: a perda esperada",
      resumo: "A taxa anunciada é a promessa. O que você espera receber é a promessa menos o que pode dar errado.",
      tempo: "19:13",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Pense numa carteira de US$ 100 em títulos high yield. Num ano normal, cerca de 3% das empresas dão calote. Das que dão, você recupera uns 40%; perde, portanto, 60% do que emprestou a elas. Três por cento vezes sessenta por cento dá 1,8%. É isso que você deve esperar perder num ano: US$ 1,80 a cada US$ 100.",
        "Esse número tem nome: perda esperada. É ela, e não o calote sozinho, que importa. Um título com muita chance de calote e boa recuperação pode perder menos do que um com pouca chance e recuperação quase nula. E é contra ela que você mede a taxa. Se o high yield paga, digamos, 2 pontos a mais que o investment grade, 1,8 ponto já está comprometido com a perda média. Sobra pouco para todo o resto.",
      ],
    },
    {
      tipo: "conceito",
      tempo: "21:10",
      termo: "Perda esperada",
      definicao:
        "É a chance de calote multiplicada pelo que se perde quando ele acontece, isto é, a parte do valor que não se recupera. Com 3% de chance e 40% de recuperação, a perda esperada é de 3% vezes 60%, ou 1,8% ao ano. Sempre por ano, porque a chance de calote também é anual.",
      naPratica:
        "Antes de comprar, pergunte se o prêmio paga essa perda e ainda sobra. Num exemplo de um manual clássico de finanças, o título de uma empresa com 20% de chance de calote promete 17,3% ao ano, mas o retorno esperado é de só 5%. Na aula, há um segundo exemplo, com 25% de chance e 50% de recuperação; a conta dá 12,5% de perda esperada, e não 25%, como sai na fala. E se o calote vier, a perda aparece antes: o preço do título cai assim que o mercado começa a precificar a reestruturação.",
      referencia: { autor: "Richard Brealey, Stewart Myers e Franklin Allen", obra: "Princípios de Finanças Corporativas", capitulo: "cap. 23, seção 23.1, retornos sobre a dívida corporativa", ano: 2013 },
    },
    {
      tipo: "texto",
      tempo: "30:00",
      paragrafos: [
        "O gráfico abaixo faz essa conta para cada degrau da escada, com o calote médio da S&P desde 1981, recuperação de 40% e o prêmio pago em 5 de outubro de 2026. Do A ao B, o prêmio cobre com folga a perda média. No CCC, a perda média de um ano passa do prêmio do dia. Não é previsão: em ano bom, a perda é bem menor que a média; em ano de crise, várias vezes maior.",
        "É por isso que o Tony insiste em olhar o papel, e não a média. Recuperação depende da estrutura, das garantias, do setor e do ciclo. E o balanço da empresa precisa ser lido com lupa. Um caso clássico é o da Livent, produtora de teatro americana: pelos números que divulgava, a dívida equivalia a 1,7 ano de geração de caixa; ajustada a contabilidade, eram 5,5 anos. A empresa quebrou em 1998.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Do A ao B, o prêmio cobre a perda média com folga; no CCC, não cobre",
      subtitulo: "Prêmio sobre a Treasury e perda esperada em um ano, em pontos percentuais",
      forma: "barra",
      eixoX: notasPerda,
      series: [
        { nome: "Prêmio pago, 5/out/2026", valores: premioNota, cor: "cinza" },
        { nome: "Perda esperada média em um ano", valores: perdaNota, destaque: true },
      ],
      formato: { sufixo: " p.p.", casas: 2 },
      ilustrativo: true,
      fonte: "Conta do autor sobre S&P Global Ratings (default médio de 1981 a 2024) e ICE BofA via FRED (prêmios de 5/out/2026)",
      nota: "Perda esperada = default médio da nota vezes 60% (recuperação de 40% para todas). Médias de longo prazo; no CCC, a média da S&P inclui as notas CC e C.",
    },
    {
      tipo: "texto",
      tempo: "42:46",
      paragrafos: [
        "Se o prêmio cobre a perda média e ainda sobra, o que é essa sobra? O Tony responde que o spread paga três coisas ao mesmo tempo. A perda que se espera. O medo de que ela seja maior que o esperado, porque calote vem em onda e chega justamente quando tudo vai mal. E a dificuldade de sair na hora errada: título de empresa é bem menos líquido que Treasury, e numa recessão, com as taxas abertas, vender é cristalizar a perda.",
        "Por isso ele recomenda manter liquidez suficiente no resto da carteira para nunca ser obrigado a vender high yield no meio de uma crise. Liquidez, aliás, é um dos pontos que nem os bons manuais de finanças sabem precificar direito: ela some quando mais se precisa dela.",
      ],
    },
    {
      tipo: "tabela",
      titulo: "As três coisas que o spread paga",
      colunas: ["Parte do prêmio", "O que paga", "Quando pesa mais"],
      linhas: [
        ["Perda esperada", "O calote médio vezes o que não se recupera", "Sempre; é o piso do prêmio"],
        ["Medo de perder mais", "A chance de a perda vir maior que a média, e toda de uma vez", "Antes e durante recessões"],
        ["Dificuldade de sair", "A falta de comprador quando você precisa vender", "Nas crises, quando todo mundo quer vender ao mesmo tempo"],
      ],
      fonte: "Síntese da aula",
    },

    // ---- 8. Juros e crédito em lados opostos ---------------------------------------------------------
    {
      tipo: "capitulo",
      id: "lados-opostos",
      titulo: "Juros e crédito puxam para lados opostos",
      resumo: "O investment grade sofre quando os juros sobem; o high yield, quando a economia afunda. Em 2022 e em 2008, cada um teve o seu ano ruim.",
      tempo: "31:27",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Juntando as peças: o investment grade tem mais prazo e menos risco de crédito; o high yield, o contrário. Eles reagem a cenários opostos. Numa economia forte demais, com inflação e Banco Central subindo juros, a Treasury cai, e o investment grade cai junto. O high yield sofre menos, porque o prazo é curto e as empresas vão bem. Numa recessão, o Fed corta juros, a Treasury sobe, e o investment grade acompanha. O high yield sofre, porque os calotes aumentam e o prêmio dispara.",
        "Foi o que aconteceu em 2022, com o surto de inflação: o índice de investment grade perdeu 15,8% e o de high yield, 11,2%. E em 2008, quando a Treasury de 10 anos subiu 20% no ano, como você viu na aula anterior, enquanto o prêmio do high yield passava de 21 pontos.",
      ],
    },
    {
      tipo: "matriz",
      modo: "quadrante",
      titulo: "Cada tipo de crédito tem o seu cenário ruim",
      eixoLinhas: "Tipo de crédito",
      eixoColunas: "O que acontece na economia",
      linhas: ["Investment grade (mais prazo)", "High yield (mais crédito)"],
      colunas: ["Juros sobem com inflação (2022)", "Recessão e corte de juros (2008, 2020)"],
      celulas: [
        [
          {
            texto: "Sofre",
            marca: "Risco de prazo",
            explicacao: "Em 2022, o índice caiu 15,8%. A Treasury de 10 anos perdeu quase 18% e levou o investment grade junto; o prêmio de crédito mudou pouco.",
          },
          {
            texto: "Tende a resistir",
            explicacao: "A queda dos juros da Treasury compensa a alta do prêmio. Em 2020, o índice rendeu 9,9%, mesmo com o prêmio chegando perto de 4 pontos em março.",
          },
        ],
        [
          {
            texto: "Sofre menos",
            explicacao: "Prazo curto e empresas faturando bem. Em 2022, o índice caiu 11,2%, menos que o investment grade.",
          },
          {
            texto: "Sofre muito",
            marca: "Risco de crédito",
            explicacao: "Calotes sobem e o prêmio dispara: passou de 21 pontos em dezembro de 2008. Em 2020, chegou perto de 11 pontos em março, antes de o Fed entrar comprando.",
          },
        ],
      ],
      fonte: "Bloomberg US Corporate e US Corporate High Yield via YCharts; ICE BofA; Federal Reserve, FEDS Notes (out/2020); Damodaran (NYU Stern) para a Treasury",
    },
    {
      tipo: "grafico",
      titulo: "Em 2022, o investment grade perdeu mais que o high yield",
      subtitulo: "Retorno total no ano, em dólar, em %",
      forma: "barra",
      eixoX: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
      series: [
        { nome: "Investment grade", valores: [14.54, 9.89, -1.04, -15.76, 8.52, 2.13, 7.77], destaque: true },
        { nome: "High yield", valores: [14.32, 7.11, 5.28, -11.19, 13.44, 8.19, 8.62] },
      ],
      formato: { base: "pct", sinal: true },
      referencia: { valor: 0, rotulo: "Zero" },
      fonte: "Bloomberg US Corporate Index e Bloomberg US Corporate High Yield Index (retorno total), via YCharts",
      nota: "Em 2020 e 2021, o retrato se inverte: o investment grade ganha mais quando os juros caem, o high yield quando a economia acelera.",
    },
    {
      tipo: "texto",
      tempo: "40:03",
      paragrafos: [
        "O Tony mostra também como os prêmios andaram nos últimos 20 anos. O desenho é sempre o mesmo: sobem de repente nas crises e voltam devagar quando o governo e o Banco Central entram. Em 2008, o prêmio do investment grade foi de cerca de 1 ponto para mais de 6. No high yield, de cerca de 2,4 pontos, em 2007, para mais de 21. Na pandemia, houve um pico menor e mais curto.",
        "Dois ajustes. Na aula, o prêmio do investment grade aparece podendo chegar \"muito perto de zero\". Nunca chegou: o piso histórico fica entre meio ponto e 0,7, e o mínimo dos últimos três anos foi 0,73, em 2026. E, segundo a fala, em 2022 o prêmio do investment grade ficou estável ou até caiu. Ele abriu: no índice da ICE, foi de perto de 0,9 ponto no fim de 2021 para perto de 1,6 em outubro de 2022. A conclusão do Tony continua de pé, porque o que derrubou quem tinha investment grade longo foi a alta da Treasury, bem maior que a do prêmio.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "O prêmio do último andar do investment grade dispara nas crises e depois volta",
      subtitulo: "Taxa dos títulos Baa (Moody's) menos a da Treasury de 10 anos, em pontos percentuais, média mensal",
      forma: "linha",
      eixoX: meses,
      series: [{ nome: "Prêmio do Baa sobre a Treasury", valores: baa10y, destaque: true }],
      formato: { sufixo: " p.p.", casas: 2 },
      faixas: [
        { de: "dez/2007", ate: "jun/2009", rotulo: "Recessão" },
        { de: "fev/2020", ate: "abr/2020", rotulo: "Recessão" },
      ],
      marcos: [
        { em: "dez/2008", rotulo: "Crise financeira" },
        { em: "abr/2020", rotulo: "Pandemia" },
        { em: "jul/2022", rotulo: "Fed sobe juros" },
      ],
      fonte: "Moody's, via FRED (série BAA10YM)",
      nota: "Jan/2006 a set/2026. Baa é o BBB da Moody's. Em dias isolados, o prêmio chegou a 6,16 pontos (dez/2008) e a 4,31 (mar/2020). Recessões pelas datas do NBER.",
    },
    {
      tipo: "grafico",
      tempo: "41:06",
      titulo: "Em toda crise, o prêmio do high yield sobe três a quatro vezes mais",
      subtitulo: "Pico do prêmio sobre a Treasury em cada crise, em pontos percentuais",
      forma: "barra",
      eixoX: ["Dez/2008", "Mar/2020", "Meados de 2022", "5/out/2026"],
      series: [
        { nome: "Investment grade", valores: [6.56, 4.0, 1.65, 0.84] },
        { nome: "High yield", valores: [21.82, 10.87, 5.99, 3.12], destaque: true },
      ],
      formato: { sufixo: " p.p.", casas: 1 },
      fonte: "ICE BofA US Corporate e US High Yield Option-Adjusted Spreads; picos de 2008 e 2022 por levantamentos publicados da série completa; 2020 pelo Federal Reserve (FEDS Notes, out/2020); 2026 via FRED",
      nota: "Máximos diários. O FRED guarda só os últimos três anos destas séries; os picos anteriores são de fontes que leram a série inteira, e os de 2022 são aproximados.",
    },

    // ---- 9. Na carteira -----------------------------------------------------------------------------
    {
      tipo: "capitulo",
      id: "na-carteira",
      titulo: "Na carteira: o crédito diversifica menos do que parece",
      resumo: "O investment grade anda com a Treasury, e o high yield, com a bolsa. O prêmio é real; a diversificação, menor do que o nome sugere.",
      tempo: "32:40",
    },
    {
      tipo: "texto",
      paragrafos: [
        "O Tony retoma a pergunta da aula anterior: eu uso o quê, para quê? Na renda fixa americana, o T-Bill é caixa e a Treasury de 10 anos é a proteção contra a desaceleração. O crédito entra em três papéis diferentes, resumidos abaixo.",
      ],
    },
    {
      tipo: "tabela",
      titulo: "Três jeitos de usar o crédito corporativo",
      colunas: ["Faixa", "Como se comporta", "O papel na carteira", "O risco que você assume"],
      linhas: [
        ["Investment grade", "Segue a Treasury, com taxa um pouco maior", "Uma quase Treasury que paga mais", "Juros subindo, sobretudo nos prazos longos"],
        ["Fronteira BB", "Mistura de prazo e crédito", "Aposta na recuperação de fallen angels", "A empresa não se recuperar e seguir caindo"],
        ["High yield de B para baixo", "Segue a bolsa e o ciclo", "Risco de crédito puro, com taxa alta", "Calotes numa recessão, quando vender é pior"],
      ],
      fonte: "Síntese da aula",
    },
    {
      tipo: "destaque",
      texto: "High yield diversifica menos do que o nome sugere.",
      fonte: "Tony Volpon, na aula, 44:09",
    },
    {
      tipo: "texto",
      tempo: "44:09",
      paragrafos: [
        "A gente costuma pensar que renda fixa protege da bolsa. No high yield, nem tanto: o título anda muito junto com a ação da própria empresa. Oscila menos, e o credor recebe antes do acionista num calote, mas, para diversificar uma carteira que já tem ações, o efeito é pequeno. O mesmo vale, do outro lado, para o investment grade em relação à Treasury: você ganha o prêmio a mais, mas pouca diversificação nova.",
        "No exercício de Sharpe da aula, montado com números hipotéticos, o Tony compara carteiras. Uma com 60% em S&P 500 e 40% em investment grade chega ao mesmo Sharpe de outra com bolsa, investment grade e high yield, e as duas superam a carteira só de ações. A explicação é a correlação alta entre high yield e bolsa: acrescentar high yield a quem já tem ações não muda muito o jogo. Um detalhe: a segunda carteira aparece na fala como 50% em S&P 500, 30% em investment grade e 25% em high yield, o que soma 105%. Vale a ideia, não a proporção.",
      ],
    },
    {
      tipo: "texto",
      tempo: "47:25",
      paragrafos: [
        "As cinco mensagens da aula. Crédito corporativo é a empresa tomando dinheiro direto do investidor. Investment grade e high yield são dois mundos, separados por uma fronteira, entre o BBB- e o BB+, onde há um salto de preço e, muitas vezes, oportunidade. O investment grade carrega mais risco de prazo e segue a Treasury; o high yield carrega risco de crédito e segue a bolsa. Os prêmios mudam muito com o momento econômico. E, numa crise, os dois abrem enquanto a Treasury fecha: o resultado depende de qual força ganha.",
        "Em todos os casos, o prêmio é pagamento por um risco que existe, e não um presente. Na próxima aula, o Tony sai da renda fixa e vai para as ações americanas.",
      ],
    },
    {
      tipo: "destaque",
      texto: "Não existe free lunch em nenhum mercado. Sempre haverá situações em que aquele investimento, se está te pagando mais na largada, pode sofrer mais que a alternativa.",
      fonte: "Tony Volpon, na aula, 13:25",
    },

    // ---- referências --------------------------------------------------------------------------------
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Richard A. Brealey, Stewart C. Myers e Franklin Allen",
          titulo: "Princípios de Finanças Corporativas, 10ª edição",
          ano: 2013,
          nota: "Títulos corporativos, ratings e spreads (cap. 3); incentivos e a crise do subprime (cap. 13); yield prometido e retorno esperado, a opção de inadimplência, ratings e previsão de default (cap. 23); garantias, prioridade e recuperação (cap. 24); o que não sabemos sobre liquidez e crises (cap. 34).",
        },
        {
          autor: "Alexandre Assaf Neto",
          titulo: "Mercado Financeiro, 12ª edição",
          ano: 2014,
          nota: "Bonds internacionais e o prêmio sobre a Treasury (cap. 5, seção 5.3.6); rating, grau de investimento e junk bonds (cap. 5, seção 5.3.7).",
        },
        {
          autor: "Alexandre Assaf Neto",
          titulo: "Matemática Financeira e suas Aplicações, 12ª edição",
          ano: 2012,
          nota: "Decomposição da taxa em taxa pura, prêmio de risco e inflação (cap. 11).",
        },
        {
          autor: "John D. Stowe, Thomas R. Robinson, Jerald E. Pinto e Dennis W. McLeavey",
          titulo: "Analysis of Equity Investments: Valuation",
          ano: 2002,
          nota: "O caso Livent e o EBITDA que engana sobre a capacidade de pagar dívida (cap. 1).",
        },
        {
          autor: "Zvi Bodie, Alex Kane e Alan J. Marcus",
          titulo: "Investments, 10ª edição",
          ano: 2014,
          nota: "Prêmio de risco e índice de Sharpe (caps. 5 e 6).",
        },
        {
          autor: "S&P Global Ratings",
          titulo: "2024 Annual Global Corporate Default and Rating Transition Study; U.S. Recovery Study",
          ano: 2025,
          nota: "Default médio em um ano por nota e default anual do high yield americano, 1981 a 2024 (mar/2025); recuperação de títulos americanos (dez/2025).",
        },
        {
          autor: "ICE Data Indices e Moody's, via FRED (Federal Reserve Bank of St. Louis)",
          titulo: "ICE BofA US Corporate, US High Yield e índices por nota (prêmios e taxas efetivas); série BAA10YM",
          ano: 2026,
          nota: "Prêmios e taxas de 5/out/2026; prêmio do Baa sobre a Treasury de 10 anos, jan/2006 a set/2026.",
        },
        {
          autor: "SIFMA",
          titulo: "Capital Markets Fact Book 2026; US Corporate Bonds Statistics; Research Quarterly",
          ano: 2026,
          nota: "Estoque de títulos corporativos, emissão anual de 2015 a 2025, emissão de 2026 até setembro e fatia do investment grade.",
        },
        {
          autor: "Federal Reserve Board",
          titulo: "The Corporate Bond Market Crises and the Government Response (FEDS Notes)",
          ano: 2020,
          nota: "Os prêmios de investment grade e high yield em março de 2020.",
        },
        {
          autor: "BlackRock (iShares) e Bloomberg Index Services, via YCharts",
          titulo: "Páginas dos ETFs USIG e HYG; Bloomberg US Corporate e US Corporate High Yield",
          ano: 2026,
          nota: "Duration, composição por nota e por setor (out/2026); retornos anuais de 2019 a 2025.",
        },
      ],
    },
  ],
};

export default secao;

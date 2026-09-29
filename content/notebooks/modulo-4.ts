import { volatilidadeCarteira, type Notebook } from "@/lib/notebook";

// Módulo IV, Ativos Digitais em Dólar. CONTEÚDO DE DEMONSTRAÇÃO: as volatilidades e a correlação
// do gráfico são hipóteses redondas para mostrar a conta, não medições de nenhum ativo. Trocar
// pelo definitivo e virar `demo` para `false`.

const pesos = [0, 2.5, 5, 10, 15, 20];
// Ativo digital hipotético com 60% de volatilidade anual, resto da carteira com 12%, correlação 0,2.
const vol = pesos.map((p) => Math.round(volatilidadeCarteira(p / 100, 12, 60, 0.2) * 10) / 10);

const notebook: Notebook = {
  modulo: 4,
  titulo: "Ativos digitais com método",
  subtitulo:
    "Bitcoin, Ethereum, tokens e ETFs: quanto cabe na carteira, como guardar e o que olhar além do preço.",
  demo: true,
  blocos: [
    {
      tipo: "capitulo",
      id: "peso",
      titulo: "Quanto cabe na carteira",
      resumo: "Um ativo muito volátil pesa na carteira bem mais do que o tamanho da posição sugere.",
      aula: 1,
    },
    {
      tipo: "texto",
      capitular: true,
      aula: 1,
      paragrafos: [
        "Criptoativos oscilam muito mais do que ações e títulos, e isso muda a pergunta certa. Em vez de discutir se o Bitcoin vai subir, o módulo parte de quanto dessa oscilação a sua carteira consegue absorver sem que você mude de plano no pior momento.",
        "O gráfico abaixo mostra a conta com números redondos e hipotéticos. Com posições pequenas, a oscilação total quase não se mexe; a partir de certo peso, cada ponto a mais no ativo volátil passa a dominar o comportamento da carteira inteira.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Volatilidade da carteira conforme o peso de um ativo muito volátil",
      forma: "barra",
      eixoX: pesos.map((p) => `${p.toLocaleString("pt-BR")}%`),
      series: [{ nome: "Volatilidade anual da carteira", valores: vol }],
      formato: { sufixo: "%", casas: 1 },
      ilustrativo: true,
      nota:
        "Dados ilustrativos. Ativo hipotético com 60% de volatilidade anual, resto da carteira com 12% e correlação de 0,2. Não é medição de nenhum criptoativo.",
      aula: 1,
    },
    {
      tipo: "destaque",
      texto: "Posição pequena, regra de rebalanceamento escrita antes da compra e custódia resolvida antes do primeiro aporte.",
      fonte: "Síntese do módulo",
    },
    {
      tipo: "texto",
      aula: 3,
      paragrafos: [
        "Para quem não quer cuidar de chave privada, os ETFs regulados de ativos digitais oferecem exposição pela corretora, com custo anual e sem a custódia direta. Para quem acompanha de perto, as métricas on-chain, como fluxo entre carteiras e atividade da rede, mostram um lado do mercado que o gráfico de preço não mostra.",
      ],
    },
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Satoshi Nakamoto",
          titulo: "Bitcoin: A Peer-to-Peer Electronic Cash System",
          ano: 2008,
          nota: "O artigo original que descreve o Bitcoin. Nove páginas.",
        },
        {
          autor: "Saifedean Ammous",
          titulo: "The Bitcoin Standard",
          ano: 2018,
          nota: "A tese do Bitcoin como dinheiro sólido, com a história monetária por trás dela.",
        },
        {
          autor: "Paul Vigna e Michael J. Casey",
          titulo: "The Age of Cryptocurrency",
          ano: 2015,
          nota: "A origem do Bitcoin e do blockchain contada por dois jornalistas do Wall Street Journal.",
        },
      ],
    },
  ],
};

export default notebook;

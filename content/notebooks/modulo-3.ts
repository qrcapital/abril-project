import { composto, type Notebook } from "@/lib/notebook";

// Módulo III, Como Acessar o Mercado Americano. CONTEÚDO DE DEMONSTRAÇÃO: o gráfico aproxima o
// efeito do custo anual descontando a taxa do retorno hipotético de 6%. Não é o custo de nenhum
// produto real. Trocar pelo definitivo e virar `demo` para `false`.
//
// Uma seção por aula, pela posição da aula no módulo. A aula 2 (REITs) ainda não tem conteúdo e
// aparece no notebook como em produção.

const anos = [0, 5, 10, 15, 20, 25, 30];

const notebook: Notebook = {
  modulo: 3,
  titulo: "Os veículos de acesso",
  subtitulo:
    "ETF, REIT e BDR resolvem o mesmo problema de jeitos diferentes. O custo de cada um aparece devagar e pesa muito.",
  demo: true,
  aulas: [
    {
      aula: 1,
      blocos: [
        {
          tipo: "capitulo",
          id: "veiculos",
          titulo: "Três portas para o mesmo mercado",
          resumo: "Onde cada veículo negocia, em que moeda, e o que você está comprando de fato.",
        },
        {
          tipo: "texto",
          capitular: true,
          paragrafos: [
            "Um ETF é uma cesta de ativos negociada como se fosse uma ação só. Com uma ordem você compra centenas de empresas, ou títulos, ou um setor inteiro, e paga uma taxa anual pela gestão da cesta. É o caminho mais direto para diversificar sem montar a carteira papel por papel.",
            "O REIT faz o mesmo pelo mercado imobiliário: é uma empresa dona de imóveis que distribui a maior parte da renda de aluguel. Já o BDR é outra coisa, um certificado negociado na B3 que representa um ativo de fora. Ele dá exposição ao ativo e ao câmbio sem abrir conta no exterior, mas a negociação, a custódia e as regras são as da bolsa brasileira.",
          ],
        },
        {
          tipo: "grafico",
          titulo: "US$ 100 mil por 30 anos, com custo anual de 0,1% e de 1%",
          forma: "linha",
          eixoX: anos.map((t) => (t === 0 ? "Hoje" : `${t} anos`)),
          series: [
            { nome: "Custo de 0,1% ao ano", valores: composto(100_000, 5.9, anos) },
            { nome: "Custo de 1% ao ano", valores: composto(100_000, 5, anos) },
          ],
          formato: { prefixo: "US$ " },
          ilustrativo: true,
          nota:
            "Dados ilustrativos. Retorno hipotético de 6% ao ano, descontado o custo. Sem impostos nem câmbio. Não representa nenhum fundo.",
        },
        {
          tipo: "numero",
          valor: "US$ 126 mil",
          legenda: "é a diferença no fim de 30 anos entre as duas curvas acima, só por causa do custo anual.",
          nota: "Conta sobre as hipóteses do gráfico.",
        },
      ],
    },
    {
      aula: 3,
      blocos: [
        {
          tipo: "tabela",
          titulo: "Os três veículos lado a lado",
          colunas: ["Veículo", "O que você compra", "Onde negocia", "Moeda da negociação"],
          linhas: [
            ["ETF", "Uma cesta de ativos num único papel", "Bolsa americana", "Dólar"],
            ["REIT", "Empresa dona de imóveis que distribui renda", "Bolsa americana", "Dólar"],
            ["BDR", "Certificado que representa um ativo de fora", "B3", "Real"],
          ],
          nota: "Resumo simplificado. Os detalhes de cada veículo, inclusive a tributação, estão nas aulas.",
        },
      ],
    },
    {
      aula: 4,
      blocos: [
        {
          tipo: "texto",
          paragrafos: [
            "O último capítulo do módulo é o menos glamouroso e o que mais custa quando é ignorado: imposto e sucessão. Ativo no exterior entra na declaração, tem regra própria de apuração e, sem planejamento, pode passar por um inventário em outro país. As regras mudam com alguma frequência, e por isso a aula trata do raciocínio antes das alíquotas.",
          ],
        },
        {
          tipo: "referencias",
          itens: [
            {
              autor: "John C. Bogle",
              titulo: "The Little Book of Common Sense Investing",
              ano: 2007,
              nota: "O argumento do fundador da Vanguard a favor de fundos de índice de baixo custo.",
            },
            {
              autor: "William J. Bernstein",
              titulo: "The Four Pillars of Investing",
              ano: 2002,
              nota: "Teoria, história, psicologia e o negócio dos investimentos, em quatro partes.",
            },
            {
              autor: "Burton G. Malkiel",
              titulo: "A Random Walk Down Wall Street",
              ano: 1973,
              nota: "Mercados eficientes e o caso do investimento indexado.",
            },
          ],
        },
      ],
    },
  ],
};

export default notebook;

import type { Notebook } from "@/lib/notebook";

// Módulo I, Macro e Estratégia Global. CONTEÚDO DE DEMONSTRAÇÃO: o gráfico é aritmética sobre
// taxas hipotéticas (quantos anos até a moeda perder metade do poder de compra), não série
// histórica. Trocar pelo definitivo e virar `demo` para `false`.

const inflacoes = [2, 4, 6, 8, 10];
const metade = inflacoes.map((i) => Math.round((Math.log(2) / Math.log(1 + i / 100)) * 10) / 10);

const notebook: Notebook = {
  modulo: 1,
  titulo: "O mundo em ciclos",
  subtitulo:
    "Moeda de reserva, inflação e câmbio: a macro que decide quanto vale o seu patrimônio quando você mede em dólar.",
  demo: true,
  blocos: [
    {
      tipo: "capitulo",
      id: "reserva",
      titulo: "O dólar no centro do sistema",
      resumo: "Por que uma moeda serve de régua para o comércio, a dívida e as reservas do mundo.",
      aula: 2,
    },
    {
      tipo: "texto",
      capitular: true,
      aula: 2,
      paragrafos: [
        "Desde o fim da Segunda Guerra, o dólar ocupa um lugar que nenhuma outra moeda ocupa: é nele que se precifica boa parte do comércio internacional, que governos guardam reservas e que empresas do mundo inteiro tomam dívida. Essa posição não é eterna, e a história das moedas de reserva mostra trocas de guarda, mas elas costumam levar décadas.",
        "Para quem investe a partir do Brasil, a consequência prática é simples de dizer e difícil de ignorar: o dólar é a unidade em que o resto do mundo mede valor. Medir o próprio patrimônio só em reais é olhar para ele com uma régua que encolhe quando a inflação daqui corre mais rápido que a de lá.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Anos até uma moeda perder metade do poder de compra, por inflação anual",
      forma: "barra",
      eixoX: inflacoes.map((i) => `${i}% ao ano`),
      series: [{ nome: "Anos até a metade", valores: metade }],
      formato: { sufixo: " anos", casas: 1 },
      ilustrativo: true,
      nota:
        "Conta ilustrativa: ln(2) dividido por ln(1 + inflação), com inflação constante. Não descreve nenhum país nem período.",
      aula: 1,
    },
    {
      tipo: "numero",
      valor: "72",
      legenda:
        "A regra de bolso: divida 72 pela inflação anual e você tem, com boa aproximação, os anos até o poder de compra cair pela metade.",
      nota: "Aproximação. A conta exata está no gráfico acima.",
      aula: 1,
    },
    {
      tipo: "texto",
      aula: 4,
      paragrafos: [
        "Juros e câmbio andam em ciclos, e quase ninguém acerta o momento de virada. A estratégia do módulo parte daí: em vez de tentar adivinhar a próxima alta do dólar, construir uma fatia permanente em moeda forte, do tamanho que o seu perfil aguenta, e rebalancear com regra.",
        "O simulador abaixo isola um só efeito, o do câmbio. Ele ignora de propósito rendimento, imposto e custo, para mostrar só quanto a fatia em dólar protege o poder de compra quando o real perde valor a um ritmo constante.",
      ],
    },
    {
      tipo: "comparador",
      id: "simulador",
      modelo: "cambio",
      titulo: "Câmbio e poder de compra",
      descricao:
        "Poder de compra em dólar de uma carteira, com início em 100, quando o real perde valor a uma taxa fixa. Hipóteses ajustáveis e só ilustrativas.",
      hipoteses: { depreciacao: 4, anos: 10, fatia: 0.3 },
      aula: 3,
    },
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Ray Dalio",
          titulo: "Principles for Dealing with the Changing World Order",
          ano: 2021,
          nota: "Ciclos de dívida e a ascensão e queda de moedas de reserva ao longo de cinco séculos.",
        },
        {
          autor: "Barry Eichengreen",
          titulo: "Exorbitant Privilege",
          ano: 2011,
          nota: "Como o dólar virou a moeda de reserva do mundo e o que poderia desafiá-lo.",
        },
        {
          autor: "Carmen M. Reinhart e Kenneth S. Rogoff",
          titulo: "This Time Is Different",
          ano: 2009,
          nota: "Oito séculos de crises de dívida, bancárias e cambiais, com dados.",
        },
      ],
    },
  ],
};

export default notebook;

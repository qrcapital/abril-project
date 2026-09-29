import { composto, type Notebook } from "@/lib/notebook";

// Módulo II, Renda Fixa e Ações nos EUA. CONTEÚDO DE DEMONSTRAÇÃO: as curvas são juros compostos
// sobre taxas hipotéticas, não retorno de nenhum ativo. Trocar pelo definitivo e virar `demo`
// para `false`.

const anos = [0, 5, 10, 15, 20, 25, 30];

const notebook: Notebook = {
  modulo: 2,
  titulo: "Renda e crescimento em dólar",
  subtitulo:
    "Do Tesouro americano às ações: o que muda quando o seu dinheiro trabalha em moeda forte por muito tempo.",
  demo: true,
  blocos: [
    {
      tipo: "capitulo",
      id: "tempo",
      titulo: "O tempo como sócio",
      resumo: "A diferença entre duas taxas parece pequena num ano e enorme em trinta.",
      aula: 1,
    },
    {
      tipo: "texto",
      capitular: true,
      aula: 1,
      paragrafos: [
        "O título do Tesouro americano é a referência de risco baixo do mercado global: é contra ele que quase todo outro investimento em dólar se compara. Para o investidor brasileiro, ele cumpre um papel que o CDI cumpre aqui, com a diferença de que o rendimento vem na moeda em que o mundo mede valor.",
        "Acima dessa base estão o crédito privado e as ações, e cada degrau pede mais tolerância a oscilação em troca de mais retorno esperado. O gráfico abaixo não fala de nenhum desses ativos. Ele mostra só a matemática que faz a escolha pesar tanto: juros compostos, ao longo de três décadas.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "US$ 10 mil a 4% e a 7% ao ano, ao longo de 30 anos",
      forma: "area",
      eixoX: anos.map((t) => (t === 0 ? "Hoje" : `${t} anos`)),
      series: [
        { nome: "7% ao ano", valores: composto(10_000, 7, anos) },
        { nome: "4% ao ano", valores: composto(10_000, 4, anos) },
      ],
      formato: { prefixo: "US$ " },
      ilustrativo: true,
      nota:
        "Dados ilustrativos. Taxas hipotéticas e constantes, sem impostos, custos ou inflação. Não representam o retorno de nenhum título ou ação.",
      aula: 3,
    },
    {
      tipo: "numero",
      valor: "2,3x",
      legenda: "é quanto maior termina o mesmo capital a 7% em vez de 4% ao ano, depois de 30 anos.",
      nota: "Conta sobre as taxas hipotéticas do gráfico acima.",
    },
    {
      tipo: "texto",
      aula: 4,
      paragrafos: [
        "Dividendos e crescimento são duas maneiras de receber o mesmo retorno: uma paga parte dele em dinheiro ao longo do caminho, a outra reinveste dentro da empresa. Nenhuma é superior em tese. A escolha depende de quando você precisa do dinheiro e de como cada forma é tributada para quem mora no Brasil, assunto que volta no Módulo III.",
      ],
    },
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Jeremy J. Siegel",
          titulo: "Stocks for the Long Run",
          ano: 1994,
          nota: "Séries longas de retorno de ações, títulos e ouro nos Estados Unidos.",
        },
        {
          autor: "Benjamin Graham",
          titulo: "The Intelligent Investor",
          ano: 1949,
          nota: "A diferença entre investir e especular, e a ideia de margem de segurança.",
        },
      ],
    },
  ],
};

export default notebook;

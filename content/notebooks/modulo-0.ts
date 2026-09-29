import type { Notebook } from "@/lib/notebook";

// Módulo 0, "Comece por aqui". CONTEÚDO DE DEMONSTRAÇÃO: estrutura real, texto e números de
// exemplo. Os números são contas sobre hipóteses declaradas na própria nota do gráfico, nunca
// estatística de mercado. Trocar pelo definitivo e virar `demo` para `false`.

const notebook: Notebook = {
  modulo: 0,
  titulo: "Por que olhar para fora",
  subtitulo:
    "O argumento da formação em um gráfico, uma frase e um simulador. Volte aqui quando quiser lembrar por que começou.",
  demo: true,
  blocos: [
    {
      tipo: "capitulo",
      id: "moeda-unica",
      titulo: "O risco de uma moeda só",
      resumo: "Patrimônio inteiro em reais é uma aposta concentrada, mesmo quando parece a escolha neutra.",
      aula: 1,
    },
    {
      tipo: "texto",
      capitular: true,
      aula: 1,
      paragrafos: [
        "Quem mora no Brasil costuma ter tudo no Brasil: o imóvel, a previdência, a reserva de emergência e a carteira de investimentos. Parece a escolha sem risco, porque é a escolha de quase todo mundo, mas na prática é uma posição concentrada numa moeda, num sistema de juros e num ambiente político.",
        "Diversificar para fora não é prever que o real vai cair. É reconhecer que você não sabe, e que os seus planos, como uma viagem, uma faculdade no exterior ou a aposentadoria, muitas vezes têm preço em dólar mesmo quando a vida acontece aqui.",
      ],
    },
    {
      tipo: "grafico",
      titulo: "Uma queda de 20% nos ativos brasileiros, medida na carteira inteira",
      forma: "barra",
      eixoX: ["Nada fora", "25% fora", "50% fora", "75% fora"],
      series: [{ nome: "Perda da carteira", valores: [20, 15, 10, 5] }],
      formato: { sufixo: "%" },
      ilustrativo: true,
      nota:
        "Dados ilustrativos. Supõe que só a parte brasileira cai 20%, medida em dólar, e que a parte no exterior fica parada. Não é previsão nem histórico.",
      aula: 1,
    },
    {
      tipo: "destaque",
      texto:
        "Dolarizar não é apostar contra o Brasil. É deixar de depender de uma moeda só para tudo o que você planeja.",
      fonte: "A tese da formação",
    },
    {
      tipo: "texto",
      paragrafos: [
        "Cada módulo daqui em diante tem um notebook como este. Ele não repete a aula: pega o argumento central dela e mostra em forma de gráfico, de conta ou de texto longo, para você consultar depois sem precisar voltar ao vídeo.",
        "O simulador abaixo é o primeiro exemplo. Mexa na fatia do patrimônio fora do Brasil e veja o que acontece com a oscilação da carteira quando as duas partes não andam juntas.",
      ],
    },
    {
      tipo: "comparador",
      id: "simulador",
      modelo: "diversificacao",
      titulo: "Quanto do patrimônio fora do Brasil",
      descricao:
        "Volatilidade anual estimada de uma carteira com uma parte no Brasil e outra no exterior. As três hipóteses são ajustáveis e servem só para ilustrar a conta.",
      hipoteses: { volBrasil: 22, volExterior: 16, correlacao: 0.3, fatia: 0.3 },
    },
    {
      tipo: "referencias",
      itens: [
        {
          autor: "Howard Marks",
          titulo: "The Most Important Thing",
          ano: 2011,
          nota: "Risco, ciclos e o pensamento de segundo nível, em cartas de um gestor.",
        },
        {
          autor: "Burton G. Malkiel",
          titulo: "A Random Walk Down Wall Street",
          ano: 1973,
          nota: "O argumento clássico a favor da diversificação ampla e de baixo custo.",
        },
      ],
    },
  ],
};

export default notebook;

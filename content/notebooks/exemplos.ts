import type { Notebook } from "@/lib/notebook";

// VITRINE DOS BLOCOS, não é notebook de módulo e não está no registro (`index.ts`): nenhum aluno
// vê isto. Existe por dois motivos:
//
// 1. Cada exemplo de `docs/NOTEBOOK.md` está aqui, então o `tsc` e o `npm run check`
//    (`scripts/notebook-check.mts`) garantem que o guia compila e passa na validação. Exemplo de
//    guia que não compila ensina errado a quem escreve conteúdo.
// 2. É o arquivo para conferir o visual de todos os blocos de uma vez.
//
// TODOS OS NÚMEROS SÃO ILUSTRATIVOS. Nada aqui é série real; quem copiar um bloco para um módulo
// troca os números pelos da fonte e escreve a `fonte`.

const anos = ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

const notebook: Notebook = {
  modulo: -1,
  titulo: "Vitrine dos blocos",
  subtitulo: "Um exemplo de cada bloco do notebook, com números ilustrativos.",
  demo: true,
  aulas: [
    {
      aula: 1,
      blocos: [
        { tipo: "capitulo", id: "vitrine-texto", titulo: "Texto, citação e número" },
        {
          tipo: "texto",
          capitular: true,
          paragrafos: ["Primeiro parágrafo, em corpo maior: a tese da seção em duas frases.", "Segundo parágrafo, em corpo normal."],
          tempo: "03:15",
        },
        { tipo: "destaque", texto: "Diversificar não é prever. É admitir que você não sabe.", fonte: "Docente, na aula 1" },
        { tipo: "numero", valor: "5,5×", legenda: "foi quanto o dólar multiplicou no período.", nota: "Ilustrativo." },
        {
          tipo: "kpis",
          itens: [
            { rotulo: "Dólar", valor: 5.42, formato: "brl", variacao: { valor: 12.4, formato: "pct", rotulo: "em 12 meses", bom: "desce" }, destaque: true },
            { rotulo: "Selic", valor: 15, formato: { sufixo: "% a.a.", casas: 2 }, variacao: { valor: 0.5, formato: "pp", rotulo: "no ano" } },
            { rotulo: "Dívida bruta", valor: 76.5, formato: { sufixo: "% do PIB", casas: 1 }, nota: "Ilustrativo" },
          ],
          ilustrativo: true,
          nota: "Números de exemplo.",
        },
        {
          tipo: "grafico",
          titulo: "Dólar e euro em reais",
          subtitulo: "R$ por unidade de moeda estrangeira, média anual",
          forma: "linha",
          eixoX: anos,
          series: [
            { nome: "Dólar", valores: [3.5, 3.2, 3.7, 3.9, 5.2, 5.4, 5.2, 5.0, 5.4, 5.6], destaque: true },
            { nome: "Euro", valores: [3.9, 3.6, 4.3, 4.4, 5.9, 6.4, 5.4, 5.4, 5.8, 6.2] },
          ],
          formato: "brl",
          marcos: [{ em: "2020", rotulo: "Pandemia" }],
          faixas: [{ de: "2021", ate: "2022", rotulo: "Alta de juros" }],
          ilustrativo: true,
          nota: "Valores aproximados, só para mostrar o bloco.",
          tempo: "12:34",
        },
        {
          tipo: "grafico",
          titulo: "Anos até a moeda perder metade do poder de compra",
          forma: "barra",
          eixoX: ["2% ao ano", "4% ao ano", "6% ao ano", "8% ao ano"],
          series: [{ nome: "Anos", valores: [35, 17.7, 11.9, 9] }],
          formato: { sufixo: " anos", casas: 1 },
          ilustrativo: true,
          nota: "ln(2) / ln(1 + inflação), com inflação constante.",
        },
        {
          tipo: "grafico",
          titulo: "Área: um capital crescendo",
          forma: "area",
          eixoX: ["0", "5", "10", "15", "20"],
          series: [{ nome: "Capital", valores: [100, 134, 179, 240, 321] }],
          formato: { base: "usd", casas: 0 },
          ilustrativo: true,
        },
        {
          tipo: "grafico",
          titulo: "Escala log: o que multiplica",
          forma: "linha",
          escala: "log",
          eixoX: ["1994", "2002", "2010", "2018", "2026"],
          series: [{ nome: "Índice", valores: [100, 260, 520, 900, 1800] }],
          formato: "indice",
          referencia: { valor: 100, rotulo: "Base 100" },
          ilustrativo: true,
        },
        {
          tipo: "grafico",
          titulo: "Barras empilhadas: carteira por moeda",
          forma: "barraEmpilhada",
          eixoX: ["Ano 1", "Ano 5", "Ano 10"],
          series: [
            { nome: "Em reais", valores: [70, 80, 95] },
            { nome: "Em dólar", valores: [30, 45, 70], destaque: true },
          ],
          formato: { base: "brl", casas: 0, sufixo: " mil" },
          ilustrativo: true,
        },
        {
          tipo: "grafico",
          titulo: "Inclinação: antes e depois",
          forma: "inclinacao",
          eixoX: ["2015", "2025"],
          series: [
            { nome: "Brasil", valores: [2.4, 1.9], destaque: true },
            { nome: "EUA", valores: [24, 26] },
            { nome: "China", valores: [15, 17] },
          ],
          formato: { sufixo: "%", casas: 1 },
          ilustrativo: true,
          nota: "Participação no PIB mundial, valores de exemplo.",
        },
        {
          tipo: "comparativo",
          titulo: "Só Brasil contra Brasil + exterior",
          opcoes: [
            { nome: "Só Brasil", resumo: "100% em reais" },
            { nome: "Brasil + exterior", resumo: "70% aqui, 30% fora", destaque: true },
          ],
          metricas: [
            { rotulo: "Volatilidade anual", valores: [22, 17.4], formato: "pct", melhor: "menor" },
            { rotulo: "Pior ano", valores: [-28, -19], formato: "pct", melhor: "maior" },
            { rotulo: "Moedas", valores: [1, 2], formato: "numero" },
          ],
          ilustrativo: true,
        },
        {
          tipo: "linhaDoTempo",
          titulo: "O câmbio e os eventos que o moveram",
          eventos: [
            { data: "1999", titulo: "Câmbio flutuante", texto: "O real deixa a banda." },
            { data: "2002", titulo: "Eleição", texto: "Prêmio de risco dispara." },
            { data: "2008", titulo: "Crise global", texto: "Fuga para o dólar." },
            { data: "2015", titulo: "Recessão", texto: "Grau de investimento perdido." },
            { data: "2020", titulo: "Pandemia", texto: "Juro mínimo, real fraco." },
          ],
          serie: {
            nome: "Dólar",
            eixoX: ["1999", "2000", "2002", "2004", "2006", "2008", "2010", "2012", "2015", "2018", "2020", "2024"],
            valores: [1.8, 1.8, 2.9, 2.9, 2.2, 1.8, 1.8, 2.0, 3.3, 3.7, 5.2, 5.4],
            formato: "brl",
          },
          ilustrativo: true,
        },
        {
          tipo: "fluxo",
          titulo: "Do risco fiscal ao seu patrimônio",
          nos: [
            { titulo: "Risco fiscal", texto: "Dívida cresce sem plano crível.", sentido: "sobe" },
            { titulo: "Juros longos", texto: "Investidor pede prêmio maior.", sentido: "sobe" },
            { titulo: "Câmbio", texto: "Capital sai, o real perde.", sentido: "sobe" },
            { titulo: "Patrimônio em dólar", texto: "Quem está só em reais empobrece.", sentido: "desce" },
          ],
          ligacoes: ["eleva", "pressiona", "corrói"],
          fonte: "Síntese da aula",
        },
        {
          tipo: "matriz",
          titulo: "Banco Central e mercado: um jogo de credibilidade",
          modo: "payoff",
          eixoLinhas: "Banco Central",
          eixoColunas: "Mercado",
          linhas: ["Cumpre a meta", "Cede à pressão"],
          colunas: ["Acredita", "Duvida"],
          celulas: [
            [
              { valores: [3, 3], explicacao: "Inflação baixa com juro menor: os dois ganham.", marca: "Equilíbrio" },
              { valores: [1, 2], explicacao: "O BC paga caro para provar que cumpre." },
            ],
            [
              { valores: [4, 0], explicacao: "Ganho curto do BC, perda do mercado enganado." },
              { valores: [0, 1], explicacao: "Inflação alta e juro alto: o pior caso." },
            ],
          ],
          ilustrativo: true,
        },
        {
          tipo: "conceito",
          termo: "Dominância fiscal",
          definicao:
            "Situação em que a política monetária perde a capacidade de controlar a inflação porque a alta de juros piora a dinâmica da dívida a ponto de elevar o risco e desvalorizar a moeda.",
          naPratica: "Juro alto deixa de segurar o câmbio. Para quem investe, é o cenário em que a proteção em dólar mais pesa.",
          formula: "d' = d(1 + r)/(1 + g) − s",
          referencia: { autor: "Olivier Blanchard", obra: "Fiscal Dominance and Inflation Targeting", ano: 2004 },
        },
        {
          tipo: "simulador",
          id: "vitrine-divida",
          titulo: "A aritmética da dívida",
          modelo: "dividaPib",
          parametros: { divida: { valor: 76 }, anos: { valor: 15 } },
        },
        { tipo: "simulador", id: "vitrine-diversificacao", titulo: "Quanto fora do Brasil", modelo: "diversificacao" },
        { tipo: "simulador", id: "vitrine-cambio", titulo: "O patrimônio medido em dólar", modelo: "cambioPatrimonio" },
        {
          tipo: "simulador",
          id: "vitrine-juros",
          titulo: "Juros compostos em duas moedas",
          modelo: "jurosCompostos",
          parametros: { taxaUsd: { fixo: true } },
        },
        {
          tipo: "tabela",
          titulo: "Veículos para investir lá fora",
          colunas: ["Veículo", "Custo anual", "Moeda"],
          linhas: [
            ["ETF no exterior", "0,1%", "US$"],
            ["BDR de ETF", "0,3%", "R$"],
          ],
          fonte: "Exemplo do guia",
          nota: "Números de exemplo.",
        },
        { tipo: "referencias", itens: [{ autor: "N. Gregory Mankiw", titulo: "Macroeconomia", ano: 2019, nota: "Cap. 4, moeda e inflação." }] },
      ],
    },
  ],
};

export default notebook;

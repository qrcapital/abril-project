# Notebook: guia de autoria

Para quem escreve o conteúdo dos notebooks (`content/notebooks/modulo-<n>.ts`). Tipos em
`lib/notebook.ts`, renderização em `app/app/_ui/sala/`, estilo em `app/app/_ui/sala.css` (`.sl`).
Todos os exemplos abaixo existem, completos, em `content/notebooks/exemplos.ts`, que compila e
passa no `check:notebook`. Copie de lá.

## Estrutura

```ts
const notebook: Notebook = {
  modulo: 0, titulo: "...", subtitulo: "...", demo: false,
  aulas: [{ aula: 1, blocos: [/* blocos */] }],   // aula = posição da aula no módulo (1, 2, 3...)
};
```

O título de cada seção vem do banco (o da aula). Todo bloco aceita `tempo: "12:34"` (ou
`"1:02:03"`): aparece o atalho "Na aula, 12:34", que leva o player àquele ponto.

## Fonte ou ilustrativo (obrigatório)

Gráfico, kpis, comparativo, linhaDoTempo, fluxo e matriz exigem origem; sem ela não compila.

```ts
{ ..., fonte: "Banco Central do Brasil, SGS 3698", nota: "Média mensal." }  // dado real
{ ..., ilustrativo: true, nota: "Taxas hipotéticas e constantes." }           // conta ou exemplo
```

A tela escreve, em cinza, sob a figura: "Fonte: ..." ou "Ilustrativo: ...", seguido da nota.
Dado real sem fonte verificável: marque `ilustrativo`. A unidade vai no `subtitulo` ("R$ por US$,
média anual") ou no `formato`. Simulador sai sempre como ilustrativo, com o aviso do modelo.

## Formatos de número

`formato: "pct" | "pp" | "brl" | "usd" | "indice" | "multiplo" | "numero"`, ou objeto:
`{ base: "brl", casas: 0, compacto: true }` (R$ 1,2 mi), `{ sufixo: "% do PIB", casas: 1 }`,
`{ sinal: true }` (+1,5).

## Blocos

**texto**, **destaque**, **numero**, **capitulo**

```ts
{ tipo: "texto", capitular: true, paragrafos: ["Abertura, em corpo maior.", "Segundo parágrafo."] }
{ tipo: "destaque", texto: "Diversificar não é prever.", fonte: "Docente, na aula 1" }
{ tipo: "numero", valor: "5,5×", legenda: "foi quanto o dólar multiplicou.", nota: "Jul/1994 a set/2026." }
{ tipo: "capitulo", id: "juros-reais", titulo: "Juro real", resumo: "Uma linha." }
```

**grafico**: `forma` `linha | area | barra | barraEmpilhada | inclinacao`

```ts
{
  tipo: "grafico", titulo: "Dólar e euro em reais", subtitulo: "R$ por unidade, média anual",
  forma: "linha", eixoX: ["2016", "2017", "2018"],
  series: [{ nome: "Dólar", valores: [3.5, 3.2, 3.7], destaque: true }, { nome: "Euro", valores: [3.9, 3.6, 4.3] }],
  formato: "brl",
  escala: "log",                                   // opcional, só linha/inclinação, valores > 0
  marcos: [{ em: "2017", rotulo: "Plano X" }],     // linha vertical anotada (rótulo ou índice)
  faixas: [{ de: "2016", ate: "2017", rotulo: "Recessão" }],
  referencia: { valor: 3, rotulo: "Meta" },        // linha horizontal
  fonte: "...",
}
```

`inclinacao` pede exatamente 2 pontos no eixo (antes e depois). `valores` aceita `null` (lacuna).
Uma série com `destaque` sai em vermelho; as outras em cinzas. `cor` força o papel
(`acento`, `cinza`, `cinzaClaro`, `cinzaPalido`, `ouro`, `tinta`, `positivo`, `negativo`).

**kpis** (2 a 4)

```ts
{ tipo: "kpis", itens: [
  { rotulo: "Dólar", valor: 5.42, formato: "brl", destaque: true,
    variacao: { valor: 12.4, formato: "pct", rotulo: "em 12 meses", bom: "desce" } },
  { rotulo: "Selic", valor: 15, formato: { sufixo: "% a.a.", casas: 2 }, nota: "set/2026" },
], fonte: "..." }
```

`bom` decide a cor da variação (verde se andou no sentido bom, vermelho se no outro); sem `bom`,
neutra.

**comparativo** (2 ou 3 opções)

```ts
{ tipo: "comparativo", titulo: "Só Brasil contra Brasil + exterior",
  opcoes: [{ nome: "Só Brasil", resumo: "100% em reais" }, { nome: "Brasil + exterior", destaque: true }],
  metricas: [{ rotulo: "Volatilidade anual", valores: [22, 17.4], formato: "pct", melhor: "menor" }],
  ilustrativo: true }
```

**linhaDoTempo** (série opcional atrás dos eventos)

```ts
{ tipo: "linhaDoTempo", titulo: "O câmbio e os eventos",
  eventos: [{ data: "1999", titulo: "Câmbio flutuante", texto: "Uma linha." }, { data: "2002", titulo: "Eleição" }],
  serie: { nome: "Dólar", eixoX: ["1999", "2000", "2002"], valores: [1.8, 1.8, 2.9], formato: "brl" },
  fonte: "..." }
```

O evento acha o ponto pela `data` no `serie.eixoX`, ou por `em` (rótulo ou índice).

**fluxo** (3 a 6 nós, cadeia causal)

```ts
{ tipo: "fluxo", titulo: "Do risco fiscal ao patrimônio",
  nos: [{ titulo: "Risco fiscal", texto: "Uma linha.", sentido: "sobe" }, { titulo: "Juros longos", sentido: "sobe" },
        { titulo: "Patrimônio em dólar", sentido: "desce" }],
  ligacoes: ["eleva", "corrói"],                   // um verbo curto por seta, nós − 1
  fonte: "Síntese da aula" }
```

**matriz** (2×2, `payoff` ou `quadrante`)

```ts
{ tipo: "matriz", modo: "payoff", titulo: "BC e mercado", eixoLinhas: "Banco Central", eixoColunas: "Mercado",
  linhas: ["Cumpre a meta", "Cede"], colunas: ["Acredita", "Duvida"],
  celulas: [[{ valores: [3, 3], marca: "Equilíbrio", explicacao: "Os dois ganham." }, { valores: [1, 2] }],
            [{ valores: [4, 0] }, { valores: [0, 1] }]],
  ilustrativo: true }
```

`quadrante`: use `texto` nas células em vez de `valores`. `explicacao` aparece no painel ao passar
o mouse ou focar a célula.

**simulador** (declarativo, modelos prontos)

```ts
{ tipo: "simulador", id: "divida", titulo: "A aritmética da dívida", modelo: "dividaPib",
  parametros: { divida: { valor: 76 }, anos: { valor: 15, max: 40 }, crescimento: { fixo: true } } }
```

| modelo | conta | parâmetros |
|---|---|---|
| `dividaPib` | d' = d(1 + r)/(1 + g) − s | `divida`, `juros`, `crescimento`, `primario`, `anos` |
| `diversificacao` | σ = √(w²σ₁² + (1 − w)²σ₂² + 2w(1 − w)ρσ₁σ₂) | `fatia`, `volBrasil`, `volExterior`, `correlacao` |
| `cambioPatrimonio` | carteira em reais medida em dólar | `patrimonio`, `cambio`, `depreciacao`, `anos`, `fatia` |
| `jurosCompostos` | aportes em duas moedas | `inicial`, `aporte`, `fatia`, `taxaBrl`, `taxaUsd`, `cambio`, `depreciacao`, `anos` |
| `poderDeCompra` | poder de compra em dólar, base 100 | `depreciacao`, `anos`, `fatia` |

Cada parâmetro aceita `valor`, `min`, `max`, `passo`, `rotulo`, `ajuda`, `fixo` (vira premissa
em texto). Padrões em `PARAMETROS_PADRAO` (`lib/notebook.ts`). `aviso` troca o texto do que a
conta ignora. Fatias em %, de 0 a 100. O bloco antigo `comparador` continua aceito, mas não use.

**conceito** (teoria para a prática)

```ts
{ tipo: "conceito", termo: "Dominância fiscal",
  definicao: "Definição rigorosa, um parágrafo.", naPratica: "O que muda na decisão do aluno.",
  formula: "d' = d(1 + r)/(1 + g) − s",
  referencia: { autor: "Olivier Blanchard", obra: "Macroeconomia", capitulo: "cap. 22", ano: 2017 } }
```

**tabela** e **referencias**

```ts
{ tipo: "tabela", titulo: "Veículos", colunas: ["Veículo", "Custo"], linhas: [["ETF", "0,1%"]], fonte: "..." }
{ tipo: "referencias", itens: [{ autor: "N. Gregory Mankiw", titulo: "Macroeconomia", ano: 2019, nota: "Cap. 4." }] }
```

Coluna de tabela só com números alinha à direita sozinha.

## Linguagem visual

Faça:
- uma família só, o Jost, para títulos, texto, interface e números, com algarismos tabulares (já
  aplicado; desde 07/out/2026 o título da aula e o `destaque` também saíram da serifa);
- rótulos em caixa normal, frases curtas, unidade sempre visível;
- vermelho em UMA coisa por figura: a série ou o número que o texto discute (`destaque`);
- cinzas quentes para o resto; dourado raro; verde e vermelho só quando o sinal do dado importa;
- títulos de figura que dizem a conclusão ("O real perdeu 80% contra o dólar"), não o eixo;
- `tempo` nos blocos que resumem um trecho específico da aula.

Não faça:
- sobrancelha em versalete com espaçamento largo, emoji, ícone decorativo, fonte nova;
- duas unidades no mesmo eixo (dólar e Selic juntos): faça dois gráficos;
- número sem fonte, ou exemplo sem `ilustrativo`;
- mais de 5 séries por gráfico, mais de 4 KPIs, mais de 6 nós de fluxo;
- travessão em qualquer texto (regra de `docs/COPY.md`).

## Comportamento (já implementado, nada a configurar)

Gráficos se desenham ao entrar na tela (nada anima com movimento reduzido), mostram cruz de
leitura com o valor exato de todas as séries, percorrem pontos pelo teclado (setas, Home, End),
legenda liga e desliga séries, e cada um tem a tabela de dados num `<details>`.

## "Na aula, 12:34"

Se a aula do bloco é a que está no player, o clique manda o Panda ao ponto por `postMessage`
(`{ type: "currentTime", parameter: s }` e `play`, API "Send events" do Panda) e rola até o
player. Se é outra aula, o link `/app/modulo/<m>?aula=<n>&t=<s>#player` abre a aula com
`startTime` no embed. Detalhes em `app/app/_ui/sala/NaAula.tsx`.

## Validar

```
npm run check:notebook   # séries x eixo, contagens, tempo, marcos, fonte, parâmetros
npx tsc --noEmit -p .
```

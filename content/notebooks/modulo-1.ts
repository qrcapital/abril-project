import type { Notebook } from "@/lib/notebook";

import aula1 from "./modulo-1/aula-1";
import aula2 from "./modulo-1/aula-2";
import aula3 from "./modulo-1/aula-3";

// Módulo II, Renda Fixa e Ações nos EUA (ord 1), com Tony Volpon. Definitivo desde 08/out/2026, a
// partir das transcrições (`transcricoes/modulo-1/`) e do super dossiê (`_referencias-livros/dossie/`,
// fora do repo; ranking próprio em RANKING-MODULO-II.md).
//
// O módulo foi planejado com quatro aulas e gravado com três: Tony juntou "Comprando ações nos EUA" e
// "Dividendos vs. growth investing" numa aula só, a terceira (ações americanas: prêmio de risco, eras,
// tecnologia, crescimento e valor, S&P 500 contra Ibovespa). Por isso o notebook tem três seções.
const notebook: Notebook = {
  modulo: 1,
  titulo: "Renda Fixa e Ações nos EUA",
  subtitulo:
    "Do Tesouro americano, a régua de todos os juros em dólar, ao crédito privado e às ações: o que cada degrau paga e o que cobra.",
  demo: false,
  docentePorAula: { 1: "Tony Volpon", 2: "Tony Volpon", 3: "Tony Volpon" },
  aulas: [aula1, aula2, aula3],
};

export default notebook;

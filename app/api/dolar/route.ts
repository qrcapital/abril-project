import { NextResponse } from "next/server";

/**
 * Cotação do dólar, direto da fonte que o gráfico já cita.
 *
 * POR QUE UM ROUTE HANDLER E NÃO UM FETCH DIRETO DO NAVEGADOR
 *  - o servidor da API do Banco Central não manda cabeçalho de CORS, então o
 *    navegador não consegue ler a resposta;
 *  - aqui a resposta fica em cache na borda, então mil visitantes viram uma
 *    chamada ao BCB por janela, não mil;
 *  - e a página continua servindo o número assado no SVG se isto cair. O
 *    cliente só substitui quando recebe um número válido.
 *
 * FONTE. Série 1 do SGS, dólar comercial de venda, diária. É a MESMA família
 * de séries citada no rodapé do gráfico (3698 é a mensal da mesma coisa),
 * então a página não passa a misturar fontes. Pedimos os últimos 5 registros
 * porque a série não tem fim de semana nem feriado, e queremos o último
 * útil, seja ele qual for.
 *
 * INTRADIÁRIO. O BCB publica uma vez por dia, no fim da tarde. Cotação a
 * cada minuto exigiria um provedor de mercado pago e com chave, e a página
 * deixaria de poder dizer "Fonte: Banco Central". Para uma página
 * institucional, diário e oficial vale mais do que minuto a minuto e não
 * auditável.
 */

const SGS = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/5?formato=json";
const MEIA_HORA = 1800;

type Ponto = { data: string; valor: string };

// Literal, e nao a constante: o Next exige valor estaticamente analisavel
// aqui, e uma referencia a variavel quebra o build.
export const revalidate = 1800;

export async function GET() {
  try {
    const r = await fetch(SGS, {
      next: { revalidate: MEIA_HORA },
      headers: { accept: "application/json" },
    });
    if (!r.ok) throw new Error(`BCB respondeu ${r.status}`);

    const serie = (await r.json()) as Ponto[];
    const ultimo = [...serie].reverse().find((p) => Number(p.valor) > 0);
    if (!ultimo) throw new Error("série vazia");

    const valor = Number(ultimo.valor);
    // Cerca de sanidade: se o BCB devolver lixo, é melhor a página manter o
    // número assado do que exibir um dólar a R$ 0,02 ou a R$ 400.
    if (!Number.isFinite(valor) || valor < 1 || valor > 40) {
      throw new Error(`valor fora da faixa plausível: ${ultimo.valor}`);
    }

    const [dia, mes, ano] = ultimo.data.split("/").map(Number);

    return NextResponse.json(
      { valor, dia, mes, ano, fonte: "Banco Central do Brasil, SGS série 1" },
      {
        headers: {
          "cache-control": `public, s-maxage=${MEIA_HORA}, stale-while-revalidate=86400`,
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { erro: e instanceof Error ? e.message : "falha ao consultar o BCB" },
      { status: 502, headers: { "cache-control": "no-store" } }
    );
  }
}

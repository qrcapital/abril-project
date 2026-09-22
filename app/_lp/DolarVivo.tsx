"use client";

import { useEffect } from "react";

/**
 * Põe a cotação do dia no gráfico do dólar, sem recompilar a página.
 *
 * O gráfico é um SVG assado no `body.html` por `docs/graficos-cedulas.py`: a
 * série inteira, de jul/1994 até a data do build, vem pronta. Este
 * componente só atualiza a PONTA, que é a única parte que envelhece:
 *
 *   - o número grande e o multiplicador de 1994 até hoje;
 *   - o último vértice do caminho da série (o `<clipPath>` usa `<use>` do
 *     mesmo `<path>`, então o preenchimento da cédula acompanha de graça);
 *   - o rótulo de data e o período citado no rodapé.
 *
 * O número que o servidor entrega continua correto se isto não rodar: o
 * SVG assado já traz a cotação do dia do build. Nada aqui é requisito para
 * a página fazer sentido, é só frescor.
 *
 * Os ganchos são atributos `data-dolar`, não posições no DOM, para que
 * regerar o SVG não quebre o script.
 */

const MESES = ["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO",
               "JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"];
const MES3 = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const DOLAR_1994 = 0.93;

type Cotacao = { valor: number; dia: number; mes: number; ano: number };

const real = (v: number) => "R$ " + v.toFixed(2).replace(".", ",");
const q = (nome: string) => document.querySelector<SVGElement>(`[data-dolar="${nome}"]`);

export default function DolarVivo() {
  useEffect(() => {
    let vivo = true;

    (async () => {
      let d: Partial<Cotacao> = {};
      try {
        const r = await fetch("/api/dolar");
        if (!r.ok) return;                     // 502: fica o número assado
        d = (await r.json()) as Partial<Cotacao>;
      } catch {
        return;
      }
      if (!vivo) return;

      const { valor, dia, mes, ano } = d;
      if (typeof valor !== "number" || !(valor > 0)) return;
      if (!dia || !mes || !ano) return;

      const vlr = q("valor");
      if (vlr) vlr.textContent = real(valor);

      // O cartão do multiplicador tem o número como primeiro nó de texto e a
      // legenda num <span> irmão; trocar só o nó preserva a legenda.
      const mult = document.querySelector<HTMLElement>('[data-dolar="mult"]');
      const noDoNumero = mult?.firstChild;
      if (noDoNumero && noDoNumero.nodeType === Node.TEXT_NODE) {
        noDoNumero.textContent = (valor / DOLAR_1994).toFixed(1).replace(".", ",") + "×";
      }

      const fim = q("fim");
      if (fim) fim.textContent = `${dia} DE ${MESES[mes - 1]} DE ${ano}`;

      const fonte = q("fonte");
      if (fonte) {
        fonte.textContent =
          `Fonte: Banco Central do Brasil · série 1 (dólar de venda), jul/1994 a ${MES3[mes - 1]}/${ano}`;
      }

      // ---- a ponta da série ------------------------------------------------
      const p = q("serie");
      const esc = p?.getAttribute("data-escala")?.split(",").map(Number);
      if (p && esc?.length === 3) {
        const [ny, nh, vmax] = esc;
        if (valor > vmax) {
          // Acima do teto do eixo o traço sairia pela borda de cima. Melhor
          // manter a geometria assada e avisar: a essa altura a série toda
          // precisa ser regerada pelo script, não remendada aqui.
          console.warn(`[dolar] ${valor} passou do teto do eixo (${vmax}); regerar o SVG.`);
        } else {
          const d0 = p.getAttribute("d") ?? "";
          // `.*` guloso: pega o ÚLTIMO vértice de dado, o que vem antes do
          // fechamento `L <x> <base> Z`.
          const m = d0.match(/^(.*L \d+ )(\d+)( L \d+ \d+ Z)$/);
          if (m) p.setAttribute("d", m[1] + Math.round(ny + nh - (valor / vmax) * nh) + m[3]);
        }
      }

      // ---- o pico ----------------------------------------------------------
      const pico = q("pico");
      const vPico = Number(pico?.getAttribute("data-pico"));
      if (pico && vPico && valor > vPico) {
        // Se hoje é o novo máximo, a chamada antiga virou mentira. Some com
        // ela em vez de afirmar um pico que deixou de ser o pico.
        pico.remove();
        console.warn(`[dolar] ${valor} superou o pico anotado (${vPico}); chamada removida.`);
      }
    })();

    return () => { vivo = false; };
  }, []);

  return null;
}

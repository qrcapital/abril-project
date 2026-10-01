import { formatar, type MetricaComparativo, type OpcaoComparativo, type Origem as TipoOrigem } from "@/lib/notebook";

import { Entrada } from "./Entrada";
import Origem from "./Origem";

/**
 * Duas ou três opções lado a lado ("Só Brasil" contra "Brasil + exterior"), com as mesmas
 * métricas em cada uma e uma barra fina por métrica, na escala da linha. É uma tabela de verdade,
 * porque é o que o leitor de tela entende; o desenho de colunas vem do CSS.
 *
 * A opção com `destaque` ganha o vermelho; as outras ficam em cinza. Com `melhor` na métrica, o
 * valor vencedor da linha sai em tinta cheia e os outros recuam.
 */
export default function Comparativo({
  titulo,
  subtitulo,
  opcoes,
  metricas,
  origem,
}: {
  titulo: string;
  subtitulo?: string;
  opcoes: OpcaoComparativo[];
  metricas: MetricaComparativo[];
  origem: TipoOrigem;
}) {
  return (
    <Entrada como="figure" className="sl-cmp">
      <figcaption className="sl-fig-cabeca">
        <h4 className="sl-fig-titulo">{titulo}</h4>
        {subtitulo && <p className="sl-fig-sub">{subtitulo}</p>}
      </figcaption>
      <div className="sl-tabela-caixa">
        <table className="sl-cmp-tabela" data-n={opcoes.length}>
          <thead>
            <tr>
              <td />
              {opcoes.map((o) => (
                <th scope="col" key={o.nome} className={o.destaque ? "is-destaque" : undefined}>
                  <span className="sl-cmp-nome">{o.nome}</span>
                  {o.resumo && <span className="sl-cmp-resumo">{o.resumo}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricas.map((m) => {
              const maxAbs = Math.max(...m.valores.map(Math.abs)) || 1;
              const alvo = m.melhor === "maior" ? Math.max(...m.valores) : m.melhor === "menor" ? Math.min(...m.valores) : null;
              return (
                <tr key={m.rotulo}>
                  <th scope="row">{m.rotulo}</th>
                  {m.valores.map((v, i) => {
                    const o = opcoes[i];
                    const vence = alvo !== null && v === alvo;
                    return (
                      <td
                        key={i}
                        className={[o?.destaque ? "is-destaque" : "", vence ? "is-melhor" : alvo !== null ? "is-recua" : ""].join(" ").trim() || undefined}
                      >
                        <span className="sl-cmp-valor">
                          {formatar(v, m.formato)}
                          {vence && <span className="sl-so-leitor"> (melhor nesta linha)</span>}
                        </span>
                        <span className="sl-cmp-barra" aria-hidden="true">
                          <i style={{ width: `${(Math.abs(v) / maxAbs) * 100}%`, animationDelay: `${i * 90}ms` }} data-neg={v < 0 ? "" : undefined} />
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Origem origem={origem} />
    </Entrada>
  );
}

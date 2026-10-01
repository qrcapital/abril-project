import type { NoFluxo, Origem as TipoOrigem } from "@/lib/notebook";

import { Entrada } from "./Entrada";
import Origem from "./Origem";

/**
 * Cadeia causal em 3 a 6 etapas ("risco fiscal → juros → câmbio → patrimônio em reais"), com
 * seta entre as etapas e, se o autor quiser, o verbo da seta ("eleva", "deprecia"). No desktop
 * corre na horizontal; no celular, de cima para baixo. As etapas acendem em sequência quando o
 * bloco entra na tela.
 *
 * A seta de sentido (`sobe`/`desce`) ao lado do título diz o que acontece com a variável; ela é
 * tinta, não verde nem vermelho, porque "subir" não é bom nem ruim por si (juro que sobe é bom
 * para quem empresta).
 */
export default function Fluxo({
  titulo,
  subtitulo,
  nos,
  ligacoes,
  origem,
}: {
  titulo?: string;
  subtitulo?: string;
  nos: NoFluxo[];
  ligacoes?: string[];
  origem: TipoOrigem;
}) {
  return (
    <Entrada como="figure" className="sl-fluxo">
      {(titulo || subtitulo) && (
        <figcaption className="sl-fig-cabeca">
          {titulo && <h4 className="sl-fig-titulo">{titulo}</h4>}
          {subtitulo && <p className="sl-fig-sub">{subtitulo}</p>}
        </figcaption>
      )}
      <ol className="sl-fluxo-lista" style={{ ["--n" as string]: nos.length }}>
        {nos.map((no, i) => (
          <li key={no.titulo} className="sl-fluxo-passo" style={{ ["--i" as string]: i }}>
            {i > 0 && (
              <div className="sl-fluxo-seta" aria-hidden="true">
                {ligacoes?.[i - 1] && <span>{ligacoes[i - 1]}</span>}
                <svg viewBox="0 0 40 12" preserveAspectRatio="none">
                  <path d="M0 6H37M32 1.5L38 6L32 10.5" fill="none" stroke="currentColor" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            )}
            <div className={`sl-fluxo-no${i === nos.length - 1 ? " is-fim" : ""}`}>
              <span className="sl-fluxo-num" aria-hidden="true">
                {i + 1}
              </span>
              <p className="sl-fluxo-titulo">
                {i > 0 && <span className="sl-so-leitor">{ligacoes?.[i - 1] ? `${ligacoes[i - 1]}: ` : "leva a: "}</span>}
                {no.titulo}
                {no.sentido && (
                  <span className="sl-fluxo-sentido" data-sentido={no.sentido}>
                    <span aria-hidden="true">{no.sentido === "sobe" ? "↑" : "↓"}</span>
                    <span className="sl-so-leitor">{no.sentido === "sobe" ? " (sobe)" : " (cai)"}</span>
                  </span>
                )}
              </p>
              {no.texto && <p className="sl-fluxo-texto">{no.texto}</p>}
            </div>
          </li>
        ))}
      </ol>
      <Origem origem={origem} />
    </Entrada>
  );
}

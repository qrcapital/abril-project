import Link from "next/link";

/**
 * Verbete que não existe (07/out/2026): um endereço digitado errado ou um termo que saiu do
 * glossário. Em vez do 404 genérico da área, a saída que resolve: a busca do glossário.
 */
export default function VerbeteNaoEncontrado() {
  return (
    <div className="sl">
      <div className="sl-wrap">
        <div className="sl-vb-404">
          <p className="sl-eyebrow">Glossário</p>
          <h1 className="sl-gl-titulo">Esse termo não está no glossário</h1>
          <p className="sl-sub">
            O endereço pode ter um erro de digitação, ou o verbete mudou de nome. A busca do glossário
            encontra pelo termo, pela sigla ou pelo assunto, com ou sem acento.
          </p>
          <div className="sl-vb-404-acoes">
            <Link className="sl-btn" href="/app/glossario">
              Buscar no glossário
            </Link>
            <Link className="sl-btn sl-btn-linha" href="/app">
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { docente } from "@/lib/docentes";

/**
 * Bio curta do docente: retrato de 48px, nome e uma linha de credencial. Sem docente no módulo
 * (o Módulo 0), não desenha nada; sem foto conhecida, a inicial no lugar do retrato.
 */
export default function CartaoDocente({ nome, rotulo }: { nome: string | null | undefined; rotulo?: string }) {
  const d = docente(nome);
  if (!d) return null;
  return (
    <div className="sl-docente">
      {d.foto ? (
        // Retrato de medida fixa num círculo: o next/image acrescentaria wrapper sem mudar nada.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={d.foto} alt="" width={48} height={48} />
      ) : (
        <span className="sl-docente-inicial" aria-hidden="true">
          {d.nome[0]}
        </span>
      )}
      <span>
        {rotulo && <span className="sl-cartao-rotulo" style={{ marginBottom: 2 }}>{rotulo}</span>}
        <span className="sl-docente-nome">{d.nome}</span>
        {d.credencial && <span className="sl-docente-cred">{d.credencial}</span>}
      </span>
    </div>
  );
}

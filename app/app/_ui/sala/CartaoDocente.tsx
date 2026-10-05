import { docentes, type Docente } from "@/lib/docentes";

/**
 * Bio curta do docente: retrato de 48px, nome e uma linha de credencial. Sem docente no módulo,
 * não desenha nada; sem foto conhecida, a inicial no lugar do retrato.
 *
 * Desde 05/out/2026 o Módulo I tem dois docentes ("Felippe Hermes e Rodolfo Bastos", num campo
 * só no banco). Cada um ganha o próprio cartão, um abaixo do outro, e o `rotulo` vai só no primeiro.
 */
export default function CartaoDocente({ nome, rotulo }: { nome: string | null | undefined; rotulo?: string }) {
  const lista = docentes(nome);
  if (!lista.length) return null;
  if (lista.length === 1) return <Um d={lista[0]} rotulo={rotulo} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {lista.map((d, i) => (
        <Um key={d.nome} d={d} rotulo={i === 0 ? rotulo : undefined} />
      ))}
    </div>
  );
}

function Um({ d, rotulo }: { d: Docente; rotulo?: string }) {
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

import { colarNumeros, type Origem as TipoOrigem } from "@/lib/notebook";

/**
 * A linha de origem sob toda figura do notebook: "Fonte: ..." ou "Ilustrativo: ...", seguida da
 * nota. Cinza, pequena, sempre visível (não vai para dentro do <details> dos dados). Um
 * componente só, para que gráfico, KPI, comparativo, linha do tempo, fluxo e matriz digam a
 * origem do mesmo jeito.
 */
export default function Origem({ origem, id }: { origem: TipoOrigem; id?: string }) {
  const { fonte, nota } = origem;
  const ilustrativo = origem.ilustrativo === true;
  // A nota dos notebooks de demonstração já abre com "Dados ilustrativos." ou "Conta ilustrativa":
  // nesses casos o rótulo não se repete.
  const notaDiz = !!nota && /^\s*(dados |conta )?ilustrativ/i.test(nota);
  const rotulo = ilustrativo ? (notaDiz && !fonte ? null : "Ilustrativo") : "Fonte";
  return (
    <p className="sl-origem" id={id}>
      {rotulo && (
        <>
          <span className={ilustrativo ? "sl-origem-ilus" : undefined}>{rotulo}</span>
          {fonte ? `: ${colarNumeros(fonte.replace(/\.\s*$/, ""))}.` : "."}
        </>
      )}
      {nota && <> {colarNumeros(nota)}</>}
    </p>
  );
}

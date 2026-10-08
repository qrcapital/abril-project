import { GLOSSARIO, verbete } from "@/content/glossario";
import { urlDoVerbete } from "@/lib/glossario";
import { colarNumeros } from "@/lib/notebook";
import { montarIndice, segmentar } from "@/lib/glossario-links";

/**
 * Texto corrido com os termos do glossário virando link (07/out/2026). As regras do casamento
 * estão em `lib/glossario-links.ts`; aqui só se desenha.
 *
 * O ÍNDICE É MONTADO UMA VEZ POR PROCESSO, no import deste módulo: o glossário é estático, e o
 * notebook é renderizado a cada visita da página do módulo.
 *
 * O LINK É UM <a> DE SERVIDOR, sem componente de cliente por termo. O balão do resumo e a
 * navegação sem recarregar ficam num cliente só, por delegação (`Balao.tsx`), que lê o termo, a
 * categoria e o resumo dos `data-gl-*` do próprio link. Assim o notebook não carrega um mapa do
 * glossário inteiro, só o resumo dos termos que aparecem nele, uma vez por seção.
 */
const INDICE = montarIndice(GLOSSARIO);

export type Ligador = (texto: string) => React.ReactNode;

/**
 * Um ligador por trecho que deve linkar cada termo uma vez só (no notebook, uma seção de aula). O
 * `excluir` é o slug que nunca vira link: na página de um verbete, ele mesmo.
 */
export function criarLigador(excluir?: string): Ligador {
  const vistos = new Set<string>();
  const fora = excluir ? new Set([excluir]) : undefined;
  return (cru) => {
    const texto = colarNumeros(cru);
    const pedacos = segmentar(texto, INDICE, { vistos, excluir: fora });
    if (pedacos.length === 1 && !pedacos[0].slug) return texto;
    return pedacos.map((p, i) => {
      const v = p.slug ? verbete(p.slug) : null;
      if (!v) return p.texto;
      return (
        <a
          key={i}
          className="sl-termo"
          href={urlDoVerbete(v.slug)}
          data-gl-termo={v.sigla ? `${v.termo} (${v.sigla})` : v.termo}
          data-gl-cat={v.categoria}
          data-gl-resumo={v.resumo}
        >
          {p.texto}
        </a>
      );
    });
  };
}

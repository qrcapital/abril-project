import { verbete } from "@/content/glossario";
import { LINHA_DO_TEMPO } from "@/content/linha-do-tempo";
import { CATEGORIAS_LINHA, hrefNoCurso, rotuloDoAno, rotuloNoCurso } from "@/lib/glossario";

import LinhaViva, { type ItemLinha } from "./LinhaViva";

/**
 * A linha do tempo da home (07/out/2026), logo depois de "A Formação". Porte do comportamento da
 * linha do tempo do site da QR Asset (`qrasset-site/components/Educacao.jsx`): filtros por
 * categoria, marcos que abrem e a LINHAGEM, que ao passar o mouse num marco desenha os arcos até os
 * marcos que levaram a ele e apaga o resto. O desenho é o da sala, não o verde da QR.
 *
 * Esta parte é de servidor e só prepara os dados: ordena por ano (estável, na ordem do arquivo
 * dentro do mesmo ano), troca os slugs de antecedentes por posições na lista e descarta o que não
 * existe (o `check:glossario` acusa), resolve os verbetes citados e o link da aula. O cliente
 * (`LinhaViva`) recebe a lista pronta.
 *
 * Sem marco nenhum, a seção não aparece: uma linha do tempo vazia na home seria só ruído.
 */
export default function LinhaDoTempoHome() {
  const marcos = LINHA_DO_TEMPO.map((m, ordem) => ({ m, ordem }))
    .sort((a, b) => a.m.ano - b.m.ano || a.ordem - b.ordem)
    .map((x) => x.m);
  if (marcos.length === 0) return null;

  const pos = new Map(marcos.map((m, i) => [m.slug, i]));
  const itens: ItemLinha[] = marcos.map((m, i) => ({
    slug: m.slug,
    ano: m.ano,
    rotulo: rotuloDoAno(m),
    data: m.data,
    categoria: m.categoria,
    titulo: m.titulo,
    resumo: m.resumo,
    texto: m.texto ?? [],
    verbetes: (m.verbetes ?? [])
      .map((s) => verbete(s))
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .map((v) => ({ slug: v.slug, termo: v.termo })),
    // Só antecedente que existe e vem antes na lista: a linhagem corre para trás no tempo.
    antecedentes: (m.antecedentes ?? [])
      .map((s) => pos.get(s))
      .filter((p): p is number => p !== undefined && p < i),
    aula: m.noCurso ? { href: hrefNoCurso(m.noCurso), rotulo: rotuloNoCurso(m.noCurso) } : null,
    fonte: m.fonte,
  }));
  const categorias = CATEGORIAS_LINHA.filter((c) => marcos.some((m) => m.categoria === c));

  return (
    <div className="sl sl-embutido">
      <div className="sl-wrap">
        <LinhaViva itens={itens} categorias={[...categorias]} />
      </div>
    </div>
  );
}

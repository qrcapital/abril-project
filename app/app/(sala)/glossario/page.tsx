import type { Metadata } from "next";

import { GLOSSARIO, categoriasComVerbete } from "@/content/glossario";
import GlossarioLista from "@/app/app/_ui/sala/glossario/GlossarioLista";

export const metadata: Metadata = { title: "Glossário" };

/**
 * O glossário do curso (07/out/2026). Mora no grupo `(sala)` e por isso passa pela mesma guarda das
 * outras telas da área (matrícula ativa e termos aceitos, no layout do grupo). A guarda lê a sessão,
 * então a rota é renderizada por requisição; o que pesa, o glossário, é um módulo estático
 * importado no build, e a página não faz consulta nenhuma ao banco.
 *
 * A busca e as categorias são do cliente (`GlossarioLista`); o servidor só lê o `?q=` e o `?cat=`
 * para a primeira pintura já sair filtrada quando o endereço vier de um verbete ou de um link.
 */
export default async function GlossarioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; cat?: string | string[] }>;
}) {
  const sp = await searchParams;
  const um = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v) ?? "";
  const itens = GLOSSARIO.map((v) => ({
    slug: v.slug,
    termo: v.termo,
    sigla: v.sigla,
    categoria: v.categoria,
    resumo: v.resumo,
    apelidos: v.apelidos,
  }));
  const categorias = categoriasComVerbete();

  return (
    <div className="sl">
      <div className="sl-wrap">
        <header className="sl-gl-cabeca">
          <p className="sl-eyebrow">Glossário</p>
          <h1 className="sl-gl-titulo">As palavras do curso, explicadas</h1>
          <p className="sl-sub">
            {itens.length > 0
              ? `${itens.length} termos de câmbio, juros, renda fixa, ações, fundos, cripto e história do Brasil, no tom das aulas. Os termos sublinhados no notebook trazem para cá.`
              : "Câmbio, juros, renda fixa, ações, fundos, cripto e história do Brasil, no tom das aulas. Os termos sublinhados no notebook trazem para cá."}
          </p>
        </header>
        <GlossarioLista
          itens={itens}
          categorias={[...categorias]}
          inicial={{ q: um(sp.q).slice(0, 80), cat: um(sp.cat).slice(0, 60) || null }}
        />
      </div>
    </div>
  );
}

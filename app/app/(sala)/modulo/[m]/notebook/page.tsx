import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCalendario } from "@/lib/calendario";
import { getCurriculo } from "@/lib/curriculo";
import { href } from "@/lib/curso";
import { indiceDo } from "@/lib/notebook";
import { notebookDoModulo } from "@/content/notebooks";
import AvisoTravado from "@/app/app/_ui/sala/Aviso";
import Blocos from "@/app/app/_ui/sala/Blocos";
import Trilha from "@/app/app/_ui/sala/Trilha";
import { hrefDoModulo } from "@/app/app/_ui/sala/estado";

export const metadata: Metadata = { title: "Notebook" };

/**
 * O notebook de um módulo (`content/notebooks/modulo-<n>.ts`, tipos em `lib/notebook.ts`).
 *
 * Segue a liberação do módulo: fechado, a página mostra o aviso com a data e a trilha, e nenhum
 * bloco. O conteúdo é derivado das aulas, e abrir o notebook antes delas anteciparia o módulo.
 *
 * Layout editorial: índice lateral fixo (capítulos, simulador, referências) e a tela larga à
 * direita, com a prosa na medida de leitura e os gráficos ocupando a largura toda.
 */
export default async function NotebookPage({ params }: { params: Promise<{ m: string }> }) {
  const { m } = await params;
  const ord = Number(m);
  const [curriculo, calendario] = await Promise.all([getCurriculo(), getCalendario()]);
  const mod = curriculo.modulos.find((x) => x.idx === ord);
  if (!Number.isInteger(ord) || !mod) notFound();

  const cal = calendario?.modulos.find((x) => x.ord === ord);
  const aberto = cal?.aberto ?? false;
  const nb = notebookDoModulo(ord);
  const aulas = curriculo.aulas.filter((a) => a.modulo === ord);
  const indice = nb ? indiceDo(nb) : [];
  const nomeModulo = ord === 0 ? "Comece por aqui" : mod.label;

  return (
    <div className="sl">
      <div className="sl-wrap-largo">
        <header className="sl-nb-cabeca">
          <nav className="sl-migalha sl-migalha-claro" aria-label="Você está em">
            <Link href="/app">Início</Link> <span aria-hidden="true">›</span>{" "}
            <Link href={hrefDoModulo(ord)}>{nomeModulo}</Link> <span aria-hidden="true">›</span> Notebook
          </nav>
          <div style={{ marginTop: 26 }}>
            <span className="sl-eyebrow">Notebook · {mod.label}</span>
          </div>
          <h1>{nb && aberto ? nb.titulo : mod.titulo}</h1>
          {nb && aberto && <p className="sl-sub">{nb.subtitulo}</p>}
          {nb && aberto && (
            <div className="sl-nb-meta">
              {nb.demo && <span className="sl-chip sl-chip-demo">Conteúdo de demonstração</span>}
              <span className="sl-chip">Derivado das aulas do {mod.label}</span>
            </div>
          )}
        </header>

        {!aberto ? (
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 56 }}>
            <AvisoTravado cal={cal} oque="O notebook deste módulo" />
            {calendario && <Trilha modulos={calendario.modulos} />}
          </div>
        ) : !nb ? (
          <div style={{ marginTop: 40 }}>
            <div className="sl-aviso" role="status">
              <div>
                <h2>O notebook deste módulo está em preparação</h2>
                <p>Os gráficos, textos e simuladores das aulas entram aqui quando forem publicados.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="sl-nb">
            <nav className="sl-nb-indice" aria-labelledby="indice-titulo">
              <h2 id="indice-titulo">Neste notebook</h2>
              <ol>
                {indice.map((e) => (
                  <li key={e.id}>
                    <a href={`#${e.id}`}>
                      <span aria-hidden="true">{e.numero ? String(e.numero).padStart(2, "0") : "·"}</span>
                      {e.rotulo}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="sl-nb-indice-pe">
                <Link href={hrefDoModulo(ord)}>Voltar para {nomeModulo}</Link>
                {aulas[0] && <Link href={href(aulas[0])}>Ir para a primeira aula</Link>}
              </div>
            </nav>
            <Blocos notebook={nb} aulas={aulas} />
          </div>
        )}
      </div>
    </div>
  );
}

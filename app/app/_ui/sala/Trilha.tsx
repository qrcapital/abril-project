import Link from "next/link";

import type { ModuloCalendario } from "@/lib/calendario";
import { ROMANO, rotuloModulo } from "@/lib/curso";
import { docentes } from "@/lib/docentes";

import { estadoDoModulo, hrefDoModulo } from "./estado";

/**
 * A trilha do curso: os módulos em linha, com "Você está aqui" no atual, o concluído cheio, o
 * aberto contornado e o fechado tracejado com a data (ou o motivo) de abertura.
 *
 * Lê só o `getCalendario()`, que é o mesmo veredito da guarda da página do módulo. Por isso um nó
 * aberto aqui nunca leva a uma aula que a guarda recusa. Nó fechado não é link: o destino só
 * repetiria a data que o próprio nó já mostra.
 *
 * Componente de servidor: não há interação além de navegar.
 */
export default function Trilha({ modulos, rotulo = "Trilha da formação" }: { modulos: ModuloCalendario[]; rotulo?: string }) {
  if (!modulos.length) return null;
  const n = modulos.length;
  // O trilho vermelho vai até o módulo atual; sem atual (tudo concluído, ou nada aberto), até o
  // último concluído.
  const iAtual = modulos.findIndex((m) => m.atual);
  let alcance = iAtual;
  if (alcance < 0) for (let i = n - 1; i >= 0; i--) if (modulos[i].concluido) { alcance = i; break; }

  return (
    <div className="sl-trilha" style={{ "--n": n } as React.CSSProperties}>
      <span className="sl-trilha-trilho" aria-hidden="true" />
      {alcance > 0 && (
        <span
          className="sl-trilha-feito"
          aria-hidden="true"
          style={{ width: `calc(100% / ${n} * ${alcance})` }}
        />
      )}
      <ol className="sl-trilha-lista" aria-label={rotulo}>
      {modulos.map((m) => {
        const e = estadoDoModulo(m);
        const profs = docentes(m.docente);
        const conteudo = (
          <>
            {m.atual && <span className="sl-aqui">Você está aqui</span>}
            <span className="sl-no-bola" aria-hidden="true">
              {m.concluido ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              ) : !m.aberto ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              ) : (
                ROMANO[m.ord] ?? m.ord
              )}
            </span>
            <span className="sl-no-texto">
              <span className="sl-no-rotulo">{rotuloModulo(m.ord)}</span>
              <span className="sl-no-titulo">{m.titulo}</span>
              {/* Um por linha: o Módulo I tem dois docentes desde 05/out/2026. */}
              {profs.map((prof) => (
                <span key={prof.nome} className="sl-no-docente">
                  {prof.foto && (
                    // Retrato de 22px num círculo: o next/image acrescentaria wrapper sem ganho.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={prof.foto} alt="" width={22} height={22} />
                  )}
                  {prof.nome}
                </span>
              ))}
              <span className="sl-no-estado">
                <span
                  className={`sl-chip ${e.classe === "is-feito" ? "sl-chip-ok" : e.classe === "is-travado" ? "sl-chip-trava" : ""}`}
                >
                  {e.texto}
                </span>
              </span>
            </span>
          </>
        );
        return (
          <li key={m.id} className={`sl-no ${e.classe}`} aria-current={m.atual ? "step" : undefined}>
            {m.aberto ? (
              <Link href={hrefDoModulo(m.ord)} className="sl-no-link">
                {conteudo}
              </Link>
            ) : (
              <span className="sl-no-link">{conteudo}</span>
            )}
          </li>
        );
      })}
      </ol>
    </div>
  );
}

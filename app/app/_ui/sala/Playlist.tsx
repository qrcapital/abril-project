import Link from "next/link";

import { href, type Aula } from "@/lib/curso";

/** "12 min" a partir dos segundos de `lessons.duracao`. Abaixo de um minuto arredonda para 1. */
export function minutos(segundos: number): string {
  return `${Math.max(1, Math.round(segundos / 60))} min`;
}

/**
 * A playlist do módulo: as aulas em fila horizontal, logo abaixo do teatro (30/set/2026).
 *
 * CADA CARTÃO É UM LINK DE VERDADE para `?aula=<n>#aula-<n>`: a troca de aula é navegação, com a
 * seleção renderizada no servidor. Funciona sem JS, abre em nova aba e o endereço é compartilhável.
 * O `scroll={false}` tira a rolagem automática do Next, que levaria a janela até a seção do
 * notebook e esconderia o vídeo que o aluno acabou de escolher; quem posiciona a janela e o notebook
 * é o `AncoraDaAula`. Sem JS, o navegador segue a âncora e cai na seção, que é o comportamento
 * honesto do link.
 *
 * Módulo fechado mostra os títulos sem link, como a página do módulo sempre fez: ver o que vem é o
 * que faz o aluno esperar em vez de desistir, e a guarda de verdade é a do servidor.
 */
export default function Playlist({
  aulas,
  atual,
  concluidas,
  aberto,
}: {
  aulas: Aula[];
  /** Posição da aula no teatro; `null` quando não há teatro (módulo fechado). */
  atual: number | null;
  concluidas: Set<number>;
  aberto: boolean;
}) {
  if (!aulas.length) return null;
  return (
    <nav className="sl-pl" aria-label="Aulas do módulo">
      {/* Fechado, a fila não tem link nenhum, e a rolagem lateral precisaria de um foco para o
          teclado alcançar os cartões de fora da tela. Aberto, os próprios links fazem isso. */}
      <ol className="sl-pl-fila" tabIndex={aberto ? undefined : 0}>
        {aulas.map((a) => {
          const feita = concluidas.has(a.n);
          const eAtual = a.pos === atual;
          const classe = `sl-pl-item${eAtual ? " is-atual" : ""}${feita ? " is-feita" : ""}${aberto ? "" : " is-travado"}`;
          const corpo = (
            <>
              <span className="sl-pl-topo">
                <span className="sl-pl-rotulo">Aula {a.pos}</span>
                {feita && (
                  <span className="sl-pl-ok">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    Concluída
                  </span>
                )}
              </span>
              <span className="sl-pl-titulo">{a.titulo}</span>
              <span className="sl-pl-pe">
                {eAtual ? <span className="sl-pl-agora">Tocando agora</span> : null}
                {a.duracao ? <span>{minutos(a.duracao)}</span> : null}
              </span>
            </>
          );
          return (
            <li key={a.id}>
              {aberto ? (
                <Link className={classe} href={href(a)} scroll={false} aria-current={eAtual ? "true" : undefined}>
                  {corpo}
                </Link>
              ) : (
                <span className={classe}>{corpo}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

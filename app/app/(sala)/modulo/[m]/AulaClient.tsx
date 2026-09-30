"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { estadoConcluir } from "@/lib/aula-template";

import { marcarAula } from "./actions";

/**
 * A única peça de cliente da aula: o botão de marcar e desmarcar a conclusão.
 *
 * Até 29/set/2026 este componente recebia a tela inteira em HTML portado e fazia delegação de
 * clique no container (anterior, próxima, itens da sidebar e o botão). Com a aula em JSX, a
 * navegação virou link de verdade (abre em nova aba, aparece no leitor de tela) e o que precisa
 * de estado ficou só aqui. O contrato continua o mesmo: `data-concluir` com o número da aula, a
 * server action `marcarAula` como única porta de escrita, e `router.refresh()` depois dela para
 * a playlist, o percentual e o cartão de fim de módulo acompanharem.
 *
 * Mudou de pasta em 30/set/2026, junto com a aula, que passou a tocar no teatro da página do
 * módulo (`/app/modulo/[m]?aula=<n>`). O componente e a action não mudaram.
 *
 * Marcação otimista: repinta antes da ida ao servidor, porque botão que não reage parece
 * quebrado; se a gravação falhar, desfaz e diz o porquê. Deixar a tela dizendo "concluída"
 * quando o banco não gravou seria pior que não ter repintado.
 *
 * A página monta este componente com `key` no estado do servidor, então o refresh que traz um
 * estado novo recria o botão em vez de brigar com o estado local.
 *
 * `pos` existe por uma armadilha da página do módulo: sem `?aula=` na URL, o teatro toca a primeira
 * aula NÃO concluída. Um `refresh` depois de concluir recalcularia essa escolha e trocaria o vídeo
 * no meio da aula. Por isso, quando a URL não fixa a aula, a volta do servidor vem por `replace`
 * com `?aula=<pos>`, que prende o teatro na aula que o aluno acabou de marcar.
 */
export default function AulaClient({ n, pos, concluida }: { n: number; pos: number; concluida: boolean }) {
  const router = useRouter();
  const [feita, setFeita] = useState(concluida);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const e = estadoConcluir(feita);

  async function alternar() {
    if (ocupado) return;
    const alvo = !feita;
    setFeita(alvo);
    setOcupado(true);
    setErro(null);
    const r = await marcarAula(n, alvo);
    setOcupado(false);
    if (r.ok) {
      const url = new URL(window.location.href);
      if (url.searchParams.get("aula") === String(pos)) {
        router.refresh();
      } else {
        url.searchParams.set("aula", String(pos));
        router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
      }
      return;
    }
    setFeita(!alvo);
    setErro(r.erro);
    console.error("[aula] falha ao marcar:", r.erro);
  }

  return (
    <>
      <button type="button" data-concluir={n} className={e.classe} onClick={alternar} disabled={ocupado} aria-busy={ocupado}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          {feita ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <circle cx="12" cy="12" r="8.5" />}
        </svg>
        {e.rotulo}
      </button>
      {erro && (
        <p className="sl-concluir-erro" role="alert">
          {erro}
        </p>
      )}
    </>
  );
}

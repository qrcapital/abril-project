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
 * a lista do módulo, o percentual e o gate da prova acompanharem.
 *
 * Marcação otimista: repinta antes da ida ao servidor, porque botão que não reage parece
 * quebrado; se a gravação falhar, desfaz e diz o porquê. Deixar a tela dizendo "concluída"
 * quando o banco não gravou seria pior que não ter repintado.
 *
 * A página monta este componente com `key` no estado do servidor, então o refresh que traz um
 * estado novo recria o botão em vez de brigar com o estado local.
 */
export default function AulaClient({ n, concluida }: { n: number; concluida: boolean }) {
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
      router.refresh();
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

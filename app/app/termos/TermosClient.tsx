"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { aceitarDocumentos } from "./actions";
import { emTrabalho, pintarCaixa } from "@/app/app/_ui/feedback";

/**
 * O formulário da tela de aceite. Mesmo desenho do `RedefinirClient`: o HTML vem montado do
 * servidor e este componente só liga o comportamento nele.
 *
 * `router.refresh()` antes do `push`: o gate que mandou o aluno para cá roda no layout do grupo
 * `(sala)`, que é servidor e está em cache de rota. Sem o refresh, a navegação de volta pode ser
 * servida do cache antigo, o gate responde com o estado de antes do aceite, e o aluno volta para
 * esta tela achando que o botão não funcionou.
 */
export default function TermosClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    pintarCaixa(ref.current?.querySelector<HTMLElement>("[data-feedback]"), "erro", erro);
  }, [erro]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const root = ref.current;
    const btn = root?.querySelector("button") ?? null;
    if (btn?.disabled) return;

    if (!root?.querySelector<HTMLInputElement>("[data-aceite]")?.checked) {
      setErro("Marque a caixa para confirmar que leu os documentos.");
      return;
    }

    setErro(null);
    const restaurar = emTrabalho(btn, "Confirmando...");
    const r = await aceitarDocumentos();
    if (r.ok) {
      router.refresh();
      router.push("/app");
    } else {
      restaurar();
      setErro(r.erro);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
    </form>
  );
}

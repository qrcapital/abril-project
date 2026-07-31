"use client";

import { confirmar, emTrabalho } from "@/app/app/_ui/feedback";

/**
 * Apagar aula. Cliente pelo mesmo motivo do `BotaoPapel` da Equipe: pedir confirmação com o
 * padrão 5 do `DESIGN.md` §3 em vez de `window.confirm`.
 *
 * A confirmação diz a CONSEQUÊNCIA MEDIDA, não um aviso genérico: quantos alunos perdem o
 * progresso gravado nesta aula. É o `on delete cascade` de `progress` e de `materials`, e foi a
 * razão pela qual apagar ficou atrás de um diálogo (PLANO-ADMIN §4.6).
 *
 * O envio é `form.submit()` nativo, que não passa pelo `onSubmit` do React, então sem JS a tela
 * ainda apaga — sem o diálogo. Diferente do caso da Equipe, aqui isso é perda real de proteção, e
 * é aceitável só porque o servidor não tem como saber se houve confirmação e a alternativa seria
 * um botão que não funciona sem hidratação.
 */
export default function ApagarAula({
  id,
  titulo,
  m,
  alunos,
}: {
  id: string;
  titulo: string;
  /** `ord` do módulo, para o acordeão reabrir no lugar certo. */
  m: number;
  /** Quantos alunos têm progresso gravado nesta aula. */
  alunos: number;
}) {
  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button");

    const ok = await confirmar({
      titulo: "Apagar esta aula?",
      corpo:
        alunos > 0
          ? `${titulo} sai do curso e ${alunos === 1 ? "1 aluno perde" : `${alunos} alunos perdem`} o progresso gravado nela, junto com os materiais anexados. Não há como desfazer.`
          : `${titulo} sai do curso, junto com os materiais anexados. Nenhum aluno tem progresso gravado nela. Não há como desfazer.`,
      destaque: titulo,
      confirmar: "Apagar aula",
      cancelar: "Cancelar",
    });
    if (!ok) return;

    emTrabalho(btn as HTMLButtonElement, "Apagando...");
    form.submit();
  };

  return (
    <form method="post" action="/admin/api/conteudo" onSubmit={enviar} className="inline">
      <input type="hidden" name="acao" value="apagar-aula" />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="m" value={m} />
      <button
        type="submit"
        className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-falha hover:border-falha"
      >
        Apagar
      </button>
    </form>
  );
}

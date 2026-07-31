"use client";

import { confirmar, emTrabalho } from "@/app/app/_ui/feedback";

/**
 * Apagar questão. Cliente pelo mesmo motivo do `ApagarAula` e do `BotaoPapel`: confirmação com o
 * padrão 5 do `DESIGN.md` §3.
 *
 * O corpo do diálogo diz as duas coisas que decidem o clique, e a segunda quase ninguém sabe de
 * cabeça: **prova já feita não muda**, porque cada tentativa guarda o `questions_snapshot` com o
 * enunciado e o gabarito de quando o aluno respondeu. E se o módulo ficar com menos de 5 ativas, a
 * prova para de abrir para todo mundo, que é o efeito colateral que ninguém espera de apagar uma
 * linha.
 */
export default function ApagarQuestao({
  id,
  enunciado,
  m,
  ativasDepois,
}: {
  id: string;
  enunciado: string;
  /** `ord` do módulo, para o acordeão reabrir no lugar certo. */
  m: number;
  /** Quantas questões ativas sobram no módulo se esta sair. */
  ativasDepois: number;
}) {
  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button");

    const resumo = enunciado.length > 80 ? `${enunciado.slice(0, 80)}...` : enunciado;
    const ok = await confirmar({
      titulo: "Apagar esta questão?",
      corpo:
        ativasDepois < 5
          ? `${resumo} Provas já feitas não mudam, porque cada tentativa guarda a própria cópia das questões. Mas o módulo fica com ${ativasDepois} ativas, e o sorteio precisa de 5: a prova para de abrir para todos os alunos.`
          : `${resumo} Provas já feitas não mudam, porque cada tentativa guarda a própria cópia das questões.`,
      destaque: resumo,
      confirmar: "Apagar questão",
      cancelar: "Cancelar",
    });
    if (!ok) return;

    emTrabalho(btn as HTMLButtonElement, "Apagando...");
    form.submit();
  };

  return (
    <form method="post" action="/admin/api/questoes" onSubmit={enviar} className="inline">
      <input type="hidden" name="acao" value="apagar" />
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

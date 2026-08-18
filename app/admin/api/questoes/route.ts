import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { auditar } from "@/lib/auditoria";
import { ALTERNATIVAS, LETRAS } from "@/lib/questoes";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Escreve o banco de questões (PLANO-ADMIN §4.4).
 *
 * ┌─ LEIA ISTO ANTES DE MEXER ─────────────────────────────────────────────────────────────┐
 * │ A CHECAGEM DE PAPEL AQUI DENTRO É O ÚNICO GUARDA DESTA ROTA.                             │
 * │                                                                                         │
 * │ Route handler não passa por layout, e esta é a rota mais sensível do painel: `questions`  │
 * │ guarda a coluna `correta`, que é o GABARITO da prova. A tabela é fechada para o aluno de  │
 * │ propósito (nem `sortear_prova` devolve a resposta), e a escrita aqui sai pela service     │
 * │ role, que ignora RLS. Sem o `papel !== "admin"` abaixo, qualquer pessoa logada editaria   │
 * │ o gabarito do próprio exame.                                                             │
 * └─────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Apagar não corrompe histórico: cada tentativa guarda `exams.questions_snapshot` com o enunciado e
 * o gabarito de quando o aluno respondeu, então prova já feita continua correta depois de a questão
 * sair do banco. É por isso que apagar existe além de desativar.
 *
 * Toda ação é auditada (plano de correções de 17/ago, item 19): esta rota muda o GABARITO, e
 * gabarito mudando sem rastro é o tipo de coisa que só aparece na nota de alguém, meses depois.
 * O detalhe leva o começo do enunciado e a letra correta — o suficiente para responder "o que
 * valia quando o aluno reclamou" sem duplicar a tabela no rastro.
 */

const UUID = /^[0-9a-f-]{36}$/i;

function voltar(req: NextRequest, params: Record<string, string>) {
  const url = new URL("/admin/questoes", req.url);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  // 303: o POST vira GET na volta, senão recarregar a tela repete a escrita.
  return NextResponse.redirect(url, 303);
}

/**
 * As quatro alternativas e a correta, validadas juntas.
 *
 * O `CHECK` da tabela só exige **quatro** entradas no array; alternativa em branco passaria por ele
 * e chegaria na prova como uma opção vazia para o aluno escolher. E `correta` fora de 0..3 seria uma
 * questão que ninguém acerta, o que só apareceria na nota de alguém.
 */
function lerAlternativas(form: FormData): { alternativas: string[]; correta: number } | string {
  const alternativas = LETRAS.map((_, i) => String(form.get(`alt${i}`) ?? "").trim());
  if (alternativas.some((a) => !a)) {
    return `Preencha as ${ALTERNATIVAS} alternativas.`;
  }
  const correta = Number(form.get("correta"));
  if (!Number.isInteger(correta) || correta < 0 || correta >= ALTERNATIVAS) {
    return "Marque qual alternativa é a correta.";
  }
  return { alternativas, correta };
}

export async function POST(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });

  const form = await req.formData();
  const texto = (campo: string) => String(form.get(campo) ?? "").trim();
  const acao = texto("acao");
  const id = texto("id");
  const m = texto("m");
  const falha = (msg: string) => voltar(req, { erro: msg, abrir: m });

  const db = createAdminClient();

  switch (acao) {
    case "nova": {
      if (!UUID.test(id)) return falha("Pedido inválido.");
      const enunciado = texto("enunciado");
      if (!enunciado) return falha("A questão precisa de um enunciado.");
      const alt = lerAlternativas(form);
      if (typeof alt === "string") return falha(alt);

      const { data, error } = await db
        .from("questions")
        .insert({
          module_id: id,
          enunciado,
          alternativas: alt.alternativas,
          correta: alt.correta,
          // Nasce ativa: quem escreveu a questão quer ela no sorteio, e o contador do módulo é o que
          // mostra se ela ainda cabe na meta.
          ativo: true,
        })
        .select("id")
        .single();
      if (error) return falha("A gravação falhou.");
      await auditar(db, {
        autor,
        acao: "questao.criar",
        alvo: data?.id ?? null,
        detalhe: { enunciado: enunciado.slice(0, 80), correta: LETRAS[alt.correta] },
      });
      return voltar(req, { ok: "nova", abrir: m });
    }

    case "salvar": {
      if (!UUID.test(id)) return falha("Pedido inválido.");
      const enunciado = texto("enunciado");
      if (!enunciado) return falha("A questão precisa de um enunciado.");
      const alt = lerAlternativas(form);
      if (typeof alt === "string") return falha(alt);

      const ativo = form.get("ativo") === "on";
      const { error } = await db
        .from("questions")
        .update({
          enunciado,
          alternativas: alt.alternativas,
          correta: alt.correta,
          // Checkbox ausente do POST é checkbox desmarcado: o navegador só envia quando marcada.
          ativo,
        })
        .eq("id", id);
      if (error) return falha("A gravação falhou.");
      await auditar(db, {
        autor,
        acao: "questao.salvar",
        alvo: id,
        detalhe: { enunciado: enunciado.slice(0, 80), correta: LETRAS[alt.correta], ativo },
      });
      return voltar(req, { ok: "salva", abrir: m });
    }

    case "apagar": {
      if (!UUID.test(id)) return falha("Pedido inválido.");
      // O enunciado é lido ANTES do delete porque é a única resposta que a auditoria tem para
      // "qual questão sumiu": depois do delete, o id não aponta mais para nada.
      const { data: antiga } = await db.from("questions").select("enunciado").eq("id", id).maybeSingle();
      const { error } = await db.from("questions").delete().eq("id", id);
      if (error) return falha("A exclusão falhou.");
      await auditar(db, {
        autor,
        acao: "questao.apagar",
        alvo: id,
        detalhe: { enunciado: String(antiga?.enunciado ?? "").slice(0, 80) },
      });
      return voltar(req, { ok: "apagada", abrir: m });
    }

    default:
      return falha("Pedido inválido.");
  }
}

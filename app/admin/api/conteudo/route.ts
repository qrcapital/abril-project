import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { auditar } from "@/lib/auditoria";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Escreve o conteúdo do curso: módulos, aulas e materiais (PLANO-ADMIN §4.6).
 *
 * ┌─ LEIA ISTO ANTES DE MEXER ─────────────────────────────────────────────────────────────┐
 * │ A CHECAGEM DE PAPEL AQUI DENTRO É O ÚNICO GUARDA DESTA ROTA.                            │
 * │                                                                                         │
 * │ Route handler NÃO passa por layout, então a guarda de `app/admin/layout.tsx` não vale     │
 * │ aqui: qualquer pessoa logada pode dar POST neste endereço direto, sem nunca abrir uma    │
 * │ tela do admin. E a escrita sai pela service role, onde `auth.uid()` é null, então nenhuma │
 * │ policy de RLS segura por baixo. É a mesma caixa do `api/papel/route.ts`, e o motivo de    │
 * │ ela estar repetida aqui é que a regra vale por ROTA, não por pasta.                      │
 * └─────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Uma rota para as nove ações em vez de nove rotas: a autorização é a mesma, a volta para a tela
 * é a mesma, e a ação vem no `name`/`value` do próprio botão de submit. Isso é o que deixa a tela
 * ter um formulário por aula com [Salvar] [↑] [↓] em vez de três.
 *
 * Responde 404 e não 403 para não-admin, pelo mesmo motivo da guarda do layout: não confirmar que
 * a rota existe.
 *
 * Toda ação é auditada (plano de correções de 17/ago, item 19): esta rota muda o que o aluno
 * vê e o que conta para o gate da prova, sem deploy — mudança de conteúdo sem rastro é a
 * pergunta "quem apagou a aula 12?" sem resposta. Apagar lê o título antes, porque depois do
 * delete o id não aponta mais para nada.
 */

const DESTINO = "/admin/conteudo";
const UUID = /^[0-9a-f-]{36}$/i;

/**
 * Endereço de arquivo aceito. A decisão do Pedro em 31/jul foi **URL colada** em vez de upload
 * para o Storage, então o valor vai direto para o `href` do link de material do aluno
 * (`lib/aula-template.ts`). Admin é gente de confiança, mas fronteira de confiança é fronteira:
 * sem esta linha um `javascript:` colado ali vira script rodando na tela do aluno.
 */
const ARQUIVO_OK = /^(https?:\/\/|\/)/i;

/** Volta para a tela com o módulo aberto e uma mensagem. */
function voltar(req: NextRequest, params: Record<string, string>) {
  const url = new URL(DESTINO, req.url);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  // 303: o POST virou GET na volta, senão o recarregar da tela repete a mutação.
  return NextResponse.redirect(url, 303);
}

export async function POST(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });

  const form = await req.formData();
  const texto = (campo: string) => String(form.get(campo) ?? "").trim();

  const acao = texto("acao");
  const id = texto("id");
  const m = texto("m"); // ord do módulo, só para reabrir o acordeão na volta
  const erro = (msg: string) => voltar(req, { m, erro: msg });

  const db = createAdminClient();

  switch (acao) {
    case "modulo": {
      if (!UUID.test(id)) return erro("Pedido inválido.");
      const titulo = texto("titulo");
      if (!titulo) return erro("O título do módulo não pode ficar vazio.");
      const { error } = await db
        .from("modules")
        .update({ titulo, docente: texto("docente") || null })
        .eq("id", id);
      if (error) return erro("A gravação falhou.");
      await auditar(db, { autor, acao: "conteudo.modulo", alvo: id, detalhe: { titulo } });
      return voltar(req, { m, ok: "modulo" });
    }

    case "aula": {
      if (!UUID.test(id)) return erro("Pedido inválido.");
      const titulo = texto("titulo");
      if (!titulo) return erro("O título da aula não pode ficar vazio.");
      // Checkbox ausente do POST é checkbox desmarcado: o navegador só envia quando marcada.
      const gate = form.get("gate") === "on";
      const { error } = await db
        .from("lessons")
        .update({
          titulo,
          descricao: texto("descricao") || null,
          panda_video_id: texto("video") || null,
          conta_no_gate: gate,
        })
        .eq("id", id);
      if (error) return erro("A gravação falhou.");
      // O `gate` entra no detalhe porque é a parte da edição que mexe na prova: desmarcar uma
      // aula muda o 16/16 de todo mundo.
      await auditar(db, { autor, acao: "conteudo.aula", alvo: id, detalhe: { titulo, gate } });
      return voltar(req, { m, ok: "aula" });
    }

    case "subir":
    case "descer": {
      if (!UUID.test(id)) return erro("Pedido inválido.");
      const { error } = await db.rpc("mover_aula", {
        p_lesson: id,
        p_delta: acao === "subir" ? -1 : 1,
      });
      if (error) return erro("Não deu para mover a aula.");
      await auditar(db, { autor, acao: "conteudo.mover", alvo: id, detalhe: { direcao: acao } });
      return voltar(req, { m, ok: "movida" });
    }

    case "nova-aula": {
      if (!UUID.test(id)) return erro("Pedido inválido.");
      const titulo = texto("titulo");
      if (!titulo) return erro("Dê um título para a aula nova.");

      // `ord` é o último + 1, e não a contagem de aulas: apagar aula deixa buraco na numeração, e
      // contar daria um `ord` que já existe, batendo no `unique (module_id, ord)`.
      const { data: ultima } = await db
        .from("lessons")
        .select("ord")
        .eq("module_id", id)
        .order("ord", { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: nova, error } = await db
        .from("lessons")
        .insert({
          module_id: id,
          ord: (ultima?.ord ?? -1) + 1,
          titulo,
          // Nasce contando para o gate, que é o default da coluna e o caso comum: aula nova de
          // módulo de conteúdo conta, e as boas-vindas já existem.
          conta_no_gate: true,
        })
        .select("id")
        .single();
      if (error) return erro("A gravação falhou.");
      await auditar(db, { autor, acao: "conteudo.aula-criar", alvo: nova?.id ?? null, detalhe: { titulo } });
      return voltar(req, { m, ok: "aula-nova" });
    }

    case "apagar-aula": {
      if (!UUID.test(id)) return erro("Pedido inválido.");
      const { data: aula } = await db.from("lessons").select("titulo").eq("id", id).maybeSingle();
      // O progresso e os materiais da aula vão embora com ela, pelo `on delete cascade` das duas
      // tabelas. Quem confirma na tela vê a contagem de alunos afetados antes de clicar.
      const { error } = await db.from("lessons").delete().eq("id", id);
      if (error) return erro("A exclusão falhou.");
      await auditar(db, {
        autor,
        acao: "conteudo.aula-apagar",
        alvo: id,
        detalhe: { titulo: String(aula?.titulo ?? "") },
      });
      return voltar(req, { m, ok: "aula-apagada" });
    }

    case "material": {
      if (!UUID.test(id)) return erro("Pedido inválido.");
      const titulo = texto("titulo");
      const arquivo = texto("arquivo");
      if (!titulo) return erro("O material precisa de um título.");
      if (!ARQUIVO_OK.test(arquivo)) return erro("O endereço precisa começar com https:// ou /.");
      const { error } = await db.from("materials").update({ titulo, arquivo }).eq("id", id);
      if (error) return erro("A gravação falhou.");
      // O `arquivo` entra no detalhe: material é URL que vai direto para o href do aluno, e a
      // auditoria precisa dizer PARA ONDE passou a apontar.
      await auditar(db, { autor, acao: "conteudo.material", alvo: id, detalhe: { titulo, arquivo } });
      return voltar(req, { m, ok: "material" });
    }

    case "apagar-material": {
      if (!UUID.test(id)) return erro("Pedido inválido.");
      const { data: mat } = await db.from("materials").select("titulo").eq("id", id).maybeSingle();
      const { error } = await db.from("materials").delete().eq("id", id);
      if (error) return erro("A exclusão falhou.");
      await auditar(db, {
        autor,
        acao: "conteudo.material-apagar",
        alvo: id,
        detalhe: { titulo: String(mat?.titulo ?? "") },
      });
      return voltar(req, { m, ok: "material-apagado" });
    }

    case "novo-material": {
      // O vínculo vem num campo só, `l:<uuid>` ou `m:<uuid>`, porque a tabela aceita aula OU
      // módulo e um `<select>` único deixa a escolha explícita para quem preenche.
      const vinculo = texto("vinculo");
      const alvo = vinculo.slice(2);
      const titulo = texto("titulo");
      const arquivo = texto("arquivo");
      if (!/^[lm]:/.test(vinculo) || !UUID.test(alvo)) return erro("Escolha onde o material entra.");
      if (!titulo) return erro("O material precisa de um título.");
      if (!ARQUIVO_OK.test(arquivo)) return erro("O endereço precisa começar com https:// ou /.");

      // `tipo` é derivado do vínculo em vez de perguntado: material de aula é resumo, material de
      // módulo é apostila, e é essa a distinção que o `lib/materiais.ts` já faz ao juntar os dois
      // numa lista só para o aluno. Nada lê a coluna hoje, e um campo a mais no formulário seria
      // uma escolha sem consequência.
      const { data: novoMat, error } = await db
        .from("materials")
        .insert(
          vinculo[0] === "l"
            ? { lesson_id: alvo, tipo: "resumo", titulo, arquivo }
            : { module_id: alvo, tipo: "apostila", titulo, arquivo },
        )
        .select("id")
        .single();
      if (error) return erro("A gravação falhou.");
      await auditar(db, {
        autor,
        acao: "conteudo.material-criar",
        alvo: novoMat?.id ?? null,
        detalhe: { titulo, arquivo },
      });
      return voltar(req, { m, ok: "material-novo" });
    }

    default:
      return erro("Pedido inválido.");
  }
}

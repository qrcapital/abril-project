import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { auditar } from "@/lib/auditoria";
import { liberarSegundaChamada, tentativaAtual } from "@/lib/prova";
import { podeSegundaChamada } from "@/lib/prova-correcao";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Libera a 2ª chamada da prova (PRD §7, PLANO-ADMIN §4.3).
 *
 * ┌─ LEIA ISTO ANTES DE MEXER ─────────────────────────────────────────────────────────────┐
 * │ A CHECAGEM DE PAPEL AQUI DENTRO É O ÚNICO GUARDA DESTA ROTA.                             │
 * │                                                                                         │
 * │ Route handler não passa por layout. Sem o `papel !== "admin"` abaixo, qualquer aluno      │
 * │ logado liberaria a própria 2ª chamada dando POST neste endereço, o que transforma uma     │
 * │ prova de tentativa única em prova de tentativas infinitas.                                │
 * └─────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * POR QUE ESTA AÇÃO EXISTIA COMO PROMESSA E NÃO COMO CÓDIGO: a tela do aluno reprovado manda ele
 * "Solicitar 2ª chamada no WhatsApp", o e-mail de reprovação diz que ela é liberada caso a caso, e o
 * `lib/prova.ts` já era escrito para a tentativa 2 — mas não havia botão nem script. O primeiro aluno
 * a reprovar em produção geraria um ticket que ninguém conseguia atender.
 *
 * A REGRA DE QUEM PODE RECEBER é a `podeSegundaChamada`, pura e com casos no `check:prova`. Ela mora
 * lá e não aqui porque a recusa que importa não é óbvia: liberar para quem **passou** trocaria a
 * tentativa vigente por uma sem nota e tiraria o acesso ao certificado que o aluno já tinha.
 */

const UUID = /^[0-9a-f-]{36}$/i;

function voltar(req: NextRequest, alvo: string, params: Record<string, string>) {
  const url = new URL(`/admin/alunos/${alvo}`, req.url);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  // 303: o POST vira GET na volta, senão recarregar a tela liberaria outra tentativa.
  return NextResponse.redirect(url, 303);
}

export async function POST(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });

  const form = await req.formData();
  const acao = String(form.get("acao") ?? "");
  const alvo = String(form.get("userId") ?? "");
  if (acao !== "segunda-chamada" || !UUID.test(alvo)) {
    return new NextResponse(null, { status: 404 });
  }

  const atual = await tentativaAtual(alvo);
  // Nota da COLUNA, a mesma fonte que a tela usa. Ela é escrita pela mesma `corrigir` no envio e no
  // fechamento pela rotina, então recorrigir aqui só abriria espaço para as duas telas discordarem.
  const decisao = podeSegundaChamada(atual && { status: atual.status, nota: atual.score });
  if (!decisao.ok) return voltar(req, alvo, { erro: decisao.motivo });

  const liberada = await liberarSegundaChamada(alvo);
  if (!liberada) return voltar(req, alvo, { erro: "Não deu para liberar a tentativa." });

  await auditar(createAdminClient(), {
    autor,
    acao: "prova.segunda-chamada",
    alvo,
    // A nota que reprovou entra no rastro: é o que responde "por que essa pessoa ganhou outra
    // chance?" meses depois, sem depender da memória de quem clicou.
    detalhe: { attempt: liberada.attempt, nota_anterior: atual?.score ?? null },
  });

  return voltar(req, alvo, { ok: "segunda-chamada" });
}

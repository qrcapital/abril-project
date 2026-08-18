"use server";

import { createClient } from "@/lib/supabase/server";
import { getConcluidas } from "@/lib/progresso";
import { getCurriculo } from "@/lib/curriculo";
import { liberacao } from "@/lib/liberacao";
import { getMatricula } from "@/lib/matricula";
import { getRegras } from "@/lib/politicas";
import { abrirTentativa, enviar, salvarResposta } from "@/lib/prova";
import { LETRAS, type Letra } from "@/lib/prova-correcao";

/**
 * Ações da prova. Cada uma resolve o aluno pela SESSÃO, no servidor. O motor usa a
 * service role, que ignora RLS, então aceitar um `userId` do cliente aqui entregaria
 * a prova de um aluno a outro.
 */

async function usuarioAtual(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export type RespostaAcao = { ok: true } | { ok: false; erro: string };

/**
 * COMEÇAR a prova exige os dois gates que a página confere: as aulas avaliadas todas
 * concluídas (garantia de verdade desde 29/jul, quando o progresso saiu do cookie para a
 * tabela `progress`) e a trava de CALENDÁRIO da política de liberação — sem ela aqui, o POST
 * direto da action pulava a esteira que a página impõe. Só o começar: `responder` e
 * `enviarProva` não conferem gate nenhum, porque trocar a política no meio de uma tentativa
 * não pode trancar quem já está dentro.
 */
export async function iniciarProva(): Promise<RespostaAcao> {
  const userId = await usuarioAtual();
  if (!userId) return { ok: false, erro: "Sessão expirada. Entre de novo." };

  const [curriculo, concluidas, { inicioEm, liberacaoTotal, politicaId }] = await Promise.all([
    getCurriculo(),
    getConcluidas(),
    getMatricula(),
  ]);
  if (!curriculo.provaLiberada(concluidas))
    return {
      ok: false,
      erro: `Conclua as ${curriculo.totalAvaliadas} aulas da formação para liberar a prova.`,
    };
  const regras = await getRegras(politicaId);
  if (!inicioEm || !liberacao(inicioEm, liberacaoTotal, regras).completo)
    return {
      ok: false,
      erro: "A prova abre quando todos os módulos do cronograma estiverem liberados.",
    };

  try {
    await abrirTentativa(userId);
    return { ok: true };
  } catch (e) {
    console.error("[prova] falha ao abrir tentativa:", e);
    return { ok: false, erro: "Não foi possível abrir a prova. Tente de novo." };
  }
}

export async function responder(posicao: number, letra: string): Promise<RespostaAcao> {
  const userId = await usuarioAtual();
  if (!userId) return { ok: false, erro: "Sessão expirada. Entre de novo." };
  if (!LETRAS.includes(letra as Letra)) return { ok: false, erro: "Alternativa inválida." };

  try {
    const r = await salvarResposta(userId, posicao, letra as Letra);
    if (r.ok) return { ok: true };
    return {
      ok: false,
      erro:
        r.motivo === "expirada"
          ? "O tempo da prova terminou."
          : "Esta prova já foi encerrada.",
    };
  } catch (e) {
    console.error("[prova] falha ao salvar resposta:", e);
    return { ok: false, erro: "Não foi possível salvar a resposta." };
  }
}

export async function enviarProva(): Promise<RespostaAcao> {
  const userId = await usuarioAtual();
  if (!userId) return { ok: false, erro: "Sessão expirada. Entre de novo." };

  try {
    await enviar(userId);
    return { ok: true };
  } catch (e) {
    console.error("[prova] falha ao enviar prova:", e);
    return { ok: false, erro: "Não foi possível enviar a prova. Tente de novo." };
  }
}

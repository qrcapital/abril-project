"use server";

import { createClient } from "@/lib/supabase/server";
import { getConcluidas } from "@/lib/progresso";
import { getCurriculo } from "@/lib/curriculo";
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

/**
 * O gate de 16/16 aulas.
 *
 * Desde 29/jul isto é garantia de verdade, e não mais o teto de confiança do cliente: o
 * progresso saiu do cookie para a tabela `progress`, então o aluno não escreve mais o dado
 * que abre a própria prova. A trava de calendário da esteira, na página, é independente
 * desta e continua valendo.
 */
async function gateLiberado(): Promise<boolean> {
  const [curriculo, concluidas] = await Promise.all([getCurriculo(), getConcluidas()]);
  return curriculo.provaLiberada(concluidas);
}

export type RespostaAcao = { ok: true } | { ok: false; erro: string };

export async function iniciarProva(): Promise<RespostaAcao> {
  const userId = await usuarioAtual();
  if (!userId) return { ok: false, erro: "Sessão expirada. Entre de novo." };
  if (!(await gateLiberado()))
    return { ok: false, erro: "Conclua as 16 aulas da formação para liberar a prova." };

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

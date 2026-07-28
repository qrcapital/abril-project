"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { nomeCookie, parseConcluidas } from "@/lib/progresso";
import { provaLiberada } from "@/lib/curso";
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
 * ponytail: o progresso ainda é cookie (`lib/progresso.ts`), e cookie é editável pelo
 * aluno, então esta checagem tem o teto de confiança do cliente. Não é regressão: a
 * versão anterior checava só no navegador, e aqui pelo menos o servidor recusa abrir a
 * tentativa. Vira garantia de verdade quando o progresso for para a tabela `progress`
 * (HANDOFF §2, item 6), e então só esta função muda.
 */
async function gateLiberado(userId: string): Promise<boolean> {
  const bruto = (await cookies()).get(nomeCookie(userId))?.value;
  return provaLiberada(parseConcluidas(bruto));
}

export type RespostaAcao = { ok: true } | { ok: false; erro: string };

export async function iniciarProva(): Promise<RespostaAcao> {
  const userId = await usuarioAtual();
  if (!userId) return { ok: false, erro: "Sessão expirada. Entre de novo." };
  if (!(await gateLiberado(userId)))
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

"use server";

import { headers } from "next/headers";

import { ipDaRequisicao } from "@/lib/consentimento";
import { enviarRedefinicao } from "@/lib/email";
import { chaveDeEmail, consumirLimite } from "@/lib/limite";
import { baseDoSite } from "@/lib/seguranca";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Tetos da recuperação, por hora. O de e-mail protege a caixa de entrada de quem é alvo (e a
 * reputação do nosso remetente); o de IP segura quem varre uma lista de endereços. 20 por IP cabe
 * uma sala de aula atrás do mesmo NAT, que é o caso legítimo mais apertado.
 */
const POR_EMAIL = 5;
const POR_IP = 20;
const JANELA_S = 3600;

/**
 * Dispara o e-mail de redefinição.
 *
 * Devolve sempre o MESMO resultado, exista o e-mail ou não, estoure o teto ou não, falhe o envio
 * ou não. Revelar a diferença transformaria a tela num verificador de quais e-mails têm conta
 * (`ROUTES.md`). O que acontece de verdade fica no log do servidor e no `email_log`.
 *
 * ┌─ POR QUE NÃO MAIS `resetPasswordForEmail` ────────────────────────────────────────────────────┐
 * │ Ele manda pelo SMTP do Supabase Auth, que tem teto de 30 e-mails por hora no projeto inteiro. │
 * │ Com o lançamento, isso acabaria na primeira manhã, e o 31º aluno não receberia nada, sem erro │
 * │ na tela. Agora o servidor gera o link com a service role e manda o nosso template, pelo mesmo │
 * │ envio do boas-vindas (`lib/email.ts`).                                                        │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * A BASE DO LINK, EM PRODUÇÃO, É SÓ `NEXT_PUBLIC_SITE_URL` (`baseDoSite`). Seguir o `Origin`, como
 * a versão anterior fazia, deixava qualquer um pedir a redefinição da senha de outra pessoa com
 * `Origin: https://atacante.com`, e o e-mail legítimo levaria o token para lá.
 */
export async function pedirReset(email: string): Promise<{ ok: true }> {
  const limpo = email.trim().toLowerCase();

  // Validação de forma só para não gastar chamada com entrada vazia; o resultado para o
  // usuário é o mesmo de qualquer jeito.
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(limpo) || limpo.length > 254) return { ok: true };

  try {
    const db = createAdminClient();

    // Os dois tetos são consumidos SEMPRE, na mesma ordem, antes de saber se a conta existe: um
    // teto que só contasse e-mails com conta viraria, ele mesmo, o verificador que a tela evita.
    const ip = (await ipDaRequisicao()) ?? "sem-ip";
    const [ipOk, emailOk] = await Promise.all([
      consumirLimite(db, `senha:ip:${ip}`, POR_IP, JANELA_S),
      consumirLimite(db, chaveDeEmail("senha", limpo), POR_EMAIL, JANELA_S),
    ]);
    if (!ipOk || !emailOk) {
      console.warn(`[recuperar-senha] teto atingido (${!ipOk ? "ip" : "email"})`);
      return { ok: true };
    }

    const base = baseDoSite({ origem: (await headers()).get("origin") });
    if (!base) {
      console.error("[recuperar-senha] sem NEXT_PUBLIC_SITE_URL: o link sairia relativo");
      return { ok: true };
    }

    const r = await enviarRedefinicao(db, { email: limpo, base });
    if (!r.ok) console.warn("[recuperar-senha] nao enviado:", r.status);
  } catch (e) {
    console.error("[recuperar-senha] falhou:", e instanceof Error ? e.message : e);
  }

  return { ok: true };
}

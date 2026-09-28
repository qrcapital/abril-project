import { NextResponse, type NextRequest } from "next/server";

import { TEXTO_AVISO_LISTA, registrarConsentimento } from "@/lib/consentimento";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Registra o consentimento de quem ainda não tem conta: hoje, a `/lista-de-espera`.
 *
 * ┌─ POR QUE ESTA ROTA EXISTE SE O LEAD VAI PARA O RD STATION ────────────────────────────────────┐
 * │ Porque o lead e o consentimento são coisas diferentes. O RD guarda o lead, e é bom nisso. O   │
 * │ que ele não faz é responder, um ano depois, "qual versão da Política esta pessoa tinha na      │
 * │ frente quando mandou o formulário?". Foi exatamente isso que a Abril perguntou, e a resposta   │
 * │ não pode depender de abrir um chamado com fornecedor.                                          │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * NÃO SUBSTITUI O RD, E NÃO PODE ATRAPALHAR O RD. O formulário chama isto em paralelo, sem esperar
 * a resposta: se esta rota cair, o lead continua chegando no painel do RD, que é o que faz a
 * operação de marketing andar. O caminho contrário, deixar a captura do lead pendurada numa rota
 * nossa, trocaria uma falha de registro por uma falha de aquisição.
 *
 * Rota pública que escreve no banco, então três guardas. Nenhuma delas é forte sozinha, e juntas
 * resolvem o caso real, que é robô de formulário, não adversário dedicado:
 *
 * 1. o corpo é validado campo a campo e tudo que passa é aparado no tamanho;
 * 2. um teto por IP em memória, explicado abaixo;
 * 3. nada do que chega aqui concede acesso a coisa nenhuma. O pior caso é lixo no log de
 *    consentimento, não conta criada nem e-mail disparado.
 */

const EMAIL = /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/;

/**
 * Teto por IP, em memória do processo.
 *
 * SAIBA O QUE ISTO NÃO É: não é rate limit de verdade. A Netlify roda várias instâncias e cada uma
 * tem o próprio mapa, então o teto real é o número de instâncias vezes este valor, e reinício zera
 * tudo. Serve para o caso que acontece, que é o mesmo formulário sendo reenviado em rajada. Teto
 * sério exige estado compartilhado (o próprio Postgres serviria), e a hora de fazer isso é quando
 * aparecer abuso de verdade, não antes.
 */
const JANELA_MS = 60_000;
const TETO_POR_JANELA = 5;
const visitas = new Map<string, { n: number; ate: number }>();

function excedeu(ip: string): boolean {
  const agora = Date.now();

  // Faxina oportunista: sem ela o mapa cresce para sempre numa instância de vida longa. Roda junto
  // com a checagem porque um timer manteria a instância acordada à toa.
  if (visitas.size > 5_000) for (const [k, v] of visitas) if (v.ate < agora) visitas.delete(k);

  const atual = visitas.get(ip);
  if (!atual || atual.ate < agora) {
    visitas.set(ip, { n: 1, ate: agora + JANELA_MS });
    return false;
  }
  atual.n += 1;
  return atual.n > TETO_POR_JANELA;
}

const texto = (v: unknown, teto: number): string | null => {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s.slice(0, teto) : null;
};

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "sem-ip";
  if (excedeu(ip)) return NextResponse.json({ ok: false }, { status: 429 });

  let corpo: Record<string, unknown>;
  try {
    corpo = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = texto(corpo.email, 254)?.toLowerCase() ?? "";
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false }, { status: 400 });

  /**
   * O `try` cobre a criação do cliente, e isso NÃO é zelo excessivo: `createAdminClient()` lança
   * na hora se `NEXT_PUBLIC_SUPABASE_URL` ou a service role não estiverem no ambiente, e foi
   * exatamente o que aconteceu no deploy preview, onde essas variáveis não estão configuradas.
   * A rota respondia 500 com corpo vazio, e o formulário lia `r.ok === false` sem nenhuma pista
   * do motivo. Agora a falha vira uma resposta honesta e o motivo vai para o log do servidor.
   */
  let registradas = 0;
  try {
    registradas = await registrarConsentimento(createAdminClient(), {
      email,
      nome: texto(corpo.nome, 200),
      origem: "lista-de-espera",
      texto: TEXTO_AVISO_LISTA,
      tipos: ["politica"],
    });
  } catch (e) {
    console.error("[consentimento] rota falhou antes de gravar:", (e as Error).message);
  }

  /**
   * 200 SEMPRE, e o veredito no corpo. O visitante não tem o que fazer com um 500, e o formulário
   * precisa distinguir três coisas que um código de status não separa: gravou, não gravou, e a
   * requisição nem chegou. Quem lê isto é o `Formulario.tsx`, que usa o `ok` para decidir se pode
   * confirmar o cadastro quando o RD Station não está de pé.
   */
  return NextResponse.json({ ok: registradas > 0 });
}

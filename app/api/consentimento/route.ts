import { NextResponse, type NextRequest } from "next/server";

import { TEXTO_AVISO_LISTA, ipDaRequisicao, registrarConsentimento } from "@/lib/consentimento";
import { consumirLimite } from "@/lib/limite";
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
 * 2. um teto por IP, explicado abaixo;
 * 3. nada do que chega aqui concede acesso a coisa nenhuma. O pior caso é lixo no log de
 *    consentimento, não conta criada nem e-mail disparado.
 *
 * ┌─ O QUE UMA LINHA DAQUI PROVA, E O QUE NÃO PROVA ──────────────────────────────────────────────┐
 * │ O e-mail desta rota NÃO É VERIFICADO: ninguém clicou num link de confirmação, então a linha   │
 * │ prova que alguém mandou o formulário com aquele endereço, não que o dono do endereço mandou.  │
 * │ A marca disso já está na própria linha, sem coluna nova: `origem = 'lista-de-espera'` é, por  │
 * │ construção, e-mail não verificado. Os aceites com e-mail verificado são os de origem          │
 * │ `primeiro-acesso` (a pessoa abriu o link que chegou na caixa dela) e `checkout-guru` (o       │
 * │ pagamento amarra o pedido). Quem responder a um titular a partir do CSV precisa saber disso.   │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 */

const EMAIL = /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/;

/**
 * Teto por IP: 5 envios por minuto, contados no Postgres (`consumir_limite`, migration `0025`).
 *
 * Era um Map em memória até 29/set/2026, e o comentário dele já avisava o que ele não era: cada
 * instância da Netlify tinha o próprio mapa, o teto real era o número de instâncias vezes cinco, e
 * reinício zerava tudo. Com o estado no banco o teto vale para o site inteiro. Se o banco falhar, o
 * pedido passa (ver `lib/limite.ts`): esta rota não pode segurar lead por causa de um contador.
 */
const JANELA_S = 60;
const TETO_POR_JANELA = 5;

const texto = (v: unknown, teto: number): string | null => {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s.slice(0, teto) : null;
};

export async function POST(req: NextRequest) {
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
    const db = createAdminClient();
    // O IP pela mesma função que o log usa, que confia primeiro no cabeçalho que a Netlify põe e
    // o cliente não forja. O `x-forwarded-for` cru, que a versão anterior lia, o cliente escreve.
    const ip = (await ipDaRequisicao()) ?? "sem-ip";
    if (!(await consumirLimite(db, `consentimento:ip:${ip}`, TETO_POR_JANELA, JANELA_S))) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }
    registradas = await registrarConsentimento(db, {
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

import { NextResponse } from "next/server";

/**
 * Recebe o lead da pré-lista (`/lista-de-espera`) e o encaminha ao RD Station.
 *
 * Decisão do cliente: o envio é do RD. Das duas rotas possíveis do handoff, esta
 * é a segunda — campos nossos, envio pela API de conversões — escolhida para o
 * layout e a validação ficarem sob nosso controle. O container
 * `#rd-form-lista-de-espera` do formulário continua marcado, então trocar para o
 * embed oficial depois não remexe no layout.
 *
 * **Sem `RD_STATION_API_KEY` no ambiente, o lead não sai daqui:** a tentativa
 * fica no log da função e a resposta traz `integrado: false`. É a mesma convenção
 * do e-mail transacional (`lib/email.ts`), onde sem a chave tudo funciona menos a
 * entrega. Consequência a saber: **a página não pode ir ao ar antes da chave
 * entrar**, porque até lá o visitante recebe a confirmação e o lead existe só no
 * log.
 *
 * Três coisas a confirmar no painel do RD antes de publicar:
 * - o identificador da conversão (`RD_STATION_IDENTIFICADOR`), que é como o lead
 *   aparece no fluxo de automação;
 * - o identificador do campo customizado de "já investe fora"
 *   (`RD_STATION_CAMPO_INVESTE`), que o RD gera com prefixo `cf_` e é próprio de
 *   cada conta — o padrão abaixo é um palpite legível, não um dado verificado;
 * - se a conta usa a chave pública de API (o caso aqui) ou OAuth, que pediria
 *   `Authorization: Bearer` em vez do parâmetro na URL.
 */

const RD_CONVERSOES = "https://api.rd.services/platform/conversions";

type Lead = {
  nome: string;
  email: string;
  telefone: string;
  investeFora: string;
  aceite: boolean;
};

/** Validação do lado do servidor: o `required` do navegador é conveniência de
 *  quem preenche, não garantia de quem recebe. */
function validar(c: unknown): { lead: Lead } | { erro: string } {
  if (typeof c !== "object" || c === null) return { erro: "corpo ausente" };
  const b = c as Record<string, unknown>;
  const nome = String(b.nome ?? "").trim();
  const email = String(b.email ?? "").trim().toLowerCase();
  const telefone = String(b.telefone ?? "").trim();
  const investeFora = String(b.investeFora ?? "").trim();
  const digitos = telefone.replace(/\D/g, "");

  if (nome.length < 2) return { erro: "nome" };
  // Deliberadamente frouxo: validação estrita de e-mail rejeita endereço
  // válido, e quem confirma de verdade é o double opt-in do RD.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { erro: "email" };
  if (digitos.length < 10 || digitos.length > 11) return { erro: "telefone" };
  // Desde que a caixa de aceite saiu, o consentimento é o próprio envio. A
  // guarda continua: ela recusa um POST montado fora da nossa página, que é onde
  // o aviso de LGPD aparece.
  if (b.aceite !== true) return { erro: "aceite" };

  return { lead: { nome, email, telefone, investeFora, aceite: true } };
}

export async function POST(req: Request) {
  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "json inválido" }, { status: 400 });
  }

  const r = validar(corpo);
  if ("erro" in r) return NextResponse.json({ erro: r.erro }, { status: 400 });
  const { lead } = r;

  const chave = process.env.RD_STATION_API_KEY;
  if (!chave) {
    // Sem o telefone e o e-mail em claro: o log da função não é lugar de dado
    // pessoal. O que interessa aqui é saber que houve lead e por que não subiu.
    console.warn(
      `lista-de-espera: lead recebido e NÃO enviado (sem RD_STATION_API_KEY no ambiente) — investeFora=${lead.investeFora || "não respondido"}`,
    );
    return NextResponse.json({ ok: true, integrado: false });
  }

  const campoInveste = process.env.RD_STATION_CAMPO_INVESTE ?? "cf_investe_fora_do_brasil";
  const payload: Record<string, unknown> = {
    conversion_identifier:
      process.env.RD_STATION_IDENTIFICADOR ?? "lista-espera-estrategia-internacional",
    name: lead.nome,
    email: lead.email,
    mobile_phone: lead.telefone,
    legal_bases: [
      { category: "communications", type: "consent", status: "granted" },
    ],
  };
  if (lead.investeFora) payload[campoInveste] = lead.investeFora;

  try {
    const resp = await fetch(`${RD_CONVERSOES}?api_key=${encodeURIComponent(chave)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: "CONVERSION", event_family: "CDP", payload }),
    });
    if (!resp.ok) {
      // O corpo do erro do RD diz qual campo ele recusou, e é a única pista útil
      // quando o identificador do campo customizado está errado.
      console.error(`lista-de-espera: RD recusou (${resp.status}) — ${await resp.text()}`);
      return NextResponse.json({ erro: "integracao" }, { status: 502 });
    }
  } catch (e) {
    console.error("lista-de-espera: falha de rede ao chamar o RD —", e);
    return NextResponse.json({ erro: "integracao" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, integrado: true });
}

import { X509Certificate, type KeyObject } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { linhasDoEventoSes } from "@/lib/ses-eventos";
import {
  assinaturaSnsConfere,
  lerEnvelopeSns,
  regiaoDoArn,
  urlCertificadoConfiavel,
  urlConfirmacaoConfiavel,
  type MensagemSns,
} from "@/lib/sns";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Eventos de entrega do Amazon SES, entregues pelo Amazon SNS (docs/SES-RASTREIO.md).
 *
 * O envio leva `ConfigurationSetName`; o configuration set publica Send, Delivery, Bounce,
 * Complaint, Reject, DeliveryDelay e Rendering Failure num tópico SNS; o tópico tem uma assinatura
 * HTTPS apontando para cá. Cada evento vira linha em `email_eventos`, e a página do aluno no admin
 * mostra "entregue", "adiado" ou "devolvido" ao lado de cada e-mail.
 *
 * ┌─ QUEM PODE FALAR COM ESTA ROTA ───────────────────────────────────────────────────────────────┐
 * │ Ela é pública (o proxy deixa `/api` passar sem sessão, ver `lib/supabase/middleware.ts`).     │
 * │ Três travas, nesta ordem:                                                                     │
 * │   1. `TopicArn` igual a `SES_SNS_TOPIC_ARN`. Sem a variável, 503: fail-closed, como o Guru.   │
 * │   2. Certificado buscado só de `https://sns.<regiao do tópico>.amazonaws.com/...pem`.         │
 * │   3. Assinatura do SNS (versão 1 ou 2) conferida contra esse certificado.                     │
 * │ A confirmação da assinatura (o GET na `SubscribeURL`) só acontece depois das três, e só para │
 * │ host `sns.<regiao>.amazonaws.com`: sem isso a rota seria um disparador de GET para qualquer   │
 * │ endereço que alguém escrevesse no corpo.                                                      │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * CÓDIGOS DE RESPOSTA, e o que o SNS faz com cada um: 2xx encerra; 5xx faz o SNS tentar de novo
 * (política padrão de entrega HTTP), e é o que devolvemos quando o banco falha. Recusa de
 * autenticidade é 403 e evento ilegível é 200 com "ignorado": repetir não conserta nenhum dos dois.
 * A gravação é idempotente pelo id do envelope do SNS, então reentrega é segura.
 *
 * NUNCA LOGA O CORPO. Ele traz o endereço do aluno, o assunto e os cabeçalhos do e-mail. O log da
 * função guarda só tipo, ids e o desfecho.
 */

/** O SNS manda até 256 KB. Mais que isso não é o SNS. */
const TETO_CORPO = 300_000;
const TEMPO_MAXIMO_MS = 5_000;

/**
 * Chaves públicas dos certificados do SNS, por URL. Em memória: cada instância da função busca uma
 * vez e reusa enquanto vive. O SNS troca o certificado raramente, e uma URL nova é só uma busca nova.
 */
const certificados = new Map<string, { chave: KeyObject; validoAte: number }>();

async function chaveDoCertificado(url: string): Promise<KeyObject | null> {
  const guardado = certificados.get(url);
  if (guardado && guardado.validoAte > Date.now()) return guardado.chave;

  const resposta = await fetch(url, { signal: AbortSignal.timeout(TEMPO_MAXIMO_MS), redirect: "error" });
  if (!resposta.ok) return null;
  const pem = await resposta.text();
  try {
    const cert = new X509Certificate(pem);
    const validoAte = Date.parse(cert.validTo);
    if (!(validoAte > Date.now()) || Date.parse(cert.validFrom) > Date.now()) return null;
    const chave = cert.publicKey;
    // Teto do cache: um atacante não consegue encher o mapa, porque só URL `sns.*.amazonaws.com`
    // chega aqui, mas o teto custa uma linha.
    if (certificados.size > 20) certificados.clear();
    certificados.set(url, { chave, validoAte });
    return chave;
  } catch {
    return null;
  }
}

const recusar = (motivo: string, status: number) => {
  console.warn(`[ses-webhook] recusado (${status}): ${motivo}`);
  return NextResponse.json({ error: motivo }, { status });
};

export async function POST(req: NextRequest) {
  const topicoEsperado = process.env.SES_SNS_TOPIC_ARN?.trim() || "";
  if (!topicoEsperado) {
    console.error("[ses-webhook] SES_SNS_TOPIC_ARN ausente: entrega recusada (503).");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const tamanho = Number(req.headers.get("content-length") ?? 0);
  if (tamanho > TETO_CORPO) return recusar("corpo grande demais", 413);
  const bruto = await req.text();
  if (bruto.length > TETO_CORPO) return recusar("corpo grande demais", 413);

  // O SNS manda `Content-Type: text/plain` com JSON dentro; por isso `text()` e parse à mão.
  const m = lerEnvelopeSns(bruto);
  if (!m) return recusar("nao e um envelope do SNS", 400);

  // 1) Tópico.
  if (m.TopicArn !== topicoEsperado) return recusar("TopicArn diferente do configurado", 403);

  // 2) Certificado, da região do próprio tópico.
  const regiao = regiaoDoArn(topicoEsperado);
  if (!urlCertificadoConfiavel(m.SigningCertURL) || new URL(m.SigningCertURL!).hostname !== `sns.${regiao}.amazonaws.com`) {
    return recusar("SigningCertURL fora de sns.<regiao>.amazonaws.com", 403);
  }
  let chave: KeyObject | null;
  try {
    chave = await chaveDoCertificado(m.SigningCertURL!);
  } catch (e) {
    // Falha de rede ao buscar o certificado é transitória: 503 para o SNS tentar de novo.
    console.error("[ses-webhook] nao deu para buscar o certificado:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "certificado indisponivel" }, { status: 503 });
  }
  if (!chave) return recusar("certificado invalido", 403);

  // 3) Assinatura.
  if (!assinaturaSnsConfere(m, chave)) return recusar("assinatura do SNS nao confere", 403);

  switch (m.Type) {
    case "SubscriptionConfirmation":
      return confirmarAssinatura(m);
    case "UnsubscribeConfirmation":
      // Alguém cancelou a assinatura no console. Nada a fazer aqui; fica o rastro no log.
      console.warn(`[ses-webhook] assinatura cancelada no SNS (${m.MessageId}).`);
      return NextResponse.json({ ok: true });
    default:
      return gravarNotificacao(m);
  }
}

async function confirmarAssinatura(m: MensagemSns) {
  if (!urlConfirmacaoConfiavel(m.SubscribeURL)) return recusar("SubscribeURL fora de sns.*.amazonaws.com", 403);
  try {
    const r = await fetch(m.SubscribeURL!, { signal: AbortSignal.timeout(TEMPO_MAXIMO_MS), redirect: "error" });
    if (!r.ok) {
      console.error(`[ses-webhook] confirmacao da assinatura respondeu ${r.status}.`);
      return NextResponse.json({ error: "confirmacao recusada" }, { status: 502 });
    }
  } catch (e) {
    console.error("[ses-webhook] confirmacao da assinatura falhou:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "confirmacao falhou" }, { status: 502 });
  }
  console.log(`[ses-webhook] assinatura do topico confirmada (${m.TopicArn}).`);
  return NextResponse.json({ ok: true, confirmada: true });
}

async function gravarNotificacao(m: MensagemSns) {
  let evento: unknown;
  try {
    evento = JSON.parse(m.Message ?? "");
  } catch {
    evento = null;
  }
  const linhas = linhasDoEventoSes(evento);
  if (linhas.length === 0) {
    // Mensagem de teste do console do SNS, ou formato que não conhecemos. 200: repetir não ajuda.
    console.warn(`[ses-webhook] notificacao ignorada, sem evento do SES reconhecivel (${m.MessageId}).`);
    return NextResponse.json({ ok: true, ignorado: true });
  }

  let db: ReturnType<typeof createAdminClient>;
  try {
    db = createAdminClient();
  } catch (e) {
    console.error("[ses-webhook] sem cliente do Supabase:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const { error } = await db
    .from("email_eventos")
    .upsert(
      linhas.map((l) => ({ ...l, sns_message_id: m.MessageId ?? null })),
      { onConflict: "sns_message_id,destinatario", ignoreDuplicates: true },
    );
  if (error) {
    // 500 faz o SNS reentregar; com a tabela no lugar, a próxima tentativa grava.
    console.error(`[ses-webhook] nao gravou ${linhas[0].tipo} ${linhas[0].ses_message_id}:`, error.message);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  console.log(`[ses-webhook] ${linhas[0].tipo} ${linhas[0].ses_message_id} (${linhas.length} linha(s)).`);
  return NextResponse.json({ ok: true });
}

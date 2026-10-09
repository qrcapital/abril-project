// A parte pura do webhook do Amazon SNS: o texto canônico que a AWS assina, a verificação da
// assinatura e as duas checagens de URL (certificado e confirmação de assinatura). **Sem IO, sem
// Next, sem Supabase**, pela regra do AGENTS.md: o que precisa de check não mora no módulo que faz
// IO. Guarda em `npm run check:sns`, com um par de chaves gerado no próprio teste.
//
// ┌─ POR QUE VERIFICAR A ASSINATURA, E NÃO SÓ O TopicArn ─────────────────────────────────────────┐
// │ A rota `/api/webhooks/ses` é pública: qualquer um pode mandar um POST com o nosso TopicArn,    │
// │ que não é segredo (aparece em todo corpo que o SNS manda). Sem a assinatura, alguém poderia    │
// │ encher `email_eventos` de "entregue" falso e esconder uma devolução real na tela do aluno.     │
// │ O SNS assina cada mensagem com a chave de um certificado servido em                            │
// │ `https://sns.<regiao>.amazonaws.com/...pem`; conferir o host dessa URL é o que impede o        │
// │ atacante de apontar para um certificado dele.                                                  │
// └───────────────────────────────────────────────────────────────────────────────────────────────┘
//
// Formato de referência: "Verifying the signatures of Amazon SNS messages", no guia do SNS.
// SignatureVersion 1 usa SHA1withRSA; a 2 usa SHA256withRSA. As duas assinam o MESMO texto.

import { createVerify, type KeyObject } from "node:crypto";

/** O envelope JSON que o SNS manda no corpo do POST (entrega HTTPS, sem raw delivery). */
export type MensagemSns = {
  Type?: string;
  MessageId?: string;
  Token?: string;
  TopicArn?: string;
  Subject?: string | null;
  Message?: string;
  SubscribeURL?: string;
  UnsubscribeURL?: string;
  Timestamp?: string;
  SignatureVersion?: string;
  Signature?: string;
  SigningCertURL?: string;
};

/** Os três tipos que o SNS entrega numa assinatura HTTPS. */
export const TIPOS_SNS = ["Notification", "SubscriptionConfirmation", "UnsubscribeConfirmation"] as const;

/**
 * Lê o corpo cru como envelope do SNS. Devolve `null` para o que não é um objeto JSON com `Type`
 * de um dos três tipos: a rota responde 400 sem tentar mais nada.
 */
export function lerEnvelopeSns(bruto: string): MensagemSns | null {
  let dado: unknown;
  try {
    dado = JSON.parse(bruto);
  } catch {
    return null;
  }
  if (!dado || typeof dado !== "object" || Array.isArray(dado)) return null;
  const m = dado as MensagemSns;
  if (typeof m.Type !== "string" || !(TIPOS_SNS as readonly string[]).includes(m.Type)) return null;
  return m;
}

/**
 * O texto que o SNS assinou: pares "Chave\nValor\n" numa ordem fixa, que depende do tipo.
 *
 * Notification: Message, MessageId, Subject (só se existir), Timestamp, TopicArn, Type.
 * As de assinatura: Message, MessageId, SubscribeURL, Timestamp, Token, TopicArn, Type.
 *
 * Devolve `null` quando falta campo obrigatório: assinatura sobre texto incompleto não prova nada.
 */
export function textoCanonicoSns(m: MensagemSns): string | null {
  const chaves =
    m.Type === "Notification"
      ? ["Message", "MessageId", ...(m.Subject != null ? ["Subject"] : []), "Timestamp", "TopicArn", "Type"]
      : m.Type === "SubscriptionConfirmation" || m.Type === "UnsubscribeConfirmation"
        ? ["Message", "MessageId", "SubscribeURL", "Timestamp", "Token", "TopicArn", "Type"]
        : null;
  if (!chaves) return null;

  let texto = "";
  for (const chave of chaves) {
    const valor = (m as Record<string, unknown>)[chave];
    if (typeof valor !== "string") return null;
    texto += `${chave}\n${valor}\n`;
  }
  return texto;
}

/** O algoritmo de cada `SignatureVersion`. Qualquer outra versão é recusada. */
const ALGORITMO: Record<string, string> = { "1": "RSA-SHA1", "2": "RSA-SHA256" };

/**
 * Confere a assinatura da mensagem contra a chave pública do certificado do SNS.
 *
 * `chave` é a chave pública já extraída (o `X509Certificate(pem).publicKey` da rota) ou um PEM de
 * chave pública. Recebe a chave, e não o certificado, para o check poder montar um vetor com um par
 * gerado na hora, sem depender de OpenSSL para fabricar certificado. Nunca lança: entrada estranha
 * é `false`.
 */
export function assinaturaSnsConfere(m: MensagemSns, chave: KeyObject | string): boolean {
  const algoritmo = ALGORITMO[m.SignatureVersion ?? ""];
  if (!algoritmo || typeof m.Signature !== "string" || !m.Signature) return false;
  const texto = textoCanonicoSns(m);
  if (texto === null) return false;
  try {
    return createVerify(algoritmo).update(texto, "utf8").verify(chave, m.Signature, "base64");
  } catch {
    return false;
  }
}

/**
 * A URL do certificado só vale se for HTTPS, num host `sns.<regiao>.amazonaws.com`, sem porta e
 * terminando em `.pem`. Sufixo `.amazonaws.com` sozinho não basta: um bucket do S3 também mora em
 * `*.amazonaws.com`, e qualquer um cria bucket e põe um certificado lá.
 */
export function urlCertificadoConfiavel(url: unknown): boolean {
  const u = urlHttpsSns(url);
  return u !== null && u.pathname.endsWith(".pem");
}

/**
 * A `SubscribeURL` da confirmação: HTTPS num host `sns.<regiao>.amazonaws.com`. A rota faz um GET
 * nela, então aceitar qualquer host transformaria o webhook num disparador de requisições para onde
 * o remetente quisesse.
 */
export function urlConfirmacaoConfiavel(url: unknown): boolean {
  return urlHttpsSns(url) !== null;
}

function urlHttpsSns(url: unknown): URL | null {
  if (typeof url !== "string") return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || u.port !== "" || u.username || u.password) return null;
  return /^sns\.[a-z0-9-]+\.amazonaws\.com$/.test(u.hostname) ? u : null;
}

/** A região de um ARN (`arn:aws:sns:us-east-1:123:topico` vira `us-east-1`). */
export const regiaoDoArn = (arn: string) => arn.split(":")[3] ?? "";

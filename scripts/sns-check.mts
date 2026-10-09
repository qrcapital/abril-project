// Self-check do webhook do SES via SNS: `npm run check:sns`.
//
// Roda offline, sem rede e sem credencial. A AWS não publica um vetor de teste para a assinatura do
// SNS, então o vetor é montado aqui: um par RSA gerado na hora assina o texto canônico exatamente
// como o SNS faz (SHA1 na versão 1, SHA256 na 2), e a verificação de `lib/sns.ts` tem de aceitar a
// mensagem íntegra e recusar qualquer campo trocado. Se o texto canônico estiver na ordem errada,
// TODA notificação real cai em 403 e o SNS desiste depois das tentativas, sem erro visível do
// nosso lado: é por isso que este check existe.
//
// Cobre também a leitura do evento do SES (`lib/ses-eventos.ts`) e o rótulo do admin.

import assert from "node:assert/strict";
import { createSign, generateKeyPairSync } from "node:crypto";

import {
  assinaturaSnsConfere,
  lerEnvelopeSns,
  regiaoDoArn,
  textoCanonicoSns,
  urlCertificadoConfiavel,
  urlConfirmacaoConfiavel,
  type MensagemSns,
} from "../lib/sns.ts";
import { horaCurta, linhasDoEventoSes, situacaoEntrega, TETO_DETALHE } from "../lib/ses-eventos.ts";

const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const { publicKey: outraChave } = generateKeyPairSync("rsa", { modulusLength: 2048 });

const TOPICO = "arn:aws:sns:us-east-1:123456789012:ses-eventos";

/** Assina como o SNS: o texto canônico, com o algoritmo da versão. */
function assinar(m: MensagemSns, versao: "1" | "2"): MensagemSns {
  const comVersao = { ...m, SignatureVersion: versao };
  const texto = textoCanonicoSns(comVersao);
  assert.ok(texto, "o vetor tem de ter todos os campos obrigatorios");
  const Signature = createSign(versao === "1" ? "RSA-SHA1" : "RSA-SHA256")
    .update(texto, "utf8")
    .sign(privateKey, "base64");
  return { ...comVersao, Signature };
}

const notificacao: MensagemSns = {
  Type: "Notification",
  MessageId: "22b80b92-fdea-4c2c-8f9d-bdfb0c7bf324",
  TopicArn: TOPICO,
  Message: JSON.stringify({ eventType: "Delivery", mail: { messageId: "0100abc" } }),
  Timestamp: "2026-10-09T16:12:00.000Z",
  SigningCertURL: "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-abc.pem",
};

// --- 1. o texto canônico, na ordem do guia do SNS ---
{
  assert.equal(
    textoCanonicoSns({ ...notificacao, Subject: "Assunto" }),
    `Message\n${notificacao.Message}\nMessageId\n${notificacao.MessageId}\nSubject\nAssunto\n` +
      `Timestamp\n${notificacao.Timestamp}\nTopicArn\n${TOPICO}\nType\nNotification\n`,
    "Notification com Subject: ordem alfabetica, Subject entre MessageId e Timestamp",
  );
  assert.ok(!textoCanonicoSns(notificacao)!.includes("Subject"), "sem Subject, a chave nao entra");
  assert.ok(!textoCanonicoSns({ ...notificacao, Subject: null })!.includes("Subject"), "Subject nulo tambem nao");

  const confirmacao: MensagemSns = {
    Type: "SubscriptionConfirmation",
    MessageId: "m",
    Token: "tok",
    TopicArn: TOPICO,
    Message: "You have chosen to subscribe",
    SubscribeURL: "https://sns.us-east-1.amazonaws.com/?Action=ConfirmSubscription&Token=tok",
    Timestamp: "2026-10-09T16:12:00.000Z",
  };
  assert.equal(
    textoCanonicoSns(confirmacao),
    `Message\nYou have chosen to subscribe\nMessageId\nm\nSubscribeURL\n${confirmacao.SubscribeURL}\n` +
      `Timestamp\n2026-10-09T16:12:00.000Z\nToken\ntok\nTopicArn\n${TOPICO}\nType\nSubscriptionConfirmation\n`,
  );
  assert.equal(textoCanonicoSns({ ...confirmacao, Token: undefined }), null, "campo faltando nao assina");
  assert.equal(textoCanonicoSns({ ...notificacao, Type: "Outro" }), null);

  // A confirmação assinada também confere.
  assert.ok(assinaturaSnsConfere(assinar(confirmacao, "1"), publicKey));
}

// --- 2. a assinatura, nas duas versões ---
for (const versao of ["1", "2"] as const) {
  const assinada = assinar(notificacao, versao);
  assert.ok(assinaturaSnsConfere(assinada, publicKey), `versao ${versao}: mensagem integra confere`);
  assert.ok(
    assinaturaSnsConfere(assinada, publicKey.export({ type: "spki", format: "pem" }) as string),
    `versao ${versao}: chave em PEM tambem serve`,
  );
  assert.ok(!assinaturaSnsConfere(assinada, outraChave), `versao ${versao}: outra chave nao confere`);
  for (const campo of ["Message", "MessageId", "Timestamp", "TopicArn"] as const) {
    assert.ok(
      !assinaturaSnsConfere({ ...assinada, [campo]: `${assinada[campo]}x` }, publicKey),
      `versao ${versao}: ${campo} adulterado tem de ser recusado`,
    );
  }
  assert.ok(
    !assinaturaSnsConfere({ ...assinada, Subject: "injetado" }, publicKey),
    "Subject acrescentado depois da assinatura muda o texto",
  );
}
{
  const v1 = assinar(notificacao, "1");
  assert.ok(!assinaturaSnsConfere({ ...v1, SignatureVersion: "2" }, publicKey), "versao trocada nao confere");
  assert.ok(!assinaturaSnsConfere({ ...v1, SignatureVersion: "3" }, publicKey), "versao desconhecida e recusada");
  assert.ok(!assinaturaSnsConfere({ ...v1, Signature: "" }, publicKey));
  assert.ok(!assinaturaSnsConfere({ ...v1, Signature: "nao-e-base64!!" }, publicKey), "lixo nao lanca");
  assert.ok(!assinaturaSnsConfere(v1, "nao e uma chave"), "chave invalida nao lanca");
}

// --- 3. as URLs que a rota aceita buscar ---
{
  assert.ok(urlCertificadoConfiavel("https://sns.us-east-1.amazonaws.com/SimpleNotificationService-x.pem"));
  assert.ok(urlCertificadoConfiavel("https://sns.sa-east-1.amazonaws.com/a/b.pem"));
  for (const ruim of [
    "http://sns.us-east-1.amazonaws.com/x.pem", // sem TLS
    "https://sns.us-east-1.amazonaws.com/x.txt", // não é .pem
    "https://meu-bucket.s3.amazonaws.com/x.pem", // S3 também é *.amazonaws.com
    "https://sns.us-east-1.amazonaws.com.atacante.com/x.pem",
    "https://atacante.com/sns.us-east-1.amazonaws.com/x.pem",
    "https://sns.us-east-1.amazonaws.com:8443/x.pem",
    "https://user@sns.us-east-1.amazonaws.com/x.pem",
    "https://evil.sns.us-east-1.amazonaws.com/x.pem",
    "nao e url",
    undefined,
  ]) {
    assert.ok(!urlCertificadoConfiavel(ruim), `certificado: ${String(ruim)} tem de ser recusado`);
  }
  assert.ok(urlConfirmacaoConfiavel("https://sns.us-east-1.amazonaws.com/?Action=ConfirmSubscription&Token=t"));
  assert.ok(!urlConfirmacaoConfiavel("https://169.254.169.254/latest/meta-data/"), "nada de SSRF");
  assert.ok(!urlConfirmacaoConfiavel("https://exemplo.com/?x=sns.us-east-1.amazonaws.com"));
  assert.equal(regiaoDoArn(TOPICO), "us-east-1");
}

// --- 4. o envelope ---
{
  assert.equal(lerEnvelopeSns("nao json"), null);
  assert.equal(lerEnvelopeSns("[]"), null);
  assert.equal(lerEnvelopeSns(JSON.stringify({ Type: "Outro" })), null);
  assert.equal(lerEnvelopeSns(JSON.stringify(notificacao))?.MessageId, notificacao.MessageId);
}

// --- 5. a leitura do evento do SES ---
const mail = {
  timestamp: "2026-10-09T16:10:00.000Z",
  messageId: "0100019abc-def",
  destination: ["Aluna@Outlook.com"],
};
{
  const entregue = linhasDoEventoSes({
    eventType: "Delivery",
    mail,
    delivery: {
      timestamp: "2026-10-09T16:12:03.000Z",
      recipients: ["aluna@outlook.com"],
      smtpResponse: "250 2.6.0 <x@y> Queued mail for delivery",
      reportingMTA: "a8-1.smtp-out.amazonses.com",
    },
  });
  assert.equal(entregue.length, 1);
  assert.deepEqual(entregue[0], {
    ses_message_id: "0100019abc-def",
    tipo: "Delivery",
    destinatario: "aluna@outlook.com",
    detalhe: "250 2.6.0 <x@y> Queued mail for delivery; a8-1.smtp-out.amazonses.com",
    ocorrido_em: "2026-10-09T16:12:03.000Z",
  });

  const adiado = linhasDoEventoSes({
    eventType: "DeliveryDelay",
    mail,
    deliveryDelay: {
      timestamp: "2026-10-09T16:40:00.000Z",
      delayType: "SpamDetected",
      expirationTime: "2026-10-10T16:10:00.000Z",
      delayedRecipients: [
        {
          emailAddress: "aluna@outlook.com",
          status: "4.7.650",
          diagnosticCode: "smtp; 451 4.7.650 The mail server [1.2.3.4] has been\n temporarily rate limited due to IP reputation.",
        },
      ],
    },
  });
  assert.equal(adiado[0].tipo, "DeliveryDelay");
  assert.ok(adiado[0].detalhe!.startsWith("SpamDetected; 4.7.650; smtp; 451 4.7.650 The mail server"));
  assert.ok(!adiado[0].detalhe!.includes("\n"), "quebra de linha do diagnostico vira espaco");
  assert.ok(adiado[0].detalhe!.endsWith("desiste em 2026-10-10T16:10:00.000Z"));

  const devolvido = linhasDoEventoSes({
    eventType: "Bounce",
    mail,
    bounce: {
      bounceType: "Permanent",
      bounceSubType: "General",
      timestamp: "2026-10-09T16:12:00.000Z",
      bouncedRecipients: [{ emailAddress: "a@x.com", diagnosticCode: "x".repeat(900) }, { emailAddress: "b@x.com" }],
    },
  });
  assert.equal(devolvido.length, 2, "uma linha por destinatario devolvido");
  assert.equal(devolvido[0].detalhe!.length, TETO_DETALHE, "detalhe respeita o teto");
  assert.equal(devolvido[1].detalhe, "Permanent/General");

  // Send não traz lista: cai no destino do envio, e a data é a do envio.
  const envio = linhasDoEventoSes({ eventType: "Send", mail, send: {} });
  assert.deepEqual(envio, [
    {
      ses_message_id: mail.messageId,
      tipo: "Send",
      destinatario: "aluna@outlook.com",
      detalhe: null,
      ocorrido_em: mail.timestamp,
    },
  ]);

  // Notificação por identidade (`notificationType`) tem o mesmo miolo.
  assert.equal(linhasDoEventoSes({ notificationType: "Complaint", mail, complaint: {} })[0].tipo, "Complaint");
  assert.equal(
    linhasDoEventoSes({ eventType: "Reject", mail, reject: { reason: "Bad content" } })[0].detalhe,
    "Bad content",
  );
  assert.equal(
    linhasDoEventoSes({ eventType: "Rendering Failure", mail, failure: { errorMessage: "faltou var" } })[0].tipo,
    "Rendering Failure",
  );

  assert.deepEqual(linhasDoEventoSes(null), []);
  assert.deepEqual(linhasDoEventoSes({ eventType: "Delivery" }), [], "sem mail.messageId nao grava");
  assert.deepEqual(linhasDoEventoSes({ mail }), [], "sem tipo nao grava");
}

// --- 6. o rótulo do admin ---
{
  assert.equal(horaCurta("2026-10-09T16:12:03.000Z"), "09/10 13:12", "horario de Brasilia, nao UTC");
  assert.equal(horaCurta(null), "");

  assert.deepEqual(situacaoEntrega([], false), { rotulo: "sem rastreio", tom: "neutro", detalhe: null });
  assert.equal(situacaoEntrega([], true).rotulo, "sem retorno do SES ainda");

  const send = { tipo: "Send", detalhe: null, ocorrido_em: "2026-10-09T16:10:00.000Z" };
  const atraso = { tipo: "DeliveryDelay", detalhe: "SpamDetected; 4.7.650", ocorrido_em: "2026-10-09T16:40:00.000Z" };
  const entrega = { tipo: "Delivery", detalhe: "250 ok", ocorrido_em: "2026-10-09T18:12:00.000Z" };

  assert.equal(situacaoEntrega([send], true).rotulo, "aceito pelo SES, sem retorno do destinatário");
  const s = situacaoEntrega([send, atraso], true);
  assert.equal(s.rotulo, "adiado: filtro de spam do destinatário");
  assert.equal(s.tom, "atencao");
  assert.equal(s.detalhe, "SpamDetected; 4.7.650", "o detalhe tecnico vai inteiro para o title");
  assert.deepEqual(situacaoEntrega([send, atraso, entrega], true), {
    rotulo: "entregue 09/10 15:12",
    tom: "ok",
    detalhe: "250 ok",
  });
  const bounce = { tipo: "Bounce", detalhe: "Permanent/General; 5.1.1", ocorrido_em: "2026-10-09T17:00:00.000Z" };
  assert.equal(situacaoEntrega([send, atraso, bounce], true).rotulo, "devolvido: permanente");
  assert.equal(situacaoEntrega([entrega, { tipo: "Complaint", detalhe: "abuse", ocorrido_em: null }], true).tom, "ruim");
  assert.equal(
    situacaoEntrega([{ tipo: "DeliveryDelay", detalhe: "CodigoNovo", ocorrido_em: null }], true).rotulo,
    "adiado: CodigoNovo",
    "codigo desconhecido aparece cru, nao some",
  );
  // Dois atrasos: vale o mais recente.
  const atraso2 = { tipo: "DeliveryDelay", detalhe: "MailboxFull", ocorrido_em: "2026-10-09T20:00:00.000Z" };
  assert.equal(situacaoEntrega([atraso, atraso2], true).rotulo, "adiado: caixa cheia");

  // Regra da casa: sem travessão no texto de UI.
  for (const e of [send, atraso, entrega, bounce]) {
    assert.ok(!/[—–]/.test(situacaoEntrega([e], true).rotulo), "rotulo sem travessao");
  }
}

console.log("sns-check: ok");

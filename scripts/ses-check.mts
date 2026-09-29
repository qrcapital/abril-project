// Self-check da assinatura SigV4 e do corpo do SES: `npm run check:ses`.
//
// Roda offline, sem credencial e sem rede. A assinatura é o código que mais erra em silêncio neste
// projeto: um detalhe fora do lugar (a ordem dos cabeçalhos, um espaço, a codificação de um `*`)
// e a AWS responde 403 "SignatureDoesNotMatch" no primeiro e-mail de boas-vindas de verdade, sem
// dizer qual detalhe. Os vetores abaixo são os publicados pela AWS na documentação da SigV4 e na
// suíte de testes dela, com a credencial de exemplo (`AKIDEXAMPLE`), então bater com eles é bater
// com a implementação de referência.

import assert from "node:assert/strict";

import {
  assinarSigV4,
  carimboAmz,
  chaveDeAssinatura,
  corpoSesV2,
  endpointSes,
  enderecoMime,
} from "../lib/ses.ts";

const SEGREDO = "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY";
const CHAVE_ID = "AKIDEXAMPLE";
const QUANDO = new Date("2015-08-30T12:36:00Z");

const assinatura = (auth: string) => auth.match(/Signature=([0-9a-f]{64})$/)?.[1];

// --- 1. a derivação da chave, o exemplo da página "Derive a signing key" ---
{
  const k = chaveDeAssinatura(SEGREDO, "20120215", "us-east-1", "iam").toString("hex");
  assert.equal(
    k,
    "f4780e2d9f65fa895f9c67b32ce1baf0b0d8a43505a000a1a9e090d414db404d",
    "a cadeia de HMACs da chave do dia diverge da AWS",
  );
}

// --- 2. o carimbo de data ---
assert.equal(carimboAmz(QUANDO), "20150830T123600Z");

// --- 3. suíte oficial: get-vanilla ---
{
  const h = assinarSigV4({
    metodo: "GET",
    url: "https://example.amazonaws.com/",
    regiao: "us-east-1",
    servico: "service",
    chaveId: CHAVE_ID,
    segredo: SEGREDO,
    quando: QUANDO,
  });
  assert.equal(h["X-Amz-Date"], "20150830T123600Z");
  assert.equal(
    h.Authorization,
    "AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request, " +
      "SignedHeaders=host;x-amz-date, " +
      "Signature=5fa00fa31553b73ebf1942676e86291e8372ff2a2260956d9b8aae1d763fbf31",
    "get-vanilla: o Authorization inteiro tem que bater, nao so a assinatura",
  );
}

// --- 4. suíte oficial: post-vanilla ---
{
  const h = assinarSigV4({
    metodo: "POST",
    url: "https://example.amazonaws.com/",
    regiao: "us-east-1",
    servico: "service",
    chaveId: CHAVE_ID,
    segredo: SEGREDO,
    quando: QUANDO,
  });
  assert.equal(
    assinatura(h.Authorization),
    "5da7c1a2acd57cee7505fc6676e4e544621c30862966e37dddb68e92efbe5d6b",
    "post-vanilla diverge",
  );
}

// --- 5. o exemplo da documentação: IAM ListUsers, com query e content-type assinado ---
{
  const h = assinarSigV4({
    metodo: "GET",
    // Fora de ordem de propósito: a query canônica tem de sair ordenada.
    url: "https://iam.amazonaws.com/?Version=2010-05-08&Action=ListUsers",
    cabecalhos: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    regiao: "us-east-1",
    servico: "iam",
    chaveId: CHAVE_ID,
    segredo: SEGREDO,
    quando: QUANDO,
  });
  assert.ok(h.Authorization.includes("SignedHeaders=content-type;host;x-amz-date,"));
  assert.equal(
    assinatura(h.Authorization),
    "5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7",
    "IAM ListUsers diverge: query canonica ou cabecalho assinado fora do padrao",
  );
}

// --- 6. o pedido real que o envio monta ---
{
  const corpo = JSON.stringify({ a: 1 });
  const h = assinarSigV4({
    metodo: "POST",
    url: endpointSes("sa-east-1"),
    cabecalhos: { "Content-Type": "application/json" },
    corpo,
    regiao: "sa-east-1",
    servico: "ses",
    chaveId: CHAVE_ID,
    segredo: SEGREDO,
    quando: QUANDO,
  });
  assert.equal(endpointSes("sa-east-1"), "https://email.sa-east-1.amazonaws.com/v2/email/outbound-emails");
  assert.ok(
    h.Authorization.startsWith("AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/sa-east-1/ses/aws4_request,"),
    "o SES v2 assina com o nome de servico 'ses', nao 'email'",
  );
  assert.ok(!("host" in h) && !("Host" in h), "Host sai do fetch, nao daqui: o undici recusa escreve-lo");
  assert.equal(h["Content-Type"], "application/json", "os cabecalhos de entrada voltam intactos");

  // Corpo diferente, assinatura diferente: o hash do corpo está mesmo no pedido canônico.
  const outro = assinarSigV4({
    metodo: "POST",
    url: endpointSes("sa-east-1"),
    cabecalhos: { "Content-Type": "application/json" },
    corpo: JSON.stringify({ a: 2 }),
    regiao: "sa-east-1",
    servico: "ses",
    chaveId: CHAVE_ID,
    segredo: SEGREDO,
    quando: QUANDO,
  });
  assert.notEqual(assinatura(h.Authorization), assinatura(outro.Authorization));

  const comToken = assinarSigV4({
    metodo: "POST",
    url: endpointSes("sa-east-1"),
    corpo,
    regiao: "sa-east-1",
    servico: "ses",
    chaveId: CHAVE_ID,
    segredo: SEGREDO,
    tokenSessao: "TOKEN",
    quando: QUANDO,
  });
  assert.equal(comToken["X-Amz-Security-Token"], "TOKEN");
  assert.ok(comToken.Authorization.includes("x-amz-security-token"), "o token tambem e assinado");
}

// --- 7. o remetente com acento ---
{
  // O SES recusa nome com acento sem RFC 2047, e "Estratégia" tem acento.
  const r = enderecoMime("Estratégia Internacional <acesso@blocktrends.com.br>");
  assert.match(r, /^=\?UTF-8\?B\?[A-Za-z0-9+/=]+\?= <acesso@blocktrends\.com\.br>$/);
  const nome = Buffer.from(r.slice(10, r.indexOf("?=")), "base64").toString("utf8");
  assert.equal(nome, "Estratégia Internacional", "o nome decodificado tem de ser o original");

  assert.equal(enderecoMime("Equipe EI <a@b.com>"), '"Equipe EI" <a@b.com>');
  assert.equal(enderecoMime("a@b.com"), "a@b.com", "endereco puro passa direto");
  assert.equal(enderecoMime("<a@b.com>"), "a@b.com");
}

// --- 8. o corpo do SendEmail ---
{
  const c = corpoSesV2({
    de: "Estratégia Internacional <acesso@blocktrends.com.br>",
    para: "ana@exemplo.com",
    responderPara: "contato@blocktrends.com.br",
    assunto: "Assunto",
    html: "<p>oi</p>",
    texto: "oi",
    configuracao: null,
  });
  assert.deepEqual(c.Destination, { ToAddresses: ["ana@exemplo.com"] });
  assert.deepEqual(c.ReplyToAddresses, ["contato@blocktrends.com.br"]);
  assert.equal(c.Content.Simple.Body.Html.Charset, "UTF-8", "sem charset o acento chega quebrado");
  assert.ok(!("ConfigurationSetName" in c), "configuration set vazio nao vai no corpo");
  assert.ok(c.FromEmailAddress.startsWith("=?UTF-8?B?"));
}

console.log("ses-check: ok");

// A parte pura do envio pelo Amazon SES: assinatura SigV4, cabeçalho de remetente e corpo da
// chamada. **Sem IO, sem Next, sem Supabase.** Mora separada de `lib/email.ts` pela regra do
// AGENTS.md: o que precisa de check não pode morar no módulo que faz IO, e a assinatura é
// exatamente o tipo de código que erra em silêncio (a AWS responde 403 e mais nada). Guarda em
// `npm run check:ses`, contra os vetores publicados pela própria AWS.
//
// ┌─ POR QUE ASSINATURA À MÃO, E NÃO O SDK DA AWS ───────────────────────────────────────────────┐
// │ O SDK v3 do SES puxa dezenas de pacotes para fazer UMA chamada HTTP, e cada um deles entra no │
// │ bundle da função da Netlify e na superfície de dependência. A SigV4 é um algoritmo fechado e  │
// │ documentado, de umas 60 linhas com `node:crypto`, e os vetores de teste da AWS dizem se ela   │
// │ está certa sem precisar de rede nem de credencial.                                           │
// └───────────────────────────────────────────────────────────────────────────────────────────────┘

import { createHash, createHmac } from "node:crypto";

const sha256hex = (dado: string | Buffer) => createHash("sha256").update(dado).digest("hex");
const hmac = (chave: string | Buffer, dado: string) => createHmac("sha256", chave).update(dado).digest();

/** RFC 3986: o `encodeURIComponent` deixa `!'()*` passar, e a AWS exige os cinco codificados. */
const codificar = (s: string) =>
  encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

/** `20150830T123600Z`: ISO sem separadores e sem milissegundos, que é o formato da SigV4. */
export const carimboAmz = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** A chave de assinatura do dia: quatro HMACs encadeados a partir do segredo. */
export function chaveDeAssinatura(segredo: string, dia: string, regiao: string, servico: string): Buffer {
  const kData = hmac(`AWS4${segredo}`, dia);
  const kRegiao = hmac(kData, regiao);
  const kServico = hmac(kRegiao, servico);
  return hmac(kServico, "aws4_request");
}

export type PedidoAssinavel = {
  metodo: string;
  url: string;
  /** Cabeçalhos que entram na assinatura, além de `host` e `x-amz-date`, que são postos aqui. */
  cabecalhos?: Record<string, string>;
  corpo?: string;
  regiao: string;
  servico: string;
  chaveId: string;
  segredo: string;
  /** Só para credencial temporária (STS). Usuário IAM comum não tem. */
  tokenSessao?: string;
  /** Relógio injetável: é o que deixa o check reproduzir o vetor da AWS. */
  quando?: Date;
};

/**
 * Assina o pedido e devolve os cabeçalhos a mandar: os de entrada, mais `X-Amz-Date` e
 * `Authorization` (e `X-Amz-Security-Token` quando há token de sessão).
 *
 * `host` entra na assinatura e NÃO no retorno: o `fetch` do Node põe o `Host` sozinho e recusa
 * quem tenta escrevê-lo. Como ele sai da mesma URL, o valor assinado e o enviado coincidem.
 */
export function assinarSigV4(p: PedidoAssinavel): Record<string, string> {
  const url = new URL(p.url);
  const amzData = carimboAmz(p.quando ?? new Date());
  const dia = amzData.slice(0, 8);

  const cabecalhos: Record<string, string> = { ...(p.cabecalhos ?? {}), "X-Amz-Date": amzData };
  if (p.tokenSessao) cabecalhos["X-Amz-Security-Token"] = p.tokenSessao;

  // Nome em minúsculas, valor aparado e com espaço interno colapsado, ordem alfabética.
  const assinados = new Map<string, string>([["host", url.host]]);
  for (const [nome, valor] of Object.entries(cabecalhos)) {
    assinados.set(nome.toLowerCase(), valor.trim().replace(/\s+/g, " "));
  }
  const nomes = [...assinados.keys()].sort();
  const cabecalhosCanonicos = nomes.map((n) => `${n}:${assinados.get(n)}\n`).join("");
  const listaAssinada = nomes.join(";");

  // Caminho: cada segmento codificado, a barra preservada. Vazio vira `/`.
  const caminho =
    url.pathname
      .split("/")
      .map((seg) => codificar(decodeURIComponent(seg)))
      .join("/") || "/";

  // Query: pares codificados e ordenados por chave, e por valor no empate.
  const query = [...url.searchParams.entries()]
    .map(([k, v]) => [codificar(k), codificar(v)] as const)
    .sort(([ka, va], [kb, vb]) => (ka < kb ? -1 : ka > kb ? 1 : va < vb ? -1 : va > vb ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const pedidoCanonico = [
    p.metodo.toUpperCase(),
    caminho,
    query,
    cabecalhosCanonicos,
    listaAssinada,
    sha256hex(p.corpo ?? ""),
  ].join("\n");

  const escopo = `${dia}/${p.regiao}/${p.servico}/aws4_request`;
  const textoAAssinar = ["AWS4-HMAC-SHA256", amzData, escopo, sha256hex(pedidoCanonico)].join("\n");
  const assinatura = createHmac("sha256", chaveDeAssinatura(p.segredo, dia, p.regiao, p.servico))
    .update(textoAAssinar)
    .digest("hex");

  cabecalhos.Authorization =
    `AWS4-HMAC-SHA256 Credential=${p.chaveId}/${escopo}, ` +
    `SignedHeaders=${listaAssinada}, Signature=${assinatura}`;
  return cabecalhos;
}

/**
 * `Nome <endereco>` pronto para cabeçalho de e-mail.
 *
 * O SES recusa nome de exibição com caractere fora do ASCII sem a codificação da RFC 2047, e o
 * nosso tem acento ("Estratégia"). Sem isto, o primeiro envio real volta 400 com uma mensagem que
 * não menciona o acento. Nome só ASCII passa entre aspas, que é o que protege vírgula e parêntese.
 */
export function enderecoMime(bruto: string): string {
  const m = bruto.trim().match(/^(.*?)\s*<([^<>\s]+@[^<>\s]+)>$/);
  if (!m) return bruto.trim();
  const nome = m[1].trim().replace(/^"(.*)"$/, "$1");
  const endereco = m[2];
  if (!nome) return endereco;
  if (/^[\x20-\x7e]*$/.test(nome)) return `"${nome.replace(/(["\\])/g, "\\$1")}" <${endereco}>`;
  return `=?UTF-8?B?${Buffer.from(nome, "utf8").toString("base64")}?= <${endereco}>`;
}

/** O corpo JSON do `SendEmail` da API v2 do SES, no formato "Simple" (assunto, HTML e texto). */
export function corpoSesV2(m: {
  de: string;
  para: string;
  responderPara?: string | null;
  assunto: string;
  html: string;
  texto: string;
  configuracao?: string | null;
}) {
  const conteudo = (Data: string) => ({ Data, Charset: "UTF-8" });
  return {
    FromEmailAddress: enderecoMime(m.de),
    Destination: { ToAddresses: [m.para] },
    ...(m.responderPara ? { ReplyToAddresses: [m.responderPara] } : {}),
    Content: {
      Simple: {
        Subject: conteudo(m.assunto),
        Body: { Html: conteudo(m.html), Text: conteudo(m.texto) },
      },
    },
    ...(m.configuracao ? { ConfigurationSetName: m.configuracao } : {}),
  };
}

/** O endereço da API v2 do SES na região. */
export const endpointSes = (regiao: string) =>
  `https://email.${regiao}.amazonaws.com/v2/email/outbound-emails`;

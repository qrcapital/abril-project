// Self-check da leitura do webhook do Guru: `npm run check:guru`.
//
// O webhook é a única porta do produto que CONCEDE ACESSO sem ninguém logado, e o que decide é
// esta leitura. Os casos abaixo são os que doem: status que parece aprovação e não é, evento de
// outro tipo na mesma URL, token com tamanho errado, e o token da conta indo parar no banco.

import assert from "node:assert/strict";

import {
  listaDeProdutos,
  normalizarGuru,
  produtoPermitido,
  semToken,
  tokenConfere,
} from "../lib/guru.ts";

/** O formato documentado de uma transação, com o mínimo que a rota usa. */
const transacao = (extra: Record<string, unknown> = {}) => ({
  api_token: "TOKEN-DA-CONTA",
  webhook_type: "transaction",
  id: "9a1b-transacao",
  status: "approved",
  contact: {
    id: "c-1",
    name: "Ana Souza",
    email: "Ana@Exemplo.com ",
    phone_local_code: "11",
    phone_number: "98765-4321",
    doc: "00000000000",
  },
  product: { id: "p-1", marketplace_id: "mk-9", offer: { id: "of-3" }, name: "Estratégia Internacional" },
  ...extra,
});

// --- 1. o token ---
{
  assert.ok(tokenConfere("abc", "abc"));
  assert.ok(!tokenConfere("abd", "abc"));
  assert.ok(!tokenConfere("abcd", "abc"), "tamanho diferente recusa sem lancar");
  assert.ok(!tokenConfere("", "abc"));
  assert.ok(!tokenConfere(undefined, "abc"));
  assert.ok(!tokenConfere(123, "123"), "so string");
  assert.ok(!tokenConfere("abc", ""), "esperado vazio nunca confere");
}

// --- 2. aprovação no formato documentado ---
{
  const e = normalizarGuru(transacao());
  assert.equal(e.acao, "aprovado");
  assert.equal(e.transacaoId, "9a1b-transacao");
  assert.equal(e.email, "ana@exemplo.com", "e-mail aparado e minusculo");
  assert.equal(e.nome, "Ana Souza");
  assert.equal(e.telefone, "11987654321", "DDD + numero, so digitos");
  assert.equal(e.contatoId, "c-1");
  assert.deepEqual(e.produtos, ["p-1", "mk-9", "of-3"]);
  assert.equal(normalizarGuru(transacao({ status: "completed" })).acao, "aprovado");
  assert.equal(normalizarGuru(transacao({ status: "APPROVED" })).acao, "aprovado");
}

// --- 3. revogação ---
{
  assert.equal(normalizarGuru(transacao({ status: "refunded" })).acao, "reembolso");
  assert.equal(normalizarGuru(transacao({ status: "chargeback" })).acao, "chargeback");
}

// --- 4. o que NÃO concede acesso ---
{
  for (const status of ["waiting_payment", "canceled", "dispute", "unpaid", "paid", "approved_x", "", "expired"]) {
    assert.equal(
      normalizarGuru(transacao({ status })).acao,
      "ignorar",
      `status "${status}" nao pode virar matricula: a lista e exata, nao expressao regular`,
    );
  }
  assert.equal(
    normalizarGuru(transacao({ webhook_type: "subscription" })).acao,
    "ignorar",
    "assinatura e carrinho usam a mesma URL e nao concedem acesso",
  );
  const semTipo = { ...transacao() } as Record<string, unknown>;
  delete semTipo.webhook_type;
  assert.equal(normalizarGuru(semTipo).acao, "ignorar", "webhook_type e exigido");
  assert.equal(normalizarGuru(null).acao, "ignorar");
  assert.equal(normalizarGuru("texto").acao, "ignorar");
}

// --- 5. nomes antigos continuam lidos nos campos de dado ---
{
  const e = normalizarGuru({
    webhook_type: "transaction",
    data: { order_id: "o-7", status: "approved", customer: { email: "b@c.com", phone: "551199" } },
  });
  assert.equal(e.acao, "aprovado");
  assert.equal(e.transacaoId, "o-7");
  assert.equal(e.email, "b@c.com");
  assert.equal(e.telefone, "551199");
}

// --- 6. o filtro de produto ---
{
  assert.deepEqual(listaDeProdutos(" p-1 , ,of-3,"), ["p-1", "of-3"]);
  assert.deepEqual(listaDeProdutos(undefined), []);
  assert.ok(produtoPermitido(["p-1"], []), "lista vazia aceita: o filtro pode estar no painel do Guru");
  assert.ok(produtoPermitido(["p-1", "mk-9", "of-3"], ["of-3"]), "qualquer um dos ids serve (oferta)");
  assert.ok(produtoPermitido(["p-1", "mk-9"], ["mk-9"]), "marketplace_id serve");
  assert.ok(!produtoPermitido(["p-2"], ["p-1"]), "produto de fora e ignorado");
  assert.ok(!produtoPermitido([], ["p-1"]), "evento sem produto nao passa por lista preenchida");
}

// --- 7. o token não vai para o banco ---
{
  const limpo = semToken({ ...transacao(), nested: { api_token: "x", ok: 1 }, lista: [{ API_TOKEN: "y" }] });
  const texto = JSON.stringify(limpo);
  assert.ok(!texto.includes("TOKEN-DA-CONTA"), "api_token do topo saiu");
  assert.ok(!/api_token/i.test(texto), "e de qualquer nivel");
  assert.ok(texto.includes("Ana Souza"), "o resto do payload fica");
}

console.log("guru-check: ok");

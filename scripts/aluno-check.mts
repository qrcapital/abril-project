// Self-check da validação dos dados do aluno (`lib/aluno-dados.ts`).
//
// Roda em node puro, sem framework: `npm run check:aluno`.
//
// Por que existe: estes três campos são editados pelo suporte com o aluno no telefone, e o erro
// que importa não estoura em lugar nenhum. Nome que vira string vazia reaparece como "Faltou
// pouco, ." na tela de resultado e como ", sua matrícula está confirmada" no e-mail; e-mail com
// espaço no meio derruba a entrega inteira daquela conta, porque o e-mail é o login.

import assert from "node:assert/strict";

import {
  diferencas,
  emailAceitavel,
  normalizarNome,
  normalizarTelefone,
  telefoneAceitavel,
  validarDados,
} from "../lib/aluno-dados.ts";

// --- normalização do nome ---
{
  assert.equal(normalizarNome("  Pedro   Teixeira  "), "Pedro Teixeira", "espaco duplo e pontas");
  // Espaço não separável, o que vem de planilha e de PDF. Passa despercebido na tela.
  assert.equal(normalizarNome("Ana Maria"), "Ana Maria");
  assert.equal(normalizarNome("\n\tJoão\n"), "João");
  assert.equal(normalizarNome("   "), "", "só espaço vira vazio, e vazio é recusado adiante");
  assert.equal(normalizarNome("a".repeat(200)).length, 120, "teto de tamanho");
}

// --- e-mail: frouxo de propósito, mas não a ponto de deixar passar erro de digitação ---
{
  for (const bom of [
    "ph@maracajalabs.com",
    "pedro.h+curso@gmail.com",
    "aluno@sub.dominio.com.br",
    "x@y.co",
  ]) {
    assert.ok(emailAceitavel(bom), `${bom} tem que passar`);
  }

  for (const ruim of [
    "",
    "semarroba.com",
    "dois@@arrobas.com",
    "sem@dominio",
    "espaco no@meio.com",
    "final@ponto.",
    "@sodominio.com",
    "local@",
  ]) {
    assert.ok(!emailAceitavel(ruim), `${ruim} tem que ser recusado`);
  }
}

// --- telefone: vazio é apagar, não erro ---
{
  assert.ok(telefoneAceitavel(""), "vazio limpa o campo");
  assert.ok(telefoneAceitavel("(11) 98765-4321"));
  assert.ok(telefoneAceitavel("+1 305 555 0199"), "numero estrangeiro passa: o curso vende para fora");
  assert.ok(!telefoneAceitavel("1234567"), "7 digitos e digitacao pela metade");
  assert.ok(!telefoneAceitavel("liga pro zap"), "texto sem digito");
  assert.equal(normalizarTelefone("  11  98765-4321 "), "11 98765-4321");
}

// --- a validação inteira, que é o que a rota chama ---
{
  const ok = validarDados({ nome: " Ana  Paula ", email: " ANA@Teste.COM ", telefone: "" });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.dados.nome, "Ana Paula");
    assert.equal(ok.dados.email, "ana@teste.com", "e-mail normalizado em minusculo");
    assert.equal(ok.dados.telefone, "");
  }

  const semNome = validarDados({ nome: "  ", email: "a@b.com", telefone: "" });
  assert.equal(semNome.ok, false, "nome vazio e recusado: decisao do Pedro de 31/jul");

  const emailRuim = validarDados({ nome: "Ana", email: "ana@", telefone: "" });
  assert.equal(emailRuim.ok, false);

  const telRuim = validarDados({ nome: "Ana", email: "a@b.com", telefone: "123" });
  assert.equal(telRuim.ok, false);
}

// --- o de/para do rastro ---
{
  const antes = { nome: "Ana", email: "a@b.com", telefone: "" };
  assert.deepEqual(diferencas(antes, antes), {}, "sem mudanca, sem rastro e sem gravacao");

  const d = diferencas(antes, { nome: "Ana Paula", email: "a@b.com", telefone: "11999998888" });
  assert.deepEqual(d, {
    nome: ["Ana", "Ana Paula"],
    telefone: ["", "11999998888"],
  });
  assert.ok(!("email" in d), "campo igual nao entra no rastro");

  // O caso que a rota trata diferente dos outros, porque troca o login.
  const trocaEmail = diferencas(antes, { ...antes, email: "novo@b.com" });
  assert.deepEqual(trocaEmail.email, ["a@b.com", "novo@b.com"]);
}

console.log("aluno-check: ok");

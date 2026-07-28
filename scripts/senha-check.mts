// Self-check da regra de senha. Sem framework: assert do node.
//   npm run check:senha
//
// A regra vale em duas portas (primeiro acesso e redefinição) e nos dois lados
// (cliente e servidor), então um furo aqui aparece em quatro lugares.

import assert from "node:assert/strict";
import { MINIMO_SENHA, REGRA_SENHA, validarSenha } from "../lib/senha.ts";

const passa = (s: string) => assert.equal(validarSenha(s), null, `deveria aceitar: ${s}`);
const falha = (s: string, trecho: string) => {
  const m = validarSenha(s);
  assert.ok(m, `deveria recusar: ${s}`);
  assert.ok(m.includes(trecho), `mensagem errada para "${s}": ${m}`);
};

// --- aceitas ---
passa("Abc123");
passa("SenhaNova-28jul-7b2m");
passa("aB3xyz");
passa("Ástrid1x"); // acento conta como maiúscula de verdade
passa("çedilhA9"); // minúscula acentuada + maiúscula ASCII

// --- tamanho ---
assert.equal(MINIMO_SENHA, 6);
falha("Ab1", "6 caracteres");
falha("", "6 caracteres");
falha("Ab12", "6 caracteres");
passa("Ab123c"); // exatamente 6 no limite

// --- classes de caractere ---
falha("abc123", "maiúscula");
falha("ABC123", "minúscula");
falha("Abcdef", "número");
falha("ABCDEF", "minúscula"); // sem minúscula e sem número: reporta o primeiro
falha("123456", "maiúscula");

// --- o tamanho é conferido antes das classes ---
falha("Ab1", "6 caracteres"); // curta E completa nas classes: a queixa é o tamanho

// --- só símbolos não basta ---
falha("!@#$%^", "maiúscula");

// --- a frase da regra menciona as quatro exigências, porque vai para a tela ---
for (const parte of [String(MINIMO_SENHA), "maiúscula", "minúscula", "número"])
  assert.ok(REGRA_SENHA.includes(parte), `REGRA_SENHA sem "${parte}": ${REGRA_SENHA}`);
assert.ok(!REGRA_SENHA.includes("—"), "sem travessao, regra do docs/COPY.md");

console.log("senha-check: ok");

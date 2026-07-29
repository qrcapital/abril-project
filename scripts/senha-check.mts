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
passa("Abc12345");
passa("SenhaNova-28jul-7b2m");
passa("aB3xyzwk");
passa("Ástrid1xy"); // acento conta como maiúscula de verdade
passa("çedilhA99"); // minúscula acentuada + maiúscula ASCII

// --- tamanho ---
assert.equal(MINIMO_SENHA, 8);
falha("Ab1", "8 caracteres");
falha("", "8 caracteres");
falha("Abc1234", "8 caracteres"); // 7, um a menos que o limite
passa("Abc12345"); // exatamente 8 no limite

// --- classes de caractere ---
falha("abc12345", "maiúscula");
falha("ABC12345", "minúscula");
falha("Abcdefgh", "número");
falha("ABCDEFGH", "minúscula"); // sem minúscula e sem número: reporta o primeiro
falha("12345678", "maiúscula");

// --- o tamanho é conferido antes das classes ---
falha("Ab1", "8 caracteres"); // curta E completa nas classes: a queixa é o tamanho

// --- só símbolos não basta ---
falha("!@#$%^&*", "maiúscula");

// --- a senha que o Supabase aceitaria sozinho (6 chars) tem que cair aqui ---
falha("Abc123", "8 caracteres");

// --- a frase da regra menciona as quatro exigências, porque vai para a tela ---
for (const parte of [String(MINIMO_SENHA), "maiúscula", "minúscula", "número"])
  assert.ok(REGRA_SENHA.includes(parte), `REGRA_SENHA sem "${parte}": ${REGRA_SENHA}`);
assert.ok(!REGRA_SENHA.includes("—"), "sem travessao, regra do docs/COPY.md");

console.log("senha-check: ok");

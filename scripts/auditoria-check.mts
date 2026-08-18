// Self-check da leitura do rastro do admin (`lib/auditoria-texto.ts`): `npm run check:auditoria`.
//
// Por que existe: esta é a tela que alguém abre para responder "quem trocou o e-mail desta conta".
// Um formatador que engole um registro por não reconhecer o formato transforma auditoria em teatro,
// e é o tipo de falha que ninguém percebe, porque a tela continua bonita e cheia de linhas.

import assert from "node:assert/strict";

import { descrever, rotularAcao } from "../lib/auditoria-texto.ts";

// --- ação conhecida vira verbo; desconhecida aparece crua, e NÃO some ---
{
  assert.equal(rotularAcao("aluno.dados"), "Editou dados");
  assert.equal(
    rotularAcao("financeiro.estornar"),
    "financeiro.estornar",
    "acao sem rotulo tem que aparecer com o codigo, nunca virar 'desconhecida' nem sumir",
  );
}

// --- edição de dados: antes → depois, por campo ---
{
  const linhas = descrever("aluno.dados", {
    nome: ["João Testinho", "João Testinho Neto"],
    email: ["a@b.com", "novo@b.com"],
  });
  assert.deepEqual(linhas, [
    "nome: “João Testinho” → “João Testinho Neto”",
    "email: “a@b.com” → “novo@b.com”",
  ]);

  // Campo que estava vazio é o caso comum do telefone, e "“” → “(11)...”" não se lê.
  assert.deepEqual(descrever("aluno.dados", { telefone: ["", "(11) 98765-4321"] }), [
    "telefone: vazio → “(11) 98765-4321”",
  ]);

  // Valor que não é par não vira linha quebrada: o registro pode ter sido gravado por uma versão
  // anterior da rota.
  assert.deepEqual(descrever("aluno.dados", { nome: "só um valor" }), []);
}

// --- progresso: plural da contagem, que é onde some sem ninguém ver ---
{
  const marcou = descrever("aluno.progresso-marcar", {
    ord: 3,
    modulo: "Como Acessar o Mercado Americano",
    aulas: 4,
  });
  assert.deepEqual(marcou, ["Módulo 3 · Como Acessar o Mercado Americano", "4 aulas"]);

  const uma = descrever("aluno.progresso-limpar", { ord: 0, modulo: "Bem-vindo", aulas: 1 });
  assert.equal(uma[1], "1 aula", "singular sem 's'");
}

// --- 2ª chamada: a nota que reprovou é o porquê do registro ---
{
  assert.deepEqual(descrever("prova.segunda-chamada", { attempt: 2, nota_anterior: 20 }), [
    "Tentativa 2",
    "reprovou com 20%",
  ]);
  // Fechada pela rotina de expiradas sem nota gravada: `null` não pode virar "reprovou com null%".
  assert.deepEqual(descrever("prova.segunda-chamada", { attempt: 2, nota_anterior: null }), [
    "Tentativa 2",
    "sem nota anterior registrada",
  ]);
  // Nota 0 é nota, e o `??` de um código descuidado a trataria como ausente.
  assert.equal(descrever("prova.segunda-chamada", { attempt: 2, nota_anterior: 0 })[1], "reprovou com 0%");
}

// --- papel: o "era mestre" só aparece quando é verdade ---
{
  assert.deepEqual(descrever("papel.revogar", { email: "ana@x.com", era_mestre: true }), [
    "ana@x.com",
    "era admin mestre",
  ]);
  assert.deepEqual(descrever("papel.promover", { email: "ana@x.com", era_mestre: false }), [
    "ana@x.com",
  ]);
}

// --- questões e conteúdo (item 19 do plano de 17/ago): o gabarito é o porquê do rastro ---
{
  assert.equal(rotularAcao("questao.salvar"), "Editou questão");
  assert.deepEqual(
    descrever("questao.salvar", { enunciado: "Qual o papel do dólar?", correta: "B", ativo: true }),
    ["“Qual o papel do dólar?”", "correta: B"],
  );
  // Desativar precisa aparecer: questão fora do sorteio muda a prova de todo mundo.
  assert.equal(
    descrever("questao.salvar", { enunciado: "X", correta: "A", ativo: false })[2],
    "desativada",
  );
  assert.deepEqual(descrever("questao.apagar", { enunciado: "" }), []);

  assert.equal(rotularAcao("conteudo.aula-apagar"), "Apagou aula");
  assert.deepEqual(descrever("conteudo.mover", { direcao: "subir" }), ["para cima"]);
  // Tirar uma aula do gate muda o 16/16 de todo mundo; tem que aparecer no detalhe.
  assert.deepEqual(descrever("conteudo.aula", { titulo: "ETFs", gate: false }), [
    "“ETFs”",
    "fora do gate da prova",
  ]);
  assert.deepEqual(descrever("conteudo.material", { titulo: "Apostila", arquivo: "https://x/a.pdf" }), [
    "“Apostila”",
    "https://x/a.pdf",
  ]);
}

// --- formato desconhecido e detalhe vazio não estouram ---
{
  assert.deepEqual(descrever("financeiro.estornar", { valor: 199, moeda: "BRL" }), [
    "valor: 199",
    'moeda: "BRL"',
  ]);
  assert.deepEqual(descrever("aluno.dados", null), []);
  assert.deepEqual(descrever("qualquer", {}), []);
}

console.log("auditoria-check: ok");

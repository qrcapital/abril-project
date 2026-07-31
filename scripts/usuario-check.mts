// Self-check dos marcadores de usuário no markup portado. Sem framework: assert do node.
//   npm run check:usuario
//
// Existe por causa de uma armadilha específica: o `preencherUsuario` troca o texto DENTRO de
// cada marcador. Se um porte novo remover um marcador, a troca simplesmente não acontece e a
// tela volta a servir o texto do design ("Pedro Teixeira") como se fosse o nome do aluno,
// sem erro nenhum. Este check transforma esse silêncio em falha de build.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { preencherUsuario } from "../lib/usuario-template.ts";

const ler = (p: string) => readFileSync(`app/app/_ui/${p}`, "utf8");

// Onde cada marcador precisa existir. Mudou o porte e um sumiu? Estoura aqui.
const ESPERADO: [string, string[]][] = [
  ["chrome-top.html", ['data-u="first"', 'data-u="initial"']],
  ["screens/home.html", ['data-u="first"']],
  ["screens/resultado.html", ['data-u="first"']],
  ["screens/resultado-reprovado.html", ['data-u="first"']],
  ["screens/conta.html", ['data-u="full"', "data-email", "data-acesso"]],
  // `data-cert` entrou em 31/jul/2026, com a emissão real: sem ele, a tela volta a servir o código
  // do design (`EI-2026-4817`) como se fosse o do aluno, e ele era o MESMO para todos.
  ["screens/certificado.html", ['data-u="full"', "data-cert"]],
];

for (const [arquivo, marcadores] of ESPERADO) {
  const html = ler(arquivo);
  for (const m of marcadores)
    assert.ok(html.includes(m), `${arquivo} perdeu o marcador ${m}`);
}

// O texto do design não pode sobreviver ao preenchimento em nenhuma das telas.
const ALUNO = {
  user_metadata: { nome: "Marina Tavares" },
  email: "marina@exemplo.com.br",
  created_at: "2026-03-10T12:00:00Z",
} as never;

for (const [arquivo] of ESPERADO) {
  const out = preencherUsuario(ler(arquivo), ALUNO);
  assert.ok(!out.includes("Pedro"), `${arquivo} ainda serve "Pedro" depois de preencher`);
  assert.ok(
    !out.includes("pedro@email.com"),
    `${arquivo} ainda serve o e-mail do design depois de preencher`,
  );
}

// Nome presente aparece; e o prazo de acesso é a criação da conta mais um ano.
const conta = preencherUsuario(ler("screens/conta.html"), ALUNO);
assert.ok(conta.includes("Marina Tavares"), "conta sem o nome completo");
assert.ok(conta.includes("marina@exemplo.com.br"), "conta sem o e-mail");
assert.ok(conta.includes("10/03/2027"), "conta sem o prazo de acesso de compra + 1 ano");

const topo = preencherUsuario(ler("chrome-top.html"), ALUNO);
assert.ok(topo.includes(">Marina<"), "topbar sem o primeiro nome");
assert.ok(topo.includes(">M<"), "topbar sem a inicial");

// Sem nome no cadastro, o marcador fica VAZIO, nunca com o texto do design: nome em branco é
// problema de dado visível, nome de outra pessoa se disfarça de conteúdo real.
const semNome = preencherUsuario(ler("screens/certificado.html"), {
  email: "x@y.com",
} as never);
assert.ok(!semNome.includes("Pedro"), "sem nome, o certificado voltou ao texto do design");

// Nome com caractere de HTML não pode escapar do texto para o markup.
const perigoso = preencherUsuario(ler("screens/certificado.html"), {
  user_metadata: { nome: '<script>alert(1)</script>' },
} as never);
assert.ok(!perigoso.includes("<script>"), "nome nao escapado entrou como markup");
assert.ok(perigoso.includes("&lt;script&gt;"), "nome deveria entrar escapado");

// A âncora do formulário de troca de senha. O `ContaClient` acha o link pelo texto e monta o
// formulário depois da linha dele; se um porte novo mudar esse texto, o link volta a ser o
// botão morto que a tarefa 8 consertou, e ninguém percebe até alguém clicar.
assert.ok(
  ler("screens/conta.html").includes("Trocar senha"),
  "conta.html perdeu o link 'Trocar senha', âncora do formulário de troca",
);

console.log("usuario-check: ok");

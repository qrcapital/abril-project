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
import {
  DOMINIO_LOGIN,
  emailDoUsuario,
  emailParaEntrar,
  gerarSenha,
  precisaTrocarSenha,
  rotuloDaConta,
  usuarioDoEmail,
  usuarioValido,
} from "../lib/usuario-login.ts";
import { validarSenha } from "../lib/senha.ts";

const ler = (p: string) => readFileSync(`app/app/_ui/${p}`, "utf8");

// Onde cada marcador precisa existir. Mudou o porte e um sumiu? Estoura aqui.
const ESPERADO: [string, string[]][] = [
  ["chrome-top.html", ['data-u="first"', 'data-u="initial"']],
  ["screens/home.html", ['data-u="first"']],
  ["screens/conta.html", ['data-u="full"', "data-email", "data-acesso"]],
  // O certificado saiu desta lista em out/2026: virou JSX (`app/_certificado/Folha.tsx`), com o nome
  // e o código entrando como texto escapado pelo React, sem marcador para um porte apagar.
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

// Com o `expires_at` da matrícula em mãos, é ELE que manda no prazo, não o proxy da criação:
// o proxy erra para matrícula estendida ou renovada (plano de correções de 17/ago, item 13).
const contaReal = preencherUsuario(ler("screens/conta.html"), ALUNO, "2028-06-01T12:00:00Z");
assert.ok(contaReal.includes("01/06/2028"), "conta ignorou o expires_at real da matrícula");
assert.ok(!contaReal.includes("10/03/2027"), "conta ainda mostra o proxy com o prazo real em mãos");

const topo = preencherUsuario(ler("chrome-top.html"), ALUNO);
assert.ok(topo.includes(">Marina<"), "topbar sem o primeiro nome");
assert.ok(topo.includes(">M<"), "topbar sem a inicial");

// Sem nome no cadastro, o marcador fica VAZIO, nunca com o texto do design: nome em branco é
// problema de dado visível, nome de outra pessoa se disfarça de conteúdo real.
const semNome = preencherUsuario(ler("screens/conta.html"), {
  email: "x@y.com",
} as never);
assert.ok(!semNome.includes("Pedro"), "sem nome, a conta voltou ao texto do design");
// E sem a vírgula do vocativo pendurada ("Olá," sem ninguém depois).
const topoSemNome = preencherUsuario(ler("chrome-top.html"), { email: "x@y.com" } as never);
assert.ok(!/Olá,\s*<span/.test(topoSemNome), "sem nome, a topbar ficou com \"Olá,\" pendurado");

// Nome com caractere de HTML não pode escapar do texto para o markup.
const perigoso = preencherUsuario(ler("screens/conta.html"), {
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

// Login por usuário (13/out/2026). O login converte no navegador e a rota do admin valida no
// servidor com as mesmas funções; se as duas pontas divergirem, a conta criada não entra.
assert.equal(emailDoUsuario("Abril.Indicadores"), `abril.indicadores@${DOMINIO_LOGIN}`);
assert.equal(emailParaEntrar(" aluno@x.com "), "aluno@x.com", "e-mail de aluno mudou no login");
assert.equal(emailParaEntrar(" qr-capital "), `qr-capital@${DOMINIO_LOGIN}`);
assert.equal(usuarioDoEmail(`teste_1@${DOMINIO_LOGIN}`), "teste_1");
assert.equal(usuarioDoEmail("aluno@x.com"), null);
assert.equal(rotuloDaConta("aluno@x.com"), "aluno@x.com");
for (const ok of ["abril.indicadores", "qr-capital", "abc", "teste_1", "a".repeat(40)])
  assert.ok(usuarioValido(ok), `${ok} deveria valer`);
for (const ruim of ["ab", "a".repeat(41), ".abril", "abril.", "ab..cd", "Abril", "a b", "abril@x", "ação"])
  assert.ok(!usuarioValido(ruim), `${ruim} não deveria valer`);
assert.ok(precisaTrocarSenha({ app_metadata: { trocar_senha: true } }));
assert.ok(!precisaTrocarSenha({ app_metadata: { trocar_senha: false } }));
assert.ok(!precisaTrocarSenha(null));

// A senha gerada passa na regra do produto, não tem caractere ambíguo e não se repete.
const senhas = new Set<string>();
for (let i = 0; i < 300; i++) {
  const s = gerarSenha();
  assert.equal(s.length, 16);
  assert.equal(validarSenha(s), null, `senha gerada recusada: ${s}`);
  assert.ok(!/[0O1lI]/.test(s), `senha gerada com caractere ambíguo: ${s}`);
  senhas.add(s);
}
assert.equal(senhas.size, 300, "senha gerada repetiu");

console.log("usuario-check: ok");

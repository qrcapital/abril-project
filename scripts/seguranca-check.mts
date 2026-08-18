// Self-check das regras de borda de `lib/seguranca.ts`: `npm run check:seguranca`.
//
// As duas regras guardam os críticos de produção do plano de 17/ago (itens 16 e 18): o
// cadastro aberto em produção seria curso de graça, e o `\` no destino do /auth/confirm era
// open redirect em cima de link de e-mail legítimo. Nenhuma das duas falha em build ou lint;
// falham aqui.

import assert from "node:assert/strict";

import { cadastroAberto, destinoSeguro } from "../lib/seguranca.ts";

// --- item 16: cadastro pela tela só fora de produção ---
{
  assert.equal(cadastroAberto("production"), false, "producao tem que RECUSAR o signup da tela");
  assert.equal(cadastroAberto("homolog"), true);
  // Ambiente sem a variável é dev local, onde o signup é o caminho de teste.
  assert.equal(cadastroAberto(undefined), true);
}

// --- item 18: só destino interno no redirect pós-auth ---
{
  const PADRAO = "/app/redefinir-senha";
  const seguro = (v: string | null) => destinoSeguro(v, PADRAO);

  // O caso do achado: navegador trata `\` como `/`, então "/\evil.com" resolvia
  // para "//evil.com" DEPOIS da guarda antiga.
  assert.equal(seguro("/\\evil.com"), PADRAO, "barra invertida tem que cair no padrao");
  assert.equal(seguro("\\/evil.com"), PADRAO);
  assert.equal(seguro("/\\\\evil.com"), PADRAO);

  // Os que a guarda antiga já barrava continuam barrados.
  assert.equal(seguro("//evil.com"), PADRAO);
  assert.equal(seguro("https://evil.com"), PADRAO);
  assert.equal(seguro(""), PADRAO);
  assert.equal(seguro(null), PADRAO);

  // Destino interno legítimo passa intacto, com query e tudo.
  assert.equal(seguro("/app"), "/app");
  assert.equal(seguro("/app/redefinir-senha?tipo=invite"), "/app/redefinir-senha?tipo=invite");
}

console.log("seguranca-check: ok");

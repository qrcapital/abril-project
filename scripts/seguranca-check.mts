// Self-check das regras de borda de `lib/seguranca.ts`: `npm run check:seguranca`.
//
// As duas regras guardam os críticos de produção do plano de 17/ago (itens 16 e 18): o
// cadastro aberto em produção seria curso de graça, e o `\` no destino do /auth/confirm era
// open redirect em cima de link de e-mail legítimo. Nenhuma das duas falha em build ou lint;
// falham aqui.

import assert from "node:assert/strict";

import { baseDoSite, cadastroAberto, destinoSeguro, emProducao } from "../lib/seguranca.ts";

// --- item 16: cadastro pela tela só fora de produção, e produção é o padrão ---
{
  assert.equal(cadastroAberto("production", undefined), false, "producao tem que RECUSAR o signup da tela");
  assert.equal(cadastroAberto("homolog", undefined), true);
  assert.equal(cadastroAberto("development", undefined), true);
  assert.equal(cadastroAberto("local", undefined), true);
  // Fail-closed desde 29/set/2026: variável faltando é produção, não dev. Antes era o contrário, e
  // um contexto novo na Netlify sem a variável abria o cadastro no domínio público.
  assert.equal(cadastroAberto(undefined, undefined), false, "sem NEXT_PUBLIC_APP_ENV o cadastro FECHA");
  assert.equal(cadastroAberto("", undefined), false);
  assert.equal(cadastroAberto("prod", undefined), false, "valor desconhecido e producao");
  // A chave manual abre, e só com o valor exato.
  assert.equal(cadastroAberto("production", "sim"), true);
  assert.equal(cadastroAberto("production", "true"), false);
  assert.equal(cadastroAberto("production", ""), false);

  assert.equal(emProducao(undefined), true);
  assert.equal(emProducao("production"), true);
  assert.equal(emProducao("Homolog"), false);
}

// --- a base dos links de e-mail não aceita Origin em produção ---
{
  const SITE = "https://blocktrends.abril.com.br";
  assert.equal(
    baseDoSite({ appEnv: "production", siteUrl: SITE, origem: "https://atacante.test" }),
    SITE,
    "em producao o Origin e do cliente: link de senha com o dominio do atacante",
  );
  assert.equal(baseDoSite({ appEnv: undefined, siteUrl: SITE, origem: "https://atacante.test" }), SITE);
  assert.equal(baseDoSite({ appEnv: "production", siteUrl: "", origem: "https://x.test" }), "");
  assert.equal(
    baseDoSite({ appEnv: "local", siteUrl: SITE, origem: "http://localhost:3000" }),
    "http://localhost:3000",
    "fora de producao o link volta para quem pediu",
  );
  assert.equal(baseDoSite({ appEnv: "homolog", siteUrl: `${SITE}/`, origem: null }), SITE);
  assert.equal(baseDoSite({ appEnv: "production", siteUrl: "javascript:alert(1)" }), "");
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

  // Tab, CR e LF: o navegador os descarta em qualquer posição da URL, então "/\t/evil.com"
  // chegava ao Location como "//evil.com".
  assert.equal(seguro("/\t/evil.com"), PADRAO, "tab no meio do // tem que cair no padrao");
  assert.equal(seguro("/\n/evil.com"), PADRAO);
  assert.equal(seguro("/\r\n/evil.com"), PADRAO);
  assert.equal(seguro("\t//evil.com"), PADRAO);
  assert.equal(seguro("/\t\\evil.com"), PADRAO);

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

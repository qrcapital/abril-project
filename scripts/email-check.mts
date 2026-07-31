// Self-check da montagem do e-mail.
//   npm run check:email
//
// Roda offline, sem banco e sem rede: o que ele guarda é a parte pura, que é onde o erro chega
// longe. E-mail transacional é a única superfície do produto que **sai da nossa mão e não volta**:
// tela errada se corrige com um deploy, e-mail errado já está na caixa de entrada de alguém.
//
// O que quebraria sem ele:
//
// 1. **Escape de HTML no corpo.** O nome vem do checkout do Guru, que é digitado por terceiros. Sem
//    escape, um nome com `<` quebra o layout no melhor caso e injeta markup no pior.
// 2. **Variável fora do contrato.** O editor do painel escreve o texto; o gatilho preenche os
//    campos. Um `{{cidade}}` salvo sem ninguém para preencher viraria um branco no meio da frase.
// 3. **Assunto escapado.** Cabeçalho de e-mail é texto puro: `&amp;` ali aparece literal na caixa
//    de entrada.
// 4. **CTA sem destino.** Botão apontando para lugar nenhum é pior que ausência de botão.

import assert from "node:assert/strict";

// O banner com caminho relativo depende de `NEXT_PUBLIC_SITE_URL` para virar URL absoluta, e este
// check roda sem `.env`. Fixar aqui mantém o resultado igual na máquina de qualquer um.
process.env.NEXT_PUBLIC_SITE_URL = "https://ei.test";

import {
  GATILHOS,
  ROTULOS,
  VARIAVEIS,
  renderizar,
  variaveisInvalidas,
  type Template,
} from "../lib/email-render.ts";

const base = (extra: Partial<Template> = {}): Template => ({
  chave: "boas-vindas",
  assunto: "Olá, {{nome}}",
  corpo: "{{nome}}, sua matrícula está confirmada.\nSegunda linha, segundo parágrafo.",
  cta: "Criar minha senha",
  ...extra,
});

// --- 1. escape no corpo, sem escape no assunto ---
{
  const r = renderizar(base(), { nome: '<script>alert("x")</script>', link: "https://ei.test/s" });
  assert.ok(
    !r.html.includes("<script>"),
    "nome com markup precisa sair escapado do corpo: seria injecao no HTML do e-mail",
  );
  assert.ok(r.html.includes("&lt;script&gt;"), "o escape tem que aparecer como entidade");
  assert.ok(
    !r.texto.includes("&lt;"),
    "a versao texto nao pode ter entidade HTML: ali ninguem decodifica",
  );
}
{
  const r = renderizar(base({ assunto: "Bolsa & renda de {{nome}}" }), { nome: "Ana & Cia" });
  assert.equal(
    r.assunto,
    "Bolsa & renda de Ana & Cia",
    "assunto e cabecalho, nao HTML: escapar ali mostra &amp; literal na caixa de entrada",
  );
}

// --- 2. o contrato de variáveis ---
{
  assert.deepEqual(variaveisInvalidas("{{nome}} e mais nada", "boas-vindas"), []);
  assert.deepEqual(
    variaveisInvalidas("{{nome}} de {{cidade}} com {{nota}}", "boas-vindas"),
    ["cidade", "nota"],
    "variavel fora da lista do template precisa ser recusada na edicao",
  );
  // `link` nunca entra no texto: o destino do botão vem do gatilho.
  for (const [chave, lista] of Object.entries(VARIAVEIS)) {
    assert.ok(!lista.includes("link"), `${chave} nao pode expor "link" como variavel de texto`);
  }
  // Toda chave com variáveis também tem rótulo e gatilho na tela, senão o admin edita às cegas.
  for (const chave of Object.keys(VARIAVEIS)) {
    assert.ok(ROTULOS[chave]?.trim(), `${chave} sem rotulo para a tela`);
    assert.ok(GATILHOS[chave]?.trim(), `${chave} sem gatilho descrito`);
  }
}

// --- 3. campo sem valor não vaza a chave crua ---
{
  const r = renderizar(base(), { link: "https://ei.test/s" });
  assert.ok(
    !r.html.includes("{{") && !r.texto.includes("{{") && !r.assunto.includes("{{"),
    "dado faltando vira vazio, nunca {{campo}} na cara do aluno",
  );
}

// --- 3b. conta sem nome não abre o e-mail com vírgula ---
{
  const r = renderizar(base(), { nome: "", link: "https://ei.test/s" });
  assert.ok(
    r.html.includes("<p style=\"margin:0 0 14px\">Sua matrícula está confirmada.</p>"),
    "nome vazio deixaria virgula orfa e minuscula: 3 das 8 contas do homolog nao tem nome",
  );
  assert.ok(
    !r.texto.startsWith(","),
    "a versao texto passa pela mesma limpeza, senao a caixa de entrada mostra a virgula na previa",
  );
}

// --- 4. o CTA depende do destino ---
{
  const com = renderizar(base(), { nome: "Ana", link: "https://ei.test/senha" });
  assert.ok(com.html.includes("https://ei.test/senha"), "com link, o botao sai");
  assert.ok(
    com.html.includes("Se o botão não abrir"),
    "o endereco tambem vai em texto: cliente de e-mail as vezes engole o botao",
  );
  assert.ok(com.texto.includes("Criar minha senha: https://ei.test/senha"));

  const sem = renderizar(base(), { nome: "Ana" });
  assert.ok(!sem.html.includes("<a href"), "sem link, nenhum botao (nao existe CTA para lugar nenhum)");
  assert.ok(
    sem.html.includes("sua matrícula está confirmada"),
    "e o texto continua se explicando sem o botao",
  );
}

// --- 5. cada linha do editor é um parágrafo ---
{
  const r = renderizar(base({ corpo: "Um.\nDois.\n\n\nTrês." }), {});
  assert.equal((r.html.match(/<p style="margin:0 0 14px">/g) ?? []).length, 3);
  assert.equal(r.texto.split("\n\n")[0], "Um.");
}

// --- 5b. o banner: absoluto, com alt, e só quando os dois existem ---
{
  const sem = renderizar(base(), { nome: "Ana" });
  assert.ok(!sem.html.includes("<img"), "sem banner, nenhuma imagem no e-mail");

  const relativo = renderizar(base({ banner: "/lp/banner.png", banner_alt: "Estratégia" }), {});
  assert.ok(
    !/src="\/lp/.test(relativo.html),
    "caminho relativo nao funciona em e-mail: a mensagem abre fora do nosso dominio",
  );
  assert.ok(/src="[^"]*\/lp\/banner\.png"/.test(relativo.html));

  const externo = renderizar(
    base({ banner: "https://cdn.test/b.png", banner_alt: 'Arte <do> "curso"' }),
    {},
  );
  assert.ok(externo.html.includes('src="https://cdn.test/b.png"'), "URL completa passa direto");
  assert.ok(
    externo.html.includes('alt="Arte &lt;do&gt; &quot;curso&quot;"'),
    "o alt e atributo HTML: sem escape, uma aspas ali quebra a tag",
  );

  assert.ok(
    relativo.html.includes('src="https://ei.test/lp/banner.png"'),
    "caminho relativo resolve contra NEXT_PUBLIC_SITE_URL",
  );

  // Alt vazio deixaria uma caixa muda no topo de um e-mail com imagem bloqueada. A tela recusa
  // salvar assim; se chegar, o e-mail sai sem banner em vez de sair mudo.
  const semAlt = renderizar(base({ banner: "https://cdn.test/b.png", banner_alt: "  " }), {});
  assert.ok(!semAlt.html.includes("<img"), "banner sem alt nao sai");
  assert.ok(semAlt.html.includes("matrícula está confirmada"), "e o e-mail segue legivel");

  // Ambiente sem site configurado: melhor sem banner que com imagem quebrada no topo.
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  const orfao = renderizar(base({ banner: "/lp/banner.png", banner_alt: "Estratégia" }), {});
  assert.ok(!orfao.html.includes("<img"), "sem NEXT_PUBLIC_SITE_URL, o banner relativo nao sai");
  process.env.NEXT_PUBLIC_SITE_URL = site;
}

// --- 6. o HTML é um documento fechado, com preheader ---
{
  const r = renderizar(base(), { nome: "Ana", link: "https://ei.test/s" });
  assert.ok(r.html.startsWith("<!doctype html>"), "cliente de e-mail precisa do doctype");
  assert.ok(r.html.trimEnd().endsWith("</html>"));
  assert.ok(
    r.html.includes("max-height:0;overflow:hidden"),
    "sem preheader, a caixa de entrada pesca o wordmark como previa",
  );
}

console.log(`email-check: ok (${Object.keys(VARIAVEIS).length} templates no contrato)`);

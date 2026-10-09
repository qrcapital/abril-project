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
  DESCRICOES,
  GATILHOS,
  ROTULOS,
  VARIAVEIS,
  linkUtilizavel,
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

  // TODA variável do contrato aparece na legenda, com descrição e exemplo. Variável documentada pela
  // metade é pior que ausente, porque parece pronta para quem escreve o texto.
  for (const [chave, lista] of Object.entries(VARIAVEIS)) {
    for (const v of lista) {
      assert.ok(DESCRICOES[v]?.texto?.trim(), `{{${v}}} (${chave}) sem descricao na legenda`);
      assert.ok(DESCRICOES[v]?.exemplo?.trim(), `{{${v}}} (${chave}) sem exemplo na legenda`);
    }
  }
  // `minimo` NAO e variavel (decisao do Pedro em 31/jul: a nota de corte e 70 e e premissa travada,
  // e variavel que nunca varia e uma linha a mais para quem escreve entender). O corpo do template
  // diz 70 em texto, trocado pela migration 0013.
  for (const lista of Object.values(VARIAVEIS)) {
    assert.ok(!lista.includes("minimo"), "minimo saiu do contrato: a nota de corte e texto no corpo");
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
    r.html.includes("<p style=\"margin:0 0 16px\">Sua matrícula está confirmada.</p>"),
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
  // `data-botao` e não `<a href`: o rodapé tem links próprios (contato, Política, Termos).
  assert.ok(!sem.html.includes("data-botao"), "sem link, nenhum botao (nao existe CTA para lugar nenhum)");
  assert.ok(
    sem.html.includes("sua matrícula está confirmada"),
    "e o texto continua se explicando sem o botao",
  );
}

// --- 5. cada linha do editor é um parágrafo ---
{
  const r = renderizar(base({ corpo: "Um.\nDois.\n\n\nTrês." }), {});
  assert.equal((r.html.match(/<p style="margin:0 0 16px">/g) ?? []).length, 3);
  assert.equal(r.texto.split("\n\n")[0], "Um.");
}

// --- 5b. o banner: absoluto, com alt, e só quando os dois existem ---
{
  const sem = renderizar(base(), { nome: "Ana" });
  // Cabeçalho e rodapé têm as marcas em imagem (/email/ei-*), desde 09/out/2026; o que não pode
  // aparecer é imagem de banner.
  assert.ok(!/<img[^>]+src="(?![^"]*\/email\/ei-)/.test(sem.html), "sem banner, nenhuma imagem alem das marcas");

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
  assert.ok(!semAlt.html.includes("cdn.test/b.png"), "banner sem alt nao sai");
  assert.ok(semAlt.html.includes("matrícula está confirmada"), "e o e-mail segue legivel");

  // Ambiente sem site configurado: melhor sem banner que com imagem quebrada no topo.
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  const orfao = renderizar(base({ banner: "/lp/banner.png", banner_alt: "Estratégia" }), {});
  assert.ok(!orfao.html.includes("<img"), "sem NEXT_PUBLIC_SITE_URL, o banner relativo nao sai (e as marcas viram texto)");
  process.env.NEXT_PUBLIC_SITE_URL = site;
}

// --- 5c. o destino do botão precisa ser clicável de dentro de uma caixa de entrada ---
{
  assert.ok(linkUtilizavel("https://ei.test/app/certificado"));
  assert.ok(linkUtilizavel("http://localhost:3000/auth/confirm?token_hash=x"));
  assert.ok(linkUtilizavel("https://wa.me/message/W2USYZZK75FMC1"));
  assert.ok(
    !linkUtilizavel("/app/certificado"),
    "caminho relativo e o caso real: o gatilho monta o link com NEXT_PUBLIC_SITE_URL, e a variavel " +
      "faltando produz exatamente isso. O envio recusa em vez de mandar botao morto",
  );
  assert.ok(!linkUtilizavel(""), "vazio nao e link");
  assert.ok(!linkUtilizavel(undefined));
  assert.ok(!linkUtilizavel(82), "numero nao e link");
  assert.ok(
    !linkUtilizavel("javascript:alert(1)"),
    "so http, https e mailto: o resto nao e destino de botao de e-mail",
  );
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

// --- 7. a identidade VEJA Negócios, e nada da anterior ---
{
  const r = renderizar(base(), { nome: "Ana", link: "https://ei.test/s" });
  assert.ok(r.html.includes("#6b111c"), "o filete vinho do cabecalho, como no RD");
  assert.ok(r.html.includes('alt="VEJA Negócios | Estratégia Internacional"'), "o lockup em PNG com alt: imagem bloqueada ainda mostra a marca");
  assert.ok(r.html.includes('bgcolor="#6b111c"'), "o botao no vinho da campanha");
  for (const antiga of ["#0B2D20", "#A98E4E", "#D9BE85", "#7E6836"]) {
    assert.ok(!r.html.includes(antiga), `a paleta verde e dourada saiu: ${antiga} ainda no HTML`);
  }
  assert.ok(!/<img[^>]+src="(?![^"]*\/email\/ei-)/.test(r.html), "sem banner, so as marcas em imagem (com alt em texto)");
  assert.ok(r.html.includes("light only"), "pede ao cliente para nao inverter as cores");
  assert.ok(r.html.includes("max-width:600px"), "600px, a largura que todo cliente respeita");
  // O título do corpo é o assunto, escapado.
  const t = renderizar(base({ assunto: "Oi <b>{{nome}}</b>" }), { nome: "Ana" });
  assert.ok(t.html.includes("Oi &lt;b&gt;Ana&lt;/b&gt;</h1>"), "o assunto vira titulo, escapado no HTML");
  assert.equal(t.assunto, "Oi <b>Ana</b>", "e continua cru no cabecalho");
  // Regra da casa (COPY.md): sem travessão em copy nenhuma, e a moldura é copy.
  assert.ok(!r.html.includes("\u2014") && !r.texto.includes("\u2014"), "travessao na moldura do e-mail");
  // O rodapé aponta para os documentos no próprio site, em endereço absoluto.
  assert.ok(r.html.includes('href="https://ei.test/privacidade"'));
  assert.ok(r.html.includes('href="https://ei.test/termos-de-uso"'));
}

// --- 8. o template de redefinição está no contrato, com rótulo e gatilho ---
{
  assert.deepEqual(VARIAVEIS["redefinicao-senha"], ["nome"]);
  assert.ok(ROTULOS["redefinicao-senha"] && GATILHOS["redefinicao-senha"]);
}

console.log(`email-check: ok (${Object.keys(VARIAVEIS).length} templates no contrato)`);

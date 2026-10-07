// Self-check do glossário e da linha do tempo: `npm run check:glossario` (07/out/2026).
//
// Três coisas que não aparecem em build nem em lint:
// 1. o linkificador (`lib/glossario-links.ts`), que decide qual palavra do notebook vira link: o
//    casamento mais longo vence, acento e caixa não importam, nada casa dentro de outra palavra, e
//    sigla curta só casa em caixa alta;
// 2. o conteúdo (`content/glossario/*` e `content/linha-do-tempo.ts`): slug único e bem formado,
//    categoria válida, campos obrigatórios, aula do curso que existe, antecedente que vem antes no
//    tempo, e nenhum travessão em texto que o aluno lê;
// 3. as referências cruzadas (relacionados, verbetes dos marcos, antecedentes). Referência quebrada
//    é AVISO, e não erro: o conteúdo é escrito em paralelo, e a tela já ignora o que não existe. O
//    aviso lista cada uma para a revisão.
//
// Os arquivos de conteúdo importam `@/lib/glossario` e `./contexto` sem extensão, como o Next
// aceita; o mesmo `notebook-alias.mjs` do check do notebook resolve os dois para o node puro.

import assert from "node:assert/strict";
import { register } from "node:module";

import {
  CATEGORIAS_GLOSSARIO,
  CATEGORIAS_LINHA,
  COR_DA_LINHA,
  ERAS,
  eraDe,
  hrefNoCurso,
  letraDe,
  normalizar,
  rotuloNoCurso,
  slugificar,
  type Marco,
  type Verbete,
} from "../lib/glossario.ts";
import { dobrar, ehSigla, montarIndice, segmentar, type Pedaco } from "../lib/glossario-links.ts";

register("./notebook-alias.mjs", import.meta.url);

// --- utilitários ------------------------------------------------------------------------------

assert.equal(normalizar("  Paridade   do Poder de Compra "), "paridade do poder de compra");
assert.equal(slugificar("Paridade do poder de compra (PPC)"), "paridade-do-poder-de-compra-ppc");
assert.equal(letraDe("Ágio"), "A");
assert.equal(letraDe("Écart"), "E");
assert.equal(letraDe("401(k)"), "#");
assert.equal(dobrar("Ação Câmbio"), "acao cambio");
assert.equal(dobrar("Ação Câmbio").length, "Ação Câmbio".length, "a dobra mantém o comprimento");
assert.equal(hrefNoCurso({ modulo: 1, aula: 3 }), "/app/modulo/1?aula=3#aula-3");
assert.equal(hrefNoCurso({ modulo: 1, aula: 3, tempo: "12:34" }), "/app/modulo/1?aula=3&t=754#player");
assert.equal(rotuloNoCurso({ modulo: 0, aula: 2 }), "Módulo I · Aula 02");
assert.equal(eraDe(1944), 1);
assert.equal(eraDe(2026), ERAS.length - 1);
for (const c of CATEGORIAS_LINHA) assert.ok(COR_DA_LINHA[c], `categoria da linha sem cor: ${c}`);
assert.ok(ehSigla("IR") && ehSigla("PPC") && ehSigla("S&P") && ehSigla("IPCA"));
assert.ok(!ehSigla("Fed") && !ehSigla("dólar") && !ehSigla("BRASIL E EUA"));

// --- o linkificador ---------------------------------------------------------------------------

const amostra = [
  { slug: "ppc", termo: "Paridade do poder de compra", sigla: "PPC", apelidos: ["paridade de poder de compra"] },
  { slug: "poder-de-compra", termo: "Poder de compra" },
  { slug: "cambio", termo: "Câmbio", apelidos: ["taxa de câmbio"] },
  { slug: "imposto-de-renda", termo: "Imposto de renda", sigla: "IR" },
  { slug: "ira", termo: "Conta de aposentadoria individual", sigla: "IRA" },
  { slug: "real", termo: "Real" },
  { slug: "padrao-ouro", termo: "Padrão-ouro", apelidos: ["padrão ouro"] },
  { slug: "ouro", termo: "Ouro" },
  { slug: "sp500", termo: "S&P 500" },
  { slug: "curta", termo: "Xo", apelidos: ["eu"] },
];
const indice = montarIndice(amostra);
const links = (texto: string, opcoes?: Parameters<typeof segmentar>[2]) =>
  segmentar(texto, indice, opcoes)
    .filter((p): p is Required<Pedaco> => Boolean(p.slug))
    .map((p) => `${p.slug}:${p.texto}`);
const junta = (texto: string) => segmentar(texto, indice).map((p) => p.texto).join("");

// O mais longo vence, e o trecho dele não acende o mais curto.
assert.deepEqual(links("A paridade do poder de compra explica."), ["ppc:paridade do poder de compra"]);
assert.deepEqual(links("O poder de compra caiu."), ["poder-de-compra:poder de compra"]);
assert.deepEqual(
  links("A Paridade do Poder de Compra e depois a paridade do poder de compra.", { vistos: new Set() }),
  ["ppc:Paridade do Poder de Compra"],
  "a segunda ocorrência não vira link, e não acende o 'poder de compra' de dentro",
);
// Sem acento e sem caixa, com o texto do link exatamente como estava escrito.
assert.deepEqual(links("O CAMBIO e a Taxa de Cambio."), ["cambio:CAMBIO", "cambio:Taxa de Cambio"]);
assert.deepEqual(links("A taxa de câmbio subiu.", { vistos: new Set() }), ["cambio:taxa de câmbio"]);
// Limite de palavra: nada dentro de outra palavra, nem do outro lado de um hífen.
assert.deepEqual(links("A realidade e o surreal."), []);
assert.deepEqual(links("O real caiu."), ["real:real"]);
assert.deepEqual(links("O padrão-ouro acabou."), ["padrao-ouro:padrão-ouro"]);
assert.deepEqual(links("O padrão ouro acabou."), ["padrao-ouro:padrão ouro"]);
assert.deepEqual(links("Comprou ouro-branco."), [], "ouro grudado por hífen não casa");
assert.deepEqual(links("Comprou ouro, e prata."), ["ouro:ouro"]);
// Sigla curta só em caixa alta exata.
assert.deepEqual(links("O IR sobre o ganho."), ["imposto-de-renda:IR"]);
assert.deepEqual(links("Vou ir ao banco."), []);
assert.deepEqual(links("Ir ao banco."), [], "sigla com só a inicial maiúscula não casa");
assert.deepEqual(links("A ira do mercado, e a IRA do Tio Sam."), ["ira:IRA"]);
assert.deepEqual(links("A PPC de longo prazo."), ["ppc:PPC"]);
assert.deepEqual(links("O ppc é outra coisa."), []);
// Forma comum de até 2 caracteres é ignorada.
assert.deepEqual(links("Eu e Xo."), []);
// Símbolos na forma e pontuação colada.
assert.deepEqual(links("O S&P 500, de novo."), ["sp500:S&P 500"]);
// `excluir` e `vistos`.
assert.deepEqual(links("O câmbio e o real.", { excluir: new Set(["cambio"]) }), ["real:real"]);
{
  const vistos = new Set<string>();
  assert.deepEqual(links("O câmbio.", { vistos }), ["cambio:câmbio"]);
  assert.deepEqual(links("De novo o câmbio e o real.", { vistos }), ["real:real"], "vistos vale entre parágrafos");
}
// O texto volta inteiro, caractere por caractere.
for (const t of ["", "Sem termo nenhum.", "O IR, o câmbio e a paridade do poder de compra; e ouro."])
  assert.equal(junta(t), t);
// Glossário vazio não quebra.
assert.deepEqual(segmentar("O câmbio.", montarIndice([])), [{ texto: "O câmbio." }]);

// --- o conteúdo de verdade --------------------------------------------------------------------

const { GLOSSARIO, verbete, categoriasComVerbete } = await import("../content/glossario/index.ts");
const { LINHA_DO_TEMPO } = await import("../content/linha-do-tempo.ts");
const glossario = GLOSSARIO as Verbete[];
const linha = LINHA_DO_TEMPO as Marco[];

const erros: string[] = [];
const avisos: string[] = [];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TRAVESSAO = /[\u2014\u2013]/;
const TEMPO = /^(?:\d{1,2}:)?[0-5]?\d:[0-5]\d$/;

/** Toda string de um objeto, com o caminho, para a caça ao travessão. */
function* strings(x: unknown, caminho: string): Generator<[string, string]> {
  if (typeof x === "string") yield [caminho, x];
  else if (Array.isArray(x)) for (let i = 0; i < x.length; i++) yield* strings(x[i], `${caminho}[${i}]`);
  else if (x && typeof x === "object") for (const [k, v] of Object.entries(x)) yield* strings(v, `${caminho}.${k}`);
}
const semTravessao = (x: unknown, nome: string) => {
  for (const [c, s] of strings(x, nome)) if (TRAVESSAO.test(s)) erros.push(`travessão em ${c}: "${s.slice(0, 80)}"`);
};
const aulaValida = (n: { modulo: number; aula: number; tempo?: string }, onde: string) => {
  if (!Number.isInteger(n.modulo) || n.modulo < 0 || n.modulo > 3) erros.push(`${onde}: módulo ${n.modulo} fora de 0..3`);
  if (!Number.isInteger(n.aula) || n.aula < 1 || n.aula > 20) erros.push(`${onde}: aula ${n.aula} inválida`);
  if (n.tempo !== undefined && !TEMPO.test(n.tempo)) erros.push(`${onde}: tempo "${n.tempo}" ilegível`);
};

// Verbetes.
const slugs = new Set<string>();
for (const v of glossario) {
  const onde = `verbete ${v.slug || "(sem slug)"}`;
  if (!SLUG.test(v.slug)) erros.push(`${onde}: slug mal formado`);
  if (slugs.has(v.slug)) erros.push(`${onde}: slug repetido`);
  slugs.add(v.slug);
  if (!(CATEGORIAS_GLOSSARIO as readonly string[]).includes(v.categoria)) erros.push(`${onde}: categoria "${v.categoria}" inválida`);
  if (!v.termo?.trim()) erros.push(`${onde}: sem termo`);
  if (!v.resumo?.trim()) erros.push(`${onde}: sem resumo`);
  if (!v.texto?.length || v.texto.some((p) => !p.trim())) erros.push(`${onde}: texto vazio`);
  for (const n of v.noCurso ?? []) aulaValida(n, onde);
  for (const r of v.relacionados ?? []) {
    if (r === v.slug) avisos.push(`${onde}: relacionado a si mesmo`);
    else if (!verbete(r)) avisos.push(`${onde}: relacionado "${r}" não existe`);
  }
  semTravessao(v, onde);
}
// A ordem alfabética que a lista e o "anterior/seguinte" assumem.
for (let i = 1; i < glossario.length; i++)
  if (glossario[i - 1].termo.localeCompare(glossario[i].termo, "pt-BR", { sensitivity: "base" }) > 0)
    erros.push(`GLOSSARIO fora de ordem em ${glossario[i].slug}`);
// A mesma forma em dois verbetes: o link vai para o primeiro, e o segundo nunca acende por ela.
{
  const dono = new Map<string, string>();
  for (const v of glossario)
    for (const f of new Set([v.termo, v.sigla, ...(v.apelidos ?? [])].filter(Boolean) as string[])) {
      const k = ehSigla(f.trim()) ? `=${f.trim()}` : dobrar(f.trim()).replace(/\s+/g, " ");
      const outro = dono.get(k);
      if (outro && outro !== v.slug) avisos.push(`forma "${f}" está em ${outro} e em ${v.slug}: o link vai para ${outro}`);
      else dono.set(k, v.slug);
    }
}

// Marcos.
const marcos = new Map<string, Marco>();
for (const m of linha) {
  const onde = `marco ${m.slug || "(sem slug)"}`;
  if (!SLUG.test(m.slug)) erros.push(`${onde}: slug mal formado`);
  if (marcos.has(m.slug)) erros.push(`${onde}: slug repetido`);
  marcos.set(m.slug, m);
  if (!(CATEGORIAS_LINHA as readonly string[]).includes(m.categoria)) erros.push(`${onde}: categoria "${m.categoria}" inválida`);
  if (!Number.isInteger(m.ano) || m.ano < -3000 || m.ano > 2100) erros.push(`${onde}: ano ${m.ano} inválido`);
  if (!m.titulo?.trim()) erros.push(`${onde}: sem título`);
  if (!m.resumo?.trim()) erros.push(`${onde}: sem resumo`);
  if (m.noCurso) aulaValida(m.noCurso, onde);
  for (const s of m.verbetes ?? []) if (!verbete(s)) avisos.push(`${onde}: verbete "${s}" não existe`);
  semTravessao(m, onde);
}
for (const m of linha)
  for (const a of m.antecedentes ?? []) {
    const ant = marcos.get(a);
    if (!ant) avisos.push(`marco ${m.slug}: antecedente "${a}" não existe`);
    else if (ant.slug === m.slug) erros.push(`marco ${m.slug}: antecedente de si mesmo`);
    else if (ant.ano > m.ano) erros.push(`marco ${m.slug} (${m.ano}): antecedente ${a} é de ${ant.ano}, depois dele`);
  }

// O linkificador sobre o conteúdo de verdade: os notebooks inteiros, com o tempo medido. É o que a
// página do módulo faz a cada visita.
const indiceReal = montarIndice(glossario);
const { notebookDoModulo } = await import("../content/notebooks/index.ts");
let palavras = 0;
let ligados = 0;
const t0 = performance.now();
for (let m = 0; m <= 3; m++) {
  const nb = notebookDoModulo(m);
  for (const secao of nb?.aulas ?? []) {
    const vistos = new Set<string>();
    for (const b of secao.blocos) {
      const textos = b.tipo === "texto" ? b.paragrafos : b.tipo === "conceito" ? [b.definicao, b.naPratica] : [];
      for (const t of textos) {
        palavras += t.split(/\s+/).length;
        const p = segmentar(t, indiceReal, { vistos });
        assert.equal(p.map((x) => x.texto).join(""), t, "o linkificador mudou o texto");
        ligados += p.filter((x) => x.slug).length;
      }
    }
  }
}
const ms = performance.now() - t0;

if (avisos.length) console.warn(`glossario-check: ${avisos.length} aviso(s)\n  ${avisos.join("\n  ")}`);
assert.deepEqual(erros, [], `glossário ou linha do tempo com problema:\n${erros.join("\n")}`);

console.log(
  `glossario-check: ok (${glossario.length} verbetes em ${categoriasComVerbete().length} categorias, ` +
    `${indiceReal.formas} formas; ${linha.length} marcos; notebooks: ${palavras} palavras, ${ligados} links, ` +
    `${ms.toFixed(1)} ms)`,
);

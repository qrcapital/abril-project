// O linkificador do glossário (07/out/2026): acha, num texto corrido, os termos que têm verbete e
// devolve o texto em pedaços, uns soltos e outros com o slug do verbete. Quem desenha o link é a
// tela (`app/app/_ui/sala/glossario/texto.tsx`); aqui é só lógica pura, sem React e sem import,
// para o `scripts/glossario-check.mts` testar em node puro.
//
// POR QUE UMA ÁRVORE DE PREFIXOS E NÃO UMA REGEX. O glossário vai ter umas 250 entradas, cada uma
// com termo, sigla e apelidos: mil formas, mais ou menos. Uma regex com mil alternativas é testada
// alternativa por alternativa em cada posição do texto, e o notebook de um módulo tem milhares de
// palavras, renderizadas a cada visita (a página do módulo é dinâmica). A árvore só é percorrida no
// começo de palavra e só enquanto o caractere seguinte existir nela: o custo cresce com o tamanho do
// texto, não com o tamanho do glossário.
//
// AS REGRAS DO CASAMENTO
// 1. Formas: o `termo`, a `sigla` e os `apelidos` de cada verbete.
// 2. Sem acento e sem caixa: "Paridade do Poder de Compra" casa com "paridade do poder de compra".
//    A dobra é caractere a caractere (um vira um), então as posições do texto dobrado são as do
//    original e o link sai com o texto exatamente como estava escrito.
// 3. Limite de palavra dos dois lados: "real" não casa dentro de "realidade", nem "ouro" dentro de
//    "padrão-ouro" (hífen entre letras conta como parte da palavra).
// 4. O mais longo vence: "paridade do poder de compra" é tentado antes de "poder de compra". E o
//    trecho do mais longo é consumido mesmo quando ele não vira link (já linkado nesta seção, ou é o
//    próprio verbete da página), para "poder de compra" não acender no meio dele.
// 5. Sigla é forma sem espaço, sem minúscula, com ao menos uma maiúscula e até 6 caracteres ("IR",
//    "PPC", "IPCA", "S&P"). Sigla só casa em caixa alta exata: "IR" acende em "o IR sobre o ganho",
//    nunca em "ir ao banco"; "IRA" nunca em "ira".
// 6. Forma que não é sigla e tem até 2 caracteres é ignorada: seria falso positivo quase sempre.
// 7. Uma vez por verbete em cada trecho que divide o mesmo `vistos` (a tela usa um por seção de
//    aula): só a primeira ocorrência vira link.

/** O mínimo de um verbete que o índice precisa. */
export type VerbeteIndexavel = { slug: string; termo: string; sigla?: string; apelidos?: string[] };

type Forma = { slug: string; forma: string; exata: boolean };
type No = { filhos: Map<string, No>; fins?: Forma[] };
export type IndiceGlossario = { raiz: No; formas: number };

export type Pedaco = { texto: string; slug?: string };

const MARCAS = new RegExp("[\\u0300-\\u036f]", "g");
const LETRA_OU_NUMERO = new RegExp("[\\p{L}\\p{N}]", "u");
const ESPACO = new RegExp("\\s", "u");

/** Dobra um caractere: sem acento, minúsculo, espaço de qualquer tipo vira espaço simples. */
function dobrarChar(c: string): string {
  if (ESPACO.test(c)) return " ";
  const d = c.normalize("NFD").replace(MARCAS, "").toLowerCase();
  // Caractere que dobraria para zero ou para dois (raro: "İ", ligaduras) fica como está, para a
  // posição de cada caractere continuar a mesma do original.
  return d.length === 1 ? d : c;
}

// Os textos do curso repetem o mesmo punhado de caracteres; a dobra de cada um é guardada na
// primeira vez (o `normalize` por caractere é o que pesava na medida do notebook inteiro).
const DOBRA = new Map<string, string>();

/** O texto dobrado, com o MESMO comprimento do original. */
export function dobrar(texto: string): string {
  let out = "";
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    const n = c.charCodeAt(0);
    if (n >= 97 && n <= 122) out += c; // a-z, o caso mais comum, direto
    else {
      let d = DOBRA.get(c);
      if (d === undefined) DOBRA.set(c, (d = dobrarChar(c)));
      out += d;
    }
  }
  return out;
}

const ehPalavra = (c: string | undefined) => {
  if (c === undefined) return false;
  const n = c.charCodeAt(0);
  if (n < 128) return (n >= 97 && n <= 122) || (n >= 65 && n <= 90) || (n >= 48 && n <= 57);
  return LETRA_OU_NUMERO.test(c);
};

/** `i` começa palavra: antes dele não há letra, nem um hífen grudado numa letra ("padrão-|ouro"). */
function comecaPalavra(t: string, i: number): boolean {
  if (i === 0) return true;
  const a = t[i - 1];
  if (ehPalavra(a)) return false;
  if (a === "-" && ehPalavra(t[i - 2])) return false;
  return true;
}

/** `j` (exclusivo) termina palavra: depois dele não há letra, nem hífen seguido de letra. */
function terminaPalavra(t: string, j: number): boolean {
  if (j >= t.length) return true;
  const c = t[j];
  if (ehPalavra(c)) return false;
  if (c === "-" && ehPalavra(t[j + 1])) return false;
  return true;
}

/** A regra 5: forma escrita como sigla. */
export function ehSigla(forma: string): boolean {
  return forma.length <= 6 && !/\s/.test(forma) && !/[a-zà-ÿ]/.test(forma) && /[A-Z]/.test(forma);
}

/** Monta o índice uma vez (a tela guarda em memória de módulo). */
export function montarIndice(verbetes: readonly VerbeteIndexavel[]): IndiceGlossario {
  const raiz: No = { filhos: new Map() };
  let formas = 0;
  for (const v of verbetes) {
    const vistas = new Set<string>();
    for (const bruta of [v.termo, v.sigla, ...(v.apelidos ?? [])]) {
      const forma = (bruta ?? "").trim().replace(/\s+/g, " ");
      if (!forma) continue;
      const exata = ehSigla(forma);
      const chave = dobrar(forma);
      if (!exata && chave.length <= 2) continue; // regra 6
      const marca = `${exata ? "=" : "~"}${exata ? forma : chave}`;
      if (vistas.has(marca)) continue;
      vistas.add(marca);
      let no = raiz;
      for (const c of chave) {
        let f = no.filhos.get(c);
        if (!f) no.filhos.set(c, (f = { filhos: new Map() }));
        no = f;
      }
      (no.fins ??= []).push({ slug: v.slug, forma, exata });
      formas++;
    }
  }
  return { raiz, formas };
}

/** Entre as formas que terminam no mesmo nó, a que vale para este trecho do original. */
function escolher(fins: Forma[], original: string): Forma | null {
  // Sigla escrita exatamente primeiro (ela é a mais específica); depois a forma comum.
  for (const f of fins) if (f.exata && f.forma === original) return f;
  for (const f of fins) if (!f.exata) return f;
  return null;
}

/**
 * Parte o texto em pedaços: os que têm `slug` viram link. `vistos` é compartilhado entre chamadas
 * para valer a regra 7 (e é preenchido aqui); `excluir` são slugs que nunca viram link (o verbete
 * da própria página).
 */
export function segmentar(
  texto: string,
  indice: IndiceGlossario,
  opcoes: { vistos?: Set<string>; excluir?: ReadonlySet<string> } = {},
): Pedaco[] {
  const { vistos, excluir } = opcoes;
  if (!texto || indice.formas === 0) return [{ texto }];
  const t = dobrar(texto);
  const out: Pedaco[] = [];
  let solto = 0; // começo do trecho ainda não emitido
  let i = 0;
  while (i < t.length) {
    if (!comecaPalavra(t, i)) {
      i++;
      continue;
    }
    let no: No | undefined = indice.raiz;
    let melhor: { fim: number; forma: Forma } | null = null;
    for (let j = i; j < t.length; j++) {
      no = no.filhos.get(t[j]);
      if (!no) break;
      if (no.fins && terminaPalavra(t, j + 1)) {
        const f = escolher(no.fins, texto.slice(i, j + 1));
        if (f) melhor = { fim: j + 1, forma: f };
      }
    }
    if (!melhor) {
      i++;
      continue;
    }
    const { slug } = melhor.forma;
    if (!(vistos?.has(slug) || excluir?.has(slug))) {
      if (i > solto) out.push({ texto: texto.slice(solto, i) });
      out.push({ texto: texto.slice(i, melhor.fim), slug });
      vistos?.add(slug);
      solto = melhor.fim;
    }
    // Regra 4: o trecho casado é consumido de qualquer jeito.
    i = melhor.fim;
  }
  if (solto < texto.length) out.push({ texto: texto.slice(solto) });
  return out;
}

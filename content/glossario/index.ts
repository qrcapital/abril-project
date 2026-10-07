import { CATEGORIAS_GLOSSARIO, type Verbete } from "@/lib/glossario";

import { VERBETES_ACESSO_CRIPTO } from "./acesso-e-cripto";
import { VERBETES_ACOES_FUNDOS } from "./acoes-e-fundos";
import { VERBETES_CARTEIRA } from "./carteira-e-comportamento";
import { VERBETES_MACRO_BRASIL } from "./macro-e-brasil";
import { VERBETES_MERCADO } from "./mercado";

// O glossário inteiro, em ordem alfabética do termo (sem acento). Os cinco arquivos de conteúdo,
// um por bloco de categorias, são escritos separados para que a revisão de um não esbarre no outro.
export const GLOSSARIO: Verbete[] = [
  ...VERBETES_MERCADO,
  ...VERBETES_ACOES_FUNDOS,
  ...VERBETES_CARTEIRA,
  ...VERBETES_MACRO_BRASIL,
  ...VERBETES_ACESSO_CRIPTO,
].sort((a, b) =>
  a.termo.localeCompare(b.termo, "pt-BR", { sensitivity: "base" }),
);

const POR_SLUG = new Map(GLOSSARIO.map((v) => [v.slug, v]));

export const verbete = (slug: string): Verbete | null => POR_SLUG.get(slug) ?? null;

export const categoriasComVerbete = () =>
  CATEGORIAS_GLOSSARIO.filter((c) => GLOSSARIO.some((v) => v.categoria === c));

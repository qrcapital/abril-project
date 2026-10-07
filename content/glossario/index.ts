import { CATEGORIAS_GLOSSARIO, type Verbete } from "@/lib/glossario";

import { VERBETES_CONTEXTO } from "./contexto";
import { VERBETES_FINANCAS } from "./financas";

// O glossário inteiro, em ordem alfabética do termo (sem acento). Os dois arquivos de conteúdo são
// escritos separados para que a revisão de um não esbarre no outro.
export const GLOSSARIO: Verbete[] = [...VERBETES_FINANCAS, ...VERBETES_CONTEXTO].sort((a, b) =>
  a.termo.localeCompare(b.termo, "pt-BR", { sensitivity: "base" }),
);

const POR_SLUG = new Map(GLOSSARIO.map((v) => [v.slug, v]));

export const verbete = (slug: string): Verbete | null => POR_SLUG.get(slug) ?? null;

export const categoriasComVerbete = () =>
  CATEGORIAS_GLOSSARIO.filter((c) => GLOSSARIO.some((v) => v.categoria === c));

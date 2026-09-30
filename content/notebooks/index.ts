import type { Notebook } from "@/lib/notebook";

import modulo0 from "./modulo-0";
import modulo1 from "./modulo-1";
import modulo2 from "./modulo-2";
import modulo3 from "./modulo-3";
import modulo4 from "./modulo-4";

// Registro dos notebooks por `ord` do módulo. Notebook novo: criar `modulo-<n>.ts` no molde dos
// outros (uma seção por aula, em `aulas[]`) e acrescentar aqui. Módulo sem entrada mostra o notebook
// "em preparação" na página do módulo, com a seção de cada aula e o aviso de conteúdo em produção.
//
// É o único ponto que sabe de onde o conteúdo vem: quando houver edição pelo admin, esta função
// passa a consultar o banco e as telas não mudam.

const NOTEBOOKS: Record<number, Notebook> = {
  0: modulo0,
  1: modulo1,
  2: modulo2,
  3: modulo3,
  4: modulo4,
};

export function notebookDoModulo(ord: number): Notebook | null {
  return NOTEBOOKS[ord] ?? null;
}

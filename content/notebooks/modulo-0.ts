import type { Notebook } from "@/lib/notebook";

import aula1 from "./modulo-0/aula-1";
import aula2 from "./modulo-0/aula-2";

// Módulo I, Macro e Estratégia Global (ord 0). Até 05/out/2026 este era o notebook do Módulo 0,
// "Comece por aqui", que deixou de existir: as duas aulas do Felippe Hermes passaram a abrir o
// Módulo I, seguidas de duas aulas do Rodolfo Bastos. O arquivo continua `modulo-0.ts` porque o
// nome segue o `ord`, e não o numeral.
//
// Conteúdo definitivo das aulas 1 e 2, escrito em 01/out/2026 a partir das transcrições
// (`transcricoes/modulo-0/`), com dados conferidos nas fontes primárias citadas em cada bloco. Cada
// aula mora no próprio arquivo em `modulo-0/`, para que a revisão de uma não esbarre na outra. As
// aulas 3 e 4 (Rodolfo Bastos) ainda não têm seção e aparecem no notebook como em produção.

const notebook: Notebook = {
  modulo: 0,
  titulo: "Macro e Estratégia Global",
  subtitulo:
    "O argumento do módulo, aula por aula: o risco de concentrar tudo numa moeda só, o que trinta anos de Brasil ensinam sobre ele e a estratégia para olhar para fora.",
  demo: false,
  aulas: [aula1, aula2],
};

export default notebook;

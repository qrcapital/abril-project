import type { Notebook } from "@/lib/notebook";

import aula1 from "./modulo-0/aula-1";
import aula2 from "./modulo-0/aula-2";

// Módulo 0, "Comece por aqui". Conteúdo definitivo, escrito em 01/out/2026 a partir das
// transcrições das duas aulas de abertura (`transcricoes/modulo-0/`), com dados conferidos nas
// fontes primárias citadas em cada bloco. Cada aula mora no próprio arquivo em `modulo-0/`, para
// que a revisão de uma não esbarre na outra.

const notebook: Notebook = {
  modulo: 0,
  titulo: "Por que olhar para fora",
  subtitulo:
    "O argumento da formação, aula por aula: o risco de concentrar tudo numa moeda só e o que trinta anos de Brasil ensinam sobre ele.",
  demo: false,
  aulas: [aula1, aula2],
};

export default notebook;

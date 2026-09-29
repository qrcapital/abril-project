// Quem é cada docente, para o cartão curto da aula, da página do módulo e da trilha.
//
// O banco guarda só o NOME (`modules.docente`, editável no admin); foto e credencial são da
// campanha e já estão publicadas na LP (`app/_lp/body.html`, seção de professores) e na
// pré-lista (`app/_pre-lista/Tela.tsx`, `PROFESSORES`). As credenciais de Tony Volpon e Rodolfo
// Bastos são as da pré-lista, palavra por palavra, porque foram as aprovadas por último. As fotos
// são as coloridas da LP (a classe `col`), não as em duotone: num círculo de 48px o duotone vira
// mancha.
//
// Docente fora deste mapa (nome trocado no admin, módulo novo) aparece só com o nome, sem foto:
// inventar retrato ou credencial seria pior que não mostrar.

export type Docente = { nome: string; credencial: string | null; foto: string | null };

const CONHECIDOS: Record<string, Omit<Docente, "nome">> = {
  "tony volpon": {
    credencial: "Ex-diretor do Banco Central",
    foto: "/lp/9fe8de2f-df8d-4f74-948e-34ff295753f9.webp",
  },
  "rodolfo bastos": {
    credencial: "XP e Oyster",
    foto: "/lp/8eb077d2-3fb0-4c55-9a78-6eddc936cdb5.webp",
  },
  "luiz fernando roxo": {
    credencial: "Especialista em opções, 25 anos de mercado",
    foto: "/lp/dbd5bf7c-5ffc-4661-bcba-19384a35abd4.webp",
  },
  "alexandre ywata": {
    credencial: "Ex-VP da Caixa, CRO da QR Asset",
    foto: "/lp/7149d6ad-738e-4ac6-a077-3b5b98ba935f.webp",
  },
};

/** O docente pelo nome gravado no módulo. `null` quando o módulo não tem docente. */
export function docente(nome: string | null | undefined): Docente | null {
  const n = (nome ?? "").trim();
  if (!n) return null;
  const achado = CONHECIDOS[n.toLowerCase().replace(/\s+/g, " ")];
  return { nome: n, credencial: achado?.credencial ?? null, foto: achado?.foto ?? null };
}

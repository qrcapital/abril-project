// Regra de senha do produto, compartilhada pelas telas e pelas server actions.
//
// Vive fora dos arquivos de action porque módulo com "use server" só pode exportar função
// async: uma constante exportada de lá quebra o build.

/**
 * Mínimo de caracteres. Subiu de 6 para 8 em 28/jul/2026, por decisão do Pedro na mesma
 * sessão. Acima do mínimo do Supabase, que é 6 e é o que a plataforma garante sozinha.
 */
export const MINIMO_SENHA = 8;

// `\p{Lu}`/`\p{Ll}` em vez de [A-Z]/[a-z] para acento contar: "Ástrid1" tem maiúscula de
// verdade, e com faixa ASCII seria recusada sem o aluno entender o motivo.
const TEM_MAIUSCULA = /\p{Lu}/u;
const TEM_MINUSCULA = /\p{Ll}/u;
const TEM_NUMERO = /[0-9]/;

/**
 * As exigências como DADO, e não como prosa, decididas em 28/jul/2026: 8 caracteres, com
 * maiúscula, minúscula e número.
 *
 * Vira lista em 29/jul porque três consumidores precisam da mesma regra em formatos
 * diferentes: `validarSenha` quer a primeira que falha, `REGRA_SENHA` quer a frase, e o
 * indicador progressivo das telas de senha quer marcar item por item enquanto a pessoa
 * digita. Com a regra escrita em três lugares, elas divergiriam no primeiro ajuste.
 *
 * A ordem é a de checagem: tamanho primeiro, depois as classes, do mais provável ao menos.
 * `curto` é o rótulo do indicador; `erro` é a queixa completa, que vai na caixa de erro.
 */
export const EXIGENCIAS: {
  curto: string;
  erro: string;
  ok: (senha: string) => boolean;
}[] = [
  {
    curto: `${MINIMO_SENHA} caracteres`,
    erro: `A senha precisa de pelo menos ${MINIMO_SENHA} caracteres.`,
    ok: (s) => s.length >= MINIMO_SENHA,
  },
  {
    curto: "uma letra maiúscula",
    erro: "A senha precisa de pelo menos uma letra maiúscula.",
    ok: (s) => TEM_MAIUSCULA.test(s),
  },
  {
    curto: "uma letra minúscula",
    erro: "A senha precisa de pelo menos uma letra minúscula.",
    ok: (s) => TEM_MINUSCULA.test(s),
  },
  {
    curto: "um número",
    erro: "A senha precisa de pelo menos um número.",
    ok: (s) => TEM_NUMERO.test(s),
  },
];

/**
 * Frase da regra, montada a partir da lista. Usada na tela para o aluno saber a regra ANTES
 * de tentar, em vez de descobrir por rejeição.
 */
export const REGRA_SENHA = `pelo menos ${EXIGENCIAS[0].curto}, com ${EXIGENCIAS.slice(1)
  .map((e) => e.curto)
  .join(", ")
  .replace(/, ([^,]*)$/, " e $1")}`;

/**
 * Devolve a mensagem do primeiro problema encontrado, ou `null` se a senha serve.
 *
 * Mensagem específica por exigência, e não uma lista genérica, para o aluno saber o que
 * corrigir.
 *
 * Isto é validação de conveniência, nos dois lados. A recusa que vale é a política do
 * projeto no painel do Supabase (Authentication), que barra também quem chame a API por
 * fora do nosso código. Ver `docs/PENDENCIAS-LP.md`.
 */
export function validarSenha(senha: string): string | null {
  return EXIGENCIAS.find((e) => !e.ok(senha))?.erro ?? null;
}

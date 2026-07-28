// Regra de senha do produto, compartilhada pelas telas e pelas server actions.
//
// Vive fora dos arquivos de action porque módulo com "use server" só pode exportar função
// async: uma constante exportada de lá quebra o build.

export const MINIMO_SENHA = 6;

/**
 * Exigências, decididas em 28/jul/2026: 6 caracteres, com maiúscula, minúscula e número.
 * A frase é usada na tela, para o aluno saber a regra ANTES de tentar, em vez de descobrir
 * por rejeição.
 */
export const REGRA_SENHA =
  `pelo menos ${MINIMO_SENHA} caracteres, com uma letra maiúscula, uma minúscula e um número`;

// `\p{Lu}`/`\p{Ll}` em vez de [A-Z]/[a-z] para acento contar: "Ástrid1" tem maiúscula de
// verdade, e com faixa ASCII seria recusada sem o aluno entender o motivo.
const TEM_MAIUSCULA = /\p{Lu}/u;
const TEM_MINUSCULA = /\p{Ll}/u;
const TEM_NUMERO = /[0-9]/;

/**
 * Devolve a mensagem do primeiro problema encontrado, ou `null` se a senha serve.
 *
 * Mensagem específica por exigência, e não uma lista genérica, para o aluno saber o que
 * corrigir. A ordem é do mais provável para o menos.
 *
 * Isto é validação de conveniência, nos dois lados. A recusa que vale é a política do
 * projeto no painel do Supabase (Authentication), que barra também quem chame a API por
 * fora do nosso código. Ver `docs/PENDENCIAS-LP.md`.
 */
export function validarSenha(senha: string): string | null {
  if (senha.length < MINIMO_SENHA)
    return `A senha precisa de pelo menos ${MINIMO_SENHA} caracteres.`;
  if (!TEM_MAIUSCULA.test(senha)) return "A senha precisa de pelo menos uma letra maiúscula.";
  if (!TEM_MINUSCULA.test(senha)) return "A senha precisa de pelo menos uma letra minúscula.";
  if (!TEM_NUMERO.test(senha)) return "A senha precisa de pelo menos um número.";
  return null;
}

// Os avisos que uma política de liberação merece (decisão do Pedro em 17/ago: avisar, não
// travar). DOIS leitores: a tela de Liberação mostra os textos, e o painel mostra a contagem
// no card de saúde. Uma conta só, pela mesma razão da `estadoDaMatricula`: com uma cópia em
// cada tela, o painel diria "sem avisos" para uma política que a tela de Liberação marca, e
// isso não aparece em build nem em lint.
//
// Puro e sem IO; `regras[i]` é a regra do módulo cujo ord é `ords[i]`.

import { rotuloModulo } from "./curso";
import { DIAS_GARANTIA, violaGarantia, type Regra } from "./liberacao";

/**
 * Os módulos cujas aulas contam para o certificado (I a IV; o Módulo 0 é boas-vindas). Morava em
 * `lib/questoes.ts` como "os módulos que entram na prova", e ficou aqui quando a prova saiu do curso
 * (30/set/2026): o aviso abaixo continua valendo, porque o gate agora é o do certificado.
 */
export const ORDS_AVALIADOS = [1, 2, 3, 4];

export function avisosDaPolitica(
  regras: readonly Regra[],
  ords: readonly number[],
): string[] {
  const avisos: string[] = [];
  if (violaGarantia(regras))
    avisos.push(
      `Com esta política o curso fica concluível dentro da garantia de ${DIAS_GARANTIA} dias: ` +
        "um aluno pode terminar, emitir o certificado e pedir reembolso no prazo de arrependimento.",
    );
  const avaliadosEmBreve = ords
    .filter((ord, i) => ORDS_AVALIADOS.includes(ord) && regras[i]?.tipo === "em_breve")
    .map((ord) => rotuloModulo(ord));
  if (avaliadosEmBreve.length)
    avisos.push(
      `${avaliadosEmBreve.join(", ")} em breve: as aulas desse módulo contam para o certificado, e ` +
        "ninguém conclui a formação enquanto ele não abrir.",
    );
  return avisos;
}

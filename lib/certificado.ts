// O certificado: geração e leitura do código, mais os dados fixos da formação. **Puro, sem IO.**
//
// Até 31/jul/2026 este arquivo guardava UM certificado escrito à mão, com código `EI-2026-4817` e o
// nome "Pedro Teixeira". Dois alunos aprovados receberiam o mesmo código, e a página pública de
// verificação mostrava o nome de outra pessoa para qualquer consulta. A emissão de verdade vive em
// `lib/certificados.ts`, que fala com o banco; aqui ficou o que é regra.
//
// **Sem nenhum import de Node**, e isso é restrição e não estilo: o `CertificadoClient` é componente
// de CLIENTE e importa daqui, então um `node:crypto` neste arquivo iria para o bundle do navegador.
// O sorteio usa a Web Crypto, que existe nos dois lados.

export const CURSO = "Estratégia Internacional";
export const HORAS = 30;

/**
 * O ALFABETO DO CÓDIGO, e cada exclusão tem motivo.
 *
 * Fora: `I`, `O`, `L`, `U`, `0` e `1`. São os símbolos que as pessoas confundem lendo em voz alta ou
 * copiando de um PDF (`I`/`1`/`L`, `O`/`0`; o `U` sai porque vira `V` em maiúscula manuscrita). Este
 * código não é só clicado: ele é **ditado por telefone e digitado à mão** por quem confere o
 * certificado de um candidato, e um par ambíguo aqui vira "código inválido" para um certificado que
 * existe.
 *
 * Sobram 30 símbolos. Com 8 posições dão 30^8 = 656 bilhões de combinações, o que faz de colisão um
 * evento que praticamente não acontece numa turma de milhares — e mesmo assim a emissão tenta de novo
 * quando o banco recusa, porque "praticamente" não é "nunca" (ver `lib/certificados.ts`).
 */
export const ALFABETO = "ABCDEFGHJKMNPQRSTVWXYZ23456789";

/** Quantos símbolos sorteados o código tem, sem contar o prefixo e os hífens. */
export const SIMBOLOS = 8;

const PREFIXO = "EI";

/**
 * Um índice do alfabeto, sorteado **sem viés**.
 *
 * O descarte acima de `teto` é o que tira o viés de módulo: 256 não é múltiplo de 30, então
 * `byte % 30` faria os 16 primeiros símbolos saírem com mais frequência que os outros 14. Num
 * identificador que serve de prova pública, distribuição torta é o começo de um código adivinhável.
 */
function sorteioSemVies(limite: number): number {
  const teto = Math.floor(256 / limite) * limite;
  const byte = new Uint8Array(1);
  do {
    crypto.getRandomValues(byte);
  } while (byte[0] >= teto);
  return byte[0] % limite;
}

/**
 * Um código novo, no formato `EI-XXXX-XXXX`.
 *
 * **Aleatório e não sequencial, por decisão do Pedro em 31/jul/2026.** Código sequencial entrega duas
 * coisas de graça a quem recebe o certificado: quantos alunos já concluíram, e a posição daquele aluno
 * na fila. E deixa o próximo código adivinhável, o que num verificador público significa poder
 * enumerar quem se formou.
 *
 * O `sorteia` é injetável para o check exercitar a distribuição com um gerador determinístico. Em
 * produção ninguém passa esse argumento.
 */
export function gerarCodigo(sorteia: (limite: number) => number = sorteioSemVies): string {
  let corpo = "";
  for (let i = 0; i < SIMBOLOS; i++) corpo += ALFABETO[sorteia(ALFABETO.length)];
  return `${PREFIXO}-${corpo.slice(0, 4)}-${corpo.slice(4)}`;
}

/**
 * Normaliza o que a pessoa digitou na verificação: caixa alta, sem espaço nem hífen, sem o prefixo, e
 * remonta no formato canônico.
 *
 * Existe porque o código chega **digitado de um PDF**, e aí vem com espaço no lugar do hífen, em
 * minúsculas, ou com o `EI` colado. Recusar por causa de pontuação seria dizer "certificado inválido"
 * para um certificado válido, que é o pior erro que esta tela pode cometer.
 *
 * Devolve `null` quando não sobra um código do tamanho certo, ou quando aparece símbolo que nós nunca
 * emitimos: aí é entrada errada de verdade, e a consulta ao banco nem precisa acontecer.
 */
export function normalizarCodigo(entrada: string): string | null {
  const limpo = (entrada || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const corpo = limpo.startsWith(PREFIXO) ? limpo.slice(PREFIXO.length) : limpo;
  if (corpo.length !== SIMBOLOS) return null;
  if ([...corpo].some((c) => !ALFABETO.includes(c))) return null;
  return `${PREFIXO}-${corpo.slice(0, 4)}-${corpo.slice(4)}`;
}

/** URL de "adicionar certificação" ao perfil do LinkedIn. */
export function linkedinAddUrl(origin: string, codigo: string, emissao: Date): string {
  const p = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: CURSO,
    organizationName: "BlockTrends",
    issueYear: String(emissao.getFullYear()),
    issueMonth: String(emissao.getMonth() + 1),
    certId: codigo,
    certUrl: `${origin}/verificar/${codigo}`,
  });
  return `https://www.linkedin.com/profile/add?${p.toString()}`;
}

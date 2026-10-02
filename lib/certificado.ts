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
/** Carga horária impressa no certificado. A LP vende "30 horas" / "30h"; mudar um sem o outro é
 *  propaganda que não bate com o documento. */
export const HORAS = 30;

/**
 * Domínio IMPRESSO no certificado e codificado no QR. Constante, e não `NEXT_PUBLIC_SITE_URL`: o
 * PDF sobrevive ao ambiente que o gerou, e um certificado baixado em homologação com o QR apontando
 * para um preview da Netlify seria um papel que não se verifica em lugar nenhum.
 */
export const DOMINIO_VERIFICACAO = "blocktrends.abril.com.br";

/** O endereço público de verificação, sem protocolo quando é para ler, com protocolo para o QR. */
export function urlVerificacao(codigo: string, { protocolo = true } = {}): string {
  return `${protocolo ? "https://" : ""}${DOMINIO_VERIFICACAO}/verificar/${codigo}`;
}

/**
 * O texto do certificado, num lugar só, porque três superfícies o repetem: a folha (tela, PDF e
 * impressão), a página pública de verificação e o e-mail. Divergência entre o papel e a verificação
 * é exatamente o que um RH desconfiado procura.
 *
 * Diz o critério real ("concluiu todas as aulas"), e não "foi aprovado": o curso não tem prova desde
 * 30/set/2026. E diz "curso livre", que é o que os Termos (cláusulas 1.2 e 6.2) prometem.
 */
export const TEXTO = {
  titulo: "Certificado de conclusão",
  abertura: "Certificamos que",
  conclusao: "concluiu todas as aulas da formação",
  descricao: `curso livre de ${HORAS} horas sobre investimento no exterior, oferecido pela VEJA Negócios em parceria com o BlockTrends.`,
  aviso:
    "Curso livre, de caráter educacional. Não constitui certificação profissional, registro ou habilitação para o exercício de atividade regulamentada, nem recomendação de investimento.",
} as const;

/** Quem emite, como está nos Termos de Uso (preâmbulo, "CONTRATADAS"). */
export const EMISSORES = [
  { razao: "Abril Comunicações S.A.", cnpj: "44.597.052/0001-62" },
  { razao: "BlockTrends Comunicações e Sistemas Ltda.", cnpj: "26.195.884/0001-70" },
] as const;

export type Assinatura = {
  /** Nome de quem assina. Vazio, a folha mostra só cargo e organização, sem inventar ninguém. */
  nome: string;
  /** Cargo, sem a organização (ela vem do campo próprio). Vazio, some. */
  cargo: string;
  organizacao: string;
};

/**
 * As assinaturas do certificado.
 *
 * TODO(dono): preencher `nome` e `cargo` de quem assina por cada casa, com o aval do jurídico da
 * Abril (PRD §8: o BlockTrends assina a técnica, a VEJA Negócios a chancela institucional). Até lá a
 * linha de assinatura sai em branco com o nome da organização embaixo, que é verdadeiro; nome ou
 * rubrica inventados num documento verificável não são.
 */
export const ASSINATURAS: readonly Assinatura[] = [
  { nome: "", cargo: "", organizacao: "VEJA Negócios" },
  { nome: "", cargo: "", organizacao: "BlockTrends" },
];

/**
 * Código da PRÉVIA do admin. Tem `0`, que o `ALFABETO` não emite, então nunca coincide com um
 * certificado real e a verificação pública responde "não encontrado" se alguém digitá-lo.
 */
export const CODIGO_EXEMPLO = "EI-0000-0000";

const DATA_SP = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * "1º de outubro de 2026", no fuso de São Paulo.
 *
 * O fuso é explícito porque o servidor roda em UTC: quem conclui às 22h de 30 de setembro em
 * Brasília já está em 1º de outubro para o servidor, e o certificado sairia com o dia seguinte. O
 * ordinal no dia 1 é a convenção da língua para datas ("1º de maio"). Vazio para data inválida.
 */
export function dataPorExtenso(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const partes = DATA_SP.formatToParts(d);
  const v = (t: Intl.DateTimeFormatPartTypes) => partes.find((p) => p.type === t)?.value ?? "";
  const dia = v("day") === "1" ? "1º" : v("day");
  return `${dia} de ${v("month")} de ${v("year")}`;
}

/**
 * Corpo do nome na folha, em milímetros de A4. Nome curto em 14 mm; nome longo desce de degrau em
 * degrau para caber numa linha, e só o muito longo quebra em duas (equilibradas pelo CSS). Degraus,
 * e não uma conta contínua, para dois alunos com nomes parecidos receberem a mesma peça.
 */
export function corpoDoNome(nome: string): number {
  const n = [...nome.trim()].length;
  if (n <= 26) return 14;
  if (n <= 32) return 12;
  if (n <= 40) return 10;
  return 8.5;
}

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

/**
 * A REGRA DO CERTIFICADO desde 30/set/2026: todas as aulas que contam (`lessons.conta_no_gate`)
 * concluídas. O curso deixou de ter prova, e a conclusão virou a única condição.
 *
 * Lista vazia NÃO conclui. `[].every()` é `true`, e um admin que desmarcasse todo `conta_no_gate`
 * pelo painel emitiria certificado para a base inteira no primeiro clique de qualquer aluno.
 *
 * Pura, para o `check:certificado` exercitar sem banco: quem busca as duas listas é
 * `lib/certificados.ts`.
 */
export function concluiuTodasAsAulas(queContam: readonly string[], concluidas: ReadonlySet<string>): boolean {
  return queContam.length > 0 && queContam.every((id) => concluidas.has(id));
}

/** URL de "adicionar certificação" ao perfil do LinkedIn. */
export function linkedinAddUrl(origin: string, codigo: string, emissao: Date): string {
  // Mês e ano no fuso de São Paulo, como a data impressa na folha. Com `getMonth()` o servidor (UTC)
  // e o navegador discordariam nas últimas horas de cada mês, e o link mudaria na hidratação.
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "numeric",
  }).formatToParts(emissao);
  const v = (t: Intl.DateTimeFormatPartTypes) => partes.find((p) => p.type === t)?.value ?? "";
  const p = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: CURSO,
    organizationName: "BlockTrends",
    issueYear: v("year"),
    issueMonth: v("month"),
    certId: codigo,
    certUrl: `${origin}/verificar/${codigo}`,
  });
  return `https://www.linkedin.com/profile/add?${p.toString()}`;
}

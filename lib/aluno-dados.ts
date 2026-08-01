/**
 * Validação dos dados cadastrais do aluno editáveis pelo admin (PLANO-ADMIN §4.3).
 *
 * Puro e sem IO, pela regra do `AGENTS.md`: quem importa `lib/supabase/*` puxa `next/headers` e não
 * roda no `npm run check`. A rota faz o IO e chama daqui.
 *
 * O que estas funções guardam é o que passa por build, lint e revisão sem reclamar e só aparece
 * depois: nome virando string vazia, e-mail com espaço no meio, telefone que perdeu um dígito.
 */

/** Teto de tamanho. Não é regra de negócio, é defesa contra colar um documento inteiro no campo. */
const MAX_NOME = 120;
const MAX_TELEFONE = 40;

/**
 * Espaços colapsados e pontas aparadas. Nome copiado de planilha vem com espaço duplo e com
 * ` ` (espaço não separável), que passa despercebido na tela e quebra a busca por nome.
 */
export function normalizarNome(bruto: string): string {
  return bruto.replace(/\s+/g, " ").trim().slice(0, MAX_NOME);
}

/** E-mail sempre minúsculo e sem espaço nas pontas, que é como o Supabase guarda. */
export function normalizarEmail(bruto: string): string {
  return bruto.trim().toLowerCase();
}

export function normalizarTelefone(bruto: string): string {
  return bruto.replace(/\s+/g, " ").trim().slice(0, MAX_TELEFONE);
}

/**
 * E-mail aceitável. Deliberadamente FROUXA: a regex "completa" de e-mail é famosa por recusar
 * endereço válido, e quem paga o preço é o aluno que não recebe mais nada. Aqui o objetivo é pegar
 * erro de digitação grosseiro (espaço no meio, sem @, sem ponto no domínio), não decidir o que é um
 * endereço legal. Quem decide de verdade é o Supabase, na gravação, e a rota mostra o erro dele.
 */
export function emailAceitavel(email: string): boolean {
  if (!email || /\s/.test(email)) return false;
  const partes = email.split("@");
  if (partes.length !== 2) return false;
  const [local, dominio] = partes;
  if (!local || !dominio) return false;
  // Domínio precisa de um ponto com algo dos dois lados, e não pode terminar em ponto.
  return /^[^.]+(\.[^.]+)+$/.test(dominio);
}

/**
 * Telefone opcional. Vazio é APAGAR, não erro: o campo já nasce vazio na maioria das contas, e não
 * ter jeito de limpar um telefone errado seria pior que não ter o campo.
 *
 * Quando vem preenchido, exige 8 dígitos, que é o menor telefone fixo do Brasil sem DDD. Não valido
 * formato nem DDD: o curso vende para brasileiro fora do país, e um número estrangeiro colado aqui
 * é caso de suporte, não erro de digitação.
 */
export function telefoneAceitavel(telefone: string): boolean {
  if (telefone === "") return true;
  return (telefone.match(/\d/g) ?? []).length >= 8;
}

export type DadosAluno = { nome: string; email: string; telefone: string };
export type Validacao = { ok: true; dados: DadosAluno } | { ok: false; motivo: string };

/**
 * Normaliza e valida os três campos de uma vez, devolvendo o motivo pronto para a tela.
 *
 * **Nome é obrigatório** por decisão do Pedro de 31/jul/2026: ele vira entrada obrigatória no
 * cadastro. Aceitar vazio aqui recriaria pelo admin o problema que a decisão resolve, que é o
 * "Faltou pouco, ." e o ", sua matrícula está confirmada" das telas e dos e-mails.
 */
export function validarDados(bruto: DadosAluno): Validacao {
  const dados = {
    nome: normalizarNome(bruto.nome),
    email: normalizarEmail(bruto.email),
    telefone: normalizarTelefone(bruto.telefone),
  };

  if (!dados.nome) return { ok: false, motivo: "O nome não pode ficar vazio." };
  if (!emailAceitavel(dados.email)) return { ok: false, motivo: "Esse e-mail não parece válido." };
  if (!telefoneAceitavel(dados.telefone))
    return { ok: false, motivo: "O telefone precisa ter ao menos 8 dígitos, ou ficar vazio." };

  return { ok: true, dados };
}

/**
 * O que MUDOU, para o rastro da auditoria e para a tela não gravar à toa.
 *
 * O rastro guarda de/para de cada campo alterado, e não o objeto inteiro: meses depois a pergunta é
 * "quem trocou o e-mail desta conta, e de qual para qual", e um retrato dos três campos a cada
 * clique não responde isso melhor, só ocupa mais espaço.
 */
export function diferencas(antes: DadosAluno, depois: DadosAluno): Record<string, [string, string]> {
  const saida: Record<string, [string, string]> = {};
  for (const campo of ["nome", "email", "telefone"] as const) {
    if (antes[campo] !== depois[campo]) saida[campo] = [antes[campo], depois[campo]];
  }
  return saida;
}

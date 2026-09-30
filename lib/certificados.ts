// Emissão e leitura do certificado no banco. O IO que o `lib/certificado.ts` não pode ter, porque
// aquele arquivo é importado por componente de cliente.
//
// O cliente do Supabase entra por parâmetro e não há `server-only`, pelo mesmo motivo do
// `lib/email.ts`: quem chama decide de onde vêm as credenciais, e são dois chamadores com sessões
// diferentes (a action do aluno que marca aula e a rota do admin que conclui um módulo por ele).
//
// A EMISSÃO MUDOU DE GATILHO EM 30/SET/2026. Até ali o certificado saía na aprovação da prova final;
// o curso deixou de ter prova (decisão do dono) e ele passou a sair quando o aluno conclui todas as
// aulas que contam. O código, o formato e a idempotência são os mesmos: certificado já emitido
// continua valendo, com o mesmo código.

import type { SupabaseClient } from "@supabase/supabase-js";

import { concluiuTodasAsAulas, gerarCodigo } from "./certificado.ts";
import { enviarEmail } from "./email.ts";

export type Certificado = { codigo: string; emitidoEm: string };

/** O certificado, e se ele nasceu nesta chamada. `novo` decide quem manda o e-mail. */
export type Emissao = Certificado & { novo: boolean };

/** Quantas vezes tentar quando o código sorteado já existe. Ver o comentário de `emitir`. */
const TENTATIVAS = 5;

/**
 * Emite o certificado do aluno, ou devolve o que já existe. **Idempotente.**
 *
 * TRÊS COISAS ACONTECEM AQUI, e a ordem importa:
 *
 * 1. **Lê antes de escrever**, para o caminho comum (aluno já aprovado que volta) não gastar sorteio
 *    nem tentativa de gravação.
 * 2. **Deixa o banco decidir a corrida.** O `on conflict do nothing` sobre `certificates_user_unico`
 *    (migration `0012`) é o que faz duas rotas de aprovação simultâneas produzirem um certificado só.
 *    Conferir "já existe?" e depois inserir tem uma janela entre as duas coisas, e é justamente nela
 *    que a segunda rota entra.
 * 3. **Tenta de novo quando o CÓDIGO colide.** Com 656 bilhões de combinações isso praticamente não
 *    acontece, mas "praticamente" não é "nunca", e o custo de estar preparado é um laço de cinco
 *    voltas. Sem ele, uma colisão viraria "não deu para emitir seu certificado" para um aluno que
 *    passou na prova.
 *
 * Devolve `null` só quando o banco recusou por outro motivo, e aí o chamador decide: nenhum deles
 * derruba o fluxo, porque perder a marcação da aula por causa do certificado seria pior.
 *
 * `novo` só é `true` para quem de fato inseriu a linha. Quem perdeu a corrida recebe o certificado do
 * vencedor com `novo: false`, e é isso que faz o e-mail sair uma vez só.
 */
export async function emitirCertificado(
  db: SupabaseClient,
  userId: string,
): Promise<Emissao | null> {
  const existente = await lerCertificado(db, userId);
  if (existente) return { ...existente, novo: false };

  for (let tentativa = 0; tentativa < TENTATIVAS; tentativa++) {
    const codigo = gerarCodigo();
    const { data, error } = await db
      .from("certificates")
      .insert({ user_id: userId, codigo })
      .select("codigo, issued_at")
      .maybeSingle();

    if (data) return { codigo: data.codigo as string, emitidoEm: data.issued_at as string, novo: true };

    // 23505 é violação de unique. Pode ser o `user_id` (outra rota emitiu primeiro: o certificado
    // dele já existe e a leitura resolve) ou o `codigo` (sorteio repetido: tenta outro).
    if (error?.code === "23505") {
      const jaExiste = await lerCertificado(db, userId);
      if (jaExiste) return { ...jaExiste, novo: false };
      continue;
    }

    console.error(`[certificado] falha ao emitir para ${userId}:`, error?.message);
    return null;
  }

  console.error(`[certificado] ${TENTATIVAS} colisoes de codigo seguidas para ${userId}`);
  return null;
}

/** O certificado do aluno, se já foi emitido. */
export async function lerCertificado(
  db: SupabaseClient,
  userId: string,
): Promise<Certificado | null> {
  const { data, error } = await db
    .from("certificates")
    .select("codigo, issued_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error(`[certificado] falha ao ler o de ${userId}:`, error.message);
    return null;
  }
  return data ? { codigo: data.codigo as string, emitidoEm: data.issued_at as string } : null;
}

/**
 * Todos os certificados emitidos, por aluno (`user_id` → código). Para as telas do admin que listam
 * alunos: a lista e o CSV. Lê em páginas de 1000 porque o PostgREST corta ali sem avisar, e filtrar
 * por uma lista de ids estouraria o tamanho da URL com a base grande.
 */
export async function codigosPorAluno(db: SupabaseClient): Promise<Map<string, string>> {
  const PASSO = 1000;
  const out = new Map<string, string>();
  for (let de = 0; ; de += PASSO) {
    const { data, error } = await db
      .from("certificates")
      .select("user_id, codigo")
      .order("issued_at")
      .range(de, de + PASSO - 1);
    if (error) {
      console.error("[certificado] falha ao listar:", error.message);
      return out;
    }
    for (const c of data ?? []) out.set(c.user_id as string, c.codigo as string);
    if ((data?.length ?? 0) < PASSO) return out;
  }
}

/**
 * O aluno concluiu todas as aulas que contam? Lê do banco, e não do currículo da requisição, porque
 * a rota do admin também chama e ela não tem sessão de aluno para montar um.
 */
export async function concluiuAFormacao(db: SupabaseClient, userId: string): Promise<boolean> {
  const [{ data: aulas, error: e1 }, { data: feitas, error: e2 }] = await Promise.all([
    db.from("lessons").select("id").eq("conta_no_gate", true),
    db.from("progress").select("lesson_id").eq("user_id", userId).eq("status", "completed"),
  ]);
  if (e1 || e2) {
    console.error(`[certificado] falha ao conferir a conclusao de ${userId}:`, (e1 ?? e2)?.message);
    return false;
  }
  return concluiuTodasAsAulas(
    (aulas ?? []).map((a) => a.id as string),
    new Set((feitas ?? []).map((p) => p.lesson_id as string)),
  );
}

/**
 * Emite o certificado SE o aluno concluiu todas as aulas que contam, e avisa por e-mail na primeira
 * vez. É o gatilho do certificado desde 30/set/2026, chamado depois de toda marcação de conclusão:
 * pela action `marcarAula` (o aluno) e pela rota de progresso do admin (o suporte concluindo um
 * módulo por ele). Os dois caminhos passam por aqui para a regra ser uma só.
 *
 * Idempotente e não lança. Chamar de novo depois da emissão só relê o certificado, e o e-mail não
 * sai de novo porque ele depende de `novo`, que só a inserção vencedora recebe (ver
 * `emitirCertificado`). Desmarcar uma aula depois NÃO revoga o certificado: a conquista já foi
 * registrada e publicada no verificador, e tirá-la por um clique de desfazer seria pior que o caso
 * raro de alguém concluir, emitir e desmarcar.
 *
 * `userId` vem do servidor (a sessão na action, o parâmetro validado na rota do admin), nunca do
 * navegador: com a service role, confiar num id de fora emitiria certificado para qualquer conta.
 */
export async function emitirSeConcluiu(db: SupabaseClient, userId: string): Promise<Certificado | null> {
  try {
    if (!(await concluiuAFormacao(db, userId))) return null;
    const cert = await emitirCertificado(db, userId);
    if (!cert?.novo) return cert;

    // O destinatário vem do Auth pela service role, e não de quem chamou: a rota do admin conclui
    // pelo aluno, e o e-mail é do aluno. Falha aqui não desfaz a emissão, só fica sem aviso (e o
    // certificado aparece na área dele do mesmo jeito).
    const { data } = await db.auth.admin.getUserById(userId);
    const aluno = data?.user;
    if (aluno?.email) {
      const nome = ((aluno.user_metadata?.nome as string | undefined) ?? "").trim().split(/\s+/)[0] ?? "";
      const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
      await enviarEmail(db, {
        chave: "certificado",
        para: aluno.email,
        userId,
        dados: { nome, codigo: cert.codigo, link: `${site}/app/certificado` },
      });
    }
    return cert;
  } catch (e) {
    // Nunca derruba quem chamou: a aula já foi marcada, e o certificado tem o resgate na tela dele.
    console.error(`[certificado] falha na emissao por conclusao de ${userId}:`, e instanceof Error ? e.message : e);
    return null;
  }
}

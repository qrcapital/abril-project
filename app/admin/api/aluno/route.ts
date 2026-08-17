import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { diferencas, validarDados, type DadosAluno } from "@/lib/aluno-dados";
import { auditar } from "@/lib/auditoria";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Edição dos dados do aluno e do progresso por módulo (PLANO-ADMIN §4.3), pedida pelo Pedro em
 * 31/jul/2026.
 *
 * ┌─ LEIA ISTO ANTES DE MEXER ─────────────────────────────────────────────────────────────┐
 * │ A CHECAGEM DE PAPEL AQUI DENTRO É O ÚNICO GUARDA DESTA ROTA.                            │
 * │                                                                                         │
 * │ Route handler não passa por layout. Sem o `papel !== "admin"` abaixo, qualquer pessoa    │
 * │ logada troca o e-mail de QUALQUER conta dando POST neste endereço, e trocar o e-mail é   │
 * │ trocar o login: é tomada de conta, não edição de cadastro.                               │
 * └─────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─ O NOME MORA EM DOIS LUGARES, E OS DOIS PRECISAM SER ESCRITOS ─────────────────────────┐
 * │ `profiles.nome`      → lido pelo admin E pela verificação PÚBLICA do certificado         │
 * │                        (`verify_certificate`, migration 0001).                           │
 * │ `user_metadata.nome` → lido pelas telas do aluno (`usuario-template.ts`) e pelos e-mails │
 * │                        de resultado (`prova.ts`, `prova-expiradas.ts`).                  │
 * │                                                                                         │
 * │ O trigger `handle_new_user` copia um do outro UMA VEZ, no cadastro; depois disso eles    │
 * │ andam sozinhos. Gravar só um deixa o certificado público com um nome e a tela do aluno   │
 * │ com outro, sem erro em lugar nenhum. É a mesma família de armadilha que o HANDOFF §6 já  │
 * │ registra: duas verdades para o mesmo fato.                                               │
 * └─────────────────────────────────────────────────────────────────────────────────────────┘
 */

const UUID = /^[0-9a-f-]{36}$/i;

function voltar(req: NextRequest, alvo: string, params: Record<string, string>) {
  const url = new URL(`/admin/alunos/${alvo}`, req.url);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  // 303: o POST vira GET na volta, senão recarregar a tela repete a gravação.
  return NextResponse.redirect(url, 303);
}

/**
 * As duas ações chegam por caminhos diferentes, e isso é escolha, não acaso:
 *
 * - **dados** vem em JSON, do editor no lugar (`DadosEditaveis`), que salva sozinho ao sair do
 *   campo. Redirecionar ali recarregaria a tela a cada campo digitado e tiraria o foco de quem
 *   está editando o próximo.
 * - **progresso** vem de `<form>` nativo com redirect 303, porque é um clique só, muda a tela
 *   inteira (o contador do gate) e funciona sem JS.
 */
export async function POST(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });

  const db = createAdminClient();

  if (req.headers.get("content-type")?.includes("application/json")) {
    const corpo = (await req.json().catch(() => null)) as Record<string, string> | null;
    if (!corpo || !UUID.test(String(corpo.userId ?? ""))) {
      return NextResponse.json({ ok: false, motivo: "Pedido inválido." }, { status: 400 });
    }
    return salvarDados(db, autor, String(corpo.userId), corpo);
  }

  const form = await req.formData();
  const alvo = String(form.get("userId") ?? "");
  const acao = String(form.get("acao"));
  if (!UUID.test(alvo)) return new NextResponse(null, { status: 404 });
  if (acao === "progresso") return salvarProgresso(req, db, autor, alvo, form);
  if (acao === "politica") return salvarPolitica(req, db, autor, alvo, form);
  return new NextResponse(null, { status: 404 });
}

/**
 * Troca a política de liberação DESTE aluno (0017). Vazio = volta ao padrão (a política ativa).
 * Grava na matrícula mais recente, que é a que o `getMatricula` lê: as antigas são histórico.
 */
async function salvarPolitica(
  req: NextRequest,
  db: Db,
  autor: Autor,
  alvo: string,
  form: FormData,
): Promise<NextResponse> {
  const escolhida = String(form.get("politica") ?? "");
  if (escolhida && !UUID.test(escolhida)) return voltar(req, alvo, { erro: "Política inválida." });

  const { data: matricula } = await db
    .from("enrollments")
    .select("id, release_policy_id")
    .eq("user_id", alvo)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!matricula) return voltar(req, alvo, { erro: "Esta conta não tem matrícula." });

  // O nome entra no rastro pelos DOIS lados: id de política não responde "o que valia".
  const nomes = new Map<string | null, string>([[null, "padrão (política ativa)"]]);
  const { data: pols } = await db.from("release_policies").select("id, nome");
  for (const p of pols ?? []) nomes.set(p.id as string, p.nome as string);
  if (escolhida && !nomes.has(escolhida)) return voltar(req, alvo, { erro: "Política não encontrada." });

  const nova = escolhida || null;
  const { error } = await db
    .from("enrollments")
    .update({ release_policy_id: nova })
    .eq("id", matricula.id);
  if (error) return voltar(req, alvo, { erro: "Não deu para trocar a política." });

  await auditar(db, {
    autor,
    acao: "aluno.politica",
    alvo,
    detalhe: {
      politica: [
        nomes.get((matricula.release_policy_id as string | null) ?? null) ?? "?",
        nomes.get(nova) ?? "?",
      ],
    },
  });

  return voltar(req, alvo, { ok: "politica" });
}

type Db = ReturnType<typeof createAdminClient>;
type Autor = Awaited<ReturnType<typeof papelAtual>>;

/** Recusa com o motivo pronto para o editor mostrar ao lado do campo. */
const nao = (motivo: string) => NextResponse.json({ ok: false, motivo });

async function salvarDados(
  db: Db,
  autor: Autor,
  alvo: string,
  corpo: Record<string, string>,
): Promise<NextResponse> {
  // A MESMA `validarDados` do editor, que roda antes no navegador. A daqui não é redundância: o
  // editor é JS no cliente, e esta rota aceita POST de qualquer lugar.
  const v = validarDados({
    nome: String(corpo.nome ?? ""),
    email: String(corpo.email ?? ""),
    telefone: String(corpo.telefone ?? ""),
  });
  if (!v.ok) return nao(v.motivo);

  const [{ data: conta }, { data: perfil }] = await Promise.all([
    db.auth.admin.getUserById(alvo),
    db.from("profiles").select("nome, telefone").eq("id", alvo).maybeSingle(),
  ]);
  if (!conta?.user) return nao("Conta não encontrada.");

  const antes: DadosAluno = {
    nome: perfil?.nome ?? "",
    email: conta.user.email ?? "",
    telefone: perfil?.telefone ?? "",
  };
  const mudou = diferencas(antes, v.dados);
  // Nada mudou não é erro no editor no lugar: sair de um campo sem ter tocado nele é o caso comum,
  // e é o que acontece toda vez que o admin abre a edição para conferir e vai embora. Devolve ok
  // com `salvou: false`, e a tela não pisca "salvo" à toa.
  if (Object.keys(mudou).length === 0) return NextResponse.json({ ok: true, salvou: false });

  // O E-MAIL PRIMEIRO, porque é o único que pode ser recusado por outra conta já usar o endereço.
  // Gravando o perfil antes, uma recusa aqui deixaria nome e telefone salvos e o e-mail não, e a
  // tela diria "não deu" mostrando dois campos já alterados.
  if (mudou.email) {
    // O ENDEREÇO REPETIDO É CONFERIDO AQUI, ANTES DE TENTAR GRAVAR, e não pela mensagem de erro do
    // Supabase. Medido em 31/jul/2026: numa troca para um e-mail já usado, o Admin API devolve
    // `AuthRetryableFetchError`, status 500 e `message` igual à string "{}". Não dá para distinguir
    // isso de uma queda de rede, e a tela mostrava literalmente "Não deu para trocar o e-mail: {}".
    // A `buscar_usuarios` (migration 0004) responde a mesma pergunta de forma exata.
    const { data: iguais } = await db.rpc("buscar_usuarios", { termo: v.dados.email, limite: 5 });
    // A busca é `ilike '%termo%'`, então filtro o acerto exato: "ana@x.com" também casa com
    // "mariana@x.com.br", e recusar por causa disso seria pior que o erro que estou consertando.
    const dono = (iguais ?? []).find(
      (u: { id: string; email: string }) => u.email.toLowerCase() === v.dados.email && u.id !== alvo,
    );
    if (dono) return nao("Já existe uma conta com esse e-mail.");

    // `email_confirm: true` aplica na hora, sem mandar e-mail de confirmação para o endereço novo.
    // É o certo para uma ferramenta de suporte: o caso de uso é "o aluno digitou errado na compra e
    // não recebe nada", e pedir confirmação num endereço que o aluno talvez não controle ainda
    // deixaria a conta presa no endereço errado.
    const { error } = await db.auth.admin.updateUserById(alvo, {
      email: v.dados.email,
      email_confirm: true,
    });
    // `message` pode vir vazia ou como "{}" (ver acima), e uma tela que diz "erro: {}" não ajuda
    // ninguém. Sem mensagem legível, mostro o status, que ao menos separa recusa de queda.
    if (error) {
      const detalhe = error.message && error.message !== "{}" ? error.message : `HTTP ${error.status}`;
      return nao(`Não deu para trocar o e-mail (${detalhe}).`);
    }
  }

  // As duas moradas do nome (ver o quadro no topo). O `user_metadata` é reescrito a partir do que já
  // estava lá, e não substituído: a conta pode carregar outras chaves (o webhook do Guru grava as
  // dele), e mandar um objeto novo com dois campos apagaria o resto.
  const { error: erroConta } = await db.auth.admin.updateUserById(alvo, {
    user_metadata: {
      ...(conta.user.user_metadata ?? {}),
      nome: v.dados.nome,
      telefone: v.dados.telefone,
    },
  });
  if (erroConta) return nao("Não deu para gravar na conta de acesso.");

  const { error: erroPerfil } = await db
    .from("profiles")
    .update({ nome: v.dados.nome, telefone: v.dados.telefone || null })
    .eq("id", alvo);
  if (erroPerfil) return nao("Não deu para gravar o perfil.");

  await auditar(db, { autor, acao: "aluno.dados", alvo, detalhe: mudou });
  // `trocouEmail` volta para a tela avisar que o login mudou. É a única alteração desta rota que o
  // aluno sente do outro lado, e um "salvo" discreto não daria conta de dizer isso.
  return NextResponse.json({ ok: true, salvou: true, trocouEmail: Boolean(mudou.email) });
}

async function salvarProgresso(
  req: NextRequest,
  db: Db,
  autor: Autor,
  alvo: string,
  form: FormData,
): Promise<NextResponse> {
  const ord = Number(form.get("ord"));
  const marcar = String(form.get("modo")) === "marcar";
  if (!Number.isInteger(ord)) return voltar(req, alvo, { erro: "Módulo inválido." });

  const { data: modulo } = await db.from("modules").select("id, titulo").eq("ord", ord).maybeSingle();
  if (!modulo) return voltar(req, alvo, { erro: "Módulo não encontrado." });

  const { data: aulas } = await db.from("lessons").select("id").eq("module_id", modulo.id);
  const ids = (aulas ?? []).map((a) => a.id);
  if (ids.length === 0) return voltar(req, alvo, { erro: "Esse módulo não tem aulas." });

  if (marcar) {
    const agora = new Date().toISOString();
    const { error } = await db.from("progress").upsert(
      // `watched_pct: 100` junto do status: a coluna existe e uma linha "completed" com 0% assistido
      // seria um dado que nenhuma outra parte do sistema produz.
      ids.map((lesson_id) => ({
        user_id: alvo,
        lesson_id,
        status: "completed" as const,
        watched_pct: 100,
        completed_at: agora,
        updated_at: agora,
      })),
      { onConflict: "user_id,lesson_id" },
    );
    if (error) return voltar(req, alvo, { erro: "Não deu para gravar o progresso." });
  } else {
    // APAGA a linha em vez de voltar o status para 'started'. É o que o
    // `scripts/progresso-conta.mjs --limpar` faz, e é o estado de quem nunca abriu a aula; deixar
    // linha com status antigo criaria um terceiro estado que nenhuma tela sabe ler.
    const { error } = await db.from("progress").delete().eq("user_id", alvo).in("lesson_id", ids);
    if (error) return voltar(req, alvo, { erro: "Não deu para limpar o progresso." });
  }

  // O RASTRO GUARDA QUANTAS AULAS, porque esta ação mexe no gate de 16/16 que libera a prova: é a
  // única edição desta tela que pode dar (ou tirar) acesso à prova final.
  await auditar(db, {
    autor,
    acao: marcar ? "aluno.progresso-marcar" : "aluno.progresso-limpar",
    alvo,
    detalhe: { modulo: modulo.titulo, ord, aulas: ids.length },
  });

  return voltar(req, alvo, { ok: marcar ? "progresso-marcado" : "progresso-limpo" });
}

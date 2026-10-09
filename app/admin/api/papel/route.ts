import { redirecionar303 } from "@/lib/redirecionar";
import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { origemValida } from "@/lib/admin-guarda";
import { auditar } from "@/lib/auditoria";
import { enviarRedefinicao } from "@/lib/email";
import { baseDoSite } from "@/lib/seguranca";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Concede e revoga `is_admin` (PLANO-ADMIN §8). Recebe POST de formulário da tela de Equipe.
 *
 * ┌─ LEIA ISTO ANTES DE MEXER ─────────────────────────────────────────────────────────────┐
 * │ A CHECAGEM DE PAPEL AQUI DENTRO É O ÚNICO GUARDA DESTA ROTA.                            │
 * │                                                                                         │
 * │ Route handler NÃO passa por layout, então a guarda de `app/admin/layout.tsx` não vale    │
 * │ aqui: qualquer pessoa logada pode dar POST neste endereço direto, sem nunca abrir uma    │
 * │ tela do admin. E o trigger `guarda_is_admin` do banco também não segura, porque a        │
 * │ escrita sai pela service role, onde `auth.uid()` é null — que é justamente o caminho     │
 * │ que o trigger libera.                                                                   │
 * │                                                                                         │
 * │ Ou seja: sem o `papel !== "admin"` abaixo, esta rota é a escalada de privilégio da       │
 * │ migration 0003 de volta, servida em HTTP. Não remover, não mover para o layout, não      │
 * │ trocar por confiança no `<form>` da tela.                                                │
 * └─────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Responde 404 e não 403 para não-admin, pelo mesmo motivo da guarda do layout: não confirmar
 * que a rota existe. O observador (0029) também recebe 404: ele não é admin, e é este mesmo
 * `papel !== "admin"` que o mantém fora daqui.
 *
 * Desde a 0029 a rota também concede e revoga o papel de OBSERVADOR (`acao` = `observador-conceder`
 * com `email`, ou `observador-revogar` com `userId`). Mesma tela, mesma guarda, mesmo rastro.
 */

const DESTINO = "/admin/equipe";

/** Volta para a tela com a busca preservada e uma mensagem. */
function voltar(req: NextRequest, params: Record<string, string>) {
  const url = new URL(DESTINO, req.url);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  // 303: o POST virou GET na volta, senão o recarregar da tela repete a mutação.
  return redirecionar303(url);
}

export async function POST(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });
  // Cookie o navegador manda sozinho; o `Origin` ele não deixa outra página forjar. POST vindo de
  // outro site com a sessão do admin é recusado antes de tocar em qualquer dado.
  if (!origemValida(req)) return new NextResponse(null, { status: 403 });

  const form = await req.formData();
  const alvo = String(form.get("userId") ?? "");
  const acao = String(form.get("acao") ?? "");
  const q = String(form.get("q") ?? "");

  if (acao === "observador-conceder" || acao === "observador-revogar") {
    return observador(req, autor, acao, form, q);
  }

  if (!/^[0-9a-f-]{36}$/i.test(alvo) || (acao !== "promover" && acao !== "revogar")) {
    return voltar(req, { q, erro: "Pedido inválido." });
  }

  const promover = acao === "promover";
  const db = createAdminClient();

  // A lista de admins responde duas perguntas de uma vez: se o alvo já é admin (para não
  // gravar em vão) e quantos existem (para a trava do último).
  const { data: admins, error: erroAdmins } = await db.rpc("listar_admins");
  if (erroAdmins) return voltar(req, { q, erro: "Não deu para ler a lista de admins." });

  const linha = (admins ?? []).find((a: { id: string }) => a.id === alvo);
  const jaEhAdmin = Boolean(linha);
  if (jaEhAdmin === promover) {
    return voltar(req, { q, erro: "Nada a fazer: a conta já está nesse estado." });
  }

  // A REGRA DO ADMIN MESTRE (pedido do Pedro em 30/jul/2026): admin comum faz tudo, menos mexer
  // no acesso de um mestre. Esta checagem é o controle do caminho do app; a mesma regra está no
  // trigger `guarda_is_admin` da migration `0005`, que cobre qualquer caminho direto ao banco.
  // As duas existem porque o app escreve com a service role, onde o trigger passa direto.
  if (!promover && linha?.is_master && !autor.mestre) {
    return voltar(req, {
      q,
      erro: "Só um admin mestre pode mexer no acesso de outro admin mestre.",
    });
  }

  // Duas travas que existem para o painel não se trancar por fora. A do último admin é a mesma
  // do `scripts/admin-conta.mjs`; a de si mesmo é só desta tela, porque no script quem digita o
  // comando tem a service role na mão e pode se desfazer, e aqui não.
  if (!promover && alvo === autor.id) {
    return voltar(req, { q, erro: "Você não pode remover o seu próprio acesso de admin." });
  }
  if (!promover && (admins ?? []).length <= 1) {
    return voltar(req, { q, erro: "Este é o único admin. Promova outra conta antes de revogar." });
  }
  // Terceira trava, da mesma família: sem mestre nenhum, ninguém mais consegue mexer num mestre,
  // e a única saída seria o script com a service role.
  if (!promover && linha?.is_master) {
    const mestres = (admins ?? []).filter((a: { is_master: boolean }) => a.is_master);
    if (mestres.length <= 1) {
      return voltar(req, {
        q,
        erro: "Este é o único admin mestre. Promova outro mestre antes de revogar.",
      });
    }
  }

  // Sem linha em `profiles` o update não afeta nada e a tela mentiria um sucesso. Acontece se o
  // upsert do signup não rodou para aquela conta.
  // `*` e não uma lista de colunas: `is_observer` só existe depois da 0029, e pedir a coluna pelo
  // nome antes disso derrubaria a promoção de admin inteira.
  const { data: perfil } = await db
    .from("profiles")
    .select("*")
    .eq("id", alvo)
    .maybeSingle();
  if (!perfil) {
    return voltar(req, { q, erro: "Essa conta não tem perfil. Ela precisa entrar uma vez antes." });
  }
  // Promover um observador limpa a marca dele na mesma gravação: o CHECK
  // `profiles_observador_nao_admin` da 0029 recusa os dois juntos, e admin já vê os indicadores.
  const eraObservador = (perfil as { is_observer?: boolean }).is_observer === true;

  // Revogar limpa os DOIS campos. Não é zelo: o CHECK `profiles_master_implica_admin` da `0005`
  // rejeita (is_master=true, is_admin=false), então revogar um mestre sem limpar `is_master`
  // falharia na gravação. Promover não mexe em `is_master`, que já é false por causa do mesmo
  // CHECK.
  const { error } = await db
    .from("profiles")
    .update(
      promover
        ? { is_admin: true, ...(eraObservador ? { is_observer: false } : {}) }
        : { is_admin: false, is_master: false },
    )
    .eq("id", alvo);
  if (error) return voltar(req, { q, erro: "A gravação falhou." });

  // Confere lendo de volta, como o script faz: um update pode "passar" sem afetar linha, e
  // numa tela de privilégio um sucesso falso é pior que um erro.
  const { data: depois } = await db
    .from("profiles")
    .select("is_admin")
    .eq("id", alvo)
    .single();
  if (depois?.is_admin !== promover) {
    return voltar(req, { q, erro: "A gravação não teve efeito. Nada foi alterado." });
  }

  // AUDITORIA. O teto que estava anotado aqui (log de servidor, retenção curta, ninguém consulta)
  // caiu em 31/jul/2026, quando a liberação de 2ª chamada virou a quarta escrita sensível e a tabela
  // `admin_audit` foi criada (migration `0014`). O `auditar` continua logando no servidor além de
  // gravar, então o pior caso é o de antes.
  await auditar(db, {
    autor,
    acao: promover ? "papel.promover" : "papel.revogar",
    alvo,
    detalhe: { email: linha?.email ?? null, era_mestre: linha?.is_master ?? false },
  });

  return voltar(req, { q, ok: promover ? "promovido" : "revogado" });
}

type Autor = Awaited<ReturnType<typeof papelAtual>>;

const MOLDE_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Conceder e revogar o papel de observador (migration 0029).
 *
 * CONCEDER É POR E-MAIL, e não por conta encontrada na busca, porque o observador típico é alguém
 * de fora (gente da Abril) que nunca comprou o curso e, portanto, não tem conta. Sem conta, ela é
 * criada aqui, já confirmada e SEM matrícula, e a pessoa recebe o e-mail de criação de senha (o
 * template `redefinicao-senha`, o mesmo do "Esqueci minha senha"). Sem matrícula a sala do aluno
 * continua fechada para ela; o login a manda para o `/admin`, onde só a tela de indicadores abre.
 *
 * As travas são as da promoção de admin, adaptadas: conta que já é admin não vira observador (vê
 * tudo, e o CHECK da 0029 recusaria), e a gravação é conferida lendo de volta.
 */
async function observador(
  req: NextRequest,
  autor: Autor,
  acao: "observador-conceder" | "observador-revogar",
  form: FormData,
  q: string,
) {
  const db = createAdminClient();

  if (acao === "observador-revogar") {
    const alvo = String(form.get("userId") ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(alvo)) return voltar(req, { q, erro: "Pedido inválido." });

    const { data: lista, error: erroLista } = await db.rpc("listar_observadores");
    if (erroLista) return voltar(req, { q, erro: "Não deu para ler a lista de observadores." });
    const linha = (lista ?? []).find((o: { id: string }) => o.id === alvo) as
      | { id: string; email: string }
      | undefined;
    if (!linha) return voltar(req, { q, erro: "Nada a fazer: a conta não é observadora." });

    const { error } = await db.from("profiles").update({ is_observer: false }).eq("id", alvo);
    if (error) return voltar(req, { q, erro: "A gravação falhou." });
    const { data: depois } = await db.from("profiles").select("is_observer").eq("id", alvo).single();
    if (depois?.is_observer !== false) {
      return voltar(req, { q, erro: "A gravação não teve efeito. Nada foi alterado." });
    }

    await auditar(db, {
      autor,
      acao: "papel.observador-revogar",
      alvo,
      detalhe: { email: linha.email },
    });
    return voltar(req, { q, ok: "observador-revogado" });
  }

  // ---- conceder ----------------------------------------------------------------------------
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!MOLDE_EMAIL.test(email) || email.length > 254) {
    return voltar(req, { q, erro: "Informe um e-mail válido." });
  }

  const { data: achado, error: erroBusca } = await db.rpc("usuario_por_email", { p_email: email });
  if (erroBusca) return voltar(req, { q, erro: "Não deu para procurar a conta." });

  let alvo = typeof achado === "string" && achado ? achado : "";
  let contaCriada = false;
  if (!alvo) {
    const { data: criado, error: erroCriar } = await db.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (erroCriar || !criado?.user) {
      console.error("[papel] conta de observador nao criada:", erroCriar?.message);
      return voltar(req, { q, erro: "Não deu para criar a conta deste e-mail." });
    }
    alvo = criado.user.id;
    contaCriada = true;
    // O trigger `on_auth_user_created` da 0001 já cria o perfil; o upsert cobre o banco em que ele
    // não rodou, como faz o cadastro de homologação.
    const { error: erroPerfil } = await db.from("profiles").upsert({ id: alvo }, { onConflict: "id" });
    if (erroPerfil) {
      await db.auth.admin.deleteUser(alvo);
      return voltar(req, { q, erro: "Não deu para criar o perfil da conta. Nada foi alterado." });
    }
  }

  const { data: perfil, error: erroPerfil } = await db
    .from("profiles")
    .select("is_admin, is_observer")
    .eq("id", alvo)
    .maybeSingle();
  if (erroPerfil || !perfil) {
    return voltar(req, { q, erro: "Essa conta não tem perfil. Ela precisa entrar uma vez antes." });
  }
  if (perfil.is_admin) {
    return voltar(req, { q, erro: "Essa conta é admin e já vê os indicadores." });
  }
  if (perfil.is_observer) {
    return voltar(req, { q, erro: "Nada a fazer: a conta já é observadora." });
  }

  const { error } = await db.from("profiles").update({ is_observer: true }).eq("id", alvo);
  if (error) return voltar(req, { q, erro: "A gravação falhou." });
  const { data: depois } = await db.from("profiles").select("is_observer").eq("id", alvo).single();
  if (depois?.is_observer !== true) {
    return voltar(req, { q, erro: "A gravação não teve efeito. Nada foi alterado." });
  }

  // Conta nova não tem senha: o e-mail é o que deixa a pessoa entrar. Conta que já existia tem a
  // dela, e o "Esqueci minha senha" cobre quem não lembra. `enviarRedefinicao` nunca lança.
  let emailEnviado = false;
  if (contaCriada) {
    const base = baseDoSite({ origem: req.headers.get("origin") });
    if (base) {
      const r = await enviarRedefinicao(db, { email, base });
      emailEnviado = r.ok;
    } else {
      console.error("[papel] sem NEXT_PUBLIC_SITE_URL: link de senha do observador nao enviado");
    }
  }

  await auditar(db, {
    autor,
    acao: "papel.observador-conceder",
    alvo,
    detalhe: { email, conta_criada: contaCriada, email_enviado: emailEnviado },
  });

  return voltar(req, {
    q,
    ok: !contaCriada
      ? "observador-concedido"
      : emailEnviado
        ? "observador-criado"
        : "observador-criado-sem-email",
  });
}

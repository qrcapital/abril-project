import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import { origemValida } from "@/lib/admin-guarda";
import { auditar } from "@/lib/auditoria";
import {
  CAMINHO_CREDENCIAL,
  COOKIE_CREDENCIAL,
  codificarCredencial,
  type Credencial,
} from "@/lib/credencial";
import { redirecionar303 } from "@/lib/redirecionar";
import { baseDoSite } from "@/lib/seguranca";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  emailDoUsuario,
  gerarSenha,
  normalizarUsuario,
  usuarioDoEmail,
  usuarioValido,
} from "@/lib/usuario-login";

/**
 * Observador por USUÁRIO, sem e-mail (13/out/2026). Recebe POST da tela de Equipe.
 *
 * Pedido do Marcelo: três contas de observador (Abril, QR Capital e uma de teste) que entram com
 * um nome de usuário e uma senha gerada aqui, e trocam a senha no primeiro acesso. O e-mail do
 * Auth é sintético (`lib/usuario-login.ts`), então não há e-mail de senha a mandar: a senha
 * aparece UMA vez para o admin, que a repassa.
 *
 * Três ações:
 * - `criar` (`login`, `nome`): cria a conta já confirmada, com `trocar_senha` no `app_metadata`, e
 *   dá o papel de observador pelo mesmo caminho da rota de papel (`profiles.is_observer`).
 * - `nova-senha` (`userId`): gera outra senha para uma conta de usuário observadora e volta a
 *   exigir a troca. Não derruba as sessões abertas: a conta é usada em vários aparelhos.
 * - `esquecer`: apaga o cookie da credencial depois que a tela a mostrou.
 *
 * A guarda é a da rota de papel, e pelo mesmo motivo (ver o quadro em `admin/api/papel`): route
 * handler não passa pelo layout, então o `papel !== "admin"` aqui é o único guarda, e a escrita
 * sai pela service role, onde o trigger do banco deixa passar. 404 para não-admin, observador
 * incluído.
 *
 * ┌─ POR QUE A SENHA VIAJA NUM COOKIE ────────────────────────────────────────────────────────────┐
 * │ Na query string ela ficaria no histórico do navegador e nos logs de acesso da Netlify. O      │
 * │ cookie é httpOnly, `SameSite=Strict`, vale só para `/admin/equipe` e morre em dois minutos; a │
 * │ tela o lê, mostra a senha, e pede para esta rota apagá-lo logo em seguida (`esquecer`).        │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 */

const DESTINO = CAMINHO_CREDENCIAL;

function voltar(params: Record<string, string>) {
  const url = new URL(DESTINO, "http://local");
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  return redirecionar303(url);
}

function comCredencial(req: NextRequest, cred: Omit<Credencial, "url">, ok: string) {
  const base = baseDoSite({ origem: req.headers.get("origin") });
  const valor: Credencial = { ...cred, url: `${base}/app/login` };
  const res = voltar({ ok });
  res.cookies.set(COOKIE_CREDENCIAL, codificarCredencial(valor), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: DESTINO,
    maxAge: 120,
  });
  return res;
}

export async function POST(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });
  if (!origemValida(req)) return new NextResponse(null, { status: 403 });

  const form = await req.formData();
  const acao = String(form.get("acao") ?? "");

  if (acao === "esquecer") {
    const res = new NextResponse(null, { status: 204 });
    res.cookies.set(COOKIE_CREDENCIAL, "", { path: DESTINO, maxAge: 0 });
    return res;
  }

  const db = createAdminClient();

  // ---- nova senha ---------------------------------------------------------------------------
  if (acao === "nova-senha") {
    const alvo = String(form.get("userId") ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(alvo)) return voltar({ erro: "Pedido inválido." });

    const { data: lido, error: erroLer } = await db.auth.admin.getUserById(alvo);
    const conta = lido?.user;
    const login = usuarioDoEmail(conta?.email);
    // Só conta de usuário: quem tem e-mail de verdade usa o "Esqueci minha senha", e uma senha
    // gerada aqui para ela seria um segundo jeito de entrar na conta de outra pessoa.
    if (erroLer || !conta || !login) {
      return voltar({ erro: "Só contas de usuário recebem senha nova por aqui." });
    }
    const { data: perfil } = await db.from("profiles").select("is_observer").eq("id", alvo).maybeSingle();
    if (perfil?.is_observer !== true) {
      return voltar({ erro: "Essa conta não é observadora." });
    }

    const senha = gerarSenha();
    const { error } = await db.auth.admin.updateUserById(alvo, {
      password: senha,
      app_metadata: { ...conta.app_metadata, trocar_senha: true },
    });
    if (error) {
      console.error("[observador-usuario] nova senha falhou:", error.message);
      return voltar({ erro: "Não deu para gerar a senha nova. Nada foi alterado." });
    }

    await auditar(db, {
      autor,
      acao: "papel.observador-usuario-senha",
      alvo,
      detalhe: { login, email: conta.email ?? null },
    });
    const nome = (conta.user_metadata?.nome as string | undefined) ?? null;
    return comCredencial(req, { tipo: "nova", login, nome, senha }, "usuario-senha");
  }

  if (acao !== "criar") return voltar({ erro: "Pedido inválido." });

  // ---- criar --------------------------------------------------------------------------------
  const login = normalizarUsuario(String(form.get("login") ?? ""));
  const nome = String(form.get("nome") ?? "").trim().slice(0, 80);
  if (!usuarioValido(login)) {
    return voltar({
      erro: "Usuário inválido. Use de 3 a 40 letras minúsculas, números, ponto, hífen ou sublinhado, começando e terminando com letra ou número.",
    });
  }
  if (!nome) return voltar({ erro: "Informe um nome para a conta, como Abril." });

  const email = emailDoUsuario(login);
  const { data: achado, error: erroBusca } = await db.rpc("usuario_por_email", { p_email: email });
  if (erroBusca) return voltar({ erro: "Não deu para conferir se o usuário já existe." });
  if (typeof achado === "string" && achado) {
    return voltar({ erro: `O usuário ${login} já existe. Para trocar a senha dele, use Nova senha na lista.` });
  }

  const senha = gerarSenha();
  const { data: criado, error: erroCriar } = await db.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    // `app_metadata` e não `user_metadata` para a marca: o usuário edita o próprio
    // `user_metadata` pela API, e com a marca ali ele se livraria da troca sozinho.
    app_metadata: { trocar_senha: true, login },
    user_metadata: { nome },
  });
  if (erroCriar || !criado?.user) {
    console.error("[observador-usuario] conta nao criada:", erroCriar?.message);
    // Corrida com outra criação do mesmo usuário cai aqui, depois da busca acima.
    const jaExiste = /already|registered|exists/i.test(erroCriar?.message ?? "");
    return voltar({
      erro: jaExiste
        ? `O usuário ${login} já existe. Para trocar a senha dele, use Nova senha na lista.`
        : "Não deu para criar a conta. Nada foi alterado.",
    });
  }
  const alvo = criado.user.id;

  // A partir daqui, qualquer falha DESFAZ a conta: uma conta de usuário sem o papel não serve para
  // nada e ocuparia o nome, obrigando a escolher outro na próxima tentativa.
  const desfazer = async (erro: string) => {
    await db.auth.admin.deleteUser(alvo);
    return voltar({ erro });
  };

  // O trigger `on_auth_user_created` da 0001 cria o perfil (com o `nome`); o upsert cobre o banco
  // em que ele não rodou, como na rota de papel.
  const { error: erroPerfil } = await db.from("profiles").upsert({ id: alvo }, { onConflict: "id" });
  if (erroPerfil) return desfazer("Não deu para criar o perfil da conta. Nada foi alterado.");

  // O mesmo papel e a mesma conferência por leitura da rota de papel (`observador-conceder`).
  const { error } = await db.from("profiles").update({ is_observer: true }).eq("id", alvo);
  if (error) return desfazer("A gravação do papel falhou. Nada foi alterado.");
  const { data: depois } = await db.from("profiles").select("is_observer").eq("id", alvo).single();
  if (depois?.is_observer !== true) {
    return desfazer("A gravação do papel não teve efeito. Nada foi alterado.");
  }

  await auditar(db, {
    autor,
    acao: "papel.observador-usuario-criar",
    alvo,
    detalhe: { login, nome, email },
  });

  return comCredencial(req, { tipo: "criada", login, nome, senha }, "usuario-criado");
}

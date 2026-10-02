// Envio de e-mail transacional. A camada que não existia: até 31/jul/2026 o projeto **não mandava
// e-mail nenhum**. O webhook do Guru gerava o link de acesso, escrevia uma linha no `email_log` e
// parava aí, então quem comprava não recebia nada.
//
// TRÊS DECISÕES QUE MOLDAM ESTE ARQUIVO:
//
// 1. **O cliente do Supabase entra por parâmetro**, como no `lib/certificados.ts`, e este módulo
//    não tem `server-only`. Ele precisa rodar em mais de um runtime: no Next (webhook, conclusão
//    de aula, admin) e em rotina fora do bundle, se um dia houver. Importar
//    `lib/supabase/admin.ts` amarraria ele ao bundle do Next, e o dia em que um cron precisar
//    mandar e-mail seria um dia de refactor.
// 2. **`enviarEmail` nunca lança.** Ela é chamada de dentro do webhook de compra aprovada: se o
//    e-mail derrubasse o handler, o Guru receberia erro e reentregaria o evento, e uma falha de
//    entrega de e-mail viraria matrícula duplicada. Falha de e-mail é falha de e-mail.
// 3. **Toda tentativa vira linha no `email_log`**, sucesso ou fracasso. É o que faz a tela
//    `/admin/emails` valer alguma coisa: log que só registra sucesso responde a pergunta errada.
//
// ┌─ O PROVEDOR (29/set/2026): AMAZON SES, COM O RESEND COMO RESERVA ─────────────────────────────┐
// │ O dono preferiu o SES em `sa-east-1`: a conta AWS já existe, o custo por mil é uma fração, e  │
// │ o domínio `blocktrends.com.br` fica verificado num lugar só. A escolha é por ambiente:         │
// │                                                                                               │
// │   EMAIL_PROVIDER=ses|resend   manda, quando existe;                                            │
// │   sem ela, SES se as duas chaves do SES existem, senão Resend se a chave dele existe;          │
// │   sem nenhum dos dois, o envio falha com o motivo escrito no `email_log`.                      │
// │                                                                                               │
// │ As variáveis do SES NÃO começam com `AWS_`: a Netlify e o Lambda reservam `AWS_ACCESS_KEY_ID` │
// │ e companhia para a credencial do próprio runtime, e o valor posto no painel seria ignorado ou │
// │ recusado. A assinatura SigV4 é nossa, em `lib/ses.ts`, sem o SDK (ver o topo de lá).          │
// └───────────────────────────────────────────────────────────────────────────────────────────────┘

import type { SupabaseClient } from "@supabase/supabase-js";

import { linkUtilizavel, renderizar, type Dados, type Template } from "./email-render.ts";
import { assinarSigV4, corpoSesV2, endpointSes } from "./ses.ts";

const ENDPOINT_RESEND = "https://api.resend.com/emails";
/**
 * O remetente de produção. Precisa estar verificado no SES (domínio inteiro, com DKIM).
 * `contato@` desde 02/out/2026, a pedido do Marcelo: o mesmo nome "Estratégia Internacional" dos
 * e-mails do RD, e um endereço que existe e é lido, para quem responder o e-mail ser atendido.
 */
const REMETENTE_PADRAO = "Estratégia Internacional <contato@blocktrends.com.br>";
/**
 * O remetente do Resend quando `EMAIL_FROM` falta: o único que ele aceita sem domínio próprio, e o
 * que foi validado em homolog (AMBIENTES.md). Usar o de produção ali faria o Resend recusar tudo.
 */
const REMETENTE_RESEND = "onboarding@resend.dev";
const RESPONDER_PARA_PADRAO = "contato@blocktrends.com.br";
/** Sem teto, uma rede lenta pendura o webhook do Guru até o timeout da plataforma. */
const TEMPO_MAXIMO_MS = 10_000;

export type Resultado = { ok: boolean; status: string };

type Mensagem = { para: string; assunto: string; html: string; texto: string };

type Provedor =
  | { nome: "ses"; enviar: (m: Mensagem) => Promise<string | null> }
  | { nome: "resend"; enviar: (m: Mensagem) => Promise<string | null> }
  | { nome: "nenhum"; motivo: string };

const env = (nome: string) => process.env[nome]?.trim() || "";

/**
 * Qual provedor este ambiente usa. Cada `enviar` devolve `null` no sucesso e o motivo na falha,
 * curto, porque vira a coluna `status` do log.
 */
function escolherProvedor(): Provedor {
  const pedido = env("EMAIL_PROVIDER").toLowerCase();
  const temSes = Boolean(env("SES_ACCESS_KEY_ID") && env("SES_SECRET_ACCESS_KEY"));
  const temResend = Boolean(env("RESEND_API_KEY"));

  const qual = pedido || (temSes ? "ses" : temResend ? "resend" : "");

  if (qual === "ses") {
    if (!temSes) return { nome: "nenhum", motivo: "EMAIL_PROVIDER=ses sem SES_ACCESS_KEY_ID/SES_SECRET_ACCESS_KEY" };
    return { nome: "ses", enviar: enviarPeloSes };
  }
  if (qual === "resend") {
    if (!temResend) return { nome: "nenhum", motivo: "EMAIL_PROVIDER=resend sem RESEND_API_KEY" };
    return { nome: "resend", enviar: enviarPeloResend };
  }
  if (pedido) return { nome: "nenhum", motivo: `EMAIL_PROVIDER desconhecido (${pedido})` };
  return { nome: "nenhum", motivo: "nenhum provedor: faltam SES_ACCESS_KEY_ID/SES_SECRET_ACCESS_KEY" };
}

async function enviarPeloSes(m: Mensagem): Promise<string | null> {
  const regiao = env("SES_REGION") || "sa-east-1";
  const url = endpointSes(regiao);
  const corpo = JSON.stringify(
    corpoSesV2({
      de: env("EMAIL_FROM") || REMETENTE_PADRAO,
      para: m.para,
      responderPara: env("EMAIL_REPLY_TO") || RESPONDER_PARA_PADRAO,
      assunto: m.assunto,
      html: m.html,
      texto: m.texto,
      configuracao: env("SES_CONFIGURATION_SET") || null,
    }),
  );
  const cabecalhos = assinarSigV4({
    metodo: "POST",
    url,
    cabecalhos: { "Content-Type": "application/json" },
    corpo,
    regiao,
    // O nome de serviço da API v2 do SES, para assinatura, continua sendo "ses".
    servico: "ses",
    chaveId: env("SES_ACCESS_KEY_ID"),
    segredo: env("SES_SECRET_ACCESS_KEY"),
  });

  const resposta = await fetch(url, {
    method: "POST",
    headers: cabecalhos,
    body: corpo,
    signal: AbortSignal.timeout(TEMPO_MAXIMO_MS),
  });
  if (resposta.ok) return null;

  // O SES responde `{"message": "..."}`. É ele que diz "Email address is not verified" no sandbox,
  // que é o erro mais provável do primeiro dia, então vai inteiro para o log até o teto da coluna.
  const bruto = await resposta.text().catch(() => "");
  let mensagem = bruto;
  try {
    mensagem = (JSON.parse(bruto) as { message?: string }).message ?? bruto;
  } catch {
    /* corpo não era JSON: fica o texto cru */
  }
  return `ses ${resposta.status} ${mensagem}`.slice(0, 110);
}

async function enviarPeloResend(m: Mensagem): Promise<string | null> {
  const resposta = await fetch(ENDPOINT_RESEND, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env("EMAIL_FROM") || REMETENTE_RESEND,
      to: [m.para],
      reply_to: env("EMAIL_REPLY_TO") || RESPONDER_PARA_PADRAO,
      subject: m.assunto,
      html: m.html,
      text: m.texto,
    }),
    signal: AbortSignal.timeout(TEMPO_MAXIMO_MS),
  });
  if (resposta.ok) return null;
  const corpo = await resposta.text().catch(() => "");
  return `resend ${resposta.status} ${corpo.slice(0, 80)}`;
}

/**
 * Manda um transacional e registra a tentativa.
 *
 * `userId` pode ser nulo (o registro sobrevive à conta, por isso `email_log.user_id` é
 * `on delete set null`), mas `para` é obrigatório: sem endereço não há o que tentar.
 */
export async function enviarEmail(
  db: SupabaseClient,
  {
    chave,
    para,
    userId,
    dados = {},
    teste = false,
  }: {
    chave: string;
    para: string;
    userId?: string | null;
    dados?: Dados;
    /** Envio de conferência, disparado pelo admin. Aparece marcado no log. */
    teste?: boolean;
  },
): Promise<Resultado> {
  const rotuloLog = teste ? `${chave} (teste)` : chave;

  const registrar = async (status: string) => {
    const { error } = await db
      .from("email_log")
      .insert({ user_id: userId ?? null, template: rotuloLog, status });
    // O log falhar não pode derrubar o envio nem o gatilho. Sobra o log do servidor.
    if (error) console.error(`[email] nao deu para registrar ${rotuloLog}:`, error.message);
  };

  const falhar = async (motivo: string): Promise<Resultado> => {
    const status = `falha: ${motivo}`.slice(0, 120);
    console.error(`[email] ${rotuloLog} para ${para}: ${motivo}`);
    await registrar(status);
    return { ok: false, status };
  };

  const template = await carregarTemplate(db, chave);
  if (!template) return falhar("template inexistente no banco");

  // Desligado não é falha: é alguém tendo decidido que este e-mail não sai por ora. Mas continua
  // virando linha, senão o silêncio fica indistinguível de bug.
  if (template.ativo === false) {
    await registrar("desligado");
    return { ok: false, status: "desligado" };
  }

  // Link morto NÃO SAI. Os gatilhos montam o destino do botão com `NEXT_PUBLIC_SITE_URL`, e a
  // variável faltando produziria `/app/certificado` cru: um botão que não vai a lugar nenhum na
  // caixa de entrada de quem pagou. Entre mandar um e-mail quebrado e não mandar, não mandar é
  // recuperável: o log diz o motivo e o "Reenviar acesso" do admin refaz depois do conserto.
  if ("link" in dados && !linkUtilizavel(dados.link)) {
    return falhar("link do botao nao e absoluto (NEXT_PUBLIC_SITE_URL ausente no ambiente?)");
  }

  const provedor = escolherProvedor();
  if (provedor.nome === "nenhum") return falhar(provedor.motivo);

  const { assunto, html, texto } = renderizar(template, dados);

  try {
    const erro = await provedor.enviar({ para, assunto, html, texto });
    if (erro) return falhar(erro);
  } catch (e) {
    return falhar(`${provedor.nome}: ${e instanceof Error ? e.message : "erro de rede"}`);
  }

  await registrar("enviado");
  return { ok: true, status: "enviado" };
}

/**
 * Gera o link de uso único que abre uma sessão e leva à criação de senha.
 *
 * ┌─ POR QUE `recovery` E NÃO MAIS `invite` ──────────────────────────────────────────────────────┐
 * │ O webhook cria a conta com `email_confirm: true`, e para conta confirmada o Supabase recusa   │
 * │ o `invite` com `email_exists`. Ou seja: o link de boas-vindas falhava para TODO comprador, e  │
 * │ o `email_log` registrava "sem link de acesso" enquanto a pessoa esperava o e-mail. O          │
 * │ `recovery` funciona para qualquer conta existente, inclusive a que nunca teve senha, e o     │
 * │ `/auth/confirm` já aceita os dois tipos. Quem decide se a tela pede o aceite dos documentos   │
 * │ é o estado da conta, não o tipo do link (ver `app/app/redefinir-senha/page.tsx`).             │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * O `invite` fica como segunda tentativa, para o caso raro de conta que existe sem confirmação
 * (criada à mão no painel do Supabase, por exemplo), em que o `recovery` pode ser recusado.
 *
 * O link é montado com o `hashed_token`, e não com o `action_link` da resposta: ele aponta direto
 * para o nosso `/auth/confirm`, que é quem troca token por sessão, e não depende dos templates do
 * painel do Supabase.
 */
async function gerarLinkDeSenha(
  db: SupabaseClient,
  email: string,
  base: string,
  permitirConvite: boolean,
): Promise<{ link: string; userId: string | null; nome: string | null } | { erro: string }> {
  const tentativas: ("recovery" | "invite")[] = permitirConvite ? ["recovery", "invite"] : ["recovery"];
  let ultimoErro = "sem hash";
  for (const tipo of tentativas) {
    const { data, error } = await db.auth.admin.generateLink({ type: tipo, email });
    const hash = data?.properties?.hashed_token;
    if (!error && hash) {
      return {
        link: `${base}/auth/confirm?token_hash=${encodeURIComponent(hash)}&type=${tipo}`,
        userId: data.user?.id ?? null,
        nome: (data.user?.user_metadata?.nome as string | undefined) ?? null,
      };
    }
    ultimoErro = error?.message ?? "sem hash";
  }
  return { erro: ultimoErro };
}

const primeiroNome = (nome?: string | null) => (nome ?? "").trim().split(/\s+/)[0] ?? "";

/**
 * O e-mail de acesso: gera o link de criação de senha e manda o boas-vindas (PRD §14, template 3).
 *
 * MORA AQUI, e não no webhook que é o gatilho principal, porque tem **dois** chamadores: a compra
 * aprovada e o "reenviar acesso" do admin. A alternativa era a rota do admin importar do módulo de
 * um route handler, que funciona e é uma armadilha esperando alguém.
 *
 * A BASE DO LINK É SÓ `NEXT_PUBLIC_SITE_URL`. Os dois chamadores rodam sem um visitante do outro
 * lado (webhook, admin), então não há `Origin` que faça sentido seguir.
 *
 * Cada chamada gera um link NOVO. É por isso que reenviar acesso não é "mandar a mesma mensagem": o
 * token anterior pode ter expirado ou já ter sido usado.
 */
export async function enviarAcesso(
  db: SupabaseClient,
  { email, userId, nome }: { email: string; userId: string; nome?: string | null },
): Promise<Resultado> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/+$/, "");
  const r = await gerarLinkDeSenha(db, email, base, true);

  if ("erro" in r) {
    // Sem link não faz sentido mandar o e-mail: ele existe para levar à criação da senha.
    const motivo = `falha: sem link de acesso (${r.erro})`.slice(0, 120);
    console.error(`[email] boas-vindas para ${email}: ${motivo}`);
    await db
      .from("email_log")
      .insert({ user_id: userId, template: "boas-vindas", status: motivo });
    return { ok: false, status: motivo };
  }

  return enviarEmail(db, {
    chave: "boas-vindas",
    para: email,
    userId,
    dados: { nome: primeiroNome(nome), link: r.link },
  });
}

/**
 * "Esqueci minha senha": gera o link de recuperação e manda o NOSSO template.
 *
 * Substitui o `resetPasswordForEmail` do Supabase, que saía pelo SMTP do Auth com teto de 30
 * mensagens por hora no projeto inteiro. Com 5.000 alunos entrando na mesma semana, o teto seria
 * atingido na primeira manhã, e quem pedisse depois receberia nada, sem erro na tela.
 *
 * Conta inexistente devolve `ok: false` SEM linha no log e sem e-mail. Quem chama não conta isso a
 * ninguém: a tela responde igual nos dois casos (ver `app/app/recuperar-senha/actions.ts`).
 *
 * `base` vem de quem chama, já decidida por `baseDoSite` (só `NEXT_PUBLIC_SITE_URL` em produção).
 */
export async function enviarRedefinicao(
  db: SupabaseClient,
  { email, base }: { email: string; base: string },
): Promise<Resultado> {
  // Sem convite aqui: pedir recuperação para um e-mail sem conta não pode CRIAR a conta, e o
  // `invite` do `generateLink` cria.
  const r = await gerarLinkDeSenha(db, email, base, false);
  if ("erro" in r) return { ok: false, status: "sem conta ou link recusado" };

  return enviarEmail(db, {
    chave: "redefinicao-senha",
    para: email,
    userId: r.userId,
    dados: { nome: primeiroNome(r.nome), link: r.link },
  });
}

/** O template do banco. Separado para a tela de pré-visualização reusar sem enviar nada. */
export async function carregarTemplate(
  db: SupabaseClient,
  chave: string,
): Promise<Template | null> {
  const { data, error } = await db
    .from("email_templates")
    .select("chave,assunto,corpo,cta,ativo,banner,banner_alt")
    .eq("chave", chave)
    .maybeSingle();
  if (error) {
    console.error(`[email] nao deu para ler o template ${chave}:`, error.message);
    return null;
  }
  return (data as Template) ?? null;
}

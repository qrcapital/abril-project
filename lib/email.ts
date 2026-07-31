// Envio de e-mail transacional. A camada que não existia: até 31/jul/2026 o projeto **não mandava
// e-mail nenhum**. O webhook do Guru gerava o link de acesso, escrevia uma linha no `email_log` e
// parava aí, então quem comprava não recebia nada.
//
// TRÊS DECISÕES QUE MOLDAM ESTE ARQUIVO:
//
// 1. **O cliente do Supabase entra por parâmetro**, como no `lib/prova-expiradas.ts`, e este módulo
//    não tem `server-only`. Ele precisa rodar em mais de um runtime: no Next (webhook, prova,
//    admin) e numa Netlify function agendada. Importar `lib/supabase/admin.ts` amarraria ele ao
//    bundle do Next, e o dia em que um cron precisar mandar e-mail seria um dia de refactor.
// 2. **`enviarEmail` nunca lança.** Ela é chamada de dentro do webhook de compra aprovada: se o
//    e-mail derrubasse o handler, o Guru receberia erro e reentregaria o evento, e uma falha de
//    entrega de e-mail viraria matrícula duplicada. Falha de e-mail é falha de e-mail.
// 3. **Toda tentativa vira linha no `email_log`**, sucesso ou fracasso. É o que faz a tela
//    `/admin/emails` valer alguma coisa: log que só registra sucesso responde a pergunta errada.
//
// SOBRE O PROVEDOR: Resend por HTTP, com `fetch`, e **nenhuma dependência nova**. O Resend já está
// configurado e validado neste projeto desde 28/jul (é o SMTP dos e-mails do Supabase Auth), então
// ele entrega hoje, sem esperar domínio verificado na AWS nem saída do sandbox do SES. A troca para
// o SES é este arquivo, e só ele: a assinatura SigV4 pede o SDK, e é a hora de adicioná-lo.

import type { SupabaseClient } from "@supabase/supabase-js";

import { renderizar, type Dados, type Template } from "./email-render.ts";

const ENDPOINT = "https://api.resend.com/emails";
const REMETENTE_PADRAO = "onboarding@resend.dev"; // o validado em homolog (AMBIENTES.md)

export type Resultado = { ok: boolean; status: string };

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

  const chaveApi = process.env.RESEND_API_KEY;
  if (!chaveApi) return falhar("sem RESEND_API_KEY no ambiente");

  const { assunto, html, texto } = renderizar(template, dados);

  try {
    const resposta = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chaveApi}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || REMETENTE_PADRAO,
        to: [para],
        subject: assunto,
        html,
        text: texto,
      }),
      // Sem teto, uma rede lenta pendura o webhook do Guru até o timeout da plataforma.
      signal: AbortSignal.timeout(10_000),
    });

    if (!resposta.ok) {
      const corpo = await resposta.text().catch(() => "");
      return falhar(`${resposta.status} ${corpo.slice(0, 80)}`);
    }
  } catch (e) {
    return falhar(e instanceof Error ? e.message : "erro de rede");
  }

  await registrar("enviado");
  return { ok: true, status: "enviado" };
}

/**
 * O e-mail de acesso: gera o link de criação de senha e manda o boas-vindas (PRD §14, template 3).
 *
 * MORA AQUI, e não no webhook que é o gatilho principal, porque tem **dois** chamadores: a compra
 * aprovada e o "reenviar acesso" do admin. A alternativa era a rota do admin importar do módulo de
 * um route handler, que funciona e é uma armadilha esperando alguém.
 *
 * O LINK É MONTADO COM O `hashed_token`, e não com o `action_link` que a resposta traz. Duas razões:
 * ele aponta direto para o nosso `/auth/confirm`, que é quem troca token por sessão, e não depende
 * do template "Invite user" do painel do Supabase, que era pendência de configuração aberta.
 *
 * Cada chamada gera um link NOVO. É por isso que reenviar acesso não é "mandar a mesma mensagem": o
 * token anterior pode ter expirado ou já ter sido usado.
 */
export async function enviarAcesso(
  db: SupabaseClient,
  { email, userId, nome }: { email: string; userId: string; nome?: string | null },
): Promise<Resultado> {
  const { data, error } = await db.auth.admin.generateLink({ type: "invite", email });
  const hash = data?.properties?.hashed_token;

  if (error || !hash) {
    // Sem link não faz sentido mandar o e-mail: ele existe para levar à criação da senha.
    const motivo = `falha: sem link de acesso (${error?.message ?? "sem hash"})`.slice(0, 120);
    console.error(`[email] boas-vindas para ${email}: ${motivo}`);
    await db
      .from("email_log")
      .insert({ user_id: userId, template: "boas-vindas", status: motivo });
    return { ok: false, status: motivo };
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return enviarEmail(db, {
    chave: "boas-vindas",
    para: email,
    userId,
    dados: {
      nome: (nome ?? "").trim().split(/\s+/)[0] ?? "",
      link: `${site}/auth/confirm?token_hash=${hash}&type=invite`,
    },
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

import { NextResponse, type NextRequest } from "next/server";

import { papelAtual } from "@/lib/admin";
import contato from "@/lib/contato.json";
import { carregarTemplate, enviarAcesso, enviarEmail } from "@/lib/email";
import { BANNER, renderizar, variaveisInvalidas, VARIAVEIS } from "@/lib/email-render";
import { NOTA_MINIMA } from "@/lib/prova-correcao";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Escreve os templates de e-mail, manda teste e reenvia acesso (PRD §14, PLANO-ADMIN §4.5).
 *
 * ┌─ LEIA ISTO ANTES DE MEXER ─────────────────────────────────────────────────────────────┐
 * │ A CHECAGEM DE PAPEL AQUI DENTRO É O ÚNICO GUARDA DESTA ROTA, incluindo o GET.            │
 * │                                                                                         │
 * │ Route handler não passa por layout, e esta rota **manda e-mail de verdade** para          │
 * │ endereço de terceiro. Sem o `papel !== "admin"` abaixo, qualquer pessoa logada usaria     │
 * │ o nosso remetente para disparar mensagem com a marca do curso.                           │
 * └─────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * O GET é a pré-visualização: devolve o e-mail montado, com dados de exemplo, para abrir numa aba.
 * Renderiza o que está **salvo**, não o que está no formulário, então o fluxo é salvar e depois
 * olhar. Um preview do rascunho exigiria POST e um segundo caminho de render; o ganho não paga.
 */

const DESTINO = "/admin/emails";
const UUID = /^[0-9a-f-]{36}$/i;

/** Mesma regra do endereço de material do curso: URL completa, ou caminho do próprio site. */
const ENDERECO_OK = /^(https?:\/\/|\/)/i;

/**
 * O bucket do banner (migration `0011`). Público porque cliente de e-mail busca a imagem sem sessão,
 * de um proxy do Gmail ou do Outlook: URL assinada com validade não serve para e-mail.
 */
const BUCKET = "email";
const TIPOS = { "image/png": "png", "image/jpeg": "jpg" } as const;
/** O limite duro sai da constante compartilhada, para a tela e a rota nunca discordarem. O bucket
 *  repete o mesmo número na migration `0011`, para o dia em que existir um segundo caminho. */
const PESO_MAXIMO = BANNER.pesoMaximoKb * 1024;

/**
 * Sobe o arquivo e devolve a URL pública, ou uma mensagem de erro.
 *
 * O NOME LEVA UM CARIMBO DE TEMPO, e não é estética: proxy de imagem do Gmail e do Outlook guarda o
 * que já baixou, então trocar a arte mantendo o mesmo endereço deixa parte das pessoas vendo o banner
 * antigo por tempo indeterminado. Endereço novo é a única forma confiável de trocar.
 */
async function subirBanner(
  db: ReturnType<typeof createAdminClient>,
  chave: string,
  arquivo: File,
  anterior: string | null,
): Promise<{ url: string; apagar: string | null } | { erro: string }> {
  const extensao = TIPOS[arquivo.type as keyof typeof TIPOS];
  if (!extensao) {
    return {
      erro: "O banner precisa ser PNG ou JPG. WebP não renderiza no Outlook nem em Apple Mail antigo, então ficaria uma caixa vazia para parte de quem abre no desktop.",
    };
  }
  if (arquivo.size > PESO_MAXIMO) {
    return {
      erro: `O arquivo tem ${Math.round(arquivo.size / 1024)} KB e o limite é ${PESO_MAXIMO / 1024} KB. Exporte mais leve: banner pesado atrasa a abertura do e-mail.`,
    };
  }

  const caminho = `banners/${chave}-${Date.now()}.${extensao}`;
  const { error } = await db.storage
    .from(BUCKET)
    .upload(caminho, arquivo, { contentType: arquivo.type });
  if (error) return { erro: `O upload falhou (${error.message}).` };

  return {
    url: db.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl,
    // A arte anterior, se ela era nossa, para o chamador apagar DEPOIS de gravar. Apagar aqui
    // deixaria o e-mail apontando para um arquivo que não existe mais se a gravação falhasse.
    apagar: anterior?.match(new RegExp(`/${BUCKET}/(banners/[^?]+)`))?.[1] ?? null,
  };
}

function voltar(req: NextRequest, params: Record<string, string>) {
  const url = new URL(params.para ?? DESTINO, req.url);
  for (const [k, v] of Object.entries(params)) if (v && k !== "para") url.searchParams.set(k, v);
  // 303: o POST vira GET na volta, senão recarregar a tela repete a ação. Numa rota que manda
  // e-mail, repetir por recarregar significa mandar de novo.
  return NextResponse.redirect(url, 303);
}

/**
 * Dados de exemplo da pré-visualização e do teste. O `link` de cada um aponta para o mesmo lugar do
 * envio real (menos o token, que é de verdade só no de verdade), para o teste exercitar o caminho
 * que o aluno vai percorrer.
 */
function dadosExemplo(chave: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const link =
    chave === "boas-vindas"
      ? `${site}/auth/confirm?token_hash=EXEMPLO&type=invite`
      : chave === "resultado-aprovado"
        ? `${site}/app/certificado`
        : contato.whatsapp;
  return { nome: "Ana", nota: 82, minimo: NOTA_MINIMA, link };
}

export async function GET(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });

  const chave = req.nextUrl.searchParams.get("chave") ?? "";
  if (!VARIAVEIS[chave]) return new NextResponse(null, { status: 404 });

  const db = createAdminClient();
  const template = await carregarTemplate(db, chave);
  if (!template) return new NextResponse("template não encontrado", { status: 404 });

  const { assunto, html } = renderizar(template, dadosExemplo(chave));
  // O assunto não aparece no corpo do e-mail, então a prévia o mostra numa faixa: metade do
  // trabalho de escrever e-mail é o assunto, e revisar sem ele seria revisar meio e-mail.
  const faixa =
    `<div style="font:13px/1.5 'Helvetica Neue',Arial,sans-serif;background:#0B2D20;color:#D9BE85;` +
    `padding:10px 16px">Assunto: <strong style="color:#F7F5F2">${assunto}</strong>` +
    `<span style="float:right;opacity:.7">prévia com dados de exemplo</span></div>`;

  return new NextResponse(html.replace(/(<body[^>]*>)/, `$1${faixa}`), {
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Content-Type-Options": "nosniff" },
  });
}

export async function POST(req: NextRequest) {
  const autor = await papelAtual();
  if (autor.papel !== "admin") return new NextResponse(null, { status: 404 });

  const form = await req.formData();
  const texto = (campo: string) => String(form.get(campo) ?? "").trim();
  const acao = texto("acao");
  const chave = texto("chave");
  const db = createAdminClient();

  switch (acao) {
    case "salvar": {
      if (!VARIAVEIS[chave]) return voltar(req, { erro: "Template desconhecido." });
      const assunto = texto("assunto");
      const corpo = texto("corpo");
      // Todo erro daqui para baixo volta com `abrir`, para o acordeão reabrir no template certo.
      // ponytail: o texto digitado se perde, porque a tela não tem JS e o redirect não carrega
      // rascunho. O erro diz exatamente o que trocar e o corpo tem três linhas; se um dia
      // alguém reclamar, o caminho é devolver o rascunho num campo oculto.
      const falha = (msg: string) => voltar(req, { erro: msg, abrir: chave });
      if (!assunto) return falha("O assunto não pode ficar vazio.");
      if (!corpo) return falha("O corpo não pode ficar vazio.");

      // A recusa acontece na EDIÇÃO, não no envio: variável fora do contrato viraria um branco no
      // meio da frase na caixa de entrada de alguém, e ninguém saberia.
      const invalidas = variaveisInvalidas(`${assunto}\n${corpo}`, chave);
      if (invalidas.length > 0) {
        return falha(
          `Este template não tem ${invalidas.map((v) => `{{${v}}}`).join(", ")}. Disponíveis: ${VARIAVEIS[chave].map((v) => `{{${v}}}`).join(", ")}.`,
        );
      }

      // O banner vem por UPLOAD ou por endereço colado, e o arquivo ganha quando os dois vêm: quem
      // acabou de escolher um arquivo está trocando a arte, não reafirmando a antiga.
      const bannerAlt = texto("banner_alt");
      let banner = texto("banner");
      const arquivo = form.get("banner_arquivo");
      const temArquivo = arquivo instanceof File && arquivo.size > 0;

      // O banner é opcional, mas não pela metade. Sem alt, o e-mail abre com uma caixa muda no topo
      // para quem bloqueia imagem (Outlook desktop, e Gmail configurado assim), que é justamente
      // quem mais precisa da frase.
      //
      // AS DUAS RECUSAS VÊM ANTES DO UPLOAD, de propósito: subir primeiro e recusar depois deixaria
      // um arquivo órfão no bucket a cada tentativa malsucedida.
      if ((banner || temArquivo) && !bannerAlt) {
        return falha(
          "Descreva o banner no texto alternativo. É ele que aparece quando o cliente de e-mail bloqueia imagem.",
        );
      }
      if (banner && !temArquivo && !ENDERECO_OK.test(banner)) {
        return falha(`O endereço do banner precisa começar com https:// ou /. Medida: ${BANNER.larguraArquivo}x${BANNER.alturaArquivo}px.`);
      }

      let apagarAntigo: string | null = null;
      if (temArquivo) {
        const atual = await carregarTemplate(db, chave);
        const r = await subirBanner(db, chave, arquivo as File, atual?.banner ?? null);
        if ("erro" in r) return falha(r.erro);
        banner = r.url;
        apagarAntigo = r.apagar;
      }

      const { error } = await db
        .from("email_templates")
        .update({
          assunto,
          corpo,
          cta: texto("cta") || null,
          banner: banner || null,
          // Alt sem banner não serve para nada e viraria sujeira na próxima edição.
          banner_alt: banner ? bannerAlt : null,
          ativo: form.get("ativo") === "on",
          updated_at: new Date().toISOString(),
        })
        .eq("chave", chave);
      if (error) return falha("A gravação falhou.");

      // Agora sim: o e-mail já aponta para a arte nova, então a antiga pode sair. Falha aqui é só
      // um arquivo a mais no bucket, e não vale interromper um save que deu certo.
      if (apagarAntigo) await db.storage.from(BUCKET).remove([apagarAntigo]);

      return voltar(req, { ok: "salvo", abrir: chave });
    }

    case "teste": {
      if (!VARIAVEIS[chave]) return voltar(req, { erro: "Template desconhecido." });
      if (!autor.email) return voltar(req, { erro: "Sua conta não tem e-mail para receber o teste." });

      const r = await enviarEmail(db, {
        chave,
        para: autor.email,
        userId: autor.id,
        dados: dadosExemplo(chave),
        teste: true,
      });
      return r.ok
        ? voltar(req, { ok: "teste", abrir: chave })
        : voltar(req, { erro: `O teste não saiu (${r.status}).`, abrir: chave });
    }

    case "reenviar-acesso": {
      const alvo = texto("userId");
      if (!UUID.test(alvo)) return voltar(req, { erro: "Pedido inválido." });

      // O e-mail vem de `auth.users`, não do formulário: aceitar destinatário por POST daria a
      // qualquer admin um disparador para endereço arbitrário com a nossa marca.
      const { data: conta, error: erroConta } = await db.auth.admin.getUserById(alvo);
      if (erroConta || !conta?.user?.email) {
        return voltar(req, { erro: "Não achei essa conta.", para: `/admin/alunos/${alvo}` });
      }

      // Link NOVO a cada reenvio, e é por isso que reenviar não é "mandar a mesma mensagem": o
      // token do link anterior pode ter expirado ou sido usado.
      const r = await enviarAcesso(db, {
        email: conta.user.email,
        userId: alvo,
        nome: (conta.user.user_metadata?.nome as string | undefined) ?? null,
      });
      return r.ok
        ? voltar(req, { ok: "acesso", para: `/admin/alunos/${alvo}` })
        : voltar(req, { erro: `O e-mail não saiu (${r.status}).`, para: `/admin/alunos/${alvo}` });
    }

    default:
      return voltar(req, { erro: "Pedido inválido." });
  }
}

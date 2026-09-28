import "server-only";

import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Gravação e leitura do aceite dos documentos (migration `0023`).
 *
 * Existe porque a Abril perguntou se o log de consentimento fica sob nossa responsabilidade, e a
 * resposta foi sim. Antes disto o aceite acontecia no checkout do Guru e na base do RD Station, e
 * nós não tínhamos registro nenhum.
 *
 * ┌─ A REGRA QUE GOVERNA ESTE ARQUIVO ────────────────────────────────────────────────────────────┐
 * │ NADA AQUI PODE DERRUBAR O FLUXO DE QUEM ESTÁ ENTRANDO. Se a gravação falhar, o aluno termina   │
 * │ de criar a senha e entra no curso, e a falha grita no log do servidor. O contrário — recusar a │
 * │ entrada de quem pagou porque um insert falhou — troca um problema de registro por um problema  │
 * │ de operação, e quem clicou não tem o que fazer com esse erro.                                  │
 * │                                                                                                │
 * │ A ÚNICA exceção é a caixa em si: se a pessoa NÃO marcou, aí sim recusa, porque nesse caso não  │
 * │ há consentimento para registrar. Uma coisa é não conseguir gravar o aceite, outra é não ter    │
 * │ aceite.                                                                                        │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 */

export type TipoDocumento = "politica" | "termos";
export type Origem = "primeiro-acesso" | "lista-de-espera" | "signup-homolog";

/**
 * A frase que fica ao lado da caixa, e que vai congelada em cada linha do log.
 *
 * Mora aqui, e não no JSX, porque o que se grava precisa ser exatamente o que se mostra. Com a
 * frase escrita em dois lugares, o dia em que alguém melhorar o texto da tela sem lembrar do log é
 * o dia em que o log passa a mentir sobre o que a pessoa leu.
 */
export const TEXTO_ACEITE =
  "Li e aceito os Termos de Uso e a Política de Privacidade, e autorizo o tratamento dos meus dados pessoais nas condições descritas nesses documentos.";

/**
 * A frase ao lado da caixa da `/lista-de-espera`.
 *
 * HISTÓRIA CURTA, PORQUE ELA SE INVERTEU DUAS VEZES: a tela nasceu com caixa, a caixa saiu e o
 * consentimento virou o próprio envio (aviso acima do botão, sem atrito de topo de funil), e em
 * 28/set/2026 a caixa voltou, a pedido do jurídico da Abril, que nomeou o checkbox ao perguntar
 * pelo log de consentimento.
 *
 * O texto acompanhou a inversão: era "Ao enviar, você autoriza", descrevendo um ato que acontecia
 * no botão, e virou "Autorizo", na primeira pessoa, porque agora o ato é marcar a caixa. Gravar
 * "ao enviar, você autoriza" num log colhido por checkbox descreveria errado o que a pessoa fez.
 *
 * Tem de ser igual ao JSX do `Formulario.tsx`, palavra por palavra: é isto que vai congelado em
 * `consents.texto`, e o valor do log é justamente ser o que estava na tela.
 */
export const TEXTO_AVISO_LISTA =
  "Autorizo o contato da VEJA Negócios e do BlockTrends sobre esta formação e concordo com a Política de Privacidade · LGPD.";

/** Pendência da publicação no domínio final. Vazio: o nome sai sem link, que é melhor que link morto. */
export const URL_POLITICA = process.env.NEXT_PUBLIC_POLITICA_PRIVACIDADE_URL ?? "";
export const URL_TERMOS = process.env.NEXT_PUBLIC_TERMOS_USO_URL ?? "";

type Versao = { id: string; tipo: TipoDocumento; versao: string };

/**
 * As versões vigentes dos dois documentos.
 *
 * A fonte da verdade é a tabela, não uma constante no código: quando a Abril publicar uma revisão,
 * quem muda é uma linha de `consent_documents`, sem deploy. O custo é uma consulta, e ela acontece
 * uma vez por aceite, não por página.
 *
 * Devolve `[]` se a consulta falhar, e quem chama trata isso como "não dá para registrar agora".
 */
export async function versoesVigentes(db: SupabaseClient): Promise<Versao[]> {
  const { data, error } = await db
    .from("consent_documents")
    .select("id, tipo, versao, vigente_desde")
    .lte("vigente_desde", new Date().toISOString())
    .order("vigente_desde", { ascending: false });

  if (error) {
    console.error("[consentimento] nao deu para ler as versoes vigentes:", error.message);
    return [];
  }

  // Uma por tipo, a mais recente. A ordenação acima já põe a vigente na frente, então o primeiro
  // de cada tipo vence e os antigos são descartados.
  const porTipo = new Map<string, Versao>();
  for (const d of data ?? []) if (!porTipo.has(d.tipo)) porTipo.set(d.tipo, d as Versao);
  return [...porTipo.values()];
}

/**
 * O endereço de quem está do outro lado, do jeito mais confiável que este ambiente permite.
 *
 * Ordem deliberada. `x-nf-client-connection-ip` é posto pela própria Netlify e o cliente não
 * consegue forjá-lo; `x-forwarded-for` é uma lista em que o PRIMEIRO item é o cliente e o resto são
 * proxies, e ela aceita o que o cliente mandar se não houver um proxy reescrevendo na frente. Por
 * isso o cabeçalho da Netlify vem primeiro.
 *
 * Devolve `null` em vez de um palpite quando nada serve. IP errado num log de consentimento é pior
 * que IP ausente: o ausente se explica, o errado aponta para outra pessoa.
 */
export async function ipDaRequisicao(): Promise<string | null> {
  const h = await headers();
  const bruto =
    h.get("x-nf-client-connection-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0] ??
    "";
  const ip = bruto.trim();
  if (!ip) return null;

  // A coluna é `inet`: lixo aqui faz o insert estourar e o consentimento não ser registrado.
  // IPv4, IPv6, e IPv4 embrulhado em IPv6 (`::ffff:187.1.2.3`), que é o que aparece atrás de
  // proxy em pilha dupla.
  const v4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const v6 = /^[0-9a-fA-F:]+$/;
  if (v4.test(ip)) return ip;
  if (ip.startsWith("::ffff:") && v4.test(ip.slice(7))) return ip.slice(7);
  if (v6.test(ip) && ip.includes(":")) return ip;
  return null;
}

/** O user agent, aparado. Cabeçalho é texto de terceiro: 400 caracteres é folga de sobra e teto. */
export async function userAgentDaRequisicao(): Promise<string | null> {
  const h = await headers();
  return h.get("user-agent")?.slice(0, 400) || null;
}

/**
 * Grava o aceite dos DOIS documentos, uma linha para cada.
 *
 * Duas linhas e não uma com os dois tipos juntos porque as versões caminham separadas: a Política
 * pode ser revisada sem os Termos, e no dia seguinte a pergunta "esta pessoa aceitou a política
 * v2?" precisa de uma resposta por documento.
 *
 * Não lança. Devolve quantas linhas entraram, para quem chamou poder gritar no log sem interromper
 * o que a pessoa estava fazendo. Ver a regra no topo do arquivo.
 */
export async function registrarConsentimento(
  db: SupabaseClient,
  dados: {
    email: string;
    nome?: string | null;
    origem: Origem;
    userId?: string | null;
    guruOrderId?: string | null;
    /** A frase que estava na tela. Só omita quando a tela mostrou o `TEXTO_ACEITE` literal. */
    texto?: string;
    /**
     * Quais documentos esta tela colheu. O padrão são os dois, que é o caso da plataforma.
     *
     * A pré-lista passa só `["politica"]`, e isso não é economia: quem entra numa lista de espera
     * não contratou curso nenhum, então registrar aceite dos Termos de Uso ali seria inventar um
     * consentimento que a pessoa não deu. Log que infla é tão ruim quanto log que falta.
     */
    tipos?: TipoDocumento[];
  },
): Promise<number> {
  const todas = await versoesVigentes(db);
  const versoes = dados.tipos ? todas.filter((v) => dados.tipos!.includes(v.tipo)) : todas;
  if (versoes.length === 0) {
    console.error("[consentimento] sem versao vigente em consent_documents; aceite NAO registrado");
    return 0;
  }

  const [ip, userAgent] = await Promise.all([ipDaRequisicao(), userAgentDaRequisicao()]);

  const linhas = versoes.map((v) => ({
    user_id: dados.userId ?? null,
    email: dados.email,
    nome: dados.nome ?? null,
    origem: dados.origem,
    documento_id: v.id,
    documento_tipo: v.tipo,
    documento_versao: v.versao,
    texto: dados.texto ?? TEXTO_ACEITE,
    ip,
    user_agent: userAgent,
    guru_order_id: dados.guruOrderId ?? null,
  }));

  const { error } = await db.from("consents").insert(linhas);
  if (error) {
    // Grita com tudo que permite recuperar a linha à mão se for preciso, menos o que não deve
    // viver em log de servidor. O e-mail entra porque sem ele o aviso não serve para nada.
    console.error(
      `[consentimento] falhou para ${dados.email} (${dados.origem}):`,
      error.message,
    );
    return 0;
  }
  return linhas.length;
}

/**
 * Esta conta já aceitou TODAS as versões vigentes?
 *
 * É a pergunta que o gate da sala faz. "Todas" e não "alguma": quando a Política é revisada e os
 * Termos não, quem aceitou os dois no ano passado precisa aceitar só a Política nova, e continuar
 * entrando sem atrito seria ignorar a revisão.
 *
 * Em caso de erro de consulta devolve `true`, ou seja, deixa passar. É a mesma regra do topo do
 * arquivo aplicada à leitura: um banco indisponível não pode virar uma porta trancada na cara de
 * quem pagou pelo curso.
 */
export async function aceitouVigente(db: SupabaseClient, userId: string): Promise<boolean> {
  const versoes = await versoesVigentes(db);
  if (versoes.length === 0) return true;

  const { data, error } = await db
    .from("consents")
    .select("documento_tipo, documento_versao")
    .eq("user_id", userId);

  if (error) {
    console.error("[consentimento] nao deu para conferir o aceite:", error.message);
    return true;
  }

  const tem = new Set((data ?? []).map((c) => `${c.documento_tipo}@${c.documento_versao}`));
  return versoes.every((v) => tem.has(`${v.tipo}@${v.versao}`));
}

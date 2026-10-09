// Eventos de entrega do SES: a leitura do JSON que o SES publica no tópico SNS e o rótulo que o admin
// mostra ao lado de cada e-mail. **Puro, sem IO**: a rota `app/api/webhooks/ses` grava o que sai de
// `linhasDoEventoSes`, e a página do aluno chama `situacaoEntrega`. Guarda em `npm run check:sns`.
//
// ┌─ O QUE ISTO RESPONDE QUE O `email_log` NÃO RESPONDIA ────────────────────────────────────────┐
// │ "enviado" no `email_log` quer dizer só que a API do SES aceitou o pedido. Daí em diante o SES │
// │ tenta entregar ao servidor do destinatário, e o servidor pode aceitar (Delivery), adiar       │
// │ (DeliveryDelay, típico do Outlook quando desconfia do IP) ou devolver (Bounce). Sem estes     │
// │ eventos, um e-mail adiado por três dias e depois descartado aparecia como "enviado" para      │
// │ sempre, e foi assim com uma aluna do @outlook.com em out/2026.                                │
// └───────────────────────────────────────────────────────────────────────────────────────────────┘
//
// Formato de referência: "Contents of event data that Amazon SES publishes to Amazon SNS". O evento
// de configuration set traz `eventType`; a notificação por identidade (o outro jeito de ligar avisos
// no SES) traz `notificationType` com o mesmo miolo. Os dois são aceitos.

/** Uma linha de `email_eventos`, como a rota grava. */
export type LinhaEventoSes = {
  ses_message_id: string;
  tipo: string;
  destinatario: string | null;
  detalhe: string | null;
  ocorrido_em: string | null;
};

/** Teto do `detalhe`: um resumo para leitura humana, não o evento inteiro. */
export const TETO_DETALHE = 500;

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : null);
const txt = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);
const lista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** Junta as partes presentes com "; " e corta no teto. Espaço repetido e quebra de linha viram um. */
function resumo(...partes: (string | null | undefined)[]): string | null {
  const s = partes
    .filter((p): p is string => Boolean(p))
    .join("; ")
    .replace(/\s+/g, " ")
    .trim();
  return s ? s.slice(0, TETO_DETALHE) : null;
}

/** Data ISO válida ou `null`. O SES manda ISO 8601; qualquer outra coisa não vira timestamptz. */
function quando(...candidatos: unknown[]): string | null {
  for (const c of candidatos) {
    const s = txt(c);
    if (s && !Number.isNaN(Date.parse(s))) return new Date(s).toISOString();
  }
  return null;
}

const minusculo = (e: string | null) => (e ? e.toLowerCase() : null);

/**
 * Transforma o `Message` (já como objeto) num conjunto de linhas, uma por destinatário afetado.
 *
 * Bounce, Complaint e DeliveryDelay trazem a lista de quem foi afetado, com o diagnóstico de cada
 * um; Delivery traz `recipients`; Send, Reject e Rendering Failure não trazem lista, e caem no
 * `mail.destination`. Os nossos transacionais têm um destinatário só, mas a regra vale para N.
 *
 * Devolve `[]` para o que não é evento do SES reconhecível (sem `mail.messageId` ou sem tipo).
 */
export function linhasDoEventoSes(evento: unknown): LinhaEventoSes[] {
  const e = obj(evento);
  if (!e) return [];
  const mail = obj(e.mail);
  const sesMessageId = txt(mail?.messageId);
  const tipo = txt(e.eventType) ?? txt(e.notificationType);
  if (!sesMessageId || !tipo) return [];

  const destino = lista(mail?.destination).map(txt).filter((d): d is string => Boolean(d));
  const doEnvio = quando(mail?.timestamp);
  const linha = (destinatario: string | null, detalhe: string | null, ocorrido: string | null): LinhaEventoSes => ({
    ses_message_id: sesMessageId,
    tipo,
    destinatario: minusculo(destinatario),
    detalhe,
    ocorrido_em: ocorrido ?? doEnvio,
  });
  /** Uma linha por endereço da lista do evento; lista vazia cai no destino do envio. */
  const porDestinatario = (itens: unknown[], detalheDe: (i: Obj) => string | null, ocorrido: string | null) => {
    const linhas = itens
      .map(obj)
      .filter((i): i is Obj => i !== null)
      .map((i) => linha(txt(i.emailAddress), detalheDe(i), ocorrido));
    return linhas.length ? linhas : (destino.length ? destino : [null]).map((d) => linha(d, detalheDe({}), ocorrido));
  };

  switch (tipo) {
    case "Bounce": {
      const b = obj(e.bounce) ?? {};
      const classe = [txt(b.bounceType), txt(b.bounceSubType)].filter(Boolean).join("/") || null;
      return porDestinatario(
        lista(b.bouncedRecipients),
        (r) => resumo(classe, txt(r.status), txt(r.diagnosticCode)),
        quando(b.timestamp),
      );
    }
    case "DeliveryDelay": {
      const d = obj(e.deliveryDelay) ?? {};
      const expira = txt(d.expirationTime);
      return porDestinatario(
        lista(d.delayedRecipients),
        (r) => resumo(txt(d.delayType), txt(r.status), txt(r.diagnosticCode), expira ? `desiste em ${expira}` : null),
        quando(d.timestamp),
      );
    }
    case "Complaint": {
      const c = obj(e.complaint) ?? {};
      return porDestinatario(
        lista(c.complainedRecipients),
        () => resumo(txt(c.complaintFeedbackType), txt(c.complaintSubType)),
        quando(c.timestamp, c.arrivalDate),
      );
    }
    case "Delivery": {
      const d = obj(e.delivery) ?? {};
      const recipientes = lista(d.recipients).map((r) => ({ emailAddress: r }));
      return porDestinatario(recipientes, () => resumo(txt(d.smtpResponse), txt(d.reportingMTA)), quando(d.timestamp));
    }
    case "Reject": {
      const r = obj(e.reject) ?? {};
      return porDestinatario([], () => resumo(txt(r.reason)), null);
    }
    case "Rendering Failure": {
      const f = obj(e.failure) ?? {};
      return porDestinatario([], () => resumo(txt(f.templateName), txt(f.errorMessage)), null);
    }
    default:
      // Send e o que vier a existir: registra com o destino do envio e sem detalhe.
      return porDestinatario([], () => null, null);
  }
}

// ------------------------------------------------------------------------------------------------
// O rótulo do admin
// ------------------------------------------------------------------------------------------------

export type EventoGravado = { tipo: string; detalhe: string | null; ocorrido_em: string | null };

export type Situacao = {
  /** O texto curto da tela: "entregue 09/10 13:12", "adiado: caixa cheia". */
  rotulo: string;
  /** Tom do selo, na tabela de tons do admin. */
  tom: "ok" | "atencao" | "ruim" | "neutro";
  /** O detalhe técnico do evento que decidiu, para o `title` (diagnóstico SMTP, por exemplo). */
  detalhe: string | null;
};

/**
 * Qual evento decide a situação de um e-mail. Ordem de gravidade, não de chegada: uma reclamação de
 * spam depois da entrega é a notícia, e um atraso seguido de entrega já não interessa.
 */
const PRIORIDADE = ["Complaint", "Bounce", "Reject", "Rendering Failure", "Delivery", "DeliveryDelay", "Send"];

/** Os códigos que o SES usa no `delayType` e no par `bounceType/bounceSubType`, em português. */
const MOTIVO: Record<string, string> = {
  // DeliveryDelay.delayType
  InternalFailure: "falha interna do SES",
  General: "motivo geral",
  MailboxFull: "caixa cheia",
  SpamDetected: "filtro de spam do destinatário",
  RecipientServerError: "servidor do destinatário recusou por ora",
  IPFailure: "IP de envio bloqueado ou limitado",
  TLSFailure: "falha de TLS",
  BYOIPHostNameLookupUnavailable: "falha de DNS do IP próprio",
  Undetermined: "motivo não informado",
  SendingDeliveryQuotaExceeded: "cota de envio da conta",
  // Bounce
  "Permanent/General": "permanente",
  "Permanent/NoEmail": "endereço não existe",
  "Permanent/Suppressed": "endereço na lista de supressão do SES",
  "Permanent/OnAccountSuppressionList": "endereço na lista de supressão da conta",
  "Transient/General": "temporário",
  "Transient/MailboxFull": "caixa cheia",
  "Transient/MessageTooLarge": "mensagem grande demais",
  "Transient/ContentRejected": "conteúdo recusado",
  "Transient/AttachmentRejected": "anexo recusado",
  "Undetermined/Undetermined": "motivo não informado",
};

/** O código é o primeiro trecho do detalhe (antes do primeiro ";"), que é como a rota grava. */
const codigoDo = (detalhe: string | null) => (detalhe ?? "").split(";")[0].trim();

/** "09/10 13:12" no horário de Brasília. A função da Netlify roda em UTC. */
export function horaCurta(iso: string | null, fuso = "America/Sao_Paulo"): string {
  if (!iso || Number.isNaN(Date.parse(iso))) return "";
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: fuso,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const p = (t: string) => partes.find((x) => x.type === t)?.value ?? "";
  return `${p("day")}/${p("month")} ${p("hour")}:${p("minute")}`;
}

/**
 * A situação de entrega de um e-mail a partir dos eventos gravados para o `ses_message_id` dele.
 *
 * `temId` separa dois silêncios diferentes: e-mail sem `ses_message_id` (antes deste rastreio, ou
 * enviado pelo Resend) não tem como ter evento; e-mail com id e sem evento ainda não teve retorno,
 * ou o configuration set não está ligado no ambiente.
 */
export function situacaoEntrega(eventos: EventoGravado[], temId: boolean): Situacao {
  if (!temId) return { rotulo: "sem rastreio", tom: "neutro", detalhe: null };
  if (eventos.length === 0) return { rotulo: "sem retorno do SES ainda", tom: "neutro", detalhe: null };

  // Dentro do mesmo tipo, o mais recente.
  const ordenados = [...eventos].sort((a, b) => {
    const pa = PRIORIDADE.indexOf(a.tipo);
    const pb = PRIORIDADE.indexOf(b.tipo);
    const ra = pa === -1 ? PRIORIDADE.length : pa;
    const rb = pb === -1 ? PRIORIDADE.length : pb;
    if (ra !== rb) return ra - rb;
    return (b.ocorrido_em ?? "").localeCompare(a.ocorrido_em ?? "");
  });
  const e = ordenados[0];
  const hora = horaCurta(e.ocorrido_em);
  const codigo = codigoDo(e.detalhe);
  const motivo = MOTIVO[codigo] ?? (codigo || "motivo não informado");

  switch (e.tipo) {
    case "Delivery":
      return { rotulo: `entregue ${hora}`.trim(), tom: "ok", detalhe: e.detalhe };
    case "DeliveryDelay":
      return { rotulo: `adiado: ${motivo}`, tom: "atencao", detalhe: e.detalhe };
    case "Bounce":
      return { rotulo: `devolvido: ${motivo}`, tom: "ruim", detalhe: e.detalhe };
    case "Complaint":
      return { rotulo: "marcado como spam pelo destinatário", tom: "ruim", detalhe: e.detalhe };
    case "Reject":
      return { rotulo: `rejeitado pelo SES: ${e.detalhe ?? "motivo não informado"}`, tom: "ruim", detalhe: e.detalhe };
    case "Rendering Failure":
      return { rotulo: "falha ao montar o e-mail no SES", tom: "ruim", detalhe: e.detalhe };
    case "Send":
      return { rotulo: "aceito pelo SES, sem retorno do destinatário", tom: "neutro", detalhe: null };
    default:
      return { rotulo: e.tipo, tom: "neutro", detalhe: e.detalhe };
  }
}

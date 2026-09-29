// A parte pura do webhook do Guru: conferência do token, leitura do payload e filtro de produto.
// **Sem IO, sem Next, sem Supabase**, pela regra do AGENTS.md: é o que deixa `npm run check:guru`
// exercitar o formato real do Guru em node puro. O IO mora em `app/api/webhooks/guru/route.ts`.
//
// O formato vem da documentação de webhooks de vendas do Digital Manager Guru
// (api.docs.digitalmanager.guru, "webhooks-vendas"): `webhook_type`, `id` da transação, `status`,
// `contact.{id,name,email,phone_number,phone_local_code,doc}`,
// `product.{id,marketplace_id,offer.id,name}`, e o `api_token` da conta no próprio corpo.

import { createHash, timingSafeEqual } from "node:crypto";

export type AcaoGuru = "aprovado" | "reembolso" | "chargeback" | "ignorar";

export type EventoGuru = {
  acao: AcaoGuru;
  /** Por que foi ignorado, quando foi. Vai para `guru_events.resultado`. */
  motivo: string | null;
  webhookType: string | null;
  status: string | null;
  /** O `id` da transação. É o `guru_order_id` da matrícula e a chave de idempotência. */
  transacaoId: string | null;
  email: string | null;
  nome: string | null;
  telefone: string | null;
  contatoId: string | null;
  /** Todo identificador de produto que o evento traz, para o filtro por lista. */
  produtos: string[];
};

/**
 * Status do Guru que viram ação aqui. LISTA EXATA, e não mais expressão regular.
 *
 * A versão anterior casava `/approv|paid|aprovad/`, e isso é perigoso num lugar que concede acesso:
 * qualquer status futuro com "paid" no nome (um "unpaid", digamos) viraria matrícula ativa. Com a
 * lista fechada, status novo é ignorado com 200 até alguém decidir o que ele significa.
 *
 * `completed` (a "Completa" do painel do Guru) concede acesso também. Se ele chegar depois de um
 * `approved` da mesma transação, a idempotência por `guru_order_id` faz dele um nada.
 */
const STATUS: Record<string, Exclude<AcaoGuru, "ignorar">> = {
  approved: "aprovado",
  completed: "aprovado",
  refunded: "reembolso",
  chargeback: "chargeback",
};

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const str = (v: unknown): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s ? s : null;
};

/**
 * O token confere? Comparação em tempo constante E sem vazar o tamanho: os dois lados viram hash
 * SHA-256 antes do `timingSafeEqual`, que exige buffers do mesmo tamanho e lançaria (ou, com um
 * `if` de tamanho na frente, responderia mais rápido para token de tamanho errado).
 */
export function tokenConfere(recebido: unknown, esperado: string): boolean {
  if (typeof recebido !== "string" || !recebido || !esperado) return false;
  const h = (s: string) => createHash("sha256").update(s, "utf8").digest();
  return timingSafeEqual(h(recebido), h(esperado));
}

/**
 * O payload sem o `api_token`, em qualquer nível. É o que vai para `guru_events.payload`: o token
 * da conta não pode morar numa tabela que entra em backup e em CSV.
 */
export function semToken(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(semToken);
  if (v && typeof v === "object") {
    const saida: Obj = {};
    for (const [k, valor] of Object.entries(v as Obj)) {
      if (k.toLowerCase() === "api_token") continue;
      saida[k] = semToken(valor);
    }
    return saida;
  }
  return v;
}

/**
 * Lê o payload do Guru num evento interno.
 *
 * `webhook_type` é EXIGIDO e tem de ser `transaction`: o Guru usa a mesma URL para assinatura e
 * carrinho abandonado, conforme o que se marca no painel, e nenhum desses concede acesso.
 *
 * Os nomes antigos (`data.*`, `customer`, `order_id`, `contact.phone`) ficam como segunda opção
 * para os campos de dado, não para os de decisão. Foram o palpite de antes da documentação, e não
 * custam nada; o que decide conceder acesso (tipo e status) só lê o formato documentado.
 */
export function normalizarGuru(payload: unknown): EventoGuru {
  const p = obj(payload);
  const d = Object.keys(obj(p.data)).length ? obj(p.data) : p;
  const contato = Object.keys(obj(d.contact)).length ? obj(d.contact) : obj(d.customer);
  const produto = obj(d.product);
  const oferta = obj(produto.offer);

  const webhookType = str(p.webhook_type ?? d.webhook_type);
  const status = str(d.status)?.toLowerCase() ?? null;

  const ddd = str(contato.phone_local_code);
  const numero = str(contato.phone_number);
  const telefone = numero ? `${ddd ?? ""}${numero}`.replace(/\D/g, "") || null : str(contato.phone ?? contato.telefone);

  const produtos = [
    produto.id,
    produto.marketplace_id,
    oferta.id,
    d.product_id,
    d.offer_id,
  ]
    .map(str)
    .filter((x): x is string => Boolean(x));

  const base = {
    webhookType,
    status,
    transacaoId: str(d.id ?? d.order_id ?? d.transaction ?? p.order_id),
    email: str(contato.email ?? d.email)?.toLowerCase() ?? null,
    nome: str(contato.name ?? contato.nome ?? d.name),
    telefone,
    contatoId: str(contato.id ?? d.customer_id),
    produtos: [...new Set(produtos)],
  };

  if (webhookType !== "transaction") {
    return { ...base, acao: "ignorar", motivo: `webhook_type ${webhookType ?? "ausente"}` };
  }
  const acao = status ? STATUS[status] : undefined;
  if (!acao) return { ...base, acao: "ignorar", motivo: `status ${status ?? "ausente"}` };
  return { ...base, acao, motivo: null };
}

/** A lista de `GURU_PRODUCT_IDS`, aparada e sem vazios. */
export const listaDeProdutos = (bruto: string | undefined): string[] =>
  (bruto ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * O evento é de um produto nosso? Lista vazia aceita tudo: o filtro pode estar no painel do Guru
 * (webhook configurado por produto), e aí esta é a segunda camada, não a única.
 */
export function produtoPermitido(produtos: string[], lista: string[]): boolean {
  if (lista.length === 0) return true;
  return produtos.some((p) => lista.includes(p));
}

import "server-only";

/**
 * Consulta de venda na API do Guru, para a página de compra aprovada não depender do webhook.
 *
 * ┌─ POR QUE (09/out/2026) ───────────────────────────────────────────────────────────────────────┐
 * │ O Guru manda o comprador para `/obrigado` no instante da aprovação, mas o webhook da mesma     │
 * │ venda chega de 25 s a 2 min depois (medido nas compras de teste). Esperar por ele deixava o   │
 * │ comprador olhando um "preparando" por minutos. A API do Guru já sabe da venda no instante da  │
 * │ aprovação: com o id que veio no redirecionamento, a gente busca a venda lá, confere status e  │
 * │ produto, e cria o acesso na hora. O webhook, quando chegar, encontra tudo pronto (idempotente).│
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Autentica com o User Token (`GURU_USER_TOKEN`, criado em Meu Perfil > Tokens API no Guru), que é
 * outro token, diferente do Account Token que vem dentro do webhook.
 *
 * NUNCA CONFIA NO FILTRO DA API: a resposta só vale se a transação devolvida tiver EXATAMENTE o id
 * pedido (`payment.marketplace_id` ou `id`). Se a API ignorasse um parâmetro e devolvesse a lista
 * toda, a primeira venda da lista não pode virar o acesso de quem está nesta página.
 */

const BASE = "https://digitalmanager.guru/api/v2";
const TEMPO_MS = 5000;

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ConsultaGuru = {
  /** A transação, no formato do webhook (com `webhook_type: "transaction"`), ou null. */
  transacao: Obj | null;
  /** Para diagnóstico: o que cada tentativa respondeu (status HTTP e quantos itens). */
  tentativas: { via: string; http: number | string; itens: number }[];
};

/** A transação é a pedida? Compara com o id da venda no marketplace e com o id do Guru. */
const bate = (t: Obj, v: string) => obj(t.payment).marketplace_id === v || t.id === v;

/** Os itens de uma resposta da API, aceitando lista em `data`, lista crua ou objeto único. */
function itens(corpo: unknown): Obj[] {
  if (Array.isArray(corpo)) return corpo.map(obj);
  const c = obj(corpo);
  if (Array.isArray(c.data)) return c.data.map(obj);
  if (c.data && typeof c.data === "object") return [obj(c.data)];
  if (c.id) return [c];
  return [];
}

const dia = (d: Date) => d.toISOString().slice(0, 10);

async function pedir(caminho: string, token: string): Promise<{ http: number | string; corpo: unknown }> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TEMPO_MS);
  try {
    const r = await fetch(`${BASE}${caminho}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: ctl.signal,
      cache: "no-store",
    });
    const corpo = await r.json().catch(() => null);
    return { http: r.status, corpo };
  } catch (e) {
    return { http: e instanceof Error && e.name === "AbortError" ? "tempo" : "rede", corpo: null };
  } finally {
    clearTimeout(t);
  }
}

/**
 * Busca a venda pelo id do redirecionamento. Melhor esforço: sem token, erro ou nada encontrado,
 * devolve `transacao: null` e quem chamou segue esperando o webhook, como antes.
 */
export async function buscarVendaNoGuru(v: string): Promise<ConsultaGuru> {
  const token = process.env.GURU_USER_TOKEN?.trim();
  const tentativas: ConsultaGuru["tentativas"] = [];
  if (!token) return { transacao: null, tentativas: [{ via: "sem GURU_USER_TOKEN", http: "-", itens: 0 }] };

  const hoje = new Date();
  const ontem = new Date(hoje.getTime() - 2 * 24 * 3600 * 1000);
  const amanha = new Date(hoje.getTime() + 24 * 3600 * 1000);
  const janela = `ordered_at_ini=${dia(ontem)}&ordered_at_end=${dia(amanha)}`;
  const q = encodeURIComponent(v);

  const caminhos: [string, string][] = UUID.test(v)
    ? [["id", `/transactions/${q}`]]
    : [
        // Testado em 09/out/2026: `marketplace_ids[]` responde 200 (a venda veio na lista);
        // `marketplace_id` responde 422. Fica em segundo só por garantia.
        ["marketplace_ids[]", `/transactions?marketplace_ids[]=${q}&${janela}`],
        ["marketplace_id", `/transactions?marketplace_id=${q}&${janela}`],
      ];

  for (const [via, caminho] of caminhos) {
    const { http, corpo } = await pedir(caminho, token);
    const lista = itens(corpo);
    tentativas.push({ via, http, itens: lista.length });
    const achada = lista.find((t) => bate(t, v));
    if (achada) return { transacao: { ...achada, webhook_type: "transaction" }, tentativas };
    // 401/403: token errado ou sem permissão. Não adianta tentar o próximo formato.
    if (http === 401 || http === 403) break;
  }
  return { transacao: null, tentativas };
}

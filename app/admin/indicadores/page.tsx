import type { Metadata } from "next";

import { Selo } from "../_ui/tabela";
import { exigirPainel } from "@/lib/admin-guarda";
import {
  completude,
  diaCurto,
  fracao,
  lerIndicadores,
  pct,
  progressoModulo,
  reais,
  ticketMedio,
  type Indicadores,
} from "@/lib/indicadores";
import { rotuloModulo } from "@/lib/curso";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Indicadores" };

/**
 * Indicadores do projeto (migration 0029). A tela do OBSERVADOR, e a única dele; o admin também vê.
 *
 * ┌─ POR QUE ESTA TELA NÃO USA A SERVICE ROLE ────────────────────────────────────────────────────┐
 * │ Todas as outras telas do admin leem com `createAdminClient`, e a autorização delas é só o      │
 * │ `exigirAdmin()` em TypeScript. Aqui a leitura é UMA chamada, `painel_indicadores()`, feita com │
 * │ a sessão de quem olha. A função confere `is_admin() or is_observer()` dentro do banco e só     │
 * │ devolve contagens e somas. Então mesmo que esta guarda falhasse, o observador receberia o que  │
 * │ a tela mostra e nada além: não existe caminho daqui até uma linha de aluno.                    │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * As contas de percentual e a leitura defensiva do jsonb moram em `lib/indicadores.ts` (puro, com
 * `check:indicadores`).
 */

const quando = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "America/Sao_Paulo",
      })
    : "nunca";

function Cartao({ rotulo, valor, nota }: { rotulo: string; valor: string; nota: string }) {
  return (
    <article className="rounded-lg border border-areia bg-white px-5 py-4">
      <p className="text-[11px] tracking-[0.12em] text-pedra uppercase">{rotulo}</p>
      <p className="mt-2 font-serif text-[32px] leading-none text-tinta">{valor}</p>
      <p className="mt-2 text-[12px] text-medio">{nota}</p>
    </article>
  );
}

function Barra({ rotulo, parte, total, valor }: { rotulo: string; parte: number; total: number; valor: string }) {
  const f = fracao(parte, total) ?? 0;
  return (
    <div className="my-2 grid grid-cols-[minmax(0,220px)_1fr_64px] items-center gap-3">
      <span className="truncate text-[12.5px] text-grafite" title={rotulo}>
        {rotulo}
      </span>
      <div className="h-4 overflow-hidden rounded-[3px] bg-bege">
        <i className="block h-full bg-acento" style={{ width: `${Math.round(f * 100)}%` }} />
      </div>
      <span className="text-right text-[12.5px] font-semibold text-gold-dark">{valor}</span>
    </div>
  );
}

function VendasPorDia({ dias }: { dias: Indicadores["vendas"]["porDia"] }) {
  const topo = Math.max(1, ...dias.map((d) => d.n));
  return (
    <div className="rounded-lg border border-areia bg-white px-5 py-4">
      <p className="mb-3 text-[11px] tracking-[0.12em] text-pedra uppercase">
        Vendas por dia, últimos 14 dias
      </p>
      {dias.length === 0 ? (
        <p className="text-[13px] text-medio">Sem dados no período.</p>
      ) : (
        <div className="flex h-36 items-end gap-1.5" role="img" aria-label="Vendas por dia nos últimos 14 dias">
          {dias.map((d) => (
            <div key={d.dia} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[11px] font-semibold text-gold-dark">{d.n > 0 ? d.n : ""}</span>
              <i
                className={`block w-full rounded-t-[3px] ${d.n > 0 ? "bg-acento" : "bg-bege"}`}
                style={{ height: `${Math.max(3, Math.round((d.n / topo) * 100))}%` }}
              />
              <span className="text-[10px] text-pedra">{diaCurto(d.dia)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function IndicadoresPage() {
  const eu = await exigirPainel();

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("painel_indicadores");

  if (error) {
    // O detalhe do erro vai para o log do servidor, não para a tela: quem olha pode ser de fora.
    console.error("[indicadores] painel_indicadores falhou:", error.message);
    return (
      <>
        <header className="mb-6">
          <h1 className="text-[26px] text-tinta">Indicadores</h1>
        </header>
        <p className="max-w-2xl rounded-md border border-falha/30 bg-falha/8 px-4 py-3 text-[13px] text-falha" role="status">
          Os indicadores não puderam ser carregados agora. Tente de novo em alguns minutos.
          {eu.papel === "admin" && " Se persistir, confira se a migration 0029 foi aplicada neste banco."}
        </p>
      </>
    );
  }

  const i = lerIndicadores(data);
  const v = i.vendas;
  const a = i.alunos;
  const comp = completude(i);
  const ticket = ticketMedio(i);

  const cartoesVendas = [
    {
      rotulo: "Vendas",
      valor: v.validas.toLocaleString("pt-BR"),
      nota:
        `matrículas pagas pelo Guru` +
        (v.estornos > 0 ? `, ${v.estornos} estornada${v.estornos > 1 ? "s" : ""} fora da conta` : ""),
    },
    {
      rotulo: "Receita bruta",
      valor: reais(v.bruto),
      nota:
        v.bruto === null
          ? "nenhuma venda trouxe valor no aviso do Guru"
          : v.comValor < v.validas
            ? `soma de ${v.comValor} das ${v.validas} vendas; as outras chegaram sem valor`
            : "soma do valor pago, sem os estornos",
    },
    {
      rotulo: "Receita líquida",
      valor: reais(v.liquido),
      nota:
        v.liquido === null
          ? "o aviso do Guru não trouxe o valor líquido"
          : v.comLiquido < v.validas
            ? `soma de ${v.comLiquido} das ${v.validas} vendas; as outras chegaram sem líquido`
            : "depois das taxas e comissões informadas pelo Guru",
    },
    {
      rotulo: "Ticket médio",
      valor: reais(ticket),
      nota: ticket === null ? "depende do valor bruto" : "receita bruta por venda com valor",
    },
  ];

  const cartoesFormacao = [
    {
      rotulo: "Matriculados",
      valor: a.matriculados.toLocaleString("pt-BR"),
      nota: `${a.acessoAtivo} com acesso ativo hoje`,
    },
    {
      rotulo: "Concluíram o curso",
      valor: a.concluintes.toLocaleString("pt-BR"),
      nota: `taxa de conclusão de ${pct(a.concluintes, a.matriculados)} dos matriculados`,
    },
    {
      rotulo: "Completude das aulas",
      valor: pct(comp.parte, comp.total),
      nota: `${comp.parte} de ${comp.total} aulas possíveis (${a.matriculados} alunos x ${i.aulas.total} aulas)`,
    },
    {
      rotulo: "Ativos em 7 dias",
      valor: a.ativos7d.toLocaleString("pt-BR"),
      nota: `${pct(a.ativos7d, a.matriculados)} dos matriculados assistiram ou marcaram aula`,
    },
  ];

  const funil = [
    { rotulo: "Matriculados", n: a.matriculados },
    { rotulo: "Começaram uma aula", n: a.comecaram },
    { rotulo: "Concluíram todas as aulas", n: a.concluintes },
    { rotulo: "Certificado emitido", n: a.certificados },
  ];

  const g = i.guru;
  const seloGuru =
    g.eventos === 0 ? (
      <Selo tom="neutro">nenhum aviso recebido</Selo>
    ) : g.erros > 0 || g.pendentes > 0 ? (
      <Selo tom="atencao">recebendo, com pendências</Selo>
    ) : (
      <Selo tom="ok">recebendo</Selo>
    );

  return (
    <>
      <header className="mb-7">
        <h1 className="text-[26px] text-tinta">Indicadores</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-medio">
          Números agregados do projeto, calculados no banco a cada carregamento. Nenhum dado de aluno
          individual aparece aqui. Atualizado em {quando(i.geradoEm)}.
        </p>
      </header>

      <h2 className="mb-3 text-[15px] text-tinta">Vendas</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cartoesVendas.map((c) => (
          <Cartao key={c.rotulo} {...c} />
        ))}
      </div>
      <div className="mt-4">
        <VendasPorDia dias={v.porDia} />
      </div>
      {v.cortesias > 0 && (
        <p className="mt-2 text-[12px] text-medio">
          {v.cortesias} matrícula{v.cortesias > 1 ? "s" : ""} sem venda paga (cortesia, aluno adicionado pelo
          admin ou compra de teste com cupom de 100%) não entra{v.cortesias > 1 ? "m" : ""} nas vendas, mas
          conta{v.cortesias > 1 ? "m" : ""} entre os matriculados.
        </p>
      )}

      <h2 className="mt-8 mb-3 text-[15px] text-tinta">Formação</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cartoesFormacao.map((c) => (
          <Cartao key={c.rotulo} {...c} />
        ))}
      </div>

      <div className="mt-4 grid items-start gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-areia bg-white px-5 py-4">
          <p className="mb-2 text-[11px] tracking-[0.12em] text-pedra uppercase">Do acesso ao certificado</p>
          {funil.map((f) => (
            <Barra
              key={f.rotulo}
              rotulo={f.rotulo}
              parte={f.n}
              total={Math.max(1, a.matriculados)}
              valor={f.n.toLocaleString("pt-BR")}
            />
          ))}
        </div>

        <div className="rounded-lg border border-areia bg-white px-5 py-4">
          <p className="mb-2 text-[11px] tracking-[0.12em] text-pedra uppercase">Progresso médio por módulo</p>
          {i.modulos.length === 0 ? (
            <p className="py-1 text-[13px] text-medio">Nenhum módulo cadastrado.</p>
          ) : (
            i.modulos.map((m) => {
              const p = progressoModulo(i, m);
              return (
                <Barra
                  key={m.ord}
                  rotulo={`${rotuloModulo(m.ord)} · ${m.titulo}`}
                  parte={p.parte}
                  total={p.total}
                  valor={m.aulas === 0 ? "sem aulas" : pct(p.parte, p.total)}
                />
              );
            })
          )}
          <p className="mt-2 text-[11.5px] text-pedra">
            Aulas concluídas do módulo sobre matriculados x aulas do módulo.
          </p>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-[15px] text-tinta">Integração com o Guru</h2>
      <div className="rounded-lg border border-areia bg-white px-5 py-4 text-[12.5px]">
        <p className="mb-2 flex items-center gap-2">
          <b className="font-semibold">Avisos de venda</b> {seloGuru}
        </p>
        <p className="text-medio">
          {g.eventos.toLocaleString("pt-BR")} recebido{g.eventos === 1 ? "" : "s"} no total,{" "}
          {g.eventos7d.toLocaleString("pt-BR")} nos últimos 7 dias, {g.processados.toLocaleString("pt-BR")}{" "}
          processado{g.processados === 1 ? "" : "s"}. Último aviso: {quando(g.ultimo)}.
        </p>
        {(g.erros > 0 || g.pendentes > 0) && (
          <p className="mt-1 text-medio">
            {g.erros} com erro, {g.pendentes} sem processamento concluído. O Guru reenvia sozinho os que
            falharam.
          </p>
        )}
      </div>
    </>
  );
}

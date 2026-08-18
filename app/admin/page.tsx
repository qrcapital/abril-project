import Link from "next/link";

import { dataHora, Selo } from "./_ui/tabela";
import { rotularAcao } from "@/lib/auditoria-texto";
import { avisosDaPolitica } from "@/lib/politica-avisos";
import { getRegras } from "@/lib/politicas";
import { NOTA_MINIMA } from "@/lib/prova-correcao";
import { META_POR_MODULO, ORDS_AVALIADOS, POR_MODULO } from "@/lib/questoes";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Painel do admin (PLANO-ADMIN §4.1, redesenhado em 17/ago/2026 a pedido do Pedro: "muito cru
 * e com poucas informações"). A ordem dos blocos é a ordem das perguntas de quem abre:
 *
 * 1. **Os quatro números** de sempre (como estamos).
 * 2. **Precisa de você** (o que exige ação hoje) — só aparece o que está pendente, com o link
 *    da tela que resolve. Nada pendente também é informação, e vira uma linha.
 * 3. **Formação** — o funil do acesso ao certificado (ONDE os alunos param) e as últimas
 *    entradas da auditoria (decisão do Pedro: auditoria aqui, não um feed com nome de aluno).
 * 4. **Saúde do sistema** — política de liberação, banco de questões, e-mails de 24 h.
 * 5. **Relatórios** — os CSVs (rota `api/relatorios`, exportação auditada).
 *
 * Leitura pela service role, como manda o §2: o admin vê o agregado de TODOS os alunos, e a
 * RLS, corretamente, só deixa cada um ver o próprio. Server Component: a chave não desce.
 */

type Contador = { count: number | null };
const n = (r: Contador) => r.count ?? 0;

type LinhaAudit = { id: string; autor_email: string | null; acao: string; alvo_email: string | null; alvo_nome: string | null; created_at: string };

const DIA_MS = 86_400_000;

/**
 * Todas as linhas de uma consulta, em páginas de 1000: o PostgREST corta em 1000 por padrão e
 * não avisa, e o corte silencioso virava subcontagem no funil e nos cards com a base grande
 * (plano de correções de 17/ago, item 6).
 */
async function todas<T>(
  pagina: (de: number, ate: number) => PromiseLike<{ data: T[] | null }>,
): Promise<T[]> {
  const PASSO = 1000;
  const linhas: T[] = [];
  for (let de = 0; ; de += PASSO) {
    const { data } = await pagina(de, de + PASSO - 1);
    linhas.push(...(data ?? []));
    if ((data?.length ?? 0) < PASSO) return linhas;
  }
}

export default async function AdminPainel() {
  const db = createAdminClient();
  const agora = new Date();
  const iso = agora.toISOString();
  const ha24h = new Date(agora.getTime() - DIA_MS).toISOString();
  const ha7d = new Date(agora.getTime() - 7 * DIA_MS).toISOString();
  const em30d = new Date(agora.getTime() + 30 * DIA_MS).toISOString();

  // ponytail: as leituras de `todas` trazem linhas (não count) para agregar por aluno em JS.
  // Com ~milhares de alunos ainda é barato; se a base crescer a ponto de doer, vira uma RPC.
  const [
    contagens,
    questoes,
    ativosIds,
    progressoTudo,
    progressoGate,
    exames,
  ] = await Promise.all([
    Promise.all([
      db.from("enrollments").select("id", { count: "exact", head: true }),
      db.from("enrollments").select("id", { count: "exact", head: true }).eq("status", "active").gt("expires_at", iso),
      db.from("lessons").select("id", { count: "exact", head: true }).eq("conta_no_gate", true),
      db.from("exams").select("id", { count: "exact", head: true }).eq("status", "submitted"),
      db.from("exams").select("id", { count: "exact", head: true }).eq("status", "submitted").gte("score", NOTA_MINIMA),
      db.from("certificates").select("id", { count: "exact", head: true }),
      db.from("email_log").select("id", { count: "exact", head: true }).gte("sent_at", ha24h),
      db.from("email_log").select("id", { count: "exact", head: true }).gte("sent_at", ha24h).eq("status", "enviado"),
      db.from("email_log").select("id", { count: "exact", head: true }).gte("sent_at", ha24h).ilike("status", "falha%"),
      db
        .from("enrollments")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")
        .gt("expires_at", iso)
        .lte("expires_at", em30d),
      db.from("exams").select("id", { count: "exact", head: true }).eq("status", "in_progress").lt("deadline", iso),
      // `.order("ord")` importa: o `avisosDaPolitica` alinha `regras[i]` com `ords[i]`, e o
      // `getRegras` devolve as regras na ordem dos módulos por ord.
      db.from("modules").select("id, ord").order("ord"),
      db.rpc("listar_auditoria", { termo: "", limite: 5 }),
      db.from("release_policies").select("nome").eq("ativa", true).maybeSingle(),
      db.from("enrollments").select("id", { count: "exact", head: true }).not("release_policy_id", "is", null),
    ] as const),
    todas<{ module_id: string; ativo: boolean }>((de, ate) =>
      db.from("questions").select("module_id, ativo").range(de, ate),
    ),
    todas<{ user_id: string }>((de, ate) =>
      db.from("enrollments").select("user_id").eq("status", "active").gt("expires_at", iso).range(de, ate),
    ),
    todas<{ user_id: string; updated_at: string | null }>((de, ate) =>
      db.from("progress").select("user_id, updated_at").range(de, ate),
    ),
    todas<{ user_id: string }>((de, ate) =>
      db
        .from("progress")
        .select("user_id, lessons!inner(conta_no_gate)")
        .eq("status", "completed")
        .eq("lessons.conta_no_gate", true)
        .range(de, ate),
    ),
    todas<{ user_id: string; status: string; score: number | null }>((de, ate) =>
      db.from("exams").select("user_id, status, score").range(de, ate),
    ),
  ]);
  const [
    matriculas,
    ativos,
    aulasGate,
    provas,
    aprovadas,
    certificados,
    emails24,
    enviados24,
    falhas24,
    expirando,
    estouradas,
    mods,
    auditoria,
    politicaAtiva,
    comPoliticaPropria,
  ] = contagens;

  // ---- agregados por aluno (base de cards e funil) ----------------------------------------
  const idsAtivos = new Set(ativosIds.map((r) => r.user_id));
  const gatePorAluno = new Map<string, number>();
  for (const r of progressoGate) {
    if (idsAtivos.has(r.user_id)) gatePorAluno.set(r.user_id, (gatePorAluno.get(r.user_id) ?? 0) + 1);
  }
  // Numerador e denominador na MESMA coorte (só ativos): antes o numerador contava aula de
  // aluno expirado/revogado e o card passava de 100% sem mentir em nenhuma parcela.
  const concluidasAtivos = [...gatePorAluno.values()].reduce((s, c) => s + c, 0);

  // ---- os quatro números de sempre --------------------------------------------------------
  const possiveis = n(ativos) * n(aulasGate);
  const pct = (parte: number, total: number) =>
    total > 0 ? `${Math.round((parte / total) * 100)}%` : "—";
  const cards = [
    { rotulo: "Matrículas", valor: n(matriculas), nota: `${n(ativos)} com acesso ativo` },
    {
      rotulo: "Conclusão de aulas",
      valor: pct(concluidasAtivos, possiveis),
      nota: `${concluidasAtivos} de ${possiveis} possíveis (${n(aulasGate)} aulas no gate)`,
    },
    {
      rotulo: "Aprovação na prova",
      valor: pct(n(aprovadas), n(provas)),
      nota:
        n(provas) > 0
          ? `${n(aprovadas)} de ${n(provas)} provas entregues, corte ${NOTA_MINIMA}%`
          : "nenhuma prova entregue ainda",
    },
    { rotulo: "Certificados", valor: n(certificados), nota: "emitidos até agora" },
  ];

  // ---- fila de atenção --------------------------------------------------------------------
  const ativosComAtividade7d = new Set(
    progressoTudo
      .filter((r) => r.updated_at && String(r.updated_at) > ha7d)
      .map((r) => r.user_id),
  );
  const paradosHa7d = [...idsAtivos].filter((id) => !ativosComAtividade7d.has(id)).length;

  const ordDoModulo = new Map((mods.data ?? []).map((m) => [m.id as string, m.ord as number]));
  const ativasPorOrd = new Map<number, number>();
  for (const q of questoes) {
    if (!q.ativo) continue;
    const ord = ordDoModulo.get(q.module_id);
    if (ord !== undefined) ativasPorOrd.set(ord, (ativasPorOrd.get(ord) ?? 0) + 1);
  }
  const abaixoDoPiso = ORDS_AVALIADOS.filter((ord) => (ativasPorOrd.get(ord) ?? 0) < POR_MODULO);
  const totalAtivas = ORDS_AVALIADOS.reduce((s, ord) => s + (ativasPorOrd.get(ord) ?? 0), 0);
  const metaTotal = META_POR_MODULO * ORDS_AVALIADOS.length;

  type ItemFila = { grave: boolean; texto: string; href: string; chamada: string };
  const fila: ItemFila[] = [];
  if (abaixoDoPiso.length > 0)
    fila.push({
      grave: true,
      texto: `Módulo${abaixoDoPiso.length > 1 ? "s" : ""} ${abaixoDoPiso.join(", ")} abaixo do piso de ${POR_MODULO} questões ativas: a prova não abre para ninguém`,
      href: "/admin/questoes",
      chamada: "Ver Questões",
    });
  if (n(falhas24) > 0)
    fila.push({
      grave: true,
      texto: `${n(falhas24)} e-mail${n(falhas24) > 1 ? "s" : ""} falhou${n(falhas24) > 1 ? "" : ""} nas últimas 24 h`,
      href: "/admin/emails",
      chamada: "Ver no log",
    });
  if (n(estouradas) > 0)
    fila.push({
      grave: false,
      texto: `${n(estouradas)} prova${n(estouradas) > 1 ? "s" : ""} em andamento com prazo estourado, esperando o fechamento`,
      href: "/admin/alunos",
      chamada: "Ver Alunos",
    });
  if (n(expirando) > 0)
    fila.push({
      grave: false,
      texto: `${n(expirando)} matrícula${n(expirando) > 1 ? "s" : ""} expira${n(expirando) > 1 ? "m" : ""} nos próximos 30 dias`,
      href: "/admin/alunos",
      chamada: "Ver Alunos",
    });
  if (paradosHa7d > 0)
    fila.push({
      grave: false,
      texto: `${paradosHa7d} aluno${paradosHa7d > 1 ? "s" : ""} com acesso ativo e nenhuma atividade há mais de 7 dias`,
      href: "/admin/alunos",
      chamada: "Ver Alunos",
    });
  if (abaixoDoPiso.length === 0 && totalAtivas < metaTotal)
    fila.push({
      grave: false,
      texto: `Banco de questões em ${totalAtivas} de ${metaTotal}: com banco pequeno, dois alunos veem quase a mesma prova`,
      href: "/admin/questoes",
      chamada: "Ver Questões",
    });

  // ---- funil ------------------------------------------------------------------------------
  const comecaram = new Set(
    progressoTudo.map((r) => r.user_id).filter((id) => idsAtivos.has(id)),
  ).size;
  const totalGate = n(aulasGate);
  const metadeGate = [...gatePorAluno.values()].filter((c) => c >= Math.ceil(totalGate / 2)).length;
  const gateCompleto = [...gatePorAluno.values()].filter((c) => totalGate > 0 && c >= totalGate).length;
  const entregaram = new Set(
    exames
      .filter((e) => e.status === "submitted" && idsAtivos.has(e.user_id))
      .map((e) => e.user_id),
  );
  const aprovaram = new Set(
    exames
      .filter(
        (e) =>
          e.status === "submitted" &&
          (e.score ?? 0) >= NOTA_MINIMA &&
          idsAtivos.has(e.user_id),
      )
      .map((e) => e.user_id),
  );

  const funil = [
    { rotulo: "Com acesso ativo", valor: n(ativos) },
    { rotulo: "Começaram uma aula", valor: comecaram },
    { rotulo: "Metade do gate", valor: metadeGate },
    { rotulo: `Gate completo (${totalGate}/${totalGate})`, valor: gateCompleto },
    { rotulo: "Prova entregue", valor: entregaram.size },
    { rotulo: "Aprovados", valor: aprovaram.size },
    { rotulo: "Certificado emitido", valor: n(certificados) },
  ];
  const topoFunil = Math.max(1, n(ativos));

  // ---- saúde ------------------------------------------------------------------------------
  // A MESMA conta da tela de Liberação (`lib/politica-avisos.ts`): antes cada lado somava os
  // avisos por conta própria, e o card diria "sem avisos" para uma política que a tela marca.
  const regras = await getRegras(null);
  const ordsModulos = (mods.data ?? []).map((m) => m.ord as number);
  const avisosPolitica = avisosDaPolitica(regras, ordsModulos).length;
  const audit = (auditoria.data ?? []) as LinhaAudit[];

  return (
    <>
      <header className="mb-7">
        <h1 className="text-[26px] text-verde">Painel</h1>
        <p className="mt-1 text-[13px] text-medio">
          Números do ambiente atual, lidos do banco a cada carregamento.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <article key={c.rotulo} className="rounded-lg border border-areia bg-white px-5 py-4">
            <p className="text-[11px] tracking-[0.12em] text-pedra uppercase">{c.rotulo}</p>
            <p className="mt-2 font-serif text-[32px] leading-none text-verde">{c.valor}</p>
            <p className="mt-2 text-[12px] text-medio">{c.nota}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-[15px] text-verde">Precisa de você</h2>
      {fila.length === 0 ? (
        <p className="rounded-lg border border-areia bg-white px-4 py-3 text-[13px] text-medio">
          Nada pendente. E-mails saindo, banco de questões no piso, nenhuma matrícula vencendo.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {fila.map((item) => (
            <div
              key={item.texto}
              className={`flex items-center gap-3 rounded-lg border border-areia bg-white py-2.5 pr-4 pl-4 text-[13px] text-grafite ${
                item.grave ? "border-l-[3px] border-l-falha" : "border-l-[3px] border-l-gold"
              }`}
            >
              <span>{item.texto}</span>
              <Link
                href={item.href}
                className="ml-auto text-[12px] font-semibold whitespace-nowrap text-gold-dark hover:text-verde"
              >
                {item.chamada} →
              </Link>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 mb-3 text-[15px] text-verde">Formação, do acesso ao certificado</h2>
      <div className="grid items-start gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-areia bg-white px-5 py-4">
          {funil.map((f) => (
            <div key={f.rotulo} className="my-2 grid grid-cols-[150px_1fr_50px] items-center gap-3">
              <span className="text-[12.5px] text-grafite">{f.rotulo}</span>
              <div className="h-4 overflow-hidden rounded-[3px] bg-bege">
                <i
                  className="block h-full bg-verde"
                  style={{ width: `${Math.round((f.valor / topoFunil) * 100)}%` }}
                />
              </div>
              <span className="text-right text-[12.5px] font-semibold text-gold-dark">{f.valor}</span>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-areia bg-white px-5 py-2">
          {audit.length === 0 ? (
            <p className="py-3 text-[13px] text-medio">Nenhuma ação registrada ainda.</p>
          ) : (
            audit.map((a) => (
              <div
                key={a.id}
                className="flex items-baseline gap-2 border-b border-bege py-2.5 text-[12.5px] last:border-b-0"
              >
                <span className="text-grafite">
                  <b className="font-semibold">{rotularAcao(a.acao)}</b>
                  {a.alvo_nome || a.alvo_email ? ` · ${a.alvo_nome ?? a.alvo_email}` : ""}
                  <span className="text-pedra"> · {a.autor_email ?? "?"}</span>
                </span>
                <span className="ml-auto text-[11px] whitespace-nowrap text-pedra">
                  {dataHora(a.created_at)}
                </span>
              </div>
            ))
          )}
          <div className="border-t border-bege py-2.5 text-right">
            <Link href="/admin/auditoria" className="text-[12px] font-semibold text-gold-dark hover:text-verde">
              Ver auditoria →
            </Link>
          </div>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-[15px] text-verde">Saúde do sistema</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-areia bg-white px-5 py-4 text-[12.5px]">
          <p className="mb-2 text-[11px] tracking-[0.12em] text-pedra uppercase">Política de liberação</p>
          <b className="font-semibold">{politicaAtiva.data?.nome ?? "nenhuma ativa"}</b>{" "}
          {avisosPolitica === 0 ? (
            <Selo tom="ok">sem avisos</Selo>
          ) : (
            <Selo tom="atencao">{avisosPolitica === 1 ? "1 aviso" : `${avisosPolitica} avisos`}</Selo>
          )}
          <p className="mt-1 text-medio">
            {n(comPoliticaPropria) === 0
              ? "todos os alunos no padrão"
              : `${n(comPoliticaPropria)} aluno${n(comPoliticaPropria) > 1 ? "s" : ""} com política própria`}
          </p>
        </div>
        <div className="rounded-lg border border-areia bg-white px-5 py-4 text-[12.5px]">
          <p className="mb-2 text-[11px] tracking-[0.12em] text-pedra uppercase">Banco de questões</p>
          <div className="my-2 h-1.5 overflow-hidden rounded-[3px] bg-bege">
            <i
              className="block h-full bg-gold"
              style={{ width: `${Math.min(100, Math.round((totalAtivas / metaTotal) * 100))}%` }}
            />
          </div>
          {totalAtivas} de {metaTotal} na meta{" "}
          {abaixoDoPiso.length > 0 ? (
            <Selo tom="ruim">abaixo do piso</Selo>
          ) : totalAtivas < metaTotal ? (
            <Selo tom="atencao">piso ok, meta longe</Selo>
          ) : (
            <Selo tom="ok">na meta</Selo>
          )}
        </div>
        <div className="rounded-lg border border-areia bg-white px-5 py-4 text-[12.5px]">
          <p className="mb-2 text-[11px] tracking-[0.12em] text-pedra uppercase">E-mails · 24 h</p>
          {/* Só `status = 'enviado'` conta como enviado: "desligado" (sem RESEND_API_KEY) é
              tentativa que não saiu, e subtrair falhas do total escondia isso. */}
          <b className="font-semibold">
            {n(enviados24)} enviado{n(enviados24) === 1 ? "" : "s"}
          </b>
          , {n(falhas24)} falha{n(falhas24) === 1 ? "" : "s"}
          <p className="mt-1 text-medio">
            {n(emails24) === 0 ? "nenhum envio no período" : "detalhe por mensagem no log"}
          </p>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-[15px] text-verde">Relatórios</h2>
      <p className="mb-3 max-w-2xl text-[12px] text-medio">
        CSV com ponto e vírgula, abre direto no Excel. Cada exportação fica na auditoria, porque
        é dado de aluno saindo do sistema.
      </p>
      <div className="flex flex-wrap gap-3">
        {[
          ["alunos", "Alunos e progresso"],
          ["emails", "Log de e-mails"],
          ["auditoria", "Auditoria"],
        ].map(([tipo, rotulo]) => (
          <a
            key={tipo}
            href={`/admin/api/relatorios?tipo=${tipo}`}
            className="rounded-md border border-areia bg-white px-3 py-1.5 text-[12px] text-grafite hover:border-pedra"
          >
            ↓ {rotulo}
          </a>
        ))}
      </div>
    </>
  );
}

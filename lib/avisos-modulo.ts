// O AVISO DE MÓDULO LIBERADO: o e-mail que acompanha a régua de cada aluno.
//
// Nasceu em 02/out/2026. A liberação é por aluno, não por turma: o Módulo I abre 7 dias depois
// do `inicio_em` da matrícula, o II em 14, e assim por diante (`regraEsteira`). Quem compra numa
// quarta recebe módulo novo toda quarta; quem compra num sábado, todo sábado. Não existe "o dia
// do módulo", então este aviso não pode ser uma campanha com data: ele é uma ROTINA que olha o
// calendário de cada matrícula e avisa quem teve um módulo aberto desde a última passada.
//
// QUEM RODA: `netlify/functions/avisos-modulo.mts`, de hora em hora. A hora cheia é a precisão
// do aviso: o módulo abre no minuto exato da compra (+7 dias) e o e-mail sai na passada seguinte.
//
// CINCO REGRAS QUE MOLDAM O CÓDIGO:
//
// 1. **Uma vez por aluno e módulo.** A tabela `modulo_avisos` (migration 0027) tem a chave
//    (user_id, modulo_ord). A linha é gravada ANTES do envio, como reserva: duas passadas
//    simultâneas (um retry da Netlify, alguém rodando à mão) não mandam em dobro, porque só uma
//    consegue inserir.
// 2. **Falha de envio libera a reserva.** Sem isso, um dia sem SES configurado queimaria o aviso
//    de todo mundo para sempre. A linha sai e a próxima passada tenta de novo.
// 3. **Janela de 48 horas.** Só avisa módulo que abriu nas últimas 48 h. No primeiro deploy, ou
//    depois de um dia fora do ar, a rotina não despeja de uma vez os avisos atrasados de semanas.
//    Dois dias cobrem uma pane de fim de semana; mais que isso, o aluno já viu o módulo na área.
// 4. **O Módulo 0 não avisa**, porque abre junto com a compra e quem fala dele é o boas-vindas.
//    Módulo aberto pela chave de liberação total do admin também não: ali abrem todos de uma vez,
//    e cinco e-mails no mesmo minuto seriam ruído.
// 5. **Teto por passada.** Função agendada da Netlify tem 30 s. O que passar do teto fica para a
//    próxima hora, dentro da janela.
//
// O cliente do Supabase entra por parâmetro e não há `server-only`, como em `lib/email.ts`: este
// módulo roda dentro da função agendada, fora do bundle do Next.

import type { SupabaseClient } from "@supabase/supabase-js";

import { ROMANO } from "./curso.ts";
import { enviarEmail } from "./email.ts";
import {
  calendarioDoAluno,
  conclusaoDosModulos,
  FUSO_DO_CURSO,
  REGRA_PADRAO,
  type EntradaCalendario,
  type Regra,
} from "./liberacao.ts";

const HORA = 3_600_000;
export const JANELA_HORAS = 48;
export const TETO_POR_PASSADA = 150;
const PAGINA = 1000;

// ------------------------------------------------------------------------------------------
// Parte pura (coberta por `npm run check:avisos`)
// ------------------------------------------------------------------------------------------

const DIA_DA_SEMANA = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO_DO_CURSO, weekday: "long" });
const DD_MM = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO_DO_CURSO, day: "2-digit", month: "2-digit" });

/** "quarta-feira, 21/10", no fuso do curso. */
export const diaEData = (d: Date) => `${DIA_DA_SEMANA.format(d)}, ${DD_MM.format(d)}`;

/**
 * Os módulos que este aluno deve ser avisado agora: abertos pelo relógio ou pela conclusão de
 * outro módulo, nas últimas `JANELA_HORAS`, a partir do Módulo I, e ainda sem aviso.
 */
export function avisosDevidos(
  cal: readonly EntradaCalendario[],
  jaAvisados: ReadonlySet<number>,
  agora: Date,
): EntradaCalendario[] {
  const desde = agora.getTime() - JANELA_HORAS * HORA;
  return cal.filter(
    (e) =>
      e.ord >= 1 &&
      e.aberto &&
      e.motivo !== "total" &&
      e.abreEm !== null &&
      e.abreEm.getTime() > desde &&
      e.abreEm.getTime() <= agora.getTime() &&
      !jaAvisados.has(e.ord),
  );
}

/**
 * A frase do `{{proximo}}`: o que vem depois do módulo que abriu. Olha o calendário do PRÓPRIO
 * aluno, então a data já sai no dia da semana dele.
 */
export function fraseDoProximo(cal: readonly EntradaCalendario[], ord: number): string {
  const depois = cal.filter((e) => e.ord > ord && e.motivo !== "em_breve");
  const proximo = depois[0];
  if (!proximo) {
    return "Este é o último módulo do curso: quando você concluir as aulas, o seu certificado é emitido na hora.";
  }
  const rotulo = `Módulo ${ROMANO[proximo.ord] ?? proximo.ord}`;
  if (proximo.aberto) return `O ${rotulo} também já está liberado na sua área.`;
  if (proximo.abreEm) return `O ${rotulo} abre na ${diaEData(proximo.abreEm)}.`;
  return `O ${rotulo} abre assim que você concluir as aulas deste.`;
}

// ------------------------------------------------------------------------------------------
// IO
// ------------------------------------------------------------------------------------------

/** Lê tudo de uma consulta, de mil em mil: o PostgREST corta em 1.000 linhas sem avisar. */
async function todas<T>(
  consulta: (de: number, ate: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  const out: T[] = [];
  for (let de = 0; ; de += PAGINA) {
    const { data, error } = await consulta(de, de + PAGINA - 1);
    if (error) throw new Error(error.message);
    out.push(...(data ?? []));
    if (!data || data.length < PAGINA) return out;
  }
}

type LinhaRegra = { policy_id: string; module_id: string; tipo: string; dias: number | null; abre_em: string | null; depende_de_ord: number | null };

function paraRegra(l: LinhaRegra): Regra {
  if (l.tipo === "livre") return { tipo: "livre" };
  if (l.tipo === "dias" && l.dias !== null) return { tipo: "dias", dias: l.dias };
  if (l.tipo === "data" && l.abre_em) return { tipo: "data", data: new Date(l.abre_em) };
  if (l.tipo === "apos_modulo" && l.depende_de_ord !== null) return { tipo: "apos_modulo", modulo: l.depende_de_ord, dias: l.dias ?? 0 };
  return REGRA_PADRAO;
}

export type Resumo = { matriculas: number; devidos: number; enviados: number; falhas: number; adiados: number };

/**
 * Uma passada da rotina. Devolve o resumo para o log da função.
 * `agora` é parâmetro para dar para simular uma data num teste manual.
 */
export async function avisarModulosLiberados(db: SupabaseClient, agora: Date = new Date()): Promise<Resumo> {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/+$/, "");

  const [{ data: mods, error: e1 }, { data: aulas, error: e2 }, { data: politicas, error: e3 }] = await Promise.all([
    db.from("modules").select("id,ord,titulo").order("ord"),
    db.from("lessons").select("id,module_id"),
    db.from("release_policies").select("id,ativa"),
  ]);
  if (e1 || e2 || e3) throw new Error((e1 ?? e2 ?? e3)!.message);
  const regrasBrutas = await todas<LinhaRegra>((de, ate) =>
    db.from("release_rules").select("policy_id,module_id,tipo,dias,abre_em,depende_de_ord").range(de, ate),
  );

  const modulos = (mods ?? []) as { id: string; ord: number; titulo: string }[];
  const ordDe = new Map(modulos.map((m) => [m.id, m.ord]));
  const ativa = (politicas ?? []).find((p) => p.ativa)?.id as string | undefined;

  // regras[politica][ord]
  const regrasPor = new Map<string, Regra[]>();
  for (const p of politicas ?? []) {
    const lista: Regra[] = modulos.map(() => REGRA_PADRAO);
    for (const l of regrasBrutas.filter((r) => r.policy_id === p.id)) {
      const ord = ordDe.get(l.module_id);
      if (ord !== undefined) lista[ord] = paraRegra(l);
    }
    regrasPor.set(p.id as string, lista);
  }
  const usaConclusao = regrasBrutas.some((r) => r.tipo === "apos_modulo");

  // Matrícula vigente de cada aluno: ativa, dentro do prazo, a de `expires_at` mais distante.
  const linhas = await todas<{ user_id: string; status: string; expires_at: string; inicio_em: string | null; liberacao_total: boolean | null; release_policy_id: string | null }>(
    (de, ate) =>
      db
        .from("enrollments")
        .select("user_id,status,expires_at,inicio_em,liberacao_total,release_policy_id")
        .eq("status", "active")
        .gt("expires_at", agora.toISOString())
        .order("expires_at", { ascending: false })
        .range(de, ate),
  );
  const matriculas = new Map<string, (typeof linhas)[number]>();
  for (const l of linhas) if (l.inicio_em && !matriculas.has(l.user_id)) matriculas.set(l.user_id, l);

  const avisos = await todas<{ user_id: string; modulo_ord: number }>((de, ate) =>
    db.from("modulo_avisos").select("user_id,modulo_ord").range(de, ate),
  );
  const avisadosPor = new Map<string, Set<number>>();
  for (const a of avisos) {
    const s = avisadosPor.get(a.user_id) ?? new Set<number>();
    s.add(a.modulo_ord);
    avisadosPor.set(a.user_id, s);
  }

  // Progresso só é lido se alguma política usa `apos_modulo`. Na esteira por dias ele não muda nada.
  const concluidasPor = new Map<string, Map<string, Date>>();
  if (usaConclusao) {
    const prog = await todas<{ user_id: string; lesson_id: string; completed_at: string | null; updated_at: string }>((de, ate) =>
      db.from("progress").select("user_id,lesson_id,completed_at,updated_at").eq("status", "completed").range(de, ate),
    );
    for (const p of prog) {
      const m = concluidasPor.get(p.user_id) ?? new Map<string, Date>();
      m.set(p.lesson_id, new Date(p.completed_at ?? p.updated_at));
      concluidasPor.set(p.user_id, m);
    }
  }
  const aulasPorOrd = (aulas ?? []).map((a) => ({ id: a.id as string, modulo: ordDe.get(a.module_id as string) ?? 0 }));

  const resumo: Resumo = { matriculas: matriculas.size, devidos: 0, enviados: 0, falhas: 0, adiados: 0 };
  const fila: { userId: string; ord: number; cal: EntradaCalendario[] }[] = [];

  for (const [userId, m] of matriculas) {
    const regras = regrasPor.get(m.release_policy_id ?? ativa ?? "") ?? [];
    if (regras.length === 0) continue;
    const conclusoes = usaConclusao ? conclusaoDosModulos(aulasPorOrd, concluidasPor.get(userId) ?? new Map()) : undefined;
    const cal = calendarioDoAluno({
      inicioEm: new Date(m.inicio_em!),
      liberacaoTotal: Boolean(m.liberacao_total),
      regras,
      conclusoes,
      agora,
    });
    for (const e of avisosDevidos(cal, avisadosPor.get(userId) ?? new Set(), agora)) fila.push({ userId, ord: e.ord, cal });
  }
  resumo.devidos = fila.length;
  resumo.adiados = Math.max(0, fila.length - TETO_POR_PASSADA);

  for (const item of fila.slice(0, TETO_POR_PASSADA)) {
    // Reserva primeiro (regra 1). Conflito = outra passada já pegou este aviso.
    const { error: reserva } = await db
      .from("modulo_avisos")
      .insert({ user_id: item.userId, modulo_ord: item.ord, status: "enviando" });
    if (reserva) continue;

    const [{ data: conta }, { data: perfil }] = await Promise.all([
      db.auth.admin.getUserById(item.userId),
      db.from("profiles").select("nome").eq("id", item.userId).maybeSingle(),
    ]);
    const email = conta?.user?.email;
    const modulo = modulos.find((x) => x.ord === item.ord);
    let ok = false;
    if (email && modulo) {
      const nome = String(perfil?.nome ?? conta?.user?.user_metadata?.nome ?? "").trim().split(/\s+/)[0] ?? "";
      const r = await enviarEmail(db, {
        chave: "modulo-liberado",
        para: email,
        userId: item.userId,
        dados: {
          nome,
          modulo: ROMANO[item.ord] ?? String(item.ord),
          titulo: modulo.titulo,
          proximo: fraseDoProximo(item.cal, item.ord),
          link: `${site}/app/modulo/${item.ord}`,
        },
      });
      ok = r.ok || r.status === "desligado";
    }
    if (ok) {
      resumo.enviados++;
      await db.from("modulo_avisos").update({ status: "enviado" }).eq("user_id", item.userId).eq("modulo_ord", item.ord);
    } else {
      // Regra 2: libera a reserva para a próxima passada tentar de novo.
      resumo.falhas++;
      await db.from("modulo_avisos").delete().eq("user_id", item.userId).eq("modulo_ord", item.ord);
    }
  }
  return resumo;
}

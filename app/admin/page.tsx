import { NOTA_MINIMA } from "@/lib/prova-correcao";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Painel do admin (PLANO-ADMIN §4.1).
 *
 * Números REAIS do banco, não mock: o plano previa mock na Fase 1 porque foi escrito quando
 * o Supabase ainda não existia, e ele existe desde 28/jul. O Pedro decidiu em 30/jul pular o
 * mock onde o dado já está lá.
 *
 * Leitura pela service role, como manda o §2: o admin precisa ver o agregado de TODOS os
 * alunos, e a RLS, corretamente, só deixa cada um ver o próprio. Isto roda em Server
 * Component, então a chave nunca chega ao navegador.
 *
 * O que ficou de fora, de propósito:
 * - **NPS.** O §8 pergunta se entra como mock; a pesquisa não existe ainda, e card de
 *   métrica com número inventado é o tipo de coisa que alguém cita numa reunião.
 * - **Atalhos** (últimos e-mails, alunos recentes). São atalhos PARA telas que ainda não
 *   existem; entram junto com elas.
 */

// `head: true` traz só o `count`: nenhuma linha atravessa a rede para virar um número.
type Contador = { count: number | null };

export default async function AdminPainel() {
  const db = createAdminClient();
  const agora = new Date().toISOString();

  const [matriculas, ativas, aulasGate, concluidas, provas, aprovadas, certificados] =
    await Promise.all([
      db.from("enrollments").select("id", { count: "exact", head: true }),
      db
        .from("enrollments")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")
        .gt("expires_at", agora),
      db.from("lessons").select("id", { count: "exact", head: true }).eq("conta_no_gate", true),
      // `lessons!inner` filtra pela aula embutida: só progresso de aula que conta no gate,
      // senão o Módulo 0 entraria no denominador de um lado e não do outro.
      db
        .from("progress")
        .select("id, lessons!inner(conta_no_gate)", { count: "exact", head: true })
        .eq("status", "completed")
        .eq("lessons.conta_no_gate", true),
      db.from("exams").select("id", { count: "exact", head: true }).eq("status", "submitted"),
      db
        .from("exams")
        .select("id", { count: "exact", head: true })
        .eq("status", "submitted")
        .gte("score", NOTA_MINIMA),
      db.from("certificates").select("id", { count: "exact", head: true }),
    ]);

  const n = (r: Contador) => r.count ?? 0;

  // Denominador da conclusão: cada matrícula ativa pode concluir cada aula do gate. Zero
  // aluno ou zero aula dá zero possível, e dividir aí devolveria NaN na tela.
  const possiveis = n(ativas) * n(aulasGate);
  const pct = (parte: number, total: number) =>
    total > 0 ? `${Math.round((parte / total) * 100)}%` : "—";

  const cards = [
    {
      rotulo: "Matrículas",
      valor: n(matriculas),
      nota: `${n(ativas)} com acesso ativo`,
    },
    {
      rotulo: "Conclusão de aulas",
      valor: pct(n(concluidas), possiveis),
      nota: `${n(concluidas)} de ${possiveis} possíveis (${n(aulasGate)} aulas no gate)`,
    },
    {
      rotulo: "Aprovação na prova",
      valor: pct(n(aprovadas), n(provas)),
      nota:
        n(provas) > 0
          ? `${n(aprovadas)} de ${n(provas)} provas entregues, corte ${NOTA_MINIMA}%`
          : "nenhuma prova entregue ainda",
    },
    {
      rotulo: "Certificados",
      valor: n(certificados),
      nota: "emitidos até agora",
    },
  ];

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
          <article
            key={c.rotulo}
            className="rounded-lg border border-areia bg-white px-5 py-4"
          >
            <p className="text-[11px] tracking-[0.12em] text-pedra uppercase">{c.rotulo}</p>
            <p className="mt-2 font-serif text-[32px] leading-none text-verde">{c.valor}</p>
            <p className="mt-2 text-[12px] text-medio">{c.nota}</p>
          </article>
        ))}
      </div>

      <p className="mt-8 max-w-2xl border-l-2 border-gold-soft pl-4 text-[12px] text-medio">
        Alunos, Questões, Conteúdo e E-mails entram em seguida. O banco de questões ainda tem o
        seed, então a taxa de aprovação só passa a significar algo depois das ~100 questões
        reais.
      </p>
    </>
  );
}

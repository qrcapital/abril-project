import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Cabecalho,
  Linha,
  Quadro,
  Selo,
  TOM_ESTADO,
  Vazio,
  situacaoProva,
} from "@/app/admin/_ui/tabela";
import { ROTULO_ESTADO, estadoDaMatricula } from "@/lib/matricula-estado";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Aluno" };

/**
 * Detalhe do aluno (PLANO-ADMIN §4.3), somente leitura.
 *
 * As AÇÕES do §4.3 (reenviar acesso, trocar e-mail, liberar 2ª chamada, revogar ou estender) são
 * Fase 3 e continuam bloqueadas em Guru e SES. Duas delas não dependem de integração nenhuma
 * (liberar 2ª chamada e estender acesso) e ainda assim ficam de fora: o §2 pede auditoria para ação
 * sensível, e a tela de Equipe já abriu essa dívida com log de servidor. Somar mais três ações
 * sobre o mesmo rastro fraco é a hora errada.
 *
 * Aqui a leitura é MISTA de propósito: `aluno_modulos` é função da `0006`, porque agrupar por módulo
 * é agregação; o resto vem do PostgREST direto, porque é uma linha por tabela para um aluno só, e
 * função nova para isso seria SQL a mais para manter sem ganho. O e-mail vem do Admin API
 * (`getUserById`), que é o único jeito de alcançar `auth.users` sem função nova.
 */

type Modulo = {
  ord: number;
  titulo: string;
  total: number;
  concluidas: number;
  conta_no_gate: boolean;
};

type Exame = {
  attempt: number;
  status: string;
  score: number | null;
  started_at: string | null;
  submitted_at: string | null;
  deadline: string | null;
};

const data = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : "—";

export default async function Aluno({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Sem isto, um id malformado viraria erro de banco (uuid inválido) e o aluno veria a tela de
  // erro em vez de um 404 honesto.
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const db = createAdminClient();
  const [conta, perfil, matriculas, modulos, provas] = await Promise.all([
    db.auth.admin.getUserById(id),
    db.from("profiles").select("nome, telefone, guru_customer_id, is_admin, is_master").eq("id", id).maybeSingle(),
    db
      .from("enrollments")
      .select("status, purchased_at, expires_at, inicio_em, liberacao_total, guru_order_id")
      .eq("user_id", id)
      .order("expires_at", { ascending: false }),
    db.rpc("aluno_modulos", { alvo: id }),
    db
      .from("exams")
      .select("attempt, status, score, started_at, submitted_at, deadline")
      .eq("user_id", id)
      .order("attempt", { ascending: true }),
  ]);

  const user = conta.data?.user;
  if (!user) notFound();

  // A mais recente manda, igual ao `getMatricula`: renovação cria linha nova.
  const atual = (matriculas.data ?? [])[0];
  const estado = estadoDaMatricula(atual?.status, atual?.expires_at);

  const mods = (modulos.data ?? []) as Modulo[];
  const exames = (provas.data ?? []) as Exame[];
  const gate = mods.filter((m) => m.conta_no_gate);
  const feitasGate = gate.reduce((s, m) => s + m.concluidas, 0);
  const totalGate = gate.reduce((s, m) => s + m.total, 0);

  return (
    <>
      <Link
        href="/admin/alunos"
        className="mb-4 inline-block text-[12px] text-gold-dark underline decoration-areia underline-offset-2 hover:decoration-gold"
      >
        Voltar para Alunos
      </Link>

      <header className="mb-7">
        <h1 className="text-[26px] text-verde">
          {perfil.data?.nome || <span className="text-pedra">Conta sem nome</span>}
        </h1>
        <p className="mt-1 text-[13px] text-medio">{user.email}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Selo tom={TOM_ESTADO[estado]}>{ROTULO_ESTADO[estado]}</Selo>
          {perfil.data?.is_master ? (
            <Selo tom="forte">admin mestre</Selo>
          ) : perfil.data?.is_admin ? (
            <Selo tom="destaque">admin</Selo>
          ) : null}
          {atual?.liberacao_total && <Selo tom="destaque">liberação total</Selo>}
        </div>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-[15px] text-verde">Cadastro e acesso</h2>
        <Quadro>
          <dl className="grid gap-x-8 gap-y-3 px-5 py-4 text-[13px] sm:grid-cols-2">
            {[
              ["Telefone", perfil.data?.telefone || "—"],
              ["Cliente no Guru", perfil.data?.guru_customer_id || "—"],
              ["Pedido no Guru", atual?.guru_order_id || "—"],
              ["Conta criada em", data(user.created_at)],
              ["Compra", data(atual?.purchased_at)],
              ["Acesso expira", data(atual?.expires_at)],
              ["Início do calendário", data(atual?.inicio_em)],
              ["Último login", data(user.last_sign_in_at)],
            ].map(([rotulo, valor]) => (
              <div key={rotulo}>
                <dt className="text-[11px] tracking-[0.1em] text-pedra uppercase">{rotulo}</dt>
                <dd className="mt-0.5 text-grafite">{valor}</dd>
              </div>
            ))}
          </dl>
        </Quadro>
        {(matriculas.data ?? []).length > 1 && (
          <p className="mt-2 text-[12px] text-medio">
            Esta conta tem {matriculas.data!.length} matrículas. Os dados acima são da mais recente.
          </p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-[15px] text-verde">
          Progresso{" "}
          <span className="font-sans text-[12px] font-normal text-pedra">
            ({feitasGate}/{totalGate} no gate da prova)
          </span>
        </h2>
        {mods.length === 0 ? (
          <Vazio>Nenhum módulo no banco. Rode o seed neste ambiente.</Vazio>
        ) : (
          <Quadro>
            <table className="w-full min-w-[520px] border-collapse text-left">
              <Cabecalho colunas={["Módulo", "Aulas", "Conta no gate"]} />
              <tbody>
                {mods.map((m) => (
                  <Linha key={m.ord}>
                    <td className="px-4 py-3 text-[13px] text-grafite">
                      {m.ord}. {m.titulo}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-grafite">
                      {m.concluidas}/{m.total}
                      {m.total > 0 && m.concluidas === m.total && (
                        <span className="ml-2 text-[11px] text-sucesso">completo</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-medio">
                      {m.conta_no_gate ? "sim" : "não"}
                    </td>
                  </Linha>
                ))}
              </tbody>
            </table>
          </Quadro>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-[15px] text-verde">Prova</h2>
        {exames.length === 0 ? (
          <Vazio>Nunca abriu a prova.</Vazio>
        ) : (
          <Quadro>
            <table className="w-full min-w-[620px] border-collapse text-left">
              <Cabecalho
                colunas={["Tentativa", "Situação", "Início", "Prazo", "Entrega"]}
              />
              <tbody>
                {exames.map((e) => {
                  const s = situacaoProva(e.status, e.score);
                  return (
                    <Linha key={e.attempt}>
                      <td className="px-4 py-3 text-[13px] text-grafite">{e.attempt}</td>
                      <td className="px-4 py-3">
                        <Selo tom={s.tom}>{s.texto}</Selo>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-medio">{data(e.started_at)}</td>
                      <td className="px-4 py-3 text-[12px] text-medio">{data(e.deadline)}</td>
                      <td className="px-4 py-3 text-[12px] text-medio">{data(e.submitted_at)}</td>
                    </Linha>
                  );
                })}
              </tbody>
            </table>
          </Quadro>
        )}
        <p className="mt-3 max-w-2xl border-l-2 border-gold-soft pl-4 text-[12px] text-medio">
          Somente leitura. As ações do aluno (reenviar acesso, trocar e-mail, liberar 2ª chamada,
          revogar ou estender acesso) são da Fase 3 do <code>PLANO-ADMIN</code>, que depende do Guru
          e do SES.
        </p>
      </section>
    </>
  );
}

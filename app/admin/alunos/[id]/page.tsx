import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import DadosEditaveis from "./DadosEditaveis";
import LimparModulo from "./LimparModulo";
import ReenviarAcesso from "./ReenviarAcesso";
import SegundaChamada from "./SegundaChamada";

import {
  Cabecalho,
  Linha,
  Quadro,
  Selo,
  TOM_ESTADO,
  Vazio,
  dataHora as data,
  situacaoProva,
} from "@/app/admin/_ui/tabela";
import { ROTULO_ESTADO, estadoDaMatricula } from "@/lib/matricula-estado";
import { podeSegundaChamada } from "@/lib/prova-correcao";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Aluno" };

/**
 * Detalhe do aluno (PLANO-ADMIN §4.3), somente leitura.
 *
 * Das AÇÕES do §4.3, duas saíram em 31/jul/2026: **reenviar acesso**, a mais pedida no suporte, e
 * **liberar 2ª chamada**, que era prometida em dois textos nossos (a tela do reprovado e o e-mail de
 * resultado) e não existia em lugar nenhum — o primeiro aluno a reprovar em produção geraria um ticket
 * sem resposta possível.
 *
 * A segunda destravou junto com a **auditoria** (`admin_audit`, migration `0014`), que o §2 pedia desde
 * o plano e as três telas anteriores foram empurrando com `console.log`. Liberar tentativa de prova é
 * decisão caso a caso sobre uma prova de tentativa única: é a ação que mais precisa responder "quem
 * liberou e por quê" meses depois.
 *
 * **Editar nome, e-mail, telefone e o progresso por módulo** entrou em 31/jul/2026, a pedido do
 * Pedro, e com isso a tela deixou de ser só leitura. Revogar e estender acesso seguem fora: elas
 * mexem em acesso pago, e o que falta ali é decisão de produto sobre o que fazer com a matrícula.
 *
 * A edição dos dados é **no lugar**: um "Editar" no alto transforma nome, e-mail e telefone em campo,
 * e cada um salva sozinho ao perder o foco (`DadosEditaveis`). A primeira versão era um `<details>`
 * com botão "Salvar dados", que repetia num formulário à parte três campos já mostrados na tela; o
 * Pedro achou travada e ela durou uma hora. O progresso continua em botão por linha, que é clique
 * único e muda o contador do gate.
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

/** O que cada `?ok=` diz na volta da rota. Um lugar só, porque agora são cinco. */
const MENSAGENS: Record<string, string> = {
  acesso: "E-mail de acesso reenviado, com link novo.",
  "segunda-chamada": "Tentativa liberada. O aluno recomeça pelas instruções, com sorteio novo.",
  "progresso-marcado": "Módulo marcado como concluído.",
  "progresso-limpo": "Progresso do módulo apagado.",
};

type Exame = {
  attempt: number;
  status: string;
  score: number | null;
  started_at: string | null;
  submitted_at: string | null;
  deadline: string | null;
};

export default async function Aluno({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const [{ id }, { ok, erro }] = await Promise.all([params, searchParams]);
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
  // A última tentativa decide se a 2ª chamada pode ser liberada, e a decisão é da
  // `podeSegundaChamada`: a tela passa dado cru e não calcula "aprovado". A primeira versão calculava
  // aqui de um jeito e na rota de outro, e a tela oferecia o botão que a rota deveria recusar.
  const ultima = exames[exames.length - 1];
  const decisao = podeSegundaChamada(
    ultima
      ? { status: ultima.status as "available" | "in_progress" | "submitted", nota: ultima.score }
      : null,
  );

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

      <DadosEditaveis
        userId={user.id}
        inicial={{
          nome: perfil.data?.nome ?? "",
          email: user.email ?? "",
          telefone: perfil.data?.telefone ?? "",
        }}
        leitura={[
          ["Cliente no Guru", perfil.data?.guru_customer_id || "—"],
          ["Pedido no Guru", atual?.guru_order_id || "—"],
          ["Conta criada em", data(user.created_at)],
          ["Compra", data(atual?.purchased_at)],
          ["Acesso expira", data(atual?.expires_at)],
          ["Início do calendário", data(atual?.inicio_em)],
          ["Último login", data(user.last_sign_in_at)],
        ]}
        acoes={
          <>
            <Selo tom={TOM_ESTADO[estado]}>{ROTULO_ESTADO[estado]}</Selo>
            {perfil.data?.is_master ? (
              <Selo tom="forte">admin mestre</Selo>
            ) : perfil.data?.is_admin ? (
              <Selo tom="destaque">admin</Selo>
            ) : null}
            {atual?.liberacao_total && <Selo tom="destaque">liberação total</Selo>}
            {/* A ação de suporte mais pedida (PRD §16): "não recebi o acesso". Fica no cabeçalho da
                conta, e não na tela de E-mails, porque quem chega aqui chega pelo nome da pessoa, e
                quando o e-mail nunca saiu não existe linha no log para clicar. */}
            {user.email && <ReenviarAcesso userId={user.id} email={user.email} />}
            {/* Mensagens das ações que ainda navegam (progresso, 2ª chamada, reenviar acesso). A
                edição dos dados não passa por aqui: ela avisa no próprio editor, sem recarregar. */}
            {ok && MENSAGENS[ok] && <span className="text-[12px] text-sucesso">{MENSAGENS[ok]}</span>}
            {erro && <span className="text-[12px] text-falha">{erro}</span>}
          </>
        }
      />

      {(matriculas.data ?? []).length > 1 && (
        <p className="-mt-6 mb-8 text-[12px] text-medio">
          Esta conta tem {matriculas.data!.length} matrículas. Os dados acima são da mais recente.
        </p>
      )}

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
              <Cabecalho colunas={["Módulo", "Aulas", "Conta no gate", ""]} />
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
                    {/* Por MÓDULO, e não por aula: é como o Pedro pediu e é o caso real do suporte
                        ("assisti tudo e não marcou"). Cada botão só aparece quando tem o que fazer,
                        senão a linha oferece duas ações e uma delas é sempre inócua. */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {m.total > 0 && m.concluidas < m.total && (
                        <form method="post" action="/admin/api/aluno" className="inline">
                          <input type="hidden" name="acao" value="progresso" />
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="ord" value={m.ord} />
                          <input type="hidden" name="modo" value="marcar" />
                          <button
                            type="submit"
                            className="mr-2 rounded-md border border-areia px-3 py-1.5 text-[12px] text-gold-dark hover:border-gold"
                          >
                            Concluir
                          </button>
                        </form>
                      )}
                      {m.concluidas > 0 && (
                        <LimparModulo
                          userId={user.id}
                          ord={m.ord}
                          titulo={`${m.ord}. ${m.titulo}`}
                          concluidas={m.concluidas}
                          contaNoGate={m.conta_no_gate}
                        />
                      )}
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
        {/* A LIBERAÇÃO DE 2ª CHAMADA, que era promessa em dois textos nossos e não existia em lugar
            nenhum: a tela do aluno reprovado manda pedir no WhatsApp e o e-mail diz que é liberada
            caso a caso. A decisão de quem pode receber vem da `podeSegundaChamada`, a mesma que a
            rota reconfere, e quando ela recusa a tela mostra o MOTIVO em vez de esconder o botão:
            aqui, ao contrário da tela de Equipe, o motivo é a informação que o suporte precisa para
            responder o aluno. */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {decisao.ok ? (
            <SegundaChamada
              userId={user.id}
              nome={perfil.data?.nome || user.email || "Este aluno"}
              nota={ultima?.score ?? null}
            />
          ) : (
            <p className="max-w-2xl border-l-2 border-areia pl-3 text-[12px] text-medio">
              <strong>2ª chamada:</strong> {decisao.motivo}
            </p>
          )}
        </div>

        <p className="mt-4 max-w-2xl border-l-2 border-gold-soft pl-4 text-[12px] text-medio">
          Revogar e estender acesso seguem fora: mexem em acesso pago e falta decidir o que fazer
          com a matrícula. Toda edição desta tela fica registrada em <code>admin_audit</code>, que
          ainda não tem tela para consultar.
        </p>
      </section>
    </>
  );
}

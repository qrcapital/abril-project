import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import DadosEditaveis from "./DadosEditaveis";
import LimparModulo from "./LimparModulo";
import ReenviarAcesso from "./ReenviarAcesso";
import LinkAcesso from "./LinkAcesso";

import {
  Cabecalho,
  Linha,
  Quadro,
  Selo,
  TOM_ESTADO,
  Vazio,
  dataHora as data,
} from "@/app/admin/_ui/tabela";
import { ROTULO_ESTADO, estadoDaMatricula } from "@/lib/matricula-estado";
import { rotuloModulo } from "@/lib/curso";
import { exigirAdmin } from "@/lib/admin-guarda";
import { situacaoEntrega, type EventoGravado } from "@/lib/ses-eventos";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Aluno" };

/**
 * Detalhe do aluno (PLANO-ADMIN §4.3), somente leitura.
 *
 * Das AÇÕES do §4.3, a primeira a sair (31/jul/2026) foi **reenviar acesso**, a mais pedida no
 * suporte. A **liberação de 2ª chamada** da prova saiu junto com a prova, em 30/set/2026: o curso
 * deixou de ter prova final, e o certificado passou a sair na conclusão das aulas. No lugar da seção
 * da prova, a tela mostra o certificado: o código, ou o que falta para ele sair.
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
 *
 * **E-mails recentes com a entrega** entrou em 09/out/2026 (migration 0033): os últimos envios do
 * `email_log` e, para cada um, o que o SES ouviu do servidor do destinatário (`email_eventos`).
 */

/** Uma linha do `email_log`. `ses_message_id` só existe depois da 0033, por isso opcional. */
type EmailLog = {
  id: string;
  template: string;
  sent_at: string;
  status: string | null;
  ses_message_id?: string | null;
};

/** Quantos e-mails a tela mostra. O histórico inteiro fica na tela de E-mails. */
const EMAILS_NA_TELA = 10;

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
  "progresso-marcado": "Módulo marcado como concluído.",
  "progresso-limpo": "Progresso do módulo apagado.",
  politica: "Política de liberação trocada. Vale na próxima tela que o aluno abrir.",
};


export default async function Aluno({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  // Antes de qualquer leitura com a service role: layout e página rodam em paralelo, e a guarda
  // do layout não segura a consulta daqui (ver `lib/admin-guarda.ts`).
  await exigirAdmin();
  const [{ id }, { ok, erro }] = await Promise.all([params, searchParams]);
  // Sem isto, um id malformado viraria erro de banco (uuid inválido) e o aluno veria a tela de
  // erro em vez de um 404 honesto.
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const db = createAdminClient();
  const [conta, perfil, matriculas, modulos, certificado, politicas, emails] = await Promise.all([
    db.auth.admin.getUserById(id),
    db.from("profiles").select("nome, telefone, guru_customer_id, is_admin, is_master").eq("id", id).maybeSingle(),
    db
      .from("enrollments")
      .select("status, purchased_at, expires_at, inicio_em, liberacao_total, guru_order_id, release_policy_id")
      .eq("user_id", id)
      .order("expires_at", { ascending: false }),
    db.rpc("aluno_modulos", { alvo: id }),
    db.from("certificates").select("codigo, issued_at").eq("user_id", id).maybeSingle(),
    db.from("release_policies").select("id, nome, ativa").order("created_at"),
    // `*` e não a lista de colunas: antes da 0033 rodar, pedir `ses_message_id` derrubaria a
    // consulta inteira, e a tela perderia os e-mails por causa de uma coluna.
    db
      .from("email_log")
      .select("*")
      .eq("user_id", id)
      .order("sent_at", { ascending: false })
      .limit(EMAILS_NA_TELA),
  ]);

  const user = conta.data?.user;
  if (!user) notFound();

  // A mais recente manda, igual ao `getMatricula`: renovação cria linha nova.
  const atual = (matriculas.data ?? [])[0];
  const estado = estadoDaMatricula(atual?.status, atual?.expires_at);

  const mods = (modulos.data ?? []) as Modulo[];
  const cert = certificado.data as { codigo: string; issued_at: string } | null;

  // Eventos de entrega do SES para os e-mails acima (0033, via /api/webhooks/ses). Sem a tabela, o
  // erro é ignorado e cada linha mostra "sem retorno": a tela não depende do rastreio para abrir.
  const logs = (emails.data ?? []) as EmailLog[];
  const idsSes = logs.map((l) => l.ses_message_id).filter((v): v is string => Boolean(v));
  const eventosPorId = new Map<string, EventoGravado[]>();
  if (idsSes.length) {
    const { data: eventos } = await db
      .from("email_eventos")
      .select("ses_message_id, tipo, detalhe, ocorrido_em")
      .in("ses_message_id", idsSes);
    for (const e of (eventos ?? []) as (EventoGravado & { ses_message_id: string })[]) {
      eventosPorId.set(e.ses_message_id, [...(eventosPorId.get(e.ses_message_id) ?? []), e]);
    }
  }

  const gate = mods.filter((m) => m.conta_no_gate);
  const feitasGate = gate.reduce((s, m) => s + m.concluidas, 0);
  const totalGate = gate.reduce((s, m) => s + m.total, 0);

  return (
    <>
      <Link
        href="/admin/alunos"
        className="mb-4 inline-block text-[12px] text-gold-dark underline decoration-areia underline-offset-2 hover:decoration-acento"
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
            {user.email && <LinkAcesso userId={user.id} />}
            {/* Mensagens das ações que ainda navegam (progresso, política, reenviar acesso). A
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

      {/* Política de liberação DESTE aluno (0017). O padrão de todos é a política ativa da tela
          de Liberação; aqui só a exceção. Sem confirmação, ao contrário do ativar de lá: o raio
          é um aluno, e desfazer é escolher de novo. */}
      {atual && (
        <section className="mb-8">
          <h2 className="mb-3 text-[15px] text-tinta">Liberação de conteúdo</h2>
          <form
            method="post"
            action="/admin/api/aluno"
            className="flex flex-wrap items-center gap-3"
          >
            <input type="hidden" name="acao" value="politica" />
            <input type="hidden" name="userId" value={user.id} />
            <select
              name="politica"
              defaultValue={atual.release_policy_id ?? ""}
              aria-label="Política de liberação deste aluno"
              className="rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite focus:border-acento focus:outline-none"
            >
              <option value="">Padrão de todos (a política ativa)</option>
              {(politicas.data ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                  {p.ativa ? " · ativa" : ""}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md bg-acento px-4 py-2 text-[12px] font-semibold text-offwhite hover:bg-acento-fundo"
            >
              Trocar liberação
            </button>
            <span className="text-[12px] text-pedra">
              {atual.release_policy_id
                ? "Este aluno segue uma política própria."
                : "Este aluno segue o padrão. Escolher uma política aqui vale só para ele."}
            </span>
          </form>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-[15px] text-tinta">
          Progresso{" "}
          <span className="font-sans text-[12px] font-normal text-pedra">
            ({feitasGate}/{totalGate} aulas que contam para o certificado)
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
                      {rotuloModulo(m.ord)} · {m.titulo}
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
                            className="mr-2 rounded-md border border-areia px-3 py-1.5 text-[12px] text-gold-dark hover:border-acento"
                          >
                            Concluir
                          </button>
                        </form>
                      )}
                      {m.concluidas > 0 && (
                        <LimparModulo
                          userId={user.id}
                          ord={m.ord}
                          titulo={`${rotuloModulo(m.ord)} · ${m.titulo}`}
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

      {/* E-mails recentes, com a entrega segundo o servidor do destinatário. "enviado" no log é só a
          API do SES aceitando; a coluna Entrega é o que o SES ouviu depois (docs/SES-RASTREIO.md).
          Responde o "não recebi" do suporte sem abrir o console da AWS. */}
      <section className="mb-8">
        <h2 className="mb-3 text-[15px] text-tinta">E-mails recentes</h2>
        {logs.length === 0 ? (
          <Vazio>Nenhum e-mail registrado para esta conta.</Vazio>
        ) : (
          <Quadro>
            <table className="w-full min-w-[620px] border-collapse text-left">
              <Cabecalho colunas={["Quando", "E-mail", "Envio", "Entrega"]} />
              <tbody>
                {logs.map((l) => {
                  const enviado = l.status === "enviado";
                  const s = enviado
                    ? situacaoEntrega(
                        eventosPorId.get(l.ses_message_id ?? "") ?? [],
                        Boolean(l.ses_message_id),
                      )
                    : null;
                  return (
                    <Linha key={l.id}>
                      <td className="px-4 py-3 text-[12px] whitespace-nowrap text-medio">{data(l.sent_at)}</td>
                      <td className="px-4 py-3 text-[13px] text-grafite">{l.template}</td>
                      <td className="px-4 py-3 text-[12px] text-medio">{l.status ?? "sem status"}</td>
                      <td className="px-4 py-3 text-[12px]">
                        {s ? (
                          <>
                            <span title={s.detalhe ?? undefined}>
                              <Selo tom={s.tom}>{s.rotulo}</Selo>
                            </span>
                            {s.detalhe && s.tom !== "ok" && (
                              <span className="mt-1 block max-w-[360px] truncate text-[11px] text-pedra" title={s.detalhe}>
                                {s.detalhe}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-pedra">não saiu</span>
                        )}
                      </td>
                    </Linha>
                  );
                })}
              </tbody>
            </table>
          </Quadro>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-[15px] text-tinta">Certificado</h2>
        {/* O certificado sai sozinho quando o aluno conclui a última aula que conta (e também quando
            o "Concluir" acima fecha o gate por ele). Aqui só a leitura: o código é o que o suporte
            precisa para responder "meu certificado é válido?", e a verificação pública é o link. */}
        {cert ? (
          <p className="text-[13px] text-grafite">
            <Selo tom="ok">emitido</Selo> em {data(cert.issued_at)}, código{" "}
            <a
              href={`/verificar/${cert.codigo}`}
              className="font-semibold text-gold-dark underline decoration-areia underline-offset-2 hover:decoration-acento"
            >
              {cert.codigo}
            </a>
          </p>
        ) : (
          <Vazio>
            Ainda não emitido. Sai quando o aluno concluir as {totalGate} aulas que contam
            {totalGate > feitasGate ? `; faltam ${totalGate - feitasGate}.` : "."}
          </Vazio>
        )}

        <p className="mt-4 max-w-2xl border-l-2 border-gold-soft pl-4 text-[12px] text-medio">
          Revogar e estender acesso seguem fora: mexem em acesso pago e falta decidir o que fazer
          com a matrícula. Toda edição desta tela fica registrada em <code>admin_audit</code>, que
          ainda não tem tela para consultar.
        </p>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import {
  Cabecalho,
  Linha,
  Quadro,
  Selo,
  TOM_ESTADO,
  Vazio,
  situacaoProva,
} from "@/app/admin/_ui/tabela";
import { ROTULO_ESTADO, estadoDaMatricula, type EstadoAcesso } from "@/lib/matricula-estado";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Alunos" };

/**
 * Lista de alunos (PLANO-ADMIN §4.2).
 *
 * Busca por nome ou e-mail e filtro por status, os dois em `<form method="get">`, com os termos na
 * URL. Nenhuma linha de JS na tela, e a busca fica compartilhável e recarregável.
 *
 * O ESTADO DE ACESSO É DERIVADO AQUI, em TypeScript, pela mesma `estadoDaMatricula` que a guarda do
 * aluno usa (`lib/matricula-estado.ts`). A função `listar_alunos` da migration `0006` devolve
 * `status` e `expires_at` crus de propósito: repetir a regra em SQL criaria uma segunda verdade
 * sobre quem tem acesso, e a divergência não apareceria em build nem em lint. Apareceria no
 * suporte, com a tela dizendo "ativo" para quem o app tranca na porta.
 *
 * O FILTRO POR STATUS, por consequência, roda depois da derivação e não na consulta. É o preço de
 * ter uma regra só, e é barato: o `limite` já segura o tamanho do conjunto.
 */

type Aluno = {
  id: string;
  email: string;
  nome: string | null;
  is_admin: boolean;
  status: string | null;
  expires_at: string | null;
  liberacao_total: boolean;
  concluidas: number;
  prova_status: string | null;
  prova_score: number | null;
  prova_tentativas: number;
};

const FILTROS: { valor: string; rotulo: string }[] = [
  { valor: "", rotulo: "Todos" },
  { valor: "ativa", rotulo: "Ativos" },
  { valor: "expirada", rotulo: "Expirados" },
  { valor: "revogada", rotulo: "Revogados" },
  { valor: "ausente", rotulo: "Sem matrícula" },
];

export default async function Alunos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; st?: string }>;
}) {
  const { q = "", st = "" } = await searchParams;
  const termo = q.trim();

  const db = createAdminClient();
  const [lista, gate] = await Promise.all([
    db.rpc("listar_alunos", { termo, limite: 200 }),
    db.from("lessons").select("id", { count: "exact", head: true }).eq("conta_no_gate", true),
  ]);

  const total_gate = gate.count ?? 0;
  const todos = ((lista.data ?? []) as Aluno[]).map((a) => ({
    ...a,
    estado: estadoDaMatricula(a.status, a.expires_at),
  }));
  const alunos = st ? todos.filter((a) => a.estado === st) : todos;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[26px] text-verde">Alunos</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-medio">
          Todas as contas do ambiente, com acesso, progresso e situação da prova. O progresso conta
          só as {total_gate} aulas que liberam a prova.
        </p>
      </header>

      <form method="get" className="mb-5 flex flex-wrap items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="nome ou e-mail"
          aria-label="Buscar por nome ou e-mail"
          className="min-w-0 flex-1 basis-64 rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-gold focus:outline-none"
        />
        <select
          name="st"
          defaultValue={st}
          aria-label="Filtrar por status de acesso"
          className="rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite focus:border-gold focus:outline-none"
        >
          {FILTROS.map((f) => (
            <option key={f.valor} value={f.valor}>
              {f.rotulo}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-verde px-4 py-2 text-[13px] font-semibold text-offwhite hover:bg-verde-2"
        >
          Filtrar
        </button>
      </form>

      <p className="mb-2 text-[12px] text-pedra">
        {alunos.length === 1 ? "1 conta" : `${alunos.length} contas`}
        {st && ` com acesso ${ROTULO_ESTADO[st as EstadoAcesso] ?? st}`}
        {termo && ` para "${termo}"`}
        {todos.length === 200 && ", e a consulta bateu o limite de 200"}
      </p>

      {alunos.length === 0 ? (
        <Vazio>
          {termo || st
            ? "Nenhuma conta com esses filtros."
            : "Nenhuma conta neste ambiente ainda."}
        </Vazio>
      ) : (
        <Quadro>
          <table className="w-full min-w-[720px] border-collapse text-left">
            <Cabecalho colunas={["Aluno", "Acesso", "Progresso", "Prova", ""]} />
            <tbody>
              {alunos.map((a) => {
                const prova = situacaoProva(a.prova_status, a.prova_score);
                return (
                  <Linha key={a.id}>
                    <td className="px-4 py-3">
                      <span className="block text-[13px] text-grafite">
                        {a.nome || <span className="text-pedra">sem nome</span>}
                      </span>
                      <span className="block text-[12px] text-medio">{a.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Selo tom={TOM_ESTADO[a.estado]}>{ROTULO_ESTADO[a.estado]}</Selo>
                      {a.liberacao_total && (
                        <span className="mt-1 block text-[11px] text-gold-dark">
                          liberação total
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-grafite">
                      {a.concluidas}/{total_gate}
                    </td>
                    <td className="px-4 py-3">
                      <Selo tom={prova.tom}>{prova.texto}</Selo>
                      {a.prova_tentativas > 1 && (
                        <span className="mt-1 block text-[11px] text-medio">
                          {a.prova_tentativas} tentativas
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/alunos/${a.id}`}
                        className="text-[12px] text-gold-dark underline decoration-areia underline-offset-2 hover:decoration-gold"
                      >
                        Ver
                      </Link>
                    </td>
                  </Linha>
                );
              })}
            </tbody>
          </table>
        </Quadro>
      )}
    </>
  );
}

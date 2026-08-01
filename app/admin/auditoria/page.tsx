import type { Metadata } from "next";
import Link from "next/link";

import { Cabecalho, Linha, Quadro, Selo, Vazio, dataHora } from "@/app/admin/_ui/tabela";
import { descrever, rotularAcao } from "@/lib/auditoria-texto";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Auditoria" };

/**
 * O rastro do que os admins fizeram (PLANO-ADMIN §2).
 *
 * A tabela `admin_audit` existe desde 31/jul/2026 e ficou meio dia **sem leitor**: gravava e só se
 * consultava por SQL. Auditoria que depende de acesso ao banco não responde a quem precisa
 * perguntar, e a lista de ações registradas já inclui troca de e-mail, que é troca de login.
 *
 * **Somente leitura, e sem paginação.** Não há ação nenhuma nesta tela de propósito: apagar linha de
 * auditoria pelo painel seria desfazer o motivo dela existir. O corte é por `LIMITE` com a busca do
 * lado, que é o que a tela de E-mails já faz; paginação entra quando o volume pedir, e hoje o
 * ambiente inteiro tem dezenas de linhas.
 *
 * **Qualquer admin lê, não só o mestre.** O rastro serve para responder perguntas sobre o painel, e
 * esconder isso de quem opera transformaria a transparência em privilégio. Quem não pode entrar aqui
 * também não pode entrar em nenhuma outra tela do admin, que é a mesma guarda do layout.
 */

const LIMITE = 200;

type LinhaAuditoria = {
  id: string;
  autor_email: string | null;
  acao: string;
  alvo_id: string | null;
  alvo_email: string | null;
  alvo_nome: string | null;
  detalhe: Record<string, unknown> | null;
  created_at: string;
};

/** Ação que TIRA alguma coisa de alguém aparece em tom de atenção. */
const tom = (acao: string): "atencao" | "neutro" =>
  /revogar|limpar|apagar|remover/.test(acao) ? "atencao" : "neutro";

export default async function Auditoria({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const termo = q.trim();

  const db = createAdminClient();
  const { data, error } = await db.rpc("listar_auditoria", { termo, limite: LIMITE });
  const linhas = (data ?? []) as LinhaAuditoria[];

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[26px] text-verde">Auditoria</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-medio">
          Quem fez o quê no painel, sobre quem e quando. Somente leitura: nem esta tela nem nenhuma
          outra apaga linha daqui. O e-mail de quem agiu fica congelado no registro, então o rastro
          continua legível mesmo se a conta dele sair da equipe.
        </p>
      </header>

      <form method="get" className="mb-5 flex max-w-xl gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="e-mail de quem agiu, do aluno, ou o nome da ação"
          aria-label="Buscar no rastro"
          className="min-w-0 flex-1 rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-verde px-4 py-2 text-[13px] font-semibold text-offwhite hover:bg-verde-2"
        >
          Buscar
        </button>
      </form>

      {error ? (
        <Vazio>
          Não deu para ler o rastro: {error.message}. Se a mensagem falar em função inexistente, a
          migration <code>0015</code> não foi aplicada neste ambiente.
        </Vazio>
      ) : linhas.length === 0 ? (
        <Vazio>
          {termo
            ? `Nada encontrado para "${termo}".`
            : "Nenhuma ação registrada ainda neste ambiente."}
        </Vazio>
      ) : (
        <>
          <p className="mb-2 text-[12px] text-medio">
            {linhas.length === 1 ? "1 registro" : `${linhas.length} registros`}
            {linhas.length === LIMITE && ", os mais recentes. Use a busca para achar os antigos"}
          </p>
          <Quadro>
            {/* `table-fixed` com as larguras declaradas, e não `auto`. Medido na tela em 31/jul: o
                miolo do admin tem 854px numa janela de 1150, e com layout automático um e-mail
                longo no de/para estica a coluna até empurrar "O que mudou" para fora, que é
                justamente a coluna que se veio ler. O `min-w` mantém a rolagem lateral em tela
                estreita, onde espremer seria pior. */}
            <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[23%]" />
                <col className="w-[17%]" />
                <col className="w-[19%]" />
                <col className="w-[26%]" />
              </colgroup>
              <Cabecalho colunas={["Quando", "Quem", "Ação", "Sobre", "O que mudou"]} />
              <tbody>
                {linhas.map((l) => (
                  <Linha key={l.id}>
                    <td className="px-4 py-3 text-[12px] text-medio">{dataHora(l.created_at)}</td>
                    <td className="px-4 py-3 text-[12px] break-words text-grafite">
                      {l.autor_email ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Selo tom={tom(l.acao)}>{rotularAcao(l.acao)}</Selo>
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {l.alvo_id ? (
                        // Link para a conta afetada: a pergunta seguinte a "quem mexeu nisso?" é
                        // sempre "como essa conta está agora?".
                        <Link
                          href={`/admin/alunos/${l.alvo_id}`}
                          className="text-gold-dark underline decoration-areia underline-offset-2 hover:decoration-gold"
                        >
                          {l.alvo_nome || l.alvo_email || "conta sem nome"}
                        </Link>
                      ) : (
                        <span className="text-pedra">—</span>
                      )}
                      {/* A conta apagada some do join e sobra o id: continua sendo rastro, e some
                          menos do que uma linha em branco. */}
                      {l.alvo_id && !l.alvo_email && !l.alvo_nome && (
                        <span className="block text-[11px] text-pedra">conta apagada</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-grafite">
                      <div className="break-words">
                        {descrever(l.acao, l.detalhe).map((linha, i) => (
                          <span key={i} className="block">
                            {linha}
                          </span>
                        ))}
                      </div>
                    </td>
                  </Linha>
                ))}
              </tbody>
            </table>
          </Quadro>
        </>
      )}
    </>
  );
}

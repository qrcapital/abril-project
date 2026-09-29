import type { Metadata } from "next";

import { Cabecalho, Linha, Quadro, Selo, Vazio, dataHora } from "@/app/admin/_ui/tabela";
import { exigirAdmin } from "@/lib/admin-guarda";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Consentimentos" };

/**
 * O log de aceite dos documentos (migration `0023`).
 *
 * Existe por um pedido explícito do jurídico da Abril em set/2026: "o log de consentimento fica sob
 * responsabilidade de vocês? Há como mantermos acesso a ele?". Esta tela é o acesso, e o CSV no
 * Painel é a exportação para quem não tem conta aqui.
 *
 * **Somente leitura, como a Auditoria, e pelo mesmo motivo elevado a outro patamar.** Lá, apagar
 * uma linha seria desfazer a transparência do painel; aqui seria destruir prova. Nem esta tela nem
 * nenhuma outra apaga, e o banco recusa o DELETE por trigger mesmo para a service role.
 *
 * **Qualquer admin lê.** O rastro serve para responder a um titular que escreveu perguntando o que
 * a gente tem dele, e essa pergunta chega a quem está atendendo, não ao mestre.
 *
 * Duas linhas por aluno é o normal, não bug: Política e Termos têm versões próprias e são aceitos
 * como documentos distintos. Ver o comentário da migration.
 */

const LIMITE = 500;

type LinhaConsentimento = {
  id: string;
  user_id: string | null;
  email: string;
  email_atual: string | null;
  nome: string | null;
  origem: string;
  documento_tipo: "politica" | "termos";
  documento_versao: string;
  texto: string;
  ip: string | null;
  user_agent: string | null;
  guru_order_id: string | null;
  created_at: string;
};

const DOCUMENTO: Record<string, string> = {
  politica: "Política de Privacidade",
  termos: "Termos de Uso",
};

const ORIGEM: Record<string, string> = {
  "primeiro-acesso": "Primeiro acesso",
  "lista-de-espera": "Lista de espera",
  "signup-homolog": "Cadastro (homolog)",
  "checkout-guru": "Checkout (Guru)",
};

export default async function Consentimentos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Antes de qualquer leitura com a service role: layout e página rodam em paralelo, e a guarda
  // do layout não segura a consulta daqui (ver `lib/admin-guarda.ts`).
  await exigirAdmin();
  const { q = "" } = await searchParams;
  const termo = q.trim();

  const db = createAdminClient();
  const { data, error } = await db.rpc("listar_consentimentos", { termo, limite: LIMITE });
  const linhas = (data ?? []) as LinhaConsentimento[];

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[26px] text-tinta">Consentimentos</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-medio">
          Quem aceitou qual documento, em que versão e quando. Somente leitura: o banco recusa
          alteração e exclusão nesta tabela. Cada aceite na plataforma gera duas linhas, uma por
          documento, porque Política e Termos têm versões próprias.
        </p>
      </header>

      <form method="get" className="mb-5 flex max-w-xl gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="e-mail, nome, pedido no Guru ou origem"
          aria-label="Buscar no log de consentimento"
          className="min-w-0 flex-1 rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-acento focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-acento px-4 py-2 text-[13px] font-semibold text-offwhite hover:bg-acento-fundo"
        >
          Buscar
        </button>
      </form>

      {error ? (
        <Vazio>
          Não deu para ler o log: {error.message}. Se a mensagem falar em função inexistente, a
          migration <code>0023</code> não foi aplicada neste ambiente.
        </Vazio>
      ) : linhas.length === 0 ? (
        <Vazio>
          {termo
            ? `Nada encontrado para "${termo}".`
            : "Nenhum consentimento registrado ainda neste ambiente. O registro começa no primeiro acesso de um aluno ou no primeiro envio da pré-lista depois da migration 0023."}
        </Vazio>
      ) : (
        <>
          <p className="mb-2 text-[12px] text-medio">
            {linhas.length === 1 ? "1 registro" : `${linhas.length} registros`}
            {linhas.length === LIMITE && ", os mais recentes. Use a busca ou o CSV do Painel para os antigos"}
          </p>
          <Quadro>
            {/* Mesmas larguras declaradas da Auditoria, e pelo mesmo motivo medido lá: com layout
                automático um user agent longo estica a coluna e empurra o documento para fora, que
                é a coluna que se veio ler. O IP e o navegador ficam por último porque são a
                evidência técnica, consultada depois da pergunta principal. */}
            <table className="w-full min-w-[820px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[13%]" />
                <col className="w-[24%]" />
                <col className="w-[18%]" />
                <col className="w-[15%]" />
                <col className="w-[30%]" />
              </colgroup>
              <Cabecalho colunas={["Quando", "Quem", "Documento", "Origem", "Como foi colhido"]} />
              <tbody>
                {linhas.map((l) => (
                  <Linha key={l.id}>
                    <td className="px-4 py-3 text-[12px] text-medio">{dataHora(l.created_at)}</td>
                    <td className="px-4 py-3 text-[12px] break-words text-grafite">
                      {l.nome && <span className="block font-semibold">{l.nome}</span>}
                      {l.email}
                      {/* O e-mail atual só aparece quando mudou. É a pista de que o titular
                          escrevendo de outro endereço é a mesma pessoa do registro. */}
                      {l.email_atual && l.email_atual !== l.email && (
                        <span className="mt-0.5 block text-[11px] text-medio">
                          hoje entra como {l.email_atual}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-grafite">
                      <Selo tom={l.documento_tipo === "termos" ? "neutro" : "destaque"}>
                        {DOCUMENTO[l.documento_tipo] ?? l.documento_tipo}
                      </Selo>
                      <span className="mt-1 block text-[11px] text-medio">
                        versão {l.documento_versao}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-grafite">
                      {ORIGEM[l.origem] ?? l.origem}
                      {l.guru_order_id && (
                        <span className="mt-0.5 block text-[11px] break-all text-medio">
                          pedido {l.guru_order_id}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-medio">
                      {/* O texto aceito é o que dá valor à linha, então aparece na tela e não só no
                          CSV. Cortado em duas linhas com o `title` inteiro por cima: a frase é
                          longa e ocuparia a tabela toda, mas quem precisa conferir palavra por
                          palavra passa o mouse ou exporta. */}
                      <span className="line-clamp-2 text-grafite" title={l.texto}>
                        {l.texto}
                      </span>
                      <span className="mt-1 block break-all">
                        {l.ip ?? "sem IP"}
                        {l.user_agent && ` · ${l.user_agent.slice(0, 60)}`}
                      </span>
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

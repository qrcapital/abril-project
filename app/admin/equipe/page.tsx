import type { Metadata } from "next";

import BotaoPapel from "./BotaoPapel";
import { papelAtual } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Equipe" };

/**
 * Quem tem acesso de admin, e como dar ou tirar (PLANO-ADMIN §8).
 *
 * Tela própria em vez de um botão dentro de `/admin/alunos` (§4.2): admin é da equipe interna,
 * e a lista de Alunos é uma lista de compradores, com progresso e situação de prova. Procurar um
 * colega numa tela dessas seria procurar no lugar errado, e a pessoa pode nem ser aluna.
 *
 * A busca é um `<form method="get">` e o termo vive na URL. Nenhuma linha de JS, a busca fica
 * compartilhável e recarregável, e o servidor já é quem tem permissão para ler `auth.users`.
 *
 * A leitura passa pela service role porque `buscar_usuarios` e `listar_admins` só podem ser
 * chamadas por ela (migration `0004`), e a AUTORIZAÇÃO desta tela é a guarda do layout. Isso
 * basta AQUI porque page tem layout; a rota que muta refaz a checagem por conta própria, e o
 * comentário dela explica por quê.
 */

type Achado = {
  id: string;
  email: string;
  nome: string | null;
  is_admin: boolean;
  is_master: boolean;
  criado_em: string;
};
type Admin = {
  id: string;
  email: string;
  nome: string | null;
  is_master: boolean;
  criado_em: string;
};

const MENSAGENS: Record<string, { tom: "sucesso" | "erro"; texto: string }> = {
  promovido: { tom: "sucesso", texto: "Acesso de admin concedido." },
  revogado: { tom: "sucesso", texto: "Acesso de admin removido." },
};

export default async function Equipe({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string; erro?: string }>;
}) {
  const { q = "", ok, erro } = await searchParams;
  const termo = q.trim();

  const db = createAdminClient();
  const eu = await papelAtual();

  const [busca, listaAdmins] = await Promise.all([
    termo ? db.rpc("buscar_usuarios", { termo, limite: 20 }) : Promise.resolve({ data: [] }),
    db.rpc("listar_admins"),
  ]);

  const achados = (busca.data ?? []) as Achado[];
  const admins = (listaAdmins.data ?? []) as Admin[];

  const aviso = erro
    ? { tom: "erro" as const, texto: erro }
    : ok
      ? MENSAGENS[ok]
      : undefined;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[26px] text-verde">Equipe</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-medio">
          Quem tem acesso a este painel. Admin vê e edita tudo, incluindo o banco de questões com
          o gabarito da prova.
        </p>
      </header>

      {aviso && (
        <p
          className={`mb-5 rounded-md border px-4 py-3 text-[13px] ${
            aviso.tom === "sucesso"
              ? "border-sucesso/30 bg-sucesso/8 text-sucesso"
              : "border-falha/30 bg-falha/8 text-falha"
          }`}
          role="status"
        >
          {aviso.texto}
        </p>
      )}

      <section className="mb-9">
        <h2 className="mb-3 text-[15px] text-verde">Buscar conta por e-mail</h2>
        <form method="get" className="flex max-w-xl gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="e-mail, inteiro ou em parte"
            aria-label="E-mail da conta"
            autoFocus
            className="min-w-0 flex-1 rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-verde px-4 py-2 text-[13px] font-semibold text-offwhite hover:bg-verde-2"
          >
            Buscar
          </button>
        </form>

        {termo && (
          <div className="mt-4">
            {achados.length === 0 ? (
              <p className="text-[13px] text-medio">
                Nenhuma conta com e-mail contendo <strong>{termo}</strong>.
              </p>
            ) : (
              <>
                <p className="mb-2 text-[12px] text-pedra">
                  {achados.length === 1
                    ? "1 conta encontrada"
                    : `${achados.length} contas encontradas`}
                  {achados.length === 20 && ", mostrando as 20 primeiras"}
                </p>
                <Tabela linhas={achados} q={q} meuId={eu.id} souMestre={eu.mestre} />
              </>
            )}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-[15px] text-verde">
          Com acesso hoje{" "}
          <span className="font-sans text-[12px] font-normal text-pedra">
            ({admins.length})
          </span>
        </h2>
        <Tabela
          linhas={admins.map((a) => ({ ...a, is_admin: true }))}
          q={q}
          meuId={eu.id}
          souMestre={eu.mestre}
          unico={admins.length <= 1}
          unicoMestre={admins.filter((a) => a.is_master).length <= 1}
        />
        <p className="mt-3 max-w-2xl text-[12px] text-medio">
          O <strong>admin mestre</strong> faz tudo o que um admin faz, e só ele mexe no acesso de
          outro mestre. Conceder o nível de mestre é feito fora do painel, por{" "}
          <code className="text-[11px] text-gold-dark">scripts/admin-conta.mjs --mestre</code>.
        </p>
      </section>
    </>
  );
}

function Tabela({
  linhas,
  q,
  meuId,
  souMestre = false,
  unico = false,
  unicoMestre = false,
}: {
  linhas: Achado[];
  q: string;
  meuId?: string;
  souMestre?: boolean;
  unico?: boolean;
  unicoMestre?: boolean;
}) {
  if (linhas.length === 0) {
    return <p className="text-[13px] text-medio">Nenhuma conta com acesso de admin.</p>;
  }

  return (
    // A tabela rola dentro da própria caixa: e-mail é longo e não pode empurrar a página.
    <div className="overflow-x-auto rounded-lg border border-areia bg-white">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-bege">
            {["E-mail", "Nome", "Papel", ""].map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-[11px] font-semibold tracking-[0.1em] text-pedra uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => {
            const souEu = l.id === meuId;
            return (
              <tr key={l.id} className="border-b border-bege last:border-0">
                <td className="px-4 py-3 text-[13px] text-grafite">
                  {l.email}
                  {souEu && <span className="ml-2 text-[11px] text-pedra">você</span>}
                </td>
                <td className="px-4 py-3 text-[13px] text-medio">{l.nome || "sem nome"}</td>
                <td className="px-4 py-3">
                  {l.is_master ? (
                    <span className="rounded-full bg-verde px-2.5 py-1 text-[11px] font-semibold text-gold-lit">
                      admin mestre
                    </span>
                  ) : l.is_admin ? (
                    <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-semibold text-gold-dark">
                      admin
                    </span>
                  ) : (
                    <span className="text-[12px] text-pedra">aluno</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {/* Toda trava do servidor aparece aqui como ausência de botão, para o admin não
                      descobrir o limite levando um erro depois do clique. O servidor recusa de
                      novo em qualquer caso, e o trigger da 0005 recusa por baixo dele. */}
                  {l.is_admin && souEu ? (
                    <span className="text-[12px] text-pedra">seu acesso</span>
                  ) : l.is_master && !souMestre ? (
                    <span className="text-[12px] text-pedra">só outro mestre</span>
                  ) : l.is_master && unicoMestre ? (
                    <span className="text-[12px] text-pedra">único mestre</span>
                  ) : l.is_admin && unico ? (
                    <span className="text-[12px] text-pedra">único admin</span>
                  ) : (
                    <BotaoPapel
                      userId={l.id}
                      email={l.email}
                      promover={!l.is_admin}
                      mestre={l.is_master}
                      q={q}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import type { Metadata } from "next";

import ApagarQuestao from "./ApagarQuestao";
import { Selo, Vazio } from "@/app/admin/_ui/tabela";
import { rotuloModulo } from "@/lib/curso";
import { LETRAS, META_POR_MODULO, ORDS_AVALIADOS, POR_MODULO } from "@/lib/questoes";
import { TOTAL_QUESTOES } from "@/lib/prova-correcao";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Questões" };

/**
 * Banco de questões (PLANO-ADMIN §4.4). A última tela do painel.
 *
 * QUATRO MÓDULOS E NÃO CINCO, porque é o que o sorteio usa: `sortear_prova` filtra
 * `m.ord between 1 and 4`, e o Módulo 0 é boas-vindas. Um acordeão com o Módulo 0 vazio aqui seria um
 * convite a escrever questão que nunca cai na prova.
 *
 * A TELA MOSTRA DUAS RÉGUAS, e a diferença entre elas é o que decide o que fazer primeiro:
 *
 * - **Piso de {POR_MODULO} ativas por módulo.** Abaixo dele o sorteio não completa as
 *   {TOTAL_QUESTOES} e o `abrirTentativa` estoura: a prova **para de abrir** para todo mundo. É o
 *   aviso vermelho.
 * - **Meta de {META_POR_MODULO}** (PRD §7). Acima do piso a prova abre, mas com o banco pequeno dois
 *   alunos veem quase as mesmas questões: com as 6 do seed, dois sorteios repetem 19 das 20.
 *
 * O gabarito vive aqui e em nenhum outro lugar visível: `questions.correta` não é lida pelo aluno,
 * `sortear_prova` não a retorna, e a cópia que vai para a prova é o `questions_snapshot` da
 * tentativa. Por isso apagar questão não corrompe prova já feita, e por isso a rota de escrita
 * refaz a checagem de papel por conta própria.
 *
 * Sem JS, como as outras: acordeão `<details>` nativo, um `<form method="post">` por questão com
 * [Salvar] e [Apagar], e a ação sai do `name`/`value` do botão. O único cliente é o diálogo de
 * apagar.
 */

type Questao = {
  id: string;
  module_id: string;
  enunciado: string;
  alternativas: string[];
  correta: number;
  ativo: boolean;
  created_at: string;
};

const MENSAGENS: Record<string, string> = {
  nova: "Questão adicionada.",
  salva: "Questão salva.",
  apagada: "Questão apagada.",
};

const CAMPO =
  "w-full rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-gold focus:outline-none";
const ROTULO = "mb-1 block text-[11px] font-semibold tracking-[0.08em] text-pedra uppercase";
const BOTAO_PRIMARIO =
  "rounded-md bg-verde px-4 py-2 text-[12px] font-semibold text-offwhite hover:bg-verde-2";
const BOTAO_SECUNDARIO =
  "rounded-md border border-areia px-3 py-1.5 text-[12px] text-grafite hover:border-pedra";

/** Os quatro campos de alternativa com o rádio da correta. Serve o formulário de edição e o de
 *  questão nova, que só diferem nos valores iniciais. */
function Alternativas({
  chave,
  valores,
  correta,
}: {
  chave: string;
  valores?: string[];
  correta?: number;
}) {
  return (
    <fieldset className="mb-3">
      <legend className={ROTULO}>Alternativas, e qual delas é a correta</legend>
      <div className="flex flex-col gap-2">
        {LETRAS.map((letra, i) => (
          <div key={letra} className="flex items-center gap-2">
            {/* O rádio fica ANTES do texto e no mesmo rótulo: marcar a correta é a decisão mais
                fácil de errar nesta tela, e a mais caro de descobrir depois (aparece na nota de
                alguém). */}
            <label
              className="flex w-[74px] shrink-0 items-center gap-1.5 text-[12px] text-grafite"
              htmlFor={`c-${chave}-${i}`}
            >
              <input
                type="radio"
                id={`c-${chave}-${i}`}
                name="correta"
                value={i}
                defaultChecked={correta === i}
                required
                className="accent-verde"
              />
              {letra}
              <span className="text-[10px] text-pedra">certa</span>
            </label>
            <input
              name={`alt${i}`}
              defaultValue={valores?.[i] ?? ""}
              placeholder={`alternativa ${letra}`}
              aria-label={`Alternativa ${letra}`}
              className={CAMPO}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export default async function Questoes({
  searchParams,
}: {
  searchParams: Promise<{ abrir?: string; ok?: string; erro?: string }>;
}) {
  const { abrir, ok, erro } = await searchParams;

  const db = createAdminClient();
  const [{ data: mods }, { data: qs }] = await Promise.all([
    db.from("modules").select("id,ord,titulo").in("ord", ORDS_AVALIADOS).order("ord"),
    db
      .from("questions")
      .select("id,module_id,enunciado,alternativas,correta,ativo,created_at")
      .order("created_at"),
  ]);

  const modulos = (mods ?? []) as { id: string; ord: number; titulo: string }[];
  const questoes = (qs ?? []) as Questao[];

  const totalAtivas = questoes.filter((q) => q.ativo).length;
  const metaTotal = META_POR_MODULO * ORDS_AVALIADOS.length;
  const aviso = erro
    ? { tom: "erro" as const, texto: erro }
    : ok
      ? { tom: "sucesso" as const, texto: MENSAGENS[ok] ?? "Feito." }
      : undefined;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[26px] text-verde">Questões</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-medio">
          O banco de onde a prova sorteia {TOTAL_QUESTOES} questões, {POR_MODULO} de cada módulo. O
          gabarito só existe aqui: o aluno nunca lê esta tabela, e a prova dele guarda uma cópia das
          questões de quando respondeu.
        </p>
        <p className="mt-2 text-[12px] text-pedra">
          {totalAtivas} de {metaTotal} questões ativas na meta ({META_POR_MODULO} por módulo).
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

      {modulos.length === 0 ? (
        <Vazio>Nenhum módulo de I a IV no banco. Rode o seed neste ambiente.</Vazio>
      ) : (
        <div className="flex flex-col gap-3">
          {modulos.map((mod) => {
            const doModulo = questoes.filter((q) => q.module_id === mod.id);
            const ativas = doModulo.filter((q) => q.ativo).length;
            const abaixoDoPiso = ativas < POR_MODULO;

            return (
              <details
                key={mod.id}
                open={abrir === String(mod.ord)}
                className="rounded-lg border border-areia bg-white"
              >
                <summary className="cursor-pointer px-5 py-4 text-[14px] text-verde">
                  <span className="font-semibold">{rotuloModulo(mod.ord)}</span>{" "}
                  <span className="text-grafite">{mod.titulo}</span>
                  <span className="ml-2">
                    {abaixoDoPiso ? (
                      <Selo tom="ruim">
                        {ativas} de {POR_MODULO} mínimas
                      </Selo>
                    ) : ativas < META_POR_MODULO ? (
                      <Selo tom="atencao">
                        {ativas} ativas, faltam {META_POR_MODULO - ativas}
                      </Selo>
                    ) : (
                      <Selo tom="ok">{ativas} ativas</Selo>
                    )}
                  </span>
                  {doModulo.length > ativas && (
                    <span className="ml-2 text-[12px] text-pedra">
                      {doModulo.length - ativas} desativada
                      {doModulo.length - ativas > 1 ? "s" : ""}
                    </span>
                  )}
                </summary>

                <div className="border-t border-bege px-5 py-5">
                  {abaixoDoPiso && (
                    <p className="mb-4 rounded-md border border-falha/30 bg-falha/8 px-4 py-3 text-[13px] text-falha">
                      Com menos de {POR_MODULO} questões ativas neste módulo, o sorteio não completa a
                      prova e ela <strong>para de abrir para todos os alunos</strong>. Ative ou
                      escreva mais {POR_MODULO - ativas}.
                    </p>
                  )}

                  {doModulo.length === 0 ? (
                    <Vazio>Nenhuma questão neste módulo ainda.</Vazio>
                  ) : (
                    <ol className="flex flex-col gap-4">
                      {doModulo.map((q, i) => (
                        <li key={q.id} className="rounded-md border border-bege bg-offwhite p-4">
                          <form method="post" action="/admin/api/questoes">
                            <input type="hidden" name="acao" value="salvar" />
                            <input type="hidden" name="id" value={q.id} />
                            <input type="hidden" name="m" value={mod.ord} />

                            <div className="mb-3">
                              <label className={ROTULO} htmlFor={`e-${q.id}`}>
                                Questão {i + 1}
                                {!q.ativo && (
                                  <span className="ml-2 normal-case">
                                    <Selo tom="neutro">fora do sorteio</Selo>
                                  </span>
                                )}
                              </label>
                              <textarea
                                id={`e-${q.id}`}
                                name="enunciado"
                                rows={2}
                                defaultValue={q.enunciado}
                                className={CAMPO}
                              />
                            </div>

                            <Alternativas
                              chave={q.id}
                              valores={q.alternativas}
                              correta={q.correta}
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <label className="flex items-center gap-2 text-[12px] text-grafite">
                                <input
                                  type="checkbox"
                                  name="ativo"
                                  defaultChecked={q.ativo}
                                  className="accent-verde"
                                />
                                Ativa (entra no sorteio)
                              </label>
                              <button type="submit" className={BOTAO_PRIMARIO}>
                                Salvar questão
                              </button>
                            </div>
                          </form>

                          <div className="mt-3 flex items-center justify-end border-t border-bege pt-3">
                            <ApagarQuestao
                              id={q.id}
                              enunciado={q.enunciado}
                              m={mod.ord}
                              ativasDepois={q.ativo ? ativas - 1 : ativas}
                            />
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}

                  {/* --- questão nova --- */}
                  <form
                    method="post"
                    action="/admin/api/questoes"
                    className="mt-6 rounded-md border border-dashed border-areia p-4"
                  >
                    <input type="hidden" name="acao" value="nova" />
                    <input type="hidden" name="id" value={mod.id} />
                    <input type="hidden" name="m" value={mod.ord} />

                    <div className="mb-3">
                      <label className={ROTULO} htmlFor={`nova-${mod.id}`}>
                        Nova questão em {rotuloModulo(mod.ord)}
                      </label>
                      <textarea
                        id={`nova-${mod.id}`}
                        name="enunciado"
                        rows={2}
                        placeholder="enunciado"
                        className={CAMPO}
                      />
                    </div>

                    <Alternativas chave={`nova-${mod.id}`} />

                    <button type="submit" className={BOTAO_SECUNDARIO}>
                      Adicionar questão
                    </button>
                  </form>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </>
  );
}

import type { Metadata } from "next";

import ApagarAula from "./ApagarAula";
import { Cabecalho, Linha, Quadro, Selo } from "@/app/admin/_ui/tabela";
import { rotuloModulo } from "@/lib/curso";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Conteúdo" };

/**
 * Aulas e materiais (PLANO-ADMIN §4.6). A única tela do painel que muda o que o aluno vê **sem
 * deploy**: o currículo saiu do código para `modules`/`lessons` em 29/jul justamente para isto.
 *
 * TRÊS DECISÕES DO PEDRO, em 31/jul/2026, que definiram o tamanho desta tela:
 *
 * 1. **URL colada, não upload.** `materials.arquivo` guarda o endereço e o template da aula o joga
 *    direto no `href` do link. Zero bucket, zero policy de Storage, zero tela de upload. A
 *    validação do endereço mora na rota, que é onde o dado entra.
 * 2. **Reordenar aulas, sim.** Com a consequência aceita: o `ord` define o `n` da aula, que é o
 *    número na URL, então reordenar reescreve o destino de links já compartilhados. O progresso
 *    não se perde, porque é gravado por `lesson_id`. O aviso está na tela, junto das setas.
 * 3. **Criar e apagar aula, com confirmação forte.** A confirmação diz quantos alunos perdem
 *    progresso, contado aqui e passado ao diálogo.
 *
 * Fora do corte, e não por esquecimento: `lessons.duracao` e `modules.arte` **não têm leitor
 * nenhum** no app hoje (o `getCurriculo` nem seleciona as colunas). Campo de formulário que grava
 * dado que nenhuma tela mostra é pior que campo ausente — quem preenche fica esperando o efeito.
 * Entram quando a tela do aluno passar a exibi-los.
 *
 * SEM JS, por escolha: acordeão é `<details>` nativo, cada bloco é um `<form method="post">`, e a
 * ação vem no `name`/`value` do botão de submit — é isso que deixa [Salvar] [↑] [↓] num
 * formulário só. O único componente de cliente é o diálogo de apagar aula.
 */

type Aula = {
  id: string;
  module_id: string;
  ord: number;
  titulo: string;
  descricao: string | null;
  panda_video_id: string | null;
  conta_no_gate: boolean;
};

type MaterialLinha = {
  id: string;
  lesson_id: string | null;
  module_id: string | null;
  titulo: string;
  arquivo: string;
};

const MENSAGENS: Record<string, string> = {
  modulo: "Módulo salvo.",
  aula: "Aula salva.",
  movida: "Ordem das aulas trocada.",
  "aula-nova": "Aula criada. Preencha a descrição e o vídeo.",
  "aula-apagada": "Aula apagada.",
  material: "Material salvo.",
  "material-novo": "Material adicionado.",
  "material-apagado": "Material removido.",
};

/* Uma classe só para os campos, porque são dezenas na tela e a diferença entre eles é o rótulo. */
const CAMPO =
  "w-full rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-gold focus:outline-none";
const ROTULO = "mb-1 block text-[11px] font-semibold tracking-[0.08em] text-pedra uppercase";
const BOTAO_PRIMARIO =
  "rounded-md bg-verde px-4 py-2 text-[12px] font-semibold text-offwhite hover:bg-verde-2";
const BOTAO_SECUNDARIO =
  "rounded-md border border-areia px-3 py-1.5 text-[12px] text-grafite hover:border-pedra disabled:opacity-40";

export default async function Conteudo({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; ok?: string; erro?: string }>;
}) {
  const { m, ok, erro } = await searchParams;
  const abrir = m ?? "";

  const db = createAdminClient();
  const [{ data: mods }, { data: aulas }, { data: materiais }, { data: progresso }] =
    await Promise.all([
      db.from("modules").select("id,ord,titulo,docente").order("ord"),
      db
        .from("lessons")
        .select("id,module_id,ord,titulo,descricao,panda_video_id,conta_no_gate")
        .order("ord"),
      db.from("materials").select("id,lesson_id,module_id,titulo,arquivo").order("titulo"),
      // Uma linha por aluno e por aula (a tabela tem `unique (user_id, lesson_id)`), então contar
      // linhas por aula é contar alunos. São dezenas de linhas hoje e a alternativa seria uma
      // função nova no banco só para o diálogo de confirmação saber um número.
      db.from("progress").select("lesson_id"),
    ]);

  const modulos = (mods ?? []) as { id: string; ord: number; titulo: string; docente: string | null }[];
  const todasAulas = (aulas ?? []) as Aula[];
  const todosMateriais = (materiais ?? []) as MaterialLinha[];

  const alunosPorAula = new Map<string, number>();
  for (const p of progresso ?? []) {
    const k = p.lesson_id as string;
    alunosPorAula.set(k, (alunosPorAula.get(k) ?? 0) + 1);
  }

  const noGate = todasAulas.filter((a) => a.conta_no_gate).length;
  const aviso = erro ? { tom: "erro" as const, texto: erro } : ok ? { tom: "sucesso" as const, texto: MENSAGENS[ok] ?? "Salvo." } : undefined;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[26px] text-verde">Conteúdo</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-medio">
          Módulos, aulas e materiais do curso. O que é salvo aqui aparece na área do aluno na
          próxima visita, sem deploy.
        </p>
        <p className="mt-2 text-[12px] text-pedra">
          {todasAulas.length} aulas, {noGate} contam para o gate de conclusão que libera a prova.
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

      <div className="flex flex-col gap-3">
        {modulos.map((mod) => {
          const doModulo = todasAulas
            .filter((a) => a.module_id === mod.id)
            .sort((x, y) => x.ord - y.ord);
          const idsDoModulo = new Set(doModulo.map((a) => a.id));
          const materiaisDoModulo = todosMateriais.filter(
            (mt) => mt.module_id === mod.id || (mt.lesson_id && idsDoModulo.has(mt.lesson_id)),
          );

          return (
            <details
              key={mod.id}
              id={`m${mod.ord}`}
              open={abrir === String(mod.ord)}
              className="rounded-lg border border-areia bg-white"
            >
              <summary className="cursor-pointer px-5 py-4 text-[14px] text-verde">
                <span className="font-semibold">{rotuloModulo(mod.ord)}</span>{" "}
                <span className="text-grafite">{mod.titulo}</span>
                <span className="ml-2 text-[12px] text-pedra">
                  {doModulo.length === 1 ? "1 aula" : `${doModulo.length} aulas`}
                  {materiaisDoModulo.length > 0 && ` · ${materiaisDoModulo.length} materiais`}
                </span>
              </summary>

              <div className="border-t border-bege px-5 py-5">
                {/* --- o módulo em si --- */}
                <form method="post" action="/admin/api/conteudo" className="mb-7">
                  <input type="hidden" name="acao" value="modulo" />
                  <input type="hidden" name="id" value={mod.id} />
                  <input type="hidden" name="m" value={mod.ord} />
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-[260px] flex-1">
                      <label className={ROTULO} htmlFor={`t-${mod.id}`}>
                        Título do módulo
                      </label>
                      <input
                        id={`t-${mod.id}`}
                        name="titulo"
                        defaultValue={mod.titulo}
                        className={CAMPO}
                      />
                    </div>
                    <div className="min-w-[200px] flex-1">
                      <label className={ROTULO} htmlFor={`d-${mod.id}`}>
                        Docente
                      </label>
                      <input
                        id={`d-${mod.id}`}
                        name="docente"
                        defaultValue={mod.docente ?? ""}
                        placeholder="sem docente"
                        className={CAMPO}
                      />
                    </div>
                    <button type="submit" className={BOTAO_PRIMARIO}>
                      Salvar módulo
                    </button>
                  </div>
                </form>

                {/* --- aulas --- */}
                <h3 className="mb-1 text-[13px] font-semibold tracking-[0.08em] text-pedra uppercase">
                  Aulas
                </h3>
                <p className="mb-4 text-[12px] text-medio">
                  As setas trocam a aula de lugar dentro do módulo. A ordem define o número da aula
                  na URL, então um link já compartilhado passa a abrir a aula que ficou naquela
                  posição. O progresso do aluno acompanha a aula, não a posição.
                </p>

                <div className="flex flex-col gap-4">
                  {doModulo.map((a, i) => (
                    <div key={a.id} className="rounded-md border border-bege bg-offwhite p-4">
                      <form method="post" action="/admin/api/conteudo">
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="m" value={mod.ord} />

                        <div className="mb-3 flex flex-wrap items-end gap-3">
                          <div className="min-w-[280px] flex-1">
                            <label className={ROTULO} htmlFor={`at-${a.id}`}>
                              Título da aula
                            </label>
                            <input
                              id={`at-${a.id}`}
                              name="titulo"
                              defaultValue={a.titulo}
                              className={CAMPO}
                            />
                          </div>
                          <div className="min-w-[200px] flex-1">
                            <label className={ROTULO} htmlFor={`av-${a.id}`}>
                              Vídeo (Panda)
                            </label>
                            <input
                              id={`av-${a.id}`}
                              name="video"
                              defaultValue={a.panda_video_id ?? ""}
                              placeholder="id do vídeo, vazio = player de exemplo"
                              className={CAMPO}
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className={ROTULO} htmlFor={`ad-${a.id}`}>
                            Descrição
                          </label>
                          <textarea
                            id={`ad-${a.id}`}
                            name="descricao"
                            rows={2}
                            defaultValue={a.descricao ?? ""}
                            className={CAMPO}
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <label className="flex items-center gap-2 text-[12px] text-grafite">
                            <input
                              type="checkbox"
                              name="gate"
                              defaultChecked={a.conta_no_gate}
                              className="accent-verde"
                            />
                            Conta para o gate de conclusão
                          </label>

                          <div className="flex items-center gap-2">
                            {/* Botão de submit com `name`/`value` próprio: o formulário é um só e a
                                ação sai de quem foi clicado. */}
                            <button
                              type="submit"
                              name="acao"
                              value="subir"
                              disabled={i === 0}
                              title="Mover para cima"
                              aria-label={`Mover "${a.titulo}" para cima`}
                              className={BOTAO_SECUNDARIO}
                            >
                              ↑
                            </button>
                            <button
                              type="submit"
                              name="acao"
                              value="descer"
                              disabled={i === doModulo.length - 1}
                              title="Mover para baixo"
                              aria-label={`Mover "${a.titulo}" para baixo`}
                              className={BOTAO_SECUNDARIO}
                            >
                              ↓
                            </button>
                            <button type="submit" name="acao" value="aula" className={BOTAO_PRIMARIO}>
                              Salvar aula
                            </button>
                          </div>
                        </div>
                      </form>

                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-bege pt-3">
                        <span className="text-[11px] text-pedra">
                          {alunosPorAula.get(a.id)
                            ? `${alunosPorAula.get(a.id)} com progresso nesta aula`
                            : "nenhum progresso gravado"}
                        </span>
                        <ApagarAula
                          id={a.id}
                          titulo={a.titulo}
                          m={mod.ord}
                          alunos={alunosPorAula.get(a.id) ?? 0}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* --- aula nova --- */}
                <form
                  method="post"
                  action="/admin/api/conteudo"
                  className="mt-4 flex flex-wrap items-end gap-3"
                >
                  <input type="hidden" name="acao" value="nova-aula" />
                  <input type="hidden" name="id" value={mod.id} />
                  <input type="hidden" name="m" value={mod.ord} />
                  <div className="min-w-[280px] flex-1">
                    <label className={ROTULO} htmlFor={`na-${mod.id}`}>
                      Nova aula neste módulo
                    </label>
                    <input
                      id={`na-${mod.id}`}
                      name="titulo"
                      placeholder="título da aula"
                      className={CAMPO}
                    />
                  </div>
                  <button type="submit" className={BOTAO_SECUNDARIO}>
                    Criar aula
                  </button>
                </form>

                {/* --- materiais --- */}
                <h3 className="mt-8 mb-1 text-[13px] font-semibold tracking-[0.08em] text-pedra uppercase">
                  Materiais
                </h3>
                <p className="mb-4 text-[12px] text-medio">
                  O aluno vê, em cada aula, o material dela e o do módulo numa lista só. O endereço
                  é um link já hospedado, começando com https:// ou com / para arquivo do próprio
                  site.
                </p>

                {materiaisDoModulo.length > 0 && (
                  <Quadro>
                    {/* 900px e não 640: o título da aula no selo come a primeira coluna, e com menos
                        que isso o campo do endereço fica com uns 180px, curto para editar URL. O
                        `overflow-x` do `Quadro` cobre a tela estreita. */}
                    <table className="w-full min-w-[900px] border-collapse text-left">
                      <Cabecalho colunas={["Onde aparece", "Título e endereço do arquivo"]} />
                      <tbody>
                        {materiaisDoModulo.map((mt) => {
                          const aula = mt.lesson_id
                            ? doModulo.find((a) => a.id === mt.lesson_id)
                            : undefined;
                          return (
                            <Linha key={mt.id}>
                              <td className="px-4 py-3">
                                {aula ? (
                                  <Selo>{aula.titulo}</Selo>
                                ) : (
                                  <Selo tom="destaque">módulo inteiro</Selo>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <form
                                  method="post"
                                  action="/admin/api/conteudo"
                                  className="flex flex-wrap items-center gap-2"
                                >
                                  <input type="hidden" name="id" value={mt.id} />
                                  <input type="hidden" name="m" value={mod.ord} />
                                  <input
                                    name="titulo"
                                    defaultValue={mt.titulo}
                                    aria-label="Título do material"
                                    className={`${CAMPO} min-w-[160px] flex-1`}
                                  />
                                  <input
                                    name="arquivo"
                                    defaultValue={mt.arquivo}
                                    aria-label="Endereço do arquivo"
                                    className={`${CAMPO} min-w-[220px] flex-[2]`}
                                  />
                                  <button
                                    type="submit"
                                    name="acao"
                                    value="material"
                                    className={BOTAO_SECUNDARIO}
                                  >
                                    Salvar
                                  </button>
                                  <button
                                    type="submit"
                                    name="acao"
                                    value="apagar-material"
                                    className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-falha hover:border-falha"
                                  >
                                    Remover
                                  </button>
                                </form>
                              </td>
                            </Linha>
                          );
                        })}
                      </tbody>
                    </table>
                  </Quadro>
                )}

                <form
                  method="post"
                  action="/admin/api/conteudo"
                  className="mt-4 flex flex-wrap items-end gap-3"
                >
                  <input type="hidden" name="acao" value="novo-material" />
                  <input type="hidden" name="m" value={mod.ord} />
                  <div className="min-w-[200px]">
                    <label className={ROTULO} htmlFor={`mv-${mod.id}`}>
                      Onde aparece
                    </label>
                    <select id={`mv-${mod.id}`} name="vinculo" className={CAMPO}>
                      <option value={`m:${mod.id}`}>Módulo inteiro (apostila)</option>
                      {doModulo.map((a) => (
                        <option key={a.id} value={`l:${a.id}`}>
                          {a.titulo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-[160px] flex-1">
                    <label className={ROTULO} htmlFor={`mt-${mod.id}`}>
                      Título
                    </label>
                    <input
                      id={`mt-${mod.id}`}
                      name="titulo"
                      placeholder="Apostila do Módulo II"
                      className={CAMPO}
                    />
                  </div>
                  <div className="min-w-[220px] flex-[2]">
                    <label className={ROTULO} htmlFor={`ma-${mod.id}`}>
                      Endereço
                    </label>
                    <input
                      id={`ma-${mod.id}`}
                      name="arquivo"
                      placeholder="https://..."
                      className={CAMPO}
                    />
                  </div>
                  <button type="submit" className={BOTAO_SECUNDARIO}>
                    Adicionar
                  </button>
                </form>
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
}

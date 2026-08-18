import type { Metadata } from "next";

import BotaoConfirmar from "./BotaoConfirmar";
import { Selo } from "@/app/admin/_ui/tabela";
import { rotuloModulo } from "@/lib/curso";
import {
  DIAS_GARANTIA,
  REGRA_PADRAO,
  regraEsteira,
  violaGarantia,
  type Regra,
} from "@/lib/liberacao";
import { paraRegra } from "@/lib/politicas";
import { ORDS_AVALIADOS } from "@/lib/questoes";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Liberação" };

/**
 * Políticas de liberação de conteúdo (pedido do Pedro em 17/ago/2026, migration 0016).
 *
 * UMA política ativa vale para o curso inteiro e para todos os alunos; a exceção individual
 * continua sendo a liberação total, no detalhe do aluno. Cada política é uma regra por módulo,
 * de quatro tipos: livre, em breve, dias após a compra e data programada.
 *
 * A tela AVISA e não trava (decisão de 17/ago), em dois casos:
 * - política que deixa o curso concluível dentro da janela de arrependimento de
 *   {DIAS_GARANTIA} dias (o risco: certificado emitido e reembolso pedido em seguida);
 * - módulo avaliado (I a IV) em breve: a prova sorteia questões dele, e o gate de 16/16 aulas
 *   fica inalcançável enquanto ele não abrir.
 *
 * Sem JS, como as outras telas: um `<form method="post">` por política, ação no `name`/`value`
 * do botão. Os únicos clientes são os diálogos de confirmação de ativar e apagar.
 */

type Politica = { id: string; nome: string; ativa: boolean; created_at: string };
type LinhaRegra = { policy_id: string; module_id: string; tipo: string; dias: number | null; abre_em: string | null };
type Mod = { id: string; ord: number; titulo: string };

const MENSAGENS: Record<string, string> = {
  criada: "Política criada. Ela nasce como rascunho: ative quando quiser que valha.",
  salva: "Política salva.",
  ativada: "Política ativada. Vale agora para todos os alunos.",
  apagada: "Política apagada.",
};

const CAMPO =
  "w-full rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-gold focus:outline-none";
const ROTULO = "mb-1 block text-[11px] font-semibold tracking-[0.08em] text-pedra uppercase";
const BOTAO_PRIMARIO =
  "rounded-md bg-verde px-4 py-2 text-[12px] font-semibold text-offwhite hover:bg-verde-2";

const TIPOS = [
  { valor: "livre", rotulo: "Acesso livre" },
  { valor: "em_breve", rotulo: "Em breve (indisponível)" },
  { valor: "dias", rotulo: "Dias após a compra" },
  { valor: "data", rotulo: "Data programada" },
];

/** As regras de uma política na ordem dos módulos, com buraco caindo no padrão (em breve). */
function regrasDaPolitica(politicaId: string, linhas: LinhaRegra[], mods: Mod[]): Regra[] {
  const porModulo = new Map(
    linhas.filter((l) => l.policy_id === politicaId).map((l) => [l.module_id, paraRegra(l)]),
  );
  return mods.map((m) => porModulo.get(m.id) ?? REGRA_PADRAO);
}

/** Os avisos que a política merece. Avisar, não travar: decisão de 17/ago. */
function avisosDaPolitica(regras: Regra[], mods: Mod[]): string[] {
  const avisos: string[] = [];
  if (violaGarantia(regras))
    avisos.push(
      `Com esta política o curso fica concluível dentro da garantia de ${DIAS_GARANTIA} dias: ` +
        "um aluno pode terminar, emitir o certificado e pedir reembolso no prazo de arrependimento.",
    );
  const avaliadosEmBreve = mods
    .filter((m, i) => ORDS_AVALIADOS.includes(m.ord) && regras[i].tipo === "em_breve")
    .map((m) => rotuloModulo(m.ord));
  if (avaliadosEmBreve.length)
    avisos.push(
      `${avaliadosEmBreve.join(", ")} em breve: a prova sorteia questões desse conteúdo, e o ` +
        "gate de 16 aulas fica inalcançável enquanto ele não abrir.",
    );
  return avisos;
}

/** O formulário de uma política: nome + uma linha por módulo. Serve editar e criar. */
function Formulario({
  mods,
  politica,
  regras,
  preset,
}: {
  mods: Mod[];
  politica?: Politica;
  regras?: LinhaRegra[];
  preset?: boolean;
}) {
  const linhaDoModulo = (id: string) => regras?.find((r) => r.module_id === id);
  return (
    <form method="post" action="/admin/api/liberacao" className="flex flex-col gap-4 px-5 pb-5">
      <input type="hidden" name="acao" value={politica ? "salvar" : "criar"} />
      {politica && <input type="hidden" name="id" value={politica.id} />}

      <div>
        <label className={ROTULO}>Nome da política</label>
        <input
          name="nome"
          defaultValue={politica?.nome ?? ""}
          placeholder="Turma de setembro, por exemplo"
          maxLength={80}
          required
          className={CAMPO}
        />
      </div>

      <div className="flex flex-col gap-2">
        {mods.map((m, i) => {
          // Módulo sem linha mostra a regra EFETIVA (em breve, a REGRA_PADRAO): até 18/ago o
          // buraco vinha preenchido com o preset da esteira, e salvar gravava o preset — a
          // política mudava de comportamento só de passar pelo formulário. O preset agora é
          // ação explícita (`?preset=esteira`), só na criação.
          const linha = linhaDoModulo(m.id);
          const padrao = preset ? regraEsteira(i) : REGRA_PADRAO;
          const tipo = linha?.tipo ?? padrao.tipo;
          const dias = linha?.dias ?? (padrao.tipo === "dias" ? padrao.dias : 0);
          const data = linha?.abre_em ? linha.abre_em.slice(0, 10) : "";
          return (
            <div key={m.id} className="grid grid-cols-[1fr_180px_110px_150px] items-center gap-3">
              <span className="text-[13px] text-grafite">
                <b className="font-semibold">{rotuloModulo(m.ord)}</b> · {m.titulo}
              </span>
              <select name={`tipo_${m.id}`} defaultValue={tipo} className={CAMPO} aria-label={`Tipo de liberação do módulo ${m.ord}`}>
                {TIPOS.map((t) => (
                  <option key={t.valor} value={t.valor}>
                    {t.rotulo}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name={`dias_${m.id}`}
                defaultValue={dias}
                min={0}
                max={3650}
                className={CAMPO}
                aria-label={`Dias após a compra do módulo ${m.ord}`}
              />
              <input
                type="date"
                name={`data_${m.id}`}
                defaultValue={data}
                className={CAMPO}
                aria-label={`Data programada do módulo ${m.ord}`}
              />
            </div>
          );
        })}
        <p className="text-[11px] text-pedra">
          O campo que vale acompanha o tipo: “dias após a compra” lê a coluna de dias, “data
          programada” lê a de data, e os outros dois ignoram as duas.
        </p>
      </div>

      <div>
        <button type="submit" className={BOTAO_PRIMARIO}>
          {politica ? "Salvar política" : "Criar política"}
        </button>
      </div>
    </form>
  );
}

export default async function Liberacao({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string; preset?: string }>;
}) {
  const { ok, erro, preset } = await searchParams;
  const comEsteira = preset === "esteira";
  const db = createAdminClient();
  const [{ data: pols }, { data: linhas }, { data: mods }] = await Promise.all([
    db.from("release_policies").select("id,nome,ativa,created_at").order("created_at"),
    db.from("release_rules").select("policy_id,module_id,tipo,dias,abre_em"),
    db.from("modules").select("id,ord,titulo").order("ord"),
  ]);
  const politicas = (pols ?? []) as Politica[];
  const regras = (linhas ?? []) as LinhaRegra[];
  const modulos = (mods ?? []) as Mod[];

  const aviso = erro
    ? { tom: "erro" as const, texto: erro }
    : ok
      ? { tom: "sucesso" as const, texto: MENSAGENS[ok] ?? "Feito." }
      : undefined;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[26px] text-verde">Liberação</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-medio">
          Como o conteúdo abre para o aluno. Uma política fica ativa por vez e é o padrão de
          todos; as outras servem de rascunho ou de exceção. No detalhe do aluno dá para
          apontar qualquer uma delas só para ele, além da liberação total de sempre.
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
        {politicas.map((p) => {
          const regrasDela = regrasDaPolitica(p.id, regras, modulos);
          const avisos = avisosDaPolitica(regrasDela, modulos);
          return (
            <details key={p.id} open={p.ativa} className="rounded-lg border border-areia bg-white">
              <summary className="cursor-pointer px-5 py-4 text-[14px] text-verde">
                <span className="font-semibold">{p.nome}</span>
                <span className="ml-2">
                  {p.ativa ? <Selo tom="ok">ativa</Selo> : <Selo tom="neutro">rascunho</Selo>}
                </span>
                {avisos.length > 0 && (
                  <span className="ml-2">
                    <Selo tom="atencao">{avisos.length === 1 ? "1 aviso" : `${avisos.length} avisos`}</Selo>
                  </span>
                )}
              </summary>

              {avisos.map((a) => (
                <p
                  key={a}
                  className="mx-5 mb-3 rounded-md border border-gold/40 bg-gold-soft/60 px-4 py-3 text-[12.5px] text-gold-dark"
                >
                  {a}
                </p>
              ))}

              <Formulario mods={modulos} politica={p} regras={regras.filter((r) => r.policy_id === p.id)} />

              {!p.ativa && (
                <div className="flex items-center gap-3 border-t border-areia px-5 py-4">
                  <BotaoConfirmar
                    acao="ativar"
                    id={p.id}
                    rotulo="Ativar esta política"
                    rotuloTrabalhando="Ativando..."
                    titulo={`Ativar “${p.nome}”?`}
                    corpo={
                      "Ela passa a valer AGORA para todos os alunos, no lugar da política ativa de hoje. " +
                      "Módulo que fechar some da esteira do aluno na mesma hora; o progresso de ninguém é apagado." +
                      (avisos.length ? ` Atenção: ${avisos.join(" ")}` : "")
                    }
                    confirmarRotulo="Ativar para todos"
                  />
                  <BotaoConfirmar
                    acao="apagar"
                    id={p.id}
                    rotulo="Apagar"
                    rotuloTrabalhando="Apagando..."
                    titulo={`Apagar “${p.nome}”?`}
                    corpo="Aluno que aponte para ela volta ao padrão (a política ativa); fora isso, só o rascunho some."
                    confirmarRotulo="Apagar política"
                    perigo
                  />
                </div>
              )}
            </details>
          );
        })}

        <details open={comEsteira} className="rounded-lg border border-dashed border-areia bg-white">
          <summary className="cursor-pointer px-5 py-4 text-[14px] font-semibold text-verde">
            Nova política
          </summary>
          {!comEsteira && (
            <p className="mx-5 mb-3 text-[12px] text-pedra">
              Ela nasce com tudo em breve, o padrão fechado.{" "}
              <a href="?preset=esteira" className="font-semibold text-gold-dark hover:text-verde">
                Preencher com a esteira clássica
              </a>{" "}
              (Módulo I no ato, um por semana dali em diante).
            </p>
          )}
          <Formulario mods={modulos} preset={comEsteira} />
        </details>
      </div>
    </>
  );
}

import type { Metadata } from "next";

import { Cabecalho, Linha, Quadro, Selo, Vazio, dataHora } from "@/app/admin/_ui/tabela";
import { BANNER, DESCRICOES, GATILHOS, ROTULOS, VARIAVEIS, type Template } from "@/lib/email-render";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "E-mails" };

/**
 * Os e-mails do produto: o texto de cada um e o registro do que saiu (PRD §14, PLANO-ADMIN §4.5).
 *
 * DUAS METADES NA MESMA TELA de propósito. Quem edita um texto de e-mail quer olhar o log logo
 * depois para ver se saiu, e quem investiga o log costuma acabar mexendo no texto. Separar em duas
 * rotas obrigaria a ir e voltar no meio da mesma tarefa.
 *
 * O QUE É EDITÁVEL AQUI: assunto, corpo, rótulo do botão e o banner do topo (arquivo enviado ou
 * endereço colado, mais o texto alternativo). O que **não** é: o layout, a marca e o **destino** do
 * botão. O layout é design system (`lib/email-render.ts`) e o destino vem do gatilho, que é código:
 * deixar a URL do CTA no editor seria a forma mais barata de mandar a turma para o lugar errado.
 *
 * O BANNER PEDE TEXTO ALTERNATIVO, e não é formalidade: cliente de e-mail bloqueia imagem por padrão
 * em boa parte dos casos, e sem o alt o e-mail abre com uma caixa muda no topo. Ele é decoração por
 * cima de um cabeçalho que já é texto, nunca o lugar onde o recado está.
 *
 * Os transacionais de PAGAMENTO não estão aqui, e é intencional: PIX pendente, boleto, cartão
 * recusado e carrinho abandonado saem pelo Guru, que é quem sabe o estado do pagamento. Aqui ficam
 * os do produto.
 *
 * Sem JS: acordeão `<details>` nativo, um `<form method="post">` por template, e a ação vem do
 * `name`/`value` do botão clicado. A pré-visualização é um link para o GET da mesma rota.
 */

type LinhaEmail = {
  id: string;
  email: string | null;
  nome: string | null;
  template: string;
  sent_at: string;
  status: string | null;
};

const LIMITE = 200;

const MENSAGENS: Record<string, string> = {
  salvo: "Template salvo. Use a prévia para conferir como ficou.",
  teste: "Teste enviado para o seu e-mail.",
  acesso: "E-mail de acesso reenviado, com link novo.",
};

const CAMPO =
  "w-full rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-gold focus:outline-none";
const ROTULO = "mb-1 block text-[11px] font-semibold tracking-[0.08em] text-pedra uppercase";

/**
 * O tom do status. **O vocabulário é de quem envia, não desta tela**: hoje o envio grava `enviado`,
 * `falha: <motivo>` e `desligado`, e um provedor novo pode trazer os dele. Por isso o padrão é
 * neutro, e não "falha" — pintar de vermelho o que não se reconhece transforma cada status novo num
 * incidente falso.
 */
function tomStatus(status: string | null): {
  texto: string;
  tom: "ok" | "atencao" | "ruim" | "neutro";
} {
  if (!status) return { texto: "sem status", tom: "neutro" };
  const s = status.toLowerCase();
  if (/(^|_)(sent|delivered|enviado|entregue)/.test(s)) return { texto: status, tom: "ok" };
  if (/(fail|error|erro|falha|bounce|reject)/.test(s)) return { texto: status, tom: "ruim" };
  if (/(queue|pending|pendente|desligado)/.test(s)) return { texto: status, tom: "atencao" };
  return { texto: status, tom: "neutro" };
}

export default async function Emails({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string; erro?: string; abrir?: string }>;
}) {
  const { q = "", ok, erro, abrir } = await searchParams;
  const termo = q.trim();

  const db = createAdminClient();
  const [log, tpl] = await Promise.all([
    db.rpc("listar_emails", { termo, limite: LIMITE }),
    db.from("email_templates").select("chave,assunto,corpo,cta,ativo,banner,banner_alt"),
  ]);

  const linhas = (log.data ?? []) as LinhaEmail[];
  const porChave = new Map(((tpl.data ?? []) as Template[]).map((t) => [t.chave, t]));
  // A ordem é a dos rótulos, e não a do banco: a jornada do aluno começa nas boas-vindas.
  const templates = Object.keys(ROTULOS)
    .map((chave) => porChave.get(chave))
    .filter((t): t is Template => Boolean(t));

  const aviso = erro
    ? { tom: "erro" as const, texto: erro }
    : ok
      ? { tom: "sucesso" as const, texto: MENSAGENS[ok] ?? "Feito." }
      : undefined;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[26px] text-verde">E-mails</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-medio">
          O texto dos e-mails do produto e o registro do que o sistema enviou. Os de pagamento
          (PIX, boleto, cartão recusado, carrinho) saem pelo Guru e não aparecem aqui.
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

      <section className="mb-10">
        <h2 className="mb-1 text-[15px] text-verde">Templates</h2>
        <p className="mb-4 max-w-2xl text-[12px] text-medio">
          Cada linha do corpo vira um parágrafo. A moldura, a marca e o endereço do botão ficam no
          código, então aqui você mexe no texto e no banner. Salve antes de abrir a prévia.
        </p>

        {templates.length === 0 ? (
          <Vazio>
            Nenhum template no banco. A migration <code>0009</code> traz os três iniciais.
          </Vazio>
        ) : (
          <div className="flex flex-col gap-3">
            {templates.map((t) => (
              <details
                key={t.chave}
                open={abrir === t.chave}
                className="rounded-lg border border-areia bg-white"
              >
                <summary className="cursor-pointer px-5 py-4 text-[14px] text-verde">
                  <span className="font-semibold">{ROTULOS[t.chave]}</span>
                  {t.ativo === false && (
                    <span className="ml-2">
                      <Selo tom="atencao">desligado</Selo>
                    </span>
                  )}
                  <span className="mt-1 block text-[12px] text-pedra">{GATILHOS[t.chave]}</span>
                </summary>

                <form
                  method="post"
                  action="/admin/api/emails"
                  // Sem `multipart`, o navegador manda só o NOME do arquivo e o upload chega vazio,
                  // sem erro nenhum. Vale para todos os campos deste formulário, e o `formData()`
                  // do route handler lê os dois formatos igual.
                  encType="multipart/form-data"
                  className="border-t border-bege px-5 py-5"
                >
                  <input type="hidden" name="chave" value={t.chave} />

                  <div className="mb-3">
                    <label className={ROTULO} htmlFor={`a-${t.chave}`}>
                      Assunto
                    </label>
                    <input
                      id={`a-${t.chave}`}
                      name="assunto"
                      defaultValue={t.assunto}
                      className={CAMPO}
                    />
                  </div>

                  <div className="mb-2">
                    <label className={ROTULO} htmlFor={`c-${t.chave}`}>
                      Corpo
                    </label>
                    <textarea
                      id={`c-${t.chave}`}
                      name="corpo"
                      rows={6}
                      defaultValue={t.corpo}
                      className={`${CAMPO} font-mono text-[12px] leading-relaxed`}
                    />
                  </div>

                  {/* A LEGENDA, e não uma lista de nomes. Listar `{{nota}}` sem dizer o que ele é
                      obriga quem escreve a adivinhar se vem "82", "82%" ou "oitenta e dois", e a
                      única forma de descobrir era mandar um teste para si mesmo. O exemplo mostrado
                      é o MESMO que a prévia usa. */}
                  <div className="mb-4 rounded-md border border-bege bg-offwhite px-4 py-3">
                    <p className={ROTULO}>Variáveis que este e-mail aceita</p>
                    <dl className="mt-1 flex flex-col gap-1.5">
                      {VARIAVEIS[t.chave].map((v) => (
                        <div key={v} className="flex flex-wrap items-baseline gap-x-2 text-[12px]">
                          <dt>
                            <code className="text-[11px] text-gold-dark">{`{{${v}}}`}</code>
                          </dt>
                          <dd className="text-medio">
                            {DESCRICOES[v]?.texto}{" "}
                            <span className="text-pedra">
                              Na prévia: <strong className="font-normal">{DESCRICOES[v]?.exemplo}</strong>
                            </span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-2 text-[12px] text-pedra">
                      Escreva o nome entre chaves duplas, exatamente como está acima. Qualquer outra
                      variável é recusada ao salvar, porque ninguém a preencheria no envio e ela sairia
                      como um branco no meio da frase.{" "}
                      {/* O endereço do botão é a pergunta que todo redator faz e não encontra. Dizer
                          onde ele está evita a busca inútil. */}
                      O <strong>endereço do botão</strong> não é variável: ele vem do gatilho, e aqui
                      você muda só o rótulo dele.
                    </p>
                  </div>

                  <div className="mb-4 max-w-sm">
                    <label className={ROTULO} htmlFor={`b-${t.chave}`}>
                      Rótulo do botão
                    </label>
                    <input
                      id={`b-${t.chave}`}
                      name="cta"
                      defaultValue={t.cta ?? ""}
                      placeholder="vazio = e-mail sem botão"
                      className={CAMPO}
                    />
                  </div>

                  <div className="mb-4 rounded-md border border-bege bg-offwhite p-4">
                    <p className={ROTULO}>Banner do topo (opcional)</p>

                    {t.banner && (
                      // A arte atual aparece na própria tela: sem isto, "tem banner" é só uma
                      // string de URL, e ninguém confere arte lendo endereço.
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t.banner}
                          alt={t.banner_alt ?? ""}
                          className="h-16 w-auto max-w-[240px] rounded border border-areia bg-white object-contain"
                        />
                        <a
                          href={t.banner}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[12px] text-gold-dark underline decoration-areia underline-offset-2 hover:decoration-gold"
                        >
                          abrir em tamanho real
                        </a>
                      </div>
                    )}

                    <div className="flex flex-wrap items-end gap-3">
                      <div className="min-w-[240px] flex-[2]">
                        <label
                          className="mb-1 block text-[11px] text-pedra"
                          htmlFor={`bf-${t.chave}`}
                        >
                          Enviar arquivo
                        </label>
                        <input
                          id={`bf-${t.chave}`}
                          type="file"
                          name="banner_arquivo"
                          accept="image/png,image/jpeg"
                          className="w-full rounded-md border border-areia bg-white px-3 py-2 text-[12px] text-grafite file:mr-3 file:rounded file:border-0 file:bg-verde file:px-3 file:py-1.5 file:text-[12px] file:font-semibold file:text-offwhite"
                        />
                      </div>
                      <div className="min-w-[200px] flex-1">
                        <label className="mb-1 block text-[11px] text-pedra" htmlFor={`ba-${t.chave}`}>
                          Texto alternativo
                        </label>
                        <input
                          id={`ba-${t.chave}`}
                          name="banner_alt"
                          defaultValue={t.banner_alt ?? ""}
                          placeholder="o que a imagem diz"
                          className={CAMPO}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="mb-1 block text-[11px] text-pedra" htmlFor={`bn-${t.chave}`}>
                        Endereço (preenchido pelo envio; apague para tirar o banner)
                      </label>
                      <input
                        id={`bn-${t.chave}`}
                        name="banner"
                        defaultValue={t.banner ?? ""}
                        placeholder="https://... de uma arte já hospedada"
                        className={`${CAMPO} font-mono text-[11px]`}
                      />
                    </div>

                    <p className="mt-3 text-[12px] text-medio">
                      Arte em <strong>{BANNER.larguraArquivo}</strong> ×{" "}
                      <strong>{BANNER.alturaArquivo}</strong> px, que é o dobro da medida de
                      exibição ({BANNER.larguraExibida} px de largura) para não sair borrada em tela
                      retina. Altura livre: a imagem escala pela largura.{" "}
                      <strong>PNG ou JPG</strong>, de preferência abaixo de {BANNER.pesoIdealKb} KB
                      e no máximo {BANNER.pesoMaximoKb} KB (WebP não abre no Outlook).
                    </p>
                    <p className="mt-1 text-[12px] text-pedra">
                      O texto alternativo é obrigatório quando há banner: é o que aparece nos
                      clientes que bloqueiam imagem, e é boa parte deles. Enviar um arquivo novo
                      substitui o anterior e apaga o antigo.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-[12px] text-grafite">
                      <input
                        type="checkbox"
                        name="ativo"
                        defaultChecked={t.ativo !== false}
                        className="accent-verde"
                      />
                      Ativo (desligado registra no log e não envia)
                    </label>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/admin/api/emails?chave=${t.chave}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-grafite hover:border-pedra"
                      >
                        Ver prévia
                      </a>
                      <button
                        type="submit"
                        name="acao"
                        value="teste"
                        className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-grafite hover:border-pedra"
                      >
                        Enviar teste para mim
                      </button>
                      <button
                        type="submit"
                        name="acao"
                        value="salvar"
                        className="rounded-md bg-verde px-4 py-2 text-[12px] font-semibold text-offwhite hover:bg-verde-2"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </form>
              </details>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-1 text-[15px] text-verde">Log de envios</h2>
        <p className="mb-4 max-w-2xl text-[12px] text-medio">
          Toda tentativa entra aqui, inclusive as que falharam e os testes. Somente leitura.
        </p>

        <form method="get" className="mb-5 flex max-w-xl gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="e-mail do aluno ou nome do template"
            aria-label="Buscar por e-mail ou template"
            className="min-w-0 flex-1 rounded-md border border-areia bg-white px-3 py-2 text-[13px] text-grafite placeholder:text-pedra focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-verde px-4 py-2 text-[13px] font-semibold text-offwhite hover:bg-verde-2"
          >
            Buscar
          </button>
        </form>

        {log.error ? (
          // Falha de leitura não pode virar "nenhum e-mail enviado": num log, dizer que não há
          // registro quando a consulta é que falhou esconde exatamente o que se veio ver.
          <p
            className="rounded-md border border-falha/30 bg-falha/8 px-4 py-3 text-[13px] text-falha"
            role="status"
          >
            Não deu para ler o log de e-mails. Tente recarregar.
          </p>
        ) : linhas.length === 0 ? (
          <Vazio>
            {termo ? (
              <>
                Nenhum envio com <strong>{termo}</strong> no e-mail ou no template.
              </>
            ) : (
              <>
                Nenhum envio registrado ainda. Use o teste de um template acima para ver a primeira
                linha aparecer aqui.
              </>
            )}
          </Vazio>
        ) : (
          <>
            <p className="mb-2 text-[12px] text-pedra">
              {linhas.length === 1 ? "1 envio" : `${linhas.length} envios`}
              {linhas.length === LIMITE && `, mostrando os ${LIMITE} mais recentes`}
            </p>
            <Quadro>
              <table className="w-full min-w-[680px] border-collapse text-left">
                <Cabecalho colunas={["Quando", "Aluno", "Template", "Status"]} />
                <tbody>
                  {linhas.map((l) => {
                    const st = tomStatus(l.status);
                    return (
                      <Linha key={l.id}>
                        <td className="px-4 py-3 text-[12px] whitespace-nowrap text-medio">
                          {dataHora(l.sent_at)}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-grafite">
                          {/* Sem e-mail é conta apagada, não erro: o `user_id` do log é
                              `on delete set null`, e o registro do envio sobrevive à conta. */}
                          {l.email ?? <span className="text-pedra">conta removida</span>}
                          {l.nome && <span className="ml-2 text-[12px] text-pedra">{l.nome}</span>}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-medio">{l.template}</td>
                        <td className="px-4 py-3">
                          <Selo tom={st.tom}>{st.texto}</Selo>
                        </td>
                      </Linha>
                    );
                  })}
                </tbody>
              </table>
            </Quadro>
          </>
        )}
      </section>
    </>
  );
}

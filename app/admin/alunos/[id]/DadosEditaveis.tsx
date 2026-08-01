"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { validarDados, type DadosAluno } from "@/lib/aluno-dados";

/**
 * Edição no lugar do nome, e-mail e telefone do aluno, com salvamento automático.
 *
 * Substituiu em 31/jul/2026 o `<details>` com botão "Salvar dados", que o Pedro achou travado: era
 * um formulário à parte repetindo três campos que a tela já mostrava logo acima.
 *
 * **Salva ao SAIR do campo (ou no Enter), e não enquanto se digita.** Debounce por tecla parece mais
 * moderno e é pior aqui: o e-mail é o login, e gravar "pedro@gmai" a caminho de "pedro@gmail.com"
 * troca o acesso do aluno por um endereço que não existe. Sair do campo é uma intenção; a pausa
 * entre duas teclas não é.
 *
 * **Escape desfaz o campo** e devolve o valor que estava lá. Sem ele, edição no lugar vira armadilha:
 * quem clica por engano no nome e digita uma letra não tem como voltar atrás sem saber o original.
 *
 * A validação é a MESMA `validarDados` da rota, importada daqui porque é pura e client-safe. Rodar
 * antes no navegador evita ida ao servidor para dizer o que já se sabe, e a rota revalida porque
 * POST não vem só desta tela.
 */

type Campo = "nome" | "email" | "telefone";

export default function DadosEditaveis({
  userId,
  inicial,
  /** Selos, "Reenviar acesso" e mensagens das outras ações: ficam no servidor e passam por aqui. */
  acoes,
  /** Os outros campos do quadro de cadastro, que são só leitura. */
  leitura,
}: {
  userId: string;
  inicial: DadosAluno;
  acoes: ReactNode;
  leitura: [string, string][];
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [valores, setValores] = useState(inicial);
  const [estado, setEstado] = useState<"parado" | "salvando" | "salvo" | "email">("parado");
  const [erro, setErro] = useState("");
  // O que está gravado no servidor. É contra isto que decido se há o que salvar, e é para onde o
  // Escape volta. Estado e não `useRef`: o `react-hooks/refs` recusa ler `.current` de dentro de um
  // manipulador montado durante a renderização, e aqui não há ganho nenhum em ser ref.
  const [gravado, setGravado] = useState(inicial);

  const salvar = async (proximos: DadosAluno) => {
    const v = validarDados(proximos);
    if (!v.ok) {
      setErro(v.motivo);
      return;
    }
    // Nada mudou: não vai ao servidor nem pisca "salvo". Sair de um campo sem tocar nele é o que
    // mais acontece quando o admin abre a edição só para conferir.
    const igual = (["nome", "email", "telefone"] as const).every(
      (c) => v.dados[c] === gravado[c],
    );
    if (igual) {
      setErro("");
      return;
    }

    setErro("");
    setEstado("salvando");
    try {
      const r = await fetch("/admin/api/aluno", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, ...v.dados }),
      });
      const dados = (await r.json()) as { ok: boolean; motivo?: string; trocouEmail?: boolean };
      if (!dados.ok) {
        setEstado("parado");
        setErro(dados.motivo ?? "Não deu para salvar.");
        return;
      }
      setGravado(v.dados);
      // O valor normalizado volta para a tela: quem digitou "  Ana  Paula " vê "Ana Paula", que é o
      // que ficou gravado. Sem isto o campo mostraria uma coisa e o banco teria outra.
      setValores(v.dados);
      setEstado(dados.trocouEmail ? "email" : "salvo");
      // Atualiza o resto da página, que é servidor: o `verify_certificate` e a lista de Alunos leem
      // o mesmo nome, e a tela não pode ficar contando duas histórias.
      router.refresh();
    } catch {
      setEstado("parado");
      setErro("Falhou a conexão. O que você digitou continua aqui.");
    }
  };

  const props = (campo: Campo) => ({
    value: valores[campo],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValores((v) => ({ ...v, [campo]: e.target.value }));
      // O "salvo" do campo anterior some assim que a digitação recomeça, senão ele fica pendurado
      // na tela dizendo que está tudo gravado enquanto há texto novo não gravado.
      if (estado !== "salvando") setEstado("parado");
    },
    onBlur: () => void salvar(valores),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.currentTarget.blur();
      }
      if (e.key === "Escape") {
        setValores((v) => ({ ...v, [campo]: gravado[campo] }));
        setErro("");
        // `preventDefault` para o Escape não fechar o diálogo de confirmação que porventura
        // estiver aberto por trás.
        e.preventDefault();
      }
    },
    // ┌─ PREENCHIMENTO AUTOMÁTICO DESLIGADO, E ISSO NÃO É ZELO ────────────────────────────────┐
    // │ Salvar ao sair do campo grava o que ESTIVER no campo, tenha sido um humano a escrever   │
    // │ ou não. Em 31/jul/2026, com esta tela aberta em modo de edição, o nome de um aluno      │
    // │ mudou de "João Testinho" para "João Testinhos" sem ninguém digitar: o campo tinha       │
    // │ `autoFocus`, o vizinho é `type="email"`, e nada dizia ao navegador para ficar de fora.  │
    // │ Quem descobriu foi a tela de Auditoria, no mesmo dia em que ela nasceu.                 │
    // │                                                                                         │
    // │ Os dois `data-*` são os opt-out do 1Password e do LastPass. O caso ruim aqui não é o    │
    // │ navegador repetir um nome: é um gerenciador de senhas despejar o e-mail DO ADMIN no     │
    // │ campo de e-mail de um aluno, que com salvamento automático troca o login dele.          │
    // └─────────────────────────────────────────────────────────────────────────────────────────┘
    autoComplete: "off",
    "data-1p-ignore": true,
    "data-lpignore": "true",
    className:
      "w-full rounded-md border border-gold-soft bg-white px-2 py-1 outline-none focus:border-gold",
  });

  return (
    <>
      <header className="mb-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {editando ? (
              <input
                {...props("nome")}
                aria-label="Nome do aluno"
                maxLength={120}
                autoFocus
                className={`${props("nome").className} font-serif text-[26px] text-verde`}
              />
            ) : (
              <h1 className="text-[26px] text-verde">
                {valores.nome || <span className="text-pedra">Conta sem nome</span>}
              </h1>
            )}

            {editando ? (
              <div className="mt-2">
                <input
                  {...props("email")}
                  aria-label="E-mail do aluno"
                  type="email"
                  className={`${props("email").className} text-[13px] text-grafite`}
                />
                <p className="mt-1 text-[11px] text-pedra">
                  O e-mail é o login. Ao sair do campo, a troca vale na hora: o aluno passa a entrar
                  por ele e os e-mails do curso vão para lá.
                </p>
              </div>
            ) : (
              <p className="mt-1 text-[13px] text-medio">{valores.email}</p>
            )}
          </div>

          {/* O botão fica no ALTO e à direita, fora da coluna que vira campo: em edição no lugar, o
              controle não pode se mexer quando o texto ao lado troca de altura. */}
          <button
            type="button"
            onClick={() => {
              setEditando((e) => !e);
              setErro("");
              setEstado("parado");
            }}
            className="rounded-md border border-areia px-3 py-1.5 text-[12px] text-gold-dark hover:border-gold"
          >
            {editando ? "Pronto" : "Editar"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">{acoes}</div>

        {(erro || estado !== "parado") && (
          <p
            role="status"
            className={`mt-3 text-[12px] ${erro ? "text-falha" : "text-sucesso"}`}
          >
            {erro ||
              (estado === "salvando"
                ? "Salvando..."
                : estado === "email"
                  ? "Salvo. O aluno passa a entrar com o e-mail novo."
                  : "Salvo.")}
          </p>
        )}
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-[15px] text-verde">Cadastro e acesso</h2>
        <div className="overflow-x-auto rounded-lg border border-areia bg-white">
          <dl className="grid gap-x-8 gap-y-3 px-5 py-4 text-[13px] sm:grid-cols-2">
            <div>
              <dt className="text-[11px] tracking-[0.1em] text-pedra uppercase">Telefone</dt>
              <dd className="mt-0.5 text-grafite">
                {editando ? (
                  <input
                    {...props("telefone")}
                    aria-label="Telefone do aluno"
                    maxLength={40}
                    placeholder="opcional"
                    className={`${props("telefone").className} text-[13px]`}
                  />
                ) : (
                  valores.telefone || "—"
                )}
              </dd>
            </div>
            {leitura.map(([rotulo, valor]) => (
              <div key={rotulo}>
                <dt className="text-[11px] tracking-[0.1em] text-pedra uppercase">{rotulo}</dt>
                <dd className="mt-0.5 text-grafite">{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}

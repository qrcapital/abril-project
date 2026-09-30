"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { criarConta } from "./actions";
import { validarSenha } from "@/lib/senha";
import { emTrabalho, ligarExigencias, pintarCaixa } from "@/app/app/_ui/feedback";

import contato from "@/lib/contato.json";

const WHATSAPP = contato.whatsapp;

// Em homolog não há webhook do Guru para trazer o nome do comprador, então o
// primeiro acesso pede o "Nome completo" (para o certificado). Em produção o nome
// vem do Guru e o campo não aparece.
const PEDIR_NOME = process.env.NEXT_PUBLIC_APP_ENV !== "production";

/**
 * Login / primeiro acesso com Supabase Auth (email + senha).
 * - modo "primeiro": signUp (cria a conta e a senha); em homolog simula a compra.
 * - modo "login": signInWithPassword.
 * Em sucesso → /app, ou /admin se a conta for admin (a sessão é lida pela guarda no proxy).
 * Erros mostrados inline.
 */
export default function LoginClient({
  html,
  mode,
  aviso,
}: {
  html: string;
  mode: "login" | "primeiro";
  aviso?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const supabase = createClient();
    const ac = new AbortController();
    const opts = { signal: ac.signal };

    const inputs = [...root.querySelectorAll<HTMLInputElement>("input")];
    inputs.forEach((i) => (i.value = "")); // limpa os valores de exemplo do design
    const emailInput = inputs.find((i) => i.type === "email");
    const camposSenha = inputs.filter((i) => i.type === "password");
    const passwords = () => camposSenha.map((i) => i.value);
    const btn = root.querySelector<HTMLButtonElement>("button");

    // No 1º acesso o aluno ESCOLHE a senha, então a regra aparece antes de ele tentar, em vez
    // de ser descoberta por rejeição. No login normal não entra: ali ele só digita a senha que
    // já tem. Era uma frase estática (`REGRA_SENHA`) e virou o indicador que marca conforme a
    // pessoa digita, o padrão 4 do DESIGN.md §3. Vai depois do PRIMEIRO campo, que é onde a
    // senha é escolhida, e não depois do "repita".
    if (mode === "primeiro" && camposSenha.length > 0) {
      camposSenha[0].after(ligarExigencias(camposSenha[0], "claro"));
    }

    // Campo "Nome completo" no 1º acesso (só homolog): clona o par label+input do
    // e-mail para herdar o estilo do design e o insere antes dele.
    let nomeInput: HTMLInputElement | null = null;
    if (mode === "primeiro" && PEDIR_NOME && emailInput) {
      const emailLabel = emailInput.previousElementSibling;
      if (emailLabel?.tagName === "LABEL") {
        const nomeLabel = emailLabel.cloneNode(true) as HTMLElement;
        nomeLabel.textContent = "Nome completo";
        nomeInput = emailInput.cloneNode(true) as HTMLInputElement;
        nomeInput.type = "text";
        nomeInput.value = "";
        nomeInput.setAttribute("autocomplete", "name");
        // A casca nova dá `id` e `name` aos campos. Sem trocar os dois, o clone nascia com
        // `id="email"` repetido, e o `for` do rótulo apontava para o e-mail em vez do nome.
        nomeInput.id = "nome";
        nomeInput.name = "nome";
        nomeInput.placeholder = "Como no certificado";
        nomeLabel.setAttribute("for", "nome");
        emailLabel.before(nomeLabel, nomeInput);
      }
    }

    // Caixa de mensagem, inserida antes do botão. A tela é HTML portado e não tem slot, então
    // o elemento é criado aqui; a pintura sai do padrão único da área (`_ui/feedback.tsx`).
    // Uma caixa só para aviso e erro de propósito: o erro do envio deve SUBSTITUIR o aviso de
    // sessão expirada, que já não é mais a informação relevante.
    let caixa: HTMLDivElement | null = null;
    const mostrar = (tipo: "erro" | "aviso", msg: string | null) => {
      if (!caixa) {
        caixa = document.createElement("div");
        btn?.parentElement?.insertBefore(caixa, btn);
      }
      // "claro" desde 29/set/2026: a coluna do formulário passou do verde escuro para o creme.
      pintarCaixa(caixa, tipo, msg, "claro");
    };
    const showError = (msg: string) => mostrar("erro", msg);
    const clearError = () => caixa && (caixa.hidden = true);

    // Por que o aluno caiu aqui sem pedir (sessão expirada). Sem isto era redirect mudo: ele
    // estava na aula 7 e voltava para um "Bem-vindo de volta" sem entender o motivo.
    if (aviso) mostrar("aviso", aviso);

    const submit = async () => {
      clearError();
      const email = (emailInput?.value || "").trim();
      const [p1, p2] = passwords();
      if (!email) return showError("Informe o e-mail.");
      if (!p1) return showError("Informe a senha.");

      const restaurar = emTrabalho(btn, mode === "primeiro" ? "Criando conta..." : "Entrando...");
      try {
        if (mode === "primeiro") {
          const nome = (nomeInput?.value || "").trim();
          if (nomeInput && !nome) return showError("Informe o nome completo.");
          const problema = validarSenha(p1);
          if (problema) return showError(problema);
          if (p1 !== p2) return showError("As senhas não conferem.");
          // cria a conta no servidor (já confirmada) e loga
          const res = await criarConta(email, p1, nome);
          if (res.error) return showError(res.error);
          const { error } = await supabase.auth.signInWithPassword({ email, password: p1 });
          if (error) return showError("Conta criada, mas falhou ao entrar. Tente o login.");
          router.push("/app");
          router.refresh();
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password: p1 });
          if (error) return showError("E-mail ou senha incorretos.");
          // Porta única para as duas áreas (decisão do Pedro, 30/jul/2026): quem entra aqui
          // pode ser aluno ou admin, e o DESTINO decide pelo papel. Uma tela própria em
          // /admin/login dobraria a superfície de autenticação e pediria o próprio fluxo de
          // recuperação de senha.
          //
          // Custa uma ida ao banco a mais, só no login e só neste caminho: no "primeiro
          // acesso" a conta acaba de nascer e nunca é admin, então lá não se pergunta. Se a
          // chamada falhar, cai em /app, que é o destino de todo mundo menos de um punhado
          // de pessoas.
          const { data: admin } = await supabase.rpc("is_admin");
          router.push(admin === true ? "/admin" : "/app");
          router.refresh();
        }
      } finally {
        restaurar();
      }
    };

    btn?.addEventListener("click", submit, opts);
    [nomeInput, ...inputs].filter((i): i is HTMLInputElement => !!i).forEach((i) =>
      i.addEventListener(
        "keydown",
        (e) => {
          if ((e as KeyboardEvent).key === "Enter") {
            e.preventDefault();
            submit();
          }
        },
        opts
      )
    );

    // links
    root.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
      const t = a.textContent || "";
      if (/WhatsApp/i.test(t)) {
        a.href = WHATSAPP;
        a.target = "_blank";
        a.rel = "noopener";
      } else if (/Esqueci minha senha/i.test(t)) {
        a.href = "/app/recuperar-senha";
        a.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            router.push("/app/recuperar-senha");
          },
          opts
        );
      }
    });

    return () => ac.abort();
  }, [mode, router, aviso]);

  return (
    <>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      {/* A barra "Teste (homolog)" que ficava fixa no pé desta tela saiu em 30/set/2026, a
          pedido do Marcelo: a tela é a do domínio público. As variantes continuam acessíveis
          por URL (`?s=erro`, `?s=pendente`, `?s=primeiro`) para quem precisar conferir. */}
    </>
  );
}

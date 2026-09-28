"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { definirSenha } from "./actions";
import { validarSenha } from "@/lib/senha";
import { emTrabalho, ligarExigencias, pintarCaixa } from "@/app/app/_ui/feedback";

/**
 * Formulário da senha nova. A conferência de "as duas iguais" é local, porque é erro de
 * digitação e não precisa de ida ao servidor; o tamanho mínimo é conferido nos dois lados,
 * já que validação de cliente não é garantia de nada.
 *
 * Deu certo, vai direto para `/app`: o aluno acabou de provar posse do e-mail, então exigir
 * login em seguida seria atrito sem ganho.
 *
 * `exigeAceite` diz se a tela veio com a caixa dos documentos (migration `0023`). A conferência
 * aqui é só para a mensagem aparecer sem ida ao servidor; quem de fato recusa é a action, que
 * pergunta ao banco. Ver o comentário em `actions.ts`.
 */
export default function RedefinirClient({
  html,
  exigeAceite = false,
}: {
  html: string;
  exigeAceite?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);

  // A caixa vive DENTRO da coluna do formulário (o slot que o senha-template emite), e não
  // como irmã do HTML injetado, senão cai no fim da página.
  useEffect(() => {
    pintarCaixa(ref.current?.querySelector<HTMLElement>("[data-feedback]"), "erro", erro);
  }, [erro]);

  // Indicador de exigências (DESIGN.md §3, padrão 4) logo abaixo do campo da senha nova. Esta
  // é uma das telas que CRIAM senha, então a regra precisa aparecer antes da tentativa.
  useEffect(() => {
    const senha = ref.current?.querySelector<HTMLInputElement>("#senha");
    if (!senha) return;
    const lista = ligarExigencias(senha);
    senha.after(lista);
    return () => lista.remove();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const root = ref.current;
    const btn = root?.querySelector("button") ?? null;
    if (btn?.disabled) return;

    const senha = root?.querySelector<HTMLInputElement>("#senha")?.value ?? "";
    const repetir = root?.querySelector<HTMLInputElement>("#repetir")?.value ?? "";
    const aceite = root?.querySelector<HTMLInputElement>("[data-aceite]")?.checked ?? false;

    const problema = validarSenha(senha);
    if (problema) {
      setErro(problema);
      return;
    }
    if (senha !== repetir) {
      setErro("As duas senhas não são iguais.");
      return;
    }
    // A senha vem antes do aceite na ordem das conferências porque vem antes na ordem da tela:
    // apontar a caixa lá embaixo enquanto o campo de cima está errado manda a pessoa consertar a
    // coisa errada primeiro.
    if (exigeAceite && !aceite) {
      setErro("Para continuar, confirme que leu e aceita os Termos de Uso e a Política de Privacidade.");
      return;
    }

    setErro(null);
    const restaurar = emTrabalho(btn, "Salvando...");
    const r = await definirSenha(senha, aceite);
    if (r.ok) {
      // Sem restaurar: a navegação já vai acontecer, e devolver o botão ao normal antes
      // dela pisca "clique de novo" numa tela que está saindo.
      router.push("/app");
    } else {
      restaurar();
      setErro(r.erro);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
    </form>
  );
}

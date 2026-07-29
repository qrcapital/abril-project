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
 */
export default function RedefinirClient({ html }: { html: string }) {
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

    const problema = validarSenha(senha);
    if (problema) {
      setErro(problema);
      return;
    }
    if (senha !== repetir) {
      setErro("As duas senhas não são iguais.");
      return;
    }

    setErro(null);
    const restaurar = emTrabalho(btn, "Salvando...");
    const r = await definirSenha(senha);
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

"use client";

import { useEffect } from "react";

import contato from "@/lib/contato.json";
import { BOTAO, CORPO, Painel } from "@/app/app/_ui/feedback";

/**
 * Tela de erro da área do aluno. Deixou de ser hipótese em 28/jul: o motor da prova
 * **estoura de propósito** em duas situações (o `exigir` dos templates quando o porte muda
 * o markup, e o `abrirTentativa` com módulo de menos de 5 questões ativas). Falhar alto é a
 * decisão certa nas duas, mas sem esta tela o aluno via o erro cru do Next, fora da marca.
 *
 * Não explica a causa: o que quebrou é problema nosso, e detalhe técnico aqui só assusta.
 * Oferece as duas saídas que resolvem de verdade (tentar de novo, falar com o suporte) e
 * mostra o `digest`, que é o identificador que o Next registra no log do servidor, para o
 * suporte achar o caso exato em vez de pedir "descreva o que aconteceu".
 */
export default function Erro({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[sala] erro de renderização:", error);
  }, [error]);

  return (
    <Painel titulo="Alguma coisa saiu do lugar" role="alert">
      <p style={CORPO}>
        A tela não carregou como devia. Não foi nada que você fez, e seu progresso está
        salvo. Tentar de novo costuma resolver.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button type="button" onClick={reset} style={BOTAO}>
          Tentar de novo
        </button>
        <a
          href={contato.whatsapp}
          target="_blank"
          rel="noopener"
          style={{
            ...BOTAO,
            background: "transparent",
            color: "#0B2D20",
            border: "1.5px solid #0B2D20",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Falar com o suporte
        </a>
      </div>
      {error.digest && (
        <p style={{ ...CORPO, fontSize: "11px", color: "#8F887E", margin: "18px 0 0" }}>
          Se for falar com o suporte, cite este código: {error.digest}
        </p>
      )}
    </Painel>
  );
}

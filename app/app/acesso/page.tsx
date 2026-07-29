import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { tela } from "@/lib/telas";
import { linkSenha, telaSenha } from "@/lib/senha-template";
import { getMatricula, type EstadoAcesso } from "@/lib/matricula";
import AcessoClient from "./AcessoClient";

export const metadata: Metadata = { title: "Seu acesso" };

/**
 * Cada estado tem a sua explicação. O aluno precisa saber **por que** está aqui: "expirou" e
 * "foi encerrado" pedem ações diferentes dele, e um texto genérico faria os dois procurarem a
 * coisa errada no suporte.
 *
 * O progresso não é apagado em nenhum dos casos (`PRD.md` §4), e dizer isso é metade do
 * alívio: sem essa frase, a pessoa acha que perdeu o curso inteiro.
 */
const TEXTOS: Record<Exclude<EstadoAcesso, "ativa">, { titulo: string; lead: string }> = {
  expirada: {
    titulo: "Seu acesso terminou",
    lead: "O prazo de um ano da sua matrícula chegou ao fim. Seu progresso continua guardado, e volta inteiro quando o acesso for renovado. Fale com a gente para renovar.",
  },
  revogada: {
    titulo: "Seu acesso foi encerrado",
    lead: "Esta matrícula não está mais ativa. Se isso não faz sentido para você, fale com a gente e a gente verifica o que aconteceu.",
  },
  ausente: {
    titulo: "Não encontramos sua matrícula",
    lead: "Sua conta existe, mas não há matrícula ligada a ela. Isso costuma ser um problema do nosso lado, não do seu. Fale com a gente com o e-mail da compra em mãos.",
  },
};

/**
 * Tela de bloqueio e renovação. Destino da guarda de acesso do grupo `(sala)`.
 *
 * Fica FORA do `(sala)` de propósito: lá dentro, a guarda a redirecionaria para si mesma em
 * laço. Sem o chrome também é o certo, porque a navegação do chrome leva ao curso, que é
 * justamente o que está bloqueado.
 *
 * Reaproveita a coluna do login pelo `telaSenha`, sem campos: o aluno bloqueado continua
 * dentro da marca, e não numa página órfã.
 */
export default async function AcessoPage() {
  // O estado vem do BANCO, nunca da URL. Um `?estado=` seria escolhido por quem digita o
  // endereço, e a tela passaria a contar a história que o visitante quisesse.
  const { estado } = await getMatricula();
  // Quem tem acesso válido não tem o que fazer aqui.
  if (estado === "ativa") redirect("/app");

  const t = TEXTOS[estado];
  const html = telaSenha(tela("login"), {
    titulo: t.titulo,
    lead: t.lead,
    campos: [],
    botao: "FALAR COM O SUPORTE",
    rodapeHtml: `Entrou com a conta errada? ${linkSenha("/app/login", "Trocar de conta")}`,
  });

  return <AcessoClient html={html} />;
}

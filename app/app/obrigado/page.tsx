import type { Metadata } from "next";

import { botao, casca, esc, eyebrow, lead, link, rodape, titulo } from "@/lib/auth-casca";
import AcessoClient from "../acesso/AcessoClient";

export const metadata: Metadata = { title: "Compra aprovada" };

/**
 * Página de obrigado (08/out/2026): o destino do redirect do checkout do Guru depois do pagamento.
 *
 * Prevista no PRD (§ fluxo de compra) e até aqui inexistente: sem ela, o comprador terminava o
 * pagamento na tela genérica do Guru, sem saber que o acesso chega por e-mail. A conta não existe
 * neste momento (nasce do webhook, segundos depois), então a página não promete login: explica o
 * e-mail, oferece pedir um link novo e o WhatsApp. Reaproveita a casca das telas de acesso, e o
 * botão é o mesmo do acesso bloqueado (abre o suporte), por isso o mesmo cliente.
 *
 * Não lê nada da URL: o Guru pode mandar dados do pedido na query, e uma página de agradecimento
 * que ecoa parâmetro vira vitrine para quem quiser montar um link falso.
 */
const PASSOS = [
  ["1", "Abra o e-mail da compra", "Chega em instantes, com o assunto “Compra confirmada: seu acesso à Estratégia Internacional”, enviado por contato@blocktrends.com.br."],
  ["2", "Crie a sua senha", "O botão do e-mail leva para a tela de primeiro acesso. Lá você cria a senha e entra na plataforma."],
  ["3", "Comece pelo Módulo I", "Ele já está liberado. Os módulos II, III e IV chegam um por semana."],
] as const;

const passos =
  `<ol class="au-passos">` +
  PASSOS.map(
    ([n, t, d]) => `<li><span class="au-passo-n">${n}</span><div><b>${esc(t)}</b><p>${esc(d)}</p></div></li>`,
  ).join("") +
  `</ol>`;

const html = casca(
  eyebrow("Compra aprovada") +
    titulo("Bem-vindo à Estratégia Internacional") +
    lead("Sua compra foi aprovada. O e-mail com o seu acesso chega em instantes no endereço que você usou na compra, e é por ele que você faz o primeiro login.") +
    passos +
    botao("FALAR COM O SUPORTE", "button") +
    rodape(`O e-mail não chegou em alguns minutos? Olhe o spam e a aba Promoções, ou ${link("/app/recuperar-senha", "peça um novo link")}.`),
);

export default function ObrigadoPage() {
  return <AcessoClient html={html} />;
}

// Preenchimento dos dados do aluno no markup portado. Sem IO e sem Next: é função pura de
// string para string, como os outros `*-template.ts`, e por isso o `usuario-check` consegue
// exercitá-la em node puro.

import type { User } from "@supabase/supabase-js";

import { esc } from "./html-slice.ts";

/** Anos de acesso a partir da compra. Espelha o ACCESS_YEARS do webhook do Guru. */
const ANOS_ACESSO = 1;

/**
 * Troca o texto interno dos elementos que carregam um marcador, sem tocar no resto do
 * markup. Marcador ausente nesta tela é normal: cada tela tem o seu subconjunto.
 *
 * Substituição por função, e não por string com `$1`, porque um nome com `$` seria
 * interpretado como referência de grupo.
 */
function trocar(html: string, marcador: string, valor: string): string {
  const re = new RegExp(`(<([a-z]+)[^>]*\\s${marcador}[^>]*>)[^<]*(</\\2>)`, "g");
  return html.replace(re, (_, abre, _tag, fecha) => abre + esc(valor) + fecha);
}

/**
 * Põe o nome, o e-mail e o prazo de acesso do aluno no markup portado, **no servidor**.
 *
 * Antes disto o `AreaChrome` preenchia num efeito de cliente, então o HTML entregue trazia
 * "Pedro" escrito por extenso e todo aluno lia o nome de outra pessoa na primeira pintura.
 * O pior lugar era o certificado, que é a entrega final do curso.
 *
 * Sem nome no cadastro, o marcador fica **vazio**, e não com o texto do design. Nome vazio é
 * um problema de dado visível; nome de outra pessoa é um problema de dado que se disfarça de
 * conteúdo real.
 */
export function preencherUsuario(html: string, user: User | null): string {
  const completo = ((user?.user_metadata?.nome as string | undefined) ?? "").trim();
  const primeiro = completo.split(/\s+/)[0] ?? "";
  const inicial = (primeiro[0] ?? "").toUpperCase();

  let out = html;
  out = trocar(out, 'data-u="full"', completo);
  out = trocar(out, 'data-u="first"', primeiro);
  out = trocar(out, 'data-u="initial"', inicial);
  out = trocar(out, "data-email", user?.email ?? "");
  out = trocar(out, "data-acesso", fimDoAcesso(user?.created_at));
  return out;
}

/**
 * Data de fim do acesso. Em produção a fonte de verdade é `enrollments.expires_at`; enquanto
 * não há matrícula, a criação da conta serve de proxy da data de compra.
 */
function fimDoAcesso(criadoEm?: string): string {
  if (!criadoEm) return "";
  const d = new Date(criadoEm);
  if (isNaN(d.getTime())) return "";
  d.setFullYear(d.getFullYear() + ANOS_ACESSO);
  return d.toLocaleDateString("pt-BR");
}

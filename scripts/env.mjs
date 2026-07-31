// Lê o `.env.local` para os scripts de operação, que rodam em node puro e não têm o loader
// de variáveis do Next.
//
// Este bloco estava copiado em seis scripts (aprovar-conta, progresso-conta,
// matricular-existentes, rls-check, curriculo-check, prova-expiradas). Em vez de fazer a
// sétima cópia, virou função. Os seis anteriores continuam como estão de propósito: mexer
// neles agora seria refatoração não pedida, e o ganho é zero até alguém precisar tocar em
// um deles.

import { readFileSync } from "node:fs";

/**
 * Devolve as variáveis **e as põe em `process.env`**, sem sobrescrever o que já vier do ambiente.
 *
 * A segunda parte foi acrescentada em 31/jul/2026 e conserta um furo silencioso: o script monta o
 * cliente do Supabase com o objeto devolvido, mas o **código de biblioteca** que ele chama lê
 * `process.env` (o `lib/email.ts` lê a `RESEND_API_KEY` de lá). Sem isto, rodar a rotina da prova
 * pela linha de comando fechava a tentativa e o e-mail falhava com "sem RESEND_API_KEY", numa
 * máquina onde a chave estava configurada. Foi exatamente o que aconteceu no primeiro teste.
 */
export function carregarEnv(arquivo = ".env.local") {
  const env = Object.fromEntries(
    readFileSync(arquivo, "utf8")
      .split("\n")
      .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
  );
  // `??=` para o ambiente de verdade ganhar do arquivo: quem exporta a variável na frente do
  // comando está sobrepondo de propósito.
  for (const [chave, valor] of Object.entries(env)) process.env[chave] ??= valor;
  return env;
}

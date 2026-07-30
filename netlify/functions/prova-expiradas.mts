// Rotina agendada: fecha as provas cujo prazo estourou com a aba fechada (PRD §15).
//
// O auto-envio no zero existe, mas é do navegador: um `setInterval` dentro do `useEffect` do
// `QuizClient`, com `clearInterval` no unmount. Aba fechada, o interval morre e nada envia.
//
// Quem REABRE a prova se resolve sozinho, e sem clicar em nada: `page.tsx` manda a tentativa
// em andamento para `questao/1`, a página é servida com `restanteMs = 0`, e o primeiro `tick()`
// dispara o envio automático. Esta rotina é para o aluno que NUNCA VOLTA — a tentativa dele
// fica `in_progress` para sempre, sem resultado registrado e com o certificado barrado pelo
// porteiro de aprovação (que exige `submitted`) mesmo que o respondido tivesse passado.
//
// Por que aqui e não em `pg_cron`, como o PRD §15 descrevia: o `pg_cron` obrigaria a
// habilitar extensões no Supabase e a expor uma rota pública protegida por segredo
// compartilhado, tudo para acabar chamando este mesmo TypeScript. E reimplementar a
// correção em SQL, que seria o único jeito de dispensar o TS, criaria uma segunda verdade
// sobre a nota de corte. A função agendada do Netlify é invocada internamente pela
// plataforma: não há endpoint público, não há segredo novo.
//
// Contexto de deploy: roda no deploy de produção do site, que hoje aponta para a branch
// `homolog` (arranjo interino descrito no HANDOFF §2). Quando `main` virar produção real,
// cada deploy roda a rotina contra o próprio banco, que é o comportamento desejado.

import { createClient } from "@supabase/supabase-js";

import { fecharExpiradas } from "../../lib/prova-expiradas.ts";

const fecharProvasVencidas = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) {
    // Falha alta em vez de silêncio: sem service role a rotina não enxerga nada e passaria
    // meses "rodando bem" sem fechar uma única tentativa.
    console.error("[prova-expiradas] faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY");
    return new Response("configuracao ausente", { status: 500 });
  }

  const db = createClient(url, chave, { auth: { persistSession: false } });
  const fechadas = await fecharExpiradas(db);

  // Log só quando houve trabalho: uma linha a cada 15 minutos dizendo "0" afoga o log e
  // esconde as vezes que importam.
  if (fechadas.length > 0) {
    console.log(
      `[prova-expiradas] ${fechadas.length} fechada(s): ` +
        fechadas.map((f) => `${f.id}=${f.score}`).join(", "),
    );
  }
  return new Response(`${fechadas.length}`, { status: 200 });
};

export default fecharProvasVencidas;

export const config = {
  // "Frequente", na cadência que o PRD §15 pede. Nada depende de minutos: o aluno que volta
  // se resolve pelo botão, então 15 minutos é folga suficiente e custo desprezível.
  schedule: "*/15 * * * *",
};

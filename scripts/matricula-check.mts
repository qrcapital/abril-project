// Self-check do estado de acesso (`lib/matricula.ts`). Roda em node puro, sem rede.
//
//   npm run check:matricula
//
// Existe porque em 30/jul/2026 a derivação do estado ganhou um SEGUNDO leitor: além da guarda do
// aluno (`app/app/(sala)/layout.tsx`), agora o painel do admin mostra o mesmo estado para outra
// pessoa. Divergência entre os dois não aparece em build nem em lint; aparece no suporte, quando
// a tela diz "ativa" para quem o app tranca na porta.

import assert from "node:assert/strict";

// Do módulo PURO, não do `matricula.ts`: aquele importa o cliente Supabase, que puxa
// `next/headers` e estoura com ERR_MODULE_NOT_FOUND fora do Next. Foi o primeiro erro desta leva.
import { estadoDaMatricula } from "../lib/matricula-estado.ts";

const AGORA = new Date("2026-07-30T12:00:00Z");
const FUTURO = "2027-07-30T12:00:00Z";
const PASSADO = "2026-07-29T12:00:00Z";

// Sem linha de matrícula: `ausente` e não `expirada`. A distinção é do PRD §4 e separa "prazo
// acabou" de "provisionamento falhou".
assert.equal(estadoDaMatricula(null, null, AGORA), "ausente");
assert.equal(estadoDaMatricula("active", null, AGORA), "ausente");
assert.equal(estadoDaMatricula(null, FUTURO, AGORA), "ausente");
assert.equal(estadoDaMatricula(undefined, undefined, AGORA), "ausente");

// Revogada ganha de tudo, inclusive de prazo em aberto: revogação é reembolso ou chargeback.
assert.equal(estadoDaMatricula("revoked", FUTURO, AGORA), "revogada");
assert.equal(estadoDaMatricula("revoked", PASSADO, AGORA), "revogada");

assert.equal(estadoDaMatricula("active", FUTURO, AGORA), "ativa");
assert.equal(estadoDaMatricula("expired", FUTURO, AGORA), "expirada");

// O caso que justifica a função existir: a coluna diz `active` e o prazo já passou. Nada reescreve
// `status` na virada, então confiar só na coluna daria acesso a matrícula vencida.
assert.equal(estadoDaMatricula("active", PASSADO, AGORA), "expirada");

// Exatamente no instante do vencimento, expira. O `<=` é a escolha, e o teste a fixa para ninguém
// "consertar" para `<` sem perceber que abre um acesso a mais.
assert.equal(estadoDaMatricula("active", AGORA.toISOString(), AGORA), "expirada");
assert.equal(
  estadoDaMatricula("active", new Date(AGORA.getTime() + 1000).toISOString(), AGORA),
  "ativa",
);

console.log("matricula-check: ok (12 casos)");

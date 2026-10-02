// Self-check da parte pura do aviso de módulo liberado (`lib/avisos-modulo.ts`).
//   npm run check:avisos
//
// O que ele guarda: a régua acompanha o dia da semana da COMPRA de cada aluno, o aviso sai uma
// vez só, dentro da janela, e o Módulo 0 e a liberação total não geram e-mail.

import assert from "node:assert/strict";

import { avisosDevidos, diaEData, fraseDoProximo, JANELA_HORAS } from "../lib/avisos-modulo.ts";
import { calendarioDoAluno, regraEsteira, type Regra } from "../lib/liberacao.ts";

const DIA = 86_400_000;
const HORA = 3_600_000;
const regras: Regra[] = [0, 1, 2, 3, 4].map(regraEsteira);

// Compra numa quarta, 14/out/2026, 15h30 de Brasília.
const compra = new Date("2026-10-14T18:30:00Z");
const cal = (agora: Date, total = false) =>
  calendarioDoAluno({ inicioEm: compra, liberacaoTotal: total, regras, agora });

// 1. No dia da compra nada é avisado: o Módulo 0 abre, mas quem fala dele é o boas-vindas.
assert.deepEqual(avisosDevidos(cal(new Date(compra.getTime() + HORA)), new Set(), new Date(compra.getTime() + HORA)), []);

// 2. Uma hora depois de completar 7 dias, o Módulo I é devido, e cai numa quarta.
{
  const agora = new Date(compra.getTime() + 7 * DIA + HORA);
  const devidos = avisosDevidos(cal(agora), new Set(), agora);
  assert.deepEqual(devidos.map((d) => d.ord), [1]);
  assert.match(diaEData(devidos[0].abreEm!), /^quarta-feira, 21\/10$/);
  // ...e a frase do próximo aponta a quarta seguinte.
  assert.equal(fraseDoProximo(cal(agora), 1), "O Módulo II abre na quarta-feira, 28/10.");
}

// 3. Já avisado não volta.
{
  const agora = new Date(compra.getTime() + 7 * DIA + HORA);
  assert.deepEqual(avisosDevidos(cal(agora), new Set([1]), agora), []);
}

// 4. Fora da janela não avisa (rotina parada há dias não despeja atraso).
{
  const agora = new Date(compra.getTime() + 7 * DIA + (JANELA_HORAS + 1) * HORA);
  assert.deepEqual(avisosDevidos(cal(agora), new Set(), agora), []);
}

// 5. Liberação total do admin não gera avisos.
{
  const agora = new Date(compra.getTime() + 2 * HORA);
  assert.deepEqual(avisosDevidos(cal(agora, true), new Set(), agora), []);
}

// 6. Último módulo fala do certificado.
{
  const agora = new Date(compra.getTime() + 28 * DIA + HORA);
  assert.deepEqual(avisosDevidos(cal(agora), new Set([1, 2, 3]), agora).map((d) => d.ord), [4]);
  assert.match(fraseDoProximo(cal(agora), 4), /último módulo/);
}

// 7. Sem travessão em frase que vai para o aluno (regra da casa).
for (const f of [fraseDoProximo(cal(new Date(compra.getTime() + 8 * DIA)), 1), fraseDoProximo(cal(new Date(compra.getTime() + 29 * DIA)), 4)])
  assert.ok(!f.includes("—"), f);

console.log("check:avisos ok");

// Self-check do papel de observador e do painel de indicadores (migration 0029):
// `npm run check:indicadores`.
//
// Duas metades. A primeira exercita a leitura pura de `lib/indicadores.ts`: o jsonb do banco com
// chave faltando tem de virar zero ou "indisponível", nunca `NaN`. A segunda é a que mais importa:
// desde a 0029 o layout do `/admin` deixa o observador entrar, e a cerca dele passa a ser a guarda
// de CADA página e de CADA rota. Uma página nova sem `exigirAdmin()` não quebra build nem lint; ela
// só abre a lista de alunos para quem é de fora. Este check é quem pega isso.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  completude,
  diaCurto,
  fracao,
  lerIndicadores,
  pct,
  progressoModulo,
  reais,
  ticketMedio,
} from "../lib/indicadores.ts";

// --- 1. leitura do jsonb ---
{
  const i = lerIndicadores({
    gerado_em: "2026-10-06T12:00:00Z",
    vendas: {
      total: 12, estornos: 2, validas: 10, com_valor: 10, com_liquido: 0,
      bruto: 19970, liquido: null, cortesias: 3,
      por_dia: [{ dia: "2026-10-05", n: 4 }, { dia: "2026-10-06", n: 0 }],
    },
    alunos: { matriculados: 15, acesso_ativo: 13, comecaram: 9, ativos_7d: 6, concluintes: 3, certificados: 3 },
    aulas: { total: 16, concluidas: 60 },
    modulos: [{ ord: 0, titulo: "Macro", aulas: 4, concluidas: 30 }],
    guru: { eventos: 20, eventos_7d: 5, processados: 18, erros: 1, pendentes: 0, ultimo: "2026-10-06T11:00:00Z" },
  });
  assert.equal(i.vendas.validas, 10);
  assert.equal(i.vendas.bruto, 19970);
  assert.equal(i.vendas.liquido, null, "sem venda com liquido, o liquido e indisponivel");
  assert.equal(reais(i.vendas.liquido), "indisponível");
  assert.equal(ticketMedio(i), 1997);
  assert.deepEqual(completude(i), { parte: 60, total: 15 * 16 });
  assert.equal(pct(60, 240), "25%");
  assert.deepEqual(progressoModulo(i, i.modulos[0]), { parte: 30, total: 60 });
  assert.equal(i.vendas.porDia.length, 2);
  assert.equal(i.guru.erros, 1);
}

{
  // Função de outra versão, ou resposta vazia: tudo zero, nada de NaN, nada de exceção.
  for (const bruto of [null, undefined, {}, [], "x", { vendas: "x", alunos: [], modulos: {} }]) {
    const i = lerIndicadores(bruto);
    assert.equal(i.vendas.total, 0);
    assert.equal(i.vendas.bruto, null);
    assert.equal(i.alunos.matriculados, 0);
    assert.deepEqual(i.modulos, []);
    assert.equal(pct(i.alunos.concluintes, i.alunos.matriculados), "sem base");
    assert.equal(ticketMedio(i), null);
  }
  // Soma presente sem nenhuma parcela com valor é "não sabemos", não zero reais.
  assert.equal(lerIndicadores({ vendas: { bruto: 0, com_valor: 0 } }).vendas.bruto, null);
  // Estorno nunca passa do total, e texto numérico do Postgres é aceito.
  const e = lerIndicadores({ vendas: { total: "3", estornos: 9 } });
  assert.equal(e.vendas.estornos, 3);
  assert.equal(e.vendas.validas, 0);
}

// --- 2. contas ---
{
  assert.equal(fracao(1, 0), null);
  assert.equal(fracao(5, 4), 1, "nunca passa de 100%");
  assert.equal(pct(1, 30), "3,3%");
  assert.equal(pct(0, 30), "0%");
  assert.equal(diaCurto("2026-10-06"), "06/10");
  assert.match(reais(1997), /^R\$\s?1\.997,00$/);
}

// --- 3. a cerca do observador, arquivo por arquivo ---
const arquivos = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, encoding: "utf8" }).map((f) => join(dir, f));

{
  const paginas = arquivos("app/admin").filter((f) => f.endsWith("page.tsx"));
  assert.ok(paginas.length >= 10, "achou as paginas do admin");
  for (const f of paginas) {
    const src = readFileSync(f, "utf8");
    if (f.includes(join("admin", "indicadores"))) {
      assert.ok(src.includes("await exigirPainel()"), `${f}: indicadores precisa de exigirPainel()`);
      assert.ok(
        !src.includes("@/lib/supabase/admin"),
        `${f}: a tela do observador nao le com a service role; o dado vem de painel_indicadores()`,
      );
      continue;
    }
    assert.ok(
      src.includes("await exigirAdmin()"),
      `${f}: toda pagina do admin chama exigirAdmin(); o layout deixa o observador passar (0029)`,
    );
  }

  const rotas = arquivos("app/admin").filter((f) => f.endsWith("route.ts"));
  for (const f of rotas) {
    const src = readFileSync(f, "utf8");
    const handlers = (src.match(/export async function (GET|POST|PUT|PATCH|DELETE)\b/g) ?? []).length;
    const guardas = (src.match(/autor\.papel !== "admin"\) return/g) ?? []).length;
    assert.ok(handlers > 0, `${f}: rota sem handler?`);
    assert.ok(guardas >= handlers, `${f}: cada handler confere papel !== "admin" antes de tudo`);
  }
}

// --- 4. a migration ---
{
  const sql = readFileSync("supabase/migrations/0029_observador_indicadores.sql", "utf8");
  for (const fn of ["is_observer()", "acesso_painel()", "listar_observadores()", "painel_indicadores()", "guru_numero(jsonb)"]) {
    assert.ok(
      sql.includes(`revoke execute on function ${fn} from public;`),
      `${fn}: o revoke que fecha e o de PUBLIC (AGENTS.md)`,
    );
  }
  assert.ok(sql.includes("if not (is_admin() or is_observer()) then"), "painel_indicadores confere o papel no banco");
  assert.ok(
    !/grant execute on function listar_observadores\(\) to authenticated/.test(sql),
    "listar_observadores le auth.users: so service role",
  );

  // Nenhuma policy de RLS pode conhecer o observador: ele nao ganha leitura de tabela nenhuma.
  for (const f of arquivos("supabase/migrations").filter((x) => x.endsWith(".sql"))) {
    const politicas = readFileSync(f, "utf8").match(/create policy[^;]*;/gi) ?? [];
    for (const p of politicas) {
      assert.ok(!/is_observer/i.test(p), `${f}: policy citando is_observer abre tabela para o observador`);
    }
  }
}

console.log("check:indicadores ok");

# Plano de correções — revisão geral de 17/ago/2026

Origem: revisão completa (LP, área do aluno, admin, banco/RLS e o diff do dia) pedida pelo
Pedro em 17/ago. Foram 28 achados, consolidados aqui em quatro rodadas **por risco e por
dependência**, não por área. Cada item diz o conserto, não só o problema; o detalhe de cada
achado está no histórico da sessão e nos arquivos citados.

Legenda: **[hoje]** entrou nos commits de 17/ago · **[antigo]** pré-existente ·
🔒 depende de insumo/decisão do Pedro.

> **Estado em 18/ago, fim do dia: as 4 rodadas FEITAS.** Rodadas 1+2 em `c757f12`, Rodada 3
> em `5c42324` (migrations 0019/0020 aplicadas pelo Pedro e conferidas com
> `has_table_privilege`/`has_function_privilege`; QA do marcar/desmarcar pós-0019 nos dois
> ramos), Rodada 4 por commitar (migration 0021 aplicada). O que sobrou do plano inteiro:
> **item 23** (🔒 URLs de Termos/LGPD, insumo do Pedro) e o item 8, morto sem mudança por
> decisão dele. O caminho `salvarResposta`/`enviar` da 0020 não foi exercitado ao vivo
> (precisa de prova in_progress); privilégios e build conferidos.

---

## Rodada 1 — Defeitos das features novas (fazer primeiro, tudo código)

O critério desta rodada: consertos pequenos, sem decisão pendente, que fecham o risco do que
acabou de subir para homolog.

1. **[hoje] Formulário de política abre módulo fechado ao salvar.** Módulo sem regra renderiza
   com o preset da esteira; salvar grava o preset. → O default do formulário passa a ser a
   regra EFETIVA (`em_breve` quando não há linha), e o preset da esteira vira ação explícita.
   `app/admin/liberacao/page.tsx`.
2. **[hoje] Campo "dias" vazio vira 0** (`Number("") === 0`). → Recusar string vazia antes de
   converter. `app/admin/api/liberacao/route.ts`.
3. **[hoje] Banco novo nasce com política ativa sem regras** (0016 semeia `from modules`, que
   o seed popula depois). → As regras da esteira entram no `supabase/seed.sql` (idempotente),
   que é quem cria os módulos; a 0016 ganha nota. Ambiente sem seed (produção) cria política
   pela tela, que é o caminho normal.
4. **[hoje+antigo] Gate esvaziável libera a prova de graça.** `[].every()` é true; e
   `iniciarProva` não confere a trava de calendário que a página confere. →
   `provaLiberada` exige `avaliadas.length > 0`; `iniciarProva` passa a conferir
   `liberacao().completo`; a mensagem "16 aulas" vira dinâmica. `lib/curso.ts`,
   `app/app/(sala)/prova/actions.ts`.
5. **[hoje] Trocar política tranca aluno com prova em andamento.** → Tentativa `in_progress`
   passa na frente da trava de calendário: o gate vale para COMEÇAR, não para continuar.
   `app/app/(sala)/prova/page.tsx`.
6. **[hoje] Painel: subcontagem silenciosa no teto de 1000 linhas + card de conclusão
   misturando coortes.** → Helper de paginação (`.range()` em laço) para as leituras cruas, e
   o numerador do card passa a usar a mesma base filtrada por ativos do funil. De carona: o
   card de e-mails para de contar `desligado` como enviado. `app/admin/page.tsx`.
7. **[hoje] CSV: injeção de fórmula, corte em 500 e "estado" mentiroso.** → `escapar` prefixa
   `'` em célula começando com `=`, `+`, `-`, `@`; a coluna estado usa `estadoDaMatricula`
   (expirada sai "expirada", não "active"); o corte real do `listar_alunos` (500) fica dito no
   CSV quando atingido, e o comentário da rota corrige a promessa de 1000.
   `app/admin/api/relatorios/route.ts`.
8. ~~🔒 **[hoje] E-mail de boas-vindas promete "um módulo por semana".**~~ **RESOLVIDO sem
   mudança (decisão do Pedro, 18/ago):** a copy continua verdadeira porque a política padrão
   é a Esteira semanal; quem foge dela é exceção pontual. Só volta à mesa se a política
   padrão de PRODUÇÃO deixar de ser semanal.

## Rodada 2 — Defeitos antigos que o aluno sente hoje

9. **[antigo] Desmarcar aula é no-op** (sem policy de DELETE em `progress`). → Migration
   `0018`: policy de DELETE amarrada ao `auth.uid()`; o delete do client ganha
   `.eq("user_id")` explícito. (Se a rodada 4 mover a escrita para o servidor, a policy cai
   junto; fazer mesmo assim, porque é uma linha e destrava o botão agora.)
10. **[antigo] Tela "Prazo encerrado" inalcançável** (`submitted_at === deadline` nunca casa no
    envio automático). → Critério vira `submitted_at >= deadline`, que pega os dois caminhos.
    `app/app/(sala)/prova/resultado/page.tsx`.
11. **[antigo] Contador "17 de 16" / barra 106%.** Numerador conta toda aula concluída,
    denominador só as avaliadas. → As duas pontas passam a contar só avaliadas.
    `lib/curso.ts`, `lib/aula-template.ts`.
12. **[antigo] XSS armazenado por título/descrição de aula** (sem `esc()`, e replacement com
    `$` vivo). → `esc()` nos dois + replacement por função. `lib/aula-template.ts`,
    `lib/home-template.ts`.
13. **[antigo] "Minha conta" mostra prazo errado** (`created_at + 1 ano` em vez do
    `expires_at` real). → Ler da matrícula, que já está carregada. `lib/usuario-template.ts`.
14. **[antigo] `/verificar` dá 500 com `%` malformado** (decode duplo). → Remover o
    `decodeURIComponent` extra; o param do Next já chega decodificado.
15. **[antigo] Módulo sem aulas quebra o card da home** (NaN% e clique errado). → `pct` com
    guarda de zero e card sem destino quando não há aula. `lib/home-template.ts`,
    `lib/curso.ts`.

## Rodada 3 — Críticos de produção (obrigatórios antes do `main`, inofensivos em homolog)

16. **[antigo] `criarConta` sem guarda de ambiente = curso grátis em produção.** → A action
    recusa quando `NEXT_PUBLIC_APP_ENV === "production"` (a variável já existe por ambiente no
    Netlify); em produção quem matricula é só o webhook do Guru. Teste que prova a recusa.
17. **[antigo] Aluno grava progresso direto pela API** (grant de INSERT/UPDATE + policy que só
    amarra `user_id`): abre a prova sem esteira. → Decisão de desenho, proposta: a escrita de
    progresso sai do cliente da sessão e vai para a service role dentro do server action (que
    já confere a liberação), e o grant de escrita do `authenticated` é revogado. SELECT
    continua como está. Migration + mudança no `marcarAula`.
18. **[antigo] Open redirect no `/auth/confirm`** (`/\evil.com` passa pela guarda). →
    Normalizar `\` → `/` antes do teste. Uma linha, com teste.
19. **[antigo] Gabarito e conteúdo mudam sem rastro.** → `auditar()` nas rotas de Questões
    (criar/salvar/apagar questão) e Conteúdo (as 9 ações), com rótulos novos no
    `auditoria-texto`.
20. **[antigo] Concorrência na prova**: e-mail de resultado duplicado (duas abas no zero) e
    resposta perdida em read-modify-write. → Envio condicionado ao update que casou linha
    (`select` no update); resposta gravada por merge no banco (RPC pequena) em vez de objeto
    inteiro. É o item mais delicado da rodada; testar com o caminho do QA.

## Rodada 4 — Higiene (baratos, sem urgência)

21. **[antigo] Middleware na LP**: excluir `woff2` (e extensões de fonte) do matcher e
    early-return para rota que não é `/app`/`/auth` — corta um `getUser()` por fonte e pela
    própria `/`. `proxy.ts`, `lib/supabase/middleware.ts`.
22. **[antigo] Banco**: índices para `progress.lesson_id`, `email_log.user_id`,
    `admin_audit.autor_id`; CHECK 0–100 em `exams.score`. Migration única.
23. 🔒 **[antigo] Links "Termos de uso" e "Privacidade · LGPD" da LP em `href="#"`.**
    _Insumo: as URLs (ou os documentos) são do Pedro/Abril._
24. **Limpezas**: aviso de garantia calculado num lugar só (painel × tela de Liberação);
    `AGENTS.md` atualizado sobre o check de liberação (não falha mais o build, virou
    detector); ACL residual de `handle_new_user`/`guarda_is_admin` alinhada ao comentário.

---

## Ordem e portes

- **Rodadas 1 e 2** são o próximo trabalho de código, nessa ordem; nada bloqueia nada, dá
  para commitar por rodada. Itens 8 e 23 aguardam o Pedro sem travar o resto.
- **Rodada 3** antes de qualquer conversa de `main`/produção; o item 17 pede meia hora de
  desenho antes do código.
- **Rodada 4** entra onde couber.
- Depois de cada rodada: `npm run lint`, `npm run check`, build, e QA manual do caminho
  tocado. Migrations novas aplicadas no `ei-homolog` via psql (HANDOFF §6).

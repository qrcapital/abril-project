# Plano — Área Administrativa (V2)

> **Escopo V2.** Fica planejado para depois — o foco atual (V1/homolog) é fechar as
> pendências da LP e da área do aluno. Este documento é a planta para quando
> começarmos o admin.

Plano de construção do admin (`/admin/*`) da Estratégia Internacional. Complementa
`ROUTES.md` (rotas) e `PRD.md` (regras). Objetivo: um painel enxuto para a operação
gerenciar alunos, acesso, prova e comunicação — sem tocar no checkout (Guru) nem no
conteúdo do curso pelo aluno.

_Rascunho para aprovação — 2026-07-20._

## 1. Princípios

- **Fora da experiência do aluno.** Navegação, layout e URL próprios (`/admin`), sem
  o chrome da área do aluno.
- **Design próprio no Meridiano/Tailwind.** Não há bundle de design para o admin (só
  LP e Área do Aluno foram entregues como HTML). É onde o Tailwind + tokens do
  Meridiano voltam: UI funcional e sóbria (tabelas, filtros, cards de métrica,
  formulários), sem o peso editorial.
- **Homolog-first.** Cada tela nasce funcional com dados de exemplo/seed; depois
  pluga o Supabase; por fim, as ações que mutam de verdade.
- **Role-based.** Só entra `role = admin`.

## 2. Acesso e segurança

- Guarda em `proxy.ts`: sessão Supabase + checagem de admin antes de servir `/admin/*`.
  Não-admin → redireciona para `/app` (ou 404, a decidir).
- A checagem usa a função **`is_admin()`** já existente no banco (RLS por papel).
- Todas as leituras/escritas do admin passam pelo cliente **service role** apenas em
  rotas de servidor (nunca no browser), respeitando as políticas.
- Ações sensíveis (revogar acesso, reenviar) registram quem fez e quando (auditoria
  simples — coluna/《log》a definir).

## 3. Casca (layout do admin)

- **Sidebar** fixa: Painel · Alunos · Questões · E-mails. Rodapé com "voltar ao site"
  e sair.
- **Header**: título da tela, busca contextual, avatar do admin.
- Estados de tabela: carregando, vazio, erro, paginação. Padrões reutilizáveis.

## 4. Telas

### 4.1 `/admin` — Painel
- **Métricas** (cards): total de alunos (`profiles`/`enrollments`), taxa de conclusão
  (`progress` vs total de aulas), taxa de aprovação (`exams`), NPS médio
  (`certificates`/pesquisa).
- **Atalhos**: últimos e-mails (`email_log`), alunos recentes.
- _Dados_: agregações sobre `enrollments`, `progress`, `exams`, `certificates`.

### 4.2 `/admin/alunos` — Lista + busca
- Tabela: nome, e-mail, status de acesso (ativo/expirado/revogado), progresso (X/16),
  situação da prova. Busca por nome/e-mail; filtro por status.
- _Dados_: `profiles` + `enrollments` (+ resumo de `progress`/`exams`).

### 4.3 `/admin/alunos/[id]` — Detalhe do aluno
- **Dados**: nome, e-mail, `guru_customer_id`, datas de acesso.
- **Progresso**: aulas concluídas por módulo (`progress`).
- **Prova**: tentativas, notas, situação (`exams`).
- **Ações**:
  - Reenviar acesso / e-mail de boas-vindas (→ SES).
  - Trocar e-mail.
  - Liberar 2ª chamada da prova.
  - Revogar ou estender acesso (`enrollments`).
  - _As que dependem de SES/Guru ficam para a Fase 3._

### 4.4 `/admin/questoes` — Banco de questões
- CRUD por módulo: enunciado, 4 alternativas, correta, ativo/inativo.
- Contador por módulo (a prova sorteia 5 por módulo — `sortear_prova`).
- _Dados_: `questions`. **Já dá para usar o seed real** — vira funcional cedo.

### 4.5 `/admin/emails` — Log de e-mails
- Tabela: aluno, template, data de envio, status (enviado/falha).
- _Dados_: `email_log` (somente leitura).

### 4.6 `/admin/conteudo` — Aulas e materiais

> **Escopo NOVO, decidido pelo Pedro em 29/jul/2026.** Este plano não previa edição de conteúdo:
> a Fase 1 ia de casca a e-mails sem passar por aulas. A tela nasceu de uma pergunta dele sobre
> onde ficariam os links de vídeo, e a resposta puxou o resto junto — **painel não edita código**,
> então tudo o que o admin mexe precisa estar no banco.
>
> A migração que isso exigia **já foi feita no mesmo dia** (tarefa 15b): o `lib/curso.ts` não
> guarda mais as aulas, o currículo vem de `modules`/`lessons` e os materiais de `materials`.
> Trocar título, descrição ou `panda_video_id` no banco já muda a tela **sem deploy**, o que foi
> verificado. Falta só a tela que faz isso com as mãos de alguém.

- **Lista de módulos**, com as aulas de cada um em acordeão, na ordem do curso.
- **Editar módulo**: título, docente, arte.
- **Editar aula**: título, descrição, **link do vídeo** (`panda_video_id`), duração, e se
  conta para o gate de 16/16 (`conta_no_gate`).
- **Materiais**: adicionar, renomear e remover, com o vínculo à **aula** (resumo) ou ao
  **módulo** (apostila), que é a distinção que a tabela já suporta.
- _Dados_: `modules`, `lessons`, `materials` (leitura e escrita).

**A definir antes de construir:**

- **Arquivo: upload ou URL?** O material pode ser enviado pelo painel para o Supabase Storage,
  ou o admin cola um link já hospedado. A coluna `materials.arquivo` guarda caminho, então as
  duas cabem; muda o tamanho da tela e se precisamos de bucket com policy.
- **Reordenar aulas.** O `ord` define a ordem do curso e, por consequência, o **número da aula
  na URL**. Deixar reordenar é útil e perigoso: o progresso do aluno é gravado por `lesson_id`,
  então ele não se perde, mas links compartilhados apontariam para outra aula. Talvez reordenar
  fique fora do v1.
- **Criar e apagar aula.** Apagar aula com progresso gravado apaga o progresso junto (o
  `on delete cascade` da tabela). Isso pede confirmação forte, ou desativação em vez de exclusão.

## 5. Modelo de dados (tabelas usadas)

`profiles`, `enrollments`, `modules`, `lessons`, `materials`, `progress`, `questions`,
`exams`, `certificates`, `email_log` — todas já no schema (`supabase/migrations/0001_init.sql`).
Funções úteis: `is_admin`, `has_active_access`, `sortear_prova`, `verify_certificate`.

## 6. Fases

| Fase | Entrega | Depende de |
|---|---|---|
| **1 — UI funcional** | Casca + Painel (métricas de exemplo) + Questões (CRUD sobre o seed) + Alunos/Detalhe/E-mails com dados mock + **Conteúdo (aulas e materiais)** | — |
| **2 — Supabase real** | Todas as leituras vindas do banco; CRUD de questões persistindo; guarda `is_admin` no proxy | Supabase provisionado |
| **3 — Ações que mutam** | Revogar/estender acesso, reenviar acesso, liberar 2ª chamada, trocar e-mail | Guru (docs/secret) + SES |

## 7. Dependências externas (bloqueiam a Fase 3)

- **Guru**: relação `guru_customer_id`/`guru_order_id` para reprovisionar acesso.
- **SES**: envio real dos e-mails (reenvio de acesso, 2ª chamada).
- **Provisionamento Supabase** (chaves por ambiente) para a Fase 2.

## 8. Pontos a definir

**Acesso de admin (pendência registrada em 25/jul/2026 — decidir antes da Fase 1):**

- **Bootstrap do papel**: como nasce o primeiro admin e como se concede/revoga o papel
  depois (à mão no dashboard do Supabase? seed? tela dentro do próprio admin?). Hoje
  `is_admin()` existe no banco, mas nada atribui o papel.
- **Onde o papel vive**: coluna em `profiles`, `app_metadata` do Supabase Auth, ou
  tabela própria. Precisa ser algo que o aluno não consiga se atribuir (RLS).
- **Porta de entrada**: mesma `/app/login` (e o redirect pós-login decide por papel) ou
  tela própria em `/admin/login`, fora do tema da área do aluno.
- **Proteção extra**: e-mail corporativo obrigatório? 2FA? Ou sessão Supabase comum
  basta para o v1?
- Não-admin em `/admin`: redireciona para `/app` ou mostra 404?
- Precisamos de auditoria (quem fez cada ação) já na Fase 1 ou só depois?
- O NPS entra no Painel agora (mock) ou espera a pesquisa real?

---

_Ao aprovar, começo pela Fase 1 na ordem: casca → Painel → Questões → Alunos/Detalhe →
E-mails. Cada tela validada com você antes de seguir._

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

## 5. Modelo de dados (tabelas usadas)

`profiles`, `enrollments`, `modules`, `lessons`, `progress`, `questions`, `exams`,
`certificates`, `email_log` — todas já no schema (`supabase/migrations/0001_init.sql`).
Funções úteis: `is_admin`, `has_active_access`, `sortear_prova`, `verify_certificate`.

## 6. Fases

| Fase | Entrega | Depende de |
|---|---|---|
| **1 — UI funcional** | Casca + Painel (métricas de exemplo) + Questões (CRUD sobre o seed) + Alunos/Detalhe/E-mails com dados mock | — |
| **2 — Supabase real** | Todas as leituras vindas do banco; CRUD de questões persistindo; guarda `is_admin` no proxy | Supabase provisionado |
| **3 — Ações que mutam** | Revogar/estender acesso, reenviar acesso, liberar 2ª chamada, trocar e-mail | Guru (docs/secret) + SES |

## 7. Dependências externas (bloqueiam a Fase 3)

- **Guru**: relação `guru_customer_id`/`guru_order_id` para reprovisionar acesso.
- **SES**: envio real dos e-mails (reenvio de acesso, 2ª chamada).
- **Provisionamento Supabase** (chaves por ambiente) para a Fase 2.

## 8. Pontos a definir

- Não-admin em `/admin`: redireciona para `/app` ou mostra 404?
- Precisamos de auditoria (quem fez cada ação) já na Fase 1 ou só depois?
- O NPS entra no Painel agora (mock) ou espera a pesquisa real?

---

_Ao aprovar, começo pela Fase 1 na ordem: casca → Painel → Questões → Alunos/Detalhe →
E-mails. Cada tela validada com você antes de seguir._

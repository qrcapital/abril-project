---
name: email-boas-vindas-antes-do-lancamento
description: Três pendências do e-mail de boas-vindas que só vencem no lançamento e não aparecem em homolog; puxar na rodada pré-produção.
metadata:
  node_type: memory
  type: project
---

**Puxar esta nota quando o Abril entrar na rodada de lançamento para produção.** O Pedro pediu
em 29/jul/2026 que ficasse guardado, ao decidirmos que o template `Invite user` não urgia. O
detalhe completo está em `docs/PENDENCIAS-LP.md`, seção "Antes de produção: o e-mail de
boas-vindas". Ver [[lp-abril-estado-e-pendencias]] e [[estado-abril-plataforma]].

**Por que some do radar:** em homolog o primeiro acesso usa o atalho `?s=primeiro`, que **pula o
e-mail inteiro**. Nada disso quebra em teste; quebra com o primeiro aluno real pagante, que é o
pior lugar para descobrir.

1. **Colar `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=invite`** no template **Invite
   user** do painel do Supabase. Não é decisão, é a mesma edição já feita no Reset Password
   trocando o tipo; o `/auth/confirm` aceita `invite` desde 28/jul e o webhook do Guru já gera o
   link. É a única das três que **quebra o fluxo**: sem ela o link do e-mail da compra aprovada
   não leva a lugar útil, e ele é o primeiro contato de quem pagou.
2. **Corpo do e-mail #3 (boas-vindas + acesso)**, do `PRD.md` §14. A spec mora no `FLUXO-v1.md`,
   documento referenciado que nunca foi trazido ao repo. Sem ele o aluno recebe o corpo padrão
   do Supabase: funciona, mas fora da marca e sem passar pelo `COPY.md`.
3. **Remetente definitivo.** Hoje é `onboarding@resend.dev`, remetente de **teste** do Resend,
   escolhido em 28/jul só para destravar o homolog. A decisão de domínio está no `AMBIENTES.md`:
   seguir no Resend com domínio verificado, ou passar para o SES (já previsto para os outros
   doze e-mails). Se for SES, o **warm-up com SPF/DKIM/DMARC começa antes**, não na véspera.

Os e-mails 3 e 4 não saem pelo nosso código: são emitidos pelo Supabase Auth com template do
painel, então nenhum dos três se resolve por commit. É trabalho de painel e de insumo.

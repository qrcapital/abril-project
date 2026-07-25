---
name: estado-abril-plataforma
description: Onde paramos na plataforma Abril (área do aluno + auth) e o que falta fazer.
metadata: 
  node_type: memory
  type: project
  originSessionId: 3752e2e2-2af8-45f4-9edd-789af3274356
  modified: 2026-07-21T21:27:43.655Z
---

Estado da **plataforma Abril — Estratégia Internacional** — atualizado 21/jul/2026. Ver [[projeto-abril-estrategia-internacional]] e [[pendencias-lp-abril]].

## Ao retomar — validação pendente
Deploy `eb9e21a` publicado em homolog. Falta o **Pedro validar o fluxo completo logado** (envolve senha, que a máquina não digita por política): em `abril-project.netlify.app/app/login?s=primeiro`, criar conta com nome → conferir nome/e-mail/prazo de acesso em "Minha conta" e o **nome no certificado** (`/app/certificado`). A conta de teste `João Testinho` / `testinhos@joao.com.br` já existe no Supabase homolog (criada no dev local; é o mesmo projeto Supabase). A tela de primeiro acesso do homolog já mostra o campo "Nome completo" (confirmado visualmente pós-deploy).

## Onde paramos (no ar em homolog)
Último commit `4822199` no branch `homolog` (correção de contraste AA do copyright do rodapé da LP: `#5F7469`→`#8FA398`; push+deploy 21/jul). Antes dele, `eb9e21a` = área do aluno com dados dinâmicos. Critique de slop da LP feito 21/jul — ver [[critique-lp-abril]]. Repo `qrcapital/abril-project`, auto-deploy no push. **git push direto funciona** (credenciais no Windows Credential Manager) — não precisa `!`. A LP e a **área do aluno inteira** (`/app/*`) estão funcionais em homolog com dados reais:

- **Dados do aluno na tela (21/jul, commit `eb9e21a`):** nome (6 telas, incl. certificado PDF), e-mail e prazo de acesso deixaram de ser fixos e vêm do usuário logado — o `AreaChrome` preenche marcadores `data-u` (full/first/initial), `data-email` e `data-acesso` a partir da sessão. Prazo = criação da conta + 1 ano (proxy; em produção a fonte é `enrollments.expires_at`). Primeiro acesso (homolog) pede "Nome completo" → grava `user_metadata.nome` (mesma chave do Guru). Botão "Ver a formação" removido do hero. Mudanças replicadas em `port-area.mjs` p/ sobreviver a re-portes.

- **Auth Supabase (email + senha):** login (`signInWithPassword`) e primeiro acesso = signup via server action com service role (`admin.auth.admin.createUser` com `email_confirm:true`, conta já confirmada — espelha o webhook do Guru). Guarda de sessão no `proxy.ts` protege `/app/*`; "Sair" faz signOut.
- **Área funcional:** `lib/curso.ts` (5 módulos, 17 aulas) + templates (`aula-template.ts`, `home-template.ts`); páginas de aula data-driven, navegação real, sidebar com estados, home dinâmica. Player tocando (clipe local `/app/video/aula-exemplo.mp4`, sem download) + materiais baixáveis.
- **Progresso POR USUÁRIO:** cookie `ei_progresso_<userId>` (seed vazio); conta nova começa do zero. Sidebar/%/home/"Continuar"/gate da prova reagem.
- **Certificado:** baixar PDF (html2canvas+jsPDF, sem corte, logos rasterizadas), LinkedIn add-to-profile, `/verificar/:codigo` público. og:image da LP + twitter card.
- **LP → funil:** botão "comprar" leva a `/app/login?s=primeiro` (primeiro acesso), sem Guru em homolog.

## Segredos (NUNCA commitar)
`.env.local` (gitignored) tem as chaves do Supabase, incl. `SUPABASE_SERVICE_ROLE_KEY` (altamente sensível). Projeto Supabase homolog: `https://jbfkkkjxgkmbqujpcgjy.supabase.co`. Descobertas: email confirmation ligado; trigger `handle_new_user` não cria profile (sem INSERT policy) — por isso o signup usa service role; PostgREST às vezes reclama de "schema cache" em reads public.* (assentando; recarregar cache no dashboard se persistir).

## Próximos passos (nada bloqueia agora)
1. ~~**Netlify homolog:** adicionar as env vars do Supabase.~~ **FEITO 21/jul/2026** (via painel Netlify, Chrome dirigido). 5 env vars no site `abril-project`: 4 públicas (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL=https://abril-project.netlify.app` — corrigido de localhost, `NEXT_PUBLIC_WHATSAPP_URL`) em *all deploy contexts*; `SUPABASE_SERVICE_ROLE_KEY` como **secret** só no context **Production** (o Pedro digitou o valor — política me impede de inserir tokens/segredos). **Escopo "all contexts" é interino:** a Production branch aponta pra `homolog`, então o deploy de abril-project.netlify.app roda no context `production` (não `homolog` — o bloco `[context.homolog.environment]` do netlify.toml não pega esse deploy). Quando `main` virar produção real c/ Supabase próprio, reescopar. Redeploy sem cache feito; `/app/login` renderiza sem erro de Supabase e console limpo. Falta só o Pedro fazer o teste real de submit de login (senha) — não posso inserir senha. **Achado:** `NEXT_PUBLIC_WHATSAPP_URL` é env var MORTA — o link está hardcoded (`https://wa.me/message/W2USYZZK75FMC1`) em `LoginClient.tsx`, `AreaChrome.tsx`, `ContaClient.tsx`, `ResultadoClient.tsx` + LP; a env não é lida por ninguém.
2. **Prova funcional:** banco de questões + correção, gate 16/16 (hoje o card só abre popup de "bloqueada"). Banco é construção nossa (20 sorteadas de ~100).
3. **Recuperação de senha:** telas `/app/recuperar-senha` e `/app/redefinir-senha` (hoje "Esqueci minha senha" dá 404).
4. **Antes de produção:** remover atalhos de teste (TestBar/TestShortcuts na tela de login).
5. **Migrar dados p/ o DB:** curso está em código (`lib/curso.ts`), tabela `lessons` vazia; progresso é cookie, não DB.
6. **Admin (V2):** plano em `docs/PLANO-ADMIN.md`.
7. Telas secundárias (`/obrigado`, `/app/acesso`), pixels/preço-parcelas configuráveis.

## Fora do escopo do homolog (confirmado pelo Pedro)
Termos, Privacidade, LGPD, VSL, vídeos e materiais reais NÃO entram no homolog. Rodapé: só razão social e DPO por enquanto.

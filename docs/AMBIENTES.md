# Ambientes e deploy — Estratégia Internacional

Estratégia homolog-first: antes de produção, um ambiente de homologação na nuvem que os stakeholders testam por link. Três ambientes isolados, com dados e chaves separados.

## Os três ambientes

| Ambiente | Uso | Branch | Deploy | Supabase | Integrações |
|---|---|---|---|---|---|
| **Local** | Dev na máquina | qualquer | `npm run dev` | homolog ou local | sandbox |
| **Homolog** | Stakeholders testarem | `homolog` | Netlify (contexto homolog) | projeto `ei-homolog` | sandbox / teste |
| **Produção** | Ao vivo | `main` | Netlify (contexto production) | projeto `ei-prod` | reais |

## Fluxo de trabalho

1. Construímos na branch `homolog` (ou em feature branches que abrem PR para `homolog`).
2. Push em `homolog` dispara deploy automático no ambiente de homolog. PRs ganham deploy preview próprio.
3. Stakeholders testam a URL de homolog.
4. Aprovado, merge de `homolog` para `main` dispara o deploy de produção.

`main` fica sempre pronto para produção; `homolog` é o playground de validação.

## Infra

### Supabase (2 projetos)
- `ei-homolog` e `ei-prod`, chaves e dados totalmente separados.
- Região igual à das funções Netlify (ver abaixo).
- Migrations em `supabase/migrations/` aplicadas a cada projeto. Seed (`supabase/seed.sql`) só em homolog/local, nunca em produção.

### Netlify (1 site, 2 contextos)
- Site conectado ao repositório Git.
- Contexto `production` = branch `main`; contexto `homolog` = branch `homolog` (ver `netlify.toml`).
- Variáveis de ambiente definidas no painel, **escopadas por contexto**. Segredos (service role, secrets de webhook, chaves AWS) nunca no código.
- Região das funções: AWS us-east-1 por padrão. Provisionar os Supabase na mesma região para manter a regra de "uma tela, um roundtrip". Fixar a região das funções pode exigir plano pago do Netlify; validar.

### Integrações por ambiente
| Integração | Homolog | Produção |
|---|---|---|
| Checkout Guru | sandbox / produto de teste | real |
| Panda Video | vídeos de teste | reais |
| SMTP do Supabase Auth (reset de senha, convite) | **Resend** configurado em 28/jul/2026, remetente de teste `onboarding@resend.dev`, entrega validada de ponta a ponta | a decidir junto com o domínio: pode continuar Resend com domínio verificado, ou passar para o SES |
| Envio dos transacionais nossos (`lib/email.ts`) | **Resend por HTTP desde 31/jul/2026**, a mesma conta do SMTP acima. Precisa de `RESEND_API_KEY` no ambiente; sem ela o envio falha e a tentativa fica registrada em `email_log`. **ATENÇÃO, medido em 31/jul: com o remetente de teste `onboarding@resend.dev` o Resend só entrega para o e-mail do dono da conta** (403 `validation_error` para qualquer outro destinatário). Em homolog, isso significa que só o Pedro recebe | a decidir junto com o domínio: continuar Resend ou passar para o SES |
| Amazon SES | ainda não configurado, e **nada depende dele** | produção, domínio com reputação, SPF/DKIM/DMARC. A troca é uma chamada em `lib/email.ts`, mais o SDK da AWS (SigV4) |
| WhatsApp | mesmo link de suporte | mesmo link de suporte |

## Variáveis de ambiente

Ver `.env.example` para a lista completa. Cada ambiente tem seu conjunto:
- `NEXT_PUBLIC_APP_ENV` identifica o ambiente (`homolog` / `production`), útil para banners de "ambiente de teste" e telemetria.
- Chaves Supabase, secret do Guru, chaves AWS e IDs de pixel são específicos de cada ambiente.

## Para acender o homolog (checklist de provisionamento)

Pendências que dependem das contas do time. Assim que existirem, aplico migrations e configuro o resto.

1. **Repositório Git remoto** (GitHub/GitLab/Bitbucket): o Netlify faz deploy a partir dele. Criar o repo e definir quem dá push.
2. **Site no Netlify**: conectar o repositório, apontar o contexto `homolog` para a branch `homolog`.
3. **Projeto Supabase `ei-homolog`**: criar e fornecer `URL`, `anon key` e `service role key` (a service role é segredo).
4. **Variáveis no Netlify** (contexto homolog): preencher conforme `.env.example`.
5. ~~Aplicar `supabase/migrations/0001_init.sql` e `supabase/seed.sql` no `ei-homolog`.~~
   **FEITO em 28/jul/2026.** Era o único item deste checklist que nenhum documento
   registrava como concluído, e de fato nunca tinha sido: o schema `public` estava vazio.
   Ver `HANDOFF.md` §6, que traz também o backfill de `profiles` e a correção do `revoke`
   do `sortear_prova()`. Ao provisionar o `ei-prod`, aplicar a migration **já corrigida**
   e **não** aplicar o seed, pela regra desta seção.
6. **Política de senha no painel do Supabase** (Authentication → Sign In / Providers → Email).
   ~~Pendente.~~ **FEITO no homolog em 30/jul/2026:** mínimo **8** e requisitos **"Lowercase,
   uppercase letters and digits"**.

   **Isto não está em migration nenhuma**, é configuração do projeto, então **tem que ser
   repetido à mão no `ei-prod`**. A regra do produto vive em `lib/senha.ts` (8 com maiúscula,
   minúscula e número) e o app a valida nos três caminhos que tem, mas a plataforma não a
   conhecia: com a chave anon, `auth.updateUser({password})` aceitava `abc123`, `abcdefgh`,
   `ABCDEFGH` e `Abcdefgh`, por fora dos formulários. Demonstrado com conta descartável antes
   e depois; agora recusa as quatro e aceita uma válida.

   **Não escolher a quarta opção** do seletor ("...digits and symbols"), embora o Supabase a
   rotule como recomendada: ela exige símbolo, o `validarSenha` não, e a plataforma ficaria mais
   estrita que a tela — o aluno levaria recusa que a nossa UI não sabe explicar.

   **Três coisas na mesma tela que ficaram deliberadamente como estavam:**
   - **"Require current password when updating" (off).** Ligar quebraria o nosso próprio fluxo:
     o `conta/actions.ts` confere a senha atual com `signInWithPassword` e depois chama
     `updateUser` **sem** passá-la. Mexer aqui exige mudar o código primeiro.
   - **"Secure password change" (off).** Estado conhecido e documentado no `PRD.md` §9 — é
     justamente por vir desligada que o formulário exige a senha atual. Ligar duplicaria a
     proteção e só somaria fricção.
   - **"Prevent use of leaked passwords" (off).** Exige plano **Pro**; o projeto está no Free.

7. **Criar o primeiro admin, e criá-lo como MESTRE**
   (`node scripts/admin-conta.mjs <email> --mestre --aplicar`, apontando o `.env.local` para o
   ambiente certo).
   **FEITO no homolog em 30/jul/2026:** `pedrohfontei@gmail.com`, mestre. Antes disso o banco tinha
   **zero** admins, e nenhum documento registrava isso.

   **O `--mestre` não é opcional aqui.** Sem ele o primeiro admin nasce comum, e admin comum não
   concede o nível de mestre (migration `0005`): o ambiente ficaria sem mestre nenhum, e a única
   saída seria voltar ao script.

   **Tem que ser repetido no `ei-prod`, e não dá para esquecer**, porque a migration `0003`
   fechou o caminho: `profiles.is_admin` só muda pela **service role** ou por um **admin que já
   era admin**. Num banco novo não existe nem um nem outro do lado do app, então o `/admin` de
   produção sobe **inacessível** até alguém rodar este script. Uma tela dentro do próprio admin
   não resolveria: ninguém entra nela para criar o primeiro.

   Não é seed: o seed não roda em produção pela regra da seção "Infra", e o e-mail do primeiro
   admin é diferente em cada ambiente.

   **Só o primeiro precisa do script.** Do segundo em diante é pela tela `/admin/equipe`
   (`PLANO-ADMIN` §4.7), com busca por e-mail. Os dois caminhos não são redundantes: o script é o
   único que funciona num banco sem admin, e a tela é a única que funciona para quem não tem a
   service role na mão.

Milestone inicial sugerido: subir o homolog com o que já existe (shell da LP e da área do aluno) só para estabelecer o pipeline e dar a URL aos stakeholders cedo, e ir ligando as integrações em seguida.

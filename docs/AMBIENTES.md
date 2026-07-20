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
| Amazon SES | modo sandbox ou remetente verificado com destinatários de teste | produção, domínio com reputação |
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
5. Aplicar `supabase/migrations/0001_init.sql` e `supabase/seed.sql` no `ei-homolog`.

Milestone inicial sugerido: subir o homolog com o que já existe (shell da LP e da área do aluno) só para estabelecer o pipeline e dar a URL aos stakeholders cedo, e ir ligando as integrações em seguida.

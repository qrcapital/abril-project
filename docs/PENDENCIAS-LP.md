# Pendências — LP + Área do Aluno

Checklist vivo do que falta antes do "pronto para produção" (V1/homolog). Atualizado
conforme os insumos chegam. Quando o Pedro perguntar "quais as pendências?", este é o
documento a puxar. (O admin é V2 — ver `PLANO-ADMIN.md`.)

_Última atualização: 2026-07-25 (ressincronizado junto com o `HANDOFF.md`)._

> Legenda: 🟢 dá para fazer agora (sem insumo externo) · 🔒 bloqueado por insumo/decisão.

## 🔴 Venda / checkout

- [x] **Homolog: compra → primeiro acesso** — "GARANTIR MINHA VAGA" leva a
      `/app/login?s=primeiro` (simula a compra, sem Guru) (2026-07-20).
- [ ] **Produção: checkout do Guru** — trocar o CTA pela **URL do checkout Guru**.
      _Insumo:_ URL do checkout (PH, com docs/secret do webhook).

## 🟢 Dá para fazer agora (sem insumo)

- [ ] **Prova funcional** — **motor pronto (28/jul)**, falta o **conteúdo**. Sorteio
      balanceado, snapshot, respostas e correção em 14/20 gravando em `exams`, cronômetro no
      `exams.deadline` (reentrada não reinicia), resultado com nota e desempenho por módulo
      reais. Pendente: escrever as **~100 questões**, 25 por módulo. O motor roda hoje sobre
      as 24 `[EXEMPLO]` do seed.
- [ ] **Definir como funcionará o acesso de admin** — o `PLANO-ADMIN.md` §2 já cobre o
      mecanismo (guarda no proxy + `is_admin()` + service role só no servidor), mas
      falta a operação: como o papel é concedido e o primeiro admin criado (bootstrap),
      se entra pela mesma `/app/login` ou por tela própria, e o que o não-admin vê em
      `/admin`. É decisão de spec, sem insumo externo; os pontos estão listados no
      `PLANO-ADMIN.md` §8. (O build do admin em si segue V2.)
- [ ] **Política de senha no painel do Supabase** — a regra do produto (6 caracteres, com
      maiúscula, minúscula e número) está em `lib/senha.ts` e vale nas duas portas que criam
      senha, nos dois lados. Falta espelhá-la em **Authentication** no painel, que é quem
      recusa também quem chame a API por fora do nosso código. _Insumo:_ ajuste no dashboard.
- [ ] **`{{ preco }}` / `{{ parcelas }}`** configuráveis (hoje hardcoded no porte).
- [ ] **Telas secundárias** — `/obrigado`, `/app/acesso`.
- [ ] **Remover atalhos de teste** (login e prova) antes do go-live.
- [ ] **Pixels de tracking** (`fbq`/`gtag`) — estrutura pronta; precisa dos IDs.
- [ ] **Migrar o curso para o banco** — hoje vive em `lib/curso.ts`, a tabela `lessons`
      está vazia e o progresso é cookie.

## 🔒 Bloqueado por insumo

- [ ] **Template de e-mail do convite (primeiro acesso)** — o `/auth/confirm` já aceita
      `type=invite`, e o webhook do Guru já gera esse link, mas o template **Invite user** no
      painel segue no padrão. Mesma edição do Reset Password, trocando o tipo:
      `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=invite`. Não urge, porque o primeiro
      acesso do homolog usa o atalho `?s=primeiro` até o Guru entrar.
- [ ] **Links das redes sociais do rodapé** — hoje `href="#"`. _Insumo:_ URLs reais dos
      perfis.
- [ ] **`banned-words.md`** — o `docs/COPY.md` referencia esse arquivo, que nunca existiu.

## 🚫 Fora do homolog (decisão 2026-07-20)

Não entram no homolog; ficam para produção com o conteúdo real:
- **Termos de uso** e **Privacidade · LGPD** (páginas/URLs) — rodapé segue `href="#"`.
- **VSL do hero** — segue placeholder.
- **Vídeo real (Panda)** — homolog usa clipe de exemplo.
- **Materiais reais** (apostilas/planilhas) — homolog baixa PDF de exemplo.
- **Arte dos módulos** — homolog usa placeholder.

## 🔌 Backend (Fase 2)

- **Auth Supabase** (login real, sessão, guarda de rotas).
- **Webhook Guru** (provisionar acesso na compra).
- **E-mails** (boas-vindas, reset, resultado).
- Trocar as fontes de dados (progresso/curso/certificado) para o banco.

## ✅ Já resolvido

- [x] **Dados jurídicos do rodapé** — a razão social passou a ser **"Abril Comunicações
      S.A. · CNPJ 44.597.052/0001-62"**, porque a LP vai para um subdomínio da Abril
      (2026-07-22). Substitui "1971 Comunicações e Sistemas LTDA.", registrada em
      2026-07-20 e superada. DPO segue `dpo@qr.capital`.
- [x] **Copy do FAQ e do CTA final** — dado como **finalizado por ora** pelo Pedro
      (2026-07-25): o texto atual fica como está, sem nova varredura. Era a última etapa
      da revisão seção a seção (hero, docentes, currículo, Ferramentas e Oferta já tinham
      passado). Reabrir só se a rodada de copy pré-launch pedir; o H2 do CTA final e a
      pergunta de conta no exterior do FAQ são decisões travadas (`HANDOFF.md` §7).
- [x] **Nav do rodapé** — o da LP já saíra alinhado à topbar (Professores, Formação,
      Ferramentas, Idealizadores, FAQ) na etapa 9 do `port-lp`; faltava o **rodapé da
      área**, que ainda listava O Diagnóstico, Corpo Docente, A Formação e Quem Assina.
      Alinhado no `buildFooter()` do `port-area`, junto com a razão social superada e a
      troca de "chancela editorial" por "institucional" (2026-07-25).
- [x] **Recuperação de senha** — `/app/recuperar-senha`, `/auth/confirm` e
      `/app/redefinir-senha` construídos e **validados com e-mail real** (2026-07-28): o Pedro
      pediu a redefinição pela tela, recebeu na caixa dele, clicou e trocou a senha. O
      "Esqueci minha senha" do login deixou de dar 404. O mesmo handler serve o **primeiro
      acesso** com `type=invite`.
- [x] **SMTP do Supabase** — **Resend** configurado em 2026-07-28, remetente de teste
      `onboarding@resend.dev`, credencial de SMTP sendo a API key (usuário literal `resend`,
      host `smtp.resend.com`, porta 587). O template de Reset Password aponta para
      `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery`, e `localhost:3000` mais o
      domínio do Netlify estão na allowlist de Redirect URLs. Usar `{{ .RedirectTo }}` em vez
      de `{{ .SiteURL }}` faz o link seguir o ambiente que pediu o reset, então dá para testar
      local sem mexer no Site URL do projeto. Escolhido para destravar o homolog; o remetente
      definitivo depende da decisão do domínio de produção.
- [x] **`COPY.md` promovido para `docs/`** — a diretriz anti-slop saiu de
      `referencias/cowork/` (fora do git) e virou `docs/COPY.md`, versionado (2026-07-25).

- [x] **Progresso real** — marcar aula concluída (cookie); sidebar/%/home/"Continuar"/gate da prova reagem (2026-07-20).
- [x] **Certificado — Baixar PDF** (imprime o preview, fiel ao design) + **Compartilhar no LinkedIn** (add-to-profile oficial) + "Validar" → `/verificar` (2026-07-20).
- [x] **Página pública `/verificar/:codigo`** — válido/inválido, on-brand (2026-07-20).
- [x] **`og:image` da LP** — imagem 1200×630 branded + twitter card (2026-07-20).
- [x] **WhatsApp** — botão flutuante + link do rodapé plugados em
      `https://wa.me/message/W2USYZZK75FMC1` (2026-07-20).
- [x] **Performance de imagens** — PNG/JPG → WebP + lazy-load (6,3 MB → 1,3 MB).
- [x] **Hovers de botões/links** — restaurados via `HoverRuntime` (`style-hover`).
- [x] **Glow do card de preço** — efeito `.vs-hl` aplicado à Oferta.
- [x] **"Entrar" da topbar** → `/app/login` (área do aluno). Login já construído (2026-07-20).
- [x] **Rodapé reestruturado** — colunas Institucional/Políticas/Contato + DPO + copyright
      + voltar ao topo, inspirado no cca.blocktrends.com.br (2026-07-20).

---

_Como plugar cada pendência: os pontos da LP vivem em `app/_lp/body.html` (gerado pelo
porte). Trocas estáveis devem ir também em `scripts/port-lp.mjs` para sobreviver a
reexecuções — foi assim com WhatsApp, glow e otimização de imagem._

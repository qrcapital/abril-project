# IMPLEMENTAÇÃO — Estratégia Internacional · LP + Plataforma
**Handoff para Claude Code · v1.0 · 09/jul/2026**

Este documento é a fonte única de verdade para implementar a LP de vendas e a área do aluno. Foi escrito para uma sessão de Claude Code sem contexto prévio: tudo que foi decidido e desenhado está explícito aqui. Copie este arquivo para a raiz do repositório (ou use como base do CLAUDE.md).

---

## 0. Contexto do produto

**Estratégia Internacional**: formação em dolarização de patrimônio. 4 módulos + módulo 0 de boas-vindas, 16 aulas, 30h+, prova final com certificação. Produção BlockTrends com chancela VEJA Negócios (Grupo Abril). Público: investidor bancarizado sem experiência internacional.

- **Lançamento**: setembro/2026. Build deve estar em QA até fim de agosto.
- **Preço**: R$ 400 à vista · parcelamento TBD comercial (template preparado para injetar)
- **Time**: PH (product/design lead) + Claude (dev). Decisões de produto travadas na seção 8 — não reabrir sem o PH.

## 1. Arquitetura e stack

```
LP estática (Next.js/SSG ou HTML puro + CDN)
   └─ CTA → Checkout Digital Manager Guru (+ Pagar.me)   [já contratado]
                └─ webhook → PLATAFORMA (nosso build)
                                ├─ vídeo: Panda Video     [já contratado]
                                ├─ e-mail: Amazon SES     [a configurar]
                                ├─ auth/DB/storage: Supabase (Postgres)
                                └─ suporte: WhatsApp (wa.me, sem API na v1)
```

- **Framework**: Next.js (App Router) + Supabase (Auth, Postgres, Storage) + deploy Vercel. LP pode ser rota pública do mesmo projeto (`/`) com a plataforma em `/app` — SEO da LP via SSG.
- **Custos e cenários**: ver `plataforma-propria.html` (blueprint aprovado). Fixo ≈ R$ 340–500/mês.
- **Contas/credenciais necessárias** (PH providencia): Supabase org · Vercel · domínio + DNS · Panda Video API key · Guru (webhook secret + docs do payload) · AWS SES (domínio verificado, DKIM/SPF/DMARC — iniciar warm-up imediatamente) · número WhatsApp oficial do suporte.

## 2. Design system (inviolável)

### Tokens
```css
--verde:#0B2D20;      /* fundo primário dark, CTAs secundários */
--verde-2:#123B2B;    /* variação de fundo */
--verde-3:#0A2B1E;    /* fundo mais profundo (topbars, base da plataforma) */
--verde-card:#0F3526; /* cards da plataforma */
--offwhite:#F7F5F2;   /* fundo claro (LP), texto sobre verde */
--bege:#EDE6DD;       /* superfícies claras secundárias, réguas */
--areia:#D6C3C2;      /* bordas em fundo claro */
--pedra:#8F887E;      /* texto secundário claro */
--grafite:#333333;    /* texto principal em fundo claro */
--medio:#6D6D6D;      /* texto secundário em fundo claro */
--gold:#A98E4E;       /* acento primário, CTAs */
--gold-dark:#7E6836;  /* texto dourado sobre claro */
--gold-lit:#D9BE85;   /* dourado sobre escuro */
--gold-soft:#F0E9D8;  /* fundos de chip/badge claros */
--wpp:#1FA855;        /* botões WhatsApp */
--muted:#8FA398; --muted2:#A9B8AE; /* textos sobre verde */
```

### Tipografia
- **Playfair Display** (500/600/700 + itálicos): títulos, números de destaque, nomes, wordmark
- **Montserrat** (400–800): corpo, UI, labels
- Labels/kickers: 10–11px, uppercase, letter-spacing .14–.22em, weight 700
- Self-host as fontes no build de produção (woff2 já extraídas do bundle do Claude Design)

### Marca — aplicação obrigatória
- **Wordmark** (todo uso do nome do curso): "ESTRATÉGIA" em Playfair espaçada (letter-spacing ~.26em) + linha "—— INTERNACIONAL ——" menor com hairlines douradas nas laterais. Implementação CSS de referência no `plataforma-starter.html` (classe `.wordmark`).
- **Olho em gravura** (símbolo): PNGs prontos em `assets/` — versão original (fundo claro), preta com miolo branco + fade de bordas (a da topbar da LP), dourada (fundos escuros). Nunca recriar; usar os arquivos.
- **Texturas**: pontos radiais sutis (`radial-gradient(rgba(247,245,242,.05-.08) 1.2px, transparent)` em grid 30px) sobre fundos verdes; ilustrações em estilo gravura (SVG stroke dourado) para artes de módulos.
- **LP**: fundo claro off-white com faixas verdes (hero, docentes, oferta). **Plataforma**: tema escuro verde único (sem modo claro).
- Proibido: cores fora da paleta, sombras coloridas fora do dourado, bordas arredondadas acima de 14px.

## 3. Inventário de arquivos-fonte (levar para o repo)

| Arquivo (em outputs/) | O que é | Uso no build |
|---|---|---|
| `Estrategia Internacional - LP v1.html` (uploads) | Export do Claude Design (bundle JS 8,7MB) | Fonte de verdade do design da LP — desempacotar (ver §4.1) |
| `hifi-lp.html` | Nosso hi-fi pré-Claude Design | Referência de fallback + fotos docentes e olho em base64 |
| `plataforma-starter.html` | Design system + home vitrine + página de aula | Base do CSS da plataforma |
| `CD-BRIEF-plataforma.md` | Spec das 7 telas da área do aluno | Spec funcional das telas |
| `documento-projeto.html` | Fluxos v1 + wireframes anotados | Consulta de fluxo/regras |
| `FLUXO-v1.md` | User flow completo + inventário de 14 e-mails | Spec dos e-mails e jornadas |
| `ANOTACOES-CADEMI.md` | Auditoria da referência (área CCA) | Padrões de UX validados |
| `plataforma-propria.html` | Blueprint técnico/custos | Arquitetura e cronograma |
| `eye_final.png`, `eye_topbar_v3.png` | Assets do olho | `public/brand/` |
| Fotos docentes (4: Bastos, Volpon, Roxo, Ywata) | Nos arquivos do projeto Claude.ai e em base64 no hifi-lp.html | `public/docentes/` (otimizar ~400px webp) |
| Brand guide PDF + deck corpo docente PDF | Arquivos do projeto | Referência |

**Nota sobre o bundle do Claude Design**: o export é um HTML com manifest JSON (`<script type="__bundler/manifest">`) de 38 arquivos gzip+base64 (imagens, fontes woff2, JS) + template em `<script type="__bundler/template">`. Script de desempacotamento: decodificar base64 → gunzip cada entrada → salvar por mime; o template contém o HTML/CSS real com vars `{{ preco }}`, `{{ parcelas }}`, `showVsl`, `showWhatsapp`.

## 4. Workstream A — LP de vendas

### 4.1 Reconciliação do design aprovado
1. Desempacotar o bundle do Claude Design (§3) e reconstruir como página estática (sem o runtime JS deles — o conteúdo renderizado deve existir no HTML para SEO).
2. Otimizar imagens: os PNGs novos do bundle somam ~5MB (887KB/1MB/3MB) → converter para WebP ≤200KB cada.
3. Estrutura aprovada (topo → base): **Topbar fixa** (wordmark+olho · O Diagnóstico · Corpo Docente · A Formação · Quem Assina · FAQ · Entrar · Inscreva-se, hambúrguer mobile) → **Hero** (headline "Sua liberdade financeira começa pela geografia" + lide + CTA "QUERO DOLARIZAR MEU PATRIMÔNIO →" gradiente dourado + trigger "Acesso imediato após a compra · garantia de 7 dias" + VSL 16:9 configurável) → **Ficha técnica** faixa contínua (30h+ · 4 especialistas · On-demand · Certificação VEJA Negócios [célula invertida] · {{preco}}) → **O Diagnóstico** (3 atos interativos) → **Corpo Docente** (4 cards com chip de módulo, foto duotone→cor, carrossel mobile) → **A Formação** (acordeões, aulas 01–16) → **A Diferença** (sozinho × com) → **Quem Assina** (VEJA destaque + BlockTrends) → **Oferta** (card glow, lista "você recebe", {{preco}}/{{parcelas}}, GARANTIR MINHA VAGA) → **FAQ** (8 perguntas) → **CTA final** + footer.

### 4.2 Correções obrigatórias sobre o design (aprovadas em revisão)
- [ ] **Links reais**: todos os CTAs de compra → URL do checkout Guru; "Entrar"/"Área do aluno" → `/app/login`; âncoras do menu funcionais
- [ ] **Parcelamento**: NÃO publicar o default "10x de R$ 39,70" (inválido — parcelado < à vista). Manter `{{parcelas}}` oculto até o comercial definir
- [ ] **Exit-intent de captura** (saiu no refino, obrigatório voltar): modal em intenção de saída/scroll profundo trocando e-book (amostra) por e-mail+WhatsApp, 1 exibição por visitante, aviso LGPD — peça-chave do cenário sem tráfego pago (FLUXO v1, J6)
- [ ] **Pixels**: Meta Pixel + GA4/Google Tag com eventos PageView, ViewContent (scroll seções), InitiateCheckout (clique CTA), Purchase (página de obrigado) — instalar no dia 1 mesmo sem mídia paga
- [ ] **SEO**: title/description/OG reais, HTML renderizado, sitemap
- [ ] **Página de obrigado** `/obrigado`: confirmação + "cheque seu e-mail" + prazos boleto + WhatsApp + evento Purchase
- [ ] Pendência de design em aberto (decisão PH pós-aprovação do time): kicker de marcas no hero

## 5. Workstream B — Plataforma (área do aluno)

### 5.1 Telas (spec completa no CD-BRIEF-plataforma.md; estilo no starter)
P1 Login (+1º acesso, erro, "pagamento em processamento") · P2 Home vitrine (banner retomada + prateleira Formação com Módulo 0→IV + prateleira Materiais & Certificação com prova bloqueada/desbloqueada e 2ª chamada condicional) · P3 Aula (player Panda + sidebar progresso + materiais + marcar concluída) · P4 Prova (instruções com checkbox de ciência → questões com timer 120min e barra n/N) · P5 Resultado (aprovado → certificado; reprovado → desempenho por módulo + WhatsApp 2ª chamada) · P6 Certificado (preview, PDF, código EI-2026-XXXX + página pública `/verificar/{codigo}`, LinkedIn, NPS) · P7 Minha conta.

### 5.2 Modelo de dados (Postgres/Supabase)
```
users        (Supabase Auth) + profile: nome, telefone, guru_customer_id
enrollments  user_id, status(active|revoked|expired), purchased_at, expires_at(+1 ano), guru_order_id
modules      ord(0-4), titulo, docente, arte
lessons      module_id, ord(1-16 + aula 0), titulo, descricao, panda_video_id, duracao
materials    lesson_id|module_id, tipo(apostila|planilha|resumo|ebook), arquivo(storage)
progress     user_id, lesson_id, status(started|completed), watched_pct, completed_at
exams        user_id, attempt(1|2), status(available|in_progress|submitted), score, started_at, deadline(+120min), questions_snapshot
questions    module_id, enunciado, alternativas[4], correta, ativo
certificates user_id, codigo(EI-2026-XXXX), issued_at, pdf(storage)
email_log    user_id, template, sent_at, status
```

### 5.3 Regras de negócio (motor)
- **Progresso**: aula concluída se `watched_pct ≥ 90` (eventos do player Panda) OU marcação manual. Módulo concluído = todas as aulas. E-mail de módulo concluído por transição.
- **Prova**: desbloqueia com 16/16 concluídas. Tentativa única; ao iniciar grava `deadline = now + 120min`; submissão após deadline = corrige só o respondido. Nota ≥ 70% aprova. Reprovado → orientar WhatsApp; **admin libera attempt 2 manualmente**. Pós-2ª reprovação: caso a caso (sem fluxo automático).
- **Certificado**: gerar PDF (peça de marca: wordmark, olho, gravuras, nome, 30h, assinaturas BlockTrends × VEJA Negócios), código único, página pública de verificação.
- **Acesso**: expira em `purchased_at + 1 ano`; e-mail de aviso 30 dias antes; pós-expiração tela de renovação (contato suporte).
- **Webhook Guru**: compra aprovada → cria user + enrollment + e-mail boas-vindas (senha via link) · reembolso/chargeback → status revoked · **idempotente** (dedupe por guru_order_id + retry-safe) · validar assinatura do webhook.

### 5.4 Admin (painel interno, rota /admin, role-based)
Lista/busca de alunos · detalhe com progresso e tentativas · ações: reenviar acesso, trocar e-mail, **liberar 2ª chamada**, revogar/estender acesso · CRUD de questões da prova · métricas básicas (alunos, conclusão, aprovação, NPS) · log de e-mails.

### 5.5 E-mails transacionais (SES) — 14 templates (specs no FLUXO-v1.md §inventário)
1 pedido recebido (pix/boleto pendente) · 2 recuperação cartão recusado · 3 boas-vindas+acesso · 4 reset de senha · 5 D+3 sem login · 6 módulo concluído · 7 D+14 inativo · 8 prova liberada (16/16) · 9 resultado da prova (aprovado/reprovado + orientação 2ª chamada) · 10 certificado emitido (PDF) · 11 reembolso confirmado · 12–14 sequência carrinho abandonado +1h/+48h/+72h (disparo pelo Guru se nativo; senão nosso cron). Template base no brand (logo clara, fundo claro, CTA dourado). Copy segue §7.

### 5.6 Rotinas agendadas (cron/Edge Functions)
D+3 sem primeiro login · D+14 sem atividade · aviso de expiração −30d · expiração de enrollment · verificação de provas com deadline estourado.

## 6. QA e critérios de aceite (gate de lançamento)
- [ ] Compra real de teste (cartão + PIX) → conta criada → e-mail chega → login → assiste → conclui → prova → reprova (forçado) → 2ª chamada liberada no admin → aprova → certificado PDF + verificação pública
- [ ] Reembolso teste revoga acesso; webhook reentregue não duplica conta
- [ ] Timer da prova: expira e corrige parcial; refresh não reinicia prova
- [ ] Progresso Panda ≥90% marca sozinho; retomada de vídeo funciona
- [ ] Mobile: vitrine com snap, hambúrguer, player, prova utilizável
- [ ] LP: Lighthouse ≥90 performance/SEO; pixels disparando os 4 eventos; exit-intent 1x por visitante
- [ ] E-mails: SPF/DKIM/DMARC pass, inbox (não spam) em Gmail/Outlook
- [ ] LGPD: consentimentos, política, exclusão de conta via suporte

## 7. Copy (obrigatório — resumo do COPY.md do projeto)
PT-BR sóbrio, tom editorial. **Proibido travessão (—)** — usar vírgula, dois-pontos ou ponto final. Sem hype ("incrível", "revolucionário"), sem "Rule of Three" formulaico, frases de comprimento variado, voz ativa, números concretos. Emojis: não (exceto ✓ e ícones de UI). Todo copy novo (e-mails, microcopy, estados vazios, erros) segue essas regras. O COPY.md completo está nos arquivos do projeto Claude.ai — trazer para o repo.

## 8. Decisões travadas (NÃO reabrir sem o PH)
R$ 400 à vista · parcelamento TBD (nunca publicar 10x 39,70) · garantia 7 dias CDC via WhatsApp · acesso 1 ano · prova única, 20 questões (nº a confirmar com docentes), 70%, 120min, 2ª chamada via admin, pós-2ª caso a caso · suporte 100% WhatsApp (menu "Dúvidas" = wa.me) · apostila por módulo + e-book bônus (SEM minidocumentário) · sem comunidade, sem gamificação, sem busca, sem modo claro · Módulo 0 Bem-vindo · vitrine na home · chancela: "VEJA Negócios × BlockTrends" (hero da LP sem kicker por ora — pendência PH).

## 9. Cronograma (6 semanas, início imediato)

| Semana | Entrega | Gate |
|---|---|---|
| **S1** | Repo, CI/CD, Supabase, schema, auth, webhook Guru em sandbox | compra teste cria conta |
| **S2** | LP reconciliada em produção (staging) + P1/P2 da plataforma | LP navegável com checkout |
| **S3** | P3 aula + player Panda + progresso + materiais/storage + upload de aulas conforme edição entregar | aluno assiste e progride |
| **S4** | P4/P5 prova completa + admin (alunos + 2ª chamada) + P6 certificado | ciclo prova→certificado |
| **S5** | E-mails SES (14) + crons + P7 + LGPD + polish mobile | e-mails na inbox |
| **S6** | QA completo (checklist §6) + soft launch interno + go/no-go | GO |

Dependência externa crítica: entrega das aulas editadas (produção: gravações jul, revisão ago). A plataforma fica pronta antes do conteúdo — upload é incremental.

## 10. Pendências externas (PH cobra)
Parcelamento (comercial) · nº oficial de questões da prova (docentes) · nº de WhatsApp do suporte · credenciais (§1) · claim "Certificação VEJA Negócios" com jurídico/Abril · kicker de marcas no hero (decisão de design) · fotos em alta se o Claude Design das telas internas pedir.

---
*Gerado no Cowork em 09/jul/2026 a partir de: FLUXO v1.0 aprovado, wireframes v1, hi-fi LP v1 (Claude Design), auditoria Cademi/CCA, blueprint de plataforma própria. Dúvida de intenção de produto: perguntar ao PH antes de assumir.*

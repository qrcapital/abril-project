# Árvore de rotas — Estratégia Internacional

Mapa completo das telas. Complementa o `PRD.md` (referência de navegação e estrutura de URLs). Um só projeto Next.js: LP pública na raiz (`/`, SSG, tema claro), plataforma autenticada em `/app/*` (tema dark), páginas públicas de conversão e verificação, e admin em `/admin`.

Convenção de parâmetros: dois-pontos (`/verificar/:codigo`).

## LP e conversão (público, sem sessão)

Tema claro. Pensadas para tráfego e compartilhamento. Todo CTA de compra aponta para o checkout externo (Guru).

| Rota | Descrição |
|---|---|
| `/` | LP de vendas (SSG). Seções ancoradas: `#hero` (com kicker de marcas, headline, VSL configurável, CTA de compra), `#ficha`, `#diagnostico`, `#docentes`, `#formacao`, `#diferenca`, `#quem-assina`, `#oferta`, `#faq`, `#cta-final`. Topbar fixa com âncoras + "Entrar" (→ `/app/login`) + "Inscreva-se" (→ checkout). CTAs de compra disparam InitiateCheckout e vão para a URL do Guru. WhatsApp flutuante e VSL controlados por `showWhatsapp` / `showVsl` |
| checkout (externo) | Digital Manager Guru + Pagar.me. Fora do nosso domínio. Coleta nome, e-mail, CPF, WhatsApp, pagamento. Não é rota nossa; listada para amarrar o fluxo |
| `/obrigado` | Página de obrigado pós-compra. Confirmação "cheque seu e-mail", prazos de boleto/PIX, atalho de WhatsApp, reenvio de acesso. Dispara evento Purchase. Acessada pelo redirect do checkout |
| `/verificar/:codigo` | Verificação pública do certificado. Código válido: confirma validade e nome do titular. Código inexistente: "certificado não encontrado", sem vazar dados. Pensada para compartilhamento (LinkedIn) |
| `/termos` | Termos de uso |
| `/privacidade` | Política de privacidade e LGPD |

## Área do aluno, pré-sessão (`/app`, sem autenticação)

Tema dark. Portas de entrada da plataforma. Sem navegação principal. A conta nasce da compra (não há cadastro aberto).

| Rota | Descrição |
|---|---|
| `/app/login` | Reentrada: e-mail + senha, "Esqueci minha senha", atalho de WhatsApp. Credencial incorreta: mensagem clara com atalho de redefinição. Sem sessão e conta com pagamento pendente: estado "seu pagamento está em processamento" (boleto/PIX até 1 dia útil), nunca erro genérico. Login válido → `/app` |
| `/app/primeiro-acesso/:token` | Definição de senha no primeiro acesso, via link do e-mail de boas-vindas. Token válido: formulário de nova senha + confirmar. Token expirado/usado: orienta pedir novo acesso pelo suporte. Sucesso → `/app` |
| `/app/recuperar-senha` | Solicita e-mail e dispara link de redefinição (Supabase). Sempre confirma envio, sem revelar se o e-mail existe |
| `/app/redefinir-senha/:token` | Define nova senha a partir do link de redefinição. Token inválido: orienta refazer o pedido |

## Área do aluno, pós-sessão (`/app/*`, autenticado)

Tema dark. Header com olho + wordmark, navegação (Início, Dúvidas via WhatsApp, FAQ), avatar/inicial e menu "Minha conta ▾" (Minha conta, Sair). Guarda de acesso global: enrollment `revoked` ou `expired` bloqueia o conteúdo e redireciona para `/app/acesso` (renovação), preservando o progresso.

| Rota | Descrição |
|---|---|
| `/app` | Home em vitrine. Banner hero: vídeo de boas-vindas; com progresso, overlay "Continue de onde parou → Módulo X · Aula Y" e CTA de retomada apontando para a última aula não concluída. Prateleira "A Formação" (Módulo 0 a IV, cada card com arte, contador X/N e estado). Prateleira "Materiais e Certificação" (apostilas, e-book, Prova Final bloqueada até 16/16, card de 2ª chamada oculto até liberação do admin). Sem progresso: banner convida ao Módulo 0 / Aula 1 |
| `/app/modulo/:m/aula/:n` | Página da aula. Player Panda Video 16:9 com retomada, cabeçalho "Módulo X · Aula N de 16", título e descrição, navegação Anterior / Concluir e próxima, bloco "Materiais desta aula" (download do Storage), sidebar "Meu progresso — X% · n de 16" com módulos em acordeão e estado por aula. Conclui automaticamente com `watched_pct ≥ 90` ou pelo botão. Materiais ainda não enviados: seção some ou mostra "em breve", sem link quebrado |
| `/app/prova` | Instruções da prova. Regras (20 questões, 70%, 120 min, tentativa única, 2ª chamada via suporte) + checkbox "estou ciente das regras e de que esta é uma tentativa única" + "Iniciar prova". Acessível só com 16/16 aulas avaliadas concluídas; caso contrário redireciona para `/app` com aviso de bloqueio. Iniciar grava `deadline` = agora + 120 min e vai para `/app/prova/questao/1` |
| `/app/prova/questao/:q` | Questão q de 20. Cronômetro visível, barra "n respondidas", 4 alternativas, Anterior / Próxima, "Enviar prova" na última (ou a qualquer momento). Refresh ou reentrada não reinicia: o `deadline` persistido manda e retoma as respostas. Deadline estourado: corrige o respondido e vai para o resultado. Sem prova iniciada: redireciona para `/app/prova` |
| `/app/prova/resultado` | Resultado da última tentativa. Aprovado (≥ 70%): nota /100, desempenho por módulo, CTA "Emitir certificado" → `/app/certificado`. Reprovado: nota /100, desempenho por módulo (onde revisar), CTA "Solicitar 2ª chamada no WhatsApp" (link pré-preenchido). Sem tentativa submetida: redireciona para `/app/prova` |
| `/app/certificado` | Certificado. Preview (wordmark, olho, gravuras, nome, 30h, assinaturas), "Baixar PDF", "Compartilhar no LinkedIn", bloco de NPS (0 a 10). Só acessível com prova aprovada; senão redireciona para `/app/prova/resultado` ou `/app`. Código `EI-2026-XXXX` exibido, com link para `/verificar/:codigo`. Reemissão reusa o mesmo código |
| `/app/conta` | Minha conta. Dados (nome, e-mail com "alterar via suporte", trocar senha self-service), Acesso ("liberado por 1 ano", disponível até `accessUntil`), Suporte (atalho WhatsApp). Acesso expirado: abre, mas o conteúdo do curso fica bloqueado com via de renovação |
| `/app/acesso` | Tela de renovação/bloqueio. Destino de enrollment `expired` ou `revoked`. Explica o status e oferece contato via suporte. Progresso preservado |

## Admin (`/admin`, papel admin)

Acesso role-based. Fora da navegação do aluno.

| Rota | Descrição |
|---|---|
| `/admin` | Painel. Métricas básicas: alunos, taxa de conclusão, taxa de aprovação, NPS. Atalho para log de e-mails |
| `/admin/alunos` | Lista e busca de alunos |
| `/admin/alunos/:id` | Detalhe do aluno: progresso, tentativas de prova. Ações: reenviar acesso, trocar e-mail, liberar 2ª chamada, revogar ou estender acesso |
| `/admin/questoes` | CRUD das questões da prova, por módulo (enunciado, 4 alternativas, correta, ativo) |
| `/admin/emails` | Leitura do `email_log` (aluno, template, envio, status) |

## Estados que não viram rota própria

Renderizados como variação da mesma tela (não têm URL distinta), listados para o design cobrir:

- **Login**: normal, primeiro acesso, erro de credencial, pagamento pendente (variações de `/app/login` e `/app/primeiro-acesso/:token`).
- **Card de módulo**: concluído (✓), em andamento, não iniciado (variações do card em `/app`).
- **Prova**: aprovado, reprovado (variações de `/app/prova/resultado`).
- **Prova, card na home**: bloqueada (até 16/16), desbloqueada, 2ª chamada liberada (variações do card em `/app`).

## Deep links de e-mail

Cada e-mail transacional (PRD seção 14) aponta para uma rota:

| E-mail | Destino |
|---|---|
| Boas-vindas + acesso (3) | `/app/primeiro-acesso/:token` |
| Reset de senha (4) | `/app/redefinir-senha/:token` |
| D+3 sem login (5) / D+14 inativo (7) | `/app` |
| Módulo concluído (6) | `/app` (ou próximo módulo) |
| Prova liberada (8) | `/app/prova` |
| Resultado da prova (9) | `/app/prova/resultado` |
| Certificado emitido (10) | `/app/certificado` |
| Pedido recebido (1) / cartão recusado (2) / carrinho abandonado (12 a 14) | checkout Guru (externo) |
| Reembolso confirmado (11) | sem destino de app (informacional) |

---
*Derivado do PRD.md em 17/jul/2026. Próximo documento: DESIGN.md.*

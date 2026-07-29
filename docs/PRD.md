# PRD: Estratégia Internacional (LP + Área do Aluno)

> Documento-raiz do projeto. As rotas (`ROUTES.md`) e o design (`DESIGN.md`) se derivam deste.
> Fonte primária: `referencias/cowork/IMPLEMENTACAO.md` (handoff v1.0, 09/jul/2026), designs finais em `referencias/htmls/` e fluxos em `referencias/fluxos-wireframes/documento-projeto.html`. Onde o design HTML diverge dos wireframes, vale o HTML.

## 1. Visão geral

**Estratégia Internacional** é uma formação on-demand em dolarização de patrimônio e investimento internacional, produzida pela **BlockTrends** com chancela institucional da **VEJA Negócios (Grupo Abril)**. O público é o investidor bancarizado brasileiro, sem experiência no mercado internacional, do zero ao avançado. O objetivo primário é **receita** (venda direta do curso), com a área do aluno servindo à entrega, à conclusão e à certificação.

O produto tem dois entregáveis num mesmo projeto Next.js: uma **LP de vendas pública** (rota `/`, SSG, tema claro) e uma **plataforma/área do aluno autenticada** (rotas `/app/*`, tema dark). Quatro pilares o sustentam:

1. **LP de conversão**: página de vendas editorial que leva o visitante da dor (corrosão do patrimônio em real) ao checkout, com autoridade dos docentes e chancela das marcas.
2. **Consumo do curso**: home em vitrine, player de vídeo com progresso automático, materiais por aula e por módulo.
3. **Prova e certificação**: prova final única que desbloqueia com 100% das aulas, gera certificado de 30h verificável.
4. **Suporte e recuperação**: canal único de WhatsApp para todo atendimento, mais pixels e sequências de e-mail para remarketing e recuperação de venda.

Os pilares são sequenciais na jornada (LP → compra → consumo → prova → certificado) e o suporte é transversal a todos.

### Premissas travadas

| Item | Decisão |
|---|---|
| Preço | R$ 397 à vista, ou até 10x sem juros de R$ 39,70 |
| Acesso | 1 ano a partir da compra |
| Prova | 20 questões, nota mínima 70%, 120 minutos, tentativa única, 2ª chamada liberada por admin |
| Conteúdo | Módulo 0 (boas-vindas, 1 aula) + 4 módulos de 4 aulas, 16 aulas avaliadas, 30h+ |
| Suporte | 100% WhatsApp (wa.me, sem API na v1) |
| Materiais | Apostila por módulo + e-book bônus. Sem minidocumentário, sem comunidade, sem gamificação, sem busca. Plataforma só dark no v1 (modo claro no backlog pós-launch, ver `BACKLOG.md`) |
| Lançamento | Setembro/2026. QA até fim de agosto |

## 2. LP de vendas

### Modelo

Página estática única, de rolagem longa, tema claro off-white com faixas verdes profundas nos momentos de peso (hero, oferta, fechamento). Tom editorial, não infoproduto: educa antes de vender. O conteúdo renderizado existe no HTML no carregamento (SSG) para SEO. Todos os caminhos de conversão levam ao mesmo checkout externo (Guru).

### Estrutura (topo → base)

Ordem aprovada no design final (`referencias/htmls/LP-Estrategia-Internacional.html`):

| Âncora | Seção | Conteúdo |
|---|---|---|
| topbar | Topbar fixa | Olho + wordmark, navegação (Professores · Formação · Ferramentas · Idealizadores · FAQ), ENTRAR, INSCREVA-SE (caixa alta). Hambúrguer no mobile |
| `#hero` | Hero | Fundo com globo 3D pontilhado em canvas (litoral do Natural Earth, massa de terra realçada, praças financeiras em anel sonar com rotas Brasil→EUA/Europa, gira/inclina seguindo o mouse), headline "Seu patrimônio não devia depender de um só país", subtítulo com o peso dos 4 especialistas ("...método de dolarização de quem operou por dentro do Banco Central, da XP, da Caixa e do Bradesco"), CTA "DOLARIZE COMO OS GRANDES", trigger "Acesso imediato após a compra · garantia de 7 dias", VSL 16:9 configurável |
| `#ficha` | Ficha técnica | Faixa contínua: 30h+ · 4 especialistas · On-demand · Certificado com chancela institucional VEJA Negócios (célula invertida, ver §8 sobre a redação) · {{ preco }} |
| `#diagnostico` | O Diagnóstico | 3 atos interativos: O problema (A corrosão) · A urgência (O custo de esperar) · A resposta (A saída tem método). O ato ativo/hover inverte para verde |
| `#docentes` | Corpo Docente | 4 cards com chip de módulo, foto P&B que colore no hover, rodapé com as logos mono off-white das casas onde o professor atuou (balão flutuante com o nome no hover). Carrossel com snap no mobile |
| `#formacao` | A Formação | 4 acordeões (I a IV), 16 aulas numeradas 01 a 16, cada uma com descrição completa dos assuntos abordados. Linha de fechamento consolida apostila, ferramentas (calculadora e e-book) e certificação |
| `#entregaveis` | Ferramentas | "O que fica com você depois da última aula": lista editorial (apostilas, e-book, calculadora de dolarização) à esquerda, mockup de dispositivos à direita. Substituiu a seção "A Diferença" (removida em 21/jul) |
| `#chancela` | Quem Assina | Selo Meridiano + 2 cards: BlockTrends (chancela técnica, pioneirismo ancorado na ANCORD) × VEJA Negócios (chancela institucional, Grupo Abril desde 1950, logos de VEJA/Super/Grupo Abril) |
| `#oferta` | Oferta | Card com glow dourado animado, H2 "Um pagamento, um ano para aplicar", lista "você recebe" (6 itens), {{ preco }} / {{ parcelas }}, CTA "GARANTIR MINHA VAGA", selos (compra segura, 7 dias, acesso imediato) |
| `#faq` | FAQ | 8 perguntas (ver abaixo) |
| `#cta-final` | CTA final + footer | Wordmark, "Investir no mundo é proteger o que você constrói", CTA "DOLARIZE COMO OS GRANDES" (mesmo comando do hero, âncora para `#oferta`), footer alinhado à VEJA Negócios (nav espelhando a topbar, Termos, LGPD, Suporte no WhatsApp, razão social Abril Comunicações S.A.) |

**Persistentes e configuráveis** (variáveis de template, injetáveis sem deploy): `{{ preco }}` (default R$ 397), `{{ parcelas }}` (default "10x de R$ 39,70 sem juros"), `showVsl` (VSL no hero, fallback imagem), `showWhatsapp` (botão flutuante).

**Lista "você recebe" (Oferta):** formação completa (4 módulos, 16 aulas) · certificado de 30h, com prova e código de verificação · apostila de cada um dos módulos · ferramentas de apoio (calculadora de dolarização e e-book exclusivo) · 1 ano de acesso, contado da compra · suporte humanizado.

**Corpo docente e currículo** (fechados no design):

| Módulo | Docente | Credencial | Aulas |
|---|---|---|---|
| I · Macro e Estratégia Global | Rodolfo Bastos | Ex-CEO XP Investimentos EUA | 01 Por que a dolarização · 02 Dólar como reserva de valor · 03 Conta internacional na prática · 04 Carteira global e perfil |
| II · Renda Fixa e Ações nos EUA | Tony Volpon | Ex-diretor Banco Central | 05 Tesouro americano · 06 Crédito privado internacional · 07 Comprando ações nos EUA · 08 Dividendos vs. growth |
| III · Como Acessar o Mercado Americano (chip do card: "Mercado dos EUA") | Luiz Fernando Roxo | Especialista em Opções, 25 anos | 09 ETFs · 10 REITs · 11 BDRs · 12 Tributação e sucessão internacional |
| IV · Ativos Digitais: Exposição Alternativa em Dólar | Alexandre Ywata | Ex-VP Caixa, CRO QR Asset | 13 Bitcoin e Ethereum · 14 Tokens, RWA e ecossistema · 15 ETFs e análise on-chain · 16 Tributação de criptoativos |

> **Módulo IV — tema aberto (24/jul/2026):** o módulo deixou de se chamar "Criptoativos" e passou a "Ativos Digitais", para caber mais que cripto (ETFs temáticos de setores da economia real, tokenização). A aula 15 virou "ETFs e análise on-chain" e a descrição fala em "ETF temático, seja de ativos digitais ou de um setor específico da economia global", sem nomear setor. **As quatro aulas listadas continuam sendo de cripto**: quando o conteúdo real do módulo abrir para outros temas, o currículo precisa acompanhar o nome.

**FAQ (8 perguntas):** iniciante sem experiência · precisa de conta no exterior · tempo de acesso (1 ano) · como funciona o certificado · e se reprovar (2ª chamada WhatsApp) · garantia (7 dias CDC) · aulas ao vivo (não, gravadas) · suporte (WhatsApp).

### Regras

| Regra | Valor |
|---|---|
| CTAs de compra | Todos apontam para a URL do checkout Guru |
| "Entrar" / "Área do aluno" | Aponta para `/app/login` |
| Âncoras do menu | Rolagem suave para as seções |
| Renderização | HTML renderizado no build (SSG), sem depender de JS para o conteúdo indexável |
| Imagens | Assets do bundle convertidos para WebP, teto de 200 KB cada |
| Pixels | Meta Pixel + GA4/Google Tag instalados no dia 1, mesmo sem mídia paga |
| Performance | Lighthouse ≥ 90 em performance e SEO |

**Eventos de pixel:**

| Evento | Disparo |
|---|---|
| PageView | Carregamento da LP |
| ViewContent | Scroll atingindo seções-chave |
| InitiateCheckout | Clique em qualquer CTA de compra |
| Purchase | Página de obrigado (`/obrigado`) |

### Edge cases

- **Parcelamento**: 10x sem juros de R$ 39,70 (10 × 39,70 = 397, igual ao à vista em valor total, só dividido). Válido para publicar, o antigo risco de "parcelado mais barato que o à vista" não se aplica.
- **VSL indisponível**: `showVsl=false` cai para imagem de apresentação, sem quebrar o layout do hero.
- **Sem WhatsApp configurado**: `showWhatsapp=false` remove o botão flutuante sem deixar rastro.
- **JS desligado**: conteúdo e CTAs permanecem visíveis e funcionais (links diretos).

### Pontos a definir

- Título do e-book bônus (hoje "Título A Definir" no design).
- Confirmação do domínio de produção (o certificado referencia `estrategiainternacional.com/verificar`).
- Redação final da chancela institucional da VEJA Negócios (ver §8): direção recomendada definida, aval do jurídico/Grupo Abril pendente.
- Links reais das redes sociais do rodapé (Instagram, YouTube, LinkedIn seguem `href="#"`).

> **Nota de escopo (17/jul/2026):** o **kicker de marcas no hero** (chancela VEJA Negócios × BlockTrends na primeira dobra) foi **aprovado para inclusão**, alterando o design final atual, que trazia a chancela apenas em Quem Assina e no footer. Racional: reforçar autoridade logo na primeira dobra.

## 3. Aquisição, checkout e ativação

### Modelo

O visitante clica num CTA e vai para o **checkout externo do Guru** (Digital Manager Guru + Pagar.me, já contratado). O pagamento aprovado dispara um **webhook** que cria a conta, o enrollment e o e-mail de boas-vindas. A LP e a plataforma nunca processam pagamento; apenas reagem ao estado que o Guru informa.

### Estrutura (fluxo 1 do documento de fluxos)

LP → CTA → Checkout Guru (nome, e-mail, CPF, WhatsApp, pagamento) → status do pagamento → página de obrigado (`/obrigado`) → webhook cria conta → e-mail de boas-vindas com link → login e definição de senha → aluno ativado.

### Regras

| Situação | Comportamento |
|---|---|
| Pagamento aprovado (cartão/PIX) | Webhook cria `user` + `enrollment` (status active, `expires_at` = compra + 1 ano) + e-mail de boas-vindas com link de definição de senha |
| Pagamento recusado | Tela de erro do checkout com retry e opção PIX |
| Boleto / PIX pendente | E-mail com código de pagamento e lembrete em 24h; acesso liberado só na compensação |
| Reembolso (7 dias CDC) ou chargeback | Webhook muda `enrollment.status` para revoked, encerra acesso, e-mail de confirmação |
| Assinatura do webhook | Validar sempre. Rejeitar payload sem assinatura válida |
| Idempotência | Dedupe por `guru_order_id`; reentrega do mesmo evento não duplica conta nem e-mail |

### Edge cases

- **Webhook reentregue**: mesmo `guru_order_id` processado duas vezes não cria segunda conta (idempotência obrigatória, testada no QA).
- **E-mail de boas-vindas não chega**: página de obrigado e WhatsApp oferecem reenvio de acesso.
- **Compra com e-mail já existente**: associar ao usuário existente em vez de criar duplicado (verificar por e-mail além do `guru_order_id`).
- **Boleto/PIX que nunca compensa**: entra no fluxo de remarketing público C; não cria conta.
- **Chargeback após acesso liberado**: suspende na hora; tratativa comercial via WhatsApp pode restaurar.

### Pontos a definir

- Formato exato do payload do Guru e do segredo do webhook (PH providencia docs e secret).
- Se a sequência de carrinho abandonado é nativa do Guru ou disparada por cron próprio (ver seção 12).

## 4. Cadastro, identidade e acesso

### Modelo

Não há cadastro aberto: a conta nasce da compra. O aluno recebe o acesso por e-mail e define a senha no primeiro login. Reentrada por e-mail e senha. Dois papéis: **aluno** e **admin** (equipe interna).

### Estrutura

- **Identidade**: Supabase Auth (e-mail + senha). Perfil com nome, telefone, `guru_customer_id`.
- **Enrollment**: vínculo do aluno com o curso, com status e validade.
- **Estados de acesso**: active, revoked (reembolso/chargeback), expired (pós 1 ano).

### Regras

| Regra | Valor |
|---|---|
| Origem da conta | Somente via webhook de compra aprovada |
| Primeiro acesso | Link do e-mail de boas-vindas leva a definir senha |
| Política de senha | Mínimo de **8** caracteres, com ao menos uma letra maiúscula, uma minúscula e um número (decidido em 28/jul/2026; o mínimo nasceu 6 e subiu para 8 no mesmo dia). Vale igual nas duas portas que criam senha: primeiro acesso e redefinição. Validador único em `lib/senha.ts`, aplicado no cliente e no servidor |
| Validade | `expires_at` = `purchased_at` + 1 ano |
| Aviso de expiração | E-mail 30 dias antes do vencimento |
| Pós-expiração | Tela de renovação (contato via suporte) |
| Troca de e-mail | Não é self-service na v1; feita pelo suporte com validação |

### Edge cases

- **Login com pagamento ainda em processamento**: mensagem específica "seu pagamento está em processamento" (boleto/PIX levam até 1 dia útil), nunca erro genérico de credencial.
- **Credencial incorreta**: mensagem clara com atalho para redefinição de senha.
- **Acesso expirado**: bloqueia o conteúdo e mostra tela de renovação, sem apagar o progresso.
- **Reembolso durante o curso**: status revoked encerra o acesso imediatamente.

### Pontos a definir

- Política de retenção do progresso após expiração ou revogação (manter para eventual renovação?).

## 5. Home (vitrine)

### Modelo

A home é uma **vitrine** (padrão validado na auditoria do CCA/Cademi), não um dashboard denso. Banner de retomada no topo, seguido de prateleiras horizontais de módulos e de materiais/certificação, com a estética do brand (gravuras nos cards, Playfair).

### Estrutura

- **Banner hero**: vídeo de boas-vindas; com progresso existente, overlay "Continue de onde parou → Módulo X · Aula Y" e CTA de retomada.
- **Prateleira 1 — A Formação**: cards de Módulo 0 (Bem-vindo) a IV, cada um com arte, contador de progresso (ex.: 2/4) e estado (concluído ✓, em andamento, não iniciado).
- **Prateleira 2 — Materiais e Certificação**: Apostilas (1 por módulo), E-book bônus, Prova Final (bloqueada até 16/16), e card de 2ª chamada (oculto até liberado pelo admin).

### Regras

| Elemento | Regra |
|---|---|
| Banner de retomada | Aparece só quando há progresso; aponta para a última aula não concluída |
| Contador do módulo | X/N aulas concluídas; ✓ quando N/N |
| Prova Final | Card sempre visível como meta, bloqueado até 16/16 aulas avaliadas concluídas |
| Card de 2ª chamada | Oculto por padrão; renderiza apenas se o admin liberou a tentativa 2 para aquele aluno |
| Módulo 0 | Conta como concluído com sua única aula (primeiro ✓ fácil), não entra no gate de 16/16 |

### Edge cases

- **Aluno recém-ativado sem progresso**: banner mostra convite ao Módulo 0 / Aula 1, sem overlay de retomada.
- **Todas as 16 concluídas**: Prova Final desbloqueia e ganha destaque; banner passa a apontar para a prova.
- **E-book ainda sem título definido**: card renderiza com placeholder até o título ser definido.

### Pontos a definir

- Arte final (gravuras) de cada módulo, dependente de entrega de design.

## 6. Consumo de aula

### Modelo

Página da aula com player à esquerda (ou full-width) e sidebar de progresso à direita. O coração da plataforma. Player é o Panda Video (conta da casa), com retomada automática. Progresso avança sozinho pelo evento do player.

### Estrutura

- **Player**: Panda Video 16:9, retomada automática, controle de velocidade e qualidade.
- **Cabeçalho**: "Módulo X · Aula N de 16", título e descrição da aula.
- **Navegação**: Anterior / Concluir e próxima.
- **Materiais desta aula**: apostila do módulo, planilhas, resumo (download do Storage).
- **Sidebar de progresso**: "Meu progresso — X% · n de 16", módulos em acordeão com o estado de cada aula (✓ concluída, ▶ atual, pendente).

### Regras

| Regra | Valor |
|---|---|
| Conclusão automática | Aula concluída quando `watched_pct ≥ 90` (evento do Panda) |
| Conclusão manual | Botão "Concluir e próxima" também marca |
| Módulo concluído | Todas as aulas do módulo concluídas |
| Gate da prova | 16/16 aulas avaliadas (Módulos I a IV) concluídas |
| Retomada | Player retoma do ponto onde parou |
| E-mail de transição | Ao concluir um módulo, dispara o e-mail "módulo concluído" |

### Edge cases

- **Aluno assiste 90% e sai sem clicar em concluir**: marca como concluída pelo evento de progresso.
- **Marca manual sem assistir**: permitido (respeita autonomia); a conclusão vale.
- **Reassistir aula concluída**: não altera o estado nem duplica e-mail.
- **Evento do Panda não chega**: a marcação manual é o fallback; investigar no QA a confiabilidade do webhook do player.
- **Materiais de uma aula ainda não enviados**: seção de materiais some ou mostra "em breve", sem link quebrado.

### Pontos a definir

- Mapeamento final `panda_video_id` por aula (depende da entrega da edição, jul/ago; upload incremental).

## 7. Prova final e certificação

### Modelo

Prova única, reprobatória, que cobre os quatro módulos. Instruções com ciência das regras antes de iniciar; ao iniciar, um cronômetro de 120 minutos começa e não reinicia. Reprovado contata o suporte para a 2ª chamada, liberada manualmente pelo admin.

### Estrutura

- **Tela de instruções**: regras (20 questões, 70%, 120 min, tentativa única, 2ª chamada via suporte) + checkbox "estou ciente das regras e de que esta é uma tentativa única" + "Iniciar prova".
- **Tela da prova**: cronômetro visível, "Questão X de 20", barra "n respondidas", questão de múltipla escolha (4 alternativas), navegação anterior/próxima, "Enviar prova".
- **Tela de resultado**: dois estados (aprovado, reprovado), nota /100 e desempenho por módulo.

### Regras

| Regra | Valor |
|---|---|
| Nº de questões na prova | 20, sorteadas de um banco maior |
| Composição do sorteio | Balanceado por módulo: 5 questões de cada um dos 4 módulos (I a IV) |
| Tamanho do banco (meta v1) | ~100 questões (~25 por módulo, razão 5×). Piso aceitável para lançar: 60 (15 por módulo, razão 3×). Cresce com o tempo |
| Nota de aprovação | ≥ 70% |
| Duração | 120 minutos, cronômetro na tela |
| Início da contagem | Ao iniciar, grava `deadline` = agora + 120 min |
| Desbloqueio | 16/16 aulas avaliadas concluídas |
| Tentativas | 1 (attempt único). 2ª chamada liberada por admin |
| Submissão após deadline | Corrige apenas o que foi respondido |
| Pós-2ª reprovação | Caso a caso pelo suporte, sem fluxo automático |
| Snapshot | As 20 questões sorteadas para a tentativa são gravadas (`questions_snapshot`), para corrigir e auditar sempre contra o que o aluno viu |

> **Racional do banco (pesquisa psicométrica, 20/jul/2026):** a regra de ouro é que o banco tenha ao menos 2,5× o tamanho da prova (Haladyna & Rodriguez, 2013), e a prática robusta com controle de exposição fica em 3× a 6×. Para 20 questões, ~100 (5×) dá boa aleatoriedade e baixa memorização, mantendo cobertura igual dos 4 módulos via sorteio balanceado. Sortear 5 por módulo (em vez de 20 do bolo todo) garante que nenhuma prova saia concentrada num módulo só.

### Edge cases

- **Refresh ou queda no meio da prova**: não reinicia; o `deadline` persistido manda, retoma respostas já dadas.
- **Deadline estoura sem envio**: cron de verificação corrige o respondido e registra o resultado (ver seção 12).
- **Aluno fecha na tela de instruções**: nada é gravado; ainda não iniciou.
- **Empate na nota de corte (exatamente 70%)**: aprova (≥ 70%).
- **Admin libera 2ª chamada**: novo attempt disponível, novo snapshot de questões.

### Pontos a definir

- Nada em aberto de terceiros aqui. **O banco de questões é construção nossa, ponta a ponta**: a estrutura de funcionamento (motor de sorteio, snapshot, CRUD no admin) e as próprias questões, por módulo, até a meta de ~100. É trabalho de escopo, não pendência externa; não bloqueia o build (mecânica se desenvolve e testa com banco de exemplo, populado depois por nós).

## 8. Certificado

### Modelo

Peça de marca gerada em PDF na aprovação, com código único e página pública de verificação. Distribuível no LinkedIn.

### Estrutura

- **Preview** na tela: wordmark, olho, gravuras, nome do aluno, carga de 30h, assinaturas (BlockTrends como emissora, VEJA Negócios como chancela institucional cossignatária).
- **Ações**: baixar PDF, compartilhar no LinkedIn, avaliar a formação (NPS).
- **Código**: formato `EI-2026-XXXX`.
- **Verificação pública**: `/verificar/:codigo`.

> **Chancela da VEJA Negócios (direção recomendada, 20/jul/2026):** VEJA Negócios é marca editorial, não entidade certificadora (diferente da ANCORD no CCA, que dá nome à "Certificação de Criptoativos ANCORD"). Portanto **não usar "Certificação VEJA Negócios"**. O certificado é **emitido pela BlockTrends**, com a VEJA Negócios como **assinatura/chancela editorial** cossignatária (marca presente, sem se amarrar ao nome da certificação). Na LP, trocar "Certificação VEJA Negócios" por formulações como "certificado de 30h com chancela institucional VEJA Negócios" ou "assinado por BlockTrends e VEJA Negócios". A redação final depende do aval do jurídico/Grupo Abril.
>
> **Aplicação na área do aluno (25/jul/2026):** o card da Prova Final na home anunciava "Certificação VEJA Negócios" e passou a **"Certificado de 30 horas"**, nomeando o que o aluno recebe em vez de amarrar a certificação à marca da VEJA. O termo é provisório: fica para a rodada de revisão de copy antes do launch, junto com os nomes que assinam o certificado (ver `BACKLOG.md`).
>
> **Ajuste de nomenclatura (23/jul/2026):** "chancela **editorial**" passou a "chancela **institucional**" em toda a página, para separar melhor os dois papéis da seção Quem Assina: a BlockTrends assina a **técnica** e a VEJA Negócios, a **instituição**. O racional jurídico acima não muda (a VEJA continua não sendo certificadora). O rodapé só foi alinhado em 24/jul, quando a revisão geral pegou o "editorial" que tinha ficado para trás.

### Regras

| Regra | Valor |
|---|---|
| Emissão | Somente com prova aprovada (≥ 70%) |
| Carga | 30 horas |
| Código | `EI-2026-XXXX`, único |
| Verificação | Página pública `/verificar/:codigo` confirma validade e nome |
| Armazenamento | PDF no Storage, registro em `certificates` |

### Edge cases

- **Reemissão**: baixar de novo usa o mesmo código, não gera novo certificado.
- **Nome com caracteres especiais/acentuação**: PDF preserva ortografia correta.
- **Acesso a `/verificar` com código inexistente**: página informa "certificado não encontrado", sem vazar dados.

### Pontos a definir

- Nomes que assinam o certificado (hoje "nome a definir" no design).
- Se a verificação exibe data de conclusão e módulos, ou apenas nome e validade.

## 9. Minha conta

### Modelo

Tela mínima: dados, prazo de acesso e atalho de suporte. Cada campo a mais é um ticket de suporte a mais, então o escopo é enxuto de propósito.

### Estrutura

- **Dados**: nome, e-mail (alterar via suporte), trocar senha.
- **Acesso**: "acesso liberado por 1 ano", disponível até `{{ accessUntil }}`.
- **Suporte**: WhatsApp para acesso, pagamento, certificado e 2ª chamada.

### Regras

| Regra | Valor |
|---|---|
| Trocar senha | Self-service |
| Trocar e-mail | Via suporte (validação manual) |
| Prazo de acesso | Exibe `accessUntil` calculado do enrollment |

### Edge cases

- **Acesso expirado**: a tela ainda abre, mas o conteúdo do curso fica bloqueado com a via de renovação.

### Pontos a definir

- Se a exclusão de conta (LGPD) é botão self-service ou pedido via suporte (ver seção de compliance).

## 10. Suporte e recuperação

### Modelo

Canal único: **WhatsApp** (wa.me, sem API na v1). Visível na LP, nos e-mails, na plataforma e na tela de resultado da prova. Reembolso e chargeback são resolvidos pelo gateway, que revoga o acesso via webhook.

### Estrutura (fluxo 3 do documento de fluxos)

Cenários atendidos: esqueci a senha (self-service por e-mail) · não recebi acesso / trocar e-mail / dúvidas (WhatsApp, verificação pelo e-mail de compra) · 2ª chamada da prova (WhatsApp → admin libera) · reembolso em 7 dias (WhatsApp → gateway → webhook revoga) · chargeback (suspensão automática → tratativa comercial).

### Regras

| Cenário | Canal | Efeito |
|---|---|---|
| Esqueci a senha | Self-service | E-mail de redefinição |
| Não recebi acesso / dúvidas | WhatsApp | Atendimento humano |
| 2ª chamada | WhatsApp | Admin libera nova tentativa |
| Reembolso (7 dias) | WhatsApp | Gateway processa, webhook revoga, e-mail confirma |
| Chargeback | Automático | Suspensão imediata, tratativa comercial |

### Edge cases

- **Mensagem pré-preenchida**: os links de WhatsApp de contexto (2ª chamada, resultado) abrem com texto pré-montado identificando o aluno.
- **Aluno sem WhatsApp**: e-mail permanece como via de contato secundária.

### Pontos a definir

- Nenhum aberto. Link oficial de suporte definido: `https://api.whatsapp.com/message/W2USYZZK75FMC1` (short link click-to-chat, abre a conversa com a mensagem inicial já configurada). Usar como base dos CTAs de WhatsApp na LP, plataforma, e-mails e telas de resultado, acrescentando texto pré-preenchido por contexto quando fizer sentido.

## 11. Remarketing e pixels

### Modelo

Meta Pixel + Google Tag instalados no dia 1, mesmo sem mídia paga, para acumular audiências de graça. O visitante que não converte é classificado em públicos e recebe tratamento por e-mail (dados já capturados no checkout) e, quando houver mídia, anúncios.

### Estrutura (fluxo 4 do documento de fluxos)

| Público | Quem é | Recuperação |
|---|---|---|
| A | Visitou a LP e não clicou no CTA | Depende de captura de lead na LP (só relevante no cenário 100% orgânico) |
| B | Iniciou o checkout e abandonou | Sequência de e-mails +1h / +48h / +72h + WhatsApp se telefone capturado |
| C | Boleto/PIX gerado e não pago | Lembrete +24h com código + WhatsApp +48h para regenerar pagamento |

### Regras

- Público B e C funcionam com ou sem mídia paga, pois o checkout já capturou os dados.
- Público A depende de captura de lead; sem exit-intent no corte inicial (ver decisões), fica limitado ao clique orgânico em WhatsApp.

### Edge cases

- **Boleto/PIX que expira (público C)**: reclassifica como público B.
- **Compra após abandono**: exclui o usuário das audiências e o move para o fluxo de ativação.

### Pontos a definir

- **Captura de lead na LP (exit-intent)**: fora do corte inicial (ver decisões estratégicas). Sem ela, o público A orgânico é pouco recuperável. Reavaliar como fase 2.

## 12. Decisões estratégicas registradas

Escolhas difíceis feitas de propósito, com racional. Referência: §8 do handoff, mais as decisões desta rodada de blueprint.

- **Plataforma 100% própria (Next.js + Supabase), não Cademi/CCA**: o CCA serviu de auditoria de UX (vitrine, sidebar de progresso, prova com instruções), mas o build é próprio para controle total de marca, dados e regras.
- **Preço R$ 397 à vista, ou 10x sem juros de R$ 39,70 (20/jul/2026)**: o parcelado divide o mesmo valor total, então não cai no risco de sair mais barato que o à vista. Substitui o preço anterior de R$ 400 com parcelamento em aberto.
- **Suporte 100% WhatsApp, sem API na v1**: reduz custo e complexidade; menu "Dúvidas" é um `wa.me`.
- **Acesso por 1 ano**: equilibra percepção de valor e custo de hospedagem de vídeo.
- **Prova única com 2ª chamada manual via admin**: evita automação de exceção; pós-2ª reprovação é caso a caso.
- **Sem comunidade, sem gamificação, sem busca no v1**: escopo enxuto para lançar em setembro; cada recurso a mais é superfície de suporte e atraso. Gamificação avaliada e descartada por ser um produto direto ao ponto (a barra de progresso já dá o senso de avanço). **Modo claro na plataforma**: não descartado, movido para o backlog pós-launch (ver `BACKLOG.md`).
- **Módulo 0 de boas-vindas + home em vitrine**: primeiro ✓ fácil e navegação familiar, herdados da auditoria do CCA.
- **Kicker de marcas de volta ao hero (17/jul/2026)**: aprovado, reforça autoridade na primeira dobra; altera o design final que só trazia a chancela em Quem Assina.
- **Exit-intent fora do corte inicial (17/jul/2026)**: era um ensaio de captura para remarketing com base quente, mas não está aprovado nem amadurecido. Deixado de fora, registrado como candidato de fase 2. Consequência assumida: público A orgânico pouco recuperável no lançamento.
- **Copy livre no texto, estilo mantido (17/jul/2026)**: diferente de projetos anteriores, o texto pode ser reescrito à vontade, desde que siga o guia de estilo (sem travessão, tom editorial sóbrio, sem hype, números concretos).

## 13. Modelo de dados

Postgres gerenciado (Supabase). Acesso a dado sensível protegido por RLS. Leituras de tela consolidadas em uma RPC por página quando possível.

| Tabela | Campos principais |
|---|---|
| `users` (Supabase Auth) + profile | nome, telefone, `guru_customer_id` |
| `enrollments` | `user_id`, status (active/revoked/expired), `purchased_at`, `expires_at` (+1 ano), `guru_order_id` |
| `modules` | `ord` (0 a 4), titulo, docente, arte |
| `lessons` | `module_id`, `ord` (1 a 16 + aula 0), titulo, descricao, `panda_video_id`, duracao |
| `materials` | `lesson_id` ou `module_id`, tipo (apostila/planilha/resumo/ebook), arquivo (Storage) |
| `progress` | `user_id`, `lesson_id`, status (started/completed), `watched_pct`, `completed_at` |
| `exams` | `user_id`, attempt (1/2), status (available/in_progress/submitted), score, `started_at`, `deadline` (+120 min), `questions_snapshot` |
| `questions` | `module_id`, enunciado, alternativas[4], correta, ativo |
| `certificates` | `user_id`, codigo (`EI-2026-XXXX`), `issued_at`, pdf (Storage) |
| `email_log` | `user_id`, template, `sent_at`, status |

## 14. E-mails transacionais

14 templates via Amazon SES (a configurar, iniciar warm-up do domínio com SPF/DKIM/DMARC imediatamente). Template base no brand (logo clara, fundo claro, CTA dourado). Copy segue o guia de estilo. Spec detalhada de cada e-mail está no `FLUXO-v1.md` (documento referenciado, ainda não trazido ao repo, ver pendências).

> **Correção de rota de envio (28/jul/2026): dois caminhos, não um.** Os e-mails **3** e **4**
> desta tabela não saem pelo nosso código: eles são emitidos pelo **Supabase Auth**, com o
> template configurado no painel do projeto, e viajam pelo SMTP do Supabase. O link do 3 é o
> convite (`type=invite`) e o do 4 é a recuperação (`type=recovery`); os dois caem no route
> handler `/auth/confirm`, que troca o `token_hash` por sessão. Ver a nota de implementação do
> `ROUTES.md`.
>
> Em homolog esse SMTP é o **Resend**, configurado em 28/jul e validado com entrega real, para
> não depender da decisão do domínio de produção. O SES segue previsto para os outros doze, que
> são disparados por nós, e para o remetente definitivo. Detalhe por ambiente no `AMBIENTES.md`.

| # | E-mail | Gatilho |
|---|---|---|
| 1 | Pedido recebido (PIX/boleto pendente) | Checkout com pagamento pendente |
| 2 | Recuperação de cartão recusado | Pagamento recusado |
| 3 | Boas-vindas + acesso | Compra aprovada (link de senha) |
| 4 | Reset de senha | Pedido de redefinição |
| 5 | D+3 sem login | Cron |
| 6 | Módulo concluído | Transição de módulo |
| 7 | D+14 inativo | Cron |
| 8 | Prova liberada | 16/16 aulas concluídas |
| 9 | Resultado da prova | Envio da prova (aprovado/reprovado + orientação de 2ª chamada) |
| 10 | Certificado emitido | Aprovação (PDF anexo) |
| 11 | Reembolso confirmado | Webhook de reembolso |
| 12 a 14 | Carrinho abandonado +1h / +48h / +72h | Guru nativo, ou cron próprio |

## 15. Rotinas agendadas

Edge functions agendadas por `pg_cron`, cadência proporcional à volatilidade.

| Rotina | Cadência | Ação |
|---|---|---|
| D+3 sem primeiro login | Diária | E-mail 5 |
| D+14 sem atividade | Diária | E-mail 7 |
| Aviso de expiração (−30d) | Diária | E-mail de aviso |
| Expiração de enrollment | Diária | Muda status para expired |
| Prova com deadline estourado | Frequente | Corrige o respondido e registra resultado |

## 16. Admin

Painel interno em `/admin`, acesso role-based (papel admin).

- **Alunos**: lista e busca, detalhe com progresso e tentativas.
- **Ações por aluno**: reenviar acesso, trocar e-mail, **liberar 2ª chamada**, revogar ou estender acesso.
- **Prova**: CRUD das questões por módulo.
- **Métricas**: alunos, taxa de conclusão, taxa de aprovação, NPS.
- **Log de e-mails**: leitura do `email_log`.

## 17. Arquitetura e performance

Stack: Next.js (App Router, React Server Components) + Supabase (Auth, Postgres, Storage) + deploy **Netlify** (conta que o time já mantém), funções na mesma região do banco. LP em `/` (SSG); plataforma em `/app` (server-rendered).

> **Nota de escopo (17/jul/2026):** deploy trocado de Vercel para **Netlify** (conta existente do time, um vendor e um custo a menos). O runtime Next do Netlify cobre App Router, RSC, SSG e SSR. As funções rodam em AWS (us-east-1 por padrão); o Supabase é provisionado na mesma região para preservar a regra de um roundtrip.

Integrações: **Panda Video** (vídeo e eventos de progresso), **Amazon SES** (e-mail), **Guru + Pagar.me** (checkout e webhook), **WhatsApp** (wa.me).

Regra de ouro de performance (herdada do default da casa): **uma página é um roundtrip ao banco**. Cada tela busca seus dados numa RPC consolidada; a regra de negócio (progresso, ranking de módulo, correção da prova) fica em JS, não no SQL. Shell aparece na hora, pedaços dependentes de dado entram em suspense com skeleton. LP com Lighthouse ≥ 90.

Custo fixo estimado: R$ 340 a 500/mês (detalhe no `plataforma-propria.html`, referenciado).

## 18. Copy e internacionalização

- **Idioma**: português do Brasil, sem i18n na v1.
- **Guia de estilo (obrigatório)**: tom editorial sóbrio; **proibido o caractere de travessão** (usar vírgula, dois-pontos ou ponto); sem hype ("incrível", "revolucionário"); sem "regra de três" formulaica; frases de comprimento variado; voz ativa; números concretos. Emojis: apenas ✓ e ícones de UI.
- **Copy é livre no texto**: qualquer texto pode ser reescrito, desde que siga o guia acima. Todo copy novo (e-mails, microcopy, estados vazios, erros) segue as mesmas regras.

## 19. QA e critérios de aceite (gate de lançamento)

- [ ] Compra real de teste (cartão + PIX) → conta criada → e-mail chega → login → assiste → conclui → prova → reprova forçada → 2ª chamada liberada no admin → aprova → certificado PDF + verificação pública.
- [ ] Reembolso de teste revoga acesso; webhook reentregue não duplica conta.
- [ ] Timer da prova expira e corrige parcial; refresh não reinicia.
- [ ] Progresso Panda ≥ 90% marca sozinho; retomada de vídeo funciona.
- [ ] Mobile: vitrine com snap, hambúrguer, player e prova utilizáveis.
- [ ] LP: Lighthouse ≥ 90; pixels disparando os 4 eventos.
- [ ] E-mails: SPF/DKIM/DMARC pass, chegada na inbox (Gmail/Outlook), não spam.
- [ ] LGPD: consentimentos, política de privacidade, exclusão de conta via suporte.

## 20. Pendências externas (PH cobra)

credenciais (Supabase, Netlify, domínio/DNS, Panda API key, Guru secret + docs, AWS SES) · redação final da chancela editorial VEJA Negócios com jurídico/Abril · título do e-book · nomes de assinatura do certificado · fotos em alta se o design das telas internas pedir · docs de apoio a trazer ao repo (`FLUXO-v1.md`, `COPY.md`, `CD-BRIEF-plataforma.md`, `plataforma-propria.html`, `ANOTACOES-CADEMI.md`).

Resolvidos nesta rodada (20/jul): preço e parcelamento (R$ 397 / 10x sem juros), link de WhatsApp do suporte, banco de questões sorteado (20 de ~100 balanceadas por módulo), direção da chancela VEJA.

---
*Gerado via skill blueprint-projeto em 17/jul/2026, a partir de IMPLEMENTACAO.md v1.0, designs finais (LP e Área do Aluno) e documento de fluxos v1.0. Próximo documento: ROUTES.md.*

# Backlog pós-launch — Estratégia Internacional

Ideias e itens deliberadamente fora do v1, para reavaliar depois do lançamento (set/2026). Nada aqui bloqueia o build. Cada item entra com o motivo de ter ficado de fora e o gatilho para reconsiderar.

| Item | Por que ficou de fora do v1 | Quando reavaliar |
|---|---|---|
| **Modo claro na plataforma** | Plataforma nasce dark-only (identidade premium, menos superfície de QA). Não descartado, só adiado. | Pós-launch, se houver pedido de aluno ou ganho claro de conforto de leitura. Ver `DESIGN.md` (o Meridiano já tem a família de tokens clara da LP, então o custo de adicionar é baixo) |
| **Exit-intent / captura de lead na LP** | Não estava aprovado nem amadurecido; era ensaio de remarketing com base quente. | Fase 2, se entrar mídia paga ou se o público A orgânico virar prioridade (ver `PRD.md` §11 e decisões) |
| **WhatsApp API oficial** | v1 usa `wa.me`/short link, sem API, a custo zero. | Se o volume de atendimento justificar automação (ver `PRD.md` §10) |
| **Selo de conclusão de módulo** | Micro-recompensa para deixar a plataforma mais viva: um selo/medalha discreta (na estética gravura do Meridiano) ao concluir cada módulo, aparecendo no card da vitrine e talvez no e-mail de "módulo concluído". Ideia aprovada para conversar. | Pós-launch, ou já no polish da S5 se couber sem atrasar. Conversar o desenho (onde aparece, se é só visual ou soma a um "mural de conquistas") |
| **Gamificação (além do selo)** | Produto direto ao ponto; a barra de progresso já dá senso de avanço. Mecânicas maiores (pontos, ranking, streak) descartadas. | Só se surgir uma mecânica com propósito real, não gamificação por enfeite |
| **Nomenclatura da certificação** | Aparece "Certificação VEJA Negócios" no card da Prova Final (home) e no certificado, mas VEJA Negócios é chancela editorial cossignatária — quem emite é a BlockTrends. Ajuste de copy/marca, não bloqueia o build. | Rodada de revisão de copy/marca antes do launch. Definir o termo correto (ex.: chancela dupla ou "Certificação BlockTrends") e ajustar `home.html` + `certificado.html` |
| **Nomenclatura da chancela na LP + selo (seção "Quem assina")** | A seção virou 2 cards (BlockTrends = chancela *técnica*; VEJA = *institucional*) e o selo circular voltou com "CHANCELA INSTITUCIONAL". Mas o termo da VEJA **não está batido**: "editorial" foi descartado (enganoso — a VEJA não edita o conteúdo, quem faz é a BlockTrends). Alternativas: "institucional", "de credibilidade", ou abandonar "chancela X/Y" por papéis ("Quem assina / Quem ensina"). | Rodada de copy/marca (junto do item acima). Ao decidir, re-gravar o texto do `public/lp/selo-veja.svg` (arco superior) **e** o kicker do card VEJA no `scripts/port-lp.mjs` (bloco 7k). |

> Este arquivo é o estacionamento de ideias. Ao promover um item para desenvolvimento, mover a decisão para o `PRD.md` (com racional) e remover daqui.

# Abril — Estratégia Internacional

Projeto: **Landing Page + Área de Membros** do curso.

Base: projeto do cowork (fluxos) + design já montado em HTML.

> **Retomando o projeto, ou abrindo em outra máquina?** Leia
> [`docs/HANDOFF.md`](docs/HANDOFF.md) primeiro. Ele tem o estado atual, o que precisa ser
> transferido por fora do git (segredos e insumos brutos), o setup no macOS e as
> armadilhas conhecidas.

## Onde colocar os docs

Cole os arquivos de entrada nas pastas abaixo.

| Pasta | O que vai aqui |
|---|---|
| `referencias/htmls/` | **Fonte de verdade do visual.** Os `.html` do design da LP e da área de membros (mais atualizados que os wireframes). |
| `referencias/fluxos-wireframes/` | O doc com fluxos e wireframes. Os fluxos valem; os wireframes são referência histórica — onde divergirem dos HTMLs, **vale o HTML**. |
| `referencias/cowork/` | Qualquer outro material do cowork: regras de negócio, jornada do aluno, estrutura do curso. |

## Regras deste projeto

- **Visual:** onde HTML e wireframe divergirem, o HTML manda.
- **Copy:** liberdade total — nada é imutável, pode reescrever à vontade.

Assim que os docs estiverem no lugar, me avisa que eu leio tudo e a gente segue pra fundação do projeto (PRD, rotas e design system) e a implementação.

## Fundação (gerada em 17/jul/2026 via skill blueprint-projeto)

| Doc | Conteúdo |
|---|---|
| `docs/PRD.md` | Especificação completa: 20 seções, features arquitetadas, regras em tabela, edge cases, decisões estratégicas, modelo de dados, e-mails, crons, admin, QA. |
| `docs/ROUTES.md` | Mapa de telas por estado de acesso (LP/conversão, área do aluno pré/pós-sessão, admin) + deep links de e-mail. |
| `docs/DESIGN.md` | Design system "Meridiano": tokens exatos, patterns com código, anti-slop checklist e lista negra. |
| `docs/BACKLOG.md` | Itens fora do v1 para reavaliar pós-launch (modo claro, exit-intent, WhatsApp API, gamificação). |
| `docs/AMBIENTES.md` | Estratégia de ambientes (local, homolog, produção), deploy Netlify e checklist de provisionamento. |
| `docs/apresentacao-stack.html` | Apresentação do arcabouço ferramental para o time (também publicada como artifact). |

## Continuidade (25/jul/2026)

| Doc | Conteúdo |
|---|---|
| `docs/HANDOFF.md` | **Documento de continuidade.** Estado real, o que não vem no clone, setup no macOS, armadilhas e decisões fechadas. |
| `docs/memoria-claude/` | Cópia de transporte da memória do Claude Code deste projeto, com o procedimento para reinstalar em outra máquina. |
| `docs/COPY.md` | Diretriz anti-slop de escrita. Obrigatória em qualquer copy, rodada sobre o texto final. |
| `docs/PENDENCIAS-LP.md` | Checklist vivo do que falta antes do "pronto para produção". O bloco "▶ PRÓXIMA SESSÃO" no topo é a fila de trabalho ordenada. |
| `docs/FEEDBACK-UX.md` | Mapa de feedback ao usuário: tela por tela, onde o aluno precisa de resposta do sistema, o que já existe e o que falta, com prioridade. |

## Histórico de mudanças

Todas as mudanças relevantes ficam registradas em [`CHANGELOG.md`](CHANGELOG.md).

## Estrutura

```
abril-estrategia-internacional/
├── LEIA-ME.md            ← este arquivo
├── docs/                 ← fundação (PRD, ROUTES, DESIGN)
└── referencias/
    ├── htmls/            ← design atualizado (fonte de verdade visual)
    ├── fluxos-wireframes/← doc de fluxos + wireframes (histórico)
    └── cowork/           ← handoff (IMPLEMENTACAO.md) + assets
```

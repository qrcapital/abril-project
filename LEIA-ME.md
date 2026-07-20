# Abril — Estratégia Internacional

Projeto: **Landing Page + Área de Membros** do curso.

Base: projeto do cowork (fluxos) + design já montado em HTML.

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

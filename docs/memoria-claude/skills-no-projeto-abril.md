---
name: skills-no-projeto-abril
description: "No projeto Abril, a única skill que o Pedro invoca é a impeccable; as skills de taste ficam para outros projetos."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6cfa15f0-2ade-445a-b691-618fbc63a8c2
  modified: 2026-07-25T23:24:42.026Z
---

Dentro do projeto Abril (Estratégia Internacional), a única skill a ser usada é a
**impeccable**. As 13 skills do pacote `Leonxlnx/taste-skill` (`gpt-taste`,
`high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `brandkit`,
`design-taste-frontend`, `redesign-existing-projects` e as demais) foram instaladas em
25/jul/2026 no perfil (`~/.agents/skills`, com symlink em `~/.claude/skills`), de propósito,
para servirem a outros projetos. Elas chegaram a cair na árvore do repo e foram retiradas
de lá a pedido dele.

**Why:** o projeto tem design system fechado, o Meridiano, com paleta travada, teto de
radius em 14px, dial de motion baixo e lista negra de slop no `docs/DESIGN.md`. Skill de
taste injeta diretriz visual própria e briga com isso: a `gpt-taste`, por exemplo, impõe
GSAP ScrollTrigger, bento grids e randomização de layout, tudo contra as regras da casa.

**How to apply:** não sugerir nem invocar as skills de taste em nada deste repositório.
Impeccable é aceita, inclusive porque os hooks dela já rodam sozinhos aqui
(`.claude/settings.local.json`, PostToolUse em Edit/Write e um passe no Stop). Em outros
projetos do Pedro as taste skills estão disponíveis normalmente. Ver
[[projeto-abril-estrategia-internacional]] e [[ambiente-mac-abril]].

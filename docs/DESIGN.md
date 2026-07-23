# DESIGN.md — Meridiano

Design system da Estratégia Internacional. Deriva das telas em `ROUTES.md` e dos designs finais em `referencias/htmls/`. Os HTMLs finais e os tokens do handoff (`IMPLEMENTACAO.md` §2) são a fonte de verdade: **quando este documento divergir do código real, o código vence**, e o doc é atualizado no mesmo PR que muda tokens ou patterns.

## 1. Identidade

**Nome do sistema: Meridiano.** O curso vende a tese de que "sua liberdade financeira começa pela geografia": tirar o patrimônio de uma moeda só. O meridiano é a linha que organiza o mundo; o sistema visual traduz isso em rigor editorial, ouro e verde profundo, gravura clássica.

**Vibe references:**
- Publicação de negócios impressa (VEJA Negócios, The Economist) pelo rigor tipográfico serifado.
- Private banking / relatório de wealth management pela sobriedade e o par verde-escuro + dourado.
- Gravura em aço de cédula ou certificado antigo (o olho, as ilustrações de módulo).
- Plataforma de curso premium (tema escuro, cards vitrine) para a área do aluno.

**Dial values:**
- **Variância de design:** média. Componentes consistentes, mas o hero, a oferta e o certificado podem quebrar o padrão com intenção.
- **Intensidade de motion:** baixa. Transições de 0.2s a 0.4s, um único elemento pulsante (glow da oferta). Nada de parallax ou entrada exagerada.
- **Densidade visual:** média-baixa. Respiro editorial, faixas amplas, nunca dashboard denso.

**Modo de cor (travado):**
- **LP (`/`, público):** apenas claro. Fundo off-white com faixas verdes profundas nos momentos de peso.
- **Plataforma (`/app/*`):** apenas escuro. Verde profundo único, sem toggle, sem modo claro.
- Sem `prefers-color-scheme`: cada superfície tem seu modo fixo.

## 2. Tokens

### Cores

Paleta fechada. Acento único: **dourado**, com disciplina de variar a intensidade (gold / gold-dark / gold-lit / gold-soft) em vez de introduzir cor nova. Verde é a família de fundo; nunca usar cor fora desta tabela.

| Token | Hex | Uso |
|---|---|---|
| `--verde` | `#0B2D20` | Fundo primário dark, faixas da LP, CTAs secundários |
| `--verde-2` | `#123B2B` | Variação de fundo |
| `--verde-3` | `#0A2B1E` | Fundo mais profundo (topbars, base da plataforma) |
| `--verde-card` | `#0F3526` | Cards da plataforma |
| `--offwhite` | `#F7F5F2` | Fundo claro (LP), texto sobre verde |
| `--bege` | `#EDE6DD` | Superfícies claras secundárias, réguas |
| `--areia` | `#D6C3C2` | Bordas em fundo claro |
| `--pedra` | `#8F887E` | Texto secundário claro |
| `--grafite` | `#333333` | Texto principal em fundo claro |
| `--medio` | `#6D6D6D` | Texto secundário em fundo claro |
| `--gold` | `#A98E4E` | Acento primário, CTAs |
| `--gold-dark` | `#7E6836` | Texto dourado sobre claro (links) |
| `--gold-lit` | `#D9BE85` | Dourado sobre escuro |
| `--gold-soft` | `#F0E9D8` | Fundos de chip/badge claros |
| `--wpp` | `#1FA855` / `#25D366` | Botões WhatsApp (`#25D366` no design das telas) |
| `--muted` | `#8FA398` | Texto sobre verde |
| `--muted2` | `#A9B8AE` | Texto secundário sobre verde |

Regra de acento: um só destaque por bloco. O dourado marca o que importa (CTA, número, kicker ativo). Para hierarquia, variar intensidade do dourado, nunca somar uma segunda cor de destaque. Vermelho (`#b0413e`) existe só para estado de erro/reprovação, nunca decorativo.

### Tipografia

Duas famílias, self-hosted em produção (woff2 já no bundle):

- **Playfair Display** (500/600/700 + itálico 500/600): títulos, números de destaque, nomes de docente, wordmark.
- **Montserrat** (300 a 800): corpo, UI, labels, kickers.

| Nível | Família | Tamanho | Peso | Tratamento |
|---|---|---|---|---|
| Hero (LP) | Playfair | `clamp(42px, 7vw, 92px)` | 600 | line-height 0.98; palavra-chave em itálico com clip dourado |
| Hero (plataforma) | Playfair | `clamp(28px, 4vw, 44px)` | 600 | menor que a LP |
| Section header | Playfair | `clamp(28px, 4vw, 48px)` | 600 | cor `--verde` sobre claro, `--offwhite` sobre escuro |
| Card title / docente | Playfair | 17px a 20px | 600 | |
| Body | Montserrat | 14px a 16px | 400 | line-height 1.6 |
| UI / label | Montserrat | 12px a 13px | 600 | |
| Kicker / eyebrow | Montserrat | 10px a 11px | 700 a 900 | uppercase, letter-spacing 0.14em a 0.22em |
| Caption | Montserrat | 9px a 10px | 700 | |

Números (notas, contadores, preço) em Playfair, tabulares onde comparam (desempenho por módulo, X/16).

### Wordmark

Uso obrigatório do nome do curso: "ESTRATÉGIA" em Playfair com letter-spacing ~0.24em a 0.26em, seguida de uma linha "INTERNACIONAL" menor, ladeada por finas hairlines douradas (`--gold`). Nunca redigitar como texto corrido; é um lockup. Implementação de referência: classe `.wordmark` do design.

### Forma (radius)

Escala fechada. **Teto absoluto de 14px** (regra do handoff: nada arredondado acima de 14px), com exceção de elementos pill (botões de navegação, badges).

| Radius | Uso |
|---|---|
| `3px` a `4px` | Chips, inputs, tags, células de tabela |
| `8px` a `10px` | Cards |
| `12px` a `14px` | Containers grandes, painéis, faixas |
| `999px` | Somente pill: botão de nav, badge, avatar redondo |

Disciplina de forma: dentro de uma tela, não misturar cantos muito redondos com muito retos no mesmo nível hierárquico. Cards da mesma prateleira compartilham o mesmo radius.

### Motion

| Token | Valor | Uso |
|---|---|---|
| Transição base | `0.2s a 0.4s ease` | Hover de link, cor, acordeão |
| Card docente hover | `transform 0.35s ease` | `translateY(-6px)` + borda dourada + sombra |
| Ato do diagnóstico | `0.4s ease` | Inverte fundo para verde no hover/ativo |
| Acordeão (toggle) | `transform 0.3s ease` | Ícone `+` gira 45° ao abrir |
| Glow da oferta | `vsGlow 2.6s ease-in-out infinite` | Elemento pulsante da oferta |
| Globo do hero | `cnGiro 72s linear infinite` | Esfera 3D girando no eixo Y (mapa-múndi) |
| Estrelas do hero | `cnPisca` (2,8–6,4s, dessincronizado) | Pontos de 4 pontas piscando fora do globo |
| Parallax do hero | `transform 0.3s ease-out` | Camadas do fundo seguem o cursor (`--mx/--my`) |

**Exceção de motion do hero (deliberada, 23/jul/2026):** o dial de motion do sistema é
baixo e o glow da oferta era o único elemento animado. O fundo do hero abre uma exceção
consciente — globo girando + estrelas piscando + parallax no hover — por ser o momento de
maior impacto da LP e reforçar a tese "a liberdade começa pela geografia". Tudo é
composited (`transform`/`opacity`), o globo usa `contain`, e nada disso se espalha para o
resto da LP: as demais seções seguem o dial baixo. Fora do hero, o glow da oferta continua
sendo o único elemento pulsante.

Respeitar `prefers-reduced-motion`: desligar o `vsGlow`, o giro/piscar/parallax do hero e as
animações de entrada, mantendo só transições de cor curtas.

### Sombras e texturas

- Sem sombra preta pura. Em tema escuro, sombra de profundidade aceita `rgba(0,0,0,.32)` (ex.: hover de card na plataforma). Em tema claro, sombras suaves e baixas.
- Sombra dourada só no glow da oferta: `0 22px 66px rgba(217,190,133,.75)`.
- **Textura de pontos** sobre fundos verdes: `radial-gradient(rgba(247,245,242,.05 a .10) 1.2px, transparent)` em grid de 30px, com máscara de fade. Sutil, nunca protagonista.
- Fotos de docente em **duotone verde**, colorindo no hover.

### CTA dourado

Botão primário de conversão: `linear-gradient(160deg, #D9BE85 0%, #A98E4E 100%)`, texto `--verde-3` (`#0A2B1E`), peso 700. É o único gradiente do sistema.

## 3. Patterns de componente

Preferir estender um pattern existente a inventar variante. Cada pattern abaixo mapeia para telas de `ROUTES.md`.

### Botão primário (CTA de conversão)
Gradiente dourado, texto verde profundo, uppercase ou sentence-case forte, seta opcional. Usado no hero, oferta, CTA final.
```css
.btn-cta{background:linear-gradient(160deg,#D9BE85 0%,#A98E4E 100%);color:#0A2B1E;
  font-family:'Montserrat';font-weight:700;padding:14px 28px;border-radius:10px;border:none;
  letter-spacing:.02em;cursor:pointer}
```

### Botão secundário / ação da plataforma
Sólido verde ou contorno. Anterior/próxima na aula, "Iniciar prova".
```css
.btn{background:#0B2D20;color:#F7F5F2;font-weight:700;padding:11px 22px;border-radius:8px;border:none}
.btn-ghost{background:transparent;color:#0B2D20;border:1.5px solid #0B2D20;padding:11px 22px;border-radius:8px}
```

### Botão WhatsApp
Verde WhatsApp, para suporte e 2ª chamada. Nunca dourado (é ação de suporte, não de conversão).
```css
.btn-wpp{background:#25D366;color:#08351D;font-weight:700;padding:11px 20px;border-radius:8px}
```

### Kicker (eyebrow)
Rótulo de seção. Uppercase, dourado ou pedra, tracking largo. Um por seção, nunca em todo bloco.
```css
.kicker{font-family:'Montserrat';font-size:10px;font-weight:900;letter-spacing:.16em;
  text-transform:uppercase;color:#7E6836}
```

### Card de docente (LP)
Chip de módulo no topo, foto duotone que colore no hover, nome em Playfair, credencial em caption dourada. Eleva no hover. Vira carrossel com snap 78% no mobile.
```css
.prof{border:1px solid #D6C3C2;border-radius:12px;padding:0;overflow:hidden;background:#fff;
  transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease}
.prof:hover{transform:translateY(-6px);border-color:rgba(217,190,133,.7);box-shadow:0 22px 50px rgba(0,0,0,.32)}
```

### Card de módulo (vitrine da plataforma)
Arte/gravura no topo, título uppercase, barra de progresso fina, contador X/N. Estados: concluído (✓, barra cheia verde), em andamento (barra parcial), não iniciado (barra cinza `#B5B5B5`).

### Acordeão (currículo, sidebar de progresso)
Summary clicável, ícone `+` que gira 45° ao abrir, número do item em Playfair que fica dourado quando aberto. Sem o marcador nativo do `<details>`.
```css
.mod[open] .tgl{transform:rotate(45deg);color:#A98E4E}
.mod[open] .mnum{color:#A98E4E}
summary::-webkit-details-marker{display:none}
```

### Ato interativo (O Diagnóstico)
Três colunas; a ativa/hover inverte para fundo verde profundo com texto claro e ícone dourado-claro. Só uma ativa por vez (usa `:has()`).

### Chip / badge
Retângulo pequeno de rótulo (módulo, "4/4 ✓", "liberado"). Fundo `--gold-soft` com texto `--gold-dark`, ou contorno. Radius 3px a 10px.

### Card de oferta (glow)
Container destacado com o único elemento animado do produto: o `vsGlow` pulsa a sombra dourada. Lista "você recebe" com ✓, preço em Playfair, CTA dourado.
```css
@keyframes vsGlow{0%,100%{box-shadow:0 12px 30px rgba(11,45,32,.18),0 0 0 1px rgba(217,190,133,.35)}
  50%{box-shadow:0 22px 66px rgba(217,190,133,.75),0 0 0 4px rgba(217,190,133,.95)}}
.vs-hl{animation:vsGlow 2.6s ease-in-out infinite;will-change:box-shadow}
```

### Input (login, definição de senha)
Fundo escuro translúcido sobre verde, borda fina dourada no foco, label em kicker. Tema dark da plataforma.

### Player (aula)
Panda Video 16:9, cantos 8px a 12px, sem chrome extra. Retomada automática. Controles nativos do Panda.

### Certificado
Peça de marca, quebra o padrão de propósito: wordmark, olho em gravura, ilustrações, nome em Playfair grande, "30 horas", assinaturas, código `EI-2026-XXXX`. Preview na tela e render fiel em PDF.

## 4. Ícones

- **UI (navegação, ações, estados):** set de traço fino coerente com o tom editorial. Recomendado Phosphor (weight regular ou light) ou equivalente stroke 1.5px. Nunca ícones preenchidos pesados.
- **Marca (olho, ilustrações de módulo):** gravuras. O **olho** vem dos PNGs prontos em `referencias/` (versão clara, preta com miolo branco e fade para a topbar, dourada para fundo escuro). **Nunca recriar o olho**; usar os arquivos. Ilustrações de módulo em estilo gravura, SVG com stroke dourado.
- ✓ (check) é o único "emoji" permitido, usado em listas de entrega e estados concluídos.

## 5. Layout

- **LP:** rolagem longa, largura máxima ~1280px, faixas full-bleed alternando off-white e verde profundo. Topbar fixa com blur. Hero e oferta em verde; conteúdo em claro. Textura de pontos nas faixas verdes.
- **Plataforma:** shell escuro persistente. Header com wordmark + olho, navegação enxuta e menu de conta. Home em prateleiras horizontais (vitrine). Aula em duas colunas (player + sidebar de progresso), colapsa para uma no mobile.
- **Sticky:** topbar da LP (fixa) e header da plataforma. O antigo sticky CTA de rodapé da LP foi removido; a topbar assume o CTA persistente (botão "Inscreva-se").
- **Mobile:** grades viram carrossel com scroll-snap (docentes 78%, chancela 88%); navegação vira hambúrguer; o botão "Inscreva-se" compacto assume o CTA persistente.

## 6. Anti-slop checklist (validar antes de commitar uma tela)

- [ ] Um único acento (dourado) por bloco; hierarquia por intensidade, não por cor nova.
- [ ] Nenhuma cor fora da paleta da seção 2. Vermelho só em erro/reprovação.
- [ ] Radius dentro da escala, teto 14px (exceto pill); cards da mesma prateleira com o mesmo radius.
- [ ] Títulos em Playfair, corpo/UI em Montserrat. Nunca Playfair em corpo longo nem Montserrat em título grande.
- [ ] Kicker aparece uma vez por seção, não em todo bloco.
- [ ] Números comparáveis em tabular (X/16, notas, desempenho por módulo).
- [ ] Motion sutil; só a oferta pulsa; `prefers-reduced-motion` respeitado.
- [ ] LP em claro, plataforma em escuro; nada de tema trocado.
- [ ] O olho usa o arquivo, não uma recriação.
- [ ] Contraste mínimo AA (texto sobre verde usa `--offwhite`/`--muted`, não cinza puro).
- [ ] Zero travessões em qualquer texto de UI.

## 7. Como criar tela nova

1. Identificar em `ROUTES.md` a que grupo a tela pertence (LP/público claro, ou plataforma dark) e travar o modo de cor.
2. Escolher o layout base (faixa longa da LP, ou shell da plataforma).
3. Montar com patterns existentes da seção 3; só criar componente novo se nenhum servir.
4. Aplicar tokens da seção 2 (nunca hex solto fora da paleta).
5. Passar o anti-slop checklist antes de abrir PR.

## 8. Como criar componente novo

Extrair um componente quando o mesmo pattern aparece em três telas ou mais, ou quando tem estado (aberto/fechado, ativo/inativo). Antes de criar, conferir se dá para estender um pattern da seção 3. Componente novo entra neste documento (prosa + código) no mesmo PR. Nome semântico (`.btn-cta`, `.prof`, `.mod`), não visual (`.botao-dourado`).

## 9. Tooling

- **Stack visual:** Next.js (App Router, RSC) + Tailwind. Tokens desta seção expostos como CSS custom properties / `@theme`, com as duas famílias self-hosted (woff2 do bundle). Não usar a fonte default da stack (Geist); a identidade é Playfair + Montserrat.
- **Fontes:** self-host obrigatório em produção (woff2 já extraídas do bundle do Claude Design), com `font-display: swap`.
- **Assets:** olho e gravuras versionados em `public/brand/`; fotos de docente otimizadas para ~400px WebP em `public/docentes/`.
- **Quando adicionar dependência:** só se um pattern recorrente pedir (ex.: biblioteca de ícones). Evitar libs de componente prontas que tragam estética própria e brigem com o Meridiano.

## 10. O que NÃO fazer (lista negra do slop)

- Gradiente roxo-rosa, ou qualquer gradiente que não seja o CTA dourado.
- Fonte Inter/Geist/system default em título; Playfair em parágrafo longo.
- Sombra preta pura (`#000`) espalhada; sombra colorida fora do dourado do glow.
- Três cards idênticos lado a lado sem hierarquia (a vitrine varia estado e progresso).
- Kicker/eyebrow em toda section como muleta.
- Cantos redondos acima de 14px em card ou container (só pill).
- Segunda cor de destaque competindo com o dourado.
- Emoji decorativo (só ✓ e ícones de UI).
- Modo claro na plataforma ou faixa escura "tema trocado" na LP.
- Recriar o olho da marca em vez de usar o arquivo.
- Travessão em qualquer texto.

## 11. Roadmap visual

| Superfície | Estado |
|---|---|
| LP (`/`) | Design final aprovado (bundle), a reconstruir em produção. Ajuste aprovado: kicker de marcas no hero |
| Área do aluno P1 a P7 (`/app/*`) | Design final aprovado (bundle), a reconstruir em produção |
| `/obrigado`, `/verificar/:codigo` | Sem design dedicado; montar com patterns do Meridiano |
| Admin (`/admin/*`) | Sem design; funcional e sóbrio, reaproveitando tokens e patterns da plataforma |
| E-mails (14 templates) | Template base no brand (logo clara, fundo claro, CTA dourado); a construir |
| Certificado (PDF) | Peça de marca, a desenhar com wordmark, olho e gravuras |

---
*Derivado de ROUTES.md e dos designs finais em 17/jul/2026. Fecha a trinca de fundação: PRD.md, ROUTES.md, DESIGN.md.*

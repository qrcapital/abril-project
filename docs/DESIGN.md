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

#### Exceção semântica: desempenho por módulo (decisão do Pedro, 28/jul/2026)

O desempenho por módulo, nas duas telas de resultado da prova, **usa cor como informação, não
como decoração**, e por isso abre exceção à regra de acento único. O motivo: o aluno aprovado
precisa enxergar de bate-pronto qual módulo ficou deficitário, e num aprovado não cabe vermelho,
porque não há erro. Eu havia proposto resolver por intensidade de dourado; o Pedro preferiu
verde para sucesso e amarelo para deficiência, e é o que vale.

O corte é a própria nota de aprovação, **70%**: o que reprovaria isolado é o que precisa de
revisão, mesmo com o conjunto aprovado. A mesma regra vale nas duas variantes; o vermelho da
reprovação fica no veredito grande, não nas linhas de diagnóstico.

| Estado | Texto | Barra | Contraste medido |
|---|---|---|---|
| Sucesso, `≥ 70%` | `#1B7A50` | `#1F8A5B` | 5,32:1 no texto · 3,50:1 na barra |
| Deficitário, `< 70%` | `#7A4E06` sobre pill `#F7E3BE` | `#AA7010` | 5,71:1 no texto · 3,37:1 na barra |

**Por que o amarelo virou pill em vez de cor de texto:** amarelo vivo não passa AA como texto
sobre branco, é física da cor. O `#e0a54e` do design dá 2,17:1 contra os 4,5 exigidos em 12px.
Pondo o amarelo no **fundo**, onde não há exigência de 4,5, a cor fica vibrante e o texto passa
com folga. De quebra, etiqueta colorida chama mais atenção que número colorido, que era o
objetivo.

#### O verde semântico tem um valor por fundo (regra do Pedro, 29/jul/2026)

Levantado por ele ao aprovar os padrões de feedback: o verde que encaixa no fundo branco não é
o que encaixa no verde escuro. Medido, e não há meio-termo, porque **nenhum verde passa AA nos
dois**:

| Verde | Sobre `#F7F5F2` (claro) | Sobre `#0B2D20` (escuro) |
|---|---|---|
| `#1B7A50` (o do desempenho por módulo) | **4,89:1** ✓ | 2,80:1 ✗ |
| `#3FB07A` | 2,51:1 ✗ | **5,46:1** ✓ |
| `#5BC48F` | 1,98:1 ✗ | **6,90:1** ✓ |

Então: **claro usa `#1B7A50`**, que já está no ar nas telas de resultado, e **escuro usa
`#3FB07A`** quando a hora chegar. **Decisão do Pedro em 29/jul/2026:** eu havia proposto o
`#5BC48F` pela margem maior, ele preferiu o `#3FB07A`, que é mais saturado e fica mais perto da
família de verdes do produto. Os dois passam AA com folga sobre o verde escuro, então a escolha
era de tom, não de acessibilidade. Não repropor o pastel.

Nunca reaproveitar um do outro lado: a tentação é escrever "verde de sucesso" como um token só,
e aí metade das telas reprova em contraste sem ninguém perceber. Vale para qualquer cor
semântica, não só o verde.

Hoje o verde semântico só aparece em fundo claro (desempenho por módulo), então isto é regra
para quando aparecer no escuro, não dívida aberta.

**Duas correções de AA na mesma leva.** As duas falhas antecediam esta mudança: o percentual em
verde `#1F8A5B` dava 4,33:1 e falhava por pouco em 12px, e a barra dourada `#A98E4E` dava 2,54:1
sobre o trilho `#EDE6DD`, abaixo dos 3,0 do WCAG 1.4.11 para objeto gráfico. Isso encerra o item
do critique de 21/jul sobre cores fora de paleta nessas telas: `#1F8A5B`, `#e0a54e` e `#c0392b`
saíram das linhas de desempenho. Cor calculada em `lib/prova-template.ts`, com as medições
registradas em `docs/FEEDBACK-UX.md`.

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

Uso obrigatório do nome do curso: "ESTRATÉGIA" em Playfair com letter-spacing ~0.24em a 0.26em, seguida de uma linha "INTERNACIONAL" menor, ladeada por finas hairlines douradas (`--gold`). Nunca redigitar como texto corrido; é um lockup. Implementação de referência: classe `.wordmark` do design. **Detalhe de implementação (25/jul/2026):** o letter-spacing põe espaço também depois da última letra, o que entorta o lockup (hairline passando do "A", INTERNACIONAL fora do centro); compensar com margem negativa igual ao tracking (`margin-right:-.26em` no título, `-.44em` na linha de baixo). Em telas estreitas, **escalar a aplicação padrão** (mesmos trackings, fonte menor), nunca mudar as proporções.

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
| Globo do hero | `requestAnimationFrame` (giro 72s no eixo Y) | Esfera 3D pontilhada em **canvas** (`GloboCanvas.tsx`) |
| Praças (sonar) | anéis expandindo, ciclo próprio por cidade | Marcador de "hub ativo" em cada praça financeira |
| Corcova das rotas | janela de luz percorrendo o arco | Relevo que passeia de uma praça a outra (fluxo de capital) |
| Globo segue o mouse | lerp em `--mx/--my` | O cursor gira (±26°) e inclina (±12°) a esfera |

**Exceção de motion do hero (deliberada, 23/jul/2026; globo migrado para canvas em
24/jul/2026):** o dial de motion do sistema é baixo e o glow da oferta era o único elemento
animado. O fundo do hero abre uma exceção consciente por ser o momento de maior impacto da
LP e reforçar a tese "a liberdade começa pela geografia". O globo é um **canvas 2D**
(`app/_lp/GloboCanvas.tsx`), não DOM: um `<canvas>` no lugar dos ~3.700 elementos da versão
anterior, que travava ao adensar o mapa (o `preserve-3d` reordenava todos os filhos por
profundidade a cada quadro). Em canvas o custo é proporcional ao que se pinta. O que anima:
a esfera gira no eixo Y; as praças pulsam em anel sonar (ciclo próprio por cidade); uma
corcova de luz percorre as rotas; e o globo gira/inclina seguindo o mouse (o `HoverRuntime`
escreve `--mx/--my` no `#hero`, o canvas lê e persegue com lerp). As **estrelas foram
removidas** — com elas saiu o parallax de translação das camadas, que sem elas não lia como
profundidade. Nada disso se espalha para o resto da LP: as demais seções seguem o dial baixo.

O loop **para quando o hero sai da viewport** (`IntersectionObserver`) e respeita
`prefers-reduced-motion` (desenha um único quadro estático, sem giro nem interação). Fora do
hero, o glow da oferta continua sendo o único elemento pulsante.

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

### Feedback ao usuário (os cinco padrões)

Escolhidos de uma vez em 29/jul/2026, antes das telas, porque feedback nasce espalhado: a mesma caixa já existia escrita à mão em três clients, com três vermelhos e dois jeitos de dizer "carregando". Implementação em `app/app/_ui/feedback.tsx`. Quem for consertar uma tela **estende daqui**, não inventa variante.

**APROVADOS pelo Pedro em 29/jul/2026**, as cinco decisões inteiras: sucesso em dourado e não em verde, botão em trabalho sem spinner, sucesso claro com texto de corpo, um vermelho só, e a caixa pintada no DOM. Não repropor. A ressalva que ele levantou na mesma resposta virou a regra do verde semântico por fundo, na seção 2.

**A caixa se pinta no DOM, não em JSX, e isso não é preguiça.** Toda tela do projeto é HTML portado injetado com `dangerouslySetInnerHTML`, então JSX irmão desse bloco vira vizinho do **layout inteiro**: a primeira versão pôs a caixa no fim da página, 350px abaixo do formulário, e nem build nem lint pegam isso (foi visto dirigindo o browser). O lugar da caixa é um slot `[data-feedback]` que o `senha-template` emite entre os campos e o botão, e o `pintarCaixa()` escreve nele. Tela nova que precise de caixa **emite o slot no próprio markup**.

**Dois temas, não um.** O login e as telas de senha são escuras; o miolo de toda tela de `(sala)` é claro (`#F7F5F2` com texto `#333333`), e só o chrome em volta é escuro. Cada padrão tem os dois pares, com contraste medido, e usar o hex do tema errado deixa a caixa ilegível.

**1. Caixa de erro.** Vermelho `#b0413e` como tinta e borda, que é o único uso não decorativo de vermelho que a seção 2 autoriza. Leva `role="alert"`, que interrompe o leitor de tela na hora, porque é resposta a uma ação que falhou.

**2. Caixa de sucesso e de aviso.** Dourado em vez de verde, para não somar uma segunda cor de destaque. Levam `aria-live="polite"`, que espera a leitura corrente terminar.

| | Escuro (login) | Claro (área) |
|---|---|---|
| Erro | tinta `.14`, texto `#E6A9A7` · **7,00:1** | tinta `.08`, texto `#8E3330` · **6,47:1** |
| Sucesso | tinta `.08`, texto `#EDE6DD` · **10,24:1** | tinta `.10`, texto `#333333` · **10,60:1** |
| Aviso | tinta `.08`, texto `#D9BE85` · **7,04:1** | tinta `.06`, texto `#7E6836` · **4,66:1** |

Dois achados da medição, que explicam hexes que parecem arbitrários. O `--gold-dark` `#7E6836` sobre tinta dourada a 10% dá **4,49:1** e falha AA por 0,01, então o **sucesso claro leva texto de corpo** com o dourado só na borda; o **aviso**, que é o único que precisa soar dourado, baixa a tinta para 6% e aí o mesmo `#7E6836` passa com folga. O vermelho `#E0736F` que o login usava passa (4,53:1), mas por 0,03, e por isso saiu: margem de três centésimos não sobrevive a um ajuste de fundo.

**3. Botão em trabalho.** O rótulo vira o verbo no gerúndio ("Entrando...", "Salvando...", "Criando conta..."), o botão desabilita e anuncia `aria-busy`. A largura é travada antes da troca, para a tela não pular quando o texto encolhe. **Sem spinner:** a seção 2 reserva movimento ao glow da oferta, e um giro novo aqui brigaria com isso. Trocar o rótulo e não só esmaecer, porque opacidade sozinha é indistinguível de "o clique não pegou".

**4. Lista de exigências que marca conforme cumpre.** Para as duas telas que criam senha. A fonte é a lista `EXIGENCIAS` de `lib/senha.ts`, a mesma que gera a frase da regra e a mensagem de recusa: com a regra escrita em três lugares, elas divergem no primeiro ajuste. Item cumprido ganha ✓ e o cinza vira texto normal; nunca marcar em vermelho o que a pessoa **ainda não terminou de digitar**, que é transformar preenchimento em repreensão. O componente nasce junto com a tela que o consome (tarefa 10 do `PENDENCIAS-LP`), não antes.

**5. Confirmação de ação irreversível** (`confirmar()`, acrescentado em 30/jul/2026). Substitui o `window.confirm`, que é cinza do sistema, não diz o que está em jogo e aparecia no clique mais tenso do produto: o envio da prova, que é tentativa única. Devolve `true`/`false`, com Esc, clique fora e o botão de cancelar todos resolvendo `false`. Aceita conteúdo extra entre o corpo e os botões, que é onde a grade de questões da prova entra. Qualifica como componente pela seção 8 por ter estado (aberto/fechado), não por repetição.

`<dialog>` nativo com `showModal()`, e não div com overlay à mão, porque a plataforma entrega de graça o que essa div exigiria escrever: camada superior acima de qualquer `z-index`, backdrop, foco preso, Esc e devolução do foco a quem abriu. Botões reusam o par que já está na tela da questão (dourado para a ação, contorno para voltar), então nenhuma cor nova entra.

**Três decisões que parecem detalhe e não são:**

- **O diálogo é anexado ao `document.body`.** Mesma razão da caixa pintada no DOM, um passo além: além de JSX irmão virar vizinho do layout, o CSS gerado pelo porte não deve alcançar este componente.
- **`position:fixed` e `margin:auto` vão inline.** A centralização de `dialog:modal` vem da folha do navegador, e basta uma regra da página pôr `position:relative` no `dialog` para ele cair no fluxo normal: **o backdrop aparece, o diálogo sai do viewport e o console fica limpo**, sem nada para depurar. Estilo inline ganha de folha e fecha a porta. É a mesma armadilha que já custou tempo em outro projeto.
- **O foco nasce no botão seguro.** `showModal()` foca o primeiro focável; num diálogo de ação irreversível esse não pode ser o botão que destrói, senão um Enter reflexo envia a prova. O `autofocus` fica no "voltar".

`::backdrop` não aceita estilo inline, e é a única razão pela qual o componente injeta uma folha (uma regra, uma vez, idempotente).

O parâmetro `destaque` põe em **negrito** um trecho do corpo, achado por busca de substring e embrulhado com nós de texto, exatamente como o `link` do `pintarCaixa`. Nunca `innerHTML`: o corpo carrega número vindo do servidor, e destaque não é motivo para abrir essa porta. Trecho ausente da frase fica sem negrito em vez de sumir do corpo. Na prova o destaque é a quantidade em branco, e o par frase/trecho vem de `fraseEmBranco`/`trechoEmBranco`, com o check garantindo que um é substring do outro: se divergirem, o negrito desaparece em silêncio e a frase continua certa.

**Grade de questões** (na prova): um botão por posição, respondida ou em branco, clicável para ir direto à questão. Reusa as bolinhas de alternativa (`BOLA_ON`/`BOLA_OFF`), então a diferença entre os estados é **preenchimento contra contorno**, não só matiz, e funciona para quem não distingue as duas cores; o `aria-label` diz o estado por extenso, porque o número sozinho não o carrega.

**Dez por linha, fixo** (`repeat(10,minmax(0,1fr))`): com 20 questões dá duas fileiras de dez, que se leem como dezenas. A primeira versão usava `auto-fill`, que quebrava em 11 e 9 conforme a largura sobrava, e isso não tem leitura nenhuma. Verificado até 430px de largura: os chips encolhem e seguem legíveis, sem estouro nem barra de rolagem.

**Sem marca de questão atual.** A grade abre pelo botão de envio, que só existe na última questão, então "atual" seria sempre a última: constante, e portanto sem informação. O anel e o `aria-current` saíram na revisão do Pedro em 30/jul.

Uma troca em relação à bolinha original, achada medindo: `BOLA_ON` pinta o glifo em **branco**, que sobre o dourado `#A98E4E` dá **3,15:1** e falha AA. Na alternativa isso não pesa, porque o texto ao lado carrega o sentido e a letra é quase decoração; na grade o **número é a única informação do chip**, então ele vira verde profundo `#0A2B1E` (**4,84:1**), que é o mesmo par do botão dourado da plataforma. Em branco: `#7E6836` sobre o branco do diálogo, **5,36:1**. Fica registrado que a bolinha da alternativa segue com os 3,15:1 originais, que é decisão de design aprovada e não foi tocada aqui.

**Painel de recado** (`Painel`): tela cheia para `loading`, `error` e `not-found` do grupo `(sala)`, repetindo o envelope das telas portadas (`#F7F5F2`, `100vh - 58px` descontando a topbar) para o recado cair dentro do chrome em vez de romper o layout.

### Tabela do admin (30/jul/2026)

O admin é a única superfície onde o **Tailwind roda de fato** (a LP e a área do aluno são HTML
portado com CSS próprio; o `app/globals.css` que o `AGENTS.md` citava nunca existiu). Os tokens do
Meridiano vivem num bloco `@theme` em `app/admin/admin.css`, e as peças de tabela em
`app/admin/_ui/tabela.tsx`. **Estenda daqui, não invente variante** — mesma regra dos padrões de
feedback acima.

| Peça | O que resolve |
|---|---|
| `Quadro` | Envelope com borda `--areia`, fundo branco e **`overflow-x-auto`**, que é obrigatório: e-mail é longo e não pode empurrar a página inteira para o lado |
| `Cabecalho` | `thead` a partir dos rótulos, em 11px `uppercase` com `tracking` largo. String vazia vira coluna sem título (a de ações) |
| `Linha` | `tr` com régua `--bege` e `last:border-0` |
| `Selo` | Pílula de estado, com seis tons: `neutro`, `ok`, `atencao`, `ruim`, `destaque`, `forte` |
| `Vazio` | Estado vazio como peça, para ninguém entregar tabela que abre em branco sem explicação |

Extraídas quando a **segunda** tabela apareceu, não antes, e o gatilho foi concreto: a primeira
versão duplicou o mapa de tons e a formatação de situação da prova nas duas telas de aluno.

**O verde dos selos é o do fundo CLARO** (`#1B7A50`), pela regra do §2 de que cor semântica tem um
valor por fundo: o miolo do admin é claro, e usar o par do escuro (`#3FB07A`, 2,51:1 sobre claro)
deixaria o texto ilegível. O amarelo segue a mesma solução do desempenho por módulo, no **fundo**
(`#F7E3BE` com texto `#7A4E06`), porque amarelo vivo não passa AA como texto.

Uma escolha de significado, não de estética: **`expirada` é `atencao` e não `ruim`**. Prazo que
vence é o ciclo normal do produto; `revogada` é reembolso ou chargeback, que é o caso que alguém
precisa olhar. Pintar os dois de vermelho apagaria a diferença justamente na tela feita para
enxergá-la.

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
- **Ritmo vertical da LP (24/jul/2026):** o respiro é medido do fim do conteúdo de uma seção ao começo do conteúdo da seguinte, e depende de **haver ou não virada de fundo**:
  - **200px quando o fundo muda** (claro → verde ou verde → claro). A faixa colorida sustenta o respiro maior. Seção de fundo escuro usa `padding:96px 0` mais `margin-top:104px`; a clara que a segue entra com `padding-top:104px`.
  - **128px quando o fundo não muda** (clara sobre clara, sem faixa entre elas): `padding-bottom:24px` na de cima + `padding-top:104px` na de baixo. É o caso de Ferramentas → Quem assina e FAQ → CTA final. Com 200px ali as seções descolavam e o fechamento ficava boiando no fim da página.
  - **Exceções:** hero → ficha técnica se sobrepõe de propósito (`margin-top:-44px`); currículo → Ferramentas tem o divisor decorativo do olho no meio (96px de margem + ornamento + 104px da seção).
  - Ao criar seção nova, garantir os **dois lados** da conta: uma clara com `padding-bottom:0` seguida de outra clara entrega só os 104px da de baixo. Container de 1180px com 28px laterais em todas as seções.
- **Sticky:** topbar da LP (fixa) e header da plataforma. O antigo sticky CTA de rodapé da LP foi removido; a topbar assume o CTA persistente (botão "Inscreva-se").
- **Mobile:** grades viram carrossel com scroll-snap (docentes 78%, os 2 cards de Quem Assina 88%), cada carrossel com **bolinhas de posição** logo abaixo (`.carr-dots`: inativas na cor de secundário do fundo — off-white a 38% sobre verde, dourado a 38% sobre claro — e a **ativa sempre dourada** e maior, via `--dot-on`; toque navega; runtime em `app/_lp/CarrosselDots.tsx`); navegação vira hambúrguer (com **Entrar** dourado ao fim do menu, separado por hairline, já que o botão da topbar some no mobile); o botão "Inscreva-se" compacto assume o CTA persistente. O selo Meridiano de Quem Assina **sai no mobile** (`.qa-selo`, 180px não se aplica bem no viewport estreito). Na Ferramentas, a ordem de leitura muda para título/lead → mockup → bullets (25/jul/2026).

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

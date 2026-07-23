# Briefing — Selo "Quem assina" (Estratégia Internacional)

> Prompt de design autocontido. Cole em qualquer ferramenta de design (Claude Design etc.)
> para gerar novas propostas do selo. Tudo que é necessário está aqui — não depende de
> contexto externo.

---

## 1. O pedido, em uma frase

Desenhe um **selo/emblema circular** que una duas instituições — **VEJA Negócios** e
**BlockTrends** — como co-assinatura de uma formação premium em finanças. Quero
**várias propostas** numa linguagem **moderna/tech** (não gravura antiga), mantendo a
identidade da marca abaixo.

## 2. Contexto do produto

- **Produto:** "Estratégia Internacional", uma formação online premium sobre dolarização
  de patrimônio e investimento internacional. Público: investidor brasileiro de alta renda.
- **Onde o selo vive:** a seção **"Quem assina"** de uma landing page. A tese da seção é
  *"Duas instituições, uma responsabilidade"*: a técnica de quem operou o mercado por
  dentro (BlockTrends) com a credibilidade de uma marca que o Brasil lê há 70+ anos (VEJA).
- **As duas entidades e seus papéis (nomenclatura travada):**
  - **VEJA Negócios** → *chancela de **credibilidade*** (reputação institucional, Grupo Abril).
  - **BlockTrends** → *chancela **técnica*** (autoria do conteúdo e do método; edtech de
    criptoativos, tecnologia e finanças).

## 3. O que o selo precisa comunicar

Autoridade, valor, confiança — "isto é sério e chancelado". Um selo de **co-emissão**: as
duas marcas juntas formam um aval. Pense em selo de certificado, medalha, moeda de valor,
lacre de autenticidade — mas em **execução contemporânea**.

## 4. Elementos obrigatórios

1. **O olho** (marca gráfica do produto, estilo gravura em aço) fica **no centro**, sempre
   na **vertical** (reto), mesmo que o resto do selo gire como um carimbo.
   Proporção real do arquivo: **328 × 238 (ratio 1,378)** — nunca esticar.
2. **Os dois nomes** presentes: `VEJA NEGÓCIOS` e `BLOCKTRENDS` (em arco, ou como
   lockup — livre).
3. Legível e bonito de ~40px (favicon-ish) até ~160px (no card).

## 5. Design system "Meridiano" (identidade — respeitar)

**Vibe:** rigor editorial de publicação de negócios (VEJA Negócios, The Economist) + sobriedade
de private banking / wealth report. Verde profundo + ouro. Densidade média-baixa, respiro.

### Cores (paleta fechada — não introduzir cor nova)
| Papel | Hex |
|---|---|
| Verde profundo (fundo/peso) | `#0B2D20` |
| Verde 2 (variação) | `#123B2B` |
| Verde 3 (mais profundo) | `#0A2B1E` |
| Off-white (fundo claro / texto sobre verde) | `#F7F5F2` |
| Bege (superfície clara 2) | `#EDE6DD` |
| Ouro (acento primário) | `#A98E4E` |
| Ouro escuro (texto dourado sobre claro) | `#7E6836` |
| Ouro claro (dourado sobre escuro) | `#D9BE85` |
| Ouro suave (fundos de chip/badge) | `#F0E9D8` |

**Regra de acento:** um único destaque por bloco (o ouro). Hierarquia por **intensidade do
ouro**, nunca somando uma segunda cor de destaque. Verde é a família de fundo. Sem roxo,
sem gradiente arco-íris. O único gradiente "oficial" da marca é o CTA:
`linear-gradient(160deg, #D9BE85 0%, #A98E4E 100%)`.

### Tipografia
- **Playfair Display** (serif, 500/600/700) — títulos, números, nomes, wordmark.
- **Montserrat** (sans, 300–800) — corpo, UI, labels, kickers (uppercase, tracking largo).
- Nomes de marca no selo podem usar qualquer uma das duas.

### Forma e motion
- Radius: teto de 14px (exceto pill 999px). Cantos de mesma hierarquia coerentes.
- Motion baixo (0.2–0.4s). Nada de bounce/elastic. Respeitar `prefers-reduced-motion`.
- Sombra: sem preto puro espalhado; sombra colorida só no glow dourado do CTA.

## 6. Direção estética desejada (o que quero AGORA)

**Moderno / tech**, saindo da gravura clássica. Referências:
- **Apple "Liquid Glass"** (WWDC 2025): material translúcido, *lensing* (refração na borda),
  *specular highlights*, sombras adaptativas, profundidade — retorno ao vidro/brilho.
- **Emblemas premium de Behance/Dribbble (2025):** medalhão metálico (foil) dourado com
  brilho e bisel; chip de vidro escuro com monoline e glow (linguagem Linear/Vercel);
  formatos de ícone de app (squircle) com gradiente da marca.
- Decisão de contexto: o selo pode **destoar de propósito** do resto da LP (que é editorial)
  e funcionar como um **ponto focal de modernidade**.

## 7. O que já foi explorado (para NÃO repetir / referência)

| Direção | Veredito |
|---|---|
| Gravura clássica de cédula/certificado (guilloché, serrilha, pérolas) | **Rejeitado** — "não ficou premium", muito antigo |
| Selo flat com faixa verde + nomes off-white | Base ok, mas chapado |
| **Gold Foil** (medalhão metálico dourado) | Forte — premium imediato |
| **Dark Glass Chip** (vidro verde + monoline ouro + glow) | Forte — tech, mantém verde+ouro |
| **Liquid Glass** (Apple, translúcido) | Interessante — pede fundo escuro |
| **Neo-minimal** (aro fino, respiro) | Discreto demais para o gosto atual |
| **App-icon / squircle** (gradiente verde→ouro) | Válido, bem "produto digital" |

**Favoritas até aqui:** Gold Foil com um toque do verde da marca; e Dark Glass Chip.
Quero que você tente **superar** essas — propostas mais surpreendentes e bem executadas
dentro da paleta.

## 8. Restrições (não violar)

- Paleta fechada da seção 5 — nenhuma cor fora dela.
- O olho é um **arquivo** de gravura escura (preto/cinza). Sobre fundo escuro ele some;
  se usar fundo escuro, coloque o olho sobre um **núcleo/lente claro** (ou preveja versão
  dourada do olho para fundo escuro).
- Contraste mínimo **AA** em qualquer texto.
- A LP ao redor é clara/editorial (verde + ouro + Playfair/Montserrat) — o selo pode
  contrastar, mas não pode parecer de outra marca.
- Zero travessões (—) em textos de UI; sem emoji decorativo.

## 9. Assets disponíveis

- **Olho** (marca central): `public/lp/f2070b29-906c-48d8-92c7-0948fe19573b.webp`
  (gravura, fundo transparente, 328×238). Existe também versão dourada para fundo escuro.
- **Logo VEJA Negócios:** `public/lp/9d082a49-3451-447b-b123-55d3fa363e04.svg`
- **Logo BlockTrends:** `public/lp/3e33dbd4-b8c5-4b0d-a960-befd5dc2704a.svg`
- **Logo Grupo Abril:** `public/lp/grupo_abril.svg`

## 10. Entregável que espero de você

- **6 a 10 propostas** distintas de selo, cada uma com: nome curto, racional de 1 linha e
  a peça renderizada (SVG inline ou HTML/CSS autocontido — de preferência com o material
  real: vidro, metal, gradiente).
- Cada selo sobre o **fundo apropriado** (tile claro ou escuro) para o material aparecer.
- Se possível, mostre o selo também no tamanho pequeno (~48px) para validar legibilidade.
- Aponte sua recomendação e diga por quê.

---
*Design system completo: `docs/DESIGN.md`. Este briefing resume o necessário para o selo.*

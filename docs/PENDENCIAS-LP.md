# Pendências da Landing Page

Checklist vivo do que falta na LP antes do "pronto para produção". Atualizado
conforme os insumos chegam. Quando o Pedro perguntar "quais as pendências da LP?",
este é o documento a puxar.

_Última atualização: 2026-07-20._

## 🔴 Destrava a venda (prioridade máxima)

- [ ] **Checkout do Guru** — o CTA final **"GARANTIR MINHA VAGA"** (e o `title="checkout (D2)"`)
      aponta para `href="#"`. Precisa da **URL do checkout Guru**. Todos os CTAs de compra
      devem levar a essa URL (PRD §3). Sem isso a LP não converte.
      - _Insumo necessário:_ URL do checkout (PH providencia junto com docs/secret do webhook).

## 🟠 Conteúdo / links a povoar

- [ ] **Termos de uso** (rodapé) — hoje `href="#"`. Falta a página/URL.
- [ ] **Privacidade · LGPD** (rodapé) — hoje `href="#"`. Falta a página/URL.
- [ ] **Confirmar dados jurídicos do rodapé** — razão social "1971 Comunicações e
      Sistemas LTDA." e DPO `dpo@qr.capital` foram herdados do site da QR Capital
      (`cca.blocktrends.com.br`). Confirmar se valem para este produto.
- [ ] **VSL do hero** — hoje é `placeholder do VSL` (caixa vazia). Precisa do vídeo
      (ou decidir manter imagem; o design prevê `showVsl` configurável, PRD §2).
- [ ] **`og:image`** — sem imagem de preview para compartilhamento (WhatsApp/redes).
- [ ] **Pixels de tracking** — sem `fbq`/`gtag`. O PRD pede evento `InitiateCheckout`
      e pixels de remarketing (PRD §1 e §6).

## 🟡 Depende de outra fase

- [ ] **`{{ preco }}` / `{{ parcelas }}`** — hoje hardcoded no porte (`R$ 397` / `10x sem
      juros de R$ 39,70`). O PRD previa configuráveis sem deploy (variáveis de template).

## ✅ Já resolvido

- [x] **WhatsApp** — botão flutuante + link do rodapé plugados em
      `https://wa.me/message/W2USYZZK75FMC1` (2026-07-20).
- [x] **Performance de imagens** — PNG/JPG → WebP + lazy-load (6,3 MB → 1,3 MB).
- [x] **Hovers de botões/links** — restaurados via `HoverRuntime` (`style-hover`).
- [x] **Glow do card de preço** — efeito `.vs-hl` aplicado à Oferta.
- [x] **"Entrar" da topbar** → `/app/login` (área do aluno). Login já construído (2026-07-20).
- [x] **Rodapé reestruturado** — colunas Institucional/Políticas/Contato + DPO + copyright
      + voltar ao topo, inspirado no cca.blocktrends.com.br (2026-07-20).

---

_Como plugar cada pendência: os pontos da LP vivem em `app/_lp/body.html` (gerado pelo
porte). Trocas estáveis devem ir também em `scripts/port-lp.mjs` para sobreviver a
reexecuções — foi assim com WhatsApp, glow e otimização de imagem._

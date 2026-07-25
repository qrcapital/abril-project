---
name: critique-lp-abril
description: Resultado do critique de slop da LP do Abril e o backlog de fixes por localização.
metadata: 
  node_type: memory
  type: project
  originSessionId: 6fd80885-1e77-464b-b4cc-b611fd9e0436
  modified: 2026-07-21T22:01:28.249Z
---

Critique de design (via /impeccable, dual-agent) da **LP do Abril — Estratégia Internacional**, feito 21/jul/2026. Arquivos: `app/_lp/body.html` (estilos inline, 465 linhas) + `app/_lp/styles.css`. Design system "Meridiano" em `docs/DESIGN.md` (tem anti-slop checklist próprio). Ver [[estado-abril-plataforma]] e [[projeto-abril-estrategia-internacional]].

**Veredito: LP NÃO tem slop.** Score 33/40, sistema autoral e disciplinado. O detector achou 34 itens, mas quase todos falsos positivos: Montserrat é mandado pelo DESIGN.md; o `side-tab` em body.html:47 é um triângulo CSS (ícone de play); `transition:width` são barras de progresso. Não silenciei nada.

**Já corrigido e no ar** (commit `4822199`): contraste do copyright do rodapé (`body.html:445`, `#5F7469`→`#8FA398`).

**RESOLVIDO 21/jul (decisão do Pedro):** o ✗ vermelho `#b0413e` do comparativo "Por conta própria" (`body.html:277-280`) virou neutro `#6D6D6D` (o cinza do próprio texto da coluna) — o Pedro escolheu neutralizar. DS reserva vermelho só p/ erro/reprovação e proíbe 2ª cor competindo com o dourado. Replicado em `scripts/port-lp.mjs` (etapa 7d) p/ sobreviver a re-portes. **Armadilha descoberta e corrigida no mesmo passo:** a correção do copyright (`4822199`) tinha sido feita SÓ no body.html, nunca no `port-lp.mjs` (linha 127 ainda gerava `#5F7469`) — rodar o port revertia o contraste AA. Corrigi o port também. Regra reforçada: TODA troca estável na LP vai no port-lp.mjs, senão o re-porte reverte.
- ~~Afordância: célula "R$ 397" da ficha técnica~~ **RESOLVIDO 21/jul:** seta `→` dourada 15px sempre visível ao lado do preço (opção A). Sinaliza destino sem depender de hover/mobile. No port `port-lp.mjs` etapa 7e.
- ~~Captions `#8F887E` a 10px no limite AA~~ **RESOLVIDO 21/jul (opção A cirúrgica):** os 11 usos de `--pedra #8F887E` em texto PEQUENO (10–14px, ~3.3:1) foram para `--medio #6D6D6D` (~5.2:1, passa AA); os 5 grandes (26px dos "+", 20px/600 do "Por conta própria") mantêm `--pedra` (3:1 já basta, leveza proposital). Regra nova de DS: secundário pequeno=medio, grande=pedra. Feito no `port-lp.mjs` etapa 7f (global replace + restaura os 2 grandes) — não editei body.html à mão, o port re-gera. **Backlog da LP: ZERADO.**

**Armadilha do dev server (nota de sessão):** `app/page.tsx:24-26` lê `body.html`/`styles.css` com `readFileSync` em ESCOPO DE MÓDULO → o Next dev cacheia e NÃO faz hot-reload quando só o `body.html` muda (nem `touch page.tsx` resolve de forma confiável). Para ver mudança da LP no browser, é preciso REINICIAR o dev server (matar PID na 3000 + `next dev`). Alternativa não aplicada: mover o `readFileSync` p/ dentro do componente `Home()` (runtime) — resolveria de vez sem afetar o SSG de produção; sugerir ao Pedro se voltar a incomodar.

**Backlog na ÁREA DO ALUNO (fora do escopo "só LP" desta sessão):**
- Travessão em `app/app/_ui/screens/aula.html:27` (viola "zero travessões" do DS).
- Cores fora da paleta como 2º/3º acento em `resultado.html`/`resultado-reprovado.html` (#1F8A5B, #e0a54e, #c0392b) e azul LinkedIn `#0A66C2` em `certificado.html:39`.
- Radius 16px estoura teto de 14px em `home.html:5`.
- Prova (`prova-questao.html`): sem grade de questões nem modal de confirmação de envio — maior ansiedade (tentativa única, 120min), menor UX. É o trabalho mais pesado.
- a11y: itens de aula são `<div cursor:pointer>` sem role/tabindex (`aula.html:43-75`); aula ativa só por cor; senha pré-preenchida com `••••••••` literais nos 4 logins.

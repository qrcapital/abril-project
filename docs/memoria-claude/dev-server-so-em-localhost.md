---
name: dev-server-so-em-localhost
description: No abril-project o dev server só funciona em localhost:3000; abrir por 127.0.0.1 mata a hidratação em silêncio.
metadata: 
  node_type: memory
  type: reference
  originSessionId: da07e48c-277c-49be-85f7-4757a69d2f07
  modified: 2026-07-31T00:07:54.207Z
---

O dev server do `abril-project` (Next 16 + Turbopack) **só serve em `http://localhost:3000`**. Abrir a mesma porta por `http://127.0.0.1:3000` faz o Next tratar a origem como estrangeira e bloquear os recursos de dev:

```
⚠ Blocked cross-origin request to Next.js dev resource /_next/webpack-hmr from "127.0.0.1".
```

**O sintoma não parece rede, parece bug de código.** A página renderiza inteira (é SSR), os chunks do cliente carregam, o console fica limpo e nenhum erro aparece — mas a **hidratação nunca completa**, então nenhum `useEffect` roda e nenhum listener é ligado. Na tela de login isso aparece assim: os valores de exemplo do design (`pedro@email.com`) continuam nos campos, porque o efeito que os limpa não rodou; e clicar em ENTRAR não faz nada, sem caixa de erro e sem o botão virar "Entrando...". Requisições ao próprio `/app/login` ficam `pending` na aba.

**Why:** eu troquei para `127.0.0.1` porque a extensão do Chrome bloqueou `localhost`, e passei vários turnos investigando senha, credencial, listener do botão e cache do Turbopack antes de ler o log do dev server, onde o aviso estava desde a primeira linha.

**Como medir em um comando**, em vez de deduzir por sintoma: no `javascript_tool`, subir a árvore a partir de um campo procurando internals do React —
`let n=document.querySelector('input'),s=0; while(n&&s<12){if(Object.keys(n).some(k=>k.startsWith('__react')))break; n=n.parentElement;s++;}` — nenhum nó com `__react` significa que não hidratou. Em `localhost` o campo de e-mail também vem **vazio**, porque o efeito apaga o `value` de exemplo do design; em `127.0.0.1` ele fica com `pedro@email.com`. Cuidado com um falso positivo: `document.querySelector('nextjs-portal')` existe **sempre** em dev (é o indicador de ferramentas), então a presença dele não indica erro.

**How to apply:** o endereço é `localhost:3000` — é o que o `.env.local` configura em `NEXT_PUBLIC_SITE_URL`. Se a extensão bloquear `localhost`, o conserto é liberar o host na extensão, **não** trocar para `127.0.0.1` nem criar um `next.config` com `allowedDevOrigins` (o projeto deliberadamente não tem `next.config`). E ao investigar qualquer coisa que "não reage ao clique" nesse projeto, **ler o output do dev server antes de formular hipótese**.

## O segundo jeito de o dev server enganar (30/07/2026)

`npm run build` **com o `next dev` de pé trava o dev server**. Os dois escrevem no mesmo `.next`. O processo não morre e a porta continua escutando; ele só **para de responder**.

O sintoma é quase o mesmo do caso acima e chega como defeito de produto: a tela parece renderizada (o HTML que o navegador já tem continua lá), clique em link não faz nada, e **nenhuma requisição nova aparece no log** — o que empurra para suspeitar de hidratação ou do último commit. O Chrome ainda ajuda a enganar, respondendo `CDP Runtime.evaluate timed out... renderer may be frozen`.

**Diagnóstico em dez segundos, antes de olhar código:** `curl -m 5 -o /dev/null -w "%{http_code}" http://localhost:3000/`. Timeout com `000` enquanto `lsof -nP -iTCP:3000 -sTCP:LISTEN` mostra o processo = é isto. Conserto: matar o dev, `rm -rf .next`, subir de novo.

**How to apply:** durante sessão de dev, pare o dev antes de buildar. Eu causei isso rodando build várias vezes com o dev no ar, e o Pedro relatou como bug da tela que eu acabara de entregar.

Ver [[chrome-extension-precisa-restart]], que é o outro caso em que a mensagem de erro apontava para a causa errada.

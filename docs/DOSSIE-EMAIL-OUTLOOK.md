# Dossiê: e-mails de acesso que não chegam no Outlook/Hotmail (09/out/2026)

## O caso
- Aluna: Luana, e-mail `@outlook.com`. Compra aprovada às 13h11.
- 13h11:43 saiu o "Compra confirmada" (boas-vindas). 13h26:52 saiu uma "Redefina sua senha" pedida por ela.
- Os dois aparecem como `enviado` no `email_log`: a API do Amazon SES aceitou.
- Ela não recebeu nenhum dos dois, nem no Lixo Eletrônico.
- Os mesmos e-mails chegaram na hora no Gmail do Marcelo.

## O que foi verificado
| Item | Resultado |
| --- | --- |
| Envio aceito pelo SES | Sim, nos dois |
| Endereço na lista de supressão da conta SES | Não está (a consulta direta pelo endereço volta "não existe") |
| Ou seja, houve devolução definitiva (hard bounce)? | Não. Se a Microsoft tivesse recusado de vez, o SES teria posto o endereço na lista em minutos |
| DKIM `blocktrends.com.br` | Passa (cabeçalhos do Gmail) |
| SPF (MAIL FROM `mail.blocktrends.com.br`) | Passa |
| DMARC | Passa no Gmail, mas o registro está malformado (ver abaixo) |
| Links do e-mail | **Apontavam para `abril-project.netlify.app`**, e não para `blocktrends.abril.com.br` |

## Causas prováveis, em ordem
1. **Links para `*.netlify.app`.** Um e-mail assinado por `blocktrends.com.br` com botão para um domínio genérico de hospedagem, muito usado em golpe, é o padrão que o filtro da Microsoft (consumer: outlook.com/hotmail.com) mais segura. Ele pode aceitar a mensagem e não mostrar em pasta nenhuma, ou adiar por horas. **Corrigido:** `NEXT_PUBLIC_SITE_URL` agora é `https://blocktrends.abril.com.br` (Netlify, redeploy feito). Todos os links dos e-mails passam a sair no domínio oficial.
2. **Remetente novo no SES.** O domínio começou a mandar por SES hoje. A Microsoft costuma segurar ou atrasar (resposta 4xx "temporarily rate limited") remetente sem histórico. O SES tenta de novo por até 14 horas, então o e-mail pode chegar bem atrasado. Isso também explica a demora no primeiro teste.
3. **Registro DMARC com erro de digitação.** Hoje: `v=DMARC1; p=reject pct=100; adkim=s; aspf=sl`. Falta o `;` depois de `reject` e `aspf=sl` não existe. Provedores interpretam isso de jeitos diferentes (o Gmail lê como sem política). Correto: `v=DMARC1; p=reject; pct=100; adkim=s; aspf=r`. **Antes de trocar**, confirmar que RD Station e SendGrid assinam DKIM com `blocktrends.com.br`; senão, com `reject` valendo de verdade, os e-mails deles passam a ser recusados. Na dúvida, começar com `p=quarantine`.

## O que já foi feito
- Domínio dos links corrigido (`NEXT_PUBLIC_SITE_URL`) e site republicado.
- Admin, página do aluno: botão **Gerar link de acesso**. Gera o mesmo link de criação de senha e mostra para copiar e mandar por WhatsApp. É o plano B imediato para qualquer aluno cujo e-mail não chegue.
- Rastreio de entrega do SES (código pronto, falta ligar na AWS): cada envio guarda o `MessageId`; uma rota nova (`/api/webhooks/ses`) recebe do SNS os eventos de Entrega, Adiamento, Devolução e Reclamação; a página do aluno no admin mostra, por e-mail, "entregue", "adiado: motivo" ou "devolvido: motivo". Passo a passo em `docs/SES-RASTREIO.md`. Migration `0033_email_entrega.sql`.

## Atualização 09/10, fim do dia
- Migration 0033 rodada; rastreio de entrega ligado e testado (ver `SES-RASTREIO.md`).
- Acesso direto pós-compra no ar: `/obrigado?v=<marketplace_id>` cria a sessão e leva à criação de senha, sem depender do e-mail. Testado com a venda do Marcelo (cai em "Sua conta já está ativa", como esperado para conta já usada).
- DMARC: cabeçalhos de um e-mail do RD (02/10) mostram DKIM `d=blocktrends.com.br` (via SendGrid, seletor `s1`) e Return-Path em `emailmkt.blocktrends.com.br`. RD está alinhado. O Gmail lê o registro atual como `p=NONE`, ou seja, hoje não há política valendo.
- Registro recomendado: `v=DMARC1; p=quarantine; pct=100; adkim=r; aspf=r`. Alinhamento relaxado porque já houve envio com From em `mail.blocktrends.com.br`, que falharia com `adkim=s`. Subir para `p=reject` depois de algumas semanas sem problema.

## O que falta (Marcelo)
1. Trocar o TXT `_dmarc` no Cloudflare pelo registro acima.
2. Opcional, para reputação na Microsoft: cadastrar o domínio no Microsoft SNDS/JMRP e, se o volume crescer, avaliar IP dedicado no SES.

## Para a Luana agora
Gerar o link no admin (Alunos, Luana, **Gerar link de acesso**) e mandar por WhatsApp. Pedir também que ela adicione `contato@blocktrends.com.br` aos remetentes confiáveis do Outlook.

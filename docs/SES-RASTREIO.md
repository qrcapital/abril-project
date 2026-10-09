# Rastreio de entrega dos e-mails (SES + SNS)

Até aqui o `email_log` dizia "enviado" quando a API do SES aceitava o pedido, e mais nada. Depois
disso o SES tenta entregar ao servidor do destinatário, que pode aceitar, adiar (o Outlook faz muito
isso quando desconfia do IP) ou devolver. Com o rastreio ligado, cada um desses desfechos chega até
nós e aparece na página do aluno no admin, na seção **E-mails recentes**, coluna **Entrega**:
"entregue 09/10 13:12", "adiado: filtro de spam do destinatário", "devolvido: caixa cheia".

Sem rastreamento de abertura e de clique, de propósito: os dois reescrevem os links do e-mail e
põem um pixel, e o link de criação de senha tem de chegar intacto.

## Como funciona

```
envio com ConfigurationSetName  ->  SES publica os eventos no tópico SNS
  ->  SNS faz POST em https://blocktrends.abril.com.br/api/webhooks/ses
  ->  a rota confere tópico, certificado e assinatura, e grava em email_eventos
```

- `lib/email.ts` manda `ConfigurationSetName` quando `SES_CONFIGURATION_SET` existe, e grava o
  `MessageId` da resposta em `email_log.ses_message_id`.
- `app/api/webhooks/ses/route.ts` recebe o SNS. Recusa (403) tópico diferente de
  `SES_SNS_TOPIC_ARN`, certificado fora de `sns.<região>.amazonaws.com` e assinatura que não
  confere. Sem `SES_SNS_TOPIC_ARN`, responde 503 a tudo.
- Lógica pura e checada em `lib/sns.ts` e `lib/ses-eventos.ts` (`npm run check:sns`).
- Tabelas na migration `supabase/migrations/0033_email_entrega.sql`.

## Ordem de execução

1. Rodar a migration `0033_email_entrega.sql` no SQL editor do Supabase.
2. Fazer o deploy do código (pode ser antes do passo 1: o envio grava o log sem o id e a tela mostra
   "sem rastreio", nada quebra).
3. Fazer os passos da AWS abaixo, **na região us-east-1**, a mesma de `SES_REGION`.
4. Criar as duas variáveis na Netlify e fazer um redeploy.
5. Testar (último bloco deste documento).

A variável `SES_SNS_TOPIC_ARN` precisa estar no ar **antes** de criar a assinatura HTTPS (passo C):
é a rota que confirma a assinatura, e sem a variável ela responde 503 ao pedido de confirmação.

## A. Configuration set

1. Console da AWS, região **Leste dos EUA (N. Virgínia), us-east-1** no canto superior direito.
2. **Amazon SES > Configuration sets > Create set**.
3. Nome: `estrategia-transacional`.
4. Deixe o resto no padrão. Em **Reputation options**, mantenha **Reputation metrics** ligado.
   Não ligue nada de **Open** ou **Click tracking**. Em **Suppression list settings**, deixe
   herdar da conta.
5. **Create set**.

## B. Tópico SNS

1. **Amazon SNS > Topics > Create topic**, ainda em us-east-1.
2. Tipo **Standard** (o SES não publica em tópico FIFO).
3. Nome: `ses-eventos-estrategia`.
4. **Create topic**. Copie o **ARN** que aparece no topo, no formato
   `arn:aws:sns:us-east-1:<conta>:ses-eventos-estrategia`. Ele vira a variável `SES_SNS_TOPIC_ARN`.
5. Ainda no tópico, **Edit > Access policy**, e acrescente ao `Statement` a permissão para o SES
   publicar (troque `<conta>` pelo número da conta AWS, 12 dígitos):

   ```json
   {
     "Sid": "ses-publica-eventos",
     "Effect": "Allow",
     "Principal": { "Service": "ses.amazonaws.com" },
     "Action": "sns:Publish",
     "Resource": "arn:aws:sns:us-east-1:<conta>:ses-eventos-estrategia",
     "Condition": {
       "StringEquals": {
         "AWS:SourceAccount": "<conta>",
         "AWS:SourceArn": "arn:aws:ses:us-east-1:<conta>:configuration-set/estrategia-transacional"
       }
     }
   }
   ```

   **Save changes**. Na prática não foi preciso: tópico e configuration set na mesma conta, e os
   eventos chegaram sem essa política (teste de 09/10). Só use se um dia os eventos pararem.

> **Ligado em 09/10/2026.** Configuration set `estrategia-transacional`, tópico
> `arn:aws:sns:us-east-1:540579831301:ses-eventos-estrategia`, assinatura HTTPS confirmada,
> destino `sns-eventos` com Send, Delivery, Bounce, Complaint, Reject, DeliveryDelay e Rendering
> failure. Variáveis na Netlify e redeploy feitos. Teste no simulador gravou Send e Delivery em
> `email_eventos` em 1 segundo.

## C. Variáveis na Netlify (antes da assinatura)

Em **Site configuration > Environment variables**, escopo **Production**:

| Variável | Valor |
| --- | --- |
| `SES_CONFIGURATION_SET` | `estrategia-transacional` |
| `SES_SNS_TOPIC_ARN` | o ARN do passo B.4 |

Depois, **Deploys > Trigger deploy > Deploy site**, para a função pegar as variáveis.

A política do usuário IAM `ses-estrategia-internacional` (LIGAR-VENDAS.md, passo 5) usa
`"Resource": "*"`, o que já cobre o configuration set. Se um dia ela for restrita por ARN, inclua
`arn:aws:ses:us-east-1:<conta>:configuration-set/estrategia-transacional` em `ses:SendEmail`, senão
todo envio volta 403.

## D. Assinatura HTTPS no tópico

1. **Amazon SNS > Topics > ses-eventos-estrategia > Create subscription**.
2. Protocolo **HTTPS**. Endpoint: `https://blocktrends.abril.com.br/api/webhooks/ses`.
3. **Não** marque **Enable raw message delivery**: a rota confere a assinatura do envelope do SNS,
   e no modo cru ele não vem.
4. **Create subscription**. O SNS manda um pedido de confirmação, e a rota confirma sozinha. Em
   alguns segundos, o status passa de **Pending confirmation** para **Confirmed** (atualize a lista).
   Se ficar pendente, veja o log da função na Netlify, procurando por `[ses-webhook]`.

## E. Destino de eventos do configuration set

1. **Amazon SES > Configuration sets > estrategia-transacional > Event destinations > Add destination**.
2. Tipos de evento, marque: **Sends**, **Deliveries**, **Hard bounces** (Bounce), **Complaints**,
   **Rejects**, **Delivery delays** e **Rendering failures**. Deixe **Opens**, **Clicks** e
   **Subscriptions** desmarcados.
3. **Next**. Destination type **Amazon SNS**, nome `sns-eventos`, **Event publishing** ligado, e
   escolha o tópico `ses-eventos-estrategia`.
4. **Next > Add destination**.

## F. Teste

1. No admin, abra um aluno de teste e use **Reenviar acesso** (ou mande um teste em `/admin/emails`).
2. Em até um minuto, a seção **E-mails recentes** do aluno deve mostrar o envio com
   "entregue dd/mm hh:mm". Antes do Delivery chegar, aparece "aceito pelo SES, sem retorno do
   destinatário".
3. Para testar devolução sem prejudicar a reputação, mande para `bounce@simulator.amazonses.com`
   pelo console do SES (**Identities > blocktrends.com.br > Send test email**, escolhendo o
   configuration set) e confira a linha em `email_eventos` no Supabase:

   ```sql
   select tipo, destinatario, detalhe, ocorrido_em from email_eventos order by recebido_em desc limit 20;
   ```

## Lendo o que aparece

| Na tela | O que quer dizer |
| --- | --- |
| entregue dd/mm hh:mm | O servidor do destinatário aceitou a mensagem. Se a pessoa não acha, está no spam ou numa regra da caixa dela. |
| adiado: ... | O servidor do destinatário recusou por ora, e o SES segue tentando até o prazo (o "desiste em" no detalhe). No Outlook, `4.7.650` ou `SpamDetected` é reputação do IP compartilhado do SES. |
| devolvido: ... | Não vai chegar. Permanente: endereço não existe ou foi suprimido. Temporário: caixa cheia e similares, depois das tentativas. |
| marcado como spam pelo destinatário | A pessoa clicou em "isto é spam". O SES põe o endereço na supressão. |
| aceito pelo SES, sem retorno do destinatário | Só o Send chegou. Normal nos primeiros segundos. |
| sem retorno do SES ainda | O envio tem id, mas nenhum evento chegou: o configuration set ou a assinatura não estão ligados. |
| sem rastreio | Envio anterior a este rastreio, ou feito pelo Resend. |

Para procurar por endereço, sem passar pelo aluno:

```sql
select e.tipo, e.detalhe, e.ocorrido_em, l.template
  from email_eventos e
  left join email_log l on l.ses_message_id = e.ses_message_id
 where lower(e.destinatario) = lower('aluna@outlook.com')
 order by e.ocorrido_em desc;
```

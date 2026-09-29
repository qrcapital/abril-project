# Ligar as vendas: checklist do dono

O que precisa ser feito fora do código para uma compra no Guru virar aluno com acesso e e-mail
na caixa de entrada. Siga na ordem. Nenhum valor secreto vai neste arquivo nem no repositório:
tudo que é chave entra no painel da Netlify, no contexto **Production**.

Os nomes de menu da AWS, do Guru e do Supabase mudam de vez em quando. Se um caminho não bater
exatamente, procure pelo nome da opção.

## A. Amazon SES (envio dos e-mails)

1. Entre no console da AWS e troque a região, no canto superior direito, para **América do Sul
   (São Paulo), sa-east-1**. Tudo abaixo acontece nessa região.
2. Abra **Amazon SES > Identities > Create identity**, escolha **Domain** e digite
   `blocktrends.com.br`. Deixe marcado **Easy DKIM** (RSA 2048).
3. O SES mostra **3 registros CNAME**. Cadastre os três no DNS de `blocktrends.com.br`, do jeito
   que aparecem. Em até algumas horas o status muda para **Verified**.
4. Opcional, e recomendado: em **Custom MAIL FROM domain**, use `mail.blocktrends.com.br` e
   cadastre os dois registros que o SES pedir (um MX e um TXT). Aproveite e crie o TXT de DMARC
   em `_dmarc.blocktrends.com.br` com `v=DMARC1; p=none; rua=mailto:contato@blocktrends.com.br`.
5. Abra **IAM > Users > Create user**. Nome sugerido: `ses-estrategia-internacional`, sem acesso
   ao console. Em permissões, escolha **Attach policies directly > Create policy > JSON** e cole:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["ses:SendEmail", "ses:SendRawEmail"],
         "Resource": "*",
         "Condition": { "StringEquals": { "aws:RequestedRegion": "sa-east-1" } }
       }
     ]
   }
   ```

   Esse usuário só consegue mandar e-mail, e só em São Paulo.
6. No usuário criado, abra **Security credentials > Create access key**, tipo **Application
   running outside AWS**. Copie o **Access key ID** e o **Secret access key**. O segredo aparece uma
   vez só.
7. Peça a saída do sandbox em **Amazon SES > Account dashboard > Request production access**.
   Tipo de e-mail: **Transactional**. Site: `https://blocktrends.abril.com.br`. Texto sugerido para
   o campo de caso de uso (a análise é em inglês):

   > We send transactional email only, to customers who bought an online course
   > ("Estrategia Internacional", by VEJA Negocios and BlockTrends): account access link after
   > purchase, password reset requested by the user, and exam result. Recipients are buyers
   > whose purchase was confirmed by our payment platform (Digital Manager Guru); we do not send
   > marketing and do not use purchased lists. Expected volume is up to 5,000 recipients in the
   > launch week and a few hundred per month afterwards. Bounces and complaints are monitored
   > through the SES account dashboard, and addresses that bounce are not retried.

   Enquanto o pedido não é aprovado, o SES só entrega para endereços verificados um a um em
   **Identities**. Para testar antes da aprovação, verifique o seu próprio e-mail ali.
8. Na Netlify, em **Site configuration > Environment variables**, crie as três variáveis com
   escopo **Production**:
   - `SES_REGION` = `sa-east-1`
   - `SES_ACCESS_KEY_ID` = o Access key ID do passo 6
   - `SES_SECRET_ACCESS_KEY` = o Secret access key do passo 6

   Não use nomes começando com `AWS_`: a Netlify reserva esses para ela e ignora o valor.

## B. Guru (checkout e aviso de compra)

1. Confira que o produto e a oferta da Estratégia Internacional existem no Guru e que o
   **Pagar.me** está configurado como meio de pagamento da oferta.
2. Em **Configurações > Webhooks**, crie um webhook novo:
   - URL: `https://blocktrends.abril.com.br/api/webhooks/guru`
   - tipo: vendas (transações)
   - status: **Aprovada, Completa, Reembolsada e Chargeback**
   - filtre pelo produto da Estratégia Internacional
3. Em **Configurações > API**, copie o **Account Token** e cole na Netlify como `GURU_API_TOKEN`
   (Production). Sem ele, em produção, o site recusa todo aviso do Guru.
4. Copie o **ID do produto** (e o ID da oferta, se quiser amarrar a uma oferta só) e cole em
   `GURU_PRODUCT_IDS`, separados por vírgula. É a segunda trava, além do filtro do passo 2.
5. Copie o **link do checkout** da oferta e cole em `NEXT_PUBLIC_CHECKOUT_URL`. É para lá que o
   botão "GARANTIR MINHA VAGA" da página do curso leva. Tem de começar com `https://`.

## C. Supabase (contas e senhas)

1. **Authentication > Providers > Email**: coloque **Email OTP Expiration** em `86400` (24 horas).
   É o prazo do link de boas-vindas e também o do link de nova senha: o Supabase tem um prazo só
   para os dois, e os e-mails dizem "24 horas" por isso.
2. Na mesma área, **desligue o cadastro público** ("Allow new users to sign up"). A conta nasce
   da compra; o site cria o aluno por dentro, e isso continua funcionando com o cadastro desligado.
3. **Minimum password length**: `8`.
4. **Authentication > URL Configuration**: Site URL `https://blocktrends.abril.com.br`. Em
   Redirect URLs, só endereços completos, sem `*`: `https://blocktrends.abril.com.br/auth/confirm`
   (e o de homolog, se ele for usado).
5. No **SQL Editor**, rode as migrations `supabase/migrations/0024_*.sql` e depois
   `supabase/migrations/0025_guru_eventos.sql`, nessa ordem. Para conferir que as funções novas
   ficaram fechadas, rode:

   ```sql
   select has_function_privilege('anon', 'consumir_limite(text,int,int)', 'EXECUTE'),
          has_function_privilege('anon', 'usuario_por_email(text)', 'EXECUTE');
   ```

   As duas colunas têm de sair `false`.

## D. Netlify (o ambiente de produção)

1. Em **Environment variables**, confira que `NEXT_PUBLIC_APP_ENV` vale `production` no contexto
   Production, e que não existe outro valor sobrescrevendo pelo painel. Sem essa variável o site
   já se comporta como produção, mas o valor explícito evita dúvida.
2. Confira também `NEXT_PUBLIC_SITE_URL` = `https://blocktrends.abril.com.br` em Production. Os
   links dos e-mails saem dela, e sem ela os e-mails de acesso não são enviados.
3. **Não** crie `CADASTRO_ABERTO` em Production. Ela abre o cadastro sem compra.
4. Em **Domain management**, confira que `blocktrends.abril.com.br` aponta para o deploy de
   **Production** (branch `main`), e não para um deploy de branch.
5. Depois de criar ou mudar qualquer variável que começa com `NEXT_PUBLIC_`, dispare um deploy
   novo (**Deploys > Trigger deploy**). Essas variáveis entram no site na hora do build.

## E. Compra de teste

1. No Guru, crie um cupom de 100% (ou uma oferta de valor simbólico) só para o teste.
2. Compre com um e-mail seu. Se o SES ainda estiver no sandbox, use um e-mail verificado no
   passo A.7.
3. Em até um minuto devem acontecer quatro coisas:
   - o e-mail "Seu acesso à Estratégia Internacional está pronto" chega;
   - no admin, **Painel > Relatórios > Eventos do Guru** mostra a compra com resultado
     `processado`;
   - em **Alunos**, a conta aparece com matrícula ativa;
   - em **Consentimentos**, aparece uma linha de origem **Checkout (Guru)**.
4. Abra o e-mail, clique no botão, clique em **Continuar**, crie a senha e aceite os documentos.
   Você deve cair na área do aluno.
5. Na tela de login, teste **Esqueci minha senha** com o mesmo e-mail. Chega o e-mail "Redefina
   sua senha da Estratégia Internacional".
6. No Guru, reembolse a compra de teste. Em até um minuto o acesso da conta deve aparecer como
   revogado no admin.

Se o e-mail não chegar, abra **Admin > E-mails**: o log mostra o motivo. O mais comum no começo é
"Email address is not verified", que quer dizer SES ainda no sandbox e destinatário não
verificado. Se a compra não aparecer em **Eventos do Guru**, o problema está antes: URL do webhook,
filtro de status no Guru, ou `GURU_API_TOKEN` diferente do Account Token.

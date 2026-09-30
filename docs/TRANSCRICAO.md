# Transcrição das aulas (Amazon Transcribe)

As transcrições são a matéria-prima do notebook de cada módulo. O script `scripts/transcrever.mjs`
manda os vídeos para a Amazon, espera o texto e grava tudo em `transcricoes/modulo-<m>/aula-<a>.txt`.
Roda no Mac, uma vez por aula. Custo de referência: US$ 0,006 por minuto (30 horas ≈ US$ 11).

## 1. Criar o acesso na AWS (uma vez, 5 minutos)

1. No console da AWS, abra **IAM > Users > Create user**. Nome: `ei-transcricao`. Sem acesso ao console.
2. Em **Permissions**, escolha **Attach policies directly > Create policy > JSON** e cole a política abaixo.
   Troque `NOME-DO-BUCKET` por um nome único, por exemplo `ei-transcricao-qrcapital`.
   Nome da política: `ei-transcricao`. Volte à criação do usuário e anexe essa política.
3. Abra o usuário criado, **Security credentials > Create access key > Local code**. Copie as duas
   chaves. A secreta só aparece uma vez.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Bucket",
      "Effect": "Allow",
      "Action": ["s3:CreateBucket", "s3:PutBucketPublicAccessBlock", "s3:ListBucket"],
      "Resource": "arn:aws:s3:::NOME-DO-BUCKET"
    },
    {
      "Sid": "Arquivos",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:AbortMultipartUpload"],
      "Resource": "arn:aws:s3:::NOME-DO-BUCKET/*"
    },
    {
      "Sid": "Transcricao",
      "Effect": "Allow",
      "Action": ["transcribe:StartTranscriptionJob", "transcribe:GetTranscriptionJob"],
      "Resource": "*"
    }
  ]
}
```

## 2. Guardar as chaves no Mac

Na pasta `abril-project`, crie o arquivo `.env.transcricao` (ele fica fora do Git) com:

```
TRANSCRICAO_ACCESS_KEY_ID=cole-a-access-key
TRANSCRICAO_SECRET_ACCESS_KEY=cole-a-secret
TRANSCRICAO_BUCKET=ei-transcricao-qrcapital
TRANSCRICAO_REGION=us-east-1
```

## 3. Organizar os vídeos

Qualquer pasta serve, desde que o nome de cada arquivo (ou das pastas acima dele) tenha o número do
módulo e o da aula, nessa ordem. Exemplos que funcionam:

- `modulo-0/aula-1.mp4`
- `M1 A2 - Renda fixa americana.mov`
- `m3a4.mp4`

Arquivo sem os dois números é pulado com aviso.

## 4. Rodar

No Terminal, dentro da pasta `abril-project`:

```
npm install
npm run transcrever -- "/caminho/da/pasta/dos/videos"
```

- Aula que já tem `.txt` é pulada. Para refazer: acrescente `--refazer`.
- Para uma aula só: `--so m0a1`.
- Roda 4 aulas em paralelo. Uma aula de 1 hora leva uns 15 a 20 minutos na Amazon.

## O que sai

Em `transcricoes/modulo-<m>/`:

- `aula-<a>.txt`: texto em parágrafos com `[mm:ss]` e quem fala. É o que o notebook usa.
- `aula-<a>.srt`: legenda. Se quiser, sobe no Panda em "Enviar arquivo de legenda" (não gasta crédito).
- `aula-<a>.json`: resposta crua da Amazon. Fica fora do Git.

O vídeo e a saída são apagados do bucket assim que a cópia local existe. Nada fica guardado na AWS.

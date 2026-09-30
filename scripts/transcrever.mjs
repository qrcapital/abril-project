// Transcreve as aulas na Amazon Transcribe e grava o texto em `transcricoes/`, que é a matéria-prima
// do notebook de cada módulo (`content/notebooks/modulo-<n>.ts`).
//
//   node scripts/transcrever.mjs <pasta-com-os-videos>            # transcreve o que ainda não tem texto
//   node scripts/transcrever.mjs <pasta> --so m1a2                 # só a aula 2 do módulo 1
//   node scripts/transcrever.mjs <pasta> --refazer                 # refaz mesmo o que já existe
//
// RODA NO MAC, NÃO NO SERVIDOR. É um trabalho de uma vez por aula, com arquivos de gigabytes, e não
// tem por que morar no site. As bibliotecas da AWS estão em devDependencies e não entram no build.
//
// COMO ELE ACHA MÓDULO E AULA: pelo caminho do arquivo. Vale qualquer forma que tenha o número do
// módulo antes do número da aula: `modulo-1/aula-2.mp4`, `M1 A2 - Renda fixa.mov`, `m0a1.mp4`.
// Arquivo sem os dois números é pulado com aviso, nunca adivinhado.
//
// O QUE SAI, por aula, em `transcricoes/modulo-<m>/`:
//   aula-<a>.txt   texto corrido em parágrafos, com [mm:ss] e quem fala. É o que o agente do notebook lê.
//   aula-<a>.srt   legenda, se um dia quiser subir no Panda ("Enviar arquivo de legenda", sem crédito).
//   aula-<a>.json  a resposta crua da Amazon, fora do Git (pesada e só serve para reprocessar).
//
// PRIVACIDADE E CUSTO: o vídeo sobe para um bucket privado da conta, a transcrição roda em us-east-1
// (a mesma região do banco) e, terminada a aula, o vídeo e a saída são APAGADOS do bucket. A cópia que
// fica é a da sua máquina. Custo de referência: US$ 0,006 por minuto de áudio.
//
// Credenciais: `.env.transcricao` na raiz do repo (coberto pelo `.env*` do .gitignore). Modelo e
// permissões mínimas em docs/TRANSCRICAO.md. Nenhuma chave é impressa.

import { createReadStream, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative, resolve } from "node:path";

import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutPublicAccessBlockCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  GetTranscriptionJobCommand,
  StartTranscriptionJobCommand,
  TranscribeClient,
} from "@aws-sdk/client-transcribe";

import { carregarEnv } from "./env.mjs";

const EXTENSOES = new Set([".mp4", ".mov", ".m4a", ".mp3", ".wav", ".webm", ".flac", ".ogg", ".amr"]);
const FORMATO = { ".mov": "mp4", ".m4a": "mp4", ".mp4": "mp4", ".mp3": "mp3", ".wav": "wav", ".webm": "webm", ".flac": "flac", ".ogg": "ogg", ".amr": "amr" };
const PARALELO = 4;
const SAIDA = resolve("transcricoes");

// ---- argumentos --------------------------------------------------------------------------------

const args = process.argv.slice(2);
const pasta = args.find((a) => !a.startsWith("--"));
const refazer = args.includes("--refazer");
const soIdx = args.indexOf("--so");
const so = soIdx >= 0 ? args[soIdx + 1]?.toLowerCase().replace(/[^0-9ma]/g, "") : null;

if (!pasta || !existsSync(pasta)) {
  console.error("uso: node scripts/transcrever.mjs <pasta-com-os-videos> [--so m1a2] [--refazer]");
  process.exit(1);
}

if (!existsSync(".env.transcricao")) {
  console.error("falta o arquivo .env.transcricao na raiz do repo. Veja docs/TRANSCRICAO.md.");
  process.exit(1);
}
const env = carregarEnv(".env.transcricao");
const REGIAO = env.TRANSCRICAO_REGION || "us-east-1";
const BUCKET = env.TRANSCRICAO_BUCKET;
if (!env.TRANSCRICAO_ACCESS_KEY_ID || !env.TRANSCRICAO_SECRET_ACCESS_KEY || !BUCKET) {
  console.error(".env.transcricao precisa de TRANSCRICAO_ACCESS_KEY_ID, TRANSCRICAO_SECRET_ACCESS_KEY e TRANSCRICAO_BUCKET.");
  process.exit(1);
}
const credentials = {
  accessKeyId: env.TRANSCRICAO_ACCESS_KEY_ID,
  secretAccessKey: env.TRANSCRICAO_SECRET_ACCESS_KEY,
};
const s3 = new S3Client({ region: REGIAO, credentials });
const transcribe = new TranscribeClient({ region: REGIAO, credentials });

// ---- achar as aulas ----------------------------------------------------------------------------

function listar(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (nome.startsWith(".")) return [];
    return statSync(caminho).isDirectory() ? listar(caminho) : [caminho];
  });
}

/** Módulo e aula a partir do caminho: o primeiro número depois de "m"/"modulo", o próximo depois de "a"/"aula". */
function identificar(caminho) {
  const r = relative(pasta, caminho).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const m = r.match(/m(?:odulo|od)?[\s._-]*(\d{1,2})\D*?a(?:ula)?[\s._-]*(\d{1,2})/);
  return m ? { modulo: Number(m[1]), aula: Number(m[2]) } : null;
}

const aulas = [];
for (const arquivo of listar(pasta)) {
  if (!EXTENSOES.has(extname(arquivo).toLowerCase())) continue;
  const id = identificar(arquivo);
  if (!id) {
    console.warn(`pulado (sem módulo e aula no nome): ${relative(pasta, arquivo)}`);
    continue;
  }
  if (so && so !== `m${id.modulo}a${id.aula}`) continue;
  const destino = join(SAIDA, `modulo-${id.modulo}`, `aula-${id.aula}.txt`);
  if (!refazer && existsSync(destino)) {
    console.log(`já transcrita: módulo ${id.modulo}, aula ${id.aula}`);
    continue;
  }
  if (aulas.some((a) => a.modulo === id.modulo && a.aula === id.aula)) {
    console.warn(`duplicada, fica a primeira: ${relative(pasta, arquivo)}`);
    continue;
  }
  aulas.push({ ...id, arquivo });
}

if (!aulas.length) {
  console.log("nada para transcrever.");
  process.exit(0);
}
aulas.sort((a, b) => a.modulo - b.modulo || a.aula - b.aula);
console.log(`${aulas.length} aula(s) para transcrever em ${REGIAO}, bucket ${BUCKET}.\n`);

// ---- bucket ------------------------------------------------------------------------------------

async function garantirBucket() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
  } catch {
    // us-east-1 não aceita LocationConstraint; as outras regiões exigem.
    await s3.send(
      new CreateBucketCommand({
        Bucket: BUCKET,
        ...(REGIAO === "us-east-1" ? {} : { CreateBucketConfiguration: { LocationConstraint: REGIAO } }),
      }),
    );
    await s3.send(
      new PutPublicAccessBlockCommand({
        Bucket: BUCKET,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true, IgnorePublicAcls: true, BlockPublicPolicy: true, RestrictPublicBuckets: true,
        },
      }),
    );
    console.log(`bucket criado, privado: ${BUCKET}`);
  }
}

// ---- texto legível -----------------------------------------------------------------------------

const mmss = (s) => {
  const t = Math.floor(Number(s));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const ss = String(t % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
};

/**
 * Parágrafos por quem fala, com o tempo de início. Junta trechos seguidos da mesma pessoa até ~75s,
 * que é um parágrafo que se lê de uma vez e ainda dá para achar no vídeo pelo tempo.
 */
function paraTexto(json, { modulo, aula, arquivo }) {
  const r = json.results;
  const trechos = (r.audio_segments ?? []).map((s) => ({
    ini: Number(s.start_time), fim: Number(s.end_time), quem: s.speaker_label ?? "", texto: s.transcript.trim(),
  }));
  const blocos = [];
  for (const t of trechos) {
    const ult = blocos.at(-1);
    if (ult && ult.quem === t.quem && t.fim - ult.ini < 75) {
      ult.texto += " " + t.texto;
      ult.fim = t.fim;
    } else blocos.push({ ...t });
  }
  const nomeFalante = (q) => (q ? `Falante ${Number(q.replace(/\D/g, "")) + 1}` : "");
  const corpo = blocos.length
    ? blocos.map((b) => `[${mmss(b.ini)}]${b.quem ? " " + nomeFalante(b.quem) + ":" : ""} ${b.texto}`).join("\n\n")
    : r.transcripts.map((t) => t.transcript).join("\n\n");
  const cabecalho = [
    `# Módulo ${modulo}, Aula ${aula}`,
    `Arquivo de origem: ${basename(arquivo)}`,
    `Transcrição automática (Amazon Transcribe, pt-BR). "Falante 1, 2..." são as vozes detectadas; troque pelos nomes ao revisar.`,
    "",
  ].join("\n");
  return cabecalho + "\n" + corpo + "\n";
}

// ---- uma aula ----------------------------------------------------------------------------------

async function lerObjeto(chave) {
  const r = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: chave }));
  return await r.Body.transformToString("utf-8");
}

async function transcreverAula(item) {
  const { modulo, aula, arquivo } = item;
  const ext = extname(arquivo).toLowerCase();
  const nome = `m${modulo}-a${aula}`;
  const chaveEntrada = `entrada/${nome}${ext}`;
  const chaveSaida = `saida/${nome}.json`;
  const rotulo = `módulo ${modulo}, aula ${aula}`;

  const mb = (statSync(arquivo).size / 1048576).toFixed(0);
  console.log(`[${rotulo}] enviando ${mb} MB...`);
  await new Upload({
    client: s3,
    params: { Bucket: BUCKET, Key: chaveEntrada, Body: createReadStream(arquivo) },
    partSize: 32 * 1024 * 1024,
    queueSize: 4,
  }).done();

  const job = `ei-${nome}-${Date.now()}`;
  await transcribe.send(
    new StartTranscriptionJobCommand({
      TranscriptionJobName: job,
      LanguageCode: "pt-BR",
      MediaFormat: FORMATO[ext],
      Media: { MediaFileUri: `s3://${BUCKET}/${chaveEntrada}` },
      OutputBucketName: BUCKET,
      OutputKey: chaveSaida,
      Settings: { ShowSpeakerLabels: true, MaxSpeakerLabels: 4 },
      Subtitles: { Formats: ["srt"], OutputStartIndex: 1 },
    }),
  );
  console.log(`[${rotulo}] transcrevendo (${job})...`);

  let estado;
  for (;;) {
    await new Promise((r) => setTimeout(r, 20_000));
    const { TranscriptionJob: j } = await transcribe.send(new GetTranscriptionJobCommand({ TranscriptionJobName: job }));
    estado = j.TranscriptionJobStatus;
    if (estado === "COMPLETED" || estado === "FAILED") {
      if (estado === "FAILED") throw new Error(`${rotulo}: ${j.FailureReason}`);
      break;
    }
  }

  const json = JSON.parse(await lerObjeto(chaveSaida));
  const chaveSrt = chaveSaida.replace(/\.json$/, ".srt");
  let srt = null;
  try {
    srt = await lerObjeto(chaveSrt);
  } catch {
    // A legenda é bônus; sem ela a aula continua valendo.
  }

  const dir = join(SAIDA, `modulo-${modulo}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `aula-${aula}.json`), JSON.stringify(json));
  writeFileSync(join(dir, `aula-${aula}.txt`), paraTexto(json, item));
  if (srt) writeFileSync(join(dir, `aula-${aula}.srt`), srt);

  // Nada fica na nuvem: o vídeo e a saída saem do bucket assim que a cópia local existe.
  for (const Key of [chaveEntrada, chaveSaida, chaveSrt]) {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key })).catch(() => {});
  }
  const minutos = (Number(json.results.audio_segments?.at(-1)?.end_time ?? 0) / 60).toFixed(0);
  console.log(`[${rotulo}] pronta: transcricoes/modulo-${modulo}/aula-${aula}.txt (${minutos} min)`);
}

// ---- execução ----------------------------------------------------------------------------------

await garantirBucket();

const fila = [...aulas];
const falhas = [];
await Promise.all(
  Array.from({ length: Math.min(PARALELO, fila.length) }, async () => {
    for (let item = fila.shift(); item; item = fila.shift()) {
      try {
        await transcreverAula(item);
      } catch (e) {
        falhas.push(`módulo ${item.modulo}, aula ${item.aula}: ${e.message}`);
        console.error(`falhou: módulo ${item.modulo}, aula ${item.aula}: ${e.message}`);
      }
    }
  }),
);

console.log(falhas.length ? `\n${falhas.length} falha(s):\n${falhas.join("\n")}` : "\ntudo transcrito.");
if (existsSync(SAIDA)) console.log(`textos em ${SAIDA}`);
process.exit(falhas.length ? 1 : 0);

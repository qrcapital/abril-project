// Self-check de `lib/video.ts`: `npm run check:video`.
//
// O valor de `lessons.panda_video_id` é texto livre colado no admin e vira o `src` de um iframe na
// tela de todo aluno. Este check guarda as duas coisas que não aparecem em build nem em lint: que o
// id puro monta o embed da biblioteca certa, e que nada fora do Panda entra no iframe.

import assert from "node:assert/strict";

import { PANDA_BIBLIOTECA, VIDEO_EXEMPLO, embedPanda, fonteDoVideo } from "../lib/video.ts";

const ID = "39e96e48-7691-413d-9a5f-7900427a42c0";

// --- vazio cai no exemplo ---
for (const v of [null, undefined, "", "   "])
  assert.deepEqual(fonteDoVideo(v), { tipo: "exemplo", src: VIDEO_EXEMPLO });

// --- id puro monta o embed da casa ---
{
  const f = fonteDoVideo(ID);
  assert.equal(f.tipo, "panda");
  assert.equal(f.src, `https://player-vz-${PANDA_BIBLIOTECA}.tv.pandavideo.com.br/embed/?v=${ID}`);
  assert.equal(fonteDoVideo(`  ${ID}  `).src, f.src, "espaco colado junto nao pode derrubar o id");
}

// --- embed inteiro respeita a biblioteca que veio nele ---
{
  const outra = `https://player-vz-abc12345-999.tv.pandavideo.com.br/embed/?v=${ID}`;
  const f = fonteDoVideo(outra);
  assert.equal(f.tipo, "panda");
  assert.equal(f.src, embedPanda(ID, "abc12345-999"));
}

// --- outra URL do Panda: aproveita só o id ---
assert.equal(fonteDoVideo(`https://dashboard.pandavideo.com.br/videos?v=${ID}`).src, embedPanda(ID));

// --- o que não é Panda não entra no iframe ---
for (const v of [
  "javascript:alert(1)",
  `https://atacante.test/embed/?v=${ID}`,
  `http://player-vz-${PANDA_BIBLIOTECA}.tv.pandavideo.com.br/embed/?v=${ID}`,
  `https://player-vz-x.tv.pandavideo.com.br.atacante.test/embed/?v=${ID}`,
  `https://player-vz-${PANDA_BIBLIOTECA}.tv.pandavideo.com.br/embed/?v=<script>`,
  "<script>alert(1)</script>",
  "abc",
])
  assert.equal(fonteDoVideo(v).tipo, "exemplo", `deveria cair no exemplo: ${v}`);

console.log("video-check: ok");

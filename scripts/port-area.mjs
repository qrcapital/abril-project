import fs from 'node:fs'; import zlib from 'node:zlib'; import sharp from 'sharp';

// Porta o design da area do aluno (bundle Area-do-Aluno.html) tela por tela.
// Mesma filosofia do port-lp.mjs: markup+CSS reais do bundle, assets em /public/app,
// PNG/JPEG -> WebP. Cada tela vive num <sc-if value="{{ isX }}"> e e resolvida para
// seu estado padrao (hint-placeholder-val). Saida em app/app/_ui/*.

const SRC = 'referencias/htmls/Area-do-Aluno.html';
const raw = fs.readFileSync(SRC, 'utf8');
const grab = (tag) => { const o=raw.indexOf(tag); const s=raw.indexOf('>',o)+1; const e=raw.indexOf('</script>',s); return raw.slice(s,e).trim(); };
const mani = JSON.parse(grab('<script type="__bundler/manifest">'));
let html = JSON.parse(grab('<script type="__bundler/template">'));

// 1) assets: PNG/JPEG -> WebP; SVG/WOFF2/WebP passam direto. Mapa uuid -> /app/uuid.ext
const extMap = { 'image/webp':'webp','image/png':'png','image/jpeg':'jpg','image/svg+xml':'svg','font/woff2':'woff2' };
fs.mkdirSync('public/app', { recursive: true });
const paths = {};
for (const [uuid, ent] of Object.entries(mani)) {
  const ext = extMap[ent.mime]; if (!ext) continue;                 // pula JS
  let b = Buffer.from(ent.data,'base64'); if (ent.compressed) b = zlib.gunzipSync(b);
  if (ext === 'png' || ext === 'jpg') {
    b = await sharp(b).webp({ quality: 82, effort: 6 }).toBuffer();
    fs.writeFileSync(`public/app/${uuid}.webp`, b); paths[uuid] = `/app/${uuid}.webp`;
  } else {
    fs.writeFileSync(`public/app/${uuid}.${ext}`, b); paths[uuid] = `/app/${uuid}.${ext}`;
  }
}
console.log('assets extraidos:', Object.keys(paths).length);

// 2) CSS (todos os <style> do helmet) + corpo (apos </helmet>)
let styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>m[1]).join('\n');
let body = html;
const hEnd = body.indexOf('</helmet>'); if (hEnd >= 0) body = body.slice(hEnd + '</helmet>'.length);
body = body.replace(/<\/?x-dc[^>]*>/gi, '').replace(/<\/?helmet[^>]*>/gi, '');
body = body.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '');

// 3) reescreve refs de asset (uuid -> caminho em /app) — no corpo E no CSS
//    (o CSS carrega as fontes via @font-face src:url(uuid); sem isso -> 404).
for (const [uuid, p] of Object.entries(paths)) {
  body = body.split(uuid).join(p);
  styles = styles.split(uuid).join(p);
}

// --- helpers -------------------------------------------------------------
// extrai o bloco <sc-if value="{{ key }}"> ... </sc-if> (balanceado) pela key
function extractScreen(src, key) {
  const at = src.indexOf(`value="{{ ${key} }}"`);
  if (at < 0) return null;
  const open = src.lastIndexOf('<sc-if', at);
  const bodyStart = src.indexOf('>', open) + 1;
  let depth = 1, i = bodyStart;
  while (depth > 0 && i < src.length) {
    const nO = src.indexOf('<sc-if', i), nC = src.indexOf('</sc-if>', i);
    if (nC < 0) break;
    if (nO >= 0 && nO < nC) { depth++; i = nO + 6; } else { depth--; i = nC + 8; }
  }
  return src.slice(bodyStart, i - 8);
}
// resolve sc-if aninhados para o estado padrao (hint true -> mantem, false -> remove)
function resolveScIf(s) {
  const re = /<sc-if\b[^>]*hint-placeholder-val="\{\{\s*(true|false)\s*\}\}"[^>]*>((?:(?!<sc-if)[\s\S])*?)<\/sc-if>/;
  let prev;
  do { prev = s; s = s.replace(re, (_, val, inner) => val === 'true' ? inner : ''); } while (s !== prev);
  return s;
}
// limpa handlers de prototipo e placeholders de conteudo conhecidos
function clean(s, vars = {}) {
  s = s.replace(/\s+onclick="\{\{[^}]*\}\}"/g, '');          // remove handlers do bundle
  for (const [k, v] of Object.entries(vars)) s = s.split(`{{ ${k} }}`).join(v);
  return s.trim();
}

// 4) telas
const outDir = 'app/app/_ui';
fs.mkdirSync(`${outDir}/screens`, { recursive: true });
fs.writeFileSync(`${outDir}/styles.css`, styles.trim());

// Login: estado padrao = loginRegular ("Bem-vindo de volta")
const login = clean(resolveScIf(extractScreen(body, 'isLogin')), { loginBtn: 'Entrar' });
fs.writeFileSync(`${outDir}/screens/login.html`, login);

// relatorio de placeholders remanescentes (para os proximos passos)
const leftover = [...login.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)].map(m => m[1]);
console.log('login.html chars:', login.length, '| placeholders restantes:', leftover.length ? [...new Set(leftover)].join(', ') : 'nenhum');
console.log('styles.css chars:', styles.length);

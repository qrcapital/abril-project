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
// x-import image-slot (arte de modulo, componente JS do bundle) -> placeholder
// on-brand. As artes ainda nao existem no design (slot); tratado como pendencia.
function stripSlots(s) {
  return s.replace(
    /<x-import\b[^>]*?placeholder="([^"]*)"[^>]*>(?:\s*<\/x-import>)?/gi,
    (_, ph) => `<div class="art-slot">${ph}</div>`
  );
}
// prepara o markup de uma tela: resolve sc-if, limpa handlers/placeholders, slots
const prep = (raw, vars) => stripSlots(clean(resolveScIf(raw), vars));

// Config de contato (mesma da LP).
const WHATSAPP = 'https://wa.me/message/W2USYZZK75FMC1';
const DPO_EMAIL = 'dpo@qr.capital';

// Rodape estruturado, igual ao da LP (Institucional / Politicas / Contato +
// copyright + voltar ao topo). Ancoras da coluna Institucional -> absolutas para
// a LP; "Voltar ao topo" recebe data-scrolltop (rolagem tratada no AreaChrome).
function buildFooter() {
  const kicker = "font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:#D9BE85;margin-bottom:4px";
  const lnk = 'style="color:#8FA398;font-size:13px;text-decoration:none;transition:color .2s ease" style-hover="color:#F7F5F2"';
  return `<footer style="background:#081F16;color:#8FA398;padding:64px 0 26px;font-family:'Montserrat',system-ui,sans-serif">
<div style="max-width:1180px;margin:0 auto;padding:0 28px;display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap">
<div style="flex:1 1 300px;min-width:240px">
<a href="/" style="display:inline-block;color:#F7F5F2;text-decoration:none">
<b style="display:block;font-family:'Playfair Display',serif;font-size:20px;letter-spacing:.26em;font-weight:500;color:#F7F5F2;line-height:1;white-space:nowrap">ESTRATÉGIA</b>
<span style="display:flex;align-items:center;gap:10px;font-size:8px;letter-spacing:.44em;color:#EDE6DD;font-weight:600;margin-top:5px;white-space:nowrap"><i style="flex:1;height:1px;background:#A98E4E;min-width:16px"></i>INTERNACIONAL<i style="flex:1;height:1px;background:#A98E4E;min-width:16px"></i></span>
</a>
<p style="font-size:12.5px;line-height:1.7;margin:18px 0 0;max-width:300px;color:#8FA398">Formação em dolarização de patrimônio e investimento internacional. BlockTrends, com chancela editorial da VEJA Negócios.</p>
</div>
<nav style="display:flex;flex-direction:column;gap:12px;flex:0 0 auto">
<div style="${kicker}">Institucional</div>
<a href="/#tese" ${lnk}>O Diagnóstico</a>
<a href="/#docentes" ${lnk}>Corpo Docente</a>
<a href="/#curriculo" ${lnk}>A Formação</a>
<a href="/#chancela" ${lnk}>Quem Assina</a>
<a href="/#faq" ${lnk}>FAQ</a>
</nav>
<div style="display:flex;flex-direction:column;gap:12px;flex:0 0 auto">
<div style="${kicker}">Políticas</div>
<a href="#" ${lnk}>Termos de uso</a>
<a href="#" ${lnk}>Privacidade · LGPD</a>
</div>
<div style="display:flex;flex-direction:column;gap:12px;flex:0 0 auto">
<div style="${kicker}">Contato</div>
<a href="${WHATSAPP}" target="_blank" rel="noopener" ${lnk}>Suporte no WhatsApp</a>
<a href="mailto:${DPO_EMAIL}" ${lnk}>DPO · ${DPO_EMAIL}</a>
</div>
</div>
<div style="max-width:1180px;margin:34px auto 0;padding:22px 28px 0;border-top:1px solid rgba(217,190,133,.14);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
<span style="font-size:11.5px;color:#5F7469">© 2026 Estratégia Internacional · 1971 Comunicações e Sistemas LTDA. Todos os direitos reservados.</span>
<a href="#" data-scrolltop="1" style="color:#8FA398;font-size:11.5px;text-decoration:none;transition:color .2s ease" style-hover="color:#D9BE85">Voltar ao topo ↑</a>
</div>
</footer>`;
}

// 4) saida
const outDir = 'app/app/_ui';
fs.mkdirSync(`${outDir}/screens`, { recursive: true });

// CSS + regra do placeholder de arte de modulo
// O container da arte e position:relative com aspect-ratio -> preenchemos exato
// com position:absolute;inset:0 (nunca transborda para cima do texto do card).
styles += `\n/* placeholder de arte de modulo (x-import image-slot pendente) */
.art-slot{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0f3226,#17513a);color:#7c9184;font-size:10px;letter-spacing:.14em;text-transform:uppercase;text-align:center;padding:10px}`;
fs.writeFileSync(`${outDir}/styles.css`, styles.trim());

// chrome compartilhado (autenticado): topbar + footer
const CHROME = { firstName: 'Pedro', initial: 'P' };

// topbar (1a ocorrencia de showChrome). O menu de conta (accountOpen) some no
// resolveScIf por ser hint-false; aqui desembrulhamos mantendo o dropdown oculto
// (id="account-menu" hidden) e marcamos o avatar (data-account-toggle) para o JS.
let topRaw = extractScreen(body, 'showChrome')
  .replace(/onclick="\{\{ toggleAccount \}\}"/, 'data-account-toggle="1"')
  .replace(/<sc-if value="\{\{ accountOpen \}\}"[^>]*>/, '')
  .replace('<div style="position:absolute;top:46px', '<div id="account-menu" hidden style="position:absolute;top:46px')
  .replace('</sc-if>', '');
const topbar = prep(topRaw, CHROME);
fs.writeFileSync(`${outDir}/chrome-top.html`, topbar);

// footer: o mesmo rodape estruturado da LP. Ancoras internas -> absolutas para a
// LP (a area nao tem essas secoes). "Voltar ao topo" rola a propria pagina (JS).
fs.writeFileSync(`${outDir}/chrome-foot.html`, buildFooter());

// telas
const screens = {
  login: prep(extractScreen(body, 'isLogin'), { loginBtn: 'ENTRAR' }),
  home:  prep(extractScreen(body, 'isHome'),  { firstName: 'Pedro' }),
};
for (const [name, out] of Object.entries(screens)) fs.writeFileSync(`${outDir}/screens/${name}.html`, out);

// relatorio de placeholders remanescentes (para os proximos passos)
for (const [name, out] of [['topbar', topbar], ['footer', buildFooter()], ...Object.entries(screens)]) {
  const left = [...out.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)].map(m => m[1]);
  console.log(`${name}: ${out.length} chars | placeholders: ${left.length ? [...new Set(left)].join(', ') : 'nenhum'}`);
}
console.log('styles.css chars:', styles.length);

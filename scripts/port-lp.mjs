import fs from 'node:fs'; import zlib from 'node:zlib';
const raw = fs.readFileSync('referencias/htmls/LP-Estrategia-Internacional.html','utf8');
const grab = (tag) => { const o=raw.indexOf(tag); const s=raw.indexOf('>',o)+1; const e=raw.indexOf('</script>',s); return raw.slice(s,e).trim(); };
const mani = JSON.parse(grab('<script type="__bundler/manifest">'));
let html = JSON.parse(grab('<script type="__bundler/template">'));

// 1) extrai assets (imagem + fonte) e monta mapa uuid -> /lp/uuid.ext
const extMap = { 'image/webp':'webp','image/png':'png','image/jpeg':'jpg','image/svg+xml':'svg','font/woff2':'woff2' };
const paths = {};
for (const [uuid, ent] of Object.entries(mani)) {
  const ext = extMap[ent.mime]; if (!ext) continue;            // pula JS
  let b = Buffer.from(ent.data,'base64'); if (ent.compressed) b = zlib.gunzipSync(b);
  fs.writeFileSync(`public/lp/${uuid}.${ext}`, b);
  paths[uuid] = `/lp/${uuid}.${ext}`;
}
console.log('assets extraidos:', Object.keys(paths).length);

// 2) remove scripts do bundler e desembrulha <sc-if> (mantem o conteudo -> VSL e WhatsApp visiveis)
html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
html = html.replace(/<sc-if[^>]*>/gi, '').replace(/<\/sc-if>/gi, '');

// 3) preenche placeholders do template
html = html.replaceAll('{{ preco }}', 'R$ 397').replaceAll('{{ parcelas }}', '10x sem juros de R$ 39,70');

// 4) reescreve referencias de asset (uuid -> caminho em /lp)
for (const [uuid, p] of Object.entries(paths)) html = html.split(uuid).join(p);

// 5) separa CSS (blocos <style> do helmet) e o markup do corpo
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>m[1]).join('\n');
let body = html;
const hEnd = body.indexOf('</helmet>');
if (hEnd >= 0) body = body.slice(hEnd + '</helmet>'.length);
body = body.replace(/<\/?x-dc[^>]*>/gi, '').replace(/<\/?helmet[^>]*>/gi, '');
body = body.replace(/<style[\s\S]*?<\/style>/gi, '');   // tira estilos do corpo (ja estao no css)

fs.writeFileSync('app/_lp/styles.css', styles.trim());
fs.writeFileSync('app/_lp/body.html', body.trim());
console.log('styles.css:', styles.length, 'body.html:', body.length);
console.log('restam placeholders?', /\{\{|<sc-if|<script/i.test(body) ? 'SIM (revisar)' : 'nao');

import fs from 'node:fs'; import zlib from 'node:zlib'; import sharp from 'sharp';
const raw = fs.readFileSync('referencias/htmls/LP-Estrategia-Internacional.html','utf8');
const grab = (tag) => { const o=raw.indexOf(tag); const s=raw.indexOf('>',o)+1; const e=raw.indexOf('</script>',s); return raw.slice(s,e).trim(); };
const mani = JSON.parse(grab('<script type="__bundler/manifest">'));
let html = JSON.parse(grab('<script type="__bundler/template">'));

// 1) extrai assets (imagem + fonte) e monta mapa uuid -> /lp/uuid.ext
// PNG/JPEG sao convertidos para WebP (peso: ~5,6MB -> ~0,7MB); SVG/WOFF2/WebP passam direto.
const extMap = { 'image/webp':'webp','image/png':'png','image/jpeg':'jpg','image/svg+xml':'svg','font/woff2':'woff2' };
const paths = {};
for (const [uuid, ent] of Object.entries(mani)) {
  const ext = extMap[ent.mime]; if (!ext) continue;            // pula JS
  let b = Buffer.from(ent.data,'base64'); if (ent.compressed) b = zlib.gunzipSync(b);
  if (ext === 'png' || ext === 'jpg') {                        // rasteriza pesado -> WebP
    b = await sharp(b).webp({ quality: 82, effort: 6 }).toBuffer();
    fs.writeFileSync(`public/lp/${uuid}.webp`, b);
    paths[uuid] = `/lp/${uuid}.webp`;
  } else {
    fs.writeFileSync(`public/lp/${uuid}.${ext}`, b);
    paths[uuid] = `/lp/${uuid}.${ext}`;
  }
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

// 6) performance de imagem: decoding assincrono em todas; lazy-load da 9a img em diante
//    (as 8 primeiras cobrem logo + hero -> ficam eager para nao penalizar o LCP).
let imgN = 0;
body = body.replace(/<img\b(?![^>]*\bloading=)/gi, (m) => (++imgN > 8 ? '<img loading="lazy"' : m));
body = body.replace(/<img\b(?![^>]*\bdecoding=)/gi, '<img decoding="async"');

// 7) aplica o glow pulsante (.vs-hl, mesmo da secao "A Diferenca") ao card de
//    preco da Oferta. Match pela borda dourada, que so esse card usa.
{
  const before = body;
  body = body.replace(
    /<div style="(background:#F7F5F2;color:#333333;border-radius:14px;border-top:3px solid #A98E4E;[^"]*)"/,
    '<div class="vs-hl" style="$1"'
  );
  if (body === before) console.warn('AVISO: card de preco nao encontrado para o glow (.vs-hl) — revisar seletor.');
}

// 8) pluga o link do WhatsApp (botao flutuante + link do rodape), que vem como
//    href="#" no bundle. Trocar aqui caso o canal mude.
{
  const WHATSAPP = 'https://wa.me/message/W2USYZZK75FMC1';
  let n = 0;
  const rel = `href="${WHATSAPP}" target="_blank" rel="noopener"`;
  // botao flutuante: identificado pelo title de placeholder
  body = body.replace(
    /<a href="#"(\s+title="Suporte via WhatsApp)[^"]*"/,
    (_, g1) => { n++; return `<a ${rel}${g1}"`; }
  );
  // link "Suporte no WhatsApp" no rodape
  body = body.replace(
    /<a href="#"(\s+style="[^"]*">Suporte no WhatsApp<\/a>)/,
    (_, g1) => { n++; return `<a ${rel}${g1}`; }
  );
  if (n < 2) console.warn(`AVISO: WhatsApp plugado em ${n}/2 pontos — revisar seletores.`);
}

fs.writeFileSync('app/_lp/styles.css', styles.trim());
fs.writeFileSync('app/_lp/body.html', body.trim());
console.log('styles.css:', styles.length, 'body.html:', body.length);
console.log('restam placeholders?', /\{\{|<sc-if|<script/i.test(body) ? 'SIM (revisar)' : 'nao');

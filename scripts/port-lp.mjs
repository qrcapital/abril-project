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

// Config de contato (trocar aqui caso mude o canal / DPO).
const WHATSAPP = 'https://wa.me/message/W2USYZZK75FMC1';
const DPO_EMAIL = 'dpo@qr.capital';

// 8) pluga o WhatsApp no botao flutuante (vem como href="#" no bundle).
{
  const before = body;
  body = body.replace(
    /<a href="#"(\s+title="Suporte via WhatsApp)[^"]*"/,
    (_, g1) => `<a href="${WHATSAPP}" target="_blank" rel="noopener"${g1}"`
  );
  if (body === before) console.warn('AVISO: botao flutuante do WhatsApp nao encontrado — revisar seletor.');
}

// 9) substitui o rodape do bundle (uma linha so) por um rodape estruturado,
//    inspirado no cca.blocktrends.com.br (mesma empresa): colunas Institucional /
//    Politicas / Contato + barra de copyright e "voltar ao topo". Mantem a
//    identidade Meridiano (verde/dourado, Playfair), nao o preto da referencia.
{
  const kicker = "font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:#D9BE85;margin-bottom:4px";
  const lnk = 'style="color:#8FA398;font-size:13px;text-decoration:none;transition:color .2s ease" style-hover="color:#F7F5F2"';
  const newFooter = `<footer style="background:#081F16;color:#8FA398;padding:64px 0 26px;font-family:'Montserrat',system-ui,sans-serif">
<div style="max-width:1180px;margin:0 auto;padding:0 28px;display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap">
<div style="flex:1 1 300px;min-width:240px">
<div style="font-family:'Playfair Display',serif;font-size:21px;letter-spacing:.05em;color:#F7F5F2;line-height:1">ESTRATÉGIA</div>
<div style="font-size:10.5px;letter-spacing:.36em;color:#D9BE85;margin-top:4px">INTERNACIONAL</div>
<p style="font-size:12.5px;line-height:1.7;margin:18px 0 0;max-width:300px;color:#8FA398">Formação em dolarização de patrimônio e investimento internacional. BlockTrends, com chancela editorial da VEJA Negócios.</p>
</div>
<nav style="display:flex;flex-direction:column;gap:12px;flex:0 0 auto">
<div style="${kicker}">Institucional</div>
<a href="#tese" ${lnk}>O Diagnóstico</a>
<a href="#docentes" ${lnk}>Corpo Docente</a>
<a href="#curriculo" ${lnk}>A Formação</a>
<a href="#chancela" ${lnk}>Quem Assina</a>
<a href="#faq" ${lnk}>FAQ</a>
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
<a href="#hero" style="color:#8FA398;font-size:11.5px;text-decoration:none;transition:color .2s ease" style-hover="color:#D9BE85">Voltar ao topo ↑</a>
</div>
</footer>`;
  const before = body;
  body = body.replace(/<footer[\s\S]*?<\/footer>/i, newFooter);
  if (body === before) console.warn('AVISO: rodape do bundle nao encontrado para substituir.');
}

fs.writeFileSync('app/_lp/styles.css', styles.trim());
fs.writeFileSync('app/_lp/body.html', body.trim());
console.log('styles.css:', styles.length, 'body.html:', body.length);
console.log('restam placeholders?', /\{\{|<sc-if|<script/i.test(body) ? 'SIM (revisar)' : 'nao');

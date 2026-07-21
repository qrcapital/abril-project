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

// icone de alerta adicionado manualmente (referencias/cowork/atencao.png) -> WebP.
// Preto com alpha; recolorido via CSS mask onde usado (tela de reprovacao).
if (fs.existsSync('referencias/cowork/atencao.png')) {
  const ico = await sharp('referencias/cowork/atencao.png').webp({ quality: 90 }).toBuffer();
  fs.writeFileSync('public/app/atencao.webp', ico);
}

// Logos VEJA / BlockTrends em PNG rasterizado para o PDF do certificado
// (html2canvas nao renderiza <img src=".svg"> nem o filtro brightness(0)).
// VEJA colorida; BlockTrends invertida (branco -> preto, como o filtro na tela).
for (const [uuid, neg] of [['730df0c2-a863-41bb-a324-2761feacb44d', false], ['86f67e34-cae4-4c8a-b9eb-8a5073249b89', true]]) {
  const svgPath = `public/app/${uuid}.svg`;
  if (!fs.existsSync(svgPath)) continue;
  let img = sharp(svgPath, { density: 300 }).resize({ width: 520 });
  if (neg) img = img.negate({ alpha: false });
  fs.writeFileSync(`public/app/${uuid}.png`, await img.png().toBuffer());
}

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

// expande o <sc-for> de alternativas da prova em 4 opcoes (A-D), estado
// nao-selecionado. O texto real das questoes vem do Supabase; aqui e placeholder.
// data-alt="X" marca cada opcao para o QuizClient tratar a selecao.
function expandAlternatives(s) {
  const box = 'display:flex;align-items:center;gap:14px;padding:15px 18px;border:1.5px solid #E4DACC;border-radius:10px;cursor:pointer;background:#fff;margin-bottom:10px;transition:all .14s ease';
  const dot = 'width:26px;height:26px;flex:0 0 auto;border-radius:50%;border:1.5px solid #C9BCA8;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#7E6836';
  const texts = {
    A: 'Primeira alternativa de resposta (exemplo).',
    B: 'Segunda alternativa de resposta (exemplo).',
    C: 'Terceira alternativa de resposta (exemplo).',
    D: 'Quarta alternativa de resposta (exemplo).',
  };
  const items = ['A', 'B', 'C', 'D'].map((L) =>
    `<div data-alt="${L}" style="${box}"><span style="${dot}">${L}</span><span style="font-size:13.5px;color:#333333;line-height:1.4">${texts[L]}</span></div>`
  ).join('\n');
  return s.replace(/<sc-for[\s\S]*?<\/sc-for>/, items);
}

// expande o <sc-for> do NPS (certificado) em 11 botoes 0..10, reusando o estilo
// do template. data-nps="n" marca cada botao para o CertificadoClient tratar.
function expandNps(s) {
  return s.replace(/<sc-for list="\{\{ npsScale \}\}"[\s\S]*?<\/sc-for>/, (block) => {
    const tpl = block.match(/<button[\s\S]*?<\/button>/)[0];
    return Array.from({ length: 11 }, (_, i) =>
      tpl.replace('<button', `<button data-nps="${i}"`).split('{{ n }}').join(String(i))
    ).join('\n');
  });
}

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
.art-slot{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0f3226,#17513a);color:#7c9184;font-size:10px;letter-spacing:.14em;text-transform:uppercase;text-align:center;padding:10px}
/* glow pulsante (mesmo da LP: card de preco / secao A Diferenca) */
.vs-hl{animation:vsGlow 2.6s ease-in-out infinite;will-change:box-shadow}
@keyframes vsGlow{0%,100%{box-shadow:0 12px 30px rgba(11,45,32,.18),0 0 0 1px rgba(217,190,133,.35)}50%{box-shadow:0 22px 66px rgba(217,190,133,.55),0 0 0 3px rgba(217,190,133,.8)}}`;
fs.writeFileSync(`${outDir}/styles.css`, styles.trim());

// chrome compartilhado (autenticado): topbar + footer.
// Os nomes saem envoltos em <span data-u="..."> para o AreaChrome (client) injetar
// o nome do aluno logado em runtime (data-u: full | first | initial). Sem isso, o
// nome ficaria "assado" no HTML e todos veriam o mesmo. Ver AreaChrome.tsx.
const CHROME = { firstName: '<span data-u="first">Pedro</span>', initial: '<span data-u="initial">P</span>' };

// topbar (1a ocorrencia de showChrome). O menu de conta (accountOpen) some no
// resolveScIf por ser hint-false; aqui desembrulhamos mantendo o dropdown oculto
// (id="account-menu" hidden) e marcamos o avatar (data-account-toggle) para o JS.
let topRaw = extractScreen(body, 'showChrome')
  .replace(/onclick="\{\{ toggleAccount \}\}"/, 'data-account-toggle="1"')
  .replace(/onclick="\{\{ goHome \}\}"/g, 'data-home="1"')   // wordmark + "Início"
  .replace(/<sc-if value="\{\{ accountOpen \}\}"[^>]*>/, '')
  .replace('<div style="position:absolute;top:46px', '<div id="account-menu" hidden style="position:absolute;top:46px')
  .replace('</sc-if>', '');
const topbar = prep(topRaw, CHROME);
fs.writeFileSync(`${outDir}/chrome-top.html`, topbar);

// footer: o mesmo rodape estruturado da LP. Ancoras internas -> absolutas para a
// LP (a area nao tem essas secoes). "Voltar ao topo" rola a propria pagina (JS).
fs.writeFileSync(`${outDir}/chrome-foot.html`, buildFooter());

// telas
const V = {
  // nomes envoltos em <span data-u="..."> (ver comentário do CHROME acima)
  firstName: '<span data-u="first">Pedro</span>', initial: '<span data-u="initial">P</span>', loginBtn: 'ENTRAR', passMark: '70%', examMinutes: '120',
  // header da questao (valores iniciais; o QuizClient atualiza ao vivo)
  timerColor: '#A98E4E', timerDisplay: '120:00', qNumber: '1', qTotal: '20', answeredCount: '0', qPct: '5%',
  // certificado / conta
  fullName: '<span data-u="full">Pedro Teixeira</span>', accessUntil: '<span data-acesso>20/07/2027</span>',
};
// Login e suas variantes de estado. Cada estado é um sc-if do template; aqui
// viramos o hint do estado desejado para true (e o "regular" para false no 1º acesso).
const loginRaw = extractScreen(body, 'isLogin');
const flip = (s, key, from, to) =>
  s.split(`value="{{ ${key} }}" hint-placeholder-val="{{ ${from} }}"`)
   .join(`value="{{ ${key} }}" hint-placeholder-val="{{ ${to} }}"`);

const screens = {
  login:            prep(loginRaw, V),                                              // "Bem-vindo de volta"
  'login-error':    prep(flip(loginRaw, 'loginError', 'false', 'true'), V),         // senha errada
  'login-pending':  prep(flip(loginRaw, 'loginPending', 'false', 'true'), V),       // pagamento em processamento
  'login-first':    prep(                                                            // 1º acesso: defina sua senha
                      flip(flip(loginRaw, 'loginFirst', 'false', 'true'), 'loginRegular', 'true', 'false'),
                      { ...V, loginBtn: 'DEFINIR SENHA' }),
  // home: troca a estrela do card "Prova Final" pelo selo do curso (anel + olho)
  home:       prep(extractScreen(body, 'isHome'), V)
                // botão "Ver a formação" do hero removido (redundante com os cards da prateleira)
                .replace(/\s*<button[^>]*>Ver a formação<\/button>/, '')
                .replace(
                  /<div style="width:52px;height:52px;border-radius:13px;background:linear-gradient\(160deg,#D9BE85,#A98E4E\);[^"]*">\s*<svg[\s\S]*?<\/svg>\s*<\/div>/,
                  '<div style="position:relative;width:52px;height:52px;flex:0 0 auto">' +
                  '<img src="/app/dec6993b-f88c-4b38-a7bb-33d730441044.svg" alt="Selo do curso" style="width:52px;height:52px;display:block;transform:rotate(-38deg)">' +
                  '<img src="/app/280505b4-fa9f-4519-b1d2-064fbb4ecad1.webp" alt="" style="position:absolute;top:49%;left:50%;transform:translate(-50%,-50%);width:26px;height:auto;display:block">' +
                  '</div>'
                ),
  // player: bloco full-width com o video centralizado (letterbox preto). O design
  // vinha com aspect-ratio:16/6.4 + max-height, que encolhia a largura via altura.
  aula:       prep(extractScreen(body, 'isAula'), V)
                .replace('aspect-ratio:16/6.4;max-height:520px', 'width:100%;height:clamp(300px,46vw,520px)'),
  // prova (instrucoes): troca o icone de estrela pelo selo/chancela com o olho no
  // centro (mesma composicao da tela de resultado: anel + olho sobreposto).
  'prova':    prep(extractScreen(body, 'isProvaInstr'), V)
                .replace(/<div style="width:58px;height:58px;[\s\S]*?<\/svg>\s*<\/div>/,
                  '<div style="position:relative;width:92px;height:92px;margin:0 auto 18px">' +
                  '<img src="/app/dec6993b-f88c-4b38-a7bb-33d730441044.svg" alt="Chancela editorial VEJA Negócios · Grupo Abril" style="width:92px;height:92px;display:block;transform:rotate(-38deg)">' +
                  '<img src="/app/280505b4-fa9f-4519-b1d2-064fbb4ecad1.webp" alt="" style="position:absolute;top:49%;left:50%;transform:translate(-50%,-50%);width:44px;height:auto;display:block">' +
                  '</div>'),
  'prova-questao': expandAlternatives(prep(extractScreen(body, 'isProvaQ'), V)),
  // resultado: por padrao mostra a variante APROVADO (caminho feliz -> certificado).
  // REPROVADO e a outra variante (resReprovado), tratada depois se preciso.
  resultado:  prep(
                extractScreen(body, 'isResultado')
                  .replace('value="{{ resAprovado }}" hint-placeholder-val="{{ false }}"',
                           'value="{{ resAprovado }}" hint-placeholder-val="{{ true }}"'),
                V)
                // glow pulsante (.vs-hl) no card da nota, como o card de preco da LP
                .replace('<div style="display:inline-flex;flex-direction:column;align-items:center;background:#fff;border:1px solid #E4DACC;border-radius:14px;padding:22px 48px',
                         '<div class="vs-hl" style="display:inline-flex;flex-direction:column;align-items:center;background:#fff;border:1px solid #E4DACC;border-radius:14px;padding:22px 48px'),
  // variante REPROVADO (para o cenario de teste de homolog)
  'resultado-reprovado': prep(
                extractScreen(body, 'isResultado')
                  .replace('value="{{ resReprovado }}" hint-placeholder-val="{{ false }}"',
                           'value="{{ resReprovado }}" hint-placeholder-val="{{ true }}"'),
                V)
                // troca o icone pelo de alerta do cowork (atencao), recolorido em #b0413e
                .replace(/<svg width="28" height="28"[^>]*stroke="#b0413e"[\s\S]*?<\/svg>/,
                  '<span style="width:30px;height:30px;display:block;background:#b0413e;-webkit-mask:url(/app/atencao.webp) center/contain no-repeat;mask:url(/app/atencao.webp) center/contain no-repeat"></span>'),
  certificado:expandNps(prep(extractScreen(body, 'isCert'), V))
                // id no preview (para o "Baixar PDF" isolar via print)
                .replace('<div style="background:#F7F5F2;border-radius:8px;box-shadow:0 34px 80px',
                         '<div id="cert-preview" style="background:#F7F5F2;border-radius:8px;box-shadow:0 34px 80px')
                // ano de emissao no canto inferior esquerdo do certificado
                .replace(/(<div style="position:relative;border:2px solid #A98E4E;[^"]*">)/,
                  '$1<span style="position:absolute;right:26px;bottom:18px;font-size:10px;letter-spacing:.16em;color:#A98E4E;font-weight:600">2026</span>')
                // icone oficial do LinkedIn (marca "in", azul #0A66C2)
                .replace(/<svg width="15" height="15" viewBox="0 0 24 24" fill="#565049">[\s\S]*?<\/svg>/,
                  '<svg width="15" height="15" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path></svg>'),
  conta:      prep(extractScreen(body, 'isConta'), V)
                // e-mail vira dinâmico (preenchido pelo AreaChrome com o e-mail logado)
                .replace('pedro@email.com', '<span data-email>pedro@email.com</span>'),
};
for (const [name, out] of Object.entries(screens)) fs.writeFileSync(`${outDir}/screens/${name}.html`, out);

// relatorio de placeholders remanescentes (para os proximos passos)
for (const [name, out] of [['topbar', topbar], ['footer', buildFooter()], ...Object.entries(screens)]) {
  const left = [...out.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)].map(m => m[1]);
  console.log(`${name}: ${out.length} chars | placeholders: ${left.length ? [...new Set(left)].join(', ') : 'nenhum'}`);
}
console.log('styles.css chars:', styles.length);

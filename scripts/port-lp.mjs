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
let styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>m[1]).join('\n');

// 5b) hover dos cards de docente: a foto vinha em duotone VERDE no repouso, que se
//     confundia com o fundo verde da secao. Troca para preto&branco no repouso
//     (alto contraste contra o verde) revelando a COR no hover — tratamento editorial
//     classico p/ secoes de pessoas. Usa a imagem .col (colorida) com filtro; a .duo
//     (duotone) fica coberta. Inclui o filter na transicao p/ o crossfade suave.
{
  const antes = styles;
  styles = styles
    .replace('.prof .ph img{transition:transform .6s ease,opacity .5s ease}',
             '.prof .ph img{transition:transform .6s ease,opacity .5s ease,filter .5s ease}')
    .replace('.prof .ph .col{position:absolute;inset:0;opacity:0}',
             '.prof .ph .col{position:absolute;inset:0;opacity:1;filter:grayscale(1) contrast(1.04)}')
    .replace('.prof:hover .ph .col{opacity:1;transform:scale(1.05)}',
             '.prof:hover .ph .col{opacity:1;filter:grayscale(0);transform:scale(1.05)}');
  if (styles === antes) console.warn('AVISO: regras de hover dos cards de docente nao encontradas no CSS — revisar seletores.');
}
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

// 7b) "Entrar" da topbar -> rota de login da area do aluno (vem como
//     href="Area-do-Aluno.html" no bundle).
{
  const before = body;
  body = body.replace(/(<a class="tb-entrar" href=")Area-do-Aluno\.html(")/, '$1/app/login$2');
  if (body === before) console.warn('AVISO: botao "Entrar" da topbar nao encontrado — revisar seletor.');
  // padroniza o tamanho do "Entrar" com o "Inscreva-se": font 13px e altura igual.
  // padding 12/25 (nao 13/26) compensa o 1px de borda que o Inscreva nao tem, para
  // a altura final ficar identica com box-sizing content-box.
  const beforeSz = body;
  body = body.replace(
    'font-size:12px;letter-spacing:.06em;padding:10px 18px;background:transparent',
    'font-size:13px;letter-spacing:.06em;padding:12px 25px;background:transparent'
  );
  if (body === beforeSz) console.warn('AVISO: estilo do "Entrar" nao encontrado para padronizar tamanho — revisar seletor.');
}

// 7c) CTA de compra "GARANTIR MINHA VAGA" (title="checkout (D2)") -> em homolog,
//     sem Guru, leva ao primeiro acesso (simula a compra). Trocar pela URL do Guru
//     quando o checkout entrar.
{
  const before = body;
  body = body.replace(/(<a href=")#(" title="checkout \(D2\)")/, '$1/app/login?s=primeiro$2');
  if (body === before) console.warn('AVISO: CTA de checkout (D2) nao encontrado — revisar seletor.');
}

// 7d) comparativo "Por conta propria": os ✗ vinham em vermelho #b0413e (decorativo).
//     O DS reserva o vermelho so para erro/reprovacao e proibe 2a cor competindo com
//     o dourado; neutraliza para #6D6D6D (o cinza do proprio texto da coluna), assim a
//     coluna perdedora apaga e o dourado da oferta fica como acento unico. Ver DESIGN.md.
{
  const before = body;
  body = body.replaceAll('color:#b0413e">✗', 'color:#6D6D6D">✗');
  if (body === before) console.warn('AVISO: ✗ do comparativo nao encontrados para neutralizar a cor — revisar seletor.');
}

// 7e) ficha tecnica: a celula "R$ 397" e um link (#oferta) mas lia como metrica
//     estatica igual as outras 4 da regua; a afordancia de clique so aparecia no
//     hover (some no mobile). Adiciona uma seta → discreta e sempre visivel ao lado
//     do preco — sinal de destino, no mesmo dourado, subordinada pelo tamanho.
{
  const before = body;
  body = body.replace(
    /(color:#D9BE85;font-weight:600;line-height:1\.1">R\$ 397)(<\/b>)/,
    '$1 <span style="font-size:15px;font-weight:400;vertical-align:2px">→</span>$2'
  );
  if (body === before) console.warn('AVISO: celula "R$ 397" da ficha tecnica nao encontrada para a seta — revisar seletor.');
}

// 7f) contraste AA dos captions: #8F887E (--pedra) reprova AA em texto pequeno
//     (~3.3:1 sobre branco, e AA exige 4.5:1). Escurece para #6D6D6D (--medio,
//     ~5.2:1) e restaura --pedra nos DOIS usos em texto grande (26px dos "+" dos
//     acordeoes e o 20px/600 do "Por conta propria"), onde 3:1 ja basta e a leveza
//     e proposital. Regra: secundario pequeno usa --medio, grande usa --pedra.
{
  const antes = (body.match(/#8F887E/g) || []).length;
  body = body.replaceAll('#8F887E', '#6D6D6D');
  body = body.replaceAll('font-size:26px;color:#6D6D6D', 'font-size:26px;color:#8F887E');
  body = body.replaceAll('font-size:20px;font-weight:600;margin:0 0 16px;color:#6D6D6D', 'font-size:20px;font-weight:600;margin:0 0 16px;color:#8F887E');
  const grandes = (body.match(/#8F887E/g) || []).length;
  console.log(`captions AA: ${antes} usos de --pedra -> ${antes - grandes} escurecidos p/ --medio, ${grandes} grandes preservados`);
}

// 7g) marcacao de modulo nos cards de docente: o algarismo romano dourado GRANDE
//     sobreposto a foto (com text-shadow preto) nao foi aprovado. Remove SO o
//     numeral da foto — o card fica identico ao original, sem nada sobreposto; a
//     numeracao permanece no rotulo "Modulo I · <area>" logo abaixo (inalterado).
{
  const semNum = body.replace(
    /<span style="position:absolute;top:12px;left:14px;font-family:'Playfair Display',serif;font-style:italic;font-size:30px;color:#D9BE85;line-height:1;text-shadow:0 2px 8px rgba\(0,0,0,\.5\);z-index:1">(?:IV|III|II|I)<\/span>/g,
    ''
  );
  if (semNum.length >= body.length) console.warn('AVISO: docentes — numerais sobre a foto nao encontrados para remover. Revisar seletor.');
  body = semNum;
}

// 7h) cards de docente: (a) cargo em 1 linha e (b) badges de trajetoria.
//  (a) o cargo dourado tinha tracking .16em, que quebrava "Especialista em Opções · 25
//      anos" e "PhD Northwestern · CRO QR Asset" em 2 linhas; .1em cabe em 1 e mantem o ar.
//  (b) selos com as empresas/instituicoes mais relevantes de cada docente (pesquisa 2026,
//      fontes cruzadas). Pilula dourada discreta no rodape do card; margin-top:auto alinha
//      todos na base. Nomes proprios sem uppercase p/ preservar XP, UBS, QR Asset, ZenEconomics.
{
  body = body.replaceAll(
    'font-size:10px;letter-spacing:.16em;color:#D9BE85;font-weight:700;text-transform:uppercase',
    'font-size:10px;letter-spacing:.1em;color:#D9BE85;font-weight:700;text-transform:uppercase'
  );
  const chip = (t) => `<span style="font-size:9.5px;font-weight:700;letter-spacing:.02em;color:#D9BE85;background:rgba(217,190,133,.08);border:1px solid rgba(217,190,133,.32);border-radius:100px;padding:3px 9px;white-space:nowrap">${t}</span>`;
  const badges = (arr) => `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:12px">${arr.map(chip).join('')}</div>`;
  const porDocente = [
    ['distribuição para o investidor brasileiro.</p>', ['XP', 'Oyster', 'GAP Asset']],
    ['ampla experiência em instituições nacionais e internacionais.</p>', ['Banco Central', 'UBS', 'Nomura']],
    ['com mais de 25 anos de atuação.</p>', ['Bradesco', 'Safra', 'ZenEconomics']],
    ['conduz criptoativos com o rigor de quem mede antes de afirmar.</p>', ['Caixa Econômica', 'QR Asset', 'IPEA']],
  ];
  let inseridos = 0;
  for (const [ancora, empresas] of porDocente) {
    const before = body;
    body = body.replace(ancora, ancora + badges(empresas));
    if (body !== before) inseridos++;
  }
  if (inseridos !== 4) console.warn(`AVISO: badges de docente inseridas em ${inseridos}/4 cards — revisar ancoras.`);
}

// 7i) NOVA secao "Material de apoio": os entregaveis (apostilas, ebook, calculadora)
//     em mockups CSS de desktop/tablet/smartphone. Texto a esquerda, palco de 3
//     dispositivos a direita. Inserida apos o Curriculo (H5), antes do Comparativo (H6).
{
  const orn = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L13.9 10.1 L22 12 L13.9 13.9 L12 22 L10.1 13.9 L2 12 L10.1 10.1 Z"></path></svg>';
  const item = (titulo, desc) => `<li style="display:flex;gap:15px;align-items:flex-start;padding:20px 0"><span style="flex:0 0 auto;color:#A98E4E;margin-top:3px;line-height:0">${orn}</span><span style="display:block"><b style="display:block;font-family:'Playfair Display',serif;font-size:19px;color:#0B2D20;font-weight:600;margin-bottom:4px;line-height:1.2">${titulo}</b><span style="display:block;font-size:13px;line-height:1.55;color:#6D6D6D">${desc}</span></span></li>`;
  const secao = `<!-- ============ H5b · ENTREGÁVEIS ============ -->
<section id="entregaveis" data-screen-label="H5b Ferramentas" style="background:#F7F5F2;color:#333333;padding:104px 0 0;position:relative;overflow:hidden;scroll-margin-top:76px">
<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(11,45,32,.05) 1.3px, transparent 1.3px);background-size:30px 30px;pointer-events:none"></div>
<div class="entreg-grid" style="max-width:1180px;margin:0 auto;padding:0 28px;position:relative;z-index:1">
<div>
<p style="display:flex;align-items:center;gap:14px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#7E6836;font-weight:700;margin:0 0 14px"><i style="width:34px;height:1px;background:#A98E4E;display:inline-block"></i>Ferramentas</p>
<h2 style="font-family:'Playfair Display',serif;margin:0 0 20px;font-weight:600;font-size:clamp(28px,3.4vw,42px);color:#0B2D20;letter-spacing:-.01em;line-height:1.12;text-wrap:balance">Você sai com mais do que aulas. Sai com ferramentas.</h2>
<p style="font-size:15px;color:#6D6D6D;margin:0 0 34px;max-width:440px;text-wrap:pretty">Tudo que você precisa para aplicar o método continua com você depois do curso, no computador, no tablet ou no celular.</p>
<ul class="entreg-list" style="list-style:none;margin:0;padding:0">
${item('Apostilas dos módulos', 'O método por escrito, para consultar sempre que for aplicar.')}
${item('Ebook exclusivo', 'Dolarização de patrimônio destrinchada para o investidor brasileiro.')}
${item('Calculadora de dolarização', 'Simule cenários e decida com números, não com achismo.')}
</ul>
</div>
<div class="entreg-stage">
<img class="mk-img" src="/lp/mockup-devices.webp" alt="Área do aluno, e-book, apostila e calculadora de dolarização nos dispositivos">
</div>
</div>
</section>
`;
  const antes = body;
  body = body.replace('<!-- ============ H6 · VS ============ -->', secao + '<!-- ============ H6 · VS ============ -->');
  if (body === antes) console.warn('AVISO: ancora do H6 nao encontrada para inserir a secao de entregaveis.');
  styles += `
/* Secao Ferramentas (H5b) — mockup pronto (imagem final com as telas ja aplicadas). */
.entreg-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.entreg-list li{border-top:1px solid rgba(169,142,78,.22)}
.entreg-list li:first-child{border-top:none}
.entreg-stage{position:relative;width:100%;max-width:620px;margin:0 auto}
.mk-img{width:100%;height:auto;display:block}
@media(max-width:900px){.entreg-grid{grid-template-columns:1fr;gap:36px}}
`;
}

// 7j) remove a secao "A Diferenca" (Comparativo H6): a nova secao Ferramentas
//     ocupa o lugar dela. Tira o comentario do H6 e a <section id="comparativo">.
{
  const antes = body;
  body = body.replace(/<!-- ============ H6 · VS ============ -->\s*<section id="comparativo"[\s\S]*?<\/section>/, '');
  if (body === antes) console.warn('AVISO: secao Comparativo (H6) nao encontrada para remover.');
}

// 7k) refaz "Quem assina" como 2 cards: BlockTrends (chancela TECNICA — conteudo e
//      metodo) e VEJA Negocios (chancela INSTITUCIONAL — credibilidade da marca, com
//      as outras marcas do Grupo Abril). Some o termo "editorial" e o selo circular.
//      Nomenclatura ("institucional") e logos VEJA/Super Interessante = a confirmar.
{
  const kick = 'font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#7E6836;font-weight:700';
  const bignum = (v, l) => `<div style="display:flex;align-items:center;gap:13px"><span style="width:7px;height:7px;background:#A98E4E;flex:0 0 auto;transform:rotate(45deg)"></span><div style="display:flex;align-items:baseline;gap:11px"><b style="font-family:'Playfair Display',serif;font-size:26px;color:#0B2D20;font-weight:600;line-height:1;min-width:86px">${v}</b><span style="font-size:12px;color:#6D6D6D">${l}</span></div></div>`;
  // PLACEHOLDER: trocar por <img> quando as logos de VEJA e Super Interessante chegarem
  const marcaPh = (nome) => `<span style="font-family:'Playfair Display',serif;font-size:15px;color:#0B2D20;font-weight:600;letter-spacing:.01em;opacity:.85">${nome}</span>`;
  const novaChancela = `<section id="chancela" data-screen-label="H7 Quem assina" style="padding:104px 0 0;scroll-margin-top:76px">
<div style="max-width:1180px;margin:0 auto;padding:0 28px">
<div style="display:flex;justify-content:space-between;align-items:center;gap:40px;flex-wrap:wrap;margin-bottom:46px">
<div style="max-width:660px">
<p style="display:flex;align-items:center;gap:14px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#7E6836;font-weight:700;margin:0 0 14px"><i style="width:34px;height:1px;background:#A98E4E;display:inline-block"></i>Quem assina</p>
<h2 style="font-family:'Playfair Display',serif;margin:0 0 16px;font-weight:600;font-size:clamp(28px,3.6vw,44px);color:#0B2D20;letter-spacing:-.01em;line-height:1.12;text-wrap:balance">Duas instituições, uma responsabilidade.</h2>
<p style="font-size:15px;color:#6D6D6D;margin:0;max-width:560px;text-wrap:pretty">A técnica de quem operou o mercado por dentro, com a credibilidade de uma marca que o Brasil lê há mais de 70 anos.</p>
</div>
<div style="position:relative;width:122px;height:122px;flex:0 0 auto">
<img decoding="async" loading="lazy" src="/lp/selo-veja.svg" alt="Selo institucional VEJA Negócios · Grupo Abril" style="width:122px;height:122px;display:block;transform:rotate(-38deg)">
<img decoding="async" loading="lazy" src="/lp/f2070b29-906c-48d8-92c7-0948fe19573b.webp" alt="" style="position:absolute;top:49%;left:50%;transform:translate(-50%,-50%);width:60px;height:auto;display:block">
</div>
</div>
<div class="qa-grid">
<div class="qa-card">
<span style="${kick}">Chancela institucional</span>
<img decoding="async" loading="lazy" src="/lp/9d082a49-3451-447b-b123-55d3fa363e04.svg" alt="VEJA Negócios" style="width:162px;height:auto;display:block;margin:20px 0 18px">
<p style="font-size:13.5px;color:#6D6D6D;line-height:1.6;margin:0 0 26px;text-wrap:pretty">Mais de 70 anos de jornalismo de credibilidade avalizando a formação. O nome que o investidor brasileiro já conhece, assinando junto.</p>
<div style="margin-top:auto;padding-top:24px;border-top:1px solid rgba(169,142,78,.18)">
<div style="font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#8a8a8a;font-weight:700;margin-bottom:16px">Faz parte do Grupo Abril</div>
<div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">${marcaPh('VEJA')}${marcaPh('Super Interessante')}<img decoding="async" loading="lazy" src="/lp/grupo_abril.svg" alt="Grupo Abril" width="86" style="display:block;opacity:.7"></div>
</div>
</div>
<div class="qa-card">
<span style="${kick}">Chancela técnica</span>
<img decoding="async" loading="lazy" src="/lp/3e33dbd4-b8c5-4b0d-a960-befd5dc2704a.svg" alt="BlockTrends" style="width:210px;max-width:100%;height:auto;display:block;margin:18px 0 18px">
<p style="font-size:13.5px;color:#6D6D6D;line-height:1.6;margin:0 0 26px;text-wrap:pretty">Edtech de referência em criptoativos, tecnologia e finanças, responsável pelo conteúdo e pelo método da formação.</p>
<div style="margin-top:auto;padding-top:24px;border-top:1px solid rgba(169,142,78,.18);display:flex;flex-direction:column;gap:14px">
${bignum('31,5 mil', 'estudantes')}
${bignum('+1.000', 'certificados CCA®')}
${bignum('415h+', 'de conteúdo educacional')}
</div>
</div>
</div>
</div>
</section>`;
  const antes = body;
  body = body.replace(/<section id="chancela"[\s\S]*?<\/section>/, novaChancela);
  if (body === antes) console.warn('AVISO: secao Quem Assina (chancela) nao encontrada para refazer.');
  styles += `
/* Secao Quem Assina (H7) — 2 cards */
.qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:26px;align-items:stretch}
.qa-card{background:#fff;border:1px solid rgba(169,142,78,.22);border-radius:14px;padding:36px 34px;display:flex;flex-direction:column;box-shadow:0 12px 32px rgba(11,45,32,.05)}
@media(max-width:760px){.qa-grid{grid-template-columns:1fr}}
`;
}

// 8) pluga o WhatsApp no botao flutuante (vem como href="#" no bundle).
{
  const before = body;
  body = body.replace(
    /<a href="#"(\s+title="Suporte via WhatsApp)[^"]*"/,
    (_, g1) => `<a href="${WHATSAPP}" target="_blank" rel="noopener"${g1}"`
  );
  if (body === before) console.warn('AVISO: botao flutuante do WhatsApp nao encontrado — revisar seletor.');
}

// 9) substitui o rodape do bundle por um rodape ALINHADO ao da VEJA Negocios
//    (veja.abril.com.br/veja-negocios): 3 faixas — (1) logo + "SIGA" e icones
//    sociais no topo, (2) descricao + logo Grupo Abril (chancela) e as nossas
//    colunas Institucional/Politicas/Contato, (3) razao social + CNPJ na base.
//    Mantem a identidade Meridiano (verde/dourado, Playfair) e as nossas colunas;
//    o resto espelha a estrutura da VEJA. PENDENTE: links sociais reais e CNPJ.
{
  // estilo espelhando a VEJA: monocromatico branco/cinza sobre grafite/preto, sans-serif.
  const kicker = "font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#cfcfcf;margin-bottom:8px";
  const lnk = 'style="color:#9a9a9a;font-size:13px;text-decoration:none;transition:color .2s ease" style-hover="color:#ffffff"';
  const low = 'style="color:#8a8a8a;font-size:12px;text-decoration:none;transition:color .2s ease" style-hover="color:#ffffff"';
  const soc = 'style="color:#8FA398;display:inline-flex;transition:color .2s ease" style-hover="color:#D9BE85"';
  // icones sociais inline (sem lib externa), herdam cor via currentColor. href="#" = PLACEHOLDER.
  const ig = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="2.5" width="19" height="19" rx="5"></rect><circle cx="12" cy="12" r="4.2"></circle><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none"></circle></svg>';
  const yt = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5.5" width="19" height="13" rx="4"></rect><path d="M10.5 9.3l4.5 2.7-4.5 2.7z" fill="currentColor" stroke="none"></path></svg>';
  const li = '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3.2 9h3.6v12H3.2zM9.5 9h3.45v1.65h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.5V21h-3.6v-4.9c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.88 1.27-1.88 2.58V21H9.5z"></path></svg>';
  const col = (titulo, links) => `<div style="display:flex;flex-direction:column;gap:11px;flex:0 0 auto"><div style="${kicker}">${titulo}</div>${links}</div>`;
  const newFooter = `<footer style="font-family:'Montserrat',system-ui,sans-serif">
<div style="background:#0B2D20;padding:24px 0;border-bottom:1px solid rgba(217,190,133,.18)">
<div style="max-width:1180px;margin:0 auto;padding:0 28px;display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap">
<a href="#hero" style="display:inline-block;color:#F7F5F2;text-decoration:none">
<b style="display:block;font-family:'Playfair Display',serif;font-size:20px;letter-spacing:.26em;font-weight:500;color:#F7F5F2;line-height:1;white-space:nowrap">ESTRATÉGIA</b>
<span style="display:flex;align-items:center;gap:10px;font-size:8px;letter-spacing:.44em;color:#EDE6DD;font-weight:600;margin-top:5px;white-space:nowrap"><i style="flex:1;height:1px;background:#A98E4E;min-width:16px"></i>INTERNACIONAL<i style="flex:1;height:1px;background:#A98E4E;min-width:16px"></i></span>
</a>
<div style="display:flex;align-items:center;gap:16px">
<span style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:#D9BE85">Siga</span>
<a href="#" aria-label="Instagram" ${soc}>${ig}</a>
<a href="#" aria-label="YouTube" ${soc}>${yt}</a>
<a href="#" aria-label="LinkedIn" ${soc}>${li}</a>
</div>
</div>
</div>
<div style="background:#000;padding:48px 0 40px">
<div style="max-width:1180px;margin:0 auto;padding:0 28px;display:flex;justify-content:space-between;gap:48px;flex-wrap:wrap">
<div style="flex:0 1 300px;min-width:240px">
<img src="/lp/grupo_abril.svg" alt="Grupo Abril" width="150" style="display:block">
<p style="font-size:12px;line-height:1.7;margin:20px 0 0;max-width:300px;color:#8a8a8a">Formação em dolarização de patrimônio e investimento internacional. BlockTrends, com chancela editorial da VEJA Negócios.</p>
</div>
<div style="display:flex;gap:56px;flex-wrap:wrap">
${col('Institucional', `<a href="#tese" ${lnk}>O Diagnóstico</a><a href="#docentes" ${lnk}>Corpo Docente</a><a href="#curriculo" ${lnk}>A Formação</a><a href="#chancela" ${lnk}>Quem Assina</a><a href="#faq" ${lnk}>FAQ</a>`)}
${col('Políticas', `<a href="#" ${lnk}>Termos de uso</a><a href="#" ${lnk}>Privacidade · LGPD</a>`)}
${col('Contato', `<a href="${WHATSAPP}" target="_blank" rel="noopener" ${lnk}>Suporte no WhatsApp</a><a href="mailto:${DPO_EMAIL}" ${lnk}>DPO · ${DPO_EMAIL}</a>`)}
</div>
</div>
</div>
<div style="background:#000;padding:0 0 26px">
<div style="max-width:1180px;margin:0 auto;padding:22px 28px 0;border-top:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
<span style="display:flex;gap:18px;flex-wrap:wrap"><a href="#" ${low}>Termos de uso</a><a href="#" ${low}>Privacidade · LGPD</a><a href="#faq" ${low}>FAQ</a></span>
<span style="font-size:11.5px;color:#6f6f6f">Abril Comunicações S.A., CNPJ 44.597.052/0001-62 - Todos os direitos reservados.</span>
</div>
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

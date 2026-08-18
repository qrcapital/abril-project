import fs from 'node:fs'; import zlib from 'node:zlib'; import sharp from 'sharp';
import { WHATSAPP, DPO_EMAIL, regrasDeEstado } from './comum.mjs';
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
  // no rodape de cada card, as logos mono off-white das casas onde o docente atuou (no lugar
  // das pilulas de texto). tratamento mono uniforme via scripts/gen-logos-mono.mjs (fundos
  // removidos por luminancia). altura por logo p/ equalizar peso visual: wordmarks largos
  // (Nomura, ZenEconomics) menores; marcas empilhadas (Bradesco, IPEA) maiores.
  const LOGO = {
    'XP': ['dl-xp.png', 20], 'Oyster': ['dl-oyster.png', 17], 'GAP Asset': ['dl-gapasset.png', 15],
    'Banco Central': ['dl-bcb.png', 22], 'UBS': ['dl-ubs.png', 18], 'Nomura': ['dl-nomura.png', 12],
    'Bradesco': ['dl-bradesco.png', 27], 'Safra': ['dl-safra.png', 18], 'ZenEconomics': ['dl-economics.png', 26],
    'Caixa Econômica': ['dl-caixa.png', 22], 'QR Asset': ['dl-qrasset.png', 20], 'IPEA': ['dl-ipea.png', 23],
  };
  const chip = (t) => { const [f, h] = LOGO[t]; return `<span class="dl-tip" data-nome="${t}"><img decoding="async" loading="lazy" src="/lp/${f}" alt="${t}" style="height:${h}px;width:auto;opacity:.82;display:block"></span>`; };
  // min-height na faixa: as logos tem alturas diferentes (a mais alta bate 27px), e como
  // a faixa fica ancorada na base do card (margin-top:auto), a altura variavel fazia a
  // DIVISORIA subir e descer de um card para o outro. Com 28px de area util, os quatro
  // cards fecham a faixa em 43px e a linha nasce sempre na mesma altura.
  const badges = (arr) => `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:17px;min-height:28px;margin-top:auto;padding-top:15px;border-top:1px solid rgba(217,190,133,.14)">${arr.map(chip).join('')}</div>`;
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

  // cargo do Ywata: no lugar da credencial academica, o cargo executivo na Caixa (junto do CRO QR Asset).
  const antesCargo = body;
  body = body.replace('PhD Northwestern · CRO QR Asset', 'Ex-VP Caixa · CRO QR Asset');
  if (body === antesCargo) console.warn('AVISO: cargo do Ywata (PhD Northwestern) nao encontrado para trocar.');

  // tooltip flutuante no hover de cada logo (pura CSS; funciona com o body injetado). o card
  // ganha overflow:visible p/ o balao nao ser cortado, com os cantos do topo arredondados na foto.
  styles += `
/* Corpo docente — balao flutuante com o nome da empresa no hover da logo */
.prof{overflow:visible!important}
.prof .ph{border-radius:12px 12px 0 0}
.dl-tip{position:relative;display:inline-flex;align-items:center;flex:0 0 auto}
.dl-tip::after{content:attr(data-nome);position:absolute;left:50%;bottom:calc(100% + 9px);transform:translateX(-50%) translateY(4px);background:#F7F5F2;color:#0B2D20;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:.03em;white-space:nowrap;padding:4px 9px;border-radius:6px;box-shadow:0 8px 22px rgba(0,0,0,.32);opacity:0;pointer-events:none;transition:opacity .16s ease,transform .16s ease;z-index:6}
.dl-tip::before{content:"";position:absolute;left:50%;bottom:calc(100% + 4px);transform:translateX(-50%);border:5px solid transparent;border-top-color:#F7F5F2;opacity:0;transition:opacity .16s ease;z-index:6}
.dl-tip:hover{z-index:7}
.dl-tip:hover::after{opacity:1;transform:translateX(-50%) translateY(0)}
.dl-tip:hover::before{opacity:1}
@media(hover:none){.dl-tip::after,.dl-tip::before{display:none}}
`;
}

// 7h-bis) Curriculo (H5) — descricoes completas de cada aula. O bundle traz so uma linha
//   curta por aula; aqui trocamos por um paragrafo que explica os assuntos abordados. Regras
//   anti-slop do COPY.md: sem travessao, sem regra de tres, voz ativa, frases de tamanho
//   variado, concreto. line-height:1.55 nos spans p/ leitura em multiplas linhas.
{
  body = body.replaceAll('font-size:12.5px;color:#6D6D6D">', 'font-size:12.5px;color:#6D6D6D;line-height:1.55">');
  const aulas = [
    ['Risco fiscal, inflação crônica e perda do valor real.',
      'Concentrar tudo em real deixou de ser neutro; virou aposta na moeda de um país só. Você vê o histórico fiscal do Brasil e a inflação que come o poder de compra ano após ano, e entende o que a moeda forte preserva quando o ciclo aperta.'],
    ['Comparativo histórico BRL × USD e hedge cambial.',
      'O real perde valor nas janelas longas onde o dólar preserva. Comparamos as duas moedas do Plano Real até hoje e você aprende em que momento o hedge cambial sai da teoria e começa a fazer diferença no seu bolso.'],
    ['Abertura nos EUA, remessa e câmbio no dia a dia.',
      'O passo a passo para abrir sua conta nos Estados Unidos sem depender de intermediário. Você envia remessa e escolhe o câmbio certo para operar essa conta no dia a dia, com os cuidados que evitam taxa à toa e problema no imposto.'],
    ['Perfil offshore e montagem de carteira.',
      'Antes de comprar qualquer ativo lá fora, você descobre que tipo de investidor offshore você é. Definimos seu perfil de risco no exterior e montamos a estrutura de carteira global que vira base para todos os módulos seguintes.'],
    ['T-Bills, Notes, Bonds, TIPS e FRNs.',
      'A renda fixa mais segura do mundo, destrinchada por dentro. Você entende o que separa T-Bills, Notes, Bonds, TIPS e FRNs, quando cada um rende mais e como usar o Tesouro americano para ancorar a parte conservadora da carteira em dólar.'],
    ['Investment grade vs. high yield, risco-retorno.',
      'É aqui que a renda fixa lá fora paga mais, e cobra o risco por isso. Você entende a linha que separa o investment grade do high yield e aprende a medir se o prêmio oferecido compensa o risco de crédito de quem emite.'],
    ['Como encontrar, analisar e selecionar stocks.',
      'O método para escolher ações no maior mercado do planeta sem depender de palpite. Você vai encontrar empresas e ler o que os números dizem sobre elas, para selecionar papéis com critério em vez de comprar pela manchete do dia.'],
    ['Setores, múltiplos e quando preferir cada um.',
      'Duas formas de ganhar com ações, cada uma com sua hora. Comparamos as empresas que distribuem dividendos com as que reinvestem para crescer, e você define o peso de cada uma olhando o setor e o momento do seu patrimônio.'],
    ['Gestão ativa vs. passiva na carteira offshore.',
      'Como comprar centenas de empresas americanas de uma vez pagando pouco por isso. Você entende quando a gestão passiva de um ETF supera a ativa e como usar esses fundos para diversificar a carteira offshore sem virar trabalho de tempo integral.'],
    ['FFO, P/FFO e comparação com FIIs.',
      'Renda de imóveis nos Estados Unidos sem precisar comprar um prédio. Você lê um REIT pelos indicadores que realmente importam, como FFO e P/FFO, e compara com os FIIs que já conhece aqui.'],
    ['Tipos e principais fundos internacionais.',
      'A ponte para o mercado americano sem sair da B3 nem abrir conta fora. Você vê os tipos de BDR e como funcionam na prática, com os principais fundos internacionais à disposição de quem quer dólar pela corretora que já usa.'],
    ['Declaração de ativos e proteção patrimonial.',
      'A parte que quase ninguém explica, e que decide quanto do seu patrimônio sobra no fim. Você declara ativos no exterior sem erro e organiza a sucessão para proteger o que construiu do imposto e de briga lá na frente.'],
    ['Reserva de valor vs. contratos inteligentes.',
      'Os dois criptoativos que sustentam o mercado, sem hype e sem promessa de enriquecer rápido. Você entende o Bitcoin como reserva de valor escassa e o Ethereum como a rede dos contratos inteligentes, e onde cada um cabe numa carteira séria em dólar.'],
    ['Tokenização de ativos e regulação.',
      'O que existe além do Bitcoin, e o que é só barulho. Você conhece a tokenização de ativos reais, os RWAs, e vê como a regulação vem desenhando o que sobra de verdade quando a euforia passa.'],
    ['ETFs spot nos EUA e métricas on-chain.',
      'A forma regulada de ter exposição a esses ativos sem comprá-los diretamente. Você aprende a ler um ETF temático, seja de ativos digitais ou de um setor específico da economia global, e usa métricas on-chain para enxergar o que o gráfico de preço não mostra.'],
    ['Regras BR e EUA, ganho de capital, compliance.',
      'O compliance que mantém você longe de problema com a Receita. Você aprende as regras de Brasil e Estados Unidos e como calcular o ganho de capital em cripto, além do que precisa declarar para operar tranquilo.'],
  ];
  let trocadas = 0;
  for (const [de, para] of aulas) {
    const before = body;
    body = body.replace('>' + de + '<', '>' + para + '<');
    if (body !== before) trocadas++;
  }
  if (trocadas !== 16) console.warn(`AVISO: descricoes de aula trocadas em ${trocadas}/16 — revisar textos-ancora do curriculo.`);
}

// 7i) NOVA secao "Material de apoio": os entregaveis (apostilas, ebook, calculadora)
//     em mockups CSS de desktop/tablet/smartphone. Texto a esquerda, palco de 3
//     dispositivos a direita. Inserida apos o Curriculo (H5), antes do Comparativo (H6).
{
  const orn = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L13.9 10.1 L22 12 L13.9 13.9 L12 22 L10.1 13.9 L2 12 L10.1 10.1 Z"></path></svg>';
  const item = (titulo, desc) => `<li style="display:flex;gap:15px;align-items:flex-start;padding:20px 0"><span style="flex:0 0 auto;color:#A98E4E;margin-top:3px;line-height:0">${orn}</span><span style="display:block"><b style="display:block;font-family:'Playfair Display',serif;font-size:19px;color:#0B2D20;font-weight:600;margin-bottom:4px;line-height:1.2">${titulo}</b><span style="display:block;font-size:13px;line-height:1.55;color:#6D6D6D">${desc}</span></span></li>`;
  const secao = `<!-- ============ H5b · ENTREGÁVEIS ============ -->
<section id="entregaveis" data-screen-label="H5b Ferramentas" style="background:#F7F5F2;color:#333333;padding:104px 0 24px;position:relative;overflow:hidden;scroll-margin-top:76px">
<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(11,45,32,.05) 1.3px, transparent 1.3px);background-size:30px 30px;pointer-events:none"></div>
<div class="entreg-grid" style="max-width:1180px;margin:0 auto;padding:0 28px;position:relative;z-index:1">
<div>
<p style="display:flex;align-items:center;gap:14px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#7E6836;font-weight:700;margin:0 0 14px"><i style="width:34px;height:1px;background:#A98E4E;display:inline-block"></i>Ferramentas</p>
<h2 style="font-family:'Playfair Display',serif;margin:0 0 20px;font-weight:600;font-size:clamp(28px,3.4vw,42px);color:#0B2D20;letter-spacing:-.01em;line-height:1.12;text-wrap:balance">O que fica com você depois da última aula.</h2>
<p style="font-size:15px;color:#6D6D6D;margin:0 0 34px;max-width:440px;text-wrap:pretty">O material de trabalho da formação, na sua mão para a hora de decidir.</p>
<ul class="entreg-list" style="list-style:none;margin:0;padding:0">
${item('Apostilas dos 4 módulos', 'Cada aula vira texto, com os passos na ordem em que você vai executar.')}
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
/* mobile: a imagem dos dispositivos entra ANTES dos bullets (decisao 25/jul) — titulo e
   lead apresentam a secao, o mockup mostra os entregaveis, a lista detalha. O wrapper de
   texto vira display:contents para kicker/h2/lead/lista virarem itens do grid, e a lista
   ganha order:1: o palco (order 0, ordem do documento) entra entre o lead e os bullets
   sem mexer no markup. gap zerado porque os proprios elementos ja carregam as margens. */
@media(max-width:900px){
.entreg-grid{grid-template-columns:1fr;gap:0}
.entreg-grid>div:first-child{display:contents}
.entreg-list{order:1}
.entreg-stage{margin-bottom:34px}
}
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
//      Nomenclatura travada: VEJA = "Chancela de credibilidade", BlockTrends = "Chancela
//      tecnica". Selo = SVG inline (faixa verde + nomes Playfair off-white + miolo areia),
//      olho reto sobreposto na proporcao real. Card VEJA: kicker "A credibilidade de" +
//      logo VEJA Negocios, copy de confianca/autoridade, e as 3 marcas reais em sequencia
//      (Grupo Abril colorido, VEJA, Super Interessante) sob "As marcas que informam o Brasil".
{
  const kick = 'font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#7E6836;font-weight:700';
  const novaChancela = `<section id="chancela" data-screen-label="H7 Quem assina" style="padding:104px 0 0;scroll-margin-top:76px">
<div style="max-width:1180px;margin:0 auto;padding:0 28px">
<div style="display:flex;justify-content:space-between;align-items:center;gap:40px;flex-wrap:wrap;margin-bottom:46px">
<div style="max-width:660px">
<p style="display:flex;align-items:center;gap:14px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#7E6836;font-weight:700;margin:0 0 14px"><i style="width:34px;height:1px;background:#A98E4E;display:inline-block"></i>Quem assina</p>
<h2 style="font-family:'Playfair Display',serif;margin:0 0 16px;font-weight:600;font-size:clamp(28px,3.6vw,44px);color:#0B2D20;letter-spacing:-.01em;line-height:1.12;text-wrap:balance">Duas instituições, uma responsabilidade.</h2>
<p style="font-size:15px;color:#6D6D6D;margin:0;max-width:560px;text-wrap:pretty">A técnica de quem operou o mercado por dentro, com a credibilidade de uma marca que o Brasil lê há mais de 70 anos.</p>
</div>
<div class="qa-selo" style="position:relative;width:180px;height:180px;flex:0 0 auto;margin-right:72px">
<svg width="180" height="180" viewBox="0 0 240 240" fill="none" style="display:block;transform:rotate(-32deg)" role="img" aria-label="Selo de chancela — VEJA Negócios e BlockTrends">
<defs><path id="selArcT" d="M 18 120 A 102 102 0 0 1 222 120"></path><path id="selArcB" d="M 18 120 A 102 102 0 0 0 222 120"></path></defs>
<circle cx="120" cy="120" r="88" fill="#F7F5F2"></circle>
<circle cx="120" cy="120" r="102" stroke="#0B2D20" stroke-width="28"></circle>
<circle cx="120" cy="120" r="116" stroke="#D9BE85" stroke-width="1"></circle>
<circle cx="120" cy="120" r="88" stroke="#D9BE85" stroke-width="1"></circle>
<line x1="4" y1="120" x2="32" y2="120" stroke="#D9BE85" stroke-width="1"></line>
<line x1="208" y1="120" x2="236" y2="120" stroke="#D9BE85" stroke-width="1"></line>
<rect x="13.5" y="115.5" width="9" height="9" transform="rotate(45 18 120)" fill="#D9BE85"></rect>
<rect x="217.5" y="115.5" width="9" height="9" transform="rotate(45 222 120)" fill="#D9BE85"></rect>
<text fill="#F7F5F2" font-family="'Playfair Display',serif" font-size="14.5" font-weight="600" letter-spacing="2.2"><textPath href="#selArcT" startOffset="50%" text-anchor="middle" dominant-baseline="central">VEJA NEGÓCIOS</textPath></text>
<text fill="#F7F5F2" font-family="'Playfair Display',serif" font-size="14.5" font-weight="600" letter-spacing="2.2"><textPath href="#selArcB" startOffset="50%" text-anchor="middle" dominant-baseline="central">BLOCKTRENDS</textPath></text>
<circle cx="120" cy="120" r="74" fill="#F0E9D8"></circle>
<circle cx="120" cy="120" r="74" stroke="#A98E4E" stroke-width="1.2"></circle>
<circle cx="120" cy="120" r="60" stroke="#A98E4E" stroke-width="0.7" opacity="0.7"></circle>
</svg>
<img decoding="async" loading="lazy" src="/lp/f2070b29-906c-48d8-92c7-0948fe19573b.webp" alt="" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:92px;height:auto;display:block">
</div>
</div>
<div class="qa-grid">
<div class="qa-card">
<span style="${kick}">A credibilidade de</span>
<img decoding="async" loading="lazy" src="/lp/9d082a49-3451-447b-b123-55d3fa363e04.svg" alt="VEJA Negócios" style="width:154px;height:auto;display:block;margin:16px 0 18px">
<p style="font-size:13.5px;color:#6D6D6D;line-height:1.6;margin:0 0 30px;text-wrap:pretty">Quando a publicação de economia da VEJA assina uma formação sobre dinheiro, não é detalhe: é o rigor de quem cobre o mercado, com o peso de um grupo que o Brasil lê desde 1950.</p>
<div style="margin-top:auto">
<div style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#7E6836;font-weight:700;margin-bottom:18px">As marcas que informam o Brasil</div>
<div style="display:flex;align-items:center;gap:28px;flex-wrap:wrap">
<img decoding="async" loading="lazy" src="/lp/grupo-abril-color.webp" alt="Grupo Abril" style="height:25px;width:auto;display:block">
<img decoding="async" loading="lazy" src="/lp/veja.webp" alt="VEJA" style="height:23px;width:auto;display:block">
<img decoding="async" loading="lazy" src="/lp/super.webp" alt="Super Interessante" style="height:24px;width:auto;display:block">
</div>
</div>
</div>
<div class="qa-card">
<span style="${kick}">A técnica de</span>
<img decoding="async" loading="lazy" src="/lp/3e33dbd4-b8c5-4b0d-a960-befd5dc2704a.svg" alt="BlockTrends" style="width:282px;max-width:100%;height:auto;display:block;margin:16px 0 30px">
<p style="font-size:13.5px;color:#6D6D6D;line-height:1.6;margin:0 0 30px;text-wrap:pretty">O BlockTrends criou a primeira certificação profissional reconhecida pela ANCORD, a entidade que credencia o mercado de capitais. Esse rigor assina o conteúdo e o método da formação.</p>
<div style="margin-top:auto">
<div style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#7E6836;font-weight:700;margin-bottom:18px">Pioneira em certificação profissional</div>
<div style="display:flex;align-items:center;gap:30px;flex-wrap:wrap">
<img decoding="async" loading="lazy" src="/lp/cca-ancord.svg" alt="Certificação de Criptoativos ANCORD (CCA)" style="height:30px;width:auto;display:block">
<img decoding="async" loading="lazy" src="/lp/pos-blockchain.png" alt="Pós Desenvolvedor Blockchain" style="height:32px;width:auto;display:block">
</div>
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
/* mobile (25/jul): o selo de 180px nao se aplica bem no viewport estreito — sai; e os
   2 cards viram carrossel com snap a 88%, mesma receita dos docentes. Restaura o
   comportamento que o DESIGN.md §5 ja previa ("chancela 88%") e que se perdeu quando
   esta etapa trocou a secao do bundle (.chancela-grid) pelos cards novos (.qa-grid). */
@media(max-width:760px){
.qa-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:18px;-webkit-overflow-scrolling:touch;padding-bottom:10px;scrollbar-width:none}
.qa-grid::-webkit-scrollbar{display:none}
.qa-grid>.qa-card{flex:0 0 88%;scroll-snap-align:center}
.qa-selo{display:none}
}
`;

  // CSS orfao do bundle: o carrossel da secao antiga (.chancela-grid/.chancela-veja/
  // .chancela-bt) ficou no styles sem nenhum markup correspondente desde que esta etapa
  // substituiu a secao. Remove as 3 regras; o resto do bloco @media (docentes) fica.
  {
    const mortas = [
      /\s*\.chancela-grid\{[^}]*\}/,
      /\s*\.chancela-grid::-webkit-scrollbar\{[^}]*\}/,
      /\s*\.chancela-grid>\.chancela-veja,\.chancela-grid>\.chancela-bt\{[^}]*\}/,
      /\s*\.chancela-vdiv\{[^}]*\}/,
      /\s*\.quote-flourish\{[^}]*\}/,
    ];
    for (const re of mortas) {
      const antes = styles;
      styles = styles.replace(re, '');
      if (styles === antes) console.warn(`AVISO: regra orfa da chancela nao encontrada para remover: ${re}`);
    }
  }
}

// 7l) fundo do hero: globo 3D pontilhado girando (mapa-mundi), praças financeiras com
//     halo pulsante e rotas ligando algumas delas. Desenhado em CANVAS 2D.
//
//     Por que canvas e nao mais DOM (migrado em 24/jul/2026): a versao anterior punha um
//     elemento por ponto dentro de um `preserve-3d`, e o navegador reordena por
//     profundidade TODOS os filhos a cada quadro. Com ~1.400 pontos passava; ao adensar o
//     litoral e somar cidades e rotas (3.697 elementos) a pagina travou. Em canvas o custo
//     e proporcional ao que se PINTA, nao ao que existe na arvore, entao 3 mil pontos
//     saem em um punhado de operacoes e sobra folga para halo e pulso.
//
//     Este bloco so escreve os DADOS (app/_lp/globo-dados.ts) e injeta o <canvas>; quem
//     desenha e o app/_lp/GloboCanvas.tsx, no mesmo padrao do HeroPointer (o componente
//     acha o elemento no HTML injetado e liga o runtime por cima).
{
  const RG = 520, OURO = '#A98E4E';            // RG: raio do globo, em px CSS
  // A perspectiva escala junto com o raio: manter a razao RG/PERSP constante preserva a
  // distorcao. Se so o raio crescesse, a esfera viraria olho de peixe.
  const PERSP = Math.round(RG / 0.226);
  // TILT negativo inclina o polo norte NA DIRECAO do observador, trazendo o hemisferio
  // norte (eixo do curso) para a frente. FASE gira a longitude de partida: com 45 a face
  // inicial e o Atlantico Norte, com EUA (~-100) de um lado e Europa (~10) do outro.
  const TILT = -20, FASE = 45, GIRO_MS = 72000;
  // O aro NAO usa RG: com perspectiva, a silhueta aparente da esfera e maior que o raio
  // geometrico. Sem isso o aro fica apertado por dentro dos pontos.
  const ARO = +(RG * PERSP / Math.sqrt(PERSP * PERSP - RG * RG)).toFixed(1);

  // CIDADES: praças financeiras e capitais do circuito do curso. Viram halo + nucleo no
  // canvas, cada uma com seu proprio ritmo de brilho (ver GloboCanvas).
  // Cada praça carrega [lon, lat, codigo de cidade IATA, pais ISO-2]. O codigo IATA de
  // CIDADE (nao de aeroporto) e o vocabulario que o mercado ja usa em mesa de operacao:
  // LON, NYC, TYO. Vira rotulo no canvas, ao lado do halo.
  const CIDADES = [
    [-0.13, 51.51, 'LON', 'GB'], [2.35, 48.86, 'PAR', 'FR'], [13.40, 52.52, 'BER', 'DE'],
    [4.90, 52.37, 'AMS', 'NL'], [8.54, 47.37, 'ZRH', 'CH'], [-3.70, 40.42, 'MAD', 'ES'],
    [12.50, 41.90, 'ROM', 'IT'], [28.98, 41.01, 'IST', 'TR'], [37.62, 55.75, 'MOW', 'RU'],
    [31.24, 30.04, 'CAI', 'EG'], [-7.99, 31.63, 'RAK', 'MA'], [55.27, 25.20, 'DXB', 'AE'],
    [77.21, 28.61, 'DEL', 'IN'], [121.47, 31.23, 'SHA', 'CN'], [139.69, 35.69, 'TYO', 'JP'],
    [114.17, 22.32, 'HKG', 'HK'], [103.82, 1.35, 'SIN', 'SG'], [-74.01, 40.71, 'NYC', 'US'],
    [-87.63, 41.88, 'CHI', 'US'], [-79.38, 43.65, 'YTO', 'CA'], [-118.24, 34.05, 'LAX', 'US'],
    [-80.19, 25.76, 'MIA', 'US'], [-82.38, 23.11, 'HAV', 'CU'], [-99.13, 19.43, 'MEX', 'MX'],
    [-38.54, -3.73, 'FOR', 'BR'], [-46.63, -23.55, 'SAO', 'BR'],
  ];
  // ROTAS: pares ligados por arco de grande circulo (viram linha continua no canvas). O
  // CERNE do curso e dolarizar saindo do Brasil, entao Sao Paulo (25) e o no de origem,
  // irradiando para EUA e Europa; Fortaleza (24) e a ponte do Nordeste com a Europa. A
  // malha global ao redor so contextualiza o mundo conectado, mais discreta.
  const ROTAS = [
    // Brasil -> EUA e Europa (o leque que conta a tese)
    [25, 17], // São Paulo · Nova York
    [25, 21], // São Paulo · Miami
    [25, 0],  // São Paulo · Londres
    [25, 5],  // São Paulo · Madri
    [24, 0],  // Fortaleza · Londres
    // malha global de contexto
    [0, 17],  // Londres · Nova York
    [0, 11],  // Londres · Dubai
    [11, 13], // Dubai · Xangai
    [20, 14], // Los Angeles · Tóquio
    [13, 16], // Xangai · Cingapura
    [1, 7],   // Paris · Istambul
  ];

  const costaCrua = fs.readFileSync(new URL('./globo-costa.txt', import.meta.url), 'utf8').trim();
  // TERRA: pontos de interior dos continentes (distribuicao Fibonacci uniforme + teste
  // point-in-polygon contra o ne_50m_land), para a massa de terra "acender" levemente
  // sobre o oceano escuro sem virar preenchimento solido — que destoaria de um globo todo
  // pontilhado e ainda esbarraria no recorte de poligono no limbo.
  const terraCrua = fs.readFileSync(new URL('./globo-terra.txt', import.meta.url), 'utf8').trim();

  const dados = `// GERADO por scripts/port-lp.mjs (etapa 7l). Nao editar a mao.
// Geometria e dados do globo do hero; quem desenha e ./GloboCanvas.tsx.
export const RG = ${RG};
export const PERSP = ${PERSP};
export const TILT = ${TILT};
export const FASE = ${FASE};
export const GIRO_MS = ${GIRO_MS};
export const ARO = ${ARO};
export const OURO = '${OURO}';
/** Litoral do Natural Earth (ne_50m_land, dominio publico), "lon lat" separados por virgula. */
export const COSTA = '${costaCrua}';
/** Interior das massas de terra (stipple Fibonacci), "lon lat" separados por virgula. */
export const TERRA = '${terraCrua}';
/** Praças financeiras: [lon, lat, codigo IATA de cidade, pais ISO-2]. */
export const CIDADES: [number, number, string, string][] = ${JSON.stringify(CIDADES)};
/** Rotas como pares de indices em CIDADES. */
export const ROTAS: [number, number][] = ${JSON.stringify(ROTAS)};
`;
  fs.writeFileSync(new URL('../app/_lp/globo-dados.ts', import.meta.url), dados);

  // trama de pontos rebaixada a grao de fundo: na mesma intensidade ela competia com os
  // pontos do mapa-mundi (escala visual parecida) e sujava a leitura dos continentes.
  const pontos = `<div class="cn-dots" style="position:absolute;inset:0;background-image:radial-gradient(rgba(247,245,242,.035) 1.3px, transparent 1.3px);background-size:32px 32px;-webkit-mask-image:linear-gradient(to bottom,black,transparent 92%);mask-image:linear-gradient(to bottom,black,transparent 92%);pointer-events:none"></div>`;
  const globo = `<canvas class="cn-canvas" aria-hidden="true"></canvas>`;
  const antes = body;
  body = body.replace(
    /<div style="position:absolute;inset:0;background-image:radial-gradient\(rgba\(247,245,242,\.08\) 1\.3px, transparent 1\.3px\);[^"]*"><\/div>/,
    pontos + globo
  );
  if (body === antes) console.warn('AVISO: camada de pontos do hero nao encontrada — globo nao aplicado.');
  styles += `
/* Hero — globo em canvas (desenho em app/_lp/GloboCanvas.tsx). O elemento cobre o hero
   inteiro; o centro do globo fica em 50%/42% da area, como na versao em DOM. */
.cn-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .6s ease}
.cn-canvas.pronto{opacity:1}
/* Hero — resposta ao mouse: o GLOBO gira e inclina conforme o cursor (feito no canvas,
   ver GloboCanvas.tsx), então o canvas em si NÃO translada — só a trama de fundo desliza
   de leve, para dar a camada distante. O parallax de translação do canvas foi removido
   quando as estrelas saíram: sem elas, deslizar o globo chapado não lia como profundidade.
   Em reduced-motion o HeroPointer nem seta as vars, mas zeramos por garantia. */
.cn-dots{transition:transform .3s cubic-bezier(.16,1,.3,1);transform:translate(calc(var(--mx,0)*-11px),calc(var(--my,0)*-11px))}
@media(prefers-reduced-motion:reduce){.cn-dots{transition:none;transform:none}}
`;
}
// 7m) Hero: novo copy. Headline puxa o "risco Brasil" (sem tocar em politica), subtitulo
//      foca na dolarizacao e ja carrega as 4 casas do corpo docente (Banco Central, XP,
//      Caixa, Bradesco) — o peso entra no proprio texto, sem tira nem fotos. CTA trocado
//      por um mais marketavel. Marca (credibilidade/tecnica) vive no lockup VEJA x BlockTrends.
{
  const before = body;
  body = body.replace(
    'Sua liberdade financeira começa pela <em style="font-style:italic;color:#D9BE85">geografia</em>.',
    'Seu patrimônio não devia depender de um <em style="font-style:italic;color:#D9BE85">só país</em>.'
  );
  if (body === before) console.warn('AVISO: headline do hero nao encontrada.');

  const b2 = body;
  body = body.replace(
    'O método de dolarização que faltava ao investidor brasileiro, ensinado por quem operou esse mercado por dentro.',
    'Aprenda o método de dolarização de quem operou por dentro do Banco Central, da XP, da Caixa e do Bradesco.'
  );
  if (body === b2) console.warn('AVISO: subtitulo do hero nao encontrado.');

  // CTA do hero: mais marketavel e "temente ao risco Brasil". .replace (string) troca so a
  // PRIMEIRA ocorrencia = o botao do hero; o CTA da oferta (H8) fica intacto por ora.
  const b3 = body;
  body = body.replace('QUERO DOLARIZAR MEU PATRIMÔNIO', 'DOLARIZE COMO OS GRANDES');
  if (body === b3) console.warn('AVISO: CTA do hero nao encontrado.');
}

// 7n) Topbar: renomeia a navegacao (Professores/Formacao/Ferramentas/Idealizadores/FAQ,
//      apontando para as secoes certas; "O Diagnostico"/#tese sai) e coloca os dois botoes
//      (Entrar / Inscreva-se) em CAIXA ALTA.
{
  const navLink = (href, txt) =>
    `<a href="${href}" style="color:#B9C4BC;font-size:13px;font-weight:600;letter-spacing:.02em" style-hover="color:#D9BE85">${txt}</a>`;
  // "Entrar" tambem dentro do menu hamburguer: no mobile o botao ENTRAR da topbar some
  // (regra do bundle) e o acesso a area do aluno ficava sem porta. Dourado e em caixa
  // alta para ler como acao, separado das ancoras por uma hairline; display:none no
  // desktop (la o botao proprio continua). CSS logo abaixo da nav.
  const novaNav = [
    navLink('#docentes', 'Professores'),
    navLink('#curriculo', 'Formação'),
    navLink('#entregaveis', 'Ferramentas'),
    navLink('#chancela', 'Idealizadores'),
    navLink('#faq', 'FAQ'),
    `<a class="nav-entrar" href="/app/login" title="Entrar na área do aluno" style="color:#D9BE85;font-size:13px;font-weight:700;letter-spacing:.06em" style-hover="color:#F7F5F2">ENTRAR</a>`,
  ].join('\n      ');
  const bn = body;
  body = body.replace(/(<nav class="topbar-nav"[^>]*>)[\s\S]*?(<\/nav>)/, `$1\n      ${novaNav}\n    $2`);
  if (body === bn) console.warn('AVISO: nav da topbar nao encontrada.');

  const be = body;
  body = body.replace('>Entrar</a>', '>ENTRAR</a>');
  body = body.replace('>Inscreva-se</a>', '>INSCREVA-SE</a>');
  if (body === be) console.warn('AVISO: botoes Entrar/Inscreva-se da topbar nao encontrados.');

  styles += `
/* Entrar dentro do menu hamburguer (o botao da topbar some no mobile pela regra do
   bundle). No desktop este link nao existe visualmente. */
.nav-entrar{display:none !important}
@media (max-width:1024px){
.topbar-nav .nav-entrar{display:block !important;width:100%;margin-top:4px;padding-top:16px;border-top:1px solid rgba(217,190,133,.18)}
}
`;
}

// 7o) Oferta (H8): copy. O H2 do bundle ("Tudo que voce precisa...") era generico e
//      nao dizia o que se compra; a revisao ancora a oferta no TEMPO (1 ano para
//      aplicar) e nomeia os itens da lista em vez de rotula-los ("bonus exclusivo").
{
  const troca = (de, para, rotulo) => {
    const antes = body;
    body = body.replace(de, para);
    if (body === antes) console.warn(`AVISO: oferta — ${rotulo} nao encontrado.`);
  };
  // H2 novo + margem inferior, porque o subtitulo abaixo dele sai (ver troca seguinte).
  troca(
    /margin:0;(font-size:clamp\(27px,3\.4vw,42px\);font-weight:600;line-height:1\.12">)Tudo que você precisa para dolarizar com método\./,
    'margin:0 0 34px;$1Um pagamento, um ano para aplicar.',
    'H2',
  );
  // o subtitulo do bundle so parafraseava o H2 (pagamento unico + prazo): sai inteiro.
  troca(
    /\s*<p style="color:#A9B8AE;[^"]*">Você paga uma vez e estuda por um ano inteiro[^<]*<\/p>/,
    '',
    'subtitulo (remocao)',
  );
  troca('10x sem juros de R$ 39,70', '10x de R$ 39,70 sem juros', 'parcelamento do card');

  // a regua ao lado do rotulo "Voce recebe" sangrava ate a borda sem separar nada.
  troca('<i style="flex:1;height:1px;background:rgba(217,190,133,.28)"></i>', '', 'regua do rotulo');

  // lista "Voce recebe": 7 itens (definidos pelo Pedro em 24/jul). Os dois primeiros
  // sao os de peso (raio dourado + negrito); os demais entram como check discreto.
  {
    const raio = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#D9BE85" style="flex:0 0 auto"><path d="M13 2 4 14h6l-1 8 9-12h-6z"></path></svg>';
    const check = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D9BE85" stroke-width="2.4" style="flex:0 0 auto"><path d="M20 6 9 17l-5-5"></path></svg>';
    const borda = 'border-bottom:1px solid rgba(217,190,133,.14);';
    const li = (txt, { peso = false, ultimo = false } = {}) =>
      `        <li style="display:flex;align-items:center;gap:14px;padding:13px 0;${ultimo ? '' : borda}` +
      (peso ? 'font-size:14.5px;color:#F1F4F1;font-weight:700"' : 'font-size:14px;color:#B7C4BB"') +
      `>${peso ? raio : check}${txt}</li>`;
    const lista = [
      li('Formação completa: 4 módulos, 16 aulas', { peso: true }),
      li('Certificado de 30h, com prova e código de verificação', { peso: true }),
      li('Apostila de cada um dos módulos'),
      li('Ferramentas de apoio: calculadora de dolarização e e-book exclusivo'),
      li('12 meses de acesso, contados da compra'),
      li('Suporte humanizado', { ultimo: true }),
    ].join('\n');
    troca(
      /<ul style="list-style:none;margin:0;padding:0">[\s\S]*?Formação completa[\s\S]*?<\/ul>/,
      () => `<ul style="list-style:none;margin:0;padding:0">\n${lista}\n      </ul>`,
      'lista Você recebe',
    );
  }
}

// 7r) coerencia de nomes e grafias entre secoes (revisao geral de 24/jul):
//      (a) o card do docente do Modulo III anunciava "ETFs, REITs & BDRs" enquanto o
//          curriculo chama o mesmo modulo de "Como Acessar o Mercado Americano";
//      (b) o resumo do curriculo prometia "materiais complementares", nome que nao
//          existe em nenhum outro lugar — passa a listar o que a secao Ferramentas
//          entrega de fato (apostila, calculadora e e-book);
//      (c) "Ebook"/"ebook" -> "E-book" (grafia dicionarizada) em toda a pagina;
//      (d) prazo de acesso unificado em "1 ano" (o bullet dizia "12 meses");
//      (e) cargo do Ywata conferido: secretario ESPECIAL de Produtividade e
//          Competitividade do Ministerio da Economia (2022), VP de riscos na Caixa.
{
  const troca = (de, para, rotulo) => {
    const antes = body;
    body = body.replace(de, para);
    if (body === antes) console.warn(`AVISO: revisao geral — ${rotulo} nao encontrado.`);
  };
  // "Mercado Americano" pedia 241px no chip e so havia 236: quebrava em 2 linhas.
  // "Mercado dos EUA" ocupa 220px e o nowrap abaixo garante a linha unica nos 4 cards.
  troca('Módulo III · ETFs, REITs &amp; BDRs', 'Módulo III · Mercado dos EUA', 'rotulo do modulo III');
  // Modulo IV: tema aberto de "Criptoativos" para "Ativos Digitais", para caber mais
  // que cripto (ETFs tematicos, tokenizacao de ativos reais etc.).
  troca('Módulo IV · Criptoativos', 'Módulo IV · Ativos Digitais', 'rotulo do modulo IV');
  troca(
    'Criptoativos: Exposição Alternativa em Dólar',
    'Ativos Digitais: Exposição Alternativa em Dólar',
    'titulo do modulo IV no curriculo',
  );
  troca('ETFs de cripto e análise on-chain', 'ETFs e análise on-chain', 'aula 15 (3a do modulo IV)');
  troca('apostila completa + materiais complementares', 'apostila completa', 'resumo do curriculo (apostila)');
  troca(
    '>Bônus:</em> e-book exclusivo',
    '>Ferramentas:</em> calculadora de dolarização e e-book exclusivo',
    'resumo do curriculo (ferramentas)',
  );
  // bio do Ywata: era a unica das quatro com 221 caracteres (as outras ficam entre 136 e
  // 148), o que empurrava o texto para uma quarta linha e quebrava a unidade dos cards.
  troca(
    'Foi vice-presidente da Caixa e secretário da Economia. Especialista em econometria e análise de risco, conduz criptoativos com o rigor de quem mede antes de afirmar.',
    'Vice-presidente de riscos da Caixa e secretário especial no Ministério da Economia, conduz os ativos digitais com o rigor de quem mede antes de afirmar.',
    'bio do Ywata',
  );
  troca('12 meses de acesso, contados da compra', '1 ano de acesso, contado da compra', 'bullet de acesso');
  // o chip de modulo do card de docente tem que caber sempre em UMA linha. No desktop
  // sobram 236px uteis (card de 280 menos 22px de padding de cada lado); no mobile o
  // card cai para 78% da faixa e sobram ~193px, entao o chip encolhe por media query
  // em vez de estourar para fora do card (que tem overflow:visible por causa do balao).
  {
    const antes = body;
    body = body.replace(
      /<span style="font-size:9\.5px;letter-spacing:\.2em;color:#8FA398/g,
      '<span class="chip-modulo" style="font-size:9.5px;letter-spacing:.2em;color:#8FA398',
    );
    if (body === antes) console.warn('AVISO: chip de modulo do card de docente nao encontrado.');
    styles += `
.chip-modulo{white-space:nowrap}
@media (max-width:760px){.chip-modulo{font-size:8.5px;letter-spacing:.12em}}
`;
  }

  // grafia do e-book (aparece no curriculo, na secao Ferramentas e na Oferta).
  body = body.replace(/\bEbook\b/g, 'E-book').replace(/(?<![-\w])ebook\b/g, 'e-book');
}

// 7p) CTA final (pre-rodape): o botao repete o comando do hero em vez do generico
//      "QUERO ME INSCREVER", que era o terceiro texto diferente de CTA da pagina.
{
  const antes = body;
  body = body.replace('>QUERO ME INSCREVER</a>', '>DOLARIZE COMO OS GRANDES</a>');
  if (body === antes) console.warn('AVISO: botao do CTA final nao encontrado.');
}

// 7q) ritmo vertical: o respiro entre secoes e de 200px em quase toda a pagina
//      (padding 104 da seguinte + 96 da anterior, ou margin-top 104 nas secoes de
//      fundo escuro). Duas transicoes entre secoes CLARAS consecutivas ficavam com
//      metade disso, porque nenhuma das duas contribuia com o padding de baixo:
//      Ferramentas -> Quem assina (104px) e FAQ -> CTA final (114px).
{
  const antes = body;
  // Excecao ao ritmo de 200px: o CTA final e fechamento, nao mais uma secao de conteudo.
  // Com 200px ele descolava do FAQ e ficava boiando no fim da pagina; 128px o mantem
  // preso ao corpo da pagina (24 do FAQ + 104 do proprio CTA).
  body = body.replace(
    '<section id="faq" data-screen-label="H9 FAQ" style="padding:104px 0 0;',
    '<section id="faq" data-screen-label="H9 FAQ" style="padding:104px 0 24px;',
  );
  if (body === antes) console.warn('AVISO: padding do FAQ nao encontrado.');
  // o ultimo <details> carregava 10px de margem para fora da secao.
  styles += `
#faq details:last-of-type{margin-bottom:0}
`;
}

// 7s) bolinhas dos carrosseis mobile: os dois sliders da LP (docentes e Quem Assina)
//     ganham indicadores de posicao logo abaixo, pratica de mercado para o usuario
//     saber que a faixa desliza. Markup estatico aqui (SSG, sem layout shift); quem
//     marca a bolinha ativa e trata o toque e o app/_lp/CarrosselDots.tsx, que acha
//     cada .carr-dots e emparelha com o carrossel via previousElementSibling — por
//     isso as bolinhas entram SEMPRE logo apos o fechamento do container do slider.
//     So aparecem em <=760px (breakpoint dos dois carrosseis); a cor segue o fundo
//     da secao: gold-lit no verde (docentes), gold no claro (Quem Assina).
{
  // `cor` pinta as bolinhas INATIVAS (translucidas, seguem a regra de texto do fundo);
  // `corAtiva` pinta a acesa — o dourado como acento, nos dois fundos.
  const dots = (n, cor, corAtiva, rotulo) =>
    `<div class="carr-dots" style="color:${cor};--dot-on:${corAtiva}" aria-label="Posição no carrossel de ${rotulo}">` +
    Array.from({ length: n }, (_, i) =>
      `<button type="button" aria-label="Ir para o item ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}></button>`
    ).join('') +
    `</div>`;

  // docentes: 4 cards, secao verde. Inativas em offwhite (dourado translucido somia no
  // verde — regra do DESIGN.md: secundario sobre verde e offwhite/muted); ativa gold-lit.
  // Ancora = fechamento do prof-grid imediatamente antes do comentario do H5 (unico).
  const antesProf = body;
  body = body.replace(
    '  </div>\n</section>\n\n<!-- ============ H5',
    `  ${dots(4, '#F7F5F2', '#D9BE85', 'professores')}\n  </div>\n</section>\n\n<!-- ============ H5`
  );
  if (body === antesProf) console.warn('AVISO: fechamento do prof-grid nao encontrado para as bolinhas.');

  // Quem Assina: 2 cards, secao clara. Ancora = fim do segundo qa-card (logo da Pos
  // Blockchain, unica na pagina) + os fechamentos ate o qa-grid.
  const antesQa = body;
  body = body.replace(
    'alt="Pós Desenvolvedor Blockchain" style="height:32px;width:auto;display:block">\n</div>\n</div>\n</div>\n</div>\n</div>\n</section>',
    `alt="Pós Desenvolvedor Blockchain" style="height:32px;width:auto;display:block">\n</div>\n</div>\n</div>\n</div>\n${dots(2, '#A98E4E', '#A98E4E', 'idealizadores')}\n</div>\n</section>`
  );
  if (body === antesQa) console.warn('AVISO: fechamento do qa-grid nao encontrado para as bolinhas.');

  styles += `
/* Bolinhas dos carrosseis (so mobile; a ativa e marcada pelo CarrosselDots) */
.carr-dots{display:none;justify-content:center;gap:4px;margin-top:16px}
.carr-dots button{width:20px;height:20px;padding:0;border:0;background:none;display:flex;align-items:center;justify-content:center;cursor:pointer}
.carr-dots button::after{content:"";width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.38;transition:opacity .25s ease,transform .25s ease,background .25s ease}
.carr-dots button[aria-current="true"]::after{background:var(--dot-on,currentColor);opacity:1;transform:scale(1.25)}
@media(max-width:760px){.carr-dots{display:flex}}
`;
}

// 7t) wordmark da topbar no mobile: o lockup saia torto por tres somas pequenas.
//     (a) letter-spacing poe espaco tambem DEPOIS da ultima letra, entao a caixa do
//         ESTRATEGIA e mais larga que os glifos e a hairline direita da linha de baixo
//         passava do "A" (~3px), pendendo o conjunto para a direita;
//     (b) o INTERNACIONAL carrega o mesmo espaco final dentro do flex e ficava ~1,5px
//         fora do centro;
//     (c) o override mobile do bundle trocava as PROPORCOES do lockup (tracking .16em
//         no ESTRATEGIA, .34em embaixo) em vez de so escalar a aplicacao padrao
//         (.26em / .44em, DESIGN.md "Wordmark").
//     Correcao: margem negativa igual ao tracking compensa o espaco final (a e b, em
//     todos os tamanhos), e o mobile volta as proporcoes padrao em escala menor (c).
{
  // (b) envolve o INTERNACIONAL da TOPBAR para receber a compensacao; .replace troca
  // so a primeira ocorrencia = topbar (o rodape, com o mesmo padrao, vem depois).
  const antes = body;
  body = body.replace(
    '></i>INTERNACIONAL<i style=',
    '></i><span class="wm-int">INTERNACIONAL</span><i style=',
  );
  if (body === antes) console.warn('AVISO: INTERNACIONAL da topbar nao encontrado para o wrap.');

  styles += `
/* Wordmark da topbar: compensacao do letter-spacing final (o espaco depois da ultima
   letra entortava o lockup) e, no mobile, a aplicacao padrao em escala menor. */
.tb-logo b{margin-right:-.26em}
.tb-logo .wm-int{margin-right:-.44em}
@media (max-width:430px){
.tb-logo b{font-size:16px !important;letter-spacing:.26em !important}
.tb-logo span{font-size:6.5px !important;letter-spacing:.44em !important;gap:8px !important}
.tb-logo span i{min-width:12px}
}
@media (max-width:380px){
.tb-logo b{font-size:14.5px !important}
.tb-logo span{font-size:6px !important}
}
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
<p style="font-size:12px;line-height:1.7;margin:20px 0 0;max-width:300px;color:#8a8a8a">Formação em dolarização de patrimônio e investimento internacional. BlockTrends, com chancela institucional da VEJA Negócios.</p>
</div>
<div style="display:flex;gap:56px;flex-wrap:wrap">
${col('Institucional', `<a href="#docentes" ${lnk}>Professores</a><a href="#curriculo" ${lnk}>Formação</a><a href="#entregaveis" ${lnk}>Ferramentas</a><a href="#chancela" ${lnk}>Idealizadores</a><a href="#faq" ${lnk}>FAQ</a>`)}
${col('Políticas', `<a href="#" ${lnk}>Termos de uso</a><a href="#" ${lnk}>Privacidade · LGPD</a>`)}
${col('Contato', `<a href="${WHATSAPP}" target="_blank" rel="noopener" ${lnk}>Suporte no WhatsApp</a><a href="mailto:${DPO_EMAIL}" ${lnk}>DPO · ${DPO_EMAIL}</a>`)}
</div>
</div>
</div>
<div style="background:#000;padding:0 0 26px">
<div style="max-width:1180px;margin:0 auto;padding:22px 28px 0;border-top:1px solid rgba(255,255,255,.12);display:flex;justify-content:center;align-items:center;gap:16px;flex-wrap:wrap">
<span style="font-size:11.5px;color:#6f6f6f">Abril Comunicações S.A. · CNPJ 44.597.052/0001-62 · Todos os direitos reservados.</span>
</div>
</div>
</footer>`;
  const before = body;
  body = body.replace(/<footer[\s\S]*?<\/footer>/i, newFooter);
  if (body === before) console.warn('AVISO: rodape do bundle nao encontrado para substituir.');
}

// 10) hover/foco: os atributos do bundle viram CSS (ver scripts/comum.mjs). Roda por
//     último, depois de todas as etapas que inserem markup novo (a nav da 7n, o rodapé).
styles += regrasDeEstado(body);

fs.writeFileSync('app/_lp/styles.css', styles.trim());
fs.writeFileSync('app/_lp/body.html', body.trim());
console.log('styles.css:', styles.length, 'body.html:', body.length);
console.log('restam placeholders?', /\{\{|<sc-if|<script/i.test(body) ? 'SIM (revisar)' : 'nao');

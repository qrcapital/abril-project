# Gera as artes dos e-mails da live (RD Station) e o cabecalho, em Jost, no padrao do e-mail #01.
# Uso: python3 scripts/email-arte/banners.py   (precisa de Pillow, cairosvg e fontTools+brotli)
# A Jost sai dos .woff2 do proprio site (public/fonts), convertida para .ttf numa pasta temporaria.
import io, os, tempfile
from PIL import Image, ImageDraw, ImageFont
import cairosvg
from fontTools.ttLib import TTFont

R = os.path.join(os.path.dirname(__file__), '..', '..') + '/'
TMP = tempfile.mkdtemp()
def ttf(peso):
    f = TTFont(R + f'public/fonts/jost-latin-{peso}-normal.woff2'); f.flavor = None
    p = f'{TMP}/jost-{peso}.ttf'; f.save(p); return p
J4, J5 = ttf('400'), ttf('500')
F = ImageFont.truetype
OURO = (214, 186, 128); BRANCO = (253, 250, 245); CREME = (247, 244, 238)

def tw(d, t, f, sp): return sum(d.textlength(c, font=f) for c in t) + sp * (len(t) - 1)
def track(d, xy, t, f, cor, sp):
    x, y = xy
    for c in t:
        d.text((x, y), c, font=f, fill=cor); x += d.textlength(c, font=f) + sp

def cabecalho():
    W, H = 1200, 190
    im = Image.new('RGB', (W, H), CREME); d = ImageDraw.Draw(im)
    logo = Image.open(io.BytesIO(cairosvg.svg2png(url=R + 'public/marca/veja-negocios-claro.svg', output_width=430))).convert('RGBA')
    f = F(J4, 30); sp = 30 * 0.17
    wt = max(tw(d, 'ESTRATÉGIA', f, sp), tw(d, 'INTERNACIONAL', f, sp))
    gap = 44; x0 = int((W - (logo.width + gap * 2 + 2 + wt)) / 2)
    im.paste(logo, (x0, int((H - logo.height) / 2) + 4), logo)
    xl = x0 + logo.width + gap
    d.line([(xl, 48), (xl, H - 48)], fill=(201, 190, 170), width=2)
    track(d, (xl + 2 + gap, 52), 'ESTRATÉGIA', f, (26, 24, 21), sp)
    track(d, (xl + 2 + gap, 96), 'INTERNACIONAL', f, (26, 24, 21), sp)
    im.save(R + 'public/email/ei-cabecalho.png', optimize=True)

def banner(arquivo, etiqueta, linhas, apoio):
    W, H = 1200, 440
    topo, base = (122, 20, 32), (74, 11, 20)
    im = Image.new('RGB', (W, H)); px = im.load()
    for y in range(H):
        for x in range(W):
            t = x / W * 0.55 + y / H * 0.45
            px[x, y] = tuple(int(topo[i] * (1 - t) + base[i] * t) for i in range(3))
    g = Image.open(io.BytesIO(cairosvg.svg2png(url=R + 'public/marca/globo-dourado.svg', output_width=820, output_height=820))).convert('RGBA')
    g.putalpha(g.split()[3].point(lambda v: int(v * 0.42)))
    im.paste(g, (700, -150), g)
    d = ImageDraw.Draw(im)
    d.text((72, 100), etiqueta, font=F(J5, 28), fill=OURO)
    d.line([(72, 150), (124, 150)], fill=OURO, width=2)
    fh = F(J5, 64)
    for i, l in enumerate(linhas): d.text((72, 182 + 76 * i), l, font=fh, fill=BRANCO)
    d.text((72, 354), apoio, font=F(J4, 26), fill=(236, 220, 200))
    im.save(R + 'public/email/' + arquivo, quality=88, optimize=True, progressive=True)

cabecalho()
banner('ei-banner-01-confirmacao.jpg', 'Cadastro confirmado', ['Você está na live de', 'lançamento do curso.'], 'Estratégia Internacional  ·  13 de outubro, 19h')
banner('ei-banner-02-amanha-v2.jpg', 'Amanhã, 19h', ['A live de lançamento', 'do curso é amanhã.'], 'Estratégia Internacional  ·  13 de outubro, 19h')
banner('ei-banner-03-hoje-v2.jpg', 'Hoje, 19h', ['É hoje: a live de', 'lançamento do curso.'], 'Estratégia Internacional  ·  ao vivo no YouTube')
banner('ei-banner-04-agora-v2.jpg', 'Ao vivo agora', ['A live de lançamento', 'do curso começou.'], 'Estratégia Internacional  ·  YouTube da VEJA Negócios')
# Disparos para a base da BlockTrends (out/2026): chamada da live e abertura das inscricoes
banner('ei-banner-base-01-live.jpg', '13 de outubro, 19h', ['Como investir fora', 'do Brasil, ao vivo.'], 'Live gratuita  ·  Tony Volpon e Rodolfo Bastos')
banner('ei-banner-base-02-curso.jpg', 'Inscrições abertas', ['Estratégia', 'Internacional.'], 'O curso da VEJA Negócios e da BlockTrends')
print('ok')

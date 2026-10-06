# Pecas de display da Estrategia Internacional para o blocktrends.com.br (fora do Ad Manager).
# Duas fases: 'live' (ate a live de 13/10, 19h) e 'curso' (inscricoes abertas).
# Uso: python3 scripts/banners-bt/gerar.py [pasta_saida]
# Gera cada tamanho em 1x e 2x (PNG otimizado -> WebP q90 e JPG de reserva).
import io, os, sys, tempfile
from PIL import Image, ImageDraw, ImageFont
import cairosvg
from fontTools.ttLib import TTFont

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..') + '/'
OUT = sys.argv[1] if len(sys.argv) > 1 else R + 'scripts/banners-bt/out'
os.makedirs(OUT, exist_ok=True)
TMP = tempfile.mkdtemp()

def ttf(peso):
    f = TTFont(R + f'public/fonts/jost-latin-{peso}-normal.woff2'); f.flavor = None
    p = f'{TMP}/jost-{peso}.ttf'; f.save(p); return p
J4, J5 = ttf('400'), ttf('500')

OURO = (214, 186, 128); BRANCO = (253, 250, 245); APOIO = (236, 220, 200)
TOPO, BASE = (122, 20, 32), (74, 11, 20); TINTA = (58, 9, 16)

FASES = {
    'live': dict(etiqueta='Live gratuita · 13/10, 19h', titulo='Como investir fora do Brasil, ao vivo.',
                 curto='Como investir fora do Brasil', apoio='Com Tony Volpon e Rodolfo Bastos', cta='Inscreva-se grátis'),
    'curso': dict(etiqueta='Inscrições abertas', titulo='Estratégia Internacional.',
                  curto='Estratégia Internacional', apoio='4 módulos para investir fora do Brasil', cta='Conheça o curso'),
}

_cache = {}
def svg(nome, w=None, h=None):
    k = (nome, w, h)
    if k not in _cache:
        kw = {}
        if w: kw['output_width'] = w
        if h: kw['output_height'] = h
        src = open(R + 'public/marca/' + nome, encoding='utf-8').read()
        # Sobre o vinho o "veja" vermelho some: versao monocromatica em creme (negativo da marca).
        if nome.startswith('veja-negocios'): src = src.replace('#E4002B', '#F7F5F2')
        _cache[k] = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=src.encode('utf-8'), **kw))).convert('RGBA')
    return _cache[k]

def fundo(W, H, s):
    im = Image.new('RGB', (W, H)); px = im.load()
    for y in range(H):
        for x in range(W):
            t = x / W * 0.55 + y / H * 0.45
            px[x, y] = tuple(int(TOPO[i] * (1 - t) + BASE[i] * t) for i in range(3))
    return im

def globo(im, tam, x, y, alfa=0.38):
    g = svg('globo-dourado.svg', tam, tam).copy()
    g.putalpha(g.split()[3].point(lambda v: int(v * alfa)))
    im.paste(g, (int(x), int(y)), g)

def logo(im, larg, x, y):
    l = svg('veja-negocios-escuro.svg', int(larg))
    im.paste(l, (int(x), int(y)), l); return l.size

def quebra(d, texto, f, larg):
    linhas, atual = [], ''
    for p in texto.split():
        t = (atual + ' ' + p).strip()
        if d.textlength(t, font=f) <= larg or not atual: atual = t
        else: linhas.append(atual); atual = p
    if atual: linhas.append(atual)
    return linhas

def cabe(d, texto, peso, larg, max_linhas, tam_max, tam_min):
    for tam in range(tam_max, tam_min - 1, -1):
        f = ImageFont.truetype(peso, tam)
        ls = quebra(d, texto, f, larg)
        if len(ls) <= max_linhas and all(d.textlength(l, font=f) <= larg for l in ls): return f, ls
    f = ImageFont.truetype(peso, tam_min); return f, quebra(d, texto, f, larg)

def botao(d, x, y, texto, tam, s, alinhar='esq', larg_max=None):
    f = ImageFont.truetype(J5, tam)
    tw = d.textlength(texto, font=f); ph, pv = int(tam * 0.95), int(tam * 0.62)
    w, h = int(tw + 2 * ph), int(tam + 2 * pv)
    if alinhar == 'dir': x = x - w
    if alinhar == 'centro': x = x - w / 2
    d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2, fill=OURO)
    d.text((x + ph, y + pv - int(tam * 0.18)), texto, font=f, fill=TINTA)
    return w, h

def texto(d, xy, linhas, f, cor, entre):
    x, y = xy
    for l in linhas:
        d.text((x, y), l, font=f, fill=cor); y += entre
    return y

# ------------------------------------------------------------------ layouts
def l_970x250(F, s):
    W, H = 970 * s, 250 * s; im = fundo(W, H, s); globo(im, 560 * s, 600 * s, -170 * s); d = ImageDraw.Draw(im)
    m = 48 * s
    fe = ImageFont.truetype(J5, 17 * s); fa = ImageFont.truetype(J4, 18 * s)
    ft, ls = cabe(d, F['titulo'], J5, 600 * s, 2, 46 * s, 30 * s)
    lh_t = int(ft.size * 1.1)
    bloco = 17 * s + 27 * s + len(ls) * lh_t + 10 * s + 20 * s
    y0 = (H - bloco) // 2
    d.text((m, y0), F['etiqueta'], font=fe, fill=OURO)
    d.line([(m, y0 + 30 * s), (m + 44 * s, y0 + 30 * s)], fill=OURO, width=s)
    y = texto(d, (m, y0 + 44 * s), ls, ft, BRANCO, lh_t)
    d.text((m, y + 10 * s), F['apoio'], font=fa, fill=APOIO)
    lw, lh = svg('veja-negocios-escuro.svg', 170 * s).size
    logo(im, 170 * s, W - m - lw, 40 * s)
    botao(d, W - m, H - 40 * s - 46 * s, F['cta'], 20 * s, s, 'dir')
    return im

def l_728x90(F, s):
    W, H = 728 * s, 90 * s; im = fundo(W, H, s); globo(im, 300 * s, 470 * s, -105 * s); d = ImageDraw.Draw(im)
    m = 22 * s
    lw, lh = logo(im, 96 * s, m, (H - 24 * s) / 2)
    xl = m + lw + 18 * s; d.line([(xl, 20 * s), (xl, H - 20 * s)], fill=(150, 90, 90), width=s)
    x = xl + 18 * s
    fe = ImageFont.truetype(J5, 12 * s); d.text((x, 18 * s), F['etiqueta'], font=fe, fill=OURO)
    bw, bh = botao(d, W - m, (H - 36 * s) / 2, F['cta'], 15 * s, s, 'dir')
    ft, ls = cabe(d, F['curto'], J5, W - m - bw - 16 * s - x, 1, 25 * s, 16 * s)
    d.text((x, 38 * s), ls[0], font=ft, fill=BRANCO)
    return im

def l_320x100(F, s):
    W, H = 320 * s, 100 * s; im = fundo(W, H, s); globo(im, 200 * s, 190 * s, -60 * s); d = ImageDraw.Draw(im)
    m = 14 * s
    lw, lh = logo(im, 72 * s, m, 11 * s)
    fe = ImageFont.truetype(J5, 10 * s); d.text((m + lw + 8 * s, 14 * s), F['etiqueta'], font=fe, fill=OURO)
    cta = F['cta'].replace('Inscreva-se grátis', 'Inscreva-se').replace('Conheça o curso', 'Conheça')
    bw, bh = botao(d, W - m, H - 14 * s - 28 * s, cta, 12 * s, s, 'dir')
    ft, ls = cabe(d, F['curto'], J5, W - 2 * m - bw - 10 * s, 2, 18 * s, 14 * s)
    texto(d, (m, 40 * s), ls, ft, BRANCO, int(ft.size * 1.12))
    return im

def l_ret(Wb, Hb):
    def f(F, s):
        W, H = Wb * s, Hb * s; im = fundo(W, H, s); globo(im, 330 * s, Wb * 0.42 * s, Hb * 0.38 * s); d = ImageDraw.Draw(im)
        m = 22 * s
        lw, lh = logo(im, 112 * s, m, 22 * s)
        ye = 22 * s + lh + 14 * s
        fe = ImageFont.truetype(J5, 13 * s); d.text((m, ye), F['etiqueta'], font=fe, fill=OURO)
        d.line([(m, ye + 24 * s), (m + 34 * s, ye + 24 * s)], fill=OURO, width=s)
        yt = ye + 36 * s
        bh = 38 * s; yb = H - 22 * s - bh
        espaco = yb - 14 * s - yt
        for tam in range(30, 19, -1):
            ft, ls = cabe(d, F['titulo'], J5, W - 2 * m, 3, tam * s, tam * s)
            alt = len(ls) * int(ft.size * 1.12)
            if alt <= espaco: break
        y = texto(d, (m, yt), ls, ft, BRANCO, int(ft.size * 1.12))
        fa = ImageFont.truetype(J4, 13 * s)
        if y + 6 * s + 16 * s <= yb - 10 * s and d.textlength(F['apoio'], font=fa) <= W - 2 * m:
            d.text((m, y + 4 * s), F['apoio'], font=fa, fill=APOIO)
        botao(d, m, yb, F['cta'], 15 * s, s)
        return im
    return f

def l_300x600(F, s):
    W, H = 300 * s, 600 * s; im = fundo(W, H, s); globo(im, 520 * s, -40 * s, 300 * s, 0.34); d = ImageDraw.Draw(im)
    m = 28 * s
    lw, lh = logo(im, 150 * s, m, 36 * s)
    y0 = 36 * s + lh + 44 * s
    fe = ImageFont.truetype(J5, 16 * s); d.text((m, y0), F['etiqueta'], font=fe, fill=OURO)
    d.line([(m, y0 + 32 * s), (m + 40 * s, y0 + 32 * s)], fill=OURO, width=s)
    ft, ls = cabe(d, F['titulo'], J5, W - 2 * m, 5, 40 * s, 28 * s)
    y = texto(d, (m, y0 + 50 * s), ls, ft, BRANCO, int(ft.size * 1.12))
    fa, la = cabe(d, F['apoio'], J4, W - 2 * m, 3, 17 * s, 14 * s)
    texto(d, (m, y + 14 * s), la, fa, APOIO, int(fa.size * 1.35))
    botao(d, m, H - 40 * s - 46 * s, F['cta'], 18 * s, s)
    return im

def l_160x600(F, s):
    W, H = 160 * s, 600 * s; im = fundo(W, H, s); globo(im, 360 * s, -60 * s, 330 * s, 0.34); d = ImageDraw.Draw(im)
    m = 16 * s
    lw, lh = logo(im, 116 * s, m, 30 * s)
    y0 = 30 * s + lh + 34 * s
    fe = ImageFont.truetype(J5, 13 * s); le = [p.strip() for p in F['etiqueta'].split('·')]
    y = texto(d, (m, y0), le, fe, OURO, int(fe.size * 1.35))
    d.line([(m, y + 6 * s), (m + 30 * s, y + 6 * s)], fill=OURO, width=s)
    ft, ls = cabe(d, F['titulo'], J5, W - 2 * m, 6, 26 * s, 19 * s)
    y = texto(d, (m, y + 20 * s), ls, ft, BRANCO, int(ft.size * 1.13))
    fa, la = cabe(d, F['apoio'], J4, W - 2 * m, 4, 13 * s, 11 * s)
    texto(d, (m, y + 12 * s), la, fa, APOIO, int(fa.size * 1.35))
    cta = F['cta'].replace('Inscreva-se grátis', 'Inscreva-se').replace('Conheça o curso', 'Conheça')
    botao(d, W / 2, H - 34 * s - 36 * s, cta, 14 * s, s, 'centro')
    return im

def l_320x50(F, s):
    W, H = 320 * s, 50 * s; im = fundo(W, H, s); globo(im, 160 * s, 200 * s, -55 * s); d = ImageDraw.Draw(im)
    m = 10 * s
    lw, lh = logo(im, 54 * s, m, (H - 14 * s) / 2)
    x = m + lw + 9 * s
    cta = F['cta'].replace('Inscreva-se grátis', 'Inscreva-se').replace('Conheça o curso', 'Conheça')
    bw, bh = botao(d, W - m, (H - 26 * s) / 2, cta, 11 * s, s, 'dir')
    larg = W - m - bw - 8 * s - x
    fe = ImageFont.truetype(J5, 9 * s); fe_t = F['etiqueta']
    d.text((x, 8 * s), fe_t, font=fe, fill=OURO)
    ft, ls = cabe(d, F['curto'], J5, larg, 1, 14 * s, 10 * s)
    d.text((x, 23 * s), ls[0], font=ft, fill=BRANCO)
    return im

LAYOUTS = {
    '970x250': l_970x250, '728x90': l_728x90, '320x100': l_320x100,
    '300x600': l_300x600, '160x600': l_160x600,
    '336x280': l_ret(336, 280), '300x250': l_ret(300, 250), '320x50': l_320x50,
}

def card_16x9():
    # Capa do card de categoria (posicao 5 do grid), 16:9 sem texto proprio: o card ja traz titulo e CTA.
    W, H = 1200, 675; im = fundo(W, H, 1); globo(im, 900, 520, -160, 0.40)
    l = svg('veja-negocios-apresenta-escuro.svg', 620)
    im.paste(l, (int((W - l.width) / 2) - 120, int((H - l.height) / 2)), l)
    return im

if __name__ == '__main__':
    card_16x9().save(f'{OUT}/ei-card-1200x675.webp', 'WEBP', quality=88, method=6)
    for fase, F in FASES.items():
        for tam, fn in LAYOUTS.items():
            for s in (1, 2):
                im = fn(F, s)
                nome = f'ei-{fase}-{tam}' + ('@2x' if s == 2 else '')
                im.save(f'{OUT}/{nome}.webp', 'WEBP', quality=90, method=6)
                im.save(f'{OUT}/{nome}.jpg', 'JPEG', quality=88, optimize=True, progressive=True)
    print('ok', OUT)

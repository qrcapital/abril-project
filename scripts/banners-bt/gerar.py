# Pecas de display da Estrategia Internacional para o blocktrends.com.br (fora do Ad Manager).
# v2 (06/out/2026): pecas ANIMADAS, alternando uma tela vinho e uma tela branca (pedido do
# Marcelo, "pra ter dinamismo e nao ficar paradona"), e acabamento revisto: botoes maiores,
# com respiro minimo garantido entre titulo e botao.
#
# Duas fases: 'live' (ate a live de 13/10, 19h) e 'curso' (inscricoes abertas).
# Saida: ei2-{fase}-{tam}.webp e @2x (WebP animado: mesmo efeito de um GIF, sem a perda
# de cor do GIF, que tem 256 cores e faria degrau no degrade do vinho) + previas PNG.
# Uso: python3 scripts/banners-bt/gerar.py [pasta_saida]
import io, os, sys, tempfile
from PIL import Image, ImageDraw, ImageFont
import cairosvg
from fontTools.ttLib import TTFont

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..') + '/'
OUT = sys.argv[1] if len(sys.argv) > 1 else R + 'scripts/banners-bt/out'
os.makedirs(OUT, exist_ok=True)
TMP = tempfile.mkdtemp()
TEMPO_MS = 2400   # quanto cada tela fica parada

def ttf(peso):
    f = TTFont(R + f'public/fonts/jost-latin-{peso}-normal.woff2'); f.flavor = None
    p = f'{TMP}/jost-{peso}.ttf'; f.save(p); return p
J4, J5 = ttf('400'), ttf('500')

# Duas telas. Mesma composicao, cores trocadas: o olho le a mesma mensagem nas duas.
TELAS = {
    'vinho': dict(fundo=((122, 20, 32), (74, 11, 20)), titulo=(253, 250, 245), etiqueta=(214, 186, 128),
                  apoio=(236, 220, 200), btn=(214, 186, 128), btn_txt=(58, 9, 16), fio=(214, 186, 128),
                  logo='veja-negocios-escuro.svg', logo_mono='#F7F5F2', globo='globo-dourado.svg', globo_a=0.38),
    'branco': dict(fundo=((253, 250, 245), (244, 238, 228)), titulo=(110, 17, 28), etiqueta=(142, 21, 34),
                   apoio=(92, 74, 70), btn=(142, 21, 34), btn_txt=(253, 250, 245), fio=(142, 21, 34),
                   logo='veja-negocios-claro.svg', logo_mono=None, globo='globo-vermelho.svg', globo_a=0.16),
}

FASES = {
    'live': dict(etiqueta='Live gratuita · 13/10, 19h', titulo='Como investir fora do Brasil, ao vivo.',
                 curto='Como investir fora do Brasil', mini='Investir fora do Brasil', apoio='Com Tony Volpon e Rodolfo Bastos',
                 cta='Inscreva-se grátis', cta_curto='Inscreva-se'),
    'curso': dict(etiqueta='Inscrições abertas', titulo='Estratégia Internacional.',
                  curto='Estratégia Internacional', mini='Estratégia Internacional', apoio='4 módulos para investir fora do Brasil',
                  cta='Conheça o curso', cta_curto='Conheça'),
}

_cache = {}
def svg(nome, w=None, h=None, mono=None):
    k = (nome, w, h, mono)
    if k not in _cache:
        kw = {}
        if w: kw['output_width'] = int(w)
        if h: kw['output_height'] = int(h)
        src = open(R + 'public/marca/' + nome, encoding='utf-8').read()
        # Sobre o vinho o "veja" vermelho some: versao monocromatica em creme (negativo da marca).
        if mono: src = src.replace('#E4002B', mono)
        _cache[k] = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=src.encode('utf-8'), **kw))).convert('RGBA')
    return _cache[k]

def fundo(W, H, T):
    # degrade diagonal suave: calculado numa grade pequena e ampliado (bilinear)
    a, b = T['fundo']; g = Image.new('RGB', (48, 48)); px = g.load()
    for y in range(48):
        for x in range(48):
            t = x / 47 * 0.55 + y / 47 * 0.45
            px[x, y] = tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3))
    return g.resize((W, H), Image.BILINEAR)

def globo(im, T, tam, x, y, fator=1.0):
    g = svg(T['globo'], tam, tam).copy()
    g.putalpha(g.split()[3].point(lambda v: int(v * T['globo_a'] * fator)))
    im.paste(g, (int(x), int(y)), g)

def logo(im, T, larg, x, y):
    l = svg(T['logo'], larg, mono=T['logo_mono'])
    im.paste(l, (int(x), int(y)), l); return l.size

def tam_logo(T, larg):
    return svg(T['logo'], larg, mono=T['logo_mono']).size

def quebra(d, texto, f, larg):
    linhas, atual = [], ''
    for p in texto.split():
        t = (atual + ' ' + p).strip()
        if d.textlength(t, font=f) <= larg or not atual: atual = t
        else: linhas.append(atual); atual = p
    if atual: linhas.append(atual)
    return linhas

def cabe(d, texto, peso, larg, max_linhas, tam_max, tam_min):
    for tam in range(int(tam_max), int(tam_min) - 1, -1):
        f = ImageFont.truetype(peso, tam)
        ls = quebra(d, texto, f, larg)
        if len(ls) <= max_linhas and all(d.textlength(l, font=f) <= larg for l in ls): return f, ls
    f = ImageFont.truetype(peso, int(tam_min)); return f, quebra(d, texto, f, larg)

def medida_botao(texto, tam):
    f = ImageFont.truetype(J5, int(tam)); dd = ImageDraw.Draw(Image.new('RGB', (1, 1)))
    tw = dd.textlength(texto, font=f); ph, pv = int(tam * 1.05), int(tam * 0.7)
    return int(tw + 2 * ph), int(tam * 1.0 + 2 * pv)

def botao(d, T, x, y, texto, tam, alinhar='esq'):
    f = ImageFont.truetype(J5, int(tam))
    w, h = medida_botao(texto, tam)
    if alinhar == 'dir': x = x - w
    if alinhar == 'centro': x = x - w / 2
    d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2, fill=T['btn'])
    # centro optico: ancora 'mm' centraliza pela caixa do texto
    d.text((x + w / 2, y + h / 2 + tam * 0.04), texto, font=f, fill=T['btn_txt'], anchor='mm')
    return w, h

def texto(d, xy, linhas, f, cor, entre):
    x, y = xy
    for l in linhas:
        d.text((x, y), l, font=f, fill=cor); y += entre
    return y

def etiqueta(d, T, x, y, txt, tam, fio=True):
    d.text((x, y), txt, font=ImageFont.truetype(J5, int(tam)), fill=T['etiqueta'])
    if fio: d.line([(x, y + tam * 1.75), (x + tam * 2.4, y + tam * 1.75)], fill=T['fio'], width=max(1, int(tam / 14)))

# ------------------------------------------------------------------ layouts
def l_970x250(F, T, s):
    W, H = 970 * s, 250 * s; im = fundo(W, H, T); globo(im, T, 560 * s, 600 * s, -170 * s); d = ImageDraw.Draw(im)
    m = 48 * s
    bw, bh = medida_botao(F['cta'], 22 * s)
    col = W - 2 * m - bw - 48 * s                      # coluna de texto nunca encosta no botao
    ft, ls = cabe(d, F['titulo'], J5, col, 2, 46 * s, 30 * s)
    lh_t = int(ft.size * 1.1)
    bloco = 17 * s + 27 * s + len(ls) * lh_t + 10 * s + 20 * s
    y0 = (H - bloco) // 2
    etiqueta(d, T, m, y0, F['etiqueta'], 17 * s)
    y = texto(d, (m, y0 + 44 * s), ls, ft, T['titulo'], lh_t)
    d.text((m, y + 10 * s), F['apoio'], font=ImageFont.truetype(J4, 18 * s), fill=T['apoio'])
    lw, lh = tam_logo(T, 170 * s); logo(im, T, 170 * s, W - m - lw, 40 * s)
    botao(d, T, W - m, H - 40 * s - bh, F['cta'], 22 * s, 'dir')
    return im

def l_728x90(F, T, s):
    W, H = 728 * s, 90 * s; im = fundo(W, H, T); globo(im, T, 300 * s, 470 * s, -105 * s); d = ImageDraw.Draw(im)
    m = 20 * s
    lw, lh = logo(im, T, 92 * s, m, (H - 23 * s) / 2)
    xl = m + lw + 16 * s; d.line([(xl, 22 * s), (xl, H - 22 * s)], fill=T['fio'], width=s)
    x = xl + 16 * s
    bw, bh = medida_botao(F['cta'], 17 * s)
    botao(d, T, W - m, (H - bh) / 2, F['cta'], 17 * s, 'dir')
    etiqueta(d, T, x, 19 * s, F['etiqueta'], 12 * s, fio=False)
    ft, ls = cabe(d, F['curto'], J5, W - m - bw - 24 * s - x, 1, 25 * s, 17 * s)
    d.text((x, 38 * s), ls[0], font=ft, fill=T['titulo'])
    return im

def l_320x100(F, T, s):
    W, H = 320 * s, 100 * s; im = fundo(W, H, T); globo(im, T, 200 * s, 190 * s, -60 * s); d = ImageDraw.Draw(im)
    m = 14 * s
    lw, lh = logo(im, T, 76 * s, m, 12 * s)
    etiqueta(d, T, m + lw + 9 * s, 15 * s, F['etiqueta'], 10 * s, fio=False)
    bw, bh = medida_botao(F['cta_curto'], 14 * s)
    botao(d, T, W - m, H - 13 * s - bh, F['cta_curto'], 14 * s, 'dir')
    ft, ls = cabe(d, F['curto'], J5, W - 2 * m - bw - 22 * s, 2, 18 * s, 14 * s)
    alt = len(ls) * int(ft.size * 1.12)
    texto(d, (m, 40 * s + (H - 40 * s - 12 * s - alt) / 2), ls, ft, T['titulo'], int(ft.size * 1.12))
    return im

def l_ret(Wb, Hb):
    def f(F, T, s):
        W, H = Wb * s, Hb * s; im = fundo(W, H, T); globo(im, T, 330 * s, Wb * 0.42 * s, Hb * 0.38 * s); d = ImageDraw.Draw(im)
        m = 22 * s
        lw, lh = logo(im, T, 112 * s, m, 22 * s)
        ye = 22 * s + lh + 14 * s
        etiqueta(d, T, m, ye, F['etiqueta'], 13 * s)
        yt = ye + 36 * s
        bw, bh = medida_botao(F['cta'], 17 * s); yb = H - 22 * s - bh
        espaco = yb - 16 * s - yt
        for tam in range(30, 19, -1):
            ft, ls = cabe(d, F['titulo'], J5, W - 2 * m, 3, tam * s, tam * s)
            if len(ls) * int(ft.size * 1.12) <= espaco: break
        y = texto(d, (m, yt), ls, ft, T['titulo'], int(ft.size * 1.12))
        fa = ImageFont.truetype(J4, 13 * s)
        if y + 8 * s + 17 * s <= yb - 12 * s and d.textlength(F['apoio'], font=fa) <= W - 2 * m:
            d.text((m, y + 8 * s), F['apoio'], font=fa, fill=T['apoio'])
        botao(d, T, m, yb, F['cta'], 17 * s)
        return im
    return f

def l_300x600(F, T, s):
    W, H = 300 * s, 600 * s; im = fundo(W, H, T); globo(im, T, 520 * s, -40 * s, 300 * s, 0.9); d = ImageDraw.Draw(im)
    m = 28 * s
    lw, lh = logo(im, T, 150 * s, m, 36 * s)
    y0 = 36 * s + lh + 44 * s
    etiqueta(d, T, m, y0, F['etiqueta'], 16 * s)
    ft, ls = cabe(d, F['titulo'], J5, W - 2 * m, 5, 40 * s, 28 * s)
    y = texto(d, (m, y0 + 50 * s), ls, ft, T['titulo'], int(ft.size * 1.12))
    fa, la = cabe(d, F['apoio'], J4, W - 2 * m, 3, 17 * s, 14 * s)
    texto(d, (m, y + 14 * s), la, fa, T['apoio'], int(fa.size * 1.35))
    bw, bh = medida_botao(F['cta'], 21 * s)
    botao(d, T, W / 2, H - 40 * s - bh, F['cta'], 21 * s, 'centro')
    return im

def l_160x600(F, T, s):
    W, H = 160 * s, 600 * s; im = fundo(W, H, T); globo(im, T, 360 * s, -60 * s, 330 * s, 0.9); d = ImageDraw.Draw(im)
    m = 16 * s
    lw, lh = logo(im, T, 120 * s, m, 30 * s)
    y0 = 30 * s + lh + 34 * s
    fe = ImageFont.truetype(J5, 13 * s); le = [p.strip() for p in F['etiqueta'].split('·')]
    y = texto(d, (m, y0), le, fe, T['etiqueta'], int(fe.size * 1.35))
    d.line([(m, y + 6 * s), (m + 30 * s, y + 6 * s)], fill=T['fio'], width=s)
    ft, ls = cabe(d, F['titulo'], J5, W - 2 * m, 6, 26 * s, 19 * s)
    y = texto(d, (m, y + 20 * s), ls, ft, T['titulo'], int(ft.size * 1.13))
    fa, la = cabe(d, F['apoio'], J4, W - 2 * m, 4, 13 * s, 11 * s)
    texto(d, (m, y + 12 * s), la, fa, T['apoio'], int(fa.size * 1.35))
    tam = 17 * s
    while medida_botao(F['cta_curto'], tam)[0] > W - 2 * m and tam > 12 * s: tam -= s
    bw, bh = medida_botao(F['cta_curto'], tam)
    botao(d, T, W / 2, H - 34 * s - bh, F['cta_curto'], tam, 'centro')
    return im

def l_320x50(F, T, s):
    W, H = 320 * s, 50 * s; im = fundo(W, H, T); globo(im, T, 160 * s, 200 * s, -55 * s); d = ImageDraw.Draw(im)
    m = 10 * s
    lw, lh = logo(im, T, 58 * s, m, (H - 15 * s) / 2)
    x = m + lw + 10 * s
    bw, bh = medida_botao(F['cta_curto'], 13 * s)
    botao(d, T, W - m, (H - bh) / 2, F['cta_curto'], 13 * s, 'dir')
    larg = W - m - bw - 12 * s - x
    etiqueta(d, T, x, 8 * s, F['etiqueta'], 9 * s, fio=False)
    ft, ls = cabe(d, F['mini'], J5, larg, 1, 15 * s, 11 * s)
    d.text((x, 22 * s), ls[0], font=ft, fill=T['titulo'])
    return im

# Nome de arquivo SEM a medida: bloqueador de anuncio (listas tipo EasyList) derruba imagem
# cujo nome traz tamanho classico de midia (-300x600., -160x600., -970x250.) e pasta "banners".
# A lateral da materia sumiu assim para quem usa bloqueador (06/out). Nome neutro por posicao.
NOMES = {'970x250': 'topo', '728x90': 'faixa', '320x100': 'topo-m', '300x600': 'coluna',
         '160x600': 'coluna-e', '336x280': 'quadro', '300x250': 'quadro-m', '320x50': 'rodape-m'}

LAYOUTS = {
    '970x250': l_970x250, '728x90': l_728x90, '320x100': l_320x100,
    '300x600': l_300x600, '160x600': l_160x600,
    '336x280': l_ret(336, 280), '300x250': l_ret(300, 250), '320x50': l_320x50,
}

def card_16x9():
    # Capa do card de categoria (posicao 5 do grid), 16:9 sem texto proprio: o card ja traz titulo e CTA.
    T = TELAS['vinho']; W, H = 1200, 675; im = fundo(W, H, T); globo(im, T, 900, 520, -160, 1.05)
    l = svg('veja-negocios-apresenta-escuro.svg', 620, mono='#F7F5F2')
    im.paste(l, (int((W - l.width) / 2) - 120, int((H - l.height) / 2)), l)
    return im

if __name__ == '__main__':
    card_16x9().save(f'{OUT}/ei-card-1200x675.webp', 'WEBP', quality=88, method=6)
    for fase, F in FASES.items():
        for tam, fn in LAYOUTS.items():
            for s in (1, 2):
                quadros = [fn(F, TELAS['vinho'], s), fn(F, TELAS['branco'], s)]
                nome = f'ei-{fase}-{NOMES[tam]}' + ('@2x' if s == 2 else '')
                quadros[0].save(f'{OUT}/{nome}.webp', 'WEBP', save_all=True, append_images=quadros[1:],
                                duration=TEMPO_MS, loop=0, quality=88, method=6)
                if s == 1:
                    for i, q in enumerate(quadros): q.save(f'{OUT}/previa-{fase}-{tam}-{i}.png')
    print('ok', OUT)

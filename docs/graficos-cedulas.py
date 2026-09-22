# -*- coding: utf-8 -*-
"""Os dois graficos do diagnostico desenhados como CEDULAS, com anotacao.

A serie e a FRONTEIRA do papel, nao um traco sobre grade. No real a area
sob a curva e o que sobrou da nota e a borda e um rasgo; no dolar a area
e o quanto a cedula ja encheu e a borda e limpa.

Decisoes de 22/set (2a rodada):
 - a cedula encosta na margem esquerda do container (NX=0) e vai ate a
   direita: ela e um objeto de largura cheia, nao uma figura centrada;
 - a anotacao subiu para a faixa acima da cedula, alinhada a direita, e a
   seta sai de DENTRO da serie e aponta PARA o texto;
 - a seta perdeu o tremor grosso: e um arco unico com ruido quase nulo;
 - guilhoche e roseta emagreceram (menos vertices, coordenadas inteiras)
   porque o SVG inteiro e rerasterizado a cada quadro da animacao de clip."""
import re, ast, math, random

d = ast.literal_eval(open("/tmp/graficos.py").read())
pt = lambda k: [tuple(map(float, m)) for m in re.findall(r'([\d.]+) ([\d.]+)', d[k])]
valP = lambda y: 100 - 75*(y-26.0)/178.5
valD = lambda y: 2 + (y-145.7)*(2/(88.2-145.7))
serieP = [(x/1000.0, valP(y)) for x, y in pt('linhaP')]
serieD = [(x/1000.0, valD(y)) for x, y in pt('linhaD')]

SANS  = ("-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text',"
         "'Inter','Helvetica Neue',system-ui,sans-serif")
SERIF = "'Playfair Display',Georgia,serif"
VW, VH = 1000, 572
NX, NY, NW, NH = 0, 96, 1000, 380   # 2,63:1, perto da proporcao de uma cedula real
Y_DATAS, Y_FONTE = NY+NH+32, 552
TINTA, VERM = "#1a1815", "#C1121F"

px = lambda t: NX + t*NW
py = lambda v, vmax: NY + NH - (v/vmax)*NH

def reamostra(serie, vmax, passo=3.0):
    pts, n = [], int(NW/passo)
    for i in range(n+1):
        t = i/n
        lo, hi = 0, len(serie)-1
        while hi-lo > 1:
            m = (lo+hi)//2
            if serie[m][0] <= t: lo = m
            else: hi = m
        t0, v0 = serie[lo]; t1, v1 = serie[hi]
        v = v0 if t1 == t0 else v0 + (v1-v0)*(t-t0)/(t1-t0)
        pts.append((px(t), py(v, vmax)))
    return pts

def guilhoche(op):
    """14 fios de 24 vertices com coordenada inteira. A versao anterior
    tinha 22 x 48 em decimal e pesava ~25KB por grafico, rerasterizados a
    cada quadro do clip."""
    g = ['<g stroke="%s" fill="none" stroke-width=".75" opacity="%s">' % (VERM, op)]
    for i in range(17):
        y = NY + 20 + i*(NH-40)/16
        amp = 5 + 3*math.sin(i*0.8)
        p = f'M {NX+18} {round(y)}'
        for k in range(1, 27):
            p += f' L {round(NX+18 + k*(NW-36)/26)} {round(y + amp*math.sin(k*0.9 + i*0.95))}'
        g.append(f'<path d="{p}"/>')
    return "".join(g) + '</g>'

def medalhao(cx, cy, op):
    """Medalhao oval de guilhoche, no lugar onde uma cedula poe o retrato.

    Tentei desenhar um perfil gravado ali e ficou desenho animado: rosto a
    mao em bezier, sem referencia, nao chega a lugar nenhum. Medalhao de
    guilhoche puro e vocabulario legitimo de cedula, e e geometria, entao
    sai preciso em vez de amador. (E evita chegar perto de reproduzir o
    retrato de uma nota que existe.)"""
    RX, RY = 112, 146
    g = [f'<g stroke="{VERM}" fill="none" opacity="{op}">']
    for k in (1.0, .93, .74, .68):
        g.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{round(RX*k)}" ry="{round(RY*k)}" stroke-width="{1.4 if k==1 else .8}"/>')
    for k in range(44):                      # denteado entre os dois aneis externos
        a = k*math.tau/44
        g.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke-width=".7"/>' % (
            cx+RX*.93*math.cos(a), cy+RY*.93*math.sin(a), cx+RX*math.cos(a), cy+RY*math.sin(a)))
    for j in range(9):                       # trama interna: elipses giradas
        ang = j*180/9
        g.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{round(RX*.66)}" ry="{round(RY*.30)}" '
                 f'transform="rotate({round(ang)} {cx} {cy})" stroke-width=".55" opacity=".8"/>')
    return "".join(g) + '</g>'

def banda(x, op):
    """Fio de seguranca: faixa vertical de hachura fina, como o das cedulas."""
    g = [f'<g stroke="{VERM}" fill="none" opacity="{op}">',
         f'<rect x="{x}" y="{NY+18}" width="26" height="{NH-36}" stroke-width=".9"/>']
    for k in range(int((NH-36)/9)):
        y = NY+18 + k*9
        g.append(f'<line x1="{x+2}" y1="{y}" x2="{x+24}" y2="{y+5}" stroke-width=".6"/>')
    return "".join(g) + '</g>'


def filigrana(op):
    """Arco duplo nos quatro cantos, a moldura ornamental das cedulas."""
    g = [f'<g stroke="{VERM}" fill="none" opacity="{op}" stroke-width=".9">']
    for sx, sy, ox, oy in ((1,1,NX+22,NY+22), (-1,1,NX+NW-22,NY+22),
                           (1,-1,NX+22,NY+NH-22), (-1,-1,NX+NW-22,NY+NH-22)):
        for r in (34, 26):
            g.append(f'<path d="M {ox+sx*r} {oy} A {r} {r} 0 0 {1 if sx*sy>0 else 0} {ox} {oy+sy*r}"/>')
    return "".join(g) + '</g>'


def cedula(rotulo, valor, data, lado, cheia, idp):
    tx  = NX+62 if lado == "esq" else NX+NW-62
    anc = "start" if lado == "esq" else "end"
    mx  = NX+NW-300 if lado == "esq" else NX+300
    bx  = NX+330 if lado == "esq" else NX+NW-356
    o_g, o_r, o_t = (".34", ".46", "1") if cheia else (".5", ".6", ".42")
    g = []
    if cheia:
        g.append(f'<rect x="{NX}" y="{NY}" width="{NW}" height="{NH}" rx="12" fill="url(#{idp})"/>')
        g.append(guilhoche(o_g))
    g.append(medalhao(mx, NY+NH//2, o_r))
    g.append(banda(bx, o_r))
    g.append(f'<rect x="{NX}" y="{NY}" width="{NW}" height="{NH}" rx="12" fill="none" stroke="{VERM}" stroke-width="{2 if cheia else 1.2}" opacity="{1 if cheia else .8}"/>')
    g.append(f'<rect x="{NX+14}" y="{NY+14}" width="{NW-28}" height="{NH-28}" rx="6" fill="none" stroke="{VERM}" stroke-width="1" opacity="{o_r}"/>')
    g.append(filigrana(o_r))
    g.append(f'<g opacity="{o_t}">')
    g.append(f'<text x="{tx}" y="{NY+NH-118}" text-anchor="{anc}" font-family="{SERIF}" font-size="104" font-weight="600" fill="{TINTA}">{valor}</text>')
    g.append(f'<text x="{tx}" y="{NY+NH-82}" text-anchor="{anc}" font-family="{SERIF}" font-size="25" font-weight="600" letter-spacing="7" fill="{VERM}" opacity=".85">{EXTENSO}</text>')
    g.append(f'<text x="{tx}" y="{NY+NH-54}" text-anchor="{anc}" font-family="{SANS}" font-size="12" letter-spacing="3.2" fill="{TINTA}" opacity=".5">{rotulo} · {data}</text>')
    g.append('</g>')
    n = valor.split()[-1]
    for ax, ay, a2 in ((NX+34, NY+46, "start"), (NX+NW-34, NY+46, "end"),
                       (NX+34, NY+NH-26, "start"), (NX+NW-34, NY+NH-26, "end")):
        g.append(f'<text x="{ax}" y="{ay}" text-anchor="{a2}" font-family="{SERIF}" font-size="27" font-weight="600" fill="{VERM}" opacity="{o_r}">{n}</text>')
    return "".join(g)

def papel(idp):
    return (f'<linearGradient id="{idp}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{VERM}" stop-opacity=".17"/>'
            f'<stop offset="1" stop-color="{VERM}" stop-opacity=".065"/></linearGradient>')

def rasgo(pts, semente):
    rnd = random.Random(semente); out = []
    for i, (x, y) in enumerate(pts):
        n = rnd.uniform(-1.6, 1.6)
        if i % 9 == 0:   n += rnd.uniform(-6, 2)
        if i % 23 == 0:  n += rnd.uniform(-12, -4)
        if i % 53 == 0:  n += rnd.uniform(-18, -7)
        out.append((round(x), round(min(NY+NH, y+n))))
    return out

def caco(rnd, x, y):
    s = rnd.uniform(1.8, 5.4); p = []
    for k in range(4):
        a = k*1.5708 + rnd.uniform(-.45, .45)
        p.append("%d,%d" % (x+s*math.cos(a)*rnd.uniform(.5,1.25), y+s*math.sin(a)*rnd.uniform(.5,1.25)))
    return '<polygon points="%s" fill="%s" opacity="%.2f"/>' % (" ".join(p), VERM, rnd.uniform(.12,.40))

def seta(p0, p1, curva=0.20):
    """Arco unico, quase sem tremor: 'mais certinha'. O que sobra de mao e
    o leve desvio do eixo e a farpa aberta em duas linhas, nao um poligono."""
    mx = (p0[0]+p1[0])/2 + (p1[1]-p0[1])*curva
    my = (p0[1]+p1[1])/2 - (p1[0]-p0[0])*curva
    ps = [( (1-t)**2*p0[0] + 2*(1-t)*t*mx + t*t*p1[0],
            (1-t)**2*p0[1] + 2*(1-t)*t*my + t*t*p1[1] ) for t in [i/18 for i in range(19)]]
    dd = "M %d %d " % ps[0] + " ".join("L %d %d" % (round(a), round(b)) for a, b in ps[1:])
    ang = math.atan2(ps[-1][1]-ps[-3][1], ps[-1][0]-ps[-3][0])
    for da in (2.6, -2.6):
        a = ang + da
        dd += " M %d %d L %d %d" % (round(ps[-1][0]), round(ps[-1][1]),
                                    round(ps[-1][0]+12*math.cos(a)), round(ps[-1][1]+12*math.sin(a)))
    return dd

def anotacao(linhas, x, y):
    t = [f'<g class="graf-nota" transform="rotate(-.9 {x} {y})">']
    for i, l in enumerate(linhas):
        t.append(f'<text x="{x}" y="{y+i*28}" text-anchor="end" font-family="{SERIF}" '
                 f'font-style="italic" font-size="19" fill="{TINTA}" opacity=".78">{l}</text>')
    return "".join(t) + '</g>'

def rodape(fonte):
    return (f'<g font-family="{SANS}" fill="#6f6860" font-size="11.5">'
            f'<text x="{NX}" y="{Y_DATAS}" letter-spacing="1.6">JULHO DE 1994</text>'
            f'<text x="{NX+NW}" y="{Y_DATAS}" text-anchor="end" letter-spacing="1.6">SETEMBRO DE 2026</text>'
            f'<text x="{NX}" y="{Y_FONTE}" font-size="10.5" letter-spacing=".1em" opacity=".85">{fonte}</text></g>')

def moldura(corpo, alt):
    return (f'<svg viewBox="0 0 {VW} {VH}" style="width:100%;height:auto;display:block" '
            f'role="img" aria-label="{alt}">{corpo}</svg>')

# ==================================================================== REAL
EXTENSO = "CEM REAIS"
ptsP  = reamostra(serieP, 100.0)
borda = rasgo(ptsP, 7)
dP = "M %d %d " % (NX, NY+NH) + " ".join("L %d %d" % p for p in borda) + " L %d %d Z" % (NX+NW, NY+NH)
rnd = random.Random(11); cacos = []
for i, (x, y) in enumerate(ptsP):
    if i % 15: continue
    perdido = (y-NY)/NH
    for _ in range(int(perdido*2.2)):
        cacos.append(caco(rnd, x+rnd.uniform(-9, 9), y-rnd.uniform(5, 16+perdido*46)))

iP = int(len(ptsP)*0.45); origemP = (round(ptsP[iP][0]), round(ptsP[iP][1]))
setaP = seta(origemP, (556, 74), 0.20)

corpoP = f'''<defs><path id="serieP" d="{dP}"/><clipPath id="clipReal"><use href="#serieP"/></clipPath>{papel("papelP")}</defs>
{anotacao(["O rasgo segue o IPCA acumulado desde jul/1994.",
           "O papel inteiro é o poder de compra que sobrou."], NX+NW, 34)}
<g opacity=".2">{cedula("PODER DE COMPRA","R$ 100","JULHO DE 1994","esq",False,"papelP")}</g>
{"".join(cacos)}
<g clip-path="url(#clipReal)">{cedula("PODER DE COMPRA","R$ 100","JULHO DE 1994","esq",True,"papelP")}</g>
<use href="#serieP" fill="none" stroke="{VERM}" stroke-width="2.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
<g text-anchor="end">
<text x="{NX+NW-30}" y="{NY+130}" font-family="{SERIF}" font-size="58" font-weight="600" fill="{VERM}">R$ 11,23</text>
<text x="{NX+NW-30}" y="{NY+158}" font-family="{SANS}" font-size="13.5" fill="#6b655c">é o que sobrou dos R$ 100</text>
</g>
<path class="graf-seta" pathLength="1" d="{setaP}" fill="none" stroke="{TINTA}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
{rodape("Fonte: Banco Central do Brasil · série 433 (IPCA), jul/1994 a set/2026")}'''

svgP = moldura(corpoP, "Uma nota de cem reais de julho de 1994 desenhada como grafico. A parte inteira e o poder de compra que restou; o rasgo segue a serie do IPCA e chega a onze reais e vinte e tres centavos em setembro de 2026.")

# =================================================================== DOLAR
EXTENSO = "ONE DOLLAR"
VMAXD = 6.6
ptsD = [(round(x), round(y)) for x, y in reamostra(serieD, VMAXD)]
dD = "M %d %d " % (NX, NY+NH) + " ".join("L %d %d" % p for p in ptsD) + " L %d %d Z" % (NX+NW, NY+NH)
ipk = min(range(len(ptsD)), key=lambda i: ptsD[i][1]); pxp, pyp = ptsD[ipk]
iD = int(len(ptsD)*0.45); origemD = ptsD[iD]
setaD = seta(origemD, (556, 74), 0.20)

corpoD = f'''<defs><path id="serieD" d="{dD}"/><clipPath id="clipDolar"><use href="#serieD"/></clipPath>{papel("papelD")}</defs>
{anotacao(["A borda segue a PTAX de venda, média mensal.",
           "O papel cheio é quanto um dólar custa em reais."], NX+NW, 34)}
<g opacity=".2">{cedula("CÂMBIO","US$ 1","JULHO DE 1994","dir",False,"papelD")}</g>
<g clip-path="url(#clipDolar)">{cedula("CÂMBIO","US$ 1","JULHO DE 1994","dir",True,"papelD")}</g>
<use href="#serieD" fill="none" stroke="{VERM}" stroke-width="2.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
<g><circle cx="{pxp}" cy="{pyp}" r="4" fill="{TINTA}"/>
<text x="{pxp-16}" y="{pyp+34}" font-family="{SANS}" font-size="12.5" fill="{TINTA}" text-anchor="end" font-weight="600">R$ 6,10&#160;&#160;<tspan opacity=".55" font-weight="400">dez/2024</tspan></text></g>
<g>
<text x="{NX+30}" y="{NY+130}" font-family="{SERIF}" font-size="58" font-weight="600" fill="{VERM}">R$ 5,15</text>
<text x="{NX+30}" y="{NY+158}" font-family="{SANS}" font-size="13.5" fill="#6b655c">é o que ele custa hoje. Em 1994 custava R$ 0,93</text>
</g>
<path class="graf-seta" pathLength="1" d="{setaD}" fill="none" stroke="{TINTA}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
{rodape("Fonte: Banco Central do Brasil · série 3698 (PTAX venda), jul/1994 a set/2026")}'''

svgD = moldura(corpoD, "Um dolar desenhado como grafico. A parte preenchida e quanto ele vale em reais, de noventa e tres centavos em julho de 1994 a cinco reais e quinze centavos em setembro de 2026, com pico de seis reais e dez centavos em dezembro de 2024.")

open("/tmp/g2/real.svg","w").write(svgP)
open("/tmp/g2/dolar.svg","w").write(svgD)
print("real %dKB | dolar %dKB | origem seta: %s %s" % (len(svgP)//1024, len(svgD)//1024, origemP, origemD))

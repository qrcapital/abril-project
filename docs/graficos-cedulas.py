# -*- coding: utf-8 -*-
"""Os dois graficos do diagnostico desenhados como CEDULAS, com anotacao.

A serie e a FRONTEIRA do papel, nao um traco sobre grade. No real a area
sob a curva e o que sobrou da nota e a borda e um rasgo; no dolar a area
e o quanto a cedula ja encheu e a borda e limpa. Uma esvazia, a outra
enche, com o mesmo objeto.

A explicacao sai de legenda e vira ANOTACAO: uma seta desenhada a mao
puxa do meio da cedula para duas linhas em Playfair italico, do jeito que
uma marginalia de revista faria. Sem cartao branco em volta: a cedula
pousa direto no papel da pagina."""
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
VW, VH = 1000, 548
NX, NY, NW, NH = 70, 52, 860, 300
Y_DATAS, Y_NOTA, Y_FONTE = NY+NH+30, NY+NH+78, 536
TINTA, VERM = "#1a1815", "#C1121F"

px = lambda t: NX + t*NW
py = lambda v, vmax: NY + NH - (v/vmax)*NH

def reamostra(serie, vmax, passo=2.4):
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
    g = ['<g stroke="%s" fill="none" stroke-width=".75" opacity="%s">' % (VERM, op)]
    for i in range(22):
        y = NY + 14 + i*(NH-28)/21
        amp = 4.5 + 3.2*math.sin(i*0.8)
        p = f'M {NX+14} {y:.1f}'
        for k in range(1, 49):
            xx = NX+14 + k*(NW-28)/48
            p += f' L {xx:.1f} {y + amp*math.sin(k*0.48 + i*0.95):.1f}'
        g.append(f'<path d="{p}"/>')
    return "".join(g) + '</g>'

def roseta(cx, cy, op):
    g = [f'<g stroke="{VERM}" fill="none" opacity="{op}">']
    for r in (18, 27, 36, 47): g.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" stroke-width=".8"/>')
    for k in range(52):
        a = k*math.tau/52
        g.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke-width=".7"/>' % (
            cx+36*math.cos(a), cy+36*math.sin(a), cx+47*math.cos(a), cy+47*math.sin(a)))
    return "".join(g) + '</g>'

def cedula(rotulo, valor, data, lado, cheia):
    tx  = NX+54 if lado == "esq" else NX+NW-54
    anc = "start" if lado == "esq" else "end"
    rx  = NX+NW-124 if lado == "esq" else NX+124
    o_g, o_r, o_t = (".34", ".46", "1") if cheia else (".5", ".6", ".42")
    g = []
    if cheia:
        g.append(f'<rect x="{NX}" y="{NY}" width="{NW}" height="{NH}" rx="10" fill="url(#PAPEL)"/>')
        g.append(guilhoche(o_g))
    g.append(f'<rect x="{NX}" y="{NY}" width="{NW}" height="{NH}" rx="10" fill="none" stroke="{VERM}" stroke-width="{2 if cheia else 1.2}" opacity="{1 if cheia else .8}"/>')
    g.append(f'<rect x="{NX+13}" y="{NY+13}" width="{NW-26}" height="{NH-26}" rx="5" fill="none" stroke="{VERM}" stroke-width="1" opacity="{o_r}"/>')
    g.append(roseta(rx, NY+NH/2, o_r))
    g.append(f'<g opacity="{o_t}">')
    g.append(f'<text x="{tx}" y="{NY+NH-76}" text-anchor="{anc}" font-family="{SERIF}" font-size="90" font-weight="600" fill="{TINTA}">{valor}</text>')
    g.append(f'<text x="{tx}" y="{NY+NH-50}" text-anchor="{anc}" font-family="{SANS}" font-size="12" letter-spacing="3.2" fill="{TINTA}" opacity=".5">{rotulo} · {data}</text>')
    g.append('</g>')
    n = valor.split()[-1]
    g.append(f'<text x="{NX+28}" y="{NY+36}" font-family="{SERIF}" font-size="24" font-weight="600" fill="{VERM}" opacity="{o_r}">{n}</text>')
    g.append(f'<text x="{NX+NW-28}" y="{NY+NH-20}" text-anchor="end" font-family="{SERIF}" font-size="24" font-weight="600" fill="{VERM}" opacity="{o_r}">{n}</text>')
    return "".join(g)

DEFS_PAPEL = (f'<linearGradient id="PAPEL" x1="0" y1="0" x2="0" y2="1">'
              f'<stop offset="0" stop-color="{VERM}" stop-opacity=".17"/>'
              f'<stop offset="1" stop-color="{VERM}" stop-opacity=".065"/></linearGradient>')

def rasgo(pts, semente):
    rnd = random.Random(semente); out = []
    for i, (x, y) in enumerate(pts):
        n = rnd.uniform(-1.6, 1.6)
        if i % 11 == 0:  n += rnd.uniform(-7, 2)
        if i % 29 == 0:  n += rnd.uniform(-13, -4)
        if i % 67 == 0:  n += rnd.uniform(-19, -8)
        out.append((x, min(NY+NH, y+n)))
    return out

def caco(rnd, x, y):
    s = rnd.uniform(1.8, 5.4); p = []
    for k in range(4):
        a = k*1.5708 + rnd.uniform(-.45, .45)
        p.append("%.1f,%.1f" % (x+s*math.cos(a)*rnd.uniform(.5,1.25), y+s*math.sin(a)*rnd.uniform(.5,1.25)))
    return '<polygon points="%s" fill="%s" opacity="%.2f"/>' % (" ".join(p), VERM, rnd.uniform(.12,.40))

# ------------------------------------------------------- seta desenhada a mao
def seta(p0, p1, semente, curva=0.32):
    """Bezier com tremor: o tracado precisa parecer mao, nao ferramenta."""
    rnd = random.Random(semente)
    mx = (p0[0]+p1[0])/2 + (p1[1]-p0[1])*curva
    my = (p0[1]+p1[1])/2 - (p1[0]-p0[0])*curva
    ps = []
    for i in range(41):
        t = i/40
        x = (1-t)**2*p0[0] + 2*(1-t)*t*mx + t*t*p1[0]
        y = (1-t)**2*p0[1] + 2*(1-t)*t*my + t*t*p1[1]
        w = math.sin(t*math.pi)
        ps.append((x + rnd.uniform(-1.5,1.5)*w, y + rnd.uniform(-1.5,1.5)*w))
    dd = "M %.1f %.1f " % ps[0] + " ".join("L %.1f %.1f" % p for p in ps[1:])
    ang = math.atan2(ps[-1][1]-ps[-4][1], ps[-1][0]-ps[-4][0])
    farpa = []
    for da in (2.5, -2.5):
        a = ang + da
        farpa.append("M %.1f %.1f L %.1f %.1f" % (
            ps[-1][0], ps[-1][1], ps[-1][0]+13*math.cos(a), ps[-1][1]+13*math.sin(a)))
    return dd + " " + " ".join(farpa)

def anotacao(linhas, x, y, ancora="start", giro=-1.1):
    t = [f'<g class="graf-nota" transform="rotate({giro} {x} {y})">']
    for i, l in enumerate(linhas):
        t.append(f'<text x="{x}" y="{y+i*29}" text-anchor="{ancora}" font-family="{SERIF}" '
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
ptsP  = reamostra(serieP, 100.0)
borda = rasgo(ptsP, 7)
dP = "M %.1f %.1f " % (NX, NY+NH) + " ".join("L %.1f %.1f" % p for p in borda) + " L %.1f %.1f Z" % (NX+NW, NY+NH)
rnd = random.Random(11); cacos = []
for i, (x, y) in enumerate(ptsP):
    if i % 19: continue
    perdido = (y-NY)/NH
    for _ in range(int(perdido*2.4)):
        cacos.append(caco(rnd, x+rnd.uniform(-9, 9), y-rnd.uniform(5, 16+perdido*46)))

alvoP = ptsP[int(len(ptsP)*0.40)]
setaP = seta((452, Y_NOTA-22), (alvoP[0]+6, alvoP[1]+14), 3, 0.30)

corpoP = f'''<defs><clipPath id="clipReal"><path d="{dP}"/></clipPath>{DEFS_PAPEL}</defs>
<g opacity=".14">{cedula("PODER DE COMPRA","R$ 100","JULHO DE 1994","esq",False)}</g>
{"".join(cacos)}
<g clip-path="url(#clipReal)">{cedula("PODER DE COMPRA","R$ 100","JULHO DE 1994","esq",True)}</g>
<path d="{dP}" fill="none" stroke="{VERM}" stroke-width="2.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
<g text-anchor="end">
<text x="{NX+NW-16}" y="{NY+68}" font-family="{SERIF}" font-size="58" font-weight="600" fill="{VERM}">R$ 11,23</text>
<text x="{NX+NW-16}" y="{NY+96}" font-family="{SANS}" font-size="13.5" fill="#6b655c">é o que sobrou dos R$ 100</text>
</g>
<path class="graf-seta" pathLength="1" d="{setaP}" fill="none" stroke="{TINTA}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
{anotacao(["O rasgo segue o IPCA acumulado desde jul/1994.",
           "O papel inteiro é o poder de compra que sobrou."], 470, Y_NOTA)}
{rodape("Fonte: Banco Central do Brasil · série 433 (IPCA), jul/1994 a set/2026")}'''

svgP = moldura(corpoP, "Uma nota de cem reais de julho de 1994 desenhada como grafico. A parte inteira e o poder de compra que restou; o rasgo segue a serie do IPCA e chega a onze reais e vinte e tres centavos em setembro de 2026.")

# =================================================================== DOLAR
VMAXD = 6.6
ptsD = reamostra(serieD, VMAXD)
dD = "M %.1f %.1f " % (NX, NY+NH) + " ".join("L %.1f %.1f" % p for p in ptsD) + " L %.1f %.1f Z" % (NX+NW, NY+NH)
ip = min(range(len(ptsD)), key=lambda i: ptsD[i][1]); pxp, pyp = ptsD[ip]
alvoD = ptsD[int(len(ptsD)*0.40)]
setaD = seta((452, Y_NOTA-22), (alvoD[0]+6, alvoD[1]+14), 5, 0.30)

corpoD = f'''<defs><clipPath id="clipDolar"><path d="{dD}"/></clipPath>{DEFS_PAPEL.replace('id="PAPEL"','id="PAPELD"')}</defs>
<g opacity=".14">{cedula("CÂMBIO","US$ 1","JULHO DE 1994","dir",False)}</g>
<g clip-path="url(#clipDolar)">{cedula("CÂMBIO","US$ 1","JULHO DE 1994","dir",True).replace("url(#PAPEL)","url(#PAPELD)")}</g>
<path d="{dD}" fill="none" stroke="{VERM}" stroke-width="2.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
<g><line x1="{pxp:.1f}" y1="{pyp-6:.1f}" x2="{pxp:.1f}" y2="{NY-8}" stroke="{TINTA}" stroke-width="1" opacity=".34"/>
<circle cx="{pxp:.1f}" cy="{pyp:.1f}" r="4" fill="{TINTA}"/>
<text x="{pxp:.1f}" y="{NY-16}" font-family="{SANS}" font-size="12.5" fill="{TINTA}" text-anchor="middle" font-weight="600">R$ 6,10 <tspan opacity=".5" font-weight="400">dez/2024</tspan></text></g>
<g>
<text x="{NX+16}" y="{NY+68}" font-family="{SERIF}" font-size="58" font-weight="600" fill="{VERM}">R$ 5,15</text>
<text x="{NX+16}" y="{NY+96}" font-family="{SANS}" font-size="13.5" fill="#6b655c">é o que ele custa hoje. Em 1994 custava R$ 0,93</text>
</g>
<path class="graf-seta" pathLength="1" d="{setaD}" fill="none" stroke="{TINTA}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
{anotacao(["A borda segue a PTAX de venda, média mensal.",
           "O papel cheio é quanto um dólar custa em reais."], 470, Y_NOTA)}
{rodape("Fonte: Banco Central do Brasil · série 3698 (PTAX venda), jul/1994 a set/2026")}'''

svgD = moldura(corpoD, "Um dolar desenhado como grafico. A parte preenchida e quanto ele vale em reais, de noventa e tres centavos em julho de 1994 a cinco reais e quinze centavos em setembro de 2026, com pico de seis reais e dez centavos em dezembro de 2024.")

open("/tmp/g2/real.svg","w").write(svgP)
open("/tmp/g2/dolar.svg","w").write(svgD)
print("ok | alvo real:", [round(v) for v in alvoP], "| alvo dolar:", [round(v) for v in alvoD])

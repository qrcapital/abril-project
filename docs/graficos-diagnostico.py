# -*- coding: utf-8 -*-
"""Os dois graficos do diagnostico: serie pura, sem metafora de cedula.

A ideia de desenhar os dados como uma nota rasgada foi abandonada em
23/set. O que ficou e o que sempre foi o conteudo: duas series do Banco
Central, area preenchida, grade discreta e uma anotacao puxada por seta,
no sistema visual da campanha.

  serie 433  IPCA mensal  -> poder de compra de R$ 100 de jul/1994
  serie 3698 PTAX venda   -> quanto custa um dolar, media mensal
O ultimo ponto do dolar e atualizado no cliente pelo /api/dolar.
"""
import math, random
import series

serieP = series.poder_de_compra()
serieD = series.cambio()

SANS  = ("-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text',"
         "'Inter','Helvetica Neue',system-ui,sans-serif")
SERIF = "'Playfair Display',Georgia,serif"
VW, VH = 1000, 470
GX, GY, GW, GH = 58, 150, 928, 250          # area do grafico
TINTA, VERM = "#1a1815", "#C1121F"

def tx(x, y, txt, *, f=SANS, s=12, w="400", anc="start", fill=None,
       ls=None, op=None, extra=""):
    a = [f'x="{round(x)}"', f'y="{round(y)}"', f'font-family="{f}"',
         f'font-size="{s}"', f'font-weight="{w}"', f'fill="{fill or TINTA}"']
    if anc != "start": a.append(f'text-anchor="{anc}"')
    if ls is not None: a.append(f'letter-spacing="{ls}"')
    if op is not None: a.append(f'opacity="{op}"')
    if extra: a.append(extra)
    return f'<text {" ".join(a)}>{txt}</text>'

def reamostra(serie, vmax, passo=2.6):
    pts, n = [], int(GW/passo)
    for i in range(n+1):
        t = i/n
        lo, hi = 0, len(serie)-1
        while hi-lo > 1:
            m = (lo+hi)//2
            if serie[m][0] <= t: lo = m
            else: hi = m
        t0, v0 = serie[lo]; t1, v1 = serie[hi]
        v = v0 if t1 == t0 else v0 + (v1-v0)*(t-t0)/(t1-t0)
        pts.append((round(GX + t*GW), round(GY + GH - (v/vmax)*GH)))
    return pts

def grade(vmax, marcas, rotulo):
    """Pautas horizontais e anos. Discretas: a grade orienta, nao compete."""
    g = [f'<g font-family="{SANS}" font-size="11" fill="#6f6860">']
    for v in marcas:
        y = GY + GH - (v/vmax)*GH
        g.append(f'<line x1="{GX}" y1="{y:.1f}" x2="{GX+GW}" y2="{y:.1f}" '
                 f'stroke="rgba(26,24,21,.10)" stroke-width="1"/>')
        g.append(tx(GX-10, y+4, rotulo(v), s=11, anc="end", fill="#6f6860"))
    # eixo do tempo: a serie comeca em jul/1994 e termina em set/2026
    anos = [(1994, "1994"), (2000, "2000"), (2006, "2006"),
            (2012, "2012"), (2018, "2018"), (2024, "2024")]
    t0, t1 = 1994 + 6/12, 2026 + 8/12
    for a, r in anos:
        x = GX + GW*(a - t0)/(t1 - t0)
        g.append(f'<line x1="{x:.0f}" y1="{GY+GH}" x2="{x:.0f}" y2="{GY+GH+6}" '
                 f'stroke="rgba(26,24,21,.22)" stroke-width="1"/>')
        g.append(tx(x, GY+GH+24, r, s=11, anc="middle", fill="#6f6860"))
    g.append(f'<line x1="{GX}" y1="{GY+GH}" x2="{GX+GW}" y2="{GY+GH}" '
             f'stroke="rgba(26,24,21,.28)" stroke-width="1"/>')
    return "".join(g) + '</g>'

def seta(p0, p1, curva=0.20):
    mx = (p0[0]+p1[0])/2 + (p1[1]-p0[1])*curva
    my = (p0[1]+p1[1])/2 - (p1[0]-p0[0])*curva
    ps = [((1-t)**2*p0[0] + 2*(1-t)*t*mx + t*t*p1[0],
           (1-t)**2*p0[1] + 2*(1-t)*t*my + t*t*p1[1]) for t in [i/18 for i in range(19)]]
    d = "M %d %d " % (round(ps[0][0]), round(ps[0][1])) + \
        " ".join("L %d %d" % (round(a), round(b)) for a, b in ps[1:])
    ang = math.atan2(ps[-1][1]-ps[-3][1], ps[-1][0]-ps[-3][0])
    for da in (2.6, -2.6):
        a = ang + da
        d += " M %d %d L %d %d" % (round(ps[-1][0]), round(ps[-1][1]),
                                   round(ps[-1][0]+12*math.cos(a)), round(ps[-1][1]+12*math.sin(a)))
    return d

def cabeca(numero, legenda, linhas, gancho=False):
    gv = ' data-dolar="valor"' if gancho else ''
    g = [f'<text x="10" y="74" font-family="{SERIF}" font-size="58" font-weight="600" '
         f'fill="{VERM}"{gv}>{numero}</text>',
         tx(10, 102, legenda, s=13.5, fill="#6b655c"),
         '<g class="graf-nota">']
    for i, l in enumerate(linhas):
        g.append(f'<text x="{VW}" y="{44+i*28}" text-anchor="end" font-family="{SERIF}" '
                 f'font-style="italic" font-size="19" fill="{TINTA}" opacity=".78">{l}</text>')
    return "".join(g) + '</g>'

def rodape(fonte, vivo=False):
    gt = ' data-dolar="fonte"' if vivo else ''
    return (f'<g font-family="{SANS}" fill="#6f6860" font-size="10.5">'
            f'<text x="{GX}" y="{VH-12}" letter-spacing=".1em" opacity=".85"{gt}>{fonte}</text></g>')

def grafico(pts, vmax, cor_area, idp):
    d_area = ("M %d %d " % (GX, GY+GH) + " ".join("L %d %d" % p for p in pts)
              + " L %d %d Z" % (GX+GW, GY+GH))
    d_linha = "M %d %d " % pts[0] + " ".join("L %d %d" % p for p in pts[1:])
    return (f'<defs><linearGradient id="{idp}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{VERM}" stop-opacity=".2"/>'
            f'<stop offset="1" stop-color="{VERM}" stop-opacity=".03"/></linearGradient></defs>'
            f'<path d="{d_area}" fill="url(#{idp})"/>', d_linha)

# ==================================================================== REAL
VMAXP = 100.0
ptsP = reamostra(serieP, VMAXP)
areaP, linhaP = grafico(ptsP, VMAXP, VERM, "areaP")
iP = int(len(ptsP)*0.42)
setaP = seta(ptsP[iP], (566, 116), 0.20)

svgP = f'''<svg viewBox="0 0 {VW} {VH}" style="width:100%;height:auto;display:block" role="img" aria-label="Poder de compra de cem reais de julho de 1994, corrigido pelo IPCA. Em setembro de 2026 equivalem a onze reais e vinte e tres centavos.">
{cabeca("R$ 11,23", "é o que sobrou de R$ 100 guardados em 1994", ["Cem reais de 1994 compram onze reais hoje.", "A estabilidade voltou em 94. A imortalidade, não."])}
{grade(VMAXP, [25, 50, 75, 100], lambda v: f"R$ {v}")}
{areaP}
<path d="{linhaP}" fill="none" stroke="{VERM}" stroke-width="2.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
<circle cx="{ptsP[0][0]}" cy="{ptsP[0][1]}" r="4" fill="{VERM}"/>
<circle cx="{ptsP[-1][0]}" cy="{ptsP[-1][1]}" r="4" fill="{VERM}"/>
<path class="graf-seta" pathLength="1" d="{setaP}" fill="none" stroke="{TINTA}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
{rodape("Fonte: Banco Central do Brasil · série 433 (IPCA), jul/1994 a set/2026")}
</svg>'''

# =================================================================== DOLAR
VMAXD = 6.6
ptsD = reamostra(serieD, VMAXD)
areaD, linhaD = grafico(ptsD, VMAXD, VERM, "areaD")
ipk = min(range(len(ptsD)), key=lambda i: ptsD[i][1]); pxp, pyp = ptsD[ipk]
iD = int(len(ptsD)*0.42)
setaD = seta(ptsD[iD], (566, 116), 0.20)

svgD = f'''<svg viewBox="0 0 {VW} {VH}" style="width:100%;height:auto;display:block" role="img" aria-label="Cotacao do dolar em reais, de julho de 1994 a setembro de 2026, com pico de seis reais e dez centavos em dezembro de 2024.">
{cabeca("R$ 5,15", "é o que custa hoje o dólar que valia R$ 0,93", ["O dólar sobe, desce e sobe de novo.", "Em trinta e dois anos, nunca voltou ao começo."], gancho=True)}
{grade(VMAXD, [2, 4, 6], lambda v: f"R$ {v}")}
{areaD}
<path data-dolar="serie" data-escala="{GY},{GH},{VMAXD}" d="{linhaD}" fill="none" stroke="{VERM}" stroke-width="2.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
<circle cx="{ptsD[0][0]}" cy="{ptsD[0][1]}" r="4" fill="{VERM}"/>
<circle cx="{ptsD[-1][0]}" cy="{ptsD[-1][1]}" r="4" fill="{VERM}"/>
<g data-dolar="pico" data-pico="6.10"><circle cx="{pxp}" cy="{pyp}" r="3.5" fill="{TINTA}"/>
<line x1="{pxp}" y1="{pyp-8}" x2="{pxp}" y2="{pyp-26}" stroke="{TINTA}" stroke-width="1" opacity=".35"/>
{tx(min(pxp, VW-8), pyp-34, 'R$ 6,10&#160;&#160;<tspan opacity=".55" font-weight="400">dez/2024</tspan>', s=12.5, w="600", anc=("end" if pxp > VW-150 else "middle"), fill=TINTA)}</g>
<path class="graf-seta" pathLength="1" d="{setaD}" fill="none" stroke="{TINTA}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
{rodape("Fonte: Banco Central do Brasil · série 3698 (PTAX venda), jul/1994 a set/2026", vivo=True)}
</svg>'''

open("/tmp/g3/real.svg","w").write(svgP)
open("/tmp/g3/dolar.svg","w").write(svgD)
print("real %dKB | dolar %dKB" % (len(svgP)//1024, len(svgD)//1024))

# -*- coding: utf-8 -*-
"""Os dois graficos do diagnostico desenhados como CEDULAS.

A serie e a FRONTEIRA do papel: no real a area sob a curva do IPCA e o que
sobrou da nota e a borda e um rasgo; no dolar a area sob a PTAX e o quanto
a cedula ja encheu e a borda e limpa.

CATALOGO. O desenho nao e chute: cada elemento aqui saiu de um levantamento
nas fontes oficiais (cartilha da segunda familia do real, do Banco Central,
e uscurrency.gov / BEP para a nota de um dolar). Por isso as duas notas tem
ALTURAS DIFERENTES: a R$ 100 e 156x70mm (2,229:1) e a US$ 1 e 156x66,3mm
(2,352:1). Sao objetos de formato diferente e o grafico respeita isso.

O QUE NAO E IMITADO, DE PROPOSITO. Os retratos. A Efigie da Republica e o
retrato de Washington sao obras gravadas; reproduzi-las e outra conversa,
e um rosto desenhado a mao em bezier sai pior do que nao ter. No lugar
deles entra o medalhao de guilhoche com a moldura correta (oval perolada,
louro na base, volutas no topo), que e vocabulario legitimo de cedula e e
geometria, entao sai preciso. Tudo o mais, layout, tipografia, selos,
faixa, molduras e ornamentos, segue o catalogo."""
import re, ast, math, random

import series                      # IPCA 433 e PTAX 3698, congeladas do SGS
serieP = series.poder_de_compra()  # R$ 100 de jul/1994, deflacionados
serieD = series.cambio()           # R$ por US$ 1, media mensal

SANS  = ("-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text',"
         "'Inter','Helvetica Neue',system-ui,sans-serif")
SERIF = "'Playfair Display',Georgia,serif"
VW, NX, NW, NY = 1000, 0, 1000, 150
TINTA, VERM = "#1a1815", "#C1121F"

# ------------------------------------------------------------------ utilidades
def tx(x, y, txt, *, f=SANS, s=12, w="400", anc="start", fill=None,
       ls=None, op=None, extra=""):
    a = [f'x="{round(x)}"', f'y="{round(y)}"', f'font-family="{f}"',
         f'font-size="{s}"', f'font-weight="{w}"', f'fill="{fill or TINTA}"']
    if anc != "start": a.append(f'text-anchor="{anc}"')
    if ls is not None: a.append(f'letter-spacing="{ls}"')
    if op is not None: a.append(f'opacity="{op}"')
    if extra: a.append(extra)
    return f'<text {" ".join(a)}>{txt}</text>'

def serrilha(cx, cy, r, n=52, d=4):
    """Borda denteada dos selos circulares."""
    p = []
    for k in range(n):
        a = k*math.tau/n
        p.append("M %.1f %.1f L %.1f %.1f" % (cx+r*math.cos(a), cy+r*math.sin(a),
                                              cx+(r+d)*math.cos(a), cy+(r+d)*math.sin(a)))
    return '<g stroke-width=".8">%s</g>' % "".join(f'<path d="{x}"/>' for x in p)

def arco(idp, cx, cy, r, de=158, ate=382):
    a0, a1 = math.radians(de), math.radians(ate)
    return (f'<path id="{idp}" fill="none" d="M {cx+r*math.cos(a0):.1f} {cy+r*math.sin(a0):.1f} '
            f'A {r} {r} 0 {1 if abs(ate-de)>180 else 0} {1 if ate>de else 0} '
            f'{cx+r*math.cos(a1):.1f} {cy+r*math.sin(a1):.1f}"/>')

def texto_arco(idp, txt, s, ls, fill):
    return (f'<text font-family="{SANS}" font-size="{s}" letter-spacing="{ls}" fill="{fill}" '
            f'font-weight="600"><textPath href="#{idp}" startOffset="50%" '
            f'text-anchor="middle">{txt}</textPath></text>')

def roseta_oval(cx, cy, rx, ry, op, aneis=4, raios=46, tramas=9):
    g = [f'<g stroke="{VERM}" fill="none" opacity="{op}">']
    for k in (1.0, .93, .74, .68)[:aneis]:
        g.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{round(rx*k)}" ry="{round(ry*k)}" '
                 f'stroke-width="{1.4 if k==1 else .8}"/>')
    for k in range(raios):
        a = k*math.tau/raios
        g.append('<line x1="%.0f" y1="%.0f" x2="%.0f" y2="%.0f" stroke-width=".7"/>' % (
            cx+rx*.93*math.cos(a), cy+ry*.93*math.sin(a), cx+rx*math.cos(a), cy+ry*math.sin(a)))
    for j in range(tramas):
        g.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{round(rx*.66)}" ry="{round(ry*.30)}" '
                 f'transform="rotate({round(j*180/tramas)} {cx} {cy})" stroke-width=".55" opacity=".8"/>')
    return "".join(g) + '</g>'

def louro(cx, cy, r, de, ate, n=11, tam=9, esp=1):
    """Ramo de louro: folhas lanceoladas ao longo de um arco."""
    g = []
    for k in range(n):
        a = math.radians(de + (ate-de)*k/(n-1))
        x, y = cx+r*math.cos(a), cy+r*math.sin(a)
        ang = math.degrees(a) + 90*esp
        g.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{tam}" ry="{tam*0.34:.1f}" '
                 f'transform="rotate({ang:.0f} {x:.0f} {y:.0f})"/>')
    return "".join(g)

# ================================================================= R$ 100
def cedula_brl(NH, cheia, idp):
    dy_ma = 0  # deslocamento do rotulo da marca d'agua
    """Catalogo do anverso da R$ 100 da segunda familia (BCB)."""
    B, T = NY, NY+NH                      # topo e base
    o_g, o_r, o_t = (".34", ".5", "1") if cheia else (".5", ".62", ".44")
    g = []
    if cheia:
        g.append(f'<rect x="0" y="{B}" width="{NW}" height="{NH}" rx="12" fill="url(#{idp})"/>')
        # fundo: fitas onduladas largas atravessando na horizontal
        g.append(f'<g stroke="{VERM}" fill="none" opacity="{o_g}">')
        for i in range(20):
            y = B + 28 + i*(NH-56)/19
            amp = 7 + 5*math.sin(i*0.7)
            p = f'M 16 {round(y)}'
            for k in range(1, 27):
                p += f' L {round(16 + k*(NW-32)/26)} {round(y + amp*math.sin(k*0.82 + i*0.8))}'
            g.append(f'<path d="{p}"/>')
        g.append('</g>')

    g.append(f'<g stroke="{VERM}" fill="none" opacity="{o_r}">')
    # faixa holografica, borda esquerda, ~8% da largura
    g.append(f'<rect x="18" y="{B+16}" width="78" height="{NH-32}" stroke-width="1"/>')
    for k in range(int((NH-32)/11)):
        g.append(f'<line x1="21" y1="{B+16+k*11}" x2="93" y2="{B+22+k*11}" stroke-width=".55"/>')
    # linhas de alto-relevo que ATRAVESSAM a faixa, como na nota
    for k in range(7):
        yy = B+40+k*(NH-80)/6
        g.append(f'<line x1="6" y1="{yy:.0f}" x2="128" y2="{yy:.0f}" stroke-width=".8"/>')
    # janela da marca d agua, area clara a esquerda da efigie
    g.append(f'<ellipse cx="392" cy="{B+NH/2}" rx="62" ry="{NH*0.30:.0f}" stroke-width=".7" opacity=".5"/>')
    for k in range(9):                    # trama fina dentro da janela da marca d agua
        g.append(f'<ellipse cx="392" cy="{B+NH/2}" rx="{62-k*6}" ry="{NH*0.30-k*NH*0.029:.0f}" stroke-width=".45" opacity=".45"/>')
    # fita ondulada larga, o elemento de fundo mais visivel do anverso
    for off, opf in ((0, .55), (26, .4), (52, .28)):
        p = f'M 108 {B+NH*0.46+off:.0f}'
        for kk in range(1, 15):
            xx = 108 + kk*(560)/14
            p += f' Q {xx-20:.0f} {B+NH*0.46+off+(22 if kk%2 else -22):.0f} {xx:.0f} {B+NH*0.46+off:.0f}'
        g.append(f'<path d="{p}" stroke-width="{7-off/26*2:.1f}" opacity="{opf}"/>')
    # quebra-cabeca: blocos geometricos no quadrante superior esquerdo
    rnd = random.Random(4)
    g.append(f'<rect x="124" y="{B+86}" width="128" height="74" rx="6" stroke-width=".9"/>')
    g.append('</g>')
    g.append(f'<g fill="{VERM}" opacity="{o_r}">')
    for _ in range(13):
        bx, by = 124+rnd.randint(6,96), B+86+rnd.randint(6,50)
        g.append(f'<rect x="{bx}" y="{by}" width="{rnd.randint(8,24)}" height="{rnd.randint(7,16)}" rx="2"/>')
    g.append('</g>')
    # painel de fundo do numeral grande, canto superior direito
    g.append(f'<rect x="742" y="{B+18}" width="{NW-760}" height="118" rx="4" '
             f'stroke-width=".9" opacity="{float(o_r)*.9:.2f}"/>')
    for k in range(11):
        g.append(f'<line x1="748" y1="{B+24+k*10.4:.0f}" x2="{NW-24}" y2="{B+24+k*10.4:.0f}" stroke-width=".55" opacity=".4"/>')
    # painel do numero escondido, lateral direita
    g.append(f'<g stroke="{VERM}" fill="none" opacity="{o_r}">')
    g.append(f'<rect x="742" y="{B+152}" width="164" height="{NH-272}" rx="5" stroke-width=".9"/>')
    for k in range(34):
        a = math.radians(k*360/34)
        cx, cy = 824, B+NH/2+14
        g.append('<line x1="%.0f" y1="%.0f" x2="%.0f" y2="%.0f" stroke-width=".5"/>' % (
            cx+18*math.cos(a), cy+12*math.sin(a), cx+78*math.cos(a), cy+96*math.sin(a)))
    g.append('</g>')
    # medalhao da efigie, centro levemente a direita
    mx, my = 556, B+NH/2-6
    g.append(roseta_oval(mx, my, 96, 132, o_r))
    g.append(f'<g fill="none" stroke="{VERM}" opacity="{o_r}" stroke-width="1.1">'
             f'<ellipse cx="{mx}" cy="{my}" rx="104" ry="142"/></g>')
    g.append(f'<g fill="{VERM}" opacity="{o_r}">{louro(mx, my, 118, 186, 274, 13, 11)}</g>')
    # molduras
    g.append(f'<rect x="0" y="{B}" width="{NW}" height="{NH}" rx="12" fill="none" '
             f'stroke="{VERM}" stroke-width="{2 if cheia else 1.2}" opacity="{1 if cheia else .82}"/>')
    g.append(f'<rect x="10" y="{B+10}" width="{NW-20}" height="{NH-20}" rx="7" fill="none" '
             f'stroke="{VERM}" stroke-width="1" opacity="{o_r}"/>')
    # tipografia
    g.append(f'<g opacity="{o_t}">')
    g.append(tx(124, B+44, "REPÚBLICA FEDERATIVA DO BRASIL", s=15, w="600", ls=4.6, fill=VERM))
    g.append(tx(124, B+70, "2010", s=12, ls=1.6, fill=TINTA, op=".55"))
    g.append(tx(970, B+108, "100", f=SANS, s=104, w="700", anc="end", fill=TINTA))
    g.append(tx(124, T-74, "100", f=SANS, s=88, w="700", fill=TINTA))
    g.append(tx(128, T-34, "REAIS", f=SANS, s=31, w="600", ls=9, fill=VERM))
    g.append(tx(mx, my+152, "REPÚBLICA", s=12, w="600", anc="middle", ls=3, fill=TINTA, op=".6"))
    # "REAIS" na vertical e microtexto "100" dentro da faixa holografica
    g.append(tx(0, 0, "REAIS", s=20, w="700", anc="middle", ls=7, fill=VERM, op=".75",
               extra=f'transform="translate(57 {B+NH/2}) rotate(-90)"'))
    g.append(tx(0, 0, "100 100 100 100", s=7.5, w="600", anc="middle", ls=1.6, fill=VERM, op=".6",
               extra=f'transform="translate(57 {B+64}) rotate(-90)"'))
    # colunas de microtexto "100", como as que correm rente a faixa na nota
    for cx_ in (104,):
        for r_ in range(int((NH-40)/13)):
            g.append(tx(cx_, B+30+r_*13, "100 100", s=6.5, w="600", ls=.8, fill=VERM, op=".38"))

    g.append(tx(0, 0, "DEUS SEJA LOUVADO", s=12.5, w="600", ls=3.4, fill=TINTA, op=".62",
               extra=f'transform="translate(706 {B+NH/2+86}) rotate(-90)"'))
    g.append('</g>')
    # coral: e o desenho que fica sob a marca tatil na nota
    g.append(f'<g stroke="{VERM}" fill="none" opacity="{float(o_r)*.7:.2f}" stroke-width=".9" stroke-linecap="round">')
    rc = random.Random(9)
    for i in range(7):
        bx, by = 872+i*15, T-34
        g.append(f'<path d="M {bx} {by} C {bx-6} {by-22} {bx+8} {by-34} {bx+2} {by-58}"/>')
        g.append(f'<path d="M {bx+1} {by-30} C {bx+12} {by-38} {bx+14} {by-46} {bx+11} {by-54}"/>')
    g.append('</g>')
    # marca tatil: tres barras no canto inferior direito
    g.append(f'<g fill="{VERM}" opacity="{o_r}">')
    for k in range(3):
        g.append(f'<rect x="{886+k*26}" y="{T-86}" width="11" height="46" rx="5"/>')
    g.append('</g>')
    return "".join(g)

# ================================================================== US$ 1
def selo_circular(cx, cy, r, idp, arco_txt, centro, op):
    g = [f'<g stroke="{VERM}" fill="none" opacity="{op}">',
         f'<circle cx="{cx}" cy="{cy}" r="{r}" stroke-width="1.2"/>',
         f'<circle cx="{cx}" cy="{cy}" r="{r-7}" stroke-width=".7"/>',
         serrilha(cx, cy, r, 54, 5), '</g>',
         f'<defs>{arco(idp, cx, cy, r-16, 195, 345)}</defs>',
         f'<g opacity="{op}">{texto_arco(idp, arco_txt, 6.5, .7, VERM)}</g>',
         centro]
    return "".join(g)

def cedula_usd(NH, cheia, idp):
    """Catalogo do anverso da Federal Reserve Note de 1 dolar (desde 1963)."""
    B, T = NY, NY+NH
    o_g, o_r, o_t = (".34", ".5", "1") if cheia else (".5", ".62", ".44")
    cy = B+NH/2
    g = []
    if cheia:
        g.append(f'<rect x="0" y="{B}" width="{NW}" height="{NH}" rx="10" fill="url(#{idp})"/>')
        g.append(f'<g stroke="{VERM}" fill="none" opacity="{o_g}">')
        for i in range(18):
            y = B + 26 + i*(NH-52)/17
            amp = 5 + 3*math.sin(i*0.9)
            p = f'M 18 {round(y)}'
            for k in range(1, 25):
                p += f' L {round(18 + k*(NW-36)/24)} {round(y + amp*math.sin(k*1.05 + i*1.1))}'
            g.append(f'<path d="{p}"/>')
        g.append('</g>')

    # moldura ornamental: festao de laco repetido ao longo da borda
    g.append(f'<g stroke="{VERM}" fill="none" opacity="{o_r}" stroke-width=".8">')
    for y0 in (B+22, T-22):
        p = f'M 60 {y0}'
        for k in range(1, 33):
            x = 60 + k*(NW-120)/32
            p += f' Q {x-10:.0f} {y0 + (13 if k%2 else -13)} {x:.0f} {y0}'
        g.append(f'<path d="{p}"/>')
    for x0 in (26, NW-26):
        p = f'M {x0} {B+60}'
        for k in range(1, 13):
            y = B+60 + k*(NH-120)/12
            p += f' Q {x0 + (11 if k%2 else -11)} {y-9:.0f} {x0} {y:.0f}'
        g.append(f'<path d="{p}"/>')
    g.append('</g>')
    g.append(f'<rect x="0" y="{B}" width="{NW}" height="{NH}" rx="10" fill="none" '
             f'stroke="{VERM}" stroke-width="{2 if cheia else 1.2}" opacity="{1 if cheia else .82}"/>')
    g.append(f'<rect x="12" y="{B+12}" width="{NW-24}" height="{NH-24}" rx="5" fill="none" '
             f'stroke="{VERM}" stroke-width="1" opacity="{o_r}"/>')

    # quatro numerais "1" ornados, com oliveira
    for qx, qy in ((60, B+62), (NW-60, B+62), (60, T-46), (NW-60, T-46)):
        g.append(f'<g opacity="{o_r}"><g stroke="{VERM}" fill="none" stroke-width=".7">'
                 f'<circle cx="{qx}" cy="{qy-9}" r="25"/><circle cx="{qx}" cy="{qy-9}" r="19"/></g>'
                 f'<g fill="{VERM}" opacity=".75">{louro(qx, qy-9, 30, 120, 240, 9, 7)}</g>'
                 + tx(qx, qy+3, "1", f=SERIF, s=34, w="600", anc="middle", fill=VERM) + '</g>')

    # numeral pequeno do distrito, repetido junto aos quatro cantos
    for nx_, ny_ in ((104, B+62), (NW-104, B+62), (104, T-46), (NW-104, T-46)):
        g.append(tx(nx_, ny_, "1", f=SERIF, s=15, w="600", anc="middle", fill=VERM, op=o_r))
    # serrilha ornamental na moldura interna
    g.append(f'<g stroke="{VERM}" fill="none" opacity="{float(o_r)*.8:.2f}" stroke-width=".6">')
    for k in range(64):
        xx = 30 + k*(NW-60)/63
        g.append(f'<line x1="{xx:.0f}" y1="{B+12}" x2="{xx:.0f}" y2="{B+19}"/>')
        g.append(f'<line x1="{xx:.0f}" y1="{T-12}" x2="{xx:.0f}" y2="{T-19}"/>')
    g.append('</g>')
    # selo do Federal Reserve, a esquerda do retrato
    sfx = "c" if cheia else "f"
    g.append(selo_circular(252, cy+4, 58, "arcoFRB"+sfx, "FEDERAL RESERVE SYSTEM",
             tx(252, cy+22, "A", f=SERIF, s=54, w="600", anc="middle", fill=VERM, op=o_r), o_r))
    # medalhao do retrato, centro
    mx = 506
    g.append(roseta_oval(mx, cy, 92, 124, o_r))
    g.append(f'<g stroke="{VERM}" fill="none" opacity="{o_r}" stroke-width="1.2">'
             f'<ellipse cx="{mx}" cy="{cy}" rx="103" ry="137"/></g>')
    g.append(f'<g fill="{VERM}" opacity="{o_r}">')          # perolado da moldura
    for k in range(58):
        a = k*math.tau/58
        g.append(f'<circle cx="{mx+97*math.cos(a):.0f}" cy="{cy+130*math.sin(a):.0f}" r="2"/>')
    g.append(louro(mx, cy, 114, 58, 122, 9, 9) + louro(mx, cy, 114, 238, 302, 9, 9))
    g.append('</g>')
    # selo do Tesouro, sobre o "ONE" grande
    g.append(tx(782, cy+34, "ONE", f=SERIF, s=112, w="600", anc="middle", fill=VERM, op=".22"))
    escudo = (f'<g stroke="{VERM}" fill="none" opacity="{o_r}" stroke-width="1">'
              f'<path d="M 760 {cy-16} L 804 {cy-16} L 804 {cy+12} Q 782 {cy+30} 760 {cy+12} Z"/>'
              f'<line x1="765" y1="{cy-4}" x2="799" y2="{cy-4}"/>'
              f'<line x1="782" y1="{cy-12}" x2="782" y2="{cy-4}"/>'
              f'<circle cx="769" cy="{cy-2}" r="3"/><circle cx="795" cy="{cy-2}" r="3"/>'
              f'<circle cx="782" cy="{cy+14}" r="4"/><line x1="782" y1="{cy+18}" x2="782" y2="{cy+26}"/>'
              f'</g><g fill="{VERM}" opacity="{o_r}">'
              + "".join(f'<circle cx="{766+k*4.4:.0f}" cy="{cy+6}" r="1.4"/>' for k in range(9))
              + '</g>')
    g.append(selo_circular(782, cy, 58, "arcoTES"+sfx, "DEPARTMENT OF THE TREASURY",
             escudo + tx(782, cy+50, "1789", s=9, w="600", anc="middle", ls=1, fill=VERM, op=o_r), o_r))

    # tipografia
    g.append(f'<g opacity="{o_t}">')
    g.append(f'<g stroke="{VERM}" fill="none" opacity=".5" stroke-width=".8">'
             f'<rect x="330" y="{B+40}" width="340" height="26" rx="13"/></g>')
    g.append(tx(500, B+58, "FEDERAL RESERVE NOTE", f=SERIF, s=15, w="600", anc="middle", ls=3.2, fill=VERM))
    g.append(tx(500, B+100, "THE UNITED STATES OF AMERICA", f=SERIF, s=29, w="600", anc="middle", ls=4.4, fill=TINTA))
    g.append(tx(104, B+134, "THIS NOTE IS LEGAL TENDER", s=10.5, w="600", ls=1.2, fill=TINTA, op=".6"))
    g.append(tx(104, B+150, "FOR ALL DEBTS, PUBLIC AND PRIVATE", s=10.5, w="600", ls=1.2, fill=TINTA, op=".6"))
    g.append(tx(700, B+52, "B4", s=10, w="600", fill=VERM, op=".65"))
    g.append(tx(900, B+118, "A 30116104 A", anc="end", f=SERIF, s=15, w="600", ls=1.4, fill=VERM, op=".62"))
    g.append(tx(160, T-118, "A 30116104 A", f=SERIF, s=15, w="600", ls=1.4, fill=VERM, op=".62"))
    g.append(tx(782, cy-70, "WASHINGTON, D.C.", s=10, w="600", anc="middle", ls=1.6, fill=TINTA, op=".6"))
    g.append(tx(506, cy+144, "WASHINGTON", s=10.5, w="600", anc="middle", ls=2.6, fill=TINTA, op=".6"))
    g.append(tx(500, T-34, "ONE DOLLAR", f=SERIF, s=30, w="600", anc="middle", ls=5.2, fill=TINTA))
    g.append(tx(NW-40, T-62, "FW B 2", s=9.5, w="600", anc="end", ls=1, fill=VERM, op=".6"))
    g.append(tx(206, T-62, "SERIES", s=9.5, w="600", anc="middle", ls=1.4, fill=TINTA, op=".55"))
    g.append(tx(206, T-50, "2026", s=9.5, w="600", anc="middle", ls=1.4, fill=TINTA, op=".55"))
    g.append('</g>')
    # duas assinaturas
    g.append(f'<g stroke="{TINTA}" fill="none" opacity="{float(o_r)*.85:.2f}" stroke-width="1.3" stroke-linecap="round">'
             f'<path d="M 254 {T-86} q 14 -16 24 -2 t 22 -6 q 12 12 24 -4 t 26 6"/>'
             f'<path d="M 700 {T-86} q 16 -14 26 0 t 24 -8 q 10 14 24 -2 t 24 8"/></g>')
    g.append(f'<g opacity="{o_t}">'
             + tx(300, T-70, "Treasurer of the United States", s=8.5, anc="middle", fill=TINTA, op=".5")
             + tx(748, T-70, "Secretary of the Treasury", s=8.5, anc="middle", fill=TINTA, op=".5") + '</g>')
    return "".join(g)

# ----------------------------------------------------------------- serie
def reamostra(serie, vmax, NH, passo=3.0):
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
        pts.append((round(NX + t*NW), round(NY + NH - (v/vmax)*NH)))
    return pts

def rasgo(pts, NH, semente):
    rnd = random.Random(semente); out = []
    for i, (x, y) in enumerate(pts):
        n = rnd.uniform(-1.6, 1.6)
        if i % 9 == 0:   n += rnd.uniform(-6, 2)
        if i % 23 == 0:  n += rnd.uniform(-12, -4)
        if i % 53 == 0:  n += rnd.uniform(-18, -7)
        out.append((x, round(min(NY+NH, y+n))))
    return out

def caco(rnd, x, y):
    s = rnd.uniform(1.8, 5.4); p = []
    for k in range(4):
        a = k*1.5708 + rnd.uniform(-.45, .45)
        p.append("%d,%d" % (x+s*math.cos(a)*rnd.uniform(.5,1.25), y+s*math.sin(a)*rnd.uniform(.5,1.25)))
    return '<polygon points="%s" fill="%s" opacity="%.2f"/>' % (" ".join(p), VERM, rnd.uniform(.12,.40))

def seta(p0, p1, curva=0.20):
    mx = (p0[0]+p1[0])/2 + (p1[1]-p0[1])*curva
    my = (p0[1]+p1[1])/2 - (p1[0]-p0[0])*curva
    ps = [((1-t)**2*p0[0] + 2*(1-t)*t*mx + t*t*p1[0],
           (1-t)**2*p0[1] + 2*(1-t)*t*my + t*t*p1[1]) for t in [i/18 for i in range(19)]]
    dd = "M %d %d " % (round(ps[0][0]), round(ps[0][1])) + " ".join("L %d %d" % (round(a), round(b)) for a, b in ps[1:])
    ang = math.atan2(ps[-1][1]-ps[-3][1], ps[-1][0]-ps[-3][0])
    for da in (2.6, -2.6):
        a = ang + da
        dd += " M %d %d L %d %d" % (round(ps[-1][0]), round(ps[-1][1]),
                                    round(ps[-1][0]+12*math.cos(a)), round(ps[-1][1]+12*math.sin(a)))
    return dd

def papel(idp):
    return (f'<linearGradient id="{idp}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{VERM}" stop-opacity=".17"/>'
            f'<stop offset="1" stop-color="{VERM}" stop-opacity=".065"/></linearGradient>')

def cabeca(numero, legenda, linhas, gancho_valor=False):
    gv = ' data-dolar="valor"' if gancho_valor else ''
    g = [f'<text x="10" y="74" font-family="{SERIF}" font-size="58" font-weight="600" fill="{VERM}"{gv}>{numero}</text>',
         tx(10, 102, legenda, s=13.5, fill="#6b655c"),
         '<g class="graf-nota">']
    for i, l in enumerate(linhas):
        g.append(f'<text x="{NW}" y="{44+i*28}" text-anchor="end" font-family="{SERIF}" '
                 f'font-style="italic" font-size="19" fill="{TINTA}" opacity=".78">{l}</text>')
    return "".join(g) + '</g>'

def rodape(NH, fonte, vivo=False):
    yd, yf = NY+NH+34, NY+NH+80
    gf = ' data-dolar="fim"' if vivo else ''
    gt = ' data-dolar="fonte"' if vivo else ''
    return (f'<g font-family="{SANS}" fill="#6f6860" font-size="11.5">'
            f'<text x="0" y="{yd}" letter-spacing="1.6">JULHO DE 1994</text>'
            f'<text x="{NW}" y="{yd}" text-anchor="end" letter-spacing="1.6"{gf}>SETEMBRO DE 2026</text>'
            f'<text x="0" y="{yf}" font-size="10.5" letter-spacing=".1em" opacity=".85"{gt}>{fonte}</text></g>')

# ==================================================================== REAL
NH_BRL = round(1000/2.229)                      # 156 x 70 mm
ptsP  = reamostra(serieP, 100.0, NH_BRL)
borda = rasgo(ptsP, NH_BRL, 7)
dP = "M 0 %d " % (NY+NH_BRL) + " ".join("L %d %d" % p for p in borda) + " L %d %d Z" % (NW, NY+NH_BRL)
rnd = random.Random(11); cacos = []
for i, (x, y) in enumerate(ptsP):
    if i % 15: continue
    perdido = (y-NY)/NH_BRL
    for _ in range(int(perdido*2.2)):
        cacos.append(caco(rnd, x+rnd.uniform(-9, 9), y-rnd.uniform(5, 16+perdido*46)))
iP = int(len(ptsP)*0.45)
setaP = seta((ptsP[iP][0], ptsP[iP][1]), (560, 124), 0.20)
VH_BRL = NY+NH_BRL+104

svgP = f'''<svg viewBox="0 0 {VW} {VH_BRL}" style="width:100%;height:auto;display:block" role="img" aria-label="Uma nota de cem reais de julho de 1994 desenhada como grafico. A parte inteira e o poder de compra que restou; o rasgo segue a serie do IPCA e chega a onze reais e vinte e tres centavos em setembro de 2026.">
<defs><path id="serieP" d="{dP}"/><clipPath id="clipReal"><use href="#serieP"/></clipPath><clipPath id="molduraP"><rect x="0" y="{NY}" width="{NW}" height="{NH_BRL}" rx="12"/></clipPath>{papel("papelP")}</defs>
{cabeca("R$ 11,23", "é o que sobrou dos R$ 100", ["O rasgo segue o IPCA acumulado desde jul/1994.", "O papel inteiro é o poder de compra que sobrou."])}
<g opacity=".2">{cedula_brl(NH_BRL, False, "papelP")}</g>
{"".join(cacos)}
<g clip-path="url(#molduraP)"><g clip-path="url(#clipReal)">{cedula_brl(NH_BRL, True, "papelP")}</g>
<use href="#serieP" fill="none" stroke="{VERM}" stroke-width="2.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></g>
<path class="graf-seta" pathLength="1" d="{setaP}" fill="none" stroke="{TINTA}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
{rodape(NH_BRL, "Fonte: Banco Central do Brasil · série 433 (IPCA), jul/1994 a set/2026")}
</svg>'''

# =================================================================== DOLAR
NH_USD = round(1000/2.352)                      # 156 x 66,3 mm
VMAXD = 6.6
ptsD = reamostra(serieD, VMAXD, NH_USD)
dD = "M 0 %d " % (NY+NH_USD) + " ".join("L %d %d" % p for p in ptsD) + " L %d %d Z" % (NW, NY+NH_USD)
ipk = min(range(len(ptsD)), key=lambda i: ptsD[i][1]); pxp, pyp = ptsD[ipk]
iD = int(len(ptsD)*0.45)
setaD = seta((ptsD[iD][0], ptsD[iD][1]), (560, 124), 0.20)
VH_USD = NY+NH_USD+104

svgD = f'''<svg viewBox="0 0 {VW} {VH_USD}" style="width:100%;height:auto;display:block" role="img" aria-label="Um dolar desenhado como grafico. A parte preenchida e quanto ele vale em reais, de noventa e tres centavos em julho de 1994 a cinco reais e quinze centavos em setembro de 2026, com pico de seis reais e dez centavos em dezembro de 2024.">
<defs><path id="serieD" data-dolar="serie" data-escala="{NY},{NH_USD},{VMAXD}" d="{dD}"/><clipPath id="clipDolar"><use href="#serieD"/></clipPath><clipPath id="molduraD"><rect x="0" y="{NY}" width="{NW}" height="{NH_USD}" rx="10"/></clipPath>{papel("papelD")}</defs>
{cabeca("R$ 5,15", "é o que ele custa hoje. Em 1994 custava R$ 0,93", ["A borda segue a PTAX de venda, média mensal.", "O papel cheio é quanto um dólar custa em reais."], gancho_valor=True)}
<g opacity=".2">{cedula_usd(NH_USD, False, "papelD")}</g>
<g clip-path="url(#molduraD)"><g clip-path="url(#clipDolar)">{cedula_usd(NH_USD, True, "papelD")}</g>
<use href="#serieD" fill="none" stroke="{VERM}" stroke-width="2.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></g>
<g data-dolar="pico" data-pico="6.10"><circle cx="{pxp}" cy="{pyp}" r="4" fill="{TINTA}"/>
{tx(pxp-16, pyp+34, 'R$ 6,10&#160;&#160;<tspan opacity=".55" font-weight="400">dez/2024</tspan>', s=12.5, w="600", anc="end", fill=TINTA)}</g>
<path class="graf-seta" pathLength="1" d="{setaD}" fill="none" stroke="{TINTA}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
{rodape(NH_USD, "Fonte: Banco Central do Brasil · série 3698 (PTAX venda), jul/1994 a set/2026", vivo=True)}
</svg>'''

open("/tmp/g3/real.svg","w").write(svgP)
open("/tmp/g3/dolar.svg","w").write(svgD)
print("real %dKB (%dx%d, %.3f:1) | dolar %dKB (%dx%d, %.3f:1)" % (
    len(svgP)//1024, NW, NH_BRL, NW/NH_BRL, len(svgD)//1024, NW, NH_USD, NW/NH_USD))

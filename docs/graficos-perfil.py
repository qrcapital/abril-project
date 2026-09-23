# -*- coding: utf-8 -*-
"""Busto de perfil em linguagem de gravura. DESENHO ORIGINAL.

Nao e a Efigie da Republica nem o retrato de Washington: e uma cabeca
classica inventada, no idioma de medalhao que cedula e moeda usam ha dois
seculos. Resolve o mesmo problema de leitura (o medalhao central deixa de
ser so guilhoche e passa a ter figura) sem copiar nenhuma das duas
gravuras reais.

Tecnica: silhueta + hachura curva recortada pela propria silhueta, que e
como talho-doce se comporta, e o busto inteiro recortado pelo OVAL do
medalhao, que e como toda cedula corta o retrato. Sem o corte no oval, a
linha dos ombros vira uma barra reta saindo pela moldura.

As coordenadas sao transformadas em Python, nao por `transform` no SVG:
clipPath com transform no filho nao e tratado igual por todo renderizador,
e este desenho precisa sair igual em qualquer lugar."""
import math, re

SILHUETA = (
 "M 46 6 C 30 8 20 22 20 40 C 20 47 18 50 16 54 "
 "C 12 60 8 66 12 70 C 15 73 20 72 18 76 "
 "C 16 80 20 80 22 83 C 19 87 23 89 21 93 "
 "C 20 97 24 100 29 103 C 33 106 36 110 35 116 "
 "C 34 124 32 130 28 134 L 20 142 L 100 142 "
 "C 88 134 77 126 75 116 C 74 110 75 106 77 102 "
 "C 85 96 91 84 91 64 C 91 36 76 8 46 6 Z")
CABELO = "M 21 42 C 26 26 34 14 50 13 C 70 12 85 30 87 56 C 88 72 84 86 77 96"
NUCA   = "M 77 96 C 85 99 93 93 91 85"

_num = re.compile(r'(-?\d+\.?\d*)\s+(-?\d+\.?\d*)')
def _tp(d, x0, y0, k):
    return _num.sub(lambda m: "%.1f %.1f" % (x0+float(m.group(1))*k, y0+float(m.group(2))*k), d)

def busto(cx, cy, altura, cor, op, idp, rx, ry, coroa=False):
    """cx,cy = centro do medalhao; rx,ry = o oval que corta o busto."""
    k  = altura/142.0
    x0 = cx - 50*k
    y0 = cy - 66*k                      # cabeca um pouco acima do centro optico
    S  = _tp(SILHUETA, x0, y0, k)
    g = [f'<defs>',
         f'<clipPath id="{idp}s"><path d="{S}"/></clipPath>',
         f'<clipPath id="{idp}o"><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/></clipPath>',
         f'</defs>',
         f'<g clip-path="url(#{idp}o)" opacity="{op}">',
         f'<path d="{S}" fill="{cor}" opacity=".16"/>']
    # hachura: fios curvos acompanhando o volume
    g.append(f'<g clip-path="url(#{idp}s)" stroke="{cor}" fill="none" '
             f'stroke-width="{max(0.9, 1.5*k):.2f}" opacity=".4">')
    for i in range(24):
        y = 8 + i*(136/23)
        c = 7*math.sin(i/23*math.pi)
        g.append('<path d="%s"/>' % _tp(f'M 4 {y:.1f} C 34 {y-c:.1f} 70 {y+c:.1f} 102 {y:.1f}', x0, y0, k))
    g.append('</g>')
    g.append(f'<path d="{S}" fill="none" stroke="{cor}" stroke-width="{max(1.2, 2.2*k):.2f}"/>')
    g.append(f'<path d="{_tp(CABELO, x0, y0, k)}" fill="none" stroke="{cor}" '
             f'stroke-width="{max(.8, 1.3*k):.2f}" opacity=".75"/>')
    g.append(f'<path d="{_tp(NUCA, x0, y0, k)}" fill="none" stroke="{cor}" '
             f'stroke-width="{max(.8, 1.3*k):.2f}" opacity=".75"/>')
    if coroa:
        g.append(f'<g fill="{cor}" opacity=".85">')
        for i in range(9):
            t = i/8
            x, y = 24 + 58*t, 30 - 17*math.sin(t*math.pi) + 8*t
            X, Y = x0+x*k, y0+y*k
            g.append(f'<ellipse cx="{X:.0f}" cy="{Y:.0f}" rx="{9*k:.1f}" ry="{3.4*k:.1f}" '
                     f'transform="rotate({-50+100*t:.0f} {X:.0f} {Y:.0f})"/>')
        g.append('</g>')
    return "".join(g) + '</g>'

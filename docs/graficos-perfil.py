# -*- coding: utf-8 -*-
"""Busto de perfil em talho-doce. DESENHO ORIGINAL.

Cabeca classica inventada, no idioma de medalhao que cedula e moeda usam ha
dois seculos. Nao e a Efigie da Republica nem o retrato de Washington:
aquelas sao duas gravuras especificas. O que faz o olho reconhecer "nota" e
ter um perfil gravado no oval, nao ser aquele perfil.

O QUE FAZ PARECER GRAVURA, E NAO SILHUETA
 1. Traco interno: sobrancelha, palpebras, iris, asa e narina, boca em duas
    linhas, sulco do queixo, orelha com helice e concha, mandibula. Sem isso
    e mancha, nao rosto.
 2. Hachura com o centro FORA da cabeca, bem acima e atras. Com o centro
    sobre o cranio os arcos viram aneis concentricos e o rosto parece uma
    impressao digital; jogando o centro para longe, o mesmo arco atravessa a
    face como curva quase paralela, que e como talho-doce sombreia.
 3. Tom em camadas: base no rosto inteiro, sombra mais densa no fundo do
    cranio e sob a mandibula, cruzamento em outra direcao na sombra, e
    contra-hachura no pescoco, a zona mais escura de qualquer busto.
 4. Cabelo em mechas, nao em capacete.
 5. Panejamento no ombro, com duas dobras.

As coordenadas sao transformadas em Python e nao por `transform` no SVG:
clipPath com transform no filho nao e tratado igual por todo renderizador.
"""
import math, re

SILHUETA = (
 "M 52 7 C 34 8 21 22 20 40 C 20 44 19 45 18 48 "
 "C 15 53 9 62 10 66 C 11 69 15 68 14 71 "
 "C 13 74 17 74 17 77 C 17 80 14 81 15 84 "
 "C 16 87 20 87 20 90 C 20 94 24 97 29 100 "
 "C 34 104 39 108 40 116 C 41 124 40 132 36 140 "
 "L 22 142 L 102 142 C 96 134 84 128 79 120 "
 "C 76 114 76 108 78 102 C 86 94 92 82 92 60 "
 "C 92 32 76 7 52 7 Z")
CABELO = (
 "M 20 40 C 23 20 36 7 52 7 C 76 7 92 32 92 60 C 92 78 87 92 80 101 "
 "C 83 96 85 84 85 64 C 85 42 72 24 53 24 C 38 24 28 30 25 44 Z")
SOMBRA = (
 "M 44 30 C 60 26 76 36 80 56 C 84 78 78 100 72 112 "
 "C 66 124 50 130 38 128 C 44 116 46 104 42 96 "
 "C 52 96 62 88 64 72 C 66 56 58 40 44 30 Z")
PESCOCO = "M 38 112 C 52 120 66 118 76 108 C 78 120 80 130 86 138 L 34 138 Z"
# Faixa iluminada, colada no contorno da face: testa, dorso do nariz, maca do
# rosto e queixo. A hachura e ABATIDA aqui por uma mascara. Sombrear tudo por
# igual achata; o volume nasce de onde a luz NAO e riscada.
LUZ = ("M 24 30 C 34 26 44 32 46 44 C 48 56 40 64 36 74 "
       "C 32 84 34 92 30 98 C 24 94 20 86 20 76 C 20 62 26 50 24 42 Z")

TRACOS = [
 ("M 17 47 C 22 43 29 43 33 46", 1.5),   ("M 20 50 C 24 47 30 47 33 50", 1.2),
 ("M 20 50 C 24 53 30 53 33 50", 1.0),   ("M 14 69 C 17 67 20 68 21 71", 1.2),
 ("M 21 71 C 19 73 16 73 14 71", 1.0),   ("M 15 79 C 20 77 26 78 29 79", 1.4),
 ("M 16 83 C 20 85 25 84 28 82", 1.0),   ("M 17 88 C 21 89 25 88 27 86", 1.0),
 ("M 54 52 C 62 51 66 58 64 66 C 63 72 58 74 54 72", 1.3),
 ("M 57 57 C 61 57 62 62 60 67", 1.0),   ("M 40 100 C 48 104 58 103 64 97", 1.1),
 ("M 46 116 C 54 120 62 119 68 114", 0.9),
 ("M 22 46 C 27 42 33 42 36 45", 0.9),   # sulco da palpebra
 ("M 21 51 C 22 50 23 50 24 51", 0.8),   # canto interno do olho
 ("M 33 50 C 35 49 36 50 36 51", 0.8),   # canto externo
 ("M 22 54 C 26 56 31 55 34 53", 0.8),   # sombra da palpebra inferior
 ("M 26 62 C 34 64 42 62 48 57", 0.9),   # maca do rosto
 ("M 22 72 C 26 78 28 84 27 88", 0.9),   # sulco nasolabial
 ("M 16 74 C 17 76 18 76 19 75", 0.7),   # filtro
 ("M 29 79 C 31 79 32 80 32 81", 0.8),   # canto da boca
 ("M 20 34 C 26 33 32 35 35 39", 0.8),   # tempora
 ("M 44 126 C 56 132 70 132 80 126", 0.9),  # claviculas
 ("M 30 132 C 40 136 52 136 60 132", 1.0), ("M 62 130 C 70 134 78 136 86 134", 1.0),
]

_num = re.compile(r'(-?\d+\.?\d*)\s+(-?\d+\.?\d*)')
def _tp(d, x0, y0, k):
    return _num.sub(lambda m: "%.1f %.1f" % (x0+float(m.group(1))*k, y0+float(m.group(2))*k), d)

def _arcos(n):
    cx, cy, r0, r1, a0, a1 = 126, -26, 58, 205, 97, 170
    out = []
    for i in range(n):
        r = r0 + (r1-r0)*i/(n-1)
        p = ["%.1f %.1f" % (cx + r*math.cos(math.radians(a0+(a1-a0)*j/10)),
                            cy + r*math.sin(math.radians(a0+(a1-a0)*j/10))*1.18)
             for j in range(11)]
        out.append("M " + " L ".join(p))
    return out

def busto(cx, cy, altura, cor, op, idp, rx, ry,
          coroa=False, rabicho=False, detalhe=True):
    """cx,cy = centro do medalhao; rx,ry = oval que corta o busto.

    `detalhe=False` desenha so silhueta, cabelo e traco interno. E o que a
    copia FANTASMA da cedula usa: ela vive a 20% de opacidade, onde a hachura
    fina nao se ve, mas pesaria igual no arquivo e no custo de pintura da
    animacao, que rerasteriza o SVG inteiro a cada quadro."""
    k  = altura/142.0
    x0, y0 = cx - 52*k, cy - 66*k
    T  = lambda d: _tp(d, x0, y0, k)
    lw = lambda w: max(0.55, w*k)
    S, H, Sh, P, L = T(SILHUETA), T(CABELO), T(SOMBRA), T(PESCOCO), T(LUZ)

    g = ['<defs>', f'<clipPath id="{idp}s"><path d="{S}"/></clipPath>']
    if detalhe:
        g.append(f'<mask id="{idp}m" maskUnits="userSpaceOnUse" x="{cx-rx}" y="{cy-ry}" '
                 f'width="{rx*2}" height="{ry*2}">'
                 f'<rect x="{cx-rx}" y="{cy-ry}" width="{rx*2}" height="{ry*2}" fill="#fff"/>'
                 f'<path d="{L}" fill="#000" opacity=".82"/></mask>')
    if detalhe:
        g += [f'<clipPath id="{idp}h"><path d="{H}"/></clipPath>',
              f'<clipPath id="{idp}d"><path d="{Sh}"/></clipPath>',
              f'<clipPath id="{idp}p"><path d="{P}"/></clipPath>']
    g += [f'<clipPath id="{idp}o"><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/></clipPath>',
          '</defs>',
          f'<g clip-path="url(#{idp}o)" opacity="{op}">',
          f'<path d="{S}" fill="{cor}" opacity=".1"/>']

    if detalhe:
        g.append(f'<g clip-path="url(#{idp}s)" mask="url(#{idp}m)" stroke="{cor}" fill="none" '
                 f'stroke-width="{lw(1.15):.2f}" opacity=".34">')
        g += [f'<path d="{T(d)}"/>' for d in _arcos(24)]
        g.append('</g>')
        g.append(f'<g clip-path="url(#{idp}d)" stroke="{cor}" fill="none" '
                 f'stroke-width="{lw(1.25):.2f}" opacity=".34">')
        g += [f'<path d="{T(d)}"/>' for d in _arcos(34)]
        g.append('</g>')
        g.append(f'<g clip-path="url(#{idp}d)" stroke="{cor}" fill="none" '
                 f'stroke-width="{lw(.95):.2f}" opacity=".22">')
        g += ['<path d="%s"/>' % T(f"M 30 {22+i*5.4:.1f} L 100 {62+i*5.4:.1f}") for i in range(22)]
        g.append('</g>')
        g.append(f'<g clip-path="url(#{idp}p)" stroke="{cor}" fill="none" '
                 f'stroke-width="{lw(1.0):.2f}" opacity=".3">')
        g += ['<path d="%s"/>' % T(f"M 26 {104+i*2.2:.1f} L 92 {88+i*2.2:.1f}") for i in range(18)]
        g.append('</g>')

    g.append(f'<path d="{H}" fill="{cor}" opacity=".12"/>')
    if detalhe:
        g.append(f'<g clip-path="url(#{idp}h)" stroke="{cor}" fill="none" '
                 f'stroke-width="{lw(1.3):.2f}" opacity=".5">')
        for i in range(16):
            t = i/15
            g.append('<path d="%s"/>' % T(
                f"M {22+4*t:.1f} {44-26*t:.1f} C {44+10*t:.1f} {12+6*t:.1f} "
                f"{80+6*t:.1f} {26+10*t:.1f} {84+2*t:.1f} {60+26*t:.1f}"))
        g.append('</g>')
    g.append(f'<path d="{H}" fill="none" stroke="{cor}" stroke-width="{lw(1.2):.2f}" opacity=".7"/>')

    g.append(f'<path d="{S}" fill="none" stroke="{cor}" stroke-width="{lw(2.3):.2f}"/>')
    g.append(f'<g stroke="{cor}" fill="none" stroke-linecap="round" opacity=".82">')
    g += [f'<path d="{T(d)}" stroke-width="{lw(w):.2f}"/>' for d, w in TRACOS]
    g.append('</g>')
    g.append(f'<ellipse cx="{x0+26.5*k:.1f}" cy="{y0+50*k:.1f}" rx="{2.1*k:.1f}" '
             f'ry="{2.1*k:.1f}" fill="{cor}" opacity=".8"/>')

    if coroa:
        g.append(f'<g fill="{cor}" opacity=".7">')
        for i in range(10):
            t = i/9
            X, Y = x0+(24+60*t)*k, y0+(31 - 17*math.sin(t*math.pi) + 8*t)*k
            g.append(f'<ellipse cx="{X:.0f}" cy="{Y:.0f}" rx="{7.4*k:.1f}" ry="{2.9*k:.1f}" '
                     f'transform="rotate({-52+104*t:.0f} {X:.0f} {Y:.0f})"/>')
        g.append('</g>')
    if rabicho:
        g.append(f'<g stroke="{cor}" fill="none" stroke-width="{lw(1.4):.2f}" opacity=".75">'
                 f'<path d="{T("M 84 88 C 96 92 100 102 96 112 C 93 119 86 120 82 114")}"/>'
                 f'<path d="{T("M 85 96 C 92 99 95 105 93 110")}"/></g>')
    return "".join(g) + '</g>'

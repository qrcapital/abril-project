# -*- coding: utf-8 -*-
"""Busto de perfil em talho-doce. DESENHO ORIGINAL.

Cabeca classica inventada, no idioma de medalhao que cedula e moeda usam ha
dois seculos. Nao e a Efigie da Republica nem o retrato de Washington:
aquelas sao gravuras especificas, obra de alguem. O que faz o olho
reconhecer "nota" e ter um perfil gravado no oval, nao ser aquele perfil.

AS SEIS COISAS QUE SEPARAM GRAVURA DE DESENHO (3a rodada)
 1. Reserva de luz. Sombrear por igual achata. A zona iluminada da frente
    abate a hachura por mascara, e o volume nasce do que NAO foi riscado.
 2. Varios sistemas de hachura em angulos diferentes, nao um so: base,
    sombra, cruzamento na sombra e uma trama fina no fundo do cranio.
 3. PONTILHADO nos meios-tons. E o que faltava e o que mais pesa na
    impressao de gravura: a transicao entre luz e sombra em talho-doce nao
    e feita de linha, e de ponto.
 4. Peso de traco variavel no contorno. Gravador engrossa o fio na sombra
    (nuca, mandibula, ombro) e afina na luz (testa, nariz). Por isso o
    contorno aqui e feito de cinco segmentos, cada um com sua espessura, e
    nao de um unico caminho.
 5. Cabelo em mechas individuais com coque na nuca, nao capacete.
 6. Panejamento com dobras hachuradas por dentro.
"""
import math, re, random

# ---- caixa de construcao: 0..104 em x, 0..142 em y, rosto para a esquerda
SILHUETA = (
 "M 52 7 C 34 8 21 22 20 40 C 20 44 19 45 18 48 "
 "C 15 53 9 62 10 66 C 11 69 15 68 14 71 "
 "C 13 74 17 74 17 77 C 17 80 14 81 15 84 "
 "C 16 87 20 87 20 90 C 20 94 24 97 29 100 "
 "C 34 104 39 108 40 116 C 41 124 40 132 36 140 "
 "L 22 142 L 102 142 C 96 134 84 128 79 120 "
 "C 76 114 76 108 78 102 C 86 94 92 82 92 60 "
 "C 92 32 76 7 52 7 Z")

# contorno em segmentos: cada um com seu peso, como o gravador faz
SEGMENTOS = [
 ("M 52 7 C 34 8 21 22 20 40 C 20 44 19 45 18 48", 1.5),          # testa
 ("M 18 48 C 15 53 9 62 10 66 C 11 69 15 68 14 71 "
  "C 13 74 17 74 17 77 C 17 80 14 81 15 84 C 16 87 20 87 20 90", 1.7),  # nariz e boca
 ("M 20 90 C 20 94 24 97 29 100 C 34 104 39 108 40 116 "
  "C 41 124 40 132 36 140", 2.3),                                  # queixo e pescoco
 ("M 102 142 C 96 134 84 128 79 120 C 76 114 76 108 78 102", 3.0), # ombro e nuca
 ("M 78 102 C 86 94 92 82 92 60 C 92 32 76 7 52 7", 2.7),          # fundo do cranio
]

CABELO = (
 "M 20 40 C 23 20 36 7 52 7 C 76 7 92 32 92 60 C 92 78 87 92 80 101 "
 "C 83 96 85 84 85 64 C 85 42 72 24 53 24 C 38 24 28 30 25 44 Z")
SOMBRA = (
 "M 44 30 C 60 26 76 36 80 56 C 84 78 78 100 72 112 "
 "C 66 124 50 130 38 128 C 44 116 46 104 42 96 "
 "C 52 96 62 88 64 72 C 66 56 58 40 44 30 Z")
PESCOCO = "M 38 112 C 52 120 66 118 76 108 C 78 120 80 130 86 138 L 34 138 Z"
LUZ = ("M 24 30 C 34 26 44 32 46 44 C 48 56 40 64 36 74 "
       "C 32 84 34 92 30 98 C 24 94 20 86 20 76 C 20 62 26 50 24 42 Z")
# meio-tom: onde o pontilhado mora, entre a luz e a sombra
TRANSICAO = ("M 26 32 C 42 26 58 34 62 50 C 66 68 56 80 48 92 "
             "C 42 100 38 108 36 116 C 28 108 23 96 26 84 "
             "C 30 68 34 54 28 42 Z")

TRACOS = [
 ("M 17 47 C 22 43 29 43 33 46", 1.5), ("M 20 50 C 24 47 30 47 33 50", 1.2),
 ("M 20 50 C 24 53 30 53 33 50", 1.0), ("M 14 69 C 17 67 20 68 21 71", 1.2),
 ("M 21 71 C 19 73 16 73 14 71", 1.0), ("M 15 79 C 20 77 26 78 29 79", 1.4),
 ("M 16 83 C 20 85 25 84 28 82", 1.0), ("M 17 88 C 21 89 25 88 27 86", 1.0),
 ("M 54 52 C 62 51 66 58 64 66 C 63 72 58 74 54 72", 1.3),
 ("M 57 57 C 61 57 62 62 60 67", 1.0), ("M 58 68 C 61 69 62 71 61 73", 0.8),
 ("M 40 100 C 48 104 58 103 64 97", 1.1),
 ("M 46 116 C 54 120 62 119 68 114", 0.9),
 ("M 22 46 C 27 42 33 42 36 45", 0.9), ("M 21 51 C 22 50 23 50 24 51", 0.8),
 ("M 33 50 C 35 49 36 50 36 51", 0.8), ("M 22 54 C 26 56 31 55 34 53", 0.8),
 ("M 26 62 C 34 64 42 62 48 57", 0.9), ("M 22 72 C 26 78 28 84 27 88", 0.9),
 ("M 16 74 C 17 76 18 76 19 75", 0.7), ("M 29 79 C 31 79 32 80 32 81", 0.8),
 ("M 20 34 C 26 33 32 35 35 39", 0.8), ("M 44 126 C 56 132 70 132 80 126", 0.9),
 ("M 30 132 C 40 136 52 136 60 132", 1.0), ("M 62 130 C 70 134 78 136 86 134", 1.0),
 ("M 36 116 C 44 118 50 117 54 114", 0.8),
]

_num = re.compile(r'(-?\d+\.?\d*)\s+(-?\d+\.?\d*)')
def _tp(d, x0, y0, k):
    return _num.sub(lambda m: "%.1f %.1f" % (x0+float(m.group(1))*k, y0+float(m.group(2))*k), d)

def _arcos(n, cx=126, cy=-26, r0=58, r1=205, a0=97, a1=170):
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
    """`detalhe=False` desenha so silhueta, cabelo e traco interno: e o que a
    copia FANTASMA usa, que vive a 20% de opacidade, onde hachura e ponto nao
    se veem mas pesariam igual no arquivo e no custo de pintura da animacao."""
    k  = altura/142.0
    x0, y0 = cx - 52*k, cy - 66*k
    T  = lambda d: _tp(d, x0, y0, k)
    lw = lambda w: max(0.5, w*k)
    S, H, Sh, P, L, Tr = (T(SILHUETA), T(CABELO), T(SOMBRA), T(PESCOCO), T(LUZ), T(TRANSICAO))

    g = ['<defs>', f'<clipPath id="{idp}s"><path d="{S}"/></clipPath>']
    if detalhe:
        g += [f'<clipPath id="{idp}h"><path d="{H}"/></clipPath>',
              f'<clipPath id="{idp}d"><path d="{Sh}"/></clipPath>',
              f'<clipPath id="{idp}p"><path d="{P}"/></clipPath>',
              f'<clipPath id="{idp}t"><path d="{Tr}"/></clipPath>',
              f'<mask id="{idp}m" maskUnits="userSpaceOnUse" x="{cx-rx}" y="{cy-ry}" '
              f'width="{rx*2}" height="{ry*2}">'
              f'<rect x="{cx-rx}" y="{cy-ry}" width="{rx*2}" height="{ry*2}" fill="#fff"/>'
              f'<path d="{L}" fill="#000" opacity=".84"/></mask>']
    g += [f'<clipPath id="{idp}o"><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/></clipPath>',
          '</defs>',
          f'<g clip-path="url(#{idp}o)" opacity="{op}">',
          f'<path d="{S}" fill="{cor}" opacity=".09"/>']

    if detalhe:
        g.append(f'<g clip-path="url(#{idp}s)">')   # tudo o que segue mora DENTRO da cabeca
        # 1. base, com a luz reservada pela mascara
        g.append(f'<g mask="url(#{idp}m)" stroke="{cor}" fill="none" '
                 f'stroke-width="{lw(1.1):.2f}" opacity=".32">')
        g += [f'<path d="{T(d)}"/>' for d in _arcos(24)]
        g.append('</g>')
        # 2. sombra, mesma direcao e mais densa
        g.append(f'<g clip-path="url(#{idp}d)" stroke="{cor}" fill="none" '
                 f'stroke-width="{lw(1.2):.2f}" opacity=".32">')
        g += [f'<path d="{T(d)}"/>' for d in _arcos(28)]
        g.append('</g>')
        # 3. cruzamento na sombra
        g.append(f'<g clip-path="url(#{idp}d)" stroke="{cor}" fill="none" '
                 f'stroke-width="{lw(.9):.2f}" opacity=".2">')
        g += ['<path d="%s"/>' % T(f"M 30 {22+i*5.4:.1f} L 100 {62+i*5.4:.1f}") for i in range(22)]
        g.append('</g>')
        # 5. PONTILHADO no meio-tom. Em talho-doce a transicao entre luz e
        #    sombra nao e linha, e ponto: e o que faltava para parecer gravura.
        rnd = random.Random(17)
        g.append(f'<g clip-path="url(#{idp}t)" fill="{cor}">')
        for _ in range(210):
            px_, py_ = rnd.uniform(18, 72), rnd.uniform(26, 122)
            dens = min(1.0, max(0.0, (px_-20)/46))        # mais denso rumo a sombra
            if rnd.random() > .25 + .75*dens: continue
            X, Y = x0+px_*k, y0+py_*k
            g.append(f'<circle cx="{X:.1f}" cy="{Y:.1f}" r="{max(.5, (.6+.6*dens)*k):.2f}" '
                     f'opacity="{.22+.3*dens:.2f}"/>')
        g.append('</g>')
        # 6. contra-hachura no pescoco
        g.append(f'<g clip-path="url(#{idp}p)" stroke="{cor}" fill="none" '
                 f'stroke-width="{lw(1.0):.2f}" opacity=".28">')
        g += ['<path d="%s"/>' % T(f"M 26 {104+i*2.2:.1f} L 92 {88+i*2.2:.1f}") for i in range(18)]
        g.append('</g>')
        g.append('</g>')

    # cabelo
    g.append(f'<path d="{H}" fill="{cor}" opacity=".12"/>')
    if detalhe:
        g.append(f'<g clip-path="url(#{idp}h)" stroke="{cor}" fill="none" '
                 f'stroke-linecap="round" opacity=".55">')
        for i in range(20):
            t = i/19
            g.append('<path stroke-width="%.2f" d="%s"/>' % (lw(.7+.9*(i % 3 == 0)), T(
                f"M {21+5*t:.1f} {46-28*t:.1f} C {40+14*t:.1f} {11+7*t:.1f} "
                f"{79+7*t:.1f} {24+11*t:.1f} {83+2*t:.1f} {58+28*t:.1f}")))
        g.append('</g>')
        # coque na nuca
        g.append(f'<g stroke="{cor}" fill="none" stroke-width="{lw(1.1):.2f}" opacity=".6">'
                 f'<path d="{T("M 80 92 C 92 90 98 98 96 108 C 94 116 86 118 81 112")}"/>'
                 f'<path d="{T("M 82 98 C 90 98 94 104 92 110")}"/>'
                 f'<path d="{T("M 84 104 C 89 104 91 107 90 110")}"/></g>')
    g.append(f'<path d="{H}" fill="none" stroke="{cor}" stroke-width="{lw(1.2):.2f}" opacity=".7"/>')

    # contorno com peso variavel
    g.append(f'<g fill="none" stroke="{cor}" stroke-linecap="round">')
    g += [f'<path d="{T(d)}" stroke-width="{lw(w):.2f}"/>' for d, w in SEGMENTOS]
    g.append('</g>')
    # traco interno
    g.append(f'<g stroke="{cor}" fill="none" stroke-linecap="round" opacity=".82">')
    g += [f'<path d="{T(d)}" stroke-width="{lw(w):.2f}"/>' for d, w in TRACOS]
    g.append('</g>')
    g.append(f'<ellipse cx="{x0+26.5*k:.1f}" cy="{y0+50*k:.1f}" rx="{2.1*k:.1f}" '
             f'ry="{2.1*k:.1f}" fill="{cor}" opacity=".85"/>')

    if coroa:
        # coroa de louros: folhas individuais com haste, e fita na nuca
        g.append(f'<g stroke="{cor}" fill="none" stroke-width="{lw(.9):.2f}" opacity=".7">'
                 f'<path d="{T("M 23 40 C 30 22 46 14 62 16 C 76 18 84 28 86 40")}"/></g>')
        g.append(f'<g fill="{cor}" opacity=".6">')
        for i in range(9):
            t = i/8
            bx = 23 + 63*t
            by = 40 - 24*math.sin(t*math.pi) + 2*t
            for lado in (1,):
                X, Y = x0+(bx+2*lado)*k, y0+(by-3.4*lado)*k
                g.append(f'<ellipse cx="{X:.1f}" cy="{Y:.1f}" rx="{5.8*k:.1f}" ry="{2.1*k:.1f}" '
                         f'transform="rotate({-58+116*t+18*lado:.0f} {X:.1f} {Y:.1f})"/>')
        g.append('</g>')
        g.append(f'<g stroke="{cor}" fill="none" stroke-width="{lw(1.0):.2f}" opacity=".65">'
                 f'<path d="{T("M 86 40 C 92 46 94 54 92 60")}"/>'
                 f'<path d="{T("M 86 42 C 90 50 89 58 85 62")}"/></g>')
    if rabicho:
        g.append(f'<g stroke="{cor}" fill="none" stroke-width="{lw(1.4):.2f}" opacity=".75">'
                 f'<path d="{T("M 84 88 C 96 92 100 102 96 112 C 93 119 86 120 82 114")}"/>'
                 f'<path d="{T("M 85 96 C 92 99 95 105 93 110")}"/></g>')
    return "".join(g) + '</g>'

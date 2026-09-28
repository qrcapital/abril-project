# -*- coding: utf-8 -*-
"""Briefing tecnico para o time de tecnologia da Abril."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Spacer, Table, TableStyle, KeepTogether)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

F = "/usr/share/fonts/truetype/google-fonts/"
for nome, arq in [("Poppins","Poppins-Regular"),("Poppins-Md","Poppins-Medium"),
                  ("Poppins-Sb","Poppins-SemiBold"),("Poppins-Bd","Poppins-Bold"),
                  ("Poppins-Lt","Poppins-Light")]:
    try: pdfmetrics.registerFont(TTFont(nome, F+arq+".ttf"))
    except Exception: pdfmetrics.registerFont(TTFont(nome, F+"Poppins-Regular.ttf"))

TINTA  = colors.HexColor("#1A1815")
CINZA  = colors.HexColor("#6B655C")
CINZA2 = colors.HexColor("#9A938A")
VERM   = colors.HexColor("#C1121F")
LINHA  = colors.HexColor("#E3DDD3")
PAPEL  = colors.HexColor("#FBF9F5")

W, H = A4
MX, MT, MB = 26*mm, 26*mm, 22*mm

def st(nome, **kw):
    base = dict(fontName="Poppins", fontSize=9.4, leading=15.2, textColor=TINTA,
                spaceBefore=0, spaceAfter=0)
    base.update(kw); return ParagraphStyle(nome, **base)

S = {
 "eyebrow": st("eyebrow", fontName="Poppins-Sb", fontSize=7.4, leading=11,
               textColor=VERM, spaceAfter=7),
 "h1":      st("h1", fontName="Poppins-Sb", fontSize=21, leading=27,
               spaceAfter=9),
 "sub":     st("sub", fontSize=10.6, leading=17, textColor=CINZA, spaceAfter=0),
 "h2":      st("h2", fontName="Poppins-Sb", fontSize=12.4, leading=17,
               spaceBefore=17, spaceAfter=8),
 "p":       st("p", spaceAfter=8),
 "li":      st("li", leftIndent=11, bulletIndent=1, spaceAfter=5),
 "mono":    st("mono", fontName="Courier", fontSize=8.8, leading=13.4,
               textColor=TINTA),
 "nota":    st("nota", fontSize=8.5, leading=13.4, textColor=CINZA),
 "cel":     st("cel", fontSize=8.7, leading=13),
 "celb":    st("celb", fontName="Poppins-Md", fontSize=8.7, leading=13),
 "celh":    st("celh", fontName="Poppins-Sb", fontSize=7.2, leading=11,
               textColor=CINZA2),
}

def tabela(linhas, larguras, cabecalho=True):
    dados = []
    for i, ln in enumerate(linhas):
        estilo = "celh" if (cabecalho and i == 0) else None
        dados.append([Paragraph(c, S[estilo or ("celb" if j == 0 and i else "cel")])
                      for j, c in enumerate(ln)])
    t = Table(dados, colWidths=larguras, hAlign="LEFT")
    cmds = [("VALIGN",(0,0),(-1,-1),"TOP"),
            ("LEFTPADDING",(0,0),(-1,-1),0), ("RIGHTPADDING",(0,0),(-1,-1),9),
            ("TOPPADDING",(0,0),(-1,-1),6.5), ("BOTTOMPADDING",(0,0),(-1,-1),6.5),
            ("LINEBELOW",(0,0),(-1,-2),0.5,LINHA)]
    if cabecalho:
        cmds += [("LINEBELOW",(0,0),(-1,0),0.8,colors.HexColor("#C9C2B7")),
                 ("BOTTOMPADDING",(0,0),(-1,0),5)]
    t.setStyle(TableStyle(cmds)); return t

def bullets(itens):
    return [Paragraph(f"<font color='#C1121F'>—</font>&nbsp;&nbsp;{i}", S["li"]) for i in itens]

def caixa(texto):
    t = Table([[Paragraph(texto, S["nota"])]], colWidths=[W-2*MX], hAlign="LEFT")
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),PAPEL),
                           ("BOX",(0,0),(-1,-1),0.5,LINHA),
                           ("LEFTPADDING",(0,0),(-1,-1),11),("RIGHTPADDING",(0,0),(-1,-1),11),
                           ("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9)]))
    return t

def rodape(canv, doc):
    canv.saveState()
    canv.setFont("Poppins", 6.8); canv.setFillColor(CINZA2)
    canv.drawString(MX, MB-11*mm, "BlockTrends · VEJA Negócios — Estratégia Internacional")
    canv.drawRightString(W-MX, MB-11*mm, f"{doc.page}")
    canv.setStrokeColor(LINHA); canv.setLineWidth(0.5)
    canv.line(MX, MB-7.5*mm, W-MX, MB-7.5*mm)
    canv.restoreState()

doc = BaseDocTemplate("/tmp/brief/briefing.pdf", pagesize=A4,
                      leftMargin=MX, rightMargin=MX, topMargin=MT, bottomMargin=MB,
                      title="Estratégia Internacional — briefing técnico de publicação",
                      author="BlockTrends")
doc.addPageTemplates([PageTemplate(id="p", frames=[
    Frame(MX, MB, W-2*MX, H-MT-MB, leftPadding=0, rightPadding=0,
          topPadding=0, bottomPadding=0)], onPage=rodape)])

P = lambda t, e="p": Paragraph(t, S[e])
s = []

s += [P("Briefing técnico de publicação", "eyebrow"),
      P("Estratégia Internacional<br/>em blocktrends.abril.com.br", "h1"),
      P("Curso online produzido pela BlockTrends com chancela editorial da VEJA Negócios. "
        "Este documento descreve o que é a aplicação, o que ela precisa do lado da Abril e "
        "o que não precisa. Data: 23 de setembro de 2026.", "sub"),
      Spacer(1, 6)]

s += [P("1. O que é", "h2"),
      P("Uma aplicação web única que atende quatro funções: a página de vendas do curso, a "
        "página de captação de interessados, a área do aluno (aulas em vídeo, prova e "
        "certificado) e um painel administrativo interno. Lançamento previsto para 28 de "
        "setembro de 2026.")]
s += [tabela([
    ["Caminho", "Função", "Natureza"],
    ["/", "Página de vendas", "Estática com dados vivos"],
    ["/lista-de-espera", "Captação de leads", "Formulário, grava no banco"],
    ["/app/*", "Área do aluno", "Autenticada, sessão por cookie"],
    ["/admin/*", "Painel interno", "Autenticada, papel restrito"],
    ["/api/*", "Endpoints de serviço", "Webhook de compra e cotação"],
], [30*mm, 55*mm, 63*mm])]

s += [P("2. Arquitetura", "h2"),
      tabela([
    ["Camada", "Tecnologia"],
    ["Aplicação", "Next.js 16 (App Router, React Server Components, SSR)"],
    ["Runtime", "Node.js 22"],
    ["Hospedagem", "Netlify, com o runtime oficial do Next.js (@netlify/plugin-nextjs)"],
    ["Banco e autenticação", "Supabase (PostgreSQL gerenciado, Auth, RLS ativo)"],
    ["Vídeo", "Panda Video (player embutido, entrega pelo CDN deles)"],
    ["Pagamento", "Guru, integração por webhook de entrada"],
    ["E-mail transacional", "Resend"],
], [42*mm, 106*mm]),
      Spacer(1, 6),
      caixa("<b>Ponto de atenção:</b> a aplicação não é um site estático e não pode ser entregue "
            "como um pacote de arquivos para hospedagem própria. Há renderização no servidor, "
            "middleware de sessão em cada request autenticado, um webhook de entrada e rotas de "
            "API. Ela precisa do runtime, que hoje roda no Netlify.")]

s += [P("3. O que precisamos da Abril", "h2"),
      P("Um único registro de DNS. Nada mais.")]
s += [tabela([
    ["Campo", "Valor"],
    ["Tipo", "CNAME"],
    ["Nome", "blocktrends"],
    ["Zona", "abril.com.br"],
    ["Valor", "abril-project.netlify.app"],
    ["TTL", "300 segundos durante a virada, depois pode subir"],
], [26*mm, 122*mm])]
s += [Spacer(1, 5)] + bullets([
    "Não é necessário delegar nameservers nem alterar o apex de <b>abril.com.br</b>. "
    "É delegação de um host só, por CNAME.",
    "O certificado TLS é emitido automaticamente por Let's Encrypt assim que o CNAME "
    "resolver. Não há CSR, não há renovação manual, não há certificado para a Abril gerir.",
    "Se houver CDN ou WAF corporativo na frente da zona (Cloudflare, Akamai, Fastly), este "
    "host precisa passar em modo <i>passthrough</i>, sem proxy. A aplicação é dinâmica e o "
    "TLS precisa terminar no Netlify.",
])

s += [P("4. Tráfego de saída da página", "h2"),
      P("Domínios de terceiros que a aplicação chama do navegador, caso exista política de "
        "CSP ou allowlist aplicada à zona:")]
s += [tabela([
    ["Domínio", "Para quê"],
    ["*.tv.pandavideo.com.br", "Player de vídeo, legendas e thumbnails"],
    ["*.supabase.co", "Autenticação e dados da área do aluno"],
    ["api.bcb.gov.br", "Cotação do dólar, via nossa própria rota de servidor"],
    ["wa.me", "Link de suporte por WhatsApp"],
], [58*mm, 90*mm]),
      Spacer(1, 5),
      P("Fontes e imagens são auto-hospedadas no próprio domínio. Não há chamada a Google "
        "Fonts nem a CDN de terceiros para assets.", "nota")]

s += [P("5. Entrada: webhook de compra", "h2"),
      P("O gateway de pagamento chama um endpoint nosso quando uma compra é aprovada, para "
        "liberar o acesso do aluno. É o único tráfego de entrada além do navegador."),
      P("POST https://blocktrends.abril.com.br/api/webhooks/guru", "mono"),
      Spacer(1, 4),
      P("Autenticado por segredo compartilhado no cabeçalho. Não requer liberação especial "
        "de firewall além do HTTPS padrão.", "nota")]

s += [P("6. Publicação e reversão", "h2")]
s += bullets([
    "A publicação é contínua, a partir do repositório Git. Cada mudança aprovada gera um "
    "build imutável e uma versão nova.",
    "Existe um ambiente de homologação separado, com URL própria, onde tudo é validado antes "
    "de ir ao ar. O domínio da Abril aponta somente para produção.",
    "A reversão é atômica: qualquer build anterior pode ser promovido a produção em segundos, "
    "sem novo deploy e sem tocar no DNS.",
    "Janela de virada sugerida: fora do horário comercial, com o TTL já reduzido a 300s no dia "
    "anterior.",
])

s += [P("7. O que a Abril não precisa fazer", "h2")]
s += bullets([
    "Provisionar servidor, container ou banco de dados.",
    "Emitir, instalar ou renovar certificado TLS.",
    "Receber, revisar ou publicar código.",
    "Operar deploy, monitoramento ou backup da aplicação.",
])

s += [P("8. Checklist", "h2"),
      tabela([
    ["Passo", "Responsável"],
    ["Cadastrar o domínio personalizado no painel de hospedagem", "BlockTrends"],
    ["Criar o CNAME na zona abril.com.br", "Abril"],
    ["Confirmar propagação e emissão do certificado", "BlockTrends"],
    ["Teste de aceitação: vendas, cadastro, login, vídeo e compra", "BlockTrends"],
    ["Liberação para tráfego e campanha", "Abril e BlockTrends"],
], [104*mm, 44*mm]),
      Spacer(1, 9),
      caixa("Dúvidas técnicas e coordenação da virada: Marcelo R. Campos, BlockTrends, "
            "marcelocampos.mrc@gmail.com. Ambiente de homologação disponível por link sob "
            "demanda para validação prévia do time da Abril.")]

doc.build(s)
print("ok")

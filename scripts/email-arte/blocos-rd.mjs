// Monta o bloco HTML dos e-mails da live no RD Station (#02 amanhã, #03 hoje, #04 agora), no
// mesmo desenho do #01 aprovado em 02/out/2026: cabeçalho com o lockup do site, banner em Jost,
// dois parágrafos curtos, bloco escuro com a data, botão e assinatura. Sem serifa em lugar nenhum.
//
//   node scripts/email-arte/blocos-rd.mjs      -> grava docs/emails-rd/<n>-*.html
//
// O que sai daqui é o conteúdo do módulo HTML do editor do RD (BEE). O editor preserva esse
// módulo como está; a linha de texto "ver como página web" que o RD põe no topo foi tirada
// porque roubava a prévia da caixa de entrada, e o link foi para o pé do bloco.
//
// LINK DA LIVE: provisoriamente a página da pré-lista, até a Abril passar o endereço da transmissão.
// Não use `#`: o RD marca o conteúdo como inválido com link vazio e recusa o envio de teste.

import { writeFileSync } from "node:fs";

const SITE = "https://blocktrends.abril.com.br/email";
const S3 = "https://email-editor-production.s3.amazonaws.com/images/76199";
const SANS = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
const JOST = "'Jost','Futura','Century Gothic','Trebuchet MS',Arial,sans-serif";
const LINK_LIVE = "https://blocktrends.abril.com.br/";

const forte = (t) => `<strong style="color:#0a0a0a;">${t}</strong>`;

function montar({ previa, banner, alt, paragrafos, extra = "", escuro, botao, despedida }) {
  const pre =
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#ffffff;font-size:1px;line-height:1px;mso-hide:all;">${previa}` +
    "&#847;&zwnj;&nbsp;".repeat(60) +
    "</div>";
  const ps = paragrafos
    .map((p, i) => `<p style="margin:0 0 ${i === paragrafos.length - 1 ? 28 : 16}px;">${p}</p>`)
    .join("");
  const btn = botao
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:22px auto 0;"><tr><td bgcolor="#f7f4ee" style="background:#f7f4ee;border-radius:10px;"><a href="${LINK_LIVE}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${JOST};font-size:16px;line-height:20px;font-weight:500;color:#6b111c;text-decoration:none;">${botao}</a></td></tr></table>`
    : "";
  return (
    `<style>@import url(https://fonts.googleapis.com/css2?family=Jost:wght@400;500&display=swap);</style>` +
    pre +
    `<style> .ei-container img{border:0;display:block;outline:none;text-decoration:none} @media (max-width:620px){ .ei-container .px{padding-left:24px!important;padding-right:24px!important} .ei-container .data-t{font-size:32px!important;line-height:38px!important} } </style>` +
    `<table role="presentation" class="ei-container" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;text-align:left;">` +
    `<tr><td height="4" bgcolor="#6b111c" style="background:#6b111c;font-size:0;line-height:0;">&nbsp;</td></tr>` +
    `<tr><td bgcolor="#f7f4ee" style="background:#f7f4ee;"><img src="${SITE}/ei-cabecalho.png" width="600" alt="VEJA Negócios | Estratégia Internacional" style="width:100%;max-width:600px;height:auto;display:block;" /></td></tr>` +
    `<tr><td bgcolor="#5c0f18" style="background:#5c0f18;"><img src="${SITE}/${banner}" width="600" alt="${alt}" style="width:100%;max-width:600px;height:auto;display:block;font-family:${JOST};font-size:22px;line-height:30px;color:#ffffff;" /></td></tr>` +
    `<tr><td class="px" bgcolor="#ffffff" style="background:#ffffff;padding:36px 48px 8px;font-family:${SANS};font-size:15px;line-height:25px;color:#2b2b2b;">${ps}</td></tr>` +
    extra +
    `<tr><td class="px" bgcolor="#0a0a0a" align="center" style="background:#0a0a0a;padding:36px 48px;">` +
    `<p style="margin:0 0 10px;font-family:${JOST};font-size:15px;line-height:20px;color:#d6ba80;font-weight:500;">${escuro.rotulo}</p>` +
    `<p class="data-t" style="margin:0;font-family:${JOST};font-size:40px;line-height:46px;color:#ffffff;font-weight:500;">${escuro.titulo}</p>` +
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:16px auto;"><tr><td width="48" height="1" bgcolor="#c7a86b" style="background:#c7a86b;font-size:0;line-height:0;">&nbsp;</td></tr></table>` +
    `<p style="margin:0;font-family:${SANS};font-size:15px;line-height:24px;color:#e8e2d4;">${escuro.apoio}</p>${btn}</td></tr>` +
    `<tr><td class="px" bgcolor="#ffffff" style="background:#ffffff;padding:32px 48px;font-family:${SANS};"><p style="margin:0 0 6px;font-size:15px;line-height:24px;color:#2b2b2b;">${despedida}</p><p style="margin:0;font-family:${JOST};font-size:18px;line-height:24px;color:#0a0a0a;font-weight:500;">Equipe Estratégia Internacional</p></td></tr>` +
    `<tr><td class="px" bgcolor="#f7f4ee" align="center" style="background:#f7f4ee;padding:26px 48px;border-top:1px solid #e3dccb;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td valign="middle"><img src="${S3}/ei-marca-veja-negocios.png" width="88" alt="VEJA Negócios" style="width:88px;height:auto;" /></td><td valign="middle" style="padding:0 16px;font-family:Arial,sans-serif;font-size:14px;color:#7e6836;">×</td><td valign="middle"><img src="${S3}/ei-marca-blocktrends.png" width="110" alt="BlockTrends" style="width:110px;height:auto;" /></td></tr></table></td></tr>` +
    `</table>` +
    `<p style="margin:0;padding:14px 0 0;text-align:center;font-family:Arial,sans-serif;font-size:12px;line-height:18px;color:#8c8c8c;">Visualizar este e-mail como <a href="*||WEB_PREVIEW_LINK||*" target="_blank" style="color:#8c8c8c;text-decoration:underline;">página web</a></p>`
  );
}

function professor(nome, linha) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f4ee" style="background:#f7f4ee;border-left:3px solid #7e6836;margin:0 0 10px;"><tr><td style="padding:16px 22px;"><p style="margin:0 0 4px;font-family:${JOST};font-size:18px;line-height:24px;color:#0a0a0a;font-weight:500;">${nome}</p><p style="margin:0;font-family:${SANS};font-size:14px;line-height:22px;color:#2b2b2b;">${linha}</p></td></tr></table>`;
}

const PROFESSORES =
  `<tr><td class="px" bgcolor="#ffffff" style="background:#ffffff;padding:0 48px 30px;">` +
  `<p style="margin:0 0 12px;font-family:${JOST};font-size:15px;line-height:20px;color:#7e6836;font-weight:500;">Quem está na live</p>` +
  professor("Rodolfo Bastos", "Liderou a operação internacional da XP Investimentos em Miami.") +
  professor("Tony Volpon", "Foi diretor do Banco Central do Brasil e estrategista-chefe da WHG.") +
  `</td></tr>`;

export const EMAILS = {
  23217313: {
    arquivo: "2-amanha.html",
    html: montar({
      previa: "Amanhã, 13 de outubro, às 19h, ao vivo no YouTube da VEJA Negócios.",
      banner: "ei-banner-02-amanha-v2.jpg",
      alt: "Amanhã, 19h. A live de lançamento do curso Estratégia Internacional é amanhã.",
      paragrafos: [
        `Amanhã, 13 de outubro, às 19h, a VEJA Negócios e o BlockTrends lançam ao vivo ${forte("Estratégia Internacional")}, o curso online sobre como investir fora do Brasil. Como você está na pré-lista, tem ${forte("prioridade na inscrição")} quando as vagas abrirem, no próprio dia da live.`,
        `Na live, os professores mostram por que deixar todo o patrimônio num país só é um risco, e qual é o caminho para diversificar lá fora, da abertura da conta aos primeiros investimentos.`,
      ],
      extra: PROFESSORES,
      escuro: {
        rotulo: "Save the date",
        titulo: "Amanhã, 19h",
        apoio: "Live de lançamento do curso, gratuita, ao vivo no YouTube da VEJA Negócios.",
      },
      botao: "Ativar lembrete no YouTube",
      despedida: "Até amanhã,",
    }),
  },
  23217382: {
    arquivo: "3-hoje.html",
    html: montar({
      previa: "Às 19h, ao vivo no YouTube da VEJA Negócios. Entre alguns minutos antes.",
      banner: "ei-banner-03-hoje-v2.jpg",
      alt: "Hoje, 19h. É hoje a live de lançamento do curso Estratégia Internacional.",
      paragrafos: [
        `${forte("É hoje.")} Às 19h, Rodolfo Bastos e Tony Volpon apresentam ao vivo ${forte("Estratégia Internacional")}, o curso online da VEJA Negócios e do BlockTrends sobre como investir fora do Brasil.`,
        `É a chance de ver como quem já geriu recursos fora do Brasil pensa proteção cambial e diversificação. E, por estar na pré-lista, você tem ${forte("prioridade quando as inscrições abrirem")}.`,
      ],
      escuro: {
        rotulo: "Hoje, ao vivo",
        titulo: "19h",
        apoio: "Entre alguns minutos antes e acompanhe desde o começo.",
      },
      botao: "Assistir à live",
      despedida: "Até daqui a pouco,",
    }),
  },
  23217438: {
    arquivo: "4-agora.html",
    html: montar({
      previa: "A live de lançamento do curso começou. Clique para entrar.",
      banner: "ei-banner-04-agora-v2.jpg",
      alt: "Ao vivo agora. A live de lançamento do curso Estratégia Internacional começou.",
      paragrafos: [
        `A live de lançamento de ${forte("Estratégia Internacional")} está começando agora, ao vivo no YouTube da VEJA Negócios. Ainda dá tempo de pegar desde o início.`,
      ],
      escuro: {
        rotulo: "Ao vivo agora",
        titulo: "Começou",
        apoio: "Live de lançamento do curso, no YouTube da VEJA Negócios.",
      },
      botao: "Entrar na live",
      despedida: "Até já,",
    }),
  },
};

if (process.argv[1]?.endsWith("blocos-rd.mjs")) {
  for (const { arquivo, html } of Object.values(EMAILS)) {
    writeFileSync(new URL(`../../docs/emails-rd/${arquivo}`, import.meta.url), html + "\n");
  }
  writeFileSync("/tmp/blocos-rd.json", JSON.stringify(Object.fromEntries(Object.entries(EMAILS).map(([k, v]) => [k, v.html]))));
  console.log("ok");
}

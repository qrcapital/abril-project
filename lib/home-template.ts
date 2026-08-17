// Preenche a Home (vitrine) com dados de lib/curso: banner "Continue de onde
// parou" e os cards de módulo (contador, %, estado). Fonte única de verdade —
// muda o progresso, muda a Home. Mantém os estilos exatos do design.

import type { Curriculo } from "./curso";
import { innerOfDiv } from "./html-slice.ts";

const BADGE_BASE =
  "position:absolute;top:10px;left:10px;z-index:3;font-size:8px;font-weight:800;letter-spacing:.14em;border-radius:4px;padding:3px 7px";
const BADGE_ATIVO = `${BADGE_BASE};background:linear-gradient(160deg,#D9BE85,#A98E4E);color:#0A2B1E`;
const BADGE_NEUTRO = `${BADGE_BASE};background:#EDE6DD;border:1px solid #E0D3BE;color:#7E6836`;
// Módulo ainda fechado pela esteira. Pill âmbar, o mesmo par do módulo deficitário no
// resultado da prova (DESIGN.md §2): cor como informação, não como decoração.
const BADGE_TRAVADO = `${BADGE_BASE};background:#F7E3BE;border:1px solid #E8CE97;color:#7A4E06`;

function card(
  c: Curriculo,
  idx: number,
  concluidas: Set<number>,
  travadoEm: number | "breve" | null,
): string {
  // `travadoEm` é o número de dias que faltam; `"breve"` é fechado sem data (política em
  // breve, 0016); `null` quer dizer aberto.
  const travado = travadoEm !== null;
  const m = c.modulos[idx];
  const aulas = c.aulas.filter((a) => a.modulo === idx);
  const total = aulas.length;
  const done = aulas.filter((a) => concluidas.has(a.n)).length;
  const emAndamento =
    (done > 0 && done < total) || aulas.some((a) => a.n === c.aulaAtual(concluidas).n);

  const badgeText = travado
    ? travadoEm === "breve"
      ? "EM BREVE"
      : travadoEm === 1
        ? "ABRE AMANHÃ"
        : `ABRE EM ${travadoEm} DIAS`
    : idx === 0
      ? "BOAS-VINDAS"
      : emAndamento
        ? "EM ANDAMENTO"
        : "AULAS";
  const badge = travado ? BADGE_TRAVADO : emAndamento ? BADGE_ATIVO : BADGE_NEUTRO;
  const label = (m.docente ? `${m.label} · ${m.docente}` : m.label).toUpperCase();
  const pct = Math.round((done / total) * 100);
  const count = done === total ? `${done}/${total} ✓` : `${done}/${total}`;
  const countColor = done > 0 ? "#7E6836" : "#8F887E";
  const aulasTxt = total === 1 ? "1 aula" : `${total} aulas`;

  const trava = travado ? "opacity:.72;cursor:default" : "cursor:pointer";
  return `<div class="mcard"${travado ? ' data-travado="1"' : ""} style="background:#fff;border:1px solid #E4DACC;border-radius:13px;overflow:hidden;${trava};position:relative;display:flex;flex-direction:column;box-shadow:0 6px 18px rgba(11,45,32,.05)"><span style="${badge}">${badgeText}</span><div style="position:relative;aspect-ratio:3/3.5;flex:0 0 auto;background:linear-gradient(160deg,#F0EADF,#E7DECF)"><div class="art-slot">Arte do módulo</div></div><div style="padding:13px 15px 15px;display:flex;flex-direction:column;flex:1"><span style="font-size:8.5px;letter-spacing:.16em;color:#7E6836;font-weight:700">${label}</span><h3 style="font-family:'Playfair Display',serif;font-size:15px;font-weight:600;margin:3px 0 9px;line-height:1.2;color:#0B2D20">${m.titulo}</h3><div style="height:4px;border-radius:2px;background:#EDE6DD;overflow:hidden"><i style="display:block;height:100%;width:${pct}%;background:#A98E4E;border-radius:2px"></i></div><div style="display:flex;justify-content:space-between;font-size:9.5px;color:#8F887E;margin-top:7px"><span>${aulasTxt}</span><span style="color:${countColor};font-weight:600">${count}</span></div></div></div>`;
}

/**
 * O QUE O CARD DA PROVA FINAL DIZ E PARA ONDE ELE LEVA, por estado do aluno.
 *
 * Até 31/jul/2026 ele era **estático**: dizia "desbloqueia com 16/16 aulas" com um cadeado para todo
 * mundo, inclusive para quem já tinha as 16, para quem estava com a prova aberta e para quem já havia
 * reprovado. Era a única informação desatualizada de uma tela que o aluno vê todo dia.
 *
 * O caso que o Pedro pediu em 31/jul é o `reprovado`: depois de reprovar, o card **não leva mais à
 * prova** (a prova é de tentativa única, então clicar ali só podia dar em frustração) e passa a dizer
 * o único caminho que existe, que é falar com o suporte. O clique abre o WhatsApp.
 *
 * `aprovado` e `liberada` entraram junto porque a linha que eu ia reescrever era a mesma, e deixá-las
 * dizendo "desbloqueia com 16/16" seria consertar meio card.
 */
export type EstadoCardProva =
  | "bloqueada"
  | "liberada"
  | "andamento"
  | "reprovado"
  | "aprovado"
  | "segunda";

const CADEADO =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7E6836" stroke-width="2">' +
  '<rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>';
const RELOGIO =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7E6836" stroke-width="2">' +
  '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>';
const CHECK =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1B7A50" stroke-width="2">' +
  '<circle cx="12" cy="12" r="9"></circle><path d="M8.3 12.3l2.4 2.4 5-5.4"></path></svg>';
const ZAP =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7E6836" stroke-width="2">' +
  '<path d="M21 11.5a8.5 8.5 0 1 1-4.2-7.3L21 3l-1.2 4.2a8.4 8.4 0 0 1 1.2 4.3z"></path></svg>';

// A FORMA DAS SEIS LINHAS, fechada pelo Pedro em 31/jul depois de ver as duas primeiras na tela:
// maiúscula no início da frase e o **"·" do design** como separador, sem ponto final. As duas que ele
// escreveu (reprovado e aprovado) nasceram com ponto e foram trazidas para essa forma; as outras
// quatro ganharam a maiúscula. Uma regra só, para ninguém decidir de novo a cada estado novo.
const LINHA_PROVA: Record<EstadoCardProva, { icone: string; texto: string }> = {
  bloqueada: { icone: CADEADO, texto: "Desbloqueia com 16/16 aulas" },
  liberada: { icone: RELOGIO, texto: "Liberada · 20 questões em 120 minutos" },
  andamento: { icone: RELOGIO, texto: "Prova em andamento · continue de onde parou" },
  // A copy do reprovado é do Pedro, em duas rodadas de 31/jul: primeiro ele pediu que a home diga o
  // VEREDITO (eu havia posto só o caminho), e depois encurtou a frase porque a quebra de linha ficava
  // ruim no card. "Clique aqui" é literal: o card inteiro é clicável e abre o WhatsApp.
  reprovado: { icone: ZAP, texto: "Você reprovou · clique aqui e entre em contato com o Suporte" },
  aprovado: { icone: CHECK, texto: "Aprovado · baixe seu certificado" },
  segunda: { icone: RELOGIO, texto: "2ª chamada liberada" },
};

/**
 * O card de 2ª chamada, escondido até um admin liberar (PRD §5, "oculto até liberado pelo admin").
 *
 * ELE EXISTE PORQUE A LIBERAÇÃO ERA INVISÍVEL. Até 31/jul/2026 o admin criava a tentativa e o aluno
 * não tinha como saber: o card da prova continuava dizendo "desbloqueia com 16/16 aulas", e quem
 * acabou de reprovar não tem motivo para clicar nele de novo. A 2ª chamada só chegava pelo WhatsApp do
 * suporte dizendo "entra lá e clica".
 *
 * Reaproveita a moldura do card da Prova Final em vez de inventar uma: é a mesma família visual (a
 * borda dourada da certificação) e o aluno já sabe o que aquele bloco significa. O que muda é o
 * kicker, o título e a linha de baixo.
 *
 * A COPY CABE EM UMA LINHA, e isso é requisito e não gosto. O card é item de uma prateleira de três
 * colunas (~340px), então cada linha a mais o deixa mais alto que os vizinhos e a fileira fica torta.
 * Foram duas rodadas de encurtamento com o Pedro olhando a tela: a primeira versão tinha o aviso dos
 * 120 minutos (que a tela de instruções já dá, no clique seguinte) e a segunda ainda quebrava em duas.
 * Ao mexer nesta frase, conte os caracteres.
 */
function cardSegundaChamada(): string {
  return (
    '<div class="mcard" data-segunda="1" style="background:linear-gradient(150deg,#FFFDF7,#F6EFE0);' +
    "border:1.5px solid #D9BE85;border-radius:14px;padding:22px 24px;cursor:pointer;display:flex;" +
    'align-items:center;gap:18px;box-shadow:0 8px 22px rgba(169,142,78,.14)">' +
    '<div style="position:relative;width:52px;height:52px;flex:0 0 auto;display:flex;' +
    'align-items:center;justify-content:center;border-radius:50%;background:#F0E9D8">' +
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7E6836" stroke-width="1.8">' +
    '<path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path></svg></div>' +
    '<div style="flex:1">' +
    '<span style="font-size:8.5px;letter-spacing:.16em;color:#7E6836;font-weight:700">SEGUNDA CHAMADA</span>' +
    '<h3 style="font-family:\'Playfair Display\',serif;font-size:17px;font-weight:600;' +
    'margin:3px 0 5px;color:#0B2D20">Sua nova tentativa está liberada</h3>' +
    '<div style="font-size:11px;color:#7E6836;line-height:1.5">Com questões sorteadas de novo.</div>' +
    "</div></div>"
  );
}

export function fillHome(
  html: string,
  c: Curriculo,
  concluidas: Set<number>,
  /** Dias que faltam por módulo; `null` no valor = em breve, sem data (política, 0016). */
  travados: Map<number, number | null> = new Map(),
  /** Tentativa de 2ª chamada liberada e não iniciada. Vem do banco, nunca da URL. */
  segundaChamada = false,
  /** Em que ponto da prova este aluno está. Decide a linha e o clique do card da Prova Final. */
  estadoProva: EstadoCardProva = "bloqueada",
): string {
  const atual = c.aulaAtual(concluidas);
  const mod = c.modulos[atual.modulo];
  const linha = atual.numero
    ? `${mod.label} · Aula ${atual.n} · ${atual.titulo}`
    : `${mod.label} · ${atual.titulo}`;

  let out = html
    .replace("Módulo II · Aula 7 · Comprando ações nos EUA", linha)
    .replace("Continuar Aula 7", atual.numero ? `Continuar Aula ${atual.n}` : "Começar formação");

  // A linha de baixo do card da Prova Final e o `data-prova` que diz ao cliente para onde o clique
  // vai. O atributo existe para o clique NÃO depender de ler o texto do card: a rota do reprovado é o
  // WhatsApp, e amarrar isso a uma frase que alguém vai reescrever no futuro é armadilha.
  const linhaProva = LINHA_PROVA[estadoProva];
  // O total do estado bloqueado sai do currículo, não da frase: o gate lê `conta_no_gate`
  // desde 17/ago, então o número acompanha o checkbox do admin em vez de morar na copy.
  const textoProva =
    estadoProva === "bloqueada"
      ? `Desbloqueia com ${c.totalAvaliadas}/${c.totalAvaliadas} aulas`
      : linhaProva.texto;
  out = out.replace(
    /<div style="display:flex;align-items:center;gap:7px;font-size:11px;color:#7E6836">.*?desbloqueia com 16\/16 aulas<\/div>/,
    `<div style="display:flex;align-items:center;gap:7px;font-size:11px;color:#7E6836">${linhaProva.icone} ${textoProva}</div>`,
  );
  {
    const provaIdx = out.indexOf("PROVA FINAL");
    const abre = provaIdx >= 0 ? out.lastIndexOf('<div class="mcard"', provaIdx) : -1;
    if (abre >= 0)
      out = `${out.slice(0, abre)}<div class="mcard" data-prova="${estadoProva}"${out.slice(abre + '<div class="mcard"'.length)}`;
  }

  // O card de 2ª chamada entra DEPOIS do card da Prova Final, por decisão do Pedro ao ver os três
  // juntos: a prateleira fica bônus, prova final, segunda chamada. A primeira versão o punha em
  // primeiro, com o argumento de que é a novidade; vendo na tela, ele lê melhor como consequência do
  // card da prova, ao lado dele.
  //
  // Injetado aqui, no template, e não por edição do HTML gerado, que o próximo porte apagaria. Para
  // inserir DEPOIS é preciso achar o fim do card da prova, e é o que o `innerOfDiv` faz: ele devolve o
  // fim do conteúdo interno, então o `</div>` de fechamento vem logo em seguida.
  if (segundaChamada) {
    const provaIdx = out.indexOf("PROVA FINAL");
    const abre = provaIdx >= 0 ? out.lastIndexOf('<div class="mcard"', provaIdx) : -1;
    if (abre >= 0) {
      const { end } = innerOfDiv(out, abre);
      const depois = end + "</div>".length;
      out = out.slice(0, depois) + cardSegundaChamada() + out.slice(depois);
    }
  }

  // regenera os cards da prateleira "A Formação"
  const railIdx = out.indexOf('class="rail"');
  if (railIdx >= 0) {
    const openIdx = out.lastIndexOf("<div", railIdx);
    const { start, end } = innerOfDiv(out, openIdx);
    out = out.slice(0, start) +
      c.modulos
        .map((_, i) => {
          // O Map fala a língua da tela (null = em breve); o card fala a do template
          // (null = aberto). A tradução vive aqui, num lugar só.
          const t = travados.has(i) ? (travados.get(i) ?? "breve") : null;
          return card(c, i, concluidas, t);
        })
        .join("") +
      out.slice(end);
  }
  return out;
}

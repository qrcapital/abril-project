// Preenche o template da aula (design portado) com os dados de uma aula específica
// e regenera a sidebar de progresso com os estados reais (concluída/atual/futura).
// Mantém os estilos exatos do design; só troca o conteúdo dinâmico.

import { href, type Aula, type Curriculo } from "./curso";
import { esc } from "./html-slice.ts";
import type { Material } from "./materiais";

const CHEV =
  '<svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A98E4E" stroke-width="2" style="flex:0 0 auto"><path d="M6 9l6 6 6-6"></path></svg>';

const MDOT = {
  done: "width:10px;height:10px;border-radius:50%;background:#A98E4E;border:1.5px solid #A98E4E;flex:0 0 auto",
  progress:
    "width:10px;height:10px;border-radius:50%;background:linear-gradient(90deg,#A98E4E 50%,transparent 50%);border:1.5px solid #A98E4E;flex:0 0 auto",
  todo: "width:10px;height:10px;border-radius:50%;background:transparent;border:1.5px solid #C9BCA8;flex:0 0 auto",
};
const LDOT = {
  done: "width:8px;height:8px;border-radius:50%;background:#A98E4E;border:1.5px solid #A98E4E;flex:0 0 auto",
  current:
    "width:8px;height:8px;border-radius:50%;background:linear-gradient(90deg,#A98E4E 50%,transparent 50%);border:1.5px solid #A98E4E;flex:0 0 auto",
  todo: "width:8px;height:8px;border-radius:50%;background:transparent;border:1.5px solid #C9BCA8;flex:0 0 auto",
};

// `esc` no título: ele é editado pelo admin em `/admin/conteudo`, então é entrada de gente,
// não constante nossa — sem escape, um título com `<script>` vira XSS armazenado para a
// base inteira de alunos.
const aulaLabel = (a: Aula) => (a.numero ? `${a.numero} · ${esc(a.titulo)}` : esc(a.titulo));

function summary(
  c: Curriculo,
  idx: number,
  done: number,
  total: number,
  hasCurrent: boolean,
): string {
  const m = c.modulos[idx];
  const dot = done === total ? MDOT.done : done > 0 || hasCurrent ? MDOT.progress : MDOT.todo;
  const countColor = done === 0 && !hasCurrent ? "#8F887E" : "#7E6836";
  const count = done === total ? `${done}/${total} ✓` : `${done}/${total}`;
  return `<summary style="list-style:none;cursor:pointer;padding:13px 15px;font-size:11.5px;font-weight:700;color:#0B2D20;display:flex;align-items:center;gap:10px" style-hover="background:#FAF7F1"><span style="${dot}"></span><span style="flex:1">${m.label} · ${esc(m.titulo)}</span><span style="font-size:9px;color:${countColor};font-weight:700">${count}</span>${CHEV}</summary>`;
}

function row(a: Aula, currentN: number, concluidas: Set<number>): string {
  const label = aulaLabel(a);
  if (a.n === currentN) {
    return `<div data-href="${href(a)}" style="display:flex;align-items:center;gap:10px;padding:9px 15px 9px 22px;font-size:11px;color:#7E6836;font-weight:600;border-top:1px solid #EFE7DB;background:#F6EFE0;cursor:pointer"><span style="${LDOT.current}"></span> ${label}</div>`;
  }
  const dot = concluidas.has(a.n) ? LDOT.done : LDOT.todo;
  return `<div data-href="${href(a)}" style="display:flex;align-items:center;gap:10px;padding:9px 15px 9px 22px;font-size:11px;color:#565049;border-top:1px solid #EFE7DB;cursor:pointer" style-hover="background:#FAF7F1"><span style="${dot}"></span> ${label}</div>`;
}

export function renderSidebar(c: Curriculo, currentN: number, concluidas: Set<number>): string {
  return c.modulos.map((m) => {
    const aulas = c.aulas.filter((a) => a.modulo === m.idx);
    const done = aulas.filter((a) => concluidas.has(a.n)).length;
    const hasCurrent = aulas.some((a) => a.n === currentN);
    const open = hasCurrent ? " open=\"\"" : "";
    return `<details name="modacc" class="modacc"${open} style="background:#fff;border:1px solid #E4DACC;border-radius:10px;margin-bottom:8px;overflow:hidden">${summary(
      c,
      m.idx,
      done,
      aulas.length,
      hasCurrent
    )}${aulas.map((a) => row(a, currentN, concluidas)).join("")}</details>`;
  }).join("");
}

// Botão de marcar/desmarcar conclusão da aula (data-concluir tratado no AulaClient).
/**
 * Os dois estados do botão de concluir, exportados porque o **cliente** também precisa
 * deles: ao clicar, o `AulaClient` repinta o botão na hora e só então pede o `router.refresh`
 * (marcação otimista). Com as strings escritas nos dois lugares, os estados divergiriam no
 * primeiro ajuste de cor.
 */
export function estadoConcluir(concluida: boolean): { style: string; rotulo: string } {
  const base =
    "margin:2px 0 26px;border-radius:8px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12.5px;padding:12px 22px;letter-spacing:.03em";
  return concluida
    ? {
        style: `${base};border:1px solid #1F8A5B;background:rgba(31,138,91,.08);color:#1F8A5B;cursor:pointer`,
        rotulo: "✓ Aula concluída · desmarcar",
      }
    : {
        style: `${base};border:none;background:linear-gradient(160deg,#D9BE85,#A98E4E);color:#0A2B1E;cursor:pointer;box-shadow:0 6px 16px rgba(169,142,78,.26)`,
        rotulo: "Marcar aula como concluída",
      };
}

function concluirBtn(aula: Aula, concluidas: Set<number>): string {
  const e = estadoConcluir(concluidas.has(aula.n));
  return `<div><button data-concluir="${aula.n}" style="${e.style}">${e.rotulo}</button></div>`;
}

function prevBtn(prev?: Aula): string {
  const base =
    "border-radius:6px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12.5px;padding:11px 16px;background:#fff;border:1px solid #D6C3C2;color:#565049";
  if (!prev) return `<button disabled style="${base};opacity:.4;cursor:not-allowed">← Anterior</button>`;
  const label = prev.numero ? `← Aula ${prev.n}` : "← Boas-vindas";
  return `<button data-nav="${href(prev)}" style="${base};cursor:pointer" style-hover="border-color:#A98E4E;color:#7E6836">${label}</button>`;
}

// Vídeo de exemplo tocando no player (placeholder do Panda Video). Quando o Panda
// entrar, este src passa a vir dos dados da aula.
const VIDEO_EXEMPLO = "/app/video/aula-exemplo.mp4";
// controlsList="nodownload" tira o botão de baixar dos controles; oncontextmenu
// bloqueia o "salvar vídeo como" do menu de contexto. (A aula não é para download;
// os materiais sim.) A proteção definitiva vem do Panda Video / URLs assinadas.
const PLAYER = `<div style="background:#000;width:100%;height:clamp(300px,46vw,520px);display:flex;align-items:center;justify-content:center"><video controls controlsList="nodownload noremoteplayback" disablePictureInPicture oncontextmenu="return false" playsinline style="height:100%;max-width:100%;aspect-ratio:16/9;background:#000;display:block" src="${VIDEO_EXEMPLO}"></video></div>`;


/** Ícone de documento do design, reusado em cada linha de material. */
const ICONE_DOC =
  '<span style="width:28px;height:28px;border-radius:7px;background:#EDE6DD;display:flex;' +
  'align-items:center;justify-content:center;flex:0 0 auto"><svg width="14" height="14" ' +
  'viewBox="0 0 24 24" fill="none" stroke="#7E6836" stroke-width="1.6"><rect x="5" y="3" ' +
  'width="14" height="18" rx="2"></rect><path d="M9 8h6M9 12h6"></path></svg></span>';

const LINHA_MATERIAL =
  "display:flex;align-items:center;gap:12px;padding:11px 0;font-size:13px;color:#333333;" +
  "border-top:1px solid #EFE7DB;margin-top:8px";

/**
 * As linhas de material da aula, ou o estado "em breve" quando não há nenhum.
 *
 * O `PRD.md` §6 pede que a seção suma ou diga "em breve", **sem link quebrado**. Até 29/jul o
 * template reescrevia os três `href="#"` do design para o mesmo PDF de exemplo, o que dava três
 * materiais falsos em toda aula e nenhum caminho para o caso de não haver material.
 */
function linhasDeMaterial(materiais: Material[]): string {
  if (!materiais.length)
    return (
      `<p style="${LINHA_MATERIAL};color:#8F887E;font-style:italic">` +
      "Os materiais desta aula chegam em breve.</p>"
    );
  return materiais
    .map(
      (m) =>
        `<a href="${esc(m.arquivo)}" download style="${LINHA_MATERIAL}" ` +
        `style-hover="color:#7E6836">${ICONE_DOC} ${esc(m.titulo)}</a>`,
    )
    .join("");
}

export function fillAula(
  html: string,
  c: Curriculo,
  aula: Aula,
  pos: number,
  concluidas: Set<number>,
  materiais: Material[] = []
): string {
  const mod = c.modulos[aula.modulo];
  const anterior = c.aulas[pos - 1];
  const proxima = c.aulas[pos + 1];
  const breadLabel = aula.numero ? `Aula ${aula.n}` : "Boas-vindas";
  const pct = c.progressoPct(concluidas);
  // Só as avaliadas: `concluidas.size` inclui a boas-vindas e estourava o "17 de 16".
  const count = c.totalAvaliadas - c.aulasRestantes(concluidas);

  return html
    // player: troca o placeholder por um vídeo de exemplo
    .replace(
      /<div style="background:#000;position:relative;width:100%;height:clamp[\s\S]*?(?=<div class="lesson-grid")/,
      PLAYER
    )
    // materiais: o card do design tem três links fixos; aqui eles viram os do banco, ou o
    // estado "em breve". A âncora é o rótulo do card, que é único na tela.
    .replace(
      /(MATERIAIS DESTA AULA<\/b>)[\s\S]*?(?=<\/div>)/,
      (_m, rotulo) => rotulo + linhasDeMaterial(materiais),
    )
    // breadcrumb — replacement por FUNÇÃO em todo texto vindo do banco: numa string de
    // replacement um `$&` no título editado pelo admin viraria referência de grupo, e sem
    // `esc()` um `<script>` viraria XSS armazenado (plano de correções de 17/ago, item 12).
    .replace("Módulo II · Renda Fixa e Ações nos EUA", () => `${mod.label} · ${esc(mod.titulo)}`)
    .replace(">Aula 7</span>", `>${breadLabel}</span>`)
    // rótulo da apostila (materiais) segue o módulo atual
    .replace("Módulo II — Renda Fixa e Ações nos EUA", () => `${mod.label} — ${esc(mod.titulo)}`)
    // título + descrição
    .replace(">Comprando ações nos EUA</h1>", () => `>${esc(aula.titulo)}</h1>`)
    .replace(
      /(<p style="font-size:14px;color:#565049;max-width:660px;margin:0 0 26px">)[\s\S]*?(<\/p>)/,
      (_m, abre, fecha) => `${abre}${esc(aula.descricao)}${fecha}${concluirBtn(aula, concluidas)}`
    )
    // navegação
    .replace(/<button [^>]*>← Aula 6<\/button>/, prevBtn(anterior))
    .replace(
      /<button ([^>]*)>Próxima aula →<\/button>/,
      proxima
        ? `<button $1 data-nav="${href(proxima)}">Próxima aula →</button>`
        : `<button $1 data-nav="/app">Concluir formação ✓</button>`
    )
    // progresso
    .replace(">43%</span>", `>${pct}%</span>`)
    .replace(">7 de 16 aulas concluídas</span>", `>${count} de ${c.totalAvaliadas} aulas concluídas</span>`)
    .replace("width:43%", `width:${pct}%`)
    // sidebar (accordions gerados a partir do currículo)
    .replace(/<details name="modacc"[\s\S]*<\/details>/, renderSidebar(c, aula.n, concluidas));
}

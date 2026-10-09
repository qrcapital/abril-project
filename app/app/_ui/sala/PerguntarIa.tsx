"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

/** O que o componente precisa saber de cada aula do notebook para montar a pergunta. */
export type AulaParaIa = {
  /** Posição da aula no módulo (`Aula.pos`), a mesma do `data-aula` da seção. */
  pos: number;
  titulo: string;
  /** A descrição da aula no banco ou, sem ela, os capítulos da seção. Pode faltar. */
  resumo?: string;
};

type Ia = "chatgpt" | "claude" | "gemini";

/** Quem abriu o menu: o botão fixo (pergunta sobre a aula) ou o mini botão da seleção (sobre o trecho). */
type Menu = { origem: "botao" | "selecao"; pos: number; trecho?: string; ancora: DOMRect };

/** A seleção que acende o mini botão. O `range` é uma cópia, para reposicionar ao rolar. */
type Selecao = { texto: string; pos: number; range: Range; rolagem: number };

/** Teto do trecho que vai na pergunta. Acima disso o endereço do ChatGPT e do Claude fica enorme. */
const TETO_TRECHO = 1500;
/** Quanto a página pode rolar com o mini botão aberto antes de ele sumir. */
const ROLAGEM_MAX = 280;
/** Tempo do aviso do Gemini na tela. */
const AVISO_MS = 3000;

const CURSO = "do curso Estratégia Internacional (VEJA Negócios + BlockTrends)";

/**
 * "Perguntar à sua IA" (09/out/2026): um atalho do notebook para o ChatGPT, o Claude ou o Gemini,
 * com a pergunta já escrita. Duas portas para o mesmo menu:
 *
 * 1. O BOTÃO FIXO, no canto de baixo à direita, que só aparece com o notebook na tela. Pergunta
 *    sobre a aula que está sendo lida (a última seção cujo topo passou de um terço da janela; antes
 *    da primeira seção, a aula do teatro). O canto de baixo à direita é o único que o vídeo fixo não
 *    usa em nenhuma largura (ver "vídeo fixo ao rolar" em `sala.css`): no desktop largo ele fica no
 *    alto à direita, entre 961 e 1471px no pé da coluna do índice, à esquerda, e no celular no topo.
 * 2. O MINI BOTÃO DA SELEÇÃO: o aluno seleciona um trecho do notebook (só dentro de
 *    `.sl-nb-canvas`; fora dele nada acontece) e um "Perguntar à IA" aparece acima do trecho, ou
 *    abaixo no toque, para não brigar com o menu nativo de copiar do celular. Some quando a seleção
 *    é desfeita, com Esc, com clique fora ou rolando a página além de `ROLAGEM_MAX`.
 *
 * NADA PASSA POR SERVIDOR NOSSO E NADA É MEDIDO. O ChatGPT e o Claude recebem a pergunta no `?q=` do
 * endereço, em nova aba. O Gemini não tem parâmetro de pergunta: a pergunta vai para a área de
 * transferência e a aba abre vazia, com o aviso "Pergunta copiada. Cole no Gemini.".
 *
 * A CÓPIA É SÍNCRONA (`execCommand`) ANTES DO `window.open`. Com `navigator.clipboard`, que é
 * assíncrono, a nova aba tira o foco da página antes de a escrita terminar e o Chrome recusa
 * ("Document is not focused"); esperar a escrita antes de abrir faz o Safari bloquear a aba. A API
 * nova fica de reserva para quando o `execCommand` não existir.
 *
 * O menu segue o padrão de menu do WAI-ARIA: `role="menu"`, itens `menuitem`, setas, Home e End
 * movem o foco, Esc fecha e devolve o foco a quem abriu, Tab fecha. Os logos são os do pacote
 * simple-icons (CC0), colados como caminho de SVG para não somar dependência ao bundle; o da OpenAI
 * saiu do pacote na versão 14 e vem da 13.
 */
export default function PerguntarIa({ modulo, aulas, atual }: { modulo: string; aulas: AulaParaIa[]; atual: number }) {
  const raiz = useRef<HTMLSpanElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const mini = useRef<HTMLButtonElement>(null);
  const caixa = useRef<HTMLDivElement>(null);
  const segurandoMini = useRef(false);
  const relogioAviso = useRef<number | undefined>(undefined);
  const idMenu = useId();

  const [visivel, setVisivel] = useState(false);
  const [selecao, setSelecao] = useState<Selecao | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // As escutas da página leem o estado por ref: elas se inscrevem uma vez só.
  const menuRef = useRef<Menu | null>(null);
  const selecaoRef = useRef<Selecao | null>(null);
  useEffect(() => {
    menuRef.current = menu;
  }, [menu]);
  useEffect(() => {
    selecaoRef.current = selecao;
  }, [selecao]);

  /** O notebook (para saber quando ele está na tela) e o miolo (onde a seleção vale). */
  const pecas = useCallback(() => {
    const nb = raiz.current?.closest<HTMLElement>(".sl-nbm") ?? null;
    return { nb, canvas: nb?.querySelector<HTMLElement>(".sl-nb-canvas") ?? null };
  }, []);

  // O botão fixo só existe com o notebook à vista: sobre o palco do vídeo ele seria ruído.
  useEffect(() => {
    const { nb } = pecas();
    if (!nb || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { rootMargin: "0px 0px -15% 0px" });
    io.observe(nb);
    return () => io.disconnect();
  }, [pecas]);

  // A seleção de texto. No mouse, o mini botão aparece quando o aluno solta o botão (no meio do
  // arraste ele piscaria a cada letra); no toque e no teclado, quando a seleção para de mudar.
  useEffect(() => {
    const { canvas } = pecas();
    if (!canvas) return;
    let arrastando = false;
    let espera: number | undefined;

    const ler = () => {
      if (menuRef.current) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        if (!segurandoMini.current) setSelecao(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const dentro = canvas.contains(range.startContainer) && canvas.contains(range.endContainer);
      const texto = limpar(sel.toString());
      if (!dentro || texto.length < 2) {
        if (!segurandoMini.current) setSelecao(null);
        return;
      }
      const el = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
      const pos = Number(el?.closest<HTMLElement>("[data-aula]")?.dataset.aula) || atual;
      setSelecao({ texto, pos, range: range.cloneRange(), rolagem: window.scrollY });
    };
    const mudou = () => {
      window.clearTimeout(espera);
      const sel = window.getSelection();
      // Desfazer some na hora; criar ou mudar espera o fim do gesto.
      if (!sel || sel.isCollapsed) return ler();
      if (arrastando) return;
      espera = window.setTimeout(ler, 220);
    };
    const desce = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button === 0) arrastando = true;
    };
    const sobe = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      arrastando = false;
      window.clearTimeout(espera);
      // Depois do clique, que pode desfazer a seleção.
      espera = window.setTimeout(ler, 10);
    };

    document.addEventListener("selectionchange", mudou);
    document.addEventListener("pointerdown", desce);
    document.addEventListener("pointerup", sobe);
    return () => {
      window.clearTimeout(espera);
      document.removeEventListener("selectionchange", mudou);
      document.removeEventListener("pointerdown", desce);
      document.removeEventListener("pointerup", sobe);
    };
  }, [pecas, atual]);

  // O mini botão acompanha o trecho na rolagem e some se ela for longa ou se o trecho sair da tela.
  useLayoutEffect(() => {
    const b = mini.current;
    if (!selecao || !b) return;
    let quadro = 0;
    const toque = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const posicionar = () => {
      const r = selecao.range.getBoundingClientRect();
      const fora = r.bottom < 0 || r.top > window.innerHeight;
      if (Math.abs(window.scrollY - selecao.rolagem) > ROLAGEM_MAX || fora || (!r.width && !r.height)) {
        setSelecao(null);
        return;
      }
      const w = b.offsetWidth;
      const h = b.offsetHeight;
      const topo = parseFloat(getComputedStyle(b).getPropertyValue("--sl-topo")) || 64;
      const margem = 10;
      const x = Math.min(Math.max(margem, r.left + r.width / 2 - w / 2), window.innerWidth - w - margem);
      // No toque, abaixo do trecho e longe das alças de seleção; no mouse, acima.
      const acima = r.top - 10 - h;
      const abaixo = r.bottom + (toque ? 30 : 10);
      let y = toque ? abaixo : acima;
      if (!toque && acima < topo + margem) y = abaixo;
      if (toque && abaixo + h > window.innerHeight - margem) y = Math.max(topo + margem, acima - 20);
      b.style.left = `${Math.round(x)}px`;
      b.style.top = `${Math.round(y)}px`;
    };
    posicionar();
    const rola = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(posicionar);
    };
    window.addEventListener("scroll", rola, { passive: true });
    window.addEventListener("resize", rola);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", rola);
      window.removeEventListener("resize", rola);
    };
  }, [selecao]);

  const fechar = useCallback((devolverFoco: boolean) => {
    const m = menuRef.current;
    setMenu(null);
    if (devolverFoco && m?.origem === "botao") botao.current?.focus();
  }, []);

  // Menu aberto: Esc e clique fora fecham; vindo da seleção, rolar também (ele fica preso ao trecho).
  useEffect(() => {
    if (!menu) return;
    const rolagem = window.scrollY;
    const fora = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (caixa.current?.contains(t) || botao.current?.contains(t) || mini.current?.contains(t)) return;
      fechar(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        fechar(true);
      }
    };
    const rola = () => {
      if (menu.origem === "selecao" && Math.abs(window.scrollY - rolagem) > 24) fechar(false);
    };
    const redimensiona = () => fechar(false);
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", tecla);
    window.addEventListener("scroll", rola, { passive: true });
    window.addEventListener("resize", redimensiona);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", tecla);
      window.removeEventListener("scroll", rola);
      window.removeEventListener("resize", redimensiona);
    };
  }, [menu, fechar]);

  // Sem seleção, Esc e clique fora apagam o mini botão (a seleção em si fica com o aluno).
  useEffect(() => {
    if (!selecao || menu) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelecao(null);
    };
    const fora = (e: PointerEvent) => {
      const { canvas } = pecas();
      const t = e.target;
      if (!(t instanceof Node) || mini.current?.contains(t) || canvas?.contains(t)) return;
      setSelecao(null);
    };
    document.addEventListener("keydown", tecla);
    document.addEventListener("pointerdown", fora);
    return () => {
      document.removeEventListener("keydown", tecla);
      document.removeEventListener("pointerdown", fora);
    };
  }, [selecao, menu, pecas]);

  // Posição do menu: acima do botão fixo, alinhado à direita dele; abaixo do mini botão (acima, se
  // não couber), centrado nele. Depois, o foco vai para o primeiro item.
  useLayoutEffect(() => {
    const c = caixa.current;
    if (!menu || !c) return;
    const a = menu.ancora;
    const w = c.offsetWidth;
    const h = c.offsetHeight;
    const margem = 10;
    let x: number;
    let y: number;
    let lado: "cima" | "baixo";
    if (menu.origem === "botao") {
      x = a.right - w;
      y = a.top - 8 - h;
      lado = "cima";
    } else {
      x = a.left + a.width / 2 - w / 2;
      const cabeEmbaixo = a.bottom + 8 + h <= window.innerHeight - margem;
      y = cabeEmbaixo ? a.bottom + 8 : a.top - 8 - h;
      lado = cabeEmbaixo ? "baixo" : "cima";
    }
    x = Math.min(Math.max(margem, x), window.innerWidth - w - margem);
    y = Math.min(Math.max(margem, y), window.innerHeight - h - margem);
    c.style.left = `${Math.round(x)}px`;
    c.style.top = `${Math.round(y)}px`;
    c.dataset.lado = lado;
    // A escala nasce do ponto de onde o menu saiu.
    c.style.transformOrigin = `${Math.round(Math.min(Math.max(a.left + a.width / 2 - x, 0), w))}px ${lado === "cima" ? "100%" : "0"}`;
    c.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus({ preventScroll: true });
  }, [menu]);

  useEffect(() => () => window.clearTimeout(relogioAviso.current), []);

  function abrirDoBotao() {
    if (menu?.origem === "botao") return fechar(false);
    const b = botao.current;
    if (!b) return;
    setSelecao(null);
    setMenu({ origem: "botao", pos: aulaNaTela(), ancora: b.getBoundingClientRect() });
  }

  function abrirDaSelecao() {
    segurandoMini.current = false;
    const s = selecaoRef.current;
    const b = mini.current;
    if (!s || !b) return;
    setMenu({ origem: "selecao", pos: s.pos, trecho: s.texto, ancora: b.getBoundingClientRect() });
    setSelecao(null);
  }

  /** A aula que o aluno está lendo: a última seção cujo topo já passou de um terço da janela. */
  function aulaNaTela(): number {
    const { canvas } = pecas();
    let pos = atual;
    canvas?.querySelectorAll<HTMLElement>("[data-aula]").forEach((s) => {
      if (s.getBoundingClientRect().top <= window.innerHeight / 3) pos = Number(s.dataset.aula) || pos;
    });
    return pos;
  }

  function perguntar(ia: Ia) {
    const m = menuRef.current;
    if (!m) return;
    const aula = aulas.find((a) => a.pos === m.pos);
    const texto = montarPergunta(modulo, m.pos, aula, m.trecho);
    // Quem abriu pelo botão fixo volta para ele quando retornar da outra aba.
    fechar(m.origem === "botao");
    if (ia === "gemini") {
      const copiou = copiarJa(texto);
      window.open("https://gemini.google.com/app", "_blank", "noopener");
      if (copiou) return avisar("Pergunta copiada. Cole no Gemini.");
      // Reserva: a API assíncrona, já com a aba aberta. Pode ser recusada sem foco.
      navigator.clipboard
        ?.writeText(texto)
        .then(() => avisar("Pergunta copiada. Cole no Gemini."))
        .catch(() => avisar("O navegador não deixou copiar a pergunta."));
      return;
    }
    const base = ia === "chatgpt" ? "https://chatgpt.com/?q=" : "https://claude.ai/new?q=";
    window.open(base + encodeURIComponent(texto), "_blank", "noopener");
  }

  function avisar(texto: string) {
    window.clearTimeout(relogioAviso.current);
    setAviso(texto);
    relogioAviso.current = window.setTimeout(() => setAviso(null), AVISO_MS);
  }

  /** Setas, Home e End entre os itens; Tab sai do menu e fecha. */
  function teclaNoMenu(e: React.KeyboardEvent<HTMLDivElement>) {
    const itens = Array.from(caixa.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    const i = itens.indexOf(document.activeElement as HTMLButtonElement);
    let alvo = -1;
    if (e.key === "ArrowDown") alvo = (i + 1) % itens.length;
    else if (e.key === "ArrowUp") alvo = (i - 1 + itens.length) % itens.length;
    else if (e.key === "Home") alvo = 0;
    else if (e.key === "End") alvo = itens.length - 1;
    else if (e.key === "Tab") return fechar(false);
    if (alvo < 0) return;
    e.preventDefault();
    itens[alvo]?.focus();
  }

  if (!aulas.length) return null;

  const aulaDoMenu = menu ? aulas.find((a) => a.pos === menu.pos) : undefined;
  const cabeca = menu?.trecho
    ? "Perguntar sobre o trecho selecionado"
    : `Aula ${String(menu?.pos ?? atual).padStart(2, "0")}${aulaDoMenu ? ` · ${aulaDoMenu.titulo}` : ""}`;

  return (
    <span ref={raiz} className="sl-ia">
      <button
        ref={botao}
        type="button"
        className="sl-ia-botao"
        data-visivel={visivel || menu?.origem === "botao" ? "sim" : "nao"}
        aria-haspopup="menu"
        aria-expanded={menu?.origem === "botao"}
        aria-controls={menu?.origem === "botao" ? idMenu : undefined}
        onClick={abrirDoBotao}
        onKeyDown={(e) => {
          if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !menu) {
            e.preventDefault();
            abrirDoBotao();
          }
        }}
      >
        <Brilho />
        Perguntar à sua IA
      </button>

      {selecao && !menu && (
        <button
          ref={mini}
          type="button"
          className="sl-ia-mini"
          aria-haspopup="menu"
          aria-expanded={false}
          // Segura a seleção: sem isto o clique a desfaria antes de o menu ler o trecho.
          onPointerDown={(e) => {
            segurandoMini.current = true;
            if (e.pointerType === "mouse") e.preventDefault();
          }}
          onPointerUp={() => {
            // O clique vem logo depois; a folga cobre o toque, em que a seleção some ao soltar.
            window.setTimeout(() => (segurandoMini.current = false), 400);
          }}
          onPointerCancel={() => {
            segurandoMini.current = false;
          }}
          onClick={abrirDaSelecao}
        >
          <Brilho />
          Perguntar à IA
        </button>
      )}

      {menu && (
        <div
          ref={caixa}
          className="sl-ia-menu"
          id={idMenu}
          role="menu"
          aria-label={menu.trecho ? "Perguntar à IA sobre o trecho selecionado" : "Perguntar à IA sobre esta aula"}
          onKeyDown={teclaNoMenu}
          onPointerDown={(e) => {
            if (e.pointerType === "mouse") e.preventDefault();
          }}
        >
          <p className="sl-ia-cabeca" aria-hidden="true">
            {cabeca}
          </p>
          <div className="sl-ia-sep" role="separator" />
          {ITENS.map((it) => (
            <button key={it.ia} type="button" role="menuitem" tabIndex={-1} className="sl-ia-item" data-ia={it.ia} onClick={() => perguntar(it.ia)}>
              <svg className="sl-ia-logo" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d={it.caminho} fill="currentColor" />
              </svg>
              <span className="sl-ia-nome">{it.nome}</span>
              {it.dica && <span className="sl-ia-dica">{it.dica}</span>}
            </button>
          ))}
        </div>
      )}

      <span className="sl-so-leitor" role="status" aria-live="polite">
        {aviso ?? ""}
      </span>
      {aviso && (
        <span className="sl-ia-aviso" aria-hidden="true">
          {aviso}
        </span>
      )}
    </span>
  );
}

/** Espaços e quebras do DOM colapsados (no máximo uma linha em branco) e o teto do trecho. */
function limpar(t: string): string {
  const s = t
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (s.length <= TETO_TRECHO) return s;
  const corte = s.slice(0, TETO_TRECHO);
  const espaco = corte.lastIndexOf(" ");
  return `${(espaco > TETO_TRECHO * 0.8 ? corte.slice(0, espaco) : corte).trimEnd()}…`;
}

function montarPergunta(modulo: string, pos: number, aula: AulaParaIa | undefined, trecho?: string): string {
  const qual = aula
    ? `a aula ${String(pos).padStart(2, "0")}, “${aula.titulo}”, do ${modulo}`
    : `o ${modulo}`;
  const contexto = `Estou estudando ${qual} ${CURSO}.`;
  if (trecho) return `${contexto} Me explique de forma simples este trecho:\n\n“${trecho}”`;
  const resumo = aula?.resumo ? `\n\nResumo da aula: ${limpar(aula.resumo)}` : "";
  return `${contexto} Me ajude a entender os principais conceitos desta aula.${resumo}`;
}

/**
 * Copia na hora, dentro do gesto do aluno, por uma caixa de texto fora da tela. Devolve se deu certo.
 * O foco volta para onde estava; a seleção do trecho se perde, mas a pergunta já foi montada.
 */
function copiarJa(texto: string): boolean {
  const antes = document.activeElement as HTMLElement | null;
  const t = document.createElement("textarea");
  t.value = texto;
  t.setAttribute("readonly", "");
  t.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0;font-size:16px";
  document.body.appendChild(t);
  // Foco e seleção explícitos: alguns navegadores só copiam o que está selecionado no elemento focado.
  t.focus({ preventScroll: true });
  t.select();
  t.setSelectionRange(0, texto.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  t.remove();
  antes?.focus?.({ preventScroll: true });
  return ok;
}

/** O brilho de quatro pontas dos dois botões. */
function Brilho() {
  return (
    <svg className="sl-ia-brilho" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.5c.5 4.3 2.7 6.5 7 7-4.3.5-6.5 2.7-7 7-.5-4.3-2.7-6.5-7-7 4.3-.5 6.5-2.7 7-7Z" />
      <path d="M18.5 3v3M17 4.5h3" strokeLinecap="round" />
    </svg>
  );
}

/** Logos de simple-icons (CC0): `openai` (v13), `claude` e `googlegemini` (v16). */
const ITENS: { ia: Ia; nome: string; dica?: string; caminho: string }[] = [
  {
    ia: "chatgpt",
    nome: "ChatGPT",
    caminho:
      "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  },
  {
    ia: "claude",
    nome: "Claude",
    caminho:
      "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  },
  {
    ia: "gemini",
    nome: "Gemini",
    dica: "Copia a pergunta",
    caminho:
      "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  },
];

import type { CSSProperties } from "react";

import { EXIGENCIAS } from "@/lib/senha";

/**
 * Os padrões de feedback da área do aluno, num lugar só (docs/DESIGN.md §3).
 *
 * Antes desta extração a mesma caixa aparecia escrita à mão em três clients, com três
 * vermelhos e dois jeitos de dizer "carregando". A auditoria do `docs/FEEDBACK-UX.md` pediu
 * que os padrões fossem escolhidos UMA vez, antes das telas, senão cada correção inventa a
 * sua variante.
 *
 * Estilo em objeto e não em classe CSS por um motivo do projeto: o `app/app/_ui/styles.css`
 * é GERADO pelo `scripts/port-area.mjs`, então classe nova ali morre no próximo porte. Os
 * valores levam unidade explícita ("8px", não 8) para o mesmo objeto servir ao React
 * (`style={}`) e ao DOM (`Object.assign(el.style, ...)`), que é como as telas portadas
 * precisam consumir.
 */

const BASE: CSSProperties = {
  fontFamily: "'Montserrat',system-ui,sans-serif",
  fontSize: "12.5px",
  lineHeight: "1.5",
  borderRadius: "8px",
  padding: "11px 14px",
  // A caixa sempre fica acima de alguma coisa (o botão, em todas as telas de hoje), então a
  // folga de baixo é dela. Escondida ela some do fluxo, e a margem vai junto.
  margin: "0 0 14px",
};

/**
 * Duas famílias, não quatro. Vermelho `#b0413e` é o único uso não decorativo de vermelho
 * que o DESIGN.md §2 autoriza (erro), e o dourado cobre sucesso e aviso sem somar uma
 * segunda cor de destaque. Contrastes medidos sobre a coluna escura `#0B2D20`:
 * erro 7,00:1, sucesso 10,24:1, aviso 7,04:1.
 */
export const CAIXA: Record<"erro" | "sucesso" | "aviso", CSSProperties> = {
  erro: {
    ...BASE,
    background: "rgba(176,65,62,.14)",
    border: "1px solid rgba(176,65,62,.4)",
    color: "#E6A9A7",
  },
  sucesso: {
    ...BASE,
    background: "rgba(217,190,133,.08)",
    border: "1px solid rgba(217,190,133,.35)",
    color: "#EDE6DD",
  },
  aviso: {
    ...BASE,
    background: "rgba(217,190,133,.08)",
    border: "1px solid rgba(217,190,133,.35)",
    color: "#D9BE85",
  },
};

/**
 * O mesmo par para as telas CLARAS. A área do aluno não é escura como o login: o chrome é
 * escuro e o miolo de toda tela de `(sala)` é `#F7F5F2` com texto `#333333`. Os hexes de
 * cima ficam ilegíveis ali, então o padrão precisa das duas versões desde o começo, senão a
 * primeira tela clara que precisar de caixa inventa a sua.
 *
 * Contrastes medidos sobre `#F7F5F2`: erro 6,47:1, sucesso 10,60:1, aviso 4,66:1.
 * Dois achados da medição, que explicam por que estes hexes e não os óbvios:
 * o `--gold-dark` `#7E6836` sobre tinta dourada a 10% dá 4,49:1 e falha AA por 0,01, então
 * o sucesso claro leva texto de corpo com o dourado na borda; e o aviso, que é o único que
 * PRECISA soar dourado, usa a tinta a 6% para o mesmo `#7E6836` passar com 4,66:1.
 */
export const CAIXA_CLARO: Record<"erro" | "sucesso" | "aviso", CSSProperties> = {
  erro: {
    ...BASE,
    background: "rgba(176,65,62,.08)",
    border: "1px solid rgba(176,65,62,.32)",
    color: "#8E3330",
  },
  sucesso: {
    ...BASE,
    background: "rgba(169,142,78,.10)",
    border: "1px solid rgba(169,142,78,.38)",
    color: "#333333",
  },
  aviso: {
    ...BASE,
    background: "rgba(169,142,78,.06)",
    border: "1px solid rgba(169,142,78,.38)",
    color: "#7E6836",
  },
};

/**
 * Pinta (ou esconde, com `texto` nulo) a caixa de mensagem num elemento que já está no DOM,
 * tipicamente o `[data-feedback]` que o `senha-template` emite entre os campos e o botão.
 *
 * É helper de DOM e não componente React de propósito: toda tela deste projeto é HTML
 * portado injetado com `dangerouslySetInnerHTML`, e JSX irmão desse bloco vira vizinho do
 * layout inteiro. Foi exatamente o que aconteceu na primeira versão, vista no browser em
 * 29/jul: a caixa nascia no fim da página, 350px abaixo do formulário.
 *
 * `erro` leva `role="alert"`, que interrompe o leitor de tela na hora, porque é resposta a
 * uma ação que falhou; sucesso e aviso levam `aria-live="polite"`, que espera a leitura
 * corrente terminar. `tema` acompanha o fundo: `escuro` é a família do login, `claro` é o
 * miolo das telas de `(sala)`.
 */
export function pintarCaixa(
  slot: HTMLElement | null | undefined,
  tipo: keyof typeof CAIXA,
  texto: string | null,
  tema: "escuro" | "claro" = "escuro",
  link?: { rotulo: string; href: string },
): void {
  if (!slot) return;
  if (!texto) {
    slot.hidden = true;
    slot.textContent = "";
    return;
  }
  Object.assign(slot.style, (tema === "claro" ? CAIXA_CLARO : CAIXA)[tipo]);
  if (tipo === "erro") {
    slot.setAttribute("role", "alert");
    slot.removeAttribute("aria-live");
  } else {
    slot.setAttribute("aria-live", "polite");
    slot.removeAttribute("role");
  }
  slot.hidden = false;
  slot.textContent = texto;

  // Link dentro da frase, na palavra que o nomeia ("...fale com o suporte no WhatsApp").
  // Montado com nós de texto, nunca com `innerHTML`: a mensagem pode carregar texto vindo do
  // servidor, e um caminho de erro não é lugar para abrir uma porta de injeção.
  if (!link) return;
  const corte = texto.indexOf(link.rotulo);
  const a = document.createElement("a");
  a.href = link.href;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = link.rotulo;
  a.style.cssText = "color:inherit;font-weight:700;text-decoration:underline";
  if (corte < 0) {
    // Rótulo ausente da frase: o link vai para o fim, em vez de sumir.
    slot.append(" ", a);
    return;
  }
  slot.textContent = texto.slice(0, corte);
  slot.append(a, texto.slice(corte + link.rotulo.length));
}

/**
 * Painel de recado que ocupa a tela inteira: usado pelo `loading`, `error` e `not-found` do
 * grupo `(sala)`. Existe como componente e não copiado três vezes porque é o critério do
 * DESIGN.md §8 (mesmo pattern em três telas).
 *
 * Repete o envelope das telas portadas (`#F7F5F2`, `#333333`, `100vh - 58px` descontando a
 * topbar) para o recado cair dentro do chrome como qualquer outra tela, em vez de romper o
 * layout. Título em Playfair, corpo em Montserrat, como manda o DESIGN.md §2.
 */
export function Painel({
  titulo,
  children,
  role,
}: {
  titulo: string;
  children?: React.ReactNode;
  role?: "status" | "alert";
}) {
  return (
    <div
      style={{
        background: "#F7F5F2",
        color: "#333333",
        minHeight: "calc(100vh - 58px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 28px",
      }}
    >
      <div style={{ maxWidth: 560, textAlign: "center" }} role={role} aria-live={role ? "polite" : undefined}>
        <h1
          style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontWeight: 600,
            fontSize: "clamp(24px, 4vw, 34px)",
            lineHeight: 1.2,
            margin: "0 0 12px",
            color: "#0B2D20",
          }}
        >
          {titulo}
        </h1>
        {children}
      </div>
    </div>
  );
}

/** Botão sólido da plataforma (DESIGN.md §3, "botão secundário / ação da plataforma"). */
export const BOTAO: CSSProperties = {
  background: "#0B2D20",
  color: "#F7F5F2",
  fontFamily: "'Montserrat',system-ui,sans-serif",
  fontWeight: 700,
  fontSize: "13px",
  padding: "11px 22px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

/** Corpo de texto dos painéis, no secundário claro do DESIGN.md §2. */
export const CORPO: CSSProperties = {
  fontFamily: "'Montserrat',system-ui,sans-serif",
  fontSize: "14px",
  lineHeight: 1.6,
  color: "#6D6D6D",
  margin: "0 0 22px",
};

/**
 * Padrão 4 do DESIGN.md §3: a lista de exigências de senha que marca conforme a pessoa
 * cumpre. Devolve o `<ul>` para quem chamou inserir onde quiser, e já liga o `input`.
 *
 * A fonte é a lista `EXIGENCIAS` de `lib/senha.ts`, a mesma que gera a frase da regra e a
 * mensagem de recusa: com a regra escrita em três lugares, elas divergem no primeiro ajuste.
 *
 * Regra de tom, e não de código: **nunca marcar em vermelho o que a pessoa ainda não terminou
 * de digitar**, que é transformar preenchimento em repreensão. Item pendente fica no
 * secundário; item cumprido ganha o ✓ dourado e sobe para o texto normal.
 */
export function ligarExigencias(
  input: HTMLInputElement,
  tema: "escuro" | "claro" = "escuro",
): HTMLUListElement {
  const claro = tema === "claro";
  const cor = {
    pendente: claro ? "#6D6D6D" : "#8FA398",
    cumprido: claro ? "#333333" : "#EDE6DD",
    borda: claro ? "#D6C3C2" : "#3C5346",
    marca: "#A98E4E",
    glifo: claro ? "#F7F5F2" : "#0A2B1E",
  };

  const ul = document.createElement("ul");
  ul.style.cssText =
    "list-style:none;padding:0;margin:-4px 0 16px;display:flex;flex-direction:column;gap:6px";

  const itens = EXIGENCIAS.map((e) => {
    const li = document.createElement("li");
    li.style.cssText =
      "display:flex;align-items:center;gap:8px;font-family:'Montserrat',system-ui,sans-serif;" +
      "font-size:11px;line-height:1.4;transition:color .18s ease";
    const marca = document.createElement("span");
    marca.textContent = "✓";
    marca.setAttribute("aria-hidden", "true");
    marca.style.cssText =
      "width:13px;height:13px;flex:0 0 13px;border-radius:50%;display:grid;place-items:center;" +
      "font-size:8px;font-weight:800;transition:all .18s ease";
    const texto = document.createElement("span");
    texto.textContent = e.curto;
    li.append(marca, texto);
    ul.append(li);
    return { li, marca, ok: e.ok };
  });

  const pintar = () => {
    for (const it of itens) {
      const cumprido = it.ok(input.value);
      it.li.style.color = cumprido ? cor.cumprido : cor.pendente;
      it.marca.style.border = cumprido ? `1.5px solid ${cor.marca}` : `1.5px solid ${cor.borda}`;
      it.marca.style.background = cumprido ? cor.marca : "transparent";
      it.marca.style.color = cumprido ? cor.glifo : "transparent";
      // O leitor de tela anuncia a mudança de estado; o ✓ sozinho é decoração.
      it.li.setAttribute("aria-label", `${it.li.textContent}: ${cumprido ? "cumprido" : "falta"}`);
    }
  };

  input.addEventListener("input", pintar);
  pintar();
  return ul;
}

/**
 * Padrão 5 do DESIGN.md §3: confirmação de ação irreversível.
 *
 * Substitui o `window.confirm`, que é cinza do sistema, não diz o que está em jogo e aparece
 * no momento mais tenso da jornada (o envio da prova, tentativa única). Devolve `true` para
 * confirmado e `false` para cancelado, inclusive por Esc e por clique fora.
 *
 * `<dialog>` nativo com `showModal()`, e não div com overlay à mão, porque a plataforma já
 * entrega o que essa div exigiria escrever: camada superior acima de qualquer `z-index`,
 * backdrop, foco preso dentro do diálogo, Esc para fechar e devolução do foco ao elemento
 * que abriu.
 *
 * TRÊS DECISÕES QUE PARECEM DETALHE E NÃO SÃO:
 *
 * 1. O diálogo é anexado ao `document.body`, não ao markup da tela. Toda tela do projeto é
 *    HTML portado injetado, e o CSS gerado pelo porte não deve alcançar este componente.
 * 2. `position:fixed` e `margin:auto` vão INLINE. A centralização de `dialog:modal` vem da
 *    folha do navegador, e basta uma regra da página pôr `position:relative` no `dialog` para
 *    ele cair no fluxo normal: o backdrop aparece, o diálogo sai do viewport e o console fica
 *    limpo, sem sintoma nenhum para depurar. Estilo inline ganha de folha e fecha essa porta.
 * 3. O foco nasce no botão SEGURO (cancelar). `showModal()` foca o primeiro focável, e num
 *    diálogo de ação irreversível isso não pode ser o botão que destrói: Enter reflexo tem que
 *    cair em "voltar", não em "enviar".
 */

const CONFIRMA_ID = "ei-confirma-backdrop";

/** `::backdrop` não aceita estilo inline; é a única razão desta folha existir. */
function garantirBackdrop(): void {
  if (document.getElementById(CONFIRMA_ID)) return;
  const s = document.createElement("style");
  s.id = CONFIRMA_ID;
  s.textContent = "dialog.ei-confirma::backdrop{background:rgba(11,45,32,.55)}";
  document.head.append(s);
}

export function confirmar(opts: {
  titulo: string;
  corpo: string;
  confirmar: string;
  cancelar: string;
  /**
   * Trecho do `corpo` que recebe negrito. Encontrado por busca de substring e embrulhado com
   * nós de texto, como o `link` do `pintarCaixa`: o corpo pode carregar número vindo do
   * servidor, e destaque não é motivo para abrir `innerHTML`.
   */
  destaque?: string;
  /** Conteúdo opcional entre o corpo e os botões — a grade de questões da prova entra aqui. */
  extra?: HTMLElement;
}): Promise<boolean> {
  garantirBackdrop();

  const dlg = document.createElement("dialog");
  dlg.className = "ei-confirma";
  dlg.style.cssText =
    "position:fixed;margin:auto;border:1px solid #E4DACC;border-radius:12px;padding:26px 26px 22px;" +
    "background:#fff;color:#333333;width:min(520px,calc(100vw - 40px));max-height:calc(100vh - 80px);" +
    "box-shadow:0 24px 60px rgba(11,45,32,.28);font-family:'Montserrat',system-ui,sans-serif";

  const h = document.createElement("h2");
  h.id = "ei-confirma-titulo";
  h.textContent = opts.titulo;
  h.style.cssText =
    "font-family:'Playfair Display',Georgia,serif;font-weight:600;font-size:21px;line-height:1.3;" +
    "color:#0B2D20;margin:0 0 10px";
  dlg.setAttribute("aria-labelledby", h.id);

  const p = document.createElement("p");
  p.textContent = opts.corpo;
  p.style.cssText = "font-size:13.5px;line-height:1.6;color:#333333;margin:0 0 18px";
  if (opts.destaque) {
    const corte = opts.corpo.indexOf(opts.destaque);
    // Trecho ausente da frase: fica sem negrito, em vez de sumir do corpo.
    if (corte >= 0) {
      const forte = document.createElement("strong");
      forte.textContent = opts.destaque;
      forte.style.fontWeight = "700";
      p.textContent = opts.corpo.slice(0, corte);
      p.append(forte, opts.corpo.slice(corte + opts.destaque.length));
    }
  }

  const acoes = document.createElement("div");
  acoes.style.cssText = "display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap";

  const cancelar = document.createElement("button");
  cancelar.type = "button";
  cancelar.textContent = opts.cancelar;
  cancelar.autofocus = true;
  cancelar.style.cssText =
    "border-radius:6px;font-family:inherit;font-weight:700;font-size:12.5px;padding:12px 20px;" +
    "cursor:pointer;background:#fff;border:1px solid #D6C3C2;color:#565049";

  const ok = document.createElement("button");
  ok.type = "button";
  ok.textContent = opts.confirmar;
  ok.style.cssText =
    "border:none;border-radius:6px;font-family:inherit;font-weight:700;font-size:12.5px;" +
    "letter-spacing:.06em;padding:13px 24px;cursor:pointer;color:#0A2B1E;" +
    "background:linear-gradient(160deg,#D9BE85,#A98E4E);box-shadow:0 8px 20px rgba(169,142,78,.3)";

  acoes.append(cancelar, ok);
  dlg.append(h, p);
  if (opts.extra) dlg.append(opts.extra);
  dlg.append(acoes);
  document.body.append(dlg);

  return new Promise<boolean>((resolve) => {
    let decidido = false;
    const fechar = (valor: boolean) => {
      if (decidido) return;
      decidido = true;
      resolve(valor);
      dlg.close();
    };
    cancelar.addEventListener("click", () => fechar(false));
    ok.addEventListener("click", () => fechar(true));
    // Clique no backdrop: o alvo do evento é o próprio dialog, porque o miolo está nos filhos.
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) fechar(false);
    });
    // Esc dispara `close` sem passar por nenhum handler acima; e é aqui que o nó sai do DOM,
    // em qualquer caminho de saída.
    dlg.addEventListener("close", () => {
      if (!decidido) {
        decidido = true;
        resolve(false);
      }
      dlg.remove();
    });
    dlg.showModal();
  });
}

/**
 * Botão em trabalho: o rótulo vira o verbo no gerúndio, o botão desabilita e anuncia
 * `aria-busy`. Devolve a função que restaura tudo, para o `finally` de quem chamou.
 *
 * Trocar o RÓTULO, e não só esmaecer, porque opacidade sozinha é indistinguível de "o
 * clique não pegou" (foi o achado do certificado no `FEEDBACK-UX.md`). Sem spinner: o
 * DESIGN.md §2 reserva movimento ao glow da oferta, e um giro novo aqui brigaria com isso.
 * A largura do botão é travada antes da troca para a tela não pular quando o texto encolhe.
 */
export function emTrabalho(
  el: HTMLButtonElement | HTMLAnchorElement | null,
  rotulo: string,
): () => void {
  if (!el) return () => {};
  const botao = el instanceof HTMLButtonElement;
  const antes = {
    texto: el.textContent,
    largura: el.style.width,
    opacidade: el.style.opacity,
    ponteiro: el.style.pointerEvents,
  };
  el.style.width = `${el.getBoundingClientRect().width}px`;
  el.textContent = rotulo;
  el.setAttribute("aria-busy", "true");
  el.style.opacity = "0.7";
  // Link não tem `disabled`: barrar o segundo clique exige apagar o ponteiro e dizer ao
  // leitor de tela que o controle está indisponível.
  if (botao) el.disabled = true;
  else {
    el.style.pointerEvents = "none";
    el.setAttribute("aria-disabled", "true");
  }
  return () => {
    el.textContent = antes.texto;
    el.style.width = antes.largura;
    el.style.opacity = antes.opacidade;
    el.removeAttribute("aria-busy");
    if (botao) el.disabled = false;
    else {
      el.style.pointerEvents = antes.ponteiro;
      el.removeAttribute("aria-disabled");
    }
  };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { semMovimento } from "./Entrada";

/** Onde o vídeo está: no palco, fixo no canto da tela, ou fechado pelo aluno até ele subir de novo. */
export type EstadoDoVideo = "palco" | "fixo" | "dispensado";

/** O "Na aula, 12:34" pede o vídeo de volta com este evento, disparado na vaga (ver `NaAula.tsx`). */
export const REABRIR_VIDEO = "sl-video-reabrir";

/** Fração da vaga ainda visível abaixo da qual o vídeo sai do palco e fica fixo. */
const LIMIAR = 0.25;

/** A duração da saída ao fechar, igual à do CSS (`sl-vf-sai`). */
const SAIDA_MS = 200;

/**
 * O vídeo que acompanha a leitura (08/out/2026). Pedido do dono: rolando o notebook, o vídeo fica
 * preso no alto da tela, menor, para o aluno ler enquanto escuta a aula.
 *
 * O IFRAME NÃO SAI DO LUGAR NO DOM. Mover um iframe de pai recarrega o player do Panda e para a aula
 * no meio. Por isso a peça tem duas caixas:
 *
 * - a VAGA (`.sl-palco-player`, com `id="player"` e `data-player-aula`) fica sempre no palco, com a
 *   altura 16:9 reservada por CSS. Quando o vídeo sai dela, a página não pula;
 * - a CAIXA (`.sl-vf-caixa`), dentro da vaga, é a que leva o player. No modo fixo ela só ganha
 *   `position: fixed` e outra largura, por classe. Nada é desmontado nem movido.
 *
 * QUEM DECIDE É UM IntersectionObserver SOBRE A VAGA, descontada a barra do topo (`--sl-topo`, lida
 * do CSS para o número morar num lugar só). Com menos de um quarto da vaga à vista e a vaga acima da
 * tela, o vídeo fica fixo; com a vaga de volta, volta ao palco. A vaga não muda de tamanho quando a
 * caixa sai, então a decisão não realimenta a si mesma e não há tremor na fronteira.
 *
 * Os dois botões do modo fixo: fechar (a caixa volta para a vaga, lá em cima, e só flutua de novo
 * depois que o aluno subir até o palco) e voltar ao palco (rola ao topo). O vídeo continua tocando
 * nos dois casos. O modo fixo não prende o foco: os botões estão na ordem normal do teclado, e o
 * foco que estava neles vai para a vaga (sem rolar), em vez de se perder com o botão que some.
 *
 * Vale igual para o iframe do Panda e para o <video> de exemplo: a peça não sabe qual dos dois leva.
 * O desenho dos dois tamanhos mora em `sala.css` (seção "vídeo fixo ao rolar").
 */
export default function VideoFixo({ aula, titulo, children }: { aula: number; titulo: string; children: React.ReactNode }) {
  const vaga = useRef<HTMLDivElement>(null);
  const atual = useRef<EstadoDoVideo>("palco");
  const [estado, setEstado] = useState<EstadoDoVideo>("palco");
  // `voltou` liga a entrada suave da caixa na vaga, só quando ela vem do modo fixo (não no carregamento).
  const [voltou, setVoltou] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const relogio = useRef<number | undefined>(undefined);

  const mudar = useCallback((novo: EstadoDoVideo) => {
    if (atual.current === novo) return;
    setVoltou(atual.current === "fixo" && novo === "palco");
    atual.current = novo;
    setEstado(novo);
  }, []);

  useEffect(() => {
    const el = vaga.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const topo = parseFloat(getComputedStyle(el).getPropertyValue("--sl-topo")) || 0;
    const io = new IntersectionObserver(
      ([e]) => {
        const acima = e.boundingClientRect.top < (e.rootBounds?.top ?? topo);
        if (e.intersectionRatio < LIMIAR && acima) {
          if (atual.current === "palco") mudar("fixo");
        } else {
          mudar("palco");
        }
      },
      { rootMargin: `-${topo}px 0px 0px 0px`, threshold: [0, LIMIAR] },
    );
    io.observe(el);

    const reabrir = () => {
      if (atual.current === "dispensado") mudar("fixo");
    };
    el.addEventListener(REABRIR_VIDEO, reabrir);
    return () => {
      io.disconnect();
      el.removeEventListener(REABRIR_VIDEO, reabrir);
      window.clearTimeout(relogio.current);
    };
  }, [mudar]);

  /** O foco que estava num botão do modo fixo vai para a vaga, sem rolar a página até ela. */
  function guardarFoco() {
    vaga.current?.focus({ preventScroll: true });
  }

  function fechar() {
    guardarFoco();
    if (semMovimento()) return mudar("dispensado");
    setSaindo(true);
    relogio.current = window.setTimeout(() => {
      setSaindo(false);
      // Se o aluno subiu até o palco durante a saída, o vídeo já voltou para lá: nada a fechar.
      if (atual.current === "fixo") mudar("dispensado");
    }, SAIDA_MS);
  }

  function voltarAoPalco() {
    guardarFoco();
    window.scrollTo({ top: 0, behavior: semMovimento() ? "auto" : "smooth" });
  }

  const fixo = estado === "fixo";
  const classe = ["sl-vf-caixa", fixo && "is-fixo", fixo && saindo && "is-saindo", voltou && "is-volta"].filter(Boolean).join(" ");

  return (
    // `tabIndex={-1}`: a vaga recebe o foco dos botões que somem, mas não vira parada de Tab.
    <div ref={vaga} className="sl-palco-player" id="player" data-player-aula={aula} data-video={estado} tabIndex={-1}>
      <div className={classe}>
        {children}
        {/* Depois do player no DOM, e acima dele só pelo CSS (`order`): a barra entra e sai sem
            encostar no nó do iframe. */}
        {fixo && (
          <div className="sl-vf-barra">
            <p className="sl-vf-titulo">
              <span className="sl-num">Aula {String(aula).padStart(2, "0")}</span> {titulo}
            </p>
            <button type="button" className="sl-vf-botao" onClick={voltarAoPalco} aria-label="Voltar ao vídeo no topo da página" title="Voltar ao topo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V6M6.5 11.5L12 6l5.5 5.5" />
              </svg>
            </button>
            <button type="button" className="sl-vf-botao" onClick={fechar} aria-label="Fechar o vídeo fixo" title="Fechar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

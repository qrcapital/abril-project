"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { enviarProva, responder } from "../../actions";
import { formatarTempo, fraseEmBranco, resumoProva, trechoEmBranco } from "@/lib/prova-correcao";
import { confirmar, emTrabalho, pintarCaixa } from "@/app/app/_ui/feedback";

// Minutos em que o aluno é avisado. Tentativa única e 120 minutos: quem está concentrado numa
// questão não olha para o relógio, e o zero vira envio automático sem preparo nenhum.
const AVISOS_MIN = [10, 5];

// Pill âmbar do cronômetro em contagem final. Mesmo par do módulo deficitário no resultado
// (DESIGN.md §2): cor como informação, não como decoração, e 5,71:1 de contraste.
const TIMER_ALERTA = "background:#F7E3BE;color:#7A4E06;padding:2px 12px;border-radius:999px";

// Estilos de alternativa selecionada/não. Os mesmos do `lib/prova-template.ts`, que
// pinta o estado inicial no servidor; aqui só repintamos no clique.
const ALT_BASE =
  "display:flex;align-items:center;gap:14px;padding:15px 18px;border-radius:10px;cursor:pointer;margin-bottom:10px;transition:all .14s ease";
const ALT_OFF = `${ALT_BASE};border:1.5px solid #E4DACC;background:#fff`;
const ALT_ON = `${ALT_BASE};border:1.5px solid #A98E4E;background:#FBF6EC`;
const BOLA_BASE =
  "width:26px;height:26px;flex:0 0 auto;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700";
const BOLA_OFF = `${BOLA_BASE};border:1.5px solid #C9BCA8;color:#7E6836`;
const BOLA_ON = `${BOLA_BASE};border:1.5px solid #A98E4E;background:#A98E4E;color:#fff`;

/**
 * Prova — uma questão. O servidor já entrega a tela pintada (enunciado, alternativas,
 * resposta anterior, contadores, cronômetro), então aqui fica só o comportamento:
 *
 * - clique numa alternativa: repinta na hora e grava pela server action. Se a gravação
 *   falhar, desfaz a pintura, porque uma resposta que parece salva e não está é pior
 *   que uma que visivelmente não entrou;
 * - cronômetro regressivo a partir do `deadline` do banco, não de storage local: fechar
 *   a aba, trocar de navegador ou dar refresh não devolve tempo;
 * - zerado o tempo, envia sozinho, e o servidor corrige o que houver respondido;
 * - "Enviar prova" na última questão, com confirmação, porque a tentativa é única.
 */
/**
 * A grade de questões do diálogo de envio: um botão por posição, respondida ou em branco,
 * clicável para ir direto à questão.
 *
 * Reusa as bolinhas de alternativa (`BOLA_ON`/`BOLA_OFF`): respondida é a bolinha dourada
 * cheia, em branco é a de contorno. Nenhuma cor nova entra por isto, e a diferença entre os
 * dois estados é preenchimento contra contorno, não só matiz, que é o que faz a grade
 * funcionar para quem não distingue as duas cores. O `aria-label` diz o estado por extenso,
 * porque o número sozinho não o carrega.
 *
 * **Dez por linha, fixo.** Com 20 questões dá duas fileiras de dez, que se leem como dezenas.
 * O `auto-fill` da primeira versão quebrava em 11 e 9 conforme a largura sobrava, o que não
 * tem leitura nenhuma.
 *
 * **Sem marca de questão atual.** A grade só abre pelo botão de envio, que só existe na última
 * questão, então "atual" seria sempre a última: constante, e portanto sem informação. O anel
 * saiu junto com o `aria-current` na revisão do Pedro em 30/jul.
 */
function montarGrade(
  total: number,
  respondidas: Set<number>,
  ir: (posicao: number) => void,
): HTMLElement {
  const grade = document.createElement("div");
  grade.setAttribute("role", "group");
  grade.setAttribute("aria-label", "Questões da prova");
  grade.style.cssText =
    "display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:8px;margin:0 0 20px";

  for (let p = 1; p <= total; p++) {
    const respondida = respondidas.has(p);
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = String(p);
    // `BOLA_ON` pinta o glifo em BRANCO, que sobre o dourado `#A98E4E` dá 3,15:1 e falha AA.
    // Na alternativa isso passa porque o texto ao lado carrega o sentido e a letra é quase
    // decoração; aqui o NÚMERO é a única informação do chip, então ele troca para o verde
    // profundo (4,84:1), que é o mesmo par do botão dourado da plataforma. A declaração vem
    // depois da base de propósito: no mesmo `cssText`, a última ganha.
    b.style.cssText =
      `${respondida ? BOLA_ON : BOLA_OFF};width:100%;height:38px;border-radius:8px;` +
      "font-family:inherit;cursor:pointer;transition:all .14s ease" +
      (respondida ? ";color:#0A2B1E" : "");
    b.setAttribute(
      "aria-label",
      `Questão ${p}, ${respondida ? "respondida" : "em branco"}`,
    );
    b.addEventListener("click", () => ir(p));
    grade.append(b);
  }
  return grade;
}

export default function QuizClient({
  html,
  posicao,
  total,
  restanteMs,
  respondidasPos,
}: {
  html: string;
  posicao: number;
  total: number;
  restanteMs: number;
  /** Posições já gravadas no banco. O estado da questão ATUAL é lido da tela, não daqui. */
  respondidasPos: number[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const enviandoRef = useRef(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ac = new AbortController();
    const on = (el: Element, ev: string, fn: (e: Event) => void) =>
      el.addEventListener(ev, fn, { signal: ac.signal });

    const spans = [...root.querySelectorAll<HTMLElement>("span")];
    const timerEl = spans.find((s) => /^\d+:\d{2}$/.test((s.textContent || "").trim()));
    const respEl = spans.find((s) => /respondidas$/.test((s.textContent || "").trim()));
    const alts = [...root.querySelectorAll<HTMLElement>("[data-alt]")];

    const pintar = (escolhida: string | null) => {
      alts.forEach((a) => {
        const sel = a.dataset.alt === escolhida;
        const bola = a.firstElementChild as HTMLElement | null;
        a.setAttribute("style", sel ? ALT_ON : ALT_OFF);
        bola?.setAttribute("style", sel ? BOLA_ON : BOLA_OFF);
      });
    };

    const atual = () => alts.find((a) => a.getAttribute("style") === ALT_ON)?.dataset.alt ?? null;

    alts.forEach((a) =>
      on(a, "click", async () => {
        const letra = a.dataset.alt;
        if (!letra) return;
        const anterior = atual();
        if (letra === anterior) return;

        const eraPrimeira = anterior === null;
        pintar(letra);
        if (eraPrimeira && respEl) {
          const n = Number((respEl.textContent || "").match(/\d+/)?.[0] ?? 0);
          respEl.textContent = `${n + 1} respondidas`;
        }

        const r = await responder(posicao, letra);
        if (!r.ok) {
          pintar(anterior);
          if (eraPrimeira && respEl) {
            const n = Number((respEl.textContent || "").match(/\d+/)?.[0] ?? 1);
            respEl.textContent = `${Math.max(0, n - 1)} respondidas`;
          }
          setErro(r.erro);
        } else {
          setErro(null);
        }
      }),
    );

    const enviar = async (automatico: boolean) => {
      if (enviandoRef.current) return;

      if (!automatico) {
        // O servidor só sabe do que existia na carga da página, e a questão atual pode ter
        // sido respondida (ou trocada) depois disso. Por isso o estado dela sai da tela.
        const respondidas = new Set(respondidasPos);
        if (atual()) respondidas.add(posicao);
        else respondidas.delete(posicao);

        const { emBranco } = resumoProva(total, [...respondidas]);
        const decidiu = await confirmar({
          titulo: "Enviar a prova?",
          corpo:
            emBranco > 0
              ? `${fraseEmBranco(emBranco)} Questão em branco conta como erro. A tentativa é ` +
                "única: depois do envio não dá para voltar."
              : `${fraseEmBranco(emBranco)} A tentativa é única: depois do envio não dá para voltar.`,
          confirmar: "Enviar prova",
          cancelar: "Voltar para a prova",
          destaque: emBranco > 0 ? trechoEmBranco(emBranco) : undefined,
          // Clicar numa questão navega; o `cleanup` do efeito fecha o diálogo na desmontagem,
          // então não é preciso fechá-lo aqui à mão.
          extra: montarGrade(total, respondidas, (p) => {
            if (p !== posicao) router.push(`/app/prova/questao/${p}`);
          }),
        });
        if (!decidiu) return;
      }

      enviandoRef.current = true;
      // O envio é ida ao servidor no clique mais tenso da jornada. Sem isto o botão fica
      // parado e o aluno não sabe se pegou (padrão 3 do DESIGN.md §3).
      const restaurar = automatico ? () => {} : emTrabalho(next ?? null, "Enviando...");
      const r = await enviarProva();
      if (r.ok) router.push("/app/prova/resultado");
      else {
        enviandoRef.current = false;
        restaurar();
        setErro(r.erro);
      }
    };

    const buttons = [...root.querySelectorAll("button")];
    const prev = buttons.find((b) => (b.textContent || "").trim().startsWith("←"));
    const next = buttons.find((b) => /Próxima|→|Enviar prova/.test(b.textContent || ""));

    if (prev) {
      if (posicao <= 1) {
        prev.disabled = true;
        prev.style.opacity = "0.4";
        prev.style.cursor = "not-allowed";
      }
      on(prev, "click", () => {
        if (posicao > 1) router.push(`/app/prova/questao/${posicao - 1}`);
      });
    }
    if (next) {
      on(next, "click", () => {
        if (posicao < total) router.push(`/app/prova/questao/${posicao + 1}`);
        else void enviar(false);
      });
    }

    // Caixa do aviso de tempo, no topo da questão: acima do enunciado, onde o olho já está,
    // e fora do cabeçalho, para não desarrumar a linha do cronômetro.
    const kicker = spans.find((s) => /^Questão \d+$/.test((s.textContent || "").trim()));
    const avisoBox = document.createElement("div");
    avisoBox.hidden = true;
    avisoBox.style.margin = "0 0 22px";
    kicker?.before(avisoBox);

    // Avisa uma vez por limiar. A frase diz o que ACONTECE no zero, e não só quanto falta:
    // saber que o respondido é enviado tira o pânico de perder tudo.
    let avisado = 0;
    const avisarTempo = (min: number) => {
      if (avisado === min) return;
      avisado = min;
      pintarCaixa(
        avisoBox,
        "aviso",
        `Faltam ${min} minutos. Quando o tempo zerar, a prova é enviada com o que estiver respondido.`,
        "claro",
      );
      if (timerEl) timerEl.style.cssText += `;${TIMER_ALERTA}`;
    };

    // Cronômetro: conta a partir do instante em que a página foi servida, sempre
    // ancorado no deadline do banco.
    const fim = Date.now() + restanteMs;
    const tick = () => {
      const rem = Math.max(0, fim - Date.now());
      if (timerEl) timerEl.textContent = formatarTempo(rem);
      // Do menor para o maior: quem abre a questão já com 4 minutos vê o aviso de 5, não o
      // de 10, e quem cruza o de 10 recebe o de 5 depois.
      for (const min of [...AVISOS_MIN].sort((a, b) => a - b)) {
        if (rem <= min * 60_000) {
          avisarTempo(min);
          break;
        }
      }
      if (rem <= 0) {
        clearInterval(iv);
        void enviar(true);
      }
    };
    tick();
    const iv = setInterval(tick, 1000);

    return () => {
      clearInterval(iv);
      ac.abort();
      // O diálogo mora no `document.body`, fora do React: navegar não o desmonta. Fechá-lo
      // aqui cobre os dois jeitos de sair com ele aberto — pular para outra questão pela
      // grade, e o cronômetro zerar enquanto o aluno hesita na confirmação.
      document
        .querySelectorAll<HTMLDialogElement>("dialog.ei-confirma")
        .forEach((d) => d.close());
    };
  }, [router, posicao, total, restanteMs, respondidasPos]);

  return (
    <>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      {erro && (
        <p
          role="alert"
          style={{
            maxWidth: 820,
            margin: "0 auto 40px",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid rgba(176,65,62,.35)",
            background: "rgba(176,65,62,.06)",
            color: "#b0413e",
            fontFamily: "'Montserrat',system-ui,sans-serif",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          {erro}
        </p>
      )}
    </>
  );
}

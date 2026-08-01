"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import contato from "@/lib/contato.json";

/** O que o modal está dizendo. `null` = fechado. */
type Aviso = {
  titulo: string;
  corpo: React.ReactNode;
  /** Botão dourado opcional, além do "Entendi". */
  acao?: { rotulo: string; ir: () => void };
};

/**
 * Home da área (vitrine).
 *
 * **O cliente não conhece mais o currículo.** Ele recebe prontos os destinos de cada cartão, o
 * do "continuar" e os dois números do gate da prova. Antes importava cinco funções de
 * `lib/curso`, que passou a depender do banco em 29/jul e não pode ser lido daqui.
 *
 * - cards de módulo → primeira aula do módulo, se o módulo já abriu;
 * - card de 2ª chamada (só existe se um admin liberou) → /app/prova, direto;
 * - card da Prova Final → roteia pelo `data-prova`: reprovado abre o WhatsApp (tentativa única, não
 *   há para onde ir no produto), aprovado vai ao certificado, bloqueada abre o modal, o resto vai
 *   para /app/prova;
 * - "Continuar" → aula atual.
 * Delegação de evento (sobrevive à re-render ao abrir/fechar o modal).
 *
 * `travado` chega do servidor quando o aluno tentou uma aula de módulo ainda fechado e foi
 * devolvido para cá. A guarda que redireciona está na página da aula; esta prop carrega só a
 * **explicação**, porque bounce sem motivo é o pior tipo de bloqueio: o aluno acha que clicou
 * errado. O servidor confere a trava no banco antes de mandar a mensagem, então um `?travado=`
 * digitado à mão para um módulo já aberto não abre modal nenhum.
 */
export default function HomeClient({
  html,
  destinos,
  destinoAtual,
  provaLiberada,
  restantes,
  travado,
}: {
  html: string;
  /** Para onde cada cartão de módulo leva, na ordem deles. */
  destinos: string[];
  /** Destino do "Continuar de onde parou". */
  destinoAtual: string;
  provaLiberada: boolean;
  restantes: number;
  travado?: { label: string; dias: number; data: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Módulo fechado já é sabido na renderização, então o modal nasce aberto em vez de ser
  // aberto por efeito: efeito que chama setState logo de cara provoca renderização em cascata,
  // e o lint reclama com razão.
  const [aviso, setAviso] = useState<Aviso | null>(() =>
    travado
      ? {
          titulo: `${travado.label} ainda não abriu`,
          corpo: (
            <>
              O curso é liberado um módulo por semana. Este abre{" "}
              <b style={{ color: "#7E6836" }}>
                {travado.dias === 1 ? "amanhã" : `em ${travado.dias} dias`}
              </b>
              , no dia {travado.data}. Seu acesso às aulas já liberadas continua normal.
            </>
          ),
          acao: {
            rotulo: "Continuar de onde parei",
            ir: () => router.push(destinoAtual),
          },
        }
      : null,
  );

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const irParaAtual = () => router.push(destinoAtual);

    const onClick = (e: Event) => {
      const target = e.target as Element;
      const card = target.closest<HTMLElement>(".mcard");
      if (card) {
        // Cartão de módulo fechado não navega: a guarda do servidor devolveria para cá, e o
        // ida e volta pareceria defeito. O próprio card já diz quando abre.
        if (card.dataset.travado === "1") return;
        const i = [...root.querySelectorAll<HTMLElement>(".mcard")].indexOf(card);
        if (i >= 0 && i < destinos.length) return router.push(destinos[i]);
        // O card de 2ª chamada vem antes do da prova e cai no mesmo teste de texto ("tentativa nova
        // da prova final"), então ele é tratado ANTES e por atributo, não por texto: sem isto, ele
        // dependeria do gate de 16/16 que o aluno já cumpriu e daria no mesmo, mas por coincidência.
        if (card.dataset.segunda === "1") return router.push("/app/prova");

        // O CARD DA PROVA FINAL ROTEIA POR ESTADO, e o estado vem em `data-prova` do servidor. Antes
        // ele só sabia duas coisas (liberada ou não) e mandava todo mundo para /app/prova.
        //
        // O caso do reprovado é o que o Pedro pediu em 31/jul: a prova é de tentativa única, então
        // depois de reprovar não existe para onde clicar dentro do produto. Em vez de levar a uma tela
        // que devolve, o clique abre o WhatsApp, que é o único caminho real. `noopener` porque abrir
        // aba externa sem ele dá acesso ao nosso `window` para a página de destino.
        const prova = card.dataset.prova;
        if (prova === "reprovado") {
          window.open(contato.whatsapp, "_blank", "noopener");
          return;
        }
        if (prova === "aprovado") return router.push("/app/certificado");
        if (prova && prova !== "bloqueada") return router.push("/app/prova");

        if (/Prova|Certifica/i.test(card.textContent || "")) {
          if (provaLiberada) return router.push("/app/prova");
          setAviso({
            titulo: "Prova Final ainda bloqueada",
            corpo: (
              <>
                Conclua as 16 aulas da formação para liberar a Prova Final.{" "}
                {restantes > 0 && (
                  <>
                    Falta{restantes > 1 ? "m" : ""}{" "}
                    <b style={{ color: "#7E6836" }}>
                      {restantes} aula{restantes > 1 ? "s" : ""}
                    </b>
                    .
                  </>
                )}
              </>
            ),
            acao: { rotulo: "Continuar de onde parei", ir: irParaAtual },
          });
        }
        return;
      }
      const btn = target.closest("button");
      if (btn && /Continuar|Começar/i.test(btn.textContent || "")) return irParaAtual();
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [router, destinos, destinoAtual, provaLiberada, restantes]);

  useEffect(() => {
    if (!aviso) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAviso(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aviso]);

  return (
    <>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      {aviso && <Modal aviso={aviso} fechar={() => setAviso(null)} />}
    </>
  );
}

/**
 * Modal de bloqueio da home. Nasceu para a prova e passou a servir também o módulo fechado em
 * 29/jul; o que muda entre os dois é o texto, não a peça, então virou componente em vez de uma
 * segunda cópia de oitenta linhas de JSX.
 */
function Modal({ aviso, fechar }: { aviso: Aviso; fechar: () => void }) {
  return (
    <div
      onClick={fechar}
      role="dialog"
      aria-modal="true"
      aria-label={aviso.titulo}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(8,31,22,.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          borderTop: "3px solid #A98E4E",
          maxWidth: 420,
          width: "100%",
          padding: "34px 32px 28px",
          textAlign: "center",
          boxShadow: "0 30px 70px rgba(0,0,0,.35)",
          fontFamily: "'Montserrat',system-ui,sans-serif",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            margin: "0 auto 18px",
            borderRadius: "50%",
            background: "rgba(169,142,78,.12)",
            border: "1px solid rgba(169,142,78,.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A98E4E" strokeWidth="1.6">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 21,
            fontWeight: 600,
            color: "#0B2D20",
            margin: "0 0 8px",
          }}
        >
          {aviso.titulo}
        </h3>
        <p style={{ fontSize: 13.5, color: "#565049", lineHeight: 1.6, margin: "0 0 22px" }}>
          {aviso.corpo}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {aviso.acao && (
            <button
              onClick={aviso.acao.ir}
              style={{
                border: "none",
                borderRadius: 8,
                padding: "13px",
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: ".04em",
                cursor: "pointer",
                background: "linear-gradient(160deg,#D9BE85,#A98E4E)",
                color: "#0A2B1E",
                boxShadow: "0 6px 16px rgba(169,142,78,.26)",
              }}
            >
              {aviso.acao.rotulo}
            </button>
          )}
          <button
            onClick={fechar}
            style={{
              border: "1px solid #E4DACC",
              borderRadius: 8,
              padding: "12px",
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              background: "#fff",
              color: "#565049",
            }}
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

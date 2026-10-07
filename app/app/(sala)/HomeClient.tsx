"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/** Onde o `home.html` é partido para o React pôr o miolo (ver a prop `meio`). */
const MEIO = "<!-- sala:meio -->";

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
 * do "continuar" e os números da conclusão. Antes importava cinco funções de `lib/curso`, que
 * passou a depender do banco em 29/jul e não pode ser lido daqui.
 *
 * - cards de módulo → página do módulo, se o módulo já abriu;
 * - card do certificado → a tela do certificado quando ele existe (ou quando todas as aulas já
 *   estão concluídas, e a tela emite no resgate); senão, o modal com quantas aulas faltam. Até
 *   30/set/2026 era o card da Prova Final, com seis estados e o WhatsApp do reprovado;
 * - "Continuar" → aula atual, no teatro da página do módulo dela.
 * Delegação de evento (sobrevive à re-render ao abrir/fechar o modal).
 *
 * `travado` chega do servidor quando a URL traz `?travado=<ord>`. Até 30/set/2026 era a página da
 * aula que devolvia para cá; hoje a página do módulo fechado mostra o aviso ela mesma, e o parâmetro
 * sobrevive para links antigos. Esta prop carrega só a **explicação**, porque bounce sem motivo é o pior tipo de bloqueio: o aluno acha que clicou
 * errado. O servidor confere a trava no banco antes de mandar a mensagem, então um `?travado=`
 * digitado à mão para um módulo já aberto não abre modal nenhum.
 */
export default function HomeClient({
  html,
  destinos,
  destinoAtual,
  certificadoEmitido,
  restantes,
  totalAulas,
  travado,
  meio,
}: {
  html: string;
  /**
   * O que entra entre o banner e a prateleira: a trilha, que é componente de servidor. O HTML é partido no marcador `<!-- sala:meio -->` de `home.html`.
   * Nada ali pode usar a classe `mcard`: o clique dos cartões é resolvido pela POSIÇÃO entre os
   * `.mcard`, e um a mais deslocaria o destino de todos.
   */
  meio?: React.ReactNode;
  /** Para onde cada cartão de módulo leva, na ordem deles. */
  destinos: string[];
  /** Destino do "Continuar de onde parou". */
  destinoAtual: string;
  /** Já existe linha em `certificates` para este aluno. Vem do banco, nunca da URL. */
  certificadoEmitido: boolean;
  /** Aulas que contam para o certificado e ainda não foram concluídas. */
  restantes: number;
  /** Total de aulas que contam para o certificado (`conta_no_gate`): a copy acompanha o admin. */
  totalAulas: number;
  /**
   * `dias`/`data` nulos = fechado sem data: em breve (política, 0016), ou esperando a conclusão
   * de outro módulo, e então `apos` traz o rótulo dele ("Módulo I", regra `apos_modulo`, 0024).
   */
  travado?: { label: string; dias: number | null; data: string | null; apos: string | null };
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
          // Três casos. Esperando outro módulo (`apos_modulo`): diz qual concluir, que é a única
          // coisa que o aluno pode fazer para abrir. Sem data (em breve): não inventa prazo, diz
          // que o conteúdo está a caminho. Com data: a contagem e o dia.
          corpo: travado.apos ? (
            <>
              Este módulo abre quando você concluir todas as aulas do{" "}
              <b style={{ color: "#7E6836" }}>{travado.apos}</b>. Seu acesso às aulas já
              liberadas continua normal.
            </>
          ) : travado.dias === null || travado.data === null ? (
            <>
              Este conteúdo está em preparação e será liberado em breve, sem data marcada.
              Seu acesso às aulas já liberadas continua normal.
            </>
          ) : (
            <>
              Este módulo abre{" "}
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

        // O CARD DO CERTIFICADO roteia pelo `data-certificado`, que vem do servidor, e não pelo
        // texto do card. Com todas as aulas concluídas ele também leva à tela, mesmo sem a linha no
        // banco: a tela emite no resgate, e mandar o aluno de volta às aulas seria dizer que falta
        // algo que ele já fez.
        if (card.dataset.certificado) {
          if (certificadoEmitido || restantes === 0) return router.push("/app/certificado");
          setAviso({
            titulo: "Certificado ainda não emitido",
            corpo: (
              <>
                O certificado sai quando você conclui as {totalAulas} aulas da formação, e chega também
                por e-mail.{" "}
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
  }, [router, destinos, destinoAtual, certificadoEmitido, restantes, totalAulas]);

  useEffect(() => {
    if (!aviso) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAviso(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aviso]);

  return (
    <>
      <div ref={ref}>
        {meio && html.includes(MEIO) ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: html.slice(0, html.indexOf(MEIO)) }} />
            {meio}
            <div dangerouslySetInnerHTML={{ __html: html.slice(html.indexOf(MEIO) + MEIO.length) }} />
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
      {aviso && <Modal aviso={aviso} fechar={() => setAviso(null)} />}
    </>
  );
}

/**
 * Modal de bloqueio da home. Nasceu para a prova (que saiu do curso em 30/set/2026), passou a
 * servir o módulo fechado em 29/jul e hoje serve também o certificado ainda não emitido; o que muda
 * entre eles é o texto, não a peça.
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
        background: "rgba(26,24,21,.6)",
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
          fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Inter','Helvetica Neue',system-ui,sans-serif",
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
            // Jost desde 07/out/2026, como os títulos da sala (sala.css).
            fontFamily: "'Jost',sans-serif",
            fontSize: 21,
            fontWeight: 500,
            color: "#1a1815",
            margin: "0 0 8px",
          }}
        >
          {aviso.titulo}
        </h3>
        <p style={{ fontSize: 13.5, color: "#6b655c", lineHeight: 1.6, margin: "0 0 22px" }}>
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
                fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Inter','Helvetica Neue',system-ui,sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: ".04em",
                cursor: "pointer",
                background: "#C1121F",
                color: "#fdfbf6",
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
              fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Inter','Helvetica Neue',system-ui,sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              background: "#fff",
              color: "#6b655c",
            }}
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

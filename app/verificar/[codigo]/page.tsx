import type { Metadata } from "next";

import { CURSO, HORAS, normalizarCodigo } from "@/lib/certificado";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Verificação de certificado",
  description: "Confirme a autenticidade de um certificado da formação Estratégia Internacional.",
  robots: { index: false, follow: false },
};

const meses = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

type Cert = { nome: string; codigo: string; emissao: Date };

/**
 * A verificação pública, agora contra o BANCO.
 *
 * Até 31/jul/2026 ela comparava com uma constante do código: um único código valia, e a tela mostrava
 * o nome que estava escrito ali ("Pedro Teixeira") para quem consultasse. Ou seja, a peça que existe
 * para um terceiro conferir era a que menos conferia.
 *
 * Chama a função `verify_certificate` com o cliente **anon**, e isso é o desenho, não um atalho: a
 * função é `security definer`, está concedida a `anon`, e devolve só nome, código e data. A tabela
 * `certificates` continua fechada, e nada aqui expõe `user_id`, e-mail ou nota. Página pública tem
 * que funcionar sem sessão, então a service role estaria errada por definição.
 *
 * O código é normalizado antes da consulta, porque ele chega **digitado de um PDF**: em minúsculas,
 * com espaço no lugar do hífen, ou sem o prefixo. Recusar por pontuação seria dizer "inválido" para
 * um certificado verdadeiro.
 */
async function buscar(entrada: string): Promise<Cert | null> {
  // Sem decodeURIComponent: o param do Next JÁ chega decodificado, e decodificar de novo
  // estourava URIError (500) para qualquer `%` malformado na URL, tipo `/verificar/EI%ZZ`.
  const codigo = normalizarCodigo(entrada);
  if (!codigo) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("verify_certificate", { p_codigo: codigo });
  if (error) {
    // Falha de leitura não pode virar "certificado inválido": isso acusaria de falso um documento
    // verdadeiro por causa de um problema nosso. Sem linha, a tela mostra o estado de não encontrado,
    // e o log guarda o motivo real.
    console.error("[verificar] falha ao consultar:", error.message);
    return null;
  }

  const linha = (data ?? [])[0] as
    | { nome: string | null; codigo: string; issued_at: string; valido: boolean }
    | undefined;
  if (!linha?.valido) return null;

  return {
    nome: (linha.nome ?? "").trim(),
    codigo: linha.codigo,
    emissao: new Date(linha.issued_at),
  };
}

export default async function VerificarPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const cert = await buscar(codigo);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(680px 360px at 82% 6%, rgba(169,142,78,.28), transparent 60%), linear-gradient(150deg,#123B2B,#0A2B1E 78%)",
        color: "#F7F5F2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 560, width: "100%" }}>
        {/* selo do curso */}
        <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 22px" }}>
          <img
            src="/app/dec6993b-f88c-4b38-a7bb-33d730441044.svg"
            alt="Selo Estratégia Internacional"
            style={{ width: 96, height: 96, display: "block", transform: "rotate(-38deg)" }}
          />
          <img
            src="/app/280505b4-fa9f-4519-b1d2-064fbb4ecad1.webp"
            alt=""
            style={{
              position: "absolute",
              top: "49%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 46,
              height: "auto",
            }}
          />
        </div>

        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: ".26em", fontSize: 20, color: "#F7F5F2" }}>
          ESTRATÉGIA
        </div>
        <div style={{ fontSize: 8.5, letterSpacing: ".42em", color: "#D9BE85", marginTop: 4, marginBottom: 34 }}>
          INTERNACIONAL
        </div>

        {cert ? (
          <div
            style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(217,190,133,.28)",
              borderRadius: 16,
              padding: "34px 34px 30px",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "rgba(31,138,91,.18)",
                border: "1px solid rgba(31,138,91,.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ED18C" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M8.3 12.3l2.4 2.4 5-5.4" />
              </svg>
            </div>
            <p style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#4ED18C", fontWeight: 700, margin: "0 0 12px" }}>
              Certificado válido
            </p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 600, margin: "0 0 14px", color: "#F7F5F2" }}>
              {/* Conta sem nome cadastrado existe (o backfill de 28/jul achou 3 de 8), e aqui o nome
                  é o ponto da consulta: dizer que falta o cadastro é mais honesto que uma linha em
                  branco no lugar de quem se formou. */}
              {cert.nome || "Aluno sem nome no cadastro"}
            </h1>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#C9D3CC", margin: "0 0 24px" }}>
              concluiu a formação <b style={{ color: "#F7F5F2" }}>{CURSO}</b>, com carga horária de{" "}
              <b style={{ color: "#F7F5F2" }}>{HORAS} horas</b>, emitido em{" "}
              {meses[cert.emissao.getMonth()]} de {cert.emissao.getFullYear()}.
            </p>
            <div style={{ borderTop: "1px solid rgba(217,190,133,.18)", paddingTop: 18 }}>
              <span style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "#8FA398" }}>
                Código de verificação
              </span>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#D9BE85", marginTop: 4 }}>{cert.codigo}</div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(176,65,62,.4)",
              borderRadius: 16,
              padding: "34px 34px 30px",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "rgba(176,65,62,.14)",
                border: "1px solid rgba(176,65,62,.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E0736F" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 600, margin: "0 0 12px", color: "#F7F5F2" }}>
              Certificado não encontrado
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#C9D3CC", margin: 0 }}>
              Não localizamos um certificado com o código{" "}
              <b style={{ color: "#F7F5F2" }}>{codigo}</b>. Confira o código informado no certificado e tente novamente.
            </p>
          </div>
        )}

        <p style={{ fontSize: 11.5, color: "#8FA398", marginTop: 24 }}>
          Verificação oficial · Estratégia Internacional
        </p>
      </div>
    </main>
  );
}

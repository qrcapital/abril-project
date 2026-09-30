import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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
 * As @font-face da Playfair Display, lidas do CSS da área do aluno. Esta rota fica fora de
 * `/app`, então o layout de lá não a alcança, e sem isto o nome e o código cairiam no Georgia.
 * `throw` se nada casar: certificado verificado na serifa errada é defeito que ninguém reporta.
 */
function fontesPlayfair(): string {
  const css = readFileSync(join(process.cwd(), "app", "app", "_ui", "styles.css"), "utf8");
  const faces = (css.match(/@font-face\s*\{[^}]*\}/g) ?? []).filter((f) => f.includes("Playfair"));
  if (!faces.length) throw new Error("[verificar] nenhuma @font-face da Playfair em app/app/_ui/styles.css");
  return faces.join("\n");
}

/**
 * A verificação pública, agora contra o BANCO.
 *
 * Até 31/jul/2026 ela comparava com uma constante do código: um único código valia, e a tela mostrava
 * o nome que estava escrito ali ("Pedro Teixeira") para quem consultasse. Ou seja, a peça que existe
 * para um terceiro conferir era a que menos conferia.
 *
 * Chama a função `verify_certificate` com o cliente **anon**, e isso é o desenho, não um atalho: a
 * função é `security definer`, está concedida a `anon`, e devolve só nome, código e data. A tabela
 * `certificates` continua fechada, e nada aqui expõe `user_id` ou e-mail. Página pública tem
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
        // Creme, e não o painel escuro de antes: quem abre esta página é quase sempre um terceiro
        // (um recrutador, um cliente) conferindo um documento, e a leitura tem de ser a de papel.
        background: "#f7f4ee",
        color: "#1a1815",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Helvetica Neue', system-ui, sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: fontesPlayfair() }} />
      <div style={{ textAlign: "center", maxWidth: 560, width: "100%" }}>
        {/* selo do curso */}
        <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 22px" }}>
          <img
            src="/app/dec6993b-f88c-4b38-a7bb-33d730441044.svg"
            alt="Selo Estratégia Internacional"
            style={{ width: 96, height: 96, display: "block", transform: "rotate(-38deg)" }}
          />
          <img
            src="/lp/f2070b29-906c-48d8-92c7-0948fe19573b.webp"
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

        {/* O lockup do site: marca da VEJA Negócios, filete em pé, nome do curso em duas linhas. */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 13, marginBottom: 34 }}>
          <img src="/marca/veja-negocios-claro.svg" alt="VEJA Negócios" style={{ height: 30, width: "auto", display: "block" }} />
          <i aria-hidden="true" style={{ display: "block", width: 1, height: 31, background: "rgba(26,24,21,.19)" }} />
          <span style={{ display: "block", fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", lineHeight: 1.22, textAlign: "left", whiteSpace: "nowrap" }}>
            Estratégia
            <br />
            Internacional
          </span>
        </div>

        {cert ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2dacd",
              borderRadius: 20,
              boxShadow: "0 12px 30px rgba(72,60,42,.1)",
              padding: "34px 34px 30px",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "rgba(27,122,80,.08)",
                border: "1px solid rgba(27,122,80,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B7A50" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M8.3 12.3l2.4 2.4 5-5.4" />
              </svg>
            </div>
            <p style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#1B7A50", fontWeight: 600, margin: "0 0 12px" }}>
              Certificado válido
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 600, margin: "0 0 14px", color: "#1a1815" }}>
              {/* Conta sem nome cadastrado existe (o backfill de 28/jul achou 3 de 8), e aqui o nome
                  é o ponto da consulta: dizer que falta o cadastro é mais honesto que uma linha em
                  branco no lugar de quem se formou. */}
              {cert.nome || "Aluno sem nome no cadastro"}
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#6b655c", margin: "0 0 24px" }}>
              concluiu todas as aulas da formação <b style={{ color: "#1a1815" }}>{CURSO}</b>, com carga
              horária de{" "}
              <b style={{ color: "#1a1815" }}>{HORAS} horas</b>, emitido em{" "}
              {meses[cert.emissao.getMonth()]} de {cert.emissao.getFullYear()}.
            </p>
            <div style={{ borderTop: "1px solid #e2dacd", paddingTop: 18 }}>
              <span style={{ fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#6f6860", fontWeight: 600 }}>
                Código de verificação
              </span>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#C1121F", marginTop: 4, letterSpacing: ".04em" }}>{cert.codigo}</div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(176,65,62,.32)",
              borderRadius: 20,
              boxShadow: "0 12px 30px rgba(72,60,42,.1)",
              padding: "34px 34px 30px",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "rgba(176,65,62,.08)",
                border: "1px solid rgba(176,65,62,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E3330" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 600, margin: "0 0 12px", color: "#1a1815" }}>
              Certificado não encontrado
            </h1>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#6b655c", margin: 0 }}>
              Não localizamos um certificado com o código{" "}
              <b style={{ color: "#1a1815" }}>{codigo}</b>. Confira o código informado no certificado e tente novamente.
            </p>
          </div>
        )}

        <p style={{ fontSize: 12, color: "#6f6860", marginTop: 24 }}>
          Verificação oficial · Estratégia Internacional
        </p>
      </div>
    </main>
  );
}

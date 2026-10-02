import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { CURSO, EMISSORES, HORAS, TEXTO, dataPorExtenso, normalizarCodigo } from "@/lib/certificado";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Verificação de certificado",
  description: "Confirme a autenticidade de um certificado da formação Estratégia Internacional.",
  robots: { index: false, follow: false },
};

type Cert = { nome: string; codigo: string; emitidoEm: string };

const SANS = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Helvetica Neue', system-ui, sans-serif";
const SERIF = "'Playfair Display', Georgia, serif";
const ROTULO = {
  display: "block",
  fontSize: 10.5,
  letterSpacing: ".16em",
  textTransform: "uppercase",
  color: "#6b655c",
  fontWeight: 600,
  marginBottom: 4,
} as const;

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
    emitidoEm: linha.issued_at,
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
        // Papel, e não o painel escuro de antes: quem abre esta página é quase sempre um terceiro
        // (um recrutador, um cliente) conferindo um documento, e a leitura tem de ser a de papel.
        background: "#f7f4ee",
        color: "#1a1815",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: SANS,
        fontVariantNumeric: "tabular-nums lining-nums",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: fontesPlayfair() }} />
      <div style={{ textAlign: "center", maxWidth: 600, width: "100%" }}>
        {/* O lockup do site e da folha do certificado: marca da VEJA Negócios, filete em pé, nome do
            curso em duas linhas. O selo antigo saiu com a identidade verde. */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 13, marginBottom: 30 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- logo em SVG, sem ganho no otimizador */}
          <img src="/marca/veja-negocios-claro.svg" alt="VEJA Negócios" style={{ height: 30, width: "auto", display: "block" }} />
          <i aria-hidden="true" style={{ display: "block", width: 1, height: 31, background: "rgba(26,24,21,.22)" }} />
          <span style={{ display: "block", fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", lineHeight: 1.22, textAlign: "left", whiteSpace: "nowrap" }}>
            Estratégia
            <br />
            Internacional
          </span>
        </div>

        {cert ? (
          <div
            style={{
              position: "relative",
              background: "#fdfbf6",
              border: "1px solid #a98e4e",
              borderRadius: 6,
              boxShadow: "0 22px 54px rgba(72,60,42,.12)",
              padding: "38px 36px 28px",
            }}
          >
            {/* O selo de válido é dourado, e não verde nem vermelho: verde era a identidade antiga, e
                o vermelho da campanha aqui leria como erro. */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px 6px 8px",
                borderRadius: 999,
                border: "1px solid rgba(169,142,78,.55)",
                background: "rgba(169,142,78,.08)",
                marginBottom: 22,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7e6836" strokeWidth="2.2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M8.3 12.3l2.4 2.4 5-5.4" />
              </svg>
              <span style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#1a1815", fontWeight: 600 }}>
                Certificado válido
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#6b655c", margin: "0 0 6px" }}>{TEXTO.abertura}</p>
            <h1 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, lineHeight: 1.15, margin: "0 0 14px", color: "#1a1815", textWrap: "balance" }}>
              {/* Conta sem nome cadastrado existe (o backfill de 28/jul achou 3 de 8), e aqui o nome
                  é o ponto da consulta: dizer que falta o cadastro é mais honesto que uma linha em
                  branco no lugar de quem se formou. */}
              {cert.nome || "Aluno sem nome no cadastro"}
            </h1>
            <i aria-hidden="true" style={{ display: "block", width: 64, height: 1, background: "#a98e4e", margin: "0 auto 14px" }} />
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#6b655c", margin: "0 auto 26px", maxWidth: 470 }}>
              {TEXTO.conclusao}{" "}
              <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 500, color: "#1a1815" }}>{CURSO}</span>,{" "}
              {TEXTO.descricao}
            </p>
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 14,
                margin: 0,
                padding: "18px 0 0",
                borderTop: "1px solid #e2dacd",
                textAlign: "left",
              }}
            >
              <div>
                <dt style={ROTULO}>Data de conclusão</dt>
                <dd style={{ margin: 0, fontSize: 14.5, fontWeight: 600 }}>{dataPorExtenso(cert.emitidoEm)}</dd>
              </div>
              <div>
                <dt style={ROTULO}>Carga horária</dt>
                <dd style={{ margin: 0, fontSize: 14.5, fontWeight: 600 }}>{HORAS} horas</dd>
              </div>
              <div>
                <dt style={ROTULO}>Código</dt>
                <dd style={{ margin: 0, fontSize: 14.5, fontWeight: 600, letterSpacing: ".05em" }}>{cert.codigo}</dd>
              </div>
            </dl>
            <p style={{ fontSize: 11.5, lineHeight: 1.55, color: "#6b655c", margin: "22px 0 0" }}>
              {TEXTO.aviso} Emitido por {EMISSORES.map((e) => `${e.razao} (CNPJ ${e.cnpj})`).join(" e ")}.
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "#fdfbf6",
              border: "1px solid rgba(193,18,31,.3)",
              borderRadius: 6,
              boxShadow: "0 22px 54px rgba(72,60,42,.1)",
              padding: "36px 34px 30px",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "rgba(193,18,31,.06)",
                border: "1px solid rgba(193,18,31,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C1121F" strokeWidth="2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, margin: "0 0 12px", color: "#1a1815" }}>
              Certificado não encontrado
            </h1>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#6b655c", margin: 0 }}>
              Não localizamos um certificado com o código <b style={{ color: "#1a1815" }}>{codigo}</b>. Confira o código
              impresso no canto inferior direito do certificado, no formato EI-XXXX-XXXX, e tente de novo.
            </p>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- logo em SVG, sem ganho no otimizador */}
          <img src="/marca/blocktrends-preto.svg" alt="BlockTrends" style={{ height: 12, width: "auto", display: "block", opacity: 0.8 }} />
          <i aria-hidden="true" style={{ display: "block", width: 1, height: 18, background: "rgba(26,24,21,.22)" }} />
          {/* eslint-disable-next-line @next/next/no-img-element -- logo em SVG, sem ganho no otimizador */}
          <img src="/marca/grupo-abril-preto.svg" alt="Grupo Abril" style={{ height: 22, width: "auto", display: "block", opacity: 0.8 }} />
        </div>
        <p style={{ fontSize: 12, color: "#6b655c", marginTop: 12 }}>Verificação oficial de certificados da formação {CURSO}</p>
      </div>
    </main>
  );
}

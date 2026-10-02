/* eslint-disable @next/next/no-img-element -- a folha vira PDF por html2canvas, que precisa de
   <img> comum no DOM; o <Image> do Next serve outro HTML conforme a tela e o PDF mudaria junto. */
import {
  ASSINATURAS,
  CURSO,
  DOMINIO_VERIFICACAO,
  EMISSORES,
  TEXTO,
  corpoDoNome,
  dataPorExtenso,
  urlVerificacao,
} from "@/lib/certificado";
import { qrDataUri } from "@/lib/qr";

import "./certificado.css";

/**
 * A FOLHA do certificado: A4 deitado, desenhada em milímetros (ver `certificado.css`).
 *
 * Componente sem estado e sem efeito, renderizado no servidor. Três destinos usam exatamente este
 * markup: a tela do aluno, o PDF (o `AcoesCertificado` rasteriza o `#cert-folha`) e a impressão
 * (o CSS de `@media print` esconde todo o resto). Uma peça só, para o papel nunca divergir da tela.
 *
 * O `@page` vai num `<style>` aqui dentro, e não no CSS da rota, porque ele não aceita escopo: preso
 * à folha, sai do documento quando ela sai, e não deixa as outras telas imprimindo em A4 deitado.
 */
const PAGINA = "@media print{@page{size:A4 landscape;margin:0}}";

export default function Folha({
  nome,
  codigo,
  emitidoEm,
  exemplo = false,
}: {
  nome: string;
  codigo: string;
  /** ISO de `certificates.issued_at`: a emissão acontece na conclusão da última aula. */
  emitidoEm: string;
  /** Prévia do admin: carimba "Exemplo" sobre a folha. */
  exemplo?: boolean;
}) {
  const data = dataPorExtenso(emitidoEm);
  const url = urlVerificacao(codigo);

  return (
    <div className="cf-moldura" id="cert-folha" data-url={url}>
      <style>{PAGINA}</style>
      <div className="cf-folha">
        <div className="cf-painel">
          <i className="cf-fio" aria-hidden="true" />
          <img className="cf-globo" src="/marca/globo-dourado.svg" alt="" aria-hidden="true" />

          <div className="cf-topo">
            <span className="cf-lock">
              <img className="cf-lock-veja" src="/marca/veja-negocios-claro.svg" alt="VEJA Negócios" />
              <i className="cf-filete" aria-hidden="true" />
              <span className="cf-lock-curso">
                Estratégia
                <br />
                Internacional
              </span>
            </span>
            <span className="cf-parceiros">
              <img className="cf-bt" src="/marca/blocktrends-preto.svg" alt="BlockTrends" />
              <i className="cf-filete" aria-hidden="true" />
              <img className="cf-abril" src="/marca/grupo-abril-preto.svg" alt="Grupo Abril" />
            </span>
          </div>

          <div className="cf-corpo">
            <i className="cf-traco" aria-hidden="true" />
            <p className="cf-titulo">{TEXTO.titulo}</p>
            <p className="cf-texto cf-abre">{TEXTO.abertura}</p>
            <p className="cf-nome" style={{ fontSize: `calc(var(--mm) * ${corpoDoNome(nome)})` }}>
              {nome}
            </p>
            <i className="cf-regua" aria-hidden="true" />
            <p className="cf-texto">{TEXTO.conclusao}</p>
            <p className="cf-curso">{CURSO}</p>
            <p className="cf-texto cf-desc">{TEXTO.descricao}</p>
            {data && (
              <p className="cf-data">
                Data de conclusão: <b>{data}</b>
              </p>
            )}
          </div>

          <div className="cf-base">
            <div className="cf-assinaturas">
              {ASSINATURAS.map((a) => (
                <div className="cf-assina" key={a.organizacao}>
                  <i className="cf-linha" aria-hidden="true" />
                  {a.nome && <span className="cf-assina-nome">{a.nome}</span>}
                  {a.cargo && <span className="cf-assina-cargo">{a.cargo}</span>}
                  <span className="cf-assina-org">{a.organizacao}</span>
                </div>
              ))}
            </div>

            <div className="cf-verifica" data-verifica>
              <img
                className="cf-qr"
                src={qrDataUri(url)}
                alt={`QR code da página de verificação deste certificado, ${urlVerificacao(codigo, { protocolo: false })}`}
              />
              <span className="cf-verifica-texto">
                <span className="cf-rotulo">Código de verificação</span>
                <span className="cf-codigo">{codigo}</span>
                <span className="cf-url">
                  Confira a autenticidade em
                  <br />
                  {DOMINIO_VERIFICACAO}/verificar
                </span>
              </span>
            </div>
          </div>

          <p className="cf-aviso">
            {TEXTO.aviso} Emitido por {EMISSORES.map((e) => `${e.razao} (CNPJ ${e.cnpj})`).join(" e ")}.
          </p>
          {exemplo && (
            <span className="cf-exemplo" aria-hidden="true">
              Exemplo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

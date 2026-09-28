import { readFileSync } from "node:fs";
import { join } from "node:path";

import { VERSOES } from "@/lib/consentimento";

/**
 * A casca das duas páginas de documento: Política de Privacidade e Termos de Uso.
 *
 * ┌─ DE ONDE VEM O TEXTO ─────────────────────────────────────────────────────────────────────────┐
 * │ Dos `.docx` que a Abril e a BlockTrends revisaram, convertidos com                             │
 * │ `pandoc --track-changes=accept`, que aceita os redlines e devolve o documento como ele fica    │
 * │ depois de assinado. O HTML resultante está em `app/_legal/*.html` e é injetado como está.      │
 * │                                                                                                │
 * │ NÃO EDITE ESSES ARQUIVOS À MÃO. Eles são a versão publicada de um documento jurídico, e a      │
 * │ única forma de o texto do site continuar sendo o texto acordado é ele nascer do `.docx`. Para  │
 * │ uma revisão nova: converta de novo, troque o arquivo, e insira a versão em                     │
 * │ `consent_documents` (migration 0023) para as telas de aceite voltarem a pedir o consentimento. │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * `dangerouslySetInnerHTML` com conteúdo de terceiro seria imprudente; aqui o HTML é gerado por nós
 * no build, a partir de um arquivo do repositório, e é o mesmo padrão que a LP de vendas já usa.
 */

export type Documento = "politica" | "termos";

const ARQUIVO: Record<Documento, string> = {
  politica: "politica.html",
  termos: "termos.html",
};

const TITULO: Record<Documento, string> = {
  politica: "Política de Privacidade",
  termos: "Termos de Uso",
};

/** A outra página, para o rodapé de cada uma levar à irmã sem passar pela home. */
const IRMA: Record<Documento, { href: string; rotulo: string }> = {
  politica: { href: "/termos-de-uso", rotulo: "Termos de Uso" },
  termos: { href: "/privacidade", rotulo: "Política de Privacidade" },
};

/**
 * As fontes vêm do CSS do porte da LP, que é quem conhece os nomes dos `.woff2` em `/public/lp`,
 * pelo mesmo caminho e pelo mesmo motivo que a pré-lista usa. Com `throw` se a extração falhar:
 * documento jurídico servido na fonte de sistema é o tipo de defeito que ninguém reporta.
 */
function fontesDoPorte(): string {
  const css = readFileSync(join(process.cwd(), "app", "_lp", "styles.css"), "utf8");
  const faces = css.match(/@font-face\s*\{[^}]*\}/g);
  if (!faces?.length)
    throw new Error("[legal] nenhum @font-face encontrado em app/_lp/styles.css");
  return faces.join("\n");
}

export default function DocumentoLegal({ tipo }: { tipo: Documento }) {
  const html = readFileSync(join(process.cwd(), "app/_legal", ARQUIVO[tipo]), "utf8");

  // O sistema entra ANTES do estilo da página, e a ordem é a regra: ele declara os tokens e as
  // primitivas, e o estilo local especializa por cima.
  const css = [
    fontesDoPorte(),
    readFileSync(join(process.cwd(), "app", "_design", "sistema.css"), "utf8"),
    readFileSync(join(process.cwd(), "app", "_legal", "estilo.css"), "utf8"),
  ].join("\n");

  /**
   * A MESMA constante que o log de consentimento grava, e não uma leitura no banco.
   *
   * A primeira versão disto consultava `consent_documents` e quebrou o build no primeiro
   * `npm run build` sem credencial no ambiente: esta página é estática, e a consulta acontecia na
   * geração. Página jurídica não pode depender do banco estar de pé. Ver o comentário de `VERSOES`
   * em `lib/consentimento.ts`.
   */
  const versao = VERSOES[tipo];

  return (
    <main className="dj">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="dj-dentro">
        <header className="dj-topo">
          {/* Volta para a página de onde a pessoa provavelmente veio. Não é o "voltar" do
              navegador porque ela pode ter chegado por link direto, de um e-mail ou do rodapé. */}
          <a className="dj-volta" href="/">
            ← Estratégia Internacional
          </a>
          <h1 className="dj-h1">{TITULO[tipo]}</h1>
          <p className="dj-versao">
            Versão <strong>{versao}</strong>
          </p>
        </header>

        <article className="dj-corpo" dangerouslySetInnerHTML={{ __html: html }} />

        <footer className="dj-rodape">
          <a href={IRMA[tipo].href}>{IRMA[tipo].rotulo}</a>
          <span className="dj-sep" aria-hidden="true" />
          <span>
            Dúvidas sobre seus dados: <a href="mailto:contato@blocktrends.com.br">contato@blocktrends.com.br</a>
          </span>
        </footer>
      </div>
    </main>
  );
}

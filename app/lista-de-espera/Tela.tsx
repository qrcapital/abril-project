import { readFileSync } from "node:fs";
import { join } from "node:path";
import GloboEspera from "./GloboEspera";

/**
 * Envelope das duas rotas da pré-lista: as camadas de fundo, o globo e a coluna
 * de conteúdo à esquerda. A coluna da direita vem por `children` — é o
 * formulário em `/lista-de-espera` e o card de confirmação em
 * `/lista-de-espera/obrigado`.
 *
 * Não toca em nada da LP de vendas: rota própria, CSS próprio, componente de
 * globo próprio. Do que já existe no repo ela só *lê* — os dados do globo e os
 * `@font-face` do CSS portado.
 */

/** Assets da marca já publicados em /public/lp pelo porte da LP. Reaproveitados
 *  por caminho, sem recriação (o DESIGN.md proíbe recriar o olho da marca). */
const VEJA = "/lp/172fddde-82d3-474c-b7a4-1a6be467e4cb.svg";
const BLOCKTRENDS = "/lp/00a96ae0-c594-4abf-bc55-59c27dd117a9.svg";
const GRUPO_ABRIL = "/lp/grupo_abril.svg";

/**
 * Código de rastreamento do RD Station. Não é a credencial da API e não envia o
 * formulário: ele identifica o visitante e guarda a origem da visita (sessão,
 * UTMs), que é o que faz a conversão chegar atribuída em vez de solta.
 *
 * Só nas rotas da pré-lista, de propósito. A LP de vendas (`/`) não recebe
 * rastreador nenhum hoje, e pôr um lá é decisão de outra pessoa, não efeito
 * colateral desta tela.
 *
 * O id vem do painel do RD e é público (roda no navegador de todo visitante),
 * então fica em constante e não em variável de ambiente — variável de ambiente
 * aqui daria a falsa impressão de segredo.
 */
const RD_TRACKING =
  "https://d335luupugsy2.cloudfront.net/js/loader-scripts/47621781-d2db-4d60-9f59-93239e295329-loader.js";

/** Os quatro temas que a live abre, uma linha cada.
 *
 *  Eram os substantivos soltos do design ("Professores", "Método", "Grade",
 *  "Entrada"), que leem como sumário e não como coisa a descobrir — o oposto do
 *  que o rótulo "Desvende" promete. A pergunta faz o trabalho no mesmo espaço,
 *  sem uma segunda linha embaixo.
 *
 *  Nenhuma diz quantos professores nem quando as inscrições abrem: são as duas
 *  coisas que a copy não promete (ver o handoff). "Como entrar" é o caminho, não
 *  a data. */
const TEASER = ["Quem ensina", "Como funciona", "O que você leva", "Como entrar"] as const;

/**
 * Os `@font-face` das duas famílias moram no CSS gerado pelo porte da LP, porque
 * é o porte que conhece os nomes dos `.woff2` em `/public/lp` — são UUIDs do
 * bundle do design, não `playfair-latin.woff2`. Copiar os nomes para cá
 * quebraria no próximo porte; extrair as regras, não.
 *
 * Se um dia o porte deixar de emitir `@font-face`, isto estoura no build em vez
 * de servir Georgia calado — é o mesmo espírito das âncoras do `npm run check`.
 */
function fontesDoPorte() {
  const css = readFileSync(join(process.cwd(), "app", "_lp", "styles.css"), "utf8");
  const faces = css.match(/@font-face\s*\{[^}]*\}/g);
  if (!faces?.length) {
    throw new Error(
      "app/_lp/styles.css não tem @font-face: o porte mudou de forma e a pré-lista perderia Playfair e Montserrat.",
    );
  }
  return faces.join("\n");
}

export default function Tela({ children }: { children: React.ReactNode }) {
  const css = [
    fontesDoPorte(),
    readFileSync(join(process.cwd(), "app", "lista-de-espera", "estilo.css"), "utf8"),
  ].join("\n");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="le-raiz">
        <div className="le-fundo" />
        <div className="le-trama" />
        <GloboEspera />
        <div className="le-veu" />

        <div className="le-grade">
          <div className="le-esq">
            {/* SVG inline, não <img>: só inline o wordmark usa as fontes
                self-hosted da página. Como <img> ele cai para Georgia. O
                textLength com lengthAdjust="spacing" é o que fixa a medida das
                duas linhas entre as réguas douradas. */}
            <svg
              className="le-wordmark"
              viewBox="22 11 251 54"
              role="img"
              aria-label="Estratégia Internacional"
            >
              <text
                x="147.5" y="40" textAnchor="middle" textLength="249" lengthAdjust="spacing"
                fontFamily="Playfair Display, Georgia, serif" fontSize="30" fontWeight="400"
                fill="#F7F5F2"
              >
                ESTRATÉGIA
              </text>
              <rect x="22" y="59" width="26" height="2" fill="#A98E4E" shapeRendering="crispEdges" />
              <rect x="247" y="59" width="26" height="2" fill="#A98E4E" shapeRendering="crispEdges" />
              <text
                x="147.5" y="64" textAnchor="middle" textLength="167" lengthAdjust="spacing"
                fontFamily="Montserrat, Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600"
                fill="#EDE6DD"
              >
                INTERNACIONAL
              </text>
            </svg>

            <div className="le-bloco">
              {/* O itálico dourado marca o fecho da frase, que é onde a virada
                  acontece: o 2% contra o 100%. */}
              <h1 className="le-h1">
                O Brasil é 2% do mundo. Não precisa ser <em>100% do seu risco</em>.
              </h1>

              <p className="le-lide">
                Conheça a melhor e mais consistente estratégia para tornar seu patrimônio
                global e construir o futuro que você sempre sonhou. Saia do risco Brasil de
                forma prática, ao lado de profissionais com décadas de experiência no mercado
                financeiro.
              </p>

              <ul className="le-checks">
                <li>
                  <span className="le-check" aria-hidden="true">✓</span>
                  Convite para a live de lançamento.
                </li>
                <li>
                  <span className="le-check" aria-hidden="true">✓</span>
                  Aviso da abertura em primeira mão.
                </li>
                <li>
                  <span className="le-check" aria-hidden="true">✓</span>
                  Prioridade na hora de se inscrever.
                </li>
              </ul>

              <div className="le-assina">
                <span className="le-rotulo le-rotulo-sage">Uma produção</span>
                <span className="le-filete" aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG de
                    marca com altura fixa: o otimizador do next/image não tem o
                    que otimizar aqui e ainda rasterizaria o vetor. */}
                <img className="le-logo-veja" src={VEJA} alt="VEJA Negócios" />
                {/* O × anda colado no BlockTrends: solto, ele ficava órfão no fim
                    da primeira linha no celular, com a marca sozinha embaixo. */}
                <span className="le-par">
                  <span className="le-x" aria-hidden="true">×</span>
                  {/* eslint-disable-next-line @next/next/no-img-element -- idem */}
                  <img className="le-logo-bt" src={BLOCKTRENDS} alt="BlockTrends" />
                </span>
              </div>

              <div className="le-teaser">
                <span className="le-rotulo le-rotulo-gold">Desvende na live de lançamento</span>
                {/* <ol>, e não uma <div>: os 01..04 saíram da tela, mas a ordem
                    é informação. O trilho a mostra para quem vê, e a lista
                    ordenada para quem lê por leitor de tela. */}
                <ol className="le-rota">
                  {TEASER.map((titulo) => (
                    <li className="le-rota-item" key={titulo}>
                      <span className="le-rota-marca" aria-hidden="true" />
                      <span className="le-rota-t">{titulo}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="le-dir">
            <div className="le-card-wrap">{children}</div>
            <div className="le-abril">
              {/* eslint-disable-next-line @next/next/no-img-element -- idem */}
              <img src={GRUPO_ABRIL} alt="Grupo Abril" />
              <span className="le-rotulo le-rotulo-sage">Abril Comunicações S.A.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fica aqui embaixo, dentro do corpo, e com `defer` em vez de `async`,
          pelas duas exigências da captura automática do RD: o código de
          monitoramento vai no <body>, e o formulário precisa existir quando ele
          roda. `defer` garante as duas — o React 19 içaria um `<script async>`
          para o <head>, e `async` poderia disparar antes do <form> ser lido.
          Por isso também não é o next/script, que sempre põe no <head>. */}
      <script src={RD_TRACKING} defer />
    </>
  );
}

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { LIVE_EM, LIVE_QUANDO, copyDaLive } from "./live";

/**
 * Envelope da tela: as camadas de fundo, o globo e a coluna de conteúdo à
 * esquerda. A coluna da direita vem por `children`, que hoje é só o formulário —
 * a confirmação acontece dentro dele, no mesmo card, sem segunda rota. O
 * `children` ficou porque é o que torna uma página de obrigado barata, se um dia
 * for pedida.
 *
 * Não toca em nada da LP de vendas: rota própria, CSS próprio, componente de
 * globo próprio. Do que já existe no repo ela só *lê* — os dados do globo e os
 * `@font-face` do CSS portado.
 */

/** A marca do Grupo Abril, nas duas versões fechadas pela Abril (setembro/2026).
 *
 *  Substituiu o `/lp/grupo_abril.svg` do porte da LP, que era um desenho só, em
 *  cinza, levado a preto ou a branco por filtro CSS e servido a 70-82% de
 *  opacidade. Nos 22px do rodapé isso somava contraste de menos e as letras de
 *  "GRUPO" saíam empastadas. Estes são os arquivos na cor final, sem filtro e
 *  sem opacidade, e a diferença aparece já em tela comum.
 *
 *  Ficam em /public/marca, e não em /public/lp, porque aquela pasta era escrita
 *  pelo porte da LP e seria limpa no próximo `port-lp`. O porte foi aposentado
 *  em 22/set/2026, então o risco acabou, mas a separação fica: /marca é a
 *  identidade do projeto, /lp são os assets da LP de vendas. A LP de vendas
 *  continua com o arquivo dela, intocado. */
const GRUPO_ABRIL = {
  branco: "/marca/grupo-abril-branco.svg",
  preto: "/marca/grupo-abril-preto.svg",
} as const;

/** A logo do curso com a assinatura da VEJA Negócios, arquivo fechado pela Abril
 *  (setembro/2026). Fica em /public/marca por organização: /marca é a identidade
 *  do projeto, /lp são os assets da LP de vendas.
 *
 *  Duas versões do mesmo desenho: o texto é preto na clara e creme na escura.
 *  Não dá para resolver com filtro CSS, porque o "veja" vermelho tem de ficar
 *  vermelho nas duas. */
/**
 * Versão da campanha que esta tela veste. As duas existem no kit de banners e as
 * duas estão implementadas no estilo.css; trocar aqui troca a tela inteira,
 * porque todas as cores saem dos tokens do `.le-raiz`.
 *
 * Quem consome isto são os pares claro/escuro de `MEDIACAO`, `GLOBO` e
 * `GRUPO_ABRIL`. O par `LOGO`, do lockup em arquivo único, saiu em 28/set/2026:
 * o lockup passou a ser montado em tipografia sobre a marca solta da VEJA
 * Negócios, que já vinha de `MEDIACAO.veja`.
 */
/* `as` e não anotação: com `const TEMA: "claro" | "escuro" = "claro"` o TypeScript estreita o
   tipo pelo valor inicial e passa a acusar `TEMA === "escuro"` como comparação impossível, o que
   mata justamente as bifurcações que existem para a troca ser de uma linha só. */
const TEMA = "claro" as "claro" | "escuro";

/** A esfera da biblioteca visual da campanha, a mesma das outras peças. Substituiu
 *  o globo em canvas quando a identidade mudou: aquele era desenhado ponto a ponto
 *  na paleta antiga, e o desta pasta é o desenho oficial. O componente do canvas
 *  (`GloboEspera.tsx`, 434 linhas) ficou órfão no repo por quase um mês depois da
 *  troca e saiu em 28/set/2026; o git guarda a matemática, se ela voltar a servir.
 *
 *  O conjunto cromático não se mistura (leia-me da biblioteca): vermelho é o das
 *  peças da Abril, dourado o neutro da campanha. */
const GLOBO = {
  dourado: "/marca/globo-dourado.svg",
  vermelho: "/marca/globo-vermelho.svg",
} as const;

const COR_GLOBO: keyof typeof GLOBO = "dourado";

/**
 * Composição da coluna da direita, as duas vindas do kit de banners:
 * "cartao" é o card branco sobre o fundo, como a tela nasceu, e "faixa" é o
 * painel vermelho com o formulário dentro dele e o botão invertido. É
 * independente do TEMA: nos banners o painel é igual no claro e no escuro.
 */
const COMPOSICAO: "cartao" | "faixa" = "faixa";

/** Qual das duas versões da marca do Grupo Abril o rodapé recebe. Ela é
 *  monocromática, então quem decide é o fundo embaixo dela: em faixa o crédito
 *  fica sobre o painel vermelho nas duas versões da campanha, e em cartão ele
 *  fica sobre o fundo da página, que é creme na clara e preto na escura. */
const MARCA_ABRIL =
  COMPOSICAO === "faixa" || TEMA === "escuro" ? GRUPO_ABRIL.branco : GRUPO_ABRIL.preto;

/** Se a árvore acompanha o crédito no rodapé. O texto é o do rodapé do site da
 *  Abril, onde a marca não aparece; aqui ela fica, porque esta é uma página
 *  co-assinada e o selo é o que diz de quem ela é. Desligar aqui deixa só a
 *  linha de texto, como no site deles. */
const MARCA_NO_CREDITO = true;

/** As duas marcas que assinam a mediação da live, em arquivo e não em texto.
 *
 *  A do BlockTrends é a mesma da LP de vendas, recolorida nas duas versões e
 *  copiada para /public/marca, junto com a do Grupo Abril.
 *
 *  A da VEJA Negócios é o próprio lockup oficial da campanha com a palavra
 *  "apresenta" e a linha "Estratégia Internacional" removidas. A geometria do
 *  desenho não foi tocada, só o recorte do viewBox. Se a Abril tiver o arquivo
 *  da marca solta, ele substitui estes dois sem mais nada mudar aqui. */
const MEDIACAO = {
  veja: { claro: "/marca/veja-negocios-claro.svg", escuro: "/marca/veja-negocios-escuro.svg" },
  bt: { claro: "/marca/blocktrends-preto.svg", escuro: "/marca/blocktrends-branco.svg" },
} as const;

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
  // Uma chamada só, no topo do render: as cinco regiões que falam da live usam o
  // mesmo conjunto, então não há como a página ficar meio antes e meio depois.
  const copy = copyDaLive();

  // O sistema entra ANTES do estilo da tela, e a ordem é a regra: ele declara
  // os tokens e as primitivas, e o estilo.css especializa por cima. Invertido,
  // o sistema sobrescreveria decisões locais da pré-lista.
  const css = [
    fontesDoPorte(),
    readFileSync(join(process.cwd(), "app", "_design", "sistema.css"), "utf8"),
    readFileSync(join(process.cwd(), "app", "lista-de-espera", "estilo.css"), "utf8"),
  ].join("\n");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        className={[
          "le-raiz",
          TEMA === "escuro" && "le-escuro",
          COMPOSICAO === "faixa" && "le-faixa",
        ].filter(Boolean).join(" ")}
      >
        <div className="le-fundo" />
        <div className="le-trama" />
        <div className="le-globo" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- ilustração
              vetorial de fundo, com medida própria: o next/image rasterizaria. */}
          <img src={GLOBO[COR_GLOBO]} alt="" />
        </div>
        <div className="le-veu" />
        {/* Irmão da grade, e não fundo da coluna: assim ele sangra até a borda
            da tela sem depender do padding dela. Inerte fora da composição em
            faixa, onde o CSS o esconde. */}
        <div className="le-painel" aria-hidden="true" />
        {/* A continuação do globo dentro do painel: mesma imagem e mesmas
            medidas, recortada na divisa e invertida para branco pelo CSS.
            Inerte fora da composição em faixa. */}
        <div className="le-globo le-globo-painel" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- idem */}
          <img src={GLOBO[COR_GLOBO]} alt="" />
        </div>

        <div className="le-grade">
          <div className="le-esq">
            {/* O LOCKUP EM DUAS CAMADAS, e não mais um arquivo único.
                Substituiu `veja-negocios-apresenta-*.svg` em 28/set/2026.

                A divisão não é técnica, é de propriedade: a marca da VEJA
                Negócios é desenho da Abril e continua vindo do arquivo oficial
                dela, intocada. O que saiu das curvas foi o que é NOSSO, o
                "apresenta" e o nome do curso, que já existiam em tipografia
                viva na topbar da LP de vendas e na sidebar do admin e ali
                estavam presos numa imagem, divergindo dos outros dois sem
                ninguém poder corrigir.

                Três ganhos concretos, nesta ordem de importância:

                1. o nome do curso passa a ser O MESMO lockup das outras telas,
                   com as réguas douradas do DESIGN.md em vez dos traços curtos
                   que só existiam neste arquivo;
                2. somem as duas margens negativas que cancelavam folga
                   transparente medida no navegador, e com elas o aviso de que
                   "mexer na arte do arquivo pede remedir as duas";
                3. o arquivo cai de 48.986 para 11.325 bytes, no caminho crítico
                   da única tela da rota.

                As fontes não são risco: o `fontesDoPorte()` acima já traz todos
                os `@font-face` do porte da LP, Playfair e Jost incluídos. */}
            <div className="le-lock">
              <span className="le-lock-topo">
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG de
                    marca com altura fixa: o otimizador do next/image não tem o
                    que otimizar aqui e ainda rasterizaria o vetor. */}
                <img className="le-lock-veja" src={MEDIACAO.veja[TEMA]} alt="VEJA Negócios" />
                <span className="le-lock-apresenta">apresenta</span>
              </span>
              {/* As réguas são irmãs do texto, não `border` dele: em `flex:1`
                  cada uma toma metade da sobra, então o nome fica óptica e
                  matematicamente centrado na largura que a linha de cima ditou,
                  em qualquer corpo de fonte. */}
              <span className="le-lock-nome">
                <i className="le-lock-regua" aria-hidden="true" />
                <span className="le-lock-curso">Estratégia Internacional</span>
                <i className="le-lock-regua" aria-hidden="true" />
              </span>
            </div>

            <div className="le-bloco">
              {/* Três palavras por linha, e quem garante isso não é uma quebra
                  fixa (<br/>), que erraria em toda largura diferente desta: cada
                  trio vai num span que não quebra por dentro, e o navegador
                  encaixa um trio por linha porque dois nunca cabem juntos. No
                  celular o mesmo arranjo se mantém, com a fonte menor.

                  O dourado pega "carteira global", que atravessa a virada da
                  linha; são dois <em> pelo mesmo motivo dos trios, e não porque
                  sejam duas ênfases. */}
              <h1 className="le-h1">
                <span className="le-trio">O caminho para</span>{" "}
                <span className="le-trio">tornar sua <em>carteira</em></span>{" "}
                <span className="le-trio"><em>global</em> começa aqui.</span>
              </h1>

              <p className="le-lide">
                Aprenda na prática a investir fora do Brasil e proteger seu patrimônio com
                quem tem décadas de mercado.
              </p>

              {/* O rótulo abre a frase e cada item a completa, por isso eles
                  perderam o ponto final: sozinhos eram três frases soltas. */}
              <div className="le-garante">
                <span className="le-rotulo le-rotulo-gold">Ao entrar na pré-lista, você recebe:</span>
                <ul className="le-checks">
                  <li>
                    <span className="le-check" aria-hidden="true">✓</span>
                    {copy.beneficio}
                  </li>
                  <li>
                    <span className="le-check" aria-hidden="true">✓</span>
                    Aviso assim que as inscrições abrirem
                  </li>
                  <li>
                    <span className="le-check" aria-hidden="true">✓</span>
                    {/* No celular o "da turma" sai: ali a linha não cabia e o "mão"
                        descia sozinho para a linha de baixo. O span de fora mantém
                        a frase como um item só do flex do li; sem ele, cada pedaço
                        viraria um item e ganharia o gap de 12px entre eles. */}
                    <span>Todos os detalhes<span className="le-fora-celular"> da turma</span> em primeira mão</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="le-teaser">
              {/* Mesmo rótulo do bloco de cima, na mesma estrutura: uma linha
                  em caixa alta dourada anunciando o que vem embaixo. */}
              <span className="le-rotulo le-rotulo-gold">{copy.rotuloTeaser}</span>
              {/* Os dois nomes em <strong> não é negrito decorativo: eles são o
                  motivo de a frase existir, e no cinza do parágrafo passavam
                  batidos. Sobem para a cor do texto principal, que é o mesmo
                  degrau de ênfase dos itens da lista acima.

                  Os &shy; são hifens que só aparecem se a palavra cair na
                  virada da linha, e é o que deixa o justificado sem buracos.
                  Estão só em palavras comuns: o nome do curso e os nomes dos
                  professores nunca partem. Editar a frase sem eles funciona;
                  só volta a abrir vão entre as palavras em algumas larguras. */}
              {/* DOIS AVISOS SOBRE ESPAÇO NESTE PARÁGRAFO, os dois aprendidos na página e
                  nenhum deles visível no build:

                  1. depois de uma expressão, `{" "}` é obrigatório quando o texto seguinte
                     continua na linha de baixo. O JSX apara o começo desse nó e
                     `{copy.verbo} por que` sai como "mostrampor que";
                  2. comentário JSX no meio da prosa também parte o nó de texto e come o
                     espaço em volta. Por isso este está AQUI FORA e não lá dentro, que foi
                     onde ele colou "professoresda formação". */}
              <p className="le-live-p">
                <strong className="le-nome">Tony Volpon</strong> e{" "}
                <strong className="le-nome">Rodolfo Bastos</strong>, dois dos pro&shy;fes&shy;so&shy;res
                da for&shy;ma&shy;ção Estratégia Internacional, {copy.verbo}{" "}
                por que con&shy;cen&shy;trar todo o pa&shy;tri&shy;mô&shy;nio em um único país é
                de&shy;ci&shy;são de risco, não de con&shy;for&shy;to.
              </p>

              {/* Quando e onde, em dourado, com o filete no lugar da barra. O
                  link fecha a linha e leva ao formulário: no celular ele fica
                  embaixo de tudo e esse é o atalho; no desktop ele já está ao
                  lado, e o link só põe o cursor no primeiro campo. */}
              {/* `<time>` com `dateTime`: a data legível vem formatada de
                  `live.ts`, e a máquina lê o instante exato ao lado dela. */}
              <p className="le-quando">
                <time className="le-rotulo le-data" dateTime={LIVE_EM.toISOString()}>
                  {LIVE_QUANDO}
                </time>
                <span className="le-filete" aria-hidden="true" />
                <span className="le-rotulo le-data">{copy.selo}</span>
                <a className="le-rotulo le-live-cta" href="#form-lista-de-espera">
                  {copy.chamada}
                </a>
              </p>

              {/* As marcas entram como arquivo, e não escritas: o rótulo diz o
                  papel e elas dizem quem. O filete entre as duas é o que separa
                  co-assinatura de lista, sem precisar de um "e" no meio. */}
              <div className="le-mediacao">
                <span className="le-rotulo le-mediacao-r">Mediação</span>
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG de
                    marca com altura fixa: o next/image rasterizaria o vetor. */}
                <img className="le-marca-veja" src={MEDIACAO.veja[TEMA]} alt="VEJA Negócios" />
                <span className="le-filete" aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element -- idem */}
                <img className="le-marca-bt" src={MEDIACAO.bt[TEMA]} alt="BlockTrends" />
              </div>
            </div>
          </div>

          <div className="le-dir">
            <div className="le-card-wrap">{children}</div>
            <div className="le-abril">
              {MARCA_NO_CREDITO && (
                /* eslint-disable-next-line @next/next/no-img-element -- idem */
                <img src={MARCA_ABRIL} alt="Grupo Abril" />
              )}
              {/* Idêntico ao da LP de vendas, inclusive os meios-pontos. O CNPJ
                  não é formalidade numa tela que coleta dado pessoal: é ele que
                  identifica o controlador para quem quiser exercer um direito. */}
              <span className="le-credito">
                Abril Comunicações S.A. · CNPJ 44.597.052/0001-62 · Todos os direitos reservados.
              </span>
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

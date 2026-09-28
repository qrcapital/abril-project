import { readFileSync } from "node:fs";
import { join } from "node:path";

import Rodape from "./Rodape";
import { LIVE_DIA, LIVE_EM, LIVE_HORA, copyDaLive } from "./live";

/**
 * Quem está na live, com rosto.
 *
 * Os arquivos são os MESMOS da seção de docentes da LP de vendas, referenciados pelo caminho
 * original em vez de copiados: duas cópias do mesmo retrato divergem no dia em que alguém trocar
 * uma delas, e o rosto do professor é exatamente o tipo de coisa que se troca sem avisar.
 *
 * São as versões coloridas do par que a LP guarda para cada um. A outra é um duotone verde da
 * identidade anterior, e trazê-lo para o creme e o vermelho da campanha seria importar a paleta
 * que a migração de setembro tirou de lá. O preto e branco é feito por CSS, no `.le-prof-foto`.
 *
 * A credencial é uma linha só e sem cargo: a pré-lista não é o lugar de currículo, e a LP de
 * vendas tem a seção inteira para isso.
 */
const PROFESSORES = [
  {
    nome: "Tony Volpon",
    credencial: "Ex-diretor do Banco Central",
    foto: "/lp/9fe8de2f-df8d-4f74-948e-34ff295753f9.webp",
  },
  {
    nome: "Rodolfo Bastos",
    credencial: "XP e Oyster",
    foto: "/lp/8eb077d2-3fb0-4c55-9a78-6eddc936cdb5.webp",
  },
] as const;

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

/* A marca do Grupo Abril saiu daqui em 28/set/2026, junto com o crédito ao lado do
   formulário: a razão social e o CNPJ já aparecem duas vezes no rodapé novo, e uma
   terceira na mesma página vira rodapé colado em cima de rodapé. O rodapé usa o
   arquivo da LP (`/lp/grupo_abril.svg`); os dois de `/public/marca` continuam lá
   para quem reativar o crédito nesta coluna. */

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
 * Quem consome isto são os pares claro/escuro de `MEDIACAO` e `GLOBO`. Os outros dois
 * saíram em 28/set/2026: `LOGO`, do lockup em arquivo único, quando o lockup passou a
 * ser montado em tipografia sobre a marca solta da VEJA Negócios; e `GRUPO_ABRIL`,
 * quando o crédito duplicado ao lado do formulário deu lugar ao rodapé do site.
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
            {/* LOCKUP IGUAL AO DA TOPBAR DA LP DE VENDAS (`.tb-lock` em
                app/_lp/body.html). Terceira forma que esta assinatura toma nesta
                tela em uma semana, e a última: antes era um SVG único de 49KB com
                tudo em curvas, depois virou marca + "apresenta" + nome com réguas
                douradas, e agora é o desenho horizontal da LP.

                A escolha não é estética, é de coerência: quem chega na pré-lista
                por anúncio e depois abre a página de vendas precisa ver a mesma
                assinatura nos dois lugares. Duas variações do mesmo lockup em
                duas telas da mesma campanha leem como erro, não como variação.

                O que muda em relação à topbar é só o que o fundo exige. Lá o
                fundo é escuro e a marca vem em `veja-negocios-escuro.svg`, com o
                texto em creme; aqui o fundo é o papel, então entram a versão
                clara e a tinta. A geometria é a mesma: mark, filete em pé, nome
                em duas linhas. */}
            <div className="le-lock">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG de
                  marca com altura fixa: o otimizador do next/image não tem o que
                  otimizar aqui e ainda rasterizaria o vetor. */}
              <img className="le-lock-veja" src={MEDIACAO.veja[TEMA]} alt="VEJA Negócios" />
              {/* Filete EM PÉ, e não deitado, pela razão medida na LP: de um lado
                  um mark de uma linha, do outro um bloco de duas. Deitado ele
                  corta a leitura na horizontal e some contra a linha de base do
                  texto; em pé funciona como divisória de colunas. */}
              <i className="le-lock-tr" aria-hidden="true" />
              <span className="le-lock-curso">Estratégia<br />Internacional</span>
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

              {/* A segunda frase é o ineditismo, e o recorte dela foi escolhido com
                  cuidado: "primeiro curso da Abril SOBRE INVESTIMENTO NO EXTERIOR",
                  e não "primeiro curso da Abril". O Grupo Abril já teve a Abril
                  Educação, que virou Somos Educação em 2017, então a afirmação ampla
                  tem precedente e cairia no colo do jurídico deles numa página que
                  eles co-assinam. O recorte por tema é estreito e se sustenta.

                  Em <strong> porque é a informação nova do parágrafo: a primeira
                  frase descreve o curso, esta diz por que ele é um acontecimento. */}
              <p className="le-lide">
                Aprenda na prática a investir fora do Brasil e proteger seu patrimônio com
                quem tem décadas de mercado.{" "}
                <strong className="le-inedito">
                  É o primeiro curso da Abril sobre investimento no exterior.
                </strong>
              </p>

              {/* TRIO DE CARTÕES, no lugar da linha corrida de data que ficava lá
                  embaixo, junto do teaser. Fica ENTRE o texto de apoio e os
                  professores, e não colado no título: encostado na manchete ele
                  entrava antes de a pessoa saber do que se trata, e o dado
                  chegava sem a pergunta que ele responde.

                  Três cartões e não uma frase porque cada um responde a uma
                  pergunta diferente, e em cartão a resposta é escaneável sem ler.
                  A escala repete a do resto da coluna: rótulo miúdo em caixa alta
                  por cima, valor grande embaixo.

                  `<time>` com `dateTime` no primeiro: o texto legível vem
                  formatado de `live.ts` e a máquina lê o instante exato. */}
              <div className="le-cards">
                <div className="le-card-q">
                  <span className="le-rotulo le-card-q-r">Data</span>
                  <time className="le-card-q-v" dateTime={LIVE_EM.toISOString()}>
                    {LIVE_DIA}
                  </time>
                </div>
                <div className="le-card-q">
                  <span className="le-rotulo le-card-q-r">Horário</span>
                  <span className="le-card-q-v">{LIVE_HORA}</span>
                </div>
                {/* O terceiro é o único que muda depois da transmissão: vira
                    "Gravação", e aí o ponto vermelho que pulsa não faz sentido e
                    sai junto. */}
                <div className="le-card-q le-card-q-vivo">
                  <span className="le-rotulo le-card-q-r">Formato</span>
                  <span className="le-card-q-v">
                    {!copy.passou && <i className="le-ponto" aria-hidden="true" />}
                    {copy.selo}
                  </span>
                </div>
              </div>

              {/* QUEM ESTÁ NA LIVE, com rosto. Substituiu o parágrafo de quatro
                  linhas que dizia os mesmos dois nomes em prosa: numa página de
                  captura, quem vai falar é uma pergunta que a foto responde mais
                  rápido que a frase, e o texto que sobrou é o que a foto não diz.

                  As fotos são as mesmas da seção de docentes da LP de vendas, com
                  o mesmo tratamento em preto e branco do estado de repouso de lá.
                  Colorir aqui traria o duotone verde da identidade antiga para
                  dentro do creme e do vermelho da campanha. */}
              <div className="le-live-quem">
                <span className="le-rotulo le-rotulo-gold">{copy.rotuloTeaser}</span>
                <ul className="le-profs">
                  {PROFESSORES.map((prof) => (
                    <li className="le-prof" key={prof.nome}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- retrato
                          de medida fixa num círculo; o next/image não muda o
                          resultado e acrescenta um wrapper ao layout. */}
                      <img className="le-prof-foto" src={prof.foto} alt={prof.nome} />
                      <span className="le-prof-txt">
                        <strong className="le-nome">{prof.nome}</strong>
                        <span className="le-prof-cred">{prof.credencial}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          <div className="le-dir">
            <div className="le-card-wrap">{children}</div>

            {/* Assinatura de quem faz o conteúdo. Morava no pé da coluna da
                esquerda e veio para debaixo do card, alinhada à borda direita
                dele: ali ela fecha o bloco de ação em vez de competir com o
                bloco editorial, e o card ganha um pé.

                A linha de "Mediação" que existia antes dela saiu por ordem do
                Marcelo: repetia a marca da VEJA Negócios, que já assina o lockup
                no alto da página.

                Fica discreta de propósito. A chancela de cima é da Abril; esta
                diz de quem é o conteúdo, no tom de crédito e não de marca.

                A MARCA É A VERSÃO ESCURA, e não `MEDIACAO.bt[TEMA]`. Aquele par
                é escolhido pelo tema da PÁGINA, que é o creme, e foi assim que
                ela nasceu invisível aqui: debaixo do card ela está sobre o painel
                vermelho, não sobre o papel. Quem decide é o fundo imediato, e
                aqui ele não muda com o tema. */}
            <div className="le-powered">
              <span className="le-powered-r">Powered by</span>
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca
                  com altura fixa: o next/image rasterizaria o vetor. */}
              <img className="le-powered-bt" src={MEDIACAO.bt.escuro} alt="BlockTrends" />
            </div>
            {/* O crédito da Abril saiu daqui em 28/set/2026: a mesma razão
                social e o mesmo CNPJ aparecem duas vezes no rodapé novo, na
                faixa da marca e na linha final. Repetir três vezes na mesma
                página não dá mais peso institucional, dá aspecto de rodapé
                colado em cima de rodapé. A constante MARCA_ABRIL e o
                MARCA_NO_CREDITO continuam acima, servindo quem for reativar o
                crédito ao lado do formulário. */}
          </div>
        </div>

        {/* O rodapé do site, o mesmo das três faixas da LP de vendas. Fica DENTRO
            do `.le-raiz`, e não fora, porque é lá que moram os tokens da campanha
            que ele consome.

            Com ele a rota deixa de ser uma dobra só: a `.le-grade` continua com
            `min-height: 100vh` e o rodapé vem depois, então a página passa a ter
            rolagem. É o comportamento do site, que é o que foi pedido. */}
        <Rodape />
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

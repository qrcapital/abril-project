import { URL_POLITICA, URL_TERMOS } from "@/lib/consentimento";
import contato from "@/lib/contato.json";

/**
 * O rodapé da LP de vendas, trazido para a pré-lista.
 *
 * ┌─ POR QUE ISTO É UMA CÓPIA, E NÃO UM COMPONENTE COMPARTILHADO ─────────────────────────────────┐
 * │ A LP de vendas não é JSX: ela é HTML injetado por `readFileSync` +                             │
 * │ `dangerouslySetInnerHTML`, com todo o estilo inline no `body.html`. Não existe componente lá   │
 * │ para importar aqui, e transformar o rodapé de lá num componente React mexeria na única parte   │
 * │ do projeto que é HTML portado, com o risco desproporcional ao ganho.                           │
 * │                                                                                                │
 * │ O CUSTO DISSO É REAL: são duas cópias, e elas vão divergir no dia em que alguém mexer numa só. │
 * │ Se o rodapé mudar, mude os dois. O par é `<footer>` no fim de app/_lp/body.html e este arquivo.│
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * As três faixas são as mesmas: o lockup e as redes sobre o vinho, a marca do Grupo Abril com as
 * colunas de links sobre o preto, e a linha de crédito. As diferenças são três, todas deliberadas
 * e explicadas onde acontecem: as redes sociais, os links institucionais e as políticas.
 *
 * Estilo em classes e não inline, ao contrário do original: o `body.html` é HTML portado e leva
 * estilo inline por herança do bundle, e esta rota tem folha própria desde sempre.
 */

/**
 * PENDÊNCIA HERDADA, E O MOTIVO DE ELA NÃO SER COPIADA.
 *
 * No `body.html` os três ícones de rede são `href="#"`, links mortos desde o porte. Reproduzir
 * isso aqui multiplicaria por dois um defeito que já existe, e link morto num rodapé é pior que
 * rodapé sem rede: ele promete um destino e não leva a lugar nenhum.
 *
 * Com a lista vazia o bloco inteiro não renderiza. Preencher aqui liga as redes nesta página; a LP
 * de vendas continua precisando da correção dela, no `body.html`.
 */
const REDES: { nome: string; href: string; svg: React.ReactNode }[] = [];

/* A COLUNA "INSTITUCIONAL" SAIU em 13/out/2026, por ordem do Marcelo, e com ela a constante de
   links e o flag que a ligava. Ela apontava para as âncoras da LP de vendas, que é a página com
   preço e botão de compra: mandar para lá quem está na pré-lista justamente porque as inscrições
   ainda não abriram era o contrário do que esta tela existe para fazer. */

export default function Rodape() {
  return (
    <footer className="le-rodape">
      {/* A FAIXA VINHO SAIU em 13/out/2026, por ordem do Marcelo. Ela trazia o
          lockup empilhado e o bloco "Siga" das redes, e era o que o `<footer>` da
          LP de vendas tem no topo. Duas razões para ela não fazer falta aqui: o
          lockup já abre a página, a um rolar de distância, e as redes nunca
          chegaram a existir porque os três `href` são `#` até hoje. O que sobrava
          era uma tarja de cor cortando a página entre o painel do formulário e o
          rodapé preto, sem nada dentro.

          Na LP de vendas ela continua, e lá faz sentido: o rodapé está a uma
          página inteira do topo, e a tarja é o que devolve a marca antes do fim.

          A constante `REDES` acima segue servindo para quando os perfis
          existirem; o bloco delas volta junto com esta faixa. */}

      {/* ---- faixa preta: marca, descrição e colunas ---- */}
      <div className="le-rod-corpo">
        <div className="le-rod-dentro le-rod-colunas">
          <div className="le-rod-sobre">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca com
                largura fixa: o next/image rasterizaria o vetor. */}
            <img src="/lp/grupo_abril.svg" alt="Grupo Abril" width={150} />
            {/* A MESMA LINHA QUE FICA EMBAIXO DA LOGO NO RODAPÉ DA VEJA, com a
                pontuação deles: vírgula depois do S.A. e hífen antes de "Todos os
                direitos". Substituiu uma descrição do curso que era nossa e que,
                debaixo da marca da Abril, parecia dita por eles.

                Ela é também o motivo de a terceira faixa do rodapé ter sumido: era
                onde esta linha morava, e mantê-la nos dois lugares repetia a razão
                social duas vezes na mesma tela. */}
            <p className="le-rod-razao">
              {/* Espaço não separável antes do hífen: em duas linhas ele caía sozinho
                  no começo da segunda, e hífen abrindo linha lê como palavra cortada.
                  Preso ao "62", ele desce junto com o número ou fica na primeira. */}
              Abril Comunicações S.A., CNPJ 44.597.052/0001-62{"\u00a0"}- Todos os direitos
              reservados.
            </p>
          </div>

          <div className="le-rod-listas">

            {/* As duas páginas existem no próprio site desde 12/out/2026, então os
                links são sempre válidos e a condicional que existia aqui saiu com
                eles. As constantes continuam vindo de `lib/consentimento.ts`, que é
                a mesma fonte da caixa de aceite: se um dia os documentos passarem
                a morar no domínio da Abril, muda-se num lugar só. */}
            <div className="le-rod-lista">
              <div className="le-rod-lista-t">Políticas</div>
              <a href={URL_TERMOS}>Termos de uso</a>
              <a href={URL_POLITICA}>Privacidade · LGPD</a>
            </div>

            <div className="le-rod-lista">
              <div className="le-rod-lista-t">Contato</div>
              <a href={contato.whatsapp} target="_blank" rel="noopener noreferrer">
                Suporte no WhatsApp
              </a>
              {/* "Encarregado" e não "DPO", e o endereço é `contato@blocktrends.com.br`
                  e não o antigo `dpo@qr.capital`: é o canal acordado com a Abril na
                  revisão da Política, uma caixa compartilhada entre destinatários das
                  duas casas, com encaminhamento para o `dpo@abril.com.br`. O termo
                  segue o dos documentos, que é o da LGPD. */}
              <a href={`mailto:${contato.dpoEmail}`}>Encarregado · {contato.dpoEmail}</a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}

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

/**
 * Os links institucionais apontam para a LP DE VENDAS, que é onde essas âncoras existem.
 *
 * DECISÃO QUE VALE CONFERIR: a pré-lista existe porque as inscrições ainda não abriram, e estes
 * links levam quem está aqui para a página que tem preço e botão de compra. Fazia sentido no
 * rodapé de lá, onde a pessoa já está na oferta. Aqui é uma escolha, não uma consequência.
 *
 * `false` desliga a coluna inteira sem mexer em mais nada.
 */
const MOSTRAR_INSTITUCIONAL = true;

const INSTITUCIONAL = [
  { rotulo: "Professores", href: "/#docentes" },
  { rotulo: "Formação", href: "/#curriculo" },
  { rotulo: "Dúvidas", href: "/#faq" },
];

export default function Rodape() {
  return (
    <footer className="le-rodape">
      {/* ---- faixa vinho: lockup e redes ---- */}
      <div className="le-rod-marca">
        <div className="le-rod-dentro">
          {/* O lockup do rodapé é o vertical, com as réguas, e não o horizontal do
              topo: é o mesmo par que a LP de vendas usa, assinatura horizontal na
              topbar e empilhada no rodapé. As compensações de tracking são as que
              o admin documentou, e sem elas o "ESTRATÉGIA" termina 0,26em depois
              do A e as réguas fecham fora do alinhamento dele. */}
          <a className="le-rod-lock" href="#form-lista-de-espera">
            <b className="le-rod-lock-n">ESTRATÉGIA</b>
            <span className="le-rod-lock-i">
              <i aria-hidden="true" />
              <span>INTERNACIONAL</span>
              <i aria-hidden="true" />
            </span>
          </a>

          {REDES.length > 0 && (
            <div className="le-rod-redes">
              <span className="le-rod-siga">Siga</span>
              {REDES.map((r) => (
                <a key={r.nome} href={r.href} aria-label={r.nome} target="_blank" rel="noopener noreferrer">
                  {r.svg}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---- faixa preta: marca, descrição e colunas ---- */}
      <div className="le-rod-corpo">
        <div className="le-rod-dentro le-rod-colunas">
          <div className="le-rod-sobre">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca com
                largura fixa: o next/image rasterizaria o vetor. */}
            <img src="/lp/grupo_abril.svg" alt="Grupo Abril" width={150} />
            <p>
              Formação em dolarização de patrimônio e investimento internacional. BlockTrends, com
              chancela institucional da VEJA Negócios.
            </p>
          </div>

          <div className="le-rod-listas">
            {MOSTRAR_INSTITUCIONAL && (
              <div className="le-rod-lista">
                <div className="le-rod-lista-t">Institucional</div>
                {INSTITUCIONAL.map((l) => (
                  <a key={l.href} href={l.href}>
                    {l.rotulo}
                  </a>
                ))}
              </div>
            )}

            {/* AS POLÍTICAS SÃO CONDICIONAIS, e no `body.html` não são: lá as duas
                são `href="#"`. Mesma regra do aceite do formulário, e pelo mesmo
                motivo: numa página que coleta dado pessoal, um link de política que
                não abre é pior que o nome sem link, porque promete o documento que
                justifica a coleta. Preencher as duas variáveis de ambiente liga os
                dois links aqui e a caixa de aceite lá em cima de uma vez. */}
            <div className="le-rod-lista">
              <div className="le-rod-lista-t">Políticas</div>
              {URL_TERMOS ? (
                <a href={URL_TERMOS} target="_blank" rel="noopener noreferrer">
                  Termos de uso
                </a>
              ) : (
                <span className="le-rod-morto">Termos de uso</span>
              )}
              {URL_POLITICA ? (
                <a href={URL_POLITICA} target="_blank" rel="noopener noreferrer">
                  Privacidade · LGPD
                </a>
              ) : (
                <span className="le-rod-morto">Privacidade · LGPD</span>
              )}
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

      {/* ---- faixa preta: crédito ---- */}
      <div className="le-rod-credito">
        <div className="le-rod-dentro">
          <span>Abril Comunicações S.A. · CNPJ 44.597.052/0001-62 · Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}

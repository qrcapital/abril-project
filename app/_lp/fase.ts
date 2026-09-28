/**
 * Em que fase o lançamento está.
 *
 * ┌─ O QUE ESTA CONSTANTE GOVERNA ────────────────────────────────────────────────────────────────┐
 * │ O que a RAIZ do domínio serve. Enquanto as inscrições não abrem, `blocktrends.abril.com.br`   │
 * │ é a pré-lista; depois, passa a ser a página do curso. As duas páginas existem o tempo todo em │
 * │ endereços próprios (`/lista-de-espera` e `/curso`), então a virada não tira nada do ar, só    │
 * │ troca quem atende na porta da frente.                                                          │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * POR QUE ISSO IMPORTA: o domínio ficou público antes das vendas abrirem. Com a página do curso na
 * raiz, quem digitasse o endereço, ou chegasse por qualquer peça da Abril, caía numa tela com preço
 * e botão de compra de um curso que ainda não está à venda. A pré-lista na raiz resolve isso e
 * ainda permite divulgar o endereço limpo, sem barra e sem caminho para ditar em vídeo.
 *
 * PARA ABRIR AS VENDAS: troque para `true`. Um commit, uma linha. A raiz passa a servir o curso, a
 * pré-lista continua respondendo em `/lista-de-espera` para quem tiver o link antigo, e o
 * `canonical` de cada página acompanha sozinho.
 *
 * Não é automático pela data da live de propósito: a live é em 13/10 e a abertura das inscrições é
 * outra decisão, comercial, que pode vir antes ou depois dela.
 */
export const VENDAS_ABERTAS = false;

/** O endereço canônico de cada página, que muda com a fase. */
export const URL_CURSO = VENDAS_ABERTAS ? "/" : "/curso";
export const URL_PRE_LISTA = VENDAS_ABERTAS ? "/lista-de-espera" : "/";

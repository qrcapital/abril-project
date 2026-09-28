import type { Metadata } from "next";

import LpVendas from "@/app/_lp/LpVendas";
import { metadataCurso } from "@/app/_lp/metadata-curso";
import { VENDAS_ABERTAS } from "@/app/_lp/fase";
import Tela from "@/app/_pre-lista/Tela";
import Formulario from "@/app/_pre-lista/Formulario";
import { metadataPreLista } from "@/app/_pre-lista/metadata";

/**
 * A porta da frente do domínio.
 *
 * ┌─ POR QUE A RAIZ NÃO É A PÁGINA DO CURSO ──────────────────────────────────────────────────────┐
 * │ Porque `blocktrends.abril.com.br` ficou público em 13/out/2026, antes de as inscrições        │
 * │ abrirem. Com o curso na raiz, quem digitasse o endereço, ou chegasse por qualquer peça da      │
 * │ Abril, caía numa tela com preço e botão de compra de um produto que ainda não estava à venda.  │
 * │ Até a abertura, então, a raiz é a pré-lista, e é o endereço limpo que vai nos anúncios.        │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * A VIRADA É UMA LINHA: `VENDAS_ABERTAS` em `app/_lp/fase.ts`. Ela troca a página E o `canonical`
 * das duas, porque os metadados saem do mesmo lugar. Nenhum endereço sai do ar na troca: a
 * pré-lista continua em `/lista-de-espera` e o curso em `/curso`, os dois em todas as fases.
 *
 * `revalidate` acompanha a pré-lista porque ela fala de uma live com data marcada e os textos
 * mudam sozinhos quando ela passa. Ver `app/_pre-lista/live.ts`.
 */
export const revalidate = 1800;

export const metadata: Metadata = VENDAS_ABERTAS ? metadataCurso : metadataPreLista;

export default function Raiz() {
  if (VENDAS_ABERTAS) return <LpVendas />;
  return (
    <Tela>
      <Formulario />
    </Tela>
  );
}

import { redirect } from "next/navigation";

import { VENDAS_ABERTAS } from "@/app/_lp/fase";
import Tela from "@/app/_pre-lista/Tela";
import Formulario from "@/app/_pre-lista/Formulario";
import { metadataPreLista } from "@/app/_pre-lista/metadata";

/**
 * O endereço original da pré-lista, que continua valendo.
 *
 * Ele foi divulgado e está em links, e link divulgado não pode virar 404 porque a arquitetura do
 * site mudou. O que ele faz depende da fase: enquanto a pré-lista mora na raiz, este endereço
 * redireciona para lá, para não existirem duas páginas idênticas disputando indexação; depois da
 * abertura das inscrições, quando a raiz vira o curso, é aqui que a pré-lista volta a ser servida.
 */
export const metadata = metadataPreLista;
export const revalidate = 1800;

export default function ListaDeEspera() {
  if (!VENDAS_ABERTAS) redirect("/");
  return (
    <Tela>
      <Formulario />
    </Tela>
  );
}

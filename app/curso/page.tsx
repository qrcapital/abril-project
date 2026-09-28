import type { Metadata } from "next";

import LpVendas from "@/app/_lp/LpVendas";
import { metadataCurso } from "@/app/_lp/metadata-curso";

/**
 * A página do curso.
 *
 * Este endereço existe em TODAS as fases do lançamento, e é essa a razão de ele existir: link
 * divulgado não pode parar de funcionar quando a raiz troca de dono. Antes da abertura das
 * inscrições é aqui que a página vive; depois, a raiz passa a servi-la também, e as duas apontam
 * para o mesmo `canonical`. Ver `app/_lp/fase.ts`.
 */
export const metadata: Metadata = metadataCurso;

export default function Curso() {
  return <LpVendas />;
}

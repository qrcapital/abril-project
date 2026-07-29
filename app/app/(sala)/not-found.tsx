import Link from "next/link";

import { BOTAO, CORPO, Painel } from "@/app/app/_ui/feedback";

/**
 * 404 dentro da área, com o chrome em volta. Cobre os dois casos medidos na auditoria: a
 * aula que não existe (`/app/modulo/9/aula/99`, que chama `notFound()`) e a URL solta
 * (`/app/naoexiste`, que chega aqui pelo catch-all `[...resto]`).
 */
export default function NaoEncontrado() {
  return (
    <Painel titulo="Essa página não existe">
      <p style={CORPO}>
        O endereço pode estar errado, ou a aula que você procurava mudou de lugar. O
        currículo inteiro está na sua página inicial.
      </p>
      <Link href="/app" style={{ ...BOTAO, textDecoration: "none", display: "inline-block" }}>
        Voltar para o início
      </Link>
    </Painel>
  );
}

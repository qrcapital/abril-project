"use client";

import { useState } from "react";

/**
 * A régua de 0 a 10 embaixo do certificado. Só marca a nota na tela: gravar a resposta é pendência
 * aberta (`PENDENCIAS-LP.md`, "O NPS do certificado não grava nada"), e não muda com o redesenho.
 */
export default function Nps() {
  const [nota, setNota] = useState<number | null>(null);
  return (
    <div className="cf-nps">
      <b>De 0 a 10, o quanto você recomendaria esta formação?</b>
      <p>Sua avaliação nos ajuda a preparar as próximas turmas.</p>
      <div className="cf-nps-notas" role="group" aria-label="Nota de 0 a 10">
        {Array.from({ length: 11 }, (_, i) => (
          <button key={i} type="button" aria-pressed={nota === i} onClick={() => setNota(i)}>
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}

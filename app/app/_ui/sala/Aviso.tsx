import type { ModuloCalendario } from "@/lib/calendario";
import { rotuloModulo } from "@/lib/curso";
import { dataLonga } from "@/lib/liberacao";

/**
 * O estado "ainda não abriu" de um módulo, com o motivo por extenso. Usado pela página do módulo
 * e pelo notebook: nos dois a tela aparece inteira, com a data, em vez de devolver o aluno para a
 * home. Bounce sem motivo é o pior tipo de bloqueio (ver `HomeClient`).
 *
 * `cal` nulo (sem calendário) cai no "em breve": sem âncora de matrícula não há data honesta.
 */
export default function AvisoTravado({ cal, oque = "Este módulo" }: { cal: ModuloCalendario | undefined; oque?: string }) {
  const rotulo = cal ? rotuloModulo(cal.ord) : "O módulo";
  const texto = cal?.abreEm
    ? `${oque} abre em ${dataLonga(cal.abreEm)}. Até lá, as aulas aparecem só pelo título; o que você já abriu continua disponível.`
    : cal?.motivo === "apos_modulo" && cal.dependeDe !== null
      ? `${oque} abre quando você concluir todas as aulas do ${rotuloModulo(cal.dependeDe)}. O que você já abriu continua disponível.`
      : `${oque} está em preparação e ainda não tem data de abertura.`;
  return (
    <div className="sl-aviso" role="status">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7e6836" strokeWidth="1.8" aria-hidden="true">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      <div>
        <h2>{rotulo} ainda não abriu</h2>
        <p>{texto}</p>
      </div>
    </div>
  );
}

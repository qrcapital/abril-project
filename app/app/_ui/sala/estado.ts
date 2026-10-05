import type { ModuloCalendario } from "@/lib/calendario";
import { rotuloModulo } from "@/lib/curso";

// A leitura de um módulo do calendário na língua da tela. Uma função só para a trilha e a página
// do módulo (que é também a sala de aula): se cada tela escrevesse o "Libera em" do seu jeito, a trilha
// diria uma coisa e o cadeado da aula outra.

export type EstadoModulo = {
  /** Classe de estado da trilha (`is-feito`, `is-atual`, `is-aberto`, `is-travado`). */
  classe: "is-feito" | "is-atual" | "is-aberto" | "is-travado";
  /** Frase curta: "Concluído", "2 de 4 aulas", "Libera em 13/10", "Após o Módulo I", "Em breve". */
  texto: string;
};

/** Por que está fechado, em uma frase curta. Só faz sentido para módulo fechado. */
export function motivoDaTrava(m: ModuloCalendario): string {
  if (m.abreEmTexto) return `Libera em ${m.abreEmTexto}`;
  if (m.motivo === "apos_modulo" && m.dependeDe !== null) return `Após o ${rotuloModulo(m.dependeDe)}`;
  return "Em breve";
}

export function estadoDoModulo(m: ModuloCalendario): EstadoModulo {
  if (!m.aberto) return { classe: "is-travado", texto: motivoDaTrava(m) };
  if (m.concluido) return { classe: "is-feito", texto: "Concluído" };
  const aulas = `${m.concluidas} de ${m.aulas} ${m.aulas === 1 ? "aula" : "aulas"}`;
  if (m.atual) return { classe: "is-atual", texto: aulas };
  return { classe: "is-aberto", texto: m.concluidas > 0 ? aulas : "Aberto" };
}

/**
 * Para onde leva o módulo: a página dele, com o teatro, a playlist e o notebook. Vale para todos os
 * módulos, inclusive o Módulo I (ord 0); o antigo "Comece por aqui" (`/app/comece`) virou redirect
 * para `/app/modulo/0` em 05/out/2026, quando o Módulo 0 de boas-vindas deixou de existir.
 */
export const hrefDoModulo = (ord: number) => `/app/modulo/${ord}`;

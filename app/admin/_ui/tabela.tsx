import type { ReactNode } from "react";

import type { EstadoAcesso } from "@/lib/matricula-estado";

/**
 * Peças de tabela do admin (PLANO-ADMIN §3, "estados de tabela: padrões reutilizáveis").
 *
 * Extraídas quando a segunda tabela apareceu, não antes. O motivo de existirem é o mesmo que levou
 * `app/app/_ui/feedback.tsx` a existir na área do aluno: sem um lugar único, a terceira tabela
 * inventa a própria borda, o próprio cinza de cabeçalho e o próprio jeito de dizer "vazio", e aí a
 * correção de uma não alcança as outras.
 */

/** Envelope da tabela. O `overflow-x-auto` é obrigatório: e-mail é longo e não pode empurrar a
 *  página inteira para o lado. */
export function Quadro({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-areia bg-white">{children}</div>
  );
}

/** Cabeçalho a partir dos rótulos. String vazia vira coluna sem título (a de ações). */
export function Cabecalho({ colunas }: { colunas: string[] }) {
  return (
    <thead>
      <tr className="border-b border-bege">
        {colunas.map((c, i) => (
          <th
            key={`${c}-${i}`}
            className="px-4 py-2.5 text-[11px] font-semibold tracking-[0.1em] text-pedra uppercase"
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function Linha({ children }: { children: ReactNode }) {
  return <tr className="border-b border-bege last:border-0">{children}</tr>;
}

/**
 * Selo de estado. Os tons saem do `DESIGN.md` §2, e o verde é o do fundo CLARO (`#1B7A50`,
 * 4,89:1): o miolo do admin é claro, e usar o par do escuro deixaria o texto ilegível. Essa é a
 * regra do Pedro de 29/jul, de que cor semântica tem um valor por fundo.
 */
const TONS = {
  neutro: "bg-bege text-medio",
  ok: "bg-sucesso/10 text-sucesso",
  atencao: "bg-[#F7E3BE] text-[#7A4E06]",
  ruim: "bg-falha/10 text-falha",
  destaque: "bg-gold-soft text-gold-dark",
  forte: "bg-acento text-gold-lit",
} as const;

export function Selo({
  tom = "neutro",
  children,
}: {
  tom?: keyof typeof TONS;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${TONS[tom]}`}
    >
      {children}
    </span>
  );
}

/** Estado vazio. Existe como peça para ninguém entregar tabela que abre em branco sem explicação. */
export function Vazio({ children }: { children: ReactNode }) {
  return <p className="text-[13px] text-medio">{children}</p>;
}

/**
 * Data e hora curtas em pt-BR, com travessão para nulo. Subiu do `alunos/[id]` para cá quando a
 * segunda tela precisou dela (o log de e-mails), pela mesma regra que trouxe as peças de tabela:
 * duas cópias do mesmo formato divergem sem ninguém notar, e aí a mesma data aparece de dois jeitos
 * em telas vizinhas.
 */
export const dataHora = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

/**
 * Qual tom cada estado de acesso recebe. Mora aqui, junto do `Selo`, porque quem é dono da tabela
 * de tons é quem deve decidir o mapeamento: as duas telas de aluno precisavam do mesmo mapa, e a
 * primeira versão o duplicou nos dois arquivos.
 *
 * `expirada` é `atencao` e não `ruim` de propósito: prazo que venceu é o ciclo normal do produto,
 * enquanto revogada é reembolso ou chargeback, que é o caso que alguém precisa olhar.
 */
export const TOM_ESTADO: Record<EstadoAcesso, keyof typeof TONS> = {
  ativa: "ok",
  expirada: "atencao",
  revogada: "ruim",
  ausente: "neutro",
};

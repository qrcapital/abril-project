import { docentes } from "@/lib/docentes";

/**
 * A assinatura do docente: retrato pequeno, "Com Rodolfo Bastos" e a credencial numa linha abaixo,
 * como a assinatura de uma matéria. Sem docente, não desenha nada.
 *
 * REDESENHADA EM 07/out/2026, a pedido do dono. Até aqui era um cartão por docente (retrato de 48px,
 * nome em negrito, credencial), empilhados quando o módulo tinha dois, e a cabeça da aula 3 mostrava
 * o Felippe e o Rodolfo um sobre o outro numa aula que é só do Rodolfo. Duas mudanças:
 *
 * 1. quem chama passa o docente DA AULA quando o notebook sabe (`Notebook.docentePorAula`), e só cai
 *    no campo do módulo quando não sabe;
 * 2. a peça virou uma linha só de texto, sem caixa. Com mais de um docente, os retratos se
 *    sobrepõem e os nomes vêm juntos ("Com A e B"), sem as credenciais, que somadas virariam
 *    parágrafo.
 *
 * Sem foto conhecida (o Felippe ainda não tem retrato na campanha), as iniciais num círculo de
 * filete, na mesma medida do retrato: uma letra solta num disco cheio parecia avatar de sistema.
 *
 * `tamanho="p"` é a versão da trilha: retrato menor, sem prefixo e sem credencial.
 */
export default function CartaoDocente({
  nome,
  prefixo = "Com",
  credencial = true,
  tamanho = "m",
}: {
  nome: string | null | undefined;
  prefixo?: string;
  credencial?: boolean;
  tamanho?: "m" | "p";
}) {
  const lista = docentes(nome);
  if (!lista.length) return null;
  const nomes = juntar(lista.map((d) => d.nome));
  const cred = credencial && lista.length === 1 ? lista[0].credencial : null;
  const px = tamanho === "p" ? 22 : 36;

  return (
    <span className={`sl-assina${tamanho === "p" ? " is-p" : ""}`}>
      <span className="sl-assina-rostos" aria-hidden="true">
        {lista.map((d) =>
          d.foto ? (
            // Retrato de medida fixa num círculo: o next/image acrescentaria wrapper sem mudar nada.
            // eslint-disable-next-line @next/next/no-img-element
            <img key={d.nome} src={d.foto} alt="" width={px} height={px} />
          ) : (
            <span key={d.nome} className="sl-assina-mono">
              {iniciais(d.nome)}
            </span>
          ),
        )}
      </span>
      <span className="sl-assina-texto">
        <span className="sl-assina-nome">
          {prefixo && <span className="sl-assina-pre">{prefixo} </span>}
          {nomes}
        </span>
        {cred && <span className="sl-assina-cred">{cred}</span>}
      </span>
    </span>
  );
}

/** "A", "A e B", "A, B e C". */
function juntar(nomes: string[]): string {
  if (nomes.length < 2) return nomes[0] ?? "";
  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}

/** "Felippe Hermes" → "FH"; um nome só → a primeira letra. */
function iniciais(nome: string): string {
  const partes = nome.split(" ").filter(Boolean);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

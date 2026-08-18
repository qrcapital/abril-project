/**
 * Tradução do rastro do admin (`admin_audit`) para leitura humana.
 *
 * Puro e sem IO, como manda o `AGENTS.md`: a tela é servidor e o check roda em node puro.
 *
 * **Por que existe uma camada de texto, e não um `JSON.stringify` na tela:** o `detalhe` é jsonb com
 * um formato por ação, e é justamente ele que responde a pergunta da auditoria. `{"nome":["João
 * Testinho","João Testinho Neto"]}` cru obriga quem lê a decifrar qual é o antes e qual é o depois.
 */

/**
 * Nome de cada ação, em verbo e no passado: a tela é uma lista do que já aconteceu.
 *
 * **Curtos porque o selo não pode quebrar em três linhas.** A primeira versão dizia "Marcou módulo
 * como concluído" e a coluna virava um parágrafo, com a linha inteira alta por causa dele. O resto da
 * frase já está nas outras colunas: quem, sobre quem, e qual módulo.
 */
export const ROTULO_ACAO: Record<string, string> = {
  "papel.promover": "Promoveu a admin",
  "papel.revogar": "Revogou admin",
  "prova.segunda-chamada": "Liberou 2ª chamada",
  "aluno.dados": "Editou dados",
  "aluno.progresso-marcar": "Marcou módulo",
  "aluno.progresso-limpar": "Apagou progresso",
  "aluno.politica": "Trocou liberação",
  "liberacao.criar": "Criou política",
  "liberacao.salvar": "Editou política",
  "liberacao.ativar": "Ativou política",
  "liberacao.apagar": "Apagou política",
  "relatorio.exportar": "Exportou relatório",
  "questao.criar": "Criou questão",
  "questao.salvar": "Editou questão",
  "questao.apagar": "Apagou questão",
  "conteudo.modulo": "Editou módulo",
  "conteudo.aula": "Editou aula",
  "conteudo.aula-criar": "Criou aula",
  "conteudo.aula-apagar": "Apagou aula",
  "conteudo.mover": "Moveu aula",
  "conteudo.material": "Editou material",
  "conteudo.material-criar": "Criou material",
  "conteudo.material-apagar": "Apagou material",
};

/**
 * Ação sem rótulo aparece com o código cru, e NÃO some da tela nem vira "ação desconhecida".
 *
 * Isso é o que mantém a auditoria honesta enquanto ela cresce: a próxima rota que chamar `auditar`
 * com um nome novo vai aparecer aqui no mesmo dia, feia mas visível. Uma tela que só mostra o que
 * conhece esconde exatamente a ação que ninguém previu.
 */
export const rotularAcao = (acao: string): string => ROTULO_ACAO[acao] ?? acao;

const aspas = (v: unknown): string => {
  const s = String(v ?? "").trim();
  return s === "" ? "vazio" : `“${s}”`;
};

/** É um par [antes, depois] gravado pelo `diferencas` de `lib/aluno-dados.ts`? */
const ehPar = (v: unknown): v is [unknown, unknown] => Array.isArray(v) && v.length === 2;

/**
 * As linhas de detalhe de um registro. Uma por informação, para a tela quebrar como quiser.
 *
 * A ordem de leitura importa: quem abre a auditoria já sabe QUEM e QUANDO pelas colunas, e vem aqui
 * atrás do que exatamente mudou.
 */
export function descrever(acao: string, detalhe: Record<string, unknown> | null): string[] {
  const d = detalhe ?? {};

  if (acao === "aluno.dados") {
    // Cada campo alterado vira "campo: antes → depois". A seta é o que dispensa explicar qual é
    // qual, e nenhum outro registro precisa desse formato.
    return Object.entries(d)
      .filter(([, v]) => ehPar(v))
      .map(([campo, v]) => {
        const [antes, depois] = v as [unknown, unknown];
        return `${campo}: ${aspas(antes)} → ${aspas(depois)}`;
      });
  }

  if (acao.startsWith("aluno.progresso")) {
    const n = Number(d.aulas ?? 0);
    return [
      `Módulo ${d.ord} · ${String(d.modulo ?? "")}`,
      n === 1 ? "1 aula" : `${n} aulas`,
    ];
  }

  if (acao === "aluno.politica") {
    // O mesmo "antes → depois" dos dados: a pergunta da auditoria é o que valia quando o aluno
    // reclamou, e id de política não responde isso — os nomes já vêm gravados no detalhe.
    const v = d.politica;
    return ehPar(v) ? [`${aspas(v[0])} → ${aspas(v[1])}`] : [];
  }

  if (acao === "prova.segunda-chamada") {
    const nota = d.nota_anterior;
    return [
      `Tentativa ${d.attempt}`,
      // A nota que reprovou é o "por quê" deste registro. Sem ela, "liberou 2ª chamada" não explica
      // nada seis meses depois.
      nota === null || nota === undefined
        ? "sem nota anterior registrada"
        : `reprovou com ${nota}%`,
    ];
  }

  if (acao.startsWith("papel.")) {
    const linhas = [String(d.email ?? "")].filter(Boolean);
    if (d.era_mestre === true) linhas.push("era admin mestre");
    return linhas;
  }

  if (acao.startsWith("questao.")) {
    // O começo do enunciado identifica a questão melhor que qualquer id, e a letra correta é
    // o gabarito — a razão de esta rota ser auditada.
    const linhas = d.enunciado ? [aspas(d.enunciado)] : [];
    if (d.correta) linhas.push(`correta: ${d.correta}`);
    if (d.ativo === false) linhas.push("desativada");
    return linhas;
  }

  if (acao.startsWith("conteudo.")) {
    return [
      d.titulo ? aspas(d.titulo) : "",
      d.direcao ? `para ${d.direcao === "subir" ? "cima" : "baixo"}` : "",
      d.gate === false ? "fora do gate da prova" : "",
      d.arquivo ? String(d.arquivo) : "",
    ].filter(Boolean);
  }

  // Ação nova, formato desconhecido: mostra os pares como estão. Feio de propósito, e melhor que
  // omitir, pelo mesmo motivo do `rotularAcao`.
  return Object.entries(d).map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
}

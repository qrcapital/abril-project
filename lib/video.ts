// De onde sai o vídeo de uma aula. Puro e sem import, para rodar no `npm run check`
// (`scripts/video-check.mts`): o valor vem de `lessons.panda_video_id`, que o admin cola à mão
// em `/admin/conteudo`, e vai parar no `src` de um iframe na tela de todo aluno. Fronteira de
// confiança, como o `ARQUIVO_OK` dos materiais: o que não for um id de vídeo ou um embed do
// Panda não entra no iframe.

/**
 * A biblioteca do Panda da conta da casa. É a mesma do vídeo de vendas da LP
 * (`app/_lp/body.html`, `player-vz-ec506377-150`): uma conta só, então o host do player é o
 * mesmo para as aulas. Se as aulas forem para outra biblioteca, o caminho é colar a URL de
 * embed inteira no admin, que é aceita abaixo sem passar por esta constante.
 */
export const PANDA_BIBLIOTECA = "ec506377-150";

/** Vídeo que toca enquanto a aula não tem id no banco. Homolog inteira vive dele hoje. */
export const VIDEO_EXEMPLO = "/app/video/aula-exemplo.mp4";

export type FonteDoVideo =
  | { tipo: "panda"; src: string; id: string }
  | { tipo: "exemplo"; src: string };

/** Id de vídeo do Panda: UUID na prática. Aceita qualquer sequência de letra, número e hífen. */
const ID = /^[0-9a-z][0-9a-z-]{7,63}$/i;

/** Host de player do Panda: `player-vz-<biblioteca>.tv.pandavideo.com.br`. */
const HOST_PANDA = /^player-vz-[0-9a-z-]+\.tv\.pandavideo\.com\.br$/i;

export const embedPanda = (id: string, biblioteca = PANDA_BIBLIOTECA) =>
  `https://player-vz-${biblioteca}.tv.pandavideo.com.br/embed/?v=${encodeURIComponent(id)}`;

/**
 * O player de uma aula a partir do que o admin gravou em `panda_video_id`.
 *
 * Três formas aceitas, porque o painel do Panda oferece as três e o campo do admin é texto livre:
 * - o id puro (`39e96e48-7691-...`), que monta o embed da biblioteca da casa;
 * - a URL de embed inteira (`https://player-vz-.../embed/?v=...`), usada como veio;
 * - qualquer URL do Panda com `?v=<id>`, da qual só o id é aproveitado.
 *
 * Qualquer outra coisa cai no vídeo de exemplo, e não num iframe vazio: aula sem vídeo tocando
 * parece defeito, e o exemplo já é o que homolog mostra hoje.
 */
export function fonteDoVideo(valor: string | null | undefined): FonteDoVideo {
  const v = (valor ?? "").trim();
  if (!v) return { tipo: "exemplo", src: VIDEO_EXEMPLO };

  if (ID.test(v)) return { tipo: "panda", src: embedPanda(v), id: v };

  let url: URL;
  try {
    url = new URL(v);
  } catch {
    return { tipo: "exemplo", src: VIDEO_EXEMPLO };
  }
  const id = url.searchParams.get("v") ?? "";
  if (url.protocol !== "https:" || !ID.test(id)) return { tipo: "exemplo", src: VIDEO_EXEMPLO };

  // Embed colado inteiro: respeita a biblioteca que veio nele, que pode não ser a da casa.
  if (HOST_PANDA.test(url.hostname) && url.pathname.startsWith("/embed"))
    return { tipo: "panda", src: embedPanda(id, url.hostname.slice(10, -21)), id };

  // Outra URL do Panda (painel, link de compartilhar): só o id interessa.
  if (/(^|\.)pandavideo\.com(\.br)?$/i.test(url.hostname))
    return { tipo: "panda", src: embedPanda(id), id };

  return { tipo: "exemplo", src: VIDEO_EXEMPLO };
}

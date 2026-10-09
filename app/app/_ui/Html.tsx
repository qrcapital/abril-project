"use client";

import { useMemo, type CSSProperties, type Ref } from "react";

/**
 * Um `<div>` com HTML injetado que NÃO é reescrito quando o componente pai re-renderiza.
 *
 * ┌─ O BUG QUE ISTO RESOLVE (09/out/2026) ────────────────────────────────────────────────────────┐
 * │ No React 19, `dangerouslySetInnerHTML={{ __html: html }}` cria um objeto novo a cada render, │
 * │ e o React compara esse OBJETO, não o texto: objeto novo, `innerHTML` reescrito. As telas de   │
 * │ acesso guardam estado (a mensagem de erro) e injetam o formulário como HTML; qualquer         │
 * │ `setErro` refazia o formulário inteiro. Na tela de criar senha, o primeiro erro de validação  │
 * │ apagava as duas senhas digitadas e sumia com a lista de exigências (que é pendurada no DOM    │
 * │ depois), e a pessoa ficava sem saber o que a senha precisava ter. Foi o "fluxo de senha       │
 * │ quebrado" da compra de teste. Com o objeto memorizado, o React só reescreve se o HTML mudar.  │
 * └───────────────────────────────────────────────────────────────────────────────────────────────┘
 */
export default function Html({
  html,
  ref,
  style,
  className,
}: {
  html: string;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  className?: string;
}) {
  const markup = useMemo(() => ({ __html: html }), [html]);
  return <div ref={ref} style={style} className={className} dangerouslySetInnerHTML={markup} />;
}

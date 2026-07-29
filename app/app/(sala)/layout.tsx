import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getUsuario } from "@/lib/usuario";
import { preencherUsuario } from "@/lib/usuario-template";
import AreaChrome from "./AreaChrome";

// Telas autenticadas da área do aluno: envolvidas pelo chrome (topbar + footer).
// O login (/app/login) fica fora deste route group, sem chrome.

const uiDir = join(process.cwd(), "app", "app", "_ui");
const top = readFileSync(join(uiDir, "chrome-top.html"), "utf8");
const foot = readFileSync(join(uiDir, "chrome-foot.html"), "utf8");

/**
 * O nome do aluno na topbar é preenchido AQUI, no servidor, e não no cliente: o chrome
 * aparece em toda tela da área, então preenchê-lo uma vez cobre todas.
 *
 * Isto torna dinâmicas as telas do grupo, incluindo a conta e o certificado, que eram
 * estáticas. É o custo aceito na tarefa 5: uma chamada de autenticação a mais nas duas telas
 * menos visitadas do produto, contra todo aluno lendo "Pedro" antes do próprio nome. O
 * `getUsuario` é cacheado por requisição, então layout e tela dividem a mesma chamada.
 */
export default async function SalaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getUsuario();
  return (
    <AreaChrome top={preencherUsuario(top, user)} foot={foot}>
      {children}
    </AreaChrome>
  );
}

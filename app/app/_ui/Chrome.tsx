import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getUsuario } from "@/lib/usuario";
import { preencherUsuario } from "@/lib/usuario-template";
import AreaChrome from "@/app/app/(sala)/AreaChrome";

// Topbar + rodapé das telas autenticadas, com o nome do aluno já preenchido no servidor.
//
// Vive fora dos layouts porque **dois** grupos de rota o usam com guardas diferentes: o
// `(sala)`, que exige matrícula ativa, e o `(certificado)`, que deixa passar quem concluiu o
// curso mesmo com o acesso encerrado. O que muda entre eles é a guarda, não o chrome.

const uiDir = join(process.cwd(), "app", "app", "_ui");
const top = readFileSync(join(uiDir, "chrome-top.html"), "utf8");
const foot = readFileSync(join(uiDir, "chrome-foot.html"), "utf8");

export default async function Chrome({ children }: { children: React.ReactNode }) {
  const user = await getUsuario();
  return (
    <AreaChrome top={preencherUsuario(top, user)} foot={foot}>
      {children}
    </AreaChrome>
  );
}

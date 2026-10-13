import { readFileSync } from "node:fs";
import { join } from "node:path";

import { papelAtual } from "@/lib/admin";
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

/**
 * O caminho de volta ao painel, para quem tem um (13/out/2026). O observador entra no curso pelo
 * "Ver o curso" da sidebar e precisa voltar aos indicadores sem digitar endereço; o admin ganha o
 * mesmo atalho para o `/admin`. Aluno não vê nada: o HTML sai idêntico ao de antes.
 *
 * Entra no HTML no servidor, como o nome do aluno, para não piscar na primeira pintura. Dois
 * lugares, como o Glossário: a barra (desktop) e o menu da conta, que é onde a barra vai parar
 * abaixo de 920px (`menu-so-celular`). Os rótulos e endereços são constantes nossas, sem dado de
 * usuário, então não há o que escapar.
 */
function comAtalhoDoPainel(html: string, papel: string): string {
  const atalho =
    papel === "observador"
      ? { href: "/admin/indicadores", rotulo: "Indicadores" }
      : papel === "admin"
        ? { href: "/admin", rotulo: "Painel" }
        : null;
  if (!atalho) return html;
  const { href, rotulo } = atalho;
  return html
    .replace(/(<nav class="topbar-nav"[\s\S]*?)(\s*<\/nav>)/, `$1\n      <a href="${href}">${rotulo}</a>$2`)
    .replace(
      /(<div id="account-menu"[^>]*>[\s\S]*?)(\s*<a [^>]*>Minha conta<\/a>)/,
      `$1\n        <a href="${href}" class="menu-so-celular" style="display:block;padding:10px 14px;font-size:13px;color:#1a1815;border-radius:8px;cursor:pointer">${rotulo}</a>$2`,
    );
}

export default async function Chrome({ children }: { children: React.ReactNode }) {
  const [user, { papel }] = await Promise.all([getUsuario(), papelAtual()]);
  return (
    <AreaChrome top={comAtalhoDoPainel(preencherUsuario(top, user), papel)} foot={foot}>
      {children}
    </AreaChrome>
  );
}

import { readFileSync } from "node:fs";
import { join } from "node:path";
import AreaChrome from "./AreaChrome";

// Telas autenticadas da área do aluno: envolvidas pelo chrome (topbar + footer).
// O login (/app/login) fica fora deste route group, sem chrome.

const uiDir = join(process.cwd(), "app", "app", "_ui");
const top = readFileSync(join(uiDir, "chrome-top.html"), "utf8");
const foot = readFileSync(join(uiDir, "chrome-foot.html"), "utf8");

export default function SalaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AreaChrome top={top} foot={foot}>
      {children}
    </AreaChrome>
  );
}

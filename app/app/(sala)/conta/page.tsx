import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ContaClient from "./ContaClient";

export const metadata: Metadata = { title: "Minha conta" };

const html = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "screens", "conta.html"),
  "utf8"
);

export default function ContaPage() {
  return <ContaClient html={html} />;
}

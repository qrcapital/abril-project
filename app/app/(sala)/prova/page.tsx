import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ProvaClient from "./ProvaClient";

export const metadata: Metadata = { title: "Prova Final" };

const html = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "screens", "prova.html"),
  "utf8"
);

export default function ProvaPage() {
  return <ProvaClient html={html} />;
}

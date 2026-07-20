import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import AulaClient from "./AulaClient";

export const metadata: Metadata = { title: "Aula" };

const html = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "screens", "aula.html"),
  "utf8"
);

export default async function AulaPage({
  params,
}: {
  params: Promise<{ m: string; n: string }>;
}) {
  const { m, n } = await params;
  return <AulaClient html={html} m={Number(m)} n={Number(n)} />;
}

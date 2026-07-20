import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import QuizClient from "./QuizClient";

export const metadata: Metadata = { title: "Prova" };

const html = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "screens", "prova-questao.html"),
  "utf8"
);

export default async function QuestaoPage({
  params,
}: {
  params: Promise<{ q: string }>;
}) {
  const { q } = await params;
  // A página remonta a cada questão; assar a largura da barra (posição q/20) já no
  // HTML evita o "reset" visual para o valor padrão antes do JS rodar.
  const pct = Math.min(100, Math.max(5, Math.round((Number(q) / 20) * 100)));
  const pageHtml = html.replace("width:5%", `width:${pct}%`);
  return <QuizClient html={pageHtml} q={Number(q)} />;
}

import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import HomeClient from "./HomeClient";

export const metadata: Metadata = { title: "Início" };

const html = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "screens", "home.html"),
  "utf8"
);

export default function HomePage() {
  return <HomeClient html={html} />;
}

import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import LoginClient from "./LoginClient";

export const metadata: Metadata = { title: "Entrar" };

const html = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "screens", "login.html"),
  "utf8"
);

export default function LoginPage() {
  return <LoginClient html={html} />;
}

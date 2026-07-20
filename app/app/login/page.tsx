import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import LoginClient from "./LoginClient";

export const metadata: Metadata = { title: "Entrar" };

const dir = join(process.cwd(), "app", "app", "_ui", "screens");
const variants: Record<string, string> = {
  regular: readFileSync(join(dir, "login.html"), "utf8"),
  erro: readFileSync(join(dir, "login-error.html"), "utf8"),
  pendente: readFileSync(join(dir, "login-pending.html"), "utf8"),
  primeiro: readFileSync(join(dir, "login-first.html"), "utf8"),
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const { s } = await searchParams;
  return <LoginClient html={variants[s ?? "regular"] ?? variants.regular} />;
}

import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cookies } from "next/headers";
import HomeClient from "./HomeClient";
import { fillHome } from "@/lib/home-template";
import { parseConcluidas, nomeCookie } from "@/lib/progresso";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Início" };

const template = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "screens", "home.html"),
  "utf8"
);

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";
  const concluidas = parseConcluidas((await cookies()).get(nomeCookie(userId))?.value);
  return <HomeClient html={fillHome(template, concluidas)} userId={userId} />;
}

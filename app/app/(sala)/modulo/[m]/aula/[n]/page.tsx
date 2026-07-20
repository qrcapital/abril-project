import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import AulaClient from "./AulaClient";
import { acharAula } from "@/lib/curso";
import { fillAula } from "@/lib/aula-template";
import { parseConcluidas, nomeCookie } from "@/lib/progresso";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Aula" };

const template = readFileSync(
  join(process.cwd(), "app", "app", "_ui", "screens", "aula.html"),
  "utf8"
);

export default async function AulaPage({
  params,
}: {
  params: Promise<{ m: string; n: string }>;
}) {
  const { n } = await params;
  const found = acharAula(Number(n));
  if (!found) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";
  const concluidas = parseConcluidas((await cookies()).get(nomeCookie(userId))?.value);
  return (
    <AulaClient
      html={fillAula(template, found.aula, found.pos, concluidas)}
      userId={userId}
    />
  );
}
